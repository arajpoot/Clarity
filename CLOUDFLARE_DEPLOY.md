# Clarity — Cloudflare Pages deploy (not Workers)

## Why Pages (not Workers)
Static HTML/CSS/JS only. Connect **Cloudflare Pages** to GitHub.
Do not use a Worker project or `npx wrangler deploy`.

## Pages settings (Git-connected)
| Setting | Value |
|---------|--------|
| Repository | `arajpoot/Clarity` |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **empty** |
| Build output directory | `/` or `.` |
| Root directory | `/` |
| Deploy / Preview command | **leave empty** (pure Pages) |

## Custom domain
- `clarity-dawah.fyi` (see `CNAME` in repo root)
- SSL: Full when orange-cloud proxied

## `_redirects` behavior on Pages
```
/* /index.html 200
```
On Cloudflare **Pages**, real files are served first. The catch-all is only for
paths with **no** matching static file (SPA / deep links).

This is unsafe on a **Worker** that always returns HTML for every path.
Use Pages, not Workers, for this package.

## Optional CLI
`wrangler.toml` sets `pages_build_output_dir = "."` and name `clarity-dawah`.
```
npx wrangler pages deploy . --project-name=YOUR_PAGES_PROJECT --commit-dirty=true
```
Only if the project is a **Pages** project (not a Worker named clarity).

## After deploy
1. Deployment status: Success
2. Purge cache if needed
3. `/assets/clarity-feature-pack-v1.js` must be JavaScript, not HTML
