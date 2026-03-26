# First Contribution Checklist

Use this checklist before you open a pull request for the website.

## Local Validation

- `pnpm install` completed successfully
- `pnpm format:check` passes
- `pnpm lint` passes
- `pnpm test` passes
- `pnpm build` passes

If you changed code under `src/`, run `pnpm format` before re-checking
formatting.

## Route And Content Checks

- new routes render at the expected URL
- page metadata title and description are present
- new links and navigation entries point to the correct path
- any new images exist under `public/` and load correctly

## Blog-Specific Checks

If your PR adds or updates a blog post:

- the file lives directly inside `content/posts`
- the front matter uses `+++`
- `draft = false` if the post should publish after merge
- the post renders correctly at `/blog/<slug>`
- image paths use `/images/...`

## Simple Page Checks

If your PR adds or updates a markdown-backed page:

- the markdown file uses YAML front matter
- `title` and `description` are set
- the route file points at the correct `content/<slug>/index.md`
- any route-specific widget still works below the markdown content

## Documentation Checks

- README or docs were updated if contributor workflow changed
- examples, commands, and file paths match the current repo
- no translation guidance was introduced by accident

## Pull Request Checks

- the PR title follows conventional commit style
- commits are signed if required by the contribution workflow
- the PR description explains what changed and why
- the PR links the issue it resolves when applicable

For the broader contribution process, see [workflow.md](./workflow.md).
