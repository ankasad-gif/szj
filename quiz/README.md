# Quiz „Jaki jest Twój wzorzec z jedzeniem?”

Strona z quizem, która zbiera zapisy na listę mailową. Wynik quizu (jeden z 4 wzorców)
trafia razem z e-mailem do Twojego arkusza Google **i** do MailerLite, gdzie startuje
odpowiednia sekwencja maili.

Całość uruchomisz w ~20 minut, bez programowania i bez terminala — wszystko klika się
w przeglądarce. Jedyne, czego potrzebujesz: konto Google, konto GitHub i konto MailerLite.

**Co jest czym:**

| Plik | Rola |
|---|---|
| `index.html`, `style.css`, `script.js` | strona z quizem (publikujesz na GitHub Pages) |
| `apps-script/Code.gs` | „skrzynka odbiorcza” na zgłoszenia (wklejasz do Google) |
| `assets/og.png` | obrazek podglądu przy udostępnianiu linku (1200×630 px — poproś o niego Design; bez niego wszystko działa, tylko podgląd linku jest bez obrazka) |

---

## Krok 1 · Opublikuj stronę na GitHub Pages (~5 min)

1. Wejdź na [github.com](https://github.com) i zaloguj się.
2. Kliknij zielony przycisk **New** (nowe repozytorium). Nazwa: np. `quiz`.
   Zaznacz **Public**. Kliknij **Create repository**.
3. Na stronie nowego repozytorium kliknij link **uploading an existing file**.
4. Przeciągnij do okna przeglądarki **całą zawartość tego folderu**
   (pliki `index.html`, `style.css`, `script.js`, `README.md` oraz foldery
   `apps-script` i `assets`). Kliknij zielony **Commit changes**.
5. W repozytorium wejdź w **Settings → Pages** (menu po lewej).
   W sekcji „Build and deployment”: Source = **Deploy from a branch**,
   Branch = **main**, folder = **/ (root)**. Kliknij **Save**.
6. Po 1–2 minutach u góry pojawi się adres w stylu
   `https://twojanazwa.github.io/quiz/` — to jest publiczny link do quizu.
   (Własną subdomenę, np. `quiz.twojadomena.pl`, podepniemy później — strona jest
   na to gotowa, niczego nie trzeba będzie przerabiać.)

> Quiz już działa: można go przejść i zobaczyć wynik. Formularz zapisu pokaże
> na razie komunikat, że nie jest podłączony — podłączamy go w krokach 2 i 3.

## Krok 2 · Skrzynka na zgłoszenia: arkusz Google + Apps Script (~10 min)

**2a. Arkusz**

1. Wejdź na [sheets.google.com](https://sheets.google.com) i utwórz **pusty arkusz**.
   Nazwij go np. „Quiz — leady”. Nic w nim nie wpisuj — nagłówki dopiszą się same.

**2b. Skrypt**

2. W tym arkuszu: menu **Rozszerzenia → Apps Script**. Otworzy się edytor.
3. Skasuj wszystko, co jest w oknie kodu, i wklej **całą** zawartość pliku
   `apps-script/Code.gs` z tego folderu. Kliknij ikonę dyskietki (Zapisz).

**2c. Klucze MailerLite (Script Properties)**

4. W MailerLite: **Integrations → API** → wygeneruj klucz API i skopiuj go.
5. W MailerLite utwórz 4 grupy (Subscribers → Groups), po jednej na wzorzec, np.
   „Quiz — Znikający głód”, „Quiz — Wieczorna pętla”, „Quiz — Wiem, ale nie robię”,
   „Quiz — Przeciążona jedzeniem”. Po wejściu w grupę jej **ID to długi numer w adresie
   strony** — skopiuj po kolei wszystkie cztery.
6. W MailerLite dodaj jeszcze pole subskrybenta o nazwie `persona`
   (Subscribers → Fields → Add field, typ: Text) — tam zapisze się litera wzorca.
7. Wróć do edytora Apps Script. Kliknij **ikonę zębatki (Project Settings)** po lewej,
   zjedź do **Script Properties → Add script property** i dodaj 5 pozycji:

   | Property | Value |
   |---|---|
   | `ML_API_KEY` | klucz API z punktu 4 |
   | `ML_GROUP_Z` | ID grupy „Znikający głód” |
   | `ML_GROUP_W` | ID grupy „Wieczorna pętla” |
   | `ML_GROUP_I` | ID grupy „Wiem, ale nie robię” |
   | `ML_GROUP_P` | ID grupy „Przeciążona jedzeniem” |

   Kliknij **Save script properties**.

**2d. Test**

8. Wróć do edytora (ikona `< >` po lewej). Na górnym pasku, obok przycisków
   Run/Debug, rozwiń listę funkcji i wybierz **testPost**. Kliknij **Run**.
9. Za pierwszym razem Google poprosi o autoryzację: **Review permissions** → wybierz
   swoje konto → jeśli pojawi się ostrzeżenie, kliknij **Advanced → Go to … (unsafe)**
   → **Allow**. (To Twój własny skrypt — ostrzeżenie jest standardowe.)
10. Po uruchomieniu w logu na dole powinno być `{"status":"ok"}`, a w arkuszu —
    wiersz z `test@example.com`. Usuń ten wiersz (i testowego subskrybenta
    w MailerLite, jeśli się pojawił).

**2e. Deploy (upublicznienie skrzynki)**

11. Kliknij niebieski **Deploy → New deployment**. Ikona zębatki obok
    „Select type” → **Web app**. Ustaw:
    - Execute as: **Me**
    - Who has access: **Anyone** *(koniecznie „Anyone”, nie „Anyone with Google account”)*
12. Kliknij **Deploy** i **skopiuj adres Web app** (zaczyna się od
    `https://script.google.com/macros/s/…/exec`).

## Krok 3 · Wklej adres skrzynki do strony (~2 min)

1. W repozytorium na github.com kliknij plik **`script.js`**, a potem ikonę
   **ołówka** (Edit) w prawym górnym rogu.
2. Na samej górze pliku znajdź linijkę:
   ```
   ENDPOINT_URL: "WKLEJ_URL_WEB_APPA",
   ```
   i w miejsce `WKLEJ_URL_WEB_APPA` wklej adres z kroku 2e — **cudzysłowy zostają**:
   ```
   ENDPOINT_URL: "https://script.google.com/macros/s/…/exec",
   ```
3. Dwie linijki niżej podmień tak samo `WKLEJ_LINK_DO_PROGRAMU` (adres strony
   programu Spokój z Jedzeniem) i `WKLEJ_LINK_DO_POLITYKI` (adres polityki
   prywatności).
4. Kliknij zielony **Commit changes** (dwa razy). Po ok. minucie zmiana jest online.

## Krok 4 · Test całości z telefonu (checklist)

Zrób to przez **Instagrama na telefonie** (np. link w relacji „tylko bliscy
znajomi” albo w bio) — quiz otwiera się wtedy w przeglądarce wewnątrz aplikacji
i to jest środowisko, w którym musi działać.

- [ ] Quiz da się przejść od startu do wyniku, wszystko czytelne, nic nie ucieka poza ekran
- [ ] Po odświeżeniu strony wynik **nie znika**
- [ ] Formularz: wpisz imię i swój prawdziwy e-mail, zaznacz zgodę, wyślij →
      pojawia się ekran „Wskazówka jest w drodze”
- [ ] W arkuszu Google jest nowy wiersz: data, imię, e-mail, litera wzorca,
      a w kolumnie `mailerlite_status` — `ok`
- [ ] W MailerLite jest nowy subskrybent, przypisany do właściwej grupy,
      z literą w polu `persona`
- [ ] Przyszedł pierwszy mail sekwencji (sprawdź też Spam/Oferty)
- [ ] Bonus: otwórz link z dopiskiem `?utm_source=ig&utm_medium=bio&utm_campaign=test`
      i zapisz się jeszcze raz innym e-mailem → kolumny utm w arkuszu są wypełnione

Jeśli coś nie działa: najpierw sprawdź, czy w `script.js` adres kończy się na
`/exec` i czy deployment ma dostęp „Anyone”. Szczegóły błędów MailerLite zapisują
się w arkuszu w kolumnie `mailerlite_status` — tam zwykle widać przyczynę.

## Krok 5 · RODO — checklist przed startem kampanii

- [ ] Link w checkboxie zgody prowadzi do **działającej polityki prywatności**
      (to ten `LINK_DO_POLITYKI` z kroku 3)
- [ ] W polityce prywatności dopisani odbiorcy danych: **Google** (arkusz z zapisami)
      i **MailerLite** (wysyłka maili)
- [ ] W MailerLite włączony **double opt-in** (subskrybent potwierdza zapis
      kliknięciem w mail) — rekomendowane: czystsza lista i mocniejsza zgoda

## Co gdzie zmieniać później

- **Treść pytań / wyników** → `script.js`, sekcje `QUESTIONS` i `RESULTS`
  (edycja ołówkiem na github.com, jak w kroku 3).
- **Data startu programu (18.08)** → wpisana w `index.html` — wyszukaj „18.08”.
- **Obrazek podglądu linku** → wgraj plik `og.png` (1200×630 px) do folderu `assets`,
  a w `index.html` podmień `https://WKLEJ-ADRES-STRONY/assets/og.png` na pełny adres
  swojej strony (ten z kroku 1.6) — podgląd linku wymaga pełnego adresu z `https://`.
- **Nowa wersja `Code.gs`** → po każdej zmianie kodu skryptu trzeba zrobić
  **Deploy → Manage deployments → ołówek → Version: New version → Deploy**
  (adres zostaje ten sam).
