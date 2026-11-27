/*! companion-action-lmr-native-v1.js · N4 functional LMR
 * Action-tab only · level meter · whisper-along · optional Whisper-tiny STT
 * Modelled on NurOS AV LMR meter (analyser on record stream)
 * Educational only — not a qāriʾ grade — not a fatwa
 */
(function (w, d) {
  "use strict";
  w.__CLARITY_LMR_NATIVE_V1__ = true;
  w.__CLARITY_LMR_NATIVE_V4__ = true;

  var state = {
    ar: "",
    en: "",
    surah: 1,
    ayah: 1,
    masterUrl: "",
    userBlob: null,
    userUrl: "",
    rec: null,
    chunks: [],
    t0: 0,
    masterDur: 0,
    stream: null,
    whispered: false
  };

  /* meter */
  var meterCtx = null, meterAn = null, meterRaf = null;

  function $(id) { return d.getElementById(id); }

  function activeTab() {
    try {
      var t = (d.body && (d.body.getAttribute("data-active-tab") || d.body.getAttribute("data-cs-tab"))) || "";
      t = String(t || "").toLowerCase().replace(/^#/, "");
      if (t) return t;
      var btn = d.querySelector("#clarity-door-rail [data-rail-tab].is-active, .cs-door [data-rail-tab].is-active");
      if (btn) return String(btn.getAttribute("data-rail-tab") || "").toLowerCase();
      var h = String((w.location && w.location.hash) || "").replace(/^#/, "").toLowerCase();
      if (h) return h;
    } catch (e) {}
    return "";
  }

  function isAction() { return activeTab() === "action"; }

  function status(msg) {
    var el = $("tj-lmr-n-status");
    if (el) el.textContent = msg || "";
  }

  function everyAyahUrl(surah, ayah) {
    var s = String(surah).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3";
  }

  function stopMeter() {
    if (meterRaf) cancelAnimationFrame(meterRaf);
    meterRaf = null;
    try {
      if (meterCtx && meterCtx.state !== "closed") meterCtx.close();
    } catch (e) {}
    meterCtx = null;
    meterAn = null;
    d.querySelectorAll(".tj-lmr-live-meter").forEach(function (m) {
      m.classList.remove("recording");
    });
    d.querySelectorAll("#tj-lmr-meter-fill").forEach(function (f) {
      f.style.width = "0%";
    });
  }

  function startMeter(stream) {
    try {
      stopMeter();
      if (!stream) return;
      ensureMeterUI();
      meterCtx = new (w.AudioContext || w.webkitAudioContext)();
      var src = meterCtx.createMediaStreamSource(stream);
      meterAn = meterCtx.createAnalyser();
      meterAn.fftSize = 512;
      meterAn.smoothingTimeConstant = 0.3;
      src.connect(meterAn);
      var data = new Uint8Array(meterAn.fftSize);
      d.querySelectorAll(".tj-lmr-live-meter").forEach(function (m) {
        m.classList.add("recording");
      });
      function tick() {
        if (!meterAn) return;
        meterAn.getByteTimeDomainData(data);
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
          var v = (data[i] - 128) / 128;
          sum += v * v;
        }
        var rms = Math.sqrt(sum / data.length);
        var pct = Math.min(100, Math.round(rms * 350));
        d.querySelectorAll("#tj-lmr-meter-fill").forEach(function (f) {
          f.style.width = pct + "%";
        });
        var pctEl = $("tj-lmr-meter-pct");
        if (pctEl) pctEl.textContent = pct + "%";
        meterRaf = requestAnimationFrame(tick);
      }
      tick();
    } catch (e) {
      console.warn("[lmr meter]", e);
      status("Meter unavailable in this browser · record still works");
    }
  }

  function ensureMeterUI() {
    var bar = $("tj-lmr-native-bar");
    if (!bar) return null;
    var meter = bar.querySelector(".tj-lmr-live-meter");
    if (!meter) {
      meter = d.createElement("div");
      meter.className = "tj-lmr-live-meter";
      meter.innerHTML =
        '<div class="meter-label">Input level <span id="tj-lmr-meter-pct">0%</span></div>' +
        '<div class="meter-track"><div class="meter-fill" id="tj-lmr-meter-fill"></div></div>';
      var statusEl = $("tj-lmr-n-status");
      if (statusEl && statusEl.parentNode) statusEl.parentNode.insertBefore(meter, statusEl);
      else bar.appendChild(meter);
    }
    return meter;
  }

  function ensureStyles() {
    if ($("tj-lmr-native-css")) return;
    var s = d.createElement("style");
    s.id = "tj-lmr-native-css";
    s.textContent =
      "#tj-lmr-native-bar{margin:.75rem 0;padding:.85rem 1rem;border-radius:14px;border:1px solid rgba(196,165,116,.35);background:rgba(12,28,20,.55);color:#e8efe9}" +
      "#tj-lmr-native-bar .tj-lmr-native-kicker{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#c4a574;margin:0 0 .25rem}" +
      "#tj-lmr-native-bar .tj-lmr-native-disc{font-size:.82rem;color:#c5d0c6;margin:0 0 .65rem;line-height:1.4}" +
      "#tj-lmr-native-bar .tj-lmr-native-row{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;margin:.4rem 0}" +
      "#tj-lmr-native-bar label{font-size:.8rem}" +
      "#tj-lmr-native-bar input[type=number]{width:4rem;margin:0 .25rem;padding:.25rem .35rem;border-radius:8px;border:1px solid rgba(196,165,116,.35);background:rgba(0,0,0,.25);color:#f7f0dd}" +
      "#tj-lmr-native-bar .btn{cursor:pointer;border-radius:999px;border:1px solid rgba(196,165,116,.4);background:rgba(42,107,74,.35);color:#f7f0dd;padding:.35rem .75rem;font-size:.8rem}" +
      "#tj-lmr-native-bar .btn.primary{background:rgba(15,76,58,.85);border-color:rgba(196,165,116,.55)}" +
      "#tj-lmr-native-bar .tj-lmr-n-ar{font-family:Amiri,Scheherazade New,serif;font-size:1.35rem;line-height:1.9;direction:rtl;margin:.4rem 0;color:#f7f0dd}" +
      "#tj-lmr-native-bar .tj-lmr-n-en{font-size:.9rem;color:#c5d0c6;margin:0 0 .4rem}" +
      "#tj-lmr-native-bar audio{width:100%;max-width:28rem;margin:.35rem 0}" +
      ".tj-lmr-live-meter{margin-top:.5rem;padding:.55rem .7rem;border-radius:12px;border:1px solid rgba(196,165,116,.28);background:rgba(13,79,60,.12)}" +
      ".tj-lmr-live-meter .meter-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#c4a574}" +
      ".tj-lmr-live-meter .meter-track{height:.55rem;border-radius:999px;background:rgba(13,79,60,.2);overflow:hidden;margin-top:.35rem}" +
      ".tj-lmr-live-meter .meter-fill{height:100%;width:0%;background:linear-gradient(90deg,#0d4f3c,#1fa67a,#7dff9a);border-radius:999px;transition:width .08s linear}" +
      ".tj-lmr-live-meter.recording .meter-label{color:#e85a5a}" +
      ".tj-lmr-live-meter.recording .meter-fill{background:linear-gradient(90deg,#c81e1e,#f0a030,#7dff9a)}" +
      ".tj-lmr-whisper-box{margin:.55rem 0;padding:.55rem .7rem;border-radius:12px;border:1px dashed rgba(196,165,116,.35);background:rgba(0,0,0,.15)}" +
      ".tj-lmr-whisper-box label{font-size:.85rem;display:flex;gap:.4rem;align-items:flex-start}" +
      "#tj-lmr-n-transcript{width:100%;min-height:3rem;margin-top:.4rem;border-radius:10px;border:1px solid rgba(196,165,116,.3);background:rgba(0,0,0,.25);color:#e8efe9;padding:.45rem;font-size:.85rem}";
    d.head.appendChild(s);
  }

  function dismantle() {
    try {
      stopMeter();
      stopRec(true);
      ["tj-lmr-native-bar", "action-tj-lmr-panel"].forEach(function (id) {
        var el = $(id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
      d.querySelectorAll("[data-lmr-native='1']").forEach(function (el) {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    } catch (e) {}
  }

  function killDupes() {
    var n = 0;
    d.querySelectorAll("#tj-lmr-native-bar").forEach(function (el) {
      n++;
      if (n > 1 && el.parentNode) el.parentNode.removeChild(el);
    });
  }

  function host() {
    if (!isAction()) return null;
    var mount = $("cs-mount");
    var scope = mount || d;
    var ids = ["tj-lmr-native-root", "tj-lmr", "tj-lmr-panel", "tj-deep-studio"];
    for (var i = 0; i < ids.length; i++) {
      var el = scope.querySelector ? scope.querySelector("#" + ids[i]) : $(ids[i]);
      if (el) return el;
    }
    if (mount && (
      mount.getAttribute("data-cs-mounted") === "action" ||
      (mount.querySelector && (mount.querySelector("#tab-action") || mount.querySelector("[data-rrra-hub='action']")))
    )) {
      /* create dedicated root at end of mount so LMR always has a home on Action */
      var root = $("tj-lmr-native-root");
      if (!root) {
        root = d.createElement("div");
        root.id = "tj-lmr-native-root";
        root.setAttribute("data-lmr-host", "1");
        mount.appendChild(root);
      }
      return root;
    }
    return null;
  }

  function paintUI(h) {
    if (!h || !isAction()) return null;
    ensureStyles();
    killDupes();
    var bar = $("tj-lmr-native-bar");
    if (bar) {
      ensureMeterUI();
      return bar;
    }
    bar = d.createElement("div");
    bar.id = "tj-lmr-native-bar";
    bar.setAttribute("data-lmr-native", "1");
    bar.innerHTML =
      '<p class="tj-lmr-native-kicker">LMR · Action only</p>' +
      '<p class="tj-lmr-native-disc">Pull → Play master (Ḥuṣarī) → Whisper along → Record → Score. Educational proxy only — not a qāriʾ grade. Full atelier: <a href="/craft/tajweed/" style="color:#d4b483">/craft/tajweed/</a></p>' +
      '<div class="tj-lmr-native-row">' +
      '<label>Sūrah <input id="tj-lmr-n-surah" type="number" min="1" max="114" value="1"/></label>' +
      '<label>Āyah <input id="tj-lmr-n-ayah" type="number" min="1" value="1"/></label>' +
      '<button type="button" class="btn primary" id="tj-lmr-n-pull">Pull āyah</button>' +
      "</div>" +
      '<p id="tj-lmr-n-ar" class="tj-lmr-n-ar" dir="rtl" lang="ar"></p>' +
      '<p id="tj-lmr-n-en" class="tj-lmr-n-en"></p>' +
      '<div class="tj-lmr-native-row">' +
      '<button type="button" class="btn primary" id="tj-lmr-n-play">▶ Play master</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-rec">● Record</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-stop">Stop</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-user-play">Play take</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-score">★ Score vs master</button>' +
      "</div>" +
      '<div class="tj-lmr-whisper-box">' +
      '<label><input type="checkbox" id="tj-lmr-n-whispered"/> I whispered once with the master audio (practice, not a grade)</label>' +
      '<div class="tj-lmr-native-row" style="margin-top:.45rem">' +
      '<button type="button" class="btn" id="tj-lmr-n-wsp-load">⬇ Load Whisper-tiny (device cache)</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-wsp-transcribe">🎙 Transcribe take</button>' +
      "</div>" +
      '<textarea id="tj-lmr-n-transcript" placeholder="Optional on-device transcript appears here…" readonly></textarea>' +
      '<p style="font-size:.75rem;color:#aeb8b0;margin:.3rem 0 0">Whisper-tiny is optional. First load needs network; later uses device cache. Educational only.</p>' +
      "</div>" +
      '<audio id="tj-lmr-n-master" controls preload="metadata"></audio>' +
      '<audio id="tj-lmr-n-user" controls preload="metadata" hidden></audio>' +
      '<div class="tj-lmr-live-meter"><div class="meter-label">Input level <span id="tj-lmr-meter-pct">0%</span></div><div class="meter-track"><div class="meter-fill" id="tj-lmr-meter-fill"></div></div></div>' +
      '<p id="tj-lmr-n-status" class="tj-lmr-n-status">Ready · Ḥuṣarī / fallback · educational only</p>' +
      '<p id="tj-lmr-n-scoreline" class="tj-lmr-n-scoreline" style="font-size:.82rem;color:#c5d0c6"></p>';
    h.appendChild(bar);
    wire(bar);
    return bar;
  }

  function wire(bar) {
    if (!bar || bar.__lmrWired) return;
    bar.__lmrWired = true;
    function on(id, fn) {
      var el = $(id);
      if (el) el.addEventListener("click", fn);
    }
    on("tj-lmr-n-pull", pull);
    on("tj-lmr-n-play", playMaster);
    on("tj-lmr-n-rec", startRec);
    on("tj-lmr-n-stop", function () { stopRec(false); });
    on("tj-lmr-n-user-play", playUser);
    on("tj-lmr-n-score", score);
    on("tj-lmr-n-wsp-load", loadWhisper);
    on("tj-lmr-n-wsp-transcribe", transcribeTake);
    var cb = $("tj-lmr-n-whispered");
    if (cb) {
      cb.addEventListener("change", function () {
        state.whispered = !!cb.checked;
        if (state.whispered) status("Whisper-along noted · educational only");
      });
    }
  }

  function pull() {
    if (!isAction()) return;
    var s = parseInt(($("tj-lmr-n-surah") || {}).value || "1", 10) || 1;
    var a = parseInt(($("tj-lmr-n-ayah") || {}).value || "1", 10) || 1;
    state.surah = Math.max(1, Math.min(114, s));
    state.ayah = Math.max(1, a);
    status("Fetching āyah…");
    var api = "https://api.alquran.cloud/v1/ayah/" + state.surah + ":" + state.ayah + "/editions/quran-uthmani,en.sahih";
    fetch(api)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var arr = (data && data.data) || [];
        var ar = "", en = "";
        arr.forEach(function (ed) {
          if (ed && ed.edition && ed.edition.identifier === "quran-uthmani") ar = ed.text || "";
          if (ed && ed.edition && String(ed.edition.identifier || "").indexOf("en") === 0) en = ed.text || en;
        });
        if (!ar && arr[0]) ar = arr[0].text || "";
        if (!en && arr[1]) en = arr[1].text || "";
        state.ar = ar;
        state.en = en;
        if ($("tj-lmr-n-ar")) $("tj-lmr-n-ar").textContent = ar;
        if ($("tj-lmr-n-en")) $("tj-lmr-n-en").textContent = en;
        state.masterUrl = everyAyahUrl(state.surah, state.ayah);
        var master = $("tj-lmr-n-master");
        if (master) {
          master.src = state.masterUrl;
          master.onloadedmetadata = function () {
            state.masterDur = master.duration || 0;
          };
        }
        status("Ready · play master, whisper along, then record · educational only");
      })
      .catch(function () {
        status("Could not load verse — check network. Educational only.");
      });
  }

  function playMaster() {
    if (!isAction()) return;
    var master = $("tj-lmr-n-master");
    if (!master || !master.src) {
      status("Pull āyah first");
      return;
    }
    try {
      master.play();
      status("Playing master · whisper along (practice)");
    } catch (e) {
      status("Play blocked — tap again after interaction");
    }
  }

  function startRec() {
    if (!isAction()) return;
    if (!w.navigator || !w.navigator.mediaDevices || !w.navigator.mediaDevices.getUserMedia) {
      status("Mic not available");
      return;
    }
    if (state.rec && state.rec.state === "recording") {
      status("Already recording");
      return;
    }
    state.chunks = [];
    w.navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        state.stream = stream;
        startMeter(stream); /* same stream → real level meter */
        try {
          state.rec = new MediaRecorder(stream);
        } catch (e) {
          status("MediaRecorder not supported");
          stopMeter();
          stream.getTracks().forEach(function (t) { t.stop(); });
          return;
        }
        state.t0 = Date.now();
        state.rec.ondataavailable = function (ev) {
          if (ev.data && ev.data.size) state.chunks.push(ev.data);
        };
        state.rec.onstop = function () {
          try {
            stream.getTracks().forEach(function (t) { t.stop(); });
          } catch (e2) {}
          state.stream = null;
          stopMeter();
          if (!state.chunks.length) {
            status("No audio captured");
            return;
          }
          state.userBlob = new Blob(state.chunks, { type: "audio/webm" });
          if (state.userUrl) URL.revokeObjectURL(state.userUrl);
          state.userUrl = URL.createObjectURL(state.userBlob);
          var u = $("tj-lmr-n-user");
          if (u) {
            u.hidden = false;
            u.src = state.userUrl;
          }
          status("Take saved on device · nothing uploaded · score when ready");
        };
        state.rec.start();
        status("Recording… watch input level");
      })
      .catch(function () {
        status("Mic permission denied");
      });
  }

  function stopRec(silent) {
    try {
      if (state.rec && state.rec.state === "recording") state.rec.stop();
    } catch (e) {}
    stopMeter();
    if (!silent) status("Stopped");
  }

  function playUser() {
    if (!isAction()) return;
    var u = $("tj-lmr-n-user");
    if (!u || !u.src) {
      status("Record first");
      return;
    }
    try { u.play(); } catch (e) {}
  }

  function score() {
    if (!isAction()) return;
    var master = $("tj-lmr-n-master");
    var user = $("tj-lmr-n-user");
    if (!user || !user.src) {
      status("Record a take first");
      return;
    }
    var md = state.masterDur || (master && master.duration) || 0;
    var ud = (user && user.duration) || 0;
    if (!ud || !isFinite(ud)) ud = Math.max(0.5, (Date.now() - state.t0) / 1000);
    var pct = md > 0 ? Math.round((Math.min(ud, md) / Math.max(ud, md)) * 100) : 50;
    var whisperNote = state.whispered ? " · whisper-along noted" : "";
    var note =
      "Educational proxy ~" + pct + "% length match" + whisperNote + " · not a qāriʾ grade · learn with a teacher";
    if ($("tj-lmr-n-scoreline")) $("tj-lmr-n-scoreline").textContent = note;
    status(note);
  }

  /* ---- Optional Whisper-tiny (Xenova) ---- */
  function loadWhisper() {
    if (!isAction()) return;
    status("Loading Whisper-tiny… first time may take a minute");
    var ta = $("tj-lmr-n-transcript");
    if (ta) ta.value = "";

    function afterPipeline(pipe) {
      w.__clarityWhisperPipeline = pipe;
      status("Whisper-tiny ready on device · record a take, then Transcribe");
    }

    if (w.__clarityWhisperPipeline) {
      afterPipeline(w.__clarityWhisperPipeline);
      return;
    }

    function bootTransformers(mod) {
      try {
        if (mod.env) {
          mod.env.allowLocalModels = false;
          mod.env.useBrowserCache = true;
        }
        return mod.pipeline("automatic-speech-recognition", "Xenova/whisper-tiny", {
          quantized: true
        }).then(afterPipeline);
      } catch (e) {
        status("Whisper init failed · use whisper-along checkbox instead");
      }
    }

    if (w.transformers && w.transformers.pipeline) {
      bootTransformers(w.transformers);
      return;
    }

    var s = d.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js";
    s.async = true;
    s.onload = function () {
      if (w.transformers) bootTransformers(w.transformers);
      else status("Transformers loaded but pipeline missing");
    };
    s.onerror = function () {
      status("Could not load Whisper CDN · network or blocked · practice whisper-along still works");
    };
    d.head.appendChild(s);
  }

  function transcribeTake() {
    if (!isAction()) return;
    if (!state.userBlob) {
      status("Record a take first");
      return;
    }
    if (!w.__clarityWhisperPipeline) {
      status("Load Whisper-tiny first (or use whisper-along only)");
      return;
    }
    status("Transcribing on device…");
    var reader = new FileReader();
    reader.onload = function () {
      var buf = reader.result;
      w.__clarityWhisperPipeline(buf, {
        language: "arabic",
        task: "transcribe",
        chunk_length_s: 15
      })
        .then(function (out) {
          var text = (out && (out.text || out)) || "";
          if (typeof text !== "string") text = JSON.stringify(text);
          var ta = $("tj-lmr-n-transcript");
          if (ta) ta.value = text.trim();
          status("Transcript ready · educational only · verify with a teacher");
        })
        .catch(function (e) {
          console.warn(e);
          status("Transcribe failed · try shorter take or whisper-along only");
        });
    };
    reader.readAsArrayBuffer(state.userBlob);
  }

  function boot() {
    if (!isAction()) {
      dismantle();
      return;
    }
    ensureStyles();
    killDupes();
    var h = host();
    if (!h) return;
    paintUI(h);
    if (!state.ar) setTimeout(function () { if (isAction()) pull(); }, 200);
  }

  function onMounted(ev) {
    var tab = "";
    try {
      tab = String((ev && ev.detail && ev.detail.tab) || activeTab() || "").toLowerCase();
    } catch (e) {}
    if (tab && tab !== "action") {
      dismantle();
      return;
    }
    if (tab === "action" || isAction()) {
      setTimeout(boot, 40);
      setTimeout(boot, 400);
    } else {
      dismantle();
    }
  }

  d.addEventListener("clarity:tab-mounted", onMounted);
  w.addEventListener("clarity:tab-mounted", onMounted);

  function initial() {
    if (isAction()) {
      setTimeout(boot, 60);
      setTimeout(boot, 450);
    } else {
      dismantle();
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", initial);
  else initial();
})(window, document);
