"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  FileText,
  Wrench,
  Camera,
  CheckCircle2,
} from "lucide-react";

const professionals: Record<
  string,
  {
    name: string;
    title: string;
    price: string;
  }
> = {
  "sarah-chen": {
    name: "Sarah Chen",
    title: "Certified Electrician",
    price: "$95/hour",
  },
  "mike-johnson": {
    name: "Mike Johnson",
    title: "Professional Plumber",
    price: "$85/hour",
  },
  "lisa-thompson": {
    name: "Lisa Thompson",
    title: "Interior Painter",
    price: "$65/hour",
  },
};

const serviceOptions = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Cleaning",
  "General Maintenance",
];

export default function CreateRequestPage() {
  const searchParams = useSearchParams();
  const proId = searchParams.get("pro") ?? "";
  const professional = professionals[proId];

  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      serviceType.trim() &&
      description.trim() &&
      location.trim() &&
      preferredDate.trim() &&
      preferredTime.trim()
    );
  }, [serviceType, description, location, preferredDate, preferredTime]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f8f8fb] px-5 py-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Request Submitted Successfully
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Your service request has been created and is ready to be reviewed.
            {professional ? ` ${professional.name} has been selected for this request.` : ""}
          </p>

          <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-5">
            <h2 className="text-xl font-semibold text-slate-900">Request Summary</h2>

            <div className="mt-4 space-y-3 text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Service:</span>{" "}
                {serviceType}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Location:</span>{" "}
                {location}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Preferred Date:</span>{" "}
                {preferredDate}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Preferred Time:</span>{" "}
                {preferredTime}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-[1.2rem] bg-violet-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-violet-700"
            >
              Back to Dashboard
            </Link>

            <Link
              href="/messages"
              className="inline-flex items-center justify-center rounded-[1.2rem] border border-gray-200 bg-white px-6 py-4 text-lg font-semibold text-slate-700 transition hover:bg-gray-50"
            >
              Open Messages
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={professional ? `/professionals/${proId}` : "/search"}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              Create Request
            </div>
          </div>

          <p className="text-lg text-white/85">Customer booking flow</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Book a Professional Service
          </h1>
          <p className="mt-3 text-lg text-white/85 md:text-xl">
            Fill in the request details and send your booking in a clear, simple way.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-4 max-w-4xl px-5">
        {professional && (
          <div className="mb-6 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Selected Professional</h2>
            <p className="mt-3 text-xl font-semibold text-violet-600">
              {professional.name}
            </p>
            <p className="mt-1 text-slate-600">{professional.title}</p>
            <p className="mt-2 text-lg font-medium text-slate-900">
              Starting at {professional.price}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-6">
            <div>
              <label className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Wrench className="h-5 w-5 text-violet-600" />
                Service Type
              </label>

              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition focus:border-violet-400"
              >
                <option value="">Select a service</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FileText className="h-5 w-5 text-violet-600" />
                Problem Description
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue or service you need..."
                className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <MapPin className="h-5 w-5 text-violet-600" />
                Service Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter address or area"
                className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <CalendarDays className="h-5 w-5 text-violet-600" />
                  Preferred Date
                </label>

                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Clock3 className="h-5 w-5 text-violet-600" />
                  Preferred Time
                </label>

                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition focus:border-violet-400"
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-dashed border-gray-300 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <Camera className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Add Photos (Optional)
                  </h3>
                  <p className="mt-2 text-slate-600">
                    In the real app, users will be able to upload photos of the issue
                    to help professionals understand the request better.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`inline-flex items-center justify-center rounded-[1.2rem] px-6 py-4 text-lg font-semibold text-white transition ${
                  isFormValid
                    ? "bg-green-600 hover:bg-green-700"
                    : "cursor-not-allowed bg-gray-300"
                }`}
              >
                Submit Request
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-[1.2rem] border border-gray-200 bg-white px-6 py-4 text-lg font-semibold text-slate-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}