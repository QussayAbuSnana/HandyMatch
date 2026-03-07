import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  MoreVertical,
  Send,
  CalendarDays,
  Clock3,
  Shield,
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
    image: string;
    messages: {
      id: string;
      sender: "provider" | "customer";
      text: string;
      time: string;
    }[];
  }
> = {
  "mike-johnson": {
    name: "Mike Johnson",
    service: "Kitchen sink repair",
    status: "Available now",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=300&q=80",
    messages: [
      {
        id: "1",
        sender: "provider",
        text: "Hi! I saw your request for the kitchen sink repair.",
        time: "9:10 AM",
      },
      {
        id: "2",
        sender: "customer",
        text: "Great, are you available today?",
        time: "9:12 AM",
      },
      {
        id: "3",
        sender: "provider",
        text: "Yes, I can come today around 6 PM if that works for you.",
        time: "9:14 AM",
      },
      {
        id: "4",
        sender: "customer",
        text: "That works. Please bring the parts if needed.",
        time: "9:16 AM",
      },
    ],
  },
  "sarah-chen": {
    name: "Sarah Chen",
    service: "Smart lighting installation",
    status: "Responds quickly",
    image:
      "https://images.unsplash.com/photo-1598257006626-5b54c8d0fa7f?auto=format&fit=crop&w=300&q=80",
    messages: [
      {
        id: "1",
        sender: "provider",
        text: "Hello! I can help with the smart lighting setup.",
        time: "Yesterday",
      },
      {
        id: "2",
        sender: "customer",
        text: "Perfect. I need installation for 4 lights.",
        time: "Yesterday",
      },
    ],
  },
};

export default async function ChatPage({ params }: Props) {
  const { id } = await params;
  const conversation = conversations[id] ?? conversations["mike-johnson"];

  return (
    <main className="min-h-screen bg-[#f8f8fb]">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/messages"
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
                Active Service Conversation
              </h2>
              <p className="mt-1 text-slate-600">{conversation.service}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-medium text-slate-700">
                <CalendarDays className="h-4 w-4 text-violet-600" />
                Service in progress
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-medium text-slate-700">
                <Shield className="h-4 w-4 text-emerald-600" />
                Verified provider
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="space-y-4">
            {conversation.messages.map((message) => {
              const isCustomer = message.sender === "customer";

              return (
                <div
                  key={message.id}
                  className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[1.4rem] px-4 py-3 md:max-w-[70%] ${
                      isCustomer
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="text-base leading-7">{message.text}</p>
                    <div
                      className={`mt-2 text-xs ${
                        isCustomer ? "text-violet-100" : "text-slate-500"
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
                placeholder="Type your message..."
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
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <Clock3 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Booking Reminder</h3>
              <p className="mt-2 text-slate-600">
                Keep all service details inside the chat so both sides have a clear
                record of time, location, and expectations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}