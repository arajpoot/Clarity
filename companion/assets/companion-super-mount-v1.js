/*! companion-super-mount-v1
 * Campus-like single mount backbone for Companion.
 * Merges: shell router · script-safe mount · path focus · enrichment hold · hygiene · one hydrate pulse.
 * Specialized engines (tab-engines, craft, hifz, hadith, about, path packs) still listen on clarity:tab-mounted.
 * Educational only — not a fatwa. Companion room only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_SUPER_MOUNT_V1__) return;
  w.__COMPANION_SUPER_MOUNT_V1__ = true;

  var TABS = ["reminder", "reality", "reflection", "action", "notes", "about"];
  var PATHS = ["seeker", "new_muslim", "practicing", "dai"];
  var KEY_TAB = "clarity_companion_tab_v1";
  var KEY_PATH = "clarity_gate_v1";
  var RUN_INLINE = true;
  var externalLoaded = {};
  var mounting = false;

  var FOCUS = {
    reminder: {
      seeker: "One command-verse. Read · pause · one small act today.",
      new_muslim: "Short reminder with clear meaning — stability before volume.",
      practicing: "Refresh a known command; teach it to your own limbs.",
      dai: "Choose a verse you can share with source and adab — not argument."
    },
    reality: {
      seeker: "One Seerah spark: how the Prophet ﷺ faced a hard day.",
      new_muslim: "A gentle timeline moment — belonging to a real story.",
      practicing: "Weekly review of what you lived, not only what you read.",
      dai: "Study a transmitted report with care — name the source."
    },
    reflection: {
      seeker: "Tawbah wakes the heart: one honest return to Allah today.",
      new_muslim: "Mercy first — learn prayer; return quickly when you slip.",
      practicing: "After a slip: tawbah, next prayer, restore the wird.",
      dai: "Clean your page before you invite others — adab with Allah first."
    },
    action: {
      seeker: "One deed you can finish before sleep.",
      new_muslim: "Wuḍūʾ / ṣalāh practice — slow and correct.",
      practicing: "Tajweed or craft: one rule, one line.",
      dai: "Prepare one clear shareable note with a primary source link."
    },
    notes: {
      seeker: "Write one line you want waiting in the grave.",
      new_muslim: "Note a question for a local teacher.",
      practicing: "Log a trust or thanks to settle.",
      dai: "Draft a transmission note: source · audience · adab limit."
    },
    about: {
      seeker: "This room is educational only — not a fatwa desk.",
      new_muslim: "Charter: private by default; Amānah holds vault tools.",
      practicing: "Feedback improves the craft — kind and specific.",
      dai: "Limits: verify before you transmit."
    }
  };
  var PATH_LABEL = {
    seeker: "Seeker · wake the heart",
    new_muslim: "New Muslim · establish pillars",
    practicing: "Daily · consistency",
    dai: "Daʿi · transmission with adab"
  };

  var KILL_CHROME = [
    ".rrra-hub-summary",
    ".rrra-hub-hero",
    ".rrra-hub-meta",
    ".clarity-gate-switcher",
    ".rrra-sitewide",
    '[aria-label="Learning track — switch anytime"]'
  ].join(",");

  function normalizeTab(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id === "journey" || id === "commands" || id === "seerah") id = "reminder";
    if (id === "tajweed" || id === "meme" || id === "callig") id = "action";
    return TABS.indexOf(id) >= 0 ? id : "reminder";
  }
  function normalizePath(p) {
    p = String(p || "").toLowerCase();
    if (p.indexOf("new") >= 0) return "new_muslim";
    if (p.indexOf("dai") >= 0 || p.indexOf("da'i") >= 0) return "dai";
    if (p.indexOf("practic") >= 0 || p.indexOf("daily") >= 0) return "practicing";
    if (p.indexOf("seeker") >= 0) return "seeker";
    return PATHS.indexOf(p) >= 0 ? p : "seeker";
  }
  function getPath() {
    try {
      return normalizePath(localStorage.getItem(KEY_PATH) || "seeker");
    } catch (e) {
      return "seeker";
    }
  }
  function setPath(p) {
    p = normalizePath(p);
    try {
      localStorage.setItem(KEY_PATH, p);
    } catch (e) {}
    d.querySelectorAll("[data-cs-path]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-cs-path") === p);
    });
    d.body.setAttribute("data-cs-path", p);
    return p;
  }
  function getTab() {
    var h = normalizeTab((w.location.hash || "").replace(/^#/, ""));
    if (h) return h;
    try {
      return normalizeTab(localStorage.getItem(KEY_TAB) || "reminder");
    } catch (e) {
      return "reminder";
    }
  }
  function status(msg) {
    var el = d.getElementById("cs-mount-status");
    if (el) el.textContent = msg || "";
  }

  function paintFocus(tab, path) {
    var pathEl = d.getElementById("cs-focus-path");
    var msgEl = d.getElementById("cs-focus-msg");
    if (pathEl) pathEl.textContent = (PATH_LABEL[path] || path) + " · " + tab;
    var bag = FOCUS[tab] || {};
    if (msgEl) msgEl.textContent = bag[path] || bag.seeker || "One sincere step is enough today.";
  }

  function applyPathStream(root, tab, path) {
    if (!root) return;
    root.querySelectorAll("[data-cs-path-only]").forEach(function (el) {
      var only = (el.getAttribute("data-cs-path-only") || "").split(/\s+/);
      var show = only.indexOf(path) >= 0 || only.indexOf("all") >= 0 || only.indexOf("") >= 0;
      if (!only[0]) show = true;
      el.hidden = !show;
    });
    root.querySelectorAll("[data-cs-primary]").forEach(function (el) {
      el.classList.add("cs-stream-primary");
    });
    paintFocus(tab, path);
  }

  /** Governance §7: path may emphasize; never blank the mount or hide all cards */
  function enrichmentHold(root) {
    if (!root) return;
    var cards = root.querySelectorAll(
      "[id$='-card'], section.cs-plaque, .cs-plaque, .cs-rich-legacy-wrap, .cs-rich-legacy, [data-cs-primary]"
    );
    cards.forEach(function (el) {
      if (el.hasAttribute("data-cs-path-only")) return;
      try {
        el.style.removeProperty("display");
        if (el.getAttribute("hidden") === "" && !el.hasAttribute("data-cs-path-only")) {
          /* leave intentional hidden alone only if path-only */
        }
        if (!el.hasAttribute("data-cs-path-only")) {
          el.hidden = false;
        }
      } catch (e) {}
    });
    // Soften loading placeholders
    root.querySelectorAll("*").forEach(function (el) {
      if (el.childNodes && el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        var t = (el.textContent || "").trim();
        if (t === "Loading..." || t === "Loading…") {
          el.innerHTML =
            '<span class="cs-loading-soft">Fetching from allowed educational sources…</span>';
        }
      }
    });
  }

  function hygiene(root) {
    root = root || d.getElementById("cs-mount");
    if (!root) return;
    try {
      root.querySelectorAll(KILL_CHROME).forEach(function (el) {
        el.setAttribute("hidden", "");
        el.style.setProperty("display", "none", "important");
      });
      root.querySelectorAll('[id^="rrra-hub-body"]').forEach(function (el) {
        el.id = el.id.replace("rrra-hub-body", "cs-tab-sections");
        el.classList.remove("rrra-hub-body");
        el.classList.add("cs-tab-sections");
      });
    } catch (e) {}
    // dead yawm links → daily
    try {
      root.querySelectorAll('a[href="/yawm/"],a[href="/yawm"]').forEach(function (a) {
        a.setAttribute("href", "/daily/");
      });
    } catch (e2) {}
  }

  function dispatchMounted(tab, wrap) {
    try {
      d.body.setAttribute("data-active-tab", tab || "");
      var detail = { tab: tab, root: wrap || d.getElementById("cs-mount") };
      d.dispatchEvent(new CustomEvent("clarity:tab-mounted", { detail: detail }));
      w.dispatchEvent(new CustomEvent("clarity:tab-mounted", { detail: detail }));
    } catch (e) {}
  }

  function rehydratePulse(wrap, tab) {
    try {
      if (w.ClarityTabEngines && typeof w.ClarityTabEngines.hydrate === "function") {
        w.ClarityTabEngines.hydrate(wrap || d.getElementById("cs-mount"), tab);
      }
    } catch (e) {}
    try {
      if (w.ClarityCompanionCraft && w.ClarityCompanionCraft.rehydrate) {
        w.ClarityCompanionCraft.rehydrate();
      }
    } catch (e2) {}
    try {
      if (w.clarityHifz && w.clarityHifz.load) w.clarityHifz.load();
    } catch (e3) {}
    try {
      if (w.ClarityNurosPathEngine && w.ClarityNurosPathEngine.align) {
        w.ClarityNurosPathEngine.align();
      }
    } catch (e4) {}
    try {
      if (typeof w.loadHadith === "function") {
        var host = (wrap || d).querySelector && (wrap || d).querySelector("#hadith");
        if (host && /Loading/i.test(host.textContent || "")) w.loadHadith();
      }
    } catch (e5) {}
    try {
      if (w.ClarityCompanionAbout && w.ClarityCompanionAbout.mount) {
        w.ClarityCompanionAbout.mount(wrap);
      }
    } catch (e6) {}
  }

  function runScripts(scriptNodes, host) {
    var chain = Promise.resolve();
    scriptNodes.forEach(function (old) {
      chain = chain.then(function () {
        return new Promise(function (resolve) {
          var s = d.createElement("script");
          var src = old.getAttribute("src");
          if (src) {
            try {
              src = new URL(src, w.location.origin + "/companion/").href;
            } catch (e1) {}
            if (externalLoaded[src]) {
              resolve();
              return;
            }
            s.src = src;
            s.async = false;
            s.onload = function () {
              externalLoaded[src] = true;
              resolve();
            };
            s.onerror = function () {
              resolve();
            };
            (host || d.body).appendChild(s);
          } else if (RUN_INLINE) {
            s.textContent = old.textContent || old.innerHTML || "";
            try {
              (host || d.body).appendChild(s);
            } catch (e2) {}
            resolve();
          } else {
            resolve();
          }
        });
      });
    });
    return chain;
  }

  function fortifyMountHTML(mount, html, tab) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var body = doc.querySelector("[data-cs-tab-body]") || doc.body;
    var scripts = Array.prototype.slice.call(body.querySelectorAll("script"));
    scripts.forEach(function (s) {
      if (s.parentNode) s.parentNode.removeChild(s);
    });
    mount.innerHTML = "";
    var wrap = d.createElement("div");
    wrap.setAttribute("data-cs-mounted", tab || "");
    wrap.innerHTML = body.innerHTML;
    mount.appendChild(wrap);
    return runScripts(scripts, wrap).then(function () {
      return wrap;
    });
  }

  function mountTab(tab) {
    tab = normalizeTab(tab);
    var mount = d.getElementById("cs-mount");
    if (!mount) return Promise.resolve();
    if (mounting) {
      /* allow sequential replace */
    }
    mounting = true;
    var path = getPath();

    d.body.setAttribute("data-active-tab", tab);
    d.querySelectorAll(".cs-door [data-rail-tab], #clarity-door-rail [data-rail-tab]").forEach(
      function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-rail-tab") === tab);
      }
    );
    try {
      localStorage.setItem(KEY_TAB, tab);
    } catch (e) {}
    try {
      var want = "#" + tab;
      if ((w.location.hash || "") !== want) history.replaceState(null, "", want);
    } catch (e2) {}

    status("Loading " + tab + "…");
    var url = "/companion/tabs/" + tab + "/?path=" + encodeURIComponent(path);

    return fetch(url, { credentials: "same-origin", cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (html) {
        return fortifyMountHTML(mount, html, tab).then(function (wrap) {
          applyPathStream(wrap, tab, path);
          enrichmentHold(wrap);
          hygiene(wrap);
          status("");
          dispatchMounted(tab, wrap);
          rehydratePulse(wrap, tab);
          // second quiet pulse after deferred specialists
          setTimeout(function () {
            enrichmentHold(wrap);
            hygiene(wrap);
            rehydratePulse(wrap, tab);
          }, 120);
          mounting = false;
          return wrap;
        });
      })
      .catch(function (err) {
        mounting = false;
        mount.innerHTML =
          '<div class="cs-plaque"><h2>Could not load tab</h2><p class="lead">' +
          String(err && err.message ? err.message : err) +
          '</p><p class="disc">Educational only — not a fatwa.</p></div>';
        status("Load error");
      });
  }

  function bind() {
    d.querySelectorAll(".cs-door [data-rail-tab], #clarity-door-rail [data-rail-tab]").forEach(
      function (btn) {
        if (btn.__csSuperBound) return;
        btn.__csSuperBound = true;
        btn.addEventListener("click", function (ev) {
          ev.preventDefault();
          mountTab(btn.getAttribute("data-rail-tab"));
        });
      }
    );
    d.querySelectorAll("[data-cs-path]").forEach(function (btn) {
      if (btn.__csSuperBound) return;
      btn.__csSuperBound = true;
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        setPath(btn.getAttribute("data-cs-path"));
        mountTab(getTab());
      });
    });
    if (!w.__CS_SUPER_HASH__) {
      w.__CS_SUPER_HASH__ = true;
      w.addEventListener("hashchange", function () {
        mountTab(getTab());
      });
    }
  }

  function boot() {
    d.documentElement.setAttribute("data-clarity-room", "companion");
    setPath(getPath());
    bind();
    mountTab(getTab());
  }

  // Public API — same surface as shell so existing engines keep working
  w.ClarityCompanionShell = {
    mountTab: mountTab,
    getTab: getTab,
    getPath: getPath,
    setPath: setPath,
    fortifyMountHTML: fortifyMountHTML,
    __super: true,
    __fortified: true
  };
  w.ClarityContentStreamV2 = {
    apply: applyPathStream,
    paintFocus: paintFocus
  };
  w.ClarityCompanionSuperMount = {
    version: "v1-20261116SM1",
    mountTab: mountTab,
    enrichmentHold: enrichmentHold,
    hygiene: hygiene
  };

  // Compatibility flags so older fortify/shell guards no-op cleanly if still linked
  w.__COMPANION_SHELL_V1__ = true;
  w.__COMPANION_MOUNT_FORTIFY_V1__ = true;
  w.__COMPANION_CONTENT_STREAM_V2__ = true;

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
