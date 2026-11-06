/*! companion-pack-boot-v1 · polished · DOMParser mount · sequential scripts · governance */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_PACK_BOOT_V1__) return;
  w.__CLARITY_PACK_BOOT_V1__ = true;

  var V = "20261106G4P2";
  var FRAGMENT = "/companion/content/main.fragment.html?v=" + V;
  var JS = ["/companion/assets/companion-boot-v2.js?v=20261104EC", "/companion/assets/companion-boot-shim-v1.js?v=20261106C1", "/companion/assets/companion-room-owner-v1.js?v=20261104EN", "/companion/assets/companion-shariah-guard-v1.js?v=20261106C1", "/companion/assets/companion-error-guard-v1.js?v=20261106C1", "/companion/assets/companion-banner-viewport-v1.js?v=20261104VP", "/companion/assets/companion-banner-mobile-v1.js?v=20261105M1", "/companion/assets/companion-banner-desktop-v1.js?v=20261105D1", "/companion/assets/companion-banner-controls-v1.js?v=20261105FIX1", "/companion/assets/companion-banner-plaques-v1.js?v=20261105Q2", "/companion/assets/companion-banner-enrich-v1.js?v=20261106B1", "/companion/assets/companion-haramain-temps-v1.js?v=20261105M1", "/companion/assets/companion-ai-maintainer-v1.js?v=20261104AIM", "/assets/room-nav/clarity-room-nav-v1.js?v=20261104C10", "/companion/assets/companion-g1-integrity-v1.js?v=20261106G1", "/companion/assets/clarity-companion-unfreeze-v3.js?v=20261104EC", "/companion/assets/companion-tab-persist-v35.js?v=20261104EC", "/companion/assets/clarity-meme-api-bridge-v1.js?v=20261104EC", "/companion/assets/companion-craft-core-v1.js?v=20261104EC", "/assets/clarity-path-progress-v1.js?v=20261101WB1", "/companion/assets/companion-path-governance-v1.js?v=20261106G1", "/assets/clarity-grave-path-curriculum-js.js?v=20261101WB1", "/assets/clarity-link-stubs-v1.js?v=20261101WB1", "/companion/assets/companion-meme-studio-fix-v1.js?v=20261104MS3", "/companion/assets/companion-frag-inline-v1.js?v=20261106G4P", "/companion/assets/companion-g6-midway-v1.js?v=20261106G6", "/companion/assets/companion-g7-content-live-v1.js?v=20261106G7"];
  var LOG = (w.__PACK_BOOT_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function loadScript(src) {
    return new Promise(function (resolve) {
      var bare = String(src).split("?")[0];
      if (d.querySelector('script[data-pack-src="' + bare + '"]')) {
        resolve(true);
        return;
      }
      var s = d.createElement("script");
      s.src = src;
      s.async = false;
      s.setAttribute("data-pack-src", bare);
      s.onload = function () { log("js-ok " + bare); resolve(true); };
      s.onerror = function () { log("js-fail " + bare); resolve(false); };
      (d.body || d.documentElement).appendChild(s);
    });
  }

  function chainScripts(list) {
    var i = 0;
    function next() {
      if (i >= list.length) {
        log("scripts-done");
        try {
          d.dispatchEvent(new CustomEvent("clarity-companion-pack-ready"));
        } catch (e) {}
        return;
      }
      var src = list[i++];
      loadScript(src).then(next);
    }
    next();
  }

  function mountHTML(html) {
    var root = d.getElementById("companion-pack-root");
    if (!root) {
      log("no-root");
      return false;
    }
    /* Prefer DOMParser to avoid executing scripts twice; scripts stripped from fragment */
    try {
      var doc = new DOMParser().parseFromString('<div id="__pack_wrap__">' + html + "</div>", "text/html");
      var wrap = doc.getElementById("__pack_wrap__");
      root.innerHTML = "";
      if (wrap) {
        while (wrap.firstChild) root.appendChild(d.importNode(wrap.firstChild, true));
      } else {
        root.innerHTML = html;
      }
    } catch (e) {
      root.innerHTML = html;
      log("parse-fallback");
    }
    d.documentElement.setAttribute("data-clarity-room", "companion");
    d.documentElement.setAttribute("data-companion-pack", "G4");
    try {
      d.dispatchEvent(new CustomEvent("clarity-companion-mounted"));
    } catch (e2) {}
    log("mounted");
    return true;
  }

  function fail(msg) {
    var root = d.getElementById("companion-pack-root");
    if (root) {
      root.innerHTML =
        '<div role="alert" style="padding:1rem;max-width:36rem;margin:1rem auto;font-family:system-ui,sans-serif">' +
        "<p><strong>Companion pack failed to load.</strong></p>" +
        "<p>" + msg + "</p>" +
        '<p><a href="/companion/content/full.backup.html">Open backup shell</a> · hard-refresh · educational only — not a fatwa.</p></div>';
    }
    log("fail:" + msg);
  }

  function boot() {
    log("boot");
    fetch(FRAGMENT, { credentials: "same-origin", cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (html) {
        if (!html || html.length < 500) throw new Error("fragment too small");
        if (!mountHTML(html)) throw new Error("mount failed");
        chainScripts(JS);
      })
      .catch(function (e) {
        fail(String((e && e.message) || e));
      });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
