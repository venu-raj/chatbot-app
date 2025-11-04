"use client";

import { PageContent } from "@/components/dashboard/page-content";
import { PageWidthWrapper } from "@/components/ui/page-width-wrapper";
import { Button } from "@workspace/ui/components/button";
import { Popover } from "@workspace/ui/components/popover";
import {
  CircleCheck,
  CircleDotted,
  Dots,
  EnvelopeArrowRight,
  Icon,
  User,
  UserCheck,
  UserCrown,
  UserMinus,
} from "@workspace/utils/icons/index";
import { Avatar } from "@/components/ui/avatar";
import { cn, timeAgo } from "@workspace/utils";
import { Filter } from "@workspace/ui/components/filter";
import { LinkIcon } from "lucide-react";
import { Table, useTable } from "@workspace/ui/components/table";
import { Command } from "cmdk";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/session-context";
import { useKeyboardShortcut } from "@workspace/ui/hooks/use-keyboard-shortcut";
import { useInviteWorkspaceUserModal } from "@/components/modals/invite-workspace-user-modal";
import { useInviteCodeModal } from "@/components/modals/invite-code-modal";
import { usePagination } from "@workspace/utils/hooks/use-pagination";
import { useRouterStuff } from "@workspace/utils/hooks/use-router-stuff";
import { authClient } from "@/config/auth/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { WorkspaceUserProps } from "@/lib/types";
import { useWorkspaceUserRoleModal } from "@/components/modals/update-workspace-user-role";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { SearchBoxPersisted } from "@/components/ui/search-box";

// Loading indicator component
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

