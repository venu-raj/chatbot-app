"use client";

import { authClient } from "@/config/auth/client";
import { cn } from "@workspace/utils/functions/cn";
import { useEffect, useState } from "react";

export const ResendOtp = ({ email }: { email: string }) => {
  const [delaySeconds, setDelaySeconds] = useState(0);
  const [state, setState] = useState<"default" | "success" | "error">(
    "default"
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state === "success") {
      setDelaySeconds(60);
    } else if (state === "error") {
      setDelaySeconds(5);
    }
  }, [state]);

  useEffect(() => {
    if (delaySeconds > 0) {
      const interval = setInterval(
        () => setDelaySeconds(delaySeconds - 1),
        1000
      );

      return () => clearInterval(interval);
    } else {
      setState("default");
    }
  }, [delaySeconds]);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const result = await authClient.sendVerificationEmail({
        email,
      });

      if (result.error) {
        setState("error");
      } else {
        setState("success");
      }
    } catch (error) {
      setState("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mt-4 text-center text-sm font-medium text-neutral-500">
      {state === "default" && (
        <>
          <p className={cn(isLoading && "opacity-80")}>
            Didn't receive a code?{" "}
            <button
              onClick={handleResend}
              className={cn(
                "font-semibold text-neutral-700 transition-colors hover:text-neutral-900",
                isLoading && "pointer-events-none opacity-60"
              )}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend"}
            </button>
          </p>
        </>
      )}

      {state === "success" && (
        <p className="text-sm text-neutral-500">
          Code sent successfully. <Delay seconds={delaySeconds} />
        </p>
      )}

      {state === "error" && (
        <p className="text-sm text-neutral-500">
          Failed to send code. <Delay seconds={delaySeconds} />
        </p>
      )}
    </div>
  );
};

const Delay = ({ seconds }: { seconds: number }) => {
  return (
    <span className="ml-1 text-sm tabular-nums text-neutral-400">
      {seconds}s
    </span>
  );
};
