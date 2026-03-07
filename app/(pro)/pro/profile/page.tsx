import Link from "next/link";
import {
  Bell,
  Menu,
  Briefcase,
  CalendarDays,
  MessageSquare,
  User,
  Star,
  MapPin,
  Phone,
  Mail,
  Wallet,
  Clock3,
  Settings,
  ChevronRight,
  LogOut,
  Wrench,
  BadgeCheck,
} from "lucide-react";

const services = [
  "Plumbing Repairs",
  "Pipe Installation",
  "Leak Detection",
  "Bathroom Maintenance",
];

const menuItems = [
  {
    title: "Manage Services",
    icon: Wrench,
    iconWrap: "bg-violet-50",
    iconColor: "text-violet-600",
    href: "/pro/profile/services",
  },
  {
    title: "Availability",
    icon: Clock3,
    iconWrap: "bg-blue-50",
    iconColor: "text-blue-600",
    href: "/pro/availability",
  },
  {
    title: "Earnings",
    icon: Wallet,
    iconWrap: "bg-emerald-50",
    iconColor: "text-emerald-600",
    href: "/pro/profile/earnings",
  },
  {
    title: "Settings",
    icon: Settings,
    iconWrap: "bg-gray-100",
    iconColor: "text-gray-500",
    href: "/pro/profile/settings",
  },
];

export default function ProProfilePage() {
  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button className="text-gray-600 transition hover:text-gray-900">
            <Menu className="h-8 w-8" />
          </button>

          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>

          <Link
            href="/pro/notifications"
            className="relative text-gray-600 transition hover:text-gray-900"
          >
            <Bell className="h-8 w-8" />
            <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-500" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-5">
        <div className="rounded-[2rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 p-8 text-white shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15">
              <User className="h-12 w-12" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-4xl font-bold">Mike Johnson</h2>
                <BadgeCheck className="h-7 w-7 text-sky-300" />
              </div>
              <p className="mt-2 text-2xl text-white/85">Professional Plumber</p>
            </div>
          </div>

          <div className="my-7 h-px bg-white/20" />

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">342</div>
              <div className="mt-2 text-lg text-white/85">Jobs Done</div>
            </div>

            <div>
              <div className="text-4xl font-bold">4.8</div>
              <div className="mt-2 text-lg text-white/85">Rating</div>
            </div>

            <div>
              <div className="text-4xl font-bold">$2,450</div>
              <div className="mt-2 text-lg text-white/85">This Month</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            Professional Information
          </h2>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-slate-500">
                <Mail className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg text-slate-500">Email</p>
                <p className="text-2xl font-medium text-slate-900">
                  mike.johnson@email.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-slate-500">
                <Phone className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg text-slate-500">Phone</p>
                <p className="text-2xl font-medium text-slate-900">
                  +1 (555) 987-6543
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-slate-500">
                <MapPin className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg text-slate-500">Service Area</p>
                <p className="text-2xl font-medium text-slate-900">
                  Downtown, Midtown, Westside
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-slate-500">
                <Wallet className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg text-slate-500">Starting Price</p>
                <p className="text-2xl font-medium text-slate-900">$85 / hour</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            Services Offered
          </h2>

          <div className="flex flex-wrap gap-3">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-full bg-violet-100 px-4 py-2 text-lg font-medium text-violet-700"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900">Availability Status</h2>
          <p className="mt-3 text-xl text-slate-600">
            You are currently marked as available for new requests.
          </p>

          <div className="mt-5 inline-flex rounded-full bg-green-100 px-4 py-2 text-lg font-semibold text-green-700">
            Available Now
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center justify-between rounded-[1.8rem] border border-gray-200 bg-white px-5 py-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconWrap}`}
                  >
                    <Icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>

                  <span className="text-2xl font-semibold text-slate-900">
                    {item.title}
                  </span>
                </div>

                <ChevronRight className="h-7 w-7 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-8">
        <button className="mx-auto flex items-center gap-3 text-2xl font-semibold text-red-600 transition hover:text-red-700">
          <LogOut className="h-6 w-6" />
          Log Out
        </button>
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
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
          >
            <MessageSquare className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">Messages</span>
          </Link>

          <Link
            href="/pro/profile"
            className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700"
          >
            <User className="h-7 w-7" />
            <span className="mt-1 text-base font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}