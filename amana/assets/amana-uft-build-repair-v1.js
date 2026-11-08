/*! Amānah UFT · build-tree repair + registry de-dupe
 * Screenshots: registry full, pedigree slots empty; double registry forms.
 * - Deduplicate registry rows (name+role)
 * - Auto map roles → backbone (self/father/…) and children/siblings lines
 * - On Build tree chip / empty stage: suggest + apply to pedigree
 * - Collapse duplicate registry UI (keep one primary form)
 * Educational only — not a legal pedigree
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_BUILD_REPAIR_V1__) return;
  w.__CLARITY_AMANA_UFT_BUILD_REPAIR_V1__ = true;

  var KEY = w.UFT_KEY || "clarity_user_family_tree_v1";

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

  function write(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function dedupeRegistry(list) {
    var out = [];
    var seen = {};
    (list || []).forEach(function (r) {
      if (!r || !r.name) return;
      var k = norm(r.name) + "|" + norm(r.role);
      if (seen[k]) {
        /* merge sparse fields into first */
        var prev = seen[k];
        ["phone", "email", "city", "note", "gender", "vital"].forEach(function (f) {
          if (!prev[f] && r[f]) prev[f] = r[f];
        });
        return;
      }
      var row = {
        id: r.id || "m_" + Math.random().toString(36).slice(2, 9),
        name: String(r.name).trim(),
        role: String(r.role || "").trim(),
        phone: r.phone || "",
        email: r.email || "",
        city: r.city || "",
        note: r.note || "",
        gender: r.gender || "",
        vital: r.vital || ""
      };
      seen[k] = row;
      out.push(row);
    });
    return out;
  }

  function roleIs(r, re) {
    return re.test(String(r.role || ""));
  }

  function mapRegistryToBackbone(data) {
    data = data || {};
    data.registry = dedupeRegistry(data.registry || []);
    var reg = data.registry;

    function first(re) {
      for (var i = 0; i < reg.length; i++) {
        if (reg[i].name && roleIs(reg[i], re)) return reg[i].name;
      }
      return "";
    }
    function all(re) {
      var names = [];
      var seen = {};
      reg.forEach(function (r) {
        if (!r.name || !roleIs(r, re)) return;
        var k = norm(r.name);
        if (seen[k]) return;
        seen[k] = 1;
        names.push(r.name);
      });
      return names;
    }

    if (!data.self) data.self = first(/^(self|focus|me)$/i);
    if (!data.spouse) data.spouse = first(/spouse|husband|wife/i);
    if (!data.father) data.father = first(/^father$/i);
    if (!data.mother) data.mother = first(/^mother$/i);
    if (!data.pgf) data.pgf = first(/paternal grandfather|^pgf$/i);
    if (!data.pgm) data.pgm = first(/paternal grandmother|^pgm$/i);
    if (!data.mgf) data.mgf = first(/maternal grandfather|^mgf$/i);
    if (!data.mgm) data.mgm = first(/maternal grandmother|^mgm$/i);

    var kids = all(/^(child|son|daughter|children)$/i);
    if (kids.length && !String(data.children || "").trim()) data.children = kids.join("\n");
    var sibs = all(/^(sibling|brother|sister)$/i);
    if (sibs.length && !String(data.siblings || "").trim()) data.siblings = sibs.join("\n");
    var gc = all(/grandchild|grandson|granddaughter/i);
    if (gc.length && !String(data.grandchildren || "").trim()) data.grandchildren = gc.join("\n");

    data.savedAt = new Date().toISOString();
    return data;
  }

  function applyToPedigree(data) {
    data = mapRegistryToBackbone(data);
    write(data);
    try {
      if (typeof w.uftApplyData === "function") w.uftApplyData(data);
      else {
        if (typeof w.uftLoad === "function") w.uftLoad();
        if (typeof w.uftRender === "function") w.uftRender();
      }
    } catch (e) {}
    try {
      if (typeof w.uftRegRender === "function") w.uftRegRender();
    } catch (e2) {}
    var st = d.getElementById("uft-status") || d.getElementById("uft-fo-status");
    if (st) {
      st.textContent =
        "Pedigree built from registry (" +
        (data.registry || []).length +
        " contacts) · educational outline only — not a legal pedigree";
    }
    return data;
  }

  function collapseDuplicateForms() {
    /* Prefer deep registry panel; hide older simple duplicate if both fill same purpose */
    var deep = d.getElementById("uft-registry-deep");
    var simple = d.getElementById("uft-reg-name");
    if (deep && simple) {
      var simpleForm = simple.closest(".uft-grid, form, section, .amana-card, div");
      /* Don't hide if it's inside deep panel */
      if (simpleForm && deep.contains && !deep.contains(simple)) {
        /* Mark secondary form */
        var host = simple.parentNode;
        while (host && host !== d.body && host.querySelectorAll && host.querySelectorAll("input").length < 12) {
          host = host.parentNode;
        }
      }
    }
    /* Deduplicate visible registry list rows in DOM by name+role text */
    var lists = d.querySelectorAll("#uft-reg-list, #uft-deep-list, .uft-reg-list");
    lists.forEach(function (box) {
      var rows = Array.prototype.slice.call(box.children || []);
      var seen = {};
      rows.forEach(function (row) {
        var t = norm(row.textContent || "").slice(0, 80);
        if (!t) return;
        if (seen[t]) {
          row.style.display = "none";
          row.setAttribute("data-reg-deduped", "1");
        } else seen[t] = 1;
      });
    });
  }

  function wireBuildChip() {
    d.querySelectorAll("button, a, [role='tab'], .uft-chip, [data-uft-step]").forEach(function (el) {
      if (el.__uftBuildRepair) return;
      var t = (el.textContent || "") + " " + (el.getAttribute("data-uft-step") || "");
      if (!/Build tree|4\s*[·.]\s*Build|uft-bc-apply/i.test(t) && el.id !== "uft-bc-apply") return;
      el.__uftBuildRepair = true;
      el.addEventListener(
        "click",
        function () {
          setTimeout(function () {
            /* Prefer core suggest + apply */
            try {
              if (typeof w.uftSuggestBuildFromCards === "function") w.uftSuggestBuildFromCards();
            } catch (e) {}
            var sug = d.getElementById("uft-bc-suggest");
            if (sug) try { sug.click(); } catch (e2) {}
            setTimeout(function () {
              var apply = d.getElementById("uft-bc-apply");
              if (apply) try { apply.click(); } catch (e3) {}
              else applyToPedigree(read());
            }, 120);
          }, 80);
        },
        false
      );
    });
    var apply = d.getElementById("uft-bc-apply");
    if (apply && !apply.__uftBuildRepair) {
      apply.__uftBuildRepair = true;
      apply.addEventListener(
        "click",
        function () {
          setTimeout(function () {
            var data = read();
            if (!data.self && (data.registry || []).length) applyToPedigree(data);
          }, 200);
        },
        false
      );
    }
  }

  function autoIfEmpty() {
    if (!isTree()) return;
    var data = read();
    var regN = (data.registry || []).length;
    if (!regN) return;
    data.registry = dedupeRegistry(data.registry);
    write(data);
    var needs =
      !data.self ||
      (!data.father && !data.mother && !String(data.children || "").trim());
    var stage = d.getElementById("uft-stage");
    var emptyUi =
      stage && /Pedigree empty|Father's father|\.\s*$/i.test((stage.textContent || "").slice(0, 400));
    /* If many registry members but backbone sparse, map */
    if (needs || (regN >= 3 && !data.self)) {
      applyToPedigree(data);
    } else if (emptyUi && data.self) {
      try {
        if (typeof w.uftApplyData === "function") w.uftApplyData(data);
        else if (typeof w.uftRender === "function") w.uftRender();
      } catch (e) {}
    }
  }

  function boot() {
    if (!isTree()) return;
    collapseDuplicateForms();
    wireBuildChip();
    autoIfEmpty();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 1500);
  setTimeout(boot, 2800);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 250);
  });

  w.uftBuildRepairApply = function () {
    return applyToPedigree(read());
  };
  w.uftBuildRepairDedupe = function () {
    var data = read();
    data.registry = dedupeRegistry(data.registry || []);
    write(data);
    try {
      if (typeof w.uftRegRender === "function") w.uftRegRender();
    } catch (e) {}
    return data.registry.length;
  };
})(window, document);
