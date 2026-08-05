---
name: agent-engineering-playbook
description: "Use this skill when turning real AI project inputs into an engineering-ready delivery plan or implementation: requirements, SOW, PRD, customer materials, solution drafts, RAG/knowledge-base projects, workflow/Agent projects, LLM web demos, interview take-home projects, or competitor-inspired prototypes. Trigger when the user asks to analyze/build/harden a real AI project, review scope/risks/acceptance criteria, convert SOW/PRD into implementation, design Agent/Tool/Trace/source_id/fallback/tests/feedback loop, or improve README/solution/deployment handoff."
---

# Agent Engineering Playbook

## Purpose

Turn requirements, SOWs, PRDs, customer materials, or AI demos into a real delivery path: clear scope, risks, architecture, data assumptions, Agent/RAG/workflow design, validation, handoff documents, and implementation steps.

Preserve the user's business goal first. Add engineering only where it improves delivery certainty, reliability, explainability, risk control, or customer acceptance.

Do not copy competitor code verbatim. Distill patterns: boundaries, controls, tests, evidence, docs, acceptance design, and handoff quality.

## Operating Workflow

1. Read governing instructions first: `AGENTS.md`, project rules, SOW, PRD, README, solution docs, meeting notes, customer materials, and assignment text.
2. If the project concerns the user's real customer/project facts, verify available local files or clearly mark unknown facts. Do not invent stakeholders, scope, history, acceptance status, or committed deliverables.
3. Classify the task before acting:
   - `Demand analysis`: clarify business goal, users, scenarios, scope, acceptance.
   - `Solution design`: map capability, architecture, data, integrations, risks, rollout.
   - `Engineering implementation`: inspect code, modify modules, add tests, verify.
   - `Delivery hardening`: improve docs, deployment, runbook, monitoring, acceptance package.
   - `Interview/demo hardening`: make the minimum loop runnable, auditable, and explainable.
4. Inspect the existing artifacts before proposing changes. For code projects, identify frontend, backend/API, runner, model adapter, tools, data assets, tests, docs, deployment files, and logs.
5. State the current maturity level in plain language:
   - `Idea/SOW`: business target exists, implementation not decomposed.
   - `PRD-ready`: scenarios, users, scope, acceptance criteria mostly clear.
   - `Prototype`: can demonstrate a path but lacks reliability, tests, or operations.
   - `Prompt demo`: direct model call, little process control.
   - `Agent demo`: Skill/Tool/Runner/Trace present, minimal tests.
   - `Engineering-ready demo`: clear modules, auditable trace, fallback, tests, docs, local run path.
   - `Delivery-ready`: deployment path, runbook, acceptance evidence, rollback, monitoring, and owner boundaries are clear.
6. Harden the smallest set of gaps that matter for the user's goal. Prefer implementable improvements over broad rewrites.
7. Verify with local commands, document checks, tests, syntax checks, health endpoint, and one real demo/API request when possible.
8. Explain the result in business-safe language: what changed, why it matters, remaining assumptions, delivery risks, and next owner actions.

## Real Project Intake

When the user drops a requirement, SOW, PRD, meeting note, or customer material, do not jump straight to code. First produce or internally use this decomposition:

1. Business objective: what outcome the customer wants, not just what feature is requested.
2. Target users: who uses it, who approves it, who maintains it.
3. Scenarios: concrete workflows or questions the system must support.
4. Inputs and outputs: documents, forms, APIs, databases, messages, reports, dashboards.
5. Data reality: source location, format, owner, freshness, permissions, quality, update frequency.
6. AI capability mapping: RAG, extraction, classification, generation, workflow, Agent, tool calling, evaluation.
7. Non-AI logic: rules, thresholds, routing, permissions, human review, exception handling.
8. Integrations: CRM, ERP, Feishu/Lark, Office files, knowledge base, databases, APIs, SSO.
9. Acceptance criteria: how customer will judge "done", including measurable cases where possible.
10. Risk list: data, model, hallucination, security, compliance, schedule, dependency, adoption.
11. Delivery plan: smallest closed-loop pilot, iteration path, owner, validation method.

