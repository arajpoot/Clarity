/*! craft-calligraphy-v1 · on-device pad · educational watermark */
(function (w, d) {
  "use strict";
  var WORDS = [
    { ar: "بِسْمِ اللَّهِ", en: "Bismillah" },
    { ar: "الْحَمْدُ لِلَّهِ", en: "Al-ḥamdu lillāh" },
    { ar: "سُبْحَانَ اللَّهِ", en: "Subḥānallāh" },
    { ar: "اللَّهُ أَكْبَرُ", en: "Allāhu akbar" },
    { ar: "لَا إِلَٰهَ إِلَّا اللَّهُ", en: "Lā ilāha illā Allāh" },
    { ar: "مُحَمَّدٌ رَسُولُ اللَّهِ", en: "Muḥammadun rasūlullāh" }
  ];
  function boot() {
    var canvas = d.getElementById("cal-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var drawing = false;
    function pos(e) {
      var r = canvas.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      var y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
      return { x: x * (canvas.width / r.width), y: y * (canvas.height / r.height) };
    }
    function start(e) { e.preventDefault(); drawing = true; var p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      var p = pos(e);
      ctx.strokeStyle = "#e8f0ec";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    function end() { drawing = false; }
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    var prompts = d.getElementById("cal-prompts");
    var guide = d.getElementById("cal-guide");
    if (prompts) {
      prompts.innerHTML = WORDS.map(function (wrd, i) {
        return '<button type="button" data-i="' + i + '">' + wrd.ar + "</button>";
      }).join("");
      prompts.querySelectorAll("button").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var w0 = WORDS[+btn.getAttribute("data-i")];
          if (guide) guide.textContent = w0.ar + " · " + w0.en;
        });
      });
      prompts.querySelector("button").click();
    }
    var clr = d.getElementById("cal-clear");
    if (clr) clr.addEventListener("click", function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    var exp = d.getElementById("cal-export");
    if (exp) exp.addEventListener("click", function () {
      ctx.save();
      ctx.fillStyle = "rgba(201,162,39,0.85)";
      ctx.font = "20px Quicksand, sans-serif";
      ctx.fillText("clarity-dawah.fyi · educational only", 24, canvas.height - 24);
      ctx.restore();
      var a = d.createElement("a");
      a.download = "clarity-calligraphy.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
    if (w.ClarityCraftRegistry) w.ClarityCraftRegistry.runUpgrade("calligraphy", {});
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
