/*! craft-tajweed-local-v1 · rule tiles + meter + log · educational only */
(function (w, d) {
  "use strict";
  var RULES = [
    { id: "makharij", name: "Makhārij", ar: "مخارج", detail: "Exit points of letters — throat, tongue, lips, teeth. Slow letter practice first.", ex: "ا ح ع خ · ق ك · ت د ط · ف ب م و" },
    { id: "izhar", name: "Iẓhār", ar: "إظهار", detail: "Clear nūn/tanwīn before throat letters ء ه ع ح غ خ — no nasal merge.", ex: "مِنْ آمَنَ" },
    { id: "ikhfa", name: "Ikhfāʾ", ar: "إخفاء", detail: "Hide nūn/tanwīn before the 15 ikhfāʾ letters with light ghunnah.", ex: "Soft nasal cloud before ت ث ج د…" },
    { id: "idgham", name: "Idghām", ar: "إدغام", detail: "Merge nūn/tanwīn into ي ن م و (ghunnah) or ل ر.", ex: "مِنْ رَبِّهِمْ · مِنْ مَاءٍ" },
    { id: "iqlab", name: "Iqlāb", ar: "إقلاب", detail: "Nūn/tanwīn before ب becomes light mīm + ghunnah.", ex: "مِنْ بَعْدِ" },
    { id: "qalqalah", name: "Qalqalah", ar: "قلقلة", detail: "Bounce on ق ط ب ج د when sākin — no extra full vowel.", ex: "قَدْ أَفْلَحَ" }
  ];
  var active = RULES[0];
  var stream = null, raf = null, ctx = null, analyser = null;

  function renderRules() {
    var g = d.getElementById("rule-grid");
    if (!g) return;
    g.innerHTML = RULES.map(function (r, i) {
      return '<button type="button" class="rule-tile' + (i === 0 ? " active" : "") + '" data-rule="' + r.id + '"><strong>' + r.name + ' · ' + r.ar + '</strong><span>' + r.detail.slice(0, 48) + "…</span></button>";
    }).join("");
    g.querySelectorAll("[data-rule]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        g.querySelectorAll(".rule-tile").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        active = RULES.filter(function (r) { return r.id === btn.getAttribute("data-rule"); })[0] || RULES[0];
        showDetail();
      });
    });
    showDetail();
  }
  function showDetail() {
    var el = d.getElementById("rule-detail");
    if (!el || !active) return;
    el.textContent = active.name + " (" + active.ar + ")\n\n" + active.detail + "\n\nExample: " + active.ex + "\n\nEducational only — verify with a teacher.";
  }
  function logPractice() {
    try {
      var key = "clarity_craft_tajweed_log_v1";
      var arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.unshift({ t: new Date().toISOString(), rule: active.id, name: active.name });
      localStorage.setItem(key, JSON.stringify(arr.slice(0, 40)));
      paintLog();
    } catch (e) {}
  }
  function paintLog() {
    var el = d.getElementById("practice-log");
    if (!el) return;
    try {
      var arr = JSON.parse(localStorage.getItem("clarity_craft_tajweed_log_v1") || "[]");
      el.innerHTML = arr.length ? arr.map(function (x) {
        return "<div>" + (x.t || "").slice(0, 19).replace("T", " ") + " · " + x.name + "</div>";
      }).join("") : "<p class='panel-note'>No sessions logged yet.</p>";
    } catch (e) { el.textContent = ""; }
  }
  function stopMeter() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    try { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    stream = null;
    var fill = d.getElementById("meter-fill");
    var lab = d.getElementById("meter-label");
    if (fill) fill.style.width = "0%";
    if (lab) lab.textContent = "Meter idle";
  }
  function startMeter() {
    stopMeter();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      var lab = d.getElementById("meter-label");
      if (lab) lab.textContent = "Mic API not available in this browser";
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (s) {
      stream = s;
      ctx = new (w.AudioContext || w.webkitAudioContext)();
      var src = ctx.createMediaStreamSource(s);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      var data = new Uint8Array(analyser.frequencyBinCount);
      var fill = d.getElementById("meter-fill");
      var lab = d.getElementById("meter-label");
      if (lab) lab.textContent = "Listening (on-device only)…";
      function tick() {
        analyser.getByteFrequencyData(data);
        var sum = 0;
        for (var i = 0; i < data.length; i++) sum += data[i];
        var avg = sum / data.length;
        var pct = Math.min(100, Math.round((avg / 128) * 100));
        if (fill) fill.style.width = pct + "%";
        raf = requestAnimationFrame(tick);
      }
      tick();
    }).catch(function () {
      var lab = d.getElementById("meter-label");
      if (lab) lab.textContent = "Mic permission denied — meter offline";
    });
  }
  function boot() {
    renderRules();
    paintLog();
    var bl = d.getElementById("btn-log-rule");
    if (bl) bl.addEventListener("click", logPractice);
    var bs = d.getElementById("btn-meter-start");
    if (bs) bs.addEventListener("click", startMeter);
    var bt = d.getElementById("btn-meter-stop");
    if (bt) bt.addEventListener("click", stopMeter);
    if (w.ClarityCraftRegistry) w.ClarityCraftRegistry.runUpgrade("tajweed", { rules: RULES.length });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
