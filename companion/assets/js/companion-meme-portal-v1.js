/*! companion-meme-portal-v1 · sleek CTA to isolated /companion/meme/ */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_PORTAL_V1__) return;
  w.__COMPANION_MEME_PORTAL_V1__ = true;
  function ensureCss() {
    if (d.querySelector('link[data-cm-meme-portal]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/companion/assets/css/companion-meme-portal-v1.css?v=20261122CM4";
    l.setAttribute("data-cm-meme-portal", "1");
    d.head.appendChild(l);
  }
  function portalHtml() {
    return (
      '<section class="cm-meme-portal" id="cm-meme-portal">' +
      '<p class="kicker">Companion · isolated atelier</p>' +
      "<h2>Meme Art Studio</h2>" +
      "<p>Scenery · verse layers · X &amp; Facebook desks — in its own room (banner pattern).</p>" +
      '<a class="cta" href="/companion/meme/">Open Meme Art Studio →</a>' +
      '<div class="sub">' +
      '<a href="/companion/meme/">Canvas &amp; packs</a>' +
      '<a href="/craft/meme/">Craft copy</a>' +
      "</div>" +
      '<p class="stamp">Educational only — not a fatwa · scenery preferred · export on this device</p>' +
      "</section>"
    );
  }
  function soften(root) {
    var h2 = (root || d).querySelector("#r8-meme, h2#r8-meme");
    if (!h2) return;
    var block = h2.closest("section, article, .cs-plaque") || h2.parentElement;
    if (!block) return;
    var ul = block.querySelector("ul");
    if (ul) ul.classList.add("cm-meme-noise-hide");
    var lead = block.querySelector("p.lead");
    if (lead) lead.classList.add("cm-meme-noise-hide");
  }
  function mount() {
    ensureCss();
    d.documentElement.setAttribute("data-meme-portal", "1");
    if (d.getElementById("cm-meme-portal")) {
      soften(d);
      return;
    }
    var host = d.getElementById("r8-meme") || d.querySelector("h2#r8-meme") || d.getElementById("cs-mount");
    var wrap = d.createElement("div");
    wrap.innerHTML = portalHtml();
    var node = wrap.firstChild;
    if (host && host.parentNode) {
      if (host.id === "r8-meme" || (host.tagName || "").toLowerCase() === "h2")
        host.parentNode.insertBefore(node, host);
      else host.insertBefore(node, host.firstChild);
    } else (d.querySelector("main") || d.body).appendChild(node);
    soften(d);
  }
  function boot() {
    try {
      mount();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
  var m = d.getElementById("cs-mount");
  if (m)
    new MutationObserver(function () {
      setTimeout(boot, 80);
    }).observe(m, { childList: true, subtree: true });
})(window, document);
