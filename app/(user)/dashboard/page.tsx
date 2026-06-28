"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu, Search, MapPin, Star, Clock3,
  Home, MessageSquare, User, Sparkles, Check,
  Droplets, Zap, Hammer, Paintbrush, TrendingUp, CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getProfessionals } from "@/lib/firestore";
import { UserProfile } from "@/lib/types";
import { BellButton } from "@/components/shared/CustomerNavBar";
import SideMenu from "@/components/shared/SideMenu";
import AsapModal from "@/components/shared/AsapModal";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/language-context";

const categories = [
  { nameKey: "plumbing",   description: "Leaks, installations, repairs",    icon: Droplets,   gradient: "from-violet-500 to-purple-500", query: "plumbing" },
  { nameKey: "electrical", description: "Wiring, fixtures, repairs",         icon: Zap,        gradient: "from-orange-400 to-orange-600", query: "electrical" },
  { nameKey: "carpentry",  description: "Furniture, repairs, installation",  icon: Hammer,     gradient: "from-orange-500 to-red-500",    query: "carpentry" },
  { nameKey: "painting",   description: "Interior, exterior, touch-ups",    icon: Paintbrush, gradient: "from-sky-500 to-cyan-500",      query: "painting" },
];

const benefits = [
  { titleKey: "verified_professionals", descKey: "verified_professionals_desc", gradient: "from-emerald-400 to-teal-500" },
  { titleKey: "transparent_pricing",    descKey: "transparent_pricing_desc",    gradient: "from-sky-400 to-cyan-500" },
  { titleKey: "fast_response",          descKey: "fast_response_desc",          gradient: "from-fuchsia-500 to-pink-500" },
];

