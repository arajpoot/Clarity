/**
 * Hifz studio enrich · 20261019HFZ
 * Coach steps, pull āyah via CuVersePractice, spaced marks list.
 * Does not replace studio.js — extends IDs when present.
 */
(function (g) {
  "use strict";
  if (g.__HIFZ_ENRICH_V1__) return;
  g.__HIFZ_ENRICH_V1__ = true;

  var KEY = "cu_hifz_marks_v1";
  var msgs = {
    listen: "Pull or tap a chip, then press Hear 2–3 times before you speak.",
    echo: "Text visible. Recite aloud after the master. One āyah is enough.",
    hide: "Press Hide text. Recall from memory, then Show to check.",
    mark: "Mark practiced to place this āyah on your spaced list (this device only)."
  };

  function $(id) { return document.getElementById(id); }

  function loadMarks() {
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }
  function saveMarks(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, 80)));
    } catch (e) {}
  }

  function renderList() {
    var host = $("hf-spaced-list");
    if (!host) return;
    var list = loadMarks().slice().sort(function (a, b) {
      return (b.ts || 0) - (a.ts || 0);
    });
    if (!list.length) {
      host.innerHTML = "<li class=\"hf-muted\">No marks yet — practice an āyah and press Mark practiced.</li>";
      return;
    }
    host.innerHTML = list
      .map(function (m) {
        var tag = m.weak ? "weak" : "steady";
        var label = m.weak ? "weak" : "steady";
        return (
          "<li><span><strong>" +
          String(m.ref || "").replace(/</g, "") +
          '</strong> <span class="hf-tag ' +
          tag +
          '">' +
          label +
          "</span></span>" +
          '<span><button type="button" class="hf-btn ghost" data-hf-open="' +
          String(m.ref || "") +
          '">Open</button> ' +
          '<button type="button" class="hf-btn ghost" data-hf-weak="' +
          String(m.ref || "") +
          '">Toggle weak</button> ' +
          '<button type="button" class="hf-btn ghost" data-hf-del="' +
          String(m.ref || "") +
          '">Remove</button></span></li>'
        );
      })
      .join("");
  }

  function currentRef() {
    var meta = ($("hifz-meta") && $("hifz-meta").textContent) || "";
    var m = meta.match(/(\d+)\s*:\s*(\d+)/);
    if (m) return m[1] + ":" + m[2];
    var s = $("hifz-surah") && $("hifz-surah").value;
    var a = $("hifz-ayah") && $("hifz-ayah").value;
    if (s && a) return s + ":" + a;
    return "";
  }

  function markCurrent(weak) {
    var ref = currentRef();
    if (!ref) return;
    var list = loadMarks().filter(function (x) {
      return x.ref !== ref;
    });
    list.unshift({ ref: ref, ts: Date.now(), weak: !!weak });
    saveMarks(list);
    renderList();
    if ($("hifz-status")) $("hifz-status").textContent = "Marked " + ref + " on this device";
  }

  function openRef(ref) {
    var parts = String(ref).split(":");
    if (parts.length < 2) return;
    var s = $("hifz-surah");
    var a = $("hifz-ayah");
    if (s) s.value = parts[0];
    if (a) a.value = parts[1];
    var chip = document.querySelector('[data-hifz="' + ref + '"]');
    if (chip) chip.click();
    else if ($("hifz-pull")) $("hifz-pull").click();
  }

  function pullAyah() {
    var VP = g.CuVersePractice;
    var s = ($("hifz-surah") && $("hifz-surah").value) || "1";
    var a = ($("hifz-ayah") && $("hifz-ayah").value) || "1";
    if (!VP || !VP.fetchAyah) {
      if ($("hifz-status")) $("hifz-status").textContent = "Verse helper missing — use chips.";
      return;
    }
    if ($("hifz-status")) $("hifz-status").textContent = "Loading…";
    VP.fetchAyah(s, a).then(function (p) {
      if ($("hifz-ar")) {
        $("hifz-ar").textContent = p.ar;
        $("hifz-ar").style.visibility = "visible";
      }
      if ($("hifz-en")) {
        $("hifz-en").textContent = p.en;
        $("hifz-en").style.visibility = "visible";
      }
      if ($("hifz-meta")) $("hifz-meta").textContent = "Qurʾān " + p.surah + ":" + p.ayah;
      var q = $("hifz-quran");
      if (q) q.href = "https://quran.com/" + p.surah + "/" + p.ayah;
      g.__hifzLast = p;
      if ($("hifz-status")) $("hifz-status").textContent = "Ready · self-check only";
    });
  }

  function fillSurah() {
    var VP = g.CuVersePractice;
    var sel = $("hifz-surah");
    if (VP && VP.fillSurahSelect && sel) VP.fillSurahSelect(sel);
  }

  function boot() {
    fillSurah();
    renderList();

    var coach = $("hf-coach");
    var msg = $("hf-coach-msg");
    if (coach) {
      coach.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-step]");
        if (!b) return;
        coach.querySelectorAll("[data-step]").forEach(function (x) {
          x.classList.toggle("on", x === b);
        });
        var k = b.getAttribute("data-step");
        if (msg) msg.textContent = msgs[k] || "";
        if (k === "listen" && $("hifz-hear")) $("hifz-hear").focus();
        if (k === "hide" && $("hifz-hide")) $("hifz-hide").click();
        if (k === "echo" && $("hifz-show")) $("hifz-show").click();
        if (k === "mark") markCurrent(false);
      });
    }

    if ($("hifz-pull")) $("hifz-pull").addEventListener("click", pullAyah);

    /* Enhance mark button if studio.js already wired it */
    var markBtn = $("hifz-mark");
    if (markBtn) {
      markBtn.addEventListener("click", function () {
        setTimeout(function () {
          markCurrent(false);
        }, 0);
      });
    }

    if ($("hf-refresh-list")) $("hf-refresh-list").addEventListener("click", renderList);
    if ($("hf-clear-weak")) {
      $("hf-clear-weak").addEventListener("click", function () {
        saveMarks(
          loadMarks().map(function (m) {
            m.weak = false;
            return m;
          })
        );
        renderList();
      });
    }

    var list = $("hf-spaced-list");
    if (list) {
      list.addEventListener("click", function (ev) {
        var open = ev.target.closest("[data-hf-open]");
        var weak = ev.target.closest("[data-hf-weak]");
        var del = ev.target.closest("[data-hf-del]");
        if (open) openRef(open.getAttribute("data-hf-open"));
        if (weak) {
          var ref = weak.getAttribute("data-hf-weak");
          saveMarks(
            loadMarks().map(function (m) {
              if (m.ref === ref) m.weak = !m.weak;
              return m;
            })
          );
          renderList();
        }
        if (del) {
          var r = del.getAttribute("data-hf-del");
          saveMarks(
            loadMarks().filter(function (m) {
              return m.ref !== r;
            })
          );
          renderList();
        }
      });
    }

    /* Hear via verse practice if available */
    var hear = $("hifz-hear");
    if (hear) {
      hear.addEventListener("click", function () {
        var VP = g.CuVersePractice;
        var last = g.__hifzLast;
        if (VP && last && VP.playAudio) {
          VP.playAudio(last.audio || VP.audioUrl(last.surah, last.ayah));
        }
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
