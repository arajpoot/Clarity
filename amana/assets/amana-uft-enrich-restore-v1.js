/*! Amānah UFT · enrichment restore v1
 * Audit (live screenshot): JSON import reports N unique members + status refreshed,
 * but stage stays blank and registry dock collapsed — enrichment clause broken.
 * Cause: pedigree draw uses backbone + relatives[] graph; registry list alone is not enough.
 * Restore: after storage has registry people → map roles → backbone + relatives links → render + expand dock.
 * Educational only — not a legal pedigree · not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_ENRICH_RESTORE_V1__) return;
  w.__CLARITY_AMANA_UFT_ENRICH_RESTORE_V1__ = true;

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

  function roleOf(r) {
    return String((r && (r.role || r.relation || r.slot)) || "").toLowerCase().trim();
  }

  function dedupeReg(list) {
    var out = [];
    var seen = {};
    (list || []).forEach(function (r) {
      if (!r || !r.name) return;
      var k = norm(r.name) + "|" + roleOf(r);
      if (seen[k]) return;
      seen[k] = 1;
      out.push({
        id: r.id || "m_" + Math.random().toString(36).slice(2, 9),
        name: String(r.name).trim(),
        role: roleOf(r) || "",
        phone: r.phone || "",
        email: r.email || "",
        city: r.city || "",
        note: r.note || "",
        gender: r.gender || "",
        vital: r.vital || ""
      });
    });
    return out;
  }

  /** Promote any people[] / members[] / cards into registry */
  function absorbPeople(data) {
    data.registry = Array.isArray(data.registry) ? data.registry : [];
    var bags = []
      .concat(data.people || [])
      .concat(data.members || [])
      .concat(data.cards || [])
      .concat((data.payload && data.payload.registry) || []);
    bags.forEach(function (p) {
      if (!p) return;
      if (typeof p === "string") {
        data.registry.push({ name: p, role: "" });
        return;
      }
      if (p.name) data.registry.push(p);
    });
    data.registry = dedupeReg(data.registry);
    return data;
  }

  function firstRole(reg, re) {
    for (var i = 0; i < reg.length; i++) {
      if (reg[i].name && re.test(roleOf(reg[i]))) return reg[i].name;
    }
    return "";
  }

  function allRoles(reg, re) {
    var out = [];
    var seen = {};
    reg.forEach(function (r) {
      if (!r.name || !re.test(roleOf(r))) return;
      var k = norm(r.name);
      if (seen[k]) return;
      seen[k] = 1;
      out.push(r.name);
    });
    return out;
  }

  function enrichGraph(data) {
    data = absorbPeople(data || {});
    var reg = data.registry;

    if (!data.self) data.self = firstRole(reg, /^(self|focus|me)$/);
    if (!data.spouse) data.spouse = firstRole(reg, /^(spouse|husband|wife)$/);
    if (!data.father) data.father = firstRole(reg, /^father$/);
    if (!data.mother) data.mother = firstRole(reg, /^mother$/);
    if (!data.pgf) data.pgf = firstRole(reg, /paternal grandfather|^pgf$/);
    if (!data.pgm) data.pgm = firstRole(reg, /paternal grandmother|^pgm$/);
    if (!data.mgf) data.mgf = firstRole(reg, /maternal grandfather|^mgf$/);
    if (!data.mgm) data.mgm = firstRole(reg, /maternal grandmother|^mgm$/);

    var kids = allRoles(reg, /^(child|son|daughter|children)$/);
    if (kids.length) data.children = kids.join("\n");
    var sibs = allRoles(reg, /^(sibling|brother|sister)$/);
    if (sibs.length) data.siblings = sibs.join("\n");
    var gc = allRoles(reg, /grandchild/);
    if (gc.length) data.grandchildren = gc.join("\n");

    /* Build relatives[] so descendant pedigree has edges */
    data.relatives = Array.isArray(data.relatives) ? data.relatives : [];
    var relSeen = {};
    data.relatives.forEach(function (r) {
      if (r && r.name) relSeen[norm(r.name) + "|" + String(r.relation || "") + "|" + String(r.anchor || "")] = 1;
    });

    function addRel(name, relation, anchor) {
      if (!name) return;
      var k = norm(name) + "|" + relation + "|" + (anchor || "self");
      if (relSeen[k]) return;
      relSeen[k] = 1;
      data.relatives.push({
        name: name,
        relation: relation,
        anchor: anchor || "self"
      });
    }

    var focus = data.self || "";
    kids.forEach(function (n) {
      addRel(n, "child", "self");
    });
    sibs.forEach(function (n) {
      addRel(n, "sibling", "self");
    });
    gc.forEach(function (n) {
      addRel(n, "grandchild", "self");
    });
    allRoles(reg, /^uncle$/).forEach(function (n) {
      addRel(n, "uncle", "self");
    });
    allRoles(reg, /^aunt$/).forEach(function (n) {
      addRel(n, "aunt", "self");
    });
    allRoles(reg, /^nephew$/).forEach(function (n) {
      addRel(n, "nephew", "self");
    });
    allRoles(reg, /^niece$/).forEach(function (n) {
      addRel(n, "niece", "self");
    });
    if (data.spouse) addRel(data.spouse, "spouse", "self");

    /* If still no self but registry has names, pick first non-empty as temporary focus for draw */
    if (!data.self && reg.length) {
      var prefer = reg.find(function (r) {
        return /self|focus/i.test(roleOf(r));
      });
      if (prefer) data.self = prefer.name;
    }

    data.savedAt = new Date().toISOString();
    data._enrichRestored = true;
    return data;
  }

  function expandRegistryDock() {
    var box = d.getElementById("uft-registry-box") || d.getElementById("uft-registry-unified");
    if (box) {
      try {
        box.open = true;
        box.classList.remove("collapsed");
      } catch (e) {}
    }
    var namesDock = d.querySelector(".uft-editor, #uft-editor, details.uft-registry");
    if (namesDock && namesDock.tagName === "DETAILS") namesDock.open = true;
    /* Expand button strip */
    d.querySelectorAll("button").forEach(function (b) {
      if (/^Expand$/i.test((b.textContent || "").trim())) {
        try {
          b.click();
        } catch (e2) {}
      }
    });
  }

  function forceRender(data) {
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
    try {
      if (typeof w.uftWorkspaceRefreshIntegrity === "function") w.uftWorkspaceRefreshIntegrity();
    } catch (e3) {}
    expandRegistryDock();
    var st = d.getElementById("uft-status");
    if (st) {
      st.textContent =
        "Enrichment restored · " +
        (data.registry || []).length +
        " registry · focus " +
        (data.self || "(set Self role)") +
        " · educational outline only";
    }
  }

  function restoreNow() {
    if (!isTree()) return false;
    var data = enrichGraph(read());
    var n = (data.registry || []).length;
    if (!n && !data.self) return false;
    forceRender(data);
    return true;
  }

  /* Hook after upload / build */
  function installHooks() {
    var prevApply = w.uftBuildRepairApply;
    w.uftBuildRepairApply = function () {
      var data = enrichGraph(read());
      forceRender(data);
      if (typeof prevApply === "function" && prevApply !== w.uftBuildRepairApply) {
        try {
          prevApply();
        } catch (e) {}
      }
      return data;
    };

    /* Wrap uftApplyData if present later */
    var tries = 0;
    function wrapApply() {
      if (typeof w.uftApplyData === "function" && !w.uftApplyData.__enrichWrapped) {
        var orig = w.uftApplyData;
        w.uftApplyData = function (d) {
          d = enrichGraph(d || {});
          return orig.call(this, d);
        };
        w.uftApplyData.__enrichWrapped = true;
      } else if (tries++ < 20) {
        setTimeout(wrapApply, 200);
      }
    }
    wrapApply();
  }

  function boot() {
    if (!isTree()) return;
    installHooks();
    /* Delay so import status from upload-fix settles */
    setTimeout(function () {
      restoreNow();
    }, 400);
    setTimeout(function () {
      restoreNow();
    }, 1500);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 250);
  });

  w.uftEnrichRestore = restoreNow;
})(window, document);
