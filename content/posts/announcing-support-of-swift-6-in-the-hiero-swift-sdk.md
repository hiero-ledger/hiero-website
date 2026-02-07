+++
title = "Announcing Support of Swift 6 in The Hiero Swift SDK"
featured_image = "/images/swift-6-support-banner.png"
date = 2026-02-02T12:00:00-05:00
categories = ["Blog"]
abstract = "The Hiero Swift SDK now officially supports Swift 6.0, 6.1, and 6.2 with full CI testing and compatibility guarantees."
[[authors]]
name = "Luke Forrest"
organization = "Hashgraph"
+++

## Official Swift 6 Support is Here

The Hiero Swift SDK will be officially supporting **Swift 6.0, 6.1, and 6.2** as of version v0.47.0 released February 2nd. This change is an investment in **safety, performance, and long-term alignment** with modern Swift tooling on Hiero. 

Upgrading the Hiero Swift SDK to support Swift 6 keeps Hiero aligned with Apple’s current requirements, which state that apps uploaded to App Store Connect must be built with Xcode 16 or later as of April 24, 2025. This release is focused on compatibility, so the SDK integrates cleanly into modern Swift 6.x codebases. It also sets Hiero up for future work that can take advantage of Swift 6’s stronger concurrency model, including sendable annotations, actor isolation, and compiler checks that help surface race conditions at build time.

---

### **Limited Support of Swift 5.x**

As of v0.47.0, **Swift 5.x is still compatible, however, with limited support.** We’re providing a clear notice period from **February 2, 2026 through August 3, 2026** after which Swift 5.x will no longer be supported.

* The **minimum supported Swift version remains 5.6** until August 3, 2026.
* Teams already building on **Swift 6.x do not need to take any action.**
* Teams on Swift 5.x should plan to upgrade before **August 3, 2026.**

## Support Table between February 2 and August 3, 2026

| Swift Version | CI Tested | Status |
| :------------ | :-------: | :------ |
| 6.2 | ✅ Yes | ✅ Officially Supported |
| 6.1 | ✅ Yes | ✅ Officially Supported |
| 6.0 | ✅ Yes | ✅ Officially Supported (recommended) |
| 5.10 | ✅ Yes | 🟡 Limited (compatible but upgrade recommended) |
| 5.9 | ✅ Yes | 🟡 Limited (compatible but upgrade recommended) |
| 5.8 | ❌ No | 🟡 Limited (compatible but upgrade recommended) |
| 5.7 | ❌ No | 🟡 Limited (compatible but upgrade recommended) |
| 5.6 | ❌ No | 🟡 Limited (minimum requirement, but upgrade recommended) |

---

## Key Dates and Next Steps

#### **February 2nd, 2026 - Support for Swift 6+ in the Hiero Swift SDK**

* The SDK release **v0.47.0 introduces official support for** Swift 6.0 / 6.1 / 6.2.
* Swift 5.x is compatible with limited support.

#### **August 3, 2026 onward - Swift Version 5.x No longer supported by the Hiero Swift SDK**

* As of August 3rd 2026, the minimum version required by the Hiero Swift SDK will be Swift 6.0

## Conclusion

If you are currently using the Hiero Swift SDK, please plan to upgrade to **Swift 6.x** before **August 3, 2026.**

If you have any questions or need guidance during this transition, please reach out on Hiero's [Discord](https://discord.com/invite/hyperledger) or other official community channels.