/**
 * i18n.js — 中英文 UI 翻译
 *
 * 用法：
 *   - HTML 元素加 data-i18n="key" 或 data-i18n-html="key"（含 HTML 时）
 *   - placeholder 元素用 data-i18n-placeholder="key"
 *   - 调用 I18N.apply() 应用当前语言
 *   - 切换语言：I18N.set("en" | "zh")
 *
 * 持久化：localStorage["codex-skills-hub.lang"]
 * 默认：浏览器语言决定（zh-* → zh，其他 → en）
 */

window.I18N = (function () {
  "use strict";

  const STRINGS = {
    zh: {
      // 头部品牌
      brandName: "Codex Skills Hub",
      brandTagline: "OpenAI Codex 技能 · 官方精选 + 社区",

      // 页面 title / description / og
      pageTitle: "Codex Skills Hub — OpenAI Codex 技能索引",
      pageDescription: "OpenAI Codex 技能精选索引 — 官方 39 个技能、社区清单、CLI 工具、通用 agent 技能",
      ogTitle: "Codex Skills Hub — OpenAI Codex 技能索引",
      ogDescription: "56+ 个 Codex 技能，源自 17 个仓库 — 官方精选、社区清单、CLI 工具",

      // 搜索
      searchPlaceholder: "搜索 skills / 仓库 / 描述…",
      searchClearTitle: "清空",

      // 主分类 Tab
      tabAll: "全部",
      tabOfficial: "官方精选",
      tabCommunity: "社区清单",
      tabTools: "CLI 工具",
      tabGeneral: "通用 Skills",

      // 子分组 Tab（official 下的子分类）
      subgroupAll: "全部",
      groupFigma: "Figma",
      groupGithub: "GitHub",
      groupNotion: "Notion",
      groupPlaywright: "Playwright",
      groupDeploy: "部署",
      groupSecurity: "安全",
      groupOther: "其他",

      // 卡片
      copy: "复制",
      copied: "已复制",
      viewRepo: "查看仓库 →",
      starsTitle: "GitHub Stars",

      // 空状态
      emptyState: "没找到匹配的 skill 😕",

      // 关于
      aboutTitle: "📚 关于",
      aboutP1: '<strong>Codex Skills Hub</strong> 是 <a href="https://github.com/rdone4425" target="_blank" rel="noopener">rdone4425</a> 维护的 OpenAI Codex skills 索引。数据来源包括 <a href="https://github.com/openai/skills" target="_blank" rel="noopener">openai/skills</a> 官方精选、社区 awesome 清单，以及 Codex CLI 配套工具。',
      aboutP2: '部署在 <a href="https://pages.cloudflare.com" target="_blank" rel="noopener">Cloudflare Pages</a>，源数据在 <a href="https://github.com/rdone4425/skill" target="_blank" rel="noopener">GitHub</a>，欢迎 PR / Issue。',

      // 分类描述
      catOfficial: "OpenAI 官方精选的 skills，$skill-installer 可直接安装",
      catCommunity: "社区维护的 awesome 清单，收录各种 Codex skills",
      catTools: "配合 Codex 使用的 CLI 工具 — proxy、router、wrapper",
      catGeneral: "通用 AI agent skills — 多端兼容（Codex/Claude Code/OpenCode）",

      // 头部统计
      statSkills: "Skills",
      statSources: "来源",
      statStars: "总 ⭐",

      // Footer
      license: "MIT License",
      source: "源码",
      dataUpdated: "数据最后更新",

      // 语言切换器
      langZh: "中",
      langEn: "EN",
    },
    en: {
      // 头部品牌
      brandName: "Codex Skills Hub",
      brandTagline: "OpenAI Codex Skills · Official + Community",

      // 页面 title / description / og
      pageTitle: "Codex Skills Hub — OpenAI Codex Skills Index",
      pageDescription: "Curated index of OpenAI Codex skills — 39 official curated, community lists, CLI tools, and general agent skills.",
      ogTitle: "Codex Skills Hub — OpenAI Codex Skills Index",
      ogDescription: "56+ Codex skills from 17 sources — official curated, community lists, CLI tools.",

      // 搜索
      searchPlaceholder: "Search skills / repos / descriptions…",
      searchClearTitle: "Clear",

      tabAll: "All",
      tabOfficial: "Official Curated",
      tabCommunity: "Community Lists",
      tabTools: "CLI Tools",
      tabGeneral: "General Skills",

      subgroupAll: "All",
      groupFigma: "Figma",
      groupGithub: "GitHub",
      groupNotion: "Notion",
      groupPlaywright: "Playwright",
      groupDeploy: "Deploy",
      groupSecurity: "Security",
      groupOther: "Other",

      copy: "Copy",
      copied: "Copied",
      viewRepo: "View repo →",
      starsTitle: "GitHub Stars",

      emptyState: "No matching skills found 😕",

      aboutTitle: "📚 About",
      aboutP1: '<strong>Codex Skills Hub</strong> is an index of OpenAI Codex skills, maintained by <a href="https://github.com/rdone4425" target="_blank" rel="noopener">rdone4425</a>. Data sources include <a href="https://github.com/openai/skills" target="_blank" rel="noopener">openai/skills</a> official curated, community awesome lists, and Codex CLI tools.',
      aboutP2: 'Deployed on <a href="https://pages.cloudflare.com" target="_blank" rel="noopener">Cloudflare Pages</a>, source on <a href="https://github.com/rdone4425/skill" target="_blank" rel="noopener">GitHub</a>. PRs and issues welcome.',

      catOfficial: "OpenAI's official curated skills, installable via $skill-installer",
      catCommunity: "Community-maintained awesome lists of various Codex skills",
      catTools: "CLI tools for Codex — proxy, router, wrapper",
      catGeneral: "General AI agent skills — cross-platform (Codex / Claude Code / OpenCode)",

      statSkills: "Skills",
      statSources: "Sources",
      statStars: "Total ⭐",

      license: "MIT License",
      source: "Source",
      dataUpdated: "Data updated",

      langZh: "中",
      langEn: "EN",
    },
  };

  const STORAGE_KEY = "codex-skills-hub.lang";

  function detectDefault() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
    const lang = (navigator.language || "en").toLowerCase();
    return lang.startsWith("zh") ? "zh" : "en";
  }

  let current = detectDefault();

  function t(key) {
    return (STRINGS[current] && STRINGS[current][key]) || STRINGS.en[key] || key;
  }

  function set(lang) {
    if (lang !== "zh" && lang !== "en") return;
    current = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    apply();
    // 触发自定义事件，让 app.js 知道要重新渲染
    window.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
  }

  function get() {
    return current;
  }

  function apply() {
    // 1. textContent 翻译
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (val) el.textContent = val;
    });

    // 2. innerHTML 翻译（含链接）
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.dataset.i18nHtml;
      const val = t(key);
      if (val) el.innerHTML = val;
    });

    // 3. placeholder 翻译
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      const val = t(key);
      if (val) el.placeholder = val;
    });

    // 4. title 属性翻译
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.dataset.i18nTitle;
      const val = t(key);
      if (val) el.title = val;
    });

    // 5. head 里的 <title> 和 <meta> 翻译（动态改浏览器标题和 SEO）
    const headTitle = document.querySelector("title[data-i18n], head title");
    if (headTitle && headTitle.dataset.i18n) {
      const val = t(headTitle.dataset.i18n);
      if (val) document.title = val;
    }
    document.querySelectorAll("meta[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (val) el.setAttribute("content", val);
    });

    // 6. 更新语言切换器高亮
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === current);
    });
  }

  return { t, set, get, apply };
})();
