/**
 * Day Landing Section Registry v2 · merged catalog (day-room + legacy landing-v3)
 * KEEP current enriched modules; soft-restore gaps from legacy strengths
 * Educational only — not a fatwa
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAY_SECTION_REGISTRY_V2__) return;
  g.__CLARITY_DAY_SECTION_REGISTRY_V2__ = true;
  g.__CLARITY_DAY_SECTION_REGISTRY_V1__ = true;

  var REGISTRY_KEY = "clarity_day_section_registry_v2";

  /**
   * source: "both" | "day-room" | "legacy" | "enrich"
   * policy: keep | prefer-current | restore-if-missing
   */
  var CATALOG = [
    { id: "slot-paths", title: "Dual paths (Companion / University)", source: "both", policy: "keep",
      test: function (r) { return !!r.querySelector(".dual-tiles, #day-path-companion, #dual-path-companion"); } },
    { id: "slot-todo", title: "Do this today", source: "both", policy: "keep",
      test: function (r) { return /Do this today/i.test(r.textContent || ""); } },
    { id: "slot-salah", title: "Next ṣalāh", source: "both", policy: "keep",
      test: function (r) { return /Next ṣalāh|Next salah/i.test(r.textContent || "") || !!r.querySelector("#cdl-salah-name,#cdl-salah-cd"); } },
    { id: "slot-adhkar", title: "Adhkār (morning/evening)", source: "both", policy: "keep",
      test: function (r) { return /Adhkār|Adhkar/i.test(r.textContent || ""); } },
    { id: "slot-wudu", title: "Wuḍūʾ steps", source: "both", policy: "keep",
      test: function (r) { return !!r.querySelector("#cdl-wudu-card,#cdl-wudu-body,#cdl-wudu-btn") || /Wuḍū|Wudu steps/i.test(r.textContent || ""); } },
    { id: "slot-salah-steps", title: "Prayer outline / ṣalāh steps", source: "both", policy: "restore-if-missing",
      test: function (r) { return /Prayer outline|ṣalāh steps|Salah steps/i.test(r.textContent || "") || !!r.querySelector("#cdl-salah-body,#cdl-salah-btn,#cdl-salah-steps"); } },
    { id: "slot-tasbeeh", title: "Tasbeeh today", source: "both", policy: "keep",
      test: function (r) { return /Tasbeeh|Tasbih/i.test(r.textContent || ""); } },
    { id: "slot-streak", title: "Soft streak", source: "both", policy: "keep",
      test: function (r) { return /Soft streak|streak/i.test(r.textContent || "") || !!r.querySelector("#cdl-streak"); } },
    { id: "slot-qada", title: "Qaḍāʾ tracker + calendar", source: "day-room", policy: "keep",
      test: function (r) { return /Qaḍā|Qada/i.test(r.textContent || "") || !!r.querySelector("input[data-qada],#cdl-qada-calendar"); } },
    { id: "slot-dayn", title: "Amānah Dayn (Qard ḥasan ledger)", source: "enrich", policy: "prefer-current",
      test: function (r) { return !!r.querySelector("#clarity-landing-slot-dayn,#dayn-save") || /Amānah Dayn|Qard ḥasan/i.test(r.textContent || ""); } },
    { id: "slot-vault-note", title: "Vault note registry", source: "both", policy: "keep",
      test: function (r) { return /Vault note registry/i.test(r.textContent || ""); } },
    { id: "slot-light", title: "Send light ahead", source: "both", policy: "keep",
      test: function (r) { return /Send light ahead/i.test(r.textContent || ""); } },
    { id: "slot-grave", title: "Remember the long stay", source: "both", policy: "keep",
      test: function (r) { return /Remember the long stay/i.test(r.textContent || ""); } },
    { id: "slot-reward", title: "Reward that may continue", source: "both", policy: "keep",
      test: function (r) { return /Reward that may continue/i.test(r.textContent || ""); } },
    { id: "slot-qibla", title: "Qibla direction", source: "both", policy: "keep",
      test: function (r) { return /Qibla/i.test(r.textContent || "") || !!r.querySelector(".cdl-compass,#cdl-qibla-card,#cdl-compass"); } },
    { id: "slot-protect", title: "Core protection set", source: "day-room", policy: "keep",
      test: function (r) { return /Core protection/i.test(r.textContent || ""); } },
    { id: "slot-review", title: "Auto review · this device", source: "legacy+enrich", policy: "restore-if-missing",
      test: function (r) { return !!r.querySelector("#cdl-trust-review-card,#cdl-trust-review-btn") || /Auto review/i.test(r.textContent || ""); } },
    { id: "slot-trust", title: "Built for trust", source: "both", policy: "keep",
      test: function (r) { return /Built for trust/i.test(r.textContent || ""); } },
    { id: "slot-sources", title: "Sources in the open (legacy plaque)", source: "legacy", policy: "restore-if-missing",
      test: function (r) { return /Sources in the open|Quran\.com · Sunnah/i.test(r.textContent || ""); } },
    { id: "slot-humility", title: "Scholarly humility (legacy)", source: "legacy", policy: "restore-if-missing",
      test: function (r) { return /Scholarly humility/i.test(r.textContent || ""); } },
    { id: "slot-fiqh-quiz", title: "Daily quiz · Fiqh (legacy)", source: "legacy", policy: "restore-if-missing",
      test: function (r) { return /Fiqh|Sharia IQ|cdl-fiqh/i.test(r.textContent || "") || !!r.querySelector("#cdl-fiqh-quiz-slot"); } },
    { id: "slot-zakat", title: "Zakat reminder (legacy id)", source: "legacy", policy: "restore-if-missing",
      test: function (r) { return !!r.querySelector("#cdl-zakat") || /Zak[aā]t/i.test(r.textContent || ""); } }
  ];

  function root() {
    return document.getElementById("clarity-day-landing-room");
  }

  function scan() {
    var r = root();
    if (!r) return { ok: false, reason: "no-room", missing: CATALOG.map(function (c) { return c.id; }), present: [], detail: [] };
    var inner = r.querySelector(".day-room-inner") || r;
    var missing = [], present = [], detail = [];
    CATALOG.forEach(function (c) {
      var ok = false;
      try { ok = !!c.test(inner); } catch (e) {}
      if (ok) present.push(c.id);
      else missing.push(c.id);
      detail.push({ id: c.id, title: c.title, source: c.source, policy: c.policy, present: ok });
    });
    return {
      ok: missing.filter(function (id) {
        var c = CATALOG.filter(function (x) { return x.id === id; })[0];
        return c && c.policy !== "restore-if-missing";
      }).length === 0,
      missing: missing,
      present: present,
      detail: detail,
      childCount: inner.children.length,
      fortified: r.getAttribute("data-day-fortified"),
      filled: r.getAttribute("data-room-filled")
    };
  }

  function softShell(title, body) {
    var el = document.createElement("div");
    el.className = "cdl-card cdl-resurrection-shell";
    el.setAttribute("data-resurrected", "1");
    el.innerHTML =
      '<div class="cdl-head"><h2>' + title + "</h2></div>" +
      '<p class="cdl-sub">' + body + "</p>" +
      '<p class="cdl-sub">Registry restore · educational only — not a fatwa.</p>';
    return el;
  }

  function resurrect(report) {
    var r = root();
    if (!r) return;
    var inner = r.querySelector(".day-room-inner");
    if (!inner) return;

    if (report.childCount < 3 || report.missing.indexOf("slot-todo") >= 0 && report.missing.indexOf("slot-paths") >= 0) {
      try {
        r.removeAttribute("data-day-fortified");
        r.removeAttribute("data-room-filled");
        r.removeAttribute("hidden");
        r.hidden = false;
        if (g.ClarityDayRoom && g.ClarityDayRoom.fill) g.ClarityDayRoom.fill();
      } catch (e) {}
      return;
    }

    var shells = {
      "slot-wudu": function () {
        return softShell("💧 Wuḍūʾ steps", "Intention · hands · mouth · nose · face · arms · head & ears · feet.");
      },
      "slot-salah-steps": function () {
        return softShell("🕌 Prayer outline", "Stand · takbīr · recitation · rukūʿ · sujūd · educational outline.");
      },
      "slot-review": function () {
        return softShell("🔎 Auto review · this device", "Re-check Day landing modules after a revamp.");
      },
      "slot-sources": function () {
        return softShell("📖 Sources in the open", "Quran.com · Sunnah.com · ṣaḥīḥ preferred · educational.");
      },
      "slot-humility": function () {
        return softShell("🌱 Scholarly humility", "Not a fatwa · ask a local teacher when unsure.");
      },
      "slot-fiqh-quiz": function () {
        return softShell("🧠 Daily quiz · Fiqh", "Optional IQ plaque · open when module is wired.");
      },
      "slot-protect": function () {
        return softShell("🛡️ Core protection set", "Educational reminders on this device.");
      },
      "slot-qibla": function () {
        return softShell("🧭 Qibla", "Verify direction locally · educational approximation.");
      }
    };

    report.missing.forEach(function (id) {
      var meta = CATALOG.filter(function (c) { return c.id === id; })[0];
      if (!meta || meta.policy === "prefer-current" && id === "slot-dayn") return;
      if (!shells[id]) return;
      if (inner.querySelector('[data-resurrect-id="' + id + '"]')) return;
      var node = shells[id]();
      if (!node) return;
      node.setAttribute("data-resurrect-id", id);
      inner.appendChild(node);
    });
  }

  function run() {
    var r = root();
    if (r) {
      try {
        r.removeAttribute("hidden");
        r.hidden = false;
      } catch (e) {}
    }
    var report = scan();
    try {
      localStorage.setItem(REGISTRY_KEY, JSON.stringify({ at: new Date().toISOString(), missing: report.missing, present: report.present }));
    } catch (e) {}
    g.__CLARITY_DAY_LAST_SCAN__ = report;
    if (report.missing.length) {
      console.info("[Day registry v2] missing:", report.missing.join(", "));
      resurrect(report);
    }
    try {
      document.dispatchEvent(new CustomEvent("clarity:day-registry-scan", { detail: report }));
    } catch (e) {}
  }

  g.ClarityDayRegistry = { scan: scan, run: run, catalog: CATALOG, version: 2 };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 500); });
  else setTimeout(run, 500);
  document.addEventListener("clarity:day-room-ready", function () { setTimeout(run, 250); });
  [1200, 3500, 7000].forEach(function (ms) { setTimeout(run, ms); });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) setTimeout(run, 400);
  });
})(typeof window !== "undefined" ? window : this);
