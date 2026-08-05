# Contract Comment Style

Use this reference when writing comments in a contract or formal document.

## External Legal Style

Use for documents sent to the counterparty's legal team.

Preferred patterns:

```text
建议明确：……
建议调整：……
建议补充：……
建议与双方上层协议或项目主合同保持一致：……
```

Rules:

- Be specific.
- Keep one comment focused on one issue.
- Avoid emotional or accusatory language.
- Do not use internal labels like risk level.
- Do not say "问题说白了".
- Avoid legalistic wording if simpler wording is clear.
- Explain the business effect only when it helps the counterparty understand the requested change.

Example:

```text
建议明确：采购方收到供应商提交的交付成果后，应在十个工作日内完成验收或提出书面异议；逾期未反馈的，视为验收合格。验收合格或视为验收合格后，采购方应在收到合法有效发票后六十日内支付对应款项。
```

## Internal Review Style

Use for the user's own thinking, boss review, or deciding whether to negotiate.

Preferred pattern:

```text
原文：……
问题说白了：……
建议改为：……
```

Example:

```text
原文：验收合格后，且收到发票后六十自然日，支付百分之七十。
问题说白了：供应商交付完成后，如果采购方一直不出验收结论，百分之七十尾款就一直不能进入付款流程。
建议改为：采购方收到交付成果后十个工作日内完成验收或提出书面异议；逾期未反馈的，视为验收合格。
```

## Plain Formal Wording

Good:

```text
建议明确：只有在供应商交付的成果本身被认定侵犯第三方知识产权时，供应商才承担相应赔偿责任。若侵权原因是采购方自行修改、与其他系统或材料组合使用、采购方指定使用特定材料，或超出合同约定范围使用，则不应由供应商承担责任。
```

Too hard to read:

```text
知识产权赔偿责任应限于因供应商交付成果本身侵犯第三方知识产权且经生效法律文书或双方确认的责任。
```

## SGA Supplier Positions

Use these as starting points when SGA is supplier or service provider:

### Intellectual Property

```text
建议调整：本项目涉及供应商既有的人工智能能力、通用技术组件、工具链、方法论、模板、可复用模块及项目经验，该等内容不应因本订单交付而转移给采购方。采购方可在本项目范围内使用经双方确认的交付成果；供应商保留其既有及可复用知识产权。
```

If no upper-level contract is provided:

```text
建议明确：如双方另有上层协议或项目主合同，应与其中关于知识产权归属和使用范围的约定保持一致；如目前无上层协议或主合同明确要求供应商转让知识产权，本采购订单不应扩大供应商知识产权转让范围。
```

### Data Processing

```text
建议明确：本订单项下的数据处理义务仅限于本项目实际交付所必需的数据范围。涉及新增数据类型、新增系统、新增业务场景、个人信息或重要数据处理的，应由双方另行确认处理范围、安全要求和责任边界。
```

### Subcontracting

```text
建议调整：供应商为履行本项目需要使用关联公司、合作人员或专业服务人员提供支持的，不应被视为禁止分包。供应商应对相关参与人员的工作成果、保密义务和合规义务承担管理责任；如涉及实质性转包或影响项目交付主体的分包，再由双方另行书面确认。
```

### Order Change

```text
建议重点调整：采购方提出任何涉及服务范围、交付内容、交付周期、验收标准、人员投入或费用变化的订单变更，均应经双方书面确认后执行。供应商未书面确认前，不视为接受变更，也不承担因变更导致的交付延期或额外成本。
```

### Order Acceptance

```text
建议明确：供应商只有在盖章、电子签署或书面确认后，才视为接受订单或订单变更。供应商在正式确认前进行的沟通、需求澄清、排期评估、资料准备、系统查看等行为，仅属于前期评估和准备，不构成对订单或订单变更的接受。
```
