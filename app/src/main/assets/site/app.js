const CATALOG_URLS=['./reciters.json','https://mp3quran.net/api/v3/reciters?language=ar','https://cdn.jsdelivr.net/gh/uthumany/Quran-Fast-Api-json@main/data/quran_reciters.json','https://raw.githubusercontent.com/uthumany/Quran-Fast-Api-json/main/data/quran_reciters.json'];
const QURAN_URL='https://api.alquran.cloud/v1';
const names=['الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس','هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه','الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم','لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر','فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق','الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة','الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج','نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس','التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد','الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات','القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر','المسد','الإخلاص','الفلق','الناس'];
let reciters=[],selected=null,currentSurah=1,ayahs=[],timings=[],currentAyahIndex=0,audioCandidates=[],candidateIndex=0;

const SURAH_NAMES={
  ar:names,
  en:['Al-Fatihah','Al-Baqarah','Aal-E-Imran','An-Nisa','Al-Ma’idah','Al-An’am','Al-A’raf','Al-Anfal','At-Tawbah','Yunus','Hud','Yusuf','Ar-Ra’d','Ibrahim','Al-Hijr','An-Nahl','Al-Isra','Al-Kahf','Maryam','Ta-Ha','Al-Anbiya','Al-Hajj','Al-Mu’minun','An-Nur','Al-Furqan','Ash-Shu’ara','An-Naml','Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajdah','Al-Ahzab','Saba','Fatir','Ya-Sin','As-Saffat','Sad','Az-Zumar','Ghafir','Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiyah','Al-Ahqaf','Muhammad','Al-Fath','Al-Hujurat','Qaf','Adh-Dhariyat','At-Tur','An-Najm','Al-Qamar','Ar-Rahman','Al-Waqi’ah','Al-Hadid','Al-Mujadilah','Al-Hashr','Al-Mumtahanah','As-Saff','Al-Jumu’ah','Al-Munafiqun','At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah','Al-Ma’arij','Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyamah','Al-Insan','Al-Mursalat','An-Naba','An-Nazi’at','Abasa','At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj','At-Tariq','Al-A’la','Al-Ghashiyah','Al-Fajr','Al-Balad','Ash-Shams','Al-Layl','Ad-Duha','Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah','Al-Adiyat','Al-Qari’ah','At-Takathur','Al-Asr','Al-Humazah','Al-Fil','Quraysh','Al-Ma’un','Al-Kawthar','Al-Kafirun','An-Nasr','Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas'],
  tr:['Fâtiha','Bakara','Âl-i İmrân','Nisâ','Mâide','En’âm','A’râf','Enfâl','Tevbe','Yûnus','Hûd','Yûsuf','Ra’d','İbrâhim','Hicr','Nahl','İsrâ','Kehf','Meryem','Tâhâ','Enbiyâ','Hac','Mü’minûn','Nûr','Furkân','Şuarâ','Neml','Kasas','Ankebût','Rûm','Lokmân','Secde','Ahzâb','Sebe','Fâtır','Yâsîn','Sâffât','Sâd','Zümer','Gâfir','Fussilet','Şûrâ','Zuhruf','Duhân','Câsiye','Ahkâf','Muhammed','Fetih','Hucurât','Kâf','Zâriyât','Tûr','Necm','Kamer','Rahmân','Vâkıa','Hadîd','Mücâdele','Haşr','Mümtehine','Saf','Cuma','Münâfikûn','Tegâbün','Talâk','Tahrîm','Mülk','Kalem','Hâkka','Meâric','Nûh','Cin','Müzzemmil','Müddessir','Kıyâmet','İnsan','Mürselât','Nebe','Nâziât','Abese','Tekvîr','İnfitâr','Mutaffifîn','İnşikâk','Bürûc','Târık','A’lâ','Gâşiye','Fecr','Beled','Şems','Leyl','Duhâ','İnşirâh','Tîn','Alak','Kadr','Beyyine','Zilzâl','Âdiyât','Kâria','Tekâsür','Asr','Hümeze','Fîl','Kureyş','Mâûn','Kevser','Kâfirûn','Nasr','Mesed','İhlâs','Felak','Nâs'],
  fr:['Al-Fatiha','Al-Baqarah','Al-Imran','An-Nisa','Al-Maida','Al-Anam','Al-Araf','Al-Anfal','At-Tawbah','Yunus','Hud','Yusuf','Ar-Rad','Ibrahim','Al-Hijr','An-Nahl','Al-Isra','Al-Kahf','Maryam','Ta-Ha','Al-Anbiya','Al-Hajj','Al-Muminun','An-Nur','Al-Furqan','Ash-Shuara','An-Naml','Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajdah','Al-Ahzab','Saba','Fatir','Ya-Sin','As-Saffat','Sad','Az-Zumar','Ghafir','Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiyah','Al-Ahqaf','Muhammad','Al-Fath','Al-Hujurat','Qaf','Adh-Dhariyat','At-Tur','An-Najm','Al-Qamar','Ar-Rahman','Al-Waqiah','Al-Hadid','Al-Mujadilah','Al-Hashr','Al-Mumtahanah','As-Saff','Al-Jumuah','Al-Munafiqun','At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah','Al-Maarij','Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyamah','Al-Insan','Al-Mursalat','An-Naba','An-Naziat','Abasa','At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj','At-Tariq','Al-Ala','Al-Ghashiyah','Al-Fajr','Al-Balad','Ash-Shams','Al-Layl','Ad-Duha','Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah','Al-Adiyat','Al-Qariah','At-Takathur','Al-Asr','Al-Humazah','Al-Fil','Quraysh','Al-Maun','Al-Kawthar','Al-Kafirun','An-Nasr','Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas'],
  ur:['الفاتحہ','البقرہ','آل عمران','النساء','المائدہ','الانعام','الاعراف','الانفال','التوبہ','یونس','ہود','یوسف','الرعد','ابراہیم','الحجر','النحل','الاسراء','الکہف','مریم','طٰہٰ','الانبیاء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنکبوت','الروم','لقمان','السجدہ','الاحزاب','سبا','فاطر','یٰسین','الصافات','ص','الزمر','غافر','فصلت','الشوریٰ','الزخرف','الدخان','الجاثیہ','الاحقاف','محمد','الفتح','الحجرات','ق','الذاریات','الطور','النجم','القمر','الرحمن','الواقعہ','الحدید','المجادلہ','الحشر','الممتحنہ','الصف','الجمعہ','المنافقون','التغابن','الطلاق','التحریم','الملک','القلم','الحاقہ','المعارج','نوح','الجن','المزمل','المدثر','القیامہ','الانسان','المرسلات','النبا','النازعات','عبس','التکویر','الانفطار','المطففین','الانشقاق','البروج','الطارق','الاعلی','الغاشیہ','الفجر','البلد','الشمس','اللیل','الضحیٰ','الشرح','التین','العلق','القدر','البینہ','الزلزال','العادیات','القارعہ','التکاثر','العصر','الہمزہ','الفیل','قریش','الماعون','الکوثر','الکافرون','النصر','المسد','الاخلاص','الفلق','الناس'],
  id:['Al-Fatihah','Al-Baqarah','Ali Imran','An-Nisa','Al-Ma’idah','Al-An’am','Al-A’raf','Al-Anfal','At-Taubah','Yunus','Hud','Yusuf','Ar-Ra’d','Ibrahim','Al-Hijr','An-Nahl','Al-Isra','Al-Kahf','Maryam','Taha','Al-Anbiya','Al-Hajj','Al-Mu’minun','An-Nur','Al-Furqan','Asy-Syu’ara','An-Naml','Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajdah','Al-Ahzab','Saba','Fatir','Yasin','As-Saffat','Sad','Az-Zumar','Ghafir','Fussilat','Asy-Syura','Az-Zukhruf','Ad-Dukhan','Al-Jasiyah','Al-Ahqaf','Muhammad','Al-Fath','Al-Hujurat','Qaf','Az-Zariyat','At-Tur','An-Najm','Al-Qamar','Ar-Rahman','Al-Waqiah','Al-Hadid','Al-Mujadilah','Al-Hasyr','Al-Mumtahanah','As-Saff','Al-Jumuah','Al-Munafiqun','At-Tagabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah','Al-Ma’arij','Nuh','Al-Jinn','Al-Muzzammil','Al-Muddatstsir','Al-Qiyamah','Al-Insan','Al-Mursalat','An-Naba','An-Naziat','Abasa','At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Insyiqaq','Al-Buruj','At-Tariq','Al-A’la','Al-Ghasyiyah','Al-Fajr','Al-Balad','Asy-Syams','Al-Lail','Ad-Duha','Asy-Syarh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah','Al-Adiyat','Al-Qari’ah','At-Takatsur','Al-Asr','Al-Humazah','Al-Fil','Quraisy','Al-Ma’un','Al-Kautsar','Al-Kafirun','An-Nasr','Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas']
};
function surahName(n){const L=currentLang(); const arr=SURAH_NAMES[L]||SURAH_NAMES.ar; return arr[n-1]||names[n-1];}

const RECITER_FAV_KEY='quran_favorite_reciters';
let favoriteReciters=new Set();try{const rawFavoriteReciters=localStorage.getItem(RECITER_FAV_KEY);const parsed=rawFavoriteReciters?JSON.parse(rawFavoriteReciters):[];favoriteReciters=new Set(Array.isArray(parsed)?parsed:[]);}catch{favoriteReciters=new Set();}
const SETTINGS_KEY='noor_muslim_settings_v51';

