#!/usr/bin/env python3
"""
Generate sitemap.xml for Skill Hub.
Scans categories/ directories to collect all skill repos and pages.
Run from the repo root:
    python3 scripts/generate_sitemap.py
"""
import json
import os
import glob
from datetime import datetime, timezone

SITE_URL = "https://rdone4425.github.io/skill"
OUT_FILE = "sitemap.xml"
CATEGORIES_DIR = "categories"


def load_categories():
    """Load the categories index."""
    index_path = os.path.join(CATEGORIES_DIR, "index.json")
    with open(index_path, encoding="utf-8") as f:
        return json.load(f)


def load_all_skills():
    """Load all skill data from category subdirectories."""
    skills = []
    for skills_file in glob.glob(f"{CATEGORIES_DIR}/**/skills.json", recursive=True):
        try:
            with open(skills_file, encoding="utf-8") as f:
                data = json.load(f)
                skills.extend(data.get("skills", []))
        except (json.JSONDecodeError, IOError) as e:
            print(f"Warning: could not read {skills_file}: {e}")
    return skills


def escape_xml(s):
    """Basic XML escaping."""
    return (s
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
            .replace("'", "&apos;"))


def generate_sitemap():
    urls = []

    # Homepage
    urls.append({
        "loc": f"{SITE_URL}/",
        "priority": "1.0",
        "changefreq": "daily",
    })

    # Stats page
    urls.append({
        "loc": f"{SITE_URL}/stats.html",
        "priority": "0.6",
        "changefreq": "weekly",
    })

    # Load skills for category pages
    all_skills = load_all_skills()
    seen_repos = set()
    categories = load_categories()

    # Collect top-level categories
    if "groups" in categories:
        for group in categories["groups"]:
            cat_id = escape_xml(str(group.get("id", "")))
            urls.append({
                "loc": f"{SITE_URL}/?category={cat_id}",
                "priority": "0.8",
                "changefreq": "weekly",
            })
            # Subcategories
            for sub in group.get("subcategories", []):
                sub_id = escape_xml(str(sub.get("subcategoryId", "")))
                urls.append({
                    "loc": f"{SITE_URL}/?category={cat_id}&sub={sub_id}",
                    "priority": "0.7",
                    "changefreq": "weekly",
                })

    # Individual skill repo pages (deduplicated)
    for skill in all_skills:
        repo = skill.get("repo", "")
        if repo and repo not in seen_repos:
            seen_repos.add(repo)
            # Skill detail page on GitHub
            urls.append({
                "loc": f"https://github.com/{repo}",
                "priority": "0.5",
                "changefreq": "monthly",
                "is_external": True,
            })

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    for entry in urls:
        lines.append("  <url>")
        lines.append(f"    <loc>{escape_xml(entry['loc'])}</loc>")
        lines.append(f"    <lastmod>{now}</lastmod>")
        lines.append(f"    <changefreq>{entry['changefreq']}</changefreq>")
        lines.append(f"    <priority>{entry['priority']}</priority>")
        lines.append("  </url>")

    lines.append("</urlset>")

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"[sitemap] Generated {OUT_FILE} with {len(urls)} URLs ({len(seen_repos)} unique repos)")
    return len(urls)


if __name__ == "__main__":
    count = generate_sitemap()
    print(f"Done: {count} URLs written to {OUT_FILE}")
