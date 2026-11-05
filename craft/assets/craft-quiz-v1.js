/*! craft-quiz-v1 · local educational bank · not a fatwa */
(function (w, d) {
  "use strict";
  var BANK = [
    { q: "How many obligatory daily prayers are there?", opts: ["Three", "Four", "Five", "Six"], a: 2, src: "Consensus of the four schools · educational overview" },
    { q: "Sūrat al-ʿAṣr stresses belief, righteous work, and…", opts: ["Wealth", "Truth and patience", "Travel", "Silence only"], a: 1, src: "Qur’an 103 · educational" },
    { q: "Zakāh is generally due on wealth above niṣāb after…", opts: ["One day", "One lunar year (ḥawl)", "Ten years", "Never"], a: 1, src: "Classical fiqh overview · ask a local scholar for your case" },
    { q: "The testimony of faith includes that Muḥammad ﷺ is…", opts: ["An angel", "The Messenger of Allah", "A poet only", "Optional"], a: 1, src: "Shahādah · educational" },
    { q: "Tajweed primarily concerns…", opts: ["Cooking", "Correct Qur’ān recitation rules", "Trade law", "Calendar design"], a: 1, src: "Tajweed pedagogy · learn with a teacher" }
  ];
  var i = 0, locked = false;
  function show() {
    locked = false;
    var item = BANK[i % BANK.length];
    d.getElementById("quiz-progress").textContent = "Question " + ((i % BANK.length) + 1) + " / " + BANK.length;
    d.getElementById("quiz-q").textContent = item.q;
    d.getElementById("quiz-feedback").textContent = "";
    var box = d.getElementById("quiz-opts");
    box.innerHTML = item.opts.map(function (o, idx) {
      return '<button type="button" data-idx="' + idx + '">' + o + "</button>";
    }).join("");
    box.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (locked) return;
        locked = true;
        var idx = +btn.getAttribute("data-idx");
        box.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
        if (idx === item.a) {
          btn.classList.add("ok");
          d.getElementById("quiz-feedback").textContent = "Correct · " + item.src;
        } else {
          btn.classList.add("bad");
          box.querySelectorAll("button")[item.a].classList.add("ok");
          d.getElementById("quiz-feedback").textContent = "Review · " + item.src + " · Educational only — not a fatwa.";
        }
      });
    });
  }
  function boot() {
    show();
    d.getElementById("quiz-next").addEventListener("click", function () {
      i++;
      show();
    });
    if (w.ClarityCraftRegistry) w.ClarityCraftRegistry.runUpgrade("quiz", { n: BANK.length });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
