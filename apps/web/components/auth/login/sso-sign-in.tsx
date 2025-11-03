"use client";

import { Lock } from "lucide-react";
import { useContext } from "react";
import { toast } from "sonner";
import { LoginFormContext } from "./login-form";
import { useMediaQuery } from "@workspace/utils/hooks/use-media-query";
import { InfoTooltip } from "@workspace/ui/components/tooltip";
import { Button } from "@workspace/ui/components/button";

export const SSOSignIn = () => {
  const { isMobile } = useMediaQuery();

  const {
    setClickedMethod,
    clickedMethod,
    authMethod,
    setLastUsedAuthMethod,
    setShowSSOOption,
    showSSOOption,
  } = useContext(LoginFormContext);

  return (
    <form onSubmit={async (e) => {}} className="flex flex-col space-y-3">
      {showSSOOption && (
        <div>
          {authMethod !== "saml" && (
            <div className="mb-4 mt-1 border-t border-neutral-300" />
          )}
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-medium text-neutral-900">
              Workspace Slug
            </h2>
            <InfoTooltip
              content={`This is your workspace's unique identifier on ${process.env.NEXT_PUBLIC_APP_NAME}. E.g. app.dub.co/acme is "acme".`}
            />
          </div>
          <input
            id="slug"
            name="slug"
            autoFocus={!isMobile}
            type="text"
            placeholder="my-team"
            autoComplete="off"
            required
            className="mt-1 block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
        </div>
      )}

      <Button
        text="Continue with SAML SSO"
        variant="outline"
        icon={<Lock className="size-4" />}
        {...(!showSSOOption && {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            setShowSSOOption(true);
          },
        })}
        loading={clickedMethod === "saml"}
        // disabled={clickedMethod && clickedMethod !== "saml"}
        className="w-full font-normal"
      />
    </form>
  );
};
