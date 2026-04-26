"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Clock3, Shield, MessageSquare, CalendarDays, CheckCircle2, Briefcase } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getUserProfile, createBooking, getOrCreateConversation, getReviewsForPro } from "@/lib/firestore";
import { UserProfile, Review } from "@/lib/types";
import BookingModal from "@/components/shared/BookingModal";

type Props = { params: Promise<{ id: string }> };

export default function ProfessionalDetailPage({ params }: Props) {
  const { id } = use(params);
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const [pro, setPro] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    getUserProfile(id)
      .then(setPro)
      .finally(() => setLoading(false));
    getReviewsForPro(id).then(setReviews);
  }, [id]);

  const proData = pro as unknown as {
    bio?: string; services?: string[]; hourlyRate?: number;
    rating?: number; reviewCount?: number; jobCount?: number;
    location?: string; isAvailable?: boolean;
  };

  const handleBook = async (data: { service: string; scheduledAt: Date; location: string; notes: string }) => {
    if (!user || !userProfile || !pro) return;
    await createBooking({
      customerId: user.uid,
      professionalId: pro.uid,
      customerName: userProfile.displayName,
      professionalName: pro.displayName,
      service: data.service,
      status: "pending",
      scheduledAt: data.scheduledAt as unknown as import("firebase/firestore").Timestamp,
      location: data.location,
      price: proData.hourlyRate ?? 0,
      notes: data.notes,
    });
    setShowBooking(false);
    setBooked(true);
  };

  const handleMessage = async () => {
    if (!user || !userProfile || !pro) return;
    const convId = await getOrCreateConversation(
      user.uid, pro.uid,
      userProfile.displayName, pro.displayName
    );
    router.push(`/messages/${convId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fb]">
        <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f8fb] gap-4">
        <p className="text-2xl font-semibold text-slate-600">Professional not found.</p>
        <Link href="/search" className="text-violet-600 font-bold hover:underline">Back to Search</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/search" className="text-gray-600 transition hover:text-gray-900">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-10 pt-8 text-white">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="h-32 w-32 rounded-[2rem] bg-white/20 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
              {pro.displayName?.[0] ?? "?"}
            </div>
            <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-sky-400 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold">{pro.displayName}</h2>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
              {proData.services?.map((s) => (
                <span key={s} className="rounded-full bg-white/20 px-4 py-1 text-lg font-medium">{s}</span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-6 text-lg text-white/90">
              {proData.rating && (
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                  {proData.rating.toFixed(1)} ({proData.reviewCount ?? 0} reviews)
                </span>
              )}
              {proData.location && (
                <span className="flex items-center gap-2"><MapPin className="h-5 w-5" />{proData.location}</span>
              )}
              <span className="flex items-center gap-2">
                <Clock3 className="h-5 w-5" />
                {proData.isAvailable ? "Available now" : "Unavailable"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 space-y-5 pt-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Star, label: "Rating", value: proData.rating?.toFixed(1) ?? "New", color: "text-amber-500 bg-amber-50" },
            { icon: Briefcase, label: "Jobs Done", value: proData.jobCount ?? 0, color: "text-violet-600 bg-violet-50" },
            { icon: CheckCircle2, label: "Reviews", value: proData.reviewCount ?? 0, color: "text-emerald-600 bg-emerald-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-[1.5rem] border border-gray-200 bg-white p-5 text-center shadow-sm">
                <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${s.color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
                <div className="mt-1 text-lg text-slate-500">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Bio */}
        {proData.bio && (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">About</h3>
            <p className="text-xl text-slate-600 leading-relaxed">{proData.bio}</p>
          </div>
        )}

        {/* Services */}
        {proData.services && proData.services.length > 0 && (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Services</h3>
            <div className="flex flex-wrap gap-3">
              {proData.services.map((s) => (
                <span key={s} className="rounded-full border border-violet-200 bg-violet-50 px-5 py-2 text-lg font-medium text-violet-700">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-5">Reviews</h3>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-slate-800">{r.reviewerName}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <p className="mt-2 text-lg text-slate-600 leading-relaxed">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking success */}
        {booked && (
          <div className="rounded-[2rem] border border-green-200 bg-green-50 p-6 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-3" />
            <p className="text-2xl font-bold text-green-800">Booking Request Sent!</p>
            <p className="mt-2 text-lg text-green-700">{pro.displayName} will respond shortly.</p>
          </div>
        )}

        {/* Actions */}
        {!booked && (
          <div className="flex gap-4">
            <button
              onClick={handleMessage}
              className="flex flex-1 items-center justify-center gap-3 rounded-[1.5rem] border border-gray-200 bg-white px-6 py-5 text-xl font-semibold text-slate-700 shadow-sm transition hover:bg-gray-50"
            >
              <MessageSquare className="h-6 w-6" />Message
            </button>
            <button
              onClick={() => setShowBooking(true)}
              className="flex flex-1 items-center justify-center gap-3 rounded-[1.5rem] bg-violet-600 px-6 py-5 text-xl font-bold text-white shadow-lg transition hover:bg-violet-700"
            >
              <CalendarDays className="h-6 w-6" />
              {`Book · $${proData.hourlyRate ?? "—"}/hr`}
            </button>
          </div>
        )}
      </div>

      {showBooking && userProfile && (
        <BookingModal
          professionalName={pro.displayName}
          services={proData.services ?? ["General Service"]}
          hourlyRate={proData.hourlyRate ?? 0}
          customerLocation={userProfile.location ?? ""}
          onConfirm={handleBook}
          onClose={() => setShowBooking(false)}
        />
      )}
    </main>
  );
}
