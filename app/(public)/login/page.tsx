"use client";

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Wrench } from 'lucide-react';

/**
 * HandyMatch Login Page
 * * Features:
 * - Next.js Client Component ("use client")
 * - TypeScript event handling
 * - Tailwind CSS for modern gradient and card styling
 * - Lucide React icons for visual cues
 */
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission with proper TypeScript typing
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    // Add your login logic/API call here
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 font-sans">
      
      {/* Header / Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-white p-3 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
          <Wrench className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">HandyMatch</h1>
        <p className="text-blue-100 opacity-90 text-lg">Welcome back! Sign in to continue</p>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Email Address</label>
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

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">Password</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Lock size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors hover:underline underline-offset-4">
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:opacity-95 transform transition-all active:scale-[0.98] text-lg"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium">or</span>
          </div>
        </div>

        {/* Footer / Sign Up */}
        <div className="text-center">
          <p className="text-gray-500 font-medium">
            Don't have an account?{' '}
            <button 
              type="button"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline underline-offset-4"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}