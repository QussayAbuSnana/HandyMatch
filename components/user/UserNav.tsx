import Link from "next/link";

export default function UserNav() {
  return (
    <nav className="flex items-center justify-between border-b p-4">
      <Link href="/" className="font-bold">HandyMatch</Link>

      <div className="flex gap-4">
        <Link href="/user">Dashboard</Link>
        <Link href="/user/search">Search</Link>
        <Link href="/user/bookings">Bookings</Link>
        <Link href="/user/profile">Profile</Link>
      </div>
    </nav>
  );
}
