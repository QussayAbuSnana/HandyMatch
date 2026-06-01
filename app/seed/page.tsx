"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, Database } from "lucide-react";

export default function SeedPage() {
  if (process.env.NODE_ENV === "production") {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 text-xl">Not available in production.</div>;
  }

  return <SeedUI />;
}

function SeedUI() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  const handleSeed = async () => {
    if (!confirm("This will create all demo accounts and data in Firebase. Continue?")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Seed failed");
      setResult(data);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8fb] flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-[2.5rem] bg-white shadow-xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Database className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Demo Seed</h1>
            <p className="text-base text-slate-500">Populate Firebase with realistic demo data</p>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5 text-base text-slate-600 space-y-1">
          <p>Will create:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-slate-700 font-medium">
            <li>12 professionals (plumber, electrician, cleaner…)</li>
            <li>6 customers with Israeli names</li>
            <li>16 bookings (pending / accepted / completed)</li>
            <li>11 reviews with comments</li>
            <li>4 conversations with messages</li>
            <li>8 notifications</li>
          </ul>
        </div>

        {status === "idle" && (
          <button
            onClick={handleSeed}
            className="w-full rounded-2xl bg-violet-600 py-4 text-xl font-bold text-white hover:bg-violet-700 transition"
          >
            Run Seed
          </button>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
            <p className="text-lg font-semibold text-slate-700">Creating accounts and data…</p>
            <p className="text-sm text-slate-400">This takes 20–40 seconds</p>
          </div>
        )}

        {status === "done" && result && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
              <p className="text-xl font-bold">Seed complete!</p>
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-base text-slate-700 space-y-1">
              {Object.entries(result)
                .filter(([k]) => k !== "logins" && k !== "success")
                .map(([k, v]) => (
                  <p key={k}><span className="font-semibold capitalize">{k}:</span> {String(v)}</p>
                ))}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Demo Login Accounts</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(result.logins as Array<{ name: string; email: string; password: string; role: string }>)
                  .filter((l) => l.role === "customer")
                  .slice(0, 2)
                  .map((l) => (
                    <div key={l.email} className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
                      <p className="font-bold text-blue-800">{l.name} <span className="text-xs font-normal bg-blue-200 rounded-full px-2 py-0.5 ml-1">customer</span></p>
                      <p className="text-sm text-blue-700">{l.email}</p>
                      <p className="text-sm text-blue-600">Password: <span className="font-mono font-bold">{l.password}</span></p>
                    </div>
                  ))}
                {(result.logins as Array<{ name: string; email: string; password: string; role: string }>)
                  .filter((l) => l.role === "professional")
                  .slice(0, 2)
                  .map((l) => (
                    <div key={l.email} className="rounded-xl bg-violet-50 border border-violet-200 px-4 py-3">
                      <p className="font-bold text-violet-800">{l.name} <span className="text-xs font-normal bg-violet-200 rounded-full px-2 py-0.5 ml-1">professional</span></p>
                      <p className="text-sm text-violet-700">{l.email}</p>
                      <p className="text-sm text-violet-600">Password: <span className="font-mono font-bold">{l.password}</span></p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <XCircle className="h-8 w-8" />
              <p className="text-xl font-bold">Seed failed</p>
            </div>
            <p className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-base text-red-700">{error}</p>
            <button
              onClick={() => setStatus("idle")}
              className="w-full rounded-2xl border border-gray-200 py-3 text-lg font-semibold text-slate-700 hover:bg-gray-50 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
