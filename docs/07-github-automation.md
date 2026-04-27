# GitHub Automation Guide

This guide documents the GitHub Actions workflows currently defined in the
website repository.

## Workflow Files

The repo currently includes:

- `.github/workflows/ci.yml`
- `.github/workflows/pr-formatting.yaml`
- `.github/workflows/codeql.yml`

## CI Workflow

`ci.yml` runs on:

- pushes to `main`
- pull requests targeting `main`
- manual `workflow_dispatch`

### What CI Does

The workflow:

1. checks out the repository
2. sets up Node.js `20`
3. sets up `pnpm` `10`
4. restores the pnpm cache
5. installs dependencies with `pnpm install --frozen-lockfile`
6. runs `pnpm format:check`
7. runs `pnpm lint`
8. runs `pnpm test`
9. runs `pnpm build`

`NEXT_TELEMETRY_DISABLED=1` is set for the build step.

### What CI Does Not Currently Do

The workflow does not currently run:

- browser-based end-to-end tests
- a markdown linter
- translation or locale checks

## PR Formatting Workflow

`pr-formatting.yaml` runs on `pull_request_target` when a PR is:

- opened
- reopened
- edited
- synchronized

This workflow checks the pull request title against conventional commit style.

## CodeQL Workflow

`codeql.yml` runs security analysis via GitHub's CodeQL scanning. It triggers on:

- pushes to `main`
- pull requests targeting `main` (ignoring `.md` file-only changes)
- a daily schedule at 23:28 UTC

### Languages Analyzed

The workflow uses a matrix strategy to analyze two languages in parallel:

- **GitHub Actions** (`actions`) — analyzes the repository's own Actions workflow files
- **JavaScript/TypeScript** (`javascript-typescript`) — analyzes the website's source code

Both use `build-mode: none` since JavaScript/TypeScript and Actions are interpreted languages
that do not require compilation.

### Security Queries

The workflow uses the `security-extended` query suite for comprehensive security coverage,
including CWE classifications and security hardening recommendations.

## What Contributors Should Expect

Before asking for review, contributors should expect GitHub to reject:

- PRs with non-conventional titles
- source changes that are not formatted
- lint-breaking changes
- changes that break the production build
- changes that introduce security vulnerabilities (detected by CodeQL)

## Recommended Habit

Run the same validation steps locally before opening or updating a PR:

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

For a broader submission workflow, see [workflow.md](./workflow.md).
