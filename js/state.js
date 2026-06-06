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
    'automation-productivity': { zh: '自动化效率', en: 'Automation Productivity' },
    'backend-api': { zh: '后端 API', en: 'Backend API' },
    'data-ai': { zh: '数据 AI', en: 'Data AI' },
    'design-ui': { zh: '设计 UI', en: 'Design UI' },
    'dev-tools': { zh: '开发工具', en: 'Dev Tools' },
    'devops-deploy': { zh: '部署运维', en: 'DevOps Deploy' },
    'docs-content': { zh: '文档内容', en: 'Docs Content' },
    general: { zh: '通用', en: 'General' },
    security: { zh: '安全', en: 'Security' },
    'testing-qa': { zh: '测试质检', en: 'Testing QA' }
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
    keyword: '',
    category: 'all',
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
    if (Object.prototype.hasOwnProperty.call(persisted, 'agent')) state.agent = persisted.agent || null;
    if (typeof persisted.sort === 'string') state.sort = persisted.sort || 'stars-desc';
    if (typeof persisted.viewMode === 'string') state.viewMode = persisted.viewMode === 'grouped' ? 'grouped' : 'flat';
    if (persisted.page) state.page = parsePositiveInt(persisted.page, 1);
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

  function persistState() {
    const snapshot = {
      category: state.category,
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
      state.category = 'all';
    }

    if (state.agent) {
      const supportedAgents = new Set(state.data.flatMap((skill) => getSkillAgents(skill)));
      if (supportedAgents.size > 0 && !supportedAgents.has(state.agent) && state.category !== 'all') {
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
    if (dom['view-toggle']) dom['view-toggle'].textContent = state.viewMode === 'grouped' ? 'G' : 'F';
    if (dom['search-clear']) dom['search-clear'].classList.toggle('visible', Boolean(state.keyword));
  }

  function sortCategories(categories) {
    return (categories || []).slice().sort((left, right) => {
      if ((right.count || 0) !== (left.count || 0)) return (right.count || 0) - (left.count || 0);
      return String(left.id || '').localeCompare(String(right.id || ''));
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
    getSkillAgents,
    getPrimarySkillAgent,
    getAgentMeta,
    getAgentLabel,
    getCategoryById,
    getCategoryLabel,
    resetPage,
    selectCategory,
    setAgentFilter,
    setKeyword,
    setSort,
    setViewMode,
    persistState,
    normalizeStateAfterData,
    syncControls,
    sortCategories,
    applyIndexData,
    applyLoadedData,
    ensureDataForCurrentState,
  };
})();
