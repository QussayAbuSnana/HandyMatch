"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Home, Search, MessageSquare, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeNotifications } from "@/lib/firestore";

type Tab = "home" | "search" | "messages" | "notifications" | "profile";

export default function CustomerNavBar({ active }: { active: Tab }) {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeNotifications(user.uid, (notifs) => {
      setUnread(notifs.filter((n) => !n.read).length);
    });
    return unsub;
  }, [user]);

  const navItem = (href: string, id: Tab, icon: React.ReactNode, label: string, badge?: number) => (
    <Link
      href={href}
      className={`relative flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 transition ${
        active === id ? "bg-violet-100 text-violet-700" : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      {icon}
      {badge ? (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
      <span className="mt-1 text-base font-medium">{label}</span>
    </Link>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
        {navItem("/dashboard",     "home",          <Home className="h-7 w-7" />,          "Home")}
        {navItem("/search",        "search",        <Search className="h-7 w-7" />,        "Search")}
        {navItem("/messages",      "messages",      <MessageSquare className="h-7 w-7" />, "Messages")}
        {navItem("/profile",       "profile",       <User className="h-7 w-7" />,          "Profile")}
      </div>
    </nav>
  );
}

/** Bell icon with unread badge — use in page headers */
export function BellButton() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeNotifications(user.uid, (notifs) => {
      setUnread(notifs.filter((n) => !n.read).length);
    });
    return unsub;
  }, [user]);

  return (
    <Link href="/notifications" className="relative text-gray-600 transition hover:text-gray-900">
      <Bell className="h-8 w-8" />
      {unread > 0 && (
        <span className="absolute -right-1 top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-pink-500 text-xs font-bold text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
