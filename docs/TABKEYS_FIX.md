# tabKeys redeclaration fix

**Error:** `Uncaught SyntaxError: Identifier 'tabKeys' has already been declared`

**Cause:** Both `/assets/clarity-core-block-8.js` and `/companion/assets/a2/clarity-chunk-8.js` declare top-level `const tabKeys`. Companion loaded both (perf/core-path + a2 spine).

**Fix:** `companion-spine-dedupe-v1.js` loads absolute core once and a2 packs **without** chunk-8. Stock spine loader set to `type="text/plain"`.

Campus untouched.
