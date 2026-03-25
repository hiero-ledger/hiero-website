# Testing And Quality Checks

This guide documents the validation steps that exist in the current
Next.js-based website repo.

## What Exists Today

The current project scripts are:

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm test`
- `pnpm coverage`
- `pnpm lint`
- `pnpm format`
- `pnpm format:check`

Unit tests are colocated with the source they cover using `__tests__`
directories, following the same layout used in `adoptium.net`.

The first baseline suite currently covers [src/lib/posts.ts](../src/lib/posts.ts)
from [src/lib/__tests__/posts.test.ts](../src/lib/__tests__/posts.test.ts).

Although some testing dependencies are installed, the current CI workflows only
enforce formatting, linting, and a production build.

## Recommended Local Checks

Run these before opening a pull request:

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

If you changed files under `src/`, it is often useful to run:

```bash
pnpm format
```

then re-run:

```bash
pnpm format:check
```

## What Each Command Does

### `pnpm format`

Runs Prettier on source files under `src/**/*.{js,jsx,ts,tsx,json}`.

Notes:

- this does not automatically format Markdown docs
- this does not rewrite files outside the configured `src/` glob

### `pnpm format:check`

Checks whether the files covered by the Prettier glob are already formatted.

Use this before committing source changes.

### `pnpm lint`

Runs ESLint across the repo using the Next.js configuration in
`eslint.config.js`.

This catches common TypeScript, React, and App Router issues.

### `pnpm test`

Runs the Vitest suite once in `jsdom`.

Tests live beside the code they cover inside `__tests__` directories, for
example `src/lib/__tests__/posts.test.ts`.

### `pnpm coverage`

Runs the same Vitest suite with V8 coverage enabled.

Use this when you want a local coverage report while expanding the baseline
test surface.

### `pnpm build`

Runs:

```bash
pnpm sync:repo-stats && next build
```

This is the closest thing to a production validation step and should pass
before opening a PR.

### `pnpm dev`

Runs:

```bash
pnpm sync:repo-stats && next dev
```

Use this while developing to preview page changes at `http://localhost:3000`.

## CI Expectations

The current `CI` workflow runs:

1. `pnpm install --frozen-lockfile`
2. `pnpm format:check`
3. `pnpm lint`
4. `pnpm test`
5. `pnpm build`

If one of these fails locally, it will likely fail in GitHub Actions too.

## Content-Specific Validation Tips

### Blog Posts

- open `/blog`
- open the individual post route
- confirm the post is not accidentally left as draft
- verify featured and inline image paths

### Markdown-Backed Simple Pages

- open the route locally
- verify front matter values render correctly
- confirm stripped shortcodes are not needed for the page

## No Translation Test Matrix

There is no translation or locale test matrix because the site does not
currently implement i18n.

Keep validation focused on the single English site.
