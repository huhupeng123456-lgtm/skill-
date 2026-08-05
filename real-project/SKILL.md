---
name: real-project
description: Turn a software idea into a real, deliverable, engineering-complete project instead of a toy demo. Use when the user wants to build an app, website, platform, automation, workflow, internal tool, AI product, RAG system, or agent system as a serious project. Trigger on phrases like "按真项目做", "不要 demo", "做成可交付项目", "企业级", "工程化", "五百强项目", "真正能交付的软件", "从想法到项目", or "先别写代码，先把需求和工程方案定清楚".
---

# Real Project

## Goal

Convert an idea into a real deliverable software project through staged gates: business intent, product scope, UX, architecture, engineering standards, implementation, QA, security, deployment, documentation, and handoff.

Do not treat this skill as "start coding from a prompt." Treat it as a delivery operating system for building software that other people can review, operate, and maintain.

## Non-Negotiable Rules

- Start with conclusion and current gate status in Chinese.
- Ask clarifying questions when required facts are missing. Questions are part of delivery, not a delay.
- Do not invent customer, company, stakeholder, timeline, system, acceptance, budget, or deployment facts.
- If the project mentions SGA, Zijin, a real customer, or existing project history, first verify facts from the user's local sources when available, especially `F:\work`, before writing customer-facing claims.
- Do not code until Gate 0 and Gate 1 are complete unless the user explicitly asks for a throwaway prototype.
- Before editing or creating a project, check whether a project-level `AGENTS.md` exists. If missing, create or propose one before implementation.
- Prefer a boring, maintainable, testable solution over impressive-looking demo code.
- Every implementation must include empty states, loading states, error states, validation, basic security, tests appropriate to risk, run instructions, and handoff notes unless intentionally scoped out.

## Operating Mode

When the user gives only an idea, run discovery first.

Use this opening format:

```text
结论：现在还不能直接开发，先进入企业级交付澄清。
当前阶段：Gate 0 - 交付定义
我需要先确认 X 个关键问题，确认后再输出可开发任务包。
```

If the user gives enough context, state which gates are already satisfied and continue from the next missing gate.

## Delivery Gates

Use these gates in order. Do not skip a gate silently.

### Gate 0: Delivery Definition

Clarify what "done" means.

Ask only the highest-impact missing questions:

- Who will use this product?
- What business task must they complete?
- Who will judge whether it is acceptable?
- Is this a prototype, internal tool, customer demo, pilot, or production system?
- What is the first version scope and what is explicitly out of scope?
- Where will it run: local, intranet, cloud, customer environment, or existing platform?

Output:

- Delivery type
- Target users
- Success criteria
- Non-goals
- Known constraints
- Open questions

### Gate 1: Product Requirement Package

Turn the idea into a buildable product package.

Output:

- User roles
- Core workflows
- Page or interface list
- Feature boundaries
- Data inputs and outputs
- Permission rules
- State handling: loading, empty, error, success, disabled
- Acceptance criteria
- Risks and dependencies

For AI/RAG/agent products, additionally define:

- Knowledge sources
- Retrieval or tool-use boundary
- Human approval points
- Evaluation method
- Failure handling
- Audit/log requirements

### Gate 2: UX and Interaction Design

Design for real users, not feature checklists.

Output:

- Primary user journey
- Key screens or interaction surfaces
- Navigation model
- Form behavior and validation
- Empty/error/retry guidance
- Accessibility and responsiveness requirements
- What users should never need to think about

If the project has a visible UI, use design review or visual QA before treating it as deliverable.

### Gate 3: Architecture and Engineering Plan

Define the system before writing code.

Output:

- Tech stack and reason
- Project structure
- Data model
- API or integration contracts
- Authentication and authorization model
- Configuration and environment variables
- Logging, monitoring, and audit needs
- Test plan
- Deployment plan
- Migration or data initialization plan if needed

If the architecture has meaningful risk, run or recommend an engineering plan review before implementation.

### Gate 4: Implementation

Implement in small vertical slices.

For each slice:

- State the user value
- Implement the smallest complete workflow
- Add validation and error handling
- Add or update tests
- Verify locally
- Record what changed

Do not leave a feature half-real: avoid fake data, mock persistence, placeholder auth, or unhandled errors unless clearly labeled as temporary and tracked.

### Gate 5: Verification

Verify like a user and like an operator.

Minimum checks:

- Install/run instructions work from a clean start
- Main workflow succeeds
- Invalid input fails safely
- Empty data state is useful
- Network/API/server failure is handled
- Permissions behave as expected
- Tests pass
- Build succeeds
- No obvious secrets are committed
- UI works on expected desktop/mobile widths if applicable

For web apps, use browser-based QA when possible. For report-only checks, do not edit code.

### Gate 6: Delivery Package

Produce handoff material.

Output:

- What was built
- How to run
- How to configure
- How to test
- How to deploy
- Known limitations
- Open risks
- Next iteration proposal

If the user needs formal customer delivery, write in traditional-enterprise style: clear, restrained, and evidence-based.

## Enterprise Quality Bar

Use `references/delivery-gates.md` when the task is substantial, customer-facing, or likely to become a real project.

A project is not enterprise-deliverable if any of these are missing without explicit waiver:

- Clear target user and acceptance owner
- Real data model or clear data contract
- Error and edge-state handling
- Authentication/permission decision
- Basic security review
- Repeatable local run instructions
- Test or QA evidence
- Deployment path
- Handoff documentation
- Known limitations and risks

## Response Pattern

For planning stages, answer with:

```text
结论：
当前 Gate：
已确认：
信息缺口：
我建议的下一步：
需要你确认的问题：
```

For implementation stages, answer with:

```text
结论：
本次交付范围：
我会修改：
验证方式：
风险：
```

For final delivery, answer with:

```text
结论：
已完成：
验证结果：
交付路径：
未覆盖/风险：
下一步建议：
```

## Useful Companion Skills

- Use `plan-ceo-review` when business value, ambition, or scope is unclear.
- Use `plan-eng-review` when architecture, data flow, test strategy, or deployment risk matters.
- Use `plan-design-review` or `design-review` when UI/UX quality matters.
- Use `qa-only` when the user wants an objective bug report without code changes.
- Use `qa` when the user wants test-fix-verify.
- Use `review` before merging or handing off code.
- Use `cso` for security-sensitive or customer-facing systems.
- Use `document-release` after implementation to synchronize docs.
