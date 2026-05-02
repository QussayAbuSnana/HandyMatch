"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Sparkles, Loader2, DollarSign, Clock3,
  CheckCircle2, Lightbulb, HelpCircle, ChevronRight, Search,
} from "lucide-react";

interface Estimate {
  category: string;
  summary: string;
  priceRange: { min: number; max: number };
  estimatedHours: number;
  complexity: "simple" | "moderate" | "complex";
  breakdown: { item: string; amount: string }[];
  tips: string[];
  questionsToAsk: string[];
}

const COMPLEXITY_STYLE = {
  simple:   { label: "Simple Job",   color: "bg-green-100 text-green-700" },
  moderate: { label: "Moderate Job", color: "bg-amber-100 text-amber-700" },
  complex:  { label: "Complex Job",  color: "bg-red-100 text-red-700" },
};

const EXAMPLES = [
  "My kitchen tap is dripping and needs replacing",
  "I need to repaint my living room walls",
  "The electricity keeps tripping in my apartment",
  "I need a new AC unit installed",
  "My bathroom tiles are cracked and need fixing",
];

export default function EstimatePage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState("");

  const handleEstimate = async (desc?: string) => {
    const text = (desc ?? description).trim();
    if (text.length < 5) { setError("Please describe your job in a bit more detail."); return; }
    setError("");
    setLoading(true);
    setEstimate(null);
    try {
      const res = await fetch("/api/estimate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not generate an estimate. Please try again.");
        return;
      }
      setEstimate(data as Estimate);
      if (desc) setDescription(desc);
    } catch {
      setError("Could not generate an estimate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-10 pt-6 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-yellow-300" /> AI Estimator
            </div>
          </div>
          <h1 className="text-4xl font-extrabold md:text-5xl">Price Estimator</h1>
          <p className="mt-3 text-lg text-white/85">
            Describe your job in plain language — AI will estimate the cost before you hire anyone.
          </p>
        </div>
      </section>

      {/* Input */}
      <section className="mx-auto -mt-5 max-w-3xl px-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <label className="mb-3 block text-lg font-bold text-slate-900">What needs to be done?</label>
          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); setEstimate(null); setError(""); }}
            placeholder="e.g. My bathroom tap is leaking and the water pressure is low…"
            rows={4}
            className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-lg text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />

          {error && <p className="mt-2 text-base text-red-600">{error}</p>}

          <button
            onClick={() => handleEstimate()}
            disabled={loading || !description.trim()}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-r from-violet-600 to-fuchsia-500 py-5 text-xl font-bold text-white shadow-lg transition hover:opacity-95 disabled:opacity-50"
          >
            {loading
              ? <><Loader2 className="h-6 w-6 animate-spin" /> Estimating…</>
              : <><Sparkles className="h-6 w-6" /> Get AI Estimate</>
            }
          </button>
        </div>
      </section>

      {/* Example prompts */}
      {!estimate && !loading && (
        <section className="mx-auto max-w-3xl px-5 pt-6">
          <p className="mb-3 text-lg font-semibold text-slate-500">Try an example:</p>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => handleEstimate(ex)}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left text-lg text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
              >
                <span>{ex}</span>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      {estimate && (
        <section className="mx-auto max-w-3xl px-5 pt-6 space-y-5">

          {/* Summary card */}
          <div className="rounded-[2rem] border border-violet-200 bg-violet-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="text-lg font-bold text-violet-700">{estimate.category}</span>
              <span className={`rounded-full px-4 py-1 text-sm font-semibold ${COMPLEXITY_STYLE[estimate.complexity]?.color}`}>
                {COMPLEXITY_STYLE[estimate.complexity]?.label}
              </span>
            </div>
            <p className="text-xl text-slate-700 leading-relaxed">{estimate.summary}</p>
          </div>

          {/* Price + time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                <DollarSign className="h-7 w-7 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                ${estimate.priceRange.min}–${estimate.priceRange.max}
              </div>
              <div className="mt-1 text-lg text-slate-500">Estimated Cost</div>
            </div>
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                <Clock3 className="h-7 w-7 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {estimate.estimatedHours}h
              </div>
              <div className="mt-1 text-lg text-slate-500">Estimated Time</div>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold text-slate-900">Cost Breakdown</h3>
            <div className="space-y-3">
              {estimate.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
                  <span className="text-lg text-slate-700">{item.item}</span>
                  <span className="text-lg font-bold text-violet-600">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Lightbulb className="h-6 w-6 text-amber-500" /> Tips
            </h3>
            <div className="space-y-3">
              {estimate.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <p className="text-lg text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Questions to ask */}
          <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900">
              <HelpCircle className="h-6 w-6 text-blue-500" /> Ask the Pro
            </h3>
            <div className="space-y-3">
              {estimate.questionsToAsk.map((q, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-200 text-sm font-bold text-blue-700">{i + 1}</span>
                  <p className="text-lg text-slate-700">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/search?q=${encodeURIComponent(estimate.category)}`}
            className="flex items-center justify-center gap-3 rounded-[2rem] bg-gradient-to-r from-violet-600 to-fuchsia-500 py-6 text-xl font-bold text-white shadow-lg transition hover:opacity-95"
          >
            <Search className="h-6 w-6" />
            Find a {estimate.category} Professional
          </Link>

          {/* Try again */}
          <button
            onClick={() => { setEstimate(null); setDescription(""); }}
            className="w-full rounded-[1.5rem] border border-gray-200 bg-white py-4 text-lg font-semibold text-slate-600 transition hover:bg-gray-50"
          >
            Estimate a different job
          </button>
        </section>
      )}
    </main>
  );
}
