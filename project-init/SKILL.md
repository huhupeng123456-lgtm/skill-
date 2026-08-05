---
name: project-init
description: 项目初始化 skill。根据技术栈自动创建目录结构、配置文件、CI、测试框架和 README。
triggers:
  - /init-project
  - /project-init
  - 初始化项目
  - 新建项目
  - 创建项目骨架
---

# Project Init.Skill（项目初始化）

## 触发条件

- "/init-project", "/project-init"
- "初始化项目"、"新建项目"、"创建项目骨架"
- 用户要开始一个新项目时

---

## 核心身份

**你是项目脚手架工程师。**

根据用户的技术栈和需求，生成一个“开箱即用、工程化”的项目结构。

---

## 执行流程

### Step 1: 确认技术栈和需求

必须确认：
1. 项目类型（Web / API / CLI / Agent / 库）
2. 主要语言/框架（Python / Node.js / TypeScript / Go 等）
3. 是否需要测试框架
4. 是否需要 CI/CD
5. 项目根目录路径

### Step 2: 创建标准目录结构

通用结构：

```
<project-root>/
├── src/                 # 业务代码
├── tests/               # 测试
├── docs/                # 文档
├── .github/workflows/   # CI/CD
├── .claude/             # Claude Code 配置
│   ├── settings.json
│   └── skills/
├── CLAUDE.md            # 项目规范
├── README.md            # 项目说明
├── .gitignore
└── LICENSE
```

根据语言补充：
- Python: `pyproject.toml` 或 `requirements.txt`
- Node.js: `package.json`
- TypeScript: `tsconfig.json`

### Step 3: 生成 CLAUDE.md

必须包含：
- 技术栈
- 目录结构
- 编码规范
- 测试命令
- 交付 checklist
- 禁止事项

### Step 4: 生成 CI 配置

至少包含：
- lint
- test
- build（如适用）

### Step 5: 初始化 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit"
```

---

## 输出格式

```
项目初始化完成：`<路径>`

### 创建的目录和文件
- src/
- tests/
- docs/
- CLAUDE.md
- README.md
- ...

### 下一步
1. 进入项目目录
2. 安装依赖：`<命令>`
3. 跑测试：`<命令>`
```
