# CSS out + final surface merge · 20261026

## CSS
Moved from `assets/companion-inline/*.css` → `assets/css/`.
`index.html` hrefs updated. **path-progress and landing-v3 untouched.**

## Merged last script
`assets/companion-inline/inline-clarity-final-surface-v1.js`
- Door pick / hard dismiss / mobile touch
- Companion surface assert (main + active tab + allow-list cards)
- Wraps path filter + shell setMode + section door (heal after)
- Load **last** before `</body>`

## Still separate (on purpose)
- `inline-clarity-shell-v3.js` — ribbon / mode / landing hide
- `inline-clarity-landing-v3.js` — day landing (untouched)
- `clarity-path-progress-v1.js` — path filter (untouched)

## Removed from index script tags
- `inline-clarity-doors-fix-v1.js`
- `inline-clarity-surface-heal-v1.js`
(files may remain in folder as legacy; not loaded)
