import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";

import { env } from "../env-expo";

/**
 * Better-Auth client for Expo/React Native configured to use the external auth-service microservice.
 *
 * By default, points to http://localhost:3001 in development.
 * In production, configure AUTH_SERVICE_URL environment variable.
 *
 * Uses Expo SecureStore for secure token storage.
 */
export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_AUTH_SERVICE_URL,
  plugins: [
    expoClient({
      scheme: "expo",
      storagePrefix: "expo",
      storage: SecureStore,
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
