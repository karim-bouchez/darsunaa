import { createAuthClient } from "better-auth/react";

import { env } from "@darsunaa/auth/env";

/**
 * Better-Auth client configured to use the external auth-service microservice.
 *
 * By default, points to http://localhost:3001 in development.
 * In production, configure AUTH_SERVICE_URL environment variable.
 */
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_AUTH_SERVICE_URL,
});

export type Session = typeof authClient.$Infer.Session;
