# Skill 同步机制

这个仓库是用户的 Claude Code skill 集合。任何 agent 在帮用户管理 skill 时，都必须遵循这个同步机制。

## 仓库信息

- **仓库地址**：https://github.com/huhupeng123456-lgtm/skill-
- **本地路径**：`c:\Users\user\.claude\.agents\skills`（Windows）或 `~/.claude/.agents/skills`（Mac/Linux）
- **分支**：main
- **自动 push**：已配置 post-commit hook，commit 后自动 `git push origin main`

## 新电脑首次配置

如果当前机器还没有 skill，执行：

```bash
# Windows
git clone https://github.com/huhupeng123456-lgtm/skill-.git "c:\Users\user\.claude\.agents\skills"

# Mac / Linux
git clone https://github.com/huhupeng123456-lgtm/skill-.git ~/.claude/.agents/skills
```

## 用户说"同步 skill"时

执行：

```bash
cd c:/Users/user/.claude/.agents/skills
git pull origin main
```

## 创建新 skill 时

1. 在 `c:/Users/user/.claude/.agents/skills/` 下创建新目录，比如 `new-skill/`
2. 写入 `SKILL.md` 和 `test-prompts.json`
3. 执行：

```bash
cd c:/Users/user/.claude/.agents/skills
git add .
git commit -m "add new-skill"
```

post-commit hook 会自动 push 到 GitHub。

## 修改 skill 时

1. 编辑 `SKILL.md`
2. 执行：

```bash
cd c:/Users/user/.claude/.agents/skills
git add .
git commit -m "optimize 某skill: 改动摘要"
```

post-commit hook 会自动 push。

## 删除 skill 时

1. 删除对应目录
2. 执行：

```bash
cd c:/Users/user/.claude/.agents/skills
git add .
git commit -m "remove 某skill"
```

## 重要规则

- 所有 skill 必须放在 `.agents/skills/`（全局），不要放在 workspace 的 `.claude/skills/`
- 每次改动必须 commit，否则不会同步
- 不要手动执行 `git push`，post-commit hook 会自动处理
- 如果 pull 有冲突，先问用户再处理
