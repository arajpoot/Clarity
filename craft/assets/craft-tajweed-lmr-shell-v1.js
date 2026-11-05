/*! craft-tajweed-lmr-shell-v1 · C16TJ
 * Injects Companion-grade Listen·Match·Record host DOM into #tj-lmr-host
 * so nx-tj-lmr-js-v1 can bind. Educational only — not a qāriʾ verdict · not a fatwa.
 * Nothing uploaded. On-device mic only.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_LMR_SHELL_C16TJ__) return;
  w.__CRAFT_TJ_LMR_SHELL_C16TJ__ = true;

  function shellHtml() {
    return [
      '<div class="tj-practice-loop" id="tj-lmr">',
      '  <p class="panel-note">Practice helper only — not a qāriʾ certification. Audio via EveryAyah (Ḥuṣarī) where available. Nothing is uploaded.</p>',
      '  <div class="tj-lmr-mode-row" role="group" aria-label="Practice mode">',
      '    <button type="button" class="btn tj-lmr-mode active" data-mode="verse" id="tj-lmr-mode-verse">📖 Verse</button>',
      '    <button type="button" class="btn tj-lmr-mode" data-mode="rule" id="tj-lmr-mode-rule">📐 Rule</button>',
      '  </div>',
      '  <div class="tj-lmr-toolbar" id="tj-lmr-toolbar-verse">',
      '    <label class="panel-note">Sūrah <select id="tj-lmr-surah" aria-label="Surah">',
      '      <option value="1">1 · Al-Fātiḥah</option>',
      '      <option value="112">112 · Al-Ikhlāṣ</option>',
      '      <option value="103">103 · Al-ʿAṣr</option>',
      '      <option value="2">2 · Al-Baqarah</option>',
      '      <option value="36">36 · Yā-Sīn</option>',
      '    </select></label>',
      '    <label class="panel-note">Āyah <input type="number" id="tj-lmr-ayah" min="1" max="286" value="1" style="width:4rem" /></label>',
      '    <button type="button" class="btn primary" id="tj-lmr-fetch">⬇ Pull āyah</button>',
      '    <button type="button" class="btn" id="tj-lmr-random">Random short</button>',
      '  </div>',
      '  <div class="tj-lmr-toolbar" id="tj-lmr-toolbar-rule" hidden>',
      '    <label class="panel-note">Rule <select id="tj-lmr-rule" aria-label="Tajweed rule">',
      '      <option value="makharij">Makhārij</option>',
      '      <option value="izhar">Iẓhār</option>',
      '      <option value="ikhfa">Ikhfāʾ</option>',
      '      <option value="idgham">Idghām</option>',
      '      <option value="iqlab">Iqlāb</option>',
      '      <option value="qalqalah">Qalqalah</option>',
      '      <option value="madd">Madd</option>',
      '      <option value="ghunnah">Ghunnah</option>',
      '    </select></label>',
      '    <button type="button" class="btn primary" id="tj-lmr-fetch-rule">Load example</button>',
      '    <button type="button" class="btn" id="tj-lmr-rule-next">Next example</button>',
      '  </div>',
      '  <div class="tj-lmr-read-panel" id="tj-lmr-read-panel">',
      '    <p class="panel-note" id="tj-lmr-meta-read">Pull an āyah or load a rule example.</p>',
      '    <div class="arabic" id="tj-lmr-ar-read" dir="rtl" lang="ar" style="font-family:Amiri,serif;font-size:1.35rem;line-height:1.8;text-align:center;margin:0.5rem 0"></div>',
      '    <div id="tj-lmr-en-read" class="panel-note" style="text-align:center"></div>',
      '  </div>',
      '  <div class="tj-lmr-steps" role="tablist" style="display:flex;flex-wrap:wrap;gap:0.35rem;margin:0.75rem 0">',
      '    <button type="button" class="btn tj-lmr-step active" data-step="1">1 · Listen</button>',
      '    <button type="button" class="btn tj-lmr-step" data-step="2">2 · Match</button>',
      '    <button type="button" class="btn tj-lmr-step" data-step="3">3 · Record</button>',
      '    <button type="button" class="btn tj-lmr-step" data-step="4">4 · Focus</button>',
      '  </div>',
      '  <div class="tj-lmr-panel" id="tj-lmr-step1">',
      '    <p class="panel-note" id="tj-lmr-meta">Master audio</p>',
      '    <div class="arabic" id="tj-lmr-ar" dir="rtl" lang="ar" style="font-family:Amiri,serif;font-size:1.25rem;text-align:center"></div>',
      '    <div id="tj-lmr-en" class="panel-note" style="text-align:center"></div>',
      '    <audio id="tj-lmr-master-audio" controls preload="none" style="width:100%;max-width:28rem;margin:0.5rem 0"></audio>',
      '    <div style="display:flex;flex-wrap:wrap;gap:0.35rem">',
      '      <button type="button" class="btn primary" id="tj-lmr-play-master">▶ Play master</button>',
      '      <a class="btn" id="tj-lmr-quran-link" href="https://quran.com" target="_blank" rel="noopener">Open on Quran.com</a>',
      '    </div>',
      '  </div>',
      '  <div class="tj-lmr-panel" id="tj-lmr-step2" hidden>',
      '    <p class="panel-note">Read along while the master plays.</p>',
      '    <div class="arabic" id="tj-lmr-ar2" dir="rtl" lang="ar" style="font-family:Amiri,serif;font-size:1.25rem;text-align:center"></div>',
      '    <button type="button" class="btn" id="tj-lmr-play-master2">▶ Play while reading</button>',
      '  </div>',
      '  <div class="tj-lmr-panel" id="tj-lmr-step3" hidden>',
      '    <p class="panel-note">Record on this device only.</p>',
      '    <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin:0.35rem 0">',
      '      <button type="button" class="btn primary" id="tj-lmr-rec-btn">● Record</button>',
      '      <button type="button" class="btn" id="tj-lmr-rec-stop">Stop</button>',
      '      <button type="button" class="btn" id="tj-lmr-rec-play">Play my take</button>',
      '      <button type="button" class="btn" id="tj-lmr-play-master3">▶ Master again</button>',
      '    </div>',
      '    <p id="tj-lmr-rec-status" class="panel-note">Mic idle</p>',
      '    <audio id="tj-lmr-user-audio" controls preload="none" style="width:100%;max-width:28rem"></audio>',
      '    <div class="tj-lmr-live-meter" style="margin-top:0.5rem">',
      '      <div class="panel-note">Input level</div>',
      '      <div style="height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden">',
      '        <div id="tj-lmr-meter-fill" style="height:100%;width:0;background:linear-gradient(90deg,#1e7d5e,#c9a227)"></div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="tj-lmr-panel" id="tj-lmr-step4" hidden>',
      '    <p class="panel-note">Practice helper score — not a verdict.</p>',
      '    <div id="tj-lmr-score-card">',
      '      <p><span id="tj-lmr-score-val">—</span></p>',
      '      <p id="tj-lmr-score-note" class="panel-note"></p>',
      '      <p class="panel-note">Energy <span id="tj-lmr-bar-energy">—</span> · Length <span id="tj-lmr-bar-len">—</span> · Timing <span id="tj-lmr-bar-time">—</span></p>',
      '      <button type="button" class="btn primary" id="tj-lmr-score-btn">Score this take</button>',
      '      <button type="button" class="btn" id="tj-lmr-mark-done">Mark practiced</button>',
      '    </div>',
      '    <div id="tj-lmr-focus-chips" style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.5rem"></div>',
      '    <p id="tj-lmr-focus-note" class="panel-note"></p>',
      '  </div>',
      '  <div style="margin-top:1rem">',
      '    <h3 style="font-size:0.95rem">Session log · this device</h3>',
      '    <p id="tj-lmr-loop-stat" class="panel-note"></p>',
      '    <div id="tj-lmr-log-list"></div>',
      '  </div>',
      '</div>'
    ].join("\n");
  }

  function mount() {
    var host = d.getElementById("tj-lmr-host");
    if (!host) return false;
    if (host.querySelector("#tj-lmr")) return true;
    host.innerHTML = shellHtml();
    return true;
  }

  function boot() {
    mount();
    /* Re-run after studio boot in case order races */
    setTimeout(mount, 400);
    setTimeout(mount, 1200);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();

  w.craftTajweedMountLmrShell = mount;
})(window, document);
