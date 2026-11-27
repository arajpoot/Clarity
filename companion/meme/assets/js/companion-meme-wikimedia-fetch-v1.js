/*! companion-meme-wikimedia-fetch-v1.js
 * Free Wikimedia Commons scenery fetch (generator=search).
 * Filters humans/animals via memeBgIsBlocked when present.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_MEME_WIKIMEDIA_V1__) return;
  w.__CLARITY_MEME_WIKIMEDIA_V1__ = true;

  var QUERIES = [
    "mosque architecture",
    "islamic geometric pattern",
    "desert landscape",
    "night sky stars",
    "ocean horizon",
    "mountain landscape",
    "olive grove",
    "masjid dome exterior",
    "sand dunes arabia",
    "green pasture field"
  ];
  var qIdx = 0;
  var cache = [];

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  function blocked(url, title) {
    if (typeof w.memeBgIsBlocked === "function") return w.memeBgIsBlocked(url, title);
    return /\b(portrait|people|person|animal|cat|dog)\b/i.test(String(url) + " " + String(title));
  }

  function applyUrl(url, title) {
    if (typeof w.memeLoadImageFromUrl === "function") {
      w.memeLoadImageFromUrl(url, "Unavailable", title);
      return;
    }
    if (typeof w.memeFetchBg === "function") {
      /* fallback: set pool push */
    }
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      if (!w.memeState) w.memeState = {};
      w.memeState.img = im;
      w.memeState.bgImage = im;
      status("Wikimedia · " + (title || "scenery"));
      try {
        if (typeof w.memeRender === "function") w.memeRender();
      } catch (e) {}
    };
    im.onerror = function () { status("Wikimedia image failed — try again"); };
    im.src = url;
  }

  function fetchBatch(query) {
    status("Wikimedia · searching “" + query + "”…");
    var api =
      "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*" +
      "&generator=search&gsrnamespace=6&gsrlimit=12&gsrsearch=" + encodeURIComponent(query) +
      "&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=1280";
    return fetch(api, { credentials: "omit" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var pages = (data && data.query && data.query.pages) || {};
        var list = [];
        Object.keys(pages).forEach(function (id) {
          var p = pages[id];
          var info = p.imageinfo && p.imageinfo[0];
          if (!info) return;
          var url = info.thumburl || info.url;
          var title = p.title || "";
          var mime = (info.mime || "").toLowerCase();
          if (mime && mime.indexOf("image/") !== 0) return;
          if (blocked(url + " " + title, title)) return;
          list.push({ url: url, title: title.replace(/^File:/, "") });
        });
        return list;
      });
  }

  function memeFetchWikimedia(forceQuery) {
    var query = forceQuery || QUERIES[qIdx % QUERIES.length];
    qIdx++;
    fetchBatch(query)
      .then(function (list) {
        if (!list || !list.length) {
          status("No safe Wikimedia hits — trying next query");
          if (!forceQuery) return memeFetchWikimedia(QUERIES[qIdx % QUERIES.length]);
          return;
        }
        cache = list;
        var pick = list[Math.floor(Math.random() * list.length)];
        applyUrl(pick.url, pick.title);
      })
      .catch(function () {
        status("Wikimedia network error — using local pool");
        if (typeof w.memeFetchBg === "function") w.memeFetchBg("nature");
      });
  }

  w.memeFetchWikimedia = memeFetchWikimedia;
  w.memeWikimediaNext = function () {
    if (cache.length > 1) {
      var pick = cache[Math.floor(Math.random() * cache.length)];
      applyUrl(pick.url, pick.title);
      return;
    }
    memeFetchWikimedia();
  };
})(window, document);
