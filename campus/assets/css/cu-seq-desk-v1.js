/**
 * cu-seq-desk-v1.js — Desk sequence UI: You are here, module list, mark done, locks
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_DESK_V1__) return;
  g.__CU_SEQ_DESK_V1__ = true;

  function $(id) { return document.getElementById(id); }

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
      ? ' <a href="' + esc(src.href) + '" target="_blank" rel="noopener">Open source</a>'
      : "";
    return (
      '<p class="seq-source"><strong>Source</strong> · ' +
      esc(src.ref || "") +
      (src.en ? " — " + esc(src.en) : "") +
      link +
      "</p>"
    );
  }

  function render() {
    var root = $("seq-desk-root");
    if (!root || !g.CuSeq || !g.CU_SEQ_MODULES) return;

    var stage = stageFromPage();
    var unlocked = g.CuSeq.isStageUnlocked(stage);
    var mods = g.CuSeq.modulesFor(stage);
    var next = g.CuSeq.getNext();
    var focus = hashModule();
    if (!focus && next && next.stage === stage) focus = next.moduleId;
    if (!focus && mods[0]) focus = mods[0].id;

    var status =
      '<div class="seq-status" role="status">' +
      "<div><strong>You are here</strong> · " +
      esc(g.CuSeq.stageLabel(stage)) +
      "</div>" +
      "<div><strong>Next required</strong> · " +
      (next && next.moduleId
        ? esc((mods.filter(function (m) { return m.id === next.moduleId; })[0] || {}).title || next.moduleId) +
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
        "</div>";
      return;
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

    var mod = mods.filter(function (m) { return m.id === focus; })[0] || mods[0];
    var detail = "";
    if (mod) {
      var done = g.CuSeq.isModuleDone(mod.id);
      var quizHtml = "";
      if (mod.quiz && mod.quiz.length) {
        quizHtml =
          '<div class="seq-quiz">' +
          mod.quiz
            .map(function (item, qi) {
              return (
                "<fieldset data-qi=\"" +
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
      detail =
        '<article class="seq-detail" id="seq-detail">' +
        "<h2>" +
        esc(mod.title) +
        "</h2>" +
        '<p class="seq-aim"><strong>Aim</strong> · ' +
        esc(mod.aim) +
        "</p>" +
        (mod.adab ? '<p class="seq-adab"><em>Adab · ' + esc(mod.adab) + "</em></p>" : "") +
        sourceHtml(mod.source) +
        (mod.action ? "<p><strong>Action</strong> · " + esc(mod.action) + "</p>" : "") +
        quizHtml +
        (mod.labLink
          ? '<p><a class="seq-btn" href="' + esc(mod.labLink) + '">Open related lab →</a></p>'
          : "") +
        '<div class="seq-actions">' +
        (done
          ? '<span class="seq-done-label">Marked done on this device ✓</span>'
          : '<button type="button" class="seq-btn primary" id="seq-mark">Mark done</button>') +
        '<button type="button" class="seq-btn" id="seq-next">Next module</button>' +
        "</div>" +
        '<p class="seq-foot">Educational only — not a fatwa. Not a grade of īmān.</p>' +
        "</article>";
    }

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
  }

  function boot() {
    if (!document.getElementById("seq-desk-root")) return;
    render();
    window.addEventListener("hashchange", render);
    document.addEventListener("cu-seq-progress", render);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
