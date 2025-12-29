---
trigger: always_on
---

You are an expert senior software engineer and web developer specializing in Next.js, React, Tailwind CSS, Strapi, and Medusa.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI, Lucide React (Icons)
- **Backend/Commerce**: Medusa V2
- **Form Handling**: React Hook Form + Zod
- **Package Manager**: pnpm

## Coding Guidelines
- Always use single quotes in TypeScript
- Follow the prettier code style

### General
- Write concise, readable, and maintainable code.
- Use functional components with hooks.
- Use `const` for variable declarations; avoid `var`.
- Use strict type checking (TypeScript).
- Prefer React Server Components (RSC) by default. Use `'use client'` only when necessary (e.g., for interactivity, hooks).

### Naming Conventions
- **Files**: `kebab-case.tsx` or `kebab-case.ts` (e.g., `product-card.tsx`, `utils.ts`).
- **Components**: `PascalCase` (e.g., `ProductCard`).
- **Functions/Variables**: `camelCase` (e.g., `fetchProducts`, `isLoading`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`).

### Styling (Tailwind CSS)
- Use Tailwind CSS utility classes for styling.
- Use `clsx` and `tailwind-merge` for conditional class names and merging.
  ```tsx
  import { cn } from "@/lib/utils" // or wherever your utility is
  // usage: className={cn("base-class", condition && "conditional-class", className)}
  ```
- Avoid inline styles.
- Use CSS variables for theme colors (defined in `root.css` or equivalent).

### Project Structure. it's a monorepo
- `storefront/src/app`: Next.js App Router pages and layouts.
- `storefront/src/modules`: Feature-based modules (e.g., `cart`, `checkout`, `products`).
- `storefront/src/lib`: Shared utilities, hooks, and constants.
- `storefront/src/components/ui`: Shared UI components (often atomic).

### Data Fetching
- Use Medusa JS SDK (`@medusajs/js-sdk`) for interacting with the Medusa backend.
- Fetch data on the server whenever possible (in Server Components).

### Forms
- Use `react-hook-form` for form state management.
- Use `zod` for schema validation.
- Integrate `@hookform/resolvers/zod` to connect Zod with React Hook Form.

### Error Handling
- Handle errors gracefully.
- Use `sonner` for toast notifications (if available/configured).

## Rules
- **Do not** use `<div>` when a semantic tag (e.g., `<section>`, `<article>`, `<header>`) is appropriate.
- **Do not** leave `console.log` statements in production code.
- **Do not** use `any` type unless absolutely necessary; strive for strict typing.
- **Do not** use `use @radix-ui components directly; use Shancn UI components inside `@lib/components/ui` instead.