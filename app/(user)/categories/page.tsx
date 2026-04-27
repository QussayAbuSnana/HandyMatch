"use client";

import Link from "next/link";
import { ArrowLeft, Droplets, Zap, Hammer, Paintbrush, Wrench, Wind, Flower2, Shield, Tv, Truck, Scissors, ChefHat } from "lucide-react";

const categories = [
  { name: "Plumbing",       description: "Leaks, pipes, installations",       icon: Droplets,  gradient: "from-violet-500 to-purple-500",   query: "plumbing" },
  { name: "Electrical",     description: "Wiring, fixtures, panels",           icon: Zap,       gradient: "from-orange-400 to-orange-600",   query: "electrical" },
  { name: "Carpentry",      description: "Furniture, repairs, custom builds",  icon: Hammer,    gradient: "from-orange-500 to-red-500",      query: "carpentry" },
  { name: "Painting",       description: "Interior, exterior, touch-ups",      icon: Paintbrush,gradient: "from-sky-500 to-cyan-500",        query: "painting" },
  { name: "HVAC",           description: "AC, heating, ventilation",           icon: Wind,      gradient: "from-blue-400 to-indigo-500",     query: "hvac" },
  { name: "Handyman",       description: "General repairs & maintenance",      icon: Wrench,    gradient: "from-slate-500 to-slate-700",     query: "handyman" },
  { name: "Gardening",      description: "Lawn care, landscaping, pruning",    icon: Flower2,   gradient: "from-green-500 to-emerald-600",   query: "gardening" },
  { name: "Security",       description: "Cameras, locks, alarm systems",      icon: Shield,    gradient: "from-red-500 to-rose-600",        query: "security" },
  { name: "Tech Support",   description: "TV mounting, networks, devices",     icon: Tv,        gradient: "from-purple-500 to-fuchsia-500",  query: "tech" },
  { name: "Moving",         description: "Furniture moving & packing help",    icon: Truck,     gradient: "from-teal-500 to-cyan-600",       query: "moving" },
  { name: "Cleaning",       description: "Deep cleaning, regular upkeep",      icon: Scissors,  gradient: "from-pink-500 to-rose-500",       query: "cleaning" },
  { name: "Cooking",        description: "Private chef, meal prep, catering",  icon: ChefHat,   gradient: "from-amber-400 to-orange-500",    query: "cooking" },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-10 pt-6 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">Categories</div>
          </div>
          <h1 className="text-4xl font-extrabold md:text-5xl">All Categories</h1>
          <p className="mt-3 text-lg text-white/85">Choose a service to find the right professional for you.</p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-5xl px-5 pt-8">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/search?service=${cat.query}`}
                className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-[1.2rem] bg-gradient-to-br ${cat.gradient} text-white shadow-md`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{cat.name}</h3>
                <p className="mt-1 text-base text-slate-500">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
