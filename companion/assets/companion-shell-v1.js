/*! companion-shell-v1 · Phase 1 router + mount
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_SHELL_V1__) return;
  w.__COMPANION_SHELL_V1__ = true;

  var TABS = ["reminder", "reality", "reflection", "action", "notes", "about"];
  var PATHS = ["seeker", "new_muslim", "practicing", "dai"];
  var KEY_TAB = "clarity_companion_tab_v1";
  var KEY_PATH = "clarity_gate_v1";

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

  function mountTab(tab) {
    tab = normalizeTab(tab);
    var mount = d.getElementById("cs-mount");
    if (!mount) return Promise.resolve();
    d.body.setAttribute("data-active-tab", tab);
    d.querySelectorAll(".cs-door [data-rail-tab]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-rail-tab") === tab);
    });
    try {
      localStorage.setItem(KEY_TAB, tab);
    } catch (e) {}
    try {
      var want = "#" + tab;
      if ((w.location.hash || "") !== want) history.replaceState(null, "", want);
    } catch (e2) {}

    var url = "/companion/tabs/" + tab + "/?path=" + encodeURIComponent(getPath());
    status("Loading " + tab + "…");
    return fetch(url, { credentials: "same-origin", cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var body = doc.querySelector("[data-cs-tab-body]") || doc.body;
        mount.innerHTML = "";
        var wrap = d.createElement("div");
        wrap.setAttribute("data-cs-mounted", tab);
        wrap.innerHTML = body.innerHTML;
        mount.appendChild(wrap);
        status("");
        /* path-aware stream */
        if (w.ClarityContentStreamV2 && typeof w.ClarityContentStreamV2.apply === "function") {
          w.ClarityContentStreamV2.apply(mount, tab, getPath());
        }
        /* focus strip */
        if (w.ClarityContentStreamV2 && typeof w.ClarityContentStreamV2.paintFocus === "function") {
          w.ClarityContentStreamV2.paintFocus(tab, getPath());
        }
      })
      .catch(function (err) {
        mount.innerHTML =
          '<div class="cs-plaque"><h2>Could not load tab</h2><p class="lead">' +
          String(err && err.message ? err.message : err) +
          '</p><p class="disc">Educational only — not a fatwa.</p></div>';
        status("Load error");
      });
  }

  function bind() {
    d.querySelectorAll(".cs-door [data-rail-tab]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        mountTab(btn.getAttribute("data-rail-tab"));
      });
    });
    d.querySelectorAll("[data-cs-path]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        setPath(btn.getAttribute("data-cs-path"));
        mountTab(getTab());
      });
    });
    w.addEventListener("hashchange", function () {
      mountTab(getTab());
    });
  }

  function boot() {
    d.documentElement.setAttribute("data-clarity-room", "companion");
    setPath(getPath());
    bind();
    mountTab(getTab());
  }

  w.ClarityCompanionShell = { mountTab: mountTab, getTab: getTab, getPath: getPath, setPath: setPath };
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
