# Skill 自动同步机制

本仓库由本机全局 Codex Skill 自动生成，以本地 `C:\Users\user\.codex\skills` 为唯一同步源。

## 自动同步

- GitHub 仓库：<https://github.com/huhupeng123456-lgtm/skill->
- 分支：`main`
- Windows 计划任务：`Codex Skill Nightly GitHub Sync`
- 执行时间：每天 22:30（Asia/Shanghai）
- 补跑策略：电脑错过执行时间后，在满足登录和网络条件时尽快补跑

## 覆盖规则

- 本地存在的新 Skill 会新增到仓库。
- 本地 Skill 的新版本会覆盖仓库中的旧版本。
- 本地已删除的 Skill 会从仓库当前版本中删除，历史版本仍可通过 Git 提交记录恢复。
- 远端出现并发提交或冲突时不会强制推送；任务会失败并保留日志，等待人工处理。

## 安全边界

同步只处理顶层包含 `SKILL.md` 的目录，并排除：

- `.git`、`node_modules`、虚拟环境、缓存、构建目录和运行输出；
- `.env`、私钥、证书、日志和 Python 缓存文件；
- `gstack-global-discover.exe` 本地编译运行文件；
- 命中 GitHub Token、AWS Access Key、OpenAI Key 或私钥特征的非测试文件。

运行日志和隔离 Git 工作副本位于 `%LOCALAPPDATA%\CodexSkillGitHubSync`，不写入本仓库。

## 手动验证

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "G:\codex skill\automation\github-skill-sync\sync-skills-to-github.ps1" -DryRun
```

去掉 `-DryRun` 会执行真实提交和推送。
