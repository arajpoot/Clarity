#!/usr/bin/env python3
"""Room isolation audit · Companion / University / Yawm"""
from pathlib import Path
import re, sys
ROOT = Path(__file__).resolve().parents[1]
fails = []

def check_no_companion_inline(folder, label):
    p = ROOT / folder
    if not p.exists():
        fails.append(f"{label}: folder missing ({folder})")
        return
    for f in p.rglob("*"):
        if f.suffix.lower() not in {".html", ".js", ".css", ".md"}: continue
        try:
            t = f.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        if "companion-inline" in t and "room-nav" not in str(f):
            # allow mention in docs
            if f.suffix == ".md": continue
            if re.search(r'companion-inline[/\'"]', t):
                fails.append(f"{label}: companion-inline reference in {f.relative_to(ROOT)}")

def check_room_nav(html_path, room):
    p = ROOT / html_path
    if not p.exists():
        fails.append(f"missing {html_path}")
        return
    t = p.read_text(encoding="utf-8", errors="replace")
    if "clarity-room-nav-v1.css" not in t and "clarity-room-nav" not in t:
        fails.append(f"{room}: room-nav not linked in {html_path}")
    if f'data-clarity-room="{room}"' not in t and f"data-clarity-room='{room}'" not in t:
        # university/yawm use attribute on html
        if f'data-clarity-room="{room}"' not in t:
            fails.append(f"{room}: data-clarity-room missing on {html_path}")

check_no_companion_inline("daily", "Yawm")
check_no_companion_inline("campus", "University")
check_room_nav("companion/index.html", "companion")
if (ROOT / "daily/index.html").exists():
    check_room_nav("daily/index.html", "yawm")
if (ROOT / "campus/index.html").exists():
    check_room_nav("campus/index.html", "university")

# room-nav pure
rn = ROOT / "assets/room-nav/clarity-room-nav-v1.js"
if rn.exists():
    t = rn.read_text(encoding="utf-8", errors="replace")
    if "companion-inline" in t or "landing-v3" in t or "cu-desk" in t or "inline-clarity" in t:
        fails.append("room-nav JS must not couple to companion/campus modules")

if fails:
    print("FAIL")
    for f in fails: print(" -", f)
    sys.exit(1)
print("PASS · room isolation OK")
sys.exit(0)
