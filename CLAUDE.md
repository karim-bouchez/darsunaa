# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **T3-Turbo monorepo** using Turborepo and pnpm workspaces.

### Authentication Architecture

**IMPORTANT**: This project uses an **external auth-service microservice** for authentication.

- **Location**: `/Users/karim/perso/projects/devndin/auth-service`
- **Port**: 3001 (must be started BEFORE running this application)
- **Responsibility**: All authentication operations (sign-in, sign-up, sessions, OAuth)
- **Database**: User/session tables are in the auth-service database (separate from this app's database)
- **Integration**: This application only contains Better-Auth **clients** (not the server)

### Monorepo Structure

It contains:

```
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ expo
  │   ├─ Expo SDK 53
  │   ├─ React Native using React 19
  │   ├─ Navigation using Expo Router
  │   ├─ Tailwind using NativeWind
  │   └─ Typesafe API calls using tRPC
  └─ next.js
      ├─ Next.js 15
      ├─ React 19
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  │   └─ tRPC v11 router definition
  ├─ auth
  │   └─ Better-Auth clients (connects to external auth-service)
  ├─ db
  │   └─ Typesafe db calls using Drizzle & PostgreSQL (app data only)
  └─ ui
      └─ Start of a UI package for the webapp using shadcn-ui
tooling
  ├─ eslint
  │   └─ shared, fine-grained, eslint presets
  ├─ prettier
  │   └─ shared prettier configuration
  ├─ tailwind
  │   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

**Important architectural notes:**
- The `@darsunaa/api` package is a **production dependency** in Next.js only (the tRPC server runs there)
- Other apps (Expo) include `@darsunaa/api` as a **dev dependency** for type-safety only
- The database uses **PostgreSQL** with the `postgres` driver (postgres.js) - standard Node.js runtime (not edge)
- **Authentication is handled by an external auth-service microservice** - this repo only contains Better-Auth clients
- Application database contains ONLY business data (posts, etc.) - user/session tables are in auth-service

## Common Commands

### Development

**IMPORTANT**: Always start the auth-service FIRST before running any darsunaa apps!

```bash
# 1. Start auth-service (in a separate terminal)
cd /Users/karim/perso/projects/devndin/auth-service
pnpm dev  # Runs on port 3001

# 2. Then start darsunaa apps (run from darsunaa root)
pnpm install  # Install dependencies (first time only)

# Start all apps in watch mode (Next.js + Expo)
pnpm dev

# Start only Next.js app
pnpm dev:next

# Start only Expo app (mobile)
cd apps/expo && pnpm dev

# Run mobile apps
pnpm android    # Android
pnpm ios        # iOS
```

### Database (Drizzle ORM)

```bash
# Push schema changes to database
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

### Authentication Service

**CRITICAL:** The auth-service must be running before starting darsunaa apps!

```bash
# Start auth-service (in separate terminal)
cd /Users/karim/perso/projects/devndin/auth-service
pnpm dev  # Port 3001
```

**Environment variables required:**
- `NEXT_PUBLIC_AUTH_SERVICE_URL`: http://localhost:3001 (Next.js uses localhost)
- `EXPO_PUBLIC_AUTH_SERVICE_URL`: http://YOUR_LOCAL_IP:3001 (Expo needs your IP address)
- `EXPO_PUBLIC_API_URL`: http://YOUR_LOCAL_IP:3000 (for tRPC API from Expo)

**How it works:**
- Auth-service runs as a separate microservice on port 3001
- All authentication operations are handled by auth-service
- This app only contains Better-Auth **clients** that connect to auth-service
- User/session tables are in auth-service database (separate from app database)
- **Expo apps require your local IP address** instead of `localhost` to access services on your dev machine

### Code Quality

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint           # Check for issues
pnpm lint:fix       # Auto-fix issues
pnpm lint:ws        # Check workspace dependencies with sherif

# Formatting
pnpm format         # Check formatting
pnpm format:fix     # Auto-fix formatting
```

### Building

```bash
# Build all packages and apps
pnpm build
```

### Adding UI Components

```bash
# Add shadcn-ui components interactively
pnpm ui-add
```

### Creating New Packages

```bash
# Generate a new package with Turbo generator
pnpm turbo gen init
```

## Environment Variables

Create a `.env` file at the **root** of the monorepo (use `.env.example` as template):

```bash
# Application database (business data only - NOT auth tables)
POSTGRES_URL="postgres://username:password@localhost:5432/database_name"

# Auth service URL - Next.js uses localhost
NEXT_PUBLIC_AUTH_SERVICE_URL="http://localhost:3001"

# Auth service URL - Expo uses your local IP (find with ifconfig/ipconfig)
EXPO_PUBLIC_AUTH_SERVICE_URL="http://192.168.1.10:3001"

# Next.js API URL - Expo only (replace with your local IP)
EXPO_PUBLIC_API_URL="http://192.168.1.10:3000"
```

**Important notes:**
- **Expo requires your local IP address** (not `localhost`) to access services on your dev machine
- Find your IP: `ifconfig | grep "inet " | grep -v 127.0.0.1` (Mac/Linux) or `ipconfig` (Windows)
- Auth-service has its own database and environment variables (see auth-service documentation)
- OAuth providers (Discord, Google, etc.) are configured in auth-service, not here

## OAuth with Expo

OAuth configuration is handled entirely by the **auth-service microservice**.

### Development
- Expo app connects to auth-service on your local network (port 3001)
- OAuth providers must be configured in auth-service (see auth-service docs)
- Make sure auth-service is running and accessible

### Production
- Deploy auth-service with OAuth configured
- Update `NEXT_PUBLIC_AUTH_SERVICE_URL` and `EXPO_PUBLIC_AUTH_SERVICE_URL` to point to production auth-service
- Auth-service supports OAuth proxy for mobile - see auth-service documentation

## Workspace Package Naming

This template uses `@darsunaa` as a placeholder namespace. To rename:

```bash
# Find and replace @darsunaa with your organization/project name
# Example: @darsunaa -> @my-company or @project-name
```

## Turborepo Configuration

Key Turbo tasks (see `turbo.json`):

- **`dev`**: Watch mode, no cache, runs all dev servers
- **`build`**: Builds packages in dependency order
- **`lint`**: Requires `^build` to complete first
- **`typecheck`**: Requires `^build` to complete first
- **`db:push`**: Interactive, no cache
- **`db:studio`**: Persistent, no cache

## Initial Setup Workflow

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Push database schema (application tables only):**
   ```bash
   pnpm db:push
   ```

4. **Start auth-service (in separate terminal):**
   ```bash
   cd /Users/karim/perso/projects/devndin/auth-service
   pnpm dev  # Port 3001
   ```

5. **Start development (from darsunaa root):**
   ```bash
   pnpm dev
   ```

## Mobile Development Notes

### iOS Simulator
- Requires XCode and XCommand Line Tools
- If you just installed/updated XCode, **manually launch the simulator once** before using `pnpm dev`
- Change `apps/expo/package.json` dev script to: `"dev": "expo start --ios"`

### Android Emulator
- Requires Android Studio tools
- Change `apps/expo/package.json` dev script to: `"dev": "expo start --android"`

## Deployment

### Prerequisites
**Deploy auth-service FIRST** before deploying darsunaa apps!

### Auth-Service Deployment
1. Deploy auth-service to your hosting provider (Vercel, Railway, etc.)
2. Note the production URL (e.g., https://auth.yourdomain.com)
3. Configure OAuth providers in auth-service

### Next.js (Vercel)
1. Deploy from `apps/nextjs` directory
2. Set environment variables:
   - `POSTGRES_URL`: Application database URL
   - `NEXT_PUBLIC_AUTH_SERVICE_URL`: Production auth-service URL
3. Vercel's zero-config should handle the rest

### Expo (App Stores)
1. Update environment variables for production:
   - `EXPO_PUBLIC_AUTH_SERVICE_URL`: Production auth-service URL
2. Update `getBaseUrl()` in `apps/expo/src/utils/base-url.ts` for tRPC API (Next.js URL)
3. Use EAS Build: `eas build --platform ios --profile production`
4. Submit to stores: `eas submit --platform ios --latest`

See full deployment guide in README.md.


---

- remove all dead code