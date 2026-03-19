# Content Folder Guide

This guide explains which files under `content/` are used by the current
Next.js site.

## Directory Map

| Path | Current Role |
| --- | --- |
| `content/posts/_index.md` | Blog landing-page metadata. |
| `content/posts/*.md` | Blog posts loaded by `src/lib/posts.ts`. |
| `content/hacktoberfest/index.md` | Markdown body for `/hacktoberfest`. |
| `content/heroes/index.md` | Markdown body for `/heroes`. |
| `content/_index.md` | Legacy content file that is not currently used by the homepage route. |

## Blog Content

Blog posts use:

- files directly inside `content/posts`
- TOML front matter with `+++`
- standard Markdown content

Important details:

- only top-level `content/posts/*.md` files are loaded
- `content/posts/_index.md` is reserved for blog list metadata
- nested directories are ignored by the current parser
- raw HTML is not rendered by the current markdown setup
- Hugo shortcodes are stripped out before rendering

For blog authoring details, use [blogs.md](./blogs.md).

## Simple Page Content

The current simple pages are:

- `content/hacktoberfest/index.md`
- `content/heroes/index.md`

These files use YAML front matter with `---`, not TOML `+++`.

The page routes load them through `getSimplePageWithDefaults(...)` in
`src/lib/posts.ts`.

Important details:

- `title` and `description` are read from front matter
- the markdown body is rendered with `react-markdown`
- Hugo shortcodes are stripped out before rendering
- any route-specific widgets still live in code, not markdown

## Which Front Matter Style To Use

Use the front matter style that matches the loader:

| Content Type | File Pattern | Front Matter |
| --- | --- | --- |
| Blog posts | `content/posts/*.md` | TOML with `+++` |
| Simple pages | `content/<slug>/index.md` | YAML with `---` |

Do not switch a file to a different front matter format unless you also update
the corresponding parser in code.

## Images And Media

Put images in `public/` and reference them with site-rooted paths.

Examples:

- `public/images/hacktoberfest/banner.png`
- `public/images/authors/jane-doe.png`

Referenced as:

- `/images/hacktoberfest/banner.png`
- `/images/authors/jane-doe.png`

## No Translation Layer

Hiero does not have locale folders such as `content/en`, `content/es`, or
translated copies of the same post or page.

Keep content in a single English source file for now.
