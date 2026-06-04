/**
 * Skill Hub 主应用
 * 功能：搜索、分组过滤、分组视图、分页、排序、统计
 */

/* ==========================================
   I18N 字典（内联，防止外部脚本缓存冲突）
   ========================================== */
const SKILL_HUB_I18N = {
  zh: {
    pageTitle: 'Skill Hub — AI Agent Skills 导航站',
    metaDesc: 'Skill Hub — 汇集 OpenAI Codex、Claude Code、Hermes Agent、OpenCode 等主流 AI Agent 平台的 Skills，按 Agent 分类，支持安装、收藏、分页浏览。',
    heroTitle: '🔍 Skill Hub',
    heroSub: 'AI Agent Skills 导航站',
    heroDesc: '汇集主流 AI Agent 平台的 Skills，一站式搜索、浏览、安装。',
    searchPlaceholder: '搜索 skills / 仓库 / 描述…',
    searchClearTitle: '清空',
    emptyState: '没找到匹配的 skill 😕',
    pagePrev: '← 上一页',
    pageNext: '下一页 →',
    statsTitle: '📊 数据统计',
    statsBySource: '按 Agent 来源分布',
    statsTopRepos: '热门仓库 Top 10',
    aboutTitle: '📚 关于',
    aboutP1: 'Skill Hub 汇集了 <strong>OpenAI Codex</strong>、<strong>Claude Code</strong>、<strong>Hermes Agent</strong>、<strong>OpenCode</strong>、<strong>OpenClaw</strong> 等主流 AI Agent 平台的 Skills。<br>社区还在不断贡献中，欢迎 <a href="https://github.com/rdone4425/skill" target="_blank">提交你的仓库</a>！',
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
    viewOnGitHub: '仓库',
    install: '安装',
    categoryOfficial: 'OpenAI Codex',
    categoryClaude: 'Claude Code',
    categoryHermes: 'Hermes Agent',
    categoryOpencode: 'OpenCode',
    categoryOpenclaw: 'OpenClaw',
    categoryCommunity: 'Community',
    categoryTools: 'Dev Tools',
    categoryGeneral: '通用',
    categoryAll: '全部',
    categoryOfficialDesc: 'OpenAI Codex 官方精选的 skills，$skill-installer 可直接安装',
    categoryClaudeDesc: 'Claude Code 用户贡献的 skills 和指令模板',
    categoryHermesDesc: 'Hermes Agent 生态的 skills、插件和自动更新能力',
    categoryOpencodeDesc: 'OpenCode 平台的 skills 和 hooks',
    categoryOpenclawDesc: 'OpenClaw 生态的 skills、模板和工具',
    categoryCommunityDesc: '社区收集的 AI Agent skills 集合，精选高质量项目',
    categoryToolsDesc: '开发者工具、DevOps、Cloud、Testing 相关 skills',
    categoryGeneralDesc: '通用 AI 编程助手、prompt 工程和最佳实践',
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
    group_general: '通用'
  },
  en: {
    pageTitle: 'Skill Hub — AI Agent Skills Directory',
    metaDesc: 'Skill Hub — Browse skills from OpenAI Codex, Claude Code, Hermes Agent, OpenCode and more. Search across agents, install with one click.',
    heroTitle: '🔍 Skill Hub',
    heroSub: 'AI Agent Skills Directory',
    heroDesc: 'Browse and search skills from mainstream AI Agent platforms.',
    searchPlaceholder: 'Search skills / repos / descriptions…',
    searchClearTitle: 'Clear',
    emptyState: 'No matching skills found 😕',
    pagePrev: '← Previous',
    pageNext: 'Next →',
    statsTitle: '📊 Statistics',
    statsBySource: 'Distribution by Agent Source',
    statsTopRepos: 'Top 10 Popular Repos',
    aboutTitle: '📚 About',
    aboutP1: 'Skill Hub aggregates skills from <strong>OpenAI Codex</strong>, <strong>Claude Code</strong>, <strong>Hermes Agent</strong>, <strong>OpenCode</strong>, <strong>OpenClaw</strong> and more.<br>The community is growing — <a href="https://github.com/rdone4425/skill" target="_blank">submit your repo</a>!',
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
    viewOnGitHub: 'Repo',
    install: 'Install',
    categoryOfficial: 'OpenAI Codex',
    categoryClaude: 'Claude Code',
    categoryHermes: 'Hermes Agent',
    categoryOpencode: 'OpenCode',
    categoryOpenclaw: 'OpenClaw',
    categoryCommunity: 'Community',
    categoryTools: 'Dev Tools',
    categoryGeneral: 'General',
    categoryAll: 'All',
    categoryOfficialDesc: 'Official OpenAI Codex curated skills, installable via $skill-installer',
    categoryClaudeDesc: 'Claude Code community skills and instruction templates',
    categoryHermesDesc: 'Hermes Agent ecosystem skills, plugins and auto-update capabilities',
    categoryOpencodeDesc: 'OpenCode platform skills and hooks',
    categoryOpenclawDesc: 'OpenClaw ecosystem skills, templates and tools',
    categoryCommunityDesc: 'Community-curated AI Agent skill collections, hand-picked quality projects',
    categoryToolsDesc: 'Developer tools, DevOps, Cloud and Testing skills',
    categoryGeneralDesc: 'General AI coding assistants, prompt engineering and best practices',
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
    group_general: 'General'
  }
};

