"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Menu, Briefcase, CalendarDays, MessageSquare, User, MapPin, Clock3, DollarSign, CheckCircle2, XCircle, Wrench, Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { subscribeProBookings, updateBookingStatus, createNotification, hasReviewed } from "@/lib/firestore";
import { Booking } from "@/lib/types";
import ReviewModal from "@/components/shared/ReviewModal";

export default function ProJobsPage() {
  const { user, userProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [activeReview, setActiveReview] = useState<Booking | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeProBookings(user.uid, async (data) => {
      setBookings(data);
      setLoading(false);
      const done = data.filter((b) => b.status === "completed");
      const checks = await Promise.all(
        done.map(async (b) => [b.id, await hasReviewed(b.id, user.uid)] as [string, boolean])
      );
      setReviewed(Object.fromEntries(checks));
    });
    return unsub;
  }, [user]);

  const pending = bookings.filter((b) => b.status === "pending");
  const accepted = bookings.filter((b) => b.status === "accepted" || b.status === "in_progress");
  const completed = bookings.filter((b) => b.status === "completed");

  const handleAccept = async (booking: Booking) => {
    await updateBookingStatus(booking.id, "accepted");
    await createNotification(booking.customerId, "Booking Accepted!", `${booking.professionalName} accepted your booking for ${booking.service}.`, "booking_accepted", booking.id);
  };

  const handleDecline = async (booking: Booking) => {
    await updateBookingStatus(booking.id, "cancelled");
    await createNotification(booking.customerId, "Booking Declined", `Your booking request for ${booking.service} was declined.`, "booking_declined", booking.id);
  };

  const handleComplete = async (booking: Booking) => {
    await updateBookingStatus(booking.id, "completed");
    await createNotification(booking.customerId, "Job Completed!", `${booking.professionalName} marked your ${booking.service} job as complete.`, "job_completed", booking.id);
  };

  const formatDate = (b: Booking) => {
    if (!b.createdAt) return "—";
    const d = new Date((b.createdAt as unknown as { seconds: number }).seconds * 1000);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <main className="min-h-screen bg-[#f8f8fb] pb-28">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <button className="text-gray-600 transition hover:text-gray-900"><Menu className="h-8 w-8" /></button>
          <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
          <Link href="/pro/notifications" className="relative text-gray-600 transition hover:text-gray-900">
            <Bell className="h-8 w-8" />
            <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-500" />
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-extrabold">Manage Requests & Jobs</h2>
          <p className="mt-3 text-lg text-white/85">Review incoming work, track active jobs, and keep your workflow organized.</p>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* New Requests */}
          <section className="mx-auto max-w-7xl px-5 pt-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Briefcase className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">New Requests</h2>
                <p className="text-lg text-slate-500">Respond quickly to increase your chances of getting hired.</p>
              </div>
            </div>

            {pending.length === 0 ? (
              <p className="text-xl text-slate-400 text-center py-8">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {pending.map((req) => (
                  <div key={req.id} className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{req.customerName}</h3>
                        <p className="mt-2 text-xl text-slate-700">{req.service}</p>
                        <div className="mt-3 flex flex-col gap-2 text-lg text-slate-500 md:flex-row md:items-center md:gap-4">
                          <span className="flex items-center gap-2"><MapPin className="h-5 w-5" />{req.location}</span>
                          <span className="flex items-center gap-2"><Clock3 className="h-5 w-5" />{formatDate(req)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-4 md:items-end">
                        <div className="flex items-center gap-2 text-3xl font-extrabold text-violet-600">
                          <DollarSign className="h-7 w-7" />{req.price}/hr
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleDecline(req)} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-lg font-semibold text-slate-700 transition hover:bg-gray-50">
                            <XCircle className="h-5 w-5" />Decline
                          </button>
                          <button onClick={() => handleAccept(req)} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-lg font-semibold text-white transition hover:bg-green-700">
                            <CheckCircle2 className="h-5 w-5" />Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Accepted Jobs */}
          <section className="mx-auto max-w-7xl px-5 pt-10">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <CalendarDays className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Accepted Jobs</h2>
                <p className="text-lg text-slate-500">Jobs you have confirmed and scheduled.</p>
              </div>
            </div>

            {accepted.length === 0 ? (
              <p className="text-xl text-slate-400 text-center py-8">No active jobs.</p>
            ) : (
              <div className="space-y-4">
                {accepted.map((job) => (
                  <div key={job.id} className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{job.customerName}</h3>
                        <p className="mt-2 text-xl text-slate-700">{job.service}</p>
                        <div className="mt-3 flex flex-col gap-2 text-lg text-slate-500 md:flex-row md:items-center md:gap-4">
                          <span className="flex items-center gap-2"><Clock3 className="h-5 w-5" />{formatDate(job)}</span>
                          <span className="flex items-center gap-2"><MapPin className="h-5 w-5" />{job.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-4 md:items-end">
                        <div className="text-3xl font-extrabold text-violet-600">${job.price}/hr</div>
                        <div className="flex gap-3">
                          <span className={`rounded-full px-4 py-2 text-lg font-semibold ${job.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}`}>
                            {job.status === "in_progress" ? "In Progress" : "Upcoming"}
                          </span>
                          <button onClick={() => handleComplete(job)} className="rounded-xl bg-emerald-600 px-4 py-2 text-lg font-semibold text-white transition hover:bg-emerald-700">
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Completed Jobs */}
          <section className="mx-auto max-w-7xl px-5 pt-10">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Wrench className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Completed Jobs</h2>
                <p className="text-lg text-slate-500">Recently finished work.</p>
              </div>
            </div>

            {completed.length === 0 ? (
              <p className="text-xl text-slate-400 text-center py-8">No completed jobs yet.</p>
            ) : (
              <div className="space-y-4">
                {completed.map((job) => (
                  <div key={job.id} className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{job.customerName}</h3>
                        <p className="mt-2 text-xl text-slate-700">{job.service}</p>
                        <div className="mt-3 flex flex-col gap-2 text-lg text-slate-500 md:flex-row md:items-center md:gap-4">
                          <span className="flex items-center gap-2"><Clock3 className="h-5 w-5" />{formatDate(job)}</span>
                          <span className="flex items-center gap-2"><MapPin className="h-5 w-5" />{job.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <div className="text-3xl font-extrabold text-emerald-600">${job.price}/hr</div>
                        <span className="rounded-full bg-emerald-100 px-4 py-2 text-lg font-semibold text-emerald-700">Completed</span>
                        {reviewed[job.id] === false && (
                          <button
                            onClick={() => setActiveReview(job)}
                            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-lg font-semibold text-white hover:bg-amber-600 transition"
                          >
                            <Star className="h-5 w-5" /> Review Customer
                          </button>
                        )}
                        {reviewed[job.id] === true && (
                          <span className="flex items-center gap-2 text-lg font-medium text-green-600">
                            <CheckCircle2 className="h-5 w-5" /> Reviewed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {activeReview && userProfile && (
        <ReviewModal
          bookingId={activeReview.id}
          reviewerId={userProfile.uid}
          reviewerName={userProfile.displayName}
          subjectId={activeReview.customerId}
          subjectName={activeReview.customerName}
          type="pro_to_customer"
          onDone={() => {
            setReviewed((prev) => ({ ...prev, [activeReview.id]: true }));
            setActiveReview(null);
          }}
          onClose={() => setActiveReview(null)}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3">
          <Link href="/pro/dashboard" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <Briefcase className="h-7 w-7" /><span className="mt-1 text-base font-medium">Dashboard</span>
          </Link>
          <Link href="/pro/jobs" className="flex flex-col items-center justify-center rounded-[1.25rem] bg-violet-100 px-4 py-3 text-violet-700">
            <CalendarDays className="h-7 w-7" /><span className="mt-1 text-base font-medium">Jobs</span>
          </Link>
          <Link href="/pro/messages" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <MessageSquare className="h-7 w-7" /><span className="mt-1 text-base font-medium">Messages</span>
          </Link>
          <Link href="/pro/profile" className="flex flex-col items-center justify-center rounded-[1.25rem] px-4 py-3 text-slate-500 transition hover:bg-slate-100">
            <User className="h-7 w-7" /><span className="mt-1 text-base font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
