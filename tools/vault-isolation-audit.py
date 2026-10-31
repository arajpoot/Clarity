#!/usr/bin/env python3
import re, sys, json
from pathlib import Path

def audit(html_path: str):
    html = Path(html_path).read_text(encoding="utf-8", errors="replace")
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html, re.I)
    local = [s.split("?")[0] for s in scripts if not s.startswith("http")]
    fortify = [s for s in local if "fortify-boot" in s or "fortress-boot" in s]
    sealed_direct = [s for s in local if "/vault/sealed/" in s]
    public_dayn = [s for s in local if re.search(r"dayn", s, re.I)]
    leftover = [s for s in local if re.search(r"vault|amana", s, re.I)
                and "fortify-boot" not in s and "legacy-quarantine" not in s]
    report = {
        "fortify_doors": fortify,
        "sealed_direct_in_html": sealed_direct,
        "public_dayn_script_tags": public_dayn,
        "leftover_public_vault_helpers": leftover,
        "has_quarantine": any("legacy-quarantine" in s for s in local)
            or "__CLARITY_VAULT_LEGACY_QUARANTINE" in html,
        "ok_door": len(fortify) >= 1,
        "ok_no_sealed_direct": len(sealed_direct) == 0,
        "ok_no_public_dayn_tags": len(public_dayn) == 0,
    }
    report["integrity"] = report["ok_door"] and report["ok_no_sealed_direct"] and report["ok_no_public_dayn_tags"]
    print(json.dumps(report, indent=2))
    return 0 if report["integrity"] else 1

if __name__ == "__main__":
    sys.exit(audit(sys.argv[1] if len(sys.argv) > 1 else "index.html"))
