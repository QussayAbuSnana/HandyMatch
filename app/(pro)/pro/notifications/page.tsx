"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Bell, Briefcase, MessageSquare, Star,
  Clock3, CheckCircle2, XCircle, CheckCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/firestore";
import { Notification } from "@/lib/types";

const TYPE_STYLE: Record<string, { icon: typeof Bell; wrap: string; color: string; badge: string; badgeStyle: string }> = {
  booking_request:   { icon: Briefcase,     wrap: "bg-violet-100", color: "text-violet-600", badge: "New Request",  badgeStyle: "bg-violet-100 text-violet-700" },
  booking_accepted:  { icon: CheckCircle2,  wrap: "bg-emerald-100",color: "text-emerald-600",badge: "Accepted",     badgeStyle: "bg-emerald-100 text-emerald-700" },
  booking_declined:  { icon: XCircle,       wrap: "bg-red-100",    color: "text-red-600",    badge: "Declined",     badgeStyle: "bg-red-100 text-red-700" },
  booking_completed: { icon: CheckCircle2,  wrap: "bg-green-100",  color: "text-green-600",  badge: "Completed",    badgeStyle: "bg-green-100 text-green-700" },
  new_message:       { icon: MessageSquare, wrap: "bg-blue-100",   color: "text-blue-600",   badge: "Message",      badgeStyle: "bg-blue-100 text-blue-700" },
  new_review:        { icon: Star,          wrap: "bg-amber-100",  color: "text-amber-600",  badge: "Review",       badgeStyle: "bg-amber-100 text-amber-700" },
};

const FALLBACK = { icon: Bell, wrap: "bg-gray-100", color: "text-gray-600", badge: "Update", badgeStyle: "bg-gray-100 text-gray-700" };

function timeAgo(n: Notification): string {
  if (!n.createdAt) return "";
  const seconds = Math.floor(Date.now() / 1000 - (n.createdAt as unknown as { seconds: number }).seconds);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ProNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeNotifications(user.uid, (data) => {
      setNotifications(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRead = (n: Notification) => {
    if (!n.read) markNotificationRead(n.id);
  };

  const handleMarkAll = async () => {
    if (!user) return;
    setMarkingAll(true);
    await markAllNotificationsRead(user.uid);
    setMarkingAll(false);
  };

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/pro/dashboard"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
                  {unreadCount} unread
                </span>
              )}
              <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                Notifications
              </div>
            </div>
          </div>
          <p className="text-lg text-white/85">Professional activity center</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Notifications</h1>
          <p className="mt-3 text-lg text-white/85">
            Track new requests, messages, reviews, and booking updates.
          </p>
        </div>
      </section>

      {/* Info banner */}
      <section className="mx-auto -mt-4 max-w-5xl px-5">
        <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 shadow-sm flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shrink-0">
              <Bell className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Stay Updated</h2>
              <p className="mt-2 text-lg leading-8 text-slate-600">
                Important activity appears here so you can respond faster and keep customers informed.
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={markingAll}
              className="shrink-0 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
            >
              <CheckCheck className="h-5 w-5" />
              {markingAll ? "Marking…" : "Mark all read"}
            </button>
          )}
        </div>
      </section>

      {/* List */}
      <section className="mx-auto max-w-5xl px-5 pt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Bell className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <p className="text-2xl font-semibold text-slate-500">No notifications yet.</p>
            <p className="mt-2 text-lg text-slate-400">Activity from bookings, messages, and reviews will show here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => {
              const style = TYPE_STYLE[item.type] ?? FALLBACK;
              const Icon = style.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleRead(item)}
                  className={`rounded-[2rem] border p-5 shadow-sm transition hover:shadow-md cursor-pointer ${
                    item.read ? "border-gray-200 bg-white" : "border-violet-200 bg-violet-50"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.wrap} shrink-0`}>
                        <Icon className={`h-7 w-7 ${style.color}`} />
                      </div>
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${style.badgeStyle}`}>
                            {style.badge}
                          </span>
                          {!item.read && (
                            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                          )}
                        </div>
                        <p className="text-lg leading-8 text-slate-600">{item.body}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 md:pt-1 shrink-0">
                      <Clock3 className="h-4 w-4" />
                      {timeAgo(item)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
