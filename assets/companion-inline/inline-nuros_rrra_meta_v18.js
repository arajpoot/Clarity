(function(){
  "use strict";
  if (window.__NUROS_RRRA_META_V18__) return;
  window.__NUROS_RRRA_META_V18__ = true;

  var HUBS = ["reminder","reality","reflection","action"];
  var VAULT = {"user-family-tree-card":1,"faraid-card":1,"wasiyyah-card":1};
  var SKIP = {"traffic-stats-card":1,"palette-mgr-card":1,"bookmarks-card":1};

  function hubBody(name){
    return document.getElementById("rrra-hub-body-" + name) || document.getElementById("tab-" + name);
  }
  function tabPanel(name){
    return document.getElementById("tab-" + name);
  }

  function visibleCards(name){
    var body = hubBody(name);
    if (!body) return [];
    var root = (body.id && body.id.indexOf("rrra-hub-body") === 0) ? body : (body.querySelector(".rrra-hub-body") || body);
    var nodes = root.querySelectorAll(":scope > .card");
    if (!nodes.length) nodes = root.querySelectorAll(".card");
    var out = [], seen = [];
    Array.prototype.forEach.call(nodes, function(ch){
      if (!ch || !ch.classList || !ch.classList.contains("card")) return;
      if (ch.hasAttribute("hidden") || ch.getAttribute("aria-hidden") === "true") return;
      if (ch.style && (ch.style.display === "none" || ch.style.visibility === "hidden")) return;
      if (ch.id && (VAULT[ch.id] || SKIP[ch.id])) return;
      if (ch.getAttribute("data-deduped") === "1") return;
      if (seen.indexOf(ch) >= 0) return;
      seen.push(ch);
      out.push(ch);
    });
    return out;
  }

  function cardLabel(card){
    var h = card.querySelector("h2, h3, summary, .card-title");
    var tx = h ? (h.textContent || "") : (card.getAttribute("data-title") || card.id || "Section");
    tx = tx.replace(/\s+/g, " ").trim();
    if (tx.length > 42) tx = tx.slice(0, 40) + "\u2026";
    return tx || "Section";
  }

  function ensureCardId(card, idx, hub){
    if (card.id) return card.id;
    var slug = "rrra-" + hub + "-sec-" + idx;
    card.id = slug;
    return slug;
  }

  function jumpTo(id){
    var el = document.getElementById(id);
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch(e){
      el.scrollIntoView(true);
    }
    el.classList.add("rrra-flash");
    setTimeout(function(){ el.classList.remove("rrra-flash"); }, 1600);
  }

  function buildSummaryLinks(summaryEl, cards, hub){
    if (!summaryEl) return;
    summaryEl.innerHTML = "";
    summaryEl.setAttribute("role", "navigation");
    summaryEl.setAttribute("aria-label", "Jump to sections");
    cards.forEach(function(card, idx){
      var id = ensureCardId(card, idx, hub);
      var a = document.createElement("a");
      a.href = "#" + id;
      a.className = "rrra-jump";
      a.textContent = cardLabel(card);
      a.setAttribute("data-jump", id);
      a.addEventListener("click", function(ev){
        ev.preventDefault();
        jumpTo(id);
      });
      summaryEl.appendChild(a);
    });
  }

  function setText(el, text){
    if (!el) return;
    if ((el.textContent || "").trim() === text) return;
    el.textContent = text;
  }

  function markRailActive(name){
    document.querySelectorAll("#clarity-door-rail .door-rail-btn").forEach(function(btn){
      var tab = btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "";
      var on = (tab === name) || (name === "notes" && (tab === "notes" || tab === "vault" || tab === "amana"));
      btn.classList.toggle("active", on);
      btn.setAttribute("data-active", on ? "1" : "0");
      if (on) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function updateHub(name){
    var cards = visibleCards(name);
    var n = cards.length;
    var tab = tabPanel(name);
    var meta = tab ? tab.querySelector(".rrra-hub-meta") : null;
    var summary = tab ? tab.querySelector(".rrra-hub-summary") : null;
    if (meta) setText(meta, n + (n === 1 ? " section" : " sections"));
    if (summary) buildSummaryLinks(summary, cards, name);

    var el = document.getElementById("rrra-count-" + name);
    if (el) setText(el, String(n));
    document.querySelectorAll("[data-rail-tab='"+name+"'] .dr-count, [data-rail-tab='"+name+"'] .door-count").forEach(function(c){
      setText(c, String(n));
    });
    return n;
  }

  function currentHub(){
    for (var i = 0; i < HUBS.length; i++) {
      var tab = tabPanel(HUBS[i]);
      if (!tab) continue;
      if (tab.getAttribute("aria-hidden") === "false" || tab.classList.contains("active") ||
          (tab.style && tab.style.display && tab.style.display !== "none" && !tab.hidden)) {
        /* prefer visible */
        var st = window.getComputedStyle ? window.getComputedStyle(tab) : null;
        if (st && st.display === "none") continue;
        if (!tab.hidden) return HUBS[i];
      }
    }
    /* hash fallback */
    var h = (location.hash || "").replace(/^#/, "");
    if (HUBS.indexOf(h) >= 0) return h;
    if (h === "notes" || h === "vault" || h === "amana") return "notes";
    return "reminder";
  }

  function refreshAll(){
    HUBS.forEach(updateHub);
    markRailActive(currentHub());
  }

  function boot(){
    refreshAll();
    setTimeout(refreshAll, 500);
    setTimeout(refreshAll, 1500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(refreshAll, 400); });

  document.addEventListener("click", function(ev){
    var b = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], [data-rrra]");
    if (!b) return;
    var name = b.getAttribute("data-rail-tab") || b.getAttribute("data-rrra") || "";
    setTimeout(function(){
      refreshAll();
      if (name) markRailActive(name);
    }, 60);
    setTimeout(refreshAll, 350);
  }, true);

  window.clarityRrraRefreshMeta = refreshAll;
  window.clarityRrraPolishCounts = refreshAll;
  window.clarityRrraUpdateCounts = refreshAll;
  window.clarityRrraJump = jumpTo;
})();