// lib/session-context.tsx
"use client";

import { authClient } from "@/config/auth/client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Session = Awaited<ReturnType<typeof authClient.getSession>>;

const SessionContext = createContext<Session | undefined>(undefined);

export function SessionProvider({
  children,
  authBaseURL,
}: {
  children: React.ReactNode;
  authBaseURL: string;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const authClient = createAuthClientWithURL(authBaseURL);

  const refreshSession = async () => {
    try {
      setError(null);
      const userSession = await authClient.getSession();
      console.log("🔄 Session refreshed:", userSession);
      setSession(userSession);
      return userSession;
    } catch (err) {
      console.error("❌ Error refreshing session:", err);
      setError("Failed to refresh session");
      setSession(null);
      return null;
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      setError(null);
      console.log("✅ Signed out successfully");
    } catch (err) {
      console.error("❌ Error signing out:", err);
      setError("Failed to sign out");
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      try {
        setLoading(true);
        console.log("🚀 Initializing session...");
        const userSession = await authClient.getSession();
        console.log("📋 Initial session:", userSession);
        setSession(userSession);
      } catch (err) {
        console.error("❌ Error initializing session:", err);
        setError("Failed to load session");
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, [authBaseURL]);

  // Optional: Auto-refresh session periodically
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(
      () => {
        refreshSession();
      },
      5 * 60 * 1000
    ); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [session]);

  const value = {
    session,
    loading,
    error,
    refreshSession,
    signOut,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
