// components/login/google-button.tsx
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { LoginFormContext } from "./login-form";
import { Button } from "@workspace/ui/components/button";
import { authClient } from "@/config/auth/client";
import { Google } from "@workspace/utils/icons/google";

export function GoogleButton({ next }: { next?: string }) {
  const searchParams = useSearchParams();
  const finalNext = next ?? searchParams?.get("next") ?? "/dashboard/overview";

  const { setClickedMethod, clickedMethod, setLastUsedAuthMethod } =
    useContext(LoginFormContext);

  const handleGoogleSignIn = async () => {
    setClickedMethod("google");
    setLastUsedAuthMethod("google");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: finalNext,
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      // Error handling is typically done by Better Auth
    }
  };

  return (
    <Button
      text="Continue with Google"
      variant="outline"
      onClick={handleGoogleSignIn}
      loading={clickedMethod === "google"}
      // disabled={clickedMethod && clickedMethod !== "google"}
      icon={<Google className="size-4" />}
      className="w-full font-normal"
    />
  );
}
