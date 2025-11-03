// hooks/use-onboarding-progress.ts
import { useListOrganizations } from "@/config/auth/client";
import { OnboardingStep } from "@/lib/onboarding/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const PRE_WORKSPACE_STEPS = ["workspace"];
const ONBOARDING_STORAGE_KEY = "onboarding-step";

export function useOnboardingProgress() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("workspace");

  // Use Better Auth to check organizations
  const { data: organizations, isPending: isLoadingOrgs } = useListOrganizations();

  // Check if user has organizations and redirect if empty
  useEffect(() => {
    if (!isLoadingOrgs && organizations && organizations.length != 0) {
      // If no organizations, redirect to welcome page
      // router.push("/dashboard");
    }
  }, [organizations,]);

  const setOnboardingProgress = useCallback(async (onboardingStep: OnboardingStep | null) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, onboardingStep || "");
      }
      return { success: true };
    } catch (error) {
      console.error("Failed to update onboarding step", error);
      throw new Error("Failed to update onboarding step");
    }
  }, []);

  const getOnboardingProgress = useCallback((): OnboardingStep | null => {
    if (typeof window !== "undefined") {
      const step = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      return step as OnboardingStep | null;
    }
    return null;
  }, []);

  const continueTo = useCallback(
    async (
      step: OnboardingStep,
      {
        slug: providedSlug,
        params,
      }: { slug?: string; params?: Record<string, string> } = {},
    ) => {
      try {
        // Update localStorage immediately
        await setOnboardingProgress(step);

        const queryParams = new URLSearchParams({
          ...(params || {}),
          ...(PRE_WORKSPACE_STEPS.includes(step)
            ? {}
            : { workspace: (providedSlug || slug)! }),
        });

        router.push(`/onboarding/${step}?${queryParams}`);
      } catch (error) {
        toast.error("Failed to update onboarding progress. Please try again.");
        console.error("Failed to update onboarding progress", error);
      }
    },
    [setOnboardingProgress, router, slug],
  );

  const finish = useCallback(async () => {
    try {
      await setOnboardingProgress("completed");

      // After finish, redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to finish onboarding. Please try again.");
      console.error("Failed to finish onboarding", error);
    }
  }, [setOnboardingProgress, router]);

  return {
    continueTo,
    finish,
    getOnboardingProgress,
    setOnboardingProgress,
    isLoading: isLoadingOrgs,
    isSuccessful: organizations && organizations.length > 0,
  };
}