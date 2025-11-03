import { cn } from "@workspace/utils/functions/cn";
import { useState } from "react";

type User = {
  id?: string | null | undefined;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export function getUserAvatarUrl(user?: User | null) {
  if (user?.image) return user.image;
}

export function Avatar({
  image,
  className,
}: {
  image?: string;
  className?: string;
}) {
  return (
    <img
      alt={`Avatar for ${image}`}
      referrerPolicy="no-referrer"
      src={image}
      className={cn(
        "h-10 w-10 rounded-full border border-neutral-300",
        className
      )}
      draggable={false}
      onError={() => {}}
    />
  );
}