export default function CustomerDashboardPage() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const firstName = userProfile?.displayName?.split(" ")[0] ?? "there";
  const [menuOpen, setMenuOpen] = useState(false);
  const [topPros, setTopPros] = useState<UserProfile[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [asapOpen, setAsapOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  useEffect(() => {
    getProfessionals().then((all) => {
      // Sort by rating desc, take top 3
      const sorted = [...all]
        .filter((p) => (p as unknown as { rating?: number }).rating)
        .sort((a, b) => {
          const ra = (a as unknown as { rating: number }).rating;
          const rb = (b as unknown as { rating: number }).rating;
          return rb - ra;
        });
      setTopPros(sorted.slice(0, 3));
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {asapOpen && <AsapModal onClose={() => setAsapOpen(false)} />}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button onClick={() => setMenuOpen(true)} className="text-gray-600 transition hover:text-gray-900">
            <Menu className="h-8 w-8" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-violet-600">HandyMatch</span>
          </div>

          <BellButton />
        </div>
      </header>

      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-10 pt-6 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="flex items-center gap-2 text-xl font-medium text-white/90">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              {t("welcome_back")}, {firstName}!
            </p>
            <LanguageSwitcher compact />
          </div>

          <h1 className="mb-3 text-4xl font-extrabold md:text-6xl">
            {t("find_your_match")}
          </h1>

          <p className="text-lg text-white/85 md:text-2xl">
            {t("trusted_pros")}
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex items-center justify-between rounded-[2rem] bg-white px-5 py-4 shadow-2xl">
            <div className="flex flex-1 items-center gap-3 text-gray-400">
              <Search className="h-7 w-7 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full bg-transparent text-lg text-slate-700 placeholder:text-gray-400 outline-none md:text-2xl"
              />
            </div>
            <button
              type="submit"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white transition hover:bg-violet-700"
            >
              <MapPin className="h-7 w-7" />
            </button>
          </form>

          <button
            onClick={() => setAsapOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-3 rounded-[2rem] bg-emerald-500 py-5 text-xl font-extrabold text-white shadow-lg hover:bg-emerald-600 active:scale-95 transition-all"
          >
            <Zap className="h-6 w-6" />
            {t("book_asap")}
          </button>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { value: "500+", labelKey: "verified_pros" },
              { value: "4.8★", labelKey: "avg_rating" },
              { value: "10k+", labelKey: "jobs_done" },
            ].map((item) => (
              <div
                key={item.labelKey}
                className="rounded-[2rem] border border-white/20 bg-white/10 px-6 py-7 text-center shadow-lg backdrop-blur-sm"
              >
                <div className="text-4xl font-extrabold">{item.value}</div>
                <div className="mt-2 text-lg text-white/85">{t(item.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-6 max-w-7xl px-5">
        <div className="grid gap-5 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.nameKey}
                href={`/search?service=${category.query}`}
                className="rounded-[2rem] border border-gray-200 bg-white px-8 py-10 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${category.gradient} text-white shadow-md`}
                >
                  <Icon className="h-9 w-9" />
                </div>

                <h3 className="text-center text-2xl font-bold text-slate-900">
                  {t(category.nameKey)}
                </h3>
                <p className="mt-3 text-center text-lg text-slate-500">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>

        <Link
          href="/categories"
          className="mt-5 block rounded-[1.5rem] bg-violet-50 px-6 py-5 text-center text-xl font-semibold text-violet-700 transition hover:bg-violet-100"
        >
          {t("view_all_categories")}
        </Link>

        <Link
          href="/profile/bookings"
          className="mt-3 flex items-center justify-between rounded-[1.5rem] border border-gray-200 bg-white px-6 py-5 shadow-sm transition hover:shadow-md"
        >
          <div>
            <p className="text-xl font-bold text-slate-900">{t("my_bookings")}</p>
            <p className="mt-1 text-base text-slate-500">{t("track_bookings")}</p>
          </div>
          <CalendarDays className="h-8 w-8 shrink-0 text-violet-500" />
        </Link>

        <Link
          href="/estimate"
          className="mt-3 flex items-center justify-between rounded-[1.5rem] bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-5 text-white shadow-md transition hover:opacity-95"
        >
          <div>
            <p className="text-xl font-bold">{t("not_sure_cost")}</p>
            <p className="mt-1 text-base text-white/85">{t("ai_estimate")}</p>
          </div>
          <Sparkles className="h-8 w-8 shrink-0 text-yellow-300" />
        </Link>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-orange-500 p-3 text-white shadow-md">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 md:text-4xl">
                {t("top_rated")}
              </h2>
              <p className="mt-1 text-lg text-slate-500">
                {t("most_trusted")}
              </p>
            </div>
          </div>

          <Link href="/professionals" className="text-xl font-semibold text-violet-600">
            {t("see_all")}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topPros.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-gray-200 bg-white p-8 text-center text-xl text-slate-400 shadow-sm">
              No professionals yet. Check back soon!
            </div>
          ) : (
            topPros.map((pro) => {
              const d = pro as unknown as { rating?: number; reviewCount?: number; hourlyRate?: number; location?: string; jobCount?: number; isAvailable?: boolean };
              return (
                <Link
                  key={pro.uid}
                  href={`/professionals/${pro.uid}`}
                  className="flex flex-col rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-2xl font-bold shrink-0">
                      {pro.displayName?.[0] ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 truncate">{pro.displayName}</h3>
                      {d.rating ? (
                        <div className="mt-1 flex items-center gap-1.5 text-base text-slate-600">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-slate-900">{d.rating.toFixed(1)}</span>
                          <span className="text-slate-400">({d.reviewCount ?? 0})</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-extrabold text-violet-600">${d.hourlyRate ?? "—"}</div>
                      <div className="text-sm text-slate-400">/hr</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    {d.location && (
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{d.location}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-4 w-4" />
                      {d.isAvailable ? t("available_now") : t("unavailable")}
                    </span>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-600">
                      {d.jobCount ?? 0} jobs
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-5">
        <div className="rounded-[2.2rem] bg-teal-50 p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            <h2 className="text-3xl font-bold text-slate-900">{t("why_handymatch")}</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {benefits.map((item) => (
              <div key={item.titleKey} className="flex flex-col items-start gap-3 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md`}
                >
                  <Check className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{t(item.titleKey)}</h3>
                  <p className="mt-1 text-base text-slate-600">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700"
          >
            <Home className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">{t("home")}</span>
          </Link>

          <Link
            href="/search"
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
          >
            <Search className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">{t("search")}</span>
          </Link>

          <Link
            href="/messages"
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
          >
            <MessageSquare className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">{t("messages")}</span>
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
          >
            <User className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">{t("profile")}</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}