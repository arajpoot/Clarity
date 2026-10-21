# Companion assets — clean rebuild 20261020

## Architecture subfolders
- `/` — core Companion CSS/JS (surface, provision, share desks, craft anchors, banner, diet packs)
- `craft/` — only wired tools-restore + meme-hide
- `curriculum/vault/admin/brand/` — insignia if present
- `media/` — placeholder only

## Rules
- Use **v2** for share-desks, provision, surface (g-error + Today icons fix)
- Do not re-upload v1 duplicates of those three
- Vault CASTLE stack kept (isolate + secure + lazy loaders)
- University campus scripts not in this pack

## Deploy
1. Rename live `assets` → `assets-old`
2. Upload this folder as `assets`
3. Root `index.html` must reference provision/surface/share-desks **v2**
4. Cloudflare purge `/assets/*`
