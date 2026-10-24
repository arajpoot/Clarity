
/**
 * Hajj 2027 Speak Path — unlimited practice
 * AV TTS · read-along · match score (tajweed-style)
 * Educational language only — not a ritual fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_HAJJ27_V1__) return;
  g.__CU_HAJJ27_V1__ = true;

  var VER = "20261018STABLE";
  var SCORE_KEY = "cu_hajj27_score_v1";
  var CAT_KEY = "cu_hajj27_cat_v1";
  var bank = null;
  var state = {
    cat: "all",
    list: [],
    ix: 0,
    mode: "read", /* read | match | listen */
    matchScore: 0,
    matchTotal: 0,
    flipped: false,
  };

  function $(id) { return document.getElementById(id); }

  function loadScore() {
    try { return JSON.parse(localStorage.getItem(SCORE_KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveScore(o) {
    try { localStorage.setItem(SCORE_KEY, JSON.stringify(o)); } catch (e) {}
  }

  function speak(ar, slow) {
    try {
      if (!g.speechSynthesis) return;
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(ar);
      u.lang = "ar-SA";
      u.rate = slow ? 0.65 : 0.85;
      var voices = g.speechSynthesis.getVoices() || [];
      for (var i = 0; i < voices.length; i++) {
        if ((voices[i].lang || "").toLowerCase().indexOf("ar") === 0) {
          u.voice = voices[i];
          break;
        }
      }
      g.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function filtered() {
    if (!bank) return [];
    if (state.cat === "all") return bank.cards.slice();
    return bank.cards.filter(function (c) { return c.cat === state.cat; });
  }

  function shuffle(a) {
    var x = a.slice();
    for (var i = x.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = x[i]; x[i] = x[j]; x[j] = t;
    }
    return x;
  }

  function current() {
    return state.list[state.ix] || null;
  }

  function paint() {
    var root = $("hajj27-root");
    if (!root || !bank) return;
    var c = current();
    var score = loadScore();
    var done = Object.keys(score).length;
    var cats = bank.categories || {};

    var catBtns = '<button type="button" class="h27-pill' + (state.cat === "all" ? " on" : "") + '" data-cat="all">All (' + bank.cards.length + ')</button>';
    Object.keys(cats).forEach(function (k) {
      var n = bank.cards.filter(function (x) { return x.cat === k; }).length;
      catBtns += '<button type="button" class="h27-pill' + (state.cat === k ? " on" : "") + '" data-cat="' + k + '">' + cats[k] + " (" + n + ")</button>";
    });

    var modes =
      '<button type="button" class="h27-pill' + (state.mode === "read" ? " on" : "") + '" data-mode="read">Read along</button>' +
      '<button type="button" class="h27-pill' + (state.mode === "listen" ? " on" : "") + '" data-mode="listen">Listen</button>' +
      '<button type="button" class="h27-pill' + (state.mode === "match" ? " on" : "") + '" data-mode="match">Match score</button>';

    var body = "";
    if (!c) {
      body = "<p>No phrases in this filter.</p>";
    } else if (state.mode === "match") {
      body = renderMatch(c);
    } else {
      body =
        '<div class="h27-card">' +
        '<p class="h27-cat">' + (cats[c.cat] || c.cat) + " · " + (state.ix + 1) + " / " + state.list.length + "</p>" +
        '<p class="h27-ar" dir="rtl" lang="ar">' + c.ar + "</p>" +
        '<p class="h27-tr">' + (c.tr || "") + "</p>" +
        '<p class="h27-en">' + c.en + "</p>" +
        '<div class="h27-actions">' +
        '<button type="button" class="h27-btn primary" data-act="hear">Hear</button>' +
        '<button type="button" class="h27-btn" data-act="slow">Slow</button>' +
        '<button type="button" class="h27-btn" data-act="said">I said it</button>' +
        '<button type="button" class="h27-btn" data-act="next">Next</button>' +
        '<button type="button" class="h27-btn" data-act="prev">Prev</button>' +
        "</div></div>";
    }

    root.innerHTML =
      '<div class="h27-disc">' + (bank.disclaimer || "") + "</div>" +
      '<div class="h27-scoreline">Practiced marks: <strong>' + done + "</strong> · Match session: <strong>" +
      state.matchScore + "/" + state.matchTotal + "</strong> · Unlimited practice</div>" +
      '<div class="h27-row">' + catBtns + "</div>" +
      '<div class="h27-row">' + modes + "</div>" +
      body +
      '<p class="h27-foot"><a href="/campus/lab/arabic/">Arabic studio</a> · <a href="/campus/buddy/">Study Buddy</a> · <a href="/campus/lab/tajweed/">Tajweed lab</a></p>';

    root.querySelectorAll("[data-cat]").forEach(function (b) {
      b.onclick = function () {
        state.cat = b.getAttribute("data-cat");
        state.list = shuffle(filtered());
        state.ix = 0;
        try { localStorage.setItem(CAT_KEY, state.cat); } catch (e) {}
        paint();
      };
    });
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.onclick = function () {
        state.mode = b.getAttribute("data-mode");
        if (state.mode === "match") setupMatchRound();
        paint();
      };
    });
    root.querySelectorAll("[data-act]").forEach(function (b) {
      b.onclick = function () { onAct(b.getAttribute("data-act")); };
    });
    root.querySelectorAll("[data-match]").forEach(function (b) {
      b.onclick = function () { onMatch(b.getAttribute("data-match")); };
    });
  }

  function setupMatchRound() {
    /* rebuild list order for match */
    state.list = shuffle(filtered());
    state.ix = 0;
  }

  function renderMatch(c) {
    var opts = [c.en];
    var pool = shuffle(state.list.filter(function (x) { return x.id !== c.id; })).slice(0, 3);
    pool.forEach(function (p) { opts.push(p.en); });
    opts = shuffle(opts);
    var btns = opts.map(function (o) {
      return '<button type="button" class="h27-btn match" data-match="' + o.replace(/"/g, "&quot;") + '">' + o + "</button>";
    }).join("");
    return (
      '<div class="h27-card">' +
      '<p class="h27-cat">Match · ' + (state.ix + 1) + " / " + state.list.length + "</p>" +
      '<p class="h27-ar" dir="rtl" lang="ar">' + c.ar + "</p>" +
      '<button type="button" class="h27-btn primary" data-act="hear">Hear</button>' +
      '<div class="h27-match-grid">' + btns + "</div>" +
      '<p class="h27-en muted">Score: ' + state.matchScore + " / " + state.matchTotal + "</p></div>"
    );
  }

  function onMatch(choice) {
    var c = current();
    if (!c) return;
    state.matchTotal++;
    if (choice === c.en) state.matchScore++;
    var sc = loadScore();
    sc[c.id] = { at: Date.now(), ok: choice === c.en };
    saveScore(sc);
    if (g.ClarityTranscript) {
      try {
        g.ClarityTranscript.log("lab", {
          id: "hajj27-" + c.id,
          title: "Hajj27 " + (choice === c.en ? "match ok" : "match try")
        });
      } catch (e) {}
    }
    state.ix = (state.ix + 1) % Math.max(1, state.list.length);
    paint();
  }

  function onAct(act) {
    var c = current();
    if (!c) return;
    if (act === "hear") speak(c.ar, false);
    if (act === "slow") speak(c.ar, true);
    if (act === "said") {
      var sc = loadScore();
      sc[c.id] = { at: Date.now(), said: true };
      saveScore(sc);
      if (g.ClarityTranscript) {
        try { g.ClarityTranscript.log("lab", { id: "hajj27-say-" + c.id, title: "Hajj27 said " + c.en }); } catch (e) {}
      }
      state.ix = (state.ix + 1) % Math.max(1, state.list.length);
      paint();
    }
    if (act === "next") {
      state.ix = (state.ix + 1) % Math.max(1, state.list.length);
      paint();
    }
    if (act === "prev") {
      state.ix = (state.ix - 1 + state.list.length) % Math.max(1, state.list.length);
      paint();
    }
  }

  function boot() {
    var root = $("hajj27-root");
    if (!root) return;
    root.innerHTML = "<p>Loading Hajj 2027 phrase library…</p>";
    fetch("/campus/lab/arabic/packs/hajj2027.json?v=" + VER)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        bank = data;
        try { state.cat = localStorage.getItem(CAT_KEY) || "all"; } catch (e) {}
        state.list = shuffle(filtered());
        paint();
      })
      .catch(function () {
        root.innerHTML = "<p>Could not load phrase library. Check /campus/lab/arabic/packs/hajj2027.json</p>";
      });
    if (g.speechSynthesis) {
      try { g.speechSynthesis.getVoices(); } catch (e) {}
    }
  }

  g.ClarityHajj27 = { boot: boot, speak: speak };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
