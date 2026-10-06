# PageSpeed fixes applied (build 20261005AI)

## Applied in repo

| Issue | Fix |
|--------|-----|
| CLS (layout shift) | Inline critical layout CSS; banner 16:9; rail/workspace min-heights |
| LCP image weight | Hero `srcset` 320/480/640; preload 480w |
| Render-blocking CSS | Patches loaded via `media="print"` → `all` |
| Cache lifetimes | `_headers` + `netlify.toml` for Netlify/CF Pages |
| JS TBT | Scripts remain `defer`; UFT idle-loaded; low-prio polish/shine marked |

## Host notes

- **GitHub Pages**: does not read `_headers`. Put **Cloudflare** proxy in front for cache, or deploy same files to Netlify/CF Pages.
- After deploy, hard-refresh and re-run PageSpeed (desktop + mobile).

## Optional next steps

1. Host a local `assets/media/hero-makkah.webp` (~50KB) and point `src` there.
2. Split `clarity-chunk-8.js` further if TBT stays high.
3. Self-host Inter/Scheherazade subset fonts to drop Google Fonts RTT.
