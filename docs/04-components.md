# Components

Use this guide when you add, move, or test shared UI under `src/components`.

## Current Component Layout

Shared components use a folder-per-component structure.

```text
src/components/
└── Header/
    ├── index.tsx
    └── __tests__/
        ├── Header.test.tsx
        └── __snapshots__/
            └── Header.test.tsx.snap
```

This gives each component one home for its source, tests, and optional
snapshots while keeping imports stable through the folder entry file.

## Naming Convention

- Name the folder after the component, for example `Header` or `IssueList`.
- Keep the main component implementation in `index.tsx`.
- Export the component directly from that `index.tsx` file.

This allows route and component code to keep using imports like
`@/components/Header` without a separate barrel file.

## When To Create A Shared Component

Use `src/components` when the UI is:

- reused across multiple pages
- a distinct section that benefits from its own tests
- interactive enough that keeping it inline in a route would make the page hard
  to read

Keep code in `src/app/.../page.tsx` when the markup is small and only used by
that route.

## Adding A New Component

1. Create a folder such as `src/components/FaqSection/`.
2. Add `index.tsx` with the component implementation.
3. Add `__tests__/FaqSection.test.tsx` when the component has meaningful
   behavior or rendering worth protecting.
4. Add a snapshot only if the component output is stable and the snapshot will
   stay readable.

## Testing Convention

Each component should have its own test file inside that component folder.

Examples:

- `src/components/ContributorsGrid/__tests__/ContributorsGrid.test.tsx`
- `src/components/Menu/__tests__/Menu.test.tsx`
- `src/components/RichText/__tests__/RichText.test.tsx`

Prefer direct assertions for behavior, accessibility, and important content.

Use snapshots selectively for stable presentational components such as:

- `Header`
- `Footer`
- `HeroSection`
- `Divider`
- `SimpleContentPage`

Do not default to snapshotting highly interactive or data-driven components when
explicit assertions are clearer.

## Import Examples

Use the folder path, not the inner file path:

```tsx
import Header from "@/components/Header";
import RichText from "@/components/RichText";
```

Avoid imports like `@/components/Header/Header` unless there is a specific local
reason to reach into the folder.

## Related Guides

- [01-repo-overview.md](./01-repo-overview.md)
- [03-adding-pages.md](./03-adding-pages.md)
- [06-testing-and-quality-checks.md](./06-testing-and-quality-checks.md)
