"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Clock3, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getDocs, query, collection, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Review } from "@/lib/types";

async function getMyReviews(reviewerId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("reviewerId", "==", reviewerId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-5 w-5 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

function formatDate(r: Review): string {
  if (!r.createdAt) return "—";
  return new Date((r.createdAt as unknown as { seconds: number }).seconds * 1000)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const LABEL = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

export default function MyReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyReviews(user.uid).then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, [user]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-12">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-5">
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">My Reviews</h1>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Star className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <p className="text-2xl font-semibold text-slate-500">No reviews yet.</p>
            <p className="mt-2 text-lg text-slate-400">After a completed booking, leave a review for the professional.</p>
            <Link href="/profile/bookings" className="mt-6 inline-block rounded-2xl bg-violet-600 px-8 py-4 text-xl font-bold text-white hover:bg-violet-700 transition">
              View Bookings
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Summary card */}
            <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 shadow-sm flex items-center gap-6">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-amber-500">{avgRating}</p>
                <p className="text-lg text-slate-600 mt-1">avg rating</p>
              </div>
              <div className="h-16 w-px bg-amber-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{reviews.length} review{reviews.length !== 1 ? "s" : ""} left</p>
                <p className="text-lg text-slate-500 mt-1">Reviews you wrote for professionals</p>
              </div>
            </div>

            {reviews.map((r) => (
              <div key={r.id} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 text-xl font-bold shrink-0">
                        {r.subjectName?.[0] ?? "?"}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-slate-900">{r.subjectName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRow rating={r.rating} />
                          <span className="text-base font-semibold text-amber-600">{LABEL[r.rating]}</span>
                        </div>
                      </div>
                    </div>
                    {r.comment && (
                      <div className="flex items-start gap-3 mt-3 pl-1">
                        <MessageSquare className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-lg text-slate-600 leading-relaxed">{r.comment}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-400 shrink-0">
                    <Clock3 className="h-4 w-4" />
                    {formatDate(r)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
