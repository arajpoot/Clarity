/**
 * Clarity Dhikr Rail v2 — tab-colored chip rises from pressed bottom pill
 * Restored from prior companion build. Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DHIKR_RAIL_V2__) return;
  w.__CLARITY_DHIKR_RAIL_V2__ = true;
  var VER = "20261024RESTORE";

  var MAP = {
    reminder: {
      ar: "سُبْحَانَ اللَّهِ", en: "Subḥānallāh", note: "Glory be to Allah",
      bg: "linear-gradient(145deg,#1a4d3a 0%,#0d4f3c 55%,#163e32 100%)",
      accent: "#6bc49a", border: "rgba(107,196,154,.45)"
    },
    reality: {
      ar: "الْحَمْدُ لِلَّهِ", en: "Alḥamdulillāh", note: "All praise is for Allah",
      bg: "linear-gradient(145deg,#1e3a5f 0%,#243b55 55%,#1a2f45 100%)",
      accent: "#7eb6e8", border: "rgba(126,182,232,.45)"
    },
    reflection: {
      ar: "لَا إِلَٰهَ إِلَّا اللَّهُ", en: "Lā ilāha illallāh", note: "There is no god but Allah",
      bg: "linear-gradient(145deg,#3d2a55 0%,#4a3560 55%,#2f2140 100%)",
      accent: "#c4a0e8", border: "rgba(196,160,232,.45)"
    },
    action: {
      ar: "اللَّهُ أَكْبَرُ", en: "Allāhu akbar", note: "Allah is the Greatest",
      bg: "linear-gradient(145deg,#5c3a12 0%,#6b4423 55%,#4a3010 100%)",
      accent: "#e8c47a", border: "rgba(232,196,122,.5)"
    },
    notes: {
      ar: "أَسْتَغْفِرُ اللَّهَ", en: "Astaghfirullāh", note: "I seek Allah's forgiveness",
      bg: "linear-gradient(145deg,#1a2e24 0%,#243830 55%,#152019 100%)",
      accent: "#c9a227", border: "rgba(201,162,39,.5)"
    }
  };
  MAP.vault = MAP.notes;
  MAP.amana = MAP.notes;

  var hideT = null, lastKey = "", lastAt = 0;

  function removeChip() {
    var el = document.getElementById("clarity-dhikr-rail-chip");
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = (el.dataset.baseTransform || "translateX(-50%)") + " translateY(12px) scale(.96)";
    setTimeout(function () { try { el.remove(); } catch (e) {} }, 300);
  }

  function show(key, fromEl) {
    var d = MAP[key];
    if (!d) return;
    var now = Date.now();
    if (key === lastKey && now - lastAt < 850) return;
    lastKey = key;
    lastAt = now;
    removeChip();
    if (hideT) clearTimeout(hideT);

    var el = document.createElement("div");
    el.id = "clarity-dhikr-rail-chip";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");

    var left = "50%";
    var baseT = "translateX(-50%)";
    try {
      if (fromEl && fromEl.getBoundingClientRect) {
        var r = fromEl.getBoundingClientRect();
        if (r.width > 0) left = Math.round(r.left + r.width / 2) + "px";
      }
    } catch (e) {}

    el.dataset.baseTransform = baseT;
    el.style.cssText =
      "position:fixed;bottom:4.5rem;left:" + left + ";z-index:9997;" +
      "max-width:min(92vw,280px);min-width:11rem;" +
      "background:" + d.bg + ";color:#e7efe9;" +
      "padding:.65rem .9rem;border-radius:14px;" +
      "font:600 13px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;" +
      "box-shadow:0 8px 28px rgba(0,0,0,.28),0 0 0 1px " + d.border + ";" +
      "opacity:0;transform:" + baseT + " translateY(14px) scale(.94);" +
      "transition:opacity .35s ease,transform .35s ease;text-align:center;pointer-events:auto;" +
      "border:1px solid " + d.border + ";";

    el.innerHTML =
      '<div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%) rotate(45deg);width:12px;height:12px;background:inherit;border-right:1px solid ' + d.border + ';border-bottom:1px solid ' + d.border + ';border-radius:2px"></div>' +
      '<div style="opacity:.8;font-size:11px;margin-bottom:.2rem;color:' + d.accent + '">Dhikr · remember</div>' +
      '<div style="font-family:Scheherazade New,Amiri,serif;font-size:1.2rem;direction:rtl;line-height:1.45">' + d.ar + "</div>" +
      '<div style="margin-top:.25rem;font-weight:500;opacity:.95">' + d.en + "</div>" +
      '<div style="opacity:.72;font-size:11px;margin-top:.15rem">' + d.note + "</div>";

    el.addEventListener("click", removeChip);
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = "1";
      el.style.transform = baseT + " translateY(0) scale(1)";
    });
    hideT = setTimeout(removeChip, 4500);
  }

  function keyFromTarget(t) {
    if (!t || !t.closest) return null;
    var btn = t.closest("[data-rail-tab], [data-rrra], .door-rail-btn, #clarity-door-rail button, .nav-tabs button, [data-tab]");
    if (!btn) return null;
    var key = btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || btn.getAttribute("data-tab") || "";
    key = String(key).toLowerCase();
    if (!key) {
      var label = (btn.textContent || "").toLowerCase();
      if (label.indexOf("remind") >= 0) key = "reminder";
      else if (label.indexOf("realit") >= 0) key = "reality";
      else if (label.indexOf("reflect") >= 0) key = "reflection";
      else if (label.indexOf("action") >= 0) key = "action";
      else if (label.indexOf("vault") >= 0 || label.indexOf("amana") >= 0 || label.indexOf("note") >= 0) key = "notes";
    }
    if (key === "amana" || key === "vault") key = "notes";
    return key ? { key: key, el: btn } : null;
  }

  function bind() {
    function onClick(ev) {
      var info = keyFromTarget(ev.target);
      if (info && info.key) show(info.key, info.el);
    }
    var rail = document.getElementById("clarity-door-rail");
    if (rail) rail.addEventListener("click", onClick, true);
    document.addEventListener("click", function (ev) {
      if (ev.target && ev.target.closest && (ev.target.closest("#clarity-door-rail") || ev.target.closest(".nav-tabs") || ev.target.closest("[data-rail-tab]"))) {
        onClick(ev);
      }
    }, true);

    function wrapSwitch() {
      if (typeof w.switchTab === "function" && !w.switchTab.__dhikrWrapped) {
        var orig = w.switchTab;
        var wrapped = function (tab) {
          try {
            var btn = document.querySelector('[data-rail-tab="' + tab + '"]') ||
              document.querySelector('[data-rrra="' + tab + '"]') ||
              document.querySelector('[data-tab="' + tab + '"]');
            if (tab) show(String(tab), btn);
          } catch (e) {}
          return orig.apply(this, arguments);
        };
        wrapped.__dhikrWrapped = true;
        w.switchTab = wrapped;
      }
      if (typeof w.clarityOpenSectionDoor === "function" && !w.clarityOpenSectionDoor.__dhikrWrapped) {
        var fn = w.clarityOpenSectionDoor;
        var wrapped2 = function (tab) {
          try {
            var btn = document.querySelector('[data-rail-tab="' + tab + '"]');
            if (tab) show(String(tab), btn);
          } catch (e) {}
          return fn.apply(this, arguments);
        };
        wrapped2.__dhikrWrapped = true;
        w.clarityOpenSectionDoor = wrapped2;
      }
    }
    wrapSwitch();
    setTimeout(wrapSwitch, 500);
    setTimeout(wrapSwitch, 2000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityDhikrRail = { version: VER, show: show, map: MAP };
})(typeof window !== "undefined" ? window : this);
