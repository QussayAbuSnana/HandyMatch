"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, CalendarDays, MapPin, Save, CheckCircle2, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateUserProfile } from "@/lib/firestore";
import { WeeklyAvailability, DaySchedule } from "@/lib/types";

const DAYS: { key: keyof WeeklyAvailability; label: string; short: string }[] = [
  { key: "sunday",    label: "Sunday",    short: "Sun" },
  { key: "monday",    label: "Monday",    short: "Mon" },
  { key: "tuesday",   label: "Tuesday",   short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday",  label: "Thursday",  short: "Thu" },
  { key: "friday",    label: "Friday",    short: "Fri" },
  { key: "saturday",  label: "Saturday",  short: "Sat" },
];

const DEFAULT_SCHEDULE: WeeklyAvailability = {
  sunday:    { enabled: false, start: "09:00", end: "17:00" },
  monday:    { enabled: true,  start: "09:00", end: "17:00" },
  tuesday:   { enabled: true,  start: "09:00", end: "17:00" },
  wednesday: { enabled: true,  start: "09:00", end: "17:00" },
  thursday:  { enabled: true,  start: "09:00", end: "17:00" },
  friday:    { enabled: true,  start: "09:00", end: "14:00" },
  saturday:  { enabled: false, start: "09:00", end: "17:00" },
};

export default function ProAvailabilityPage() {
  const { user, userProfile, refreshProfile } = useAuth();

  const [schedule, setSchedule] = useState<WeeklyAvailability>(DEFAULT_SCHEDULE);
  const [isAvailable, setIsAvailable] = useState(true);
  const [serviceArea, setServiceArea] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing data from profile
  useEffect(() => {
    if (!userProfile) return;
    const pro = userProfile as unknown as { isAvailable?: boolean; serviceArea?: string; availability?: WeeklyAvailability };
    if (pro.isAvailable !== undefined) setIsAvailable(pro.isAvailable);
    if (pro.serviceArea) setServiceArea(pro.serviceArea);
    if (pro.availability) setSchedule(pro.availability);
  }, [userProfile]);

  const updateDay = (key: keyof WeeklyAvailability, field: keyof DaySchedule, value: string | boolean) => {
    setSaved(false);
    setSchedule((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        availability: schedule,
        isAvailable,
        serviceArea,
      } as Parameters<typeof updateUserProfile>[1]);
      await refreshProfile();
      setSaved(true);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      {/* Header banner */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/pro/profile"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">Availability</div>
          </div>
          <h1 className="mt-2 text-4xl font-extrabold">Manage Your Availability</h1>
          <p className="mt-3 text-lg text-white/85">Set your working days and hours so customers know when to book you.</p>
        </div>
      </section>

      {/* Overall availability toggle */}
      <section className="mx-auto -mt-4 max-w-4xl px-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Accepting Bookings</h2>
              <p className="mt-1 text-slate-500">Turn off to pause all new booking requests.</p>
            </div>
            <button
              type="button"
              onClick={() => { setIsAvailable((p) => !p); setSaved(false); }}
              className={`flex items-center gap-2 rounded-full px-5 py-3 text-lg font-semibold transition ${
                isAvailable ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
              }`}
            >
              {isAvailable
                ? <><ToggleRight className="h-6 w-6" /> Available</>
                : <><ToggleLeft className="h-6 w-6" /> Unavailable</>}
            </button>
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="mx-auto max-w-4xl px-5 pt-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <label className="mb-3 flex items-center gap-2 text-xl font-bold text-slate-900">
            <MapPin className="h-5 w-5 text-violet-600" /> Service Area
          </label>
          <input
            type="text"
            value={serviceArea}
            onChange={(e) => { setServiceArea(e.target.value); setSaved(false); }}
            placeholder="e.g. תל אביב, רמת גן, גבעתיים"
            className="w-full rounded-[1.2rem] border border-gray-200 bg-gray-50 px-4 py-4 text-lg text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </section>

      {/* Weekly schedule */}
      <section className="mx-auto max-w-4xl px-5 pt-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <CalendarDays className="h-6 w-6 text-violet-600" /> Weekly Schedule
          </h2>

          <div className="space-y-4">
            {DAYS.map(({ key, label }) => {
              const day = schedule[key];
              return (
                <div key={key}
                  className={`rounded-2xl border p-4 transition ${
                    day.enabled ? "border-violet-200 bg-violet-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Day toggle */}
                    <button
                      type="button"
                      onClick={() => updateDay(key, "enabled", !day.enabled)}
                      className="flex items-center gap-3"
                    >
                      <div className={`h-6 w-11 rounded-full transition-colors relative ${
                        day.enabled ? "bg-violet-600" : "bg-gray-300"
                      }`}>
                        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          day.enabled ? "translate-x-5" : "translate-x-0.5"
                        }`} />
                      </div>
                      <span className={`text-xl font-bold ${day.enabled ? "text-violet-700" : "text-slate-400"}`}>
                        {label}
                      </span>
                    </button>

                    {/* Time pickers */}
                    {day.enabled && (
                      <div className="flex items-center gap-3">
                        <Clock3 className="h-5 w-5 text-violet-400 shrink-0" />
                        <input
                          type="time"
                          value={day.start}
                          onChange={(e) => updateDay(key, "start", e.target.value)}
                          className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-lg font-medium text-slate-700 outline-none focus:border-violet-500"
                        />
                        <span className="text-slate-400 font-medium">to</span>
                        <input
                          type="time"
                          value={day.end}
                          onChange={(e) => updateDay(key, "end", e.target.value)}
                          className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-lg font-medium text-slate-700 outline-none focus:border-violet-500"
                        />
                      </div>
                    )}

                    {!day.enabled && (
                      <span className="text-lg font-medium text-slate-400">Closed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Save */}
      <section className="mx-auto max-w-4xl px-5 pt-6 pb-10">
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-violet-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            <Save className="h-5 w-5" />
            {saving ? "Saving…" : "Save Availability"}
          </button>
          <Link href="/pro/profile"
            className="inline-flex items-center justify-center rounded-[1.2rem] border border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition hover:bg-gray-50">
            Cancel
          </Link>
        </div>

        {saved && (
          <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Availability Saved!</h3>
                <p className="mt-1 text-slate-600">Customers can now see your weekly schedule.</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
