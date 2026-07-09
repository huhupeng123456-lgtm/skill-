# Demo Design Principles for Non-Technical Learners

When building a demo for a PM or non-coder, follow these rules.

## 1. One Concept Per Demo

Do not try to explain k8s, load balancing, and model deployment in one screen. Pick the single concept the user asked about. Mention related concepts only as labels or links.

## 2. Show Cause and Effect

Every interactive element must produce a visible, immediate reaction. If the user clicks a button and nothing obvious happens, the demo fails.

## 3. Mimic a Real Product Interface

The demo should feel like the user is operating a real tool, not watching an abstract animation.

- Borrow layouts and controls from real products the user might encounter.
- Use tables, sidebars, status badges, logs, metric cards, and config panels.
- Let the user take actions that a real operator would take: enable/disable, configure, deploy, scale, query, fail over.
- Example: a load balancer demo should look like a simplified cloud console, not just circles moving across a line.

The goal is to reduce the gap between "I played with this demo" and "I could recognize this in a real product."

## 4. Use Concrete Metaphors, Not Abstract Diagrams

- Load balancer → traffic cop directing cars.
- K8s scheduler → Tetris placing blocks on boards.
- Database index → book index vs reading every page.

## 5. Keep the UI Minimal

- One main visualization.
- One or two controls.
- Short labels. Avoid jargon in buttons.

## 6. Explain Technical Terms Inline

The user is learning the vocabulary, not just the concept. Every technical term should appear with its original English name and a plain-Chinese explanation in parentheses.

Explanations must be placed **directly inside the page UI** — next to labels, under metric cards, inside panel headers, or as helper text — not only at the bottom of the page.

Good examples:

- Metric card label: "总请求数 Total Requests（客户端累计发起的请求总数）"
- Panel title: "后端服务器 Backend Servers（真正处理用户请求的机器）"
- Dropdown label: "调度算法 Load Balancing Algorithm（选择哪台服务器处理请求的规则）"
- Inline helper: "点击「模拟故障」让某台服务器不可用，观察流量是否自动切走。"

Keep the original term so the user can recognize it in documents, meetings, and job descriptions.

## 7. Always Include an Explanation Box

Below the demo, add a short section:

- What am I seeing?
- Why does this technology exist?
- Where is this used in real systems?

## 8. Always Include a Real-World Scenario

Add a separate box that answers: "What do other people actually use this for?"

Use a concrete business scenario, not an abstract definition. Include:

- A relatable situation (e.g. a website going viral).
- The problem before the technology exists.
- How the technology solves it.
- One or two common product names the user might hear in meetings.

Example for load balancer:

> 你做了一个 AI 问答网站，突然上了热搜。一台服务器会被挤爆，负载均衡器把流量分到多台机器；某台宕机时自动切走。Nginx、AWS ELB、阿里云 SLB 都是干这个的。

## 9. Default State Should Tell a Story

When the demo loads, it should already show the concept in action. Do not start with a blank canvas that requires the user to figure out what to do.

## 10. Prefer Animation Over Text

If a concept involves flow, time, or state change, animate it. Static arrows are weaker than moving particles.

## 11. Make Failure Visible

If the concept includes failure handling (health checks, retries, circuit breakers), let the user trigger the failure and watch the system recover.

## 12. Keep Code Hidden

The user is not here to read code. Put implementation details in a collapsible panel at most. The visualization is the product.

## 13. Output Format

Generated demos should use the bundled `assets/templates/react-vite/` template so they are consistent and easy to run.
