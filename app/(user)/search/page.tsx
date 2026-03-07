import Link from "next/link";
import {
  Bell,
  Menu,
  Search,
  SlidersHorizontal,
  Home,
  MessageSquare,
  User,
  Star,
  MapPin,
  Clock3,
  Shield,
} from "lucide-react";

const providers = [
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
  {
    id: "david-martinez",
    name: "David Martinez",
    rating: 4.8,
    reviews: 156,
    location: "Eastside",
    distance: "3.5 km",
    availability: "Within 2 hours",
    price: "$75",
    jobs: "423 jobs",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "robert-kim",
    name: "Robert Kim",
    rating: 4.8,
    reviews: 76,
    location: "Downtown",
    distance: "0.8 km",
    availability: "Within 45 min",
    price: "$90",
    jobs: "189 jobs",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    rating: 4.7,
    reviews: 213,
    location: "North District",
    distance: "4.2 km",
    availability: "Available today",
    price: "$70",
    jobs: "518 jobs",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80",
  },
];

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button className="text-gray-600 transition hover:text-gray-900">
            <Menu className="h-8 w-8" />
          </button>

          <h1 className="text-3xl font-bold text-slate-900">Find Providers</h1>

          <button className="relative text-gray-600 transition hover:text-gray-900">
            <Bell className="h-8 w-8" />
            <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-500" />
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center rounded-[1.7rem] border border-gray-200 bg-white px-5 py-5 shadow-sm">
            <Search className="mr-3 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers or services..."
              className="w-full bg-transparent text-lg text-slate-700 placeholder:text-gray-400 outline-none"
            />
          </div>

          <button className="flex items-center justify-center gap-3 rounded-[1.7rem] border border-gray-200 bg-white px-6 py-5 text-xl font-semibold text-slate-700 shadow-sm transition hover:bg-gray-50">
            <SlidersHorizontal className="h-6 w-6" />
            Filters
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">
            {providers.length} Providers Found
          </h2>

          <button className="text-xl font-semibold text-violet-600 transition hover:text-violet-700">
            Sort by ›
          </button>
        </div>

        <div className="space-y-5">
          {providers.map((provider) => (
            <Link
              key={provider.id}
              href={`/professionals/${provider.id}`}
              className="flex flex-col gap-5 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="h-24 w-24 rounded-[1.5rem] object-cover"
                  />
                  <div className="absolute -right-2 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white shadow-md">
                    <Shield className="h-5 w-5" />
                  </div>
                </div>

                <div className="pt-1">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {provider.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-lg text-slate-600">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-slate-900">
                      {provider.rating}
                    </span>
                    <span>({provider.reviews})</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-lg text-slate-500">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {provider.location} • {provider.distance}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-lg text-slate-500">
                    <Clock3 className="h-5 w-5" />
                    <span>{provider.availability}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-end justify-between md:flex-col md:items-end">
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-violet-600">
                    {provider.price}
                  </div>
                  <div className="text-lg text-slate-500">/hour</div>
                </div>

                <div className="rounded-full bg-violet-50 px-4 py-2 text-lg font-semibold text-violet-600">
                  {provider.jobs}
                </div>
              </div>
            </Link>
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
            className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700"
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