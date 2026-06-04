/**
 * Codex Skills Hub — data
 * 自动生成，请勿手动编辑。运行 `python scripts/fetch-skills.py` 重新生成。
 */

window.SKILL_DATA = {
  "meta": {
    "title": "Skill Hub",
    "description": "AI Agent Skills 导航站 — Codex · Claude · Hermes · OpenCode · OpenClaw",
    "lastUpdated": "2026-06-04",
    "totalCount": 77,
    "sources": 23
  },
  "categories": [
    {
      "id": "official",
      "label": "Official Curated",
      "icon": "🎯",
      "description": "OpenAI 官方精选的 skills，$skill-installer 可直接安装",
      "color": "#6366f1",
      "groups": [
        {
          "id": "figma",
          "label": "Figma"
        },
        {
          "id": "github",
          "label": "GitHub"
        },
        {
          "id": "notion",
          "label": "Notion"
        },
        {
          "id": "playwright",
          "label": "Playwright"
        },
        {
          "id": "deploy",
          "label": "Deployment"
        },
        {
          "id": "security",
          "label": "Security"
        },
        {
          "id": "other",
          "label": "Other"
        }
      ]
    },
    {
      "id": "claude",
      "label": "Claude Skills",
      "icon": "🎭",
      "description": "Anthropic Claude 官方 skills — PDF、Word、Excel、PowerPoint、设计等",
      "color": "#d97757",
      "groups": null
    },
    {
      "id": "community",
      "label": "Community Lists",
      "icon": "🌟",
      "description": "社区维护的 awesome 清单，收录各种 Codex/Agent skills",
      "color": "#10b981",
      "groups": null
    },
    {
      "id": "tools",
      "label": "Codex CLI Tools",
      "icon": "🛠",
      "description": "配合 Codex 使用的 CLI 工具 — proxy、router、wrapper",
      "color": "#f59e0b",
      "groups": null
    },
    {
      "id": "general",
      "label": "General Agent Skills",
      "icon": "🤖",
      "description": "通用 AI agent skills — 多端兼容（Codex/Claude Code/OpenCode）",
      "color": "#ec4899",
      "groups": null
    },
    {
      "id": "hermes",
      "label": "Hermes Agent",
      "icon": "🦉",
      "description": "NousResearch Hermes Agent — 自我成长的 AI 代理",
      "color": "#8b5cf6",
      "groups": null
    },
    {
      "id": "openclaw",
      "label": "OpenClaw",
      "icon": "🦞",
      "description": "OpenClaw — 跨平台 AI 助理（任何 OS、任何平台）",
      "color": "#ef4444",
      "groups": null
    },
    {
      "id": "opencode",
      "label": "OpenCode",
      "icon": "⌨️",
      "description": "OpenCode — 终端 AI 编程代理",
      "color": "#06b6d4",
      "groups": null
    }
  ],
  "skills": [
    {
      "name": "aspnet-core",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Build, review, refactor, or architect ASP.NET Core web applications using current official guidance for .NET web development. Use when working on Blazor Web Apps, Razor Pages, MVC, Minimal APIs, controller-based Web APIs, SignalR, gRPC, mid",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/aspnet-core",
      "install": "$skill-installer aspnet-core"
    },
    {
      "name": "chatgpt-apps",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Build, scaffold, refactor, and troubleshoot ChatGPT Apps SDK applications that combine an MCP server and widget UI. Use when Codex needs to design tools, register UI resources, wire the MCP Apps bridge or ChatGPT compatibility APIs, apply A",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/chatgpt-apps",
      "install": "$skill-installer chatgpt-apps"
    },
    {
      "name": "cli-creator",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Build a composable CLI for Codex from API docs, an OpenAPI spec, existing curl examples, an SDK, a web app, an admin tool, or a local script. Use when the user wants Codex to create a command-line tool that can run from any repo, expose com",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/cli-creator",
      "install": "$skill-installer cli-creator"
    },
    {
      "name": "cloudflare-deploy",
      "source": "official",
      "group": "deploy",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Deploy applications and infrastructure to Cloudflare using Workers, Pages, and related platform services. Use when the user asks to deploy, host, publish, or set up a project on Cloudflare.",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/cloudflare-deploy",
      "install": "$skill-installer cloudflare-deploy"
    },
    {
      "name": "define-goal",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Help the user define a concrete, measurable goal before starting work, especially when they ask to use the goal tool, create a goal, set an objective, clarify success criteria, or turn a fuzzy intention into a quantitative outcome. Use this",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/define-goal",
      "install": "$skill-installer define-goal"
    },
    {
      "name": "figma-code-connect-components",
      "source": "official",
      "group": "figma",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Connects Figma design components to code components using Code Connect mapping tools. Use when user says \"code connect\", \"connect this component to code\", \"map this component\", \"link component to code\", \"create code connect mapping\", or wan",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/figma-code-connect-components",
      "install": "$skill-installer figma-code-connect-components"
    },
    {
      "name": "figma-create-design-system-rules",
      "source": "official",
      "group": "figma",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Generates custom design system rules for the user's codebase. Use when user says \"create design system rules\", \"generate rules for my project\", \"set up design rules\", \"customize design system guidelines\", or wants to establish project-speci",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/figma-create-design-system-rules",
      "install": "$skill-installer figma-create-design-system-rules"
    },
    {
      "name": "figma-create-new-file",
      "source": "official",
      "group": "figma",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Create a new blank Figma file. Use when the user wants to create a new Figma design or FigJam file, or when you need a new file before calling use_figma. Handles plan resolution via whoami if needed. Usage — /figma-create-new-file [editorTy",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/figma-create-new-file",
      "install": "$skill-installer figma-create-new-file"
    },
    {
      "name": "figma-generate-design",
      "source": "official",
      "group": "figma",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Use this skill alongside figma-use when the task involves translating an application page, view, or multi-section layout into Figma. Triggers: 'write to Figma', 'create in Figma from code', 'push page to Figma', 'take this app/page and bui",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/figma-generate-design",
      "install": "$skill-installer figma-generate-design"
    },
    {
      "name": "figma-generate-library",
      "source": "official",
      "group": "figma",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Build or update a professional-grade design system in Figma from a codebase. Use when the user wants to create variables/tokens, build component libraries, set up theming (light/dark modes), document foundations, or reconcile gaps between ",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/figma-generate-library",
      "install": "$skill-installer figma-generate-library"
    },
    {
      "name": "figma-implement-design",
      "source": "official",
      "group": "figma",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Translates Figma designs into production-ready application code with 1:1 visual fidelity. Use when implementing UI code from Figma files, when user mentions \"implement design\", \"generate code\", \"implement component\", provides Figma URLs, or",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/figma-implement-design",
      "install": "$skill-installer figma-implement-design"
    },
    {
      "name": "figma-use",
      "source": "official",
      "group": "figma",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"**MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. NEVER call `use_figma` directly without loading this skill first. Skipping it causes common, hard-to-debug failures. Trigger whenever the user want",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/figma-use",
      "install": "$skill-installer figma-use"
    },
    {
      "name": "figma",
      "source": "official",
      "group": "figma",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Use the Figma MCP server to fetch design context, screenshots, variables, and assets from Figma, and to translate Figma nodes into production code. Trigger when a task involves Figma URLs, node IDs, design-to-code implementation, or Figma M",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/figma",
      "install": "$skill-installer figma"
    },
    {
      "name": "gh-address-comments",
      "source": "official",
      "group": "github",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Help address review/issue comments on the open GitHub PR for the current branch using gh CLI; verify gh auth first and prompt the user to authenticate if not logged in.",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/gh-address-comments",
      "install": "$skill-installer gh-address-comments"
    },
    {
      "name": "gh-fix-ci",
      "source": "official",
      "group": "github",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Use when a user asks to debug or fix failing GitHub PR checks that run in GitHub Actions; use `gh` to inspect checks and logs, summarize failure context, draft a fix plan, and implement only after explicit approval. Treat external provider",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/gh-fix-ci",
      "install": "$skill-installer gh-fix-ci"
    },
    {
      "name": "hatch-pet",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Create, repair, validate, visually QA, and package Codex-compatible animated pets and pet spritesheets from character art, generated images, company or prospect brand cues, or visual references. Use when a user wants a lightweight-worker Co",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/hatch-pet",
      "install": "$skill-installer hatch-pet"
    },
    {
      "name": "jupyter-notebook",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Use when the user asks to create, scaffold, or edit Jupyter notebooks (`.ipynb`) for experiments, explorations, or tutorials; prefer the bundled templates and run the helper script `new_notebook.py` to generate a clean starting notebook.\"",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/jupyter-notebook",
      "install": "$skill-installer jupyter-notebook"
    },
    {
      "name": "linear",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Manage issues, projects & team workflows in Linear. Use when the user wants to read, create or updates tickets in Linear.",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/linear",
      "install": "$skill-installer linear"
    },
    {
      "name": "migrate-to-codex",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Migrate supported instruction files, skills, agents, and MCP config into Codex project and global files.",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/migrate-to-codex",
      "install": "$skill-installer migrate-to-codex"
    },
    {
      "name": "netlify-deploy",
      "source": "official",
      "group": "deploy",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Deploy web projects to Netlify using the Netlify CLI (`npx netlify`). Use when the user asks to deploy, host, publish, or link a site/repo on Netlify, including preview and production deploys.",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/netlify-deploy",
      "install": "$skill-installer netlify-deploy"
    },
    {
      "name": "notion-knowledge-capture",
      "source": "official",
      "group": "notion",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Capture conversations and decisions into structured Notion pages; use when turning chats/notes into wiki entries, how-tos, decisions, or FAQs with proper linking.",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/notion-knowledge-capture",
      "install": "$skill-installer notion-knowledge-capture"
    },
    {
      "name": "notion-meeting-intelligence",
      "source": "official",
      "group": "notion",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Prepare meeting materials with Notion context and Codex research; use when gathering context, drafting agendas/pre-reads, and tailoring materials to attendees.",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/notion-meeting-intelligence",
      "install": "$skill-installer notion-meeting-intelligence"
    },
    {
      "name": "notion-research-documentation",
      "source": "official",
      "group": "notion",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Research across Notion and synthesize into structured documentation; use when gathering info from multiple Notion sources to produce briefs, comparisons, or reports with citations.",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/notion-research-documentation",
      "install": "$skill-installer notion-research-documentation"
    },
    {
      "name": "notion-spec-to-implementation",
      "source": "official",
      "group": "notion",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Turn Notion specs into implementation plans, tasks, and progress tracking; use when implementing PRDs/feature specs and creating Notion plans + tasks from them.",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/notion-spec-to-implementation",
      "install": "$skill-installer notion-spec-to-implementation"
    },
    {
      "name": "openai-docs",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Use when the user asks how to build with OpenAI products or APIs, asks about Codex itself or choosing Codex surfaces, needs up-to-date official documentation with citations, help choosing the latest model for a use case, or model upgrade a",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/openai-docs",
      "install": "$skill-installer openai-docs"
    },
    {
      "name": "pdf",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Use when tasks involve reading, creating, or reviewing PDF files where rendering and layout matter; prefer visual checks by rendering pages (Poppler) and use Python tools such as `reportlab`, `pdfplumber`, and `pypdf` for generation and ex",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/pdf",
      "install": "$skill-installer pdf"
    },
    {
      "name": "playwright-interactive",
      "source": "official",
      "group": "playwright",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Persistent browser and Electron interaction through `js_repl` for fast iterative UI debugging.\"",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/playwright-interactive",
      "install": "$skill-installer playwright-interactive"
    },
    {
      "name": "playwright",
      "source": "official",
      "group": "playwright",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Use when the task requires automating a real browser from the terminal (navigation, form filling, snapshots, screenshots, data extraction, UI-flow debugging) via `playwright-cli` or the bundled wrapper script.\"",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/playwright",
      "install": "$skill-installer playwright"
    },
    {
      "name": "render-deploy",
      "source": "official",
      "group": "deploy",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Deploy applications to Render by analyzing codebases, generating render.yaml Blueprints, and providing Dashboard deeplinks. Use when the user wants to deploy, host, publish, or set up their application on Render's cloud platform.",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/render-deploy",
      "install": "$skill-installer render-deploy"
    },
    {
      "name": "screenshot",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Use when the user explicitly asks for a desktop or system screenshot (full screen, specific app or window, or a pixel region), or when tool-specific capture capabilities are unavailable and an OS-level capture is needed.\"",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/screenshot",
      "install": "$skill-installer screenshot"
    },
    {
      "name": "security-best-practices",
      "source": "official",
      "group": "security",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Perform language and framework specific security best-practice reviews and suggest improvements. Trigger only when the user explicitly requests security best practices guidance, a security review/report, or secure-by-default coding help. T",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/security-best-practices",
      "install": "$skill-installer security-best-practices"
    },
    {
      "name": "security-ownership-map",
      "source": "official",
      "group": "security",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Analyze git repositories to build a security ownership topology (people-to-file), compute bus factor and sensitive-code ownership, and export CSV/JSON for graph databases and visualization. Trigger only when the user explicitly wants a sec",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/security-ownership-map",
      "install": "$skill-installer security-ownership-map"
    },
    {
      "name": "security-threat-model",
      "source": "official",
      "group": "security",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Repository-grounded threat modeling that enumerates trust boundaries, assets, attacker capabilities, abuse paths, and mitigations, and writes a concise Markdown threat model. Trigger only when the user explicitly asks to threat model a cod",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/security-threat-model",
      "install": "$skill-installer security-threat-model"
    },
    {
      "name": "sentry",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Use when the user asks to inspect Sentry issues or events, summarize recent production errors, or pull basic Sentry health data via the Sentry CLI; perform read-only queries using the `sentry` command.\"",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/sentry",
      "install": "$skill-installer sentry"
    },
    {
      "name": "speech",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Use when the user asks for text-to-speech narration or voiceover, accessibility reads, audio prompts, or batch speech generation via the OpenAI Audio API; run the bundled CLI (`scripts/text_to_speech.py`) with built-in voices and require `",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/speech",
      "install": "$skill-installer speech"
    },
    {
      "name": "transcribe",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Transcribe audio files to text with optional diarization and known-speaker hints. Use when a user asks to transcribe speech from audio/video, extract text from recordings, or label speakers in interviews or meetings.\"",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/transcribe",
      "install": "$skill-installer transcribe"
    },
    {
      "name": "vercel-deploy",
      "source": "official",
      "group": "deploy",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Deploy applications and websites to Vercel. Use when the user requests deployment actions like \"deploy my app\", \"deploy and give me the link\", \"push this live\", or \"create a preview deployment\".",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/vercel-deploy",
      "install": "$skill-installer vercel-deploy"
    },
    {
      "name": "winui-app",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "Bootstrap, develop, and design modern WinUI 3 desktop applications with C# and the Windows App SDK using official Microsoft guidance, WinUI Gallery patterns, Windows App SDK samples, and CommunityToolkit components. Use when creating a bran",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/winui-app",
      "install": "$skill-installer winui-app"
    },
    {
      "name": "yeet",
      "source": "official",
      "group": "other",
      "repo": "openai/skills",
      "stars": 21279,
      "desc": "\"Use only when the user explicitly asks to stage, commit, push, and open a GitHub pull request in one flow using the GitHub CLI (`gh`).\"",
      "url": "https://github.com/openai/skills/tree/main/skills/.curated/yeet",
      "install": "$skill-installer yeet"
    },
    {
      "name": "algorithmic-art",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use this when users request creating art using code, generative art, algorithmic art, flow fields, or particle systems. Create original algor",
      "url": "https://github.com/anthropics/skills/tree/main/skills/algorithmic-art",
      "install": "$skill-installer algorithmic-art"
    },
    {
      "name": "brand-guidelines",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Applies Anthropic's official brand colors and typography to any sort of artifact that may benefit from having Anthropic's look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.",
      "url": "https://github.com/anthropics/skills/tree/main/skills/brand-guidelines",
      "install": "$skill-installer brand-guidelines"
    },
    {
      "name": "canvas-design",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying exis",
      "url": "https://github.com/anthropics/skills/tree/main/skills/canvas-design",
      "install": "$skill-installer canvas-design"
    },
    {
      "name": "claude-api",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "\"Build, debug, and optimize Claude API / Anthropic SDK apps. Apps built with this skill should include prompt caching. Also handles migrating existing Claude API code between Claude model versions (4.5 → 4.6, 4.6 → 4.7, retired-model replac",
      "url": "https://github.com/anthropics/skills/tree/main/skills/claude-api",
      "install": "$skill-installer claude-api"
    },
    {
      "name": "doc-coauthoring",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, technical specs, decision docs, or similar structured content. This workflow helps users efficiently transfer c",
      "url": "https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring",
      "install": "$skill-installer doc-coauthoring"
    },
    {
      "name": "docx",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "\"Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files). Triggers include: any mention of 'Word doc', 'word document', '.docx', or requests to produce professional documents with formatting ",
      "url": "https://github.com/anthropics/skills/tree/main/skills/docx",
      "install": "$skill-installer docx"
    },
    {
      "name": "frontend-design",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, ",
      "url": "https://github.com/anthropics/skills/tree/main/skills/frontend-design",
      "install": "$skill-installer frontend-design"
    },
    {
      "name": "internal-comms",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "A set of resources to help me write all kinds of internal communications, using the formats that my company likes to use. Claude should use this skill whenever asked to write some sort of internal communications (status reports, leadership ",
      "url": "https://github.com/anthropics/skills/tree/main/skills/internal-comms",
      "install": "$skill-installer internal-comms"
    },
    {
      "name": "mcp-builder",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (F",
      "url": "https://github.com/anthropics/skills/tree/main/skills/mcp-builder",
      "install": "$skill-installer mcp-builder"
    },
    {
      "name": "pdf",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Use this skill whenever the user wants to do anything with PDF files. This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating ",
      "url": "https://github.com/anthropics/skills/tree/main/skills/pdf",
      "install": "$skill-installer pdf"
    },
    {
      "name": "pptx",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "\"Use this skill any time a .pptx file is involved in any way — as input, output, or both. This includes: creating slide decks, pitch decks, or presentations; reading, parsing, or extracting text from any .pptx file (even if the extracted co",
      "url": "https://github.com/anthropics/skills/tree/main/skills/pptx",
      "install": "$skill-installer pptx"
    },
    {
      "name": "skill-creator",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with varia",
      "url": "https://github.com/anthropics/skills/tree/main/skills/skill-creator",
      "install": "$skill-installer skill-creator"
    },
    {
      "name": "slack-gif-creator",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Knowledge and utilities for creating animated GIFs optimized for Slack. Provides constraints, validation tools, and animation concepts. Use when users request animated GIFs for Slack like \"make me a GIF of X doing Y for Slack.\"",
      "url": "https://github.com/anthropics/skills/tree/main/skills/slack-gif-creator",
      "install": "$skill-installer slack-gif-creator"
    },
    {
      "name": "theme-factory",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a",
      "url": "https://github.com/anthropics/skills/tree/main/skills/theme-factory",
      "install": "$skill-installer theme-factory"
    },
    {
      "name": "web-artifacts-builder",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components ",
      "url": "https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder",
      "install": "$skill-installer web-artifacts-builder"
    },
    {
      "name": "webapp-testing",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.",
      "url": "https://github.com/anthropics/skills/tree/main/skills/webapp-testing",
      "install": "$skill-installer webapp-testing"
    },
    {
      "name": "xlsx",
      "source": "claude",
      "group": null,
      "repo": "anthropics/skills",
      "stars": 146202,
      "desc": "\"Use this skill any time a spreadsheet file is the primary input or output. This means any task where the user wants to: open, read, edit, or fix an existing .xlsx, .xlsm, .csv, or .tsv file (e.g., adding columns, computing formulas, format",
      "url": "https://github.com/anthropics/skills/tree/main/skills/xlsx",
      "install": "$skill-installer xlsx"
    },
    {
      "name": "awesome-codex-skills",
      "source": "community",
      "group": null,
      "repo": "ComposioHQ/awesome-codex-skills",
      "stars": 12876,
      "desc": "A curated list of practical Codex skills for automating workflows across the Codex CLI and API.",
      "url": "https://github.com/ComposioHQ/awesome-codex-skills",
      "install": "git clone https://github.com/ComposioHQ/awesome-codex-skills.git  # browse the awesome list"
    },
    {
      "name": "awesome-codex-subagents",
      "source": "community",
      "group": null,
      "repo": "VoltAgent/awesome-codex-subagents",
      "stars": 5040,
      "desc": "A collection of 130+ specialized Codex subagents covering a wide range of development use cases.",
      "url": "https://github.com/VoltAgent/awesome-codex-subagents",
      "install": "git clone https://github.com/VoltAgent/awesome-codex-subagents.git  # browse the awesome list"
    },
    {
      "name": "awesome-codex-plugins",
      "source": "community",
      "group": null,
      "repo": "hashgraph-online/awesome-codex-plugins",
      "stars": 372,
      "desc": "A curated list of awesome OpenAI Codex plugins, skills, and resources. The #1 Codex Marketplace.  See live plugins at: https://hol.org/registry/plugins",
      "url": "https://github.com/hashgraph-online/awesome-codex-plugins",
      "install": "git clone https://github.com/hashgraph-online/awesome-codex-plugins.git  # browse the awesome list"
    },
    {
      "name": "awesome-codex-cli",
      "source": "community",
      "group": null,
      "repo": "RoggeOhta/awesome-codex-cli",
      "stars": 255,
      "desc": "Curated list of 150+ tools, skills, subagents & plugins for OpenAI Codex CLI",
      "url": "https://github.com/RoggeOhta/awesome-codex-cli",
      "install": "git clone https://github.com/RoggeOhta/awesome-codex-cli.git  # browse the awesome list"
    },
    {
      "name": "awesome-agent-skills",
      "source": "community",
      "group": null,
      "repo": "JackyST0/awesome-agent-skills",
      "stars": 553,
      "desc": "🤖 精选的 AI Agent Skills 列表，适用于 Cursor、Claude Code、GitHub Copilot 等 AI 编程工具",
      "url": "https://github.com/JackyST0/awesome-agent-skills",
      "install": "git clone https://github.com/JackyST0/awesome-agent-skills.git  # browse the awesome list"
    },
    {
      "name": "CLIProxyAPI",
      "source": "tools",
      "group": null,
      "repo": "router-for-me/CLIProxyAPI",
      "stars": 35974,
      "desc": "Wrap Gemini CLI, Antigravity, ChatGPT Codex, Claude Code, Grok Build as an OpenAI/Gemini/Claude/Codex compatible API service, allowing you to enjoy the free Gemini 3.1 Pro, GPT 5.5, Grok 4.3, Claude model through API",
      "url": "https://github.com/router-for-me/CLIProxyAPI",
      "install": "go install github.com/router-for-me/CLIProxyAPI@latest"
    },
    {
      "name": "9router",
      "source": "tools",
      "group": null,
      "repo": "decolua/9router",
      "stars": 16162,
      "desc": "Unlimited FREE AI coding. Connect Claude Code, Codex, Cursor, Cline, Copilot, Antigravity to FREE Claude/GPT/Gemini via 40+ providers. Auto-fallback, RTK -40% tokens, never hit limits.",
      "url": "https://github.com/decolua/9router",
      "install": "npm i -g 9router"
    },
    {
      "name": "codex-cli",
      "source": "tools",
      "group": null,
      "repo": "openai/codex",
      "stars": 88407,
      "desc": "Lightweight coding agent that runs in your terminal",
      "url": "https://github.com/openai/codex",
      "install": "npm i -g @openai/codex"
    },
    {
      "name": "ECC",
      "source": "general",
      "group": null,
      "repo": "affaan-m/ECC",
      "stars": 205994,
      "desc": "The agent harness performance optimization system. Skills, instincts, memory, security, and research-first development for Claude Code, Codex, Opencode, Cursor and beyond.",
      "url": "https://github.com/affaan-m/ECC",
      "install": "git clone https://github.com/affaan-m/ECC.git"
    },
    {
      "name": "graphify",
      "source": "general",
      "group": null,
      "repo": "safishamsi/graphify",
      "stars": 58953,
      "desc": "AI coding assistant skill (Claude Code, Codex, OpenCode, Cursor, Gemini CLI, and more). Turn any folder of code, SQL schemas, R scripts, shell scripts, docs, papers, images, or videos into a queryable knowledge graph. App code + database sc",
      "url": "https://github.com/safishamsi/graphify",
      "install": "git clone https://github.com/safishamsi/graphify.git"
    },
    {
      "name": "claude-skills",
      "source": "general",
      "group": null,
      "repo": "alirezarezvani/claude-skills",
      "stars": 17068,
      "desc": "337 Claude Code skills & agent skills & plugins (30+ Agents, 70+ custom commands, 330+ skills, customizable references, scripts)for Claude Code, Codex, Gemini CLI, Cursor, and 8 more coding agents — engineering, marketing, product, complian",
      "url": "https://github.com/alirezarezvani/claude-skills",
      "install": "git clone https://github.com/alirezarezvani/claude-skills.git"
    },
    {
      "name": "codex-autoresearch",
      "source": "general",
      "group": null,
      "repo": "leo-lilinxiao/codex-autoresearch",
      "stars": 1828,
      "desc": "Codex Autoresearch Skill — A self-directed iterative system for Codex that continuously cycles through: modify, verify, retain or discard, and repeat indefinitely. Inspired by Karpathy’s autoresearch concept.",
      "url": "https://github.com/leo-lilinxiao/codex-autoresearch",
      "install": "git clone https://github.com/leo-lilinxiao/codex-autoresearch.git"
    },
    {
      "name": "ctf-skills",
      "source": "general",
      "group": null,
      "repo": "ljagiello/ctf-skills",
      "stars": 2279,
      "desc": "Agent skills for solving CTF challenges - web exploitation, binary pwn, crypto, reverse engineering, forensics, OSINT, and more",
      "url": "https://github.com/ljagiello/ctf-skills",
      "install": "git clone https://github.com/ljagiello/ctf-skills.git"
    },
    {
      "name": "cybersecurity-skills",
      "source": "general",
      "group": null,
      "repo": "mukul975/Anthropic-Cybersecurity-Skills",
      "stars": 13936,
      "desc": "754 structured cybersecurity skills for AI agents · Mapped to 5 frameworks: MITRE ATT&CK, NIST CSF 2.0, MITRE ATLAS, D3FEND & NIST AI RMF · agentskills.io standard · Works with Claude Code, GitHub Copilot, Codex CLI, Cursor, Gemini CLI & 20",
      "url": "https://github.com/mukul975/Anthropic-Cybersecurity-Skills",
      "install": "git clone https://github.com/mukul975/Anthropic-Cybersecurity-Skills.git"
    },
    {
      "name": "obsidian-skills",
      "source": "general",
      "group": null,
      "repo": "kepano/obsidian-skills",
      "stars": 34168,
      "desc": "Agent skills for Obsidian. Teach your agent to use Markdown, Bases, JSON Canvas, and use the CLI.",
      "url": "https://github.com/kepano/obsidian-skills",
      "install": "git clone https://github.com/kepano/obsidian-skills.git"
    },
    {
      "name": "marketingskills",
      "source": "general",
      "group": null,
      "repo": "coreyhaines31/marketingskills",
      "stars": 31816,
      "desc": "Marketing skills for Claude Code and AI agents. CRO, copywriting, SEO, analytics, and growth engineering.",
      "url": "https://github.com/coreyhaines31/marketingskills",
      "install": "git clone https://github.com/coreyhaines31/marketingskills.git"
    },
    {
      "name": "awesome-llm-skills",
      "source": "general",
      "group": null,
      "repo": "Prat011/awesome-llm-skills",
      "stars": 1289,
      "desc": "A curated list of awesome LLM and AI Agent Skills, resources and tools for customising AI Agent workflows - that works with Claude Code, Codex, Gemini CLI and your custom AI Agents",
      "url": "https://github.com/Prat011/awesome-llm-skills",
      "install": "git clone https://github.com/Prat011/awesome-llm-skills.git"
    },
    {
      "name": "antigravity-awesome-skills",
      "source": "general",
      "group": null,
      "repo": "sickn33/antigravity-awesome-skills",
      "stars": 39646,
      "desc": "Installable GitHub library of 1,500+ agentic skills for Claude Code, Cursor, Codex CLI, Gemini CLI, Antigravity, and more. Includes specialized plugins, installer CLI, bundles, workflows, and official/community skill collections.",
      "url": "https://github.com/sickn33/antigravity-awesome-skills",
      "install": "git clone https://github.com/sickn33/antigravity-awesome-skills.git"
    },
    {
      "name": "hermes-agent",
      "source": "hermes",
      "group": null,
      "repo": "nousresearch/hermes-agent",
      "stars": 179462,
      "desc": "The agent that grows with you",
      "url": "https://github.com/NousResearch/hermes-agent",
      "install": "npm i -g @nousresearch/hermes-agent"
    },
    {
      "name": "openclaw",
      "source": "openclaw",
      "group": null,
      "repo": "openclaw/openclaw",
      "stars": 376636,
      "desc": "Your own personal AI assistant. Any OS. Any Platform. The lobster way. 🦞",
      "url": "https://github.com/openclaw/openclaw",
      "install": "docker pull openclaw/openclaw"
    },
    {
      "name": "opencode",
      "source": "opencode",
      "group": null,
      "repo": "opencode-ai/opencode",
      "stars": 12818,
      "desc": "A powerful AI coding agent. Built for the terminal.",
      "url": "https://github.com/opencode-ai/opencode",
      "install": "npm i -g opencode-ai"
    }
  ]
};
