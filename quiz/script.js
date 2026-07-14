/* ============================================================
   Quiz „Jaki jest Twój wzorzec z jedzeniem?” · Dietanka
   ============================================================ */

/* ---------- KONFIGURACJA — jedyne miejsce do edycji ---------- */
const CONFIG = {
  // URL web appa Apps Script (Deploy → Web app). Instrukcja: README, krok 2.
  ENDPOINT_URL: "https://script.google.com/macros/s/AKfycbz_ZnDfDcLQBXAEcNLAMnTI72TG4s5XnIZndKFRnKjuqM55gUvf-NjhgPJlBjsOKdVrcw/exec",
  // Strona sprzedażowa programu Spokój z Jedzeniem:
  LINK_PROGRAM: "https://ankasad-gif.github.io/szj/",
  // Polityka prywatności (tymczasowa z repo; po publikacji Easy Legal podmień):
  LINK_POLITYKA: "https://app.easy.tools/policies/45331335",
  // true = komunikaty diagnostyczne w konsoli przeglądarki
  DEBUG: false
};

/* ---------- Dane quizu ---------- */
/* Persony (zgodne z batonem Fazy 1 i strategią ankiet segmentujących):
   Z = Znikający głód · W = Wieczorna pętla (zajadanie emocji)
   I = Wiem, ale nie robię · P = Przeciążona jedzeniem */

const QUESTIONS = [
  {
    text: "Który obrazek jest bardziej Twój?",
    answers: [
      { t: "„W ciągu dnia potrafię zapomnieć o jedzeniu — wieczorem nadrabiam za cały dzień.”", p: "Z" },
      { t: "„Jem regularnie, ale wieczorem otwieram szafkę bez głodu.”", p: "W" },
      { t: "„Wiem dokładnie, co powinnam — i nic z tym nie robię.”", p: "I" },
      { t: "„Samo myślenie o tym, co jeść, mnie męczy.”", p: "P" }
    ]
  },
  {
    text: "Twoja dieta zwykle kończy się…",
    answers: [
      { t: "„W środę. Jedno odstępstwo i »od poniedziałku«.”", p: "W" },
      { t: "„Zanim się zacznie — planowanie mnie przerasta.”", p: "P" },
      { t: "„Nie kończy się — ja jej nigdy nie zaczynam, choć wiem jak.”", p: "I" },
      { t: "„Sypie się, bo w biegu po prostu nie jem.”", p: "Z" }
    ]
  },
  {
    text: "Wieczór. Co się dzieje?",
    answers: [
      { t: "„Pierwszy prawdziwy posiłek dnia — i nie umiem przestać.”", p: "Z" },
      { t: "„Napięcie z całego dnia → lodówka. Automat.”", p: "W" },
      { t: "„Scrolluję przepisy i plany, których jutro nie zrobię.”", p: "I" },
      { t: "„Ulga, że nie muszę już o jedzeniu myśleć.”", p: "P" }
    ]
  },
  {
    text: "Co najbardziej by Ci ulżyło?",
    answers: [
      { t: "„Żeby ciało samo przypominało o jedzeniu.”", p: "Z" },
      { t: "„Umieć zatrzymać się PRZED, nie żałować PO.”", p: "W" },
      { t: "„Żeby ktoś ze mną ZACZĄŁ — reszta jakoś pójdzie.”", p: "I" },
      { t: "„Mniej decyzji. Prosty system zamiast main character energy jedzenia.”", p: "P" }
    ]
  },
  {
    text: "Wiesz, DLACZEGO tak masz z jedzeniem?",
    answers: [
      { t: "„Wiem aż za dobrze — z terapii, książek, obserwacji. Brakuje działania.”", p: "I" },
      { t: "„Chyba wiem, ale to nic nie zmienia.”", p: "W" },
      { t: "„Nie mam pojęcia — po prostu tak wychodzi.”", p: "Z" },
      { t: "„Nie chcę już wiedzieć więcej. Chcę, żeby było prościej.”", p: "P" }
    ]
  }
];

