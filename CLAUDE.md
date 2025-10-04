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
# Start auth-service (in a separate terminal)
cd /Users/karim/perso/projects/devndin/auth-service
pnpm dev  # Runs on port 3001

pnpm install  # Install dependencies (first time only)

# Start all apps in watch mode (Next.js + Expo)
pnpm dev

# Start only Next.js app
pnpm dev:next

# Run only mobile apps
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

------------------------------------------------------------


# Important Notes for Claude Code

- Always remove code if it is no longer needed
- Always choose the UI component from shadcn-ui if it exists
- Always ensure end-to-end type safety (API, DB, Auth) and don't introduce any `any` types

- When you are done with the changes, make sure you run the "### Code Quality" section above
- At the end of your response, always include a concise git commit message for the changes you made