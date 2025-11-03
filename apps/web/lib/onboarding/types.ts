export const ONBOARDING_STEPS = [
  "workspace",
  "invite",
  "plan",
  "completed",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];
