# Writing Blog Posts

This guide reflects how the current site reads and renders blog content.

## What Belongs On The Hiero Blog

Posts on `hiero.org/blog` should stay focused on technical, contributor, maintainer, or ecosystem-builder content.

For broader marketing, business messaging, or Linux Foundation-level announcements, use the appropriate external channel instead.

## How Blog Posts Work In This Repo

The current parser in `src/lib/posts.ts` expects:

- A Markdown file directly inside `content/posts`
- TOML front matter with `+++` delimiters
- Markdown body content

Important limitations:

- Only top-level `content/posts/*.md` files are loaded
- `content/posts/_index.md` is reserved for the blog landing page metadata
- Raw HTML in markdown is skipped by the current renderer
- Hugo shortcodes like `{{< ... >}}` and `{{% ... %}}` are stripped out

If you need a post-specific subfolder or custom shortcode behavior, that requires a code change first.

## Step By Step

### 1. Choose A File Name

Create a new file in `content/posts` using kebab-case:

```text
content/posts/my-first-post.md
```

If you do not set a `slug`, the file name becomes the blog URL:

```text
/blog/my-first-post
```

### 2. Add TOML Front Matter

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
abstract = "A short summary used in blog cards and metadata."
slug = "my-first-post"

[[authors]]
name = "Your Name"
title = "Maintainer"
organization = "Hiero"
link = "https://github.com/your-handle"
image = "/images/authors/your-name.png"
+++
```

You can add more authors by repeating the `[[authors]]` block.

### 3. Write The Body In Markdown

Use standard Markdown for headings, lists, links, images, quotes, and code blocks.

Good examples:

```md
## Heading

Use **bold** text instead of raw HTML tags.

[External link](https://example.com)

![Diagram](/images/my-first-post/diagram.png)
```

Avoid:

- Raw HTML like `<div>` or `<strong>`
- Hugo shortcodes like `{{< youtube ... >}}`

Those will not render in the current setup.

### 4. Add Images

Put images in `public/images/...`.

Examples:

- Hero image: `public/images/my-first-post/hero.png`
- Inline diagram: `public/images/my-first-post/diagram.png`
- Author photo: `public/images/authors/your-name.png`

Then reference them with site-rooted paths:

```toml
featured_image = "/images/my-first-post/hero.png"
```

```md
![Diagram](/images/my-first-post/diagram.png)
```

### 5. Preview Locally

Start the site:

```bash
pnpm dev
```

Preview at:

- `http://localhost:3000/blog`
- `http://localhost:3000/blog/<slug>`

Draft behavior:

- `draft = true` means the post is skipped entirely
- It will not appear in the blog list
- Its single-post page will not render either

If you want to preview the post locally, set `draft = false` while testing.

### 6. Open Your Pull Request

Follow the normal contributor workflow in [workflow.md](./workflow.md).

Before opening a PR, run:

```bash
pnpm lint
pnpm build
```

## Required vs Recommended Fields

The parser is permissive, but these are the current practical requirements.

| Field | Status | Notes |
| --- | --- | --- |
| `title` | Required | Displayed on the page and in metadata. |
| `date` | Required | Used for ordering. A TOML date like `2026-03-15` works. |
| `[[authors]]` with `name` | Strongly recommended | The page hero is designed to show at least one author. |
| `abstract` | Strongly recommended | Used in blog cards and metadata. |
| `featured_image` | Strongly recommended | Used in the blog list and recent-post cards. If omitted, the site falls back to a default image. |
| `draft` | Optional | Defaults to published behavior if omitted. |
| `slug` | Optional | Defaults to the file name without `.md`. |
| `categories` | Optional | Use an array such as `["Blog"]`. |
| `tags` | Optional | Use an array such as `["Release", "SDK"]`. |
| `duration` | Optional | Example: `"4 min read"`. |
| `description` | Optional | Acts as a fallback summary if `abstract` is omitted. |

## Author Fields

Each author block supports these fields:

| Field | Status | Notes |
| --- | --- | --- |
| `name` | Recommended | The main displayed author value. |
| `title` | Optional | Shown in the hero metadata. |
| `organization` | Optional | Shown with the title if present. |
| `link` | Optional | Makes the author block clickable. |
| `image` | Optional | Profile image shown in the hero area. |

Example with two authors:

```toml
[[authors]]
name = "First Author"
title = "Maintainer"
organization = "Hiero"
link = "https://github.com/first-author"
image = "/images/authors/first-author.png"

[[authors]]
name = "Second Author"
organization = "Hiero"
link = "https://github.com/second-author"
```

## Current Date Format Notes

These both work with the current parser:

```toml
date = 2026-03-15
```

```toml
date = 2026-03-15T09:30:00Z
```

## Pre-Publish Checklist

Before your PR is ready:

- The file is in `content/posts`
- The file extension is `.md`
- The front matter uses `+++`
- The title and date are filled in
- The post has at least one author
- The post has an abstract
- The hero image path is valid
- Inline image paths are valid
- The post renders correctly at `/blog/<slug>`
- `draft = false` if the post is intended to publish after merge

## Helpful References

- Current example post: `content/posts/hiero-enterprise-java.md`
- Blog index metadata: `content/posts/_index.md`
- Local setup guide: [nextjs-setup.md](./nextjs-setup.md)
- Workflow guide: [workflow.md](./workflow.md)
