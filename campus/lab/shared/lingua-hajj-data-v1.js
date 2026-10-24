/**
 * Clarity Lab · Hajj phrase / duʿā / rites data from Lingua
 * Educational only — not a fatwa. Follow your group's guide.
 */
(function (g) {
  "use strict";
  if (g.__CU_LINGUA_HAJJ_DATA_V1__) return;
  g.__CU_LINGUA_HAJJ_DATA_V1__ = true;

  var HAJJ_PHRASES = {
  airport: [
    { en: "Where is passport control?", ar: "أين الجوازات؟", ur: "پاسپورٹ کنٹرول کہاں ہے؟" },
    { en: "I am here for Hajj.", ar: "أنا هنا للحج.", ur: "میں حج کے لیے آیا/آئی ہوں۔" },
    { en: "Where can I find a SIM card?", ar: "أين أجد شريحة اتصال؟", ur: "سم کارڈ کہاں ملے گا؟" },
    { en: "Where is the taxi / ride area?", ar: "أين موقف التاكسي؟", ur: "ٹیکسی کہاں سے ملے گی؟" }
  ],
  transport: [
    { en: "Please take me to the Haram.", ar: "من فضلك خذني إلى الحرم.", ur: "براہ کرم مجھے حرم لے چلیں۔" },
    { en: "How much is the fare?", ar: "كم الأجرة؟", ur: "کرایہ کتنا ہے؟" },
    { en: "Please stop here.", ar: "توقف هنا من فضلك.", ur: "یہاں رک جائیں۔" },
    { en: "Where is the bus to Mina?", ar: "أين باص منى؟", ur: "مناٰ کی بس کہاں ہے؟" }
  ],
  haram: [
    { en: "Where is the entrance?", ar: "أين المدخل؟", ur: "داخلہ کہاں ہے؟" },
    { en: "Where can I make wudu?", ar: "أين يمكنني الوضوء؟", ur: "وضو کہاں کر سکتا/سکتی ہوں؟" },
    { en: "I am looking for my group.", ar: "أبحث عن مجموعتي.", ur: "میں اپنا گروپ تلاش کر رہا/رہی ہوں۔" },
    { en: "Which way is the Kaaba?", ar: "من أي جهة الكعبة؟", ur: "کعبہ کس طرف ہے؟" }
  ],
  hotel: [
    { en: "I have a reservation.", ar: "لدي حجز.", ur: "میری بکنگ ہے۔" },
    { en: "What time is checkout?", ar: "متى وقت المغادرة؟", ur: "چیک آؤٹ کب ہے؟" },
    { en: "Is there Wi‑Fi?", ar: "هل يوجد واي فاي؟", ur: "وائی فائی ہے؟" },
    { en: "Please call a taxi for me.", ar: "من فضلك اطلب لي تاكسي.", ur: "میرا ٹیکسی بلا دیں۔" }
  ],
  food: [
    { en: "Is this food halal?", ar: "هل هذا الطعام حلال؟", ur: "کیا یہ کھانا حلال ہے؟" },
    { en: "Water, please.", ar: "ماء من فضلك.", ur: "پانی دیں۔" },
    { en: "The bill, please.", ar: "الحساب من فضلك.", ur: "بل دے دیں۔" },
    { en: "No spicy food.", ar: "بدون طعام حار.", ur: "مصالحہ دار نہ ہو۔" }
  ],
  medical: [
    { en: "I need a doctor.", ar: "أحتاج إلى طبيب.", ur: "مجھے ڈاکٹر چاہیے۔" },
    { en: "I have diabetes / blood pressure.", ar: "لدي سكري / ضغط دم.", ur: "مجھے ذیابیطس / بلڈ پریشر ہے۔" },
    { en: "Where is the pharmacy?", ar: "أين الصيدلية؟", ur: "فارمیسی کہاں ہے؟" },
    { en: "I feel dizzy.", ar: "أشعر بالدوار.", ur: "مجھے چکر آ رہے ہیں۔" }
  ],
  emergency: [
    { en: "Help!", ar: "النجدة!", ur: "مدد!" },
    { en: "Call an ambulance.", ar: "اتصل بالإسعاف.", ur: "ایمبولینس بلائیں۔" },
    { en: "I am lost.", ar: "أنا تائه.", ur: "میں راستہ بھول گیا/گئی ہوں۔" },
    { en: "Police emergency: 999 / 911", ar: "الشرطة: ٩٩٩", ur: "پولیس: 999" }
  ]
}

  var HAJJ_DUAS = [
  { title: "Talbiyah", ar: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لا شَرِيكَ لَكَ", en: "Here I am, O Allah, here I am…" },
  { title: "Entering the Masjid", ar: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", en: "O Allah, open for me the doors of Your mercy." },
  { title: "Leaving the Masjid", ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", en: "O Allah, I ask You from Your bounty." }
]

  var HAJJ_RITES = [
  { t: "Intention & Ihram", d: "Make niyyah for Hajj. Enter the state of Ihram at or before the miqat. Men: two white unstitched cloths. Women: modest hijab (no face/hand covering required as niqab/gloves in Ihram). Recite the Talbiyah." },
  { t: "Arrive Makkah · enter Haram", d: "Enter with calm and humility. Du'a when entering the masjid. Keep your group meeting point written in Notes." },
  { t: "Tawaf al-Qudum", d: "Arrival tawaf (if required by your rite). Seven circuits around the Kaaba, starting at the Black Stone line, counterclockwise. Then two rak'ahs if possible." },
  { t: "Sa'i (Safa & Marwah)", d: "Seven lengths between Safa and Marwah, beginning at Safa. Men may hasten between the green lights. Complete with du'a and calm walking." },
  { t: "Mina (8 Dhul-Hijjah)", d: "Travel to Mina after Fajr or as your group plans. Shorten prayers if traveling. Rest, hydrate, remember Allah. Stay overnight." },
  { t: "Arafah (9 Dhul-Hijjah)", d: "The pillar of Hajj. Stand in du'a from after zawal until Maghrib. Seek forgiveness abundantly. Do not leave before sunset (for the standing)." },
  { t: "Muzdalifah", d: "After Maghrib+Isha (combined per guidance), rest under the open sky. Collect pebbles for Jamarat if needed. Fajr in Muzdalifah for most pilgrims." },
  { t: "Jamarat (stoning)", d: "Stone Jamrat al-Aqabah on 10th; then the three jamarat on Tashreeq days as per your school/guide. Use small pebbles; say Allahu Akbar with each throw." },
  { t: "Qurbani (sacrifice)", d: "Offer the hady/sacrifice as arranged by your package or personally. Intention is for Allah alone. Keep confirmation/receipt in Notes." },
  { t: "Halq or Taqsir", d: "Men: shave (halq) or shorten (taqsir) the hair. Women: trim a fingertip length. This releases many Ihram restrictions." },
  { t: "Tawaf al-Ifadah", d: "Essential tawaf of Hajj. Seven circuits when your group schedules. Can be delayed within the allowed days — follow your guide." },
  { t: "Sa'i (if still due)", d: "If Sa'i was not completed with Qudum or your rite requires it after Ifadah, complete Sa'i between Safa and Marwah." },
  { t: "Days of Tashreeq", d: "11–13 Dhul-Hijjah in Mina. Stoning each day (timing per guidance). Remember Allah much. Stay hydrated and rested." },
  { t: "Farewell Tawaf (Wada')", d: "Final tawaf before leaving Makkah. Make it your last rite in the Haram when possible. Soften the heart; ask Allah for acceptance." }
]

  g.CuLinguaHajjData = {
    phrases: HAJJ_PHRASES,
    duas: typeof HAJJ_DUAS !== "undefined" ? HAJJ_DUAS : [],
    rites: typeof HAJJ_RITES !== "undefined" ? HAJJ_RITES : []
  };
})(window);
