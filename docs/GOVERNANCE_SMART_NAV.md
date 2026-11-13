# Smart nav engine S1 · governance

## Problem
Multiple overlapping rails (uni-nav, site-rail, curr-rail, stage-nav, path text dump) created noise and concatenated link rows.

## Design (industry pattern)
Inspired by layered nav on docs/product sites (global top bar + local context + overflow):
1. **Layer 1 — Rooms** sticky: Port · Companion · Yawm · University · Amānah · Craft
2. **Breadcrumb** — Campus · Desk · Stage
3. **Layer 2 — Ordered path** horizontal scroll: Desk · Seeker → … → Progress
4. **More · halls** drawer — Foundation/Pillars/Iḥsān/Amānah + assignments, lab, library, etc.

## Deduping
`html.cu-smart-nav-on` hides: `#cu-site-rail`, `#cu-curr-rail`, `#cu-uni-path`, `.stage-nav`, `.cu-uni-path`, late uni-nav injects. Smart nav owns navigation.

## Scope
Campus only. Lesson richness on stages unchanged. Educational only — not a fatwa.
