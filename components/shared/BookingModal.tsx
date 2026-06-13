"use client";

import { useState, useMemo, useEffect } from "react";
import { X, CalendarDays, MapPin, FileText, ChevronDown, Sparkles, Loader2, Clock3, Zap } from "lucide-react";
import { WeeklyAvailability } from "@/lib/types";
import { DAY_KEYS, generateSlots, getTakenHours, findAsapSlot, formatSlot, formatSlotRange } from "@/lib/booking-utils";

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
  existingBookings?: Array<{ scheduledAt: unknown; status?: string; durationHours?: number }>;
  onConfirm: (data: { service: string; scheduledAt: Date; location: string; notes: string; durationHours: number }) => Promise<void>;
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
  const [duration, setDuration] = useState(1);

  // Clear prefill from sessionStorage once consumed
  useEffect(() => {
    sessionStorage.removeItem("hm_booking_prefill");
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // Compute slots whenever date changes
  const { slots, dayEnabled, dayLabel } = useMemo(() => {
    if (!date) return { slots: [], dayEnabled: true, dayLabel: "" };

    const dayIndex = new Date(date + "T12:00:00").getDay();
    const dayKey = DAY_KEYS[dayIndex];
    const label = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);

    if (!availability) {
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

  const slotSet = useMemo(() => new Set(slots), [slots]);

  // A slot is selectable only if all 'duration' consecutive hours are within
  // the day's available range AND none are taken.
  const isSlotSelectable = (slot: string): boolean => {
    const [h] = slot.split(":").map(Number);
    return Array.from({ length: duration }, (_, k) => {
      const sh = `${String(h + k).padStart(2, "0")}:00`;
      return slotSet.has(sh) && !takenHours.has(sh);
    }).every(Boolean);
  };

  // If a selected slot becomes unavailable in real-time, clear it
  useEffect(() => {
    if (selectedSlot && !isSlotSelectable(selectedSlot)) {
      setSelectedSlot(null);
      setError("This slot is no longer available. Please choose another time.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [takenHours, selectedSlot, duration]);

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
      setDuration(Math.max(1, Math.round(data.estimatedHours)));
      // Clear slot if it's no longer selectable with the new duration
      setSelectedSlot(null);
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
      await onConfirm({ service, scheduledAt, location: location.trim(), notes: notes.trim(), durationHours: duration });
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
              <div className="flex flex-wrap items-center gap-2 text-base text-slate-600">
                <span>Category: <span className="font-semibold">{suggestion.category}</span></span>
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-sm font-bold text-violet-700">
                  <Clock3 className="h-3.5 w-3.5" />{duration}h estimated
                </span>
                <span>${suggestion.priceRange.min}–${suggestion.priceRange.max}</span>
              </div>
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
                  const asap = findAsapSlot(availability, existingBookings, duration);
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
                {duration > 1 && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700">
                    {duration}h blocks
                  </span>
                )}
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
                <>
                  {selectedSlot && (
                    <p className="mb-3 rounded-xl bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
                      <Clock3 className="inline h-3.5 w-3.5 mr-1" />
                      {formatSlotRange(selectedSlot, duration)}
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot) => {
                      const selectable = isSlotSelectable(slot);
                      const selected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={!selectable}
                          onClick={() => { setSelectedSlot(slot); setError(""); }}
                          className={`rounded-2xl py-3 text-base font-semibold transition ${
                            !selectable
                              ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed"
                              : selected
                              ? "bg-violet-600 text-white shadow-md"
                              : "bg-gray-50 text-slate-700 border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                          }`}
                        >
                          {formatSlot(slot)}
                        </button>
                      );
                    })}
                  </div>
                </>
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
              {duration > 1 && (
                <span className="ml-3 text-base text-slate-500">
                  Est. total: <span className="font-bold text-slate-800">${hourlyRate * duration}</span>
                </span>
              )}
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
