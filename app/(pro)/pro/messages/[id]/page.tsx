"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeMessages, sendMessage } from "@/lib/firestore";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message, Conversation } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export default function ProChatPage({ params }: Props) {
  const { id: conversationId } = use(params);
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getDoc(doc(db, "conversations", conversationId)).then((snap) => {
      if (snap.exists()) setConversation({ id: snap.id, ...snap.data() } as Conversation);
    });
  }, [conversationId]);

  useEffect(() => {
    const unsub = subscribeMessages(conversationId, setMessages);
    return unsub;
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const otherName = conversation
    ? Object.entries(conversation.participantNames ?? {}).find(([id]) => id !== user?.uid)?.[1] ?? "Unknown"
    : "…";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setSending(true);
    try {
      await sendMessage(conversationId, user.uid, text.trim());
      setText("");
      inputRef.current?.focus();
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  };

  const formatTime = (ts: unknown) => {
    if (!ts) return "";
    const d = new Date((ts as { seconds: number }).seconds * 1000);
    return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (ts: unknown) => {
    if (!ts) return "";
    const d = new Date((ts as { seconds: number }).seconds * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const grouped: { date: string; messages: Message[] }[] = [];
  for (const msg of messages) {
    const date = formatDate(msg.createdAt);
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      grouped.push({ date, messages: [msg] });
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8f8fb]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur px-5 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/pro/messages" className="text-gray-600 hover:text-gray-900 shrink-0">
          <ArrowLeft className="h-8 w-8" />
        </Link>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-xl font-bold shrink-0">
          {otherName[0] ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 truncate">{otherName}</h1>
          <p className="text-base text-green-500 font-medium">Customer</p>
        </div>
        <Phone className="h-7 w-7 text-gray-400" />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600">
              {otherName[0] ?? "?"}
            </div>
            <p className="text-2xl font-bold text-slate-900">{otherName}</p>
            <p className="text-lg text-slate-400">No messages yet. Start the conversation!</p>
          </div>
        )}

        {grouped.map(({ date, messages: msgs }) => (
          <div key={date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm font-medium text-slate-400 px-2">{date}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {msgs.map((msg, i) => {
              const isMe = msg.senderId === user?.uid;
              const prevMsg = msgs[i - 1];
              const isSameAuthor = prevMsg?.senderId === msg.senderId;

              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${isSameAuthor ? "mt-1" : "mt-3"}`}>
                  {!isMe && !isSameAuthor && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-base font-bold mr-2 mt-auto shrink-0">
                      {otherName[0]}
                    </div>
                  )}
                  {!isMe && isSameAuthor && <div className="w-11 shrink-0" />}

                  <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className={`rounded-[1.4rem] px-5 py-3 shadow-sm ${
                      isMe
                        ? "bg-violet-600 text-white rounded-br-sm"
                        : "bg-white text-slate-900 border border-gray-200 rounded-bl-sm"
                    }`}>
                      <p className="text-lg leading-relaxed">{msg.text}</p>
                    </div>
                    <p className="mt-1 text-xs px-1 text-slate-400">
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-gray-200 bg-white px-4 py-4 flex gap-3 items-center">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1 rounded-[1.5rem] border border-gray-200 bg-gray-50 px-5 py-4 text-lg text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md transition hover:bg-violet-700 disabled:opacity-40 shrink-0"
        >
          <Send className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
}