const RESULTS = {
  Z: {
    title: "Znikający głód",
    paragraphs: [
      "W ciągu dnia jedzenie po prostu nie istnieje — jest praca, hiperfokus, załatwianie. A wieczorem ciało upomina się o wszystko naraz, ze zdwojoną siłą. I potem ta myśl: „znowu to zrobiłam”.",
      "To nie brak szacunku do siebie. Twój sygnał głodu bywa słaby albo spóźniony — a mózg, który nie wysyła sygnału w południe, nie potrzebuje więcej dyscypliny wieczorem. Potrzebuje sygnału z zewnątrz, dopóki wewnętrzny się nie odbuduje.",
      "Na to działają <strong>kotwice jedzenia</strong> — i w programie instalujemy pierwszą razem, na żywo, zanim skończy się spotkanie."
    ]
  },
  W: {
    title: "Wieczorna pętla",
    paragraphs: [
      "Dzień ogarnięty, a wieczorem: napięcie → szafka → chwilowa ulga → wyrzuty. I tak w kółko, coraz częściej na automacie.",
      "Zajadanie emocji nie jest błędem ani słabością — to informacja, że coś w Tobie potrzebuje regulacji, a jedzenie jest jedyną strategią, jaką mózg ma pod ręką. Problem nie w tym, że działa. Problem w tym, że jest JEDYNA.",
      "W programie budujesz własne <strong>menu regulacji</strong> i <strong>3-krokowy protokół</strong> na moment „już otwieram szafkę” — sfotografowane na lodówkę, zanim się rozłączymy."
    ]
  },
  I: {
    title: "Wiem, ale nie robię",
    paragraphs: [
      "Masz wiedzę, jakiej nie ma niejedna dietetyczka. Rozumiesz swoje mechanizmy. I właśnie dlatego najbardziej boli, że nic się nie zmienia.",
      "Wiedza i działanie to dwa różne obwody w mózgu — a Twój napęd reaguje na nowość i pilność, nie na ważność. To nie lenistwo. To ściana inicjacji.",
      "Ten program jest zbudowany dokładnie na nią: <strong>niczego nie startujesz sama</strong>. Każde narzędzie uruchamiamy RAZEM, na spotkaniu — w domu już tylko kontynuujesz coś, co działa."
    ]
  },
  P: {
    title: "Przeciążona jedzeniem",
    paragraphs: [
      "Jedzenie zajmuje Ci w głowie więcej miejsca niż niejedna praca etatowa: co kupić, co ugotować, czy to „dobre”, czy „złe”. Masz dość — i to jest najzdrowsza reakcja na tym quizie.",
      "Każda decyzja jedzeniowa to wydatek z tego samego konta, z którego płacisz za wszystko inne. Im więcej decyzji, tym większe ryzyko, że nie zjesz wcale albo z automatu.",
      "W programie składasz prosty <strong>system komponentów</strong> i <strong>plan, który działa na 40% mocy</strong> — mniej decyzji, nie więcej zasad."
    ]
  }
};

/* Kolejność rozstrzygania remisów wg batonu: persona inicjacyjna (I) ma
   pierwszeństwo — to sprzedażowo najważniejszy segment programu. */
const TIE_ORDER = ["I", "W", "Z", "P"];

const STORAGE_RESULT = "szj_quiz_wynik";
const STORAGE_UTM = "szj_quiz_utm";
const SUBMIT_TIMEOUT_MS = 8000;

/* ---------- Stan ---------- */
let currentQuestion = 0;
const tally = { Z: 0, W: 0, I: 0, P: 0 };

function log(...args) {
  if (CONFIG.DEBUG) console.log("[quiz]", ...args);
}

/* ---------- UTM: łap przy wejściu, trzymaj w sessionStorage ----------
   Przeglądarka in-app Instagrama potrafi zgubić parametry przy nawigacji,
   więc zapisujemy je od razu i czytamy z sessionStorage przy wysyłce. */
function captureUtm() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: (params.get("utm_source") || "").slice(0, 100),
      medium: (params.get("utm_medium") || "").slice(0, 100),
      campaign: (params.get("utm_campaign") || "").slice(0, 100)
    };
    if (utm.source || utm.medium || utm.campaign) {
      sessionStorage.setItem(STORAGE_UTM, JSON.stringify(utm));
      log("UTM zapisane:", utm);
    }
  } catch (err) {
    log("UTM: sessionStorage niedostępny", err);
  }
}

function readUtm() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_UTM)) || { source: "", medium: "", campaign: "" };
  } catch (err) {
    return { source: "", medium: "", campaign: "" };
  }
}

/* ---------- Nawigacja między ekranami ---------- */
const screens = ["screen-start", "screen-quiz", "screen-result", "screen-thanks"];

function showScreen(id) {
  screens.forEach((s) => {
    document.getElementById(s).hidden = s !== id;
  });
  window.scrollTo(0, 0);
  log("ekran:", id);
}

/* ---------- Quiz ---------- */
function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  document.getElementById("q-current").textContent = String(currentQuestion + 1);
  document.getElementById("q-total").textContent = String(QUESTIONS.length);
  document.getElementById("q-text").textContent = q.text;

  const fill = document.getElementById("progress-fill");
  fill.style.width = ((currentQuestion + 1) / QUESTIONS.length) * 100 + "%";
  fill.parentElement.setAttribute("aria-valuenow", String(currentQuestion + 1));

  const wrap = document.getElementById("q-answers");
  wrap.innerHTML = "";
  q.answers.forEach((a) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer";
    btn.textContent = a.t;
    btn.addEventListener("click", () => pickAnswer(a.p));
    wrap.appendChild(btn);
  });
}