// Skeleton for RoleCell
function RoleCellSkeleton() {
  return (
    <div className="w-20">
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export default function WorkspacePeopleClient() {
  const { setShowInviteWorkspaceUserModal, InviteWorkspaceUserModal } =
    useInviteWorkspaceUserModal({ showSavedInvites: true });

  const { setShowInviteCodeModal, InviteCodeModal } = useInviteCodeModal();

  // Use Better Auth for organization data
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: session } = useSession();

  // Get current user's role in the active organization
  const currentUserRole = useMemo(() => {
    if (!activeOrganization || !session?.user) return null;

    // Find the current user's membership in the active organization
    const membership = activeOrganization.members?.find(
      (member: any) => member.userId === session.user.id
    );
    return membership?.role || "member";
  }, [activeOrganization, session]);

  const isCurrentUserOwner = currentUserRole === "owner";

  const { queryParams, searchParams } = useRouterStuff();
  const { pagination, setPagination } = usePagination();

  const [membersData, setMembersData] = useState<any>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const status = searchParams.get("status") as "active" | "invited" | null;
  const roleFilter = searchParams.get("role");
  const search = searchParams.get("search");

  // Fetch members with search and filters
  const fetchMembers = useCallback(
    async (isRefresh = false) => {
      if (!activeOrganization?.id) return;

      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const { data, error } = await authClient.organization.listMembers({
          query: {
            organizationId: activeOrganization.id,
            limit: 100,
            offset: 0,
          },
        });
        setMembersData(data);
        setError(error?.message ?? "");
      } catch (err) {
        console.error("Failed to fetch members:", err);
        setError("Failed to load members");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [activeOrganization?.id]
  );

  // Initial load
  useEffect(() => {
    fetchMembers(false);
  }, [fetchMembers]);

  // Refresh when search or filters change
  useEffect(() => {
    if (!isLoading && (search || status || roleFilter)) {
      fetchMembers(true);
    }
  }, [search, status, roleFilter, isLoading, fetchMembers]);

  // Filter and search members on the client side since Better Auth doesn't support search in listMembers
  const filteredUsers = useMemo(() => {
    if (!membersData?.members) return [];

    let filtered = membersData.members.map((member: any) => ({
      id: member.userId || member.invitationId,
      name: member.user?.name,
      email: member.user?.email || member.invitationEmail,
      image: member.user?.image,
      role: member.role,
      createdAt: member.createdAt,
      status: member.status || "active",
      isMachine: false,
    }));

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (user: any) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status) {
      filtered = filtered.filter((user: any) => {
        if (status === "invited") {
          return !user.name; // Invited users typically don't have names
        }
        if (status === "active") {
          return user.name; // Active users have names
        }
        return true;
      });
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter((user: any) => user.role === roleFilter);
    }

    return filtered;
  }, [membersData, search, status, roleFilter]);

  // Fixed filter configuration with proper types
  const filters = useMemo(
    () => [
      {
        key: "role",
        icon: UserCheck as any,
        label: "Role",
        options: [
          { value: "owner", label: "Owner", icon: UserCrown as any },
          { value: "member", label: "Member", icon: User as any },
        ],
      },
      {
        key: "status",
        icon: CircleDotted as any,
        label: "Status",
        options: [
          {
            value: "active",
            label: "Active",
            icon: CircleCheck as any,
          },
          {
            value: "invited",
            label: "Invited",
            icon: EnvelopeArrowRight as any,
          },
        ],
      },
    ],
    []
  );

  // Active filters state
  const activeFilters = useMemo(() => {
    const filters: { key: string; value: any }[] = [];
    if (status) {
      filters.push({ key: "status", value: status });
    }
    if (roleFilter) {
      filters.push({ key: "role", value: roleFilter });
    }
    return filters;
  }, [status, roleFilter]);

  useKeyboardShortcut("m", () => setShowInviteWorkspaceUserModal(true));

  const columns = useMemo<ColumnDef<WorkspaceUserProps>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        accessorFn: (row) => row.name || row.email,
        minSize: 360,
        size: 870,
        maxSize: 900,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex items-center space-x-3">
              <Avatar image={user.image ?? ""} />
              <div className="flex flex-col">
                <h3 className="text-sm font-medium">
                  {user.name || user.email}
                </h3>
                <p className="text-xs text-neutral-500">
                  {status === "invited"
                    ? `Invited ${timeAgo(user.createdAt)}`
                    : user.email}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        id: "role",
        header: "Role",
        accessorFn: (row) => row.role,
        minSize: 120,
        size: 150,
        maxSize: 200,
        cell: ({ row }) =>
          !row.original.isMachine ? (
            isRefreshing ? (
              <RoleCellSkeleton />
            ) : (
              <RoleCell
                user={row.original}
                isCurrentUser={session?.user?.email === row.original.email}
                isCurrentUserOwner={isCurrentUserOwner}
                organizationId={activeOrganization?.id}
                isRefreshing={isRefreshing}
              />
            )
          ) : null,
      },
      {
        id: "menu",
        header: () => {},
        // enableHiding: false,
        minSize: 80,
        size: 80,
        maxSize: 80,
        cell: ({ row }) =>
          !row.original.isMachine && (
            <RowMenuButton
              row={row}
              isCurrentUserOwner={isCurrentUserOwner}
              organizationId={activeOrganization?.id}
            />
          ),
      },
    ],
    [
      session?.user?.email,
      isCurrentUserOwner,
      status,
      activeOrganization,
      isRefreshing,
    ]
  );

  const { table, ...tableProps } = useTable({
    data: filteredUsers || [],
    columns,
    pagination,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    thClassName: "border-l-0",
    tdClassName: "border-l-0",
    resourceName: (p) =>
      `${status === "invited" ? "invite" : "member"}${p ? "s" : ""}`,
    rowCount: filteredUsers?.length || 0,
    loading: isLoading,
    error: error ? "Failed to load members" : undefined,
  });

  const onSelect = (key: string, value: any) => {
    queryParams({
      set: {
        [key]: value,
      },
    });
  };

  const onRemove = (key: string) => {
    queryParams({
      del: [key, "page"],
    });
  };

  const onRemoveAll = () => {
    queryParams({
      del: ["role", "status", "page"],
    });
  };

  // Loading state - only show full loading on initial load
  if (isLoading) {
    return (
      <PageContent title="Members">
        <PageWidthWrapper className="mb-20 flex flex-col gap-4">
          <div className="flex justify-between gap-3">
            <Filter.Select
              filters={filters}
              activeFilters={activeFilters}
              onSelect={onSelect}
              onRemove={onRemove}
            />
            <SearchBoxPersisted
              placeholder="Search by name or email"
              inputClassName="w-full md:w-[20rem]"
            />
          </div>
          <Filter.List
            filters={filters}
            activeFilters={activeFilters}
            onSelect={onSelect}
            onRemove={onRemove}
            onRemoveAll={onRemoveAll}
          />
          <div
            className={cn(
              "border-border-subtle bg-bg-default relative z-0 rounded-xl border"
              // containerClassName
            )}
          >
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center px-6 justify-between py-4"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className=" flex gap-5">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageWidthWrapper>
      </PageContent>
    );
  }

  return (
    <>
      <InviteWorkspaceUserModal />
      <InviteCodeModal />
      <PageContent
        title="Members"
        controls={
          <>
            <div className="flex space-x-2">
              <Button
                text="Invite member"
                onClick={() => setShowInviteWorkspaceUserModal(true)}
                className="h-9 w-fit"
                shortcut="M"
              />
              <Button
                icon={<LinkIcon className="h-4 w-4 text-neutral-800" />}
                variant="outline"
                onClick={() => setShowInviteCodeModal(true)}
                className="h-9 space-x-0"
              />
            </div>
          </>
        }
      >
        <PageWidthWrapper className="mb-20 flex flex-col gap-4">
          <div className="flex justify-between gap-3">
            <Filter.Select
              filters={filters}
              activeFilters={activeFilters}
              onSelect={onSelect}
              onRemove={onRemove}
            />
            <SearchBoxPersisted
              placeholder="Search by name or email"
              inputClassName="w-full md:w-[20rem]"
            />
          </div>
          <Filter.List
            filters={filters}
            activeFilters={activeFilters}
            onSelect={onSelect}
            onRemove={onRemove}
            onRemoveAll={onRemoveAll}
          />
          <Table {...tableProps} table={table} />
        </PageWidthWrapper>
      </PageContent>
    </>
  );
}

