# Intermediate Issue Guidelines — Hiero Website

This document defines what we **do** and **do not** consider an *Intermediate Issue* for the **Hiero website repository**.

Intermediate Issues represent the **next step after Beginner Issues**.  
They are intended for contributors who are comfortable navigating the repository, understanding Hugo concepts at a practical level, and owning a change from **investigation through implementation**.

This document **builds on**:
- **[Good First Issue Guidelines](./guidelines_good_first_issues.md)**
- **[Beginner Issue Guidelines](./guidelines_beginner_issues.md)**

---

## Table of Contents

- [Purpose](#purpose)
- [How Intermediate Issues Differ from Beginner Issues](#how-intermediate-issues-differ-from-beginner-issues)
- [Assumptions](#assumptions)
- [What We Consider Intermediate Issues](#what-we-consider-intermediate-issues)
  - [1. Content & Editorial Work](#1-content--editorial-work)
  - [2. Hugo Frontmatter, Sections & Page Behavior](#2-hugo-frontmatter-sections--page-behavior)
  - [3. Documentation & Information Architecture](#3-documentation--information-architecture)
  - [4. File, Asset & Content Organization](#4-file-asset--content-organization)
  - [5. Blog & Editorial Contributions](#5-blog--editorial-contributions)
- [What Is NOT an Intermediate Issue](#what-is-not-an-intermediate-issue)
- [Maintainer Guidance](#maintainer-guidance)

---

## Purpose

The goal of an **Intermediate Issue** is to:

- ✅ Build ownership and confidence
- ✅ Encourage independent investigation and reasoning
- ✅ Allow contributors to make **design-adjacent decisions**
- ✅ Prepare contributors for advanced website or governance-related work

Intermediate Issues allow contributors to **decide how to implement intent**,  
while still avoiding large-scale redesigns or architectural risk.

---

## How Intermediate Issues Differ from Beginner Issues

Intermediate Issues differ from Beginner Issues in that they:

- ❗ Require **independent investigation**
- ❗ Involve **multiple reasonable implementation options**
- ❗ Require understanding of existing structure and patterns
- ❗ May span **multiple related files**

### Rule of Thumb

> If a contributor must **investigate existing structure, reason about trade-offs,  
> and choose an approach**, it is an **Intermediate Issue**.

> If the work requires **visual design, UX redesign, or long-term planning**,  
> it is **not**.

---

## Assumptions

Intermediate Issues assume contributors are comfortable with:

- Netlify previews and tests
- The Hiero website repository structure
- Hugo content organization and frontmatter patterns
- Editing and organizing Markdown at scale
- Making pull requests with minimal guidance
- Asking targeted questions when clarification is needed

Intermediate Issues do **not** assume:
- Deep frontend or CSS expertise
- Hugo template or theme authoring skills
- Marketing or branding ownership

---

## What We Consider Intermediate Issues

Intermediate Issues are:

- ✅ Clearly motivated
- ✅ Moderately scoped
- ✅ Reviewable in a single pull request
- ✅ Allowing contributor judgment within guardrails

They should state **what problem exists and why**,  
but may leave **how to solve it** up to the contributor.

---

### 1. Content & Editorial Work

These involve **non-mechanical content changes** with defined goals.

#### ✅ Allowed
- Writing or significantly revising existing pages
- Improving clarity, consistency, or completeness of documentation
- Refactoring content for accuracy or maintainability
- Aligning content with updated project direction when intent is stated

#### ❌ Not Allowed
- Defining new messaging or brand voice without alignment
- Large marketing campaigns or announcements
- Open-ended “write content about X” with no guardrails

---

### 2. Hugo Frontmatter, Sections & Page Behavior

These involve **understanding Hugo’s content model**.

#### ✅ Allowed
- Designing or refining frontmatter usage for a section
- Introducing new content sections using existing layout patterns
- Improving page organization or ordering using Hugo mechanisms
- Refactoring frontmatter across related pages for consistency

#### ❌ Not Allowed
- Creating or modifying Hugo templates, themes, or shortcodes
- Changing global site behavior
- Introducing undocumented Hugo patterns

---

### 3. Documentation & Information Architecture

These involve **structural decisions across documentation**.

#### ✅ Allowed
- Reorganizing documentation sections for clarity
- Creating new documentation pages when intent is clear
- Consolidating or splitting documentation based on usage
- Improving discoverability through structure and linking

#### ❌ Not Allowed
- Large-scale documentation system redesigns
- Introducing new documentation frameworks or tooling
- Cross-site restructures without prior discussion

---

### 4. File, Asset & Content Organization

These involve **judgment-based cleanup and organization**.

#### ✅ Allowed
- Identifying and removing unused assets with justification
- Reorganizing directories for clarity
- Consolidating duplicated assets or content
- Improving naming conventions across related files

#### ❌ Not Allowed
- Visual or branding changes
- Performance-driven asset optimization
- Large refactors spanning unrelated sections

---

### 5. Blog & Editorial Contributions

These involve **original content creation**.

#### ✅ Allowed
- Writing new blog posts with a defined topic and scope
- Drafting announcements, updates, or educational posts
- Revising or expanding existing blog content
- Coordinating blog content with documentation or releases

#### ❌ Not Allowed
- Open-ended thought leadership without alignment
- Marketing-driven campaigns without review
- High-risk or sensitive announcements

> Blog posts are **Intermediate Issues by default**  
> unless explicitly escalated.

---

## What Is NOT an Intermediate Issue

The following are **not** Intermediate Issues for the Hiero website:

- Hugo theme, layout, or template changes
- CSS, styling, or visual redesigns
- Accessibility initiatives requiring specialist knowledge
- Navigation or UX redesigns
- Site-wide audits or refactors
- Strategic, roadmap-level, or governance decisions

These belong in **Advanced Issues**.

---

## Maintainer Guidance

### Label as an Intermediate Issue if the issue:

- ✅ Builds naturally on Beginner Issues
- ✅ Requires investigation and interpretation
- ✅ Has clear intent but multiple valid solutions
- ✅ Is reasonably completable in a single PR
- ✅ Includes enough context to avoid unintended changes

### Do NOT label as an Intermediate Issue if the issue:

- ❌ Is purely mechanical (use Good First Issue)
- ❌ Requires minimal judgment (use Beginner Issue)
- ❌ Has high risk of silent breakage
- ❌ Requires deep frontend, UX, or architectural expertise
- ❌ Represents long-term or strategic planning

---

## Final Rule

> Intermediate Issues are for **learning to own solutions**,  
> not for **redesigning the system**.
