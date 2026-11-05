# Craft Meme complete wire · C14

## Architecture (self-contained in `/craft/`)
1. **Section sources** (`craft-meme-source-v1.js`) — RRRA packs  
2. **Wire** (`craft-meme-wire-v1.js`) — one line → `mr-text` + `mr-src` + canvas paint + `x-draft`/`fb-draft`  
3. **Media bench** (`media-reminder-studio-v1.js`) — canvas host  
4. **Background chips** — nature / night / water / geometry / solid (picsum scenery)  
5. **Push canvas → desks** — explicit button  
6. **Desks** (`desks-v1.js`) — copy / open 𝕏 & Facebook  
7. **Shims** — `clarityMemeFill` / `clarityMemePush` / `clarityMemeSetCanvas` for Companion interop  

## From companion-inline
- `inline-clarity_meme_interlink_v1.js` vendored (online fetch helpers)  
- Push-card Companion DOM hooks remain Companion-side; Craft uses section chips + shims  

## Cache
`?v=20261104C14` · meta `clarity-build=C14`
