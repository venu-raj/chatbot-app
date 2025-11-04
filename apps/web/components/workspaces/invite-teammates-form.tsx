import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { capitalize, cn } from "@workspace/utils";
import { pluralize } from "@workspace/utils/functions/pluralize";
import { useMediaQuery } from "@workspace/utils/hooks/use-media-query";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { authClient } from "@/config/auth/client";
import { usePathname } from "next/navigation";

type FormData = {
  teammates: {
    email: string;
    role: "member" | "owner" | "admin" | ("member" | "owner" | "admin")[];
  }[];
};

export function InviteTeammatesForm({
  onSuccess,
  saveOnly = false,
  invites = [],
  className,
}: {
  onSuccess?: () => void;
  saveOnly?: boolean;
  invites?: any[];
  className?: string;
}) {
  const { isMobile } = useMediaQuery();
  const maxTeammates = saveOnly ? 4 : 10;
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    defaultValues: {
      teammates: invites.length ? invites : [{ email: "", role: "member" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "teammates",
    control: control,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Filter out empty emails and validate data
      const validTeammates = data.teammates.filter(
        (team) => team.email.trim() !== ""
      );

      if (validTeammates.length === 0) {
        toast.error("Please add at least one valid email address");
        return;
      }

      // You'll need to get the organizationId from your application context
      // For now, I'll use a placeholder - replace this with actual logic
      const organizationId = activeOrganization?.id; // TODO: Get from context/props

      // Send invites in parallel
      const invitePromises = validTeammates.map(async (team) => {
        const { data: invites, error } =
          await authClient.organization.inviteMember({
            email: team.email,
            role: team.role,
            organizationId: organizationId, // Add the missing organizationId
            resend: true,
          });

        if (error) {
          throw new Error(`Failed to invite ${team.email}: ${error.message}`);
        }

        return invites;
      });

      await Promise.all(invitePromises);

      toast.success(
        `Successfully sent ${pluralize("invite", validTeammates.length)}`
      );
      onSuccess?.();
    } catch (error) {
      console.error("Failed to send invites:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send invites"
      );
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-8 text-left", className)}
    >
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="relative">
            <label className="block">
              {index === 0 && (
                <span className="mb-2 block text-sm font-medium text-neutral-700">
                  {pluralize("Email", fields.length)}
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="flex border-none flex-1 shadow-none">
                  <Input
                    type="email"
                    placeholder="panic@thedis.co"
                    autoFocus={index === 0 && !isMobile}
                    autoComplete="off"
                    className="flex-1 h-9 rounded-r-none border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-neutral-500 sm:text-sm"
                    {...register(`teammates.${index}.email`, {
                      required: index === 0 && "Email is required",
                    })}
                  />
                  <Select
                    {...register(`teammates.${index}.role`, {
                      required: index === 0 && "Role is required",
                    })}
                    defaultValue="member"
                  >
                    <SelectTrigger className="rounded-l-none rounded-r-md">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        {["owner", "member"].map((role) => (
                          <SelectItem key={role} value={role}>
                            {capitalize(role)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    icon={<Trash className="size-4" />}
                    className="flex-shrink-0"
                    onClick={() => remove(index)}
                  />
                )}
              </div>
            </label>
          </div>
        ))}
        <Button
          type="button"
          className="h-9 w-fit"
          variant="outline"
          icon={<Plus className="size-4" />}
          text="Add email"
          onClick={() => append({ email: "", role: "member" })}
          disabled={fields.length >= maxTeammates}
        />
      </div>
      <Button
        type="submit"
        loading={isSubmitting || isSubmitSuccessful}
        text={
          saveOnly ? "Continue" : `Send ${pluralize("invite", fields.length)}`
        }
      />
    </form>
  );
}