function RoleCell({
  user,
  isCurrentUser,
  isCurrentUserOwner,
  organizationId,
  isRefreshing,
}: {
  user: WorkspaceUserProps;
  isCurrentUser: boolean;
  isCurrentUserOwner: boolean;
  organizationId?: string;
  isRefreshing?: boolean;
}) {
  const [role, setRole] = useState<any>(user.role);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { WorkspaceUserRoleModal, setShowWorkspaceUserRoleModal } =
    useWorkspaceUserRoleModal({
      user: {
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        createdAt: user.createdAt,
        source: null,
        isMachine: false,
        hasPassword: false,
        provider: null,
      },
      role: role as "owner" | "member",
    });

  useEffect(() => {
    setRole(user.role);
  }, [user.role]);

  const isDisabled =
    !isCurrentUserOwner || isCurrentUser || isUpdating || isRefreshing;

  const handleRoleChange = async (newRole: any) => {
    if (!organizationId || !user.id) return;
    setIsUpdating(true);

    try {
      await authClient.organization.updateMemberRole({
        role: newRole,
        memberId: user.id,
        organizationId,
      });
      setRole(newRole);
    } catch (error) {
      console.error("Failed to update member role:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Show skeleton when refreshing
  if (isRefreshing) {
    return <RoleCellSkeleton />;
  }

  return (
    <>
      <WorkspaceUserRoleModal />
      <Select
        value={role}
        disabled={isDisabled}
        onValueChange={(value) => handleRoleChange(value as any)}
      >
        <SelectTrigger
          className={cn(
            "rounded-md border border-neutral-200 text-xs text-neutral-500 focus:border-neutral-600 focus:ring-neutral-600",
            {
              "cursor-not-allowed bg-neutral-100": isDisabled,
            }
          )}
        >
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Roles</SelectLabel>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

function RowMenuButton({
  row,
  isCurrentUserOwner,
  organizationId,
}: {
  row: Row<WorkspaceUserProps>;
  isCurrentUserOwner: boolean;
  organizationId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const user = row.original;
  const searchParams = useSearchParams();
  const isInvite = searchParams.get("status") === "invited";

  const isCurrentUser = session?.user?.email === user.email;

  const handleRemove = async () => {
    if (!organizationId || !user.id) return;

    try {
      if (isInvite) {
        // Handle invitation revocation
        // await revokeInvitation.mutateAsync({
        //   organizationId,
        //   invitationId: user.id,
        // });
      } else {
        const { data, error } = await authClient.organization.removeMember({
          memberIdOrEmail: user.id,
          organizationId,
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  // Only show menu if user is owner OR they're removing themselves
  if (!isCurrentUserOwner && !isCurrentUser) {
    return null;
  }

  return (
    <Popover
      openPopover={isOpen}
      setOpenPopover={setIsOpen}
      content={
        <Command tabIndex={0} loop className="focus:outline-none">
          <Command.List className="w-screen text-sm focus-visible:outline-none sm:w-auto sm:min-w-[200px]">
            <Command.Group className="grid gap-px p-1.5">
              <MenuItem
                icon={UserMinus}
                label={
                  isCurrentUser
                    ? "Leave workspace"
                    : isInvite
                      ? "Revoke invitation"
                      : "Remove member"
                }
                variant="danger"
                onSelect={handleRemove}
              />
            </Command.Group>
          </Command.List>
        </Command>
      }
      align="end"
    >
      <Button
        type="button"
        variant="outline"
        icon={<Dots className="h-4 w-4 shrink-0" />}
      />
    </Popover>
  );
}

function MenuItem({
  icon: IconComp,
  label,
  onSelect,
  variant = "default",
  disabled = false,
}: {
  icon: Icon;
  label: string;
  onSelect: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}) {
  return (
    <Command.Item
      onSelect={disabled ? undefined : onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm",
        variant === "danger"
          ? "text-red-600 hover:bg-red-50"
          : "text-neutral-700 hover:bg-neutral-100",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <IconComp className="size-4 shrink-0" />
      {label}
      {disabled && "..."}
    </Command.Item>
  );
}
