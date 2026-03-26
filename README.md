# Hiero Website

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/hiero-ledger/hiero-website/badge)](https://scorecard.dev/viewer/?uri=github.com/hiero-ledger/hiero-website)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/10697/badge)](https://bestpractices.coreinfrastructure.org/projects/10697)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

This repo contains the source for [hiero.org](https://hiero.org).

## Current Stack

- Next.js `16.1.7`
- React `19.2.3`
- TypeScript `5`
- Tailwind CSS `4`
- `pnpm` for dependency management and scripts

The site uses the App Router under `src/app`, renders blog content from `content/posts`, and serves static assets from `public/`.

## Requirements

- Node.js `20` or newer
- `pnpm` `10` or newer
- Git

## Install Dependencies

```bash
pnpm install
```

Platform-specific setup help:

- Linux: [docs/setup/linux_setup.md](docs/setup/linux_setup.md)
- Windows: [docs/setup/windows_setup.md](docs/setup/windows_setup.md)
- macOS: [docs/setup/Macbook_setup.md](docs/setup/Macbook_setup.md)

## Run Locally

Start the development server:

```bash
pnpm dev
```

The site will be available at `http://localhost:3000`.

`pnpm dev` runs `pnpm sync:repo-stats` first, then starts Next.js in development mode.

## Build and Checks

Lint the codebase:

```bash
pnpm lint
```

Run the unit tests:

```bash
pnpm test
```

Update existing snapshots after an intentional UI change:

```bash
pnpm update-snap
```

Format source files:

```bash
pnpm format
```

Check formatting without changing files:

```bash
pnpm format:check
```

Build the production app:

```bash
pnpm build
```

Run the production build locally:

```bash
pnpm start
```

## Project Docs

- Contributor docs index: [docs/README.md](docs/README.md)
- Local Next.js setup: [docs/nextjs-setup.md](docs/nextjs-setup.md)
- Repo overview: [docs/01-repo-overview.md](docs/01-repo-overview.md)
- Content folder guide: [docs/02-content-folder.md](docs/02-content-folder.md)
- Adding pages: [docs/03-adding-pages.md](docs/03-adding-pages.md)
- Components guide: [docs/04-components.md](docs/04-components.md)
- Contributor workflow: [docs/workflow.md](docs/workflow.md)
- Blog writing guide: [docs/blogs.md](docs/blogs.md)
- First contribution checklist: [docs/05-first-contribution-checklist.md](docs/05-first-contribution-checklist.md)
- Testing and quality checks: [docs/06-testing-and-quality-checks.md](docs/06-testing-and-quality-checks.md)
- GitHub automation guide: [docs/07-github-automation.md](docs/07-github-automation.md)

## Creating a New Blog Post

Blog posts are loaded from top-level Markdown files in `content/posts`.

Hiero does not currently support translations or localized content variants, so
new posts should be authored as a single English source file.

1. Create a new file such as `content/posts/my-first-post.md`.
2. Use TOML front matter with `+++` delimiters.
3. Add the required post metadata.
4. Write the body in standard Markdown.
5. Add any images to `public/images/...`.
6. Run `pnpm dev` and preview the post at `/blog/<slug>`.

Use this template:

```toml
+++
title = "My First Post"
date = 2026-03-15
draft = false
featured_image = "/images/my-first-post/hero.png"
categories = ["Blog"]
tags = ["Example", "Community"]
duration = "4 min read"
abstract = "A short summary used in the blog list and metadata."
slug = "my-first-post"

[[authors]]
name = "Your Name"
title = "Maintainer"
organization = "Hiero"
link = "https://github.com/your-handle"
image = "/images/authors/your-name.png"
+++

Write the rest of the article here in Markdown.
```

Important notes:

- Use `+++`, not YAML `---`.
- The current site only scans `.md` files directly inside `content/posts`.
- If `slug` is omitted, the filename becomes the URL slug.
- If `draft = true`, the post is skipped locally and in production.
- Raw HTML is not rendered in blog content. Use Markdown syntax instead.
- Hugo shortcodes like `{{< ... >}}` and `{{% ... %}}` are stripped out by the current parser.

For the full field reference and workflow, see [docs/blogs.md](docs/blogs.md).

## Contributing

We welcome contributions such as:

- Code additions or changes
- Blog posts

### Code Changes and Additions

We have several [Open Issues](https://github.com/hiero-ledger/hiero-website/issues?q=is%3Aissue%20state%3Aopen%20no%3Aassignee) at the Hiero website that need help.

Read [Workflow Guide](docs/workflow.md) to get started.

### Blog Posts

See the [Detailed Guide on Creating a Blog Post](docs/blogs.md).
