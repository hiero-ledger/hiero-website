+++
title = "Hiero Python SDK – Announcing Release v0.1.7"
featured_image = "/images/python/blog_posts/v0.1.7.jpg"
date = 2025-10-30T14:00:00+05:30
categories = ["Blog"]
abstract = "Announcing v0.1.7, a release packed with documentation, new features, and 27 new contributors!"
[[authors]]
name = "cheese-cakee"
organization = "Python SDK Team"
image = "/images/python/members/cheese-cakee.jpg"
+++

# 🚀 Hiero Python SDK – Announcing Release v0.1.7

We’re thrilled to announce **version 0.1.7** of the Hiero Python SDK!

This release focuses heavily on improving the developer experience with extensive new documentation, examples, and docstrings. It also introduces two new workflows, adds a checksum feature, and includes numerous refactors to make the SDK more robust and easier to use.

A huge thank you to our 27 new contributors for making this rapid release possible! ❤️

---

## ✨ What’s New in v0.1.7

This release introduces new features for reliability, automated workflows, and comprehensive new documentation to guide developers.

### 🧾 New Features & Workflows
- **Checksum Feature:** Added checksum validation for `TopicId`, `ContractId`, and `ScheduleId` for more reliable operations.
- **Dependabot Workflow:** Added a `dependabot.yml` file to enable automated dependency management.
- **Example Runner Workflow:** Added a workflow for running example scripts, improving our CI pipeline.
- **Type Hints:** Added type hints to `setup_client()` and `create_new_account()` functions.
- **Initial Testing Guide:** Added a foundational testing guide to help new contributors.

### 📚 New Documentation & Docstrings
- **Rebasing and Signing Guide:** New documentation on `md.signing` with instructions for maintaining commit verification.
- **New Examples:** Added `account_id.py` demonstrating `AccountId` usage (parsing, string compares, etc.).
- **Changelog Guides:** Added guides for resolving changelog conflicts and for SDK contributors to create proper entries.
- **Google-style Docstrings:** Added comprehensive Google-style docstrings for:
  - `CustomFractionalFee`
  - `CustomRoyaltyFee`
  - `AbstractTokenTransferTransaction`

---

## 🔄 Improvements & Changes
We've refactored several key areas to improve modularity, readability, and consistency across the codebase.

- **`TopicId` Refactor:** Refactored the `TopicId` class to use `DataClass` decorator, reducing boilerplate code.
- **Example Refactors:**
  - `topic_create.py`: Made more modular for better readability and reuse.
  - `transfer_hbar.py`: Improved modularity by separating transfer and balance query operations.
  - `file_append.py`: Modularized into `setup_client`, `create_file`, and `append_to_file` functions.
  - `token_create_nft_infinite.py`: Converted into modular functions.
- **Internal Refactors:**
  - Removed deprecated `snake_case` aliases.
  - Refactored `type_id` logic with a `dataclass` decorator for better maintainability.

---

## 🐞 Fixes
- Fixed a **code scanning alert** (no. 4) where workflow docs did not contain permissions.
- Fixed **broken Discord links** with stable Hyperledger/Hedera invites.
- Fixed **type hints** for topic-related transactions.

---

## 📌 What else changed (high-level highlights)

