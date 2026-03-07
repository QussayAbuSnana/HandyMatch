import Link from "next/link";
import {
  Bell,
  Menu,
  Briefcase,
  CalendarDays,
  MessageSquare,
  User,
  MapPin,
  Clock3,
  DollarSign,
  CheckCircle2,
  XCircle,
  Wrench,
} from "lucide-react";

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

const acceptedJobs = [
  {
    id: "job-1",
    customer: "Sarah Johnson",
    service: "Bathroom plumbing fix",
    date: "Today • 10:00 AM",
    location: "Midtown",
    price: "$110",
    status: "Upcoming",
  },
  {
    id: "job-2",
    customer: "Michael Brown",
    service: "Light installation",
    date: "Today • 1:30 PM",
    location: "Eastside",
    price: "$85",
    status: "In Progress",
  },
];

const completedJobs = [
  {
    id: "done-1",
    customer: "Nora Smith",
    service: "Furniture assembly",
    date: "Yesterday • 5:00 PM",
    location: "North District",
    price: "$140",
  },
  {
    id: "done-2",
    customer: "David Lee",
    service: "Wall painting touch-up",
    date: "Jan 5 • 11:00 AM",
    location: "Downtown",
    price: "$95",
  },
];

export default function ProJobsPage() {
  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button className="text-gray-600 transition hover:text-gray-900">
            <Menu className="h-8 w-8" />
          </button>

          <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>

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
          <p className="text-lg text-white/85">Professional workspace</p>
          <h2 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Manage Requests & Jobs
          </h2>
          <p className="mt-3 text-lg text-white/85 md:text-xl">
            Review incoming work, track active jobs, and keep your workflow organized.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Briefcase className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">New Requests</h2>
            <p className="text-lg text-slate-500">
              Respond quickly to increase your chances of getting hired.
            </p>
          </div>
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
                  <div className="flex items-center gap-2 text-3xl font-extrabold text-violet-600">
                    <DollarSign className="h-7 w-7" />
                    {request.price.replace("$", "")}
                  </div>

                  <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-lg font-semibold text-slate-700 transition hover:bg-gray-50">
                      <XCircle className="h-5 w-5" />
                      Decline
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-lg font-semibold text-white transition hover:bg-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <CalendarDays className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Accepted Jobs</h2>
            <p className="text-lg text-slate-500">
              Jobs you have already confirmed and scheduled.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {acceptedJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{job.customer}</h3>
                  <p className="mt-2 text-xl text-slate-700">{job.service}</p>

                  <div className="mt-3 flex flex-col gap-2 text-lg text-slate-500 md:flex-row md:items-center md:gap-4">
                    <span className="flex items-center gap-2">
                      <Clock3 className="h-5 w-5" />
                      {job.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {job.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 md:items-end">
                  <div className="text-3xl font-extrabold text-violet-600">
                    {job.price}
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
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Wrench className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Completed Jobs</h2>
            <p className="text-lg text-slate-500">
              A quick look at recently finished work.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {completedJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{job.customer}</h3>
                  <p className="mt-2 text-xl text-slate-700">{job.service}</p>

                  <div className="mt-3 flex flex-col gap-2 text-lg text-slate-500 md:flex-row md:items-center md:gap-4">
                    <span className="flex items-center gap-2">
                      <Clock3 className="h-5 w-5" />
                      {job.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {job.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 md:items-end">
                  <div className="text-3xl font-extrabold text-emerald-600">
                    {job.price}
                  </div>

                  <span className="rounded-full bg-emerald-100 px-4 py-2 text-lg font-semibold text-emerald-700">
                    Completed
                  </span>
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
            className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700"
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