# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "TechAssess" - a technical assessment platform. The project was generated using v0.dev and is deployed on Vercel. It's a full-stack React application with TypeScript, Tailwind CSS, and shadcn/ui components.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint (Note: ESLint errors are ignored during builds)

## Package Manager

This project uses **pnpm** as the package manager, not npm or yarn. Always use pnpm commands.

## Architecture & Key Features

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React hooks (useState, useMemo)
- **Theme**: Dark mode support via next-themes
- **Deployment**: Vercel with automatic deployments from v0.dev

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - `assessment/` - Assessment taking interface
  - `pre-assessment/[id]/` - Pre-assessment setup
  - `results/` - Assessment results
- `components/` - Reusable React components
  - `ui/` - shadcn/ui components
  - `advanced-search.tsx` - Complex search functionality
  - `app-sidebar.tsx` - Main navigation sidebar
  - `theme-provider.tsx` - Theme management
- `lib/` - Utility functions and configurations
- `hooks/` - Custom React hooks
- `public/` - Static assets
- `styles/` - Global CSS styles

### Key Components Architecture

1. **Layout System**: Uses SidebarProvider with AppSidebar for consistent navigation
2. **Theme System**: ThemeProvider with dark mode default and system detection
3. **Assessment System**: Complex filtering and search capabilities with real-time updates
4. **Component Library**: Extensive shadcn/ui implementation with custom extensions

### Important Configuration Notes

- **Build Configuration**: ESLint and TypeScript errors are ignored during builds (`ignoreDuringBuilds: true`)
- **Images**: Unoptimized images enabled for flexibility
- **Path Aliases**: Uses `@/*` for root-level imports
- **CSS Variables**: Extensive use of CSS custom properties for theming

### Development Patterns

- All components use TypeScript with strict typing
- Functional components with hooks (no class components)
- Tailwind CSS for styling with custom design tokens
- Component composition over inheritance
- Client-side rendering patterns with "use client" directive where needed

## Key Dependencies

- **UI Framework**: React 19, Next.js 15
- **Styling**: Tailwind CSS with tailwindcss-animate
- **UI Components**: @radix-ui/* primitives, lucide-react icons
- **Forms**: react-hook-form with @hookform/resolvers
- **Utilities**: clsx, tailwind-merge, class-variance-authority
- **Theme**: next-themes for dark/light mode
- **Charts**: recharts for data visualization

## Development Notes

- The project syncs automatically with v0.dev deployments
- Uses pnpm for package management
- Default theme is dark mode
- Sidebar is open by default
- All UI components follow shadcn/ui patterns and conventions

### Strong Types
Always use types and avoid using `any` or `unknown` unless it is strictly necessary.

### Architecture
- Use atomic design for UI components;
- For components, leave the logic in a hook named `hooks/use{ComponentName}.ts`

### Restrictions
- Never write components (.tsx) greater than 150 lines. Always split them into smaller components.

### Filenames
- Create files `with-this-kind-of-case`.