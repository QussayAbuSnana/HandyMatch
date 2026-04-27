"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Menu, Search, SlidersHorizontal, Home, MessageSquare, User, Star, MapPin, Clock3, Shield } from "lucide-react";
import { getProfessionals } from "@/lib/firestore";
import { UserProfile } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import SideMenu from "@/components/shared/SideMenu";
import { BellButton } from "@/components/shared/CustomerNavBar";

export default function SearchPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [professionals, setProfessionals] = useState<UserProfile[]>([]);
  const [filtered, setFiltered] = useState<UserProfile[]>([]);
  const [query, setQuery] = useState(searchParams.get("q") ?? searchParams.get("service") ?? "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getProfessionals()
      .then((data) => {
        setProfessionals(data);
        setFiltered(data);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(professionals);
      return;
    }
    setFiltered(
      professionals.filter((p) => {
        const pro = p as unknown as { services?: string[]; bio?: string; location?: string };
        return (
          p.displayName.toLowerCase().includes(q) ||
          pro.services?.some((s) => s.toLowerCase().includes(q)) ||
          pro.bio?.toLowerCase().includes(q) ||
          pro.location?.toLowerCase().includes(q)
        );
      })
    );
  }, [query, professionals]);

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button onClick={() => setMenuOpen(true)} className="text-gray-600 transition hover:text-gray-900"><Menu className="h-8 w-8" /></button>
          <h1 className="text-3xl font-bold text-slate-900">Find Providers</h1>
          <BellButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center rounded-[1.7rem] border border-gray-200 bg-white px-5 py-5 shadow-sm">
            <Search className="mr-3 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or service…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-lg text-slate-700 placeholder:text-gray-400 outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-3 rounded-[1.7rem] border border-gray-200 bg-white px-6 py-5 text-xl font-semibold text-slate-700 shadow-sm transition hover:bg-gray-50">
            <SlidersHorizontal className="h-6 w-6" />Filters
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">
            {loading ? "Loading…" : `${filtered.length} Provider${filtered.length !== 1 ? "s" : ""} Found`}
          </h2>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-2xl font-semibold text-slate-500">No professionals found.</p>
            <p className="mt-2 text-lg text-slate-400">
              {professionals.length === 0
                ? "No professionals have registered yet."
                : "Try a different search term."}
            </p>
          </div>
        )}

        <div className="space-y-5">
          {filtered.map((pro) => {
            const p = pro as unknown as {
              rating?: number; reviewCount?: number; location?: string;
              isAvailable?: boolean; hourlyRate?: number; jobCount?: number;
              services?: string[];
            };
            return (
              <Link
                key={pro.uid}
                href={`/professionals/${pro.uid}`}
                className="flex flex-col gap-5 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-[1.5rem] bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-3xl font-bold">
                      {pro.displayName?.[0] ?? "?"}
                    </div>
                    <div className="absolute -right-2 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white shadow-md">
                      <Shield className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="pt-1">
                    <h3 className="text-2xl font-bold text-slate-900">{pro.displayName}</h3>

                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.services?.slice(0, 2).map((s) => (
                        <span key={s} className="rounded-full bg-violet-50 px-3 py-0.5 text-sm font-medium text-violet-700">{s}</span>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-lg text-slate-600">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-slate-900">{p.rating?.toFixed(1) ?? "New"}</span>
                      {p.reviewCount ? <span>({p.reviewCount})</span> : null}
                    </div>

                    {p.location && (
                      <div className="mt-1 flex items-center gap-2 text-lg text-slate-500">
                        <MapPin className="h-5 w-5" /><span>{p.location}</span>
                      </div>
                    )}

                    <div className="mt-1 flex items-center gap-2 text-lg text-slate-500">
                      <Clock3 className="h-5 w-5" />
                      <span>{p.isAvailable ? "Available now" : "Currently unavailable"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-end justify-between md:flex-col md:items-end">
                  <div className="text-right">
                    <div className="text-4xl font-extrabold text-violet-600">
                      {p.hourlyRate ? `$${p.hourlyRate}` : "—"}
                    </div>
                    <div className="text-lg text-slate-500">/hour</div>
                  </div>
                  <div className="rounded-full bg-violet-50 px-4 py-2 text-lg font-semibold text-violet-600">
                    {p.jobCount ?? 0} jobs
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
