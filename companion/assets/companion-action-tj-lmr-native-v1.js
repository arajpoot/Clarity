/*! companion-action-tj-lmr-native-v1.js
 * Powers existing #tj-lmr practice loop (single card — no duplicate panel)
 * Educational alignment score only — not a qāriʾ grade · not a fatwa
 */
(function (w, d) {
  'use strict';
  if (w.__COMPANION_TJ_LMR_NATIVE_V1__) return;
  w.__COMPANION_TJ_LMR_NATIVE_V1__ = true;

  var SURAH_LEN = {1:7,2:286,3:200,4:176,5:120,6:165,7:206,8:75,9:129,10:109,11:123,12:111,13:43,14:52,15:99,16:128,17:111,18:110,19:98,20:135,21:112,22:78,23:118,24:64,25:77,26:227,27:93,28:88,29:69,30:60,31:34,32:30,33:73,34:54,35:45,36:83,37:182,38:88,39:75,40:85,41:54,42:53,43:89,44:59,45:37,46:35,47:38,48:29,49:18,50:45,51:60,52:49,53:62,54:55,55:78,56:96,57:29,58:22,59:24,60:13,61:14,62:11,63:11,64:18,65:12,66:12,67:30,68:52,69:52,70:44,71:28,72:28,73:20,74:56,75:40,76:31,77:50,78:40,79:46,80:42,81:29,82:19,83:36,84:25,85:22,86:17,87:19,88:26,89:30,90:20,91:15,92:21,93:11,94:8,95:8,96:19,97:5,98:8,99:8,100:11,101:11,102:8,103:3,104:9,105:5,106:4,107:7,108:3,109:6,110:3,111:5,112:4,113:5,114:6};

  var RULE_EX = {
    makharij: [{ s: 1, a: 1, note: 'Makhārij awareness — Al-Fātiḥah 1' }],
    izhar: [{ s: 1, a: 7, note: 'Iẓhār practice context' }],
    ikhfa: [{ s: 2, a: 4, note: 'Ikhfāʾ example context' }],
    idgham: [{ s: 2, a: 2, note: 'Idghām example context' }],
    iqlab: [{ s: 2, a: 18, note: 'Iqlāb example context' }],
    qalqalah: [{ s: 113, a: 1, note: 'Qalqalah · Al-Falaq' }],
    ghunnah: [{ s: 1, a: 4, note: 'Ghunnah awareness' }],
    madd: [{ s: 1, a: 1, note: 'Madd in basmala / Fātiḥah' }],
    waqf: [{ s: 1, a: 7, note: 'Waqf at end of Fātiḥah' }]
  };

  var state = { masterDur: 0, mediaRecorder: null, chunks: [], userUrl: null, ruleIdx: {} };

  function $(id) { return d.getElementById(id); }
  function text(id, v) { var el = $(id); if (el) el.textContent = v; }

  function setStep(n) {
    n = String(n);
    d.querySelectorAll('.tj-lmr-step').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-step') === n);
    });
    [1, 2, 3, 4].forEach(function (i) {
      var p = $('tj-lmr-step' + i);
      if (p) p.hidden = String(i) !== n;
    });
  }

  function setMode(mode) {
    d.querySelectorAll('.tj-lmr-mode').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });
    var v = $('tj-lmr-toolbar-verse');
    var r = $('tj-lmr-toolbar-rule');
    if (v) v.hidden = mode !== 'verse';
    if (r) r.hidden = mode !== 'rule';
  }

  function ayahNum(s, a) {
    // everyayah global number approx via api number field preferred
    return null;
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
    var url = 'https://api.alquran.cloud/v1/ayah/' + s + ':' + a + '/editions/quran-uthmani,en.sahih';
    return fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var arr = data && data.data;
      if (!Array.isArray(arr)) throw new Error('bad');
      var ar = (arr[0] && arr[0].text) || '';
      var en = (arr[1] && arr[1].text) || '';
      var num = arr[0] && arr[0].number;
      ['tj-lmr-ar-read', 'tj-lmr-ar', 'tj-lmr-ar2', 'tj-lmr-ar3', 'tj-lmr-ar4'].forEach(function (id) {
        if ($(id)) $(id).textContent = ar || '…';
      });
      ['tj-lmr-en-read', 'tj-lmr-en'].forEach(function (id) {
        if ($(id)) $(id).innerHTML = en ? '<span style="font-size:.72rem;opacity:.75">Bridge · </span>' + en : '';
      });
      var meta = 'Qurʾān ' + s + ':' + a + (note ? ' · ' + note : '');
      text('tj-lmr-meta-read', meta);
      text('tj-lmr-meta', meta + ' · educational only — not a fatwa');
      if ($('tj-lmr-quran-link')) $('tj-lmr-quran-link').href = 'https://quran.com/' + s + '/' + a;
      var audio = $('tj-lmr-master-audio');
      if (audio && num) {
        // Husary 128 via everyayah pattern
        var n = String(num);
        while (n.length < 6) n = '0' + n;
        audio.src = 'https://everyayah.com/data/Husary_128kbps/' + n + '.mp3';
        state.masterDur = 0;
        audio.onloadedmetadata = function () { state.masterDur = audio.duration || 0; };
      }
      var play = $('tj-lmr-play-master');
      if (play) play.disabled = !num;
      var scoreBtn = $('tj-lmr-score-btn');
      if (scoreBtn) scoreBtn.disabled = true;
      return { s: s, a: a, num: num };
    }).catch(function () {
      text('tj-lmr-meta-read', 'Could not load āyah — check network');
      text('tj-lmr-meta', 'Could not load āyah — check network');
    });
  }

  function playMaster() {
    var audio = $('tj-lmr-master-audio');
    if (!audio || !audio.src) return;
    audio.play().catch(function () {});
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
      mr.ondataavailable = function (e) { if (e.data && e.data.size) state.chunks.push(e.data); };
      mr.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        var blob = new Blob(state.chunks, { type: 'audio/webm' });
        if (state.userUrl) URL.revokeObjectURL(state.userUrl);
        state.userUrl = URL.createObjectURL(blob);
        var ua = $('tj-lmr-user-audio');
        if (ua) {
          ua.src = state.userUrl;
          ua.style.display = '';
        }
        if ($('tj-lmr-rec-play')) $('tj-lmr-rec-play').disabled = false;
        if ($('tj-lmr-score-btn')) $('tj-lmr-score-btn').disabled = false;
        text('tj-lmr-rec-status', 'Recording saved on this device only · Score vs master when ready');
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
      state.mediaRecorder.stop();
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
    var userDur = ua.duration || 0;
    var masterDur = state.masterDur || (ma && ma.duration) || 0;
    // educational proxy: duration ratio clamped
    var ratio = masterDur > 0 && userDur > 0 ? Math.min(userDur, masterDur) / Math.max(userDur, masterDur) : 0.5;
    var timing = Math.round(ratio * 100);
    var energy = Math.round(70 + ratio * 25); // soft placeholder
    var overall = Math.round(timing * 0.6 + energy * 0.4);
    var card = $('tj-lmr-score-card');
    if (card) card.hidden = false;
    text('tj-lmr-score-val', overall + '% · practice proxy');
    if ($('tj-lmr-bar-time')) $('tj-lmr-bar-time').style.width = timing + '%';
    if ($('tj-lmr-bar-energy')) $('tj-lmr-bar-energy').style.width = Math.min(100, energy) + '%';
    text('tj-lmr-rec-status', 'Educational alignment only — not a qāriʾ grade. Seek a teacher for correction.');
  }

  function bind() {
    if (!$('tj-lmr')) return;
    if ($('tj-lmr')._nativeBound) return;
    $('tj-lmr')._nativeBound = true;

    d.querySelectorAll('.tj-lmr-mode').forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });
    d.querySelectorAll('.tj-lmr-step').forEach(function (b) {
      b.addEventListener('click', function () { setStep(b.getAttribute('data-step')); });
    });

    if ($('tj-lmr-fetch')) {
      $('tj-lmr-fetch').addEventListener('click', function () {
        loadAyah($('tj-lmr-surah') && $('tj-lmr-surah').value, $('tj-lmr-ayah') && $('tj-lmr-ayah').value);
      });
    }
    if ($('tj-lmr-random')) {
      $('tj-lmr-random').addEventListener('click', function () {
        var shorts = [1, 103, 108, 110, 112, 113, 114];
        var s = shorts[Math.floor(Math.random() * shorts.length)];
        loadAyah(s, 1);
      });
    }
    if ($('tj-lmr-fetch-rule')) {
      $('tj-lmr-fetch-rule').addEventListener('click', function () {
        var rule = ($('tj-lmr-rule') && $('tj-lmr-rule').value) || 'makharij';
        var list = RULE_EX[rule] || RULE_EX.makharij;
        var idx = state.ruleIdx[rule] || 0;
        var ex = list[idx % list.length];
        loadAyah(ex.s, ex.a, ex.note);
      });
    }
    if ($('tj-lmr-rule-next')) {
      $('tj-lmr-rule-next').addEventListener('click', function () {
        var rule = ($('tj-lmr-rule') && $('tj-lmr-rule').value) || 'makharij';
        state.ruleIdx[rule] = (state.ruleIdx[rule] || 0) + 1;
        if ($('tj-lmr-fetch-rule')) $('tj-lmr-fetch-rule').click();
      });
    }

    ['tj-lmr-play-master', 'tj-lmr-play-master2', 'tj-lmr-play-master3'].forEach(function (id) {
      if ($(id)) $(id).addEventListener('click', playMaster);
    });
    if ($('tj-lmr-rec-btn')) $('tj-lmr-rec-btn').addEventListener('click', startRec);
    if ($('tj-lmr-rec-stop')) $('tj-lmr-rec-stop').addEventListener('click', stopRec);
    if ($('tj-lmr-rec-play')) {
      $('tj-lmr-rec-play').addEventListener('click', function () {
        var ua = $('tj-lmr-user-audio');
        if (ua) ua.play().catch(function () {});
      });
    }
    if ($('tj-lmr-score-btn')) $('tj-lmr-score-btn').addEventListener('click', scoreVsMaster);

    setMode('verse');
    setStep('1');
    // seed Fatiha 1
    loadAyah(1, 1);
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', bind);
  else bind();
  setTimeout(bind, 400);
  try {
    var mo = new MutationObserver(function () { if ($('tj-lmr') && !$('tj-lmr')._nativeBound) bind(); });
    mo.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 15000);
  } catch (e) {}
})(window, document);
