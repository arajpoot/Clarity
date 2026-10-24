
(function(){
  "use strict";
  var RULES = [
    { id:"makharij", pic:"🗣", name:"Makhārij", ar:"مخارج",
      detail:"<strong>Makhārij (مخارج)</strong> — the exit points of letters. Master throat, tongue, lips, and teeth zones before heavy rule stacking.",
      ex:"Practice each letter slowly: ا ح ع خ · ق ك · ت د ط · ف ب م و",
      yt:"exbOt_P6sRU", ytLabel:"Makhaarij & Sifaat overview",
      audio:"https://everyayah.com/data/Husary_128kbps/001001.mp3", audioLabel:"Al-Fātiḥah 1 (Ḥuṣarī)" },
    { id:"izhar", pic:"💎", name:"Iẓhār", ar:"إظهار",
      detail:"<strong>Iẓhār (إظهار)</strong> — make nūn sākinah / tanwīn clear before throat letters: ء ه ع ح غ خ. No nasal merge.",
      ex:"Example feel: مِنْ آمَنَ — the nūn stays clear.",
      yt:"fBMn9kNDRpo", ytLabel:"Iẓhār lesson (Easy Way)",
      audio:"https://everyayah.com/data/Husary_128kbps/002062.mp3", audioLabel:"Sample āyah (Ḥuṣarī)" },
    { id:"ikhfa", pic:"🌫", name:"Ikhfāʾ", ar:"إخفاء",
      detail:"<strong>Ikhfāʾ (إخفاء)</strong> — hide nūn/tanwīn before the 15 ikhfāʾ letters with a light ghunnah (غُنّة). Tongue does not fully touch.",
      ex:"Feel the soft nasal cloud before ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك.",
      yt:"VP_cm3eypJ8", ytLabel:"Nūn rules lesson",
      audio:"https://everyayah.com/data/Husary_128kbps/001002.mp3", audioLabel:"Al-Fātiḥah 2 (Ḥuṣarī)" },
    { id:"idgham", pic:"🔗", name:"Idghām", ar:"إدغام",
      detail:"<strong>Idghām (إدغام)</strong> — merge nūn/tanwīn into ي ن م و (with ghunnah) or ل ر (without). Hold two counts of nasal when required.",
      ex:"مِنْ رَبِّهِمْ — merge into the rāʾ; مِنْ مَاءٍ — merge with ghunnah into mīm.",
      yt:"VP_cm3eypJ8", ytLabel:"Idghām lesson",
      audio:"https://everyayah.com/data/Husary_128kbps/001007.mp3", audioLabel:"Al-Fātiḥah 7 (Ḥuṣarī)" },
    { id:"iqlab", pic:"🔄", name:"Iqlāb", ar:"إقلاب",
      detail:"<strong>Iqlāb (إقلاب)</strong> — nūn sākinah / tanwīn before ب turns into a light mīm sound with ghunnah.",
      ex:"مِنْ بَعْدِ — becomes like a soft mīm + ghunnah before bāʾ.",
      yt:"fBMn9kNDRpo", ytLabel:"Nūn sākinah family",
      audio:"https://everyayah.com/data/Husary_128kbps/002004.mp3", audioLabel:"Sample āyah (Ḥuṣarī)" },
    { id:"qalqalah", pic:"⚡", name:"Qalqalah", ar:"قلقلة",
      detail:"<strong>Qalqalah (قلقلة)</strong> — bounce on ق ط ب ج د when sākin. Echo without adding a full vowel.",
      ex:"قَدْ أَفْلَحَ — light bounce on dāl; stronger at stop (qalqalah kubrā).",
      yt:"r4sFQ1-1GWE", ytLabel:"Articulation / heavy letters",
      audio:"https://everyayah.com/data/Husary_128kbps/023001.mp3", audioLabel:"Qad aflaḥa (Ḥuṣarī)" },
    { id:"ghunnah", pic:"👃", name:"Ghunnah", ar:"غُنّة",
      detail:"<strong>Ghunnah (غُنّة)</strong> — nasal sound held two counts on nūn/mīm mushaddadah, and in idghām/ikhfāʾ/iqlāb as required.",
      ex:"إِنَّ · ثُمَّ — feel the nose, not the throat.",
      yt:"9BkGqaU3I2g", ytLabel:"Ṣifāt & nasal qualities",
      audio:"https://everyayah.com/data/Husary_128kbps/112001.mp3", audioLabel:"Al-Ikhlāṣ (Ḥuṣarī)" },
    { id:"madd", pic:"⏳", name:"Madd", ar:"مدّ",
      detail:"<strong>Madd (مدّ)</strong> — lengthen vowels. Ṭabīʿī = 2 counts; muttasil/munfasil often 4–5; lāzim = 6 when permanent sukūn follows.",
      ex:"Count on fingers while listening to Al-Ḥuṣarī until the length feels natural.",
      yt:"BEtV5xMXsPY", ytLabel:"Long vowels / madd",
      audio:"https://everyayah.com/data/Husary_128kbps/001001.mp3", audioLabel:"Al-Fātiḥah 1 — madd feel" },
    { id:"waqf", pic:"🛑", name:"Waqf", ar:"وقف",
      detail:"<strong>Waqf (وقف)</strong> — stop where meaning stays safe. Learn common signs (م · ط · ج · ز · لا) and prefer meaning over convenience.",
      ex:"Never cut a phrase so the meaning reverses. When unsure, continue to a clearer pause.",
      yt:"u4gyqlxDRa0", ytLabel:"Stop & pause signs",
      audio:"https://everyayah.com/data/Husary_128kbps/001007.mp3", audioLabel:"Al-Fātiḥah end (Ḥuṣarī)" }
  ];

  function mediaButtons(rule, frameId){
    var html = '<div class="tj-media-row">';
    if (rule.yt) {
      html += '<button type="button" class="btn-soft tj-yt-btn" data-yt="'+rule.yt+'" data-frame="'+frameId+'">▶ Video · '+(rule.ytLabel||'Lesson')+'</button>';
    }
    if (rule.audio) {
      html += '<button type="button" class="btn-soft tj-audio-btn" data-audio="'+rule.audio+'" data-frame="'+frameId+'">🔊 Audio · '+(rule.audioLabel||'Example')+'</button>';
    }
    html += '</div><div class="tj-media-frame" id="'+frameId+'" hidden></div>';
    return html;
  }

  function bindMedia(root){
    if (!root) return;
    root.querySelectorAll(".tj-yt-btn").forEach(function(b){
      b.addEventListener("click", function(ev){
        ev.stopPropagation();
        var id = b.getAttribute("data-yt");
        var fid = b.getAttribute("data-frame") || "tj-media-frame";
        var frame = document.getElementById(fid);
        if (!frame || !id) return;
        frame.hidden = false;
        frame.innerHTML = "";
        var wrap = document.createElement("div");
        wrap.className = "tj-embed-wrap";
        var iframe = document.createElement("iframe");
        iframe.loading = "lazy";
        iframe.allowFullscreen = true;
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        iframe.title = "Tajweed lesson";
        iframe.src = "https://www.youtube-nocookie.com/embed/"+id+"?rel=0";
        wrap.appendChild(iframe);
        frame.appendChild(wrap);
        var stop = document.createElement("button");
        stop.type = "button";
        stop.className = "btn-secondary";
        stop.style.cssText = "margin-top:0.35rem;font-size:0.78rem";
        stop.textContent = "Stop video";
        stop.addEventListener("click", function(){ frame.hidden = true; frame.innerHTML = ""; });
        frame.appendChild(stop);
      });
    });
    root.querySelectorAll(".tj-audio-btn").forEach(function(b){
      b.addEventListener("click", function(ev){
        ev.stopPropagation();
        var src = b.getAttribute("data-audio");
        var fid = b.getAttribute("data-frame") || "tj-media-frame";
        var frame = document.getElementById(fid);
        if (!frame || !src) return;
        frame.hidden = false;
        frame.innerHTML = "";
        var audio = document.createElement("audio");
        audio.controls = true;
        audio.autoplay = true;
        audio.src = src;
        audio.style.width = "100%";
        frame.appendChild(audio);
        var hint = document.createElement("p");
        hint.className = "tj-tool-hint";
        hint.textContent = "Audio via EveryAyah (Ḥuṣarī). Compare your recitation after listening once.";
        frame.appendChild(hint);
        var stop = document.createElement("button");
        stop.type = "button";
        stop.className = "btn-secondary";
        stop.style.cssText = "margin-top:0.35rem;font-size:0.78rem";
        stop.textContent = "Stop audio";
        stop.addEventListener("click", function(){ try{ audio.pause(); }catch(e){} frame.hidden = true; frame.innerHTML = ""; });
        frame.appendChild(stop);
      });
    });
  }

  function renderRuleTiles(){
    var grid = document.getElementById("tj-rule-grid");
    if (!grid) return;
    grid.innerHTML = RULES.map(function(r){
      return '<button type="button" class="tj-rule-tile" data-rule="'+r.id+'" aria-expanded="false">' +
        '<span class="tj-rule-pic" aria-hidden="true">'+r.pic+'</span>' +
        '<span class="tj-rule-name">'+r.name+'</span>' +
        '<span class="tj-rule-ar">'+r.ar+'</span>' +
        '</button>';
    }).join("") + '<div class="tj-rule-detail" id="tj-rule-detail" hidden></div>';

    grid.querySelectorAll(".tj-rule-tile").forEach(function(btn){
      btn.addEventListener("click", function(){
        var id = btn.getAttribute("data-rule");
        var rule = RULES.find(function(x){ return x.id === id; });
        var detail = document.getElementById("tj-rule-detail");
        if (!rule || !detail) return;
        var wasOpen = btn.classList.contains("open");
        grid.querySelectorAll(".tj-rule-tile").forEach(function(b){
          b.classList.remove("open");
          b.setAttribute("aria-expanded","false");
        });
        if (wasOpen) {
          detail.classList.remove("show");
          detail.hidden = true;
          detail.innerHTML = "";
          return;
        }
        btn.classList.add("open");
        btn.setAttribute("aria-expanded","true");
        detail.innerHTML = rule.detail +
          (rule.ex ? '<div class="tj-ex">'+rule.ex+'</div>' : '') +
          mediaButtons(rule, "tj-media-frame");
        detail.hidden = false;
        detail.classList.add("show");
        bindMedia(detail);
      });
    });
  }

  var flashIdx = -1;
  window.tjFlashNext = function(){
    flashIdx = (flashIdx + 1) % RULES.length;
    var r = RULES[flashIdx];
    var front = document.getElementById("tj-flash-front");
    var tip = document.getElementById("tj-flash-tip");
    if (front) front.textContent = r.name + "  ·  " + r.ar;
    if (tip) { tip.hidden = true; tip.innerHTML = ""; }
  };
  window.tjFlashReveal = function(){
    if (flashIdx < 0) window.tjFlashNext();
    var r = RULES[flashIdx];
    var tip = document.getElementById("tj-flash-tip");
    if (!tip || !r) return;
    tip.innerHTML = r.detail +
      (r.ex ? '<div class="tj-ex">'+r.ex+'</div>' : '') +
      mediaButtons(r, "tj-flash-media");
    tip.hidden = false;
    bindMedia(tip);
  };

  function boot(){
    renderRuleTiles();
    if (typeof tjRender === "function") {
      try { tjRender(); } catch(e){}
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 100); });
  else setTimeout(boot, 100);
  window.addEventListener("load", function(){ setTimeout(boot, 300); });
})();
