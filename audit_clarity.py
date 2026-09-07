#!/usr/bin/env python3
"""Clarity fail-proof audit — python3 audit_clarity.py index.html
Exits 1 on structural leaks or critical meme regressions.
"""
import re, sys
from pathlib import Path

def extract_panel(text, name):
    m = re.search(r'<div id="tab-%s" class="tab-panel[^"]*"[^>]*>' % name, text)
    if not m:
        return None
    st = m.start(); depth = 0; i = st
    while i < len(text):
        if text.startswith('<div', i):
            depth += 1; i += 4
        elif text.startswith('</div>', i):
            depth -= 1; i += 6
            if depth == 0:
                return text[st:i]
        else:
            i += 1
    return None

def extract_fn(text, name):
    m = re.search(r'function\s+%s\s*\(' % re.escape(name), text)
    if not m:
        return None
    i = m.start(); depth = 0; started = False
    for idx, ch in enumerate(text[i:], i):
        if ch == '{':
            depth += 1; started = True
        elif ch == '}':
            depth -= 1
            if started and depth == 0:
                return text[i:idx+1]
    return None

def audit(path):
    text = Path(path).read_text(encoding='utf-8')
    errs, warns = [], []
    tabs = ['journey','seerah','tajweed','lectures','tafseer','commands','grave','search','about','notes']

    for name in tabs:
        opens = len(re.findall(r'<div id="tab-%s" class="tab-panel' % name, text))
        if opens != 1:
            errs.append(f'tab-{name}: open count={opens} (want 1)')

    if re.search(r'<div\s+<div', text):
        errs.append('broken tag <div <div')
    if re.search(r'(?<!<div )id="tab-notes" class="tab-panel">', text) and '<div id="tab-notes" class="tab-panel">' not in text:
        errs.append('RAW HTML LEAK: bare tab-notes')

    about = extract_panel(text, 'about')
    if not about:
        errs.append('tab-about: unclosed or missing')
    else:
        if 'id="authentic-learning-stack"' not in about:
            errs.append('learning stack MISSING from Notes')
        if 'id="traffic-stats-card"' not in about:
            errs.append('traffic card MISSING from Notes')
        if 'id="meme-card"' not in about and 'meme-card' not in about:
            warns.append('meme-card not found inside about panel string (check manually)')

    for eid in ['authentic-learning-stack', 'traffic-stats-card']:
        for m in re.finditer(r'id="%s"' % eid, text):
            pos = m.start(); last = None
            for name in tabs:
                for tm in re.finditer(r'<div id="tab-%s"' % name, text):
                    if tm.start() < pos:
                        last = name
            if last != 'about':
                errs.append(f'{eid} under tab-{last} (LEAK)')

    # --- Meme regressions ---
    dl = extract_fn(text, 'memeDownload')
    if not dl:
        errs.append('memeDownload() missing')
    else:
        if 'navigator.share' in dl:
            errs.append('memeDownload must NOT call navigator.share (Download was acting as Share)')
        if 'download' not in dl and 'memeTriggerBlobDownload' not in dl and 'toDataURL' not in dl:
            errs.append('memeDownload has no download path (blob/dataURL)')

    sh = extract_fn(text, 'memeSharePng') or extract_fn(text, 'memeShare')
    if sh and 'navigator.share' not in sh:
        warns.append('share function has no navigator.share (ok if intentional)')

    wm = extract_fn(text, 'memeUpdateWmLink')
    if not wm:
        errs.append('memeUpdateWmLink missing')
    else:
        if 'clarityOpenMemeStudio' in wm:
            errs.append('watermark link must open site, not clarityOpenMemeStudio')
        if 'clarity-dawah.fyi' not in wm and 'location.origin' not in wm:
            errs.append('watermark link has no site URL')
        if "target = '_blank'" not in wm and 'target="_blank"' not in wm:
            warns.append('watermark link may not open new tab')

    if text.count('<script') != text.count('</script>'):
        errs.append('script tag imbalance')
    if re.search(r'async\s*\n\s*var ', text):
        errs.append('orphaned async keyword')

    if errs:
        print('FAIL — do not ship')
        for e in errs:
            print('  ERR:', e)
        for w in warns:
            print('  WARN:', w)
        return 1
    print('PASS — structure clean')
    for w in warns:
        print('  WARN:', w)
    print(f'  size={len(text)} bytes')
    return 0

if __name__ == '__main__':
    sys.exit(audit(sys.argv[1] if len(sys.argv)>1 else 'index.html'))
