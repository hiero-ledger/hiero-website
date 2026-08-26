+++
title = "Hiero Python SDK – Announcing Release v0.1.3"
featured_image = "/images/python/blog_titles/blog_release_v0.1.3.jpg"
date = 2025-07-18T11:00:00-07:00
categories = ["Blog"]
abstract = "The Hiero Python SDK has a new v0.1.3 release!"
[[authors]]
name = "exploreriii"
organization = "Hiero Team"
image = "/images/python/members/exploreriii.png"
+++

This July, our Python SDK is racing ahead, and we’re excited to share the latest in new transaction support and version milestones. 

---

## 🚀 Latest Release: v0.1.3 (July 7, 2025)

In this release, we packed dozens of new transaction classes, queries, and utility improvements:

- **Various new classes**, including:
  - `Duration`
  - `AccountInfoQuery`
- **Extensive token services**, such as:
  - `NFTTokenCreateTransaction` for spinning up non‑fungible tokens
  - `TokenUnfreezeTransaction` to unfreeze tokens when needed
  - `TokenWipeTransaction` for wiping balances clean
  - `TokenNFTInfoQuery` to fetch NFT metadata
  - `TokenRejectTransaction` to manage association rejections
  - `TokenUpdateNftsTransaction` for batch NFT updates
- **Abstractions & node implementation**  
  – Introduced an `executable` abstraction and `node` implementation to simplify the codebase and make it easier to scale  
- **Improved testing & logging**  
  – Individual `unit` and `integration` tests for each transaction type  
  – Extensions to the `logging` module  
- **Pythonic type hinting**  
  – Added `type` annotations across several modules, with documentation on setting up [Mypy](https://mypy.readthedocs.io)

See the full changelog at [Github](https://github.com/hiero-ledger/hiero-sdk-python/releases/tag/v0.1.3)

---

## 🗒️ Other Recent Releases

### v0.1.2 (March 12, 2025)
- Added `NFTId` class for streamlined NFT identifier handling  
- Switched to SEC1 `ECPrivateKey` format instead of PKCS#8  

### v0.1.1 (February 25, 2025)
- Introduced `RELEASE.md` & `CONTRIBUTING.md`; revamped README files for clarity  
- Upgraded support from Python 3.9 to 3.10  

### v0.1.0 (February 19, 2025)
- **Inaugural release**: core SDK features, documentation, and example scripts  

---

## 🔭 Smart Contracts on the Horizon

We’ve laid the groundwork in our token and file‑service layers—now we’re shifting gears into file service and smart contract logic, with upcoming support for:

- `ContractCreateTransaction`
- `ContractExecuteTransaction`
- …and beyond.

Get ready to deploy and interact with contracts entirely in Python!  
