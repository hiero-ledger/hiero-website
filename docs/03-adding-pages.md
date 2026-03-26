# Adding Pages

Use this guide when you want to add or update a page after the Next.js
migration.

## Choose The Right Pattern

There are three common ways to add content in this repo.

### 1. Add A Route-First Page

Use this when the page is mostly custom React UI.

Examples:

- `src/app/page.tsx`
- `src/app/blog/page.tsx`

### 2. Add A Simple Markdown-Backed Page

Use this when the page is mostly editorial copy, but still needs a route file
and maybe one or two custom components.

Examples:

- `src/app/hacktoberfest/page.tsx` with `content/hacktoberfest/index.md`
- `src/app/heroes/page.tsx` with `content/heroes/index.md`

### 3. Add A Blog Post

Use [blogs.md](./blogs.md) for anything under `content/posts`.

## Adding A Route-First Page

1. Create a new route file such as `src/app/about/page.tsx`.
2. Export route metadata.
3. Build the page with existing components or new shared ones under
   `src/components/<ComponentName>/`.
4. Add any new assets to `public/`.
5. If the page should be discoverable from navigation, update
   `src/components/Menu/index.tsx`.

Minimal example:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Hiero.",
};

export default function AboutPage() {
  return <main className="container py-16">About Hiero</main>;
}
```

## Adding A Simple Markdown-Backed Page

This is the best fit for pages that follow the `SimpleContentPage` pattern.

1. Create `content/<slug>/index.md`.
2. Add YAML front matter with `title` and `description`.
3. Create `src/app/<slug>/page.tsx`.
4. Load the markdown with `getSimplePageWithDefaults(...)`.
5. Render it with `SimpleContentPage`.
6. Add route-specific widgets below the markdown if needed.

Example markdown file:

```md
---
title: "About"
description: "Learn more about Hiero."
---

This page is rendered from markdown.
```

Example route file:

```tsx
import type { Metadata } from "next";
import SimpleContentPage from "@/components/SimpleContentPage";
import { getSimplePageWithDefaults } from "../../lib/posts";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Hiero.",
};

const DEFAULTS = {
  title: "About",
  description: "Learn more about Hiero.",
};

export default function AboutPage() {
  const page = getSimplePageWithDefaults("content/about/index.md", DEFAULTS);

  return (
    <SimpleContentPage
      title={page.title}
      description={page.description}
      contentMarkdown={page.contentMarkdown}
    />
  );
}
```

## When To Use Markdown vs Components

Prefer markdown when:

- the page body is mostly prose
- non-developers may edit it later
- the page structure matches `SimpleContentPage`

Prefer components when:

- the layout is custom
- the page needs interactive or dynamic UI
- the content needs richer composition than a single markdown body

If you introduce a new shared component, follow the component structure in
[04-components.md](./04-components.md):

```text
src/components/FaqSection/
├── index.tsx
└── __tests__/
    └── FaqSection.test.tsx
```

## Navigation And Discovery

If the page should appear in the site navigation, update the `menuItems` array
in `src/components/Menu/index.tsx`.

Also consider whether you need to:

- link to the page from existing pages
- add assets under `public/images/...`
- mention the page in contributor docs if it introduces a new workflow

## Markdown Constraints

For markdown-backed pages, remember:

- simple pages currently use YAML front matter
- blog posts use TOML front matter
- raw HTML is not a safe default
- Hugo shortcodes are stripped out

## No Translations

Do not create:

- `src/app/es/...`
- translated copies under `content/`
- language-switcher behavior

Hiero does not currently support translations or locale-aware routing.
