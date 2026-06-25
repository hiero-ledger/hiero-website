# Design Specifications

This document describes the colors and typography used by the Hiero website.
The source of truth is the theme defined in `src/app/globals.css` (colors,
fonts, type scale) and the font loading in `src/app/layout.tsx`; this guide
mirrors those values for reference.

## Typography

The site uses two typefaces, both loaded via `next/font/google` in
`src/app/layout.tsx`.

| Role | Typeface | Weights | CSS variable | Theme token |
|------|----------|---------|--------------|-------------|
| Primary (body + headings) | **Space Grotesk** | 300, 400, 500, 600, 700 | `--font-space-grotesk` | `--font-serif` |
| Monospace (code, snippets) | **IBM Plex Mono** | 400 | `--font-ibm-plex-mono` | `--font-ibm` |

> **Note:** The primary font is exposed under the theme spec `--font-serif`
> for historical reasons. Space Grotesk is a sans-serif typeface; the spec
> name does not reflect its classification. Use `font-serif` (Tailwind) to
> apply the primary font, and `font-ibm` for monospace.

```css
--font-serif: var(--font-space-grotesk), ui-serif, serif;
--font-ibm:   var(--font-ibm-plex-mono), ui-monospace, monospace;
```

### Type Scale

Defined in the `@theme` block in `globals.css`. Sizes pair a `font-size`
with a matching `line-height` and, for most steps, a negative
`letter-spacing` for tighter display headings.

| Token | Size | Line height | Letter spacing |
|-------|------|-------------|----------------|
| `text-xs`  | 0.75rem  | 1rem     | — |
| `text-sm`  | 0.875rem | 1.25rem  | — |
| `text-base`| 1rem     | 1.313rem | -0.054rem |
| `text-lg`  | 1.125rem | 1.438rem | -0.06rem |
| `text-xl`  | 1.75rem  | 2.25rem  | -0.094rem |
| `text-2xl` | 2rem     | 2.25rem  | -0.167rem |
| `text-3xl` | 2.25rem  | 2.875rem | -0.188rem |
| `text-4xl` | 4rem     | 4.5rem   | -0.333rem |
| `text-5xl` | 7.5rem   | 6.875rem | -0.625rem |

## Colors

Defined in the `@theme` block in `globals.css` and consumed through Tailwind
utility classes (`text-red`, `bg-sand`, `border-charcoal`, etc.).

### Brand

| Token | Hex | Notes |
|-------|-----|-------|
| `--color-red`       | `#B81A56` | The official Hiero brand color. Links, primary accents, table headers. |
| `--color-red-dark`  | `#992350` | Darker shade — hover/emphasis. |
| `--color-red-light` | `#D92D6A` | Lighter tint — nav link hover, active-link underline, focus rings. |

### Neutrals

| Spec | Hex | Usage |
|-------|-----|-------|
| `--color-white`      | `#FFFFFF` | Pure white surfaces and reversed text. |
| `--color-white-dark` | `#E5E4D7` | Off-white (same value as `sand`). |
| `--color-sand`       | `#E5E4D7` | Warm neutral — pagination, hover rows. |
| `--color-black`      | `#000000` | Pure black. |
| `--color-charcoal`   | `#1E1E1E` | Primary text color; borders; code-block background. |
| `--color-gray`       | `#616161` | Table borders, muted detail. |
| `--color-gray-light` | `#EFEFEE` | Zebra striping on tables. |

### Utility

| Spec | Value |
|-------|-------|
| `--color-transparent` | `transparent` |
| `--color-current`     | `currentColor` |

## Full Spec Block

```css
@theme {
  /* Colors */
  --color-transparent: transparent;
  --color-current: currentColor;
  --color-white: #FFFFFF;
  --color-white-dark: #E5E4D7;
  --color-black: #000000;
  --color-charcoal: #1E1E1E;
  --color-red: #B81A56;
  --color-red-dark: #992350;
  --color-red-light: #D92D6A;
  --color-sand: #E5E4D7;
  --color-gray: #616161;
  --color-gray-light: #EFEFEE;

  /* Fonts — variables set by next/font in layout.tsx */
  --font-serif: var(--font-space-grotesk), ui-serif, serif;
  --font-ibm: var(--font-ibm-plex-mono), ui-monospace, monospace;

  /* Font sizes (name: size | line-height letter-spacing) */
  --text-xs: 0.75rem;
  --text-xs--line-height: 1rem;

  --text-sm: 0.875rem;
  --text-sm--line-height: 1.25rem;

  --text-base: 1rem;
  --text-base--line-height: 1.313rem;
  --text-base--letter-spacing: -0.054rem;

  --text-lg: 1.125rem;
  --text-lg--line-height: 1.438rem;
  --text-lg--letter-spacing: -0.06rem;

  --text-xl: 1.75rem;
  --text-xl--line-height: 2.25rem;
  --text-xl--letter-spacing: -0.094rem;

  --text-2xl: 2rem;
  --text-2xl--line-height: 2.25rem;
  --text-2xl--letter-spacing: -0.167rem;

  --text-3xl: 2.25rem;
  --text-3xl--line-height: 2.875rem;
  --text-3xl--letter-spacing: -0.188rem;

  --text-4xl: 4rem;
  --text-4xl--line-height: 4.5rem;
  --text-4xl--letter-spacing: -0.333rem;

  --text-5xl: 7.5rem;
  --text-5xl--line-height: 6.875rem;
  --text-5xl--letter-spacing: -0.625rem;
}
```

## Related Guides

- [01-repo-overview.md](./01-repo-overview.md)
- [04-components.md](./04-components.md)
