/* Study Buddy enrich — phase-aware routing · 20261019UNI
 * Additive helper; keeps “not a mufti” boundary.
 */
(function (g) {
  "use strict";
  if (g.__CU_BUDDY_ENRICH_V1__) return;
  g.__CU_BUDDY_ENRICH_V1__ = true;

  var ROUTES = [
    { k: /tajweed|makhraj|qalqalah|ghunnah/i, href: "/lab/tajweed/", label: "Tajweed lab" },
    { k: /callig|naskh|letter|qalam/i, href: "/lab/calligraphy/", label: "Calligraphy studio" },
    { k: /arabic|hajj.?2027/i, href: "/lab/arabic/", label: "Arabic studio" },
    { k: /recite|tilawa/i, href: "/lab/recite/", label: "Recite lab" },
    { k: /hifz|memor/i, href: "/lab/hifz/", label: "Hifz lab" },
    { k: /meme|media|reminder craft/i, href: "/lab/media/", label: "Media lab" },
    { k: /seeker|tawhid|who is allah|foundation/i, href: "/campus/desk/seeker/", label: "Seeker desk" },
    { k: /practice|salah|wudu|purif|new muslim/i, href: "/campus/desk/practice/", label: "Practice desk" },
    { k: /consistency|weekly|review|daily/i, href: "/campus/desk/consistency/", label: "Consistency desk" },
    { k: /transmission|dawah|share|da.?i/i, href: "/campus/desk/transmission/", label: "Transmission desk" },
    { k: /library|quran\.com|sunnah|source/i, href: "/library/", label: "Library" },
    { k: /vault|pin|note/i, href: "/vault/", label: "University vault" },
    { k: /assign/i, href: "/campus/assignments/", label: "Assignments" },
    { k: /mirath|faraid|inherit/i, href: "/campus/mirath/", label: "Mirāth" },
    { k: /diploma|transcript/i, href: "/campus/diploma/", label: "Diploma hall" },
    { k: /map|journey|campus/i, href: "/campus/", label: "Journey map" }
  ];

  function answer(q) {
    q = String(q || "").trim();
    if (!q) {
      return {
        text: "Assalamu alaykum. Ask where to study next, or name a tool (Tajweed, Seeker, Library). I point to campus doors — I do not issue fatwas.",
        links: [
          { href: "/campus/desk/seeker/", label: "Seeker desk" },
          { href: "/lab/tajweed/", label: "Tajweed lab" }
        ]
      };
    }
    var hits = [];
    ROUTES.forEach(function (r) {
      if (r.k.test(q)) hits.push({ href: r.href, label: r.label });
    });
    if (!hits.length) {
      return {
        text: "I did not match a campus door. Try: Seeker, Practice, Tajweed, Calligraphy, Library, or Vault. Verify verses on Quran.com / Sunnah.com. Ask a local teacher for rulings.",
        links: [
          { href: "/campus/", label: "Journey map" },
          { href: "/library/", label: "Library" }
        ]
      };
    }
    return {
      text: "Here is where that lives on campus. Educational only — not a fatwa.",
      links: hits.slice(0, 5)
    };
  }

  function renderReply(host, ans) {
    if (!host) return;
    var links = (ans.links || [])
      .map(function (l) {
        return '<a href="' + l.href + '">' + l.label + "</a>";
      })
      .join(" · ");
    var div = document.createElement("div");
    div.className = "cu-buddy-reply";
    div.innerHTML = "<p>" + ans.text + "</p><p>" + links + "</p>";
    host.appendChild(div);
  }

  function boot() {
    var form = document.querySelector("form, .buddy-chat, #buddy-send") || document.body;
    var input =
      document.querySelector('input[type="search"], input[placeholder*="study"], textarea') ||
      document.querySelector("input");
    var log = document.querySelector(".buddy-log, #buddy-log, .cu-content");
    var sendBtn = document.querySelector('button[type="submit"], #buddy-send, button');

    function go() {
      if (!input) return;
      var ans = answer(input.value);
      renderReply(log || document.querySelector("main"), ans);
    }

    if (sendBtn) {
      sendBtn.addEventListener("click", function (ev) {
        if (input && document.activeElement === input || true) {
          setTimeout(go, 10);
        }
      });
    }
    document.querySelectorAll("[data-buddy-prompt], .quick-prompt button, .cu-chip").forEach(function (b) {
      b.addEventListener("click", function () {
        if (input) input.value = b.textContent || "";
        setTimeout(go, 10);
      });
    });

    // Enrich search box if present
    var searchBtn = Array.from(document.querySelectorAll("button")).find(function (b) {
      return /search/i.test(b.textContent || "");
    });
    if (searchBtn && input) {
      searchBtn.addEventListener("click", function () {
        var ans = answer(input.value);
        renderReply(log || document.querySelector("main"), ans);
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.CuBuddyAnswer = answer;
})(typeof window !== "undefined" ? window : this);
