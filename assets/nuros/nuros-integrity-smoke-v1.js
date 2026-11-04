/*! nuros-integrity-smoke-v1 · Phase 7
 * Contract smoke for NurOS four-room app.
 * Call: ClarityIntegrity.smoke() or integrity("after upgrade")
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__NUROS_INTEGRITY_SMOKE_V1__) return;
  w.__NUROS_INTEGRITY_SMOKE_V1__ = true;

  var LOG = [];
  function log(m, detail) {
    var row = { t: Date.now(), m: String(m), detail: detail || null };
    LOG.push(row);
    try { console.info("[NurOS integrity]", m, detail || ""); } catch (e) {}
  }

  function path() {
    try { return (w.location && w.location.pathname) || "/"; } catch (e) { return "/"; }
  }

  function checkPort() {
    var issues = [];
    var tiles = d.querySelectorAll("[data-room-tile], a.room-tile, a.door-card");
    var hrefs = [];
    tiles.forEach(function (a) {
      hrefs.push(a.getAttribute("href") || "");
    });
    ["/companion/", "/daily/", "/campus/", "/amana/"].forEach(function (h) {
      var ok = hrefs.some(function (x) { return x.indexOf(h) === 0 || x === h.slice(0, -1); });
      if (!ok && path() === "/") issues.push("port_missing_" + h);
    });
    return issues;
  }

  function checkRoomAttr(expected) {
    var issues = [];
    var got = d.documentElement.getAttribute("data-clarity-room") || "";
    if (expected && got && got !== expected) issues.push("room_attr_" + got + "_expected_" + expected);
    return issues;
  }

  function checkNoBleed(forbiddenSubstr, label) {
    var issues = [];
    d.querySelectorAll("script[src]").forEach(function (s) {
      var src = s.getAttribute("src") || "";
      if (src.indexOf(forbiddenSubstr) >= 0) issues.push(label + "_script_" + src.split("?")[0]);
    });
    return issues;
  }

  function checkFatwaStance() {
    var t = (d.body && d.body.innerText) || "";
    if (!/not a fatwa/i.test(t)) return ["missing_educational_stance"];
    return [];
  }

  function checkDupIds() {
    var seen = {};
    var dups = [];
    d.querySelectorAll("[id]").forEach(function (el) {
      var id = el.id;
      if (!id) return;
      if (seen[id]) dups.push(id);
      seen[id] = true;
    });
    return dups.length ? ["dup_ids:" + dups.slice(0, 12).join(",")] : [];
  }

  function smoke(reason) {
    reason = reason || "manual";
    var p = path();
    var issues = [];
    issues = issues.concat(checkFatwaStance());
    issues = issues.concat(checkDupIds());

    if (p === "/" || p === "") {
      issues = issues.concat(checkPort());
      issues = issues.concat(checkRoomAttr("port"));
    } else if (p.indexOf("/companion") === 0) {
      issues = issues.concat(checkRoomAttr("companion"));
    } else if (p.indexOf("/daily") === 0) {
      issues = issues.concat(checkRoomAttr("yawm"));
      issues = issues.concat(checkNoBleed("/companion/assets/", "yawm"));
      issues = issues.concat(checkNoBleed("/campus/assets/", "yawm"));
    } else if (p.indexOf("/campus") === 0) {
      issues = issues.concat(checkRoomAttr("university"));
      /* campus must not be companion shell */
      if (d.querySelector("#tab-reminder") && d.querySelector(".rrra-hub-hero") && !d.querySelector(".cu-wrap")) {
        issues.push("campus_looks_like_companion_shell");
      }
    } else if (p.indexOf("/amana") === 0) {
      issues = issues.concat(checkRoomAttr("amana"));
      issues = issues.concat(checkNoBleed("/campus/assets/", "amana"));
      issues = issues.concat(checkNoBleed("/companion/assets/", "amana"));
    }

    var result = {
      reason: reason,
      path: p,
      ok: issues.length === 0,
      status: issues.length === 0 ? "PASS" : "FAIL",
      issues: issues,
      t: Date.now()
    };
    log(result.status, result);
    try { w.__NUROS_LAST_INTEGRITY__ = result; } catch (e) {}
    return result;
  }

  w.ClarityIntegrity = {
    smoke: smoke,
    log: function () { return LOG.slice(); },
    last: function () { return w.__NUROS_LAST_INTEGRITY__ || null; }
  };

  /** Contract alias */
  w.integrity = function (reason) {
    return smoke(reason || "after upgrade");
  };

  /* Auto-smoke after load on Port (lightweight) */
  function boot() {
    if (path() === "/" || path() === "") {
      setTimeout(function () { smoke("port_boot"); }, 400);
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
