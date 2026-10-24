(function(){
  "use strict";
  if (window.__CLARITY_MEME_PUSH_CARDS__) return;
  window.__CLARITY_MEME_PUSH_CARDS__ = true;

  function hasAr(s){ return /[\u0600-\u06FF]/.test(s || ""); }

  window.clarityMemeFromCommand = function(){
    var box = document.getElementById("command-box");
    if (!box) return;
    var arEl = box.querySelector(".arabic-calligraphy .tts-body, .arabic-calligraphy, .arabic, [lang='ar']");
    var ar = arEl ? arEl.textContent : "";
    var en = "";
    box.querySelectorAll("p").forEach(function(p){
      if (en) return;
      var t = (p.textContent || "").trim();
      if (t && !hasAr(t) && t.length > 20 && !/educational|recommended|live the command/i.test(t)) en = t;
    });
    var ref = "";
    var m = (box.textContent || "").match(/Qur['']?\s*[aā]?n?\s*\d+:\d+/i) || (box.textContent || "").match(/\b\d+:\d+\b/);
    if (m) ref = m[0];
    if (typeof clarityMemePush === "function") clarityMemePush(ar, en, ref);
  };

  window.clarityMemeFromHadith = function(){
    var box = document.getElementById("hadith");
    if (!box) return;
    var arEl = box.querySelector(".arabic, [lang='ar']");
    var ar = arEl ? arEl.textContent : "";
    var en = "";
    box.querySelectorAll("p").forEach(function(p){
      if (en) return;
      var t = (p.textContent || "").trim().replace(/^["“]|["”]$/g, "");
      if (t && !hasAr(t) && t.length > 20 && !/educational|verify|pondering/i.test(t)) en = t;
    });
    var coll = box.querySelector(".hadith-coll-pill");
    var num = box.querySelector(".hadith-num-pill");
    var ref = [(coll && coll.textContent || "").replace(/^📚\s*/, "").trim(),
               (num && num.textContent || "").trim()].filter(Boolean).join(" · ");
    if (typeof clarityMemePush === "function") clarityMemePush(ar, en, ref || "Hadith");
  };

  window.memeFromCommand = function(){ if (typeof clarityMemeFromCommand === "function") clarityMemeFromCommand(); };

  function addButtons(){
    document.querySelectorAll(".card").forEach(function(card){
      if (card.querySelector(".clarity-meme-btn")) return;
      if (card.id === "meme-card" || (card.closest && card.closest("#meme-card"))) return;
      if (card.querySelector("#meme-canvas, #callig-canvas")) return;
      var txt = card.textContent || "";
      var has = card.querySelector(".arabic-calligraphy, .arabic, [dir='rtl']") || /\d+:\d+/.test(txt) || /Hadith|Qur.?an|Prophet/i.test(txt);
      if (!has) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-soft clarity-meme-btn";
      btn.textContent = "🎨 Meme";
      btn.addEventListener("click", function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        if (card.id === "hadith" || card.querySelector("#hadith")) { clarityMemeFromHadith(); return; }
        if (card.id === "command-box" || card.querySelector("#command-box")) { clarityMemeFromCommand(); return; }
        var arEl = card.querySelector(".arabic-calligraphy .tts-body, .arabic-calligraphy, .arabic, [lang='ar']");
        var ar = arEl ? arEl.textContent : "";
        var en = "";
        card.querySelectorAll("p").forEach(function(p){
          if (en) return;
          var t = (p.textContent || "").trim();
          if (t && !hasAr(t) && t.length > 20 && !/educational|pondering|verify/i.test(t)) en = t;
        });
        var ref = "";
        var m = txt.match(/Qur['']?\s*[aā]?n?\s*\d+:\d+/i) || txt.match(/\b\d+:\d+\b/);
        if (m) ref = m[0];
        if (ar || en) clarityMemePush(ar, en, ref);
      });
      var row = card.querySelector(".command-status, .card-actions");
      if (row) row.appendChild(btn);
      else card.appendChild(btn);
    });
  }

  function boot(){ addButtons(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 600); });
  else setTimeout(boot, 600);
  window.addEventListener("load", function(){ setTimeout(boot, 1200); });
})();