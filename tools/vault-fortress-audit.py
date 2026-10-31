#!/usr/bin/env python3
"""Deep security audit for Amānah sealed vault tree."""
from pathlib import Path
import json, sys, re

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])
fails, warns, ok = [], [], []

sealed = ROOT / "vault" / "sealed"
required = [
    "facade-v1.js", "isolate-guard-v1.js", "digest-v1.js", "digest-panel-v1.js",
    "export-host-v1.js", "passphrase-tutorial-v1.js", "runtime-gate-v1.js",
    "dayn-section-bridge-v2.js", "dayn-mount-adapter-v1.js", "dayn-ledger-v2.js", "dayn-enrich-v3.js",
]
for r in required:
    p = sealed / r
    if p.exists() and p.stat().st_size > 40:
        ok.append("sealed/" + r)
    else:
        fails.append("missing sealed/" + r)

boot = (ROOT / "assets" / "clarity-vault-fortify-boot-v1.js").read_text(encoding="utf-8", errors="replace")
if "/vault/sealed/" in boot:
    ok.append("boot points to sealed")
else:
    fails.append("boot must load /vault/sealed/")
if "dayn-ledger-v2" in boot and "digest-v1" in boot:
    ok.append("boot script list")
else:
    fails.append("boot incomplete list")

# Sealed must not contain campus/daily paths
for p in sealed.glob("*.js"):
    t = p.read_text(encoding="utf-8", errors="replace")
    if "/campus/" in t or "edit campus" in t.lower():
        fails.append(f"{p.name} references campus")
    # passphrase must not be posted
    if re.search(r"passphrase\s*:\s*", t) and "forbidden" not in t.lower():
        if "digest" in p.name and "passphrase" in t:
            # digest client should not send passphrase field
            if "body.passphrase" in t or 'passphrase:' in t and "POST" in t:
                fails.append(f"{p.name} may send passphrase")
    if "clarity_dayn_ledger_v1" in t and "dayn" in p.name:
        ok.append(f"{p.name} dayn key")

worker = ROOT / "vault" / "workers" / "vault-digest" / "worker.js"
if worker.exists():
    w = worker.read_text(encoding="utf-8", errors="replace")
    if "forbidden_fields" in w and "passphrase" in w:
        ok.append("worker rejects passphrase")
    else:
        fails.append("worker passphrase reject")
    if "/api/vault-digest/token" in w:
        ok.append("token routes")
else:
    warns.append("worker optional missing")

# assets should not be the only copy of sealed logic — boot is thin
if "buildCsv" in boot:
    fails.append("boot must stay thin (no business logic)")
else:
    ok.append("boot thin")

if (ROOT / "daily").exists() or (ROOT / "campus").exists():
    fails.append("package must not include daily/campus trees")

report = {
    "pass": len(fails) == 0,
    "fail_count": len(fails),
    "fails": fails,
    "warns": warns,
    "ok_count": len(ok),
    "ok": ok[:30],
}
(ROOT / "FORTRESS_AUDIT_REPORT.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, indent=2))
sys.exit(0 if report["pass"] else 1)
