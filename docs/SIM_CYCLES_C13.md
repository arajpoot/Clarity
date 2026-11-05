# Simulation cycles C13

| Cycle | Found | Fix |
|-------|-------|-----|
| 1 | JS syntax / missing files | none (clean) |
| 2 | desks-v1 only `tw-*`; page `x-*` | bind `x`+`tw`+`data-desk` |
| 3 | quiz banks empty modules; transitions unread | ingest transitions |
| 4 | studio open race | craft-studio-boot retries |
| 5 | browser stale after CF | `?v=20261104C13` + no-cache meta |

Mock DOM studio open fails without real innerHTML parser — expected; real browser creates nodes from innerHTML.
