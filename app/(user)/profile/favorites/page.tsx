"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Star, MapPin, Clock3 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getProfessionals } from "@/lib/firestore";
import { UserProfile } from "@/lib/types";

// Favorites are stored in localStorage for now (no backend collection yet)
const STORAGE_KEY = "hm_favorites";

function getFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}

export function toggleFavorite(uid: string) {
  const ids = getFavoriteIds();
  const next = ids.includes(uid) ? ids.filter((id) => id !== uid) : [...ids, uid];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function isFavorite(uid: string): boolean {
  return getFavoriteIds().includes(uid);
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const [pros, setPros] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getProfessionals().then((all) => {
      const ids = getFavoriteIds();
      setPros(all.filter((p) => ids.includes(p.uid)));
      setLoading(false);
    });
  }, [user]);

  const handleUnfavorite = (uid: string) => {
    toggleFavorite(uid);
    setPros((prev) => prev.filter((p) => p.uid !== uid));
  };

  const proData = (p: UserProfile) => p as unknown as {
    rating?: number; reviewCount?: number; hourlyRate?: number; location?: string; services?: string[];
  };

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-12">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-5">
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Favorite Providers</h1>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          </div>
        ) : pros.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Heart className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <p className="text-2xl font-semibold text-slate-500">No favorites yet.</p>
            <p className="mt-2 text-lg text-slate-400">Tap the heart on a professional&apos;s profile to save them here.</p>
            <Link href="/search" className="mt-6 inline-block rounded-2xl bg-violet-600 px-8 py-4 text-xl font-bold text-white hover:bg-violet-700 transition">
              Browse Professionals
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pros.map((pro) => {
              const d = proData(pro);
              return (
                <div key={pro.uid} className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/professionals/${pro.uid}`} className="flex items-start gap-4 flex-1">
                      <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-3xl font-bold shrink-0">
                        {pro.displayName?.[0] ?? "?"}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{pro.displayName}</h3>
                        {d.services && d.services.length > 0 && (
                          <p className="mt-1 text-lg text-slate-600">{d.services.slice(0, 2).join(", ")}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-4 text-lg text-slate-500">
                          {d.rating ? (
                            <span className="flex items-center gap-1">
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              {d.rating.toFixed(1)} ({d.reviewCount ?? 0})
                            </span>
                          ) : null}
                          {d.location && (
                            <span className="flex items-center gap-1"><MapPin className="h-5 w-5" />{d.location}</span>
                          )}
                          {d.hourlyRate && (
                            <span className="flex items-center gap-1"><Clock3 className="h-5 w-5" />${d.hourlyRate}/hr</span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleUnfavorite(pro.uid)}
                      className="text-red-400 hover:text-red-600 transition mt-1"
                    >
                      <Heart className="h-7 w-7 fill-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
