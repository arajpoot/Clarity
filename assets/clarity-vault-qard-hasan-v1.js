/*! Qard Ḥasan ledger · Amānah Vault
 * Interest-free loan register — educational, not a bank product, not a fatwa.
 * Storage: clarity.vault.qardhasan.v1 (on-device only)
 */
(function () {
  "use strict";
  if (window.__CLARITY_QARD_HASAN__) return;
  window.__CLARITY_QARD_HASAN__ = true;

  var KEY = "clarity.vault.qardhasan.v1";
  var PANEL_ID = "amana-qard-hasan-panel";

  function load() {
    try {
      var x = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (!x || typeof x !== "object") x = {};
      if (!Array.isArray(x.entries)) x.entries = [];
      return x;
    } catch (e) {
      return { entries: [] };
    }
  }
  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
  }
  function uid() {
    return "qh-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }
  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function unlocked() {
    try {
      if (window.ClarityVault && window.ClarityVault.isUnlocked) return !!window.ClarityVault.isUnlocked();
    } catch (e) {}
    return !!window.__clarityVaultUnlocked ||
      !!document.querySelector("[data-vault-unlocked='1'], [data-amana-open='1'], .vault-unlocked");
  }

  function isGateContext(el) {
    if (!el) return true;
    var t = (el.textContent || "").toLowerCase();
    if (/create\s*&\s*open vault|confirm passphrase|strength:\s*—/.test(t) &&
        el.querySelector && el.querySelector('input[type="password"]')) return true;
    return false;
  }

  function findLedger() {
    return (
      document.getElementById("amana-ledger-section") ||
      document.querySelector("[data-vault-ledger]") ||
      document.getElementById("amana-ledger-notes-slot") ||
      document.getElementById("vault-export-host")
    );
  }

  function renderList(box, data) {
    var list = box.querySelector("[data-qh-list]");
    if (!list) return;
    list.innerHTML = "";
    if (!data.entries.length) {
      list.innerHTML = "<p style='font-size:.82rem;opacity:.85;margin:.35rem 0'>No qard entries yet. Record a loan given or received (interest-free).</p>";
      return;
    }
    data.entries
      .slice()
      .sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); })
      .forEach(function (en) {
        var row = document.createElement("div");
        row.style.cssText =
          "margin:.4rem 0;padding:.65rem .75rem;border-radius:10px;border:1px solid rgba(201,168,76,.28);background:rgba(0,0,0,.18)";
        var dir = en.direction === "borrowed" ? "Received (I owe)" : "Given (they owe me)";
        var settled = en.settled ? " · <strong style='color:#7dcea0'>Settled</strong>" : " · open";
        row.innerHTML =
          "<div style='font-size:.78rem;color:#c9a84c;font-weight:700'>" + dir + settled + "</div>" +
          "<div style='font-size:.92rem;margin:.2rem 0'><strong></strong> · <span class='amt'></span></div>" +
          "<div style='font-size:.78rem;opacity:.88'></div>" +
          "<div style='margin-top:.35rem;display:flex;flex-wrap:wrap;gap:.3rem'></div>";
        row.querySelector("strong").textContent = en.party || "(name)";
        row.querySelector(".amt").textContent = (en.amount || "—") + (en.currency ? " " + en.currency : "");
        var meta = row.children[2];
        meta.textContent =
          (en.date || "") +
          (en.due ? " · due " + en.due : "") +
          (en.note ? " · " + en.note : "");
        var actions = row.children[3];
        function btn(label, fn) {
          var b = document.createElement("button");
          b.type = "button";
          b.textContent = label;
          b.style.cssText =
            "padding:.25rem .55rem;border-radius:999px;border:1px solid rgba(201,168,76,.35);background:transparent;color:inherit;font-size:.75rem;cursor:pointer";
          b.onclick = fn;
          return b;
        }
        if (!en.settled) {
          actions.appendChild(
            btn("Mark settled", function () {
              en.settled = true;
              en.settledAt = new Date().toISOString();
              save(data);
              renderList(box, data);
            })
          );
        }
        actions.appendChild(
          btn("Remove", function () {
            data.entries = data.entries.filter(function (x) { return x.id !== en.id; });
            save(data);
            renderList(box, data);
          })
        );
        list.appendChild(row);
      });
  }

  function mountVaultPanel() {
    if (document.getElementById(PANEL_ID)) return;
    var ledger = findLedger();
    if (!ledger || isGateContext(ledger)) return;

    var box = document.createElement("div");
    box.id = PANEL_ID;
    box.setAttribute("data-qard-hasan", "1");
    box.style.cssText =
      "margin:1rem 0;padding:1rem;border:1px solid rgba(201,168,76,.36);border-radius:14px;background:rgba(8,28,22,.4)";
    box.innerHTML =
      "<p style='margin:0;font-size:.72rem;letter-spacing:.07em;text-transform:uppercase;color:#c9a84c;font-weight:800'>Qard ḥasan · interest-free loan ledger</p>" +
      "<p style='font-size:.82rem;opacity:.9;margin:.35rem 0 .65rem'>Record loans <em>given or received without interest</em>. On this device only. Educational · not a bank product · not a fatwa · not legal advice.</p>" +
      "<div style='display:grid;gap:.4rem;max-width:28rem'>" +
      "<label style='font-size:.78rem'>Direction<br/>" +
      "<select id='qh-dir' style='width:100%;padding:.35rem;border-radius:8px;border:1px solid rgba(201,168,76,.3);background:rgba(0,0,0,.25);color:inherit'>" +
      "<option value='lent'>I gave (they may repay me)</option>" +
      "<option value='borrowed'>I received (I should repay)</option>" +
      "</select></label>" +
      "<label style='font-size:.78rem'>Counterparty name<br/><input id='qh-party' type='text' style='width:100%;padding:.35rem;border-radius:8px;border:1px solid rgba(201,168,76,.3);background:rgba(0,0,0,.25);color:inherit'/></label>" +
      "<label style='font-size:.78rem'>Amount<br/><input id='qh-amt' type='text' inputmode='decimal' placeholder='e.g. 100' style='width:100%;padding:.35rem;border-radius:8px;border:1px solid rgba(201,168,76,.3);background:rgba(0,0,0,.25);color:inherit'/></label>" +
      "<label style='font-size:.78rem'>Currency (optional)<br/><input id='qh-cur' type='text' placeholder='e.g. USD' style='width:100%;padding:.35rem;border-radius:8px;border:1px solid rgba(201,168,76,.3);background:rgba(0,0,0,.25);color:inherit'/></label>" +
      "<label style='font-size:.78rem'>Date<br/><input id='qh-date' type='date' style='width:100%;padding:.35rem;border-radius:8px;border:1px solid rgba(201,168,76,.3);background:rgba(0,0,0,.25);color:inherit'/></label>" +
      "<label style='font-size:.78rem'>Due (optional)<br/><input id='qh-due' type='date' style='width:100%;padding:.35rem;border-radius:8px;border:1px solid rgba(201,168,76,.3);background:rgba(0,0,0,.25);color:inherit'/></label>" +
      "<label style='font-size:.78rem'>Note<br/><input id='qh-note' type='text' placeholder='Witness, place, reminder…' style='width:100%;padding:.35rem;border-radius:8px;border:1px solid rgba(201,168,76,.3);background:rgba(0,0,0,.25);color:inherit'/></label>" +
      "</div>" +
      "<p style='margin:.55rem 0'><button type='button' id='qh-add' style='padding:.4rem .9rem;border:0;border-radius:999px;background:#1e7d5e;color:#fff;font-weight:700;cursor:pointer'>Add to ledger</button></p>" +
      "<p id='qh-msg' style='font-size:.78rem;opacity:.9'></p>" +
      "<div data-qh-list></div>" +
      "<p style='font-size:.75rem;opacity:.8;margin-top:.5rem'>Qur’an encourages fair documentation of debts (see 2:282) — learn full guidance with a teacher. This form only helps you remember.</p>";

    // Prefer before export host inside ledger
    var exportHost = document.getElementById("vault-export-host");
    if (exportHost && exportHost.parentElement === ledger) {
      ledger.insertBefore(box, exportHost);
    } else if (ledger.id === "amana-ledger-notes-slot" || ledger.getAttribute("data-vault-ledger")) {
      ledger.appendChild(box);
    } else {
      ledger.appendChild(box);
    }

    var data = load();
    var dateEl = box.querySelector("#qh-date");
    if (dateEl && !dateEl.value) dateEl.value = today();
    renderList(box, data);

    box.querySelector("#qh-add").onclick = function () {
      var party = (box.querySelector("#qh-party").value || "").trim();
      var amount = (box.querySelector("#qh-amt").value || "").trim();
      if (!party || !amount) {
        box.querySelector("#qh-msg").textContent = "Name and amount are required.";
        return;
      }
      data.entries.push({
        id: uid(),
        direction: box.querySelector("#qh-dir").value || "lent",
        party: party,
        amount: amount,
        currency: (box.querySelector("#qh-cur").value || "").trim(),
        date: box.querySelector("#qh-date").value || today(),
        due: box.querySelector("#qh-due").value || "",
        note: (box.querySelector("#qh-note").value || "").trim(),
        settled: false,
        createdAt: new Date().toISOString(),
      });
      save(data);
      box.querySelector("#qh-party").value = "";
      box.querySelector("#qh-amt").value = "";
      box.querySelector("#qh-note").value = "";
      box.querySelector("#qh-msg").textContent = "Saved on this device.";
      renderList(box, data);
      // expose lines for digest snapshot
      try {
        window.__clarityQardLines = data.entries.map(function (en) {
          return (
            (en.direction === "borrowed" ? "Qard received from " : "Qard given to ") +
            en.party +
            ": " +
            en.amount +
            (en.currency ? " " + en.currency : "") +
            (en.settled ? " (settled)" : " (open)")
          );
        });
      } catch (e) {}
    };
  }

  /** Daily / landing quick entry → same KEY (like note registry one-way) */
  function mountDailyBridge() {
    var mount =
      document.getElementById("amana-qard-landing") ||
      document.getElementById("amana-note-registry-landing") ||
      document.querySelector("[data-qard-hasan-landing]");
    if (!mount || mount.querySelector("[data-qh-daily]")) return;

    var wrap = document.createElement("div");
    wrap.setAttribute("data-qh-daily", "1");
    wrap.style.cssText =
      "margin:.75rem 0;padding:.85rem;border-radius:12px;border:1px solid rgba(201,168,76,.3);background:rgba(0,0,0,.12)";
    wrap.innerHTML =
      "<p style='margin:0 0 .35rem;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:#c9a84c;font-weight:800'>Qard ḥasan · quick entry</p>" +
      "<p style='font-size:.8rem;opacity:.9;margin:0 0 .5rem'>Interest-free loan note → Amānah ledger (on-device). Not listed publicly.</p>" +
      "<input id='qh-d-party' type='text' placeholder='Name' style='width:100%;box-sizing:border-box;margin:.2rem 0;padding:.4rem;border-radius:8px;border:1px solid rgba(201,168,76,.28);background:rgba(0,0,0,.15);color:inherit'/>" +
      "<input id='qh-d-amt' type='text' placeholder='Amount' style='width:100%;box-sizing:border-box;margin:.2rem 0;padding:.4rem;border-radius:8px;border:1px solid rgba(201,168,76,.28);background:rgba(0,0,0,.15);color:inherit'/>" +
      "<select id='qh-d-dir' style='width:100%;margin:.2rem 0;padding:.4rem;border-radius:8px;border:1px solid rgba(201,168,76,.28);background:rgba(0,0,0,.15);color:inherit'>" +
      "<option value='lent'>I gave</option><option value='borrowed'>I received</option></select>" +
      "<button type='button' id='qh-d-save' style='margin-top:.35rem;padding:.35rem .75rem;border:0;border-radius:999px;background:#0f4c3a;color:#f5e6b8;font-weight:700'>Save to vault ledger</button>" +
      "<p id='qh-d-msg' style='font-size:.75rem;margin:.35rem 0 0;opacity:.88'></p>";
    mount.appendChild(wrap);
    wrap.querySelector("#qh-d-save").onclick = function () {
      var party = (wrap.querySelector("#qh-d-party").value || "").trim();
      var amount = (wrap.querySelector("#qh-d-amt").value || "").trim();
      if (!party || !amount) {
        wrap.querySelector("#qh-d-msg").textContent = "Name and amount required.";
        return;
      }
      var data = load();
      data.entries.push({
        id: uid(),
        direction: wrap.querySelector("#qh-d-dir").value,
        party: party,
        amount: amount,
        currency: "",
        date: today(),
        due: "",
        note: "from daily quick entry",
        settled: false,
        createdAt: new Date().toISOString(),
      });
      save(data);
      wrap.querySelector("#qh-d-party").value = "";
      wrap.querySelector("#qh-d-amt").value = "";
      wrap.querySelector("#qh-d-msg").textContent =
        "Saved. Open Amānah Vault → Ledger to review. On-device only · not legal advice.";
    };
  }

  // Patch digest collector if present
  function patchDigest() {
    if (!window.ClarityVaultDigest || window.ClarityVaultDigest.__qardPatched) return;
    var orig = window.ClarityVaultDigest.collectLedgerLines;
    if (typeof orig !== "function") return;
    window.ClarityVaultDigest.collectLedgerLines = function () {
      var lines = orig() || [];
      try {
        var data = load();
        data.entries.forEach(function (en) {
          lines.push(
            (en.direction === "borrowed" ? "Qard ḥasan received from " : "Qard ḥasan given to ") +
              en.party +
              ": " +
              en.amount +
              (en.settled ? " (settled)" : " (open)")
          );
        });
      } catch (e) {}
      return lines;
    };
    window.ClarityVaultDigest.__qardPatched = true;
  }

  function tick() {
    mountVaultPanel();
    mountDailyBridge();
    patchDigest();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
  setTimeout(tick, 1000);
  setTimeout(tick, 2500);
  setTimeout(tick, 5000);
  try {
    var obs = new MutationObserver(tick);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () {
      try {
        obs.disconnect();
      } catch (e) {}
    }, 25000);
  } catch (e) {}
})();
