"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeMessages, sendMessage } from "@/lib/firestore";
import { Message } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export default function ChatPage({ params }: Props) {
  const { id: conversationId } = use(params);
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeMessages(conversationId, setMessages);
    return unsub;
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setSending(true);
    try {
      await sendMessage(conversationId, user.uid, text.trim());
      setText("");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts: unknown) => {
    if (!ts) return "";
    const d = new Date((ts as { seconds: number }).seconds * 1000);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f8fb]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur px-5 py-4 flex items-center gap-4">
        <Link href="/messages" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-8 w-8" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Conversation</h1>
          <p className="text-lg text-slate-500">Real-time chat</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-xl text-slate-400 mt-20">No messages yet. Say hello!</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-[1.5rem] px-5 py-4 shadow-sm ${isMe ? "bg-violet-600 text-white rounded-br-md" : "bg-white text-slate-900 rounded-bl-md border border-gray-200"}`}>
                <p className="text-xl leading-relaxed">{msg.text}</p>
                <p className={`mt-1 text-sm ${isMe ? "text-violet-200" : "text-slate-400"}`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-gray-200 bg-white px-5 py-4 flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-[1.5rem] border border-gray-200 bg-gray-50 px-5 py-4 text-xl text-slate-700 outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md transition hover:bg-violet-700 disabled:opacity-50"
        >
          <Send className="h-7 w-7" />
        </button>
      </form>
    </div>
  );
}
