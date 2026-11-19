(function (global) {
  'use strict';

  var methodOptions = [
    { id: 1, nameAr: 'جامعة العلوم الإسلامية، كراتشي', nameEn: 'University of Islamic Sciences, Karachi' },
    { id: 2, nameAr: 'رابطة العالم الإسلامي', nameEn: 'Muslim World League' },
    { id: 3, nameAr: 'الجمعية الإسلامية لأمريكا الشمالية', nameEn: 'Islamic Society of North America (ISNA)' },
    { id: 4, nameAr: 'أم القرى، مكة المكرمة', nameEn: 'Umm Al-Qura University, Makkah' },
    { id: 5, nameAr: 'الهيئة المصرية العامة للمساحة', nameEn: 'Egyptian General Authority of Survey' },
    { id: 8, nameAr: 'تقويم الخليج', nameEn: 'Gulf Region' },
    { id: 12, nameAr: 'اتحاد المنظمات الإسلامية في فرنسا', nameEn: 'Union of Islamic Organizations of France' },
    { id: 13, nameAr: 'رئاسة الشؤون الدينية التركية', nameEn: 'Diyanet İşleri Başkanlığı, Turkey' }
  ];

  var prayerDefinitions = [
    { key: 'Fajr', ar: 'الفجر', en: 'Fajr' },
    { key: 'Sunrise', ar: 'الشروق', en: 'Sunrise' },
    { key: 'Dhuhr', ar: 'الظهر', en: 'Dhuhr' },
    { key: 'Asr', ar: 'العصر', en: 'Asr' },
    { key: 'Maghrib', ar: 'المغرب', en: 'Maghrib' },
    { key: 'Isha', ar: 'العشاء', en: 'Isha' }
  ];

  function dateParts(date, timeZone) {
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(date);
    var result = {};
    parts.forEach(function (part) { if (part.type !== 'literal') result[part.type] = part.value; });
    return result;
  }

  function dateKeyInZone(date, timeZone) {
    var p = dateParts(date, timeZone);
    return p.year + '-' + p.month + '-' + p.day;
  }

  function shiftedDateKey(key, offset) {
    var p = key.split('-').map(Number);
    var date = new Date(Date.UTC(p[0], p[1] - 1, p[2] + offset));
    return date.toISOString().slice(0, 10);
  }

  function apiDate(key) {
    var p = key.split('-');
    return p[2] + '-' + p[1] + '-' + p[0];
  }

  function normalizeTime(value) {
    if (typeof value !== 'string') return null;
    // AlAdhan may append a timezone in parentheses, e.g. "05:12 (EET)".
    var clean = value.replace(/\s*\([^)]*\)\s*$/, '').trim();
    var match = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!match) return null;
    var hour = Number(match[1]);
    var minute = Number(match[2]);
    if (hour > 23 || minute > 59) return null;
    return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
  }

  async function fetchDay(location, methodId, dayOffset) {
    methodId = methodId == null ? 5 : Number(methodId);
    dayOffset = dayOffset == null ? 0 : Number(dayOffset);
    if (!location || !Number.isFinite(Number(location.latitude)) || !Number.isFinite(Number(location.longitude))) {
      throw new Error('Prayer times require a location with valid latitude and longitude.');
    }
    if (!Number.isInteger(methodId)) throw new Error('Prayer calculation method ID must be an integer.');
    if (!Number.isInteger(dayOffset)) throw new Error('Day offset must be an integer.');
    var timezone = location.timezone;
    if (!timezone || typeof timezone !== 'string') throw new Error('Location must include an IANA timezone.');
    var today;
    try { today = dateKeyInZone(new Date(), timezone); }
    catch (e) { throw new Error('Invalid location timezone "' + timezone + '".'); }
    var dateKey = shiftedDateKey(today, dayOffset);
    var url = 'https://api.aladhan.com/v1/timings/' + apiDate(dateKey) +
      '?latitude=' + encodeURIComponent(Number(location.latitude)) +
      '&longitude=' + encodeURIComponent(Number(location.longitude)) +
      '&method=' + encodeURIComponent(methodId);
    var response;
    try { response = await global.fetch(url); }
    catch (e) { throw new Error('Unable to reach AlAdhan prayer-times service: ' + (e && e.message ? e.message : String(e))); }
    if (!response || !response.ok) {
      throw new Error('AlAdhan prayer-times request failed' + (response ? ' (HTTP ' + response.status + ').' : '.'));
    }
    var payload;
    try { payload = await response.json(); }
    catch (e) { throw new Error('AlAdhan returned invalid JSON for prayer times.'); }
    var data = payload && payload.data;
    if (!data || typeof data !== 'object' || !data.timings || typeof data.timings !== 'object') {
      throw new Error('AlAdhan response has an unexpected shape: prayer timings are missing.');
    }
    var prayers = prayerDefinitions.map(function (definition) {
      var time = normalizeTime(data.timings[definition.key]);
      if (!time) throw new Error('AlAdhan response is missing a valid ' + definition.en + ' time.');
      var pieces = time.split(':');
      return { key: definition.key, ar: definition.ar, en: definition.en, time: time,
        minutes: Number(pieces[0]) * 60 + Number(pieces[1]) };
    });
    var methodName = data.meta && data.meta.method &&
      (data.meta.method.name || data.meta.method.name_en || data.meta.method.nameAr);
    if (methodName && typeof methodName === 'object') methodName = methodName.name || methodName.en;
    return {
      dateKey: dateKey,
      timezone: (data.meta && data.meta.timezone) || timezone,
      methodId: methodId,
      methodName: methodName || (methodOptions.find(function (item) { return item.id === methodId; }) || {}).nameEn || ('Method ' + methodId),
      prayers: prayers
    };
  }

  // Convert a local wall-clock date/time to an absolute instant by iteratively
  // correcting the UTC guess against the supplied IANA zone (including DST).
  function asInstant(dateKey, time, timeZone) {
    if (typeof dateKey !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      throw new Error('dateKey must be in YYYY-MM-DD format.');
    }
    var normalized = normalizeTime(time);
    if (!normalized) throw new Error('time must be a valid HH:mm value.');
    if (typeof timeZone !== 'string' || !timeZone) throw new Error('An IANA timezone is required.');
    var d = dateKey.split('-').map(Number);
    var t = normalized.split(':').map(Number);
    var target = Date.UTC(d[0], d[1] - 1, d[2], t[0], t[1], 0);
    var guess = target;
    // Two corrections are sufficient for normal offsets and DST transitions.
    for (var i = 0; i < 4; i++) {
      var p = dateParts(new Date(guess), timeZone);
      var local = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour || 0), Number(p.minute || 0));
      var delta = target - local;
      if (!delta) break;
      guess += delta;
    }
    var instant = new Date(guess);
    if (!Number.isFinite(instant.getTime())) throw new Error('Could not resolve local time in timezone "' + timeZone + '".');
    return instant;
  }

  function getNextPrayer(days, now) {
    if (!Array.isArray(days)) throw new Error('getNextPrayer expects an array of day results.');
    now = now == null ? new Date() : new Date(now);
    if (!Number.isFinite(now.getTime())) throw new Error('now must be a valid date.');
    var candidates = [];
    days.forEach(function (day) {
      if (!day || !Array.isArray(day.prayers) || !day.dateKey || !day.timezone) return;
      day.prayers.forEach(function (prayer) {
        if (!prayer || ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].indexOf(prayer.key) === -1) return;
        var instant;
        try { instant = asInstant(day.dateKey, prayer.time, day.timezone); } catch (_) { return; }
        var secondsRemaining = Math.floor((instant.getTime() - now.getTime()) / 1000);
        if (secondsRemaining >= 0) candidates.push(Object.assign({}, prayer, {
          dateKey: day.dateKey, instant: instant, secondsRemaining: secondsRemaining
        }));
      });
    });
    candidates.sort(function (a, b) { return a.instant.getTime() - b.instant.getTime(); });
    return candidates[0] || null;
  }

  global.TVPrayer = {
    fetchDay: fetchDay,
    asInstant: asInstant,
    getNextPrayer: getNextPrayer,
    methodOptions: methodOptions
  };
})(window);
