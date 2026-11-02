/* Farāʾiḍ educational illustrator — University Vault
 * Maps study scenarios only. Not a personal fatwa or court calculation.
 */
(function (g) {
  "use strict";
  if (g.__CU_VAULT_FARAID_V1__) return;
  g.__CU_VAULT_FARAID_V1__ = true;

  var SCENARIOS = [
    {
      id: "spouse_kids",
      title: "Spouse + children (study map)",
      body: "Classical teaching discusses fixed shares for a spouse and for children, with remainder patterns addressed in the Sunnah. Exact portions depend on who is present — ask a teacher for any real estate."
    },
    {
      id: "parents_only",
      title: "Parents with no children (study map)",
      body: "Parents have defined shares in the Qurʾān when certain heirs are absent or present. Do not apply a website chart to a real case without qualified guidance."
    },
    {
      id: "kalalah",
      title: "Kalālah edge cases (study)",
      body: "Qurʾān 4:176 and related discussion address kalālah. This is advanced — educational pointer only."
    },
    {
      id: "errors",
      title: "Common errors checklist",
      body: "Unborn child, missing persons, prior spouses, and non-Muslim relatives are frequent sources of confusion. Tick items in your vault notes and take them to a teacher."
    }
  ];

  function V() {
    return g.ClarityVaultSecure;
  }

  function mount(into) {
    if (!into || !V() || !V().isUnlocked()) return;
    var d = V().data();
    if (!d.faraid) d.faraid = { scenario: "", notes: "", errorChecks: {}, pick: "" };

    var opts = SCENARIOS.map(function (s) {
      return (
        '<option value="' +
        s.id +
        '"' +
        (d.faraid.pick === s.id ? " selected" : "") +
        ">" +
        s.title +
        "</option>"
      );
    }).join("");

    into.innerHTML =
      '<label class="vault-field"><span>Study scenario</span>' +
      '<select id="cu-faraid-pick">' +
      '<option value="">Choose a map…</option>' +
      opts +
      "</select></label>" +
      '<div id="cu-faraid-body" class="vault-micro" style="margin:.4rem 0;line-height:1.45"></div>' +
      '<label class="vault-field"><span>Your scenario notes</span>' +
      '<textarea id="cu-faraid-scenario" rows="3">' +
      esc(d.faraid.scenario || "") +
      "</textarea></label>" +
      '<label class="vault-field"><span>Questions for a teacher</span>' +
      '<textarea id="cu-faraid-notes" rows="3">' +
      esc(d.faraid.notes || "") +
      "</textarea></label>" +
      '<fieldset class="vault-checks"><legend>Common-error study ticks</legend>' +
      chk("unborn", "Unborn child") +
      chk("missing", "Missing father / grandfather issues") +
      chk("prior", "Spouses from previous marriage") +
      chk("nonmuslim", "Non-Muslim relatives (rules differ)") +
      "</fieldset>" +
      '<p class="vault-micro"><strong>Educational only — not a fatwa.</strong> No shares are calculated as your estate.</p>';

    function chk(id, label) {
      var on = d.faraid.errorChecks && d.faraid.errorChecks[id];
      return (
        '<label class="vault-check"><input type="checkbox" data-check="' +
        id +
        '"' +
        (on ? " checked" : "") +
        "/> " +
        label +
        "</label>"
      );
    }
    function esc(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;");
    }

    function showPick() {
      var id = document.getElementById("cu-faraid-pick").value;
      d.faraid.pick = id;
      var sc = SCENARIOS.find(function (x) {
        return x.id === id;
      });
      document.getElementById("cu-faraid-body").textContent = sc
        ? sc.body
        : "Select a study map to read a short educational outline.";
    }

    document.getElementById("cu-faraid-pick").onchange = showPick;
    showPick();
    document.getElementById("cu-faraid-scenario").onchange = function () {
      d.faraid.scenario = this.value;
    };
    document.getElementById("cu-faraid-notes").onchange = function () {
      d.faraid.notes = this.value;
    };
    into.querySelectorAll("input[data-check]").forEach(function (cb) {
      cb.onchange = function () {
        if (!d.faraid.errorChecks) d.faraid.errorChecks = {};
        d.faraid.errorChecks[cb.getAttribute("data-check")] = cb.checked;
      };
    });
  }

  g.ClarityVaultFaraid = { mount: mount };
})(typeof window !== "undefined" ? window : this);
