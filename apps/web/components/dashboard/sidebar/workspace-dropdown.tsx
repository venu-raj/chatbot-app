"use client";

import { BlurImage } from "@/components/ui/blur-image";
import { useSession } from "@/lib/session-context";
import useWorkspaces from "@/lib/use-workspaces";
import { Popover } from "@workspace/ui/components/popover";
import { cn } from "@workspace/utils/functions/cn";
import { useScrollProgress } from "@workspace/utils/hooks/use-scroll-progress";
import { Check2, Gear, Plus, UserPlus } from "@workspace/utils/icons/index";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Session } from "@/config/auth/auth-types";
import { authClient } from "@/config/auth/client";
import { useCreateWorkspaceModal } from "@/components/modals/create-workspace-modal";

// Local storage utility for workspace persistence
const workspaceStorage = {
  getLastSelected: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("lastSelectedWorkspace");
  },
  setLastSelected: (slug: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("lastSelectedWorkspace", slug);
  },
};

export function WorkspaceDropdown() {
  const { workspaces, isLoading } = useWorkspaces();
  const { data: session, status: sessionStatus } = useSession();
  const { slug: currentSlug } = useParams() as { slug?: string };
  const router = useRouter();

  const [slug, setSlug] = useState(currentSlug);
  const [isSettingActive, setIsSettingActive] = useState(false);

  // Set active workspace using Better Auth
  const setActiveWorkspace = useCallback(
    async (workspaceSlug: string, workspaceId: string) => {
      if (isSettingActive) return;

      try {
        setIsSettingActive(true);

        const { data, error } = await authClient.organization.setActive({
          organizationId: workspaceId,
          organizationSlug: workspaceSlug,
        });

        if (error) {
          console.error("Failed to set active workspace:", error);
          // Fallback to local storage if Better Auth fails
          workspaceStorage.setLastSelected(workspaceSlug);
          setSlug(workspaceSlug);
          return;
        }

        // Success - update local state
        workspaceStorage.setLastSelected(workspaceSlug);
        setSlug(workspaceSlug);

        // Refresh the session to get updated organization context
        // This depends on your session management implementation
        // await refreshSession();
      } catch (error) {
        console.error("Error setting active workspace:", error);
        // Fallback to local storage
        workspaceStorage.setLastSelected(workspaceSlug);
        setSlug(workspaceSlug);
      } finally {
        setIsSettingActive(false);
      }
    },
    [isSettingActive]
  );

  // Enhanced slug persistence with Better Auth integration
  useEffect(() => {
    if (currentSlug) {
      // setSlug(currentSlug);
      workspaceStorage.setLastSelected(currentSlug);
    } else if (!slug && workspaces && workspaces.length > 0) {
      // Fallback to last selected workspace
      const lastSelected = workspaceStorage.getLastSelected();
      const validWorkspace =
        workspaces.find((w) => w.slug === lastSelected) || workspaces[0];

      if (validWorkspace && validWorkspace.slug !== currentSlug) {
        // Use Better Auth to set active workspace
        setActiveWorkspace(validWorkspace.slug, validWorkspace.id);

        // Optionally redirect to the workspace if no current slug
        // if (!currentSlug) {
        //   router.push(`/${validWorkspace.slug}/tttttt`);
        // }
      }
    }
  }, [currentSlug, workspaces, slug, router, setActiveWorkspace]);

  const selected = useMemo(() => {
    // Show loading state
    if (sessionStatus === "loading" || isLoading || isSettingActive) {
      return {
        name: "Loading...",
        slug: "/",
        image: "",
        plan: "free" as const,
        id: "",
      };
    }

    const selectedWorkspace = workspaces?.find(
      (workspace) => workspace.slug === slug
    );

    if (slug && workspaces && selectedWorkspace) {
      return {
        ...selectedWorkspace,
        image: selectedWorkspace.logo || "",
      };
    }

    // Personal account fallback with better session handling
    if (session?.user) {
      return {
        name: session.user.name || session.user.email || "Personal Account",
        slug: "/",
        image: session.user.image || "",
        plan: "free" as const,
        id: "personal",
      };
    }

    // No session fallback
    return {
      name: "Account",
      slug: "/",
      image: "",
      plan: "free" as const,
      id: "",
    };
  }, [slug, workspaces, session, sessionStatus, isLoading, isSettingActive]);

  const [openPopover, setOpenPopover] = useState(false);

  // Get the create workspace modal
  const { setShowCreateWorkspaceModal, CreateWorkspaceModal } =
    useCreateWorkspaceModal();

  return (
    <div>
      {/* Render the modal component */}
      <CreateWorkspaceModal />

      <Popover
        content={
          <WorkspaceList
            session={session}
            selected={selected}
            workspaces={workspaces || []}
            setOpenPopover={setOpenPopover}
            isLoading={isLoading || isSettingActive}
            onWorkspaceSelect={setActiveWorkspace}
            onCreateWorkspace={() => setShowCreateWorkspaceModal(true)} // Pass the create function
          />
        }
        side="right"
        align="start"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className={cn(
            "flex size-11 items-center justify-center rounded-lg p-1.5 text-left text-sm transition-all duration-75",
            "hover:bg-bg-inverted/5 active:bg-bg-inverted/10 data-[state=open]:bg-bg-inverted/10",
            "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
            isSettingActive && "opacity-50 cursor-not-allowed"
          )}
          disabled={isSettingActive}
        >
          {isSettingActive ? (
            <div className="size-7 flex-none shrink-0 rounded-full bg-neutral-200 animate-pulse" />
          ) : selected.image ? (
            <BlurImage
              src={selected.image}
              referrerPolicy="no-referrer"
              width={28}
              height={28}
              alt={selected.image || selected.name}
              className="size-7 flex-none shrink-0 overflow-hidden rounded-full"
              draggable={false}
            />
          ) : (
            <BlurImage
              src={`https://avatar.vercel.sh/${encodeURIComponent(selected.name)}`}
              referrerPolicy="no-referrer"
              width={28}
              height={28}
              alt={selected.image || selected.name}
              className="size-7 flex-none shrink-0 overflow-hidden rounded-full"
              draggable={false}
            />
          )}
        </button>
      </Popover>
    </div>
  );
}

