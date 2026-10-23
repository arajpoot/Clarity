/* 20261023HK2 */
/* 20261023C4 */
/* 20261023CLEAN cleanse */
/**
 * cu-seq-desk-v1.js — Desk modules + live teacher guidance
 * Educational personas only — not living scholars or fatwa service.
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_DESK_V1__) return;
  g.__CU_SEQ_DESK_V1__ = true;

  var GUIDE = {
    seeker: {
      name: "Essentials guide",
      role: "Educational persona for Seeker stage",
      tips: {
        default: "Hold tawḥīd first. Small sincere practice beats long debate. When unsure of a ruling, stop and ask a living teacher."
      }
    },
    practice: {
      name: "Foundations guide",
      role: "Educational persona for Practice stage",
      tips: {
        default: "Map the outward acts carefully. This page does not settle disputed details of purity or prayer — verify with a trusted teacher."
      }
    },
    consistency: {
      name: "Consistency guide",
      role: "Educational persona for Consistency stage",
      tips: {
        default: "Return after you slip. Review what you already know before adding more. Mercy and presence matter more than speed."
      }
    },
    transmission: {
      name: "Transmission guide",
      role: "Educational persona for Transmission stage",
      tips: {
        default: "Name your sources. Do not share what you cannot verify. When the text does not settle a point, ask a trusted teacher — this page issues no verdict."
      }
    }
  };

  function $(id) {
    return document.getElementById(id);
  }

  function stageFromPage() {
    var b = document.body;
    var r = (b && b.getAttribute("data-phase-room")) || "";
    if (r) return r;
    var p = (location.pathname || "").replace(/\/+$/, "");
    var m = p.match(/\/campus\/desk\/(seeker|practice|consistency|transmission)/);
    return m ? m[1] : "seeker";
  }

  function hashModule() {
    var h = (location.hash || "").replace(/^#/, "");
    if (h.indexOf("m=") === 0) return decodeURIComponent(h.slice(2));
    var q = h.match(/(?:^|&)m=([^&]+)/);
    return q ? decodeURIComponent(q[1]) : null;
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function sourceHtml(src) {
    if (!src) return "";
    var link = src.href
      ? ' <a class="seq-inline" href="' + esc(src.href) + '" target="_blank" rel="noopener">Open source</a>'
      : "";
    return (
      '<p class="seq-source"><strong>Source</strong> · ' +
      esc(src.ref || "") +
      (src.en ? " — " + esc(src.en) : "") +
      link +
      "</p>"
    );
  }

  function teacherHtml(stage, mod) {
    var g0 = GUIDE[stage] || GUIDE.seeker;
    var tip = (mod && mod.adab) || g0.tips.default;
    var extra =
      stage === "transmission" || (mod && /settle|teacher|verdict/i.test(mod.explanation || ""))
        ? '<p class="seq-teacher-stop"><strong>Limit</strong> · The text does not settle disputed rulings here. Ask a trusted teacher. This page does not issue a verdict.</p>'
        : "";
    return (
      '<aside class="seq-teacher" aria-label="Teacher guidance">' +
      '<div class="seq-teacher-head">' +
      "<strong>Teacher guidance</strong> · " +
      esc(g0.name) +
      "</div>" +
      '<p class="seq-teacher-role">' +
      esc(g0.role) +
      " — not a living scholar or fatwa service.</p>" +
      "<p>" +
      esc(tip) +
      "</p>" +
      extra +
      '<p class="seq-teacher-actions">' +
      '<a class="seq-btn" href="/campus/faculty.html">Faculty guides</a> ' +
      '<a class="seq-btn" href="/charter/">Charter limits</a>' +
      "</p>" +
      "</aside>"
    );
  }

  function render() {
    var root = $("seq-desk-root");
    if (!root) return;

    if (!g.CuSeq || !g.CU_SEQ_MODULES) {
      root.innerHTML =
        '<p class="seq-wait">Loading modules…</p>';
      return false;
    }

    var stage = stageFromPage();
    var unlocked = g.CuSeq.isStageUnlocked(stage);
    var mods = g.CuSeq.modulesFor(stage) || [];
    var next = g.CuSeq.getNext();
    var focus = hashModule();

    if (!mods.length) {
      root.innerHTML =
        '<p class="seq-wait">No modules found for this stage. Check that <code>cu-seq-modules-v1.js</code> loaded.</p>';
      return true;
    }

    if (!focus && next && next.stage === stage) focus = next.moduleId;
    if (!focus) focus = mods[0].id;

    var status =
      '<div class="seq-status" role="status">' +
      "<div><strong>You are here</strong> · " +
      esc(g.CuSeq.stageLabel(stage)) +
      "</div>" +
      "<div><strong>Next required</strong> · " +
      (next && next.moduleId
        ? esc(
            (
              (g.CuSeq.modulesFor(next.stage) || []).filter(function (m) {
                return m.id === next.moduleId;
              })[0] || {}
            ).title || next.moduleId
          ) +
          (next.stage !== stage
            ? ' <a href="' + esc(g.CuSeq.deskHref(next.stage, next.moduleId)) + '">Open →</a>'
            : "")
        : next && next.allDone
        ? "All sequential modules marked on this device"
        : "—") +
      "</div></div>";

    if (!unlocked) {
      var prev = g.CuSeq.STAGES[g.CuSeq.STAGES.indexOf(stage) - 1];
      root.innerHTML =
        status +
        '<div class="seq-lock">' +
        "<p><strong>Stage locked</strong> — complete <em>" +
        esc(g.CuSeq.stageLabel(prev)) +
        "</em> first. Nothing before its proper time.</p>" +
        '<p><a class="seq-btn primary" href="' +
        esc(g.CuSeq.deskHref(prev)) +
        '">Open previous stage →</a></p>' +
        teacherHtml(stage, null) +
        "</div>";
      return true;
    }

    var list =
      '<ol class="seq-mod-list">' +
      mods
        .map(function (m, i) {
          var done = g.CuSeq.isModuleDone(m.id);
          var prevDone = i === 0 || g.CuSeq.isModuleDone(mods[i - 1].id);
          var openable = prevDone || done;
          var here = focus === m.id;
          return (
            '<li class="seq-mod-item' +
            (done ? " done" : "") +
            (here ? " here" : "") +
            (openable ? "" : " locked") +
            '">' +
            '<button type="button" class="seq-mod-open" data-mid="' +
            esc(m.id) +
            '"' +
            (openable ? "" : " disabled") +
            ">" +
            (done ? "✓ " : openable ? "" : "🔒 ") +
            esc(m.title) +
            "</button></li>"
          );
        })
        .join("") +
      "</ol>";

    var mod = mods.filter(function (m) {
      return m.id === focus;
    })[0] || mods[0];

    var quizHtml = "";
    if (mod.quiz && mod.quiz.length) {
      quizHtml =
        '<div class="seq-quiz">' +
        mod.quiz
          .map(function (item, qi) {
            return (
              '<fieldset data-qi="' +
              qi +
              '"><legend>' +
              esc(item.q) +
              "</legend>" +
              (item.opts || [])
                .map(function (opt, oi) {
                  return (
                    '<label><input type="radio" name="sq-' +
                    qi +
                    '" value="' +
                    oi +
                    '"/> ' +
                    esc(opt) +
                    "</label>"
                  );
                })
                .join("") +
              "</fieldset>"
            );
          })
          .join("") +
        "</div>";
    }

    var done = g.CuSeq.isModuleDone(mod.id);
    var detail =
      '<article class="seq-detail" id="seq-detail">' +
      "<h2>" +
      esc(mod.title) +
      "</h2>" +
      '<p class="seq-aim"><strong>Aim</strong> · ' +
      esc(mod.aim) +
      "</p>" +
      sourceHtml(mod.source) +
        (mod.source && mod.source.audio
          ? '<p class="seq-audio"><audio controls preload="none" src="' +
            esc(mod.source.audio) +
            '"></audio> <span class="seq-audio-label">Listen (source)</span></p>'
          : '') +
        (mod.minutes ? '<p class="seq-mins">About ' + esc(String(mod.minutes)) + ' minutes</p>' : '') +
      (mod.explanation
        ? '<div class="seq-explain"><strong>Learn</strong><p>' +
          esc(mod.explanation) +
          "</p></div>"
        : "") +
      (mod.points && mod.points.length
        ? '<ul class="seq-points">' +
          mod.points
            .map(function (p) {
              return "<li>" + esc(p) + "</li>";
            })
            .join("") +
          "</ul>"
        : "") +
      (mod.action ? "<p><strong>Action</strong> · " + esc(mod.action) + "</p>" : "") +
      (mod.goDeeper && mod.goDeeper.href
        ? '<p><a class="seq-btn" href="' +
          esc(mod.goDeeper.href) +
          '" target="_blank" rel="noopener">' +
          esc(mod.goDeeper.label || "Go deeper") +
          " →</a></p>"
        : "") +
      quizHtml +
      (mod.labLink
        ? '<p><a class="seq-btn" href="' + esc(mod.labLink) + '">Open related lab →</a></p>'
        : "") +
      teacherHtml(stage, mod) +
      '<div class="seq-actions">' +
      (done
        ? '<span class="seq-done-label">Marked done on this device ✓</span>'
        : '<button type="button" class="seq-btn primary" id="seq-mark">Mark done</button>') +
      '<button type="button" class="seq-btn" id="seq-next">Next module</button>' +
      "</div>" +
      '<p class="seq-foot">Educational only — not a fatwa. Not a grade of īmān.</p>' +
      "</article>";

    root.innerHTML = status + '<div class="seq-grid">' + list + detail + "</div>";

    root.querySelectorAll(".seq-mod-open").forEach(function (btn) {
      btn.onclick = function () {
        location.hash = "m=" + encodeURIComponent(btn.getAttribute("data-mid"));
        render();
      };
    });

    var mark = $("seq-mark");
    if (mark && mod) {
      mark.onclick = function () {
        var ok = true;
        if (mod.quiz && mod.quiz.length) {
          mod.quiz.forEach(function (item, qi) {
            var picked = root.querySelector('input[name="sq-' + qi + '"]:checked');
            if (!picked || parseInt(picked.value, 10) !== item.a) ok = false;
          });
          if (!ok) {
            alert("Answer the short check first (educational only), then mark done.");
            return;
          }
        }
        g.CuSeq.markModuleDone(mod.id);
        render();
      };
    }

    var nextBtn = $("seq-next");
    if (nextBtn) {
      nextBtn.onclick = function () {
        var n = g.CuSeq.getNext();
        if (n && n.moduleId) {
          if (n.stage === stage) {
            location.hash = "m=" + encodeURIComponent(n.moduleId);
            render();
          } else {
            location.href = g.CuSeq.deskHref(n.stage, n.moduleId);
          }
        } else {
          alert("All sequential modules marked on this device. Keep learning with a living teacher.");
        }
      };
    }
    return true;
  }

  function boot() {
    if (!$("seq-desk-root")) return;
    var tries = 0;
    function attempt() {
      tries++;
      var ok = render();
      if (!ok && tries < 25) {
        setTimeout(attempt, 80);
      }
    }
    attempt();
    window.addEventListener("hashchange", function () {
      render();
    });
    document.addEventListener("cu-seq-progress", function () {
      render();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
