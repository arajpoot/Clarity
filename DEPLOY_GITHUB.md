# Deploy Clarity to GitHub (replace published site)

Build: **20261005X**

## What this package contains

- Root: `index.html`, `robots.txt`, `sitemap.xml`, docs
- `assets/` — all runtime JS/CSS (14 modules) + `curriculum/` map & stamp tools

Published site only needs the **runtime** files. Curriculum stubs are for authors; safe to upload.

## Option A — GitHub repo (Pages from root or `/docs`)

1. Download and unzip `clarity-publish-polished-29.zip` locally.
2. Open your existing site repo (the one behind clarity-dawah.fyi).
3. **Replace** (do not merge partial old assets):
   - `index.html`
   - `robots.txt`
   - `sitemap.xml`
   - entire `assets/` folder
4. Optional but recommended: commit docs  
   `FACTOR_MAP.md`, `CURRICULUM_CARD_MAP.md`, `README.md`, `PUBLISH_MANIFEST.json`
5. From repo root:
   ```bash
   git add -A
   git status   # confirm old asset files removed if renamed
   git commit -m "Publish Clarity 20261005X — path v6, curriculum map, vault security"
   git push origin main
   ```
6. If GitHub Pages is enabled on `main` (root or `/docs`), wait for the Actions/Pages deploy.
7. Hard-refresh the live site (or incognito):  
   `https://clarity-dawah.fyi/`  
   Confirm assets load with `?v=20261005X` in DevTools → Network.

## Option B — Upload via GitHub web UI

1. Unzip the package.
2. In the repo on github.com → **Add file** / drag-and-drop is weak for deletes.
3. Prefer cloning locally (Option A) so removed/replaced files under `assets/` are correct.
4. If you must use the UI: delete the old `assets` folder in a commit, then upload the new `assets` + `index.html`.

## Option C — gh-pages branch

```bash
unzip clarity-publish-polished-29.zip -d /tmp/clarity-pub
cd /path/to/repo
git checkout gh-pages   # or main, per your Pages settings
# replace published files
cp -r /tmp/clarity-pub/index.html /tmp/clarity-pub/robots.txt /tmp/clarity-pub/sitemap.xml .
rm -rf assets && cp -r /tmp/clarity-pub/assets .
git add -A && git commit -m "Publish 20261005X" && git push origin gh-pages
```

## After deploy — quick checks

| Check | Expect |
|--------|--------|
| Console | No `SyntaxError` / no freeze on track switch |
| Network | Scripts `?v=20261005X` |
| Seeker track | Meme / tajweed cards hidden |
| Daily / Da'i (unlocked) | Broader card set |
| Amana vault | Lock on tab hide; unlock with passphrase |
| CSP | `script-src` without `unsafe-eval` |

## Rollback

Keep the previous release zip or git tag. Revert the deploy commit or re-push the prior tree.

## Note on curriculum folders

`assets/curriculum/` is authoring metadata + stamp tools. Runtime does not require loading `stamp-cli.js` in the browser. Path switching uses stamped `data-min-i` + CSS `data-path-i`.
