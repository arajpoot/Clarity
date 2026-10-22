/**
 * Interactive moon phase plaque · calendar banner · 20261021MOON
 * Approximate phase from synodic month (local date). Educational — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_MOON_PHASE_V1__) return;
  w.__CLARITY_MOON_PHASE_V1__ = "20261021MOON";

  /* Known new moon approx: 2000-01-06 18:14 UTC */
  var KNOWN_NEW = Date.UTC(2000, 0, 6, 18, 14, 0);
  var SYNODIC = 29.53058867 * 24 * 3600 * 1000;

  function phaseInfo(date) {
    var t = (date || new Date()).getTime();
    var age = ((t - KNOWN_NEW) % SYNODIC + SYNODIC) % SYNODIC;
    var frac = age / SYNODIC; /* 0 = new, 0.5 = full */
    var names = [
      { max: 0.03, name: "New moon", emoji: "🌑" },
      { max: 0.22, name: "Waxing crescent", emoji: "🌒" },
      { max: 0.28, name: "First quarter", emoji: "🌓" },
      { max: 0.47, name: "Waxing gibbous", emoji: "🌔" },
      { max: 0.53, name: "Full moon", emoji: "🌕" },
      { max: 0.72, name: "Waning gibbous", emoji: "🌖" },
      { max: 0.78, name: "Last quarter", emoji: "🌗" },
      { max: 0.97, name: "Waning crescent", emoji: "🌘" },
      { max: 1.01, name: "New moon", emoji: "🌑" }
    ];
    var label = names[0];
    for (var i = 0; i < names.length; i++) {
      if (frac <= names[i].max) {
        label = names[i];
        break;
      }
    }
    return {
      frac: frac,
      ageDays: age / (24 * 3600 * 1000),
      name: label.name,
      emoji: label.emoji
    };
  }

  function paintIllumination(canvas, frac) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var s = canvas.width;
    var r = s / 2 - 2;
    var cx = s / 2;
    var cy = s / 2;
    ctx.clearRect(0, 0, s, s);
    /* disk */
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a22";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#f0e6c8";
    ctx.fill();
    /* shadow ellipse — simple phase */
    var phase = frac * 2 * Math.PI;
    /* 0 new: full shadow; 0.5 full: no shadow */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 0.5, 0, Math.PI * 2);
    ctx.clip();
    if (frac < 0.5) {
      /* waxing: shadow on left */
      var k = 1 - frac * 2; /* 1 at new → 0 at full */
      ctx.beginPath();
      ctx.ellipse(cx - r * k * 0.15, cy, r * Math.abs(k), r, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(12,14,20,0.92)";
      ctx.fill();
      if (k > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI / 2, -Math.PI / 2, true);
        ctx.fillStyle = "rgba(12,14,20,0.92)";
        ctx.fill();
      }
    } else {
      var k2 = (frac - 0.5) * 2; /* 0 full → 1 new */
      ctx.beginPath();
      ctx.ellipse(cx + r * k2 * 0.15, cy, r * Math.abs(k2), r, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(12,14,20,0.92)";
      ctx.fill();
      if (k2 > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, true);
        ctx.fillStyle = "rgba(12,14,20,0.92)";
        ctx.fill();
      }
    }
    ctx.restore();
    /* rim */
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(201,168,76,0.45)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function render() {
    var root = document.getElementById("clarity-moon-plaque");
    if (!root) return;
    var info = phaseInfo(new Date());
    var emoji = root.querySelector("[data-moon-emoji]");
    var name = root.querySelector("[data-moon-name]");
    var canvas = root.querySelector("canvas");
    if (emoji) emoji.textContent = info.emoji;
    if (name) name.textContent = info.name;
    if (canvas) paintIllumination(canvas, info.frac);
    root.setAttribute("title", info.name + " · day " + info.ageDays.toFixed(1) + " of cycle");
    root.setAttribute("aria-label", "Moon phase: " + info.name);
  }

  function boot() {
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  /* refresh occasionally */
  setInterval(render, 60 * 60 * 1000);
  w.clarityMoonPhase = { render: render, phaseInfo: phaseInfo };
})(typeof window !== "undefined" ? window : this);
