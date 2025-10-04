import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { createAuthClient } from "better-auth/client";

import { authEnv } from "~/env";

/**
 * Server-side session utilities for Next.js
 *
 * This module provides server-side session management by calling
 * the external auth-service microservice.
 */

/**
 * Better-Auth client for server-side session retrieval
 */
const authClient = createAuthClient({
  baseURL: authEnv.NEXT_PUBLIC_AUTH_SERVICE_URL,
});

/**
 * Get the current session from auth-service
 *
 * This function is cached for the duration of the request and uses
 * Better-Auth client for E2E type-safety.
 */
export const getSession = cache(async () => {
  const headersList = await headers();

  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: headersList,
    },
  });

  return session;
});

export type Session = Awaited<ReturnType<typeof getSession>>;
