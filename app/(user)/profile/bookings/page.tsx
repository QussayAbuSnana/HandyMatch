"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Clock3, CheckCircle2, XCircle, CalendarDays,
  Loader2, Star, MapPin, DollarSign, Ban,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeCustomerBookings, hasReviewed, updateBookingStatus, createNotification } from "@/lib/firestore";
import { Booking } from "@/lib/types";
import ReviewModal from "@/components/shared/ReviewModal";

type Tab = "active" | "completed" | "cancelled";

const STATUS_META: Record<string, { label: string; badge: string }> = {
  pending:     { label: "Pending",     badge: "bg-yellow-100 text-yellow-700" },
  accepted:    { label: "Accepted",    badge: "bg-blue-100 text-blue-700" },
  in_progress: { label: "In Progress", badge: "bg-blue-100 text-blue-700" },
  completed:   { label: "Completed",   badge: "bg-green-100 text-green-700" },
  cancelled:   { label: "Cancelled",   badge: "bg-red-100 text-red-700" },
};

export default function BookingsPage() {
  const { user, userProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [activeReview, setActiveReview] = useState<Booking | null>(null);
  const [tab, setTab] = useState<Tab>("active");
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeCustomerBookings(user.uid, async (data) => {
      setBookings(data);
      setLoading(false);
      const done = data.filter((b) => b.status === "completed");
      const checks = await Promise.all(
        done.map(async (b) => [b.id, await hasReviewed(b.id, user.uid)] as [string, boolean])
      );
      setReviewed(Object.fromEntries(checks));
    });
    return unsub;
  }, [user]);

  const handleCancel = async (b: Booking) => {
    if (!confirm(`Cancel your booking with ${b.professionalName}?`)) return;
    setCancelling(b.id);
    try {
      await updateBookingStatus(b.id, "cancelled");
      await createNotification(
        b.professionalId,
        "Booking Cancelled",
        `${b.customerName} cancelled their ${b.service} booking.`,
        "booking_cancelled",
        b.id
      );
    } finally {
      setCancelling(null);
    }
  };

  const formatScheduled = (b: Booking) => {
    const ts = b.scheduledAt as unknown as { seconds?: number; toDate?: () => Date };
    if (!ts) return "—";
    const d = typeof ts.toDate === "function" ? ts.toDate() : ts.seconds ? new Date(ts.seconds * 1000) : null;
    if (!d) return "—";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const active    = bookings.filter((b) => b.status === "pending" || b.status === "accepted" || b.status === "in_progress");
  const completed = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  const shown = tab === "active" ? active : tab === "completed" ? completed : cancelled;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "active",    label: "Active",    count: active.length },
    { key: "completed", label: "Completed", count: completed.length },
    { key: "cancelled", label: "Cancelled", count: cancelled.length },
  ];

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-12">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-5">
          <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        </div>

        {/* Tabs */}
        <div className="mx-auto flex max-w-7xl gap-1 px-5 pb-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-base font-semibold transition ${
                tab === t.key
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-gray-100 text-slate-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  tab === t.key ? "bg-white/25 text-white" : "bg-white text-slate-600"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          </div>
        ) : shown.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Clock3 className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <p className="text-2xl font-semibold text-slate-500">
              {tab === "active" ? "No active bookings." : tab === "completed" ? "No completed bookings yet." : "No cancelled bookings."}
            </p>
            {tab === "active" && (
              <Link href="/search" className="mt-6 inline-block rounded-2xl bg-violet-600 px-8 py-4 text-xl font-bold text-white hover:bg-violet-700 transition">
                Find Professionals
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map((b) => {
              const meta = STATUS_META[b.status] ?? STATUS_META.pending;
              const canCancel = b.status === "pending" || b.status === "accepted";
              const canReview = b.status === "completed" && reviewed[b.id] === false;
              return (
                <div key={b.id} className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    {/* Left */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-400 text-white text-2xl font-bold">
                        {b.professionalName?.[0] ?? "?"}
                      </div>
                      <div>
                        <Link
                          href={`/professionals/${b.professionalId}`}
                          className="text-2xl font-bold text-slate-900 hover:text-violet-700 transition"
                        >
                          {b.professionalName}
                        </Link>
                        <p className="mt-1 text-xl text-slate-700">{b.service}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-base text-slate-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />{formatScheduled(b)}
                          </span>
                          {b.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />{b.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />${b.price}/hr
                          </span>
                        </div>
                        {b.notes && (
                          <p className="mt-2 text-base text-slate-400 italic line-clamp-2">{b.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-start gap-2 md:items-end shrink-0">
                      <span className={`rounded-xl px-4 py-2 text-base font-semibold ${meta.badge}`}>
                        {meta.label}
                      </span>

                      {canReview && (
                        <button
                          onClick={() => setActiveReview(b)}
                          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-base font-semibold text-white hover:bg-amber-600 transition"
                        >
                          <Star className="h-4 w-4" /> Leave Review
                        </button>
                      )}
                      {b.status === "completed" && reviewed[b.id] === true && (
                        <span className="flex items-center gap-2 text-base font-medium text-green-600">
                          <CheckCircle2 className="h-4 w-4" /> Reviewed
                        </span>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(b)}
                          disabled={cancelling === b.id}
                          className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-base font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                        >
                          {cancelling === b.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Ban className="h-4 w-4" />}
                          Cancel
                        </button>
                      )}
                      {b.status === "cancelled" && (
                        <XCircle className="h-6 w-6 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {activeReview && userProfile && (
        <ReviewModal
          bookingId={activeReview.id}
          reviewerId={userProfile.uid}
          reviewerName={userProfile.displayName}
          subjectId={activeReview.professionalId}
          subjectName={activeReview.professionalName}
          type="customer_to_pro"
          onDone={() => {
            setReviewed((prev) => ({ ...prev, [activeReview.id]: true }));
            setActiveReview(null);
          }}
          onClose={() => setActiveReview(null)}
        />
      )}
    </main>
  );
}
