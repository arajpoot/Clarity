/*! Yawm hub M8 — Day landing port · educational only — not a fatwa */
(function () {
  "use strict";
  var VER = "20261029M8";
  var KEY = {
    deed: "clarity.daily.deed.v1",
    tas: "clarity.daily.tasbeeh.v1",
    adh: "clarity.daily.adhkar.v1",
    note: "clarity.daily.vaultnote.v1"
  };
  function $(id) { return document.getElementById(id); }
  function load(k, fb) {
    try { var x = localStorage.getItem(k); return x ? JSON.parse(x) : fb; } catch (e) { return fb; }
  }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function dayKey() { return new Date().toDateString(); }
  function period() {
    var h = new Date().getHours();
    if (h >= 4 && h < 12) return "morning";
    if (h >= 12 && h < 17) return "afternoon";
    if (h >= 17 && h < 20) return "evening";
    return "night";
  }
  function isEvening() { return !(new Date().getHours() >= 4 && new Date().getHours() < 15); }

  var tg = $("theme-toggle");
  if (tg) tg.onclick = function () {
    var d = document.documentElement;
    var next = d.getAttribute("data-theme") === "light" ? "dark" : "light";
    d.setAttribute("data-theme", next);
    try { localStorage.setItem("clarity.daily.theme.v1", next); } catch (e) {}
  };
  try { var th = localStorage.getItem("clarity.daily.theme.v1"); if (th) document.documentElement.setAttribute("data-theme", th); } catch (e) {}

  function paintNow() {
    var el = $("yawm-now-label"); if (!el) return;
    var p = period();
    el.textContent = p.charAt(0).toUpperCase() + p.slice(1) + " · " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    var lane = $("yawm-now-lane");
    if (lane) lane.textContent = p === "morning" ? "Morning window — adhkār, intention, prepare the day." :
      (p === "evening" || p === "night") ? "Evening / night — adhkār, protect the heart, prepare the long stay." :
      "Afternoon — guard the prayer, keep a light tongue.";
  }

  var DEEDS_FB = [
    { period: "any", text: "One gentle word or act of service for family — raising hearts that may pray for you." },
    { period: "any", text: "Share one beneficial sentence from Qur'an or Sunnah with sincerity." },
    { period: "any", text: "Pray one ṣalāh with fuller calm in rukūʿ and sujūd." },
    { period: "night", text: "One gentle word or act of service for family — raising hearts that may pray for you." },
    { period: "evening", text: "Seek forgiveness with presence before sleep." }
  ];

  function paintDeed(list) {
    list = list || DEEDS_FB;
    var p = period();
    var pool = list.filter(function (d) { return d.period === "any" || d.period === p; });
    if (!pool.length) pool = list;
    var st = load(KEY.deed, {});
    if (st.day !== dayKey()) st = { day: dayKey(), i: Math.floor(Math.random() * pool.length), done: false };
    if (st.i >= pool.length) st.i = 0;
    var textEl = $("yawm-deed-text"), stEl = $("yawm-deed-status"), per = $("yawm-deed-period");
    if (per) per.textContent = p.toUpperCase();
    if (textEl) textEl.textContent = pool[st.i].text || pool[st.i];
    if (stEl) stEl.textContent = st.done ? "Marked done today" : "Not marked";
    save(KEY.deed, st);
    var mk = $("yawm-deed-mark");
    if (mk) mk.onclick = function () { st.done = true; save(KEY.deed, st); paintDeed(list); };
  }
  fetch("assets/data/deed-bank.json?v=20261029M8").then(function (r) { return r.json(); }).then(paintDeed).catch(function () { paintDeed(null); });

  function paintTas() {
    var n = 0; try { n = parseInt(localStorage.getItem(KEY.tas) || "0", 10) || 0; } catch (e) {}
    var el = $("yawm-tas-count"); if (el) el.textContent = n;
    var inc = $("yawm-tas-inc"), rst = $("yawm-tas-reset");
    if (inc) inc.onclick = function () { n++; try { localStorage.setItem(KEY.tas, String(n)); } catch (e) {} if (el) el.textContent = n; };
    if (rst) rst.onclick = function () { n = 0; try { localStorage.setItem(KEY.tas, "0"); } catch (e) {} if (el) el.textContent = n; };
  }

  function paintSalah() {
    var el = $("yawm-salah-name"), sub = $("yawm-salah-sub"); if (!el) return;
    var h = new Date().getHours();
    var names = ["Fajr", "Dhuhr", "ʿAṣr", "Maghrib", "ʿIshāʾ"];
    var approx = [5, 13, 16, 19, 21];
    var i = 0;
    for (var k = 0; k < approx.length; k++) { if (h < approx[k]) { i = k; break; } i = 0; }
    el.textContent = names[i];
    if (sub) sub.textContent = "Educational cue only — not a live mosque timetable. Use Companion banner for your city, or a local source.";
  }

  function paintAdhkar() {
    var evening = isEvening();
    var win = $("yawm-adh-window"); if (win) win.textContent = evening ? "evening" : "morning";
    var file = "assets/adhkar/" + (evening ? "evening" : "morning") + ".json?v=20261029M8";
    var list = $("yawm-adh-list"); if (!list) return;
    fetch(file).then(function (r) { return r.json(); }).then(function (data) {
      var items = data.items || [];
      var st = load(KEY.adh, {});
      if (st.day !== dayKey()) st = { day: dayKey(), c: {}, idx: 0 };
      if (typeof st.idx !== "number") st.idx = 0;
      function render() {
        list.innerHTML = "";
        var item = items[st.idx % items.length]; if (!item) return;
        var id = item.id || ("i" + st.idx);
        var need = item.count || 1;
        if (!st.c[id]) st.c[id] = 0;
        var done = 0;
        items.forEach(function (it, ix) { var iid = it.id || ("i" + ix); if ((st.c[iid] || 0) >= (it.count || 1)) done++; });
        var prog = $("yawm-adh-prog"); if (prog) prog.textContent = done + " / " + items.length;
        var card = document.createElement("div");
        card.className = "yawm-adh-item";
        card.innerHTML = '<p class="ar" dir="rtl" lang="ar"></p><p class="en"></p><p class="src"></p><p class="cnt">Count <b></b> / ' + need + '</p><p class="row"></p>';
        card.querySelector(".ar").textContent = item.ar || "";
        card.querySelector(".en").textContent = item.en || "";
        card.querySelector(".src").textContent = (item.source || "") + " · " + (item.grade || "") + (item.note ? " · " + item.note : "");
        card.querySelector("b").textContent = st.c[id] || 0;
        var row = card.querySelector(".row");
        function btn(label, cls, fn) {
          var b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = label; b.onclick = fn; return b;
        }
        row.appendChild(btn("+1 count", "btn", function () { st.c[id] = Math.min(need, (st.c[id] || 0) + 1); save(KEY.adh, st); render(); }));
        row.appendChild(btn("Next dhikr →", "btn ghost", function () { st.idx = (st.idx + 1) % items.length; save(KEY.adh, st); render(); }));
        row.appendChild(btn("↺", "btn ghost", function () { st.c[id] = 0; save(KEY.adh, st); render(); }));
        list.appendChild(card);
        save(KEY.adh, st);
      }
      render();
    }).catch(function () { list.innerHTML = "<p class='sub'>Adhkār pack unavailable — try refresh.</p>"; });
  }

  function paintNote() {
    var ta = $("yawm-note-text"), btn = $("yawm-note-save"), msg = $("yawm-note-msg");
    if (!btn) return;
    btn.onclick = function () {
      var v = ((ta && ta.value) || "").trim();
      if (!v) { if (msg) msg.textContent = "Write something first."; return; }
      var st = load(KEY.note, { items: [] });
      if (!Array.isArray(st.items)) st.items = [];
      st.items.push({ t: v, ts: new Date().toISOString() });
      if (st.items.length > 40) st.items = st.items.slice(-40);
      save(KEY.note, st);
      if (ta) ta.value = "";
      if (msg) msg.textContent = "Saved on this device (" + st.items.length + "). Not listed publicly. Educational · not legal advice. Review under Amānah Vault → Heir readiness when unlocked on Companion.";
    };
  }

  fetch("assets/data/protection-set.json?v=20261029M8").then(function (r) { return r.json(); }).then(function (items) {
    var root = $("yawm-protect-list"); if (!root) return;
    root.innerHTML = "";
    items.forEach(function (it) {
      var d = document.createElement("div");
      d.className = "yawm-prot-item";
      d.innerHTML = "<strong></strong><p></p>";
      d.querySelector("strong").textContent = it.title;
      d.querySelector("p").textContent = it.note;
      root.appendChild(d);
    });
  }).catch(function () {});

  paintNow(); paintTas(); paintSalah(); paintAdhkar(); paintNote();
  setInterval(paintNow, 30000);
})();
