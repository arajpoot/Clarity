/*! Dayn Ledger v3 · Phase B light upgrade
 * Same storage key: clarity_dayn_ledger_v1
 * Qard ḥasan only · no interest fields
 * Chamber-first · no MutationObserver · single UI owner
 * Educational only — not a fatwa · not legal or financial advice
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAYN_LEDGER_V3__) return;
  g.__CLARITY_DAYN_LEDGER_V3__ = true;
  // Prevent v2 from also claiming ownership if both are present
  g.__CLARITY_DAYN_LEDGER_V2__ = true;

  var STORE = "clarity_dayn_ledger_v1";
  var TUT = "clarity_dayn_tutorial_done_v1";
  var FILTER_KEY = "clarity_dayn_filter_v1";

  function isDaynChamber() {
    return /\/amana\/dayn\/?/.test(location.pathname || "");
  }

  function allowVault() {
    if (g.ClarityVaultGate && typeof g.ClarityVaultGate.allowDaynVault === "function") {
      return !!g.ClarityVaultGate.allowDaynVault();
    }
    return isDaynChamber();
  }

  function allowLanding() {
    if (g.ClarityVaultGate && typeof g.ClarityVaultGate.allowDaynLanding === "function") {
      return !!g.ClarityVaultGate.allowDaynLanding();
    }
    // Landing form only on dayn chamber in Phase B (gate is scrubbed)
    return isDaynChamber();
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return { lines: [], repayments: [] };
      var o = JSON.parse(raw);
      if (!Array.isArray(o.lines)) o.lines = [];
      if (!Array.isArray(o.repayments)) o.repayments = [];
      return o;
    } catch (e) {
      return { lines: [], repayments: [] };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORE, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function uid() {
    return "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function money(n) {
    var x = Number(n);
    if (!isFinite(x)) return "0.00";
    return (Math.round(x * 100) / 100).toFixed(2);
  }

  function remaining(line, data) {
    var paid = 0;
    (data.repayments || []).forEach(function (r) {
      if (r.lineId === line.id) paid += Number(r.amount) || 0;
    });
    return Math.max(0, (Number(line.amount) || 0) - paid);
  }

  function getFilter() {
    try {
      return localStorage.getItem(FILTER_KEY) || "open";
    } catch (e) {
      return "open";
    }
  }

  function setFilter(v) {
    try {
      localStorage.setItem(FILTER_KEY, v);
    } catch (e) {}
  }

  /* ---------- styles (scoped, injected once) ---------- */
  function ensureStyles() {
    if (document.getElementById("dayn-ledger-v3-css")) return;
    var css = document.createElement("style");
    css.id = "dayn-ledger-v3-css";
    css.textContent =
      ".dayn-v3{font-size:0.92rem;line-height:1.45;color:inherit}" +
      ".dayn-v3 .dayn-badge{display:inline-block;font-size:0.72rem;font-weight:700;padding:0.2rem 0.55rem;border-radius:999px;border:1px solid rgba(212,180,90,0.4);background:rgba(30,125,94,0.2);color:#e8d5a3;margin-bottom:0.5rem}" +
      ".dayn-v3 .dayn-title{font-family:Georgia,serif;color:#e8d5a3;font-size:1.2rem;margin:0.2rem 0 0.35rem}" +
      ".dayn-v3 .dayn-foot{font-size:0.78rem;opacity:0.85;margin:0.25rem 0}" +
      ".dayn-v3 .dayn-tutorial{margin:0.6rem 0;padding:0.7rem 0.8rem;border-radius:12px;border:1px solid rgba(212,180,90,0.3);background:rgba(0,0,0,0.25)}" +
      ".dayn-v3 .dayn-edu{margin:0.5rem 0;font-size:0.82rem}" +
      ".dayn-v3 .dayn-edu summary{cursor:pointer;color:#c9a84c;font-weight:700}" +
      ".dayn-v3 .dayn-form{margin:0.75rem 0;padding:0.85rem;border-radius:14px;border:1px solid rgba(212,180,90,0.28);background:rgba(15,76,58,0.12)}" +
      ".dayn-v3 label{display:block;font-size:0.78rem;margin:0.4rem 0 0.2rem;opacity:0.9}" +
      ".dayn-v3 input[type=text],.dayn-v3 input[type=number],.dayn-v3 input[type=date],.dayn-v3 select,.dayn-v3 textarea{" +
      "width:100%;max-width:100%;box-sizing:border-box;padding:0.45rem 0.55rem;border-radius:10px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit;font-size:0.9rem}" +
      ".dayn-v3 .dayn-row{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem}" +
      ".dayn-v3 .dayn-qh-check{display:flex;gap:0.45rem;align-items:flex-start;font-size:0.82rem;margin:0.35rem 0 0.55rem}" +
      ".dayn-v3 .dayn-actions{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.65rem}" +
      ".dayn-v3 .dayn-btn{padding:0.45rem 0.9rem;border-radius:999px;font-weight:800;font-size:0.8rem;cursor:pointer;border:1px solid rgba(212,180,90,0.4);background:rgba(30,125,94,0.55);color:inherit}" +
      ".dayn-v3 .dayn-btn.secondary{background:rgba(0,0,0,0.28)}" +
      ".dayn-v3 .dayn-btn.danger{background:rgba(160,58,42,0.45);border-color:rgba(196,92,62,0.5)}" +
      ".dayn-v3 .dayn-btn:disabled{opacity:0.5;cursor:not-allowed}" +
      ".dayn-v3 .dayn-msg{font-size:0.78rem;margin:0.4rem 0;min-height:1.1em}" +
      ".dayn-v3 .dayn-msg.ok{color:#7dcea0}" +
      ".dayn-v3 .dayn-msg.err{color:#f0a090}" +
      ".dayn-v3 .dayn-filters{display:flex;flex-wrap:wrap;gap:0.35rem;margin:0.75rem 0 0.4rem}" +
      ".dayn-v3 .dayn-filters button{padding:0.3rem 0.7rem;border-radius:999px;font-size:0.75rem;font-weight:700;cursor:pointer;border:1px solid rgba(212,180,90,0.3);background:rgba(0,0,0,0.25);color:inherit}" +
      ".dayn-v3 .dayn-filters button.is-on{background:rgba(30,125,94,0.45);border-color:rgba(212,180,90,0.5)}" +
      ".dayn-v3 .dayn-line{margin:0.5rem 0;padding:0.7rem 0.75rem;border-radius:12px;border:1px solid rgba(212,180,90,0.22);background:rgba(0,0,0,0.22)}" +
      ".dayn-v3 .dayn-line.settled{opacity:0.72}" +
      ".dayn-v3 .dayn-line-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:0.35rem;align-items:baseline}" +
      ".dayn-v3 .dayn-line-meta{font-size:0.78rem;opacity:0.88;margin-top:0.25rem}" +
      ".dayn-v3 .dayn-line-actions{display:flex;flex-wrap:wrap;gap:0.3rem;margin-top:0.45rem}" +
      ".dayn-v3 .dayn-line-actions button{padding:0.28rem 0.6rem;font-size:0.72rem;border-radius:999px;cursor:pointer;border:1px solid rgba(212,180,90,0.3);background:rgba(0,0,0,0.3);color:inherit}" +
      ".dayn-v3 .dayn-empty{padding:0.85rem;text-align:center;opacity:0.85;font-size:0.85rem;border-radius:12px;border:1px dashed rgba(212,180,90,0.25);margin:0.5rem 0}" +
      ".dayn-v3 .dayn-repay-box{margin-top:0.45rem;padding:0.5rem;border-radius:10px;background:rgba(0,0,0,0.25);display:none}" +
      ".dayn-v3 .dayn-repay-box.is-open{display:block}" +
      "@media(max-width:520px){.dayn-v3 .dayn-row{grid-template-columns:1fr}}";
    document.head.appendChild(css);
  }

  /* ---------- form card (chamber) ---------- */
  function formHtml() {
    var tut = "";
    try {
      if (localStorage.getItem(TUT) !== "1") {
        tut =
          '<div class="dayn-tutorial" id="dayn-tutorial">' +
          "<strong>Quick start</strong>" +
          '<ol style="margin:0.3rem 0 0;padding-left:1.1rem">' +
          "<li>Confirm <em>Qard ḥasan only</em> (no interest).</li>" +
          "<li>Add direction, amount, and who.</li>" +
          "<li>Use <em>Record repayment</em> when you pay or receive.</li>" +
          "</ol>" +
          '<button type="button" class="dayn-btn secondary" id="dayn-tut-dismiss">Got it</button>' +
          "</div>";
      }
    } catch (e) {}

    return (
      '<div class="dayn-v3" id="clarity-dayn-entry">' +
      '<div class="dayn-badge">✓ Qard ḥasan ledger only · no interest</div>' +
      '<h2 class="dayn-title">Amānah Dayn</h2>' +
      '<p class="dayn-foot">Cash-flow entry for day landing · principal only · on this device.</p>' +
      tut +
      '<details class="dayn-edu"><summary>Before you record · short guidance</summary><ul>' +
      "<li>Debts are serious — settle what you can.</li>" +
      "<li>Write it down — memory aid, not a court paper.</li>" +
      "<li><strong>Qard ḥasan only</strong> — no ribā / interest schedule.</li>" +
      "<li>Honesty — log what you owe and what is owed to you.</li>" +
      "<li>When unsure — ask a local qualified scholar.</li>" +
      "</ul></details>" +
      '<div class="dayn-form">' +
      '<label class="dayn-qh-check"><input type="checkbox" id="dayn-qh" checked />' +
      "<span>This entry is <strong>Qard ḥasan only</strong> — no interest.</span></label>" +
      '<div class="dayn-row"><div><label for="dayn-dir">Direction</label>' +
      '<select id="dayn-dir"><option value="i_owe">I owe</option><option value="owed_to_me">Owed to me</option></select></div>' +
      '<div><label for="dayn-amount">Amount</label><input id="dayn-amount" type="number" min="0" step="0.01" placeholder="0.00" inputmode="decimal" /></div></div>' +
      '<label for="dayn-who">Counterparty (name or initials)</label>' +
      '<input id="dayn-who" type="text" maxlength="80" placeholder="e.g. A.K." autocomplete="off" />' +
      '<div class="dayn-row"><div><label for="dayn-due">Due (optional)</label><input id="dayn-due" type="date" /></div>' +
      '<div><label for="dayn-currency">Currency</label><input id="dayn-currency" type="text" maxlength="8" value="CAD" /></div></div>' +
      '<label for="dayn-note">Note (optional)</label>' +
      '<textarea id="dayn-note" rows="2" maxlength="200" placeholder="Principal only · evidence note"></textarea>' +
      '<div class="dayn-actions">' +
      '<button type="button" class="dayn-btn" id="dayn-save">Save to ledger</button>' +
      '<button type="button" class="dayn-btn secondary" id="dayn-refresh">Refresh list</button>' +
      "</div>" +
      '<p class="dayn-msg" id="dayn-msg" role="status"></p>' +
      "</div>" +
      '<div id="dayn-list-host"></div>' +
      '<p class="dayn-foot">Educational · on-device · not a fatwa · not legal or financial advice.</p>' +
      "</div>"
    );
  }

  function setMsg(text, kind) {
    var el = document.getElementById("dayn-msg");
    if (!el) return;
    el.textContent = text || "";
    el.className = "dayn-msg" + (kind ? " " + kind : "");
  }

  function bindForm() {
    var root = document.getElementById("clarity-dayn-entry");
    if (!root || root.getAttribute("data-bound") === "1") return;
    root.setAttribute("data-bound", "1");

    var tutBtn = document.getElementById("dayn-tut-dismiss");
    if (tutBtn) {
      tutBtn.onclick = function () {
        try {
          localStorage.setItem(TUT, "1");
        } catch (e) {}
        var t = document.getElementById("dayn-tutorial");
        if (t) t.remove();
      };
    }

    var saveBtn = document.getElementById("dayn-save");
    if (saveBtn) {
      saveBtn.onclick = function () {
        var qh = document.getElementById("dayn-qh");
        if (!qh || !qh.checked) {
          setMsg("Confirm Qard ḥasan only (no interest) before saving.", "err");
          return;
        }
        var amount = Number((document.getElementById("dayn-amount") || {}).value);
        var who = ((document.getElementById("dayn-who") || {}).value || "").trim();
        if (!isFinite(amount) || amount <= 0) {
          setMsg("Enter a valid amount greater than zero.", "err");
          return;
        }
        if (!who) {
          setMsg("Add a counterparty name or initials.", "err");
          return;
        }
        var data = load();
        data.lines.push({
          id: uid(),
          direction: (document.getElementById("dayn-dir") || {}).value || "i_owe",
          amount: amount,
          who: who,
          due: (document.getElementById("dayn-due") || {}).value || "",
          currency: ((document.getElementById("dayn-currency") || {}).value || "CAD").trim() || "CAD",
          note: ((document.getElementById("dayn-note") || {}).value || "").trim(),
          qardHasan: true,
          status: "open",
          createdAt: new Date().toISOString()
        });
        if (!save(data)) {
          setMsg("Could not save on this device (storage full or blocked).", "err");
          return;
        }
        setMsg("Saved · Qard ḥasan line on this device.", "ok");
        try {
          document.getElementById("dayn-amount").value = "";
          document.getElementById("dayn-who").value = "";
          document.getElementById("dayn-note").value = "";
          document.getElementById("dayn-due").value = "";
        } catch (e) {}
        renderList();
      };
    }

    var refreshBtn = document.getElementById("dayn-refresh");
    if (refreshBtn) refreshBtn.onclick = function () {
      renderList();
      setMsg("List refreshed.", "ok");
    };
  }

  /* ---------- list + actions ---------- */
  function renderList() {
    var host = document.getElementById("dayn-list-host");
    if (!host) return;
    var data = load();
    var filter = getFilter();
    var lines = data.lines.slice().reverse();
    var filtered = lines.filter(function (l) {
      var rem = remaining(l, data);
      var settled = l.status === "settled" || rem <= 0;
      if (filter === "open") return !settled;
      if (filter === "settled") return settled;
      return true;
    });

    var html =
      '<div class="dayn-filters" role="group" aria-label="Filter lines">' +
      '<button type="button" data-filter="open"' + (filter === "open" ? ' class="is-on"' : "") + ">Open</button>" +
      '<button type="button" data-filter="settled"' + (filter === "settled" ? ' class="is-on"' : "") + ">Settled</button>" +
      '<button type="button" data-filter="all"' + (filter === "all" ? ' class="is-on"' : "") + ">All</button>" +
      "</div>";

    if (!filtered.length) {
      html +=
        '<div class="dayn-empty">' +
        (data.lines.length
          ? "No lines in this filter."
          : "No Qard ḥasan lines on this device yet. Add one above.") +
        "</div>";
    } else {
      filtered.forEach(function (l) {
        var rem = remaining(l, data);
        var settled = l.status === "settled" || rem <= 0;
        var dirLabel = l.direction === "owed_to_me" ? "Owed to me" : "I owe";
        html +=
          '<div class="dayn-line' + (settled ? " settled" : "") + '" data-line-id="' + l.id + '">' +
          '<div class="dayn-line-head">' +
          "<strong>" + dirLabel + "</strong>" +
          "<span>" + (l.who || "?") + "</span>" +
          "</div>" +
          '<div class="dayn-line-meta">' +
          "Principal " + money(l.amount) + " · remaining " + money(rem) + " " + (l.currency || "") +
          " · " + (settled ? "settled" : "open") +
          (l.qardHasan ? " · ✓ QH" : "") +
          (l.due ? " · due " + l.due : "") +
          (l.note ? "<br/>" + escapeHtml(l.note) : "") +
          "</div>";
        if (!settled) {
          html +=
            '<div class="dayn-line-actions">' +
            '<button type="button" data-act="repay">Record repayment</button>' +
            '<button type="button" data-act="settle">Mark settled</button>' +
            "</div>" +
            '<div class="dayn-repay-box" data-repay-for="' + l.id + '">' +
            '<label>Repayment amount</label>' +
            '<input type="number" min="0" step="0.01" data-repay-amt placeholder="' + money(rem) + '" inputmode="decimal" />' +
            '<div class="dayn-actions" style="margin-top:0.4rem">' +
            '<button type="button" class="dayn-btn" data-act="repay-save">Save repayment</button>' +
            '<button type="button" class="dayn-btn secondary" data-act="repay-cancel">Cancel</button>' +
            "</div></div>";
        }
        html += "</div>";
      });
    }
    host.innerHTML = html;

    host.querySelectorAll("[data-filter]").forEach(function (btn) {
      btn.onclick = function () {
        setFilter(btn.getAttribute("data-filter"));
        renderList();
      };
    });

    host.querySelectorAll("[data-line-id]").forEach(function (card) {
      var id = card.getAttribute("data-line-id");
      card.querySelectorAll("[data-act]").forEach(function (btn) {
        btn.onclick = function () {
          var act = btn.getAttribute("data-act");
          if (act === "repay") {
            var box = card.querySelector('[data-repay-for="' + id + '"]');
            if (box) box.classList.add("is-open");
          } else if (act === "repay-cancel") {
            var box2 = card.querySelector('[data-repay-for="' + id + '"]');
            if (box2) box2.classList.remove("is-open");
          } else if (act === "repay-save") {
            var input = card.querySelector("[data-repay-amt]");
            var amt = Number(input && input.value);
            if (!isFinite(amt) || amt <= 0) {
              setMsg("Enter a valid repayment amount.", "err");
              return;
            }
            var data = load();
            var line = data.lines.filter(function (x) { return x.id === id; })[0];
            if (!line) return;
            var rem = remaining(line, data);
            if (amt > rem + 0.001) {
              setMsg("Repayment cannot exceed remaining (" + money(rem) + ").", "err");
              return;
            }
            data.repayments.push({
              id: uid(),
              lineId: id,
              amount: amt,
              at: new Date().toISOString()
            });
            if (remaining(line, data) <= 0) line.status = "settled";
            save(data);
            setMsg("Repayment recorded.", "ok");
            renderList();
          } else if (act === "settle") {
            var data2 = load();
            data2.lines.forEach(function (x) {
              if (x.id === id) x.status = "settled";
            });
            save(data2);
            setMsg("Marked settled.", "ok");
            renderList();
          }
        };
      });
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- mount ---------- */
  function mountChamber() {
    if (!allowLanding() && !allowVault()) return;
    if (!isDaynChamber()) return; // Phase B: chamber only

    ensureStyles();

    var slot =
      document.getElementById("clarity-landing-slot-dayn") ||
      document.getElementById("clarity-vault-slot-dayn") ||
      document.querySelector("main.amana-wrap .amana-card");

    if (!slot) return;

    // Prefer landing slot for the form; vault slot can hold a compact summary if both exist
    var formHost = document.getElementById("clarity-landing-slot-dayn") || slot;
    if (!document.getElementById("clarity-dayn-entry")) {
      formHost.innerHTML = formHtml();
      bindForm();
    } else {
      bindForm();
    }
    renderList();
  }

  function boot() {
    try {
      if (!isDaynChamber()) return;
      mountChamber();
    } catch (e) {
      try {
        console.warn("[Dayn v3]", e);
      } catch (err) {}
    }
  }

  // Export helper for export desk / notes
  g.clarityDaynExportText = function () {
    var data = load();
    var lines = ["Amānah Dayn · Qard ḥasan only · educational · on-device"];
    data.lines.forEach(function (l) {
      lines.push(
        [l.createdAt, l.direction, l.who, l.amount, l.currency, l.status, l.due, l.note].join("\t")
      );
    });
    return lines.join("\n");
  };

  g.ClarityDaynV3 = {
    load: load,
    save: save,
    remaining: remaining,
    refresh: function () {
      renderList();
    },
    boot: boot
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  // Limited, non-recursive retries (no observer, no click storm)
  setTimeout(boot, 300);
  setTimeout(boot, 1000);

  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 80);
  });
  document.addEventListener("clarity-amana-sealed-ready", function () {
    setTimeout(boot, 40);
  });
})(typeof window !== "undefined" ? window : this);
