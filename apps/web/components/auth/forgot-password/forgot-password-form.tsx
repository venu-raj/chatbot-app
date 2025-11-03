"use client";

import { authClient } from "@/config/auth/client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useMediaQuery } from "@workspace/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const { isMobile } = useMediaQuery();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: "password1234",
        token: "",
      });

      if (result.error) {
        // Better Auth provides specific error codes
        switch (result.error.code) {
          case "USER_NOT_FOUND":
            toast.error("No account found with this email address");
            break;
          case "EMAIL_NOT_VERIFIED":
            toast.error("Please verify your email address first");
            break;
          case "RATE_LIMIT_EXCEEDED":
            toast.error("Too many attempts. Please try again later");
            break;
          default:
            toast.error(result.error.message || "Failed to send reset email");
        }
      } else {
        // Success - show success message but don't redirect immediately
        toast.success("Check your email for a password reset link");
        // Optionally clear the email field
        setEmail("");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <label>
            <span className="text-content-emphasis mb-2 block text-sm font-medium leading-none">
              Email
            </span>
            <Input
              type="email"
              autoFocus={!isMobile}
              value={email}
              placeholder="panic@thedis.co"
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <Button
            type="submit"
            text={isLoading ? "Sending..." : "Send reset link"}
            loading={isLoading}
            disabled={!email || isLoading}
          />
        </div>
      </form>

      {/* Optional: Back to login link */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Back to login
        </button>
      </div>
    </div>
  );
};
