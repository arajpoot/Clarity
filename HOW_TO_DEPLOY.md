# Reflection hold2 + §3A snapshot rule

## Visibility truth (your screenshot)
Top of Reflection shows hero, ladder, grave, tawbah — **not** the media shelf. Media was ~8000px down. That is **not** operator-visible green.

## This repair
1. Move **Reflection media** directly **under the ladder**
2. Pin grave / tawbah / soul / media with `data-visibility-hold` + runtime hold (survives path switches)
3. Governance §3A amended: **sandbox snapshot + operator-see** required for GREEN

## Upload
- companion/tabs/reflection/index.html
- companion/assets/companion-reflection-hold2.css
- companion/assets/companion-reflection-hold2.js
- companion/index.html
- GOVERNANCE_CONTRACT.md (root)

Hard-refresh Reflection — media shelf should appear under the ladder without a long scroll.
