/*! Amānah UFT · registry-unity + build repair v2
 * Root cause: Build tree calls uftApplyBuildFromCards which ALERTs when
 * clarity_uft_member_cards_v1 is empty — even if registry has 70+ people.
 * Fix: registry is source of truth → sync to cards → map backbone → pedigree.
 * Single effective registry path; suppress cards-only gate.
 * Educational only — not a legal pedigree.
 */
(function (w, d) {
  "use strict";
  /* allow reload of newer repair */
  w.__CLARITY_AMANA_UFT_BUILD_REPAIR_V1__ = true;

  var KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var CARDS_KEY = "clarity_uft_member_cards_v1";

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

  function registryToCards(reg) {
    return (reg || []).map(function (r) {
      return {
        name: r.name,
        role: r.role || "",
        slot: r.role || "",
        generationHint: r.role || "",
        phone: r.phone || "",
        email: r.email || "",
        city: r.city || "",
        note: r.note || "",
        gender: r.gender || "",
        vital: r.vital || ""
      };
    });
  }

  function syncRegistryToCards() {
    var data = read();
    data.registry = dedupeRegistry(data.registry || []);
    write(data);
    var cards = registryToCards(data.registry);
    try {
      localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    } catch (e) {}
    try {
      if (typeof w.uftSetStoredCards === "function") w.uftSetStoredCards(cards);
    } catch (e2) {}
    try {
      if (typeof w.uftRegRenderLoaded === "function") w.uftRegRenderLoaded();
    } catch (e3) {}
    return cards;
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

    /* Prefer explicit roles; do not invent self from random sibling */
    if (!data.self) data.self = first(/^(self|focus|me)$/i);
    if (!data.spouse) data.spouse = first(/^(spouse|husband|wife)$/i);
    if (!data.father) data.father = first(/^father$/i);
    if (!data.mother) data.mother = first(/^mother$/i);
    if (!data.pgf) data.pgf = first(/paternal grandfather|^pgf$/i);
    if (!data.pgm) data.pgm = first(/paternal grandmother|^pgm$/i);
    if (!data.mgf) data.mgf = first(/maternal grandfather|^mgf$/i);
    if (!data.mgm) data.mgm = first(/maternal grandmother|^mgm$/i);

    var kids = all(/^(child|son|daughter|children)$/i);
    if (kids.length) data.children = kids.join("\n");
    var sibs = all(/^(sibling|brother|sister)$/i);
    if (sibs.length) data.siblings = sibs.join("\n");
    var gc = all(/grandchild|grandson|granddaughter/i);
    if (gc.length) data.grandchildren = gc.join("\n");

    /* If still no self but registry has people, leave self empty — user must mark Self once */
    data.savedAt = new Date().toISOString();
    return data;
  }

  function applyToPedigree(data) {
    data = mapRegistryToBackbone(data || read());
    write(data);
    syncRegistryToCards();
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
      var n = (data.registry || []).length;
      st.textContent =
        "Pedigree from registry (" +
        n +
        " contacts)" +
        (data.self ? " · focus: " + data.self : " · set one person role to Self") +
        " · educational outline only";
    }
    return data;
  }

  /** Override core gates that require member cards */
  function installOverrides() {
    w.uftApplyBuildFromCards = function () {
      var data = read();
      var regN = (data.registry || []).length;
      var cards = [];
      try {
        cards = JSON.parse(localStorage.getItem(CARDS_KEY) || "[]");
      } catch (e) {}
      if ((!cards || !cards.length) && regN) {
        syncRegistryToCards();
      }
      /* Always prefer registry map when registry present */
      if (regN) {
        applyToPedigree(data);
        return;
      }
      if (!cards || !cards.length) {
        var st = d.getElementById("uft-status");
        if (st) st.textContent = "Add people in Registry first, then Build tree.";
        return;
      }
      /* cards only — lightweight apply from card roles */
      data.registry = data.registry || [];
      cards.forEach(function (c) {
        if (!c || !c.name) return;
        data.registry.push({
          name: c.name,
          role: c.role || c.slot || "",
          phone: c.phone || "",
          gender: c.gender || "",
          vital: c.vital || ""
        });
      });
      applyToPedigree(data);
    };

    w.uftSuggestBuildFromCards = function () {
      var data = read();
      if ((data.registry || []).length) {
        syncRegistryToCards();
        applyToPedigree(data);
        return;
      }
      var st = d.getElementById("uft-status");
      if (st) st.textContent = "Add people in Registry (with roles) first.";
    };

    /* Sync button */
    var syncBtn = d.getElementById("uft-sync-reg-cards");
    d.querySelectorAll("button").forEach(function (btn) {
      if (btn.__uftSyncReg) return;
      if (/Sync registry/i.test(btn.textContent || "")) {
        btn.__uftSyncReg = true;
        btn.addEventListener("click", function () {
          var n = syncRegistryToCards().length;
          applyToPedigree(read());
          var st = d.getElementById("uft-status");
          if (st) st.textContent = "Synced registry → cards (" + n + ") and refreshed pedigree · educational only";
        });
      }
    });
  }

  function wireBuildChip() {
    d.querySelectorAll("button, a, [role='tab']").forEach(function (el) {
      if (el.__uftBuildUnity) return;
      var t = el.textContent || "";
      if (!/Build tree|4\s*[·.]\s*Build/i.test(t) && el.id !== "uft-bc-apply") return;
      el.__uftBuildUnity = true;
      el.addEventListener(
        "click",
        function () {
          setTimeout(function () {
            try {
              w.uftApplyBuildFromCards();
            } catch (e) {
              applyToPedigree(read());
            }
          }, 50);
        },
        true
      );
    });
  }

  function collapseDuplicateRegistryChrome() {
    /* Hide secondary "Registry · add person" if deep panel exists and simple is duplicate */
    var deep = d.getElementById("uft-registry-deep");
    if (!deep) return;
    var labels = d.querySelectorAll("h3,h2,.uft-reg-section-title");
    var seen = 0;
    labels.forEach(function (h) {
      if (!/Registry\s*·\s*add person|Registry list/i.test(h.textContent || "")) return;
      seen++;
      if (seen > 2 && h.closest) {
        var block = h.closest(".uft-grid, section, .amana-card, details");
        if (block && !deep.contains(block)) {
          block.setAttribute("data-reg-secondary", "1");
          /* do not hard-hide — opacity to reduce double chrome */
          block.style.opacity = "0.92";
        }
      }
    });
  }

  function autoBoot() {
    if (!isTree()) return;
    installOverrides();
    wireBuildChip();
    collapseDuplicateRegistryChrome();
    var data = read();
    var regN = (data.registry || []).length;
    if (regN >= 1) {
      data.registry = dedupeRegistry(data.registry);
      write(data);
      /* Auto-build if backbone empty */
      if (!data.self || !String(data.children || data.siblings || "").trim()) {
        applyToPedigree(data);
      } else {
        syncRegistryToCards();
        try {
          if (typeof w.uftRender === "function") w.uftRender();
        } catch (e) {}
      }
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", autoBoot);
  else autoBoot();
  setTimeout(autoBoot, 500);
  setTimeout(autoBoot, 1400);
  setTimeout(autoBoot, 3000);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(autoBoot, 200);
  });

  w.uftBuildRepairApply = function () {
    return applyToPedigree(read());
  };
  w.uftSyncRegistryToCards = syncRegistryToCards;
})(window, document);
