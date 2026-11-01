# Writing Blog Posts

This guide reflects how the current site reads and renders blog content.

## What Belongs On The Hiero Blog

Posts on `hiero.org/blog` should stay focused on technical, contributor, maintainer, or ecosystem-builder content.

For broader marketing, business messaging, or Linux Foundation-level announcements, use the appropriate external channel instead.

Hiero does not currently support translated blog variants. Publish a single
English source post unless a dedicated i18n feature is added later.

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

Follow the normal contributor workflow in the [Contributing guide](../README.md#contributing).

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

## Events And Photos

A post about an event (a community day, meetup, workshop or talk) can add an
`[event]` table. Posts that have one appear in the **Events** section of the
home page, with their photos in a gallery.

Put the table after the `[[authors]]` blocks, at the end of the front matter:

```toml
[event]
date = 2026-07-07
location = "Berlin, Germany"

[[event.photos]]
src = "/images/my-event/talk.jpg"
alt = "A speaker presents to a seated audience"

[[event.photos]]
src = "/images/my-event/lunch.jpg"
alt = "Attendees queue for lunch in the courtyard"
```

| Field | Status | Notes |
| --- | --- | --- |
| `date` | Required | The day the event happens, not the day the post goes out. Without a valid date the post stays on the blog but is left off the home page. |
| `location` | Recommended | City and country, or `"Online"`. |
| `[[event.photos]]` | Optional | One block per photo, in the order the gallery shows them. The first is the cover. Without photos, the post's `featured_image` is used. |
| `src` | Required per photo | A site path under `/images/`. Links to other sites are ignored. |
| `alt` | Strongly recommended | What the photo shows, for screen reader users. |

Things to know:

- **Only one post per event.** If you published a save-the-date and later a
  recap, move the `[event]` table to the recap so the event is not listed twice.
- **Events still to come** are labelled _Upcoming_ and listed first.
- **Resize photos before committing.** Images are served as they are, so a
  phone photo straight from the camera can be 5 MB. Aim for about 1600px on the
  long edge and under 400 KB. Re-saving also strips camera metadata such as
  GPS coordinates.

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
- For an event post: the `[event]` date is set, and every photo has a valid
  `src` and an `alt`
- `draft = false` if the post is intended to publish after merge

## Helpful References

- Current example post: `content/posts/hiero-enterprise-java.md`
- Blog index metadata: `content/posts/_index.md`
- Contributor docs index: [README.md](../README.md)
- Local setup guide: [Getting Started](../README.md#getting-started)
- Repo overview: [01-repo-overview.md](./01-repo-overview.md)
- Contribution workflow: [Contributing](../README.md#contributing)
