import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { oAuthProxy } from "better-auth/plugins";
import { prisma } from "@workspace/database"; // Adjust import based on your workspace
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
    bearer,
    admin,
    multiSession,
    organization,
    twoFactor,
    oneTap,
    openAPI,
    customSession,
    deviceAuthorization,
    lastLoginMethod,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { stripe } from "@better-auth/stripe";
import { Stripe } from "stripe";
import { nextCookies } from "better-auth/next-js";

import { authConfig } from "./config";

// Define a simplified return type to avoid complex inference
type AuthInstance = ReturnType<typeof betterAuth>;

export function initAuth(options: typeof authConfig): AuthInstance {
    const from = options.betterAuthEmail || "delivered@resend.dev";
    const to = options.testEmail || "";

    const config: BetterAuthOptions = {
        appName: options.appName,
        database: prismaAdapter(prisma, {
            provider: "postgresql",
        }),
        baseURL: options.baseUrl,
        secret: options.secret,

        // Email verification
        emailVerification: {
            async sendVerificationEmail({ user, url }) {
                // Implement your email service here
                console.log("Verification email would be sent to:", user.email, url);
                try {
                    console.log(`Sending verification email to ${user.email}: ${url}`);
                } catch (error) {
                    console.error("Failed to send verification email:", error);
                }
            },
        },

        // Account linking
        account: {
            accountLinking: {
                trustedProviders: ["google", "github", "demo-app"],
            },
        },

        // Email and password
        emailAndPassword: {
            enabled: true,
            async sendResetPassword({ user, url }) {
                // Implement your email service here
                console.log("Reset password email would be sent to:", user.email, url);
                try {
                    console.log(`Sending reset password email to ${user.email}: ${url}`);
                } catch (error) {
                    console.error("Failed to send reset password email:", error);
                }
            },
        },

        // Social providers - only include those with credentials
        socialProviders: {
            ...(options.discordClientId && options.discordClientSecret ? {
                discord: {
                    clientId: options.discordClientId,
                    clientSecret: options.discordClientSecret,
                    redirectURI: `${options.productionUrl}/api/auth/callback/discord`,
                }
            } : {}),
            ...(options.facebookClientId && options.facebookClientSecret ? {
                facebook: {
                    clientId: options.facebookClientId,
                    clientSecret: options.facebookClientSecret,
                }
            } : {}),
            ...(options.githubClientId && options.githubClientSecret ? {
                github: {
                    clientId: options.githubClientId,
                    clientSecret: options.githubClientSecret,

                }
            } : {}),

            google: {
                clientId: options.googleClientId!,
                clientSecret: options.googleClientSecret!,
            },
            ...(options.microsoftClientId && options.microsoftClientSecret ? {
                microsoft: {
                    clientId: options.microsoftClientId,
                    clientSecret: options.microsoftClientSecret,
                }
            } : {}),
            ...(options.twitchClientId && options.twitchClientSecret ? {
                twitch: {
                    clientId: options.twitchClientId,
                    clientSecret: options.twitchClientSecret,
                }
            } : {}),
            ...(options.twitterClientId && options.twitterClientSecret ? {
                twitter: {
                    clientId: options.twitterClientId,
                    clientSecret: options.twitterClientSecret,
                }
            } : {}),
            ...(options.paypalClientId && options.paypalClientSecret ? {
                paypal: {
                    clientId: options.paypalClientId,
                    clientSecret: options.paypalClientSecret,
                }
            } : {}),
        },

        // Plugins
        plugins: [
            oAuthProxy({
                currentURL: options.baseUrl,
                productionURL: options.productionUrl,
            }),
            expo(),
            organization({
                async sendInvitationEmail(data) {
                    // Implement your email service here
                    console.log("Invitation email would be sent to:", data.email);
                    try {
                        console.log(`Sending invitation to ${data.email} for organization ${data.organization.name}`);
                    } catch (error) {
                        console.error("Failed to send invitation email:", error);
                    }
                },
            }),
            twoFactor({
                otpOptions: {
                    async sendOTP({ user, otp }) {
                        // Implement your email service here
                        console.log("OTP would be sent to:", user.email, otp);
                        try {
                            console.log(`Sending OTP to ${user.email}: ${otp}`);
                        } catch (error) {
                            console.error("Failed to send OTP:", error);
                        }
                    },
                },
            }),
            passkey(),
            openAPI(),
            bearer(),
            admin({
                adminUserIds: options.adminUserIds || [],
            }),
            multiSession(),
            nextCookies(),
            oneTap(),
            customSession(async (session) => {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        dd: "test",
                    },
                };
            }),
            ...(options.stripeKey ? [stripe({
                stripeClient: new Stripe(options.stripeKey),
                stripeWebhookSecret: options.stripeWebhookSecret!,
                subscription: {
                    enabled: true,
                    allowReTrialsForDifferentPlans: true,
                    plans: () => {
                        const PRO_PRICE_ID = {
                            default: options.stripeProPriceId || "price_1RoxnRHmTADgihIt4y8c0lVE",
                            annual: options.stripeProAnnualPriceId || "price_1RoxnoHmTADgihItzFvVP8KT",
                        };
                        const PLUS_PRICE_ID = {
                            default: options.stripePlusPriceId || "price_1RoxnJHmTADgihIthZTLmrPn",
                            annual: options.stripePlusAnnualPriceId || "price_1Roxo5HmTADgihItEbJu5llL",
                        };

                        return [
                            {
                                name: "Plus",
                                priceId: PLUS_PRICE_ID.default,
                                annualDiscountPriceId: PLUS_PRICE_ID.annual,
                                freeTrial: {
                                    days: 7,
                                },
                            },
                            {
                                name: "Pro",
                                priceId: PRO_PRICE_ID.default,
                                annualDiscountPriceId: PRO_PRICE_ID.annual,
                                freeTrial: {
                                    days: 7,
                                },
                            },
                        ];
                    },
                },
            })] : []),
            deviceAuthorization({
                expiresIn: "3min",
                interval: "5s",
            }),
            lastLoginMethod(),
        ],
        trustedOrigins: ["expo://", "exp://"],
        advanced: {
            crossSubDomainCookies: {
                enabled: process.env.NODE_ENV === "production",
                domain: options.cookieDomain,
            },
        },
    };

    return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
export { authConfig };