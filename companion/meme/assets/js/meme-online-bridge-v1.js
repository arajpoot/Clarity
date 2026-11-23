/*! meme-online-bridge-v1 · CM9 — online fetch → single paint + desks */
(function (w, d) {
  "use strict";
  if (w.__MEME_ONLINE_BRIDGE_CM9__) return;
  w.__MEME_ONLINE_BRIDGE_CM9__ = true;

  function applyImg(im, note) {
    if (!im) return;
    w.memeState = w.memeState || {};
    w.memeState.img = im;
    w.memeState.bgImage = im;
    var st = d.getElementById("meme-status");
    if (st) st.textContent = note || "Online scenery ready";
    var fs = d.getElementById("meme-fetch-status");
    if (fs) fs.textContent = note || "Online scenery ready";
    function repaint() {
      if (typeof w.ClarityMemeRepaint === "function") w.ClarityMemeRepaint();
      else if (typeof w.ClarityMemeOwnerPaint === "function") w.ClarityMemeOwnerPaint();
      d.dispatchEvent(new CustomEvent("meme-bg-ready"));
    }
    repaint();
    setTimeout(repaint, 80);
    setTimeout(repaint, 400);
  }

  w.memeLoadImageFromUrl = function (url, failMsg) {
    if (!url) return;
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      applyImg(im, "Online scenery ready");
    };
    im.onerror = function () {
      /* retry without CORS as display-only (desks still use same Image in memory when CORS works) */
      var im2 = new Image();
      im2.onload = function () {
        applyImg(im2, "Online scenery ready");
      };
      im2.onerror = function () {
        var st = d.getElementById("meme-status");
        if (st) st.textContent = failMsg || "Fetch failed — try Next online";
      };
      im2.src = url;
    };
    im.src = url;
  };

  var last = null;
  setInterval(function () {
    try {
      var s = w.memeState;
      if (!s || !s.img || s.img === last) return;
      if (!s.img.complete || !s.img.naturalWidth) return;
      last = s.img;
      s.bgImage = s.img;
      if (typeof w.ClarityMemeRepaint === "function") w.ClarityMemeRepaint();
    } catch (e) {}
  }, 350);
})(window, document);
