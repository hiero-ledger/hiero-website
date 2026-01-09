# Hiero Website — Issue Difficulty Overview (Maintainers Cheatsheet)

**Audience:** Maintainers  
**Purpose:** Quick, practical reference for labeling issues  

This guide summarizes how to choose the most helpful **difficulty label** for issues in the Hiero website repository.

**Core question:**  
> How much guidance, exploration, and ownership does this issue involve?

---

## Difficulty Levels at a Glance

| Label | Who It’s For | Guidance Level | Scope | Risk |
|---|---|---|---|---|
| **Good First Issue** | First-time contributors | Fully guided | Single, explicit task | Very low |
| **Good First Issue: Candidate** | Maintainers | Nearly guided | Single task, incomplete spec | Very low |
| **Beginner Issue** | Post-GFI contributors | Light guidance | Localized | Low |
| **Intermediate Issue** | Regular contributors | Flexible guidance | Multi-file / section | Medium |
| **Advanced Issue** | Experienced contributors | Open-ended | Site-wide / systemic | High |

---

## Decision Flow (Fast Triage)

Ask these questions in order:

1. **Is the solution fully specified and purely mechanical?**  
   → Use **Good First Issue**

2. **Is it almost mechanical, but missing a few details?**  
   → Use **Good First Issue: Candidate**

3. **It is quite mechanical, but has a broader scope or and light research?**  
   → Use **Beginner Issue**

4. **Does the contributor need to explore options and choose an approach?**  
   → Use **Intermediate Issue**

5. **Does this involve system-level, architectural, UX, or long-term decisions?**  
   → Use **Advanced Issue**

---

## Label Definitions (Maintainer View)

### Good First Issue (GFI)

Best for:
- Fully guided tasks  
- Exact files, values, or text provided  
- No interpretation required  
- Clear, objective outcome  

**Typical examples:**
- Fixing a typo in a specific file  
- Replacing a broken link with a given URL  
- Updating a value to a specified value  

If the task needs extra explanation in comments, it’s usually better suited for another label.

---

### Good First Issue: Candidate

Best for:
- Issues that *could* become GFIs  
- Tasks missing small but important details  
- Cases where the scope looks right, but clarity is still needed  

This label gives maintainers space to refine instructions before promoting the issue to a full GFI.

If the task wouldn’t make sense as a GFI even with refinement, another label is likely a better fit.

---

### Beginner Issue

Best for:
- Tasks that build on GFI experience  
- Work that involves reading existing files  
- Small, safe choices  
- Localized, low-risk changes  

**Typical activities:**
- Clarifying wording  
- Choosing between obvious patterns  
- Light reorganization with stated intent  

**Helpful framing:**  
> “Read → understand → make a small choice”

---

### Intermediate Issue

Best for:
- Independent exploration  
- Multiple valid solution paths  
- Contributor chooses *how* to implement the goal  
- Spans multiple related files or sections  

**Common characteristics:**
- Clear problem statement  
- Solution not fully prescribed  
- Requires reasoning and trade-offs  
- Still feasible in one PR  

**Examples:**
- Reorganizing documentation sections  
- Writing or significantly revising content  
- Designing frontmatter usage for a section  

---

### Advanced Issue

Best for:
- Architectural or design ownership  
- Site-wide or cross-section changes  
- Introducing or evolving conventions  
- Long-term maintenance impact  

**Common areas:**
- Navigation or information architecture  
- Hugo templates, layouts, or shortcodes  
- UX, accessibility, or visual redesign  
- Governance or strategic content  

**Helpful framing:**  
> “Designing or evolving the system”

---

## Common Labeling Pitfalls

Some situations that often benefit from a second look:

- Labeling exploratory work as a GFI  
- Using Beginner for fully mechanical tasks  
- Using Intermediate for UX or template changes  
- Using Advanced for large but mechanical refactors  
- Over-promoting issues to make them seem more “important”  

---

## Final Guidance for Maintainers

- When unsure, start with a **lower difficulty label**  
- Use **Candidate** rather than a premature GFI  
- Prefer **Beginner** over Intermediate when choices are limited  
- Use **Advanced** intentionally for system-level work  

---

## Final Note

Difficulty labels describe **how much guidance and ownership a task involves**,  
not **time, size, or importance**.

---

## Helpful Links

- [Advanced Guidelines](guidelines_advanced_issues.md)  
- [Intermediate Guidelines](guidelines_intermediate_issues.md)  
- [Beginner Guidelines](guidelines_beginner_issues.md)  
- [Good First Issue Guidelines](guidelines_good_first_issues.md)  
- [Good First Issue Candidate Guidelines](guidelines_good_first_issue_candidates.md)  
