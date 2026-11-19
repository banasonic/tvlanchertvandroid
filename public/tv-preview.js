(function () {
  'use strict';

  const STORAGE_KEY = 'tv-launcher-preview-v3';
  const DEFAULT_LOCATION = { name: 'Quickborn', country: 'Germany', latitude: 54.01058, longitude: 9.20896, timezone: 'Europe/Berlin', admin1: 'Schleswig-Holstein' };
  const METHODS = window.TVPrayer?.methodOptions || [];
  const APPS = [
    { id: 'youtube', name: { ar: 'YouTube', en: 'YouTube' }, glyph: '▶', cls: 'app-youtube', category: 'video', url: 'https://www.youtube.com/' },
    { id: 'google-play', name: { ar: 'Google Play', en: 'Google Play' }, glyph: '▶', cls: 'app-play', category: 'tools', url: 'https://play.google.com/store' },
    { id: 'netflix', name: { ar: 'Netflix', en: 'Netflix' }, glyph: 'N', cls: 'app-netflix', category: 'video', url: 'https://www.netflix.com/' },
    { id: 'shahid', name: { ar: 'شاهد', en: 'Shahid' }, glyph: 'mbc', cls: 'app-shahid', category: 'video', url: 'https://shahid.mbc.net/' },
    { id: 'prime-video', name: { ar: 'Prime Video', en: 'Prime Video' }, glyph: 'prime', cls: 'app-prime', category: 'video', url: 'https://www.primevideo.com/' },
    { id: 'disney', name: { ar: 'Disney+', en: 'Disney+' }, glyph: 'D+', cls: 'app-disney', category: 'video', url: 'https://www.disneyplus.com/' },
    { id: 'osn', name: { ar: 'OSN+', en: 'OSN+' }, glyph: 'OSN+', cls: 'app-osn', category: 'video', url: 'https://osnplus.com/' },
    { id: 'plex', name: { ar: 'Plex', en: 'Plex' }, glyph: 'P', cls: 'app-plex', category: 'video', url: 'https://www.plex.tv/' },
    { id: 'vlc', name: { ar: 'VLC', en: 'VLC', }, glyph: '△', cls: 'app-vlc', category: 'video', url: 'https://www.videolan.org/vlc/' },
    { id: 'spotify', name: { ar: 'Spotify', en: 'Spotify' }, glyph: '●', cls: 'app-spotify', category: 'music', url: 'https://open.spotify.com/' },
    { id: 'browser', name: { ar: 'متصفح الويب', en: 'Web Browser' }, glyph: '◎', cls: 'app-browser', category: 'tools', url: 'https://www.google.com/' },
    { id: 'kodi', name: { ar: 'Kodi', en: 'Kodi' }, glyph: 'K', cls: 'app-kodi', category: 'video', url: 'https://kodi.tv/' },
  ];
  const WORDS = {
    ar: {
      home: 'الرئيسية', applications: 'التطبيقات', settings: 'إعدادات اللانشر', featured: 'التطبيقات المميزة', add: 'إضافة تطبيق', holdHint: 'اضغط مطولاً للإضافة أو الاستبدال', dock: 'تطبيقاتي', loading: 'جاري التحميل…', weather: 'الطقس', prayer: 'مواقيت الصلاة', nextPrayer: 'الصلاة القادمة', remaining: 'متبقي', forecast: 'توقعات 7 أيام', allApps: 'كل التطبيقات', appLibrary: 'مكتبة التلفاز', category: 'التصنيف', all: 'الكل', video: 'فيديو', music: 'موسيقى', tools: 'أدوات', webPreview: 'معاينة الويب · أدوات النظام توضيحية', appNote: 'هذه معاينة للواجهة. تشغيل التطبيقات المثبتة فعلياً يحتاج نسخة Android TV الأصلية.', settingsHint: 'تُحفظ الإعدادات على هذا الجهاز داخل المتصفح.', city: 'المدينة', search: 'بحث', language: 'اللغة', arabic: 'العربية', english: 'English', morning: 'تحية الصباح', evening: 'تحية المساء', startup: 'صفحة بدء التشغيل', wallpaper: 'الخلفية', original: 'التصميم المرجعي', bing: 'صورة Bing اليومية', local: 'صورة من الجهاز', solid: 'لون ثابت', chooseImage: 'اختيار صورة', refreshBing: 'تحديث صورة اليوم', bingNote: 'مصدر صورة اليوم خدمة عامة غير رسمية وقد تتوقف.', weatherUnit: 'وحدة الحرارة', celsius: 'مئوية °C', fahrenheit: 'فهرنهايت °F', method: 'طريقة الحساب', reminder: 'التذكير قبل الأذان', none: 'بدون تذكير', fiveMin: 'قبل 5 دقائق', tenMin: 'قبل 10 دقائق', sound: 'صوت التنبيه', softChime: 'نغمة هادئة', customSound: 'صوت من الجهاز', uploadSound: 'اختيار ملف صوتي', previewSound: 'تجربة الصوت', soundNote: 'في المعاينة تعمل التنبيهات ما دامت الصفحة مفتوحة وبعد السماح بالإشعارات.', location: 'الموقع الحالي', searchCity: 'ابحث عن مدينة أو دولة', appsSettings: 'إدارة الخانات', standby: 'الخمول', standbyOff: 'متوقف', threeHours: 'بعد 3 ساعات', sixHours: 'بعد 6 ساعات', standbyNote: 'يخفت العرض فقط؛ لا يستطيع المتصفح إطفاء التلفاز.', appearance: 'المظهر', personalization: 'عام', weatherSettings: 'الطقس', prayerSettings: 'الصلاة', appSettings: 'التطبيقات', standbySettings: 'الخمول', openWeather: 'فتح تفاصيل الطقس', sourceWeather: 'المصدر: Open-Meteo', sourcePrayer: 'طريقة الحساب:', selectCity: 'اختر الموقع', cityError: 'تعذر العثور على المدينة. جرّب اسماً آخر.', networkError: 'تعذر جلب البيانات حالياً. تحقق من الاتصال ثم أعد المحاولة.', openOnWeb: 'فتح الموقع في تبويب جديد', appLaunchNote: 'المعاينة لا تشغل تطبيقات Android المثبتة.', manageSlot: 'إدارة خانة التطبيق', chooseApp: 'اختر تطبيقاً لإضافته', remove: 'إزالة التطبيق', replace: 'استبدال', fixed: 'ثابت', featuredSlot: 'مميز', dockSlot: 'الشريط السفلي', appAdded: 'تم تحديث خانة التطبيق.', close: 'إغلاق', settingsUnavailable: 'لا يمكن الوصول إلى إعدادات الجهاز من صفحة الويب.', wifi: 'Wi‑Fi', bluetooth: 'Bluetooth', ram: 'الذاكرة', speedTest: 'اختبار سرعة الإنترنت', startTest: 'بدء الاختبار', speedApprox: 'قياس تقريبي من المتصفح إلى Cloudflare، وليس قياساً لمحول Wi‑Fi بالنظام.', download: 'تنزيل', upload: 'رفع', testRunning: 'جارٍ قياس السرعة…', testFailed: 'تعذر إتمام الاختبار من هذه الشبكة.', wifiState: 'حالة معاينة', connected: 'مفعّل (محاكاة)', disconnected: 'متوقف (محاكاة)', toggleSimulation: 'تبديل حالة المحاكاة', ramTitle: 'ذاكرة المتصفح', ramUnavailable: 'لا يتيح هذا المتصفح قراءة ذاكرة نظام التلفاز.', ramApprox: 'ذاكرة JavaScript التقديرية للصفحة فقط', clearPreview: 'تنظيف بيانات الاختبار', clearNote: 'هذا لا يمسح RAM الجهاز ولا بيانات التطبيقات الأخرى.', storage: 'التخزين', media: 'مشغل الوسائط', simulation: 'محاكاة للعرض فقط', idle: 'وضع الخمول', wake: 'اضغط للعودة', dimmed: 'الشاشة خافتة لتوفير الطاقة', methodUnknown: 'طريقة الحساب', noData: 'لا توجد بيانات', reminderPermission: 'فعّل إذن الإشعارات لتجربة التنبيه.', citySaved: 'تم تحديث المدينة والبيانات.', temperature: 'الحرارة', feelsLike: 'المحسوسة', humidity: 'الرطوبة', wind: 'الرياح', rainChance: 'احتمال المطر', week: 'الأيام السبعة القادمة', emptySlot: 'فارغ', pressHold: 'اضغط مطولاً', enable: 'تشغيل', disable: 'إيقاف', citySearch: 'بحث عن موقع', homePage: 'الرئيسية', appsPage: 'التطبيقات', configure: 'إعدادات', originalRestored: 'تمت استعادة الخلفية المرجعية.', permissionDenied: 'لم يسمح المتصفح بالإشعارات؛ سيبقى التذكير داخل الصفحة.', noPrayer: 'جارٍ تحميل مواقيت الصلاة…', prayerError: 'تعذر تحميل مواقيت الصلاة. أعد المحاولة.', weatherError: 'تعذر تحميل الطقس. أعد المحاولة.', updated: 'آخر تحديث الآن', locationSearch: 'اكتب المدينة أو الدولة ثم اختر نتيجة.', reminderEnabled: 'تم إعداد التذكير. اترك المعاينة مفتوحة.', customFileNotSaved: 'يُختار الملف المحلي من جديد بعد إعادة فتح الصفحة.', ramCleared: 'تم تنظيف سجل موارد المعاينة فقط.', returnHome: 'العودة إلى الرئيسية', titleNative: 'تطبيق Android TV أصلي', nativeNote: 'فتح التطبيقات والتحكم الحقيقي في الشبكة والبلوتوث والذاكرة يحتاج تكامل Android وصلاحيات النظام.', noForecast: 'لا توجد توقعات متاحة.', locationPermission: 'بحث المدينة يعمل دون صلاحية الموقع.'
    },
    en: {
      home: 'HOME', applications: 'Applications', settings: 'Launcher settings', featured: 'Featured apps', add: 'Add app', holdHint: 'Long-press to add or replace', dock: 'My apps', loading: 'Loading…', weather: 'Weather', prayer: 'Prayer times', nextPrayer: 'Next prayer', remaining: 'Remaining', forecast: '7-day forecast', allApps: 'All applications', appLibrary: 'TV library', category: 'Category', all: 'All', video: 'Video', music: 'Music', tools: 'Tools', webPreview: 'Web preview · system tools are illustrative', appNote: 'This is a UI preview. Launching installed apps requires the native Android TV build.', settingsHint: 'Settings are saved in this browser on this device.', city: 'City', search: 'Search', language: 'Language', arabic: 'Arabic', english: 'English', morning: 'Morning greeting', evening: 'Evening greeting', startup: 'Startup page', wallpaper: 'Wallpaper', original: 'Reference design', bing: 'Bing daily image', local: 'Local image', solid: 'Solid color', chooseImage: 'Choose image', refreshBing: 'Refresh today’s image', bingNote: 'The daily image uses a public, unofficial service and may be unavailable.', weatherUnit: 'Temperature unit', celsius: 'Celsius °C', fahrenheit: 'Fahrenheit °F', method: 'Calculation method', reminder: 'Reminder before adhan', none: 'No reminder', fiveMin: '5 minutes before', tenMin: '10 minutes before', sound: 'Alert sound', softChime: 'Soft chime', customSound: 'Local device audio', uploadSound: 'Choose audio file', previewSound: 'Preview sound', soundNote: 'In this preview, alerts work only while the page stays open and notifications are allowed.', location: 'Current location', searchCity: 'Search for a city or country', appsSettings: 'Manage slots', standby: 'Standby', standbyOff: 'Off', threeHours: 'After 3 hours', sixHours: 'After 6 hours', standbyNote: 'This only dims the preview; a browser cannot power off the TV.', appearance: 'Appearance', personalization: 'General', weatherSettings: 'Weather', prayerSettings: 'Prayer', appSettings: 'Apps', standbySettings: 'Standby', openWeather: 'Open weather details', sourceWeather: 'Source: Open-Meteo', sourcePrayer: 'Calculation method:', selectCity: 'Choose location', cityError: 'City not found. Try another name.', networkError: 'Could not load data. Check the connection and retry.', openOnWeb: 'Open website in a new tab', appLaunchNote: 'The preview cannot launch installed Android apps.', manageSlot: 'Manage app slot', chooseApp: 'Choose an app to add', remove: 'Remove app', replace: 'Replace', fixed: 'Fixed', featuredSlot: 'Featured', dockSlot: 'Dock', appAdded: 'App slot updated.', close: 'Close', settingsUnavailable: 'Device settings are not accessible from a web page.', wifi: 'Wi‑Fi', bluetooth: 'Bluetooth', ram: 'Memory', speedTest: 'Internet speed test', startTest: 'Start test', speedApprox: 'Approximate browser-to-Cloudflare throughput, not a system Wi‑Fi measurement.', download: 'Download', upload: 'Upload', testRunning: 'Measuring speed…', testFailed: 'The test could not run on this network.', wifiState: 'Preview state', connected: 'On (simulated)', disconnected: 'Off (simulated)', toggleSimulation: 'Toggle simulation state', ramTitle: 'Browser memory', ramUnavailable: 'This browser cannot read the TV system memory.', ramApprox: 'Approximate JavaScript memory used by this page only', clearPreview: 'Clear preview test data', clearNote: 'This does not clear device RAM or other apps’ data.', storage: 'Storage', media: 'Media player', simulation: 'Preview simulation only', idle: 'Standby preview', wake: 'Wake preview', dimmed: 'Screen dimmed to save energy', methodUnknown: 'Calculation method', noData: 'No data', reminderPermission: 'Allow notifications to test reminders.', citySaved: 'Location and data updated.', temperature: 'Temperature', feelsLike: 'Feels like', humidity: 'Humidity', wind: 'Wind', rainChance: 'Rain chance', week: 'Next 7 days', emptySlot: 'Empty', pressHold: 'Long-press', enable: 'On', disable: 'Off', citySearch: 'Location search', homePage: 'Home', appsPage: 'Applications', configure: 'Settings', originalRestored: 'Reference background restored.', permissionDenied: 'Notifications were denied; reminder will stay in-page only.', noPrayer: 'Loading prayer times…', prayerError: 'Could not load prayer times. Retry.', weatherError: 'Could not load weather. Retry.', updated: 'Updated just now', locationSearch: 'Enter a city or country and choose a result.', reminderEnabled: 'Reminder scheduled. Keep the preview open.', customFileNotSaved: 'Choose the local audio file again after reopening the page.', ramCleared: 'Preview resource timing data cleared only.', returnHome: 'Return to Home', titleNative: 'Native Android TV app', nativeNote: 'Launching apps and real Wi‑Fi, Bluetooth and memory control require Android integration and system permissions.', noForecast: 'No forecast available.', locationPermission: 'City search works without location permission.'
    }
  };

  Object.assign(WORDS.ar, {
    nativeMode: 'لانشر Android TV الأصلي · التطبيقات مثبتة على الجهاز',
    openWifiSettings: 'فتح إعدادات Wi‑Fi بالنظام',
    openBluetoothSettings: 'فتح إعدادات Bluetooth بالنظام',
    openMemorySettings: 'فتح إعدادات التطبيقات والذاكرة',
    nativeRamLabel: 'ذاكرة الجهاز المستخدمة / المتاحة',
    nativeAppsEmpty: 'لم يعثر النظام على تطبيقات قابلة للتشغيل.',
    nativeLaunchFailed: 'تعذر تشغيل هذا التطبيق؛ تحقق من تثبيته على الجهاز.',
    nativeNote: 'تبديل Wi‑Fi وBluetooth مباشرةً ومسح ذاكرة تطبيقات أخرى أو إطفاء الجهاز مقيد في Android. تفتح الأزرار إعدادات النظام المتاحة.',
    reminderEnabled: 'تمت جدولة إشعارات الصلاة محلياً في Android.',
    soundNote: 'تذكيرات Android تعمل عبر إشعارات النظام في الخلفية. نغمة الجهاز المختارة للمعاينة تُسمع عندما تبقى الواجهة مفتوحة؛ إشعار الخلفية يستخدم نغمة التنبيه المضمنة أو نغمة النظام.',
  });
  Object.assign(WORDS.en, {
    nativeMode: 'Native Android TV launcher · installed apps on this device',
    openWifiSettings: 'Open system Wi‑Fi settings',
    openBluetoothSettings: 'Open system Bluetooth settings',
    openMemorySettings: 'Open apps and memory settings',
    nativeRamLabel: 'Device memory used / available',
    nativeAppsEmpty: 'Android did not find any launchable applications.',
    nativeLaunchFailed: 'Could not launch this app. Check that it is installed on this device.',
    nativeNote: 'Android restricts directly toggling Wi‑Fi/Bluetooth, clearing other apps’ RAM, and powering off. These buttons open the available system settings.',
    reminderEnabled: 'Prayer reminders were scheduled locally through Android notifications.',
    soundNote: 'Android reminders are scheduled through system notifications in the background. A selected local audio file plays while the launcher is open; background notifications use the bundled chime or the system notification sound.',
  });

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const defaultState = {
    language: 'ar',
    morningGreeting: 'صباح الخير',
    eveningGreeting: 'مساء الخير',
    startupPage: 'home',
    wallpaperMode: 'reference',
    wallpaperColor: '#0c397f',
    wallpaperImage: '',
    bingUrl: '',
    weatherUnit: 'celsius',
    prayerMethod: 5,
    reminderMinutes: 0,
    soundMode: 'chime',
    standbyHours: 0,
    location: DEFAULT_LOCATION,
    wifiEnabled: true,
    bluetoothEnabled: true,
    featured: ['youtube', null, null],
    dock: ['google-play', null, null, null, null, null]
  };
  function readState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { ...defaultState, ...saved, location: { ...DEFAULT_LOCATION, ...(saved.location || {}) }, featured: Array.isArray(saved.featured) ? saved.featured.slice(0, 3) : [...defaultState.featured], dock: Array.isArray(saved.dock) ? saved.dock.slice(0, 6) : [...defaultState.dock] };
    } catch { return structuredCloneSafe(defaultState); }
  }
  function structuredCloneSafe(obj) { return JSON.parse(JSON.stringify(obj)); }
  let state = readState();
  state.featured[0] = 'youtube';
  state.dock[0] = 'google-play';
  while (state.featured.length < 3) state.featured.push(null);
  while (state.dock.length < 6) state.dock.push(null);

  let activePage = state.startupPage === 'apps' ? 'apps' : 'home';
  let activeSettingsTab = 'personalization';
  let pendingCities = [];
  let weatherData = null;
  let prayerDays = [];
  let modalReturnFocus = null;
  let reminderTimer = null;
  let standbyTimer = null;
  let customAudioUrl = null;
  let holdTimer = null;
  let heldTarget = null;
  let holdTriggered = false;
  let suppressSlotClick = null;
  let speedController = null;
  let nativeMode = false;
  let nativeApps = null;
  let nativeMemory = null;

  function t(key) { return (WORDS[state.language] && WORDS[state.language][key]) || WORDS.en[key] || key; }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { announce(state.language === 'ar' ? 'تعذر حفظ الإعدادات محلياً؛ قد تكون مساحة المتصفح ممتلئة.' : 'Could not save settings; browser storage may be full.'); }
  }
  function announce(message) { const live = $('#live-region'); if (live) live.textContent = message; }
  function appCatalog() { return nativeMode ? (nativeApps || []) : APPS; }
  function appById(id) { return nativeApps?.find((app) => app.id === id) || APPS.find((app) => app.id === id) || null; }
  function appName(appId) { const app = appById(appId); return app ? (typeof app.name === 'string' ? app.name : (app.name[state.language] || app.name.en)) : t('emptySlot'); }
  function nativePost(action, payload = {}) {
    if (!window.ReactNativeWebView?.postMessage) return false;
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'command', action, ...payload }));
    return true;
  }
  function launchNativeApp(appId) {
    if (!nativeMode) return false;
    return nativePost('launch-app', { appId });
  }
  function cityLabel(location = state.location) { return [location.name, location.admin1 && location.admin1 !== location.name ? location.admin1 : '', location.country].filter(Boolean).join(' · '); }
  function currentMethodName() {
    const method = METHODS.find((item) => Number(item.id) === Number(state.prayerMethod));
    return method ? (state.language === 'ar' ? method.nameAr : method.nameEn) : t('methodUnknown');
  }
  function appMarkMarkup(appId, sizeClass = '') {
    const app = appById(appId);
    if (!app) return `<span class="app-mark ${sizeClass} app-browser">+</span>`;
    if (app.iconDataUrl) return `<span class="app-mark ${app.cls || 'app-native'} ${sizeClass}" aria-hidden="true"><img class="app-native-icon" src="${escapeHtml(app.iconDataUrl)}" alt=""></span>`;
    if (app.id === 'google-play') return `<span class="app-mark ${app.cls} ${sizeClass}" aria-hidden="true"><svg viewBox="0 0 60 60"><path d="M13 7 39 30 13 53c-2 1-4 0-4-3V10c0-3 2-4 4-3Z" fill="#34a853"/><path d="m13 7 33 18-7 5L13 7Z" fill="#4285f4"/><path d="m39 30 9 5c3 2 3 4 0 6l-9 5-9-11 9-5Z" fill="#fbbc04"/><path d="m13 53 26-23 7 5L13 53Z" fill="#ea4335"/></svg></span>`;
    if (app.id === 'youtube') return `<span class="app-mark ${app.cls} ${sizeClass}" aria-hidden="true"></span>`;
    if (app.id === 'prime-video') return `<span class="app-mark ${app.cls} ${sizeClass}" aria-hidden="true"><small>prime<br>video</small><i class="prime-arc"></i></span>`;
    return `<span class="app-mark ${app.cls} ${sizeClass}" aria-hidden="true">${escapeHtml(app.glyph)}</span>`;
  }
  function slotButton(zone, index, appId) {
    const isFixed = (zone === 'featured' && index === 0) || (zone === 'dock' && index === 0);
    const name = appId ? appName(appId) : t('emptySlot');
    const title = appId ? `${name} · ${isFixed ? t('fixed') : t('pressHold')}` : `${t('add')} · ${t('pressHold')}`;
    const cls = `${zone === 'featured' ? 'feature' : 'dock-item'}${appId ? '' : ' empty'}`;
    const label = appId ? name : t('add');
    const hint = zone === 'featured' ? `<span class="feature-hint">${isFixed ? t('fixed') : t('pressHold')}</span>` : '';
    return `<button class="${cls}" data-focus data-action="slot" data-zone="${zone}" data-slot-index="${index}" data-app-id="${appId || ''}" ${isFixed ? 'data-fixed="true"' : ''} aria-label="${escapeHtml(title)}" title="${escapeHtml(title)}">${appId ? appMarkMarkup(appId) : '<span class="app-mark app-browser">+</span>'}<span class="feature-name">${escapeHtml(label)}</span>${hint}</button>`;
  }
  function renderSlots() {
    $('#featured-slots').innerHTML = state.featured.map((id, index) => slotButton('featured', index, index === 0 ? 'youtube' : id)).join('');
    $('#dock-slots').innerHTML = state.dock.map((id, index) => slotButton('dock', index, index === 0 ? 'google-play' : id)).join('');
  }
  function updateStaticCopy() {
    document.documentElement.lang = state.language;
    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
    $('#home-tab').textContent = t('home');
    $('#apps-tab').textContent = t('applications');
    $('#featured-title').textContent = t('featured');
    $('#dock-heading').textContent = t('dock');
    $('#dock-hint').textContent = t('holdHint');
    $('#prayer-kicker').textContent = t('prayer');
    $('#next-label').textContent = t('nextPrayer');
    $('#remaining-label').textContent = t('remaining');
    $('#apps-eyebrow').textContent = t('appLibrary');
    $('#apps-page-title').textContent = t('allApps');
    $('#filter-caption').textContent = t('category');
    $('#filter-caption').hidden = nativeMode;
    $('#app-filter').hidden = nativeMode;
    $('#apps-page-note').textContent = t('appNote');
    $('#system-caption').textContent = t(nativeMode ? 'nativeMode' : 'webPreview');
    $('#weather-card-meta').textContent = t('forecast');
    $('#standby-eyebrow').textContent = t('idle');
    $('#standby-text').textContent = t('dimmed');
    $('#standby-wake').textContent = t('wake');
    $('#weather-pill').setAttribute('aria-label', t('openWeather'));
    $('#prayer-card').setAttribute('aria-label', t('prayer'));
    const filter = $('#app-filter');
    [...filter.options].forEach((option) => { option.textContent = t(option.value === 'all' ? 'all' : option.value); });
    $$('[data-action="settings"]').forEach((button) => { button.title = t('settings'); button.setAttribute('aria-label', t('settings')); });
    $$('[data-action="storage"]').forEach((button) => { button.title = t('storage'); button.setAttribute('aria-label', t('storage')); });
    $$('[data-action="media"]').forEach((button) => { button.title = t('media'); button.setAttribute('aria-label', t('media')); });
    $('#bluetooth-tool').title = t('bluetooth');
    $('#wifi-tool').title = `${t('wifi')} · ${t('speedTest')}`;
  }
  function setPage(page, shouldFocus = true) {
    activePage = page === 'apps' ? 'apps' : 'home';
    $('#page-home').hidden = activePage !== 'home';
    $('#page-apps').hidden = activePage !== 'apps';
    $('#home-tab').setAttribute('aria-selected', String(activePage === 'home'));
    $('#apps-tab').setAttribute('aria-selected', String(activePage === 'apps'));
    if (activePage === 'apps') renderApps();
    if (shouldFocus) requestAnimationFrame(() => (activePage === 'apps' ? $('#apps-grid [data-focus]') : $('#featured-slots [data-focus]'))?.focus({ preventScroll: true }));
  }
  function renderApps() {
    const filter = $('#app-filter').value || 'all';
    const visibleApps = appCatalog().filter((app) => filter === 'all' || app.category === filter);
    $('#apps-grid').innerHTML = visibleApps.length
      ? visibleApps.map((app) => `<button class="app-card" data-focus data-action="app-info" data-app-id="${app.id}" aria-label="${escapeHtml(appName(app.id))}">${appMarkMarkup(app.id)}<strong>${escapeHtml(appName(app.id))}</strong></button>`).join('')
      : `<p class="apps-page-note">${escapeHtml(nativeMode ? t('nativeAppsEmpty') : t('noData'))}</p>`;
  }
  function setModal(title, eyebrow, html, initialSelector = '[data-focus]') {
    modalReturnFocus = document.activeElement;
    $('#modal-title').textContent = title;
    $('#modal-eyebrow').textContent = eyebrow || t('configure');
    $('#modal-content').innerHTML = html;
    $('#modal-overlay').hidden = false;
    requestAnimationFrame(() => $(initialSelector, $('#modal-content'))?.focus({ preventScroll: true }) || $('#modal-close')?.focus({ preventScroll: true }));
  }
  function closeModal(restore = true) {
    $('#modal-overlay').hidden = true;
    const target = modalReturnFocus && modalReturnFocus.isConnected ? modalReturnFocus : (activePage === 'apps' ? $('#apps-tab') : $('#featured-slots [data-focus]'));
    if (restore && target) requestAnimationFrame(() => target.focus({ preventScroll: true }));
  }
  function settingsTabsMarkup() {
    const tabs = [
      ['personalization', t('personalization')], ['appearance', t('appearance')], ['weather', t('weatherSettings')], ['prayer', t('prayerSettings')], ['apps', t('appSettings')], ['standby', t('standbySettings')]
    ];
    return `<div class="settings-shell"><nav class="settings-nav" aria-label="${escapeHtml(t('settings'))}">${tabs.map(([id, label]) => `<button data-focus data-action="settings-tab" data-tab="${id}" aria-selected="${activeSettingsTab === id}">${escapeHtml(label)}</button>`).join('')}</nav><div class="settings-body" id="settings-body">${settingsTabMarkup()}</div></div>`;
  }
  function settingRow(label, control, help = '') {
    return `<div class="setting-row"><div class="setting-label">${escapeHtml(label)}${help ? `<p class="setting-help">${escapeHtml(help)}</p>` : ''}</div><div class="setting-control">${control}</div></div>`;
  }
  function settingsTabMarkup() {
    if (activeSettingsTab === 'personalization') return `
      <section class="setting-card"><h3>${escapeHtml(t('language'))} · ${escapeHtml(t('startup'))}</h3>
        ${settingRow(t('language'), `<select id="setting-language" data-focus><option value="ar" ${state.language === 'ar' ? 'selected' : ''}>${t('arabic')}</option><option value="en" ${state.language === 'en' ? 'selected' : ''}>${t('english')}</option></select>`)}
        ${settingRow(t('startup'), `<select id="setting-startup" data-focus><option value="home" ${state.startupPage === 'home' ? 'selected' : ''}>${t('homePage')}</option><option value="apps" ${state.startupPage === 'apps' ? 'selected' : ''}>${t('appsPage')}</option></select>`)}
      </section>
      <section class="setting-card"><h3>${escapeHtml(t('morning'))} / ${escapeHtml(t('evening'))}</h3>
        ${settingRow(t('morning'), `<input id="setting-morning" data-focus type="text" maxlength="50" value="${escapeHtml(state.morningGreeting)}">`)}
        ${settingRow(t('evening'), `<input id="setting-evening" data-focus type="text" maxlength="50" value="${escapeHtml(state.eveningGreeting)}">`)}
        <p class="setting-help">${escapeHtml(t('settingsHint'))}</p>
      </section>`;
    if (activeSettingsTab === 'appearance') return `
      <section class="setting-card"><h3>${escapeHtml(t('wallpaper'))}</h3>
        ${settingRow(t('wallpaper'), `<select id="setting-wallpaper" data-focus><option value="reference" ${state.wallpaperMode === 'reference' ? 'selected' : ''}>${t('original')}</option><option value="bing" ${state.wallpaperMode === 'bing' ? 'selected' : ''}>${t('bing')}</option><option value="local" ${state.wallpaperMode === 'local' ? 'selected' : ''}>${t('local')}</option><option value="solid" ${state.wallpaperMode === 'solid' ? 'selected' : ''}>${t('solid')}</option></select>`)}
        ${settingRow(t('solid'), `<input id="setting-wallpaper-color" type="color" data-focus value="${escapeHtml(state.wallpaperColor)}">`)}
        <div class="settings-actions"><label class="dialog-button" for="wallpaper-file" tabindex="0" data-focus>${escapeHtml(t('chooseImage'))}</label><input id="wallpaper-file" type="file" accept="image/*" hidden><button class="dialog-button" data-focus data-action="bing-refresh">${escapeHtml(t('refreshBing'))}</button><button class="dialog-button" data-focus data-action="wallpaper-reset">${escapeHtml(t('original'))}</button></div>
        <p class="setting-help" id="wallpaper-status">${escapeHtml(state.wallpaperMode === 'bing' && state.bingUrl ? t('updated') : t('bingNote'))}</p>
      </section>`;
    if (activeSettingsTab === 'weather') return `
      <section class="setting-card"><h3>${escapeHtml(t('weather'))}</h3>
        ${settingRow(t('location'), `<strong>${escapeHtml(cityLabel())}</strong>`, t('locationPermission'))}
        <form class="city-search" data-form="city-search"><input type="search" data-focus name="city" placeholder="${escapeHtml(t('searchCity'))}" required><button class="dialog-button primary" data-focus type="submit">${escapeHtml(t('search'))}</button></form><div class="city-results" id="city-results"></div>
        ${settingRow(t('weatherUnit'), `<select id="setting-weather-unit" data-focus><option value="celsius" ${state.weatherUnit === 'celsius' ? 'selected' : ''}>${t('celsius')}</option><option value="fahrenheit" ${state.weatherUnit === 'fahrenheit' ? 'selected' : ''}>${t('fahrenheit')}</option></select>`)}
        <p class="setting-help">${escapeHtml(t('sourceWeather'))}</p>
      </section>`;
    if (activeSettingsTab === 'prayer') return `
      <section class="setting-card"><h3>${escapeHtml(t('prayer'))}</h3>
        ${settingRow(t('location'), `<strong>${escapeHtml(cityLabel())}</strong>`)}
        <form class="city-search" data-form="city-search"><input type="search" data-focus name="city" placeholder="${escapeHtml(t('searchCity'))}" required><button class="dialog-button primary" data-focus type="submit">${escapeHtml(t('search'))}</button></form><div class="city-results" id="city-results"></div>
        ${settingRow(t('method'), `<select id="setting-method" data-focus>${METHODS.map((method) => `<option value="${method.id}" ${Number(state.prayerMethod) === Number(method.id) ? 'selected' : ''}>${escapeHtml(state.language === 'ar' ? method.nameAr : method.nameEn)}</option>`).join('')}</select>`)}
        ${settingRow(t('reminder'), `<select id="setting-reminder" data-focus><option value="0" ${Number(state.reminderMinutes) === 0 ? 'selected' : ''}>${t('none')}</option><option value="5" ${Number(state.reminderMinutes) === 5 ? 'selected' : ''}>${t('fiveMin')}</option><option value="10" ${Number(state.reminderMinutes) === 10 ? 'selected' : ''}>${t('tenMin')}</option></select>`, t('soundNote'))}
        ${settingRow(t('sound'), `<select id="setting-sound" data-focus><option value="chime" ${state.soundMode === 'chime' ? 'selected' : ''}>${t('softChime')}</option><option value="custom" ${state.soundMode === 'custom' ? 'selected' : ''}>${t('customSound')}</option></select>`)}
        <div class="settings-actions"><label class="dialog-button" for="audio-file" tabindex="0" data-focus>${escapeHtml(t('uploadSound'))}</label><input id="audio-file" type="file" accept="audio/*" hidden><button class="dialog-button" data-focus data-action="preview-sound">${escapeHtml(t('previewSound'))}</button></div>
        <p class="setting-help">${escapeHtml(t('customFileNotSaved'))}</p>
      </section>`;
    if (activeSettingsTab === 'apps') return `
      <section class="setting-card"><h3>${escapeHtml(t('featured'))}</h3><p class="setting-help">YouTube ${escapeHtml(t('fixed'))}; other slots can be replaced or removed.</p>
        ${[1,2].map((index) => `<div class="feature-slot-row"><span>${escapeHtml(t('featuredSlot'))} ${index + 1}: ${escapeHtml(state.featured[index] ? appName(state.featured[index]) : t('emptySlot'))}</span><button class="setting-button" data-focus data-action="manage-slot" data-zone="featured" data-slot-index="${index}">${state.featured[index] ? t('replace') : t('add')}</button></div>`).join('')}
      </section>
      <section class="setting-card"><h3>${escapeHtml(t('dock'))}</h3><p class="setting-help">Google Play ${escapeHtml(t('fixed'))}.</p>
        ${[1,2,3,4,5].map((index) => `<div class="feature-slot-row"><span>${escapeHtml(t('dockSlot'))} ${index + 1}: ${escapeHtml(state.dock[index] ? appName(state.dock[index]) : t('emptySlot'))}</span><button class="setting-button" data-focus data-action="manage-slot" data-zone="dock" data-slot-index="${index}">${state.dock[index] ? t('replace') : t('add')}</button></div>`).join('')}
      </section>`;
    return `
      <section class="setting-card"><h3>${escapeHtml(t('standby'))}</h3>
        ${settingRow(t('standby'), `<select id="setting-standby" data-focus><option value="0" ${Number(state.standbyHours) === 0 ? 'selected' : ''}>${t('standbyOff')}</option><option value="3" ${Number(state.standbyHours) === 3 ? 'selected' : ''}>${t('threeHours')}</option><option value="6" ${Number(state.standbyHours) === 6 ? 'selected' : ''}>${t('sixHours')}</option></select>`, t('standbyNote'))}
        <p class="setting-help">${escapeHtml(t('nativeNote'))}</p>
      </section>`;
  }
  function renderSettings() {
    activeSettingsTab = 'personalization';
    setModal(t('settings'), t('configure'), settingsTabsMarkup(), '.settings-nav [data-focus]');
  }
  function refreshSettingsBody() {
    $('#settings-body').innerHTML = settingsTabMarkup();
    $$('.settings-nav button').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.tab === activeSettingsTab)));
    requestAnimationFrame(() => $('#settings-body [data-focus]')?.focus({ preventScroll: true }));
  }
  function openSlotManager(zone, index) {
    if ((zone === 'featured' && index === 0) || (zone === 'dock' && index === 0)) return;
    const selected = (zone === 'featured' ? state.featured : state.dock)[index];
    const list = appCatalog().filter((app) => !(zone === 'featured' && app.id === 'youtube') && !(zone === 'dock' && app.id === 'google-play'));
    const html = `<p>${escapeHtml(t('chooseApp'))} · ${escapeHtml(zone === 'featured' ? t('featuredSlot') : t('dockSlot'))} ${index + 1}</p><div class="app-picker-grid">${list.map((app) => `<button class="picker-app" data-focus data-action="assign-app" data-app-id="${app.id}" data-zone="${zone}" data-slot-index="${index}">${appMarkMarkup(app.id)}<span>${escapeHtml(appName(app.id))}</span></button>`).join('')}</div>${selected ? `<div class="settings-actions"><button class="dialog-button danger" data-focus data-action="remove-slot" data-zone="${zone}" data-slot-index="${index}">${escapeHtml(t('remove'))}</button></div>` : ''}`;
    setModal(t('manageSlot'), t('appSettings'), html, '.picker-app');
  }
  function showAppInfo(appId) {
    if (nativeMode && launchNativeApp(appId)) return;
    const app = appById(appId);
    if (!app) return;
    const name = appName(appId);
    if (nativeMode) {
      const html = `<div style="text-align:center"><h3>${escapeHtml(name)}</h3><p>${escapeHtml(t('nativeLaunchFailed'))}</p><div class="settings-actions" style="justify-content:center"><button class="dialog-button" data-focus data-action="close-modal">${escapeHtml(t('close'))}</button></div></div>`;
      setModal(name, t('applications'), html, '[data-focus]');
      return;
    }
    const html = `<div style="text-align:center">${appMarkMarkup(appId, 'app-info-icon')}<h3>${escapeHtml(name)}</h3><p>${escapeHtml(t('appLaunchNote'))}</p><p class="dialog-muted">${escapeHtml(t('titleNative'))}: ${escapeHtml(t('nativeNote'))}</p><div class="settings-actions" style="justify-content:center"><a class="dialog-button primary" data-focus href="${escapeHtml(app.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openOnWeb'))}</a><button class="dialog-button" data-focus data-action="close-modal">${escapeHtml(t('close'))}</button></div></div>`;
    setModal(name, t('applications'), html, 'a[data-focus]');
  }
  function showWeather() {
    const location = cityLabel();
    if (!weatherData) { setModal(t('weather'), location, `<p>${escapeHtml(t('weatherError'))}</p><button class="dialog-button" data-focus data-action="refresh-weather">${escapeHtml(t('search'))}</button>`); return; }
    const current = weatherData.current;
    const unit = state.weatherUnit;
    const daily = weatherData.daily;
    const forecast = daily.map((day, index) => {
      const date = new Date(`${day.date}T12:00:00`);
      const dayName = new Intl.DateTimeFormat(state.language === 'ar' ? 'ar' : 'en', { weekday: 'short', timeZone: weatherData.timezone }).format(date);
      const shortDate = new Intl.DateTimeFormat(state.language === 'ar' ? 'ar' : 'en', { day: 'numeric', month: 'short', timeZone: weatherData.timezone }).format(date);
      return `<article class="forecast-day"><strong>${index === 0 ? (state.language === 'ar' ? 'اليوم' : 'Today') : escapeHtml(dayName)}</strong><small>${escapeHtml(shortDate)}</small><span class="forecast-icon">${TVWeather.weatherIcon(day.weatherCode, true)}</span><span class="forecast-temp">${TVWeather.formatTemperature(day.max, unit)}<br>${TVWeather.formatTemperature(day.min, unit)}</span><small>${escapeHtml(t('rainChance'))} ${Math.round(day.precipitationProbability || 0)}%</small></article>`;
    }).join('');
    const html = `<div class="weather-current-row"><span class="big-weather-icon">${TVWeather.weatherIcon(current.weatherCode, current.isDay)}</span><div><strong>${escapeHtml(TVWeather.formatTemperature(current.temperature, unit))}</strong><span>${escapeHtml(TVWeather.weatherLabel(current.weatherCode, state.language))} · ${escapeHtml(location)}</span></div><span style="margin-inline-start:auto">${escapeHtml(t('feelsLike'))} ${escapeHtml(TVWeather.formatTemperature(current.apparentTemperature, unit))}</span></div><div class="weather-current-row" style="margin-top:.6cqw"><span>${escapeHtml(t('humidity'))}: ${Math.round(current.humidity)}%</span><span>${escapeHtml(t('wind'))}: ${Math.round(current.windSpeed)} km/h</span><span>${escapeHtml(t('sourceWeather'))}</span></div><h3 style="margin-top:1.1cqw">${escapeHtml(t('week'))}</h3><div class="forecast-grid">${forecast || `<p>${escapeHtml(t('noForecast'))}</p>`}</div><div class="settings-actions"><button class="dialog-button" data-focus data-action="settings-tab-open" data-tab="weather">${escapeHtml(t('citySearch'))}</button><button class="dialog-button" data-focus data-action="refresh-weather">${escapeHtml(t('updated'))}</button></div>`;
    setModal(t('weather'), location, html, '[data-focus]');
  }
  function showPrayer() {
    const today = prayerDays[0];
    const next = TVPrayer.getNextPrayer(prayerDays, new Date());
    const prayerList = today?.prayers?.map((prayer) => `<div class="prayer-list-item ${next?.key === prayer.key && next?.dateKey === today.dateKey ? 'active' : ''}"><strong>${escapeHtml(state.language === 'ar' ? prayer.ar : prayer.en)}</strong><time>${escapeHtml(prayer.time)}</time></div>`).join('') || `<p>${escapeHtml(t('noPrayer'))}</p>`;
    const html = `<div class="setting-card"><h3>${escapeHtml(cityLabel())}</h3><p>${escapeHtml(t('sourcePrayer'))} ${escapeHtml(currentMethodName())}</p><div class="prayer-list">${prayerList}</div><p class="setting-help">${escapeHtml(t('soundNote'))}</p></div><div class="settings-actions"><button class="dialog-button primary" data-focus data-action="settings-tab-open" data-tab="prayer">${escapeHtml(t('configure'))}</button><button class="dialog-button" data-focus data-action="refresh-prayer">${escapeHtml(t('updated'))}</button></div>`;
    setModal(t('prayer'), cityLabel(), html, '[data-focus]');
  }
  function openSystemTool(kind) {
    if (kind === 'wifi') {
      const connection = nativeMode
        ? `<p class="setting-help">${escapeHtml(t('nativeNote'))}</p><button class="dialog-button" data-focus data-action="open-wifi-settings">${escapeHtml(t('openWifiSettings'))}</button>`
        : `<p>${escapeHtml(t('simulation'))} · ${escapeHtml(t(state.wifiEnabled ? 'connected' : 'disconnected'))}</p><button class="dialog-button" data-focus data-action="toggle-wifi">${escapeHtml(t('toggleSimulation'))}</button>`;
      const html = `<section class="setting-card"><h3>${escapeHtml(t('wifi'))}</h3>${connection}</section><section class="setting-card"><h3>${escapeHtml(t('speedTest'))}</h3><p>${escapeHtml(t('speedApprox'))}</p><button class="dialog-button primary" data-focus data-action="speed-test">${escapeHtml(t('startTest'))}</button><div class="speed-result" id="speed-result"></div></section>`;
      setModal(t('wifi'), t('speedTest'), html);
    } else if (kind === 'bluetooth') {
      const controls = nativeMode
        ? `<p class="setting-help">${escapeHtml(t('nativeNote'))}</p><button class="dialog-button" data-focus data-action="open-bluetooth-settings">${escapeHtml(t('openBluetoothSettings'))}</button>`
        : `<p>${escapeHtml(t('simulation'))} · ${escapeHtml(t(state.bluetoothEnabled ? 'connected' : 'disconnected'))}</p><label class="tool-toggle"><input type="checkbox" data-focus data-setting="bluetoothEnabled" ${state.bluetoothEnabled ? 'checked' : ''}>${escapeHtml(t('toggleSimulation'))}</label>`;
      setModal(t('bluetooth'), t(nativeMode ? 'nativeMode' : 'simulation'), `<section class="setting-card"><h3>${escapeHtml(t('bluetooth'))}</h3>${controls}</section>`);
    } else if (kind === 'ram') {
      const browserMemory = performance.memory?.usedJSHeapSize;
      const deviceUsed = nativeMemory?.usedBytes;
      const display = nativeMode
        ? (deviceUsed ? `${(deviceUsed / (1024 ** 3)).toFixed(1)} GB / ${(nativeMemory.totalBytes / (1024 ** 3)).toFixed(1)} GB` : t('loading'))
        : (browserMemory ? `${(browserMemory / (1024 * 1024)).toFixed(1)} MB` : t('ramUnavailable'));
      const note = nativeMode ? t('nativeRamLabel') : (browserMemory ? t('ramApprox') : t('ramUnavailable'));
      const button = nativeMode ? 'open-memory-settings' : 'clear-preview-memory';
      const buttonLabel = nativeMode ? t('openMemorySettings') : t('clearPreview');
      const caution = nativeMode ? t('nativeNote') : t('clearNote');
      const html = `<section class="setting-card"><h3>${escapeHtml(t('ramTitle'))}</h3><p>${escapeHtml(note)}</p><strong id="device-ram-value" style="font-size:1.8cqw;color:#c5efff">${escapeHtml(display)}</strong><div class="settings-actions"><button class="dialog-button" data-focus data-action="${button}">${escapeHtml(buttonLabel)}</button></div><p class="setting-help" id="device-ram-note">${escapeHtml(caution)}</p></section>`;
      setModal(t('ram'), t(nativeMode ? 'nativeMode' : 'simulation'), html);
      if (nativeMode) nativePost('get-memory');
    } else {
      const copy = kind === 'storage' ? t('nativeNote') : t('nativeNote');
      setModal(t(kind), t('simulation'), `<section class="setting-card"><h3>${escapeHtml(t(kind))}</h3><p>${escapeHtml(copy)}</p></section>`);
    }
  }
  function renderClock() {
    const now = new Date();
    const locale = state.language === 'ar' ? 'ar' : 'en-GB';
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: state.location.timezone || undefined };
    $('#clock').textContent = new Intl.DateTimeFormat(locale, timeOptions).format(now);
    $('#date-line').textContent = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: state.location.timezone || undefined }).format(now);
    const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: state.location.timezone || undefined }).format(now));
    const greeting = hour >= 5 && hour < 17 ? state.morningGreeting : state.eveningGreeting;
    $('#greeting-text').textContent = greeting || (hour >= 5 && hour < 17 ? t('morning') : t('evening'));
    $('#greeting-date').textContent = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: state.location.timezone || undefined }).format(now);
  }
  async function refreshWeather(announceResult = false) {
    const pill = $('#weather-pill-text');
    if (!window.TVWeather) return;
    try {
      weatherData = await TVWeather.getForecast(state.location, state.weatherUnit);
      const current = weatherData.current;
      $('#weather-pill-icon').textContent = TVWeather.weatherIcon(current.weatherCode, current.isDay);
      pill.textContent = `${cityLabel()} · ${TVWeather.formatTemperature(current.temperature, state.weatherUnit)} · ${TVWeather.weatherLabel(current.weatherCode, state.language)}`;
      $('#weather-card-mark').textContent = TVWeather.weatherIcon(current.weatherCode, current.isDay);
      $('#weather-card-temp').textContent = TVWeather.formatTemperature(current.temperature, state.weatherUnit);
      $('#weather-card-desc').textContent = `${TVWeather.weatherLabel(current.weatherCode, state.language)} · ${cityLabel()}`;
      if (announceResult) announce(t('citySaved'));
    } catch (error) {
      pill.textContent = t('weatherError');
      $('#weather-card-desc').textContent = t('weatherError');
      console.warn('Weather request failed:', error);
    }
  }
  function prayerName(prayer) { return state.language === 'ar' ? prayer.ar : prayer.en; }
  function formatRemaining(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(safeSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  }
  function renderPrayerCard() {
    const today = prayerDays[0];
    if (!today) return;
    const next = TVPrayer.getNextPrayer(prayerDays, new Date());
    $('#prayer-location').textContent = cityLabel();
    $('#prayer-footer').textContent = `${t('sourcePrayer')} ${currentMethodName()}`;
    if (next) {
      $('#next-prayer-name').textContent = prayerName(next);
      $('#next-prayer-time').textContent = next.time;
      $('#remaining-time').textContent = formatRemaining(next.secondsRemaining);
    } else {
      $('#next-prayer-name').textContent = t('noData');
      $('#next-prayer-time').textContent = '--:--';
      $('#remaining-time').textContent = '--:--:--';
    }
    const nextKey = next?.dateKey === today.dateKey ? next.key : '';
    $('#prayer-times').innerHTML = today.prayers.map((prayer) => `<span class="pray-time ${prayer.key === nextKey ? 'next' : ''}"><span>${escapeHtml(state.language === 'ar' ? prayer.ar : prayer.en)}</span><time>${escapeHtml(prayer.time)}</time></span>`).join('');
  }
  async function refreshPrayer(announceResult = false) {
    if (!window.TVPrayer) return;
    $('#prayer-location').textContent = t('loading');
    try {
      const [today, tomorrow] = await Promise.all([TVPrayer.fetchDay(state.location, Number(state.prayerMethod), 0), TVPrayer.fetchDay(state.location, Number(state.prayerMethod), 1)]);
      prayerDays = [today, tomorrow];
      renderPrayerCard();
      schedulePrayerReminder();
      if (announceResult) announce(t('citySaved'));
    } catch (error) {
      $('#prayer-location').textContent = t('prayerError');
      $('#prayer-footer').textContent = error.message || t('prayerError');
      console.warn('Prayer request failed:', error);
    }
  }
  function getReminderCandidates() {
    const events = [];
    for (const day of prayerDays) {
      for (const prayer of (day?.prayers || [])) {
        if (prayer.key === 'Sunrise') continue;
        const instant = TVPrayer.asInstant(day.dateKey, prayer.time, day.timezone);
        if (instant) events.push({ ...prayer, dateKey: day.dateKey, instant });
      }
    }
    return events.sort((a, b) => a.instant - b.instant);
  }
  function schedulePrayerReminder() {
    if (reminderTimer) clearTimeout(reminderTimer);
    reminderTimer = null;
    const lead = Number(state.reminderMinutes || 0);
    const now = Date.now();
    const candidates = lead && prayerDays.length
      ? getReminderCandidates().filter((event) => event.instant.getTime() - lead * 60_000 > now + 1000)
      : [];
    if (nativeMode) {
      nativePost('schedule-prayers', {
        soundMode: state.soundMode,
        events: candidates.map((event) => ({
          triggerAt: event.instant.getTime() - lead * 60_000,
          title: `${t('prayer')} · ${prayerName(event)}`,
          body: `${state.language === 'ar' ? `قبل الأذان بـ${lead} دقائق` : `${lead} minutes before Adhan`} · ${event.time}`,
        })),
      });
    }
    const candidate = candidates[0];
    if (!candidate) return;
    const fireAt = candidate.instant.getTime() - lead * 60_000;
    reminderTimer = setTimeout(() => {
      const label = `${prayerName(candidate)} · ${candidate.time}`;
      try { if ('Notification' in window && Notification.permission === 'granted') new Notification(t('prayer'), { body: label }); } catch {}
      playReminderSound();
      setTimeout(() => refreshPrayer(), 40_000);
    }, Math.min(fireAt - now, 2_147_000_000));
  }
  let audioContext = null;
  let audioUnlocked = false;
  async function playReminderSound() {
    if (state.soundMode === 'custom' && customAudioUrl) {
      try { const audio = new Audio(customAudioUrl); audio.volume = .52; await audio.play(); } catch (error) { console.warn('Custom reminder audio could not play:', error); }
      return;
    }
    if (!audioUnlocked) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') await audioContext.resume();
      [660, 880].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, audioContext.currentTime + index * .24);
        gain.gain.exponentialRampToValueAtTime(.045, audioContext.currentTime + index * .24 + .04);
        gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + index * .24 + .6);
        oscillator.connect(gain); gain.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime + index * .24); oscillator.stop(audioContext.currentTime + index * .24 + .65);
      });
    } catch (error) { console.warn('Preview chime unavailable:', error); }
  }
  async function previewSound() {
    audioUnlocked = true;
    if (state.soundMode === 'custom' && !customAudioUrl) { announce(t('customFileNotSaved')); return; }
    await playReminderSound();
  }
  async function searchCity(query) {
    const results = $('#city-results');
    if (!results) return;
    results.innerHTML = `<p>${escapeHtml(t('loading'))}</p>`;
    try {
      pendingCities = await TVWeather.searchCities(query, state.language === 'ar' ? 'ar' : 'en');
      if (!pendingCities.length) { results.innerHTML = `<p>${escapeHtml(t('cityError'))}</p>`; return; }
      results.innerHTML = pendingCities.map((city, index) => `<button class="city-result" data-focus data-action="choose-city" data-city-index="${index}">${escapeHtml([city.name, city.admin1, city.country].filter(Boolean).join(' · '))}</button>`).join('');
      requestAnimationFrame(() => $('#city-results [data-focus]')?.focus({ preventScroll: true }));
    } catch (error) {
      results.innerHTML = `<p>${escapeHtml(t('networkError'))}</p>`;
      console.warn('City search failed:', error);
    }
  }
  async function setLocation(city) {
    state.location = { name: city.name, country: city.country, latitude: city.latitude, longitude: city.longitude, timezone: city.timezone || 'UTC', admin1: city.admin1 || '' };
    saveState();
    await Promise.all([refreshWeather(true), refreshPrayer(true)]);
    if (!$('#modal-overlay').hidden && $('#modal-title').textContent === t('settings')) refreshSettingsBody();
  }
  function applyWallpaper() {
    const screen = $('#tv-screen');
    screen.style.backgroundImage = '';
    if (state.wallpaperMode === 'solid') {
      const c = state.wallpaperColor || '#0c397f';
      screen.style.backgroundImage = `linear-gradient(135deg, ${c} 0%, #4225a2 65%, #07173d 100%)`;
    } else if (state.wallpaperMode === 'local' && state.wallpaperImage) {
      screen.style.backgroundImage = `linear-gradient(180deg,rgba(3,27,74,.26),rgba(7,18,52,.28)),url("${state.wallpaperImage}")`;
      screen.style.backgroundSize = 'cover';
      screen.style.backgroundPosition = 'center';
    } else if (state.wallpaperMode === 'bing' && state.bingUrl) {
      screen.style.backgroundImage = `linear-gradient(180deg,rgba(3,27,74,.28),rgba(7,18,52,.32)),url("${state.bingUrl}")`;
      screen.style.backgroundSize = 'cover';
      screen.style.backgroundPosition = 'center';
    }
  }
  async function loadBingWallpaper() {
    const status = $('#wallpaper-status');
    if (status) status.textContent = t('loading');
    try {
      const response = await fetch(`https://bing.biturl.top/?format=json&market=${state.language === 'ar' ? 'ar-EG' : 'en-US'}&v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      let url = data.url || data.image_url || '';
      if (url.startsWith('//')) url = `https:${url}`;
      if (url.startsWith('/')) url = `https://www.bing.com${url}`;
      if (!/^https:\/\//i.test(url)) throw new Error('Invalid wallpaper URL');
      state.bingUrl = url;
      state.wallpaperMode = 'bing';
      saveState(); applyWallpaper();
      if (status) status.textContent = data.copyright || t('updated');
    } catch (error) {
      if (status) status.textContent = t('networkError');
      console.warn('Bing daily wallpaper request failed:', error);
    }
  }
  function setWallpaperMode(mode) {
    state.wallpaperMode = mode;
    if (mode === 'reference') state.wallpaperImage = '';
    saveState(); applyWallpaper();
    if (mode === 'bing' && !state.bingUrl) loadBingWallpaper();
    if (!$('#modal-overlay').hidden && $('#modal-title').textContent === t('settings')) refreshSettingsBody();
  }
  async function handleWallpaperFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onerror = () => reject(reader.error); reader
.onload = () => resolve(String(reader.result || '')); reader.readAsDataURL(file); });
    const image = new Image();
    image.src = dataUrl;
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
    const scale = Math.min(1, 1600 / image.width, 900 / image.height);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    state.wallpaperImage = canvas.toDataURL('image/jpeg', .78);
    state.wallpaperMode = 'local';
    saveState(); applyWallpaper();
    if (!$('#modal-overlay').hidden && $('#modal-content .settings-shell')) refreshSettingsBody();
  }
  function updateToolStates() {
    $('#wifi-tool').dataset.state = state.wifiEnabled ? 'on' : 'off';
    $('#bluetooth-tool').dataset.state = state.bluetoothEnabled ? 'on' : 'off';
    $('#wifi-tool').setAttribute('aria-label', `${t('wifi')} · ${t(state.wifiEnabled ? 'connected' : 'disconnected')}`);
    $('#bluetooth-tool').setAttribute('aria-label', `${t('bluetooth')} · ${t(state.bluetoothEnabled ? 'connected' : 'disconnected')}`);
  }
  function resetIdleTimer() {
    if (standbyTimer) clearTimeout(standbyTimer);
    standbyTimer = null;
    $('#standby-overlay').hidden = true;
    const hours = Number(state.standbyHours || 0);
    if (!hours) return;
    standbyTimer = setTimeout(() => {
      $('#standby-overlay').hidden = false;
      requestAnimationFrame(() => $('#standby-wake').focus({ preventScroll: true }));
    }, hours * 60 * 60 * 1000);
  }
  function wakeFromStandby() { $('#standby-overlay').hidden = true; resetIdleTimer(); }
  function openSettingsAt(tab) {
    activeSettingsTab = tab || 'personalization';
    setModal(t('settings'), t('configure'), settingsTabsMarkup(), '.settings-nav [data-focus]');
  }
  function updateSettingsAfterLanguageChange() {
    updateStaticCopy();
    renderSlots();
    renderClock();
    renderPrayerCard();
    if (!$('#modal-overlay').hidden && $('#modal-content .settings-shell')) {
      $('#modal-title').textContent = t('settings');
      $('#modal-eyebrow').textContent = t('configure');
      $('#modal-content').innerHTML = settingsTabsMarkup();
      requestAnimationFrame(() => $$('.settings-nav [data-focus]')[0]?.focus({ preventScroll: true }));
    }
    refreshWeather();
  }
  function handleClick(event) {
    const control = event.target.closest('[data-action]');
    if (!control) {
      if (event.target === $('#modal-overlay')) closeModal();
      return;
    }
    const { action } = control.dataset;
    if (action === 'page') { setPage(control.dataset.page); return; }
    if (action === 'settings') { renderSettings(); return; }
    if (action === 'storage' || action === 'media') { openSystemTool(action); return; }
    if (action === 'wifi') { openSystemTool('wifi'); return; }
    if (action === 'bluetooth') { openSystemTool('bluetooth'); return; }
    if (action === 'ram') { openSystemTool('ram'); return; }
    if (action === 'open-wifi-settings') { nativePost('open-wifi-settings'); return; }
    if (action === 'open-bluetooth-settings') { nativePost('open-bluetooth-settings'); return; }
    if (action === 'open-memory-settings') { nativePost('open-memory-settings'); return; }
    if (action === 'weather') { showWeather(); return; }
    if (action === 'prayer') { showPrayer(); return; }
    if (action === 'close-modal') { closeModal(); return; }
    if (action === 'wake') { wakeFromStandby(); return; }
    if (action === 'slot') {
      const zone = control.dataset.zone;
      const index = Number(control.dataset.slotIndex);
      const appId = control.dataset.appId;
      if (control.dataset.fixed === 'true' || appId) showAppInfo(appId);
      else openSlotManager(zone, index);
      return;
    }
    if (action === 'app-info') { showAppInfo(control.dataset.appId); return; }
    if (action === 'manage-slot') { openSlotManager(control.dataset.zone, Number(control.dataset.slotIndex)); return; }
    if (action === 'assign-app') {
      const zone = control.dataset.zone;
      const index = Number(control.dataset.slotIndex);
      const appId = control.dataset.appId;
      if ((zone === 'featured' && index > 0 && index < 3) || (zone === 'dock' && index > 0 && index < 6)) {
        state[zone][index] = appId;
        saveState(); renderSlots(); announce(t('appAdded')); closeModal();
      }
      return;
    }
    if (action === 'remove-slot') {
      const zone = control.dataset.zone;
      const index = Number(control.dataset.slotIndex);
      if ((zone === 'featured' && index > 0) || (zone === 'dock' && index > 0)) {
        state[zone][index] = null; saveState(); renderSlots(); closeModal(); announce(t('appAdded'));
      }
      return;
    }
    if (action === 'settings-tab') { activeSettingsTab = control.dataset.tab; refreshSettingsBody(); return; }
    if (action === 'settings-tab-open') { openSettingsAt(control.dataset.tab); return; }
    if (action === 'choose-city') {
      const city = pendingCities[Number(control.dataset.cityIndex)];
      if (city) setLocation(city);
      return;
    }
    if (action === 'refresh-weather') { refreshWeather(true).then(() => { if ($('#modal-content .forecast-grid')) showWeather(); }); return; }
    if (action === 'refresh-prayer') { refreshPrayer(true).then(() => { if ($('#modal-content .prayer-list')) showPrayer(); }); return; }
    if (action === 'bing-refresh') { loadBingWallpaper(); return; }
    if (action === 'wallpaper-reset') { state.wallpaperMode = 'reference'; state.wallpaperImage = ''; saveState(); applyWallpaper(); if ($('#modal-content .settings-shell')) refreshSettingsBody(); return; }
    if (action === 'preview-sound') { previewSound(); return; }
    if (action === 'toggle-wifi') { state.wifiEnabled = !state.wifiEnabled; saveState(); updateToolStates(); openSystemTool('wifi'); return; }
    if (action === 'speed-test') { runSpeedTest(); return; }
    if (action === 'clear-preview-memory') { performance.clearResourceTimings?.(); announce(t('ramCleared')); openSystemTool('ram'); return; }
  }
  function runSpeedTest() {
    const output = $('#speed-result');
    if (!output) return;
    output.textContent = t('testRunning');
    if (!window.TVSpeed) { output.textContent = t('testFailed'); return; }
    window.TVSpeed.run().then((result) => {
      output.innerHTML = `<strong>${escapeHtml(t('download'))}: ${result.downloadMbps.toFixed(1)} Mbps</strong><br><strong>${escapeHtml(t('upload'))}: ${result.uploadMbps.toFixed(1)} Mbps</strong><br><small>${escapeHtml(t('speedApprox'))}</small>`;
    }).catch((error) => {
      output.textContent = `${t('testFailed')} ${error.message || ''}`;
      console.warn('Speed test failed:', error);
    });
  }
  function handleChange(event) {
    const target = event.target;
    if (target.id === 'setting-language') {
      state.language = target.value === 'en' ? 'en' : 'ar'; saveState(); updateSettingsAfterLanguageChange(); return;
    }
    if (target.id === 'setting-startup') { state.startupPage = target.value; saveState(); return; }
    if (target.id === 'setting-wallpaper') { setWallpaperMode(target.value); return; }
    if (target.id === 'setting-wallpaper-color') { state.wallpaperColor = target.value; saveState(); if (state.wallpaperMode === 'solid') applyWallpaper(); return; }
    if (target.id === 'wallpaper-file') { handleWallpaperFile(target.files?.[0]).catch((error) => { console.warn(error); announce(t('networkError')); }); return; }
    if (target.id === 'setting-weather-unit') { state.weatherUnit = target.value; saveState(); refreshWeather(); return; }
    if (target.id === 'setting-method') { state.prayerMethod = Number(target.value); saveState(); refreshPrayer(); return; }
    if (target.id === 'setting-reminder') {
      state.reminderMinutes = Number(target.value); saveState();
      if (state.reminderMinutes && !nativeMode && 'Notification' in window && Notification.permission === 'default') Notification.requestPermission().then((permission) => { if (permission !== 'granted') announce(t('permissionDenied')); });
      if (state.reminderMinutes) { audioUnlocked = true; if (!nativeMode) announce(t('reminderEnabled')); }
      schedulePrayerReminder(); return;
    }
    if (target.id === 'setting-sound') { state.soundMode = target.value; saveState(); schedulePrayerReminder(); return; }
    if (target.id === 'audio-file') {
      const file = target.files?.[0];
      if (file && file.type.startsWith('audio/')) { if (customAudioUrl) URL.revokeObjectURL(customAudioUrl); customAudioUrl = URL.createObjectURL(file); state.soundMode = 'custom'; saveState(); schedulePrayerReminder(); announce(t('customFileNotSaved')); }
      return;
    }
    if (target.id === 'setting-standby') { state.standbyHours = Number(target.value); saveState(); resetIdleTimer(); return; }
    if (target.id === 'app-filter') { renderApps(); return; }
    if (target.dataset.setting === 'bluetoothEnabled') { state.bluetoothEnabled = Boolean(target.checked); saveState(); updateToolStates(); if ($('#modal-title').textContent === t('bluetooth')) openSystemTool('bluetooth'); return; }
  }
  function handleInput(event) {
    const target = event.target;
    if (target.id === 'setting-morning') { state.morningGreeting = target.value; saveState(); renderClock(); }
    if (target.id === 'setting-evening') { state.eveningGreeting = target.value; saveState(); renderClock(); }
  }
  function isEditable(element) { return Boolean(element?.closest('input,textarea,select,[contenteditable="true"]')); }
  function visible(element) {
    if (!element || !element.isConnected || element.disabled) return false;
    if (element.closest('[hidden]')) return false;
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
  }
  function moveFocus(direction) {
    const current = document.activeElement;
    const modalOpen = !$('#modal-overlay').hidden;
    const root = modalOpen ? $('#modal-content') : $('#tv-screen');
    const candidates = $$('[data-focus]:not([disabled])', root).filter((element) => visible(element) && element !== current);
    if (!candidates.length) return;
    if (!current || !visible(current) || !root.contains(current)) { candidates[0].focus({ preventScroll: true }); return; }
    const a = current.getBoundingClientRect();
    const ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    const vector = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[direction];
    const ranked = candidates.map((element) => {
      const r = element.getBoundingClientRect();
      const dx = r.left + r.width / 2 - ax, dy = r.top + r.height / 2 - ay;
      const primary = vector[0] ? dx * vector[0] : dy * vector[1];
      const cross = vector[0] ? Math.abs(dy) : Math.abs(dx);
      return { element, primary, score: primary + cross * 1.45 };
    }).filter((item) => item.primary > 2).sort((a, b) => a.score - b.score);
    ranked[0]?.element.focus({ preventScroll: true });
  }
  function startLongPress(element) {
    const zone = element?.dataset?.zone;
    const index = Number(element?.dataset?.slotIndex);
    if (!zone || element.dataset.fixed === 'true' || (zone === 'featured' && index === 0) || (zone === 'dock' && index === 0)) return false;
    clearTimeout(holdTimer);
    heldTarget = element; holdTriggered = false;
    holdTimer = setTimeout(() => {
      holdTriggered = true; suppressSlotClick = element;
      openSlotManager(zone, index);
    }, 680);
    return true;
  }
  function finishLongPress(clickIfShort = false) {
    if (!heldTarget) return;
    clearTimeout(holdTimer);
    const target = heldTarget;
    const wasHeld = holdTriggered;
    heldTarget = null; holdTimer = null; holdTriggered = false;
    if (wasHeld) {
      suppressSlotClick = target;
      setTimeout(() => { if (suppressSlotClick === target) suppressSlotClick = null; }, 1000);
    }
    else if (clickIfShort) target.click();
  }
  function handleKeyDown(event) {
    resetIdleTimer();
    const key = event.key;
    if (key === 'Escape' || key === 'Backspace' || key === 'BrowserBack' || key === 'GoBack') {
      if (!$('#standby-overlay').hidden) { event.preventDefault(); wakeFromStandby(); return; }
      if (!$('#modal-overlay').hidden) { event.preventDefault(); closeModal(); return; }
      if (activePage === 'apps') { event.preventDefault(); setPage('home'); return; }
      return;
    }
    if (key.startsWith('Arrow') && !isEditable(document.activeElement)) {
      const direction = key.slice(5).toLowerCase();
      if (['left', 'right', 'up', 'down'].includes(direction)) { event.preventDefault(); moveFocus(direction); }
      return;
    }
    if ((key === 'Enter' || key === ' ') && !event.repeat && !isEditable(document.activeElement)) {
      const element = document.activeElement?.closest('[data-zone]');
      if (element && startLongPress(element)) event.preventDefault();
    }
  }
  function handleKeyUp(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      if (heldTarget) { event.preventDefault(); finishLongPress(true); }
    }
  }
  function updateOrientation() { $('#orientation-gate').classList.toggle('show', window.innerHeight > window.innerWidth); }
  function scheduleDailyBingRefresh() {
    setTimeout(() => {
      if (state.wallpaperMode === 'bing') loadBingWallpaper();
      scheduleDailyBingRefresh();
    }, 24 * 60 * 60 * 1000);
  }

  window.__tvNativeBootstrap = function () {
    if (window.ReactNativeWebView?.postMessage) window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
  };
  window.__tvNativeReceive = function (message) {
    if (!message || typeof message !== 'object') return;
    if (message.type === 'native-mode') {
      nativeMode = true;
      updateStaticCopy();
      renderSlots();
      if (activePage === 'apps') renderApps();
      schedulePrayerReminder();
      return;
    }
    if (message.type === 'apps') {
      nativeApps = (Array.isArray(message.apps) ? message.apps : []).map((app) => {
        const packageName = String(app.packageName || '');
        const id = packageName === 'com.google.android.youtube.tv' || packageName === 'com.google.android.youtube'
          ? 'youtube'
          : packageName === 'com.android.vending' ? 'google-play' : `android:${packageName}`;
        const label = String(app.label || packageName || t('app'));
        return { ...app, id, name: { ar: label, en: label }, glyph: label.slice(0, 1).toUpperCase(), cls: 'app-native', category: 'tools' };
      });
      renderSlots();
      if (activePage === 'apps') renderApps();
      schedulePrayerReminder();
      return;
    }
    if (message.type === 'memory') {
      nativeMemory = message.memory || null;
      const output = $('#device-ram-value');
      if (output && nativeMemory?.totalBytes) {
        const used = (nativeMemory.usedBytes / (1024 ** 3)).toFixed(1);
        const total = (nativeMemory.totalBytes / (1024 ** 3)).toFixed(1);
        output.textContent = `${used} GB / ${total} GB`;
      }
      return;
    }
    if (message.type === 'notification-result') {
      if (message.disabled) return;
      if (message.permissionGranted && Number(message.scheduled || 0) > 0) announce(t('reminderEnabled'));
      else if (!message.permissionGranted) announce(t('permissionDenied'));
      return;
    }
    if (message.type === 'launch-error') announce(t('nativeLaunchFailed'));
  };

  document.addEventListener('click', (event) => {
    const slot = event.target.closest('[data-zone]');
    if (suppressSlotClick && slot === suppressSlotClick) {
      event.preventDefault(); event.stopPropagation(); suppressSlotClick = null; return;
    }
    handleClick(event);
  });
  document.addEventListener('pointerdown', (event) => {
    const element = event.target.closest('[data-zone]');
    if (element) startLongPress(element);
    resetIdleTimer();
  }, { passive: true });
  document.addEventListener('pointerup', () => finishLongPress(false), { passive: true });
  document.addEventListener('pointercancel', () => finishLongPress(false), { passive: true });
  document.addEventListener('pointerleave', () => finishLongPress(false), { passive: true });
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('change', handleChange);
  document.addEventListener('input', handleInput);
  document.addEventListener('submit', (event) => {
    if (event.target.matches('[data-form="city-search"]')) {
      event.preventDefault();
      const query = new FormData(event.target).get('city')?.toString().trim();
      if (query) searchCity(query);
    }
  });
  $('#app-filter').addEventListener('change', handleChange);
  $('#orientation-button').addEventListener('click', async () => {
    try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); } catch {}
    try { await window.screen.orientation?.lock?.('landscape'); $('#gate-error').textContent = ''; }
    catch { $('#gate-error').textContent = state.language === 'ar' ? 'لم يسمح المتصفح بقفل الاتجاه تلقائياً. دوّر جهازك يدوياً أو افتح الصفحة على شاشة عريضة.' : 'The browser could not lock landscape. Rotate the device or open this on a widescreen display.'; }
  });
  window.addEventListener('resize', updateOrientation);
  window.screen.orientation?.addEventListener?.('change', updateOrientation);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { refreshWeather(); refreshPrayer(); } });

  updateStaticCopy();
  renderSlots();
  renderApps();
  setPage(activePage, false);
  renderClock();
  updateToolStates();
  applyWallpaper();
  updateOrientation();
  $('#featured-slots [data-focus]')?.focus({ preventScroll: true });
  refreshWeather();
  refreshPrayer();
  setInterval(() => { renderClock(); renderPrayerCard(); }, 1000);
  setInterval(() => { refreshWeather(); refreshPrayer(); }, 30 * 60 * 1000);
  resetIdleTimer();
  scheduleDailyBingRefresh();
})();
