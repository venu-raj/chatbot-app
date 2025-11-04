"use client";

import { authClient, organization, useSession } from "@/config/auth/client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/utils/functions/cn";
import { useMediaQuery } from "@workspace/utils/hooks/use-media-query";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = {
  name: string;
  slug: string;
  logo?: string;
};

export function CreateWorkspaceForm({
  onSuccess,
  className,
}: {
  onSuccess?: (data: FormData) => void;
  className?: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [isSlugEdited, setIsSlugEdited] = useState<boolean>(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState<boolean>(false);

  const { isMobile } = useMediaQuery();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const name = watch("name");
  const slug = watch("slug");

  // Debounced slug availability check
  useEffect(() => {
    const checkSlugAvailability = async () => {
      if (!slug || slug.length < 3 || errors.slug) {
        setSlugAvailable(null);
        return;
      }

      setCheckingSlug(true);
      try {
        const { data, error } = await authClient.organization.checkSlug({
          slug: slug,
        });
        setSlugAvailable(data?.status ?? false);
      } catch (error) {
        console.error("Error checking slug:", error);
        setSlugAvailable(null);
      } finally {
        setCheckingSlug(false);
      }
    };

    const timeoutId = setTimeout(checkSlugAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [slug, errors.slug]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isSlugEdited && name) {
      const generatedSlug = name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setValue("slug", generatedSlug);
      trigger("slug");
    }
  }, [name, isSlugEdited, setValue, trigger]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("slug", e.target.value);
    setIsSlugEdited(true);
  };

  const onSubmit = async (data: FormData) => {
    if (slugAvailable === false) {
      toast.error("This slug is already taken. Please choose a different one.");
      return;
    }

    setLoading(true);
    try {
      await organization.create(
        {
          name: data.name,
          slug: data.slug,
          logo: logo || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Organization created successfully");
            onSuccess?.(data);
            // Reset form
            setValue("name", "");
            setValue("slug", "");
            setIsSlugEdited(false);
            setLogo(null);
            setSlugAvailable(null);
          },
          onError: (error) => {
            toast.error(
              error.error?.message || "Failed to create organization"
            );
          },
        }
      );
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    isSubmitting ||
    loading ||
    checkingSlug ||
    slugAvailable === false ||
    Object.keys(errors).length > 0;

  return (
    <form
      className={cn("flex flex-col gap-4 text-left", className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Workspace name
        </Label>
        <Input
          id="name"
          type="text"
          autoFocus={!isMobile}
          autoComplete="off"
          placeholder="Enter workspace name"
          className={cn(
            "w-full rounded-lg border px-3 py-2.5 text-base transition-colors focus:outline-none focus:ring-2 sm:text-sm",
            errors.name
              ? "border-red-300 focus:ring-red-500"
              : "border-neutral-300 focus:ring-blue-500"
          )}
          {...register("name", {
            required: "Workspace name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters long",
            },
            maxLength: {
              value: 50,
              message: "Name must be less than 50 characters long",
            },
          })}
        />
        {errors.name && (
          <p className="text-xs font-medium text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug" className="text-sm font-medium">
          Workspace slug
        </Label>
        <Input
          id="slug"
          type="text"
          autoComplete="off"
          placeholder="acme"
          className={cn(
            "w-full rounded-lg border px-3 py-2.5 text-base transition-colors focus:outline-none focus:ring-2 sm:text-sm",
            errors.slug || slugAvailable === false
              ? "border-red-300 focus:ring-red-500"
              : "border-neutral-300 focus:ring-blue-500"
          )}
          {...register("slug", {
            required: "Workspace slug is required",
            minLength: {
              value: 3,
              message: "Slug must be at least 3 characters long",
            },
            maxLength: {
              value: 48,
              message: "Slug must be less than 48 characters long",
            },
            pattern: {
              value: /^[a-z0-9\-]+$/,
              message:
                "Slug can only contain lowercase letters, numbers, and hyphens",
            },
            validate: {
              notReserved: (value) =>
                !["admin", "api", "www"].includes(value) ||
                "This slug is reserved",
            },
          })}
          onChange={handleSlugChange}
        />

        <div className="min-h-[20px]">
          {/* {checkingSlug && (
            <p className="text-xs text-blue-600">
              Checking slug availability...
            </p>
          )} */}
          {slugAvailable === false && (
            <p className="text-xs font-medium text-red-600">
              The slug "{slug}" is already taken. Please choose a different one.
            </p>
          )}
          {slugAvailable === true && !errors.slug && (
            <p className="text-xs text-green-600">Slug is available!</p>
          )}
          {errors.slug && (
            <p className="text-xs font-medium text-red-600">
              {errors.slug.message}
            </p>
          )}
          <p className="text-xs pt-2 text-neutral-500">
            You can change this later in your workspace settings.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Workspace logo</Label>
        <div className="mt-2 flex items-center gap-5">
          <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-neutral-300 bg-neutral-100">
            {logo ? (
              <Image
                src={logo}
                alt="Workspace logo"
                width={80}
                height={80}
                className="size-full object-cover"
              />
            ) : session?.user.image ? (
              <Image
                src={session.user.image}
                alt="User avatar"
                width={80}
                height={80}
                className="size-full object-cover"
              />
            ) : (
              <Camera className="size-8 text-neutral-400" />
            )}
          </div>
          <div>
            <button
              type="button"
              className="flex h-8 items-center rounded-lg border border-neutral-300 bg-white px-3 text-xs transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() =>
                toast.info("Logo upload functionality not implemented")
              }
            >
              Upload image
            </button>
            <p className="mt-2 text-xs text-neutral-500">
              Recommended size: 160×160px
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        // disabled={isSubmitDisabled}
        className="mt-2"
        text={isSubmitting || loading ? "Creating..." : "Create workspace"}
      />
    </form>
  );
}
