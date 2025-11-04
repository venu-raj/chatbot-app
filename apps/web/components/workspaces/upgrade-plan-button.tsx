"use client";

import useWorkspace from "@/lib/swr/use-workspace";
import { Button, ButtonProps } from "@workspace/ui/components/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function UpgradePlanButton({
  plan,
  period,
  ...rest
}: {
  plan: string;
  period: "monthly" | "yearly";
} & Partial<ButtonProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [clicked, setClicked] = useState(false);

  const queryString = searchParams.toString();

  return (
    <Button
      text={"Get started"}
      loading={clicked}
      className="w-full"
      onClick={() => {}}
      {...rest}
    />
  );
}
