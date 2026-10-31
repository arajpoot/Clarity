/* gated by runtime-gate when loaded after gate */
/**
 * Dayn Ledger v2 · Qard Hasan only — mount fix for live vault + landing
 * Landing: inside #clarity-day-landing (slot or end)
 * Vault: .amana-vault-interior after family outline / debts
 * Educational only — not a fatwa · not legal/financial advice
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAYN_LEDGER_V2__) return;
  g.__CLARITY_DAYN_LEDGER_V2__ = true;
  // allow re-run alongside v1 without double storage keys
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
    if (!isFinite(x)) return "0";
    return (Math.round(x * 100) / 100).toFixed(2);
  }
  function remaining(line, data) {
    var paid = 0;
    (data.repayments || []).forEach(function (r) {
      if (r.lineId === line.id) paid += Number(r.amount) || 0;
    });
    return Math.max(0, (Number(line.amount) || 0) - paid);
  }

  function cardHtml() {
    var tut = "";
    try {
      if (localStorage.getItem(TUT) !== "1") {
        tut =
          '<div class="dayn-tutorial" id="dayn-tutorial"><strong>Quick start</strong><ol style="margin:0.3rem 0 0;padding-left:1.1rem">' +
          "<li>Confirm Qard ḥasan only (no interest).</li>" +
          "<li>Add who, amount, and direction.</li>" +
          "<li>Record repayment when you pay or receive — stored on this device.</li>" +
          '</ol><button type="button" class="dayn-btn secondary" id="dayn-tut-dismiss">Got it</button></div>';
      }
    } catch (e) {}
    return (
      '<div class="dayn-badge">✓ Qard ḥasan ledger only · no interest</div>' +
      '<h2 class="dayn-title">Amānah Dayn · cash-flow entry</h2>' +
      '<p class="dayn-foot">Principal only · on this device · educational — not a fatwa.</p>' +
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
      '<div class="dayn-row"><div><label>Direction</label>' +
      '<select id="dayn-dir"><option value="i_owe">I owe</option><option value="owed_to_me">Owed to me</option></select></div>' +
      '<div><label>Amount</label><input id="dayn-amount" type="number" min="0" step="0.01" placeholder="0.00" /></div></div>' +
      '<label>Counterparty (name or initials)</label>' +
      '<input id="dayn-who" type="text" maxlength="80" placeholder="e.g. A.K." />' +
      '<div class="dayn-row"><div><label>Due (optional)</label><input id="dayn-due" type="date" /></div>' +
      '<div><label>Currency</label><input id="dayn-currency" type="text" maxlength="8" value="CAD" /></div></div>' +
      '<label>Note (optional)</label><textarea id="dayn-note" rows="2" maxlength="200" placeholder="Principal only"></textarea>' +
      '<div class="dayn-actions">' +
      '<button type="button" class="dayn-btn" id="dayn-save">Save to Amānah ledger</button>' +
      '<button type="button" class="dayn-btn secondary" id="dayn-refresh">Refresh</button></div>' +
      '<p class="dayn-msg" id="dayn-msg" hidden></p></div>' +
      '<div class="dayn-today"></div>' +
      '<p class="dayn-foot">Educational · on-device · not a fatwa · not legal/financial advice.</p>'
    );
  }

  function wire(host) {
    if (!host || host.getAttribute("data-dayn-wired") === "1") {
      renderToday(host);
      return;
    }
    host.setAttribute("data-dayn-wired", "1");
    host.innerHTML = cardHtml();
    var saveBtn = host.querySelector("#dayn-save");
    if (saveBtn) saveBtn.addEventListener("click", function () { saveLine(host); });
    var ref = host.querySelector("#dayn-refresh");
    if (ref) ref.addEventListener("click", function () { renderToday(host); renderVault(); });
    var tut = host.querySelector("#dayn-tut-dismiss");
    if (tut)
      tut.addEventListener("click", function () {
        try { localStorage.setItem(TUT, "1"); } catch (e) {}
        var t = host.querySelector("#dayn-tutorial");
        if (t) t.remove();
      });
    renderToday(host);
  }

  function msg(host, text) {
    var el = host.querySelector("#dayn-msg");
    if (!el) return;
    el.hidden = false;
    el.textContent = text;
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
    msg(host, "Saved · Qard ḥasan · this device.");
    try {
      host.querySelector("#dayn-amount").value = "";
      host.querySelector("#dayn-who").value = "";
      host.querySelector("#dayn-note").value = "";
    } catch (e) {}
    renderToday(host);
    renderVault();
  }

  function recordRepay(lineId) {
    var data = load();
    var line = data.lines.filter(function (l) { return l.id === lineId; })[0];
    if (!line) return;
    var rem = remaining(line, data);
    var raw = g.prompt(
      "Repayment (" + (line.currency || "") + "). Remaining " + money(rem) + ". Principal only.",
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
    var host = document.getElementById("clarity-dayn-entry");
    if (host) renderToday(host);
    renderVault();
  }

  function settleLine(lineId) {
    var data = load();
    data.lines.forEach(function (l) {
      if (l.id === lineId) l.status = "settled";
    });
    save(data);
    var host = document.getElementById("clarity-dayn-entry");
    if (host) renderToday(host);
    renderVault();
  }

  function renderToday(host) {
    if (!host) return;
    var box = host.querySelector(".dayn-today");
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
    open.slice(0, 10).forEach(function (l) {
      var rem = remaining(l, data);
      var dir = l.direction === "owed_to_me" ? "Owed to me" : "I owe";
      html +=
        '<div class="dayn-line" data-id="' + l.id + '">' +
        "<span><strong>" + dir + "</strong> · " + (l.who || "?") + " · " + money(rem) + " " + (l.currency || "") +
        (l.due ? " · due " + l.due : "") + "</span>" +
        '<button type="button" data-act="repay">Record repayment</button>' +
        '<button type="button" data-act="settle">Mark settled</button></div>';
    });
    box.innerHTML = html;
    box.querySelectorAll(".dayn-line button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.closest(".dayn-line").getAttribute("data-id");
        if (btn.getAttribute("data-act") === "repay") recordRepay(id);
        else settleLine(id);
      });
    });
  }

  function ensureLandingHost() {
    /* CONTAINED: only Day landing — never #main-content (prevents Reality leak / freeze) */
    try {
      if (window.ClarityVaultGate && !window.ClarityVaultGate.allowDaynLanding()) {
        return document.getElementById("clarity-dayn-entry");
      }
    } catch (eGate) {}
    var landing = document.getElementById("clarity-day-landing");
    if (!landing || landing.hidden || landing.getAttribute("aria-hidden") === "true") {
      return document.getElementById("clarity-dayn-entry");
    }
    var host = document.getElementById("clarity-dayn-entry");
    if (host && host.isConnected && landing.contains(host)) return host;
    /* Stray host outside landing — relocate or drop */
    if (host && host.isConnected && !landing.contains(host)) {
      try { host.remove(); } catch (eR) {}
      host = null;
    }
    if (!host) {
      host = document.createElement("section");
      host.id = "clarity-dayn-entry";
      host.className = "clarity-dayn-entry card";
      host.setAttribute("aria-label", "Qard Hasan dayn entry");
      host.setAttribute("data-dayn-contained", "1");
    }
    var slot = document.getElementById("clarity-landing-slot-dayn");
    if (!slot || !landing.contains(slot)) {
      slot = document.createElement("div");
      slot.id = "clarity-landing-slot-dayn";
      slot.setAttribute("data-dayn-slot", "1");
      var longStay = null;
      landing.querySelectorAll("h2,h3,.cdl-head,section,.card").forEach(function (el) {
        if (/remember the long stay/i.test(el.textContent || "")) {
          longStay = el.closest("section,article,.card") || el;
        }
      });
      if (longStay && longStay.parentElement) longStay.parentElement.insertBefore(slot, longStay);
      else landing.appendChild(slot);
    }
    if (!slot.contains(host)) slot.appendChild(host);
    return host;
  }

  function mountLanding() {
    var host = ensureLandingHost();
    if (!host) return; /* no landing yet — do not dump into companion tabs */
    host.hidden = false;
    host.style.setProperty("display", "block", "important");
    host.style.setProperty("visibility", "visible", "important");
    wire(host);
  }

  function renderVault() {
    var panel = document.getElementById("clarity-dayn-vault-ledger");
    if (!panel || !panel.isConnected) {
      panel = document.createElement("section");
      panel.id = "clarity-dayn-vault-ledger";
      panel.className = "clarity-dayn-entry";
      panel.setAttribute("aria-label", "Amānah Dayn ledger");
      var interior =
        document.querySelector(".amana-vault-interior") ||
        document.getElementById("amana-family-tree-lite") ||
        document.getElementById("ahr-debts") ||
        document.getElementById("amana-vault-gate");
      if (interior) {
        if (interior.id === "ahr-debts" && interior.parentNode) {
          interior.parentNode.insertBefore(panel, interior.nextSibling);
        } else if (interior.id === "amana-family-tree-lite" && interior.parentNode) {
          interior.parentNode.insertBefore(panel, interior);
        } else if (interior.classList && interior.classList.contains("amana-vault-interior")) {
          interior.appendChild(panel);
        } else if (interior.parentNode) {
          interior.parentNode.appendChild(panel);
        } else {
          return;
        }
      } else {
        return;
      }
    }
    var data = load();
    var html =
      '<div class="dayn-badge">✓ Qard ḥasan · Amānah ledger</div>' +
      "<h3 class='dayn-title' style='font-size:1rem;margin:0.35rem 0'>Dayn registry (this device)</h3>" +
      '<p class="dayn-foot">Linked to Day landing entry · no interest fields · educational only.</p>';
    if (!data.lines.length) {
      html += '<p class="dayn-foot">No lines yet. Add from Day landing · Amānah Dayn.</p>';
    } else {
      data.lines
        .slice()
        .reverse()
        .forEach(function (l) {
          var rem = remaining(l, data);
          html +=
            '<div class="dayn-v-line dayn-line">' +
            "<strong>" +
            (l.direction === "owed_to_me" ? "Owed to me" : "I owe") +
            "</strong> · " +
            (l.who || "?") +
            " · principal " +
            money(l.amount) +
            " · remaining " +
            money(rem) +
            " " +
            (l.currency || "") +
            " · " +
            (l.status || "open") +
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
      lines.push(
        [l.createdAt, l.direction, l.who, l.amount, l.currency, l.status, l.due, l.note].join("\t")
      );
    });
    return lines.join("\n");
  };

  function boot() {
    try {
      mountLanding();
      renderVault();
    } catch (e) {
      console.warn("[Dayn v2]", e);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [400, 1200, 2500, 5000, 9000].forEach(function (ms) {
    setTimeout(boot, ms);
  });
  document.addEventListener("clarity:landing-ready", boot);
  document.addEventListener("clarity:companion-ready", boot);
  // vault often unlocks late
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t) return;
    var s = (t.id || "") + " " + (t.className || "");
    if (/amana|vault|unlock|heir/i.test(s)) setTimeout(boot, 300);
  }, true);
  try {
    try {
      var _daynObs = new MutationObserver(function () {
        var land = document.getElementById("clarity-day-landing");
        var entry = document.getElementById("clarity-dayn-entry");
        if (entry && land && !land.contains(entry)) {
          try { entry.remove(); } catch (e) {}
          entry = null;
        }
        if (land && (!entry || !document.getElementById("clarity-dayn-vault-ledger"))) boot();
      });
      _daynObs.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () { try { _daynObs.disconnect(); } catch (e) {} }, 12000);
    } catch (e) {}
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
