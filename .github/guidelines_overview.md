# Hiero Website — Issue Difficulty Overview (Maintainers Cheatsheet)

**Audience:** Maintainers only  
**Purpose:** Quick, practical reference to label issues correctly  
**Not contributor-facing documentation**

This document summarizes **how to choose the correct difficulty label** for issues in the Hiero website repository.

> Core question:  
> **How much judgment, investigation, and ownership does this issue require?**

---

## Difficulty Levels at a Glance

| Label | Who It’s For | Judgment Required | Scope | Risk |
|---|---|---|---|---|
| **Good First Issue** | First-time contributors | None | Single, explicit task | Very low |
| **Good First Issue: Candidate** | Maintainers | None (yet) | Single task, incomplete spec | Very low |
| **Beginner Issue** | Post-GFI contributors | Low | Localized | Low |
| **Intermediate Issue** | Regular contributors | Medium | Multi-file / section | Medium |
| **Advanced Issue** | Experienced contributors | High | Site-wide / systemic | High |

---

## Decision Flow (Fast Triage)

Ask these questions **in order**:

1. **Is the solution fully specified and mechanical?**
   - Yes → **Good First Issue**
   - Almost, but missing details → **Good First Issue: Candidate**

2. **Does the contributor need to read existing content and make small decisions?**
   - Yes → **Beginner Issue**

3. **Does the contributor need to investigate, weigh options, and choose an approach?**
   - Yes → **Intermediate Issue**

4. **Does this require system-level, architectural, UX, or long-term decisions?**
   - Yes → **Advanced Issue**

---

## Label Definitions (Maintainer View)

### Good First Issue (GFI)

**Use when:**
- Task is fully scripted
- Exact files, values, or text are specified
- No interpretation required
- Outcome is objectively verifiable

**Examples:**
- Fix a typo in a specific file
- Replace a broken link with a given URL
- Update a value to a specified value

**If any uncertainty exists → do NOT use GFI**

---

### Good First Issue: Candidate

**Use when:**
- The issue *might* be a GFI
- But is missing:
  - Exact file paths
  - Explicit steps
  - Acceptance criteria
- Or you are unsure it is truly mechanical

**Purpose:**
- Quality gate
- Temporary holding state
- Maintainer refinement space

> If it will *never* qualify as GFI, **do not use candidate**

---

### Beginner Issue

**Use when:**
- Builds on GFI experience
- Requires reading existing files
- Requires **small, safe decisions**
- Still low risk and localized

**Allowed judgment:**
- Clarifying wording
- Choosing between obvious patterns
- Minor reorganization with stated intent

**Not allowed:**
- Designing new systems
- UX, visual, or layout changes
- Open-ended content creation

**Rule of thumb:**
> “Read → understand → make a small decision”

---

### Intermediate Issue

**Use when:**
- Contributor must investigate independently
- Multiple valid solutions exist
- Contributor chooses *how* to implement intent
- Spans multiple related files or sections

**Typical characteristics:**
- Clear problem statement
- Solution not prescribed
- Requires reasoning and trade-offs
- Still feasible in one PR

**Examples:**
- Reorganizing documentation sections
- Writing or significantly revising content
- Designing frontmatter usage for a section

---

### Advanced Issue

**Use when:**
- Requires architectural or design ownership
- Affects multiple areas or site-wide behavior
- Introduces or changes conventions
- Has long-term maintenance impact

**High-risk areas:**
- Navigation or information architecture
- Hugo templates, layouts, shortcodes
- UX, accessibility, or visual redesign
- Governance or strategic content

**Rule of thumb:**
> “Designing or evolving the system”

---

## Common Mislabeling Pitfalls

- ❌ Labeling exploratory work as GFI
- ❌ Using Beginner for purely mechanical tasks
- ❌ Using Intermediate for UX or template changes
- ❌ Using Advanced for large but mechanical refactors
- ❌ Over-promoting issues to appear more “important”

---

## Final Guidance for Maintainers

- **When in doubt, label lower**
- Prefer **Candidate** over premature GFI
- Prefer **Beginner** over Intermediate if judgment is limited
- Use **Advanced** sparingly and intentionally

---

## Final Rule

> Difficulty labels describe **decision complexity**,  
> not **time, size, or importance**.

## Helpful Links
[Advanced Guidelines](guidelines_advanced_issues.md)
[Intermediate Guidelines](guidelines_intermediate_issues.md)
[Beginner Guidelines](guidelines_beginner_issues.md)
[Good First Issue Guidelines](guidelines_good_first_issues.md)
[Good First Issue Candidate Guidelines](guidelines_good_first_issue_candidates.md.md)

