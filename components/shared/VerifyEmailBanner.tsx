"use client";

import { useState, useEffect } from "react";
import { Mail, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";

export default function VerifyEmailBanner() {
  const { user, emailVerified, resendVerificationEmail, checkEmailVerified } = useAuth();
  const { t } = useLanguage();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (user && sessionStorage.getItem(`hm_verify_dismissed_${user.uid}`) === "1") {
      setDismissed(true);
    } else {
      setDismissed(false);
    }
  }, [user]);

  if (!user || emailVerified || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(`hm_verify_dismissed_${user.uid}`, "1");
    setDismissed(true);
  };

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerificationEmail();
      setSent(true);
    } catch {
      alert(t("err_generic"));
    } finally {
      setSending(false);
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    try {
      await checkEmailVerified();
    } catch {
      // Reload failed (e.g. offline) — banner just stays visible, nothing to surface here
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 bg-amber-50 border-b border-amber-200 px-4 py-3 text-center">
      <span className="flex items-center gap-2 text-base font-medium text-amber-800">
        <Mail className="h-5 w-5 shrink-0" />
        {t("verify_email_banner")}
      </span>
      <button
        type="button"
        onClick={handleResend}
        disabled={sending}
        className="rounded-full bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
      >
        {sent ? t("email_sent") : t("resend_email")}
      </button>
      <button
        type="button"
        onClick={handleCheck}
        disabled={checking}
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-white px-4 py-1.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
        {t("ive_verified")}
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        className="ml-1 text-xl font-bold text-amber-500 hover:text-amber-700"
      >
        ×
      </button>
    </div>
  );
}
