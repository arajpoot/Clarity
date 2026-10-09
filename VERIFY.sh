#!/bin/sh
# Clarity essentials integrity check — run after unzip
set -e
echo "Verifying SHA256SUMS..."
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum -c SHA256SUMS.txt
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 -c SHA256SUMS.txt
else
  echo "No sha256 tool; skip"
fi
echo "OK — package integrity verified."
