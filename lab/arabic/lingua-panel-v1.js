/**
 * Arabic studio · Lingua translate + talk panel
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_AR_LINGUA_PANEL_V1__) return;
  g.__CU_AR_LINGUA_PANEL_V1__ = true;

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function mount() {
    var host = el("ar-lingua-root");
    if (!host) return;
    host.innerHTML =
      '<section class="cu-plaque" style="margin:1rem 0">' +
      "<strong>Translate · EN ↔ AR</strong>" +
      '<p class="cu-meta">Offline pack first · network assist if needed. Educational only — not a fatwa.</p>' +
      '<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:.4rem;align-items:center;margin:.5rem 0">' +
      '<select id="ar-ling-src" style="min-height:42px;border-radius:10px;padding:.35rem"><option value="en">English</option><option value="ar">Arabic</option><option value="ur">Urdu</option></select>' +
      '<button type="button" id="ar-ling-swap" style="min-height:42px;min-width:42px;border-radius:10px">⇄</button>' +
      '<select id="ar-ling-tgt" style="min-height:42px;border-radius:10px;padding:.35rem"><option value="ar">Arabic</option><option value="en">English</option><option value="ur">Urdu</option></select>' +
      "</div>" +
      '<textarea id="ar-ling-in" rows="3" placeholder="Type a phrase…" style="width:100%;border-radius:12px;padding:.65rem;border:1px solid rgba(201,162,39,.35);background:transparent;color:inherit"></textarea>' +
      '<div id="ar-ling-out" class="cu-plaque" style="min-height:3rem;margin:.5rem 0;white-space:pre-wrap" lang="ar"></div>' +
      '<p style="display:flex;flex-wrap:wrap;gap:.4rem">' +
      '<button type="button" id="ar-ling-go" style="min-height:42px;padding:.4rem .9rem;border-radius:999px;border:0;background:#467C45;color:#fff;font-weight:700">Translate</button>' +
      '<button type="button" id="ar-ling-speak" style="min-height:42px;padding:.4rem .9rem;border-radius:999px">Listen</button>' +
      '<button type="button" id="ar-ling-clear" style="min-height:42px;padding:.4rem .9rem;border-radius:999px">Clear</button>' +
      "</p>" +
      '<p class="cu-meta" id="ar-ling-status"></p>' +
      "</section>" +
      '<section class="cu-plaque" style="margin:1rem 0">' +
      "<strong>Conversation practice</strong>" +
      '<p class="cu-meta">Short turns on this device. Not a teacher replacement.</p>' +
      '<div id="ar-talk-thread" style="min-height:6rem;max-height:14rem;overflow:auto;margin:.4rem 0"></div>' +
      '<p style="display:flex;flex-wrap:wrap;gap:.4rem;align-items:center">' +
      '<select id="ar-talk-who" style="min-height:42px;border-radius:10px"><option value="A">Learner</option><option value="B">Partner</option></select>' +
      '<input id="ar-talk-in" type="text" placeholder="Say something…" style="flex:1;min-width:10rem;min-height:42px;border-radius:10px;padding:.4rem .65rem;border:1px solid rgba(201,162,39,.35);background:transparent;color:inherit"/>' +
      '<button type="button" id="ar-talk-send" style="min-height:42px;padding:.4rem .9rem;border-radius:999px;border:0;background:#467C45;color:#fff;font-weight:700">Send</button>' +
      '<button type="button" id="ar-talk-clear" style="min-height:42px;padding:.4rem .9rem;border-radius:999px">Clear</button>' +
      "</p></section>";

    wire();
    paintTalk();
  }

  function setStatus(msg) {
    var s = el("ar-ling-status");
    if (s) s.textContent = msg || "";
  }

  async function doTranslate() {
    var text = (el("ar-ling-in") && el("ar-ling-in").value) || "";
    var sl = (el("ar-ling-src") && el("ar-ling-src").value) || "en";
    var tl = (el("ar-ling-tgt") && el("ar-ling-tgt").value) || "ar";
    if (!text.trim()) {
      setStatus("Enter a phrase.");
      return;
    }
    setStatus("Translating…");
    var res = { text: "", source: "none" };
    if (g.CuLinguaApi && g.CuLinguaApi.translateSmart) {
      res = await g.CuLinguaApi.translateSmart(text, sl, tl);
    } else if (g.CuLinguaOffline) {
      var off = g.CuLinguaOffline.translate(text, sl, tl);
      res = { text: off || "", source: off ? "offline" : "none" };
    }
    var out = el("ar-ling-out");
    if (out) {
      out.textContent = res.text || "(no offline match — try shorter phrase or allow network)";
      out.setAttribute("lang", tl === "ar" ? "ar" : tl === "ur" ? "ur" : "en");
    }
    setStatus(
      res.source === "offline"
        ? "Offline pack"
        : res.source === "network"
          ? "Network assist"
          : "No translation found"
    );
  }

  function paintTalk() {
    var box = el("ar-talk-thread");
    if (!box || !g.CuLinguaTalk) return;
    var list = g.CuLinguaTalk.load();
    if (!list.length) {
      box.innerHTML = '<p class="cu-meta">No turns yet.</p>';
      return;
    }
    box.innerHTML = list
      .map(function (m) {
        return (
          '<div class="cu-plaque" style="margin:.3rem 0;padding:.45rem .65rem">' +
          "<strong>" +
          (m.speaker === "B" ? "Partner" : "Learner") +
          "</strong> · " +
          esc(m.text) +
          "</div>"
        );
      })
      .join("");
    box.scrollTop = box.scrollHeight;
  }

  function wire() {
    el("ar-ling-go") && el("ar-ling-go").addEventListener("click", doTranslate);
    el("ar-ling-swap") &&
      el("ar-ling-swap").addEventListener("click", function () {
        var a = el("ar-ling-src");
        var b = el("ar-ling-tgt");
        if (!a || !b) return;
        var t = a.value;
        a.value = b.value;
        b.value = t;
      });
    el("ar-ling-speak") &&
      el("ar-ling-speak").addEventListener("click", function () {
        var out = el("ar-ling-out");
        var tl = (el("ar-ling-tgt") && el("ar-ling-tgt").value) || "ar";
        if (g.CuLinguaTts && out) g.CuLinguaTts.speak(out.textContent, tl);
      });
    el("ar-ling-clear") &&
      el("ar-ling-clear").addEventListener("click", function () {
        if (el("ar-ling-in")) el("ar-ling-in").value = "";
        if (el("ar-ling-out")) el("ar-ling-out").textContent = "";
        setStatus("");
      });
    el("ar-talk-send") &&
      el("ar-talk-send").addEventListener("click", function () {
        var who = (el("ar-talk-who") && el("ar-talk-who").value) || "A";
        var inp = el("ar-talk-in");
        var text = (inp && inp.value) || "";
        if (!text.trim() || !g.CuLinguaTalk) return;
        g.CuLinguaTalk.add(who, text.trim(), "en");
        if (inp) inp.value = "";
        paintTalk();
      });
    el("ar-talk-clear") &&
      el("ar-talk-clear").addEventListener("click", function () {
        if (g.CuLinguaTalk) g.CuLinguaTalk.clear();
        paintTalk();
      });
    // Allow Hajj bridge to fill translate
    g.CuArLinguaFill = function (en, ar) {
      if (el("ar-ling-src")) el("ar-ling-src").value = "en";
      if (el("ar-ling-tgt")) el("ar-ling-tgt").value = "ar";
      if (el("ar-ling-in")) el("ar-ling-in").value = en || "";
      if (el("ar-ling-out")) {
        el("ar-ling-out").textContent = ar || "";
        el("ar-ling-out").setAttribute("lang", "ar");
      }
      setStatus("Loaded from Hajj phrases");
    };
  }

  function boot() {
    mount();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
