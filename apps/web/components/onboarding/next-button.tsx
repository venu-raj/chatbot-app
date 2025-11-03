"use client";

import { useOnboardingProgress } from "@/app/(onboarding)/onboarding/use-onboarding-progress";
import { OnboardingStep } from "@/lib/onboarding/types";
import { Button, ButtonProps } from "@workspace/ui/components/button";

export function NextButton({
  step,
  ...rest
}: { step: OnboardingStep } & ButtonProps) {
  const { continueTo, isLoading, isSuccessful } = useOnboardingProgress();

  return (
    <Button
      variant="default"
      text="Next"
      className=" w-full"
      onClick={() => continueTo(step)}
      loading={isLoading || !isSuccessful}
      {...rest}
    />
  );
}
