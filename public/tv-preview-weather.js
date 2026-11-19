/* Open-Meteo weather helpers for the TV preview UI.
 * Open-Meteo is keyless for non-commercial access. Attribution: weather data by
 * Open-Meteo (https://open-meteo.com/); geocoding by Open-Meteo.
 */
(function () {
  'use strict';

  var GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  var FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

  function readableLanguage(language) {
    return String(language || 'en').toLowerCase().split(/[-_]/)[0];
  }

  function weatherLabel(code, language) {
    var lang = readableLanguage(language);
    var labels = {
      0: ['Clear sky', 'Cielo despejado', 'Ciel dégagé', 'Klarer Himmel'],
      1: ['Mainly clear', 'Principalmente despejado', 'Principalement dégagé', 'Überwiegend klar'],
      2: ['Partly cloudy', 'Parcialmente nublado', 'Partiellement nuageux', 'Teilweise bewölkt'],
      3: ['Overcast', 'Nublado', 'Couvert', 'Bedeckt'],
      45: ['Fog', 'Niebla', 'Brouillard', 'Nebel'],
      48: ['Depositing rime fog', 'Niebla con cencellada', 'Brouillard givrant', 'Nebel mit Raureif'],
      51: ['Light drizzle', 'Llovizna ligera', 'Bruine légère', 'Leichter Sprühregen'],
      53: ['Moderate drizzle', 'Llovizna moderada', 'Bruine modérée', 'Mäßiger Sprühregen'],
      55: ['Dense drizzle', 'Llovizna intensa', 'Bruine dense', 'Starker Sprühregen'],
      56: ['Light freezing drizzle', 'Llovizna engelante ligera', 'Bruine verglaçante légère', 'Leichter gefrierender Sprühregen'],
      57: ['Dense freezing drizzle', 'Llovizna engelante intensa', 'Bruine verglaçante dense', 'Starker gefrierender Sprühregen'],
      61: ['Slight rain', 'Lluvia ligera', 'Pluie faible', 'Leichter Regen'],
      63: ['Moderate rain', 'Lluvia moderada', 'Pluie modérée', 'Mäßiger Regen'],
      65: ['Heavy rain', 'Lluvia intensa', 'Pluie forte', 'Starker Regen'],
      66: ['Light freezing rain', 'Lluvia engelante ligera', 'Pluie verglaçante faible', 'Leichter gefrierender Regen'],
      67: ['Heavy freezing rain', 'Lluvia engelante intensa', 'Pluie verglaçante forte', 'Starker gefrierender Regen'],
      71: ['Slight snow', 'Nieve ligera', 'Faible chute de neige', 'Leichter Schneefall'],
      73: ['Moderate snow', 'Nieve moderada', 'Chute de neige modérée', 'Mäßiger Schneefall'],
      75: ['Heavy snow', 'Nieve intensa', 'Forte chute de neige', 'Starker Schneefall'],
      77: ['Snow grains', 'Granos de nieve', 'Grains de neige', 'Schneegriesel'],
      80: ['Slight rain showers', 'Chubascos ligeros', 'Averses faibles', 'Leichte Regenschauer'],
      81: ['Moderate rain showers', 'Chubascos moderados', 'Averses modérées', 'Mäßige Regenschauer'],
      82: ['Violent rain showers', 'Chubascos violentos', 'Averses violentes', 'Heftige Regenschauer'],
      85: ['Slight snow showers', 'Chubascos de nieve ligeros', 'Averses de neige faibles', 'Leichte Schneeschauer'],
      86: ['Heavy snow showers', 'Chubascos de nieve intensos', 'Fortes averses de neige', 'Starke Schneeschauer'],
      95: ['Thunderstorm', 'Tormenta', 'Orage', 'Gewitter'],
      96: ['Thunderstorm with slight hail', 'Tormenta con granizo ligero', 'Orage avec grêle légère', 'Gewitter mit leichtem Hagel'],
      99: ['Thunderstorm with heavy hail', 'Tormenta con granizo intenso', 'Orage avec forte grêle', 'Gewitter mit starkem Hagel']
    };
    var languageIndex = { en: 0, es: 1, fr: 2, de: 3 }[lang];
    var normalizedCode = Number(code);
    if (!Number.isFinite(normalizedCode)) return lang === 'ar' ? 'حالة غير معروفة' : 'Unknown conditions';
    if (lang === 'ar') {
      var arabicLabels = {
        0: 'سماء صافية', 1: 'صحو غالباً', 2: 'غائم جزئياً', 3: 'غائم كلياً',
        45: 'ضباب', 48: 'ضباب متجمد', 51: 'رذاذ خفيف', 53: 'رذاذ متوسط', 55: 'رذاذ كثيف',
        56: 'رذاذ متجمد خفيف', 57: 'رذاذ متجمد كثيف', 61: 'أمطار خفيفة', 63: 'أمطار متوسطة',
        65: 'أمطار غزيرة', 66: 'أمطار متجمدة خفيفة', 67: 'أمطار متجمدة غزيرة',
        71: 'ثلوج خفيفة', 73: 'ثلوج متوسطة', 75: 'ثلوج كثيفة', 77: 'حبيبات ثلجية',
        80: 'زخات مطر خفيفة', 81: 'زخات مطر متوسطة', 82: 'زخات مطر غزيرة',
        85: 'زخات ثلج خفيفة', 86: 'زخات ثلج غزيرة', 95: 'عاصفة رعدية',
        96: 'عاصفة رعدية مع بَرَد خفيف', 99: 'عاصفة رعدية مع بَرَد كثيف'
      };
      return arabicLabels[normalizedCode] || 'حالة غير معروفة';
    }
    var row = labels[normalizedCode];
    if (!row) return 'Unknown conditions';
    return row[languageIndex === undefined ? 0 : languageIndex];
  }

  function weatherIcon(code, isDay) {
    var numericCode = Number(code);
    var daytime = isDay !== false;
    if (numericCode === 0) return daytime ? '☀️' : '🌙';
    if (numericCode === 1 || numericCode === 2) return daytime ? '🌤️' : '☁️';
    if (numericCode === 3) return '☁️';
    if (numericCode === 45 || numericCode === 48) return '🌫️';
    if (numericCode >= 51 && numericCode <= 67) return '🌧️';
    if (numericCode >= 71 && numericCode <= 77) return '❄️';
    if (numericCode >= 80 && numericCode <= 82) return '🌧️';
    if (numericCode === 85 || numericCode === 86) return '❄️';
    if (numericCode >= 95 && numericCode <= 99) return '⛈️';
    return '🌡️';
  }

  function formatTemperature(value, unit) {
    var temperature = Number(value);
    if (!Number.isFinite(temperature)) return '—';
    var normalizedUnit = String(unit || 'celsius').toLowerCase();
    if (normalizedUnit !== 'celsius' && normalizedUnit !== 'fahrenheit') {
      throw new Error('Temperature unit must be "celsius" or "fahrenheit".');
    }
    if (normalizedUnit === 'fahrenheit') temperature = temperature * 9 / 5 + 32;
    return Math.round(temperature) + (normalizedUnit === 'fahrenheit' ? '°F' : '°C');
  }

  function fetchJson(url, operation) {
    return fetch(url).catch(function () {
      throw new Error('Unable to reach Open-Meteo while ' + operation + '. Check your network connection.');
    }).then(function (response) {
      if (!response || !response.ok) {
        throw new Error('Open-Meteo ' + operation + ' failed' + (response ? ' (HTTP ' + response.status + ').' : '.'));
      }
      return response.json().catch(function () {
        throw new Error('Open-Meteo returned invalid JSON while ' + operation + '.');
      });
    });
  }

  function searchCities(query, language) {
    var searchText = String(query == null ? '' : query).trim();
    if (!searchText) return Promise.resolve([]);
    var params = new URLSearchParams({
      name: searchText,
      count: '8',
      language: String(language || 'en'),
      format: 'json'
    });
    return fetchJson(GEOCODING_URL + '?' + params.toString(), 'searching cities').then(function (data) {
      if (!data || (data.results !== undefined && !Array.isArray(data.results))) {
        throw new Error('Open-Meteo returned an unexpected geocoding response.');
      }
      return (data.results || []).map(function (place) {
        if (!place || typeof place.name !== 'string' || !Number.isFinite(Number(place.latitude)) || !Number.isFinite(Number(place.longitude))) {
          throw new Error('Open-Meteo returned an invalid city result.');
        }
        return {
          name: place.name,
          country: place.country || '',
          latitude: Number(place.latitude),
          longitude: Number(place.longitude),
          timezone: place.timezone || '',
          admin1: place.admin1 || ''
        };
      });
    });
  }

  function getForecast(location, unit) {
    var normalizedUnit = String(unit || 'celsius').toLowerCase();
    if (normalizedUnit !== 'celsius' && normalizedUnit !== 'fahrenheit') {
      return Promise.reject(new Error('Temperature unit must be "celsius" or "fahrenheit".'));
    }
    if (!location || !Number.isFinite(Number(location.latitude)) || !Number.isFinite(Number(location.longitude))) {
      return Promise.reject(new Error('A location with valid latitude and longitude is required.'));
    }
    var params = new URLSearchParams({
      latitude: String(Number(location.latitude)),
      longitude: String(Number(location.longitude)),
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      forecast_days: '7',
      timezone: 'auto',
      temperature_unit: normalizedUnit
    });
    return fetchJson(FORECAST_URL + '?' + params.toString(), 'loading the forecast').then(function (data) {
      var current = data && data.current;
      var daily = data && data.daily;
      var requiredCurrent = ['temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'weather_code', 'wind_speed_10m', 'is_day'];
      var requiredDaily = ['time', 'weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_probability_max'];
      if (!data || typeof data.timezone !== 'string' || !current || !daily ||
          requiredCurrent.some(function (key) { return !Array.isArray(current[key]) && !Number.isFinite(Number(current[key])); }) ||
          requiredDaily.some(function (key) { return !Array.isArray(daily[key]); })) {
        throw new Error('Open-Meteo returned an incomplete or unexpected forecast response.');
      }
      var currentValues = requiredCurrent.map(function (key) { return Number(current[key]); });
      if (currentValues.some(function (value) { return !Number.isFinite(value); })) {
        throw new Error('Open-Meteo returned invalid current weather values.');
      }
      if (requiredDaily.some(function (key) { return daily[key].length < 7; })) {
        throw new Error('Open-Meteo returned fewer than 7 forecast days.');
      }
      var days = [];
      for (var i = 0; i < 7; i += 1) {
        var max = Number(daily.temperature_2m_max[i]);
        var min = Number(daily.temperature_2m_min[i]);
        var code = Number(daily.weather_code[i]);
        var precipitation = daily.precipitation_probability_max[i] == null ? null : Number(daily.precipitation_probability_max[i]);
        if (typeof daily.time[i] !== 'string' || !Number.isFinite(max) || !Number.isFinite(min) || !Number.isFinite(code) || (precipitation !== null && !Number.isFinite(precipitation))) {
          throw new Error('Open-Meteo returned invalid daily weather values.');
        }
        days.push({ date: daily.time[i], weatherCode: code, max: max, min: min, precipitationProbability: precipitation });
      }
      return {
        timezone: data.timezone,
        current: {
          temperature: currentValues[0],
          apparentTemperature: currentValues[1],
          humidity: currentValues[2],
          weatherCode: currentValues[3],
          windSpeed: currentValues[4],
          isDay: currentValues[5] === 1
        },
        daily: days
      };
    });
  }

  window.TVWeather = {
    searchCities: searchCities,
    getForecast: getForecast,
    weatherLabel: weatherLabel,
    weatherIcon: weatherIcon,
    formatTemperature: formatTemperature
  };
}());
