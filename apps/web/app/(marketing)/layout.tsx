"use client";

import { Footer } from "@/components/nav/footer";
import { Nav } from "@/components/nav/nav";
import { NavMobile } from "@/components/nav/nav-mobile";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function CustomDomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-between">
      <NavMobile />
      <Nav maxWidthWrapperClassName="max-w-screen-lg lg:px-4 xl:px-0" />
      {children}
      <Footer className="max-w-screen-lg border-0 bg-transparent lg:px-4 xl:px-0" />
    </div>
  );
}
