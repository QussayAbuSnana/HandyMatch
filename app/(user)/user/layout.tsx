import UserNav from "@/components/user/UserNav";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <UserNav />
      <main className="p-6">{children}</main>
    </div>
  );
}
