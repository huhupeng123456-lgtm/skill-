# Claude Skill: Explain

让 Claude 用「从已知推导到未知」的方式，向非技术背景的 AI 产品经理解释技术概念。

## 适用场景

- 用户问"解释XX"、"什么是XX"、"讲讲XX"、"XX是什么意思"
- 用户 asked 某个技术术语、机制、架构
- 用户对前一次解释继续追问

## 安装

```bash
npx skills add <your-github-username>/claude-skill-explain
```

## 核心设计

1. **识别依赖链**：先列出从常识到目标概念的推导路径
2. **推导链条**：每一步说明「是什么」「为什么必须这样」「术语解释」
3. **PM 视角**：说明在什么场景会听到这个词，听到后该问什么
4. **检验**：让用户用自己的话复述，确认真正理解

## 示例

见 [SKILL.md](SKILL.md) 中的 "Token 是怎么切的" 完整示例。

## License

MIT
