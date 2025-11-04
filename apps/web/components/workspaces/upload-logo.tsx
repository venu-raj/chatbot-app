"use client";

import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { toast } from "sonner";
import { FileUpload } from "@workspace/ui/components/file-upload";
import { authClient } from "@/config/auth/client";

export default function UploadLogo({
  logo,
  activeOrganizationId,
}: {
  logo: string;
  activeOrganizationId: string;
}) {
  const [image, setImage] = useState<string | null>(logo || null);
  const [uploading, setUploading] = useState(false);

  const handleLogoUpdate = async (logoUrl: string) => {
    try {
      setUploading(true);
      const { data, error } = await authClient.organization.update({
        data: {
          logo: logoUrl,
        },
        organizationId: activeOrganizationId,
      });

      if (error) {
        throw new Error(error.message || "Failed to update workspace logo");
      }

      toast.success("Successfully updated workspace logo!");
      setImage(logoUrl);
    } catch (err) {
      console.error("Error updating workspace logo:", err);
      toast.error("Failed to update workspace logo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (image && image !== logo) {
      await handleLogoUpdate(image);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-200 bg-white"
    >
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="text-xl font-medium">Workspace Logo</h2>
        <p className="text-sm text-neutral-500">
          This is your workspace's logo on {process.env.NEXT_PUBLIC_APP_NAME}.
        </p>
        <div className="mt-1">
          <FileUpload
            accept="images"
            className="h-24 w-24 rounded-full border border-neutral-300"
            iconClassName="w-5 h-5"
            variant="plain"
            imageSrc={image}
            readFile
            onChange={async ({ src }) => {
              setImage(src);
            }}
            content={null}
            maxFileSizeMB={2}
            targetResolution={{ width: 240, height: 240 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between space-x-4 rounded-b-lg border-t border-neutral-200 bg-neutral-50 p-3 sm:px-10">
        <p className="text-sm text-neutral-500">
          Square image recommended. Accepted file types: .png, .jpg. Max file
          size: 2MB.
        </p>
        <div className="shrink-0">
          <Button
            text="Save changes"
            loading={uploading}
            disabled={!image || image === logo}
            type="submit"
          />
        </div>
      </div>
    </form>
  );
}
