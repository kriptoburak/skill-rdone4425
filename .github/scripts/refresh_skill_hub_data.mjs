#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const PRIMARY_AGENT_IDS = [
  "claude",
  "codex",
  "cursor",
  "copilot",
  "hermes",
  "opencode",
  "openclaw",
];

const AGENT_ALIASES = new Map([
  ["claude code", "claude"],
  ["claude", "claude"],
  ["codex cli", "codex"],
  ["openai codex", "codex"],
  ["codex", "codex"],
  ["cursor", "cursor"],
  ["github copilot", "copilot"],
  ["copilot", "copilot"],
  ["hermes agent", "hermes"],
  ["hermes", "hermes"],
  ["opencode", "opencode"],
  ["openclaw", "openclaw"],
  ["gemini cli", "gemini"],
  ["gemini", "gemini"],
  ["other", "other"],
  ["multi", "multi"],
]);

const AGENT_PATTERNS = [
  ["claude", /\bclaude(?:\s+code)?\b/i],
  ["codex", /\b(?:openai\s+codex|codex(?:\s+cli)?)\b/i],
  ["cursor", /\bcursor\b/i],
  ["copilot", /\b(?:github\s+copilot|copilot)\b/i],
  ["hermes", /\bhermes(?:\s+agent)?\b/i],
  ["opencode", /\bopencode\b/i],
  ["openclaw", /\bopenclaw\b/i],
  ["gemini", /\bgemini(?:\s+cli)?\b/i],
];

const LEGACY_CATEGORY_HIERARCHY = {
  "automation-productivity": { groupId: "automation", subcategoryId: "productivity" },
  "backend-api": { groupId: "backend", subcategoryId: "api" },
  "data-ai": { groupId: "data", subcategoryId: "ai" },
  "design-ui": { groupId: "design", subcategoryId: "ui" },
  "dev-tools": { groupId: "development", subcategoryId: "tools" },
  "devops-deploy": { groupId: "devops", subcategoryId: "deploy" },
  "docs-content": { groupId: "docs", subcategoryId: "content" },
  general: { groupId: "general", subcategoryId: "general" },
  security: { groupId: "security", subcategoryId: "general" },
  "testing-qa": { groupId: "testing", subcategoryId: "qa" },
};

function parseArgs(argv) {
  const args = {
    root: ".",
    dryRun: false,
    verbose: false,
    failOnMissing: false,
    maxSkills: 0,
    checkUrls: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--root") {
      args.root = argv[index + 1] || ".";
      index += 1;
      continue;
    }
    if (value === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (value === "--verbose") {
      args.verbose = true;
      continue;
    }
    if (value === "--fail-on-missing") {
      args.failOnMissing = true;
      continue;
    }
    if (value === "--max-skills") {
      args.maxSkills = Number.parseInt(argv[index + 1] || "0", 10) || 0;
      index += 1;
      continue;
    }
    if (value === "--check-urls") {
      args.checkUrls = true;
    }
  }

  return args;
}

function buildHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "skill-hub-maintenance",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function requestJson(url, headers) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function checkUrlExists(url, headers) {
  try {
    const head = await fetch(url, { method: "HEAD", headers });
    if (head.ok) return ["ok", null];
    if (head.status === 403 || head.status === 405) {
      const get = await fetch(url, { method: "GET", headers });
      if (get.ok) return ["ok", null];
      if (get.status === 404 || get.status === 410) return ["missing", `http-${get.status}`];
      return ["unknown", `http-${get.status}`];
    }
    if (head.status === 404 || head.status === 410) return ["missing", `http-${head.status}`];
    return ["unknown", `http-${head.status}`];
  } catch (error) {
    return ["unknown", error?.name || "Error"];
  }
}

async function withConcurrency(items, limit, iteratee) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await iteratee(items[index], index);
    }
  }

  const workerCount = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function dumpJson(payload) {
  return `${JSON.stringify(payload, null, 2)}\n`;
}

function writeIfChanged(filePath, text) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
  if (current === text) return false;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
  return true;
}

function normalizeCategoryPath(value) {
  return String(value || "")
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");
}

