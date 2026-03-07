import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold mb-2">HandyMatch</h1>
        <p className="text-slate-600 mb-6">
          Choose your experience
        </p>

        <div className="grid grid-cols-1 gap-3">
          <Link className="rounded-xl bg-black text-white p-3 text-center" href="/user">
            Continue as User
          </Link>
          <Link className="rounded-xl border p-3 text-center" href="/pro">
            Continue as Professional
          </Link>
        </div>

        <div className="mt-6 flex gap-3 text-sm">
          <Link className="underline" href="/login">Login</Link>
          <Link className="underline" href="/register">Register</Link>
        </div>
      </div>
    </main>
  );
}
