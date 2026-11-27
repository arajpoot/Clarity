/*! companion-action-lmr-native-v1.js · N3 action-only scope
 * LMR mounts ONLY on Action tab — removed from reminder/reality/reflection/notes/about
 * Pull · Play Ḥuṣarī · Record · Score
 * Educational only — not a qāriʾ grade — not a fatwa
 */
(function (w, d) {
  "use strict";
  w.__CLARITY_LMR_NATIVE_V1__ = true;
  w.__CLARITY_LMR_NATIVE_V3__ = true; /* action-only */

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
    masterDur: 0
  };

  function $(id) {
    return d.getElementById(id);
  }

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

  function isAction() {
    return activeTab() === "action";
  }

  function status(msg) {
    var el = $("tj-lmr-n-status");
    if (el) el.textContent = msg || "";
  }

  function everyAyahUrl(surah, ayah) {
    var s = String(surah).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3";
  }

  /** Remove any LMR chrome that leaked outside Action */
  function dismantle() {
    try {
      ["tj-lmr-native-bar", "action-tj-lmr-panel"].forEach(function (id) {
        var el = $(id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
      d.querySelectorAll("#tj-lmr-native-bar, .tj-lmr-native-grid, [data-lmr-native='1']").forEach(function (el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
      /* stop mic if user left Action mid-record */
      try {
        if (state.rec && state.rec.state === "recording") state.rec.stop();
      } catch (e2) {}
    } catch (e) {}
  }

  function killDupes() {
    var dup = $("action-tj-lmr-panel");
    if (dup && dup.parentNode) dup.parentNode.removeChild(dup);
    d.querySelectorAll("#tj-lmr-native-bar").forEach(function (el, idx) {
      if (idx > 0 && el.parentNode) el.parentNode.removeChild(el);
    });
  }

  /** Host only inside Action-mounted roots — never fall back to random page nodes */
  function host() {
    if (!isAction()) return null;
    var mount = $("cs-mount");
    var scope = mount || d;
    var ids = ["tj-lmr-native-root", "tj-lmr", "tj-lmr-panel", "tj-deep-studio"];
    for (var i = 0; i < ids.length; i++) {
      var el = scope.querySelector ? scope.querySelector("#" + ids[i]) : $(ids[i]);
      if (el) return el;
    }
    /* last resort: only if Action tab body contains a known action marker */
    if (mount && mount.querySelector && (
      mount.querySelector("[data-rrra-hub='action']") ||
      mount.querySelector("#tab-action") ||
      mount.getAttribute("data-cs-mounted") === "action"
    )) {
      var root = $("tj-lmr-native-root");
      if (root) return root;
    }
    return null;
  }

  function paintUI(h) {
    if (!h || !isAction()) return null;
    killDupes();
    var bar = $("tj-lmr-native-bar");
    if (bar) return bar;
    bar = d.createElement("div");
    bar.id = "tj-lmr-native-bar";
    bar.setAttribute("data-lmr-native", "1");
    bar.innerHTML =
      '<div class="tj-lmr-native-grid">' +
      '<p class="tj-lmr-native-kicker">LMR · native mount (Action only)</p>' +
      '<p class="tj-lmr-native-disc">Pull → Play master (Ḥuṣarī) → Record → Score. Educational proxy only — not a qāriʾ grade. Full atelier: <a href="/craft/tajweed/">/craft/tajweed/</a></p>' +
      '<div class="tj-lmr-native-row">' +
      '<label>Sūrah <input id="tj-lmr-n-surah" type="number" min="1" max="114" value="1"/></label> ' +
      '<label>Āyah <input id="tj-lmr-n-ayah" type="number" min="1" value="1"/></label> ' +
      '<button type="button" class="btn primary" id="tj-lmr-n-pull">Pull āyah</button>' +
      "</div>" +
      '<p id="tj-lmr-n-ar" class="tj-lmr-n-ar" dir="rtl" lang="ar"></p>' +
      '<p id="tj-lmr-n-en" class="tj-lmr-n-en"></p>' +
      '<div class="tj-lmr-native-row">' +
      '<button type="button" class="btn primary" id="tj-lmr-n-play">▶ Play master</button> ' +
      '<button type="button" class="btn" id="tj-lmr-n-rec">● Record</button> ' +
      '<button type="button" class="btn" id="tj-lmr-n-stop">Stop</button> ' +
      '<button type="button" class="btn" id="tj-lmr-n-user-play">Play take</button> ' +
      '<button type="button" class="btn" id="tj-lmr-n-score">★ Score vs master</button>' +
      "</div>" +
      '<audio id="tj-lmr-n-master" controls preload="metadata"></audio> ' +
      '<audio id="tj-lmr-n-user" controls preload="metadata" hidden></audio>' +
      '<p id="tj-lmr-n-status" class="tj-lmr-n-status">Ready · Ḥuṣarī / fallback · educational only</p>' +
      '<p id="tj-lmr-n-scoreline" class="tj-lmr-n-scoreline"></p>' +
      "</div>";
    h.appendChild(bar);
    wire(bar);
    return bar;
  }

  function wire(bar) {
    if (!bar || bar.__lmrWired) return;
    bar.__lmrWired = true;
    var pullBtn = $("tj-lmr-n-pull");
    if (pullBtn) pullBtn.addEventListener("click", pull);
    var playBtn = $("tj-lmr-n-play");
    if (playBtn) playBtn.addEventListener("click", playMaster);
    var recBtn = $("tj-lmr-n-rec");
    if (recBtn) recBtn.addEventListener("click", startRec);
    var stopBtn = $("tj-lmr-n-stop");
    if (stopBtn) stopBtn.addEventListener("click", stopRec);
    var userPlay = $("tj-lmr-n-user-play");
    if (userPlay) userPlay.addEventListener("click", playUser);
    var scoreBtn = $("tj-lmr-n-score");
    if (scoreBtn) scoreBtn.addEventListener("click", score);
  }

  function pull() {
    if (!isAction()) return;
    var s = parseInt(($("tj-lmr-n-surah") || {}).value || "1", 10) || 1;
    var a = parseInt(($("tj-lmr-n-ayah") || {}).value || "1", 10) || 1;
    state.surah = s;
    state.ayah = a;
    status("Fetching āyah…");
    var api = "https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih";
    fetch(api)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var arr = (data && data.data) || [];
        var ar = "", en = "";
        arr.forEach(function (ed) {
          if (ed && ed.edition && ed.edition.identifier === "quran-uthmani") ar = ed.text || "";
          if (ed && ed.edition && String(ed.edition.identifier || "").indexOf("en") === 0) en = ed.text || "";
        });
        if (!ar && arr[0]) ar = arr[0].text || "";
        if (!en && arr[1]) en = arr[1].text || "";
        state.ar = ar;
        state.en = en;
        if ($("tj-lmr-n-ar")) $("tj-lmr-n-ar").textContent = ar;
        if ($("tj-lmr-n-en")) $("tj-lmr-n-en").textContent = en;
        state.masterUrl = everyAyahUrl(s, a);
        var master = $("tj-lmr-n-master");
        if (master) {
          master.src = state.masterUrl;
          master.onloadedmetadata = function () {
            state.masterDur = master.duration || 0;
          };
        }
        status("Ready · Ḥuṣarī / fallback · educational only");
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
    try { master.play(); } catch (e) {}
  }

  function startRec() {
    if (!isAction()) return;
    if (!w.navigator || !w.navigator.mediaDevices || !w.navigator.mediaDevices.getUserMedia) {
      status("Mic not available");
      return;
    }
    state.chunks = [];
    w.navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        state.rec = new MediaRecorder(stream);
        state.t0 = Date.now();
        state.rec.ondataavailable = function (ev) {
          if (ev.data && ev.data.size) state.chunks.push(ev.data);
        };
        state.rec.onstop = function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          state.userBlob = new Blob(state.chunks, { type: "audio/webm" });
          if (state.userUrl) URL.revokeObjectURL(state.userUrl);
          state.userUrl = URL.createObjectURL(state.userBlob);
          var u = $("tj-lmr-n-user");
          if (u) {
            u.hidden = false;
            u.src = state.userUrl;
          }
          status("Take saved on device · nothing uploaded");
        };
        state.rec.start();
        status("Recording…");
      })
      .catch(function () {
        status("Mic permission denied");
      });
  }

  function stopRec() {
    try {
      if (state.rec && state.rec.state === "recording") state.rec.stop();
    } catch (e) {}
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
    var note =
      "Educational proxy ~" + pct + "% length match · not a qāriʾ grade · learn with a teacher";
    if ($("tj-lmr-n-scoreline")) $("tj-lmr-n-scoreline").textContent = note;
    status(note);
  }

  function boot() {
    if (!isAction()) {
      dismantle();
      return;
    }
    killDupes();
    var h = host();
    if (!h) return;
    paintUI(h);
    if (!state.ar) setTimeout(function () {
      if (isAction()) pull();
    }, 200);
  }

  function onMounted(ev) {
    var tab = "";
    try {
      tab = (ev && ev.detail && ev.detail.tab) || activeTab();
    } catch (e) {}
    tab = String(tab || "").toLowerCase();
    if (tab && tab !== "action") {
      dismantle();
      return;
    }
    if (tab === "action" || isAction()) {
      setTimeout(boot, 30);
      setTimeout(boot, 350);
    } else {
      dismantle();
    }
  }

  /* ONLY react to tab mounts — no global DOMContentLoaded paint on Reminder */
  d.addEventListener("clarity:tab-mounted", onMounted);
  w.addEventListener("clarity:tab-mounted", onMounted);

  /* If user lands with #action hash */
  function initial() {
    if (isAction()) {
      setTimeout(boot, 50);
      setTimeout(boot, 400);
    } else {
      dismantle();
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", initial);
  else initial();
})(window, document);
