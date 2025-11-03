"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AppSidebarNav } from "@/components/dashboard/sidebar/app-sidebar-nav";
import { MainNav } from "@/components/dashboard/sidebar/main-nav";
import { ReactNode } from "react";
import { toast } from "sonner";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen w-full bg-white">
        {/* <UpgradeBanner /> */}
        <MainNav
          sidebar={AppSidebarNav}
          // toolContent={
          //   <>
          //     <ReferButton />
          //     <HelpButtonRSC />
          //   </>
          // }
          // newsContent={<NewsRSC />}
        >
          {children}
        </MainNav>
      </div>
    </AuthGuard>
  );
}
