import { PageContent } from "@/components/dashboard/page-content";
import { PageWidthWrapper } from "@/components/ui/page-width-wrapper";

export default async function FoldersPage() {
  return (
    <PageContent
      title="Folders"
      titleInfo={{
        title:
          "Learn how to use folders to organize and manage access to your links with fine-grained role-based access controls.",
        href: "https://dub.co/help/article/link-folders",
      }}
      // controls={<FoldersPageControls />}
    >
      <PageWidthWrapper>
        <div>FoldersPageClient</div>
      </PageWidthWrapper>
    </PageContent>
  );
}
