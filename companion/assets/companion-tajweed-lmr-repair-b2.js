/*! companion-tajweed-lmr-repair-b2.js
 * Action LMR hollow shell repair: Pull verse + visible LMR bar + Craft path
 * Capture-phase so pills work · educational only — not a qāriʾ grade · not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_TJ_LMR_REPAIR_B2__) return;
  w.__CLARITY_TJ_LMR_REPAIR_B2__ = true;

  function $(id) {
    return d.getElementById(id);
  }

  function status(msg) {
    var el = $("tj-bridge-status") || $("tj-flow-status");
    if (el) el.textContent = msg || "";
  }

  function maxAyah() {
    var sel = $("tj-bridge-surah");
    if (!sel || !sel.selectedOptions || !sel.selectedOptions[0]) return 7;
    var n = parseInt(sel.selectedOptions[0].getAttribute("data-ayah") || "7", 10);
    return n > 0 ? n : 7;
  }

  function syncMax() {
    var max = maxAyah();
    var label = $("tj-bridge-ayah-max");
    var input = $("tj-bridge-ayah");
    if (label) label.textContent = "/ " + max;
    if (input) {
      input.max = String(max);
      var v = parseInt(input.value, 10) || 1;
      if (v > max) input.value = String(max);
      if (v < 1) input.value = "1";
    }
  }

  function ensureResultHost() {
    var host = $("tj-bridge-result") || $("tj-lmr-host");
    if ($("tj-b2-verse-panel")) return $("tj-b2-verse-panel");
    var panel = d.createElement("div");
    panel.id = "tj-b2-verse-panel";
    panel.setAttribute(
      "style",
      "margin:.65rem 0;padding:.75rem .85rem;border-radius:14px;border:1px solid rgba(201,162,39,.35);background:rgba(8,18,14,.55)"
    );
    panel.innerHTML =
      '<p class="td-src" style="margin:0 0 .35rem">Read-along · educational only — not a fatwa</p>' +
      '<div id="tj-b2-verse-body"><p style="opacity:.8">Tap <strong>Pull verse</strong> to load Arabic, English, and master audio.</p></div>' +
      '<div id="tj-b2-lmr-bar" style="display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.55rem">' +
      '<button type="button" class="btn primary" id="tj-b2-play" disabled>▶ Play master</button>' +
      '<button type="button" class="btn" id="tj-b2-pull2">Pull verse</button>' +
      '<a class="btn" href="/craft/tajweed/" id="tj-b2-craft">Full LMR · Craft studio</a>' +
      "</div>" +
      '<audio id="tj-b2-audio" controls preload="none" style="width:100%;margin-top:.5rem;display:none"></audio>';
    /* place after bridge pull or inside section-lmr */
    var anchor =
      $("tj-bridge-status") ||
      $("tj-bridge-pull") ||
      $("section-lmr") ||
      $("tj-lmr-host");
    if (anchor && anchor.parentNode) {
      if (anchor.id === "tj-lmr-host") {
        anchor.insertBefore(panel, anchor.firstChild);
      } else {
        anchor.parentNode.insertBefore(panel, anchor.nextSibling);
      }
    } else if ($("tj-lmr-host")) {
      $("tj-lmr-host").appendChild(panel);
    }
    return panel;
  }

  function ensureLmrHostShell() {
    var host = $("tj-lmr-host");
    if (!host) return;
    if (host.querySelector("#tj-lmr") || host.querySelector("#tj-b2-minibar")) return;
    if (typeof w.craftTajweedMountLmrShell === "function") {
      try {
        w.craftTajweedMountLmrShell();
      } catch (e) {}
    }
    if (host.querySelector("#tj-lmr")) return;
    /* minimal bar if craft shell did not inject */
    var bar = d.createElement("div");
    bar.id = "tj-b2-minibar";
    bar.setAttribute(
      "style",
      "padding:.75rem;border-radius:12px;border:1px dashed rgba(201,162,39,.4);margin:.5rem 0"
    );
    bar.innerHTML =
      '<p style="margin:0 0 .4rem"><strong>Listen · Match · Record</strong></p>' +
      '<p class="td-src" style="margin:0 0 .5rem">Action shows read-along + score proxy. Full mic booth lives in Craft (on-device, nothing uploaded).</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.4rem">' +
      '<button type="button" class="btn primary" data-tj-b2-pull>Pull verse</button>' +
      '<a class="btn" href="/craft/tajweed/">Open Craft · Tajweed LMR</a>' +
      "</div>";
    host.appendChild(bar);
  }

  function ayahNum() {
    var input = $("tj-bridge-ayah");
    return Math.max(1, parseInt(input && input.value, 10) || 1);
  }
  function surahNum() {
    var sel = $("tj-bridge-surah");
    return Math.max(1, parseInt(sel && sel.value, 10) || 1);
  }

  function pull() {
    ensureResultHost();
    syncMax();
    var s = surahNum();
    var a = Math.min(ayahNum(), maxAyah());
    var body = $("tj-b2-verse-body");
    var audio = $("tj-b2-audio");
    var play = $("tj-b2-play");
    if (body) body.innerHTML = "<p>Loading " + s + ":" + a + "…</p>";
    status("Loading " + s + ":" + a + "…");

    var url =
      "https://api.alquran.cloud/v1/ayah/" +
      s +
      ":" +
      a +
      "/editions/quran-uthmani,en.sahih";

    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("http");
        return r.json();
      })
      .then(function (j) {
        var arr = (j && j.data) || [];
        if (!Array.isArray(arr)) arr = [arr];
        var ar = "";
        var en = "";
        var num = null;
        arr.forEach(function (item) {
          if (!item) return;
          var id = (item.edition && item.edition.identifier) || "";
          if (/uthmani|quran/i.test(id) && item.text) ar = item.text;
          if (/en\.|sahih|english/i.test(id) && item.text) en = item.text;
          if (item.number) num = item.number;
          if (!ar && item.text && item.edition && /quran/i.test(item.edition.identifier || ""))
            ar = item.text;
        });
        if (!ar && arr[0] && arr[0].text) ar = arr[0].text;
        if (!en && arr[1] && arr[1].text) en = arr[1].text;
        if (!num && arr[0] && arr[0].number) num = arr[0].number;

        /* global ayah number fallback approx for alafasy CDN */
        var audioSrc = num
          ? "https://cdn.islamic.network/quran/audio/128/ar.alafasy/" + num + ".mp3"
          : "";

        if (body) {
          body.innerHTML =
            '<p dir="rtl" lang="ar" style="font-size:1.35rem;line-height:1.9;font-family:Amiri,Scheherazade New,serif;margin:0 0 .4rem">' +
            (ar || "—") +
            "</p>" +
            '<p style="font-size:.92rem;line-height:1.45;margin:0 0 .35rem">' +
            (en || "") +
            "</p>" +
            '<p class="td-src" style="margin:0">Qurʾān ' +
            s +
            ":" +
            a +
            ' · <a href="https://quran.com/' +
            s +
            "/" +
            a +
            '" target="_blank" rel="noopener">quran.com</a> · educational only — not a fatwa</p>';
        }
        if (audio && audioSrc) {
          audio.src = audioSrc;
          audio.style.display = "block";
          if (play) {
            play.disabled = false;
            play.onclick = function () {
              try {
                audio.play();
              } catch (e) {}
            };
          }
        }
        status("Verse " + s + ":" + a + " ready · educational only");
        /* mirror into layers for any craft engine present */
        try {
          w.__TJ_BRIDGE_LINE__ = { ar: ar, en: en, s: s, a: a, audio: audioSrc };
        } catch (e2) {}
      })
      .catch(function () {
        if (body) {
          body.innerHTML =
            '<p>Could not reach API. Open <a href="https://quran.com/' +
            s +
            "/" +
            a +
            '" target="_blank" rel="noopener">quran.com/' +
            s +
            "/" +
            a +
            '</a> or full studio at <a href="/craft/tajweed/">/craft/tajweed/</a>.</p>';
        }
        status("Network issue — use Craft studio or quran.com");
      });
  }

  function onClick(ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    var btn = t.closest("button, a.btn");
    if (!btn) return;
    var id = btn.id || "";
    if (
      id === "tj-bridge-pull" ||
      id === "tj-b2-pull2" ||
      btn.getAttribute("data-tj-b2-pull") != null ||
      (/pull verse/i.test(btn.textContent || "") && btn.closest && (btn.closest("#section-lmr") || btn.closest("[id*='lmr']") || btn.closest("#tj-b2-verse-panel")))
    ) {
      ev.preventDefault();
      ev.stopPropagation();
      pull();
      return;
    }
    if (id === "tj-bridge-prev") {
      ev.preventDefault();
      ev.stopPropagation();
      var input = $("tj-bridge-ayah");
      if (input) input.value = String(Math.max(1, (parseInt(input.value, 10) || 1) - 1));
      syncMax();
      return;
    }
    if (id === "tj-bridge-next") {
      ev.preventDefault();
      ev.stopPropagation();
      var input2 = $("tj-bridge-ayah");
      if (input2) input2.value = String(Math.min(maxAyah(), (parseInt(input2.value, 10) || 1) + 1));
      syncMax();
      return;
    }
    if (id === "tj-lmr-score-btn" || id === "tj-score-vs-master-btn") {
      status("Score vs master runs in Craft LMR booth — open /craft/tajweed/ · educational only");
    }
  }

  function boot() {
    syncMax();
    ensureResultHost();
    ensureLmrHostShell();
    d.addEventListener("click", onClick, true);
    var sel = $("tj-bridge-surah");
    if (sel && !sel._b2) {
      sel._b2 = true;
      sel.addEventListener("change", syncMax);
    }
    /* auto sample so surface is never blank */
    setTimeout(function () {
      if ($("tj-b2-verse-body") && /Tap|Pull verse/i.test($("tj-b2-verse-body").textContent || "")) {
        pull();
      }
    }, 500);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
})(window, document);