If information is missing, proceed with explicit assumptions and a short "must confirm" list. Ask only blocking questions; otherwise make the safest working assumption and continue.

## Engineering Checklist

### 0. Scope and Acceptance

Before implementation, define:

- in-scope scenarios
- out-of-scope scenarios
- user roles
- data sources
- acceptance examples
- manual fallback path
- deployment environment
- owner of operations after handoff

For real projects, never treat a feature as complete without acceptance evidence.

### 1. Module Boundaries

Require clear responsibility separation:

- Frontend: input, trigger analysis, render answer and trace.
- API/server: receive requests, validate input, return stable response.
- Skill loader: read task instructions and allowed tools.
- Runner: control ReAct loop and failure paths.
- LLM adapter: isolate model vendor details and API errors.
- Tool registry: register tools by name, schema, description, and function.
- Tools: query business assets or external systems.
- Asset store: load product catalog, SOP, forbidden claims, mock leads.
- Trace collector/logger: record auditable execution steps.
- Evaluation layer: test cases, golden samples, metrics, regression checks.
- Operations layer: config, secrets, logs, monitoring, deployment, rollback.
- Tests: prove key paths and failure handling.

If logic is tangled, separate by responsibility before adding features.

For non-Agent AI projects, map equivalent boundaries:

- RAG: ingestion, chunking, indexing, retrieval, reranking, answer generation, citation, evaluation.
- Workflow: trigger, step orchestration, state, approval, retry, audit log.
- Document automation: parser, extractor, validator, renderer, human review.
- Dashboard/reporting: data connector, transform, cache, visualization, export.

### 2. ReAct Runner

Implement or review the runner as a controlled loop:

```text
Reasoning Summary -> Act(tool call) -> Observe(tool output) -> Answer
```

Use these rules:

- Keep reasoning summary short and auditable; never expose raw chain-of-thought.
- Let the model propose route decisions when feasible, but let backend code validate tool permission and arguments.
- Set a max turn count, usually 2-3 for demos.
- On max turns, force a final conservative answer instead of looping.
- If the model fails, returns invalid JSON, or omits an answer, return a safe fallback with `needs_human_review=true`.

### 3. Tool Registry

Prefer a registry over hardcoded tool calls when the project has Agent framing.

A useful tool registry stores:

- tool name
- human description
- input schema
- callable function
- authorization check against Skill allowed tools

Explain it as: "the model can request a tool, but the backend decides whether that tool is allowed and how it is executed."

### 4. Evidence and Anti-Hallucination

For business claims, enforce grounding:

- Give product/service records stable `source_id`.
- Return tool results with `source_id`.
- Ask final answers to cite evidence ids for product capabilities, pricing, delivery windows, customer cases, and forbidden claims.
- If evidence is missing, say "needs human confirmation" instead of inventing.
- Add forbidden-claims rules for price, delivery time, case studies, guaranteed outcomes, compliance, or unverified integrations.

Use this distinction:

```text
Trace = how this run executed.
source_id = what source supports a claim.
```

### 5. Trace Design

Trace is for audit and debugging, not end-user marketing copy.

Include:

- skill name and version
- context summary
- route decision / reasoning summary
- tool name, input, output summary
- prompt or skill version
- errors and fallback reason
- final answer summary
- latency when available

Exclude:

- raw chain-of-thought
- full hidden prompt unless explicitly required
- secrets, API keys, private customer data

### 6. Structured Output

Use two layers when useful:

- JSON for systems: `lead_score`, `lead_tier`, `intent_level`, `risks`, `evidence`, `needs_human_review`.
- Markdown or formatted HTML for people: readable sections, next actions, draft reply.

Treat JSON as integration surface for CRM, dashboards, analytics, and tests.

### 7. Tests

For interview-grade projects, add focused tests before adding optional features.

Minimum useful tests:

- skill loads and exposes expected name/version/tools
- API rejects empty input
- API returns answer plus trace
- runner records Skill, Reasoning, Act, Observe, Answer
- tool returns source_id evidence
- forbidden claims are respected or flagged
- model failure falls back safely
- unauthorized tool call is rejected
- invalid model JSON is handled

Use mock LLM responses for runner tests. Do not require real API keys for automated tests.

For RAG or document projects, also test:

