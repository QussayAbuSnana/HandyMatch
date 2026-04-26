"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { submitReview } from "@/lib/firestore";
import { Review } from "@/lib/types";

interface Props {
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  subjectId: string;
  subjectName: string;
  type: Review["type"];
  onDone: () => void;
  onClose: () => void;
}

export default function ReviewModal({
  bookingId, reviewerId, reviewerName,
  subjectId, subjectName, type, onDone, onClose,
}: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    setError("");
    try {
      await submitReview({ bookingId, reviewerId, reviewerName, subjectId, subjectName, type, rating, comment });
      onDone();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-900">Leave a Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-7 w-7" />
          </button>
        </div>

        <p className="text-xl text-slate-600 mb-6">
          How was your experience with <span className="font-bold text-slate-900">{subjectName}</span>?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stars */}
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-12 w-12 transition-colors ${
                    star <= (hovered || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-center text-xl font-semibold text-slate-700">
              {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
            </p>
          )}

          {/* Comment */}
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience…"
              rows={3}
              className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-gray-200 text-xl font-semibold text-slate-700 hover:bg-gray-50 transition"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xl font-bold shadow-md hover:opacity-95 transition disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
