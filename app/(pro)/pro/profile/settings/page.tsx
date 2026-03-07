"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  Globe,
  Save,
  CheckCircle2,
  Mail,
  Smartphone,
} from "lucide-react";

export default function ProSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newRequestsAlerts, setNewRequestsAlerts] = useState(true);
  const [language, setLanguage] = useState("English");
  const [profileVisibility, setProfileVisibility] = useState("Public");
  const [saved, setSaved] = useState(false);

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
              Settings
            </div>
          </div>

          <p className="text-lg text-white/85">Professional account</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Account Settings
          </h1>
          <p className="mt-3 text-lg text-white/85 md:text-xl">
            Manage your notifications, visibility, and account preferences.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-4 max-w-4xl px-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Bell className="h-6 w-6 text-violet-600" />
            Notification Preferences
          </h2>

          <div className="space-y-4">
            <SettingRow
              icon={<Mail className="h-5 w-5" />}
              title="Email Notifications"
              description="Receive updates about bookings and messages by email."
              enabled={emailNotifications}
              onToggle={() => {
                setEmailNotifications((prev) => !prev);
                setSaved(false);
              }}
            />

            <SettingRow
              icon={<Smartphone className="h-5 w-5" />}
              title="Push Notifications"
              description="Get instant alerts when customers send messages or requests."
              enabled={pushNotifications}
              onToggle={() => {
                setPushNotifications((prev) => !prev);
                setSaved(false);
              }}
            />

            <SettingRow
              icon={<Bell className="h-5 w-5" />}
              title="New Request Alerts"
              description="Be notified immediately when a new customer request appears."
              enabled={newRequestsAlerts}
              onToggle={() => {
                setNewRequestsAlerts((prev) => !prev);
                setSaved(false);
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Globe className="h-6 w-6 text-violet-600" />
            Regional Preferences
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-lg font-semibold text-slate-900">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition focus:border-violet-400"
              >
                <option>English</option>
                <option>Arabic</option>
                <option>Hebrew</option>
              </select>
            </div>

            <div>
              <label className="mb-3 block text-lg font-semibold text-slate-900">
                Profile Visibility
              </label>
              <select
                value={profileVisibility}
                onChange={(e) => {
                  setProfileVisibility(e.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition focus:border-violet-400"
              >
                <option>Public</option>
                <option>Private</option>
                <option>Visible to matched customers only</option>
              </select>
            </div>
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
              <h3 className="text-xl font-bold text-slate-900">Account Safety Tip</h3>
              <p className="mt-2 text-slate-600">
                Keep your account information updated and review your settings regularly
                to maintain trust and visibility on HandyMatch.
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
                <h3 className="text-xl font-bold text-slate-900">Settings Saved</h3>
                <p className="mt-1 text-slate-600">
                  Your account preferences have been updated successfully.
                </p>
              </div>
            </div>
          </div>
        )}
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

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: SettingRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.5rem] border border-gray-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
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
          enabled
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {enabled ? "Enabled" : "Disabled"}
      </button>
    </div>
  );
}