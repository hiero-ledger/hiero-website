# Repository Overview

This guide explains how the migrated Hiero website is structured today.

## Current Stack

- Next.js `16.1.7`
- React `19.2.3`
- TypeScript `5`
- Tailwind CSS `4`
- `pnpm` `10`

The site uses the Next.js App Router under `src/app`.

## Key Directories

| Path | Purpose |
| --- | --- |
| `src/app` | Route files, layouts, metadata, and page entry points. |
| `src/components` | Shared UI building blocks used across pages. |
| `src/lib/posts.ts` | Markdown parsing and content-loading helpers for blog posts and simple pages. |
| `src/data` | Generated or static JSON used by the app. |
| `src/scripts` | Local scripts such as `sync-repo-stats.mjs`, which runs before `pnpm dev` and `pnpm build`. |
| `content/posts` | Blog post markdown files and blog landing-page metadata. |
| `content/hacktoberfest` | Markdown-backed content for the Hacktoberfest page. |
| `content/heroes` | Markdown-backed content for the Heroes page. |
| `public` | Static images and other assets served directly by the site. |
| `docs` | Contributor documentation. |

## Route Model

The current repo uses a few different page patterns.

### Code-First Pages

Most pages are defined directly in `src/app`. For example:

- `src/app/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`

Use this approach when a page needs custom layout, composed components, or data
that is easier to keep in code.

### Simple Markdown-Backed Pages

`/hacktoberfest` and `/heroes` are hybrids:

- the route lives in `src/app/<route>/page.tsx`
- page text comes from `content/<route>/index.md`
- the route renders shared UI with `SimpleContentPage`

Use this pattern when most of the page is editorial content with a small amount
of route-specific UI.

### Blog Posts

Blog posts are loaded from markdown files directly inside `content/posts`.

The post list and post pages are driven by helpers in `src/lib/posts.ts`.

## Current Content Model

The content directory is not fully generic.

- `content/posts/_index.md` is used for blog landing-page metadata.
- `content/posts/*.md` are blog posts.
- `content/hacktoberfest/index.md` and `content/heroes/index.md` are still read.
- `content/_index.md` exists, but the homepage is currently hard-coded in
  `src/app/page.tsx` and does not read that file.

When updating documentation, prefer the current runtime behavior over legacy
Hugo conventions.

## Assets

Store images under `public/`, then reference them with site-rooted paths such
as `/images/example.png`.

Examples:

- `/images/Hiero_v4.png`
- `/images/authors/jane-doe.png`
- `/images/my-post/hero.png`

## Important Constraints

### No Translations

Hiero does not currently support:

- translated content files
- locale routing
- per-language blog variants

Contributors should maintain a single English source of truth unless a
dedicated i18n feature is added later.

### Blog Parser Limitations

The current parser only loads top-level markdown files directly inside
`content/posts`.

Nested directories like `content/posts/some-slug/index.md` are not currently
used by the runtime blog loader.

## Related Guides

- [02-content-folder.md](./02-content-folder.md)
- [03-adding-pages.md](./03-adding-pages.md)
- [blogs.md](./blogs.md)
