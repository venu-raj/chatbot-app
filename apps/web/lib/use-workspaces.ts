// lib/use-workspaces.ts
import { useListOrganizations } from "@/config/auth/client";

export default function useWorkspaces() {
  const organizations = useListOrganizations();

  const workspaces = organizations.data?.map(org => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    logo: org.logo || undefined,
  })) || [];

  return {
    workspaces,
    isLoading: organizations.isPending,
    error: organizations.error,
  };
}