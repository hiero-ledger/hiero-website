# Beginner Issue Guidelines — Hiero Website

This document defines what we **do** and **do not** consider a *Beginner Issue* for the **Hiero website repository**.

Beginner Issues represent the **next step after Good First Issues**.  
They are intended for contributors who have completed (or are comfortable with) a Good First Issue and are ready to take on **light coding, documentation, and investigation** in a Hugo-based website.

This document **builds on** the  
**[Good First Issue Guidelines](./guidelines_good_first_issues.md)**,  
which remain the baseline for scope, safety, and contributor experience.

---

## Table of Contents

- [Purpose](#purpose)
- [How Beginner Issues Differ from Good First Issues](#how-beginner-issues-differ-from-good-first-issues)
- [Assumptions](#assumptions)
- [What We Consider Beginner Issues](#what-we-consider-beginner-issues)
  - [1. Content Improvements](#1-content-improvements)
  - [2. Hugo Frontmatter & Page Structure](#2-hugo-frontmatter--page-structure)
  - [3. Markdown & Documentation Structure](#3-markdown--documentation-structure)
  - [4. File & Asset organization](#4-file--asset-organization)
  - [5. Links & References](#5-links--references)
- [What Is NOT a Beginner Issue](#what-is-not-a-beginner-issue)
- [Maintainer Guidance](#maintainer-guidance)

---

## Purpose

The goal of a **Beginner Issue** is to:

- ✅ Build confidence beyond purely mechanical tasks
- ✅ Encourage light investigation and reasoning
- ✅ Help contributors become comfortable navigating the repository
- ✅ Prepare contributors for more complex website or Hugo work

Beginner Issues allow contributors to make **small, safe decisions** while still remaining low risk and easy to review.

---

## How Beginner Issues Differ from Good First Issues

Beginner Issues differ from Good First Issues in that they:

- ❗ Require **some interpretation**
- ❗ May require reading existing content to understand context
- ❗ Are **not fully scripted**, but still well-scoped

### Rule of Thumb

> If a contributor must **read existing files and make small decisions**,  
> it is a **Beginner Issue**.

> If a contributor must **design new structure, UX, or visual behavior**,  
> it is **not**.

---

## Assumptions

Beginner Issues assume contributors are already familiar with:

- The basic Hiero website repository structure
- Netlify previews and tests
- Basic Hugo skills 
- Making pull requests
- Following contribution guidelines

Beginner Issues **do not** assume:
- Deep Hugo expertise
- CSS or frontend development experience
- Design or content strategy skills

---

## What We Consider Beginner Issues

Beginner Issues are:

- ✅ Well-scoped
- ✅ Low to moderate risk
- ✅ Open to questions and discussion
- ✅ Reviewable in a single pull request

They should have **clear intent**, even if the exact implementation is not fully prescribed.

---

### 1. Content Improvements

These involve **small content changes** that require understanding context.

#### ✅ Allowed
- Improving clarity or consistency of existing text
- Updating outdated wording when the new intent is stated
- Expanding an existing section with clearly defined goals
- Removing or consolidating redundant content after review

#### ❌ Not Allowed
- Writing entirely new pages
- Large-scale content rewrites
- Defining new messaging, tone, or narrative direction

---

### 2. Hugo Frontmatter & Page Structure

These issues involve **understanding existing page metadata**.

#### ✅ Allowed
- Adding missing frontmatter fields based on patterns elsewhere
- Normalizing frontmatter values across a small set of related pages
- Cleaning up inconsistent frontmatter usage in a directory
- Adjusting page visibility or ordering with stated intent

#### ❌ Not Allowed
- Designing new frontmatter schemas
- Changing how Hugo interprets frontmatter
- Editing layouts, templates, or shortcodes

---

### 3. Markdown & Documentation Structure

These involve **organizational improvements**.

#### ✅ Allowed
- Reorganizing sections to improve clarity
- Splitting overly long documents into smaller sections
- Combining short, redundant sections
- Improving headings and section hierarchy

#### ❌ Not Allowed
- Large documentation restructures
- Defining new documentation workflows
- Creating new documentation systems or conventions

---

### 4. File & Asset organization

These involve **light cleanup and consistency work**.

#### ✅ Allowed
- Identifying and removing unused assets with verification
- Renaming files for consistency and updating references
- Consolidating duplicate or redundant assets
- Improving directory organization with clear rationale

#### ❌ Not Allowed
- Visual or branding changes
- Image optimization or format conversion
- Large-scale asset refactors

---

### 5. Links & References

These involve **judgment-based link maintenance**.

#### ✅ Allowed
- Identifying and fixing broken links
- Updating outdated references based on current project state
- Normalizing references across related pages
- Improving internal linking for discoverability

#### ❌ Not Allowed
- Site-wide link audits without prior agreement
- Adding new external references without context
- SEO-focused or marketing-driven changes

---

## What Is NOT a Beginner Issue

The following are **not** Beginner Issues for the Hiero website:

- Hugo themes, layouts, or template changes
- CSS or styling work
- UX or visual design changes
- Navigation or information architecture redesigns
- Accessibility initiatives
- Site-wide refactors or audits
- Strategic or roadmap-driven content changes

These belong in **Intermediate** or **Advanced** issues.

---

## Maintainer Guidance

### Label as a Beginner Issue if the issue:

- ✅ Builds naturally on Good First Issues
- ✅ Requires light investigation or interpretation
- ✅ Has clear intent but not a fully scripted solution
- ✅ Is localized and low risk

### Do NOT label as a Beginner Issue if the issue:

- ❌ Is purely mechanical (use Good First Issue)
- ❌ Requires significant design or UX decisions
- ❌ Spans many unrelated areas of the site
- ❌ Represents architectural or long-term planning work

---

## Final Rule

> Beginner Issues are for **learning to work through more complicated issues**,  
> not for **designing systems**.
