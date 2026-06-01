"use client";

import { useState } from "react";
import { X, Ban, Loader2 } from "lucide-react";

const REASONS = [
  "Found another provider",
  "Plans changed",
  "Price too high",
  "Booked by mistake",
  "Pro didn't respond",
  "Other",
];

interface Props {
  professionalName: string;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}

export default function CancelReasonModal({ professionalName, onConfirm, onClose }: Props) {
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reason = selected === "Other" ? custom.trim() : selected;

  const handleConfirm = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      await onConfirm(reason);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Cancel Booking</h2>
            <p className="text-base text-slate-500 mt-1">with {professionalName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-base font-semibold text-slate-700 mb-3">Why are you cancelling?</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                selected === r
                  ? "border-red-400 bg-red-50 text-red-700"
                  : "border-gray-200 bg-gray-50 text-slate-700 hover:border-red-200 hover:bg-red-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {selected === "Other" && (
          <textarea
            autoFocus
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Please describe your reason…"
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-base text-slate-700 outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
          />
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-base font-semibold text-slate-700 hover:bg-gray-50 transition"
          >
            Keep Booking
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason || submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500 text-base font-bold text-white hover:bg-red-600 transition disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
            {submitting ? "Cancelling…" : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
