import { createAuthClient } from "better-auth/react";
import {
    organizationClient,
    passkeyClient,
    twoFactorClient,
    adminClient,
    multiSessionClient,
    oneTapClient,
    oidcClient,
    genericOAuthClient,
    deviceAuthorizationClient,
    lastLoginMethodClient,
} from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    plugins: [
        organizationClient(),
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = "/two-factor";
            },
        }),
        passkeyClient(),
        adminClient(),
        multiSessionClient(),
        oneTapClient({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            promptOptions: {
                maxAttempts: 1,
            },
        }),
        oidcClient(),
        genericOAuthClient(),
        stripeClient({
            subscription: true,
        }),
        deviceAuthorizationClient(),
        lastLoginMethodClient(),
    ],
});
export const {
    signUp,
    signIn,
    signOut,
    useSession,
    organization,
    useListOrganizations,
    useActiveOrganization,
    useActiveMember,
    useActiveMemberRole,
} = authClient;

