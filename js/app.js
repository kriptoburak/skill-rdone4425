/**
 * app.js — Codex Skills Hub 渲染逻辑
 * 1. 渲染分类 Tab + 子分组 Tab + 分类描述
 * 2. 渲染 Skill 卡片
 * 3. 搜索过滤
 * 4. 复制 install 命令
 * 5. 切换分类
 * 6. 中英文 UI 切换（via i18n.js）
 */

(function () {
  "use strict";

  const data = window.SKILL_DATA;
  const I18N = window.I18N;
  if (!data) {
    console.error("SKILL_DATA not loaded");
    return;
  }
  if (!I18N) {
    console.error("I18N not loaded");
    return;
  }

  // 工具函数：从 category id 生成 i18n key
  // 例如 claude → tabClaude, catClaude
  const idToI18nKey = (id) => id[0].toUpperCase() + id.slice(1);

  // ========== 工具 ==========

  // 状态
  const state = {
    currentSource: "all",
    currentGroup: null,
    keyword: "",
  };

  // DOM
  const $results = document.getElementById("results");
  const $empty = document.getElementById("empty");
  const $search = document.getElementById("search");
  const $searchClear = document.getElementById("search-clear");
  const $subgroupTabs = document.getElementById("subgroup-tabs");
  const $lastUpdated = document.getElementById("last-updated");
  const $statSkills = document.getElementById("stat-skills");
  const $statSources = document.getElementById("stat-sources");
  const $statStars = document.getElementById("stat-stars");
  const $categoryDesc = document.getElementById("category-desc");

  // ========== 工具 ==========

  function formatStars(n) {
    if (!n) return "—";
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return String(n);
  }

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  // ========== 渲染 ==========

  function getCategory(id) {
    return data.categories.find((c) => c.id === id);
  }

  // group id → i18n key (groupFigma, groupGithub, ...)
  // 由于 group 是从 data.categories[0].groups 动态来的
  function groupI18nKey(groupId) {
    return "group" + groupId[0].toUpperCase() + groupId.slice(1);
  }

  function renderCategoryTabs() {
    const nav = document.getElementById("category-tabs");
    if (!nav) return;
    const allTab = '<button class="tab active" data-source="all" role="tab">' +
      '<span class="tab-icon">◉</span><span data-i18n="tabAll">' + I18N.t("tabAll") + '</span>' +
      '</button>';
    const catTabs = data.categories.map((c) => {
      const key = idToI18nKey(c.id);
      const isActive = state.currentSource === c.id;
      return `<button class="tab ${isActive ? "active" : ""}" data-source="${c.id}" role="tab">` +
        `<span class="tab-icon">${c.icon}</span>` +
        `<span data-i18n="tab${key}">${I18N.t("tab" + key) || c.label}</span>` +
        '</button>';
    }).join('');
    nav.innerHTML = allTab + catTabs;
  }

  function renderSkillCard(skill) {
    const cat = getCategory(skill.source);
    const color = (cat && cat.color) || "var(--accent)";
    const icon = (cat && cat.icon) || "📦";
    const card = document.createElement("article");
    card.className = "skill-card";
    card.style.setProperty("--card-accent", color);

    const groupLabel = skill.group
      ? `<span class="card-group">${escapeHtml(I18N.t(groupI18nKey(skill.group)) || skill.group)}</span>`
      : "";

    card.innerHTML = `
      <div class="card-head">
        <span class="card-icon">${icon}</span>
        <div class="card-title-wrap">
          <div class="card-name">${escapeHtml(skill.name)}</div>
          <div class="card-repo">
            <a href="${escapeHtml(skill.url)}" target="_blank" rel="noopener">${escapeHtml(skill.repo)}</a>
            <span class="card-stars" title="${I18N.t("starsTitle")}">⭐ ${formatStars(skill.stars)}</span>
          </div>
        </div>
      </div>
      <p class="card-desc">${escapeHtml(skill.desc)}</p>
      <div class="card-install" title="${escapeHtml(skill.install)}">
        <code>${escapeHtml(skill.install)}</code>
        <button class="copy-btn" data-install="${escapeHtml(skill.install)}" title="${I18N.t("copy")}">⧉</button>
      </div>
      <div class="card-footer">
        <a class="card-link" href="${escapeHtml(skill.url)}" target="_blank" rel="noopener">
          ${escapeHtml(I18N.t("viewRepo"))}
        </a>
        ${groupLabel}
      </div>
    `;
    return card;
  }

  function renderCategoryDesc() {
    // 显示当前分类的中文/英文描述
    if (state.currentSource === "all") {
      $categoryDesc.hidden = true;
      $categoryDesc.innerHTML = "";
      return;
    }
    const key = "cat" + idToI18nKey(state.currentSource);
    if (!key) {
      $categoryDesc.hidden = true;
      return;
    }
    $categoryDesc.hidden = false;
    $categoryDesc.textContent = I18N.t(key);
  }

  function renderResults() {
    const filtered = data.skills.filter((s) => {
      if (state.currentSource !== "all" && s.source !== state.currentSource) return false;
      if (state.currentGroup && s.group !== state.currentGroup) return false;
      if (state.keyword) {
        const k = state.keyword.toLowerCase();
        const haystack = [
          s.name,
          s.repo,
          s.desc,
          s.group || "",
        ].join(" ").toLowerCase();
        if (!haystack.includes(k)) return false;
      }
      return true;
    });

    $results.innerHTML = "";
    if (filtered.length === 0) {
      $empty.hidden = false;
      return;
    }
    $empty.hidden = true;

    filtered.forEach((s) => {
      $results.appendChild(renderSkillCard(s));
    });
  }

  function renderSubgroupTabs() {
    if (state.currentSource !== "official") {
      $subgroupTabs.hidden = true;
      $subgroupTabs.innerHTML = "";
      state.currentGroup = null;
      return;
    }
    const groups = data.categories.find((c) => c.id === "official").groups;
    if (!groups || groups.length === 0) {
      $subgroupTabs.hidden = true;
      return;
    }
    $subgroupTabs.hidden = false;
    const allActive = state.currentGroup === null ? "active" : "";
    $subgroupTabs.innerHTML = `
      <button class="subgroup-tab ${allActive}" data-group="">${escapeHtml(I18N.t("subgroupAll"))}</button>
      ${groups
        .map(
          (g) =>
            `<button class="subgroup-tab ${state.currentGroup === g.id ? "active" : ""}" data-group="${g.id}">${escapeHtml(I18N.t(groupI18nKey(g.id)) || g.label)}</button>`
        )
        .join("")}
    `;
  }

  function renderStats() {
    $statSkills.textContent = data.skills.length;
    const sources = new Set(data.skills.map((s) => s.repo));
    $statSources.textContent = sources.size;
    const totalStars = data.skills.reduce((sum, s) => sum + (s.stars || 0), 0);
    $statStars.textContent = formatStars(totalStars);
    $lastUpdated.textContent = data.meta.lastUpdated;
  }

  // ========== 事件绑定 ==========

  function bindCategoryTabs() {
    document.getElementById("category-tabs").addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (!tab) return;
      document.querySelectorAll("#category-tabs .tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      state.currentSource = tab.dataset.source;
      state.currentGroup = null;
      renderSubgroupTabs();
      renderCategoryDesc();
      renderResults();
    });
  }

  function bindSubgroupTabs() {
    $subgroupTabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".subgroup-tab");
      if (!tab) return;
      document.querySelectorAll(".subgroup-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      state.currentGroup = tab.dataset.group || null;
      renderResults();
    });
  }

  function bindSearch() {
    $search.addEventListener("input", (e) => {
      state.keyword = e.target.value.trim();
      $searchClear.classList.toggle("visible", state.keyword.length > 0);
      renderResults();
    });
    $searchClear.addEventListener("click", () => {
      $search.value = "";
      state.keyword = "";
      $searchClear.classList.remove("visible");
      $search.focus();
      renderResults();
    });
    $search.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.keyword) {
        $searchClear.click();
      }
    });
  }

  function bindCopy() {
    $results.addEventListener("click", (e) => {
      const btn = e.target.closest(".copy-btn");
      if (!btn) return;
      const text = btn.dataset.install;
      copyToClipboard(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = "✓";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove("copied");
        }, 1200);
      });
    });
  }

  function bindLanguage() {
    document.querySelector(".lang-switcher").addEventListener("click", (e) => {
      const btn = e.target.closest(".lang-btn");
      if (!btn) return;
      I18N.set(btn.dataset.lang);
    });
  }

  function bindLanguageChange() {
    // i18n.set() 触发 languagechange 事件，重新渲染依赖语言的部分
    window.addEventListener("languagechange", () => {
      renderCategoryTabs();
      renderSubgroupTabs();
      renderCategoryDesc();
      renderResults();
    });
  }

  function bindShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== $search) {
        e.preventDefault();
        $search.focus();
        $search.select();
      }
    });
  }

  // ========== 启动 ==========

  function init() {
    // 先应用 i18n（更新所有 data-i18n 元素）
    I18N.apply();
    // 然后渲染
    renderCategoryTabs();
    renderStats();
    renderCategoryDesc();
    renderSubgroupTabs();
    renderResults();
    bindCategoryTabs();
    bindSubgroupTabs();
    bindSearch();
    bindCopy();
    bindLanguage();
    bindLanguageChange();
    bindShortcuts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
