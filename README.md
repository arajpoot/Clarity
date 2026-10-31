# Daily-first landing · not Reality

## Issue
Shell “Day landing” kept users inside Companion (often **Reality**), with main hidden → freeze. User expects **landing = Daily routine page** (`/daily/`).

## Fix (inline in index.html)
1. **Open daily routines** / Day landing CTAs → navigate to **`/daily/`**
2. `ClarityShell.setMode("landing")` → **`/daily/`** instead of blank in-page landing
3. Default tab avoids **Reality** / legacy `journey` → **reminder** unless user explicitly picked Reality

## Deploy
Replace root `index.html` only. Hard-refresh. Yawm & Campus folders unchanged.
