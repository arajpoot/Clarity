/**
 * Banner moon phase (calendar) + Allah plaque (salah) · no masjid clutter
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_BANNER_MOON_V2__) return;
  w.__CLARITY_BANNER_MOON_V2__ = true;

  var CSS = [
    "#clarity-top-duo .banner-overlay{display:flex!important;align-items:stretch!important;justify-content:space-between!important;",
    "  gap:0.35rem!important;width:100%!important;box-sizing:border-box!important;padding:0.3rem 0.35rem!important;}",
    "#clarity-top-duo .banner-side{flex:0 0 clamp(6.2rem,20vw,10rem)!important;width:clamp(6.2rem,20vw,10rem)!important;",
    "  max-width:22%!important;min-width:5.8rem!important;}",
    "#clarity-top-duo .banner-center{flex:1 1 auto!important;min-width:0!important;}",
    "#clarity-top-duo .hijri-cal-section,#clarity-top-duo .salah-times-section{",
    "  width:100%!important;height:100%!important;min-height:0!important;box-sizing:border-box!important;",
    "  border-radius:16px!important;background:rgba(0,0,0,0.34)!important;",
    "  box-shadow:inset 0 0 0 1px rgba(255,255,255,0.12)!important;padding:0.28rem 0.32rem!important;",
    "  display:flex!important;flex-direction:column!important;justify-content:flex-start!important;gap:0.12rem!important;}",
    "#clarity-moon-phase{display:flex;flex-direction:column;align-items:center;gap:0.12rem;margin:0 0 0.1rem;flex:0 0 auto;}",
    "#clarity-moon-disc{width:2.15rem;height:2.15rem;border-radius:50%;position:relative;overflow:hidden;",
    "  background:#1a1a22;box-shadow:inset -4px -2px 8px rgba(0,0,0,0.55),0 0 10px rgba(255,240,200,0.12);}",
    "#clarity-moon-disc .moon-lit{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f5f0d8,#c8b88a 55%,#8a7a55);}",
    "#clarity-moon-disc .moon-shade{position:absolute;top:0;bottom:0;border-radius:50%;background:#0c0c12;}",
    "#clarity-moon-label{font-size:0.58rem;opacity:0.9;text-align:center;line-height:1.15;}",
    "#clarity-top-duo .hijri-cal-grid{margin-top:0.05rem!important;}",
    "#clarity-top-duo .cal-title,#clarity-top-duo .salah-title{margin:0.05rem auto 0.1rem!important;font-size:0.62rem!important;}",
    "#clarity-top-duo .allah-circular-seal{margin:0 auto 0.1rem!important;}",
    "#clarity-top-duo .masjid-circular-seal,.cal-masjid-accent{display:none!important;}",
    "@media(max-width:720px){#clarity-moon-disc{width:1.85rem;height:1.85rem;}}"
  ].join("\n");

  function injectCss() {
    if (document.getElementById("clarity-banner-moon-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-banner-moon-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function moonPhase(date) {
    var d = date || new Date();
    var ref = Date.UTC(2000, 0, 6, 18, 14, 0);
    var synodic = 29.53058867;
    var days = (d.getTime() - ref) / 86400000;
    var age = ((days % synodic) + synodic) % synodic;
    var frac = age / synodic;
    var names = [
      [0.03, "New moon"], [0.22, "Waxing crescent"], [0.28, "First quarter"],
      [0.47, "Waxing gibbous"], [0.53, "Full moon"], [0.72, "Waning gibbous"],
      [0.78, "Last quarter"], [0.97, "Waning crescent"], [1.01, "New moon"]
    ];
    var label = "Moon";
    for (var i = 0; i < names.length; i++) {
      if (frac <= names[i][0]) { label = names[i][1]; break; }
    }
    return { frac: frac, label: label };
  }

  function paintMoon(disc, phase) {
    disc.innerHTML = "";
    var lit = document.createElement("div");
    lit.className = "moon-lit";
    disc.appendChild(lit);
    var shade = document.createElement("div");
    shade.className = "moon-shade";
    var f = phase.frac;
    if (f < 0.03 || f > 0.97) {
      shade.style.left = "0"; shade.style.width = "100%";
    } else if (f < 0.5) {
      shade.style.left = "0"; shade.style.width = ((0.5 - f) * 2 * 100) + "%";
    } else {
      shade.style.right = "0"; shade.style.left = "auto"; shade.style.width = ((f - 0.5) * 2 * 100) + "%";
    }
    disc.appendChild(shade);
  }

  function apply() {
    var cal = document.querySelector("#clarity-top-duo .hijri-cal-section");
    var sal = document.querySelector("#clarity-top-duo .salah-times-section");
    if (!cal || !sal) return;

    cal.querySelectorAll(".allah-circular-seal,.masjid-circular-seal,#clarity-moon-phase,.cal-masjid-accent").forEach(function (n) { n.remove(); });
    sal.querySelectorAll(".allah-circular-seal,.masjid-circular-seal").forEach(function (n) { n.remove(); });

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
    var calTitle = cal.querySelector(".cal-title");
    if (calTitle) cal.insertBefore(moonWrap, calTitle);
    else cal.insertBefore(moonWrap, cal.firstChild);

    var allah = document.createElement("div");
    allah.className = "allah-circular-seal";
    allah.title = "Allah";
    allah.innerHTML = '<span class="arabic seal-ar">الله</span>';
    var salTitle = sal.querySelector(".salah-title");
    if (salTitle) sal.insertBefore(allah, salTitle);
    else sal.insertBefore(allah, sal.firstChild);
  }

  function boot() { injectCss(); apply(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 80); });
  else setTimeout(boot, 80);
  w.addEventListener("load", function () { setTimeout(boot, 280); });
  document.addEventListener("clarity-core-ready", function () { setTimeout(boot, 180); });
})(typeof window !== "undefined" ? window : this);
