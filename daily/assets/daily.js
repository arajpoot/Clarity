
(function(){
  var KEY_PROV="clarity_provision_day_v1";
  var KEY_TAS="clarity_cph_tasbeeh_v1";
  var KEY_HIST="clarity_daily_history_v1";
  var KEY_ADH="clarity_daily_adhkar_v1";
  var PROVISIONS=[
    {lane:"jariyah",text:"Do one small ongoing good: teach something useful, water a plant, or give a quiet sadaqah."},
    {lane:"knowledge",text:"Learn or share one beneficial sentence from the Qur'an or Sunnah with sincerity."},
    {lane:"dua",text:"Make du'a for your parents or a deceased relative."},
    {lane:"rights",text:"Settle or note one right: a debt, a trust, or an apology you still owe."},
    {lane:"salah",text:"Pray the next salah on time with presence; say Bismillah before your next ordinary task."},
    {lane:"character",text:"Guard the tongue for one hour: no mockery, no gossip; replace with istighfar."}
  ];
  var ADHKAR={
    morning:[
      {id:"m1",ar:"اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",en:"O Allah, by You we enter the morning and by You the evening, by You we live and die, and to You is the resurrection.",ref:"Tirmidhi 3391 · educational",target:1},
      {id:"m2",ar:"أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",en:"We have entered the morning and the dominion belongs to Allah, and all praise is for Allah.",ref:"Abu Dawud 5068 · educational",target:1},
      {id:"m3",ar:"بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",en:"In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",ref:"Abu Dawud 5088 · often 3× · educational",target:3}
    ],
    evening:[
      {id:"e1",ar:"اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",en:"O Allah, by You we enter the evening and by You the morning, by You we live and die, and to You is the return.",ref:"Tirmidhi 3391 · educational",target:1},
      {id:"e2",ar:"أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",en:"We have entered the evening and the dominion belongs to Allah, and all praise is for Allah.",ref:"Abu Dawud 5068 · educational",target:1},
      {id:"e3",ar:"أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",en:"I seek refuge in the perfect words of Allah from the evil of what He created.",ref:"Muslim 2708 · educational",target:3}
    ]
  };
  function today(){var d=new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}
  function read(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}}
  function write(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i);return h}
  function period(){var h=new Date().getHours();if(h<5)return "Night";if(h<12)return "Morning";if(h<15)return "Midday";if(h<18)return "Afternoon";if(h<21)return "Evening";return "Night"}
  function evening(){var h=new Date().getHours();return h>=15||h<5}
  var day=today();
  var prov=read(KEY_PROV); if(!prov||prov.day!==day){var p=PROVISIONS[Math.abs(hash(day))%PROVISIONS.length];prov={day:day,lane:p.lane,text:p.text,done:false};write(KEY_PROV,prov)}
  var pack=evening()?ADHKAR.evening:ADHKAR.morning;
  var tas=read(KEY_TAS)||{}; if(tas.day!==day) tas={day:day,count:0};
  var adh=read(KEY_ADH)||{}; if(adh.day!==day) adh={day:day,counts:{}};
  var hist=read(KEY_HIST)||[];

  document.getElementById("d-period").textContent=period()+" · "+(evening()?"evening set":"morning set");
  document.getElementById("d-deed").textContent=prov.text;
  document.getElementById("d-done").textContent=prov.done?"Done today":"Not marked";
  document.getElementById("d-tas").textContent=tas.count||0;

  var list=document.getElementById("d-adhkar");
  pack.forEach(function(item){
    var n=(adh.counts&&adh.counts[item.id])||0;
    var card=document.createElement("div");
    card.className="card";
    card.innerHTML='<p class="ar"></p><p class="en"></p><p class="muted"></p><p>Count <strong></strong> / '+item.target+'</p><button type="button">+1</button>';
    card.querySelector(".ar").textContent=item.ar;
    card.querySelector(".en").textContent=item.en;
    card.querySelector(".muted").textContent=item.ref;
    card.querySelector("strong").textContent=n;
    card.querySelector("button").onclick=function(){
      adh.counts=adh.counts||{}; adh.counts[item.id]=(adh.counts[item.id]||0)+1; write(KEY_ADH,adh);
      card.querySelector("strong").textContent=adh.counts[item.id];
    };
    list.appendChild(card);
  });

  document.getElementById("d-mark").onclick=function(){
    prov.done=true; write(KEY_PROV,prov);
    hist=hist.filter(function(h){return h.day!==day});
    hist.unshift({day:day,text:prov.text,done:true});
    hist=hist.slice(0,7); write(KEY_HIST,hist);
    document.getElementById("d-done").textContent="Done today";
    paintHist();
  };
  document.getElementById("d-tas-inc").onclick=function(){tas.count=(tas.count||0)+1;write(KEY_TAS,tas);document.getElementById("d-tas").textContent=tas.count};
  document.getElementById("d-tas-reset").onclick=function(){tas={day:day,count:0};write(KEY_TAS,tas);document.getElementById("d-tas").textContent=0};
  function paintHist(){
    var box=document.getElementById("d-hist");
    box.innerHTML="";
    (read(KEY_HIST)||[]).forEach(function(h){
      var p=document.createElement("p");
      p.textContent=h.day+" · "+(h.done?"done":"open")+" · "+h.text;
      box.appendChild(p);
    });
    if(!box.innerHTML) box.innerHTML="<p class='muted'>No history yet. Mark today when you finish.</p>";
  }
  paintHist();
})();
