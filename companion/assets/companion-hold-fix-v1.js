/*! Hold-fix · reflection enrichment holds · meme options wire · path width already CSS
 * Educational only — not a fatwa. §3 + §3A.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_HOLD_FIX_V1__) return;
  w.__COMPANION_HOLD_FIX_V1__ = true;

  var REF_CACHE = null;

  function root() {
    return d.getElementById("cs-mount") || d;
  }

  function unhide(el) {
    var n = 0;
    while (el && el !== d.body && n < 14) {
      if (el.nodeType === 1) {
        if (el.tagName === "DETAILS") el.open = true;
        el.style.setProperty("display", el.tagName === "DETAILS" ? "block" : (el.style.display === "none" ? "block" : el.style.display || ""), "important");
        el.style.setProperty("visibility", "visible", "important");
        el.style.setProperty("opacity", "1", "important");
      }
      el = el.parentElement;
      n++;
    }
  }

  function holdReflection() {
    var r = root();
    var media = r.querySelector("#reflection-media-restored");
    if (media) {
      REF_CACHE = media.cloneNode(true);
      unhide(media);
      media.querySelectorAll("details").forEach(function (det) {
        det.open = true;
      });
      media.querySelectorAll("iframe").forEach(function (f) {
        var ds = f.getAttribute("data-src");
        if (ds && (!f.getAttribute("src") || /about:blank/i.test(f.getAttribute("src")))) f.setAttribute("src", ds);
        f.style.setProperty("display", "block", "important");
        f.style.setProperty("min-height", "240px", "important");
        f.style.setProperty("width", "100%", "important");
        f.style.setProperty("height", "240px", "important");
      });
      return;
    }
    // disappeared — restore from cache if we had it this session
    if (REF_CACHE && (d.body.getAttribute("data-active-tab") === "reflection")) {
      var body = r.querySelector("[data-cs-tab-body]") || r;
      if (body && !body.querySelector("#reflection-media-restored")) {
        body.appendChild(REF_CACHE.cloneNode(true));
        holdReflection();
      }
    }
  }

  function dedupeMemeAndWire() {
    var r = root();
    // hide compact second studio host
    r.querySelectorAll("#cs-meme-compact, [data-meme-compact]").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
    });
    // remove duplicate tweet desks (keep first)
    var desks = r.querySelectorAll("#tweet-desk-card, .tweet-desk");
    if (desks.length > 1) {
      for (var i = 1; i < desks.length; i++) {
        desks[i].setAttribute("data-deduped", "1");
        desks[i].style.setProperty("display", "none", "important");
      }
    }
    // ensure canvas visible + paint
    var canvas = r.querySelector("#meme-canvas");
    var stage = r.querySelector("#meme-stage");
    if (stage) {
      unhide(stage);
      stage.style.setProperty("min-height", "220px", "important");
      stage.style.setProperty("width", "100%", "important");
    }
    if (canvas) {
      unhide(canvas);
      canvas.style.setProperty("display", "block", "important");
      canvas.style.setProperty("width", "100%", "important");
      canvas.style.setProperty("min-height", "220px", "important");
      if (!canvas.width || canvas.width < 8) canvas.width = 1200;
      if (!canvas.height || canvas.height < 8) canvas.height = 675;
      try {
        if (w.ClarityMemePaintV2 && w.ClarityMemePaintV2.paint) w.ClarityMemePaintV2.paint();
        else if (typeof w.paintMeme === "function") w.paintMeme();
      } catch (e) {}
    }
    // wire common meme option chips if handlers missing
    function stub(name, fn) {
      if (typeof w[name] !== "function") w[name] = fn;
    }
    stub("clarityMemeDecorBg", function (k) {
      if (w.memeState) w.memeState.decor = k;
      try {
        if (w.ClarityMemePaintV2 && w.ClarityMemePaintV2.paint) w.ClarityMemePaintV2.paint();
      } catch (e) {}
    });
    stub("tdSendToMeme", function () {
      try {
        if (typeof w.clarityMemeFill === "function") {
          /* no-op fill from verse hosts if any */
        }
        if (w.ClarityMemePaintV2 && w.ClarityMemePaintV2.paint) w.ClarityMemePaintV2.paint();
      } catch (e) {}
    });
    // click wire for chips with onclick that reference missing fns — already in HTML
  }

  function run() {
    var tab = d.body && d.body.getAttribute("data-active-tab");
    if (tab === "reflection") holdReflection();
    if (tab === "reminder") dedupeMemeAndWire();
    // always path width via CSS; re-cache reflection whenever present
    var media = root().querySelector("#reflection-media-restored");
    if (media) REF_CACHE = media.cloneNode(true);
  }

  function boot() {
    run();
    d.addEventListener("clarity:tab-mounted", function () {
      setTimeout(run, 30);
      setTimeout(run, 180);
      setTimeout(run, 500);
    });
    // path switches often re-filter DOM — re-hold
    d.addEventListener(
      "click",
      function (ev) {
        var p = ev.target && ev.target.closest && ev.target.closest("[data-cs-path]");
        if (p) setTimeout(run, 80);
      },
      true
    );
    var m = d.getElementById("cs-mount");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(run, 60);
      }).observe(m, { childList: true, subtree: true });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityHoldFix = { run: run, version: "HF1" };
})(window, document);
