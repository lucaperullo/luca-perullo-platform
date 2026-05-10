/**
 * Corso interattivo "Crea il tuo primo sito in 30 minuti".
 *
 * Modello cumulativo: ogni lezione si applica al codice prodotto dalla
 * lezione precedente. Il sito CRESCE col procedere del corso.
 *
 * Il corso è progettato per dare un "wow" precoce: a fine modulo 1 (4
 * lezioni) lo studente ha un hero in stile landing-page-2026, con font
 * Google Bricolage Grotesque, titolo gigante con gradient text, e
 * pulsante a pillola con hover scale.
 *
 * I moduli successivi aggiungono contenuto, card e responsive.
 */

// I tipi sono ora condivisi in @/data/play/types. Re-esporto per non
// rompere i vecchi import (back-compat).
export type {
    AvatarMood,
    Lesson,
    Module,
    PlayCourse,
    ValidationRule,
} from "@/data/play/types";

import type {
    Lesson as LessonType,
    Module as ModuleType,
    PlayCourse as PlayCourseType,
} from "@/data/play/types";

// ─────────────────────────────────────────────────────────────────────────
// Studio di Marco — landing page in 16 mosse (slug: "primo-sito")
// ─────────────────────────────────────────────────────────────────────────

export const playCourse: PlayCourseType = {
    slug: "primo-sito",
    title: "Crea il tuo primo sito in 30 minuti",
    subtitle:
        "Costruisci insieme a Luca una landing page che potresti davvero pubblicare oggi",
    description:
        "Non è un esercizio scolastico. In 4 lezioni hai già un hero stunning, da landing page 2026: font moderno, titolo gigante con sfumatura cromatica, CTA pulita. Le altre lezioni aggiungono sezioni, card e responsive. Alla fine: un sito vero, scaricabile come zip o pubblicabile sul tuo GitHub.",
    level: "base",
    subjects: ["html", "css"],
    durationMin: 30,
    status: "live",
    initialCode: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
  </head>
  <body>
    <!-- il sito si costruisce qui -->
  </body>
</html>`,
    finalCode: "",
    modules: [],
    lessons: [],
};

export const modules: ModuleType[] = [
    {
        order: 1,
        slug: "comincia-col-botto",
        title: "Comincia col botto",
        summary:
            "In 4 mosse: scheletro minimo, font moderno, hero a tutta finestra, titolo con sfumatura cromatica. A fine modulo hai già un sito stunning.",
    },
    {
        order: 2,
        slug: "aggiungi-contenuto",
        title: "Più sezioni, più storia",
        summary:
            "Header con logo, sezione 'Cosa faccio', 3 card. Il sito comincia a raccontare di Marco.",
    },
    {
        order: 3,
        slug: "card-layout",
        title: "Le card prendono vita",
        summary:
            "Card affiancate con flex, effetto al passaggio del mouse, footer scuro con i contatti.",
    },
    {
        order: 4,
        slug: "polish-responsive",
        title: "Tocco finale",
        summary:
            "Scroll fluido, responsive sul telefono, animazione di entrata. Il sito è pronto.",
    },
];

export const lessons: LessonType[] = [
    // ────────── MODULO 1 — COMINCIA COL BOTTO ──────────────────────────────
    {
        order: 1,
        slug: "skeleton-minimo",
        title: "Scrivi le prime due righe",
        durationSec: 70,
        avatarMood: "talking",
        script:
            "Cominciamo dal minimo possibile. Dentro il body scriviamo solo due tag: un h1, il titolone della pagina, e un p, il sottotitolo. È volutamente brutto: per ora vediamo solo il testo nudo, senza colori e senza forma. Nelle prossime tre lezioni lo trasformiamo in qualcosa che potresti pubblicare davvero.",
        instruction:
            "Dentro <body> aggiungi <h1>Studio di Marco</h1> e sotto <p>Mobili su misura, fatti a mano</p>",
        hint: "Due tag uno sotto l'altro. Niente di annidato per ora.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
  </head>
  <body>
    <h1>Studio di Marco</h1>
    <p>Mobili su misura, fatti a mano</p>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "body h1",
                    textContent: "Studio di Marco",
                    message: "Manca un h1 con scritto 'Studio di Marco'.",
                },
                {
                    type: "querySelector",
                    selector: "body p",
                    existsOnly: true,
                    message: "Manca un p sotto l'h1.",
                },
            ],
            message: "Un h1 e un p dentro body.",
        },
        successScript:
            "Bene. Lo so, fa schifo: testo nudo su sfondo bianco. È il punto di partenza giusto. Tra 3 lezioni questo stesso testo sembrerà una landing page vera.",
        encourageScript:
            "Solo due tag: <h1>Studio di Marco</h1> e <p>Mobili su misura, fatti a mano</p>. Uno sotto l'altro, dentro body.",
    },

    {
        order: 2,
        slug: "font-google-reset",
        title: "Il font che cambia tutto",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "La prima cosa che separa un sito amatoriale da uno bello è il font. Cambiamo dal font di default del browser a Bricolage Grotesque, un font moderno gratuito di Google. Lo carichiamo con un link nella head. Aggiungiamo anche un reset semplice e un body con il font applicato e qualche margine. Guarda cosa succede al testo: stessa struttura HTML, ma sembra già un altro mondo.",
        instruction:
            "Dentro <head> aggiungi: <link href=\"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap\" rel=\"stylesheet\" /> e poi <style> con * { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Bricolage Grotesque', system-ui, sans-serif; min-height: 100vh; color: #1a1a1a; background: #faf8f5; padding: 32px; }",
        hint: "Due cose dentro head: un <link> a Google Fonts, e un blocco <style> con il reset (asterisco) e gli stili del body.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
        padding: 32px;
      }
    </style>
  </head>
  <body>
    <h1>Studio di Marco</h1>
    <p>Mobili su misura, fatti a mano</p>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "Bricolage+Grotesque",
                    flexible: true,
                    message: "Manca il <link> a Google Fonts per Bricolage Grotesque.",
                },
                {
                    type: "computedStyle",
                    selector: "body",
                    property: "background-color",
                    value: "rgb(250, 248, 245)",
                    message: "Il body deve avere background #faf8f5.",
                },
            ],
            message: "Link al font Bricolage + body con il font applicato.",
        },
        successScript:
            "Eh, vedi? Stessa pagina di prima, ma con un font moderno. Solo il font fa già il 30% del lavoro. Adesso facciamo l'altro 70%.",
        encourageScript:
            "Dentro <head>, prima aggiungi il <link> a Google Fonts. Poi il <style> con il reset (asterisco) e il body con font-family Bricolage.",
    },

    {
        order: 3,
        slug: "hero-full-viewport",
        title: "L'hero che riempie lo schermo",
        durationSec: 95,
        avatarMood: "talking",
        script:
            "Pensa alla copertina di una rivista: l'occhio cade lì, decide in 3 secondi se vale la pena leggere. Sul web si chiama hero, ed è la prima e più importante decisione visiva di una pagina. Costruiamola. Mettiamo h1 e p dentro un main con etichetta hero. Tre regole CSS fanno la magia: min-height 100vh rende la sezione alta come tutto lo schermo, display flex con direction column dispone i figli in verticale, justify-content e align-items center li portano al centro perfetto. Risultato: il tuo testo galleggia in mezzo alla pagina, non si può non leggerlo.",
        instruction:
            "1) HTML: avvolgi h1 e p in <main class=\"hero\">. 2) CSS: aggiungi .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 32px; } 3) Rimuovi il padding: 32px dal body (l'ha sostituito hero).",
        hint: "Tre passi: avvolgi il contenuto in <main class=\"hero\">, scrivi la regola .hero con le 6 proprietà, togli il padding dal body.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
    </style>
  </head>
  <body>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
    </main>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "main.hero h1",
                    existsOnly: true,
                    message: "h1 e p devono stare dentro <main class=\"hero\">.",
                },
                {
                    type: "computedStyle",
                    selector: ".hero",
                    property: "display",
                    value: "flex",
                    message: ".hero deve avere display: flex.",
                },
            ],
            message: "main.hero centrata che riempie lo schermo.",
        },
        successScript:
            "Adesso il testo galleggia al centro di tutto lo schermo. Già sembra un sito vero. Ti manca solo il colpo finale per renderlo davvero memorabile.",
        encourageScript:
            "Tre passi: avvolgi h1+p in <main class=\"hero\">, regola .hero con flex centrato, e min-height: 100vh per riempire l'altezza.",
    },

    {
        order: 4,
        slug: "gradient-text-cta",
        title: "Gradient text + bottone: il colpo finale",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Ed eccoci all'effetto wow. Tre cose insieme. Prima: ingrandiamo il titolo con clamp, una funzione magica che dice 'minimo 48 pixel, ideale 10 percento della finestra, massimo 140'. Così cresce e si rimpicciolisce da solo a seconda dello schermo. Seconda: il trucco gradient-text. Mettiamo un gradient di sfondo all'h1 e poi gli diciamo di mostrare lo sfondo solo dietro il testo. Il testo diventa la sfumatura. È il singolo trucco CSS più impressionante che esiste. Terza: aggiungiamo un bottone a pillola con hover scale. Quando guardi questa pagina dopo, ti sembrerà di averla pagata a un'agenzia.",
        instruction:
            "1) HTML: aggiungi <a href=\"#\" class=\"btn\">Scopri i servizi</a> dentro la hero, dopo il p. 2) CSS aggiuntivo: .hero h1 { font-size: clamp(48px, 10vw, 140px); font-weight: 700; letter-spacing: -0.04em; line-height: 0.95; background: linear-gradient(135deg, #1a0f0a 10%, #d97706); -webkit-background-clip: text; background-clip: text; color: transparent; } .hero p { font-size: clamp(18px, 2vw, 24px); color: #6b6b6b; margin-top: 16px; max-width: 540px; } .btn { display: inline-block; padding: 16px 36px; background: #1a1a1a; color: white; text-decoration: none; border-radius: 999px; font-weight: 500; margin-top: 32px; transition: transform 200ms ease-out; } .btn:hover { transform: scale(1.05); }",
        hint: "Tre passi: aggiungi il bottone all'HTML, scrivi le regole .hero h1 (con il trucco background-clip: text), .hero p, .btn e .btn:hover.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
    </style>
  </head>
  <body>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#" class="btn">Scopri i servizi</a>
    </main>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "a.btn",
                    existsOnly: true,
                    message: "Manca <a class=\"btn\"> dentro la hero.",
                },
                {
                    type: "textIncludes",
                    needle: "background-clip: text",
                    flexible: true,
                    message: "Manca background-clip: text sull'h1 (è il trucco gradient text).",
                },
                {
                    type: "textIncludes",
                    needle: "clamp(",
                    flexible: true,
                    message: "Manca clamp() per il font-size dell'h1.",
                },
            ],
            message: "Hero stunning: gradient text + clamp + CTA con hover.",
        },
        successScript:
            "Boom. Modulo 1 finito! Hai un hero che potresti pubblicare oggi così com'è. Gradient text, tipografia responsive, bottone con hover scale. Roba che 5 anni fa pagavano agenzie. Adesso aggiungiamo le altre sezioni.",
        encourageScript:
            "Tre cose: bottone <a class=\"btn\"> nell'HTML, regola .hero h1 con background-clip: text e font-size clamp, regola .btn con transition e .btn:hover con transform scale.",
    },

    // ────────── MODULO 2 — PIÙ CONTENUTO ──────────────────────────────────
    {
        order: 5,
        slug: "header-logo",
        title: "L'intestazione con il nome del negozio",
        durationSec: 95,
        avatarMood: "talking",
        script:
            "Quando entri in un negozio cerchi sempre l'insegna prima di guardarti intorno. Lo stesso vale sul web. Aggiungiamo un header in alto con il nome del negozio: un'intestazione minimale, prima della hero. Un h2 con il logo testuale, padding contenuto, font più piccolo del titolone. Diventa un'ancora visiva che dice subito \"questo è il sito di un'attività\", non un articolo a caso.",
        instruction:
            "1) HTML: prima di <main class=\"hero\">, aggiungi <header class=\"site-header\"><h2>Studio di Marco</h2></header>. 2) CSS: .site-header { padding: 20px 32px; } .site-header h2 { font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }",
        hint: "Un header sopra il main hero. Dentro un h2 col nome del negozio. Stile minimal: piccolo, ai lati con padding.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#" class="btn">Scopri i servizi</a>
    </main>
  </body>
</html>`,
        validate: {
            type: "querySelector",
            selector: "header.site-header h2",
            existsOnly: true,
            message: "Manca <header class=\"site-header\"> con un h2 dentro.",
        },
        successScript:
            "Header pulito, niente che ruba la scena al titolo. È così che fanno tutti i siti moderni: header invisibile fino a che non serve.",
        encourageScript:
            "Header prima del main. Dentro un h2 col nome 'Studio di Marco'. Stile: padding 20px 32px, font 18px.",
    },

    {
        order: 6,
        slug: "services-section-html",
        title: "La sezione 'Cosa faccio'",
        durationSec: 90,
        avatarMood: "talking",
        script:
            "Sotto la hero aggiungiamo una sezione che spiega cosa offre Marco. Un'altra section, con etichetta services. Dentro un h2 col titolo 'Cosa faccio' e tre div con etichetta card, uno per servizio: Mobili su misura, Restauro, Consulenza. Per ora sono tre rettangoli con scritto solo il nome. Nelle prossime lezioni li trasformiamo in vere card eleganti.",
        instruction:
            "Dopo </main>, aggiungi <section class=\"services\"><h2>Cosa faccio</h2><div class=\"card\">Mobili su misura</div><div class=\"card\">Restauro</div><div class=\"card\">Consulenza</div></section>",
        hint: "Una section con etichetta services, dentro un h2 e tre div con etichetta card. Va dopo </main>, dentro <body>.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#" class="btn">Scopri i servizi</a>
    </main>
    <section class="services">
      <h2>Cosa faccio</h2>
      <div class="card">Mobili su misura</div>
      <div class="card">Restauro</div>
      <div class="card">Consulenza</div>
    </section>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "section.services h2",
                    existsOnly: true,
                    message: "Manca <section class=\"services\"> con dentro un h2.",
                },
                {
                    type: "querySelector",
                    selector: "section.services .card:nth-of-type(3)",
                    existsOnly: true,
                    message: "Servono 3 div con etichetta card dentro .services.",
                },
            ],
            message: "Sezione services con h2 e 3 card.",
        },
        successScript:
            "Struttura pronta. Tre card sì brutte, ma sono qui — adesso le tiriamo fuori benissimo.",
        encourageScript:
            "Una section con etichetta services. Dentro: un h2 'Cosa faccio' e tre div con etichetta card.",
    },

    {
        order: 7,
        slug: "services-style",
        title: "Diamo aria alla sezione servizi",
        durationSec: 85,
        avatarMood: "talking",
        script:
            "Stile della sezione services. Padding generoso sopra e sotto, h2 al centro grosso ma non quanto il titolo della hero. Lasciamo del bianco intorno: è quello che fa la differenza tra dilettante e professionale.",
        instruction:
            "Aggiungi nello <style>: .services { padding: 96px 32px; } .services > h2 { font-size: clamp(36px, 6vw, 64px); font-weight: 700; letter-spacing: -0.03em; text-align: center; margin-bottom: 48px; }",
        hint: "Due regole: .services con padding generoso. .services > h2 con font-size scalabile, centrato, e margin-bottom per separare dalle card.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
      .services {
        padding: 96px 32px;
      }
      .services > h2 {
        font-size: clamp(36px, 6vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: center;
        margin-bottom: 48px;
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#" class="btn">Scopri i servizi</a>
    </main>
    <section class="services">
      <h2>Cosa faccio</h2>
      <div class="card">Mobili su misura</div>
      <div class="card">Restauro</div>
      <div class="card">Consulenza</div>
    </section>
  </body>
</html>`,
        validate: {
            type: "computedStyle",
            selector: ".services > h2",
            property: "text-align",
            value: "center",
            message: "L'h2 dentro .services deve essere centrato.",
        },
        successScript:
            "Lo spazio bianco è il vero segreto del design web. Nove volte su dieci, 'sembra di un sito brutto' significa 'mancano spazi'.",
        encourageScript:
            "Due regole: .services { padding: 96px 32px; } e .services > h2 { font-size clamp scalabile, text-align: center, margin-bottom: 48px }.",
    },

    {
        order: 8,
        slug: "card-style",
        title: "Le card prendono forma",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "Le card sono il pattern visivo più usato del web del 2026: prendono qualunque informazione e la rendono un oggetto da toccare con gli occhi. Costruiamole. Sfondo bianco, padding interno generoso, bordi leggermente arrotondati, una piccolissima ombra che le stacca dallo sfondo. Per ora una sotto l'altra con uno spazio. Nella prossima lezione le metteremo in fila — è il momento più soddisfacente del corso.",
        instruction:
            "Aggiungi: .card { background: white; padding: 40px 32px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); margin-bottom: 16px; max-width: 720px; margin-left: auto; margin-right: auto; }",
        hint: "Una sola regola .card. Dentro: background bianco, padding generoso, border-radius 16px, ombra leggera, e max-width per non farle troppo larghe.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
      .services {
        padding: 96px 32px;
      }
      .services > h2 {
        font-size: clamp(36px, 6vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: center;
        margin-bottom: 48px;
      }
      .card {
        background: white;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        margin-bottom: 16px;
        max-width: 720px;
        margin-left: auto;
        margin-right: auto;
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#" class="btn">Scopri i servizi</a>
    </main>
    <section class="services">
      <h2>Cosa faccio</h2>
      <div class="card">Mobili su misura</div>
      <div class="card">Restauro</div>
      <div class="card">Consulenza</div>
    </section>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "computedStyle",
                    selector: ".card",
                    property: "background-color",
                    value: "rgb(255, 255, 255)",
                    message: ".card deve avere background bianco.",
                },
                {
                    type: "computedStyle",
                    selector: ".card",
                    property: "border-radius",
                    value: "16px",
                    message: ".card deve avere border-radius 16px.",
                },
            ],
            message: "Card bianche con padding, bordi arrotondati e ombra.",
        },
        successScript:
            "Modulo 2 finito. Adesso il sito ha contenuto vero. Manca disporre le card in fila e qualche dettaglio finale.",
        encourageScript:
            "Una regola .card: background white, padding 40px 32px, border-radius 16px, box-shadow leggera, max-width 720px e margin auto.",
    },

    // ────────── MODULO 3 — CARD E LAYOUT ─────────────────────────────────
    {
        order: 9,
        slug: "card-content",
        title: "Riempi le card con titolo + descrizione",
        durationSec: 90,
        avatarMood: "talking",
        script:
            "Dentro ogni card mettiamo un titolino h3 e una descrizione p. La card è come un cartoncino: titolo del servizio in alto, riga sotto con una breve descrizione. Aggiungiamo anche un piccolo stile all'h3 per darle peso.",
        instruction:
            "1) HTML: trasforma il contenuto di ogni card in <h3>...</h3><p>...</p>. Card 1: <h3>Mobili su misura</h3><p>Progettati con te, costruiti a mano nel mio studio.</p>. Card 2: <h3>Restauro</h3><p>Riportiamo a nuova vita pezzi di famiglia.</p>. Card 3: <h3>Consulenza</h3><p>Sopralluoghi gratuiti su Bologna e provincia.</p>. 2) CSS: .card h3 { font-size: 22px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.01em; } .card p { color: #6b6b6b; font-size: 16px; line-height: 1.6; }",
        hint: "Sostituisci il testo dentro ogni card con due tag annidati: <h3>titolo</h3><p>descrizione</p>. Poi due regole CSS per .card h3 e .card p.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
      .services {
        padding: 96px 32px;
      }
      .services > h2 {
        font-size: clamp(36px, 6vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: center;
        margin-bottom: 48px;
      }
      .card {
        background: white;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        margin-bottom: 16px;
        max-width: 720px;
        margin-left: auto;
        margin-right: auto;
      }
      .card h3 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 8px;
        letter-spacing: -0.01em;
      }
      .card p {
        color: #6b6b6b;
        font-size: 16px;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#" class="btn">Scopri i servizi</a>
    </main>
    <section class="services">
      <h2>Cosa faccio</h2>
      <div class="card">
        <h3>Mobili su misura</h3>
        <p>Progettati con te, costruiti a mano nel mio studio.</p>
      </div>
      <div class="card">
        <h3>Restauro</h3>
        <p>Riportiamo a nuova vita pezzi di famiglia.</p>
      </div>
      <div class="card">
        <h3>Consulenza</h3>
        <p>Sopralluoghi gratuiti su Bologna e provincia.</p>
      </div>
    </section>
  </body>
</html>`,
        validate: {
            type: "querySelector",
            selector: ".card h3",
            existsOnly: true,
            message: "Aggiungi un <h3> dentro ogni card.",
        },
        successScript:
            "Adesso ogni card ha senso. Più del 'Mobili su misura' nudo che avevamo prima.",
        encourageScript:
            "Sostituisci il testo dentro ogni card con <h3>titolo</h3><p>descrizione</p>. E aggiungi due regole CSS per .card h3 e .card p.",
    },

    {
        order: 10,
        slug: "card-flex-row",
        title: "Card affiancate in fila",
        durationSec: 95,
        avatarMood: "talking",
        script:
            "Eccoci al momento promesso: le card in fila orizzontale. Le avvolgiamo in un contenitore con etichetta cards e gli applichiamo display flex — quattro lettere che dispongono i figli affiancati invece che impilati. Aggiungiamo gap per lo spazio tra una card e l'altra, e flex-wrap perché sui telefoni vadano a capo invece di restringersi a francobollo. Sulle singole card mettiamo flex 1, così si dividono lo spazio in parti uguali. Salva, e guarda: ti si è appena composta una griglia da catalogo professionale.",
        instruction:
            "1) HTML: avvolgi le 3 card in <div class=\"cards\"> dentro la section services. 2) CSS aggiuntivo: .cards { display: flex; gap: 16px; flex-wrap: wrap; max-width: 1100px; margin: 0 auto; padding: 0 16px; } .card { flex: 1 1 280px; margin-bottom: 0; max-width: none; }",
        hint: "Step 1: avvolgi le 3 card in <div class=\"cards\">. Step 2: regola .cards con flex. Step 3: rimuovi margin-bottom e max-width dalle .card e metti flex: 1 1 280px.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
      .services {
        padding: 96px 32px;
      }
      .services > h2 {
        font-size: clamp(36px, 6vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: center;
        margin-bottom: 48px;
      }
      .cards {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 16px;
      }
      .card {
        background: white;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        flex: 1 1 280px;
      }
      .card h3 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 8px;
        letter-spacing: -0.01em;
      }
      .card p {
        color: #6b6b6b;
        font-size: 16px;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#" class="btn">Scopri i servizi</a>
    </main>
    <section class="services">
      <h2>Cosa faccio</h2>
      <div class="cards">
        <div class="card">
          <h3>Mobili su misura</h3>
          <p>Progettati con te, costruiti a mano nel mio studio.</p>
        </div>
        <div class="card">
          <h3>Restauro</h3>
          <p>Riportiamo a nuova vita pezzi di famiglia.</p>
        </div>
        <div class="card">
          <h3>Consulenza</h3>
          <p>Sopralluoghi gratuiti su Bologna e provincia.</p>
        </div>
      </div>
    </section>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: ".cards .card",
                    existsOnly: true,
                    message: "Le card devono stare dentro un wrapper .cards.",
                },
                {
                    type: "computedStyle",
                    selector: ".cards",
                    property: "display",
                    value: "flex",
                    message: ".cards deve avere display: flex.",
                },
            ],
            message: "Card affiancate dentro un wrapper flex.",
        },
        successScript:
            "Tre card in fila, ognuna che si prende lo spazio giusto. Su schermi piccoli vanno a capo da sole grazie a flex-wrap.",
        encourageScript:
            "1) Avvolgi le 3 card in <div class=\"cards\">. 2) .cards { display: flex; gap: 16px; flex-wrap: wrap; max-width: 1100px; margin: 0 auto; }. 3) Sostituisci margin-bottom + max-width della .card con flex: 1 1 280px.",
    },

    {
        order: 11,
        slug: "card-hover",
        title: "Card che salgono al passaggio del mouse",
        durationSec: 80,
        avatarMood: "talking",
        script:
            "Aggiungiamo un effetto al passaggio del mouse: la card si solleva di pochi pixel con un'ombra più marcata. È un dettaglio piccolissimo ma trasmette 'sito curato' al primo sguardo. Il segreto è la transition che rende il movimento fluido.",
        instruction:
            "Estendi la regola .card aggiungendo: transition: transform 200ms ease-out, box-shadow 200ms ease-out; — poi aggiungi una nuova regola: .card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }",
        hint: "Una proprietà transition dentro la .card esistente. E una nuova regola .card:hover (col due-punti).",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
      .services {
        padding: 96px 32px;
      }
      .services > h2 {
        font-size: clamp(36px, 6vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: center;
        margin-bottom: 48px;
      }
      .cards {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 16px;
      }
      .card {
        background: white;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        flex: 1 1 280px;
        transition: transform 200ms ease-out, box-shadow 200ms ease-out;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      }
      .card h3 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 8px;
        letter-spacing: -0.01em;
      }
      .card p {
        color: #6b6b6b;
        font-size: 16px;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#" class="btn">Scopri i servizi</a>
    </main>
    <section class="services">
      <h2>Cosa faccio</h2>
      <div class="cards">
        <div class="card">
          <h3>Mobili su misura</h3>
          <p>Progettati con te, costruiti a mano nel mio studio.</p>
        </div>
        <div class="card">
          <h3>Restauro</h3>
          <p>Riportiamo a nuova vita pezzi di famiglia.</p>
        </div>
        <div class="card">
          <h3>Consulenza</h3>
          <p>Sopralluoghi gratuiti su Bologna e provincia.</p>
        </div>
      </div>
    </section>
  </body>
</html>`,
        validate: {
            type: "textIncludes",
            needle: ".card:hover",
            flexible: true,
            message: "Manca la regola .card:hover.",
        },
        successScript:
            "Provaci! Passa il mouse sopra una card e vedi che si solleva. È quello che fa pensare 'questo sito è di gente che sa fare il proprio lavoro'.",
        encourageScript:
            "Aggiungi transition dentro .card. Poi una nuova regola .card:hover con transform: translateY(-4px) e box-shadow più marcata.",
    },

    {
        order: 12,
        slug: "footer",
        title: "Il piè di pagina con i contatti",
        durationSec: 90,
        avatarMood: "talking",
        script:
            "Aggiungiamo il piè di pagina, che chiameremo footer. Ci mettiamo i contatti: telefono, email, copyright. Lo stile: sfondo scuro per stacco, testo bianco per leggibilità, padding generoso e centrato. È il sigillo finale del sito.",
        instruction:
            "1) HTML: dopo </section>, aggiungi <footer class=\"site-footer\"><p>Studio di Marco — Via dei Mille 12, Bologna</p><p>051 234 5678 — info@studiodimarco.it</p><p>© 2026 Studio di Marco</p></footer>. 2) CSS: .site-footer { background: #1a1a1a; color: white; padding: 64px 32px; text-align: center; } .site-footer p { color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.8; }",
        hint: "Aggiungi un <footer class=\"site-footer\"> con dentro 3 paragrafi. Stile: sfondo scuro, testo bianco con un po' di trasparenza, padding generoso.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
      .services {
        padding: 96px 32px;
      }
      .services > h2 {
        font-size: clamp(36px, 6vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: center;
        margin-bottom: 48px;
      }
      .cards {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 16px;
      }
      .card {
        background: white;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        flex: 1 1 280px;
        transition: transform 200ms ease-out, box-shadow 200ms ease-out;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      }
      .card h3 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 8px;
        letter-spacing: -0.01em;
      }
      .card p {
        color: #6b6b6b;
        font-size: 16px;
        line-height: 1.6;
      }
      .site-footer {
        background: #1a1a1a;
        color: white;
        padding: 64px 32px;
        text-align: center;
      }
      .site-footer p {
        color: rgba(255,255,255,0.7);
        font-size: 15px;
        line-height: 1.8;
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#" class="btn">Scopri i servizi</a>
    </main>
    <section class="services">
      <h2>Cosa faccio</h2>
      <div class="cards">
        <div class="card">
          <h3>Mobili su misura</h3>
          <p>Progettati con te, costruiti a mano nel mio studio.</p>
        </div>
        <div class="card">
          <h3>Restauro</h3>
          <p>Riportiamo a nuova vita pezzi di famiglia.</p>
        </div>
        <div class="card">
          <h3>Consulenza</h3>
          <p>Sopralluoghi gratuiti su Bologna e provincia.</p>
        </div>
      </div>
    </section>
    <footer class="site-footer">
      <p>Studio di Marco — Via dei Mille 12, Bologna</p>
      <p>051 234 5678 — info@studiodimarco.it</p>
      <p>© 2026 Studio di Marco</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "querySelector",
            selector: "footer.site-footer p",
            existsOnly: true,
            message: "Manca <footer class=\"site-footer\"> con dentro almeno un <p>.",
        },
        successScript:
            "Modulo 3 finito! Il sito è completo come struttura. Mancano solo i tocchi finali: scroll fluido, animazioni, responsive.",
        encourageScript:
            "Footer dopo </section>: <footer class=\"site-footer\"> con 3 paragrafi. Stile: sfondo #1a1a1a, color white, padding 64px 32px, testo centrato.",
    },

    // ────────── MODULO 4 — TOCCO FINALE ──────────────────────────────────
    {
        order: 13,
        slug: "scroll-link",
        title: "Il bottone porta alla sezione servizi",
        durationSec: 80,
        avatarMood: "talking",
        script:
            "Hai mai cliccato su un link interno che ti catapulta in fondo alla pagina con un salto secco? Brutto, no? Lo evitiamo con UNA riga di CSS, e niente di più. Aggiungiamo un id alla sezione servizi, cambiamo l'href del bottone della hero per puntarci, e infine la magia: sul tag html scriviamo scroll-behavior smooth. Una proprietà, e da quel momento tutti i link interni della pagina scorrono fluidi invece di teletrasportarsi. È quel piccolo dettaglio di UX che separa un sito approssimativo da uno che si sente \"giusto\".",
        instruction:
            "1) HTML: alla section services aggiungi id=\"servizi\" → <section class=\"services\" id=\"servizi\">. 2) HTML: cambia href del bottone da \"#\" a \"#servizi\" → <a href=\"#servizi\" class=\"btn\">. 3) CSS: aggiungi html { scroll-behavior: smooth; }",
        hint: "Tre piccoli cambiamenti: id sulla section, href sul bottone, una regola html con scroll-behavior smooth.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html {
        scroll-behavior: smooth;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
      .services {
        padding: 96px 32px;
      }
      .services > h2 {
        font-size: clamp(36px, 6vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: center;
        margin-bottom: 48px;
      }
      .cards {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 16px;
      }
      .card {
        background: white;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        flex: 1 1 280px;
        transition: transform 200ms ease-out, box-shadow 200ms ease-out;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      }
      .card h3 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 8px;
        letter-spacing: -0.01em;
      }
      .card p {
        color: #6b6b6b;
        font-size: 16px;
        line-height: 1.6;
      }
      .site-footer {
        background: #1a1a1a;
        color: white;
        padding: 64px 32px;
        text-align: center;
      }
      .site-footer p {
        color: rgba(255,255,255,0.7);
        font-size: 15px;
        line-height: 1.8;
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#servizi" class="btn">Scopri i servizi</a>
    </main>
    <section class="services" id="servizi">
      <h2>Cosa faccio</h2>
      <div class="cards">
        <div class="card">
          <h3>Mobili su misura</h3>
          <p>Progettati con te, costruiti a mano nel mio studio.</p>
        </div>
        <div class="card">
          <h3>Restauro</h3>
          <p>Riportiamo a nuova vita pezzi di famiglia.</p>
        </div>
        <div class="card">
          <h3>Consulenza</h3>
          <p>Sopralluoghi gratuiti su Bologna e provincia.</p>
        </div>
      </div>
    </section>
    <footer class="site-footer">
      <p>Studio di Marco — Via dei Mille 12, Bologna</p>
      <p>051 234 5678 — info@studiodimarco.it</p>
      <p>© 2026 Studio di Marco</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "section#servizi",
                    existsOnly: true,
                    message: "La section services deve avere id=\"servizi\".",
                },
                {
                    type: "textIncludes",
                    needle: "scroll-behavior: smooth",
                    flexible: true,
                    message: "Manca scroll-behavior: smooth sull'html.",
                },
            ],
            message: "Bottone con href=#servizi + html con scroll-behavior smooth.",
        },
        successScript:
            "Click sul bottone e scendi dolce alla sezione servizi. Una riga di CSS, effetto da app moderna.",
        encourageScript:
            "Tre micro-modifiche: id=\"servizi\" sulla section, href=\"#servizi\" sul bottone, html { scroll-behavior: smooth; }.",
    },

    {
        order: 14,
        slug: "responsive-mobile",
        title: "Anche sul telefono deve essere bello",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "Apri il sito sul telefono — il titolo si è già adattato grazie al clamp che abbiamo messo. Ma le card sono un po' strette, e header e padding sono troppo generosi. Aggiungiamo una media query: una regola condizionale che si attiva solo sotto i 640 pixel. Dentro, riduciamo i padding delle sezioni e mettiamo le card una sotto l'altra.",
        instruction:
            "Aggiungi in fondo allo <style>: @media (max-width: 640px) { .services { padding: 64px 16px; } .card { padding: 32px 24px; } .site-footer { padding: 48px 24px; } }",
        hint: "Una @media (max-width: 640px) con dentro 3 regole: padding più contenuto su .services, .card, e .site-footer.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html {
        scroll-behavior: smooth;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .btn:hover {
        transform: scale(1.05);
      }
      .services {
        padding: 96px 32px;
      }
      .services > h2 {
        font-size: clamp(36px, 6vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: center;
        margin-bottom: 48px;
      }
      .cards {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 16px;
      }
      .card {
        background: white;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        flex: 1 1 280px;
        transition: transform 200ms ease-out, box-shadow 200ms ease-out;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      }
      .card h3 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 8px;
        letter-spacing: -0.01em;
      }
      .card p {
        color: #6b6b6b;
        font-size: 16px;
        line-height: 1.6;
      }
      .site-footer {
        background: #1a1a1a;
        color: white;
        padding: 64px 32px;
        text-align: center;
      }
      .site-footer p {
        color: rgba(255,255,255,0.7);
        font-size: 15px;
        line-height: 1.8;
      }
      @media (max-width: 640px) {
        .services {
          padding: 64px 16px;
        }
        .card {
          padding: 32px 24px;
        }
        .site-footer {
          padding: 48px 24px;
        }
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#servizi" class="btn">Scopri i servizi</a>
    </main>
    <section class="services" id="servizi">
      <h2>Cosa faccio</h2>
      <div class="cards">
        <div class="card">
          <h3>Mobili su misura</h3>
          <p>Progettati con te, costruiti a mano nel mio studio.</p>
        </div>
        <div class="card">
          <h3>Restauro</h3>
          <p>Riportiamo a nuova vita pezzi di famiglia.</p>
        </div>
        <div class="card">
          <h3>Consulenza</h3>
          <p>Sopralluoghi gratuiti su Bologna e provincia.</p>
        </div>
      </div>
    </section>
    <footer class="site-footer">
      <p>Studio di Marco — Via dei Mille 12, Bologna</p>
      <p>051 234 5678 — info@studiodimarco.it</p>
      <p>© 2026 Studio di Marco</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "textIncludes",
            needle: "@media",
            flexible: true,
            message: "Manca una @media query nel CSS.",
        },
        successScript:
            "Cambia il preview a Mobile in alto a destra: il sito si adatta. Su schermi piccoli i padding diventano più contenuti, le card si dispongono una sotto l'altra.",
        encourageScript:
            "@media (max-width: 640px) { ... }. Dentro 3 regole con padding ridotto: .services, .card, .site-footer.",
    },

    {
        order: 15,
        slug: "fade-in-animation",
        title: "Animazione di entrata",
        durationSec: 95,
        avatarMood: "talking",
        script:
            "Aggiungiamo un'animazione che fa apparire il contenuto della hero con un dolce fade-in dal basso, quando la pagina si carica. Si fa con la regola keyframes che descrive una transizione, e poi animation che la applica. È un dettaglio che si sente la prima volta che apri il sito: trasmette cura.",
        instruction:
            "Aggiungi nello <style>: @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } e modifica .hero h1 aggiungendo: animation: fadeUp 800ms ease-out both; — fai lo stesso per .hero p (animation: fadeUp 800ms 200ms ease-out both;) e .hero .btn (animation: fadeUp 800ms 400ms ease-out both;). I numeri 200ms e 400ms sono i ritardi.",
        hint: "Una regola @keyframes fadeUp che descrive l'animazione. Poi 3 animation con delay diversi: 0, 200ms, 400ms.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html {
        scroll-behavior: smooth;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #d97706);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: fadeUp 800ms ease-out both;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
        animation: fadeUp 800ms 200ms ease-out both;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .hero .btn {
        animation: fadeUp 800ms 400ms ease-out both;
      }
      .btn:hover {
        transform: scale(1.05);
      }
      .services {
        padding: 96px 32px;
      }
      .services > h2 {
        font-size: clamp(36px, 6vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: center;
        margin-bottom: 48px;
      }
      .cards {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 16px;
      }
      .card {
        background: white;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        flex: 1 1 280px;
        transition: transform 200ms ease-out, box-shadow 200ms ease-out;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      }
      .card h3 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 8px;
        letter-spacing: -0.01em;
      }
      .card p {
        color: #6b6b6b;
        font-size: 16px;
        line-height: 1.6;
      }
      .site-footer {
        background: #1a1a1a;
        color: white;
        padding: 64px 32px;
        text-align: center;
      }
      .site-footer p {
        color: rgba(255,255,255,0.7);
        font-size: 15px;
        line-height: 1.8;
      }
      @media (max-width: 640px) {
        .services {
          padding: 64px 16px;
        }
        .card {
          padding: 32px 24px;
        }
        .site-footer {
          padding: 48px 24px;
        }
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#servizi" class="btn">Scopri i servizi</a>
    </main>
    <section class="services" id="servizi">
      <h2>Cosa faccio</h2>
      <div class="cards">
        <div class="card">
          <h3>Mobili su misura</h3>
          <p>Progettati con te, costruiti a mano nel mio studio.</p>
        </div>
        <div class="card">
          <h3>Restauro</h3>
          <p>Riportiamo a nuova vita pezzi di famiglia.</p>
        </div>
        <div class="card">
          <h3>Consulenza</h3>
          <p>Sopralluoghi gratuiti su Bologna e provincia.</p>
        </div>
      </div>
    </section>
    <footer class="site-footer">
      <p>Studio di Marco — Via dei Mille 12, Bologna</p>
      <p>051 234 5678 — info@studiodimarco.it</p>
      <p>© 2026 Studio di Marco</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "textIncludes",
            needle: "@keyframes fadeUp",
            flexible: true,
            message: "Manca @keyframes fadeUp.",
        },
        successScript:
            "Ricarica e guarda: titolo, sottotitolo e bottone appaiono uno dopo l'altro con un dolce fade-in. Quel ritardo a cascata è il dettaglio che fa pensare 'fatto bene'.",
        encourageScript:
            "Una regola @keyframes fadeUp che descrive l'animazione. Tre animation: hero h1 senza delay, hero p con 200ms, hero .btn con 400ms.",
    },

    {
        order: 16,
        slug: "completato",
        title: "Hai finito! Vediamo cosa hai costruito",
        durationSec: 90,
        avatarMood: "happy",
        script:
            "FINITO. Hai 200 righe di HTML e CSS scritte da te, che producono una landing page reale, responsive, animata, esportabile. Nelle prossime versioni del corso aggiungeremo il download in zip e il push su GitHub. Per oggi prova a sistemare l'ultimo dettaglio: scegli tu un colore di accent diverso dal mio arancione. Cambialo in un punto solo, sull'h1 della hero, e vedi come cambia tutto il sito.",
        instruction:
            "Cambia il secondo colore del gradient sull'h1 da #d97706 a un colore di tua scelta. Per esempio: #ec4899 (rosa), #3b82f6 (blu), #10b981 (verde). Cerca 'background: linear-gradient(135deg, #1a0f0a 10%, #d97706);' nell'h1 e sostituisci #d97706 con il tuo colore.",
        hint: "Cerca '#d97706' nell'h1 della hero (è il colore arancione finale del gradient text). Sostituiscilo con un altro colore esadecimale tuo. Esempi: rosa #ec4899, blu #3b82f6, verde #10b981.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Studio di Marco</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html {
        scroll-behavior: smooth;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        min-height: 100vh;
        color: #1a1a1a;
        background: #faf8f5;
      }
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .site-header {
        padding: 20px 32px;
      }
      .site-header h2 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 32px;
      }
      .hero h1 {
        font-size: clamp(48px, 10vw, 140px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.95;
        background: linear-gradient(135deg, #1a0f0a 10%, #ec4899);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: fadeUp 800ms ease-out both;
      }
      .hero p {
        font-size: clamp(18px, 2vw, 24px);
        color: #6b6b6b;
        margin-top: 16px;
        max-width: 540px;
        animation: fadeUp 800ms 200ms ease-out both;
      }
      .btn {
        display: inline-block;
        padding: 16px 36px;
        background: #1a1a1a;
        color: white;
        text-decoration: none;
        border-radius: 999px;
        font-weight: 500;
        margin-top: 32px;
        transition: transform 200ms ease-out;
      }
      .hero .btn {
        animation: fadeUp 800ms 400ms ease-out both;
      }
      .btn:hover {
        transform: scale(1.05);
      }
      .services {
        padding: 96px 32px;
      }
      .services > h2 {
        font-size: clamp(36px, 6vw, 64px);
        font-weight: 700;
        letter-spacing: -0.03em;
        text-align: center;
        margin-bottom: 48px;
      }
      .cards {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 16px;
      }
      .card {
        background: white;
        padding: 40px 32px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        flex: 1 1 280px;
        transition: transform 200ms ease-out, box-shadow 200ms ease-out;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      }
      .card h3 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 8px;
        letter-spacing: -0.01em;
      }
      .card p {
        color: #6b6b6b;
        font-size: 16px;
        line-height: 1.6;
      }
      .site-footer {
        background: #1a1a1a;
        color: white;
        padding: 64px 32px;
        text-align: center;
      }
      .site-footer p {
        color: rgba(255,255,255,0.7);
        font-size: 15px;
        line-height: 1.8;
      }
      @media (max-width: 640px) {
        .services {
          padding: 64px 16px;
        }
        .card {
          padding: 32px 24px;
        }
        .site-footer {
          padding: 48px 24px;
        }
      }
    </style>
  </head>
  <body>
    <header class="site-header">
      <h2>Studio di Marco</h2>
    </header>
    <main class="hero">
      <h1>Studio di Marco</h1>
      <p>Mobili su misura, fatti a mano</p>
      <a href="#servizi" class="btn">Scopri i servizi</a>
    </main>
    <section class="services" id="servizi">
      <h2>Cosa faccio</h2>
      <div class="cards">
        <div class="card">
          <h3>Mobili su misura</h3>
          <p>Progettati con te, costruiti a mano nel mio studio.</p>
        </div>
        <div class="card">
          <h3>Restauro</h3>
          <p>Riportiamo a nuova vita pezzi di famiglia.</p>
        </div>
        <div class="card">
          <h3>Consulenza</h3>
          <p>Sopralluoghi gratuiti su Bologna e provincia.</p>
        </div>
      </div>
    </section>
    <footer class="site-footer">
      <p>Studio di Marco — Via dei Mille 12, Bologna</p>
      <p>051 234 5678 — info@studiodimarco.it</p>
      <p>© 2026 Studio di Marco</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "textIncludes",
            needle: "linear-gradient(135deg, #1a0f0a 10%, #",
            flexible: true,
            message: "Cambia il secondo colore del gradient (era #d97706). Lascia il primo colore #1a0f0a, sostituisci il secondo con uno a tua scelta.",
        },
        successScript:
            "Eccoti. Hai un sito tuo, con la tua palette. Ti aspetta un mestiere lungo se vuoi, ma adesso sai una verità importante: programmare un sito non è magia. È una sequenza di mosse semplici, una alla volta. Adesso sai la sequenza. Buon lavoro.",
        encourageScript:
            "Cerca #d97706 nell'h1 della hero. Sostituiscilo con un altro colore esadecimale (es. #ec4899 rosa, #3b82f6 blu, #10b981 verde).",
    },
];

// Popola il PlayCourse aggregato (usato dal nuovo data layer multi-corso)
playCourse.finalCode = lessons[lessons.length - 1].expectedSnapshot;
playCourse.modules = modules;
playCourse.lessons = lessons;

export const totalLessons = lessons.length;

export const getLessonByOrder = (order: number): LessonType | undefined =>
    lessons.find((l) => l.order === order);

export const getModuleForLesson = (order: number): ModuleType => {
    if (order <= 4) return modules[0];
    if (order <= 8) return modules[1];
    if (order <= 12) return modules[2];
    return modules[3];
};

export const lessonsByModule = (moduleOrder: number): LessonType[] => {
    return lessons.filter((l) => getModuleForLesson(l.order).order === moduleOrder);
};
