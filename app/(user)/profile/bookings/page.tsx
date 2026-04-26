"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, CheckCircle2, XCircle, CalendarDays, Loader2, Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeCustomerBookings, hasReviewed } from "@/lib/firestore";
import { Booking } from "@/lib/types";
import ReviewModal from "@/components/shared/ReviewModal";

const STATUS_STYLES: Record<string, { label: string; card: string; badge: string; icon: typeof CheckCircle2 }> = {
  pending:     { label: "Pending",     card: "border-yellow-200 bg-yellow-50", badge: "bg-yellow-100 text-yellow-700", icon: Loader2 },
  accepted:    { label: "Accepted",    card: "border-blue-200 bg-blue-50",     badge: "bg-blue-100 text-blue-700",     icon: CalendarDays },
  in_progress: { label: "In Progress", card: "border-blue-200 bg-blue-50",     badge: "bg-blue-100 text-blue-700",     icon: CalendarDays },
  completed:   { label: "Completed",   card: "border-green-200 bg-green-50",   badge: "bg-green-100 text-green-700",   icon: CheckCircle2 },
  cancelled:   { label: "Cancelled",   card: "border-red-200 bg-red-50",       badge: "bg-red-100 text-red-700",       icon: XCircle },
};

export default function BookingsPage() {
  const { user, userProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [activeReview, setActiveReview] = useState<Booking | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeCustomerBookings(user.uid, async (data) => {
      setBookings(data);
      setLoading(false);
      // Check which completed bookings already have a review
      const completed = data.filter((b) => b.status === "completed");
      const checks = await Promise.all(
        completed.map(async (b) => [b.id, await hasReviewed(b.id, user.uid)] as [string, boolean])
      );
      setReviewed(Object.fromEntries(checks));
    });
    return unsub;
  }, [user]);

  const formatDate = (b: Booking) => {
    if (!b.createdAt) return "—";
    return new Date((b.createdAt as unknown as { seconds: number }).seconds * 1000)
      .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-12">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-5">
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Booking History</h1>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Clock3 className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <p className="text-2xl font-semibold text-slate-500">No bookings yet.</p>
            <Link href="/search" className="mt-6 inline-block rounded-2xl bg-violet-600 px-8 py-4 text-xl font-bold text-white hover:bg-violet-700 transition">
              Find Professionals
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const style = STATUS_STYLES[b.status] ?? STATUS_STYLES.pending;
              const Icon = style.icon;
              const canReview = b.status === "completed" && reviewed[b.id] === false;
              return (
                <div key={b.id} className={`rounded-[2rem] border p-5 shadow-sm ${style.card}`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Icon className="h-8 w-8 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{b.professionalName}</h3>
                        <p className="mt-1 text-xl text-slate-700">{b.service}</p>
                        <p className="mt-1 text-lg text-slate-500">{formatDate(b)} · ${b.price}/hr</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <span className={`rounded-xl px-4 py-2 text-lg font-semibold ${style.badge}`}>
                        {style.label}
                      </span>
                      {canReview && (
                        <button
                          onClick={() => setActiveReview(b)}
                          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-lg font-semibold text-white hover:bg-amber-600 transition"
                        >
                          <Star className="h-5 w-5" /> Leave Review
                        </button>
                      )}
                      {b.status === "completed" && reviewed[b.id] === true && (
                        <span className="flex items-center gap-2 text-lg font-medium text-green-600">
                          <CheckCircle2 className="h-5 w-5" /> Reviewed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Review modal */}
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
