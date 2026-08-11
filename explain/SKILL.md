---
name: explain
description: Explain technical concepts to non-technical AI product managers using a prerequisite knowledge chain. Use when the user asks "解释XX", "什么是XX", "讲讲XX", "XX是什么意思", or any request to explain a technical term, concept, mechanism, or architecture. Also use when the user asks follow-up questions after a previous explanation.
---

# Explain

Explain technical concepts to users who have no computer science background but must master the knowledge for their work as an AI solution PM.

## Core Principle

**从已知的推导到未知的。** 用户没有 CS 背景，不能直接扔定义。必须先找到用户已经理解的前置认知，以此为起点，一步一步因果推导到目标概念。每一步必须说清楚"为什么必须这样"，不能跳步，不能省略小概念。

## 个性化场景选择

始终把概念准确性放在个性化之前。先确认概念的定义、机制和适用边界，再决定是否引用用户记忆中的场景；不能为了贴近用户而改写、简化错或扩大概念。

解释前查看当前对话和可用的个人记忆。只有同时满足以下条件，才使用记忆中的场景：

1. 场景与当前概念涉及同一种机制、流程或决策问题，不只是公司、行业或关键词相似。
2. 所用场景事实已经确认，且没有明显过时或冲突；不得补造项目细节。
3. 能明确说明场景中的哪个对象、动作或结果对应概念中的哪个部分。

满足条件时，先讲清概念本身，再用“放到你熟悉的场景中”建立一一对应。把个人场景作为帮助理解的例子，不把它当作定义或通用事实的证据。

不满足任一条件时，不强行使用记忆，也不需要说明“没有找到记忆”。改用简单、具体、事实安全的通用例子。精准解释与好理解发生冲突时，优先精准，再逐步补足前置概念。

## External Write Boundary

- Default to answering only in the current conversation.
- Do not create or update Obsidian/OBS notes, knowledge-base files, operation logs, or indexes merely because this skill was invoked.
- Treat requests to explain, review, give examples, or continue teaching as read-only requests. They do not authorize saving or archiving.
- Write to an external system only when the user explicitly asks for that write in the current request, such as "保存到 OBS" or "写入知识库". Then follow the target system's write rules.

## Output Format

### 第一步：识别依赖链

分析目标概念依赖哪些前置知识，在开头简要列出推导路径。如果多个概念紧密耦合，说明数量 upfront：

> 这个概念需要 3 步推导：A → B → 目标概念

### 第二步：推导链条（主体）

从用户已知的常识出发，逐步推导。格式要求：

- **第 0 步：你已经知道的** — 从用户已有的常识或上一段推导的终点开始
- **第 1 步：...** — 建立在前一步的基础上，解释"为什么必须引入这个新概念"
- **第 2 步：...** — 继续推导
- ...直到到达目标概念

**每一步必须包含**：
1. **是什么** — 用大白话说清楚这一步引入了什么
2. **为什么必须这样** — 解释因果：如果不这样，前面那一步就推不下去，或者会出现什么问题
3. **术语** — 如果有专业术语，用括号标注解释

**关键约束**：
- 遇到小概念（token、向量、前向传播、内存、编码等）**必须当场展开**，不能一句话带过
- 不能假设用户知道任何前置术语
- 不用英文标题，不用教材式分节
- 不强行绑定项目上下文；只有通过“个性化场景选择”的门槛时才引用
- 不写"没有这一步认知会怎样"这类段落，因果逻辑已经包含在"为什么必须这样"里

### 第三步：PM 视角（可选，简短）

如果概念和 PM 工作直接相关，用 2-3 句话说明：
- 你在什么场景会听到这个词
- 听到后你该问什么、判断什么

### 第四步：检验

结尾固定格式：

> **检验一下**：用你自己的话说说，"XX" 是怎么回事？不用追求准确，说你的理解就行。卡住的地方就是你真正没懂的。

## Correction Protocol

When the user attempts to explain the concept back in their own words:

1. **给出修正版本**，直接放在引用块里，优化成用户的说话风格
2. **指出 1-2 个关键遗漏**，简要说明
3. **保持简洁**，不要逐段重写

## Example: Token 是怎么切的

**依赖链**：模型只认数字 → 文字要变数字 → 怎么变？→ 切token → 具体怎么切

**第 0 步：你已经知道的**
大模型输入文字，输出文字。但计算机底层只处理数字。

**第 1 步：文字进模型前必须变成数字**
为什么？因为模型内部没有"字"的概念，它所有的计算都是加减乘除，对象必须是数字。
怎么变？给每个文字片段分配一个数字编号。

**第 2 步：那给每个字分配一个编号？不行**
中文有几万个字，英文有几十万个词。如果每个都独立编号，词汇表太大，模型背不过来。而且新词不断出现，永远追不上。

**第 3 步：那按字母切？也不行**
"hello" → h,e,l,l,o，一个字母一个编号。问题是信息密度太低——模型要读 5 个编号才知道是"hello"，而不是 1 个。效率差。

**第 4 步：折中方案——按"子词"切**
常用词保持完整，生僻词拆开：
- "今天" → 1 个编号（常见，保持完整）
- "unhappiness" → ["un", "happiness"]（不常见，拆开）
- "transformer" → ["trans", "former"]

为什么这样更好？词汇表控制在几万级别，新词由已知小块拼出来，模型不需要背所有词。

**第 5 步：具体怎么切？查表**
有一个预先生成好的"词汇表"（vocabulary），里面几万个条目，每个条目是一个字符串片段 + 数字编号。
分词器从左到右扫描输入文字，优先匹配最长的条目。
"今天天气很好" → 查表 → ["今天", "天气", "很", "好"] → [101, 234, 56, 78]

**第 6 步：这个词汇表哪来的？**
模型训练前，先用算法（BPE 或 WordPiece）在海量文本上统计：哪些字符组合最频繁？
- "今天"出现 100 万次 → 加入词汇表
- "天"和"气"经常连一起 → "天气"也加入
- 以此类推，直到装满几万个条目

词汇表一旦确定，就和模型一起发布，不会再变。不同模型切的粒度不同，所以 GPT-4 的 token 和 Claude 的 token 不能混用。

**PM 视角**：
- 客户问"这段文字多少字"，研发说"500 token"——你知道这是两个完全不同的数字
- 选型时比较模型价格，按 token 计费 vs 按字计费，要理解 token 的切分粒度直接影响成本

---

**检验一下**：用你自己的话说说，token 是怎么切的？卡住的地方就是你真正没懂的。
