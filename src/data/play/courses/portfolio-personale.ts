/**
 * Corso 2: "Costruisci il tuo portfolio personale".
 *
 * Livello: base+ (per chi ha completato primo-sito o ha basi HTML/CSS).
 *
 * Design philosophy: ogni lezione introduce UNA tecnica moderna che da
 * sola dà un salto visivo netto. La sequenza:
 *   M1: Struttura semantica + Bricolage Grotesque
 *   M2: Sticky nav + hero personale + grid about
 *   M3: Projects gallery con CSS Grid + hover effects + form contatto
 *   M4: WOW finale → DARK MODE CSS-ONLY (con :has())
 *
 * Sito target: portfolio professionale di "Anna Conte", designer
 * freelance. Il risultato è pubblicabile e adatto a un vero portfolio.
 */
import type { Lesson, PlayCourse } from "@/data/play/types";

export const portfolioPersonaleCourse: PlayCourse = {
    slug: "portfolio-personale",
    title: "Il tuo portfolio personale (con dark mode!)",
    subtitle:
        "Costruisci un portfolio che spicca: navigation sticky, gallery con CSS Grid, e dark mode senza una riga di JavaScript",
    description:
        "Un portfolio professionale che potresti usare davvero per cercare lavoro come designer o developer. 9 lezioni che insegnano tecniche moderne (Grid, sticky positioning, media query, :has()) costruendo passo per passo il sito di Anna Conte, designer freelance. La mossa finale — dark mode CSS-only — è il tipo di trucco che fa pensare 'questo sa quello che fa'.",
    level: "base",
    subjects: ["html", "css"],
    durationMin: 40,
    status: "live",
    initialCode: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Anna Conte — Designer</title>
  </head>
  <body>
    <!-- il portfolio si costruisce qui -->
  </body>
</html>`,
    finalCode: "",
    modules: [
        {
            order: 1,
            slug: "struttura",
            title: "Struttura del portfolio",
            summary:
                "Skeleton semantico (header con nav, sezioni about/projects/contact, footer) e font moderno.",
        },
        {
            order: 2,
            slug: "hero-about",
            title: "Hero personale + about",
            summary:
                "Sticky nav con backdrop blur, hero con foto, sezione about a 2 colonne con CSS Grid.",
        },
        {
            order: 3,
            slug: "projects-contact",
            title: "Galleria progetti + contatti",
            summary:
                "Projects gallery con CSS Grid auto-fit, hover che rivela info, form contatto pulito.",
        },
        {
            order: 4,
            slug: "polish",
            title: "Polish: responsive + dark mode",
            summary:
                "Una sola @media query e il sito è perfetto su mobile. Poi il colpo finale: dark mode con :has(), zero JavaScript.",
        },
    ],
    lessons: [],
};

const lessons: Lesson[] = [
    // ────────────── MODULO 1: STRUTTURA + FONT ───────────────────────────
    {
        order: 1,
        slug: "skeleton-semantico",
        title: "Lo scheletro completo del portfolio",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Un portfolio ha più sezioni di una landing. Mettiamole tutte insieme nello scheletro: header con dentro nav, poi un main che contiene hero, about, projects e contact, e in fondo il footer. È un sacco da fare ma è solo HTML — niente di magico, solo tag uno dentro l'altro.",
        instruction:
            "Dentro <body> aggiungi: <header><nav><a href=\"#about\">About</a><a href=\"#projects\">Progetti</a><a href=\"#contact\">Contatti</a></nav></header>, poi <main> con dentro <section id=\"hero\"><h1>Anna Conte</h1><p>Designer freelance a Milano</p></section><section id=\"about\"></section><section id=\"projects\"></section><section id=\"contact\"></section></main>, e infine <footer><p>© 2026 Anna Conte</p></footer>",
        hint: "Quattro section vuote (hero, about, projects, contact) dentro main. Nav contiene 3 link. Footer con un p.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Anna Conte — Designer</title>
  </head>
  <body>
    <header>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Progetti</a>
        <a href="#contact">Contatti</a>
      </nav>
    </header>
    <main>
      <section id="hero">
        <h1>Anna Conte</h1>
        <p>Designer freelance a Milano</p>
      </section>
      <section id="about"></section>
      <section id="projects"></section>
      <section id="contact"></section>
    </main>
    <footer>
      <p>© 2026 Anna Conte</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                { type: "querySelector", selector: "header nav a[href='#about']", existsOnly: true, message: "Manca link About nel nav." },
                { type: "querySelector", selector: "section#hero h1", textContent: "Anna Conte", message: "Manca <section id=\"hero\"> con h1 'Anna Conte'." },
                { type: "querySelector", selector: "section#projects", existsOnly: true, message: "Manca <section id=\"projects\">." },
                { type: "querySelector", selector: "footer p", existsOnly: true, message: "Manca <footer> con p." },
            ],
            message: "Header con nav, main con 4 sezioni, footer.",
        },
        successScript:
            "Sembra HTML nudo, ma le sezioni con id sono già pronte per i link interni. Adesso il font.",
        encourageScript:
            "Tre link in nav (#about, #projects, #contact). Quattro section in main. Footer con un p.",
    },

    {
        order: 2,
        slug: "font-google",
        title: "Font moderno + reset di base",
        durationSec: 90,
        avatarMood: "talking",
        script:
            "Carichiamo Bricolage Grotesque da Google Fonts come abbiamo fatto nel corso precedente, mettiamo il reset asterisco, e diamo al body uno sfondo crema, font moderno e padding generoso. Aggiungiamo una variabile colore per l'accento, così la cambiamo in un punto solo.",
        instruction:
            "Dentro <head>: <link href=\"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap\" rel=\"stylesheet\" />. Poi <style> con * { margin: 0; padding: 0; box-sizing: border-box; } :root { --accent: #ec4899; --bg: #fafaf9; --fg: #1c1917; --muted: #78716c; } body { font-family: 'Bricolage Grotesque', system-ui, sans-serif; background: var(--bg); color: var(--fg); line-height: 1.6; }",
        hint: "Link a Google Fonts in head, poi style con reset (*), :root con 4 variabili (--accent, --bg, --fg, --muted), e body con font/colori.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Anna Conte — Designer</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :root {
        --accent: #ec4899;
        --bg: #fafaf9;
        --fg: #1c1917;
        --muted: #78716c;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        background: var(--bg);
        color: var(--fg);
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <header>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Progetti</a>
        <a href="#contact">Contatti</a>
      </nav>
    </header>
    <main>
      <section id="hero">
        <h1>Anna Conte</h1>
        <p>Designer freelance a Milano</p>
      </section>
      <section id="about"></section>
      <section id="projects"></section>
      <section id="contact"></section>
    </main>
    <footer>
      <p>© 2026 Anna Conte</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                { type: "textIncludes", needle: "Bricolage+Grotesque", flexible: true, message: "Manca il link Google Fonts." },
                { type: "computedStyle", selector: "body", property: "background-color", value: "rgb(250, 250, 249)", message: "Body deve avere background var(--bg) = #fafaf9." },
            ],
            message: "Font Bricolage + reset + variabili colore + body styled.",
        },
        successScript:
            "Stessa pagina di prima ma con un'aria completamente diversa. Il font è il 30% del lavoro design.",
        encourageScript:
            "Link Google Fonts + style con reset, :root con 4 variabili, body con font-family e background var(--bg).",
    },

    // ────────────── MODULO 2: NAV STICKY + HERO + ABOUT ──────────────────
    {
        order: 3,
        slug: "nav-sticky-blur",
        title: "Sticky nav con effetto vetro",
        durationSec: 120,
        avatarMood: "talking",
        script:
            "Adesso una mossa moderna: la nav che resta in alto mentre scrolli, con un effetto vetro smerigliato. Si fa con position sticky, top zero, e backdrop-filter blur. È quel pattern che usano siti tipo Apple e Stripe. Aggiungiamo anche stile ai link.",
        instruction:
            "Aggiungi nello <style>: header { position: sticky; top: 0; z-index: 10; background: rgba(250, 250, 249, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0, 0, 0, 0.06); padding: 16px 32px; } nav { display: flex; gap: 24px; justify-content: flex-end; max-width: 1200px; margin: 0 auto; } nav a { color: var(--fg); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 200ms; } nav a:hover { color: var(--accent); }",
        hint: "header { position: sticky; top: 0; backdrop-filter: blur(12px); ... }. nav { display: flex; gap: 24px; ... }. nav a { ... transition + hover con color: var(--accent) }.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Anna Conte — Designer</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :root {
        --accent: #ec4899;
        --bg: #fafaf9;
        --fg: #1c1917;
        --muted: #78716c;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        background: var(--bg);
        color: var(--fg);
        line-height: 1.6;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(250, 250, 249, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding: 16px 32px;
      }
      nav {
        display: flex;
        gap: 24px;
        justify-content: flex-end;
        max-width: 1200px;
        margin: 0 auto;
      }
      nav a {
        color: var(--fg);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 200ms;
      }
      nav a:hover {
        color: var(--accent);
      }
    </style>
  </head>
  <body>
    <header>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Progetti</a>
        <a href="#contact">Contatti</a>
      </nav>
    </header>
    <main>
      <section id="hero">
        <h1>Anna Conte</h1>
        <p>Designer freelance a Milano</p>
      </section>
      <section id="about"></section>
      <section id="projects"></section>
      <section id="contact"></section>
    </main>
    <footer>
      <p>© 2026 Anna Conte</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                { type: "computedStyle", selector: "header", property: "position", value: "sticky", message: "Header deve avere position: sticky." },
                { type: "textIncludes", needle: "backdrop-filter", flexible: true, message: "Manca backdrop-filter sull'header (per l'effetto vetro)." },
            ],
            message: "Header sticky con backdrop blur + nav con link stilizzati.",
        },
        successScript:
            "Scrolla la pagina e guarda: la nav resta in alto, semitrasparente. È il dettaglio che separa un sito amatoriale da uno fatto da chi sa.",
        encourageScript:
            "header { position: sticky; top: 0; backdrop-filter: blur(12px); ... }. Plus nav { display: flex; gap; justify-content: flex-end; }.",
    },

    {
        order: 4,
        slug: "hero-personale",
        title: "Hero con foto e bio breve",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Adesso l'hero. Anna è una persona, non un brand astratto: mettiamo la sua foto a sinistra e nome+bio a destra. Usiamo CSS Grid a 2 colonne. La foto è un placeholder da picsum, l'h1 è gigante con clamp, e c'è un sottotitolo discreto.",
        instruction:
            "Modifica la sezione hero in HTML: <section id=\"hero\"><div class=\"hero-grid\"><img src=\"https://i.pravatar.cc/400?img=47\" alt=\"Foto di Anna\" /><div><h1>Anna Conte</h1><p class=\"role\">Designer freelance a Milano</p><p class=\"bio\">Disegno identità visive per piccole imprese e startup. 12 anni di esperienza, 200+ progetti consegnati.</p></div></div></section>. Poi nel CSS: #hero { padding: 96px 32px; max-width: 1200px; margin: 0 auto; } .hero-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 48px; align-items: center; } .hero-grid img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 24px; } #hero h1 { font-size: clamp(48px, 8vw, 96px); font-weight: 700; letter-spacing: -0.04em; line-height: 1; } #hero .role { color: var(--accent); font-size: 18px; font-weight: 500; margin-top: 16px; } #hero .bio { color: var(--muted); font-size: 18px; margin-top: 24px; max-width: 480px; }",
        hint: "Tre cambi: HTML hero con foto + div con h1+role+bio. CSS .hero-grid con grid-template-columns: 1fr 2fr. Stili #hero h1, .role, .bio.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Anna Conte — Designer</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :root {
        --accent: #ec4899;
        --bg: #fafaf9;
        --fg: #1c1917;
        --muted: #78716c;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        background: var(--bg);
        color: var(--fg);
        line-height: 1.6;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(250, 250, 249, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding: 16px 32px;
      }
      nav {
        display: flex;
        gap: 24px;
        justify-content: flex-end;
        max-width: 1200px;
        margin: 0 auto;
      }
      nav a {
        color: var(--fg);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 200ms;
      }
      nav a:hover {
        color: var(--accent);
      }
      #hero {
        padding: 96px 32px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 48px;
        align-items: center;
      }
      .hero-grid img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 24px;
      }
      #hero h1 {
        font-size: clamp(48px, 8vw, 96px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 1;
      }
      #hero .role {
        color: var(--accent);
        font-size: 18px;
        font-weight: 500;
        margin-top: 16px;
      }
      #hero .bio {
        color: var(--muted);
        font-size: 18px;
        margin-top: 24px;
        max-width: 480px;
      }
    </style>
  </head>
  <body>
    <header>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Progetti</a>
        <a href="#contact">Contatti</a>
      </nav>
    </header>
    <main>
      <section id="hero">
        <div class="hero-grid">
          <img src="https://i.pravatar.cc/400?img=47" alt="Foto di Anna" />
          <div>
            <h1>Anna Conte</h1>
            <p class="role">Designer freelance a Milano</p>
            <p class="bio">Disegno identità visive per piccole imprese e startup. 12 anni di esperienza, 200+ progetti consegnati.</p>
          </div>
        </div>
      </section>
      <section id="about"></section>
      <section id="projects"></section>
      <section id="contact"></section>
    </main>
    <footer>
      <p>© 2026 Anna Conte</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                { type: "querySelector", selector: ".hero-grid img", existsOnly: true, message: "Manca <img> dentro .hero-grid." },
                { type: "computedStyle", selector: ".hero-grid", property: "display", value: "grid", message: ".hero-grid deve avere display: grid." },
            ],
            message: "Hero a 2 colonne con foto + nome/bio.",
        },
        successScript:
            "Foto + testo a fianco. È il pattern di portfolio per eccellenza: ti vedo, ti leggo, mi convinco.",
        encourageScript:
            "HTML: aggiungi .hero-grid con img + div(h1+role+bio). CSS: .hero-grid display: grid e grid-template-columns: 1fr 2fr.",
    },

    // ────────────── MODULO 3: ABOUT + PROJECTS + CONTATTO ────────────────
    {
        order: 5,
        slug: "about-section",
        title: "Sezione About con paragrafi e skills",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Sezione about: un titolo grosso, un paio di paragrafi sulla persona, e una lista di competenze in tag. La mettiamo in un container limitato per leggibilità (max 720 pixel di larghezza), e diamo alla sezione padding generoso. Le skill diventano piccoli badge con sfondo accent leggero.",
        instruction:
            "Modifica HTML: <section id=\"about\"><h2>Chi sono</h2><p>Lavoro come designer dal 2014. Sono cresciuta tra carta e pixel, e cerco sempre il punto in cui le due cose si incontrano.</p><p>Lavoro con piccole realtà che hanno qualcosa di vero da dire, e gli aiuto a dirlo bene.</p><div class=\"skills\"><span>Brand identity</span><span>UI design</span><span>Tipografia</span><span>Illustrazione</span><span>Web</span></div></section>. CSS: #about { padding: 96px 32px; max-width: 720px; margin: 0 auto; } #about h2 { font-size: clamp(36px, 5vw, 56px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 32px; } #about p { font-size: 18px; color: var(--muted); margin-bottom: 16px; } .skills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; } .skills span { padding: 6px 14px; background: color-mix(in srgb, var(--accent) 12%, transparent); color: var(--accent); border-radius: 999px; font-size: 14px; font-weight: 500; }",
        hint: "Aggiungi h2, due p, e .skills con 5 span. Stili: #about con padding+max-width 720px. .skills display: flex flex-wrap gap. .skills span con background color-mix per il rosa trasparente.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Anna Conte — Designer</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :root {
        --accent: #ec4899;
        --bg: #fafaf9;
        --fg: #1c1917;
        --muted: #78716c;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        background: var(--bg);
        color: var(--fg);
        line-height: 1.6;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(250, 250, 249, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding: 16px 32px;
      }
      nav {
        display: flex;
        gap: 24px;
        justify-content: flex-end;
        max-width: 1200px;
        margin: 0 auto;
      }
      nav a {
        color: var(--fg);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 200ms;
      }
      nav a:hover {
        color: var(--accent);
      }
      #hero {
        padding: 96px 32px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 48px;
        align-items: center;
      }
      .hero-grid img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 24px;
      }
      #hero h1 {
        font-size: clamp(48px, 8vw, 96px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 1;
      }
      #hero .role {
        color: var(--accent);
        font-size: 18px;
        font-weight: 500;
        margin-top: 16px;
      }
      #hero .bio {
        color: var(--muted);
        font-size: 18px;
        margin-top: 24px;
        max-width: 480px;
      }
      #about {
        padding: 96px 32px;
        max-width: 720px;
        margin: 0 auto;
      }
      #about h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-bottom: 32px;
      }
      #about p {
        font-size: 18px;
        color: var(--muted);
        margin-bottom: 16px;
      }
      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 32px;
      }
      .skills span {
        padding: 6px 14px;
        background: color-mix(in srgb, var(--accent) 12%, transparent);
        color: var(--accent);
        border-radius: 999px;
        font-size: 14px;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <header>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Progetti</a>
        <a href="#contact">Contatti</a>
      </nav>
    </header>
    <main>
      <section id="hero">
        <div class="hero-grid">
          <img src="https://i.pravatar.cc/400?img=47" alt="Foto di Anna" />
          <div>
            <h1>Anna Conte</h1>
            <p class="role">Designer freelance a Milano</p>
            <p class="bio">Disegno identità visive per piccole imprese e startup. 12 anni di esperienza, 200+ progetti consegnati.</p>
          </div>
        </div>
      </section>
      <section id="about">
        <h2>Chi sono</h2>
        <p>Lavoro come designer dal 2014. Sono cresciuta tra carta e pixel, e cerco sempre il punto in cui le due cose si incontrano.</p>
        <p>Lavoro con piccole realtà che hanno qualcosa di vero da dire, e gli aiuto a dirlo bene.</p>
        <div class="skills">
          <span>Brand identity</span>
          <span>UI design</span>
          <span>Tipografia</span>
          <span>Illustrazione</span>
          <span>Web</span>
        </div>
      </section>
      <section id="projects"></section>
      <section id="contact"></section>
    </main>
    <footer>
      <p>© 2026 Anna Conte</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                { type: "querySelector", selector: "#about h2", existsOnly: true, message: "Manca <h2> dentro #about." },
                { type: "querySelector", selector: ".skills span:nth-of-type(5)", existsOnly: true, message: "Servono 5 <span> dentro .skills." },
            ],
            message: "About con h2, paragrafi e 5 skill badge.",
        },
        successScript:
            "color-mix è una funzione CSS recente: ti permette di mescolare colori al volo. Qua tira fuori un rosa pastello dal nostro accent.",
        encourageScript:
            "HTML: h2, due p, .skills con 5 span. CSS: #about padding+max-width 720, .skills display: flex flex-wrap, .skills span con color-mix per il bg.",
    },

    {
        order: 6,
        slug: "projects-grid",
        title: "Galleria progetti con CSS Grid",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Adesso il pezzo che fa portfolio: la galleria progetti. Usiamo CSS Grid con auto-fit, una funzione magica che dispone le card automaticamente in base alla larghezza dello schermo. Niente media query, il browser si arrangia. Le card sono semplici: immagine grande, titolo sotto, una riga di descrizione.",
        instruction:
            "HTML projects: <section id=\"projects\"><h2>Progetti recenti</h2><div class=\"grid\"><a href=\"#\" class=\"card\"><img src=\"https://picsum.photos/seed/p1/600/400\" alt=\"\" /><h3>Brand identity Sofà</h3><p>Logo, palette, sistema visivo</p></a><a href=\"#\" class=\"card\"><img src=\"https://picsum.photos/seed/p2/600/400\" alt=\"\" /><h3>App fitness Pulse</h3><p>UI mobile e icone custom</p></a><a href=\"#\" class=\"card\"><img src=\"https://picsum.photos/seed/p3/600/400\" alt=\"\" /><h3>Sito Atelier B</h3><p>Brand site editoriale</p></a><a href=\"#\" class=\"card\"><img src=\"https://picsum.photos/seed/p4/600/400\" alt=\"\" /><h3>Packaging Korà</h3><p>Linea cosmetici naturali</p></a></div></section>. CSS: #projects { padding: 96px 32px; max-width: 1200px; margin: 0 auto; } #projects h2 { font-size: clamp(36px, 5vw, 56px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 48px; } .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; } .card { display: block; text-decoration: none; color: inherit; transition: transform 300ms; } .card:hover { transform: translateY(-4px); } .card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 16px; margin-bottom: 16px; } .card h3 { font-size: 18px; font-weight: 600; letter-spacing: -0.01em; } .card p { color: var(--muted); font-size: 14px; margin-top: 4px; }",
        hint: ".grid usa repeat(auto-fit, minmax(280px, 1fr)): le card si dispongono automaticamente, niente media query. Il resto è card: img + h3 + p, con hover che le solleva.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Anna Conte — Designer</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :root {
        --accent: #ec4899;
        --bg: #fafaf9;
        --fg: #1c1917;
        --muted: #78716c;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        background: var(--bg);
        color: var(--fg);
        line-height: 1.6;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(250, 250, 249, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding: 16px 32px;
      }
      nav {
        display: flex;
        gap: 24px;
        justify-content: flex-end;
        max-width: 1200px;
        margin: 0 auto;
      }
      nav a {
        color: var(--fg);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 200ms;
      }
      nav a:hover {
        color: var(--accent);
      }
      #hero {
        padding: 96px 32px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 48px;
        align-items: center;
      }
      .hero-grid img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 24px;
      }
      #hero h1 {
        font-size: clamp(48px, 8vw, 96px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 1;
      }
      #hero .role {
        color: var(--accent);
        font-size: 18px;
        font-weight: 500;
        margin-top: 16px;
      }
      #hero .bio {
        color: var(--muted);
        font-size: 18px;
        margin-top: 24px;
        max-width: 480px;
      }
      #about {
        padding: 96px 32px;
        max-width: 720px;
        margin: 0 auto;
      }
      #about h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-bottom: 32px;
      }
      #about p {
        font-size: 18px;
        color: var(--muted);
        margin-bottom: 16px;
      }
      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 32px;
      }
      .skills span {
        padding: 6px 14px;
        background: color-mix(in srgb, var(--accent) 12%, transparent);
        color: var(--accent);
        border-radius: 999px;
        font-size: 14px;
        font-weight: 500;
      }
      #projects {
        padding: 96px 32px;
        max-width: 1200px;
        margin: 0 auto;
      }
      #projects h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-bottom: 48px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }
      .card {
        display: block;
        text-decoration: none;
        color: inherit;
        transition: transform 300ms;
      }
      .card:hover {
        transform: translateY(-4px);
      }
      .card img {
        width: 100%;
        aspect-ratio: 4/3;
        object-fit: cover;
        border-radius: 16px;
        margin-bottom: 16px;
      }
      .card h3 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .card p {
        color: var(--muted);
        font-size: 14px;
        margin-top: 4px;
      }
    </style>
  </head>
  <body>
    <header>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Progetti</a>
        <a href="#contact">Contatti</a>
      </nav>
    </header>
    <main>
      <section id="hero">
        <div class="hero-grid">
          <img src="https://i.pravatar.cc/400?img=47" alt="Foto di Anna" />
          <div>
            <h1>Anna Conte</h1>
            <p class="role">Designer freelance a Milano</p>
            <p class="bio">Disegno identità visive per piccole imprese e startup. 12 anni di esperienza, 200+ progetti consegnati.</p>
          </div>
        </div>
      </section>
      <section id="about">
        <h2>Chi sono</h2>
        <p>Lavoro come designer dal 2014. Sono cresciuta tra carta e pixel, e cerco sempre il punto in cui le due cose si incontrano.</p>
        <p>Lavoro con piccole realtà che hanno qualcosa di vero da dire, e gli aiuto a dirlo bene.</p>
        <div class="skills">
          <span>Brand identity</span>
          <span>UI design</span>
          <span>Tipografia</span>
          <span>Illustrazione</span>
          <span>Web</span>
        </div>
      </section>
      <section id="projects">
        <h2>Progetti recenti</h2>
        <div class="grid">
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p1/600/400" alt="" />
            <h3>Brand identity Sofà</h3>
            <p>Logo, palette, sistema visivo</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p2/600/400" alt="" />
            <h3>App fitness Pulse</h3>
            <p>UI mobile e icone custom</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p3/600/400" alt="" />
            <h3>Sito Atelier B</h3>
            <p>Brand site editoriale</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p4/600/400" alt="" />
            <h3>Packaging Korà</h3>
            <p>Linea cosmetici naturali</p>
          </a>
        </div>
      </section>
      <section id="contact"></section>
    </main>
    <footer>
      <p>© 2026 Anna Conte</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                { type: "querySelector", selector: ".grid .card:nth-of-type(4)", existsOnly: true, message: "Servono 4 .card dentro .grid." },
                { type: "computedStyle", selector: ".grid", property: "display", value: "grid", message: ".grid deve avere display: grid." },
                { type: "textIncludes", needle: "auto-fit", flexible: true, message: "Manca auto-fit nel grid-template-columns." },
            ],
            message: "Galleria progetti con CSS Grid auto-fit + 4 card hover.",
        },
        successScript:
            "Allarga e stringi la finestra: le card si riarrangiano da sole. È il superpotere di auto-fit + minmax. Niente media query, il browser fa il lavoro.",
        encourageScript:
            "HTML: 4 .card con img+h3+p dentro .grid. CSS: .grid display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;.",
    },

    {
        order: 7,
        slug: "contact-form",
        title: "Form di contatto pulito",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Sezione contatto: un form semplice con nome, email, messaggio. Senza JavaScript, solo HTML e CSS. Diamo agli input bordi sottili che si scuriscono al focus, padding generoso, font ereditato. Il bottone invia è pillola con accento.",
        instruction:
            "HTML contact: <section id=\"contact\"><h2>Lavoriamo insieme</h2><p>Raccontami il tuo progetto.</p><form><label><span>Nome</span><input type=\"text\" required /></label><label><span>Email</span><input type=\"email\" required /></label><label><span>Il tuo progetto</span><textarea rows=\"4\" required></textarea></label><button type=\"submit\">Invia</button></form></section>. CSS: #contact { padding: 96px 32px; max-width: 560px; margin: 0 auto; } #contact h2 { font-size: clamp(36px, 5vw, 56px); font-weight: 700; letter-spacing: -0.03em; } #contact > p { color: var(--muted); font-size: 18px; margin-top: 16px; margin-bottom: 32px; } form { display: flex; flex-direction: column; gap: 20px; } label { display: flex; flex-direction: column; gap: 6px; } label span { font-size: 13px; font-weight: 500; color: var(--muted); } input, textarea { font-family: inherit; font-size: 16px; padding: 12px 16px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 12px; background: white; color: var(--fg); transition: border-color 200ms; } input:focus, textarea:focus { outline: none; border-color: var(--fg); } button { font-family: inherit; font-size: 14px; font-weight: 500; padding: 14px 28px; background: var(--fg); color: var(--bg); border: none; border-radius: 999px; cursor: pointer; transition: transform 200ms; align-self: flex-start; } button:hover { transform: scale(1.03); }",
        hint: "Form con 3 campi (input nome, input email, textarea). CSS: input/textarea con padding+border-radius 12px, button pill con scale al hover.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Anna Conte — Designer</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :root {
        --accent: #ec4899;
        --bg: #fafaf9;
        --fg: #1c1917;
        --muted: #78716c;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        background: var(--bg);
        color: var(--fg);
        line-height: 1.6;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(250, 250, 249, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding: 16px 32px;
      }
      nav {
        display: flex;
        gap: 24px;
        justify-content: flex-end;
        max-width: 1200px;
        margin: 0 auto;
      }
      nav a {
        color: var(--fg);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 200ms;
      }
      nav a:hover {
        color: var(--accent);
      }
      #hero {
        padding: 96px 32px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 48px;
        align-items: center;
      }
      .hero-grid img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 24px;
      }
      #hero h1 {
        font-size: clamp(48px, 8vw, 96px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 1;
      }
      #hero .role {
        color: var(--accent);
        font-size: 18px;
        font-weight: 500;
        margin-top: 16px;
      }
      #hero .bio {
        color: var(--muted);
        font-size: 18px;
        margin-top: 24px;
        max-width: 480px;
      }
      #about {
        padding: 96px 32px;
        max-width: 720px;
        margin: 0 auto;
      }
      #about h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-bottom: 32px;
      }
      #about p {
        font-size: 18px;
        color: var(--muted);
        margin-bottom: 16px;
      }
      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 32px;
      }
      .skills span {
        padding: 6px 14px;
        background: color-mix(in srgb, var(--accent) 12%, transparent);
        color: var(--accent);
        border-radius: 999px;
        font-size: 14px;
        font-weight: 500;
      }
      #projects {
        padding: 96px 32px;
        max-width: 1200px;
        margin: 0 auto;
      }
      #projects h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-bottom: 48px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }
      .card {
        display: block;
        text-decoration: none;
        color: inherit;
        transition: transform 300ms;
      }
      .card:hover {
        transform: translateY(-4px);
      }
      .card img {
        width: 100%;
        aspect-ratio: 4/3;
        object-fit: cover;
        border-radius: 16px;
        margin-bottom: 16px;
      }
      .card h3 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .card p {
        color: var(--muted);
        font-size: 14px;
        margin-top: 4px;
      }
      #contact {
        padding: 96px 32px;
        max-width: 560px;
        margin: 0 auto;
      }
      #contact h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
      }
      #contact > p {
        color: var(--muted);
        font-size: 18px;
        margin-top: 16px;
        margin-bottom: 32px;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      label {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      label span {
        font-size: 13px;
        font-weight: 500;
        color: var(--muted);
      }
      input, textarea {
        font-family: inherit;
        font-size: 16px;
        padding: 12px 16px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        background: white;
        color: var(--fg);
        transition: border-color 200ms;
      }
      input:focus, textarea:focus {
        outline: none;
        border-color: var(--fg);
      }
      button {
        font-family: inherit;
        font-size: 14px;
        font-weight: 500;
        padding: 14px 28px;
        background: var(--fg);
        color: var(--bg);
        border: none;
        border-radius: 999px;
        cursor: pointer;
        transition: transform 200ms;
        align-self: flex-start;
      }
      button:hover {
        transform: scale(1.03);
      }
    </style>
  </head>
  <body>
    <header>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Progetti</a>
        <a href="#contact">Contatti</a>
      </nav>
    </header>
    <main>
      <section id="hero">
        <div class="hero-grid">
          <img src="https://i.pravatar.cc/400?img=47" alt="Foto di Anna" />
          <div>
            <h1>Anna Conte</h1>
            <p class="role">Designer freelance a Milano</p>
            <p class="bio">Disegno identità visive per piccole imprese e startup. 12 anni di esperienza, 200+ progetti consegnati.</p>
          </div>
        </div>
      </section>
      <section id="about">
        <h2>Chi sono</h2>
        <p>Lavoro come designer dal 2014. Sono cresciuta tra carta e pixel, e cerco sempre il punto in cui le due cose si incontrano.</p>
        <p>Lavoro con piccole realtà che hanno qualcosa di vero da dire, e gli aiuto a dirlo bene.</p>
        <div class="skills">
          <span>Brand identity</span>
          <span>UI design</span>
          <span>Tipografia</span>
          <span>Illustrazione</span>
          <span>Web</span>
        </div>
      </section>
      <section id="projects">
        <h2>Progetti recenti</h2>
        <div class="grid">
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p1/600/400" alt="" />
            <h3>Brand identity Sofà</h3>
            <p>Logo, palette, sistema visivo</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p2/600/400" alt="" />
            <h3>App fitness Pulse</h3>
            <p>UI mobile e icone custom</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p3/600/400" alt="" />
            <h3>Sito Atelier B</h3>
            <p>Brand site editoriale</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p4/600/400" alt="" />
            <h3>Packaging Korà</h3>
            <p>Linea cosmetici naturali</p>
          </a>
        </div>
      </section>
      <section id="contact">
        <h2>Lavoriamo insieme</h2>
        <p>Raccontami il tuo progetto.</p>
        <form>
          <label>
            <span>Nome</span>
            <input type="text" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" required />
          </label>
          <label>
            <span>Il tuo progetto</span>
            <textarea rows="4" required></textarea>
          </label>
          <button type="submit">Invia</button>
        </form>
      </section>
    </main>
    <footer>
      <p>© 2026 Anna Conte</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                { type: "querySelector", selector: "form button[type='submit']", existsOnly: true, message: "Manca <button type=\"submit\"> nel form." },
                { type: "querySelector", selector: "form textarea", existsOnly: true, message: "Manca <textarea> nel form." },
            ],
            message: "Form contatto con input nome, email, textarea, button submit.",
        },
        successScript:
            "Form senza JavaScript ma con UX seria: required, focus state, transizioni. Il 90% dei form nei portfolio è esattamente questo.",
        encourageScript:
            "Form con 3 label (Nome input, Email input, Progetto textarea) + button submit. CSS: input/textarea con border-radius 12px, focus border-color var(--fg).",
    },

    // ────────────── MODULO 4: POLISH (RESPONSIVE + DARK MODE) ───────────
    {
        order: 8,
        slug: "responsive-mobile",
        title: "Il sito su mobile (con UNA media query)",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Apri il sito sul telefono e... funziona, ma non è perfetto. La foto è piccolina, il padding è troppo, l'hero è schiacciato in due colonne anche su uno schermo da 380 pixel. Niente paura: una sola @media query e tutto si sistema. Diciamo al CSS: 'sotto i 720 pixel di larghezza, comportati così'. La hero da 2 colonne diventa 1, l'immagine si rimpicciolisce e si centra, i padding diventano umani. Una sola regola, tutto il sito risponde.",
        instruction:
            "Aggiungi alla fine dello <style>, prima del tag di chiusura: @media (max-width: 720px) { header { padding: 14px 20px; } nav { gap: 16px; } #hero, #about, #projects, #contact { padding: 64px 20px; } .hero-grid { grid-template-columns: 1fr; gap: 32px; } .hero-grid img { max-width: 280px; justify-self: center; } }",
        hint: "UNA @media (max-width: 720px) { ... } alla fine di <style>. Dentro: .hero-grid grid-template-columns: 1fr (passa da 2 colonne a 1), .hero-grid img max-width: 280px e justify-self: center (foto piccola e centrata), padding 64px 20px per #hero/#about/#projects/#contact.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Anna Conte — Designer</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :root {
        --accent: #ec4899;
        --bg: #fafaf9;
        --fg: #1c1917;
        --muted: #78716c;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        background: var(--bg);
        color: var(--fg);
        line-height: 1.6;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(250, 250, 249, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding: 16px 32px;
      }
      nav {
        display: flex;
        gap: 24px;
        justify-content: flex-end;
        max-width: 1200px;
        margin: 0 auto;
      }
      nav a {
        color: var(--fg);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 200ms;
      }
      nav a:hover {
        color: var(--accent);
      }
      #hero {
        padding: 96px 32px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 48px;
        align-items: center;
      }
      .hero-grid img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 24px;
      }
      #hero h1 {
        font-size: clamp(48px, 8vw, 96px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 1;
      }
      #hero .role {
        color: var(--accent);
        font-size: 18px;
        font-weight: 500;
        margin-top: 16px;
      }
      #hero .bio {
        color: var(--muted);
        font-size: 18px;
        margin-top: 24px;
        max-width: 480px;
      }
      #about {
        padding: 96px 32px;
        max-width: 720px;
        margin: 0 auto;
      }
      #about h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-bottom: 32px;
      }
      #about p {
        font-size: 18px;
        color: var(--muted);
        margin-bottom: 16px;
      }
      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 32px;
      }
      .skills span {
        padding: 6px 14px;
        background: color-mix(in srgb, var(--accent) 12%, transparent);
        color: var(--accent);
        border-radius: 999px;
        font-size: 14px;
        font-weight: 500;
      }
      #projects {
        padding: 96px 32px;
        max-width: 1200px;
        margin: 0 auto;
      }
      #projects h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-bottom: 48px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }
      .card {
        display: block;
        text-decoration: none;
        color: inherit;
        transition: transform 300ms;
      }
      .card:hover {
        transform: translateY(-4px);
      }
      .card img {
        width: 100%;
        aspect-ratio: 4/3;
        object-fit: cover;
        border-radius: 16px;
        margin-bottom: 16px;
      }
      .card h3 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .card p {
        color: var(--muted);
        font-size: 14px;
        margin-top: 4px;
      }
      #contact {
        padding: 96px 32px;
        max-width: 560px;
        margin: 0 auto;
      }
      #contact h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
      }
      #contact > p {
        color: var(--muted);
        font-size: 18px;
        margin-top: 16px;
        margin-bottom: 32px;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      label {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      label span {
        font-size: 13px;
        font-weight: 500;
        color: var(--muted);
      }
      input, textarea {
        font-family: inherit;
        font-size: 16px;
        padding: 12px 16px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        background: white;
        color: var(--fg);
        transition: border-color 200ms;
      }
      input:focus, textarea:focus {
        outline: none;
        border-color: var(--fg);
      }
      button {
        font-family: inherit;
        font-size: 14px;
        font-weight: 500;
        padding: 14px 28px;
        background: var(--fg);
        color: var(--bg);
        border: none;
        border-radius: 999px;
        cursor: pointer;
        transition: transform 200ms;
        align-self: flex-start;
      }
      button:hover {
        transform: scale(1.03);
      }
      @media (max-width: 720px) {
        header {
          padding: 14px 20px;
        }
        nav {
          gap: 16px;
        }
        #hero,
        #about,
        #projects,
        #contact {
          padding: 64px 20px;
        }
        .hero-grid {
          grid-template-columns: 1fr;
          gap: 32px;
        }
        .hero-grid img {
          max-width: 280px;
          justify-self: center;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Progetti</a>
        <a href="#contact">Contatti</a>
      </nav>
    </header>
    <main>
      <section id="hero">
        <div class="hero-grid">
          <img src="https://i.pravatar.cc/400?img=47" alt="Foto di Anna" />
          <div>
            <h1>Anna Conte</h1>
            <p class="role">Designer freelance a Milano</p>
            <p class="bio">Disegno identità visive per piccole imprese e startup. 12 anni di esperienza, 200+ progetti consegnati.</p>
          </div>
        </div>
      </section>
      <section id="about">
        <h2>Chi sono</h2>
        <p>Lavoro come designer dal 2014. Sono cresciuta tra carta e pixel, e cerco sempre il punto in cui le due cose si incontrano.</p>
        <p>Lavoro con piccole realtà che hanno qualcosa di vero da dire, e gli aiuto a dirlo bene.</p>
        <div class="skills">
          <span>Brand identity</span>
          <span>UI design</span>
          <span>Tipografia</span>
          <span>Illustrazione</span>
          <span>Web</span>
        </div>
      </section>
      <section id="projects">
        <h2>Progetti recenti</h2>
        <div class="grid">
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p1/600/400" alt="" />
            <h3>Brand identity Sofà</h3>
            <p>Logo, palette, sistema visivo</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p2/600/400" alt="" />
            <h3>App fitness Pulse</h3>
            <p>UI mobile e icone custom</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p3/600/400" alt="" />
            <h3>Sito Atelier B</h3>
            <p>Brand site editoriale</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p4/600/400" alt="" />
            <h3>Packaging Korà</h3>
            <p>Linea cosmetici naturali</p>
          </a>
        </div>
      </section>
      <section id="contact">
        <h2>Lavoriamo insieme</h2>
        <p>Raccontami il tuo progetto.</p>
        <form>
          <label>
            <span>Nome</span>
            <input type="text" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" required />
          </label>
          <label>
            <span>Il tuo progetto</span>
            <textarea rows="4" required></textarea>
          </label>
          <button type="submit">Invia</button>
        </form>
      </section>
    </main>
    <footer>
      <p>© 2026 Anna Conte</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                { type: "textIncludes", needle: "@media", flexible: true, message: "Manca la @media query." },
                { type: "textIncludes", needle: "max-width: 720px", flexible: true, message: "La media query deve attivarsi sotto 720px." },
                { type: "textIncludes", needle: "grid-template-columns: 1fr", flexible: true, message: "Dentro la @media, .hero-grid deve passare a 1 colonna sola." },
            ],
            message: "Una @media query che rende il sito responsive su mobile.",
        },
        successScript:
            "Trascina il bordo del browser verso sinistra. Ad un certo punto, BAM: l'hero diventa una colonna, l'immagine si rimpicciolisce e si centra, tutto respira. Con UNA sola media query hai reso il sito perfettamente usabile su qualunque schermo. Questo è il responsive design moderno.",
        encourageScript:
            "Aggiungi @media (max-width: 720px) { ... } alla fine dello <style>. Dentro: .hero-grid { grid-template-columns: 1fr; }, .hero-grid img { max-width: 280px; justify-self: center; }, padding 64px 20px per #hero/#about/#projects/#contact.",
    },

    {
        order: 9,
        slug: "dark-mode-pure-css",
        title: "Dark mode senza JavaScript (la magia di :has())",
        durationSec: 150,
        avatarMood: "happy",
        script:
            "Ultima lezione, e sarà il colpo che fa pensare 'ma davvero?'. Aggiungiamo un toggle dark mode usando solo HTML e CSS. Niente JavaScript. Il trucco si chiama il selettore :has(). Funziona così: aggiungi una checkbox nascosta nel header, e quando è checked, il body ha :has(input:checked). Da quel momento, ridefiniamo le variabili CSS per i colori scuri. Il sito intero cambia tema. Una sola riga di JavaScript? Zero.",
        instruction:
            "HTML: aggiungi nel <nav>, prima dei link, <label class=\"theme\"><input type=\"checkbox\" /><span>🌙</span></label>. Modifica nav: aggiungi justify-content space-between in nav, e wrap i link in un div: <nav><label class=\"theme\"><input type=\"checkbox\" /><span>🌙</span></label><div class=\"links\"><a href=\"#about\">About</a><a href=\"#projects\">Progetti</a><a href=\"#contact\">Contatti</a></div></nav>. CSS aggiuntivo: nav { justify-content: space-between; align-items: center; } .links { display: flex; gap: 24px; } .theme { cursor: pointer; user-select: none; } .theme input { display: none; } .theme span { font-size: 20px; } body:has(.theme input:checked) { --bg: #0c0a09; --fg: #fafaf9; --muted: #a8a29e; } body:has(.theme input:checked) header { background: rgba(12, 10, 9, 0.8); border-bottom-color: rgba(255, 255, 255, 0.08); } body:has(.theme input:checked) input, body:has(.theme input:checked) textarea { background: #1c1917; border-color: rgba(255, 255, 255, 0.1); }",
        hint: "1) HTML: nav con dentro .theme (label+checkbox+emoji) e .links wrapper. 2) CSS: nav justify-content space-between, .theme con input nascosto. 3) Magia: body:has(.theme input:checked) ridefinisce le variabili CSS.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Anna Conte — Designer</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :root {
        --accent: #ec4899;
        --bg: #fafaf9;
        --fg: #1c1917;
        --muted: #78716c;
      }
      body {
        font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        background: var(--bg);
        color: var(--fg);
        line-height: 1.6;
        transition: background 300ms, color 300ms;
      }
      body:has(.theme input:checked) {
        --bg: #0c0a09;
        --fg: #fafaf9;
        --muted: #a8a29e;
      }
      body:has(.theme input:checked) header {
        background: rgba(12, 10, 9, 0.8);
        border-bottom-color: rgba(255, 255, 255, 0.08);
      }
      body:has(.theme input:checked) input,
      body:has(.theme input:checked) textarea {
        background: #1c1917;
        border-color: rgba(255, 255, 255, 0.1);
      }
      header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(250, 250, 249, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding: 16px 32px;
      }
      nav {
        display: flex;
        gap: 24px;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }
      .links {
        display: flex;
        gap: 24px;
      }
      .theme {
        cursor: pointer;
        user-select: none;
      }
      .theme input {
        display: none;
      }
      .theme span {
        font-size: 20px;
      }
      nav a {
        color: var(--fg);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 200ms;
      }
      nav a:hover {
        color: var(--accent);
      }
      #hero {
        padding: 96px 32px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 48px;
        align-items: center;
      }
      .hero-grid img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 24px;
      }
      #hero h1 {
        font-size: clamp(48px, 8vw, 96px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 1;
      }
      #hero .role {
        color: var(--accent);
        font-size: 18px;
        font-weight: 500;
        margin-top: 16px;
      }
      #hero .bio {
        color: var(--muted);
        font-size: 18px;
        margin-top: 24px;
        max-width: 480px;
      }
      #about {
        padding: 96px 32px;
        max-width: 720px;
        margin: 0 auto;
      }
      #about h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-bottom: 32px;
      }
      #about p {
        font-size: 18px;
        color: var(--muted);
        margin-bottom: 16px;
      }
      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 32px;
      }
      .skills span {
        padding: 6px 14px;
        background: color-mix(in srgb, var(--accent) 12%, transparent);
        color: var(--accent);
        border-radius: 999px;
        font-size: 14px;
        font-weight: 500;
      }
      #projects {
        padding: 96px 32px;
        max-width: 1200px;
        margin: 0 auto;
      }
      #projects h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
        margin-bottom: 48px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }
      .card {
        display: block;
        text-decoration: none;
        color: inherit;
        transition: transform 300ms;
      }
      .card:hover {
        transform: translateY(-4px);
      }
      .card img {
        width: 100%;
        aspect-ratio: 4/3;
        object-fit: cover;
        border-radius: 16px;
        margin-bottom: 16px;
      }
      .card h3 {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .card p {
        color: var(--muted);
        font-size: 14px;
        margin-top: 4px;
      }
      #contact {
        padding: 96px 32px;
        max-width: 560px;
        margin: 0 auto;
      }
      #contact h2 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 700;
        letter-spacing: -0.03em;
      }
      #contact > p {
        color: var(--muted);
        font-size: 18px;
        margin-top: 16px;
        margin-bottom: 32px;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      label {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      label span {
        font-size: 13px;
        font-weight: 500;
        color: var(--muted);
      }
      input, textarea {
        font-family: inherit;
        font-size: 16px;
        padding: 12px 16px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        background: white;
        color: var(--fg);
        transition: border-color 200ms;
      }
      input:focus, textarea:focus {
        outline: none;
        border-color: var(--fg);
      }
      button {
        font-family: inherit;
        font-size: 14px;
        font-weight: 500;
        padding: 14px 28px;
        background: var(--fg);
        color: var(--bg);
        border: none;
        border-radius: 999px;
        cursor: pointer;
        transition: transform 200ms;
        align-self: flex-start;
      }
      button:hover {
        transform: scale(1.03);
      }
      @media (max-width: 720px) {
        header {
          padding: 14px 20px;
        }
        nav {
          gap: 16px;
        }
        .links {
          gap: 16px;
        }
        #hero,
        #about,
        #projects,
        #contact {
          padding: 64px 20px;
        }
        .hero-grid {
          grid-template-columns: 1fr;
          gap: 32px;
        }
        .hero-grid img {
          max-width: 280px;
          justify-self: center;
        }
      }
      footer {
        padding: 48px 32px;
        text-align: center;
        color: var(--muted);
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <header>
      <nav>
        <label class="theme">
          <input type="checkbox" />
          <span>🌙</span>
        </label>
        <div class="links">
          <a href="#about">About</a>
          <a href="#projects">Progetti</a>
          <a href="#contact">Contatti</a>
        </div>
      </nav>
    </header>
    <main>
      <section id="hero">
        <div class="hero-grid">
          <img src="https://i.pravatar.cc/400?img=47" alt="Foto di Anna" />
          <div>
            <h1>Anna Conte</h1>
            <p class="role">Designer freelance a Milano</p>
            <p class="bio">Disegno identità visive per piccole imprese e startup. 12 anni di esperienza, 200+ progetti consegnati.</p>
          </div>
        </div>
      </section>
      <section id="about">
        <h2>Chi sono</h2>
        <p>Lavoro come designer dal 2014. Sono cresciuta tra carta e pixel, e cerco sempre il punto in cui le due cose si incontrano.</p>
        <p>Lavoro con piccole realtà che hanno qualcosa di vero da dire, e gli aiuto a dirlo bene.</p>
        <div class="skills">
          <span>Brand identity</span>
          <span>UI design</span>
          <span>Tipografia</span>
          <span>Illustrazione</span>
          <span>Web</span>
        </div>
      </section>
      <section id="projects">
        <h2>Progetti recenti</h2>
        <div class="grid">
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p1/600/400" alt="" />
            <h3>Brand identity Sofà</h3>
            <p>Logo, palette, sistema visivo</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p2/600/400" alt="" />
            <h3>App fitness Pulse</h3>
            <p>UI mobile e icone custom</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p3/600/400" alt="" />
            <h3>Sito Atelier B</h3>
            <p>Brand site editoriale</p>
          </a>
          <a href="#" class="card">
            <img src="https://picsum.photos/seed/p4/600/400" alt="" />
            <h3>Packaging Korà</h3>
            <p>Linea cosmetici naturali</p>
          </a>
        </div>
      </section>
      <section id="contact">
        <h2>Lavoriamo insieme</h2>
        <p>Raccontami il tuo progetto.</p>
        <form>
          <label>
            <span>Nome</span>
            <input type="text" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" required />
          </label>
          <label>
            <span>Il tuo progetto</span>
            <textarea rows="4" required></textarea>
          </label>
          <button type="submit">Invia</button>
        </form>
      </section>
    </main>
    <footer>
      <p>© 2026 Anna Conte</p>
    </footer>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                { type: "querySelector", selector: ".theme input[type='checkbox']", existsOnly: true, message: "Manca la checkbox dentro .theme nella nav." },
                { type: "textIncludes", needle: "body:has(.theme input:checked)", flexible: true, message: "Manca la regola CSS body:has(.theme input:checked) per il dark mode." },
            ],
            message: "Toggle dark mode con :has() — checkbox + redefinizione variabili.",
        },
        successScript:
            "FINITO! Clicca la luna in alto a sinistra: il sito intero diventa scuro. Niente JavaScript, solo :has(). È una tecnica del 2023 ma ancora pochi la usano. Adesso fa parte del tuo arsenale. E hai un portfolio reale, scaricabile, da usare.",
        encourageScript:
            "1) HTML: aggiungi <label class=\"theme\"><input type=\"checkbox\"><span>🌙</span></label> e wrap i link in <div class=\"links\">. 2) CSS: body:has(.theme input:checked) { --bg: #0c0a09; --fg: #fafaf9; ... } — è il selettore magico.",
    },
];

portfolioPersonaleCourse.lessons = lessons;
portfolioPersonaleCourse.finalCode = lessons[lessons.length - 1].expectedSnapshot;
