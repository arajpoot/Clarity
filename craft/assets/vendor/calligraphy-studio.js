(function (g) {
  "use strict";
  if (g.__CU_LAB_CALLIG_V1__) return;
  g.__CU_LAB_CALLIG_V1__ = true;
  var letter = "ا";
  function $(id) { return document.getElementById(id); }
  function drawGhost() {
    var c = $("callig-ghost");
    if (!c) return;
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#1e7d5e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 180px serif";
    ctx.fillText(letter, c.width / 2, c.height / 2 + 10);
  }
  function clearPad() {
    var c = $("callig-pad");
    if (!c) return;
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
  }
  function wirePad() {
    var c = $("callig-pad");
    if (!c) return;
    var ctx = c.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2a2319";
    ctx.lineWidth = 4;
    var drawing = false;
    function pos(e) {
      var r = c.getBoundingClientRect();
      var t = e.touches ? e.touches[0] : e;
      return {
        x: ((t.clientX - r.left) / r.width) * c.width,
        y: ((t.clientY - r.top) / r.height) * c.height
      };
    }
    function start(e) {
      e.preventDefault();
      drawing = true;
      var p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      var p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    function end() { drawing = false; }
    c.addEventListener("mousedown", start);
    c.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    c.addEventListener("touchstart", start, { passive: false });
    c.addEventListener("touchmove", move, { passive: false });
    c.addEventListener("touchend", end);
  }
  function boot() {
    document.querySelectorAll("[data-letter]").forEach(function (b) {
      b.addEventListener("click", function () {
        letter = b.getAttribute("data-letter") || "ا";
        drawGhost();
        clearPad();
        var g = $("callig-guide");
        if (g) g.textContent = "Tracing: " + letter;
      });
    });
    if ($("callig-clear")) $("callig-clear").onclick = clearPad;
    if ($("callig-save")) {
      $("callig-save").onclick = function () {
        try {
          localStorage.setItem("clarity_callig_last_v1", letter + "|" + Date.now());
          localStorage.setItem("clarity_lab_last_v1", String(Date.now()));
        } catch (e) {}
        var g = $("callig-guide");
        if (g) g.textContent = "Mark saved on this device · " + letter;
      };
    }
    drawGhost();
    wirePad();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
