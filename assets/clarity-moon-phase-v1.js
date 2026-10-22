/**
 * Dynamic moon phase plaque · 20261021MOON2
 * Canvas-only (no "Moon" label). Educational — not a fatwa / not for ruʾyah.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_MOON_PHASE_V1__ === "20261021MOON2") return;
  w.__CLARITY_MOON_PHASE_V1__ = "20261021MOON2";

  var KNOWN_NEW = Date.UTC(2000, 0, 6, 18, 14, 0);
  var SYNODIC = 29.53058867 * 24 * 3600 * 1000;

  function phaseFrac(date) {
    var t = (date || new Date()).getTime();
    var age = ((t - KNOWN_NEW) % SYNODIC + SYNODIC) % SYNODIC;
    return age / SYNODIC;
  }

  function phaseName(frac) {
    if (frac < 0.03 || frac >= 0.97) return "New moon";
    if (frac < 0.22) return "Waxing crescent";
    if (frac < 0.28) return "First quarter";
    if (frac < 0.47) return "Waxing gibbous";
    if (frac < 0.53) return "Full moon";
    if (frac < 0.72) return "Waning gibbous";
    if (frac < 0.78) return "Last quarter";
    return "Waning crescent";
  }

  /**
   * Draw moon: lit portion vs shadow for phase 0..1 (0=new, 0.5=full).
   */
  function paint(canvas, frac) {
    if (!canvas || !canvas.getContext) return;
    var dpr = Math.min(w.devicePixelRatio || 1, 2);
    var css = 48;
    canvas.style.width = css + "px";
    canvas.style.height = css + "px";
    canvas.width = Math.round(css * dpr);
    canvas.height = Math.round(css * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var s = css;
    var cx = s / 2;
    var cy = s / 2;
    var r = s / 2 - 2;

    ctx.clearRect(0, 0, s, s);

    /* soft outer glow */
    var g = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.15);
    g.addColorStop(0, "rgba(240,230,200,0.15)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
    ctx.fill();

    /* base disc — night */
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#0d1218";
    ctx.fill();

    /* illuminated moon body */
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    var lg = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.3, r * 0.1, cx, cy, r);
    lg.addColorStop(0, "#f5edd8");
    lg.addColorStop(0.55, "#e2d4a8");
    lg.addColorStop(1, "#c4b48a");
    ctx.fillStyle = lg;
    ctx.fill();

    /* phase terminator via orthogonal ellipse + half-cover
       frac 0 = new (all dark), 0.5 = full (all lit), 1 = new */
    var psi = frac * 2 * Math.PI; /* 0..2pi */
    /* Use classic: shade the portion
       For waxing (0..0.5): light grows from right
       Approximate with vertical half + scaled ellipse */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 0.5, 0, Math.PI * 2);
    ctx.clip();

    var limb = Math.cos(frac * 2 * Math.PI); /* 1 at new/full extremes... */
    /* better: illuminated fraction */
    /* Draw dark overlay as circle shifted */
    var xOff = Math.cos(frac * 2 * Math.PI) * r;
    /* Standard algorithm: */
    ctx.fillStyle = "rgba(8, 10, 14, 0.94)";
    if (frac <= 0.5) {
      /* waxing: dark on the left, light on the right */
      /* cover left half */
      ctx.beginPath();
      ctx.rect(0, 0, cx, s);
      ctx.fill();
      /* ellipse restores light or adds dark in center band */
      var rx = Math.abs(Math.cos(frac * 2 * Math.PI)) * r;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(0.01, rx), r, 0, 0, Math.PI * 2);
      if (frac < 0.25) {
        /* still mostly dark — ellipse is dark */
        ctx.fillStyle = "rgba(8, 10, 14, 0.94)";
        ctx.fill();
      } else {
        /* gibbous waxing — ellipse is lit cut from left dark: redraw lit ellipse */
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }
    } else {
      /* waning: dark on the right */
      ctx.beginPath();
      ctx.rect(cx, 0, cx, s);
      ctx.fill();
      var rx2 = Math.abs(Math.cos(frac * 2 * Math.PI)) * r;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(0.01, rx2), r, 0, 0, Math.PI * 2);
      if (frac > 0.75) {
        ctx.fillStyle = "rgba(8, 10, 14, 0.94)";
        ctx.fill();
      } else {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }
    }
    ctx.restore();

    /* crisp rim */
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(201, 168, 76, 0.55)";
    ctx.lineWidth = 1.25;
    ctx.stroke();
  }

  function render() {
    var root = document.getElementById("clarity-moon-plaque");
    if (!root) return;
    var canvas = root.querySelector("canvas");
    var frac = phaseFrac(new Date());
    var name = phaseName(frac);
    if (canvas) paint(canvas, frac);
    root.setAttribute("title", name);
    root.setAttribute("aria-label", "Moon phase: " + name);
  }

  function boot() {
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setInterval(render, 30 * 60 * 1000);
  w.addEventListener("resize", function () {
    render();
  });
  w.clarityMoonPhase = { render: render, phaseFrac: phaseFrac, phaseName: phaseName };
})(typeof window !== "undefined" ? window : this);
