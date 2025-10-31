import { Link as NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import {
  ContentLinkCard,
  contentHeadingClassName,
  getUtmParams,
} from "./shared";
import { Book, BookA, Dock, HelpCircle } from "lucide-react";
import { cn } from "@workspace/utils/functions/cn";
import { Grid } from "@workspace/ui/components/marketing/grid";
import { RESOURCES } from "@workspace/utils/constants/nav";

const mainLinks = [
  {
    icon: HelpCircle,
    title: "Help Center",
    description: "Answers to your questions",
    thumbnail: "https://assets.dub.co/misc/help-thumbnail.jpg", // TODO: Update
    href: "/help",
  },
  {
    icon: Book,
    title: "Docs",
    description: "Platform documentation",
    thumbnail: "https://assets.dub.co/misc/docs-thumbnail.jpg",
    href: "/docs/introduction",
  },
];

export function ResourcesContent({ domain }: { domain: string }) {
  return (
    <div className="grid w-[1020px] grid-cols-4 divide-x divide-neutral-200 dark:divide-white/20">
      {/* Main Links - 2 columns (1/2 width) */}
      <div className="col-span-2 flex h-full flex-col p-4">
        <p className={cn(contentHeadingClassName, "mb-4 ml-2")}>Explore</p>
        <div className="grid grow grid-cols-2 gap-4">
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
                      className="translate-y-2 text-[#3b82f688] transition-transform duration-150 ease-out group-hover:translate-y-0"
                    />
                  </div>
                  <div
                    className={cn(
                      "absolute -inset-[10%] opacity-10 blur-[50px] dark:brightness-150",
                      "bg-[conic-gradient(#3b82f6_0deg,#3b82f6_117deg,#8b5cf6_180deg,#06b6d4_240deg,#3b82f6_360deg)]"
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

      {/* Company - 1 column (1/4 width) */}
      <div className="px-6 py-4">
        <p className={cn(contentHeadingClassName, "mb-2")}>Company</p>
        <div className="flex flex-col gap-0.5">
          {RESOURCES.filter(({ title }) =>
            ["About", "Careers", "Brand Guidelines", "Contact"].includes(title)
          ).map(({ icon: Icon, title, description, href }) => (
            <ContentLinkCard
              key={href}
              className="-mx-2"
              href={href}
              icon={
                <div className="shrink-0 rounded-md border border-neutral-200 bg-white/50 p-2.5 dark:border-white/20 dark:bg-white/10">
                  <Icon className="size-4 text-neutral-600 transition-colors dark:text-white/60" />
                </div>
              }
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>

      {/* Updates - 1 column (1/4 width) */}
      <div className="px-6 py-4">
        <p className={cn(contentHeadingClassName, "mb-2")}>Updates</p>
        <div className="flex flex-col gap-0.5">
          {RESOURCES.filter(({ title }) =>
            ["Blog", "Changelog"].includes(title)
          ).map(({ icon: Icon, title, description, href }) => (
            <ContentLinkCard
              key={href}
              className="-mx-2"
              href={href}
              icon={
                <div className="shrink-0 rounded-md border border-neutral-200 bg-white/50 p-2.5 dark:border-white/20 dark:bg-white/10">
                  <Icon className="size-4 text-neutral-600 transition-colors dark:text-white/60" />
                </div>
              }
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
