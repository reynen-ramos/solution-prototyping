# Contributing to Solution Prototyping

Thanks for your interest in contributing! This guide will help you get set up and understand how the codebase is organized.

## Prerequisites

- **Node.js** 20+ ([download](https://nodejs.org))
- **npm** 10+
- **Git**

## Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/solution-prototyping.git
cd solution-prototyping

# Install all workspace dependencies
npm install

# Start the dev server
npm run dev

# Open http://localhost:3000
```

## Project Structure

This is an **npm workspaces monorepo** with two packages:

- **`apps/web`** — Next.js frontend (the design tool UI)
- **`packages/templates`** — Handlebars code generation templates

## How to Add a New Service Type

To add a new draggable component (e.g., "Cache" for Redis):

### 1. Define the type and config

**`apps/web/src/types/service-types.ts`**
```typescript
// Add to the ServiceType union
export type ServiceType = '...' | 'cache';

// Add config interface
export interface CacheConfig {
  engine: 'redis' | 'memcached';
  serviceName: string;
  port: number;
}
```

### 2. Add to design types

**`apps/web/src/types/design.ts`**
```typescript
export interface CacheData extends BaseServiceData {
  serviceType: 'cache';
  config: CacheConfig;
}

// Add to ServiceNodeData union
export type ServiceNodeData = ... | CacheData;
```

### 3. Add default config

**`apps/web/src/types/tech-stacks.ts`**
```typescript
case 'cache':
  return { engine: 'redis', serviceName: 'cache', port: 6379 };
```

### 4. Create the node component

**`apps/web/src/components/nodes/CacheNode.tsx`** — Render using `BaseServiceNode`.

### 5. Register the node type

**`apps/web/src/components/nodes/node-types.ts`**
```typescript
import { CacheNode } from './CacheNode';
export const nodeTypes = { ..., 'cache': CacheNode };
```

### 6. Add to palette

**`apps/web/src/components/palette/palette-items.ts`** — Add entry with label, description, icon, category.

### 7. Add default label

**`apps/web/src/stores/designStore.ts`** — Add case to `getDefaultLabel()`.

### 8. Update BaseServiceNode helpers

**`apps/web/src/components/nodes/BaseServiceNode.tsx`** — Add icon, color class, and badge variant for the new type.

## How to Add a Code Generation Template

Templates live in `packages/templates/src/`. Each stack has its own directory.

### 1. Create the template file

**`packages/templates/src/nodejs/api/your-template.ts`**
```typescript
export const template = `
// Handlebars template with {{variables}}
{{#each models}}
// Model: {{name}}
{{/each}}
`;
```

### 2. Import and use in the registry

**`packages/templates/src/index.ts`** — Import the template and add it to the appropriate `generate*Files()` function.

### Available Handlebars Helpers

| Helper | Example | Output |
|--------|---------|--------|
| `eq` | `{{#if (eq a b)}}` | Equality check |
| `lower` | `{{lower name}}` | lowercase |
| `upper` | `{{upper name}}` | UPPERCASE |
| `capitalize` | `{{capitalize name}}` | Capitalize |
| `pascalCase` | `{{pascalCase name}}` | PascalCase |
| `camelCase` | `{{camelCase name}}` | camelCase |
| `kebabCase` | `{{kebabCase name}}` | kebab-case |
| `json` | `{{json obj}}` | JSON.stringify |

## Code Style

- TypeScript strict mode throughout
- Functional React components with hooks
- Zustand for state (multiple focused stores, not one god store)
- Tailwind CSS for styling (use existing shadcn/ui components where possible)
- File naming: PascalCase for components, camelCase for utilities

## Pull Requests

1. Fork the repo and create your branch from `master`
2. If you added new functionality, update the README
3. Ensure the build passes: `npm run build`
4. Keep PRs focused — one feature or fix per PR
5. Write a clear PR description explaining what and why

## Questions?

Open an issue or start a discussion on GitHub.
