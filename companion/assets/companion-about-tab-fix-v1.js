/*! Companion About stick + feedback v8
 * - Exclusive locked door (defineProperty — other scripts cannot re-wrap)
 * - Stick while hash/body is About (gentle, only when wrong)
 * - CSS body[data-active-tab=about] panel lock
 * - Feedback → /api/feedback
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_ABOUT_TAB_FIX_V8__) return;
  w.__CLARITY_COMPANION_ABOUT_TAB_FIX_V8__ = true;

  var FEEDBACK_TO = "feedback@clarity-dawah.fyi";
  var FEEDBACK_API = "/api/feedback";
  var VALID = {
    reminder: "tab-reminder",
    reality: "tab-reality",
    reflection: "tab-reflection",
    action: "tab-action",
    notes: "tab-notes",
    about: "tab-about"
  };
  var stickTimer = null;
  var lastId = "reminder";

  function normalize(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id === "journey" || id === "commands" || id === "seerah") id = "reminder";
    if (id === "tajweed" || id === "callig" || id === "calligraphy" || id === "meme") id = "action";
    if (id === "info" || id === "meta") id = "about";
    if (!VALID[id]) return null;
    return id;
  }

  function desiredTab() {
    var h = normalize((w.location.hash || "").replace(/^#/, ""));
    if (h) return h;
    var b = normalize(d.body && d.body.getAttribute("data-active-tab"));
    if (b) return b;
    return lastId;
  }

  function ensureAboutTopLevel() {
    var about = d.getElementById("tab-about");
    var main = d.querySelector("main.main-content") || d.querySelector("main");
    if (!about) {
      if (!main) return null;
      about = d.createElement("div");
      about.id = "tab-about";
      about.className = "tab-panel companion-about-home";
      about.setAttribute("aria-hidden", "true");
      about.style.display = "none";
      main.appendChild(about);
    }
    var p = about.parentElement;
    while (p && p !== main && p !== d.body) {
      if (p.id && /^tab-/.test(p.id) && p.id !== "tab-about") {
        if (main) main.appendChild(about);
        break;
      }
      p = p.parentElement;
    }
    if (!about.querySelector("#companion-about-enriched-root")) {
      var root = d.createElement("div");
      root.id = "companion-about-enriched-root";
      root.className = "companion-about-enriched-root";
      about.appendChild(root);
    }
    return about;
  }

  function applyPanel(id) {
    id = normalize(id) || "reminder";
    lastId = id;
    var panelId = VALID[id];
    d.querySelectorAll(".tab-panel").forEach(function (panel) {
      var on = panel.id === panelId;
      panel.classList.toggle("is-active", on);
      panel.classList.toggle("active", on);
      panel.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) {
        panel.removeAttribute("hidden");
        panel.style.setProperty("display", "block", "important");
        panel.style.setProperty("visibility", "visible", "important");
        panel.style.setProperty("height", "auto", "important");
        panel.style.setProperty("max-height", "none", "important");
        panel.style.setProperty("overflow", "visible", "important");
        panel.style.setProperty("position", "relative", "important");
        panel.style.setProperty("width", "100%", "important");
      } else {
        panel.style.setProperty("display", "none", "important");
      }
    });
    d.querySelectorAll("#clarity-door-rail [data-rail-tab], #clarity-door-rail [data-rrra]").forEach(function (btn) {
      var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
      btn.classList.toggle("is-active", t === id);
    });
    try {
      d.body.setAttribute("data-active-tab", id);
    } catch (e) {}
    var studio = d.getElementById("tj-deep-studio");
    var action = d.getElementById("tab-action");
    if (studio && action && !action.contains(studio)) action.appendChild(studio);
  }

  function panelLooksWrong(id) {
    var panel = d.getElementById(VALID[id]);
    if (!panel) return true;
    var cs = w.getComputedStyle(panel);
    if (cs.display === "none") return true;
    if (!(panel.classList.contains("is-active") || panel.classList.contains("active"))) return true;
    if (id === "about" && panel.getBoundingClientRect && panel.getBoundingClientRect().height < 8) {
      // still may be ok if content loading — only treat as wrong if another panel is active
    }
    var conflict = false;
    d.querySelectorAll(".tab-panel.is-active, .tab-panel.active").forEach(function (p) {
      if (p.id !== VALID[id]) conflict = true;
    });
    // Reality visible while we want about
    if (id === "about") {
      var reality = d.getElementById("tab-reality");
      if (reality) {
        var rcs = w.getComputedStyle(reality);
        if (rcs.display !== "none" && (reality.classList.contains("is-active") || reality.classList.contains("active"))) {
          conflict = true;
        }
      }
    }
    return conflict || cs.display === "none";
  }

  function showTab(id, write) {
    id = normalize(id) || "reminder";
    ensureAboutTopLevel();
    applyPanel(id);
    if (write !== false) {
      try {
        localStorage.setItem("clarity_companion_tab_v1", id);
      } catch (e) {}
      try {
        var want = "#" + id;
        if ((w.location.hash || "") !== want) history.replaceState(null, "", want);
      } catch (e2) {}
    }
    ensureStickLoop();
  }

  function ensureStickLoop() {
    if (stickTimer) return;
    // Gentle: every 400ms, only re-apply when chrome says About (or lastId) but DOM drifted
    stickTimer = setInterval(function () {
      var id = desiredTab();
      if (!id) return;
      if (panelLooksWrong(id)) applyPanel(id);
    }, 400);
  }

  function feedbackHtml() {
    return (
      '<div class="card companion-about-feedback" id="companion-about-feedback">' +
      "<h2>Write to Clarity</h2>" +
      '<p class="caf-sub">Suggestions, improvements, or concerns about content. Educational only — not a fatwa desk.</p>' +
      '<div class="caf-chips" role="group" aria-label="Feedback type">' +
      '<button type="button" class="caf-chip is-on" data-caf-type="suggestion">Suggestion</button>' +
      '<button type="button" class="caf-chip" data-caf-type="improvement">Improvement</button>' +
      '<button type="button" class="caf-chip" data-caf-type="concern">Concern</button>' +
      '<button type="button" class="caf-chip" data-caf-type="content">Content accuracy</button>' +
      "</div>" +
      '<label class="caf-label" for="caf-message">Your note</label>' +
      '<textarea id="caf-message" class="caf-message" rows="5" maxlength="4000" placeholder="What would make Clarity clearer or more trustworthy?"></textarea>' +
      '<p class="caf-hint">On-device until you send. Goes to Clarity via secure channel.</p>' +
      '<div class="caf-actions">' +
      '<button type="button" class="caf-btn caf-primary" id="caf-send">Send to Clarity</button>' +
      '<button type="button" class="caf-btn" id="caf-copy">Copy</button>' +
      '<button type="button" class="caf-btn" id="caf-mail">Mail app</button>' +
      "</div>" +
      '<p class="caf-status" id="caf-status" aria-live="polite"></p>' +
      '<p class="td-src">Adab: specific, kind, source-aware.</p>' +
      "</div>"
    );
  }

  function buildBody(type, text) {
    return (
      "Clarity app feedback\nType: " +
      type +
      "\nRoom: Companion · About\nURL: " +
      ((w.location && w.location.href) || "") +
      "\nWhen: " +
      new Date().toISOString() +
      "\n\n" +
      text +
      "\n\n— Educational only; not a fatwa"
    );
  }

  function wireFeedback(root) {
    var card = root.querySelector("#companion-about-feedback");
    if (!card || card.getAttribute("data-wired") === "1") return;
    card.setAttribute("data-wired", "1");
    var type = "suggestion";
    card.querySelectorAll(".caf-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        card.querySelectorAll(".caf-chip").forEach(function (c) {
          c.classList.remove("is-on");
        });
        chip.classList.add("is-on");
        type = chip.getAttribute("data-caf-type") || "suggestion";
      });
    });
    function msg() {
      var ta = d.getElementById("caf-message");
      return (ta && ta.value ? ta.value : "").trim();
    }
    function status(t) {
      var s = d.getElementById("caf-status");
      if (s) s.textContent = t || "";
    }
    var sendBtn = d.getElementById("caf-send");
    if (sendBtn) {
      sendBtn.addEventListener("click", function () {
        var text = msg();
        if (!text) {
          status("Write a short note first.");
          return;
        }
        status("Sending…");
        fetch(FEEDBACK_API, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            type: type,
            message: text,
            room: "companion-about",
            url: (w.location && w.location.href) || "",
            when: new Date().toISOString()
          })
        })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.json().catch(function () {
              return {};
            });
          })
          .then(function () {
            status("Received — Jazak Allah khayran.");
            var ta = d.getElementById("caf-message");
            if (ta) ta.value = "";
          })
          .catch(function () {
            w.location.href =
              "mailto:" +
              FEEDBACK_TO +
              "?subject=" +
              encodeURIComponent("Clarity feedback · " + type) +
              "&body=" +
              encodeURIComponent(buildBody(type, text));
            status("Direct send unavailable — mail draft opened.");
          });
      });
    }
    var copyBtn = d.getElementById("caf-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var text = msg();
        if (!text) {
          status("Write a short note first.");
          return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(buildBody(type, text)).then(
            function () {
              status("Copied.");
            },
            function () {
              status("Could not copy.");
            }
          );
        }
      });
    }
    var mail = d.getElementById("caf-mail");
    if (mail) {
      mail.addEventListener("click", function () {
        var text = msg();
        if (!text) {
          status("Write a short note first.");
          return;
        }
        w.location.href =
          "mailto:" +
          FEEDBACK_TO +
          "?subject=" +
          encodeURIComponent("Clarity feedback · " + type) +
          "&body=" +
          encodeURIComponent(buildBody(type, text));
        status("Mail draft to " + FEEDBACK_TO + " opened.");
      });
    }
  }

  function enrichOnce() {
    var about = ensureAboutTopLevel();
    if (!about) return;
    var root = about.querySelector("#companion-about-enriched-root");
    if (!root) return;
    var card = d.getElementById("about-clarity-card");
    if (card && !root.contains(card)) {
      card.setAttribute("data-rrra", "about");
      root.insertBefore(card, root.firstChild);
    }
    var reality = d.getElementById("tab-reality");
    if (reality) {
      var stray = reality.querySelector("#about-clarity-card");
      if (stray) {
        stray.setAttribute("data-rrra", "about");
        root.insertBefore(stray, root.firstChild);
      }
    }
    var ptr = d.getElementById("about-moved-pointer");
    if (ptr && ptr.parentNode) ptr.parentNode.removeChild(ptr);
    if (!root.querySelector("#companion-about-amana")) {
      root.insertAdjacentHTML(
        "beforeend",
        '<div class="card" id="companion-about-amana"><h2>Amānah vault · own room</h2>' +
          '<p style="font-size:0.92rem;line-height:1.5">Vault, dayn, heirs, tree, farāʾiḍ live in <strong>Amānah</strong>.</p>' +
          '<p><a class="btn-soft" href="/amana/" style="display:inline-block;padding:0.4rem 0.85rem;border-radius:999px;border:1px solid rgba(212,180,90,0.4);text-decoration:none;font-weight:700">Open Amānah →</a></p>' +
          '<p class="td-src">Educational only — not a fatwa.</p></div>'
      );
    }
    if (!root.querySelector("#companion-about-rooms")) {
      root.insertAdjacentHTML(
        "beforeend",
        '<div class="card" id="companion-about-rooms"><h2>Five rooms</h2><ul class="sources-list">' +
          '<li><a href="/companion/"><strong>Companion</strong></a></li>' +
          '<li><a href="/daily/"><strong>Yawm</strong></a></li>' +
          '<li><a href="/campus/"><strong>University</strong></a></li>' +
          '<li><a href="/amana/"><strong>Amānah</strong></a></li>' +
          '<li><a href="/craft/"><strong>Craft</strong></a></li></ul>' +
          '<p style="font-size:0.85rem"><a href="/about/">/about/</a> · <a href="/charter/">Charter</a></p></div>'
      );
    }
    if (!root.querySelector("#companion-about-feedback")) {
      root.insertAdjacentHTML("beforeend", feedbackHtml());
    }
    wireFeedback(root);
  }

  function doorFn(id) {
    var n = normalize(id);
    if (n) {
      showTab(n, true);
      return;
    }
  }

  function lockDoor() {
    try {
      Object.defineProperty(w, "clarityOpenSectionDoor", {
        configurable: true,
        enumerable: true,
        get: function () {
          return doorFn;
        },
        set: function () {
          /* ignore hostile re-wrap */
        }
      });
    } catch (e) {
      w.clarityOpenSectionDoor = doorFn;
    }
    try {
      Object.defineProperty(w, "clarityShowCompanionTab", {
        configurable: true,
        enumerable: true,
        get: function () {
          return showTab;
        },
        set: function () {
          /* ignore */
        }
      });
    } catch (e2) {
      w.clarityShowCompanionTab = showTab;
    }
  }

  function wireRail() {
    function onRail(ev) {
      var btn = ev.target && ev.target.closest
        ? ev.target.closest("#clarity-door-rail [data-rail-tab], #clarity-door-rail [data-rrra]")
        : null;
      if (!btn) return;
      var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
      var n = normalize(t);
      if (!n) return;
      ev.preventDefault();
      ev.stopPropagation();
      if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
      showTab(n, true);
    }
    d.addEventListener("click", onRail, true);
  }

  function boot() {
    try {
      ensureAboutTopLevel();
      enrichOnce();
      lockDoor();
      wireRail();
      ensureStickLoop();
      var h = normalize((w.location.hash || "").replace(/^#/, ""));
      if (h) showTab(h, true);
      setTimeout(function () {
        lockDoor();
        enrichOnce();
        var id = desiredTab();
        if (id) showTab(id, false);
      }, 200);
      setTimeout(lockDoor, 1000);
    } catch (e) {
      console.warn("about-tab-v8", e);
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("hashchange", function () {
    var id = normalize((w.location.hash || "").replace(/^#/, ""));
    if (id) showTab(id, true);
  });
})(window, document);
