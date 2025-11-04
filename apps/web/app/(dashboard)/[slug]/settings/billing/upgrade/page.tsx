import { MaxWidthWrapper } from "@workspace/ui/components/global/max-width-wrapper";
import { WorkspaceBillingUpgradePageClient } from "./page-client";

export default function WorkspaceBillingUpgrade() {
  return (
    <MaxWidthWrapper className="grid gap-8">
      <WorkspaceBillingUpgradePageClient />
    </MaxWidthWrapper>
  );
}
