+++
title = "Hiero by the Numbers: Community Growth and Issue Difficulty Trends"
date = 2026-05-10
draft = false
featured_image = "/images/hiero-community-analytics.png"
abstract = "A data-driven look at Hiero's community growth and issue difficulty trends since 2025."
tags = ["community", "analytics", "open-source", "contributors"]

[[authors]]
name = "Daniel Ntege and Sophie Bulloch, Hiero community"
+++

We've been building out analytics tooling in the [hiero-hackers/analytics](https://github.com/hiero-hackers/analytics) repo to get a better picture of how the Hiero community is growing. Instead of guessing, we wanted real numbers — so here are two charts we're excited to share, along with what we think they mean.

---

## Who's showing up? Active contributors by year

![Stacked bar chart showing unique active contributors by role (General User, Triage, Committer, Maintainer) for 2025 and 2026.](/images/maintainer_pipeline_yearly.png)
*Maintainer Pipeline: Unique Active Contributors by Role — PR & Issue Activity (Yearly)*

This one is probably the most exciting chart for us. It counts how many unique people were active on Hiero's GitHub in each year — opening PRs, filing issues, commenting, reviewing — broken down by their role in the organization.

**We went from 282 active contributors in 2025 to 596 in 2026.** That's more than double in a single year, and honestly it's been incredible to watch.

Most of that growth came from **General Users** — people who don't hold a formal role in the Hiero org but are showing up, filing issues, opening PRs, and joining the conversation. That segment jumped from about 140 to over 400. This is exactly the kind of growth we want to see, because a healthy contributor base is how you find your next wave of Triagers, Committers, and Maintainers.

The **Triage, Committer, and Maintainer** tiers all grew too, even if they're a smaller slice of the bigger pie. Triagers in particular do a lot of the behind-the-scenes work — labeling issues, reproducing bugs, routing things to the right people — and it's great to see that group expanding alongside the broader community.

We think of this as a pipeline: people start by contributing casually, and over time some of them take on more responsibility. Tracking these numbers year over year helps us see whether that pipeline is actually working.

---

## How are we labeling issues by difficulty?

![Stacked area chart showing open issues by difficulty label (Good First Issue, Beginner, Intermediate, Advanced) from May 2025 to May 2026.](/images/difficulty_over_time_event_based_weekly.png)
*Open Issues by Difficulty Over Time (Event-Based) — weekly resolution*

This chart shows how many open issues have a difficulty label at any given time, split into four tiers: **Good First Issue**, **Beginner**, **Intermediate**, and **Advanced**. An important note: this only tracks issues that have been tagged with a difficulty label — it doesn't represent all open issues across Hiero, which is a much larger number.

A few things jump out:

**Labeling really got going in late 2025.** Maintainers started tagging issues with difficulty labels around December 2025. Because many of those labels were added to older issues, the chart counts each issue from the moment it was labeled — not from when it was originally created. This avoids a misleading spike and gives us an honest picture of when we actually started organizing issues by difficulty.

**From January 2026 onward, all tiers grew quickly.** As of May 2026, there are about 140 difficulty-labeled open issues, with Intermediate and Advanced making up the bulk. This growth reflects both new issues being filed and maintainers going back to label existing ones.

**Good First Issues are keeping pace.** There are currently around 35–40 Good First Issues available, which is a solid pool for newcomers looking for a place to start. The fact that this tier has grown alongside the others tells us maintainers are being intentional about keeping entry points available.

## A note on how the chart works

You might wonder why the chart starts mostly flat and then ramps up in late 2025. That's because we count each issue from the date it received its difficulty label, not from when it was opened. Since labeling started in December 2025, issues that existed before then only appear in the chart once they were tagged. This keeps the data honest — it shows what we actually knew at each point in time.

---

## Want to dig into the data?

Both charts come from scripts in [hiero-hackers/analytics](https://github.com/hiero-hackers/analytics). The tooling pulls data from the GitHub API and generates charts using Python. If you're curious or want to contribute — whether it's improving the charts, adding new ones, or helping label issues — the repo is open and we'd love the help. Check the README for setup instructions, and look for `good-first-issue` tags to get started.

---

*Charts generated from data as of early May 2026.*
