# طريقة إخراج APK من المشروع

1. افتح Android Studio.
2. اختر **Open** ثم اختر مجلد `NoorMuslimQuran`.
3. انتظر انتهاء مزامنة Gradle، وثبّت Android SDK 36 عندما يطلب Android Studio ذلك.
4. من القائمة اختر **Build > Build APK(s)**.
5. ستجد ملف APK داخل `app/build/outputs/apk/debug/`.

المشروع مبني باستخدام Android Gradle Plugin 9.3.0، ويستهدف SDK 36. خدمة الصوت معلنة كـ `mediaPlayback` ومرتبطة بصلاحية `FOREGROUND_SERVICE_MEDIA_PLAYBACK` لأن هذا هو النوع المخصص لتشغيل الوسائط في الخلفية على إصدارات أندرويد الحديثة.
