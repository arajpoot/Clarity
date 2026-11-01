#!/usr/bin/env python3
from pathlib import Path
import re, sys
h = Path(sys.argv[1]).read_text(encoding="utf-8", errors="replace")
f = []
if len(re.findall(r"</body\s*>", h, re.I)) != 1: f.append("body")
if len(re.findall(r"</html\s*>", h, re.I)) != 1: f.append("html")
if re.search(r"</html\s*>\s*\S", h, re.I): f.append("junk")
if len(re.findall(r"clarity-vault-fortify-boot", h)) != 1: f.append("boots")
if len(re.findall(r"cloudflareinsights\.com/beacon", h)) > 1: f.append("beacon")
print("PASS" if not f else "FAIL " + ",".join(f))
sys.exit(0 if not f else 1)
