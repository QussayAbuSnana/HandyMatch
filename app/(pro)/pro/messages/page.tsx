import Link from "next/link";
import {
  Bell,
  Menu,
  Briefcase,
  CalendarDays,
  MessageSquare,
  User,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const conversations = [
  {
    id: "john-doe",
    name: "John Doe",
    service: "Kitchen sink repair",
    message: "Can you come today around 6 PM?",
    time: "8 min ago",
    unread: true,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "emily-clark",
    name: "Emily Clark",
    service: "Electrical wiring check",
    message: "Thank you. Please confirm the final quote.",
    time: "25 min ago",
    unread: true,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    service: "Bathroom plumbing fix",
    message: "The issue looks solved now, thanks again!",
    time: "2 hours ago",
    unread: false,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
];

const updates = [
  {
    id: "update-1",
    title: "Upcoming visit",
    description: "Michael Brown • Light installation • Today at 1:30 PM",
    type: "upcoming",
  },
  {
    id: "update-2",
    title: "Pending confirmation",
    description: "Emily Clark is waiting for your final response",
    type: "pending",
  },
];

export default function ProMessagesPage() {
  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button className="text-gray-600 transition hover:text-gray-900">
            <Menu className="h-8 w-8" />
          </button>

          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>

          <Link
            href="/pro/notifications"
            className="relative text-gray-600 transition hover:text-gray-900"
            >
            <Bell className="h-8 w-8" />
            <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-500" />
            </Link>
        </div>
      </header>

      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-lg text-white/85">Professional communication hub</p>
          <h2 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Stay Connected With Customers
          </h2>
          <p className="mt-3 text-lg text-white/85 md:text-xl">
            Reply quickly, confirm requests, and keep every client updated.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-8">
        <h2 className="mb-5 text-3xl font-bold text-slate-900">Recent Conversations</h2>

        <div className="space-y-4">
          {conversations.map((chat) => (
            <Link
              key={chat.id}
              href={`/pro/messages/${chat.id}`}
              className="flex items-start justify-between gap-4 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <img
                  src={chat.image}
                  alt={chat.name}
                  className="h-20 w-20 rounded-[1.4rem] object-cover"
                />

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{chat.name}</h3>
                  <p className="mt-1 text-lg font-medium text-violet-600">
                    {chat.service}
                  </p>
                  <p className="mt-2 text-lg text-slate-600">{chat.message}</p>
                </div>
              </div>

              <div className="flex min-w-fit flex-col items-end gap-3">
                <span className="text-lg text-slate-500">{chat.time}</span>
                {chat.unread && <span className="h-4 w-4 rounded-full bg-blue-600" />}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-10">
        <h2 className="mb-5 text-3xl font-bold text-slate-900">Quick Updates</h2>

        <div className="space-y-4">
          {updates.map((item) => (
            <div
              key={item.id}
              className={`rounded-[2rem] border p-5 shadow-sm ${
                item.type === "upcoming"
                  ? "border-blue-200 bg-blue-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm ${
                    item.type === "upcoming" ? "bg-blue-600" : "bg-amber-500"
                  }`}
                >
                  {item.type === "upcoming" ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <AlertCircle className="h-7 w-7" />
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-lg text-slate-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link
            href="/pro/dashboard"
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
          >
            <Briefcase className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">Dashboard</span>
          </Link>

          <Link
            href="/pro/jobs"
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
          >
            <CalendarDays className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">Jobs</span>
          </Link>

          <Link
            href="/pro/messages"
            className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700"
          >
            <MessageSquare className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">Messages</span>
          </Link>

          <Link
            href="/pro/profile"
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
          >
            <User className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}