const UI_LANGS={
 ar:{name:'العربية',dir:'rtl',texts:{'القرآن الكريم':'القرآن الكريم','استماع صوتي':'استماع صوتي','⚙️ الإعدادات':'⚙️ الإعدادات','🎧 قرآن صوتي فقط':'🎧 قرآن صوتي فقط','استمع إلى كتاب الله':'استمع إلى كتاب الله','بأصوات القرّاء':'بأصوات القرّاء','اختر القارئ ثم السورة وابدأ الاستماع مباشرة.':'اختر القارئ ثم السورة وابدأ الاستماع مباشرة.','📲 تثبيت الموقع على الهاتف':'📲 تثبيت الموقع على الهاتف','كل قارئ ظاهر هنا مرتبط بتلاوة كاملة للسور الـ114.':'كل قارئ ظاهر هنا مرتبط بتلاوة كاملة للسور الـ114.','تلاوة كاملة':'تلاوة كاملة','كل القرّاء':'كل القرّاء','⭐ المفضلة':'⭐ المفضلة','اختيار السورة':'اختيار السورة','القارئ':'القارئ','⬇ تنزيل الكل':'⬇ تنزيل الكل','✓ تم تنزيل الكل':'✓ تم تنزيل الكل','إغلاق':'إغلاق','تخصيص التطبيق':'تخصيص التطبيق','إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.':'إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.','🔊 الصوت والتشغيل':'🔊 الصوت والتشغيل','مستوى الصوت':'مستوى الصوت','تشغيل السورة التالية تلقائيًا':'تشغيل السورة التالية تلقائيًا','التشغيل التلقائي عند اختيار السورة':'التشغيل التلقائي عند اختيار السورة','🎨 المظهر والقراءة':'🎨 المظهر والقراءة','الوضع الداكن':'الوضع الداكن','حجم الخط':'حجم الخط','صغير':'صغير','متوسط':'متوسط','كبير':'كبير','🔔 التنبيهات':'🔔 التنبيهات','السماح بتنبيهات القرآن الكريم':'السماح بتنبيهات القرآن الكريم','التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.':'التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.','📥 التنزيلات':'📥 التنزيلات','🗑️ إدارة السور المحفوظة':'🗑️ إدارة السور المحفوظة','🌐 اللغة':'🌐 اللغة','لغة واجهة التطبيق':'لغة واجهة التطبيق','تتغير واجهة التطبيق حسب اللغة المختارة، بينما يبقى نص القرآن الكريم باللغة العربية.':'تتغير واجهة التطبيق حسب اللغة المختارة، بينما يبقى نص القرآن الكريم باللغة العربية.','ℹ️ حول القرآن الكريم':'ℹ️ حول القرآن الكريم','ملاحظة مهمة:':'ملاحظة مهمة:'},langs:'العربية'},
 en:{name:'English',dir:'ltr',texts:{'القرآن الكريم':'Holy Quran','استماع صوتي':'Audio Recitation','⚙️ الإعدادات':'⚙️ Settings','🎧 قرآن صوتي فقط':'🎧 Audio Quran','استمع إلى كتاب الله':'Listen to the Book of Allah','بأصوات القرّاء':'With Quran Reciters','اختر القارئ ثم السورة وابدأ الاستماع مباشرة.':'Choose a reciter, then a surah, and start listening.','📲 تثبيت الموقع على الهاتف':'📲 Install on phone','كل قارئ ظاهر هنا مرتبط بتلاوة كاملة للسور الـ114.':'Each reciter has a complete recitation of all 114 surahs.','تلاوة كاملة':'Complete recitation','كل القرّاء':'All Reciters','⭐ المفضلة':'⭐ Favorites','اختيار السورة':'Choose a surah','القارئ':'Reciter','⬇ تنزيل الكل':'⬇ Download All','✓ تم تنزيل الكل':'✓ Downloaded All','إغلاق':'Close','تخصيص التطبيق':'Customize the app','إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.':'Settings for serving users only — no ads or subscriptions.','🔊 الصوت والتشغيل':'🔊 Audio & Playback','مستوى الصوت':'Volume','تشغيل السورة التالية تلقائيًا':'Auto-play next surah','التشغيل التلقائي عند اختيار السورة':'Auto-play when selecting a surah','🎨 المظهر والقراءة':'🎨 Appearance & Reading','الوضع الداكن':'Dark mode','حجم الخط':'Font size','صغير':'Small','متوسط':'Medium','كبير':'Large','🔔 التنبيهات':'🔔 Notifications','السماح بتنبيهات القرآن الكريم':'Allow Quran notifications','التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.':'Notifications are optional; Quran reminders may be sent every 4 hours and are never used for ads.','📥 التنزيلات':'📥 Downloads','🗑️ إدارة السور المحفوظة':'🗑️ Manage saved surahs','🌐 اللغة':'🌐 Language','لغة واجهة التطبيق':'App interface language','تتغير واجهة التطبيق حسب اللغة المختارة، بينما يبقى نص القرآن الكريم باللغة العربية.':'The interface changes with the selected language; Quran text remains Arabic.','ℹ️ حول القرآن الكريم':'ℹ️ About the Holy Quran','ملاحظة مهمة:':'Important note:','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'Each reciter shows the surahs available to them; incomplete recordings are not presented as complete.'},langs:'English'},
 tr:{name:'Türkçe',dir:'ltr',texts:{'القرآن الكريم':'Kur’an-ı Kerim','استماع صوتي':'Sesli Tilavet','⚙️ الإعدادات':'⚙️ Ayarlar','🎧 قرآن صوتي فقط':'🎧 Sadece Sesli Kur’an','استمع إلى كتاب الله':'Allah’ın Kitabı’nı dinleyin','بأصوات القرّاء':'Kur’an okuyucularının sesleriyle','اختر القارئ ثم السورة وابدأ الاستماع مباشرة.':'Okuyucuyu ve sureyi seçin, hemen dinlemeye başlayın.','📲 تثبيت الموقع على الهاتف':'📲 Telefona yükle','كل قارئ ظاهر هنا مرتبط بتلاوة كاملة للسور الـ114.':'Her okuyucuda 114 surenin tamamı bulunur.','تلاوة كاملة':'Tam tilavet','كل القرّاء':'Tüm Okuyucular','⭐ المفضلة':'⭐ Favoriler','اختيار السورة':'Sure seçin','القارئ':'Okuyucu','⬇ تنزيل الكل':'⬇ Tümünü indir','✓ تم تنزيل الكل':'✓ Tümü indirildi','إغلاق':'Kapat','🔊 الصوت والتشغيل':'🔊 Ses ve oynatma','مستوى الصوت':'Ses seviyesi','تشغيل السورة التالية تلقائيًا':'Sonraki sureyi otomatik oynat','التشغيل التلقائي عند اختيار السورة':'Sure seçilince otomatik oynat','🎨 المظهر والقراءة':'🎨 Görünüm ve okuma','الوضع الداكن':'Karanlık mod','حجم الخط':'Yazı boyutu','صغير':'Küçük','متوسط':'Orta','كبير':'Büyük','🔔 التنبيهات':'🔔 Bildirimler','السماح بتنبيهات القرآن الكريم':'Kur’an bildirimlerine izin ver','📥 التنزيلات':'📥 İndirmeler','🗑️ إدارة السور المحفوظة':'🗑️ Kayıtlı sureleri yönet','🌐 اللغة':'🌐 Dil','لغة واجهة التطبيق':'Uygulama dili','تتغير واجهة التطبيق حسب اللغة المختارة، بينما يبقى نص القرآن الكريم باللغة العربية.':'Arayüz seçilen dile göre değişir; Kur’an metni Arapça kalır.','ℹ️ حول القرآن الكريم':'ℹ️ Kur’an-ı Kerim hakkında','ملاحظة مهمة:':'Önemli not:','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'Her okuyucunun mevcut sureleri gösterilir; eksik kayıtlar tam tilavet olarak sunulmaz.'},langs:'Türkçe'},
 fr:{name:'Français',dir:'ltr',texts:{'القرآن الكريم':'Coran','استماع صوتي':'Récitation audio','⚙️ الإعدادات':'⚙️ Paramètres','🎧 قرآن صوتي فقط':'🎧 Coran audio','استمع إلى كتاب الله':'Écoutez le Livre d’Allah','بأصوات القرّاء':'Avec les récitations des lecteurs','اختر القارئ ثم السورة وابدأ الاستماع مباشرة.':'Choisissez un lecteur puis une sourate pour commencer.','📲 تثبيت الموقع على الهاتف':'📲 Installer sur le téléphone','كل القرّاء':'Tous les lecteurs','⭐ المفضلة':'⭐ Favoris','اختيار السورة':'Choisir une sourate','القارئ':'Lecteur','⬇ تنزيل الكل':'⬇ Tout télécharger','✓ تم تنزيل الكل':'✓ Tout téléchargé','إغلاق':'Fermer','🔊 الصوت والتشغيل':'🔊 Audio et lecture','مستوى الصوت':'Volume','تشغيل السورة التالية تلقائيًا':'Lire la sourate suivante automatiquement','التشغيل التلقائي عند اختيار السورة':'Lecture automatique à la sélection','🎨 المظهر والقراءة':'🎨 Apparence et lecture','الوضع الداكن':'Mode sombre','حجم الخط':'Taille du texte','صغير':'Petit','متوسط':'Moyen','كبير':'Grand','🔔 التنبيهات':'🔔 Notifications','السماح بتنبيهات القرآن الكريم':'Autoriser les notifications','📥 التنزيلات':'📥 Téléchargements','🗑️ إدارة السور المحفوظة':'🗑️ Gérer les sourates enregistrées','🌐 اللغة':'🌐 Langue','لغة واجهة التطبيق':'Langue de l’application','تتغير واجهة التطبيق حسب اللغة المختارة، بينما يبقى نص القرآن الكريم باللغة العربية.':'L’interface change selon la langue; le texte du Coran reste en arabe.','ℹ️ حول القرآن الكريم':'ℹ️ À propos du Saint Coran','ملاحظة مهمة:':'Note importante :','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'Les sourates disponibles sont affichées pour chaque lecteur ; les enregistrements incomplets ne sont pas présentés comme complets.'},langs:'Français'},
 ur:{name:'اردو',dir:'rtl',texts:{'القرآن الكريم':'قرآن کریم','استماع صوتي':'آڈیو تلاوت','⚙️ الإعدادات':'⚙️ ترتیبات','🎧 قرآن صوتي فقط':'🎧 صرف قرآن آڈیو','استمع إلى كتاب الله':'اللہ کی کتاب سنیں','بأصوات القرّاء':'قرآن کے قراء کی آوازوں میں','اختر القارئ ثم السورة وابدأ الاستماع مباشرة.':'قاری اور سورت منتخب کریں اور فوراً سماعت شروع کریں۔','📲 تثبيت الموقع على الهاتف':'📲 فون پر انسٹال کریں','كل القرّاء':'تمام قراء','⭐ المفضلة':'⭐ پسندیدہ','اختيار السورة':'سورت منتخب کریں','القارئ':'قاری','⬇ تنزيل الكل':'⬇ سب ڈاؤن لوڈ کریں','🔊 الصوت والتشغيل':'🔊 آواز اور پلے بیک','مستوى الصوت':'آواز کی سطح','تشغيل السورة التالية تلقائيًا':'اگلی سورت خود چلائیں','التشغيل التلقائي عند اختيار السورة':'سورت منتخب کرتے ہی چلائیں','🎨 المظهر والقراءة':'🎨 ظاہری شکل اور مطالعہ','الوضع الداكن':'ڈارک موڈ','حجم الخط':'فونٹ سائز','صغير':'چھوٹا','متوسط':'درمیانہ','كبير':'بڑا','🔔 التنبيهات':'🔔 اطلاعات','السماح بتنبيهات القرآن الكريم':'قرآن کریم کی اطلاعات کی اجازت دیں','📥 التنزيلات':'📥 ڈاؤن لوڈز','🗑️ إدارة السور المحفوظة':'🗑️ محفوظ سورتوں کا انتظام','🌐 اللغة':'🌐 زبان','لغة واجهة التطبيق':'ایپ کی زبان','تتغير واجهة التطبيق حسب اللغة المختارة، بينما يبقى نص القرآن الكريم باللغة العربية.':'ایپ کی زبان تبدیل ہوگی، قرآن کا متن عربی ہی رہے گا۔','ℹ️ حول القرآن الكريم':'ℹ️ قرآن کریم کے بارے میں','ملاحظة مهمة:':'اہم نوٹ:','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'ہر قاری کے لیے دستیاب سورتیں دکھائی جاتی ہیں؛ نامکمل ریکارڈنگ کو مکمل تلاوت کے طور پر پیش نہیں کیا جاتا۔'},langs:'اردو'},
 id:{name:'Bahasa Indonesia',dir:'ltr',texts:{'القرآن الكريم':'Al-Qur’an','استماع صوتي':'Tilawah Audio','⚙️ الإعدادات':'⚙️ Pengaturan','🎧 قرآن صوتي فقط':'🎧 Al-Qur’an Audio','استمع إلى كتاب الله':'Dengarkan Kitab Allah','بأصوات القرّاء':'Dengan suara para qari','اختر القارئ ثم السورة وابدأ الاستماع مباشرة.':'Pilih qari dan surah untuk mulai mendengarkan.','📲 تثبيت الموقع على الهاتف':'📲 Pasang di ponsel','كل القرّاء':'Semua Qari','⭐ المفضلة':'⭐ Favorit','اختيار السورة':'Pilih surah','القارئ':'Qari','⬇ تنزيل الكل':'⬇ Unduh Semua','✓ تم تنزيل الكل':'✓ Semua Diunduh','إغلاق':'Tutup','🔊 الصوت والتشغيل':'🔊 Audio & Pemutaran','مستوى الصوت':'Volume','تشغيل السورة التالية تلقائيًا':'Putar surah berikutnya otomatis','التشغيل التلقائي عند اختيار السورة':'Putar otomatis saat memilih surah','🎨 المظهر والقراءة':'🎨 Tampilan & Bacaan','الوضع الداكن':'Mode gelap','حجم الخط':'Ukuran font','صغير':'Kecil','متوسط':'Sedang','كبير':'Besar','🔔 التنبيهات':'🔔 Notifikasi','السماح بتنبيهات القرآن الكريم':'Izinkan notifikasi Al-Qur’an','📥 التنزيلات':'📥 Unduhan','🗑️ إدارة السور المحفوظة':'🗑️ Kelola surah tersimpan','🌐 اللغة':'🌐 Bahasa','لغة واجهة التطبيق':'Bahasa aplikasi','تتغير واجهة التطبيق حسب اللغة المختارة، بينما يبقى نص القرآن الكريم باللغة العربية.':'Antarmuka berubah sesuai bahasa; teks Al-Qur’an tetap dalam bahasa Arab.','ℹ️ حول القرآن الكريم':'ℹ️ Tentang Al-Qur’an','ملاحظة مهمة:':'Catatan penting:','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'Surah yang tersedia untuk setiap qari ditampilkan; rekaman yang tidak lengkap tidak ditampilkan sebagai tilawah lengkap.'},langs:'Bahasa Indonesia'}
};
const EXTRA_UI={
 ar:{'ℹ️ ملاحظة مهمة':'ℹ️ ملاحظة مهمة','ملاحظة مهمة:':'ملاحظة مهمة:','السور التي يتم تنزيلها بنجاح تُحفظ على هذا الجهاز للاستماع إليها بدون إنترنت. قد يحذف المتصفح الملفات المحفوظة تلقائيًا إذا تم مسح بيانات الموقع أو التخزين المؤقت، لذلك لا تحذف بيانات الموقع إذا أردت الاحتفاظ بالسور المحفوظة.':'السور التي يتم تنزيلها بنجاح تُحفظ على هذا الجهاز للاستماع إليها بدون إنترنت. قد يحذف المتصفح الملفات المحفوظة تلقائيًا إذا تم مسح بيانات الموقع أو التخزين المؤقت، لذلك لا تحذف بيانات الموقع إذا أردت الاحتفاظ بالسور المحفوظة.','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.','ابحث عن قارئ…':'ابحث عن قارئ…','114 سورة كاملة':'114 سورة كاملة','سورة متاحة':'سورة متاحة','✓ تم تنزيل الكل':'✓ تم تنزيل الكل','⬇ تحميل الكل':'⬇ تحميل الكل','تم تحميل':'تم تحميل','القارئ الحالي':'القارئ الحالي','يتم الفتح عليه الآن':'يتم الفتح عليه الآن','مضاف إلى المفضلة':'مضاف إلى المفضلة','لا توجد نتيجة مطابقة.':'لا توجد نتيجة مطابقة.','ابحث عن سورة…':'ابحث عن سورة…','السور التي تعذر إكمال تنزيلها:':'السور التي تعذر إكمال تنزيلها:','جارٍ تنزيل السورة':'جارٍ تنزيل السورة','اكتمل تنزيل جميع السور':'اكتمل تنزيل جميع السور','يمكن إعادة الضغط على «تنزيل الكل» لمحاولة السور التي لم تُحفظ.':'يمكن إعادة الضغط على «تنزيل الكل» لمحاولة السور التي لم تُحفظ.','جارٍ تحميل دليل القرّاء…':'جارٍ تحميل دليل القرّاء…','تعذر تحميل الدليل الخارجي؛ تم عرض قائمة قرّاء جاهزة ويمكنك الاستماع والتنزيل مباشرة.':'تعذر تحميل الدليل الخارجي؛ تم عرض قائمة قرّاء جاهزة ويمكنك الاستماع والتنزيل مباشرة.','تم حفظ':'تم حفظ','بدون إنترنت':'بدون إنترنت','تعذر حفظ':'تعذر حفظ','إضافة إلى المفضلة':'إضافة إلى المفضلة','إزالة من المفضلة':'إزالة من المفضلة','تم حفظ جميع السور المتاحة لهذا القارئ':'تم حفظ جميع السور المتاحة لهذا القارئ','تحميل جميع السور المتاحة لهذا القارئ':'تحميل جميع السور المتاحة لهذا القارئ','لا توجد سورة غير معروفة':'سورة غير معروفة'},
 en:{'ℹ️ ملاحظة مهمة':'ℹ️ Important note','ملاحظة مهمة:':'Important note:','السور التي يتم تنزيلها بنجاح تُحفظ على هذا الجهاز للاستماع إليها بدون إنترنت. قد يحذف المتصفح الملفات المحفوظة تلقائيًا إذا تم مسح بيانات الموقع أو التخزين المؤقت، لذلك لا تحذف بيانات الموقع إذا أردت الاحتفاظ بالسور المحفوظة.':'Successfully downloaded surahs are saved on this device for offline listening. The browser may automatically delete saved files if site data or cache is cleared, so do not clear site data if you want to keep the saved surahs.','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'Each reciter shows the available surahs; incomplete recordings are not presented as complete.','ابحث عن قارئ…':'Search for a reciter…','114 سورة كاملة':'114 complete surahs','سورة متاحة':'surahs available','✓ تم تنزيل الكل':'✓ All downloaded','⬇ تحميل الكل':'⬇ Download All','تم تحميل':'Loaded','القارئ الحالي':'Current reciter','يتم الفتح عليه الآن':'Currently opening','مضاف إلى المفضلة':'Added to favorites','لا توجد نتيجة مطابقة.':'No matching results.','ابحث عن سورة…':'Search for a surah…','السور التي تعذر إكمال تنزيلها:':'Surahs whose download could not be completed:','جارٍ تنزيل السورة':'Downloading surah','اكتمل تنزيل جميع السور':'All surahs downloaded','يمكن إعادة الضغط على «تنزيل الكل» لمحاولة السور التي لم تُحفظ.':'Press “Download All” again to retry surahs that were not saved.','جارٍ تحميل دليل القرّاء…':'Loading reciter directory…','تعذر تحميل الدليل الخارجي؛ تم عرض قائمة قرّاء جاهزة ويمكنك الاستماع والتنزيل مباشرة.':'Could not load the external directory; a ready reciter list is shown.','تم حفظ':'Saved','بدون إنترنت':'offline','تعذر حفظ':'Could not save','إضافة إلى المفضلة':'Add to favorites','إزالة من المفضلة':'Remove from favorites','تم حفظ جميع السور المتاحة لهذا القارئ':'All available surahs for this reciter are saved','تحميل جميع السور المتاحة لهذا القارئ':'Download all available surahs for this reciter','لا توجد سورة غير معروفة':'Unknown surah'},
 tr:{'ℹ️ ملاحظة مهمة':'ℹ️ Önemli not','ملاحظة مهمة:':'Önemli not:','السور التي يتم تنزيلها بنجاح تُحفظ على هذا الجهاز للاستماع إليها بدون إنترنت. قد يحذف المتصفح الملفات المحفوظة تلقائيًا إذا تم مسح بيانات الموقع أو التخزين المؤقت، لذلك لا تحذف بيانات الموقع إذا أردت الاحتفاظ بالسور المحفوظة.':'Başarıyla indirilen sureler bu cihazda çevrimdışı dinlemek için saklanır. Site verileri veya önbellek temizlenirse tarayıcı dosyaları silebilir; saklanan sureleri korumak için site verilerini temizlemeyin.','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'Her okuyucunun mevcut sureleri gösterilir; eksik kayıtlar tam tilavet olarak sunulmaz.','ابحث عن قارئ…':'Okuyucu ara…','114 سورة كاملة':'114 tam sure','سورة متاحة':'sure mevcut','✓ تم تنزيل الكل':'✓ Tümü indirildi','⬇ تحميل الكل':'⬇ Tümünü indir','تم تحميل':'Yüklendi','القارئ الحالي':'Mevcut okuyucu','يتم الفتح عليه الآن':'Şu anda açılıyor','مضاف إلى المفضلة':'Favorilere eklendi','لا توجد نتيجة مطابقة.':'Eşleşen sonuç yok.','ابحث عن سورة…':'Sure ara…','السور التي تعذر إكمال تنزيلها:':'İndirilemeyen sureler:','جارٍ تنزيل السورة':'Sure indiriliyor','اكتمل تنزيل جميع السور':'Tüm sureler indirildi','يمكن إعادة الضغط على «تنزيل الكل» لمحاولة السور التي لم تُحفظ.':'Kaydedilmeyen sureleri tekrar denemek için “Tümünü indir”e basın.','جارٍ تحميل دليل القرّاء…':'Okuyucu dizini yükleniyor…','تعذر تحميل الدليل الخارجي؛ تم عرض قائمة قرّاء جاهزة ويمكنك الاستماع والتنزيل مباشرة.':'Harici dizin yüklenemedi; hazır okuyucu listesi gösterildi.','تم حفظ':'Kaydedildi','بدون إنترنت':'çevrimdışı','تعذر حفظ':'Kaydedilemedi','إضافة إلى المفضلة':'Favoriye ekle','إزالة من المفضلة':'Favoriden çıkar','تم حفظ جميع السور المتاحة لهذا القارئ':'Bu okuyucunun tüm mevcut sureleri kaydedildi','تحميل جميع السور المتاحة لهذا القارئ':'Bu okuyucunun tüm mevcut surelerini indir','لا توجد سورة غير معروفة':'Bilinmeyen sure'},
 fr:{'ℹ️ ملاحظة مهمة':'ℹ️ Note importante','ملاحظة مهمة:':'Note importante :','السور التي يتم تنزيلها بنجاح تُحفظ على هذا الجهاز للاستماع إليها بدون إنترنت. قد يحذف المتصفح الملفات المحفوظة تلقائيًا إذا تم مسح بيانات الموقع أو التخزين المؤقت، لذلك لا تحذف بيانات الموقع إذا أردت الاحتفاظ بالسور المحفوظة.':'Les sourates téléchargées avec succès sont enregistrées sur cet appareil pour une écoute hors ligne. Le navigateur peut supprimer les fichiers si les données ou le cache du site sont effacés ; ne les effacez pas pour conserver les sourates.','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'Les sourates disponibles sont affichées pour chaque lecteur ; les enregistrements incomplets ne sont pas présentés comme complets.','ابحث عن قارئ…':'Rechercher un lecteur…','114 سورة كاملة':'114 sourates complètes','سورة متاحة':'sourates disponibles','✓ تم تنزيل الكل':'✓ Tout est téléchargé','⬇ تحميل الكل':'⬇ Tout télécharger','تم تحميل':'Chargé','القارئ الحالي':'Lecteur actuel','يتم الفتح عليه الآن':'Ouverture en cours','مضاف إلى المفضلة':'Ajouté aux favoris','لا توجد نتيجة مطابقة.':'Aucun résultat correspondant.','ابحث عن سورة…':'Rechercher une sourate…','السور التي تعذر إكمال تنزيلها:':'Sourates dont le téléchargement est incomplet :','جارٍ تنزيل السورة':'Téléchargement de la sourate','اكتمل تنزيل جميع السور':'Toutes les sourates sont téléchargées','يمكن إعادة الضغط على «تنزيل الكل» لمحاولة السور التي لم تُحفظ.':'Appuyez à nouveau sur «Tout télécharger» pour réessayer les sourates non enregistrées.','جارٍ تحميل دليل القرّاء…':'Chargement de la liste des lecteurs…','تعذر تحميل الدليل الخارجي؛ تم عرض قائمة قرّاء جاهزة ويمكنك الاستماع والتنزيل مباشرة.':'Impossible de charger la liste externe ; une liste prête est affichée.','تم حفظ':'Enregistré','بدون إنترنت':'hors ligne','تعذر حفظ':'Impossible d’enregistrer','إضافة إلى المفضلة':'Ajouter aux favoris','إزالة من المفضلة':'Retirer des favoris','تم حفظ جميع السور المتاحة لهذا القارئ':'Toutes les sourates disponibles de ce lecteur sont enregistrées','تحميل جميع السور المتاحة لهذا القارئ':'Télécharger toutes les sourates disponibles de ce lecteur','لا توجد سورة غير معروفة':'Sourate inconnue'},
 ur:{'ℹ️ ملاحظة مهمة':'ℹ️ اہم نوٹ','ملاحظة مهمة:':'اہم نوٹ:','السور التي يتم تنزيلها بنجاح تُحفظ على هذا الجهاز للاستماع إليها بدون إنترنت. قد يحذف المتصفح الملفات المحفوظة تلقائيًا إذا تم مسح بيانات الموقع أو التخزين المؤقت، لذلك لا تحذف بيانات الموقع إذا أردت الاحتفاظ بالسور المحفوظة.':'کامیابی سے ڈاؤن لوڈ کی گئی سورتیں اس آلہ پر بغیر انٹرنیٹ سماعت کے لیے محفوظ ہوتی ہیں۔ سائٹ کا ڈیٹا یا کیش صاف کرنے پر براؤزر انہیں حذف کر سکتا ہے، اس لیے محفوظ سورتیں رکھنے کے لیے سائٹ کا ڈیٹا صاف نہ کریں۔','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'ہر قاری کے لیے دستیاب سورتیں دکھائی جاتی ہیں؛ نامکمل ریکارڈنگ کو مکمل تلاوت کے طور پر پیش نہیں کیا جاتا۔','ابحث عن قارئ…':'قاری تلاش کریں…','114 سورة كاملة':'114 مکمل سورتیں','سورة متاحة':'سورتیں دستیاب','✓ تم تنزيل الكل':'✓ سب ڈاؤن لوڈ ہو گیا','⬇ تحميل الكل':'⬇ سب ڈاؤن لوڈ کریں','تم تحميل':'لوڈ ہو گیا','القارئ الحالي':'موجودہ قاری','يتم الفتح عليه الآن':'ابھی کھولا جا رہا ہے','مضاف إلى المفضلة':'پسندیدہ میں شامل','لا توجد نتيجة مطابقة.':'کوئی مطابقت نہیں ملی۔','ابحث عن سورة…':'سورت تلاش کریں…','السور التي تعذر إكمال تنزيلها:':'جن سورتوں کا ڈاؤن لوڈ مکمل نہیں ہوا:','جارٍ تنزيل السورة':'سورت ڈاؤن لوڈ ہو رہی ہے','اكتمل تنزيل جميع السور':'تمام سورتیں ڈاؤن لوڈ ہو گئیں','يمكن إعادة الضغط على «تنزيل الكل» لمحاولة السور التي لم تُحفظ.':'جو سورتیں محفوظ نہیں ہوئیں ان کے لیے دوبارہ «سب ڈاؤن لوڈ کریں» دبائیں۔','جارٍ تحميل دليل القرّاء…':'قراء کی فہرست لوڈ ہو رہی ہے…','تعذر تحميل الدليل الخارجي؛ تم عرض قائمة قرّاء جاهزة ويمكنك الاستماع والتنزيل مباشرة.':'بیرونی فہرست لوڈ نہیں ہو سکی؛ تیار فہرست دکھا دی گئی ہے۔','تم حفظ':'محفوظ','بدون إنترنت':'بغیر انٹرنیٹ','تعذر حفظ':'محفوظ نہیں ہو سکا','إضافة إلى المفضلة':'پسندیدہ میں شامل کریں','إزالة من المفضلة':'پسندیدہ سے ہٹائیں','تم حفظ جميع السور المتاحة لهذا القارئ':'اس قاری کی تمام دستیاب سورتیں محفوظ ہیں','تحميل جميع السور المتاحة لهذا القارئ':'اس قاری کی تمام دستیاب سورتیں ڈاؤن لوڈ کریں','لا توجد سورة غير معروفة':'نامعلوم سورت'},
 id:{'ℹ️ ملاحظة مهمة':'ℹ️ Catatan penting','ملاحظة مهمة:':'Catatan penting:','السور التي يتم تنزيلها بنجاح تُحفظ على هذا الجهاز للاستماع إليها بدون إنترنت. قد يحذف المتصفح الملفات المحفوظة تلقائيًا إذا تم مسح بيانات الموقع أو التخزين المؤقت، لذلك لا تحذف بيانات الموقع إذا أردت الاحتفاظ بالسور المحفوظة.':'Surah yang berhasil diunduh disimpan di perangkat ini untuk didengarkan tanpa internet. Browser dapat menghapusnya jika data situs atau cache dibersihkan, jadi jangan hapus data situs jika ingin mempertahankannya.','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.':'Surah yang tersedia untuk setiap qari ditampilkan; rekaman yang tidak lengkap tidak ditampilkan sebagai tilawah lengkap.','ابحث عن قارئ…':'Cari qari…','114 سورة كاملة':'114 surah lengkap','سورة متاحة':'surah tersedia','✓ تم تنزيل الكل':'✓ Semua telah diunduh','⬇ تحميل الكل':'⬇ Unduh Semua','تم تحميل':'Dimuat','القارئ الحالي':'Qari saat ini','يتم الفتح عليه الآن':'Sedang dibuka','مضاف إلى المفضلة':'Ditambahkan ke favorit','لا توجد نتيجة مطابقة.':'Tidak ada hasil yang cocok.','ابحث عن سورة…':'Cari surah…','السور التي تعذر إكمال تنزيلها:':'Surah yang gagal diunduh sepenuhnya:','جارٍ تنزيل السورة':'Mengunduh surah','اكتمل تنزيل جميع السور':'Semua surah telah diunduh','يمكن إعادة الضغط على «تنزيل الكل» لمحاولة السور التي لم تُحفظ.':'Tekan “Unduh Semua” lagi untuk mencoba surah yang belum tersimpan.','جارٍ تحميل دليل القرّاء…':'Memuat daftar qari…','تعذر تحميل الدليل الخارجي؛ تم عرض قائمة قرّاء جاهزة ويمكنك الاستماع والتنزيل مباشرة.':'Daftar eksternal gagal dimuat; daftar qari siap ditampilkan.','تم حفظ':'Tersimpan','بدون إنترنت':'offline','تعذر حفظ':'Gagal menyimpan','إضافة إلى المفضلة':'Tambahkan ke favorit','إزالة من المفضلة':'Hapus dari favorit','تم حفظ جميع السور المتاحة لهذا القارئ':'Semua surah qari ini telah tersimpan','تحميل جميع السور المتاحة لهذا القارئ':'Unduh semua surah qari ini','لا توجد سورة غير معروفة':'Surah tidak dikenal'}
};
Object.keys(EXTRA_UI).forEach(k=>Object.assign(UI_LANGS[k].texts,EXTRA_UI[k]));

const EXTRA_MORE_UI={
 ar:{'نص الآيات':'نص الآيات'},
 en:{'نص الآيات':'Ayah text'},
 tr:{'نص الآيات':'Ayet metni'},
 fr:{'نص الآيات':'Texte du verset'},
 ur:{'نص الآيات':'آیات کا متن'},
 id:{'نص الآيات':'Teks ayat'}
};
Object.keys(EXTRA_MORE_UI).forEach(k=>Object.assign(UI_LANGS[k].texts,EXTRA_MORE_UI[k]));
const EXTRA_SURAH_UI={
 ar:{'الآية':'الآية','تشغيل':'تشغيل','تنزيل':'تنزيل'},
 en:{'الآية':'Ayah','تشغيل':'Play','تنزيل':'Download'},
 tr:{'الآية':'Ayet','تشغيل':'Oynat','تنزيل':'İndir'},
 fr:{'الآية':'Verset','تشغيل':'Lire','تنزيل':'Télécharger'},
 ur:{'الآية':'آیت','تشغيل':'چلائیں','تنزيل':'ڈاؤن لوڈ کریں'},
 id:{'الآية':'Ayat','تشغيل':'Putar','تنزيل':'Unduh'}
};
Object.keys(EXTRA_SURAH_UI).forEach(k=>Object.assign(UI_LANGS[k].texts,EXTRA_SURAH_UI[k]));

const EXTRA_SETTINGS_UI={
 ar:{
  'تخصيص التطبيق':'تخصيص التطبيق','إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.':'إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.','🔊 الصوت والتشغيل':'🔊 الصوت والتشغيل','مستوى الصوت':'مستوى الصوت','تشغيل السورة التالية تلقائيًا':'تشغيل السورة التالية تلقائيًا','التشغيل التلقائي عند اختيار السورة':'التشغيل التلقائي عند اختيار السورة','🎨 المظهر والقراءة':'🎨 المظهر والقراءة','الوضع الداكن':'الوضع الداكن','حجم الخط':'حجم الخط','🔔 التنبيهات':'🔔 التنبيهات','السماح بتنبيهات القرآن الكريم':'السماح بتنبيهات القرآن الكريم','التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.':'التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.','📥 التنزيلات':'📥 التنزيلات','🌐 اللغة':'🌐 اللغة','القرآن الكريم لا يضيف إعلانات أو اشتراكات، ولا يحتاج إلى حساب لمجرد الاستماع أو حفظ السور على الجهاز.':'القرآن الكريم لا يضيف إعلانات أو اشتراكات، ولا يحتاج إلى حساب لمجرد الاستماع أو حفظ السور على الجهاز.','ℹ️ حول القرآن الكريم':'ℹ️ حول القرآن الكريم','تطبيق مجاني لخدمة كتاب الله، والإصدار الحالي v70.':'تطبيق مجاني لخدمة كتاب الله، والإصدار الحالي v70.'
 },
 en:{
  'تخصيص التطبيق':'Customize the app','إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.':'Settings for serving users only — no ads or subscriptions.','🔊 الصوت والتشغيل':'🔊 Audio & Playback','مستوى الصوت':'Volume','تشغيل السورة التالية تلقائيًا':'Auto-play next surah','التشغيل التلقائي عند اختيار السورة':'Auto-play when selecting a surah','🎨 المظهر والقراءة':'🎨 Appearance & Reading','الوضع الداكن':'Dark mode','حجم الخط':'Font size','🔔 التنبيهات':'🔔 Notifications','السماح بتنبيهات القرآن الكريم':'Allow Quran notifications','التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.':'Notifications are optional; Quran reminders may be sent every 4 hours and are never used for ads.','📥 التنزيلات':'📥 Downloads','🌐 اللغة':'🌐 Language','القرآن الكريم لا يضيف إعلانات أو اشتراكات، ولا يحتاج إلى حساب لمجرد الاستماع أو حفظ السور على الجهاز.':'The Holy Quran app has no ads or subscriptions and does not require an account just to listen to or save surahs on this device.','ℹ️ حول القرآن الكريم':'ℹ️ About the Holy Quran','تطبيق مجاني لخدمة كتاب الله، والإصدار الحالي v70.':'A free app serving the Book of Allah — current version v67.'
 },
 tr:{
  'تخصيص التطبيق':'Uygulamayı özelleştir','إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.':'Yalnızca kullanıcılara hizmet için ayarlar — reklam veya abonelik yok.','🔊 الصوت والتشغيل':'🔊 Ses ve oynatma','مستوى الصوت':'Ses seviyesi','تشغيل السورة التالية تلقائيًا':'Sonraki sureyi otomatik oynat','التشغيل التلقائي عند اختيار السورة':'Sure seçilince otomatik oynat','🎨 المظهر والقراءة':'🎨 Görünüm ve okuma','الوضع الداكن':'Karanlık mod','حجم الخط':'Yazı boyutu','🔔 التنبيهات':'🔔 Bildirimler','السماح بتنبيهات القرآن الكريم':'Kur’an bildirimlerine izin ver','التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.':'Bildirimler isteğe bağlıdır; Kur’an hatırlatıcıları 4 saatte bir gönderilebilir ve reklam için kullanılmaz.','📥 التنزيلات':'📥 İndirmeler','🌐 اللغة':'🌐 Dil','القرآن الكريم لا يضيف إعلانات أو اشتراكات، ولا يحتاج إلى حساب لمجرد الاستماع أو حفظ السور على الجهاز.':'Kur’an-ı Kerim uygulamasında reklam veya abonelik yoktur; sureleri dinlemek veya cihaza kaydetmek için hesap gerekmez.','ℹ️ حول القرآن الكريم':'ℹ️ Kur’an-ı Kerim hakkında','تطبيق مجاني لخدمة كتاب الله، والإصدار الحالي v70.':'Allah’ın Kitabı’na hizmet eden ücretsiz uygulama — mevcut sürüm v66.'
 },
 fr:{
  'تخصيص التطبيق':'Personnaliser l’application','إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.':'Paramètres au service des utilisateurs uniquement — sans publicités ni abonnements.','🔊 الصوت والتشغيل':'🔊 Audio et lecture','مستوى الصوت':'Volume','تشغيل السورة التالية تلقائيًا':'Lire automatiquement la sourate suivante','التشغيل التلقائي عند اختيار السورة':'Lecture automatique à la sélection','🎨 المظهر والقراءة':'🎨 Apparence et lecture','الوضع الداكن':'Mode sombre','حجم الخط':'Taille du texte','🔔 التنبيهات':'🔔 Notifications','السماح بتنبيهات القرآن الكريم':'Autoriser les notifications du Coran','التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.':'Les notifications sont facultatives ; des rappels du Coran peuvent être envoyés toutes les 4 heures et ne servent jamais à la publicité.','📥 التنزيلات':'📥 Téléchargements','🌐 اللغة':'🌐 Langue','القرآن الكريم لا يضيف إعلانات أو اشتراكات، ولا يحتاج إلى حساب لمجرد الاستماع أو حفظ السور على الجهاز.':'L’application du Saint Coran ne contient ni publicité ni abonnement et ne nécessite pas de compte pour écouter ou enregistrer les sourates.','ℹ️ حول القرآن الكريم':'ℹ️ À propos du Saint Coran','تطبيق مجاني لخدمة كتاب الله، والإصدار الحالي v70.':'Application gratuite au service du Livre d’Allah — version actuelle v66.'
 },
 ur:{
  'تخصيص التطبيق':'ایپ کی تخصیص','إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.':'صرف صارفین کی خدمت کے لیے ترتیبات — نہ اشتہارات، نہ سبسکرپشنز۔','🔊 الصوت والتشغيل':'🔊 آواز اور پلے بیک','مستوى الصوت':'آواز کی سطح','تشغيل السورة التالية تلقائيًا':'اگلی سورت خود چلائیں','التشغيل التلقائي عند اختيار السورة':'سورت منتخب کرتے ہی چلائیں','🎨 المظهر والقراءة':'🎨 ظاہری شکل اور مطالعہ','الوضع الداكن':'ڈارک موڈ','حجم الخط':'فونٹ سائز','🔔 التنبيهات':'🔔 اطلاعات','السماح بتنبيهات القرآن الكريم':'قرآن کریم کی اطلاعات کی اجازت دیں','التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.':'اطلاعات اختیاری ہیں اور اشتہارات کے لیے استعمال نہیں ہوں گی۔','📥 التنزيلات':'📥 ڈاؤن لوڈز','🌐 اللغة':'🌐 زبان','القرآن الكريم لا يضيف إعلانات أو اشتراكات، ولا يحتاج إلى حساب لمجرد الاستماع أو حفظ السور على الجهاز.':'قرآن کریم کی ایپ میں اشتہارات یا سبسکرپشن نہیں ہیں اور سورتیں سننے یا محفوظ کرنے کے لیے اکاؤنٹ درکار نہیں۔','ℹ️ حول القرآن الكريم':'ℹ️ قرآن کریم کے بارے میں','تطبيق مجاني لخدمة كتاب الله، والإصدار الحالي v70.':'کتاب اللہ کی خدمت کے لیے مفت ایپ — موجودہ ورژن v66۔'
 },
 id:{
  'تخصيص التطبيق':'Sesuaikan aplikasi','إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.':'Pengaturan hanya untuk melayani pengguna — tanpa iklan atau langganan.','🔊 الصوت والتشغيل':'🔊 Audio & Pemutaran','مستوى الصوت':'Volume','تشغيل السورة التالية تلقائيًا':'Putar surah berikutnya otomatis','التشغيل التلقائي عند اختيار السورة':'Putar otomatis saat memilih surah','🎨 المظهر والقراءة':'🎨 Tampilan & Bacaan','الوضع الداكن':'Mode gelap','حجم الخط':'Ukuran font','🔔 التنبيهات':'🔔 Notifikasi','السماح بتنبيهات القرآن الكريم':'Izinkan notifikasi Al-Qur’an','التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.':'Notifikasi bersifat opsional dan tidak digunakan untuk iklan.','📥 التنزيلات':'📥 Unduhan','🌐 اللغة':'🌐 Bahasa','القرآن الكريم لا يضيف إعلانات أو اشتراكات، ولا يحتاج إلى حساب لمجرد الاستماع أو حفظ السور على الجهاز.':'Aplikasi Al-Qur’an tidak memiliki iklan atau langganan dan tidak memerlukan akun untuk mendengarkan atau menyimpan surah di perangkat.','ℹ️ حول القرآن الكريم':'ℹ️ Tentang Al-Qur’an','تطبيق مجاني لخدمة كتاب الله، والإصدار الحالي v70.':'Aplikasi gratis untuk melayani Kitab Allah — versi saat ini v67.'
 }
};
Object.keys(EXTRA_SETTINGS_UI).forEach(k=>Object.assign(UI_LANGS[k].texts,EXTRA_SETTINGS_UI[k]));
const EXTRA_NOTIFICATION_UI={ar:{'هذا المتصفح لا يدعم التنبيهات.':'هذا المتصفح لا يدعم التنبيهات.','تم السماح بالتنبيهات. لن تُستخدم للإعلانات.':'تم السماح بالتنبيهات. تم تفعيل تذكيرات القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.','لم يتم السماح بالتنبيهات.':'لم يتم السماح بالتنبيهات.','جارٍ حساب السور المحفوظة…':'جارٍ حساب السور المحفوظة…'},en:{'هذا المتصفح لا يدعم التنبيهات.':'This browser does not support notifications.','تم السماح بالتنبيهات. لن تُستخدم للإعلانات.':'Notifications are enabled. Quran reminders may be sent every 4 hours and are never used for ads.','لم يتم السماح بالتنبيهات.':'Notifications were not allowed.','جارٍ حساب السور المحفوظة…':'Calculating saved surahs…'},tr:{'هذا المتصفح لا يدعم التنبيهات.':'Bu tarayıcı bildirimleri desteklemiyor.','تم السماح بالتنبيهات. لن تُستخدم للإعلانات.':'Bildirimlere izin verildi. Kur’an hatırlatıcıları 4 saatte bir gönderilebilir ve reklam için kullanılmayacak.','لم يتم السماح بالتنبيهات.':'Bildirimlere izin verilmedi.','جارٍ حساب السور المحفوظة…':'Kaydedilen sureler hesaplanıyor…'},fr:{'هذا المتصفح لا يدعم التنبيهات.':'Ce navigateur ne prend pas en charge les notifications.','تم السماح بالتنبيهات. لن تُستخدم للإعلانات.':'Les notifications sont autorisées. Des rappels du Coran peuvent être envoyés toutes les 4 heures et ne servent pas à la publicité.','لم يتم السماح بالتنبيهات.':'Les notifications n’ont pas été autorisées.','جارٍ حساب السور المحفوظة…':'Calcul des sourates enregistrées…'},ur:{'هذا المتصفح لا يدعم التنبيهات.':'یہ براؤزر اطلاعات کو سپورٹ نہیں کرتا۔','تم السماح بالتنبيهات. لن تُستخدم للإعلانات.':'اطلاعات کی اجازت دے دی گئی ہے۔ قرآن کریم کی یاددہانیاں ہر 4 گھنٹے میں بھیجی جا سکتی ہیں اور انہیں اشتہارات کے لیے استعمال نہیں کیا جائے گا۔','لم يتم السماح بالتنبيهات.':'اطلاعات کی اجازت نہیں دی گئی۔','جارٍ حساب السور المحفوظة…':'محفوظ سورتوں کی تعداد معلوم کی جا رہی ہے…'},id:{'هذا المتصفح لا يدعم التنبيهات.':'Browser ini tidak mendukung notifikasi.','تم السماح بالتنبيهات. لن تُستخدم للإعلانات.':'Notifikasi diizinkan. Pengingat Al-Qur’an dapat dikirim setiap 4 jam dan tidak digunakan untuk iklan.','لم يتم السماح بالتنبيهات.':'Notifikasi tidak diizinkan.','جارٍ حساب السور المحفوظة…':'Menghitung surah yang tersimpan…'}};
Object.keys(EXTRA_NOTIFICATION_UI).forEach(k=>Object.assign(UI_LANGS[k].texts,EXTRA_NOTIFICATION_UI[k]));
const EXTRA_SOURCE_NOTE={
 ar:{'قد تكون بعض تسجيلات السور غير كاملة، وذلك بسبب المصدر الصوتي.':'قد تكون بعض تسجيلات السور غير كاملة، وذلك بسبب المصدر الصوتي.'},
 en:{'قد تكون بعض تسجيلات السور غير كاملة، وذلك بسبب المصدر الصوتي.':'Some surah recordings may be incomplete due to the audio source.'},
 tr:{'قد تكون بعض تسجيلات السور غير كاملة، وذلك بسبب المصدر الصوتي.':'Bazı sure kayıtları ses kaynağı nedeniyle eksik olabilir.'},
 fr:{'قد تكون بعض تسجيلات السور غير كاملة، وذلك بسبب المصدر الصوتي.':'Certains enregistrements de sourates peuvent être incomplets en raison de la source audio.'},
 ur:{'قد تكون بعض تسجيلات السور غير كاملة، وذلك بسبب المصدر الصوتي.':'آڈیو ماخذ کی وجہ سے بعض سورتوں کی ریکارڈنگ مکمل نہ ہو سکتی ہے۔'},
 id:{'قد تكون بعض تسجيلات السور غير كاملة، وذلك بسبب المصدر الصوتي.':'Beberapa rekaman surah mungkin tidak lengkap karena sumber audio.'}
};
Object.keys(EXTRA_SOURCE_NOTE).forEach(k=>Object.assign(UI_LANGS[k].texts,EXTRA_SOURCE_NOTE[k]));


const FIXED_UI_I18N={
 ar:{'قال الله تعالى:':'قال الله تعالى:','تُقرأ الآن':'تُقرأ الآن','جاهز للتشغيل':'جاهز للتشغيل','التلاوة تعمل الآن':'التلاوة تعمل الآن','متوقف مؤقتًا':'متوقف مؤقتًا','جاري تحميل الصوت…':'جاري تحميل الصوت…','اضغط ▶ مرة أخرى لبدء التلاوة.':'اضغط ▶ مرة أخرى لبدء التلاوة.','السورة السابقة':'السورة السابقة','السورة التالية':'السورة التالية','تشغيل السورة':'تشغيل السورة','إيقاف السورة مؤقتًا':'إيقاف السورة مؤقتًا','إغلاق':'إغلاق','جاهز للتنزيل':'جاهز للتنزيل','لم يبدأ التنزيل بعد':'لم يبدأ التنزيل بعد'},
 en:{'قال الله تعالى:':'Allah says:','تُقرأ الآن':'Now playing','جاهز للتشغيل':'Ready to play','التلاوة تعمل الآن':'Playing now','متوقف مؤقتًا':'Paused','جاري تحميل الصوت…':'Loading audio…','اضغط ▶ مرة أخرى لبدء التلاوة.':'Press ▶ again to start the recitation.','السورة السابقة':'Previous surah','السورة التالية':'Next surah','تشغيل السورة':'Play surah','إيقاف السورة مؤقتًا':'Pause surah','إغلاق':'Close','جاهز للتنزيل':'Ready to download','لم يبدأ التنزيل بعد':'Download has not started yet'},
 tr:{'قال الله تعالى:':'Allah şöyle buyuruyor:','تُقرأ الآن':'Şimdi çalıyor','جاهز للتشغيل':'Oynatmaya hazır','التلاوة تعمل الآن':'Şimdi oynatılıyor','متوقف مؤقتًا':'Duraklatıldı','جاري تحميل الصوت…':'Ses yükleniyor…','اضغط ▶ مرة أخرى لبدء التلاوة.':'Tilaveti başlatmak için ▶ düğmesine tekrar basın.','السورة السابقة':'Önceki sure','السورة التالية':'Sonraki sure','تشغيل السورة':'Sureyi oynat','إيقاف السورة مؤقتًا':'Sureyi duraklat','إغلاق':'Kapat','جاهز للتنزيل':'İndirmeye hazır','لم يبدأ التنزيل بعد':'İndirme henüz başlamadı'},
 fr:{'قال الله تعالى:':'Allah dit :','تُقرأ الآن':'En cours','جاهز للتشغيل':'Prêt à lire','التلاوة تعمل الآن':'Lecture en cours','متوقف مؤقتًا':'En pause','جاري تحميل الصوت…':'Chargement audio…','اضغط ▶ مرة أخرى لبدء التلاوة.':'Appuyez à nouveau sur ▶ pour commencer la récitation.','السورة السابقة':'Sourate précédente','السورة التالية':'Sourate suivante','تشغيل السورة':'Lire la sourate','إيقاف السورة مؤقتًا':'Mettre la sourate en pause','إغلاق':'Fermer','جاهز للتنزيل':'Prêt à télécharger','لم يبدأ التنزيل بعد':'Le téléchargement n’a pas encore commencé'},
 ur:{'قال الله تعالى:':'اللہ تعالیٰ نے فرمایا:','تُقرأ الآن':'ابھی تلاوت جاری ہے','جاهز للتشغيل':'چلانے کے لیے تیار','التلاوة تعمل الآن':'تلاوت جاری ہے','متوقف مؤقتًا':'روک دی گئی','جاري تحميل الصوت…':'آڈیو لوڈ ہو رہی ہے…','اضغط ▶ مرة أخرى لبدء التلاوة.':'تلاوت شروع کرنے کے لیے دوبارہ ▶ دبائیں۔','السورة السابقة':'پچھلی سورت','السورة التالية':'اگلی سورت','تشغيل السورة':'سورت چلائیں','إيقاف السورة مؤقتًا':'سورت روکیں','إغلاق':'بند کریں','جاهز للتنزيل':'ڈاؤن لوڈ کے لیے تیار','لم يبدأ التنزيل بعد':'ڈاؤن لوڈ ابھی شروع نہیں ہوا'},
 id:{'قال الله تعالى:':'Allah berfirman:','تُقرأ الآن':'Sedang diputar','جاهز للتشغيل':'Siap diputar','التلاوة تعمل الآن':'Sedang diputar','متوقف مؤقتًا':'Dijeda','جاري تحميل الصوت…':'Memuat audio…','اضغط ▶ مرة أخرى لبدء التلاوة.':'Tekan ▶ lagi untuk memulai tilawah.','السورة السابقة':'Surah sebelumnya','السورة التالية':'Surah berikutnya','تشغيل السورة':'Putar surah','إيقاف السورة مؤقتًا':'Jeda surah','إغلاق':'Tutup','جاهز للتنزيل':'Siap diunduh','لم يبدأ التنزيل بعد':'Unduhan belum dimulai'}
};
Object.keys(FIXED_UI_I18N).forEach(k=>Object.assign(UI_LANGS[k].texts,FIXED_UI_I18N[k]));
const TRANSLATION_I18N={
 ar:{label:'إظهار ترجمة معاني الآيات',hint:'عند اختيار لغة غير العربية، تُعرض ترجمة لمعاني الآية أسفل النص العربي، وتُحفظ على الجهاز عند تحميلها.',loading:'جاري تحميل ترجمة الآية…',error:'تعذر تحميل الترجمة حاليًا.',meaning:'ترجمة معاني الآيات',source:'المصدر'},
 en:{label:'Show verse meanings translation',hint:'When a non-Arabic language is selected, a translation of the verse meaning appears below the Arabic text and is cached on this device.',loading:'Loading verse translation…',error:'Translation is currently unavailable.',meaning:'Verse meaning translation',source:'Source'},
 tr:{label:'Ayet anlamı çevirisini göster',hint:'Arapça dışındaki bir dil seçildiğinde ayetin anlam çevirisi Arapça metnin altında gösterilir ve cihazda önbelleğe alınır.',loading:'Ayet çevirisi yükleniyor…',error:'Çeviri şu anda kullanılamıyor.',meaning:'Ayet anlamı çevirisi',source:'Kaynak'},
 fr:{label:'Afficher la traduction du sens des versets',hint:'Lorsqu’une langue autre que l’arabe est choisie, la traduction du sens du verset apparaît sous le texte arabe et est mise en cache sur cet appareil.',loading:'Chargement de la traduction…',error:'La traduction est actuellement indisponible.',meaning:'Traduction du sens du verset',source:'Source'},
 ur:{label:'آیات کے معانی کا ترجمہ دکھائیں',hint:'عربی کے علاوہ کوئی زبان منتخب ہونے پر آیت کے معنی کا ترجمہ عربی متن کے نیچے دکھایا جائے گا اور اسی آلے پر محفوظ ہوگا۔',loading:'آیت کا ترجمہ لوڈ ہو رہا ہے…',error:'ترجمہ فی الحال دستیاب نہیں ہے۔',meaning:'آیت کے معانی کا ترجمہ',source:'ماخذ'},
 id:{label:'Tampilkan terjemahan makna ayat',hint:'Saat bahasa selain Arab dipilih, terjemahan makna ayat ditampilkan di bawah teks Arab dan disimpan sementara di perangkat ini.',loading:'Memuat terjemahan ayat…',error:'Terjemahan saat ini tidak tersedia.',meaning:'Terjemahan makna ayat',source:'Sumber'}
};
const TRANSLATION_EDITION={
 en:{id:'en.sahih',name:'Saheeh International'},
 tr:{id:'tr.diyanet',name:'Diyanet İşleri Başkanlığı'},
 fr:{id:'fr.hamidullah',name:'Muhammad Hamidullah'},
 ur:{id:'ur.jalandhry',name:'Fateh Muhammad Jalandhry'},
 id:{id:'id.indonesian',name:'Bahasa Indonesia'}
};
function translationText(key){const L=TRANSLATION_I18N[currentLang()]||TRANSLATION_I18N.ar;return L[key]||TRANSLATION_I18N.ar[key]||key;}
Object.keys(TRANSLATION_I18N).forEach(k=>Object.assign(UI_LANGS[k].texts,{
 'إظهار ترجمة معاني الآيات':TRANSLATION_I18N[k].label,
 'عند اختيار لغة غير العربية، تُعرض ترجمة لمعاني الآية أسفل النص العربي، وتُحفظ على الجهاز عند تحميلها.':TRANSLATION_I18N[k].hint,
 'جاري تحميل ترجمة الآية…':TRANSLATION_I18N[k].loading,
 'تعذر تحميل الترجمة حاليًا.':TRANSLATION_I18N[k].error,
 'ترجمة معاني الآيات':TRANSLATION_I18N[k].meaning,
 'المصدر':TRANSLATION_I18N[k].source
}));


function T(key){const L=UI_LANGS[currentLang()]||UI_LANGS.ar; return L.texts[key]||UI_LANGS.ar.texts[key]||key;}

const SETTINGS_I18N={
 ar:{
  settingsCustomize:'تخصيص التطبيق',settingsTitle:'⚙️ الإعدادات',settingsServiceNote:'إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.',
  audioSettingsTitle:'🔊 الصوت والتشغيل',volumeLabelText:'مستوى الصوت',autoNextLabel:'تشغيل السورة التالية تلقائيًا',autoPlayLabel:'التشغيل التلقائي عند اختيار السورة',
  appearanceSettingsTitle:'🎨 المظهر والقراءة',darkModeLabel:'الوضع الداكن',fontSizeLabelText:'حجم الخط',
  notificationsSettingsTitle:'🔔 التنبيهات',notificationsLabel:'السماح بتنبيهات القرآن الكريم',notificationStatus:'التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.',
  downloadsSettingsTitle:'📥 التنزيلات',downloadSummaryPlaceholder:'جارٍ حساب السور المحفوظة…',manageDownloadsBtn:'🗑️ إدارة السور المحفوظة',
  languageSettingsTitle:'🌐 اللغة',languageLabel:'لغة واجهة التطبيق',languageHint:'تتغير واجهة التطبيق حسب اللغة المختارة، بينما يبقى نص القرآن الكريم باللغة العربية.',
  aboutSettingsTitle:'ℹ️ حول القرآن الكريم',aboutHint:'تطبيق مجاني لخدمة كتاب الله، بدون إعلانات أو اشتراكات أو خصائص ربحية.'
 },
 en:{
  settingsCustomize:'Customize the app',settingsTitle:'⚙️ Settings',settingsServiceNote:'Settings for serving users only — no ads or subscriptions.',
  audioSettingsTitle:'🔊 Audio & Playback',volumeLabelText:'Volume',autoNextLabel:'Auto-play next surah',autoPlayLabel:'Auto-play when selecting a surah',
  appearanceSettingsTitle:'🎨 Appearance & Reading',darkModeLabel:'Dark mode',fontSizeLabelText:'Font size',
  notificationsSettingsTitle:'🔔 Notifications',notificationsLabel:'Allow Quran notifications',notificationStatus:'Notifications are optional; Quran reminders may be sent every 4 hours and are never used for ads.',
  downloadsSettingsTitle:'📥 Downloads',downloadSummaryPlaceholder:'Calculating saved surahs…',manageDownloadsBtn:'🗑️ Manage saved surahs',
  languageSettingsTitle:'🌐 Language',languageLabel:'App interface language',languageHint:'The interface changes with the selected language, while the Quran text remains in Arabic.',
  aboutSettingsTitle:'ℹ️ About the Holy Quran',aboutHint:'A free app dedicated to serving the Book of Allah, with no ads, subscriptions, or monetization.'
 },
 tr:{
  settingsCustomize:'Uygulamayı özelleştir',settingsTitle:'⚙️ Ayarlar',settingsServiceNote:'Yalnızca kullanıcıya hizmet için ayarlar — reklam ve abonelik yoktur.',
  audioSettingsTitle:'🔊 Ses ve oynatma',volumeLabelText:'Ses seviyesi',autoNextLabel:'Sonraki sureyi otomatik oynat',autoPlayLabel:'Sure seçilince otomatik oynat',
  appearanceSettingsTitle:'🎨 Görünüm ve okuma',darkModeLabel:'Karanlık mod',fontSizeLabelText:'Yazı boyutu',
  notificationsSettingsTitle:'🔔 Bildirimler',notificationsLabel:'Kur’an bildirimlerine izin ver',notificationStatus:'Bildirimler isteğe bağlıdır; Kur’an hatırlatıcıları 4 saatte bir gönderilebilir ve reklam için kullanılmaz.',
  downloadsSettingsTitle:'📥 İndirmeler',downloadSummaryPlaceholder:'Kaydedilen sureler hesaplanıyor…',manageDownloadsBtn:'🗑️ Kayıtlı sureleri yönet',
  languageSettingsTitle:'🌐 Dil',languageLabel:'Uygulama arayüzü dili',languageHint:'Arayüz seçilen dile göre değişir; Kur’an metni Arapça kalır.',
  aboutSettingsTitle:'ℹ️ Kur’an-ı Kerim hakkında',aboutHint:'Allah’ın Kitabı’na hizmet etmek için hazırlanmış ücretsiz bir uygulamadır; reklam, abonelik veya gelir özelliği yoktur.'
 },
 fr:{
  settingsCustomize:'Personnaliser l’application',settingsTitle:'⚙️ Paramètres',settingsServiceNote:'Paramètres au service des utilisateurs uniquement — sans publicités ni abonnements.',
  audioSettingsTitle:'🔊 Audio et lecture',volumeLabelText:'Volume',autoNextLabel:'Lire automatiquement la sourate suivante',autoPlayLabel:'Lecture automatique lors du choix d’une sourate',
  appearanceSettingsTitle:'🎨 Apparence et lecture',darkModeLabel:'Mode sombre',fontSizeLabelText:'Taille du texte',
  notificationsSettingsTitle:'🔔 Notifications',notificationsLabel:'Autoriser les notifications du Coran',notificationStatus:'Les notifications sont facultatives ; des rappels du Coran peuvent être envoyés toutes les 4 heures et ne servent jamais à la publicité.',
  downloadsSettingsTitle:'📥 Téléchargements',downloadSummaryPlaceholder:'Calcul des sourates enregistrées…',manageDownloadsBtn:'🗑️ Gérer les sourates enregistrées',
  languageSettingsTitle:'🌐 Langue',languageLabel:'Langue de l’interface',languageHint:'L’interface change selon la langue choisie, tandis que le texte du Coran reste en arabe.',
  aboutSettingsTitle:'ℹ️ À propos du Saint Coran',aboutHint:'Application gratuite dédiée au service du Livre d’Allah, sans publicité, abonnement ni monétisation.'
 },
 ur:{
  settingsCustomize:'ایپ کو حسبِ ضرورت بنائیں',settingsTitle:'⚙️ ترتیبات',settingsServiceNote:'صرف صارف کی خدمت کے لیے ترتیبات — نہ اشتہارات نہ سبسکرپشن۔',
  audioSettingsTitle:'🔊 آواز اور پلے بیک',volumeLabelText:'آواز کی سطح',autoNextLabel:'اگلی سورت خود چلائیں',autoPlayLabel:'سورت منتخب کرتے ہی خود چلائیں',
  appearanceSettingsTitle:'🎨 ظاہری شکل اور مطالعہ',darkModeLabel:'ڈارک موڈ',fontSizeLabelText:'فونٹ سائز',
  notificationsSettingsTitle:'🔔 اطلاعات',notificationsLabel:'قرآن کریم کی اطلاعات کی اجازت دیں',notificationStatus:'اطلاعات اختیاری ہیں؛ قرآن کریم کی یاددہانیاں ہر 4 گھنٹے میں بھیجی جا سکتی ہیں اور اشتہارات کے لیے استعمال نہیں ہوں گی۔',
  downloadsSettingsTitle:'📥 ڈاؤن لوڈز',downloadSummaryPlaceholder:'محفوظ سورتوں کی گنتی ہو رہی ہے…',manageDownloadsBtn:'🗑️ محفوظ سورتوں کا انتظام',
  languageSettingsTitle:'🌐 زبان',languageLabel:'ایپ کی زبان',languageHint:'ایپ کی زبان منتخب زبان کے مطابق تبدیل ہوگی، جبکہ قرآن کا متن عربی میں ہی رہے گا۔',
  aboutSettingsTitle:'ℹ️ قرآن کریم کے بارے میں',aboutHint:'اللہ کی کتاب کی خدمت کے لیے مفت ایپ، بغیر اشتہارات، سبسکرپشن یا منافع بخش خصوصیات کے۔'
 },
 id:{
  settingsCustomize:'Sesuaikan aplikasi',settingsTitle:'⚙️ Pengaturan',settingsServiceNote:'Pengaturan hanya untuk melayani pengguna — tanpa iklan atau langganan.',
  audioSettingsTitle:'🔊 Audio & Pemutaran',volumeLabelText:'Volume',autoNextLabel:'Putar surah berikutnya otomatis',autoPlayLabel:'Putar otomatis saat memilih surah',
  appearanceSettingsTitle:'🎨 Tampilan & Bacaan',darkModeLabel:'Mode gelap',fontSizeLabelText:'Ukuran font',
  notificationsSettingsTitle:'🔔 Notifikasi',notificationsLabel:'Izinkan notifikasi Al-Qur’an',notificationStatus:'Notifikasi bersifat opsional; pengingat Al-Qur’an dapat dikirim setiap 4 jam dan tidak pernah digunakan untuk iklan.',
  downloadsSettingsTitle:'📥 Unduhan',downloadSummaryPlaceholder:'Menghitung surah yang tersimpan…',manageDownloadsBtn:'🗑️ Kelola surah tersimpan',
  languageSettingsTitle:'🌐 Bahasa',languageLabel:'Bahasa antarmuka aplikasi',languageHint:'Antarmuka berubah sesuai bahasa yang dipilih, sementara teks Al-Qur’an tetap dalam bahasa Arab.',
  aboutSettingsTitle:'ℹ️ Tentang Al-Qur’an',aboutHint:'Aplikasi gratis untuk melayani Kitab Allah, tanpa iklan, langganan, atau fitur monetisasi.'
 }
};
function arabicToLatin(s){return String(s||'').replace(/[ءأإآؤئ]/g,'a').replace(/ب/g,'b').replace(/ت/g,'t').replace(/ث/g,'th').replace(/ج/g,'j').replace(/ح/g,'h').replace(/خ/g,'kh').replace(/د/g,'d').replace(/ذ/g,'dh').replace(/ر/g,'r').replace(/ز/g,'z').replace(/س/g,'s').replace(/ش/g,'sh').replace(/ص/g,'s').replace(/ض/g,'d').replace(/ط/g,'t').replace(/ظ/g,'z').replace(/ع/g,'').replace(/غ/g,'gh').replace(/ف/g,'f').replace(/ق/g,'q').replace(/ك/g,'k').replace(/ل/g,'l').replace(/م/g,'m').replace(/ن/g,'n').replace(/ه/g,'h').replace(/و/g,'w').replace(/ي/g,'y').replace(/[ًٌٍَُِّْـ]/g,'').replace(/\s+/g,' ').trim();}
function localizedReciterName(r){if(currentLang()==='ar')return r.name_ar||r.name_en||'قارئ';const en=String(r.name_en||'').trim();return /[\u0600-\u06FF]/.test(en)?arabicToLatin(r.name_ar):en||arabicToLatin(r.name_ar);}
function localizedMoshaf(m){const s=String(m||''); if(currentLang()==='ar')return s; const L=currentLang(); if(s.includes('حفص عن عاصم')&&(s.includes('مرتّل')||s.includes('مرتل'))) return ({en:'Hafs from Asim - Murattal',tr:'Asım’dan Hafs - Murattel',fr:'Hafs selon Asim - Murattal',ur:'حفص عن عاصم - مرتب تلاوت',id:'Hafs dari Asim - Murattal'}[L]||s); if(s.includes('حفص عن عاصم')&&s.includes('تلاوة مميزة')) return ({en:'Hafs from Asim - Featured recitation',tr:'Asım’dan Hafs - Özel tilavet',fr:'Hafs selon Asim - Récitation spéciale',ur:'حفص عن عاصم - خصوصی تلاوت',id:'Hafs dari Asim - Tilawah pilihan'}[L]||s); if(s.includes('المصحف المجود')) return ({en:'Mujawwad Quran',tr:'Tecvidli Kur’an',fr:'Coran en Mujawwad',ur:'مصحف مجود',id:'Al-Qur’an Murattal berkualitas'}[L]||s); if(s.includes('ورش عن نافع')) return ({en:'Warsh from Nafi - Murattal',tr:'Nafi’den Verş - Mürattel',fr:'Warsh selon Nafi - Murattal',ur:'ورش عن نافع - مرتب تلاوت',id:'Warsh dari Nafi - Murattal'}[L]||s); return currentLang()==='en'? (r=>r)(s):arabicToLatin(s);}
function localizedAvailable(total){const L=currentLang(); if(L==='ar')return `${total} سورة كاملة`; if(L==='en')return `${total} complete surahs`; if(L==='tr')return `${total} tam sure`; if(L==='fr')return `${total} sourates complètes`; if(L==='ur')return `${total} مکمل سورتیں`; return `${total} surah lengkap`;}
function currentLang(){return getSettings().language||'ar'}
function applyLanguage(){
 const key=currentLang(), L=UI_LANGS[key]||UI_LANGS.ar;
 document.documentElement.lang=key; document.documentElement.dir=L.dir; document.body.dir=L.dir;
 const setText=(id,k)=>{const el=$(id); if(el)el.textContent=T(k)};
 const setHTML=(id,html)=>{const el=$(id); if(el)el.innerHTML=html};
 document.querySelectorAll('#languageSetting option').forEach(o=>{o.textContent=UI_LANGS[o.value].name});
 setText('brandTitle','القرآن الكريم'); setText('brandSubtitle','استماع صوتي');
 setText('heroPill','🎧 قرآن صوتي فقط'); setText('heroMain','استمع إلى كتاب الله'); setText('heroSub','بأصوات القرّاء'); setText('heroDesc','اختر القارئ ثم السورة وابدأ الاستماع مباشرة.');
 const ib=$('installAppBtn'); if(ib)ib.textContent=T('📲 تثبيت الموقع على الهاتف');
 setText('heroNote','تظهر لكل قارئ السور المتاحة له، ولا يُعرض تسجيل ناقص على أنه تلاوة كاملة.'); setText('statsLabel','تلاوة كاملة');
 const on=$('offlineNoteText'); if(on) on.innerHTML=`ℹ️ <strong>${T('ملاحظة مهمة:')}</strong> ${T('السور التي يتم تنزيلها بنجاح تُحفظ على هذا الجهاز للاستماع إليها بدون إنترنت. قد يحذف المتصفح الملفات المحفوظة تلقائيًا إذا تم مسح بيانات الموقع أو التخزين المؤقت، لذلك لا تحذف بيانات الموقع إذا أردت الاحتفاظ بالسور المحفوظة.')} ${T('قد تكون بعض تسجيلات السور غير كاملة، وذلك بسبب المصدر الصوتي.')}`;
 setText('quranListenLead','قال الله تعالى:');
 const ar=$('allRecitersBtn'); if(ar)ar.innerHTML=T('كل القرّاء'); const fr=$('favoriteRecitersBtn'); if(fr)fr.innerHTML=`${T('⭐ المفضلة')} <span id="favoriteReciterCount">${favoriteReciters.size}</span>`;
 setText('chooseSurahLabel','اختيار السورة'); setText('downloadFailedTitle','السور التي تعذر إكمال تنزيلها:');
 const sbtn=$('settingsBtn'); if(sbtn)sbtn.textContent=T('⚙️ الإعدادات');
 const ds=$('downloadProgressText'); if(ds && ds.textContent.trim()==='جاهز للتنزيل') ds.textContent=T('جاهز للتنزيل');
 const dc=$('downloadCurrent'); if(dc && (dc.textContent.trim()==='لم يبدأ التنزيل بعد'||!dc.textContent.trim())) dc.textContent=T('لم يبدأ التنزيل بعد');
 const close=$('closeModal'); if(close){close.title=T('إغلاق');close.setAttribute('aria-label',T('إغلاق'));} const cp=$('closePlayer'); if(cp){cp.title=T('إغلاق');cp.setAttribute('aria-label',T('إغلاق'));}
 const cset=$('closeSettings'); if(cset){cset.title=T('إغلاق');cset.setAttribute('aria-label',T('إغلاق'));}
 if($('search'))$('search').placeholder=T('ابحث عن قارئ…'); if($('surahSearch'))$('surahSearch').placeholder=T('ابحث عن سورة…');
 const prev=$('prevBtn'); if(prev)prev.title=T('السورة السابقة'); const next=$('nextBtn'); if(next)next.title=T('السورة التالية');
 const play=$('playBtn'); if(play)play.title=(!$('audio').paused&&!$('audio').ended)?T('إيقاف السورة مؤقتًا'):T('تشغيل السورة');
 if($('audioState')){const state=$('audioState').textContent.trim(); const map={'جاهز للتشغيل':'جاهز للتشغيل','التلاوة تعمل الآن':'التلاوة تعمل الآن','متوقف مؤقتًا':'متوقف مؤقتًا','جاري تحميل الصوت…':'جاري تحميل الصوت…','اضغط ▶ مرة أخرى لبدء التلاوة.':'اضغط ▶ مرة أخرى لبدء التلاوة.'}; if(map[state])$('audioState').textContent=T(map[state]);}
 if(selected){$('modalTitle').textContent=localizedReciterName(selected);$('modalSubtitle').textContent=`${localizedReciterName(selected)} — ${localizedMoshaf(selected.moshaf)}`;}
 // Translate the complete Settings panel on every language change
 const settingMap={
  settingsCustomize:'تخصيص التطبيق',settingsTitle:'⚙️ الإعدادات',settingsServiceNote:'إعدادات لخدمة المستخدم فقط — بدون إعلانات أو اشتراكات.',
  audioSettingsTitle:'🔊 الصوت والتشغيل',volumeLabelText:'مستوى الصوت',autoNextLabel:'تشغيل السورة التالية تلقائيًا',autoPlayLabel:'التشغيل التلقائي عند اختيار السورة',
  appearanceSettingsTitle:'🎨 المظهر والقراءة',darkModeLabel:'الوضع الداكن',fontSizeLabelText:'حجم الخط',
  notificationsSettingsTitle:'🔔 التنبيهات',notificationsLabel:'السماح بتنبيهات القرآن الكريم',notificationStatus:'التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.',
  downloadsSettingsTitle:'📥 التنزيلات',languageSettingsTitle:'🌐 اللغة',aboutSettingsTitle:'ℹ️ حول القرآن الكريم',aboutHint:'تطبيق مجاني لخدمة كتاب الله، والإصدار الحالي v70.'
 };
 Object.entries(settingMap).forEach(([id,key])=>{const el=$(id);if(el)el.textContent=T(key);});
const ST=SETTINGS_I18N[currentLang()]||SETTINGS_I18N.ar; Object.entries(ST).forEach(([id,val])=>{const el=$(id); if(!el) return; if(id==='downloadSummaryPlaceholder') return; el.textContent=val;}); const langSelect=$('languageSetting'); if(langSelect){langSelect.setAttribute('aria-label',ST.languageLabel); langSelect.title=ST.languageLabel;}
 $('volumeValue')&&($('volumeValue').textContent=Math.round(getSettings().volume*100)+'%');
 if(typeof renderReciters==='function'&&reciters.length)renderReciters();
 if(typeof renderSurahs==='function'&&selected)renderSurahs();
 const ts=$('translationSetting'); if(ts)ts.checked=getSettings().showTranslation!==false; const tl=$('translationSettingLabel'); if(tl)tl.textContent=translationText('label'); const th=$('translationSettingHint'); if(th)th.textContent=translationText('hint');
 if(typeof refreshSettingsUI==='function')refreshSettingsUI();
 if(typeof loadCurrentTranslation==='function' && selected && $('player') && !$('player').classList.contains('hidden')) loadCurrentTranslation();
}


const defaultSettings={volume:1,autoNext:true,autoPlay:true,darkMode:true,fontSize:'medium',notifications:false,language:'ar',backgroundPreset:'default',backgroundColor:'#061a3a',showTranslation:true};
const BACKGROUND_COLORS={default:'#061a3a',blue:'#0b2f5b',green:'#123d2b',purple:'#2a1d4a',brown:'#3a281c',black:'#050505'};
const BACKGROUND_I18N={
 ar:{label:'خلفية التطبيق',custom:'اختر لون الخلفية',hint:'يمكنك اختيار لون جاهز أو اختيار أي لون تريده من منتقي الألوان، وسيتم حفظ اختيارك على هذا الجهاز.',presets:{default:'اللون الافتراضي',blue:'أزرق داكن',green:'أخضر داكن',purple:'بنفسجي داكن',brown:'بني داكن',black:'أسود',custom:'لون من اختيارك'}},
 en:{label:'App background',custom:'Choose background color',hint:'Choose a preset color or any color you like. Your choice is saved on this device.',presets:{default:'Default color',blue:'Dark blue',green:'Dark green',purple:'Dark purple',brown:'Dark brown',black:'Black',custom:'Custom color'}},
 tr:{label:'Uygulama arka planı',custom:'Arka plan rengini seçin',hint:'Hazır bir renk veya istediğiniz herhangi bir rengi seçebilirsiniz. Seçiminiz bu cihazda kaydedilir.',presets:{default:'Varsayılan renk',blue:'Koyu mavi',green:'Koyu yeşil',purple:'Koyu mor',brown:'Koyu kahverengi',black:'Siyah',custom:'Özel renk'}},
 fr:{label:'Arrière-plan de l’application',custom:'Choisir la couleur d’arrière-plan',hint:'Choisissez une couleur prédéfinie ou la couleur de votre choix. Votre sélection est enregistrée sur cet appareil.',presets:{default:'Couleur par défaut',blue:'Bleu foncé',green:'Vert foncé',purple:'Violet foncé',brown:'Marron foncé',black:'Noir',custom:'Couleur personnalisée'}},
 ur:{label:'ایپ کا پس منظر',custom:'پس منظر کا رنگ منتخب کریں',hint:'آپ تیار رنگ منتخب کر سکتے ہیں یا اپنی پسند کا کوئی بھی رنگ چن سکتے ہیں۔ انتخاب اسی آلے پر محفوظ رہے گا۔',presets:{default:'ڈیفالٹ رنگ',blue:'گہرا نیلا',green:'گہرا سبز',purple:'گہرا جامنی',brown:'گہرا بھورا',black:'سیاہ',custom:'اپنی مرضی کا رنگ'}},
 id:{label:'Latar belakang aplikasi',custom:'Pilih warna latar belakang',hint:'Pilih warna yang tersedia atau warna apa pun yang Anda inginkan. Pilihan Anda disimpan di perangkat ini.',presets:{default:'Warna default',blue:'Biru tua',green:'Hijau tua',purple:'Ungu tua',brown:'Cokelat tua',black:'Hitam',custom:'Warna khusus'}}
};
function getSettings(){try{return {...defaultSettings,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}}catch{return {...defaultSettings}}}
function saveSettings(x){localStorage.setItem(SETTINGS_KEY,JSON.stringify(x))}
function normalizeHexColor(v){const s=String(v||'').trim();return /^#[0-9a-fA-F]{6}$/.test(s)?s:'#061a3a'}
function hexToRgb(hex){const h=normalizeHexColor(hex).slice(1);return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)}}
function rgbToHex(r,g,b){return '#'+[r,g,b].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('')}
function mixHex(a,b,amount){const x=hexToRgb(a),y=hexToRgb(b),t=Math.max(0,Math.min(1,amount));return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t)}
function getBackgroundColor(s){const preset=s.backgroundPreset||'default';if(preset==='custom')return normalizeHexColor(s.backgroundColor);if(BACKGROUND_COLORS[preset])return BACKGROUND_COLORS[preset];return s.darkMode?'#061a3a':'#f3f6fa'}
function applyBackground(){
 const s=getSettings();
 const color=getBackgroundColor(s);
 const rgb=hexToRgb(color);
 const luminance=(0.2126*rgb.r+0.7152*rgb.g+0.0722*rgb.b)/255;
 const light=luminance>0.62;
 const surface=light?mixHex(color,'#000000',0.06):mixHex(color,'#ffffff',0.08);
 const surface2=light?mixHex(color,'#000000',0.11):mixHex(color,'#ffffff',0.14);
 const border=light?mixHex(color,'#000000',0.18):mixHex(color,'#ffffff',0.20);
 const player=light?mixHex(color,'#ffffff',0.08):mixHex(color,'#000000',0.28);
 const topbar=light?mixHex(color,'#ffffff',0.92):mixHex(color,'#000000',0.15);
 const text=light?'#132033':'#f6f4ed';
 const muted=light?mixHex(color,'#132033',0.60):mixHex(color,'#b8c9dc',0.55);
 const accent=light?mixHex(color,'#8a6518',0.70):'#e3be6d';
 const root=document.documentElement;
 [['--noor-bg',color],['--noor-surface',surface],['--noor-surface-2',surface2],['--noor-border',border],['--noor-player',player],['--noor-topbar',topbar],['--noor-text',text],['--noor-muted',muted],['--noor-accent',accent]].forEach(([k,v])=>root.style.setProperty(k,v));
 const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',color);
 $('customBackgroundRow')?.classList.toggle('hidden',s.backgroundPreset!=='custom');
 if($('customBackgroundColor'))$('customBackgroundColor').value=normalizeHexColor(s.backgroundColor);
}
function applySettings(){const s=getSettings();const a=$('audio');a.volume=Math.max(0,Math.min(1,Number(s.volume)));document.body.classList.toggle('light-mode',!s.darkMode);document.body.classList.remove('font-small','font-large');if(s.fontSize!=='medium')document.body.classList.add('font-'+s.fontSize);applyBackground();}
function countSavedDownloads(){let total=0;const state=getDownloadState();Object.values(state).forEach(x=>{if(x&&Number.isFinite(Number(x.done))) total+=Math.max(0,Math.min(114,Number(x.done)));});return total;}
function refreshSettingsUI(){const s=getSettings();$('volumeSetting').value=Math.round(s.volume*100);$('volumeValue').textContent=Math.round(s.volume*100)+'%';$('autoNextSetting').checked=!!s.autoNext;$('autoPlaySetting').checked=!!s.autoPlay;$('darkModeSetting').checked=!!s.darkMode;$('fontSizeSetting').value=s.fontSize;const lang=currentLang();const fs=lang==='en'?{small:'Small',medium:'Medium',large:'Large'}:lang==='tr'?{small:'Küçük',medium:'Orta',large:'Büyük'}:lang==='fr'?{small:'Petit',medium:'Moyen',large:'Grand'}:lang==='ur'?{small:'چھوٹا',medium:'درمیانہ',large:'بڑا'}:lang==='id'?{small:'Kecil',medium:'Sedang',large:'Besar'}:{small:'صغير',medium:'متوسط',large:'كبير'};$('fontSizeValue').textContent=fs[s.fontSize]||fs.medium;$('notificationsSetting').checked=!!s.notifications;const n=countSavedDownloads();$('downloadSummary').textContent=lang==='ar'?`تم حفظ ${n} سورة على هذا الجهاز (بحسب سجل التنزيلات).`:lang==='en'?`${n} surahs saved on this device (according to the download record).`:lang==='tr'?`Bu cihazda ${n} sure kaydedildi (indirme kaydına göre).`:lang==='fr'?`${n} sourates enregistrées sur cet appareil (selon l’historique des téléchargements).`:lang==='ur'?`اس آلہ پر ${n} سورتیں محفوظ ہیں۔`: `${n} surah tersimpan di perangkat ini.`;
 const L=BACKGROUND_I18N[lang]||BACKGROUND_I18N.ar;
 $('backgroundLabel').textContent=L.label; $('customBackgroundLabel').textContent=L.custom; $('backgroundHint').textContent=L.hint;
 const bgSel=$('backgroundPreset'); if(bgSel){bgSel.value=s.backgroundPreset||'default'; bgSel.querySelectorAll('option').forEach(o=>{o.textContent=L.presets[o.value]||o.textContent;});}
 const ls=$('languageSetting');if(ls)ls.value=s.language||'ar'; applyBackground();}

async function requestNotifications(enabled){
 if(!enabled){
   const s=getSettings();s.notifications=false;s.notificationLastAt=Date.now();saveSettings(s);return;
 }
 if(!('Notification' in window)){alert(T('هذا المتصفح لا يدعم التنبيهات.'));$('notificationsSetting').checked=false;return;}
 const p=await Notification.requestPermission();
 const s=getSettings();s.notifications=p==='granted';saveSettings(s);$('notificationsSetting').checked=s.notifications;
 $('notificationStatus').textContent=s.notifications?T('تم السماح بالتنبيهات. لن تُستخدم للإعلانات.'):T('لم يتم السماح بالتنبيهات.');
 if(s.notifications) setupQuranNotificationSchedule();
}
async function registerQuranServiceWorker(){
 try{
  if(!('serviceWorker' in navigator)) return null;
  const reg=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
  return reg;
 }catch(e){console.info('Service worker registration unavailable');return null;}
}
const FOUR_HOURS=4*60*60*1000;
let quranNotificationTimer=null;
async function showQuranNotification(){
 const s=getSettings();
 if(!s.notifications || !('Notification' in window) || Notification.permission!=='granted') return;
 const title={ar:'القرآن الكريم',en:'Holy Quran',tr:'Kur’an-ı Kerim',fr:'Saint Coran',ur:'قرآن کریم',id:'Al-Qur’an'}[currentLang()]||'القرآن الكريم';
 const body={ar:'📖 تذكير لطيف: خذ بضع دقائق لقراءة القرآن أو الاستماع إليه.',en:'📖 A gentle reminder: take a few minutes to read or listen to the Quran.',tr:'📖 Nazik bir hatırlatma: Kur’an okumak veya dinlemek için birkaç dakika ayırın.',fr:'📖 Petit rappel : prenez quelques minutes pour lire ou écouter le Coran.',ur:'📖 ایک خوبصورت یاددہانی: قرآن پڑھنے یا سننے کے لیے چند منٹ نکالیے۔',id:'📖 Pengingat lembut: luangkan beberapa menit untuk membaca atau mendengarkan Al-Qur’an.'}[currentLang()]||'📖 تذكير لطيف بقراءة القرآن الكريم.';
 try{
   if(navigator.serviceWorker?.controller){await navigator.serviceWorker.ready; navigator.serviceWorker.controller.postMessage({type:'QURAN_NOTIFY',title,body,lang:currentLang()});}
   else new Notification(title,{body,icon:'icons/icon-192.png',tag:'quran-4h'});
   s.notificationLastAt=Date.now();saveSettings(s);
 }catch(e){console.warn('Quran notification failed',e)}
}
async function setupQuranNotificationSchedule(){
 await registerQuranServiceWorker();
 if(quranNotificationTimer)clearInterval(quranNotificationTimer);
 const s=getSettings();
 const last=Number(s.notificationLastAt||0);const delay=Math.max(1000,last?FOUR_HOURS-(Date.now()-last):FOUR_HOURS);
 quranNotificationTimer=setTimeout(()=>{showQuranNotification();quranNotificationTimer=setInterval(showQuranNotification,FOUR_HOURS)},delay);
 tryRegisterPeriodicNotifications();
}
async function tryRegisterPeriodicNotifications(){
 try{
   const reg=await navigator.serviceWorker?.ready;
   if(reg?.periodicSync && Notification.permission==='granted') await reg.periodicSync.register('quran-reminder-4h',{minInterval:FOUR_HOURS});
 }catch(e){console.info('Periodic notifications are not available in this browser');}
}


if(!window.AndroidQuran && typeof Notification!=='undefined' && Notification.permission==='granted' && getSettings().notifications) setTimeout(()=>setupQuranNotificationSchedule(),1500); else if(!window.AndroidQuran) registerQuranServiceWorker();
function setupSettings(){const btn=$('settingsBtn');if(!btn)return;btn.onclick=()=>{$('settingsModal').classList.remove('hidden');refreshSettingsUI()};$('closeSettings').onclick=()=>$('settingsModal').classList.add('hidden');$('settingsModal').addEventListener('click',e=>{if(e.target.id==='settingsModal')$('settingsModal').classList.add('hidden')});$('volumeSetting').oninput=e=>{const s=getSettings();s.volume=Number(e.target.value)/100;saveSettings(s);applySettings();$('volumeValue').textContent=e.target.value+'%'};$('autoNextSetting').onchange=e=>{const s=getSettings();s.autoNext=e.target.checked;saveSettings(s);if(NATIVE_QURAN)try{window.AndroidQuran.setAutoNext(!!s.autoNext)}catch{}};$('autoPlaySetting').onchange=e=>{const s=getSettings();s.autoPlay=e.target.checked;saveSettings(s)};$('darkModeSetting').onchange=e=>{const s=getSettings();s.darkMode=e.target.checked;saveSettings(s);if(s.backgroundPreset==='default')applySettings();else{document.body.classList.toggle('light-mode',!s.darkMode);document.body.classList.remove('font-small','font-large');if(s.fontSize!=='medium')document.body.classList.add('font-'+s.fontSize);}refreshSettingsUI()};$('fontSizeSetting').onchange=e=>{const s=getSettings();s.fontSize=e.target.value;saveSettings(s);applySettings();refreshSettingsUI()};$('backgroundPreset').onchange=e=>{const s=getSettings();s.backgroundPreset=e.target.value;if(e.target.value==='custom'&&!s.backgroundColor)s.backgroundColor='#061a3a';saveSettings(s);applySettings();refreshSettingsUI()};$('customBackgroundColor').oninput=e=>{const s=getSettings();s.backgroundPreset='custom';s.backgroundColor=normalizeHexColor(e.target.value);saveSettings(s);applyBackground()};$('notificationsSetting').onchange=e=>requestNotifications(e.target.checked);$('languageSetting').onchange=e=>{const s=getSettings();s.language=e.target.value;saveSettings(s);applyLanguage();};$('translationSetting').onchange=e=>{const s=getSettings();s.showTranslation=e.target.checked;saveSettings(s);renderAyahs();};$('manageDownloadsBtn').onclick=()=>{alert(currentLang()==='ar'?'لإدارة السور المحفوظة: افتح قائمة القارئ، وستجد حالة كل سورة وزر تنزيلها. لا نحذف الملفات تلقائيًا حتى لا تفقدها دون قصد.':T('تم حفظ جميع السور المتاحة لهذا القارئ'));};}


let reciterView='all';
function saveFavoriteReciters(){localStorage.setItem(RECITER_FAV_KEY,JSON.stringify([...favoriteReciters]));}
function toggleReciterFavorite(key){if(favoriteReciters.has(key))favoriteReciters.delete(key);else favoriteReciters.add(key);saveFavoriteReciters();renderReciters();}
function setReciterView(view){reciterView=view;document.querySelectorAll('.reciter-tab').forEach(b=>b.classList.remove('active'));$(view==='favorites'?'favoriteRecitersBtn':'allRecitersBtn').classList.add('active');renderReciters();}

const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function status(t){$('status').textContent=t}
function complete(x){if(Number(x?.surah_total)!==114)return false;const a=new Set(String(x.surah_list||'').split(',').map(Number).filter(Boolean));return a.size===114&&Array.from({length:114},(_,i)=>a.has(i+1)).every(Boolean)}
const MUKHTAR_PROBLEM_SURAHS=[20,41];
function isMukhtar(r){return String(r?.name_ar||'').includes('مختار الحاج')||String(r?.name_en||'').toLowerCase().includes('mukhtar')}
function availableSurahNumbers(r){return Array.from({length:114},(_,i)=>i+1)}
function availableSurahTotal(r){return 114}
function filename(n){return String(n).padStart(3,'0')+'.mp3'}
function urlsFor(r,n){
 let primary=(r.server_url||'').replace(/\/+$/,'/')+filename(n); let fallback='';
 try{const u=new URL(primary);fallback=u.origin+'/download'+u.pathname}catch{}
 const mukhtar=isMukhtar(r); if(mukhtar&&(n===20||n===41))primary+=`?noor_fix_v47=${n}`;
 return [...new Set([primary,fallback].filter(Boolean))];
}

// Native Android build: delegate persistent downloads/background playback to the
// Android foreground service. The normal web/PWA implementation remains as fallback.
const NATIVE_QURAN = (()=>{try{return !!window.AndroidQuran && window.AndroidQuran.isNative&&window.AndroidQuran.isNative()}catch{return false}})();
function nativeDownloadRequest(n){return {key:selected?.key||'',surah:n,urls:urlsFor(selected,n)}}
function nativePlaybackRequest(n,position=0){
 const st=getSettings();
 return {key:selected?.key||'',surah:n,urls:urlsFor(selected,n),title:`${n}. ${surahName(n)}`,artist:selected?localizedReciterName(selected):'القرآن الكريم',autoNext:!!st.autoNext,position:Number(position)||0};
}
function nativeDownloadStatus(n){try{return Number(window.AndroidQuran.downloadStatus(selected.key,n))}catch{return -1}}
async function nativeEnsureDownloaded(n,timeoutMs=10*60*1000){
 if(!NATIVE_QURAN||!selected)return false;
 try{if(window.AndroidQuran.isDownloaded(selected.key,n))return true;window.AndroidQuran.downloadAudio(JSON.stringify(nativeDownloadRequest(n)));}catch{return false}
 const end=Date.now()+timeoutMs;
 while(Date.now()<end){
   await new Promise(r=>setTimeout(r,700));
   try{if(window.AndroidQuran.isDownloaded(selected.key,n))return true;const st=Number(window.AndroidQuran.downloadStatus(selected.key,n));if(st===-1)return false;}catch{return false}
 }
 return false;
}
function nativePlayerSync(){
 if(!NATIVE_QURAN||!window.AndroidQuran)return;
 try{
  const st=JSON.parse(window.AndroidQuran.getState()||'{}');
  if(!st.active){return;}
  const n=Number(st.surah)||currentSurah;
  if(n&&n!==currentSurah){currentSurah=n;currentAyahIndex=0;renderSurahs();}
  if(st.key&&st.key!==selected?.key){
    const rec=reciters.find(r=>r.key===st.key);if(rec){selected=rec;renderReciters();renderSurahs();syncDownloadAllButton();}
  }
  if(n) $('nowSurah').textContent=`${n}. ${surahName(n)}`;
  try{localStorage.setItem('quran_last',JSON.stringify({key:st.key||selected?.key||'',surah:n,position:Number(st.position)||0,reciter:selected||null}))}catch{}
  $('nowReciter').textContent=st.artist||$('nowReciter').textContent;
  $('currentTime').textContent=fmt(Number(st.position)||0);
  $('duration').textContent=fmt(Number(st.duration)||0);
  $('progress').value=Number(st.duration)>0?Math.max(0,Math.min(100,100*Number(st.position)/Number(st.duration))):0;
  $('playBtn').textContent=st.playing?'Ⅱ':'▶';
  $('audioState').textContent=st.playing?'التلاوة تعمل في الخلفية':'متوقف مؤقتًا';
  document.querySelectorAll('.surah').forEach(row=>{
    const active=Number(row.dataset.num)===n&&!!st.playing;row.classList.toggle('playing',active);row.setAttribute('aria-current',active?'true':'false');
    const b=row.querySelector('.surah-play');if(b)b.textContent=active?'⏸️':'▶';
  });
 }catch{}
}
if(NATIVE_QURAN) setInterval(nativePlayerSync,700);
const FALLBACK_RECITERS=[
 {id:1,moshafId:1,name_ar:'إبراهيم الأخضر',name_en:'Ibrahim Al-Akdar',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server6.mp3quran.net/akdr/'},
 {id:4,moshafId:4,name_ar:'أبو بكر الشاطري',name_en:'Abu Bakr Al Shatri',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server11.mp3quran.net/shatri/'},
 {id:5,moshafId:5,name_ar:'أحمد بن علي العجمي',name_en:'Ahmad Al-Ajmy',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server10.mp3quran.net/ajm/'},
 {id:6,moshafId:6,name_ar:'أحمد الحواشي',name_en:'Ahmad Al-Hawashi',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server11.mp3quran.net/hawashi/'},
 {id:8,moshafId:8,name_ar:'أحمد صابر',name_en:'Ahmad Saber',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server8.mp3quran.net/saber/'},
 {id:9,moshafId:9,name_ar:'أحمد نعينع',name_en:'Ahmad Nauina',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server11.mp3quran.net/ahmad_nu/'},
 {id:10,moshafId:10,name_ar:'أكرم العلاقمي',name_en:'Akram Alalaqmi',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server9.mp3quran.net/akrm/'},
 {id:12,moshafId:12,name_ar:'إدريس أبكر',name_en:'Idrees Abkr',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server6.mp3quran.net/abkr/'},
 {id:13,moshafId:13,name_ar:'الزين محمد أحمد',name_en:'Alzain Mohammad Ahmad',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server9.mp3quran.net/alzain/'},
 {id:14,moshafId:14,name_ar:'القارئ ياسين',name_en:'Al-Qaria Yassen',moshaf:'ورش عن نافع - مرتل',server_url:'https://server11.mp3quran.net/qari/'},
 {id:16,moshafId:16,name_ar:'الشيخ عبد الباسط عبد الصمد',name_en:'Abdul Basit AbdusSamad',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server7.mp3quran.net/basit/'},
 {id:18,moshafId:18,name_ar:'الشيخ ماهر المعيقلي',name_en:'Maher Al Muaiqly',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server12.mp3quran.net/maher/'},
 {id:20,moshafId:20,name_ar:'الشيخ مشاري العفاسي',name_en:'Mishary Alafasy',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server8.mp3quran.net/afs/'},
 {id:21,moshafId:21,name_ar:'الشيخ سعد الغامدي',name_en:'Saad Al-Ghamdi',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server7.mp3quran.net/s_gmd/'},
 {id:22,moshafId:22,name_ar:'الشيخ ياسر الدوسري',name_en:'Yasser Al-Dosari',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server11.mp3quran.net/yasser/'},
 {id:23,moshafId:23,name_ar:'الشيخ عبدالله الجهني',name_en:'Abdullah Al-Juhany',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server11.mp3quran.net/jhn/'},
 {id:24,moshafId:24,name_ar:'الشيخ سعود الشريم',name_en:'Saud Al-Shuraim',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server7.mp3quran.net/shur/'},
 {id:25,moshafId:25,name_ar:'الشيخ عبدالرحمن السديس',name_en:'Abdulrahman Al-Sudais',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server11.mp3quran.net/sds/'},
 {id:26,moshafId:26,name_ar:'الشيخ محمد صديق المنشاوي',name_en:'Mohamed Siddiq Al-Minshawi',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server10.mp3quran.net/minsh/'},
 {id:27,moshafId:27,name_ar:'الشيخ محمود خليل الحصري',name_en:'Mahmoud Khalil Al-Husary',moshaf:'حفص عن عاصم - مرتل',server_url:'https://server13.mp3quran.net/husr/'},
];
async function loadReciters(){
 status(T('جارٍ تحميل دليل القرّاء…'));
 let lastErr=null;
 for(const url of CATALOG_URLS){
  try{
   const r=await fetch(url,{cache:'no-store'}); if(!r.ok)throw new Error('catalog '+r.status);
   const data=await r.json(); const out=[];
   for(const rec of data.reciters||[]) for(const m of rec.moshaf||[]) { const server=m.server_url||m.server; if(complete({...m,server_url:server})) out.push({key:`${rec.id}-${m.id}`,id:rec.id,moshafId:m.id,name_ar:rec.name_arabic||rec.name||'قارئ',name_en:rec.name_transliteration||'',moshaf:m.moshaf_name||m.name||'تلاوة كاملة',server_url:server}); }
   reciters=out.filter((x,i,a)=>a.findIndex(y=>y.key===x.key)===i);
   if(reciters.length){renderReciters();status(`${T('تم تحميل')} ${reciters.length} ${T('تلاوة كاملة')}.`);return;}
  }catch(e){lastErr=e;}
 }
 reciters=FALLBACK_RECITERS.map(r=>({...r,key:`${r.id}-${r.moshafId}`}));
 renderReciters();
 status(T('تعذر تحميل الدليل الخارجي؛ تم عرض قائمة قرّاء جاهزة ويمكنك الاستماع والتنزيل مباشرة.'));
 console.warn('catalog failed',lastErr);
}
function renderReciters(){
 const q=$('search').value.trim().toLowerCase();
 let list=reciters.filter(r=>`${r.name_ar} ${r.name_en} ${r.moshaf}`.toLowerCase().includes(q));
 if(reciterView==='favorites')list=list.filter(r=>favoriteReciters.has(r.key));
 $('reciterCount').textContent=list.length;$('favoriteReciterCount').textContent=favoriteReciters.size;
 $('reciters').innerHTML=list.map(r=>{
  const active=selected&&selected.key===r.key; const fav=favoriteReciters.has(r.key); const st=getDownloadState()[r.key];
  const total=availableSurahTotal(r); const name=localizedReciterName(r); const moshaf=localizedMoshaf(r.moshaf);
  const completeAll=!!st&&Number(st.done)===total&&(!Array.isArray(st.failed)||st.failed.length===0);
  const downloadControl=completeAll?`<span class="reciter-download-done" title="${esc(T('تم حفظ جميع السور المتاحة لهذا القارئ'))}">${esc(T('✓ تم تنزيل الكل'))}</span>`:`<button class="reciter-download-all" type="button" title="${esc(T('تحميل جميع السور المتاحة لهذا القارئ'))}">${esc(T('⬇ تحميل الكل'))}</button>`;
  const small=active?T('يتم الفتح عليه الآن'):(fav?`⭐ ${T('مضاف إلى المفضلة')}`:localizedAvailable(total));
  const favTitle=fav?T('إزالة من المفضلة'):T('إضافة إلى المفضلة');
  return `<article class="card${active?' selected-reciter':''}" data-key="${esc(r.key)}"><div class="avatar">🎙️</div><div class="card-text"><h3 class="reciter-name-row"><span>${esc(name)}</span>${downloadControl}${active?`<span class="selected-badge">✓ ${esc(T('القارئ الحالي'))}</span>`:''}</h3><p>${esc(moshaf)}</p><small>${esc(small)}</small></div><button class="reciter-favorite${fav?' is-favorite':''}" type="button" title="${esc(favTitle)}" aria-label="${esc(favTitle+' '+name)}">${fav?'★':'☆'}</button><div class="arrow">‹</div></article>`
 }).join('')||`<div class="status">${esc(T('لا توجد نتيجة مطابقة.'))}</div>`;
 document.querySelectorAll('.card').forEach(c=>{
  c.addEventListener('click',e=>{if(e.target.closest('.reciter-favorite,.reciter-download-all'))return;openReciter(c.dataset.key)});
  const b=c.querySelector('.reciter-favorite');if(b)b.addEventListener('click',e=>{e.stopPropagation();toggleReciterFavorite(c.dataset.key)});
  const d=c.querySelector('.reciter-download-all');if(d)d.addEventListener('click',e=>{e.stopPropagation();openReciter(c.dataset.key);setTimeout(()=>downloadAllSurahs(),120)});
 });
}
function syncDownloadAllButton(){const btn=$('downloadAllBtn');if(!btn||!selected)return;const total=availableSurahTotal(selected);const normalized=normalizeDownloadStateFor(selected.key,total);const st=normalized[selected.key];const downloaded=Array.isArray(st?.downloaded)?st.downloaded.length:Number(st?.done)||0;const completeAll=downloaded===total&&(!Array.isArray(st?.failed)||st.failed.length===0);btn.classList.remove('hidden');btn.disabled=completeAll;if(completeAll){btn.textContent=T('✓ تم تنزيل الكل');btn.classList.add('download-all-done');btn.title=T('تم حفظ جميع السور المتاحة لهذا القارئ');}else{btn.textContent=T('⬇ تحميل الكل');btn.classList.remove('download-all-done');btn.title=T('تحميل جميع السور المتاحة لهذا القارئ');}}
function openReciter(key){selected=reciters.find(r=>r.key===key);if(!selected)return;renderReciters();$('modalTitle').textContent=localizedReciterName(selected);$('modalSubtitle').textContent=`${localizedReciterName(selected)} — ${localizedMoshaf(selected.moshaf)}`;$('surahSearch').value='';renderSurahs();syncDownloadAllButton();$('modal').classList.remove('hidden')}

const AUDIO_CACHE_NAME='quran-audio-offline-v59';
const TEXT_CACHE_PREFIX='quran_text_offline_v29_';
async function cacheAudioUrl(url){
 const cache=await caches.open(AUDIO_CACHE_NAME);
 const existing=await cache.match(url);
 if(existing){
   if(existing.type==='opaque' || existing.status===200){return true;}
   try{await cache.delete(url)}catch{}
 }
 // Only cache a genuinely complete HTTP response. A 206 Partial Content response
 // is deliberately rejected because caching it would produce a shortened MP3.
 try{
   const res=await fetch(url,{mode:'cors',cache:'no-store'});
   if(res.status===200){
     const len=Number(res.headers.get('content-length')||0);
     if(len>0){
       const copy=res.clone();
       const buf=await copy.arrayBuffer();
       if(buf.byteLength!==len) return false;
     }
     await cache.put(url,res.clone());
     return true;
   }
 }catch{}
 try{
   const res=await fetch(url,{mode:'no-cors',cache:'no-store'});
   // Opaque responses cannot expose status/length, so use them only as a last resort.
   // They are accepted for playback/download compatibility, but never reuse a known
   // non-200 cached response.
   if(res.type==='opaque'){await cache.put(url,res.clone());return true}
 }catch{}
 return false;
}
async function getCachedAudioUrl(urls){
 try{
  const list=Array.isArray(urls)?urls:[urls];
  const c=await caches.open(AUDIO_CACHE_NAME);
  for(const url of list){
   if(!url) continue;
   const r=await c.match(url);
   if(r){
    const b=await r.blob();
    if(b && b.size>0) return URL.createObjectURL(b);
   }
  }
 }catch{}
 return null;
}
function cacheText(n,list){try{localStorage.setItem(TEXT_CACHE_PREFIX+n,JSON.stringify(list))}catch{}}
function getCachedText(n){try{const x=JSON.parse(localStorage.getItem(TEXT_CACHE_PREFIX+n)||'null');return Array.isArray(x)?x:null}catch{return null}}

const DOWNLOAD_STATE_KEY='quran_download_progress_v59';
function getDownloadState(){try{return JSON.parse(localStorage.getItem(DOWNLOAD_STATE_KEY)||'{}')}catch{return {}}}
function normalizeDownloadStateFor(key,total){const all=getDownloadState();const st=all[key];if(!st)return all;let downloaded=Array.isArray(st.downloaded)?st.downloaded.slice():[];if(downloaded.length===0&&Number(st.done)===total&&(!Array.isArray(st.failed)||st.failed.length===0))downloaded=Array.from({length:total},(_,i)=>i+1);all[key]={...st,downloaded,done:downloaded.length,total};saveDownloadState(all);return all;}
function saveDownloadState(state){try{localStorage.setItem(DOWNLOAD_STATE_KEY,JSON.stringify(state))}catch{}}
function downloadStateKey(){return selected?selected.key:''}
function setDownloadProgress(done,current=0,currentName='',failed=0){
 const wrap=$('downloadProgress');if(!wrap)return;wrap.classList.remove('hidden');
 const total=availableSurahTotal(selected);const pct=Math.max(0,Math.min(100,Math.round(done/Math.max(1,total)*100)));
 $('downloadProgressBar').style.width=pct+'%';$('downloadPercent').textContent=pct+'%';
 const lang=currentLang();
 $('downloadProgressText').textContent=lang==='ar'?`تم تنزيل ${done} من ${total} سورة`:lang==='en'?`${done} of ${total} surahs downloaded`:lang==='tr'?`${total} sureden ${done} tanesi indirildi`:lang==='fr'?`${done} sur ${total} sourates téléchargées`:lang==='ur'?`${total} میں سے ${done} سورتیں ڈاؤن لوڈ ہوئیں`:`${done} dari ${total} surah diunduh`;
 $('downloadCurrent').textContent=current?(lang==='ar'?`جاري تنزيل السورة ${current}: ${currentName}${failed?` — تعذر ${failed}`:''}`:lang==='en'?`Downloading surah ${current}: ${currentName}${failed?` — ${failed} failed`:''}`:lang==='tr'?`${current}. sure indiriliyor: ${currentName}${failed?` — ${failed} başarısız`:''}`:lang==='fr'?`Téléchargement de la sourate ${current} : ${currentName}${failed?` — ${failed} échecs`:''}`:lang==='ur'?`سورت ${current} ڈاؤن لوڈ ہو رہی ہے: ${currentName}${failed?` — ${failed} ناکام`:''}`:`Mengunduh surah ${current}: ${currentName}${failed?` — ${failed} gagal`:''}`):(done>=total?T('اكتمل تنزيل جميع السور'):(lang==='ar'?`متوقف عند السورة ${done+1} من ${total}`:`${T('جارٍ تنزيل السورة')} ${done+1} ${T('من')} ${total}`));
}
function showFailedDownloads(failed){
 const box=$('downloadFailedBox'), list=$('downloadFailedList');
 if(!box||!list)return;
 list.innerHTML='';
 if(!failed||!failed.length){box.classList.add('hidden');return;}
 failed.forEach(n=>{const li=document.createElement('li');li.textContent=`${n}. ${surahName(n)||T('لا توجد سورة غير معروفة')}`;list.appendChild(li);});
 box.classList.remove('hidden');
}
async function purgeMukhtarProblemCaches(){if(!selected||!isMukhtar(selected))return;try{const c=await caches.open(AUDIO_CACHE_NAME);const keys=await c.keys();for(const req of keys){const u=new URL(req.url);const path=u.pathname;const isProblem=MUKHTAR_PROBLEM_SURAHS.some(n=>path.endsWith('/'+String(n).padStart(3,'0')+'.mp3'));if(isProblem)await c.delete(req)}for(const n of MUKHTAR_PROBLEM_SURAHS)for(const url of urlsFor(selected,n))await c.delete(url)}catch{}}
async function isSurahCached(n){
 if(!selected)return false;
 if(NATIVE_QURAN){try{return !!window.AndroidQuran.isDownloaded(selected.key,n)}catch{return false}}
 for(const url of urlsFor(selected,n)){
   try{
     const c=await caches.open(AUDIO_CACHE_NAME);
     const r=await c.match(url);
     if(!r)continue;
     if(r.type==='opaque' || r.status===200)return true;
     await c.delete(url);
   }catch{}
 }
 return false;
}
async function downloadSurah(n, button){
 if(!selected)return;
 button.disabled=true;button.textContent='…';
 let ok=false;
 if(NATIVE_QURAN){ ok=await nativeEnsureDownloaded(n); }
 else { for(const url of urlsFor(selected,n)){if(await cacheAudioUrl(url)){ok=true;break;}} }
 try{const t=await fetchText(n);cacheText(n,t)}catch{}
 button.textContent=ok?'✓':'!';
 button.title=ok?`${T('تم حفظ')} ${surahName(n)} ${T('بدون إنترنت')}`:`${T('تعذر حفظ')} ${surahName(n)}`;
 if(ok){
   const saved=getDownloadState(),key=downloadStateKey(),prev=saved[key]||{},downloaded=Array.isArray(prev.downloaded)?prev.downloaded.slice():[];
   if(!downloaded.includes(n))downloaded.push(n);
   downloaded.sort((a,b)=>a-b);
   const total=availableSurahTotal(selected);
   saved[key]={...prev,downloaded,done:downloaded.length,total,failed:Array.isArray(prev.failed)?prev.failed.filter(x=>x!==n):[]};
   saveDownloadState(saved);syncDownloadAllButton();renderReciters();
 }
 setTimeout(()=>{button.textContent='⬇';button.disabled=false},1600);
}
async function downloadAllSurahs(){
 if(!selected)return; const btn=$('downloadAllBtn'); btn.disabled=true; const original=btn.textContent;
 const key=downloadStateKey(); const saved=getDownloadState(); const nums=availableSurahNumbers(selected); const total=nums.length;
 let count=0,failed=[]; const initial=saved[key]||{}; const downloaded=new Set(Array.isArray(initial.downloaded)?initial.downloaded:[]); showFailedDownloads([]); $('downloadProgress').classList.remove('hidden');
 await purgeMukhtarProblemCaches(); $('downloadStatus').textContent=currentLang()==='ar'?'جاري فحص الملفات المحفوظة…':currentLang()==='en'?'Checking saved files…':currentLang()==='tr'?'Kayıtlı dosyalar kontrol ediliyor…':currentLang()==='fr'?'Vérification des fichiers enregistrés…':currentLang()==='ur'?'محفوظ فائلوں کی جانچ جاری ہے…':'Memeriksa file yang tersimpan…';
 for(const n of nums){
  if(await isSurahCached(n)){count++;downloaded.add(n);saved[key]={done:downloaded.size,downloaded:Array.from(downloaded).sort((a,b)=>a-b),failed:[],last:n,total};saveDownloadState(saved);setDownloadProgress(count,n,surahName(n),failed.length);continue;}
  setDownloadProgress(count,n,surahName(n),failed.length); let ok=false;
  if(NATIVE_QURAN){ok=await nativeEnsureDownloaded(n);} else {for(const url of urlsFor(selected,n)){try{if(await cacheAudioUrl(url)){ok=true;break;}}catch{}}}
  if(ok){count++;downloaded.add(n);} else {failed.push(n);showFailedDownloads(failed);} 
  try{const t=await fetchText(n);cacheText(n,t)}catch{}
  saved[key]={done:downloaded.size,downloaded:Array.from(downloaded).sort((a,b)=>a-b),failed,last:n,total};saveDownloadState(saved);
  btn.textContent=`💾 ${count}/${total}`;
  $('downloadStatus').textContent=failed.length?(currentLang()==='ar'?`تم ${count}/${total} — تعذر إكمال تنزيل ${failed.length} سورة، وسيستمر التنزيل`:currentLang()==='en'?`${count}/${total} — ${failed.length} surahs could not be completed; downloading continues`:currentLang()==='tr'?`${count}/${total} — ${failed.length} surenin indirilmesi tamamlanamadı; indirme devam ediyor`:currentLang()==='fr'?`${count}/${total} — ${failed.length} sourates n’ont pas pu être terminées ; le téléchargement continue`:currentLang()==='ur'?`${count}/${total} — ${failed.length} سورتوں کا ڈاؤن لوڈ مکمل نہ ہو سکا؛ ڈاؤن لوڈ جاری ہے`:`${count}/${total} — ${failed.length} surah belum selesai; unduhan berlanjut`):(currentLang()==='ar'?`تم تنزيل ${count} من ${total} سورة`:currentLang()==='en'?`${count} of ${total} surahs downloaded`:currentLang()==='tr'?`${count} / ${total} sure indirildi`:currentLang()==='fr'?`${count} sur ${total} sourates téléchargées`:currentLang()==='ur'?`${total} میں سے ${count} سورتیں ڈاؤن لوڈ ہوئیں`:`${count} dari ${total} surah diunduh`);
 }
 saved[key]={done:downloaded.size,downloaded:Array.from(downloaded).sort((a,b)=>a-b),failed,last:nums[nums.length-1]||0,total};saveDownloadState(saved);showFailedDownloads(failed);btn.textContent=failed.length?`💾 ${downloaded.size}/${total}`:T('✓ تم تنزيل الكل');
 if(failed.length){
  const failNames=failed.map(n=>`${n}. ${surahName(n)||T('لا توجد سورة غير معروفة')}`).join('، ');$('downloadStatus').textContent=currentLang()==='ar'?`اكتمل التنزيل: تم حفظ ${count}/${total}. تعذر إكمال تنزيل ${failed.length} سورة: ${failNames}`:currentLang()==='en'?`Download finished: ${count}/${total} saved. ${failed.length} surahs could not be completed: ${failNames}`:currentLang()==='tr'?`İndirme tamamlandı: ${count}/${total} kaydedildi. ${failed.length} sure tamamlanamadı: ${failNames}`:currentLang()==='fr'?`Téléchargement terminé : ${count}/${total} enregistrées. ${failed.length} sourates incomplètes : ${failNames}`:currentLang()==='ur'?`ڈاؤن لوڈ مکمل: ${count}/${total} محفوظ۔ ${failed.length} سورتیں مکمل نہ ہو سکیں: ${failNames}`:`Unduhan selesai: ${count}/${total} tersimpan. ${failed.length} surah belum lengkap: ${failNames}`;
  $('downloadCurrent').textContent=T('يمكن إعادة الضغط على «تنزيل الكل» لمحاولة السور التي لم تُحفظ.');btn.classList.remove('hidden');btn.classList.remove('download-all-done');setTimeout(()=>{btn.textContent=original;btn.disabled=false},3000);
 }else{$('downloadStatus').textContent=currentLang()==='ar'?`اكتمل تنزيل جميع السور للقارئ ${selected.name_ar} (${total} سورة)`:currentLang()==='en'?`All ${total} surahs for ${localizedReciterName(selected)} are downloaded`:currentLang()==='tr'?`${localizedReciterName(selected)} için ${total} surenin tamamı indirildi`:currentLang()==='fr'?`Les ${total} sourates de ${localizedReciterName(selected)} sont téléchargées`:currentLang()==='ur'?`${localizedReciterName(selected)} کی تمام ${total} سورتیں ڈاؤن لوڈ ہو گئی ہیں`:`Semua ${total} surah untuk ${localizedReciterName(selected)} telah diunduh`;setDownloadProgress(total,0,'',0);btn.classList.add('download-all-done');btn.disabled=true;}
 syncDownloadAllButton(); renderReciters();
}
function updateSurahButtons(){
 document.querySelectorAll('.surah').forEach(row=>{
   const n=Number(row.dataset.num), btn=row.querySelector('.surah-play');
   const active=n===currentSurah && !$('audio').paused && !$('audio').ended;
   if(btn){btn.textContent=active?'⏸️':'▶';btn.title=active?'إيقاف مؤقت':'تشغيل السورة';btn.setAttribute('aria-label',active?'إيقاف السورة مؤقتًا':'تشغيل السورة');}
   row.classList.toggle('playing',active);
   row.setAttribute('aria-current',active?'true':'false');
   const name=row.querySelector('.surah-name');
   if(name){ const base=surahName(n); name.dataset.baseName=base; name.innerHTML=active?`${esc(base)} <span class="now-playing-badge">▶ ${esc(T('تُقرأ الآن'))}</span>`:esc(base); }
 });
}
function renderSurahs(){
 const q=$('surahSearch').value.trim();
 const list=names.map((_,i)=>({n:i+1,name:surahName(i+1)})).filter(s=>!q||s.name.toLowerCase().includes(q)||names[s.n-1].includes(q)||String(s.n)===q);
 $('surahs').innerHTML=list.map(s=>`
  <div class="surah" data-num="${s.n}">
    <span class="num">${s.n}</span>
    <strong class="surah-name" data-base-name="${esc(s.name)}" dir="auto">${esc(s.name)}</strong>
    <div class="surah-actions">
      <button class="surah-play" type="button" title="${esc(T('تشغيل السورة'))}" aria-label="${esc(T('تشغيل'))} ${esc(s.name)}">${s.n===currentSurah && !$('audio').paused && !$('audio').ended ? '⏸️' : '▶'}</button>
      <button class="surah-download" type="button" title="${esc(T('تنزيل'))} ${esc(s.name)}" aria-label="${esc(T('تنزيل'))} ${esc(s.name)}">⬇</button>
    </div>
  </div>`).join('');
 document.querySelectorAll('.surah').forEach(row=>{
   row.querySelector('.surah-download').addEventListener('click',e=>{e.stopPropagation();downloadSurah(Number(row.dataset.num),e.currentTarget)});
   row.querySelector('.surah-play').addEventListener('click',()=>{
     const n=Number(row.dataset.num);
     if(n===currentSurah && !$('audio').paused && !$('audio').ended){
       // Manual pause from the surah list must never be treated as an
       // unexpected interruption. Cancel recovery/auto-advance first.
       userPaused=true;
       backgroundWanted=false;
       recovering=false;
       recoveryMode='';
       retryCount=0;
       clearTimeout(waitingTimer);
       clearTimeout(retryTimer);
       clearTimeout(nextAdvanceTimer);
       nextAdvanceArmed=false;
       $('audio').pause();
       if('mediaSession' in navigator)try{navigator.mediaSession.playbackState='paused'}catch{}
       $('playBtn').textContent='▶';
       $('audioState').textContent=T('متوقف مؤقتًا');
       updateSurahButtons();
       savePosition();
       return;
     }
     currentSurah=n;
     updateSurahButtons();
     playSurah(n);
   });
   row.addEventListener('click',e=>{
     if(!e.target.closest('.surah-download')&&!e.target.closest('.surah-play')) playSurah(Number(row.dataset.num));
   });
 });
}
async function fetchText(n){
 const cached=getCachedText(n); if(cached) return cached;
 const sources=[
  `${QURAN_URL}/surah/${n}/quran-uthmani`,
  `${QURAN_URL}/surah/${n}/editions/quran-uthmani`,
  `https://api.alquran.cloud/v1/surah/${n}/quran-simple`
 ];
 for(const url of sources){
  try{
   const r=await fetch(url,{cache:'no-store'});
   if(!r.ok)continue;
   const j=await r.json();
   const data=Array.isArray(j?.data)?j.data[0]:j?.data;
   const list=data?.ayahs;
   if(Array.isArray(list)&&list.length){
    const out=list.map(a=>({numberInSurah:a.numberInSurah,number:a.number,text:a.text})); cacheText(n,out); return out;
   }
  }catch{}
 }
 throw new Error('quran text unavailable');
}
async function fetchTiming(){try{const r=await fetch(`https://mp3quran.net/api/v3/ayat_timing?surah=${currentSurah}&read=${encodeURIComponent(selected.moshafId)}`,{cache:'no-store'});if(!r.ok)return[];const j=await r.json();const arr=Array.isArray(j)?j:(j.ayat_timing||j.data||[]);return Array.isArray(arr)?arr.filter(t=>Number(t.start_time)>=0&&Number(t.end_time)>0&&Number(t.ayah)>0):[]}catch{return[]}}

const TRANSLATION_CACHE_NAME='quran-translation-offline-v57';
let currentTranslation=null;
let translationLoadToken=0;
async function getTranslationEdition(lang){
  if(lang==='ar') return null;
  const configured=TRANSLATION_EDITION[lang];
  if(configured) return configured;
  return null;
}
async function fetchTranslation(n,lang=currentLang()){
  if(lang==='ar') return {ayahs:[],edition:null};
  const edition=await getTranslationEdition(lang);
  if(!edition) throw new Error('translation edition unavailable');
  const cache=await caches.open(TRANSLATION_CACHE_NAME);
  const cacheKey=`https://noor-muslim.local/translation/${edition.id}/surah/${n}`;
  try{
    const cached=await cache.match(cacheKey);
    if(cached){
      const j=await cached.json();
      if(Array.isArray(j?.ayahs)&&j.ayahs.length) return {ayahs:j.ayahs,edition:j.edition||edition};
    }
  }catch{}
  const urls=[`${QURAN_URL}/surah/${n}/${edition.id}`,`${QURAN_URL}/surah/${n}/editions/${edition.id}`];
  for(const url of urls){
    try{
      const r=await fetch(url,{cache:'no-store'});
      if(!r.ok) continue;
      const j=await r.json();
      const data=Array.isArray(j?.data)?j.data.find(x=>x?.edition?.identifier===edition.id)||j.data[0]:j?.data;
      const list=Array.isArray(data?.ayahs)?data.ayahs.map(a=>({numberInSurah:Number(a.numberInSurah),text:String(a.text||'').trim()})).filter(a=>a.text):[];
      if(list.length){
        const payload={ayahs:list,edition:data?.edition||edition};
        try{await cache.put(cacheKey,new Response(JSON.stringify(payload),{headers:{'content-type':'application/json'}}));}catch{}
        return payload;
      }
    }catch{}
  }
  throw new Error('translation unavailable');
}
function renderCurrentAyahTranslation(){
 const box=$('ayahTranslation'); if(!box)return;
 const settings=getSettings();
 const lang=currentLang();
 if(lang==='ar'||!settings.showTranslation||!currentTranslation?.ayahs?.length){box.classList.add('hidden');box.innerHTML='';return;}
 const n=ayahs[currentAyahIndex]?.numberInSurah;
 const item=currentTranslation.ayahs.find(x=>Number(x.numberInSurah)===Number(n));
 if(!item){box.classList.add('hidden');box.innerHTML='';return;}
 const meta=currentTranslation.edition||TRANSLATION_EDITION[lang];
 box.innerHTML=`<div class="translation-label">${esc(translationText('ترجمة معاني الآيات'))}</div><p>${esc(item.text)}</p><small>${esc(translationText('المصدر'))}: ${esc(meta?.name||meta?.identifier||'')}</small>`;
 box.classList.remove('hidden');
}
async function loadCurrentTranslation(){
 const box=$('ayahTranslation'); if(!box)return;
 const lang=currentLang(); const settings=getSettings();
 if(lang==='ar'||!settings.showTranslation){currentTranslation=null;box.classList.add('hidden');box.innerHTML='';return;}
 const token=++translationLoadToken;
 box.classList.remove('hidden');box.innerHTML=`<span class="translation-loading">${esc(translationText('جاري تحميل ترجمة الآية…'))}</span>`;
 try{const data=await fetchTranslation(currentSurah,lang);if(token!==translationLoadToken)return;currentTranslation=data;renderCurrentAyahTranslation();}
 catch{if(token!==translationLoadToken)return;currentTranslation=null;box.innerHTML=`<span class="translation-error">${esc(translationText('تعذر تحميل الترجمة حاليًا.'))}</span>`;box.classList.remove('hidden');}
}
function renderAyahs(){
 const panel=$('ayahPanel'), box=$('ayahs'), title=$('ayahTitle');
 if(!ayahs.length){panel.classList.add('hidden');return}
 panel.classList.remove('hidden');
 const a=ayahs[currentAyahIndex]||ayahs[0];
 title.textContent=`${currentSurah}. ${surahName(currentSurah)} — الآية ${a.numberInSurah}`;
 box.innerHTML=`<span class="ayah active"><span class="ayah-number">${a.numberInSurah}</span><p>${esc(a.text)}</p></span>`;
 renderCurrentAyahTranslation();
}
function sync(){const a=$('audio');if(!ayahs.length||!timings.length)return;const t=a.currentTime*1000;let idx=-1;for(const x of timings){if(t>=Number(x.start_time)&&t<Number(x.end_time)){idx=Number(x.ayah)-1;break}}if(idx>=0&&idx<ayahs.length&&idx!==currentAyahIndex){currentAyahIndex=idx;renderAyahs();document.querySelector('.ayah.active')?.scrollIntoView({behavior:'smooth',block:'center'});$('nowSurah').textContent=`${currentSurah}. ${surahName(currentSurah)} • ${T('الآية')} ${ayahs[idx].numberInSurah}`}}
function updateDownload(url){ /* زر التنزيل موجود بجانب كل سورة */ }
let audioLoadToken=0;
async function audioDurationLooksComplete(a){
 try{
   if(!Number.isFinite(a.duration)||a.duration<=0)return true;
   const timingsNow=await fetchTiming();
   if(!timingsNow.length)return true;
   const last=Math.max(...timingsNow.map(x=>Number(x.end_time)||0))/1000;
   return !(last>0 && a.duration+5<last);
 }catch{return true}
}
let userPaused=false;
let backgroundWanted=false;
let waitingTimer=null;
let activeLocalAudioUrl=null;
let nextPreloadAudio=null;
let nextPreloadSurah=0;
let nextAdvanceArmed=false;
let nextAdvanceTimer=null;
const WAIT_RECOVERY_MS=12000;
const NEXT_ARM_SECONDS=2.5;
async function loadAudio(n,autoplay=true,resumeAt=0){
 const settings=getSettings(); autoplay=autoplay && settings.autoPlay;
 if(NATIVE_QURAN){
  const a=$('audio'); try{a.pause();a.removeAttribute('src');a.load()}catch{}
  currentSurah=n;sourceLoading=false;userPaused=!autoplay;backgroundWanted=!!autoplay;
  try{window.AndroidQuran.playSurah(JSON.stringify(nativePlaybackRequest(n,resumeAt)));$('audioState').textContent='جارٍ تشغيل التلاوة في مشغل الخلفية…';$('playBtn').textContent='▶';nativePlayerSync()}catch{ $('audioState').textContent='تعذر تشغيل المشغل الخلفي.'; }
  return;
 }
 const a=$('audio');
 try{a.setAttribute('playsinline','');a.setAttribute('preload','auto');}catch{}
 const token=++audioLoadToken;
 audioCandidates=urlsFor(selected,n);candidateIndex=0;
 const target=Math.max(0,Number(resumeAt)||0);
 sourceLoading=true;
 userPaused=true;
 clearTimeout(waitingTimer);
 if(activeLocalAudioUrl){try{URL.revokeObjectURL(activeLocalAudioUrl)}catch{};activeLocalAudioUrl=null;}
 a.pause();
 $('audioState').textContent='جارٍ تجهيز الصوت…';
 $('playBtn').textContent='▶';
 backgroundWanted=true;

 // Prefer any locally downloaded copy, including a cached fallback URL.
 let localUrl=null;
 try{localUrl=await getCachedAudioUrl(audioCandidates)}catch{}
 if(token!==audioLoadToken){if(localUrl)try{URL.revokeObjectURL(localUrl)}catch{};return;}
 const usingLocal=!!localUrl;
 if(usingLocal) activeLocalAudioUrl=localUrl;
 const actualUrl=localUrl||audioCandidates[0];
 a.src=actualUrl;
 a.load();
 userPaused=false;

 const start=()=>{
   if(token!==audioLoadToken || a.src!==actualUrl) return;
   if(target>0 && Number.isFinite(a.duration) && target<a.duration-1){try{a.currentTime=target}catch{}}
   if(!autoplay){sourceLoading=false;return;}
   // A locally saved file must never be judged by a remote timing request.
   const completeness=usingLocal?Promise.resolve(true):audioDurationLooksComplete(a);
   completeness.then(ok=>{
     if(token!==audioLoadToken)return;
     if(!ok && !usingLocal && candidateIndex+1<audioCandidates.length){
       $('audioState').textContent='مصدر الصوت غير مكتمل، جارٍ تجربة مصدر آخر…';
       candidateIndex++;loadAudio(currentSurah,true,target);return;
     }
     if(!ok){
       sourceLoading=false;
       $('playBtn').textContent='▶';
       $('audioState').textContent='يبدو أن ملف هذه السورة غير مكتمل من المصدر الحالي.';
       if(usingLocal && activeLocalAudioUrl===localUrl){try{URL.revokeObjectURL(localUrl)}catch{};activeLocalAudioUrl=null;}
       return;
     }
     sourceLoading=false;
     setMediaSession();
     try{if('mediaSession' in navigator)navigator.mediaSession.playbackState='playing'}catch{}
     const p=a.play();
     if(p&&typeof p.then==='function'){
       p.then(()=>{
         if(token!==audioLoadToken)return;
         retryCount=0;recovering=false;lastProgressTime=Date.now();
         $('playBtn').textContent='Ⅱ';
         $('audioState').textContent=usingLocal?'التلاوة تعمل من الجهاز بدون إنترنت':'التلاوة تعمل الآن';
       }).catch(()=>{
         if(token!==audioLoadToken)return;
         $('playBtn').textContent='▶';
         $('audioState').textContent='اضغط ▶ لتشغيل التلاوة';
       });
     }
   });
 };
 a.addEventListener('canplay',start,{once:true});
 a.addEventListener('error',()=>{
   if(token!==audioLoadToken)return;
   sourceLoading=false;
   if(usingLocal && activeLocalAudioUrl===localUrl){try{URL.revokeObjectURL(localUrl)}catch{};activeLocalAudioUrl=null;}
   if(!usingLocal && candidateIndex+1<audioCandidates.length){candidateIndex++;loadAudio(currentSurah,true,target);return;}
   $('playBtn').textContent='▶';
   $('audioState').textContent='تعذر تشغيل السورة. إذا كانت غير محفوظة، اتصل بالإنترنت وأعد تنزيلها.';
 },{once:true});
 if(a.readyState>=3) queueMicrotask(start);
}
async function playSurah(n,resumeAt=0){
 userPaused=false;backgroundWanted=true;
 currentSurah=n;currentAyahIndex=0;timings=[];currentTranslation=null;translationLoadToken++;$('modal').classList.remove('hidden');$('player').classList.remove('hidden');$('modal').setAttribute('aria-hidden','false');$('ayahPanel').classList.add('hidden');$('ayahs').innerHTML='';if($('ayahTranslation')){$('ayahTranslation').classList.add('hidden');$('ayahTranslation').innerHTML='';}$('nowSurah').textContent=`${n}. ${surahName(n)}`;$('nowReciter').textContent=`${localizedReciterName(selected)} — ${localizedMoshaf(selected.moshaf)}`;
 localStorage.setItem('quran_last',JSON.stringify({key:selected.key,surah:n,position:Number(resumeAt)||0}));
 loadAudio(n,true,resumeAt);
 try{
  ayahs=await fetchText(n);renderAyahs();loadCurrentTranslation();
 }catch(e){
  ayahs=[];
  $('ayahPanel').classList.remove('hidden');
  $('ayahTitle').textContent=`${n}. ${surahName(n)} — ${T('نص الآيات')}`;
  $('ayahs').innerHTML='<span class="player-ayah-error">تعذر تحميل النص مؤقتًا. سيُعاد المحاولة تلقائيًا.</span>';
  setTimeout(async()=>{try{ayahs=await fetchText(n);currentAyahIndex=0;renderAyahs();loadCurrentTranslation()}catch{}},2500);
 }
 timings=await fetchTiming();
}
function move(d){let n=currentSurah+d;if(n<1)n=114;if(n>114)n=1;userPaused=false;backgroundWanted=true;playSurah(n)}
function nextSurahNumber(){return currentSurah>=114?1:currentSurah+1}
async function preloadNextSurah(){
 const settings=getSettings();
 if(!settings.autoNext || !selected || !backgroundWanted || userPaused) return;
 const n=nextSurahNumber();
 if(nextPreloadSurah===n && nextPreloadAudio) return;
 try{
   if(nextPreloadAudio){nextPreloadAudio.pause();nextPreloadAudio.removeAttribute('src');nextPreloadAudio.load();}
   nextPreloadAudio=null;nextPreloadSurah=0;
   const local=await getCachedAudioUrl(urlsFor(selected,n));
   const pa=new Audio();
   pa.preload='auto';
   if(local) pa.src=local; else pa.src=urlsFor(selected,n)[0];
   pa.load();
   nextPreloadAudio=pa;
   nextPreloadSurah=n;
 }catch{}
}
function armBackgroundAdvance(){
 const a=$('audio');
 const settings=getSettings();
 if(!settings.autoNext || userPaused || !backgroundWanted || !selected || !Number.isFinite(a.duration) || a.duration<=0) return;
 const remaining=a.duration-a.currentTime;
 if(remaining<=NEXT_ARM_SECONDS && !nextAdvanceArmed){
   nextAdvanceArmed=true;
   const next=nextSurahNumber();
   const advance=()=>{
     if(!nextAdvanceArmed || userPaused || !backgroundWanted) return;
     nextAdvanceArmed=false;
     clearTimeout(nextAdvanceTimer);
     playSurah(next,0);
   };
   // Prefer the normal ended event; this fallback handles devices that delay
   // the ended callback while the screen is locked/backgrounded.
   nextAdvanceTimer=setTimeout(()=>{
     if(!$('audio').ended && $('audio').duration>0 && $('audio').currentTime >= $('audio').duration-0.35) advance();
   },Math.max(0,remaining*1000+250));
 }
}
function setMediaSession(){
 if(!('mediaSession' in navigator))return;
 const title=`${currentSurah}. ${surahName(currentSurah)}`;
 try{navigator.mediaSession.metadata=new MediaMetadata({title,artist:localizedReciterName(selected),album:T('القرآن الكريم')+' — '+T('استماع صوتي')});}catch{}
}
function mediaAction(action){
 const a=$('audio');
 try{
  if(action==='play'){userPaused=false;backgroundWanted=true;a.play().catch(()=>{});}
  else if(action==='pause'){userPaused=true;backgroundWanted=false;a.pause();}
  else if(action==='nexttrack'){userPaused=false;backgroundWanted=true;move(1);}
  else if(action==='previoustrack'){userPaused=false;backgroundWanted=true;move(-1);}
  else if(action==='seekbackward')a.currentTime=Math.max(0,a.currentTime-10);
  else if(action==='seekforward')a.currentTime=Math.min(a.duration||Infinity,a.currentTime+10);
 }catch{}
}
if('mediaSession' in navigator){
 try{navigator.mediaSession.playbackState='none'}catch{}
 ['play','pause','nexttrack','previoustrack','seekbackward','seekforward'].forEach(action=>{try{navigator.mediaSession.setActionHandler(action,()=>mediaAction(action));}catch{}})
}
function fmt(v){if(!Number.isFinite(v))return'0:00';const m=Math.floor(v/60),s=Math.floor(v%60);return`${m}:${String(s).padStart(2,'0')}`}
let retryTimer=null,retryCount=0,lastProgressTime=Date.now(),recovering=false,recoveryMode='',sourceLoading=false;
const MAX_RETRIES=3;
let lastSavedPositionAt=0;
function savePosition(force=false){
 const a=$('audio');
 if(!selected||!Number.isFinite(a.currentTime))return;
 const now=Date.now();
 if(!force && now-lastSavedPositionAt<5000)return;
 lastSavedPositionAt=now;
 try{
   localStorage.setItem('quran_last',JSON.stringify({
     key:selected.key,
     surah:currentSurah,
     position:a.currentTime,
     reciter:{key:selected.key,id:selected.id,moshafId:selected.moshafId,name_ar:selected.name_ar,name_en:selected.name_en,moshaf:selected.moshaf,server_url:selected.server_url}
   }))
 }catch{}
}

async function restoreLastPlayback(){
 try{
   const raw=localStorage.getItem('quran_last');
   if(!raw)return;
   const last=JSON.parse(raw);
   const n=Math.max(1,Math.min(114,Number(last?.surah)||0));
   if(!n)return;
   let rec=reciters.find(r=>r.key===last.key);
   if(!rec && last.reciter && last.reciter.key){
     rec=last.reciter;
     reciters=[rec,...reciters.filter(r=>r.key!==rec.key)];
   }
   if(!rec)return;
   selected=rec;
   currentSurah=n;
   currentAyahIndex=0;
   renderReciters();
   $('modalTitle').textContent=localizedReciterName(selected);
   $('modalSubtitle').textContent=`${localizedReciterName(selected)} — ${localizedMoshaf(selected.moshaf)}`;
   $('surahSearch').value='';
   renderSurahs();
   syncDownloadAllButton();
   $('modal').classList.remove('hidden');
   $('player').classList.remove('hidden');
   $('nowSurah').textContent=`${n}. ${surahName(n)}`;
   $('nowReciter').textContent=`${localizedReciterName(selected)} — ${localizedMoshaf(selected.moshaf)}`;
   const pos=Math.max(0,Number(last.position)||0);
   $('audioState').textContent='جاري استئناف آخر تلاوة…';
   await playSurah(n,pos);
   setTimeout(()=>{
     const a=$('audio');
     if(a.paused && !userPaused){$('audioState').textContent='اضغط ▶ لاستئناف التلاوة من آخر موضع.';}
   },1800);
 }catch(e){ console.warn('restore last playback failed',e); }
}

async function recoverAudio(reason='انقطاع مؤقت'){
 const a=$('audio');
 if(recovering || a.ended || !selected || userPaused)return;
 // For a downloaded/local MP3, never rebuild the source from the network.
 // Simply resume the same local media element from its current position.
 if(activeLocalAudioUrl && a.src===activeLocalAudioUrl){
   recovering=true;
   const pos=Math.max(0,Number(a.currentTime)||0);
   $('audioState').textContent='جاري استئناف التلاوة المحفوظة…';
   try{
     await a.play();
     recovering=false;retryCount=0;lastProgressTime=Date.now();
     $('playBtn').textContent='Ⅱ';$('audioState').textContent='التلاوة تعمل من الجهاز بدون إنترنت';
     return;
   }catch{}
   try{
     a.currentTime=pos;a.load();
     await a.play();
     recovering=false;retryCount=0;lastProgressTime=Date.now();
     $('playBtn').textContent='Ⅱ';$('audioState').textContent='التلاوة تعمل من الجهاز بدون إنترنت';
     return;
   }catch{}
   recovering=false;
   retryCount=Math.max(0,retryCount-1);
   $('audioState').textContent='تعذر الاستئناف تلقائيًا؛ اضغط ▶ للمتابعة.';
   return;
 }
 if(retryCount>=MAX_RETRIES){
   recovering=false;$('playBtn').textContent='▶';backgroundWanted=false;
   $('audioState').textContent='توقف الاتصال. اضغط ▶ للمحاولة مرة أخرى.';return;
 }
 recovering=true;recoveryMode='resume';retryCount++;
 const pos=Math.max(0,Number(a.currentTime)||0);
 const token=++audioLoadToken;
 savePosition();
 $('audioState').textContent=`جاري استئناف التلاوة من موضعها… (${retryCount}/${MAX_RETRIES})`;
 clearTimeout(retryTimer);
 retryTimer=setTimeout(()=>{
   if(token!==audioLoadToken){recovering=false;return;}
   const url=audioCandidates[candidateIndex];
   if(!url){recovering=false;return;}
   let settled=false;
   let timeout;
   const cleanup=()=>{clearTimeout(timeout);a.removeEventListener('loadedmetadata',onMeta);a.removeEventListener('canplay',onCan);a.removeEventListener('error',onErr)};
   const finish=async()=>{
     if(settled)return;settled=true;cleanup();
     try{if(Number.isFinite(a.duration)&&pos<a.duration-0.5)a.currentTime=pos}catch{}
     try{await a.play();recovering=false;recoveryMode='';retryCount=0;lastProgressTime=Date.now();$('playBtn').textContent='Ⅱ';$('audioState').textContent='التلاوة تعمل الآن'}
     catch{recovering=false;recoveryMode='';$('playBtn').textContent='▶';$('audioState').textContent='اضغط ▶ لاستئناف التلاوة من موضعها.'}
   };
   const onMeta=()=>finish();
   const onCan=()=>finish();
   const onErr=()=>{
     if(settled)return;settled=true;cleanup();recovering=false;recoveryMode='';
     if(candidateIndex+1<audioCandidates.length){candidateIndex++;loadAudio(currentSurah,true,pos)}
     else{$('playBtn').textContent='▶';$('audioState').textContent='تعذر تحميل الصوت. اضغط ▶ للمحاولة.'}
   };
   timeout=setTimeout(onErr,15000);
   a.addEventListener('loadedmetadata',onMeta,{once:true});
   a.addEventListener('canplay',onCan,{once:true});
   a.addEventListener('error',onErr,{once:true});
   userPaused=true;a.pause();a.load();userPaused=false;
 },Math.min(5000,1000*retryCount));
}
const closePlayer=$('closePlayer');if(closePlayer)closePlayer.onclick=()=>{$('player').classList.add('hidden');};
$('downloadAllBtn').addEventListener('click',downloadAllSurahs);$('allRecitersBtn').addEventListener('click',()=>setReciterView('all'));$('favoriteRecitersBtn').addEventListener('click',()=>setReciterView('favorites'));$('search').addEventListener('input',renderReciters);$('surahSearch').addEventListener('input',renderSurahs);$('closeModal').onclick=()=>$('modal').classList.add('hidden');$('modal').addEventListener('click',e=>{if(e.target.id==='modal')$('modal').classList.add('hidden')});
$('playBtn').onclick=()=>{
 if(NATIVE_QURAN){try{window.AndroidQuran.togglePlay();setTimeout(nativePlayerSync,120)}catch{};return;}
 const a=$('audio');
 if(a.paused){
   userPaused=false; backgroundWanted=true; retryCount=0; recovering=false;
   a.play().then(()=>{
     $('playBtn').textContent='Ⅱ';
     $('audioState').textContent='التلاوة تعمل الآن';
   }).catch(()=>{
     $('playBtn').textContent='▶';
     $('audioState').textContent='اضغط ▶ مرة أخرى لبدء التلاوة.';
   });
 }else{
   userPaused=true; backgroundWanted=false;
   a.pause();
   $('playBtn').textContent='▶';
   $('audioState').textContent='متوقف مؤقتًا';
 }
};
$('prevBtn').onclick=()=>{if(NATIVE_QURAN){try{window.AndroidQuran.previous()}catch{}}else{move(-1)}};$('nextBtn').onclick=()=>{if(NATIVE_QURAN){try{window.AndroidQuran.next()}catch{}}else{move(1)}};
$('audio').addEventListener('playing',()=>{if(NATIVE_QURAN)return;setMediaSession();$('playBtn').textContent='Ⅱ';$('audioState').textContent='التلاوة تعمل الآن';recovering=false;retryCount=0;lastProgressTime=Date.now();backgroundWanted=true;clearTimeout(waitingTimer);if('mediaSession' in navigator)try{navigator.mediaSession.playbackState='playing'}catch{};updateSurahButtons()});
$('audio').addEventListener('pause',()=>{if(NATIVE_QURAN)return;
 clearTimeout(waitingTimer);
 if('mediaSession' in navigator)try{navigator.mediaSession.playbackState='paused'}catch{};
 if(!$('audio').ended&&!recovering)$('playBtn').textContent='▶';
 savePosition();updateSurahButtons();
 // If the browser/network pauses playback unexpectedly, recover it.
 if(!userPaused && !sourceLoading && backgroundWanted && !$('audio').ended && selected) setTimeout(()=>recoverAudio('توقف غير متوقع'),350);
});
$('audio').addEventListener('waiting',()=>{if(NATIVE_QURAN)return;
  lastProgressTime=Date.now();
  if(!$('audio').paused) $('audioState').textContent='جاري تحميل الصوت…';
  clearTimeout(waitingTimer);
  if(!userPaused && backgroundWanted && !recovering) waitingTimer=setTimeout(()=>{ if(!$('audio').paused && !$('audio').ended) recoverAudio('انقطاع الشبكة'); },WAIT_RECOVERY_MS);
});
$('audio').addEventListener('stalled',()=>{if(NATIVE_QURAN)return;
  lastProgressTime=Date.now();
  clearTimeout(waitingTimer);
  if(!userPaused && backgroundWanted && !recovering) waitingTimer=setTimeout(()=>{ if(!$('audio').paused && !$('audio').ended) recoverAudio('توقف الشبكة'); },WAIT_RECOVERY_MS);
});
$('audio').addEventListener('suspend',()=>{if(NATIVE_QURAN)return;
  // The browser may suspend network loading while buffering; do not restart audio.
  lastProgressTime=Date.now();
});
$('audio').addEventListener('progress',()=>{if(NATIVE_QURAN)return;lastProgressTime=Date.now()});
$('audio').addEventListener('timeupdate',()=>{if(NATIVE_QURAN)return;lastProgressTime=Date.now();setMediaSession();clearTimeout(waitingTimer);savePosition(false);$('currentTime').textContent=fmt($('audio').currentTime);$('progress').value=$('audio').duration?(100*$('audio').currentTime/$('audio').duration):0;if('mediaSession' in navigator && Number.isFinite($('audio').duration)){try{navigator.mediaSession.setPositionState({duration:$('audio').duration,playbackRate:$('audio').playbackRate,position:Math.min($('audio').currentTime,Math.max(0,$('audio').duration-0.05))})}catch{}};sync();armBackgroundAdvance();if(Number.isFinite($('audio').duration)&&$('audio').duration-$('audio').currentTime<=20)preloadNextSurah();});
$('audio').addEventListener('ended',()=>{if(NATIVE_QURAN)return;
  clearTimeout(waitingTimer);
  clearTimeout(nextAdvanceTimer);
  nextAdvanceArmed=false;
  userPaused=false;backgroundWanted=true;
  if('mediaSession' in navigator)try{navigator.mediaSession.playbackState='none'}catch{};
  // Normal path: advance immediately. The near-end fallback is also armed
  // for mobile browsers that delay the ended event while the screen is locked.
  audioLoadToken++;
  savePosition(true);
  localStorage.removeItem('quran_last');
  const settings=getSettings();
  if(settings.autoNext){const next=nextSurahNumber(); playSurah(next,0);}
  updateSurahButtons();
});
$('audio').addEventListener('error',()=>{
  if(recovering)return;
  const pos=Math.max(0,Number($('audio').currentTime)||0);
  if(candidateIndex+1<audioCandidates.length){
    candidateIndex++;
    $('audioState').textContent='نجرب مصدر الصوت الاحتياطي من نفس الموضع…';
    loadAudio(currentSurah,true,pos);
  }else{
    $('playBtn').textContent='▶';
    $('audioState').textContent='تعذر تحميل هذه التلاوة. اضغط ▶ للمحاولة.';
  }
});
$('audio').addEventListener('loadedmetadata',()=>{$('duration').textContent=fmt($('audio').duration);nextAdvanceArmed=false;clearTimeout(nextAdvanceTimer);updateSurahButtons();preloadNextSurah()});
$('progress').addEventListener('input',e=>{if(NATIVE_QURAN){try{const st=JSON.parse(window.AndroidQuran.getState()||'{}');const d=Number(st.duration)||0;window.AndroidQuran.seekTo(d*(Number(e.target.value)/100))}catch{};return;}const a=$('audio');if(a.duration)a.currentTime=a.duration*(Number(e.target.value)/100);lastProgressTime=Date.now()});
window.addEventListener('beforeunload',()=>savePosition(true));
window.addEventListener('pagehide',()=>savePosition(true));
window.addEventListener('pagehide',()=>{
 savePosition(true);
 const a=$('audio');
 if(backgroundWanted && !userPaused && a && !a.paused && !a.ended){
   try{if('mediaSession' in navigator)navigator.mediaSession.playbackState='playing'}catch{}
 }
});
window.addEventListener('freeze',()=>savePosition(true));
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='hidden'){
   savePosition(true);
   const a=$('audio');
   if(backgroundWanted && !userPaused && a && !a.paused && !a.ended){
     try{if('mediaSession' in navigator)navigator.mediaSession.playbackState='playing'}catch{}
   }
 }
 if(document.visibilityState==='visible' && backgroundWanted && !userPaused && $('audio').paused && !$('audio').ended) setTimeout(()=>{ if($('audio').paused) recoverAudio('عودة من الخلفية'); },250);
});
// منع حركة السحب من أعلى الصفحة التي يفسرها المتصفح كتحديث للصفحة (Pull-to-Refresh).
// يبقى التمرير العادي للأعلى والأسفل يعمل بشكل طبيعي.
(function preventPullToRefresh(){
  let startY=0;
  let startX=0;
  let tracking=false;
  document.addEventListener('touchstart',e=>{
    if(e.touches.length!==1)return;
    const t=e.touches[0];
    startY=t.clientY;
    startX=t.clientX;
    tracking=(window.scrollY<=0);
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(!tracking||e.touches.length!==1)return;
    const t=e.touches[0];
    const dy=t.clientY-startY;
    const dx=t.clientX-startX;
    // منع السحب الرأسي إلى الأسفل فقط عند أعلى الصفحة، مع ترك السحب الأفقي والتمرير العادي.
    if(dy>0 && Math.abs(dy)>Math.abs(dx) && window.scrollY<=0){
      e.preventDefault();
    }
  },{passive:false});
  document.addEventListener('touchend',()=>{tracking=false;},{passive:true});
  document.addEventListener('touchcancel',()=>{tracking=false;},{passive:true});
})();

applySettings();setupSettings(); applyLanguage();

loadReciters().then(()=>restoreLastPlayback()).catch(err=>{console.error('loadReciters failed',err);try{if(!reciters.length)reciters=FALLBACK_RECITERS.map(r=>({...r,key:`${r.id}-${r.moshafId}`}));renderReciters();status(T('تم عرض قائمة القرّاء الجاهزة. يمكنك الاستماع والتنزيل مباشرة.'));}catch(e){console.error('reader fallback failed',e);}});
