+++
title = "Do Approved HIPs Get Built? Tracking HIP Completion at Hiero"
date = 2026-07-29
draft = false
featured_image = "/images/hip-completion.png"
abstract = "We can see Hiero Improvement Proposals being created and approved. Seeing them completed is much harder — here's what we built, how far we trust it, and what we'd like to change."
tags = ["governance", "analytics", "HIPs", "open-source"]

[[authors]]
name = "Sophie Bulloch"
organization = "Hiero Community"
+++

Hiero Improvement Proposals (HIPs) are how technical changes to Hiero get specified. A HIP is drafted, reviewed, and — if the Technical Steering Committee (TSC) approves it — accepted. The [HIPs Tracker](https://github.com/orgs/hiero-ledger/projects/31), maintained by Michael Garber, follows each proposal by hand through its stages: Review, Approved, Final, Deferred, Hiero Review.

After acceptance, a HIP is implemented if and when community members choose to take it on — sometimes weeks or months later, sometimes never.

**That last step is the one we can't see.** The community has raised this with the TSC: HIP approval is tracked, but HIP implementation is not, which leaves us without insight into the real technical direction of Hiero Ledger.

Angelina Ceppaluni has made great strides manually tracking HIP completion across the SDKs, but there has been no automated way to support that effort across the whole organisation.

Our work at [Hiero Analytics](https://hiero-hackers.github.io/analytics/#hips) is the first automated attempt to track HIP implementations across Hiero Ledger. This post shares how we've started, and what we can do as a community to improve the quality of the underlying data.

---

## What we built

The community analytics dashboard has a [HIPs tab](https://hiero-hackers.github.io/analytics/#hips). It sweeps **every merged and open pull request across the Hiero organisation**, finds references to HIP numbers in commits, pull request titles and descriptions, and validates each one against the list of known HIPs.

It also works to exclude false positives — for instance, a pull request that mentions a HIP only as a blocker, rather than as the thing being worked on.

This produces a few things:

- an **adoption funnel** for HIPs created since September 2024 — proposed, approved, then broad evidence of implementation — showing what share of specifications Hiero Ledger actually engineers
- a view of **which repositories engage with HIPs**, showing how broadly the community adopts them
- a list of **HIPs approved but not implemented** — approved or accepted specifications with no implementation evidence found anywhere
- a full **audit trail** — every (HIP, pull request) pair, with where it matched and the text that matched, downloadable as CSV

![Funnel chart for HIPs created since September 2024: 100% proposed, 88% approved by the TSC, 59% with implementation evidence, 26% implemented in five or more repositories.](/images/hip-adoption-funnel.png)
*The adoption funnel for HIPs created since September 2024. Of the specs proposed, 88% were approved by the TSC, 59% show implementation evidence somewhere in the organisation, and 26% show merged work in five or more repositories.*

![Matrix of HIPs against hiero-ledger repositories, grouped into Final/Active and Approved/Accepted blocks. A dark blue cell means the repository has merged pull requests referencing that HIP; a light blue cell means only open pull requests reference it. The consensus node and mirror node columns are the densest, the SDKs cluster in the middle, and several recent HIPs such as HIP-1137, HIP-1195 and HIP-1313 show evidence across nearly every column.](/images/hip-coverage-matrix.png)
*The coverage matrix, restricted to HIPs at a stage where implementation is expected. Dark cells are merged referencing pull requests; light cells are open ones. Wide rows — like HIP-991, HIP-1137 and HIP-1313 — are specifications being picked up right across the organisation. A row with a single cell may be complete, or may be work that stalled: **the matrix can't tell you which**, and that's the point of this post.*

Every cell can be traced back to the specific pull requests behind it via the audit trail, and each dashboard chart carries a provenance footer — the data watermark, the code revision that drew it, and the row count.

---

## What it can't tell you

The challenge is the reliability of the data. The HIPs dashboard is a prototype, and there are limits to what it can honestly claim.

**Finding a mention of a HIP in a pull request tells you where work on that HIP *may* have happened. It does not tell you the HIP was completed.** The list is also incomplete in both directions: some HIP-related pull requests never name the HIP they implement, and some matches will be false positives.

Someone might reference a HIP while doing something adjacent to it. A pull request might implement a fraction of a specification. A merged reference proves activity, not completion.

So the pipeline is **deliberately evidence-only**. It reports where references were found, classifies each HIP by its strongest available evidence, and never claims a HIP is done.

The matrix above makes the same limit visible from the other direction. Of the **121 Final or Active HIPs** — specifications that have already been implemented, per the HIP process — only **45 show any citing pull requests at all**. The other 76 were built, and our sweep cannot see it.

> Absence of evidence is not evidence of absence.

**But it gives us something to work from:** for the first time, an automated, organisation-wide HIP progression tracker that can be regenerated in minutes at the click of a button. The community has already shared feedback on ways to improve its underlying accuracy.

We also had to work quite hard to avoid overclaiming:

- Pull requests in the proposals repository itself are excluded — writing a specification is not implementing it
- Numbers that don't match any known HIP are quarantined into a review table rather than counted, since they're usually assigned-but-unmerged HIPs, legacy numbers, or false positives

None of this is a substitute for actually knowing. The accurate picture of which HIPs are complete has been maintained by hand, by diving deep into the code — largely by Angelina Ceppaluni, whose manual tracking gives us a ground truth to measure the automated method against.

---

## A better source of evidence

We would like to track HIP implementations across Hiero Ledger far more reliably. One idea for the SDKs was raised by [Keith Kowal](https://github.com/reccetech) at the TSC meeting on 28 July 2026.

The [Hiero SDK TCK](https://github.com/hiero-ledger/hiero-sdk-tck) is a Technology Compatibility Kit — a conformance suite that verifies SDK implementations behave the way their specifications require.

A TCK test result is a categorically different kind of evidence from a text match:

| Source | What it proves |
|---|---|
| A HIP mentioned in a pull request | Somebody mentioned a HIP near some code |
| **A passing TCK test** | **The SDK demonstrably behaves as the spec requires** |

Today the dashboard infers HIP work from declarations in pull requests. A passing TCK test for a HIP, by contrast, reliably tells us the SDK implements that HIP to specification. It is not only more accurate — **it is fully automated and cannot easily go stale, because CI re-runs it.**

To let the dashboard incorporate TCK evidence, we have proposed adding explicit HIP references to the TCK test specifications ([hiero-sdk-tck#674](https://github.com/hiero-ledger/hiero-sdk-tck/issues/674)): **one optional field naming the HIP, written once when a specification is authored.**

From there, two things fall out without anyone maintaining them:

- **Completeness** — does the TCK actually cover this HIP? Read from the existing implemented-or-not columns.
- **Conformity** — does each SDK pass those tests? Read from the compatibility runs that already happen.

And the most useful output of all is the gap: **approved HIPs with no TCK coverage at all.** We currently track that by hand, in issue titles. It should be derivable.

---

## What this won't fix

The TCK only covers HIPs with an SDK-facing surface. **Core, Mirror, Block Node, Process and Informational proposals have no conformance tests, and never will** — so for those, the weaker evidence remains all we have.

Two ideas are on the table:

- Steven Sheehy suggested at the TSC that **each repository could keep its own HIP tracker**, where maintainers declare completion
- Alternatively, a [central HIP tracker](https://github.com/hiero-ledger/governance/issues/678) in the governance repository

---

## Where we'd like help

Three questions we genuinely don't have settled answers to:

**What does "complete" mean for a HIP?** Is a specification implemented when one SDK ships it, or when all of them do? When the consensus node supports it, or when clients can actually use it?

**Should a HIP referenced only by open pull requests count as in progress, or as nothing?**

**Is the proposal reasonable?** [hiero-sdk-tck#674](https://github.com/hiero-ledger/hiero-sdk-tck/issues/674) is open and still changeable.

The analytics are open source at [hiero-hackers/analytics](https://github.com/hiero-hackers/analytics), and the pipeline described here is all in the open.

---
