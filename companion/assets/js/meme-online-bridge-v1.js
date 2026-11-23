/*! meme-online-bridge-v1 · CM8 — single source of truth for bg → owner paint + desks */
(function (w, d) {
  "use strict";
  if (w.__MEME_ONLINE_BRIDGE_CM8__) return;
  w.__MEME_ONLINE_BRIDGE_CM8__ = true;

  function applyImg(im, note) {
    if (!im) return;
    w.memeState = w.memeState || {};
    w.memeState.img = im;
    w.memeState.bgImage = im;
    var st = d.getElementById("meme-status");
    if (st) st.textContent = note || "Background ready";
    var fs = d.getElementById("meme-fetch-status");
    if (fs) fs.textContent = note || "Online scenery ready";
    if (typeof w.ClarityMemeRepaint === "function") w.ClarityMemeRepaint();
    else if (typeof w.ClarityMemeOwnerPaint === "function") w.ClarityMemeOwnerPaint();
    d.dispatchEvent(new CustomEvent("meme-bg-ready"));
  }

  /* Provide loader online-bg expects */
  w.memeLoadImageFromUrl = function (url, failMsg) {
    if (!url) return;
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      applyImg(im, "Online scenery ready");
    };
    im.onerror = function () {
      var st = d.getElementById("meme-status");
      if (st) st.textContent = failMsg || "Scene load failed";
    };
    im.src = url;
  };

  /* Poll only as safety net */
  var last = null;
  setInterval(function () {
    try {
      var s = w.memeState;
      if (!s || !s.img || s.img === last) return;
      last = s.img;
      s.bgImage = s.img;
      if (typeof w.ClarityMemeRepaint === "function") w.ClarityMemeRepaint();
    } catch (e) {}
  }, 500);
})(window, document);
