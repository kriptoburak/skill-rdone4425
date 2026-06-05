/* ==========================================
   render
   ========================================== */
(function () {
  'use strict';

  const hub = window.SkillHub = window.SkillHub || {};
  const s = hub.state;
  const { state, dom } = s;
  let filteredCacheKey = '';
  let filteredCacheValue = [];

  function renderAgentMark(agentId, className = 'agent-mark') {
    const meta = s.getAgentMeta(agentId);
    const label = s.getAgentLabel(agentId);
    if (meta.iconUrl) {
      return `<img class="${className}" src="${meta.iconUrl}" alt="${label}" loading="lazy" referrerpolicy="no-referrer">`;
    }
    return `<span class="${className} ${className}-emoji">${meta.icon || '📦'}</span>`;
  }

  function getLabelWithFallback(key, fallbackZh, fallbackEn) {
    const text = hub.i18n.t(key);
    if (text && text !== key) return text;
    return hub.i18n.getLang() === 'zh' ? fallbackZh : fallbackEn;
  }

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (!copied) throw new Error('copy_failed');
  }

  async function copyInstallText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    fallbackCopyText(text);
  }

  function getFiltered() {
    const cacheKey = [
      state.dataVersion,
      state.category,
      state.keyword,
      state.sort
    ].join('::');

    if (cacheKey === filteredCacheKey) {
      return filteredCacheValue;
    }

    let list = state.data;

    if (state.category !== 'all') {
      list = list.filter(item => s.getSkillGroup(item) === state.category);
    }
    if (state.keyword) {
      const kw = state.keyword.toLowerCase();
      list = list.filter(item =>
        String(item.searchText || '').includes(kw) ||
        item.name.toLowerCase().includes(kw) ||
        item.desc.toLowerCase().includes(kw) ||
        item.repo.toLowerCase().includes(kw)
      );
    }

    const [field, dir] = state.sort.split('-');
    const mul = dir === 'asc' ? 1 : -1;
    if (field === 'stars') {
      filteredCacheValue = [...list].sort((a, b) => (a.stars - b.stars) * mul);
    } else {
      filteredCacheValue = [...list].sort((a, b) => a.name.localeCompare(b.name) * mul);
    }

    filteredCacheKey = cacheKey;
    return filteredCacheValue;
  }

  function renderCategoryTabs() {
    const wrap = dom['category-tabs'];
    if (!wrap) return;
    wrap.innerHTML = '';

    const allTab = document.createElement('button');
    allTab.className = 'tab cat-tab' + (state.category === 'all' ? ' active' : '');
    allTab.dataset.id = 'all';
    allTab.textContent = hub.i18n.t('categoryAll');
    wrap.appendChild(allTab);

    state.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'tab cat-tab' + (state.category === cat.id ? ' active' : '');
      btn.dataset.id = cat.id;
      btn.textContent = s.getCategoryLabel(cat.id);
      wrap.appendChild(btn);
    });
  }

  function createCard(skill) {
    const agentId = s.getSkillAgent(skill);
    const meta = s.getAgentMeta(agentId);
    const color = meta.color || '#6b7280';
    const repoOwner = String(skill.repo || '').split('/')[0] || '';
    const avatarUrl = repoOwner ? `https://github.com/${repoOwner}.png?size=96` : '';
    const card = document.createElement('article');
    card.className = 'skill-card card';
    card.style.setProperty('--card-accent', color);
    card.innerHTML = `
      <div class="card-head">
        <div class="card-icon">
          ${avatarUrl
            ? `<img class="card-avatar" src="${avatarUrl}" alt="${repoOwner || skill.name}" loading="lazy" referrerpolicy="no-referrer">`
            : `<span class="card-emoji">${meta.icon || '📦'}</span>`}
        </div>
        <div class="card-title-wrap">
          <div class="card-name">${skill.name}</div>
          <div class="card-repo">
            <a href="https://github.com/${skill.repo}" target="_blank" rel="noopener">${skill.repo}</a>
            <span class="card-stars" title="${skill.stars.toLocaleString()}">⭐ ${s.STAR_FMT(skill.stars)}</span>
          </div>
        </div>
      </div>
      <p class="card-desc">${skill.desc}</p>
      <div class="card-meta">
        <span class="source-tag" style="background:${color}18;color:${color};border-color:${color}33">${renderAgentMark(agentId, 'agent-mark agent-mark-inline')} ${s.getAgentLabel(agentId)}</span>
        <span class="card-group">${s.getGroupLabel(s.getSkillGroup(skill))}</span>
      </div>
      <div class="card-install" title="${skill.install}">
        <code>$ ${skill.install}</code>
      </div>
      <div class="card-footer">
        <a class="card-link" href="https://github.com/${skill.repo}" target="_blank" rel="noopener">↗ ${hub.i18n.t('viewOnGitHub')}</a>
        <button type="button" class="copy-btn card-copy-btn" title="${getLabelWithFallback('install', '\u5b89\u88c5', 'Install')}">${getLabelWithFallback('install', '\u5b89\u88c5', 'Install')}</button>
      </div>
    `;

    const copyBtn = card.querySelector('.copy-btn');
    const installCode = String(skill.install || '').trim();
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const copiedLabel = getLabelWithFallback('installCopied', '\u5df2\u590d\u5236', 'Copied');
        const installLabel = getLabelWithFallback('install', '\u5b89\u88c5', 'Install');
        try {
          await copyInstallText(installCode);
          copyBtn.textContent = copiedLabel;
          copyBtn.classList.add('copied');
          copyBtn.title = copiedLabel;
          setTimeout(() => {
            copyBtn.textContent = installLabel;
            copyBtn.classList.remove('copied');
            copyBtn.title = installLabel;
          }, 1200);
        } catch {
          const promptLabel = hub.i18n.getLang() === 'zh'
            ? '\u8bf7\u624b\u52a8\u590d\u5236\u5b89\u88c5\u547d\u4ee4'
            : 'Copy the install command manually';
          window.prompt(promptLabel, installCode);
          copyBtn.textContent = installLabel;
          copyBtn.classList.remove('copied');
          copyBtn.title = installLabel;
        }
      });
    }

    return card;
  }

  function renderHeaderStats() {
    const wrap = document.getElementById('stats');
    if (!wrap) return;

    const skills = state.meta.totalCount || state.data.length;
    const agents = state.categories.length;
    const repos = state.meta.sources || new Set(state.data.map(item => item.repo)).size;

    wrap.innerHTML = `
      <span class="stat-pill"><strong>${skills}</strong><span>${hub.i18n.t('skills')}</span></span>
      <span class="stat-pill"><strong>${agents}</strong><span>${hub.i18n.t('categoriesLabel')}</span></span>
      <span class="stat-pill"><strong>${repos}</strong><span>${hub.i18n.t('reposLabel')}</span></span>
    `;
  }

  function renderGroupedView(list) {
    if (state.category === 'all') {
      const grouped = {};
      list.forEach(skill => {
        const groupId = s.getSkillGroup(skill);
        if (!grouped[groupId]) grouped[groupId] = [];
        grouped[groupId].push(skill);
      });

      const container = document.createDocumentFragment();
      state.categories.forEach(category => {
        const skills = grouped[category.id];
        if (!skills || skills.length === 0) return;

        const section = document.createElement('section');
        section.className = 'agent-section';
        section.style.setProperty('--agent-color', 'var(--accent)');

        const header = document.createElement('div');
        header.className = 'agent-header';
        header.innerHTML = `
          <div class="agent-header-left">
            <h2 class="agent-title">${s.getCategoryLabel(category.id)}</h2>
            <span class="agent-count">${skills.length} ${hub.i18n.t('skills')}</span>
          </div>
          <span class="agent-toggle">▼</span>
        `;

        const content = document.createElement('div');
        content.className = 'agent-content';

        const grid = document.createElement('div');
        grid.className = 'card-grid';
        skills.forEach(skill => grid.appendChild(createCard(skill)));
        content.appendChild(grid);

        section.appendChild(header);
        section.appendChild(content);
        container.appendChild(section);

        header.addEventListener('click', () => {
          section.classList.toggle('collapsed');
        });
      });

      return container;
    }

    const grouped = {};
    list.forEach(skill => {
      const agent = s.getSkillAgent(skill);
      if (!grouped[agent]) grouped[agent] = [];
      grouped[agent].push(skill);
    });

    const agentKeys = Object.keys(grouped).sort((a, b) => (s.AGENT_META[a]?.order || 99) - (s.AGENT_META[b]?.order || 99));
    const container = document.createDocumentFragment();

    agentKeys.forEach(agent => {
      const meta = s.getAgentMeta(agent);
      const skills = grouped[agent];
      const section = document.createElement('section');
      section.className = 'agent-section';
      section.style.setProperty('--agent-color', meta.color || '#6b7280');

      const header = document.createElement('div');
      header.className = 'agent-header';
      header.innerHTML = `
        <div class="agent-header-left">
          ${renderAgentMark(agent, 'agent-mark agent-mark-sm')}
          <h2 class="agent-title">${s.getAgentLabel(agent)}</h2>
          <span class="agent-count">${skills.length} ${hub.i18n.t('skills')}</span>
        </div>
        <span class="agent-toggle">▼</span>
      `;

      const content = document.createElement('div');
      content.className = 'agent-content';

      const grid = document.createElement('div');
      grid.className = 'card-grid';
      skills.forEach(skill => grid.appendChild(createCard(skill)));
      content.appendChild(grid);

      section.appendChild(header);
      section.appendChild(content);
      container.appendChild(section);

      header.addEventListener('click', () => {
        section.classList.toggle('collapsed');
      });
    });

    return container;
  }

  function renderFlatView(list) {
    const container = document.createDocumentFragment();
    list.forEach(skill => container.appendChild(createCard(skill)));
    return container;
  }

  function renderStats() {
    if (!dom['stats-section']) return;

    const byAgent = {};
    state.data.forEach(skill => {
      const agentId = s.getSkillAgent(skill);
      byAgent[agentId] = (byAgent[agentId] || 0) + 1;
    });

    const sortedSources = Object.entries(byAgent).sort((a, b) => b[1] - a[1]);
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

      table.innerHTML = sortedSources.map(([src, count]) => {
        const pct = (count / state.data.length * 100).toFixed(1);
        const meta = s.getAgentMeta(src);
        return `<div class="stats-row">
          <span class="stats-label">${renderAgentMark(src, 'agent-mark agent-mark-xs')} ${s.getAgentLabel(src)}</span>
          <div class="stats-bar-bg">
            <div class="stats-bar-fill" style="width:${pct}%;background:${meta.color || '#6366f1'}"></div>
          </div>
          <span class="stats-count">${count} (${pct}%)</span>
        </div>`;
      }).join('');
    }

    const repoMap = {};
    state.data.forEach(skill => {
      repoMap[skill.repo] = (repoMap[skill.repo] || 0) + 1;
    });
    const topRepos = Object.entries(repoMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const maxCount = topRepos.length > 0 ? topRepos[0][1] : 1;

    if (dom['stats-bars']) {
      dom['stats-bars'].innerHTML = topRepos.map(([repo, count]) => {
        const pct = (count / maxCount * 100).toFixed(1);
        return `<div class="stats-row">
          <a class="stats-label link" href="https://github.com/${repo}" target="_blank">${repo.split('/')[1] || repo}</a>
          <div class="stats-bar-bg">
            <div class="stats-bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="stats-count">${count}</span>
        </div>`;
      }).join('');
    }
  }

  function renderPagination(totalPages) {
    const nav = dom['pagination'];
    if (!nav) return;
    nav.hidden = totalPages <= 1;
    if (totalPages <= 1) return;
    if (dom['page-info']) dom['page-info'].textContent = `${state.page} / ${totalPages}`;
    if (dom['page-prev']) dom['page-prev'].disabled = state.page <= 1;
    if (dom['page-next']) dom['page-next'].disabled = state.page >= totalPages;
  }

  function render() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / s.PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * s.PER_PAGE;
    const pageData = filtered.slice(start, start + s.PER_PAGE);
    const results = dom.results;
    if (results) {
      results.innerHTML = '';
      results.className = state.viewMode === 'flat' ? 'results card-grid' : 'results results-grouped';
      if (state.viewMode === 'grouped') {
        results.appendChild(renderGroupedView(filtered));
        renderPagination(1);
      } else {
        results.appendChild(renderFlatView(pageData));
        renderPagination(totalPages);
      }
    }

    if (dom.empty) dom.empty.hidden = filtered.length > 0;
    if (dom['results-count']) {
      dom['results-count'].textContent = (state.keyword || state.category !== 'all')
        ? hub.i18n.t('resultsCountFiltered').replace('{count}', filtered.length).replace('{total}', state.data.length)
        : hub.i18n.t('resultsCount').replace('{count}', state.data.length);
    }
  }

  function renderFilters() {
    renderCategoryTabs();
  }

  function renderListOnly() {
    s.syncControls();
    render();
    s.persistState();
  }

  function renderFilterChrome() {
    s.syncControls();
    renderFilters();
    render();
    s.persistState();
  }

  function renderAll() {
    s.syncControls();
    renderHeaderStats();
    renderFilters();
    renderStats();
    render();
    s.persistState();
  }

  hub.render = {
    getFiltered,
    renderCategoryTabs,
    createCard,
    renderGroupedView,
    renderFlatView,
    renderStats,
    renderPagination,
    render,
    renderFilters,
    renderListOnly,
    renderFilterChrome,
    renderAll
  };
})();
