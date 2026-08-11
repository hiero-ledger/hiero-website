+++
title = "Hiero HIPS: Understanding HIP's at Hiero"
date = 2026-07-29
draft = false
featured_image = "/images/hip-completion.png"
abstract = "At Hiero, HIPS(Hiero Improvement Proposals) are put through a HIP workflow process. This blog aims to shed light into how HIPS are approved and what happens after approval."
tags = ["governance", "analytics", "HIPs", "open-source"]

[[authors]]
name = "Sophie Bulloch"
organization = "Hiero Community"
+++

# Hiero Improvement Proposals (HIPs)

Hiero Improvement Proposals (HIPs) are intended to provide information or initiate engineering efforts to update functionality under the Hiero governance. HIPs can be categorized in three ways:

* **Standards Track** — New Features or Implementations
* **Informational** — Design Issues or Guidelines
* **Process** — Process Changes

The initial [HIPs Tracker](https://github.com/orgs/hiero-ledger/projects/31), maintained by [Michael Garber](https://github.com/mgarbs), follows each proposal by hand through its stages: **Idea, Draft, Review, Last Call, Approval, Final Status,** and/or **Deferred**.

After final status, a HIP is implemented when community members make an issue and approve it for work.

> **This last step is where we aim to shed light on deployment.**
>
> HIP approval is tracked, but HIP implementation is not. This leaves us without insight into the real technical direction of Hiero Ledger. The community has raised this with the TSC.

[Angelina Ceppaluni](https://github.com/aceppaluni) has made great strides manually tracking HIP completion across the SDKs. Their work can be viewed at [HIP SDK Tracking](https://github.com/orgs/hiero-ledger/projects/46/views). However, there has not been an automated way to support that effort across the organization.

For more information on HIPs and the HIP workflow processes, visit the [HIP Presentation PowerPoint](/images/Hiero-Improvement-Proposals.pdf) or the [July 7th TSC Call](https://zoom.us/rec/play/Mu6L6WVjWIWpzaa8rODuo0IKfSL4E4UvuKjMMulmOG3z756uThk06PhbxRF0TvjAByNNhTDGTa-vBu2R.ns3mZmQnk6CyeD-Z?accessLevel=meeting%26canPlayFromShare=true%26from=share_recording_detail%26continueMode=true%26oldStyle=true%26componentName=rec-play%26originRequestUrl=https%3A%2F%2Fzoom.us%2Frec%2Fshare%2Fk1oXUWttx4QTBzpfi1mSmwyzjXGIHq9mcHgmjZqJVzmOsND9ja7ly8Qfu5_WxJad.NWCUiZYbvcnbbByO). Within this call, fast-forward to **15:53** to hear [Michael Garber's](https://github.com/mgarbs) presentation of the HIP Workflow process.

---

## What We Built

Our work at [Hiero Analytics](https://hiero-hackers.github.io/analytics/#hips) is the first automated attempt to track HIP implementations across Hiero Ledger.

The community analytics dashboard has a [HIPs tab](https://hiero-hackers.github.io/analytics/#hips). It sweeps **every merged and open pull request across the Hiero organization** and finds references to HIP numbers in commits, pull request titles, and descriptions. It then validates each one against the list of known HIPs.

The analytics dashboard also works to exclude false positives. For example, a pull request that mentions a HIP only as a blocker rather than something actively being worked on.

This produces several useful views:

* An **adoption funnel** for HIPs created since September 2024
* A view of **which repositories engage with HIPs**, showing broad community adoption
* A list of **HIPs approved but not implemented** — approved or accepted specifications with no implementation evidence found anywhere
* A full **audit trail** — every `(HIP, pull request)` pair, with where it matched and the text that matched, downloadable as CSV

> **The adoption funnel for the 34 HIPs created since September 2024.**
>
> Of those, 30 have reached approved status or beyond, 20 show evidence of implementation somewhere in the organization, and 9 show merged work in five or more repositories. Read the first stage carefully: it counts proposals that already have a HIP number and a merged file. It is a measure of how far accepted proposals travel.

![HIP coverage matrix](/images/hip-coverage-matrix.png)

*Matrix of HIPs against Hiero Ledger repositories, grouped into Final/Active and Approved/Accepted blocks. A dark blue cell means the repository has merged pull requests referencing that HIP. A light blue cell indicates only open pull requests reference it. The consensus node and mirror node columns are the densest. The SDKs cluster in the middle, and several recent HIPs (i.e., HIP-1137, HIP-1195, and HIP-1313) show evidence across nearly every column.*

Every cell can be traced back to the specific pull requests behind it via the audit trail. Each dashboard chart carries a provenance footer: the data watermark, the code revision that drew it, and the row count.

---

## What It Can't Tell You

The challenge is the reliability of the data. The HIPs dashboard is a prototype, and there are limits to what it can honestly claim.

**Finding a mention of a HIP in a pull request tells you where work on that HIP *may* have happened. However, it does not indicate the HIP was completed.**

The list is also incomplete in both directions. Some HIP-related pull requests never name the HIP they implement, and some matches will be false positives.

Someone might reference a HIP while doing something adjacent to it. A pull request might implement a fraction of a specification. A merged reference proves activity, not completion.

So the pipeline is **deliberately evidence-only**. It reports where references were found, classifies each HIP by its strongest available evidence, and never claims a HIP is done.

The matrix above highlights the same limitation from the opposite perspective. Of the 121 Final or Active HIPs — specifications that have already been implemented according to the HIP process — only 45 have any citing pull requests. The remaining 76 were implemented, but our sweep could not identify the corresponding pull requests.

> **Absence of evidence is not evidence of absence.**

**It does give us something to work from.** For the first time, we have an automated, organization-wide HIP progression tracker that can be regenerated in minutes at the click of a button. The community has already shared feedback on ways to improve its underlying accuracy.

The funnel also requires careful interpretation. An 88% approval rate sounds extraordinary, and it would be if it meant the TSC approved seven out of every eight proposals. The denominator is 34 proposals that have already been assigned a HIP number and contain a merged HIP file. Ideas that are rejected or abandoned before reaching that stage never enter the dataset. Therefore, the funnel reflects how far accepted proposals progress through the process, not how selective the process is overall.

We also had to work quite hard to avoid overclaiming:

* Pull requests in the proposals repository itself are excluded.
* Numbers that don't match any known HIP are quarantined into a review table rather than counted.
* The matrix is restricted to HIPs at **Approved, Accepted, Final,** or **Active** status. These are stages where implementation is actually expected. Draft or Deferred specs would count exploratory work as delivery.

None of this is a substitute for actually knowing. The accurate picture of which HIPs are complete has been maintained by hand, by diving deep into the code — largely by [Angelina Ceppaluni](https://github.com/aceppaluni), whose manual tracking provides a ground truth to measure the automated method against.

---

## A Better Source of Evidence

We want to track HIP implementations across Hiero Ledger far more reliably. One idea for the SDKs was raised by [Keith Kowal](https://github.com/reccetech) at the TSC meeting on July 28, 2026.

The [Hiero SDK TCK](https://github.com/hiero-ledger/hiero-sdk-tck) is a Technology Compatibility Kit — a conformance suite that verifies SDK implementations behave as the specifications require.

A TCK test result is a categorically different kind of evidence from a text match:

| Source                            | What It Proves                                        |
| --------------------------------- | ----------------------------------------------------- |
| A HIP mentioned in a pull request | Somebody mentioned a HIP near some code               |
| **A passing TCK test**            | **The SDK demonstrably behaves as the spec requires** |

Today the dashboard infers HIP work from declarations in pull requests. A passing TCK test for a HIP, by contrast, reliably tells us the SDK implements that HIP to specification. It is not only more accurate, but **is fully automated and cannot easily go stale, as CI re-runs it.**

To let the dashboard incorporate TCK evidence, we have proposed adding explicit HIP references to the TCK test specifications ([hiero-sdk-tck#674](https://github.com/hiero-ledger/hiero-sdk-tck/issues/674)): **one optional field naming the HIP, written once when a specification is authored.**

From there, two things fall out without anyone maintaining them:

* **Completeness** — Does the TCK actually cover this HIP? Read from the existing implemented-or-not columns.
* **Conformity** — Does each SDK pass those tests? Read from the compatibility runs that already happen.

And the most useful output of all is the gap: **approved HIPs with no TCK coverage at all.** We currently track that by hand, in issue titles. It should be derivable.

---

## What This Won't Fix

The TCK only covers HIPs with an SDK-facing surface. **Core, Mirror, Block Node, Process, and Informational proposals** do not have conformance tests, and never will. For those, the weaker evidence remains all we have.

Two ideas are on the table:

* [Steven Sheehy](https://github.com/steven-sheehy) suggested at the TSC that **each repository could have its own HIP tracker**, where maintainers declare completion.
* Alternatively, a [central HIP tracker](https://github.com/hiero-ledger/governance/issues/678) in the governance repository.

---

## Where We'd Like Help

Questions we genuinely don't have answers to:

### What does "complete" mean for a HIP?

* Is a specification implemented when one SDK ships it, or when all of them do?
* When the consensus node supports it, or when clients can actually use it?

### Should a HIP referenced only by open pull requests count as in progress?

### Is the proposal reasonable?

[hiero-sdk-tck#674](https://github.com/hiero-ledger/hiero-sdk-tck/issues/674) is open and still changeable.

### Is there a better alternative to track progress?

The analytics are open-source at [hiero-hackers/analytics](https://github.com/hiero-hackers/analytics), and the pipeline described here is in the open.

---
