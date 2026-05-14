"use client";

import { useState, useMemo, useEffect } from "react";
import { X, CalendarDays, MapPin, FileText, ChevronDown, Sparkles, Loader2, Clock3, Zap } from "lucide-react";
import { WeeklyAvailability } from "@/lib/types";
import { DAY_KEYS, generateSlots, getTakenHours, findAsapSlot, formatSlot } from "@/lib/booking-utils";

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
  availability?: WeeklyAvailability;
  existingBookings?: Array<{ scheduledAt: unknown; status?: string }>;
  onConfirm: (data: { service: string; scheduledAt: Date; location: string; notes: string }) => Promise<void>;
  onClose: () => void;
}


export default function BookingModal({
  professionalName, services, hourlyRate, customerLocation,
  availability, existingBookings = [],
  onConfirm, onClose,
}: Props) {
  const [service, setService] = useState(() => {
    try {
      const prefill = JSON.parse(sessionStorage.getItem("hm_booking_prefill") ?? "{}");
      const match = services.find((s) => s.toLowerCase() === (prefill.service ?? "").toLowerCase());
      return match ?? services[0] ?? "";
    } catch { return services[0] ?? ""; }
  });
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [location, setLocation] = useState(customerLocation);
  const [notes, setNotes] = useState(() => {
    try {
      const prefill = JSON.parse(sessionStorage.getItem("hm_booking_prefill") ?? "{}");
      return prefill.notes ?? "";
    } catch { return ""; }
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [classifying, setClassifying] = useState(false);
  const [suggestion, setSuggestion] = useState<ClassifyResult | null>(null);

  // Clear prefill from sessionStorage once consumed
  useEffect(() => {
    sessionStorage.removeItem("hm_booking_prefill");
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // Compute slots whenever date changes
  const { slots, dayEnabled, dayLabel } = useMemo(() => {
    if (!date) return { slots: [], dayEnabled: true, dayLabel: "" };

    const dayIndex = new Date(date + "T12:00:00").getDay(); // use noon to avoid DST issues
    const dayKey = DAY_KEYS[dayIndex];
    const label = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);

    if (!availability) {
      // No availability set — generate default 8am-6pm slots
      return { slots: generateSlots("08:00", "18:00"), dayEnabled: true, dayLabel: label };
    }

    const daySchedule = availability[dayKey];
    if (!daySchedule.enabled) {
      return { slots: [], dayEnabled: false, dayLabel: label };
    }

    return { slots: generateSlots(daySchedule.start, daySchedule.end), dayEnabled: true, dayLabel: label };
  }, [date, availability]);

  const takenHours = useMemo(
    () => (date ? getTakenHours(date, existingBookings) : new Set<string>()),
    [date, existingBookings]
  );

  // If a selected slot gets booked by someone else in real-time, clear it
  useEffect(() => {
    if (selectedSlot && takenHours.has(selectedSlot)) {
      setSelectedSlot(null);
      setError("This slot was just booked by someone else. Please choose another time.");
    }
  }, [takenHours, selectedSlot]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setSelectedSlot(null);
    setError("");
  };

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
      const match = services.find((s) => s.toLowerCase() === data.category.toLowerCase());
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
    if (!selectedSlot) { setError("Please select a time slot."); return; }
    if (!location.trim()) { setError("Please enter a location."); return; }
    setError("");
    setSubmitting(true);
    try {
      const [h] = selectedSlot.split(":").map(Number);
      const scheduledAt = new Date(`${date}T${String(h).padStart(2, "0")}:00:00`);
      await onConfirm({ service, scheduledAt, location: location.trim(), notes: notes.trim() });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send booking request. Please try again.");
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
          {/* Notes + AI classify */}
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

          {/* AI suggestion */}
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

          {/* Date picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                <CalendarDays className="inline h-4 w-4 mr-1" />Date
              </label>
              <button
                type="button"
                onClick={() => {
                  const asap = findAsapSlot(availability, existingBookings);
                  if (asap) {
                    setDate(asap.date);
                    setSelectedSlot(asap.slot);
                    setError("");
                  } else {
                    setError("No available slots found in the next 30 days.");
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-bold text-white hover:bg-emerald-600 transition"
              >
                <Zap className="h-3.5 w-3.5" /> ASAP
              </button>
            </div>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg"
            />
          </div>

          {/* Time slot picker */}
          {date && (
            <div>
              <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
                <Clock3 className="inline h-4 w-4 mr-1" />Available Time Slots — {dayLabel}
              </label>

              {!dayEnabled ? (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base text-red-700 font-medium">
                  {professionalName} is not available on {dayLabel}s. Please choose a different date.
                </div>
              ) : slots.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 border border-gray-200 px-5 py-4 text-base text-slate-500">
                  No slots available for this day.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => {
                    const taken = takenHours.has(slot);
                    const selected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={taken}
                        onClick={() => { setSelectedSlot(slot); setError(""); }}
                        className={`rounded-2xl py-3 text-base font-semibold transition ${
                          taken
                            ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed"
                            : selected
                            ? "bg-violet-600 text-white shadow-md"
                            : "bg-gray-50 text-slate-700 border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                        }`}
                      >
                        {taken ? (
                          <span>{formatSlot(slot)}</span>
                        ) : (
                          formatSlot(slot)
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

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
