# Enterprise Delivery Gates

Use this reference for substantial, customer-facing, or production-intended software projects.

## Gate 0 Checklist: Delivery Definition

Confirm:

- Delivery type: prototype, demo, pilot, internal production, external production, customer handoff
- Target user: role, skill level, frequency of use, environment
- Acceptance owner: who says yes or no
- Business objective: what improves after this exists
- First version scope: must-have, should-have, out of scope
- Operating environment: local, browser, server, intranet, cloud, customer environment
- Constraints: timeline, data availability, security, vendor stack, compliance, budget

Stop if:

- The user cannot say who will use it
- There is no acceptance standard
- The target environment is unknown and affects architecture

## Gate 1 Checklist: Product Requirement Package

Define:

- Personas and roles
- Primary workflows
- Secondary workflows
- Page/interface inventory
- Inputs, outputs, and data ownership
- CRUD rules if data is stored
- Permission matrix
- Notifications or approval flows
- Search/filter/export requirements
- Error, empty, loading, success, disabled, and retry states
- Acceptance criteria per workflow

For AI features, define:

- What the model is allowed to decide
- What requires human confirmation
- What source data is trusted
- How answers are evaluated
- How hallucination, missing evidence, and tool failure are handled
- Whether logs must support audit or replay

## Gate 2 Checklist: UX and Interaction

Verify:

- The first screen supports the user's main job, not a marketing landing page
- Navigation is predictable
- Repeated actions are efficient
- Forms have labels, validation, defaults, and clear error guidance
- Destructive actions require confirmation or recovery
- Empty states guide the next action
- Loading states preserve layout
- Error states explain what happened and what to do next
- Text fits on desktop and mobile
- UI density matches the domain: enterprise tools should be quiet, scannable, and work-focused

## Gate 3 Checklist: Architecture and Engineering

Define:

- Runtime and framework
- Directory structure
- Module boundaries
- Database or storage choice
- Data model and key constraints
- API contracts
- Authentication and authorization
- Environment variables and secrets handling
- Logging and audit events
- Background jobs or queues if needed
- File upload/download handling if needed
- Test strategy
- Deployment target
- Rollback or recovery path

Red flags:

- Fake auth in a real product
- Local-only storage for multi-user workflows
- No data ownership model
- No error boundary
- No clean setup path
- No test or QA plan
- Hard-coded secrets, paths, tokens, or customer facts

## Gate 4 Checklist: Implementation Slices

Slice by user outcome, not by technical layer.

Good slice:

- User can create a record, see it saved, edit it, and handle validation errors

Bad slice:

- Build all pages first with no data flow
- Add database schema with no user workflow
- Create UI with hard-coded data and call it complete

Each slice must include:

- User-visible behavior
- Data path
- Validation
- Error handling
- Basic test or manual verification
- Documentation update when behavior changes

## Gate 5 Checklist: Verification

Run or document:

- Clean install
- Local start
- Build
- Tests
- Lint/type check if available
- Main workflow QA
- Edge-case QA
- Permission QA
- Responsive QA if UI exists
- Security smoke check
- Secret scan by inspection at minimum
- Documentation check

For web apps, capture browser evidence when possible:

- Screenshot of main screen
- Screenshot of empty/error state if relevant
- Reproduction steps for bugs
- Before/after evidence for fixes

## Gate 6 Checklist: Delivery Package

Deliver:

- Executive summary
- Scope delivered
- How to run
- How to configure
- How to test
- How to deploy
- User workflows
- Admin/operator notes
- Known limitations
- Risks and assumptions
- Suggested next iteration

For customer-facing documents:

- Separate verified facts from assumptions
- Avoid internal labels and casual wording
- Preserve formal naming and versioning
- Remove unsupported claims
- Keep the document directly usable

## Question Bank

Ask only questions that unblock delivery quality.

High-impact questions:

- Who is the real user, and what do they need to finish?
- What is unacceptable in the first version?
- What data is real, and where does it come from?
- Does this need login, roles, or audit logs?
- Who approves the result?
- Is this for demo, pilot, or production?
- What environment must it run in?
- What failure would embarrass us in front of stakeholders?

Avoid low-value questions:

- Asking about colors before workflow is clear
- Asking about frameworks before deployment constraints are clear
- Asking for full detail when a reasonable default can be stated and verified later

## Waiver Rule

If the user explicitly chooses to skip a gate, record the waiver:

```text
已跳过：
跳过原因：
可能风险：
后续补救点：
```

Never hide skipped engineering work. Label it as a risk or limitation.
