/* Phase C — Bāb al-Qubūl (HK2: name first, calm layers) */
(function (g) {
  "use strict";
  if (g.__CU_BAB_QUBUL_V1__) return;
  g.__CU_BAB_QUBUL_V1__ = true;

  var KEY = "cu_bab_qubul_v1";
  var KEY_DONE = "cu_bab_qubul_done_v1";
  var NAME_KEY = "clarity_learner_name_v1";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function save(o) {
    try {
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch (e) {}
  }
  function done() {
    try {
      return localStorage.getItem(KEY_DONE) === "1";
    } catch (e) {
      return false;
    }
  }
  function setDone() {
    try {
      localStorage.setItem(KEY_DONE, "1");
    } catch (e) {}
  }
  function getName() {
    try {
      return localStorage.getItem(NAME_KEY) || "";
    } catch (e) {
      return "";
    }
  }
  function setName(n) {
    try {
      localStorage.setItem(NAME_KEY, (n || "").trim().slice(0, 40));
    } catch (e) {}
  }

  var state = { step: 0, data: load() };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function injectCss() {
    if (document.getElementById("cu-bab-css")) return;
    var s = document.createElement("style");
    s.id = "cu-bab-css";
    s.textContent =
      "#cu-bab-qubul{position:fixed;inset:0;z-index:130000;display:flex;align-items:center;justify-content:center;" +
      "padding:.75rem;background:rgba(4,10,8,.9);box-sizing:border-box}" +
      "#cu-bab-qubul .bab-card{max-width:24rem;width:100%;max-height:90vh;overflow:auto;padding:1.15rem 1.2rem;" +
      "border-radius:18px;border:1px solid rgba(224,197,106,.45);background:linear-gradient(165deg,#122018,#0a1210);" +
      "color:#eaf3ee;box-shadow:0 20px 50px rgba(0,0,0,.55)}" +
      "#cu-bab-qubul .bab-kicker{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:#7dcea0;font-weight:700}" +
      "#cu-bab-qubul h2{margin:.25rem 0 .5rem;font-size:1.2rem;color:#f3e6c0;font-weight:800}" +
      "#cu-bab-qubul p{font-size:.84rem;line-height:1.5;color:rgba(234,243,238,.82);margin:.4rem 0}" +
      "#cu-bab-qubul textarea,#cu-bab-qubul input[type=text]{width:100%;box-sizing:border-box;margin:.4rem 0;padding:.55rem .65rem;" +
      "border-radius:10px;border:1px solid rgba(224,197,106,.3);background:rgba(0,0,0,.35);color:#f3e6c0;font:inherit;font-size:.84rem}" +
      "#cu-bab-qubul .bab-opts{display:flex;flex-direction:column;gap:.4rem;margin:.6rem 0}" +
      "#cu-bab-qubul .bab-opts button{text-align:left;font:inherit;font-size:.82rem;padding:.55rem .7rem;border-radius:12px;" +
      "border:1px solid rgba(224,197,106,.28);background:rgba(0,0,0,.3);color:#f3e6c0;cursor:pointer}" +
      "#cu-bab-qubul .bab-actions{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem}" +
      "#cu-bab-qubul .bab-actions button{font:inherit;font-size:.8rem;font-weight:700;min-height:44px;padding:.4rem .85rem;" +
      "border-radius:999px;border:1px solid rgba(224,197,106,.35);cursor:pointer}" +
      "#cu-bab-qubul .bab-primary{background:linear-gradient(135deg,#1fa67a,#0f4c3a);color:#f7f3eb}" +
      "#cu-bab-qubul .bab-ghost{background:transparent;color:#f3e6c0}" +
      "#cu-bab-qubul .bab-seal{text-align:center;margin:1rem 0;padding:1rem;border-radius:14px;border:1px dashed rgba(224,197,106,.5);" +
      "background:rgba(224,197,106,.08)}#cu-bab-qubul .bab-seal strong{display:block;color:#e0c56a;font-size:1.05rem;margin:0 0 .5rem;line-height:1.35}#cu-bab-qubul .bab-seal .bab-name{display:block;font-size:1.15rem;font-weight:700;color:#f3e6c0;margin:.15rem 0 .35rem}#cu-bab-qubul .bab-seal .bab-meta{display:block;font-size:.75rem;opacity:.8;margin:.15rem 0}#cu-bab-qubul .bab-card{max-width:min(26rem,94vw)}" +
      "#cu-bab-entry{display:inline-flex;align-items:center;justify-content:center;margin:.45rem 0 .65rem;" +
      "font:inherit;font-size:.75rem;font-weight:700;padding:.4rem .95rem;border-radius:999px;" +
      "border:1px solid rgba(224,197,106,.4);background:rgba(15,76,58,.45);color:#f3e6c0;cursor:pointer;" +
      "max-width:100%;white-space:nowrap}" +
      "#cu-bab-entry:hover{border-color:#e0c56a;background:rgba(31,166,122,.35)}" +
      ".cu-bab-entry-wrap{text-align:center;margin:0.25rem 0 0.5rem}";
    document.head.appendChild(s);
  }

  function close() {
    var n = document.getElementById("cu-bab-qubul");
    if (n) n.remove();
    document.body.classList.remove("cu-modal-open");
    /* prevent stacked ghosts */
    document.querySelectorAll("#cu-bab-qubul").forEach(function (x) {
      x.remove();
    });
  }

  function render() {
    injectCss();
    close(); /* single instance */
    var root = el("div", "");
    root.id = "cu-bab-qubul";
    document.body.appendChild(root);
    document.body.classList.add("cu-modal-open");

    var d = state.data;
    var step = state.step;
    var card = el("div", "bab-card");
    var existingName = getName() || d.name || "";

    if (step === 0) {
      card.innerHTML =
        '<div class="bab-kicker">Bāb al-Qubūl · Gate of admission</div>' +
        "<h2>Welcome, seeker</h2>" +
        "<p>On-device enrollment only — not a real university application, not Al-Azhar, not a degree.</p>" +
        "<p>First we take your name, then intention, gentle questions, and a guide’s greeting.</p>" +
        '<div class="bab-actions">' +
        '<button type="button" class="bab-primary" id="bab-start">Begin with Bismillāh</button>' +
        '<button type="button" class="bab-ghost" id="bab-skip">Skip to desk</button></div>';
    } else if (step === 1) {
      /* NAME FIRST */
      card.innerHTML =
        '<div class="bab-kicker">Step 1 · Your name</div>' +
        "<h2>How shall we address you?</h2>" +
        "<p>A first name or preferred name is enough. Stored only on this device.</p>" +
        '<input type="text" id="bab-name" maxlength="40" placeholder="e.g. Momin" value="' +
        String(existingName).replace(/"/g, "") +
        '" />' +
        '<div class="bab-actions"><button type="button" class="bab-primary" id="bab-next">Continue</button></div>';
    } else if (step === 2) {
      card.innerHTML =
        '<div class="bab-kicker">Step 2 · Intention</div>' +
        "<h2>Why do you seek knowledge?</h2>" +
        "<p>Short intention for Allah’s sake. Private to this device.</p>" +
        '<textarea id="bab-niyyah" rows="3" placeholder="e.g. I seek to know Allah with humility…">' +
        (d.niyyah || "").replace(/</g, "") +
        "</textarea>" +
        '<div class="bab-actions"><button type="button" class="bab-primary" id="bab-next">Continue</button></div>';
    } else if (step === 3) {
      card.innerHTML =
        '<div class="bab-kicker">Step 3 · Placement (gentle)</div>' +
        "<h2>Who alone deserves worship?</h2>" +
        '<div class="bab-opts">' +
        '<button type="button" data-a="1">Allah alone — with no partner</button>' +
        '<button type="button" data-a="0">Any path is the same</button>' +
        '<button type="button" data-a="0">I prefer not to say</button></div>' +
        "<p style=\"font-size:.75rem;opacity:.7\">Educational check only — not a fatwa.</p>";
    } else if (step === 4) {
      card.innerHTML =
        '<div class="bab-kicker">Step 4 · Adab of knowledge</div>' +
        "<h2>A classmate mispronounces an āyah. What do you do?</h2>" +
        '<div class="bab-opts">' +
        '<button type="button" data-a="1">Correct gently in private, with kindness</button>' +
        '<button type="button" data-a="0">Laugh so others notice</button>' +
        '<button type="button" data-a="1">Stay silent if it would embarrass them; help later with adab</button></div>';
    } else if (step === 5) {
      var nm = getName() || "Seeker";
      card.innerHTML =
        '<div class="bab-kicker">Step 5 · Meeting the guide</div>' +
        "<h2>Shaykh Nur al-Yaqeen</h2>" +
        "<p><em>Educational persona only — not a living scholar.</em></p>" +
        "<p>As-salāmu ʿalaykum, <strong>" +
        nm.replace(/</g, "") +
        "</strong>. We open with Allah — One, without partner. Carry intention, patience, and a tongue slower to mock than to learn.</p>" +
        "<p>Ready to sit at the Seeker desk, one module at a time?</p>" +
        '<div class="bab-actions">' +
        '<button type="button" class="bab-primary" id="bab-ready">I am ready, with Allah’s help</button></div>';
    } else if (step === 6) {
      var name = getName() || d.name || "Seeker";
      var when = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
      card.innerHTML =
        '<div class="bab-kicker">Letter of admission</div>' +
        "<h2>Accepted — as a Seeker</h2>" +
        '<div class="bab-seal">' +
        "<strong>Kulliyyat al-Uṣūl · Foundations</strong>" +
        '<span class="bab-name">' +
        String(name).replace(/</g, "") +
        "</span>" +
        '<span class="bab-meta">' +
        when +
        "</span>" +
        '<span class="bab-meta">On-device seal · not a diploma</span></div>' +
        "<p>Your path opens at <strong>Junior · Module 1</strong>. One lesson unlocked. Spark with adab.</p>" +
        "<p style=\"font-size:.75rem;opacity:.7\">Educational only — not affiliated with Al-Azhar or any seminary.</p>" +
        '<div class="bab-actions">' +
        '<button type="button" class="bab-primary" id="bab-desk">Open Seeker desk</button>' +
        '<button type="button" class="bab-ghost" id="bab-close">Close calmly</button></div>';
    }

    root.appendChild(card);

    function go(n) {
      state.step = n;
      render();
    }

    var start = card.querySelector("#bab-start");
    if (start) start.onclick = function () { go(1); };
    var skip = card.querySelector("#bab-skip");
    if (skip)
      skip.onclick = function () {
        setDone();
        close();
        location.href = "/campus/desk/?phase=seeker";
      };
    var next = card.querySelector("#bab-next");
    if (next)
      next.onclick = function () {
        if (step === 1) {
          var nm = ((card.querySelector("#bab-name") || {}).value || "").trim();
          if (!nm) {
            alert("Please enter a name to continue.");
            return;
          }
          setName(nm);
          state.data.name = nm;
          save(state.data);
          go(2);
          return;
        }
        if (step === 2) {
          state.data.niyyah = ((card.querySelector("#bab-niyyah") || {}).value || "").trim().slice(0, 500);
          save(state.data);
          go(3);
        }
      };
    card.querySelectorAll("[data-a]").forEach(function (b) {
      b.onclick = function () {
        if (step === 3) state.data.q1 = b.getAttribute("data-a");
        if (step === 4) state.data.q2 = b.getAttribute("data-a");
        save(state.data);
        go(step + 1);
      };
    });
    var ready = card.querySelector("#bab-ready");
    if (ready)
      ready.onclick = function () {
        setDone();
        go(6);
      };
    var desk = card.querySelector("#bab-desk");
    if (desk)
      desk.onclick = function () {
        close();
        /* single navigation — no competing reloads */
        location.href = "/campus/desk/?phase=seeker";
      };
    var cl = card.querySelector("#bab-close");
    if (cl)
      cl.onclick = function () {
        close();
        syncEntryLabel();
      };
  }

  function open() {
    state.data = load();
    state.step = done() ? 6 : 0;
    render();
  }

  function syncEntryLabel() {
    var b = document.getElementById("cu-bab-entry");
    if (b) b.textContent = done() ? "View admission letter" : "Bāb al-Qubūl · Enrollment";
  }

  function entryButton() {
    if (document.getElementById("cu-bab-entry")) {
      syncEntryLabel();
      return;
    }
    var host =
      document.querySelector(".cu-continue") ||
      document.querySelector(".cu-wrap") ||
      document.querySelector("main");
    if (!host) return;
    var wrap = document.createElement("div");
    wrap.className = "cu-bab-entry-wrap";
    var b = document.createElement("button");
    b.type = "button";
    b.id = "cu-bab-entry";
    b.textContent = done() ? "View admission letter" : "Bāb al-Qubūl · Enrollment";
    b.onclick = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      open();
    };
    wrap.appendChild(b);
    if (host.classList && host.classList.contains("cu-continue") && host.parentNode) {
      host.parentNode.insertBefore(wrap, host.nextSibling);
    } else {
      host.insertBefore(wrap, host.firstChild);
    }
  }

  function boot() {
    var p = location.pathname || "";
    if (
      p.indexOf("/campus") !== 0 &&
      p.indexOf("/lab") !== 0 &&
      p.indexOf("/journey") !== 0
    )
      return;
    entryButton();
    if (p.replace(/\/$/, "") === "/campus" && !done()) {
      try {
        if (!sessionStorage.getItem("cu_bab_prompted")) {
          sessionStorage.setItem("cu_bab_prompted", "1");
          setTimeout(open, 500);
        }
      } catch (e) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityBabQubul = {
    open: open,
    reset: function () {
      try {
        localStorage.removeItem(KEY_DONE);
        localStorage.removeItem(KEY);
      } catch (e) {}
    }
  };
})(typeof window !== "undefined" ? window : this);
