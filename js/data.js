/* ==========================================
   data loader
   ========================================== */
(function () {
  'use strict';

  const hub = window.SkillHub = window.SkillHub || {};

  const CATEGORIES_INDEX_URL = 'categories/index.json';
  const SESSION_BUCKET_PREFIX = 'skill-hub.bucket.v2.';

  const LEGACY_CATEGORY_HIERARCHY = {
    'automation-productivity': { groupId: 'automation', subcategoryId: 'productivity' },
    'backend-api': { groupId: 'backend', subcategoryId: 'api' },
    'data-ai': { groupId: 'data', subcategoryId: 'ai' },
    'design-ui': { groupId: 'design', subcategoryId: 'ui' },
    'dev-tools': { groupId: 'development', subcategoryId: 'tools' },
    'devops-deploy': { groupId: 'devops', subcategoryId: 'deploy' },
    'docs-content': { groupId: 'docs', subcategoryId: 'content' },
    general: { groupId: 'general', subcategoryId: 'general' },
    security: { groupId: 'security', subcategoryId: 'general' },
    'testing-qa': { groupId: 'testing', subcategoryId: 'qa' },
    'video-multimedia': { groupId: 'media-creation', subcategoryId: 'video' },
    'game-dev': { groupId: 'media-creation', subcategoryId: 'game' },
    'finance-crypto': { groupId: 'business', subcategoryId: 'finance' },
    finance: { groupId: 'business', subcategoryId: 'finance' },
    education: { groupId: 'business', subcategoryId: 'education' },
    'health-medical': { groupId: 'lifestyle', subcategoryId: 'health' },
    social: { groupId: 'business', subcategoryId: 'social' },
        audio: { groupId: 'media-creation', subcategoryId: 'audio' },
        '3d': { groupId: 'design', subcategoryId: '3d' },
        ecommerce: { groupId: 'business', subcategoryId: 'ecommerce' },
        'agent-framework': { groupId: 'development', subcategoryId: 'agent-framework' },
        'multi-modal': { groupId: 'data', subcategoryId: 'multi-modal' },
        'video-gen': { groupId: 'media-creation', subcategoryId: 'video-gen' },
        'browser-automation': { groupId: 'development', subcategoryId: 'browser-automation' },
        'mcp-server': { groupId: 'data', subcategoryId: 'mcp-server' },
        'llm': { groupId: 'data', subcategoryId: 'llm' },
        'audio-speech': { groupId: 'media-creation', subcategoryId: 'audio-speech' },
        'rag': { groupId: 'data', subcategoryId: 'rag' },
        'image-gen': { groupId: 'design', subcategoryId: 'image-gen' },
      };

  let indexPromise = null;
  let allDataPromise = null;

  const bucketCache = new Map();

  function fetchJson(url) {
    return fetch(url, { cache: 'no-store' }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      return response.json();
    });
  }

  function readBucketSessionCache(cacheKey) {
    try {
      const raw = sessionStorage.getItem(SESSION_BUCKET_PREFIX + cacheKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  function writeBucketSessionCache(cacheKey, skills) {
    try {
      sessionStorage.setItem(SESSION_BUCKET_PREFIX + cacheKey, JSON.stringify(skills));
    } catch {
      // ignore storage failures
    }
  }

  function normalizePath(pathValue) {
    return String(pathValue || '')
      .replace(/\\/g, '/')
      .replace(/^\/+|\/+$/g, '');
  }

  function resolveHierarchy(meta) {
    const id = String(meta?.id || '').trim();
    const pathValue = normalizePath(meta?.path || id);
    const legacy = LEGACY_CATEGORY_HIERARCHY[id];
    if (legacy) {
      return {
        id,
        path: pathValue || id,
        groupId: legacy.groupId,
        subcategoryId: legacy.subcategoryId,
      };
    }

    const parts = pathValue.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return {
        id: id || pathValue,
        path: pathValue,
        groupId: String(meta?.groupId || parts[0]).trim() || parts[0],
        subcategoryId: String(meta?.subcategoryId || parts[1]).trim() || parts[1],
      };
    }

    const normalizedId = id || pathValue || 'general';
    return {
      id: normalizedId,
      path: pathValue || normalizedId,
      groupId: String(meta?.groupId || normalizedId).trim() || normalizedId,
      subcategoryId: String(meta?.subcategoryId || normalizedId).trim() || normalizedId,
    };
  }

  function normalizeLeafCategory(category) {
    const hierarchy = resolveHierarchy(category);
    return {
      id: hierarchy.id,
      path: hierarchy.path,
      groupId: hierarchy.groupId,
      subcategoryId: hierarchy.subcategoryId,
      count: Number(category?.count || 0),
    };
  }

  function sortLeafCategories(categories) {
    return (categories || []).slice().sort((left, right) => {
      if ((right.count || 0) !== (left.count || 0)) return (right.count || 0) - (left.count || 0);
      return String(left.subcategoryId || left.id || '').localeCompare(String(right.subcategoryId || right.id || ''));
    });
  }

  function sortGroups(groups) {
    return (groups || []).slice().sort((left, right) => {
      if ((right.count || 0) !== (left.count || 0)) return (right.count || 0) - (left.count || 0);
      return String(left.id || '').localeCompare(String(right.id || ''));
    });
  }

  function buildGroupsFromLeaves(leafCategories) {
    const grouped = new Map();

    leafCategories.forEach((leaf) => {
      if (!grouped.has(leaf.groupId)) {
        grouped.set(leaf.groupId, {
          id: leaf.groupId,
          count: 0,
          subcategories: [],
        });
      }
      const entry = grouped.get(leaf.groupId);
      entry.count += leaf.count || 0;
      entry.subcategories.push({
        id: leaf.id,
        path: leaf.path,
        count: leaf.count || 0,
        groupId: leaf.groupId,
        subcategoryId: leaf.subcategoryId,
      });
    });

    return sortGroups(
      [...grouped.values()].map((group) => ({
        ...group,
        subcategories: sortLeafCategories(group.subcategories),
      })),
    );
  }

  function normalizeGroups(index) {
    const bucketLeaves = sortLeafCategories((index.categories || []).map(normalizeLeafCategory));

    if (Array.isArray(index.groups) && index.groups.length > 0) {
      const groups = index.groups.map((group) => ({
        id: String(group.id || '').trim(),
        count: Number(group.count || 0),
        subcategories: sortLeafCategories(
          (group.subcategories || []).map((subcategory) => normalizeLeafCategory({
            id: subcategory.id,
            path: subcategory.path || subcategory.id,
            groupId: group.id,
            subcategoryId: subcategory.subcategoryId,
            count: subcategory.count,
          })),
        ),
      }));

      return {
        groups: sortGroups(groups),
        leafCategories: bucketLeaves,
      };
    }

    const leafCategories = bucketLeaves;
    return {
      groups: buildGroupsFromLeaves(leafCategories),
      leafCategories,
    };
  }

  function normalizeSkill(skill, bucket) {
    const install = String(skill.install || '').trim();
    const supportedAgents = Array.isArray(skill.supportedAgents)
      ? [...new Set(skill.supportedAgents.map((agentId) => String(agentId || '').trim()).filter(Boolean))]
      : [];

    const normalized = {
      ...skill,
      functionCategory: String(skill.functionCategory || bucket.id || 'general').trim() || 'general',
      topCategoryId: String(skill.topCategoryId || bucket.groupId || 'general').trim() || 'general',
      subCategoryId: String(skill.subCategoryId || bucket.subcategoryId || bucket.id || 'general').trim() || 'general',
      categoryPath: normalizePath(skill.categoryPath || bucket.path || bucket.id || 'general'),
      supportedAgents,
      install,
    };

    normalized.searchText = [
      normalized.name,
      normalized.desc,
      normalized.repo,
      normalized.install,
      normalized.functionCategory,
      normalized.topCategoryId,
      normalized.subCategoryId,
      ...supportedAgents,
    ].filter(Boolean).join(' ').toLowerCase();

    return normalized;
  }

  function createMeta(index, groups, overrides) {
    const next = overrides || {};
    return {
      title: 'Skill Hub',
      description: 'AI agent skill directory',
      lastUpdated: index.generatedAt || '',
      totalCount: Number(next.totalCount ?? index.totalSkills ?? 0),
      sources: next.sources || 0,
      categoryCount: Array.isArray(groups) ? groups.length : 0,
      platformCount: Array.isArray(index.platforms) ? index.platforms.length : 0,
    };
  }

  function prepareBuckets(leafCategories) {
    return leafCategories.map((category) => ({
      id: category.id,
      groupId: category.groupId,
      subcategoryId: category.subcategoryId,
      count: category.count || 0,
      cacheKey: String(category.path || category.id || 'general'),
      url: `categories/${normalizePath(category.path || category.id)}/skills.json`,
      path: normalizePath(category.path || category.id),
    }));
  }

  function loadBucket(bucket) {
    if (bucketCache.has(bucket.cacheKey)) {
      return bucketCache.get(bucket.cacheKey);
    }

    const cached = readBucketSessionCache(bucket.cacheKey);
    if (cached) {
      const cachedPromise = Promise.resolve(cached);
      bucketCache.set(bucket.cacheKey, cachedPromise);
      return cachedPromise;
    }

    const promise = fetchJson(bucket.url).then((payload) => {
      const skills = (payload.skills || []).map((skill) => normalizeSkill(skill, bucket));
      writeBucketSessionCache(bucket.cacheKey, skills);
      return skills;
    });

    bucketCache.set(bucket.cacheKey, promise);
    return promise;
  }

  async function loadBuckets(buckets) {
    const groups = await Promise.all((buckets || []).map(loadBucket));
    return groups.flat();
  }

  function buildGroupsFromSkills(skills) {
    const grouped = new Map();

    (skills || []).forEach((skill) => {
      const groupId = String(skill.topCategoryId || skill.functionCategory || 'general');
      const subcategoryId = String(skill.subCategoryId || skill.functionCategory || 'general');
      if (!grouped.has(groupId)) {
        grouped.set(groupId, {
          id: groupId,
          count: 0,
          subcategories: new Map(),
        });
      }

      const group = grouped.get(groupId);
      group.count += 1;
      group.subcategories.set(subcategoryId, (group.subcategories.get(subcategoryId) || 0) + 1);
    });

    return sortGroups([...grouped.values()].map((group) => ({
      id: group.id,
      count: group.count,
      subcategories: sortLeafCategories([...group.subcategories.entries()].map(([subcategoryId, count]) => ({
        id: group.id + '/' + subcategoryId,
        path: group.id + '/' + subcategoryId,
        groupId: group.id,
        subcategoryId,
        count,
      }))),
    })));
  }

  function createSummaryFromSkills(index, groups, skills) {
    const computedGroups = buildGroupsFromSkills(skills);
    const repoCount = new Set((skills || []).map((skill) => skill.repo).filter(Boolean)).size;
    return {
      meta: createMeta(index, computedGroups, {
        totalCount: (skills || []).length,
        sources: repoCount,
      }),
      categories: computedGroups,
      skills,
      sources: repoCount,
    };
  }

  function loadIndex() {
    if (indexPromise) return indexPromise;

    indexPromise = fetchJson(CATEGORIES_INDEX_URL).then((index) => {
      const normalized = normalizeGroups(index);
      return {
        raw: index,
        meta: createMeta(index, normalized.groups),
        categories: normalized.groups,
        leafCategories: normalized.leafCategories,
        buckets: prepareBuckets(normalized.leafCategories),
        platforms: index.platforms || [],
      };
    });

    return indexPromise;
  }

  function prefetchAllData() {
    if (allDataPromise) return allDataPromise;

    allDataPromise = loadIndex().then(async (indexData) => {
      const skills = await loadBuckets(indexData.buckets);
      return createSummaryFromSkills(indexData.raw, indexData.categories, skills);
    });

    return allDataPromise;
  }

  function findGroup(indexData, groupId) {
    return (indexData.categories || []).find((group) => group.id === groupId) || null;
  }

  function resolveLegacySelection(indexData, selection) {
    if (!selection || !selection.category || selection.category === 'all') {
      return {
        category: 'all',
        subcategory: null,
      };
    }

    const directGroup = findGroup(indexData, selection.category);
    if (directGroup) {
      return {
        category: selection.category,
        subcategory: selection.subcategory || null,
      };
    }

    const directLeaf = (indexData.leafCategories || []).find((leaf) => leaf.id === selection.category || leaf.path === selection.category);
    if (directLeaf) {
      return {
        category: directLeaf.groupId,
        subcategory: directLeaf.subcategoryId,
      };
    }

    return {
      category: 'all',
      subcategory: null,
    };
  }

  async function loadForSelection(selection) {
    const indexData = await loadIndex();
    const resolved = resolveLegacySelection(indexData, selection || {});
    const summaryPromise = prefetchAllData();

    if (resolved.category === 'all') {
      const allData = await summaryPromise;
      return {
        meta: allData.meta,
        categories: allData.categories,
        subcategories: [],
        skills: allData.skills,
      };
    }

    const allData = await summaryPromise;

    const groupSkills = allData.skills.filter((skill) => String(skill.topCategoryId || '') === resolved.category);
    const subgroupMap = new Map();
    groupSkills.forEach((skill) => {
      const subcategoryId = String(skill.subCategoryId || resolved.category);
      subgroupMap.set(subcategoryId, (subgroupMap.get(subcategoryId) || 0) + 1);
    });

    const subcategories = sortLeafCategories([...subgroupMap.entries()].map(([subcategoryId, count]) => ({
      id: resolved.category + '/' + subcategoryId,
      path: resolved.category + '/' + subcategoryId,
      groupId: resolved.category,
      subcategoryId,
      count,
    })));

    return {
      meta: allData.meta,
      categories: allData.categories,
      subcategories,
      skills: resolved.subcategory
        ? groupSkills.filter((skill) => String(skill.subCategoryId || '') === resolved.subcategory)
        : groupSkills,
    };
  }

  hub.data = {
    loadIndex,
    prefetchAllData,
    loadForSelection,
    resolveHierarchy,
  };
})();
