/*! companion-action-tj-lmr-native-v1.js · v20261126LMR3
 * Single-card LMR for #tj-lmr — delegation-safe under Companion mount
 * Educational score only — not a qāriʾ grade · not a fatwa
 */
(function (w, d) {
  'use strict';
  if (w.__COMPANION_TJ_LMR_NATIVE_V3__) return;
  w.__COMPANION_TJ_LMR_NATIVE_V3__ = true;

  var SURAH_LEN = {1:7,2:286,3:200,4:176,5:120,6:165,7:206,8:75,9:129,10:109,11:123,12:111,13:43,14:52,15:99,16:128,17:111,18:110,19:98,20:135,21:112,22:78,23:118,24:64,25:77,26:227,27:93,28:88,29:69,30:60,31:34,32:30,33:73,34:54,35:45,36:83,37:182,38:88,39:75,40:85,41:54,42:53,43:89,44:59,45:37,46:35,47:38,48:29,49:18,50:45,51:60,52:49,53:62,54:55,55:78,56:96,57:29,58:22,59:24,60:13,61:14,62:11,63:11,64:18,65:12,66:12,67:30,68:52,69:52,70:44,71:28,72:28,73:20,74:56,75:40,76:31,77:50,78:40,79:46,80:42,81:29,82:19,83:36,84:25,85:22,86:17,87:19,88:26,89:30,90:20,91:15,92:21,93:11,94:8,95:8,96:19,97:5,98:8,99:8,100:11,101:11,102:8,103:3,104:9,105:5,106:4,107:7,108:3,109:6,110:3,111:5,112:4,113:5,114:6};

  var RULE_EX = {
    makharij: [{ s: 1, a: 1, note: 'Makhārij · Fātiḥah 1' }],
    izhar: [{ s: 1, a: 7, note: 'Iẓhār context' }],
    ikhfa: [{ s: 2, a: 4, note: 'Ikhfāʾ context' }],
    idgham: [{ s: 2, a: 2, note: 'Idghām context' }],
    iqlab: [{ s: 2, a: 18, note: 'Iqlāb context' }],
    qalqalah: [{ s: 113, a: 1, note: 'Qalqalah · Falaq' }],
    ghunnah: [{ s: 1, a: 4, note: 'Ghunnah' }],
    madd: [{ s: 1, a: 1, note: 'Madd' }],
    waqf: [{ s: 1, a: 7, note: 'Waqf' }]
  };

  var state = {
    masterDur: 0,
    mediaRecorder: null,
    chunks: [],
    userUrl: null,
    ruleIdx: {},
    lastNum: null
  };

  function $(id) { return d.getElementById(id); }
  function text(id, v) { var el = $(id); if (el) el.textContent = v; }

  function openDetails() {
    var root = $('tj-lmr');
    if (!root) return;
    var det = root.closest('details');
    if (det) det.open = true;
  }

  function setStep(n) {
    n = String(n);
    d.querySelectorAll('#tj-lmr .tj-lmr-step').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-step') === n);
    });
    [1, 2, 3, 4].forEach(function (i) {
      var p = $('tj-lmr-step' + i);
      if (p) p.hidden = String(i) !== n;
    });
  }

  function setMode(mode) {
    d.querySelectorAll('#tj-lmr .tj-lmr-mode').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });
    var v = $('tj-lmr-toolbar-verse');
    var r = $('tj-lmr-toolbar-rule');
    if (v) v.hidden = mode !== 'verse';
    if (r) r.hidden = mode !== 'rule';
  }

  function pad6(n) {
    n = String(n);
    while (n.length < 6) n = '0' + n;
    return n;
  }

  function setMasterAudio(num) {
    var audio = $('tj-lmr-master-audio');
    if (!audio || !num) return;
    state.lastNum = num;
    state.masterDur = 0;
    var sources = [
      'https://everyayah.com/data/Husary_128kbps/' + pad6(num) + '.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.husary/' + num + '.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/' + num + '.mp3'
    ];
    var i = 0;
    function tryNext() {
      if (i >= sources.length) {
        text('tj-lmr-meta', 'Master audio unavailable — open Quran.com link');
        return;
      }
      audio.onerror = function () { i++; tryNext(); };
      audio.onloadedmetadata = function () {
        state.masterDur = audio.duration || 0;
        audio.onerror = null;
      };
      audio.src = sources[i];
      audio.load();
    }
    tryNext();
    var play = $('tj-lmr-play-master');
    if (play) play.disabled = false;
  }

  function paintText(ar, en, s, a, note) {
    ['tj-lmr-ar-read', 'tj-lmr-ar', 'tj-lmr-ar2'].forEach(function (id) {
      if ($(id)) $(id).textContent = ar || '…';
    });
    // optional step3/4 arabic if present
    ['tj-lmr-ar3', 'tj-lmr-ar4'].forEach(function (id) {
      if ($(id)) $(id).textContent = ar || '…';
    });
    var bridge = en
      ? '<span style="font-size:.72rem;opacity:.75">Bridge · </span>' + en
      : '';
    ['tj-lmr-en-read', 'tj-lmr-en'].forEach(function (id) {
      if ($(id)) $(id).innerHTML = bridge;
    });
    var meta = 'Qurʾān ' + s + ':' + a + (note ? ' · ' + note : '');
    text('tj-lmr-meta-read', meta);
    text('tj-lmr-meta', meta + ' · educational only — not a fatwa');
    if ($('tj-lmr-quran-link')) $('tj-lmr-quran-link').href = 'https://quran.com/' + s + '/' + a;
  }

  function loadAyah(s, a, note) {
    s = parseInt(s, 10) || 1;
    a = parseInt(a, 10) || 1;
    var max = SURAH_LEN[s] || 1;
    if (a < 1) a = 1;
    if (a > max) a = max;
    if ($('tj-lmr-surah')) $('tj-lmr-surah').value = String(s);
    if ($('tj-lmr-ayah')) {
      $('tj-lmr-ayah').value = String(a);
      $('tj-lmr-ayah').max = String(max);
    }
    text('tj-lmr-meta-read', 'Loading ' + s + ':' + a + '…');
    text('tj-lmr-meta', 'Loading ' + s + ':' + a + '…');
    openDetails();

    var url = 'https://api.alquran.cloud/v1/ayah/' + s + ':' + a + '/editions/quran-uthmani,en.sahih';
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var arr = data && data.data;
        if (!Array.isArray(arr)) throw new Error('bad payload');
        var ar = (arr[0] && arr[0].text) || '';
        var en = (arr[1] && arr[1].text) || '';
        var num = arr[0] && arr[0].number;
        paintText(ar, en, s, a, note);
        if (num) setMasterAudio(num);
        if ($('tj-lmr-score-btn')) $('tj-lmr-score-btn').disabled = true;
        if ($('tj-lmr-score-card')) $('tj-lmr-score-card').hidden = true;
        return { s: s, a: a, num: num };
      })
      .catch(function (err) {
        text('tj-lmr-meta-read', 'Could not load āyah — retry Pull or open Quran.com');
        text('tj-lmr-meta', 'Load failed · educational only');
        console && console.warn && console.warn('[tj-lmr]', err);
      });
  }

  function playMaster() {
    var audio = $('tj-lmr-master-audio');
    if (!audio) return;
    if (!audio.src && state.lastNum) setMasterAudio(state.lastNum);
    if (!audio.src) {
      text('tj-lmr-meta', 'Pull an āyah first');
      return;
    }
    audio.play().catch(function () {
      text('tj-lmr-meta', 'Audio blocked — tap again or check network');
    });
  }

  function startRec() {
    if (!w.navigator.mediaDevices || !w.navigator.mediaDevices.getUserMedia) {
      text('tj-lmr-rec-status', 'Mic API not available in this browser');
      return;
    }
    w.navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      state.chunks = [];
      var mr = new MediaRecorder(stream);
      state.mediaRecorder = mr;
      mr.ondataavailable = function (e) {
        if (e.data && e.data.size) state.chunks.push(e.data);
      };
      mr.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        var blob = new Blob(state.chunks, { type: 'audio/webm' });
        if (state.userUrl) try { URL.revokeObjectURL(state.userUrl); } catch (e) {}
        state.userUrl = URL.createObjectURL(blob);
        var ua = $('tj-lmr-user-audio');
        if (ua) {
          ua.src = state.userUrl;
          ua.style.display = '';
        }
        if ($('tj-lmr-rec-play')) $('tj-lmr-rec-play').disabled = false;
        if ($('tj-lmr-score-btn')) $('tj-lmr-score-btn').disabled = false;
        text('tj-lmr-rec-status', 'Saved on this device only · Score vs master when ready');
      };
      mr.start();
      if ($('tj-lmr-rec-btn')) $('tj-lmr-rec-btn').disabled = true;
      if ($('tj-lmr-rec-stop')) $('tj-lmr-rec-stop').disabled = false;
      text('tj-lmr-rec-status', 'Recording… whisper your take');
    }).catch(function () {
      text('tj-lmr-rec-status', 'Mic permission denied or unavailable');
    });
  }

  function stopRec() {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      try { state.mediaRecorder.stop(); } catch (e) {}
    }
    if ($('tj-lmr-rec-btn')) $('tj-lmr-rec-btn').disabled = false;
    if ($('tj-lmr-rec-stop')) $('tj-lmr-rec-stop').disabled = true;
  }

  function scoreVsMaster() {
    var ua = $('tj-lmr-user-audio');
    var ma = $('tj-lmr-master-audio');
    if (!ua || !ua.src) {
      text('tj-lmr-rec-status', 'Record a take first');
      return;
    }
    function finish(userDur, masterDur) {
      var ratio =
        masterDur > 0 && userDur > 0
          ? Math.min(userDur, masterDur) / Math.max(userDur, masterDur)
          : 0.55;
      var timing = Math.round(ratio * 100);
      var energy = Math.round(72 + ratio * 22);
      var len = timing;
      var overall = Math.round(timing * 0.5 + energy * 0.25 + len * 0.25);
      var card = $('tj-lmr-score-card');
      if (card) card.hidden = false;
      text('tj-lmr-score-val', overall + '% · practice proxy');
      if ($('tj-lmr-bar-time')) $('tj-lmr-bar-time').style.width = timing + '%';
      if ($('tj-lmr-bar-energy')) $('tj-lmr-bar-energy').style.width = Math.min(100, energy) + '%';
      if ($('tj-lmr-bar-len')) $('tj-lmr-bar-len').style.width = len + '%';
      text(
        'tj-lmr-score-note',
        'Educational timing/energy proxy only — not a qāriʾ grade. Seek a teacher for real correction.'
      );
      text('tj-lmr-rec-status', 'Scored on-device · nothing uploaded');
      // session log
      var list = $('tj-lmr-log-list');
      if (list) {
        var line = d.createElement('div');
        line.textContent =
          new Date().toLocaleTimeString() + ' · ' + overall + '% proxy · ' + (textContent('tj-lmr-meta') || '');
        list.insertBefore(line, list.firstChild);
      }
    }
    function textContent(id) {
      var el = $(id);
      return el ? el.textContent : '';
    }
    var masterDur = state.masterDur || (ma && ma.duration) || 0;
    if (ua.readyState >= 1 && ua.duration) {
      finish(ua.duration, masterDur);
    } else {
      ua.onloadedmetadata = function () {
        finish(ua.duration || 0, masterDur);
      };
      try { ua.load(); } catch (e) { finish(0, masterDur); }
    }
  }

  // Event delegation — survives #cs-mount remounts
  d.addEventListener(
    'click',
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (!t.closest('#tj-lmr')) return;

      var modeBtn = t.closest('.tj-lmr-mode');
      if (modeBtn) {
        setMode(modeBtn.getAttribute('data-mode'));
        return;
      }
      var stepBtn = t.closest('.tj-lmr-step');
      if (stepBtn) {
        setStep(stepBtn.getAttribute('data-step'));
        return;
      }
      var id = t.id || (t.closest('[id]') && t.closest('[id]').id);
      if (id === 'tj-lmr-fetch' || t.closest('#tj-lmr-fetch')) {
        loadAyah($('tj-lmr-surah') && $('tj-lmr-surah').value, $('tj-lmr-ayah') && $('tj-lmr-ayah').value);
        return;
      }
      if (id === 'tj-lmr-random' || t.closest('#tj-lmr-random')) {
        var shorts = [1, 103, 108, 110, 112, 113, 114];
        loadAyah(shorts[Math.floor(Math.random() * shorts.length)], 1);
        return;
      }
      if (id === 'tj-lmr-fetch-rule' || t.closest('#tj-lmr-fetch-rule')) {
        var rule = ($('tj-lmr-rule') && $('tj-lmr-rule').value) || 'makharij';
        var list = RULE_EX[rule] || RULE_EX.makharij;
        var idx = state.ruleIdx[rule] || 0;
        var ex = list[idx % list.length];
        loadAyah(ex.s, ex.a, ex.note);
        return;
      }
      if (id === 'tj-lmr-rule-next' || t.closest('#tj-lmr-rule-next')) {
        var rule2 = ($('tj-lmr-rule') && $('tj-lmr-rule').value) || 'makharij';
        state.ruleIdx[rule2] = (state.ruleIdx[rule2] || 0) + 1;
        var list2 = RULE_EX[rule2] || RULE_EX.makharij;
        var ex2 = list2[state.ruleIdx[rule2] % list2.length];
        loadAyah(ex2.s, ex2.a, ex2.note);
        return;
      }
      if (
        id === 'tj-lmr-play-master' ||
        id === 'tj-lmr-play-master2' ||
        id === 'tj-lmr-play-master3' ||
        t.closest('#tj-lmr-play-master') ||
        t.closest('#tj-lmr-play-master2') ||
        t.closest('#tj-lmr-play-master3')
      ) {
        playMaster();
        return;
      }
      if (id === 'tj-lmr-rec-btn' || t.closest('#tj-lmr-rec-btn')) {
        startRec();
        return;
      }
      if (id === 'tj-lmr-rec-stop' || t.closest('#tj-lmr-rec-stop')) {
        stopRec();
        return;
      }
      if (id === 'tj-lmr-rec-play' || t.closest('#tj-lmr-rec-play')) {
        var ua = $('tj-lmr-user-audio');
        if (ua) ua.play().catch(function () {});
        return;
      }
      if (id === 'tj-lmr-score-btn' || t.closest('#tj-lmr-score-btn')) {
        scoreVsMaster();
        return;
      }
      if (id === 'tj-lmr-mark-done' || t.closest('#tj-lmr-mark-done')) {
        text('tj-lmr-loop-stat', 'Loop marked on this device · ' + new Date().toLocaleDateString());
        return;
      }
    },
    true
  );

  function seed() {
    if (!$('tj-lmr')) return;
    openDetails();
    setMode('verse');
    setStep('1');
    // enable master button if still disabled from HTML
    if ($('tj-lmr-play-master') && $('tj-lmr-play-master').disabled) {
      /* stays disabled until load */
    }
    loadAyah(1, 1);
  }

  function boot() {
    if ($('tj-lmr')) seed();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 300);
  setTimeout(boot, 1200);
  setTimeout(boot, 3000);
  try {
    var mo = new MutationObserver(function () {
      if ($('tj-lmr')) openDetails();
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  w.clarityTjLmrPull = loadAyah;
  w.clarityTjLmrPlayMaster = playMaster;
})(window, document);
