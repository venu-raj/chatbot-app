import { PageContent } from "@/components/dashboard/page-content";
import { SettingsPageClient } from "./page-client";

export default function SettingsPage() {
  return (
    <PageContent title="General">
      <SettingsPageClient />
    </PageContent>
  );
}
