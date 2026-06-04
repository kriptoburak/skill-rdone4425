#!/bin/bash
# discover-new-skills.sh — 搜索 GitHub 发现新 skill 仓库
# 由 Hermes 定时任务调用（每 3 小时）
# 只负责发现新仓库，写入 config/repos.json
# 不更新 stars（那是 GitHub Actions 的工作）

set -e

REPO_DIR="/root/skill"
cd "$REPO_DIR"

echo "🔍 Skill Hub — discover @ $(date -u +%Y-%m-%d_%H:%M:%S_UTC)"

# 检查是否有 GitHub token
if [ -z "$GITHUB_TOKEN" ] && [ -z "$GH_TOKEN" ]; then
    export GH_TOKEN=$(gh auth token 2>/dev/null || echo "")
fi

if [ -z "$GH_TOKEN" ] && [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ No GitHub token available."
    exit 1
fi

# 拉取最新代码
echo "📥 Pulling latest..."
git pull --rebase origin main 2>/dev/null || true

# 搜索发现新仓库
echo ""
python3 scripts/discover-skills.py 2>&1

# 检查 config/repos.json 是否有变化
echo ""
if git diff --quiet config/repos.json; then
    echo "✅ No new repos discovered."
    exit 0
fi

# 有新仓库，提交推送
echo "📝 New repos found! Committing..."
git config user.email "rdone4425@gmail.com"
git config user.name "rdone4425"
git add config/repos.json

NEW_COUNT=$(git diff --cached --numstat config/repos.json | awk '{print $1}' || echo "?")
DATE=$(date -u +"%Y-%m-%d %H:%M UTC")

git commit -m "chore: discover new skill repos

- Updated: $DATE
- Source: Hermes auto-discovery (every 3h)"

echo "📤 Pushing to main..."
git push origin main

echo ""
echo "✅ Done! New repos added to config/repos.json"
echo "   GitHub Actions will fetch their data on next run."
