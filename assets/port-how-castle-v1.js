/**
 * Port P3 — How the castle works. Port-owned. Rooms untouched.
 * Educational only — not a fatwa.
 */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;
  if (document.getElementById('port-how-castle')) return;

  function mount() {
    if (document.getElementById('port-how-castle')) return;
    var sec = document.createElement('section');
    sec.id = 'port-how-castle';
    sec.className = 'port-how-castle';
    sec.setAttribute('data-port-owned', 'how-castle-v1');
    sec.innerHTML =
      '<div class="phc-card">' +
      '  <h2 class="phc-title">How the castle works</h2>' +
      '  <p class="phc-sub">Three quiet steps · no enrollment · no fatwa desk</p>' +
      '  <ol class="phc-steps">' +
      '    <li class="phc-step"><span class="phc-num">1</span><h3>Arrive</h3><p>Educational companion only. Private data stays on this device unless you export it.</p></li>' +
      '    <li class="phc-step"><span class="phc-num">2</span><h3>Choose a door</h3><p>Each room has one job — path, today, trust, ordered study, or craft. Enter or watch ▶ Tour.</p></li>' +
      '    <li class="phc-step"><span class="phc-num">3</span><h3>Verify</h3><p>For real rulings return to the Qur’an, the Sunnah, and a teacher you trust.</p></li>' +
      '  </ol>' +
      '  <p class="phc-stamp">Educational only — not a fatwa · not legal advice</p>' +
      '</div>';

    // Prefer after castle intro / video block, before room grid
    var grid = document.querySelector('.sym-grid');
    var intro = document.querySelector('.castle-intro, #castle-intro, [data-castle-intro]');
    var videoCard = null;
    document.querySelectorAll('h2, h3').forEach(function (h) {
      if (/castle introduction/i.test(h.textContent || '')) videoCard = h.closest('section, div, article');
    });
    if (grid && grid.parentNode) {
      grid.parentNode.insertBefore(sec, grid);
    } else if (videoCard && videoCard.parentNode) {
      videoCard.parentNode.insertBefore(sec, videoCard.nextSibling);
    } else {
      var main = document.querySelector('main') || document.body;
      main.appendChild(sec);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
