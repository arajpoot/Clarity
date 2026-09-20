# Google Search indexing audit — Clarity / NurOS (Sep 2026)

## What indexes well
- Static thin pages: prepare-for-death, debts-and-trusts, islamic-will, hajj-checklist (unique title, description, canonical, robots index,follow).
- JSON-LD WebApplication + ItemList already in the SPA head.
- Canonical https://clarity-dawah.fyi/

## Risks
1. **SPA-only content**: Tajweed, meme, calligraphy live behind JS — crawlers may not see workshop body text. Mitigated by thin static hub pages + meta descriptions.
2. **Hash routes** (#learn, #affairs, #today): Google generally treats fragments as the same URL. Prefer clean paths rewritten to clarity.html for important doors.
3. **Duplicate titles**: ensure / and /clarity.html do not fight; use canonical on both to https://clarity-dawah.fyi/
4. **robots**: keep index,follow; submit sitemap in Search Console.
5. **Soft-404**: empty JS-failed shell — noscript links in SPA already list primary paths.

## Actions for clarity-dawah.fyi
- Deploy clarity.html with default #today (Gate mode / door rail on).
- Rewrite /prepare-for-death → prepare-for-death.html (or SPA + prerender).
- Merge sitemap-clarity-fragment.xml into site sitemap.xml.
- Request indexing for prepare-for-death, islamic-will, debts-and-trusts in GSC.
- Do not put meme/tajweed as separate high-priority sitemap entries until they have static summaries.

## IA summary (this build)
- Banner: **Today only** (data-ia-mode).
- Learn / Affairs / All tools: index panels in #clarity-index-host — not over banner.
- Day 6 Janāzah listed in Affairs hub.
- Character → meme hidden on Today home until #learn / #affairs / #all-tools.
