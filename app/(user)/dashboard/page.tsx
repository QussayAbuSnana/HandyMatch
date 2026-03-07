import Link from "next/link";
import {
  Bell,
  Menu,
  Search,
  MapPin,
  Star,
  Clock3,
  Home,
  MessageSquare,
  User,
  Sparkles,
  Check,
  Wrench,
  Droplets,
  Zap,
  Hammer,
  Paintbrush,
  TrendingUp,
} from "lucide-react";

const categories = [
  {
    name: "Plumbing",
    description: "Leaks, installations, repairs",
    icon: Droplets,
    gradient: "from-violet-500 to-purple-500",
    query: "plumbing",
  },
  {
    name: "Electrical",
    description: "Wiring, fixtures, repairs",
    icon: Zap,
    gradient: "from-orange-400 to-orange-600",
    query: "electrical",
  },
  {
    name: "Carpentry",
    description: "Furniture, repairs, installation",
    icon: Hammer,
    gradient: "from-orange-500 to-red-500",
    query: "carpentry",
  },
  {
    name: "Painting",
    description: "Interior, exterior, touch-ups",
    icon: Paintbrush,
    gradient: "from-sky-500 to-cyan-500",
    query: "painting",
  },
];

const professionals = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    rating: 5,
    reviews: 94,
    location: "Midtown",
    distance: "2.1 km",
    availability: "Within 30 min",
    price: "$95",
    jobs: "256 jobs",
    image:
      "https://images.unsplash.com/photo-1598257006626-5b54c8d0fa7f?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "mike-johnson",
    name: "Mike Johnson",
    rating: 4.9,
    reviews: 127,
    location: "Downtown",
    distance: "1.2 km",
    availability: "Within 1 hour",
    price: "$85",
    jobs: "342 jobs",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "lisa-thompson",
    name: "Lisa Thompson",
    rating: 4.9,
    reviews: 89,
    location: "Westside",
    distance: "1.8 km",
    availability: "Within 3 hours",
    price: "$65",
    jobs: "198 jobs",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80",
  },
];

const benefits = [
  {
    title: "Verified Professionals",
    description: "All providers are background checked and verified",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    title: "Transparent Pricing",
    description: "Know the costs upfront, no hidden fees",
    gradient: "from-sky-400 to-cyan-500",
  },
  {
    title: "Fast Response",
    description: "Get matched with available pros quickly",
    gradient: "from-fuchsia-500 to-pink-500",
  },
];

export default function CustomerDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button className="text-gray-600 transition hover:text-gray-900">
            <Menu className="h-8 w-8" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-violet-600">HandyMatch</span>
          </div>

          <button className="relative text-gray-600 transition hover:text-gray-900">
            <Bell className="h-8 w-8" />
            <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-500" />
          </button>
        </div>
      </header>

      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-10 pt-6 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 flex items-center gap-2 text-xl font-medium text-white/90">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            Welcome to HandyMatch
          </p>

          <h1 className="mb-3 text-4xl font-extrabold md:text-6xl">
            Find Your Perfect Match
          </h1>

          <p className="text-lg text-white/85 md:text-2xl">
            Trusted local professionals at your fingertips
          </p>

          <div className="mt-8 flex items-center justify-between rounded-[2rem] bg-white px-5 py-4 shadow-2xl">
            <div className="flex items-center gap-3 text-gray-400">
              <Search className="h-7 w-7" />
              <span className="text-lg md:text-2xl">Search for services...</span>
            </div>

            <Link
              href="/search"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white transition hover:bg-violet-700"
            >
              <MapPin className="h-7 w-7" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { value: "500+", label: "Professionals" },
              { value: "4.8★", label: "Avg Rating" },
              { value: "10k+", label: "Jobs Done" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[2rem] border border-white/20 bg-white/10 px-6 py-7 text-center shadow-lg backdrop-blur-sm"
              >
                <div className="text-4xl font-extrabold">{item.value}</div>
                <div className="mt-2 text-lg text-white/85">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-6 max-w-7xl px-5">
        <div className="grid gap-5 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={`/search?service=${category.query}`}
                className="rounded-[2rem] border border-gray-200 bg-white px-8 py-10 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${category.gradient} text-white shadow-md`}
                >
                  <Icon className="h-9 w-9" />
                </div>

                <h3 className="text-center text-2xl font-bold text-slate-900">
                  {category.name}
                </h3>
                <p className="mt-3 text-center text-lg text-slate-500">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>

        <Link
          href="/search"
          className="mt-5 block rounded-[1.5rem] bg-violet-50 px-6 py-5 text-center text-xl font-semibold text-violet-700 transition hover:bg-violet-100"
        >
          View All Categories →
        </Link>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-orange-500 p-3 text-white shadow-md">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 md:text-4xl">
                Top Rated This Week
              </h2>
              <p className="mt-1 text-lg text-slate-500">
                Most trusted professionals
              </p>
            </div>
          </div>

          <Link href="/professionals" className="text-xl font-semibold text-violet-600">
            See All
          </Link>
        </div>

        <div className="space-y-4">
          {professionals.map((pro) => (
            <Link
              key={pro.id}
              href={`/professionals/${pro.id}`}
              className="flex flex-col gap-5 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="h-24 w-24 rounded-[1.5rem] object-cover"
                />

                <div className="pt-1">
                  <h3 className="text-2xl font-bold text-slate-900">{pro.name}</h3>

                  <div className="mt-2 flex items-center gap-2 text-lg text-slate-600">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-slate-900">{pro.rating}</span>
                    <span>({pro.reviews})</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-lg text-slate-500">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {pro.location} • {pro.distance}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-lg text-slate-500">
                    <Clock3 className="h-5 w-5" />
                    <span>{pro.availability}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-end justify-between md:flex-col md:items-end">
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-violet-600">{pro.price}</div>
                  <div className="text-lg text-slate-500">/hour</div>
                </div>

                <div className="rounded-full bg-violet-50 px-4 py-2 text-lg font-semibold text-violet-600">
                  {pro.jobs}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-5">
        <div className="rounded-[2.2rem] bg-teal-50 p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            <h2 className="text-3xl font-bold text-slate-900">Why HandyMatch?</h2>
          </div>

          <div className="space-y-6">
            {benefits.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md`}
                >
                  <Check className="h-7 w-7" />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-lg text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700"
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
            className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100"
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