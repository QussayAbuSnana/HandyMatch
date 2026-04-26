"use client";

import { useState } from "react";
import { X, CalendarDays, MapPin, FileText, ChevronDown, Sparkles, Loader2 } from "lucide-react";

interface ClassifyResult {
  category: string;
  summary: string;
  estimatedHours: number;
  priceRange: { min: number; max: number };
}

interface Props {
  professionalName: string;
  services: string[];
  hourlyRate: number;
  customerLocation: string;
  onConfirm: (data: { service: string; scheduledAt: Date; location: string; notes: string }) => Promise<void>;
  onClose: () => void;
}

export default function BookingModal({
  professionalName, services, hourlyRate, customerLocation, onConfirm, onClose,
}: Props) {
  const [service, setService] = useState(services[0] ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [location, setLocation] = useState(customerLocation);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [classifying, setClassifying] = useState(false);
  const [suggestion, setSuggestion] = useState<ClassifyResult | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const handleClassify = async () => {
    if (!notes.trim()) { setError("Describe the job first, then click Classify."); return; }
    setError("");
    setClassifying(true);
    setSuggestion(null);
    try {
      const res = await fetch("/api/classify-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: notes }),
      });
      if (!res.ok) throw new Error();
      const data: ClassifyResult = await res.json();
      setSuggestion(data);
      // Auto-select matched service if it exists in pro's list
      const match = services.find(
        (s) => s.toLowerCase() === data.category.toLowerCase()
      );
      if (match) setService(match);
    } catch {
      setError("Could not classify the job. Try again or select a service manually.");
    } finally {
      setClassifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) { setError("Please select a service."); return; }
    if (!date) { setError("Please pick a date."); return; }
    if (!location.trim()) { setError("Please enter a location."); return; }
    setError("");
    setSubmitting(true);
    try {
      const scheduledAt = new Date(`${date}T${time}:00`);
      await onConfirm({ service, scheduledAt, location: location.trim(), notes: notes.trim() });
    } catch {
      setError("Failed to send booking request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-[2.5rem] bg-white shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Book Service</h2>
            <p className="text-lg text-slate-500 mt-1">with {professionalName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Notes first — drives AI classify */}
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              <FileText className="inline h-4 w-4 mr-1" />Describe the job
            </label>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setSuggestion(null); }}
              placeholder="e.g. My kitchen tap is leaking and needs replacing…"
              rows={3}
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg resize-none"
            />
            <button
              type="button"
              onClick={handleClassify}
              disabled={classifying || !notes.trim()}
              className="mt-2 flex items-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-2 text-base font-semibold text-white hover:bg-fuchsia-700 transition disabled:opacity-50"
            >
              {classifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {classifying ? "Classifying…" : "Auto-classify with AI"}
            </button>
          </div>

          {/* AI suggestion card */}
          {suggestion && (
            <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 px-5 py-4 space-y-1">
              <p className="text-sm font-bold text-fuchsia-700 uppercase tracking-wide">AI Suggestion</p>
              <p className="text-lg font-semibold text-slate-800">{suggestion.summary}</p>
              <p className="text-base text-slate-600">
                Category: <span className="font-semibold">{suggestion.category}</span>
                {" · "}Est. {suggestion.estimatedHours}h
                {" · "}${suggestion.priceRange.min}–${suggestion.priceRange.max}
              </p>
            </div>
          )}

          {/* Service picker */}
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">Service</label>
            <div className="relative">
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full appearance-none px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg pr-10"
              >
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
                <CalendarDays className="inline h-4 w-4 mr-1" />Date
              </label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />Service Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your address"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg"
            />
          </div>

          {/* Price */}
          <div className="rounded-2xl bg-violet-50 px-5 py-4">
            <p className="text-lg text-slate-600">
              Rate: <span className="font-bold text-slate-900">${hourlyRate}/hr</span>
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-gray-200 text-xl font-semibold text-slate-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xl font-bold shadow-md hover:opacity-95 transition disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
