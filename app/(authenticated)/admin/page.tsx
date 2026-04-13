"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { TopBar } from "@/components/layout/top-bar";
import { GlassCard } from "@/components/ui/glass-card";

export default function AdminPage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.replace("/home");
    }
  }, [loading, role, router]);

  if (loading || role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-[72px] w-[72px] animate-[pulse-opacity_1.5s_infinite]">
          <img
            src="/apple-touch-icon.png"
            alt="Loading..."
            className="h-full w-full rounded-xl object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <h1 className="mb-2 text-3xl font-bold text-white">Admin — Users</h1>
        <p className="mb-8 text-sm text-text-muted">Manage user roles and accounts.</p>
        <GlassCard>
          <p className="text-text-muted">Users table loads here…</p>
        </GlassCard>
      </main>
    </div>
  );
}
