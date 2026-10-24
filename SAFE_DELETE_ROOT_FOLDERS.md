# Safe delete guide · 20261024NEST

## Nested under campus (source of truth)

| New path | Role |
|----------|------|
| `/campus/lab/` | Lab hub + all studios (Arabic, Tajweed, Recite, …) |
| `/campus/library/` | Source shelves |
| `/campus/vault/` | University vault |
| `/campus/charter/` | Full university charter |

## Root bridges (temporary)

Root `/lab/`, `/library/`, `/vault/`, `/charter/` contain **redirect stubs only**.
They keep old bookmarks working.

## When is it safe to delete root folders?

**Only after all of the following:**

1. Deploy this package to main root.
2. Hard-refresh and verify:
   - https://clarity-dawah.fyi/campus/lab/
   - https://clarity-dawah.fyi/campus/library/
   - https://clarity-dawah.fyi/campus/vault/
   - https://clarity-dawah.fyi/campus/charter/
   - Studio deep links: `/campus/lab/arabic/`, `/campus/lab/tajweed/`, …
3. Confirm redirects still work once:
   - `/lab/` → `/campus/lab/`
   - `/library/` → `/campus/library/`
4. Grep the **rest of the repo** (Companion root `index.html`, etc.) for `href="/lab/"` and update to `/campus/lab/` (or leave stubs).
5. Companion Amanah stays at `/` — **do not** move Companion into campus.

### Safe to delete from GitHub main root (after step 1–4)

```
lab/          (except you may keep stub index.html one release)
library/
vault/
charter/
```

**Do not delete:**

```
campus/
assets/          (if Companion still uses root assets)
index.html       (Companion)
```

### Not safe yet if

- Companion or external links still hard-code `/lab/` without stub
- `/campus/lab/` 404s after deploy
- Studio scripts 404 on `/campus/lab/shared/...`

## Simulation result (package build)

See `SMOKE_NEST.json` — nested pages present, rewrites applied, stubs present.