function listAgentBuckets(agentsRoot) {
  if (!fs.existsSync(agentsRoot)) return [];
  const buckets = [];
  for (const agentEntry of fs.readdirSync(agentsRoot, { withFileTypes: true })) {
    if (!agentEntry.isDirectory()) continue;
    const agentRoot = path.join(agentsRoot, agentEntry.name);
    for (const categoryEntry of fs.readdirSync(agentRoot, { withFileTypes: true })) {
      if (!categoryEntry.isDirectory()) continue;
      const skillsPath = path.join(agentRoot, categoryEntry.name, "skills.json");
      if (fs.existsSync(skillsPath)) {
        buckets.push({
          agent: agentEntry.name,
          category: categoryEntry.name,
          filePath: skillsPath,
        });
      }
    }
  }
  return buckets.sort((left, right) => left.filePath.localeCompare(right.filePath));
}

function resolveCategoryMeta(relativePath) {
  const normalizedPath = normalizeCategoryPath(relativePath);
  const legacy = LEGACY_CATEGORY_HIERARCHY[normalizedPath];
  if (legacy) {
    return {
      id: normalizedPath,
      path: normalizedPath,
      groupId: legacy.groupId,
      subcategoryId: legacy.subcategoryId,
    };
  }

  const parts = normalizedPath.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return {
      id: normalizedPath,
      path: normalizedPath,
      groupId: parts[0],
      subcategoryId: parts[1],
    };
  }

  const fallback = normalizedPath || "general";
  return {
    id: fallback,
    path: fallback,
    groupId: fallback,
    subcategoryId: fallback,
  };
}

function listCategoryLeaves(categoriesRoot) {
  if (!fs.existsSync(categoriesRoot)) return [];
  const leaves = [];

  function walk(currentRoot, parts) {
    if (parts.length > 2) return;
    const entries = fs.readdirSync(currentRoot, { withFileTypes: true });
    const childDirs = entries.filter((entry) => entry.isDirectory());
    const hasSkillsFile = fs.existsSync(path.join(currentRoot, "skills.json"));
    const relativePath = normalizeCategoryPath(parts.join("/"));

    if (parts.length > 0 && (hasSkillsFile || childDirs.length === 0)) {
      leaves.push({
        ...resolveCategoryMeta(relativePath),
        filePath: path.join(currentRoot, "skills.json"),
      });
    }

    if (parts.length >= 2) return;
    for (const child of childDirs) {
      walk(path.join(currentRoot, child.name), [...parts, child.name]);
    }
  }

  walk(categoriesRoot, []);
  return leaves.sort((left, right) => left.path.localeCompare(right.path));
}

function repoApiUrl(repo) {
  const [owner, name] = String(repo).split("/", 2);
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
}

function normalizeAgentId(value) {
  const key = String(value || "").trim().toLowerCase();
  return AGENT_ALIASES.get(key) || key || null;
}

function sortAgents(agentIds) {
  return [...new Set(agentIds.filter(Boolean))].sort((left, right) => {
    const leftIndex = PRIMARY_AGENT_IDS.indexOf(left);
    const rightIndex = PRIMARY_AGENT_IDS.indexOf(right);
    const safeLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const safeRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
    if (safeLeft !== safeRight) return safeLeft - safeRight;
    return left.localeCompare(right);
  });
}

function inferSupportedAgents(skill, sourceAgent, warnings) {
  const explicit = Array.isArray(skill.supportedAgents)
    ? sortAgents(skill.supportedAgents.map(normalizeAgentId))
    : [];
  if (explicit.length > 0) return explicit;

  const inferred = new Set();
  const normalizedSourceAgent = normalizeAgentId(sourceAgent || skill.sourceAgent || skill.agent);
  if (normalizedSourceAgent && normalizedSourceAgent !== "multi") {
    inferred.add(normalizedSourceAgent);
  }

  const haystack = [
    skill.name,
    skill.desc,
    skill.install,
    skill.url,
    skill.repo,
  ].filter(Boolean).join(" ");

  for (const [agentId, pattern] of AGENT_PATTERNS) {
    if (pattern.test(haystack)) {
      inferred.add(agentId);
    }
  }

  if (inferred.size === 0 && normalizedSourceAgent === "multi") {
    for (const agentId of PRIMARY_AGENT_IDS) {
      inferred.add(agentId);
    }
    warnings.push({
      category: skill.functionCategory,
      name: skill.name,
      repo: skill.repo,
      reason: "multi-source-fallback-all-platforms",
    });
  }

  if (inferred.size === 0) {
    warnings.push({
      category: skill.functionCategory,
      name: skill.name,
      repo: skill.repo,
      reason: "missing-supported-agents",
    });
  }

  return sortAgents([...inferred]);
}