/* ==========================================
   i18n 辅助函数
   ========================================== */
function getLang() {
  const saved = localStorage.getItem('skill-hub.lang') || localStorage.getItem('lang');
  if (saved === 'en' || saved === 'zh') return saved;
  return navigator.language.startsWith('zh') ? 'zh' : 'en';
}

function setLang(lang) {
  localStorage.setItem('skill-hub.lang', lang);
  localStorage.setItem('lang', lang);
  applyI18n(lang);
  // 触发自定义事件让 app 重新渲染
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function t(key) {
  return SKILL_HUB_I18N[getLang()][key] || key;
}

function applyI18n(lang) {
  const dict = SKILL_HUB_I18N[lang] || SKILL_HUB_I18N.zh;

  document.documentElement.lang = lang;
  const langEl = document.getElementById('lang-current');
  if (langEl) langEl.textContent = lang === 'zh' ? '中文' : 'EN';

  // data-i18n：纯文本
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  // data-i18n-html：带 HTML
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  // data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  // data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key] !== undefined) el.title = dict[key];
  });

  // <title>
  if (dict.pageTitle) document.title = dict.pageTitle;

  // meta description
  if (dict.metaDesc) {
    const metaEl = document.querySelector('meta[name="description"]');
    if (metaEl) metaEl.content = dict.metaDesc;
  }

  // data-i18n-options：为 <select> 的 <option> 批量翻译
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

/* ==========================================
   主应用 IIFE
   ========================================== */
