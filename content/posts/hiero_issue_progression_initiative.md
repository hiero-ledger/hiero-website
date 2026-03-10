+++
title = "The Issue Progression Initiative at Hiero"
featured_image = "/images/IPI.png"
date = 2026-03-10
categories = ["Blog"]
abstract = """Introducing the Issue Progression Initiative - A Practical Path to Growing Open Source Developer Opportunities."""
[[authors]]
  name = "Sophie Bulloch"
  organization = "Hiero Community"
+++

Open source projects consistently face the same challenge: how to attract new developers, help them grow their skills, and ultimately develop trusted maintainers.

Many projects rely on **“good first issues”** as the primary entry point. While helpful, this approach often stops at onboarding. Developers complete issues with low success rates, and then the path forward becomes unclear.

To address this, we introduced a broader approach called the **Issue Progression Initiative**.

The goal is simple:  
**Create a structured pathway for developers to enter a project, build skills safely, and gradually take on deeper responsibility.**

This initiative began in the **Python SDK**, and is now expanding into the **C++ SDK**, **Swift SDK**, and **JavaScript SDK**.

---


## Results So Far:

The initiative has already produced measurable outcomes in the Python SDK:

- **660% MoM increase in development activity**
- **150+ contributors**
- **8 triage members**
- **5 committers**
- **2 maintainers**

While there have been challenges along the way, the approach has clearly demonstrated that **structured contributor pathways can scale developer engagement and leadership within a repository.**

---


## How It Works

Each repository organizes issues into **four difficulty levels**:

- **Good First Issue**
- **Beginner**
- **Intermediate**
- **Advanced**

Every issue is documented according to the expected experience level of the developer working on it.

Importantly, this system does **not require artificial issue creation**. Maintainers simply label issues as they naturally arise within the project, at the appropriate level.


### Good First Issues

Good First Issues are an entry point to the repository. They are often simple, one or two line changes. 

The goal is to help developers engage with the repository and **practice the workflow** without being overwhelmed.

```
Correct the spelling mistake in line 107:

Current: Good First Isue
Should be: Good First Issue
```


Good First Issues are supported with documentation such as:

- how to fork the repository
- how to DCO and GPG key sign


### Beginner Issues

These assume familiarity with the workflow repository and focus more on:

- understanding parts of the codebase
- building independent research skills

Beginner issues remain very approachable, narrowly-scoped tasks.

For example:
```
AccountId class does not have a string method, so printing an instance is hard to read by a human.
Create a string method in AccountId very similar to the current method in TokenId class.
```

### Intermediate Issues

These are broader or larger and typically involve:

- modifying or extending existing features
- deeper understanding of the architecture
- robust testing 

For example:
```
Create a new workflow that automatically assigns a user to an issue on commenting \assign.
It should be tested on a fork and offer a dry_run mode default.
```

### Advanced Issues

These require deep expertise and focus on:

- architectural improvements
- complex features
- deeper refactoring
- cross-component work

For example:
```
Implement HIP1011. Architect the design to the Python SDK and create the relevant classes and tests.
```


---


## A Consistent Contributor Experience

One of the key design principles is **predictability**.

It is very important to be clear on what issues are appropriate at each level. With this knowledge, the labelling of good first issues, beginner, intermediate and advanced issues is true to the issue difficulty, and thus developers have a positive experience that they trust.

Developers know:

- what level they are working at
- what type of task to expect
- what skills they will practice


---


## Why This Attracts Developers

Developers often look for signals that a project welcomes contributors.

The Issue Progression Initiative provides several clear signals:

### Visible entry points

New contributors can easily find a **Good First Issue** and begin participating. 

### Safe skill development

Developers can practice the contribution workflow without committing to a large or complex task. As their skills build, they can engage with more responsibilities. 

### Confidence building

Developers trust the process. Even though they are beginners today, there is a path and supports available to progress to intermediate and advanced.

### Real-world impact

Contributors see their work used in real software, which is a strong motivator to continue participating.


---


## Why Progression Matters

Many projects succeed at attracting contributors but struggle to **retain them**.

The Issue Progression Initiative focuses on creating a **progression path** so developers thrive and want to stay.

It avoids simply creating entry points — it is about creating **lasting opportunities**.

With progression:

- developers can move from **Good First Issue → Beginner → Intermediate → Advanced**
- the project develops deeper contributor relationships over time

---


## How This Builds Committers and Maintainers

Granting write permissions requires trust.

Trust in open source projects typically develops over time and through observed behavior.

Maintainers need to see:

- technical competence
- responsible communication
- consistent participation
- good judgment during code reviews

This process can take **six months or longer** but that does not always guarantee developing the right skills.

The Issue Progression Initiative helps accelerate this learning process in two ways.

### 1. Observing Skill Development

By watching contributors progress across issue levels, maintainers can see:

- how their technical skills evolve
- how they approach increasingly complex problems
- how they interact with the project community

### 2. Better Task Variety

Breaking work into levels also improves issue variety.

Instead of a single large “advanced” task that actually contains multiple smaller problems, work becomes better scoped.

This allows contributors to experience a **variety of challenges**, creating a richer pull request history and clearer signals about their interests.

---


## The Junior Committer Role

An additional piece of the initiative is the **Junior Committer role**.

This is a **read-only role that sits just below full committer status**.

It provides an intermediate step for intermediate or advanced contributors who are ready to expand their involvement.

Junior committers can begin learning:

- pull request review strategies
- repository maintenance practices
- how maintainers evaluate contributions

Because the role is **read-only**, it provides a safe environment:

- maintainers retain full control
- contributors can experiment and learn
- expectations remain low-risk for everyone involved

This step has proven valuable for preparing contributors for full committer responsibilities.

---


## A Simple System That Scales

The Issue Progression Initiative is intentionally simple.

The primary work lies in defining **clear criteria** for what qualifies as:

- Good First Issue
- Beginner
- Intermediate
- Advanced

Once these expectations are understood, maintainers can label issues quickly and consistently.

Templates can also help standardize documentation for each level, but these are optional.

To complement these, the next step is to involve:

- Junior Committers

From there, the system largely grows itself as the project evolves.

---


## The Bigger Picture

Open source sustainability depends on more than attracting contributors.

Projects need to **develop contributors into long-term developers and maintainers**.

The Issue Progression Initiative provides a practical framework for doing exactly that:

- lowering the barrier to entry
- supporting skill development
- building trust through observable contribution history
- creating a pipeline from newcomer to maintainer

It is a small structural change with a meaningful long-term impact.

And in several of the Hiero SDKs, it is already working.