function normalizeSkill(skill, categoryMeta, sourceAgent, warnings) {
  const categoryId = categoryMeta.id;
  const normalized = {
    name: String(skill.name || "").trim(),
    source: String(skill.source || "general").trim() || "general",
    sourceAgent: normalizeAgentId(sourceAgent || skill.sourceAgent || skill.agent) || "other",
    repo: String(skill.repo || "").trim(),
    stars: Number.parseInt(skill.stars || 0, 10) || 0,
    desc: String(skill.desc || "").trim(),
    url: String(skill.url || "").trim(),
    install: String(skill.install || "").trim(),
    functionCategory: categoryId,
    topCategoryId: categoryMeta.groupId,
    subCategoryId: categoryMeta.subcategoryId,
    categoryPath: categoryMeta.path,
  };

  const supportedAgents = inferSupportedAgents(
    { ...skill, functionCategory: categoryId },
    sourceAgent,
    warnings,
  );
  normalized.supportedAgents = supportedAgents;

  normalized.searchText = [
    normalized.name,
    normalized.desc,
    normalized.repo,
    normalized.install,
    normalized.functionCategory,
    ...supportedAgents,
  ].filter(Boolean).join(" ").toLowerCase();

  return normalized;
}

function dedupeSkills(skills) {
  const merged = new Map();
  for (const skill of skills) {
    const key = `${String(skill.repo || "").toLowerCase()}::${String(skill.name || "").toLowerCase()}`;
    const current = merged.get(key);
    if (!current) {
      merged.set(key, {
        ...skill,
        supportedAgents: sortAgents(skill.supportedAgents || []),
      });
      continue;
    }

    const betterDescription = String(current.desc || "").length >= String(skill.desc || "").length ? current.desc : skill.desc;
    const betterInstall = String(current.install || "").length >= String(skill.install || "").length ? current.install : skill.install;
    const betterUrl = current.url || skill.url;
    const betterStars = Math.max(Number(current.stars || 0), Number(skill.stars || 0));
    merged.set(key, {
      ...current,
      desc: betterDescription,
      install: betterInstall,
      url: betterUrl,
      stars: betterStars,
      source: current.source || skill.source,
      sourceAgent: current.sourceAgent || skill.sourceAgent,
      supportedAgents: sortAgents([...(current.supportedAgents || []), ...(skill.supportedAgents || [])]),
    });
  }

  return [...merged.values()].sort((left, right) => {
    if (right.stars !== left.stars) return right.stars - left.stars;
    const leftName = String(left.name || "").toLowerCase();
    const rightName = String(right.name || "").toLowerCase();
    if (leftName !== rightName) return leftName.localeCompare(rightName);
    return String(left.repo || "").toLowerCase().localeCompare(String(right.repo || "").toLowerCase());
  });
}

function buildCategoryPayload(categoryMeta, skills) {
  return {
    meta: {
      functionCategory: categoryMeta.id,
      topCategoryId: categoryMeta.groupId,
      subCategoryId: categoryMeta.subcategoryId,
      categoryPath: categoryMeta.path,
      count: skills.length,
      sourceData: "categories",
    },
    skills,
  };
}

function ensureCategoriesFromAgents(root, categoriesRoot) {
  const existingLeaves = listCategoryLeaves(categoriesRoot);
  if (existingLeaves.length > 0) return false;

  const agentBuckets = listAgentBuckets(path.join(root, "agents"));
  if (agentBuckets.length === 0) return false;

  const grouped = new Map();
  const warnings = [];
  for (const bucket of agentBuckets) {
    const payload = loadJson(bucket.filePath);
    const skillList = payload.skills || [];
    if (!grouped.has(bucket.category)) grouped.set(bucket.category, []);
    const categoryMeta = resolveCategoryMeta(bucket.category);
    const normalizedSkills = skillList.map((skill) => normalizeSkill(skill, categoryMeta, bucket.agent, warnings));
    grouped.get(bucket.category).push(...normalizedSkills);
  }

  fs.mkdirSync(categoriesRoot, { recursive: true });
  for (const [categoryId, skills] of grouped) {
    const categoryDir = path.join(categoriesRoot, categoryId);
    fs.mkdirSync(categoryDir, { recursive: true });
    const outputPath = path.join(categoryDir, "skills.json");
    const payload = buildCategoryPayload(resolveCategoryMeta(categoryId), dedupeSkills(skills));
    fs.writeFileSync(outputPath, dumpJson(payload), "utf8");
  }

  return true;
}

