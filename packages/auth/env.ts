import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

/**
 * Environment variables for authentication (Next.js only)
 *
 * Since authentication is handled by the external auth-service microservice,
 * we only need to know where the service is located.
 *
 * Note: For Expo, use direct process.env.EXPO_PUBLIC_* access in expo-client.ts
 * since @t3-oss/env-nextjs only supports NEXT_PUBLIC_ prefix for client vars.
 */
export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_AUTH_SERVICE_URL: z.url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
