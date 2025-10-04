import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

/**
 * Environment variables for authentication (Expo/React Native)
 *
 * Since authentication is handled by the external auth-service microservice,
 * we only need to know where the service is located.
 *
 * Uses @t3-oss/env-core to support EXPO_PUBLIC_ prefix (vs Next.js's NEXT_PUBLIC_).
 */
/* eslint-disable no-restricted-properties -- Env initialization requires direct process.env access */
export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_AUTH_SERVICE_URL: z.url(),
  },
  runtimeEnv: {
    EXPO_PUBLIC_AUTH_SERVICE_URL: process.env.EXPO_PUBLIC_AUTH_SERVICE_URL,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
/* eslint-enable no-restricted-properties */
