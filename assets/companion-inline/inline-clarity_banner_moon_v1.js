/**
 * Banner symmetry + moon phase + seal swap
 * Calendar: moon phase (realistic CSS) + optional masjid accent
 * Salah: Allah plaque
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_BANNER_MOON_V1__) return;
  w.__CLARITY_BANNER_MOON_V1__ = true;

  var CSS = [
    "#clarity-top-duo .banner-overlay{display:flex!important;align-items:stretch!important;justify-content:space-between!important;",
    "  gap:0.4rem!important;width:100%!important;box-sizing:border-box!important;padding:0.35rem 0.4rem!important;}",
    "#clarity-top-duo .banner-side{flex:0 0 clamp(6.5rem,22vw,10.5rem)!important;width:clamp(6.5rem,22vw,10.5rem)!important;",
    "  max-width:24%!important;min-width:6.2rem!important;}",
    "#clarity-top-duo .banner-center{flex:1 1 auto!important;min-width:0!important;}",
    "#clarity-top-duo .hijri-cal-section,#clarity-top-duo .salah-times-section{",
    "  width:100%!important;height:100%!important;min-height:10rem!important;box-sizing:border-box!important;",
    "  border-radius:18px!important;background:rgba(0,0,0,0.34)!important;",
    "  box-shadow:inset 0 0 0 1px rgba(255,255,255,0.12)!important;padding:0.4rem 0.45rem!important;}",
    /* Moon */
    "#clarity-moon-phase{display:flex;flex-direction:column;align-items:center;gap:0.25rem;margin:0.15rem 0 0.35rem;}",
    "#clarity-moon-disc{width:2.6rem;height:2.6rem;border-radius:50%;position:relative;overflow:hidden;",
    "  background:#1a1a22;box-shadow:inset -4px -2px 8px rgba(0,0,0,0.55),0 0 12px rgba(255,240,200,0.15);}",
    "#clarity-moon-disc .moon-lit{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f5f0d8,#c8b88a 55%,#8a7a55);}",
    "#clarity-moon-disc .moon-shade{position:absolute;top:0;bottom:0;border-radius:50%;background:#0c0c12;",
    "  box-shadow:inset 2px 0 4px rgba(0,0,0,0.35);}",
    "#clarity-moon-label{font-size:0.62rem;opacity:0.9;text-align:center;line-height:1.2;}",
    "#clarity-top-duo .cal-masjid-accent{font-size:0.95rem;opacity:0.85;text-align:center;margin-top:0.15rem;}",
    "#clarity-top-duo .allah-circular-seal .seal-ar{font-size:1.05rem;}",
    "@media(max-width:720px){#clarity-moon-disc{width:2.1rem;height:2.1rem;}#clarity-top-duo .hijri-cal-section,#clarity-top-duo .salah-times-section{min-height:8.5rem!important;}}"
  ].join("\n");

  function injectCss() {
    if (document.getElementById("clarity-banner-moon-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-banner-moon-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /** Approximate illumination 0–1 and phase name from date */
  function moonPhase(date) {
    var d = date || new Date();
    // Known new moon reference approx: 2000-01-06 18:14 UTC
    var ref = Date.UTC(2000, 0, 6, 18, 14, 0);
    var synodic = 29.53058867;
    var days = (d.getTime() - ref) / 86400000;
    var age = ((days % synodic) + synodic) % synodic;
    var frac = age / synodic;
    var names = [
      [0.03, "New moon"],
      [0.22, "Waxing crescent"],
      [0.28, "First quarter"],
      [0.47, "Waxing gibbous"],
      [0.53, "Full moon"],
      [0.72, "Waning gibbous"],
      [0.78, "Last quarter"],
      [0.97, "Waning crescent"],
      [1.01, "New moon"]
    ];
    var label = "Moon";
    for (var i = 0; i < names.length; i++) {
      if (frac <= names[i][0]) { label = names[i][1]; break; }
    }
    return { age: age, frac: frac, label: label };
  }

  function paintMoon(disc, phase) {
    disc.innerHTML = "";
    var lit = document.createElement("div");
    lit.className = "moon-lit";
    disc.appendChild(lit);
    var shade = document.createElement("div");
    shade.className = "moon-shade";
    var f = phase.frac;
    // Simple hemisphere shadow via width/position
    if (f < 0.03 || f > 0.97) {
      shade.style.left = "0"; shade.style.right = "0"; shade.style.width = "100%";
    } else if (f < 0.5) {
      // waxing: shadow on left, shrinking
      var w = (0.5 - f) * 2 * 100;
      shade.style.left = "0"; shade.style.width = w + "%"; shade.style.right = "auto";
    } else {
      var w2 = (f - 0.5) * 2 * 100;
      shade.style.right = "0"; shade.style.width = w2 + "%"; shade.style.left = "auto";
    }
    disc.appendChild(shade);
  }

  function swapSealsAndMoon() {
    var cal = document.querySelector("#clarity-top-duo .hijri-cal-section");
    var sal = document.querySelector("#clarity-top-duo .salah-times-section");
    if (!cal || !sal) return;

    // Remove old seals from wrong places; rebuild
    var oldAllah = cal.querySelector(".allah-circular-seal");
    var oldMasjid = sal.querySelector(".masjid-circular-seal");
    if (oldAllah) oldAllah.remove();
    if (oldMasjid) oldMasjid.remove();
    // Also remove if already swapped
    cal.querySelectorAll(".masjid-circular-seal, #clarity-moon-phase").forEach(function (n) { n.remove(); });
    sal.querySelectorAll(".allah-circular-seal").forEach(function (n) { n.remove(); });

    // Calendar: moon phase + small masjid accent
    var moonWrap = document.createElement("div");
    moonWrap.id = "clarity-moon-phase";
    var disc = document.createElement("div");
    disc.id = "clarity-moon-disc";
    disc.setAttribute("aria-hidden", "true");
    var lab = document.createElement("div");
    lab.id = "clarity-moon-label";
    var phase = moonPhase(new Date());
    paintMoon(disc, phase);
    lab.textContent = phase.label;
    moonWrap.appendChild(disc);
    moonWrap.appendChild(lab);
    var masjid = document.createElement("div");
    masjid.className = "cal-masjid-accent";
    masjid.title = "Masjid";
    masjid.textContent = "🕌";
    moonWrap.appendChild(masjid);
    var calTitle = cal.querySelector(".cal-title");
    if (calTitle) cal.insertBefore(moonWrap, calTitle);
    else cal.insertBefore(moonWrap, cal.firstChild);

    // Salah: Allah plaque
    var allah = document.createElement("div");
    allah.className = "allah-circular-seal";
    allah.title = "Allah";
    allah.innerHTML = '<span class="arabic seal-ar">الله</span>';
    var salTitle = sal.querySelector(".salah-title");
    if (salTitle) sal.insertBefore(allah, salTitle);
    else sal.insertBefore(allah, sal.firstChild);
  }

  function boot() {
    injectCss();
    swapSealsAndMoon();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 80); });
  else setTimeout(boot, 80);
  w.addEventListener("load", function () { setTimeout(boot, 300); });
  document.addEventListener("clarity-core-ready", function () { setTimeout(boot, 200); });
})(typeof window !== "undefined" ? window : this);
