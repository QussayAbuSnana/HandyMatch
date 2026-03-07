import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  MoreVertical,
  Send,
  CalendarDays,
  MapPin,
  Shield,
  Clock3,
} from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

const conversations: Record<
  string,
  {
    name: string;
    service: string;
    status: string;
    location: string;
    image: string;
    messages: {
      id: string;
      sender: "pro" | "customer";
      text: string;
      time: string;
    }[];
  }
> = {
  "john-doe": {
    name: "John Doe",
    service: "Kitchen sink repair",
    status: "Waiting for confirmation",
    location: "Downtown",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    messages: [
      {
        id: "1",
        sender: "customer",
        text: "Hi, I need help with a leaking kitchen sink.",
        time: "9:10 AM",
      },
      {
        id: "2",
        sender: "pro",
        text: "Hello! I can help. Can you share when you need the service?",
        time: "9:12 AM",
      },
      {
        id: "3",
        sender: "customer",
        text: "Today if possible, maybe around 6 PM.",
        time: "9:14 AM",
      },
      {
        id: "4",
        sender: "pro",
        text: "That works. I can come around 6 PM and inspect it first.",
        time: "9:16 AM",
      },
    ],
  },
  "emily-clark": {
    name: "Emily Clark",
    service: "Electrical wiring check",
    status: "Quote requested",
    location: "Westside",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    messages: [
      {
        id: "1",
        sender: "customer",
        text: "Can you confirm the final quote for the wiring check?",
        time: "Yesterday",
      },
      {
        id: "2",
        sender: "pro",
        text: "Yes, I’ll send the final estimate shortly.",
        time: "Yesterday",
      },
    ],
  },
};

export default async function ProChatPage({ params }: Props) {
  const { id } = await params;
  const conversation = conversations[id] ?? conversations["john-doe"];

  return (
    <main className="min-h-screen bg-[#f8f8fb]">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/pro/messages"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <img
              src={conversation.image}
              alt={conversation.name}
              className="h-12 w-12 rounded-full object-cover"
            />

            <div>
              <h1 className="text-lg font-bold text-slate-900">{conversation.name}</h1>
              <p className="text-sm text-slate-500">{conversation.status}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200">
              <Phone className="h-5 w-5" />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 pt-5">
        <div className="rounded-[1.8rem] border border-violet-200 bg-violet-50 p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Active Customer Conversation
              </h2>
              <p className="mt-1 text-slate-600">{conversation.service}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-medium text-slate-700">
                <MapPin className="h-4 w-4 text-violet-600" />
                {conversation.location}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-medium text-slate-700">
                <Shield className="h-4 w-4 text-emerald-600" />
                Verified booking flow
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="space-y-4">
            {conversation.messages.map((message) => {
              const isPro = message.sender === "pro";

              return (
                <div
                  key={message.id}
                  className={`flex ${isPro ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[1.4rem] px-4 py-3 md:max-w-[70%] ${
                      isPro
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="text-base leading-7">{message.text}</p>
                    <div
                      className={`mt-2 text-xs ${
                        isPro ? "text-violet-100" : "text-slate-500"
                      }`}
                    >
                      {message.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-gray-200 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Reply to customer..."
                className="w-full bg-transparent px-2 py-3 text-base text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10">
        <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Professional Reminder</h3>
              <p className="mt-2 text-slate-600">
                Use the chat to confirm the appointment time, location, and job
                expectations before arrival.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <Clock3 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Quick Action Tip</h3>
              <p className="mt-2 text-slate-600">
                Fast replies improve trust and increase your chances of converting
                requests into confirmed jobs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}