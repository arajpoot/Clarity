# U25R · honest order fix

**Root cause:** Gate was placed after `#cu-banner` (slim Day/Night bar), so it appeared *above* the big `header.cu-hero` “Clarity University” banner.

**Fix:** Place **GATE + Write** after `header.cu-hero` (and path rail if present).

**Deploy (critical):**
1. Upload **`/campus/assets/js/cu-gate-landing-v1.js`** with cache-bust `?v=20261118U25R` (overwrite)
2. Upload **`/campus/assets/css/cu-gate-landing-v1.css`**
3. Upload **`/campus/index.html`** (build U25R)
4. Hard refresh; if still wrong, clear CDN/browser cache for the JS file

**Smoke order:** Room pills → (slim bar) → **Clarity University hero** → path → **Enter Campus** → **Write** → rest
