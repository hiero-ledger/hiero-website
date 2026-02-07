+++
title = "Hiero Python SDK – Announcing Release v0.1.6"
featured_image = "/images/python/blog_posts/v0.1.6.png"
date = 2025-10-24T11:00:00+01:00
categories = ["Blog"]
abstract = "Release 0.1.6 announced!"
[[authors]]
name = "chithraka-kal"
organization = "Python SDK Team"
image = "/images/python/members/chithraka-kal.jpeg"
+++

# 🚀 Hiero Python SDK – Announcing Release v0.1.6

We’re thrilled to announce **version 0.1.6** of the Hiero Python SDK!  
This release introduces powerful new transaction capabilities, improved allowance management, and refinements across multiple SDK examples — making development on Hedera even smoother for Python users.

A huge thank you to our talented contributors for making this release possible. ❤️

---

## ✨ What’s New in 0.1.6

This release expands the SDK’s transaction and topic management features, giving developers more flexibility and precision when interacting with Hedera.

### 🧾 New Features
- **Revenue-Generating Topic Examples:** Explore new topic tests and examples to better understand revenue-based use cases.
- **Enhanced Topic APIs:** Added `TopicCreate`, `TopicUpdate`, and `TopicInfo` transactions with new parameters:
  - `fee_schedule_key`
  - `fee_exempt_keys`
  - `custom_fees`
- **New Classes and Transactions:**
  - `CustomFeeLimit`
  - `TokenNftAllowance`
  - `TokenAllowance`
  - `HbarAllowance`
  - `HbarTransfer`
  - `AccountAllowanceApproveTransaction`
  - `AccountAllowanceDeleteTransaction`
- **Approved Transfer Support:** `TransferTransaction` now supports approved transfers.
- **New API Utility:** Added `Transaction.set_transaction_id()` for finer transaction control.
- **Allowance Examples:** Check out new practical examples:
  - `hbar_allowance.py`
  - `token_allowance.py`
  - `nft_allowance.py`

---

## 🔄 Improvements & Changes
We’ve streamlined the SDK’s internal handling and improved code readability across key modules.

- `TransferTransaction` now uses `TokenTransfer` and `HbarTransfer` classes instead of dicts, offering a cleaner and more structured approach.
- Added **checksum validation** for `TokenId` for safer and more reliable operations.
- Refactored examples for better readability and consistency:
  - `token_cancel_airdrop.py`
  - `token_associate.py` (now includes association verification query — PR [#367](https://github.com/hiero-ledger/hiero-sdk-python/pull/367))
  - `account_create.py` (enhanced modularity and readability — PR [#363](https://github.com/hiero-ledger/hiero-sdk-python/pull/363))

---

## 🐞 Fixes
- Fixed a **type assignment issue** in `token_transfer_list.py`.
- Corrected internal method references (`__require_not_frozen()` → `_require_not_frozen()`).
- Removed redundant `_is_frozen` method to reduce internal complexity.

---

## 📌 What else changed (high-level highlights)

This release bundles a number of additional PRs and fixes that improved examples, docs, type hints, and test coverage. Notable items in the release include:
- Checksum support for `TokenId.from_string()` (PR [#380](https://github.com/hiero-ledger/hiero-sdk-python/pull/380))
- New account allowance transaction support (PR [#401](https://github.com/hiero-ledger/hiero-sdk-python/pull/401))
- Refactors to token associate / token cancel airdrop examples (PRs [#408](https://github.com/hiero-ledger/hiero-sdk-python/pull/408), [#393](https://github.com/hiero-ledger/hiero-sdk-python/pull/393))
- Documentation and contributing improvements (PRs [#435](https://github.com/hiero-ledger/hiero-sdk-python/pull/435), [#447](https://github.com/hiero-ledger/hiero-sdk-python/pull/447))

For the **full changelog** see the release page or compare the tags:  
👉 [Full Changelog — v0.1.5...v0.1.6](https://github.com/hiero-ledger/hiero-sdk-python/compare/v0.1.5...v0.1.6)  
👉 Release page: [v0.1.6 on GitHub Releases](https://github.com/hiero-ledger/hiero-sdk-python/releases/tag/v0.1.6) — released by **[@exploreriii](https://github.com/exploreriii)**.

> Latest: v0.1.6 was released recently. There have been **8 commits to `main` since this release**.

---
## ⚡ Upgrade to the Latest Version

Update to the latest Hiero Python SDK release with:

```bash
pip install --upgrade hiero-sdk-python
```
---

## 🙌 Community growth — contributors spotlight

We’re excited to highlight community growth for this release: **10 new contributors** and **16 total contributors** took part in v0.1.6 — a great sign of momentum in the project.

### New contributors (first-time contributors for v0.1.6)
- [@tharun634](https://github.com/tharun634) — first contribution in [#408](https://github.com/hiero-ledger/hiero-sdk-python/pull/408)  
- [@AubreyDDD](https://github.com/AubreyDDD) — first contribution in [#413](https://github.com/hiero-ledger/hiero-sdk-python/pull/413)  
- [@kphero](https://github.com/kphero) — first contribution in [#411](https://github.com/hiero-ledger/hiero-sdk-python/pull/411)  
- [@drtoxic69](https://github.com/drtoxic69) — first contribution in [#426](https://github.com/hiero-ledger/hiero-sdk-python/pull/426)  
- [@BhuvanB404](https://github.com/BhuvanB404) — first contribution in [#435](https://github.com/hiero-ledger/hiero-sdk-python/pull/435)  
- [@DinethShakya23](https://github.com/DinethShakya23) — first contribution in [#447](https://github.com/hiero-ledger/hiero-sdk-python/pull/447)  
- [@Akshat1931](https://github.com/Akshat1931) — first contribution in [#430](https://github.com/hiero-ledger/hiero-sdk-python/pull/430)  
- [@Om7035](https://github.com/Om7035) — first contribution in [#437](https://github.com/hiero-ledger/hiero-sdk-python/pull/437)  
- [@arnav-terex](https://github.com/arnav-terex) — first contribution in [#463](https://github.com/hiero-ledger/hiero-sdk-python/pull/463)  
- [@gg21-prog](https://github.com/gg21-prog) — first contribution in [#451](https://github.com/hiero-ledger/hiero-sdk-python/pull/451)

**Total contributors for v0.1.6:** **16** (including the new contributors above and returning contributors). Thank you all — your work helps make Hiero stronger and more useful to developers.

---


