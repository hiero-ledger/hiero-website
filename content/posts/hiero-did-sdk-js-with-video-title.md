+++
title          = "Announcing the Hiero DID SDK JS: A Modern JavaScript Toolkit for Decentralized Identity on Hedera"
featured_image = "/images/hiero-did-sdk-js.png"
date           = 2025-08-25T13:26:50-07:00
categories     = ["Blog"]
duration       = ""
abstract       = "Introducing the Hiero DID SDK JS — an open-source JavaScript toolkit for building decentralized identity applications on Hedera, with support for Hedera DID Method and Hedera AnonCreds Method."
[[authors]]
name           = "Hiero Team"
title          = ""
organization   = ""
link           = ""
image          = "/images/profile-hiero.png"
slug           = "hiero-did-sdk-js"
tags           = ["Hedera", "Decentralized Identity", "DID", "SDK", "AnonCreds", "Open Source"]
canonical_url  = "https://hiero.org/blog/hiero-did-sdk-js"
+++

![Hiero DID SDK JS Component View Diagram](https://github.com/hiero-ledger/hiero-did-sdk-js/raw/main/docs/modules/ROOT/images/component-view-diagram.png "Hiero DID SDK JS — Component View Diagram")


We’re excited to announce the initial GA release of the **Hiero DID SDK JS**, a modern, open-source JavaScript/TypeScript SDK that empowers developers to build decentralized identity (DID) applications on the Hedera network. Now officially maintained under the Hiero GitHub organization, this SDK fully implements the Hedera DID Method and Hedera AnonCreds Method specifications, extending the foundation laid by the original Hashgraph DID SDK.

---

[Watch the full overview and learn how the Hiero DID SDK JS powers decentralized identity on Hedera.](https://youtube.com/placeholder)

## Background

The core utility of the DID SDK JS is to support the anchoring of identity objects on the **Hedera Consensus Service (HCS)**. Anchoring identity objects on Hedera supports the decentralization of identity systems by providing a tamper-resistant, transparent, trusted distributed ledger where:

- Reading of these objects is anonymous, supporting user privacy
- Trust in associated credentials is preserved
- Decentralized governance ensures integrity

These identity objects can include **Decentralized Identifiers (DIDs)** and **AnonCreds** (anonymous credentials for privacy-preserving identity proofs).

A DID is a globally unique identifier representing an entity—such as a person, organization, or device—and is controlled directly by its owner through cryptographic keys. This model reduces reliance on centralized intermediaries and fosters trust in decentralized identity applications by leveraging Hedera’s **high-throughput consensus** and **decentralized governance**.

---

## Where It Comes From

The Hiero DID SDK JS builds on the original **@hashgraph/did-sdk-js**, which was created to support the Hedera DID Method—defining how DIDs, DID Documents, and identity messages are securely created, published, and resolved through HCS.

- The initial codebase was developed and donated by **Hashgraph Group**
- Advanced through collaboration with **DSR Corporation**, the **Hedera Foundation**, and the broader **Hiero community**
- Now governed under the **Linux Foundation’s Decentralized Trust initiative**

---

## What’s New in the Hiero DID SDK JS

This is more than a fork — it’s a standards-compliant reimplementation designed for real-world decentralized identity applications:

- Complete DID lifecycle management (create, update, deactivate, resolve)
- Secure key management for Hedera DIDs and credentials
- DID Document publishing to the Hedera network
- Convenient integration with HCS (HCS-1 standard support)
- Full **AnonCreds** support (schemas, credential definitions, revocation registries) in accordance with the Hedera AnonCreds Method
- **React Native** compatibility for mobile identity wallets
- Read operation caching for improved performance
- Automated tests and expanded developer documentation (architecture overview, quick start)

---

## Coming Soon: Hedera Credo Plugin

Work is underway on a **Hedera Credo Plugin**, connecting the Hiero DID SDK JS with **Credo** (the decentralized identity agent implementation hosted by the OpenWallet Foundation).

This will enable developers to integrate Hedera-native DIDs and AnonCreds workflows into:

- Wallets
- Credential issuers
- Verification services

---

## Use Cases: What You Can Build

This SDK is ideal for developers building secure, low-cost, and standards-compliant identity infrastructure. Example applications include:

- **Verifiable Credential Wallets** — cross-platform mobile apps with Hedera DIDs and AnonCreds
- **Public Sector Registries** — digital licenses, certificates, and permits on Hedera
- **Web3 Identity Integration** — DID-based login, credential-gated access, decentralized governance
- **Credential Issuers and Verifiers** — enable institutions to issue and verify credentials using open standards

---

## Get Involved

The Hiero DID SDK JS is now live, **Apache 2.0 licensed**, and open for community contributions. Developers are encouraged to explore, test, and extend the SDK.

- **Explore the SDK**: https://github.com/hiero-ledger/hiero-did-sdk-js
- **Hedera DID Method Spec**: https://github.com/hashgraph/did-method
- **Hedera AnonCreds Method Spec**: https://dsrcorporation.github.io/hedera-anoncreds-method/
- **Join the Discussion**: https://github.com/orgs/hiero-ledger/discussions

---

**Updated docs:** https://hiero-ledger.github.io/hiero-did-sdk-js/documentation/latest/index.html
