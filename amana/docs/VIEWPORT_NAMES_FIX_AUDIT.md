# Viewport names fix audit

**Bismillah.** Build: `AMANA_UFT_VIEWPORT_NAMES_20261108`

## Problems
1. Names flash then disappear on stage  
2. Horizontal pedigree layout not holding  
3. Collapsed `.uft-band` hides person cards (`display:none` on `.uft-band-scroll`)  
4. Registry list collapsed separately from stage draw  

## Fix (`amana-uft-viewport-names-fix-v1.js`)
- Force all `clarity_uft_band_*` open + remove `.collapsed`  
- Force `#uft-preview.uft-orient-h` (horizontal)  
- If no `.uft-person` cards after render → inject **stable name grid** (Parents / Focus / Children / …)  
- Single settle pass (no render thrash)  

## Governance
Educational outline only · not a legal pedigree · Amānah tree only.
