/* gated by runtime-gate when loaded after gate */
/**
 * Dayn Ledger v1 · Qard Hasan only
 * Landing entry + Amānah Vault ledger (on-device)
 * Educational only — not a fatwa · not legal/financial advice
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAYN_LEDGER_V1__) return;
  g.__CLARITY_DAYN_LEDGER_V1__ = true;

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

  function educationHtml() {
    return (
      '<details class="dayn-edu"><summary>Before you record · short guidance</summary>' +
      "<ul>" +
      "<li><strong>Debts are serious</strong> — settle what you can; do not delay without right.</li>" +
      "<li><strong>Write it down</strong> — this is a memory aid on your device, not a court paper.</li>" +
      "<li><strong>Qard ḥasan only</strong> — interest (ribā) is not recorded or scheduled here.</li>" +
      "<li><strong>Honesty</strong> — log what you owe and what is owed to you.</li>" +
      "<li><strong>When unsure</strong> — ask a local qualified scholar. Clarity does not issue rulings.</li>" +
      "</ul></details>"
    );
  }

  function tutorialHtml() {
    try {
      if (localStorage.getItem(TUT) === "1") return "";
    } catch (e) {}
    return (
      '<div class="dayn-tutorial" id="dayn-tutorial">' +
      "<strong>Quick start</strong>" +
      "<ol style='margin:0.3rem 0 0;padding-left:1.1rem'>" +
      "<li>Confirm <em>Qard ḥasan only</em> (no interest).</li>" +
      "<li>Add who, amount, and whether you owe or are owed.</li>" +
      "<li>When you pay or receive, use <em>Record repayment</em> — the Amānah ledger updates on this device.</li>" +
      "</ol>" +
      '<button type="button" class="dayn-btn secondary" id="dayn-tut-dismiss" style="margin-top:0.35rem">Got it</button>' +
      "</div>"
    );
  }

  function formHtml() {
    return (
      '<div class="dayn-form">' +
      '<label class="dayn-qh-check"><input type="checkbox" id="dayn-qh" checked required />' +
      "<span>This entry is <strong>Qard ḥasan only</strong> — no interest, no ribā schedule. I will not use this ledger for interest-bearing debt.</span></label>" +
      '<div class="dayn-row">' +
      "<div><label for='dayn-dir'>Direction</label>" +
      '<select id="dayn-dir"><option value="i_owe">I owe</option><option value="owed_to_me">Owed to me</option></select></div>' +
      "<div><label for='dayn-amount'>Amount</label>" +
      '<input id="dayn-amount" type="number" min="0" step="0.01" placeholder="0.00" /></div>' +
      "</div>" +
      "<label for='dayn-who'>Counterparty (name or initials)</label>" +
      '<input id="dayn-who" type="text" maxlength="80" placeholder="e.g. A.K. or Brother Yusuf" />' +
      '<div class="dayn-row">' +
      "<div><label for='dayn-due'>Due (optional)</label>" +
      '<input id="dayn-due" type="date" /></div>' +
      "<div><label for='dayn-currency'>Currency</label>" +
      '<input id="dayn-currency" type="text" maxlength="8" value="CAD" /></div>' +
      "</div>" +
      "<label for='dayn-note'>Note (optional)</label>" +
      '<textarea id="dayn-note" rows="2" maxlength="200" placeholder="e.g. books loan — principal only"></textarea>' +
      '<div class="dayn-actions">' +
      '<button type="button" class="dayn-btn" id="dayn-save">Save to Amānah ledger</button>' +
      '<button type="button" class="dayn-btn secondary" id="dayn-refresh">Refresh list</button>' +
      "</div>" +
      '<p class="dayn-msg" id="dayn-msg" hidden></p>' +
      "</div>"
    );
  }

  function renderToday(host) {
    var box = host.querySelector(".dayn-today");
    if (!box) {
      box = document.createElement("div");
      box.className = "dayn-today";
      host.appendChild(box);
    }
    var data = load();
    var open = data.lines.filter(function (l) {
      return l.status !== "settled" && remaining(l, data) > 0.001;
    });
    if (!open.length) {
      box.innerHTML =
        '<p class="dayn-foot">No open Qard ḥasan lines on this device. Educational ledger only.</p>';
      return;
    }
    var html = "<strong style='font-size:0.8rem'>Open on this device</strong>";
    open.slice(0, 8).forEach(function (l) {
      var rem = remaining(l, data);
      var dir = l.direction === "owed_to_me" ? "Owed to me" : "I owe";
      html +=
        '<div class="dayn-line" data-id="' +
        l.id +
        '">' +
        "<span><strong>" +
        dir +
        "</strong> · " +
        (l.who || "?") +
        " · " +
        money(rem) +
        " " +
        (l.currency || "") +
        (l.due ? " · due " + l.due : "") +
        "</span>" +
        '<button type="button" data-act="repay">Record repayment</button>' +
        '<button type="button" data-act="settle">Mark settled</button>' +
        "</div>";
    });
    box.innerHTML = html;
    box.querySelectorAll(".dayn-line button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var line = btn.closest(".dayn-line");
        var id = line && line.getAttribute("data-id");
        var act = btn.getAttribute("data-act");
        if (!id) return;
        if (act === "repay") recordRepay(id);
        if (act === "settle") settleLine(id);
      });
    });
  }

  function msg(text, ok) {
    var el = document.getElementById("dayn-msg");
    if (!el) return;
    el.hidden = false;
    el.textContent = text;
    el.style.opacity = ok === false ? "1" : "1";
  }

  function saveLine() {
    var qh = document.getElementById("dayn-qh");
    if (!qh || !qh.checked) {
      msg("Confirm Qard ḥasan only (no interest) to save.", false);
      return;
    }
    var amount = Number((document.getElementById("dayn-amount") || {}).value);
    if (!isFinite(amount) || amount <= 0) {
      msg("Enter a valid amount.", false);
      return;
    }
    var who = ((document.getElementById("dayn-who") || {}).value || "").trim();
    if (!who) {
      msg("Add a counterparty name or initials.", false);
      return;
    }
    var data = load();
    data.lines.push({
      id: uid(),
      direction: (document.getElementById("dayn-dir") || {}).value || "i_owe",
      amount: amount,
      currency: ((document.getElementById("dayn-currency") || {}).value || "CAD").trim(),
      who: who,
      due: ((document.getElementById("dayn-due") || {}).value || "").trim(),
      note: ((document.getElementById("dayn-note") || {}).value || "").trim(),
      qardHasan: true,
      status: "open",
      createdAt: new Date().toISOString()
    });
    if (!save(data)) {
      msg("Could not save on this device.", false);
      return;
    }
    msg("Saved to Amānah Dayn ledger (this device). Qard ḥasan only.", true);
    try {
      document.getElementById("dayn-amount").value = "";
      document.getElementById("dayn-who").value = "";
      document.getElementById("dayn-note").value = "";
    } catch (e) {}
    var host = document.getElementById("clarity-dayn-entry");
    if (host) renderToday(host);
    renderVaultPanel();
  }

  function recordRepay(lineId) {
    var data = load();
    var line = data.lines.filter(function (l) {
      return l.id === lineId;
    })[0];
    if (!line) return;
    var rem = remaining(line, data);
    var raw = g.prompt(
      "Repayment amount (" + (line.currency || "") + "). Remaining " + money(rem) + ". Qard ḥasan principal only.",
      String(rem)
    );
    if (raw == null) return;
    var amt = Number(raw);
    if (!isFinite(amt) || amt <= 0) {
      msg("Invalid repayment.", false);
      return;
    }
    data.repayments.push({
      id: uid(),
      lineId: lineId,
      amount: amt,
      at: new Date().toISOString(),
      qardHasan: true
    });
    if (remaining(line, data) <= 0.001) line.status = "settled";
    save(data);
    msg("Repayment recorded on this device.", true);
    var host = document.getElementById("clarity-dayn-entry");
    if (host) renderToday(host);
    renderVaultPanel();
  }

  function settleLine(lineId) {
    var data = load();
    data.lines.forEach(function (l) {
      if (l.id === lineId) l.status = "settled";
    });
    save(data);
    msg("Marked settled on this device.", true);
    var host = document.getElementById("clarity-dayn-entry");
    if (host) renderToday(host);
    renderVaultPanel();
  }

  function mountLanding() {
    var host = document.getElementById("clarity-dayn-entry");
    if (!host) {
      host = document.createElement("section");
      host.id = "clarity-dayn-entry";
      host.className = "clarity-dayn-entry card";
      host.setAttribute("aria-label", "Qard Hasan dayn entry");
      // place after adhkar or vault note or dual tiles
      var after =
        document.getElementById("cdl-adhkar") ||
        document.querySelector(".cdl-card, #cdl-today") ||
        document.querySelector(".dual-tiles");
      if (after && after.parentNode) {
        after.parentNode.insertBefore(host, after.nextSibling);
      } else {
        var main = document.getElementById("main-content") || document.body;
        main.appendChild(host);
      }
    }
    host.innerHTML =
      '<div class="dayn-badge">✓ Qard ḥasan ledger only · no interest</div>' +
      '<h2 class="dayn-title">Amānah Dayn · cash-flow entry</h2>' +
      "<p class=\"dayn-foot\">Record principal obligations on this device. Full ledger stays with your Amānah records below. Educational only.</p>" +
      tutorialHtml() +
      educationHtml() +
      formHtml() +
      '<div class="dayn-today"></div>' +
      '<p class="dayn-foot">Educational habit tool · on-device · not a fatwa · not legal or financial advice. Verify serious matters with a qualified local scholar.</p>';

    var saveBtn = document.getElementById("dayn-save");
    if (saveBtn) saveBtn.addEventListener("click", saveLine);
    var ref = document.getElementById("dayn-refresh");
    if (ref)
      ref.addEventListener("click", function () {
        renderToday(host);
        renderVaultPanel();
      });
    var tut = document.getElementById("dayn-tut-dismiss");
    if (tut)
      tut.addEventListener("click", function () {
        try {
          localStorage.setItem(TUT, "1");
        } catch (e) {}
        var t = document.getElementById("dayn-tutorial");
        if (t) t.remove();
      });
    renderToday(host);
  }

  function renderVaultPanel() {
    var panel = document.getElementById("clarity-dayn-vault-ledger");
    if (!panel) {
      // try place near vault / amana sections
      var vault =
        document.getElementById("tab-amanah") ||
        document.querySelector("[data-tab='amanah'], #amana-vault, .amana-vault") ||
        document.getElementById("tab-action");
      panel = document.createElement("section");
      panel.id = "clarity-dayn-vault-ledger";
      panel.setAttribute("aria-label", "Amānah Dayn ledger");
      if (vault) vault.appendChild(panel);
      else return; // only show when vault tab exists in DOM
    }
    var data = load();
    var html =
      "<h3>Amānah Dayn ledger · Qard ḥasan</h3>" +
      '<p class="dayn-foot">On-device registry. No interest fields. Educational only — not a fatwa.</p>';
    if (!data.lines.length) {
      html += "<p class='dayn-foot'>No lines yet. Add from Day landing entry.</p>";
    } else {
      data.lines
        .slice()
        .reverse()
        .forEach(function (l) {
          var rem = remaining(l, data);
          html +=
            '<div class="dayn-v-line">' +
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
  }

  // Export helper for Phase 5
  g.clarityDaynExportText = function () {
    var data = load();
    var lines = ["Amānah Dayn ledger (Qard ḥasan only) · educational · on-device"];
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
      renderVaultPanel();
    } catch (e) {
      console.warn("[Dayn ledger]", e);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [500, 1500, 3000].forEach(function (ms) {
    setTimeout(boot, ms);
  });
  document.addEventListener("clarity:landing-ready", boot);
  document.addEventListener("clarity:companion-ready", boot);
})(typeof window !== "undefined" ? window : this);


/* Dayn mount harden — survive landing-v3 repaint */
(function(g){
  "use strict";
  if(g.__CLARITY_DAYN_MOUNT_HARDEN__) return;
  g.__CLARITY_DAYN_MOUNT_HARDEN__ = true;

  function place(host){
    if(!host || host.isConnected) return host;
    return null;
  }

  function ensureHost(){
    var host = document.getElementById("clarity-dayn-entry");
    if(host && host.isConnected) return host;
    host = document.createElement("section");
    host.id = "clarity-dayn-entry";
    host.className = "clarity-dayn-entry card";
    host.setAttribute("aria-label", "Qard Hasan dayn entry");

    var anchors = [
      document.querySelector(".dual-tiles"),
      document.getElementById("dual-path-university"),
      document.getElementById("dual-path-companion"),
      document.querySelector("[data-shell-mode] .landing, #clarity-landing, .clarity-landing"),
      document.querySelector(".cdl-card"),
      document.getElementById("cdl-today"),
      document.getElementById("cdl-adhkar"),
      document.getElementById("main-content"),
      document.body
    ];
    var inserted = false;
    for(var i=0;i<anchors.length;i++){
      var a = anchors[i];
      if(!a || !a.parentNode) continue;
      // prefer after dual-tiles
      if(a.classList && a.classList.contains("dual-tiles")){
        a.parentNode.insertBefore(host, a.nextSibling);
        inserted = true;
        break;
      }
      if(a.id === "dual-path-university" || a.id === "dual-path-companion"){
        var row = a.closest(".dual-tiles") || a.parentNode;
        if(row && row.parentNode){
          row.parentNode.insertBefore(host, row.nextSibling);
          inserted = true;
          break;
        }
      }
    }
    if(!inserted){
      var main = document.getElementById("main-content") || document.body;
      main.appendChild(host);
    }
    return host;
  }

  function forceVisible(host){
    if(!host) return;
    host.hidden = false;
    host.removeAttribute("hidden");
    host.style.setProperty("display", "block", "important");
    host.style.setProperty("visibility", "visible", "important");
    host.style.setProperty("opacity", "1", "important");
    // if parent shell hides landing content, still show when landing mode
    var mode = document.documentElement.getAttribute("data-shell-mode");
    if(mode === "companion"){
      // keep available but can sit under ribbon; user asked landing primarily
    }
  }

  function remount(){
    try{
      if(typeof g.__CLARITY_DAYN_LEDGER_V1__ === "undefined") return;
      // call original boot path by dispatching
      var host = ensureHost();
      forceVisible(host);
      // If empty shell, trigger full rebuild via click path on refresh button after boot fills
      if(host && !host.querySelector("#dayn-save")){
        // original script's boot should fill — dispatch event it listens
        document.dispatchEvent(new CustomEvent("clarity:landing-ready"));
      }
      forceVisible(document.getElementById("clarity-dayn-entry"));
    }catch(e){ console.warn("[Dayn harden]", e); }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", remount);
  else remount();
  [600,1500,3000,5000,8000].forEach(function(ms){ setTimeout(remount, ms); });
  document.addEventListener("clarity:landing-ready", remount);
  document.addEventListener("clarity:companion-ready", remount);

  try{
    var obs = new MutationObserver(function(){
      var h = document.getElementById("clarity-dayn-entry"); try{setTimeout(function(){try{obs.disconnect()}catch(e){}},12000);}catch(e){}
      if(!h || !h.isConnected) remount();
    });
    obs.observe(document.body, { childList:true, subtree:true });
  }catch(e){}
})(typeof window !== "undefined" ? window : this);


/* prefer landing slot */
(function(g){
  "use strict";
  if(g.__CLARITY_DAYN_SLOT_PREF__) return;
  g.__CLARITY_DAYN_SLOT_PREF__ = true;
  function moveToSlot(){
    var host = document.getElementById("clarity-dayn-entry");
    var slot = document.getElementById("clarity-landing-slot-dayn");
    if(!host || !slot) return;
    if(slot.contains(host)) return;
    try { slot.appendChild(host); } catch(e) {}
    host.hidden = false;
    host.style.setProperty("display","block","important");
  }
  function boot(){ moveToSlot(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [500,1500,3000,6000].forEach(function(ms){ setTimeout(boot, ms); });
  document.addEventListener("clarity:landing-ready", boot);
})(typeof window !== "undefined" ? window : this);
