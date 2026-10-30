#!/usr/bin/env python3
"""Yawm content audit S10 — source-led accept criteria.
Usage:
  python3 tools/yawm-content-audit.py
  python3 tools/yawm-content-audit.py /path/to/daily
Exit 0 = PASS, 1 = FAIL
"""
from pathlib import Path
import json, re, sys

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])
MODULES = ["now", "deed", "adhkar", "tasbeeh", "salah", "light"]

HUB_MUST = [
    "Yawm", "modules/now/", "modules/deed/", "modules/adhkar/",
    "modules/tasbeeh/", "modules/salah/", "modules/light/",
    "not a fatwa", "daily-banner", "وَالْعَصْرِ", "quran.com/103",
    "Muslim 1631", "سُبْحَانَ اللَّهِ", "Companion", "Campus",
]
HUB_MUST_NOT = [
    'id="yawm-qada"', 'id="yawm-note-text"', 'id="yawm-wudu"',
    "companion-inline", "productivemuslim", "Productive Muslim",
]

MOD_COMMON = [
    "yawm-mini-banner", "mod-pills", "Educational", "not a fatwa",
    "One way to act — not a ruling",
]
MOD_SPEC = {
    "now": ["quran.com/103", "muslim:2692", "Before Fajr", "After Fajr"],
    "deed": ["1631", "sunnah.com/muslim:1631", "Mark done", "Ṣaḥīḥ"],
    "adhkar": ["6306", "2692", "sunnah.com"],
    "tasbeeh": ["سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", "muslim:2692", "7563"],
    "salah": ["bukhari:159", "mosque timetable", "fard-map", "qaḍā"],
    "light": ["1631", "sunnah.com/muslim:1631", "not legal advice", "quran.com/103"],
}
ASSETS = [
    "assets/daily.css", "assets/js/yawm-hub.js", "assets/daily-banner.jpg",
    "assets/data/fard-map.json", "assets/adhkar/morning.json", "assets/adhkar/evening.json",
]
BLOG_BAN = ["productivemuslim", "muslim.sg"]

def main():
    fails, ok = [], []
    for a in ASSETS:
        p = ROOT / a
        if p.exists() and p.stat().st_size > 20:
            ok.append("asset " + a)
        else:
            fails.append("asset missing " + a)

    hub = ROOT / "index.html"
    if not hub.exists():
        fails.append("hub missing")
    else:
        t = hub.read_text(encoding="utf-8", errors="replace")
        for n in HUB_MUST:
            if n not in t and n.lower() not in t.lower():
                fails.append(f"hub missing '{n}'")
            else:
                ok.append(f"hub {n[:40]}")
        for n in HUB_MUST_NOT:
            if n in t or n.lower() in t.lower():
                fails.append(f"hub forbidden '{n}'")
            else:
                ok.append(f"hub clean {n[:28]}")
        if re.search(r'class="lead"[^>]*>\s*…', t):
            fails.append("hub lead still has …")
        else:
            ok.append("hub no lead ellipsis")

    for slug in MODULES:
        p = ROOT / f"modules/{slug}/index.html"
        if not p.exists():
            fails.append(f"module missing {slug}")
            continue
        t = p.read_text(encoding="utf-8", errors="replace")
        for n in MOD_COMMON + MOD_SPEC.get(slug, []):
            if n not in t and n.lower() not in t.lower():
                fails.append(f"{slug}: missing '{n}'")
            else:
                ok.append(f"{slug}: {n[:36]}")
        if "</body>" not in t:
            fails.append(f"{slug}: missing </body>")
        for b in BLOG_BAN:
            if b in t.lower():
                fails.append(f"{slug}: blog '{b}'")

    # tree-wide blog scan
    for p in ROOT.rglob("*.html"):
        t = p.read_text(encoding="utf-8", errors="replace").lower()
        for b in BLOG_BAN:
            if b in t:
                fails.append(f"blog in {p.relative_to(ROOT)}")

    report = {
        "root": str(ROOT),
        "pass": len(fails) == 0,
        "fail_count": len(fails),
        "ok_count": len(ok),
        "fails": fails,
        "ok_sample": ok[:50],
        "criteria": "S10 source-led",
    }
    (ROOT / "AUDIT_REPORT.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({"pass": report["pass"], "fail_count": report["fail_count"], "fails": fails}, indent=2))
    return 0 if report["pass"] else 1

if __name__ == "__main__":
    sys.exit(main())
