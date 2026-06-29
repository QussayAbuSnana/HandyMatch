"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Wrench, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

const FIREBASE_ERROR_KEYS: Record<string, string> = {
  "auth/email-already-in-use":  "err_email_in_use",
  "auth/weak-password":         "err_weak_password",
  "auth/invalid-email":         "err_invalid_email",
  "auth/network-request-failed":"err_network",
};

export default function RegisterPage() {
  const { register, loading, user, userProfile } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (userProfile?.role === "professional") router.replace("/pro/dashboard");
      else if (userProfile?.role === "customer") router.replace("/dashboard");
    }
  }, [loading, user, userProfile, router]);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError(t("passwords_no_match")); return; }
    if (password.length < 6) { setError(t("err_weak_password")); return; }
    setSubmitting(true);
    try {
      await register(email, password, displayName.trim());
      router.push("/setup-profile");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(t(FIREBASE_ERROR_KEYS[code] ?? "err_generic"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 font-sans">
      <div className="absolute top-4 right-4"><LanguageSwitcher /></div>

      <div className="flex flex-col items-center mb-8">
        <div className="bg-white p-3 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
          <Wrench className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">HandyMatch</h1>
        <p className="text-blue-100 opacity-90 text-lg">{t("create_account_sub")}</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</div>}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">{t("full_name")}</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <User size={20} />
              </span>
              <input
                type="text"
                placeholder="John Smith"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                dir="auto"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">{t("email_address")}</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Mail size={20} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="auto"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">{t("password_label")}</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Lock size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("at_least_6_ph")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-purple-600 transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">{t("confirm_password")}</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Lock size={20} />
              </span>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder={t("repeat_password_ph")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-purple-600 transition-colors">
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:opacity-95 transition-all text-lg disabled:opacity-60"
          >
            {submitting ? t("creating_account") : t("create_account")}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium">{t("or")}</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 font-medium">
            {t("already_have_account")}{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
              {t("sign_in_btn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
