"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Menu, Search, Home, MessageSquare, User,
  Star, MapPin, Clock3, Shield, Zap,
} from "lucide-react";
import { getProfessionals } from "@/lib/firestore";
import { UserProfile } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import SideMenu from "@/components/shared/SideMenu";
import { BellButton } from "@/components/shared/CustomerNavBar";

// ── Matching algorithm ────────────────────────────────────────────────────────

type ProData = {
  services?: string[];
  bio?: string;
  location?: string;
  isAvailable?: boolean;
  hourlyRate?: number;
  jobCount?: number;
  reviewCount?: number;
  rating?: number;
};

/**
 * Score a professional against the search query and customer context.
 *
 * Max possible ≈ 110 — we cap display at 100%.
 *
 * Breakdown:
 *   Service match    0–40  (exact 40, partial 25, bio/name 10)
 *   Rating           0–25  (rating/5 × 25; new pro gets 8)
 *   Availability     0–15  (available now = 15)
 *   Experience       0–10  (job count, capped at 100 jobs)
 *   Review count     0–10  (review count, capped at 50 reviews)
 *   Location match   0–10  (same city as customer)
 */
function scoreMatch(pro: UserProfile, query: string, customerLocation: string): number {
  const p = pro as unknown as ProData;
  const q = query.toLowerCase().trim();
  let score = 0;

  // 1. Service / relevance match
  if (q) {
    const exactService = p.services?.some((s) => s.toLowerCase() === q);
    const partialService = p.services?.some(
      (s) => s.toLowerCase().includes(q) || q.includes(s.toLowerCase())
    );
    const nameMatch = pro.displayName.toLowerCase().includes(q);
    const bioMatch = p.bio?.toLowerCase().includes(q);
    const locationMatch = p.location?.toLowerCase().includes(q);

    if (exactService)        score += 40;
    else if (partialService) score += 25;
    else if (nameMatch)      score += 15;
    else if (bioMatch)       score += 10;
    else if (locationMatch)  score += 5;
    else return 0; // no relevance — exclude
  }

  // 2. Rating (0–25)
  if (p.rating) {
    score += (p.rating / 5) * 25;
  } else {
    score += 8; // new pro baseline — still shows up
  }

  // 3. Availability (0–15)
  if (p.isAvailable) score += 15;

  // 4. Experience — job count (0–10)
  score += Math.min((p.jobCount ?? 0) / 100, 1) * 10;

  // 5. Review volume (0–10)
  score += Math.min((p.reviewCount ?? 0) / 50, 1) * 10;

  // 6. Location proximity — same city (0–10)
  if (customerLocation && p.location) {
    const custCity = customerLocation.toLowerCase().split(/[-,\s]/)[0];
    const proCity = p.location.toLowerCase().split(/[-,\s]/)[0];
    if (custCity && proCity && (proCity.includes(custCity) || custCity.includes(proCity))) {
      score += 10;
    }
  }

  return score;
}

function matchPercent(score: number): number {
  return Math.min(Math.round((score / 100) * 100), 99);
}

function matchColor(pct: number): string {
  if (pct >= 80) return "bg-emerald-100 text-emerald-700";
  if (pct >= 55) return "bg-violet-100 text-violet-700";
  return "bg-gray-100 text-gray-600";
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const { user, userProfile } = useAuth();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [professionals, setProfessionals] = useState<UserProfile[]>([]);
  const [query, setQuery] = useState(searchParams.get("q") ?? searchParams.get("service") ?? "");
  const [loading, setLoading] = useState(true);

  const customerLocation = (userProfile as unknown as { location?: string })?.location ?? "";

  useEffect(() => {
    if (!user) return;
    getProfessionals()
      .then(setProfessionals)
      .finally(() => setLoading(false));
  }, [user]);

  // Scored + sorted results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return professionals
      .map((pro) => ({ pro, score: scoreMatch(pro, q, customerLocation) }))
      .filter(({ score }) => !q || score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query, professionals, customerLocation]);

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button onClick={() => setMenuOpen(true)} className="text-gray-600 transition hover:text-gray-900">
            <Menu className="h-8 w-8" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Find Providers</h1>
          <BellButton />
        </div>
      </header>

      {/* Search bar */}
      <section className="mx-auto max-w-7xl px-5 pt-5">
        <div className="flex items-center rounded-[1.7rem] border border-gray-200 bg-white px-5 py-5 shadow-sm">
          <Search className="mr-3 h-6 w-6 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search by service, name or location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-lg text-slate-700 placeholder:text-gray-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="ml-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-5 pt-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {loading ? "Loading…" : `${results.length} Provider${results.length !== 1 ? "s" : ""} Found`}
          </h2>
          {!loading && results.length > 0 && query && (
            <span className="text-base text-slate-400">Sorted by best match</span>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-2xl font-semibold text-slate-500">No professionals found.</p>
            <p className="mt-2 text-lg text-slate-400">
              {professionals.length === 0 ? "No professionals have registered yet." : "Try a different search term."}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {results.map(({ pro, score }, index) => {
            const p = pro as unknown as ProData;
            const pct = matchPercent(score);
            const isTopMatch = index === 0 && query && pct >= 70;

            return (
              <Link
                key={pro.uid}
                href={`/professionals/${pro.uid}`}
                className={`flex flex-col gap-5 rounded-[2rem] border bg-white p-5 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between ${
                  isTopMatch ? "border-violet-300 ring-1 ring-violet-200" : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="h-24 w-24 rounded-[1.5rem] bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-3xl font-bold">
                      {pro.displayName?.[0] ?? "?"}
                    </div>
                    <div className="absolute -right-2 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white shadow-md">
                      <Shield className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="pt-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-bold text-slate-900">{pro.displayName}</h3>
                      {isTopMatch && (
                        <span className="flex items-center gap-1 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-bold text-white">
                          <Zap className="h-3 w-3" /> Top Match
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.services?.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full bg-violet-50 px-3 py-0.5 text-sm font-medium text-violet-700">{s}</span>
                      ))}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-base text-slate-500">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-slate-800">{p.rating?.toFixed(1) ?? "New"}</span>
                        {p.reviewCount ? <span>({p.reviewCount})</span> : null}
                      </span>
                      {p.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />{p.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock3 className="h-4 w-4" />
                        {p.isAvailable ? "Available now" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-row items-end justify-between gap-3 md:flex-col md:items-end">
                  <div className="text-right">
                    <div className="text-4xl font-extrabold text-violet-600">
                      {p.hourlyRate ? `$${p.hourlyRate}` : "—"}
                    </div>
                    <div className="text-base text-slate-500">/hour</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-violet-50 px-4 py-1.5 text-base font-semibold text-violet-600">
                      {p.jobCount ?? 0} jobs
                    </span>
                    {query && (
                      <span className={`rounded-full px-3 py-1 text-sm font-bold ${matchColor(pct)}`}>
                        {pct}% match
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link href="/dashboard" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <Home className="h-7 w-7" /><span className="mt-1 text-base font-medium">Home</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700">
            <Search className="h-7 w-7" /><span className="mt-1 text-base font-medium">Search</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <MessageSquare className="h-7 w-7" /><span className="mt-1 text-base font-medium">Messages</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <User className="h-7 w-7" /><span className="mt-1 text-base font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
