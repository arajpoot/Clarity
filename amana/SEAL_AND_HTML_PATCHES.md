# Seal + HTML patches (Phase 0–1)

Educational only — not a fatwa.

## 1. Room-nav seal (Tree + Farāʾiḍ + other Amānah chambers when touched)

**Find:**
```html
<p class="crn-seal">Four rooms · educational only · not a fatwa</p>
```

**Replace with:**
```html
<p class="crn-seal">Five rooms · educational only · not a fatwa</p>
```

Apply at minimum on:
- `amana/tree/index.html`
- `amana/fiqh/index.html`

Prefer also gate and other chambers for consistency (chrome only; no feature change).

## 2. Craft tile in static nav markup (if missing)

Room-nav JS already upgrades rails to include Craft. Static HTML may still list four `<a data-room-link>`. Optional additive patch after Amānah link:

```html
<a href="/craft/" data-room-link="craft"><span class="crn-ico">✒️</span><span class="crn-label">Craft</span></a>
```

Enrichment: held (additive tile already provided by shared nav).

## 3. Tree index.html script order (Phase 1 target)

After core + registry-deep, load **one** stable bridge:

```html
<script defer src="/amana/assets/amana-uft-viewport-stable-v1.js?v=20261106P1"></script>
```

Then keep dock, layout-h, print, plaque, file-ops, living-centre.

**Deprecate from load (do not delete files yet):**
- `inline-clarity_uft_viewport_recover.js` (absorbed)
- Prefer not double-running full `amana-uft-visual-fix-v1.js` + `amana-uft-build-viewport-v1.js` if stable bridge covers preview + sync; **if build panel inject still required from build-viewport, keep build-viewport until panel HTML is inlined into stable v1 in a follow-up**.

Phase 1 minimum: **ensurePreview + syncRegistryToCards + integrity + status** via stable v1 **in addition to** existing bridges (safe, no capability drop). Full collapse of bridges = Phase 1.1 optional.

## 4. Root repo file replacements

Copy pack files over live paths:

| Pack path | Repo path |
|-----------|-----------|
| `docs/ARCHITECTURE.md` | `ARCHITECTURE.md` |
| `docs/NAV_CONTRACT.md` | `NAV_CONTRACT.md` |
| `amana/ARCHITECTURE.md` | `amana/ARCHITECTURE.md` |
| `amana/NAV_CONTRACT.md` | `amana/NAV_CONTRACT.md` |
| `assets-outline/amana-uft-viewport-stable-v1.js` | `amana/assets/amana-uft-viewport-stable-v1.js` |

## 5. Enrichment

- No educational surface removed.
- Seal text only: four → five.
- Stable bridge is additive reliability.
