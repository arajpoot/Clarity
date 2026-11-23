/*! companion-meme-portal-v1 · CM9 single pill — never double */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_PORTAL_CM9__) return;
  w.__COMPANION_MEME_PORTAL_CM9__ = true;

  function ensureCss() {
    if (d.querySelector("link[data-cm-meme-portal]")) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/companion/assets/css/companion-meme-portal-v1.css?v=20261122CM9";
    l.setAttribute("data-cm-meme-portal", "1");
    d.head.appendChild(l);
  }

  function dedupe() {
    var all = d.querySelectorAll("#cm-meme-portal, .cm-meme-portal");
    if (all.length <= 1) return;
    for (var i = 1; i < all.length; i++) {
      try {
        all[i].parentNode.removeChild(all[i]);
      } catch (e) {}
    }
  }

  function mount() {
    ensureCss();
    d.documentElement.setAttribute("data-meme-portal", "1");
    dedupe();
    if (d.getElementById("cm-meme-portal")) {
      dedupe();
      return; /* already in HTML — do not inject second */
    }
    /* only inject if truly missing */
    var host = d.getElementById("cs-mount") || d.querySelector("main");
    if (!host) return;
    var wrap = d.createElement("div");
    wrap.innerHTML =
      '<section class="cm-meme-portal" id="cm-meme-portal" aria-label="Meme Art Studio">' +
      '<p class="kicker">Reminder · isolated atelier</p>' +
      "<h2>Meme Art Studio</h2>" +
      "<p>Paint a short reminder on scenery — open the isolated room.</p>" +
      '<a class="cta" href="/companion/meme/">Open Meme Art Studio →</a>' +
      '<div class="sub"><a href="/companion/meme/">Scenery · canvas</a><a href="/craft/meme/">Craft copy</a></div>' +
      '<p class="stamp">Educational only — not a fatwa</p></section>';
    host.insertBefore(wrap.firstChild, host.firstChild);
    dedupe();
  }

  function boot() {
    try {
      mount();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 300);
  setTimeout(boot, 1000);
  var m = d.getElementById("cs-mount");
  if (m)
    new MutationObserver(function () {
      setTimeout(function () {
        dedupe();
        mount();
      }, 50);
    }).observe(m, { childList: true, subtree: true });
})(window, document);
