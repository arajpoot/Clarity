/*! Amānah UFT · UI order v1
 * 1) Build-tree section above member registry
 * 2) Registry / loaded long lists actually collapse
 * Educational only — not a legal pedigree
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_UI_ORDER_V1__) return;
  w.__CLARITY_AMANA_UFT_UI_ORDER_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("user-family-tree-card");
  }

  function findBuildSection() {
    var byId =
      d.getElementById("uft-build-section") ||
      d.getElementById("uft-build-from-list") ||
      d.getElementById("uft-build-panel");
    if (byId) return byId;
    var nodes = d.querySelectorAll("details, section, div.amana-card, div.uft-panel, div");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var t = (el.textContent || "").slice(0, 180);
      if (/Build tree from registry/i.test(t) && /Apply selections|Auto-suggest from roles/i.test(el.textContent || "")) {
        /* Prefer outermost reasonable block */
        if (el.querySelector && el.querySelector("select, button")) return el;
      }
    }
    return null;
  }

  function findRegistryBlock() {
    return (
      d.getElementById("uft-registry-deep") ||
      d.querySelector(".uft-registry-deep") ||
      d.getElementById("uft-registry-box")
    );
  }

  function findLoadedBlock() {
    return (
      d.getElementById("uft-reg-loaded-section") ||
      d.querySelector("[data-uft-loaded], #uft-loaded-hygiene, .uft-loaded-hygiene")
    );
  }

  function moveBuildAboveRegistry() {
    var build = findBuildSection();
    var reg = findRegistryBlock();
    if (!build || !reg || !reg.parentNode) return false;
    if (build.contains(reg) || reg.contains(build)) return false;
    /* Insert build before registry */
    try {
      reg.parentNode.insertBefore(build, reg);
      build.setAttribute("data-uft-order", "build-first");
      return true;
    } catch (e) {
      return false;
    }
  }

  function collapseLongList(listEl, maxH) {
    if (!listEl) return;
    listEl.style.maxHeight = maxH || "0";
    listEl.style.overflow = "hidden";
    listEl.style.transition = "max-height 0.25s ease";
  }

  function expandLongList(listEl, maxH) {
    if (!listEl) return;
    listEl.style.maxHeight = maxH || "22rem";
    listEl.style.overflow = "auto";
  }

  function wireRegistryCollapse() {
    var deep = d.getElementById("uft-registry-deep");
    if (!deep) return;

    var list =
      deep.querySelector(".uft-deep-list-wrap, #uft-deep-list, .uft-reg-list, #uft-reg-list") ||
      deep.querySelector("[class*='list']");

    var form = deep.querySelector(".uft-deep-grid, .uft-deep-form");
    var actions = deep.querySelector(".uft-deep-actions");

    /* Ensure toggle button */
    var btn = d.getElementById("uft-reg-toggle-btn");
    if (!btn) {
      var head = deep.querySelector(".uft-deep-title, h3, h2");
      btn = d.createElement("button");
      btn.type = "button";
      btn.id = "uft-reg-toggle-btn";
      btn.textContent = "Collapse registry";
      btn.style.cssText =
        "padding:0.28rem 0.65rem;border-radius:999px;border:1px solid rgba(212,180,90,.4);background:rgba(0,0,0,.28);color:inherit;font-size:0.75rem;font-weight:700;cursor:pointer;float:right";
      if (head && head.parentNode) head.parentNode.insertBefore(btn, head.nextSibling);
      else deep.insertBefore(btn, deep.firstChild);
    }

    function setCollapsed(collapsed) {
      deep.classList.toggle("uft-reg-collapsed", collapsed);
      try {
        localStorage.setItem("clarity_uft_reg_collapsed_v1", collapsed ? "1" : "0");
      } catch (e) {}
      btn.textContent = collapsed ? "Expand registry" : "Collapse registry";
      if (list) {
        if (collapsed) collapseLongList(list, "0");
        else expandLongList(list, "18rem");
      }
      if (form) form.style.display = collapsed ? "none" : "";
      if (actions) actions.style.display = collapsed ? "none" : "";
      /* Hide all direct list rows when collapsed */
      deep.querySelectorAll(".uft-reg-row, .uft-deep-row, .uft-reg-loaded-row").forEach(function (row) {
        row.style.display = collapsed ? "none" : "";
      });
    }

    var collapsed = true;
    try {
      if (localStorage.getItem("clarity_uft_reg_collapsed_v1") === "0") collapsed = false;
    } catch (e) {}
    setCollapsed(collapsed);

    btn.onclick = function () {
      setCollapsed(!deep.classList.contains("uft-reg-collapsed"));
    };
  }

  function wireLoadedCollapse() {
    var section = findLoadedBlock();
    /* Also target hygiene card by text */
    if (!section) {
      d.querySelectorAll("section, details, div").forEach(function (el) {
        if (section) return;
        var t = (el.textContent || "").slice(0, 120);
        if (/Loaded cards\s*·\s*hygiene/i.test(t)) section = el;
      });
    }
    if (!section) return;

    var list =
      section.querySelector("#uft-reg-loaded-list, .uft-loaded-list, [data-loaded-list]") ||
      d.getElementById("uft-reg-loaded-list");

    /* Default: collapse long loaded member dumps inside hygiene if any */
    if (list && (list.children || []).length > 8) {
      var open = false;
      try {
        open = localStorage.getItem("clarity_uft_loaded_open_v1") === "1";
      } catch (e) {}
      if (!open) {
        collapseLongList(list, "0");
      }
    }
  }

  function settle() {
    if (!isTree()) return;
    moveBuildAboveRegistry();
    wireRegistryCollapse();
    wireLoadedCollapse();
  }

  function boot() {
    if (!isTree()) return;
    settle();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 1500);
  setTimeout(boot, 2800);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 400);
  });
})(window, document);
