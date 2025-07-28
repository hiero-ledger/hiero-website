+++
title = 'Namespace Transition Announcement: Hedera Projects Moving to Hiero'
featured_image = "/images/transition.png"
preview_only = true
date = 2025-07-25T11:02:50-07:00
categories = ["Blog"]
duration = ""
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

If your projects rely on Hedera SDKs, APIs, or services, you will be directly impacted by this namespace transition. Specifically, the **key change involves updating the dependencies and namespaces in your projects from hashgraph to `hiero` or `hiero-ledger`.**

Each SDK will follow one of two possible namespace migration strategies, based on technical and community considerations:

- **Single-Step Cutover**: Also known as a hard cutover, this strategy involves switching entirely to the new namespace in a single release. After a specific version, all new releases will be published exclusively under the @hiero or @hiero-ledger namespace. Older versions will remain available under @hashgraph but will no longer receive updates.

- **Dual Publishing**: In this strategy, releases are published under both the old `@hashgraph` and new `@hiero` or `@hiero-ledger` namespaces for a defined transition period—typically 6 months. Identical releases appear in both namespaces, accompanied by migration documentation, deprecation warnings, and outreach to ease the transition.

## Migration Timeline and Action Items

**JavaScript SDK (**`@hiero-ledger`**)**

- The dual publishing process will begin from `v2.70.0`

- Dual publishing will continue for 6 months until `v2.82.0`

- Starting from `v2.83.0` the packages will only be published under `hiero-ledger`

→ [**Migration guidelines**](https://github.com/hiero-ledger/hiero-sdk-js/blob/main/manual/migration_hiero.md) for JavaScript SDK

**Rust SDK (**`hiero`**)**

- The dual publishing process will begin from `v0.38.0`

- Dual publishing will continue for 6 months until `v0.50.0`. Starting from `v0.51.0` the packages will only be published under `hiero`

→ [**Migration guidelines**](https://github.com/hiero-ledger/hiero-sdk-rust/blob/main/MIGRATION.md) for Rust SDK

**Java SDK (**`hiero`**)**

- Notice to the community for **9 months** will be provided before the hard cutover occurs.

- The Hiero Java SDK will be published under the new namepsace starting from version `2.80.0`

→ [**Migration guidelines**](https://github.com/hiero-ledger/hiero-sdk-java/blob/main/HIERO_MIGRATION.md) for Java SDK

We strongly encourage developers to update their dependencies early, ensuring a seamless transition when the migration period concludes. 


## **Resources and Support**

- [**Post introducing Hiero**](https://www.lfdecentralizedtrust.org/blog/hiero-advancing-decentralized-trust-through-open-source-innovation): Learn more about Hiero’s vision and roadmap.

- [**Hiero at LF Decentralized Trust Discord**](https://discord.com/invite/BCSKp4MKJm): Join the community discussions and stay connected.

- [**Hiero at GitHub**](https://github.com/hiero-ledger): Explore and contribute to Hiero projects directly on GitHub.

- [**SDK Collaboration Hub**](https://github.com/hiero-ledger/sdk-collaboration-hub): Join discussions, proposals, and best practices aimed at standardizing communication across all Hiero SDKs. This collaboration helps facilitate not only SDKs maintained by Hiero but also community-driven initiatives, such as the newly developed[ Python SDK](https://github.com/hiero-ledger/hiero-sdk-python).


## **Conclusion**

This transition is a significant leap forward for the distributed ledger technology community, embracing openness, decentralization, and collaboration. We look forward to working together through this exciting migration and seeing the innovative developments that Hiero will enable.

Stay tuned for further updates and reach out via [Discord](https://discord.lfdecentralizedtrust.org/) or [GitHub Discussions](https://github.com/orgs/hiero-ledger/discussions) with questions or feedback. Let's shape the future of decentralized trust together with Hiero!
