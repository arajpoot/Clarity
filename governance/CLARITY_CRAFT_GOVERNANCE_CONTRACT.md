# Clarity Craft · Governance Contract
**Version:** C19G1.1 · **Bismillāh**  
**Scope:** Craft room benches (Meme · Tajweed · Calligraphy · Shariah IQ · future desks)  
**Status:** Binding for agent builds · educational only — not a fatwa

---

## 0. Invoke key (mandatory trigger)

### Primary short key: **Bismillāh**

| Form | Accepted |
|------|----------|
| `Bismillāh` | Preferred |
| `Bismillah` | Accepted |
| `بسم الله` | Accepted |
| `Bismillahir Rahmanir Rahim` / full basmala | Accepted |

**When the user opens or anchors a Craft build request with Bismillāh** (alone or with task text), the agent **must** treat it as:

```text
GOVERNANCE FULL · sim-backed mandatory · audit-rich-smoke
```

That expands to the **entire** contract below (sim S1–S6 → smoke → richness R1–R6 → audit files → package only if PASS).

### Explicit long keys (same effect)

| Invoke key | Meaning |
|------------|---------|
| **`GOVERNANCE FULL`** | Full contract |
| **`sim-backed mandatory`** | Full contract |
| **`audit-rich-smoke`** | Full contract |
| **`عقد الحوكمة`** | Full contract |

### Default for this project

Craft room work is assumed **governance-bound**. A leading **Bismillāh** is the one-word switch that makes audit mandatory without typing the long phrase.

Once invoked, the agent may **not** deliver a package or say “fixed / polished / smoked” unless every gate below is marked **PASS** in `smoke/SMOKE.json` and `governance/AUDIT_RUN.md`.

---

## 1. Non-negotiables (always)

1. **Educational only — not a fatwa.** UI, captions, and exports must carry this where user-facing.
2. **Shariah-compliant media:** scenery / nature / abstract geometric only — no haram imagery, no people-focused stock as default meme bg.
3. **Craft isolation:** `clarity.craft.*` namespace; do not break Companion / Yawm / University / Amānah rooms unless the user explicitly asks.
4. **No silent upload:** share desks open compose intents only; nothing posts without the user.
5. **Honest labels:** authentic Qur’an editions vs EN→UR machine fallback must not be conflated; fallback labeled educational, not official tarjuma.
6. **Single paint owner** (Meme): one authoritative canvas painter; no competing fillText stacks.

---

## 2. Sim-backed gate (MANDATORY)

No claim of “working,” “hardened,” or “final” without a **sim-backed** proof.

### 2.1 What “sim-backed” means
- Headless or scripted run that exercises the **real module code** (not prose speculation).
- Asserts **observable outcomes** (e.g. canvas `fillText` count ≥ expected layers; no throw; status strings; API 200 for ayah fetch).
- Logged under `smoke/SIM_*.json` or embedded in `smoke/SMOKE.json`.

### 2.2 Minimum sim cases (Meme bench)
| ID | Case | Pass criteria |
|----|------|----------------|
| S1 | Paint with full layers | ≥3 fillText (ar, en, ref); optional ur |
| S2 | Paint after bg only | Text still draws; no throw after clearRect |
| S3 | Empty layers → ensureVerse | Boot/seed produces non-empty `__memeLayers` |
| S4 | Auto contrast | Dark vs light lum → different palette; no undefined color |
| S5 | Urdu pipeline | Authentic API path attempted; EN→UR only as labeled fallback |
| S6 | No window shadowing | `paintText(ctx, width, height)` never assigns props onto numeric width |

### 2.3 Failure rule
If any mandatory sim **FAIL** → package is **not releasable**. Fix → re-sim → only then zip.

---

## 3. Smoke gate (MANDATORY)

After sim, run **smoke**:

1. `node --check` on every shipped `.js`
2. Static path audit (exports, boot order, single paint owner, no old guard blocking new module)
3. Live-or-API checks where relevant (e.g. alquran.cloud ayah)
4. Write `smoke/SMOKE.json` with `{ "build", "result": "pass"|"fail", "sims", "checks" }`

**`result: "pass"` is required** before user-facing “smoked / polished / deployable.”

---

## 4. Richness clause (MANDATORY)

A build is **not** audit-complete if it only “stops the bleeding.” Richness means:

| Pillar | Requirement |
|--------|-------------|
| **R1 Functional completeness** | Primary user path works end-to-end (load verse → scene → paint → export/desk) |
| **R2 Coherence** | Controls that exist in UI are wired; dead chips hidden or removed |
| **R3 Resilience** | Failures degrade gracefully (blank Urdu > wrong Urdu; text still paints if bg CORS fails) |
| **R4 Honesty** | Status lines match reality (authentic vs fallback; educational only) |
| **R5 Non-regression** | Known fixed bugs (double paint, window shadowing, wrong-ref Urdu) listed in audit as still held |
| **R6 Educational value** | Content remains useful for dhikr / reminder / practice — not empty chrome |

**Anti-pattern (forbidden under richness):** shipping scenery-only canvas, Apply buttons that no-op, or “PASS” auditor while painted text is wrong.

---

## 5. Audit procedure (agent checklist)

When invoke phrase is present, agent **must** produce:

1. `governance/AUDIT_RUN.md` — dated, build id, each gate PASS/FAIL  
2. `smoke/SMOKE.json` — machine-readable  
3. Package zip only if all mandatory gates PASS  
4. User summary: what was simmed, what passed, deploy file list  

### Audit order (fixed)
```text
Bismillāh → static syntax → sim S1–S6 → smoke → richness R1–R6 → governance sign-off → package
```

### Forbidden phrases until gates pass
- “smoked”
- “polished”
- “deployable”
- “hardened”
- “final fix”
- “audit passed”

---

## 6. Credits & sources

Room port pages credit authentic sources (Qur’an editions, audio, curricula). Machine translation is never credited as a scholar’s tarjuma.

---

## 7. Amendment

This contract may be amended only by explicit user request with **Bismillāh** and a new version id (C19G2…). Older builds remain valid under the contract version they declared.

---

**Sign-off template**

```text
GOVERNANCE C19G1.1 · BUILD <id>
SIM: PASS (S1–S6)
SMOKE: PASS
RICHNESS: PASS (R1–R6)
Educational only — not a fatwa.
```
