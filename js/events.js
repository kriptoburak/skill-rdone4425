/* ==========================================
   events
   ========================================== */
(function () {
  'use strict';

  const hub = window.SkillHub = window.SkillHub || {};
  const s = hub.state;
  const r = hub.render;
  const { state, dom } = s;

  function bindEvents() {
    const search = dom.search;
    if (search) {
      let timer = null;
      search.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          s.setKeyword(search.value);
          r.renderListOnly();
        }, 250);
      });
    }

    if (dom['search-clear']) {
      dom['search-clear'].addEventListener('click', () => {
        if (dom.search) dom.search.value = '';
        s.setKeyword('');
        r.renderListOnly();
        if (dom.search) dom.search.focus();
      });
    }

    if (dom['sort-select']) {
      dom['sort-select'].addEventListener('change', () => {
        s.setSort(dom['sort-select'].value);
        r.renderListOnly();
      });
    }

    if (dom['view-toggle']) {
      dom['view-toggle'].addEventListener('click', () => {
        s.setViewMode(state.viewMode === 'grouped' ? 'flat' : 'grouped');
        r.renderListOnly();
      });
    }

    if (dom['category-tabs']) {
      dom['category-tabs'].addEventListener('click', async (event) => {
        const expandButton = event.target.closest('.cat-expand');
        if (expandButton) {
          event.preventDefault();
          event.stopPropagation();
          s.toggleExpandedCategory(expandButton.dataset.expandId || null);
          r.renderFilterChrome();
          return;
        }

        const subgroupButton = event.target.closest('.subgroup-tab');
        if (subgroupButton) {
          event.preventDefault();
          s.selectSubcategory(subgroupButton.dataset.subcategoryId || null);
          await s.ensureDataForCurrentState();
          r.renderAll();
          return;
        }

        const button = event.target.closest('.cat-tab');
        if (!button || button.closest('.subgroup-tabs-inline')) return;
        event.preventDefault();
        s.selectCategory(button.dataset.id);
        await s.ensureDataForCurrentState();
        r.renderAll();
      });
    }

    if (dom['subgroup-tabs']) {
      dom['subgroup-tabs'].addEventListener('click', async (event) => {
        const button = event.target.closest('[data-subcategory-id]');
        if (!button) return;
        s.selectSubcategory(button.dataset.subcategoryId || null);
        await s.ensureDataForCurrentState();
        r.renderAll();
      });
    }

    if (dom.results) {
      dom.results.addEventListener('click', (event) => {
        const agentButton = event.target.closest('[data-agent-id]');
        if (agentButton) {
          const nextAgent = agentButton.dataset.agentId;
          s.setAgentFilter(state.agent === nextAgent ? null : nextAgent);
          r.renderAll();
          return;
        }
      });
    }

    if (dom['category-desc']) {
      dom['category-desc'].addEventListener('click', (event) => {
        const clearButton = event.target.closest('[data-clear-agent]');
        if (!clearButton) return;
        s.setAgentFilter(null);
        r.renderAll();
      });
    }

    if (dom['page-prev']) {
      dom['page-prev'].addEventListener('click', () => {
        if (state.page > 1) {
          state.page -= 1;
          r.renderListOnly();
        }
      });
    }

    if (dom['page-next']) {
      dom['page-next'].addEventListener('click', () => {
        state.page += 1;
        r.renderListOnly();
      });
    }
  }

  function setupI18nListener() {
    const langButton = document.getElementById('lang-btn');
    if (!langButton) return;
    langButton.addEventListener('click', () => {
      hub.i18n.setLang(hub.i18n.getLang() === 'zh' ? 'en' : 'zh');
      setTimeout(() => r.renderAll(), 50);
    });
  }

  function setupHistoryListener() {
    window.addEventListener('popstate', async () => {
      const next = { ...s.readStoredState(), ...s.readUrlState() };
      if (typeof next.keyword === 'string') state.keyword = next.keyword;
      if (typeof next.category === 'string') state.category = next.category || 'all';
      state.subcategory = Object.prototype.hasOwnProperty.call(next, 'subcategory') ? (next.subcategory || null) : null;
      state.expandedCategory = Object.prototype.hasOwnProperty.call(next, 'expandedCategory') ? (next.expandedCategory || null) : (state.category !== 'all' ? state.category : null);
      state.agent = Object.prototype.hasOwnProperty.call(next, 'agent') ? (next.agent || null) : null;
      if (typeof next.sort === 'string') state.sort = next.sort || 'stars-desc';
      if (typeof next.viewMode === 'string') state.viewMode = next.viewMode === 'grouped' ? 'grouped' : 'flat';
      state.page = s.parsePositiveInt(next.page, 1);
      await s.ensureDataForCurrentState();
      r.renderAll();
    });
  }

  hub.events = {
    bindEvents,
    setupI18nListener,
    setupHistoryListener,
  };
})();
