# Shariah source audit (companion) — 20261025

Educational only — **not a fatwa**. Verify with Qur’ān, Sunnah, and a local scholar.

## Findings

| Area | Status | Notes |
|------|--------|------|
| Qur’ān text APIs | Prefer | `api.alquran.cloud` (uthmani), `api.quran.com` |
| Prayer times | Prefer | `api.aladhan.com` |
| Graded hadith CDN | Conditional | `cdn.jsdelivr.net/gh/fawazahmed0/hadith-api` **only** kutub paths: bukhari, muslim, abudawud, nasai, ibnmajah, tirmidhi |
| Random hadith APIs | **Blocked** | `ummahapi.com` (ungraded random) |
| Ungraded dua APIs | **Blocked** | `dua-data-api.vercel.app` |
| Metrics counters | **Blocked** from deen path | countapi hosts (not textual sources) |
| Landing adhkār | **Fortified** | Added *Rabb al-ʿālamīn* morning/evening; Sayyid al-istighfār (Bukhārī 6306); explicit educational refs |

## Tool injected

`assets/companion-inline/inline-clarity_shariah_source_guard_v1.js`

- Allowlist + blocklist on `fetch`
- `clarityShariahCheckUrl(url)`
- `clarityShariahScanPayload(text)` for weak-grade wording
- Educational stamp in UI

## Limits

- Cannot certify isnād of every string in core-block offline.
- Displayed adhkār are **educational wording**; numbering follows common printings and may differ by edition.
- Always prefer a printed *Hisn al-Muslim* / local teacher for worship practice.
