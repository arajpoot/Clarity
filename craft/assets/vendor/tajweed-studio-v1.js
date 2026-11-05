/* Tajweed Booth — enriched Phase B */
(function (g) {
  "use strict";
  if (g.__CLARITY_TAJWEED_STUDIO_V1__) return;
  g.__CLARITY_TAJWEED_STUDIO_V1__ = true;

  var KEY = "cu_craft_tajweed_log_v1";
  var RULES = [
    { id: "qalqalah", title: "Qalqalah", tip: "Echo on ق ط ب ج د when stopping — bounce lightly, do not force.", sample: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", ref: "112:1", steps: ["Stop on the letter","Release a light echo","Do not add a full vowel"] },
    { id: "ghunnah", title: "Ghunnah", tip: "Nasal hold on نّ / مّ about two counts.", sample: "إِنَّ ٱللَّهَ", ref: "many", steps: ["Close lips or tongue for nūn/mīm","Direct sound to the nose","Hold roughly two counts"] },
    { id: "idgham", title: "Idghām", tip: "Merge nūn sākinah/tanwīn into ي ر م ل و ن where the rule applies.", sample: "مِن رَّبِّهِمْ", ref: "2:5 area", steps: ["Spot nūn sākinah or tanwīn","See the next letter","Merge smoothly when required"] },
    { id: "ikhfa", title: "Ikhfā'", tip: "Conceal nūn sākinah before the ikhfā letters — tongue near, not full contact.", sample: "مِن قَبْلُ", ref: "examples", steps: ["Prepare nūn without full tongue press","Keep air flowing","Practice slowly"] },
    { id: "madd", title: "Madd", tip: "Lengthen letters of madd as your teacher taught.", sample: "ٱلرَّحْمَٰنِ", ref: "1:3", steps: ["Identify alif/wāw/yā of madd","Lengthen evenly","Avoid rushing the next letter"] },
    { id: "lam-jalalah", title: "Lām of Jalālah", tip: "Tafkhīm or tarqīq of Allāh's name by preceding vowel.", sample: "ٱللَّهُ", ref: "many", steps: ["Check the vowel before lām","Heavy or light as taught","Keep respect in the sound"] }
  ];

  var audioCtx = null, analyser = null, raf = 0, stream = null;

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function stopMeter() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    try { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    stream = null;
  }

  function open(root) {
    if (!root) return;
    stopMeter();
    root.innerHTML = "";
    var box = el("div", "craft-root");
    var opts = RULES.map(function (r) { return '<option value="' + r.id + '">' + r.title + "</option>"; }).join("");
    box.innerHTML =
      "<h2>🎧 Tajweed Booth</h2>" +
      '<p class="craft-lead">One rule · one āyah · listen · measure · log for O&amp;M review. Educational only — learn with a teacher.</p>' +
      '<div class="craft-toolbar">' +
      '<select id="tj-rule" aria-label="Tajweed rule">' + opts + "</select>" +
      '<button type="button" class="secondary" id="tj-listen">Listen (TTS)</button>' +
      '<button type="button" id="tj-mic">Hold for level</button>' +
      '<button type="button" class="secondary" id="tj-log">Complete &amp; log</button></div>' +
      '<div class="craft-ayah" id="tj-ayah" dir="rtl" lang="ar"></div>' +
      '<p id="tj-tip" class="craft-lead"></p>' +
      '<ol id="tj-steps" style="font-size:.8rem;opacity:.85;margin:.35rem 0 .5rem 1.1rem"></ol>' +
      '<div class="craft-meter" aria-label="Input level"><i id="tj-meter"></i></div>' +
      '<textarea id="tj-note" class="craft-field" rows="2" style="width:100%;margin:.4rem 0" placeholder="One improvement you noticed…"></textarea>' +
      '<p class="craft-log" id="tj-status">Level meter uses mic only while held.</p>' +
      '<p class="craft-note">After log: O&amp;M Lab Assistant can review · Lab Director may score · on-device transcript only.</p>';
    root.appendChild(box);

    function current() {
      var id = box.querySelector("#tj-rule").value;
      for (var i = 0; i < RULES.length; i++) if (RULES[i].id === id) return RULES[i];
      return RULES[0];
    }
    function renderRule() {
      var r = current();
      box.querySelector("#tj-ayah").textContent = r.sample;
      box.querySelector("#tj-tip").textContent = r.tip + (r.ref ? " · " + r.ref : "");
      box.querySelector("#tj-steps").innerHTML = (r.steps || []).map(function (s) { return "<li>" + s + "</li>"; }).join("");
    }
    renderRule();
    box.querySelector("#tj-rule").onchange = renderRule;

    box.querySelector("#tj-listen").onclick = function () {
      var r = current();
      try {
        if (!g.speechSynthesis) { box.querySelector("#tj-status").textContent = "TTS not available."; return; }
        g.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(r.sample);
        u.lang = "ar-SA"; u.rate = 0.85;
        g.speechSynthesis.speak(u);
        box.querySelector("#tj-status").textContent = "Playing sample (device TTS — not a qāriʾ).";
      } catch (e) { box.querySelector("#tj-status").textContent = "Could not play."; }
    };

    var micBtn = box.querySelector("#tj-mic");
    var meter = box.querySelector("#tj-meter");
    function tick() {
      if (!analyser) return;
      var data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(data);
      var sum = 0;
      for (var i = 0; i < data.length; i++) { var v = (data[i] - 128) / 128; sum += v * v; }
      var pct = Math.min(100, Math.round(Math.sqrt(sum / data.length) * 280));
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
        box.querySelector("#tj-status").textContent = "Listening… release when done.";
      } catch (e) { box.querySelector("#tj-status").textContent = "Microphone unavailable."; }
    }
    function stop() { stopMeter(); meter.style.width = "0%"; box.querySelector("#tj-status").textContent = "Meter stopped."; }
    micBtn.addEventListener("mousedown", startMic);
    micBtn.addEventListener("touchstart", function (e) { e.preventDefault(); startMic(); }, { passive: false });
    micBtn.addEventListener("mouseup", stop);
    micBtn.addEventListener("mouseleave", stop);
    micBtn.addEventListener("touchend", stop);

    box.querySelector("#tj-log").onclick = function () {
      var r = current();
      var note = (box.querySelector("#tj-note").value || "").trim() || ("Practiced " + r.title);
      try {
        var arr = JSON.parse(localStorage.getItem(KEY) || "[]");
        arr.unshift({ at: Date.now(), rule: r.id, sample: r.sample });
        localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 40)));
      } catch (e) {}
      if (g.ClarityLabPortfolio) {
        g.ClarityLabPortfolio.submit({
          station: "tajweed",
          title: r.title,
          note: note,
          meta: { sample: r.sample, ref: r.ref }
        });
        box.querySelector("#tj-status").textContent = "Logged · waiting for O&M Lab Assistant review.";
      } else {
        box.querySelector("#tj-status").textContent = "Logged on this device.";
      }
    };
  }

  g.ClarityTajweedStudio = { open: open, rules: RULES };
})(typeof window !== "undefined" ? window : this);
