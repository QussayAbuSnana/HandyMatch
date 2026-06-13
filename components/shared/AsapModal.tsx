"use client";

import { useState } from "react";
import { X, Zap, Loader2, Star, MapPin, Clock3, CheckCircle2, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getProfessionals, getUserProfile, getProBookings, createBooking, createNotification } from "@/lib/firestore";
import { UserProfile, WeeklyAvailability } from "@/lib/types";
import { findAsapSlot, formatSlot, formatSlotRange } from "@/lib/booking-utils";
import { Timestamp } from "firebase/firestore";

type Step = "input" | "loading" | "result" | "confirming" | "success" | "error";

interface AsapResult {
  pro: UserProfile;
  date: string;
  slot: string;
  category: string;
  summary: string;
  durationHours: number;
}

export default function AsapModal({ onClose }: { onClose: () => void }) {
  const { user, userProfile } = useAuth();
  const [step, setStep] = useState<Step>("input");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(
    (userProfile as unknown as { location?: string })?.location ?? ""
  );
  const [result, setResult] = useState<AsapResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFind = async () => {
    if (!description.trim() || !user) return;
    setStep("loading");

    try {
      const classifyRes = await fetch("/api/classify-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!classifyRes.ok) throw new Error("Could not classify the job.");
      const { category, summary, estimatedHours } = await classifyRes.json();
      const durationHours = Math.max(1, Math.round(estimatedHours ?? 1));

      const pros = await getProfessionals();

      const scored = pros
        .map((p) => {
          const pd = p as unknown as { services?: string[]; isAvailable?: boolean; rating?: number };
          const catLower = (category as string).toLowerCase();
          const services = pd.services ?? [];
          const exact = services.some((s) => s.toLowerCase() === catLower);
          const partial = services.some((s) => s.toLowerCase().includes(catLower) || catLower.includes(s.toLowerCase()));
          const relevance = exact ? 3 : partial ? 1 : 0;
          if (relevance === 0) return null;
          const score = relevance + (pd.isAvailable ? 2 : 0) + (pd.rating ?? 0) / 5;
          return { pro: p, score };
        })
        .filter(Boolean)
        .sort((a, b) => b!.score - a!.score) as { pro: UserProfile; score: number }[];

      if (scored.length === 0) {
        throw new Error(`No professionals found for "${category}". Try describing your problem differently.`);
      }

      for (const { pro } of scored.slice(0, 5)) {
        const profile = await getUserProfile(pro.uid);
        // Try to fetch bookings for conflict-aware slot picking;
        // falls back to empty array if Firestore rules deny access.
        let bookings: Awaited<ReturnType<typeof getProBookings>> = [];
        try {
          bookings = await getProBookings(pro.uid);
        } catch {
          // permission denied — proceed without conflict check
        }
        const avail = (profile as unknown as { availability?: WeeklyAvailability })?.availability;
        const asap = findAsapSlot(avail, bookings, durationHours);
        if (asap) {
          setResult({ pro, date: asap.date, slot: asap.slot, category, summary, durationHours });
          setStep("result");
          return;
        }
      }

      throw new Error("No available slots in the next 30 days for any matching professional.");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong.");
      setStep("error");
    }
  };

  const handleConfirm = async () => {
    if (!result || !user || !userProfile) return;
    setStep("confirming");
    try {
      const [h] = result.slot.split(":").map(Number);
      const scheduledAt = new Date(`${result.date}T${String(h).padStart(2, "0")}:00:00`);
      const proData = result.pro as unknown as { hourlyRate?: number };

      await createBooking({
        customerId: user.uid,
        professionalId: result.pro.uid,
        customerName: userProfile.displayName,
        professionalName: result.pro.displayName,
        service: result.category,
        status: "pending",
        scheduledAt: scheduledAt as unknown as Timestamp,
        location: location.trim() || "TBD",
        price: proData.hourlyRate ?? 0,
        notes: result.summary,
        durationHours: result.durationHours,
      });
      await createNotification(
        result.pro.uid,
        "New Booking Request!",
        `${userProfile.displayName} requested ${result.category} (ASAP).`,
        "booking_request",
        undefined
      );
      setStep("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Failed to send booking.");
      setStep("error");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long", month: "short", day: "numeric",
    });

  const proData = result?.pro as unknown as {
    rating?: number; reviewCount?: number; location?: string; hourlyRate?: number;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center p-4">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <div className="flex items-center gap-3">
            <Zap className="h-7 w-7" />
            <span className="text-2xl font-extrabold">Book ASAP</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-7 py-6">
          {/* Input */}
          {step === "input" && (
            <div className="space-y-4">
              <p className="text-lg text-slate-500">Describe your problem and we'll find the best available pro right now.</p>
              <textarea
                autoFocus
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleFind(); }}
                placeholder="e.g. My kitchen tap is leaking and needs replacing…"
                rows={4}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-lg text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              />
              <button
                onClick={handleFind}
                disabled={!description.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-xl font-bold text-white hover:bg-emerald-600 transition disabled:opacity-50"
              >
                <Zap className="h-5 w-5" /> Find Me a Pro
              </button>
            </div>
          )}

          {/* Loading */}
          {(step === "loading" || step === "confirming") && (
            <div className="flex flex-col items-center gap-4 py-10">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
              <p className="text-xl font-semibold text-slate-700">
                {step === "loading" ? "Finding the best available pro…" : "Sending booking request…"}
              </p>
              {step === "loading" && (
                <p className="text-base text-slate-400 text-center">Analyzing your problem and checking availability</p>
              )}
            </div>
          )}

          {/* Result */}
          {step === "result" && result && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-2">Best Match Found</p>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {result.pro.displayName?.[0] ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xl font-bold text-slate-900">{result.pro.displayName}</p>
                    {proData?.rating && (
                      <div className="flex items-center gap-1 text-base text-slate-500 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-slate-800">{proData.rating.toFixed(1)}</span>
                        {proData.reviewCount ? <span>({proData.reviewCount})</span> : null}
                      </div>
                    )}
                    {proData?.location && (
                      <div className="flex items-center gap-1 text-base text-slate-500 mt-1">
                        <MapPin className="h-3.5 w-3.5" />{proData.location}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-extrabold text-violet-600">${proData?.hourlyRate ?? "—"}</p>
                    <p className="text-sm text-slate-400">/hr</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-base">
                    <Clock3 className="h-4 w-4" /> Earliest Available Slot
                  </div>
                  {result.durationHours > 1 && (
                    <span className="rounded-full bg-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      {result.durationHours}h job
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xl font-extrabold text-slate-900">
                  {formatDate(result.date)} · {formatSlotRange(result.slot, result.durationHours)}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />Your Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-lg text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <button
                onClick={handleConfirm}
                disabled={!location.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-xl font-bold text-white hover:bg-emerald-600 transition disabled:opacity-50"
              >
                Confirm Booking <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Success */}
          {step === "success" && result && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">Booking Sent!</p>
              <p className="text-lg text-slate-500">
                <span className="font-semibold text-slate-700">{result.pro.displayName}</span> will confirm your{" "}
                {result.category} appointment for{" "}
                <span className="font-semibold text-slate-700">{formatDate(result.date)} at {formatSlot(result.slot)}</span>.
              </p>
              <button
                onClick={onClose}
                className="mt-2 rounded-2xl bg-emerald-500 px-8 py-3 text-lg font-bold text-white hover:bg-emerald-600 transition"
              >
                Done
              </button>
            </div>
          )}

          {/* Error */}
          {step === "error" && (
            <div className="space-y-4 py-4">
              <p className="text-lg text-red-600 bg-red-50 rounded-2xl px-5 py-4">{errorMsg}</p>
              <button
                onClick={() => { setStep("input"); setErrorMsg(""); }}
                className="w-full rounded-2xl border border-gray-200 py-3 text-lg font-semibold text-slate-700 hover:bg-gray-50 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
