/*! companion-tab-meta-v1 · M3 concat about-mount + hadith-governance · enrichment held */

/*! companion-about-mount-v1 · feedback + about wiring inside shell mount
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ABOUT_MOUNT_V1__) return;
  w.__COMPANION_ABOUT_MOUNT_V1__ = true;

  var FEEDBACK_TO = "feedback@clarity-dawah.fyi";
  var FEEDBACK_API = "/api/feedback";

  function allowFeedback() {
    try {
      w.CLARITY_SHARIAH_ALLOW_HOSTS = w.CLARITY_SHARIAH_ALLOW_HOSTS || [];
      ["clarity-dawah.fyi", "www.clarity-dawah.fyi", (w.location && w.location.hostname) || ""].forEach(function (h) {
        if (h && w.CLARITY_SHARIAH_ALLOW_HOSTS.indexOf(h) < 0) w.CLARITY_SHARIAH_ALLOW_HOSTS.push(h);
      });
      var prev = w.clarityShariahCheckUrl;
      w.clarityShariahCheckUrl = function (url) {
        try {
          var u = new URL(String(url || ""), w.location.href);
          if ((u.pathname || "").indexOf("/api/feedback") === 0) return { ok: true, reason: "feedback-exempt", educationalOnly: true };
          if (u.hostname === (w.location.hostname || "")) return { ok: true, reason: "same-origin", educationalOnly: true };
        } catch (e) {}
        return typeof prev === "function" ? prev(url) : { ok: true, educationalOnly: true };
      };
      w.clarityShariahCheckUrl.__clarityFeedbackAllow = true;
    } catch (e) {}
  }

  function root() {
    return d.querySelector("#cs-mount [data-cs-mounted='about']") || d.querySelector("#cs-mount") || d;
  }

  function wireFeedback(scope) {
    allowFeedback();
    var type = "suggestion";
    scope.querySelectorAll("[data-caf-type]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        scope.querySelectorAll("[data-caf-type]").forEach(function (c) {
          c.classList.toggle("is-on", c === chip);
        });
        type = chip.getAttribute("data-caf-type") || "suggestion";
      });
    });
    var ta = scope.querySelector("#caf-message");
    var status = scope.querySelector("#caf-status");
    function setStatus(msg) {
      if (status) status.textContent = msg || "";
    }
    var send = scope.querySelector("#caf-send");
    if (send) {
      send.addEventListener("click", function () {
        var msg = (ta && ta.value) || "";
        if (!msg.trim()) {
          setStatus("Write a short note first.");
          return;
        }
        setStatus("Sending…");
        fetch(FEEDBACK_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: type,
            message: msg,
            room: "companion",
            tab: "about",
            path: (w.ClarityCompanionShell && w.ClarityCompanionShell.getPath && w.ClarityCompanionShell.getPath()) || ""
          })
        })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            setStatus("Received — Jazak Allah khayr. Educational inbox only.");
            if (ta) ta.value = "";
          })
          .catch(function () {
            setStatus("Could not send directly. Use Copy or Mail app (optional).");
          });
      });
    }
    var copy = scope.querySelector("#caf-copy");
    if (copy) {
      copy.addEventListener("click", function () {
        var msg = (ta && ta.value) || "";
        var body = "Clarity app feedback\nType: " + type + "\n\n" + msg;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(body).then(function () {
            setStatus("Copied.");
          });
        } else setStatus("Copy not available on this device.");
      });
    }
    var mail = scope.querySelector("#caf-mail");
    if (mail) {
      mail.addEventListener("click", function () {
        var msg = (ta && ta.value) || "";
        var href =
          "mailto:" +
          FEEDBACK_TO +
          "?subject=" +
          encodeURIComponent("Clarity feedback · " + type) +
          "&body=" +
          encodeURIComponent(msg);
        w.location.href = href;
        setStatus("Mail app opened (optional). Prefer Send to Clarity when available.");
      });
    }
  }

  
  function wireLedger(scope) {
    var ta = scope.querySelector("#cs-ledger-note");
    var save = scope.querySelector("#cs-ledger-save");
    var status = scope.querySelector("#cs-ledger-status");
    var KEY = "cu_companion_ledger_return_v1";
    try { if (ta) ta.value = localStorage.getItem(KEY) || ""; } catch (e) {}
    if (save) {
      save.addEventListener("click", function () {
        try {
          localStorage.setItem(KEY, (ta && ta.value) || "");
          if (status) status.textContent = "Saved on this device.";
        } catch (e2) {
          if (status) status.textContent = "Could not save locally.";
        }
      });
    }
  }

  function wireNotes(scope) {
    var ta = scope.querySelector("#cs-quick-note");
    var save = scope.querySelector("#cs-note-save");
    var status = scope.querySelector("#cs-note-status");
    var KEY = "cu_companion_quick_note_v1";
    try {
      if (ta) ta.value = localStorage.getItem(KEY) || "";
    } catch (e) {}
    if (save) {
      save.addEventListener("click", function () {
        try {
          localStorage.setItem(KEY, (ta && ta.value) || "");
          if (status) status.textContent = "Saved on this device.";
        } catch (e2) {
          if (status) status.textContent = "Could not save locally.";
        }
      });
    }
  }

  function afterMount() {
    var about = d.querySelector("#cs-mount [data-cs-mounted='about']");
    if (about) wireFeedback(about);
    var notes = d.querySelector("#cs-mount [data-cs-mounted='notes']");
    if (notes) { wireNotes(notes); wireLedger(notes); }
  }

  /* Hook shell mount completion via MutationObserver limited to cs-mount — one shot debounce */
  var mount = d.getElementById("cs-mount");
  if (mount) {
    var t = null;
    var mo = new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(afterMount, 40);
    });
    mo.observe(mount, { childList: true });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", afterMount);
  else setTimeout(afterMount, 100);

  w.ClarityAboutMount = { wire: afterMount };
})(window, document);

