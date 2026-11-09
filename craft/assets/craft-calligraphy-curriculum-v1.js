/*! craft-calligraphy-curriculum-v1 · C19CALLIG3
 * Tajweed-parity: curriculum path meters + on-device practice journal (5 recent)
 * Sessions wire into level progress in real time
 * Educational only — not an ijāzah / fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_CALLIG_CURR_V1__) return;
  w.__CRAFT_CALLIG_CURR_V1__ = true;

  var JKEY = "clarity.craft.callig.journal.v1";
  var PKEY = "clarity.craft.callig.path.v1";
  var MAX_SHOW = 5;

  /* Surprise: 7-level path — orientation → scripts → composition → presence */
  var LEVELS = [
    { id: "L0", title: "Orientation", blurb: "Nib, baseline, presence · one calm stroke.", need: 2, script: "ruqah", glyphs: ["ا"] },
    { id: "L1", title: "Ruqʿah stems", blurb: "Alif family · everyday hand yardstick.", need: 4, script: "ruqah", glyphs: ["ا", "ل", "ك"] },
    { id: "L2", title: "Ruqʿah bowls", blurb: "Bāʾ · Nūn · Yāʾ bowls on the line.", need: 5, script: "ruqah", glyphs: ["ب", "ت", "ن", "ي"] },
    { id: "L3", title: "Ruqʿah teeth", blurb: "Sīn rhythm · even spacing.", need: 4, script: "ruqah", glyphs: ["س", "ش", "ص"] },
    { id: "L4", title: "Naskh book hand", blurb: "Five-dot alif · clear baseline.", need: 5, script: "naskh", glyphs: ["ا", "ب", "س", "م"] },
    { id: "L5", title: "Thuluth presence", blurb: "Slow angle · tall forms · not rushed.", need: 4, script: "thuluth", glyphs: ["ا", "ب", "ح", "م"] },
    { id: "L6", title: "Living words", blurb: "Basmala · ḥamd · tahlīl as composition practice.", need: 6, script: "ruqah", glyphs: ["بِسْمِ اللَّهِ", "الْحَمْدُ لِلَّهِ", "لَا إِلَٰهَ إِلَّا اللَّهُ"] }
  ];

  var path = {}; /* levelId -> count */
  var journal = [];
  var activeLevel = "L0";
  var session = { open: false, started: 0, strokes: 0, levelId: "L0", glyph: "", timer: null };

  function $(id) { return d.getElementById(id); }

  function load() {
    try {
      journal = JSON.parse(localStorage.getItem(JKEY) || "[]");
      if (!Array.isArray(journal)) journal = [];
    } catch (e) { journal = []; }
    try {
      path = JSON.parse(localStorage.getItem(PKEY) || "{}");
      if (!path || typeof path !== "object") path = {};
    } catch (e2) { path = {}; }
  }
  function save() {
    try {
      localStorage.setItem(JKEY, JSON.stringify(journal.slice(0, 80)));
      localStorage.setItem(PKEY, JSON.stringify(path));
    } catch (e) {}
  }

  function levelById(id) {
    for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].id === id) return LEVELS[i];
    return LEVELS[0];
  }

  function levelProgress(id) {
    var lv = levelById(id);
    var n = path[id] || 0;
    return Math.min(100, Math.round((n / Math.max(1, lv.need)) * 100));
  }

  function renderStats() {
    var s = $("cal-stat-sessions");
    var p = $("cal-stat-path");
    var t = $("cal-stat-time");
    if (s) s.textContent = String(journal.length);
    if (p) {
      var done = LEVELS.filter(function (lv) { return (path[lv.id] || 0) >= lv.need; }).length;
      p.textContent = done + "/" + LEVELS.length;
    }
    if (t) {
      var sec = journal.reduce(function (a, x) { return a + (x.seconds || 0); }, 0);
      t.textContent = sec < 60 ? sec + "s" : Math.round(sec / 60) + "m";
    }
  }

  function renderPath() {
    var grid = $("cal-level-grid");
    if (!grid) return;
    grid.innerHTML = "";
    LEVELS.forEach(function (lv) {
      var card = d.createElement("button");
      card.type = "button";
      card.className = "cal-level-card" + (lv.id === activeLevel ? " active" : "");
      card.setAttribute("data-level", lv.id);
      var pct = levelProgress(lv.id);
      card.innerHTML =
        "<h4>" + lv.id + " · " + lv.title + "</h4>" +
        "<p>" + lv.blurb + "</p>" +
        '<div class="cal-lv-meter" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
        '<p style="margin-top:.3rem;font-size:.68rem;opacity:.8">' + (path[lv.id] || 0) + " / " + lv.need + " sessions</p>";
      card.addEventListener("click", function () {
        activeLevel = lv.id;
        renderPath();
        applyLevelToPad(lv);
        status("Path · " + lv.id + " " + lv.title);
      });
      grid.appendChild(card);
    });
  }

  function renderJournal() {
    var host = $("cal-practice-journal");
    if (!host) return;
    var rows = journal.slice(0, MAX_SHOW);
    if (!rows.length) {
      host.innerHTML = '<p class="panel-note">No sessions yet — start a timed practice, then Complete session.</p>';
      return;
    }
    var more = journal.length > MAX_SHOW;
    var html = '<ul class="cal-journal-list">';
    rows.forEach(function (row) {
      html +=
        "<li><time>" + (row.when || "") + "</time> · <strong>" + (row.levelId || "") + "</strong> · " +
        (row.glyph || "stroke") + " · " + (row.seconds || 0) + "s · " + (row.strokes || 0) + " strokes" +
        (row.note ? "<br/>" + escapeHtml(row.note) : "") +
        "</li>";
    });
    html += "</ul>";
    if (more) {
      html +=
        '<button type="button" class="btn" id="cal-journal-expand">Show all ' +
        journal.length +
        " entries</button>";
    }
    host.innerHTML = html;
    var ex = $("cal-journal-expand");
    if (ex) {
      ex.addEventListener("click", function () {
        var all = journal
          .map(function (row) {
            return (
              "<li><time>" + (row.when || "") + "</time> · <strong>" + (row.levelId || "") + "</strong> · " +
              (row.glyph || "") + " · " + (row.seconds || 0) + "s</li>"
            );
          })
          .join("");
        host.innerHTML = '<ul class="cal-journal-list">' + all + "</ul>";
      });
    }
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function status(msg) {
    var el = $("cal-status");
    if (el) el.textContent = msg || "";
  }

  function applyLevelToPad(lv) {
    /* Best-effort: set script pills / glyph if pad API present */
    try {
      if (w.CraftCalligPad && typeof w.CraftCalligPad.setFocus === "function") {
        w.CraftCalligPad.setFocus(lv.script, lv.glyphs[0]);
        return;
      }
      var scripts = d.querySelectorAll("#cal-scripts [data-script]");
      scripts.forEach(function (b) {
        if (b.getAttribute("data-script") === lv.script) b.click();
      });
      setTimeout(function () {
        var g = lv.glyphs[0];
        d.querySelectorAll("#cal-glyphs button").forEach(function (b) {
          if (b.textContent.trim() === g || (g && g.indexOf(b.textContent.trim()) === 0)) b.click();
        });
      }, 120);
    } catch (e) {}
  }

  function tickSession() {
    var live = $("cal-session-live");
    if (!session.open || !live) return;
    var sec = Math.floor((Date.now() - session.started) / 1000);
    live.textContent = sec + "s";
  }

  function startSession() {
    session.open = true;
    session.started = Date.now();
    session.strokes = 0;
    session.levelId = activeLevel;
    var lv = levelById(activeLevel);
    session.glyph = (lv.glyphs && lv.glyphs[0]) || "";
    if (session.timer) clearInterval(session.timer);
    session.timer = setInterval(tickSession, 500);
    tickSession();
    status("Session live · write with presence · Complete when ready");
    var btn = $("cal-session-start");
    if (btn) btn.disabled = true;
    var done = $("cal-session-complete");
    if (done) done.disabled = false;
  }

  function completeSession() {
    if (!session.open) {
      status("Start a session first");
      return;
    }
    session.open = false;
    if (session.timer) clearInterval(session.timer);
    var sec = Math.max(1, Math.floor((Date.now() - session.started) / 1000));
    var noteEl = $("cal-session-note");
    var note = noteEl ? String(noteEl.value || "").trim().slice(0, 180) : "";
    /* stroke count from pad if available */
    var strokes = session.strokes;
    try {
      if (w.CraftCalligPad && typeof w.CraftCalligPad.strokeCount === "function") {
        strokes = w.CraftCalligPad.strokeCount();
      }
    } catch (e) {}

    var row = {
      when: new Date().toISOString().replace("T", " ").slice(0, 16),
      levelId: session.levelId,
      glyph: session.glyph,
      seconds: sec,
      strokes: strokes,
      note: note
    };
    journal.unshift(row);
    path[session.levelId] = (path[session.levelId] || 0) + 1;
    save();
    renderStats();
    renderPath();
    renderJournal();
    if (noteEl) noteEl.value = "";
    var btn = $("cal-session-start");
    if (btn) btn.disabled = false;
    var done = $("cal-session-complete");
    if (done) done.disabled = true;
    var live = $("cal-session-live");
    if (live) live.textContent = "—";
    status("Session saved on-device · path meter updated · educational only");
  }

  function exportProgress() {
    var blob = new Blob(
      [JSON.stringify({ journal: journal, path: path, exported: new Date().toISOString(), educational: true }, null, 2)],
      { type: "application/json" }
    );
    var a = d.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clarity-craft-callig-progress-" + Date.now() + ".json";
    a.click();
    status("Progress JSON downloaded · stays yours");
  }

  function resetAll() {
    if (!w.confirm("Reset calligraphy journal and path meters on this device?")) return;
    journal = [];
    path = {};
    save();
    renderStats();
    renderPath();
    renderJournal();
    status("Journal & meters reset");
  }

  function injectUI() {
    if ($("cal-curriculum-root")) return;
    var main = d.querySelector("main.craft-main") || d.querySelector("main");
    if (!main) return;

    var flow = d.createElement("div");
    flow.className = "cal-flow";
    flow.setAttribute("aria-label", "Practice flow");
    flow.innerHTML =
      '<span class="cal-flow-step"><strong>1</strong> Curriculum</span>' +
      '<span class="cal-flow-step"><strong>2</strong> Pad</span>' +
      '<span class="cal-flow-step"><strong>3</strong> Session</span>' +
      '<span class="cal-flow-step"><strong>4</strong> Journal</span>';
    main.insertBefore(flow, main.firstChild);

    var curr = d.createElement("section");
    curr.className = "cal-glass tool-section";
    curr.id = "cal-curriculum-root";
    curr.innerHTML =
      "<h2>1 · Curriculum path</h2>" +
      '<p class="panel-note">L0→L6 research-aligned path (Ruqʿah → Naskh → Thuluth → living words). Meters move when you <strong>Complete session</strong> — practice signals only, not grades.</p>' +
      '<div class="cal-stat-row">' +
      '<div class="cal-stat-card"><span>Sessions</span><strong id="cal-stat-sessions">0</strong></div>' +
      '<div class="cal-stat-card"><span>Levels ready</span><strong id="cal-stat-path">0/7</strong></div>' +
      '<div class="cal-stat-card"><span>Time on pad</span><strong id="cal-stat-time">0s</strong></div>' +
      "</div>" +
      '<div class="cal-level-grid" id="cal-level-grid"></div>';

    var padSec = d.getElementById("cal-fallback") || main.querySelector(".tool-section");
    if (padSec) main.insertBefore(curr, padSec);
    else main.appendChild(curr);

    /* session block after pad */
    var sess = d.createElement("section");
    sess.className = "cal-glass tool-section";
    sess.id = "cal-session-root";
    sess.innerHTML =
      "<h2>3 · Practice session</h2>" +
      '<p class="panel-note">Timed presence on the pad. Completing logs the journal and advances the active level meter.</p>' +
      '<div class="cal-session-bar">' +
      '<button type="button" class="btn primary" id="cal-session-start">Start session</button>' +
      '<button type="button" class="btn" id="cal-session-complete" disabled>Complete session</button>' +
      '<span class="live">Live: <strong id="cal-session-live">—</strong></span>' +
      "</div>" +
      '<label class="panel-note" style="display:block;margin-top:.4rem">Reflection (optional)<br/>' +
      '<input type="text" id="cal-session-note" maxlength="180" placeholder="What felt present in the stroke?" style="width:min(100%,24rem);margin-top:.25rem;padding:.4rem .55rem;border-radius:8px;border:1px solid rgba(201,162,39,.35);background:rgba(0,0,0,.2);color:inherit"/>' +
      "</label>";

    var journalSec = d.createElement("section");
    journalSec.className = "cal-glass tool-section";
    journalSec.id = "section-journal";
    journalSec.innerHTML =
      "<h2>4 · Practice journal</h2>" +
      '<p class="panel-note">Real sessions only. Showing <strong>5 most recent</strong> — expand for more. Counts feed curriculum meters in real time.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin:.4rem 0">' +
      '<button type="button" class="btn primary" id="cal-progress-export">Download progress JSON</button>' +
      '<button type="button" class="btn" id="cal-progress-reset">Reset journal &amp; meters</button>' +
      "</div>" +
      '<div id="cal-practice-journal"></div>';

    if (padSec && padSec.parentNode) {
      padSec.parentNode.insertBefore(sess, padSec.nextSibling);
      sess.parentNode.insertBefore(journalSec, sess.nextSibling);
    } else {
      main.appendChild(sess);
      main.appendChild(journalSec);
    }

    /* renumber pad heading if present */
    if (padSec) {
      var h = padSec.querySelector("h2");
      if (h && /Practice pad/i.test(h.textContent)) h.textContent = "2 · Practice pad";
    }

    $("cal-session-start").addEventListener("click", startSession);
    $("cal-session-complete").addEventListener("click", completeSession);
    $("cal-progress-export").addEventListener("click", exportProgress);
    $("cal-progress-reset").addEventListener("click", resetAll);
  }

  /* Surprise: after 3 sessions on a level, soft a composition prompt */
  function surprisePrompt() {
    var n = path[activeLevel] || 0;
    if (n > 0 && n % 3 === 0) {
      status("Surprise mashq · repeat the same letter three times on one baseline · educational only");
    }
  }
  var _complete = completeSession;
  completeSession = function () {
    _complete();
    surprisePrompt();
  };

  function boot() {
    load();
    injectUI();
    renderStats();
    renderPath();
    renderJournal();
  }

  w.CraftCalligCurriculum = {
    levels: LEVELS,
    logExternal: function (partial) {
      journal.unshift(
        Object.assign(
          {
            when: new Date().toISOString().replace("T", " ").slice(0, 16),
            levelId: activeLevel,
            glyph: "",
            seconds: 0,
            strokes: 0
          },
          partial || {}
        )
      );
      path[activeLevel] = (path[activeLevel] || 0) + 1;
      save();
      renderStats();
      renderPath();
      renderJournal();
    }
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 250); });
})(window, document);
