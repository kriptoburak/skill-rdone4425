#!/usr/bin/env python3
"""
discover-skills.py — 自动发现 GitHub 上的新 AI Agent Skills 仓库

搜索策略：
  1. 搜索 "agent skills" / "codex skills" / "claude code skills" 等关键词
  2. 过滤：stars >= 100，最近 6 个月内有更新
  3. 排除已在 data.js 中的仓库
  4. 将新发现的仓库追加到 data.js

输出：
  - js/data.js（追加新发现的 skills）
  - 发现报告打印到 stdout

环境变量：
  GITHUB_TOKEN — 必须（搜索 API 需要认证）

Author: rdone4425
License: MIT
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import urllib.parse
from pathlib import Path
from datetime import datetime, timedelta

# ============================================================
# 配置
# ============================================================
REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_JS_PATH = REPO_ROOT / "js" / "data.js"

GITHUB_API = "https://api.github.com"

GITHUB_TOKEN = (
    os.environ.get("GITHUB_TOKEN")
    or os.environ.get("GH_TOKEN")
    or os.environ.get("GIT_TOKEN")
    or ""
)

# 搜索查询列表
SEARCH_QUERIES = [
    "agent skills codex",
    "claude code skills",
    "codex skills awesome",
    "AI agent skills curated",
    "LLM agent skills",
    "cursor skills agent",
    "copilot agent skills",
    "gemini CLI skills",
]

# 最低 stars 阈值
MIN_STARS = 100

# 最近 N 个月内更新过
MAX_AGE_MONTHS = 6

# 每个查询最多取多少结果
MAX_PER_QUERY = 30

# ============================================================
# HTTP 工具
# ============================================================
def http_get(url, timeout=15, retries=3):
    headers = {
        "User-Agent": "skill-hub-discover/1.0",
        "Accept": "application/vnd.github+json",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"

    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            if e.code == 401:
                print(f"  ✗ HTTP 401 Unauthorized", file=sys.stderr)
                return None
            elif e.code == 429 or (e.code == 403 and "rate limit" in (e.reason or "").lower()):
                wait = int(e.headers.get("Retry-After", 60))
                print(f"  ⏳ Rate limited, waiting {wait}s...", file=sys.stderr)
                time.sleep(min(wait, 120))
                last_err = e
            elif e.code == 404:
                return None
            elif e.code == 422:
                # Validation error (search query issue)
                return None
            else:
                last_err = e
                time.sleep(2 ** attempt)
        except (urllib.error.URLError, TimeoutError) as e:
            last_err = e
            time.sleep(2 ** attempt)

    print(f"  ✗ Failed after {retries} retries: {last_err}", file=sys.stderr)
    return None


def http_get_json(url, **kwargs):
    data = http_get(url, **kwargs)
    if data is None:
        return None
    try:
        return json.loads(data)
    except json.JSONDecodeError as e:
        print(f"  ✗ JSON parse error: {e}", file=sys.stderr)
        return None


# ============================================================
# 搜索 GitHub
# ============================================================
def search_repos(query, sort="stars", order="desc", per_page=30):
    """搜索 GitHub 仓库。"""
    params = urllib.parse.urlencode({
        "q": query,
        "sort": sort,
        "order": order,
        "per_page": per_page,
    })
    url = f"{GITHUB_API}/search/repositories?{params}"
    result = http_get_json(url)
    if not result or "items" not in result:
        return []
    return result["items"]


def load_existing_repos():
    """从 data.js 加载已有的仓库 full_name 列表。"""
    if not DATA_JS_PATH.exists():
        return set()
    text = DATA_JS_PATH.read_text(encoding="utf-8")
    # 匹配 "repo": "owner/name" 格式
    repos = re.findall(r'"repo":\s*"([^"]+)"', text)
    return set(repos)


def classify_source(repo_info):
    """根据仓库信息推断分类。"""
    name = (repo_info.get("name") or "").lower()
    desc = (repo_info.get("description") or "").lower()
    topics = [t.lower() for t in (repo_info.get("topics") or [])]
    full_name = repo_info.get("full_name", "")

    # 社区清单
    if "awesome" in name or "awesome" in desc or "curated-list" in topics:
        return "community", None

    # 工具类
    tool_keywords = ["cli", "proxy", "router", "wrapper", "tool", "installer"]
    if any(kw in name or kw in desc for kw in tool_keywords):
        return "tools", None

    # 通用 agent skills
    return "general", None


def infer_install_cmd(full_name, repo_info):
    """推断安装命令。"""
    lang = (repo_info.get("language") or "").lower()
    name = repo_info.get("name", "")
    desc = (repo_info.get("description") or "").lower()

    if "awesome" in name.lower() or "curated" in desc:
        return f"git clone https://github.com/{full_name}.git  # browse the awesome list"

    if lang == "go":
        return f"go install github.com/{full_name}@latest"
    elif lang in ("javascript", "typescript"):
        # 尝试用 npm
        return f"npm i -g {name}"
    else:
        return f"git clone https://github.com/{full_name}.git"


# ============================================================
# 主流程
# ============================================================
def main():
    today = time.strftime("%Y-%m-%d")
    print(f"🔍 Skill Hub — discover-skills.py @ {today}")
    print(f"   GITHUB_TOKEN: {'set' if GITHUB_TOKEN else 'NOT set'}")

    if not GITHUB_TOKEN:
        print("   ⚠️  No GITHUB_TOKEN — search API rate limit is 10/min, may be slow")
    print()

    # 加载已有仓库
    existing = load_existing_repos()
    print(f"📦 Existing repos in data.js: {len(existing)}")
    print()

    # 搜索新仓库
    discovered = {}  # full_name → repo_info
    cutoff = datetime.utcnow() - timedelta(days=MAX_AGE_MONTHS * 30)

    for query in SEARCH_QUERIES:
        print(f"🔎 Searching: \"{query}\"")
        items = search_repos(query, per_page=MAX_PER_QUERY)
        new_count = 0

        for item in items:
            full_name = item["full_name"]

            # 跳过已有的
            if full_name in existing:
                continue

            # 跳过 stars 不够的
            stars = item.get("stargazers_count", 0)
            if stars < MIN_STARS:
                continue

            # 跳过太久没更新的
            updated = item.get("updated_at", "")
            if updated:
                try:
                    update_dt = datetime.fromisoformat(updated.replace("Z", "+00:00")).replace(tzinfo=None)
                    if update_dt < cutoff:
                        continue
                except (ValueError, TypeError):
                    pass

            # 跳过已发现的
            if full_name in discovered:
                continue

            discovered[full_name] = item
            new_count += 1

        print(f"  → Found {new_count} new candidates (total: {len(discovered)})")
        time.sleep(2)  # 搜索 API 限流

    print(f"\n📊 Total new candidates: {len(discovered)}")

    if not discovered:
        print("✅ No new skills discovered. Data is up to date.")
        return

    # 构建新 skills 数据
    new_skills = []
    for full_name, info in sorted(discovered.items(), key=lambda x: x[1].get("stargazers_count", 0), reverse=True):
        source, group = classify_source(info)
        name = info.get("name", full_name.split("/")[-1])
        desc = (info.get("description") or "")[:240]
        stars = info.get("stargazers_count", 0)
        install = infer_install_cmd(full_name, info)

        skill = {
            "name": name,
            "source": source,
            "group": group,
            "repo": full_name,
            "stars": stars,
            "desc": desc,
            "url": info.get("html_url", f"https://github.com/{full_name}"),
            "install": install,
        }
        new_skills.append(skill)
        print(f"  ✓ {full_name} ⭐{stars:,} [{source}]")

    # 读取现有 data.js 并追加
    if not DATA_JS_PATH.exists():
        print("❌ data.js not found! Run fetch-skills.py first.")
        return

    text = DATA_JS_PATH.read_text(encoding="utf-8")

    # 找到 skills 数组的最后一个元素，在 ] 之前插入新 skills
    # 用正则找到最后一个 } 之后的 ]
    # 更安全的方式：解析 JSON
    match = re.search(r'window\.SKILL_DATA\s*=\s*', text)
    if not match:
        print("❌ Cannot parse data.js format")
        return

    json_start = match.end()
    json_text = text[json_start:]
    # 去掉末尾的 ;
    json_text = json_text.rstrip().rstrip(";").strip()

    try:
        data = json.loads(json_text)
    except json.JSONDecodeError as e:
        print(f"❌ JSON parse error: {e}")
        return

    # 追加新 skills
    existing_names = {s["name"] for s in data.get("skills", [])}
    added = 0
    for skill in new_skills:
        if skill["name"] not in existing_names:
            data["skills"].append(skill)
            existing_names.add(skill["name"])
            added += 1

    # 更新 meta
    data["meta"]["lastUpdated"] = today
    data["meta"]["totalCount"] = len(data["skills"])
    sources = set(s["repo"] for s in data["skills"])
    data["meta"]["sources"] = len(sources)

    # 写回文件
    with open(DATA_JS_PATH, "w", encoding="utf-8") as f:
        f.write("/**\n")
        f.write(" * Skill Hub — data\n")
        f.write(" * 自动生成，请勿手动编辑。运行 `python scripts/fetch-skills.py` 重新生成。\n")
        f.write(" */\n\n")
        f.write("window.SKILL_DATA = ")
        f.write(json.dumps(data, ensure_ascii=False, indent=2))
        f.write(";\n")

    print(f"\n✅ Added {added} new skills to data.js")
    print(f"   Total skills: {len(data['skills'])}")
    print(f"   Total sources: {len(sources)}")

    # 输出新发现的仓库列表（方便手动检查）
    print(f"\n📋 New skills added:")
    for skill in new_skills:
        if skill["name"] in {s["name"] for s in new_skills[:added]}:
            print(f"   - {skill['repo']} ⭐{skill['stars']:,} [{skill['source']}]")

    return added


if __name__ == "__main__":
    try:
        result = main()
        sys.exit(0 if result is not None else 1)
    except KeyboardInterrupt:
        print("\n🛑 Interrupted")
        sys.exit(130)
