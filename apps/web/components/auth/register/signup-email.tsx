"use client";

import { FormEvent, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRegisterContext } from "./context";
import { useMediaQuery } from "@workspace/utils/hooks/use-media-query";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { PasswordRequirements } from "../layout/password-requirements";
import { signUpSchema } from "@/lib/zod/auth";
import z from "zod";
import { authClient } from "@/config/auth/client";

type SignUpProps = z.infer<typeof signUpSchema>;

export const SignUpEmail = () => {
  const { isMobile } = useMediaQuery();
  const { setStep, setEmail, setPassword, email, lockEmail } =
    useRegisterContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpProps>({
    defaultValues: {
      email,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
  } = form;

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const { email, password } = getValues();

      // First step - show password field
      if (email && !password && !showPassword) {
        setShowPassword(true);
        return;
      }

      // Second step - submit form
      if (email && password) {
        setIsLoading(true);

        try {
          const result = await authClient.signUp.email({
            email,
            password,
            name: email.split("@")[0]!, // Better Auth expects a name field
          });

          if (result.error) {
            // Handle specific error cases
            if (result.error.code === "USER_ALREADY_EXISTS") {
              setError("email", {
                message: "An account with this email already exists",
              });
            } else if (result.error.code === "INVALID_EMAIL") {
              setError("email", {
                message: "Please enter a valid email address",
              });
            } else if (result.error.code === "WEAK_PASSWORD") {
              setError("password", {
                message:
                  "Password is too weak. Please choose a stronger password",
              });
            } else {
              toast.error(result.error.message || "Failed to create account");
            }
          } else {
            // Success - move to verification step
            setEmail(email);
            setPassword(password);
            setStep("verify");
            toast.success("Verification code sent to your email!");
          }
        } catch (error) {
          toast.error("An unexpected error occurred");
        } finally {
          setIsLoading(false);
        }
      }
    },
    [getValues, showPassword, setEmail, setPassword, setStep, setError]
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-6">
        <label>
          <span className="text-content-emphasis mb-2 block text-sm font-medium leading-none">
            Email
          </span>
          <Input
            type="email"
            placeholder="panic@thedis.co"
            autoComplete="email"
            required
            readOnly={!errors.email && lockEmail}
            autoFocus={!isMobile && !showPassword && !lockEmail}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
            className="py-2 px-3"
          />
        </label>
        {showPassword && (
          <label>
            <span className="text-content-emphasis mb-2 block text-sm font-medium leading-none">
              Password
            </span>
            <Input
              type="password"
              required
              autoFocus={!isMobile}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  hasNumber: (value) =>
                    /\d/.test(value) ||
                    "Password must contain at least one number",
                  hasUpperCase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain at least one uppercase letter",
                  hasLowerCase: (value) =>
                    /[a-z]/.test(value) ||
                    "Password must contain at least one lowercase letter",
                },
              })}
              error={errors.password?.message}
              minLength={8}
              className="py-2 px-3"
            />
            <FormProvider {...form}>
              <PasswordRequirements />
            </FormProvider>
          </label>
        )}
        <Button
          type="submit"
          variant={"default"}
          text={showPassword ? "Sign Up" : "Continue"}
          disabled={isLoading}
          loading={isLoading}
        />
      </div>
    </form>
  );
};
