# Action tab revamp · phased plan (governance contract)

Educational only — **not a fatwa**. Companion room only. Castle-wide §7 preserve.

## Baseline

Richest archive body: `companion/tabs/action/index.html` (Archive3) + action-bundle/fix/wiring assets.

Major sections already in Archive3 Action:

1. Guarding the tongue / steady deeds / pillars shelf  
2. Warnings of the Fire  
3. Hifẓ coach  
4. Seerah capture + Seerah Mirror Walk + family tree (Ismāʿīl → Prophet ﷺ)  
5. Daily tajweed + learning path + Deep Studio  
6. **Hajj Ritual Guide + checklist + videos**  
7. Guided search / masnūn / Qurʾān / hadith / life events  
8. Deep modules: meme, calligraphy, tajweed folds  
9. Craft doors isolation note  

## Phase 1 — DONE in this package

**In iḥrām — educational do / avoid** panel (`#hajj-ihram-do-avoid`)

- Additive under Hajj guide, before checklist  
- Not a fatwa; madhāhib differ; verify with teacher  
- Anchors: Qurʾān 2:196–197, Sunnah.com search, link to existing prohibitions lecture  
- Preserves guide, checklist, talbiyah, videos  

Deploy:

```
companion/tabs/action/index.html
companion/assets/companion-hajj-ihram-panel-v1.css
companion/assets/companion-hajj-ihram-panel-v1.js
```

## Phase 2 — DONE · Hajj depth (no fatwa inflation)

**Shipped:** `companion-hajj-steps-v1.js` + CSS

- Full step lists for Tamattuʿ / Qirān / Ifrād
- `hajjShowStep` renders title, educational body, **tap citations** (Qurʾān + Sunnah.com)
- Empty panel / missing step id → visible defect message (§R1)
- On-device progress (`localStorage` key `clarity_hajj_steps_v1`)
- Where am I? → next unmarked step
- Checklist render from same step graph
- Does not invent reconciling fiqh between reports

## Phase 2 (original brief) — Hajj depth (no fatwa inflation)

- Ensure `hajjShowStep` / checklist render from action-bundle still wire after tab mount  
- Step panel: every step shows a **tap citation** (āyah or graded report) where a claim is made  
- Empty step panel = defect (§R1)  
- Do not merge YouTube rank with Qurʾān/ṣaḥīḥ on the same visual weight  

## Phase 3 — Tongue, Fire, Hifẓ honesty

- Guarding the tongue + Warnings of the Fire: verify every listed sin/report has a visible source path  
- Hifẓ coach: Arabic on top; translation is a bridge; no practice card without a citation the user can tap  
- Remove any “the Sunnah is…” voice when the UI only has a single report  

## Phase 4 — Tajweed & calligraphy

- Keep Deep Studio / path / daily module  
- Path governance: Seeker sees a honest subset; counts match visible sections  
- Craft isolation held — no Craft room code inlined into Action  

## Phase 5 — Seerah Mirror & search shelf

- Seerah Mirror: character lessons with sources; night content stays Qurʾān / ṣaḥīḥ / death / istighfār tone where applicable  
- Search shelf (Qurʾān, hadith, masnūn): prefer allowlisted APIs from Shariah source audit; no ungraded random hadith APIs  

## Phase 6 — Polish & visibility foundation

- Mobile: do/avoid grid stacks; buttons wrap  
- Path soft-emphasis only — do not hard-delete Archive3 HTML  
- Smoke: open Action → Hajj → see guide + **do/avoid** + checklist + video  

## Non-goals

- Not a madhhab picker on the home path  
- Not inventing rulings to fill gaps  
- Not wiping Port, Yawm, Campus, Amānah, or Craft  
