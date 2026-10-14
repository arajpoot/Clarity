## Palette nuclear scan + phased repair (20261014THEME)

### Findings
- Screenshot: **browser-default blue links** inside Junior curriculum on dark card (Lab · Media reminder, Qurʾān refs).
- Not Companion patches — unstyled `<a>` in injected curriculum HTML.
- University shells already dark; missing global `a { color }` tokens.

### Shariah-minded palette rules
- Night: soft gold links on deep green-black (no electric blue).
- Day: deep green links on parchment (no pure white glare).
- System: follows OS preference.
- Gold / green hierarchy; avoid neon pink/purple; calm, readable.

### Phases (executed this package)
1. **T1** Theme tokens CSS (`cu-theme-v1.css`) — link/text/card contrast.
2. **T2** Theme controller JS — Day / Night / Auto in banner.
3. **T3** Wire all university HTML; force curriculum links to `--cu-link`.
4. **T4** Smoke: no companion patches on desk; theme files present.

### Integrity
- Does not touch SEAL foundation hashes.
- Companion `/` unchanged.
