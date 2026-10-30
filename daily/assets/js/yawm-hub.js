/*! Yawm hub L4 — leftovers import · educational only — not a fatwa */
(function () {
  "use strict";
  var VER = "20261029L4";
  var KEY = {
    deed: "clarity.daily.deed.v1",
    tas: "clarity.daily.tasbeeh.v1",
    adh: "clarity.daily.adhkar.v1",
    note: "clarity.daily.vaultnote.v1",
    light: "clarity.daily.sendlight.v1",
    fard: "clarity.daily.fard.v1",
    qada: "clarity.daily.qada.v1"
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
  function isEvening() {
    var h = new Date().getHours();
    return !(h >= 4 && h < 15);
  }

  var tg = $("theme-toggle");
  if (tg) tg.onclick = function () {
    var d = document.documentElement;
    var next = d.getAttribute("data-theme") === "light" ? "dark" : "light";
    d.setAttribute("data-theme", next);
    try { localStorage.setItem("clarity.daily.theme.v1", next); } catch (e) {}
  };
  try {
    var th = localStorage.getItem("clarity.daily.theme.v1");
    if (th) document.documentElement.setAttribute("data-theme", th);
  } catch (e) {}

  function paintNow() {
    var el = $("yawm-now-label"); if (!el) return;
    var p = period();
    el.textContent = p.charAt(0).toUpperCase() + p.slice(1) + " · " +
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    var lane = $("yawm-now-lane");
    if (lane) lane.textContent = p === "morning"
      ? "Morning window — adhkār, intention, prepare the day."
      : (p === "evening" || p === "night")
      ? "Evening / night — adhkār, protect the heart, prepare the long stay."
      : "Afternoon — guard the prayer, keep a light tongue.";
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
  fetch("assets/data/deed-bank.json?v=" + VER).then(function (r) { return r.json(); }).then(paintDeed).catch(function () { paintDeed(null); });

  function paintTas() {
    var n = 0; try { n = parseInt(localStorage.getItem(KEY.tas) || "0", 10) || 0; } catch (e) {}
    var el = $("yawm-tas-count"); if (el) el.textContent = n;
    var inc = $("yawm-tas-inc"), rst = $("yawm-tas-reset");
    if (inc) inc.onclick = function () { n++; try { localStorage.setItem(KEY.tas, String(n)); } catch (e) {} if (el) el.textContent = n; };
    if (rst) rst.onclick = function () { n = 0; try { localStorage.setItem(KEY.tas, "0"); } catch (e) {} if (el) el.textContent = n; };
  }

  /* L1a — next salah: try AlAdhan for browser locale city fallback educational */
  function paintSalah() {
    var el = $("yawm-salah-name"), sub = $("yawm-salah-sub"), link = $("yawm-salah-link");
    if (!el) return;
    function approx() {
      var h = new Date().getHours();
      var names = ["Fajr", "Dhuhr", "ʿAṣr", "Maghrib", "ʿIshāʾ"];
      var approxH = [5, 13, 16, 19, 21];
      var i = 0;
      for (var k = 0; k < approxH.length; k++) { if (h < approxH[k]) { i = k; break; } i = 0; }
      el.textContent = names[i];
      if (sub) sub.textContent = "Approximate educational cue — not a mosque timetable.";
    }
    approx();
    if (link) {
      link.href = "/";
      link.textContent = "Live city times on Companion banner →";
    }
    /* Optional: coords from geolocation once */
    if (!navigator.geolocation) return;
    try {
      navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude, lon = pos.coords.longitude;
        var url = "https://api.aladhan.com/v1/timings?latitude=" + lat + "&longitude=" + lon + "&method=2";
        fetch(url).then(function (r) { return r.json(); }).then(function (data) {
          var t = data && data.data && data.data.timings; if (!t) return;
          var order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
          var labels = ["Fajr", "Dhuhr", "ʿAṣr", "Maghrib", "ʿIshāʾ"];
          var now = new Date();
          var nextIdx = 0, nextLabel = labels[0], nextTime = t.Fajr;
          for (var i = 0; i < order.length; i++) {
            var parts = (t[order[i]] || "00:00").split(":");
            var d = new Date(now); d.setHours(+parts[0], +parts[1], 0, 0);
            if (d > now) { nextIdx = i; nextLabel = labels[i]; nextTime = t[order[i]]; break; }
          }
          el.textContent = nextLabel;
          var mins = Math.round((function () {
            var parts = (nextTime || "00:00").split(":");
            var d = new Date(now); d.setHours(+parts[0], +parts[1], 0, 0);
            if (d < now) d.setDate(d.getDate() + 1);
            return (d - now) / 60000;
          })());
          var hm = Math.floor(mins / 60), mm = mins % 60;
          if (sub) sub.textContent = "In about " + hm + "h " + mm + "m · " + nextTime + " (device location · method 2). Verify with a local source.";
        }).catch(function () {});
      }, function () {}, { timeout: 8000, maximumAge: 600000 });
    } catch (e) {}
  }

  function paintAdhkar() {
    var evening = isEvening();
    var win = $("yawm-adh-window"); if (win) win.textContent = evening ? "evening" : "morning";
    var file = "assets/adhkar/" + (evening ? "evening" : "morning") + ".json?v=" + VER;
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
        items.forEach(function (it, ix) {
          var iid = it.id || ("i" + ix);
          if ((st.c[iid] || 0) >= (it.count || 1)) done++;
        });
        var prog = $("yawm-adh-prog");
        if (prog) prog.textContent = done + " / " + items.length;
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
      if (msg) msg.textContent = "Saved on this device (" + st.items.length + "). Educational · not legal advice. Companion Amānah Vault → Heir readiness when unlocked.";
    };
  }

  /* L1a Send light */
  function paintLight() {
    var root = $("yawm-light-chips"); if (!root) return;
    fetch("assets/data/send-light.json?v=" + VER).then(function (r) { return r.json(); }).then(function (items) {
      var st = load(KEY.light, {});
      if (st.day !== dayKey()) st = { day: dayKey(), done: {} };
      root.innerHTML = "";
      items.forEach(function (it) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "yawm-chip" + (st.done[it.id] ? " on" : "");
        b.innerHTML = "<strong></strong><span></span>";
        b.querySelector("strong").textContent = it.label;
        b.querySelector("span").textContent = st.done[it.id] ? "Marked · " + it.hint : it.hint;
        b.onclick = function () {
          st.done[it.id] = !st.done[it.id];
          save(KEY.light, st);
          paintLight();
        };
        root.appendChild(b);
      });
    }).catch(function () {});
  }

  /* L1b Fard map */
  function paintFard() {
    var root = $("yawm-fard-map"); if (!root) return;
    fetch("assets/data/fard-map.json?v=" + VER).then(function (r) { return r.json(); }).then(function (items) {
      var st = load(KEY.fard, {});
      if (st.day !== dayKey()) st = { day: dayKey(), done: {} };
      root.innerHTML = "";
      items.forEach(function (it) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "yawm-fard-pill" + (st.done[it.name] ? " on" : "");
        b.innerHTML = "<b></b><span></span>";
        b.querySelector("b").textContent = it.units;
        b.querySelector("span").textContent = it.name + " farḍ";
        b.onclick = function () {
          st.done[it.name] = !st.done[it.name];
          save(KEY.fard, st);
          paintFard();
        };
        root.appendChild(b);
      });
    }).catch(function () {});
  }

  /* L2 protection */
  fetch("assets/data/protection-set.json?v=" + VER).then(function (r) { return r.json(); }).then(function (items) {
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

  /* L3 qada simple */
  function paintQada() {
    var daysEl = $("yawm-qada-days"), farzEl = $("yawm-qada-farz");
    var st = load(KEY.qada, { days: 0, farz: 0 });
    if (daysEl) daysEl.textContent = st.days || 0;
    if (farzEl) farzEl.textContent = st.farz || 0;
    var a = $("yawm-qada-add-day"), b = $("yawm-qada-add-farz"), c = $("yawm-qada-clear");
    if (a) a.onclick = function () { st.days = (st.days || 0) + 1; save(KEY.qada, st); paintQada(); };
    if (b) b.onclick = function () { st.farz = (st.farz || 0) + 1; save(KEY.qada, st); paintQada(); };
    if (c) c.onclick = function () { st = { days: 0, farz: 0 }; save(KEY.qada, st); paintQada(); };
  }

  paintNow(); paintTas(); paintSalah(); paintAdhkar(); paintNote();
  paintLight(); paintFard(); paintQada();
  setInterval(paintNow, 30000);
})();
