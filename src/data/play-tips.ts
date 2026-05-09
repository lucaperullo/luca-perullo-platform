/**
 * Suggerimenti contestuali per ogni lezione del corso /play.
 * 2-4 tip per lezione, linguaggio kid-friendly.
 *
 * Allineato al nuovo arc che dà il "wow" precoce nel modulo 1.
 */

export type Tip = {
    title: string;
    body: string;
};

export const tipsByLessonOrder: Record<number, Tip[]> = {
    // ───── MODULO 1 — Comincia col botto
    1: [
        {
            title: "Brutto è OK per ora",
            body: "Sì, fa schifo: testo nudo su sfondo bianco. È ESATTAMENTE il punto di partenza giusto. Tra 3 lezioni sembrerà un altro sito.",
        },
        {
            title: "Una sola h1 per pagina",
            body: "L'h1 è il titolone più importante. Ce n'è uno solo per pagina, regola SEO. Per altri titoli si usano h2, h3, h4.",
        },
        {
            title: "Niente di magico nel font",
            body: "Adesso vedi il font di default (Times New Roman su molti browser). Brutto e generico. Tra una lezione lo cambiamo.",
        },
    ],
    2: [
        {
            title: "Google Fonts gratis",
            body: "Bricolage Grotesque, Inter, Geist, Manrope, Space Grotesk: sono tutti gratis su Google Fonts. Il <link> li carica al volo.",
        },
        {
            title: "Reset = annulla i default",
            body: "L'asterisco { margin: 0; padding: 0; } azzera gli spazi di default che il browser mette. Da qui decidi tutto tu.",
        },
        {
            title: "system-ui come fallback",
            body: "'Bricolage Grotesque', system-ui, sans-serif: se Google Fonts non si carica, usa il font di sistema, e poi il sans-serif generico. Il browser prova in ordine.",
        },
        {
            title: "min-height: 100vh",
            body: "100vh = 100% dell'altezza della finestra. Garantisce che il body riempia almeno una schermata, anche se il contenuto è poco.",
        },
    ],
    3: [
        {
            title: "Flexbox per centrare",
            body: "display: flex + justify-content: center + align-items: center è il modo moderno per centrare orizzontalmente E verticalmente. Funziona sempre.",
        },
        {
            title: "min-height: 100vh sull'hero",
            body: "Fa diventare la hero alta come tutto lo schermo, qualunque sia il contenuto dentro. È la regola che 'apre' il sito al primo impatto.",
        },
        {
            title: "vh = viewport height",
            body: "1vh = 1% dell'altezza della finestra del browser. 100vh = altezza piena. È relativo allo schermo dell'utente, non a un valore fisso.",
        },
    ],
    4: [
        {
            title: "Gradient text — il trucco magico",
            body: "Metti un gradient di sfondo sul testo, poi background-clip: text dice 'mostra il gradient solo dietro il testo'. color: transparent rivela il gradient. Da qui in poi lo userai sempre.",
        },
        {
            title: "clamp(min, ideale, max)",
            body: "clamp(48px, 10vw, 140px) = mai sotto 48px, mai sopra 140px, normalmente 10% della larghezza viewport. Tipografia responsive in una riga.",
        },
        {
            title: "border-radius: 999px",
            body: "Per fare bottoni a pillola, 999px funziona meglio di 50%: il browser arrotonda al massimo possibile, qualunque sia la larghezza.",
        },
        {
            title: "Letter-spacing negativo",
            body: "letter-spacing: -0.04em sui titoli grandi: avvicina le lettere, dà un look 'tight' e moderno. Sui testi piccoli invece si fa spaziatura positiva.",
        },
    ],

    // ───── MODULO 2 — Più contenuto
    5: [
        {
            title: "Header invisibile",
            body: "Header in alto piccolo e discreto: i siti moderni non gridano col logo. Lasciano che siano i contenuti a parlare.",
        },
        {
            title: "h2 dentro l'header",
            body: "Per il logo testuale uso h2, non h1: l'h1 (la 'star' SEO) sta nella hero col titolone. Il logo è solo navigazione.",
        },
    ],
    6: [
        {
            title: "section come capitolo",
            body: "section divide la pagina in zone tematiche. Ogni zona separata = nuova section. Aiuta browser, motori di ricerca e lettori vocali.",
        },
        {
            title: "div = contenitore-jolly",
            body: "Quando una zona non ha un nome semantico (come header o section), usi div. È il contenitore generico per qualsiasi cosa.",
        },
        {
            title: "Etichette in inglese",
            body: "card, services, hero: convenzione internazionale. Funzionerebbero anche in italiano ma è meno standard. Tutti i tutorial e libri usano inglese.",
        },
    ],
    7: [
        {
            title: "padding: 96px 32px",
            body: "Sembra esagerato? Spazio bianco generoso = sito di qualità. Le sezioni respirano. Mai aver paura di lasciare aria intorno alle cose.",
        },
        {
            title: "Il simbolo > = figlio diretto",
            body: ".services > h2 prende SOLO l'h2 figlio diretto di .services. Non i nipoti (gli h3 dentro le card). Utile per non far confusione.",
        },
        {
            title: "clamp anche sui sottotitoli",
            body: "clamp(36px, 6vw, 64px) sull'h2 della section: cresce e si rimpicciolisce in proporzione. Stesso trucco del titolone della hero, scala diversa.",
        },
    ],
    8: [
        {
            title: "border-radius: 16px",
            body: "16px è il sweet spot per le card moderne. 8px sembra timido, 24px diventa cartoonesco. 12-16 è la zona giusta.",
        },
        {
            title: "box-shadow leggera",
            body: "0 4px 12px rgba(0,0,0,0.04) — offset Y di 4px, sfocatura 12px, nero al 4% (quasi nulla). Le ombre buone si VEDONO appena.",
        },
        {
            title: "max-width + margin auto",
            body: "max-width: 720px + margin-left/right: auto = elemento centrato che non supera mai 720px di larghezza. Ottimo per leggibilità.",
        },
    ],

    // ───── MODULO 3 — Card e layout
    9: [
        {
            title: "h3 dentro le card",
            body: "Gerarchia: h1 nella hero, h2 nelle section, h3 nelle card. Mai saltare livelli (no h2 → h4). Google e screen reader si offendono.",
        },
        {
            title: "Colore per testi secondari",
            body: "color: #6b6b6b (grigio medio) per le descrizioni: leggibile ma non aggressivo. Il nero pieno #000 è troppo forte sulle descrizioni.",
        },
        {
            title: "line-height: 1.6 sui paragrafi",
            body: "I paragrafi vogliono un line-height più alto del default (1.2-1.4). 1.6 fa respirare il testo, lo rende più piacevole da leggere.",
        },
    ],
    10: [
        {
            title: "display: flex sul genitore",
            body: "display: flex va sul container (.cards), non sui figli (.card). Sono i figli a 'diventare flessibili', il genitore li dispone.",
        },
        {
            title: "flex: 1 1 280px",
            body: "Tre numeri: flex-grow, flex-shrink, flex-basis. Vuol dire 'cresci e restringi liberamente, ma parti da una larghezza minima di 280px'. Comportamento responsive.",
        },
        {
            title: "gap: 16px",
            body: "Spazio tra i figli flex. Prima si usavano i margin (caotico). Adesso gap fa tutto, anche per CSS Grid.",
        },
        {
            title: "flex-wrap: wrap",
            body: "Se lo spazio non basta, le card vanno a capo invece di restringersi all'estremo. Senza, su schermi piccoli diventano un disastro.",
        },
    ],
    11: [
        {
            title: "translateY(-4px) = SU",
            body: "Y NEGATIVO sposta in ALTO. Y POSITIVO in BASSO. È convenzione matematica (Y cresce verso il basso negli schermi).",
        },
        {
            title: "transition leggera",
            body: "200ms è la durata 'naturale' per micro-interazioni: sentite ma non lente. Sotto 100ms sembra istantaneo. Sopra 400ms sembra goffo.",
        },
        {
            title: "ease-out per gli ingressi",
            body: "ease-out = parte veloce, finisce piano. Perfetto per cose che 'arrivano' (hover, fade-in). ease-in (lento all'inizio) si usa per cose che 'spariscono'.",
        },
        {
            title: "Solo transform e opacity",
            body: "Per animazioni fluide anima solo transform e opacity. Animare width, height, padding rallenta perché il browser ricalcola tutto il layout.",
        },
    ],
    12: [
        {
            title: "Sfondo scuro nel footer",
            body: "Il contrasto col resto del sito (chiaro) crea un sigillo visivo: 'qui finisce la pagina'. È una convenzione adottata da quasi tutti i siti.",
        },
        {
            title: "rgba per il bianco trasparente",
            body: "rgba(255,255,255,0.7) = bianco al 70% di opacità. Più leggibile del grigio per testo secondario su sfondo scuro.",
        },
        {
            title: "Selettore senza punto = tag",
            body: "footer (senza punto) sarebbe TUTTI i tag <footer>. .site-footer (col punto) prende solo quelli con etichetta site-footer. Avere etichette specifiche è meglio.",
        },
    ],

    // ───── MODULO 4 — Tocco finale
    13: [
        {
            title: "id vs class",
            body: "id (con cancelletto # nei link) è UNICO per pagina. class (col punto) si può ripetere su più elementi. Per i link interni si usa id.",
        },
        {
            title: "scroll-behavior: smooth",
            body: "Una sola riga di CSS per uno scroll fluido su tutta la pagina. Senza, i link interni saltano secco. Funziona su tutti i browser moderni.",
        },
        {
            title: "href=\"#nome-id\"",
            body: "Il cancelletto # nel link dice al browser: 'cerca un elemento con id uguale a questo nome nella stessa pagina e scrolla lì'.",
        },
    ],
    14: [
        {
            title: "@media è condizionale",
            body: "Le regole dentro @media (max-width: 640px) si applicano SOLO se la condizione è vera. È un grosso 'se' applicato al CSS.",
        },
        {
            title: "Breakpoint comuni",
            body: "480px = mobile piccolo, 640-768px = mobile-tablet, 1024px = desktop, 1280px = schermi grandi. Niente è scolpito nella pietra.",
        },
        {
            title: "Mobile-first vs desktop-first",
            body: "Hai usato 'desktop-first': scrivi le regole desktop, sovrascrivi con @media per mobile. Esiste anche l'inverso (mobile-first), più moderno ma più verboso.",
        },
    ],
    15: [
        {
            title: "@keyframes",
            body: "Definisce un'animazione: descrivi lo stato iniziale (from) e finale (to). Il browser interpola tutti i frame intermedi.",
        },
        {
            title: "animation: ... both",
            body: "'both' al fondo dell'animation dice 'mantieni lo stile iniziale prima dell'inizio E lo stile finale dopo'. Senza, l'elemento 'salta' agli estremi.",
        },
        {
            title: "Stagger con delay",
            body: "200ms, 400ms come secondo valore della animation = ritardo di partenza. Stagger = ogni elemento si anima un attimo dopo il precedente. Effetto 'cascata'.",
        },
        {
            title: "Niente animation pesanti",
            body: "Anima solo opacity e transform. Width, height, padding fanno ricalcolare il layout: lente, scattose. Regola d'oro che non cambia.",
        },
    ],
    16: [
        {
            title: "Hai imparato",
            body: "HTML semantico, CSS variabili, flexbox, gradient text, clamp, transition, hover, scroll-behavior, media query, keyframes. Tutto in 16 lezioni.",
        },
        {
            title: "Cambiare un colore",
            body: "Ti basta cambiare un valore esadecimale per cambiare il sentimento del sito. Rosa = giocoso, blu = corporate, verde = naturale, arancione = caldo.",
        },
        {
            title: "I colori esadecimali",
            body: "#RRGGBB = rosso, verde, blu (00-FF). #ec4899 è rosa shocking. #3b82f6 è blu vivido. #10b981 è verde menta. Decine di palette pronte su coolors.co.",
        },
    ],
};

export const getTipsForLesson = (order: number): Tip[] =>
    tipsByLessonOrder[order] ?? [];
