/* Clarity Curriculum Sequential Engine v1
 * Factory: register phase curricula with ordered modules + checkmarks.
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CURRICULUM_ENGINE_V1__) return;
  g.__CLARITY_CURRICULUM_ENGINE_V1__ = true;

  var registry = {};

  function flatFromUnits(UNITS) {
    var list = [];
    (UNITS || []).forEach(function (u, ui) {
      (u.lessons || []).forEach(function (les) {
        list.push({ unit: u, unitIndex: ui, lesson: les, moduleIndex: list.length });
      });
    });
    return list;
  }

  function createTrack(cfg) {
    var phase = cfg.phase;
    var progressKey = cfg.progressKey;
    var UNITS = cfg.UNITS;
    var cardId = cfg.cardId;
    var bodyId = cfg.bodyId;
    var progId = cfg.progId;
    var title = cfg.title || ("Phase " + phase);
    var tabId = cfg.tabId || null;
    var pathKey = cfg.pathKey || "";

    function loadProgress() {
      try {
        return JSON.parse(localStorage.getItem(progressKey) || "{}") || {};
      } catch (e) {
        return {};
      }
    }
    function saveProgress(p) {
      try {
        localStorage.setItem(progressKey, JSON.stringify(p));
      } catch (e) {}
    }
    function isDone(id) {
      var p = loadProgress();
      return !!(p[id] && p[id].done);
    }
    function flat() {
      return flatFromUnits(UNITS);
    }
    function total() {
      return flat().length;
    }
    function doneCount() {
      var n = 0;
      flat().forEach(function (m) {
        if (isDone(m.lesson.id)) n++;
      });
      return n;
    }
    function allComplete() {
      return total() > 0 && doneCount() >= total();
    }
    function activeIndex() {
      var mods = flat();
      for (var i = 0; i < mods.length; i++) {
        if (!isDone(mods[i].lesson.id)) return i;
      }
      return mods.length;
    }
    function markDone(lessonId) {
      var mods = flat();
      var act = activeIndex();
      var allowed = mods[act] && mods[act].lesson.id === lessonId;
      if (!allowed && !isDone(lessonId)) {
        alert("Complete modules in order — finish the current open module first.");
        return false;
      }
      var p = loadProgress();
      p[lessonId] = { done: true, at: Date.now() };
      saveProgress(p);
      render();
      try {
        g.dispatchEvent(
          new CustomEvent("clarity-curriculum-progress", {
            detail: { phase: phase, id: lessonId, all: allComplete() }
          })
        );
      } catch (e) {}
      if (allComplete() && typeof g.clarityOpenPhaseQuiz === "function") {
        setTimeout(function () {
          g.clarityOpenPhaseQuiz(phase);
        }, 400);
      }
      return true;
    }

    function openCard(id) {
      if (!id) return;
      var el = document.getElementById(id);
      if (!el) return;
      try {
        el.classList.remove("gate-hidden", "hidden");
        el.hidden = false;
        el.style.removeProperty("display");
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {}
    }

    function ensureCard() {
      var card = document.getElementById(cardId);
      if (!card) {
        card = document.createElement("section");
        card.id = cardId;
        card.className = "card curriculum-phase-card";
        card.innerHTML =
          "<h2 class=\"card-title\">" +
          title +
          "</h2>" +
          '<p class="card-lead">One module at a time. Answer a short spark quiz to unlock the next. Pass the phase quiz to advance. Educational only.</p>' +
          '<div id="' +
          progId +
          '" class="junior-progress curriculum-progress"></div>' +
          '<div id="' +
          bodyId +
          '" class="junior-body curriculum-body"></div>';
        var host =
          (tabId && document.querySelector("#" + tabId + " .rrra-hub-body")) ||
          (tabId && document.getElementById(tabId)) ||
          document.getElementById("main-application-workspace") ||
          document.body;
        try {
          host.insertBefore(card, host.firstChild);
        } catch (e) {
          host.appendChild(card);
        }
      }
      try {
        card.setAttribute("data-curriculum-phase", String(phase));
        card.setAttribute("data-curriculum-exclusive", "1");
        if (pathKey) card.setAttribute("data-clarity-path", pathKey);
      } catch (e2) {}
      return card;
    }

    function render() {
      ensureCard();
      var prog = document.getElementById(progId);
      var body = document.getElementById(bodyId);
      if (!prog || !body) return;
      var mods = flat();
      var d = doneCount();
      var t = mods.length;
      var pct = t ? Math.round((100 * d) / t) : 0;
      var active = activeIndex();

      prog.innerHTML =
        '<div class="junior-bar"><div class="junior-bar-fill" style="width:' +
        pct +
        '%"></div></div>' +
        '<span class="junior-prog-label">' +
        d +
        " / " +
        t +
        " modules · " +
        pct +
        "%</span>" +
        (allComplete()
          ? '<button type="button" class="junior-phase-quiz-btn" data-phase-quiz="' +
            phase +
            '">Phase quiz — unlock next phase</button>'
          : '<span class="junior-lock-hint">Complete modules in order. Next phase stays locked until all are checked and you pass the quiz.</span>');

      var html = "";
      var lastUnitId = null;
      mods.forEach(function (m) {
        var les = m.lesson;
        var unit = m.unit;
        var idx = m.moduleIndex;
        var done = isDone(les.id);
        var unlocked = idx <= active;
        var isCurrent = idx === active && !done;

        if (unit.id !== lastUnitId) {
          if (lastUnitId) html += "</article>";
          html += '<article class="junior-unit curriculum-unit">';
          html += "<h3>" + unit.title + "</h3>";
          if (unit.goal) html += '<p class="junior-goal">' + unit.goal + "</p>";
          lastUnitId = unit.id;
        }

        var stateClass = done ? " is-done" : isCurrent ? " is-current" : unlocked ? "" : " is-locked";
        html +=
          '<div class="junior-lesson' +
          stateClass +
          '" data-lesson="' +
          les.id +
          '">';
        html +=
          "<h4>" +
          (done ? "\u2713 " : isCurrent ? "\u25B6 " : unlocked ? "" : "\uD83D\uDD12 ") +
          les.title +
          (les.minutes ? " <small>(" + les.minutes + " min)</small>" : "") +
          "</h4>";

        if (!unlocked && !done) {
          html +=
            '<p class="junior-locked-msg">Locked — complete the previous module first.</p></div>';
          return;
        }

        html += "<ul>";
        (les.points || []).forEach(function (pt) {
          html += "<li>" + pt + "</li>";
        });
        html += "</ul>";
        if (les.ayah) {
          html +=
            '<blockquote class="junior-ayah"><strong>' +
            les.ayah.ref +
            "</strong> — " +
            (les.ayah.en || "") +
            "</blockquote>";
        }
        if (les.activity && les.activity.prompt) {
          html +=
            '<p class="curriculum-activity"><em>Activity:</em> ' +
            les.activity.prompt +
            "</p>";
        }
        /* Visual aide — lecture embed (lazy) */
        if (les.video) {
          var v = les.video;
          var src = "";
          if (v.list) {
            src = "https://www.youtube-nocookie.com/embed/videoseries?list=" + encodeURIComponent(v.list) + "&rel=0";
          } else if (v.id) {
            src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(v.id) + "?rel=0";
          }
          if (src) {
            html +=
              '<details class="curriculum-video-details"' +
              (v.open ? " open" : "") +
              ">" +
              "<summary class=\"curriculum-video-summary\">▶ " +
              (v.title || "Lecture / visual aide") +
              (v.mins ? " · ~" + v.mins + " min" : "") +
              "</summary>" +
              '<div class="curriculum-video-frame">' +
              '<iframe loading="lazy" title="' +
              (v.title || "Lecture").replace(/"/g, "") +
              '" src="' +
              src +
              '" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
              "</div>";
            if (v.note) {
              html += '<p class="curriculum-video-note">' + v.note + "</p>";
            }
            if (v.href) {
              html +=
                '<p class="curriculum-video-note"><a href="' +
                v.href +
                '" target="_blank" rel="noopener noreferrer">Open on YouTube</a> · Educational only — verify with a teacher.</p>';
            }
            html += "</details>";
          }
        }
        html += '<div class="junior-actions">';
        if (les.openCard) {
          html +=
            '<button type="button" class="mv-chip" data-open-card="' +
            les.openCard +
            '">Open related card</button>';
        }
        (les.links || []).forEach(function (lk) {
          html +=
            '<a class="mv-chip" href="' +
            lk.href +
            '" target="_blank" rel="noopener noreferrer">' +
            lk.label +
            "</a>";
        });
        if (!done) {
          html +=
            '<button type="button" class="mv-chip junior-done-btn junior-spark-btn" data-spark="' +
            les.id +
            '">✦ Prove it — unlock next</button>';
        } else {
          html += '<span class="junior-done-label">Unlocked with understanding \u2713</span>';
        }
        html += "</div></div>";
      });
      if (lastUnitId) html += "</article>";

      if (allComplete()) {
        html +=
          '<div class="junior-phase-complete"><strong>Phase ' +
          phase +
          " modules complete.</strong> Take the quiz to unlock the next phase." +
          '<button type="button" class="junior-phase-quiz-btn" data-phase-quiz="' +
          phase +
          '">Open phase quiz</button></div>';
      }

      body.innerHTML = html;
      body.onclick = function (ev) {
        var t = ev.target;
        if (!t) return;
        var sparkId = t.getAttribute && t.getAttribute("data-spark");
        if (sparkId) {
          var mods2 = flat();
          var act = activeIndex();
          var allowed = mods2[act] && mods2[act].lesson.id === sparkId;
          if (!allowed && !isDone(sparkId)) {
            alert("Complete modules in order — finish the current open module first.");
            return;
          }
          var lesObj = null;
          for (var mi = 0; mi < mods2.length; mi++) {
            if (mods2[mi].lesson.id === sparkId) {
              lesObj = mods2[mi].lesson;
              break;
            }
          }
          if (typeof g.clarityOpenModuleSparkQuiz === "function") {
            g.clarityOpenModuleSparkQuiz(sparkId, lesObj, function () {
              markDone(sparkId);
            });
          } else {
            markDone(sparkId);
          }
          return;
        }
        var mark = t.getAttribute && t.getAttribute("data-mark");
        if (mark) {
          markDone(mark);
          return;
        }
        var oc = t.getAttribute && t.getAttribute("data-open-card");
        if (oc) openCard(oc);
        var pq = t.getAttribute && t.getAttribute("data-phase-quiz");
        if (pq && typeof g.clarityOpenPhaseQuiz === "function") {
          g.clarityOpenPhaseQuiz(parseInt(pq, 10) || phase);
        }
      };
      var qbtns = document.querySelectorAll('[data-phase-quiz="' + phase + '"]');
      qbtns.forEach(function (b) {
        b.onclick = function () {
          if (typeof g.clarityOpenPhaseQuiz === "function") g.clarityOpenPhaseQuiz(phase);
        };
      });
    }

    function show(visible) {
      var card = ensureCard();
      if (!card) return;
      if (visible) {
        card.classList.remove("gate-hidden", "hidden");
        card.hidden = false;
        card.style.removeProperty("display");
        render();
      } else {
        card.classList.add("gate-hidden");
        card.style.setProperty("display", "none", "important");
      }
    }

    var api = {
      phase: phase,
      pathKey: pathKey,
      UNITS: UNITS,
      render: render,
      markDone: markDone,
      allComplete: allComplete,
      activeModuleIndex: activeIndex,
      totalLessons: total,
      doneCount: doneCount,
      show: show,
      ensureCard: ensureCard,
      cardId: cardId,
      tabId: tabId
    };
    registry[phase] = api;
    return api;
  }

  g.ClarityCurriculumEngine = {
    createTrack: createTrack,
    get: function (phase) {
      return registry[phase] || null;
    },
    all: function () {
      return registry;
    },
    flatFromUnits: flatFromUnits
  };
})(typeof window !== "undefined" ? window : this);
