/**
 * P11 AI Study Buddy — search + chat
 * On-device retrieval over campus knowledge. Optional remote endpoint.
 * Educational only — not a mufti, not a fatwa service.
 */
(function (g) {
  "use strict";
  if (g.__CU_BUDDY_V1__) return;
  g.__CU_BUDDY_V1__ = true;

  var HISTORY_KEY = "cu_buddy_chat_v1";
  var ENDPOINT_KEY = "cu_buddy_endpoint_v1"; /* optional POST {message, context} -> {reply} */

  var KB = [
    {t:"Charter & admission", k:"charter admit admission university limits fatwa", href:"/charter/", blurb:"Who the path is for, what it never does, on-device admission."},
    {t:"Journey Map", k:"map phase seeker practice consistency transmission path", href:"/campus/", blurb:"Campus directory after admission."},
    {t:"Seeker desk", k:"seeker junior belief allah aqidah foundations module", href:"/campus/desk/seeker/", blurb:"Belief foundations — one module at a time."},
    {t:"Practice desk", k:"practice new muslim salah prayer pillars", href:"/campus/desk/practice/", blurb:"New Muslim practice path after Junior quiz."},
    {t:"Consistency desk", k:"consistency daily itqan steady craft review", href:"/campus/desk/consistency/", blurb:"Steady craft and review."},
    {t:"Transmission desk", k:"transmission share dawah source adab", href:"/campus/desk/transmission/", blurb:"Share with adab and clear sources."},
    {t:"Arabic lab", k:"arabic flashcard vocabulary language rosetta", href:"/lab/arabic/", blurb:"Flash and match — everyday and salah lexicon."},
    {t:"Tajweed lab", k:"tajweed recite quran pronunciation rule", href:"/lab/tajweed/", blurb:"Tajweed practice studio."},
    {t:"Recite lab", k:"recite hifz memorization ayah", href:"/lab/recite/", blurb:"Recitation practice."},
    {t:"Library shelves", k:"library quran sunnah hadith nawawi tafsir external", href:"/library/", blurb:"Pointers to Quran.com, Sunnah.com, and campus bridges."},
    {t:"Qur'an external", k:"quran read listen translation tafsir", href:"https://quran.com", blurb:"Primary mushaf tools (external).", ext:1},
    {t:"Hadith external", k:"hadith sunnah nawawi forty bukhari muslim", href:"https://sunnah.com/nawawi40", blurb:"Nawawi 40 and Sunnah.com (external).", ext:1},
    {t:"Transcript", k:"transcript progress track modules labs", href:"/campus/transcript/", blurb:"Local learning record."},
    {t:"Assignments", k:"assignment homework weekly practice tick", href:"/campus/assignments/", blurb:"Weekly practice checklist."},
    {t:"Schedule", k:"schedule week plan rhythm study time", href:"/campus/schedule/", blurb:"Calm week rhythm."},
    {t:"Diploma Hall", k:"diploma certificate completion award", href:"/campus/diploma/", blurb:"On-device educational certificates."},
    {t:"Amana Vault", k:"vault amana faraid mirath inheritance family", href:"/vault/", blurb:"Educational literacy tools — not legal advice."},
    {t:"Lab home", k:"lab craft skill practice station", href:"/lab/", blurb:"All craft laboratories."}
  ];

  function norm(s){ return String(s||"").toLowerCase().replace(/[^\w\s'’-]/g," ").replace(/\s+/g," ").trim(); }

  function search(q){
    q=norm(q);
    if(!q) return KB.slice(0,6);
    var terms=q.split(" ").filter(Boolean);
    return KB.map(function(item){
      var hay=norm(item.t+" "+item.k+" "+item.blurb);
      var score=0;
      terms.forEach(function(t){ if(hay.indexOf(t)>=0) score+=1; if((item.t+"").toLowerCase().indexOf(t)>=0) score+=2; });
      return {item:item, score:score};
    }).filter(function(x){return x.score>0;})
      .sort(function(a,b){return b.score-a.score;})
      .slice(0,8)
      .map(function(x){return x.item;});
  }

  function localReply(message){
    var q=norm(message);
    var hits=search(message);
    /* safety refusals */
    if(/\b(fatwa|halal or haram|am i sinful|divorce ruling|inheritance share for)\b/.test(q)){
      return {
        text:"I cannot issue a ruling or fatwa. For personal fiqh, ask a qualified local scholar. I can point you to learning modules and primary-text libraries only.",
        links:[{href:"/library/",t:"Library shelves"},{href:"/charter/",t:"Charter limits"}]
      };
    }
    if(/\b(how do i pray|how to pray|wudu steps|make wudu)\b/.test(q)){
      return {
        text:"For prayer and wuḍūʾ, learn with a teacher when you can. On campus: Practice desk after Junior unlock, Arabic ṣalāh lexicon, and Library fiqh shelf as pointers — not a substitute for demonstrated prayer.",
        links:[{href:"/campus/desk/practice/",t:"Practice desk"},{href:"/lab/arabic/?deck=salah",t:"Arabic · ṣalāh words"},{href:"/library/#fiqh",t:"Fiqh shelf"}]
      };
    }
    if(!hits.length){
      return {
        text:"I did not find a strong campus match. Try: Seeker, Tajweed, Arabic, transcript, or open the Library for Quran.com / Sunnah.com.",
        links:[{href:"/library/",t:"Library"},{href:"/campus/desk/seeker/",t:"Seeker desk"},{href:"/charter/",t:"Charter"}]
      };
    }
    var top=hits[0];
    var more=hits.slice(0,3).map(function(h){return h.t;}).join(" · ");
    return {
      text:"Closest campus help: "+top.t+". "+top.blurb+" Related: "+more+". Always verify Qur’an and Sunnah with primary sources; I am not a scholar.",
      links:hits.slice(0,4).map(function(h){return {href:h.href,t:h.t};})
    };
  }

  function getEndpoint(){
    try{ return (localStorage.getItem(ENDPOINT_KEY)||"").trim(); }catch(e){ return ""; }
  }

  function loadHistory(){
    try{ return JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]"); }catch(e){ return []; }
  }
  function saveHistory(arr){
    try{ localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(-40))); }catch(e){}
  }

  function el(id){ return document.getElementById(id); }

  function renderHits(list){
    var box=el("cu-buddy-hits");
    if(!box) return;
    if(!list.length){ box.innerHTML='<p class="cu-meta">No matches.</p>'; return; }
    box.innerHTML=list.map(function(h){
      var ext=h.ext?' target="_blank" rel="noopener noreferrer"':'';
      return '<a class="cu-buddy-hit" href="'+h.href+'"'+ext+'><strong>'+h.t+(h.ext?" · external":"")+'</strong><span>'+h.blurb+'</span></a>';
    }).join("");
  }

  function appendMsg(role, text, links){
    var log=el("cu-buddy-log");
    if(!log) return;
    var d=document.createElement("div");
    d.className="cu-buddy-msg "+role;
    d.textContent=text;
    if(links&&links.length){
      var s=document.createElement("span");
      s.className="src";
      s.innerHTML=links.map(function(l){
        var ext=/^https?:/i.test(l.href)?' target="_blank" rel="noopener noreferrer"':'';
        return '<a href="'+l.href+'"'+ext+'>'+l.t+'</a>';
      }).join(" · ");
      d.appendChild(s);
    }
    log.appendChild(d);
    log.scrollTop=log.scrollHeight;
  }

  function paintHistory(){
    var log=el("cu-buddy-log");
    if(!log) return;
    log.innerHTML="";
    var h=loadHistory();
    if(!h.length){
      appendMsg("bot","Assalamu alaykum. Search campus tools or ask where to study next. I point to modules and primary-text libraries — I do not issue fatwas.",
        [{href:"/charter/",t:"Charter"},{href:"/campus/desk/seeker/",t:"Seeker"}]);
      return;
    }
    h.forEach(function(m){ appendMsg(m.role, m.text, m.links); });
  }

  function respond(message){
    var endpoint=getEndpoint();
    appendMsg("user", message);
    var hist=loadHistory();
    hist.push({role:"user",text:message});
    saveHistory(hist);

    function finish(reply){
      appendMsg("bot", reply.text, reply.links);
      var h2=loadHistory();
      h2.push({role:"bot",text:reply.text,links:reply.links||[]});
      saveHistory(h2);
      if(g.ClarityTranscript) try{ g.ClarityTranscript.log("buddy",{id:"chat",title:message.slice(0,60)}); }catch(e){}
    }

    if(endpoint){
      appendMsg("bot","…");
      var pending=el("cu-buddy-log")&&el("cu-buddy-log").lastChild;
      fetch(endpoint,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({message:message, context:{hits:search(message).slice(0,5), campus:"clarity-university"}})
      }).then(function(r){ return r.json(); }).then(function(j){
        if(pending) pending.remove();
        finish({text:(j.reply||j.text||"No reply from endpoint."), links:j.links||search(message).slice(0,3).map(function(h){return {href:h.href,t:h.t};})});
      }).catch(function(){
        if(pending) pending.remove();
        finish(localReply(message));
      });
      return;
    }
    finish(localReply(message));
  }

  function wire(){
    var si=el("cu-buddy-q");
    var sb=el("cu-buddy-search-btn");
    if(sb&&si){
      function runSearch(){ renderHits(search(si.value)); }
      sb.onclick=runSearch;
      si.addEventListener("keydown", function(e){ if(e.key==="Enter"){ e.preventDefault(); runSearch(); }});
    }
    var ci=el("cu-buddy-input");
    var cb=el("cu-buddy-send");
    function send(){
      var v=(ci&&ci.value||"").trim();
      if(!v) return;
      if(ci) ci.value="";
      respond(v);
    }
    if(cb) cb.onclick=send;
    if(ci) ci.addEventListener("keydown", function(e){ if(e.key==="Enter"){ e.preventDefault(); send(); }});
    document.querySelectorAll("[data-buddy-chip]").forEach(function(b){
      b.onclick=function(){ respond(b.getAttribute("data-buddy-chip")||b.textContent); };
    });
    var clr=el("cu-buddy-clear");
    if(clr) clr.onclick=function(){ try{localStorage.removeItem(HISTORY_KEY);}catch(e){} paintHistory(); };
    paintHistory();
    renderHits(KB.slice(0,5));
  }

  g.ClarityBuddy={search:search, respond:respond};
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})(typeof window!=="undefined"?window:this);
