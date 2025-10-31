/**
 * @fileoverview Better Auth CLI Configuration
 *
 * This file is used exclusively by the Better Auth CLI to generate database schemas.
 * DO NOT USE THIS FILE DIRECTLY IN YOUR APPLICATION.
 *
 * This configuration is consumed by the CLI command:
 * `pnpx @better-auth/cli generate --config script/auth-cli.ts --output ../db/src/auth-schema.ts`
 *
 * For actual authentication usage, import from "../src/index.ts" instead.
 */

import { initAuth } from "../src/index";

/**
 * CLI-only authentication configuration for schema generation.
 *
 * @warning This configuration is NOT intended for runtime use.
 * @warning Use the main auth configuration from "../src/index.ts" for your application.
 */
export const auth = initAuth({
    baseUrl: "http://localhost:3000",
    productionUrl: "http://localhost:3000",
    secret: "hellodhdhdhdjd",
    discordClientId: "snsnnss",
    discordClientSecret: "jdjjdjdjdjjjdjjdjd",

    // Add the missing required options with fallbacks
    appName: "My App",
    cookieDomain: "kdkkdjdjjdj",

    // Social providers (optional - only include if you have the credentials)
    ...(process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET && {
        facebookClientId: process.env.AUTH_FACEBOOK_ID,
        facebookClientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET && {
        githubClientId: process.env.AUTH_GITHUB_ID,
        githubClientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && {
        googleClientId: process.env.AUTH_GOOGLE_ID,
        googleClientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    ...(process.env.AUTH_MICROSOFT_ID && process.env.AUTH_MICROSOFT_SECRET && {
        microsoftClientId: process.env.AUTH_MICROSOFT_ID,
        microsoftClientSecret: process.env.AUTH_MICROSOFT_SECRET,
    }),

    // Stripe (optional)
    ...(process.env.STRIPE_KEY && {
        stripeKey: process.env.STRIPE_KEY,
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        stripeProPriceId: process.env.STRIPE_PRO_PRICE_ID,
        stripeProAnnualPriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
        stripePlusPriceId: process.env.STRIPE_PLUS_PRICE_ID,
        stripePlusAnnualPriceId: process.env.STRIPE_PLUS_ANNUAL_PRICE_ID,
    }),

    // Email
    betterAuthEmail: process.env.BETTER_AUTH_EMAIL,
    testEmail: process.env.TEST_EMAIL,

    // Admin
    adminUserIds: process.env.ADMIN_USER_IDS?.split(',') || [],
});