"use client";

import { AnimatedSizeContainer } from "@workspace/ui/components/animated-size-container";
import { SignUpEmail } from "./signup-email";
import { SignUpOAuth } from "./signup-oauth";
import { AuthMethodsSeparator } from "../layout/auth-methods-separator";

export const SignUpForm = ({
  methods = ["email", "google", "github"],
}: {
  methods?: ("email" | "google" | "github")[];
}) => {
  return (
    <AnimatedSizeContainer height>
      <div className="flex flex-col gap-3 p-1">
        {methods.includes("email") && <SignUpEmail />}
        {methods.length && <AuthMethodsSeparator />}
        <SignUpOAuth methods={methods} />
      </div>
    </AnimatedSizeContainer>
  );
};
