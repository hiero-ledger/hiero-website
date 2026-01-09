# Good First Issue Guidelines — Hiero Website

## Table of Contents

- [How To Use This Document](#how-to-use-this-document)
- [Purpose](#purpose)
- [Guidelines](#guidelines)
- [Assumptions](#assumptions)
- [Expected Scope & Time Guidance](#expected-scope--time-guidance)
- [What Qualifies as a Good First Issue](#what-qualifies-as-a-good-first-issue)
- [Good First Issue Categories](#good-first-issue-categories)
  - [1. Content Fixes](#1-content-fixes)
  - [2. Hugo Frontmatter & Configuration Changes](#2-hugo-frontmatter--configuration-changes)
  - [3. Markdown Formatting & Structural Corrections](#3-markdown-formatting--structural-corrections)
  - [4. File Organization](#4-file-organization)
  - [5. Links & References](#5-links--references)
  - [6. Explicit Removals](#6-explicit-removals)
- [What’s Typically Not a Good First Issue](#whats-typically-not-a-good-first-issue)
- [Asking Questions](#asking-questions)
- [Maintainer Guidance Checklist](#maintainer-guidance-checklist)
- [Common Red Flags](#common-red-flags)

---
## How to Use This Document

This guide is here to support maintainers and issue creators who use the **Good First Issue** label.

It offers shared language, examples, and guidance to help:

**Issue creators:**
- Feel confident when proposing a Good First Issue  
- Get inspiration for what makes a task a good starting point  
- Decide when another issue template might be a better fit  

**Maintainers:**
- Apply the Good First Issue label consistently  
- Keep issue difficulty labels clear and helpful  

This is not a rulebook, and it’s not meant to limit what kinds of contributions are welcome.

All contributions — big or small, simple or complex — are valuable to the Hiero project.  
This guide simply helps highlight which tasks are especially well-suited as a first step.

---

## Purpose

Good First Issues (GFIs) are designed to provide a **welcoming, confidence-building first contribution experience**.

For many people, contributing to a new repository means learning a new workflow, exploring an unfamiliar structure, and opening their first pull request. Good First Issues help make that journey smoother by focusing on **clear, approachable tasks**.

They allow contributors to spend more time learning the process and less time navigating uncertainty.


---

## Guidelines

A Good First Issue works best when it:

- Focuses on a small, clearly defined change  
- Includes helpful, step-by-step instructions  
- Keeps the task simple and approachable  

These qualities help contributors move forward with confidence and enjoy a smooth first experience.

**Helpful rule of thumb:**  
If an issue invites open-ended discussion about *what* should change or *how* it should look or read, it may be better suited for a different issue category.

---

## Assumptions

Good First Issues are designed to be welcoming and accessible to a wide range of contributors.

They aim to:

- Be easy to approach, even if you’re completely new to the project  
- Focus on straightforward, easy-to-follow changes  
- Make it simple to navigate the relevant parts of the site  
- Avoid the need for complex setup or tooling  

The focus is on helping contributors get comfortable with the workflow, make a meaningful change, and build confidence through a smooth first contribution experience.

---

## Expected Scope & Time Guidance

Good First Issues for the Hiero website are intentionally small and focused.

As a general reference:

- ⏱ **Estimated time:** ~1–4 hours  
- 📄 **Scope:** One file or a clearly defined area  
- 🧠 **Type:** Simple, approachable changes  

If an issue looks like it might take longer or involve multiple rounds of discussion, it may be better suited for another issue category.

---

## What Qualifies as a Good First Issue

Good First Issues tend to share a few common qualities:

- ✅ The task is clear
- ✅ The step-by-step solution is provided 
- ✅ The work is focused on a specific file or area  
- ✅ The result is straightforward to review  

The goal is to offer a **clear, low-stress first contribution experience** that helps people learn the workflow and feel confident getting involved.

---

## Good First Issue Categories

Most Good First Issues fall into one or more of the categories below.

These categories aren’t strict rules — they’re simply a helpful way to describe the kinds of changes that usually work well for first-time contributors.

---

### 1. Content Fixes

These are **small, corrective changes** where the right outcome is already known.

#### Good fits
- Spelling or grammar fixes  
- Punctuation or capitalization corrections  
- Removing duplicate text  
- Replacing text with wording that’s already provided  
- Removing content that’s clearly marked as outdated  

**Examples**
- Fix `Open-soruce` → `Open-source` in `content/_index.md`  
- Replace a sentence with a provided corrected version  

#### Less ideal
- Writing a new blog post  
- Rewording paragraphs for style 
- Making editorial changes  

---

### 2. Hugo Frontmatter & Configuration Changes

These are **simple value updates** that don’t affect layout or behavior.

#### Good fits
- Adding frontmatter fields when the key and value are provided  
- Updating existing values when the new value is specified  
- Renaming a frontmatter key in a single file  
- Toggling `draft = true/false`  

**Examples**
- Add `featured_image = "/images/Hiero_v4.png"` to `content/_index.md`  
- Change `draft = true` to `draft = false` in a specified file  

#### Less ideal
- Investigation to identify the correct frontmatter  
- Creating images or assets  
- Refactoring multiple files  
- Editing layouts or shortcodes  

---

### 3. Markdown Formatting & Structural Corrections

These are **syntax-level fixes**, not content decisions.

#### Good fits
- Fixing broken Markdown  
- Adjusting heading levels when the final structure is specified  
- Fixing list indentation or numbering  
- Correcting code block formatting  
- Reordering sections when the order is provided  

**Examples**
- Change `## Purpose` to `### Purpose` in a specified file  
- Fix a broken list using a provided corrected version  

#### Less ideal
- Redesigning the document structure  
- Improving flow or readability  
- Reorganizing content based on personal judgment  

---

### 4. File Organization

These changes should be **clear and specific**.

#### Good fits
- Deleting assets when filenames are listed  
- Renaming files when old and new names are provided  
- Updating references for named files  

**Examples**
- Delete `static/images/old-logo.png`  
- Rename `static/images/Hiero-logo-final.png` → `Hiero-logo.png`  

#### Less ideal
- Deciding which assets are unused  
- Optimizing or compressing images  
- Changing branding or formats  

---

### 5. Links & References

These are **direct updates**, not site-wide reviews.

#### Good fits
- Updating URLs when the new destination is provided  
- Fixing anchor links when the correct anchor is specified  
- Replacing outdated links with given alternatives  

**Examples**
- Replace `https://github.com/hashgraph` with `https://github.com/hiero-ledger`  
- Fix `#gettingstarted` → `#getting-started`  

#### Less ideal
- Searching for broken links  
- Asking to fix broken links, without a specified link

---

### 6. Explicit Removals

These are **clearly scoped cleanups**.

#### Good fits
- Removing commented-out blocks that are identified  
- Deleting examples with exact line ranges  
- Removing deprecated sections when instructed  

**Examples**
- Remove a block marked `<!-- OLD HERO SECTION -->`  
- Delete lines 42–55 of a specified file  

#### Less ideal
- General cleanup  
- Removing “anything that looks unused”  
- Deciding what’s obsolete  

---

## What’s Typically Not a Good First Issue

Some kinds of work are usually better suited for more experienced contributors, such as:

- Creating new pages or sections  
- Writing or expanding content  
- UX, design, or visual changes  
- Hugo themes, layouts, or templates  
- CSS or styling updates  
- Navigation or information architecture changes  
- Accessibility improvements  
- Site-wide refactors or audits  

These contributions are still valuable, but are better suited with a beginner, intermediate or advanced label applied.

---

## Asking Questions

Questions are always welcome — especially for:

- Clarifying instructions  
- Confirming file paths  
- Verifying acceptance criteria  

If answering a question requires deciding *what* should be changed, the issue may be better suited for a different category.

---

## Maintainer Guidance Checklist

An issue is usually a good fit for the **Good First Issue** label when:

- [ ] The expected change is clearly described  
- [ ] Files, text, or values are provided  
- [ ] The task is localized and straightforward  
- [ ] The outcome is easy to review  

If anything feels unclear, **Good First Issue — Candidate** is a helpful middle step.

---

## Common Red Flags

An issue may be better suited for a different category if:

- The solution needs to be explained in comments  
- Reviewers might disagree on the outcome  
- Back-and-forth on wording or structure is expected  
- The task feels “simple” but no step-by-step solution is provided

In those cases, choosing a different issue label can lead to a smoother experience for everyone.
