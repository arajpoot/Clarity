# G4 Campus packaging parity

## Campus model
- Small entry HTML
- Versioned `/assets` CSS/JS
- Room attribute on `<html>`
- No monolith inline app

## Companion adaptation
Companion content is larger, so packaging is:

1. **Thin entry** `index.html` — head, critical CSS, mount root, pack-boot
2. **Content fragment** `content/main.fragment.html` — full former body (richness kept)
3. **Load map** — ordered CSS/JS after mount
4. **Backup** — `content/full.backup.html` if fragment fails

## Not in scope
- Deleting meme/callig/commands
- Merging Campus curriculum into Companion
