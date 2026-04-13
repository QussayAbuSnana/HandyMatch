"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Bell,
  Menu,
  Briefcase,
  MessageSquare,
  User,
  Star,
  Wallet,
  Clock3,
  CheckCircle2,
  MapPin,
  ArrowRight,
  CalendarDays,
  Hammer,
} from "lucide-react";

const stats = [
  {
    title: "New Requests",
    value: "5",
    icon: Briefcase,
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Today's Jobs",
    value: "3",
    icon: CalendarDays,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Rating",
    value: "4.8",
    icon: Star,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    title: "This Month",
    value: "$2,450",
    icon: Wallet,
    gradient: "from-emerald-500 to-green-600",
  },
];

const newRequests = [
  {
    id: "req-1",
    customer: "John Doe",
    service: "Kitchen sink repair",
    location: "Downtown",
    time: "Requested 15 min ago",
    price: "$90",
  },
  {
    id: "req-2",
    customer: "Emily Clark",
    service: "Electrical wiring check",
    location: "Westside",
    time: "Requested 40 min ago",
    price: "$120",
  },
];

const todayJobs = [
  {
    id: "job-1",
    customer: "Sarah Johnson",
    service: "Bathroom plumbing fix",
    time: "10:00 AM",
    location: "Midtown",
    status: "Upcoming",
  },
  {
    id: "job-2",
    customer: "Michael Brown",
    service: "Light installation",
    time: "1:30 PM",
    location: "Eastside",
    status: "In Progress",
  },
  {
    id: "job-3",
    customer: "Nora Smith",
    service: "Furniture assembly",
    time: "5:00 PM",
    location: "North District",
    status: "Upcoming",
  },
];

export default function ProfessionalDashboardPage() {
  const { userProfile } = useAuth();
  const firstName = userProfile?.displayName?.split(" ")[0] ?? "there";

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button className="text-gray-600 transition hover:text-gray-900">
            <Menu className="h-8 w-8" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
              <Hammer className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-violet-600">HandyMatch Pro</span>
          </div>

          <Link
          href="/pro/notifications"
          className="relative text-gray-600 transition hover:text-gray-900"
        >
          <Bell className="h-8 w-8" />
          <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-500" />
        </Link>
        </div>
      </header>

      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-10 pt-6 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xl font-medium text-white/90">
            Welcome back, {firstName}!
          </p>

          <h1 className="mb-3 text-4xl font-extrabold md:text-6xl">
            Manage Your Workday
          </h1>

          <p className="text-lg text-white/85 md:text-2xl">
            Track requests, jobs, earnings, and client communication
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-white/20 bg-white/10 px-6 py-6 shadow-lg backdrop-blur-sm"
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="text-3xl font-extrabold">{item.value}</div>
                  <div className="mt-2 text-lg text-white/85">{item.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-6 max-w-7xl px-5">
        <div className="grid gap-5 md:grid-cols-3">
          <Link
            href="/pro/jobs"
            className="rounded-[2rem] border border-gray-200 bg-white px-6 py-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">View Requests</h3>
            <p className="mt-2 text-lg text-slate-500">
              Review incoming customer requests and respond quickly.
            </p>
          </Link>

          <Link
            href="/pro/messages"
            className="rounded-[2rem] border border-gray-200 bg-white px-6 py-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Open Messages</h3>
            <p className="mt-2 text-lg text-slate-500">
              Stay connected with customers and manage conversations.
            </p>
          </Link>

          <Link
            href="/pro/profile"
            className="rounded-[2rem] border border-gray-200 bg-white px-6 py-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <User className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Update Profile</h3>
            <p className="mt-2 text-lg text-slate-500">
              Edit your services, pricing, and availability information.
            </p>
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">New Requests</h2>
          <Link href="/pro/jobs" className="text-xl font-semibold text-violet-600">
            See all
          </Link>
        </div>

        <div className="space-y-4">
          {newRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {request.customer}
                  </h3>
                  <p className="mt-2 text-xl text-slate-700">{request.service}</p>

                  <div className="mt-3 flex flex-col gap-2 text-lg text-slate-500 md:flex-row md:items-center md:gap-4">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {request.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock3 className="h-5 w-5" />
                      {request.time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 md:items-end">
                  <div className="text-3xl font-extrabold text-violet-600">
                    {request.price}
                  </div>

                  <div className="flex gap-3">
                    <button className="rounded-xl border border-gray-200 px-4 py-2 text-lg font-semibold text-slate-700 transition hover:bg-gray-50">
                      Decline
                    </button>
                    <button className="rounded-xl bg-green-600 px-4 py-2 text-lg font-semibold text-white transition hover:bg-green-700">
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Today's Jobs</h2>
          <Link href="/pro/jobs" className="text-xl font-semibold text-violet-600">
            View schedule
          </Link>
        </div>

        <div className="space-y-4">
          {todayJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{job.customer}</h3>
                  <p className="mt-2 text-xl text-slate-700">{job.service}</p>

                  <div className="mt-3 flex flex-col gap-2 text-lg text-slate-500 md:flex-row md:items-center md:gap-4">
                    <span className="flex items-center gap-2">
                      <Clock3 className="h-5 w-5" />
                      {job.time}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {job.location}
                    </span>
                  </div>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-lg font-semibold ${
                    job.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-5">
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-7 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900">
                Keep your availability updated
              </h2>
              <p className="mt-3 text-xl text-slate-600">
                Customers are more likely to book you when your schedule and
                services are up to date.
              </p>

              <Link
                href="/pro/availability"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-lg font-semibold text-white transition hover:bg-green-700"
              >
                Update availability
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link
            href="/pro/dashboard"
            className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700"
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
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
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