"use client";

import { cn } from "@workspace/utils/functions/cn";
import { BrowserGraphic } from "./browser-graphic";
import { ButtonLink } from "@/components/ui/button-link";
import { Hero } from "@/components/ui/marketing/landing/hero";
import { FeaturesSection } from "@/components/ui/marketing/features-section";

const UTM_PARAMS = {
  utm_source: "Custom Domain",
  utm_medium: "Welcome Page",
};

export default function PlaceholderContent() {
  return (
    <div className="">
      <Hero>
        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center">
          <div className="mt-16 w-full">
            <BrowserGraphic />
          </div>
          <h1
            className={cn(
              "font-display mt-2 text-center text-4xl font-medium text-neutral-900 sm:text-5xl sm:leading-[1.15]",
              "animate-slide-up-fade motion-reduce:animate-fade-in [--offset:20px] [animation-duration:1s] [animation-fill-mode:both]"
            )}
          >
            Welcome to Dub
          </h1>
          <p
            className={cn(
              "mt-5 text-balance text-base text-neutral-700 sm:text-xl",
              "animate-slide-up-fade motion-reduce:animate-fade-in [--offset:10px] [animation-delay:200ms] [animation-duration:1s] [animation-fill-mode:both]"
            )}
          >
            This custom domain is powered by Dub &ndash; the link management
            platform designed for modern marketing teams.
          </p>
        </div>

        <div
          className={cn(
            "xs:flex-row relative mx-auto mt-8 flex max-w-fit flex-col items-center gap-4",
            "animate-slide-up-fade motion-reduce:animate-fade-in [--offset:5px] [animation-delay:300ms] [animation-duration:1s] [animation-fill-mode:both]"
          )}
        >
          <ButtonLink variant="primary" href="https://app.dub.co/register">
            Try Dub today
          </ButtonLink>
          <ButtonLink variant="secondary" href="/">
            Learn more
          </ButtonLink>
        </div>
      </Hero>
      <div className="mt-20">
        <FeaturesSection />
      </div>
      {/* <div className="mt-32">
        <CTA domain={domain} utmParams={UTM_PARAMS} />
      </div> */}
    </div>
  );
}
