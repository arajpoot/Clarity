# Clarity static site

The full single-file app stays at `index.html`.
SEO pages live in folders (`/islamic-will/index.html`, …).

## Cloudflare Pages + GitHub

1. Push this folder as the repo root (or set root to `clarity-site`).
2. Cloudflare Dashboard → Pages → Create project → Connect GitHub.
3. Build command: *(leave empty)*
4. Output directory: `/`
5. Custom domain: `clarity-dawah.fyi`

Pretty URLs work because each path is a folder with `index.html`.
The PWA/app hash routes (`/#grave`, `/#notes`) still work on `index.html`.