(function () {
  'use strict';

  /* ---------- 常量 ---------- */
  const PER_PAGE = 24;
  const STAR_FMT = n => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : n.toLocaleString();

  /* Agent 来源元数据 */
  const AGENT_META = {
    official: { icon: '🎯', color: '#6366f1', order: 1 },
    claude:   { icon: '🟠', color: '#fb923c', order: 2 },
    hermes:   { icon: '⚡', color: '#06b6d4', order: 3 },
    opencode: { icon: '🟢', color: '#22c55e', order: 4 },
    openclaw: { icon: '🐾', color: '#f97316', order: 5 },
    community:{ icon: '👥', color: '#a855f7', order: 6 },
    tools:    { icon: '🛠️', color: '#f59e0b', order: 7 },
    general:  { icon: '📚', color: '#6b7280', order: 8 }
  };

  /* ---------- 状态 ---------- */
  const state = {
    data: [],
    categories: [],
    keyword: '',
    category: 'all',
    subgroup: null,
    sort: 'stars-desc',
    groupBy: 'agent',
    viewMode: 'grouped',
    page: 1
  };

  /* ---------- DOM 缓存 ---------- */
  const dom = {};
  function cacheDom() {
    ['search', 'search-clear', 'results', 'empty', 'results-count',
     'category-tabs', 'subgroup-tabs', 'category-desc',
     'stats-section', 'stats-chart', 'stats-bars',
     'pagination', 'page-info', 'page-prev', 'page-next',
     'sort-select', 'group-select', 'view-toggle'
    ].forEach(id => { dom[id] = document.getElementById(id); });
  }

  /* ---------- 过滤 + 排序 ---------- */
  function getFiltered() {
    let list = state.data;

    if (state.category !== 'all') {
      list = list.filter(s => s.source === state.category);
    }
    if (state.subgroup) {
      list = list.filter(s => s.group === state.subgroup);
    }
    if (state.keyword) {
      const kw = state.keyword.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(kw) ||
        s.desc.toLowerCase().includes(kw) ||
        s.repo.toLowerCase().includes(kw)
      );
    }

    const [field, dir] = state.sort.split('-');
    const mul = dir === 'asc' ? 1 : -1;
    if (field === 'stars') {
      list = [...list].sort((a, b) => (a.stars - b.stars) * mul);
    } else {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name) * mul);
    }

    return list;
  }

  /* ---------- 渲染：分类 Tab ---------- */
  function renderCategoryTabs() {
    const wrap = dom['category-tabs'];
    if (!wrap) return;
    const lang = getLang();
    wrap.innerHTML = '';

    const allTab = document.createElement('button');
    allTab.className = 'cat-tab' + (state.category === 'all' ? ' active' : '');
    allTab.dataset.id = 'all';
    allTab.textContent = SKILL_HUB_I18N[lang].categoryAll;
    wrap.appendChild(allTab);

    state.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-tab' + (state.category === cat.id ? ' active' : '');
      btn.dataset.id = cat.id;
      btn.innerHTML = `${cat.icon} ${cat.label}`;
      wrap.appendChild(btn);
    });

    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-tab');
      if (!btn) return;
      state.category = btn.dataset.id;
      state.subgroup = null;
      state.page = 1;
      renderCategoryTabs();
      renderSubgroupTabs();
      renderCategoryDesc();
      render();
    });
  }

  /* ---------- 渲染：子分组 Tab ---------- */
  function renderSubgroupTabs() {
    const wrap = dom['subgroup-tabs'];
    if (!wrap) return;
    const lang = getLang();
    wrap.innerHTML = '';
    wrap.hidden = true;

    if (state.category === 'all') return;

    const cat = state.categories.find(c => c.id === state.category);
    if (!cat || !cat.groups || cat.groups.length === 0) return;

    wrap.hidden = false;

    const allBtn = document.createElement('button');
    allBtn.className = 'sub-tab' + (!state.subgroup ? ' active' : '');
    allBtn.dataset.group = '';
    allBtn.textContent = SKILL_HUB_I18N[lang].categoryAll;
    wrap.appendChild(allBtn);

    cat.groups.forEach(grp => {
      const btn = document.createElement('button');
      btn.className = 'sub-tab' + (state.subgroup === grp.id ? ' active' : '');
      btn.dataset.group = grp.id;
      const labelKey = 'group_' + grp.id.replace(/-/g, '_');
      btn.textContent = SKILL_HUB_I18N[lang][labelKey] || grp.label;
      wrap.appendChild(btn);
    });

    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.sub-tab');
      if (!btn) return;
      state.subgroup = btn.dataset.group || null;
      state.page = 1;
      renderSubgroupTabs();
      render();
    });
  }

  /* ---------- 渲染：分类描述 ---------- */
  function renderCategoryDesc() {
    const el = dom['category-desc'];
    if (!el) return;
    const lang = getLang();
    el.hidden = true;

    if (state.category === 'all') {
      el.textContent = SKILL_HUB_I18N[lang].categoryAllDesc;
      el.hidden = false;
      return;
    }

    const key = `category${state.category.charAt(0).toUpperCase() + state.category.slice(1)}Desc`;
    if (SKILL_HUB_I18N[lang][key]) {
      el.textContent = SKILL_HUB_I18N[lang][key];
      el.hidden = false;
    }
  }

  /* ---------- 渲染：卡片（单个 skill） ---------- */
  function createCard(skill) {
    const lang = getLang();
    const meta = AGENT_META[skill.source] || {};
    const color = meta.color || '#6b7280';
    const icon = meta.icon || '📦';
    const agentLabel = SKILL_HUB_I18N[lang][`category${skill.source.charAt(0).toUpperCase() + skill.source.slice(1)}`] || skill.source;
    const _grp = skill.group || 'other';
    const groupKey = 'group_' + _grp.replace(/-/g, '_');
    const groupLabel = SKILL_HUB_I18N[lang][groupKey] || _grp;

    const card = document.createElement('article');
    card.className = 'card';
    card.style.setProperty('--accent', color);
    card.innerHTML = `
      <div class="card-header">
        <span class="skill-name">${skill.name}</span>
        <span class="repo-stars" title="${skill.stars.toLocaleString()}">⭐ ${STAR_FMT(skill.stars)}</span>
      </div>
      <p class="skill-desc">${skill.desc}</p>
      <div class="card-meta">
        <span class="source-tag" style="background:${color}20;color:${color}">${icon} ${agentLabel}</span>
        <span class="group-tag">🏷️ ${groupLabel}</span>
      </div>
      <div class="card-actions">
        <a class="btn-link" href="https://github.com/${skill.repo}" target="_blank" rel="noopener">🔗 ${SKILL_HUB_I18N[lang].viewOnGitHub}</a>
        <span class="btn-install" title="${skill.install}">$ ${skill.install}</span>
      </div>
    `;
    return card;
  }

  /* ---------- 渲染：分组视图（Agent → Type） ---------- */
  function renderGroupedView(list) {
    const lang = getLang();
    const grouped = {};

    list.forEach(skill => {
      const agent = skill.source;
      if (!grouped[agent]) grouped[agent] = {};
      const group = skill.group || 'other';
      if (!grouped[agent][group]) grouped[agent][group] = [];
      grouped[agent][group].push(skill);
    });

    const agentKeys = Object.keys(grouped).sort((a, b) => {
      return (AGENT_META[a]?.order || 99) - (AGENT_META[b]?.order || 99);
    });

    const container = document.createDocumentFragment();

    agentKeys.forEach(agent => {
      const meta = AGENT_META[agent] || {};
      const agentLabel = SKILL_HUB_I18N[lang][`category${agent.charAt(0).toUpperCase() + agent.slice(1)}`] || agent;
      const color = meta.color || '#6b7280';
      const icon = meta.icon || '📦';
      const groups = grouped[agent];
      const totalCount = Object.values(groups).reduce((sum, arr) => sum + arr.length, 0);

      const section = document.createElement('section');
      section.className = 'agent-section';
      section.style.setProperty('--agent-color', color);

      const header = document.createElement('div');
      header.className = 'agent-header';
      header.innerHTML = `
        <div class="agent-header-left">
          <span class="agent-icon">${icon}</span>
          <h2 class="agent-title">${agentLabel}</h2>
          <span class="agent-count">${totalCount} ${SKILL_HUB_I18N[lang].skills}</span>
        </div>
        <span class="agent-toggle">▼</span>
      `;

      const content = document.createElement('div');
      content.className = 'agent-content';

      const groupKeys = Object.keys(groups).sort((a, b) => {
        if (a === 'other') return 1;
        if (b === 'other') return -1;
        return a.localeCompare(b);
      });

      groupKeys.forEach(group => {
        const skills = groups[group];
        const groupKey = 'group_' + group.replace(/-/g, '_');
        const groupLabel = SKILL_HUB_I18N[lang][groupKey] || group;

        const groupSection = document.createElement('div');
        groupSection.className = 'type-group';

        const groupHeader = document.createElement('div');
        groupHeader.className = 'type-header';
        groupHeader.innerHTML = `
          <h3 class="type-title">🏷️ ${groupLabel}</h3>
          <span class="type-count">${skills.length}</span>
        `;

        const grid = document.createElement('div');
        grid.className = 'card-grid';

        skills.forEach(skill => {
          grid.appendChild(createCard(skill));
        });

        groupSection.appendChild(groupHeader);
        groupSection.appendChild(grid);
        content.appendChild(groupSection);
      });

      section.appendChild(header);
      section.appendChild(content);
      container.appendChild(section);

      header.addEventListener('click', () => {
        section.classList.toggle('collapsed');
      });
    });

    return container;
  }

  /* ---------- 渲染：卡片网格（平铺） ---------- */
  function renderFlatView(list) {
    const container = document.createDocumentFragment();
    list.forEach(skill => {
      container.appendChild(createCard(skill));
    });
    return container;
  }

  /* ---------- 渲染：统计 ---------- */
  function renderStats() {
    const section = dom['stats-section'];
    if (!section) return;

    const bySource = {};
    state.data.forEach(s => {
      bySource[s.source] = (bySource[s.source] || 0) + 1;
    });

    const colors = ['#6366f1','#fb923c','#06b6d4','#22c55e','#f97316','#a855f7','#f59e0b','#6b7280'];
    const sortedSources = Object.entries(bySource).sort((a, b) => b[1] - a[1]);

    const chartWrap = dom['stats-chart'];
    if (chartWrap) {
      const parent = chartWrap.parentElement;
      let table = parent.querySelector('.stats-table');
      if (!table) {
        chartWrap.style.display = 'none';
        table = document.createElement('div');
        table.className = 'stats-table';
        parent.appendChild(table);
      }

      table.innerHTML = sortedSources.map(([src, count], i) => {
        const pct = (count / state.data.length * 100).toFixed(1);
        const meta = AGENT_META[src] || {};
        const lang = getLang();
        const label = SKILL_HUB_I18N[lang][`category${src.charAt(0).toUpperCase() + src.slice(1)}`] || src;
        return `<div class="stats-row">
          <span class="stats-label">${meta.icon || '📦'} ${label}</span>
          <div class="stats-bar-bg">
            <div class="stats-bar-fill" style="width:${pct}%;background:${meta.color || colors[i]}"></div>
          </div>
          <span class="stats-count">${count} (${pct}%)</span>
        </div>`;
      }).join('');
    }

    const repoMap = {};
    state.data.forEach(s => {
      repoMap[s.repo] = (repoMap[s.repo] || 0) + 1;
    });
    const topRepos = Object.entries(repoMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const maxCount = topRepos.length > 0 ? topRepos[0][1] : 1;

    const barsWrap = dom['stats-bars'];
    if (barsWrap) {
      barsWrap.innerHTML = topRepos.map(([repo, count]) => {
        const pct = (count / maxCount * 100).toFixed(1);
        const shortName = repo.split('/')[1] || repo;
        return `<div class="stats-row">
          <a class="stats-label link" href="https://github.com/${repo}" target="_blank">${shortName}</a>
          <div class="stats-bar-bg">
            <div class="stats-bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="stats-count">${count}</span>
        </div>`;
      }).join('');
    }
  }

  /* ---------- 渲染：分页 ---------- */
  function renderPagination(totalPages) {
    const nav = dom['pagination'];
    if (!nav) return;
    nav.hidden = totalPages <= 1;
    if (totalPages <= 1) return;

    const info = dom['page-info'];
    if (info) info.textContent = `${state.page} / ${totalPages}`;

    const prev = dom['page-prev'];
    const next = dom['page-next'];
    if (prev) prev.disabled = state.page <= 1;
    if (next) next.disabled = state.page >= totalPages;
  }

  /* ---------- 主渲染 ---------- */
  function render() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * PER_PAGE;
    const pageData = filtered.slice(start, start + PER_PAGE);

    const results = dom.results;
    if (results) {
      results.innerHTML = '';
      results.className = state.viewMode === 'flat' ? 'results card-grid' : 'results results-grouped';

      if (state.viewMode === 'grouped') {
        const fragment = renderGroupedView(filtered);
        results.appendChild(fragment);
        renderPagination(1);
      } else {
        const fragment = renderFlatView(pageData);
        results.appendChild(fragment);
        renderPagination(totalPages);
      }
    }

    const empty = dom.empty;
    if (empty) empty.hidden = filtered.length > 0;

    const countEl = dom['results-count'];
    if (countEl) {
      if (state.keyword || state.category !== 'all') {
        countEl.textContent = t('resultsCountFiltered')
          .replace('{count}', filtered.length)
          .replace('{total}', state.data.length);
      } else {
        countEl.textContent = t('resultsCount').replace('{count}', state.data.length);
      }
    }
  }

  /* ---------- 事件绑定 ---------- */
  function bindEvents() {
    const search = dom.search;
    if (search) {
      let timer = null;
      search.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          state.keyword = search.value.trim();
          state.page = 1;
          render();
        }, 250);
      });
    }

    const clearBtn = dom['search-clear'];
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const input = dom.search;
        if (input) input.value = '';
        state.keyword = '';
        state.page = 1;
        render();
        if (input) input.focus();
      });
    }

    const sortSel = dom['sort-select'];
    if (sortSel) {
      sortSel.value = state.sort;
      sortSel.addEventListener('change', () => {
        state.sort = sortSel.value;
        state.page = 1;
        render();
      });
    }

    const groupSel = dom['group-select'];
    if (groupSel) {
      groupSel.value = state.groupBy;
      groupSel.addEventListener('change', () => {
        state.groupBy = groupSel.value;
        state.viewMode = groupSel.value === 'none' ? 'flat' : 'grouped';
        state.page = 1;
        render();
      });
    }

    const viewToggle = dom['view-toggle'];
    if (viewToggle) {
      viewToggle.addEventListener('click', () => {
        state.viewMode = state.viewMode === 'grouped' ? 'flat' : 'grouped';
        state.page = 1;
        render();
        viewToggle.textContent = state.viewMode === 'grouped' ? '📋' : '📊';
      });
    }

    if (dom['page-prev']) {
      dom['page-prev'].addEventListener('click', () => {
        if (state.page > 1) { state.page--; render(); }
      });
    }
    if (dom['page-next']) {
      dom['page-next'].addEventListener('click', () => {
        state.page++;
        render();
      });
    }
  }

  /* ---------- i18n 监听 ---------- */
  function setupI18nListener() {
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        setTimeout(() => {
          renderCategoryTabs();
          renderSubgroupTabs();
          renderCategoryDesc();
          render();
        }, 50);
      });
    }
  }

  /* ---------- 初始化 ---------- */
  function init() {
    cacheDom();

    // 应用 i18n
    applyI18n(getLang());

    // 加载数据
    const data = window.SKILL_DATA || window.SKILLS_DATA;
    if (data) {
      state.data = data.skills || [];
      state.categories = data.categories || [];
    }

    renderCategoryTabs();
    renderSubgroupTabs();
    renderCategoryDesc();
    bindEvents();
    renderStats();
    render();
    setupI18nListener();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
