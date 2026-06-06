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

  function renderAgentMark(agentId, className) {
    const meta = s.getAgentMeta(agentId);
    const label = s.getAgentLabel(agentId);
    if (meta.iconUrl) {
      return `<img class="${className}" src="${meta.iconUrl}" alt="${label}" loading="lazy" referrerpolicy="no-referrer">`;
    }
    return `<span class="${className} ${className}-emoji">${meta.icon || '?'}</span>`;
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
      state.agent || '',
      state.keyword,
      state.sort,
    ].join('::');

    if (cacheKey === filteredCacheKey) {
      return filteredCacheValue;
    }

    let list = state.data;

    if (state.category !== 'all') {
      list = list.filter((item) => s.getSkillCategory(item) === state.category);
    }
    if (state.agent) {
      list = list.filter((item) => s.getSkillAgents(item).includes(state.agent));
    }
    if (state.keyword) {
      const keyword = state.keyword.toLowerCase();
      list = list.filter((item) =>
        String(item.searchText || '').includes(keyword) ||
        String(item.name || '').toLowerCase().includes(keyword) ||
        String(item.desc || '').toLowerCase().includes(keyword) ||
        String(item.repo || '').toLowerCase().includes(keyword),
      );
    }

    const [field, dir] = state.sort.split('-');
    const multiplier = dir === 'asc' ? 1 : -1;
    if (field === 'stars') {
      filteredCacheValue = [...list].sort((left, right) => (left.stars - right.stars) * multiplier);
    } else {
      filteredCacheValue = [...list].sort((left, right) => String(left.name || '').localeCompare(String(right.name || '')) * multiplier);
    }

    filteredCacheKey = cacheKey;
    return filteredCacheValue;
  }

  function renderCategoryTabs() {
    const wrap = dom['category-tabs'];
    if (!wrap) return;
    wrap.innerHTML = '';

    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.className = `cat-tab${state.category === 'all' ? ' active' : ''}`;
    allButton.dataset.id = 'all';
    allButton.innerHTML = `
      <span class="cat-tab-label">${hub.i18n.t('categoryAll')}</span>
      <span class="cat-tab-count">${state.meta.totalCount || state.data.length}</span>
    `;
    wrap.appendChild(allButton);

    state.categories.forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `cat-tab${state.category === category.id ? ' active' : ''}`;
      button.dataset.id = category.id;
      button.innerHTML = `
        <span class="cat-tab-label">${s.getCategoryLabel(category.id)}</span>
        <span class="cat-tab-count">${category.count || 0}</span>
      `;
      wrap.appendChild(button);
    });
  }

  function renderSubgroupTabs() {
    const wrap = dom['subgroup-tabs'];
    if (!wrap) return;
    wrap.hidden = true;
    wrap.innerHTML = '';
  }

  function renderCategoryDesc() {
    const element = dom['category-desc'];
    if (!element) return;

    const parts = [];
    if (state.category === 'all') {
      parts.push(hub.i18n.t('categoryAllDesc'));
    } else {
      parts.push(`${hub.i18n.t('activeCategory')}: ${s.getCategoryLabel(state.category)}`);
    }

    if (state.agent) {
      parts.push(`${hub.i18n.t('activePlatform')}: ${s.getAgentLabel(state.agent)}`);
    }

    const clearAgent = state.agent
      ? `<button type="button" class="filter-inline-btn" data-clear-agent="1">${hub.i18n.t('clearPlatformFilter')}</button>`
      : '';

    element.hidden = false;
    element.innerHTML = `
      <div class="filter-summary">
        <span>${parts.join(' · ')}</span>
        ${clearAgent}
      </div>
    `;
  }

  function createAgentChip(agentId) {
    const meta = s.getAgentMeta(agentId);
    const active = state.agent === agentId;
    return `
      <button
        type="button"
        class="agent-filter-chip${active ? ' active' : ''}"
        data-agent-id="${agentId}"
        style="--agent-chip:${meta.color || '#6b7280'}"
        title="${s.getAgentLabel(agentId)}"
      >
        ${renderAgentMark(agentId, 'agent-mark agent-mark-inline')}
        <span>${s.getAgentLabel(agentId)}</span>
      </button>
    `;
  }

  function createCard(skill) {
    const primaryAgentId = s.getPrimarySkillAgent(skill);
    const primaryMeta = s.getAgentMeta(primaryAgentId);
    const repoOwner = String(skill.repo || '').split('/')[0] || '';
    const avatarUrl = repoOwner ? `https://github.com/${repoOwner}.png?size=96` : '';
    const card = document.createElement('article');
    card.className = 'skill-card card';
    card.style.setProperty('--card-accent', primaryMeta.color || '#6b7280');
    card.innerHTML = `
      <div class="card-head">
        <div class="card-icon">
          ${avatarUrl
            ? `<img class="card-avatar" src="${avatarUrl}" alt="${repoOwner || skill.name}" loading="lazy" referrerpolicy="no-referrer">`
            : `<span class="card-emoji">${primaryMeta.icon || '?'}</span>`}
        </div>
        <div class="card-title-wrap">
          <div class="card-name">${skill.name}</div>
          <div class="card-repo">
            <a href="https://github.com/${skill.repo}" target="_blank" rel="noopener">${skill.repo}</a>
            <span class="card-stars" title="${Number(skill.stars || 0).toLocaleString()}">★ ${s.STAR_FMT(Number(skill.stars || 0))}</span>
          </div>
        </div>
      </div>
      <p class="card-desc">${skill.desc || ''}</p>
      <div class="card-meta">
        <span class="card-group">${s.getCategoryLabel(s.getSkillCategory(skill))}</span>
      </div>
      <div class="agent-chip-list">
        ${s.getSkillAgents(skill).map(createAgentChip).join('')}
      </div>
      <div class="card-install" title="${skill.install || ''}">
        <code>$ ${skill.install || ''}</code>
      </div>
      <div class="card-footer">
        <a class="card-link" href="https://github.com/${skill.repo}" target="_blank" rel="noopener">${hub.i18n.t('viewOnGitHub')}</a>
        <button type="button" class="copy-btn card-copy-btn" title="${getLabelWithFallback('install', '安装', 'Install')}">${getLabelWithFallback('install', '安装', 'Install')}</button>
      </div>
    `;

    const copyButton = card.querySelector('.copy-btn');
    const installCode = String(skill.install || '').trim();
    if (copyButton) {
      copyButton.addEventListener('click', async () => {
        const copiedLabel = getLabelWithFallback('installCopied', '已复制', 'Copied');
        const installLabel = getLabelWithFallback('install', '安装', 'Install');
        try {
          await copyInstallText(installCode);
          copyButton.textContent = copiedLabel;
          copyButton.classList.add('copied');
          copyButton.title = copiedLabel;
          setTimeout(() => {
            copyButton.textContent = installLabel;
            copyButton.classList.remove('copied');
            copyButton.title = installLabel;
          }, 1200);
        } catch {
          const promptLabel = hub.i18n.getLang() === 'zh'
            ? '请手动复制安装命令'
            : 'Copy the install command manually';
          window.prompt(promptLabel, installCode);
          copyButton.textContent = installLabel;
          copyButton.classList.remove('copied');
          copyButton.title = installLabel;
        }
      });
    }

    return card;
  }

  function renderHeaderStats() {
    const wrap = document.getElementById('stats');
    if (!wrap) return;

    const skills = state.meta.totalCount || state.data.length;
    const categories = state.meta.categoryCount || state.categories.length;
    const platforms = state.meta.platformCount || new Set(state.data.flatMap((item) => s.getSkillAgents(item))).size;
    const repos = state.meta.sources || new Set(state.data.map((item) => item.repo)).size;

    wrap.innerHTML = `
      <span class="stat-pill"><strong>${skills}</strong><span>${hub.i18n.t('skills')}</span></span>
      <span class="stat-pill"><strong>${categories}</strong><span>${hub.i18n.t('categoriesLabel')}</span></span>
      <span class="stat-pill"><strong>${platforms}</strong><span>${hub.i18n.t('platformsLabel')}</span></span>
      <span class="stat-pill"><strong>${repos}</strong><span>${hub.i18n.t('reposLabel')}</span></span>
    `;
  }

  function renderGroupedView(list) {
    const grouped = new Map();
    list.forEach((skill) => {
      const categoryId = s.getSkillCategory(skill);
      if (!grouped.has(categoryId)) grouped.set(categoryId, []);
      grouped.get(categoryId).push(skill);
    });

    const container = document.createDocumentFragment();
    [...grouped.entries()].sort((left, right) => left[0].localeCompare(right[0])).forEach(([categoryId, skills]) => {
      const section = document.createElement('section');
      section.className = 'type-group';
      section.innerHTML = `
        <div class="type-header">
          <h3 class="type-title">${s.getCategoryLabel(categoryId)}</h3>
          <span class="type-count">${skills.length}</span>
        </div>
      `;

      const grid = document.createElement('div');
      grid.className = 'card-grid';
      skills.forEach((skill) => grid.appendChild(createCard(skill)));
      section.appendChild(grid);
      container.appendChild(section);
    });

    return container;
  }

  function renderFlatView(list) {
    const container = document.createDocumentFragment();
    list.forEach((skill) => container.appendChild(createCard(skill)));
    return container;
  }

  function renderStats() {
    return;
  }

  function renderPagination(totalPages) {
    const nav = dom.pagination;
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
        renderPagination(1, filtered.length);
      } else {
        results.appendChild(renderFlatView(pageData));
        renderPagination(totalPages, filtered.length);
      }
    }

    if (dom.empty) dom.empty.hidden = filtered.length > 0;
    if (dom['results-count']) {
      const hasFilter = Boolean(state.keyword || state.category !== 'all' || state.agent);
      dom['results-count'].textContent = hasFilter
        ? hub.i18n.t('resultsCountFiltered').replace('{count}', filtered.length).replace('{total}', state.data.length)
        : hub.i18n.t('resultsCount').replace('{count}', state.data.length);
    }
  }

  function renderFilters() {
    renderCategoryTabs();
    renderSubgroupTabs();
    renderCategoryDesc();
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
    renderSubgroupTabs,
    renderCategoryDesc,
    createCard,
    renderGroupedView,
    renderFlatView,
    renderStats,
    renderPagination,
    render,
    renderFilters,
    renderListOnly,
    renderFilterChrome,
    renderAll,
  };
})();
