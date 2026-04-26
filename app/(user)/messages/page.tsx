"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Home, Search, MessageSquare, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeConversations, subscribeCustomerBookings } from "@/lib/firestore";
import { BellButton } from "@/components/shared/CustomerNavBar";
import SideMenu from "@/components/shared/SideMenu";
import { Conversation, Booking } from "@/lib/types";

function timeAgo(ts: unknown): string {
  if (!ts) return "";
  const seconds = (ts as { seconds: number }).seconds;
  const diff = Math.floor((Date.now() / 1000) - seconds);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const u1 = subscribeConversations(user.uid, setConversations);
    const u2 = subscribeCustomerBookings(user.uid, setBookings);
    return () => { u1(); u2(); };
  }, [user]);

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button onClick={() => setMenuOpen(true)} className="text-gray-600"><Menu className="h-8 w-8" /></button>
          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
          <BellButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-8">
        <h2 className="mb-6 text-3xl font-bold text-slate-900">Messages</h2>

        {conversations.length === 0 ? (
          <p className="text-center text-xl text-slate-400 py-8">No conversations yet. Book a professional to start chatting!</p>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => {
              const otherName = Object.entries(conv.participantNames ?? {}).find(([id]) => id !== user?.uid)?.[1] ?? "Unknown";
              return (
                <Link key={conv.id} href={`/messages/${conv.id}`}
                  className="flex items-start justify-between gap-4 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-[1.3rem] bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-2xl font-bold">
                      {otherName[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{otherName}</h3>
                      <p className="mt-2 text-xl text-slate-600 line-clamp-1">{conv.lastMessage || "Start the conversation…"}</p>
                    </div>
                  </div>
                  <span className="text-lg text-slate-500 whitespace-nowrap">{timeAgo(conv.lastMessageAt)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-10">
        <h2 className="mb-6 text-3xl font-bold text-slate-900">My Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-center text-xl text-slate-400 py-8">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const statusStyle = {
                pending: "bg-yellow-100 text-yellow-700",
                accepted: "bg-blue-100 text-blue-700",
                in_progress: "bg-blue-100 text-blue-700",
                completed: "bg-green-100 text-green-700",
                cancelled: "bg-red-100 text-red-700",
              }[b.status] ?? "bg-gray-100 text-gray-700";

              return (
                <div key={b.id} className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{b.professionalName}</h3>
                      <p className="mt-1 text-xl text-slate-700">{b.service}</p>
                      <p className="mt-1 text-lg text-slate-500">${b.price}/hr</p>
                    </div>
                    <span className={`rounded-xl px-4 py-2 text-lg font-semibold capitalize ${statusStyle}`}>
                      {b.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link href="/dashboard" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <Home className="h-7 w-7" /><span className="mt-1 text-base font-medium">Home</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <Search className="h-7 w-7" /><span className="mt-1 text-base font-medium">Search</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700">
            <MessageSquare className="h-7 w-7" /><span className="mt-1 text-base font-medium">Messages</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <User className="h-7 w-7" /><span className="mt-1 text-base font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
