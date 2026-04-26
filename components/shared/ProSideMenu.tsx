"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X, Briefcase, CalendarDays, MessageSquare, User,
  Bell, Settings, Wrench, LogOut, Sparkles, BarChart2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Props {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: "/pro/dashboard",         icon: BarChart2,     label: "Dashboard" },
  { href: "/pro/jobs",              icon: CalendarDays,  label: "Jobs" },
  { href: "/pro/messages",          icon: MessageSquare, label: "Messages" },
  { href: "/pro/notifications",     icon: Bell,          label: "Notifications" },
  { href: "/pro/profile",           icon: User,          label: "My Profile" },
  { href: "/pro/setup",             icon: Wrench,        label: "Edit Profile" },
  { href: "/pro/profile/settings",  icon: Settings,      label: "Settings" },
];

export default function ProSideMenu({ open, onClose }: Props) {
  const { userProfile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    onClose();
    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">HandyMatch</span>
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">PRO</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X className="h-7 w-7" />
          </button>
        </div>

        {/* User info */}
        {userProfile && (
          <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full overflow-hidden bg-violet-100 text-violet-700 text-xl font-bold">
              {userProfile.photoURL
                ? <img src={userProfile.photoURL} alt="avatar" className="h-14 w-14 object-cover" />
                : (userProfile.displayName?.[0] ?? "?")}
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{userProfile.displayName}</p>
              <p className="text-sm text-slate-500">{userProfile.email}</p>
              <span className="inline-block mt-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">Professional</span>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-1">
            {links.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-4 rounded-2xl px-4 py-3 text-lg font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-lg font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-6 w-6" />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
