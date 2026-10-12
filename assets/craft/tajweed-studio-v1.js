/* Tajweed deep studio — Lab-native (Phase 1) */
(function (g) {
  "use strict";
  if (g.__CLARITY_TAJWEED_STUDIO_V1__) return;
  g.__CLARITY_TAJWEED_STUDIO_V1__ = true;

  var KEY = "cu_craft_tajweed_log_v1";
  var RULES = [
    { id: "qalqalah", title: "Qalqalah", tip: "Echo on ق ط ب ج د when stopping.", sample: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", ref: "112:1" },
    { id: "ghunnah", title: "Ghunnah", tip: "Nasal sound on نّ / مّ (~2 counts).", sample: "إِنَّ ٱللَّهَ", ref: "many" },
    { id: "idgham", title: "Idghām", tip: "Merge nūn sākinah/tanwīn into ي ر م ل و ن where rules apply.", sample: "مِن رَّبِّهِمْ", ref: "2:5 area" },
    { id: "ikhfa", title: "Ikhfā'", tip: "Conceal nūn sākinah before specific letters.", sample: "مِن قَبْلُ", ref: "examples" },
    { id: "madd", title: "Madd", tip: "Lengthen letters of madd as taught by your teacher.", sample: "ٱلرَّحْمَٰنِ", ref: "1:3" }
  ];

  var audioCtx = null, analyser = null, raf = 0, stream = null, rec = null, chunks = [];

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function stopMeter() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    try {
      if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    } catch (e) {}
    stream = null;
  }

  function open(root) {
    if (!root) return;
    stopMeter();
    root.innerHTML = "";
    var box = el("div", "craft-root");
    var opts = RULES.map(function (r) {
      return '<option value="' + r.id + '">' + r.title + "</option>";
    }).join("");
    box.innerHTML =
      "<h2>🎧 Tajweed Booth</h2>" +
      '<p class="craft-lead">One rule, one āyah — listen, recite, note one improvement. Educational only; learn with a qualified teacher.</p>' +
      '<div class="craft-toolbar">' +
      '<select id="tj-rule" aria-label="Tajweed rule">' + opts + "</select>" +
      '<button type="button" class="secondary" id="tj-listen">Listen (TTS)</button>' +
      '<button type="button" id="tj-mic">Hold to measure level</button>' +
      '<button type="button" class="secondary" id="tj-log">Complete &amp; log</button>' +
      "</div>" +
      '<div class="craft-ayah" id="tj-ayah" dir="rtl" lang="ar"></div>' +
      '<p id="tj-tip" class="craft-lead"></p>' +
      '<div class="craft-meter" aria-label="Input level"><i id="tj-meter"></i></div>' +
      '<p class="craft-log" id="tj-status">Level meter uses microphone only while held — permission required.</p>' +
      '<p class="craft-note">Not a recitation certificate. Prefer local teacher for correction.</p>';
    root.appendChild(box);

    function current() {
      var id = box.querySelector("#tj-rule").value;
      for (var i = 0; i < RULES.length; i++) if (RULES[i].id === id) return RULES[i];
      return RULES[0];
    }
    function renderRule() {
      var r = current();
      box.querySelector("#tj-ayah").textContent = r.sample;
      box.querySelector("#tj-tip").textContent = r.tip + (r.ref ? " · ref " + r.ref : "");
    }
    renderRule();
    box.querySelector("#tj-rule").onchange = renderRule;

    box.querySelector("#tj-listen").onclick = function () {
      var r = current();
      try {
        if (!g.speechSynthesis) {
          box.querySelector("#tj-status").textContent = "Speech synthesis not available on this device.";
          return;
        }
        g.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(r.sample);
        u.lang = "ar-SA";
        u.rate = 0.85;
        g.speechSynthesis.speak(u);
        box.querySelector("#tj-status").textContent = "Playing sample (device TTS — not a qāriʾ).";
      } catch (e) {
        box.querySelector("#tj-status").textContent = "Could not play audio.";
      }
    };

    var micBtn = box.querySelector("#tj-mic");
    var meter = box.querySelector("#tj-meter");

    function tick() {
      if (!analyser) return;
      var data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(data);
      var sum = 0;
      for (var i = 0; i < data.length; i++) {
        var v = (data[i] - 128) / 128;
        sum += v * v;
      }
      var rms = Math.sqrt(sum / data.length);
      var pct = Math.min(100, Math.round(rms * 280));
      meter.style.width = pct + "%";
      raf = requestAnimationFrame(tick);
    }

    async function startMic() {
      try {
        stopMeter();
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (g.AudioContext || g.webkitAudioContext)();
        var src = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        src.connect(analyser);
        tick();
        box.querySelector("#tj-status").textContent = "Listening for level… release when done.";
      } catch (e) {
        box.querySelector("#tj-status").textContent = "Microphone blocked or unavailable.";
      }
    }

    micBtn.addEventListener("mousedown", startMic);
    micBtn.addEventListener("touchstart", function (e) {
      e.preventDefault();
      startMic();
    }, { passive: false });
    function stop() {
      stopMeter();
      meter.style.width = "0%";
      box.querySelector("#tj-status").textContent = "Meter stopped.";
    }
    micBtn.addEventListener("mouseup", stop);
    micBtn.addEventListener("mouseleave", stop);
    micBtn.addEventListener("touchend", stop);

    box.querySelector("#tj-log").onclick = function () {
      var r = current();
      var log = { at: Date.now(), station: "tajweed", rule: r.id, sample: r.sample };
      try {
        var arr = JSON.parse(localStorage.getItem(KEY) || "[]");
        arr.unshift(log);
        localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 40)));
      } catch (e) {}
      box.querySelector("#tj-status").textContent = "Logged: " + r.title + " · on this device.";
      try {
        g.dispatchEvent(new CustomEvent("cu-craft-complete", { detail: log }));
      } catch (e2) {}
    };
  }

  g.ClarityTajweedStudio = { open: open, rules: RULES };
})(typeof window !== "undefined" ? window : this);
