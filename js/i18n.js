/* ==========================================
   i18n
   ========================================== */
(function () {
  'use strict';

  const hub = window.SkillHub = window.SkillHub || {};

  const dictionary = {
    zh: {
      pageTitle: 'Skill Hub — AI Agent Skills 导航站',
      metaDesc: 'Skill Hub - 汇集主流 AI coding skills，统一按自动化效率、后端 API、数据 AI、设计 UI、开发工具、部署运维、文档内容、通用、安全、测试质检等功能分类浏览。',
      heroTitle: 'Skill Hub',
      heroSub: 'AI Agent Skills 导航站',
      heroDesc: '统一按功能分类浏览 AI coding skills，一站式搜索、浏览、安装。',
      searchPlaceholder: '搜索 skills / 仓库 / 描述…',
      searchClearTitle: '清空',
      emptyState: '没找到匹配的 skill 😕',
      pagePrev: '← 上一页',
      pageNext: '下一页 →',
      statsTitle: '📊 数据统计',
      statsBySource: '按 Agent 来源分布',
      statsTopRepos: '热门仓库 Top 10',
      directoryTitle: '平台与分类',
      directoryDesc: '从 agents 目录动态加载平台和功能分类',
      aboutTitle: '📚 关于',
      aboutP1: 'Skill Hub 汇集了 <strong>OpenAI Codex</strong>、<strong>Claude Code</strong>、<strong>Hermes Agent</strong>、<strong>OpenCode</strong>、<strong>OpenClaw</strong> 等主流 AI Agent 平台的 Skills。<br>社区还在不断贡献中，欢迎 <a href="https://github.com/rdone4425/skill-hub" target="_blank">提交你的仓库</a>！',
      aboutP2: '数据来源：GitHub 公开仓库，每日 UTC 00:00 自动更新。',
      footerDesc: '社区维护 · 每日自动更新',
      sortBy: '排序',
      groupBy: '分组',
      viewMode: '视图',
      flatView: '卡片视图',
      groupedView: '分组视图',
      sortStarsDesc: '⭐ 最多',
      sortStarsAsc: '⭐ 最少',
      sortNameAsc: 'A → Z',
      sortNameDesc: 'Z → A',
      groupNone: '不分组',
      groupAgent: '按 Agent 分类',
      resultsCount: '{count} 个 skill',
      resultsCountFiltered: '{count} 个 skill（共 {total} 个）',
      skills: '个 skill',
      categoriesLabel: '分类',
      reposLabel: 'Repos',
      viewOnGitHub: '仓库',
      install: '安装',
      installCopied: '已复制',
      categoryAll: '全部',
      categoryAllDesc: '所有收录的 skills',
      group_figma: 'Figma',
      group_github: 'GitHub',
      group_notion: 'Notion',
      group_playwright: 'Playwright',
      group_deploy: '部署',
      group_security: '安全',
      group_other: '其他',
      group_claude_official: 'Claude 官方',
      group_nicoboss: '个人项目',
      group_community: '社区收集',
      group_skills: 'Skills',
      group_plugins: '插件',
      group_codegen: '代码生成',
      group_general: '通用',
      group_design_ui: '设计 UI',
      group_docs_content: '文档内容',
      group_dev_tools: '开发工具',
      group_devops_deploy: '部署运维',
      group_backend_api: '后端 API',
      group_testing_qa: '测试质检',
      group_data_ai: '数据 AI',
      group_automation_productivity: '自动化效率'
    },
    en: {
      pageTitle: 'Skill Hub — AI Agent Skills Directory',
      metaDesc: 'Skill Hub - Browse AI coding skills by function category, including automation, backend API, data AI, design UI, dev tools, DevOps, docs, security, testing, and more.',
      heroTitle: 'Skill Hub',
      heroSub: 'AI Agent Skills Directory',
      heroDesc: 'Browse and search AI coding skills by function category.',
      searchPlaceholder: 'Search skills / repos / descriptions…',
      searchClearTitle: 'Clear',
      emptyState: 'No matching skills found 😕',
      pagePrev: '← Previous',
      pageNext: 'Next →',
      statsTitle: '📊 Statistics',
      statsBySource: 'Distribution by Agent Source',
      statsTopRepos: 'Top 10 Popular Repos',
      directoryTitle: 'Platforms & Categories',
      directoryDesc: 'Dynamically loaded from the agents directory',
      aboutTitle: '📚 About',
      aboutP1: 'Skill Hub aggregates skills from <strong>OpenAI Codex</strong>, <strong>Claude Code</strong>, <strong>Hermes Agent</strong>, <strong>OpenCode</strong>, <strong>OpenClaw</strong> and more.<br>The community is growing — <a href="https://github.com/rdone4425/skill-hub" target="_blank">submit your repo</a>!',
      aboutP2: 'Data source: public GitHub repos, auto-updated daily at UTC 00:00.',
      footerDesc: 'Community maintained · Updated daily',
      sortBy: 'Sort',
      groupBy: 'Group',
      viewMode: 'View',
      flatView: 'Cards',
      groupedView: 'Grouped',
      sortStarsDesc: '⭐ Most',
      sortStarsAsc: '⭐ Fewest',
      sortNameAsc: 'A → Z',
      sortNameDesc: 'Z → A',
      groupNone: 'No Group',
      groupAgent: 'By Agent',
      resultsCount: '{count} skills',
      resultsCountFiltered: '{count} skills (of {total})',
      skills: ' skills',
      categoriesLabel: 'Categories',
      reposLabel: 'Repos',
      viewOnGitHub: 'Repo',
      install: 'Install',
      installCopied: 'Copied',
      categoryAll: 'All',
      categoryAllDesc: 'All indexed skills',
      group_figma: 'Figma',
      group_github: 'GitHub',
      group_notion: 'Notion',
      group_playwright: 'Playwright',
      group_deploy: 'Deploy',
      group_security: 'Security',
      group_other: 'Other',
      group_claude_official: 'Claude Official',
      group_nicoboss: 'Personal Projects',
      group_community: 'Community',
      group_skills: 'Skills',
      group_plugins: 'Plugins',
      group_codegen: 'Code Generation',
      group_general: 'General',
      group_design_ui: 'Design UI',
      group_docs_content: 'Docs Content',
      group_dev_tools: 'Dev Tools',
      group_devops_deploy: 'DevOps Deploy',
      group_backend_api: 'Backend API',
      group_testing_qa: 'Testing QA',
      group_data_ai: 'Data AI',
      group_automation_productivity: 'Automation'
    }
  };

  function getLang() {
    const saved = localStorage.getItem('skill-hub.lang') || localStorage.getItem('lang');
    if (saved === 'en' || saved === 'zh') return saved;
    return navigator.language.startsWith('zh') ? 'zh' : 'en';
  }

  function t(key) {
    return dictionary[getLang()][key] || key;
  }

  function applyI18n(lang) {
    const dict = dictionary[lang] || dictionary.zh;
    document.documentElement.lang = lang;

    const langEl = document.getElementById('lang-current');
    if (langEl) langEl.textContent = lang === 'zh' ? '中文' : 'EN';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) el.placeholder = dict[key];
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key] !== undefined) el.title = dict[key];
    });

    if (dict.pageTitle) document.title = dict.pageTitle;

    if (dict.metaDesc) {
      const metaEl = document.querySelector('meta[name="description"]');
      if (metaEl) metaEl.content = dict.metaDesc;
    }

    document.querySelectorAll('[data-i18n-options]').forEach(select => {
      const mapping = select.getAttribute('data-i18n-options');
      mapping.split(',').forEach(pair => {
        const [value, key] = pair.split(':');
        const opt = select.querySelector(`option[value="${value.trim()}"]`);
        if (opt && dict[key.trim()] !== undefined) {
          opt.textContent = dict[key.trim()];
        }
      });
    });
  }

  function setLang(lang) {
    localStorage.setItem('skill-hub.lang', lang);
    localStorage.setItem('lang', lang);
    applyI18n(lang);
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  hub.i18n = {
    dictionary,
    getLang,
    setLang,
    t,
    applyI18n
  };

  window.getLang = getLang;
  window.setLang = setLang;
  window.t = t;
})();
