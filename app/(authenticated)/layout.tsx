"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/use-auth";
import { LoginScreen } from "@/components/auth/login-screen";
import { ErrorBoundary } from "@/components/ui/error-boundary";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
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

  if (!user) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthGate>{children}</AuthGate>
      </AuthProvider>
    </ErrorBoundary>
  );
}
