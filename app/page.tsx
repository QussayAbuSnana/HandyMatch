"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Category =
  | "Plumber"
  | "Electrician"
  | "Carpenter"
  | "Painter"
  | "Handyman"
  | "Cleaner";

const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: "Plumber", label: "Plumber", emoji: "🔧" },
  { key: "Electrician", label: "Electrician", emoji: "💡" },
  { key: "Carpenter", label: "Carpenter", emoji: "🪚" },
  { key: "Painter", label: "Painter", emoji: "🎨" },
  { key: "Handyman", label: "Handyman", emoji: "🛠️" },
  { key: "Cleaner", label: "Cleaner", emoji: "🧹" },
];

type ProCard = {
  name: string;
  category: Category;
  city: string;
  ratingAvg: number;
  ratingCount: number;
  hourlyRate: number;
};

const FEATURED_PROS: ProCard[] = [
  { name: "Ahmad S.", category: "Plumber", city: "Jerusalem", ratingAvg: 4.8, ratingCount: 132, hourlyRate: 220 },
  { name: "Noam L.", category: "Electrician", city: "Tel Aviv", ratingAvg: 4.7, ratingCount: 98, hourlyRate: 250 },
  { name: "Rami K.", category: "Carpenter", city: "Haifa", ratingAvg: 4.9, ratingCount: 76, hourlyRate: 280 },
];

function classNames(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

export default function HomePage() {
  const [category, setCategory] = useState<Category>("Plumber");
  const [city, setCity] = useState<string>("Jerusalem");

  const matchLink = useMemo(() => {
    const q = new URLSearchParams({ category, city }).toString();
    return `/match?${q}`;
  }, [category, city]);

  

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white font-bold">
              H
            </div>
            <div className="leading-tight">
              <div className="font-semibold">HandyMatch</div>
              <div className="text-xs text-slate-500">Find trusted pros, fast</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#categories" className="text-sm text-slate-700 hover:text-slate-900">
              Categories
            </Link>
            <Link href="#how" className="text-sm text-slate-700 hover:text-slate-900">
              How it works
            </Link>
            <Link href="#pros" className="text-sm text-slate-700 hover:text-slate-900">
              Pros
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-6xl px-4 pt-12 pb-10">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                <span className="font-medium">New</span>
                <span className="text-slate-500">Fair matching • Real ratings • Fast booking</span>
              </div>

              <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
                Find the right <span className="underline decoration-slate-300">professional</span> in minutes.
              </h1>

              <p className="mt-4 text-slate-600">
                HandyMatch connects customers with trusted pros (plumbers, electricians, carpenters, and more)
                using transparent profiles and simple matching.
              </p>

              {/* Search Card */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 md:grid-cols-3 md:items-end">
                  <div className="md:col-span-1">
                    <label className="text-xs font-medium text-slate-600">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-1">
                    <label className="text-xs font-medium text-slate-600">City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g., Jerusalem"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <Link
                    href={matchLink}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Search
                  </Link>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  Tip: Start with a category + city. You can filter more on the results page.
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">✅ Verified profiles</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">⭐ Transparent ratings</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">⚡ Quick matching</span>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Today’s Top Matches</div>
                  <div className="text-xs text-slate-500">Mock preview</div>
                </div>

                <div className="mt-4 space-y-3">
                  {FEATURED_PROS.map((p) => (
                    <div
                      key={p.name}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-sm text-slate-600">
                            {p.category} • {p.city}
                          </div>
                          <div className="mt-2 text-sm text-slate-700">
                            ⭐ {p.ratingAvg.toFixed(1)} <span className="text-slate-500">({p.ratingCount})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">₪{p.hourlyRate}/hr</div>
                          <div className="mt-2 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
                            View
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  “This is the exact MVP feel: fast search → list of pros → details.”
                </div>
              </div>

              <div className="pointer-events-none absolute -top-6 -right-6 hidden h-24 w-24 rounded-3xl border border-slate-200 bg-white md:block" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-3xl border border-slate-200 bg-white md:block" />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="border-t border-slate-200 bg-slate-50/60">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold">Browse categories</h2>
                <p className="mt-1 text-slate-600">Start with a service type. Keep it simple for MVP.</p>
              </div>
              <Link href="/categories" className="text-sm font-medium text-slate-900 hover:underline">
                View all
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.key}
                  href={`/match?category=${encodeURIComponent(c.key)}&city=${encodeURIComponent(city)}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-2xl">{c.emoji}</div>
                    <div className="text-xs text-slate-500 group-hover:text-slate-700">Open →</div>
                  </div>
                  <div className="mt-3 font-medium">{c.label}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Find {c.label.toLowerCase()}s near you with real ratings.
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <p className="mt-2 text-slate-600">Three simple steps. We’ll refine later.</p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                { title: "Tell us what you need", body: "Pick category + city. Add details later in the request page." },
                { title: "Get matched fast", body: "We show relevant pros based on availability, distance, and ratings." },
                { title: "Choose with confidence", body: "Transparent profiles, real reviews, and clear pricing info." },
              ].map((x) => (
                <div key={x.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="text-sm font-semibold">{x.title}</div>
                  <div className="mt-2 text-sm text-slate-600">{x.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pros section */}
        <section id="pros" className="border-t border-slate-200 bg-slate-50/60">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold">Featured professionals</h2>
                <p className="mt-1 text-slate-600">Mock data now. Later we’ll load from the API.</p>
              </div>
              <Link href={matchLink} className="text-sm font-medium text-slate-900 hover:underline">
                Search now
              </Link>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {FEATURED_PROS.map((p) => (
                <div key={p.name} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-slate-600">
                        {p.category} • {p.city}
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      ₪{p.hourlyRate}/hr
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-slate-700">
                    ⭐ {p.ratingAvg.toFixed(1)} <span className="text-slate-500">({p.ratingCount} reviews)</span>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Link
                      href={`/pros/${encodeURIComponent(p.name)}`}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-800 hover:bg-slate-50"
                    >
                      View profile
                    </Link>
                    <Link
                      href={`/request?category=${encodeURIComponent(p.category)}&city=${encodeURIComponent(p.city)}`}
                      className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Request
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white md:p-10">
              <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <div>
                  <h3 className="text-2xl font-semibold">Are you a professional?</h3>
                  <p className="mt-2 text-white/80">
                    Create your profile and start getting matched with real customers.
                  </p>
                </div>
                <div className="flex gap-2 md:justify-end">
                  <Link
                    href="/auth/register?role=PRO"
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90"
                  >
                    Join as Pro
                  </Link>
                  <Link
                    href="/auth/register?role=CLIENT"
                    className="rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Join as Client
                  </Link>
                </div>
              </div>
            </div>

            <footer className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} HandyMatch. All rights reserved.</div>
              <div className="flex gap-4">
                <Link className="hover:underline" href="/privacy">Privacy</Link>
                <Link className="hover:underline" href="/terms">Terms</Link>
                <Link className="hover:underline" href="/contact">Contact</Link>
              </div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
  
}
