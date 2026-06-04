/* ==========================================
   render
   ========================================== */
(function () {
  'use strict';

  const hub = window.SkillHub = window.SkillHub || {};
  const s = hub.state;
  const { state, dom } = s;

  function getFiltered() {
    let list = state.data;

    if (state.category !== 'all') {
      list = list.filter(item => s.getSkillAgent(item) === state.category);
    }
    if (state.subgroup) {
      list = list.filter(item => item.group === state.subgroup);
    }
    if (state.keyword) {
      const kw = state.keyword.toLowerCase();
      list = list.filter(item =>
        item.name.toLowerCase().includes(kw) ||
        item.desc.toLowerCase().includes(kw) ||
        item.repo.toLowerCase().includes(kw)
      );
    }

    const [field, dir] = state.sort.split('-');
    const mul = dir === 'asc' ? 1 : -1;
    if (field === 'stars') {
      return [...list].sort((a, b) => (a.stars - b.stars) * mul);
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name) * mul);
  }

  function renderDirectoryMenu() {
    const wrap = dom['directory-menu'];
    if (!wrap) return;
    wrap.innerHTML = '';

    state.categories.forEach(cat => {
      const card = document.createElement('section');
      card.className = 'directory-agent-card';
      card.style.setProperty('--accent', cat.color || s.getAgentMeta(cat.id).color || '#6366f1');

      const count = state.data.filter(skill => s.getSkillAgent(skill) === cat.id).length;
      const top = document.createElement('div');
      top.className = 'directory-agent-top';
      top.innerHTML = `
        <div class="directory-agent-name">${cat.icon || s.getAgentMeta(cat.id).icon} ${s.getAgentLabel(cat.id)}</div>
        <span class="directory-agent-count">${count}</span>
      `;

      const list = document.createElement('div');
      list.className = 'directory-group-list';

      const allChip = document.createElement('button');
      allChip.type = 'button';
      allChip.className = 'directory-group-chip' + (state.category === cat.id && !state.subgroup ? ' active' : '');
      allChip.textContent = hub.i18n.t('categoryAll');
      allChip.addEventListener('click', () => {
        s.selectCategory(cat.id);
        hub.render.renderAll();
      });
      list.appendChild(allChip);

      (cat.groups || []).forEach(group => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'directory-group-chip' + (state.category === cat.id && state.subgroup === group.id ? ' active' : '');
        chip.textContent = s.getGroupLabel(group.id);
        chip.addEventListener('click', () => {
          s.selectCategory(cat.id, group.id);
          hub.render.renderAll();
        });
        list.appendChild(chip);
      });

      card.appendChild(top);
      card.appendChild(list);
      wrap.appendChild(card);
    });
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
      btn.innerHTML = `${cat.icon || s.getAgentMeta(cat.id).icon} ${s.getAgentLabel(cat.id)}`;
      wrap.appendChild(btn);
    });
  }

  function renderSubgroupTabs() {
    const wrap = dom['subgroup-tabs'];
    if (!wrap) return;
    wrap.innerHTML = '';
    wrap.hidden = true;

    if (state.category === 'all') return;

    const cat = s.getCategoryById(state.category);
    if (!cat || !cat.groups || cat.groups.length === 0) return;

    wrap.hidden = false;

    const allBtn = document.createElement('button');
    allBtn.className = 'subgroup-tab sub-tab' + (!state.subgroup ? ' active' : '');
    allBtn.dataset.group = '';
    allBtn.textContent = hub.i18n.t('categoryAll');
    wrap.appendChild(allBtn);

    cat.groups.forEach(group => {
      const btn = document.createElement('button');
      btn.className = 'subgroup-tab sub-tab' + (state.subgroup === group.id ? ' active' : '');
      btn.dataset.group = group.id;
      btn.textContent = s.getGroupLabel(group.id) || group.label;
      wrap.appendChild(btn);
    });
  }

  function renderCategoryDesc() {
    const el = dom['category-desc'];
    if (!el) return;
    el.hidden = true;

    if (state.category === 'all') {
      el.textContent = hub.i18n.t('categoryAllDesc');
      el.hidden = false;
      return;
    }

    const cat = s.getCategoryById(state.category);
    const desc = s.getAgentDesc(state.category, cat ? (cat.description || '') : '');
    if (desc) {
      el.textContent = desc;
      el.hidden = false;
    }
  }

  function createCard(skill) {
    const agentId = s.getSkillAgent(skill);
    const meta = s.getAgentMeta(agentId);
    const color = meta.color || '#6b7280';
    const card = document.createElement('article');
    card.className = 'skill-card card';
    card.style.setProperty('--card-accent', color);
    card.innerHTML = `
      <div class="card-head">
        <div class="card-icon">${meta.icon || '📦'}</div>
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
        <span class="source-tag" style="background:${color}18;color:${color};border-color:${color}33">${meta.icon || '📦'} ${s.getAgentLabel(agentId)}</span>
        <span class="card-group">${s.getGroupLabel(skill.group || 'other')}</span>
      </div>
      <div class="card-install" title="${skill.install}">
        <code>$ ${skill.install}</code>
      </div>
      <div class="card-footer">
        <a class="card-link" href="https://github.com/${skill.repo}" target="_blank" rel="noopener">↗ ${hub.i18n.t('viewOnGitHub')}</a>
        <span class="card-link card-link-muted">${hub.i18n.t('install')}</span>
      </div>
    `;
    return card;
  }

  function renderHeaderStats() {
    const wrap = document.getElementById('stats');
    if (!wrap) return;

    const skills = state.data.length;
    const agents = state.categories.length;
    const repos = new Set(state.data.map(item => item.repo)).size;

    wrap.innerHTML = `
      <span class="stat-pill"><strong>${skills}</strong><span>${hub.i18n.t('skills')}</span></span>
      <span class="stat-pill"><strong>${agents}</strong><span>Agents</span></span>
      <span class="stat-pill"><strong>${repos}</strong><span>Repos</span></span>
    `;
  }

  function renderGroupedView(list) {
    const grouped = {};
    list.forEach(skill => {
      const agent = s.getSkillAgent(skill);
      const group = skill.group || 'other';
      if (!grouped[agent]) grouped[agent] = {};
      if (!grouped[agent][group]) grouped[agent][group] = [];
      grouped[agent][group].push(skill);
    });

    const agentKeys = Object.keys(grouped).sort((a, b) => (s.AGENT_META[a]?.order || 99) - (s.AGENT_META[b]?.order || 99));
    const container = document.createDocumentFragment();

    agentKeys.forEach(agent => {
      const meta = s.getAgentMeta(agent);
      const groups = grouped[agent];
      const totalCount = Object.values(groups).reduce((sum, arr) => sum + arr.length, 0);
      const section = document.createElement('section');
      section.className = 'agent-section';
      section.style.setProperty('--agent-color', meta.color || '#6b7280');

      const header = document.createElement('div');
      header.className = 'agent-header';
      header.innerHTML = `
        <div class="agent-header-left">
          <span class="agent-icon">${meta.icon || '📦'}</span>
          <h2 class="agent-title">${s.getAgentLabel(agent)}</h2>
          <span class="agent-count">${totalCount} ${hub.i18n.t('skills')}</span>
        </div>
        <span class="agent-toggle">▼</span>
      `;

      const content = document.createElement('div');
      content.className = 'agent-content';

      Object.keys(groups).sort((a, b) => {
        if (a === 'other') return 1;
        if (b === 'other') return -1;
        return a.localeCompare(b);
      }).forEach(group => {
        const groupSection = document.createElement('div');
        groupSection.className = 'type-group';
        groupSection.innerHTML = `
          <div class="type-header">
            <h3 class="type-title">🏷️ ${s.getGroupLabel(group)}</h3>
            <span class="type-count">${groups[group].length}</span>
          </div>
        `;

        const grid = document.createElement('div');
        grid.className = 'card-grid';
        groups[group].forEach(skill => grid.appendChild(createCard(skill)));
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
          <span class="stats-label">${meta.icon || '📦'} ${s.getAgentLabel(src)}</span>
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
    renderDirectoryMenu();
    renderCategoryTabs();
    renderSubgroupTabs();
    renderCategoryDesc();
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
    renderDirectoryMenu,
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
    renderAll
  };
})();
