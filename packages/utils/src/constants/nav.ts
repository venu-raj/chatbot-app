import { BarChart3, BookOpen, Brain, Briefcase, Building, Code, GitBranch, Github, HelpCircle, Linkedin, Mail, MessageCircle, Newspaper, Palette, ParkingMeter, Puzzle, ShoppingCart, Twitter, Users, Workflow, Youtube } from "lucide-react";
import { ElementType } from "react";

export type NavItemChild = {
    title: string;
    description?: string;
    href: string;
    icon: ElementType;
    iconClassName?: string;
};

export type NavItemChildren = (
    | NavItemChild
    | { label: string; items: NavItemChild[] }
)[];

export const FEATURES_LIST = [
    {
        id: "builder",
        title: "Flow Builder",
        description: "Visual conversation designer",
        icon: Workflow,
        href: "/builder",
    },
    {
        id: "ai",
        title: "AI Assistant",
        description: "Smart conversational AI",
        icon: Brain,
        href: "/ai",
    },
    {
        id: "analytics",
        title: "AI Analytics",
        description: "Real-time conversation insights",
        icon: BarChart3,
        href: "/analytics",
    },
    {
        id: "api",
        title: "ChatBot API",
        description: "Programmatic chatbot management",
        icon: Code,
        href: "/docs/api-reference/introduction",
    },
    {
        title: "Integrations",
        description: "Connect with your tech stack",
        icon: Puzzle,
        href: "/integrations",
    },
];

export const SDKS = [
    {
        icon: Code,
        iconClassName: "py-0.5 group-hover:text-[#3178C6]",
        title: "Typescript",
        href: "/sdks/typescript",
    },
    {
        icon: Code,
        iconClassName: "group-hover:text-[#3776AB]",
        title: "Python",
        href: "/sdks/python",
    },
    {
        icon: Code,
        iconClassName: "group-hover:text-[#00ADD8]",
        title: "Go",
        href: "/sdks/go",
    },
    {
        icon: Code,
        iconClassName: "group-hover:text-[#CC342D]",
        title: "Ruby",
        href: "/sdks/ruby",
    },
    {
        icon: Code,
        iconClassName: "group-hover:text-[#4F5D95]",
        title: "PHP",
        href: "/sdks/php",
    },
];

export const SOLUTIONS = [
    {
        icon: MessageCircle,
        title: "Customer Support",
        description: "Automate customer service 24/7",
        href: "/solutions/support",
    },
    {
        icon: ShoppingCart,
        title: "E-commerce",
        description: "AI shopping assistants that convert",
        href: "/solutions/ecommerce",
    },
    {
        icon: Users,
        title: "Lead Generation",
        description: "Capture and qualify leads automatically",
        href: "/solutions/leads",
    },
    {
        label: "SDKs",
        items: SDKS,
    },
];

export const RESOURCES = [
    {
        icon: HelpCircle,
        title: "Help Center",
        description: "Answers to your questions",
        href: "/help",
    },
    {
        icon: BookOpen,
        title: "Docs",
        description: "Platform documentation",
        href: "/docs/introduction",
    },
    {
        icon: Building,
        title: "About",
        description: "Company, values, and team",
        href: "/about",
    },
    {
        icon: Briefcase,
        title: "Careers",
        description: "Join our AI-first team",
        href: "/careers",
    },
    {
        icon: Newspaper,
        title: "Blog",
        description: "AI and chatbot insights",
        href: "/blog",
    },
    {
        icon: GitBranch,
        title: "Changelog",
        description: "Releases and updates",
        href: "/changelog",
    },
    {
        icon: Palette,
        title: "Brand Guidelines",
        description: "Logos, wordmark, etc.",
        href: "/brand",
    },
    {
        icon: Mail,
        title: "Contact",
        description: "Reach out to support or sales",
        href: "/contact",
    },
];

export const COMPARE_PAGES = [
    { name: "Intercom", slug: "intercom" },
    { name: "Drift", slug: "drift" },
    { name: "Zendesk", slug: "zendesk" },
    { name: "Freshchat", slug: "freshchat" },
];

export const LEGAL_PAGES = [
    { name: "Affiliate Program Terms", slug: "affiliates" },
    { name: "DPA", slug: "dpa" },
    { name: "Partner Terms", slug: "partners" },
    { name: "Privacy Policy", slug: "privacy" },
    { name: "Report Abuse", slug: "abuse" },
    { name: "SLA", slug: "sla" },
    { name: "Subprocessors", slug: "subprocessors" },
    { name: "Terms of Service", slug: "terms" },
];

export const SOCIAL_LINKS = [
    { name: "X (Twitter)", icon: Twitter, href: "https://x.com/chatbotco" },
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

