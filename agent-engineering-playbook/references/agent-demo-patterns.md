# Agent Demo Engineering Patterns

## Pattern 1: Interview-Ready Architecture

Use this architecture for small AI Agent assignments:

```text
frontend -> API -> runner -> skill loader
                    -> tool registry -> tools -> business assets
                    -> LLM adapter
                    -> trace collector
```

Business explanation:

> I separated the project by responsibility. The frontend is only for interaction, the API handles requests, the Runner controls the Agent process, tools fetch grounded information, and Trace records the auditable process.

## Pattern 2: Stronger ReAct Loop

Weak version:

```text
Always call query_product once, then answer.
```

Stronger version:

```text
Model proposes route_decision -> backend validates allowed tool -> tool executes -> observe -> answer.
```

Interview wording:

> The model can suggest that a tool is needed, but the backend controls whether that tool is allowed. This keeps the Agent flexible without giving the model uncontrolled authority.

## Pattern 3: Tool Registry

Use a registry when future tools may be added:

```text
register(name, description, schema, function)
call(name, args)
describe_all()
```

Possible future tools:

- `query_product`
- `query_case`
- `query_crm`
- `query_sales_policy`
- `web_search_public_docs`

Interview wording:

> I used a registry so the current demo has one tool, but the system can add more tools without rewriting the Runner.

## Pattern 4: Trace vs Log vs Evidence

Do not mix these concepts:

- Trace: user-visible or admin-visible steps of one Agent run.
- Logger/log: developer or operator records for debugging and monitoring.
- Evidence/source_id: source reference supporting a model claim.

Good answer:

> Trace explains how the Agent ran. Logs help developers debug the service. source_id proves which business source supports a claim.

## Pattern 5: Safe Fallback

Fallback should be conservative:

```json
{
  "lead_tier": "C",
  "intent_level": "unknown",
  "needs_human_review": true,
  "risks": ["automatic analysis failed"],
  "next_actions": ["manual review required"]
}
```

Avoid fake confidence. A fallback is not a second model answer; it is a safe operational result.

## Pattern 6: Anti-Hallucination

Use layered controls:

1. Put product facts in business assets.
2. Use tools to retrieve facts.
3. Attach `source_id` to retrieved records.
4. Require evidence in the answer.
5. Add forbidden claims for unverified price, delivery, case studies, guarantees.
6. Set `needs_human_review=true` when facts are missing.

Interview wording:

> I do not let the model invent commercial commitments. When evidence is missing, the system should ask sales to confirm instead of manufacturing an answer.

## Pattern 7: Tests That Matter

For small Agent demos, tests should prove control logic:

- Skill can load.
- Tool works and returns source ids.
- API returns answer and trace.
- Runner handles normal ReAct path.
- Runner rejects unauthorized tools.
- Runner handles tool failure.
- Runner handles invalid model JSON.
- Missing API key does not break the whole demo if fallback is supported.

Interview wording:

> I used tests to validate the Agent controller, not the language quality of the model. The unstable part is the model, so the stable part must be the Runner.

## Pattern 8: Feedback Loop

Demo-level feedback can use JSONL or a small local file:

```text
analysis_log.jsonl
feedback_log.jsonl
```

Fields:

- `analysis_id`: one run
- `external_id`: one customer/lead
- predicted tier
- actual outcome
- sales accepted or rejected
- note

Interview wording:

> This lets the team evaluate whether AI scoring matches sales outcomes, instead of only judging whether the answer looks reasonable.

## Pattern 9: Solution Document Structure

Use this order:

1. Problem understanding.
2. User flow.
3. Architecture.
4. Skill design.
5. Tool design.
6. ReAct flow.
7. Trace design.
8. Risk control.
9. Testing.
10. Limitations.
11. Production iteration plan.
12. Metrics.

Good metrics:

- lead triage time
- high-intent identification precision
- sales adoption rate
- human review rate
- hallucinated claim rate
- follow-up response time
- conversion lift after validation

## Pattern 10: Honest Demo Boundary

Say this when asked whether it is production-ready:

> This is a local runnable demo for validating the minimum Agent loop. To productionize it, I would add authentication, persistent database, CRM integration, observability, stronger evidence validation, permission control, and real sales feedback evaluation.
