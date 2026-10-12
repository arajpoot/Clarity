/* Calligraphy studio — Lab-native (Phase 1 extract surface) */
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
      '<p class="craft-lead">Write one letter or Beautiful Name with presence. Practice on-device — not a formal ijāzah.</p>' +
      '<div class="craft-toolbar">' +
      '<select id="cg-preset" aria-label="Practice text">' +
      "<option value=\"ا\">Alif ا</option>" +
      "<option value=\"ب\">Bā ب</option>" +
      "<option value=\"اللّه\">Allāh</option>" +
      "<option value=\"محمد\">Muḥammad</option>" +
      "<option value=\"بسم الله\">Basmala short</option>" +
      "</select>" +
      '<button type="button" class="secondary" id="cg-clear">Clear</button>' +
      '<button type="button" id="cg-save">Save practice note</button>' +
      "</div>" +
      '<div class="craft-canvas-wrap"><canvas id="cg-canvas" width="640" height="320" aria-label="Practice canvas"></canvas></div>' +
      '<p class="craft-log" id="cg-log"></p>' +
      '<p class="craft-note">Tip: slow strokes. Photograph progress in your phone gallery if you wish. Educational only.</p>';
    root.appendChild(box);

    var canvas = box.querySelector("#cg-canvas");
    var ctx = canvas.getContext("2d");
    var drawing = false;

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
      ctx.fillStyle = "rgba(224,197,106,0.2)";
      ctx.font = "48px Amiri, 'Noto Naskh Arabic', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var t = (box.querySelector("#cg-preset") || {}).value || "ا";
      ctx.fillText(t, (canvas.width / 2) / 2, 80);
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
    function end() {
      drawing = false;
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    box.querySelector("#cg-preset").onchange = function () {
      drawGuide();
    };
    box.querySelector("#cg-clear").onclick = function () {
      drawGuide();
    };
    box.querySelector("#cg-save").onclick = function () {
      var t = box.querySelector("#cg-preset").value;
      var log = { at: Date.now(), text: t, station: "callig" };
      try {
        var arr = JSON.parse(localStorage.getItem(KEY) || "[]");
        arr.unshift(log);
        localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 40)));
      } catch (e) {}
      box.querySelector("#cg-log").textContent = "Saved practice: " + t + " · on this device only.";
      try {
        g.dispatchEvent(new CustomEvent("cu-craft-complete", { detail: log }));
      } catch (e2) {}
    };
    resize();
  }

  g.ClarityCalligraphy = { open: open };
})(typeof window !== "undefined" ? window : this);
