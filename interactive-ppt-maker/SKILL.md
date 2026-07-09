---
name: interactive-ppt-maker
description: "Use this skill when the user wants an interactive, staged workflow to create a PowerPoint deck: first clarify or infer the PPT brief, then produce an editable outline, then optionally generate visual overview images with imagegen, then create a final editable .pptx using the pptx skill. Trigger when the user asks for a step-by-step PPT workflow, outline-first PPT creation, visual style previews before deck generation, or a repeatable PPT generation workflow rather than a one-shot deck."
---

# Interactive PPT Maker

This skill orchestrates a staged PPT workflow:

1. Brief
2. Outline
3. Slide logic design
4. Visual direction
5. Editable PPT
6. Validation

It should cooperate with these skills when available:

- `imagegen`: generate PPT overview boards or style references.
- `pptx`: create or edit the final `.pptx`.

Do not paste a generated overview image as the final slide background unless the user explicitly wants a non-editable mockup. The final PPT should use editable text boxes, shapes, charts, and image placeholders.

## Default Interaction Flow

### Stage 1: Brief

If the user already provided enough context, infer reasonable defaults and proceed. Ask only for missing high-impact choices.

### Obsidian RAG Preflight

Before drafting the brief or outline, check whether the PPT topic depends on the user's existing knowledge base, historical project materials, meeting notes, client/project archives, or Obsidian content.

Trigger examples:

- "基于我 OBS 里的资料做 PPT"
- "用我之前紫金项目的资料"
- "查一下我的知识库再做"
- "根据历史会议纪要/项目验收材料生成汇报"
- Any PPT request that mentions an existing client, project, document archive, or previous notes likely stored in `F:\work`

When triggered, run Obsidian hybrid retrieval first:

```powershell
python F:\work\.rag\obsidian_rag.py --embed-provider ollama hybrid-search "用户的PPT主题或资料问题" --top-k 8 --include-text
```

Use the retrieved snippets as source material for the PPT brief, outline, slide logic, and speaker notes. Cite source paths internally while drafting, and surface source paths to the user when asking them to approve the outline.

If the retrieval result is weak, broaden the query with project names, client names, dates, deliverable names, and likely Chinese synonyms, then search again before proceeding.

Minimum brief fields:

- Topic
- Audience
- Page count
- Purpose: report, training, sales, project update, proposal, internal sharing, etc.
- Output language
- Desired style, or 2-3 style options to explore
- Save location

Default assumptions when unspecified:

- Page count: 10
- Audience: business/general professional audience
- Style: professional business style
- Layout: 16:9
- Save location: user desktop
- Output language: same as user request

### Stage 2: Outline

Produce an outline before making a file unless the user explicitly asks to skip it.

Each slide should include:

- Slide title
- Core message
- Main content bullets
- Suggested layout
- Speaker notes or talking points
- Visual element suggestion

After presenting the outline, ask the user to choose:

- Approve outline and continue
- Modify outline
- Generate 2-3 visual overview options first

If the user asks for speed or says to continue, proceed with the outline as approved.

### Stage 3: Slide Logic Design

Before generating visual previews or a final PPT, convert each slide from "content items" into a "logic relationship".

Do not default to ordinary card grids. Card grids are allowed only when the slide is genuinely a parallel list, such as a feature catalogue or stakeholder list. For executive, project, acceptance, review, or strategy decks, prefer layouts that visually explain how the ideas relate.

For every slide, identify one primary logic type:

- **Value chain**: capability -> usage -> evidence -> result.
- **Problem chain**: symptom -> root cause -> impact -> required action.
- **Evidence chain**: deliverable -> test/operation evidence -> acceptance conclusion.
- **Before / after**: current state -> target state -> change enabled.
- **Timeline**: milestone -> decision -> output -> next gate.
- **Matrix**: dimension A vs dimension B, used for scope, responsibility, risk, or prioritization.
- **Closed loop**: issue -> action -> owner -> output -> verification.
- **Funnel / filter**: broad inputs -> screened priorities -> selected actions.
- **System map**: entry -> platform -> model/data -> business scenario.

Each slide must have:

- A single headline conclusion, not just a topic label.
- A visible relationship structure: arrows, bands, steps, layered blocks, swimlanes, matrix axes, or a loop.
- Text that supports the relationship, with repeated syntax across related elements.
- A clear reading path from left to right, top to bottom, or center outward.

