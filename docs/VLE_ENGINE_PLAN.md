# Virtual Learning Experience engine

## Vault inventory used
| Asset | Role |
|-------|------|
| staff-roster.json | Ops, Authenticity, Scout, Librarian |
| staff-dispatcher-v1.js | Loads staff scripts after seal |
| staff-*-v1.js | Worker automation |
| faculty-roster.json | Phase teachers (personas) |
| help-book.json | Phase guidance lines |
| faculty-controller-v1.js | Full wing (optional; path may be campus copy) |
| workers-ops-pack-v1.js | IT/ops drills (not required for VLE desk) |

## Surfaces
- `/campus/faculty` — teacher personas + help tips
- `/campus/bots` — staff workers + soft dispatcher
- `/campus/library` — librarian + scout + authenticity

## Policy
SEAL foundation stays frozen. Staff/faculty admin JSON is the enrichment SoT for VLE.
