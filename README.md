# Dinou Starter App

This project was bootstrapped with [`create-dinou`](https://github.com/roggc/dinou).

It is a full-stack **React 19** application powered by **Dinou**, built around a 0-Fork Dual-Bundle AOT architecture, native React Server Components (RSC), W3C Web Streams, end-to-end type-safe routing, 3D layered caching, and universal "Deploy Everywhere" portability with reversible `eject` / `uneject`.

---

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your application.

> **Port collision handling:** If port `3000` is already in use, Dinou automatically prompts an interactive port selector to launch on the next available port (e.g. `3001`, `3002`).

Start editing by modifying `src/page.tsx`. Dinou serves dev bundles via an in-memory Virtual File System (VFS) with fast HMR, live `.env*` / `tsconfig.json` / `dinou.config.*` reloading, and automatic route-type generation.

---

## 📂 Project Structure

Dinou uses a **file-system router** under `src/` with compile-time type safety. Only folders containing a `page.*` file become URL routes:

```text
.
├── public/                  # Unhashed static assets served at root URL (favicon, robots.txt, manifest.json, .well-known/*)
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── site.webmanifest
├── src/
│   ├── components/          # Shared React components (no leading "_" needed)
│   ├── layout.tsx           # Root layout (persists across navigations, zero remounts)
│   ├── layout_functions.ts  # (Optional) Layout data fetching, caching & PPR config
│   ├── page.tsx             # Home page route (/)
│   ├── page_functions.ts    # (Optional) Page data fetching, revalidation & static paths
│   ├── error.tsx            # (Optional) Scoped error boundary
│   ├── not_found.tsx        # (Optional) Scoped 404 boundary
│   └── ...                  # Nested, dynamic, group & @slot routes (e.g. blog/[slug]/page.tsx)
├── .dinou/                  # Build outputs, generated types (.dinou/types/routes.d.ts) & contextual "./dinou" modules
├── dinou-env.d.ts           # Ambient asset & environment TypeScript declarations
├── dinou.config.ts          # (Optional) Plugins, onRequest middleware, storage, PPR/ISG & compiler config
├── package.json
├── tsconfig.json
└── README.md
```

### Static Assets (`public/`)
Any file placed inside `public/` (e.g. `public/favicon.ico`, `public/manifest.json`, `public/images/logo.png`) is served directly at the root URL path (`/favicon.ico`, `/manifest.json`, `/images/logo.png`) across all runtimes and static exports.

### Routing Examples
- `src/page.tsx` → `/`
- `src/about/page.tsx` → `/about`
- `src/blog/[slug]/page.tsx` → `/blog/:slug` (`{ slug: string }`)
- `src/shop/[[category]]/page.tsx` → `/shop` or `/shop/:category` (`{ category?: string }`)
- `src/docs/[...slug]/page.tsx` → `/docs/*` (`{ slug: string[] }`)
- `src/files/[[...path]]/page.tsx` → `/files` or `/files/*` (`{ path: string[] }`)
- `src/(marketing)/pricing/page.tsx` → `/pricing` (route group omitted from URL)
- `src/dashboard/@analytics/page.tsx` → parallel slot passed as `analytics` prop into `src/dashboard/layout.tsx`
- `src/_archived/` → underscore-prefixed folders are **completely excluded** from routing, bundlers, and Server Functions (use clean names like `src/components/`, `src/lib/`, `src/plugins/` for active code).

---

## 🔒 End-to-End Type-Safe Routing

Dinou scans `src/` automatically in dev and production builds (or manually via `npx dinou typegen`), generating `.dinou/types/routes.d.ts` and route-contextual `.dinou/routes/<dir>/dinou.{js,d.ts}` modules with **zero runtime overhead**:

### Outward Navigation (`<Link>` & `useRouter`)
`<Link>` and `useRouter()` autocomplete and validate static routes, dynamic `[param]` patterns with typed `params`, and relative targets:

```tsx
import { Link, useRouter } from "dinou";

export default function Nav({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <nav>
      {/* Autocomplete valid routes; TypeScript catches typos at compile time */}
      <Link href="/about">About Us</Link>

      {/* Validated dynamic parameter interpolation & automatic URL encoding */}
      <Link href="/blog/[slug]" params={{ slug }}>
        Read Post
      </Link>

      <button onClick={() => router.push("/dashboard")}>Dashboard</button>
    </nav>
  );
}
```

### Zero-Boilerplate Contextual `"./dinou"` Imports
Inside any route directory (paired with `"rootDirs": ["src", ".dinou/routes"]` in `tsconfig.json`), import directly from `"./dinou"` to get pre-bound `PageProps`, `LayoutProps` (including sibling `@slot` props), `PageFunctions`, `LayoutFunctions`, `Link`, and `useRouter` with zero repeated route strings:

```tsx
// src/blog/[slug]/page.tsx (Server Component)
import { Link, type PageProps } from "./dinou";

export default async function BlogPost({ params }: PageProps) {
  // params.slug is inferred automatically as string
  const post = await fetchPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Relative navigation validated without passing from="..." */}
      <Link href="comments">Comments</Link>
    </article>
  );
}
```

```ts
// src/blog/[slug]/page_functions.ts
import type { PageFunctions } from "./dinou";

export const revalidate: PageFunctions["revalidate"] = 60; // ISR every 60 seconds
export const getStaticPaths: PageFunctions["getStaticPaths"] = async () => ["hello-world"];
```

---

## 🛠️ Scripts & Commands

Dinou is **bundler-agnostic**, supporting **Esbuild** (default), **Rollup**, and **Webpack** with full feature parity. Pass `-- -u` (or set `DINOU_UNVENDORIZED=true`) to switch from pre-compiled fast vendors to raw `node_modules` for debugging.

### Development & Typegen
```bash
npm run dev              # Default: Esbuild with in-memory VFS
npm run dev:rollup       # Development with Rollup
npm run dev:webpack      # Development with Webpack
npx dinou typegen        # Regenerate route types & contextual "./dinou" modules
```

### Production Build & Start (Node.js)
```bash
npm run build            # Production build + SSG (default: Esbuild)
npm start                # Start production Node.js server (.dinou/node/server.mjs)

# Alternative bundlers:
npx dinou build:node:rollup  && npx dinou start:node:rollup
npx dinou build:node:webpack && npx dinou start:node:webpack
```

### Static Site Generation (Standalone SPA Export)
Pre-renders all static pages and `.rsc` payloads into `out/` (with full client-side `<Link>` SPA navigation and zero server required):

```bash
npm run export-static
# Alternative bundlers:
# npx dinou export-static:rollup
# npx dinou export-static:webpack
```

### Universal Targets ("Deploy Everywhere")
Every target accepts `:esbuild`, `:rollup`, or `:webpack` suffixes:

- **Netlify Functions v2 (AOT Dual-Bundle):**
  ```bash
  npx dinou build:netlify
  ```
- **Cloudflare Workers (Wrangler + Static Assets + KV):**
  ```bash
  npx dinou build:cloudflare
  ```
- **Deno / Deno Deploy:**
  ```bash
  npx dinou build:deno
  npx dinou start:deno
  # Or compile a standalone binary:
  npx dinou build:deno:compile
  ```
- **Bun:**
  ```bash
  npx dinou build:bun
  npx dinou start:bun
  # Or compile a standalone single binary (outputs dist/server):
  npx dinou build:bun:compile
  ```

### Reversible Eject & Uneject
```bash
npm run eject            # Copy framework source into ./dinou for full ownership
npm run uneject          # Transactionally restore node_modules/dinou & remove ./dinou
```

---

## ⚡ Key Features

- **0-Fork Dual-Bundle AOT Engine:** Compiles an in-memory dual-bundle pipeline (`rsc-engine` + `ssr-engine`) with single-execution inline RSC streaming, zero subprocess IPC overhead, and minimal memory footprint.
- **Native React 19 & Web Streams:** Built from the ground up for React 19 Server Components, progressive `<Suspense>` streaming, un-awaited `Promise` props (`use(promise)`), and the React Compiler (`babel-plugin-react-compiler` enabled by default in production).
- **3D Layered Caching & Partial Prerendering:**
  - **Horizontal Segmentation:** Persistent `layout.tsx` shells with independent `layout_functions.ts` caching and zero remounts across navigations.
  - **Vertical Segmentation (`<DinouCacheSlot>`):** Component-level Micro-ISR and targeted client `refreshSlot()`.
  - **Temporal Segmentation (PPR):** Instant static `shell.html` (0ms TTFB) with per-segment `export const ppr = true` and `noDynamic()` opt-outs.
- **Single-Source-of-Truth Caching & Revalidation:**
  - `export const revalidate = 60;` in **seconds** (`false`/omitted = SSG, `0` = Dynamic SSR, `>= 1` = ISR).
  - Surgical invalidation from `"dinou/server"`: `revalidatePage()`, `revalidateLayout()`, `revalidatePath()`, and `revalidateTag()`.
  - Built-in storage adapters: `FileSystemStorage`, `RedisStorage`, `CloudflareKVStorage`, `DenoKVStorage`, and `MemoryStorage`.
- **Server Functions (`"use server"`):** Module-level and inline RPC actions, `<form action>` progressive enhancement, and streamed JSX/Server Component returns.
- **Request Context & Zero-Leak Env Vars:**
  - Synchronous `getContext()` (`req`, `res`, unified multi-runtime `env`, `ctx`) via `AsyncLocalStorage` across Server Components, loaders, Server Functions, and plugins.
  - Full `.env*` hierarchy with dev hot-reload; private secrets stay server-only while `DINOU_PUBLIC_*` inlines safely for Client Components.
- **Universal Styling, Aliases & Assets:** Global CSS, Tailwind CSS v4, CSS Modules across RSC & SSR, full `tsconfig.json` / `jsconfig.json` path aliases, content-hashed `/assets/*`, custom `assetExtensions`, and RFC 9110 `206 Partial Content` media streaming.
- **Web Standards Plugins (`dinou.config.ts`):** AOT-compiled `onRequest(request, context)` middleware & webhooks across all 5 runtimes, plus Node `configureServer` and `setupFiles`.

---

## ☁️ Deployment Quick Reference

### Node.js (Docker, VPS, PM2)
```bash
npm run build
node .dinou/node/server.mjs
```

### Netlify Functions v2 (`netlify.toml`)
```toml
[build]
  command = "npm run build:netlify"
  publish = ".dinou/dist3"

[functions]
  directory = ".dinou/netlify/functions"
  node_bundler = "none"
  included_files = [".dinou/dist2/**"]
```

### Cloudflare Workers (`wrangler.toml`)
```toml
name = "my-dinou-app"
main = ".dinou/cloudflare/worker.js"
compatibility_date = "2026-01-01"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".dinou/cloudflare/assets"
binding = "ASSETS"
run_worker_first = true
html_handling = "none"
```

```bash
npx dinou build:cloudflare
npx wrangler deploy
```

### Standalone Native Binary (Bun / Deno)
```bash
npx dinou build:bun:compile   # or: npx dinou build:node:compile / build:deno:compile
./dist/server
```

### Static Hosting (GitHub Pages, Cloudflare Pages, S3, Nginx)
```bash
npm run export-static
# Deploy contents of out/
```

---

## 📚 Learn More

- [Dinou Documentation](https://dinou.dev) — Official guides, patterns, and API reference.
- [Dinou GitHub Repository](https://github.com/roggc/dinou) — Source code, issues, and releases.
- [LLM Reference](https://dinou.dev/llms.txt) · [Full LLM Reference](https://dinou.dev/llms-full.txt) — Markdown documentation for AI coding assistants.