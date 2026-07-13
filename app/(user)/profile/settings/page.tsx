"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, Shield, Globe, Save, CheckCircle2, Mail, Smartphone, RefreshCw, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateUserProfile } from "@/lib/firestore";
import { useLanguage } from "@/lib/language-context";

export default function CustomerSettingsPage() {
  const { user, userProfile, updateUserRole, refreshProfile, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [switching, setSwitching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [language, setLanguage] = useState("English");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userProfile?.settings) return;
    const s = userProfile.settings;
    setEmailNotifications(s.emailNotifications ?? true);
    setPushNotifications(s.pushNotifications ?? true);
    setBookingUpdates(s.bookingUpdates ?? true);
    setLanguage(s.language ?? "English");
  }, [userProfile]);

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!confirm(t("delete_confirm_msg"))) return;
    setDeleting(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("delete failed");
      await logout();
      router.push("/login");
    } catch {
      alert(t("delete_account_failed"));
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        settings: { emailNotifications, pushNotifications, bookingUpdates, newRequestAlerts: true, language, profileVisibility: "Public" },
      });
      await refreshProfile();
      setSaved(true);
    } catch {
      alert(t("err_generic"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/profile"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">{t("settings")}</div>
          </div>
          <p className="text-lg text-white/85">{t("customer_account")}</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">{t("account_settings")}</h1>
          <p className="mt-3 text-lg text-white/85">{t("settings_desc")}</p>
        </div>
      </section>

      <section className="mx-auto -mt-4 max-w-4xl px-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Bell className="h-6 w-6 text-blue-600" /> {t("notification_prefs")}
          </h2>
          <div className="space-y-4">
            <SettingRow icon={<Mail className="h-5 w-5" />}
              title={t("email_notifications")} description={t("email_notifications_desc")}
              enabled={emailNotifications} enabledLabel={t("enabled")} disabledLabel={t("disabled_label")}
              onToggle={() => { setEmailNotifications((p) => !p); setSaved(false); }} />
            <SettingRow icon={<Smartphone className="h-5 w-5" />}
              title={t("push_notifications")} description={t("push_notifications_desc")}
              enabled={pushNotifications} enabledLabel={t("enabled")} disabledLabel={t("disabled_label")}
              onToggle={() => { setPushNotifications((p) => !p); setSaved(false); }} />
            <SettingRow icon={<Bell className="h-5 w-5" />}
              title={t("booking_updates")} description={t("booking_updates_desc")}
              enabled={bookingUpdates} enabledLabel={t("enabled")} disabledLabel={t("disabled_label")}
              onToggle={() => { setBookingUpdates((p) => !p); setSaved(false); }} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Globe className="h-6 w-6 text-blue-600" /> {t("regional_prefs")}
          </h2>
          <label className="mb-3 block text-lg font-semibold text-slate-900">{t("language_label")}</label>
          <select value={language} onChange={(e) => { setLanguage(e.target.value); setSaved(false); }}
            className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition focus:border-blue-400">
            <option>English</option>
            <option>Arabic</option>
            <option>Hebrew</option>
          </select>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{t("data_safe")}</h3>
              <p className="mt-2 text-slate-600">{t("data_safe_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <button type="button" onClick={handleSave} disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
            <Save className="h-5 w-5" />
            {saving ? t("saving") : t("save_changes")}
          </button>
          <Link href="/profile"
            className="inline-flex items-center justify-center rounded-[1.2rem] border border-gray-200 bg-white px-6 py-4 text-lg font-semibold text-slate-700 transition hover:bg-gray-50">
            {t("cancel")}
          </Link>
        </div>

        {saved && (
          <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t("settings_saved")}</h3>
                <p className="mt-1 text-slate-600">{t("settings_saved_desc")}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6 pb-10">
        <div className="rounded-[2rem] border border-violet-200 bg-violet-50 p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <RefreshCw className="h-6 w-6 text-violet-600" /> {t("switch_account")}
          </h2>
          <p className="mb-5 text-slate-600">{t("switch_account_desc")}</p>
          <button type="button" disabled={switching}
            onClick={async () => { setSwitching(true); await updateUserRole("professional"); router.push("/pro/setup"); }}
            className="inline-flex items-center gap-2 rounded-[1.2rem] bg-violet-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60">
            <RefreshCw className={`h-5 w-5 ${switching ? "animate-spin" : ""}`} />
            {switching ? t("switching") : t("switch_to_pro")}
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6 pb-10">
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Trash2 className="h-6 w-6 text-red-600" /> {t("danger_zone")}
          </h2>
          <p className="mb-5 text-slate-600">{t("delete_account_desc")}</p>
          <button type="button" disabled={deleting} onClick={handleDeleteAccount}
            className="inline-flex items-center gap-2 rounded-[1.2rem] bg-red-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
            <Trash2 className="h-5 w-5" />
            {deleting ? t("deleting") : t("delete_account")}
          </button>
        </div>
      </section>
    </main>
  );
}

type SettingRowProps = {
  icon: React.ReactNode; title: string; description: string;
  enabled: boolean; enabledLabel: string; disabledLabel: string; onToggle: () => void;
};

function SettingRow({ icon, title, description, enabled, enabledLabel, disabledLabel, onToggle }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.5rem] border border-gray-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-slate-600">{description}</p>
        </div>
      </div>
      <button type="button" onClick={onToggle}
        className={`inline-flex min-w-[120px] items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${
          enabled ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
        }`}>
        {enabled ? enabledLabel : disabledLabel}
      </button>
    </div>
  );
}
