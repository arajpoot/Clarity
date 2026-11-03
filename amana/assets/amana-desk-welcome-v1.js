/*! Amānah Desk + Welcome merged v1
 * One page: campus illustration + nightly intake + unlock option
 * No unlock required for notes / dayn express
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_DESK_WELCOME_V1__) return;
  w.__CLARITY_AMANA_DESK_WELCOME_V1__ = true;

  var LOG_KEY = "clarity_amana_intake_log_v1";
  var NOTES_KEY = "clarity_amana_notes_page_v1";
  var DAYN_INTAKE_KEY = "clarity_dayn_intake_v1";
  var DAYN_LEDGER_KEY = "clarity_dayn_ledger_v1";

  function isHome() {
    var p = location.pathname || "";
    return /\/amana\/?$/.test(p) || /\/amana\/index\.html$/.test(p) || /\/amana\/desk\/?/.test(p) || /\/amana\/welcome\/?/.test(p);
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
    return "AD-" + Date.now().toString(36).toUpperCase().slice(-5) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  }
  function stampNow() {
    return new Date().toISOString();
  }
  function formatStamp(iso) {
    try {
      return new Date(iso).toLocaleString(undefined, {
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
  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  function campusSvg() {
    return (
      '<div class="dw-campus" role="img" aria-label="Amānah campus at dusk">' +
      '<svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="dwSky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#122a22"/><stop offset="100%" stop-color="#081510"/>' +
      "</linearGradient>" +
      '<linearGradient id="dwDome" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#2d7a5c"/><stop offset="100%" stop-color="#1a4a38"/>' +
      "</linearGradient>" +
      '<radialGradient id="dwLampG" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="#f3e6c0" stop-opacity="0.85"/>' +
      '<stop offset="100%" stop-color="#f3e6c0" stop-opacity="0"/>' +
      "</radialGradient>" +
      "</defs>" +
      '<rect width="800" height="280" fill="url(#dwSky)"/>' +
      '<g fill="#e8d5a3">' +
      '<circle class="dw-star" cx="50" cy="28" r="1.4"/><circle class="dw-star" cx="110" cy="48" r="1.1"/>' +
      '<circle class="dw-star" cx="190" cy="22" r="1.3"/><circle class="dw-star" cx="520" cy="32" r="1.2"/>' +
      '<circle class="dw-star" cx="660" cy="20" r="1.4"/><circle class="dw-star" cx="740" cy="50" r="1"/>' +
      "</g>" +
      '<circle class="dw-moon" cx="710" cy="48" r="18" fill="#e8d5a3" opacity="0.9"/>' +
      '<circle cx="716" cy="42" r="14" fill="#0c1c16" opacity="0.35"/>' +
      '<g class="dw-cloud" fill="#1e3d32" opacity="0.4">' +
      '<ellipse cx="150" cy="60" rx="40" ry="12"/><ellipse cx="175" cy="58" rx="22" ry="9"/>' +
      "</g>" +
      '<g class="dw-cloud-b" fill="#1e3d32" opacity="0.3">' +
      '<ellipse cx="480" cy="68" rx="45" ry="11"/>' +
      "</g>" +
      '<path d="M0 180 Q200 155 400 170 T800 165 L800 280 L0 280 Z" fill="#0a1a14"/>' +
      '<path d="M300 280 Q360 220 400 195 Q440 220 500 280" fill="#1a3328" stroke="#d4b45a" stroke-width="0.8" opacity="0.65"/>' +
      /* Library */
      '<g transform="translate(70,120)">' +
      '<rect x="0" y="30" width="130" height="85" rx="3" fill="#16352a" stroke="#2d7a5c"/>' +
      '<polygon points="0,30 65,5 130,30" fill="#1a4a38" stroke="#d4b45a" stroke-width="0.8"/>' +
      '<rect class="dw-win" x="14" y="42" width="18" height="22" rx="2" fill="#e8d5a3"/>' +
      '<rect class="dw-win" x="42" y="42" width="18" height="22" rx="2" fill="#e8d5a3"/>' +
      '<rect class="dw-win" x="70" y="42" width="18" height="22" rx="2" fill="#e8d5a3"/>' +
      '<rect class="dw-win" x="98" y="42" width="18" height="22" rx="2" fill="#e8d5a3"/>' +
      '<text x="65" y="108" text-anchor="middle" fill="#d4b45a" font-size="10" font-family="Georgia,serif">Library</text>' +
      "</g>" +
      /* Prayer */
      '<g transform="translate(300,95)">' +
      '<rect x="25" y="55" width="100" height="75" fill="#16352a" stroke="#2d7a5c"/>' +
      '<path d="M25 58 Q75 8 125 58 Z" fill="url(#dwDome)" stroke="#d4b45a" stroke-width="1"/>' +
      '<circle cx="75" cy="22" r="4" fill="#e8d5a3"/>' +
      '<path d="M58 130 L58 95 Q75 80 92 95 L92 130 Z" fill="#0a1812" stroke="#d4b45a"/>' +
      '<rect x="130" y="25" width="11" height="95" fill="#1a4a38" stroke="#d4b45a" stroke-width="0.7"/>' +
      '<polygon points="128,25 135.5,12 143,25" fill="#d4b45a"/>' +
      '<g class="dw-flag"><path d="M141 30 L162 35 L141 40 Z" fill="#c45c3e" opacity="0.9"/></g>' +
      '<text x="75" y="145" text-anchor="middle" fill="#d4b45a" font-size="10" font-family="Georgia,serif">Prayer hall</text>' +
      "</g>" +
      /* Desk */
      '<g transform="translate(540,130)">' +
      '<rect x="0" y="25" width="120" height="80" rx="3" fill="#16352a" stroke="#2d7a5c"/>' +
      '<rect class="dw-win" x="16" y="40" width="35" height="28" rx="2" fill="#e8d5a3"/>' +
      '<rect class="dw-win" x="68" y="40" width="35" height="28" rx="2" fill="#e8d5a3"/>' +
      '<rect x="48" y="78" width="24" height="27" fill="#0a1812" stroke="#d4b45a"/>' +
      '<text x="60" y="118" text-anchor="middle" fill="#d4b45a" font-size="10" font-family="Georgia,serif">Desk</text>' +
      "</g>" +
      /* Trees */
      '<g class="dw-tree" transform="translate(30,165)"><rect x="14" y="35" width="6" height="40" fill="#3d2914"/><ellipse cx="17" cy="30" rx="20" ry="24" fill="#1e5c44"/></g>' +
      '<g class="dw-tree-2" transform="translate(720,170)"><rect x="14" y="30" width="5" height="38" fill="#3d2914"/><ellipse cx="17" cy="26" rx="18" ry="22" fill="#246b50"/></g>' +
      /* Fountain */
      '<g transform="translate(385,195)"><ellipse cx="12" cy="28" rx="22" ry="6" fill="#1a3a30" stroke="#2d7a5c"/>' +
      '<rect class="dw-fountain" x="10" y="6" width="4" height="22" fill="#7dcea0" opacity="0.8"/>' +
      '<circle class="dw-fountain" cx="12" cy="6" r="4" fill="#9fd4c0" opacity="0.7"/></g>' +
      /* Lamps */
      '<g transform="translate(330,220)"><rect width="3" height="22" fill="#4a3a20"/><circle class="dw-lamp" cx="1.5" cy="0" r="8" fill="url(#dwLampG)"/><circle cx="1.5" cy="0" r="2.5" fill="#e8d5a3"/></g>' +
      '<g transform="translate(460,220)"><rect width="3" height="22" fill="#4a3a20"/><circle class="dw-lamp" cx="1.5" cy="0" r="8" fill="url(#dwLampG)"/><circle cx="1.5" cy="0" r="2.5" fill="#e8d5a3"/></g>' +
      /* Walker */
      '<g class="dw-person" transform="translate(290,230)"><circle cx="6" cy="3" r="3.2" fill="#c4b59a"/><rect x="3.5" y="7" width="5" height="10" rx="1" fill="#2d5a4a"/><rect x="3" y="17" width="2.5" height="6" fill="#1a3028"/><rect x="7" y="17" width="2.5" height="6" fill="#1a3028"/></g>' +
      '<rect x="0" y="265" width="800" height="15" fill="#081510"/>' +
      "</svg></div>"
    );
  }

  function pageHtml() {
    return (
      '<div class="amana-dw" id="amana-desk-welcome-root">' +
      '<p class="dw-bism">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>' +
      '<h1 class="dw-title">Amānah Campus Desk</h1>' +
      '<p class="dw-sub">Welcome. Deposit a nightly note or stamp a dayn on this device — no unlock needed. Open the vault only when you need the deeper chambers.</p>' +
      campusSvg() +
      '<div class="dw-section-label">Nightly intake <span>no unlock</span></div>' +
      '<div class="amana-desk-windows">' +
      '<section class="desk-window" id="desk-win-notes">' +
      '<span class="win-tag">Window 1 · ATM Notes</span>' +
      "<h2>Deposit a note</h2>" +
      '<p class="hint">Stamped slip for the intake tray. Transfer into Notes after unlock if you wish.</p>' +
      '<label>Title (optional)<input type="text" id="desk-note-title" placeholder="Reminder · intention · contact" maxlength="120"/></label>' +
      '<label>Note<textarea id="desk-note-body" placeholder="Write privately on this device…"></textarea></label>' +
      '<div class="actions"><button type="button" id="desk-note-submit">Deposit note</button>' +
      '<button type="button" class="soft" id="desk-note-clear">Clear</button></div>' +
      '<div class="desk-receipt" id="desk-note-receipt"></div>' +
      '<p class="desk-msg" id="desk-note-msg" role="status"></p></section>' +
      '<section class="desk-window" id="desk-win-dayn">' +
      '<span class="win-tag">Window 2 · Dayn Express</span>' +
      "<h2>Record a dayn</h2>" +
      '<p class="hint">Quick debt entry. Merges to the Dayn ledger when you transfer after unlock.</p>' +
      '<label>What / to whom<input type="text" id="desk-dayn-who" placeholder="Person or description" maxlength="160"/></label>' +
      '<label>Amount (optional)<input type="text" id="desk-dayn-amount" placeholder="e.g. 500" inputmode="decimal"/></label>' +
      '<label>Currency<select id="desk-dayn-currency"><option value="">—</option><option>CAD</option><option>USD</option><option>PKR</option><option>GBP</option><option>EUR</option><option>Other</option></select></label>' +
      '<label>Note<textarea id="desk-dayn-note" placeholder="Due date, context…" rows="2"></textarea></label>' +
      '<div class="actions"><button type="button" id="desk-dayn-submit">Stamp dayn entry</button>' +
      '<button type="button" class="soft" id="desk-dayn-clear">Clear</button></div>' +
      '<div class="desk-receipt" id="desk-dayn-receipt"></div>' +
      '<p class="desk-msg" id="desk-dayn-msg" role="status"></p></section>' +
      "</div>" +
      '<section class="desk-log" id="desk-log">' +
      "<h2>📋 Intake log · stamped on this device</h2>" +
      '<p class="hint" style="font-size:0.76rem;opacity:0.88;margin:0 0 0.4rem">Newest first · private · not uploaded</p>' +
      '<div class="desk-log-list" id="desk-log-list"></div>' +
      '<div class="actions" style="margin-top:0.45rem;display:flex;flex-wrap:wrap;gap:0.35rem">' +
      '<button type="button" class="soft" id="desk-log-refresh">Refresh</button>' +
      '<button type="button" class="soft" id="desk-log-export">Export log JSON</button>' +
      '<button type="button" class="soft" id="desk-transfer" hidden>Transfer intake → vault</button>' +
      "</div></section>" +
      '<section class="dw-unlock-cta" id="desk-unlock-lane">' +
      "<h2>Need the full vault?</h2>" +
      "<p>Family tree, Farāʾiḍ study, Wasiyyah, full Dayn ledger, and Notes open after unlock.</p>" +
      '<div class="cta-row">' +
      '<button type="button" id="desk-scroll-unlock">Unlock vault · login</button>' +
      '<a class="soft" href="#amana-vault-gate">Jump to gate</a>' +
      "</div></section>" +
      '<section class="desk-interior" id="desk-interior">' +
      "<h2 style=\"margin:0 0 0.25rem;font-family:Cormorant Garamond,Georgia,serif;color:#e8d5a3\">Interior · chambers open</h2>" +
      '<p style="font-size:0.82rem;opacity:0.9;margin:0">Vault unlocked this session. Choose your business:</p>' +
      '<div class="desk-biz-grid">' +
      '<a class="desk-biz-card" href="/amana/tree/"><strong>🌳 Family tree</strong><span>Registry · pedigree</span></a>' +
      '<a class="desk-biz-card" href="/amana/fiqh/"><strong>⚖️ Farāʾiḍ study</strong><span>Educational calculator</span></a>' +
      '<a class="desk-biz-card" href="/amana/wasiyyah/"><strong>📜 Wasiyyah</strong><span>Bequest notes</span></a>' +
      '<a class="desk-biz-card" href="/amana/dayn/"><strong>📒 Dayn ledger</strong><span>Full register</span></a>' +
      '<a class="desk-biz-card" href="/amana/notes/"><strong>📝 Notes</strong><span>Private pages</span></a>' +
      '<a class="desk-biz-card" href="/amana/heirs/"><strong>📋 Heir readiness</strong><span>Next of kin</span></a>' +
      "</div>" +
      '<p class="desk-msg" id="desk-interior-msg" style="margin-top:0.5rem"></p>' +
      "</section>" +
      '<p class="dw-disc">Educational companion only · not a fatwa · not a bank · not legal advice. Data stays on this device unless you export it.</p>' +
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
      "</div><div>Stamped: " +
      escapeHtml(formatStamp(entry.stampedAt)) +
      "</div><div>" +
      escapeHtml(entry.type === "dayn" ? "Dayn express" : "ATM note") +
      " held in intake tray.</div>";
  }

  function renderLog() {
    var box = document.getElementById("desk-log-list");
    if (!box) return;
    var log = loadLog();
    if (!log.length) {
      box.innerHTML = '<p style="opacity:0.8;padding:0.3rem">No intake yet. Deposit a note or stamp a dayn above.</p>';
      return;
    }
    box.innerHTML = log
      .slice(0, 40)
      .map(function (e) {
        var body =
          e.type === "dayn"
            ? escapeHtml(e.who || "") +
              (e.amount ? " · " + escapeHtml(e.amount) + " " + escapeHtml(e.currency || "") : "") +
              (e.body ? " — " + escapeHtml(e.body) : "")
            : e.title
              ? "<strong>" + escapeHtml(e.title) + "</strong> — " + escapeHtml(e.body || "")
              : escapeHtml(e.body || "");
        return (
          '<div class="desk-log-item"><span class="stamp">' +
          escapeHtml(formatStamp(e.stampedAt)) +
          '</span><span class="kind">' +
          escapeHtml(e.type) +
          " · " +
          escapeHtml(e.ticket) +
          '</span><div class="body">' +
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
    var entry = { id: "n_" + Date.now().toString(36), ticket: ticketId(), type: "note", title: title, body: body, stampedAt: stampNow() };
    pushEntry(entry);
    showReceipt(document.getElementById("desk-note-receipt"), entry);
    if (msg) {
      msg.textContent = "Deposited · " + entry.ticket;
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
      msg.textContent = "Dayn stamped · " + entry.ticket;
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
    try {
      var notes = JSON.parse(localStorage.getItem(NOTES_KEY) || "{}") || {};
      var pages = Array.isArray(notes.pages) ? notes.pages : Array.isArray(notes.items) ? notes.items : [];
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
    try {
      var ledger = JSON.parse(localStorage.getItem(DAYN_LEDGER_KEY) || '{"lines":[]}');
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
      im.textContent = "Transferred: " + notesMoved + " note(s), " + daynMoved + " dayn · educational only";
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
        ["desk-note-title", "desk-note-body"].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.value = "";
        });
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
        }
      };
  }

  function mount() {
    if (!isHome()) return;
    document.documentElement.classList.add("amana-desk-mode");
    // Prefer single root — remove older desk-only root if present to avoid double UI
    var old = document.getElementById("amana-desk-root");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    if (document.getElementById("amana-desk-welcome-root")) {
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
    wrap.innerHTML = pageHtml();
    var node = wrap.firstChild;
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
        console.warn("[Desk+Welcome]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(syncInterior, 900);
  setTimeout(syncInterior, 2000);
  document.addEventListener("clarity-amana-unlock-change", function () {
    setTimeout(syncInterior, 50);
  });
  var ticks = 0;
  var iv = setInterval(function () {
    ticks++;
    syncInterior();
    if (ticks > 40) clearInterval(iv);
  }, 1500);
})(window);
