# Dinou Starter App

This project was bootstrapped with [`create-dinou`](https://github.com/roggc/dinou).

It is a full-stack **React 19** application powered by **Dinou v7**, built around a Zero-Fork 3-Pass AOT dual-bundle architecture, native React Server Components (RSC), W3C Web Streams, compile-time type-safe routing, layered segmentation, and universal "Deploy Everywhere" portability.

---

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see your application.

> **Port collision handling:** If port `3000` is already in use, Dinou automatically prompts an interactive port selector to launch on the next available port (e.g. `3001`, `3002`).

Start editing by modifying `src/page.tsx`. Dinou serves dev bundles via an in-memory Virtual File System (VFS) with sub-20ms Fast Refresh.

---

## 📂 Project Structure

Dinou uses a **file-system based router** with compile-time type safety. Your directory structure defines your URL paths:

```text
.
├── public/                  # Static assets served at root URL (favicon, images, manifest, robots.txt)
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── site.webmanifest
├── src/
│   ├── components/          # Shared React components (Client & Server)
│   ├── layout.tsx           # Root layout (persists across navigations, zero-remount)
│   ├── layout_functions.ts  # (Optional) Independent layout data fetching & caching
│   ├── page.tsx             # Home page route (/)
│   ├── error.tsx            # (Optional) Server Component error boundary page
│   └── ...                  # Nested and dynamic routes (e.g. blog/[slug]/page.tsx)
├── .dinou/                  # Build outputs, engines & generated route types (.dinou/types/routes.d.ts)
├── package.json
├── tsconfig.json
└── README.md
```

### Static Assets (`public/`)
Any file placed inside `public/` (e.g. `public/favicon.ico`, `public/images/logo.png`) is served directly at the root URL path (`/favicon.ico`, `/images/logo.png`) across all deployment targets and static exports.

### Routing Examples
- `src/page.tsx` → `/`
- `src/about/page.tsx` → `/about`
- `src/blog/[slug]/page.tsx` → `/blog/:slug` (`{ slug: string }`)
- `src/docs/[...slug]/page.tsx` → `/docs/*` (`{ slug: string[] }`)

---

## 🔒 Type-Safe Routing (Level 1 & Level 2)

Dinou v7 scans your `src/` directory to generate compile-time route declarations in `.dinou/types/routes.d.ts` with **zero runtime overhead**:

### Level 1: Outward Navigation
`<Link>` and `useRouter()` autocomplete and validate application routes, catching typos during compilation:

```tsx
import { Link, useRouter } from "dinou";

export default function Nav() {
  const router = useRouter();

  return (
    <nav>
      {/* Autocomplete valid routes; TypeScript errors on invalid paths */}
      <Link href="/about">About Us</Link>
      
      {/* Dynamic route interpolation */}
      <Link href={`/blog/${slug}` as const}>Read Post</Link>

      <button onClick={() => router.push("/dashboard")}>Dashboard</button>
    </nav>
  );
}
```

### Level 2: Inward Consumption
Pages, layouts, and error components use strongly-typed generics for parameters:

```tsx
// src/blog/[slug]/page.tsx
import type { PageProps, RouteParams } from "dinou";

export async function getProps(params: RouteParams<"/blog/[slug]">) {
  // params.slug is strongly typed as string
  return { post: await fetchPost(params.slug) };
}

export default function BlogPost({ params, post }: PageProps<"/blog/[slug]">) {
  return <article><h1>{post.title}</h1></article>;
}
```

---

## 🛠️ Scripts & Commands

Dinou is **bundler-agnostic**, supporting **Esbuild** (default), **Rollup**, and **Webpack** with 100% feature parity.

### Development
```bash
npm run dev              # Default: Esbuild with in-memory VFS
npm run dev:rollup       # Development with Rollup
npm run dev:webpack      # Development with Webpack
```

### Production Build & Start (Node.js)
```bash
npm run build                # Compile for Node.js production (default: Esbuild)
npm start                    # Start production Node.js server

npm run build:node:rollup    # Compile for Node.js with Rollup
npm run start:node:rollup    # Start Rollup build on Node.js

npm run build:node:webpack   # Compile for Node.js with Webpack
npm run start:node:webpack   # Start Webpack build on Node.js
```

### Static Site Generation (SSG Export)
Pre-renders all static pages and RSC payloads to pure static files in `dist/`:

```bash
npm run export-static
# Or via CLI:
# npx dinou export-static:rollup
# npx dinou export-static:webpack
```

### Universal Targets ("Deploy Everywhere")
Dinou CLI commands compile to clean standalone targets in `.dinou/`:

- **Cloudflare Workers (Wrangler + KV):**
  ```bash
  npx dinou build:cloudflare
  ```
- **Deno / Deno Deploy:**
  ```bash
  npx dinou build:deno
  npx dinou start:deno
  # Or compile a standalone single binary:
  npx dinou build:deno:compile
  ```
- **Bun:**
  ```bash
  npx dinou build:bun
  npx dinou start:bun
  # Or compile a single self-contained binary:
  npx dinou build:bun:compile
  ```

### Ejecting Framework Core
```bash
npm run eject
```
Copies the internal compiler and server orchestrator into `./dinou`, replacing high-level CLI commands with raw, fully customizable scripts.

---

## ⚡ Key Features in Dinou v7

- **Zero-Fork 3-Pass AOT Engine:** Eliminates multi-process `child_process.fork()` isolation. Produces a dual-bundle AOT pipeline (`rsc-engine.mjs` with `react-server` condition and `ssr-engine.mjs` with standard conditions), achieving an **82% memory reduction (~22MB idle)** and zero IPC latency.
- **Native React 19 & Web Streams:** Built from the ground up for React 19 Server Components and streaming SSR using standard W3C Web Streams (`renderToReadableStream`).
- **Deploy Everywhere:** Built strictly on W3C Web Standards (`Request`, `Response`, `Headers`, `ReadableStream`). Runs on Node.js, Bun, Deno, Cloudflare Workers, Netlify Functions, or pure SSG with zero vendor lock-in.
- **Layered Segmentation & Micro-ISR:**
  - **Horizontal Segmentation:** Decoupled layouts and pages. Parent layouts persist across client navigations with zero remounts (preserving video/audio playback, form inputs, and scroll positions).
  - **Independent Layout Lifecycles:** Layouts can define their own data-fetching and revalidation via `layout_functions.ts`.
  - **Vertical Segmentation (`<DinouCacheSlot>`):** Micro-cache high-frequency components independently without invalidating the parent page.
  - **Partial Prerendering (PPR):** Streams the static shell immediately (0ms TTFB) and streams dynamic Suspense holes as promises resolve.
- **Simplified Single Source of Truth Caching:**
  - `export const revalidate = 60;` strictly in **seconds** (`false` for SSG, `0` for dynamic SSR, `N` for ISR).
  - Granular server invalidations: `revalidatePage(path)`, `revalidatePath(path)`, and `revalidateTag(tag)`.
  - Client router cache with `<Link fresh>` and `router.refresh()`.
- **Direct `getProps`:** Return props directly without legacy `{ page: ... }` wrapping.
- **Server Functions & Actions:** Progressive enhancement and native React 19 RPC server functions using `"use server"`.
- **Resilient Error Boundaries:**
  - Server Component error page (`src/error.tsx`).
  - Two-level boundary isolation (`SlotErrorBoundary` isolates page crashes without breaking the layout; `InnerErrorBoundary` catches root crashes).
  - **Production Security Contract:** Error stacks are automatically masked (`error.stack = undefined`) in production.
- **Universal Middleware (`onRequest`):** Clean W3C middleware hook in `dinou.config.js`.

---

## ☁️ Deployment Guide

### Node.js (Docker, VPS, PM2)
```bash
npm run build
node .dinou/node/server.mjs
```

### Cloudflare Workers
```bash
npx dinou build:cloudflare
npx wrangler deploy
```

### Bun Standalone Binary
```bash
npx dinou build:bun:compile
./my-app
```

### Static Hosting (GitHub Pages, AWS S3, Nginx)
```bash
npm run export-static
# Deploy contents of dist/
```

---

## 📚 Learn More

- [Dinou Documentation](https://dinou.dev) - Official guides, tutorials, and API reference.
- [Dinou GitHub Repository](https://github.com/roggc/dinou) - Star, contribute, or open issues.
