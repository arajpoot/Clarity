Charter freeze fix · 20261024CHARTER

ROOT CAUSE: Both /charter/ and /campus/charter/ were meta-refresh + location.replace
to /campus/charter/ → infinite redirect loop (browser "freezes").

FIX:
- campus/charter/index.html = REAL content (no redirect)
- charter/index.html = bridge only → /campus/charter/
- _redirects: /charter → /campus/charter/ (never redirect campus/charter to itself)

Extract at main root. Hard-refresh /campus/charter/
