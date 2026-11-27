/*! companion-action-hygiene-v1.js — dedupe helpers + link safety */
(function (w, d) {
  'use strict';
  if (w.__COMPANION_ACTION_HYGIENE_V1__) return;
  w.__COMPANION_ACTION_HYGIENE_V1__ = true;
  // Soft-fix known dead path if still present in DOM
  d.querySelectorAll('a[href*="islamweb.net/en/article/134409"]').forEach(function (a) {
    a.href = 'https://islamqa.info/en/answers/31822';
    a.textContent = (a.textContent || '').replace(/Islamweb/i, 'IslamQA 31822') || 'IslamQA 31822';
  });
})(window, document);