/*! companion-hadith-governance-v1 · grade · collection · number mandatory on ḥadīth sparks
 * Educational only — not a fatwa. Verify on Sunnah.com / with a scholar.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_HADITH_GOV_V1__) return;
  w.__COMPANION_HADITH_GOV_V1__ = true;

  var SPARKS = [
    {
      t: "Actions are but by intention, and every person will have but that which they intended.",
      grade: "Ṣaḥīḥ",
      collection: "Bukhārī",
      number: "1",
      also: "Muslim 1907"
    },
    {
      t: "None of you truly believes until he loves for his brother what he loves for himself.",
      grade: "Ṣaḥīḥ",
      collection: "Bukhārī",
      number: "13",
      also: "Muslim 45"
    },
    {
      t: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
      grade: "Ṣaḥīḥ",
      collection: "Bukhārī",
      number: "6475",
      also: "Muslim 47"
    },
    {
      t: "The strong person is not the one who overcomes people by his strength, but the one who controls himself while angry.",
      grade: "Ṣaḥīḥ",
      collection: "Bukhārī",
      number: "6114",
      also: "Muslim 2609"
    },
    {
      t: "Make things easy and do not make them difficult; give glad tidings and do not drive people away.",
      grade: "Ṣaḥīḥ",
      collection: "Bukhārī",
      number: "69",
      also: "Muslim 1734"
    }
  ];

  function cite(h) {
    var line = h.grade + " · " + h.collection + " " + h.number;
    if (h.also) line += " · also " + h.also;
    return line + " · verify on Sunnah.com · educational only — not a fatwa";
  }

  function paintInto(host, h) {
    if (!host) return;
    host.innerHTML =
      '<p class="hadith-text" style="line-height:1.5;margin:0.35rem 0">' +
      h.t +
      "</p>" +
      '<p class="hadith-cite td-src" style="font-size:0.82rem;margin:0.25rem 0 0"><strong>' +
      h.grade +
      "</strong> · " +
      h.collection +
      " " +
      h.number +
      (h.also ? " · " + h.also : "") +
      " · verify on Sunnah.com · educational only — not a fatwa</p>";
  }

  var idx = Math.floor(Date.now() / 86400000) % SPARKS.length;

  function loadHadith() {
    idx = (idx + 1) % SPARKS.length;
    var host = d.querySelector("#cs-mount #hadith") || d.getElementById("hadith");
    paintInto(host, SPARKS[idx]);
  }

  w.loadHadith = loadHadith;

  function bindMounted() {
    var root = d.getElementById("cs-mount") || d;
    var host = root.querySelector("#hadith");
    if (host) {
      paintInto(host, SPARKS[idx]);
      var btn = host.parentElement && host.parentElement.querySelector("button[onclick*='loadHadith']");
      if (btn && !btn.__gov) {
        btn.__gov = true;
        btn.addEventListener("click", function (ev) {
          ev.preventDefault();
          loadHadith();
        });
      }
    }
    // data-engine hadith
    root.querySelectorAll("[data-engine='hadith']").forEach(function (eng) {
      var t = eng.querySelector("[data-hadith-text]");
      var s = eng.querySelector("[data-hadith-src]");
      var h = SPARKS[idx];
      if (t) t.textContent = h.t;
      if (s) s.textContent = cite(h);
    });
  }

  function boot() {
    bindMounted();
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(bindMounted, 40);
      }).observe(mount, { childList: true, subtree: false });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

