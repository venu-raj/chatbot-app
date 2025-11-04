import { PageContentOld } from "@/components/dashboard/page-content";
import { MaxWidthWrapper } from "@workspace/ui/components/global/max-width-wrapper";
import { PropsWithChildren } from "react";

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <PageContentOld>
      <div className="relative min-h-[calc(100vh-60px)] md:min-h-[calc(100vh-32px)]">
        <MaxWidthWrapper className="grid grid-cols-1 gap-5 pb-10 pt-3">
          {children}
        </MaxWidthWrapper>
      </div>
    </PageContentOld>
  );
}
