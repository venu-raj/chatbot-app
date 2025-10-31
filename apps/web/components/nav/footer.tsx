"use client";

import { MaxWidthWrapper } from "@workspace/ui/components/global/max-width-wrapper";
import {
  COMPARE_PAGES,
  FEATURES_LIST,
  LEGAL_PAGES,
} from "@workspace/utils/constants/nav";
import { cn } from "@workspace/utils/functions/cn";
import { ChevronDown, Github, Linkedin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Popover } from "@workspace/ui/components/popover";

const socials = [
  {
    name: "Twitter",
    icon: Twitter,
    href: "https://twitter.com/chatbotco",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/company/chatbotco",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/chatbotco/chatbot",
  },
  {
    name: "YouTube",
    icon: Youtube,
    href: "https://www.youtube.com/@chatbotco",
  },
];

const navigation = {
  product: [
    ...FEATURES_LIST.filter(({ title }) => title !== "Integrations").map(
      ({ id, title, href }) => ({
        id,
        name: title,
        href,
      })
    ),
    { id: null, name: "Enterprise", href: "/enterprise" },
  ],
  solutions: [
    { name: "Customer Support", href: "/solutions/support" },
    { name: "E-commerce", href: "/solutions/ecommerce" },
    { name: "Lead Generation", href: "/solutions/leads" },
  ],
  resources: [
    { name: "Docs", href: "/docs/introduction" },
    { name: "Help Center", href: "/help" },
    { name: "Integrations", href: "/integrations" },
    { name: "Pricing", href: "/pricing" },
    {
      name: "Affiliates",
      href: "https://partners.chatbot.co/chatbot",
      target: "_blank",
    },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Changelog", href: "/changelog" },
    { name: "Customers", href: "/customers" },
    { name: "Brand", href: "/brand" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
  ],
  compare: COMPARE_PAGES.map(({ name, slug }) => ({
    name,
    href: `/compare/${slug}`,
    product: "chatbot",
  })).concat(
    ["Intercom", "Drift", "Zendesk", "Freshchat"].map((name) => ({
      name,
      href: `/help/article/migrating-from-${name.toLowerCase()}`,
      product: "chatbot",
    }))
  ),
};

const linkListHeaderClassName =
  "text-sm font-medium text-neutral-900 dark:text-white";
const linkListClassName = "flex flex-col mt-2.5 gap-3.5";
const linkListItemClassName =
  "flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors duration-75";

export function Footer({
  staticDomain,
  className,
}: {
  staticDomain?: string;
  className?: string;
}) {
  let { domain = "dub.co" } = useParams() as { domain: string };
  if (staticDomain) {
    domain = staticDomain;
  }

  const [openPopover, setOpenPopover] = useState(false);

  return (
    <MaxWidthWrapper
      className={cn(
        "relative z-10 overflow-hidden border border-b-0 border-neutral-200 py-16 backdrop-blur-lg md:rounded-t-2xl",
        className
      )}
    >
      <footer>
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="flex flex-col gap-6">
            <div className="grow">
              <Link href={"/"} className="block max-w-fit">
                <span className="sr-only">
                  {process.env.NEXT_PUBLIC_APP_NAME} Logo
                </span>
                <div className="h-8 text-neutral-800">LOGO</div>
                {/* <NavWordmark className="h-8 text-neutral-800" /> */}
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {socials.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-full p-1"
                >
                  <span className="sr-only">{name}</span>
                  <Icon className="size-4 text-neutral-900 dark:text-white transition-colors duration-75 group-hover:text-neutral-600" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 xl:col-span-2 xl:mt-0 text-neutral-900 dark:text-white">
            <div className="md:grid md:grid-cols-2">
              <div className="grid gap-8">
                <div>
                  <h3 className={linkListHeaderClassName}>Product</h3>
                  <ul role="list" className={linkListClassName}>
                    {navigation.product.map((item) => (
                      <li key={item.id}>
                        <Link href={"/"} className={linkListItemClassName}>
                          {/* {item.id && (
                            <DubProductIcon product={item.id as DubProduct} />
                          )} */}
                          <span className="text-neutral-900 dark:text-white/45 hover:dark:text-white">
                            {item.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className={linkListHeaderClassName}>Solutions</h3>
                  <ul role="list" className={linkListClassName}>
                    {navigation.solutions.map((item) => (
                      <li key={item.name}>
                        <Link href={"/"} className={linkListItemClassName}>
                          <span className="text-neutral-900 dark:text-white/45 hover:dark:text-white">
                            {item.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className={linkListHeaderClassName}>Resources</h3>
                <ul role="list" className={linkListClassName}>
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={"/"}
                        target={item.target}
                        className={cn(linkListItemClassName, "gap-1")}
                      >
                        <span className="text-neutral-900 dark:text-white/45 hover:dark:text-white">
                          {item.name}
                        </span>
                        {/* {item.target && <ReferredVia className="size-3.5" />} */}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2">
              <div className="grid gap-8">
                <div>
                  <h3 className={linkListHeaderClassName}>Company</h3>
                  <ul role="list" className={linkListClassName}>
                    {navigation.company.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={"/"}
                          className={cn(linkListItemClassName, "gap-1")}
                        >
                          <span className="text-neutral-900 dark:text-white/45 hover:dark:text-white">
                            {item.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                    <li className="-mt-1">
                      <Popover
                        content={
                          <div className="flex w-screen flex-col gap-5 p-4 text-sm focus-visible:outline-none sm:w-auto sm:min-w-[200px]">
                            {LEGAL_PAGES.map((page) => (
                              <Link
                                key={page.name}
                                href={`/${page.slug}`}
                                className={cn(
                                  // menuItemVariants({ variant: "default" }),
                                  linkListItemClassName,
                                  "justify-start font-normal"
                                )}
                              >
                                {page.name}
                              </Link>
                            ))}
                          </div>
                        }
                        openPopover={openPopover}
                        setOpenPopover={setOpenPopover}
                      >
                        <button className={linkListItemClassName}>
                          Legal
                          <ChevronDown className="size-3.5" />
                        </button>
                      </Popover>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-10 md:mt-0">
                <h3 className={linkListHeaderClassName}>Compare</h3>
                <ul role="list" className={linkListClassName}>
                  {navigation.compare.map((item) => (
                    <li key={item.href}>
                      <Link href={"/"} className={linkListItemClassName}>
                        {/* <DubProductIcon product={item.product as DubProduct} /> */}
                        <span className="text-neutral-900 dark:text-white/45 hover:dark:text-white">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row (status, SOC2, copyright) */}
        <div className="mt-12 grid grid-cols-1 items-center gap-8 sm:grid-cols-3">
          {/* <DubStatusBadge /> */}
          <div>badge</div>
          <Link href={"/"} className="flex sm:justify-center">
            <Image
              src="https://assets.dub.co/misc/soc2.svg"
              alt="AICPA SOC 2 Type II Certified"
              width={63}
              height={32}
              className="h-8 transition-[filter] duration-75 hover:brightness-90"
            />
          </Link>
          <p className="text-xs text-neutral-500 sm:text-right">
            © {new Date().getFullYear()} Dub Technologies, Inc.
          </p>
        </div>
      </footer>
    </MaxWidthWrapper>
  );
}