function ensureSkillsFiles(categoryLeaves) {
  for (const category of categoryLeaves) {
    const filePath = category.filePath;
    if (!fs.existsSync(filePath)) {
      const payload = buildCategoryPayload(category, []);
      fs.writeFileSync(filePath, dumpJson(payload), "utf8");
    }
  }
}

async function refreshCategoryData(root, args) {
  const categoriesRoot = path.join(root, "categories");
  fs.mkdirSync(categoriesRoot, { recursive: true });
  ensureCategoriesFromAgents(root, categoriesRoot);

  const categoryLeaves = listCategoryLeaves(categoriesRoot);
  ensureSkillsFiles(categoryLeaves);

  const headers = buildHeaders();
  const hasGitHubToken = Boolean(process.env.GITHUB_TOKEN);
  const repoCache = new Map();
  const urlCache = new Map();
  const missing = [];
  const warnings = [];
  let checked = 0;
  let starUpdates = 0;
  let fileChanged = 0;

  const categorySummaries = [];
  const allSkills = [];
  const categoryRows = [];

  for (const categoryMeta of categoryLeaves) {
    const payload = loadJson(categoryMeta.filePath);
    const rawSkills = Array.isArray(payload.skills) ? payload.skills : [];
    const normalizedSkills = dedupeSkills(
      rawSkills.map((skill) => normalizeSkill(skill, categoryMeta, skill.sourceAgent || skill.agent, warnings)),
    );
    categoryRows.push({
      categoryMeta,
      filePath: categoryMeta.filePath,
      skills: normalizedSkills,
    });
  }

  const uniqueRepos = [...new Set(categoryRows.flatMap((row) => row.skills.map((skill) => skill.repo).filter(Boolean)))];
  await withConcurrency(uniqueRepos, 12, async (repo) => {
    try {
      const repoPayload = await requestJson(repoApiUrl(repo), headers);
      repoCache.set(repo, ["ok", Number.parseInt(repoPayload.stargazers_count || 0, 10) || 0, null]);
    } catch (error) {
      const status = error?.status;
      if ((status === 403 || status === 429) && !hasGitHubToken) {
        repoCache.set(repo, ["skipped", null, `http-${status}-no-token`]);
        return;
      }
      if (status === 404 || status === 410) {
        repoCache.set(repo, ["missing", null, `http-${status}`]);
      } else {
        repoCache.set(repo, ["unknown", null, status ? `http-${status}` : (error?.name || "Error")]);
      }
    }
  });

  if (args.checkUrls) {
    const uniqueUrls = [...new Set(categoryRows.flatMap((row) => row.skills.map((skill) => skill.url).filter(Boolean)))];
    await withConcurrency(uniqueUrls, 16, async (url) => {
      urlCache.set(url, await checkUrlExists(url, headers));
    });
  }

  for (const row of categoryRows) {
    const { categoryMeta, filePath, skills } = row;
    const categoryId = categoryMeta.id;

    for (const skill of skills) {
      checked += 1;
      if (args.maxSkills > 0 && checked > args.maxSkills) break;

      if (skill.repo) {
        const [repoState, latestStars, repoReason] = repoCache.get(skill.repo);
        if (repoState === "ok" && typeof latestStars === "number" && latestStars !== skill.stars) {
          if (args.verbose) {
            console.log(`[stars] ${skill.repo}: ${skill.stars} -> ${latestStars}`);
          }
          skill.stars = latestStars;
          starUpdates += 1;
        }
        if (repoState === "missing") {
          missing.push({
            category: categoryId,
            name: skill.name,
            repo: skill.repo,
            url: skill.url,
            reason: `repo:${repoReason}`,
          });
        }
        if (repoState === "unknown") {
          warnings.push({
            category: categoryId,
            name: skill.name,
            repo: skill.repo,
            url: skill.url,
            reason: `repo:${repoReason}`,
          });
        }
      }

      if (args.checkUrls && skill.url) {
        const [urlState, urlReason] = urlCache.get(skill.url);
        if (urlState === "missing") {
          missing.push({
            category: categoryId,
            name: skill.name,
            repo: skill.repo,
            url: skill.url,
            reason: `url:${urlReason}`,
          });
        }
        if (urlState === "unknown") {
          warnings.push({
            category: categoryId,
            name: skill.name,
            repo: skill.repo,
            url: skill.url,
            reason: `url:${urlReason}`,
          });
        }
      }

      if (!skill.supportedAgents || skill.supportedAgents.length === 0) {
        warnings.push({
          category: categoryId,
          name: skill.name,
          repo: skill.repo,
          url: skill.url,
          reason: "missing-supported-agents",
        });
      }
    }

    const sortedSkills = dedupeSkills(skills);
    categorySummaries.push({
      id: categoryMeta.id,
      path: categoryMeta.path,
      groupId: categoryMeta.groupId,
      subcategoryId: categoryMeta.subcategoryId,
      count: sortedSkills.length,
    });
    allSkills.push(...sortedSkills);

    if (!args.dryRun) {
      const nextPayload = buildCategoryPayload(categoryMeta, sortedSkills);
      if (writeIfChanged(filePath, dumpJson(nextPayload))) {
        fileChanged += 1;
      }
    }
  }

  const platformCounts = new Map();
  for (const skill of allSkills) {
    for (const agentId of skill.supportedAgents || []) {
      platformCounts.set(agentId, (platformCounts.get(agentId) || 0) + 1);
    }
  }

  const groupMap = new Map();
  for (const category of categorySummaries) {
    if (!groupMap.has(category.groupId)) {
      groupMap.set(category.groupId, {
        id: category.groupId,
        count: 0,
        subcategories: [],
      });
    }
    const group = groupMap.get(category.groupId);
    group.count += category.count || 0;
    group.subcategories.push({
      id: category.id,
      path: category.path,
      subcategoryId: category.subcategoryId,
      count: category.count || 0,
    });
  }

  const indexPayload = {
    generatedAt: new Date().toISOString(),
    sourceData: "categories",
    totalSkills: allSkills.length,
    categories: categorySummaries.sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count;
      return left.id.localeCompare(right.id);
    }),
    groups: [...groupMap.values()]
      .map((group) => ({
        ...group,
        subcategories: group.subcategories.sort((left, right) => {
          if (right.count !== left.count) return right.count - left.count;
          return left.subcategoryId.localeCompare(right.subcategoryId);
        }),
      }))
      .sort((left, right) => {
        if (right.count !== left.count) return right.count - left.count;
        return left.id.localeCompare(right.id);
      }),
    platforms: [...platformCounts.entries()]
      .sort((left, right) => {
        if (right[1] !== left[1]) return right[1] - left[1];
        return left[0].localeCompare(right[0]);
      })
      .map(([id, count]) => ({ id, count })),
  };

  const healthPayload = {
    summary: {
      checkedSkills: checked,
      uniqueRepos: repoCache.size,
      missingCount: missing.length,
      warningCount: warnings.length,
      starUpdates,
      categories: groupMap.size,
      leafCategories: categorySummaries.length,
    },
    missing: missing.sort((left, right) => {
      if (left.category !== right.category) return left.category.localeCompare(right.category);
      return String(left.name || "").localeCompare(String(right.name || ""));
    }),
    warnings: warnings.sort((left, right) => {
      if (left.category !== right.category) return left.category.localeCompare(right.category);
      return String(left.name || "").localeCompare(String(right.name || ""));
    }),
  };

  if (!args.dryRun) {
    if (writeIfChanged(path.join(categoriesRoot, "index.json"), dumpJson(indexPayload))) {
      fileChanged += 1;
    }
    if (writeIfChanged(path.join(categoriesRoot, "health-report.json"), dumpJson(healthPayload))) {
      fileChanged += 1;
    }
  }

  console.log(
    `Checked ${checked} skills, refreshed ${starUpdates} star values, ` +
    `found ${missing.length} missing entries, ${warnings.length} warnings, changed ${fileChanged} files.`,
  );

  if (args.failOnMissing && missing.length > 0) {
    process.exitCode = 1;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args.root);
  await refreshCategoryData(root, args);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
