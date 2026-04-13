"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (userProfile && userProfile.role !== "professional") {
        // Customer trying to access professional routes
        router.replace("/dashboard");
      }
    }
  }, [loading, user, userProfile, router]);

  if (loading || !user || (userProfile && userProfile.role !== "professional")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fb]">
        <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
