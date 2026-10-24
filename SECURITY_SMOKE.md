# Security & smoke report — Companion essentials

## Runtime (sandbox post-fix)
- JS syntax: 0 errors
- Console: no Uncaught Exception (SW soft-fail only)
- ALLOW.seeker: present
- switchTab / door / toMeme / memePush / tdPost: present

## Amana Vault
- Web Crypto subtle: yes
- Algorithm: PBKDF2-SHA-256 (120k iterations) → AES-GCM-256
- Passphrase in localStorage: **no**
- Suspicious keys: **none**
- Gate UI present; password inputs: 3 (create/open)
- Harden: wipe pass fields on hide/lock; autocomplete attributes
- Storage vaultish keys observed: uft_zoom_level, clarity_user_family_tree_v1 (data blobs, not passphrases)

## Meme / online fetch
- memeFetchBg + __memeOnlineFetch wired
- Scenery sources: picsum seed URLs by kind (nature/flowers/holy/night/water)

## Interlink pills
- data-rail-tab → switchTab / clarityOpenSectionDoor
- To-meme bridges present

## Holes plugged this pass
1. Mid-string style injection breaking parse → fixed
2. Vault security deep audit + pass field wipe
3. Online meme background fetch layer
4. Rail/pill interlink re-wire

## Not a hole
- YouTube Error 153: embed origin/sandbox limitation
- Family tree in localStorage is expected (local-first); vault contents stay encrypted when vault path used

## University
/campus/ untouched
