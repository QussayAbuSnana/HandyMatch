"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hammer, Plus, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateUserProfile } from "@/lib/firestore";

const SERVICE_OPTIONS = [
  "Plumbing", "Electrical", "Carpentry", "Painting",
  "HVAC", "Cleaning", "Landscaping", "Moving",
  "Appliance Repair", "Roofing", "Flooring", "General Handyman",
];

export default function ProSetupPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const addCustomService = () => {
    const trimmed = customService.trim();
    if (trimmed && !selectedServices.includes(trimmed)) {
      setSelectedServices((prev) => [...prev, trimmed]);
    }
    setCustomService("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (selectedServices.length === 0) {
      setError("Please select at least one service.");
      return;
    }
    if (!hourlyRate || isNaN(Number(hourlyRate))) {
      setError("Please enter a valid hourly rate.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await updateUserProfile(user.uid, {
        bio,
        services: selectedServices,
        hourlyRate: Number(hourlyRate),
        location,
        phone,
        rating: 0,
        reviewCount: 0,
        jobCount: 0,
        isAvailable: true,
      } as Parameters<typeof updateUserProfile>[1]);
      router.push("/pro/dashboard");
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white p-3 rounded-2xl shadow-lg mb-4 inline-flex">
            <Hammer className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Set Up Your Profile</h1>
          <p className="text-violet-100 text-lg">
            Welcome, {userProfile?.displayName?.split(" ")[0]}! Tell customers about yourself.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl p-8 space-y-6">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</div>
          )}

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Bio / About You</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. I'm a certified plumber with 5 years of experience in residential repairs…"
              rows={3}
              className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 resize-none"
            />
          </div>

          {/* Services */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-600 ml-1">Services You Offer</label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  className={`rounded-full px-4 py-2 text-base font-medium border transition ${
                    selectedServices.includes(s)
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-violet-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Selected custom services */}
            {selectedServices.filter((s) => !SERVICE_OPTIONS.includes(s)).map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-violet-600 text-white px-4 py-2 text-base font-medium mr-2">
                {s}
                <button type="button" onClick={() => toggleService(s)}><X className="h-4 w-4" /></button>
              </span>
            ))}

            {/* Add custom */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomService())}
                placeholder="Add custom service…"
                className="flex-1 px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700"
              />
              <button
                type="button"
                onClick={addCustomService}
                className="flex items-center gap-2 rounded-2xl bg-violet-100 px-4 py-3 text-violet-700 font-semibold hover:bg-violet-200 transition"
              >
                <Plus className="h-5 w-5" /> Add
              </button>
            </div>
          </div>

          {/* Hourly rate */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Hourly Rate (USD)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 text-xl font-semibold">$</span>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="75"
                min={1}
                className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Your Location / City</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Downtown, New York"
              className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold rounded-2xl shadow-lg hover:opacity-95 transition text-lg disabled:opacity-60"
          >
            {saving ? "Saving…" : "Complete Setup →"}
          </button>
        </form>
      </div>
    </div>
  );
}
