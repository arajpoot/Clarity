/**
 * Day Landing Section Registry · resurrection watchdog
 * Detects missing fortified-day cards after updates and restores soft shells.
 * Does NOT wipe healthy content. Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAY_SECTION_REGISTRY_V1__) return;
  g.__CLARITY_DAY_SECTION_REGISTRY_V1__ = true;

  var REGISTRY_KEY = "clarity_day_section_registry_v1";

  /** Canonical slots for fortified day landing (order = daily flow) */
  var CATALOG = [
    { id: "slot-paths", test: function (root) { return !!root.querySelector(".dual-tiles, #day-path-companion, #dual-path-companion"); }, title: "Dual paths" },
    { id: "slot-todo", test: function (root) { return /Do this today/i.test(root.textContent || ""); }, title: "Do this today" },
    { id: "slot-salah", test: function (root) { return /Next ṣalāh|Next salah|cdl-salah/i.test(root.textContent || "") || !!root.querySelector("#cdl-salah-name, #cdl-salah-cd"); }, title: "Next ṣalāh" },
    { id: "slot-adhkar", test: function (root) { return /Adhkār|Adhkar/i.test(root.textContent || ""); }, title: "Adhkār" },
    { id: "slot-wudu", test: function (root) { return !!root.querySelector("#cdl-wudu-card, #cdl-wudu-body, #cdl-wudu-btn") || /Wuḍū|Wudu/i.test(root.textContent || ""); }, title: "Wuḍūʾ" },
    { id: "slot-tasbeeh", test: function (root) { return /Tasbeeh|Tasbih|streak/i.test(root.textContent || ""); }, title: "Tasbeeh / streak" },
    { id: "slot-qada", test: function (root) { return /Qaḍā|Qada/i.test(root.textContent || "") || !!root.querySelector("input[data-qada], #cdl-qada-calendar"); }, title: "Qaḍāʾ tracker" },
    { id: "slot-dayn", test: function (root) { return !!root.querySelector("#clarity-landing-slot-dayn, #dayn-save") || /Amānah Dayn|Qard ḥasan/i.test(root.textContent || ""); }, title: "Amānah Dayn" },
    { id: "slot-vault-note", test: function (root) { return /Vault note registry/i.test(root.textContent || ""); }, title: "Vault note registry" },
    { id: "slot-light", test: function (root) { return /Send light ahead/i.test(root.textContent || ""); }, title: "Send light ahead" },
    { id: "slot-grave", test: function (root) { return /Remember the long stay/i.test(root.textContent || ""); }, title: "Remember the long stay" },
    { id: "slot-reward", test: function (root) { return /Reward that may continue/i.test(root.textContent || ""); }, title: "Reward that may continue" },
    { id: "slot-qibla", test: function (root) { return /Qibla/i.test(root.textContent || "") || !!root.querySelector(".cdl-compass, #cdl-compass"); }, title: "Qibla" },
    { id: "slot-protect", test: function (root) { return /Core protection/i.test(root.textContent || ""); }, title: "Core protection set" },
    { id: "slot-review", test: function (root) { return !!root.querySelector("#cdl-trust-review-card") || /Auto review/i.test(root.textContent || ""); }, title: "Auto review" },
    { id: "slot-trust", test: function (root) { return /Built for trust/i.test(root.textContent || ""); }, title: "Built for trust" },
    { id: "slot-prayer-outline", test: function (root) { return /Prayer outline/i.test(root.textContent || "") || !!root.querySelector("#cdl-salah-body, #cdl-salah-btn"); }, title: "Prayer outline" }
  ];

  function root() {
    return document.getElementById("clarity-day-landing-room");
  }

  function scan() {
    var r = root();
    if (!r) return { ok: false, reason: "no-room", missing: CATALOG.map(function (c) { return c.id; }), present: [] };
    var inner = r.querySelector(".day-room-inner") || r;
    var missing = [];
    var present = [];
    CATALOG.forEach(function (c) {
      if (c.test(inner)) present.push(c.id);
      else missing.push(c.id);
    });
    return {
      ok: missing.length === 0,
      missing: missing,
      present: present,
      childCount: (r.querySelector(".day-room-inner") || r).children.length,
      fortified: r.getAttribute("data-day-fortified"),
      filled: r.getAttribute("data-room-filled")
    };
  }

  function logRegistry(report) {
    try {
      localStorage.setItem(
        REGISTRY_KEY,
        JSON.stringify({
          at: new Date().toISOString(),
          missing: report.missing,
          present: report.present,
          childCount: report.childCount
        })
      );
    } catch (e) {}
    g.__CLARITY_DAY_LAST_SCAN__ = report;
  }

  function softShell(title, body) {
    var el = document.createElement("div");
    el.className = "cdl-card cdl-resurrection-shell";
    el.setAttribute("data-resurrected", "1");
    el.innerHTML =
      '<div class="cdl-head"><h2>' +
      title +
      "</h2></div>" +
      '<p class="cdl-sub">' +
      body +
      "</p>" +
      '<p class="cdl-sub">Restored shell · open Companion or refresh if tools stay empty · educational only.</p>';
    return el;
  }

  function resurrectMissing(report) {
    var r = root();
    if (!r) return;
    var inner = r.querySelector(".day-room-inner");
    if (!inner) return;

    /* Critical path: if almost everything gone, full fill */
    if (report.childCount < 3 || report.missing.length >= 10) {
      try {
        r.removeAttribute("data-day-fortified");
        r.removeAttribute("data-room-filled");
        r.removeAttribute("hidden");
        r.hidden = false;
        if (g.ClarityDayRoom && typeof g.ClarityDayRoom.fill === "function") {
          g.ClarityDayRoom.fill();
        }
      } catch (e) {
        console.warn("[day registry] fill", e);
      }
      return;
    }

    /* Soft shells only for a few missing — avoid spam */
    var shells = {
      "slot-wudu": function () {
        if (document.getElementById("cdl-wudu-card")) return null;
        return softShell(
          "💧 Wuḍūʾ steps",
          "Intention · hands · mouth · nose · face · arms · head & ears · feet. Confirm with a teacher."
        );
      },
      "slot-review": function () {
        if (document.getElementById("cdl-trust-review-card")) return null;
        return softShell("🔎 Auto review", "Trust check for Day landing modules on this device.");
      },
      "slot-qibla": function () {
        return softShell("🧭 Qibla", "Open Day landing qibla tool when available · verify locally.");
      },
      "slot-protect": function () {
        return softShell("🛡️ Core protection set", "Educational reminders · not a fatwa.");
      },
      "slot-prayer-outline": function () {
        return softShell("🕌 Prayer outline", "Stand · takbīr · recitation · rukūʿ · sujūd · educational outline.");
      }
    };

    report.missing.slice(0, 4).forEach(function (id) {
      if (!shells[id]) return;
      if (inner.querySelector('[data-resurrect-id="' + id + '"]')) return;
      var node = shells[id]();
      if (!node) return;
      node.setAttribute("data-resurrect-id", id);
      inner.appendChild(node);
    });
  }

  function unhideRoom() {
    var r = root();
    if (!r) return;
    try {
      r.removeAttribute("hidden");
      r.hidden = false;
      if (document.documentElement.getAttribute("data-shell-mode") !== "companion") {
        r.style.setProperty("display", "block", "important");
        r.style.setProperty("visibility", "visible", "important");
      }
    } catch (e) {}
  }

  function run() {
    unhideRoom();
    var report = scan();
    logRegistry(report);
    if (!report.ok) {
      console.info("[Day section registry] missing:", report.missing.join(", "));
      resurrectMissing(report);
      /* re-scan after soft restore / fill */
      setTimeout(function () {
        logRegistry(scan());
      }, 600);
    }
    /* dispatch for other tools */
    try {
      document.dispatchEvent(
        new CustomEvent("clarity:day-registry-scan", { detail: g.__CLARITY_DAY_LAST_SCAN__ })
      );
    } catch (e) {}
  }

  g.ClarityDayRegistry = {
    scan: scan,
    run: run,
    catalog: CATALOG
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 500); });
  else setTimeout(run, 500);
  document.addEventListener("clarity:day-room-ready", function () { setTimeout(run, 200); });
  document.addEventListener("clarity:landing-ready", function () { setTimeout(run, 200); });
  [1500, 4000, 8000].forEach(function (ms) { setTimeout(run, ms); });

  /* Visibility / focus: re-check when user returns */
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) setTimeout(run, 300);
  });
})(typeof window !== "undefined" ? window : this);
