"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { Toaster } from "sonner";
import { SessionProvider } from "@/lib/session-context";
import { TRPCReactProvider } from "@/config/trpc/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      authBaseURL={process.env.AUTH_BASE_URL || "http://localhost:3000"}
    >
      <TRPCReactProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </NextThemesProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
