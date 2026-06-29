"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Camera } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateUserProfile } from "@/lib/firestore";
import { uploadProfilePhoto } from "@/lib/storage";
import { updateProfile } from "firebase/auth";
import { useLanguage } from "@/lib/language-context";

export default function EditProfilePage() {
  const { user, userProfile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(userProfile?.displayName ?? "");
  const [phone, setPhone] = useState(userProfile?.phone ?? "");
  const [location, setLocation] = useState(userProfile?.location ?? "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(userProfile?.photoURL ?? null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!displayName.trim()) { setError(t("name_required")); return; }
    setError("");
    setSaving(true);

    try {
      await updateProfile(user, { displayName: displayName.trim() });
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        phone: phone.trim(),
        location: location.trim(),
      });
    } catch {
      setError(t("save_profile_failed"));
      setSaving(false);
      return;
    }

    if (photoFile) {
      try {
        await uploadProfilePhoto(user, photoFile);
      } catch {
        setError(t("photo_upload_failed"));
        await refreshProfile();
        setSaving(false);
        return;
      }
    }

    await refreshProfile();
    setSaved(true);
    setSaving(false);
    setTimeout(() => router.push("/profile"), 1000);
  };

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-12">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-5">
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{t("edit_profile_title")}</h1>
        </div>
      </header>

      <section className="mx-auto max-w-lg px-5 pt-8">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-5xl font-bold shadow-lg overflow-hidden">
              {photoPreview
                ? <img src={photoPreview} alt="avatar" className="h-28 w-28 object-cover" />
                : (displayName?.[0]?.toUpperCase() ?? <User className="h-12 w-12" />)}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white shadow-md hover:bg-violet-700 transition"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            {t("change_photo")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              <User className="inline h-4 w-4 mr-1" />{t("full_name")}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("your_full_name_ph")}
              dir="auto"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              <Mail className="inline h-4 w-4 mr-1" />{t("email")}
            </label>
            <input
              type="email"
              value={userProfile?.email ?? ""}
              disabled
              className="w-full px-5 py-4 bg-gray-100 border border-transparent rounded-2xl text-gray-400 text-lg cursor-not-allowed"
            />
            <p className="text-sm text-slate-400 ml-1 mt-1">{t("email_no_change")}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              <Phone className="inline h-4 w-4 mr-1" />{t("phone")}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />{t("location")}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("city_state_ph")}
              dir="auto"
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 text-lg"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}

          {saved && (
            <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 text-center font-semibold">
              {t("saved_redirecting")}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || saved}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xl font-bold shadow-md hover:opacity-95 transition disabled:opacity-60"
          >
            <Save className="h-6 w-6" />
            {saving ? t("saving") : t("save_changes")}
          </button>
        </form>
      </section>
    </main>
  );
}
