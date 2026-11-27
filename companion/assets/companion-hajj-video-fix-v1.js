/*! companion-hajj-video-fix-v1.js — correct Hajj series embeds only */
(function (w, d) {
  'use strict';
  if (w.__COMPANION_HAJJ_VIDEO_FIX_V1__) return;
  w.__COMPANION_HAJJ_VIDEO_FIX_V1__ = true;

  var DEFAULT_ID = 'MUDNDj4n7I4';
  var HAJJ_PLAYLIST = 'PL98jztrfutUSLooSrRiIWraakYkDGVgzd';
  // Do NOT use PL62RQxDpIL7UAWIf4ZHOH5aJIt3YHc7rg (Tajweed — wrong series)

  function frame() {
    return d.getElementById('hajj-yt-frame-frame');
  }
  function openDetails() {
    var host = d.querySelector('[data-embed-id="hajj-yt-frame"]');
    if (host) host.open = true;
  }
  function setVideo(id) {
    id = (id || DEFAULT_ID).trim();
    var f = frame();
    if (!f) return;
    var url = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?rel=0&modestbranding=1';
    f.setAttribute('data-src', url);
    f.src = url;
    var open = d.getElementById('hajj-yt-open');
    if (open) open.href = 'https://youtu.be/' + id;
    openDetails();
  }

  // Overwrite loader (live may have stub)
  w.hajjLoadEpisode = function (id) {
    setVideo(id || DEFAULT_ID);
  };

  function fixDefaultEmbed() {
    var f = frame();
    if (!f) return;
    var cur = f.getAttribute('data-src') || f.src || '';
    if (cur.indexOf('PL62RQxDpIL7UAWIf4ZHOH5aJIt3YHc7rg') >= 0 || cur.indexOf('videoseries') >= 0 && cur.indexOf(HAJJ_PLAYLIST) < 0) {
      setVideo(DEFAULT_ID);
    }
    // Wire details toggle to load data-src → src
    var host = d.querySelector('[data-embed-id="hajj-yt-frame"]');
    if (host && !host._hajjVideoBound) {
      host._hajjVideoBound = true;
      host.addEventListener('toggle', function () {
        if (!host.open) return;
        var f2 = frame();
        if (!f2) return;
        var ds = f2.getAttribute('data-src');
        if (ds && (!f2.src || f2.src === 'about:blank' || f2.src.indexOf('PL62RQx') >= 0)) {
          f2.src = ds.indexOf('PL62RQx') >= 0
            ? 'https://www.youtube-nocookie.com/embed/' + DEFAULT_ID + '?rel=0&modestbranding=1'
            : ds;
        }
      });
    }
    var sel = d.getElementById('hajj-ep');
    if (sel && !sel._hajjVideoBound) {
      sel._hajjVideoBound = true;
      sel.addEventListener('change', function () {
        w.hajjLoadEpisode(sel.value);
      });
    }
  }

  function boot() {
    fixDefaultEmbed();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
  try {
    var mo = new MutationObserver(function () {
      if (frame()) fixDefaultEmbed();
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 20000);
  } catch (e) {}
})(window, document);
