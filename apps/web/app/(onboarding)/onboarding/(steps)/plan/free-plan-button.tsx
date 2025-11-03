"use client";

import { cn } from "@workspace/utils";
import { HTMLProps } from "react";
import { useOnboardingProgress } from "../../use-onboarding-progress";
import { LoadingSpinner } from "@workspace/ui/components/global/loading-spinner";

export function FreePlanButton({
  children,
  className,
  ...rest
}: Omit<HTMLProps<HTMLButtonElement>, "type">) {
  const { finish, isLoading, isSuccessful } = useOnboardingProgress();

  return (
    <button
      type="button"
      onClick={finish}
      className={cn(
        "inline-block text-neutral-500 transition-colors enabled:hover:text-neutral-700",
        className
      )}
      disabled={isLoading || isSuccessful}
      {...rest}
    >
      <span>{children}</span>
      <div
        className={cn(
          "pointer-events-none inline-block h-full transition-[width,opacity] duration-200",
          isLoading || isSuccessful ? "w-4 opacity-100" : "w-0 opacity-0"
        )}
      >
        {(isLoading || isSuccessful) && (
          <div className="ml-1 w-3">
            <LoadingSpinner className="size-3" />
          </div>
        )}
      </div>
    </button>
  );
}
