/*! Amānah UFT housekeep v2.1 · softened
 * Initials strip · orient bar · do not hide registry richness
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_HOUSEKEEP_V2__) return;
  w.__CLARITY_AMANA_UFT_HOUSEKEEP_V2__ = true;

  var ORIENT_KEY = "clarity_uft_orient_v1";

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("user-family-tree-card");
  }

  function stripInitials() {
    d.querySelectorAll(".uft-avatar").forEach(function (el) {
      el.style.display = "none";
      el.setAttribute("aria-hidden", "true");
    });
  }

  function applyOrient(mode) {
    var preview = d.getElementById("uft-preview") || d.getElementById("uft-stage");
    if (!preview) return;
    preview.classList.toggle("uft-orient-h", mode === "h");
    preview.classList.toggle("uft-orient-v", mode === "v");
    preview.classList.add("uft-tree");
    try {
      localStorage.setItem(ORIENT_KEY, mode);
    } catch (e) {}
    d.querySelectorAll("[data-uft-orient]").forEach(function (btn) {
      var on = btn.getAttribute("data-uft-orient") === mode;
      btn.classList.toggle("is-on", on);
      btn.style.background = on ? "rgba(30,125,94,0.45)" : "rgba(0,0,0,0.28)";
    });
  }

  function ensureOrientBar() {
    if (d.getElementById("uft-orient-bar-hk")) return;
    var stage = d.getElementById("uft-stage");
    if (!stage || !stage.parentNode) return;
    var bar = d.createElement("div");
    bar.id = "uft-orient-bar-hk";
    bar.style.cssText =
      "display:flex;flex-wrap:wrap;align-items:center;gap:0.35rem;margin:0.35rem 0;font-size:0.75rem";
    bar.innerHTML =
      '<span style="opacity:.85">Viewport</span>' +
      '<button type="button" data-uft-orient="h" class="is-on" style="padding:0.28rem 0.65rem;border-radius:999px;border:1px solid rgba(212,180,90,.4);background:rgba(30,125,94,.45);color:inherit;font-weight:700;cursor:pointer">Horizontal</button>' +
      '<button type="button" data-uft-orient="v" style="padding:0.28rem 0.65rem;border-radius:999px;border:1px solid rgba(212,180,90,.4);background:rgba(0,0,0,.28);color:inherit;font-weight:700;cursor:pointer">Vertical</button>';
    stage.parentNode.insertBefore(bar, stage);
    bar.querySelectorAll("[data-uft-orient]").forEach(function (btn) {
      btn.onclick = function () {
        applyOrient(btn.getAttribute("data-uft-orient"));
        try {
          if (typeof w.uftRender === "function") w.uftRender({ keepScroll: true });
        } catch (e) {}
        setTimeout(stripInitials, 150);
      };
    });
  }

  function expandRegistryRichness() {
    /* Open deep registry panel */
    var deep = d.getElementById("uft-registry-deep");
    if (deep) {
      deep.classList.remove("uft-reg-collapsed");
      deep.style.display = "";
      deep.hidden = false;
    }
    try {
      localStorage.setItem("clarity_uft_reg_collapsed_v1", "0");
    } catch (e) {}
    /* Expand dock registry section if present */
    d.querySelectorAll("details.uft-registry, #uft-registry-box, details[data-uft-reg]").forEach(function (el) {
      try {
        el.open = true;
        el.hidden = false;
        el.style.display = "";
      } catch (err) {}
    });
  }

  function settle() {
    if (!isTree()) return;
    ensureOrientBar();
    var mode = "h";
    try {
      var v = localStorage.getItem(ORIENT_KEY);
      if (v === "v" || v === "h") mode = v;
    } catch (e) {}
    applyOrient(mode);
    stripInitials();
    expandRegistryRichness();
  }

  function wrapRender() {
    if (typeof w.uftRender !== "function" || w.uftRender.__hk2) return;
    var orig = w.uftRender;
    w.uftRender = function () {
      var r = orig.apply(this, arguments);
      setTimeout(function () {
        stripInitials();
        expandRegistryRichness();
      }, 0);
      return r;
    };
    w.uftRender.__hk2 = true;
  }

  function boot() {
    if (!isTree()) return;
    wrapRender();
    settle();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1800);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 300);
  });
})(window, document);
