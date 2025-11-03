"use client";

import { createContext, PropsWithChildren, SVGProps, useId } from "react";
import { ProductContent } from "./content/product-content";
import {
  FEATURES_LIST,
  RESOURCES,
  SOLUTIONS,
} from "@workspace/utils/constants/nav";
import { SolutionsContent } from "./content/solutions-content";
import { ResourcesContent } from "./content/resources-content";
import { cn } from "@workspace/utils/functions/cn";
import { useScroll } from "@workspace/utils/hooks/use-scroll";
import { useParams, usePathname } from "next/navigation";
import { MaxWidthWrapper } from "@workspace/ui/components/global/max-width-wrapper";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { LayoutGroup } from "motion/react";
import { useListOrganizations, useSession } from "@/config/auth/client";
import { buttonVariants } from "@workspace/ui/components/button";

export type NavTheme = "light" | "dark";

export const NavContext = createContext<{ theme: NavTheme }>({
  theme: "light",
});

export const navItems = [
  {
    name: "Product",
    content: ProductContent,
    childItems: FEATURES_LIST,
    segments: [
      "/links",
      "/analytics",
      "/partners",
      "/integrations",
      "/compare",
      "/features",
    ],
  },
  {
    name: "Solutions",
    content: SolutionsContent,
    childItems: SOLUTIONS,
    segments: ["/solutions", "/sdks"],
  },
  {
    name: "Resources",
    content: ResourcesContent,
    childItems: RESOURCES,
    segments: [
      "/help",
      "/docs",
      "/about",
      "/careers",
      "/brand",
      "/blog",
      "/changelog",
      "/contact",
    ],
  },
  {
    name: "Enterprise",
    href: "/enterprise",
    segments: ["/enterprise"],
  },
  {
    name: "Customers",
    href: "/customers",
    segments: ["/customers"],
  },
  {
    name: "Pricing",
    href: "/pricing",
    segments: ["/pricing"],
  },
];

const navItemClassName = cn(
  "relative group/item flex items-center rounded-md px-4 py-2 text-sm rounded-lg font-medium text-neutral-700 hover:text-neutral-900 transition-colors",
  "dark:text-white/90 dark:hover:text-white",
  "hover:bg-neutral-900/5 dark:hover:bg-white/10",
  "data-[active=true]:bg-neutral-900/5 dark:data-[active=true]:bg-white/10",

  // Hide active state when another item is hovered
  "group-has-[:hover]:data-[active=true]:[&:not(:hover)]:bg-transparent"
);

export function Nav({
  theme = "light",
  staticDomain,
  maxWidthWrapperClassName,
}: {
  theme?: NavTheme;
  staticDomain?: string;
  maxWidthWrapperClassName?: string;
}) {
  let { domain = "dub.co" } = useParams() as { domain: string };
  if (staticDomain) {
    domain = staticDomain;
  }
  const { data: user, isPending } = useSession();
  const { data } = useListOrganizations();

  console.log(data);

  const layoutGroupId = useId();

  const scrolled = useScroll(40);
  const pathname = usePathname();

  return (
    <NavContext.Provider value={{ theme }}>
      <LayoutGroup id={layoutGroupId}>
        <div
          className={cn(
            `sticky inset-x-0 top-0 z-30 w-full transition-all`,
            theme === "dark" && "dark"
          )}
        >
          {/* Scrolled background */}
          <div
            className={cn(
              "absolute inset-0 block border-b border-transparent transition-all dark:bg-black",
              scrolled && "border-border/60 bg-background/40 backdrop-blur-md"
            )}
          />
          <MaxWidthWrapper className={cn("relative", maxWidthWrapperClassName)}>
            <div className="flex h-14 items-center justify-between">
              <div className="grow basis-0">
                <Link className="block w-fit py-2 pr-2" href={"/"}>
                  <div>test</div>
                </Link>
              </div>
              <NavigationMenuPrimitive.Root
                delayDuration={0}
                className="relative hidden lg:block"
              >
                <NavigationMenuPrimitive.List className="group relative z-0 flex">
                  {navItems.map(
                    ({ name, href, segments, content: Content }) => {
                      const isActive = segments.some((segment) =>
                        pathname?.startsWith(segment)
                      );
                      return (
                        <NavigationMenuPrimitive.Item key={name}>
                          <WithTrigger trigger={!!Content}>
                            {href !== undefined ? (
                              <Link
                                id={`nav-${href}`}
                                href={href}
                                className={navItemClassName}
                                data-active={isActive}
                              >
                                {name}
                              </Link>
                            ) : (
                              <button
                                className={navItemClassName}
                                data-active={isActive}
                              >
                                {name}
                                <AnimatedChevron className="ml-1.5 size-2.5 text-neutral-700" />
                              </button>
                            )}
                          </WithTrigger>

                          {Content && (
                            <NavigationMenuPrimitive.Content className="data-[motion=from-start]:animate-enter-from-left data-[motion=from-end]:animate-enter-from-right data-[motion=to-start]:animate-exit-to-left data-[motion=to-end]:animate-exit-to-right absolute left-0 top-0">
                              <Content domain={domain} />
                            </NavigationMenuPrimitive.Content>
                          )}
                        </NavigationMenuPrimitive.Item>
                      );
                    }
                  )}
                </NavigationMenuPrimitive.List>

                <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2">
                  <NavigationMenuPrimitive.Viewport
                    className={cn(
                      "relative flex origin-[top_center] justify-start overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-md dark:border-white/[0.15] dark:bg-black",
                      "data-[state=closed]:animate-scale-out-content data-[state=open]:animate-scale-in-content",
                      "h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] transition-[width,height]"
                    )}
                  />
                </div>
              </NavigationMenuPrimitive.Root>

              <div className="hidden grow basis-0 justify-end gap-2 lg:flex">
                {user && Object.keys(user).length > 0 ? (
                  <Link
                    href={"/dashboard/overview"}
                    className={cn(
                      buttonVariants({ variant: "primary" }),
                      "flex h-8 items-center rounded-lg border px-4 text-sm",
                      "text-white",
                      "dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-50 dark:hover:ring-white/10"
                    )}
                  >
                    Dashboard
                  </Link>
                ) : !isPending ? (
                  <>
                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "flex h-8 items-center rounded-lg bg-transparent border px-4 text-sm",
                        "dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-neutral-900",
                        "relative" // Add relative positioning for loading state
                      )}
                    >
                      <span className="flex items-center justify-center">
                        Log in
                      </span>
                    </Link>
                    <Link
                      href="/register"
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "flex h-8 items-center rounded-lg border px-4 text-sm",
                        "dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-50 dark:hover:ring-white/10",
                        "relative" // Add relative positioning for loading state
                      )}
                    >
                      <span className="flex items-center justify-center">
                        Sign up
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-20 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-8 w-20 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </LayoutGroup>
    </NavContext.Provider>
  );
}

function AnimatedChevron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      fill="none"
      viewBox="0 0 9 9"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.278 3.389 4.5 6.167 1.722 3.389"
        className="transition-transform duration-150 [transform-box:view-box] [transform-origin:center] [vector-effect:non-scaling-stroke] group-data-[state=open]/item:-scale-y-100"
      />
    </svg>
  );
}

function WithTrigger({
  trigger,
  children,
}: PropsWithChildren<{ trigger: boolean }>) {
  return trigger ? (
    <NavigationMenuPrimitive.Trigger asChild>
      {children}
    </NavigationMenuPrimitive.Trigger>
  ) : (
    children
  );
}
