/*! Amānah UFT layout · collapse registry + horizontal pedigree orientation */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_LAYOUT_H_V1__) return;
  w.__CLARITY_AMANA_UFT_LAYOUT_H_V1__ = true;

  var ORIENT_KEY = "clarity_uft_orient_v1";
  var REG_KEY = "clarity_uft_reg_collapsed_v1";

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "");
  }

  function preferHorizontal() {
    try {
      var v = localStorage.getItem(ORIENT_KEY);
      if (v === "v") return false;
      if (v === "h") return true;
    } catch (e) {}
    return true; // default horizontal
  }

  function setOrient(mode) {
    var preview = document.getElementById("uft-preview");
    if (preview) {
      preview.classList.toggle("uft-orient-h", mode === "h");
      preview.classList.toggle("uft-orient-v", mode === "v");
    }
    try {
      localStorage.setItem(ORIENT_KEY, mode);
    } catch (e) {}
    document.querySelectorAll("[data-uft-orient]").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-uft-orient") === mode);
    });
    // re-render helps some absolute layouts settle
    try {
      if (typeof w.uftRender === "function") w.uftRender({ keepScroll: true });
    } catch (e) {}
  }

  function ensureOrientBar() {
    if (document.getElementById("uft-orient-bar")) return;
    var stage = document.getElementById("uft-stage");
    var preview = document.getElementById("uft-preview");
    if (!stage && !preview) return;
    var bar = document.createElement("div");
    bar.id = "uft-orient-bar";
    bar.className = "uft-orient-bar";
    bar.innerHTML =
      '<span style="opacity:.85">Viewport</span>' +
      '<button type="button" data-uft-orient="h">Horizontal</button>' +
      '<button type="button" data-uft-orient="v">Vertical</button>';
    var host = document.getElementById("uft-chip-legend") || stage || preview.parentNode;
    if (host && host.parentNode) {
      host.parentNode.insertBefore(bar, host.nextSibling);
    } else if (stage) {
      stage.insertBefore(bar, stage.firstChild);
    }
    bar.querySelectorAll("[data-uft-orient]").forEach(function (btn) {
      btn.onclick = function () {
        setOrient(btn.getAttribute("data-uft-orient"));
      };
    });
  }

  function collapseRegistry(force) {
    var deep = document.getElementById("uft-registry-deep");
    var collapsed = true;
    try {
      if (localStorage.getItem(REG_KEY) === "0") collapsed = false;
    } catch (e) {}
    if (force === true) collapsed = true;
    if (force === false) collapsed = false;

    if (deep) {
      deep.classList.toggle("uft-reg-collapsed", collapsed);
      var bar = deep.querySelector(".uft-reg-collapse-bar");
      if (!bar) {
        bar = document.createElement("div");
        bar.className = "uft-reg-collapse-bar";
        bar.innerHTML =
          '<strong style="color:#e8d5a3;font-size:0.95rem">Registry</strong>' +
          '<button type="button" id="uft-reg-toggle-btn"></button>';
        deep.insertBefore(bar, deep.firstChild);
        document.getElementById("uft-reg-toggle-btn").onclick = function () {
          var now = deep.classList.contains("uft-reg-collapsed");
          try {
            localStorage.setItem(REG_KEY, now ? "0" : "1");
          } catch (e) {}
          collapseRegistry(!now ? true : false);
        };
      }
      var btn = document.getElementById("uft-reg-toggle-btn");
      if (btn) btn.textContent = collapsed ? "Expand registry" : "Collapse registry";
    }

    // Native details build section — collapse list-heavy panels by default once
    var build = document.getElementById("uft-build-section");
    if (build && build.tagName === "DETAILS" && !build.dataset.uftLayoutInit) {
      build.dataset.uftLayoutInit = "1";
      // keep build available but not forced open on small screens
      if (window.matchMedia && window.matchMedia("(max-width:720px)").matches) {
        build.open = false;
      }
    }

    // Older registry list column
    var list = document.getElementById("uft-reg-list");
    if (list && list.parentElement) {
      list.parentElement.classList.toggle("collapsed", collapsed && !deep);
    }
  }

  function boot() {
    if (!isTree()) return;
    try {
      ensureOrientBar();
      setOrient(preferHorizontal() ? "h" : "v");
      collapseRegistry();
      // after visual fix injects preview
      setTimeout(function () {
        ensureOrientBar();
        setOrient(preferHorizontal() ? "h" : "v");
        collapseRegistry();
      }, 700);
      setTimeout(function () {
        setOrient(preferHorizontal() ? "h" : "v");
      }, 1500);
    } catch (e) {
      try {
        console.warn("[UFT layout]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 120);
  });
})(window);
