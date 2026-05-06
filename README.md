# Hiero Website

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/hiero-ledger/hiero-website/badge)](https://scorecard.dev/viewer/?uri=github.com/hiero-ledger/hiero-website)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/10697/badge)](https://bestpractices.coreinfrastructure.org/projects/10697)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Source code for [hiero.org](https://hiero.org) — the official website for the Hiero project.

## About

[Hiero](https://hiero.org) is an open-source, vendor-neutral distributed ledger technology project under [Linux Foundation Decentralized Trust](https://www.lfdecentralizedtrust.org/). It powers the [Hedera](https://hedera.com/) public ledger and provides a fair, fast, and secure platform for decentralized applications.

This repository contains the source code, content, and documentation for the Hiero project website.

## Getting Started

### Requirements

- Node.js `20` or newer
- pnpm `10` or newer
- Git

Platform-specific setup help:

- [Linux](docs/setup/linux_setup.md)
- [Windows](docs/setup/windows_setup.md)
- [macOS](docs/setup/Macbook_setup.md)

### Install and Run

```bash
pnpm install
pnpm dev
```

The site will be available at `http://localhost:3000`.

### Build and Checks

| Command | Description |
| --- | --- |
| `pnpm lint` | Lint the codebase |
| `pnpm test` | Run unit tests |
| `pnpm format` | Format source files |
| `pnpm format:check` | Check formatting without changing files |
| `pnpm build` | Build the production app |
| `pnpm start` | Serve the production build locally |
| `pnpm update-snap` | Update test snapshots after intentional UI changes |

## Project Structure

| Path | Purpose |
| --- | --- |
| `src/app` | Route files, layouts, metadata, and page entry points |
| `src/components` | Shared UI components (one folder per component with colocated tests) |
| `src/lib` | Markdown parsing and content-loading helpers |
| `src/data` | Generated or static JSON used by the app |
| `src/scripts` | Local scripts (e.g., `sync-repo-stats.mjs`) |
| `content/posts` | Blog post markdown files |
| `public` | Static images and assets |
| `docs` | Contributor and developer documentation |

For a detailed breakdown of routes, content model, and constraints, see the [Repository Overview](docs/01-repo-overview.md).

## Documentation

Detailed documentation lives in the [`docs/`](docs/) directory. Below is a guided index organized by audience.

### For New Contributors

| Guide | Description |
| --- | --- |
| [First Contribution Checklist](docs/05-first-contribution-checklist.md) | Pre-PR validation checklist |
| [Contribution Workflow](docs/workflow.md) | End-to-end guide: fork, branch, commit, and submit a PR |
| [Commit Signing Guide](docs/signing.md) | Setting up DCO and GPG signing |
| [Discord Guide](docs/discord.md) | Joining the community chat |

### For Developers

| Guide | Description |
| --- | --- |
| [Repository Overview](docs/01-repo-overview.md) | Architecture, directories, and route model |
| [Content Folder Guide](docs/02-content-folder.md) | How content is organized and loaded |
| [Adding Pages](docs/03-adding-pages.md) | Creating new routes and markdown-backed pages |
| [Components Guide](docs/04-components.md) | Component layout, imports, and testing conventions |
| [Testing and Quality Checks](docs/06-testing-and-quality-checks.md) | Linting, testing, and CI expectations |
| [Rebasing Guide](docs/rebasing.md) | Keeping your branch in sync with upstream |
| [Merge Conflicts Guide](docs/merge_conflicts.md) | Resolving merge conflicts |

### For Content Authors

| Guide | Description |
| --- | --- |
| [Blog Writing Guide](docs/blogs.md) | Templates, front matter reference, and publishing workflow |

### For Maintainers

| Guide | Description |
| --- | --- |
| [GitHub Automation](docs/07-github-automation.md) | CI workflows and automation overview |

## Contributing

We welcome contributions of all kinds — code, documentation, and blog posts.

1. **Find an issue**: Browse [unassigned open issues](https://github.com/hiero-ledger/hiero-website/issues?q=is%3Aissue%20state%3Aopen%20no%3Aassignee) and comment `/assign` to claim one.
2. **Set up your environment**: Follow the [Getting Started](#getting-started) section above.
3. **Read the workflow**: See the [Contribution Workflow](docs/workflow.md) for the full process.
4. **Sign your commits**: All commits must be DCO and GPG signed. See the [Signing Guide](docs/signing.md).

New to the project? Start with a [Good First Issue](https://github.com/hiero-ledger/hiero-website/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good+first+issue%22%20no%3Aassignee).

## Community

- **Discord**: Join us on [Discord](https://discord.gg/hiero) — see the [Discord Guide](docs/discord.md) for details.
- **Community Calls**: Browse meeting schedules and recordings on the [LFX Calendar](https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week).
- **Discussions**: Use [GitHub Discussions](https://github.com/hiero-ledger/hiero-website/discussions) for questions and ideas.

## License

This project is licensed under the [MIT License](LICENSE).
