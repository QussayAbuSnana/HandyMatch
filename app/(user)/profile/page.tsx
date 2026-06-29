"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu, Home, Search, MessageSquare, User,
  Mail, Phone, MapPin, Heart, Clock3, Star, Settings,
  ChevronRight, LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeCustomerBookings } from "@/lib/firestore";
import { Booking } from "@/lib/types";
import { BellButton } from "@/components/shared/CustomerNavBar";
import SideMenu from "@/components/shared/SideMenu";
import { useLanguage } from "@/lib/language-context";

const menuItems = [
  { titleKey: "booking_history", icon: Clock3, iconWrap: "bg-blue-50", iconColor: "text-blue-500", href: "/profile/bookings" },
  { titleKey: "my_reviews", icon: Star, iconWrap: "bg-amber-50", iconColor: "text-amber-500", href: "/profile/reviews" },
  { titleKey: "favorite_providers", icon: Heart, iconWrap: "bg-red-50", iconColor: "text-red-500", href: "/profile/favorites" },
  { titleKey: "settings", icon: Settings, iconWrap: "bg-gray-100", iconColor: "text-gray-500", href: "/profile/settings" },
];

export default function ProfilePage() {
  const { user, userProfile, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) return;
    return subscribeCustomerBookings(user.uid, setBookings);
  }, [user]);

  const totalJobs = bookings.filter((b) => b.status !== "cancelled").length;
  const completedJobs = bookings.filter((b) => b.status === "completed").length;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const memberSince = userProfile?.createdAt
    ? new Date((userProfile.createdAt as unknown as { seconds: number }).seconds * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button onClick={() => setMenuOpen(true)} className="text-gray-600 transition hover:text-gray-900"><Menu className="h-8 w-8" /></button>
          <h1 className="text-3xl font-bold text-slate-900">{t("profile")}</h1>
          <BellButton />
        </div>
      </header>

      {/* Profile card */}
      <section className="mx-auto max-w-7xl px-5 pt-5">
        <div className="rounded-[2rem] bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-sm">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15">
                {userProfile?.photoURL
                  ? <img src={userProfile.photoURL} alt="avatar" className="h-24 w-24 rounded-full object-cover" />
                  : <User className="h-12 w-12" />}
              </div>
              <div>
                <h2 className="text-4xl font-bold">{userProfile?.displayName ?? "Loading…"}</h2>
                <p className="mt-2 text-2xl text-white/85">{t("member_since")} {memberSince}</p>
              </div>
            </div>
            <Link href="/profile/edit" className="shrink-0 rounded-2xl border border-white/30 bg-white/15 px-4 py-2 text-lg font-semibold text-white hover:bg-white/25 transition">
              {t("edit")}
            </Link>
          </div>

          <div className="my-7 h-px bg-white/20" />

          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: totalJobs, labelKey: "jobs_posted" },
              { value: completedJobs, labelKey: "completed" },
              { value: completedJobs > 0 ? "★" : "—", labelKey: "reviewed" },
            ].map((s) => (
              <div key={s.labelKey}>
                <div className="text-4xl font-bold">{s.value}</div>
                <div className="mt-2 text-lg text-white/85">{t(s.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">{t("contact_info")}</h2>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-slate-500">
                <Mail className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg text-slate-500">{t("email")}</p>
                <p className="text-2xl font-medium text-slate-900">{userProfile?.email ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-slate-500">
                <Phone className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg text-slate-500">{t("phone")}</p>
                <p className="text-2xl font-medium text-slate-900">{userProfile?.phone ?? t("not_set")}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-slate-500">
                <MapPin className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg text-slate-500">{t("location")}</p>
                <p className="text-2xl font-medium text-slate-900">{userProfile?.location ?? t("not_set")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu items */}
      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.titleKey} href={item.href}
                className="flex items-center justify-between rounded-[1.8rem] border border-gray-200 bg-white px-5 py-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconWrap}`}>
                    <Icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <span className="text-2xl font-semibold text-slate-900">{t(item.titleKey)}</span>
                </div>
                <ChevronRight className="h-7 w-7 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Logout */}
      <section className="mx-auto max-w-7xl px-5 pt-8">
        <button
          onClick={handleLogout}
          className="mx-auto flex items-center gap-3 text-2xl font-semibold text-red-600 transition hover:text-red-700"
        >
          <LogOut className="h-6 w-6" />
          {t("log_out")}
        </button>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link href="/dashboard" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <Home className="h-7 w-7" /><span className="mt-1 text-base font-medium">{t("home")}</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <Search className="h-7 w-7" /><span className="mt-1 text-base font-medium">{t("search")}</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <MessageSquare className="h-7 w-7" /><span className="mt-1 text-base font-medium">{t("messages")}</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700">
            <User className="h-7 w-7" /><span className="mt-1 text-base font-medium">{t("profile")}</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
