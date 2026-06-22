+++
title = "Hiero Enterprise Java – Announcing Release v0.20.0"
date = 2026-06-22T00:00:00+00:00
categories = ["Blog"]
abstract = "The Hiero Enterprise Java project has a new release: v0.20.0."
[[authors]]
name = "Hiero Community"
organization = "Hiero"
+++

We’re excited to share the news of our first release for [**hiero-enterprise-java**](https://github.com/hiero-ledger/hiero-enterprise-java/releases)!

* * *

## What Does This Release Includes?

This release introduces multiple API and framework enhancements, for example:
- New `accountClient` capabilities add support for allowance approval, cryptocurrency transfers and account updates
- HookStore transaction support, and Mirror Node Blocks API support across all supported frameworks.
- On the framework side, MicroProfile now exposes `TopicClient` and `TopicRepository` as CDI beans, and topic handling has been improved with JSON parsing fixes for both Spring and MicroProfile modules.
- Multiple correctness and reliability fixes
- Security and operational hardening were strengthened through signing configuration fixes, protections against leaking operator private keys or OS environment variables in logs, updated workflow permissions, pinned workflows, and StepSecurity best-practice adoption.

## Release Information And Artifacts?

- **Repository:** `hiero-ledger/hiero-enterprise-java`
- **Version:** `v0.20.0`
- **Published:** June 17, 2026
- **Release URL in GitHub:** [v0.20.0](https://github.com/hiero-ledger/hiero-enterprise-java/releases/tag/v0.20.0)
- **Release URL in Maven Central:**
  - [hiero-enterprise-spring](https://central.sonatype.com/artifact/org.hiero/hiero-enterprise-spring)
  - [hiero-enterprise-base](https://central.sonatype.com/artifact/org.hiero/hiero-enterprise-base)
  - [hiero-enterprise](https://central.sonatype.com/artifact/org.hiero/hiero-enterprise)
  - [hiero-enterprise-microprofile](https://central.sonatype.com/artifact/org.hiero/hiero-enterprise-microprofile)

## Release Notes


## Detailed Changelog

For the complete details of commits included, see the original GitHub release: [Release v0.20.0](https://github.com/hiero-ledger/hiero-enterprise-java/releases/tag/v0.20.0)

## Get Involved!

Clone and take a look at the code for [hiero-enterprise-java in GitHub.](https://github.com/hiero-ledger/hiero-enterprise-java).
Join our [LF Decentralized Trust Discord](https://discord.com/invite/hyperledger) for real time discussions on Hiero topics includding hiero-enterprise-java.
Take a look at [Hiero's public calendar](https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero) and join us in the next meeting. 
To learn more about Hiero, explore our [full content in GitHub](https://github.com/hiero-ledger).
