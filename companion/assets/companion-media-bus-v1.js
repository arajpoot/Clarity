/*! companion-media-bus-v1 · Phase 9+
 * Single media bus + cost budget for Companion craft (audio / heavy fetch).
 * Failure → safe fallback; does not remove craft modules.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEDIA_BUS_V1__) return;
  w.__COMPANION_MEDIA_BUS_V1__ = true;

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      return p.indexOf("/companion") === 0;
    } catch (e) { return false; }
  }
  if (!roomOk()) return;

  var BUDGET = {
    maxConcurrentAudio: 1,
    maxFetchPerMinute: 24,
    windowMs: 60000
  };

  var state = {
    audio: null,
    fetches: [],
    rejects: 0,
    allows: 0
  };

  function pruneFetches() {
    var now = Date.now();
    state.fetches = state.fetches.filter(function (t) { return now - t < BUDGET.windowMs; });
  }

  function canFetch() {
    pruneFetches();
    return state.fetches.length < BUDGET.maxFetchPerMinute;
  }

  function noteFetch() {
    state.fetches.push(Date.now());
    state.allows++;
  }

  function acquireAudio(el) {
    if (state.audio && state.audio !== el) {
      try { state.audio.pause(); } catch (e) {}
    }
    state.audio = el || null;
    return true;
  }

  function releaseAudio(el) {
    if (state.audio === el) state.audio = null;
  }

  /** Budget-aware fetch wrapper */
  function busFetch(url, opts) {
    if (!canFetch()) {
      state.rejects++;
      return Promise.reject(new Error("media_bus_budget"));
    }
    noteFetch();
    return fetch(url, opts || {});
  }

  w.ClarityMediaBus = {
    version: 1,
    budget: BUDGET,
    stats: function () {
      pruneFetches();
      return {
        fetchesInWindow: state.fetches.length,
        allows: state.allows,
        rejects: state.rejects,
        hasAudio: !!state.audio
      };
    },
    acquireAudio: acquireAudio,
    releaseAudio: releaseAudio,
    fetch: busFetch,
    canFetch: canFetch
  };

  /* Optional: pause other <audio> when one plays */
  d.addEventListener("play", function (ev) {
    var t = ev.target;
    if (t && t.tagName === "AUDIO") acquireAudio(t);
  }, true);
})(window, document);
