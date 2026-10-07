/**
 * Clarity Dhikr Rail v1 — floating dhikr on bottom door-rail tab switch
 * Reminder→Subḥānallāh · Reality→Alḥamdulillāh · Reflection→Lā ilāha illallāh
 * Action→Allāhu akbar · Amana Vault→Astaghfirullāh
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DHIKR_RAIL_V1__) return;
  w.__CLARITY_DHIKR_RAIL_V1__ = true;
  var VER = "20261006DK";

  var MAP = {
    reminder: { ar: "سُبْحَانَ اللَّهِ", en: "Subḥānallāh", note: "Glory be to Allah" },
    reality: { ar: "الْحَمْدُ لِلَّهِ", en: "Alḥamdulillāh", note: "All praise is for Allah" },
    reflection: { ar: "لَا إِلَٰهَ إِلَّا اللَّهُ", en: "Lā ilāha illallāh", note: "There is no god but Allah" },
    action: { ar: "اللَّهُ أَكْبَرُ", en: "Allāhu akbar", note: "Allah is the Greatest" },
    notes: { ar: "أَسْتَغْفِرُ اللَّهَ", en: "Astaghfirullāh", note: "I seek Allah's forgiveness" },
    // aliases
    vault: { ar: "أَسْتَغْفِرُ اللَّهَ", en: "Astaghfirullāh", note: "I seek Allah's forgiveness" },
    amana: { ar: "أَسْتَغْفِرُ اللَّهَ", en: "Astaghfirullāh", note: "I seek Allah's forgiveness" }
  };

  var hideT = null;
  var lastKey = "";
  var lastAt = 0;

  function removeChip() {
    var el = document.getElementById("clarity-dhikr-rail-chip");
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    setTimeout(function () { try { el.remove(); } catch (e) {} }, 280);
  }

  function show(key) {
    var d = MAP[key];
    if (!d) return;
    var now = Date.now();
    // debounce same tab spam
    if (key === lastKey && now - lastAt < 900) return;
    lastKey = key;
    lastAt = now;

    removeChip();
    if (hideT) clearTimeout(hideT);

    var el = document.createElement("div");
    el.id = "clarity-dhikr-rail-chip";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.style.cssText = "position:fixed;bottom:4.6rem;left:50%;transform:translateX(-50%) translateY(10px);z-index:9996;max-width:min(92vw,300px);background:rgba(26,46,36,.95);color:#e7efe9;padding:.7rem 1rem;border-radius:16px;font:600 13px/1.35 system-ui,sans-serif;box-shadow:0 10px 32px rgba(0,0,0,.3);backdrop-filter:blur(10px);opacity:0;transition:opacity .3s,transform .3s;text-align:center;pointer-events:auto;border:1px solid rgba(201,162,39,.35)";
    el.innerHTML =
      '<div style="font-family:Scheherazade New,serif;font-size:1.35rem;direction:rtl;line-height:1.4;margin-bottom:.2rem">' + d.ar + "</div>" +
      '<div style="font-weight:700;letter-spacing:.02em">' + d.en + "</div>" +
      '<div style="opacity:.75;font-size:11px;margin-top:.2rem">' + d.note + "</div>";
    el.addEventListener("click", removeChip);
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = "1";
      el.style.transform = "translateX(-50%) translateY(0)";
    });
    hideT = setTimeout(removeChip, 4200);
  }

  function keyFromTarget(t) {
    if (!t || !t.closest) return null;
    var btn = t.closest("[data-rail-tab], [data-rrra], .door-rail-btn");
    if (!btn) return null;
    return btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || null;
  }

  function bind() {
    var rail = document.getElementById("clarity-door-rail");
    if (rail) {
      rail.addEventListener("click", function (ev) {
        var k = keyFromTarget(ev.target);
        if (k) show(k);
      }, true);
    }
    // Also wrap clarityOpenSectionDoor when available
    function wrap() {
      var fn = w.clarityOpenSectionDoor;
      if (typeof fn === "function" && !fn.__dhikrWrapped) {
        var wrapped = function (tab) {
          try { if (tab) show(String(tab)); } catch (e) {}
          return fn.apply(this, arguments);
        };
        wrapped.__dhikrWrapped = true;
        w.clarityOpenSectionDoor = wrapped;
      }
    }
    wrap();
    setTimeout(wrap, 800);
    setTimeout(wrap, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityDhikrRail = { version: VER, show: show, map: MAP };
})(typeof window !== "undefined" ? window : this);
