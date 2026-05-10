/**
 * Corso "layout-moderno": layout CSS del 2026.
 * Grid avanzato + Container Queries + has() + scroll-snap.
 *
 * Persona: lo studio di architettura "Nord" vuole una dashboard
 * portfolio dei propri progetti — pulita, responsive, ma SENZA
 * media query. Si adatta al container, non al viewport.
 *
 * Filosofia design: ogni componente è "container-aware". La stessa
 * card sembra giusta in sidebar (200px) e in main (800px) senza
 * scrivere una sola @media.
 *
 * Sequenza:
 *   M1: Grid moderno (lezioni 1-3) — auto-fit, areas, subgrid
 *   M2: Container Queries (lezioni 4-5) — @container e cqw/cqh
 *   M3: Card moderne (lezioni 6-8) — aspect-ratio, scroll-snap, has()
 */
import type { Lesson, PlayCourse } from "@/data/play/types";

export const layoutModernoCourse: PlayCourse = {
    slug: "layout-moderno",
    title: "Layout moderno: Grid + Container Queries",
    subtitle:
        "Le media query (max-width) sono il passato. Grid areas, subgrid, @container e has() sono il presente.",
    description:
        "Le media query non bastano più. Un componente in sidebar non è lo stesso in main, anche se la finestra è larga uguale. In 8 lezioni costruirai la dashboard dello studio di architettura \"Nord\": un portfolio di progetti che si adatta al SUO container — non al viewport. Userai Grid con auto-fit e areas, subgrid per allineare child elements alla griglia del padre, container queries per il vero responsive a livello componente, container query units per font fluidi, aspect-ratio, scroll-snap per gallery orizzontali e has() per styling condizionato. Tutto quello che il CSS del 2026 ti permette — e che molti dev ancora non sanno usare.",
    level: "avanzato",
    subjects: ["css"],
    durationMin: 90,
    status: "live",
    initialCode: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studio Nord — Portfolio</title>
    <style></style>
  </head>
  <body>
    <!-- la dashboard si costruisce qui -->
  </body>
</html>`,
    finalCode: "",
    modules: [
        {
            order: 1,
            slug: "grid-moderno",
            title: "Grid moderno: auto-fit, areas, subgrid",
            summary:
                "repeat(auto-fit, minmax()), grid-template-areas con sidebar/header/main, e subgrid per allineare i figli alla griglia del padre.",
        },
        {
            order: 2,
            slug: "container-queries",
            title: "Container Queries: il vero responsive",
            summary:
                "@container per stilare in base alla larghezza del componente, non del viewport. Container query units cqw/cqh per tipografia fluida.",
        },
        {
            order: 3,
            slug: "card-moderne",
            title: "Card moderne: aspect-ratio, scroll-snap, has()",
            summary:
                "Proporzioni stabili con aspect-ratio, gallery orizzontali con scroll-snap, styling condizionato con :has().",
        },
    ],
    lessons: [],
};

const lessons: Lesson[] = [
    // ────────────── MODULO 1: GRID MODERNO ───────────────────────────────
    {
        order: 1,
        slug: "grid-auto-fit",
        title: "Grid auto-fit: la griglia che si conta da sola",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Hai mai contato a mano quante colonne mettere in una grid? \"Su mobile 1, su tablet 2, su desktop 3...\" Smettila. repeat(auto-fit, minmax(250px, 1fr)) dice al browser: \"piazza tutte le colonne larghe almeno 250px che riesci, dividi lo spazio in parti uguali.\" Una riga, zero media query, layout responsive perfetto. Lo studio Nord ha 6 progetti — la grid si auto-organizza in 1, 2, 3 o 4 colonne a seconda dello spazio.",
        instruction:
            "Dentro il <body>, aggiungi una section con 6 card progetto. Poi nello <style> scrivi: .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; padding: 1rem; } .card { background: #f4f4f4; padding: 1rem; border-radius: 8px; }",
        hint: "Section con class=\"projects\" che contiene 6 div class=\"card\". Lo stile usa display:grid + grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)).",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studio Nord — Portfolio</title>
    <style>
      .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; padding: 1rem; }
      .card { background: #f4f4f4; padding: 1rem; border-radius: 8px; }
    </style>
  </head>
  <body>
    <section class="projects">
      <div class="card">Casa sul lago</div>
      <div class="card">Loft Brera</div>
      <div class="card">Villa Riva</div>
      <div class="card">Studio Garibaldi</div>
      <div class="card">Atelier Navigli</div>
      <div class="card">Cascina Nord</div>
    </section>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "section.projects > .card:nth-of-type(6)",
                    existsOnly: true,
                    message:
                        "Servono 6 div.card dentro section.projects.",
                },
                {
                    type: "computedStyle",
                    selector: ".projects",
                    property: "display",
                    value: "grid",
                    message:
                        "La section .projects deve avere display:grid.",
                },
            ],
            message:
                "Section .projects con 6 .card e display:grid + auto-fit minmax(250px, 1fr).",
        },
        successScript:
            "Allarga e stringi la finestra: la grid passa da 1 a 4 colonne automatica. Niente @media. Il browser conta da sé in base allo spazio disponibile e al minmax. Magia? No, CSS del 2017 — che ancora oggi molti non usano.",
        encourageScript:
            "Section.projects con 6 div.card dentro. Stile: .projects { display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; padding: 1rem; }. Più .card { background:#f4f4f4; padding:1rem; border-radius:8px; }.",
    },

    {
        order: 2,
        slug: "grid-template-areas",
        title: "Grid areas: il layout che si disegna a parole",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "grid-template-areas è la cosa più sottovalutata del CSS. Disegni il layout con le parole, letteralmente. \"sidebar header header\" / \"sidebar main main\" e il browser capisce. Niente nth-child, niente row/column-start, solo testo che descrive la pagina. Trasformiamo la dashboard in un'app vera: sidebar a sinistra con i filtri, header in alto con il logo, main centrale con i progetti.",
        instruction:
            "Avvolgi tutto dentro un <div class=\"app\">. Dentro metti: <header class=\"app-header\">Studio Nord</header>, <aside class=\"app-sidebar\">Filtri</aside>, e la section.projects (con class \"projects app-main\"). Nello style aggiungi: .app { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 60px 1fr; grid-template-areas: \"header header\" \"sidebar main\"; min-height: 100vh; gap: 1rem; padding: 1rem; } .app-header { grid-area: header; background: #1a1a1a; color: white; padding: 1rem; } .app-sidebar { grid-area: sidebar; background: #eee; padding: 1rem; } .app-main { grid-area: main; padding: 0; }",
        hint: "Avvolgi tutto in <div class=\"app\">. Dentro 3 figli: header.app-header, aside.app-sidebar, section.projects.app-main. Lo stile .app usa grid-template-areas con due righe di stringhe.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studio Nord — Portfolio</title>
    <style>
      .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; padding: 1rem; }
      .card { background: #f4f4f4; padding: 1rem; border-radius: 8px; }
      .app { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 60px 1fr; grid-template-areas: "header header" "sidebar main"; min-height: 100vh; gap: 1rem; padding: 1rem; }
      .app-header { grid-area: header; background: #1a1a1a; color: white; padding: 1rem; }
      .app-sidebar { grid-area: sidebar; background: #eee; padding: 1rem; }
      .app-main { grid-area: main; padding: 0; }
    </style>
  </head>
  <body>
    <div class="app">
      <header class="app-header">Studio Nord</header>
      <aside class="app-sidebar">Filtri</aside>
      <section class="projects app-main">
        <div class="card">Casa sul lago</div>
        <div class="card">Loft Brera</div>
        <div class="card">Villa Riva</div>
        <div class="card">Studio Garibaldi</div>
        <div class="card">Atelier Navigli</div>
        <div class="card">Cascina Nord</div>
      </section>
    </div>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: ".app > .app-header",
                    existsOnly: true,
                    message:
                        "Manca .app-header dentro .app.",
                },
                {
                    type: "querySelector",
                    selector: ".app > .app-sidebar",
                    existsOnly: true,
                    message:
                        "Manca .app-sidebar dentro .app.",
                },
                {
                    type: "computedStyle",
                    selector: ".app",
                    property: "display",
                    value: "grid",
                    message:
                        ".app deve avere display:grid.",
                },
            ],
            message:
                ".app con grid-template-areas che assegna header/sidebar/main.",
        },
        successScript:
            "Guarda la struttura: header occupa tutta la riga sopra, sidebar a sinistra, main a destra. Tutto descritto con \"header header\" / \"sidebar main\". Riordina le aree e la pagina si riorganizza — è il layout più leggibile che il CSS abbia mai avuto.",
        encourageScript:
            "<div class=\"app\"> con dentro <header.app-header>, <aside.app-sidebar>, <section.projects.app-main>. Stile .app: display:grid, grid-template-columns:200px 1fr, grid-template-rows:60px 1fr, grid-template-areas:\"header header\" \"sidebar main\".",
    },

    {
        order: 3,
        slug: "subgrid",
        title: "Subgrid: il figlio si allinea alla griglia del padre",
        durationSec: 140,
        avatarMood: "talking",
        script:
            "Problema classico: hai 6 card, ognuna con titolo + descrizione + footer. I titoli sono di lunghezza diversa e si disallineano tra le card. Soluzione vecchia: altezze fisse, hack vari. Soluzione 2026: subgrid. Il figlio dice \"voglio usare la stessa griglia del nonno\". Le righe interne di tutte le card si allineano automaticamente — i titoli stanno sulla stessa riga, i footer sulla stessa riga, anche se il contenuto è diverso. È il figlio che eredita la griglia del padre.",
        instruction:
            "Modifica le 6 .card così: <div class=\"card\"><h3>Titolo</h3><p>Descrizione del progetto, anche su più righe.</p><span>2024</span></div>. Cambia titolo/descrizione/anno per ogni progetto. Nello stile aggiungi: .projects { grid-template-rows: auto; } e .card { display: grid; grid-template-rows: subgrid; grid-row: span 3; gap: 0.5rem; } — più importante, sulla .projects metti grid-auto-rows: auto e assicurati che ogni .card sia grid-row: span 3.",
        hint: "Ogni .card ora contiene h3, p, span (3 righe interne). Sulla .card metti display:grid, grid-template-rows:subgrid, grid-row:span 3. Il browser allineerà titoli/descrizioni/footer di tutte le card sulle stesse righe della grid esterna.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studio Nord — Portfolio</title>
    <style>
      .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); grid-auto-rows: auto; gap: 1rem; padding: 1rem; }
      .card { background: #f4f4f4; padding: 1rem; border-radius: 8px; display: grid; grid-template-rows: subgrid; grid-row: span 3; gap: 0.5rem; }
      .app { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 60px 1fr; grid-template-areas: "header header" "sidebar main"; min-height: 100vh; gap: 1rem; padding: 1rem; }
      .app-header { grid-area: header; background: #1a1a1a; color: white; padding: 1rem; }
      .app-sidebar { grid-area: sidebar; background: #eee; padding: 1rem; }
      .app-main { grid-area: main; padding: 0; }
    </style>
  </head>
  <body>
    <div class="app">
      <header class="app-header">Studio Nord</header>
      <aside class="app-sidebar">Filtri</aside>
      <section class="projects app-main">
        <div class="card"><h3>Casa sul lago</h3><p>Residenza privata sul Lago di Como, vista panoramica.</p><span>2024</span></div>
        <div class="card"><h3>Loft Brera</h3><p>Recupero industriale.</p><span>2023</span></div>
        <div class="card"><h3>Villa Riva</h3><p>Nuova costruzione bioclimatica con tetto verde e pannelli integrati.</p><span>2024</span></div>
        <div class="card"><h3>Studio Garibaldi</h3><p>Coworking 400mq.</p><span>2022</span></div>
        <div class="card"><h3>Atelier Navigli</h3><p>Spazio espositivo per giovane designer milanese.</p><span>2023</span></div>
        <div class="card"><h3>Cascina Nord</h3><p>Restauro conservativo.</p><span>2025</span></div>
      </section>
    </div>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: ".card > h3",
                    existsOnly: true,
                    message:
                        "Ogni .card deve contenere un h3.",
                },
                {
                    type: "querySelector",
                    selector: ".card > span",
                    existsOnly: true,
                    message:
                        "Ogni .card deve contenere uno span (anno).",
                },
                {
                    type: "textIncludes",
                    needle: "subgrid",
                    flexible: true,
                    message:
                        "Manca grid-template-rows: subgrid sulla .card.",
                },
            ],
            message:
                ".card con 3 figli (h3/p/span) che usano subgrid per allinearsi alla grid padre.",
        },
        successScript:
            "Confronta le card: i titoli sono sulla stessa riga, le descrizioni sotto, gli anni in fondo — anche se le descrizioni sono di lunghezza diversa. Il figlio eredita la griglia del padre. Prima di subgrid serviva flexbox + min-height + hack, oggi è una riga.",
        encourageScript:
            "Ogni .card ha 3 figli: h3, p, span. Stile .card: display:grid, grid-template-rows:subgrid, grid-row:span 3. La .projects deve avere grid-auto-rows:auto.",
    },

    // ────────────── MODULO 2: CONTAINER QUERIES ──────────────────────────
    {
        order: 4,
        slug: "container-query",
        title: "Container Queries: il componente si guarda allo specchio",
        durationSec: 150,
        avatarMood: "talking",
        script:
            "Le media query (max-width: 768px) sono il passato. Il presente è il container query. Domanda: una card in sidebar (200px) e la stessa card in main (800px) sullo stesso desktop — sono uguali? No, dovrebbero essere diverse. Ma con @media non puoi farlo, perché la finestra è la stessa. Container queries cambiano tutto: il componente guarda LA SUA larghezza, non quella del viewport. Lo dichiari container con container-type: inline-size, e poi @container (min-width: 400px) reagisce allo spazio del genitore, non della finestra.",
        instruction:
            "Aggiungi al <style>: .projects { container-type: inline-size; container-name: grid; } e poi @container grid (min-width: 400px) { .card { padding: 2rem; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); } } Quando la .projects diventa larga abbastanza, le card cambiano padding e fondo — indipendentemente dal viewport.",
        hint: "Sulla .projects metti container-type:inline-size e container-name:grid. Poi crea una @container grid (min-width: 400px) che modifica .card. Importante: il container-type rende la .projects \"interrogabile\" dai suoi figli.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studio Nord — Portfolio</title>
    <style>
      .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); grid-auto-rows: auto; gap: 1rem; padding: 1rem; container-type: inline-size; container-name: grid; }
      .card { background: #f4f4f4; padding: 1rem; border-radius: 8px; display: grid; grid-template-rows: subgrid; grid-row: span 3; gap: 0.5rem; }
      @container grid (min-width: 400px) {
        .card { padding: 2rem; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      }
      .app { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 60px 1fr; grid-template-areas: "header header" "sidebar main"; min-height: 100vh; gap: 1rem; padding: 1rem; }
      .app-header { grid-area: header; background: #1a1a1a; color: white; padding: 1rem; }
      .app-sidebar { grid-area: sidebar; background: #eee; padding: 1rem; }
      .app-main { grid-area: main; padding: 0; }
    </style>
  </head>
  <body>
    <div class="app">
      <header class="app-header">Studio Nord</header>
      <aside class="app-sidebar">Filtri</aside>
      <section class="projects app-main">
        <div class="card"><h3>Casa sul lago</h3><p>Residenza privata sul Lago di Como, vista panoramica.</p><span>2024</span></div>
        <div class="card"><h3>Loft Brera</h3><p>Recupero industriale.</p><span>2023</span></div>
        <div class="card"><h3>Villa Riva</h3><p>Nuova costruzione bioclimatica con tetto verde e pannelli integrati.</p><span>2024</span></div>
        <div class="card"><h3>Studio Garibaldi</h3><p>Coworking 400mq.</p><span>2022</span></div>
        <div class="card"><h3>Atelier Navigli</h3><p>Spazio espositivo per giovane designer milanese.</p><span>2023</span></div>
        <div class="card"><h3>Cascina Nord</h3><p>Restauro conservativo.</p><span>2025</span></div>
      </section>
    </div>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "container-type",
                    flexible: true,
                    message:
                        "Manca container-type:inline-size sulla .projects.",
                },
                {
                    type: "textIncludes",
                    needle: "@container",
                    flexible: true,
                    message:
                        "Manca la @container query.",
                },
                {
                    type: "computedStyle",
                    selector: ".projects",
                    property: "container-type",
                    value: "inline-size",
                    message:
                        ".projects deve avere container-type:inline-size.",
                },
            ],
            message:
                ".projects è container, .card reagisce alla larghezza del container con @container.",
        },
        successScript:
            "Pensa al potere: la stessa card, dentro una sidebar stretta, sta minimal. Dentro un main largo, esplode con padding generoso e ombra. Senza media query, senza JavaScript, senza sapere niente del viewport. Il componente si guarda allo specchio. È quello che sognavamo dal 2010.",
        encourageScript:
            "Sulla .projects aggiungi container-type:inline-size e container-name:grid. Poi @container grid (min-width: 400px) { .card { padding:2rem; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.08); } }.",
    },

    {
        order: 5,
        slug: "container-units",
        title: "cqw e cqh: tipografia che cresce con il container",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Hai mai visto un titolo grande sul desktop ma minuscolo sul mobile, o viceversa? La causa è la tipografia che usa unità sbagliate. vw cresce col viewport — ma se la card è in sidebar, il titolo a 5vw è enorme rispetto allo spazio. Soluzione: container query units. cqw è 1% della larghezza del container, cqh è 1% dell'altezza. font-size: clamp(1rem, 5cqw, 2rem) significa: minimo 1rem, idealmente 5% della larghezza del container, massimo 2rem. La tipografia cresce con il componente, non con la finestra.",
        instruction:
            "Aggiungi al <style> dentro la .card: .card h3 { font-size: clamp(1rem, 5cqw, 1.75rem); margin: 0; line-height: 1.2; } e .card p { font-size: clamp(0.85rem, 3cqw, 1rem); margin: 0; color: #555; } e .card span { font-size: 0.75rem; color: #999; }",
        hint: "Aggiungi 3 selettori: .card h3 con font-size:clamp(1rem, 5cqw, 1.75rem), .card p con clamp(0.85rem, 3cqw, 1rem), .card span con 0.75rem grigio. Il cqw è 1% della larghezza del container .projects.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studio Nord — Portfolio</title>
    <style>
      .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); grid-auto-rows: auto; gap: 1rem; padding: 1rem; container-type: inline-size; container-name: grid; }
      .card { background: #f4f4f4; padding: 1rem; border-radius: 8px; display: grid; grid-template-rows: subgrid; grid-row: span 3; gap: 0.5rem; }
      .card h3 { font-size: clamp(1rem, 5cqw, 1.75rem); margin: 0; line-height: 1.2; }
      .card p { font-size: clamp(0.85rem, 3cqw, 1rem); margin: 0; color: #555; }
      .card span { font-size: 0.75rem; color: #999; }
      @container grid (min-width: 400px) {
        .card { padding: 2rem; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      }
      .app { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 60px 1fr; grid-template-areas: "header header" "sidebar main"; min-height: 100vh; gap: 1rem; padding: 1rem; }
      .app-header { grid-area: header; background: #1a1a1a; color: white; padding: 1rem; }
      .app-sidebar { grid-area: sidebar; background: #eee; padding: 1rem; }
      .app-main { grid-area: main; padding: 0; }
    </style>
  </head>
  <body>
    <div class="app">
      <header class="app-header">Studio Nord</header>
      <aside class="app-sidebar">Filtri</aside>
      <section class="projects app-main">
        <div class="card"><h3>Casa sul lago</h3><p>Residenza privata sul Lago di Como, vista panoramica.</p><span>2024</span></div>
        <div class="card"><h3>Loft Brera</h3><p>Recupero industriale.</p><span>2023</span></div>
        <div class="card"><h3>Villa Riva</h3><p>Nuova costruzione bioclimatica con tetto verde e pannelli integrati.</p><span>2024</span></div>
        <div class="card"><h3>Studio Garibaldi</h3><p>Coworking 400mq.</p><span>2022</span></div>
        <div class="card"><h3>Atelier Navigli</h3><p>Spazio espositivo per giovane designer milanese.</p><span>2023</span></div>
        <div class="card"><h3>Cascina Nord</h3><p>Restauro conservativo.</p><span>2025</span></div>
      </section>
    </div>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "cqw",
                    flexible: true,
                    message:
                        "Devi usare cqw nel font-size dei titoli.",
                },
                {
                    type: "textIncludes",
                    needle: "clamp(",
                    flexible: true,
                    message:
                        "Usa clamp(min, ideal, max) per la tipografia fluida.",
                },
                {
                    type: "querySelector",
                    selector: ".card h3",
                    existsOnly: true,
                    message:
                        "Servono h3 dentro le .card per applicare il font-size.",
                },
            ],
            message:
                "Tipografia con clamp() + cqw che cresce con il container.",
        },
        successScript:
            "Il trio clamp + cqw è il futuro della tipografia responsive. Mai più jump tra breakpoint, mai più font-size fissi che sbagliano. Cresce col container, ha un minimo e un massimo sani. Una sola riga al posto di 4 media query.",
        encourageScript:
            "3 regole: .card h3 { font-size: clamp(1rem, 5cqw, 1.75rem); margin:0; line-height:1.2; } .card p { font-size: clamp(0.85rem, 3cqw, 1rem); margin:0; color:#555; } .card span { font-size:0.75rem; color:#999; }.",
    },

    // ────────────── MODULO 3: CARD MODERNE ───────────────────────────────
    {
        order: 6,
        slug: "aspect-ratio",
        title: "aspect-ratio: card che mantengono le proporzioni",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Le card senza immagine sono noiose. Aggiungiamo un'anteprima del progetto sopra ogni card — ma serve un trucco: l'anteprima deve mantenere sempre la stessa proporzione, qualunque sia la larghezza. Prima di aspect-ratio si usavano padding-bottom in percentuale (un trick orribile). Oggi: aspect-ratio: 16/9 e basta. L'altezza si calcola dalla larghezza, sempre proporzionale, sempre stabile.",
        instruction:
            "All'inizio di ogni .card aggiungi: <div class=\"thumb\"></div>. Nello stile: .thumb { aspect-ratio: 16 / 9; background: linear-gradient(135deg, #888, #444); border-radius: 4px; } e modifica .card grid-row: span 4 (perché ora ci sono 4 figli: thumb, h3, p, span).",
        hint: "Ogni .card ora ha 4 figli: <div class=\"thumb\"></div> + h3 + p + span. Cambia grid-row:span 3 in span 4. La .thumb usa aspect-ratio: 16 / 9.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studio Nord — Portfolio</title>
    <style>
      .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); grid-auto-rows: auto; gap: 1rem; padding: 1rem; container-type: inline-size; container-name: grid; }
      .card { background: #f4f4f4; padding: 1rem; border-radius: 8px; display: grid; grid-template-rows: subgrid; grid-row: span 4; gap: 0.5rem; }
      .thumb { aspect-ratio: 16 / 9; background: linear-gradient(135deg, #888, #444); border-radius: 4px; }
      .card h3 { font-size: clamp(1rem, 5cqw, 1.75rem); margin: 0; line-height: 1.2; }
      .card p { font-size: clamp(0.85rem, 3cqw, 1rem); margin: 0; color: #555; }
      .card span { font-size: 0.75rem; color: #999; }
      @container grid (min-width: 400px) {
        .card { padding: 2rem; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      }
      .app { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 60px 1fr; grid-template-areas: "header header" "sidebar main"; min-height: 100vh; gap: 1rem; padding: 1rem; }
      .app-header { grid-area: header; background: #1a1a1a; color: white; padding: 1rem; }
      .app-sidebar { grid-area: sidebar; background: #eee; padding: 1rem; }
      .app-main { grid-area: main; padding: 0; }
    </style>
  </head>
  <body>
    <div class="app">
      <header class="app-header">Studio Nord</header>
      <aside class="app-sidebar">Filtri</aside>
      <section class="projects app-main">
        <div class="card"><div class="thumb"></div><h3>Casa sul lago</h3><p>Residenza privata sul Lago di Como, vista panoramica.</p><span>2024</span></div>
        <div class="card"><div class="thumb"></div><h3>Loft Brera</h3><p>Recupero industriale.</p><span>2023</span></div>
        <div class="card"><div class="thumb"></div><h3>Villa Riva</h3><p>Nuova costruzione bioclimatica con tetto verde e pannelli integrati.</p><span>2024</span></div>
        <div class="card"><div class="thumb"></div><h3>Studio Garibaldi</h3><p>Coworking 400mq.</p><span>2022</span></div>
        <div class="card"><div class="thumb"></div><h3>Atelier Navigli</h3><p>Spazio espositivo per giovane designer milanese.</p><span>2023</span></div>
        <div class="card"><div class="thumb"></div><h3>Cascina Nord</h3><p>Restauro conservativo.</p><span>2025</span></div>
      </section>
    </div>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: ".card > .thumb",
                    existsOnly: true,
                    message:
                        "Ogni .card deve avere un .thumb come primo figlio.",
                },
                {
                    type: "computedStyle",
                    selector: ".thumb",
                    property: "aspect-ratio",
                    value: "16 / 9",
                    message:
                        ".thumb deve avere aspect-ratio: 16 / 9.",
                },
            ],
            message:
                "Card con .thumb 16:9 in cima, mantiene proporzione qualsiasi larghezza.",
        },
        successScript:
            "Allarga la finestra: i thumb crescono in larghezza ma mantengono sempre 16:9. Niente padding-bottom hack, niente JavaScript, una proprietà CSS che ha cambiato la vita ai designer.",
        encourageScript:
            "Aggiungi <div class=\"thumb\"></div> come primo figlio di ogni .card. Stile .thumb { aspect-ratio: 16 / 9; background: linear-gradient(135deg, #888, #444); border-radius: 4px; }. Cambia grid-row:span 3 in span 4.",
    },

    {
        order: 7,
        slug: "scroll-snap",
        title: "Scroll-snap: gallery orizzontale che si incolla",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Lo studio Nord vuole anche una sezione \"In evidenza\" sotto la grid — una gallery orizzontale dove scorri lateralmente i progetti più recenti. Senza scroll-snap è un pasticcio: scrolli e ti fermi nel mezzo di una card. Con scroll-snap il browser \"incolla\" il punto di stop esattamente sulla prossima card. È la stessa UX delle storie Instagram, dei caroselli Apple — implementata in 3 righe di CSS.",
        instruction:
            "Subito dopo la </section.projects>, ancora dentro .app-main? No — mettiamola dopo .app, in fondo al body NON dentro .app, ma in un nuovo wrapper. Più semplice: aggiungi PRIMA di </section> (cioè come ULTIMO contenuto della .projects.app-main? meglio fuori). Aggiungi dopo </section> (chiudendo .projects) ma ancora dentro .app... no. Aggiungi DOPO </div> di chiusura .app, in fondo al body: <section class=\"featured\"><div class=\"f-item\">Riviera</div><div class=\"f-item\">Loft Bovisa</div><div class=\"f-item\">Villa Sondrio</div><div class=\"f-item\">Cascina Po</div></section>. Stile: .featured { display: flex; gap: 1rem; padding: 1rem; overflow-x: auto; scroll-snap-type: x mandatory; } .f-item { flex: 0 0 280px; aspect-ratio: 4 / 3; background: #1a1a1a; color: white; padding: 1rem; border-radius: 8px; scroll-snap-align: start; }",
        hint: "Dopo la chiusura di .app (</div>), aggiungi <section class=\"featured\"> con 4 .f-item dentro. Stile: .featured usa display:flex, overflow-x:auto, scroll-snap-type:x mandatory. .f-item usa flex:0 0 280px e scroll-snap-align:start.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studio Nord — Portfolio</title>
    <style>
      .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); grid-auto-rows: auto; gap: 1rem; padding: 1rem; container-type: inline-size; container-name: grid; }
      .card { background: #f4f4f4; padding: 1rem; border-radius: 8px; display: grid; grid-template-rows: subgrid; grid-row: span 4; gap: 0.5rem; }
      .thumb { aspect-ratio: 16 / 9; background: linear-gradient(135deg, #888, #444); border-radius: 4px; }
      .card h3 { font-size: clamp(1rem, 5cqw, 1.75rem); margin: 0; line-height: 1.2; }
      .card p { font-size: clamp(0.85rem, 3cqw, 1rem); margin: 0; color: #555; }
      .card span { font-size: 0.75rem; color: #999; }
      @container grid (min-width: 400px) {
        .card { padding: 2rem; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      }
      .app { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 60px 1fr; grid-template-areas: "header header" "sidebar main"; min-height: 100vh; gap: 1rem; padding: 1rem; }
      .app-header { grid-area: header; background: #1a1a1a; color: white; padding: 1rem; }
      .app-sidebar { grid-area: sidebar; background: #eee; padding: 1rem; }
      .app-main { grid-area: main; padding: 0; }
      .featured { display: flex; gap: 1rem; padding: 1rem; overflow-x: auto; scroll-snap-type: x mandatory; }
      .f-item { flex: 0 0 280px; aspect-ratio: 4 / 3; background: #1a1a1a; color: white; padding: 1rem; border-radius: 8px; scroll-snap-align: start; }
    </style>
  </head>
  <body>
    <div class="app">
      <header class="app-header">Studio Nord</header>
      <aside class="app-sidebar">Filtri</aside>
      <section class="projects app-main">
        <div class="card"><div class="thumb"></div><h3>Casa sul lago</h3><p>Residenza privata sul Lago di Como, vista panoramica.</p><span>2024</span></div>
        <div class="card"><div class="thumb"></div><h3>Loft Brera</h3><p>Recupero industriale.</p><span>2023</span></div>
        <div class="card"><div class="thumb"></div><h3>Villa Riva</h3><p>Nuova costruzione bioclimatica con tetto verde e pannelli integrati.</p><span>2024</span></div>
        <div class="card"><div class="thumb"></div><h3>Studio Garibaldi</h3><p>Coworking 400mq.</p><span>2022</span></div>
        <div class="card"><div class="thumb"></div><h3>Atelier Navigli</h3><p>Spazio espositivo per giovane designer milanese.</p><span>2023</span></div>
        <div class="card"><div class="thumb"></div><h3>Cascina Nord</h3><p>Restauro conservativo.</p><span>2025</span></div>
      </section>
    </div>
    <section class="featured">
      <div class="f-item">Riviera</div>
      <div class="f-item">Loft Bovisa</div>
      <div class="f-item">Villa Sondrio</div>
      <div class="f-item">Cascina Po</div>
    </section>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "section.featured > .f-item:nth-of-type(4)",
                    existsOnly: true,
                    message:
                        "Servono 4 .f-item dentro section.featured.",
                },
                {
                    type: "computedStyle",
                    selector: ".featured",
                    property: "scroll-snap-type",
                    value: "x mandatory",
                    message:
                        ".featured deve avere scroll-snap-type: x mandatory.",
                },
                {
                    type: "computedStyle",
                    selector: ".f-item",
                    property: "scroll-snap-align",
                    value: "start",
                    message:
                        ".f-item deve avere scroll-snap-align: start.",
                },
            ],
            message:
                "Gallery orizzontale con scroll-snap che si incolla all'inizio di ogni item.",
        },
        successScript:
            "Trascina la gallery con il dito (o il trackpad): si ferma sempre con un item allineato a sinistra. È quel polish che separa un sito \"fatto\" da un sito \"curato\". Tre righe di CSS, una UX nativa.",
        encourageScript:
            "Dopo la chiusura di .app, aggiungi <section class=\"featured\"> con 4 div.f-item. Stile .featured: display:flex, overflow-x:auto, scroll-snap-type:x mandatory. Stile .f-item: flex:0 0 280px, aspect-ratio:4/3, scroll-snap-align:start.",
    },

    {
        order: 8,
        slug: "has-selector",
        title: ":has() — il selettore che il CSS aspettava da 20 anni",
        durationSec: 150,
        avatarMood: "happy",
        script:
            "Mossa finale, e una delle aggiunte più potenti al CSS dai tempi del flexbox. :has() è il \"parent selector\" — finalmente puoi stilare un elemento in base ai suoi figli. Esempio classico: .card:has(img) deve essere diverso da .card senza immagine. Prima serviva JavaScript. Oggi una riga di CSS. Lo applichiamo a Nord: le card che hanno un .thumb (tutte, in questo caso) ricevono un trattamento; e nella sidebar, l'aside che contiene un h2 attivo riceve un evidenziatore. Ti mostro entrambi, ma il vero potere è capire il pattern.",
        instruction:
            "1) Aggiungi dentro l'<aside class=\"app-sidebar\">: <h2>Filtri</h2><label><input type=\"checkbox\"> Residenziale</label><label><input type=\"checkbox\" checked> Commerciale</label>. 2) Aggiungi al <style>: .card:has(.thumb) { border-top: 3px solid #1a1a1a; } /* card con anteprima */ e label:has(input:checked) { background: #1a1a1a; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; display: inline-block; } /* label evidenziata se checkbox è checked */",
        hint: "Modifica .app-sidebar inserendo <h2>Filtri</h2> e 2 <label> con <input type=\"checkbox\">, uno con attributo checked. Stile: .card:has(.thumb) per styling condizionato + label:has(input:checked) che colora la label SE il checkbox dentro è checked.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studio Nord — Portfolio</title>
    <style>
      .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); grid-auto-rows: auto; gap: 1rem; padding: 1rem; container-type: inline-size; container-name: grid; }
      .card { background: #f4f4f4; padding: 1rem; border-radius: 8px; display: grid; grid-template-rows: subgrid; grid-row: span 4; gap: 0.5rem; }
      .thumb { aspect-ratio: 16 / 9; background: linear-gradient(135deg, #888, #444); border-radius: 4px; }
      .card h3 { font-size: clamp(1rem, 5cqw, 1.75rem); margin: 0; line-height: 1.2; }
      .card p { font-size: clamp(0.85rem, 3cqw, 1rem); margin: 0; color: #555; }
      .card span { font-size: 0.75rem; color: #999; }
      .card:has(.thumb) { border-top: 3px solid #1a1a1a; }
      @container grid (min-width: 400px) {
        .card { padding: 2rem; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      }
      .app { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: 60px 1fr; grid-template-areas: "header header" "sidebar main"; min-height: 100vh; gap: 1rem; padding: 1rem; }
      .app-header { grid-area: header; background: #1a1a1a; color: white; padding: 1rem; }
      .app-sidebar { grid-area: sidebar; background: #eee; padding: 1rem; }
      .app-sidebar label { display: block; margin: 0.5rem 0; font-size: 0.9rem; }
      .app-sidebar label:has(input:checked) { background: #1a1a1a; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; display: inline-block; }
      .app-main { grid-area: main; padding: 0; }
      .featured { display: flex; gap: 1rem; padding: 1rem; overflow-x: auto; scroll-snap-type: x mandatory; }
      .f-item { flex: 0 0 280px; aspect-ratio: 4 / 3; background: #1a1a1a; color: white; padding: 1rem; border-radius: 8px; scroll-snap-align: start; }
    </style>
  </head>
  <body>
    <div class="app">
      <header class="app-header">Studio Nord</header>
      <aside class="app-sidebar">
        <h2>Filtri</h2>
        <label><input type="checkbox"> Residenziale</label>
        <label><input type="checkbox" checked> Commerciale</label>
      </aside>
      <section class="projects app-main">
        <div class="card"><div class="thumb"></div><h3>Casa sul lago</h3><p>Residenza privata sul Lago di Como, vista panoramica.</p><span>2024</span></div>
        <div class="card"><div class="thumb"></div><h3>Loft Brera</h3><p>Recupero industriale.</p><span>2023</span></div>
        <div class="card"><div class="thumb"></div><h3>Villa Riva</h3><p>Nuova costruzione bioclimatica con tetto verde e pannelli integrati.</p><span>2024</span></div>
        <div class="card"><div class="thumb"></div><h3>Studio Garibaldi</h3><p>Coworking 400mq.</p><span>2022</span></div>
        <div class="card"><div class="thumb"></div><h3>Atelier Navigli</h3><p>Spazio espositivo per giovane designer milanese.</p><span>2023</span></div>
        <div class="card"><div class="thumb"></div><h3>Cascina Nord</h3><p>Restauro conservativo.</p><span>2025</span></div>
      </section>
    </div>
    <section class="featured">
      <div class="f-item">Riviera</div>
      <div class="f-item">Loft Bovisa</div>
      <div class="f-item">Villa Sondrio</div>
      <div class="f-item">Cascina Po</div>
    </section>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: ".app-sidebar input[type=\"checkbox\"][checked]",
                    existsOnly: true,
                    message:
                        "Manca un <input type=\"checkbox\" checked> nella .app-sidebar.",
                },
                {
                    type: "textIncludes",
                    needle: ":has(",
                    flexible: true,
                    message:
                        "Devi usare il selettore :has() nello stile.",
                },
                {
                    type: "querySelector",
                    selector: ".app-sidebar h2",
                    existsOnly: true,
                    message:
                        "Manca <h2>Filtri</h2> nella .app-sidebar.",
                },
            ],
            message:
                ":has() applicato a .card e a label per styling condizionato dai figli.",
        },
        successScript:
            "FATTO! Hai costruito una dashboard portfolio completa con tutto il CSS del 2026: grid auto-fit, areas, subgrid, container queries, container units, aspect-ratio, scroll-snap, has(). Niente media query. Niente JavaScript. Solo CSS moderno. Ora la prossima volta che senti \"layout responsive\", non pensare al viewport — pensa al container. È un cambio di paradigma. Benvenuto nel CSS che il 90% dei dev ancora non usa.",
        encourageScript:
            "1) Nella .app-sidebar metti <h2>Filtri</h2> e 2 <label> con checkbox (uno checked). 2) Stile: .card:has(.thumb) { border-top:3px solid #1a1a1a; } e .app-sidebar label:has(input:checked) { background:#1a1a1a; color:white; padding:0.25rem 0.5rem; border-radius:4px; display:inline-block; }.",
    },
];

layoutModernoCourse.lessons = lessons;
layoutModernoCourse.finalCode = lessons[lessons.length - 1].expectedSnapshot;
