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
        timer = setTimeout(async () => {
          s.setKeyword(search.value);
          await s.ensureDataForCurrentState();
          r.renderListOnly();
        }, 250);
      });
    }

    if (dom['search-clear']) {
      dom['search-clear'].addEventListener('click', async () => {
        if (dom.search) dom.search.value = '';
        s.setKeyword('');
        await s.ensureDataForCurrentState();
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

    if (dom['group-select']) {
      dom['group-select'].addEventListener('change', () => {
        s.setViewMode(dom['group-select'].value === 'none' ? 'flat' : 'grouped');
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
      dom['category-tabs'].addEventListener('click', async (e) => {
        const btn = e.target.closest('.cat-tab');
        if (!btn) return;
        s.selectCategory(btn.dataset.id);
        await s.ensureDataForCurrentState();
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
    const langBtn = document.getElementById('lang-btn');
    if (!langBtn) return;
    langBtn.addEventListener('click', () => {
      hub.i18n.setLang(hub.i18n.getLang() === 'zh' ? 'en' : 'zh');
      setTimeout(() => r.renderAll(), 50);
    });
  }

  function setupHistoryListener() {
    window.addEventListener('popstate', async () => {
      const next = { ...s.readStoredState(), ...s.readUrlState() };
      if (typeof next.keyword === 'string') state.keyword = next.keyword;
      if (typeof next.category === 'string') state.category = next.category || 'all';
      if (typeof next.sort === 'string') state.sort = next.sort || 'stars-desc';
      if (typeof next.viewMode === 'string') {
        state.viewMode = next.viewMode === 'flat' ? 'flat' : 'grouped';
        state.groupBy = state.viewMode === 'flat' ? 'none' : 'agent';
      }
      state.page = s.parsePositiveInt(next.page, 1);
      await s.ensureDataForCurrentState();
      r.renderAll();
    });
  }

  hub.events = {
    bindEvents,
    setupI18nListener,
    setupHistoryListener
  };
})();
