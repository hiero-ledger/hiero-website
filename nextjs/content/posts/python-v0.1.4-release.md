+++
title = "Hiero Python SDK – Announcing Release v0.1.4"
featured_image = "/images/python/blog_posts/v0.1.4.jpg"
date = 2025-08-29T11:00:00+01:00
categories = ["Blog"]
abstract = "Release 0.1.4 announced!"
[[authors]]
name = "exploreriii"
organization = "Python SDK Team"
image = "/images/python/members/exploreriii.png"
+++

# 🚀 The Python SDK Has a New Release – Welcome v0.1.4

This extensive update represents a **big leap** forward, especially for smart contract functionality, and comes with a range of improvements that make building on Hedera with Python easier, clearer, and more powerful. A huge thank you to our **talented contributors** for making this release possible.

---

## ✨ What’s New in 0.1.4

Using the Hiero Python SDK, you can now interact with the Hedera network in more ways than ever before.

#### 🚀 Work with Smart Contracts
- Create and Update contracts with `ContractCreateTransaction` and `ContractUpdateTransaction`
- Call and execute contract functions using `ContractCallQuery` and `ContractExecuteTransaction`.
- Inspect deployed contracts with `ContractInfoQuery` and `ContractBytecodeQuery`.
- Upload both `.bin` and `.bin-runtime` bytecode formats with improved utilities.

#### 🧑‍🤝‍🧑 Manage Accounts and Tokens
- Update account properties with `AccountUpdateTransaction`.
- Cancel pending airdrops via `TokenCancelAirdropTransaction`.
- Work with new airdrop classes: `PendingAirdropId`, `PendingAirdropRecord`.

#### 📂 Handle Files on the Network
- Update, delete, and query files with `FileUpdateTransaction`, `FileDeleteTransaction`, `FileContentsQuery`, and `FileInfoQuery`.
- Append file contents using `FileAppendTransaction`.

#### 🔐 Improved Key Support
- Added legacy ECDSA DER parse support.
- Clearer documentation for `PrivateKey.from_string`.
- Fixes for missing ECDSA handling in certain transaction types.

#### 📝 PEP8 Style & Code Quality
- Migrated many naming conventions from **camelCase → snake_case** to align with PEP8 (old names will still work for now, but will be removed in the next release).
- Linting and formatting improvements in the consensus module.

## 📚 Improved Developer Experience
With the surge of developer interest in the SDK, we’ve also invested in documentation:
- **Extended Contributing Guide**: step-by-step instructions for contributing, writing blog posts, and getting support.
- **Upstream Sync Guide**: documentation on how to sync with `main`.

---

## ⚡ Get Started
Upgrade to the latest release with:

```bash
pip install --upgrade hiero-sdk-python
```

Then try out contract creation, account updates, or file queries directly in your Python environment.

You can also check out our open issues (for both new starters and seasoned Python developers):  
👉 [GitHub Issues](https://github.com/hiero-ledger/hiero-sdk-python/issues)

And join our community meetings:  
- **Office Hour**: fortnightly drop-in help, next on **27th August**  
  [Join via Zoom](https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week)  

- **Community Call**: fortnightly community learning and discussion, next on **3rd September**  
  [Join via Zoom](https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week&occurrence=1758117600)

---

## 🙌 Thanks to Our Contributors
Big thanks to [**Dosik13**](https://github.com/Dosik13), [**nadineloepfe**](https://github.com/nadineloepfe), [**ivaylonikolov7**](https://github.com/ivaylonikolov7), [**manishdait**](https://github.com/manishdait), [**anirudhsengar**](https://github.com/anirudhsengar), [**rbarker-dev**](https://github.com/rbarker-dev), [**0xJohnZW**](https://github.com/0xJohnZW), [**Mounil2005**](https://github.com/Mounil2005), [**piyush588**](https://github.com/piyush588), and many more for making this release happen.

We’re excited to see what the community builds next! 🚀
