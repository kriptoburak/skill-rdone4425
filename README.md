# 🎯 Codex Skills Hub

> Curated index of OpenAI Codex skills — official + community

一个静态网页，收录 **56 个 Codex skills** 来自 **17 个仓库**：
- 🎯 官方精选 39 个（来自 `openai/skills`）
- 🌟 社区清单 4 个（awesome-codex-* 系列）
- 🛠 Codex CLI 配套工具 3 个
- 🤖 通用 Agent Skills 10 个（兼容 Codex / Claude Code / OpenCode）

**特点**：
- 暗色主题，零依赖（纯 HTML + CSS + JS）
- 响应式（手机 / 平板 / 桌面）
- 客户端搜索 + 分类过滤
- 一键复制 install 命令
- 数据驱动（修改 `js/data.js` 即可）

## 🖥 在线访问

部署在 Cloudflare Pages：[https://skill.pages.dev](https://skill.pages.dev)

## 🚀 本地运行

```bash
git clone https://github.com/rdone4425/skill.git
cd skill
python3 -m http.server 8000
# 访问 http://localhost:8000
```

或者用任何静态服务器（Nginx、Surge、Netlify 都可以）。

## ☁️ 部署到 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 选择 `rdone4425/skill` 仓库
4. 配置：
   - **Build command**：留空
   - **Build output directory**：`/`（项目根目录）
5. 点击 **Save and Deploy**
6. 等 1-2 分钟，CF 会自动分配 `skill.pages.dev` 域名

> 💡 也可以用 `wrangler` CLI：`wrangler pages deploy .`

## 📁 项目结构

```
skill/
├── index.html           # 主页面
├── css/
│   └── style.css        # 暗色主题样式
├── js/
│   ├── data.js          # 所有 skills 数据（修改这里）
│   └── app.js           # 渲染逻辑
├── LICENSE              # MIT
└── README.md            # 本文件
```

## ✏️ 添加新 Skill

### 方式 A：手动改 `js/data.js`（快速）

编辑 `js/data.js`，按以下格式添加：

```javascript
{
  name: "my-skill",                    // skill 名字
  source: "official",                  // official | community | tools | general
  group: "figma",                      // official 下分组（figma/github/notion/...）
  repo: "openai/skills",               // GitHub 仓库
  stars: 21251,                        // GitHub stars
  desc: "一句话描述",                  // 中文/英文都可
  url: "https://github.com/openai/skills/tree/main/skills/.curated/my-skill",
  install: "$skill-installer my-skill" // 安装命令
}
```

然后 `git commit -am "add my-skill" && git push`，CF Pages 自动部署。

### 方式 B：自动每周更新（推荐）✅

`scripts/fetch-skills.py` 会自动从 GitHub API 抓取：
- 官方 39 个 curated skills 的 SKILL.md frontmatter（name、description、stars）
- 17 个社区/工具/通用仓库的最新 stars 和描述

GitHub Actions 每周一 UTC 00:00 自动跑一次：

- 工作流：`.github/workflows/update-skills.yml`
- 抓取脚本：`scripts/fetch-skills.py`
- 抓取后**直接 commit + push 到 main**（不走 PR 流程）
- CF Pages / Vercel 监听到 push 后自动重新部署
- 无变化时自动跳过（不会产生空 commit）

**手动触发**：
1. 打开 https://github.com/rdone4425/skill/actions
2. 选 **Update Codex Skills**
3. 点 **Run workflow**
4. 可选勾 "Dry run" 只抓数据不提交

**调整更新频率**：编辑 `.github/workflows/update-skills.yml` 的 `cron` 字段
- `0 0 * * 1` — 每周一
- `0 0 * * *` — 每天
- `0 */6 * * *` — 每 6 小时

**添加新仓库到自动抓取**：编辑 `scripts/fetch-skills.py` 的 `KNOWN_REPOS` 字典。

**回滚一次更新**：
```bash
git revert HEAD    # 创建反向 commit
git push
```

## 📊 数据来源

| 来源 | 数量 | 链接 |
|---|---:|---|
| `openai/skills` (.curated) | 39 | https://github.com/openai/skills |
| `ComposioHQ/awesome-codex-skills` | 1 | https://github.com/ComposioHQ/awesome-codex-skills |
| `VoltAgent/awesome-codex-subagents` | 1 | https://github.com/VoltAgent/awesome-codex-subagents |
| `hashgraph-online/awesome-codex-plugins` | 1 | https://github.com/hashgraph-online/awesome-codex-plugins |
| `RoggeOhta/awesome-codex-cli` | 1 | https://github.com/RoggeOhta/awesome-codex-cli |
| `router-for-me/CLIProxyAPI` | 1 | https://github.com/router-for-me/CLIProxyAPI |
| `decolua/9router` | 1 | https://github.com/decolua/9router |
| `openai/codex` | 1 | https://github.com/openai/codex |
| 其他通用 skills | 10 | — |

最后更新：**2026-06-04**

## 📜 License

MIT
