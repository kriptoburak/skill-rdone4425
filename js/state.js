/* ==========================================
   state
   ========================================== */
(function () {
  'use strict';

  const hub = window.SkillHub = window.SkillHub || {};

  const PER_PAGE = 24;
  const STATE_STORAGE_KEY = 'skill-hub.view-state';
  const STAR_FMT = (value) => value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k` : value.toLocaleString();

  const CATEGORY_LABELS = {
    automation: { zh: '\u81ea\u52a8\u5316', en: 'Automation' },
    'automation-productivity': { zh: '\u81ea\u52a8\u5316\u6548\u7387', en: 'Automation Productivity' },
    productivity: { zh: '\u6548\u7387', en: 'Productivity' },
    workflow: { zh: '\u5de5\u4f5c\u6d41', en: 'Workflow' },
    ops: { zh: '\u8fd0\u8425\u589e\u957f', en: 'Growth Ops' },
    office: { zh: '\u529e\u516c\u534f\u4f5c', en: 'Office Ops' },
    publishing: { zh: '\u53d1\u5e03\u5206\u53d1', en: 'Publishing' },
    backend: { zh: '\u540e\u7aef', en: 'Backend' },
    'backend-api': { zh: '\u540e\u7aef API', en: 'Backend API' },
    api: { zh: 'API', en: 'API' },
    database: { zh: '\u6570\u636e\u5e93', en: 'Database' },
    integration: { zh: '\u7cfb\u7edf\u96c6\u6210', en: 'Integrations' },
    data: { zh: '\u6570\u636e\u4e0e AI', en: 'Data & AI' },
    'data-ai': { zh: '\u6570\u636e AI', en: 'Data AI' },
    ai: { zh: 'AI', en: 'AI' },
    research: { zh: '\u7814\u7a76\u5206\u6790', en: 'Research' },
    memory: { zh: '\u8bb0\u5fc6\u4e0e\u77e5\u8bc6\u5e93', en: 'Memory & Knowledge' },
    models: { zh: '\u6a21\u578b\u80fd\u529b', en: 'Model Capabilities' },
    analytics: { zh: '\u6570\u636e\u5206\u6790', en: 'Analytics' },
    design: { zh: '\u8bbe\u8ba1', en: 'Design' },
    'design-ui': { zh: '\u8bbe\u8ba1 UI', en: 'Design UI' },
    ui: { zh: 'UI / \u524d\u7aef\u8bbe\u8ba1', en: 'UI / Frontend' },
    figma: { zh: 'Figma / \u8bbe\u8ba1\u7cfb\u7edf', en: 'Figma / Design Systems' },
    deck: { zh: 'PPT / \u6392\u7248', en: 'Slides / Layout' },
    visual: { zh: '\u54c1\u724c / \u89c6\u89c9\u98ce\u683c', en: 'Brand / Visual' },
    media: { zh: '\u56fe\u50cf / \u89c6\u9891', en: 'Media Generation' },
    development: { zh: '\u5f00\u53d1', en: 'Development' },
    'dev-tools': { zh: '\u5f00\u53d1\u5de5\u5177', en: 'Dev Tools' },
    tools: { zh: '\u5de5\u5177', en: 'Tools' },
    coding: { zh: '\u7f16\u7801\u6280\u80fd', en: 'Coding Skills' },
    plugins: { zh: '\u63d2\u4ef6 / \u6269\u5c55', en: 'Plugins' },
    agents: { zh: 'Agent \u6846\u67b6', en: 'Agent Frameworks' },
    tooling: { zh: '\u5f00\u53d1\u5de5\u5177', en: 'Developer Tools' },
    platforms: { zh: '\u6280\u80fd\u5e73\u53f0 / \u5e02\u573a', en: 'Skill Platforms' },
    devops: { zh: '\u90e8\u7f72\u8fd0\u7ef4', en: 'DevOps' },
    'devops-deploy': { zh: '\u90e8\u7f72\u8fd0\u7ef4', en: 'DevOps Deploy' },
    deploy: { zh: '\u90e8\u7f72', en: 'Deploy' },
    infra: { zh: '\u57fa\u7840\u8bbe\u65bd', en: 'Infrastructure' },
    ci: { zh: 'CI / CD', en: 'CI / CD' },
    docs: { zh: '\u6587\u6863\u5185\u5bb9', en: 'Docs' },
    'docs-content': { zh: '\u6587\u6863\u5185\u5bb9', en: 'Docs Content' },
    content: { zh: '\u5185\u5bb9', en: 'Content' },
    awesome: { zh: '\u7cbe\u9009\u5217\u8868', en: 'Awesome Lists' },
    guides: { zh: '\u6307\u5357\u6559\u7a0b', en: 'Guides' },
    libraries: { zh: '\u8d44\u6599\u5e93', en: 'Knowledge Libraries' },
    references: { zh: '\u53c2\u8003\u8d44\u6599', en: 'References' },
    general: { zh: '\u901a\u7528', en: 'General' },
    security: { zh: '\u5b89\u5168', en: 'Security' },
    offensive: { zh: '\u653b\u9632 / \u6e17\u900f', en: 'Offensive Security' },
    defensive: { zh: '\u9632\u62a4 / \u5ba1\u8ba1', en: 'Defensive Security' },
    governance: { zh: '\u5408\u89c4\u6cbb\u7406', en: 'Governance / GRC' },
    testing: { zh: '\u6d4b\u8bd5\u8d28\u68c0', en: 'Testing' },
    'testing-qa': { zh: '\u6d4b\u8bd5\u8d28\u68c0', en: 'Testing QA' },
    browser: { zh: '\u6d4f\u89c8\u5668\u6d4b\u8bd5', en: 'Browser Testing' },
    review: { zh: '\u8bc4\u5ba1\u9a8c\u8bc1', en: 'Review / Validation' },
    qa: { zh: 'QA', en: 'QA' }
  };
  const AGENT_META = {
    codex: { icon: 'C', iconUrl: 'https://www.google.com/s2/favicons?domain=openai.com&sz=64', color: '#6366f1', order: 1, zh: 'Codex', en: 'Codex' },
    claude: { icon: 'A', iconUrl: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=64', color: '#fb923c', order: 2, zh: 'Claude Code', en: 'Claude Code' },
    hermes: { icon: 'H', iconUrl: 'https://www.google.com/s2/favicons?domain=nousresearch.com&sz=64', color: '#06b6d4', order: 3, zh: 'Hermes Agent', en: 'Hermes Agent' },
    opencode: { icon: 'O', iconUrl: 'https://www.google.com/s2/favicons?domain=opencode.ai&sz=64', color: '#22c55e', order: 4, zh: 'OpenCode', en: 'OpenCode' },
    openclaw: { icon: 'O', iconUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=64', color: '#f97316', order: 5, zh: 'OpenClaw', en: 'OpenClaw' },
    cursor: { icon: 'C', iconUrl: 'https://www.google.com/s2/favicons?domain=cursor.com&sz=64', color: '#10b981', order: 6, zh: 'Cursor', en: 'Cursor' },
    copilot: { icon: 'G', iconUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=64', color: '#0ea5e9', order: 7, zh: 'GitHub Copilot', en: 'GitHub Copilot' },
    gemini: { icon: 'G', iconUrl: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=64', color: '#8b5cf6', order: 8, zh: 'Gemini', en: 'Gemini' },
    other: { icon: '?', iconUrl: '', color: '#6b7280', order: 99, zh: 'Other', en: 'Other' },
  };

  const state = {
    meta: {
      title: 'Skill Hub',
      description: 'AI agent skill directory',
      lastUpdated: '',
      totalCount: 0,
      sources: 0,
      categoryCount: 0,
      platformCount: 0,
    },
    data: [],
    categories: [],
    subcategories: [],
    leafCategories: [],
    keyword: '',
    category: 'all',
    subcategory: null,
    expandedCategory: null,
    agent: null,
    sort: 'stars-desc',
    viewMode: 'flat',
    page: 1,
    requestSeq: 0,
    dataVersion: 0,
  };

  const dom = {};

  function parsePositiveInt(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function readUrlState() {
    const params = new URLSearchParams(window.location.search);
    const nextState = {};
    if (params.has('category')) nextState.category = params.get('category') || 'all';
    if (params.has('sub')) nextState.subcategory = params.get('sub') || null;
    if (params.has('agent')) nextState.agent = params.get('agent') || null;
    if (params.has('q')) nextState.keyword = params.get('q') || '';
    if (params.has('sort')) nextState.sort = params.get('sort') || 'stars-desc';
    if (params.has('view')) nextState.viewMode = params.get('view') || 'flat';
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
    if (Object.prototype.hasOwnProperty.call(persisted, 'subcategory')) state.subcategory = persisted.subcategory || null;
    if (Object.prototype.hasOwnProperty.call(persisted, 'expandedCategory')) state.expandedCategory = persisted.expandedCategory || null;
    if (Object.prototype.hasOwnProperty.call(persisted, 'agent')) state.agent = persisted.agent || null;
    if (typeof persisted.sort === 'string') state.sort = persisted.sort || 'stars-desc';
    if (typeof persisted.viewMode === 'string') state.viewMode = persisted.viewMode === 'grouped' ? 'grouped' : 'flat';
    if (persisted.page) state.page = parsePositiveInt(persisted.page, 1);
    if (!state.expandedCategory && state.category && state.category !== 'all') state.expandedCategory = state.category;
  }

  function cacheDom() {
    [
      'search', 'search-clear', 'results', 'empty', 'results-count',
      'category-tabs', 'subgroup-tabs', 'category-desc',
      'pagination', 'page-info', 'page-prev', 'page-next',
      'sort-select', 'view-toggle',
    ].forEach((id) => {
      dom[id] = document.getElementById(id);
    });
  }

  function getSkillCategory(skill) {
    return String(skill.functionCategory || 'general');
  }

  function getSkillTopCategory(skill) {
    return String(skill.topCategoryId || getSkillCategory(skill) || 'general');
  }

  function getSkillSubcategory(skill) {
    return String(skill.subCategoryId || getSkillCategory(skill) || 'general');
  }

  function getSkillAgents(skill) {
    return Array.isArray(skill.supportedAgents) && skill.supportedAgents.length > 0
      ? skill.supportedAgents
      : ['other'];
  }

  function getPrimarySkillAgent(skill) {
    return getSkillAgents(skill)[0] || 'other';
  }

  function getAgentMeta(agentId) {
    return AGENT_META[agentId] || AGENT_META.other;
  }

  function getAgentLabel(agentId) {
    const lang = hub.i18n.getLang();
    const meta = getAgentMeta(agentId);
    return lang === 'zh' ? meta.zh : meta.en;
  }

  function getCategoryById(categoryId) {
    return state.categories.find((category) => category.id === categoryId) || null;
  }

  function getSubcategoryById(subcategoryId) {
    return state.subcategories.find((category) => category.subcategoryId === subcategoryId || category.id === subcategoryId) || null;
  }

  function getCategoryLabel(categoryId) {
    const normalized = String(categoryId || 'general');
    const lang = hub.i18n.getLang();
    const meta = CATEGORY_LABELS[normalized];
    if (meta) {
      return lang === 'zh' ? meta.zh : meta.en;
    }
    return normalized;
  }

  function resetPage() {
    state.page = 1;
  }

  function selectCategory(categoryId) {
    state.category = categoryId || 'all';
    state.subcategory = null;
    state.expandedCategory = state.category === 'all' ? null : state.category;
    state.subcategories = state.category === 'all'
      ? []
      : sortSubcategories(getCategoryById(state.category)?.subcategories || []);
    resetPage();
  }

  function selectSubcategory(subcategoryId) {
    state.subcategory = subcategoryId || null;
    if (state.category && state.category !== 'all') state.expandedCategory = state.category;
    resetPage();
  }

  function setAgentFilter(agentId) {
    state.agent = agentId || null;
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
    state.viewMode = viewMode === 'grouped' ? 'grouped' : 'flat';
    resetPage();
  }

  function toggleExpandedCategory(categoryId) {
    const nextId = categoryId || null;
    state.expandedCategory = state.expandedCategory === nextId ? null : nextId;
  }

  function persistState() {
    const snapshot = {
      category: state.category,
      subcategory: state.subcategory,
      expandedCategory: state.expandedCategory,
      agent: state.agent,
      keyword: state.keyword,
      sort: state.sort,
      viewMode: state.viewMode,
      page: state.page,
    };

    try {
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // ignore storage failures
    }

    const params = new URLSearchParams();
    if (state.category && state.category !== 'all') params.set('category', state.category);
    if (state.category && state.category !== 'all' && state.subcategory) params.set('sub', state.subcategory);
    if (state.agent) params.set('agent', state.agent);
    if (state.keyword) params.set('q', state.keyword);
    if (state.sort && state.sort !== 'stars-desc') params.set('sort', state.sort);
    if (state.viewMode && state.viewMode !== 'flat') params.set('view', state.viewMode);
    if (state.page > 1) params.set('page', String(state.page));

    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', nextUrl);
  }

  function normalizeStateAfterData() {
    const categoryIds = new Set(state.categories.map((category) => category.id));
    if (state.category !== 'all' && !categoryIds.has(state.category)) {
      const legacyLeaf = state.leafCategories.find((category) => category.id === state.category || category.path === state.category);
      if (legacyLeaf) {
        state.category = legacyLeaf.groupId;
        state.subcategory = legacyLeaf.subcategoryId;
      } else {
        state.category = 'all';
        state.subcategory = null;
      }
    }

    state.subcategories = state.category === 'all'
      ? []
      : sortSubcategories(getCategoryById(state.category)?.subcategories || []);

    const expandedCategoryIds = new Set(state.categories.map((category) => category.id));
    if (state.expandedCategory && !expandedCategoryIds.has(state.expandedCategory)) {
      state.expandedCategory = state.category !== 'all' ? state.category : null;
    }

    if (state.subcategory) {
      if (state.category !== 'all') state.expandedCategory = state.category;
      const subcategoryIds = new Set(state.subcategories.map((category) => category.subcategoryId || category.id));
      if (!subcategoryIds.has(state.subcategory)) {
        state.subcategory = null;
      }
    }

    if (state.agent) {
      const supportedAgents = new Set(state.data.flatMap((skill) => getSkillAgents(skill)));
      if (supportedAgents.size > 0 && !supportedAgents.has(state.agent)) {
        state.agent = null;
      }
    }

    state.page = parsePositiveInt(state.page, 1);
  }

  function syncControls() {
    if (dom.search && dom.search.value !== state.keyword) {
      dom.search.value = state.keyword;
    }
    if (dom['sort-select']) dom['sort-select'].value = state.sort;
    if (dom['view-toggle']) {
      const grouped = state.viewMode === 'grouped';
      const label = hub.i18n.t(grouped ? 'viewModeGrouped' : 'viewModeFlat');
      const nextTitle = hub.i18n.t(grouped ? 'viewModeSwitchToFlat' : 'viewModeSwitchToGrouped');
      dom['view-toggle'].innerHTML = `
        <span class="view-toggle-icon" aria-hidden="true">${grouped ? '☷' : '◫'}</span>
        <span class="view-toggle-text">${label}</span>
      `;
      dom['view-toggle'].title = nextTitle;
      dom['view-toggle'].setAttribute('aria-label', nextTitle);
    }
    if (dom['search-clear']) dom['search-clear'].classList.toggle('visible', Boolean(state.keyword));
  }

  function sortCategories(categories) {
    return (categories || []).slice().sort((left, right) => {
      if ((right.count || 0) !== (left.count || 0)) return (right.count || 0) - (left.count || 0);
      return String(left.id || '').localeCompare(String(right.id || ''));
    });
  }

  function sortSubcategories(categories) {
    return (categories || []).slice().sort((left, right) => {
      if ((right.count || 0) !== (left.count || 0)) return (right.count || 0) - (left.count || 0);
      return String(left.subcategoryId || left.id || '').localeCompare(String(right.subcategoryId || right.id || ''));
    });
  }

  function applyIndexData(indexData) {
    if (!indexData) return;
    if (indexData.meta) {
      state.meta = { ...state.meta, ...indexData.meta };
    }
    state.categories = sortCategories(indexData.categories);
    state.leafCategories = indexData.leafCategories || [];
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
    state.subcategories = sortSubcategories(data.subcategories || []);
    normalizeStateAfterData();
  }

  async function ensureDataForCurrentState() {
    if (!hub.data || typeof hub.data.loadForSelection !== 'function') return;

    const requestSeq = ++state.requestSeq;
    const payload = await hub.data.loadForSelection({
      category: state.category,
      subcategory: state.subcategory,
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
    getSkillCategory,
    getSkillTopCategory,
    getSkillSubcategory,
    getSkillAgents,
    getPrimarySkillAgent,
    getAgentMeta,
    getAgentLabel,
    getCategoryById,
    getSubcategoryById,
    getCategoryLabel,
    resetPage,
    selectCategory,
    selectSubcategory,
    toggleExpandedCategory,
    setAgentFilter,
    setKeyword,
    setSort,
    setViewMode,
    persistState,
    normalizeStateAfterData,
    syncControls,
    sortCategories,
    sortSubcategories,
    applyIndexData,
    applyLoadedData,
    ensureDataForCurrentState,
  };
})();
