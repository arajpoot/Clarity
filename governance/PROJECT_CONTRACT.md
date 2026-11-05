# Clarity · PROJECT_CONTRACT · binding · 20261105

**Bismillah.** Educational only — not a fatwa · not legal advice.

This contract is **project-wide**. It applies to every room and to every upgrade, fix, patch, or deploy pack. Room contracts (Craft, Companion, Yawm, Amānah, Campus) may **add** rules; they may not weaken these.

## Rooms (isolation doors)
| Room | Path | Role |
|------|------|------|
| Companion | `/companion/` | Path · reminder · light cues · links to workbenches |
| Yawm | `/daily/` | Today’s portion |
| University | `/campus/` (and lab surfaces under campus policy) | Ordered path · desks |
| Amānah | `/amana/` | Passphrase vault · dayn · heirs only |
| Craft | `/craft/` | Workbenches only (meme · tajweed · calligraphy · quiz · notes) |

Upgrades to one room must not load another room’s shell, vault, or desk engines unless the manifest explicitly allows a **named bridge**.

## Global invariants (all rooms)
| ID | Rule |
|----|------|
| **P1** | Educational only — not a fatwa; stamp visible on user-facing surfaces |
| **P2** | No free-type text presented as Qur’an or ḥadīth revelation; sourced lines only for scripture |
| **P3** | Primary texts: prefer verification links (quran.com / sunnah.com or equivalent); grades where claimed |
| **P4** | Room isolation: no cross-room script boot (Companion ̸→ Craft engines, Craft ̸→ Amānah vault, etc.) |
| **P5** | Privacy: Amānah passphrase never sent to Clarity servers; on-device claims must be true |
| **P6** | Media: scenery/geometry preferred; any remote image URL on a Clarity surface must pass a **Shariah URL scan** before paint/display where scan exists for that surface |
| **P7** | Every deploy pack ships a manifest checklist; silent bypass of P1–P6 is a failed pack |

## Room addenda (non-weakening)
- **Craft:** workbenches only; mandatory `clarityShariahScanUrl` (or successor) on meme BG paint; fail closed if scan missing.
- **Companion:** path/reminder home; tool UIs link out to Craft after port; no Amānah vault re-embed.
- **Yawm:** daily portion only; no Companion chunk load.
- **Amānah:** vault only; no curriculum grades import as rulings.
- **Campus:** ordered path; not a fatwa desk.

## Binding mechanism
Machine checklist: `governance/PROJECT_MANIFEST.json`  
Deploy gate: `governance/DEPLOY_GATE.md`  
Per-pack: `SMOKE_*.json` must include `project_invariants: pass|fail`

Any upgrade or fix proposal must either:
1. Pass the gate unchanged, or  
2. Amend this contract **and** the manifest in the **same** change (with reason).

Educational only — not a fatwa.
