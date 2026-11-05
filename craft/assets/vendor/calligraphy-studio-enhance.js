/* Calligraphy studio enhance — tip modes + viewport + narrow pad
 * Additive; does not replace lab/calligraphy/studio.js core draw.
 * Build 20261019UNI
 */
(function (g) {
  "use strict";
  if (g.__CU_CALLIG_ENHANCE_V1__) return;
  g.__CU_CALLIG_ENHANCE_V1__ = true;

  var tips = {
    finger: "Finger: soft pressure, slower lifts. Learn the letter shape first.",
    stylus: "Stylus: steadier line; keep the angle consistent through the stroke.",
    qalam: "Qalam: thicker on downward pressure, thinner on release — classic naskh feel.",
    blunt: "Blunt tip: even width; focus on proportion and baseline alignment."
  };
  var scale = 1;

  function $(sel) {
    return document.querySelector(sel);
  }

  function ensureTipBar() {
    if (document.querySelector(".cu-callig-tip-bar")) return;
    var host =
      document.querySelector(".lab-station main, main.cu-content, #callig-stage, .callig-wrap") ||
      document.querySelector("main");
    if (!host) return;
    var bar = document.createElement("div");
    bar.className = "cu-callig-tip-bar";
    bar.innerHTML =
      '<span class="cct-lab">Writing tip</span>' +
      '<button type="button" class="mv-chip" data-tip="finger">Finger</button>' +
      '<button type="button" class="mv-chip" data-tip="stylus">Stylus</button>' +
      '<button type="button" class="mv-chip" data-tip="qalam">Qalam</button>' +
      '<button type="button" class="mv-chip" data-tip="blunt">Blunt</button>' +
      '<span class="cct-msg" id="cu-callig-tip-msg"></span>';
    var letters = host.querySelector("h2, .letters, [class*='letter']");
    if (letters && letters.parentNode) letters.parentNode.insertBefore(bar, letters);
    else host.insertBefore(bar, host.firstChild);

    bar.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-tip]");
      if (!t) return;
      bar.querySelectorAll("[data-tip]").forEach(function (b) {
        b.classList.toggle("on", b === t);
      });
      var mode = t.getAttribute("data-tip");
      var msg = document.getElementById("cu-callig-tip-msg");
      if (msg) msg.textContent = tips[mode] || "";
      try {
        if (g.calligState) g.calligState.tipMode = mode;
      } catch (e) {}
    });
  }

  function ensureViewport() {
    if (document.querySelector(".cu-callig-viewport")) return;
    var tools =
      document.querySelector(".callig-tools, .lab-toolbar, #callig-pad-control-bar") ||
      document.querySelector("button") && document.querySelector("button").parentElement;
    var pad =
      document.getElementById("callig-pad") ||
      document.getElementById("callig-canvas") ||
      document.querySelector("canvas");
    if (!pad) return;
    var vp = document.createElement("div");
    vp.className = "cu-callig-viewport";
    vp.innerHTML =
      '<button type="button" data-vp="in" title="Zoom in">＋</button>' +
      '<button type="button" data-vp="out" title="Zoom out">－</button>' +
      '<button type="button" data-vp="reset" title="Reset">⟲ View</button>';
    if (tools) tools.appendChild(vp);
    else pad.parentNode && pad.parentNode.insertBefore(vp, pad);

    vp.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-vp]");
      if (!t) return;
      var act = t.getAttribute("data-vp");
      if (act === "in") scale = Math.min(1.75, scale + 0.12);
      if (act === "out") scale = Math.max(0.55, scale - 0.12);
      if (act === "reset") scale = 1;
      pad.style.transform = "scale(" + scale + ")";
      pad.style.transformOrigin = "center top";
    });
  }

  function narrowPad() {
    var pad =
      document.getElementById("callig-pad") ||
      document.getElementById("callig-canvas") ||
      document.querySelector("canvas");
    var wrap = pad && pad.parentElement;
    if (wrap) {
      wrap.style.maxWidth = "min(100%, 520px)";
      wrap.style.marginLeft = "auto";
      wrap.style.marginRight = "auto";
      wrap.style.overflowX = "auto";
    }
    if (pad) {
      pad.style.maxWidth = "min(100%, 500px)";
      pad.style.width = "100%";
      pad.style.display = "block";
      pad.style.margin = "0 auto";
    }
  }

  function boot() {
    ensureTipBar();
    ensureViewport();
    narrowPad();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
