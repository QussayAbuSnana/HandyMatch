"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Wallet, TrendingUp, CalendarDays,
  DollarSign, CheckCircle2, Clock3,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getProBookings } from "@/lib/firestore";
import { Booking } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

export default function ProEarningsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getProBookings(user.uid)
      .then(setBookings)
      .finally(() => setLoading(false));
  }, [user]);

  const completed = bookings.filter((b) => b.status === "completed");
  const pending   = bookings.filter((b) => b.status === "accepted" || b.status === "in_progress");

  const totalEarned = completed.reduce((sum, b) => sum + (b.price ?? 0), 0);

  const now = new Date();
  const thisMonthEarned = completed
    .filter((b) => {
      if (!b.createdAt) return false;
      const d = new Date((b.createdAt as unknown as { seconds: number }).seconds * 1000);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, b) => sum + (b.price ?? 0), 0);

  const pendingPayout = pending.reduce((sum, b) => sum + (b.price ?? 0), 0);

  const formatDate = (b: Booking) => {
    if (!b.createdAt) return "—";
    return new Date((b.createdAt as unknown as { seconds: number }).seconds * 1000)
      .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const summaryCards = [
    { titleKey: "this_month",         value: `$${thisMonthEarned}`,  icon: Wallet,       gradient: "from-emerald-500 to-green-600" },
    { titleKey: "completed_jobs_label", value: completed.length,      icon: CheckCircle2, gradient: "from-violet-500 to-fuchsia-500" },
    { titleKey: "pending_payout",     value: `$${pendingPayout}`,    icon: Clock3,       gradient: "from-amber-400 to-orange-500" },
    { titleKey: "total_earned",       value: `$${totalEarned}`,      icon: TrendingUp,   gradient: "from-blue-500 to-cyan-500" },
  ];

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/pro/profile"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">{t("earnings_label")}</div>
          </div>
          <p className="text-lg text-white/85">{t("pro_performance")}</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">{t("track_earnings")}</h1>
          <p className="mt-3 text-lg text-white/85">{t("earnings_desc")}</p>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <section className="mx-auto -mt-4 max-w-5xl px-5">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.titleKey} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-md`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900">{card.value}</div>
                    <div className="mt-2 text-lg text-slate-500">{t(card.titleKey)}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Completed jobs */}
          <section className="mx-auto max-w-5xl px-5 pt-8">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <CalendarDays className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{t("completed_jobs_label")}</h2>
                  <p className="text-lg text-slate-500">{t("all_finished_jobs")}</p>
                </div>
              </div>

              {completed.length === 0 ? (
                <p className="py-8 text-center text-xl text-slate-400">{t("no_completed_yet")}</p>
              ) : (
                <div className="space-y-4">
                  {completed.map((b) => (
                    <div key={b.id}
                      className="flex flex-col gap-4 rounded-[1.5rem] border border-gray-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{b.customerName}</h3>
                        <p className="mt-1 text-lg text-slate-600">{b.service}</p>
                        <p className="mt-1 text-sm text-slate-500">{formatDate(b)}</p>
                      </div>
                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <div className="flex items-center gap-1 text-2xl font-extrabold text-violet-600">
                          <DollarSign className="h-5 w-5" />{b.price}/hr
                        </div>
                        <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                          {t("completed")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Pending jobs */}
          {pending.length > 0 && (
            <section className="mx-auto max-w-5xl px-5 pt-6">
              <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-sm">
                    <Clock3 className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{t("active_jobs")}</h2>
                    <p className="text-lg text-slate-500">{t("active_jobs_desc")}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {pending.map((b) => (
                    <div key={b.id}
                      className="flex flex-col gap-4 rounded-[1.5rem] border border-amber-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{b.customerName}</h3>
                        <p className="mt-1 text-lg text-slate-600">{b.service}</p>
                        <p className="mt-1 text-sm text-slate-500">{formatDate(b)}</p>
                      </div>
                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <div className="flex items-center gap-1 text-2xl font-extrabold text-amber-600">
                          <DollarSign className="h-5 w-5" />{b.price}/hr
                        </div>
                        <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                          {t("pending_payout")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
