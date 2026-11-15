/*! companion-hifz-engine-v1 · mount-safe Hifẓ coach (shell innerHTML does not run inline scripts)
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_HIFZ_ENGINE_V1__) return;
  w.__COMPANION_HIFZ_ENGINE_V1__ = true;

  var KEY = "cu_hifz_coach_v2";
  var SURAH_LEN = {1:7,2:286,3:200,4:176,5:120,6:165,7:206,8:75,9:129,10:109,11:123,12:111,13:43,14:52,15:99,16:128,17:111,18:110,19:98,20:135,36:83,55:78,67:30,112:4,113:5,114:6};
  var NAMES = {1:"Al-Fatihah",2:"Al-Baqarah",18:"Al-Kahf",36:"Ya-Sin",55:"Ar-Rahman",67:"Al-Mulk",112:"Al-Ikhlas",113:"Al-Falaq",114:"An-Nas"};

  function $(id, root) {
    return (root || d).getElementById(id);
  }
  function state() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function save(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
  }
  function keyAyah(s, a) {
    return s + ":" + a;
  }

  function fillSurah(root) {
    var sel = $("hifz-surah", root);
    if (!sel) return;
    if (sel.options.length >= 114) return;
    sel.innerHTML = "";
    for (var i = 1; i <= 114; i++) {
      var o = d.createElement("option");
      o.value = String(i);
      o.textContent = i + ". " + (NAMES[i] || "Surah " + i);
      sel.appendChild(o);
    }
  }

  var api = {
    load: function () {
      var root = d.getElementById("cs-mount") || d;
      fillSurah(root);
      var s = parseInt(($("hifz-surah", root) && $("hifz-surah", root).value) || "1", 10);
      var a = parseInt(($("hifz-ayah-num", root) && $("hifz-ayah-num", root).value) || "1", 10);
      var max = SURAH_LEN[s] || 286;
      if (a < 1) a = 1;
      if (a > max) a = max;
      if ($("hifz-ayah-num", root)) $("hifz-ayah-num", root).value = String(a);
      if ($("hifz-meta", root))
        $("hifz-meta", root).textContent =
          "Qurʾān " + s + ":" + a + (NAMES[s] ? " · " + NAMES[s] : "");
      if ($("hifz-status", root)) $("hifz-status", root).textContent = "Loading āyah…";
      fetch("https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih")
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          var arr = data && data.data;
          if (!Array.isArray(arr)) throw new Error("bad");
          if ($("hifz-arabic", root)) {
            $("hifz-arabic", root).textContent = (arr[0] && arr[0].text) || "";
            $("hifz-arabic", root).style.display = "";
          }
          if ($("hifz-translation", root)) {
            $("hifz-translation", root).textContent = (arr[1] && arr[1].text) || "";
            $("hifz-translation", root).style.display = "";
          }
          if ($("hifz-status", root)) $("hifz-status", root).textContent = "";
          api.renderTiers();
        })
        .catch(function () {
          if ($("hifz-status", root))
            $("hifz-status", root).textContent =
              "Could not load verse — check network. Educational only.";
        });
    },
    play: function () {
      var root = d.getElementById("cs-mount") || d;
      var s = parseInt($("hifz-surah", root).value, 10);
      var a = parseInt($("hifz-ayah-num", root).value, 10);
      var n = ("00" + s).slice(-3) + ("00" + a).slice(-3);
      var audio = new Audio("https://everyayah.com/data/Alafasy_128kbps/" + n + ".mp3");
      audio.play().catch(function () {
        if ($("hifz-status", root))
          $("hifz-status", root).textContent = "Audio blocked or unavailable.";
      });
    },
    toggleRecall: function () {
      var root = d.getElementById("cs-mount") || d;
      var tr = $("hifz-translation", root);
      if (!tr) return;
      tr.style.display = tr.style.display === "none" ? "" : "none";
    },
    next: function () {
      var root = d.getElementById("cs-mount") || d;
      var s = parseInt($("hifz-surah", root).value, 10);
      var a = parseInt($("hifz-ayah-num", root).value, 10);
      var max = SURAH_LEN[s] || 286;
      if (a >= max) {
        if (s < 114) {
          $("hifz-surah", root).value = String(s + 1);
          $("hifz-ayah-num", root).value = "1";
        }
      } else $("hifz-ayah-num", root).value = String(a + 1);
      api.load();
    },
    prev: function () {
      var root = d.getElementById("cs-mount") || d;
      var s = parseInt($("hifz-surah", root).value, 10);
      var a = parseInt($("hifz-ayah-num", root).value, 10);
      if (a <= 1) {
        if (s > 1) {
          $("hifz-surah", root).value = String(s - 1);
          $("hifz-ayah-num", root).value = String(SURAH_LEN[s - 1] || 1);
        }
      } else $("hifz-ayah-num", root).value = String(a - 1);
      api.load();
    },
    markMemorized: function () {
      var root = d.getElementById("cs-mount") || d;
      var s = parseInt($("hifz-surah", root).value, 10);
      var a = parseInt($("hifz-ayah-num", root).value, 10);
      var st = state();
      st.tiers = st.tiers || {};
      st.tiers[keyAyah(s, a)] = { tier: 1, when: Date.now() };
      save(st);
      if ($("hifz-status", root))
        $("hifz-status", root).textContent = "Marked · Tier 1 (review soon).";
      api.renderTiers();
    },
    setTier: function (tier) {
      var root = d.getElementById("cs-mount") || d;
      var s = parseInt($("hifz-surah", root).value, 10);
      var a = parseInt($("hifz-ayah-num", root).value, 10);
      var st = state();
      st.tiers = st.tiers || {};
      st.tiers[keyAyah(s, a)] = { tier: tier, when: Date.now() };
      save(st);
      if ($("hifz-tier-status", root))
        $("hifz-tier-status", root).textContent =
          "Āyah " + s + ":" + a + " → Tier " + tier;
      api.renderTiers();
    },
    renderTiers: function () {
      var root = d.getElementById("cs-mount") || d;
      var st = state();
      var list = $("hifz-tier-list", root);
      if (!list) return;
      var items = Object.keys(st.tiers || {}).map(function (k) {
        return { k: k, t: st.tiers[k].tier };
      });
      items.sort(function (a, b) {
        return a.t - b.t || a.k.localeCompare(b.k);
      });
      list.innerHTML =
        items
          .slice(0, 12)
          .map(function (it) {
            return "<li>T" + it.t + " · " + it.k + "</li>";
          })
          .join("") || "<li>No āyāt tagged yet.</li>";
    }
  };

  // Legacy onclick names
  w.loadHifzAyah = function () {
    api.load();
  };
  w.playHifzAudio = function () {
    api.play();
  };
  w.nextHifzAyah = function () {
    api.next();
  };
  w.clarityHifz = api;

  function tryBind() {
    var root = d.getElementById("cs-mount");
    if (!root || !root.querySelector("#hifz-display, #hifz-arabic, #hifz-surah")) return;
    fillSurah(root);
    api.load();
  }

  function boot() {
    tryBind();
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(tryBind, 60);
      }).observe(mount, { childList: true, subtree: false });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
