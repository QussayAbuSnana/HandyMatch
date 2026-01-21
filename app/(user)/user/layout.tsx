import UserNav from "@/components/user/UserNav";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <UserNav />
      <div className="p-6">{children}</div>
    </div>
  );
}
