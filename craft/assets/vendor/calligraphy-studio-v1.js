/* Calligraphy Atelier — enriched Phase B */
(function (g) {
  "use strict";
  if (g.__CLARITY_CALLIGRAPHY_STUDIO_V1__) return;
  g.__CLARITY_CALLIGRAPHY_STUDIO_V1__ = true;

  var KEY = "cu_craft_callig_log_v1";

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function open(root) {
    if (!root) return;
    root.innerHTML = "";
    var box = el("div", "craft-root");
    box.innerHTML =
      "<h2>✍️ Calligraphy Atelier</h2>" +
      '<p class="craft-lead">One letter or Beautiful Name with presence. Log for O&amp;M review → Lab Director score.</p>' +
      '<div class="craft-toolbar">' +
      '<select id="cg-preset" aria-label="Practice text">' +
      "<option value=\"ا\">Alif ا</option>" +
      "<option value=\"ب\">Bā ب</option>" +
      "<option value=\"ح\">Ḥā ح</option>" +
      "<option value=\"اللّه\">Allāh</option>" +
      "<option value=\"محمد\">Muḥammad</option>" +
      "<option value=\"بسم الله\">Basmala</option>" +
      "</select>" +
      '<button type="button" class="secondary" id="cg-clear">Clear</button>' +
      '<button type="button" class="secondary" id="cg-guide">Toggle guide</button>' +
      '<button type="button" id="cg-save">Complete &amp; log</button></div>' +
      '<div class="craft-canvas-wrap"><canvas id="cg-canvas" width="640" height="320" aria-label="Practice canvas"></canvas></div>' +
      '<textarea id="cg-note" class="craft-field" rows="2" style="width:100%;margin:.4rem 0" placeholder="What felt present in the stroke?"></textarea>' +
      '<p class="craft-log" id="cg-log"></p>' +
      '<p class="craft-note">Educational only — not an ijāzah. Photograph progress if you wish.</p>';
    root.appendChild(box);

    var canvas = box.querySelector("#cg-canvas");
    var ctx = canvas.getContext("2d");
    var drawing = false, showGuide = true;

    function resize() {
      var w = Math.min(640, box.clientWidth - 8 || 320);
      canvas.style.width = "100%";
      canvas.width = w * 2;
      canvas.height = 320;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#e0c56a";
      ctx.lineWidth = 3;
      drawGuide();
    }
    function drawGuide() {
      ctx.save();
      ctx.fillStyle = "#0a1210";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (showGuide) {
        ctx.fillStyle = "rgba(224,197,106,0.18)";
        ctx.font = "48px Amiri, 'Noto Naskh Arabic', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((box.querySelector("#cg-preset") || {}).value || "ا", (canvas.width / 2) / 2, 80);
      }
      ctx.restore();
    }
    function pos(ev) {
      var r = canvas.getBoundingClientRect();
      var t = ev.touches ? ev.touches[0] : ev;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    }
    function start(ev) {
      drawing = true;
      var p = pos(ev);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ev.preventDefault();
    }
    function move(ev) {
      if (!drawing) return;
      var p = pos(ev);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ev.preventDefault();
    }
    function end() { drawing = false; }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    box.querySelector("#cg-preset").onchange = drawGuide;
    box.querySelector("#cg-clear").onclick = drawGuide;
    box.querySelector("#cg-guide").onclick = function () {
      showGuide = !showGuide;
      drawGuide();
    };
    box.querySelector("#cg-save").onclick = function () {
      var t = box.querySelector("#cg-preset").value;
      var note = (box.querySelector("#cg-note").value || "").trim() || ("Practiced " + t);
      try {
        var arr = JSON.parse(localStorage.getItem(KEY) || "[]");
        arr.unshift({ at: Date.now(), text: t });
        localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 40)));
      } catch (e) {}
      if (g.ClarityLabPortfolio) {
        g.ClarityLabPortfolio.submit({ station: "callig", title: "Calligraphy · " + t, note: note, meta: { glyph: t } });
        box.querySelector("#cg-log").textContent = "Logged · O&M may review next.";
      } else box.querySelector("#cg-log").textContent = "Saved on device.";
    };
    resize();
  }

  g.ClarityCalligraphy = { open: open };
})(typeof window !== "undefined" ? window : this);
