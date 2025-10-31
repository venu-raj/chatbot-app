// import PlaceholderContent from "./placeholder";

// export default function Page() {
//   return <PlaceholderContent />;
// }
"use client";

import { cn } from "@workspace/utils";
import { GridPattern } from "@workspace/ui/components/marketing/grid-pattern";
import { MaxWidthWrapper } from "@workspace/ui/components/global/max-width-wrapper";
import { Button } from "@workspace/ui/components/button";
import { AnimatedShinyText } from "@workspace/ui/components/marketing/AnimatedShinyText";
import { ArrowRightIcon } from "lucide-react";
import { FeaturesSection } from "@/components/ui/marketing/features-section";
import { useSession } from "@/config/auth/client";

export default function GridPatternDashed() {
  return (
    <>
      <div className="bg-background py-20 relative size-full items-center justify-center overflow-hidden rounded-lg">
        <GridPattern width={60} height={60} x={-1} y={-1} />
        <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
          <div className="flex items-center justify-center">
            <div
              className={cn(
                "group rounded-full border border-black/10 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              )}
            >
              <AnimatedShinyText className="inline-flex bg-white items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>✨ Introducing Magic UI</span>
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </div>
          <h1 className="text-center pt-5 font-display text-4xl font-medium text-neutral-900 sm:text-5xl sm:leading-[1.15] animate-slide-up-fade [--offset:20px] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in text-pretty [animation-delay:100ms]">
            Turn clicks into revenue
          </h1>
          <p className="mt-5 text-pretty text-base text-neutral-600 sm:text-xl animate-slide-up-fade [--offset:10px] [animation-delay:200ms] [animation-duration:1s] [animation-fill-mode:both] motion-reduce:animate-fade-in">
            Dub is the modern link attribution platform for short links,
            conversion tracking, and affiliate programs.
          </p>
          <div className=" pt-10 flex gap-4 justify-center">
            <Button text={"Get Started"} />
            <Button text={"Get Demo"} variant={"outline"} />
          </div>
        </div>
      </div>
      <MaxWidthWrapper>
        <FeaturesSection />
      </MaxWidthWrapper>
    </>
  );
}
