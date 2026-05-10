/**
 * Corso "tailwind-utility-first": dal markup nudo a una landing
 * SaaS completa usando solo utility classes.
 *
 * Persona: Maya, sviluppatrice fullstack che ha appena lanciato
 * "Pulse" (app fitness). Le serve una landing che converta — niente
 * tempo per file CSS giganti, niente designer, solo lei e Tailwind.
 *
 * Filosofia design: ogni lezione introduce un set di utilities
 * mirate, costruendo cumulativamente una pagina pubblicabile.
 *
 * Sequenza:
 *   M1: Setup + tipografia (lezioni 1-2)
 *   M2: Layout flex/grid responsive (lezioni 3-5)
 *   M3: Componenti riusabili (lezioni 6-7)
 *   M4: Polish: dark mode + animazioni (lezione 8)
 */
import type { Lesson, PlayCourse } from "@/data/play/types";

export const tailwindUtilityFirstCourse: PlayCourse = {
    slug: "tailwind-utility-first",
    title: "Tailwind CSS: il modo moderno di vestire un sito",
    subtitle:
        "Utility classes, design tokens, dark mode. Niente più file CSS giganti, design coerente per default.",
    description:
        "Tailwind nel 2026 è quello che era jQuery nel 2010: ovunque. In 8 lezioni costruirai la landing del SaaS \"Pulse\" — una vera app fitness — usando solo utility classes. Header sticky, hero con CTA, griglia features, pricing tiers, footer, dark mode, micro-animazioni. Alla fine avrai un sito pubblicabile e capirai perché chi usa Tailwind non torna più indietro.",
    level: "intermedio",
    subjects: ["css"],
    durationMin: 75,
    status: "live",
    initialCode: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulse — Allenati come ti pare</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <!-- la landing si costruisce qui -->
  </body>
</html>`,
    finalCode: "",
    modules: [
        {
            order: 1,
            slug: "setup-tipografia",
            title: "Setup + tipografia",
            summary:
                "Tailwind via CDN, body con sfondo, prime utility classes per testo grande e centrato.",
        },
        {
            order: 2,
            slug: "layout-responsive",
            title: "Layout flex e grid",
            summary:
                "Hero con CTA, griglia features con auto-fit, breakpoints responsive (sm/md/lg).",
        },
        {
            order: 3,
            slug: "componenti",
            title: "Componenti riusabili",
            summary:
                "Card con shadow + hover-lift, pricing tiers con variant primary, header sticky.",
        },
        {
            order: 4,
            slug: "polish",
            title: "Polish: dark mode + animazioni",
            summary:
                "Dark mode con classe `dark:`, micro-animazioni con animate-* e transition utilities.",
        },
    ],
    lessons: [],
};

const lessons: Lesson[] = [
    // ────────────── MODULO 1: SETUP + TIPOGRAFIA ─────────────────────────
    {
        order: 1,
        slug: "first-utilities",
        title: "Le prime utility: il body prende vita",
        durationSec: 90,
        avatarMood: "talking",
        script:
            "Tailwind non è altro che migliaia di classi minuscole, ognuna fa una cosa sola. Mettiamole subito sul body: bg-slate-50 per uno sfondo grigio chiarissimo, text-slate-900 per il colore del testo, font-sans per il font di sistema, antialiased per renderlo morbido. Niente CSS scritto a mano, solo classi.",
        instruction:
            "Dentro <body class=\"...\"> aggiungi queste utility: bg-slate-50 text-slate-900 font-sans antialiased",
        hint: "<body class=\"bg-slate-50 text-slate-900 font-sans antialiased\">. Sono 4 classi separate da spazi, tutte sul tag body.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulse — Allenati come ti pare</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <!-- la landing si costruisce qui -->
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "body.bg-slate-50",
                    existsOnly: true,
                    message: "Il body deve avere la classe bg-slate-50.",
                },
                {
                    type: "querySelector",
                    selector: "body.text-slate-900.font-sans.antialiased",
                    existsOnly: true,
                    message:
                        "Il body deve avere anche text-slate-900, font-sans e antialiased.",
                },
            ],
            message: "Body con 4 utility: bg, text, font, antialiased.",
        },
        successScript:
            "4 classi e abbiamo già stile. Niente file CSS, niente regole personalizzate. La filosofia di Tailwind in 5 secondi.",
        encourageScript:
            "Sul tag body aggiungi class con 4 utility separate da spazio: bg-slate-50, text-slate-900, font-sans, antialiased.",
    },

    {
        order: 2,
        slug: "hero-typography",
        title: "Hero: il titolo che cattura",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "Ogni landing che converte ha la stessa cosa in alto: un titolo enorme, breve, che ti dice subito di cosa si tratta. Lo costruiamo. text-5xl per la grandezza, md:text-7xl che lo fa esplodere sul desktop, font-bold pesante, tracking-tight che stringe le lettere. Sotto, una riga di sottotitolo più piccola che spiega in una frase. Cinque utility, un titolo che cattura.",
        instruction:
            "Dentro <body>, aggiungi: <header class=\"px-6 py-20 max-w-4xl mx-auto text-center\"><h1 class=\"text-5xl md:text-7xl font-bold tracking-tight leading-none\">Allenati come ti pare.</h1><p class=\"mt-6 text-lg text-slate-600\">L'app fitness che si adatta a te, non il contrario.</p></header>",
        hint: "Un <header> con padding e max-width centrato (mx-auto), dentro un h1 grande responsive (text-5xl md:text-7xl) e un p più piccolo (text-lg) grigio (text-slate-600).",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulse — Allenati come ti pare</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <header class="px-6 py-20 max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-none">Allenati come ti pare.</h1>
      <p class="mt-6 text-lg text-slate-600">L'app fitness che si adatta a te, non il contrario.</p>
    </header>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "header h1.text-5xl",
                    existsOnly: true,
                    message: "Manca h1 con text-5xl dentro un header.",
                },
                {
                    type: "querySelector",
                    selector: "header.max-w-4xl.mx-auto.text-center",
                    existsOnly: true,
                    message:
                        "L'header deve avere max-w-4xl, mx-auto e text-center.",
                },
            ],
            message: "Hero con h1 grande responsive + sottotitolo grigio.",
        },
        successScript:
            "Tieni d'occhio il `md:text-7xl` — quel `md:` è il prefisso responsive. Sotto i 768px usa text-5xl, sopra esplode in 7xl. Ridimensiona la finestra e guarda.",
        encourageScript:
            "Header padding-x-6 py-20 max-w-4xl mx-auto text-center. Dentro h1 con text-5xl md:text-7xl font-bold tracking-tight leading-none, p con mt-6 text-lg text-slate-600.",
    },

    // ────────────── MODULO 2: LAYOUT FLEX & GRID ─────────────────────────
    {
        order: 3,
        slug: "hero-cta",
        title: "Il bottone CTA: il click che conta",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "Un hero senza call-to-action è solo decorazione. Aggiungiamo un bottone con tutte le utility che rendono un CTA convincente: bg-indigo-600 per il colore primario, text-white, px-8 py-4 per il padding generoso, rounded-full per la forma a pillola, font-semibold, e un effetto hover che cambia colore. Bonus: shadow-lg per dare profondità.",
        instruction:
            "Dopo il <p> dentro il <header>, aggiungi: <button class=\"mt-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors\">Prova gratis 30 giorni</button>",
        hint: "Bottone con classi: mt-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors. Le hover:* sono varianti che si attivano al passaggio del mouse.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulse — Allenati come ti pare</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <header class="px-6 py-20 max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-none">Allenati come ti pare.</h1>
      <p class="mt-6 text-lg text-slate-600">L'app fitness che si adatta a te, non il contrario.</p>
      <button class="mt-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors">Prova gratis 30 giorni</button>
    </header>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "header button.bg-indigo-600.text-white.rounded-full",
                    existsOnly: true,
                    message:
                        "Manca <button> con bg-indigo-600, text-white, rounded-full nell'header.",
                },
                {
                    type: "querySelector",
                    selector: "button.shadow-lg.transition-colors",
                    existsOnly: true,
                    message:
                        "Il bottone deve avere shadow-lg e transition-colors.",
                },
            ],
            message: "CTA bottone con colore primario, pillola, ombra e hover.",
        },
        successScript:
            "Passa il mouse sul bottone: il colore cambia smooth grazie a transition-colors. L'utility `hover:bg-indigo-700` è una variant — Tailwind ne ha decine: focus, active, dark, group-hover...",
        encourageScript:
            "Aggiungi <button> dopo il <p>. Classi: mt-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors.",
    },

    {
        order: 4,
        slug: "features-grid",
        title: "Sezione features: 3 colonne con grid",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Le persone che leggono la tua landing si chiedono una cosa sola: \"perché dovrei usarlo?\" La risposta sono i 3 vantaggi del prodotto, in 3 card affiancate. Tailwind lo rende banale: grid-cols-1 sul telefono, md:grid-cols-3 sul desktop. Una sola classe, layout responsive. Niente media query da scrivere.",
        instruction:
            "Dopo </header>, aggiungi: <section class=\"px-6 py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8\"><div class=\"p-6 bg-white rounded-2xl shadow\"><h3 class=\"text-xl font-bold\">Workout su misura</h3><p class=\"mt-2 text-slate-600\">Piani che si adattano al tuo livello, ogni settimana.</p></div><div class=\"p-6 bg-white rounded-2xl shadow\"><h3 class=\"text-xl font-bold\">Tracking automatico</h3><p class=\"mt-2 text-slate-600\">Apple Watch, Garmin, manual logging — tutto sincronizzato.</p></div><div class=\"p-6 bg-white rounded-2xl shadow\"><h3 class=\"text-xl font-bold\">Coach AI 24/7</h3><p class=\"mt-2 text-slate-600\">Domande sull'allenamento, alimentazione, recupero. Risposte in italiano.</p></div></section>",
        hint: "Section grid con grid-cols-1 md:grid-cols-3 gap-8. Dentro 3 div uguali con p-6 bg-white rounded-2xl shadow, ognuno con h3 (text-xl font-bold) e p (mt-2 text-slate-600).",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulse — Allenati come ti pare</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <header class="px-6 py-20 max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-none">Allenati come ti pare.</h1>
      <p class="mt-6 text-lg text-slate-600">L'app fitness che si adatta a te, non il contrario.</p>
      <button class="mt-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors">Prova gratis 30 giorni</button>
    </header>
    <section class="px-6 py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-6 bg-white rounded-2xl shadow">
        <h3 class="text-xl font-bold">Workout su misura</h3>
        <p class="mt-2 text-slate-600">Piani che si adattano al tuo livello, ogni settimana.</p>
      </div>
      <div class="p-6 bg-white rounded-2xl shadow">
        <h3 class="text-xl font-bold">Tracking automatico</h3>
        <p class="mt-2 text-slate-600">Apple Watch, Garmin, manual logging — tutto sincronizzato.</p>
      </div>
      <div class="p-6 bg-white rounded-2xl shadow">
        <h3 class="text-xl font-bold">Coach AI 24/7</h3>
        <p class="mt-2 text-slate-600">Domande sull'allenamento, alimentazione, recupero. Risposte in italiano.</p>
      </div>
    </section>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "section.grid.md\\:grid-cols-3",
                    existsOnly: true,
                    message:
                        "Manca <section> con grid e md:grid-cols-3.",
                },
                {
                    type: "querySelector",
                    selector: "section > div:nth-of-type(3)",
                    existsOnly: true,
                    message: "Servono 3 div figli della section.",
                },
            ],
            message: "Section grid responsive con 3 feature cards.",
        },
        successScript:
            "Stringi la finestra: sotto i 768px le card collassano in colonna singola. È il responsive moderno di Tailwind — niente media query, le scrive il framework per te.",
        encourageScript:
            "Section con classi grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-16 max-w-5xl mx-auto. Dentro 3 div con p-6 bg-white rounded-2xl shadow, ognuno con h3 e p.",
    },

    {
        order: 5,
        slug: "hover-lift",
        title: "Card che si sollevano al passaggio del mouse",
        durationSec: 90,
        avatarMood: "talking",
        script:
            "Le card sono statiche. Diamogli vita con il classico effetto hover-lift: al passaggio del mouse si sollevano leggermente e l'ombra si fa più morbida. Aggiungiamo a ogni card hover:-translate-y-1 e hover:shadow-xl, più transition-all per rendere il movimento smooth.",
        instruction:
            "Modifica le tre <div> della section: aggiungi a ognuna le classi `hover:-translate-y-1 hover:shadow-xl transition-all`. Quindi <div class=\"p-6 bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all\">.",
        hint: "A tutte e 3 le div nella section, aggiungi hover:-translate-y-1 hover:shadow-xl transition-all. La transition-all fa sì che ogni cambio (translate, shadow) sia animato.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulse — Allenati come ti pare</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <header class="px-6 py-20 max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-none">Allenati come ti pare.</h1>
      <p class="mt-6 text-lg text-slate-600">L'app fitness che si adatta a te, non il contrario.</p>
      <button class="mt-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors">Prova gratis 30 giorni</button>
    </header>
    <section class="px-6 py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-6 bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Workout su misura</h3>
        <p class="mt-2 text-slate-600">Piani che si adattano al tuo livello, ogni settimana.</p>
      </div>
      <div class="p-6 bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Tracking automatico</h3>
        <p class="mt-2 text-slate-600">Apple Watch, Garmin, manual logging — tutto sincronizzato.</p>
      </div>
      <div class="p-6 bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Coach AI 24/7</h3>
        <p class="mt-2 text-slate-600">Domande sull'allenamento, alimentazione, recupero. Risposte in italiano.</p>
      </div>
    </section>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector:
                        "section > div.hover\\:-translate-y-1.hover\\:shadow-xl.transition-all",
                    existsOnly: true,
                    message:
                        "Le card devono avere hover:-translate-y-1, hover:shadow-xl, transition-all.",
                },
            ],
            message: "Card con effetto hover-lift e transizione smooth.",
        },
        successScript:
            "Passa il mouse sopra una card: si solleva di 4 pixel e l'ombra si fa più larga. È il classico micro-movimento che separa un sito amatoriale da uno fatto bene.",
        encourageScript:
            "A ognuna delle 3 div della section, aggiungi alle classi: hover:-translate-y-1 hover:shadow-xl transition-all.",
    },

    // ────────────── MODULO 3: COMPONENTI ─────────────────────────────────
    {
        order: 6,
        slug: "pricing-tiers",
        title: "Pricing tiers: Free, Pro, Team",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Questa è la sezione che fa girare i soldi: i prezzi. Tre piani, e quello centrale in evidenza con la label \"Più scelto\" — psicologia da manuale, l'occhio cade lì e tu vendi quello. Stessa struttura per tutte e tre, solo qualche classe diversa per la primary. Tailwind te lo rende facile: bg-indigo-600 invece di bg-white, ring-4 per l'aura colorata, badge absolute con la scritta.",
        instruction:
            "Dopo la </section>, aggiungi: <section class=\"px-6 py-16 max-w-5xl mx-auto\"><h2 class=\"text-4xl font-bold text-center mb-12\">Scegli il tuo piano</h2><div class=\"grid grid-cols-1 md:grid-cols-3 gap-6\"><div class=\"p-8 bg-white rounded-2xl shadow\"><p class=\"text-sm uppercase tracking-wide text-slate-500\">Free</p><p class=\"mt-3 text-4xl font-bold\">€0<span class=\"text-base font-normal text-slate-500\">/mese</span></p><p class=\"mt-4 text-slate-600\">Per chi inizia.</p></div><div class=\"p-8 bg-indigo-600 text-white rounded-2xl shadow-xl ring-4 ring-indigo-100 relative\"><span class=\"absolute -top-3 left-8 px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-full\">Più scelto</span><p class=\"text-sm uppercase tracking-wide opacity-80\">Pro</p><p class=\"mt-3 text-4xl font-bold\">€9<span class=\"text-base font-normal opacity-80\">/mese</span></p><p class=\"mt-4 opacity-90\">Per chi fa sul serio.</p></div><div class=\"p-8 bg-white rounded-2xl shadow\"><p class=\"text-sm uppercase tracking-wide text-slate-500\">Team</p><p class=\"mt-3 text-4xl font-bold\">€29<span class=\"text-base font-normal text-slate-500\">/mese</span></p><p class=\"mt-4 text-slate-600\">Per palestre e PT.</p></div></div></section>",
        hint: "Section con h2 centrato + grid 3 colonne. Le 3 card sono div: 2 \"normali\" (bg-white) e 1 \"primary\" centrale (bg-indigo-600 text-white). Sulla primary c'è uno span absolute -top-3 con la badge.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulse — Allenati come ti pare</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <header class="px-6 py-20 max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-none">Allenati come ti pare.</h1>
      <p class="mt-6 text-lg text-slate-600">L'app fitness che si adatta a te, non il contrario.</p>
      <button class="mt-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors">Prova gratis 30 giorni</button>
    </header>
    <section class="px-6 py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-6 bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Workout su misura</h3>
        <p class="mt-2 text-slate-600">Piani che si adattano al tuo livello, ogni settimana.</p>
      </div>
      <div class="p-6 bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Tracking automatico</h3>
        <p class="mt-2 text-slate-600">Apple Watch, Garmin, manual logging — tutto sincronizzato.</p>
      </div>
      <div class="p-6 bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Coach AI 24/7</h3>
        <p class="mt-2 text-slate-600">Domande sull'allenamento, alimentazione, recupero. Risposte in italiano.</p>
      </div>
    </section>
    <section class="px-6 py-16 max-w-5xl mx-auto">
      <h2 class="text-4xl font-bold text-center mb-12">Scegli il tuo piano</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-8 bg-white rounded-2xl shadow">
          <p class="text-sm uppercase tracking-wide text-slate-500">Free</p>
          <p class="mt-3 text-4xl font-bold">€0<span class="text-base font-normal text-slate-500">/mese</span></p>
          <p class="mt-4 text-slate-600">Per chi inizia.</p>
        </div>
        <div class="p-8 bg-indigo-600 text-white rounded-2xl shadow-xl ring-4 ring-indigo-100 relative">
          <span class="absolute -top-3 left-8 px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-full">Più scelto</span>
          <p class="text-sm uppercase tracking-wide opacity-80">Pro</p>
          <p class="mt-3 text-4xl font-bold">€9<span class="text-base font-normal opacity-80">/mese</span></p>
          <p class="mt-4 opacity-90">Per chi fa sul serio.</p>
        </div>
        <div class="p-8 bg-white rounded-2xl shadow">
          <p class="text-sm uppercase tracking-wide text-slate-500">Team</p>
          <p class="mt-3 text-4xl font-bold">€29<span class="text-base font-normal text-slate-500">/mese</span></p>
          <p class="mt-4 text-slate-600">Per palestre e PT.</p>
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
                    selector: "div.bg-indigo-600.text-white.ring-4",
                    existsOnly: true,
                    message:
                        "Manca la card primary Pro: bg-indigo-600 text-white ring-4.",
                },
                {
                    type: "querySelector",
                    selector: "span.absolute.bg-white.text-indigo-600",
                    existsOnly: true,
                    message:
                        "Manca la badge \"Più scelto\" — span absolute, bg-white, text-indigo-600.",
                },
            ],
            message: "Pricing tiers con primary highlighted via colore + ring.",
        },
        successScript:
            "Il `ring-4 ring-indigo-100` crea un'aura colorata intorno alla card primary — un trucco moderno che attira l'occhio senza essere aggressivo. È quel dettaglio che dice \"questa è la scelta che vogliamo che fai\".",
        encourageScript:
            "Section con h2 text-4xl font-bold text-center mb-12 + grid 3 colonne. 2 card bg-white normali + 1 centrale bg-indigo-600 text-white ring-4 ring-indigo-100 relative con span absolute badge.",
    },

    {
        order: 7,
        slug: "sticky-header",
        title: "Header sticky con backdrop-blur",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "Dettaglio piccolo, impatto grande: la nav che resta in alto mentre scrolli, semi-trasparente, con effetto vetro. Lo fanno Apple, Stripe, Linear — quel tipo di sito che sembra fatto da una agenzia da decimila euro. Tailwind lo replica in 4 classi: sticky top-0 la incolla in alto, bg-white/80 la rende semi-trasparente, backdrop-blur-md aggiunge il blur, z-50 la tiene sopra tutto.",
        instruction:
            "Subito dopo il <body>, prima di <header>, aggiungi una nav: <nav class=\"sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between\"><a href=\"#\" class=\"font-bold text-xl text-indigo-600\">Pulse</a><div class=\"flex gap-6 text-sm font-medium text-slate-700\"><a href=\"#\" class=\"hover:text-indigo-600\">Funzionalità</a><a href=\"#\" class=\"hover:text-indigo-600\">Prezzi</a><a href=\"#\" class=\"hover:text-indigo-600\">Login</a></div></nav>",
        hint: "Una <nav> sticky top-0 z-50 con bg-white/80 backdrop-blur-md. Dentro flex justify-between: logo a sinistra (text-indigo-600 font-bold), 3 link a destra (flex gap-6 hover:text-indigo-600).",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulse — Allenati come ti pare</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <a href="#" class="font-bold text-xl text-indigo-600">Pulse</a>
      <div class="flex gap-6 text-sm font-medium text-slate-700">
        <a href="#" class="hover:text-indigo-600">Funzionalità</a>
        <a href="#" class="hover:text-indigo-600">Prezzi</a>
        <a href="#" class="hover:text-indigo-600">Login</a>
      </div>
    </nav>
    <header class="px-6 py-20 max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-none">Allenati come ti pare.</h1>
      <p class="mt-6 text-lg text-slate-600">L'app fitness che si adatta a te, non il contrario.</p>
      <button class="mt-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors">Prova gratis 30 giorni</button>
    </header>
    <section class="px-6 py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-6 bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Workout su misura</h3>
        <p class="mt-2 text-slate-600">Piani che si adattano al tuo livello, ogni settimana.</p>
      </div>
      <div class="p-6 bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Tracking automatico</h3>
        <p class="mt-2 text-slate-600">Apple Watch, Garmin, manual logging — tutto sincronizzato.</p>
      </div>
      <div class="p-6 bg-white rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Coach AI 24/7</h3>
        <p class="mt-2 text-slate-600">Domande sull'allenamento, alimentazione, recupero. Risposte in italiano.</p>
      </div>
    </section>
    <section class="px-6 py-16 max-w-5xl mx-auto">
      <h2 class="text-4xl font-bold text-center mb-12">Scegli il tuo piano</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-8 bg-white rounded-2xl shadow">
          <p class="text-sm uppercase tracking-wide text-slate-500">Free</p>
          <p class="mt-3 text-4xl font-bold">€0<span class="text-base font-normal text-slate-500">/mese</span></p>
          <p class="mt-4 text-slate-600">Per chi inizia.</p>
        </div>
        <div class="p-8 bg-indigo-600 text-white rounded-2xl shadow-xl ring-4 ring-indigo-100 relative">
          <span class="absolute -top-3 left-8 px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-full">Più scelto</span>
          <p class="text-sm uppercase tracking-wide opacity-80">Pro</p>
          <p class="mt-3 text-4xl font-bold">€9<span class="text-base font-normal opacity-80">/mese</span></p>
          <p class="mt-4 opacity-90">Per chi fa sul serio.</p>
        </div>
        <div class="p-8 bg-white rounded-2xl shadow">
          <p class="text-sm uppercase tracking-wide text-slate-500">Team</p>
          <p class="mt-3 text-4xl font-bold">€29<span class="text-base font-normal text-slate-500">/mese</span></p>
          <p class="mt-4 text-slate-600">Per palestre e PT.</p>
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
                    selector: "nav.sticky.top-0.z-50.backdrop-blur-md",
                    existsOnly: true,
                    message:
                        "Manca <nav> con sticky top-0 z-50 backdrop-blur-md.",
                },
                {
                    type: "querySelector",
                    selector: "nav a.text-indigo-600.font-bold",
                    existsOnly: true,
                    message:
                        "Manca il logo Pulse (a con text-indigo-600 font-bold) nella nav.",
                },
            ],
            message: "Nav sticky con backdrop-blur, logo + 3 link.",
        },
        successScript:
            "Scrolla la pagina: la nav resta in alto, semi-trasparente. Stesso pattern di Apple, Stripe, Linear — un dettaglio che fa sembrare il sito 10× più curato.",
        encourageScript:
            "Nav sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between. Dentro: a logo + div con 3 a per i link.",
    },

    // ────────────── MODULO 4: POLISH (DARK MODE) ─────────────────────────
    {
        order: 8,
        slug: "dark-mode",
        title: "Dark mode istantaneo con la classe `dark:`",
        durationSec: 130,
        avatarMood: "happy",
        script:
            "Ultima lezione, e mossa finale. Tailwind ha il dark mode integrato — basta aggiungere `dark:` davanti a una utility e quella si attiva quando il browser è in dark mode. Aggiungiamo le varianti dark a body, nav e card. Bonus: una classe sul tag html che attiva il dark mode anche manualmente.",
        instruction:
            "Modifica il <html> aggiungendo class=\"dark\" → <html lang=\"it\" class=\"dark\">. Poi al <body> aggiungi: dark:bg-slate-900 dark:text-slate-100. Al <nav>: dark:bg-slate-900/80 dark:border-slate-800. Sui 3 div feature: dark:bg-slate-800. Sul <h1> e <h2>: dark:text-white. Sui <p> con text-slate-600: dark:text-slate-400.",
        hint: "Aggiungi class=\"dark\" sul tag <html>. Poi metti dark:* davanti alle utility colore: dark:bg-slate-900 sul body, dark:bg-slate-800 sulle card, dark:text-slate-400 sui paragrafi grigi, dark:text-white sui titoli.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulse — Allenati come ti pare</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-sans antialiased">
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
      <a href="#" class="font-bold text-xl text-indigo-600">Pulse</a>
      <div class="flex gap-6 text-sm font-medium text-slate-700 dark:text-slate-300">
        <a href="#" class="hover:text-indigo-600">Funzionalità</a>
        <a href="#" class="hover:text-indigo-600">Prezzi</a>
        <a href="#" class="hover:text-indigo-600">Login</a>
      </div>
    </nav>
    <header class="px-6 py-20 max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-none dark:text-white">Allenati come ti pare.</h1>
      <p class="mt-6 text-lg text-slate-600 dark:text-slate-400">L'app fitness che si adatta a te, non il contrario.</p>
      <button class="mt-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors">Prova gratis 30 giorni</button>
    </header>
    <section class="px-6 py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Workout su misura</h3>
        <p class="mt-2 text-slate-600 dark:text-slate-400">Piani che si adattano al tuo livello, ogni settimana.</p>
      </div>
      <div class="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Tracking automatico</h3>
        <p class="mt-2 text-slate-600 dark:text-slate-400">Apple Watch, Garmin, manual logging — tutto sincronizzato.</p>
      </div>
      <div class="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow hover:-translate-y-1 hover:shadow-xl transition-all">
        <h3 class="text-xl font-bold">Coach AI 24/7</h3>
        <p class="mt-2 text-slate-600 dark:text-slate-400">Domande sull'allenamento, alimentazione, recupero. Risposte in italiano.</p>
      </div>
    </section>
    <section class="px-6 py-16 max-w-5xl mx-auto">
      <h2 class="text-4xl font-bold text-center mb-12 dark:text-white">Scegli il tuo piano</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow">
          <p class="text-sm uppercase tracking-wide text-slate-500">Free</p>
          <p class="mt-3 text-4xl font-bold">€0<span class="text-base font-normal text-slate-500">/mese</span></p>
          <p class="mt-4 text-slate-600 dark:text-slate-400">Per chi inizia.</p>
        </div>
        <div class="p-8 bg-indigo-600 text-white rounded-2xl shadow-xl ring-4 ring-indigo-100 dark:ring-indigo-900 relative">
          <span class="absolute -top-3 left-8 px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-full">Più scelto</span>
          <p class="text-sm uppercase tracking-wide opacity-80">Pro</p>
          <p class="mt-3 text-4xl font-bold">€9<span class="text-base font-normal opacity-80">/mese</span></p>
          <p class="mt-4 opacity-90">Per chi fa sul serio.</p>
        </div>
        <div class="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow">
          <p class="text-sm uppercase tracking-wide text-slate-500">Team</p>
          <p class="mt-3 text-4xl font-bold">€29<span class="text-base font-normal text-slate-500">/mese</span></p>
          <p class="mt-4 text-slate-600 dark:text-slate-400">Per palestre e PT.</p>
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
                    selector: "html.dark",
                    existsOnly: true,
                    message:
                        "Manca class=\"dark\" sul tag <html>.",
                },
                {
                    type: "textIncludes",
                    needle: "dark:bg-slate-900",
                    flexible: true,
                    message:
                        "Devi aggiungere dark:bg-slate-900 al body (e altre dark: variants).",
                },
                {
                    type: "textIncludes",
                    needle: "dark:bg-slate-800",
                    flexible: true,
                    message:
                        "Le card devono avere dark:bg-slate-800 per il dark mode.",
                },
            ],
            message:
                "Dark mode con class=\"dark\" su <html> e dark: variants sulle utility colore.",
        },
        successScript:
            "FINITO! Hai una landing SaaS completa, responsive, con dark mode, in 8 lezioni. Tailwind è quello — utility classes che combinate in modo sensato producono UI moderne in pochi minuti. Adesso il pattern è tuo, puoi usarlo per qualunque progetto.",
        encourageScript:
            "1) Su <html> aggiungi class=\"dark\". 2) A body, nav, card, h1, h2, paragrafi grigi, aggiungi dark:* davanti alle utility colore. Es: dark:bg-slate-900, dark:text-white, dark:text-slate-400, dark:bg-slate-800.",
    },
];

tailwindUtilityFirstCourse.lessons = lessons;
tailwindUtilityFirstCourse.finalCode =
    lessons[lessons.length - 1].expectedSnapshot;
