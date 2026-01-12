# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WaterBiller is a full-stack water billing management application built as a Turborepo monorepo. The application consists of a React Router (v7) frontend and an Elysia.js backend API with PostgreSQL database.

## Monorepo Structure

This is a Turborepo workspace with the following structure:

- **apps/web** - React Router 7 frontend application with SSR
- **apps/api** - Elysia.js backend API (runs on Bun runtime)
- **packages/libs** - Shared library containing type-safe API client (Eden Treaty)
- **packages/eslint-config** - Shared ESLint configuration
- **packages/typescript-config** - Shared TypeScript configurations

## Development Commands

### Root Level (Turborepo)
```bash
# Install dependencies
bun install

# Run all apps in development mode
bun run dev

# Build all apps and packages
bun run build

# Lint all apps and packages
bun run lint

# Type-check all apps and packages
bun run check-types

# Format code
bun run format
```

### Filtering Specific Workspaces
```bash
# Run dev for specific app
turbo dev --filter=web
turbo dev --filter=api

# Build specific app
turbo build --filter=web
```

### API (apps/api)
```bash
cd apps/api

# Run API in development mode with watch
bun run dev

# Database commands (Drizzle ORM)
bun run db:generate    # Generate migrations from schema
bun run db:migrate     # Run migrations
bun run db:push        # Push schema changes directly to DB
bun run db:studio      # Open Drizzle Studio GUI
```

### Web (apps/web)
```bash
cd apps/web

# Run dev server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Type-check
bun run typecheck
```

## Architecture

### Backend API (Elysia.js)

The API uses:
- **Elysia.js** - Fast Bun-native web framework
- **Drizzle ORM** - Type-safe SQL ORM for PostgreSQL
- **TypeBox** - Runtime type validation for API routes
- **bcrypt** - Password hashing

**Key Files:**
- [apps/api/src/index.ts](apps/api/src/index.ts) - Main API entry point with route definitions
- [apps/api/src/database/schema.ts](apps/api/src/database/schema.ts) - Drizzle schema definitions
- [apps/api/src/database/client.ts](apps/api/src/database/client.ts) - Database client configuration
- [apps/api/src/database/models.ts](apps/api/src/database/models.ts) - TypeBox model definitions
- [apps/api/drizzle.config.ts](apps/api/drizzle.config.ts) - Drizzle Kit configuration

The API exports its type (`App`) for consumption by the frontend Eden Treaty client.

### Frontend (React Router 7)

The web app uses:
- **React Router 7** - File-based routing with SSR support
- **TanStack Query** - Server state management
- **Tailwind CSS 4** - Styling with v4 vite plugin
- **shadcn-inspired components** - UI components using Base UI
- **Eden Treaty** - Type-safe API client

**Key Architectural Patterns:**

1. **File-based Routing**: Routes are defined in `apps/web/src/app/routes/` with automatic route generation
2. **Type-safe API Client**: The `@repo/libs` package exports an Eden Treaty client that provides end-to-end type safety from API to frontend
3. **Authentication**: Client-side auth state managed via React Context ([apps/web/src/hooks/useAuth.tsx](apps/web/src/hooks/useAuth.tsx)) with localStorage persistence
4. **Component Organization**:
   - `apps/web/src/app/routes/` - Route components with `meta` exports for SEO
   - `apps/web/src/components/ui/` - Reusable UI components
   - `apps/web/src/components/` - Feature-specific components

### Type-safe API Communication

The monorepo architecture enables end-to-end type safety:

1. API exports its type: `export type App = typeof app` in [apps/api/src/index.ts](apps/api/src/index.ts)
2. The `@repo/libs` package imports this type and creates a Treaty client in [packages/libs/src/eden.ts](packages/libs/src/eden.ts)
3. Frontend imports the typed client: `import { api } from "@repo/libs"`
4. All API calls are fully type-checked with autocomplete

Example usage:
```typescript
const { data, error } = await api["sign-in"].post({
  email: "user@example.com",
  password: "password"
});
// data and error are fully typed based on API response schema
```

### Database Schema

The application uses Drizzle ORM with PostgreSQL. Schema is defined in [apps/api/src/database/schema.ts](apps/api/src/database/schema.ts).

**Current tables:**
- `users` - User accounts with authentication

When modifying the schema:
1. Update `apps/api/src/database/schema.ts`
2. Run `bun run db:generate` to create migration
3. Run `bun run db:migrate` to apply migration

### Environment Variables

**API (.env in apps/api):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/waterbiller
```

**Web (.env in apps/web):**
```
VITE_API_URL=http://localhost:3000
```

The web app's Eden client automatically detects the API URL from `VITE_API_URL` environment variable in both browser and SSR contexts.

## Deployment

The project is configured for Vercel deployment:

- **apps/api**: Uses Bun runtime with automatic migrations on build ([apps/api/vercel.json](apps/api/vercel.json))
- **apps/web**: Builds with React Router's Vercel preset ([apps/web/vercel.json](apps/web/vercel.json))

The React Router config ([apps/web/react-router.config.ts](apps/web/react-router.config.ts)) uses the Vercel preset for optimal deployment.

## Key Technologies

- **Bun**: Primary package manager and runtime (required for API)
- **Turborepo**: Monorepo build system with caching
- **TypeScript 5.9.2**: Used across all packages
- **React 19**: Latest React version
- **React Router 7**: Modern routing with SSR
- **Elysia.js**: Bun-first web framework
- **Drizzle ORM**: Type-safe database toolkit
- **Tailwind CSS 4**: With Vite plugin for JIT compilation

## Package Manager

This project uses **Bun** as the package manager (specified in `package.json` as `"packageManager": "bun@1.3.4"`). Always use `bun` commands, not npm/yarn/pnpm.
