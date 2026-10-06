# Curriculum card → folder map (additive)

Each folder holds **only cards introduced at that phase**.
Activation: phase N turns on folders `seeker` … through that phase; higher folders off.

## Counts

| Folder | Phase key | Cards |
|--------|-----------|------:|
| `seeker/` | seeker (0) | 12 |
| `new-muslim/` | new_muslim (1) | 5 |
| `daily/` | practicing (2) | 16 |
| `dai/` | dai (3) | 5 |
| **Total unique** | | **38** |

## Always-on (base shell / vault)

Present on every phase (not phase-gated):

- `about-clarity-card`
- `cw-card`
- `user-family-tree-card` *(vault / UFT)*
- `faraid-card` *(fiqh tools)*
- `wasiyyah-card` *(fiqh tools)*
- `notes-shell` *(if present)*

Authoring: keep under `shared/` or stamp `data-always="1"` (not tied to a phase folder).

## `seeker/` — Seeker — minimum

| Card id | data-min-i | Always |
|---------|----------:|:------:|
| `about-clarity-card` | 0 | yes |
| `commands-card` | 0 |  |
| `creation-tongue-reflection` | 0 |  |
| `cw-card` | 0 | yes |
| `grave-path-card` | 0 |  |
| `hell-sins-card` | 0 |  |
| `ilm-pathway-card` | 0 |  |
| `night-breath-card` | 0 |  |
| `samina-card` | 0 |  |
| `samina-verse-card` | 0 |  |
| `seerah-live-card` | 0 |  |
| `soul-compass-card` | 0 |  |

## `new-muslim/` — New Muslim — additions only

| Card id | data-min-i | Always |
|---------|----------:|:------:|
| `fiqh-quiz-card` | 1 |  |
| `hajj-guide-card` | 1 |  |
| `new-muslim-foundations-card` | 1 |  |
| `salah-starter-card` | 1 |  |
| `tibbe-nabwi-card` | 1 |  |

## `daily/` — Daily Muslim — additions only

| Card id | data-min-i | Always |
|---------|----------:|:------:|
| `asma-names-lecture-card` | 2 |  |
| `callig-lab-card` | 2 |  |
| `daily-deed-ledger-card` | 2 |  |
| `deepen-study-card` | 2 |  |
| `hajj-checklist-card` | 2 |  |
| `meme-card` | 2 |  |
| `najiha-tafseer-card` | 2 |  |
| `seerah-mirror-card` | 2 |  |
| `tafseer-live-card` | 2 |  |
| `tafseer-resources-card` | 2 |  |
| `tajweed-live-card` | 2 |  |
| `tajweed-path-card` | 2 |  |
| `tj-deep-studio` | 2 |  |
| `tj-lmr-score-card` | 2 |  |
| `tweet-desk-card` | 2 |  |
| `weekly-review-card` | 2 |  |

## `dai/` — Da'i — additions only

| Card id | data-min-i | Always |
|---------|----------:|:------:|
| `dai-transmit-card` | 3 |  |
| `israeliyat-card` | 3 |  |
| `sealed-nectar-card` | 3 |  |
| `tajalliyat-lecture-card` | 3 |  |
| `voice-translator-card` | 3 |  |

## Shared / always (not phase-introduced)

- `faraid-card`
- `user-family-tree-card`
- `wasiyyah-card`

→ Treat as **`shared/`** (or `data-always="1"`), available on all phases.
## Activation rule (command file)

```
focus seeker      → ON: seeker
focus new_muslim → ON: seeker + new-muslim
focus practicing → ON: seeker + new-muslim + daily
focus dai        → ON: seeker + new-muslim + daily + dai
```

## Planned / not yet in index.html

These ids are in the allowlist + folder map but have no element in `index.html` yet:

- `grave-path-card`
- `new-muslim-foundations-card`
- `salah-starter-card`
- `daily-deed-ledger-card`
- `dai-transmit-card`

Stamp reports them as `missing`; path runtime still treats them if injected later.

## Tooling

```bash
node assets/curriculum/stamp-cli.js --write
```

Folders: `assets/curriculum/{shared,seeker,new-muslim,daily,dai}/`
