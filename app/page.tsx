import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">HandyMatch</h1>
        <p className="text-slate-600 mt-1 mb-6">Choose your experience</p>

        <div className="grid gap-3">
          <Link
            href="/user"
            className="rounded-xl bg-slate-900 text-white p-3 text-center font-semibold hover:bg-slate-800 transition"
          >
            Continue as User
          </Link>

          <Link
            href="/pro"
            className="rounded-xl border border-slate-200 bg-white p-3 text-center font-semibold hover:bg-slate-50 transition"
          >
            Continue as Professional
          </Link>
        </div>

        <div className="mt-6 flex gap-4 text-sm">
          <Link className="text-slate-700 underline hover:text-slate-900" href="/login">
            Login
          </Link>
          <Link className="text-slate-700 underline hover:text-slate-900" href="/register">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
