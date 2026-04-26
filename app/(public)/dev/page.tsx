"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Database } from "lucide-react";

type SeedResult = {
  success: boolean;
  professionals?: number;
  customers?: number;
  bookings?: number;
  reviews?: number;
  logins?: { email: string; password: string; role: string }[];
  error?: string;
};

export default function DevSeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: "Network error. Is the dev server running?" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 mb-4">
            <Database className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Seed Database</h1>
          <p className="mt-2 text-slate-400 text-lg">
            Creates 6 professionals, 2 customers, 4 bookings, and 3 reviews.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-2xl">
          {!result && (
            <button
              onClick={handleSeed}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-violet-600 py-5 text-xl font-bold text-white hover:bg-violet-700 transition disabled:opacity-60"
            >
              {loading
                ? <><Loader2 className="h-6 w-6 animate-spin" /> Seeding…</>
                : <><Database className="h-6 w-6" /> Run Seed</>}
            </button>
          )}

          {result?.success && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-5">
                <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
                <div>
                  <p className="text-xl font-bold text-green-800">Database seeded!</p>
                  <p className="text-green-700">
                    {result.professionals} pros · {result.customers} customers · {result.bookings} bookings · {result.reviews} reviews
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Test Accounts</p>
                <div className="space-y-2">
                  {result.logins?.map((l) => (
                    <div key={l.email} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <div>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold mr-2 ${l.role === "professional" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>
                          {l.role}
                        </span>
                        <span className="font-mono text-sm text-slate-800">{l.email}</span>
                      </div>
                      <span className="font-mono text-sm text-slate-500">{l.password}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setResult(null)}
                className="w-full rounded-2xl border border-gray-200 py-4 text-lg font-semibold text-slate-600 hover:bg-gray-50 transition"
              >
                Seed Again
              </button>
            </div>
          )}

          {result && !result.success && (
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-5">
                <AlertCircle className="h-8 w-8 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xl font-bold text-red-800">Seed failed</p>
                  <p className="mt-1 font-mono text-sm text-red-700 break-all">{result.error}</p>
                </div>
              </div>
              <button
                onClick={() => setResult(null)}
                className="w-full rounded-2xl border border-gray-200 py-4 text-lg font-semibold text-slate-600 hover:bg-gray-50 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
