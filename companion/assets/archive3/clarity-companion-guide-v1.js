/**
 * clarity-companion-guide-v1.js — C0–C10 Companion orientation & daily tools
 * Companion only. Keys: clarity_* only. Never University campus keys.
 * Educational only — not a fatwa. Not a court document.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_COMPANION_GUIDE_V1__) return;
  g.__CLARITY_COMPANION_GUIDE_V1__ = true;

  var KEY_PATH = "clarity_companion_path_interest_v1";
  var KEY_ORIENT_DONE = "clarity_companion_orient_done_v1";
  var KEY_HALL_TIPS = "clarity_companion_hall_tips_v1";
  var KEY_DAILY_NOTE = "clarity_amana_daily_notes_v1";
  var KEY_CONTINUE = "clarity_continue_v1";
  var KEY_LAST_TOOL = "clarity_companion_last_tool_v1";

  var PATHS = [
    {
      id: "curious",
      title: "Curious about Islam",
      blurb: "Purpose, prophecy, Qur’an, next life — steady exploration.",
      chips: [
        { label: "Today", sel: "[data-door='today'], #door-today, a[href='#today']", href: "#today" },
        { label: "Learn path", sel: "[data-door='learn'], #door-learn", href: "#learn" },
        { label: "Seerah / tracks", sel: null, href: "#learn" }
      ]
    },
    {
      id: "new",
      title: "New Muslim",
      blurb: "Prayer, purification, character — one step at a time.",
      chips: [
        { label: "Today", href: "#today" },
        { label: "Learn · foundations", href: "#learn" },
        { label: "Tajweed 5 min", href: "#tajweed", tool: "tajweed" }
      ]
    },
    {
      id: "daily",
      title: "Daily consistency",
      blurb: "Ṣalāh awareness, one deed, short practice.",
      chips: [
        { label: "Today", href: "#today" },
        { label: "Tajweed", href: "#tajweed", tool: "tajweed" },
        { label: "Calligraphy", href: "#calligraphy", tool: "calligraphy" }
      ]
    },
    {
      id: "legacy",
      title: "Family & legacy",
      blurb: "Wasiyyah tools, print pack, Amanah vault — intention aids only.",
      chips: [
        { label: "Prepare", href: "#prepare" },
        { label: "Amanah vault", href: "#vault", tool: "vault" },
        { label: "Legacy pack", href: "#legacy", tool: "legacy" }
      ]
    },
    {
      id: "creative",
      title: "Creative reminder",
      blurb: "Ayah cards & craft — beauty without inventing meanings.",
      chips: [
        { label: "Meme studio", href: "#meme", tool: "meme" },
        { label: "Calligraphy", href: "#calligraphy", tool: "calligraphy" },
        { label: "Today", href: "#today" }
      ]
    }
  ];

  function lsGet(k, fb) {
    try {
      var v = localStorage.getItem(k);
      return v == null ? fb : JSON.parse(v);
    } catch (e) {
      return fb;
    }
  }
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function emit(type, detail) {
    try {
      document.dispatchEvent(
        new CustomEvent("clarity-companion-event", { detail: Object.assign({ type: type }, detail || {}) })
      );
    } catch (e) {}
  }
  /** Refuse to touch University keys */
  function assertCompanionOnly() {
    /* no-op guard documented; we never write university keys */
  }

  function goHref(href, tool) {
    if (tool) lsSet(KEY_LAST_TOOL, { tool: tool, at: Date.now() });
    if (!href) return;
    if (href.charAt(0) === "#") {
      var id = href.slice(1);
      var el =
        document.getElementById(id) ||
        document.querySelector('[data-section="' + id + '"]') ||
        document.querySelector('[data-door="' + id + '"]') ||
        document.querySelector('a[href="' + href + '"]');
      if (el) {
        try {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          if (el.click && (el.tagName === "A" || el.tagName === "BUTTON" || el.getAttribute("data-door"))) {
            try {
              el.click();
            } catch (e) {}
          }
        } catch (e) {}
        return;
      }
      /* try open vault pack button */
      if (id === "vault") {
        var v =
          document.querySelector("[data-amana-open], #amana-open, .amana-vault-entry, [href*='vault']") ||
          document.getElementById("amana-gate");
        if (v) {
          try {
            v.scrollIntoView({ behavior: "smooth" });
            v.click();
          } catch (e) {}
          return;
        }
      }
      location.hash = href;
      return;
    }
    location.href = href;
  }

  /* ---------- C1 Orient ---------- */
  function showOrient(force) {
    if (!force && lsGet(KEY_ORIENT_DONE, false)) return;
    var existing = document.getElementById("cguide-orient");
    if (existing) {
      existing.hidden = false;
      return;
    }
    var wrap = document.createElement("div");
    wrap.id = "cguide-orient";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.innerHTML =
      '<div class="cguide-card">' +
      "<h2>Welcome to your Companion</h2>" +
      '<p class="lead">Private on this device. Pick what you need most — we’ll pin three shortcuts. Not a fatwa site.</p>' +
      '<div class="cguide-paths" id="cguide-path-list"></div>' +
      '<div class="cguide-actions">' +
      '<button type="button" class="ghost" id="cguide-skip">Skip for now</button>' +
      "</div>" +
      '<p class="cguide-foot">Zero accounts · data stays on this device · for personal rulings ask a local scholar.<br/>University campus is a separate structured path when you want it.</p>' +
      "</div>";
    document.body.appendChild(wrap);
    var list = document.getElementById("cguide-path-list");
    PATHS.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.innerHTML = "<strong>" + p.title + "</strong><span>" + p.blurb + "</span>";
      b.addEventListener("click", function () {
        lsSet(KEY_PATH, { id: p.id, at: Date.now(), chips: p.chips });
        lsSet(KEY_ORIENT_DONE, true);
        wrap.hidden = true;
        mountTools();
        mountContinue();
        emit("orient", { id: p.id });
      });
      list.appendChild(b);
    });
    document.getElementById("cguide-skip").onclick = function () {
      lsSet(KEY_ORIENT_DONE, true);
      lsSet(KEY_PATH, { id: "daily", at: Date.now(), chips: PATHS[2].chips, skipped: true });
      wrap.hidden = true;
      mountTools();
      emit("orient", { skipped: true });
    };
  }

  /* ---------- C2 Map ---------- */
  function showMap() {
    var wrap = document.getElementById("cguide-map");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "cguide-map";
      wrap.hidden = true;
      wrap.innerHTML =
        '<div class="cguide-card">' +
        "<h2>Companion map</h2>" +
        '<p class="lead">Four halls on this home surface. Everything is local and educational.</p>' +
        '<div class="cguide-paths">' +
        '<button type="button" data-go="#today"><strong>Today</strong><span>Next prayer context, one deed, path card, streak.</span></button>' +
        '<button type="button" data-go="#learn"><strong>Learn</strong><span>Heart & grave · Seerah · ordered tracks.</span></button>' +
        '<button type="button" data-go="#prepare"><strong>Prepare</strong><span>Legacy path · wasiyyah tools · print pack.</span></button>' +
        '<button type="button" data-go="#vault"><strong>Amanah vault</strong><span>Trusts & notes on device — not a court document.</span></button>' +
        '<button type="button" data-go="#tajweed"><strong>Studios</strong><span>Tajweed · Calligraphy · Meme craft.</span></button>' +
        "</div>" +
        '<div class="cguide-actions">' +
        '<button type="button" id="cguide-map-orient">Change path interest</button>' +
        '<button type="button" class="ghost" id="cguide-map-close">Close</button>' +
        '<a class="cguide-chip ghost" href="/campus/" style="text-decoration:none">University (optional) →</a>' +
        "</div>" +
        '<p class="cguide-foot">Educational only — not a fatwa.</p></div>';
      document.body.appendChild(wrap);
      wrap.querySelectorAll("[data-go]").forEach(function (b) {
        b.addEventListener("click", function () {
          wrap.hidden = true;
          goHref(b.getAttribute("data-go"));
        });
      });
      document.getElementById("cguide-map-close").onclick = function () {
        wrap.hidden = true;
      };
      document.getElementById("cguide-map-orient").onclick = function () {
        wrap.hidden = true;
        localStorage.removeItem(KEY_ORIENT_DONE);
        showOrient(true);
      };
    }
    wrap.hidden = false;
    emit("map", {});
  }

  function mountFab() {
    if (document.getElementById("cguide-fab")) return;
    var fab = document.createElement("button");
    fab.id = "cguide-fab";
    fab.type = "button";
    fab.title = "Companion map";
    fab.setAttribute("aria-label", "Companion map");
    fab.textContent = "Map";
    fab.addEventListener("click", showMap);
    document.body.appendChild(fab);
  }

  /* ---------- C3 Today’s tools ---------- */
  function mountTools() {
    var path = lsGet(KEY_PATH, null);
    var chips =
      (path && path.chips) ||
      PATHS[2].chips;
    var host = document.getElementById("cguide-tools");
    if (!host) {
      host = document.createElement("div");
      host.id = "cguide-tools";
      var anchor =
        document.getElementById("today") ||
        document.querySelector("[data-door='today']") ||
        document.querySelector(".door-today") ||
        document.querySelector("main") ||
        document.body;
      if (anchor && anchor.firstChild) anchor.insertBefore(host, anchor.firstChild);
      else document.body.appendChild(host);
    }
    host.innerHTML = "";
    var label = document.createElement("span");
    label.style.cssText = "width:100%;font-size:.75rem;opacity:.8;margin-bottom:.15rem";
    label.textContent = "Today’s tools · on this device";
    host.appendChild(label);
    chips.forEach(function (c) {
      var a = document.createElement("button");
      a.type = "button";
      a.className = "cguide-chip";
      a.textContent = c.label;
      a.addEventListener("click", function () {
        goHref(c.href, c.tool);
        emit("shortcut", { label: c.label });
      });
      host.appendChild(a);
    });
    /* always expose vault + tajweed + meme as secondary */
    [
      { label: "Vault", href: "#vault", tool: "vault" },
      { label: "Tajweed", href: "#tajweed", tool: "tajweed" },
      { label: "Meme", href: "#meme", tool: "meme" },
      { label: "Calligraphy", href: "#calligraphy", tool: "calligraphy" }
    ].forEach(function (c) {
      var a = document.createElement("button");
      a.type = "button";
      a.className = "cguide-chip secondary";
      a.textContent = c.label;
      a.addEventListener("click", function () {
        goHref(c.href, c.tool);
      });
      host.appendChild(a);
    });
  }

  /* ---------- C5 Continue ---------- */
  function mountContinue() {
    var cont = lsGet(KEY_CONTINUE, null);
    var last = lsGet(KEY_LAST_TOOL, null);
    var host = document.getElementById("cguide-continue");
    if (!host) {
      host = document.createElement("div");
      host.id = "cguide-continue";
      var tools = document.getElementById("cguide-tools");
      if (tools && tools.parentNode) tools.parentNode.insertBefore(host, tools.nextSibling);
      else document.body.appendChild(host);
    }
    var bits = [];
    if (cont && (cont.label || cont.href)) {
      bits.push('Continue: <a href="' + (cont.href || "#") + '">' + (cont.label || "where you left off") + "</a>");
    }
    if (last && last.tool) {
      bits.push("Last tool: <strong>" + last.tool + "</strong>");
    }
    if (!bits.length) {
      host.hidden = true;
      return;
    }
    host.hidden = false;
    host.innerHTML = bits.join(" · ") + ' · <button type="button" class="cguide-chip ghost" id="cguide-reorient" style="margin-left:.25rem">Path guide</button>';
    var b = document.getElementById("cguide-reorient");
    if (b)
      b.onclick = function () {
        localStorage.removeItem(KEY_ORIENT_DONE);
        showOrient(true);
      };
  }

  /* ---------- C4 Hall tips ---------- */
  function maybeHallTip() {
    var tips = lsGet(KEY_HALL_TIPS, {}) || {};
    var day = todayKey();
    function once(key, text) {
      if (tips[key] === day) return;
      tips[key] = day;
      lsSet(KEY_HALL_TIPS, tips);
      var el = document.getElementById("cguide-hall-tip");
      if (!el) {
        el = document.createElement("div");
        el.id = "cguide-hall-tip";
        el.className = "cguide-hall-tip";
        document.body.appendChild(el);
      }
      el.hidden = false;
      el.innerHTML = text + ' <button type="button" class="cguide-chip ghost" id="cguide-tip-x">OK</button>';
      document.getElementById("cguide-tip-x").onclick = function () {
        el.hidden = true;
      };
      setTimeout(function () {
        el.hidden = true;
      }, 8000);
    }
    /* hash-based */
    var h = (location.hash || "").replace("#", "");
    if (h === "learn" || h === "prepare") {
      once(
        h,
        h === "learn"
          ? "<strong>Learn</strong> — ordered tracks for the heart. Take one card at a time."
          : "<strong>Prepare</strong> — legacy tools are intention aids, not court documents."
      );
    }
  }

  /* ---------- C7 Vault daily note near passphrase ---------- */
  function mountVaultDailyNote() {
    var pass =
      document.getElementById("amana-pass-unlock") ||
      document.getElementById("amana-pass-new") ||
      document.querySelector("input[type='password'][id*='amana']");
    if (!pass) return;
    var panel =
      pass.closest(".amana-panel, .amana-gate, .vault-login, [data-amana], #amana-gate, #amana-unlock-panel") ||
      pass.parentElement;
    if (!panel || document.getElementById("cguide-vault-note")) return;
    var box = document.createElement("div");
    box.id = "cguide-vault-note";
    box.innerHTML =
      "<strong>Quick daily note</strong>" +
      '<p class="cguide-foot" style="margin:.25rem 0">Logged on this device for Amanah. Intention aid only — not a court document, not a fatwa.</p>' +
      '<textarea id="cguide-vault-note-ta" maxlength="2000" placeholder="One line for today: a trust, a duʿāʾ, a task…"></textarea>' +
      '<div class="row">' +
      '<button type="button" class="cguide-chip" id="cguide-vault-note-save">Save note</button>' +
      '<span class="cguide-foot" id="cguide-vault-note-status"></span></div>';
    panel.appendChild(box);
    var notes = lsGet(KEY_DAILY_NOTE, []);
    if (!Array.isArray(notes)) notes = [];
    var today = notes.filter(function (n) {
      return n.day === todayKey();
    })[0];
    if (today) document.getElementById("cguide-vault-note-ta").value = today.text || "";
    document.getElementById("cguide-vault-note-save").onclick = function () {
      var text = (document.getElementById("cguide-vault-note-ta").value || "").trim().slice(0, 2000);
      notes = lsGet(KEY_DAILY_NOTE, []);
      if (!Array.isArray(notes)) notes = [];
      notes = notes.filter(function (n) {
        return n.day !== todayKey();
      });
      notes.unshift({ day: todayKey(), text: text, at: Date.now() });
      lsSet(KEY_DAILY_NOTE, notes.slice(0, 60));
      /* stage into prepare-tonight style staging if present */
      try {
        var staging = lsGet("clarity_amana_staging_notes_v1", []) || [];
        if (!Array.isArray(staging)) staging = [];
        staging.unshift({ type: "daily", text: text, at: Date.now() });
        lsSet("clarity_amana_staging_notes_v1", staging.slice(0, 40));
      } catch (e) {}
      document.getElementById("cguide-vault-note-status").textContent = "Saved on this device";
      emit("vault-note", { len: text.length });
    };
  }

  /* ---------- Observe DOM for vault panel open ---------- */
  function watchVault() {
    mountVaultDailyNote();
    try {
      var obs = new MutationObserver(function () {
        mountVaultDailyNote();
      });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }

  function boot() {
    assertCompanionOnly();
    /* Only on companion home — not /campus/ */
    var path = location.pathname || "/";
    if (path.indexOf("/campus") === 0) return; /* university surface: no-op */

    mountFab();
    mountTools();
    mountContinue();
    watchVault();
    window.addEventListener("hashchange", maybeHallTip);
    maybeHallTip();

    if (!lsGet(KEY_ORIENT_DONE, false)) {
      setTimeout(function () {
        showOrient(false);
      }, 600);
    }
    emit("boot", { build: "C10" });
  }

  g.ClarityCompanionGuide = {
    showOrient: function () {
      localStorage.removeItem(KEY_ORIENT_DONE);
      showOrient(true);
    },
    showMap: showMap,
    mountTools: mountTools
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
