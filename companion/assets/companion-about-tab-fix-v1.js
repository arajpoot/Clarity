/*! Companion About isolate v13 · no MO thrash · no share-light · full width · feedback exempt · tajweed contained · same-origin feedback allow
 * - Refresh with #about stays on About (wins over tab-persist default)
 * - Single feedback block (de-dupe)
 * - Textarea usable (no capture steal outside rail)
 * - Tajweed hard-hidden unless data-active-tab=action
 * - No interval thrash
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_ABOUT_TAB_FIX_V13__) return;
  w.__CLARITY_COMPANION_ABOUT_TAB_FIX_V13__ = true;

  var FEEDBACK_TO = "feedback@clarity-dawah.fyi";
  /* relative = same origin; Shariah guard must allow own host */
  var FEEDBACK_API = "/api/feedback";

  function allowSameOriginFeedback() {
    try {
      var host = (w.location && w.location.hostname) || "";
      w.CLARITY_SHARIAH_ALLOW_HOSTS = w.CLARITY_SHARIAH_ALLOW_HOSTS || [];
      ["clarity-dawah.fyi", "www.clarity-dawah.fyi", host].forEach(function (h) {
        if (h && w.CLARITY_SHARIAH_ALLOW_HOSTS.indexOf(h) < 0) w.CLARITY_SHARIAH_ALLOW_HOSTS.push(h);
      });
      /* Feedback is not deen-text sourcing — always exempt */
      w.CLARITY_FEEDBACK_EXEMPT = true;
      function isFeedbackUrl(url) {
        try {
          var u = new URL(String(url || ""), w.location.href);
          var path = u.pathname || "";
          var h = (u.hostname || "").toLowerCase();
          if (path.indexOf("/api/feedback") === 0) return true;
          if (path.indexOf("feedback") >= 0 && h.indexOf("clarity-dawah") >= 0) return true;
          if (String(url || "").indexOf("mailto:feedback@") === 0) return true;
          if (h && w.location && h === (w.location.hostname || "").toLowerCase()) return true;
        } catch (e) {}
        return false;
      }
      var prev = w.clarityShariahCheckUrl;
      if (typeof prev === "function") {
        w.clarityShariahCheckUrl = function (url) {
          if (isFeedbackUrl(url)) return { ok: true, reason: "feedback-exempt", educationalOnly: true };
          return prev(url);
        };
        w.clarityShariahCheckUrl.__clarityFeedbackAllow = true;
      } else {
        w.clarityShariahCheckUrl = function (url) {
          if (isFeedbackUrl(url)) return { ok: true, reason: "feedback-exempt", educationalOnly: true };
          return { ok: true, reason: "default-soft", educationalOnly: true };
        };
        w.clarityShariahCheckUrl.__clarityFeedbackAllow = true;
      }
      /* Wrap fetch once for feedback path */
      if (!w.fetch.__clarityFeedbackExempt) {
        var nativeFetch = w.fetch;
        w.fetch = function (input, init) {
          try {
            var url = typeof input === "string" ? input : (input && input.url) || "";
            if (isFeedbackUrl(url)) {
              init = init || {};
              return nativeFetch.call(w, input, init);
            }
          } catch (e) {}
          return nativeFetch.call(w, input, init);
        };
        w.fetch.__clarityFeedbackExempt = true;
      }
    } catch (e) {}
  }
  var VALID = {
    reminder: "tab-reminder",
    reality: "tab-reality",
    reflection: "tab-reflection",
    action: "tab-action",
    notes: "tab-notes",
    about: "tab-about"
  };
  var applying = false;

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

  function hideTajweedUnlessAction(activeId) {
    var show = String(activeId || "") === "action";
    var sel = [
      "#tj-deep-studio",
      "#tajweed-live-card",
      "#tajweed-path-card",
      "#tajweed-player",
      "#tajweed-player-dup1",
      ".card-tajweed",
      ".tj-deep-studio",
      "[data-tajweed-studio]",
      "#nx-tajweed-deep-studio",
      ".nx-tajweed-deep-studio"
    ].join(",");
    d.querySelectorAll(sel).forEach(function (el) {
      if (show) {
        el.style.removeProperty("display");
        el.removeAttribute("hidden");
        el.setAttribute("aria-hidden", "false");
      } else {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("hidden", "");
        el.setAttribute("aria-hidden", "true");
      }
    });
    /* Sticky bar leak under door rail */
    d.querySelectorAll(".tj-sticky, .tajweed-sticky, [data-tj-leak]").forEach(function (el) {
      if (!show) {
        el.style.setProperty("display", "none", "important");
      }
    });
  }

  function showTab(id, write) {
    id = normalize(id) || "reminder";
    if (applying) return;
    applying = true;
    try {
      ensureAboutTopLevel();
      try {
        d.body.setAttribute("data-active-tab", id);
      } catch (e) {}

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
        } else {
          panel.style.setProperty("display", "none", "important");
        }
      });

      d.querySelectorAll("#clarity-door-rail [data-rail-tab], #clarity-door-rail [data-rrra]").forEach(function (btn) {
        var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
        btn.classList.toggle("is-active", t === id);
      });

      hideTajweedUnlessAction(id);

      if (write !== false) {
        try {
          localStorage.setItem("clarity_companion_tab_v1", id);
        } catch (e2) {}
        try {
          var want = "#" + id;
          if ((w.location.hash || "") !== want) history.replaceState(null, "", want);
        } catch (e3) {}
      }
    } finally {
      applying = false;
    }
  }

  
  function removeShareGentleReminder(root) {
    root = root || d;
    var nodes = root.querySelectorAll(
      ".share-light-box, #share-light-text, [data-share-gentle], .card-share-light"
    );
    nodes.forEach(function (el) {
      var card = el.closest(".card, .share-light-box, section, article") || el;
      card.style.display = "none";
      card.setAttribute("data-cc-removed", "share-gentle");
      try { card.remove(); } catch (e) {}
    });
    /* Text-match fallback */
    root.querySelectorAll("h2, h3, strong, .card").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^share a gentle reminder$/i.test(t) || /share a gentle reminder/i.test(t) && t.length < 48) {
        var card = el.closest(".card, .share-light-box, section") || el.parentElement;
        if (card) {
          card.style.display = "none";
          try { card.remove(); } catch (e2) {}
        }
      }
    });
  }

  function dedupeFeedback(root) {
    if (!root) return null;
    var cards = root.querySelectorAll("#companion-about-feedback, .companion-about-feedback");
    // Also catch unlabeled duplicates by heading
    root.querySelectorAll(".card").forEach(function (c) {
      var h = (c.querySelector("h2") && c.querySelector("h2").textContent) || "";
      if (/write to clarity/i.test(h) && c.id !== "companion-about-feedback") {
        if (!c.classList.contains("companion-about-feedback")) c.classList.add("companion-about-feedback");
      }
    });
    cards = root.querySelectorAll("#companion-about-feedback, .companion-about-feedback");
    if (cards.length <= 1) return cards[0] || null;
    for (var i = 1; i < cards.length; i++) {
      if (cards[i].parentNode) cards[i].parentNode.removeChild(cards[i]);
    }
    // Ensure single id
    if (cards[0]) cards[0].id = "companion-about-feedback";
    return cards[0];
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
      '<textarea id="caf-message" class="caf-message" rows="5" maxlength="4000" autocomplete="off" placeholder="What would make Clarity clearer or more trustworthy?"></textarea>' +
      '<p class="caf-hint">On-device until you send. Delivered to Clarity inbox (no mail app required).</p>' +
      '<div class="caf-actions">' +
      '<button type="button" class="caf-btn caf-primary" id="caf-send">Send to Clarity</button>' +
      '<button type="button" class="caf-btn" id="caf-copy">Copy</button>' +
      '<button type="button" class="caf-btn caf-secondary" id="caf-mail">Mail app (optional)</button>' +
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
    dedupeFeedback(root);
    var card = root.querySelector("#companion-about-feedback");
    if (!card) return;
    if (card.getAttribute("data-wired") === "1") return;
    card.setAttribute("data-wired", "1");

    var type = "suggestion";
    card.querySelectorAll(".caf-chip").forEach(function (chip) {
      chip.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
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

    // Ensure textarea receives input (stop parent handlers)
    var ta = d.getElementById("caf-message");
    if (ta) {
      ["click", "touchstart", "pointerdown", "keydown", "keypress", "input"].forEach(function (evName) {
        ta.addEventListener(
          evName,
          function (ev) {
            ev.stopPropagation();
          },
          true
        );
      });
      ta.style.pointerEvents = "auto";
    }

    var sendBtn = d.getElementById("caf-send");
    if (sendBtn) {
      sendBtn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var text = msg();
        if (!text) {
          status("Write a short note first.");
          return;
        }
        allowSameOriginFeedback();
        status("Sending…");
        sendBtn.disabled = true;
        fetch(FEEDBACK_API, {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/json" },
          body: JSON.stringify({
            type: type,
            message: text,
            room: "companion-about",
            url: (w.location && w.location.href) || "",
            when: new Date().toISOString()
          }),
          mode: "cors",
          credentials: "omit",
          cache: "no-store"
        })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.json().catch(function () {
              return { ok: true };
            });
          })
          .then(function (data) {
            if (data && data.ok === false) throw new Error(data.error || "send failed");
            status("Received — Jazak Allah khayran. Your note reached Clarity.");
            var box = d.getElementById("caf-message");
            if (box) box.value = "";
          })
          .catch(function (err) {
            status(
              "Could not send directly (" +
                (err && err.message ? err.message : "network") +
                "). Tap Send again, or use Mail app (optional)."
            );
          })
          .finally(function () {
            sendBtn.disabled = false;
          });
      });
    }

    var copyBtn = d.getElementById("caf-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
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
      mail.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var text = msg();
        if (!text) {
          status("Write a short note first.");
          return;
        }
        var a = d.createElement("a");
        a.href =
          "mailto:" +
          FEEDBACK_TO +
          "?subject=" +
          encodeURIComponent("Clarity feedback · " + type) +
          "&body=" +
          encodeURIComponent(buildBody(type, text));
        a.rel = "noopener";
        a.style.display = "none";
        d.body.appendChild(a);
        a.click();
        setTimeout(function () {
          if (a.parentNode) a.parentNode.removeChild(a);
        }, 0);
        status("Mail app opened (optional). Prefer Send to Clarity when available.");
      });
    }
  }

  
  function widenAboutSections(root) {
    root = root || d.getElementById("tab-about");
    if (!root) return;
    root.style.maxWidth = "none";
    root.style.width = "100%";
    root.querySelectorAll(".card, .companion-about-enriched-root, .notes-hub-v35, .caf-wrap").forEach(function (el) {
      el.style.maxWidth = "none";
      el.style.width = "100%";
      el.style.boxSizing = "border-box";
    });
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

    // Remove legacy "About this Companion" duplicates if present outside card-about
    root.querySelectorAll(".card").forEach(function (c) {
      if (c.id === "about-clarity-card" || c.id === "companion-about-feedback") return;
      var h = (c.querySelector("h2") && c.querySelector("h2").textContent) || "";
      if (/^about this companion$/i.test(h.trim())) {
        if (c.parentNode) c.parentNode.removeChild(c);
      }
    });

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
    dedupeFeedback(root);
    wireFeedback(root);
  }

  function doorFn(id) {
    var n = normalize(id);
    if (n) showTab(n, true);
  }

  function lockDoor() {
    /* Yield to companion-tab-stable-v1 when present */
    if (w.__COMPANION_TAB_STABLE_V1__) return;
    try {
      w.clarityShowCompanionTab = showTab;
      w.clarityOpenSectionDoor = function (id) { showTab(id, true); };
    } catch (e) {}
  }

  function wireRail() {
    // Only rail buttons — never intercept About panel inputs
    d.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t || !t.closest) return;
        // Never hijack events inside About content
        if (t.closest("#tab-about")) return;
        var btn = t.closest("#clarity-door-rail [data-rail-tab], #clarity-door-rail [data-rrra]");
        if (!btn) return;
        var key = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
        var n = normalize(key);
        if (!n) return;
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
        showTab(n, true);
      },
      true
    );
  }

  function resolveBootTab() {
    // Prefer hash, then body, then storage — keep About on refresh
    var h = normalize((w.location.hash || "").replace(/^#/, ""));
    if (h) return h;
    try {
      var saved = normalize(localStorage.getItem("clarity_companion_tab_v1"));
      if (saved) return saved;
    } catch (e) {}
    return "reminder";
  }

  function boot() {
    try {
      allowSameOriginFeedback();
      removeShareGentleReminder(d);
      ensureAboutTopLevel();
      enrichOnce();
      lockDoor();
      wireRail();
      var id = resolveBootTab();
      showTab(id, true);
      // One late settle after tab-persist (no loops)
      setTimeout(function () {
        lockDoor();
        enrichOnce();
        var again =
          normalize((w.location.hash || "").replace(/^#/, "")) ||
          normalize(localStorage.getItem("clarity_companion_tab_v1")) ||
          id;
        showTab(again, false);
        hideTajweedUnlessAction(again);
      }, 250);
    } catch (e) {
      console.warn("about-tab-v13", e);
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  /* MutationObserver removed in v13 — caused Notes freeze / thrash */
  w.addEventListener("hashchange", function () {
    var id = normalize((w.location.hash || "").replace(/^#/, ""));
    if (id) showTab(id, true);
  });
})(window, document);
