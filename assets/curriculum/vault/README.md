## IT Wing (`admin/it/`)

CIO bridge between sealed foundation and upgradable edge. O&M as line crew.

## Grand Opening UX (`admin/ux/`)

Compass wayfinding · study focus · progressive density.

## Office of the Chancellor (`admin/chancellor/`)

Head of House — top educational officer of Clarity University.

# Clarity University — Sealed Vault

**Do not casually edit `foundation/`.**  
This block is the isolated form factor for curriculum, spark quizzes,
diplomas, phase plaque, and the administrator office.

## Public entry

Only load:

```html
<script src="./assets/curriculum/vault/boot.js" defer></script>
```

`boot.js` reads `SEAL.json`, verifies SHA-256 of foundation files,
injects them in order, then **freezes** public APIs so later scripts
cannot quietly replace the university stack.

## Layout

```
vault/
  SEAL.json          integrity + load order
  boot.js            sole public entry
  foundation/        sealed runtime (engine, colleges, diplomas, office…)
  admin/             registry, ledger schema, diploma templates
```

## Upgrade policy

- **Allowed:** new decorative UI outside this folder; new college *content* via admin JSON.
- **Not allowed:** overwriting `foundation/*.js` from unrelated “patch” packs without updating SEAL.json hashes.
- If integrity fails, a warning banner appears; learning data stays on-device.

Version: 1.0.0-sealed · Build: 20261009VAULT

Educational isolation only — not a cryptographic security product.


## Staff wing (`admin/staff/`)

Updatable workers **outside** sealed foundation:

| Worker | Role |
|--------|------|
| Ops Steward | Health of controllers / smooth module flow |
| Authenticity Clerk | Educational tone / fiqh-safety hygiene flags |
| Resource Scout | Allowlisted authentic sources → local upgrade inbox |

Load via `admin/staff/staff-dispatcher-v1.js` after vault boot.
Scout **proposes** material only — never rewrites `foundation/`.


## Faculty wing (`admin/faculty/`)

Secured teachers (one per phase). Countersign diplomas; handoff required to start the next phase.
In-module help popups; librarian + scout keep teachers sharp.
Educational personas only — not a living ijazah chain.


## Lab facility (`admin/lab/`)

Secured craft laboratory: calligraphy, tajweed, media, research, module-design atelier.


## Registrar (`admin/registrar/`)

Phase resume/redo desk. Future phases inert. Replaces hard reset-to-seeker.


## Security wing (`admin/security/`)

Smart auditors scan script wiring continuously and soft-repair pipes. Never rewrites foundation seal.


## O&M (`admin/om/`)

Operations & Maintenance crew — circulation through the form factor like blood in veins.
