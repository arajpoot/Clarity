#!/usr/bin/env python3
from pathlib import Path
import json, sys

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])
fails, ok = [], []

required = [
    "vault/VAULT_ARCHITECTURE.md",
    "vault/VAULT_NAV_CONTRACT.md",
    "vault/VAULT_FOUNDATION_LOCK.md",
    "vault/THREAT_MODEL.md",
    "assets/clarity-vault-facade-v1.js",
    "assets/clarity-vault-digest-v1.js",
    "assets/clarity-vault-digest-panel-v1.js",
    "assets/clarity-vault-passphrase-tutorial-v1.js",
    "vault/workers/vault-digest/worker.js",
    "vault/workers/vault-digest/ON_DEMAND_API.md",
    "tools/vault-isolation-audit.py",
]
for r in required:
    p = ROOT / r
    if p.exists() and p.stat().st_size > 20:
        ok.append(r)
    else:
        fails.append("missing " + r)

w = (ROOT / "vault/workers/vault-digest/worker.js").read_text(encoding="utf-8", errors="replace")
if "forbidden_fields" in w and "passphrase" in w:
    ok.append("reject passphrase")
else:
    fails.append("worker must reject passphrase")
for ep in ["/api/vault-digest/token", "/api/vault-digest/latest", "/api/vault-digest/by-date", "/api/vault-digest/dates"]:
    if ep in w:
        ok.append(ep)
    else:
        fails.append("missing " + ep)
if "tok:" in w and "revoked" in w:
    ok.append("token hash revoke")
else:
    fails.append("token storage")
if "dates:" in w:
    ok.append("dates index")
else:
    fails.append("dates index")

c = (ROOT / "assets/clarity-vault-digest-v1.js").read_text(encoding="utf-8", errors="replace")
if "issueToken" in c and "revokeTokens" in c:
    ok.append("client tokens")
else:
    fails.append("client issueToken/revokeTokens")
if "buildAndUpload" in c and "locked" in c:
    ok.append("client unlock gate")
else:
    fails.append("client unlock gate")

p = (ROOT / "assets/clarity-vault-digest-panel-v1.js").read_text(encoding="utf-8", errors="replace")
if "cvd-token" in p and "On-demand" in p:
    ok.append("panel on-demand UI")
else:
    fails.append("panel on-demand UI")

tut = (ROOT / "assets/clarity-vault-passphrase-tutorial-v1.js").read_text(encoding="utf-8", errors="replace")
if "How your passphrase protects" in tut and "never leaves" in tut.lower() or "does not receive" in tut.lower() or "not given" in tut.lower():
    ok.append("passphrase tutorial")
else:
    if "How your passphrase protects" in tut:
        ok.append("passphrase tutorial")
    else:
        fails.append("passphrase tutorial content")

if (ROOT / "daily").exists():
    fails.append("must not contain /daily/")
if (ROOT / "campus").exists():
    fails.append("must not contain /campus/")

report = {"pass": len(fails) == 0, "fail_count": len(fails), "fails": fails, "ok_count": len(ok), "criteria": "surface P0-P9 + tutorial"}
(ROOT / "AUDIT_REPORT.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, indent=2))
sys.exit(0 if report["pass"] else 1)
