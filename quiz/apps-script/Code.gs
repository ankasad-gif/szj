/**
 * Quiz „Jaki jest Twój wzorzec z jedzeniem?” — backend leadów.
 *
 * Wklej ten plik do edytora Apps Script PRZY ARKUSZU Google
 * (arkusz → Rozszerzenia → Apps Script). Instrukcja: README, krok 2.
 *
 * Script Properties (Ustawienia projektu → Właściwości skryptu):
 *   ML_API_KEY  — klucz API MailerLite (tylko tutaj, nigdy we frontendzie!)
 *   ML_GROUP_Z  — ID grupy MailerLite dla persony Z (Znikający głód)
 *   ML_GROUP_W  — ID grupy dla persony W (Wieczorna pętla)
 *   ML_GROUP_I  — ID grupy dla persony I (Wiem, ale nie robię)
 *   ML_GROUP_P  — ID grupy dla persony P (Przeciążona jedzeniem)
 *
 * Deployment: Deploy → New deployment → Web app →
 *   Execute as: Me · Who has access: Anyone
 */

var ALLOWED_PERSONAS = ['Z', 'W', 'I', 'P'];
var SHEET_HEADERS = [
  'timestamp', 'imie', 'email', 'persona',
  'utm_source', 'utm_medium', 'utm_campaign', 'mailerlite_status'
];
var RATE_LIMIT_MAX = 3;        // maks. zgłoszeń z jednego e-maila…
var RATE_LIMIT_WINDOW_S = 600; // …w oknie 10 minut

/* ---------- Endpoint ---------- */

function doPost(e) {
  try {
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return respond({ status: 'error', reason: 'bad_json' });
    }

    // Honeypot: bot wypełnił ukryte pole → odpowiadamy „ok” (nie uczymy
    // bota, że został wykryty), ale niczego nie zapisujemy.
    if (data.website) {
      return respond({ status: 'ok' });
    }

    // --- Walidacja serwerowa (nie ufamy frontendowi) ---
    var email = String(data.email || '').trim().toLowerCase();
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return respond({ status: 'error', reason: 'bad_email' });
    }
    if (data.zgoda !== true) {
      return respond({ status: 'error', reason: 'no_consent' });
    }
    var persona = String(data.persona || '');
    if (ALLOWED_PERSONAS.indexOf(persona) === -1) {
      return respond({ status: 'error', reason: 'bad_persona' });
    }
    var imie = String(data.imie || '').slice(0, 100);
    var utm = data.utm || {};
    var utmSource = String(utm.source || '').slice(0, 100);
    var utmMedium = String(utm.medium || '').slice(0, 100);
    var utmCampaign = String(utm.campaign || '').slice(0, 100);

    // --- Antyspam: limit zgłoszeń per e-mail ---
    if (isRateLimited(email)) {
      return respond({ status: 'error', reason: 'too_many_requests' });
    }

    // Timestamp po stronie serwera — klientowi nie ufamy także co do zegara.
    var timestamp = new Date();

    // --- MailerLite: błąd NIE wywala requestu; arkusz = źródło prawdy ---
    var mlStatus = upsertMailerLite(email, imie, persona);

    // --- Zapis do arkusza pod lockiem (równoległe requesty) ---
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(SHEET_HEADERS);
      }
      sheet.appendRow([
        timestamp, imie, email, persona,
        utmSource, utmMedium, utmCampaign, mlStatus
      ]);
    } finally {
      lock.releaseLock();
    }

    return respond({ status: 'ok' });
  } catch (err) {
    return respond({ status: 'error', reason: 'server_error' });
  }
}

/* ---------- Antyspam ---------- */

function isRateLimited(email) {
  var cache = CacheService.getScriptCache();
  var key = 'rl_' + email;
  var count = Number(cache.get(key) || 0);
  if (count >= RATE_LIMIT_MAX) {
    return true;
  }
  cache.put(key, String(count + 1), RATE_LIMIT_WINDOW_S);
  return false;
}

/* ---------- MailerLite (API „new”, connect.mailerlite.com) ---------- */

function upsertMailerLite(email, imie, persona) {
  var props = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('ML_API_KEY');
  if (!apiKey) {
    return 'pominieto: brak ML_API_KEY w Script Properties';
  }

  var groupId = props.getProperty('ML_GROUP_' + persona);
  var payload = {
    email: email,
    fields: {
      name: imie,
      persona: persona
    }
  };
  if (groupId) {
    payload.groups = [groupId];
  }

  try {
    var res = UrlFetchApp.fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + apiKey },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true // błąd ML nie może wywalić zapisu do arkusza
    });
    var code = res.getResponseCode();
    if (code === 200 || code === 201) {
      return groupId ? 'ok' : 'ok, ale brak ML_GROUP_' + persona + ' — bez grupy';
    }
    return 'blad HTTP ' + code + ': ' + res.getContentText().slice(0, 300);
  } catch (err) {
    return 'blad polaczenia: ' + String(err).slice(0, 300);
  }
}

/* ---------- Odpowiedź JSON ---------- */

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Test — uruchom w edytorze PRZED deployem ---------- */

/**
 * Uruchom tę funkcję z edytora (wybierz „testPost” na górnym pasku → Run).
 * Za pierwszym razem Google poprosi o autoryzację — zatwierdź.
 * Wynik: w logu (View → Logs) powinno być {"status":"ok"},
 * a w arkuszu nowy wiersz z e-mailem test@example.com.
 * Testowy wiersz usuń potem ręcznie z arkusza; jeśli klucz MailerLite był
 * już ustawiony, usuń też subskrybenta test@example.com z MailerLite.
 * Uwaga: po 3 uruchomieniach w ciągu 10 minut zadziała limit antyspamowy
 * i zobaczysz "too_many_requests" — to znak, że limit działa; odczekaj 10 min.
 */
function testPost() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        imie: 'Test',
        email: 'test@example.com',
        zgoda: true,
        persona: 'Z',
        utm: { source: 'test', medium: 'test', campaign: 'test' },
        website: ''
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
