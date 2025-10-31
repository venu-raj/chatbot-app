export const authConfig = {
    baseUrl: "http://localhost:3000",
    productionUrl: process.env.AUTH_PRODUCTION_URL || "https://your-production-domain.com",
    secret: process.env.AUTH_SECRET!,

    // Social providers
    discordClientId: process.env.AUTH_DISCORD_ID!,
    discordClientSecret: process.env.AUTH_DISCORD_SECRET!,
    facebookClientId: process.env.AUTH_FACEBOOK_ID,
    facebookClientSecret: process.env.AUTH_FACEBOOK_SECRET,
    githubClientId: process.env.AUTH_GITHUB_ID,
    githubClientSecret: process.env.AUTH_GITHUB_SECRET,
    googleClientId: process.env.AUTH_GOOGLE_ID!,
    googleClientSecret: process.env.AUTH_GOOGLE_SECRET!,
    microsoftClientId: process.env.AUTH_MICROSOFT_ID!,
    microsoftClientSecret: process.env.AUTH_MICROSOFT_SECRET,
    twitchClientId: process.env.AUTH_TWITCH_ID,
    twitchClientSecret: process.env.AUTH_TWITCH_SECRET,
    twitterClientId: process.env.AUTH_TWITTER_ID,
    twitterClientSecret: process.env.AUTH_TWITTER_SECRET,
    paypalClientId: process.env.AUTH_PAYPAL_ID,
    paypalClientSecret: process.env.AUTH_PAYPAL_SECRET,

    // App settings
    appName: process.env.APP_NAME || "My App",
    cookieDomain: process.env.COOKIE_DOMAIN,
    betterAuthEmail: process.env.BETTER_AUTH_EMAIL,
    testEmail: process.env.TEST_EMAIL,
    adminUserIds: process.env.ADMIN_USER_IDS?.split(',') || [],

    // Stripe
    stripeKey: process.env.STRIPE_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    stripeProPriceId: process.env.STRIPE_PRO_PRICE_ID,
    stripeProAnnualPriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    stripePlusPriceId: process.env.STRIPE_PLUS_PRICE_ID,
    stripePlusAnnualPriceId: process.env.STRIPE_PLUS_ANNUAL_PRICE_ID,
};

//changed