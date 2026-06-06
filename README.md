# Skill Hub

一个按功能分类组织的静态 Skill 导航站，用来浏览、筛选和统计 AI Agent Skills。

当前站点的唯一数据来源是仓库内已提交的 `categories/` 目录。前端运行时不再读取 `agents/` 目录，也不再依赖 `config/repos.json` 之类的上游配置文件。

## 功能

- 按功能分类浏览，分类来自 `categories/` 下的真实目录
- 分类作为主筛选，Agent 平台以兼容标签展示，并支持点击叠加筛选
- 搜索、排序、分页、分组视图切换
- 默认中文界面，已知分类优先显示中文名称
- 保留中英文切换能力
- 独立统计页
- 纯静态前端：HTML + CSS + JavaScript

## 在线访问

- 主站: [https://skill.442595.xyz/](https://skill.442595.xyz/)

## 本地运行

这是一个纯静态站点，直接起一个本地 HTTP 服务即可：

```bash
git clone https://github.com/rdone4425/skill.git
cd skill
python -m http.server 8000
```

然后访问 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)。

## 部署

项目使用 Cloudflare Pages 部署，配置见 [wrangler.jsonc](./wrangler.jsonc)。

手动部署示例：

```bash
npx wrangler pages deploy . --project-name=skill-hub
```

## 当前数据结构

```text
skill/
├─ index.html
├─ stats.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ app.js
│  ├─ data.js
│  ├─ events.js
│  ├─ i18n.js
│  ├─ render.js
│  ├─ state.js
│  └─ stats-page.js
├─ categories/
│  ├─ index.json
│  ├─ health-report.json
│  └─ <categoryId>/
│     └─ skills.json
├─ .github/
│  ├─ scripts/
│  │  └─ refresh_skill_hub_data.mjs
│  └─ workflows/
│     ├─ deploy-skill-hub-on-data-change.yml
│     └─ update-skill-hub-content.yml
├─ assets/
├─ LICENSE
├─ README.md
├─ wrangler.jsonc
└─ _headers
```

## 运行时数据链路

页面运行时的数据链路如下：

```text
categories/index.json
        +
categories/<categoryId>/skills.json
        -> js/data.js / js/state.js / js/render.js / js/stats-page.js
        -> index.html / stats.html
```

也就是说：

- 首页和统计页依赖的是 `categories/` 目录里的生成产物
- 修改 `categories/` 数据会直接影响页面展示
- 当前仓库不再通过 `agents/` 目录驱动前端

## 分类与平台筛选规则

- 功能分类是站点唯一的主信息架构，来源于 `categories/` 下的真实目录
- Agent 不再作为目录层级，也不再作为首页主分类
- 每张卡片上的平台标签来自 `supportedAgents`
- 点击平台标签时，会在当前分类基础上叠加平台筛选，不会清掉当前分类
- URL 状态使用 `category`、`agent`、`q`、`sort`、`view`、`page` 这些查询参数

### 分类名称如何显示

- 目录名仍然使用英文 slug，例如 `dev-tools`、`design-ui`
- 前端会优先把已知 slug 显示成中文名称，例如：
  - `automation-productivity` -> `自动化效率`
  - `backend-api` -> `后端 API`
  - `data-ai` -> `数据 AI`
  - `design-ui` -> `设计 UI`
  - `dev-tools` -> `开发工具`
  - `devops-deploy` -> `部署运维`
  - `docs-content` -> `文档内容`
  - `general` -> `通用`
  - `security` -> `安全`
  - `testing-qa` -> `测试质检`
- 如果新增了一个前端还没内置中文映射的分类，页面会先直接显示目录名；数据和筛选仍然正常

## 数据维护

仓库保留了一条“维护已存在数据”的 GitHub Actions 流程：

- 工作流: [.github/workflows/update-skill-hub-content.yml](./.github/workflows/update-skill-hub-content.yml)
- 脚本: [.github/scripts/refresh_skill_hub_data.mjs](./.github/scripts/refresh_skill_hub_data.mjs)

这条流程当前主要负责：

- 扫描 `categories/` 下的分类目录
- 为新增空目录自动创建默认 `skills.json`
- 刷新已收录仓库的 GitHub stars
- 生成 `categories/index.json`
- 生成 `categories/health-report.json`

注意：它不是“自动发现新仓库”的管线，而是“维护现有分类和数据”的管线。

## 如何新增或修改 skill

### 1. 新增一个分类

直接创建目录：

```text
categories/<new-category>/
```

运行生成脚本后，会自动补齐：

```text
categories/<new-category>/skills.json
```

### 2. 新增一个 skill

把 skill 写入对应分类文件：

```text
categories/<categoryId>/skills.json
```

每条 skill 至少应包含这些字段：

```json
{
  "name": "example-skill",
  "repo": "owner/repo",
  "stars": 1234,
  "desc": "Short description",
  "url": "https://github.com/owner/repo",
  "install": "git clone https://github.com/owner/repo.git",
  "functionCategory": "dev-tools",
  "supportedAgents": ["codex", "claude"],
  "sourceAgent": "codex"
}
```

说明：

- `functionCategory` 必须和所在目录名一致
- `supportedAgents` 是前端展示和筛选的平台唯一来源
- 如果同一个 skill 支持多个平台，就把多个平台都写进 `supportedAgents`
- `supportedAgents` 不能为空数组
- `sourceAgent` 只作为迁移期或来源记录字段保留，不参与首页主分类

### 3. 刷新索引和健康报告

本地执行：

```bash
node .github/scripts/refresh_skill_hub_data.mjs --root . --verbose
```

如果只想检查不落盘：

```bash
node .github/scripts/refresh_skill_hub_data.mjs --root . --dry-run
```

如果还想附带检查 URL：

```bash
node .github/scripts/refresh_skill_hub_data.mjs --root . --check-urls
```

## 维护建议

- 改动 `categories/**/skills.json` 后，顺手检查 `categories/index.json` 是否仍然匹配
- 如果首页总数、分类总数、分页不对，先检查 `categories/index.json`
- 如果统计页空白或缺数据，先检查 `js/stats-page.js` 和 `categories/health-report.json`
- 如果新增了分类目录但页面没出现，先跑一次生成脚本

## 常见问题

### 1. 新建了分类目录，但页面没有出现

先执行一次生成脚本：

```bash
node .github/scripts/refresh_skill_hub_data.mjs --root . --verbose
```

它会自动为新目录补齐默认 `skills.json`，并刷新 `categories/index.json`。

### 2. 页面里分类显示成英文 slug

先确认两件事：

- 新分类是否只是还没有前端中文映射；如果是，功能本身正常，只是展示名暂时直接使用目录名
- 当前浏览器是否还在使用旧版前端资源；可以强制刷新，或确认 `index.html` 里引用的脚本版本号已经更新

### 3. 页面里分类显示成乱码或 `????`

优先检查 [js/state.js](./js/state.js) 里的分类名称映射是否被错误编码保存；这个文件需要使用 UTF-8 保存。

### 4. 选择分类后结果区空白，或者只剩分页外壳

优先检查：

- 当前 `category` 和 `agent` 组合下是否确实有数据
- `categories/<categoryId>/skills.json` 里的 `supportedAgents` 是否填写正确
- `categories/index.json` 是否已经刷新

如果某个组合本来就没有匹配结果，页面应显示空结果提示，而不是挂住不渲染。

## License

MIT
