/*! Amānah Desk v1 · Reception · ATM notes · Dayn express · stamped intake
 * Public surface — no vault unlock required for intake
 * On unlock: optional transfer into notes / dayn + interior landing
 * Educational only — not a fatwa · not a bank · not legal advice
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_DESK_V1__) return;
  w.__CLARITY_AMANA_DESK_V1__ = true;

  var LOG_KEY = "clarity_amana_intake_log_v1";
  var NOTES_KEY = "clarity_amana_notes_page_v1";
  var DAYN_INTAKE_KEY = "clarity_dayn_intake_v1";
  var DAYN_LEDGER_KEY = "clarity_dayn_ledger_v1";

  function isDeskPage() {
    var p = location.pathname || "";
    return /\/amana\/?$/.test(p) || /\/amana\/desk\/?/.test(p) || /\/amana\/index\.html$/.test(p);
  }

  function loadLog() {
    try {
      var a = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }
  function saveLog(a) {
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(a.slice(0, 200)));
    } catch (e) {}
  }

  function ticketId() {
    var t = Date.now().toString(36).toUpperCase();
    var r = Math.random().toString(36).slice(2, 6).toUpperCase();
    return "AD-" + t.slice(-5) + "-" + r;
  }

  function stampNow() {
    try {
      return new Date().toISOString();
    } catch (e) {
      return String(Date.now());
    }
  }

  function formatStamp(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return iso;
    }
  }

  function isUnlocked() {
    try {
      if (w.ClarityAmanaEngine && typeof w.ClarityAmanaEngine.isUnlocked === "function") {
        return !!w.ClarityAmanaEngine.isUnlocked();
      }
    } catch (e) {}
    try {
      return document.documentElement.getAttribute("data-amana-unlocked") === "1";
    } catch (e2) {
      return false;
    }
  }

  function deskHtml() {
    return (
      '<div class="amana-desk" id="amana-desk-root">' +
      '<header class="amana-desk-hero">' +
      '<p class="bism">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>' +
      "<h1>Amānah Desk</h1>" +
      '<p class="sub">Reception for trusts on this device. Deposit a note or record a dayn (debt) without opening the full vault. Unlock only when you need the deeper chambers.</p>' +
      "</header>" +
      '<div class="amana-desk-windows">' +
      /* Window 1 — ATM Notes */
      '<section class="desk-window" id="desk-win-notes" aria-labelledby="desk-notes-title">' +
      '<span class="win-tag">Window 1 · ATM Notes</span>' +
      '<h2 id="desk-notes-title">Deposit a note</h2>' +
      '<p class="hint">Like a slip in the night deposit: stamped, held in the intake tray, transferable into Notes after unlock.</p>' +
      '<label>Title (optional)<input type="text" id="desk-note-title" placeholder="e.g. Reminder · contact · intention" maxlength="120"/></label>' +
      '<label>Note<textarea id="desk-note-body" placeholder="Write privately on this device…"></textarea></label>' +
      '<div class="actions"><button type="button" id="desk-note-submit">Deposit note</button>' +
      '<button type="button" class="soft" id="desk-note-clear">Clear</button></div>' +
      '<div class="desk-receipt" id="desk-note-receipt"></div>' +
      '<p class="desk-msg" id="desk-note-msg" role="status"></p>' +
      "</section>" +
      /* Window 2 — Dayn Express */
      '<section class="desk-window" id="desk-win-dayn" aria-labelledby="desk-dayn-title">' +
      '<span class="win-tag">Window 2 · Dayn Express</span>' +
      '<h2 id="desk-dayn-title">Record a dayn</h2>' +
      '<p class="hint">Quick debt entry — no vault unlock. Stamped into intake; merges to the Dayn ledger when you transfer after unlock.</p>' +
      '<label>What / to whom<input type="text" id="desk-dayn-who" placeholder="Person or description" maxlength="160"/></label>' +
      '<label>Amount (optional)<input type="text" id="desk-dayn-amount" placeholder="e.g. 500" inputmode="decimal"/></label>' +
      '<label>Currency<select id="desk-dayn-currency"><option value="">—</option><option>CAD</option><option>USD</option><option>PKR</option><option>GBP</option><option>EUR</option><option>Other</option></select></label>' +
      '<label>Note<textarea id="desk-dayn-note" placeholder="Due date, context…" rows="2"></textarea></label>' +
      '<div class="actions"><button type="button" id="desk-dayn-submit">Stamp dayn entry</button>' +
      '<button type="button" class="soft" id="desk-dayn-clear">Clear</button></div>' +
      '<div class="desk-receipt" id="desk-dayn-receipt"></div>' +
      '<p class="desk-msg" id="desk-dayn-msg" role="status"></p>' +
      "</section>" +
      "</div>" +
      /* Log */
      '<section class="desk-log" id="desk-log">' +
      "<h2>📋 Intake log · stamped on this device</h2>" +
      '<p class="hint" style="font-size:0.78rem;opacity:0.88;margin:0 0 0.45rem">Newest first. Private · not uploaded. Transfer into the vault after unlock if you wish.</p>' +
      '<div class="desk-log-list" id="desk-log-list"></div>' +
      '<div class="actions" style="margin-top:0.5rem">' +
      '<button type="button" class="soft" id="desk-log-refresh">Refresh log</button>' +
      '<button type="button" class="soft" id="desk-log-export">Export log JSON</button>' +
      '<button type="button" class="soft" id="desk-transfer" hidden>Transfer intake → vault</button>' +
      "</div></section>" +
      /* Unlock lane */
      '<section class="desk-unlock-lane" id="desk-unlock-lane">' +
      "<h2>Need the full Amānah chambers?</h2>" +
      "<p>Family tree, Farāʾiḍ study, Wasiyyah, full Dayn ledger, and Notes desk open after unlock.</p>" +
      '<button type="button" class="desk-btn" id="desk-scroll-unlock">Unlock vault · go to reception login</button>' +
      "</section>" +
      /* Interior second landing */
      '<section class="desk-interior" id="desk-interior" aria-live="polite">' +
      "<h2>Interior landing · chambers open</h2>" +
      '<p style="font-size:0.85rem;opacity:0.9;margin:0">Vault unlocked on this session. Choose your business:</p>' +
      '<div class="desk-biz-grid">' +
      '<a class="desk-biz-card" href="/amana/tree/"><strong>🌳 Family tree</strong><span>Registry · pedigree · build</span></a>' +
      '<a class="desk-biz-card" href="/amana/fiqh/"><strong>⚖️ Farāʾiḍ study</strong><span>Educational shares calculator</span></a>' +
      '<a class="desk-biz-card" href="/amana/wasiyyah/"><strong>📜 Wasiyyah notes</strong><span>Bequest worksheet · export</span></a>' +
      '<a class="desk-biz-card" href="/amana/dayn/"><strong>📒 Dayn ledger</strong><span>Full debt register</span></a>' +
      '<a class="desk-biz-card" href="/amana/notes/"><strong>📝 Notes</strong><span>Private page notes</span></a>' +
      '<a class="desk-biz-card" href="/amana/heirs/"><strong>📋 Heir readiness</strong><span>Next of kin outline</span></a>' +
      "</div>" +
      '<p class="desk-msg" id="desk-interior-msg" style="margin-top:0.55rem"></p>' +
      "</section>" +
      '<p class="desk-disc">Educational companion only · not a fatwa · not a bank · not legal advice. Data stays on this device unless you export it.</p>' +
      "</div>"
    );
  }

  function pushEntry(entry) {
    var log = loadLog();
    log.unshift(entry);
    saveLog(log);
    if (entry.type === "dayn") {
      try {
        var q = JSON.parse(localStorage.getItem(DAYN_INTAKE_KEY) || "[]");
        if (!Array.isArray(q)) q = [];
        q.unshift(entry);
        localStorage.setItem(DAYN_INTAKE_KEY, JSON.stringify(q.slice(0, 100)));
      } catch (e) {}
    }
    renderLog();
    return entry;
  }

  function showReceipt(el, entry) {
    if (!el) return;
    el.classList.add("show");
    el.innerHTML =
      '<div class="ticket">Ticket ' +
      escapeHtml(entry.ticket) +
      "</div>" +
      "<div>Stamped: " +
      escapeHtml(formatStamp(entry.stampedAt)) +
      "</div>" +
      "<div>" +
      escapeHtml(entry.type === "dayn" ? "Dayn express" : "ATM note") +
      " held in intake tray.</div>";
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderLog() {
    var box = document.getElementById("desk-log-list");
    if (!box) return;
    var log = loadLog();
    if (!log.length) {
      box.innerHTML = '<p style="opacity:0.8;padding:0.35rem">No intake yet. Deposit a note or stamp a dayn above.</p>';
      return;
    }
    box.innerHTML = log
      .slice(0, 40)
      .map(function (e) {
        var body = e.title ? "<strong>" + escapeHtml(e.title) + "</strong> — " + escapeHtml(e.body || "") : escapeHtml(e.body || "");
        if (e.type === "dayn") {
          body =
            escapeHtml(e.who || "") +
            (e.amount ? " · " + escapeHtml(e.amount) + " " + escapeHtml(e.currency || "") : "") +
            (e.body ? " — " + escapeHtml(e.body) : "");
        }
        return (
          '<div class="desk-log-item">' +
          '<span class="stamp">' +
          escapeHtml(formatStamp(e.stampedAt)) +
          "</span>" +
          '<span class="kind">' +
          escapeHtml(e.type) +
          " · " +
          escapeHtml(e.ticket) +
          "</span>" +
          '<div class="body">' +
          body +
          "</div></div>"
        );
      })
      .join("");
  }

  function depositNote() {
    var title = ((document.getElementById("desk-note-title") || {}).value || "").trim();
    var body = ((document.getElementById("desk-note-body") || {}).value || "").trim();
    var msg = document.getElementById("desk-note-msg");
    if (!body) {
      if (msg) {
        msg.textContent = "Write a note first.";
        msg.className = "desk-msg err";
      }
      return;
    }
    var entry = {
      id: "n_" + Date.now().toString(36),
      ticket: ticketId(),
      type: "note",
      title: title,
      body: body,
      stampedAt: stampNow()
    };
    pushEntry(entry);
    showReceipt(document.getElementById("desk-note-receipt"), entry);
    if (msg) {
      msg.textContent = "Deposited · ticket " + entry.ticket;
      msg.className = "desk-msg ok";
    }
    var t = document.getElementById("desk-note-title");
    var b = document.getElementById("desk-note-body");
    if (t) t.value = "";
    if (b) b.value = "";
  }

  function stampDayn() {
    var who = ((document.getElementById("desk-dayn-who") || {}).value || "").trim();
    var amount = ((document.getElementById("desk-dayn-amount") || {}).value || "").trim();
    var currency = ((document.getElementById("desk-dayn-currency") || {}).value || "").trim();
    var note = ((document.getElementById("desk-dayn-note") || {}).value || "").trim();
    var msg = document.getElementById("desk-dayn-msg");
    if (!who && !note) {
      if (msg) {
        msg.textContent = "Add a person/description or note.";
        msg.className = "desk-msg err";
      }
      return;
    }
    var entry = {
      id: "d_" + Date.now().toString(36),
      ticket: ticketId(),
      type: "dayn",
      who: who,
      amount: amount,
      currency: currency,
      body: note,
      stampedAt: stampNow()
    };
    pushEntry(entry);
    showReceipt(document.getElementById("desk-dayn-receipt"), entry);
    if (msg) {
      msg.textContent = "Dayn stamped · ticket " + entry.ticket;
      msg.className = "desk-msg ok";
    }
    ["desk-dayn-who", "desk-dayn-amount", "desk-dayn-note"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
  }

  function exportLog() {
    var log = loadLog();
    var blob = new Blob([JSON.stringify({ exportType: "clarity-amana-intake-log", exportedAt: stampNow(), entries: log }, null, 2)], {
      type: "application/json"
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "amana-intake-log-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
  }

  /** Move intake into vault stores after unlock */
  function transferToVault() {
    if (!isUnlocked()) {
      alert("Unlock the vault first, then transfer intake.");
      return;
    }
    var log = loadLog();
    if (!log.length) {
      alert("Intake log is empty.");
      return;
    }
    var notesMoved = 0;
    var daynMoved = 0;
    // Notes
    try {
      var notesRaw = localStorage.getItem(NOTES_KEY);
      var notes = notesRaw ? JSON.parse(notesRaw) : {};
      if (typeof notes !== "object" || !notes) notes = {};
      var pages = Array.isArray(notes.pages) ? notes.pages : notes.items ? notes.items : [];
      if (!Array.isArray(pages)) pages = [];
      log
        .filter(function (e) {
          return e.type === "note" && !e.transferred;
        })
        .forEach(function (e) {
          pages.unshift({
            id: e.id,
            title: e.title || "Desk note " + e.ticket,
            body: e.body || "",
            tags: ["intake", "desk"],
            createdAt: e.stampedAt,
            fromDesk: true,
            ticket: e.ticket
          });
          e.transferred = true;
          notesMoved++;
        });
      notes.pages = pages;
      notes.items = pages;
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {}
    // Dayn ledger merge
    try {
      var ledgerRaw = localStorage.getItem(DAYN_LEDGER_KEY);
      var ledger = ledgerRaw ? JSON.parse(ledgerRaw) : { lines: [] };
      if (!ledger || typeof ledger !== "object") ledger = { lines: [] };
      if (!Array.isArray(ledger.lines)) ledger.lines = [];
      log
        .filter(function (e) {
          return e.type === "dayn" && !e.transferred;
        })
        .forEach(function (e) {
          ledger.lines.unshift({
            id: e.id,
            label: e.who || e.body || "Dayn",
            amount: e.amount || "",
            currency: e.currency || "",
            note: e.body || "",
            status: "open",
            createdAt: e.stampedAt,
            fromDesk: true,
            ticket: e.ticket
          });
          e.transferred = true;
          daynMoved++;
        });
      ledger.updatedAt = stampNow();
      localStorage.setItem(DAYN_LEDGER_KEY, JSON.stringify(ledger));
    } catch (e) {}
    saveLog(log);
    renderLog();
    var im = document.getElementById("desk-interior-msg");
    if (im) {
      im.textContent = "Transferred: " + notesMoved + " note(s), " + daynMoved + " dayn line(s) · educational only";
      im.className = "desk-msg ok";
    }
  }

  function syncInterior() {
    var open = isUnlocked();
    var interior = document.getElementById("desk-interior");
    var transfer = document.getElementById("desk-transfer");
    var lane = document.getElementById("desk-unlock-lane");
    if (interior) interior.classList.toggle("is-open", open);
    if (transfer) transfer.hidden = !open;
    if (lane) lane.style.display = open ? "none" : "";
  }

  function bind() {
    var n = document.getElementById("desk-note-submit");
    if (n) n.onclick = depositNote;
    var nc = document.getElementById("desk-note-clear");
    if (nc)
      nc.onclick = function () {
        var t = document.getElementById("desk-note-title");
        var b = document.getElementById("desk-note-body");
        if (t) t.value = "";
        if (b) b.value = "";
      };
    var d = document.getElementById("desk-dayn-submit");
    if (d) d.onclick = stampDayn;
    var dc = document.getElementById("desk-dayn-clear");
    if (dc)
      dc.onclick = function () {
        ["desk-dayn-who", "desk-dayn-amount", "desk-dayn-note"].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.value = "";
        });
      };
    var ref = document.getElementById("desk-log-refresh");
    if (ref) ref.onclick = renderLog;
    var exp = document.getElementById("desk-log-export");
    if (exp) exp.onclick = exportLog;
    var tr = document.getElementById("desk-transfer");
    if (tr) tr.onclick = transferToVault;
    var scroll = document.getElementById("desk-scroll-unlock");
    if (scroll)
      scroll.onclick = function () {
        var gate = document.getElementById("amana-vault-gate") || document.getElementById("amana-gate-unlock");
        if (gate) {
          try {
            gate.scrollIntoView({ behavior: "smooth", block: "start" });
          } catch (e) {
            gate.scrollIntoView(true);
          }
          gate.classList.add("amana-desk-soft");
        }
      };
  }

  function mount() {
    if (!isDeskPage()) return;
    document.documentElement.classList.add("amana-desk-mode");
    if (document.getElementById("amana-desk-root")) {
      bind();
      renderLog();
      syncInterior();
      return;
    }
    var host =
      document.getElementById("amana-desk-mount") ||
      document.querySelector("main.amana-wrap") ||
      document.querySelector("main") ||
      document.body;
    var wrap = document.createElement("div");
    wrap.innerHTML = deskHtml();
    var node = wrap.firstChild;
    // Prefer before gate so reception is first
    var gate = document.getElementById("amana-vault-gate");
    if (gate && gate.parentNode) gate.parentNode.insertBefore(node, gate);
    else host.insertBefore(node, host.firstChild);
    bind();
    renderLog();
    syncInterior();
  }

  function boot() {
    try {
      mount();
    } catch (e) {
      try {
        console.warn("[Amānah Desk]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(syncInterior, 800);
  setTimeout(syncInterior, 2000);
  document.addEventListener("clarity-amana-unlock-change", function () {
    setTimeout(syncInterior, 50);
  });
  // Poll lightly for unlock state (engine may not emit)
  var ticks = 0;
  var iv = setInterval(function () {
    ticks++;
    syncInterior();
    if (ticks > 40) clearInterval(iv);
  }, 1500);
})(window);
