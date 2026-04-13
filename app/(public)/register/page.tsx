"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Wrench, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password, displayName.trim());
      // Redirect to role selection
      router.push("/");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(getFirebaseErrorMessage(code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 font-sans">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-white p-3 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
          <Wrench className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          HandyMatch
        </h1>
        <p className="text-blue-100 opacity-90 text-lg">
          Create your account to get started
        </p>
      </div>

      {/* Card */}
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error banner */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Full name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Full Name
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <User size={20} />
              </span>
              <input
                type="text"
                placeholder="John Smith"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-100 outline-none transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Mail size={20} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-100 outline-none transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Password
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Lock size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-100 outline-none transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-purple-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Confirm Password
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Lock size={20} />
              </span>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-100 outline-none transition-all text-gray-700 placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-purple-600 transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:opacity-95 transform transition-all active:scale-[0.98] text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium">or</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
