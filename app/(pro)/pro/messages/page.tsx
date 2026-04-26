"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Menu, Briefcase, CalendarDays, MessageSquare, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeConversations } from "@/lib/firestore";
import { Conversation } from "@/lib/types";
import ProSideMenu from "@/components/shared/ProSideMenu";

function timeAgo(ts: unknown): string {
  if (!ts) return "";
  const seconds = (ts as { seconds: number }).seconds;
  const diff = Math.floor(Date.now() / 1000 - seconds);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ProMessagesPage() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeConversations(user.uid, setConversations);
    return unsub;
  }, [user]);

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <ProSideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button onClick={() => setMenuOpen(true)} className="text-gray-600"><Menu className="h-8 w-8" /></button>
          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
          <Link href="/pro/notifications" className="relative text-gray-600">
            <Bell className="h-8 w-8" />
            <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-500" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-8">
        <h2 className="mb-6 text-3xl font-bold text-slate-900">Customer Conversations</h2>

        {conversations.length === 0 ? (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-12 text-center shadow-sm">
            <MessageSquare className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <p className="text-2xl font-semibold text-slate-500">No messages yet.</p>
            <p className="mt-2 text-lg text-slate-400">Customers will appear here once they contact you.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => {
              const otherName = Object.entries(conv.participantNames ?? {})
                .find(([id]) => id !== user?.uid)?.[1] ?? "Customer";
              return (
                <Link
                  key={conv.id}
                  href={`/pro/messages/${conv.id}`}
                  className="flex items-start justify-between gap-4 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-[1.3rem] bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
                      {otherName[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{otherName}</h3>
                      <p className="mt-2 text-xl text-slate-600 line-clamp-1">
                        {conv.lastMessage || "Start the conversation…"}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg text-slate-500 whitespace-nowrap">
                    {timeAgo(conv.lastMessageAt)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link href="/pro/dashboard" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <Briefcase className="h-7 w-7" /><span className="mt-1 text-base font-medium">Dashboard</span>
          </Link>
          <Link href="/pro/jobs" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <CalendarDays className="h-7 w-7" /><span className="mt-1 text-base font-medium">Jobs</span>
          </Link>
          <Link href="/pro/messages" className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700">
            <MessageSquare className="h-7 w-7" /><span className="mt-1 text-base font-medium">Messages</span>
          </Link>
          <Link href="/pro/profile" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <User className="h-7 w-7" /><span className="mt-1 text-base font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
