/*! companion-action-lmr-native-v1.js · NUKE mount
 * Self-contained Action LMR — does not wait for nx re-wire after shell innerHTML mount.
 * Pull āyah · Play Ḥuṣarī (EveryAyah) · Record · educational score
 * Single card #tj-lmr · kills duplicate panels · clarity:tab-mounted aware
 * Educational only — not a qāriʾ grade — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_LMR_NATIVE_V1__) return;
  w.__CLARITY_LMR_NATIVE_V1__ = true;

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
    t0: 0
  };

  function $(id) {
    return d.getElementById(id);
  }

  function status(msg) {
    var el = $("tj-lmr-native-status") || $("tj-lmr-rec-status") || $("tj-lmr-meta");
    if (el) el.textContent = msg || "";
  }

  function everyAyahUrl(surah, ayah) {
    var s = String(surah).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3";
  }

  function alafasyFallback(globalNum) {
    if (!globalNum) return "";
    return "https://cdn.islamic.network/quran/audio/128/ar.alafasy/" + globalNum + ".mp3";
  }

  function killDupes() {
    var dup = $("action-tj-lmr-panel");
    if (dup && dup.parentNode) dup.parentNode.removeChild(dup);
    d.querySelectorAll(".phase-tlmr").forEach(function (el) {
      if (!el.querySelector("#tj-lmr") && el.id !== "tj-lmr-panel") {
        try {
          el.style.display = "none";
        } catch (e) {}
      }
    });
  }

  function ensureCard() {
    killDupes();
    var root = $("tj-lmr");
    if (!root) {
      /* create under deep studio if missing */
      var host = $("tj-deep-studio") || $("tj-lmr-panel") || $("cs-mount") || d.body;
      var wrap = d.createElement("div");
      wrap.className = "tj-practice-loop";
      wrap.id = "tj-lmr";
      host.appendChild(wrap);
      root = wrap;
    }
    var panel = $("tj-lmr-panel");
    if (panel && panel.tagName === "DETAILS") panel.open = true;

    if ($("tj-lmr-native-bar")) return root;

    var bar = d.createElement("div");
    bar.id = "tj-lmr-native-bar";
    bar.setAttribute(
      "style",
      "margin:.65rem 0;padding:.75rem;border-radius:14px;border:1px solid rgba(201,162,39,.4);background:rgba(6,16,12,.65)"
    );
    bar.innerHTML =
      '<p style="margin:0 0 .4rem;font-weight:700">🎧 LMR · native mount (Action)</p>' +
      '<p class="td-src" style="margin:0 0 .5rem">Pull → Play master (Ḥuṣarī) → Record → Score. Educational proxy only — not a qāriʾ grade. Full atelier: <a href="/craft/tajweed/">/craft/tajweed/</a></p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.4rem;align-items:end;margin:.35rem 0">' +
      '<label style="font-size:.8rem">Sūrah <input id="tj-lmr-n-surah" type="number" min="1" max="114" value="1" style="width:4rem"/></label>' +
      '<label style="font-size:.8rem">Āyah <input id="tj-lmr-n-ayah" type="number" min="1" value="1" style="width:4rem"/></label>' +
      '<button type="button" class="btn primary" id="tj-lmr-n-pull">Pull āyah</button>' +
      "</div>" +
      '<div id="tj-lmr-n-text" style="margin:.5rem 0;min-height:3rem">' +
      '<p dir="rtl" lang="ar" id="tj-lmr-n-ar" style="font-size:1.35rem;line-height:1.9;font-family:Amiri,Scheherazade New,serif;margin:0"></p>' +
      '<p id="tj-lmr-n-en" style="font-size:.9rem;opacity:.9;margin:.35rem 0 0"></p>' +
      "</div>" +
      '<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin:.4rem 0">' +
      '<button type="button" class="btn primary" id="tj-lmr-n-play">▶ Play master</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-rec">● Record</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-stop">Stop</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-playuser">Play take</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-score">★ Score vs master</button>' +
      "</div>" +
      '<audio id="tj-lmr-n-master" controls preload="none" style="width:100%;margin:.35rem 0"></audio>' +
      '<audio id="tj-lmr-n-user" controls preload="none" style="width:100%;margin:.35rem 0;display:none"></audio>' +
      '<p id="tj-lmr-native-status" class="td-src" style="margin:.35rem 0 0">Ready · educational only — not a fatwa</p>' +
      '<p id="tj-lmr-n-scoreline" class="td-src" style="margin:.25rem 0 0"></p>';

    /* place at top of #tj-lmr so it's visible */
    if (root.firstChild) root.insertBefore(bar, root.firstChild);
    else root.appendChild(bar);

    bind(bar);
    return root;
  }

  function bind(root) {
    if (root.__native_bound) return;
    root.__native_bound = true;
    $("tj-lmr-n-pull").addEventListener("click", pull);
    $("tj-lmr-n-play").addEventListener("click", playMaster);
    $("tj-lmr-n-rec").addEventListener("click", startRec);
    $("tj-lmr-n-stop").addEventListener("click", stopRec);
    $("tj-lmr-n-playuser").addEventListener("click", playUser);
    $("tj-lmr-n-score").addEventListener("click", score);
  }

  function pull() {
    var s = Math.max(1, Math.min(114, parseInt(($("tj-lmr-n-surah") || {}).value, 10) || 1));
    var a = Math.max(1, parseInt(($("tj-lmr-n-ayah") || {}).value, 10) || 1);
    state.surah = s;
    state.ayah = a;
    status("Loading " + s + ":" + a + "…");
    var url =
      "https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih";
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("http");
        return r.json();
      })
      .then(function (j) {
        var arr = (j && j.data) || [];
        if (!Array.isArray(arr)) arr = [arr];
        var ar = "",
          en = "",
          num = null;
        arr.forEach(function (item) {
          if (!item) return;
          var id = (item.edition && item.edition.identifier) || "";
          if (/uthmani|quran/i.test(id) && item.text) ar = item.text;
          if (/sahih|en\./i.test(id) && item.text) en = item.text;
          if (item.number) num = item.number;
        });
        if (!ar && arr[0]) ar = arr[0].text || "";
        if (!en && arr[1]) en = arr[1].text || "";
        state.ar = ar;
        state.en = en;
        state.masterUrl = everyAyahUrl(s, a);
        var master = $("tj-lmr-n-master");
        if (master) {
          master.src = state.masterUrl;
          master.onerror = function () {
            if (num) {
              state.masterUrl = alafasyFallback(num);
              master.src = state.masterUrl;
            }
          };
        }
        if ($("tj-lmr-n-ar")) $("tj-lmr-n-ar").textContent = ar;
        if ($("tj-lmr-n-en")) $("tj-lmr-n-en").textContent = en;
        /* mirror into classic nodes if present */
        if ($("tj-lmr-ar")) $("tj-lmr-ar").textContent = ar;
        if ($("tj-lmr-en")) $("tj-lmr-en").textContent = en;
        if ($("tj-lmr-ar-read")) $("tj-lmr-ar-read").textContent = ar;
        if ($("tj-lmr-master-audio")) $("tj-lmr-master-audio").src = state.masterUrl;
        status("Ready " + s + ":" + a + " · Ḥuṣarī / fallback · educational only");
      })
      .catch(function () {
        status("Could not load āyah — check network or open /craft/tajweed/");
      });
  }

  function playMaster() {
    var a = $("tj-lmr-n-master");
    if (!a || !a.src) {
      pull();
      status("Pull an āyah first");
      return;
    }
    try {
      a.play();
    } catch (e) {
      status("Play blocked — tap again");
    }
  }

  function startRec() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status("Mic not available on this device/browser");
      return;
    }
    state.chunks = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        try {
          state.rec = new MediaRecorder(stream);
        } catch (e) {
          status("Recorder unavailable");
          stream.getTracks().forEach(function (t) {
            t.stop();
          });
          return;
        }
        state.t0 = Date.now();
        state.rec.ondataavailable = function (ev) {
          if (ev.data && ev.data.size) state.chunks.push(ev.data);
        };
        state.rec.onstop = function () {
          stream.getTracks().forEach(function (t) {
            t.stop();
          });
          state.userBlob = new Blob(state.chunks, { type: "audio/webm" });
          if (state.userUrl) URL.revokeObjectURL(state.userUrl);
          state.userUrl = URL.createObjectURL(state.userBlob);
          var u = $("tj-lmr-n-user");
          if (u) {
            u.src = state.userUrl;
            u.style.display = "block";
          }
          status("Take saved on device · nothing uploaded");
        };
        state.rec.start();
        status("Recording… tap Stop when done");
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
    var u = $("tj-lmr-n-user");
    if (!u || !u.src) {
      status("No take yet — Record first");
      return;
    }
    try {
      u.play();
    } catch (e) {}
  }

  function score() {
    var master = $("tj-lmr-n-master");
    var user = $("tj-lmr-n-user");
    var line = $("tj-lmr-n-scoreline");
    if (!user || !user.src) {
      status("Record a take before scoring");
      return;
    }
    var md = master && isFinite(master.duration) ? master.duration : 0;
    var ud = user && isFinite(user.duration) ? user.duration : 0;
    /* if duration not ready, use recording wall time */
    if (!ud && state.t0) ud = Math.max(0.5, (Date.now() - state.t0) / 1000);
    var ratio = md > 0 ? Math.min(ud, md) / Math.max(ud, md) : 0.5;
    var pct = Math.round(ratio * 100);
    var note =
      "Educational proxy ~" +
      pct +
      "% length match vs master · not a qāriʾ grade · learn with a teacher";
    if (line) line.textContent = note;
    status(note);
  }

  function boot() {
    ensureCard();
    /* auto-pull Fatiha 1 once */
    setTimeout(function () {
      if (!state.ar) pull();
    }, 400);
  }

  function onMounted(ev) {
    try {
      var tab = ev && ev.detail && ev.detail.tab;
      if (tab && String(tab).toLowerCase().indexOf("action") < 0 && tab !== "action") return;
    } catch (e) {}
    setTimeout(boot, 50);
    setTimeout(boot, 400);
  }

  d.addEventListener("clarity:tab-mounted", onMounted);
  w.addEventListener("clarity:tab-mounted", onMounted);

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 300);
  setTimeout(boot, 1000);
  setTimeout(boot, 2500);
})(window, document);
