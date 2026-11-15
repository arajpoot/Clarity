/*! companion-mount-fortify-v1 · PERMANENT shell mount fix
 * Problem: mount via innerHTML strips/never executes <script> → craft/engines die.
 * Fix (campus model): parse tab HTML, inject DOM, then re-insert scripts so they run;
 * dispatch clarity:tab-mounted for all hydrators.
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MOUNT_FORTIFY_V1__) return;
  w.__COMPANION_MOUNT_FORTIFY_V1__ = true;

  var RUN_INLINE = true; // set false if a tab ever ships untrusted remote HTML
  var externalLoaded = {};

  function dispatchMounted(tab, wrap) {
    try {
      d.body.setAttribute("data-active-tab", tab || "");
      d.dispatchEvent(
        new CustomEvent("clarity:tab-mounted", {
          detail: { tab: tab, root: wrap || d.getElementById("cs-mount") }
        })
      );
      w.dispatchEvent(
        new CustomEvent("clarity:tab-mounted", {
          detail: { tab: tab, root: wrap || d.getElementById("cs-mount") }
        })
      );
    } catch (e) {}
  }

  function runScripts(scriptNodes, host) {
    var chain = Promise.resolve();
    scriptNodes.forEach(function (old) {
      chain = chain.then(function () {
        return new Promise(function (resolve) {
          var s = d.createElement("script");
          var src = old.getAttribute("src");
          if (src) {
            // absolutize relative src against companion tab origin
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

  /** Campus-style HTML mount: scripts execute after DOM inject */
  function fortifyMountHTML(mount, html, tab) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var body = doc.querySelector("[data-cs-tab-body]") || doc.body;
    var scripts = Array.prototype.slice.call(body.querySelectorAll("script"));
    scripts.forEach(function (s) {
      s.parentNode && s.parentNode.removeChild(s);
    });
    mount.innerHTML = "";
    var wrap = d.createElement("div");
    wrap.setAttribute("data-cs-mounted", tab || "");
    wrap.innerHTML = body.innerHTML;
    mount.appendChild(wrap);
    return runScripts(scripts, wrap).then(function () {
      dispatchMounted(tab, wrap);
      // nudge known hydrators
      try {
        if (w.ClarityCompanionCraft && w.ClarityCompanionCraft.rehydrate)
          w.ClarityCompanionCraft.rehydrate();
      } catch (e) {}
      try {
        if (w.clarityHifz && w.clarityHifz.load) w.clarityHifz.load();
      } catch (e2) {}
      try {
        if (w.ClarityNurosPathEngine && w.ClarityNurosPathEngine.align)
          w.ClarityNurosPathEngine.align();
      } catch (e3) {}
      try {
        if (typeof w.loadHadith === "function") {
          var host = wrap.querySelector("#hadith");
          if (host && /Loading/i.test(host.textContent || "")) w.loadHadith();
        }
      } catch (e4) {}
      return wrap;
    });
  }

  function patchShell() {
    var S = w.ClarityCompanionShell;
    if (!S || typeof S.mountTab !== "function" || S.__fortified) return false;

    var prev = S.mountTab;
    S.mountTab = function (tab) {
      tab = String(tab || "reminder").toLowerCase();
      var mount = d.getElementById("cs-mount");
      if (!mount) return prev.call(S, tab);

      // Prefer fortified fetch path when we can mirror shell URL pattern
      var path = "seeker";
      try {
        if (typeof S.getPath === "function") path = S.getPath() || path;
      } catch (e) {}

      d.body.setAttribute("data-active-tab", tab);
      d.querySelectorAll(".cs-door [data-rail-tab]").forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-rail-tab") === tab);
      });
      try {
        localStorage.setItem("clarity_companion_tab_v1", tab);
      } catch (e2) {}
      try {
        var want = "#" + tab;
        if ((w.location.hash || "") !== want) history.replaceState(null, "", want);
      } catch (e3) {}

      var status = d.getElementById("cs-mount-status");
      if (status) status.textContent = "Loading " + tab + "…";

      var url = "/companion/tabs/" + tab + "/?path=" + encodeURIComponent(path);
      return fetch(url, { credentials: "same-origin", cache: "no-cache" })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.text();
        })
        .then(function (html) {
          return fortifyMountHTML(mount, html, tab).then(function () {
            if (status) status.textContent = "";
            // path stream if present
            try {
              if (w.ClarityContentStreamV2 && typeof w.ClarityContentStreamV2.apply === "function") {
                w.ClarityContentStreamV2.apply(mount, tab, path);
              }
              if (w.ClarityContentStreamV2 && typeof w.ClarityContentStreamV2.paintFocus === "function") {
                w.ClarityContentStreamV2.paintFocus(tab, path);
              }
            } catch (e4) {}
          });
        })
        .catch(function (err) {
          // fallback to original mount
          try {
            return prev.call(S, tab);
          } catch (e5) {
            mount.innerHTML = '<div class="cs-plaque"><h2>Could not load tab</h2><p class="lead">' + String(err && err.message ? err.message : err) + '</p><p class="disc">Educational only — not a fatwa.</p></div>';
          }
        });
    };
    S.__fortified = true;
    S.fortifyMountHTML = fortifyMountHTML;
    return true;
  }

  function boot() {
    if (!patchShell()) {
      var n = 0;
      var iv = setInterval(function () {
        n++;
        if (patchShell() || n > 40) clearInterval(iv);
      }, 50);
    }
    // Also observe: if something else injects HTML without scripts, still dispatch
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () {
          var wrap = mount.querySelector("[data-cs-mounted]");
          var tab = (wrap && wrap.getAttribute("data-cs-mounted")) || d.body.getAttribute("data-active-tab");
          dispatchMounted(tab, wrap || mount);
        }, 30);
      }).observe(mount, { childList: true, subtree: false });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
