/**
 * Clarity Lab · Lingua offline packs (extracted)
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_LINGUA_OFFLINE_V1__) return;
  g.__CU_LINGUA_OFFLINE_V1__ = true;

  var OFFLINE_PAIRS = new Set(["en|ar", "ar|en", "en|ur", "ur|en", "ar|ur", "ur|ar"]);

  var OFFLINE = {
  "en|ar": {
    "hello":"مرحبا","hi":"أهلاً","good morning":"صباح الخير","good afternoon":"مساء الخير",
    "good evening":"مساء الخير","good night":"تصبح على خير","goodbye":"وداعاً","bye":"مع السلامة",
    "thank you":"شكراً","thanks":"شكراً","please":"من فضلك","yes":"نعم","no":"لا","ok":"حسناً","okay":"حسناً",
    "sorry":"آسف","excuse me":"اعذرني","how are you":"كيف حالك؟","how are you?":"كيف حالك؟",
    "i am fine":"أنا بخير","i'm fine":"أنا بخير","what is your name":"ما اسمك؟","what is your name?":"ما اسمك؟",
    "my name is":"اسمي","nice to meet you":"تشرفنا","where is":"أين",
    "where is the bathroom":"أين الحمام؟","where is the bathroom?":"أين الحمام؟",
    "how much":"كم السعر؟","how much?":"كم السعر؟","how much is this":"بكم هذا؟",
    "i need help":"أحتاج مساعدة","help":"مساعدة","water":"ماء","food":"طعام","bread":"خبز",
    "tea":"شاي","coffee":"قهوة","milk":"حليب","i love you":"أحبك","i don't understand":"لا أفهم",
    "do you speak english":"هل تتكلم الإنجليزية؟","do you speak english?":"هل تتكلم الإنجليزية؟",
    "what time is it":"كم الساعة؟","what time is it?":"كم الساعة؟",
    "today":"اليوم","tomorrow":"غداً","yesterday":"أمس","left":"يسار","right":"يمين","straight":"مباشرة",
    "stop":"قف","go":"اذهب","come":"تعال","open":"افتح","close":"أغلق",
    "one":"واحد","two":"اثنان","three":"ثلاثة","four":"أربعة","five":"خمسة",
    "six":"ستة","seven":"سبعة","eight":"ثمانية","nine":"تسعة","ten":"عشرة",
    "welcome":"أهلاً وسهلاً","good luck":"حظاً سعيداً","congratulations":"مبروك",
    "happy birthday":"عيد ميلاد سعيد","i am hungry":"أنا جائع","i am thirsty":"أنا عطشان",
    "where are you from":"من أين أنت؟","where are you from?":"من أين أنت؟","i am from":"أنا من",
    "see you later":"أراك لاحقاً","see you":"أراك","good":"جيد","bad":"سيء","beautiful":"جميل",
    "friend":"صديق","family":"عائلة","home":"منزل","school":"مدرسة","hospital":"مستشفى",
    "mosque":"مسجد","airport":"مطار","hotel":"فندق","restaurant":"مطعم","taxi":"تاكسي",
    "phone":"هاتف","money":"مال","book":"كتاب","door":"باب","window":"نافذة",
    "car":"سيارة","bus":"حافلة","train":"قطار","plane":"طائرة"
  },
  "ar|en": {

    "مرحبا":"Hello",
    "مرحباً":"Hello",
    "اهلا":"Hi",
    "أهلا":"Hi",
    "كيف حالك":"How are you",
    "كيف الحال":"How are you",
    "بخير":"Fine",
    "الحمد لله":"Praise be to Allah",
    "شكرا":"Thank you",
    "شكراً":"Thank you",
    "من فضلك":"Please",
    "نعم":"Yes",
    "لا":"No",
    "ماذا":"What",
    "أين":"Where",
    "متى":"When",
    "لماذا":"Why",
    "من":"Who",
    "أنا":"I",
    "أنت":"You",
    "هو":"He",
    "هي":"She",
    "نحن":"We",
    "اسمي":"My name is",
    "ما اسمك":"What is your name",
    "مع السلامة":"Goodbye",
    "إلى اللقاء":"See you",
    "صباح الخير":"Good morning",
    "مساء الخير":"Good evening",
    "طبعا":"Of course",
    "حسنا":"Okay",
    "حسناً":"Okay",
    "أريد":"I want",
    "أحتاج":"I need",
    "مساعدة":"Help",
    "ماء":"Water",
    "طعام":"Food",
    "بيت":"House",
    "مسجد":"Mosque",
    "كتاب":"Book",
    "الله":"Allah",
    "قرآن":"Quran",
    "صلاة":"Prayer",

    "مرحبا":"Hello","أهلاً":"Hi","أهلا":"Hi","صباح الخير":"Good morning","مساء الخير":"Good evening",
    "تصبح على خير":"Good night","وداعاً":"Goodbye","وداعا":"Goodbye","مع السلامة":"Bye",
    "شكراً":"Thank you","شكرا":"Thank you","من فضلك":"Please","نعم":"Yes","لا":"No",
    "حسناً":"OK","حسنا":"OK","آسف":"Sorry","اعذرني":"Excuse me",
    "كيف حالك؟":"How are you?","كيف حالك":"How are you?","أنا بخير":"I am fine",
    "ما اسمك؟":"What is your name?","ما اسمك":"What is your name?","اسمي":"My name is",
    "تشرفنا":"Nice to meet you","أين":"Where is","أين الحمام؟":"Where is the bathroom?",
    "أين الحمام":"Where is the bathroom?","كم السعر؟":"How much?","كم السعر":"How much?",
    "بكم هذا؟":"How much is this?","أحتاج مساعدة":"I need help","مساعدة":"Help",
    "ماء":"Water","طعام":"Food","خبز":"Bread","شاي":"Tea","قهوة":"Coffee","حليب":"Milk",
    "أحبك":"I love you","لا أفهم":"I don't understand","هل تتكلم الإنجليزية؟":"Do you speak English?",
    "كم الساعة؟":"What time is it?","اليوم":"Today","غداً":"Tomorrow","غدا":"Tomorrow","أمس":"Yesterday",
    "يسار":"Left","يمين":"Right","مباشرة":"Straight","قف":"Stop","اذهب":"Go","تعال":"Come",
    "افتح":"Open","أغلق":"Close","واحد":"One","اثنان":"Two","ثلاثة":"Three","أربعة":"Four","خمسة":"Five",
    "ستة":"Six","سبعة":"Seven","ثمانية":"Eight","تسعة":"Nine","عشرة":"Ten",
    "أهلاً وسهلاً":"Welcome","حظاً سعيداً":"Good luck","مبروك":"Congratulations",
    "عيد ميلاد سعيد":"Happy birthday","أنا جائع":"I am hungry","أنا عطشان":"I am thirsty",
    "من أين أنت؟":"Where are you from?","أنا من":"I am from","أراك لاحقاً":"See you later","أراك":"See you",
    "جيد":"Good","سيء":"Bad","جميل":"Beautiful","صديق":"Friend","عائلة":"Family","منزل":"Home",
    "مدرسة":"School","مستشفى":"Hospital","مسجد":"Mosque","مطار":"Airport","فندق":"Hotel",
    "مطعم":"Restaurant","تاكسي":"Taxi","هاتف":"Phone","مال":"Money","كتاب":"Book",
    "باب":"Door","نافذة":"Window","سيارة":"Car","حافلة":"Bus","قطار":"Train","طائرة":"Plane",
    "بسم الله الرحمن الرحيم":"In the name of Allah, the Most Gracious, the Most Merciful",
    "الحمد لله رب العالمين":"All praise is for Allah, Lord of the worlds",
    "الرحمن الرحيم":"The Most Gracious, the Most Merciful",
    "مالك يوم الدين":"Master of the Day of Judgment",
    "إياك نعبد وإياك نستعين":"You alone we worship, and You alone we ask for help",
    "اهدنا الصراط المستقيم":"Guide us to the straight path",
    "صراط الذين أنعمت عليهم":"The path of those upon whom You have bestowed favor",
    "غير المغضوب عليهم ولا الضالين":"Not of those who have evoked [Your] anger or of those who are astray",
    "الله أكبر":"Allah is the Greatest",
    "سبحان الله":"Glory be to Allah",
    "الحمد لله":"All praise is for Allah",
    "لا إله إلا الله":"There is no god but Allah",
    "أستغفر الله":"I seek forgiveness from Allah",
    "إن شاء الله":"If Allah wills",
    "ما شاء الله":"What Allah has willed",
    "بارك الله فيك":"May Allah bless you",
    "جزاك الله خيرا":"May Allah reward you with good",
    "السلام عليكم":"Peace be upon you",
    "وعليكم السلام":"And upon you be peace",
    "ورحمة الله وبركاته":"And the mercy of Allah and His blessings",

  },
  "en|ur": {
    "hello":"ہیلو","hi":"سلام","good morning":"صبح بخیر","good afternoon":"شام بخیر",
    "good evening":"شام بخیر","good night":"شب بخیر","goodbye":"خدا حافظ","bye":"اللہ حافظ",
    "thank you":"شکریہ","thanks":"شکریہ","please":"براہ کرم","yes":"ہاں","no":"نہیں",
    "ok":"ٹھیک ہے","okay":"ٹھیک ہے","sorry":"معاف کیجیے","excuse me":"معذرت",
    "how are you":"آپ کیسے ہیں؟","how are you?":"آپ کیسے ہیں؟",
    "i am fine":"میں ٹھیک ہوں","i'm fine":"میں ٹھیک ہوں",
    "what is your name":"آپ کا نام کیا ہے؟","what is your name?":"آپ کا نام کیا ہے؟",
    "my name is":"میرا نام ہے","nice to meet you":"آپ سے مل کر خوشی ہوئی","where is":"کہاں ہے",
    "where is the bathroom":"باتھ روم کہاں ہے؟","where is the bathroom?":"باتھ روم کہاں ہے؟",
    "how much":"کتنے کا ہے؟","how much?":"کتنے کا ہے؟","how much is this":"یہ کتنے کا ہے؟",
    "i need help":"مجھے مدد چاہیے","help":"مدد","water":"پانی","food":"کھانا","bread":"روٹی",
    "tea":"چائے","coffee":"کافی","milk":"دودھ","i love you":"میں تم سے محبت کرتا ہوں",
    "i don't understand":"میں نہیں سمجھتا",
    "do you speak english":"کیا آپ انگریزی بولتے ہیں؟","do you speak english?":"کیا آپ انگریزی بولتے ہیں؟",
    "what time is it":"کتنا بجے ہیں؟","what time is it?":"کتنا بجے ہیں؟",
    "today":"آج","tomorrow":"کل","yesterday":"کل","left":"بائیں","right":"دائیں","straight":"سیدھا",
    "stop":"رکو","go":"جاؤ","come":"آؤ","open":"کھولو","close":"بند کرو",
    "one":"ایک","two":"دو","three":"تین","four":"چار","five":"پانچ",
    "six":"چھ","seven":"سات","eight":"آٹھ","nine":"نو","ten":"دس",
    "welcome":"خوش آمدید","good luck":"اچھی قسمت","congratulations":"مبارک ہو",
    "happy birthday":"سالگرہ مبارک","i am hungry":"مجھے بھوک لگی ہے","i am thirsty":"مجھے پیاس لگی ہے",
    "where are you from":"آپ کہاں سے ہیں؟","where are you from?":"آپ کہاں سے ہیں؟","i am from":"میں سے ہوں",
    "see you later":"بعد میں ملتے ہیں","see you":"ملتے ہیں","good":"اچھا","bad":"برا","beautiful":"خوبصورت",
    "friend":"دوست","family":"خاندان","home":"گھر","school":"اسکول","hospital":"ہسپتال",
    "mosque":"مسجد","airport":"ہوائی اڈا","hotel":"ہوٹل","restaurant":"ریستوراں","taxi":"ٹیکسی",
    "phone":"فون","money":"پیسہ","book":"کتاب","door":"دروازہ","window":"کھڑکی",
    "car":"گاڑی","bus":"بس","train":"ٹرین","plane":"جہاز"
  },
  "ur|en": {
    "ہیلو":"Hello","سلام":"Hi","صبح بخیر":"Good morning","شام بخیر":"Good evening","شب بخیر":"Good night",
    "خدا حافظ":"Goodbye","اللہ حافظ":"Bye","شکریہ":"Thank you","براہ کرم":"Please",
    "ہاں":"Yes","نہیں":"No","ٹھیک ہے":"OK","معاف کیجیے":"Sorry","معذرت":"Excuse me",
    "آپ کیسے ہیں؟":"How are you?","آپ کیسے ہیں":"How are you?","میں ٹھیک ہوں":"I am fine",
    "آپ کا نام کیا ہے؟":"What is your name?","آپ کا نام کیا ہے":"What is your name?",
    "میرا نام ہے":"My name is","آپ سے مل کر خوشی ہوئی":"Nice to meet you","کہاں ہے":"Where is",
    "باتھ روم کہاں ہے؟":"Where is the bathroom?","کتنے کا ہے؟":"How much?","یہ کتنے کا ہے؟":"How much is this?",
    "مجھے مدد چاہیے":"I need help","مدد":"Help","پانی":"Water","کھانا":"Food","روٹی":"Bread",
    "چائے":"Tea","کافی":"Coffee","دودھ":"Milk","میں تم سے محبت کرتا ہوں":"I love you",
    "میں نہیں سمجھتا":"I don't understand","کیا آپ انگریزی بولتے ہیں؟":"Do you speak English?",
    "کتنا بجے ہیں؟":"What time is it?","آج":"Today","کل":"Tomorrow / Yesterday",
    "بائیں":"Left","دائیں":"Right","سیدھا":"Straight","رکو":"Stop","جاؤ":"Go","آؤ":"Come",
    "کھولو":"Open","بند کرو":"Close","ایک":"One","دو":"Two","تین":"Three","چار":"Four","پانچ":"Five",
    "چھ":"Six","سات":"Seven","آٹھ":"Eight","نو":"Nine","دس":"Ten",
    "خوش آمدید":"Welcome","اچھی قسمت":"Good luck","مبارک ہو":"Congratulations",
    "سالگرہ مبارک":"Happy birthday","مجھے بھوک لگی ہے":"I am hungry","مجھے پیاس لگی ہے":"I am thirsty",
    "آپ کہاں سے ہیں؟":"Where are you from?","میں سے ہوں":"I am from",
    "بعد میں ملتے ہیں":"See you later","ملتے ہیں":"See you","اچھا":"Good","برا":"Bad","خوبصورت":"Beautiful",
    "دوست":"Friend","خاندان":"Family","گھر":"Home","اسکول":"School","ہسپتال":"Hospital",
    "مسجد":"Mosque","ہوائی اڈا":"Airport","ہوٹل":"Hotel","ریستوراں":"Restaurant","ٹیکسی":"Taxi",
    "فون":"Phone","پیسہ":"Money","کتاب":"Book","دروازہ":"Door","کھڑکی":"Window",
    "گاڑی":"Car","بس":"Bus","ٹرین":"Train","جہاز":"Plane"
  },
  "ar|ur": {
    "مرحبا":"ہیلو","أهلاً":"سلام","صباح الخير":"صبح بخیر","مساء الخير":"شام بخیر",
    "تصبح على خير":"شب بخیر","وداعاً":"خدا حافظ","مع السلامة":"اللہ حافظ","شكراً":"شکریہ",
    "من فضلك":"براہ کرم","نعم":"ہاں","لا":"نہیں","حسناً":"ٹھیک ہے","آسف":"معاف کیجیے",
    "كيف حالك؟":"آپ کیسے ہیں؟","أنا بخير":"میں ٹھیک ہوں","ما اسمك؟":"آپ کا نام کیا ہے؟",
    "اسمي":"میرا نام ہے","أين الحمام؟":"باتھ روم کہاں ہے؟","أحتاج مساعدة":"مجھے مدد چاہیے",
    "ماء":"پانی","طعام":"کھانا","خبز":"روٹی","شاي":"چائے","قهوة":"کافی","حليب":"دودھ",
    "أحبك":"میں تم سے محبت کرتا ہوں","لا أفهم":"میں نہیں سمجھتا",
    "واحد":"ایک","اثنان":"دو","ثلاثة":"تین","أربعة":"چار","خمسة":"پانچ",
    "أهلاً وسهلاً":"خوش آمدید","جيد":"اچھا","صديق":"دوست","منزل":"گھر","مسجد":"مسجد","كتاب":"کتاب"
  },
  "ur|ar": {
    "ہیلو":"مرحبا","سلام":"أهلاً","صبح بخیر":"صباح الخير","شام بخیر":"مساء الخير",
    "شب بخیر":"تصبح على خير","خدا حافظ":"وداعاً","اللہ حافظ":"مع السلامة","شکریہ":"شكراً",
    "براہ کرم":"من فضلك","ہاں":"نعم","نہیں":"لا","ٹھیک ہے":"حسناً","معاف کیجیے":"آسف",
    "آپ کیسے ہیں؟":"كيف حالك؟","میں ٹھیک ہوں":"أنا بخير","آپ کا نام کیا ہے؟":"ما اسمك؟",
    "میرا نام ہے":"اسمي","باتھ روم کہاں ہے؟":"أين الحمام؟","مجھے مدد چاہیے":"أحتاج مساعدة",
    "پانی":"ماء","کھانا":"طعام","روٹی":"خبز","چائے":"شاي","کافی":"قهوة","دودھ":"حليب",
    "میں تم سے محبت کرتا ہوں":"أحبك","میں نہیں سمجھتا":"لا أفهم",
    "ایک":"واحد","دو":"اثنان","تین":"ثلاثة","چار":"أربعة","پانچ":"خمسة",
    "خوش آمدید":"أهلاً وسهلاً","اچھا":"جيد","دوست":"صديق","گھر":"منزل","مسجد":"مسجد","کتاب":"كتاب"
  }
}

  function offlineTranslate(text, sl, tl) {
    var key = (sl === "auto" ? "en" : sl) + "|" + tl;
    if (!OFFLINE_PAIRS.has(key)) return null;
    var dict = OFFLINE[key];
    if (!dict) return null;
    var raw = String(text || "").trim();
    if (!raw) return null;
    var lower = raw.toLowerCase();
    if (dict[raw]) return dict[raw];
    if (dict[lower]) return dict[lower];
    var stripped = lower.replace(/[?.!،؟]+$/u, "").trim();
    if (dict[stripped]) return dict[stripped];
    var words = raw.split(/\s+/).filter(Boolean);
    if (words.length && words.length <= 8) {
      var hits = 0;
      var parts = words.map(function (w) {
        var lw = w.toLowerCase().replace(/[?.!،؟"'""]+$/u, "").replace(/^["'""]+/u, "");
        var m = dict[w] || dict[lw];
        if (m) { hits++; return m; }
        return w;
      });
      if (hits >= Math.ceil(words.length * 0.5) && hits > 0) return parts.join(" ");
    }
    return null;
  }

  function isOfflinePair(sl, tl) {
    var s = sl === "auto" ? "en" : sl;
    return OFFLINE_PAIRS.has(s + "|" + tl);
  }

  g.CuLinguaOffline = {
    pairs: OFFLINE_PAIRS,
    dict: OFFLINE,
    translate: offlineTranslate,
    isPair: isOfflinePair
  };
})(window);