function pickAnswer(persona) {
  tally[persona]++;
  currentQuestion++;
  if (currentQuestion < QUESTIONS.length) {
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function computePersona() {
  let best = TIE_ORDER[0];
  TIE_ORDER.forEach((p) => {
    if (tally[p] > tally[best]) best = p;
  });
  return best;
}

function finishQuiz() {
  const persona = computePersona();
  log("wynik:", persona, tally);
  try {
    // localStorage tylko na wynik — refresh nie kasuje rezultatu
    localStorage.setItem(STORAGE_RESULT, persona);
  } catch (err) {
    log("localStorage niedostępny", err);
  }
  renderResult(persona);
}

function renderResult(persona) {
  const r = RESULTS[persona] || RESULTS.Z;
  document.getElementById("result-title").textContent = r.title;
  const wrap = document.getElementById("result-text");
  wrap.innerHTML = "";
  r.paragraphs.forEach((text) => {
    const p = document.createElement("p");
    p.innerHTML = text; // treść statyczna z tego pliku, nie od użytkownika
    wrap.appendChild(p);
  });
  showScreen("screen-result");
}

function restartQuiz() {
  try {
    localStorage.removeItem(STORAGE_RESULT);
  } catch (err) { /* nieistotne */ }
  currentQuestion = 0;
  TIE_ORDER.forEach((p) => { tally[p] = 0; });
  renderQuestion();
  showScreen("screen-quiz");
}

/* ---------- Formularz ---------- */
function validEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function setSubmitting(on) {
  const btn = document.getElementById("btn-submit");
  btn.disabled = on;
  btn.querySelector(".btn__spinner").hidden = !on;
  btn.querySelector(".btn__label").textContent = on ? "Wysyłam…" : "Wyślij mi wskazówkę";
}

function showFormError(msg) {
  const el = document.getElementById("form-error");
  el.textContent = msg;
  el.hidden = false;
}

function clearFormError() {
  const el = document.getElementById("form-error");
  el.hidden = true;
  document.getElementById("f-email").classList.remove("input--invalid");
}

async function handleSubmit(event) {
  event.preventDefault();
  clearFormError();

  const email = document.getElementById("f-email").value.trim();
  const imie = document.getElementById("f-imie").value.trim().slice(0, 100);
  const zgoda = document.getElementById("f-zgoda").checked;
  const website = document.getElementById("f-website").value; // honeypot

  if (!validEmail(email)) {
    document.getElementById("f-email").classList.add("input--invalid");
    showFormError("Sprawdź adres e-mail — wygląda na niepełny.");
    return;
  }
  if (!zgoda) {
    showFormError("Zaznacz zgodę na maile — bez niej nie możemy wysłać wskazówki.");
    return;
  }
  if (!CONFIG.ENDPOINT_URL || CONFIG.ENDPOINT_URL === "WKLEJ_URL_WEB_APPA") {
    showFormError("Formularz nie jest jeszcze podłączony do bazy (brak adresu endpointu). To krok 3 z README.");
    return;
  }

  const persona = (function () {
    try { return localStorage.getItem(STORAGE_RESULT) || computePersona(); }
    catch (err) { return computePersona(); }
  })();

  const payload = {
    imie: imie,
    email: email,
    zgoda: true,
    persona: persona,
    utm: readUtm(),
    website: website
  };

  setSubmitting(true);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

  try {
    log("wysyłam:", payload);
    const res = await fetch(CONFIG.ENDPOINT_URL, {
      method: "POST",
      // text/plain celowo: prosty request bez preflightu CORS,
      // którego Apps Script nie obsługuje
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const data = await res.json();
    log("odpowiedź:", data);
    if (data && data.status === "ok") {
      showScreen("screen-thanks");
    } else {
      showFormError("Coś nie zadziałało — spróbuj jeszcze raz.");
    }
  } catch (err) {
    log("błąd wysyłki:", err);
    showFormError("Coś nie zadziałało — spróbuj jeszcze raz.");
  } finally {
    clearTimeout(timer);
    setSubmitting(false);
  }
}

/* ---------- Start ---------- */
document.addEventListener("DOMContentLoaded", () => {
  captureUtm();

  // linki z CONFIG (program + polityka prywatności)
  const program = CONFIG.LINK_PROGRAM === "WKLEJ_LINK_DO_PROGRAMU" ? "#" : CONFIG.LINK_PROGRAM;
  const polityka = CONFIG.LINK_POLITYKA === "WKLEJ_LINK_DO_POLITYKI" ? "#" : CONFIG.LINK_POLITYKA;
  document.getElementById("link-program").href = program;
  document.getElementById("link-program-thanks").href = program;
  document.getElementById("link-polityka").href = polityka;

  document.getElementById("btn-start").addEventListener("click", () => {
    renderQuestion();
    showScreen("screen-quiz");
  });
  document.getElementById("lead-form").addEventListener("submit", handleSubmit);
  document.getElementById("btn-restart").addEventListener("click", (e) => {
    e.preventDefault();
    restartQuiz();
  });

  // wynik przeżywa odświeżenie strony (in-app browser IG lubi przeładować)
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_RESULT); } catch (err) { /* brak dostępu */ }
  if (saved && RESULTS[saved]) {
    renderResult(saved);
  } else {
    showScreen("screen-start");
  }
});
