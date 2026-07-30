+++
title = "Do Approved HIPs Get Built? Tracking HIP Completion at Hiero"
date = 2026-07-30
draft = true
featured_image = "/images/hip-completion.png"
abstract = "We can see Hiero Improvement Proposals being created and approved. Seeing them completed is much harder — here's what we built, how far we trust it, and what we'd like to change."
tags = ["governance", "analytics", "HIPs", "open-source"]

[[authors]]
name = "Sophie Bulloch"
organization = "Hiero Community"
+++

Hiero Improvement Proposals (HIPs) are how technical changes to Hiero get specified. A HIP is drafted, reviewed, and — if the Technical Steering Committee approves it — accepted. At [HIPs Tracker](https://github.com/orgs/hiero-ledger/projects/31), maintained by Michael Garber, the status of each proposed HIP is manually tracked through its various proposal stages (Review, Approved, Final, Deferred, Hiero Review). Once accepted, the HIP is implemented if community members choose to take it on - sometimes never, weeks or months after. 

The Hiero community has raised to the TSC that while the HIP approval process is tracked, the implementation of HIPs is not which means we lack insight into the real technical direction at Hiero Ledger. Angelina Ceppaluni has made great strides to manually track the rate of HIP completion across SDKs, but we currently lack automated methods to be able to effectively support this initiative across Hiero.

Our work at [Hiero Analytics](https://hiero-hackers.github.io/analytics/#hips) marks the first automated effort to track HIP implementations across Hiero Ledger.

This post shares how we have started tracking HIPs and what we can do as a community to improve the quality of our underlying dataset.

---

## What we built

The community analytics dashboard has a [HIPs tab](https://hiero-hackers.github.io/analytics/#hips). It sweeps every merged and open pull request across the Hiero organisation, finds references to HIP numbers in the commits, PR description or PR title, and validates them against a list of HIPs. It also attempts to exclude false postives, for instance, referring to a HIP but unblocking the issue rather than working on it.

This produces a few things:

- an **adoption funnel** for specs created since September 2024 — proposed, approved, then broad evidence for implementation. We can learn about the success rate that Hiero Ledger has of engineering HIPs.
- **which repositories engage with HIPs**, we can learn how engaged the community is in adopting HIPs
- **which HIPs are approved but not implemented**: approved or accepted specs that may have no implementation evidence anywhere
- a full **audit trail** — every (HIP, pull request) pair, with where it matched and the text that matched, downloadable as CSV



<!-- TODO: chart — hip_adoption_funnel.png -->

---

## What it can't tell you
Now, the challenge is the reliability of the data. The HIP dashboard is currently in a prototype stage as there are valid concerns as to what can yet be claimed:

**Finding a mention of a HIP in a pull request tells you where work concerning that HIP **may** have happened. It does not tell you the HIP was completed. Further, the list is probably not complete because some pull requests regarding HIPs have no descriptions stating so and others may be false positives.**

Someone might reference a HIP while doing something adjacent to it. A pull request might implement a fraction of a spec. A merged reference proves activity, not completion. So we built the pipeline to be deliberately evidence-only — it reports where references were found and classifies each spec by its strongest available evidence, and it never claims a HIP is done.

**But it does give us something to work from**. For the first time, an automated (can be created at a click of a button in just a few minutes), cross Hiero-Ledger HIP progression tracker. The community has already shared some feedback on approaches we could take to improve the underlying accuracy of the automated model.


We also had to work quite hard to avoid overclaiming:

- Pull requests in the proposals repository itself are excluded — writing a spec is not implementing it
- Numbers that don't match any known specification are quarantined into a review table rather than counted, since they're usually assigned-but-unmerged HIPs, legacy numbers, or false positives

None of this is a substitute for actually knowing. The accurate picture of which HIPs are complete has been maintained and judged by hand diving deep into the code — largely by Angelina Ceppaluni, whose manual tracking is something we can compare against in the future to judge the accuracy of the automated method.

---

## A better source of evidence

We would like to be able to track HIP implementations across Hiero Ledger in a more reliable way. One idea to reliably track HIP completion rates in the SDKs was raised by [Keith Kowal](https://github.com/reccetech) in the TSC meeting 28th, July 2026.

The [Hiero SDK TCK](https://github.com/hiero-ledger/hiero-sdk-tck) is a Technology Compatibility Kit — a conformance suite that verifies SDK implementations behave the way they're supposed to in the specifications.

A TCK test result is a categorically different kind of evidence from a text match:

| Source | What it proves |
|---|---|
| A HIP mentioned in a pull request | Somebody mentioned a HIP near some code |
| **A passing TCK test** | **The SDK demonstrably behaves as the spec requires** |

Currently the HIP dashboard tries to track HIP related work through HIP declarations in pull requests. Instead, if a TCK test passes in an SDK for a HIP it reliably tells us that the SDK has implemented the HIP to the required specification. Not only is it more accurate and will help us judge HIP completion in SDKs, it is a fully automated approach that cannot easily go stale as the CI runs it.

To faciliate the analytics dashboard incorporating the TCK evidence for HIP completion rates in SDKs, we have created a proposal to add explicit HIP references inside the TCK specifications [TCK Issue](https://github.com/hiero-ledger/hiero-sdk-tck/issues/674): one optional field naming the HIP, written once when a specification is authored. From there, two things fall out without anyone maintaining them:

- **Completeness** — does the TCK actually cover this HIP? Read from the existing implemented-or-not columns.
- **Conformity** — does each SDK pass those tests? Read from compatibility runs that already happen.

And the most useful output of all is the gap: **approved HIPs with no TCK coverage at all.** We currently track that by hand, in issue titles. It should be derivable.

---

## What this won't fix

The TCK only covers HIPs with an SDK-facing surface. Core, Mirror, Block Node, Process and Informational proposals have no conformance tests, and never will — so for those, the weaker evidence remains all we have. An idea raised by Steeven Sheehy in the TSC was to create a HIP tracker within each repository where maintainers can declare completion. Another option is to maintain a [central HIP tracker](https://github.com/hiero-ledger/governance/issues/678) in the governance repo.

---

## Where we'd like help

Three questions we genuinely don't have settled answers to.

**What does "complete" mean for a HIP?** Is a specification implemented when one SDK ships it, or when all of them do? When the consensus node supports it, or when clients can actually use it? 

**Should a spec referenced only by open pull requests count as in progress, or as nothing?** 

**Is the proposal reasonable?** [Issue #674](https://github.com/hiero-ledger/hiero-sdk-tck/issues/674) is open and still changeable.

The analytics are open source at [hiero-hackers/analytics](https://github.com/hiero-hackers/analytics), and the pipeline described here is all in the open.
---
