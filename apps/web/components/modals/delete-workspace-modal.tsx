"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { Modal } from "@workspace/ui/components/modal";
import { cn, useMediaQuery } from "@workspace/utils";
import { User } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { authClient } from "@/config/auth/client";
import { Input } from "@workspace/ui/components/input";
import useWorkspaces from "@/lib/use-workspaces";

function DeleteWorkspaceModal({
  showDeleteWorkspaceModal,
  setShowDeleteWorkspaceModal,
}: {
  showDeleteWorkspaceModal: boolean;
  setShowDeleteWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { workspaces, isLoading: isWorkspaceListLoading } = useWorkspaces();
  const { data: activeOrganization, isPending: isLoading } =
    authClient.useActiveOrganization();
  const router = useRouter();

  // Add state for form validation
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [verificationText, setVerificationText] = useState("");

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      workspaceSlug === activeOrganization?.slug &&
      verificationText === "confirm delete workspace"
    );
  }, [workspaceSlug, verificationText, activeOrganization?.slug]);

  async function deleteWorkspace() {
    if (!activeOrganization?.id || !isFormValid) {
      toast.error("Invalid verification");
      return;
    }

    try {
      const { data, error } = await authClient.organization.delete({
        organizationId: activeOrganization.id,
      });

      if (error) {
        toast.error(error.message || "Failed to delete workspace");
        return;
      }

      // Handle navigation after successful deletion
      if (workspaces.length >= 2) {
        const otherWorkspace = workspaces.find(
          (w) => w.id !== activeOrganization.id
        );
        if (otherWorkspace) {
          const { data, error } = await authClient.organization.setActive({
            organizationId: otherWorkspace.id,
            organizationSlug: otherWorkspace.slug,
          });
          // router.push(`/${otherWorkspace.slug}/overview`);
        } else {
          router.push("/onboarding/workspace");
        }
      } else {
        router.push("/onboarding/workspace");
      }

      setShowDeleteWorkspaceModal(false);
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  }

  const { isMobile } = useMediaQuery();

  return (
    <Modal
      showModal={showDeleteWorkspaceModal}
      setShowModal={setShowDeleteWorkspaceModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-neutral-200 px-4 py-4 pt-8 sm:px-16">
        <User />
        <h3 className="text-lg font-medium">Delete Workspace</h3>
        <p className="text-center text-sm text-neutral-500">
          Warning: This will permanently delete your workspace, custom domain,
          and all associated links and their respective analytics.
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!isFormValid) return;

          toast.promise(deleteWorkspace(), {
            loading: "Deleting workspace...",
            success: "Workspace deleted successfully!",
            error: "Failed to delete workspace",
          });
        }}
        className="flex flex-col space-y-6 bg-neutral-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label
            htmlFor="workspace-slug"
            className="block text-sm font-medium text-neutral-700"
          >
            Enter the workspace slug{" "}
            <span className="font-semibold text-black">
              {activeOrganization?.slug}
            </span>{" "}
            to continue:
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              type="text"
              name="workspace-slug"
              id="workspace-slug"
              value={workspaceSlug}
              onChange={(e) => setWorkspaceSlug(e.target.value)}
              autoFocus={!isMobile}
              autoComplete="off"
              required
              className={cn(
                "block w-full rounded-md border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-neutral-500 sm:text-sm",
                workspaceSlug &&
                  workspaceSlug !== activeOrganization?.slug &&
                  "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
            />
          </div>
          {workspaceSlug && workspaceSlug !== activeOrganization?.slug && (
            <p className="mt-1 text-sm text-red-600">
              Workspace slug does not match
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="verification"
            className="block text-sm text-neutral-700"
          >
            To verify, type{" "}
            <span className="font-semibold text-black">
              confirm delete workspace
            </span>{" "}
            below
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              type="text"
              name="verification"
              id="verification"
              value={verificationText}
              onChange={(e) => setVerificationText(e.target.value)}
              required
              autoComplete="off"
              className={cn(
                "block w-full rounded-md border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-neutral-500 sm:text-sm",
                verificationText &&
                  verificationText !== "confirm delete workspace" &&
                  "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
            />
          </div>
          {verificationText &&
            verificationText !== "confirm delete workspace" && (
              <p className="mt-1 text-sm text-red-600">
                Verification text does not match
              </p>
            )}
        </div>

        <Button
          type="submit"
          variant="danger"
          disabled={!isFormValid || isLoading}
          loading={isLoading}
          text={"Confirm delete workspace"}
        />
      </form>
    </Modal>
  );
}

export function useDeleteWorkspaceModal() {
  const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] =
    useState(false);

  const DeleteWorkspaceModalCallback = useCallback(() => {
    return (
      <DeleteWorkspaceModal
        showDeleteWorkspaceModal={showDeleteWorkspaceModal}
        setShowDeleteWorkspaceModal={setShowDeleteWorkspaceModal}
      />
    );
  }, [showDeleteWorkspaceModal]);

  return useMemo(
    () => ({
      setShowDeleteWorkspaceModal,
      DeleteWorkspaceModal: DeleteWorkspaceModalCallback,
    }),
    [DeleteWorkspaceModalCallback]
  );
}
