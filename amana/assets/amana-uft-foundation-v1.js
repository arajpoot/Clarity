/*! Amānah UFT foundation v1 · one polish layer
 * orient · meta outside · nav ensure · no ghost stacks
 * Educational only — not a legal pedigree
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_FOUNDATION_V1__) return;
  w.__CLARITY_AMANA_UFT_FOUNDATION_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("uft-stage");
  }

  function ensureNav() {
    var nav = d.querySelector(".clarity-room-nav");
    if (!nav) return;
    if (nav.querySelectorAll("a[href]").length >= 4) return;
    nav.innerHTML =
      '<a href="/companion/" data-room-link="companion">Companion</a>' +
      '<a href="/yawm/" data-room-link="yawm">Yawm</a>' +
      '<a href="/university/" data-room-link="university">University</a>' +
      '<a href="/amana/" data-room-link="amana" class="is-here" aria-current="page">Amānah</a>' +
      '<a href="/craft/" data-room-link="craft">Craft</a>';
  }

  function scrubLeaks() {
    var body = d.body;
    if (!body) return;
    var n = body.firstChild;
    var i = 0;
    while (n && i++ < 15) {
      var next = n.nextSibling;
      if (n.nodeType === 3) {
        var t = n.textContent || "";
        if (/^\s*(\(function|\/\*!|"use strict"|\{[\s\S]*"registry")/.test(t)) {
          body.removeChild(n);
        }
      }
      n = next;
    }
    /* Hide accidental pre/code JSON dumps */
    d.querySelectorAll("pre, code, p").forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (t.length > 80 && (/^\s*[\{\[]/.test(t) && /"registry"|"self"|"relatives"/.test(t))) {
        el.style.display = "none";
      }
      if (/^\s*(\(function|__CLARITY_AMANA)/.test(t)) el.style.display = "none";
    });
  }

  function orient() {
    var preview = d.getElementById("uft-preview") || d.getElementById("uft-stage");
    if (!preview) return;
    var mode = "h";
    try {
      var v = localStorage.getItem("clarity_uft_orient_v1");
      if (v === "v" || v === "h") mode = v;
    } catch (e) {}
    preview.classList.add("uft-tree");
    preview.classList.toggle("uft-orient-h", mode === "h");
    preview.classList.toggle("uft-orient-v", mode === "v");
    d.querySelectorAll("[data-uft-orient]").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-uft-orient") === mode);
    });
  }

  function liftMeta() {
    var host = d.getElementById("uft-meta-outside");
    var stage = d.getElementById("uft-stage");
    if (!host && stage && stage.parentNode) {
      host = d.createElement("p");
      host.id = "uft-meta-outside";
      stage.parentNode.insertBefore(host, stage);
    }
    if (!host) return;
    var meta = d.querySelector("#uft-preview .uft-window-meta");
    if (meta && meta.textContent.trim()) {
      host.textContent = meta.textContent.trim();
      meta.style.display = "none";
    }
  }

  function ensureOrientBar() {
    if (d.getElementById("uft-orient-bar-fnd")) return;
    var stage = d.getElementById("uft-stage");
    if (!stage || !stage.parentNode) return;
    var bar = d.createElement("div");
    bar.id = "uft-orient-bar-fnd";
    bar.style.cssText =
      "display:flex;flex-wrap:wrap;gap:0.35rem;align-items:center;margin:0.35rem 0;font-size:0.75rem";
    bar.innerHTML =
      '<span style="opacity:.85">Viewport</span>' +
      '<button type="button" data-uft-orient="h" style="padding:0.28rem 0.65rem;border-radius:999px;border:1px solid rgba(212,180,90,.4);background:rgba(30,125,94,.45);color:inherit;font-weight:700;cursor:pointer">Horizontal</button>' +
      '<button type="button" data-uft-orient="v" style="padding:0.28rem 0.65rem;border-radius:999px;border:1px solid rgba(212,180,90,.4);background:rgba(0,0,0,.28);color:inherit;font-weight:700;cursor:pointer">Vertical</button>';
    stage.parentNode.insertBefore(bar, stage);
    bar.querySelectorAll("[data-uft-orient]").forEach(function (btn) {
      btn.onclick = function () {
        try {
          localStorage.setItem("clarity_uft_orient_v1", btn.getAttribute("data-uft-orient"));
        } catch (e) {}
        orient();
        try {
          if (typeof w.uftRender === "function") w.uftRender({ keepScroll: true });
        } catch (e2) {}
        setTimeout(liftMeta, 50);
      };
    });
  }

  function settle() {
    if (!isTree()) return;
    ensureNav();
    scrubLeaks();
    ensureOrientBar();
    orient();
    liftMeta();
  }

  function wrap() {
    if (typeof w.uftRender === "function" && !w.uftRender.__fnd) {
      var orig = w.uftRender;
      w.uftRender = function () {
        var r = orig.apply(this, arguments);
        setTimeout(function () {
          orient();
          liftMeta();
        }, 0);
        return r;
      };
      w.uftRender.__fnd = true;
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
  setTimeout(boot, 1400);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 250);
  });
})(window, document);
