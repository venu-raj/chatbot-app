// components/login/email-signin.tsx
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { LoginFormContext } from "./login-form";
import { useMediaQuery } from "@workspace/utils/hooks/use-media-query";
import { cn } from "@workspace/utils/functions/cn";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { authClient } from "@/config/auth/client";

export const EmailSignIn = ({ next }: { next?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const finalNext = next ?? searchParams?.get("next") ?? "/dashboard/overview";
  const { isMobile } = useMediaQuery();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    showPasswordField,
    setShowPasswordField,
    setClickedMethod,
    authMethod,
    setAuthMethod,
    clickedMethod,
    setLastUsedAuthMethod,
    setShowSSOOption,
  } = useContext(LoginFormContext);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setClickedMethod("email");

    try {
      if (!showPasswordField) {
        // First step: validate email and check if user exists
        const result = await authClient.signIn.email({
          email,
          password: "", // Empty password to trigger validation
        });

        if (result.error) {
          // Handle specific error cases
          if (result.error.code === "USER_NOT_FOUND") {
            toast.error("No account found with this email address");
          } else if (result.error.code === "INVALID_CREDENTIALS") {
            // Email exists, show password field
            setShowPasswordField(true);
            setLastUsedAuthMethod("email");
            toast.info("Please enter your password");
          } else {
            toast.error(result.error.message || "Something went wrong");
          }
        } else if (result.data) {
          // This shouldn't happen with empty password, but handle it
          setShowPasswordField(true);
          setLastUsedAuthMethod("email");
        }
      } else {
        // Second step: email + password login
        if (!password) {
          toast.error("Please enter your password");
          setIsLoading(false);
          return;
        }

        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (result.data) {
          toast.success("Successfully signed in!");
          router.push(finalNext);
        } else if (result.error) {
          if (result.error.code === "INVALID_CREDENTIALS") {
            toast.error("Invalid password");
          } else {
            toast.error(result.error.message || "Invalid credentials");
          }
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthMethod("email");
    setClickedMethod("email");
  };

  return (
    <form onSubmit={handleEmailSubmit} className="gap-3 flex flex-col">
      {authMethod === "email" && (
        <label>
          <span className="text-content-emphasis mb-2 block text-sm font-medium leading-none">
            Email
          </span>
          <Input
            id="email"
            name="email"
            autoFocus={!isMobile && !showPasswordField}
            type="email"
            placeholder="panic@thedis.co"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={showPasswordField || isLoading}
            size={1}
            className={cn(
              "block w-full min-w-0 appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm",
              {
                "pr-10": isLoading,
                "opacity-50 cursor-not-allowed": showPasswordField,
              }
            )}
          />
        </label>
      )}

      {showPasswordField && (
        <label>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-content-emphasis block text-sm font-medium leading-none">
              Password
            </span>
            <Link
              href={`/forgot-password?email=${encodeURIComponent(email)}`}
              className="text-content-subtle hover:text-content-emphasis text-xs leading-none underline underline-offset-2 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            autoFocus={!isMobile}
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      )}

      <Button
        type={authMethod === "email" ? "submit" : "button"}
        text={
          authMethod !== "email"
            ? "Continue with email"
            : showPasswordField
              ? "Log in"
              : "Continue"
        }
        variant={"default"}
        className={cn(
          "w-full font-normal",
          isLoading ??
            "border-neutral-300 bg-black/80 dark:bg-white text-black dark:text-black"
        )}
        onClick={authMethod !== "email" ? handleContinueWithEmail : undefined}
        loading={isLoading}
      />

      {showPasswordField && (
        <button
          type="button"
          onClick={() => {
            setShowPasswordField(false);
            setPassword("");
          }}
          className="text-sm text-blue-600 hover:text-blue-800 text-left"
        >
          ← Use different email
        </button>
      )}
    </form>
  );
};
