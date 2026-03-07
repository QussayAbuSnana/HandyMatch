import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  CalendarDays,
  DollarSign,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const summaryCards = [
  {
    title: "This Month",
    value: "$2,450",
    icon: Wallet,
    gradient: "from-emerald-500 to-green-600",
  },
  {
    title: "Completed Jobs",
    value: "24",
    icon: CheckCircle2,
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Pending Payout",
    value: "$380",
    icon: Clock3,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    title: "Growth",
    value: "+18%",
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-500",
  },
];

const transactions = [
  {
    id: "1",
    customer: "John Doe",
    service: "Kitchen sink repair",
    date: "Jan 12, 2026",
    amount: "$90",
    status: "Paid",
  },
  {
    id: "2",
    customer: "Emily Clark",
    service: "Electrical wiring check",
    date: "Jan 10, 2026",
    amount: "$120",
    status: "Paid",
  },
  {
    id: "3",
    customer: "Nora Smith",
    service: "Furniture assembly",
    date: "Jan 08, 2026",
    amount: "$140",
    status: "Pending",
  },
  {
    id: "4",
    customer: "David Lee",
    service: "Wall painting touch-up",
    date: "Jan 05, 2026",
    amount: "$95",
    status: "Paid",
  },
];

export default function ProEarningsPage() {
  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/pro/profile"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              Earnings
            </div>
          </div>

          <p className="text-lg text-white/85">Professional performance</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Track Your Earnings
          </h1>
          <p className="mt-3 text-lg text-white/85 md:text-xl">
            Monitor completed jobs, monthly income, and pending payouts.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-4 max-w-5xl px-5">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-md`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <div className="text-3xl font-extrabold text-slate-900">
                  {card.value}
                </div>
                <div className="mt-2 text-lg text-slate-500">{card.title}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-8">
        <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <TrendingUp className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Performance Insight
              </h2>
              <p className="mt-3 text-lg leading-8 text-slate-600">
                Your revenue is growing steadily this month. Keeping your
                availability updated and replying quickly can improve your booking
                rate even more.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-8">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Recent Transactions
              </h2>
              <p className="text-lg text-slate-500">
                Overview of your recent completed and pending service payments.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {transactions.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-gray-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.customer}
                  </h3>
                  <p className="mt-1 text-lg text-slate-600">{item.service}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.date}</p>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <div className="flex items-center gap-1 text-2xl font-extrabold text-violet-600">
                    <DollarSign className="h-5 w-5" />
                    {item.amount.replace("$", "")}
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      item.status === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}