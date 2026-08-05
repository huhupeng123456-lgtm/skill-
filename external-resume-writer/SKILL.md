---
name: external-resume-writer
description: Write, rewrite, or review outward-facing Chinese resumes for job applications, especially AI FDE, AI product, AI solution, delivery, data, and B2B project roles. Use when the user asks to polish a resume, tailor a resume to JD, convert project materials into resume bullets, audit whether wording is suitable for external submission, or create Word/PDF resume versions.
---

# External Resume Writer

## Core Standard

Treat the resume as an external job-market document, not an internal project report. Every line must help a recruiter or interviewer understand:

1. what role the candidate played
2. what business or user problem they handled
3. what action they personally took
4. what skill the action proves
5. what result or scale is supported by evidence

If a sentence cannot support an interview conversation, remove it or rewrite it.

## Required Workflow

1. Read the real resume, JD, and user-provided source materials before rewriting.
2. Extract the JD's repeated requirements and map them to the candidate's real experience.
3. Preserve facts and remove unsupported claims. Do not invent technical ability, job titles, deliverables, dates, companies, systems, or results.
4. Rewrite bullets for external readability. Use STAR thinking internally, but do not force labels like "Situation/Task/Action/Result" unless the user asks.
5. Self-audit before final delivery using the red-line checklist below.

When the user says the resume must be "directly usable", produce final files or complete replacement text, not suggestions only.

## Red-Line Checklist

Do not include internal acceptance, audit, or risk-control language in outward-facing resume bullets. Remove or rewrite wording like:

- "验收口径"
- "终验材料"
- "运行报告、SOW 与实际交付范围"
- "区分已交付能力、历史规划能力和后续探索能力"
- "未交付、未达标、未确认"
- "保证正式材料与实际交付范围一致"
- "避免写成正式结论"

These are internal delivery-control statements. They make the candidate look like they are explaining project paperwork, not demonstrating marketable ability.

Avoid defensive or AI-flavored transitions in capability statements:

- "而非"
- "不是单纯..."
- "避免..."
- "并非..."
- "只是..."

Prefer direct positive wording:

- Bad: "负责需求澄清，而非单纯项目记录。"
- Good: "负责客户需求澄清、场景拆解、方案边界定义和研发协同。"

## Resume Bullet Rules

Use one bullet for one interviewable point. A good bullet should usually contain:

`场景/问题 + 个人动作 + 方法/协同对象 + 结果/能力证明`

Examples:

- Good: "围绕供应链采购方案审批场景，梳理物资推荐、历史采购价格查询、原材料价格查询和物料说明生成的实际流程，明确查询入口、数据来源、权限边界和审批节点，将业务诉求拆解为可交付的 AI 辅助决策功能。"
- Good: "参与采购价格异常归因场景建设，梳理历史采购价格、原材料价格、外部市场数据和供应商信息等分析维度，协同 BI 与研发团队形成系统化分析口径，支撑价格查询、异常识别和原因追溯。"
- Bad: "对终验材料、运行报告、SOW 与实际交付范围进行口径核对，区分已交付能力、历史规划能力和后续探索能力，保证正式材料与实际交付范围一致。"

Prefer market-facing action verbs:

- 梳理、拆解、明确、推动、协同、转化、设计、评估、优化、沉淀、定位、对齐、支撑

Avoid internal-report verbs when they dominate the bullet:

- 汇总、整理材料、核对口径、撰写结论、区分范围、规避风险

These can appear only when clearly secondary to a marketable capability.

## AI/FDE-Specific Rules

Do not list model names as a "技术栈". Qwen, DeepSeek, GPT, Doubao, Claude, etc. are models or model families, not proof of stack capability by themselves.

Do not claim development ability the user does not have. If the user cannot code or does not own implementation, write:

- 需求澄清
- 方案拆解
- 场景设计
- 知识库治理
- 效果评测
- Bad Case 分析
- 跨团队协同
- 与研发团队对齐接口边界、权限规则、页面入口和验收标准

Do not write:

- 系统集成开发
- 后端开发
- 前端开发
- 算法研发
- 模型训练
- 独立完成系统对接

Only use these if the user provides clear evidence.

For "系统集成", distinguish carefully:

- If the candidate did not develop integrations, do not write "系统集成" as a professional skill.
- Use "企业系统协同" or "业务与技术接口人" only when the user actually coordinated OA, SRM, SAP, BI, SSO, API, or page-entry discussions.

## Content Style

Write for recruiters and interviewers, not for executives already familiar with the project.

Avoid:

- internal project-report tone
- leadership briefing tone
- vague labels such as "项目交付资产"
- table-like ability mapping unless the user explicitly asks
- repeated concepts across summary, skills, and experience
- excessively precise internal numbers that look unnatural, unless the source and purpose are strong

Use:

- clear section names: 职业摘要、核心优势、工作经历、能力与工具、教育与证书
- concise Chinese with direct subject-verb-object structure
- quantified results only when meaningful and source-backed
- two pages when needed; do not force one page at the cost of readability

## Final Self-Audit

Before delivering, check:

1. No internal acceptance-control bullet remains.
2. No defensive wording like "而非/避免/不是单纯" remains in capability claims.
3. No unsupported technical ability is implied.
4. Every work-experience bullet can be answered in an interview with "I did X because Y, with Z result."
5. Repeated ideas have been merged.
6. Education and certificates are not duplicated at the top and bottom.
7. For Word/PDF delivery, verify page count, image placement, font size, spacing, and obvious visual alignment.
