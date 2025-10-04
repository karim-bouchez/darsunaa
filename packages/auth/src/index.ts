/**
 * @darsunaa/auth - Authentication package
 *
 * This package provides Better-Auth client configuration for the darsunaa monorepo.
 * Authentication is handled by an external microservice (auth-service) running on port 3001.
 *
 * The auth-service microservice manages:
 * - User authentication (email/password, OAuth)
 * - Session management
 * - User database
 *
 * This package only provides the client-side integration.
 */

export { authClient, type Session } from "./client";
