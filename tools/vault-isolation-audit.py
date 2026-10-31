#!/usr/bin/env python3
from pathlib import Path
import json, sys
ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])
fails, ok = [], []
required = [
  "assets/clarity-vault-fortify-boot-v1.js",
  "assets/clarity-vault-facade-v1.js",
  "assets/clarity-vault-digest-v1.js",
  "assets/clarity-vault-digest-panel-v1.js",
  "assets/clarity-vault-passphrase-tutorial-v1.js",
  "assets/clarity-vault-export-host-v1.js",
  "vault/patches/daily-note-vault-pill.js",
  "vault/ONE_LINE_DEPLOY.html",
  "DEPLOY_SIMPLE.md",
  "vault/workers/vault-digest/worker.js",
]
for r in required:
  p = ROOT/r
  if p.exists() and p.stat().st_size > 20: ok.append(r)
  else: fails.append("missing "+r)
boot = (ROOT/"assets/clarity-vault-fortify-boot-v1.js").read_text(encoding="utf-8", errors="replace")
for s in ["clarity-vault-facade", "clarity-vault-digest", "passphrase-tutorial", "daily-note-vault-pill", "export-host"]:
  if s in boot: ok.append("boot loads "+s)
  else: fails.append("boot missing "+s)
w = (ROOT/"vault/workers/vault-digest/worker.js").read_text(encoding="utf-8", errors="replace")
if "forbidden_fields" in w and "passphrase" in w: ok.append("worker rejects passphrase")
else: fails.append("worker passphrase")
if "/api/vault-digest/token" in w: ok.append("token API")
else: fails.append("token API")
if (ROOT/"daily").exists(): fails.append("daily must not exist")
if (ROOT/"campus").exists(): fails.append("campus must not exist")
report = {"pass": len(fails)==0, "fail_count": len(fails), "fails": fails, "ok_count": len(ok)}
(ROOT/"AUDIT_REPORT.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, indent=2))
sys.exit(0 if report["pass"] else 1)