- ingestion handles target file formats
- chunking preserves useful structure
- retrieval returns expected sources for sample questions
- citations point to real source snippets
- answer says unknown when evidence is missing
- batch processing continues when one file fails

For workflow projects, also test:

- retry behavior
- approval/human-in-loop path
- duplicate trigger handling
- idempotency for repeated requests
- partial failure recovery

### 8. Feedback Loop

Only add feedback loop after the minimum business loop is solid.

Good demo-level feedback design:

- `analysis_id`: unique id for one analysis run.
- `external_id`: customer or lead id across multiple runs.
- feedback record: accepted/rejected, actual outcome, sales note.
- analytics: mismatch examples, acceptance rate, human review rate.

Explain it as: "the system can be evaluated against sales outcomes instead of only judged by nice-looking answers."

For real projects, choose feedback by business objective:

- RAG: helpful/not helpful, citation correct/incorrect, unresolved question category.
- Classification: predicted label vs final human label.
- Extraction: field accuracy, missing field rate, manual correction log.
- Workflow: completion time, handoff failures, approval rejection reasons.
- Sales/operations Agent: adoption rate, recommendation accepted/rejected, downstream outcome.

### 9. Playbook / Business Assets

Represent reusable business knowledge as files or records:

- product catalog
- sales SOP
- forbidden claims
- custom playbooks
- example leads

Do not overbuild retrieval for small demo data. Keyword search is acceptable if the rationale is auditability and local simplicity. Mention vector search/BM25 as later upgrades, not required first.

### 10. Security, Privacy, and Operations

For real delivery, check:

- secrets are in environment variables or secure config, never committed
- customer data and logs do not expose sensitive content unnecessarily
- user roles and permissions are defined
- external API failures have fallback or retry behavior
- model/provider dependency is explicit
- deployment steps are repeatable
- monitoring/logging supports incident diagnosis
- rollback or manual operation path exists

### 11. Documentation and Stakeholder Story

Update or create:

- `README.md`: local run steps, env vars, test commands, demo input.
- `solution.md`: design choices, Skill/Tool/Runner boundaries, risk control, future metrics.
- optional `design_points.md`: why each non-obvious choice was made.
- `.env.example`: required keys without secrets.
- PRD/SOW gap list: assumptions, exclusions, dependencies, acceptance criteria.
- runbook: deployment, config, daily operations, troubleshooting.
- acceptance checklist: test cases, expected outputs, evidence screenshots/logs.

Every significant design choice should answer:

```text
Why this exists?
What risk does it reduce?
What would change in production?
```

## Prioritization

When time is limited for real projects, improve in this order:

1. Business scope and acceptance criteria.
2. Smallest closed-loop pilot path.
3. Data source, permission, and quality confirmation.
4. Core AI workflow: input -> processing -> grounded output -> human review/fallback.
5. Risk control: hallucination, security, permissions, failure paths.
6. Tests/evaluation for the critical path.
7. Deployment and runbook.
8. Customer-facing docs and acceptance evidence.
9. Feedback loop and metrics.
10. UI polish.

When time is limited for demos/interviews, improve in this order:

1. Local runnable path.
2. Complete minimum loop: input -> Skill -> Runner -> Tool -> Observe -> Answer -> Trace.
3. Anti-hallucination: forbidden claims, evidence ids, human review.
4. Tests for API, runner, tool, fallback.
5. Clear `README.md` and `solution.md`.
6. Feedback loop and playbooks.
7. UI polish.

## Review Output Format

When reviewing a project with this skill, respond with:

1. Current maturity level.
2. Confirmed facts and unconfirmed assumptions.
3. Strengths already present.
4. Highest-impact gaps, ordered by delivery value.
5. Exact implementation or document plan.
6. Acceptance criteria and verification method.
7. Stakeholder-safe explanation after the changes.
8. Verification commands run or still needed.

If making code changes, implement them directly and verify.

## Reference

Read references selectively:

- `references/real-project-delivery.md`: use when the user gives requirements, SOW, PRD, customer materials, or asks for real project delivery planning.
- `references/agent-demo-patterns.md`: use when the task involves designing, comparing, or upgrading an Agent demo.
