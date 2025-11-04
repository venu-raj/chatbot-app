import { LoadingSpinner } from "@workspace/ui/components/global/loading-spinner";
import { Modal } from "@workspace/ui/components/modal";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { InviteTeammatesForm } from "../workspaces/invite-teammates-form";
import { CreateWorkspaceForm } from "../workspaces/create-workspace-form";
import { DubApiIcon } from "@workspace/utils/icons/dub-api";

function CreateWorkspaceModal({
  showCreateWorkspaceModal,
  setShowCreateWorkspaceModal,
}: {
  showCreateWorkspaceModal: boolean;
  setShowCreateWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal
      showModal={showCreateWorkspaceModal}
      setShowModal={setShowCreateWorkspaceModal}
      className="max-h-[95dvh]"
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-neutral-200 px-4 py-4 pt-8 sm:px-16">
        <DubApiIcon />
        <h3 className="text-lg font-medium">Create a workspace</h3>
        <p className="-translate-y-2 text-balance text-center text-xs text-neutral-500">
          Set up a common space to manage your links with your team.{" "}
          <a
            href="https://dub.co/help/article/what-is-a-workspace"
            target="_blank"
            className="cursor-help font-medium underline decoration-dotted underline-offset-2 transition-colors hover:text-neutral-700"
          >
            Learn more.
          </a>
        </p>
      </div>
      <CreateWorkspaceForm
        className="px-4 py-4 sm:px-6"
        onSuccess={() => setShowCreateWorkspaceModal(false)}
      />
    </Modal>
  );
}

export function useCreateWorkspaceModal() {
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
    useState(false);

  const CreateWorkspaceModalCallback = useCallback(() => {
    // Fixed typo: CreateWorkspaceModalback -> CreateWorkspaceModalCallback
    return (
      <CreateWorkspaceModal
        showCreateWorkspaceModal={showCreateWorkspaceModal}
        setShowCreateWorkspaceModal={setShowCreateWorkspaceModal}
      />
    );
  }, [showCreateWorkspaceModal, setShowCreateWorkspaceModal]);

  return useMemo(
    () => ({
      setShowCreateWorkspaceModal,
      CreateWorkspaceModal: CreateWorkspaceModalCallback, // Fixed reference
    }),
    [setShowCreateWorkspaceModal, CreateWorkspaceModalCallback]
  );
}
