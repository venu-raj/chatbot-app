"use client";

import { signIn } from "@/config/auth/client";
import { Button } from "@workspace/ui/components/button";
import { Github, Google } from "@workspace/utils/icons/index";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SignUpOAuth = ({
  methods,
}: {
  methods: ("email" | "google")[];
}) => {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const [clickedGoogle, setClickedGoogle] = useState(false);
  const [clickedGithub, setClickedGithub] = useState(false);

  useEffect(() => {
    // when leave page, reset state
    return () => {
      setClickedGoogle(false);
      setClickedGithub(false);
    };
  }, []);

  const handleOAuthSignIn = async (provider: "google") => {
    if (provider === "google") {
      setClickedGoogle(true);
    } else {
      setClickedGithub(true);
    }

    try {
      await signIn.social({
        provider,
        callbackURL: next || "/onboarding",
      });
      // The social sign-in will redirect to the provider and then back to the callback URL
    } catch (error) {
      // Reset state on error
      setClickedGoogle(false);
      setClickedGithub(false);
    }
  };

  return (
    <>
      {methods.includes("google") && (
        <Button
          variant="outline"
          text="Continue with Google"
          onClick={() => handleOAuthSignIn("google")}
          loading={clickedGoogle}
          icon={<Google className="h-4 w-4" />}
        />
      )}
    </>
  );
};
