"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Briefcase, CheckCircle2, ArrowRight } from "lucide-react";

/**
 * Role Selection Page
 * Displays after successful login to allow user to choose their interface.
 */
export default function RoleSelectionPage() {
  const [showToast, setShowToast] = useState(true);
  const router = useRouter();

  // Automatically hide the "Welcome back" toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelect = (role: "customer" | "professional") => {
    if (role === "customer") {
      router.push("/dashboard");
    } else {
      router.push("/pro/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 font-sans relative overflow-hidden">
      {showToast && (
        <div className="fixed top-8 z-50 flex items-center bg-[#f0fff4] border border-green-100 rounded-2xl px-6 py-4 shadow-2xl animate-in fade-in slide-in-from-top-8 duration-700 ease-out">
          <div className="bg-green-500 rounded-full p-1 mr-4">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[#065f46] font-bold text-base">Welcome back!</p>
            <p className="text-[#059669] text-sm">
              You've successfully signed in.
            </p>
          </div>
        </div>
      )}

      <div className="text-center mb-12 animate-in fade-in zoom-in duration-1000">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-sm">
          HandyMatch
        </h1>
        <p className="text-blue-100 text-xl font-medium opacity-90">
          Your trusted service marketplace
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <button
          onClick={() => handleRoleSelect("customer")}
          className="w-full text-left group bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-2xl border-4 border-transparent hover:border-blue-400 transition-all transform hover:-translate-y-2 active:scale-[0.98]"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="bg-blue-500 p-5 rounded-2xl shadow-lg mb-6 md:mb-0 md:mr-8 group-hover:rotate-6 transition-transform">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                I'm a Customer
              </h2>
              <p className="text-gray-500 font-medium text-lg mb-4 leading-relaxed">
                Find and book trusted professionals for your home services
              </p>
              <div className="flex items-center text-blue-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleRoleSelect("professional")}
          className="w-full text-left group bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-2xl border-4 border-transparent hover:border-pink-400 transition-all transform hover:-translate-y-2 active:scale-[0.98]"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="bg-pink-500 p-5 rounded-2xl shadow-lg mb-6 md:mb-0 md:mr-8 group-hover:-rotate-6 transition-transform">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                I'm a Professional
              </h2>
              <p className="text-gray-500 font-medium text-lg mb-4 leading-relaxed">
                Manage your business and connect with customers
              </p>
              <div className="flex items-center text-purple-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
                Access Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-16 text-center animate-in fade-in duration-1000 delay-500">
        <p className="text-blue-100 text-base font-semibold opacity-80 tracking-wide uppercase">
          Trusted by 500+ professionals and 10,000+ customers
        </p>
      </div>
    </div>
  );
}