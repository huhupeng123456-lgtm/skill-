# Worked examples

Use these examples to calibrate depth and output shape. Adapt the protocol to the user's real context.

## Example 1: An Agent “does not work well”

### Raw request

“Our Agent performs badly. Should we switch to a stronger model?”

### Reconstruction

- **Target output**: identify the dominant failure source and decide whether a model upgrade is the best next intervention.
- **Goal**: improve task success rate.
- **Constraints**: cost and delivery time are unknown.

### Minimum model

`task characteristics + context quality + tool reliability + orchestration + base-model capability → task success rate`

The user's implicit model is narrower:

`poor task result → base model too weak`

### Discriminating evidence

Classify failures into retrieval, reasoning, tool-call, permission, state, timeout, and output-evaluation errors. If failures occur before the model receives correct context, a stronger model is unlikely to be the dominant fix.

### Action

Sample failed traces, encode each by error class, compare frequencies and impact, then run a small controlled model substitution only on cases where model reasoning is plausibly causal.

## Example 2: Customer keeps changing requirements

### Raw request

“The customer keeps changing requirements. How do we stop it?”

### Reconstruction

The literal goal “stop changes” may be impossible or commercially undesirable. A more useful target is:

“How can we protect acceptance, schedule, and margin while allowing necessary changes?”

### Model

`boundary clarity + change mechanism + decision authority + commercial incentives → uncontrolled-change risk`

“Customer is unreasonable” is a judgment, not yet a causal model.

### Decision

Use a baseline scope, named decision owner, impact assessment, change log, and approval threshold. The exact governance strength depends on relationship value, remaining schedule, contract terms, and available person-days.

## Example 3: Evaluate a learning claim

### Raw request

“The tutorial says highly dynamic tasks are more suitable for Agents than fixed workflows. Do I understand it?”

### Reconstruction

The sentence is upper-level material: a generalized relation. Understanding requires a discrimination model for “highly dynamic task” and lower-level examples showing why the relation changes architecture choice.

### Concrete test

Provide three cases:

1. A fixed approval sequence with known branches.
2. A research task that chooses the next source after reading each result.
3. A mostly fixed process with one uncertain exception.

Ask the user to classify each case and justify the decisive observable features. Then test whether the architecture rule yields the expected choice and where its boundary lies.

### Diagnosis

If the user can repeat the sentence but cannot classify the cases, the failure is lower-level loss. If the user can classify cases but cannot explain the relationship to architecture choice, the linkage model is incomplete.

## Example 4: Keep a simple question simple

### Raw request

“Is ‘turning three client behaviors into boundary ambiguity’ abstraction or induction?”

### Appropriate answer

“It is abstraction: several different behaviors are represented by their shared attribute, creating the concept ‘boundary ambiguity.’ Induction would compare multiple input-output pairs and derive a relationship such as ‘more boundary ambiguity → more delivery disputes.’”

Do not run the full model template when one distinction resolves the question.
