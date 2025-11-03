"use client";

import { Button } from "@workspace/ui/components/button";
import { LayoutSidebar } from "@workspace/utils/icons/index";
import { useContext } from "react";
import { SideNavContext } from "../sidebar/main-nav";

export function NavButton() {
  const { setIsOpen } = useContext(SideNavContext);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => setIsOpen((o) => !o)}
      icon={<LayoutSidebar className="size-4" />}
      className="h-auto w-fit p-1 md:hidden"
    />
  );
}
