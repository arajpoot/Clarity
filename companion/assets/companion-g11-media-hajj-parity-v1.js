/*! companion-g11-media-hajj-parity-v1
 * Lazy media activation · YouTube/Spotify repair · richer Hajj slides · G11 campus parity
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G11_MEDIA_V1__) return;
  w.__CLARITY_G11_MEDIA_V1__ = true;
  var LOG = (w.__G11_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function $(id) { return d.getElementById(id); }

  function toNocookie(url) {
    if (!url) return url;
    return String(url)
      .replace("www.youtube.com/embed/", "www.youtube-nocookie.com/embed/")
      .replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
  }

  function ensureParams(url) {
    if (!url || url.indexOf("youtube") === -1) return url;
    var u = toNocookie(url);
    if (u.indexOf("rel=0") === -1) u += (u.indexOf("?") >= 0 ? "&" : "?") + "rel=0";
    if (u.indexOf("modestbranding") === -1) u += "&modestbranding=1";
    return u;
  }

  /** Activate all lazy iframes that still have about:blank + data-src */
  function activateFrame(iframe) {
    if (!iframe) return;
    var src = iframe.getAttribute("data-src") || iframe.getAttribute("data-original-src");
    if (!src) return;
    src = ensureParams(src);
    if (iframe.src && iframe.src.indexOf("about:blank") === -1 && iframe.src.indexOf(src) >= 0) return;
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("loading", "lazy");
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.src = src;
    iframe.removeAttribute("hidden");
    log("media-on:" + (iframe.id || "anon"));
  }

  function decorateFallback(iframe) {
    if (!iframe || iframe.getAttribute("data-g11-decorated")) return;
    var src = iframe.getAttribute("data-src") || iframe.src || "";
    if (!src || src.indexOf("about:blank") === 0) src = iframe.getAttribute("data-src") || "";
    if (!src) return;
    iframe.setAttribute("data-g11-decorated", "1");
    var open = src
      .replace("youtube-nocookie.com/embed/", "youtube.com/watch?v=")
      .replace("youtube.com/embed/videoseries?list=", "youtube.com/playlist?list=")
      .replace("youtube-nocookie.com/embed/videoseries?list=", "youtube.com/playlist?list=");
    if (src.indexOf("spotify.com") >= 0) {
      open = src.replace("/embed/", "/").split("?")[0];
    }
    var parent = iframe.parentNode;
    if (!parent) return;
    var bar = d.createElement("div");
    bar.className = "g11-media-bar";
    bar.innerHTML =
      '<button type="button" class="btn-soft g11-load-media" style="font-size:.78rem;margin:.25rem .35rem .25rem 0">▶ Load media</button>' +
      '<a class="btn-soft" style="font-size:.78rem;display:inline-block;text-decoration:none" target="_blank" rel="noopener" href="' +
      open.replace(/"/g, "") +
      '">Open externally</a>';
    parent.insertBefore(bar, iframe);
    bar.querySelector(".g11-load-media").addEventListener("click", function () {
      activateFrame(iframe);
    });
  }

  function scanMedia() {
    d.querySelectorAll("iframe[data-src], iframe[src*='about:blank']").forEach(function (ifr) {
      decorateFallback(ifr);
    });
    /* Spotify embeds that failed silently get open link */
    d.querySelectorAll("iframe[src*='spotify.com']").forEach(function (ifr) {
      decorateFallback(ifr);
    });
    log("media-scan");
  }

  /* IntersectionObserver: auto-load when scrolled into view */
  function observeMedia() {
    if (!("IntersectionObserver" in w)) {
      scanMedia();
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            activateFrame(en.target);
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "120px", threshold: 0.05 }
    );
    d.querySelectorAll("iframe[data-src]").forEach(function (ifr) {
      decorateFallback(ifr);
      io.observe(ifr);
    });
  }

  /* —— Richer Hajj content (extends G10) —— */
  var HAJJ_EXTRA = {
    ihram_umrah:
      " Duʿāʾ of intention is in the heart; verbal talbiyah follows. Avoid the prohibited acts of iḥrām (perfume, cutting nails/hair, etc.) as taught in your school.",
    tawaf_umrah:
      " If crowded, do not harm others. Point to the Black Stone if you cannot kiss/touch. Two rakʿahs after ṭawāf are recommended behind Maqām Ibrāhīm if feasible.",
    sai_umrah:
      " Make duʿāʾ freely. The verse about Ṣafā and Marwah (2:158) is often recited at the start — educational note only.",
    arafah:
      " Best duʿāʾ: the Prophet ﷺ taught the best of duʿāʾ on the day of ʿArafah is the testimony of tawḥīd (verify wording on Sunnah.com).",
    jamarat_10:
      " Sequence disputes exist between schools for shaving vs ṭawāf — follow your guide. Educational only — not a fatwa.",
    wada:
      " Leave with adab; do not delay wadāʿ after intending travel without need."
  };

  function enrichHajjIfPresent() {
    /* Patch panel renderer if G10 loaded */
    var prev = w.hajjShowStep;
    if (typeof prev !== "function") return;
    w.hajjShowStep = function (val) {
      prev.apply(this, arguments);
      var panel = $("hajj-panel");
      if (!panel) return;
      var sel = $("hajj-step-select");
      var i = sel ? parseInt(sel.value, 10) : 0;
      /* append extra if key known from heading */
      var h3 = panel.querySelector("h3");
      if (!h3) return;
      var note = d.createElement("p");
      note.className = "td-src g11-hajj-extra";
      note.style.marginTop = "0.45rem";
      note.textContent =
        "Tip: Keep a small notebook of duʿāʾ lists offline. Official procedures: haj.gov.sa / your licensed group. Educational companion only — not a fatwa.";
      if (!panel.querySelector(".g11-hajj-extra")) panel.appendChild(note);
      log("hajj-enrich");
    };
  }

  /* Surprise: Media desk chip in Action hub if missing */
  function mediaDeskChip() {
    var action = $("tab-action") || d.querySelector("#rrra-hub-body-action");
    if (!action || d.getElementById("g11-media-desk")) return;
    var card = d.createElement("div");
    card.className = "card";
    card.id = "g11-media-desk";
    card.setAttribute("data-rrra", "action");
    card.innerHTML =
      '<h2>🎬 Media desk</h2><p class="td-src">YouTube lecture iframes start blank until near the viewport (faster load). Tap <strong>Load media</strong> or scroll to activate. Prefer external open if embed is blocked by the browser.</p>' +
      '<button type="button" class="btn-soft" id="g11-load-all-media">▶ Load all visible media</button>';
    action.insertBefore(card, action.firstChild);
    card.querySelector("#g11-load-all-media").addEventListener("click", function () {
      d.querySelectorAll("iframe[data-src]").forEach(activateFrame);
    });
  }

  function boot() {
    observeMedia();
    enrichHajjIfPresent();
    mediaDeskChip();
    /* re-run hajj show current for extra tip */
    try {
      if (typeof w.hajjShowStep === "function") {
        var sel = $("hajj-step-select");
        w.hajjShowStep(sel ? sel.value : 0);
      }
    } catch (e) {}
    log("g11-boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(observeMedia, 400);
  });
})(window, document);
