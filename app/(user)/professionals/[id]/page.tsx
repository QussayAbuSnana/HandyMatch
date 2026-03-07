import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock3,
  Shield,
  MessageSquare,
  CalendarDays,
  CheckCircle2,
  Briefcase,
  Award,
} from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

const professionals: Record<
  string,
  {
    name: string;
    title: string;
    rating: number;
    reviews: number;
    location: string;
    distance: string;
    availability: string;
    price: string;
    completedJobs: string;
    experience: string;
    image: string;
    bio: string;
    services: string[];
    highlights: string[];
  }
> = {
  "sarah-chen": {
    name: "Sarah Chen",
    title: "Certified Electrician",
    rating: 5,
    reviews: 94,
    location: "Midtown",
    distance: "2.1 km away",
    availability: "Available within 30 min",
    price: "$95/hour",
    completedJobs: "256 jobs completed",
    experience: "7 years experience",
    image:
      "https://images.unsplash.com/photo-1598257006626-5b54c8d0fa7f?auto=format&fit=crop&w=800&q=80",
    bio: "Experienced electrician specializing in residential wiring, lighting systems, smart home setup, and fast emergency fixes.",
    services: [
      "Electrical wiring",
      "Smart lighting installation",
      "Power outlet repair",
      "Circuit troubleshooting",
    ],
    highlights: ["Verified professional", "Fast response", "Top rated this week"],
  },
  "mike-johnson": {
    name: "Mike Johnson",
    title: "Professional Plumber",
    rating: 4.9,
    reviews: 127,
    location: "Downtown",
    distance: "1.2 km away",
    availability: "Available within 1 hour",
    price: "$85/hour",
    completedJobs: "342 jobs completed",
    experience: "9 years experience",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    bio: "Reliable plumber focused on repairs, installations, leak detection, and urgent maintenance for kitchens and bathrooms.",
    services: [
      "Sink repair",
      "Leak detection",
      "Pipe installation",
      "Bathroom maintenance",
    ],
    highlights: ["Verified professional", "Highly recommended", "Same-day service"],
  },
  "lisa-thompson": {
    name: "Lisa Thompson",
    title: "Interior Painter",
    rating: 4.9,
    reviews: 89,
    location: "Westside",
    distance: "1.8 km away",
    availability: "Available within 3 hours",
    price: "$65/hour",
    completedJobs: "198 jobs completed",
    experience: "5 years experience",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    bio: "Detail-oriented painter delivering clean interior and exterior finishes, wall touch-ups, and color consultation.",
    services: [
      "Interior painting",
      "Exterior painting",
      "Wall touch-ups",
      "Color consultation",
    ],
    highlights: ["Verified professional", "Clean finishing", "Affordable pricing"],
  },
};

export default async function ProfessionalDetailsPage({ params }: Props) {
  const { id } = await params;
  const professional = professionals[id] ?? professionals["mike-johnson"];

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      <section className="relative">
        <div className="h-72 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 md:h-80" />

        <div className="absolute left-5 right-5 top-5 mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/search"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>

          <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-md">
            Professional Details
          </div>
        </div>

        <div className="relative mx-auto -mt-24 max-w-6xl px-5">
          <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-lg">
            <div className="grid gap-0 md:grid-cols-[320px_1fr]">
              <div className="bg-slate-100">
                <img
                  src={professional.image}
                  alt={professional.name}
                  className="h-full min-h-[320px] w-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {professional.highlights.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                      {professional.name}
                    </h1>

                    <p className="mt-2 text-xl font-medium text-violet-600">
                      {professional.title}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] bg-violet-50 px-5 py-4 text-right">
                    <div className="text-3xl font-extrabold text-violet-700">
                      {professional.price}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">Starting price</div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <div>
                      <div className="text-lg font-semibold text-slate-900">
                        {professional.rating} ({professional.reviews} reviews)
                      </div>
                      <div className="text-sm text-slate-500">Customer rating</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                    <MapPin className="h-6 w-6 text-slate-500" />
                    <div>
                      <div className="text-lg font-semibold text-slate-900">
                        {professional.location}
                      </div>
                      <div className="text-sm text-slate-500">{professional.distance}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                    <Clock3 className="h-6 w-6 text-slate-500" />
                    <div>
                      <div className="text-lg font-semibold text-slate-900">
                        {professional.availability}
                      </div>
                      <div className="text-sm text-slate-500">Availability status</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                    <Briefcase className="h-6 w-6 text-slate-500" />
                    <div>
                      <div className="text-lg font-semibold text-slate-900">
                        {professional.completedJobs}
                      </div>
                      <div className="text-sm text-slate-500">{professional.experience}</div>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  {professional.bio}
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/messages"
                    className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-violet-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-violet-700"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Message
                  </Link>

                  <Link
                    href={`/request/create?pro=${id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-green-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-green-700"
                  >
                    <CalendarDays className="h-5 w-5" />
                    Book Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-5">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Award className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Services Offered</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {professional.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-slate-100 px-4 py-2 text-base font-medium text-slate-700"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Trust & Quality</h2>
            </div>

            <div className="space-y-4">
              {[
                "Verified professional identity",
                "Transparent service pricing",
                "Fast response and booking flow",
                "Rated by previous customers",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-lg text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}