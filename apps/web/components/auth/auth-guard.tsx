// components/auth-guard.tsx
"use client";

import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/session-context";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export function AuthGuard({ children, fallbackPath = "/" }: AuthGuardProps) {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      console.log("🔒 No session, redirecting to:", fallbackPath);
      router.push(fallbackPath);
    }
  }, [session, loading, router, fallbackPath]);

  if (loading) {
    return;
  }

  if (!session.data?.session) {
    return (
      redirect("/login"),
      toast("Please Sign In to access the dashboard")
    );
  }

  return <>{children}</>;
}
