/**
 * P1 On-device University Admission
 * localStorage only. Educational — not institutional enrolment.
 */
(function (g) {
  "use strict";
  if (g.__CU_ADMIT_V1__) return;
  g.__CU_ADMIT_V1__ = true;

  var ADMIT_KEY = "cu_uni_admitted_v1";
  var NAME_KEY = "clarity_learner_name_v1";
  var INTENT_KEY = "cu_uni_intent_v1";
  var LETTER_KEY = "cu_uni_admission_letter_v1";

  function loadAdmit() {
    try { return JSON.parse(localStorage.getItem(ADMIT_KEY) || "null"); } catch (e) { return null; }
  }
  function saveAdmit(o) {
    try { localStorage.setItem(ADMIT_KEY, JSON.stringify(o)); } catch (e) {}
  }
  function getName() {
    try { return (localStorage.getItem(NAME_KEY) || "").trim(); } catch (e) { return ""; }
  }
  function setName(n) {
    try { localStorage.setItem(NAME_KEY, (n || "").trim()); } catch (e) {}
  }

  function isAdmitted() {
    var a = loadAdmit();
    return !!(a && a.ok && a.at);
  }

  function admit(payload) {
    var name = (payload && payload.name) || getName();
    if (!name) return { ok: false, error: "name" };
    setName(name);
    var rec = {
      ok: true,
      at: new Date().toISOString(),
      name: name,
      intent: (payload && payload.intent) || "seeker",
      acceptedCharter: !!(payload && payload.acceptedCharter)
    };
    if (!rec.acceptedCharter) return { ok: false, error: "charter" };
    saveAdmit(rec);
    try { localStorage.setItem(INTENT_KEY, rec.intent); } catch (e) {}
    var letter = {
      title: "Admission letter · Clarity University",
      name: rec.name,
      intent: rec.intent,
      at: rec.at,
      note: "Educational path on this device only. Not an institutional enrolment, ijazah, or fatwa license."
    };
    try { localStorage.setItem(LETTER_KEY, JSON.stringify(letter)); } catch (e) {}
    /* seed continue toward seeker */
    try {
      localStorage.setItem("cu_continue_v1", JSON.stringify({
        phase: 1,
        unitTitle: "Unit 1 — Who is Allah?",
        nextAction: "Open Seeker room and complete the open module.",
        href: "/campus/desk/seeker/"
      }));
    } catch (e2) {}
    return { ok: true, rec: rec, letter: letter };
  }

  function renderLetter(el, letter) {
    if (!el) return;
    letter = letter || null;
    if (!letter) {
      try { letter = JSON.parse(localStorage.getItem(LETTER_KEY) || "null"); } catch (e) { letter = null; }
    }
    if (!letter) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.innerHTML =
      "<h3>Admission letter</h3>" +
      "<p class=\"cu-admit-bism\">Bismillah</p>" +
      "<p>This device recognises <strong>" + escapeHtml(letter.name) + "</strong> as a learner on the Clarity University path.</p>" +
      "<p>Intended track: <strong>" + escapeHtml(letter.intent) + "</strong></p>" +
      "<p class=\"cu-admit-meta\">Recorded: " + escapeHtml((letter.at || "").slice(0, 10)) + "</p>" +
      "<p class=\"cu-admit-note\">" + escapeHtml(letter.note) + "</p>";
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function paintCharter() {
    var gate = document.getElementById("cu-admit-gate");
    var done = document.getElementById("cu-admit-done");
    var letter = document.getElementById("cu-admit-letter");
    var nameInput = document.getElementById("cu-admit-name");
    var admitted = isAdmitted();
    if (gate) gate.hidden = admitted;
    if (done) done.hidden = !admitted;
    if (nameInput && !nameInput.value) nameInput.value = getName();
    renderLetter(letter);
    var status = document.getElementById("cu-admit-status");
    if (status) {
      status.textContent = admitted
        ? "Admitted on this device. Continue when ready."
        : "Admission is local only — nothing is sent to a server.";
    }
  }

  function wire() {
    var form = document.getElementById("cu-admit-form");
    if (form && !form.__cu) {
      form.__cu = true;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = (document.getElementById("cu-admit-name") || {}).value || "";
        var intentEl = document.querySelector('input[name="cu-intent"]:checked');
        var intent = intentEl ? intentEl.value : "seeker";
        var accepted = !!(document.getElementById("cu-admit-accept") || {}).checked;
        var res = admit({ name: name.trim(), intent: intent, acceptedCharter: accepted });
        var err = document.getElementById("cu-admit-error");
        if (!res.ok) {
          if (err) {
            err.hidden = false;
            err.textContent =
              res.error === "name"
                ? "Please enter a name or kunya to use on this device."
                : "Please accept the charter limits to continue.";
          }
          return;
        }
        if (err) err.hidden = true;
        paintCharter();
        try {
          document.getElementById("cu-admit-letter") &&
            document.getElementById("cu-admit-letter").scrollIntoView({ behavior: "smooth", block: "nearest" });
        } catch (eS) {}
      });
    }
    var reset = document.getElementById("cu-admit-reset");
    if (reset && !reset.__cu) {
      reset.__cu = true;
      reset.addEventListener("click", function () {
        if (!confirm("Clear admission on this device only? Learning progress keys are not bulk-deleted.")) return;
        try { localStorage.removeItem(ADMIT_KEY); localStorage.removeItem(LETTER_KEY); } catch (e) {}
        paintCharter();
      });
    }
    paintCharter();
  }

  g.ClarityAdmit = {
    isAdmitted: isAdmitted,
    admit: admit,
    getName: getName,
    paint: paintCharter,
    load: loadAdmit
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})(typeof window !== "undefined" ? window : this);
