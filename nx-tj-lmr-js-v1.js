(function(){
  "use strict";
  var LMR_KEY = "clarity_tj_lmr_loops";
  var LOG_KEY = "clarity_tj_lmr_sessions_v1";

  /* Rule → authentic example āyāt (Ḥafs). Audio: EveryAyah Ḥuṣarī. Text: AlQuran.cloud */
  var RULE_EXAMPLES = {
    makharij: [
      { surah:1, ayah:1, tip:"Open throat & lips on basmalah letters." },
      { surah:112, ayah:1, tip:"Clear qāf and ḥāʾ makhārij in Al-Ikhlāṣ." }
    ],
    izhar: [
      { surah:2, ayah:62, tip:"Nūn before ء — keep nūn clear (iẓhār)." },
      { surah:1, ayah:7, tip:"Tanwīn / nūn clarity near throat letters." }
    ],
    ikhfa: [
      { surah:2, ayah:4, tip:"Nūn before soft letters — light ghunnah, hidden nūn." },
      { surah:36, ayah:1, tip:"Listen for veiled nūn with nasal cloud." }
    ],
    idgham: [
      { surah:2, ayah:5, tip:"Merge nūn into following letter with/without ghunnah." },
      { surah:1, ayah:7, tip:"Feel merge into rāʾ / related idghām contexts." }
    ],
    iqlab: [
      { surah:2, ayah:4, tip:"Nūn before bāʾ → light mīm + ghunnah." },
      { surah:3, ayah:119, tip:"Iqlāb practice — soft labial shift." }
    ],
    qalqalah: [
      { surah:23, ayah:1, tip:"قَدْ أَفْلَحَ — bounce on dāl (qalqalah)." },
      { surah:112, ayah:1, tip:"Qāf bounce quality when sākin." },
      { surah:113, ayah:1, tip:"Qalqalah on ق in Al-Falaq." }
    ],
    ghunnah: [
      { surah:112, ayah:1, tip:"Mīm/nūn mushaddadah — two counts of ghunnah." },
      { surah:1, ayah:2, tip:"Nasal hold on doubled letters." }
    ],
    madd: [
      { surah:1, ayah:1, tip:"Natural madd (2 counts) on long vowels." },
      { surah:1, ayah:7, tip:"Feel elongated vowels vs short." },
      { surah:55, ayah:1, tip:"Madd practice in Ar-Raḥmān." }
    ],
    waqf: [
      { surah:1, ayah:7, tip:"Stop where meaning stays safe at end of āyah." },
      { surah:112, ayah:4, tip:"Clean waqf at sūrah end." }
    ]
  };

  var RULE_META = {
    makharij:{ name:"Makhārij", ar:"مخارج" },
    izhar:{ name:"Iẓhār", ar:"إظهار" },
    ikhfa:{ name:"Ikhfāʾ", ar:"إخفاء" },
    idgham:{ name:"Idghām", ar:"إدغام" },
    iqlab:{ name:"Iqlāb", ar:"إقلاب" },
    qalqalah:{ name:"Qalqalah", ar:"قلقلة" },
    ghunnah:{ name:"Ghunnah", ar:"غُنّة" },
    madd:{ name:"Madd", ar:"مدّ" },
    waqf:{ name:"Waqf", ar:"وقف" }
  };

  var state = {
    mode: "verse",
    surah: 1, ayah: 1, ar: "", en: "", ref: "",
    ruleId: "qalqalah", ruleIdx: 0, ruleTip: "",
    audioUrl: "",
    mediaRec: null, chunks: [], userBlob: null, userBlobUrl: null, recording: false
  };

  function $(id){ return document.getElementById(id); }

  function everyAyahUrl(surah, ayah){
    var s = String(surah).padStart(3,"0");
    var a = String(ayah).padStart(3,"0");
    return "https://everyayah.com/data/Husary_128kbps/"+s+a+".mp3";
  }

  function setMode(mode){
    state.mode = mode === "rule" ? "rule" : "verse";
    document.querySelectorAll(".tj-lmr-mode").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-mode") === state.mode);
    });
    var tv = $("tj-lmr-toolbar-verse");
    var tr = $("tj-lmr-toolbar-rule");
    if (tv) tv.hidden = state.mode !== "verse";
    if (tr) tr.hidden = state.mode !== "rule";
    if (state.mode === "rule") loadRuleExample();
    else fetchAyah();
  }

  function setStep(n){
    n = String(n);
    document.querySelectorAll(".tj-lmr-step").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-step") === n);
    });
    [1,2,3,4].forEach(function(i){
      var p = $("tj-lmr-step"+i);
      if (p) p.hidden = String(i) !== n;
    });
    if (n === "2") {
      var a2 = $("tj-lmr-ar2");
      if (a2) a2.textContent = state.ar || "…";
    }
    if (n === "3") renderLog();
    if (n === "4") renderFocusChips();
  }

  function applyLoaded(){
    var meta = $("tj-lmr-meta");
    var arEl = $("tj-lmr-ar");
    var enEl = $("tj-lmr-en");
    if (arEl) arEl.textContent = state.ar || "—";
    if (enEl) enEl.textContent = state.en || "";
    /* Persistent Read panel */
    var arR = $("tj-lmr-ar-read");
    var enR = $("tj-lmr-en-read");
    var metaR = $("tj-lmr-meta-read");
    if (arR) arR.textContent = state.ar || "—";
    if (enR) enR.textContent = state.en || "";
    if (metaR && meta) { /* filled below after meta set */ }
    if (meta) {
      var extra = state.mode === "rule"
        ? (" · Rule: " + (RULE_META[state.ruleId]||{}).name + " (" + (RULE_META[state.ruleId]||{}).ar + ")" + (state.ruleTip ? " — " + state.ruleTip : ""))
        : "";
      meta.textContent = (state.ref || "") + " · Ḥafs · Ḥuṣarī audio" + extra;
    var metaR2 = $("tj-lmr-meta-read"); if (metaR2 && meta) metaR2.textContent = meta.textContent;
    }
    var a2 = $("tj-lmr-ar2");
    if (a2) a2.textContent = state.ar || "…";
    var audio = $("tj-lmr-master-audio");
    if (audio) { audio.src = state.audioUrl; try { audio.load(); } catch(e){} }
    var playBtn = $("tj-lmr-play-master");
    if (playBtn) playBtn.disabled = !state.audioUrl;
    var link = $("tj-lmr-quran-link");
    if (link) link.href = "https://quran.com/"+state.surah+"/"+state.ayah;
  }

  async function fetchAyahRef(surah, ayah, tip){
    var meta = $("tj-lmr-meta");
    if (meta) meta.textContent = "Loading…";
    var playBtn = $("tj-lmr-play-master");
    if (playBtn) playBtn.disabled = true;
    try {
      var ref = surah + ":" + ayah;
      var [arRes, enRes] = await Promise.all([
        fetch("https://api.alquran.cloud/v1/ayah/"+ref+"/quran-uthmani"),
        fetch("https://api.alquran.cloud/v1/ayah/"+ref+"/en.sahih")
      ]);
      var arJ = await arRes.json();
      var enJ = await enRes.json();
      if (!arJ.data || !arJ.data.text) throw new Error("No data");
      state.surah = surah;
      state.ayah = ayah;
      state.ar = arJ.data.text;
      state.en = (enJ.data && enJ.data.text) || "";
      state.ref = "Qur’an " + ref;
      state.ruleTip = tip || "";
      state.audioUrl = everyAyahUrl(surah, ayah);
      applyLoaded();
    } catch (e) {
      if (meta) meta.textContent = "Could not load — check connection, then retry.";
      state.ar = "—"; state.en = "";
      applyLoaded();
    }
  }

  function fetchAyah(){
    var surah = parseInt(($("tj-lmr-surah")||{}).value || "1", 10);
    var ayah = parseInt(($("tj-lmr-ayah")||{}).value || "1", 10);
    if (!ayah || ayah < 1) ayah = 1;
    return fetchAyahRef(surah, ayah, "");
  }

  function loadRuleExample(){
    var ruleId = ($("tj-lmr-rule")||{}).value || "qalqalah";
    state.ruleId = ruleId;
    var list = RULE_EXAMPLES[ruleId] || RULE_EXAMPLES.qalqalah;
    if (state.ruleIdx >= list.length) state.ruleIdx = 0;
    var ex = list[state.ruleIdx];
    if ($("tj-lmr-surah")) $("tj-lmr-surah").value = String(ex.surah);
    if ($("tj-lmr-ayah")) $("tj-lmr-ayah").value = String(ex.ayah);
    return fetchAyahRef(ex.surah, ex.ayah, ex.tip || "");
  }

  function nextRuleExample(){
    var ruleId = ($("tj-lmr-rule")||{}).value || state.ruleId;
    var list = RULE_EXAMPLES[ruleId] || [];
    state.ruleIdx = (state.ruleIdx + 1) % Math.max(list.length, 1);
    loadRuleExample();
  }

  function randomShort(){
    var picks = [[1,1],[1,2],[1,7],[112,1],[112,2],[113,1],[114,1],[67,1],[18,1],[36,1],[55,1],[78,1],[23,1]];
    var p = picks[Math.floor(Math.random()*picks.length)];
    if ($("tj-lmr-surah")) $("tj-lmr-surah").value = String(p[0]);
    if ($("tj-lmr-ayah")) $("tj-lmr-ayah").value = String(p[1]);
    fetchAyah();
  }

  function playMaster(){
    var audio = $("tj-lmr-master-audio");
    if (!audio) return;
    if (!audio.src && state.audioUrl) audio.src = state.audioUrl;
    try { audio.currentTime = 0; var p = audio.play(); if (p && p.catch) p.catch(function(){}); } catch(e){}
  }

  async function startRec(){
    var status = $("tj-lmr-rec-status");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (status) status.textContent = "Microphone not available in this browser.";
      return;
    }
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      try {
        if (typeof window.nurosStartLmrMeter === "function") window.nurosStartLmrMeter(stream);
        else {
          /* inline meter fallback */
          window.__lmrMeterStream = stream;
          var step = document.getElementById("tj-lmr-step3") || document.getElementById("tj-lmr-step2");
          if (step) {
            var meter = step.querySelector(".tj-lmr-live-meter");
            if (!meter) {
              meter = document.createElement("div");
              meter.className = "tj-lmr-live-meter";
              meter.innerHTML = '<div class="meter-label">Input level</div><div class="meter-track"><div class="meter-fill" id="tj-lmr-meter-fill"></div></div>';
              step.appendChild(meter);
            }
            meter.classList.add("recording");
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var src = ctx.createMediaStreamSource(stream);
            var an = ctx.createAnalyser();
            an.fftSize = 512;
            src.connect(an);
            var data = new Uint8Array(an.fftSize);
            window.__lmrMeterCtx = ctx;
            window.__lmrMeterAn = an;
            if (window.__lmrMeterRaf) cancelAnimationFrame(window.__lmrMeterRaf);
            (function tick(){
              if (!window.__lmrMeterAn) return;
              window.__lmrMeterAn.getByteTimeDomainData(data);
              var sum = 0;
              for (var i = 0; i < data.length; i++) { var v = (data[i]-128)/128; sum += v*v; }
              var pct = Math.min(100, Math.round(Math.sqrt(sum/data.length)*400));
              var fill = document.getElementById("tj-lmr-meter-fill");
              if (fill) fill.style.width = pct + "%";
              window.__lmrMeterRaf = requestAnimationFrame(tick);
            })();
          }
        }
      } catch (meterErr) { console.warn("meter", meterErr); }
      state.chunks = [];
      var mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" :
                 (MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" :
                 (MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : ""));
      state.mediaRec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      state.mediaRec.ondataavailable = function(ev){ if (ev.data && ev.data.size) state.chunks.push(ev.data); };
      state.mediaRec.onstop = function(){
        stream.getTracks().forEach(function(t){ t.stop(); });
        state.userBlob = new Blob(state.chunks, { type: state.mediaRec.mimeType || "audio/webm" });
        if (state.userBlobUrl) { try { URL.revokeObjectURL(state.userBlobUrl); } catch(e){} }
        state.userBlobUrl = URL.createObjectURL(state.userBlob);
        var ua = $("tj-lmr-user-audio");
        if (ua) { ua.src = state.userBlobUrl; ua.style.display = "block"; }
        var play = $("tj-lmr-rec-play"); if (play) play.disabled = false;
        var sc = $("tj-lmr-score-btn"); if (sc) sc.disabled = false;
        if (status) { status.textContent = "Recording saved · play or Score vs master"; status.classList.remove("rec"); }
        state.recording = false;
        var btn = $("tj-lmr-rec-btn"); if (btn) btn.disabled = false;
        var stop = $("tj-lmr-rec-stop"); if (stop) stop.disabled = true;
      };
      state.mediaRec.start();
      state.recording = true;
      if (status) { status.textContent = "Recording… whisper your practice now"; status.classList.add("rec"); }
      var btn = $("tj-lmr-rec-btn"); if (btn) btn.disabled = true;
      var stop = $("tj-lmr-rec-stop"); if (stop) stop.disabled = false;
      var sc = $("tj-lmr-score-btn"); if (sc) sc.disabled = true;
    } catch (e) {
      if (status) status.textContent = "Mic permission denied or unavailable.";
    }
  }

  function stopRec(){
    if (state.mediaRec && state.recording) {
      try { state.mediaRec.stop(); } catch(e){}
    }
    try {
      if (window.__lmrMeterRaf) cancelAnimationFrame(window.__lmrMeterRaf);
      window.__lmrMeterAn = null;
      if (window.__lmrMeterCtx) { window.__lmrMeterCtx.close(); window.__lmrMeterCtx = null; }
      document.querySelectorAll(".tj-lmr-live-meter").forEach(function(m){ m.classList.remove("recording"); });
      var fill = document.getElementById("tj-lmr-meter-fill");
      if (fill) fill.style.width = "0%";
      if (typeof window.nurosStopLmrMeter === "function") window.nurosStopLmrMeter();
    } catch(e){}
  }

  function playUser(){
    var ua = $("tj-lmr-user-audio");
    if (!ua || !ua.src) return;
    try { ua.currentTime = 0; ua.play(); } catch(e){}
  }

  /* --- Scoring: duration + energy-envelope correlation (practice helper) --- */
  function downsampleEnvelope(channelData, buckets){
    var n = channelData.length;
    var out = new Float32Array(buckets);
    var step = Math.floor(n / buckets) || 1;
    for (var i = 0; i < buckets; i++) {
      var start = i * step;
      var end = Math.min(n, start + step);
      var sum = 0, c = 0;
      for (var j = start; j < end; j++) { sum += Math.abs(channelData[j]); c++; }
      out[i] = c ? sum / c : 0;
    }
    // normalize
    var max = 0;
    for (var k = 0; k < buckets; k++) if (out[k] > max) max = out[k];
    if (max > 1e-8) for (var k2 = 0; k2 < buckets; k2++) out[k2] /= max;
    return out;
  }

  function corr(a, b){
    var n = Math.min(a.length, b.length);
    if (!n) return 0;
    var ma = 0, mb = 0;
    for (var i = 0; i < n; i++) { ma += a[i]; mb += b[i]; }
    ma /= n; mb /= n;
    var num = 0, da = 0, db = 0;
    for (var j = 0; j < n; j++) {
      var xa = a[j] - ma, xb = b[j] - mb;
      num += xa * xb; da += xa * xa; db += xb * xb;
    }
    if (da < 1e-12 || db < 1e-12) return 0;
    return Math.max(-1, Math.min(1, num / Math.sqrt(da * db)));
  }

  async function decodeAudioBlobOrUrl(src){
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var buf;
    if (typeof src === "string") {
      var res = await fetch(src, { mode: "cors" });
      if (!res.ok) throw new Error("fetch audio");
      buf = await res.arrayBuffer();
    } else {
      buf = await src.arrayBuffer();
    }
    var audioBuf = await ctx.decodeAudioData(buf.slice(0));
    try { ctx.close(); } catch(e){}
    return audioBuf;
  }

  async function scoreVsMaster(){
    var status = $("tj-lmr-rec-status");
    var card = $("tj-lmr-score-card");
    if (!state.userBlob || !state.audioUrl) {
      if (status) status.textContent = "Need master audio + your recording first.";
      return;
    }
    if (status) status.textContent = "Scoring (on device)…";
    try {
      var masterBuf, userBuf;
      try {
        masterBuf = await decodeAudioBlobOrUrl(state.audioUrl);
      } catch (e1) {
        // CORS may block EveryAyah — fall back to duration-only via element
        masterBuf = null;
      }
      userBuf = await decodeAudioBlobOrUrl(state.userBlob);

      var userDur = userBuf.duration;
      var masterDur = masterBuf ? masterBuf.duration : 0;
      // if master decode failed, try HTMLAudioElement duration
      if (!masterDur) {
        var el = $("tj-lmr-master-audio");
        if (el && isFinite(el.duration) && el.duration > 0) masterDur = el.duration;
      }
      if (!masterDur) masterDur = userDur; // last resort

      var lenRatio = Math.min(userDur, masterDur) / Math.max(userDur, masterDur);
      var lenScore = Math.round(lenRatio * 100);

      var energyScore = 50;
      var timeScore = Math.round(lenRatio * 100);
      if (masterBuf) {
        var mCh = masterBuf.getChannelData(0);
        var uCh = userBuf.getChannelData(0);
        var buckets = 48;
        var envM = downsampleEnvelope(mCh, buckets);
        var envU = downsampleEnvelope(uCh, buckets);
        var c = corr(envM, envU);
        energyScore = Math.round(((c + 1) / 2) * 100); // map -1..1 → 0..100
        // timing: also compare peak positions roughly
        var peakM = 0, peakU = 0, iM = 0, iU = 0;
        for (var i = 0; i < buckets; i++) {
          if (envM[i] > peakM) { peakM = envM[i]; iM = i; }
          if (envU[i] > peakU) { peakU = envU[i]; iU = i; }
        }
        var peakDiff = Math.abs(iM - iU) / buckets;
        timeScore = Math.round((1 - peakDiff) * lenRatio * 100);
      }

      var overall = Math.round(0.4 * lenScore + 0.35 * energyScore + 0.25 * timeScore);
      overall = Math.max(0, Math.min(100, overall));

      if (card) card.hidden = false;
      var val = $("tj-lmr-score-val");
      if (val) val.textContent = overall + " / 100";
      function setBar(id, pct){
        var el = $(id); if (el) el.style.width = Math.max(0, Math.min(100, pct)) + "%";
      }
      setBar("tj-lmr-bar-time", timeScore);
      setBar("tj-lmr-bar-energy", energyScore);
      setBar("tj-lmr-bar-len", lenScore);

      var note = $("tj-lmr-score-note");
      var msg = "";
      if (overall >= 80) msg = "Strong alignment — still verify madd/ghunnah with a teacher.";
      else if (overall >= 60) msg = "Decent timing/energy match. Replay master, then one focused retry.";
      else msg = "Try matching length first: listen once fully, then whisper with the same pace.";
      if (!masterBuf) msg += " (Master waveform limited by network — length used as primary.)";
      if (note) note.textContent = msg;

      logSession({
        score: overall,
        lenScore: lenScore,
        energyScore: energyScore,
        timeScore: timeScore,
        mode: state.mode,
        ref: state.ref,
        ruleId: state.mode === "rule" ? state.ruleId : "",
        userDur: Math.round(userDur * 10) / 10,
        masterDur: Math.round(masterDur * 10) / 10
      });

      if (status) status.textContent = "Scored · " + overall + "/100 · logged on this device";
    } catch (e) {
      if (status) status.textContent = "Could not score (audio decode). Play both, then retry.";
      console.warn("score error", e);
    }
  }

  function loadLog(){
    try { return JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch(e){ return []; }
  }
  function saveLog(arr){
    try { localStorage.setItem(LOG_KEY, JSON.stringify(arr.slice(0, 40))); } catch(e){}
  }
  function logSession(entry){
    var arr = loadLog();
    arr.unshift(Object.assign({
      id: "s_" + Date.now(),
      ts: new Date().toISOString()
    }, entry));
    saveLog(arr);
    renderLog();
  }
  function renderLog(){
    var host = $("tj-lmr-log-list");
    if (!host) return;
    var arr = loadLog();
    if (!arr.length) { host.textContent = "No sessions yet."; return; }
    host.innerHTML = arr.slice(0, 12).map(function(e){
      var when = "";
      try { when = new Date(e.ts).toLocaleString(undefined,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); } catch(err){}
      var label = e.ref || "Practice";
      if (e.ruleId && RULE_META[e.ruleId]) label += " · " + RULE_META[e.ruleId].name;
      return '<div class="tj-lmr-log-item"><strong>'+ (e.score != null ? e.score+"/100" : "—") +'</strong> · '+label+' <span class="tj-lmr-log-when">'+when+'</span></div>';
    }).join("");
  }

  function renderFocusChips(){
    var host = $("tj-lmr-focus-chips");
    if (!host) return;
    var rules = [
      ["makharij","Makhārij"],["izhar","Iẓhār"],["ikhfa","Ikhfāʾ"],["idgham","Idghām"],
      ["iqlab","Iqlāb"],["qalqalah","Qalqalah"],["ghunnah","Ghunnah"],["madd","Madd"],["waqf","Waqf"]
    ];
    var cur = host.getAttribute("data-focus") || "";
    host.innerHTML = rules.map(function(r){
      return '<button type="button" data-focus="'+r[0]+'" class="'+(cur===r[0]?'on':'')+'">'+r[1]+'</button>';
    }).join("");
    host.querySelectorAll("button").forEach(function(b){
      b.addEventListener("click", function(){
        host.setAttribute("data-focus", b.getAttribute("data-focus"));
        host.querySelectorAll("button").forEach(function(x){ x.classList.toggle("on", x===b); });
        var note = $("tj-lmr-focus-note");
        if (note) note.textContent = "Focus today: " + b.textContent + " — one rule, one āyah.";
        var rid = b.getAttribute("data-focus");
        if ($("tj-lmr-rule")) $("tj-lmr-rule").value = rid;
        setMode("rule");
        var tile = document.querySelector('.tj-rule-tile[data-rule="'+rid+'"]');
        if (tile) tile.click();
      });
    });
  }

  function markLoopDone(){
    var today = new Date().toDateString();
    var n = 0;
    try {
      var raw = localStorage.getItem(LMR_KEY);
      var obj = raw ? JSON.parse(raw) : {};
      if (obj.day !== today) obj = { day: today, count: 0 };
      obj.count = (obj.count || 0) + 1;
      n = obj.count;
      localStorage.setItem(LMR_KEY, JSON.stringify(obj));
    } catch(e){ n = 1; }
    var el = $("tj-lmr-loop-stat");
    if (el) el.textContent = "Loops today: " + n + " · may Allah accept";
  }

  function wire(){
    if (!$("tj-lmr")) return;
    document.querySelectorAll(".tj-lmr-step").forEach(function(b){
      b.addEventListener("click", function(){ setStep(b.getAttribute("data-step")); });
    });
    document.querySelectorAll(".tj-lmr-mode").forEach(function(b){
      b.addEventListener("click", function(){ setMode(b.getAttribute("data-mode")); });
    });
    var f = $("tj-lmr-fetch"); if (f) f.addEventListener("click", fetchAyah);
    var r = $("tj-lmr-random"); if (r) r.addEventListener("click", randomShort);
    var fr = $("tj-lmr-fetch-rule"); if (fr) fr.addEventListener("click", function(){ state.ruleIdx = 0; loadRuleExample(); });
    var nr = $("tj-lmr-rule-next"); if (nr) nr.addEventListener("click", nextRuleExample);
    var ruleSel = $("tj-lmr-rule");
    if (ruleSel) ruleSel.addEventListener("change", function(){ state.ruleIdx = 0; loadRuleExample(); });
    var p1 = $("tj-lmr-play-master"); if (p1) p1.addEventListener("click", playMaster);
    var p2 = $("tj-lmr-play-master2"); if (p2) p2.addEventListener("click", playMaster);
    var p3 = $("tj-lmr-play-master3"); if (p3) p3.addEventListener("click", playMaster);
    var rb = $("tj-lmr-rec-btn"); if (rb) rb.addEventListener("click", startRec);
    var rs = $("tj-lmr-rec-stop"); if (rs) rs.addEventListener("click", stopRec);
    var rp = $("tj-lmr-rec-play"); if (rp) rp.addEventListener("click", playUser);
    var sc = $("tj-lmr-score-btn"); if (sc) sc.addEventListener("click", scoreVsMaster);
    var md = $("tj-lmr-mark-done"); if (md) md.addEventListener("click", markLoopDone);
    setTimeout(function(){
      if ($("tj-lmr-surah")) $("tj-lmr-surah").value = "1";
      if ($("tj-lmr-ayah")) $("tj-lmr-ayah").value = "1";
      fetchAyah();
      renderLog();
    }, 200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(wire, 120); });
  else setTimeout(wire, 120);
  window.addEventListener("load", function(){ setTimeout(wire, 400); });
})();