# مراجع مرحلة Android TV الأصلية

## حقائق Android المؤثرة على التنفيذ

- تطبيق Android TV يحتاج نشاطاً قابلاً للإطلاق يحتوي `MAIN` و`LEANBACK_LAUNCHER`، ويجب أن يعلن ميزة `android.software.leanback` مع `required=false`، وأن يعلن أن شاشة اللمس غير مطلوبة. كما يتطلب Android TV أيقونة وبانر تلفاز. سنضيف فئة `HOME` إلى نشاط Expo نفسه كي يظهر التطبيق ضمن اختيار الشاشة الرئيسية، مع إبقاء اختيار المستخدم للنظام لا إجباره من التطبيق. [1]
- ابتداءً من Android 11، يتم تصفية نتائج الاستعلام عن التطبيقات. سنستخدم `PackageManager.queryIntentActivities` مع `<queries>` ضيقة لفئتي `LAUNCHER` و`LEANBACK_LAUNCHER`، بدلاً من `QUERY_ALL_PACKAGES`؛ الأخيرة تتطلب موافقة Google Play عند النشر. [2]
- التطبيقات التي تستهدف Android 10 أو أعلى لا يمكنها تبديل Wi‑Fi عبر `WifiManager.setWifiEnabled`; سنفتح لوحة/إعدادات Wi‑Fi النظامية بدلاً من إظهار زر تغيير مزيف. [3]
- ابتداءً من Android 13، لا تستطيع التطبيقات المستهدفة API 33 أو أعلى استدعاء `BluetoothAdapter.enable/disable` بنجاح، باستثناء تطبيقات النظام ومالكي/مديري الأجهزة. سنوفر حالة القراءة ومسارات إعدادات/طلب موافقة المستخدم فقط. [4]
- إعادة تشغيل/إطفاء الجهاز ليست صلاحية متاحة لتطبيق Android عادي: `DevicePolicyManager.reboot` مقصور على مالك الجهاز أو حامل صلاحية نظام. مؤقت الخمول في التطبيق سيخفت الشاشة/الواجهة فقط ما لم يكن الجهاز مهيأً كجهاز مُدار أو نسخة نظامية. [5]
- وحدات Expo المحلية تُنشأ تحت `modules/` وتوفر ملف Kotlin و`expo-module.config.json`؛ Expo يضمها عبر autolinking بعد prebuild. [6]
- `react-native-webview` يقبل HTML نصياً مع `baseUrl`؛ وهذا العنوان يحدد أيضاً أصل CORS. يدعم رسائل الصفحة إلى React Native عبر `window.ReactNativeWebView.postMessage`، والاتجاه العكسي عبر `WebView.postMessage`. [7]
- أصوات إشعارات Expo على Android 8+ ترتبط بقنوات الإشعار؛ صوت القناة يجب أن يكون ملفاً مجمّعاً مع التطبيق. جدولة `bestEffort` قد تتأخر مع توفير الطاقة، بينما `alarmClock`/الإذن الدقيق يخضع لقيود خاصة. [8]

## المراجع

[1]: https://developer.android.com/training/tv/get-started/create "Create and run a TV app"
[2]: https://developer.android.com/training/package-visibility "Package visibility filtering on Android"
[3]: https://developer.android.com/about/versions/10/privacy/changes "Privacy changes in Android 10"
[4]: https://developer.android.com/reference/android/bluetooth/BluetoothAdapter "BluetoothAdapter API reference"
[5]: https://developer.android.com/reference/android/app/admin/DevicePolicyManager "DevicePolicyManager API reference"
[6]: https://docs.expo.dev/modules/get-started/ "Expo Modules API: Get started"
[7]: https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md "React Native WebView reference"
[8]: https://docs.expo.dev/versions/latest/sdk/notifications/ "Expo Notifications API"

- يتيح إجراء Android Actions تعطيل قبول جميع SDK licenses عبر `accept-android-sdk-licenses: false`، وتعطيل تثبيت الحزم الافتراضي بتمرير `packages: ''`. لذلك يقتصر Workflow على الحزم المطلوبة صراحةً، ولا يشغّل `sdkmanager --licenses` الشامل. يتضمن إعداد البناء حزم SDK وNDK وCMake المستخدمة من التطبيق ومكتبات React Native. [9] [10]

[9]: https://github.com/android-actions/setup-android
[10]: https://github.com/android-actions/setup-android/blob/v3/action.yml "setup-android v3 action inputs"
