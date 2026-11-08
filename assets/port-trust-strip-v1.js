/**
 * Port P1 — Trust strip inject (optional helper). Port-owned.
 */
(function () {
  'use strict';
  if (document.getElementById('port-trust-strip')) return;
  function mount() {
    if (document.getElementById('port-trust-strip')) return;
    var el = document.createElement('div');
    el.id = 'port-trust-strip';
    el.className = 'port-trust-strip';
    el.setAttribute('data-port-owned', 'trust-strip-v1');
    el.innerHTML =
      '<span class="pts-job">Five doors · One castle · Private where it must be</span>' +
      '<span>Local-first</span>' +
      '<span>On this device</span>' +
      '<span>Not a fatwa</span>' +
      '<span>Verify with Qur’an, Sunnah, scholar</span>';
    var hero = document.querySelector('.hero, header, .port-hero, h1');
    var h1 = document.querySelector('h1');
    if (h1 && h1.parentNode) {
      // insert after hero block containing h1
      var parent = h1.closest('header, .hero, section') || h1.parentNode;
      if (parent.nextSibling) parent.parentNode.insertBefore(el, parent.nextSibling);
      else parent.parentNode.appendChild(el);
    } else {
      (document.querySelector('main') || document.body).insertBefore(el, (document.querySelector('main') || document.body).firstChild);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
