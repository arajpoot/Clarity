# Hotfix smoke

Cause: thin shell loaded; fragment 404 → stuck/broken.

Fix: self-contained index with commands-card, banner, craft modules, g6/g7.

Verify:
- phase hotfix-monolith-restore
- commands-card in HTML source
- no reliance on main.fragment.html
