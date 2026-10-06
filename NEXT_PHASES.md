# Next phases — performance & ease (20261006UX)

## Implemented this drop
1. **Seeker Ease** — fixed “Today · one sincere deed” chip (Arabic + English), auto-hides, no unlock required
2. **Quiet mode** — `?quiet=1` (persists) reduces first-session noise; `?quiet=0` clears
3. **jsDelivr preconnect** — faster first Whisper load when voice is used
4. **`_headers` + netlify.toml restored** — long-cache assets, SW must-revalidate
5. **SW cache** bumped to `20261006UX`

## Recommended next (not in this zip)
| Phase | What | Why |
|-------|------|-----|
| P1 | Split `chunk-8` into core / meme / journey lazy chunks | Smaller Seeker parse |
| P1 | Self-host subset Arabic + Inter fonts | Kill font CDN latency |
| P2 | True critical CSS extract (<14 KB inline) | Faster LCP |
| P2 | WebP hero local fallback | Less Wikimedia dependency |
| P3 | Pathway progress checklist UI for New Muslim | Ease of use |
| P3 | Optional “focus mode” hides chrome except deed + prayer | Deep work |

## Host tip
Re-upload `_headers` (deleted on live earlier). Cloudflare: enable Brotli + cache everything under `/assets/*`.
