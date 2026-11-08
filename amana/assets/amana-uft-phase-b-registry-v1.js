/*! Amānah UFT · Phase B · registry UX cohesion
 * Ensures link-relation is a usable <select>, host list refresh, status feedback.
 * Same keys only · educational · no Companion surface.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_PHASE_B_REG__) return;
  w.__CLARITY_AMANA_UFT_PHASE_B_REG__ = true;

  var RELS = [
    ["child", "Child"],
    ["spouse", "Spouse"],
    ["father", "Father"],
    ["mother", "Mother"],
    ["sibling", "Sibling"],
    ["grandchild", "Grandchild"],
    ["other", "Other / relative"]
  ];

  function ensureRelSelect() {
    var el = d.getElementById("uft-reg-link-rel");
    if (!el) return;
    if (el.tagName === "SELECT" && el.options && el.options.length > 1) return;
    if (el.tagName === "INPUT") {
      var sel = d.createElement("select");
      sel.id = "uft-reg-link-rel";
      sel.setAttribute("aria-label", "Link relation");
      RELS.forEach(function (r) {
        var o = d.createElement("option");
        o.value = r[0];
        o.textContent = r[1];
        sel.appendChild(o);
      });
      el.parentNode.replaceChild(sel, el);
      return;
    }
    if (el.tagName === "SELECT" && el.options.length <= 1) {
      el.innerHTML = "";
      RELS.forEach(function (r) {
        var o = d.createElement("option");
        o.value = r[0];
        o.textContent = r[1];
        el.appendChild(o);
      });
    }
  }

  function ensureHostIsSelect() {
    var el = d.getElementById("uft-reg-link-host");
    if (!el) return;
    if (el.tagName === "INPUT") {
      var sel = d.createElement("select");
      sel.id = "uft-reg-link-host";
      sel.setAttribute("aria-label", "Link host");
      var o0 = d.createElement("option");
      o0.value = "";
      o0.textContent = "No link (registry only)";
      sel.appendChild(o0);
      el.parentNode.replaceChild(sel, el);
    }
    try {
      if (typeof w.uftRegFillHostSelect === "function") w.uftRegFillHostSelect();
    } catch (e) {}
  }

  function wireAddButtons() {
    d.querySelectorAll && d.querySelectorAll("button").forEach(function (btn) {
      if (btn.__uftRegWired) return;
      var t = (btn.textContent || "") + (btn.getAttribute("onclick") || "");
      if (/uftRegAddNew|Add to registry/i.test(t)) {
        btn.__uftRegWired = true;
        btn.addEventListener(
          "click",
          function () {
            setTimeout(function () {
              try {
                if (typeof w.uftRegFillHostSelect === "function") w.uftRegFillHostSelect();
              } catch (e) {}
            }, 50);
          },
          false
        );
      }
    });
  }

  function boot() {
    if (!d.getElementById("user-family-tree-card") && !/\/amana\/tree/.test(location.pathname || "")) return;
    ensureRelSelect();
    ensureHostIsSelect();
    wireAddButtons();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
})(window, document);
