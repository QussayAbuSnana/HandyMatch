"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Bell, Menu, Briefcase, MessageSquare, User,
  Star, Wallet, Clock3, CheckCircle2, MapPin,
  ArrowRight, CalendarDays, Hammer, DollarSign,
} from "lucide-react";
import { subscribeProBookings } from "@/lib/firestore";
import ProSideMenu from "@/components/shared/ProSideMenu";
import { Booking } from "@/lib/types";

function isToday(b: Booking): boolean {
  if (!b.scheduledAt) return false;
  const d = new Date((b.scheduledAt as unknown as { seconds: number }).seconds * 1000);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function isThisMonth(b: Booking): boolean {
  if (!b.createdAt) return false;
  const d = new Date((b.createdAt as unknown as { seconds: number }).seconds * 1000);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function formatDate(b: Booking): string {
  if (!b.createdAt) return "—";
  return new Date((b.createdAt as unknown as { seconds: number }).seconds * 1000)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ProfessionalDashboardPage() {
  const { user, userProfile } = useAuth();
  const firstName = userProfile?.displayName?.split(" ")[0] ?? "there";
  const proData = userProfile as unknown as { rating?: number; reviewCount?: number };

  const [menuOpen, setMenuOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeProBookings(user.uid, (data) => {
      setBookings(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const pending   = bookings.filter((b) => b.status === "pending");
  const todayJobs = bookings.filter((b) => (b.status === "accepted" || b.status === "in_progress") && isToday(b));
  const monthEarnings = bookings
    .filter((b) => b.status === "completed" && isThisMonth(b))
    .reduce((sum, b) => sum + (b.price ?? 0), 0);

  const stats = [
    { title: "New Requests", value: loading ? "…" : String(pending.length),   icon: Briefcase,    gradient: "from-violet-500 to-fuchsia-500" },
    { title: "Today's Jobs", value: loading ? "…" : String(todayJobs.length), icon: CalendarDays, gradient: "from-blue-500 to-cyan-500" },
    { title: "Rating",       value: proData?.rating ? proData.rating.toFixed(1) : "New", icon: Star, gradient: "from-amber-400 to-orange-500" },
    { title: "This Month",   value: loading ? "…" : `$${monthEarnings}`,      icon: Wallet,       gradient: "from-emerald-500 to-green-600" },
  ];

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <ProSideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button onClick={() => setMenuOpen(true)} className="text-gray-600 transition hover:text-gray-900">
            <Menu className="h-8 w-8" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
              <Hammer className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-violet-600">HandyMatch Pro</span>
          </div>
          <Link href="/pro/notifications" className="relative text-gray-600 transition hover:text-gray-900">
            <Bell className="h-8 w-8" />
            {pending.length > 0 && (
              <span className="absolute -right-1 top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-pink-500 text-xs font-bold text-white">
                {pending.length > 9 ? "9+" : pending.length}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Hero + stats */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-10 pt-6 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xl font-medium text-white/90">Welcome back, {firstName}!</p>
          <h1 className="mb-3 text-4xl font-extrabold md:text-6xl">Manage Your Workday</h1>
          <p className="text-lg text-white/85 md:text-2xl">Track requests, jobs, earnings, and client communication</p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[2rem] border border-white/20 bg-white/10 px-6 py-6 shadow-lg backdrop-blur-sm">
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="text-3xl font-extrabold">{item.value}</div>
                  <div className="mt-2 text-lg text-white/85">{item.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="mx-auto -mt-6 max-w-7xl px-5">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { href: "/pro/jobs",     icon: Briefcase,    bg: "bg-violet-100 text-violet-600",  title: "View Requests",  desc: "Review incoming customer requests and respond quickly." },
            { href: "/pro/messages", icon: MessageSquare,bg: "bg-blue-100 text-blue-600",      title: "Open Messages",  desc: "Stay connected with customers and manage conversations." },
            { href: "/pro/profile",  icon: User,         bg: "bg-emerald-100 text-emerald-600",title: "Update Profile",  desc: "Edit your services, pricing, and availability information." },
          ].map(({ href, icon: Icon, bg, title, desc }) => (
            <Link key={href} href={href} className="rounded-[2rem] border border-gray-200 bg-white px-6 py-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-lg text-slate-500">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* New Requests (live) */}
      <section className="mx-auto mt-8 max-w-7xl px-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">New Requests</h2>
          <Link href="/pro/jobs" className="text-xl font-semibold text-violet-600">See all</Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-10 w-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          </div>
        ) : pending.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 text-center text-xl text-slate-400 shadow-sm">
            No pending requests right now.
          </div>
        ) : (
          <div className="space-y-4">
            {pending.slice(0, 3).map((req) => (
              <div key={req.id} className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{req.customerName}</h3>
                    <p className="mt-2 text-xl text-slate-700">{req.service}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-lg text-slate-500">
                      <span className="flex items-center gap-2"><MapPin className="h-5 w-5" />{req.location}</span>
                      <span className="flex items-center gap-2"><Clock3 className="h-5 w-5" />{formatDate(req)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <span className="flex items-center gap-1 text-2xl font-extrabold text-violet-600">
                      <DollarSign className="h-6 w-6" />{req.price}/hr
                    </span>
                    <Link href="/pro/jobs" className="rounded-xl bg-violet-600 px-5 py-2 text-lg font-semibold text-white transition hover:bg-violet-700">
                      Respond →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Today's Jobs (live) */}
      <section className="mx-auto mt-8 max-w-7xl px-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Today&apos;s Jobs</h2>
          <Link href="/pro/jobs" className="text-xl font-semibold text-violet-600">View schedule</Link>
        </div>
        {loading ? null : todayJobs.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 text-center text-xl text-slate-400 shadow-sm">
            No jobs scheduled for today.
          </div>
        ) : (
          <div className="space-y-4">
            {todayJobs.map((job) => (
              <div key={job.id} className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{job.customerName}</h3>
                    <p className="mt-2 text-xl text-slate-700">{job.service}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-lg text-slate-500">
                      <span className="flex items-center gap-2"><MapPin className="h-5 w-5" />{job.location}</span>
                    </div>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-lg font-semibold ${job.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}`}>
                    {job.status === "in_progress" ? "In Progress" : "Upcoming"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Keep availability updated */}
      <section className="mx-auto mt-8 max-w-7xl px-5">
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-7 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900">Keep your profile updated</h2>
              <p className="mt-3 text-xl text-slate-600">Customers are more likely to book you when your services and availability are current.</p>
              <Link href="/pro/profile" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-lg font-semibold text-white transition hover:bg-green-700">
                Edit profile <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link href="/pro/dashboard" className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700">
            <Briefcase className="h-7 w-7" /><span className="mt-1 text-base font-medium">Dashboard</span>
          </Link>
          <Link href="/pro/jobs" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <CalendarDays className="h-7 w-7" /><span className="mt-1 text-base font-medium">Jobs</span>
          </Link>
          <Link href="/pro/messages" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <MessageSquare className="h-7 w-7" /><span className="mt-1 text-base font-medium">Messages</span>
          </Link>
          <Link href="/pro/profile" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <User className="h-7 w-7" /><span className="mt-1 text-base font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
