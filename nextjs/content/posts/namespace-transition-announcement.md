+++
title = "Namespace Transition Announcement: Hedera Projects Moving to Hiero"
featured_image = "/images/transition.png"
date = 2025-07-25T11:02:50-07:00
categories = ["Blog"]
preview_only = true
abstract = "Hedera projects are transitioning to Hiero, a vendor-neutral platform under the Linux Foundation Decentralized Trust. This involves a namespace change from hashgraph to `hiero` or `hiero-ledger`, impacting project dependencies and SDK imports. Developers are encouraged to update their dependencies accordingly to stay aligned with this evolution."
[[authors]]
name = "Michiel Mulders"
title = "Developer Relations Engineer"
organization = "Hashgraph"
link = "https://www.linkedin.com/in/michielmulders/"
image = "/images/profile-hiero.png"
+++

As previously announced in September 2024, Hedera projects have migrated to Hiero under Linux Foundation Decentralized Trust. This significant evolution involves a critical namespace transition from hashgraph to `hiero` or `hiero-ledger`, affecting project dependencies and SDK imports. This shift emphasizes greater transparency, collaboration, and open-source innovation, and developers are encouraged to update their dependencies accordingly to stay aligned.

## Why the Migration from Hedera to Hiero?

In September 2024, Hedera took the strategic step of open sourcing its entire codebase, [creating Hiero](https://hedera.com/blog/introducing-hiero-the-foundation-of-the-future)—an open, vendor-neutral platform hosted by the Linux Foundation’s LF Decentralized Trust. Hiero inherits Hedera’s robust technology and expands its reach by inviting community-driven collaboration, governance, and continuous innovation.

Hiero embraces an entirely open source and community-governed model, which makes it vendor-neutral, more transparent, inclusive, and fosters broader ecosystem growth.

## What Does This Mean for Developers?

Developers using Hedera SDKs in Java, JavaScript, or Rust projects must update their project configurations, including package identifiers and dependencies, from the previous hashgraph namespace to the new `hiero` or `hiero-ledger` namespaces.

Two primary migration strategies are being used, depending on the SDK:

### Single-Step Cutover

This involves a complete switch from the old namespace to the new one in a single, clearly defined release. After this release, new SDK updates will only be available under the new namespace. Older versions will remain accessible under the original `hashgraph` namespace but will no longer receive updates or new features.

**Java SDK**

- The Java SDK will transition to the new namespace starting from version `2.80.0` (approximately in 9 months).
- This change involves updating your build tools (e.g., Maven or Gradle configurations) to reflect the new groupId (`org.hiero`) and artifactId (`hiero-sdk`).
- Documentation and warnings about this upcoming transition will be clearly communicated leading up to the cutover.

→ [**Migration guidelines**](https://github.com/hiero-ledger/hiero-sdk-java/blob/main/HIERO_MIGRATION.md) for Java SDK

### Dual Publishing

Dual publishing involves simultaneously releasing SDK updates under both the old (`hashgraph`) and new (`hiero` or `hiero-ledger`) namespaces for a specific transition period (6 months). After the dual publishing period, updates will only appear under the new namespace. This approach allows developers time to migrate their dependencies gradually.

**JavaScript SDK**

- The dual publishing process will begin from `v2.70.0` to `v2.82.0` (6 months).
- Starting from version `2.83.0`, updates will exclusively appear under `@hiero-ledger`.

→ [**Migration guidelines**](https://github.com/hiero-ledger/hiero-sdk-js/blob/main/manual/migration_hiero.md) for JavaScript SDK

**Rust SDK**

- The dual publishing process will begin from `v0.38.0` to `v0.50.0` (6 months).
- Starting from version `v0.51.0`, updates will exclusively appear under `hiero`.

→ [**Migration guidelines**](https://github.com/hiero-ledger/hiero-sdk-rust/blob/main/MIGRATION.md) for Rust SDK

## Resources and Support

- [**Introduction to Hiero**](https://www.lfdecentralizedtrust.org/blog/hiero-advancing-decentralized-trust-through-open-source-innovation): Learn more about Hiero’s vision and roadmap.

- [**Hiero at LF Decentralized Trust Discord**](https://discord.com/invite/BCSKp4MKJm): For direct community support and discussions.

- [**Hiero GitHub**](https://github.com/hiero-ledger): Explore and contribute directly to Hiero projects.

- [**SDK Collaboration Hub**](https://github.com/hiero-ledger/sdk-collaboration-hub): Join broader community discussions, standardization initiatives, and efforts such as the newly developed[ Python SDK](https://github.com/hiero-ledger/hiero-sdk-python).

## Conclusion

This namespace migration is essential for the long-term sustainability and community-centric governance of Hiero. We encourage all developers to begin **updating their projects as soon as possible** to ensure a seamless transition.

For questions or additional support, please reach out via [Discord](https://discord.lfdecentralizedtrust.org/) or [GitHub Discussions](https://github.com/orgs/hiero-ledger/discussions). Let's work together to build the future of decentralized trust with Hiero.