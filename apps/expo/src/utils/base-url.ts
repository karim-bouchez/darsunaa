import { env } from "~/env";

/**
 * Get base URL for tRPC API (Next.js backend)
 *
 * In development: http://YOUR_LOCAL_IP:3000 (e.g., http://192.168.1.10:3000)
 * In production: Your deployed Next.js URL (e.g., https://api.yourdomain.com)
 *
 * Set via EXPO_PUBLIC_API_URL environment variable
 */
export const getBaseUrl = () => {
  const url = env.EXPO_PUBLIC_API_URL;

  if (!url) {
    throw new Error(
      "EXPO_PUBLIC_API_URL is not set. Please configure it in your .env file.\n" +
      "Development example: EXPO_PUBLIC_API_URL=http://192.168.1.10:3000\n" +
      "Production example: EXPO_PUBLIC_API_URL=https://api.yourdomain.com"
    );
  }

  return url;
};

/**
 * Get auth service URL
 *
 * In development: http://YOUR_LOCAL_IP:3001 (e.g., http://192.168.1.10:3001)
 * In production: Your deployed auth-service URL (e.g., https://auth.yourdomain.com)
 *
 * Set via EXPO_PUBLIC_AUTH_SERVICE_URL environment variable
 */
export const getAuthServiceUrl = () => {
  const url = env.EXPO_PUBLIC_AUTH_SERVICE_URL;

  if (!url) {
    throw new Error(
      "EXPO_PUBLIC_AUTH_SERVICE_URL is not set. Please configure it in your .env file.\n" +
      "Development example: EXPO_PUBLIC_AUTH_SERVICE_URL=http://192.168.1.10:3001\n" +
      "Production example: EXPO_PUBLIC_AUTH_SERVICE_URL=https://auth.yourdomain.com"
    );
  }

  return url;
};
