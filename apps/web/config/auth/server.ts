// import "server-only";

import { cache } from "react";
import { headers } from "next/headers"
import { authConfig, initAuth } from "@workspace/auth"

export const auth = initAuth(authConfig);

export const getSession = cache(async () =>
    auth.api.getSession({ headers: await headers() }),
);