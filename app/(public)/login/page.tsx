"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Wrench } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

const FIREBASE_ERROR_KEYS: Record<string, string> = {
  "auth/user-not-found":        "err_invalid_credential",
  "auth/wrong-password":        "err_invalid_credential",
  "auth/invalid-credential":    "err_invalid_credential",
  "auth/too-many-requests":     "err_too_many",
  "auth/user-disabled":         "err_disabled",
  "auth/network-request-failed":"err_network",
};

export default function LoginPage() {
  const { login, loading, user, userProfile, resetPassword } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (userProfile?.role === "professional") router.replace("/pro/dashboard");
      else if (userProfile?.role === "customer") router.replace("/dashboard");
    }
  }, [loading, user, userProfile, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const credential = await login(email, password);
      let role: string | null = null;
      try {
        const snap = await getDoc(doc(db, "users", credential.uid));
        role = snap.exists() ? snap.data().role : null;
      } catch { /* fallback to "/" */ }
      if (role === "customer") router.push("/dashboard");
      else if (role === "professional") router.push("/pro/dashboard");
      else router.push("/select-role");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(t(FIREBASE_ERROR_KEYS[code] ?? "err_generic"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch {
      setError(t("err_reset_failed"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  if (showReset) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
        <div className="absolute top-4 right-4"><LanguageSwitcher /></div>
        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("reset_password")}</h2>
          <p className="text-gray-500 mb-6">{t("reset_password_desc")}</p>

          {resetSent ? (
            <div className="text-center">
              <p className="text-green-600 font-semibold mb-4">{t("reset_link_sent")}</p>
              <button onClick={() => setShowReset(false)} className="text-blue-600 font-bold hover:underline">
                {t("back_to_sign_in")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
              <input
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-700"
                required
              />
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl">
                {t("send_reset_link")}
              </button>
              <button type="button" onClick={() => setShowReset(false)} className="w-full text-center text-gray-500 font-medium hover:text-gray-700">
                {t("back_to_sign_in")}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 font-sans">
      <div className="absolute top-4 right-4"><LanguageSwitcher /></div>

      <div className="flex flex-col items-center mb-8">
        <div className="bg-white p-3 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
          <Wrench className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">HandyMatch</h1>
        <p className="text-blue-100 opacity-90 text-lg">{t("welcome_back_sign_in")}</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</div>}

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
                placeholder={t("enter_password_ph")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-purple-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => setShowReset(true)} className="text-sm font-bold text-blue-600 hover:underline underline-offset-4">
              {t("forgot_password")}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:opacity-95 transition-all text-lg disabled:opacity-60"
          >
            {submitting ? t("signing_in") : t("sign_in_btn")}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium">{t("or")}</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 font-medium">
            {t("no_account")}{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline underline-offset-4">
              {t("signup")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