function WorkspaceList({
  selected,
  workspaces,
  setOpenPopover,
  isLoading,
  session,
  onWorkspaceSelect,
  onCreateWorkspace, // Added prop for creating workspace
}: {
  session: Session;
  selected: {
    name: string;
    slug: string;
    image: string;
    id: string;
  };
  workspaces: WorkspaceProps[];
  setOpenPopover: (open: boolean) => void;
  isLoading?: boolean;
  onWorkspaceSelect: (slug: string, id: string) => void;
  onCreateWorkspace: () => void; // Added prop type
}) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollProgress, updateScrollProgress } = useScrollProgress(scrollRef);
  const router = useRouter();

  const href = useCallback(
    (slug: string) => {
      // Handle personal workspace
      if (slug === "personal" || slug === "/") {
        return "/";
      }

      // Replace current workspace slug in pathname
      const currentSlug = selected.slug === "/" ? "" : selected.slug;
      const newPathname = pathname.replace(`/${currentSlug}`, `/${slug}`);

      // Ensure we don't have double slashes
      return newPathname.replace("//", "/") || `/${slug}`;
    },
    [pathname, selected.slug]
  );

  const handleWorkspaceSelect = useCallback(
    async (slug: string, id: string) => {
      await onWorkspaceSelect(slug, id);
      router.push(`/${slug}/overview`);
      setOpenPopover(false);
    },
    [onWorkspaceSelect, setOpenPopover]
  );

  const handleCreateWorkspace = useCallback(() => {
    onCreateWorkspace();
    setOpenPopover(false); // Close the popover when creating a workspace
  }, [onCreateWorkspace, setOpenPopover]);

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        onScroll={updateScrollProgress}
        className="relative max-h-80 w-full space-y-0.5 overflow-auto rounded-lg bg-white text-base sm:w-64 sm:text-sm"
      >
        {/* Current workspace section */}
        <div className="border-b border-neutral-200 p-2">
          <div className="flex items-center gap-x-2.5 rounded-md p-2">
            <div className="size-8 shrink-0 rounded-full flex items-center justify-center overflow-hidden">
              {selected.image ? (
                <BlurImage
                  src={selected.image}
                  referrerPolicy="no-referrer"
                  width={28}
                  height={28}
                  alt={selected.image || selected.name}
                  className="size-7 flex-none shrink-0 overflow-hidden rounded-full"
                  draggable={false}
                />
              ) : (
                <BlurImage
                  src={`https://avatar.vercel.sh/${encodeURIComponent(selected.name)}`}
                  referrerPolicy="no-referrer"
                  width={28}
                  height={28}
                  alt={selected.image || selected.name}
                  className="size-7 flex-none shrink-0 overflow-hidden rounded-full"
                  draggable={false}
                />
              )}
            </div>
            {isLoading ? (
              <div className="flex-1 min-w-0">
                <div className="h-4 w-20 bg-neutral-200 animate-pulse rounded" />
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium leading-5 text-neutral-900">
                  {selected.name}
                </div>
              </div>
            )}
          </div>

          {/* Settings and Invite members options */}
          <div className="mt-2 flex flex-col gap-0.5">
            <Link
              href={
                selected.slug === "/" || selected.slug === "personal"
                  ? "/settings"
                  : `/${selected.slug}/settings`
              }
              className="flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 text-neutral-700 outline-none transition-all duration-75 hover:bg-neutral-200/50 focus-visible:ring-2 focus-visible:ring-black/50 active:bg-neutral-200/80"
              onClick={() => setOpenPopover(false)}
            >
              <Gear className="size-4 text-neutral-500" />
              <span className="block truncate text-sm">Settings</span>
            </Link>

            {selected.slug !== "/" && selected.slug !== "personal" && (
              <Link
                href={`/${selected.slug}/settings/members`}
                className="flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 text-neutral-700 outline-none transition-all duration-75 hover:bg-neutral-200/50 focus-visible:ring-2 focus-visible:ring-black/50 active:bg-neutral-200/80"
                onClick={() => setOpenPopover(false)}
              >
                <UserPlus className="size-4 text-neutral-500" />
                <span className="block truncate text-sm">Invite members</span>
              </Link>
            )}
          </div>
        </div>

        {/* Workspaces section */}
        <div className="p-2">
          <p className="p-1 text-xs font-medium text-neutral-500">Workspaces</p>
          <div className="flex flex-col gap-0.5">
            {isLoading ? (
              // Loading skeleton for workspaces
              <>
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center gap-x-2 rounded-md px-2 py-1.5"
                  >
                    <div className="size-6 shrink-0 rounded-full bg-neutral-200 animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <div className="h-4 w-20 bg-neutral-200 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Actual workspace list
              workspaces.map(({ id, name, slug, logo }) => {
                const isActive = selected.slug === slug;
                const workspaceImage = logo || "";

                return (
                  <button
                    key={slug}
                    className={cn(
                      "relative flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 transition-all duration-75",
                      "hover:bg-neutral-200/50 active:bg-neutral-200/80",
                      "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
                      isActive && "bg-neutral-200/50",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => handleWorkspaceSelect(slug, id)}
                    disabled={isLoading || isActive}
                  >
                    <div className="size-6 shrink-0 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                      {workspaceImage ? (
                        <img
                          src={workspaceImage}
                          alt={name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium text-neutral-600">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <span className="block truncate text-sm leading-5 text-neutral-900">
                        {name}
                      </span>
                    </div>
                    {isActive && (
                      <span className="flex items-center text-black ml-2">
                        <Check2 className="size-4" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                );
              })
            )}
            <button
              className="cursor-pointer flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 text-neutral-700 outline-none transition-all duration-75 hover:bg-neutral-200/50 focus-visible:ring-2 focus-visible:ring-black/50 active:bg-neutral-200/80"
              onClick={handleCreateWorkspace}
            >
              <Plus className="size-4 text-neutral-500" />
              <span className="block truncate text-sm">Create workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom scroll fade */}
      <div
        className="pointer-events-none absolute -bottom-px left-0 h-16 w-full rounded-b-lg bg-gradient-to-t from-white sm:bottom-0"
        style={{ opacity: Math.max(0, 1 - Math.pow(scrollProgress, 2)) }}
      />
    </div>
  );
}

interface WorkspaceProps {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}
