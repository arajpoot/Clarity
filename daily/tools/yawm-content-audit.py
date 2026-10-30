#!/usr/bin/env python3
"""Yawm content audit — verify hub + six modules before marking final.
Educational structure only — not a fatwa checker.
Usage: python3 tools/yawm-content-audit.py [path-to-daily]
Exit 0 = PASS, 1 = FAIL
"""
from pathlib import Path
import json, re, sys

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])

MODULES = ["now", "deed", "adhkar", "tasbeeh", "salah", "light"]

# Required signals per surface
HUB_MUST = [
    "Yawm", "modules/now/", "modules/deed/", "modules/adhkar/",
    "modules/tasbeeh/", "modules/salah/", "modules/light/",
    "not a fatwa", "daily-banner", "yawm-hub", "Companion", "Campus",
]
HUB_MUST_NOT = [
    'id="yawm-qada"', 'id="yawm-note-text"', 'id="yawm-wudu"',
    "companion-inline",
]

MOD_COMMON = [
    "yawm-mini-banner", "mod-pills", "enrich-block", "ext-links",
    "Educational", "not a fatwa",
]

MOD_SPEC = {
    "now": ["51:18", "day shape", "modules/adhkar"],
    "deed": ["Do this today", "1631", "sendlight", "Mark done"],
    "adhkar": ["2692", "6306", "morning.json", "Next dhikr"],
    "tasbeeh": ["7563", "2692", "tasbeeh"],
    "salah": ["Farḍ", "fard-map", "wuḍū", "qaḍā", "2:45"],
    "light": ["1631", "protection", "vaultnote", "103"],
}

ASSETS = [
    "assets/daily.css",
    "assets/js/yawm-hub.js",
    "assets/daily-banner.jpg",
    "assets/data/deed-bank.json",
    "assets/data/protection-set.json",
    "assets/data/send-light.json",
    "assets/data/fard-map.json",
    "assets/adhkar/morning.json",
    "assets/adhkar/evening.json",
]

def has(text, needle):
    return needle.lower() in text.lower() if needle.isascii() and needle.islower() is False else (needle in text or needle.lower() in text.lower())

def check_file(rel, needles, must_not=None):
    p = ROOT / rel
    fails = []
    if not p.exists():
        return [f"MISSING file {rel}"]
    t = p.read_text(encoding="utf-8", errors="replace")
    for n in needles:
        if n not in t and n.lower() not in t.lower():
            # special unicode tolerant
            if not any(n in t for _ in [0]):
                fails.append(f"{rel}: missing '{n}'")
    if must_not:
        for n in must_not:
            if n in t:
                fails.append(f"{rel}: forbidden '{n}' still present")
    return fails

def main():
    fails = []
    ok = []

    # assets
    for a in ASSETS:
        if (ROOT / a).exists() and (ROOT / a).stat().st_size > 20:
            ok.append(f"asset {a}")
        else:
            fails.append(f"asset missing/empty {a}")

    # hub
    hub = ROOT / "index.html"
    if not hub.exists():
        fails.append("hub index.html missing")
    else:
        t = hub.read_text(encoding="utf-8", errors="replace")
        for n in HUB_MUST:
            if n not in t and n.lower() not in t.lower():
                fails.append(f"hub missing '{n}'")
            else:
                ok.append(f"hub has {n[:40]}")
        for n in HUB_MUST_NOT:
            if n in t:
                fails.append(f"hub still has forbidden '{n}'")
            else:
                ok.append(f"hub clean of {n[:30]}")
        # build id
        m = re.search(r'yawm-build" content="([^"]+)"', t)
        build = m.group(1) if m else "unknown"
        ok.append(f"build {build}")

    # modules
    for slug in MODULES:
        rel = f"modules/{slug}/index.html"
        p = ROOT / rel
        if not p.exists():
            fails.append(f"module missing {slug}")
            continue
        t = p.read_text(encoding="utf-8", errors="replace")
        for n in MOD_COMMON + MOD_SPEC.get(slug, []):
            if n not in t and n.lower() not in t.lower():
                fails.append(f"{slug}: missing '{n}'")
            else:
                ok.append(f"{slug}: {n[:36]}")
        # closed tags
        if t.count("<html") and "</html>" not in t:
            fails.append(f"{slug}: unclosed html")
        if "</body>" not in t:
            fails.append(f"{slug}: missing </body>")

    # icon presence for tiles (optional soft)
    icons_dir = ROOT / "assets" / "icons"
    if icons_dir.exists():
        ok.append(f"icons dir {len(list(icons_dir.glob('*.svg')))} svgs")
    else:
        fails.append("assets/icons missing")

    report = {
        "root": str(ROOT),
        "pass": len(fails) == 0,
        "fail_count": len(fails),
        "ok_count": len(ok),
        "fails": fails,
        "ok_sample": ok[:40],
    }
    out = ROOT / "AUDIT_REPORT.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({"pass": report["pass"], "fail_count": report["fail_count"], "fails": fails}, indent=2))
    return 0 if report["pass"] else 1

if __name__ == "__main__":
    sys.exit(main())
