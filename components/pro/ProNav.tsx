import Link from "next/link";

export default function ProNav() {
  return (
    <nav className="flex items-center justify-between border-b p-4">
      <Link href="/" className="font-bold">HandyMatch</Link>

      <div className="flex gap-4">
        <Link href="/pro">Dashboard</Link>
        <Link href="/pro/jobs">Jobs</Link>
        <Link href="/pro/services">Services</Link>
        <Link href="/pro/availability">Availability</Link>
        <Link href="/pro/profile">Profile</Link>
      </div>
    </nav>
  );
}
