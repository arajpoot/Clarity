/*! Amānah UFT · viewport names fix v1
 * Symptoms: member names flash then hide; horizontal pedigree not visible; only empty frame.
 * Fixes:
 *  1) Force bands open (collapsed bands hide names)
 *  2) Force horizontal orientation class on #uft-preview
 *  3) After render, if no person cards, inject stable name grid from registry/backbone
 *  4) Stop thrash: single settle pass, no repeated full re-render loops
 * Educational only — not a legal pedigree
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_VIEWPORT_NAMES_FIX_V1__) return;
  w.__CLARITY_AMANA_UFT_VIEWPORT_NAMES_FIX_V1__ = true;

  var KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var settling = false;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("user-family-tree-card");
  }

  function read() {
    try {
      if (typeof w.uftRead === "function") return w.uftRead() || {};
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function openAllBands() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("clarity_uft_band_") === 0) localStorage.setItem(k, "on");
      }
    } catch (e) {}
    d.querySelectorAll(".uft-band.collapsed").forEach(function (el) {
      el.classList.remove("collapsed");
      var scroll = el.querySelector(".uft-band-scroll");
      if (scroll) scroll.style.display = "block";
    });
  }

  function forceHorizontal() {
    var preview = d.getElementById("uft-preview") || d.getElementById("uft-stage");
    if (!preview) return;
    preview.classList.add("uft-orient-h");
    preview.classList.remove("uft-orient-v");
    preview.classList.add("uft-tree");
    try {
      localStorage.setItem("clarity_uft_orient_v1", "h");
    } catch (e) {}
    d.querySelectorAll("[data-uft-orient]").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-uft-orient") === "h");
    });
  }

  function collectNames(data) {
    var names = [];
    var seen = {};
    function add(n, role) {
      n = String(n || "").trim();
      if (!n) return;
      var k = n.toLowerCase();
      if (seen[k]) return;
      seen[k] = 1;
      names.push({ name: n, role: role || "" });
    }
    ["self", "spouse", "father", "mother", "pgf", "pgm", "mgf", "mgm"].forEach(function (s) {
      add(data[s], s);
    });
    function lines(v, role) {
      String(v || "")
        .split(/[\n,;]+/)
        .forEach(function (x) {
          add(x, role);
        });
    }
    lines(data.children, "child");
    lines(data.siblings, "sibling");
    lines(data.grandchildren, "grandchild");
    (data.registry || []).forEach(function (r) {
      if (r) add(r.name, r.role || "");
    });
    (data.relatives || []).forEach(function (r) {
      if (r) add(r.name, r.relation || "");
    });
    return names;
  }

  function stageHasCards() {
    var root = d.getElementById("uft-zoom-layer") || d.getElementById("uft-preview") || d.getElementById("uft-stage");
    if (!root) return false;
    return !!root.querySelector(
      ".uft-person, .uft-card-sleek, .uft-card, [data-uft-name], [data-vital-name], .uft-cluster .uft-couple > *"
    );
  }

  function injectNameGrid(names) {
    var layer =
      d.getElementById("uft-zoom-layer") ||
      d.getElementById("uft-preview") ||
      d.getElementById("uft-stage");
    if (!layer || !names.length) return;
    var existing = d.getElementById("uft-stable-name-grid");
    if (existing) existing.remove();

    var wrap = d.createElement("div");
    wrap.id = "uft-stable-name-grid";
    wrap.setAttribute("data-educational", "1");
    wrap.style.cssText =
      "display:flex;flex-direction:column;gap:0.65rem;padding:0.5rem;min-width:min(100%,22rem);";

    var groups = {
      Parents: [],
      Focus: [],
      Children: [],
      Siblings: [],
      Other: []
    };
    names.forEach(function (p) {
      var r = String(p.role || "").toLowerCase();
      if (/father|mother|pgf|pgm|mgf|mgm|grandparent/.test(r)) groups.Parents.push(p);
      else if (/self|focus/.test(r)) groups.Focus.push(p);
      else if (/child|son|daughter/.test(r)) groups.Children.push(p);
      else if (/sibling|brother|sister/.test(r)) groups.Siblings.push(p);
      else groups.Other.push(p);
    });
    if (!groups.Focus.length && names[0]) groups.Focus.push(names[0]);

    function section(title, list) {
      if (!list.length) return;
      var sec = d.createElement("div");
      sec.style.cssText = "border:1px solid rgba(212,180,90,0.28);border-radius:12px;padding:0.4rem;background:rgba(0,0,0,0.18);";
      var h = d.createElement("div");
      h.textContent = title;
      h.style.cssText =
        "font-size:0.72rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;opacity:0.75;margin-bottom:0.35rem;color:#e8d5a3;";
      sec.appendChild(h);
      var row = d.createElement("div");
      row.style.cssText = "display:flex;flex-wrap:wrap;gap:0.35rem;";
      list.forEach(function (p) {
        var card = d.createElement("div");
        card.style.cssText =
          "min-width:6.2rem;padding:0.4rem 0.5rem;border-radius:10px;border:1px solid rgba(212,180,90,0.35);background:rgba(30,125,94,0.22);font-size:0.84rem;";
        card.innerHTML =
          "<strong style=\"display:block;color:#f0e6c8\">" +
          esc(p.name) +
          "</strong><span style=\"font-size:0.72rem;opacity:0.8\">" +
          esc(p.role || "member") +
          "</span>";
        row.appendChild(card);
      });
      sec.appendChild(row);
      wrap.appendChild(sec);
    }

    section("Parents", groups.Parents);
    section("Focus", groups.Focus);
    section("Children", groups.Children);
    section("Siblings", groups.Siblings);
    section("Other members (" + groups.Other.length + ")", groups.Other.slice(0, 40));
    if (groups.Other.length > 40) {
      var more = d.createElement("p");
      more.style.cssText = "font-size:0.75rem;opacity:0.8;margin:0";
      more.textContent = "+" + (groups.Other.length - 40) + " more in registry · educational outline only";
      wrap.appendChild(more);
    }

    /* Prefer replacing empty zoom content rather than stacking forever */
    var hasCoreCards = stageHasCards();
    if (!hasCoreCards) {
      /* Keep header line if present, append grid */
      layer.appendChild(wrap);
    } else if (!d.getElementById("uft-stable-name-grid")) {
      layer.appendChild(wrap);
    }

    var st = d.getElementById("uft-status");
    if (st) {
      st.textContent =
        "Pedigree names stable · " + names.length + " on outline · educational only — not a legal pedigree";
    }
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function settle() {
    if (!isTree() || settling) return;
    settling = true;
    try {
      openAllBands();
      forceHorizontal();
      var data = read();
      var names = collectNames(data);
      if (!names.length) {
        settling = false;
        return;
      }
      /* One optional core render if layer empty */
      var layer = d.getElementById("uft-zoom-layer") || d.getElementById("uft-preview") || d.getElementById("uft-stage");
      if (layer && !stageHasCards()) {
        try {
          if (typeof w.uftEnrichRestore === "function") w.uftEnrichRestore();
        } catch (e) {}
        try {
          if (typeof w.uftRender === "function") w.uftRender({ keepScroll: true });
        } catch (e2) {}
      }
      openAllBands();
      forceHorizontal();
      /* Always ensure visible name grid if cards still missing or sparse */
      setTimeout(function () {
        var n = collectNames(read());
        if (n.length && !stageHasCards()) injectNameGrid(n);
        else if (n.length && !d.getElementById("uft-stable-name-grid")) {
          /* Core cards exist — still ensure bands open */
          openAllBands();
        }
        settling = false;
      }, 200);
    } catch (e) {
      settling = false;
    }
  }

  function boot() {
    if (!isTree()) return;
    settle();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 700);
  setTimeout(boot, 2000);
  /* After unlock / import */
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 300);
  });

  /* Observe stage text changes (import status) once */
  try {
    var st = d.getElementById("uft-status");
    if (st && typeof MutationObserver !== "undefined") {
      var mo = new MutationObserver(function () {
        var t = st.textContent || "";
        if (/imported|refreshed|Enrichment|Pedigree from registry/i.test(t)) {
          setTimeout(settle, 150);
        }
      });
      mo.observe(st, { childList: true, characterData: true, subtree: true });
    }
  } catch (e) {}

  w.uftViewportNamesSettle = settle;
})(window, document);
