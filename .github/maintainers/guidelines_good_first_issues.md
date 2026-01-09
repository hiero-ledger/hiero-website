# Good First Issue Guidelines — Hiero Website

## Table of Contents

- [Purpose](#purpose)
- [Guidelines](#guidelines)
- [Assumptions](#assumptions)
- [Expected Scope & Time Guidance](#expected-scope--time-guidance)
- [What Qualifies as a Good First Issue](#what-qualifies-as-a-good-first-issue)
- [Allowed Categories](#allowed-categories)
  - [1. Content Fixes](#1-content-fixes)
  - [2. Hugo Frontmatter & Configuration Changes](#2-hugo-frontmatter--configuration-changes)
  - [3. Markdown Formatting & Structural Corrections](#3-markdown-formatting--structural-corrections)
  - [4. File Organization](#4-file-Organization)
  - [5. Links & References](#5-links--references)
  - [6. Explicit Removals](#6-explicit-removals)
- [What Is NOT a Good First Issue](#what-is-not-a-good-first-issue)
- [Asking Questions](#asking-questions)
- [Maintainer Enforcement Checklist](#maintainer-enforcement-checklist)
- [Maintainer Red Flags](#maintainer-red-flags)

---


## Purpose

Good First Issues (GFIs) exist to provide a **safe, confidence-building first pull request**.

We recognize that the hardest part of contributing to a new repository is often:
- Setting up the environment
- Understanding the repository structure
- Learning the contribution workflow
- Successfully opening a first pull request

Good First Issues are intentionally narrow so contributors can focus on **learning the workflow**, not solving open-ended problems.

---

## Guidelines

A Good First Issue **must** be:

- ✅ **Narrow in scope** — usually a single file or clearly defined location
- ✅ **Fully guided** — exact instructions and expected changes are provided
- ✅ **Mechanical** — no interpretation or decision-making required

> **Rule of thumb:**  
> If a contributor must decide *what* to change, *how it should read*, or *how it should look*, it is **not** a Good First Issue.

---

## Assumptions

Good First Issues must assume:

- ✅ No prior experience with Hiero or this repository
- ✅ No or very basic Hugo knowledge
- ✅ No content, design, or UX judgment
- ✅ No need to preview or run the site locally

They are an opportunity to get started, learn the workflow, and build confidence.

---

## Expected Scope & Time Guidance

Good First Issues for the Hiero website are intentionally small and tightly scoped.

As a general guideline:

- ⏱ **Estimated time:** ~1–4 hours 
  (often dominated by setup and learning the workflow)
- 📄 **Scope:** A single file or clearly defined location
- 🧠 **Cognitive load:** Mechanical changes only

If an issue is expected to take significantly longer than a few hours,  or requires multiple rounds of interpretation or review, it is **not** a Good First Issue.

---

## What Qualifies as a Good First Issue

Good First Issues are almost always:

- ✅ Mechanical edits
- ✅ Fully specified
- ✅ Single-file or single-location
- ✅ Low risk and easy to review

---

## Allowed Categories

Good First Issues must fall **entirely** within one or more of the categories below.  
If an issue does not clearly fit within these boundaries, it is usually **not** a Good First Issue.

---

### 1. Content Fixes

These are **purely corrective changes** where the correct outcome is already known.

#### ✅ Allowed
- Spelling mistakes
- Grammar mistakes
- Punctuation or capitalization errors
- Verbatim duplicate text removal
- Replacing text with **explicitly provided replacement text**
- Removing content explicitly identified as incorrect or obsolete

**Examples**
- Fix `Open-soruce` → `Open-source` in `content/_index.md`
- Replace a sentence with an explicitly provided corrected sentence

#### ❌ Not Allowed
- Writing new prose
- Rewriting sentences for clarity or tone
- Improving wording, voice, or style
- Editorial judgment of any kind

---

### 2. Hugo Frontmatter & Configuration Changes

These are **value-level edits** that do not affect structure or behavior.

#### ✅ Allowed
- Adding frontmatter fields **when the exact key and value are provided**
- Changing existing frontmatter values **when the new value is specified**
- Renaming a frontmatter key in a single file when instructed
- Setting `draft = true/false` when instructed

**Examples**
- Add `featured_image = "/images/Hiero_v4.png"` to `content/_index.md`
- Change `draft = true` to `draft = false` in a specified file

#### ❌ Not Allowed
- Introducing new frontmatter concepts
- Choosing images or assets
- Refactoring frontmatter across multiple files
- Editing layouts, templates, or shortcodes

---

### 3. Markdown Formatting & Structural Corrections

These are **syntax-level fixes**, not content decisions.

#### ✅ Allowed
- Fixing broken Markdown syntax
- Correcting heading levels **when the final structure is specified**
- Fixing list indentation or numbering
- Correcting code block formatting
- Reordering sections **when the exact order is provided**

**Examples**
- Change `## Purpose` to `### Purpose` in a specified file
- Fix a broken Markdown list using a provided corrected list

#### ❌ Not Allowed
- Deciding document structure
- Improving flow or readability
- Reorganizing content by judgment

---

### 4. File Organization

These changes must be **file-specific and enumerated**.

#### ✅ Allowed
- Deleting assets when exact filenames are listed
- Renaming assets when old and new names are provided
- Updating references **only** for explicitly listed files

**Examples**
- Delete `static/images/old-logo.png`
- Rename `static/images/Hiero-logo-final.png` → `Hiero-logo.png`

#### ❌ Not Allowed
- Determining which assets are unused
- Optimizing or compressing images
- Changing image formats or branding

---

### 5. Links & References

These are **direct substitutions**, not audits.

#### ✅ Allowed
- Updating URLs when the correct destination is provided
- Fixing anchor links when the correct anchor is specified
- Replacing outdated links with explicitly provided replacements

**Examples**
- Replace `https://github.com/hashgraph` with `https://github.com/hiero-ledger`
- Fix `#gettingstarted` → `#getting-started`

#### ❌ Not Allowed
- Finding broken links
- Auditing links across the site
- Adding new references

---

### 6. Explicit Removals

Removals must be **clearly bounded and intentional**.

#### ✅ Allowed
- Removing commented-out blocks that are explicitly identified
- Deleting unused examples when exact line ranges are provided
- Removing deprecated sections when explicitly instructed

**Examples**
- Remove a block marked `<!-- OLD HERO SECTION -->`
- Delete lines 42–55 of a specified file

#### ❌ Not Allowed
- General cleanup
- Removing “anything that looks unused”
- Deciding what is obsolete

---

## What Is NOT a Good First Issue

The following are **never** Good First Issues for the Hiero website:

- New pages or sections
- Content creation or expansion
- UX, design, or visual changes
- Hugo themes, layouts, or templates
- CSS or styling changes
- Navigation or information architecture changes
- Accessibility improvements
- Site-wide refactors or audits

These belong in **Beginner**, **Intermediate**, or **Advanced** issues.

---

## Asking Questions

Asking questions is encouraged.

However, questions should be limited to:
- Clarifying provided instructions
- Confirming file paths or locations
- Verifying that changes match the stated acceptance criteria

If answering a question requires deciding *what* should be changed,  
the issue is **not** a Good First Issue.

---

## Maintainer Enforcement Checklist

Apply the **Good First Issue** label only if **all** are true:

- [ ] Exact text, values, or filenames are provided
- [ ] Exact implementation steps are provided
- [ ] No interpretation or judgment is required
- [ ] Scope is minimal and localized
- [ ] Acceptance criteria are objective

If any item is unclear, use **`good first issue: candidate`** instead.

---

## Maintainer Red Flags

Do **not** label an issue as a Good First Issue if:

- You would need to explain the solution in comments
- Multiple reviewers could reasonably disagree on the result
- You expect back-and-forth on wording or structure
- The issue feels “simple” but not strictly mechanical

---
