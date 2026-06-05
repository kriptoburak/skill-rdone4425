/* ==========================================
   state
   ========================================== */
(function () {
  'use strict';

  const hub = window.SkillHub = window.SkillHub || {};

  const PER_PAGE = 24;
  const STATE_STORAGE_KEY = 'skill-hub.view-state';
  const STAR_FMT = n => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : n.toLocaleString();
  const FUNCTION_CATEGORIES = [
    ['design-ui', ['figma', 'design', 'ui', 'ux', 'frontend', 'component', 'visual', 'style', 'css', 'html', 'layout']],
    ['docs-content', ['document', 'docs', 'pdf', 'word', 'excel', 'powerpoint', 'slides', 'notion', 'obsidian', 'content', 'writing', 'report', 'presentation']],
    ['dev-tools', ['cli', 'tool', 'plugin', 'mcp', 'wrapper', 'installer', 'editor', 'workspace', 'terminal', 'command']],
    ['devops-deploy', ['deploy', 'deployment', 'cloudflare', 'vercel', 'netlify', 'docker', 'infra', 'infrastructure', 'kubernetes', 'ci', 'cd', 'workflow', 'ops']],
    ['backend-api', ['api', 'backend', 'server', 'grpc', 'database', 'sql', 'auth', 'asp.net', 'mvc', 'microservice']],
    ['testing-qa', ['test', 'testing', 'qa', 'debug', 'bug', 'e2e', 'playwright', 'verify', 'validation']],
    ['security', ['security', 'secure', 'auth', 'privacy', 'guard', 'cyber', 'vulnerability', 'ctf']],
    ['data-ai', ['ai', 'llm', 'model', 'agent', 'rag', 'research', 'analysis', 'prompt', 'memory', 'vector', 'dataset']],
    ['automation-productivity', ['automation', 'automate', 'productivity', 'sync', 'manage', 'manager', 'organize', 'planner', 'planning', 'task']]
  ];

  const AGENT_META = {
    codex:    { icon: '🎯', iconUrl: 'https://www.google.com/s2/favicons?domain=openai.com&sz=64', color: '#6366f1', order: 1, zh: 'Codex', en: 'Codex', zhDesc: '面向 Codex 生态的 skills、工具和资源', enDesc: 'Skills, tools, and resources for the Codex ecosystem' },
    claude:   { icon: '🟠', iconUrl: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=64', color: '#fb923c', order: 2, zh: 'Claude Code', en: 'Claude Code', zhDesc: '面向 Claude Code 生态的 skills、工具和资源', enDesc: 'Skills, tools, and resources for the Claude Code ecosystem' },
    hermes:   { icon: '⚡', iconUrl: 'https://www.google.com/s2/favicons?domain=nousresearch.com&sz=64', color: '#06b6d4', order: 3, zh: 'Hermes Agent', en: 'Hermes Agent', zhDesc: '面向 Hermes Agent 生态的 skills、工具和资源', enDesc: 'Skills, tools, and resources for the Hermes Agent ecosystem' },
    opencode: { icon: '🟢', iconUrl: 'https://www.google.com/s2/favicons?domain=opencode.ai&sz=64', color: '#22c55e', order: 4, zh: 'OpenCode', en: 'OpenCode', zhDesc: '面向 OpenCode 生态的 skills、工具和资源', enDesc: 'Skills, tools, and resources for the OpenCode ecosystem' },
    openclaw: { icon: '🐾', iconUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=64', color: '#f97316', order: 5, zh: 'OpenClaw', en: 'OpenClaw', zhDesc: '面向 OpenClaw 生态的 skills、工具和资源', enDesc: 'Skills, tools, and resources for the OpenClaw ecosystem' },
    cursor:   { icon: '🖱️', iconUrl: 'https://www.google.com/s2/favicons?domain=cursor.com&sz=64', color: '#10b981', order: 6, zh: 'Cursor', en: 'Cursor', zhDesc: '面向 Cursor 生态的 skills、工具和资源', enDesc: 'Skills, tools, and resources for the Cursor ecosystem' },
    copilot:  { icon: '🧭', iconUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=64', color: '#0ea5e9', order: 7, zh: 'GitHub Copilot', en: 'GitHub Copilot', zhDesc: '面向 GitHub Copilot 生态的 skills、工具和资源', enDesc: 'Skills, tools, and resources for the GitHub Copilot ecosystem' },
    gemini:   { icon: '💠', iconUrl: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=64', color: '#8b5cf6', order: 8, zh: 'Gemini', en: 'Gemini', zhDesc: '面向 Gemini 生态的 skills、工具和资源', enDesc: 'Skills, tools, and resources for the Gemini ecosystem' },
    multi:    { icon: '🧩', iconUrl: '', color: '#a855f7', order: 90, zh: '多 Agent', en: 'Multi-Agent', zhDesc: '同时面向多个 Agent 生态的 skills、工具和资源', enDesc: 'Skills, tools, and resources that target multiple agent ecosystems' },
    other:    { icon: '📦', iconUrl: '', color: '#6b7280', order: 99, zh: '其他', en: 'Other', zhDesc: '暂未识别到明确 Agent 名称的 skills、工具和资源', enDesc: 'Skills, tools, and resources without a clearly detected agent name' }
  };

  const state = {
    meta: {
      title: 'Skill Hub',
      description: 'AI Agent Skills 导航站',
      lastUpdated: '',
      totalCount: 0,
      sources: null
    },
    data: [],
    categories: [],
    keyword: '',
    category: 'all',
    subgroup: null,
    sort: 'stars-desc',
    groupBy: 'none',
    viewMode: 'flat',
    page: 1,
    requestSeq: 0,
    dataVersion: 0
  };

  const dom = {};

  function parsePositiveInt(value, fallback = 1) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function readUrlState() {
    const params = new URLSearchParams(window.location.search);
    const nextState = {};
    if (params.has('category')) nextState.category = params.get('category') || 'all';
    if (params.has('group')) nextState.subgroup = params.get('group') || null;
    if (params.has('q')) nextState.keyword = params.get('q') || '';
    if (params.has('sort')) nextState.sort = params.get('sort') || 'stars-desc';
    if (params.has('view')) nextState.viewMode = params.get('view') || 'grouped';
    if (params.has('page')) nextState.page = parsePositiveInt(params.get('page'), 1);
    return nextState;
  }

  function readStoredState() {
    try {
      const raw = localStorage.getItem(STATE_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function applyPersistedState() {
    const persisted = { ...readStoredState(), ...readUrlState() };
    if (typeof persisted.keyword === 'string') state.keyword = persisted.keyword;
    if (typeof persisted.category === 'string') state.category = persisted.category || 'all';
    if (Object.prototype.hasOwnProperty.call(persisted, 'subgroup')) state.subgroup = persisted.subgroup || null;
    if (typeof persisted.sort === 'string') state.sort = persisted.sort || 'stars-desc';
    if (typeof persisted.viewMode === 'string') {
      state.viewMode = persisted.viewMode === 'flat' ? 'flat' : 'grouped';
      state.groupBy = state.viewMode === 'flat' ? 'none' : 'agent';
    }
    if (persisted.page) state.page = parsePositiveInt(persisted.page, 1);
  }

  function cacheDom() {
    ['search', 'search-clear', 'results', 'empty', 'results-count',
      'category-tabs', 'subgroup-tabs', 'category-desc', 'directory-menu',
      'stats-section', 'stats-chart', 'stats-bars',
      'pagination', 'page-info', 'page-prev', 'page-next',
      'sort-select', 'group-select', 'view-toggle'
    ].forEach(id => { dom[id] = document.getElementById(id); });
  }

  function getSkillAgent(skill) {
    return skill.agent || skill.source || 'other';
  }

  function getAgentMeta(agentId) {
    return AGENT_META[agentId] || AGENT_META.other;
  }

  function getAgentLabel(agentId) {
    const lang = hub.i18n.getLang();
    const meta = getAgentMeta(agentId);
    return lang === 'zh' ? meta.zh : meta.en;
  }

  function getAgentDesc(agentId, fallback = '') {
    const lang = hub.i18n.getLang();
    const meta = getAgentMeta(agentId);
    return lang === 'zh' ? (meta.zhDesc || fallback) : (meta.enDesc || fallback);
  }

  function getCategoryById(categoryId) {
    return state.categories.find(cat => cat.id === categoryId) || null;
  }

  function getGroupLabel(groupId) {
    const key = 'group_' + String(groupId || 'general').replace(/-/g, '_');
    return hub.i18n.t(key) || groupId;
  }

  function inferFunctionCategory(skill) {
    const text = [skill.name, skill.desc, skill.repo]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    for (const [category, keywords] of FUNCTION_CATEGORIES) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    return 'general';
  }

  function getSkillGroup(skill) {
    if (skill && skill.group) return skill.group;
    return inferFunctionCategory(skill || {});
  }

  function resetPage() {
    state.page = 1;
  }

  function selectCategory(categoryId, subgroup = null) {
    state.category = categoryId;
    state.subgroup = subgroup;
    resetPage();
  }

  function selectSubgroup(subgroupId) {
    state.subgroup = subgroupId || null;
    resetPage();
  }

  function setKeyword(keyword) {
    state.keyword = keyword.trim();
    resetPage();
  }

  function setSort(sortValue) {
    state.sort = sortValue;
    resetPage();
  }

  function setViewMode(viewMode) {
    state.viewMode = viewMode;
    state.groupBy = viewMode === 'flat' ? 'none' : 'agent';
    resetPage();
  }

  function persistState() {
    const snapshot = {
      category: state.category,
      subgroup: state.subgroup,
      keyword: state.keyword,
      sort: state.sort,
      viewMode: state.viewMode,
      page: state.page
    };

    try {
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // ignore storage failures
    }

    const params = new URLSearchParams();
    if (state.category && state.category !== 'all') params.set('category', state.category);
    if (state.subgroup) params.set('group', state.subgroup);
    if (state.keyword) params.set('q', state.keyword);
    if (state.sort && state.sort !== 'stars-desc') params.set('sort', state.sort);
    if (state.viewMode && state.viewMode !== 'grouped') params.set('view', state.viewMode);
    if (state.page > 1) params.set('page', String(state.page));

    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', nextUrl);
  }

  function normalizeStateAfterData() {
    const categoryIds = new Set(state.categories.map(cat => cat.id));
    if (state.category !== 'all' && !categoryIds.has(state.category)) {
      state.category = 'all';
      state.subgroup = null;
    }

    const activeCategory = getCategoryById(state.category);
    const groupIds = new Set((activeCategory?.groups || []).map(group => group.id));
    if (state.subgroup && !groupIds.has(state.subgroup)) {
      state.subgroup = null;
    }

    state.page = parsePositiveInt(state.page, 1);
  }

  function syncControls() {
    if (dom.search && dom.search.value !== state.keyword) {
      dom.search.value = state.keyword;
    }
    if (dom['sort-select']) dom['sort-select'].value = state.sort;
    if (dom['group-select']) dom['group-select'].value = state.viewMode === 'flat' ? 'none' : 'agent';
    if (dom['view-toggle']) dom['view-toggle'].textContent = state.viewMode === 'grouped' ? '📋' : '📊';
    if (dom['search-clear']) dom['search-clear'].classList.toggle('visible', Boolean(state.keyword));
  }

  function sortCategories(categories) {
    return (categories || []).sort((a, b) => {
      const orderA = getAgentMeta(a.id).order || 999;
      const orderB = getAgentMeta(b.id).order || 999;
      return orderA - orderB;
    });
  }

  function applyIndexData(indexData) {
    if (!indexData) return;
    if (indexData.meta) {
      state.meta = { ...state.meta, ...indexData.meta };
    }
    state.categories = sortCategories(indexData.categories);
    normalizeStateAfterData();
  }

  function applyLoadedData(data) {
    if (!data) return;
    if (data.meta) {
      state.meta = { ...state.meta, ...data.meta };
    }
    state.data = data.skills || [];
    state.dataVersion += 1;
    state.categories = sortCategories(data.categories);
    normalizeStateAfterData();
  }

  async function ensureDataForCurrentState() {
    if (!hub.data || typeof hub.data.loadForSelection !== 'function') return;

    const requestSeq = ++state.requestSeq;
    const payload = await hub.data.loadForSelection({
      category: state.category,
      subgroup: state.subgroup,
      keyword: state.keyword
    });

    if (requestSeq !== state.requestSeq) return;
    applyLoadedData(payload);
  }

  hub.state = {
    PER_PAGE,
    STAR_FMT,
    AGENT_META,
    STATE_STORAGE_KEY,
    state,
    dom,
    parsePositiveInt,
    readUrlState,
    readStoredState,
    applyPersistedState,
    cacheDom,
    getSkillAgent,
    getSkillGroup,
    getAgentMeta,
    getAgentLabel,
    getAgentDesc,
    getCategoryById,
    getGroupLabel,
    inferFunctionCategory,
    resetPage,
    selectCategory,
    selectSubgroup,
    setKeyword,
    setSort,
    setViewMode,
    persistState,
    normalizeStateAfterData,
    syncControls,
    sortCategories,
    applyIndexData,
    applyLoadedData,
    ensureDataForCurrentState
  };
})();
