/* Clarity University — Secured Craft Laboratory
 * Stations: calligraphy, tajweed, media, research, module design.
 * Educational only — not a calligraphy ijazah or design degree.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_LAB_WING__) return;
  g.__CLARITY_LAB_WING__ = true;

  var BASE = "./assets/curriculum/vault/admin/lab/";
  var PORT_KEY = "clarity_lab_portfolio_v1";
  var ACTIVE_KEY = "clarity_lab_active_v1";
  var DESIGN_KEY = "clarity_lab_design_drafts_v1";
  var manifest = null;
  var labModules = null;

  function lsGet(k, fb) {
    try {
      var v = localStorage.getItem(k);
      if (v == null) return fb;
      return JSON.parse(v);
    } catch (e) {
      return fb;
    }
  }
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
  function fetchJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }
  function escape(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function portfolio() {
    return lsGet(PORT_KEY, { projects: [] }) || { projects: [] };
  }
  function savePortfolio(p) {
    lsSet(PORT_KEY, p);
  }
  function director() {
    return (manifest && manifest.director) || null;
  }
  function openCard(id) {
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) {
      toast("Card not on this screen — open the Reality door tab.");
      return;
    }
    try {
      el.classList.remove("gate-hidden", "hidden");
      el.hidden = false;
      el.style.removeProperty("display");
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {}
  }
  function toast(msg) {
    var d = director();
    var el = document.getElementById("clarity-lab-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "clarity-lab-toast";
      el.className = "clarity-lab-toast";
      document.body.appendChild(el);
    }
    el.innerHTML =
      (d ? '<span class="clt-name">' + escape(d.name) + "</span> " : "") + escape(msg);
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 4000);
  }
  function ensureShell() {
    if (document.getElementById("clarity-lab-shell")) return document.getElementById("clarity-lab-shell");
    var shell = document.createElement("section");
    shell.id = "clarity-lab-shell";
    shell.className = "clarity-lab-shell card";
    shell.innerHTML =
      '<div class="clab-head"><div class="clab-badge">LAB</div><div>' +
      '<h2 class="clab-title">Craft Laboratory</h2>' +
      '<p class="clab-sub" id="clab-sub">Secured facility · beauty with truth</p></div>' +
      '<button type="button" class="clab-dir-btn" id="clab-dir-btn">Director</button></div>' +
      '<div class="clab-stations" id="clab-stations"></div>' +
      '<div class="clab-workbench" id="clab-workbench"><p class="clab-empty">Select a station to open the workbench.</p></div>' +
      '<div class="clab-portfolio" id="clab-portfolio"></div>';
    var host =
      document.querySelector("#tab-reality .rrra-hub-body") ||
      document.getElementById("tab-reality") ||
      document.getElementById("main-application-workspace") ||
      document.body;
    try {
      host.insertBefore(shell, host.firstChild);
    } catch (e) {
      host.appendChild(shell);
    }
    document.getElementById("clab-dir-btn").onclick = function () {
      var d = director();
      if (!d) return;
      alert(
        d.name + "\n" + d.title + "\nSeal: " + d.seal + "\n\n" + d.greeting + "\n\n" +
        ((manifest && manifest.disclaimer) || "")
      );
    };
    return shell;
  }
  function renderStations() {
    ensureShell();
    var d = director();
    var sub = document.getElementById("clab-sub");
    if (sub && d) sub.textContent = d.name + " · " + ((manifest && manifest.motto) || "");
    var host = document.getElementById("clab-stations");
    if (!host || !manifest) return;
    host.innerHTML = (manifest.stations || [])
      .map(function (s) {
        return (
          '<button type="button" class="clab-station" data-station="' + escape(s.id) + '">' +
          '<span class="clab-ico">' + (s.icon || "•") + "</span>" +
          '<span class="clab-st-name">' + escape(s.name) + "</span>" +
          "<small>" + escape(s.craft) + "</small></button>"
        );
      })
      .join("");
    host.onclick = function (ev) {
      var btn = ev.target.closest && ev.target.closest("[data-station]");
      if (btn) openStation(btn.getAttribute("data-station"));
    };
    renderPortfolio();
  }
  function projectsFor(stationId) {
    if (!labModules || !labModules.projects) return [];
    return labModules.projects.filter(function (p) {
      return p.station === stationId;
    });
  }
  function openStation(stationId) {
    var st = null;
    (manifest.stations || []).forEach(function (s) {
      if (s.id === stationId) st = s;
    });
    if (!st) return;
    lsSet(ACTIVE_KEY, { station: stationId, at: Date.now() });
    var wb = document.getElementById("clab-workbench");
    var projs = projectsFor(stationId);
    var html =
      '<div class="clab-wb-head"><h3>' + (st.icon || "") + " " + escape(st.name) + "</h3>" +
      "<p>" + escape(st.craft) + "</p>" +
      (st.card
        ? '<button type="button" class="cdm-btn" data-open-card="' + escape(st.card) + '">Open linked tool card</button>'
        : "") +
      "</div><div class=\"clab-projects\">";
    projs.forEach(function (p) {
      var done = isDone(p.id);
      html +=
        '<article class="clab-proj' + (done ? " is-done" : "") + '">' +
        "<h4>" + (done ? "✓ " : "") + escape(p.title) + " <small>" + p.minutes + " min</small></h4>" +
        '<p class="clab-goal">' + escape(p.goal) + "</p><ol>" +
        (p.steps || []).map(function (s) { return "<li>" + escape(s) + "</li>"; }).join("") +
        "</ol>" +
        (done
          ? '<span class="clab-done">Logged in portfolio</span>'
          : '<button type="button" class="clab-complete" data-complete="' + escape(p.id) + '">Complete & log</button>') +
        "</article>";
    });
    if (stationId === "design") {
      html +=
        '<div class="clab-design-form"><h4>🧪 New module draft</h4>' +
        '<label>Title <input id="clab-d-title" maxlength="80"/></label>' +
        '<label>Goal <input id="clab-d-goal" maxlength="160"/></label>' +
        '<label>Steps (one per line) <textarea id="clab-d-steps" rows="4"></textarea></label>' +
        '<label>Source URL <input id="clab-d-url" maxlength="200"/></label>' +
        '<button type="button" class="cdm-btn" id="clab-d-save">Submit draft to librarian shelves</button></div>';
    }
    html += "</div>";
    wb.innerHTML = html;
    wb.onclick = function (ev) {
      var t = ev.target;
      if (t.getAttribute && t.getAttribute("data-open-card")) {
        openCard(t.getAttribute("data-open-card"));
        toast("Tool card opened.");
        return;
      }
      var cid = t.getAttribute && t.getAttribute("data-complete");
      if (cid) completeProject(cid);
    };
    var save = document.getElementById("clab-d-save");
    if (save) save.onclick = submitDesignDraft;
    setTimeout(function () {
      toast(st.name + " ready." + (st.skills ? " Skills: " + st.skills.join(", ") : ""));
    }, 300);
  }
  function isDone(pid) {
    return (portfolio().projects || []).some(function (x) {
      return x.id === pid && x.done;
    });
  }
  function labSeal(pid) {
    var n = (pid || "") + "|" + Date.now();
    var h = 0;
    for (var i = 0; i < n.length; i++) h = (h * 33 + n.charCodeAt(i)) >>> 0;
    return "LAB-" + ("0000" + (h % 65536).toString(16)).slice(-4).toUpperCase();
  }
  function completeProject(pid) {
    var proj = null;
    (labModules.projects || []).forEach(function (p) {
      if (p.id === pid) proj = p;
    });
    if (!proj) return;
    var note = prompt("Lab log — brief note of what you practiced:", "");
    if (note == null) return;
    var port = portfolio();
    port.projects = port.projects || [];
    port.projects.push({
      id: pid,
      station: proj.station,
      title: proj.title,
      done: true,
      at: Date.now(),
      note: String(note).slice(0, 280),
      seal: labSeal(pid)
    });
    savePortfolio(port);
    if (g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.backupCurriculum) {
      try {
        g.ClarityStaffLibrarian.backupCurriculum();
      } catch (e) {}
    }
    toast("Project sealed · " + labSeal(pid));
    var active = lsGet(ACTIVE_KEY, {});
    if (active && active.station) openStation(active.station);
    renderPortfolio();
  }
  function submitDesignDraft() {
    var title = ((document.getElementById("clab-d-title") || {}).value || "").trim();
    var goal = ((document.getElementById("clab-d-goal") || {}).value || "").trim();
    var steps = (document.getElementById("clab-d-steps") || {}).value || "";
    var url = (document.getElementById("clab-d-url") || {}).value || "";
    if (!title || !goal) {
      alert("Title and goal are required.");
      return;
    }
    var draft = {
      id: "design-" + Date.now(),
      at: Date.now(),
      title: title.slice(0, 80),
      goal: goal.slice(0, 160),
      steps: String(steps).split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 8),
      url: String(url).slice(0, 200),
      safety: "Educational only — not a fatwa. Verify rulings with a qualified teacher.",
      status: "draft-for-librarian"
    };
    var drafts = lsGet(DESIGN_KEY, []);
    drafts.push(draft);
    if (drafts.length > 30) drafts = drafts.slice(-30);
    lsSet(DESIGN_KEY, drafts);
    try {
      var stacks = JSON.parse(localStorage.getItem("clarity_librarian_stacks_v1") || "{}") || {};
      stacks.labDesigns = stacks.labDesigns || [];
      stacks.labDesigns.push(draft);
      stacks.updated = Date.now();
      localStorage.setItem("clarity_librarian_stacks_v1", JSON.stringify(stacks));
    } catch (e) {}
    if (g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.gather) {
      try {
        g.ClarityStaffLibrarian.gather();
      } catch (e2) {}
    }
    toast("Draft filed for librarian — foundation not modified.");
    ["clab-d-title", "clab-d-goal", "clab-d-steps", "clab-d-url"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
  }
  function renderPortfolio() {
    var el = document.getElementById("clab-portfolio");
    if (!el) return;
    var items = (portfolio().projects || []).slice(-8).reverse();
    if (!items.length) {
      el.innerHTML = '<p class="clab-port-empty">Portfolio empty — complete a lab project to seal an entry.</p>';
      return;
    }
    el.innerHTML =
      "<h4>Lab portfolio</h4><ul class=\"clab-port-list\">" +
      items
        .map(function (x) {
          return (
            "<li><b>" + escape(x.title) + "</b> · <code>" + escape(x.seal) + "</code><br/><small>" +
            escape(x.note || "") + "</small></li>"
          );
        })
        .join("") +
      "</ul>";
  }
  function injectDoor() {
    if (document.getElementById("cnp-lab-btn")) return;
    var host =
      document.querySelector(".cnp-inner") || document.getElementById("clarity-name-plaque-rail");
    if (!host) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "cnp-lab-btn";
    btn.className = "cnp-hall-btn cnp-lab-btn";
    btn.textContent = "Lab";
    btn.title = "Craft laboratory";
    btn.onclick = function () {
      var shell = document.getElementById("clarity-lab-shell");
      if (shell) {
        shell.scrollIntoView({ behavior: "smooth", block: "start" });
        shell.classList.add("clab-pulse");
        setTimeout(function () {
          shell.classList.remove("clab-pulse");
        }, 800);
      }
      if (g.clarityOpenSectionDoor) {
        try {
          g.clarityOpenSectionDoor("reality");
        } catch (e) {}
      }
      toast((director() && director().greeting) || "Lab open");
    };
    host.appendChild(btn);
  }
  g.ClarityLab = {
    openStation: openStation,
    portfolio: portfolio,
    director: director,
    render: renderStations
  };
  function boot() {
    Promise.all([fetchJSON(BASE + "lab-manifest.json"), fetchJSON(BASE + "lab-modules.json")])
      .then(function (arr) {
        manifest = arr[0];
        labModules = arr[1];
        renderStations();
        injectDoor();
        try {
          console.info("%c Lab Facility ", "background:#0a3040;color:#a8e6ff", "Stations online");
        } catch (e) {}
      })
      .catch(function () {
        try {
          console.warn("Lab facility unavailable");
        } catch (e2) {}
      });
  }
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 500);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 2200);
    });
  } else setTimeout(boot, 2200);
})(typeof window !== "undefined" ? window : this);
