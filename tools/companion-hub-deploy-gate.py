#!/usr/bin/env python3
from pathlib import Path
import re, sys
html = Path(sys.argv[1]).read_text(encoding="utf-8", errors="replace")
fails=[]
if len(re.findall(r"</body\s*>", html, re.I))!=1: fails.append("body")
if len(re.findall(r"</html\s*>", html, re.I))!=1: fails.append("html")
if re.search(r"</html\s*>\s*\S", html, re.I): fails.append("junk")
if len(re.findall(r"clarity-vault-fortify-boot", html))!=1: fails.append("boots")
if len(re.findall(r"cloudflareinsights\.com/beacon", html))>1: fails.append("beacon")
print("PASS" if not fails else "FAIL "+",".join(fails))
sys.exit(0 if not fails else 1)
