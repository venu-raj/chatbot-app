import { authClient } from "@/config/auth/client";
import { Button } from "@workspace/ui/components/button";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const acceptInvitation = async () => {
    const { data, error } = await authClient.organization.acceptInvitation({
      invitationId: id,
    });
  };

  return (
    <>
      <Button
        text={"Accept Invitation"}
        onClick={async () => await acceptInvitation()}
      />
    </>
  );
}
