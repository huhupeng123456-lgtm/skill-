# Modeling diagnostics

Load only the modules relevant to the current failure mode. Use them as diagnostics, not as a mandatory questionnaire.

## Contents

1. Knowledge model
2. Material levels
3. Data, experience, and example
4. Bottom-up construction
5. Discrimination and linkage
6. Common model failures
7. Compact diagnostic questions

## 1. Knowledge model

Model usable knowledge as:

`input space X → mapping M → output space Y`

- **Input space**: the conditions or objects the model can receive.
- **Output space**: what the model predicts, classifies, explains, or recommends.
- **Mapping**: the learned relationship between them.
- **Scope**: the part of reality for which the mapping is justified.

A sentence is not yet usable knowledge merely because it sounds general. The agent must know what concrete inputs count, what output is produced, and how to apply the relation to an unseen case.

## 2. Material levels

- **Lower-level material**: concrete objects, cases, events, observations, or worked applications.
- **Upper-level material**: abstract concepts, general relationships, rules, or models.

Complete understanding requires movement in both directions:

- lower → upper: build concepts and relationships;
- upper → lower: recognize a new concrete case and apply the model.

Diagnose:

- **Lower-level loss**: the user can repeat a rule but cannot recognize or apply it in reality.
- **Upper-level loss**: the user remembers stories but cannot extract a transferable relationship.
- **Level mismatch**: the “example” is only a slightly narrower abstraction and never reaches a recognizable concrete object.
- **Upper/lower mismatch**: the example does not actually instantiate the claimed rule.

## 3. Data, experience, and example

Use these operational distinctions:

- **Data**: raw phenomena or records before a specific inference task is assigned.
- **Experience**: a concrete input paired with a concrete output or consequence.
- **Worked example**: a concrete input and output plus a demonstration of how the target model transforms one into the other.
- **Generalized relation**: a proposed mapping intended to cover more than the observed cases.

Do not treat more material as more knowledge. Ask whether the material helps reconstruct or test the target model.

## 4. Bottom-up construction

Use the sequence `abstract → discriminate → encode → induce` when deriving a model from concrete cases.

### Abstract

Compare phenomena, remove irrelevant differences, and extract shared attributes to form a concept.

Question: **What can these different phenomena be represented as?**

Result: a concept or variable.

### Discriminate

Use the concept's practical criteria to decide whether a new phenomenon belongs to it.

Question: **Does this concrete case count as the concept?**

Result: a classification.

### Encode

Replace a complex phenomenon with the classified concept so it can be compared or processed.

Example:

`“Build it first; define acceptance later” → insufficient upfront boundary confirmation`

Encoding is not merely renaming. It reduces irrelevant detail while preserving the features needed for the target inference.

### Induce

Compare multiple encoded input-output pairs and infer a shared relationship.

Question: **What recurring relationship exists between X and Y?**

Result: a candidate generalized mapping.

Key distinction:

- abstraction finds shared attributes and creates variables;
- induction finds shared relationships between variables.

## 5. Discrimination and linkage

A usable model usually needs both:

- **Discrimination model**: concrete object `o → concept K`.
- **Linkage model**: input concept or variable `Kx → output concept or variable Ky`.

Example:

1. Recognize “acceptance criteria repeatedly deferred” as **insufficient upfront boundary confirmation**.
2. Apply the relation **less boundary confirmation → higher delivery-dispute risk**.

Diagnose **discrimination-linkage mismatch** when the concrete cases admitted by the discrimination criteria differ from the cases for which the linkage was learned. A rule may be valid for one meaning of “dynamic task” but fail after the term is broadened.

## 6. Common model failures

### Language-object confusion

The same word may point to different real objects, and different words may point to the same object. Resolve the referent before reasoning from the label.

### Category essentialism

Do not assume every member of a category has one fixed hidden essence. Use task-relevant criteria and allow fuzzy or context-dependent boundaries when reality requires them.

### Input-space expansion

A mapping learned in domain `A` is silently applied to `A+B+C`. Label extrapolation and seek boundary cases.

### Anecdotal induction

A small or selected set of cases supports a memorable story but not the claimed generality. Ask what cases are absent and what would reverse the conclusion.

### Surface analogy

Two situations share visible features but not the causal or structural relationship that matters. Map roles, constraints, mechanisms, and outputs—not just appearances.

### Correlation-causation substitution

An observed association is presented as a mechanism. Generate plausible common causes, reverse direction, and selection effects.

### Decision-model substitution

A world model is mistaken for a decision rule. “X increases risk” does not by itself imply “never do X”; goals, constraints, alternatives, and risk tolerance are still required.

### Verbal fluency illusion

Being able to explain a concept does not guarantee correct discrimination; being unable to give a perfect definition does not prove the absence of a working discrimination model. Test with concrete cases.

## 7. Compact diagnostic questions

Select only those that can change the conclusion:

1. What is the real object behind the words?
2. What exactly is the target output?
3. Which inputs are known, relevant, and controllable?
4. What mapping is currently assumed?
5. How would a new concrete case be classified?
6. What evidence supports the mapping rather than merely illustrating it?
7. What is the justified scope?
8. Which alternative model fits the same observations?
9. What observation would distinguish the models?
10. Which goal and constraint convert this knowledge into a decision?

