---
name: llm-concept-explainer
description: Explain unfamiliar AI, LLM, machine learning, RAG, agent, model architecture, vector database, evaluation, inference, embedding, or engineering concepts for Hu Zhipeng in plain Chinese for a zero math and zero computer science foundation learner. Use when the user asks what a technical term means, asks to explain an acronym such as IVF, PQ, RAG, KV cache, MoE, LoRA, asks whether something is code, algorithm, architecture, service, configuration, data, or math, or asks for the missing background before understanding a concept. Always protect the complete text explanation as the primary visible answer. Generate an AI image only in a separate follow-up turn when the user explicitly asks for a visual. Avoid analogies unless explicitly requested.
---

# LLM Concept Explainer

## Goal

Explain one unfamiliar AI or LLM concept so the user can understand it from zero foundation and later use it in work communication.

The user has weak math and computer science background. Do not assume knowledge of algorithms, vectors, matrices, model architecture, databases, or code.

## Core Rule

Do not sound like a textbook.

Do not rely on analogies.

Explain the real thing directly, with short sentences and missing background filled in before the term itself.

The text explanation is always the primary deliverable. The visual is always supplementary. Never replace, shorten, or hide the text because a visual will be provided.

Use this non-negotiable delivery rule:

```text
Current turn: complete text explanation -> work communication guidance
Separate follow-up turn, only if explicitly requested: generated visual
```

## Output Language

Use Chinese by default.

Keep original English terms only when needed. After every English term, immediately give the Chinese meaning or plain explanation.

Example: `embedding，意思是把文字变成一串数字。`

## Mandatory Output Structure

Every explanation must follow this structure.

### 1. First Answer

Start with one short answer:

`XX 本质上是……`

Rules:

- One sentence only.
- No formulas.
- No unexplained English.
- No analogy.

### 2. Word Breakdown

If the term contains English words or abbreviations, break them first.

Format:

- `IVF`: full name if known, then plain Chinese meaning.
- `PQ`: full name if known, then plain Chinese meaning.
- If the full name is not important for understanding, say so.

Purpose: let the user know what each word is pointing to before explaining the mechanism.

### 3. Missing Background

Explain what the user must know before the concept makes sense.

Use 3 to 5 bullets only.

Each bullet must follow this pattern:

`你先知道一件事：……`

Rules:

- Do not use tables here.
- Do not introduce more new terms than necessary.
- If a new term is unavoidable, explain it in the same sentence.

### 4. Why This Thing Was Invented

Explain the real problem that created this concept.

Use this format:

- `原来怎么做：……`
- `这样有什么问题：……`
- `所以才有了 XX：……`

Keep it concrete. Tie it to AI systems, RAG, model inference, vector database, or engineering delivery only when relevant.

### 5. What It Is Physically

Always answer what the concept is inside a real system.

Choose one or more labels:

- Code
- Algorithm
- Model architecture
- Model weight or parameter
- Data
- Data file
- Database index
- Service
- Protocol
- Configuration
- Evaluation metric
- Training method
- Inference strategy
- Product feature
- Abstract design idea

Then explain:

- Engineers create what?
- Engineers configure what?
- The system stores what?
- The system runs what?

Use direct wording.

Example:

`IVF-PQ 物理上通常是向量数据库里的索引。它不是大模型。它不是一段单独给用户看的功能。工程师是在向量数据库里选择这种索引方式，然后让数据库按这种方式保存和查找向量。`

### 6. How It Works, Step By Step

Explain with 3 to 5 numbered steps.

Each step must be short:

`1. 系统先……`

Rules:

- No tables unless the user asks.
- No formulas unless the user asks.
- No parameter names unless necessary. If necessary, explain the parameter as a plain switch or number.
- One step should explain one action only.

### 7. What The User Should Listen For At Work

Explain how the user may hear this concept in real work.

Use this format:

- `如果技术团队说……，你要理解成……`
- `你可以追问……`

Give 2 to 4 useful questions the user can ask.

If project-specific facts are needed but not provided, say:

`目前信息不足以绑定到具体项目事实，只能按通用 AI 交付场景解释。`

Do not invent SGA, Zijin, customer, vendor, metric, timeline, or deployment facts.

### 8. Optional Visual Follow-up

Do not automatically call an image generation tool in the same turn as the explanation. In this client, the generated-image result can replace or hide the text response.

The complete text explanation must therefore be delivered as the final answer for the current turn.

Generate an AI image only when the user explicitly asks for a separate visual follow-up such as `配图`, `生成解释图`, or `单独生成图片`.

For that separate image turn:

1. Use the built-in image generation tool.
2. Create one clean Chinese educational image.
3. For process or architecture concepts, use a restrained flowchart or layered diagram.
4. Use large Chinese labels and no unexplained English.
5. Do not repeat the full explanation in the image turn.

The visual must:

- Use Chinese labels.
- Show only the minimum necessary nodes.
- Avoid decorative illustration.
- Prefer flowchart style for process concepts.
- Prefer layered architecture style for system concepts.
- Distinguish "human-facing output" and "machine-facing output" when relevant.
- Be shown only after the complete text explanation and work guidance.
- Contain no unexplained English labels.
- Use large, legible Chinese text and avoid decorative visual noise.

When a local image file is created, include its saved path immediately before the embedded image, still within the final visual section.

Before finishing the explanation turn, verify all three conditions:

- The answer contains a complete standalone text explanation.
- No image tool call can hide the text.
- The user can understand the concept without any visual.

## Depth Control

Default to zero-foundation explanation.

If the user says "还是听不懂", reduce one level:

- remove tables,
- remove parameter names,
- split the concept into smaller concepts,
- explain only the first concept,
- ask the user to continue to the next layer after that.

If the user says "继续深入", add implementation details only after the zero-foundation layer is clear.

If the user says "我这样理解对吗", use the correction protocol.

## Correction Protocol

When the user explains the concept back:

1. First say whether the understanding is usable.
2. Give a concise corrected understanding.
3. Point out 1 to 3 missing pieces.
4. Do not rewrite the whole explanation unless asked.

## Hard Rules

- Never call image generation automatically in the explanation turn.
- Never sacrifice the complete text response to satisfy an image requirement.
- Never rely on commentary text that may be hidden by the interface; the final answer itself must contain the complete explanation.
- Do not use Mermaid unless the user explicitly asks for Mermaid.
- A generated visual is a separate follow-up artifact, not part of the explanation turn.
- Do not include a "common misunderstandings" section.
- Do not give only a definition.
- Do not assume math foundation.
- Do not assume computer science foundation.
- Do not use life analogies unless the user explicitly asks.
- Do not explain with formulas unless the user explicitly asks.
- Do not use tables except for very simple classification, and avoid tables by default.
- Do not use unexplained jargon.
- Do not fabricate project facts.
- Always answer "what is it physically".
- Generate a visual only in a separate follow-up turn after an explicit user request.
