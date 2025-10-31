import { Link as NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import {
  ContentLinkCard,
  contentHeadingClassName,
  getUtmParams,
} from "./shared";
import { cn } from "@workspace/utils/functions/cn";
import { Grid } from "@workspace/ui/components/marketing/grid";
import { SDKS } from "@workspace/utils/constants/nav";
import { MessageCircle, ShoppingCart, User, Users } from "lucide-react";

const mainLinks = [
  {
    icon: MessageCircle,
    title: "Customer Support",
    description: "24/7 automated customer service solutions",
    href: "/solutions/support",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Boost sales with AI shopping assistants",
    href: "/solutions/ecommerce",
  },
  {
    icon: Users,
    title: "Lead Generation",
    description: "Capture and qualify leads automatically",
    href: "/solutions/leads",
  },
];

export function SolutionsContent({ domain }: { domain: string }) {
  return (
    <div className="grid w-[1020px] grid-cols-4 divide-x divide-neutral-200 dark:divide-white/20">
      <div className="flex h-full flex-col p-4 col-span-3">
        <p className={cn(contentHeadingClassName, "mb-4 ml-2")}>Use case</p>
        <div className="grid grow grid-cols-3 gap-4">
          {mainLinks.map(({ icon: Icon, title, description, href }) => (
            <NavigationMenuLink key={title} asChild>
              <Link
                key={title}
                href={href}
                className={cn(
                  "group relative isolate z-0 flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 px-5 py-4 transition-colors duration-75",
                  "dark:border-white/20 dark:bg-neutral-900"
                )}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <div className="absolute -inset-[25%] -skew-y-12 [mask-image:linear-gradient(225deg,black,transparent_50%)]">
                    <Grid
                      cellSize={46}
                      patternOffset={[0, -14]}
                      className="translate-y-2 text-[#ad1f3288] transition-transform duration-150 ease-out group-hover:translate-y-0"
                    />
                  </div>
                  <div
                    className={cn(
                      "absolute -inset-[10%] opacity-10 blur-[50px] dark:brightness-150",
                      "bg-[conic-gradient(#F35066_0deg,#F35066_117deg,#9071F9_180deg,#5182FC_240deg,#F35066_360deg)]"
                    )}
                  />
                </div>
                <Icon className="relative size-5 text-neutral-700 dark:text-white/60" />
                <div className="relative">
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {title}
                  </span>
                  <p className="mt-2 text-xs text-neutral-500 dark:text-white/60">
                    {description}
                  </p>
                </div>
              </Link>
            </NavigationMenuLink>
          ))}
        </div>
      </div>
      <div className="px-6 py-4">
        <p className={cn(contentHeadingClassName, "mb-2")}>SDKs</p>
        <div className="flex flex-col gap-0.5">
          {SDKS.map(({ icon: Icon, iconClassName, title, href }) => (
            <ContentLinkCard
              key={href}
              className="-mx-2"
              href={href}
              icon={
                <div className="shrink-0 rounded-[10px] border border-neutral-200 bg-white/50 p-1 dark:border-white/20 dark:bg-white/10">
                  <Icon
                    className={cn(
                      "size-5 text-neutral-600 transition-colors dark:text-white/60",
                      iconClassName
                    )}
                  />
                </div>
              }
              title={title}
              showArrow
            />
          ))}
        </div>
      </div>
    </div>
  );
}
