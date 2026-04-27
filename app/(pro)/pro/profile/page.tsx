"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell, Menu, Briefcase, CalendarDays, MessageSquare, User,
  Star, MapPin, Phone, Mail, Wallet, Clock3, Settings,
  ChevronRight, LogOut, Wrench, BadgeCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getReviewsForPro } from "@/lib/firestore";
import { Review } from "@/lib/types";
import ProSideMenu from "@/components/shared/ProSideMenu";

const menuItems = [
  { title: "Manage Services", icon: Wrench, iconWrap: "bg-violet-50", iconColor: "text-violet-600", href: "/pro/profile/services" },
  { title: "Availability", icon: Clock3, iconWrap: "bg-blue-50", iconColor: "text-blue-600", href: "/pro/availability" },
  { title: "Earnings", icon: Wallet, iconWrap: "bg-emerald-50", iconColor: "text-emerald-600", href: "/pro/profile/earnings" },
  { title: "Settings", icon: Settings, iconWrap: "bg-gray-100", iconColor: "text-gray-500", href: "/pro/profile/settings" },
];

export default function ProProfilePage() {
  const { userProfile, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!userProfile?.uid) return;
    getReviewsForPro(userProfile.uid).then(setReviews);
  }, [userProfile?.uid]);

  const pro = userProfile as unknown as {
    bio?: string; services?: string[]; hourlyRate?: number;
    rating?: number; reviewCount?: number; jobCount?: number;
    location?: string; phone?: string; isAvailable?: boolean;
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const memberSince = userProfile?.createdAt
    ? new Date((userProfile.createdAt as unknown as { seconds: number }).seconds * 1000)
        .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <ProSideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button onClick={() => setMenuOpen(true)} className="text-gray-600"><Menu className="h-8 w-8" /></button>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <Link href="/pro/notifications" className="relative text-gray-600">
            <Bell className="h-8 w-8" />
            <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-500" />
          </Link>
        </div>
      </header>

      {/* Hero card */}
      <section className="mx-auto max-w-7xl px-5 pt-5">
        <div className="rounded-[2rem] bg-gradient-to-r from-violet-600 to-fuchsia-500 p-8 text-white shadow-sm">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15 text-4xl font-bold">
                {userProfile?.displayName?.[0] ?? "?"}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-bold">{userProfile?.displayName ?? "—"}</h2>
                  <BadgeCheck className="h-8 w-8 text-sky-300" />
                </div>
                <p className="mt-1 text-xl text-white/85">Pro since {memberSince}</p>
                {pro.isAvailable !== undefined && (
                  <span className={`mt-2 inline-block rounded-full px-4 py-1 text-lg font-semibold ${pro.isAvailable ? "bg-green-400/30 text-green-100" : "bg-white/20 text-white/70"}`}>
                    {pro.isAvailable ? "Available" : "Unavailable"}
                  </span>
                )}
              </div>
            </div>
            <Link href="/pro/setup" className="shrink-0 rounded-2xl border border-white/30 bg-white/15 px-4 py-2 text-lg font-semibold text-white hover:bg-white/25 transition">
              Edit
            </Link>
          </div>

          <div className="my-7 h-px bg-white/20" />

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">{pro.rating?.toFixed(1) ?? "—"}</div>
              <div className="mt-2 text-lg text-white/85">Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{pro.jobCount ?? 0}</div>
              <div className="mt-2 text-lg text-white/85">Jobs Done</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{pro.reviewCount ?? 0}</div>
              <div className="mt-2 text-lg text-white/85">Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      {pro.services && pro.services.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-6">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900">Services</h2>
              <span className="text-2xl font-bold text-violet-600">${pro.hourlyRate ?? "—"}/hr</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {pro.services.map((s) => (
                <span key={s} className="flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-lg font-medium text-violet-700">
                  <Star className="h-4 w-4 fill-violet-400 text-violet-400" />{s}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-6">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-3xl font-bold text-slate-900">Customer Reviews</h2>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-slate-800">{r.reviewerName}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-5 w-5 ${star <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
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
        </section>
      )}

      {/* Contact info */}
      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">Contact Info</h2>
          <div className="space-y-5">
            {[
              { icon: Mail, label: "Email", value: userProfile?.email ?? "—" },
              { icon: Phone, label: "Phone", value: pro.phone ?? "Not set" },
              { icon: MapPin, label: "Location", value: pro.location ?? "Not set" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-slate-500">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-lg text-slate-500">{label}</p>
                  <p className="text-2xl font-medium text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href}
                className="flex items-center justify-between rounded-[1.8rem] border border-gray-200 bg-white px-5 py-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconWrap}`}>
                    <Icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <span className="text-2xl font-semibold text-slate-900">{item.title}</span>
                </div>
                <ChevronRight className="h-7 w-7 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Logout */}
      <section className="mx-auto max-w-7xl px-5 pt-8">
        <button onClick={handleLogout}
          className="mx-auto flex items-center gap-3 text-2xl font-semibold text-red-600 transition hover:text-red-700">
          <LogOut className="h-6 w-6" />Log Out
        </button>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link href="/pro/dashboard" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <Briefcase className="h-7 w-7" /><span className="mt-1 text-base font-medium">Dashboard</span>
          </Link>
          <Link href="/pro/jobs" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <CalendarDays className="h-7 w-7" /><span className="mt-1 text-base font-medium">Jobs</span>
          </Link>
          <Link href="/pro/messages" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <MessageSquare className="h-7 w-7" /><span className="mt-1 text-base font-medium">Messages</span>
          </Link>
          <Link href="/pro/profile" className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700">
            <User className="h-7 w-7" /><span className="mt-1 text-base font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
