import Link from "next/link";

export default function ProNav() {
  return (
    <nav className="flex gap-4 border-b p-4">
      <Link href="/pro">Dashboard</Link>
      <Link href="/pro/jobs">Jobs</Link>
      <Link href="/pro/services">Services</Link>
      <Link href="/pro/availability">Availability</Link>
      <Link href="/pro/profile">Profile</Link>
    </nav>
  );
}
