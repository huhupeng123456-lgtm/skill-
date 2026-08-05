---
name: contract-audit
description: Review contracts and formal business documents, especially procurement orders, software development agreements, service agreements, NDAs, customer agreements, vendor contracts, SOWs, acceptance documents, and legal handoff files. Use when the user asks to audit, review, redline, comment, annotate, mark up, or prepare a contract/formal document for internal review, boss review, customer legal review, or counterparty legal review.
---

# Contract Audit

## Goal

Review contracts and formal documents in a way that is useful for real negotiation, not just generic legal commentary.

For Word documents, prefer adding real document comments when the user asks to mark, annotate, comment, or send a reviewed version. Preserve the original file by making a backup or a clearly named reviewed copy if the source is open or locked.

## Core Rules

- Use Chinese by default.
- Do not mix Chinese and English casually. If an English term must be kept, add a Chinese explanation in parentheses.
- Do not give legal advice as final authority. State that the review is an auxiliary business/legal review and should be confirmed by qualified legal counsel.
- Read the whole document before making clause comments.
- Check later clauses, attachments in the same file, payment terms, acceptance terms, termination terms, and definitions before flagging a missing protection.
- If a later clause already solves the issue, do not mark the earlier clause as risky only because it is incomplete.
- If upper-level contracts, master agreements, SOWs, playbooks, or company legal positions are mentioned but not provided, say the current review is limited to the provided file.
- For SGA, Zijin, or real customer facts, verify local project sources when available before asserting project facts.
- Keep comments understandable to business people. Formal does not mean obscure.

## Review Modes

Determine the mode before writing comments.

### Internal Review Mode

Use when the user is still thinking, wants boss review, or asks whether a clause is acceptable.

Comment style may include:

```text
原文：……
问题说白了：……
建议改为：……
```

Use this only for internal drafts. It is useful for clarity but not suitable for sending to the counterparty.

### Counterparty Legal Mode

Use when the user says the document will be sent to the other party, customer, supplier, or legal team.

Do not use:

- 风险等级
- 问题说白了
- 背锅
- 坑
- 不友好
- 太离谱
- 甲方太强势

Use:

```text
建议明确：……
建议调整：……
建议补充：……
建议与双方上层协议或项目主合同保持一致：……
```

Write comments as negotiation language, not accusations.

## Full-Document Cross-Check

Before adding a comment, verify:

- Is the issue already resolved in a later clause?
- Does another clause create a conflicting rule?
- Does a table term override a body term?
- Is the clause about goods, services, software, data, or general procurement?
- Is the user the buyer, supplier, vendor, customer, service provider, licensor, or licensee?
- Does the issue depend on an external attachment not provided?

If a point depends on an unprovided document, write:

```text
建议明确：如双方另有上层协议或项目主合同，应与其中关于本事项的约定保持一致；如目前无相关上层协议或主合同明确约定，本采购订单不应扩大供应商义务或责任范围。
```

## Contract Checklist

For contracts, check at least these areas:

- Contract file priority and incorporated external terms
- Order acceptance and system operation effect
- Payment trigger, payment period, invoice requirements
- Acceptance deadline, written objection deadline, deemed acceptance
- Service scope, change requests, additional cost and schedule adjustment
- Intellectual property ownership and supplier background intellectual property
- Third-party infringement responsibility and liability cap
- Confidentiality scope, exceptions, and duration
- Data processing scope, personal data, important data, new data scenarios
- Subcontracting, affiliated companies, contractors, professional service personnel
- Personnel replacement and qualification requirements
- Warranty, defect responsibility, and post-acceptance claims
- Indemnity, liquidated damages, liability cap, indirect damages
- Termination for convenience, termination settlement, work in progress
- Governing law, jurisdiction, notice, authorized representative

## Practical Positions From This User

Apply these defaults unless the user says otherwise:

- For SGA as supplier or service provider, preserve SGA's existing AI capabilities, tools, methods, reusable modules, templates, project experience, and background intellectual property.
- If no upper-level contract is provided, do not assume the purchase order can transfer all supplier intellectual property.
- For software or AI service projects, the buyer may use confirmed deliverables for the project, but supplier reusable assets should remain with the supplier.
- Data obligations should be limited to data actually needed for the project. New data types, new systems, new business scenarios, personal information, or important data processing should require separate confirmation.
- Affiliated companies, cooperative personnel, and professional service personnel needed for delivery should not automatically be treated as prohibited subcontracting. Substantial transfer of delivery responsibility can require written approval.
- Order changes affecting scope, deliverables, timeline, acceptance, staffing, or fees should require written confirmation by both parties before execution.
- Communication, clarification, scheduling, document preparation, and system viewing should not count as order acceptance.

## Comment Style Guide

Read `references/comment-style.md` when writing or rewriting comments, especially when producing a Word document for external legal review.

Use plain wording:

```text
建议明确：供应商只有在盖章、电子签署或书面确认后，才视为接受订单或订单变更。供应商在正式确认前进行的沟通、需求澄清、排期评估、资料准备、系统查看等行为，仅属于前期评估和准备，不构成对订单或订单变更的接受。
```

Avoid hard-to-read wording:

```text
供应商为沟通、澄清、排期、资料准备或系统查看所作行为，不应视为对订单或订单变更的接受。
```

## Word Document Workflow

When adding comments to `.docx`:

1. Create a backup or reviewed copy before editing.
2. Preserve the original layout.
3. Use real Word comments, not plain inserted text, unless the user asks otherwise.
4. Set the comment author to the user name when requested.
5. If the source file is locked by WPS or Word, write a new version instead of failing.
6. After editing, verify the comment count and author fields.
7. Report the output path and what changed.

When using scripts, keep them temporary unless the user asks to preserve tooling.

## Final Response

After a review or edit, state:

- Which file was reviewed or created
- Whether comments were written into the same file or a new file
- Comment count
- Key topics covered
- Any limits, such as missing upper-level contract or missing attachments
