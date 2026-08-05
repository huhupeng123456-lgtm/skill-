---
name: auto-memory
description: 自动分析对话历史并提取用户习惯、错误和经验，写入记忆系统。Use when the user asks to remember lessons, update memory, extract memory from a conversation, run auto-memory, or review conversation history for reusable preferences and mistakes.
---

# Auto-memory 自动记忆提取

自动分析对话历史，从 CC 主会话中提取**习惯**、**错误**、**经验**三类信息，写入记忆系统，无需用户明确说"记住这个"。

## 调用方式

- `/auto-memory` — 分析当前会话的全部历史，提取记忆
- `/auto-memory last 20` — 只分析最近 20 条消息
- `/auto-memory review` — 只展示提取结果，不写入文件（预览模式）

## 工作流程

### Step 1: 读取对话历史

读取当前会话的 transcript 文件，获取用户和 Codex 的完整对话内容。

### Step 2: 智能分析提取

逐条分析对话内容，识别以下三类信息：

#### 1. 习惯（Habits）
用户的固定行为模式、偏好、工作方式、沟通风格。

识别信号：
- "我习惯..." / "我通常..." / "我一般..."
- "我喜欢..." / "我偏好..."
- "我从不..." / "我总是..."
- 重复出现的行为模式
- 工作流中的固定步骤

存储格式：
```markdown
---
name: {{简短描述}}
description: {{一句话概括这个习惯}}
type: user
---

{{具体描述}}

**来源**：{{会话日期 + 上下文}}
```

#### 2. 错误（Mistakes）
用户承认的错误、踩过的坑、纠正过的认知、失败案例。

识别信号：
- "我错了..." / "我之前...是不对的"
- "踩坑..." / "翻车了..."
- "以后要注意..." / "不能再..."
- "原来...才是对的"
- 失败后的反思和教训

存储格式：
```markdown
---
name: {{错误描述}}
description: {{一句话总结教训}}
type: feedback
---

{{具体描述}}

**Why:** {{为什么会犯这个错误}}
**How to apply:** {{以后如何避免}}

**来源**：{{会话日期 + 上下文}}
```

#### 3. 经验（Experiences）
用户总结的有效方法、成功路径、洞察、验证过的做法。

识别信号：
- "我发现..." / "我总结..."
- "有效的方法是..." / "这样做是对的"
- "实践证明..." / "验证过..."
- 经过试错后沉淀的方法论
- 用户明确说"记住这个"或"这是重点"

存储格式：
```markdown
---
name: {{经验描述}}
description: {{一句话概括}}
type: feedback
---

{{具体描述}}

**Why:** {{为什么这个方法有效}}
**How to apply:** {{在什么场景下使用}}

**来源**：{{会话日期 + 上下文}}
```

### Step 3: 去重检查

提取前，先读取现有记忆文件：
- `c:\Users\macsg\.Codex\memory\habits.md`
- `c:\Users\macsg\.Codex\memory\mistakes.md`
- `c:\Users\macsg\.Codex\memory\experiences.md`

对比新提取的内容与已有记忆：
- 如果语义重复（表达不同但本质相同），跳过
- 如果是对已有记忆的补充/更新，合并到原有条目
- 如果是全新内容，新增条目

### Step 4: 写入记忆文件

将去重后的新记忆追加到对应文件末尾。每个记忆条目之间用 `---` 分隔。

文件位置：
- 习惯 → `c:\Users\macsg\.Codex\memory\habits.md`
- 错误 → `c:\Users\macsg\.Codex\memory\mistakes.md`
- 经验 → `c:\Users\macsg\.Codex\memory\experiences.md`

### Step 5: 更新索引

更新 `c:\Users\macsg\.Codex\memory\MEMORY.md`，确保三个分类文件都被索引。

### Step 6: 输出摘要

向用户汇报本次提取结果：

```
自动记忆提取完成：
- 习惯：N 条新增
- 错误：N 条新增
- 经验：N 条新增

[列出具体提取的条目标题]
```

## 注意事项

1. **只提取用户明确表达或强烈暗示的内容**，不要过度解读
2. **每条记忆必须有来源可追溯**，标注会话上下文
3. **去重优先于新增**，避免记忆膨胀
4. **敏感信息（隐私、公司机密）不记录**
5. **用户说"忘掉这个"时**，立即从对应文件中删除

## 自检清单（执行前）

- [ ] 是否读取了现有记忆文件进行去重？
- [ ] 每条记忆是否标注了来源？
- [ ] 是否过滤了敏感/机密信息？
- [ ] 输出是否给了提取摘要？
