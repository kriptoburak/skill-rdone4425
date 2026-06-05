/* ==========================================
   data loader
   ========================================== */
(function () {
  'use strict';

  const hub = window.SkillHub = window.SkillHub || {};

  const AGENTS_INDEX_URL = 'agents/index.json';
  const SESSION_BUCKET_PREFIX = 'skill-hub.bucket.';

  let indexPromise = null;
  let allDataPromise = null;

  const bucketCache = new Map();

  function fetchJson(url) {
    return fetch(url, { cache: 'no-store' }).then(response => {
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

  function normalizeSkill(skill, agentId, groupId) {
    const install = String(skill.install || '').trim();
    const normalized = {
      ...skill,
      agent: skill.agent || agentId,
      group: groupId,
      install
    };

    normalized.searchText = [
      normalized.name,
      normalized.desc,
      normalized.repo,
      normalized.install
    ].filter(Boolean).join(' ').toLowerCase();

    return normalized;
  }

  function finalizeCategoryMap(map) {
    return Array.from(map.values()).map(category => ({
      id: category.id,
      count: category.count,
      groups: Array.from(category.groups.values()).sort((a, b) => a.id.localeCompare(b.id))
    }));
  }

  function createCategoryMapFromBuckets(index) {
    const map = new Map();

    (index.buckets || []).forEach(bucket => {
      const agentId = bucket.agent || 'other';
      const groupId = bucket.functionCategory || 'general';
      const bucketCount = bucket.count || 0;

      if (!map.has(agentId)) {
        map.set(agentId, {
          id: agentId,
          count: 0,
          groups: new Map()
        });
      }

      const category = map.get(agentId);
      category.count += bucketCount;

      if (!category.groups.has(groupId)) {
        category.groups.set(groupId, {
          id: groupId,
          label: groupId,
          count: 0
        });
      }

      category.groups.get(groupId).count += bucketCount;
    });

    return finalizeCategoryMap(map);
  }

  function createCategoryMapFromSkills(skills) {
    const map = new Map();

    (skills || []).forEach(skill => {
      const agentId = skill.agent || 'other';
      const groupId = skill.group || 'general';

      if (!map.has(agentId)) {
        map.set(agentId, {
          id: agentId,
          count: 0,
          groups: new Map()
        });
      }

      const category = map.get(agentId);
      category.count += 1;

      if (!category.groups.has(groupId)) {
        category.groups.set(groupId, {
          id: groupId,
          label: groupId,
          count: 0
        });
      }

      category.groups.get(groupId).count += 1;
    });

    return finalizeCategoryMap(map);
  }

  function createMeta(index, overrides = {}) {
    return {
      title: 'Skill Hub',
      description: 'AI Agent Skills 导航站',
      lastUpdated: index.generatedAt || '',
      totalCount: index.totalSkills || 0,
      sources: null,
      ...overrides
    };
  }

  function prepareBuckets(index) {
    return (index.buckets || []).map(bucket => ({
      agent: bucket.agent || 'other',
      functionCategory: bucket.functionCategory || 'general',
      count: bucket.count || 0,
      cacheKey: `${bucket.agent || 'other'}__${bucket.functionCategory || 'general'}`,
      url: `agents/${bucket.agent}/${bucket.functionCategory}/skills.json`
    }));
  }

  function filterBuckets(buckets, selection) {
    return buckets.filter(bucket => {
      if (selection.category !== 'all' && bucket.agent !== selection.category) {
        return false;
      }
      if (selection.subgroup && bucket.functionCategory !== selection.subgroup) {
        return false;
      }
      return true;
    });
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

    const promise = fetchJson(bucket.url)
      .then(payload => {
        const skills = (payload.skills || []).map(skill =>
          normalizeSkill(skill, bucket.agent, bucket.functionCategory)
        );
        writeBucketSessionCache(bucket.cacheKey, skills);
        return skills;
      });

    bucketCache.set(bucket.cacheKey, promise);
    return promise;
  }

  async function loadBuckets(buckets) {
    const groups = await Promise.all(buckets.map(loadBucket));
    return groups.flat();
  }

  function createSummaryFromSkills(index, skills) {
    const repoCount = new Set((skills || []).map(skill => skill.repo).filter(Boolean)).size;
    return {
      meta: createMeta(index, {
        totalCount: skills.length,
        sources: repoCount
      }),
      categories: createCategoryMapFromSkills(skills),
      skills,
      sources: repoCount
    };
  }

  function loadIndex() {
    if (indexPromise) return indexPromise;

    indexPromise = fetchJson(AGENTS_INDEX_URL).then(index => ({
      raw: index,
      meta: createMeta(index),
      categories: createCategoryMapFromBuckets(index),
      buckets: prepareBuckets(index)
    }));

    return indexPromise;
  }

  function prefetchAllData() {
    if (allDataPromise) return allDataPromise;

    allDataPromise = loadIndex().then(async indexData => {
      const skills = await loadBuckets(indexData.buckets);
      return createSummaryFromSkills(indexData.raw, skills);
    });

    return allDataPromise;
  }

  async function loadForSelection(selection) {
    const indexData = await loadIndex();
    const summaryPromise = prefetchAllData();

    const shouldLoadAllBuckets = selection.category === 'all' && !selection.subgroup;
    if (shouldLoadAllBuckets) {
      const allData = await summaryPromise;
      return {
        meta: allData.meta,
        categories: allData.categories,
        skills: allData.skills
      };
    }

    const buckets = filterBuckets(indexData.buckets, selection);
    const [allData, skills] = await Promise.all([
      summaryPromise,
      loadBuckets(buckets)
    ]);

    return {
      meta: allData.meta,
      categories: allData.categories,
      skills
    };
  }

  hub.data = {
    loadIndex,
    loadForSelection,
    prefetchAllData
  };
})();
