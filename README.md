# WaterBiller

A full-stack water billing management application built with modern web technologies.

## Overview

WaterBiller is a production-ready monorepo application for managing water billing operations. It features a React-based frontend with server-side rendering and a high-performance Bun-native backend API, all connected through end-to-end type-safe communication.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime and package manager
- **Monorepo**: [Turborepo](https://turborepo.com) - High-performance build system
- **Frontend**: [React Router 7](https://reactrouter.com) - Modern routing with SSR support
- **Backend**: [Elysia.js](https://elysiajs.com) - Fast Bun-native web framework
- **Database**: [PostgreSQL](https://postgresql.org) with [Drizzle ORM](https://orm.drizzle.team)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS framework
- **Type Safety**: [TypeScript 5.9.2](https://www.typescriptlang.org) - End-to-end type safety
- **API Client**: [Eden Treaty](https://elysiajs.com/eden/treaty/overview.html) - Type-safe API consumption

## Project Structure

This Turborepo workspace contains:

### Apps

- [apps/web](apps/web) - React Router 7 frontend with SSR
- [apps/api](apps/api) - Elysia.js backend API running on Bun

### Packages

- [packages/libs](packages/libs) - Shared library with type-safe API client (Eden Treaty)
- [packages/eslint-config](packages/eslint-config) - Shared ESLint configuration
- [packages/typescript-config](packages/typescript-config) - Shared TypeScript configurations

All packages and apps are written in TypeScript.

## Prerequisites

- [Bun](https://bun.sh) v1.3.4 or higher
- [PostgreSQL](https://postgresql.org) database

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment Variables

**API Configuration** ([apps/api/.env](apps/api/.env)):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/waterbiller
```

**Web Configuration** ([apps/web/.env](apps/web/.env)):
```env
VITE_API_URL=http://localhost:3000
```

### 3. Database Setup

```bash
cd apps/api

# Generate migrations from schema
bun run db:generate

# Run migrations
bun run db:migrate

# Or push schema directly to database (dev only)
bun run db:push

# Open Drizzle Studio (database GUI)
bun run db:studio
```

### 4. Start Development Servers

From the root directory:

```bash
# Start all apps in development mode
bun run dev
```

Or start apps individually:

```bash
# Start only the web app
turbo dev --filter=web

# Start only the API
turbo dev --filter=api
```

The web app will be available at http://localhost:5173 and the API at http://localhost:3000.

## Development Commands

### Root Level Commands

```bash
# Development mode (all apps)
bun run dev

# Build all apps and packages
bun run build

# Lint all code
bun run lint

# Type-check all packages
bun run check-types

# Format code
bun run format
```

### API Commands

```bash
cd apps/api

# Development mode with hot reload
bun run dev

# Database management
bun run db:generate    # Generate migrations from schema changes
bun run db:migrate     # Apply migrations to database
bun run db:push        # Push schema directly (dev only)
bun run db:studio      # Open Drizzle Studio GUI
```

### Web Commands

```bash
cd apps/web

# Development server
bun run dev

# Production build
bun run build

# Start production server
bun run start

# Type-check
bun run typecheck
```

## Architecture Highlights

### End-to-End Type Safety

The monorepo architecture enables complete type safety from database to frontend:

1. Database schema is defined with Drizzle ORM
2. API routes use TypeBox for runtime validation
3. API exports its type for the frontend
4. Eden Treaty client provides fully typed API calls in the frontend

Example:
```typescript
import { api } from "@repo/libs"

// Fully typed with autocomplete and type checking
const { data, error } = await api["sign-in"].post({
  email: "user@example.com",
  password: "password"
})
```

### File-Based Routing

React Router 7 automatically generates routes from the [apps/web/src/app/routes/](apps/web/src/app/routes/) directory structure, with support for:

- Server-side rendering
- Data loading
- Meta tags for SEO
- Nested layouts

### Database Management

Drizzle ORM provides type-safe database operations with:

- Schema defined in [apps/api/src/database/schema.ts](apps/api/src/database/schema.ts)
- Automatic TypeScript types from schema
- SQL-like query builder
- Migration generation and management

## Deployment

The project is configured for Vercel deployment:

- **API**: Deploys to Vercel with Bun runtime, automatic migrations on build
- **Web**: Uses React Router's Vercel preset for optimal performance

Each app has its own [vercel.json](apps/api/vercel.json) configuration.

## Package Manager

This project uses **Bun** as the package manager (specified in `package.json` as `"packageManager": "bun@1.3.4"`). Always use `bun` commands instead of npm/yarn/pnpm.

## Useful Links

### Framework Documentation
- [Turborepo Docs](https://turborepo.com/docs)
- [React Router 7 Docs](https://reactrouter.com/dev)
- [Elysia.js Docs](https://elysiajs.com)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Eden Treaty Docs](https://elysiajs.com/eden/treaty/overview.html)

### Turborepo Features
- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)

## License

[Add your license here]
