import Link from "next/link";
import { PropsWithChildren } from "react";
import Markdown from "react-markdown";
import { Analytics } from "./feature-graphics/analytics";
import { Collaboration } from "./feature-graphics/collaboration";
import { Domains } from "./feature-graphics/domains";
import { Personalization } from "./feature-graphics/personalization";
import { QR } from "./feature-graphics/qr";
import { ExpandingArrow } from "@workspace/utils/icons/index";
import { cn } from "@workspace/utils";

import {
  MessageCircle,
  Brain,
  Workflow,
  Zap,
  Shield,
  Users,
} from "lucide-react";

export function FeaturesSection({}: {}) {
  return (
    <div className="mt-10">
      <div className="mx-auto w-full max-w-xl px-4 text-center">
        <div className="mx-auto flex h-7 w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-4 text-xs text-blue-800">
          Why Choose Our Platform?
        </div>
        <h2 className="font-display mt-2 text-balance text-3xl font-medium text-neutral-900">
          AI-Powered Chatbots for Modern Businesses
        </h2>
        <p className="mt-3 text-pretty text-lg text-neutral-500">
          Build intelligent chatbots that understand context, learn from
          conversations, and deliver exceptional customer experiences across all
          channels.
        </p>
      </div>

      {/* Feature Stats */}
      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-blue-100">
            <Zap className="size-6 text-blue-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-neutral-900">2.5s</div>
          <div className="text-sm text-neutral-500">Avg Response Time</div>
        </div>
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-green-100">
            <Users className="size-6 text-green-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-neutral-900">24/7</div>
          <div className="text-sm text-neutral-500">Customer Support</div>
        </div>
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-purple-100">
            <Brain className="size-6 text-purple-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-neutral-900">95%</div>
          <div className="text-sm text-neutral-500">Accuracy Rate</div>
        </div>
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-orange-100">
            <Shield className="size-6 text-orange-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-neutral-900">99.9%</div>
          <div className="text-sm text-neutral-500">Uptime SLA</div>
        </div>
      </div>

      <div className="mx-auto mt-14 grid w-full max-w-screen-lg grid-cols-1 px-4 sm:grid-cols-2">
        <div className="contents divide-neutral-200 max-sm:divide-y sm:divide-x">
          <FeatureCard
            title="Visual Flow Builder"
            description="Design complex conversation flows with our drag-and-drop builder. No coding required. Create [conditional logic](/help/article/conditional-flows), [multi-language support](/help/article/multi-language), and [dynamic content](/help/article/dynamic-content) with ease."
            linkText="Try the builder"
            href={"/builder"}
            icon={<Workflow className="size-5" />}
          >
            {/* <Builder /> */}
          </FeatureCard>
          <FeatureCard
            title="Multi-Channel Deployment"
            description="Deploy your chatbot across WhatsApp, Messenger, Instagram, and your website simultaneously. [Customize responses](/help/article/channel-customization) for each platform and [maintain context](/help/article/cross-channel-context) across conversations."
            linkText="View channels"
            href={"/channels"}
            icon={<MessageCircle className="size-5" />}
          >
            {/* <Channels /> */}
          </FeatureCard>
        </div>

        <FeatureCard
          className="border-y border-neutral-200 pt-12 sm:col-span-2"
          graphicClassName="sm:h-96"
          title="Advanced AI Analytics"
          description="Gain deep insights into conversation quality, customer satisfaction, and bot performance. Track [sentiment analysis](/help/article/sentiment-tracking), [conversation paths](/help/article/conversation-analytics), and [automation rates](/help/article/automation-metrics)."
          linkText="Explore analytics"
          href={"/analytics"}
          icon={<Brain className="size-5" />}
        >
          <a
            href="https://demo.chatbot.co/analytics"
            target="_blank"
            className="group block size-full"
          >
            <div className="size-full transition-[filter,opacity] duration-300 group-hover:opacity-70 group-hover:blur-[3px]">
              <Analytics />
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex items-center text-sm font-medium text-slate-900">
                View live demo <ExpandingArrow className="size-4" />
              </span>
            </div>
          </a>
        </FeatureCard>

        <div className="contents divide-neutral-200 max-sm:divide-y sm:divide-x [&>*]:border-t [&>*]:border-neutral-200">
          <FeatureCard
            title="Smart AI Assistant"
            description="Leverage advanced AI that understands context and learns from interactions. Features include [natural language processing](/help/article/nlp), [context memory](/help/article/context-memory), [personalized responses](/help/article/personalization), and [continuous learning](/help/article/ai-training)."
            linkText="Learn about AI"
            href={"/ai"}
            icon={<Brain className="size-5" />}
          >
            {/* <AI /> */}
          </FeatureCard>
          <FeatureCard
            title="Enterprise Collaboration"
            description="Work seamlessly with your team. Features include [role-based access](/help/article/team-roles), [approval workflows](/help/article/approval-flows), [SAML SSO](/help/article/saml-sso), and [audit logs](/help/article/audit-logs) for compliance and security."
            linkText="Team features"
            href={"/team"}
            icon={<Users className="size-5" />}
          >
            <Collaboration />
          </FeatureCard>
        </div>

        {/* Additional Feature Row */}
        <div className="contents divide-neutral-200 max-sm:divide-y sm:divide-x [&>*]:border-t [&>*]:border-neutral-200">
          <FeatureCard
            title="Seamless Integrations"
            description="Connect with your existing tools including [CRM systems](/help/article/crm-integration), [help desks](/help/article/help-desk-integration), [payment processors](/help/article/payment-integration), and [custom APIs](/help/article/custom-integrations)."
            linkText="Browse integrations"
            href={"/integrations"}
            icon={<Zap className="size-5" />}
          >
            {/* <Integrations /> */}
          </FeatureCard>
          <FeatureCard
            title="Security & Compliance"
            description="Enterprise-grade security with [data encryption](/help/article/encryption), [GDPR compliance](/help/article/gdpr), [SOC 2 certification](/help/article/soc2), and [custom data retention](/help/article/data-retention) policies."
            linkText="Security docs"
            href={"/security"}
            icon={<Shield className="size-5" />}
          >
            <div className="flex size-full items-center justify-center">
              <div className="text-center">
                <Shield className="mx-auto size-16 text-green-500" />
                <p className="mt-4 text-sm text-neutral-500">
                  Enterprise Security
                </p>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto mt-20 max-w-2xl px-4 text-center">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h3 className="text-2xl font-bold">
            Ready to Transform Your Customer Experience?
          </h3>
          <p className="mt-2 text-blue-100">
            Join thousands of businesses using our AI chatbot platform
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  linkText,
  href,
  children,
  className,
  graphicClassName,
  icon,
}: PropsWithChildren<{
  title: string;
  description: string;
  linkText: string;
  href: string;
  className?: string;
  graphicClassName?: string;
  icon?: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-10 px-4 py-14 sm:px-12",
        className
      )}
    >
      <div
        className={cn(
          "absolute left-1/2 top-1/3 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[50px]",
          "bg-[conic-gradient(from_270deg,#3b82f6,#8b5cf6,transparent,transparent)]"
        )}
      />
      <div
        className={cn(
          "relative h-64 overflow-hidden sm:h-[302px]",
          graphicClassName
        )}
      >
        {children}
      </div>
      <div className="relative flex flex-col">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        </div>
        <Markdown
          components={{
            a: ({ children, href }) => {
              if (!href) return null;
              return (
                <Link href={href} target="_blank">
                  {children}
                </Link>
              );
            },
          }}
          // className="mt-2 text-neutral-500 [&_a]:font-medium [&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-dotted [&_a]:underline-offset-2 hover:[&_a]:text-blue-700"
        >
          {description}
        </Markdown>
        <Link
          href={href}
          className={cn(
            "mt-6 w-fit whitespace-nowrap rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium leading-none text-neutral-900 transition-colors duration-75",
            "outline-none hover:bg-neutral-50 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 active:bg-neutral-100"
          )}
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
