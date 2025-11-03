"use client";

import { useOnboardingProgress } from "@/app/(onboarding)/onboarding/use-onboarding-progress";
import { OnboardingStep } from "@/lib/onboarding/types";
import { LoadingSpinner } from "@workspace/ui/components/global/loading-spinner";
import { cn } from "@workspace/utils";
import { PropsWithChildren } from "react";

export function LaterButton({
  next,
  className,
  children,
}: PropsWithChildren<{ next: OnboardingStep | "finish"; className?: string }>) {
  const { continueTo, finish, isLoading, isSuccessful } =
    useOnboardingProgress();

  return (
    <button
      type="button"
      onClick={() => (next === "finish" ? finish() : continueTo(next))}
      className={cn(
        "mx-auto flex w-fit cursor-pointer items-center gap-2 text-center text-sm font-medium text-neutral-800 transition-colors enabled:hover:text-neutral-950",
        className
      )}
      disabled={isLoading}
    >
      <LoadingSpinner
        className={cn(
          "size-3 transition-opacity",
          !(isLoading || isSuccessful) && "opacity-0"
        )}
      />
      {children || "I'll do this later"}
      <div className="w-3" />
    </button>
  );
}
