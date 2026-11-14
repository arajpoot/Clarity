# Companion About v6/A7 · feedback@Clarity via Cloudflare

**Bismillah.** Educational only — not a fatwa.

## App upload (GitHub Pages / static)
| File | Path |
|------|------|
| `companion/assets/companion-about-tab-fix-v1.js` | same |
| `companion/assets/companion-about-tab-fix-v1.css` | same |
| `companion/index.html` | same (`?v=20261114A7`) |

## Cloudflare (your dashboard — required for inbox delivery)
Follow **`CLOUDFLARE_FEEDBACK.md`**:
1. Email Routing → `feedback@clarity-dawah.fyi` → your inbox  
2. Optional Worker from `workers/clarity-feedback.js` on route `/api/feedback*`

Until the Worker exists, **Send to Clarity** falls back to a mail draft addressed to `feedback@clarity-dawah.fyi`.
