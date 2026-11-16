/*! companion-trace-v1 · P2 observe only
 * Logs mount sequence when enabled. NO DOM writes. NO style changes.
 * Enable: localStorage.setItem("clarity_cs_trace","1") or ?cs_trace=1
 * Disable: localStorage.removeItem("clarity_cs_trace")
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_TRACE_V1__) return;
  w.__COMPANION_TRACE_V1__ = true;

  function enabled() {
    try {
      if (/[?&]cs_trace=1(?:&|$)/.test(w.location.search || "")) return true;
      if (localStorage.getItem("clarity_cs_trace") === "1") return true;
    } catch (e) {}
    return false;
  }

  if (!enabled()) {
    w.ClarityCompanionTrace = { enabled: false, version: "v1-20261116P2" };
    return;
  }

  var log = (w.__COMPANION_TRACE_LOG = w.__COMPANION_TRACE_LOG || []);
  function stamp() {
    return new Date().toISOString().split("T")[1].replace("Z", "");
  }
  function rec(kind, detail) {
    var row = { t: stamp(), kind: kind, detail: detail || {} };
    try {
      log.push(row);
      if (log.length > 200) log.shift();
    } catch (e) {}
    try {
      if (w.console && console.info) {
        console.info("[cs-trace]", row.t, kind, detail || "");
      }
    } catch (e2) {}
  }

  // Wrap mountTab if shell already exposed (defer may run after shell boot — also listen events)
  function wrapShell() {
    var S = w.ClarityCompanionShell;
    if (!S || typeof S.mountTab !== "function" || S.__traceWrapped) return false;
    var prev = S.mountTab;
    S.mountTab = function (tab) {
      rec("mountTab:call", { tab: String(tab || "") });
      var ret;
      try {
        ret = prev.apply(S, arguments);
      } catch (e) {
        rec("mountTab:error", { message: String(e && e.message ? e.message : e) });
        throw e;
      }
      if (ret && typeof ret.then === "function") {
        return ret.then(
          function (v) {
            rec("mountTab:resolved", { tab: String(tab || "") });
            return v;
          },
          function (err) {
            rec("mountTab:rejected", { message: String(err && err.message ? err.message : err) });
            throw err;
          }
        );
      }
      rec("mountTab:returned-sync", { tab: String(tab || "") });
      return ret;
    };
    S.__traceWrapped = true;
    rec("shell:wrapped", {});
    return true;
  }

  function onMounted(ev) {
    var tab = ev && ev.detail && ev.detail.tab;
    var root = ev && ev.detail && ev.detail.root;
    var nCard = 0;
    var nHide = 0;
    try {
      if (root && root.querySelectorAll) {
        nCard = root.querySelectorAll("[id$='-card'], .cs-plaque").length;
        nHide = root.querySelectorAll(".cpp-path-hidden, [hidden]").length;
      }
    } catch (e) {}
    rec("clarity:tab-mounted", { tab: tab, cardsApprox: nCard, hiddenApprox: nHide });
  }

  function boot() {
    wrapShell();
    // retry wrap shortly if fortify/shell order races
    var n = 0;
    var iv = setInterval(function () {
      n++;
      if (wrapShell() || n > 40) clearInterval(iv);
    }, 50);
    d.addEventListener("clarity:tab-mounted", onMounted);
    w.addEventListener("clarity:tab-mounted", onMounted);
    rec("trace:boot", {
      path: (function () {
        try {
          return localStorage.getItem("clarity_gate_v1");
        } catch (e) {
          return null;
        }
      })(),
      hash: w.location.hash || ""
    });
  }

  w.ClarityCompanionTrace = {
    enabled: true,
    version: "v1-20261116P2",
    log: log,
    dump: function () {
      return log.slice();
    }
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
