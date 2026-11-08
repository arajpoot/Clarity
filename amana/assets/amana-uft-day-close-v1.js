/*! Amānah UFT · day-close v1
 * Move window-meta text above viewport; scrub leaked script text; ensure room nav links exist
 * Educational only — not a legal pedigree
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_DAY_CLOSE_V1__) return;
  w.__CLARITY_AMANA_UFT_DAY_CLOSE_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("uft-stage");
  }

  function ensureRoomNav() {
    var nav = d.querySelector(".clarity-room-nav");
    if (!nav) return;
    if (nav.querySelectorAll("a[data-room-link], a[href]").length >= 4) return;
    nav.innerHTML =
      '<a href="/companion/" data-room-link="companion"><span class="crn-label">Companion</span></a>' +
      '<a href="/yawm/" data-room-link="yawm"><span class="crn-label">Yawm</span></a>' +
      '<a href="/university/" data-room-link="university"><span class="crn-label">University</span></a>' +
      '<a href="/amana/" data-room-link="amana" class="is-here" aria-current="page"><span class="crn-label">Amānah</span></a>' +
      '<a href="/craft/" data-room-link="craft"><span class="crn-label">Craft</span></a>';
  }

  function scrubScriptLeaks() {
    /* Remove text nodes / elements that look like dumped JS under body start */
    var body = d.body;
    if (!body) return;
    var child = body.firstChild;
    var guard = 0;
    while (child && guard++ < 12) {
      var next = child.nextSibling;
      if (child.nodeType === 3) {
        var tx = child.textContent || "";
        if (/^\s*(\(function|\/\*!|"use strict"|function\s*\()/.test(tx)) {
          body.removeChild(child);
        }
      } else if (child.nodeType === 1 && child.tagName === "SCRIPT" && !(child.src || "").trim()) {
        var code = child.textContent || "";
        if (code.length > 40 && /localStorage|uftRender|clarity_uft/.test(code) && !child.type) {
          /* leave intentional inline; only remove if it's clearly a dump with no markers */
        }
      } else if (child.nodeType === 1 && child.tagName === "P" || (child.className && /leak/i.test(child.className))) {
        var t = (child.textContent || "").trim();
        if (/^\(function|__CLARITY_AMANA/.test(t)) child.remove();
      }
      child = next;
    }
  }

  function liftMetaOutside() {
    var host = d.getElementById("uft-meta-outside");
    if (!host) {
      var stage = d.getElementById("uft-stage");
      if (!stage || !stage.parentNode) return;
      host = d.createElement("p");
      host.id = "uft-meta-outside";
      host.className = "uft-meta-outside";
      stage.parentNode.insertBefore(host, stage);
    }
    var meta = d.querySelector("#uft-preview .uft-window-meta, #uft-stage .uft-window-meta");
    if (meta && (meta.textContent || "").trim()) {
      host.textContent = meta.textContent.trim();
      meta.style.display = "none";
    }
  }

  function settle() {
    if (!isTree()) return;
    ensureRoomNav();
    scrubScriptLeaks();
    liftMetaOutside();
  }

  function wrap() {
    if (typeof w.uftRender === "function" && !w.uftRender.__dayClose) {
      var orig = w.uftRender;
      w.uftRender = function () {
        var r = orig.apply(this, arguments);
        setTimeout(liftMetaOutside, 0);
        return r;
      };
      w.uftRender.__dayClose = true;
    }
  }

  function boot() {
    if (!isTree()) return;
    wrap();
    settle();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 250);
  });
})(window, document);
