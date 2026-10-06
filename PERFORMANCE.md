# PageSpeed + sticky chrome (20261005AM)

## Sticky top
- `#clarity-global-nav` sticky at `top: 0`
- `#clarity-top-duo` sticky at `top: var(--clarity-nav-h)` (measured live)
- Mobile: compact overlay padding; banner stays afloat while scrolling content

## Speed hygiene already in tree
- Deferred JS; UFT idle load
- Hero srcset 320/480/640
- Patches CSS `media=print`→all
- `_headers` / `netlify.toml` long cache for assets
- Banner media absolute (no CLS gap)

## Host tip
GitHub Pages ignores `_headers`. Cloudflare proxy or Netlify/CF Pages for cache audit wins.
