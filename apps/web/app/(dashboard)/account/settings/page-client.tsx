"use client";

import DeleteAccountSection from "@/components/account/delete-account";
import UpdateDefaultWorkspace from "@/components/account/update-default-workspace";
import UpdateSubscription from "@/components/account/update-subscription";
import UploadAvatar from "@/components/account/upload-avatar";
import UserId from "@/components/account/user-id";
import { PageWidthWrapper } from "@/components/ui/page-width-wrapper";
import { useSession } from "@/config/auth/client";
import { Form } from "@workspace/ui/components/form";
import { toast } from "sonner";

export function SettingsPageClient() {
  const { data: session, isPending: sessionStatus } = useSession();

  return (
    <PageWidthWrapper className="mb-8 grid gap-8">
      <Form
        title="Your Name"
        description={`This is your display name on.`}
        inputAttrs={{
          name: "name",
          defaultValue: sessionStatus ? undefined : session?.user.name || "",
          placeholder: "Steve Jobs",
          maxLength: 32,
        }}
        helpText="Max 32 characters."
        handleSubmit={(data) =>
          fetch("/api/user", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {})
        }
      />
      <Form
        title="Your Email"
        description={`This will be the email you use to log in to and receive notifications. A confirmation is required for changes.`}
        inputAttrs={{
          name: "email",
          type: "email",
          defaultValue: session?.user?.email || undefined,
          placeholder: "panic@thedis.co",
        }}
        helpText={<UpdateSubscription />}
        handleSubmit={(data) =>
          fetch("/api/user", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.status === 200) {
              toast.success(
                `A confirmation email has been sent to ${data.email}.`
              );
            } else {
              const { error } = await res.json();
              toast.error(error.message);
            }
          })
        }
      />
      <UploadAvatar />
      <UserId />
      {/* <UpdateDefaultWorkspace /> */}
      <DeleteAccountSection />
    </PageWidthWrapper>
  );
}
