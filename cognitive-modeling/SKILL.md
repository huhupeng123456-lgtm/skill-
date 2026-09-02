---
name: cognitive-modeling
description: Reconstruct reported phenomena, messy situations, and unclear problems into clear, testable models before giving advice or acting. Invoke automatically when the user describes a phenomenon, symptom, recurring pattern, conflict, or difficult situation and does not know what to do, asks why it is happening, how to judge it, what choice to make, or seeks advice—even if they do not name this skill. Also use for ambiguous real-world problems, unclear concepts, conflicting claims, causal or analogical reasoning, decisions with goals and constraints, critiques of learning materials, reframing, hidden assumptions, evidence and generalization, model failure, or deriving an action plan. Do not invoke for simple factual lookup or a fully specified direct task unless reframing would materially change the result.
---

# Cognitive Modeling

Turn an unstructured situation into a model that can be judged, tested, updated, and—when requested—used for action. Treat the raw wording as material, not automatically as the real problem.

## Automatic invocation

Invoke this skill without waiting for the user to remember or name it when the request contains both:

1. a reported phenomenon, symptom, recurring pattern, conflict, or situation; and
2. uncertainty about the cause, judgment, choice, or next action—for example, “怎么办”, “怎么处理”, “为什么会这样”, “该不该”, “你建议怎么做”, or an equivalent request for guidance.

The phenomenon may be brief and informal. Examples include “客户又改需求了，我不知道怎么管”, “这个 Agent 经常答非所问，怎么办”, or “老板这样回复，我下一步怎么处理”. Infer a provisional task and proceed when useful; ask a question only when the missing answer would materially change the advice.

Do not invoke merely because a message mentions a situation. Skip simple factual lookups, translations, formatting requests, and direct tasks whose desired change is already fully specified. When a specialized skill also applies, use cognitive modeling to reconstruct the problem and let the specialized skill handle its domain workflow.

## Core principles

- Start from the user's actual situation, goal, and constraints.
- Separate observation, concept, model, value judgment, and decision.
- Represent knowledge as `input space → mapping → output space`, with an explicit scope.
- Require both a discrimination model (concrete object → concept) and a linkage model (input concept/variable → output concept/variable) when the distinction matters.
- Distinguish facts, user reports, assumptions, inferences, and unknowns. Never fill an evidence gap with confidence.
- Show an auditable reasoning summary: decisive premises, evidence, alternatives, and uncertainty. Do not reveal private chain-of-thought.
- Scale the analysis to the stakes and ambiguity. Do not force the full protocol onto a simple question.

## Choose the analysis depth

Use the smallest depth that can change the answer:

- **Quick**: one ambiguity or hidden assumption; return a corrected question, the key model, and one next step.
- **Standard**: several variables or plausible explanations; run the full core protocol.
- **Deep**: high stakes, disputed concepts, weak evidence, multiple causal models, or unclear generalization; load the relevant diagnostic modules and compare alternatives explicitly.

Ask at most the minimum number of questions needed to resolve a materially different branch. If useful progress is possible, state provisional assumptions and continue.

## Core protocol

### 1. Establish the task

Extract or infer:

- **Raw situation**: What happened or what material was provided?
- **Target output**: What must be explained, predicted, judged, chosen, or learned?
- **Goal**: What outcome does the user value?
- **Constraints**: Time, cost, authority, risk, relationships, evidence, and reversibility.

Rewrite the problem as a concrete task. Prefer forms such as:

- Given `X`, explain or predict `Y`.
- Decide among `A/B/C` to achieve `G` under constraints `C`.
- Determine whether object `o` belongs to concept `K` using criteria `D`.

Do not treat “solve my problem” as a sufficient output definition.

### 2. Separate the layers

Organize the material into:

1. **Observed or reported phenomena**
2. **Concept labels and definitions**
3. **Claims about relationships**
4. **Goals and value judgments**
5. **Candidate decisions or actions**

Flag category errors, such as treating a label as the object, a definition as evidence, a correlation as a cause, or a world model as a decision rule.

### 3. Build the minimum viable model

Specify only the variables needed to answer the target question:

| Element | Question |
|---|---|
| Object | What real thing, event, or system is being modeled? |
| Input space | Which known conditions may matter? |
| Output space | What exactly is being inferred or decided? |
| Mapping | What relationship is currently assumed? |
| Scope | Where should this relationship apply—and not apply? |
| Confidence | How strong is the evidence for this mapping? |

Surface the user's implicit model before replacing it. For example: `Agent performs poorly → base model is too weak`.

### 4. Clarify decisive concepts

For each term that can change the conclusion:

- Identify its real referent in this situation.
- State practical inclusion/exclusion criteria.
- Check whether the abstraction level fits the task.
- Test the criteria on at least one concrete positive and negative case when ambiguity remains.

Avoid debating words whose definitions do not affect the decision.

### 5. Inspect evidence and model quality

Classify the support as raw data, concrete experience, worked example, generalized relation, or external evidence. Then check:

- Does the evidence cover the claimed input space?
- Is there enough lower-level material to discriminate concrete cases?
- Is there an upper-level relationship, or only memorable anecdotes?
- Could another model explain the same observations?
- What observation would distinguish the competing models?
- What uncertainty remains after the available evidence?

Read [modeling-diagnostics.md](references/modeling-diagnostics.md) when the problem involves learning material, concept confusion, induction, analogy, generalization, or model failure.

### 6. Test and update

Generate no more than three serious candidate models unless the user requests breadth. For each candidate, state:

- what it explains;
- what it fails to explain;
- one falsifiable prediction or discriminating test;
- the cheapest useful evidence to collect next.

Prefer tests that can rule models out over evidence that merely feels consistent with them.

### 7. Decide only after modeling

When the user wants action, derive it from:

`best current model + user goal + constraints + risk tolerance`

Separate:

- **What is likely true** from
- **What the user should do**.

Offer options only when they represent real tradeoffs. Recommend one option when the evidence permits, state the trigger for changing course, and give an immediate next action.

## Output contract

Lead with the answer. Use only the sections that add value:

1. **Conclusion** — the current best answer or the key reframing.
2. **Problem reconstruction** — the actual task, goal, and constraints.
3. **Model** — decisive inputs, target output, assumed relationship, and scope.
4. **Evidence and uncertainty** — what is known, inferred, assumed, and missing.
5. **Validation or action** — next test, decision, owner, or trigger.

Keep categories MECE where possible. Match the user's language and expertise. Use concrete examples to reconnect abstract concepts to reality.

Read [worked-examples.md](references/worked-examples.md) when calibration is unclear or when a concrete demonstration would improve the response. Do not copy its answers mechanically.

## Guardrails

- Do not manufacture precision when the input is vague.
- Do not present an implicit premise as a fact.
- Do not infer a universal rule from one vivid case.
- Do not extend a model beyond its observed or justified input space without labeling the extrapolation.
- Do not confuse “can classify” with “can verbally define”; practical discrimination may exist before a complete verbal definition.
- Do not turn every request into philosophy. The purpose is better judgment and action.
