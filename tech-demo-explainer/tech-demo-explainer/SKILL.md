---
name: tech-demo-explainer
description: Generate interactive, browser-based demos that explain technology concepts to non-coders. Use when the user asks about a technical topic (e.g. load balancing, Kubernetes, TypeScript, model deployment, caching, message queues) and wants to "see what it does" through a local localhost demo. Triggers on natural-language questions, screenshots of job requirements, or lists of technical skills.
---

# Tech Demo Explainer

Transform abstract technology concepts into interactive browser demos that run on `localhost`. Built for PMs and non-coders who need to understand what a technology does before discussing it with engineers.

## Workflow

Follow these steps every time this skill triggers.

### 1. Identify the concept

Extract the core technology concept from the user's input.

- Natural language: "什么是负载均衡" → load balancing.
- Screenshot or JD: parse visible skills and ask the user which one to demo first.
- Multiple concepts: pick the most visual one first, list the others as follow-up demos.

### 2. Choose a demo pattern

Read [references/concept_patterns.md](references/concept_patterns.md) to pick a proven demo shape. If the concept is not in the reference file, choose the closest match or design a new interactive simulation using the principles in [references/demo_design.md](references/demo_design.md).

Common patterns:

- **Load balancer** → traffic distribution simulation.
- **Kubernetes** → cluster scheduler simulation.
- **Model deployment** → pipeline + autoscaling visualization.
- **TypeScript** → side-by-side JS/TS type-checking comparison.
- **API/REST** → request builder with simulated responses.
- **Database index** → table scan race.
- **Caching** → cache hit/miss visualization.
- **Message queue** → producer-consumer pipeline.

### 3. Scaffold the project

Run the scaffold script to create a runnable React + Vite project.

```bash
python scripts/create_demo.py \
  --concept "Concept Name" \
  --tagline "One-line description" \
  --points "Point 1" "Point 2" "Point 3" \
  --output-dir ./temp/<concept-kebab>-demo
```

Then replace the generated `App.jsx` with a custom interactive demo. Keep the template's CSS classes for consistent styling.

### 4. Build the demo

Design the demo using the rules in [references/demo_design.md](references/demo_design.md):

- One concept per demo.
- Show cause and effect immediately.
- Mimic a real product interface so the user feels they are operating a real tool.
- Use concrete metaphors.
- Keep controls minimal.
- Explain every technical term with its original English name in parentheses.
- Include an explanation box.
- Include a real-world scenario box.
- Start with a default state that already tells a story.
- Animate flows when possible.
- Make failure visible for resilience concepts.
- Hide code from the main view.

### 5. Run it locally

Start the dev server:

```bash
python scripts/run_demo.py --demo-dir ./temp/<concept-kebab>-demo
```

Wait for the localhost URL to appear, then tell the user where to open it.

### 6. Explain what the demo shows

Give the user a short explanation in plain Chinese:

- What is happening on screen?
- Why does this technology exist?
- Where would they see it in a real project?

Avoid jargon. Use the metaphor chosen in step 4.

## Resources

### scripts/create_demo.py

Scaffolds a React + Vite demo project from the bundled template. Run this before writing the custom demo code.

### scripts/run_demo.py

Installs dependencies and starts the local dev server for a generated demo.

### assets/templates/react-vite/

A minimal React + Vite project used as the base for all demos. Copy it via `create_demo.py` instead of creating projects from scratch.

### references/concept_patterns.md

A mapping of common technology concepts to proven demo shapes. Read this to pick the right visualization.

### references/demo_design.md

Design principles for demos aimed at non-technical learners. Read this before building the UI.

## Output Checklist

- [ ] Demo project created in `./temp/<concept>-demo`.
- [ ] `npm run dev` is running and a localhost URL is available.
- [ ] The demo starts in a meaningful default state.
- [ ] At least one control produces a visible reaction.
- [ ] The UI mimics a real product interface.
- [ ] Technical terms are explained with original English names in parentheses.
- [ ] An explanation box answers "what am I seeing?"
- [ ] A real-world scenario box answers "what do people use this for?"
- [ ] The user receives the localhost URL and a plain-language summary.
