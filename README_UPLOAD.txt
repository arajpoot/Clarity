Companion clean cycle · 20261024UFT

CRITICAL FIX: Uncaught SyntaxError Identifier UFT_KEY already declared
File: assets/clarity-uft-full-restore-v1.js
- Removed top-level const UFT_KEY
- Use window.UFT_KEY + var UFT_KEY inside guarded IIFE

Also includes prior lean + dedupe + companion guide.

Upload at minimum:
  assets/clarity-uft-full-restore-v1.js

Full package: index.html + assets/ as in zip.
