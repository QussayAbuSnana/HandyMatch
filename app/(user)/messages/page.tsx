import Link from "next/link";
import {
  Bell,
  Menu,
  Home,
  Search,
  MessageSquare,
  User,
  Check,
  Clock3,
} from "lucide-react";

const conversations = [
  {
    id: "mike-johnson",
    name: "Mike Johnson",
    message: "I can come tomorrow at 2 PM to check the pipes.",
    time: "10 min ago",
    unread: true,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    message: "The electrical work is complete. Thank you!",
    time: "2 hours ago",
    unread: false,
    image:
      "https://images.unsplash.com/photo-1598257006626-5b54c8d0fa7f?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "david-martinez",
    name: "David Martinez",
    message: "I'll send you a quote by end of day.",
    time: "Yesterday",
    unread: false,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80",
  },
];

const bookings = [
  {
    id: "booking-1",
    provider: "Mike Johnson",
    service: "Kitchen sink repair",
    date: "Dec 28, 2025",
    status: "Completed",
    statusColor: "text-green-700 bg-green-100",
    cardStyle: "border-green-200 bg-green-50",
    iconStyle: "bg-green-500",
    icon: "check",
  },
  {
    id: "booking-2",
    provider: "Sarah Chen",
    service: "Smart lighting installation",
    date: "Jan 8, 2026 at 10:00 AM",
    status: "Upcoming",
    statusColor: "text-blue-700 bg-blue-100",
    cardStyle: "border-blue-200 bg-blue-50",
    iconStyle: "bg-blue-600",
    icon: "clock",
  },
];

export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button className="text-gray-600 transition hover:text-gray-900">
            <Menu className="h-8 w-8" />
          </button>

          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>

          <button className="relative text-gray-600 transition hover:text-gray-900">
            <Bell className="h-8 w-8" />
            <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-500" />
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-8">
        <h2 className="mb-6 text-3xl font-bold text-slate-900">Messages</h2>

        <div className="space-y-4">
          {conversations.map((chat) => (
            <Link
              key={chat.id}
              href={`/messages/${chat.id}`}
              className="flex items-start justify-between gap-4 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <img
                  src={chat.image}
                  alt={chat.name}
                  className="h-18 w-18 rounded-[1.3rem] object-cover"
                />

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{chat.name}</h3>
                  <p className="mt-2 text-xl text-slate-600">{chat.message}</p>
                </div>
              </div>

              <div className="flex min-w-fit flex-col items-end gap-3">
                <span className="text-lg text-slate-500">{chat.time}</span>
                {chat.unread && (
                  <span className="h-4 w-4 rounded-full bg-blue-600" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-10">
        <h2 className="mb-6 text-3xl font-bold text-slate-900">Recent Bookings</h2>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`rounded-[2rem] border p-5 shadow-sm ${booking.cardStyle}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm ${booking.iconStyle}`}
                  >
                    {booking.icon === "check" ? (
                      <Check className="h-7 w-7" />
                    ) : (
                      <Clock3 className="h-7 w-7" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {booking.provider}
                    </h3>
                    <p className="mt-1 text-xl text-slate-700">{booking.service}</p>
                    <p className="mt-1 text-lg text-slate-500">{booking.date}</p>
                  </div>
                </div>

                <span
                  className={`rounded-xl px-4 py-2 text-lg font-semibold ${booking.statusColor}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
          >
            <Home className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">Home</span>
          </Link>

          <Link
            href="/search"
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
          >
            <Search className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">Search</span>
          </Link>

          <Link
            href="/messages"
            className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700"
          >
            <MessageSquare className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">Messages</span>
          </Link>

          <Link
            href="/profile"
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