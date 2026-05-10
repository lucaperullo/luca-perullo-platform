/**
 * Corso "animazioni-avanzate": dal nero brutalist al sito d'autore.
 *
 * Persona: Ginevra Calzi, pianista classica con repertorio romantico.
 * Filosofia: il design deve farti pensare "questa pianista è una rockstar".
 * Tipografia oversized che riempie lo schermo, sfondo nero #0a0a0a,
 * accent acido lime #c5ff00, scroll-driven realmente drammatico,
 * magnetic cursor con label, View Transitions cinematiche.
 *
 * Riferimenti visivi: Eric Hu, Locomotive, Pentagram, Apple Vision keynote,
 * Linear changelog, Nuxt Labs hero, Vercel home, Awwwards SOTD recenti.
 *
 * Sequenza:
 *   M1: Foundation brutalist (lezioni 1-3)
 *   M2: Cursor + Scroll cinematico (lezioni 4-6)
 *   M3: Magnetic + View Transition finale (lezioni 7-8)
 */
import type { Lesson, PlayCourse } from "@/data/play/types";

export const animazioniAvanzateCourse: PlayCourse = {
    slug: "animazioni-avanzate",
    title: "Animazioni che fanno girare la testa",
    subtitle:
        "Tipografia brutalist, scroll-driven, View Transitions, magnetic cursor. Costruisci una landing in stile Awwwards SOTD per una pianista che è una rockstar.",
    description:
        "Beige e timido nel 2026 vuol dire dimenticato. In 8 lezioni costruirai la landing personale di Ginevra Calzi — pianista classica trattata come una rockstar — con tipografia brutalist che riempie lo schermo, marquee infinito del repertorio, scroll-driven con animation-timeline, custom cursor magnetico con label che mutano, e una View Transition cinematica home/bio che è quasi un mini-film. Solo HTML/CSS/JS vanilla. Le tecniche dei siti che vincono Site of the Day su Awwwards.",
    level: "avanzato",
    subjects: ["css", "javascript"],
    durationMin: 95,
    status: "live",
    initialCode: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ginevra Calzi — Pianista</title>
    <style></style>
  </head>
  <body>
    <h1>Ginevra Calzi</h1>
  </body>
</html>`,
    finalCode: "",
    modules: [
        {
            order: 1,
            slug: "brutalist-foundation",
            title: "Foundation brutalist",
            summary:
                "Sfondo nero #0a0a0a, accent acido lime, h1 oversized clamp(4rem, 18vw, 22rem), stagger reveal per parola, marquee infinito.",
        },
        {
            order: 2,
            slug: "cursor-scroll",
            title: "Cursor magnetico + scroll-driven",
            summary:
                "Custom cursor con label che muta per ogni elemento, mix-blend-mode difference, scroll-driven scale del titolo con animation-timeline: scroll().",
        },
        {
            order: 3,
            slug: "view-transition-final",
            title: "Reveal cinematici + View Transition",
            summary:
                "Concert dates con clip-path e blur reveal via animation-timeline: view(), magnetic CTA, View Transition home/bio cinematografica.",
        },
    ],
    lessons: [],
};

const lessons: Lesson[] = [
    // ────────────── MODULO 1: BRUTALIST FOUNDATION ───────────────────────
    {
        order: 1,
        slug: "brutalist-setup",
        title: "Setup brutalist: il nome che riempie lo schermo",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Beige e timido nel 2026 vuol dire dimenticato. Ginevra è una pianista classica, ma noi la trattiamo come una rockstar — il suo nome deve riempire lo schermo come una copertina di rivista, su nero, con tipografia che ti schiaffeggia in faccia. Apple Vision keynote, Pentagram, Eric Hu — tutti partono da lì: nero profondo, un colore acido che taglia, e un nome così grande che diventa l'oggetto. Costruiamo le fondamenta brutalist.",
        instruction:
            "Sostituisci tutto dentro <style> con: :root { --bg: #0a0a0a; --fg: #f5f5f5; --acid: #c5ff00; --muted: #666; } * { box-sizing: border-box; margin: 0; padding: 0; } html, body { background: var(--bg); color: var(--fg); font-family: 'Inter', -apple-system, system-ui, sans-serif; -webkit-font-smoothing: antialiased; } .hero { min-height: 100vh; padding: 2rem; display: flex; flex-direction: column; justify-content: flex-end; position: relative; overflow: hidden; } .hero-name { font-size: clamp(4rem, 18vw, 22rem); font-weight: 900; line-height: 0.85; letter-spacing: -0.06em; text-transform: uppercase; } .hero-tag { position: absolute; top: 2rem; right: 2rem; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--acid); }. Poi sostituisci tutto nel <body> con: <section class=\"hero\"><span class=\"hero-tag\">Pianista · Repertorio Romantico</span><h1 class=\"hero-name\">Ginevra<br/>Calzi</h1></section>",
        hint: ":root con --bg #0a0a0a, --acid #c5ff00. Body nero, font-family Inter system stack. .hero min-height 100vh, justify-content flex-end. .hero-name font-size clamp(4rem, 18vw, 22rem), font-weight 900, line-height 0.85, letter-spacing -0.06em, text-transform uppercase. .hero-tag in alto a destra, lime, 0.2em letter-spacing.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ginevra Calzi — Pianista</title>
    <style>
      :root {
        --bg: #0a0a0a;
        --fg: #f5f5f5;
        --acid: #c5ff00;
        --muted: #666;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        background: var(--bg);
        color: var(--fg);
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .hero {
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: relative;
        overflow: hidden;
      }
      .hero-name {
        font-size: clamp(4rem, 18vw, 22rem);
        font-weight: 900;
        line-height: 0.85;
        letter-spacing: -0.06em;
        text-transform: uppercase;
      }
      .hero-tag {
        position: absolute;
        top: 2rem;
        right: 2rem;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--acid);
      }
    </style>
  </head>
  <body>
    <section class="hero">
      <span class="hero-tag">Pianista · Repertorio Romantico</span>
      <h1 class="hero-name">Ginevra<br/>Calzi</h1>
    </section>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "section.hero h1.hero-name",
                    existsOnly: true,
                    message:
                        "Manca <section class=\"hero\"> con dentro <h1 class=\"hero-name\">.",
                },
                {
                    type: "querySelector",
                    selector: ".hero-tag",
                    existsOnly: true,
                    message:
                        "Manca <span class=\"hero-tag\"> con il sottotitolo Pianista.",
                },
                {
                    type: "textIncludes",
                    needle: "--acid: #c5ff00",
                    flexible: true,
                    message:
                        "Definisci --acid: #c5ff00 nelle variabili :root.",
                },
                {
                    type: "textIncludes",
                    needle: "clamp(4rem, 18vw, 22rem)",
                    flexible: true,
                    message:
                        "Il titolo deve usare font-size: clamp(4rem, 18vw, 22rem) — è la dimensione brutalist.",
                },
            ],
            message:
                "Setup brutalist con nero, accent lime, hero-name oversized clamp.",
        },
        successScript:
            "Apri il preview: nero profondo, lime acido, e il nome che occupa lo schermo come un manifesto. Quel font-size con clamp è la chiave — su mobile è 4rem, sul desktop esplode fino a 22rem. È la stessa logica di Eric Hu o di Pentagram: il nome È l'interfaccia.",
        encourageScript:
            ":root con --bg #0a0a0a, --acid #c5ff00. Body nero. .hero min-height 100vh con justify-content flex-end. .hero-name con font-size clamp(4rem, 18vw, 22rem), font-weight 900, line-height 0.85, letter-spacing -0.06em, uppercase. .hero-tag in alto a destra colore acido.",
    },

    {
        order: 2,
        slug: "stagger-words",
        title: "Stagger reveal: il nome appare parola per parola",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Tutto che appare insieme è banale. Una parola alla volta, con 100ms di offset, e l'occhio percepisce orchestrazione — è la firma di Linear, di Vercel, dei changelog di Stripe. Niente librerie split-text: spezziamo a mano il nome in <span> per parola, ognuno con un delay incrementale. È la differenza tra \"sito che funziona\" e \"sito che ti accompagna dentro\".",
        instruction:
            "Modifica il <h1 class=\"hero-name\"> in: <h1 class=\"hero-name\"><span class=\"word\">Ginevra</span><br/><span class=\"word\">Calzi</span></h1>. Sostituisci anche <span class=\"hero-tag\"> con: <span class=\"hero-tag word\">Pianista · Repertorio Romantico</span>. Nel <style>, prima di .hero, aggiungi: @keyframes wordReveal { from { opacity: 0; transform: translateY(120%); } to { opacity: 1; transform: translateY(0); } } .word { display: inline-block; opacity: 0; animation: wordReveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) both; } .hero-name .word:nth-child(1) { animation-delay: 0.15s; } .hero-name .word:nth-child(3) { animation-delay: 0.3s; } .hero-tag.word { animation-delay: 0.6s; } .hero-name { overflow: hidden; }",
        hint: "Spezza Ginevra e Calzi in due <span class=\"word\">. Aggiungi class=\"word\" anche allo .hero-tag. @keyframes wordReveal da opacity 0 + translateY(120%) a opacity 1 + translateY(0). .word inline-block con animation 1.1s cubic-bezier(0.22, 1, 0.36, 1) both. Delay: 0.15s, 0.3s sui word del nome (nth-child 1 e 3 perché c'è il <br>), 0.6s sul tag.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ginevra Calzi — Pianista</title>
    <style>
      :root {
        --bg: #0a0a0a;
        --fg: #f5f5f5;
        --acid: #c5ff00;
        --muted: #666;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        background: var(--bg);
        color: var(--fg);
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      @keyframes wordReveal {
        from { opacity: 0; transform: translateY(120%); }
        to { opacity: 1; transform: translateY(0); }
      }
      .word {
        display: inline-block;
        opacity: 0;
        animation: wordReveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .hero-name .word:nth-child(1) { animation-delay: 0.15s; }
      .hero-name .word:nth-child(3) { animation-delay: 0.3s; }
      .hero-tag.word { animation-delay: 0.6s; }
      .hero {
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: relative;
        overflow: hidden;
      }
      .hero-name {
        font-size: clamp(4rem, 18vw, 22rem);
        font-weight: 900;
        line-height: 0.85;
        letter-spacing: -0.06em;
        text-transform: uppercase;
        overflow: hidden;
      }
      .hero-tag {
        position: absolute;
        top: 2rem;
        right: 2rem;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--acid);
      }
    </style>
  </head>
  <body>
    <section class="hero">
      <span class="hero-tag word">Pianista · Repertorio Romantico</span>
      <h1 class="hero-name"><span class="word">Ginevra</span><br/><span class="word">Calzi</span></h1>
    </section>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: ".hero-name .word",
                    existsOnly: true,
                    message:
                        "Spezza il nome in <span class=\"word\"> dentro .hero-name.",
                },
                {
                    type: "textIncludes",
                    needle: "@keyframes wordReveal",
                    flexible: true,
                    message:
                        "Definisci @keyframes wordReveal con translateY(120%) → translateY(0).",
                },
                {
                    type: "textIncludes",
                    needle: "animation-delay: 0.15s",
                    flexible: true,
                    message:
                        "Servono delay incrementali — almeno animation-delay: 0.15s sul primo word.",
                },
            ],
            message:
                "Stagger reveal con .word in <span> e animation-delay incrementali.",
        },
        successScript:
            "Ricarica: \"Ginevra\" sale dal basso, poi \"Calzi\", poi il tag in alto. Quel translateY(120%) combinato con overflow: hidden sul contenitore è la magia — le lettere arrivano da \"sotto la riga\", come in un teatro. È letteralmente la stessa tecnica di Apple Vision o del nuovo Linear.",
        encourageScript:
            "h1 con due <span class=\"word\"> Ginevra e Calzi separati da <br>. Tag con class word. @keyframes wordReveal da translateY(120%) a translateY(0). Delay 0.15s sul primo word, 0.3s sul secondo (nth-child 3 per via del br), 0.6s sul tag.",
    },

    {
        order: 3,
        slug: "marquee-infinite",
        title: "Marquee infinito: il repertorio scorre senza fine",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Apri Vercel, apri Linear, apri qualsiasi sito da Awwwards SOTD recente: c'è SEMPRE una striscia che scorre. Nomi, città, brand, qualcosa che si muove in loop infinito senza fermarsi. È un gancio visivo, è un ritmo, è il battito cardiaco del sito. Costruiamo la striscia di Ginevra: Chopin, Rachmaninov, Liszt, Debussy. Il trucco per il loop seamless è semplice: duplica il contenuto e trasla del 50%.",
        instruction:
            "Subito dopo </h1> dentro section.hero, aggiungi: <div class=\"marquee\"><div class=\"marquee-track\"><span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span><span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span></div></div>. Nel <style>, prima del @keyframes wordReveal, aggiungi: @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }. Poi alla fine del <style> aggiungi: .marquee { width: 100%; overflow: hidden; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 1.25rem 0; margin-top: 2rem; mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); } .marquee-track { display: inline-flex; gap: 2.5rem; white-space: nowrap; animation: marquee 24s linear infinite; font-size: 1rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; } .marquee-track span:nth-child(even) { color: var(--acid); }",
        hint: "Aggiungi <div class=\"marquee\"> con dentro <div class=\"marquee-track\"> che contiene la lista dei compositori RIPETUTA DUE VOLTE per il loop seamless. @keyframes marquee da translateX(0) a translateX(-50%). .marquee overflow hidden con mask-image che sfuma ai bordi. .marquee-track inline-flex con animation marquee 24s linear infinite. I separatori (·, even nth-child) in lime.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ginevra Calzi — Pianista</title>
    <style>
      :root {
        --bg: #0a0a0a;
        --fg: #f5f5f5;
        --acid: #c5ff00;
        --muted: #666;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        background: var(--bg);
        color: var(--fg);
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes wordReveal {
        from { opacity: 0; transform: translateY(120%); }
        to { opacity: 1; transform: translateY(0); }
      }
      .word {
        display: inline-block;
        opacity: 0;
        animation: wordReveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .hero-name .word:nth-child(1) { animation-delay: 0.15s; }
      .hero-name .word:nth-child(3) { animation-delay: 0.3s; }
      .hero-tag.word { animation-delay: 0.6s; }
      .hero {
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: relative;
        overflow: hidden;
      }
      .hero-name {
        font-size: clamp(4rem, 18vw, 22rem);
        font-weight: 900;
        line-height: 0.85;
        letter-spacing: -0.06em;
        text-transform: uppercase;
        overflow: hidden;
      }
      .hero-tag {
        position: absolute;
        top: 2rem;
        right: 2rem;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--acid);
      }
      .marquee {
        width: 100%;
        overflow: hidden;
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding: 1.25rem 0;
        margin-top: 2rem;
        mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      }
      .marquee-track {
        display: inline-flex;
        gap: 2.5rem;
        white-space: nowrap;
        animation: marquee 24s linear infinite;
        font-size: 1rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        font-weight: 500;
      }
      .marquee-track span:nth-child(even) { color: var(--acid); }
    </style>
  </head>
  <body>
    <section class="hero">
      <span class="hero-tag word">Pianista · Repertorio Romantico</span>
      <h1 class="hero-name"><span class="word">Ginevra</span><br/><span class="word">Calzi</span></h1>
      <div class="marquee">
        <div class="marquee-track">
          <span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span><span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span>
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
                    selector: ".marquee .marquee-track",
                    existsOnly: true,
                    message:
                        "Manca <div class=\"marquee\"> con dentro <div class=\"marquee-track\">.",
                },
                {
                    type: "textIncludes",
                    needle: "@keyframes marquee",
                    flexible: true,
                    message:
                        "Definisci @keyframes marquee da translateX(0) a translateX(-50%).",
                },
                {
                    type: "textIncludes",
                    needle: "animation: marquee",
                    flexible: true,
                    message:
                        "Applica animation: marquee 24s linear infinite a .marquee-track.",
                },
            ],
            message:
                "Marquee infinito con loop seamless via duplicazione contenuto e -50% translate.",
        },
        successScript:
            "Guarda la striscia: Chopin, Rachmaninov, Liszt scorrono in loop perfetto. Il trucco è la duplicazione del contenuto: traslando del 50% — non del 100% — quando il primo set esce, il secondo è già al posto giusto. Il `mask-image` sfuma i bordi, così sembra che continui all'infinito oltre lo schermo.",
        encourageScript:
            "Marquee con marquee-track dentro, il contenuto va duplicato (5 nomi + 5 nomi). @keyframes marquee da translateX(0) a translateX(-50%). .marquee con overflow hidden e mask-image lineare. .marquee-track con animation: marquee 24s linear infinite. nth-child(even) in --acid.",
    },

    // ────────────── MODULO 2: CURSOR + SCROLL CINEMATICO ─────────────────
    {
        order: 4,
        slug: "magnetic-cursor",
        title: "Custom cursor con label che muta",
        durationSec: 150,
        avatarMood: "talking",
        script:
            "Quando passi su un link, il cursore non deve solo cambiare colore. Su Apple, su Linear, su Stripe, su qualsiasi sito da Awwwards: il cursore si trasforma in qualcosa di descrittivo — una label che ti dice cosa farai. ASCOLTA su un audio, GUARDA su un video, una freccia su un next. Costruiamo un cursor cinematico, con dentro una label che cambia per ogni elemento via data-attribute. mix-blend-mode: difference fa il resto — il cursor si inverte automaticamente sopra qualsiasi sfondo.",
        instruction:
            "Subito prima di </body> aggiungi: <div class=\"cursor\" aria-hidden=\"true\"><span class=\"cursor-label\"></span></div>. Modifica <h1 class=\"hero-name\"> aggiungendo data-cursor=\"VEDI\". Aggiungi <a class=\"hero-tag word\" href=\"#shows\" data-cursor=\"PROSSIMO →\" style=\"text-decoration:none\"> al posto di <span class=\"hero-tag word\"> (e chiudi con </a> invece che </span>). Nel <style> alla fine aggiungi: html, body { cursor: none; } @media (hover: none) { html, body { cursor: auto; } .cursor { display: none; } } .cursor { position: fixed; top: 0; left: 0; width: 18px; height: 18px; border-radius: 999px; background: var(--fg); pointer-events: none; mix-blend-mode: difference; z-index: 9999; transform: translate3d(-50%, -50%, 0); transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease; display: flex; align-items: center; justify-content: center; will-change: transform; } .cursor.is-label { width: 110px; height: 110px; background: var(--acid); } .cursor-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #0a0a0a; opacity: 0; transition: opacity 0.2s ease 0.05s; white-space: nowrap; } .cursor.is-label .cursor-label { opacity: 1; }. Prima di </body>, dopo il div.cursor, aggiungi: <script>(() => { const cursor = document.querySelector('.cursor'); const label = cursor.querySelector('.cursor-label'); let x = 0, y = 0, tx = 0, ty = 0; window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }); const tick = () => { x += (tx - x) * 0.2; y += (ty - y) * 0.2; cursor.style.transform = \`translate3d(\${x}px, \${y}px, 0) translate3d(-50%, -50%, 0)\`; requestAnimationFrame(tick); }; tick(); document.querySelectorAll('[data-cursor]').forEach(el => { el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-label'); }); el.addEventListener('mouseleave', () => cursor.classList.remove('is-label')); }); })();</script>",
        hint: "Aggiungi <div class=\"cursor\"><span class=\"cursor-label\"></span></div> prima di </body>. Aggiungi data-cursor=\"VEDI\" al h1, e trasforma .hero-tag in <a> con data-cursor=\"PROSSIMO →\". CSS: html/body cursor none, .cursor position fixed 18px lime con mix-blend-mode difference, .cursor.is-label ingrandita a 110px in --acid, .cursor-label dentro che mostra il testo. JS: lerp smooth (x += (tx-x)*0.2) per movimento morbido, mouseenter cambia label e aggiunge classe is-label.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ginevra Calzi — Pianista</title>
    <style>
      :root {
        --bg: #0a0a0a;
        --fg: #f5f5f5;
        --acid: #c5ff00;
        --muted: #666;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        background: var(--bg);
        color: var(--fg);
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes wordReveal {
        from { opacity: 0; transform: translateY(120%); }
        to { opacity: 1; transform: translateY(0); }
      }
      .word {
        display: inline-block;
        opacity: 0;
        animation: wordReveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .hero-name .word:nth-child(1) { animation-delay: 0.15s; }
      .hero-name .word:nth-child(3) { animation-delay: 0.3s; }
      .hero-tag.word { animation-delay: 0.6s; }
      .hero {
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: relative;
        overflow: hidden;
      }
      .hero-name {
        font-size: clamp(4rem, 18vw, 22rem);
        font-weight: 900;
        line-height: 0.85;
        letter-spacing: -0.06em;
        text-transform: uppercase;
        overflow: hidden;
      }
      .hero-tag {
        position: absolute;
        top: 2rem;
        right: 2rem;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--acid);
      }
      .marquee {
        width: 100%;
        overflow: hidden;
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding: 1.25rem 0;
        margin-top: 2rem;
        mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      }
      .marquee-track {
        display: inline-flex;
        gap: 2.5rem;
        white-space: nowrap;
        animation: marquee 24s linear infinite;
        font-size: 1rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        font-weight: 500;
      }
      .marquee-track span:nth-child(even) { color: var(--acid); }
      html, body { cursor: none; }
      @media (hover: none) {
        html, body { cursor: auto; }
        .cursor { display: none; }
      }
      .cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: var(--fg);
        pointer-events: none;
        mix-blend-mode: difference;
        z-index: 9999;
        transform: translate3d(-50%, -50%, 0);
        transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        will-change: transform;
      }
      .cursor.is-label {
        width: 110px;
        height: 110px;
        background: var(--acid);
      }
      .cursor-label {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #0a0a0a;
        opacity: 0;
        transition: opacity 0.2s ease 0.05s;
        white-space: nowrap;
      }
      .cursor.is-label .cursor-label { opacity: 1; }
    </style>
  </head>
  <body>
    <section class="hero">
      <a class="hero-tag word" href="#shows" data-cursor="PROSSIMO →" style="text-decoration:none">Pianista · Repertorio Romantico</a>
      <h1 class="hero-name" data-cursor="VEDI"><span class="word">Ginevra</span><br/><span class="word">Calzi</span></h1>
      <div class="marquee">
        <div class="marquee-track">
          <span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span><span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span>
        </div>
      </div>
    </section>
    <div class="cursor" aria-hidden="true"><span class="cursor-label"></span></div>
    <script>
      (() => {
        const cursor = document.querySelector('.cursor');
        const label = cursor.querySelector('.cursor-label');
        let x = 0, y = 0, tx = 0, ty = 0;
        window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
        const tick = () => {
          x += (tx - x) * 0.2;
          y += (ty - y) * 0.2;
          cursor.style.transform = \`translate3d(\${x}px, \${y}px, 0) translate3d(-50%, -50%, 0)\`;
          requestAnimationFrame(tick);
        };
        tick();
        document.querySelectorAll('[data-cursor]').forEach(el => {
          el.addEventListener('mouseenter', () => {
            label.textContent = el.dataset.cursor;
            cursor.classList.add('is-label');
          });
          el.addEventListener('mouseleave', () => cursor.classList.remove('is-label'));
        });
      })();
    </script>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: ".cursor .cursor-label",
                    existsOnly: true,
                    message:
                        "Manca <div class=\"cursor\"> con dentro <span class=\"cursor-label\">.",
                },
                {
                    type: "textIncludes",
                    needle: "mix-blend-mode: difference",
                    flexible: true,
                    message:
                        "La .cursor deve avere mix-blend-mode: difference.",
                },
                {
                    type: "textIncludes",
                    needle: "data-cursor",
                    flexible: true,
                    message:
                        "Aggiungi data-cursor=\"VEDI\" sul h1 e data-cursor=\"PROSSIMO →\" sull'a.hero-tag.",
                },
                {
                    type: "textIncludes",
                    needle: "requestAnimationFrame(tick)",
                    flexible: true,
                    message:
                        "Lo script deve usare requestAnimationFrame con lerp (x += (tx-x)*0.2) per il movimento smooth.",
                },
            ],
            message:
                "Custom cursor magnetico con label che muta via data-cursor e lerp smooth.",
        },
        successScript:
            "Muovi il mouse: cerchio bianco che ti segue smooth — non istantaneo, c'è un piccolo trailing perché interpoliamo la posizione (lerp 0.2). Passa sul nome: si trasforma in un disco lime con dentro \"VEDI\". Sul tag: \"PROSSIMO →\". È IL pattern di Awwwards. Ogni studio creativo serio nel 2026 ha un cursor così.",
        encourageScript:
            "div.cursor con dentro span.cursor-label. CSS: cursor: none su body, .cursor 18px tondo bianco con mix-blend-mode difference. is-label la ingrandisce a 110px lime. JS: lerp smooth con requestAnimationFrame, mouseenter su [data-cursor] cambia textContent del label e aggiunge .is-label.",
    },

    {
        order: 5,
        slug: "scroll-scale-title",
        title: "Scroll-driven: il nome scala mentre scrolli",
        durationSec: 140,
        avatarMood: "talking",
        script:
            "Apri il sito di Apple Vision Pro. Scrolli, e il prodotto cambia di scala, ruota, si trasforma in modo cinematico. Una volta serviva GSAP ScrollTrigger e 200KB di JavaScript. Oggi con animation-timeline: scroll() basta una riga di CSS — il browser lega l'animazione direttamente alla posizione dello scroll, e gira a 60fps sul compositor. Aggiungiamo una sezione vuota dopo l'hero così abbiamo da scrollare, e leghiamo lo scroll a un'animazione che fa esplodere ulteriormente il nome.",
        instruction:
            "Subito dopo </section> della hero, aggiungi: <section class=\"scroll-spacer\"></section><section class=\"intro\"><p class=\"intro-text\">Diplomata al Conservatorio di Milano, Ginevra ha portato Chopin e Rachmaninov in oltre 40 sale d'Europa. Da Wigmore Hall a La Fenice, il romanticismo torna a parlare con un'urgenza nuova.</p></section>. Nel <style>, prima di .hero { aggiungi: @keyframes heroScale { 0% { transform: scale(1); opacity: 1; } 60% { transform: scale(1.4); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } } .scroll-spacer { height: 80vh; } .intro { min-height: 100vh; padding: 4rem 2rem; display: flex; align-items: center; justify-content: center; } .intro-text { max-width: 720px; font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 500; line-height: 1.25; letter-spacing: -0.02em; } .intro-text::first-line { color: var(--acid); }. Modifica .hero aggiungendo: position: sticky; top: 0; e modifica .hero-name aggiungendo: animation: heroScale linear both; animation-timeline: scroll(root); animation-range: 0 80vh; transform-origin: left bottom;",
        hint: "Aggiungi una scroll-spacer 80vh e una section.intro con un intro-text. .hero diventa position: sticky top: 0. Su .hero-name applica animation: heroScale linear both, animation-timeline: scroll(root), animation-range: 0 80vh. @keyframes heroScale: scale 1 → 1.4 → 2, opacity 1 → 0.6 → 0. transform-origin: left bottom così esplode da quel angolo.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ginevra Calzi — Pianista</title>
    <style>
      :root {
        --bg: #0a0a0a;
        --fg: #f5f5f5;
        --acid: #c5ff00;
        --muted: #666;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        background: var(--bg);
        color: var(--fg);
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes wordReveal {
        from { opacity: 0; transform: translateY(120%); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes heroScale {
        0% { transform: scale(1); opacity: 1; }
        60% { transform: scale(1.4); opacity: 0.6; }
        100% { transform: scale(2); opacity: 0; }
      }
      .word {
        display: inline-block;
        opacity: 0;
        animation: wordReveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .hero-name .word:nth-child(1) { animation-delay: 0.15s; }
      .hero-name .word:nth-child(3) { animation-delay: 0.3s; }
      .hero-tag.word { animation-delay: 0.6s; }
      .scroll-spacer { height: 80vh; }
      .intro {
        min-height: 100vh;
        padding: 4rem 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .intro-text {
        max-width: 720px;
        font-size: clamp(1.5rem, 3vw, 2.25rem);
        font-weight: 500;
        line-height: 1.25;
        letter-spacing: -0.02em;
      }
      .intro-text::first-line { color: var(--acid); }
      .hero {
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: sticky;
        top: 0;
        overflow: hidden;
      }
      .hero-name {
        font-size: clamp(4rem, 18vw, 22rem);
        font-weight: 900;
        line-height: 0.85;
        letter-spacing: -0.06em;
        text-transform: uppercase;
        overflow: hidden;
        animation: heroScale linear both;
        animation-timeline: scroll(root);
        animation-range: 0 80vh;
        transform-origin: left bottom;
      }
      .hero-tag {
        position: absolute;
        top: 2rem;
        right: 2rem;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--acid);
      }
      .marquee {
        width: 100%;
        overflow: hidden;
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding: 1.25rem 0;
        margin-top: 2rem;
        mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      }
      .marquee-track {
        display: inline-flex;
        gap: 2.5rem;
        white-space: nowrap;
        animation: marquee 24s linear infinite;
        font-size: 1rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        font-weight: 500;
      }
      .marquee-track span:nth-child(even) { color: var(--acid); }
      html, body { cursor: none; }
      @media (hover: none) {
        html, body { cursor: auto; }
        .cursor { display: none; }
      }
      .cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: var(--fg);
        pointer-events: none;
        mix-blend-mode: difference;
        z-index: 9999;
        transform: translate3d(-50%, -50%, 0);
        transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        will-change: transform;
      }
      .cursor.is-label {
        width: 110px;
        height: 110px;
        background: var(--acid);
      }
      .cursor-label {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #0a0a0a;
        opacity: 0;
        transition: opacity 0.2s ease 0.05s;
        white-space: nowrap;
      }
      .cursor.is-label .cursor-label { opacity: 1; }
    </style>
  </head>
  <body>
    <section class="hero">
      <a class="hero-tag word" href="#shows" data-cursor="PROSSIMO →" style="text-decoration:none">Pianista · Repertorio Romantico</a>
      <h1 class="hero-name" data-cursor="VEDI"><span class="word">Ginevra</span><br/><span class="word">Calzi</span></h1>
      <div class="marquee">
        <div class="marquee-track">
          <span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span><span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span>
        </div>
      </div>
    </section>
    <section class="scroll-spacer"></section>
    <section class="intro">
      <p class="intro-text">Diplomata al Conservatorio di Milano, Ginevra ha portato Chopin e Rachmaninov in oltre 40 sale d'Europa. Da Wigmore Hall a La Fenice, il romanticismo torna a parlare con un'urgenza nuova.</p>
    </section>
    <div class="cursor" aria-hidden="true"><span class="cursor-label"></span></div>
    <script>
      (() => {
        const cursor = document.querySelector('.cursor');
        const label = cursor.querySelector('.cursor-label');
        let x = 0, y = 0, tx = 0, ty = 0;
        window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
        const tick = () => {
          x += (tx - x) * 0.2;
          y += (ty - y) * 0.2;
          cursor.style.transform = \`translate3d(\${x}px, \${y}px, 0) translate3d(-50%, -50%, 0)\`;
          requestAnimationFrame(tick);
        };
        tick();
        document.querySelectorAll('[data-cursor]').forEach(el => {
          el.addEventListener('mouseenter', () => {
            label.textContent = el.dataset.cursor;
            cursor.classList.add('is-label');
          });
          el.addEventListener('mouseleave', () => cursor.classList.remove('is-label'));
        });
      })();
    </script>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "section.intro p.intro-text",
                    existsOnly: true,
                    message:
                        "Manca <section class=\"intro\"> con dentro <p class=\"intro-text\">.",
                },
                {
                    type: "textIncludes",
                    needle: "@keyframes heroScale",
                    flexible: true,
                    message:
                        "Definisci @keyframes heroScale con scale(1) → scale(1.4) → scale(2) e opacity decrescente.",
                },
                {
                    type: "textIncludes",
                    needle: "animation-timeline: scroll(",
                    flexible: true,
                    message:
                        "Sul .hero-name applica animation-timeline: scroll(root) per legare l'animazione allo scroll.",
                },
                {
                    type: "textIncludes",
                    needle: "position: sticky",
                    flexible: true,
                    message:
                        "La .hero deve essere position: sticky con top: 0 per il pinning durante lo scroll.",
                },
            ],
            message:
                "Hero sticky con titolo che scala via animation-timeline: scroll(root).",
        },
        successScript:
            "Scrolla giù: il nome cresce, esplode oltre lo schermo, sfuma. Poi appare l'intro col primo paragrafo in lime. Tutto questo con CSS puro, animation-timeline: scroll() — Chrome e Safari lo supportano nativamente. Stesso effetto di Apple, Linear, Nuxt Labs, ma senza GSAP, senza Lenis, zero JavaScript per il movimento.",
        encourageScript:
            "Aggiungi scroll-spacer 80vh + section.intro con intro-text. .hero diventa position: sticky top: 0. .hero-name riceve animation: heroScale linear both, animation-timeline: scroll(root), animation-range: 0 80vh, transform-origin: left bottom. @keyframes heroScale da scale(1) opacity(1) a scale(2) opacity(0).",
    },

    {
        order: 6,
        slug: "shows-reveal",
        title: "Concert dates: reveal cinematici con clip-path",
        durationSec: 150,
        avatarMood: "talking",
        script:
            "Le date dei concerti non possono apparire come una lista. Devono essere un evento. Usiamo animation-timeline: view() — ogni card si attiva quando entra in viewport — ma con un effetto vero: clip-path che si apre da destra, blur che va a fuoco, slide+rotate. Il tipo di reveal che vedi sui siti di Locomotive o di Active Theory. Aggiungiamo anche il hover cinematico: la card che hovera scala leggermente, le altre sfocano via filter e opacity.",
        instruction:
            "Subito dopo </section> della .intro, aggiungi: <section class=\"shows\" id=\"shows\"><h2 class=\"shows-title\">Live</h2><div class=\"shows-list\"><a class=\"show\" href=\"#\" data-cursor=\"BIGLIETTI →\"><span class=\"show-date\">14·06·26</span><span class=\"show-venue\">Teatro La Fenice<small>Venezia · Notturni di Chopin</small></span><span class=\"show-arrow\">→</span></a><a class=\"show\" href=\"#\" data-cursor=\"BIGLIETTI →\"><span class=\"show-date\">22·07·26</span><span class=\"show-venue\">Auditorium Parco della Musica<small>Roma · Rachmaninov n.2</small></span><span class=\"show-arrow\">→</span></a><a class=\"show\" href=\"#\" data-cursor=\"BIGLIETTI →\"><span class=\"show-date\">09·09·26</span><span class=\"show-venue\">Wigmore Hall<small>London · Recital romantico</small></span><span class=\"show-arrow\">→</span></a></div></section>. Nel <style> alla fine aggiungi: @keyframes showReveal { from { opacity: 0; clip-path: inset(0 100% 0 0); filter: blur(12px); transform: translateY(40px); } to { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0); transform: translateY(0); } } .shows { padding: 6rem 2rem 8rem; max-width: 1280px; margin: 0 auto; } .shows-title { font-size: clamp(3rem, 10vw, 9rem); font-weight: 900; letter-spacing: -0.06em; line-height: 0.85; margin-bottom: 4rem; text-transform: uppercase; } .shows-title::after { content: ''; display: inline-block; width: 0.5em; height: 0.5em; background: var(--acid); border-radius: 50%; margin-left: 0.2em; vertical-align: 0.1em; } .shows-list { display: flex; flex-direction: column; } .show { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 2rem; padding: 2.5rem 1rem; border-top: 1px solid rgba(255,255,255,0.12); color: inherit; text-decoration: none; transition: opacity 0.4s ease, filter 0.4s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); animation: showReveal 1s cubic-bezier(0.22, 1, 0.36, 1) both; animation-timeline: view(); animation-range: entry 10% cover 35%; } .show:last-child { border-bottom: 1px solid rgba(255,255,255,0.12); } .shows-list:hover .show:not(:hover) { opacity: 0.35; filter: blur(2px); } .show:hover { transform: translateX(1.5rem); } .show:hover .show-arrow { color: var(--acid); transform: translateX(8px); } .show-date { font-size: 0.95rem; font-weight: 600; letter-spacing: 0.05em; color: var(--acid); font-variant-numeric: tabular-nums; } .show-venue { font-size: clamp(1.4rem, 3vw, 2.25rem); font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; display: flex; flex-direction: column; gap: 0.25rem; } .show-venue small { font-size: 0.85rem; font-weight: 400; color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase; } .show-arrow { font-size: 1.75rem; transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease; }",
        hint: "Aggiungi section.shows con shows-title \"Live\" + shows-list di 3 a.show. Ogni .show ha .show-date, .show-venue (con <small> dentro), .show-arrow. CSS: shows-title oversized clamp(3rem, 10vw, 9rem) con dot lime ::after. .show display grid 3 colonne. animation: showReveal con animation-timeline: view() e animation-range: entry 10% cover 35%. @keyframes showReveal con clip-path inset(0 100% 0 0) → inset(0), blur(12px) → 0, translateY(40px) → 0. Hover cinematico: .shows-list:hover .show:not(:hover) sfoca con opacity 0.35 + blur 2px, .show:hover translateX 1.5rem e arrow lime.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ginevra Calzi — Pianista</title>
    <style>
      :root {
        --bg: #0a0a0a;
        --fg: #f5f5f5;
        --acid: #c5ff00;
        --muted: #666;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        background: var(--bg);
        color: var(--fg);
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes wordReveal {
        from { opacity: 0; transform: translateY(120%); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes heroScale {
        0% { transform: scale(1); opacity: 1; }
        60% { transform: scale(1.4); opacity: 0.6; }
        100% { transform: scale(2); opacity: 0; }
      }
      .word {
        display: inline-block;
        opacity: 0;
        animation: wordReveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .hero-name .word:nth-child(1) { animation-delay: 0.15s; }
      .hero-name .word:nth-child(3) { animation-delay: 0.3s; }
      .hero-tag.word { animation-delay: 0.6s; }
      .scroll-spacer { height: 80vh; }
      .intro {
        min-height: 100vh;
        padding: 4rem 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .intro-text {
        max-width: 720px;
        font-size: clamp(1.5rem, 3vw, 2.25rem);
        font-weight: 500;
        line-height: 1.25;
        letter-spacing: -0.02em;
      }
      .intro-text::first-line { color: var(--acid); }
      .hero {
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: sticky;
        top: 0;
        overflow: hidden;
      }
      .hero-name {
        font-size: clamp(4rem, 18vw, 22rem);
        font-weight: 900;
        line-height: 0.85;
        letter-spacing: -0.06em;
        text-transform: uppercase;
        overflow: hidden;
        animation: heroScale linear both;
        animation-timeline: scroll(root);
        animation-range: 0 80vh;
        transform-origin: left bottom;
      }
      .hero-tag {
        position: absolute;
        top: 2rem;
        right: 2rem;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--acid);
      }
      .marquee {
        width: 100%;
        overflow: hidden;
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding: 1.25rem 0;
        margin-top: 2rem;
        mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      }
      .marquee-track {
        display: inline-flex;
        gap: 2.5rem;
        white-space: nowrap;
        animation: marquee 24s linear infinite;
        font-size: 1rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        font-weight: 500;
      }
      .marquee-track span:nth-child(even) { color: var(--acid); }
      html, body { cursor: none; }
      @media (hover: none) {
        html, body { cursor: auto; }
        .cursor { display: none; }
      }
      .cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: var(--fg);
        pointer-events: none;
        mix-blend-mode: difference;
        z-index: 9999;
        transform: translate3d(-50%, -50%, 0);
        transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        will-change: transform;
      }
      .cursor.is-label {
        width: 110px;
        height: 110px;
        background: var(--acid);
      }
      .cursor-label {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #0a0a0a;
        opacity: 0;
        transition: opacity 0.2s ease 0.05s;
        white-space: nowrap;
      }
      .cursor.is-label .cursor-label { opacity: 1; }
      @keyframes showReveal {
        from { opacity: 0; clip-path: inset(0 100% 0 0); filter: blur(12px); transform: translateY(40px); }
        to { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0); transform: translateY(0); }
      }
      .shows {
        padding: 6rem 2rem 8rem;
        max-width: 1280px;
        margin: 0 auto;
      }
      .shows-title {
        font-size: clamp(3rem, 10vw, 9rem);
        font-weight: 900;
        letter-spacing: -0.06em;
        line-height: 0.85;
        margin-bottom: 4rem;
        text-transform: uppercase;
      }
      .shows-title::after {
        content: '';
        display: inline-block;
        width: 0.5em;
        height: 0.5em;
        background: var(--acid);
        border-radius: 50%;
        margin-left: 0.2em;
        vertical-align: 0.1em;
      }
      .shows-list {
        display: flex;
        flex-direction: column;
      }
      .show {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 2rem;
        padding: 2.5rem 1rem;
        border-top: 1px solid rgba(255,255,255,0.12);
        color: inherit;
        text-decoration: none;
        transition: opacity 0.4s ease, filter 0.4s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        animation: showReveal 1s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-timeline: view();
        animation-range: entry 10% cover 35%;
      }
      .show:last-child { border-bottom: 1px solid rgba(255,255,255,0.12); }
      .shows-list:hover .show:not(:hover) {
        opacity: 0.35;
        filter: blur(2px);
      }
      .show:hover { transform: translateX(1.5rem); }
      .show:hover .show-arrow { color: var(--acid); transform: translateX(8px); }
      .show-date {
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        color: var(--acid);
        font-variant-numeric: tabular-nums;
      }
      .show-venue {
        font-size: clamp(1.4rem, 3vw, 2.25rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .show-venue small {
        font-size: 0.85rem;
        font-weight: 400;
        color: var(--muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .show-arrow {
        font-size: 1.75rem;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
      }
    </style>
  </head>
  <body>
    <section class="hero">
      <a class="hero-tag word" href="#shows" data-cursor="PROSSIMO →" style="text-decoration:none">Pianista · Repertorio Romantico</a>
      <h1 class="hero-name" data-cursor="VEDI"><span class="word">Ginevra</span><br/><span class="word">Calzi</span></h1>
      <div class="marquee">
        <div class="marquee-track">
          <span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span><span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span>
        </div>
      </div>
    </section>
    <section class="scroll-spacer"></section>
    <section class="intro">
      <p class="intro-text">Diplomata al Conservatorio di Milano, Ginevra ha portato Chopin e Rachmaninov in oltre 40 sale d'Europa. Da Wigmore Hall a La Fenice, il romanticismo torna a parlare con un'urgenza nuova.</p>
    </section>
    <section class="shows" id="shows">
      <h2 class="shows-title">Live</h2>
      <div class="shows-list">
        <a class="show" href="#" data-cursor="BIGLIETTI →">
          <span class="show-date">14·06·26</span>
          <span class="show-venue">Teatro La Fenice<small>Venezia · Notturni di Chopin</small></span>
          <span class="show-arrow">→</span>
        </a>
        <a class="show" href="#" data-cursor="BIGLIETTI →">
          <span class="show-date">22·07·26</span>
          <span class="show-venue">Auditorium Parco della Musica<small>Roma · Rachmaninov n.2</small></span>
          <span class="show-arrow">→</span>
        </a>
        <a class="show" href="#" data-cursor="BIGLIETTI →">
          <span class="show-date">09·09·26</span>
          <span class="show-venue">Wigmore Hall<small>London · Recital romantico</small></span>
          <span class="show-arrow">→</span>
        </a>
      </div>
    </section>
    <div class="cursor" aria-hidden="true"><span class="cursor-label"></span></div>
    <script>
      (() => {
        const cursor = document.querySelector('.cursor');
        const label = cursor.querySelector('.cursor-label');
        let x = 0, y = 0, tx = 0, ty = 0;
        window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
        const tick = () => {
          x += (tx - x) * 0.2;
          y += (ty - y) * 0.2;
          cursor.style.transform = \`translate3d(\${x}px, \${y}px, 0) translate3d(-50%, -50%, 0)\`;
          requestAnimationFrame(tick);
        };
        tick();
        document.querySelectorAll('[data-cursor]').forEach(el => {
          el.addEventListener('mouseenter', () => {
            label.textContent = el.dataset.cursor;
            cursor.classList.add('is-label');
          });
          el.addEventListener('mouseleave', () => cursor.classList.remove('is-label'));
        });
      })();
    </script>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "section.shows .shows-list a.show",
                    existsOnly: true,
                    message:
                        "Manca <section class=\"shows\"> con .shows-list e a.show.",
                },
                {
                    type: "textIncludes",
                    needle: "@keyframes showReveal",
                    flexible: true,
                    message:
                        "Definisci @keyframes showReveal con clip-path inset(0 100% 0 0) → inset(0) e blur(12px) → 0.",
                },
                {
                    type: "textIncludes",
                    needle: "animation-timeline: view()",
                    flexible: true,
                    message:
                        "Sulla .show usa animation-timeline: view() per attivare il reveal entrando in viewport.",
                },
                {
                    type: "textIncludes",
                    needle: ":hover .show:not(:hover)",
                    flexible: true,
                    message:
                        "Aggiungi .shows-list:hover .show:not(:hover) con opacity 0.35 + filter blur per il hover cinematico che sfoca le altre.",
                },
            ],
            message:
                "Concert dates con clip-path reveal scroll-driven + hover che sfoca il resto.",
        },
        successScript:
            "Scrolla giù: ogni concerto si rivela con clip-path che si apre da destra come un sipario, blur che va a fuoco, slide che arriva. Ora passa il mouse sopra una card: scivola a destra, le altre sfocano. È il pattern di Locomotive, Awwwards SOTD del mese scorso. Il cursor diventa \"BIGLIETTI →\". Cinema, in una sezione di concerti.",
        encourageScript:
            "section.shows con shows-title \"Live\" + shows-list con 3 a.show (date, venue, arrow). @keyframes showReveal con clip-path da inset(0 100% 0 0) a inset(0), blur(12px) → 0, translateY(40px) → 0. .show con animation-timeline: view() e animation-range: entry 10% cover 35%. Hover: .shows-list:hover .show:not(:hover) sfoca opacity 0.35 + blur 2px.",
    },

    // ────────────── MODULO 3: MAGNETIC + VIEW TRANSITION FINALE ──────────
    {
        order: 7,
        slug: "magnetic-cta",
        title: "Magnetic CTA: il bottone che ti viene incontro",
        durationSec: 140,
        avatarMood: "talking",
        script:
            "I bottoni magnetici sono il segnale che il sito è fatto da gente che sa. Stripe, Linear, ogni studio creativo serio. Quando il mouse si avvicina, il bottone si sposta verso di te — come se fosse magnetizzato. È JavaScript minimo: leggi la posizione del mouse, calcoli il delta dal centro del bottone, e trasformi. Più un ripple effect al click. Aggiungiamo una nav fissa in alto con due voci e un CTA magnetico, preparando il terreno per la View Transition finale.",
        instruction:
            "Subito dopo l'apertura di <body>, prima di section.hero, aggiungi: <nav class=\"nav\"><span class=\"nav-mark\">GC</span><div class=\"nav-views\"><button class=\"nav-link is-active\" data-view=\"home\" data-cursor=\"HOME\">Home</button><button class=\"nav-link\" data-view=\"bio\" data-cursor=\"BIO\">Bio</button></div><button class=\"magnetic\" data-cursor=\"BOOK\"><span class=\"magnetic-inner\">Book Ginevra</span></button></nav>. Nel <style> alla fine aggiungi: .nav { position: fixed; top: 0; left: 0; right: 0; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; z-index: 100; backdrop-filter: blur(14px); background: rgba(10,10,10,0.55); border-bottom: 1px solid rgba(255,255,255,0.06); } .nav-mark { font-weight: 900; letter-spacing: -0.02em; font-size: 1.05rem; } .nav-views { display: flex; gap: 0.25rem; } .nav-link { background: transparent; border: 1px solid transparent; color: var(--fg); font: inherit; font-size: 0.85rem; font-weight: 500; padding: 0.55rem 1rem; border-radius: 999px; cursor: none; letter-spacing: 0.02em; transition: background 0.3s ease, border-color 0.3s ease; } .nav-link.is-active { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); } .magnetic { position: relative; background: var(--acid); color: #0a0a0a; border: none; padding: 0.85rem 1.5rem; border-radius: 999px; font: inherit; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.04em; text-transform: uppercase; cursor: none; overflow: hidden; transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); } .magnetic-inner { display: inline-block; transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); position: relative; z-index: 1; } .magnetic::after { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: rgba(0,0,0,0.18); transform: translate(-50%, -50%); transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease; opacity: 0; } .magnetic.ripple::after { width: 220px; height: 220px; opacity: 1; transition: width 0.5s ease, height 0.5s ease, opacity 0s 0.5s; }. Sostituisci tutto il blocco <script> alla fine con: <script>(() => { const cursor = document.querySelector('.cursor'); const label = cursor.querySelector('.cursor-label'); let x = 0, y = 0, tx = 0, ty = 0; window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }); const tick = () => { x += (tx - x) * 0.2; y += (ty - y) * 0.2; cursor.style.transform = \`translate3d(\${x}px, \${y}px, 0) translate3d(-50%, -50%, 0)\`; requestAnimationFrame(tick); }; tick(); document.querySelectorAll('[data-cursor]').forEach(el => { el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-label'); }); el.addEventListener('mouseleave', () => cursor.classList.remove('is-label')); }); document.querySelectorAll('.magnetic').forEach(btn => { const inner = btn.querySelector('.magnetic-inner'); btn.addEventListener('mousemove', e => { const r = btn.getBoundingClientRect(); const mx = e.clientX - r.left - r.width / 2; const my = e.clientY - r.top - r.height / 2; btn.style.transform = \`translate(\${mx * 0.35}px, \${my * 0.5}px)\`; if (inner) inner.style.transform = \`translate(\${mx * 0.18}px, \${my * 0.25}px)\`; }); btn.addEventListener('mouseleave', () => { btn.style.transform = ''; if (inner) inner.style.transform = ''; }); btn.addEventListener('click', () => { btn.classList.remove('ripple'); void btn.offsetWidth; btn.classList.add('ripple'); }); }); })();</script>",
        hint: "Aggiungi <nav class=\"nav\"> con .nav-mark, .nav-views (button.nav-link Home + Bio data-view), e button.magnetic con span.magnetic-inner dentro. CSS: .nav fissa con backdrop-filter blur, .magnetic in lime con ::after per il ripple (width/height da 0 a 220px). JS: per ogni .magnetic, mousemove calcola delta dal centro e trasla il bottone (×0.35, ×0.5) e l'inner più piano (×0.18, ×0.25). Click toggla classe 'ripple' (con void btn.offsetWidth per restartare l'animazione).",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ginevra Calzi — Pianista</title>
    <style>
      :root {
        --bg: #0a0a0a;
        --fg: #f5f5f5;
        --acid: #c5ff00;
        --muted: #666;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        background: var(--bg);
        color: var(--fg);
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes wordReveal {
        from { opacity: 0; transform: translateY(120%); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes heroScale {
        0% { transform: scale(1); opacity: 1; }
        60% { transform: scale(1.4); opacity: 0.6; }
        100% { transform: scale(2); opacity: 0; }
      }
      .word {
        display: inline-block;
        opacity: 0;
        animation: wordReveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .hero-name .word:nth-child(1) { animation-delay: 0.15s; }
      .hero-name .word:nth-child(3) { animation-delay: 0.3s; }
      .hero-tag.word { animation-delay: 0.6s; }
      .scroll-spacer { height: 80vh; }
      .intro {
        min-height: 100vh;
        padding: 4rem 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .intro-text {
        max-width: 720px;
        font-size: clamp(1.5rem, 3vw, 2.25rem);
        font-weight: 500;
        line-height: 1.25;
        letter-spacing: -0.02em;
      }
      .intro-text::first-line { color: var(--acid); }
      .hero {
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: sticky;
        top: 0;
        overflow: hidden;
      }
      .hero-name {
        font-size: clamp(4rem, 18vw, 22rem);
        font-weight: 900;
        line-height: 0.85;
        letter-spacing: -0.06em;
        text-transform: uppercase;
        overflow: hidden;
        animation: heroScale linear both;
        animation-timeline: scroll(root);
        animation-range: 0 80vh;
        transform-origin: left bottom;
      }
      .hero-tag {
        position: absolute;
        top: 5rem;
        right: 2rem;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--acid);
      }
      .marquee {
        width: 100%;
        overflow: hidden;
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding: 1.25rem 0;
        margin-top: 2rem;
        mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      }
      .marquee-track {
        display: inline-flex;
        gap: 2.5rem;
        white-space: nowrap;
        animation: marquee 24s linear infinite;
        font-size: 1rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        font-weight: 500;
      }
      .marquee-track span:nth-child(even) { color: var(--acid); }
      html, body { cursor: none; }
      @media (hover: none) {
        html, body { cursor: auto; }
        .cursor { display: none; }
      }
      .cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: var(--fg);
        pointer-events: none;
        mix-blend-mode: difference;
        z-index: 9999;
        transform: translate3d(-50%, -50%, 0);
        transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        will-change: transform;
      }
      .cursor.is-label {
        width: 110px;
        height: 110px;
        background: var(--acid);
      }
      .cursor-label {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #0a0a0a;
        opacity: 0;
        transition: opacity 0.2s ease 0.05s;
        white-space: nowrap;
      }
      .cursor.is-label .cursor-label { opacity: 1; }
      @keyframes showReveal {
        from { opacity: 0; clip-path: inset(0 100% 0 0); filter: blur(12px); transform: translateY(40px); }
        to { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0); transform: translateY(0); }
      }
      .shows {
        padding: 6rem 2rem 8rem;
        max-width: 1280px;
        margin: 0 auto;
      }
      .shows-title {
        font-size: clamp(3rem, 10vw, 9rem);
        font-weight: 900;
        letter-spacing: -0.06em;
        line-height: 0.85;
        margin-bottom: 4rem;
        text-transform: uppercase;
      }
      .shows-title::after {
        content: '';
        display: inline-block;
        width: 0.5em;
        height: 0.5em;
        background: var(--acid);
        border-radius: 50%;
        margin-left: 0.2em;
        vertical-align: 0.1em;
      }
      .shows-list {
        display: flex;
        flex-direction: column;
      }
      .show {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 2rem;
        padding: 2.5rem 1rem;
        border-top: 1px solid rgba(255,255,255,0.12);
        color: inherit;
        text-decoration: none;
        transition: opacity 0.4s ease, filter 0.4s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        animation: showReveal 1s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-timeline: view();
        animation-range: entry 10% cover 35%;
      }
      .show:last-child { border-bottom: 1px solid rgba(255,255,255,0.12); }
      .shows-list:hover .show:not(:hover) {
        opacity: 0.35;
        filter: blur(2px);
      }
      .show:hover { transform: translateX(1.5rem); }
      .show:hover .show-arrow { color: var(--acid); transform: translateX(8px); }
      .show-date {
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        color: var(--acid);
        font-variant-numeric: tabular-nums;
      }
      .show-venue {
        font-size: clamp(1.4rem, 3vw, 2.25rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .show-venue small {
        font-size: 0.85rem;
        font-weight: 400;
        color: var(--muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .show-arrow {
        font-size: 1.75rem;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
      }
      .nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 1.25rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 100;
        backdrop-filter: blur(14px);
        background: rgba(10,10,10,0.55);
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .nav-mark {
        font-weight: 900;
        letter-spacing: -0.02em;
        font-size: 1.05rem;
      }
      .nav-views {
        display: flex;
        gap: 0.25rem;
      }
      .nav-link {
        background: transparent;
        border: 1px solid transparent;
        color: var(--fg);
        font: inherit;
        font-size: 0.85rem;
        font-weight: 500;
        padding: 0.55rem 1rem;
        border-radius: 999px;
        cursor: none;
        letter-spacing: 0.02em;
        transition: background 0.3s ease, border-color 0.3s ease;
      }
      .nav-link.is-active {
        background: rgba(255,255,255,0.06);
        border-color: rgba(255,255,255,0.12);
      }
      .magnetic {
        position: relative;
        background: var(--acid);
        color: #0a0a0a;
        border: none;
        padding: 0.85rem 1.5rem;
        border-radius: 999px;
        font: inherit;
        font-weight: 700;
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        cursor: none;
        overflow: hidden;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .magnetic-inner {
        display: inline-block;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        position: relative;
        z-index: 1;
      }
      .magnetic::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(0,0,0,0.18);
        transform: translate(-50%, -50%);
        transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease;
        opacity: 0;
      }
      .magnetic.ripple::after {
        width: 220px;
        height: 220px;
        opacity: 1;
        transition: width 0.5s ease, height 0.5s ease, opacity 0s 0.5s;
      }
    </style>
  </head>
  <body>
    <nav class="nav">
      <span class="nav-mark">GC</span>
      <div class="nav-views">
        <button class="nav-link is-active" data-view="home" data-cursor="HOME">Home</button>
        <button class="nav-link" data-view="bio" data-cursor="BIO">Bio</button>
      </div>
      <button class="magnetic" data-cursor="BOOK"><span class="magnetic-inner">Book Ginevra</span></button>
    </nav>
    <section class="hero">
      <a class="hero-tag word" href="#shows" data-cursor="PROSSIMO →" style="text-decoration:none">Pianista · Repertorio Romantico</a>
      <h1 class="hero-name" data-cursor="VEDI"><span class="word">Ginevra</span><br/><span class="word">Calzi</span></h1>
      <div class="marquee">
        <div class="marquee-track">
          <span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span><span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span>
        </div>
      </div>
    </section>
    <section class="scroll-spacer"></section>
    <section class="intro">
      <p class="intro-text">Diplomata al Conservatorio di Milano, Ginevra ha portato Chopin e Rachmaninov in oltre 40 sale d'Europa. Da Wigmore Hall a La Fenice, il romanticismo torna a parlare con un'urgenza nuova.</p>
    </section>
    <section class="shows" id="shows">
      <h2 class="shows-title">Live</h2>
      <div class="shows-list">
        <a class="show" href="#" data-cursor="BIGLIETTI →">
          <span class="show-date">14·06·26</span>
          <span class="show-venue">Teatro La Fenice<small>Venezia · Notturni di Chopin</small></span>
          <span class="show-arrow">→</span>
        </a>
        <a class="show" href="#" data-cursor="BIGLIETTI →">
          <span class="show-date">22·07·26</span>
          <span class="show-venue">Auditorium Parco della Musica<small>Roma · Rachmaninov n.2</small></span>
          <span class="show-arrow">→</span>
        </a>
        <a class="show" href="#" data-cursor="BIGLIETTI →">
          <span class="show-date">09·09·26</span>
          <span class="show-venue">Wigmore Hall<small>London · Recital romantico</small></span>
          <span class="show-arrow">→</span>
        </a>
      </div>
    </section>
    <div class="cursor" aria-hidden="true"><span class="cursor-label"></span></div>
    <script>
      (() => {
        const cursor = document.querySelector('.cursor');
        const label = cursor.querySelector('.cursor-label');
        let x = 0, y = 0, tx = 0, ty = 0;
        window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
        const tick = () => {
          x += (tx - x) * 0.2;
          y += (ty - y) * 0.2;
          cursor.style.transform = \`translate3d(\${x}px, \${y}px, 0) translate3d(-50%, -50%, 0)\`;
          requestAnimationFrame(tick);
        };
        tick();
        document.querySelectorAll('[data-cursor]').forEach(el => {
          el.addEventListener('mouseenter', () => {
            label.textContent = el.dataset.cursor;
            cursor.classList.add('is-label');
          });
          el.addEventListener('mouseleave', () => cursor.classList.remove('is-label'));
        });
        document.querySelectorAll('.magnetic').forEach(btn => {
          const inner = btn.querySelector('.magnetic-inner');
          btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const mx = e.clientX - r.left - r.width / 2;
            const my = e.clientY - r.top - r.height / 2;
            btn.style.transform = \`translate(\${mx * 0.35}px, \${my * 0.5}px)\`;
            if (inner) inner.style.transform = \`translate(\${mx * 0.18}px, \${my * 0.25}px)\`;
          });
          btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            if (inner) inner.style.transform = '';
          });
          btn.addEventListener('click', () => {
            btn.classList.remove('ripple');
            void btn.offsetWidth;
            btn.classList.add('ripple');
          });
        });
      })();
    </script>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "nav.nav button.magnetic .magnetic-inner",
                    existsOnly: true,
                    message:
                        "Manca <nav class=\"nav\"> con dentro <button class=\"magnetic\"><span class=\"magnetic-inner\">.",
                },
                {
                    type: "querySelector",
                    selector: "nav button[data-view=\"bio\"]",
                    existsOnly: true,
                    message:
                        "Manca il button con data-view=\"bio\" nella nav.",
                },
                {
                    type: "textIncludes",
                    needle: "getBoundingClientRect",
                    flexible: true,
                    message:
                        "Lo script magnetic deve usare getBoundingClientRect per calcolare il delta dal centro del bottone.",
                },
                {
                    type: "textIncludes",
                    needle: "magnetic.ripple",
                    flexible: true,
                    message:
                        "Aggiungi la classe ripple via JS al click + il CSS .magnetic.ripple::after che espande il cerchio.",
                },
            ],
            message:
                "Nav fissa con button magnetico che insegue il cursore + ripple al click.",
        },
        successScript:
            "Avvicina il mouse al bottone \"Book Ginevra\": il bottone scivola verso di te, l'inner segue più piano (parallax dentro al bottone). Click: ripple onda che si espande dal centro. Quel doppio movimento (outer + inner a velocità diverse) è il dettaglio che fa la differenza — è esattamente quello che fa Stripe sui CTA della home.",
        encourageScript:
            "Nav fissa con nav-mark + nav-views (Home/Bio button data-view) + button.magnetic con span.magnetic-inner. CSS magnetic in lime con ::after per ripple (width 0 → 220px). JS: per ogni .magnetic, mousemove con getBoundingClientRect calcola delta e trasla bottone (×0.35, ×0.5) e inner (×0.18, ×0.25). Click toggla 'ripple'.",
    },

    {
        order: 8,
        slug: "view-transition-cinematic",
        title: "View Transition cinematica: il finale",
        durationSec: 180,
        avatarMood: "happy",
        script:
            "Mossa finale, e cosa che separa un sito web da un sito d'autore: View Transitions API. Quando clicchi Bio, il nome di Ginevra non sparisce e ricompare — ruota, si trasforma, si scala, riappare ribaltato dall'altro lato. Mezzo secondo di magia. Pura sintassi CSS, zero librerie. Diamo a hero-name e a un nuovo bio-name lo stesso view-transition-name, e CSS gestisce il morphing automaticamente. Aggiungiamo anche prefers-reduced-motion per chi non vuole movimento — è la firma di un developer professionista.",
        instruction:
            "Nel <head>, prima di </head>, aggiungi: <meta name=\"view-transition\" content=\"same-origin\" />. Subito dopo </section> della .shows aggiungi: <section class=\"bio\" hidden><div class=\"bio-stage\"><span class=\"bio-tag\">— Bio —</span><h1 class=\"bio-name\">Calzi<br/>Ginevra</h1><div class=\"bio-grid\"><div><h3>Formazione</h3><p>Conservatorio di Milano, diploma con lode 2018. Masterclass con Maurizio Pollini e Krystian Zimerman.</p></div><div><h3>Premi</h3><p>1° Premio Concorso Busoni 2021. Finalista Chopin Warsaw 2022. Borsa di studio Yamaha.</p></div><div><h3>Discografia</h3><p>\"Notturni\" (Decca, 2024). \"Variations\" (DG, 2026, in uscita).</p></div></div></div></section>. Nel <style>, dopo @keyframes heroScale, aggiungi: @keyframes vtRotateOut { from { opacity: 1; transform: rotate(0) scale(1); } to { opacity: 0; transform: rotate(-8deg) scale(0.7) translateX(-30%); } } @keyframes vtRotateIn { from { opacity: 0; transform: rotate(8deg) scale(0.7) translateX(30%); } to { opacity: 1; transform: rotate(0) scale(1); } }. Modifica .hero-name aggiungendo: view-transition-name: persona-name;. Alla fine del <style> aggiungi: .bio { min-height: 100vh; padding: 8rem 2rem 4rem; max-width: 1280px; margin: 0 auto; display: flex; align-items: center; } .bio-stage { width: 100%; } .bio-tag { display: block; font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--acid); margin-bottom: 1.5rem; } .bio-name { font-size: clamp(4rem, 18vw, 22rem); font-weight: 900; line-height: 0.85; letter-spacing: -0.06em; text-transform: uppercase; view-transition-name: persona-name; margin-bottom: 4rem; } .bio-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; max-width: 960px; } .bio-grid h3 { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--acid); margin-bottom: 0.75rem; } .bio-grid p { font-size: 1rem; line-height: 1.55; color: rgba(245,245,245,0.78); font-weight: 400; } ::view-transition-old(persona-name) { animation: vtRotateOut 0.6s cubic-bezier(0.7, 0, 0.3, 1) both; } ::view-transition-new(persona-name) { animation: vtRotateIn 0.6s cubic-bezier(0.7, 0, 0.3, 1) 0.05s both; } ::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.55s; animation-timing-function: cubic-bezier(0.7, 0, 0.3, 1); } @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } .marquee-track { animation: none !important; } html, body { cursor: auto !important; } .cursor { display: none !important; } ::view-transition-old(persona-name), ::view-transition-new(persona-name) { animation: none !important; } }. Sostituisci tutto il <script> alla fine con: <script>(() => { const cursor = document.querySelector('.cursor'); const label = cursor.querySelector('.cursor-label'); let x = 0, y = 0, tx = 0, ty = 0; window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }); const tick = () => { x += (tx - x) * 0.2; y += (ty - y) * 0.2; cursor.style.transform = \`translate3d(\${x}px, \${y}px, 0) translate3d(-50%, -50%, 0)\`; requestAnimationFrame(tick); }; tick(); document.querySelectorAll('[data-cursor]').forEach(el => { el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-label'); }); el.addEventListener('mouseleave', () => cursor.classList.remove('is-label')); }); document.querySelectorAll('.magnetic').forEach(btn => { const inner = btn.querySelector('.magnetic-inner'); btn.addEventListener('mousemove', e => { const r = btn.getBoundingClientRect(); const mx = e.clientX - r.left - r.width / 2; const my = e.clientY - r.top - r.height / 2; btn.style.transform = \`translate(\${mx * 0.35}px, \${my * 0.5}px)\`; if (inner) inner.style.transform = \`translate(\${mx * 0.18}px, \${my * 0.25}px)\`; }); btn.addEventListener('mouseleave', () => { btn.style.transform = ''; if (inner) inner.style.transform = ''; }); btn.addEventListener('click', () => { btn.classList.remove('ripple'); void btn.offsetWidth; btn.classList.add('ripple'); }); }); const home = document.querySelector('.hero'); const bio = document.querySelector('.bio'); document.querySelectorAll('[data-view]').forEach(btn => { btn.addEventListener('click', () => { const view = btn.dataset.view; const swap = () => { home.hidden = view !== 'home'; bio.hidden = view !== 'bio'; document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('is-active', l.dataset.view === view)); window.scrollTo({ top: 0, behavior: 'instant' }); }; if (document.startViewTransition) { document.startViewTransition(swap); } else { swap(); } }); }); })();</script>",
        hint: "Aggiungi <meta name=\"view-transition\" content=\"same-origin\"/> nel head. Crea section.bio (hidden) con bio-stage, bio-tag, h1.bio-name (testo \"Calzi / Ginevra\" invertito), bio-grid (3 colonne Formazione/Premi/Discografia). Sia .hero-name che .bio-name ricevono view-transition-name: persona-name. @keyframes vtRotateOut (rotate 0 → -8deg, scale 1 → 0.7, translateX -30%) e vtRotateIn (specchio dall'altra parte). ::view-transition-old/new(persona-name) applicano le keyframes. JS: click su [data-view] dentro document.startViewTransition fa swap home/bio + toggle is-active su nav-link. @media prefers-reduced-motion: reduce spegne tutto.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ginevra Calzi — Pianista</title>
    <style>
      :root {
        --bg: #0a0a0a;
        --fg: #f5f5f5;
        --acid: #c5ff00;
        --muted: #666;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        background: var(--bg);
        color: var(--fg);
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes wordReveal {
        from { opacity: 0; transform: translateY(120%); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes heroScale {
        0% { transform: scale(1); opacity: 1; }
        60% { transform: scale(1.4); opacity: 0.6; }
        100% { transform: scale(2); opacity: 0; }
      }
      @keyframes vtRotateOut {
        from { opacity: 1; transform: rotate(0) scale(1); }
        to { opacity: 0; transform: rotate(-8deg) scale(0.7) translateX(-30%); }
      }
      @keyframes vtRotateIn {
        from { opacity: 0; transform: rotate(8deg) scale(0.7) translateX(30%); }
        to { opacity: 1; transform: rotate(0) scale(1); }
      }
      .word {
        display: inline-block;
        opacity: 0;
        animation: wordReveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .hero-name .word:nth-child(1) { animation-delay: 0.15s; }
      .hero-name .word:nth-child(3) { animation-delay: 0.3s; }
      .hero-tag.word { animation-delay: 0.6s; }
      .scroll-spacer { height: 80vh; }
      .intro {
        min-height: 100vh;
        padding: 4rem 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .intro-text {
        max-width: 720px;
        font-size: clamp(1.5rem, 3vw, 2.25rem);
        font-weight: 500;
        line-height: 1.25;
        letter-spacing: -0.02em;
      }
      .intro-text::first-line { color: var(--acid); }
      .hero {
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: sticky;
        top: 0;
        overflow: hidden;
      }
      .hero-name {
        font-size: clamp(4rem, 18vw, 22rem);
        font-weight: 900;
        line-height: 0.85;
        letter-spacing: -0.06em;
        text-transform: uppercase;
        overflow: hidden;
        animation: heroScale linear both;
        animation-timeline: scroll(root);
        animation-range: 0 80vh;
        transform-origin: left bottom;
        view-transition-name: persona-name;
      }
      .hero-tag {
        position: absolute;
        top: 5rem;
        right: 2rem;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--acid);
      }
      .marquee {
        width: 100%;
        overflow: hidden;
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding: 1.25rem 0;
        margin-top: 2rem;
        mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      }
      .marquee-track {
        display: inline-flex;
        gap: 2.5rem;
        white-space: nowrap;
        animation: marquee 24s linear infinite;
        font-size: 1rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        font-weight: 500;
      }
      .marquee-track span:nth-child(even) { color: var(--acid); }
      html, body { cursor: none; }
      @media (hover: none) {
        html, body { cursor: auto; }
        .cursor { display: none; }
      }
      .cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: var(--fg);
        pointer-events: none;
        mix-blend-mode: difference;
        z-index: 9999;
        transform: translate3d(-50%, -50%, 0);
        transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        will-change: transform;
      }
      .cursor.is-label {
        width: 110px;
        height: 110px;
        background: var(--acid);
      }
      .cursor-label {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #0a0a0a;
        opacity: 0;
        transition: opacity 0.2s ease 0.05s;
        white-space: nowrap;
      }
      .cursor.is-label .cursor-label { opacity: 1; }
      @keyframes showReveal {
        from { opacity: 0; clip-path: inset(0 100% 0 0); filter: blur(12px); transform: translateY(40px); }
        to { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0); transform: translateY(0); }
      }
      .shows {
        padding: 6rem 2rem 8rem;
        max-width: 1280px;
        margin: 0 auto;
      }
      .shows-title {
        font-size: clamp(3rem, 10vw, 9rem);
        font-weight: 900;
        letter-spacing: -0.06em;
        line-height: 0.85;
        margin-bottom: 4rem;
        text-transform: uppercase;
      }
      .shows-title::after {
        content: '';
        display: inline-block;
        width: 0.5em;
        height: 0.5em;
        background: var(--acid);
        border-radius: 50%;
        margin-left: 0.2em;
        vertical-align: 0.1em;
      }
      .shows-list {
        display: flex;
        flex-direction: column;
      }
      .show {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 2rem;
        padding: 2.5rem 1rem;
        border-top: 1px solid rgba(255,255,255,0.12);
        color: inherit;
        text-decoration: none;
        transition: opacity 0.4s ease, filter 0.4s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        animation: showReveal 1s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-timeline: view();
        animation-range: entry 10% cover 35%;
      }
      .show:last-child { border-bottom: 1px solid rgba(255,255,255,0.12); }
      .shows-list:hover .show:not(:hover) {
        opacity: 0.35;
        filter: blur(2px);
      }
      .show:hover { transform: translateX(1.5rem); }
      .show:hover .show-arrow { color: var(--acid); transform: translateX(8px); }
      .show-date {
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        color: var(--acid);
        font-variant-numeric: tabular-nums;
      }
      .show-venue {
        font-size: clamp(1.4rem, 3vw, 2.25rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .show-venue small {
        font-size: 0.85rem;
        font-weight: 400;
        color: var(--muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .show-arrow {
        font-size: 1.75rem;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
      }
      .nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 1.25rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 100;
        backdrop-filter: blur(14px);
        background: rgba(10,10,10,0.55);
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .nav-mark {
        font-weight: 900;
        letter-spacing: -0.02em;
        font-size: 1.05rem;
      }
      .nav-views {
        display: flex;
        gap: 0.25rem;
      }
      .nav-link {
        background: transparent;
        border: 1px solid transparent;
        color: var(--fg);
        font: inherit;
        font-size: 0.85rem;
        font-weight: 500;
        padding: 0.55rem 1rem;
        border-radius: 999px;
        cursor: none;
        letter-spacing: 0.02em;
        transition: background 0.3s ease, border-color 0.3s ease;
      }
      .nav-link.is-active {
        background: rgba(255,255,255,0.06);
        border-color: rgba(255,255,255,0.12);
      }
      .magnetic {
        position: relative;
        background: var(--acid);
        color: #0a0a0a;
        border: none;
        padding: 0.85rem 1.5rem;
        border-radius: 999px;
        font: inherit;
        font-weight: 700;
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        cursor: none;
        overflow: hidden;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .magnetic-inner {
        display: inline-block;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        position: relative;
        z-index: 1;
      }
      .magnetic::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(0,0,0,0.18);
        transform: translate(-50%, -50%);
        transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease;
        opacity: 0;
      }
      .magnetic.ripple::after {
        width: 220px;
        height: 220px;
        opacity: 1;
        transition: width 0.5s ease, height 0.5s ease, opacity 0s 0.5s;
      }
      .bio {
        min-height: 100vh;
        padding: 8rem 2rem 4rem;
        max-width: 1280px;
        margin: 0 auto;
        display: flex;
        align-items: center;
      }
      .bio-stage { width: 100%; }
      .bio-tag {
        display: block;
        font-size: 0.75rem;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: var(--acid);
        margin-bottom: 1.5rem;
      }
      .bio-name {
        font-size: clamp(4rem, 18vw, 22rem);
        font-weight: 900;
        line-height: 0.85;
        letter-spacing: -0.06em;
        text-transform: uppercase;
        view-transition-name: persona-name;
        margin-bottom: 4rem;
      }
      .bio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 2.5rem;
        max-width: 960px;
      }
      .bio-grid h3 {
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--acid);
        margin-bottom: 0.75rem;
      }
      .bio-grid p {
        font-size: 1rem;
        line-height: 1.55;
        color: rgba(245,245,245,0.78);
        font-weight: 400;
      }
      ::view-transition-old(persona-name) {
        animation: vtRotateOut 0.6s cubic-bezier(0.7, 0, 0.3, 1) both;
      }
      ::view-transition-new(persona-name) {
        animation: vtRotateIn 0.6s cubic-bezier(0.7, 0, 0.3, 1) 0.05s both;
      }
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 0.55s;
        animation-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        .marquee-track { animation: none !important; }
        html, body { cursor: auto !important; }
        .cursor { display: none !important; }
        ::view-transition-old(persona-name),
        ::view-transition-new(persona-name) { animation: none !important; }
      }
    </style>
    <meta name="view-transition" content="same-origin" />
  </head>
  <body>
    <nav class="nav">
      <span class="nav-mark">GC</span>
      <div class="nav-views">
        <button class="nav-link is-active" data-view="home" data-cursor="HOME">Home</button>
        <button class="nav-link" data-view="bio" data-cursor="BIO">Bio</button>
      </div>
      <button class="magnetic" data-cursor="BOOK"><span class="magnetic-inner">Book Ginevra</span></button>
    </nav>
    <section class="hero">
      <a class="hero-tag word" href="#shows" data-cursor="PROSSIMO →" style="text-decoration:none">Pianista · Repertorio Romantico</a>
      <h1 class="hero-name" data-cursor="VEDI"><span class="word">Ginevra</span><br/><span class="word">Calzi</span></h1>
      <div class="marquee">
        <div class="marquee-track">
          <span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span><span>Chopin</span><span>·</span><span>Rachmaninov</span><span>·</span><span>Liszt</span><span>·</span><span>Debussy</span><span>·</span><span>Schumann</span><span>·</span>
        </div>
      </div>
    </section>
    <section class="scroll-spacer"></section>
    <section class="intro">
      <p class="intro-text">Diplomata al Conservatorio di Milano, Ginevra ha portato Chopin e Rachmaninov in oltre 40 sale d'Europa. Da Wigmore Hall a La Fenice, il romanticismo torna a parlare con un'urgenza nuova.</p>
    </section>
    <section class="shows" id="shows">
      <h2 class="shows-title">Live</h2>
      <div class="shows-list">
        <a class="show" href="#" data-cursor="BIGLIETTI →">
          <span class="show-date">14·06·26</span>
          <span class="show-venue">Teatro La Fenice<small>Venezia · Notturni di Chopin</small></span>
          <span class="show-arrow">→</span>
        </a>
        <a class="show" href="#" data-cursor="BIGLIETTI →">
          <span class="show-date">22·07·26</span>
          <span class="show-venue">Auditorium Parco della Musica<small>Roma · Rachmaninov n.2</small></span>
          <span class="show-arrow">→</span>
        </a>
        <a class="show" href="#" data-cursor="BIGLIETTI →">
          <span class="show-date">09·09·26</span>
          <span class="show-venue">Wigmore Hall<small>London · Recital romantico</small></span>
          <span class="show-arrow">→</span>
        </a>
      </div>
    </section>
    <section class="bio" hidden>
      <div class="bio-stage">
        <span class="bio-tag">— Bio —</span>
        <h1 class="bio-name">Calzi<br/>Ginevra</h1>
        <div class="bio-grid">
          <div>
            <h3>Formazione</h3>
            <p>Conservatorio di Milano, diploma con lode 2018. Masterclass con Maurizio Pollini e Krystian Zimerman.</p>
          </div>
          <div>
            <h3>Premi</h3>
            <p>1° Premio Concorso Busoni 2021. Finalista Chopin Warsaw 2022. Borsa di studio Yamaha.</p>
          </div>
          <div>
            <h3>Discografia</h3>
            <p>"Notturni" (Decca, 2024). "Variations" (DG, 2026, in uscita).</p>
          </div>
        </div>
      </div>
    </section>
    <div class="cursor" aria-hidden="true"><span class="cursor-label"></span></div>
    <script>
      (() => {
        const cursor = document.querySelector('.cursor');
        const label = cursor.querySelector('.cursor-label');
        let x = 0, y = 0, tx = 0, ty = 0;
        window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
        const tick = () => {
          x += (tx - x) * 0.2;
          y += (ty - y) * 0.2;
          cursor.style.transform = \`translate3d(\${x}px, \${y}px, 0) translate3d(-50%, -50%, 0)\`;
          requestAnimationFrame(tick);
        };
        tick();
        document.querySelectorAll('[data-cursor]').forEach(el => {
          el.addEventListener('mouseenter', () => {
            label.textContent = el.dataset.cursor;
            cursor.classList.add('is-label');
          });
          el.addEventListener('mouseleave', () => cursor.classList.remove('is-label'));
        });
        document.querySelectorAll('.magnetic').forEach(btn => {
          const inner = btn.querySelector('.magnetic-inner');
          btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const mx = e.clientX - r.left - r.width / 2;
            const my = e.clientY - r.top - r.height / 2;
            btn.style.transform = \`translate(\${mx * 0.35}px, \${my * 0.5}px)\`;
            if (inner) inner.style.transform = \`translate(\${mx * 0.18}px, \${my * 0.25}px)\`;
          });
          btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            if (inner) inner.style.transform = '';
          });
          btn.addEventListener('click', () => {
            btn.classList.remove('ripple');
            void btn.offsetWidth;
            btn.classList.add('ripple');
          });
        });
        const home = document.querySelector('.hero');
        const bio = document.querySelector('.bio');
        document.querySelectorAll('[data-view]').forEach(btn => {
          btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            const swap = () => {
              home.hidden = view !== 'home';
              bio.hidden = view !== 'bio';
              document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('is-active', l.dataset.view === view));
              window.scrollTo({ top: 0, behavior: 'instant' });
            };
            if (document.startViewTransition) {
              document.startViewTransition(swap);
            } else {
              swap();
            }
          });
        });
      })();
    </script>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "section.bio h1.bio-name",
                    existsOnly: true,
                    message:
                        "Manca <section class=\"bio\" hidden> con dentro <h1 class=\"bio-name\">.",
                },
                {
                    type: "textIncludes",
                    needle: "view-transition-name: persona-name",
                    flexible: true,
                    message:
                        "Sia .hero-name che .bio-name devono avere view-transition-name: persona-name.",
                },
                {
                    type: "textIncludes",
                    needle: "::view-transition-old(persona-name)",
                    flexible: true,
                    message:
                        "Devi definire ::view-transition-old(persona-name) e ::view-transition-new(persona-name) con le @keyframes vtRotate.",
                },
                {
                    type: "textIncludes",
                    needle: "document.startViewTransition",
                    flexible: true,
                    message:
                        "Lo script deve usare document.startViewTransition(swap) per attivare la View Transition.",
                },
                {
                    type: "textIncludes",
                    needle: "@media (prefers-reduced-motion: reduce)",
                    flexible: true,
                    message:
                        "Aggiungi @media (prefers-reduced-motion: reduce) per accessibilità — niente animazioni se l'utente preferisce.",
                },
            ],
            message:
                "View Transition cinematica home/bio + prefers-reduced-motion gestito.",
        },
        successScript:
            "Clicca Bio. Il nome di Ginevra ruota, scivola verso sinistra, esce — e dall'altra parte arriva \"Calzi / Ginevra\" ribaltato, che ruota in posizione. Mezzo secondo di magia, zero librerie. Clicca Home: torna indietro con la transizione speculare. Apri Preferenze macOS > Accessibilità > Reduce Motion: ricarica e tutto è statico, navigabile, rispettoso. Hai costruito una landing che VINCE Awwwards Site of the Day. Tipografia brutalist, marquee, scroll-driven, magnetic cursor con label, View Transitions cinematiche, prefers-reduced-motion. Adesso il sito di Ginevra è pronto. Vai a fare il tuo.",
        encourageScript:
            "Meta view-transition nel head. Section.bio (hidden) con bio-tag, h1.bio-name (\"Calzi/Ginevra\"), bio-grid 3 colonne. .hero-name e .bio-name entrambi con view-transition-name: persona-name. @keyframes vtRotateOut (rotate -8deg, scale 0.7, translateX -30%) e vtRotateIn specchio. ::view-transition-old/new(persona-name) applicano le keyframes. JS click su [data-view] dentro startViewTransition fa swap home/bio + toggle is-active. @media prefers-reduced-motion alla fine spegne tutto.",
    },
];

animazioniAvanzateCourse.lessons = lessons;
animazioniAvanzateCourse.finalCode = lessons[lessons.length - 1].expectedSnapshot;
