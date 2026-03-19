# Setting Up The Current Next.js Site

This guide matches the current Hiero website codebase.

## Current Stack

- Next.js `16.1.7`
- React `19.2.3`
- TypeScript `5`
- Tailwind CSS `4`
- `pnpm` for package management

The app uses the Next.js App Router under `src/app`.

## Prerequisites

Install the following before you begin:

1. Node.js `20` or newer
2. `pnpm` `10` or newer
3. Git

Check your versions:

```bash
node --version
pnpm --version
git --version
```

## Clone And Install

```bash
git clone https://github.com/hiero-ledger/hiero-website.git
cd hiero-website
pnpm install
```

## Start Local Development

```bash
pnpm dev
```

This does two things:

1. Runs `pnpm sync:repo-stats`
2. Starts the Next.js development server

Open:

```text
http://localhost:3000
```

Fast Refresh is enabled, so saving most files updates the browser automatically.

## Important Project Paths

- `src/app` - Next.js routes and page files
- `src/components` - reusable UI components
- `content/posts` - blog posts
- `content/hacktoberfest` and `content/heroes` - markdown-backed simple pages
- `public/images` - static images used by pages and posts
- `docs` - contributor documentation

## Working With Content

The current site renders markdown through `react-markdown`.

That means:

- Standard Markdown works
- Raw HTML inside markdown is skipped
- Hugo shortcodes like `{{< ... >}}` and `{{% ... %}}` are stripped from blog and simple content pages

Hiero does not currently support translations or locale-specific content. Keep
content in a single English source file.

When writing content, prefer Markdown syntax such as:

- Links: `[label](https://example.com)`
- Bold text: `**bold**`
- Images: `![Alt text](/images/example.png)`
- Code fences:

````md
```ts
console.log("hello");
```
````

## Blog Drafts

If a blog post has `draft = true`, it is skipped by the current parser.

That means:

- It will not appear on `/blog`
- The single-post route will not render it either

To preview a new post locally, set `draft = false` while testing.

## Quality Checks

Lint the repo:

```bash
pnpm lint
```

Format source files:

```bash
pnpm format
```

Check formatting only:

```bash
pnpm format:check
```

Create a production build:

```bash
pnpm build
```

Run the production build locally:

```bash
pnpm start
```

## Common Issues

### Port 3000 Is Already In Use

Use another port:

```bash
pnpm dev -p 3001
```

### A Blog Post Does Not Show Up

Check all of the following:

- The file is directly inside `content/posts`
- The file extension is `.md`
- The front matter uses `+++`
- `draft = false`
- The TOML front matter is valid

### Images Do Not Load

Check that:

- The image exists under `public/`
- The path starts with `/images/...`
- The file name and extension match exactly

## Next Steps

- Contributor docs index: [README.md](./README.md)
- Repo overview: [01-repo-overview.md](./01-repo-overview.md)
- Content folder guide: [02-content-folder.md](./02-content-folder.md)
- Adding pages guide: [03-adding-pages.md](./03-adding-pages.md)
- Blog authoring guide: [blogs.md](./blogs.md)
- First contribution checklist: [05-first-contribution-checklist.md](./05-first-contribution-checklist.md)
- Testing and quality checks: [06-testing-and-quality-checks.md](./06-testing-and-quality-checks.md)
- Contributor workflow: [workflow.md](./workflow.md)
- General repo overview: [README.md](../README.md)
