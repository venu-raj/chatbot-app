"use client";

import DeleteWorkspace from "@/components/workspaces/delete-workspace";
import UploadLogo from "@/components/workspaces/upload-logo";
import { authClient } from "@/config/auth/client";
import { Form } from "@workspace/ui/components/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function WorkspaceSettingsClient() {
  const router = useRouter();
  const { data: activeOrganization, isPending: isLoading } =
    authClient.useActiveOrganization();

  const handleNameUpdate = async (updateData: { name: string }) => {
    try {
      const { data, error } = await authClient.organization.update({
        data: {
          name: updateData.name,
        },
        organizationId: activeOrganization?.id,
      });

      if (error) {
        throw new Error(error.message || "Failed to update workspace name");
      }

      toast.success("Successfully updated workspace name!");
    } catch (err) {
      console.error("Error updating workspace name:", err);
      throw err;
    }
  };

  const handleSlugUpdate = async (updateData: { slug: string }) => {
    try {
      const { data, error } = await authClient.organization.update({
        data: {
          slug: updateData.slug, // Fixed: was updating 'name' instead of 'slug'
        },
        organizationId: activeOrganization?.id,
      });

      if (error) {
        throw new Error(error.message || "Failed to update workspace slug"); // Fixed error message
      }

      toast.success("Successfully updated workspace slug!"); // Fixed success message

      // Redirect to new slug if successful
      if (data?.slug) {
        router.push(`/${data.slug}/settings`);
      }
    } catch (err) {
      console.error("Error updating workspace slug:", err);
      throw err;
    }
  };

  // Check permissions
  const hasEditPermissions = activeOrganization !== null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!activeOrganization) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="text-sm text-yellow-700">
          <p>Workspace not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form
        title="Workspace Name"
        description={`This is the name of your workspace on ${process.env.NEXT_PUBLIC_APP_NAME}.`}
        inputAttrs={{
          name: "name",
          defaultValue: activeOrganization.name,
          placeholder: "My Workspace",
          maxLength: 32,
        }}
        helpText="Max 32 characters."
        disabledTooltip={
          !hasEditPermissions
            ? "You don't have permission to edit this workspace"
            : undefined
        }
        handleSubmit={handleNameUpdate}
      />
      <Form
        title="Workspace Slug"
        description={`This is your workspace's unique slug on ${process.env.NEXT_PUBLIC_APP_NAME}.`}
        inputAttrs={{
          name: "slug",
          defaultValue: activeOrganization.slug,
          placeholder: "my-workspace",
          pattern: "^[a-z0-9-]+$",
          maxLength: 48,
        }}
        helpText="Only lowercase letters, numbers, and dashes. Max 48 characters."
        disabledTooltip={
          !hasEditPermissions
            ? "You don't have permission to edit this workspace"
            : undefined
        }
        handleSubmit={handleSlugUpdate}
      />
      <UploadLogo
        logo={activeOrganization.logo ?? ""}
        activeOrganizationId={activeOrganization.id}
      />
      <DeleteWorkspace organizationId={activeOrganization.id} />
    </div>
  );
}
