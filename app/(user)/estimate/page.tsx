"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Sparkles, Loader2, DollarSign, Clock3,
  CheckCircle2, Lightbulb, HelpCircle, CalendarDays, SendHorizonal,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface QuestionMsg {
  type: "question";
  question: string;
  options: string[];
}

interface EstimateMsg {
  type: "estimate";
  category: string;
  summary: string;
  priceRange: { min: number; max: number };
  estimatedHours: number;
  complexity: "simple" | "moderate" | "complex";
  breakdown: { item: string; amount: string }[];
  tips: string[];
  questionsToAsk: string[];
}

type ChatMessage =
  | { role: "user"; text: string }
  | { role: "ai-question"; data: QuestionMsg }
  | { role: "ai-estimate"; data: EstimateMsg };

const EXAMPLES = [
  "My kitchen tap is dripping",
  "I need to repaint my living room",
  "The electricity keeps tripping",
  "I need a new AC unit installed",
  "My bathroom tiles are cracked",
];

export default function EstimatePage() {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answeredIndexes, setAnsweredIndexes] = useState<Set<number>>(new Set());

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const complexityStyle = {
    simple:   { label: t("simple_job"),   color: "bg-green-100 text-green-700" },
    moderate: { label: t("moderate_job"), color: "bg-amber-100 text-amber-700" },
    complex:  { label: t("complex_job"),  color: "bg-red-100 text-red-700" },
  };

  const sendToAI = async (desc: string, currentAnswers: { question: string; answer: string }[]) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/chat-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc, answers: currentAnswers }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data?.error ?? t("ai_error")); return; }

      if (data.type === "question") {
        setMessages((prev) => [...prev, { role: "ai-question", data }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai-estimate", data }]);
      }
    } catch {
      setError(t("ai_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (text?: string) => {
    const desc = (text ?? input).trim();
    if (desc.length < 5) { setError(t("describe_detail")); return; }
    setError("");
    setMessages([{ role: "user", text: desc }]);
    setAnswers([]);
    setAnsweredIndexes(new Set());
    setDescription(desc);
    setInput("");
    await sendToAI(desc, []);
  };

  const handleAnswer = async (questionText: string, answer: string, msgIndex: number) => {
    if (answeredIndexes.has(msgIndex)) return;
    setAnsweredIndexes((prev) => new Set(prev).add(msgIndex));
    const newAnswers = [...answers, { question: questionText, answer }];
    setAnswers(newAnswers);
    setMessages((prev) => [...prev, { role: "user", text: answer }]);
    await sendToAI(description, newAnswers);
  };

  const handleReset = () => {
    setMessages([]);
    setAnswers([]);
    setDescription("");
    setInput("");
    setError("");
    setAnsweredIndexes(new Set());
  };

  const hasEstimate = messages.some((m) => m.role === "ai-estimate");

  return (
    <main className="flex min-h-screen flex-col bg-[#f8f8fb]">
      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <Link href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-yellow-300" /> {t("ai_estimator")}
            </div>
          </div>
          <h1 className="text-3xl font-extrabold">{t("price_estimator")}</h1>
          <p className="mt-1 text-base text-white/85">{t("estimator_desc")}</p>
        </div>
      </section>

      {/* Chat area */}
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-5 space-y-4 pb-40">

        {/* Examples — only before first message */}
        {messages.length === 0 && (
          <div>
            <p className="mb-3 text-base font-semibold text-slate-400">{t("try_example")}</p>
            <div className="flex flex-col gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleStart(ex)}
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left text-base text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => {
          if (msg.role === "user") {
            return (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-3xl rounded-br-md bg-violet-600 px-5 py-3 text-base text-white shadow-sm">
                  {msg.text}
                </div>
              </div>
            );
          }

          if (msg.role === "ai-question") {
            const q = msg.data;
            const answered = answeredIndexes.has(i);
            return (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="rounded-3xl rounded-tl-md bg-white px-5 py-3 text-base text-slate-800 shadow-sm border border-gray-100">
                    {q.question}
                  </div>
                </div>
                <div className="ml-12 flex flex-wrap gap-2">
                  {(q.options ?? []).map((opt) => (
                    <button
                      key={opt}
                      disabled={answered || loading}
                      onClick={() => handleAnswer(q.question, opt, i)}
                      className={`rounded-2xl border px-5 py-2 text-base font-semibold transition ${
                        answered
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-violet-300 bg-white text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          if (msg.role === "ai-estimate") {
            const est = msg.data;
            const complexity = complexityStyle[est.complexity] ?? complexityStyle.moderate;
            return (
              <div key={i} className="flex flex-col gap-4 mt-2">
                {/* AI intro bubble */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="rounded-3xl rounded-tl-md bg-white px-5 py-3 text-base text-slate-800 shadow-sm border border-gray-100">
                    {t("heres_estimate")}
                  </div>
                </div>

                {/* Estimate card */}
                <div className="ml-12 space-y-4">
                  {/* Summary */}
                  <div className="rounded-[1.5rem] border border-violet-200 bg-violet-50 p-5">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-violet-700">{est.category}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${complexity.color}`}>
                        {complexity.label}
                      </span>
                    </div>
                    <p className="text-base text-slate-700">{est.summary}</p>
                  </div>

                  {/* Price + time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[1.5rem] border border-gray-200 bg-white p-4 text-center shadow-sm">
                      <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900">${est.priceRange.min}–${est.priceRange.max}</div>
                      <div className="text-sm text-slate-500">{t("estimated_cost")}</div>
                    </div>
                    <div className="rounded-[1.5rem] border border-gray-200 bg-white p-4 text-center shadow-sm">
                      <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                        <Clock3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900">{est.estimatedHours}h</div>
                      <div className="text-sm text-slate-500">{t("estimated_time")}</div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-lg font-bold text-slate-900">{t("cost_breakdown")}</h3>
                    <div className="space-y-2">
                      {(est.breakdown ?? []).map((item, j) => (
                        <div key={j} className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
                          <span className="text-sm text-slate-700">{item.item}</span>
                          <span className="text-sm font-bold text-violet-600">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                      <Lightbulb className="h-5 w-5 text-amber-500" /> {t("tips_heading")}
                    </h3>
                    <div className="space-y-2">
                      {(est.tips ?? []).map((tip, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                          <p className="text-sm text-slate-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ask the pro */}
                  <div className="rounded-[1.5rem] border border-blue-200 bg-blue-50 p-5 shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                      <HelpCircle className="h-5 w-5 text-blue-500" /> {t("ask_the_pro")}
                    </h3>
                    <div className="space-y-2">
                      {(est.questionsToAsk ?? []).map((q, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700">{j + 1}</span>
                          <p className="text-sm text-slate-700">{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="rounded-[1.5rem] border border-violet-200 bg-violet-50 p-4">
                    <p className="mb-3 text-sm font-semibold text-violet-700">
                      {t("ready_book")} {est.category} {t("professional_now")}
                    </p>
                    <Link
                      href={`/search?service=${encodeURIComponent(est.category)}`}
                      onClick={() => {
                        sessionStorage.setItem("hm_booking_prefill", JSON.stringify({
                          notes: est.summary,
                          service: est.category,
                        }));
                      }}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-4 text-base font-bold text-white shadow-lg transition hover:opacity-95"
                    >
                      <CalendarDays className="h-5 w-5" />
                      {t("book_a_pro")} {est.category} Pro
                    </Link>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full rounded-[1.5rem] border border-gray-200 bg-white py-4 text-base font-semibold text-slate-600 transition hover:bg-gray-50"
                  >
                    {t("estimate_diff_job")}
                  </button>
                </div>
              </div>
            );
          }
        })}

        {/* Loading bubble */}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="rounded-3xl rounded-tl-md bg-white px-5 py-3 shadow-sm border border-gray-100">
              <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-start gap-3 rounded-2xl bg-red-50 px-5 py-4">
            <p className="text-sm text-red-600">{error}</p>
            {messages.length > 0 && (
              <button
                onClick={() => sendToAI(description, answers)}
                disabled={loading}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {t("try_again")}
              </button>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      {!hasEstimate && messages.length === 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 px-4 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder={t("describe_problem_placeholder")}
              className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-base text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <button
              onClick={() => handleStart()}
              disabled={loading || input.trim().length < 5}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg transition hover:bg-violet-700 disabled:opacity-50"
            >
              <SendHorizonal className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
