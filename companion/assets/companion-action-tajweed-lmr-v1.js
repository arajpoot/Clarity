/*! companion-action-tajweed-lmr-v1.js — bridge verse picker + ensure LMR hosts on Action */
(function (w, d) {
  'use strict';
  if (w.__COMPANION_ACTION_TJ_LMR_V1__) return;
  w.__COMPANION_ACTION_TJ_LMR_V1__ = true;

  function $(id) { return d.getElementById(id); }

  function maxAyah() {
    var sel = $('tj-bridge-surah');
    if (!sel || !sel.selectedOptions || !sel.selectedOptions[0]) return 7;
    var n = parseInt(sel.selectedOptions[0].getAttribute('data-ayah') || '7', 10);
    return n > 0 ? n : 7;
  }

  function syncMax() {
    var max = maxAyah();
    var label = $('tj-bridge-ayah-max');
    var input = $('tj-bridge-ayah');
    if (label) label.textContent = '/ ' + max;
    if (input) {
      input.max = String(max);
      var v = parseInt(input.value, 10) || 1;
      if (v > max) input.value = String(max);
      if (v < 1) input.value = '1';
    }
  }

  function status(msg) {
    var el = $('tj-bridge-status');
    if (el) el.textContent = msg || '';
  }

  function pull() {
    syncMax();
    var s = parseInt(($('tj-bridge-surah') && $('tj-bridge-surah').value) || '1', 10);
    var a = parseInt(($('tj-bridge-ayah') && $('tj-bridge-ayah').value) || '1', 10);
    status('Pulling ' + s + ':' + a + '…');
    // Prefer craft bridge hooks if present
    if (typeof w.craftTajweedPullVerse === 'function') {
      try { w.craftTajweedPullVerse(s, a); status('Loaded ' + s + ':' + a + ' (craft bridge)'); return; } catch (e) {}
    }
    if (typeof w.clarityLmrPull === 'function') {
      try { w.clarityLmrPull(s, a); status('Loaded ' + s + ':' + a + ' (LMR)'); return; } catch (e) {}
    }
    // Fallback: fetch arabic + en for read-along display into host
    var host = $('tj-lmr-host');
    var url = 'https://api.alquran.cloud/v1/ayah/' + s + ':' + a + '/editions/quran-uthmani,en.sahih';
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var arr = data && data.data;
      if (!Array.isArray(arr)) throw new Error('bad');
      var ar = (arr[0] && arr[0].text) || '';
      var en = (arr[1] && arr[1].text) || '';
      if (host) {
        host.innerHTML =
          '<div class="tlmr-fallback" style="padding:.35rem">' +
          '<p class="tlmr-ar" dir="rtl" lang="ar" style="font-size:1.35rem;line-height:1.9;font-family:Amiri,Scheherazade New,serif;margin:0 0 .4rem">' + ar + '</p>' +
          '<p class="tlmr-en" style="font-size:.88rem;opacity:.9;margin:0 0 .5rem"><span style="font-size:.72rem;opacity:.75">Bridge · </span>' + en + '</p>' +
          '<p style="font-size:.78rem;margin:0 0 .35rem"><a href="https://quran.com/' + s + '/' + a + '" target="_blank" rel="noopener">Open on Quran.com</a> · educational only</p>' +
          '<audio controls preload="none" style="width:100%;margin:.25rem 0" src="https://cdn.islamic.network/quran/audio/128/ar.alafasy/' + (arr[0].number || '') + '.mp3"></audio>' +
          '<p style="font-size:.75rem;opacity:.85;margin:.25rem 0 0">Master audio (Alafasy CDN). Record via Craft studio when engine mounts. Not a qāriʾ grade.</p>' +
          '</div>';
      }
      status('Verse ' + s + ':' + a + ' ready · read-along fallback');
      // score stats note
    }).catch(function () {
      status('Could not load verse — check network or open /craft/tajweed/');
    });
  }

  function bind() {
    if (!$('tj-bridge-surah')) return;
    syncMax();
    var sel = $('tj-bridge-surah');
    if (sel && !sel._tlmr) {
      sel._tlmr = true;
      sel.addEventListener('change', syncMax);
    }
    var prev = $('tj-bridge-prev');
    var next = $('tj-bridge-next');
    var pullBtn = $('tj-bridge-pull');
    if (prev && !prev._tlmr) {
      prev._tlmr = true;
      prev.addEventListener('click', function () {
        var input = $('tj-bridge-ayah');
        if (!input) return;
        var v = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
        input.value = String(v);
      });
    }
    if (next && !next._tlmr) {
      next._tlmr = true;
      next.addEventListener('click', function () {
        var input = $('tj-bridge-ayah');
        if (!input) return;
        var v = Math.min(maxAyah(), (parseInt(input.value, 10) || 1) + 1);
        input.value = String(v);
      });
    }
    if (pullBtn && !pullBtn._tlmr) {
      pullBtn._tlmr = true;
      pullBtn.addEventListener('click', pull);
    }
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bind);
  else bind();
  setTimeout(bind, 600);
  try {
    var mo = new MutationObserver(bind);
    mo.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 15000);
  } catch (e) {}
})(window, document);
