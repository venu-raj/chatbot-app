"use client";

import { OTPInput } from "input-otp";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useRegisterContext } from "./context";
import { ResendOtp } from "./resend-otp";
import { useMediaQuery } from "@workspace/utils/hooks/use-media-query";
import { cn } from "@workspace/utils/functions/cn";
import { AnimatedSizeContainer } from "@workspace/ui/components/animated-size-container";
import { Button } from "@workspace/ui/components/button";
import { authClient, signIn } from "@/config/auth/client";
export const VerifyEmailForm = () => {
  const router = useRouter();
  const { isMobile } = useMediaQuery();
  const [code, setCode] = useState("");
  const { email, password } = useRegisterContext();
  const [isInvalidCode, setIsInvalidCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!email || !password) {
    router.push("/register");
    return null;
  }

  const handleVerification = async () => {
    if (!code || code.length < 6) return;

    setIsLoading(true);
    try {
      const result = await authClient.verifyEmail();

      if (result.error) {
        setIsInvalidCode(true);
        setCode("");
        toast.error(result.error.message || "Invalid verification code");
      } else {
        // Email verified successfully, now sign in
        const signInResult = await signIn.email({
          email,
          password,
        });

        if (signInResult.error) {
          toast.error(
            "Email verified but failed to sign in. Please try logging in."
          );
          router.push("/login");
        } else {
          toast.success("Account created successfully! Redirecting...");
          router.push("/onboarding");
        }
      }
    } catch (error) {
      setIsInvalidCode(true);
      setCode("");
      toast.error("Failed to verify email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerification();
        }}
      >
        <div>
          <OTPInput
            maxLength={6}
            value={code}
            onChange={(code) => {
              setIsInvalidCode(false);
              setCode(code);
            }}
            autoFocus={!isMobile}
            render={({ slots }) => (
              <div className="flex w-full items-center justify-between">
                {slots.map(({ char, isActive, hasFakeCaret }, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "relative flex h-14 w-12 items-center justify-center text-xl",
                      "rounded-lg border border-neutral-200 bg-white ring-0 transition-all",
                      isActive &&
                        "z-10 border border-neutral-800 ring-2 ring-neutral-200",
                      isInvalidCode && "border-red-500 ring-red-200"
                    )}
                  >
                    {char}
                    {hasFakeCaret && (
                      <div className="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="h-5 w-px bg-black" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            onComplete={handleVerification}
          />
          <AnimatedSizeContainer height>
            {isInvalidCode && (
              <p className="pt-3 text-center text-xs font-medium text-red-500">
                Invalid code. Please try again.
              </p>
            )}
          </AnimatedSizeContainer>

          <Button
            className="mt-8"
            text={isLoading ? "Verifying..." : "Continue"}
            type="submit"
            loading={isLoading}
            disabled={!code || code.length < 6 || isLoading}
          />
        </div>
      </form>

      <ResendOtp email={email} />
    </div>
  );
};