Avoid:

- Six unrelated cards with no connection.
- Repeating the same card layout across many slides.
- Decorative shapes that do not express the business logic.
- Numbers placed as decoration without explaining what they prove.
- "Title + card grid" as the default answer.

For acceptance or project-review decks, use this default narrative:

1. **Main achievements**: show a value chain, e.g. platform foundation -> unified entry -> business scenarios -> measurable results.
2. **Existing problems**: show a blockage or risk chain, e.g. entry experience -> resource boundary -> model/platform dependency -> acceptance criteria -> responsibility boundary.
3. **Next plan**: show a closure table or loop, e.g. problem -> action -> execution method -> acceptance output.

When drafting slide content, write a short "logic note" for yourself before layout:

```text
Slide: [title]
Conclusion: [one-sentence claim]
Logic type: [value chain/problem chain/etc.]
Relationship: [A -> B -> C, or rows/columns of matrix]
Visual structure: [timeline/swimlane/loop/etc.]
```

Only after this logic note is clear should you design the visual page.

### Stage 4: Visual Direction

Use `imagegen` when the user asks for style exploration, overview images, mood boards, or visual previews.

Generate overview boards as design references, not final assets:

- 10 slide thumbnails in a grid when page count is 10.
- Show rough layout, title hierarchy, and style.
- Text in generated images may be inaccurate; use the approved outline as the source of truth.

Recommended overview prompt structure:

```text
Generate a high-resolution PPT deck overview board for [topic].
Create exactly [N] distinct 16:9 slide thumbnails arranged in a clean grid.
Audience: [audience].
Style: [style].
Use these slide titles: [titles].
Show realistic layouts with charts, diagrams, icons, executive summary blocks, and visual placeholders.
This is a design preview board, not a single slide. No watermark.
```

After visual options are generated, ask the user to choose one style.

### Stage 5: Editable PPT Generation

Use the `pptx` skill for any `.pptx` creation or editing.

Implementation requirements:

- 16:9 unless requested otherwise.
- Use editable objects: text boxes, shapes, chart-like shapes, tables, and image placeholders.
- Preserve the chosen style consistently across slides.
- Each slide should include:
  - Title area
  - Body/content area
  - Visual/diagram area
- Avoid text-only slides.
- Keep text readable and not crowded.
- Use the approved outline text, not OCR from generated overview images.
- Do not generate ordinary card piles unless the approved slide logic is explicitly a parallel list.
- If a slide contains cards, connect them with labels, arrows, grouping bands, axes, or a progression so the reader can see why the cards belong together.
- For every content slide, validate that the layout communicates the slide's logic type without requiring the presenter to explain it verbally.

When creating from scratch, prefer PptxGenJS if available, following the local `pptx` skill guidance. If PptxGenJS is unavailable, install or use the repo's established PPT generation method, then validate.

## Style Recipes

Use these as starting points, adapting to the topic.

### White Minimal Business

- Background: white/off-white
- Accent: restrained blue or teal
- Feel: consulting deck, clean, high whitespace
- Visuals: simple diagrams, comparison tables, KPI blocks

### Black Tech

- Background: deep charcoal or near-black
- Accent: cyan, electric blue, green, violet
- Feel: AI, data, dashboard, executive technology
- Visuals: grids, glow lines, system maps, process flows, dark panels

### Colorful Cartoon / LEGO-like

- Background: clean light base
- Accent: red, yellow, blue, green blocks
- Feel: workshop, playful, creative, still professional
- Visuals: toy-brick scenes, block diagrams, friendly characters, step paths

## Validation

Before final response:

1. Confirm the file exists.
2. Confirm slide count.
3. Confirm 16:9 dimensions when requested.
4. Confirm key slide titles are present.
5. Confirm each content slide has a visible logic structure, not only a card grid.
6. If possible, open with PowerPoint COM or another local validator.
7. If thumbnail rendering fails due to local dependencies, say so and report the structural validation used.

## Final Response

Keep the final response short:

- Saved path
- Slide count and format
- Style used
- Validation result
- Any known limitation

Example:

```text
Editable PPT created:
G:\...\Desktop\xxx.pptx

10 slides, 16:9, black tech style. Verified that PowerPoint can open the file and the slide titles are present.
```
