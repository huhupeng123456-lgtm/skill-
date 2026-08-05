# Real AI Project Delivery Patterns

## 1. Requirement/SOW/PRD Triage

When given a requirement, SOW, PRD, meeting note, or customer material, extract:

1. Objective: what business result is expected.
2. Users: operators, approvers, admins, maintainers.
3. Scenarios: concrete tasks and decisions.
4. Inputs: files, APIs, databases, forms, messages, permissions.
5. Outputs: answers, reports, records, workflows, dashboards, exports.
6. Constraints: security, timeline, budget, environment, vendor, compliance.
7. Acceptance: examples, metrics, screenshots, test cases, sign-off documents.
8. Risks: unclear data, ambiguous scope, model hallucination, integration dependency, operations owner.

If the artifact is vague, create a "must confirm" list and continue with explicit assumptions.

## 2. AI Capability Mapping

Map requirements to capability types:

| Need | Typical capability |
|---|---|
| Ask questions over documents | RAG / knowledge base |
| Extract fields from files | OCR / parsing / extraction / validation |
| Classify records | classifier plus human review |
| Generate replies/reports | grounded generation plus templates |
| Operate across systems | workflow / Agent / tool calling |
| Monitor status | dashboard / logs / alerting |
| Improve over time | feedback loop / evaluation set |

Do not force Agent architecture when a deterministic workflow or simple retrieval system is enough.

## 3. Scope Boundary Template

Use this structure for project scoping:

```text
In scope:
- Scenario A
- Data source B
- Output C

Out of scope:
- Production SSO
- Full historical migration
- Automatic decision without human review

Assumptions:
- Customer can provide target documents/API access
- Pilot uses limited users and limited data

Dependencies:
- Data owner confirms fields
- IT provides network/API access

Acceptance:
- Sample cases pass
- Customer signs off pilot checklist
```

## 4. Real Delivery Architecture

For AI systems, check these layers:

```text
User entry
Data ingestion / connector
Preprocessing / validation
AI capability layer
Business rule layer
Human review / approval
Output / integration
Trace / logs / evidence
Evaluation / feedback
Operations / monitoring
```

The right architecture depends on the scenario. Keep the smallest closed loop first.

## 5. RAG Project Checklist

Check:

- document sources and update frequency
- parser/OCR handling
- chunking strategy
- metadata fields
- retrieval method
- reranking need
- citation format
- answer unknown behavior
- evaluation questions
- permission and source isolation

Acceptance examples:

- expected source appears in top results
- answer cites correct document section
- unsupported question is refused or asks for clarification
- updates are indexed within agreed time

## 6. Agent/Workflow Project Checklist

Check:

- trigger source
- state management
- tool permissions
- idempotency
- retry and timeout
- human-in-loop approval
- audit trace
- fallback path
- integration errors
- role-based access

Acceptance examples:

- normal path completes end to end
- tool failure produces safe output
- repeated request does not duplicate action
- unauthorized tool/action is blocked
- human approval path is recorded

## 7. Document Automation Checklist

Check:

- supported file types
- layout preservation
- OCR accuracy
- table extraction
- field validation
- manual correction path
- export format
- batch failure handling

Acceptance examples:

- target fields extracted correctly from sample files
- low-confidence fields are flagged
- output document format meets customer requirements
- one bad file does not stop the batch

## 8. Risk Register

Track risks in this format:

| Risk | Impact | Probability | Mitigation | Owner |
|---|---|---|---|---|
| Data source not available | Blocks delivery | Medium | confirm API/files before build | customer IT |
| AI invents unsupported answer | Business risk | Medium | citations + forbidden claims + human review | product/engineering |
| No acceptance cases | unclear sign-off | High | define pilot sample set | PM/customer |

## 9. Metrics by Scenario

Choose metrics tied to business value:

- RAG: answer hit rate, citation correctness, unresolved question rate, user adoption.
- Extraction: field accuracy, manual correction rate, processing time, failure rate.
- Workflow: cycle time reduction, handoff failure rate, approval rejection rate.
- Agent: tool success rate, human review rate, unsafe action blocked count.
- Sales/operations: adoption rate, recommendation acceptance, conversion or efficiency impact.

## 10. Delivery Output Package

For real projects, prepare:

- requirements gap list
- solution design
- implementation plan
- risk register
- test/acceptance checklist
- deployment/runbook
- user guide if needed
- operation ownership and escalation path

For demos, prepare:

- README
- `.env.example`
- sample data
- one-click/local run path
- test commands
- solution/design explanation
