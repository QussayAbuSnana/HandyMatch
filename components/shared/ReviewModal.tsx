"use client";

import { useState, useRef } from "react";
import { Star, X, ImagePlus, Loader2 } from "lucide-react";
import { submitReview } from "@/lib/firestore";
import { Review } from "@/lib/types";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];
const MAX_IMAGES = 3;

export default function ReviewModal({
  bookingId, reviewerId, reviewerName,
  subjectId, subjectName, type, onDone, onClose,
}: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).slice(0, MAX_IMAGES - files.length);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected].slice(0, MAX_IMAGES));
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target?.result as string].slice(0, MAX_IMAGES));
      };
      reader.readAsDataURL(file);
    });
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const removeImage = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    setError("");
    try {
      // Upload images to Firebase Storage
      let imageUrls: string[] = [];
      if (files.length > 0) {
        const storage = getStorage();
        imageUrls = await Promise.all(
          files.map(async (file) => {
            const path = `reviews/${bookingId}/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
          })
        );
      }

      await submitReview({
        bookingId, reviewerId, reviewerName,
        subjectId, subjectName, type, rating, comment,
        ...(imageUrls.length > 0 && { images: imageUrls }),
      });
      onDone();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
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
                <Star className={`h-12 w-12 transition-colors ${
                  star <= (hovered || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`} />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-center text-xl font-semibold text-slate-700">{LABELS[rating]}</p>
          )}

          {/* Comment */}
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience…"
              rows={3}
              className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none text-gray-700 resize-none"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1 block mb-2">
              Photos (optional, max {MAX_IMAGES})
            </label>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="mb-3 flex gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative h-20 w-20 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-20 w-20 rounded-2xl object-cover border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {previews.length < MAX_IMAGES && (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImages}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 rounded-2xl border border-dashed border-violet-300 bg-violet-50 px-5 py-3 text-base font-semibold text-violet-600 transition hover:bg-violet-100"
                >
                  <ImagePlus className="h-5 w-5" />
                  Add Photos
                </button>
              </>
            )}
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
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
                </span>
              ) : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
