/**
 * Corso "html-semantico": dal div soup a un articolo blog semantico
 * e accessibile, comprensibile a Google e agli screen reader.
 *
 * Persona: Marco gestisce un blog di cucina ("Cucina Vera"). Ha
 * scritto la sua ricetta del ragù della nonna, ma il sito è un
 * mucchio di div nidificati. Vuole che Google la mostri nei
 * risultati ricchi e che chi usa uno screen reader possa navigarla
 * davvero. Niente più div soup.
 *
 * Filosofia: ogni tag semantico è una promessa al browser, a Google
 * e agli assistive tech. In 8 lezioni costruiamo un articolo blog
 * completo, semanticamente perfetto, con accessibilità di serie.
 *
 * Sequenza:
 *   M1: Skeleton semantico (lezioni 1-2)
 *   M2: Article structure (lezioni 3-4)
 *   M3: Navigation + relazioni (lezione 5)
 *   M4: ARIA + i18n (lezioni 6-7)
 *   M5: Styling finale (lezione 8)
 */
import type { Lesson, PlayCourse } from "@/data/play/types";

export const htmlSemanticoCourse: PlayCourse = {
    slug: "html-semantico",
    title: "HTML semantico (e accessibile)",
    subtitle:
        "Tag che parlano a Google e agli screen reader. Niente più div soup, struttura che si capisce davvero.",
    description:
        "Ogni div nel tuo HTML è un'occasione persa di dire al browser cosa contiene. In 8 lezioni costruirai l'articolo del blog di cucina di Marco — ricetta, foto, breadcrumbs, contenuti correlati — usando solo tag semantici e ARIA dove serve davvero. Alla fine avrai una pagina che Google ama, che gli screen reader navigano con piacere, e che resta leggibile anche senza CSS.",
    level: "base",
    subjects: ["html"],
    durationMin: 50,
    status: "live",
    initialCode: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Il ragù della nonna — Cucina Vera</title>
    <style></style>
  </head>
  <body>
    <!-- l'articolo si costruisce qui -->
  </body>
</html>`,
    finalCode: "",
    modules: [
        {
            order: 1,
            slug: "skeleton",
            title: "Skeleton semantico",
            summary:
                "header, main, footer e gerarchia heading: le ossa della pagina, leggibili anche al buio.",
        },
        {
            order: 2,
            slug: "article",
            title: "Article structure",
            summary:
                "article + header interno + time + figure/figcaption: il post diventa un'unità di senso.",
        },
        {
            order: 3,
            slug: "navigazione",
            title: "Navigazione e relazioni",
            summary:
                "aside per il correlato e nav per i breadcrumbs: il contesto intorno all'articolo.",
        },
        {
            order: 4,
            slug: "aria-i18n",
            title: "ARIA e internazionalizzazione",
            summary:
                "Landmark roles dove servono, lang sui blocchi multilingua, abbr per gli acronimi.",
        },
        {
            order: 5,
            slug: "styling",
            title: "CSS minimo",
            summary:
                "Poche regole CSS per dare forma: la semantica regge da sola, il design la rifinisce.",
        },
    ],
    lessons: [],
};

const lessons: Lesson[] = [
    // ────────────── MODULO 1: SKELETON SEMANTICO ─────────────────────────
    {
        order: 1,
        slug: "skeleton-semantico",
        title: "Le ossa della pagina: header, main, footer",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "Apri la home di un giornale, di un blog famoso, del New York Times: la struttura è sempre la stessa. C'è una testata in cima, il contenuto principale al centro, e qualcosa in fondo. Il problema è che il 90% dei siti scrive tutto questo con i div, e Google e gli screen reader si trovano davanti a una zuppa anonima. HTML5 ti dà tre tag che dicono il loro mestiere: header, main, footer. Mettiamoli e abbiamo già più senso di metà del web.",
        instruction:
            "Dentro <body>, sostituisci il commento con questa struttura: <header><h1>Cucina Vera</h1></header><main></main><footer><p>© 2026 Cucina Vera</p></footer>",
        hint: "Tre tag fratelli dentro il body: <header> con un <h1>, <main> vuoto per ora, <footer> con un <p> di copyright. Niente div, niente classi.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Il ragù della nonna — Cucina Vera</title>
    <style></style>
  </head>
  <body>
    <header>
      <h1>Cucina Vera</h1>
    </header>
    <main></main>
    <footer>
      <p>© 2026 Cucina Vera</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "body > header > h1",
                    existsOnly: true,
                    message:
                        "Manca <header> con dentro un <h1> come figlio diretto del body.",
                },
                {
                    type: "querySelector",
                    selector: "body > main",
                    existsOnly: true,
                    message: "Manca <main> come figlio diretto del body.",
                },
                {
                    type: "querySelector",
                    selector: "body > footer > p",
                    existsOnly: true,
                    message: "Manca <footer> con un <p> dentro.",
                },
            ],
            message: "Tre landmark: header, main, footer come figli del body.",
        },
        successScript:
            "Ecco la differenza: uno screen reader adesso può saltare direttamente al main con una scorciatoia. Senza questi tag dovrebbe leggersi tutta la testata ogni volta. Il tag racconta il mestiere.",
        encourageScript:
            "Tre tag fratelli dentro il body. <header> con <h1>Cucina Vera</h1> dentro. <main></main> vuoto. <footer> con <p>© 2026 Cucina Vera</p>.",
    },

    {
        order: 2,
        slug: "heading-hierarchy",
        title: "La gerarchia dei titoli: un h1, tanti h2",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "Pensa a un libro: c'è un titolo in copertina, poi i capitoli, poi i paragrafi. Mai due titoli in copertina. HTML funziona uguale: un solo h1 per pagina (il titolo principale), poi h2 per le sezioni e h3 per i sotto-paragrafi. Quando uno screen reader entra in una pagina, la prima cosa che fa è chiedere \"dammi i titoli\" — e si aspetta una scaletta. Se salti livelli o ne metti due h1, lo confondi.",
        instruction:
            "Dentro <main>, aggiungi un <article> con: <h1>Il ragù della nonna</h1>, poi <h2>Ingredienti</h2> e <h2>Procedimento</h2>, e dentro Procedimento un <h3>Soffritto</h3>.",
        hint: "Sposta l'h1 dentro l'article (è quello il titolo della pagina, non \"Cucina Vera\"). Quindi dentro <main><article> metti h1, h2 Ingredienti, h2 Procedimento, h3 Soffritto. In <header> trasforma h1 in un <p> col nome del blog.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Il ragù della nonna — Cucina Vera</title>
    <style></style>
  </head>
  <body>
    <header>
      <p>Cucina Vera</p>
    </header>
    <main>
      <article>
        <h1>Il ragù della nonna</h1>
        <h2>Ingredienti</h2>
        <h2>Procedimento</h2>
        <h3>Soffritto</h3>
      </article>
    </main>
    <footer>
      <p>© 2026 Cucina Vera</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "main > article > h1",
                    existsOnly: true,
                    message:
                        "L'h1 deve stare dentro <main><article>, non nell'header.",
                },
                {
                    type: "querySelector",
                    selector: "article h2",
                    existsOnly: true,
                    message:
                        "Mancano gli <h2> dentro l'article (Ingredienti, Procedimento).",
                },
                {
                    type: "querySelector",
                    selector: "article h3",
                    existsOnly: true,
                    message: "Manca un <h3> Soffritto dentro l'article.",
                },
            ],
            message:
                "Un h1 nell'article, due h2 sezione, un h3 sub-sezione. Header con <p>.",
        },
        successScript:
            "Una sola h1 per pagina: ricordatelo come una regola di sopravvivenza. La gerarchia adesso è una scaletta che lo screen reader può sfogliare.",
        encourageScript:
            "Sposta l'h1 dentro l'article. In header metti <p>Cucina Vera</p>. In article: h1 \"Il ragù della nonna\", h2 \"Ingredienti\", h2 \"Procedimento\", h3 \"Soffritto\".",
    },

    // ────────────── MODULO 2: ARTICLE STRUCTURE ──────────────────────────
    {
        order: 3,
        slug: "article-meta",
        title: "Metadati dell'articolo: data e autore",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "\"Quando è stato scritto?\" e \"chi l'ha scritto?\" sono le prime due domande che si fa chiunque legga un articolo online. HTML ha tag fatti apposta. Il tag time con l'attributo datetime dà a Google una data che capisce davvero (formato ISO), mentre agli umani mostri il formato che preferisci. L'autore va in un header dentro l'article — sì, header può stare anche dentro un article, è il \"sopra\" di quel pezzo, non solo di tutta la pagina.",
        instruction:
            "Subito dopo <article>, prima dell'h1, aggiungi: <header><p>di <strong>Marco Rossi</strong> · <time datetime=\"2026-04-12\">12 aprile 2026</time></p></header>. L'h1 e il resto restano dove sono.",
        hint: "Apri <header> dentro <article>, ci metti un <p> con \"di <strong>Marco Rossi</strong> · <time datetime=\"2026-04-12\">12 aprile 2026</time></p>\", poi chiudi </header>. L'h1 viene dopo questo header interno.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Il ragù della nonna — Cucina Vera</title>
    <style></style>
  </head>
  <body>
    <header>
      <p>Cucina Vera</p>
    </header>
    <main>
      <article>
        <header>
          <p>di <strong>Marco Rossi</strong> · <time datetime="2026-04-12">12 aprile 2026</time></p>
        </header>
        <h1>Il ragù della nonna</h1>
        <h2>Ingredienti</h2>
        <h2>Procedimento</h2>
        <h3>Soffritto</h3>
      </article>
    </main>
    <footer>
      <p>© 2026 Cucina Vera</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "article > header time[datetime=\"2026-04-12\"]",
                    existsOnly: true,
                    message:
                        "Serve un <time datetime=\"2026-04-12\"> dentro un <header> figlio dell'article.",
                },
                {
                    type: "querySelector",
                    selector: "article > header strong",
                    existsOnly: true,
                    message:
                        "Il nome dell'autore (Marco Rossi) deve stare in <strong> dentro l'header dell'article.",
                },
            ],
            message:
                "Header dentro article con autore in <strong> e <time datetime>.",
        },
        successScript:
            "Quel `datetime=\"2026-04-12\"` è oro per Google: capisce sempre la data, anche se in italiano scrivi \"12 aprile 2026\". E sì, due header nella stessa pagina vanno benissimo: uno per il sito, uno per l'articolo.",
        encourageScript:
            "Apri <header> dentro <article>, prima dell'h1. Dentro un <p>: di <strong>Marco Rossi</strong> · <time datetime=\"2026-04-12\">12 aprile 2026</time>. Chiudi </header>.",
    },

    {
        order: 4,
        slug: "figure-figcaption",
        title: "Figure + figcaption: l'immagine con la sua didascalia",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "L'immagine in un blog di cucina non è decorazione: è il piatto finito, è la prova che la ricetta funziona. Metterla in un div con un p sotto è uno spreco. HTML ha figure, che dice \"questo è un contenuto autonomo, illustrazione\", e figcaption, che è la didascalia legata semanticamente a quell'immagine. Lo screen reader le legge insieme. E l'alt resta obbligatorio — è il testo che vede chi non vede l'immagine.",
        instruction:
            "Subito dopo l'<h1>, aggiungi: <figure><img src=\"https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800\" alt=\"Pentola di ragù che sobbolle lentamente sul fornello\" /><figcaption>Il ragù dopo 4 ore: denso, scuro, profumato.</figcaption></figure>",
        hint: "Apri <figure> dopo l'h1. Dentro: <img src=\"...\" alt=\"...\" /> con alt descrittivo, e <figcaption> con la didascalia. Chiudi </figure>. L'alt non è opzionale: descrivi cosa si vede.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Il ragù della nonna — Cucina Vera</title>
    <style></style>
  </head>
  <body>
    <header>
      <p>Cucina Vera</p>
    </header>
    <main>
      <article>
        <header>
          <p>di <strong>Marco Rossi</strong> · <time datetime="2026-04-12">12 aprile 2026</time></p>
        </header>
        <h1>Il ragù della nonna</h1>
        <figure>
          <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800" alt="Pentola di ragù che sobbolle lentamente sul fornello" />
          <figcaption>Il ragù dopo 4 ore: denso, scuro, profumato.</figcaption>
        </figure>
        <h2>Ingredienti</h2>
        <h2>Procedimento</h2>
        <h3>Soffritto</h3>
      </article>
    </main>
    <footer>
      <p>© 2026 Cucina Vera</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "article figure img[alt]",
                    existsOnly: true,
                    message:
                        "Serve un <figure> con dentro un <img> con attributo alt.",
                },
                {
                    type: "querySelector",
                    selector: "article figure figcaption",
                    existsOnly: true,
                    message:
                        "Manca <figcaption> dentro <figure> per la didascalia.",
                },
            ],
            message:
                "Figure + img con alt descrittivo + figcaption con didascalia.",
        },
        successScript:
            "Lo screen reader adesso annuncia \"figura\" e poi legge l'alt e la didascalia in coppia. Hai trasformato un'immagine muta in un contenuto narrato.",
        encourageScript:
            "Dopo l'h1, apri <figure>. Dentro: <img src=\"...\" alt=\"Pentola di ragù che sobbolle lentamente sul fornello\" /> e <figcaption>Il ragù dopo 4 ore: denso, scuro, profumato.</figcaption>. Chiudi </figure>.",
    },

    // ────────────── MODULO 3: NAVIGAZIONE + RELAZIONI ────────────────────
    {
        order: 5,
        slug: "aside-nav",
        title: "Aside per il correlato, nav per i breadcrumbs",
        durationSec: 120,
        avatarMood: "talking",
        script:
            "Su un articolo serio non c'è solo l'articolo: c'è la \"strada per arrivare qui\" (i breadcrumbs in alto) e i contenuti correlati (le altre ricette in fondo). Sono cose diverse dal contenuto principale, e HTML ha tag dedicati. Il tag nav identifica la navigazione — Google e gli screen reader lo trattano come un landmark a parte. Aside è il \"a margine\": correlato ma non centrale, perfetto per i suggerimenti.",
        instruction:
            "Dentro l'header del sito (quello in alto, non quello dell'article), dopo il <p>Cucina Vera</p>, aggiungi: <nav aria-label=\"Breadcrumb\"><ol><li><a href=\"/\">Home</a></li><li><a href=\"/primi\">Primi</a></li><li>Ragù</li></ol></nav>. Poi dentro <main>, dopo </article>, aggiungi: <aside><h2>Ricette correlate</h2><ul><li><a href=\"#\">Lasagne al forno</a></li><li><a href=\"#\">Pappardelle al cinghiale</a></li></ul></aside>",
        hint: "Due pezzi: 1) <nav aria-label=\"Breadcrumb\"> nell'header del sito, contiene <ol> con 3 <li> (Home, Primi, Ragù). 2) <aside> dentro main dopo article, con h2 \"Ricette correlate\" + ul con 2 link.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Il ragù della nonna — Cucina Vera</title>
    <style></style>
  </head>
  <body>
    <header>
      <p>Cucina Vera</p>
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/primi">Primi</a></li>
          <li>Ragù</li>
        </ol>
      </nav>
    </header>
    <main>
      <article>
        <header>
          <p>di <strong>Marco Rossi</strong> · <time datetime="2026-04-12">12 aprile 2026</time></p>
        </header>
        <h1>Il ragù della nonna</h1>
        <figure>
          <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800" alt="Pentola di ragù che sobbolle lentamente sul fornello" />
          <figcaption>Il ragù dopo 4 ore: denso, scuro, profumato.</figcaption>
        </figure>
        <h2>Ingredienti</h2>
        <h2>Procedimento</h2>
        <h3>Soffritto</h3>
      </article>
      <aside>
        <h2>Ricette correlate</h2>
        <ul>
          <li><a href="#">Lasagne al forno</a></li>
          <li><a href="#">Pappardelle al cinghiale</a></li>
        </ul>
      </aside>
    </main>
    <footer>
      <p>© 2026 Cucina Vera</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "header nav[aria-label=\"Breadcrumb\"] ol",
                    existsOnly: true,
                    message:
                        "Manca <nav aria-label=\"Breadcrumb\"> con un <ol> dentro l'header del sito.",
                },
                {
                    type: "querySelector",
                    selector: "main > aside h2",
                    existsOnly: true,
                    message:
                        "Manca <aside> dentro main, con un <h2> per i correlati.",
                },
                {
                    type: "querySelector",
                    selector: "aside ul li a",
                    existsOnly: true,
                    message:
                        "L'aside deve contenere una lista <ul><li><a> di ricette correlate.",
                },
            ],
            message: "Nav breadcrumb in header sito + aside correlate in main.",
        },
        successScript:
            "I breadcrumbs in <ol> non sono pignoleria: l'ordine conta — Home → Primi → Ragù è una scala, e <ol> lo dice esplicitamente. Lo screen reader annuncia \"3 voci, voce 1 di 3, Home\". Roba seria.",
        encourageScript:
            "Nell'header del sito aggiungi <nav aria-label=\"Breadcrumb\"><ol> con 3 <li> (Home, Primi, Ragù). Dopo </article> in main: <aside> con <h2>Ricette correlate</h2><ul> di 2 link.",
    },

    // ────────────── MODULO 4: ARIA + I18N ────────────────────────────────
    {
        order: 6,
        slug: "aria-strategico",
        title: "ARIA solo dove HTML non basta",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Prima regola di ARIA: \"non usare ARIA\". Sembra un paradosso ma è il consiglio numero uno della W3C. <nav> implica già role=\"navigation\", <main> implica role=\"main\", <article> implica role=\"article\". Ripeterlo è rumore. Ma c'è un caso d'oro: quando hai due elementi dello stesso tipo (es. due nav), aria-label li distingue. E search non ha tag dedicato — lì role=\"search\" serve davvero.",
        instruction:
            "Aggiungi una seconda nav nel footer per i social: <nav aria-label=\"Social\"><a href=\"#\">Instagram</a> · <a href=\"#\">YouTube</a></nav>. Poi sopra l'article, dentro main, aggiungi una search bar: <form role=\"search\"><label for=\"q\">Cerca ricette</label><input type=\"search\" id=\"q\" name=\"q\" /></form>",
        hint: "Due aggiunte: 1) Nel footer prima del </footer>, una <nav aria-label=\"Social\"> con 2 link Instagram/YouTube. 2) Dentro <main>, prima di <article>, un <form role=\"search\"> con <label for=\"q\"> e <input type=\"search\" id=\"q\" name=\"q\">.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Il ragù della nonna — Cucina Vera</title>
    <style></style>
  </head>
  <body>
    <header>
      <p>Cucina Vera</p>
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/primi">Primi</a></li>
          <li>Ragù</li>
        </ol>
      </nav>
    </header>
    <main>
      <form role="search">
        <label for="q">Cerca ricette</label>
        <input type="search" id="q" name="q" />
      </form>
      <article>
        <header>
          <p>di <strong>Marco Rossi</strong> · <time datetime="2026-04-12">12 aprile 2026</time></p>
        </header>
        <h1>Il ragù della nonna</h1>
        <figure>
          <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800" alt="Pentola di ragù che sobbolle lentamente sul fornello" />
          <figcaption>Il ragù dopo 4 ore: denso, scuro, profumato.</figcaption>
        </figure>
        <h2>Ingredienti</h2>
        <h2>Procedimento</h2>
        <h3>Soffritto</h3>
      </article>
      <aside>
        <h2>Ricette correlate</h2>
        <ul>
          <li><a href="#">Lasagne al forno</a></li>
          <li><a href="#">Pappardelle al cinghiale</a></li>
        </ul>
      </aside>
    </main>
    <footer>
      <p>© 2026 Cucina Vera</p>
      <nav aria-label="Social">
        <a href="#">Instagram</a> · <a href="#">YouTube</a>
      </nav>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "footer nav[aria-label=\"Social\"]",
                    existsOnly: true,
                    message:
                        "Manca <nav aria-label=\"Social\"> nel footer.",
                },
                {
                    type: "querySelector",
                    selector: "main form[role=\"search\"]",
                    existsOnly: true,
                    message:
                        "Manca un <form role=\"search\"> dentro main.",
                },
                {
                    type: "querySelector",
                    selector:
                        "form[role=\"search\"] label[for=\"q\"] + input[type=\"search\"]#q",
                    existsOnly: true,
                    message:
                        "Il form search deve avere <label for=\"q\"> seguito da <input type=\"search\" id=\"q\">.",
                },
            ],
            message:
                "aria-label per distinguere le due nav, role=\"search\" sul form di ricerca.",
        },
        successScript:
            "Adesso uno screen reader sente \"navigazione Breadcrumb\" e \"navigazione Social\" — distinte. E il form di ricerca diventa un landmark a parte, raggiungibile con una scorciatoia. ARIA usato col bilancino, non a pioggia.",
        encourageScript:
            "Footer: aggiungi <nav aria-label=\"Social\"> con 2 <a> Instagram e YouTube. In main prima di article: <form role=\"search\"> con <label for=\"q\">Cerca ricette</label> e <input type=\"search\" id=\"q\" name=\"q\" />.",
    },

    {
        order: 7,
        slug: "lang-abbr",
        title: "Lang per il multilingua, abbr per gli acronimi",
        durationSec: 100,
        avatarMood: "talking",
        script:
            "L'attributo lang sull'html dice \"questa pagina è in italiano\". Ma se citi una frase in inglese o francese, lo screen reader la pronuncia con l'accento sbagliato — orribile. La soluzione è un span con lang=\"en\" sul pezzo straniero: la voce cambia idioma per quella frase e basta. E per gli acronimi c'è abbr, che aggiunge la spiegazione completa al passaggio del mouse e per chi usa assistive tech.",
        instruction:
            "Sostituisci il testo dell'h2 \"Procedimento\" con: <h2>Procedimento <abbr title=\"Slow Food\">SF</abbr>-style</h2>. Poi dentro l'article, dopo <h3>Soffritto</h3>, aggiungi: <p>Come dicono gli inglesi, <span lang=\"en\">low and slow</span>: fuoco basso, tempo lungo.</p>",
        hint: "Due cose: 1) Nell'h2 Procedimento, racchiudi SF in <abbr title=\"Slow Food\">SF</abbr>. 2) Dopo l'h3 Soffritto, un <p> con la frase in inglese dentro <span lang=\"en\">low and slow</span>.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Il ragù della nonna — Cucina Vera</title>
    <style></style>
  </head>
  <body>
    <header>
      <p>Cucina Vera</p>
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/primi">Primi</a></li>
          <li>Ragù</li>
        </ol>
      </nav>
    </header>
    <main>
      <form role="search">
        <label for="q">Cerca ricette</label>
        <input type="search" id="q" name="q" />
      </form>
      <article>
        <header>
          <p>di <strong>Marco Rossi</strong> · <time datetime="2026-04-12">12 aprile 2026</time></p>
        </header>
        <h1>Il ragù della nonna</h1>
        <figure>
          <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800" alt="Pentola di ragù che sobbolle lentamente sul fornello" />
          <figcaption>Il ragù dopo 4 ore: denso, scuro, profumato.</figcaption>
        </figure>
        <h2>Ingredienti</h2>
        <h2>Procedimento <abbr title="Slow Food">SF</abbr>-style</h2>
        <h3>Soffritto</h3>
        <p>Come dicono gli inglesi, <span lang="en">low and slow</span>: fuoco basso, tempo lungo.</p>
      </article>
      <aside>
        <h2>Ricette correlate</h2>
        <ul>
          <li><a href="#">Lasagne al forno</a></li>
          <li><a href="#">Pappardelle al cinghiale</a></li>
        </ul>
      </aside>
    </main>
    <footer>
      <p>© 2026 Cucina Vera</p>
      <nav aria-label="Social">
        <a href="#">Instagram</a> · <a href="#">YouTube</a>
      </nav>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "h2 abbr[title=\"Slow Food\"]",
                    existsOnly: true,
                    message:
                        "Manca <abbr title=\"Slow Food\">SF</abbr> nell'h2 Procedimento.",
                },
                {
                    type: "querySelector",
                    selector: "article p span[lang=\"en\"]",
                    existsOnly: true,
                    message:
                        "Manca <span lang=\"en\">low and slow</span> in un <p> dentro l'article.",
                },
            ],
            message:
                "abbr con title sull'acronimo + span lang per il pezzo in inglese.",
        },
        successScript:
            "Apri il sito su un Mac, attiva VoiceOver, fagli leggere quella riga: pronuncia \"low and slow\" in inglese vero. Senza il lang lo direbbe \"lov end slov\". Dettaglio piccolo, esperienza enorme.",
        encourageScript:
            "Nell'h2 Procedimento avvolgi SF in <abbr title=\"Slow Food\">. Dopo h3 Soffritto, un <p> con: Come dicono gli inglesi, <span lang=\"en\">low and slow</span>: fuoco basso, tempo lungo.",
    },

    // ────────────── MODULO 5: STYLING FINALE ─────────────────────────────
    {
        order: 8,
        slug: "css-minimal",
        title: "CSS minimo: la semantica si veste",
        durationSec: 130,
        avatarMood: "happy",
        script:
            "La semantica è perfetta, ma senza un filo di CSS sembra ancora una pagina di Wikipedia del 2003. Il bello è che con pochissime regole — usando direttamente i tag come selettori, senza una sola classe — l'articolo diventa leggibile. È la prova che HTML semantico ben fatto non ha bisogno di mille hook CSS: i tag stessi sono il design system.",
        instruction:
            "Riempi il <style> nel <head> con queste regole:\nbody { font-family: Georgia, serif; max-width: 720px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #1a1a1a; }\nbody > header { border-bottom: 1px solid #ddd; padding-bottom: 1rem; margin-bottom: 2rem; }\nnav[aria-label=\"Breadcrumb\"] ol { list-style: none; padding: 0; display: flex; gap: 0.5rem; font-size: 0.9rem; color: #666; }\nnav[aria-label=\"Breadcrumb\"] li:not(:last-child)::after { content: \" /\"; color: #aaa; }\narticle h1 { font-size: 2.5rem; line-height: 1.2; margin: 1rem 0; }\nfigure { margin: 2rem 0; }\nfigure img { width: 100%; border-radius: 8px; }\nfigcaption { font-size: 0.9rem; color: #666; text-align: center; margin-top: 0.5rem; font-style: italic; }\naside { margin-top: 3rem; padding: 1.5rem; background: #f5f1eb; border-radius: 8px; }",
        hint: "Tutte le regole vanno dentro <style></style> nel <head>. Selettori sui tag (body, article h1, figure, aside) e sugli attributi (nav[aria-label=\"Breadcrumb\"]). Niente classi.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Il ragù della nonna — Cucina Vera</title>
    <style>body { font-family: Georgia, serif; max-width: 720px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #1a1a1a; }
body > header { border-bottom: 1px solid #ddd; padding-bottom: 1rem; margin-bottom: 2rem; }
nav[aria-label="Breadcrumb"] ol { list-style: none; padding: 0; display: flex; gap: 0.5rem; font-size: 0.9rem; color: #666; }
nav[aria-label="Breadcrumb"] li:not(:last-child)::after { content: " /"; color: #aaa; }
article h1 { font-size: 2.5rem; line-height: 1.2; margin: 1rem 0; }
figure { margin: 2rem 0; }
figure img { width: 100%; border-radius: 8px; }
figcaption { font-size: 0.9rem; color: #666; text-align: center; margin-top: 0.5rem; font-style: italic; }
aside { margin-top: 3rem; padding: 1.5rem; background: #f5f1eb; border-radius: 8px; }</style>
  </head>
  <body>
    <header>
      <p>Cucina Vera</p>
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/primi">Primi</a></li>
          <li>Ragù</li>
        </ol>
      </nav>
    </header>
    <main>
      <form role="search">
        <label for="q">Cerca ricette</label>
        <input type="search" id="q" name="q" />
      </form>
      <article>
        <header>
          <p>di <strong>Marco Rossi</strong> · <time datetime="2026-04-12">12 aprile 2026</time></p>
        </header>
        <h1>Il ragù della nonna</h1>
        <figure>
          <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800" alt="Pentola di ragù che sobbolle lentamente sul fornello" />
          <figcaption>Il ragù dopo 4 ore: denso, scuro, profumato.</figcaption>
        </figure>
        <h2>Ingredienti</h2>
        <h2>Procedimento <abbr title="Slow Food">SF</abbr>-style</h2>
        <h3>Soffritto</h3>
        <p>Come dicono gli inglesi, <span lang="en">low and slow</span>: fuoco basso, tempo lungo.</p>
      </article>
      <aside>
        <h2>Ricette correlate</h2>
        <ul>
          <li><a href="#">Lasagne al forno</a></li>
          <li><a href="#">Pappardelle al cinghiale</a></li>
        </ul>
      </aside>
    </main>
    <footer>
      <p>© 2026 Cucina Vera</p>
      <nav aria-label="Social">
        <a href="#">Instagram</a> · <a href="#">YouTube</a>
      </nav>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "font-family: Georgia",
                    flexible: true,
                    message:
                        "Aggiungi font-family: Georgia, serif sul body nel <style>.",
                },
                {
                    type: "textIncludes",
                    needle: "max-width: 720px",
                    flexible: true,
                    message:
                        "Il body deve avere max-width: 720px per la colonna leggibile.",
                },
                {
                    type: "textIncludes",
                    needle: "nav[aria-label=\"Breadcrumb\"]",
                    flexible: true,
                    message:
                        "Servono regole CSS che usino il selettore nav[aria-label=\"Breadcrumb\"].",
                },
                {
                    type: "textIncludes",
                    needle: "aside",
                    flexible: true,
                    message:
                        "Manca una regola CSS per l'aside (sfondo, padding, border-radius).",
                },
            ],
            message:
                "CSS nel <style> con regole su body, header, nav breadcrumb, article h1, figure, aside.",
        },
        successScript:
            "FINITO! Hai un articolo blog completo, semanticamente perfetto, accessibile, indicizzabile. Zero classi inventate, zero div soup. Apri il file con uno screen reader: ti accorgerai che la pagina si racconta da sola. Questa è la base — adesso puoi aggiungerci tutto il design che vuoi e la struttura regge.",
        encourageScript:
            "Tutto il CSS va dentro <style> nel <head>. Selettori sui tag (body, article h1, figure, aside) e attributi (nav[aria-label=\"Breadcrumb\"] ol). Copia le 9 regole nell'istruzione, niente classi.",
    },
];

htmlSemanticoCourse.lessons = lessons;
htmlSemanticoCourse.finalCode = lessons[lessons.length - 1].expectedSnapshot;
