# Permanent mount fortify · MF1 (campus model)

**Bismillah.** Educational only — not a fatwa.

## Chronic bug
`innerHTML = tabHtml` drops script execution → craft, Hifẓ inline boots, and archive modules never start.

## Permanent fix
`companion-mount-fortify-v1.js` patches `ClarityCompanionShell.mountTab` to:
1. Fetch tab HTML  
2. Parse with DOMParser  
3. Inject **non-script** DOM  
4. **Re-insert `<script src>` and inline scripts** so the browser runs them  
5. Dispatch `clarity:tab-mounted` for all hydrators  
6. Nudge craft / Hifẓ / NurOS / ḥadīth engines  

Load order: **shell → fortify → engines**.

## Guarantee
Future tab fragments may include scripts again; fortify will run them. Hydrators also listen to `clarity:tab-mounted` so Companion matches campus lab boot discipline.
