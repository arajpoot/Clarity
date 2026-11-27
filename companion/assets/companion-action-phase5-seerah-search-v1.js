/*! companion-action-phase5-seerah-search-v1.js
 * Seerah Mirror fallback + source honesty · search allowlist helper
 * Educational only — not a fatwa.
 */
(function (w, d) {
  'use strict';
  if (w.__COMPANION_ACTION_PHASE5__) return;
  w.__COMPANION_ACTION_PHASE5__ = true;

  var KEY = 'clarity_seerah_mirror_v1';
  var STEPS = [
    {
      title: 'Truthfulness (ṣidq)',
      moment: 'He ﷺ was known as al-Amīn before prophethood. Truthfulness is a character path, not a slogan.',
      srcLabel: 'Study · ṣidq in reports',
      src: 'https://sunnah.com/search?q=truthfulness',
      prompt: 'Where did I shade the truth this week? What would full honesty cost me — and repair look like?'
    },
    {
      title: 'Mercy in strength',
      moment: 'Mercy to family and the weak is Prophetic character. Strength without mercy is not the model of the Messenger ﷺ.',
      srcLabel: 'Qurʾān 21:107',
      src: 'https://quran.com/21/107',
      prompt: 'Whom can I show quiet mercy to today without announcing it?'
    },
    {
      title: 'Patience (ṣabr)',
      moment: 'Patience is named throughout the Qurʾān as a companion of certainty. Hardship is not proof of abandonment.',
      srcLabel: 'Qurʾān 2:153',
      src: 'https://quran.com/2/153',
      prompt: 'What am I rushing that needs ṣabr instead of complaint?'
    },
    {
      title: 'Forgiving when able',
      moment: 'Pardon is praised when one has power to retaliate. This is a mirror, not a fatwa on your legal rights.',
      srcLabel: 'Qurʾān 24:22',
      src: 'https://quran.com/24/22',
      prompt: 'Is there a grudge I can lighten for Allah’s sake — without denying justice where it is due?'
    },
    {
      title: 'Remembering death',
      moment: 'Frequent remembrance of death softens the heart. Night content stays with Qurʾān, death, and istighfār — not entertainment.',
      srcLabel: 'Sunnah.com · remember death',
      src: 'https://sunnah.com/search?q=remember%20death',
      prompt: 'If I died tonight, what unfinished obedience would I regret?'
    },
    {
      title: 'Private istighfār',
      moment: 'Seeking forgiveness in the last third of the night is a known door. Quiet repentance beats public performance.',
      srcLabel: 'Qurʾān 3:17',
      src: 'https://quran.com/3/17',
      prompt: 'Can I set one private istighfār slot before sleep?'
    },
    {
      title: 'Convey, do not invent',
      moment: 'The message is conveyance of what was revealed — not inventing a third source when reports need fiqh.',
      srcLabel: 'Qurʾān 5:67',
      src: 'https://quran.com/5/67',
      prompt: 'Where do I speak beyond what I can cite?'
    }
  ];

  function load() {
    try { return JSON.parse(w.localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function save(st) {
    try { w.localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }

  function $(id) { return d.getElementById(id); }

  function render(i) {
    i = Math.max(0, Math.min(STEPS.length - 1, i | 0));
    var s = STEPS[i];
    var st = load();
    st.i = i;
    save(st);
    if ($('sm-step-label')) $('sm-step-label').textContent = 'Step ' + (i + 1) + ' of ' + STEPS.length;
    if ($('sm-title')) $('sm-title').textContent = s.title;
    if ($('sm-moment')) $('sm-moment').textContent = s.moment;
    if ($('sm-src')) {
      $('sm-src').innerHTML = 'Source: <a class="phase5-cite" href="' + s.src + '" target="_blank" rel="noopener">' + s.srcLabel + '</a> · educational only — not a fatwa';
    }
    if ($('sm-prompt')) $('sm-prompt').textContent = s.prompt;
    if ($('sm-link')) {
      $('sm-link').href = s.src;
      $('sm-link').textContent = 'Open source';
    }
    var done = (st.done || []).length;
    if ($('sm-progress-text')) $('sm-progress-text').textContent = done + ' / ' + STEPS.length + ' steps marked on this device';
    if ($('sm-prog-fill')) $('sm-prog-fill').style.width = Math.round((done / STEPS.length) * 100) + '%';
  }

  function ensureEngine() {
    var title = $('sm-title');
    var need = title && (/loading/i.test(title.textContent || '') || !(title.textContent || '').trim());
    var momentEmpty = $('sm-moment') && !($('sm-moment').textContent || '').trim();
    if (!need && !momentEmpty && typeof w.claritySeerahMirrorNext === 'function' && w.claritySeerahMirrorNext.__phase5) return;

    // Provide durable API (do not block richer engine if it fills later)
    w.claritySeerahMirrorNext = function () {
      var st = load();
      var i = (st.i | 0) + 1;
      if (i >= STEPS.length) i = 0;
      render(i);
    };
    w.claritySeerahMirrorNext.__phase5 = true;
    w.claritySeerahMirrorDone = function () {
      var st = load();
      var i = st.i | 0;
      st.done = st.done || [];
      if (st.done.indexOf(i) < 0) st.done.push(i);
      save(st);
      w.claritySeerahMirrorNext();
    };
    w.claritySeerahMirrorNote = function () {
      var t = ($('sm-title') && $('sm-title').textContent) || 'Seerah mirror';
      var p = ($('sm-prompt') && $('sm-prompt').textContent) || '';
      try {
        var notes = JSON.parse(w.localStorage.getItem('clarity_notes_v1') || '[]');
        if (!Array.isArray(notes)) notes = [];
        notes.unshift({ t: Date.now(), title: 'Mirror · ' + t, body: p });
        w.localStorage.setItem('clarity_notes_v1', JSON.stringify(notes.slice(0, 50)));
      } catch (e) {}
      if ($('sm-src')) {
        var n = d.createElement('p');
        n.style.fontSize = '.8rem';
        n.textContent = 'Mirror note saved on this device (if Notes vault reads clarity_notes_v1).';
        $('seerah-mirror-body').appendChild(n);
      }
    };

    var st = load();
    render(st.i | 0);
  }

  function boot() {
    if ($('seerah-mirror-card')) ensureEngine();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 2000);
  try {
    var mo = new MutationObserver(boot);
    mo.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 15000);
  } catch (e) {}
})(window, document);
