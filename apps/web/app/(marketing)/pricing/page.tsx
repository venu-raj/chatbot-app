import { PlanSelector } from "@/components/pricing/plan/plan-selector";
import { MaxWidthWrapper } from "@workspace/ui/components/global/max-width-wrapper";

export default function Plan() {
  return (
    <MaxWidthWrapper>
      <div className="mt-8">
        <PlanSelector />
        <div className="mx-auto mt-8 flex w-fit flex-col items-center justify-center gap-6 text-sm md:flex-row">
          {/* <EnterpriseLink />
        <LaterButton
          next="finish"
          className="underline-offset-4 hover:underline"
        >
          Start for free, pick a plan later
        </LaterButton> */}
          <a
            href="https://dub.co/pricing"
            target="_blank"
            className="flex items-center text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-800 hover:underline"
          >
            Compare all plans ↗
          </a>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
