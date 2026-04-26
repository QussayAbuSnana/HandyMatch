"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Shield,
  Globe,
  Save,
  CheckCircle2,
  Mail,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function CustomerSettingsPage() {
  const { updateUserRole } = useAuth();
  const router = useRouter();
  const [switching, setSwitching] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [language, setLanguage] = useState("English");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/profile"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              Settings
            </div>
          </div>

          <p className="text-lg text-white/85">Customer account</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Account Settings
          </h1>
          <p className="mt-3 text-lg text-white/85 md:text-xl">
            Manage your notifications and account preferences.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-4 max-w-4xl px-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Bell className="h-6 w-6 text-blue-600" />
            Notification Preferences
          </h2>

          <div className="space-y-4">
            <SettingRow
              icon={<Mail className="h-5 w-5" />}
              title="Email Notifications"
              description="Receive booking updates and service alerts by email."
              enabled={emailNotifications}
              onToggle={() => { setEmailNotifications((p) => !p); setSaved(false); }}
            />
            <SettingRow
              icon={<Smartphone className="h-5 w-5" />}
              title="Push Notifications"
              description="Get instant alerts when professionals respond to your requests."
              enabled={pushNotifications}
              onToggle={() => { setPushNotifications((p) => !p); setSaved(false); }}
            />
            <SettingRow
              icon={<Bell className="h-5 w-5" />}
              title="Booking Status Updates"
              description="Be notified when your booking is accepted, declined, or completed."
              enabled={bookingUpdates}
              onToggle={() => { setBookingUpdates((p) => !p); setSaved(false); }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Globe className="h-6 w-6 text-blue-600" />
            Regional Preferences
          </h2>

          <div>
            <label className="mb-3 block text-lg font-semibold text-slate-900">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => { setLanguage(e.target.value); setSaved(false); }}
              className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition focus:border-blue-400"
            >
              <option>English</option>
              <option>Arabic</option>
              <option>Hebrew</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Your Data is Safe</h3>
              <p className="mt-2 text-slate-600">
                HandyMatch never shares your personal information with professionals
                without your consent. You are in control of your data.
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
            className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
          <Link
            href="/profile"
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
                <h3 className="text-xl font-bold text-slate-900">Settings Saved</h3>
                <p className="mt-1 text-slate-600">
                  Your account preferences have been updated successfully.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Switch account type */}
      <section className="mx-auto max-w-4xl px-5 pt-6 pb-10">
        <div className="rounded-[2rem] border border-violet-200 bg-violet-50 p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <RefreshCw className="h-6 w-6 text-violet-600" />
            Switch Account Type
          </h2>
          <p className="mb-5 text-slate-600">
            Want to offer services instead? Switch to a Professional account.
          </p>
          <button
            type="button"
            disabled={switching}
            onClick={async () => {
              setSwitching(true);
              await updateUserRole("professional");
              router.push("/pro/setup");
            }}
            className="inline-flex items-center gap-2 rounded-[1.2rem] bg-violet-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            <RefreshCw className={`h-5 w-5 ${switching ? "animate-spin" : ""}`} />
            {switching ? "Switching…" : "Switch to Professional"}
          </button>
        </div>
      </section>
    </main>
  );
}

type SettingRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

function SettingRow({ icon, title, description, enabled, onToggle }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.5rem] border border-gray-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-slate-600">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex min-w-[120px] items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${
          enabled ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
        }`}
      >
        {enabled ? "Enabled" : "Disabled"}
      </button>
    </div>
  );
}
