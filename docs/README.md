# Hiero Website Contributor Docs

This `docs/` directory contains the contributor documentation for the
Next.js-based Hiero website.

These guides were organized for the current `next-js-migration` codebase.
They are inspired by the Open Elements docs structure, but they are adapted to
how Hiero actually works today.

## Important Scope Note

Hiero does not currently have a translation or localization system.

That means:

- do not create translated copies of pages or blog posts
- do not add locale-specific routes unless a separate i18n feature is planned
- assume a single canonical English source for content

## Who These Docs Are For

- contributors making their first website change
- maintainers onboarding new contributors
- content authors adding blog posts or simple markdown-backed pages
- developers updating routes, components, or CI behavior

## Documentation Map

| Guide | Purpose |
| --- | --- |
| [nextjs-setup.md](./nextjs-setup.md) | Install dependencies and run the migrated site locally. |
| [01-repo-overview.md](./01-repo-overview.md) | Understand the current app architecture, key directories, and content model. |
| [02-content-folder.md](./02-content-folder.md) | Learn what belongs in `content/` and which markdown files are still consumed. |
| [03-adding-pages.md](./03-adding-pages.md) | Add a new route, simple markdown-backed page, or page link. |
| [blogs.md](./blogs.md) | Create or update a blog post under `content/posts`. |
| [05-first-contribution-checklist.md](./05-first-contribution-checklist.md) | Validate a change before opening a pull request. |
| [06-testing-and-quality-checks.md](./06-testing-and-quality-checks.md) | Run the current local validation steps and understand their scope. |
| [07-github-automation.md](./07-github-automation.md) | Understand the GitHub Actions checks that run on pull requests. |
| [workflow.md](./workflow.md) | Follow the broader Hiero contribution and PR workflow. |

## Suggested Reading Path

If you are new to the repo:

1. Read [nextjs-setup.md](./nextjs-setup.md).
2. Read [01-repo-overview.md](./01-repo-overview.md).
3. Read [02-content-folder.md](./02-content-folder.md).
4. Choose one path:
   - For a route or page change, read [03-adding-pages.md](./03-adding-pages.md).
   - For a blog post, read [blogs.md](./blogs.md).
5. Before opening a PR, use [05-first-contribution-checklist.md](./05-first-contribution-checklist.md).

Use [06-testing-and-quality-checks.md](./06-testing-and-quality-checks.md)
and [07-github-automation.md](./07-github-automation.md) as reference while
you work.

## Maintenance Rule

When a change updates contributor workflow, route structure, or validation
behavior, update the relevant documentation in the same pull request.
