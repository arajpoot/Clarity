#!/usr/bin/env python3
from pathlib import Path
import re, sys
html = Path(sys.argv[1] if len(sys.argv) > 1 else "index.html").read_text(encoding="utf-8", errors="replace")
fails = []
if len(re.findall(r"</body\s*>", html, re.I)) != 1: fails.append("body_close")
if len(re.findall(r"</html\s*>", html, re.I)) != 1: fails.append("html_close")
if re.search(r"</html\s*>\s*\S", html, re.I): fails.append("post_html_junk")
if len(re.findall(r"clarity-vault-fortify-boot", html)) != 1: fails.append("boots")
if len(re.findall(r"cloudflareinsights\.com/beacon", html)) > 1: fails.append("beacon_dup")
print("PASS" if not fails else "FAIL " + ",".join(fails))
sys.exit(0 if not fails else 1)