This release bundles many other PRs that improved docs, chores, and examples. Notable items include:
- `chore: configure Dependabot for GitHub Actions and pip` (PR [#524](https://github.com/hiero-ledger/hiero-sdk-python/pull/524))
- `docs: improve contributing section in README` (PR [#522](https://github.com/hiero-ledger/hiero-sdk-python/pull/522))
- `docs: add docstrings to custom_fixed_fee.py` (PR [#539](https://github.com/hiero-ledger/hiero-sdk-python/pull/539))
- `refactor: modularize file_append example` (PR [#557](https://github.com/hiero-ledger/hiero-sdk-python/pull/557))
- `chore: Update maintainers list and changelog` (PR [#525](https://github.com/hiero-ledger/hiero-sdk-python/pull/525))
- `docs: Add Google-style docstrings to token_relationship.py` (PR [#559](https://github.com/hiero-ledger/hiero-sdk-python/pull/559))

For the **full changelog** see the release page or compare the tags:  
👉 [Full Changelog — v0.1.6...v0.1.7](https://github.com/hiero-ledger/hiero-sdk-python/compare/v0.1.6...v0.1.7)  
👉 Release page: [v0.1.7 on GitHub Releases](https://github.com/hiero-ledger/hiero-sdk-python/releases/tag/v0.1.7) — released by **[@explorerii](https://github.com/explorerii)**.

---
## ⚡ Upgrade to the Latest Version

Update to the latest Hiero Python SDK release with:

```bash
pip install --upgrade hiero-sdk-python
```



## 🙌 Community growth — contributors spotlight

We are incredibly excited to highlight the massive community growth for this release: **27 new contributors** took part in v0.1.7! This is a fantastic sign of momentum for the project.

### New contributors (first-time contributors for v0.1.7)
- [@Nayan4007](https://github.com/Nayan4007) — first contribution in [#503](https://github.com/hiero-ledger/hiero-sdk-python/pull/503)
- [@prajeeta15](https://github.com/prajeeta15) — first contribution in [#421](https://github.com/hiero-ledger/hiero-sdk-python/pull/421)
- [@Shashank0701-byte](https://github.com/Shashank0701-byte) — first contribution in [#509](https://github.com/hiero-ledger/hiero-sdk-python/pull/509)
- [@ambiguity](https://github.com/ambiguity) — first contribution in [#512](https://github.com/hiero-ledger/hiero-sdk-python/pull/512)
- [@Raja-89](https://github.com/Raja-89) — first contribution in [#493](https://github.com/hiero-ledger/hiero-sdk-python/pull/493)
- [@amritamishra01](https://github.com/amritamishra01) — first contribution in [#529](https://github.com/hiero-ledger/hiero-sdk-python/pull/529)
- [@Adityarya11](https://github.com/Adityarya11) — first contribution in [#515](https://github.com/hiero-ledger/hiero-sdk-python/pull/515)
- [@joepaulvilsan](https://github.com/joepaulvilsan) — first contribution in [#520](https://github.com/hiero-ledger/hiero-sdk-python/pull/520)
- [@mollymont](https://github.com/mollymont) — first contribution in [#542](https://github.com/hiero-ledger/hiero-sdk-python/pull/542)
- [@bhaskargurram-ai](https://github.com/bhaskargurram-ai) — first contribution in [#537](https://github.com/hiero-ledger/hiero-sdk-python/pull/537)
- [@Ananya4444](https://github.com/Ananya4444) — first contribution in [#545](https://github.com/hiero-ledger/hiero-sdk-python/pull/545)
- [@msaadsbr](https://github.com/msaadsbr) — first contribution in [#513](https://github.com/hiero-ledger/hiero-sdk-python/pull/513)
- [@riyadev27](https://github.com/riyadev27) — first contribution in [#525](https://github.com/hiero-ledger/hiero-sdk-python/pull/525)
- [@OnatadeTobi](https://github.com/OnatadeTobi) — first contribution in [#557](https://github.com/hiero-ledger/hiero-sdk-python/pull/557)
- [@sankhya007](https://github.com/sankhya007) — first contribution in [#558](https://github.com/hiero-ledger/hiero-sdk-python/pull/558)
- [@Pratyush2240](https://github.com/Pratyush2240) — first contribution in [#573](https://github.com/hiero-ledger/hiero-sdk-python/pull/573)
- [@RaghavGanesh7](https://github.com/RaghavGanesh7) — first contribution in [#574](https://github.com/hiero-ledger/hiero-sdk-python/pull/574)
- [@Zaki-Mohd](https://github.com/Zaki-Mohd) — first contribution in [#464](https://github.com/hiero-ledger/hiero-sdk-python/pull/464)
- [@r-barker-dev](https://github.com/r-barker-dev) — first contribution in [#524](https://github.com/hiero-ledger/hiero-sdk-python/pull/524)
- [@Pranay22077](https://github.com/Pranay22077) — first contribution in [#522](https://github.com/hiero-ledger/hiero-sdk-python/pull/522)
- [@gg21-prog](https://github.com/gg21-prog) — first contribution in [#527](https://github.com/hiero-ledger/hiero-sdk-python/pull/527)
- [@BhuvanaB404](https://github.com/BhuvanaB404) — first contribution in [#446](https://github.com/hiero-ledger/hiero-sdk-python/pull/446)
- [@Zaki-Mohammed](https://github.com/Zaki-Mohammed) — first contribution in [#459](https://github.com/hiero-ledger/hiero-sdk-python/pull/459)
- [@Manishdait](https://github.com/Manishdait) — first contribution in [#422](https://github.com/hiero-ledger/hiero-sdk-python/pull/422)

Thank you all — your work helps make Hiero stronger and more useful to developers.

---
