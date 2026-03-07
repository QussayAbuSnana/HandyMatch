import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Briefcase,
  MessageSquare,
  Star,
  Wallet,
  Clock3,
  CheckCircle2,
} from "lucide-react";

const notifications = [
  {
    id: "1",
    type: "request",
    title: "New service request received",
    description: "John Doe requested a kitchen sink repair in Downtown.",
    time: "5 min ago",
    icon: Briefcase,
    iconWrap: "bg-violet-100",
    iconColor: "text-violet-600",
    badge: "New Request",
    badgeStyle: "bg-violet-100 text-violet-700",
  },
  {
    id: "2",
    type: "message",
    title: "New customer message",
    description: "Emily Clark sent you a message about the final quote.",
    time: "18 min ago",
    icon: MessageSquare,
    iconWrap: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "Message",
    badgeStyle: "bg-blue-100 text-blue-700",
  },
  {
    id: "3",
    type: "review",
    title: "New 5-star review",
    description: "Sarah Johnson left a positive review after the completed service.",
    time: "2 hours ago",
    icon: Star,
    iconWrap: "bg-amber-100",
    iconColor: "text-amber-600",
    badge: "Review",
    badgeStyle: "bg-amber-100 text-amber-700",
  },
  {
    id: "4",
    type: "payment",
    title: "Payment received",
    description: "A payment of $120 was added to your account balance.",
    time: "Today",
    icon: Wallet,
    iconWrap: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badge: "Payment",
    badgeStyle: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "5",
    type: "schedule",
    title: "Upcoming job reminder",
    description: "You have a scheduled light installation today at 1:30 PM.",
    time: "Today",
    icon: Clock3,
    iconWrap: "bg-pink-100",
    iconColor: "text-pink-600",
    badge: "Reminder",
    badgeStyle: "bg-pink-100 text-pink-700",
  },
];

export default function ProNotificationsPage() {
  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/pro/dashboard"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              Notifications
            </div>
          </div>

          <p className="text-lg text-white/85">Professional activity center</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Notifications
          </h1>
          <p className="mt-3 text-lg text-white/85 md:text-xl">
            Track new requests, messages, reviews, reminders, and payment updates.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-4 max-w-5xl px-5">
        <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Bell className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Stay Updated
              </h2>
              <p className="mt-3 text-lg leading-8 text-slate-600">
                Important activity appears here so you can respond faster, keep
                customers informed, and manage your work more efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-8">
        <div className="space-y-4">
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconWrap}`}
                    >
                      <Icon className={`h-7 w-7 ${item.iconColor}`} />
                    </div>

                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${item.badgeStyle}`}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <p className="text-lg leading-8 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500 md:pt-1">
                    <Clock3 className="h-4 w-4" />
                    {item.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-8">
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Pro Tip
              </h2>
              <p className="mt-3 text-lg leading-8 text-slate-600">
                Fast reactions to requests and messages improve your profile
                performance and increase your chances of getting more confirmed jobs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}