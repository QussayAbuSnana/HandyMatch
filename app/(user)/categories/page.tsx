"use client";

import Link from "next/link";
import { ArrowLeft, Droplets, Zap, Hammer, Paintbrush, Wrench, Wind, Flower2, Shield, Tv, Truck, Scissors, ChefHat } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function CategoriesPage() {
  const { t } = useLanguage();

  const categories = [
    { nameKey: "plumbing",    descKey: "plumbing_desc",    icon: Droplets,   gradient: "from-violet-500 to-purple-500",  query: "plumbing" },
    { nameKey: "electrical",  descKey: "electrical_desc",  icon: Zap,        gradient: "from-orange-400 to-orange-600",  query: "electrical" },
    { nameKey: "carpentry",   descKey: "carpentry_desc",   icon: Hammer,     gradient: "from-orange-500 to-red-500",     query: "carpentry" },
    { nameKey: "painting",    descKey: "painting_desc",    icon: Paintbrush, gradient: "from-sky-500 to-cyan-500",       query: "painting" },
    { nameKey: "hvac",        descKey: "hvac_desc",        icon: Wind,       gradient: "from-blue-400 to-indigo-500",    query: "hvac" },
    { nameKey: "handyman",    descKey: "handyman_desc",    icon: Wrench,     gradient: "from-slate-500 to-slate-700",    query: "handyman" },
    { nameKey: "gardening",   descKey: "gardening_desc",   icon: Flower2,    gradient: "from-green-500 to-emerald-600",  query: "gardening" },
    { nameKey: "security",    descKey: "security_desc",    icon: Shield,     gradient: "from-red-500 to-rose-600",       query: "security" },
    { nameKey: "tech_support",descKey: "tech_support_desc",icon: Tv,         gradient: "from-purple-500 to-fuchsia-500", query: "tech" },
    { nameKey: "moving",      descKey: "moving_desc",      icon: Truck,      gradient: "from-teal-500 to-cyan-600",      query: "moving" },
    { nameKey: "cleaning",    descKey: "cleaning_desc",    icon: Scissors,   gradient: "from-pink-500 to-rose-500",      query: "cleaning" },
    { nameKey: "cooking",     descKey: "cooking_desc",     icon: ChefHat,    gradient: "from-amber-400 to-orange-500",   query: "cooking" },
  ];

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-10 pt-6 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">{t("categories_label")}</div>
          </div>
          <h1 className="text-4xl font-extrabold md:text-5xl">{t("all_categories")}</h1>
          <p className="mt-3 text-lg text-white/85">{t("choose_service")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-8">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.nameKey}
                href={`/search?service=${cat.query}`}
                className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-[1.2rem] bg-gradient-to-br ${cat.gradient} text-white shadow-md`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{t(cat.nameKey)}</h3>
                <p className="mt-1 text-base text-slate-500">{t(cat.descKey)}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
