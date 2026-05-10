/**
 * Corso "accessibilita-wcag": dal sito non accessibile al WCAG 2.2 AAA.
 *
 * Persona: Davide gestisce "Pasticceria Il Cigno" e sta facendo il
 * rebranding del sito. Ha appena scoperto che dal 28 giugno 2025 la
 * European Accessibility Act è obbligatoria per chi vende online — e
 * le multe arrivano fino a 50.000€. Niente panico: in 8 lezioni il
 * sito diventa conforme.
 *
 * Filosofia: ogni lezione fixa un problema reale di accessibilità
 * partendo da una landing pasticceria volutamente disastrata.
 *
 * Sequenza:
 *   M1: Contenuto leggibile (lezioni 1-2: alt text, heading)
 *   M2: Semantica e tastiera (lezioni 3-5: button vs link, focus, skip-link)
 *   M3: Form e landmark (lezioni 6-7: label, ARIA roles)
 *   M4: Conformità AAA (lezione 8: contrasto e font size)
 */
import type { Lesson, PlayCourse } from "@/data/play/types";

export const accessibilitaWcagCourse: PlayCourse = {
    slug: "accessibilita-wcag",
    title: "Accessibilità web: la legge dice così",
    subtitle:
        "Da giugno 2025 in Europa l'accessibilità è legge. WCAG 2.2 dal livello base ad AAA, applicato a un sito vero.",
    description:
        "Il 15% degli utenti di internet ha qualche disabilità. Senza accessibilità li escludi tutti dal tuo sito senza accorgertene — e dal 28 giugno 2025 la European Accessibility Act la rende obbligatoria, con multe fino a 50.000€. In 8 lezioni prendi la landing della Pasticceria Il Cigno (un disastro classico: link \"clicca qui\", div con onclick, ALT mancanti, contrasto rosa-su-bianco) e la rendi WCAG 2.2 conforme. Alt text, gerarchia heading, button semantici, focus visibili, navigazione da tastiera, label form, ARIA landmark, contrasto AAA. Alla fine hai un sito che chiunque può usare e che non ti fa prendere multe.",
    level: "intermedio",
    subjects: ["html", "css"],
    durationMin: 80,
    status: "live",
    initialCode: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pasticceria Il Cigno</title>
    <style>
      body { font-family: Georgia, serif; font-size: 13px; color: #999; background: #fff; margin: 0; }
      .hero { padding: 40px 20px; text-align: center; }
      .pink { color: #ffb6c1; font-size: 48px; }
      .row { display: flex; gap: 20px; padding: 20px; }
      .row img { width: 200px; }
      .fake-btn { background: #ffb6c1; color: #fff; padding: 10px 20px; cursor: pointer; display: inline-block; }
      .fake-btn:focus { outline: none; }
      input { border: 1px solid #ccc; padding: 6px; }
    </style>
  </head>
  <body>
    <div class="hero">
      <h3 class="pink">Pasticceria Il Cigno</h3>
      <h1>I dolci di Davide dal 1987</h1>
      <h5>Specialità siciliane fatte ogni mattina</h5>
      <div class="fake-btn" onclick="alert('ordina')">Ordina ora</div>
    </div>
    <div class="row">
      <img src="cannolo.jpg" />
      <img src="cassata.jpg" />
      <img src="logo-decorativo.svg" />
    </div>
    <h2>Scrivici</h2>
    <div>
      <input type="text" placeholder="Nome" />
      <input type="email" placeholder="Email" />
      <div class="fake-btn" onclick="alert('inviato')">Invia</div>
    </div>
    <p>Via Roma 12 — Palermo · <a href="tel:0911234567">clicca qui</a> per chiamarci · <a href="https://instagram.com/ilcigno">qui</a> il nostro Instagram</p>
  </body>
</html>`,
    finalCode: "",
    modules: [
        {
            order: 1,
            slug: "contenuto-leggibile",
            title: "Contenuto leggibile",
            summary:
                "Alt text descrittivi e gerarchia heading corretta — la base che permette agli screen reader di capire la pagina.",
        },
        {
            order: 2,
            slug: "semantica-tastiera",
            title: "Semantica e tastiera",
            summary:
                "Button vs link, focus visibili, skip-link: chi naviga con la tastiera deve poter fare tutto.",
        },
        {
            order: 3,
            slug: "form-landmark",
            title: "Form e landmark",
            summary:
                "Label esplicite, aria-describedby per gli errori, role main/nav/complementary per orientarsi.",
        },
        {
            order: 4,
            slug: "conformita-aaa",
            title: "Conformità AAA",
            summary:
                "Contrasto colori 7:1, font da 16px in su: l'ultimo gradino per il livello massimo WCAG.",
        },
    ],
    lessons: [],
};

const lessons: Lesson[] = [
    // ────────────── MODULO 1: CONTENUTO LEGGIBILE ────────────────────────
    {
        order: 1,
        slug: "alt-text-funzionanti",
        title: "Alt text: descrittivi se contano, vuoti se decorano",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Da giugno 2025 in Europa l'accessibilità è legge: niente accessibilità, multe fino a 50mila euro. Davide sta rifacendo il sito della pasticceria e parte dal pezzo più semplice e più sbagliato di tutti: le immagini senza alt. Per uno screen reader un'immagine senza alt è un buco nero — l'utente sente \"immagine\" e basta. Regola d'oro: se l'immagine racconta qualcosa, alt descrittivo; se è solo decorazione (un pattern, un bordo, un logo già scritto a fianco), alt vuoto cioè alt=\"\". Mai assente.",
        instruction:
            "Sulle 3 <img> aggiungi gli alt: cannolo.jpg → alt=\"Cannolo siciliano con ricotta e granella di pistacchio\", cassata.jpg → alt=\"Cassata tradizionale decorata con frutta candita\", logo-decorativo.svg → alt=\"\" (perché è solo un fregio decorativo, non aggiunge informazione).",
        hint: "alt=\"...\" descrittivo per le foto dei dolci, alt=\"\" (stringa vuota) per il logo decorativo. L'attributo deve esistere sempre, anche se vuoto.",
        expectedSnapshot: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pasticceria Il Cigno</title>
    <style>
      body { font-family: Georgia, serif; font-size: 13px; color: #999; background: #fff; margin: 0; }
      .hero { padding: 40px 20px; text-align: center; }
      .pink { color: #ffb6c1; font-size: 48px; }
      .row { display: flex; gap: 20px; padding: 20px; }
      .row img { width: 200px; }
      .fake-btn { background: #ffb6c1; color: #fff; padding: 10px 20px; cursor: pointer; display: inline-block; }
      .fake-btn:focus { outline: none; }
      input { border: 1px solid #ccc; padding: 6px; }
    </style>
  </head>
  <body>
    <div class="hero">
      <h3 class="pink">Pasticceria Il Cigno</h3>
      <h1>I dolci di Davide dal 1987</h1>
      <h5>Specialità siciliane fatte ogni mattina</h5>
      <div class="fake-btn" onclick="alert('ordina')">Ordina ora</div>
    </div>
    <div class="row">
      <img src="cannolo.jpg" alt="Cannolo siciliano con ricotta e granella di pistacchio" />
      <img src="cassata.jpg" alt="Cassata tradizionale decorata con frutta candita" />
      <img src="logo-decorativo.svg" alt="" />
    </div>
    <h2>Scrivici</h2>
    <div>
      <input type="text" placeholder="Nome" />
      <input type="email" placeholder="Email" />
      <div class="fake-btn" onclick="alert('inviato')">Invia</div>
    </div>
    <p>Via Roma 12 — Palermo · <a href="tel:0911234567">clicca qui</a> per chiamarci · <a href="https://instagram.com/ilcigno">qui</a> il nostro Instagram</p>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "img[src=\"cannolo.jpg\"][alt]",
                    existsOnly: true,
                    message:
                        "L'immagine cannolo.jpg deve avere un alt descrittivo (es. \"Cannolo siciliano con ricotta...\").",
                },
                {
                    type: "querySelector",
                    selector: "img[src=\"cassata.jpg\"][alt]",
                    existsOnly: true,
                    message:
                        "L'immagine cassata.jpg deve avere un alt descrittivo.",
                },
                {
                    type: "querySelector",
                    selector: "img[src=\"logo-decorativo.svg\"][alt=\"\"]",
                    existsOnly: true,
                    message:
                        "Il logo decorativo deve avere alt=\"\" (vuoto, ma presente) — è solo decorazione.",
                },
            ],
            message:
                "3 alt: 2 descrittivi per le foto significative, alt=\"\" per il decorativo.",
        },
        successScript:
            "Perfetto. WCAG 1.1.1 \"Non-text Content\": ogni immagine deve avere un'alternativa testuale. Alt descrittivi per chi non vede, alt vuoti per non far perdere tempo agli screen reader sulle decorazioni. Sembra niente, è il pilastro dell'accessibilità.",
        encourageScript:
            "Tre img, tre alt. Le foto dei dolci ricevono una descrizione che racconta cosa si vede. Il logo decorativo riceve alt=\"\" — vuoto sì, ma l'attributo deve esserci.",
    },

    {
        order: 2,
        slug: "heading-hierarchy",
        title: "Gerarchia heading: un h1, niente salti",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Gli screen reader navigano per heading come tu navighi per scroll. Se la gerarchia è rotta, l'utente cieco si perde. Regola WCAG 1.3.1: un solo h1 per pagina (il titolo principale), poi h2 per le sezioni, h3 per le sotto-sezioni. Niente salti — non puoi passare da h1 a h4. Sul sito di Davide è il caos: il nome della pasticceria è h3, c'è un h5 come sottotitolo, h1 in mezzo. Sistemiamo: h1 per il titolo del sito, h2 per il sottotitolo, h2 anche per \"Scrivici\".",
        instruction:
            "Cambia gli heading: 1) <h3 class=\"pink\">Pasticceria Il Cigno</h3> diventa <h1 class=\"pink\">Pasticceria Il Cigno</h1>. 2) <h1>I dolci di Davide dal 1987</h1> diventa <p class=\"tagline\">I dolci di Davide dal 1987</p>. 3) <h5>Specialità siciliane...</h5> diventa <h2>Specialità siciliane fatte ogni mattina</h2>. La h2 \"Scrivici\" è già giusta.",
        hint: "Un solo h1 in tutta la pagina (il nome della pasticceria). I sottotitoli del hero diventano h2 (o p semplici). \"Scrivici\" resta h2. Mai saltare livelli (h1 → h3 = no).",
        expectedSnapshot: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pasticceria Il Cigno</title>
    <style>
      body { font-family: Georgia, serif; font-size: 13px; color: #999; background: #fff; margin: 0; }
      .hero { padding: 40px 20px; text-align: center; }
      .pink { color: #ffb6c1; font-size: 48px; }
      .row { display: flex; gap: 20px; padding: 20px; }
      .row img { width: 200px; }
      .fake-btn { background: #ffb6c1; color: #fff; padding: 10px 20px; cursor: pointer; display: inline-block; }
      .fake-btn:focus { outline: none; }
      input { border: 1px solid #ccc; padding: 6px; }
    </style>
  </head>
  <body>
    <div class="hero">
      <h1 class="pink">Pasticceria Il Cigno</h1>
      <p class="tagline">I dolci di Davide dal 1987</p>
      <h2>Specialità siciliane fatte ogni mattina</h2>
      <div class="fake-btn" onclick="alert('ordina')">Ordina ora</div>
    </div>
    <div class="row">
      <img src="cannolo.jpg" alt="Cannolo siciliano con ricotta e granella di pistacchio" />
      <img src="cassata.jpg" alt="Cassata tradizionale decorata con frutta candita" />
      <img src="logo-decorativo.svg" alt="" />
    </div>
    <h2>Scrivici</h2>
    <div>
      <input type="text" placeholder="Nome" />
      <input type="email" placeholder="Email" />
      <div class="fake-btn" onclick="alert('inviato')">Invia</div>
    </div>
    <p>Via Roma 12 — Palermo · <a href="tel:0911234567">clicca qui</a> per chiamarci · <a href="https://instagram.com/ilcigno">qui</a> il nostro Instagram</p>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "h1.pink",
                    textContent: "Pasticceria Il Cigno",
                    message:
                        "Il nome della pasticceria deve essere h1 (era h3). Mantieni la classe pink.",
                },
                {
                    type: "querySelector",
                    selector: ".hero h2",
                    textContent: "Specialità siciliane fatte ogni mattina",
                    message:
                        "Il sottotitolo \"Specialità siciliane...\" deve diventare h2 (era h5, salto vietato).",
                },
                {
                    type: "querySelector",
                    selector: "p.tagline",
                    existsOnly: true,
                    message:
                        "\"I dolci di Davide dal 1987\" non è più un heading: usa <p class=\"tagline\">.",
                },
            ],
            message:
                "Un solo h1, h2 per le sezioni, niente livelli saltati.",
        },
        successScript:
            "Adesso la pagina si naviga: h1 dice di cosa si tratta, gli h2 elencano le sezioni. WCAG 2.4.6 \"Headings and Labels\" — soddisfatto. Bonus: anche Google legge meglio la pagina, l'SEO ringrazia.",
        encourageScript:
            "h3 \"Pasticceria Il Cigno\" → h1. h1 \"I dolci di Davide...\" → p class=\"tagline\". h5 \"Specialità...\" → h2. Un solo h1, niente salti di livello.",
    },

    // ────────────── MODULO 2: SEMANTICA E TASTIERA ───────────────────────
    {
        order: 3,
        slug: "button-vs-link",
        title: "Button per le azioni, a per la navigazione",
        durationSec: 120,
        avatarMood: "talking",
        script:
            "Vedi quei <div class=\"fake-btn\" onclick=\"...\">? Sono il peccato originale del web. Sembrano bottoni, agli occhi sì, ma per chi naviga con la tastiera non esistono — il tab non li raggiunge, l'invio non li attiva, lo screen reader li annuncia come \"clickable group\". Regola semplice: se un elemento esegue un'azione (apri popup, invia form, ordina) usa <button>. Se invece naviga (porta a un'altra pagina o ancora) usa <a href=\"...\">. Anche i due link \"clicca qui\" e \"qui\" in fondo vanno sistemati: un link deve dire dove porta, fuori contesto. \"Clicca qui\" non significa nulla per uno screen reader che legge solo i link della pagina.",
        instruction:
            "1) <div class=\"fake-btn\" onclick=\"alert('ordina')\">Ordina ora</div> diventa <button class=\"fake-btn\" type=\"button\" onclick=\"alert('ordina')\">Ordina ora</button>. 2) Stesso per il bottone Invia: <button class=\"fake-btn\" type=\"submit\" onclick=\"alert('inviato')\">Invia</button>. 3) <a href=\"tel:0911234567\">clicca qui</a> per chiamarci → <a href=\"tel:0911234567\">Chiama il 091 123 4567</a>. 4) <a href=\"https://instagram.com/ilcigno\">qui</a> il nostro Instagram → <a href=\"https://instagram.com/ilcigno\">Seguici su Instagram</a>.",
        hint: "I 2 div.fake-btn diventano <button>. I 2 link generici (\"clicca qui\", \"qui\") ricevono testo descrittivo che spiega la destinazione fuori contesto.",
        expectedSnapshot: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pasticceria Il Cigno</title>
    <style>
      body { font-family: Georgia, serif; font-size: 13px; color: #999; background: #fff; margin: 0; }
      .hero { padding: 40px 20px; text-align: center; }
      .pink { color: #ffb6c1; font-size: 48px; }
      .row { display: flex; gap: 20px; padding: 20px; }
      .row img { width: 200px; }
      .fake-btn { background: #ffb6c1; color: #fff; padding: 10px 20px; cursor: pointer; display: inline-block; }
      .fake-btn:focus { outline: none; }
      input { border: 1px solid #ccc; padding: 6px; }
    </style>
  </head>
  <body>
    <div class="hero">
      <h1 class="pink">Pasticceria Il Cigno</h1>
      <p class="tagline">I dolci di Davide dal 1987</p>
      <h2>Specialità siciliane fatte ogni mattina</h2>
      <button class="fake-btn" type="button" onclick="alert('ordina')">Ordina ora</button>
    </div>
    <div class="row">
      <img src="cannolo.jpg" alt="Cannolo siciliano con ricotta e granella di pistacchio" />
      <img src="cassata.jpg" alt="Cassata tradizionale decorata con frutta candita" />
      <img src="logo-decorativo.svg" alt="" />
    </div>
    <h2>Scrivici</h2>
    <div>
      <input type="text" placeholder="Nome" />
      <input type="email" placeholder="Email" />
      <button class="fake-btn" type="submit" onclick="alert('inviato')">Invia</button>
    </div>
    <p>Via Roma 12 — Palermo · <a href="tel:0911234567">Chiama il 091 123 4567</a> · <a href="https://instagram.com/ilcigno">Seguici su Instagram</a></p>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "button[type=\"button\"]",
                    textContent: "Ordina ora",
                    message:
                        "Il div.fake-btn \"Ordina ora\" deve diventare un <button type=\"button\">.",
                },
                {
                    type: "querySelector",
                    selector: "button[type=\"submit\"]",
                    textContent: "Invia",
                    message:
                        "Il div.fake-btn \"Invia\" deve diventare un <button type=\"submit\">.",
                },
                {
                    type: "querySelector",
                    selector: "a[href=\"tel:0911234567\"]",
                    textContent: "Chiama il 091 123 4567",
                    message:
                        "Il link telefono non deve dire \"clicca qui\" — usa testo descrittivo (es. \"Chiama il 091 123 4567\").",
                },
                {
                    type: "querySelector",
                    selector: "a[href=\"https://instagram.com/ilcigno\"]",
                    textContent: "Seguici su Instagram",
                    message:
                        "Il link Instagram deve avere testo descrittivo (es. \"Seguici su Instagram\"), non \"qui\".",
                },
            ],
            message:
                "Button per azioni, a per navigazione, testo dei link descrittivo.",
        },
        successScript:
            "WCAG 4.1.2 \"Name, Role, Value\" + 2.4.4 \"Link Purpose\". I bottoni adesso sono raggiungibili da tab e attivabili con invio o spazio — gratis, senza JavaScript aggiuntivo. I link dicono dove portano. Niente \"clicca qui\", mai più.",
        encourageScript:
            "div.fake-btn → button. Aggiungi type=\"button\" o type=\"submit\". I 2 link in fondo ricevono testo descrittivo che spiega la destinazione anche fuori contesto.",
    },

    {
        order: 4,
        slug: "focus-visibili",
        title: "Focus visibili: l'outline che nessuno deve nascondere",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Test rapido: schiaccia tab sulla tua pagina. Vedi dove sei finito? Se la risposta è no, hai un problema. Il sito di Davide ha pure outline:none sui bottoni — pratica disastrosa, fatta da metà dei designer del mondo. Chi naviga con tastiera (motoria, ipovisione, semplicemente nessun mouse) non sa dove si trova. WCAG 2.4.7 \"Focus Visible\" è obbligo. Soluzione: outline custom che si vede su qualsiasi sfondo. Si usa la pseudo-classe :focus-visible — appare solo quando arrivi via tastiera, non al click di mouse, quindi non disturba.",
        instruction:
            "Nel <style>: 1) cancella la regola .fake-btn:focus { outline: none; }. 2) Aggiungi alla fine del <style>: button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; border-radius: 2px; }",
        hint: "Cancella outline:none dal CSS. Aggiungi una regola unica per button:focus-visible, a:focus-visible, input:focus-visible con outline 3px solido blu (#1a73e8) e outline-offset: 2px per staccarlo dall'elemento.",
        expectedSnapshot: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pasticceria Il Cigno</title>
    <style>
      body { font-family: Georgia, serif; font-size: 13px; color: #999; background: #fff; margin: 0; }
      .hero { padding: 40px 20px; text-align: center; }
      .pink { color: #ffb6c1; font-size: 48px; }
      .row { display: flex; gap: 20px; padding: 20px; }
      .row img { width: 200px; }
      .fake-btn { background: #ffb6c1; color: #fff; padding: 10px 20px; cursor: pointer; display: inline-block; }
      input { border: 1px solid #ccc; padding: 6px; }
      button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; border-radius: 2px; }
    </style>
  </head>
  <body>
    <div class="hero">
      <h1 class="pink">Pasticceria Il Cigno</h1>
      <p class="tagline">I dolci di Davide dal 1987</p>
      <h2>Specialità siciliane fatte ogni mattina</h2>
      <button class="fake-btn" type="button" onclick="alert('ordina')">Ordina ora</button>
    </div>
    <div class="row">
      <img src="cannolo.jpg" alt="Cannolo siciliano con ricotta e granella di pistacchio" />
      <img src="cassata.jpg" alt="Cassata tradizionale decorata con frutta candita" />
      <img src="logo-decorativo.svg" alt="" />
    </div>
    <h2>Scrivici</h2>
    <div>
      <input type="text" placeholder="Nome" />
      <input type="email" placeholder="Email" />
      <button class="fake-btn" type="submit" onclick="alert('inviato')">Invia</button>
    </div>
    <p>Via Roma 12 — Palermo · <a href="tel:0911234567">Chiama il 091 123 4567</a> · <a href="https://instagram.com/ilcigno">Seguici su Instagram</a></p>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: ":focus-visible",
                    flexible: true,
                    message:
                        "Manca una regola CSS con :focus-visible per rendere il focus visibile.",
                },
                {
                    type: "textIncludes",
                    needle: "outline-offset",
                    flexible: true,
                    message:
                        "Aggiungi outline-offset: 2px per staccare l'outline dall'elemento.",
                },
                {
                    type: "textIncludes",
                    needle: "outline: 3px solid",
                    flexible: true,
                    message:
                        "L'outline deve essere almeno 3px solid in un colore visibile (es. #1a73e8).",
                },
            ],
            message:
                "Focus visibile su button/a/input via :focus-visible con outline + offset.",
        },
        successScript:
            "Premi tab nella preview: vedi il rettangolo blu che salta da elemento a elemento? Quello è il segnale che qualcuno con la tastiera ti ringrazierà. WCAG 2.4.7 conforme. E :focus-visible è la magia: appare solo da tastiera, non al click — quindi i designer non si lamentano.",
        encourageScript:
            "Nel <style> cancella .fake-btn:focus { outline: none; }. Aggiungi: button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; border-radius: 2px; }.",
    },

    {
        order: 5,
        slug: "skip-link-keyboard",
        title: "Skip link: salta direttamente al contenuto",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Immagina di navigare ogni singola pagina partendo dall'inizio del menu — su un sito con 50 link in alto, fai 50 tab prima di arrivare al contenuto. Skip link risolve: è il primo elemento focusabile della pagina, normalmente nascosto, che appare appena lo focus arriva sopra di lui. Premi tab, appare \"Vai al contenuto\", premi invio, salti diretto. WCAG 2.4.1 \"Bypass Blocks\". Se non ce l'hai e hai una nav lunga, multa probabile.",
        instruction:
            "1) Subito dopo <body> aggiungi: <a href=\"#main\" class=\"skip-link\">Vai al contenuto</a>. 2) Aggiungi id=\"main\" alla div.hero così: <div class=\"hero\" id=\"main\">. 3) Nel <style>, in fondo, aggiungi: .skip-link { position: absolute; left: -9999px; top: 0; background: #1a73e8; color: #fff; padding: 12px 16px; font-weight: bold; z-index: 100; } .skip-link:focus { left: 8px; top: 8px; }",
        hint: "Skip link = <a href=\"#main\"> nascosto fuori schermo (left: -9999px) che torna visibile su :focus. Il bersaglio è la div.hero a cui dai id=\"main\".",
        expectedSnapshot: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pasticceria Il Cigno</title>
    <style>
      body { font-family: Georgia, serif; font-size: 13px; color: #999; background: #fff; margin: 0; }
      .hero { padding: 40px 20px; text-align: center; }
      .pink { color: #ffb6c1; font-size: 48px; }
      .row { display: flex; gap: 20px; padding: 20px; }
      .row img { width: 200px; }
      .fake-btn { background: #ffb6c1; color: #fff; padding: 10px 20px; cursor: pointer; display: inline-block; }
      input { border: 1px solid #ccc; padding: 6px; }
      button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; border-radius: 2px; }
      .skip-link { position: absolute; left: -9999px; top: 0; background: #1a73e8; color: #fff; padding: 12px 16px; font-weight: bold; z-index: 100; }
      .skip-link:focus { left: 8px; top: 8px; }
    </style>
  </head>
  <body>
    <a href="#main" class="skip-link">Vai al contenuto</a>
    <div class="hero" id="main">
      <h1 class="pink">Pasticceria Il Cigno</h1>
      <p class="tagline">I dolci di Davide dal 1987</p>
      <h2>Specialità siciliane fatte ogni mattina</h2>
      <button class="fake-btn" type="button" onclick="alert('ordina')">Ordina ora</button>
    </div>
    <div class="row">
      <img src="cannolo.jpg" alt="Cannolo siciliano con ricotta e granella di pistacchio" />
      <img src="cassata.jpg" alt="Cassata tradizionale decorata con frutta candita" />
      <img src="logo-decorativo.svg" alt="" />
    </div>
    <h2>Scrivici</h2>
    <div>
      <input type="text" placeholder="Nome" />
      <input type="email" placeholder="Email" />
      <button class="fake-btn" type="submit" onclick="alert('inviato')">Invia</button>
    </div>
    <p>Via Roma 12 — Palermo · <a href="tel:0911234567">Chiama il 091 123 4567</a> · <a href="https://instagram.com/ilcigno">Seguici su Instagram</a></p>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "a.skip-link[href=\"#main\"]",
                    textContent: "Vai al contenuto",
                    message:
                        "Manca lo skip link: <a href=\"#main\" class=\"skip-link\">Vai al contenuto</a> subito dopo <body>.",
                },
                {
                    type: "querySelector",
                    selector: "#main",
                    existsOnly: true,
                    message:
                        "Aggiungi id=\"main\" alla div.hero (è il bersaglio dello skip link).",
                },
                {
                    type: "textIncludes",
                    needle: ".skip-link:focus",
                    flexible: true,
                    message:
                        "Aggiungi la regola .skip-link:focus che riporta lo skip-link in vista (left: 8px; top: 8px;).",
                },
            ],
            message:
                "Skip link nascosto fuori schermo, visibile su :focus, puntato su #main.",
        },
        successScript:
            "Clicca sulla preview e poi premi tab: vedi spuntare in alto a sinistra \"Vai al contenuto\". Premi invio e salti diretto al hero. WCAG 2.4.1 sistemato. È un dettaglio invisibile alla maggioranza, ma chi lo usa lo ama.",
        encourageScript:
            "Subito dopo <body> metti l'a.skip-link href=\"#main\". Sul .hero metti id=\"main\". Nel CSS: .skip-link nascosta fuori schermo (left: -9999px), .skip-link:focus la rimette dentro (left: 8px).",
    },

    // ────────────── MODULO 3: FORM E LANDMARK ────────────────────────────
    {
        order: 6,
        slug: "form-labels-explicit",
        title: "Form: label esplicite e messaggi di errore associati",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Il placeholder NON è un'etichetta. Sembra esserlo, è grigio, sta nell'input — ma sparisce appena scrivi e gli screen reader spesso lo ignorano. WCAG 1.3.1 + 3.3.2 dicono: ogni input vuole una <label for=\"...\"> esplicita. Aggiungiamo anche un messaggio di errore associato all'email tramite aria-describedby — così quando lo screen reader arriva sul campo legge \"Email, formato richiesto: nome chiocciola dominio\". Bonus: avvolgiamo tutto in un <form> vero, non un div generico.",
        instruction:
            "Sostituisci la <div> del form (sotto h2 Scrivici) con: <form><label for=\"nome\">Nome</label><input id=\"nome\" type=\"text\" required /><label for=\"email\">Email</label><input id=\"email\" type=\"email\" required aria-describedby=\"email-help\" /><span id=\"email-help\" class=\"help\">Useremo questa email solo per risponderti.</span><button class=\"fake-btn\" type=\"submit\" onclick=\"alert('inviato')\">Invia</button></form>. Nel <style> aggiungi: form { display: flex; flex-direction: column; gap: 8px; padding: 0 20px; max-width: 400px; } label { font-weight: bold; color: #333; } .help { font-size: 14px; color: #555; }",
        hint: "Avvolgi gli input in un <form>. Per ogni input metti una <label for=\"id\"> sopra e l'attributo id corrispondente sull'input. Sull'email aggiungi aria-describedby=\"email-help\" che punta a uno <span id=\"email-help\">.",
        expectedSnapshot: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pasticceria Il Cigno</title>
    <style>
      body { font-family: Georgia, serif; font-size: 13px; color: #999; background: #fff; margin: 0; }
      .hero { padding: 40px 20px; text-align: center; }
      .pink { color: #ffb6c1; font-size: 48px; }
      .row { display: flex; gap: 20px; padding: 20px; }
      .row img { width: 200px; }
      .fake-btn { background: #ffb6c1; color: #fff; padding: 10px 20px; cursor: pointer; display: inline-block; }
      input { border: 1px solid #ccc; padding: 6px; }
      button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; border-radius: 2px; }
      .skip-link { position: absolute; left: -9999px; top: 0; background: #1a73e8; color: #fff; padding: 12px 16px; font-weight: bold; z-index: 100; }
      .skip-link:focus { left: 8px; top: 8px; }
      form { display: flex; flex-direction: column; gap: 8px; padding: 0 20px; max-width: 400px; }
      label { font-weight: bold; color: #333; }
      .help { font-size: 14px; color: #555; }
    </style>
  </head>
  <body>
    <a href="#main" class="skip-link">Vai al contenuto</a>
    <div class="hero" id="main">
      <h1 class="pink">Pasticceria Il Cigno</h1>
      <p class="tagline">I dolci di Davide dal 1987</p>
      <h2>Specialità siciliane fatte ogni mattina</h2>
      <button class="fake-btn" type="button" onclick="alert('ordina')">Ordina ora</button>
    </div>
    <div class="row">
      <img src="cannolo.jpg" alt="Cannolo siciliano con ricotta e granella di pistacchio" />
      <img src="cassata.jpg" alt="Cassata tradizionale decorata con frutta candita" />
      <img src="logo-decorativo.svg" alt="" />
    </div>
    <h2>Scrivici</h2>
    <form>
      <label for="nome">Nome</label>
      <input id="nome" type="text" required />
      <label for="email">Email</label>
      <input id="email" type="email" required aria-describedby="email-help" />
      <span id="email-help" class="help">Useremo questa email solo per risponderti.</span>
      <button class="fake-btn" type="submit" onclick="alert('inviato')">Invia</button>
    </form>
    <p>Via Roma 12 — Palermo · <a href="tel:0911234567">Chiama il 091 123 4567</a> · <a href="https://instagram.com/ilcigno">Seguici su Instagram</a></p>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "form label[for=\"nome\"]",
                    existsOnly: true,
                    message:
                        "Serve una <label for=\"nome\"> dentro il form, abbinata all'input id=\"nome\".",
                },
                {
                    type: "querySelector",
                    selector: "form label[for=\"email\"]",
                    existsOnly: true,
                    message:
                        "Serve una <label for=\"email\"> abbinata all'input id=\"email\".",
                },
                {
                    type: "querySelector",
                    selector: "input#email[aria-describedby=\"email-help\"]",
                    existsOnly: true,
                    message:
                        "L'input email deve avere aria-describedby=\"email-help\".",
                },
                {
                    type: "querySelector",
                    selector: "#email-help",
                    existsOnly: true,
                    message:
                        "Manca l'elemento con id=\"email-help\" che descrive il campo email.",
                },
            ],
            message:
                "Form con label esplicite (for/id) + aria-describedby sull'email.",
        },
        successScript:
            "Adesso uno screen reader sull'input email annuncia: \"Email, modifica testo, formato richiesto: nome chiocciola dominio. Useremo questa email solo per risponderti.\" WCAG 1.3.1, 3.3.2, 4.1.2 — tre check con un colpo solo.",
        encourageScript:
            "div del form → <form>. Per ogni input: <label for=\"id\">Testo</label> sopra + id corrispondente sull'input. Sull'email: aria-describedby=\"email-help\" e <span id=\"email-help\">. CSS: regola form, label, .help.",
    },

    {
        order: 7,
        slug: "aria-landmarks",
        title: "ARIA landmark: nav, main, complementary, footer",
        durationSec: 120,
        avatarMood: "talking",
        script:
            "Gli screen reader hanno una scorciatoia magica: \"vai al main\", \"vai alla nav\", \"vai al footer\". Funziona se la pagina ha i landmark giusti. Tradotto: usare i tag HTML5 semantici (header, nav, main, aside, footer) o i loro role ARIA. La pagina di Davide è tutta div. Sistemiamo: trasformiamo la div.hero in <main>, aggiungiamo una <nav> in alto con il menu, mettiamo l'indirizzo e i link contatto in un <footer>. E sulla nav aggiungiamo aria-current=\"page\" sul link attivo, così chi naviga sa dove si trova.",
        instruction:
            "1) Subito dopo lo skip link, aggiungi: <nav aria-label=\"Principale\"><a href=\"#main\" aria-current=\"page\">Home</a> · <a href=\"#prodotti\">Prodotti</a> · <a href=\"#scrivici\">Contatti</a></nav>. 2) Cambia <div class=\"hero\" id=\"main\"> in <main class=\"hero\" id=\"main\">. 3) Cambia il </div> di chiusura del hero in </main>. 4) Aggiungi id=\"prodotti\" alla div.row. 5) Aggiungi id=\"scrivici\" alla h2 Scrivici. 6) Avvolgi il <p> finale (Via Roma...) in un <footer>...</footer>. Nel <style>: nav { padding: 12px 20px; background: #f4f4f4; } nav a { color: #1a73e8; margin: 0 4px; } footer { padding: 20px; background: #f4f4f4; margin-top: 20px; }",
        hint: "Aggiungi <nav aria-label=\"Principale\"> dopo lo skip link. div.hero → <main>. Avvolgi il <p> finale in <footer>. Sul link Home metti aria-current=\"page\". Sui target del menu aggiungi gli id (prodotti, scrivici).",
        expectedSnapshot: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pasticceria Il Cigno</title>
    <style>
      body { font-family: Georgia, serif; font-size: 13px; color: #999; background: #fff; margin: 0; }
      .hero { padding: 40px 20px; text-align: center; }
      .pink { color: #ffb6c1; font-size: 48px; }
      .row { display: flex; gap: 20px; padding: 20px; }
      .row img { width: 200px; }
      .fake-btn { background: #ffb6c1; color: #fff; padding: 10px 20px; cursor: pointer; display: inline-block; }
      input { border: 1px solid #ccc; padding: 6px; }
      button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; border-radius: 2px; }
      .skip-link { position: absolute; left: -9999px; top: 0; background: #1a73e8; color: #fff; padding: 12px 16px; font-weight: bold; z-index: 100; }
      .skip-link:focus { left: 8px; top: 8px; }
      form { display: flex; flex-direction: column; gap: 8px; padding: 0 20px; max-width: 400px; }
      label { font-weight: bold; color: #333; }
      .help { font-size: 14px; color: #555; }
      nav { padding: 12px 20px; background: #f4f4f4; }
      nav a { color: #1a73e8; margin: 0 4px; }
      footer { padding: 20px; background: #f4f4f4; margin-top: 20px; }
    </style>
  </head>
  <body>
    <a href="#main" class="skip-link">Vai al contenuto</a>
    <nav aria-label="Principale">
      <a href="#main" aria-current="page">Home</a> · <a href="#prodotti">Prodotti</a> · <a href="#scrivici">Contatti</a>
    </nav>
    <main class="hero" id="main">
      <h1 class="pink">Pasticceria Il Cigno</h1>
      <p class="tagline">I dolci di Davide dal 1987</p>
      <h2>Specialità siciliane fatte ogni mattina</h2>
      <button class="fake-btn" type="button" onclick="alert('ordina')">Ordina ora</button>
    </main>
    <div class="row" id="prodotti">
      <img src="cannolo.jpg" alt="Cannolo siciliano con ricotta e granella di pistacchio" />
      <img src="cassata.jpg" alt="Cassata tradizionale decorata con frutta candita" />
      <img src="logo-decorativo.svg" alt="" />
    </div>
    <h2 id="scrivici">Scrivici</h2>
    <form>
      <label for="nome">Nome</label>
      <input id="nome" type="text" required />
      <label for="email">Email</label>
      <input id="email" type="email" required aria-describedby="email-help" />
      <span id="email-help" class="help">Useremo questa email solo per risponderti.</span>
      <button class="fake-btn" type="submit" onclick="alert('inviato')">Invia</button>
    </form>
    <footer>
      <p>Via Roma 12 — Palermo · <a href="tel:0911234567">Chiama il 091 123 4567</a> · <a href="https://instagram.com/ilcigno">Seguici su Instagram</a></p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "nav[aria-label=\"Principale\"]",
                    existsOnly: true,
                    message:
                        "Manca <nav aria-label=\"Principale\"> dopo lo skip link.",
                },
                {
                    type: "querySelector",
                    selector: "main#main.hero",
                    existsOnly: true,
                    message:
                        "div.hero deve diventare <main id=\"main\" class=\"hero\">.",
                },
                {
                    type: "querySelector",
                    selector: "nav a[aria-current=\"page\"]",
                    existsOnly: true,
                    message:
                        "Sul link \"Home\" della nav serve aria-current=\"page\".",
                },
                {
                    type: "querySelector",
                    selector: "footer",
                    existsOnly: true,
                    message:
                        "Avvolgi il <p> finale (Via Roma...) in un <footer>.",
                },
            ],
            message:
                "Landmark: nav, main, footer + aria-current sulla pagina attiva.",
        },
        successScript:
            "WCAG 1.3.1 + 2.4.1 + ARIA Authoring Practices: superati. Adesso uno screen reader può fare \"vai al main\" e atterrare diretto sui dolci. aria-current=\"page\" è la chicca: dice \"sei qui\" anche tecnicamente, non solo visivamente.",
        encourageScript:
            "Aggiungi <nav aria-label=\"Principale\"> con 3 link (Home con aria-current=\"page\", Prodotti, Contatti). div.hero → <main>. Avvolgi <p> finale in <footer>. Aggiungi id ai bersagli del menu.",
    },

    // ────────────── MODULO 4: CONFORMITÀ AAA ─────────────────────────────
    {
        order: 8,
        slug: "contrasto-aaa",
        title: "Contrasto colori AAA e font da 16px in su",
        durationSec: 140,
        avatarMood: "happy",
        script:
            "Ultima lezione. Salto finale: dal livello AA (4.5:1, obbligatorio per legge) al livello AAA (7:1, eccellenza). E sistemiamo il font da 13px — sotto i 16px chi ha bisogno degli occhiali piange. Sul sito di Davide il rosa #ffb6c1 su bianco ha contrasto 1.6:1, fail totale. Il body grigio #999 ha contrasto 2.8:1, fail. Useremo: testo body #1a1a1a su bianco (contrasto 18:1, AAA confortevole), titolo rosa più scuro #c2185b (contrasto 7.2:1, AAA), bottone con sfondo #ad1457 (contrasto 8.1:1, AAA). Font: da 13px a 16px sul body. WCAG 1.4.6 \"Contrast Enhanced\" + 1.4.4 \"Resize Text\" sistemati.",
        instruction:
            "Modifica il <style>: 1) body: cambia font-size: 13px → font-size: 16px, e color: #999 → color: #1a1a1a. 2) .pink: cambia color: #ffb6c1 → color: #c2185b. 3) .fake-btn: cambia background: #ffb6c1 → background: #ad1457 (così il bianco sopra ha contrasto AAA). 4) label: il color è già #333 — cambialo in color: #1a1a1a per AAA. 5) .help: cambia color: #555 → color: #1a1a1a. 6) nav a: il color #1a73e8 su #f4f4f4 ha contrasto 4.6:1 (AA), portalo a color: #0b5cad per AAA.",
        hint: "Body font-size 16px, body color #1a1a1a, .pink #c2185b, .fake-btn background #ad1457, label color #1a1a1a, .help color #1a1a1a, nav a color #0b5cad. Tutti contrasti AAA (≥7:1 per testo normale).",
        expectedSnapshot: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pasticceria Il Cigno</title>
    <style>
      body { font-family: Georgia, serif; font-size: 16px; color: #1a1a1a; background: #fff; margin: 0; }
      .hero { padding: 40px 20px; text-align: center; }
      .pink { color: #c2185b; font-size: 48px; }
      .row { display: flex; gap: 20px; padding: 20px; }
      .row img { width: 200px; }
      .fake-btn { background: #ad1457; color: #fff; padding: 10px 20px; cursor: pointer; display: inline-block; }
      input { border: 1px solid #ccc; padding: 6px; }
      button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; border-radius: 2px; }
      .skip-link { position: absolute; left: -9999px; top: 0; background: #1a73e8; color: #fff; padding: 12px 16px; font-weight: bold; z-index: 100; }
      .skip-link:focus { left: 8px; top: 8px; }
      form { display: flex; flex-direction: column; gap: 8px; padding: 0 20px; max-width: 400px; }
      label { font-weight: bold; color: #1a1a1a; }
      .help { font-size: 14px; color: #1a1a1a; }
      nav { padding: 12px 20px; background: #f4f4f4; }
      nav a { color: #0b5cad; margin: 0 4px; }
      footer { padding: 20px; background: #f4f4f4; margin-top: 20px; }
    </style>
  </head>
  <body>
    <a href="#main" class="skip-link">Vai al contenuto</a>
    <nav aria-label="Principale">
      <a href="#main" aria-current="page">Home</a> · <a href="#prodotti">Prodotti</a> · <a href="#scrivici">Contatti</a>
    </nav>
    <main class="hero" id="main">
      <h1 class="pink">Pasticceria Il Cigno</h1>
      <p class="tagline">I dolci di Davide dal 1987</p>
      <h2>Specialità siciliane fatte ogni mattina</h2>
      <button class="fake-btn" type="button" onclick="alert('ordina')">Ordina ora</button>
    </main>
    <div class="row" id="prodotti">
      <img src="cannolo.jpg" alt="Cannolo siciliano con ricotta e granella di pistacchio" />
      <img src="cassata.jpg" alt="Cassata tradizionale decorata con frutta candita" />
      <img src="logo-decorativo.svg" alt="" />
    </div>
    <h2 id="scrivici">Scrivici</h2>
    <form>
      <label for="nome">Nome</label>
      <input id="nome" type="text" required />
      <label for="email">Email</label>
      <input id="email" type="email" required aria-describedby="email-help" />
      <span id="email-help" class="help">Useremo questa email solo per risponderti.</span>
      <button class="fake-btn" type="submit" onclick="alert('inviato')">Invia</button>
    </form>
    <footer>
      <p>Via Roma 12 — Palermo · <a href="tel:0911234567">Chiama il 091 123 4567</a> · <a href="https://instagram.com/ilcigno">Seguici su Instagram</a></p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "font-size: 16px",
                    flexible: true,
                    message:
                        "Il body deve avere font-size: 16px (non più 13px).",
                },
                {
                    type: "textIncludes",
                    needle: "color: #1a1a1a",
                    flexible: true,
                    message:
                        "Il colore del testo del body deve diventare #1a1a1a (non più #999).",
                },
                {
                    type: "textIncludes",
                    needle: "#c2185b",
                    flexible: true,
                    message:
                        "Il rosa .pink deve passare da #ffb6c1 a #c2185b (contrasto AAA).",
                },
                {
                    type: "textIncludes",
                    needle: "#ad1457",
                    flexible: true,
                    message:
                        "Il background di .fake-btn deve diventare #ad1457 (così il bianco sopra ha contrasto AAA).",
                },
                {
                    type: "textIncludes",
                    needle: "#0b5cad",
                    flexible: true,
                    message:
                        "I link in nav devono passare a color: #0b5cad per contrasto AAA su sfondo #f4f4f4.",
                },
            ],
            message:
                "Tutti i testi a contrasto AAA (≥7:1) e font body da 16px.",
        },
        successScript:
            "FATTO. Da landing che ti faceva prendere multe a sito WCAG 2.2 AAA conforme in 8 lezioni. Adesso Davide può attivare il rebrand e dormire sereno: niente sanzioni, e soprattutto chiunque — ipovedente, motorio, screen reader, vecchietta col cellulare in mano — può ordinare i suoi cannoli. L'accessibilità non è un costo, è il bacino di clienti più ampio possibile.",
        encourageScript:
            "Sei modifiche al CSS: body font-size 16px e color #1a1a1a; .pink color #c2185b; .fake-btn background #ad1457; label color #1a1a1a; .help color #1a1a1a; nav a color #0b5cad. Tutto AAA.",
    },
];

accessibilitaWcagCourse.lessons = lessons;
accessibilitaWcagCourse.finalCode =
    lessons[lessons.length - 1].expectedSnapshot;
