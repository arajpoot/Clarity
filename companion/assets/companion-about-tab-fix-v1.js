/*! Companion About calm + feedback v6
 * - Noise-free: no MutationObserver thrash, minimal re-assert
 * - About top-level once; enrichment once
 * - Tajweed stays Action-only (light quarantine)
 * - Feedback card: suggestions / improvements / concerns
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_ABOUT_TAB_FIX_V6__) return;
  w.__CLARITY_COMPANION_ABOUT_TAB_FIX_V6__ = true;

  var VALID = {
    reminder: "tab-reminder",
    reality: "tab-reality",
    reflection: "tab-reflection",
    action: "tab-action",
    notes: "tab-notes",
    about: "tab-about"
  };
  var booted = false;

  function normalize(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id === "journey" || id === "commands" || id === "seerah") id = "reminder";
    if (id === "tajweed" || id === "callig" || id === "calligraphy" || id === "meme") id = "action";
    if (id === "info" || id === "meta") id = "about";
    if (!VALID[id]) return null;
    return id;
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

  function showTab(id, write) {
    id = normalize(id) || "reminder";
    var panelId = VALID[id];
    ensureAboutTopLevel();

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
      } else {
        panel.style.setProperty("display", "none", "important");
      }
    });

    // Light Action quarantine — no loops
    var studio = d.getElementById("tj-deep-studio");
    var action = d.getElementById("tab-action");
    if (studio && action && !action.contains(studio)) {
      action.appendChild(studio);
    }
    d.body.setAttribute("data-active-tab", id);

    d.querySelectorAll("#clarity-door-rail [data-rail-tab], #clarity-door-rail [data-rrra]").forEach(function (btn) {
      var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
      btn.classList.toggle("is-active", t === id);
    });

    if (write !== false) {
      try {
        localStorage.setItem("clarity_companion_tab_v1", id);
      } catch (e) {}
      try {
        var want = "#" + id;
        if ((w.location.hash || "") !== want) history.replaceState(null, "", want);
      } catch (e2) {}
    }
  }

  function feedbackCardHtml() {
    return (
      '<div class="card companion-about-feedback" id="companion-about-feedback">' +
      '<div class="caf-head">' +
      "<h2>Write to Clarity</h2>" +
      '<p class="caf-sub">Suggestions, improvements, or concerns about content — from you, the user of this app. Educational space only; this is not a fatwa desk.</p>' +
      "</div>" +
      '<div class="caf-chips" role="group" aria-label="Feedback type">' +
      '<button type="button" class="caf-chip is-on" data-caf-type="suggestion">Suggestion</button>' +
      '<button type="button" class="caf-chip" data-caf-type="improvement">Improvement</button>' +
      '<button type="button" class="caf-chip" data-caf-type="concern">Concern</button>' +
      '<button type="button" class="caf-chip" data-caf-type="content">Content accuracy</button>' +
      "</div>" +
      '<label class="caf-label" for="caf-message">Your note</label>' +
      '<textarea id="caf-message" class="caf-message" rows="5" maxlength="4000" placeholder="What would make Clarity clearer, calmer, or more trustworthy for you?"></textarea>' +
      '<p class="caf-hint">Stays on this device until you send or copy. No account required.</p>' +
      '<div class="caf-actions">' +
      '<button type="button" class="caf-btn caf-primary" id="caf-copy">Copy message</button>' +
      '<button type="button" class="caf-btn" id="caf-github">Open GitHub note</button>' +
      '<button type="button" class="caf-btn" id="caf-mail">Mail draft</button>' +
      "</div>" +
      '<p class="caf-status" id="caf-status" aria-live="polite"></p>' +
      '<p class="td-src">Adab: be specific, kind, and source-aware. We may not reply to every note.</p>' +
      "</div>"
    );
  }

  function buildFeedbackBody(type, text) {
    return (
      "Clarity app feedback\n" +
      "Type: " + type + "\n" +
      "Room: Companion · About\n" +
      "URL: " + (w.location && w.location.href ? w.location.href.split("#")[0] : "https://clarity-dawah.fyi/companion/") + "\n" +
      "When: " + new Date().toISOString() + "\n\n" +
      text +
      "\n\n— Sent from Clarity (educational only; not a fatwa)"
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
    var copyBtn = d.getElementById("caf-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var text = msg();
        if (!text) {
          status("Write a short note first.");
          return;
        }
        var body = buildFeedbackBody(type, text);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(body).then(
            function () {
              status("Copied — paste into mail, chat, or an issue when ready.");
            },
            function () {
              status("Could not copy automatically. Select and copy from the box.");
            }
          );
        } else {
          status("Clipboard unavailable. Select your text and copy manually.");
        }
      });
    }
    var gh = d.getElementById("caf-github");
    if (gh) {
      gh.addEventListener("click", function () {
        var text = msg();
        if (!text) {
          status("Write a short note first.");
          return;
        }
        var title = encodeURIComponent("App feedback · " + type);
        var body = encodeURIComponent(buildFeedbackBody(type, text));
        w.open(
          "https://github.com/arajpoot/Clarity/issues/new?title=" + title + "&body=" + body,
          "_blank",
          "noopener,noreferrer"
        );
        status("GitHub draft opened in a new tab (public repo — avoid private details).");
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
        var subject = encodeURIComponent("Clarity feedback · " + type);
        var body = encodeURIComponent(buildFeedbackBody(type, text));
        // No invented inbox: user picks the destination in their mail client after paste, or uses GitHub.
        // mailto without address still opens a draft on many clients with subject/body.
        w.location.href = "mailto:?subject=" + subject + "&body=" + body;
        status("Mail draft opened — choose who should receive it.");
      });
    }
  }

  function enrichAboutOnce() {
    var about = ensureAboutTopLevel();
    if (!about) return;
    var root = about.querySelector("#companion-about-enriched-root");
    if (!root) return;

    var card = d.getElementById("about-clarity-card");
    if (card && !root.contains(card)) {
      card.setAttribute("data-rrra", "about");
      root.insertBefore(card, root.firstChild);
    }

    // Remove Reality pointer if any
    var ptr = d.getElementById("about-moved-pointer");
    if (ptr && ptr.parentNode) ptr.parentNode.removeChild(ptr);
    var reality = d.getElementById("tab-reality");
    if (reality) {
      var stray = reality.querySelector("#about-clarity-card");
      if (stray && root) {
        stray.setAttribute("data-rrra", "about");
        root.insertBefore(stray, root.firstChild);
      }
    }

    if (!root.querySelector("#companion-about-amana")) {
      root.insertAdjacentHTML(
        "beforeend",
        '<div class="card" id="companion-about-amana">' +
          "<h2>Amānah vault · own room</h2>" +
          '<p style="font-size:0.92rem;line-height:1.5">Vault unlock, dayn, heirs, family tree, farāʾiḍ study, and wasiyyah notes live in the <strong>Amānah</strong> room.</p>' +
          '<p><a class="btn-soft" href="/amana/" style="display:inline-block;padding:0.4rem 0.85rem;border-radius:999px;border:1px solid rgba(212,180,90,0.4);text-decoration:none;font-weight:700">Open Amānah →</a></p>' +
          '<p class="td-src">Educational only — not a fatwa · passphrase on this device.</p>' +
          "</div>"
      );
    }
    if (!root.querySelector("#companion-about-rooms")) {
      root.insertAdjacentHTML(
        "beforeend",
        '<div class="card" id="companion-about-rooms">' +
          "<h2>Five rooms</h2>" +
          "<ul class=\"sources-list\">" +
          '<li><a href="/companion/"><strong>Companion</strong></a> — pathways · Reminder · Reality · Reflection · Action · About</li>' +
          '<li><a href="/daily/"><strong>Yawm</strong></a> — today’s portion</li>' +
          '<li><a href="/campus/"><strong>University</strong></a> — ordered learning</li>' +
          '<li><a href="/amana/"><strong>Amānah</strong></a> — trust desk &amp; optional vault</li>' +
          '<li><a href="/craft/"><strong>Craft</strong></a> — atelier</li>' +
          "</ul>" +
          '<p style="font-size:0.85rem">Public page: <a href="/about/">/about/</a> · <a href="/charter/">Charter</a></p>' +
          "</div>"
      );
    }
    if (!root.querySelector("#companion-about-feedback")) {
      root.insertAdjacentHTML("beforeend", feedbackCardHtml());
    }
    wireFeedback(root);
  }

  function wireDoor() {
    w.clarityShowCompanionTab = showTab;
    var prev = w.clarityOpenSectionDoor;
    w.clarityOpenSectionDoor = function (id) {
      var n = normalize(id);
      if (n) {
        showTab(n, true);
        return;
      }
      if (typeof prev === "function") {
        try {
          return prev.apply(this, arguments);
        } catch (e) {}
      }
    };

    d.querySelectorAll("#clarity-door-rail [data-rail-tab], #clarity-door-rail [data-rrra]").forEach(function (btn) {
      btn.addEventListener(
        "click",
        function (ev) {
          var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
          var n = normalize(t);
          if (!n) return;
          ev.preventDefault();
          ev.stopPropagation();
          showTab(n, true);
        },
        true
      );
    });
  }

  function boot() {
    if (booted) return;
    booted = true;
    try {
      ensureAboutTopLevel();
      enrichAboutOnce();
      wireDoor();
      var h = normalize((w.location.hash || "").replace(/^#/, ""));
      if (h) showTab(h, true);
      // Single calm settle — no observer storm
      setTimeout(function () {
        ensureAboutTopLevel();
        enrichAboutOnce();
        var id = normalize((w.location.hash || "").replace(/^#/, "")) ||
          normalize(d.body.getAttribute("data-active-tab"));
        if (id) showTab(id, false);
      }, 120);
    } catch (e) {
      console.warn("about-tab-v6", e);
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("hashchange", function () {
    var id = normalize((w.location.hash || "").replace(/^#/, ""));
    if (id) showTab(id, true);
  });
})(window, document);
