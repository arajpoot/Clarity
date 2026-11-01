/**
 * Day Landing enrichment v3 · self-contained Dayn (Qard ḥasan)
 * Enhances #clarity-landing-slot-dayn from day-room-v3
 * Vault registry near .amana-vault-interior / #ahr-debts
 * Educational only — not a fatwa · not legal/financial advice
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAYN_ENRICH_V3__) return;
  g.__CLARITY_DAYN_ENRICH_V3__ = true;

  var STORE = "clarity_dayn_ledger_v1";
  var TUT = "clarity_dayn_tutorial_done_v1";

  function load() {
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return { lines: [], repayments: [] };
      var o = JSON.parse(raw);
      if (!o.lines) o.lines = [];
      if (!o.repayments) o.repayments = [];
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

  function richHtml() {
    var tut = "";
    try {
      if (localStorage.getItem(TUT) !== "1") {
        tut =
          '<div class="dayn-tutorial" id="dayn-tutorial"><strong>Quick start</strong><ol style="margin:0.3rem 0 0;padding-left:1.1rem">' +
          "<li>Confirm <em>Qard ḥasan only</em> (no interest).</li>" +
          "<li>Add direction, amount, and who.</li>" +
          "<li>Use Record repayment when you pay or receive.</li></ol>" +
          '<button type="button" class="dayn-btn secondary" id="dayn-tut-dismiss">Got it</button></div>';
      }
    } catch (e) {}
    return (
      '<div class="dayn-badge">✓ Qard ḥasan ledger only · no interest</div>' +
      '<div class="cdl-head"><h2>📋 Amānah Dayn</h2></div>' +
      '<p class="cdl-sub">Cash-flow <strong>entry</strong> for day landing · principal only · on this device.</p>' +
      tut +
      '<details class="dayn-edu"><summary>Before you record · short guidance</summary><ul>' +
      "<li>Debts are serious — settle what you can.</li>" +
      "<li>Write it down — memory aid, not a court paper.</li>" +
      "<li><strong>Qard ḥasan only</strong> — no ribā / interest schedule in this ledger.</li>" +
      "<li>Honesty — log what you owe and what is owed to you.</li>" +
      "<li>When unsure — ask a local qualified scholar.</li></ul></details>" +
      '<div class="dayn-form">' +
      '<label class="dayn-qh-check"><input type="checkbox" id="dayn-qh" checked />' +
      "<span>This entry is <strong>Qard ḥasan only</strong> — no interest.</span></label>" +
      '<div class="dayn-row"><div><label for="dayn-dir">Direction</label>' +
      '<select id="dayn-dir"><option value="i_owe">I owe</option><option value="owed_to_me">Owed to me</option></select></div>' +
      '<div><label for="dayn-amount">Amount</label>' +
      '<input id="dayn-amount" type="number" min="0" step="0.01" placeholder="0.00" /></div></div>' +
      '<label for="dayn-who">Counterparty (name or initials)</label>' +
      '<input id="dayn-who" type="text" maxlength="80" placeholder="e.g. A.K." />' +
      '<div class="dayn-row"><div><label for="dayn-due">Due (optional)</label>' +
      '<input id="dayn-due" type="date" /></div>' +
      '<div><label for="dayn-currency">Currency</label>' +
      '<input id="dayn-currency" type="text" maxlength="8" value="CAD" /></div></div>' +
      '<label for="dayn-note">Note (optional)</label>' +
      '<textarea id="dayn-note" rows="2" maxlength="200" placeholder="Principal only · evidence note"></textarea>' +
      '<div class="dayn-actions">' +
      '<button type="button" class="dayn-btn" id="dayn-save">Save to ledger</button>' +
      '<button type="button" class="dayn-btn secondary" id="dayn-refresh">Refresh list</button></div>' +
      '<p class="dayn-msg" id="dayn-msg" hidden></p></div>' +
      '<div class="dayn-today" id="dayn-today"></div>' +
      '<p class="dayn-foot">Educational · on-device · not a fatwa · not legal or financial advice.</p>'
    );
  }

  function msg(host, t) {
    var el = host.querySelector("#dayn-msg");
    if (!el) return;
    el.hidden = false;
    el.textContent = t;
  }

  function renderToday(host) {
    var box = host.querySelector("#dayn-today") || host.querySelector(".dayn-today");
    if (!box) return;
    var data = load();
    var open = data.lines.filter(function (l) {
      return l.status !== "settled" && remaining(l, data) > 0.001;
    });
    if (!open.length) {
      box.innerHTML = '<p class="dayn-foot">No open Qard ḥasan lines on this device.</p>';
      return;
    }
    var html = "<strong style='font-size:0.8rem'>Open on this device</strong>";
    open.slice(0, 12).forEach(function (l) {
      var rem = remaining(l, data);
      var dir = l.direction === "owed_to_me" ? "Owed to me" : "I owe";
      html +=
        '<div class="dayn-line" data-id="' + l.id + '"><span><strong>' + dir + "</strong> · " +
        (l.who || "?") + " · " + money(rem) + " " + (l.currency || "") +
        (l.due ? " · due " + l.due : "") + "</span>" +
        '<button type="button" data-act="repay">Record repayment</button>' +
        '<button type="button" data-act="settle">Mark settled</button></div>';
    });
    box.innerHTML = html;
    box.querySelectorAll(".dayn-line button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.closest(".dayn-line").getAttribute("data-id");
        if (btn.getAttribute("data-act") === "repay") recordRepay(id, host);
        else settleLine(id, host);
      });
    });
  }

  function recordRepay(lineId, host) {
    var data = load();
    var line = data.lines.filter(function (l) { return l.id === lineId; })[0];
    if (!line) return;
    var rem = remaining(line, data);
    var raw = g.prompt(
      "Repayment amount (" + (line.currency || "") + "). Remaining " + money(rem) + ". Principal only.",
      String(rem)
    );
    if (raw == null) return;
    var amt = Number(raw);
    if (!isFinite(amt) || amt <= 0) return;
    data.repayments.push({
      id: uid(),
      lineId: lineId,
      amount: amt,
      at: new Date().toISOString(),
      qardHasan: true
    });
    if (remaining(line, data) <= 0.001) line.status = "settled";
    save(data);
    if (host) {
      msg(host, "Repayment recorded.");
      renderToday(host);
    }
    renderVault();
  }

  function settleLine(lineId, host) {
    var data = load();
    data.lines.forEach(function (l) {
      if (l.id === lineId) l.status = "settled";
    });
    save(data);
    if (host) {
      msg(host, "Marked settled.");
      renderToday(host);
    }
    renderVault();
  }

  function saveLine(host) {
    var qh = host.querySelector("#dayn-qh");
    if (!qh || !qh.checked) {
      msg(host, "Confirm Qard ḥasan only (no interest) to save.");
      return;
    }
    var amount = Number((host.querySelector("#dayn-amount") || {}).value);
    if (!isFinite(amount) || amount <= 0) {
      msg(host, "Enter a valid amount.");
      return;
    }
    var who = ((host.querySelector("#dayn-who") || {}).value || "").trim();
    if (!who) {
      msg(host, "Add counterparty name or initials.");
      return;
    }
    var data = load();
    data.lines.push({
      id: uid(),
      direction: (host.querySelector("#dayn-dir") || {}).value || "i_owe",
      amount: amount,
      currency: ((host.querySelector("#dayn-currency") || {}).value || "CAD").trim(),
      who: who,
      due: ((host.querySelector("#dayn-due") || {}).value || "").trim(),
      note: ((host.querySelector("#dayn-note") || {}).value || "").trim(),
      qardHasan: true,
      status: "open",
      createdAt: new Date().toISOString()
    });
    if (!save(data)) {
      msg(host, "Could not save on this device.");
      return;
    }
    msg(host, "Saved to Amānah Dayn ledger (this device).");
    try {
      host.querySelector("#dayn-amount").value = "";
      host.querySelector("#dayn-who").value = "";
      host.querySelector("#dayn-note").value = "";
    } catch (e) {}
    renderToday(host);
    renderVault();
  }

  function enhanceSlot() {
    var slot =
      document.getElementById("clarity-landing-slot-dayn") ||
      document.getElementById("clarity-dayn-entry");
    if (!slot) return false;
    // already enhanced?
    if (slot.getAttribute("data-dayn-enrich") === "3" && slot.querySelector("#dayn-save")) {
      renderToday(slot);
      return true;
    }
    slot.setAttribute("data-dayn-enrich", "3");
    slot.id = slot.id || "clarity-landing-slot-dayn";
    slot.innerHTML = richHtml();
    var saveBtn = slot.querySelector("#dayn-save");
    if (saveBtn) saveBtn.addEventListener("click", function () { saveLine(slot); });
    var ref = slot.querySelector("#dayn-refresh");
    if (ref) ref.addEventListener("click", function () { renderToday(slot); renderVault(); });
    var tut = slot.querySelector("#dayn-tut-dismiss");
    if (tut)
      tut.addEventListener("click", function () {
        try { localStorage.setItem(TUT, "1"); } catch (e) {}
        var t = slot.querySelector("#dayn-tutorial");
        if (t) t.remove();
      });
    // neutralize bare day-room button if still present outside
    renderToday(slot);
    return true;
  }

  function renderVault() {
    var panel = document.getElementById("clarity-dayn-vault-ledger");
    if (!panel || !panel.isConnected) {
      var anchor =
        document.getElementById("amana-family-tree-lite") ||
        document.getElementById("ahr-debts") ||
        document.querySelector(".amana-vault-interior");
      if (!anchor) return;
      panel = document.createElement("section");
      panel.id = "clarity-dayn-vault-ledger";
      panel.setAttribute("aria-label", "Amānah Dayn ledger");
      if (anchor.id === "ahr-debts" && anchor.parentNode) {
        anchor.parentNode.insertBefore(panel, anchor.nextSibling);
      } else if (anchor.id === "amana-family-tree-lite" && anchor.parentNode) {
        anchor.parentNode.insertBefore(panel, anchor);
      } else {
        anchor.appendChild(panel);
      }
    }
    var data = load();
    var html =
      '<div class="dayn-badge">✓ Qard ḥasan · registry</div>' +
      "<h3 style='margin:0.35rem 0;font-size:1rem'>Amānah Dayn ledger</h3>" +
      '<p class="dayn-foot">From Day landing · principal only · educational — not a fatwa.</p>';
    if (!data.lines.length) {
      html += '<p class="dayn-foot">No lines yet. Add from Day landing · Amānah Dayn.</p>';
    } else {
      data.lines
        .slice()
        .reverse()
        .forEach(function (l) {
          var rem = remaining(l, data);
          html +=
            '<div class="dayn-line"><strong>' +
            (l.direction === "owed_to_me" ? "Owed to me" : "I owe") +
            "</strong> · " + (l.who || "?") +
            " · principal " + money(l.amount) +
            " · remaining " + money(rem) + " " + (l.currency || "") +
            " · " + (l.status || "open") +
            (l.qardHasan ? " · ✓ QH" : "") +
            (l.note ? "<br/><span class='dayn-foot'>" + l.note + "</span>" : "") +
            "</div>";
        });
    }
    panel.innerHTML = html;
    panel.style.setProperty("display", "block", "important");
  }

  g.clarityDaynExportText = function () {
    var data = load();
    var lines = ["Amānah Dayn · Qard ḥasan only · educational · on-device"];
    data.lines.forEach(function (l) {
      lines.push([l.createdAt, l.direction, l.who, l.amount, l.currency, l.status, l.due, l.note].join("\t"));
    });
    return lines.join("\n");
  };

  function boot() {
    try {
      enhanceSlot();
      renderVault();
    } catch (e) {
      console.warn("[Dayn enrich v3]", e);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [800, 2500].forEach(function (ms) { setTimeout(boot, ms); }); /* C2 fewer retries */
  document.addEventListener("clarity:landing-ready", boot);
  document.addEventListener("clarity:day-room-ready", boot);
  document.addEventListener("clarity:companion-ready", boot);
  document.addEventListener(
    "click",
    function (ev) {
      var s = ((ev.target && ev.target.id) || "") + " " + ((ev.target && ev.target.className) || "");
      if (/amana|vault|unlock|day-path|shell/i.test(s)) setTimeout(boot, 400);
    },
    true
  );
  /* C2: MutationObserver removed — event-driven only */
  })(typeof window !== "undefined" ? window : this);
