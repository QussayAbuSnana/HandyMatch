"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  CalendarDays,
  MapPin,
  Save,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ProAvailabilityPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [serviceArea, setServiceArea] = useState("Downtown, Midtown, Westside");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [saved, setSaved] = useState(false);

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/pro/profile"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              Availability
            </div>
          </div>

          <p className="text-lg text-white/85">Professional settings</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Manage Your Availability
          </h1>
          <p className="mt-3 text-lg text-white/85 md:text-xl">
            Keep your schedule updated so customers can find and book you more easily.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-4 max-w-4xl px-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Current Status</h2>
              <p className="mt-2 text-slate-600">
                Control whether you are currently accepting new service requests.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAvailable((prev) => !prev);
                setSaved(false);
              }}
              className={`inline-flex items-center rounded-full px-5 py-3 text-lg font-semibold transition ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {isAvailable ? "Available Now" : "Unavailable"}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <label className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <MapPin className="h-5 w-5 text-violet-600" />
            Service Area
          </label>

          <input
            type="text"
            value={serviceArea}
            onChange={(e) => {
              setServiceArea(e.target.value);
              setSaved(false);
            }}
            placeholder="Enter your service area"
            className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400"
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Clock3 className="h-6 w-6 text-violet-600" />
            Working Hours
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-lg font-semibold text-slate-900">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-3 block text-lg font-semibold text-slate-900">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition focus:border-violet-400"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <CalendarDays className="h-6 w-6 text-violet-600" />
            Available Days
          </h2>

          <div className="flex flex-wrap gap-3">
            {weekDays.map((day) => {
              const active = selectedDays.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-full px-5 py-3 text-base font-semibold transition ${
                    active
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Briefcase className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Why this matters</h3>
              <p className="mt-2 text-slate-600">
                Accurate availability helps customers trust your profile and improves
                your chances of receiving relevant bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-green-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-green-700"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>

          <Link
            href="/pro/profile"
            className="inline-flex items-center justify-center rounded-[1.2rem] border border-gray-200 bg-white px-6 py-4 text-lg font-semibold text-slate-700 transition hover:bg-gray-50"
          >
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
                <h3 className="text-xl font-bold text-slate-900">
                  Availability Updated
                </h3>
                <p className="mt-1 text-slate-600">
                  Your new availability settings have been saved successfully.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}