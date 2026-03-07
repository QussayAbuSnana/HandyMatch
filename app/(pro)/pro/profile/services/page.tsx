"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Wrench,
  DollarSign,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";

type ServiceItem = {
  id: number;
  name: string;
  price: string;
};

export default function ProServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([
    { id: 1, name: "Plumbing Repairs", price: "85" },
    { id: 2, name: "Pipe Installation", price: "110" },
    { id: 3, name: "Leak Detection", price: "70" },
  ]);
  const [newService, setNewService] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [description, setDescription] = useState(
    "Experienced plumber providing repairs, installations, and maintenance services for residential customers."
  );
  const [saved, setSaved] = useState(false);

  function addService() {
    if (!newService.trim() || !newPrice.trim()) return;

    setServices((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newService.trim(),
        price: newPrice.trim(),
      },
    ]);

    setNewService("");
    setNewPrice("");
    setSaved(false);
  }

  function removeService(id: number) {
    setServices((prev) => prev.filter((service) => service.id !== id));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-10">
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/pro/profile"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              Manage Services
            </div>
          </div>

          <p className="text-lg text-white/85">Professional profile settings</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Manage Your Services
          </h1>
          <p className="mt-3 text-lg text-white/85 md:text-xl">
            Add, update, and organize the services you offer to customers.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-4 max-w-4xl px-5">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <label className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <FileText className="h-5 w-5 text-violet-600" />
            Professional Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setSaved(false);
            }}
            placeholder="Describe your services and experience..."
            className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400"
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Plus className="h-6 w-6 text-violet-600" />
            Add New Service
          </h2>

          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <input
              type="text"
              value={newService}
              onChange={(e) => {
                setNewService(e.target.value);
                setSaved(false);
              }}
              placeholder="Service name"
              className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400"
            />

            <input
              type="number"
              value={newPrice}
              onChange={(e) => {
                setNewPrice(e.target.value);
                setSaved(false);
              }}
              placeholder="Price"
              className="w-full rounded-[1.2rem] border border-gray-200 bg-white px-4 py-4 text-lg text-slate-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400"
            />
          </div>

          <button
            type="button"
            onClick={addService}
            className="mt-4 inline-flex items-center gap-2 rounded-[1.2rem] bg-violet-600 px-5 py-3 text-lg font-semibold text-white transition hover:bg-violet-700"
          >
            <Plus className="h-5 w-5" />
            Add Service
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Wrench className="h-6 w-6 text-violet-600" />
            Current Services
          </h2>

          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-gray-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-lg text-violet-600">
                    <DollarSign className="h-4 w-4" />
                    {service.price} / service
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="inline-flex items-center gap-2 self-start rounded-xl border border-red-200 bg-white px-4 py-2 text-lg font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-green-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-green-700"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>

          <Link
            href="/pro/profile"
            className="inline-flex items-center justify-center rounded-[1.2rem] border border-gray-200 bg-white px-6 py-4 text-lg font-semibold text-slate-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>

        {saved && (
          <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Services Updated
                </h3>
                <p className="mt-1 text-slate-600">
                  Your services and description have been saved successfully.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}