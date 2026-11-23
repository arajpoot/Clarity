/*! meme-scene-fallback-v1 · CM3 local scenery if online fetch fails */
(function (w) {
  "use strict";
  if (w.__MEME_SCENE_FALLBACK_V1__) return;
  w.__MEME_SCENE_FALLBACK_V1__ = true;
  w.MEME_SCENE_FALLBACK = {
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80"
    ],
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"
    ],
    night: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&q=80"
    ],
    water: [
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1400&q=80"
    ],
    flowers: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1400&q=80"
    ],
    spirit: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80"
    ],
    blank: []
  };
  if (!w.MEME_BG_POOLS) w.MEME_BG_POOLS = {};
  Object.keys(w.MEME_SCENE_FALLBACK).forEach(function (k) {
    w.MEME_BG_POOLS[k] = (w.MEME_BG_POOLS[k] || []).concat(w.MEME_SCENE_FALLBACK[k]);
  });
})(window);
