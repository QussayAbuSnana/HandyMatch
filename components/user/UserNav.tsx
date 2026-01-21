import Link from "next/link";

export default function UserNav() {
  return (
    <nav className="flex gap-4 border-b p-4">
      <Link href="/user">Dashboard</Link>
      <Link href="/user/search">Search</Link>
      <Link href="/user/bookings">Bookings</Link>
      <Link href="/user/profile">Profile</Link>
    </nav>
  );
}
