+++
title = "Announcing the Migration of hiero-enterprise-java to the Hiero Ledger Organization"
featured_image = "/images/hiero-enterprise-java.png"
date = 2026-03-04
categories = ["Blog"]
tags = ["Hiero Enterprise Java", "Open Source"]
slug = "hiero-enterprise-java"
description = "Announcing the Migration of hiero-enterprise-java to the Hiero Ledger Organization."
abstract = "The Hiero Enterprise Java project has officially moved to the Hiero Ledger organization, bringing APIs for integrating Hiero networks into Java frameworks like Spring Boot and MicroProfile while inviting the community to contribute to its development."
[[authors]]
name = "Hiero community"
+++

## 📢 Announcing the Migration of hiero-enterprise-java to the Hiero Ledger GitHub Organization

The Hiero team is excited to announce that the [Hiero Enterprise Java project](https://github.com/hiero-ledger/hiero-enterprise-java) has officially been migrated into the Hiero project. The codebase previously was hosted at the OpenElements organization and is now available under the [Hiero Ledger GitHub](https://github.com/hiero-ledger) organization.

This migration represents an important step toward strengthening the Hiero developer ecosystem by bringing enterprise-centered tooling directly under the vendor-neutral Hiero umbrella and making it available for other Hiero projects to collaborate to. 

## 📝 What is Hiero Enterprise Java?

The Hiero Enterprise Java project aims to provide easy-to-use, enterprise-friendly APIs that enable developers to interact with any Hiero-based network. A key focus of the project is aligning with widely adopted standards and frameworks within the Java enterprise ecosystem. Initial integrations target Spring Boot and Eclipse MicroProfile, allowing developers to work with Hiero using the same tools and frameworks commonly used in enterprise Java applications. The project leverages the Hiero Java SDK internally while also exposing APIs that simplify interaction with the public mirror node REST API.

Spring Boot is [currently used](https://www.jetbrains.com/lp/devecosystem-2021/java/#Java_which-frameworks-do-you-use-as-an-alternative-to-an-application-server-if-any) by approximately 66% of Java enterprise applications. When combined with Eclipse MicroProfile (including implementations such as Quarkus) the frameworks supported by this project cover more than 75% of the Java enterprise platform landscape.

## 📝 Project Architecture

The architecture of the project is highly modular, with a minimal dependency footprint designed to support seamless integration into a wide variety of enterprise environments. Each module depends only on the specific framework it supports (such as Eclipse MicroProfile 7.0) along with the Hiero Java SDK. In the future, the project may also explore integration with the [Web3j project](https://github.com/LFDT-web3j) under Linux Foundation Decentralized Trust (LFDT), pending further collaboration and discussion with the Web3j community.

The project provides samples for each framework and the public API is fully covered by Javadoc. In general, the same quality marks as for the [hiero-consensus-node](https://github.com/hiero-ledger/hiero-consensus-node) (final, nonNull, …) are used in the project.

Looking ahead, once the core feature set is complete, the project could potentially be proposed for inclusion among supported libraries in developer tools such as Spring Initializr (start.spring.io) or MicroProfile Starter (start.microprofile.io), making it even easier for developers to begin building enterprise applications powered by Hiero.

## 📝 Current State of the Project

The project already has a solid foundation:

- 18 releases have been published to Maven Central with new releases being produced under the hiero namespace.
- [14 contributors](https://github.com/hiero-ledger/hiero-enterprise-java/graphs/contributors) have participated in development.
- Existing components are considered stable and well-tested, supported by a combination of unit tests and integration tests based on the [hiero-solo-action](https://github.com/hiero-ledger/hiero-solo-action) environment.

To encourage community participation, the repository has historically included a set of “Good First Issue” tasks to help new contributors get started, and the maintainers plan to continue expanding these opportunities.

## 🧭 Vision for the Project

The project looks forward to providing a perfect integration in the mostly used enterprise framework of the Java ecosystem and allow a developer to easily interact with any Hiero-based network. It is important that the project supports not only consensus node endpoints, as the SDK does today, but also mirror node endpoints. By covering both layers of network interaction, the project can serve as a model for building similar enterprise integrations in other ecosystems and languages, such as JavaScript frameworks like React and Angular.

## Why the Migration Matters

✅ This migration places the project within the official Hiero open-source ecosystem.

✅ Encourages community participation in governance and development.

✅ Improves visibility for enterprise developers building on Hiero.

✅ Enables deeper collaboration with other Hiero and LFDT projects.

✅ Overall, it opens the door for a wider community of contributors to help shape the future of enterprise development on Hiero.

## Call for Contributors

We invite developers and enterprise Java enthusiasts to join us in developing future releases for our Hiero enterprise tooling. The team welcomes code contributions, documentation improvements, feature suggestions, new issue reports, CI improvements and testing. 

👉 Explore the code:
https://github.com/hiero-ledger/hiero-enterprise-java

👉 Stay in touch for future beginner-friendly issues:
https://github.com/hiero-ledger/hiero-enterprise-java/issues?q=label%3A%22good+first+issue%22
