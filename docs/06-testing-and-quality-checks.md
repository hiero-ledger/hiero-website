# Testing And Quality Checks

This guide documents the validation steps that exist in the current
Next.js-based website repo.

## What Exists Today

The current project scripts are:

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm coverage`
- `pnpm update-snap`
- `pnpm lint`
- `pnpm format`
- `pnpm format:check`

Unit tests are colocated with the source they cover using `__tests__`
directories, following the same layout used in `adoptium.net`.

The first baseline suite currently covers [src/lib/posts.ts](../src/lib/posts.ts)
from [src/lib/**tests**/posts.test.ts](../src/lib/__tests__/posts.test.ts).

Component tests live inside each component folder, for example
`src/components/Header/__tests__/Header.test.tsx`. Snapshot files are added
selectively under `__snapshots__` when they provide stable, useful coverage.
See [04-components.md](./04-components.md) for the full component layout
convention.

App-level tests live under `src/app/__tests__`, for example
`src/app/__tests__/not-found.test.tsx` and
`src/app/__tests__/sitemap.test.ts`.

## Browser Tests (`e2e/`)

Unit tests run in jsdom, which does not load the stylesheet. That means a
component test can only assert that a component *emits* a class — never what
that class does once the cascade has resolved. Both halves have to be true for
the page to work, and the gap between them is where styling regressions live.

Two real examples, both of which passed lint, Prettier and the full unit suite:

- Nav links rendered `md:text-charcoal` inside a `bg-charcoal` overlay. The
  class was present, the snapshot matched, and the menu was charcoal text on a
  charcoal background — blank to a reader.
- A rule in `globals.css` moved between cascade layers and every `.container`
  silently capped at 1280px instead of 1820px.

Playwright tests under `e2e/` close that gap by asserting on **computed
styles in a real browser**. They deliberately check invariants rather than
pinned values, so a redesign that changes colours and spacing does not have to
rewrite them:

- navigation text meets the WCAG AA contrast ratio against its effective
  background, at three viewport widths
- every menu item sits inside the viewport when the mobile overlay is open
  (the overlay locks body scrolling, so anything outside it is unreachable)
- no page scrolls sideways

One of those widths is 700px. It is not a device size — it is the gap that
opens whenever the JS breakpoint, the utility prefix and a media query in
`globals.css` stop agreeing. Nobody opens a browser at 700px by accident, which
is exactly why a regression there survives review.

Run them locally with:

```bash
pnpm build
pnpm test:e2e
```

The suite serves the production build, so the CSS under test is the CSS that
ships. The first run downloads Chromium via `pnpm exec playwright install
chromium`.

### Adding to them

Prefer assertions that stay true across a redesign. `expect(ratio).toBeGreaterThan(4.5)`
survives a new palette; `expect(color).toBe("rgb(184, 26, 86)")` does not, and a
test that has to be updated on every visual change gets deleted rather than
fixed.

The contrast helper abstains where it cannot know the answer — if any ancestor
paints a gradient or image, there is no single background colour to compare
against, so the element is skipped. That keeps hero sections from producing
false failures.

## Recommended Local Checks

Run these before opening a pull request:

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
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

### `pnpm test:e2e`

Runs the Playwright suite in `e2e/` against a real browser. Needs a production
build first (`pnpm build`), because the config serves the site with
`pnpm start`.

See [Browser Tests](#browser-tests-e2e) for what these cover and why they
exist alongside the Vitest suite.

### `pnpm coverage`

Runs the same Vitest suite with V8 coverage enabled.

Use this when you want a local coverage report while expanding the baseline
test surface.

### `pnpm update-snap`

Runs the Vitest suite in snapshot update mode.

Use this after intentionally changing stable UI output that already has
snapshot coverage.

### `pnpm build`

Runs:

```bash
pnpm sync:data && next build
```

This is the closest thing to a production validation step and should pass
before opening a PR.

### `pnpm dev`

Runs:

```bash
pnpm sync:data && next dev
```

Use this while developing to preview page changes at `http://localhost:3000`.

## CI Expectations

The current `CI` workflow runs:

1. `pnpm install --frozen-lockfile`
2. `pnpm format:check`
3. `pnpm lint`
4. `pnpm test`
5. `pnpm build`
6. `pnpm test:e2e`

If one of these fails locally, it will likely fail in GitHub Actions too.

CI runs on pull requests into `main` and into `websiteRedesign`. The second
entry exists because the redesign branch is long-lived: PRs into it previously
merged without any of these checks running at all.

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
