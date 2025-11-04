"use client";

import { authClient } from "@/config/auth/client";
import { Session } from "@/config/auth/auth-types";
import { Popover } from "@workspace/ui/components/popover";
import { cn } from "@workspace/utils/functions/cn";
import { Icon, User } from "@workspace/utils/icons/index";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ComponentPropsWithoutRef,
  ElementType,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { BlurImage } from "@/components/ui/blur-image";

type User = {
  id?: string | null | undefined;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export function UserDropdown() {
  const [session, setSession] = useState<Session | null>(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: activeOrganization, isPending: organizationPending } =
    authClient.useActiveOrganization();

  useEffect(() => {
    // Fetch session on client side
    const fetchSession = async () => {
      try {
        // You'll need to replace this with your actual session fetching logic
        // This could be an API call or using your auth client
        const userSession = await authClient.getSession(); // Adjust based on your auth client
        setSession(userSession.data);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const menuOptions = useMemo(() => {
    const options: Array<{
      label: string;
      icon: any;
      href?: string;
      type?: string;
      onClick?: () => void;
    }> = [
      {
        label: "Account settings",
        icon: User,
        // href: "/account/settings",
        href: "/account/settings",
        onClick: () => setOpenPopover(false),
      },
    ];

    // Add logout option
    options.push({
      type: "button",
      label: "Log out",
      icon: LogOut,
      onClick: async () => {
        try {
          await authClient.signOut();
          setOpenPopover(false);
          // Optionally redirect after logout
          redirect("/");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    });

    return options;
  }, [setOpenPopover]);

  return (
    <Popover
      content={
        <div className="flex w-full flex-col space-y-px rounded-md bg-white p-2 sm:min-w-56">
          {session?.user ? (
            <div className="p-2">
              <p className="truncate text-sm font-medium text-neutral-900">
                {session.user.name || session.user.email?.split("@")[0]}
              </p>
              <p className="truncate text-sm text-neutral-500">
                {session.user.email}
              </p>
            </div>
          ) : (
            <div className="grid gap-2 px-2 py-3">
              <div className="h-3 w-12 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-3 w-20 animate-pulse rounded-full bg-neutral-200" />
            </div>
          )}
          {menuOptions.map((menuOption, idx) => (
            <UserOption
              key={idx}
              as={menuOption.href ? Link : "button"}
              {...menuOption}
            />
          ))}
        </div>
      }
      align="start"
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
    >
      <button
        onClick={() => setOpenPopover(!openPopover)}
        className={cn(
          "group relative flex size-11 items-center justify-center rounded-lg transition-all",
          "hover:bg-bg-inverted/5 active:bg-bg-inverted/10 data-[state=open]:bg-bg-inverted/10 transition-colors duration-150",
          "outline-none focus-visible:ring-2 focus-visible:ring-black/50"
        )}
      >
        {session?.user.image ? (
          <BlurImage
            src={session?.user.image}
            referrerPolicy="no-referrer"
            width={28}
            height={28}
            alt={session?.user.image || session?.user.name}
            className="size-7 flex-none shrink-0 overflow-hidden rounded-full"
            draggable={false}
          />
        ) : (
          <BlurImage
            src={`https://avatar.vercel.sh/${encodeURIComponent(session?.user.id ?? "")}`}
            referrerPolicy="no-referrer"
            width={28}
            height={28}
            alt={(session?.user.id || session?.user.name) ?? ""}
            className="size-7 flex-none shrink-0 overflow-hidden rounded-full"
            draggable={false}
          />
        )}
      </button>
    </Popover>
  );
}

type UserOptionProps<T extends ElementType> = {
  as?: T;
  label: string;
  icon: Icon;
};

function UserOption<T extends ElementType = "button">({
  as,
  label,
  icon: Icon,
  children,
  ...rest
}: UserOptionProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof UserOptionProps<T>>) {
  const Component = as ?? "button";

  return (
    <Component
      className="flex cursor-pointer items-center gap-x-4 rounded-md px-2.5 py-1.5 text-sm transition-all duration-75 hover:bg-neutral-200/50 active:bg-neutral-200/80"
      {...rest}
    >
      <Icon className="size-4 text-neutral-500" />
      <span className="block truncate text-neutral-600">{label}</span>
      {children}
    </Component>
  );
}
