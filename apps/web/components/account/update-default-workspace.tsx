"use client";

import { authClient, useSession } from "@/config/auth/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import useWorkspaces from "@/lib/use-workspaces"; // Import workspaces hook

export default function UpdateDefaultWorkspace() {
  const { data: session } = useSession();
  const { workspaces, isLoading } = useWorkspaces();
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>();
  const [saving, setSaving] = useState(false);

  // Get the selected workspace's slug
  const selectedWorkspaceData = workspaces.find(
    (w) => w.id === selectedWorkspace
  );
  const workspaceSlug = selectedWorkspaceData?.slug || "";

  async function updateDefaultWorkspace() {
    if (!selectedWorkspace || !workspaceSlug) {
      toast.error("Please select a valid workspace");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await authClient.organization.setActive({
        organizationId: selectedWorkspace,
        organizationSlug: workspaceSlug,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Successfully updated your default workspace!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update workspace"
      );
      throw error;
    } finally {
      setSaving(false);
    }
  }

  const isSaveDisabled = !selectedWorkspace || saving || !workspaceSlug;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (isSaveDisabled) return;

        toast.promise(updateDefaultWorkspace(), {
          loading: "Saving changes...",
          success: "Successfully updated your default workspace!",
          error: (error) => error.message || "Failed to update workspace",
        });
      }}
      className="rounded-lg border border-neutral-200 bg-white"
    >
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="text-xl font-medium">Your Default Workspace</h2>
        <p className="text-sm text-neutral-500">
          Choose the workspace to show by default when you sign in.
        </p>
        <div className="mt-1 max-w-md">
          {/* <WorkspaceSelector
            selectedWorkspace={selectedWorkspace || ""}
            setSelectedWorkspace={setSelectedWorkspace}
            disabled={isLoading}
          /> */}
        </div>
      </div>

      <div className="flex items-center justify-between space-x-4 rounded-b-lg border-t border-neutral-200 bg-neutral-50 p-3 sm:px-10">
        <a
          href="https://dub.co/help/article/how-to-change-default-workspace"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-700"
        >
          Learn more about how default workspaces work
        </a>
        <div>
          <Button
            type="submit"
            disabled={isSaveDisabled}
            loading={saving}
            text={"Save changes"}
          />
        </div>
      </div>
    </form>
  );
}
