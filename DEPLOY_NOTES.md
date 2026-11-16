# Deploy notes — Port-preserving SSR

## Design choice
Previous root patches risked replacing the whole Port/Castle experience.
This package is **additive only**:

- Everything outside `#cs-mount` is left exactly as on the live site
  (room nav, banner iframe, path grid, focus plaque, door rail).
- Only the inner content of `#cs-mount` (previously just “Loading Companion…”)
  is filled with the SSR first-session block.
- A soft protect script marks the SSR presence but does **not** prevent
  existing Port / Castle / Companion engines from enhancing or replacing
  the mount after JS runs.

## Result for different audiences
| Audience              | Experience                                      |
|-----------------------|-------------------------------------------------|
| Crawler / no-JS       | Sees āyah + graded ḥadīth + path + room links   |
| Normal user (JS on)   | Port/Castle or full Companion still builds      |
| PageSpeed             | Critical chrome structure preserved             |

## Accept tests
1. curl root and /companion/ both contain quran.com + sunnah.com links
2. View-source shows Arabic and collection·number ḥadīth
3. “Loading…” is not the sole main content in initial HTML
4. Real browser still shows rich Port / Castle / Companion UI
5. Other rooms unchanged

## Rollback
Restore the two .bak files; remove the two new assets.
