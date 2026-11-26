# Clarity · `/docs/governance/`

Standalone **governance contract** page. Does not touch Companion, Yawm, University, Amānah, or Craft.

## Deploy (Cloudflare Pages / static host)

Upload this folder as:

```
docs/governance/index.html
```

Final URL: `https://clarity-dawah.fyi/docs/governance/`

## Optional: link from docs hub

In `/docs/index.html` (docs orientation only — not a room app), add one list item:

```html
<li><a href="/docs/governance/">Governance contract</a> — submission rules, sources, privacy, room boundaries</li>
```

## Optional: SEO discovery

In `/docs/seo/` list, add:

```html
<li><a href="/docs/governance/">Governance contract</a></li>
```

## Purge

After upload, purge Cloudflare cache for `/docs/*` and hard-refresh.
