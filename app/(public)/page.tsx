"use client";

import Link from "next/link";
import { Zap, Shield, Star, Clock3, Sparkles, ChevronRight, Hammer, Droplets, Paintbrush, Wrench } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function LandingPage() {
  const { t } = useLanguage();

  const features = [
    { icon: Sparkles, titleKey: "describe_problem",    bodyKey: "describe_problem_body",    gradient: "from-fuchsia-500 to-violet-600" },
    { icon: Clock3,   titleKey: "get_matched",         bodyKey: "get_matched_body",          gradient: "from-violet-500 to-indigo-600" },
    { icon: Shield,   titleKey: "verified_transparent",bodyKey: "verified_transparent_body", gradient: "from-emerald-500 to-teal-600" },
  ];

  const categories = [
    { icon: Droplets,   labelKey: "plumbing",   gradient: "from-violet-500 to-purple-500" },
    { icon: Zap,        labelKey: "electrical",  gradient: "from-orange-400 to-orange-600" },
    { icon: Paintbrush, labelKey: "painting",    gradient: "from-sky-500 to-cyan-500" },
    { icon: Wrench,     labelKey: "carpentry",   gradient: "from-rose-500 to-pink-500" },
  ];

  return (
    <main className="min-h-screen bg-[#f8f8fb]">

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow">
              <Hammer className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-violet-600">HandyMatch</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="rounded-xl px-4 py-2 text-base font-semibold text-slate-700 hover:bg-gray-100 transition">
              {t("login")}
            </Link>
            <Link href="/register" className="rounded-xl bg-violet-600 px-4 py-2 text-base font-semibold text-white hover:bg-violet-700 transition">
              {t("signup")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-16 pt-12 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-base font-semibold backdrop-blur">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            AI-powered home services
          </div>
          <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
            {t("landing_hero")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-xl text-white/85 md:text-2xl">
            {t("landing_sub")}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/login" className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-white px-8 py-5 text-xl font-extrabold text-violet-700 shadow-xl hover:shadow-2xl transition sm:w-auto">
              <Zap className="h-6 w-6 text-emerald-500" />
              {t("book_now")}
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link href="/login" className="flex w-full items-center justify-center gap-2 rounded-[2rem] border-2 border-white/40 bg-white/10 px-8 py-5 text-xl font-bold text-white backdrop-blur hover:bg-white/20 transition sm:w-auto">
              {t("join_pro")}
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { valueKey: "500+", labelKey: "verified_pros" },
              { valueKey: "4.8★", labelKey: "avg_rating" },
              { valueKey: "10k+", labelKey: "jobs_done" },
            ].map((s) => (
              <div key={s.labelKey} className="rounded-[2rem] border border-white/20 bg-white/10 py-6 text-center backdrop-blur">
                <div className="text-3xl font-extrabold md:text-4xl">{s.valueKey}</div>
                <div className="mt-1 text-base text-white/80">{t(s.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section className="mx-auto -mt-6 max-w-4xl px-5">
        <div className="grid grid-cols-4 gap-3">
          {categories.map(({ icon: Icon, labelKey, gradient }) => (
            <Link key={labelKey} href="/login" className="flex flex-col items-center gap-3 rounded-[2rem] border border-gray-200 bg-white px-4 py-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
                <Icon className="h-7 w-7" />
              </div>
              <span className="text-base font-bold text-slate-800">{t(labelKey)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-16 max-w-5xl px-5">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900">{t("how_it_works")}</h2>
          <p className="mt-3 text-xl text-slate-500">{t("from_problem_to_booked")}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.titleKey} className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} text-white shadow-md`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg font-extrabold text-slate-500">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t(f.titleKey)}</h3>
                <p className="text-lg text-slate-500 leading-relaxed">{t(f.bodyKey)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto mt-12 max-w-5xl px-5">
        <div className="rounded-[2.5rem] bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100 p-10 text-center shadow-sm">
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className="h-7 w-7 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-2xl font-semibold text-slate-800 max-w-2xl mx-auto leading-relaxed">
            &quot;Fixed my leaking tap the same morning I booked. The pro arrived on time, explained everything, and the price matched the estimate exactly.&quot;
          </p>
          <p className="mt-5 text-lg font-bold text-violet-600">Sarah M. · Tel Aviv</p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-12 mb-16 max-w-3xl px-5 text-center">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">{t("ready_to_start")}</h2>
        <p className="text-xl text-slate-500 mb-8">{t("ready_sub")}</p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/register" className="flex w-full items-center justify-center gap-2 rounded-[2rem] bg-violet-600 px-10 py-5 text-xl font-extrabold text-white shadow-lg hover:bg-violet-700 transition sm:w-auto">
            {t("create_account")} <ChevronRight className="h-5 w-5" />
          </Link>
          <Link href="/login" className="flex w-full items-center justify-center rounded-[2rem] border border-gray-200 bg-white px-10 py-5 text-xl font-semibold text-slate-700 hover:bg-gray-50 transition sm:w-auto">
            {t("login")}
          </Link>
        </div>
      </section>

    </main>
  );
}
