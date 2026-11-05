# Craft rich self-contained · C13 · smoked

**Bismillah.** Simulation cycles fixed desks/quiz/boot; hard cache-bust `?v=20261104C13`.

## Fixes vs C12
1. **Desks** bound `x-*` (page used `x-draft`; old script only bound `tw-*`) + `data-action` buttons
2. **Quiz** parses `path-quiz-bank.json` `transitions` (15 questions)
3. **Studio boot** retries `ClarityTajweedStudio` / `ClarityCalligraphy` / `ClarityMediaReminder` open
4. Cache meta + **C13** query on every craft asset link

## Deploy + Cloudflare cache
1. Upload entire `craft/` folder (overwrite)
2. Cloudflare → Caching → **Purge Everything** (or at least `/craft/*`)
3. Hard refresh phone: close tab fully, reopen (or clear site data for clarity-dawah.fyi)
4. Confirm `clarity-build` meta is `C13` in View Source

## Smoke (local)
- All JS `node --check` OK
- All `/craft/` HTML refs resolve
- Quiz bank → 15 items from transitions
- Desks bind `x` + `fb` + data-action

Educational only — not a fatwa.
