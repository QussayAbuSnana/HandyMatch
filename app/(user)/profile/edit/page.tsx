"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, MapPin, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateUserProfile } from "@/lib/firestore";

export default function EditProfilePage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(userProfile?.displayName ?? "");
  const [phone, setPhone] = useState(userProfile?.phone ?? "");
  const [location, setLocation] = useState(userProfile?.location ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!displayName.trim()) { setError("Name is required."); return; }
    setError("");
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        phone: phone.trim(),
        location: location.trim(),
      });
      setSaved(true);
      setTimeout(() => router.push("/profile"), 1000);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-12">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-5">
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
        </div>
      </header>

      <section className="mx-auto max-w-lg px-5 pt-8">
        {/* Avatar */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-5xl font-bold shadow-lg">
            {displayName?.[0]?.toUpperCase() ?? <User className="h-12 w-12" />}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              <User className="inline h-4 w-4 mr-1" />Full Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              <Mail className="inline h-4 w-4 mr-1" />Email
            </label>
            <input
              type="email"
              value={userProfile?.email ?? ""}
              disabled
              className="w-full px-5 py-4 bg-gray-100 border border-transparent rounded-2xl text-gray-400 text-lg cursor-not-allowed"
            />
            <p className="text-sm text-slate-400 ml-1 mt-1">Email cannot be changed here.</p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              <Phone className="inline h-4 w-4 mr-1" />Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}

          {saved && (
            <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 text-center font-semibold">
              Saved! Redirecting…
            </p>
          )}

          <button
            type="submit"
            disabled={saving || saved}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xl font-bold shadow-md hover:opacity-95 transition disabled:opacity-60"
          >
            <Save className="h-6 w-6" />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </section>
    </main>
  );
}
