/**
 * Corso "tipografia-design": dalla pagina HTML nuda a una hero
 * editoriale typo-driven, costruita un dettaglio tipografico alla volta.
 *
 * Persona: Edoardo, editor di "Slow" — rivista online di slow living.
 * Vuole una landing che respiri come una pagina di Apress o un
 * editoriale di Vogue: titoli grandi, ritmo verticale calmo,
 * dettagli da magazine vero (drop cap, hanging punctuation, italics
 * raffinati). Niente bold ovunque, niente font generici.
 *
 * Filosofia design: la tipografia è il 70% del web. Costruiamo
 * cumulativamente partendo da un h1 grezzo fino a una hero che
 * comunica voce editoriale prima ancora di leggere una parola.
 *
 * Sequenza:
 *   M1: Font + scala (lezioni 1-2)
 *   M2: Ritmo verticale (lezioni 3-4)
 *   M3: Dettagli editoriali (lezioni 5-7)
 *   M4: Tipografia variabile (lezione 8)
 */
import type { Lesson, PlayCourse } from "@/data/play/types";

export const tipografiaDesignCourse: PlayCourse = {
    slug: "tipografia-design",
    title: "Tipografia che parla",
    subtitle:
        "Dalla pagina nuda a una hero editoriale: scala modulare, ritmo verticale, drop cap, variable fonts. Come una rivista vera.",
    description:
        "Apri un libro stampato bene. Non è il contenuto a colpirti per primo, è la cura della pagina. In 8 lezioni costruirai la hero della rivista \"Slow\" — un magazine di slow living — applicando gli stessi principi che usano Vogue, NYT, Wired, Apress: pairing display+body, scala modulare 1.250, ritmo verticale su baseline, italics e smallcaps al posto del bold ovunque, drop cap, hanging punctuation, variable fonts. Alla fine la tua pagina parlerà prima ancora che venga letta.",
    level: "intermedio",
    subjects: ["css"],
    durationMin: 70,
    status: "live",
    initialCode: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slow — il magazine che respira</title>
    <style>
    </style>
  </head>
  <body>
    <article class="hero">
      <p class="kicker">Numero 12 — Primavera</p>
      <h1>"Vivere lentamente non significa fare meno."</h1>
      <p class="lede">È la rivista di chi ha smesso di rincorrere il tempo e ha iniziato ad abitarlo. Storie, ricette, persone, paesaggi.</p>
      <p class="byline">di Edoardo Marchi</p>
    </article>
  </body>
</html>`,
    finalCode: "",
    modules: [
        {
            order: 1,
            slug: "font-scala",
            title: "Font pairing + scala modulare",
            summary:
                "Importi due Google Fonts (display + sans testo) e costruisci una scala 1.250 con variabili CSS.",
        },
        {
            order: 2,
            slug: "ritmo",
            title: "Leading, tracking, ritmo verticale",
            summary:
                "Line-height differenziato per body e heading, letter-spacing stretto sui titoli, margini su baseline 8px.",
        },
        {
            order: 3,
            slug: "dettagli-editoriali",
            title: "Dettagli da magazine vero",
            summary:
                "Italics e smallcaps al posto del bold, drop cap con ::first-letter, hanging punctuation per le virgolette.",
        },
        {
            order: 4,
            slug: "variable-fonts",
            title: "Variable fonts",
            summary:
                "font-variation-settings per un peso che reagisce all'hover. La tipografia diventa interattiva.",
        },
    ],
    lessons: [],
};

const lessons: Lesson[] = [
    // ────────────── MODULO 1: FONT + SCALA ───────────────────────────────
    {
        order: 1,
        slug: "font-pairing",
        title: "Display + body: il pairing che fa la voce",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Apri un libro di carta. Non è il contenuto a colpirti per primo, è la cura della pagina. Quella cura nel web inizia da una scelta sola: due font. Uno per i titoli, espressivo, che dà personalità — un display serif. Uno per il testo lungo, neutro, che si fa leggere — un sans humanist. Per Slow uso Fraunces, un serif con carattere che NYT e tante riviste indie hanno reso popolare, e Inter come body. Due Google Fonts, quattro righe di CSS, e la pagina ha già una voce.",
        instruction:
            "Dentro <style>, in cima, importa i due font: @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&display=swap'); Poi aggiungi: body { font-family: 'Inter', system-ui, sans-serif; color: #1a1a1a; max-width: 680px; margin: 4rem auto; padding: 0 1.5rem; } h1 { font-family: 'Fraunces', Georgia, serif; }",
        hint: "Due cose: prima @import dei font da Google. Poi nel body usa Inter come font-family + max-width 680px e margin auto per centrare. Sull'h1 invece usa Fraunces.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slow — il magazine che respira</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&display=swap');

      body {
        font-family: 'Inter', system-ui, sans-serif;
        color: #1a1a1a;
        max-width: 680px;
        margin: 4rem auto;
        padding: 0 1.5rem;
      }

      h1 {
        font-family: 'Fraunces', Georgia, serif;
      }
    </style>
  </head>
  <body>
    <article class="hero">
      <p class="kicker">Numero 12 — Primavera</p>
      <h1>"Vivere lentamente non significa fare meno."</h1>
      <p class="lede">È la rivista di chi ha smesso di rincorrere il tempo e ha iniziato ad abitarlo. Storie, ricette, persone, paesaggi.</p>
      <p class="byline">di Edoardo Marchi</p>
    </article>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "fonts.googleapis.com",
                    flexible: true,
                    message:
                        "Devi importare i font da Google con @import url('https://fonts.googleapis.com/...').",
                },
                {
                    type: "computedStyle",
                    selector: "body",
                    property: "max-width",
                    value: "680px",
                    message:
                        "Il body deve avere max-width: 680px per la misura editoriale.",
                },
                {
                    type: "computedStyle",
                    selector: "h1",
                    property: "font-family",
                    value: "Fraunces",
                    message:
                        "L'h1 deve usare Fraunces come font-family principale.",
                },
            ],
            message:
                "Pairing Inter (body) + Fraunces (display) e misura editoriale di 680px.",
        },
        successScript:
            "Hai appena fatto la cosa più importante della tipografia web: un pairing intenzionale. Fraunces grida personalità sui titoli, Inter sparisce educatamente sotto i paragrafi. È lo stesso principio dietro a NYT, The Atlantic, Apress.",
        encourageScript:
            "In cima allo <style> metti @import url('...Fraunces...Inter...'). Poi sul body metti font-family Inter, max-width 680px e margin 4rem auto. Sull'h1 invece font-family Fraunces.",
    },

    {
        order: 2,
        slug: "type-scale",
        title: "Scala modulare 1.250 (Major Third)",
        durationSec: 120,
        avatarMood: "talking",
        script:
            "Quanto deve essere grande un titolo rispetto al corpo? Risposta sbagliata: \"a occhio\". Risposta giusta: una scala modulare. Scegli un ratio matematico — 1.250 è il \"Major Third\", quello musicale, lo stesso che usa Bootstrap — e ogni dimensione è la precedente moltiplicata. Base 1rem (16px), poi 1.25rem, 1.563rem, 1.953rem, 2.441rem. Variabili CSS così le riusi ovunque, e tutta la pagina canta nella stessa tonalità.",
        instruction:
            "In cima allo <style>, prima del body, aggiungi un blocco :root { --text-xs: 0.8rem; --text-sm: 1rem; --text-base: 1.25rem; --text-lg: 1.563rem; --text-xl: 3.052rem; }. Poi applica: .kicker { font-size: var(--text-xs); } .lede { font-size: var(--text-base); } .byline { font-size: var(--text-sm); } h1 { font-size: var(--text-xl); font-weight: 400; }",
        hint: "Definisci 5 variabili CSS in :root con la scala 1.250 partendo da 0.8rem. Poi assegnale: kicker → xs, byline → sm, lede → base, h1 → xl. L'h1 ha anche font-weight 400 (no bold pesante).",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slow — il magazine che respira</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&display=swap');

      :root {
        --text-xs: 0.8rem;
        --text-sm: 1rem;
        --text-base: 1.25rem;
        --text-lg: 1.563rem;
        --text-xl: 3.052rem;
      }

      body {
        font-family: 'Inter', system-ui, sans-serif;
        color: #1a1a1a;
        max-width: 680px;
        margin: 4rem auto;
        padding: 0 1.5rem;
      }

      h1 {
        font-family: 'Fraunces', Georgia, serif;
        font-size: var(--text-xl);
        font-weight: 400;
      }

      .kicker { font-size: var(--text-xs); }
      .lede { font-size: var(--text-base); }
      .byline { font-size: var(--text-sm); }
    </style>
  </head>
  <body>
    <article class="hero">
      <p class="kicker">Numero 12 — Primavera</p>
      <h1>"Vivere lentamente non significa fare meno."</h1>
      <p class="lede">È la rivista di chi ha smesso di rincorrere il tempo e ha iniziato ad abitarlo. Storie, ricette, persone, paesaggi.</p>
      <p class="byline">di Edoardo Marchi</p>
    </article>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "--text-xl",
                    flexible: true,
                    message:
                        "Devi definire le variabili --text-xs/sm/base/lg/xl in :root.",
                },
                {
                    type: "computedStyle",
                    selector: "h1",
                    property: "font-size",
                    value: "48",
                    message:
                        "L'h1 deve essere ~48px (3.052rem) — la cima della scala 1.250.",
                },
                {
                    type: "computedStyle",
                    selector: ".lede",
                    property: "font-size",
                    value: "20",
                    message:
                        "Il .lede deve avere font-size 1.25rem (20px) — il base della scala.",
                },
            ],
            message:
                "Scala modulare 1.250 con 5 variabili CSS applicate ai 4 ruoli tipografici.",
        },
        successScript:
            "Adesso ogni dimensione è in armonia con le altre. Quando aggiungi un h2, un h3, una nota, sai già che misura usare. È la differenza tra una pagina che \"canta\" e una che stona — il dettaglio che non sai spiegare ma senti.",
        encourageScript:
            "Blocco :root con 5 variabili: 0.8rem, 1rem, 1.25rem, 1.563rem, 3.052rem (è 1.25 elevato a varie potenze). Poi assegni: h1 → --text-xl + font-weight 400, lede → base, kicker → xs, byline → sm.",
    },

    // ────────────── MODULO 2: RITMO ──────────────────────────────────────
    {
        order: 3,
        slug: "leading-tracking",
        title: "Leading e tracking: respiro e personalità",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Il 70% del web è tipografia. Sbagliarla è sbagliare il 70% del design. Due numeri ti separano da una pagina amatoriale: line-height e letter-spacing. Sui paragrafi vuoi 1.6 di leading — generoso, l'occhio rimbalza riga dopo riga senza fatica. Sui titoli invece 1.1, stretti, compatti, monumentali. E il letter-spacing? Negativo sui display: -0.03em, perché i font display a corpo grande hanno troppo aria tra le lettere. È il trucco di Vogue, di Wired, di ogni magazine che si rispetti.",
        instruction:
            "Aggiungi al body: line-height: 1.6; Aggiungi all'h1: line-height: 1.1; letter-spacing: -0.03em; Aggiungi una nuova rule .lede { line-height: 1.5; color: #555; } (mantieni il font-size già impostato).",
        hint: "Body line-height 1.6 (lettura comoda). H1 line-height 1.1 + letter-spacing -0.03em (compattezza editoriale). Lede line-height 1.5 + color #555 (un grigio caldo).",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slow — il magazine che respira</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&display=swap');

      :root {
        --text-xs: 0.8rem;
        --text-sm: 1rem;
        --text-base: 1.25rem;
        --text-lg: 1.563rem;
        --text-xl: 3.052rem;
      }

      body {
        font-family: 'Inter', system-ui, sans-serif;
        color: #1a1a1a;
        max-width: 680px;
        margin: 4rem auto;
        padding: 0 1.5rem;
        line-height: 1.6;
      }

      h1 {
        font-family: 'Fraunces', Georgia, serif;
        font-size: var(--text-xl);
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.03em;
      }

      .kicker { font-size: var(--text-xs); }
      .lede {
        font-size: var(--text-base);
        line-height: 1.5;
        color: #555;
      }
      .byline { font-size: var(--text-sm); }
    </style>
  </head>
  <body>
    <article class="hero">
      <p class="kicker">Numero 12 — Primavera</p>
      <h1>"Vivere lentamente non significa fare meno."</h1>
      <p class="lede">È la rivista di chi ha smesso di rincorrere il tempo e ha iniziato ad abitarlo. Storie, ricette, persone, paesaggi.</p>
      <p class="byline">di Edoardo Marchi</p>
    </article>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "computedStyle",
                    selector: "body",
                    property: "line-height",
                    value: "25",
                    message:
                        "Il body deve avere line-height 1.6 (≈ 25.6px su 16px base).",
                },
                {
                    type: "computedStyle",
                    selector: "h1",
                    property: "letter-spacing",
                    value: "-1",
                    message:
                        "L'h1 deve avere letter-spacing: -0.03em (negativo per stringere il display).",
                },
            ],
            message:
                "Leading 1.6 sul body, 1.1 sull'h1 + tracking negativo per compattezza.",
        },
        successScript:
            "Guarda l'h1 ora: le lettere si toccano quasi, sembra scolpito. È quella che i typografi chiamano \"black\" — un titolo che ha peso ottico anche senza essere bold. È il trucco che fa sembrare la tua pagina disegnata da un Art Director vero.",
        encourageScript:
            "Tre line-height: body 1.6, h1 1.1, lede 1.5. Sull'h1 aggiungi anche letter-spacing -0.03em. Sul lede aggiungi color #555.",
    },

    {
        order: 4,
        slug: "vertical-rhythm",
        title: "Ritmo verticale su baseline 8px",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Sai perché la pagina di un libro stampato è così rilassante da leggere? Tutto è allineato a una griglia invisibile — la baseline. Ogni margine è un multiplo della stessa unità. Sul web fai lo stesso: scegli 8px come unità (la stessa di Material, di Apple HIG, di praticamente ogni design system serio) e tutti i margini diventano 8, 16, 24, 32, 48, 64. Il risultato? Una pagina che respira con un ritmo costante, anche se l'occhio non sa spiegare perché.",
        instruction:
            "Aggiungi una variabile in :root: --rhythm: 8px;. Poi: .kicker { margin: 0 0 calc(var(--rhythm) * 2) 0; text-transform: uppercase; letter-spacing: 0.15em; color: #888; } h1 { margin: 0 0 calc(var(--rhythm) * 3) 0; } .lede { margin: 0 0 calc(var(--rhythm) * 4) 0; } .byline { margin: 0; color: #888; }",
        hint: "Una variabile --rhythm: 8px. Poi tutti i margin-bottom sono multipli: kicker × 2 (16px), h1 × 3 (24px), lede × 4 (32px). Aggiungi anche kicker uppercase + letter-spacing 0.15em (lo stile \"label\" delle riviste).",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slow — il magazine che respira</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&display=swap');

      :root {
        --text-xs: 0.8rem;
        --text-sm: 1rem;
        --text-base: 1.25rem;
        --text-lg: 1.563rem;
        --text-xl: 3.052rem;
        --rhythm: 8px;
      }

      body {
        font-family: 'Inter', system-ui, sans-serif;
        color: #1a1a1a;
        max-width: 680px;
        margin: 4rem auto;
        padding: 0 1.5rem;
        line-height: 1.6;
      }

      h1 {
        font-family: 'Fraunces', Georgia, serif;
        font-size: var(--text-xl);
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.03em;
        margin: 0 0 calc(var(--rhythm) * 3) 0;
      }

      .kicker {
        font-size: var(--text-xs);
        margin: 0 0 calc(var(--rhythm) * 2) 0;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #888;
      }
      .lede {
        font-size: var(--text-base);
        line-height: 1.5;
        color: #555;
        margin: 0 0 calc(var(--rhythm) * 4) 0;
      }
      .byline {
        font-size: var(--text-sm);
        margin: 0;
        color: #888;
      }
    </style>
  </head>
  <body>
    <article class="hero">
      <p class="kicker">Numero 12 — Primavera</p>
      <h1>"Vivere lentamente non significa fare meno."</h1>
      <p class="lede">È la rivista di chi ha smesso di rincorrere il tempo e ha iniziato ad abitarlo. Storie, ricette, persone, paesaggi.</p>
      <p class="byline">di Edoardo Marchi</p>
    </article>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "--rhythm",
                    flexible: true,
                    message:
                        "Devi definire la variabile --rhythm: 8px in :root.",
                },
                {
                    type: "computedStyle",
                    selector: "h1",
                    property: "margin-bottom",
                    value: "24px",
                    message:
                        "L'h1 deve avere margin-bottom 24px (3 × 8px di baseline).",
                },
                {
                    type: "computedStyle",
                    selector: ".kicker",
                    property: "text-transform",
                    value: "uppercase",
                    message:
                        "Il .kicker deve essere text-transform uppercase (stile label da magazine).",
                },
            ],
            message:
                "Margini multipli di 8px + kicker uppercase con tracking aperto.",
        },
        successScript:
            "Scrolla la pagina mentalmente: ogni elemento è alla distanza giusta dal successivo. Non c'è un margine random. È quella sensazione di \"pagina pulita\" che senti aprendo Apress o un editoriale del NYT — il ritmo verticale costante.",
        encourageScript:
            "Variabile --rhythm: 8px. Poi: kicker margin-bottom calc(--rhythm × 2) + uppercase + letter-spacing 0.15em + color #888. H1 margin-bottom × 3. Lede margin-bottom × 4. Byline margin 0 + color #888.",
    },

    // ────────────── MODULO 3: DETTAGLI EDITORIALI ────────────────────────
    {
        order: 5,
        slug: "italics-smallcaps",
        title: "Italics e smallcaps al posto del bold",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "I designer alle prime armi hanno un riflesso: enfasi = bold. Sbagliato. Il bold è urlato, brutale. Le riviste vere — Vogue, The New Yorker, Apress — usano due strumenti molto più raffinati: italics per il tono, smallcaps per le label. L'italic dà inflessione alla voce, come quando in conversazione abbassi un tono per fare una parentesi. Le smallcaps (sigle, nomi, label) hanno autorevolezza tipografica senza pesantezza visiva. Applichiamoli subito.",
        instruction:
            "Modifica il <p class=\"byline\"> in: <p class=\"byline\">di <span class=\"author\">Edoardo Marchi</span></p>. Poi nel CSS aggiungi: .author { font-variant: small-caps; letter-spacing: 0.08em; color: #1a1a1a; } .lede em, .lede i { font-style: italic; font-family: 'Fraunces', Georgia, serif; }. E nel testo del .lede sostituisci \"abitarlo\" con <em>abitarlo</em>.",
        hint: "Tre cose: 1) wrap \"Edoardo Marchi\" in uno <span class=\"author\">. 2) CSS .author con font-variant small-caps + letter-spacing 0.08em. 3) <em>abitarlo</em> nel lede + CSS .lede em che usa Fraunces in italic per il contrast.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slow — il magazine che respira</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&display=swap');

      :root {
        --text-xs: 0.8rem;
        --text-sm: 1rem;
        --text-base: 1.25rem;
        --text-lg: 1.563rem;
        --text-xl: 3.052rem;
        --rhythm: 8px;
      }

      body {
        font-family: 'Inter', system-ui, sans-serif;
        color: #1a1a1a;
        max-width: 680px;
        margin: 4rem auto;
        padding: 0 1.5rem;
        line-height: 1.6;
      }

      h1 {
        font-family: 'Fraunces', Georgia, serif;
        font-size: var(--text-xl);
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.03em;
        margin: 0 0 calc(var(--rhythm) * 3) 0;
      }

      .kicker {
        font-size: var(--text-xs);
        margin: 0 0 calc(var(--rhythm) * 2) 0;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #888;
      }
      .lede {
        font-size: var(--text-base);
        line-height: 1.5;
        color: #555;
        margin: 0 0 calc(var(--rhythm) * 4) 0;
      }
      .lede em, .lede i {
        font-style: italic;
        font-family: 'Fraunces', Georgia, serif;
      }
      .byline {
        font-size: var(--text-sm);
        margin: 0;
        color: #888;
      }
      .author {
        font-variant: small-caps;
        letter-spacing: 0.08em;
        color: #1a1a1a;
      }
    </style>
  </head>
  <body>
    <article class="hero">
      <p class="kicker">Numero 12 — Primavera</p>
      <h1>"Vivere lentamente non significa fare meno."</h1>
      <p class="lede">È la rivista di chi ha smesso di rincorrere il tempo e ha iniziato ad <em>abitarlo</em>. Storie, ricette, persone, paesaggi.</p>
      <p class="byline">di <span class="author">Edoardo Marchi</span></p>
    </article>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: ".byline .author",
                    existsOnly: true,
                    message:
                        "Manca <span class=\"author\"> dentro la byline.",
                },
                {
                    type: "computedStyle",
                    selector: ".author",
                    property: "font-variant-caps",
                    value: "small-caps",
                    message:
                        "Lo .author deve avere font-variant: small-caps.",
                },
                {
                    type: "querySelector",
                    selector: ".lede em",
                    existsOnly: true,
                    message:
                        "Manca <em>abitarlo</em> dentro il .lede per l'enfasi italic.",
                },
            ],
            message:
                "Smallcaps sull'autore + italic Fraunces per l'enfasi nel lede.",
        },
        successScript:
            "L'italic di Fraunces ha quasi un suono — leggi \"abitarlo\" e senti il tono cambiare. Le smallcaps sull'autore danno autorevolezza senza urlare. È così che le riviste serie costruiscono gerarchia: con sussurri tipografici, non con bold sparati.",
        encourageScript:
            "Wrap \"Edoardo Marchi\" in <span class=\"author\">. CSS .author con font-variant small-caps + letter-spacing 0.08em + color #1a1a1a. Wrap \"abitarlo\" in <em>. CSS .lede em con font-style italic + font-family Fraunces.",
    },

    {
        order: 6,
        slug: "drop-cap",
        title: "Drop cap: la prima lettera che apre la pagina",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "Apri qualsiasi numero del New Yorker. Il primo capoverso ha una capolettera che scende dentro il testo come negli incunaboli del '500. È il drop cap, e non è folklore — è un segnale tipografico potente: \"questo è l'inizio\". CSS lo fa con un selettore magico, ::first-letter, che pesca proprio quel carattere e lo stila in autonomia. Float left e diventa una capolettera vera, di tre righe, che apre il lede come una porta.",
        instruction:
            "Aggiungi al CSS: .lede::first-letter { font-family: 'Fraunces', Georgia, serif; font-size: 4.5rem; font-weight: 600; float: left; line-height: 0.85; padding: 0.4rem 0.6rem 0 0; color: #1a1a1a; }",
        hint: "Una sola rule: .lede::first-letter. Font Fraunces 4.5rem font-weight 600, float left, line-height 0.85 (per non sfondare), padding 0.4rem 0.6rem 0 0 (per dare aria al testo che le si avvolge intorno).",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slow — il magazine che respira</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&display=swap');

      :root {
        --text-xs: 0.8rem;
        --text-sm: 1rem;
        --text-base: 1.25rem;
        --text-lg: 1.563rem;
        --text-xl: 3.052rem;
        --rhythm: 8px;
      }

      body {
        font-family: 'Inter', system-ui, sans-serif;
        color: #1a1a1a;
        max-width: 680px;
        margin: 4rem auto;
        padding: 0 1.5rem;
        line-height: 1.6;
      }

      h1 {
        font-family: 'Fraunces', Georgia, serif;
        font-size: var(--text-xl);
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.03em;
        margin: 0 0 calc(var(--rhythm) * 3) 0;
      }

      .kicker {
        font-size: var(--text-xs);
        margin: 0 0 calc(var(--rhythm) * 2) 0;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #888;
      }
      .lede {
        font-size: var(--text-base);
        line-height: 1.5;
        color: #555;
        margin: 0 0 calc(var(--rhythm) * 4) 0;
      }
      .lede::first-letter {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 4.5rem;
        font-weight: 600;
        float: left;
        line-height: 0.85;
        padding: 0.4rem 0.6rem 0 0;
        color: #1a1a1a;
      }
      .lede em, .lede i {
        font-style: italic;
        font-family: 'Fraunces', Georgia, serif;
      }
      .byline {
        font-size: var(--text-sm);
        margin: 0;
        color: #888;
      }
      .author {
        font-variant: small-caps;
        letter-spacing: 0.08em;
        color: #1a1a1a;
      }
    </style>
  </head>
  <body>
    <article class="hero">
      <p class="kicker">Numero 12 — Primavera</p>
      <h1>"Vivere lentamente non significa fare meno."</h1>
      <p class="lede">È la rivista di chi ha smesso di rincorrere il tempo e ha iniziato ad <em>abitarlo</em>. Storie, ricette, persone, paesaggi.</p>
      <p class="byline">di <span class="author">Edoardo Marchi</span></p>
    </article>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "::first-letter",
                    flexible: true,
                    message:
                        "Devi usare il selettore ::first-letter sul .lede.",
                },
                {
                    type: "textIncludes",
                    needle: "float: left",
                    flexible: true,
                    message:
                        "La capolettera deve avere float: left per farsi avvolgere dal testo.",
                },
                {
                    type: "textIncludes",
                    needle: "4.5rem",
                    flexible: true,
                    message:
                        "La capolettera deve essere font-size: 4.5rem per scendere su tre righe.",
                },
            ],
            message:
                "Drop cap su .lede::first-letter — float left, 4.5rem, Fraunces.",
        },
        successScript:
            "La \"È\" adesso scende dentro il testo come nei libri stampati seri. È il dettaglio che, da solo, dice \"qui c'è cura editoriale\". Il New Yorker lo fa da 100 anni, Apress lo fa nel digitale. Tu adesso pure.",
        encourageScript:
            "Selettore .lede::first-letter. Dentro: font-family Fraunces, font-size 4.5rem, font-weight 600, float left, line-height 0.85, padding 0.4rem 0.6rem 0 0.",
    },

    {
        order: 7,
        slug: "hanging-punctuation",
        title: "Hanging punctuation: le virgolette fuori dal margine",
        durationSec: 95,
        avatarMood: "talking",
        script:
            "Guarda l'h1: comincia con una virgoletta. Tipograficamente quella virgoletta crea un piccolo \"buco ottico\" — il margine sembra rientrato proprio lì. Le riviste vere lo risolvono con un trucco antichissimo: la hanging punctuation. La virgoletta esce fuori dal margine sinistro, così il testo vero comincia perfettamente allineato. È un margine negativo, una riga di CSS, e tutto torna in asse. Wired, NYT, Apress lo fanno tutti.",
        instruction:
            "Aggiungi al CSS: h1 { text-indent: -0.45em; } (mantieni tutte le altre proprietà h1 già definite — devi aggiungere SOLO questa riga dentro la rule h1 esistente).",
        hint: "Aggiungi text-indent: -0.45em alla rule h1 (oltre alle proprietà già presenti). Il valore negativo \"tira fuori\" la prima riga dal margine, includendo la virgoletta iniziale.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slow — il magazine che respira</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&display=swap');

      :root {
        --text-xs: 0.8rem;
        --text-sm: 1rem;
        --text-base: 1.25rem;
        --text-lg: 1.563rem;
        --text-xl: 3.052rem;
        --rhythm: 8px;
      }

      body {
        font-family: 'Inter', system-ui, sans-serif;
        color: #1a1a1a;
        max-width: 680px;
        margin: 4rem auto;
        padding: 0 1.5rem;
        line-height: 1.6;
      }

      h1 {
        font-family: 'Fraunces', Georgia, serif;
        font-size: var(--text-xl);
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.03em;
        margin: 0 0 calc(var(--rhythm) * 3) 0;
        text-indent: -0.45em;
      }

      .kicker {
        font-size: var(--text-xs);
        margin: 0 0 calc(var(--rhythm) * 2) 0;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #888;
      }
      .lede {
        font-size: var(--text-base);
        line-height: 1.5;
        color: #555;
        margin: 0 0 calc(var(--rhythm) * 4) 0;
      }
      .lede::first-letter {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 4.5rem;
        font-weight: 600;
        float: left;
        line-height: 0.85;
        padding: 0.4rem 0.6rem 0 0;
        color: #1a1a1a;
      }
      .lede em, .lede i {
        font-style: italic;
        font-family: 'Fraunces', Georgia, serif;
      }
      .byline {
        font-size: var(--text-sm);
        margin: 0;
        color: #888;
      }
      .author {
        font-variant: small-caps;
        letter-spacing: 0.08em;
        color: #1a1a1a;
      }
    </style>
  </head>
  <body>
    <article class="hero">
      <p class="kicker">Numero 12 — Primavera</p>
      <h1>"Vivere lentamente non significa fare meno."</h1>
      <p class="lede">È la rivista di chi ha smesso di rincorrere il tempo e ha iniziato ad <em>abitarlo</em>. Storie, ricette, persone, paesaggi.</p>
      <p class="byline">di <span class="author">Edoardo Marchi</span></p>
    </article>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "computedStyle",
                    selector: "h1",
                    property: "text-indent",
                    value: "-",
                    message:
                        "L'h1 deve avere text-indent negativo (-0.45em) per la hanging punctuation.",
                },
                {
                    type: "computedStyle",
                    selector: "h1",
                    property: "font-family",
                    value: "Fraunces",
                    message:
                        "Verifica di non aver perso le altre proprietà h1 — Fraunces deve restare il font.",
                },
            ],
            message:
                "Hanging punctuation sull'h1 con text-indent negativo, virgoletta fuori dal margine.",
        },
        successScript:
            "Confronta prima e dopo: la \"V\" di \"Vivere\" adesso è perfettamente allineata al margine sinistro, e la virgoletta sporge a sinistra. È un dettaglio quasi invisibile a chi non sa cosa cercare — e quello è esattamente il punto. Sono i micro-aggiustamenti che rendono la pagina \"giusta\".",
        encourageScript:
            "Aggiungi UNA riga dentro la rule h1 esistente: text-indent: -0.45em. Non toccare le altre proprietà.",
    },

    // ────────────── MODULO 4: VARIABLE FONTS ─────────────────────────────
    {
        order: 8,
        slug: "variable-font",
        title: "Variable font: il peso che reagisce",
        durationSec: 130,
        avatarMood: "happy",
        script:
            "Ultima carta. Fraunces non è un font normale: è un variable font. Vuol dire che il \"peso\" non è 400 o 600, ma un valore continuo da 100 a 900. Puoi anche manipolare in tempo reale l'asse opsz (optical size) e altri assi. Quindi possiamo fare una cosa che sui font statici è impossibile: il titolo che si fa più grasso quando ci passi sopra il mouse. Una transizione smooth da 400 a 700 con font-variation-settings, transition di 600ms, e l'h1 diventa interattivo. Tipografia che reagisce — il 2026 chiama.",
        instruction:
            "Modifica la rule h1 sostituendo font-weight: 400 con font-variation-settings: 'wght' 400, 'opsz' 144; e aggiungi: transition: font-variation-settings 600ms ease, letter-spacing 600ms ease; cursor: pointer; Poi aggiungi una nuova rule: h1:hover { font-variation-settings: 'wght' 700, 'opsz' 144; letter-spacing: -0.04em; }",
        hint: "Sull'h1: rimuovi font-weight 400 e mettici font-variation-settings 'wght' 400, 'opsz' 144. Aggiungi transition di 600ms su font-variation-settings e letter-spacing. Poi una nuova rule h1:hover che porta wght a 700 e letter-spacing a -0.04em.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slow — il magazine che respira</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&display=swap');

      :root {
        --text-xs: 0.8rem;
        --text-sm: 1rem;
        --text-base: 1.25rem;
        --text-lg: 1.563rem;
        --text-xl: 3.052rem;
        --rhythm: 8px;
      }

      body {
        font-family: 'Inter', system-ui, sans-serif;
        color: #1a1a1a;
        max-width: 680px;
        margin: 4rem auto;
        padding: 0 1.5rem;
        line-height: 1.6;
      }

      h1 {
        font-family: 'Fraunces', Georgia, serif;
        font-size: var(--text-xl);
        font-variation-settings: 'wght' 400, 'opsz' 144;
        line-height: 1.1;
        letter-spacing: -0.03em;
        margin: 0 0 calc(var(--rhythm) * 3) 0;
        text-indent: -0.45em;
        transition: font-variation-settings 600ms ease, letter-spacing 600ms ease;
        cursor: pointer;
      }

      h1:hover {
        font-variation-settings: 'wght' 700, 'opsz' 144;
        letter-spacing: -0.04em;
      }

      .kicker {
        font-size: var(--text-xs);
        margin: 0 0 calc(var(--rhythm) * 2) 0;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #888;
      }
      .lede {
        font-size: var(--text-base);
        line-height: 1.5;
        color: #555;
        margin: 0 0 calc(var(--rhythm) * 4) 0;
      }
      .lede::first-letter {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 4.5rem;
        font-weight: 600;
        float: left;
        line-height: 0.85;
        padding: 0.4rem 0.6rem 0 0;
        color: #1a1a1a;
      }
      .lede em, .lede i {
        font-style: italic;
        font-family: 'Fraunces', Georgia, serif;
      }
      .byline {
        font-size: var(--text-sm);
        margin: 0;
        color: #888;
      }
      .author {
        font-variant: small-caps;
        letter-spacing: 0.08em;
        color: #1a1a1a;
      }
    </style>
  </head>
  <body>
    <article class="hero">
      <p class="kicker">Numero 12 — Primavera</p>
      <h1>"Vivere lentamente non significa fare meno."</h1>
      <p class="lede">È la rivista di chi ha smesso di rincorrere il tempo e ha iniziato ad <em>abitarlo</em>. Storie, ricette, persone, paesaggi.</p>
      <p class="byline">di <span class="author">Edoardo Marchi</span></p>
    </article>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "font-variation-settings",
                    flexible: true,
                    message:
                        "Devi usare font-variation-settings sull'h1 (e su h1:hover).",
                },
                {
                    type: "textIncludes",
                    needle: "h1:hover",
                    flexible: true,
                    message:
                        "Manca la rule h1:hover che cambia il peso variabile.",
                },
                {
                    type: "computedStyle",
                    selector: "h1",
                    property: "cursor",
                    value: "pointer",
                    message:
                        "L'h1 deve avere cursor: pointer per indicare che è interattivo.",
                },
                {
                    type: "textIncludes",
                    needle: "transition",
                    flexible: true,
                    message:
                        "Devi aggiungere una transition (600ms) per animare il cambio di peso.",
                },
            ],
            message:
                "Variable font con peso animato in hover via font-variation-settings + transition.",
        },
        successScript:
            "FINITO. Passa il mouse sul titolo: il peso scivola da 400 a 700, le lettere si stringono, il tutto in 600 millisecondi morbidi. Hai costruito una hero editoriale completa: pairing, scala modulare, ritmo, italics, smallcaps, drop cap, hanging punctuation, variable font. Edoardo è felice. Slow ha la voce che cercava. E tu adesso sai perché Vogue, NYT, Wired sembrano fatti meglio del 99% del web — sono questi otto dettagli, niente di più.",
        encourageScript:
            "Sull'h1: cambia font-weight 400 in font-variation-settings: 'wght' 400, 'opsz' 144. Aggiungi transition: font-variation-settings 600ms ease, letter-spacing 600ms ease + cursor: pointer. Nuova rule h1:hover { font-variation-settings: 'wght' 700, 'opsz' 144; letter-spacing: -0.04em; }.",
    },
];

tipografiaDesignCourse.lessons = lessons;
tipografiaDesignCourse.finalCode =
    lessons[lessons.length - 1].expectedSnapshot;
