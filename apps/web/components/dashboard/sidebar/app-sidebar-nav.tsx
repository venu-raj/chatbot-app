"use client";

import {
  Bell,
  Brush,
  ConnectedDots,
  ConnectedDots4,
  CubeSettings,
  CursorRays,
  DiamondTurnRight,
  Discount,
  Folder,
  Gauge6,
  Gear2,
  Gift,
  Globe,
  Hyperlink,
  InvoiceDollar,
  Key,
  LifeRing,
  LinesY,
  LinesY as LinesYStatic,
  MoneyBills2,
  Msgs,
  Receipt2,
  ShieldCheck,
  Sliders,
  Tag,
  User,
  UserCheck,
  Users,
  Users6,
  Webhook,
} from "@workspace/utils/icons/index";
import {
  BookOpen,
  Brain,
  Bug,
  Compass,
  Database,
  Download,
  GitBranch,
  GraduationCap,
  Layers,
  List,
  MessageCircle,
  MessageSquare,
  Palette,
  Plug,
  Rocket,
  Share2,
  Shield,
  Shuffle,
  Smile,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { SidebarNav, SidebarNavAreas, SidebarNavGroups } from "./sidebar-nav";
import { WorkspaceDropdown } from "./workspace-dropdown";
import { Session } from "@/config/auth/auth-types";

type SidebarNavData = {
  slug: string;
  agentId: string;
  pathname: string;
  queryString: string;
  defaultProgramId?: string;
  session?: Session | null;
  showNews?: boolean;
  pendingPayoutsCount?: number;
  applicationsCount?: number;
  submittedBountiesCount?: number;
  unreadMessagesCount?: number;
  showConversionGuides?: boolean;
};

const FIVE_YEARS_SECONDS = 60 * 60 * 24 * 365 * 5;

const NAV_GROUPS: SidebarNavGroups<SidebarNavData> = ({
  slug,
  pathname,
  defaultProgramId,
}) => [
  {
    name: "Dashboard",
    description: "Manage your dashboard.",
    learnMoreHref: "https://dub.co/dashboard",
    icon: Compass,
    href: slug ? `/${slug}/overview` : "",
    active:
      !!slug &&
      pathname.startsWith(`/${slug}`) &&
      !pathname.startsWith(`/${slug}/program`) &&
      !pathname.startsWith(`/${slug}/settings`),

    // onClick: () => {
    //   document.cookie = `dub_product:${slug}=dashboard;path=/;max-age=${FIVE_YEARS_SECONDS}`;
    // },
  },
  {
    name: "Chat",
    description:
      "Kickstart viral product-led growth with powerful, branded referral and affiliate programs.",
    learnMoreHref: "https://dub.co/partners",
    icon: ConnectedDots4,
    href: slug ? `/${slug}/program` : "/program",
    active: pathname.startsWith(`/${slug}/program`),
    // popup: DubPartnersPopup,

    onClick: defaultProgramId
      ? () => {
          document.cookie = `dub_product:${slug}=program;path=/;max-age=${FIVE_YEARS_SECONDS}`;
        }
      : undefined,
  },
];

const NAV_AREAS: SidebarNavAreas<SidebarNavData> = {
  // Top-level
  default: ({ slug, pathname, queryString, showNews }) => ({
    title: "Short dashboard",
    showNews,
    direction: "left",
    content: [
      {
        items: [
          {
            name: "Overview",
            icon: Hyperlink,
            // href: "/",
            href: `/${slug}/overview`,
            // href: `/${slug}/dashboard${pathname === `/${slug}/overview` ? "" : queryString}`,
            // href: `/dashboard${pathname === `/${slug}/dashboard` ? "" : queryString}`,
            isActive: (pathname: string, href: string) => {
              const basePath = href.split("?")[0];

              // Exact match for the base dashboard page
              if (pathname === basePath) return true;

              return false;
            },
          },
          {
            name: "Domains",
            icon: Globe,
            href: `/${slug}/dashboard/domains`,
          },
        ],
      },
      {
        name: "Insights",
        items: [
          {
            name: "Analytics",
            icon: LinesY,
            href: `/${slug}/analytics${pathname === `/${slug}/analytics` ? "" : queryString}`,
          },
          {
            name: "Events",
            icon: CursorRays,
            href: `/${slug}/events${pathname === `/${slug}/events` ? "" : queryString}`,
          },
          {
            name: "Customers",
            icon: User,
            href: `/${slug}/customers`,
          },
        ],
      },
      {
        name: "Library",
        items: [
          {
            name: "Agents",
            icon: Folder,
            href: `/${slug}/agents`,
          },
          {
            name: "Tags",
            icon: Tag,
            href: `/${slug}/dashboard/tags`,
          },
          {
            name: "UTM Templates",
            icon: DiamondTurnRight,
            href: `/${slug}/dashboard/utm`,
          },
        ],
      },
    ],
  }),

  // Program
  program: ({
    slug,
    showNews,
    pendingPayoutsCount,
    applicationsCount,
    submittedBountiesCount,
    unreadMessagesCount,
  }) => ({
    title: "Partner Program",
    showNews,
    direction: "left",
    content: [
      {
        items: [
          {
            name: "Overview",
            icon: Gauge6,
            href: `/${slug}/program`,
            exact: true,
          },
          {
            name: "Payouts",
            icon: MoneyBills2,
            href: `/${slug}/program/payouts?status=pending&sortBy=amount`,
            badge: pendingPayoutsCount
              ? pendingPayoutsCount > 99
                ? "99+"
                : pendingPayoutsCount
              : undefined,
          },
          {
            name: "Messages",
            icon: Msgs,
            href: `/${slug}/program/messages`,
            badge: unreadMessagesCount
              ? unreadMessagesCount > 99
                ? "99+"
                : unreadMessagesCount
              : "New",
          },
        ],
      },
      {
        name: "Partners",
        items: [
          {
            name: "All Partners",
            icon: Users,
            href: `/${slug}/program/partners`,
            isActive: (pathname: string, href: string) =>
              pathname.startsWith(href) &&
              ["applications"].every(
                (p) => !pathname.startsWith(`${href}/${p}`)
              ),
          },
          {
            name: "Applications",
            icon: UserCheck,
            href: `/${slug}/program/partners/applications`,
            badge: applicationsCount
              ? applicationsCount > 99
                ? "99+"
                : applicationsCount
              : undefined,
          },
          {
            name: "Groups",
            icon: Users6,
            href: `/${slug}/program/groups`,
          },
        ],
      },
      {
        name: "Insights",
        items: [
          {
            name: "Analytics",
            icon: LinesYStatic,
            href: `/${slug}/program/analytics`,
          },
          {
            name: "Commissions",
            icon: InvoiceDollar,
            href: `/${slug}/program/commissions`,
          },
          // {
          //   name: "Fraud & Risk",
          //   icon: ShieldKeyhole,
          //   href: `/${slug}/program/fraud`,
          // },
        ],
      },
      {
        name: "Engagement",
        items: [
          {
            name: "Bounties",
            icon: Trophy,
            href: `/${slug}/program/bounties`,
            badge: submittedBountiesCount
              ? submittedBountiesCount > 99
                ? "99+"
                : submittedBountiesCount
              : "New",
          },
          {
            name: "Resources",
            icon: LifeRing,
            href: `/${slug}/program/resources`,
          },
        ],
      },
      {
        name: "Configuration",
        items: [
          {
            name: "Rewards",
            icon: Gift,
            href: `/${slug}/program/groups/default/rewards`,
            arrow: true,
            isActive: () => false,
          },
          {
            name: "Discounts",
            icon: Discount,
            href: `/${slug}/program/groups/default/discounts`,
            arrow: true,
            isActive: () => false,
          },
          {
            name: "Link Settings",
            icon: Sliders,
            href: `/${slug}/program/groups/default/dashboard`,
            arrow: true,
            isActive: () => false,
          },
          {
            name: "Branding",
            icon: Brush,
            href: `/${slug}/program/branding`,
          },
        ],
      },
    ],
  }),

  // Workspace settings
  workspaceSettings: ({ slug }) => ({
    title: "Settings",
    backHref: `/${slug}/overview`,
    content: [
      {
        name: "Workspace",
        items: [
          {
            name: "General",
            icon: Gear2,
            href: `/${slug}/settings`,
            exact: true,
          },
          {
            name: "Billing",
            icon: Receipt2,
            href: `/${slug}/settings/billing`,
          },
          {
            name: "Domains",
            icon: Globe,
            href: `/${slug}/settings/domains`,
          },
          {
            name: "Members",
            icon: Users6,
            href: `/${slug}/settings/members`,
          },
          {
            name: "Integrations",
            icon: ConnectedDots,
            href: `/${slug}/settings/integrations`,
          },
          {
            name: "Analytics",
            icon: LinesY,
            href: `/${slug}/settings/analytics`,
          },
          {
            name: "Security",
            icon: ShieldCheck,
            href: `/${slug}/settings/security`,
          },
        ],
      },
      {
        name: "Developer",
        items: [
          {
            name: "API Keys",
            icon: Key,
            href: `/${slug}/settings/tokens`,
          },
          {
            name: "OAuth Apps",
            icon: CubeSettings,
            href: `/${slug}/settings/oauth-apps`,
          },
          {
            name: "Webhooks",
            icon: Webhook,
            href: `/${slug}/settings/webhooks`,
          },
        ],
      },
      {
        name: "Account",
        items: [
          {
            name: "Notifications",
            icon: Bell,
            href: `/${slug}/settings/notifications`,
          },
        ],
      },
    ],
  }),

  // User settings
  userSettings: ({ slug }) => ({
    title: "Settings",
    backHref: `/${slug}`,
    hideSwitcherIcons: true,
    content: [
      {
        name: "Account",
        items: [
          {
            name: "General",
            icon: Gear2,
            href: "/account/settings",
            exact: true,
          },
          {
            name: "Security",
            icon: ShieldCheck,
            href: "/account/settings/security",
          },
          {
            name: "Referrals",
            icon: Gift,
            href: "/account/settings/referrals",
          },
        ],
      },
    ],
  }),

  // Chatbot settings
  chatbotSettings: ({ slug, agentId }) => ({
    title: "Chatbot Settings",
    backHref: `/dashboard/agents`,
    content: [
      // PHASE 1: Getting Started (Most users start here)
      {
        name: "Setup",
        items: [
          {
            name: "Quick Start",
            icon: Rocket,
            href: `/${slug}/agents/${agentId}/setup/quick-start`,
            badge: "Start here",
          },
          {
            name: "Training Data",
            icon: BookOpen,
            href: `/${slug}/agents/${agentId}/setup/training`,
          },
          {
            name: "Personality",
            icon: Smile,
            href: `/${slug}/agents/${agentId}/setup/personality`,
          },
        ],
      },

      // PHASE 2: Customization (After basic setup)
      {
        name: "Customize",
        items: [
          {
            name: "Appearance",
            icon: Palette,
            href: `/${slug}/agents/${agentId}/customize/appearance`,
          },
          {
            name: "Responses",
            icon: MessageCircle,
            href: `/${slug}/agents/${agentId}/customize/responses`,
          },
          {
            name: "Languages",
            icon: Globe,
            href: `/${slug}/agents/${agentId}/customize/languages`,
          },
        ],
      },

      // PHASE 3: Connect (Making it work everywhere)
      {
        name: "Connect",
        items: [
          {
            name: "Channels",
            icon: Share2,
            href: `/${slug}/agents/${agentId}/connect/channels`,
            description: "Website, WhatsApp, Instagram...",
          },
          {
            name: "Integrations",
            icon: Plug,
            href: `/${slug}/agents/${agentId}/connect/integrations`,
            description: "CRM, Email, Support tools...",
          },
        ],
      },

      // PHASE 4: Advanced (Collapsed by default or shown after initial setup)
      {
        name: "Advanced",
        collapsible: true,
        defaultCollapsed: true,
        items: [
          {
            name: "Workflows",
            icon: GitBranch,
            href: `/${slug}/agents/${agentId}/advanced/workflows`,
          },
          {
            name: "AI Settings",
            icon: Brain,
            href: `/${slug}/agents/${agentId}/advanced/ai`,
          },
          {
            name: "Human Handoff",
            icon: Users,
            href: `/${slug}/agents/${agentId}/advanced/handoff`,
          },
          {
            name: "Security",
            icon: Shield,
            href: `/${slug}/agents/${agentId}/advanced/security`,
          },
        ],
      },
    ],
  }),
};

export function AppSidebarNav({
  toolContent,
  newsContent,
}: {
  toolContent?: ReactNode;
  newsContent?: ReactNode;
}) {
  const { slug } = useParams() as { slug?: string };
  const { agentId } = useParams() as { agentId?: string };
  const pathname = usePathname();

  console.log({ slug, pathname, agentId });

  const currentArea = useMemo(() => {
    return pathname.startsWith("/account/settings")
      ? "userSettings"
      : pathname.startsWith(`/${slug}/settings`)
        ? "workspaceSettings"
        : pathname.includes("/program/campaigns/") ||
            pathname.includes("/program/messages/") ||
            pathname.endsWith("/program/payouts/success")
          ? null
          : pathname.startsWith(`/${slug}/program`)
            ? "program"
            : "default";
  }, [slug, pathname]);

  return (
    <SidebarNav
      groups={NAV_GROUPS}
      areas={NAV_AREAS}
      currentArea={currentArea}
      data={{
        slug: slug || "",
        agentId: agentId || "",
        pathname,
        queryString: "",
        showNews: pathname.startsWith(`/${slug}/program`) ? false : true,
        defaultProgramId: "222",
        pendingPayoutsCount: 92,
        applicationsCount: 22,
        submittedBountiesCount: 32,
        unreadMessagesCount: 12,
        showConversionGuides: false,
      }}
      toolContent={toolContent ?? null}
      switcher={<WorkspaceDropdown />}
    />
  );
}
