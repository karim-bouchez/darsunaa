import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

/**
 * Environment variables for Expo app
 *
 * Uses @t3-oss/env-core to support EXPO_PUBLIC_ prefix.
 */
export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_API_URL: z.url(),
    EXPO_PUBLIC_AUTH_SERVICE_URL: z.url(),
  },
  runtimeEnv: {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_AUTH_SERVICE_URL: process.env.EXPO_PUBLIC_AUTH_SERVICE_URL,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
