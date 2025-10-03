# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **T3-Turbo monorepo** using Turborepo and pnpm workspaces. It contains:

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
  │   └─ Authentication using better-auth.
  ├─ db
  │   └─ Typesafe db calls using Drizzle & Supabase
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
- The database uses `@vercel/postgres` driver (edge-bound). All pages/routes use `export const runtime = "edge";`
- Authentication is handled by Better-Auth with a shared config in `@darsunaa/auth`

## System Requirements

- **Node.js**: >= 22.19.0
- **pnpm**: >= 10.15.1 (package manager - do NOT use npm or yarn)

## Common Commands

### Development

```bash
# Install dependencies (run from root)
pnpm install

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

### Better-Auth Setup

**CRITICAL:** Before first run, you must generate the Better-Auth schema:

```bash
# Generate auth tables schema (writes to packages/db/src/auth-schema.ts)
pnpm auth:generate
# Equivalent to: pnpm --filter @darsunaa/auth generate

# Then push to database
pnpm db:push
```

**How it works:**
- Config file: `packages/auth/script/auth-cli.ts` (CLI-only config, NOT imported in app code)
- Output: `packages/db/src/auth-schema.ts` (generated Drizzle schema)
- Runtime config: `packages/auth/src/index.ts` (actual auth implementation)

The `script/auth-cli.ts` file is isolated in a separate directory to prevent accidental imports in source code.

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
# PostgreSQL connection (Supabase)
POSTGRES_URL="postgres://postgres.[USERNAME]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?workaround=supabase-pooler.vercel"

# Better-Auth secret (generate with: openssl rand -base64 32)
AUTH_SECRET="your-secret-here"

# Discord OAuth (optional)
AUTH_DISCORD_ID=""
AUTH_DISCORD_SECRET=""

# Auth proxy URL (for Expo OAuth - see below)
AUTH_REDIRECT_PROXY_URL=""
```

## Better-Auth with Expo (OAuth)

To get OAuth working with the Expo app, you have **two options**:

### Option 1: Deploy Auth Proxy (Recommended)

Better-Auth includes an [OAuth proxy plugin](https://www.better-auth.com/docs/plugins/oauth-proxy):
- Deploy the Next.js app to get a stable public URL
- The proxy forwards OAuth requests, handling redirects back to the app
- Works in preview deployments and development
- Solves the issue of changing ports/IPs

### Option 2: Add Local IP to OAuth Provider

Add your local IP (e.g., `http://192.168.x.y:3000`) to your OAuth provider's callback URLs:
- Less reliable (IP changes when switching networks)
- Some providers (e.g., GitHub) only allow one callback URL per app

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
   # Edit .env with your database URL and secrets
   ```

3. **Generate Better-Auth schema:**
   ```bash
   pnpm auth:generate
   ```

4. **Push database schema:**
   ```bash
   pnpm db:push
   ```

5. **Start development:**
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

### Next.js (Vercel)
1. Deploy from `apps/nextjs` directory
2. Set `POSTGRES_URL` and `AUTH_SECRET` environment variables
3. Vercel's zero-config should handle the rest

### Expo (App Stores)
1. Update `getBaseUrl()` in `apps/expo/src/utils/api.tsx` to point to production Next.js URL
2. Use EAS Build: `eas build --platform ios --profile production`
3. Submit to stores: `eas submit --platform ios --latest`

See full deployment guide in README.md.