# Advanced Issue Guidelines — Hiero Website

This document defines what we **do** and **do not** consider an *Advanced Issue* for the **Hiero website repository**.

Advanced Issues represent the **highest tier of contribution** for the Hiero website.  
They are intended for contributors with **deep familiarity** with the repository, strong Hugo knowledge, and the ability to **own high-impact changes end-to-end**.

This document **builds on**:
- **[Good First Issue Guidelines](./guidelines_good_first_issues.md)**
- **[Beginner Issue Guidelines](./guidelines_beginner_issues.md)**
- **[Intermediate Issue Guidelines](./guidelines_intermediate_issues.md)**

---

## Table of Contents

- [Purpose](#purpose)
- [How Advanced Issues Differ from Intermediate Issues](#how-advanced-issues-differ-from-intermediate-issues)
- [Assumptions](#assumptions)
- [What We Consider Advanced Issues](#what-we-consider-advanced-issues)
  - [1. Information Architecture & Navigation](#1-information-architecture--navigation)
  - [2. Hugo Templates, Layouts & Shortcodes](#2-hugo-templates-layouts--shortcodes)
  - [3. Site-Wide Content & Structural Refactors](#3-site-wide-content--structural-refactors)
  - [4. UX, Accessibility & Visual Changes](#4-ux-accessibility--visual-changes)
  - [5. Strategic Editorial & Governance Content](#5-strategic-editorial--governance-content)
- [What Is NOT an Advanced Issue](#what-is-not-an-advanced-issue)
- [Maintainer Guidance](#maintainer-guidance)

---

## Purpose

The goal of an **Advanced Issue** is to:

- ✅ Enable **high-impact, high-responsibility changes**
- ✅ Improve long-term usability, maintainability, or clarity of the site
- ✅ Introduce or evolve **structural or architectural patterns**
- ✅ Prepare contributors for **ongoing ownership or stewardship**

Advanced Issues may affect:
- Multiple sections of the site
- Site-wide behavior or structure
- Public-facing UX or navigation
- Long-term content strategy or governance materials

These issues carry **higher risk** and require careful review.

---

## How Advanced Issues Differ from Intermediate Issues

Advanced Issues differ from Intermediate Issues in that they:

- ❗ Require **design and architectural ownership**
- ❗ Involve **system-level thinking**
- ❗ Often affect **multiple areas of the site**
- ❗ May introduce new conventions or patterns
- ❗ Have **long-term impact** if done incorrectly

### Rule of Thumb

> If a contributor must **design or redesign systems,  
> evaluate trade-offs, and own long-term consequences**,  
> it is an **Advanced Issue**.


---

## Assumptions

Advanced Issues assume contributors are comfortable with:

- Netlify previews and tests
- Hugo content, layouts, templates, and shortcodes
- The full Hiero website structure and build process
- Reviewing changes holistically, not file-by-file
- Anticipating downstream and maintenance impact
- Communicating design decisions clearly in PRs

Advanced Issues **do not** assume:
- Marketing authority without alignment
- Product ownership
- Unilateral decision-making without review

---

## What We Consider Advanced Issues

Advanced Issues are:

- ✅ Clearly motivated but **not fully specified**
- ✅ Multi-file or site-wide in scope
- ✅ Design- and decision-heavy
- ✅ High impact, with medium to high risk
- ✅ Expected to require discussion and iteration

They often start with a **problem statement**, not a solution.

---

### 1. Information Architecture & Navigation

These involve **how users find and understand content**.

#### ✅ Allowed
- Redesigning navigation or menus
- Restructuring documentation hierarchies
- Introducing new content groupings or sections
- Improving discoverability across the site

#### ❌ Not Allowed
- Small ordering tweaks (Intermediate)
- Mechanical link changes (Beginner / GFI)

---

### 2. Hugo Templates, Layouts & Shortcodes

These involve **site behavior and rendering**.

#### ✅ Allowed
- Creating or modifying Hugo layouts or partials
- Introducing new shortcodes
- Refactoring templates for maintainability
- Improving performance or flexibility of layouts

#### ❌ Not Allowed
- Minor frontmatter-only changes
- Content-only updates without layout impact

---

### 3. Site-Wide Content & Structural Refactors

These involve **broad consistency and maintainability work**.

#### ✅ Allowed
- Large-scale documentation reorganizations
- Migrating content to new structures
- Removing or consolidating deprecated sections
- Enforcing new conventions across the site

#### ❌ Not Allowed
- Single-page edits (Beginner / Intermediate)
- Refactors without a clear migration plan

---

### 4. UX, Accessibility & Visual Changes

These involve **how the site looks and feels**.

#### ✅ Allowed
- Accessibility improvements (ARIA, contrast, semantics)
- Visual or layout redesigns
- Responsive behavior improvements
- Interaction or usability enhancements

#### ❌ Not Allowed
- Minor cosmetic tweaks
- One-off styling fixes

---

### 5. Strategic Editorial & Governance Content

These involve **high-importance content**.

#### ✅ Allowed
- Governance, roadmap, or policy documentation
- Major announcements or structural blog series
- Defining editorial standards or conventions
- Content requiring cross-team alignment

#### ❌ Not Allowed
- Casual blog posts (Intermediate)
- Minor doc updates (Beginner / Intermediate)

---

## What Is NOT an Advanced Issue

The following are **not** Advanced Issues:

- Purely mechanical tasks
- Small, localized changes
- Fully scripted work
- Low-risk formatting or content fixes
- Issues that do not require design or system thinking

These should use **Good First**, **Beginner**, or **Intermediate** labels instead.

---

## Maintainer Guidance

### Label as an Advanced Issue if the issue:

- ✅ Requires architectural or design decisions
- ✅ Has multiple valid solution paths
- ✅ Affects multiple parts of the site
- ✅ Has long-term maintenance implications
- ✅ Requires experienced review and iteration

### Do NOT label as an Advanced Issue if the issue:

- ❌ Is primarily mechanical or procedural
- ❌ Is well-bounded and low risk
- ❌ Can be completed without system-level reasoning
- ❌ Would overwhelm or block contributors unnecessarily

---

## Final Rule

> Advanced Issues are for **designing and evolving the system**,  
> not for **learning the workflow**.
