# Intermediate Issue Guidelines — Hiero Website

Intermediate Issues represent the **next step after Beginner Issues**.

They’re designed for contributors who feel comfortable navigating the repository, working with Hugo content at a practical level, and taking ownership of a change from **investigation through implementation**.

This guide builds on:

- **[Good First Issue Guidelines](./guidelines_good_first_issues.md)**
- **[Beginner Issue Guidelines](./guidelines_beginner_issues.md)**

and exists to support consistent, clear use of the **Intermediate Issue** label.

---

## Table of Contents

- [How to Use This Document](#how-to-use-this-document)
- [Purpose](#purpose)
- [How Intermediate Issues Differ from Beginner Issues](#how-intermediate-issues-differ-from-beginner-issues)
- [Assumptions](#assumptions)
- [What We Consider Intermediate Issues](#what-we-consider-intermediate-issues)
  - [1. Content & Editorial Work](#1-content--editorial-work)
  - [2. Hugo Frontmatter, Sections & Page Behavior](#2-hugo-frontmatter-sections--page-behavior)
  - [3. Documentation & Information Architecture](#3-documentation--information-architecture)
  - [4. File, Asset & Content Organization](#4-file-asset--content-organization)
  - [5. Blog & Editorial Contributions](#5-blog--editorial-contributions)
- [What’s Typically Not an Intermediate Issue](#whats-typically-not-an-intermediate-issue)
- [Maintainer Guidance](#maintainer-guidance)

---

## How to Use This Document

This guide supports maintainers and issue creators who use the **Intermediate Issue** label.

It offers shared language and examples to help:

**Issue creators:**
- Propose well-scoped Intermediate Issues  
- Identify tasks that build naturally on Beginner Issues  
- Decide when another issue category might be a better fit  

**Maintainers:**
- Apply the Intermediate label consistently  
- Keep issue difficulty levels clear and helpful  

This is not a rulebook, and it’s not meant to limit what kinds of contributions are welcome.

All contributions — big or small, simple or complex — are valuable to the Hiero project.  
This guide simply highlights tasks that are well-suited for contributors who are ready for more ownership and flexibility.

---

## Purpose

Intermediate Issues are designed to:

- Build confidence through ownership  
- Encourage independent investigation and reasoning  
- Support thoughtful, design-adjacent decisions  
- Prepare contributors for more advanced website or governance-related work  

They allow contributors to decide **how** to implement a clear goal,  
while still avoiding large-scale redesigns or architectural risk.

---

## How Intermediate Issues Differ from Beginner Issues

Intermediate Issues introduce more flexibility than Beginner Issues.

They often:

- Involve independent investigation  
- Offer multiple reasonable implementation options  
- Require understanding existing structure and patterns  
- May span several related files  

**Helpful way to think about it:**

- If the task involves light interpretation → *Beginner Issue*  
- If the task involves choosing an approach → *Intermediate Issue*  

---

## Assumptions

Intermediate Issues are designed for contributors who are growing more comfortable with the project.

They aim to:

- Build on familiarity with the repository and workflow  
- Encourage thoughtful exploration of existing structure  
- Support independent problem-solving  
- Keep changes reviewable and low risk  

They don’t require deep frontend expertise, template authoring, or branding ownership — just curiosity, care, and a willingness to learn.

---

## What We Consider Intermediate Issues

Intermediate Issues are typically:

- Clearly motivated  
- Moderately scoped  
- Reviewable in a single pull request  
- Open to contributor judgment within clear intent  

They should explain **what the problem is and why it matters**,  
while leaving **how to solve it** up to the contributor.

---

### 1. Content & Editorial Work

These involve **non-mechanical content changes** with defined goals.

#### Good fits
- Writing or significantly revising existing pages  
- Improving clarity, consistency, or completeness  
- Refactoring content for accuracy or maintainability  
- Aligning content with updated project direction  

#### Less ideal
- Defining new messaging or brand voice without alignment  
- Large marketing campaigns or announcements  
- Open-ended “write about X” tasks with no guardrails  

---

### 2. Hugo Frontmatter, Sections & Page Behavior

These involve **working with Hugo’s content model**.

#### Good fits
- Refining frontmatter usage for a section  
- Introducing new content sections using existing patterns  
- Improving page organization or ordering  
- Normalizing frontmatter across related pages  

#### Less ideal
- Editing templates, themes, or shortcodes  
- Changing global site behavior  
- Introducing undocumented Hugo patterns  

---

### 3. Documentation & Information Architecture

These involve **structural decisions across documentation**.

#### Good fits
- Reorganizing sections for clarity  
- Creating new documentation pages with clear intent  
- Consolidating or splitting documentation  
- Improving discoverability through structure and linking  

#### Less ideal
- Large-scale documentation system redesigns  
- Introducing new documentation tooling  
- Cross-site restructures without prior discussion  

---

### 4. File, Asset & Content Organization

These involve **judgment-based cleanup and organization**.

#### Good fits
- Identifying and removing unused assets with justification  
- Reorganizing directories for clarity  
- Consolidating duplicated assets or content  
- Improving naming conventions across related files  

#### Less ideal
- Visual or branding changes  
- Performance-driven asset optimization  
- Large refactors across unrelated sections  

---

### 5. Blog & Editorial Contributions

These involve **original content creation**.

#### Good fits
- Writing new blog posts with a defined topic  
- Drafting announcements or updates  
- Revising or expanding existing blog content  
- Coordinating blog content with releases  

#### Less ideal
- Open-ended thought leadership without alignment  
- Marketing-driven campaigns without review  
- High-risk or sensitive announcements  

> Blog posts are typically treated as **Intermediate Issues**  
> unless explicitly escalated.

---

## What’s Typically Not an Intermediate Issue

Some kinds of work are usually better suited for more advanced issue categories, such as:

- Hugo theme, layout, or template changes  
- CSS, styling, or visual redesigns  
- Accessibility initiatives requiring specialist knowledge  
- Navigation or UX redesigns  
- Site-wide audits or refactors  
- Strategic, roadmap-level, or governance decisions  

---

## Maintainer Guidance

### An Intermediate Issue is usually a good fit when:

- It builds naturally on Beginner Issues  
- It involves investigation and interpretation  
- The intent is clear, with multiple valid approaches  
- The scope is reasonable for a single PR  
- There’s enough context to avoid unintended changes  

### A different issue category may be better when:

- The task is purely mechanical (Good First Issue)  
- It requires minimal judgment (Beginner Issue)  
- It carries high risk of unintended breakage  
- It requires deep frontend, UX, or architectural expertise  
- It represents long-term or strategic planning  

---

## Final Note

Intermediate Issues are about **learning to own solutions**,  
not about redesigning the system.

They help contributors grow in confidence, independence, and impact — while still feeling supported and successful.
