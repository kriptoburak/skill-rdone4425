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

  function createInlineSubgroupTabs(categoryId, subcategories) {
    const items = subcategories || [];
    if (!categoryId || items.length <= 0) {
      return null;
    }

    const wrap = document.createElement('div');
    wrap.className = 'subgroup-tabs subgroup-tabs-inline';

    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.className = `subgroup-tab${!state.subcategory ? ' active' : ''}`;
    allButton.dataset.subcategoryId = '';
    allButton.innerHTML = `
      <span>${hub.i18n.t('categoryAll')}</span>
      <span class="subgroup-tab-count">${items.reduce((sum, item) => sum + (item.count || 0), 0)}</span>
    `;
    wrap.appendChild(allButton);

    items.forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `subgroup-tab${state.subcategory === category.subcategoryId ? ' active' : ''}`;
      button.dataset.subcategoryId = category.subcategoryId;
      button.innerHTML = `
        <span>${s.getCategoryLabel(category.subcategoryId)}</span>
        <span class="subgroup-tab-count">${category.count || 0}</span>
      `;
      wrap.appendChild(button);
    });

    return wrap;
  }

  function renderCategoryTabs() {
    const wrap = dom['category-tabs'];
    if (!wrap) return;
    wrap.innerHTML = '';

    const allItem = document.createElement('div');
    allItem.className = 'category-item';

    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.className = `cat-tab${state.category === 'all' ? ' active' : ''}`;
    allButton.dataset.id = 'all';
    allButton.innerHTML = `
      <span class="cat-tab-label">${hub.i18n.t('categoryAll')}</span>
      <span class="cat-tab-count">${state.meta.totalCount || state.data.length}</span>
    `;
    allItem.appendChild(allButton);
    wrap.appendChild(allItem);

    state.categories.forEach((category) => {
      const item = document.createElement('div');
      const isActive = state.category === category.id;
      const isExpanded = state.expandedCategory === category.id;
      const subcategories = category.id === state.category
        ? (state.subcategories || [])
        : (s.sortSubcategories(category.subcategories || []));
      const hasSubcategories = subcategories.length > 0;

      item.className = `category-item${isActive ? ' active' : ''}${isExpanded ? ' expanded' : ''}`;

      const row = document.createElement('div');
      row.className = 'category-row';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = `cat-tab${isActive ? ' active' : ''}`;
      button.dataset.id = category.id;
      button.innerHTML = `
        <span class="cat-tab-label">${s.getCategoryLabel(category.id)}</span>
        <span class="cat-tab-count">${category.count || 0}</span>
      `;
      row.appendChild(button);

      if (hasSubcategories) {
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = `cat-expand${isExpanded ? ' active' : ''}`;
        toggle.dataset.expandId = category.id;
        toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        toggle.setAttribute(
          'aria-label',
          isExpanded
            ? getLabelWithFallback('collapseCategory', '收起子分类', 'Collapse subcategories')
            : getLabelWithFallback('expandCategory', '展开子分类', 'Expand subcategories'),
        );
        toggle.innerHTML = '<span class="cat-expand-icon" aria-hidden="true">+</span>'; 
        row.appendChild(toggle);
      }

      item.appendChild(row);

      if (isExpanded && hasSubcategories) {
        const inlineSubgroups = createInlineSubgroupTabs(category.id, subcategories);
        if (inlineSubgroups) {
          item.appendChild(inlineSubgroups);
        }
      }

      wrap.appendChild(item);
    });
  }

  function renderSubgroupTabs() {
    const wrap = dom['subgroup-tabs'];
    if (!wrap) return;
    wrap.hidden = true;
    wrap.innerHTML = '';
  }

  function getSkillCategoryDisplay(skill) {
    const topCategory = s.getSkillTopCategory(skill);
    const subcategory = s.getSkillSubcategory(skill);
    if (topCategory === subcategory) {
      return s.getCategoryLabel(topCategory);
    }
    if (state.category !== 'all' && state.category === topCategory) {
      return s.getCategoryLabel(subcategory);
    }
    return `${s.getCategoryLabel(topCategory)} / ${s.getCategoryLabel(subcategory)}`;
  }

  function renderCategoryDesc() {
    const element = dom['category-desc'];
    if (!element) return;

    if (!state.agent && !state.keyword) {
      element.hidden = true;
      element.innerHTML = '';
      return;
    }

    element.hidden = false;
    const chips = [
      `<span class="summary-chip summary-chip-strong">${state.category === 'all' ? hub.i18n.t('categoryAll') : s.getCategoryLabel(state.category)}</span>`,
    ];

    if (state.subcategory) {
      chips.push(`<span class="summary-chip">${s.getCategoryLabel(state.subcategory)}</span>`);
    }

    if (state.agent) {
      chips.push(`<span class="summary-chip">${s.getAgentLabel(state.agent)}</span>`);
    }

    if (state.keyword) {
      chips.push(`<span class="summary-chip">"${state.keyword}"</span>`);
    }

    element.innerHTML = `
      <div class="filter-summary">
        <span class="filter-summary-label">${hub.i18n.t('resultsLabel')}</span>
        <div class="filter-summary-chips">${chips.join('')}</div>
        ${state.agent ? `<button type="button" class="filter-inline-btn" data-clear-agent="1">${hub.i18n.t('clearPlatformFilter')}</button>` : ''}
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

  function trackAffiliateClick(skill, url) {
    const eventData = {
      event: 'affiliate_click',
      skill: skill.name || '',
      url: url,
      ts: Date.now(),
    };
    console.log('[SkillHub] Affiliate click:', JSON.stringify(eventData));
    const endpoint = (window.SkillHub.config && window.SkillHub.config.trackEndpoint) || '/api/track';
    const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, blob);
    } else if (window.fetch) {
      fetch(endpoint, { method: 'POST', body: blob, keepalive: true }).catch(function(){});
    }
  }

  function getPricingLabel(pricing) {
    const key = {
      free: 'pricingFree',
      freemium: 'pricingFreemium',
      paid: 'pricingPaid',
    }[String(pricing || '').toLowerCase()] || null;
    return key ? hub.i18n.t(key) : null;
  }

  function createCard(skill) {
    const primaryAgentId = s.getPrimarySkillAgent(skill);
    const primaryMeta = s.getAgentMeta(primaryAgentId);
    const repoOwner = String(skill.repo || '').split('/')[0] || '';
    const avatarUrl = repoOwner ? `https://github.com/${repoOwner}.png?size=96` : '';
    const installCode = String(skill.install || '').trim();
    const hasAffiliate = Boolean(skill.affiliateUrl);
    const pricingLabel = getPricingLabel(skill.pricing);
    const card = document.createElement('article');
    card.className = 'skill-card card' + (hasAffiliate ? ' card-affiliate' : '');
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
        <span class="card-group">${getSkillCategoryDisplay(skill)}</span>
        ${pricingLabel ? `<span class="card-pricing pricing-${String(skill.pricing || 'free').toLowerCase()}">${pricingLabel}</span>` : ''}
        ${hasAffiliate ? `<span class="card-affiliate-badge">${hub.i18n.t('affiliateLabel')}</span>` : ''}
      </div>
      <div class="agent-chip-list">
        ${s.getSkillAgents(skill).map(createAgentChip).join('')}
      </div>
      <div class="card-install" title="${skill.install || ''}">
        <code>$ ${skill.install || ''}</code>
      </div>
      <div class="card-footer">
        ${hasAffiliate
          ? `<a class="card-link card-affiliate-link" href="${skill.affiliateUrl}" target="_blank" rel="noopener sponsored">${hub.i18n.t('viewOnGitHub')} ↗</a>`
          : `<a class="card-link" href="https://github.com/${skill.repo}" target="_blank" rel="noopener">${hub.i18n.t('viewOnGitHub')}</a>`}
        <button type="button" class="copy-btn card-copy-btn" title="${getLabelWithFallback('copyCommand', '复制命令', 'Copy command')}">${getLabelWithFallback('copyCommand', '复制命令', 'Copy command')}</button>
      </div>
    `;

    const copyButton = card.querySelector('.copy-btn');
    if (copyButton) {
      copyButton.addEventListener('click', async () => {
        const copiedLabel = getLabelWithFallback('copyCommandCopied', '已复制', 'Copied');
        const installLabel = getLabelWithFallback('copyCommand', '复制命令', 'Copy command');
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

    // Track affiliate link clicks
    if (hasAffiliate) {
      const affiliateLink = card.querySelector('.card-affiliate-link');
      if (affiliateLink) {
        affiliateLink.addEventListener('click', (e) => {
          trackAffiliateClick(skill, skill.affiliateUrl);
        });
      }
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
    const categoryOrder = new Map((state.categories || []).map((category, index) => [String(category.id || ''), index]));
    const subcategoryOrder = new Map((state.subcategories || []).map((category, index) => [String(category.subcategoryId || category.id || ''), index]));
    const leafOrder = new Map(
      (state.leafCategories || [])
        .filter((category) => state.category === 'all' || category.groupId === state.category)
        .map((category, index) => [String(category.id || ''), index]),
    );

    const grouped = new Map();
    list.forEach((skill) => {
      let key = 'top:' + s.getSkillTopCategory(skill);
      let title = s.getCategoryLabel(s.getSkillTopCategory(skill));
      let order = categoryOrder.get(s.getSkillTopCategory(skill));

      if (state.category !== 'all' && !state.subcategory) {
        const subcategoryId = s.getSkillSubcategory(skill);
        key = 'sub:' + subcategoryId;
        title = s.getCategoryLabel(subcategoryId);
        order = subcategoryOrder.get(subcategoryId);
      } else if (state.subcategory) {
        const leafCategoryId = s.getSkillCategory(skill);
        key = 'leaf:' + leafCategoryId;
        title = s.getCategoryLabel(leafCategoryId);
        order = leafOrder.get(leafCategoryId);
      }

      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          title,
          order: Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER,
          skills: [],
        });
      }
      grouped.get(key).skills.push(skill);
    });

    const sections = [...grouped.values()].sort((left, right) => {
      if (left.order !== right.order) return left.order - right.order;
      if (right.skills.length !== left.skills.length) return right.skills.length - left.skills.length;
      return String(left.title || '').localeCompare(String(right.title || ''));
    });

    const container = document.createDocumentFragment();
    sections.forEach((group) => {
      const section = document.createElement('section');
      section.className = 'type-group';
      section.innerHTML = [
        '        <div class="type-header">',
        '          <h3 class="type-title">' + group.title + '</h3>',
        '          <span class="type-count">' + group.skills.length + '</span>',
        '        </div>',
      ].join('\n');

      const grid = document.createElement('div');
      grid.className = 'card-grid';
      group.skills.forEach((skill) => grid.appendChild(createCard(skill)));
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
    // ponytail: keep pagination UI but hidden, infinite scroll handles loading
    nav.hidden = true;
    if (dom['page-info']) dom['page-info'].textContent = `${state.page} / ${totalPages}`;
    if (dom['page-prev']) dom['page-prev'].disabled = state.page <= 1;
    if (dom['page-next']) dom['page-next'].disabled = state.page >= totalPages;
  }

  /* ponytail: infinite scroll — IntersectionObserver on sentinel <div> */
  let scrollObserver = null;
  let scrollSentinel = null;
  let scrollTotalPages = 0;

  function setupInfiniteScroll() {
    if (scrollObserver) scrollObserver.disconnect();
    scrollSentinel = document.getElementById('scroll-sentinel');
    if (!scrollSentinel) return;

    scrollObserver = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && state.page < scrollTotalPages) {
        state.page += 1;
        const filtered = getFiltered();
        const start = (state.page - 1) * s.PER_PAGE;
        const pageData = filtered.slice(start, start + s.PER_PAGE);
        const sentinel = scrollSentinel;
        if (sentinel && sentinel.parentNode) {
          sentinel.parentNode.insertBefore(
            renderFlatView(pageData),
            sentinel
          );
        }
        renderPagination(scrollTotalPages);
        s.persistState();
        if (state.page >= scrollTotalPages) {
          scrollObserver.disconnect();
        }
      }
    }, { rootMargin: '200px' });
    scrollObserver.observe(scrollSentinel);
  }

  function render() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / s.PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;
    scrollTotalPages = totalPages;

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
        // ponytail: add sentinel for infinite scroll
        if (state.page < totalPages) {
          var sentinel = document.createElement('div');
          sentinel.id = 'scroll-sentinel';
          sentinel.style.height = '1px';
          results.appendChild(sentinel);
        }
        renderPagination(totalPages);
        setupInfiniteScroll();
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
