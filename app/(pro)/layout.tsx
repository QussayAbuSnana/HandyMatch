import ProNav from "../../components/pro/ProNav";

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ProNav />
      <div className="p-6">{children}</div>
    </div>
  );
}
