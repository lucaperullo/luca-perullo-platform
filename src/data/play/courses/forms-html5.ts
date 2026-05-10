/**
 * Corso "forms-html5": dal form HTML grezzo al modulo contatti
 * professionale, validato, multi-step, anti-spam, con UX di livello.
 *
 * Persona: Sara, proprietaria del ristorante "La Forchetta". Riceve
 * troppi spam dal vecchio form, troppe richieste senza data o telefono,
 * e i clienti veri si perdono nel rumore. Le serve un form che
 * converta — semplice da compilare, impossibile da abusare.
 *
 * Filosofia: ogni feature HTML5 (input types, validazione live,
 * pseudo-classi :valid/:invalid) si combina con un pizzico di JS per
 * produrre un'esperienza moderna senza framework.
 *
 * Sequenza:
 *   M1: Markup semantico (lezioni 1-2)
 *   M2: Validazione (lezioni 3-4)
 *   M3: Multi-step + anti-spam (lezioni 5-6)
 *   M4: Submit + UX states (lezioni 7-8)
 */
import type { Lesson, PlayCourse } from "@/data/play/types";

export const formsHtml5Course: PlayCourse = {
    slug: "forms-html5",
    title: "Forms HTML5 evoluti: il modulo contatti che converte",
    subtitle:
        "Input types nativi, validazione viva, multi-step, anti-spam, submit senza reload. Un form che gli utenti finiscono davvero.",
    description:
        "Un form di contatto è il punto in cui un visitatore diventa lead — o si arrende. In 8 lezioni costruirai il modulo contatti del ristorante \"La Forchetta\": input HTML5 (email, tel, date) con validazione nativa, feedback live in tempo reale, flusso multi-step con fieldset, honeypot anti-spam, submit con fetch senza reload, stati success/error accessibili. Alla fine avrai un form pubblicabile, accessibile, che blocca i bot e fa compilare anche i meno tecnologici.",
    level: "intermedio",
    subjects: ["html", "javascript"],
    durationMin: 80,
    status: "live",
    initialCode: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contattami</title>
    <style></style>
  </head>
  <body>
    <!-- il form contatti si costruisce qui -->
  </body>
</html>`,
    finalCode: "",
    modules: [
        {
            order: 1,
            slug: "markup-semantico",
            title: "Markup semantico",
            summary:
                "Skeleton del form, label vere (no placeholder come label!), input type HTML5 nativi.",
        },
        {
            order: 2,
            slug: "validazione",
            title: "Validazione client-side",
            summary:
                "Required, pattern regex, pseudo-classi :valid/:invalid per feedback live senza JS.",
        },
        {
            order: 3,
            slug: "multistep-antispam",
            title: "Multi-step + anti-spam",
            summary:
                "Form a 3 step con fieldset/legend, honeypot nascosto e timer minimo per bloccare i bot.",
        },
        {
            order: 4,
            slug: "submit-states",
            title: "Submit + stati UX",
            summary:
                "Fetch senza reload, success/error con aria-live e focus management per accessibilità.",
        },
    ],
    lessons: [],
};

const lessons: Lesson[] = [
    // ────────────── MODULO 1: MARKUP SEMANTICO ───────────────────────────
    {
        order: 1,
        slug: "form-skeleton",
        title: "Skeleton del form: <label> vere, niente placeholder finti",
        durationSec: 110,
        avatarMood: "talking",
        script:
            "Un form di contatto è il punto in cui un visitatore diventa lead — o se ne va. Sara del ristorante \"La Forchetta\" lo sa bene: ogni richiesta persa è una prenotazione che non arriva. Partiamo dal mattone fondamentale: il <form> con <label> vere e proprie associate ai loro input. Il placeholder NON è una label — quando l'utente inizia a scrivere sparisce e nessuno si ricorda più cosa stesse compilando. La label resta sempre visibile, ed è anche un click target per chi naviga da mobile.",
        instruction:
            "Dentro <body>, aggiungi: <form id=\"contact\"><h1>Scrivimi</h1><label for=\"name\">Nome</label><input id=\"name\" name=\"name\" type=\"text\" /><label for=\"message\">Messaggio</label><textarea id=\"message\" name=\"message\" rows=\"4\"></textarea><button type=\"submit\">Invia</button></form>",
        hint: "Form con id=\"contact\". Dentro: h1, poi per ogni campo una <label for=\"X\"> seguita dall'input/textarea con id=\"X\" corrispondente. In fondo un <button type=\"submit\">.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contattami</title>
    <style></style>
  </head>
  <body>
    <form id="contact">
      <h1>Scrivimi</h1>
      <label for="name">Nome</label>
      <input id="name" name="name" type="text" />
      <label for="message">Messaggio</label>
      <textarea id="message" name="message" rows="4"></textarea>
      <button type="submit">Invia</button>
    </form>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "form#contact label[for=\"name\"]",
                    existsOnly: true,
                    message:
                        "Manca <label for=\"name\"> dentro il form#contact.",
                },
                {
                    type: "querySelector",
                    selector: "form#contact input#name[name=\"name\"]",
                    existsOnly: true,
                    message:
                        "Manca <input id=\"name\" name=\"name\"> nel form.",
                },
                {
                    type: "querySelector",
                    selector: "form#contact textarea#message",
                    existsOnly: true,
                    message: "Manca <textarea id=\"message\"> nel form.",
                },
                {
                    type: "querySelector",
                    selector: "form#contact button[type=\"submit\"]",
                    existsOnly: true,
                    message: "Manca il <button type=\"submit\"> in fondo al form.",
                },
            ],
            message: "Form skeleton con label associate via for/id e button submit.",
        },
        successScript:
            "Click sulla label: il focus salta direttamente nell'input. È accessibilità gratis, dovuta solo all'accoppiata for/id. Lo screen reader la usa, chi naviga da tastiera la usa, e ti rende il form 2× più usabile sul telefono.",
        encourageScript:
            "Crea <form id=\"contact\">. Dentro: <h1>, poi <label for=\"name\">Nome</label> + <input id=\"name\" name=\"name\" type=\"text\" />. Stessa cosa per message (ma textarea). In fondo <button type=\"submit\">Invia</button>.",
    },

    {
        order: 2,
        slug: "input-types",
        title: "Input types HTML5: email, tel, url, date — validazione gratis",
        durationSec: 120,
        avatarMood: "talking",
        script:
            "Il browser nel 2026 sa già moltissime cose: sa cos'è un'email, un numero di telefono, una data. Basta dirglielo con type=\"email\" o type=\"tel\". In cambio ottieni la tastiera giusta sul telefono (numerica per tel, con la @ visibile per email), validazione del formato gratis, e per date addirittura un date picker nativo. Sara ha bisogno di sapere chi prenota, quando e a che numero richiamare. Aggiungiamo email, telefono e data prenotazione.",
        instruction:
            "Tra il campo Nome e il campo Messaggio, aggiungi: <label for=\"email\">Email</label><input id=\"email\" name=\"email\" type=\"email\" /><label for=\"phone\">Telefono</label><input id=\"phone\" name=\"phone\" type=\"tel\" /><label for=\"date\">Data prenotazione</label><input id=\"date\" name=\"date\" type=\"date\" />",
        hint: "Tre coppie label+input nuove tra Nome e Messaggio: email (type=\"email\"), phone (type=\"tel\"), date (type=\"date\"). Sempre con for/id matching.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contattami</title>
    <style></style>
  </head>
  <body>
    <form id="contact">
      <h1>Scrivimi</h1>
      <label for="name">Nome</label>
      <input id="name" name="name" type="text" />
      <label for="email">Email</label>
      <input id="email" name="email" type="email" />
      <label for="phone">Telefono</label>
      <input id="phone" name="phone" type="tel" />
      <label for="date">Data prenotazione</label>
      <input id="date" name="date" type="date" />
      <label for="message">Messaggio</label>
      <textarea id="message" name="message" rows="4"></textarea>
      <button type="submit">Invia</button>
    </form>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "input#email[type=\"email\"]",
                    existsOnly: true,
                    message: "Manca <input id=\"email\" type=\"email\">.",
                },
                {
                    type: "querySelector",
                    selector: "input#phone[type=\"tel\"]",
                    existsOnly: true,
                    message: "Manca <input id=\"phone\" type=\"tel\">.",
                },
                {
                    type: "querySelector",
                    selector: "input#date[type=\"date\"]",
                    existsOnly: true,
                    message: "Manca <input id=\"date\" type=\"date\">.",
                },
            ],
            message:
                "Tre nuovi input HTML5 con type semantico: email, tel, date.",
        },
        successScript:
            "Apri questa pagina dal telefono: prova a entrare in Telefono, esce la tastiera numerica. In Email, esce la @ in evidenza. In Data, esce il date picker. Tu hai scritto solo l'attributo type — il browser ha fatto tutto il resto.",
        encourageScript:
            "Tra Nome e Messaggio, aggiungi 3 coppie label+input: email/type=email, phone/type=tel, date/type=date. Mantieni for/id sempre uguali.",
    },

    // ────────────── MODULO 2: VALIDAZIONE ────────────────────────────────
    {
        order: 3,
        slug: "required-pattern",
        title: "Required + pattern regex: blocca le richieste vuote",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Sara riceve troppi messaggi senza nome, o con un \"telefono\" che è in realtà la parola \"prova\". Risolviamo. L'attributo required dice al browser \"questo campo non può essere vuoto\". L'attributo pattern accetta una regex e blocca tutto ciò che non corrisponde — utile per il telefono italiano. Aggiungiamo anche minlength sul messaggio per evitare richieste tipo \"ciao\". Tutto questo viene applicato dal browser PRIMA che il form parta — niente JS, niente reload, blocco istantaneo.",
        instruction:
            "Aggiungi attributi: a #name aggiungi required minlength=\"2\". A #email aggiungi required. A #phone aggiungi pattern=\"[0-9 +]{8,15}\" required. A #date aggiungi required. A #message aggiungi required minlength=\"10\".",
        hint: "Su ogni input aggiungi `required` (e dove serve, anche minlength=\"...\" o pattern=\"...\"). Sul phone, pattern=\"[0-9 +]{8,15}\" accetta solo cifre, spazi e + da 8 a 15 caratteri.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contattami</title>
    <style></style>
  </head>
  <body>
    <form id="contact">
      <h1>Scrivimi</h1>
      <label for="name">Nome</label>
      <input id="name" name="name" type="text" required minlength="2" />
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />
      <label for="phone">Telefono</label>
      <input id="phone" name="phone" type="tel" pattern="[0-9 +]{8,15}" required />
      <label for="date">Data prenotazione</label>
      <input id="date" name="date" type="date" required />
      <label for="message">Messaggio</label>
      <textarea id="message" name="message" rows="4" required minlength="10"></textarea>
      <button type="submit">Invia</button>
    </form>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "input#name[required][minlength=\"2\"]",
                    existsOnly: true,
                    message:
                        "Su #name aggiungi required e minlength=\"2\".",
                },
                {
                    type: "querySelector",
                    selector: "input#phone[required][pattern]",
                    existsOnly: true,
                    message:
                        "Su #phone aggiungi required e pattern=\"[0-9 +]{8,15}\".",
                },
                {
                    type: "querySelector",
                    selector: "textarea#message[required][minlength=\"10\"]",
                    existsOnly: true,
                    message:
                        "Su #message aggiungi required e minlength=\"10\".",
                },
            ],
            message:
                "Required + pattern + minlength sui campi obbligatori del form.",
        },
        successScript:
            "Prova a cliccare Invia con il form vuoto: il browser blocca, ti porta sul primo campo invalido e mostra il messaggio nativo. Zero JavaScript, validazione che funziona già su tutti i browser dal 2010.",
        encourageScript:
            "Su #name: required minlength=\"2\". Su #email: required. Su #phone: pattern=\"[0-9 +]{8,15}\" required. Su #date: required. Su #message: required minlength=\"10\".",
    },

    {
        order: 4,
        slug: "valid-invalid-styles",
        title: "Feedback live con :valid e :invalid",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Hai mai compilato un form, premuto invio, e poi... niente, solo errori in rosso che non avevi visto? L'utente moderno vuole feedback istantaneo: mentre scrive, il bordo dell'input deve dirgli se sta facendo bene o male. CSS lo fa nativamente con :valid e :invalid. Aggiungiamo anche il selettore :placeholder-shown per non mostrare l'errore prima ancora che l'utente abbia toccato il campo — solo dopo che ha scritto qualcosa.",
        instruction:
            "Dentro <style></style> nel <head>, scrivi: form{max-width:480px;margin:2rem auto;font-family:system-ui,sans-serif;display:flex;flex-direction:column;gap:.75rem}label{font-weight:600;font-size:.9rem}input,textarea{padding:.6rem .75rem;border:2px solid #d1d5db;border-radius:.5rem;font:inherit;transition:border-color .2s}input:focus,textarea:focus{outline:none;border-color:#6366f1}input:not(:placeholder-shown):invalid,textarea:not(:placeholder-shown):invalid{border-color:#ef4444}input:not(:placeholder-shown):valid,textarea:not(:placeholder-shown):valid{border-color:#10b981}button{padding:.75rem;background:#6366f1;color:white;border:none;border-radius:.5rem;font-weight:600;cursor:pointer}",
        hint: "Tutto dentro <style></style>. Le regole chiave: input:not(:placeholder-shown):invalid → bordo rosso, input:not(:placeholder-shown):valid → bordo verde. Aggiungi anche placeholder=\" \" (spazio) sugli input perché :placeholder-shown funzioni.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contattami</title>
    <style>form{max-width:480px;margin:2rem auto;font-family:system-ui,sans-serif;display:flex;flex-direction:column;gap:.75rem}label{font-weight:600;font-size:.9rem}input,textarea{padding:.6rem .75rem;border:2px solid #d1d5db;border-radius:.5rem;font:inherit;transition:border-color .2s}input:focus,textarea:focus{outline:none;border-color:#6366f1}input:not(:placeholder-shown):invalid,textarea:not(:placeholder-shown):invalid{border-color:#ef4444}input:not(:placeholder-shown):valid,textarea:not(:placeholder-shown):valid{border-color:#10b981}button{padding:.75rem;background:#6366f1;color:white;border:none;border-radius:.5rem;font-weight:600;cursor:pointer}</style>
  </head>
  <body>
    <form id="contact">
      <h1>Scrivimi</h1>
      <label for="name">Nome</label>
      <input id="name" name="name" type="text" placeholder=" " required minlength="2" />
      <label for="email">Email</label>
      <input id="email" name="email" type="email" placeholder=" " required />
      <label for="phone">Telefono</label>
      <input id="phone" name="phone" type="tel" placeholder=" " pattern="[0-9 +]{8,15}" required />
      <label for="date">Data prenotazione</label>
      <input id="date" name="date" type="date" required />
      <label for="message">Messaggio</label>
      <textarea id="message" name="message" rows="4" placeholder=" " required minlength="10"></textarea>
      <button type="submit">Invia</button>
    </form>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: ":placeholder-shown):invalid",
                    flexible: true,
                    message:
                        "Manca la regola CSS input:not(:placeholder-shown):invalid per il bordo rosso live.",
                },
                {
                    type: "textIncludes",
                    needle: ":placeholder-shown):valid",
                    flexible: true,
                    message:
                        "Manca la regola CSS input:not(:placeholder-shown):valid per il bordo verde live.",
                },
                {
                    type: "querySelector",
                    selector: "input#email[placeholder]",
                    existsOnly: true,
                    message:
                        "Aggiungi placeholder=\" \" (uno spazio) sugli input perché :placeholder-shown funzioni.",
                },
            ],
            message:
                "CSS con :valid/:invalid + placeholder=\" \" sugli input per feedback live.",
        },
        successScript:
            "Inizia a scrivere nell'email: appena diventa valida, il bordo passa a verde. Cancella e diventa rosso. Tutto questo senza una singola riga di JavaScript — solo CSS e l'HTML5 che il browser conosce già.",
        encourageScript:
            "Scrivi le regole CSS dentro <style>. Le 2 chiave sono input:not(:placeholder-shown):invalid (rosso) e :valid (verde). Aggiungi placeholder=\" \" su #name, #email, #phone, #message.",
    },

    // ────────────── MODULO 3: MULTI-STEP + ANTI-SPAM ─────────────────────
    {
        order: 5,
        slug: "multi-step",
        title: "Multi-step: form a 3 step con fieldset",
        durationSec: 140,
        avatarMood: "talking",
        script:
            "Sette campi tutti insieme spaventano. La psicologia dei form lo dice da anni: 3 step da 2-3 campi convertono molto più di un form unico. Usiamo <fieldset> con <legend> per raggruppare semanticamente — accessibile per gli screen reader — e una piccola classe CSS per mostrarne uno alla volta. Aggiungiamo i bottoni Avanti/Indietro per la navigazione. La struttura è solo HTML; un pizzico di JS in fondo gestisce il cambio step.",
        instruction:
            "Sostituisci il contenuto interno del <form> (tra <form id=\"contact\"> e </form>) con questa struttura a 3 fieldset: <h1>Scrivimi</h1><fieldset class=\"step active\"><legend>Chi sei</legend><label for=\"name\">Nome</label><input id=\"name\" name=\"name\" type=\"text\" placeholder=\" \" required minlength=\"2\" /><label for=\"email\">Email</label><input id=\"email\" name=\"email\" type=\"email\" placeholder=\" \" required /></fieldset><fieldset class=\"step\"><legend>Quando ti richiamo</legend><label for=\"phone\">Telefono</label><input id=\"phone\" name=\"phone\" type=\"tel\" placeholder=\" \" pattern=\"[0-9 +]{8,15}\" required /><label for=\"date\">Data prenotazione</label><input id=\"date\" name=\"date\" type=\"date\" required /></fieldset><fieldset class=\"step\"><legend>Cosa ti serve</legend><label for=\"message\">Messaggio</label><textarea id=\"message\" name=\"message\" rows=\"4\" placeholder=\" \" required minlength=\"10\"></textarea></fieldset><div class=\"nav\"><button type=\"button\" id=\"prev\">Indietro</button><button type=\"button\" id=\"next\">Avanti</button><button type=\"submit\" id=\"submit\" hidden>Invia</button></div>. Nello <style>, aggiungi alla fine: fieldset{border:none;padding:0;margin:0;display:none}fieldset.active{display:flex;flex-direction:column;gap:.75rem}legend{font-size:1.1rem;font-weight:700;margin-bottom:.5rem}.nav{display:flex;gap:.5rem;justify-content:space-between}. Prima della </body>, aggiungi: <script>const steps=document.querySelectorAll(\".step\");let i=0;const prev=document.getElementById(\"prev\");const next=document.getElementById(\"next\");const submit=document.getElementById(\"submit\");function render(){steps.forEach((s,k)=>s.classList.toggle(\"active\",k===i));prev.hidden=i===0;next.hidden=i===steps.length-1;submit.hidden=i!==steps.length-1}prev.addEventListener(\"click\",()=>{i--;render()});next.addEventListener(\"click\",()=>{i++;render()});render();</script>",
        hint: "3 <fieldset class=\"step\"> dentro il form (il primo con anche \"active\"), ognuno con <legend>. CSS: fieldset{display:none}, fieldset.active{display:flex…}. JS: querySelectorAll(\".step\"), un indice i, bottoni prev/next che fanno render().",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contattami</title>
    <style>form{max-width:480px;margin:2rem auto;font-family:system-ui,sans-serif;display:flex;flex-direction:column;gap:.75rem}label{font-weight:600;font-size:.9rem}input,textarea{padding:.6rem .75rem;border:2px solid #d1d5db;border-radius:.5rem;font:inherit;transition:border-color .2s}input:focus,textarea:focus{outline:none;border-color:#6366f1}input:not(:placeholder-shown):invalid,textarea:not(:placeholder-shown):invalid{border-color:#ef4444}input:not(:placeholder-shown):valid,textarea:not(:placeholder-shown):valid{border-color:#10b981}button{padding:.75rem;background:#6366f1;color:white;border:none;border-radius:.5rem;font-weight:600;cursor:pointer}fieldset{border:none;padding:0;margin:0;display:none}fieldset.active{display:flex;flex-direction:column;gap:.75rem}legend{font-size:1.1rem;font-weight:700;margin-bottom:.5rem}.nav{display:flex;gap:.5rem;justify-content:space-between}</style>
  </head>
  <body>
    <form id="contact">
      <h1>Scrivimi</h1>
      <fieldset class="step active">
        <legend>Chi sei</legend>
        <label for="name">Nome</label>
        <input id="name" name="name" type="text" placeholder=" " required minlength="2" />
        <label for="email">Email</label>
        <input id="email" name="email" type="email" placeholder=" " required />
      </fieldset>
      <fieldset class="step">
        <legend>Quando ti richiamo</legend>
        <label for="phone">Telefono</label>
        <input id="phone" name="phone" type="tel" placeholder=" " pattern="[0-9 +]{8,15}" required />
        <label for="date">Data prenotazione</label>
        <input id="date" name="date" type="date" required />
      </fieldset>
      <fieldset class="step">
        <legend>Cosa ti serve</legend>
        <label for="message">Messaggio</label>
        <textarea id="message" name="message" rows="4" placeholder=" " required minlength="10"></textarea>
      </fieldset>
      <div class="nav">
        <button type="button" id="prev">Indietro</button>
        <button type="button" id="next">Avanti</button>
        <button type="submit" id="submit" hidden>Invia</button>
      </div>
    </form>
    <script>const steps=document.querySelectorAll(".step");let i=0;const prev=document.getElementById("prev");const next=document.getElementById("next");const submit=document.getElementById("submit");function render(){steps.forEach((s,k)=>s.classList.toggle("active",k===i));prev.hidden=i===0;next.hidden=i===steps.length-1;submit.hidden=i!==steps.length-1}prev.addEventListener("click",()=>{i--;render()});next.addEventListener("click",()=>{i++;render()});render();</script>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "form#contact fieldset.step.active legend",
                    existsOnly: true,
                    message:
                        "Manca <fieldset class=\"step active\"> con <legend> dentro il form.",
                },
                {
                    type: "querySelector",
                    selector: "form#contact fieldset:nth-of-type(3)",
                    existsOnly: true,
                    message:
                        "Servono 3 <fieldset class=\"step\"> nel form (uno per step).",
                },
                {
                    type: "querySelector",
                    selector: "button#next",
                    existsOnly: true,
                    message: "Manca <button id=\"next\">Avanti</button>.",
                },
                {
                    type: "textIncludes",
                    needle: "querySelectorAll",
                    flexible: true,
                    message:
                        "Manca lo <script> con querySelectorAll che gestisce il cambio step.",
                },
            ],
            message:
                "Multi-step: 3 fieldset con legend, bottoni prev/next, JS che li alterna.",
        },
        successScript:
            "Premi Avanti: il fieldset attuale sparisce, il successivo appare. Allo step finale spunta Invia. È esattamente il pattern di Typeform e Calendly — meno carico cognitivo, più completamenti.",
        encourageScript:
            "3 <fieldset class=\"step\"> (il primo anche con \"active\"), ognuno con <legend>. CSS che nasconde i fieldset normali e mostra quelli .active. JS con un indice i e i bottoni prev/next che chiamano render().",
    },

    {
        order: 6,
        slug: "honeypot-timer",
        title: "Anti-spam: honeypot field + timer minimo",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "I bot sono il 90% del traffico sui form pubblici. Due trucchi semplici li annientano senza disturbare gli umani. Primo, l'honeypot: un campo nascosto che gli umani non vedono ma i bot, che leggono l'HTML grezzo, riempiono sempre. Se è compilato → è un bot. Secondo, il timer: nessun umano compila un form di 5 campi in meno di 3 secondi, i bot sì. Misuriamo il tempo dall'apertura della pagina e blocchiamo se è troppo veloce.",
        instruction:
            "Dentro il <form>, subito dopo <h1>Scrivimi</h1>, aggiungi l'honeypot: <div style=\"position:absolute;left:-9999px\" aria-hidden=\"true\"><label for=\"website\">Sito (lascia vuoto)</label><input id=\"website\" name=\"website\" type=\"text\" tabindex=\"-1\" autocomplete=\"off\" /></div>. Poi nello <script>, sostituisci tutto con: const steps=document.querySelectorAll(\".step\");let i=0;const prev=document.getElementById(\"prev\");const next=document.getElementById(\"next\");const submit=document.getElementById(\"submit\");const startedAt=Date.now();function render(){steps.forEach((s,k)=>s.classList.toggle(\"active\",k===i));prev.hidden=i===0;next.hidden=i===steps.length-1;submit.hidden=i!==steps.length-1}function isSpam(){const honey=document.getElementById(\"website\").value;const elapsed=Date.now()-startedAt;return honey!==\"\"||elapsed<3000}prev.addEventListener(\"click\",()=>{i--;render()});next.addEventListener(\"click\",()=>{i++;render()});document.getElementById(\"contact\").addEventListener(\"submit\",e=>{if(isSpam()){e.preventDefault();console.warn(\"Spam bloccato\")}});render();",
        hint: "Honeypot: <div> con position:absolute left:-9999px (e aria-hidden=\"true\"), dentro un input con tabindex=\"-1\" e autocomplete=\"off\". Nel JS: salva startedAt al load, definisci isSpam() che controlla l'honeypot E il tempo elapsed < 3000ms, e blocca il submit se è spam.",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contattami</title>
    <style>form{max-width:480px;margin:2rem auto;font-family:system-ui,sans-serif;display:flex;flex-direction:column;gap:.75rem}label{font-weight:600;font-size:.9rem}input,textarea{padding:.6rem .75rem;border:2px solid #d1d5db;border-radius:.5rem;font:inherit;transition:border-color .2s}input:focus,textarea:focus{outline:none;border-color:#6366f1}input:not(:placeholder-shown):invalid,textarea:not(:placeholder-shown):invalid{border-color:#ef4444}input:not(:placeholder-shown):valid,textarea:not(:placeholder-shown):valid{border-color:#10b981}button{padding:.75rem;background:#6366f1;color:white;border:none;border-radius:.5rem;font-weight:600;cursor:pointer}fieldset{border:none;padding:0;margin:0;display:none}fieldset.active{display:flex;flex-direction:column;gap:.75rem}legend{font-size:1.1rem;font-weight:700;margin-bottom:.5rem}.nav{display:flex;gap:.5rem;justify-content:space-between}</style>
  </head>
  <body>
    <form id="contact">
      <h1>Scrivimi</h1>
      <div style="position:absolute;left:-9999px" aria-hidden="true">
        <label for="website">Sito (lascia vuoto)</label>
        <input id="website" name="website" type="text" tabindex="-1" autocomplete="off" />
      </div>
      <fieldset class="step active">
        <legend>Chi sei</legend>
        <label for="name">Nome</label>
        <input id="name" name="name" type="text" placeholder=" " required minlength="2" />
        <label for="email">Email</label>
        <input id="email" name="email" type="email" placeholder=" " required />
      </fieldset>
      <fieldset class="step">
        <legend>Quando ti richiamo</legend>
        <label for="phone">Telefono</label>
        <input id="phone" name="phone" type="tel" placeholder=" " pattern="[0-9 +]{8,15}" required />
        <label for="date">Data prenotazione</label>
        <input id="date" name="date" type="date" required />
      </fieldset>
      <fieldset class="step">
        <legend>Cosa ti serve</legend>
        <label for="message">Messaggio</label>
        <textarea id="message" name="message" rows="4" placeholder=" " required minlength="10"></textarea>
      </fieldset>
      <div class="nav">
        <button type="button" id="prev">Indietro</button>
        <button type="button" id="next">Avanti</button>
        <button type="submit" id="submit" hidden>Invia</button>
      </div>
    </form>
    <script>const steps=document.querySelectorAll(".step");let i=0;const prev=document.getElementById("prev");const next=document.getElementById("next");const submit=document.getElementById("submit");const startedAt=Date.now();function render(){steps.forEach((s,k)=>s.classList.toggle("active",k===i));prev.hidden=i===0;next.hidden=i===steps.length-1;submit.hidden=i!==steps.length-1}function isSpam(){const honey=document.getElementById("website").value;const elapsed=Date.now()-startedAt;return honey!==""||elapsed<3000}prev.addEventListener("click",()=>{i--;render()});next.addEventListener("click",()=>{i++;render()});document.getElementById("contact").addEventListener("submit",e=>{if(isSpam()){e.preventDefault();console.warn("Spam bloccato")}});render();</script>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "input#website[tabindex=\"-1\"]",
                    existsOnly: true,
                    message:
                        "Manca l'honeypot <input id=\"website\" tabindex=\"-1\">.",
                },
                {
                    type: "querySelector",
                    selector: "div[aria-hidden=\"true\"] input#website",
                    existsOnly: true,
                    message:
                        "L'honeypot deve essere dentro un <div aria-hidden=\"true\"> nascosto via position:absolute.",
                },
                {
                    type: "textIncludes",
                    needle: "isSpam",
                    flexible: true,
                    message:
                        "Manca la funzione isSpam() nello <script>.",
                },
                {
                    type: "textIncludes",
                    needle: "startedAt",
                    flexible: true,
                    message:
                        "Manca la variabile startedAt per il timer minimo.",
                },
            ],
            message:
                "Honeypot input + timer minimo nello script per bloccare i bot.",
        },
        successScript:
            "Apri la console: prova a sottomettere il form in meno di 3 secondi e vedi \"Spam bloccato\". Lo stesso succede se un bot riempie il campo website nascosto. Due tecniche silenziose, zero captcha, zero attrito per gli umani.",
        encourageScript:
            "1) Dentro il form aggiungi un div con position:absolute left:-9999px aria-hidden=\"true\" che contiene <input id=\"website\" tabindex=\"-1\">. 2) Nel JS sostituisci lo script aggiungendo startedAt=Date.now(), funzione isSpam(), e listener submit che fa preventDefault se isSpam().",
    },

    // ────────────── MODULO 4: SUBMIT + STATI ─────────────────────────────
    {
        order: 7,
        slug: "submit-fetch",
        title: "Submit con fetch: niente più reload della pagina",
        durationSec: 130,
        avatarMood: "talking",
        script:
            "Il submit tradizionale ricarica la pagina e l'utente perde il contesto. Sostituiamolo con fetch: intercetta il submit, raccoglie i dati con FormData, li manda all'endpoint, e lascia la pagina dov'è. Per la demo usiamo httpbin.org/post — risponde sempre con 200 e ti restituisce ciò che gli mandi. In produzione Sara metterà il suo endpoint reale (es. una funzione Supabase o un webhook).",
        instruction:
            "Nello <script>, sostituisci il listener submit (`document.getElementById(\"contact\").addEventListener(\"submit\",...)`) con questo: document.getElementById(\"contact\").addEventListener(\"submit\",async e=>{e.preventDefault();if(isSpam()){console.warn(\"Spam bloccato\");return}const data=new FormData(e.target);submit.disabled=true;submit.textContent=\"Invio...\";try{const r=await fetch(\"https://httpbin.org/post\",{method:\"POST\",body:data});if(!r.ok)throw new Error(\"Errore \"+r.status);console.log(\"Inviato!\")}catch(err){console.error(err)}finally{submit.disabled=false;submit.textContent=\"Invia\"}});",
        hint: "Listener submit async: e.preventDefault(), check isSpam(), poi new FormData(e.target), fetch con method POST e body data, gestione errori try/catch/finally. Disabilita il bottone durante l'invio e mostra \"Invio...\".",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contattami</title>
    <style>form{max-width:480px;margin:2rem auto;font-family:system-ui,sans-serif;display:flex;flex-direction:column;gap:.75rem}label{font-weight:600;font-size:.9rem}input,textarea{padding:.6rem .75rem;border:2px solid #d1d5db;border-radius:.5rem;font:inherit;transition:border-color .2s}input:focus,textarea:focus{outline:none;border-color:#6366f1}input:not(:placeholder-shown):invalid,textarea:not(:placeholder-shown):invalid{border-color:#ef4444}input:not(:placeholder-shown):valid,textarea:not(:placeholder-shown):valid{border-color:#10b981}button{padding:.75rem;background:#6366f1;color:white;border:none;border-radius:.5rem;font-weight:600;cursor:pointer}fieldset{border:none;padding:0;margin:0;display:none}fieldset.active{display:flex;flex-direction:column;gap:.75rem}legend{font-size:1.1rem;font-weight:700;margin-bottom:.5rem}.nav{display:flex;gap:.5rem;justify-content:space-between}</style>
  </head>
  <body>
    <form id="contact">
      <h1>Scrivimi</h1>
      <div style="position:absolute;left:-9999px" aria-hidden="true">
        <label for="website">Sito (lascia vuoto)</label>
        <input id="website" name="website" type="text" tabindex="-1" autocomplete="off" />
      </div>
      <fieldset class="step active">
        <legend>Chi sei</legend>
        <label for="name">Nome</label>
        <input id="name" name="name" type="text" placeholder=" " required minlength="2" />
        <label for="email">Email</label>
        <input id="email" name="email" type="email" placeholder=" " required />
      </fieldset>
      <fieldset class="step">
        <legend>Quando ti richiamo</legend>
        <label for="phone">Telefono</label>
        <input id="phone" name="phone" type="tel" placeholder=" " pattern="[0-9 +]{8,15}" required />
        <label for="date">Data prenotazione</label>
        <input id="date" name="date" type="date" required />
      </fieldset>
      <fieldset class="step">
        <legend>Cosa ti serve</legend>
        <label for="message">Messaggio</label>
        <textarea id="message" name="message" rows="4" placeholder=" " required minlength="10"></textarea>
      </fieldset>
      <div class="nav">
        <button type="button" id="prev">Indietro</button>
        <button type="button" id="next">Avanti</button>
        <button type="submit" id="submit" hidden>Invia</button>
      </div>
    </form>
    <script>const steps=document.querySelectorAll(".step");let i=0;const prev=document.getElementById("prev");const next=document.getElementById("next");const submit=document.getElementById("submit");const startedAt=Date.now();function render(){steps.forEach((s,k)=>s.classList.toggle("active",k===i));prev.hidden=i===0;next.hidden=i===steps.length-1;submit.hidden=i!==steps.length-1}function isSpam(){const honey=document.getElementById("website").value;const elapsed=Date.now()-startedAt;return honey!==""||elapsed<3000}prev.addEventListener("click",()=>{i--;render()});next.addEventListener("click",()=>{i++;render()});document.getElementById("contact").addEventListener("submit",async e=>{e.preventDefault();if(isSpam()){console.warn("Spam bloccato");return}const data=new FormData(e.target);submit.disabled=true;submit.textContent="Invio...";try{const r=await fetch("https://httpbin.org/post",{method:"POST",body:data});if(!r.ok)throw new Error("Errore "+r.status);console.log("Inviato!")}catch(err){console.error(err)}finally{submit.disabled=false;submit.textContent="Invia"}});render();</script>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "textIncludes",
                    needle: "e.preventDefault()",
                    flexible: true,
                    message:
                        "Il listener submit deve chiamare e.preventDefault() per evitare il reload.",
                },
                {
                    type: "textIncludes",
                    needle: "new FormData",
                    flexible: true,
                    message:
                        "Devi raccogliere i dati con `new FormData(e.target)`.",
                },
                {
                    type: "textIncludes",
                    needle: "fetch(",
                    flexible: true,
                    message:
                        "Manca la chiamata fetch() per inviare i dati all'endpoint.",
                },
            ],
            message:
                "Submit asincrono con preventDefault, FormData e fetch.",
        },
        successScript:
            "Compila e premi Invia: la pagina non si ricarica, il bottone diventa \"Invio...\", e in console vedi \"Inviato!\". Nessun reload, nessuno scroll perso. Il pattern moderno di ogni form serio.",
        encourageScript:
            "Sostituisci il listener submit con uno async che fa: e.preventDefault(), check isSpam(), new FormData(e.target), submit.disabled=true, await fetch(\"https://httpbin.org/post\",{method:\"POST\",body:data}), riabilita il bottone in finally.",
    },

    {
        order: 8,
        slug: "states-a11y",
        title: "Stati success/error + accessibilità con aria-live",
        durationSec: 150,
        avatarMood: "happy",
        script:
            "Ultima lezione, mossa che fa la differenza tra un form da hobbista e uno professionale. L'utente ha premuto Invia: deve sapere SUBITO se è andata bene o male. Aggiungiamo un <div role=\"status\" aria-live=\"polite\"> che gli screen reader leggono automaticamente quando cambia. Spostiamo il focus lì dopo il submit per chi naviga da tastiera. Mostriamo success in verde, error in rosso. È quel dettaglio invisibile che rende un sito davvero usabile da tutti.",
        instruction:
            "Subito dopo </form>, aggiungi: <div id=\"status\" role=\"status\" aria-live=\"polite\" tabindex=\"-1\"></div>. Nello <style> aggiungi alla fine: #status{max-width:480px;margin:1rem auto;padding:1rem;border-radius:.5rem;font-weight:600;text-align:center}#status.success{background:#d1fae5;color:#065f46}#status.error{background:#fee2e2;color:#991b1b}#status:empty{display:none}. Nello <script>, modifica il listener submit per aggiornare lo status: trova il blocco try/catch/finally e sostituiscilo con: const status=document.getElementById(\"status\");try{const r=await fetch(\"https://httpbin.org/post\",{method:\"POST\",body:data});if(!r.ok)throw new Error(\"Errore \"+r.status);status.className=\"success\";status.textContent=\"Grazie! Ti richiamo entro 24 ore.\";status.focus();e.target.reset();i=0;render()}catch(err){status.className=\"error\";status.textContent=\"Qualcosa è andato storto. Riprova o scrivimi a info@laforchetta.it\";status.focus()}finally{submit.disabled=false;submit.textContent=\"Invia\"}",
        hint: "1) <div id=\"status\" role=\"status\" aria-live=\"polite\" tabindex=\"-1\"> dopo il form. 2) CSS per .success (verde) e .error (rosso). 3) Nel try imposta className=\"success\" + textContent + status.focus() + reset form. Nel catch className=\"error\" + textContent + status.focus().",
        expectedSnapshot: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contattami</title>
    <style>form{max-width:480px;margin:2rem auto;font-family:system-ui,sans-serif;display:flex;flex-direction:column;gap:.75rem}label{font-weight:600;font-size:.9rem}input,textarea{padding:.6rem .75rem;border:2px solid #d1d5db;border-radius:.5rem;font:inherit;transition:border-color .2s}input:focus,textarea:focus{outline:none;border-color:#6366f1}input:not(:placeholder-shown):invalid,textarea:not(:placeholder-shown):invalid{border-color:#ef4444}input:not(:placeholder-shown):valid,textarea:not(:placeholder-shown):valid{border-color:#10b981}button{padding:.75rem;background:#6366f1;color:white;border:none;border-radius:.5rem;font-weight:600;cursor:pointer}fieldset{border:none;padding:0;margin:0;display:none}fieldset.active{display:flex;flex-direction:column;gap:.75rem}legend{font-size:1.1rem;font-weight:700;margin-bottom:.5rem}.nav{display:flex;gap:.5rem;justify-content:space-between}#status{max-width:480px;margin:1rem auto;padding:1rem;border-radius:.5rem;font-weight:600;text-align:center}#status.success{background:#d1fae5;color:#065f46}#status.error{background:#fee2e2;color:#991b1b}#status:empty{display:none}</style>
  </head>
  <body>
    <form id="contact">
      <h1>Scrivimi</h1>
      <div style="position:absolute;left:-9999px" aria-hidden="true">
        <label for="website">Sito (lascia vuoto)</label>
        <input id="website" name="website" type="text" tabindex="-1" autocomplete="off" />
      </div>
      <fieldset class="step active">
        <legend>Chi sei</legend>
        <label for="name">Nome</label>
        <input id="name" name="name" type="text" placeholder=" " required minlength="2" />
        <label for="email">Email</label>
        <input id="email" name="email" type="email" placeholder=" " required />
      </fieldset>
      <fieldset class="step">
        <legend>Quando ti richiamo</legend>
        <label for="phone">Telefono</label>
        <input id="phone" name="phone" type="tel" placeholder=" " pattern="[0-9 +]{8,15}" required />
        <label for="date">Data prenotazione</label>
        <input id="date" name="date" type="date" required />
      </fieldset>
      <fieldset class="step">
        <legend>Cosa ti serve</legend>
        <label for="message">Messaggio</label>
        <textarea id="message" name="message" rows="4" placeholder=" " required minlength="10"></textarea>
      </fieldset>
      <div class="nav">
        <button type="button" id="prev">Indietro</button>
        <button type="button" id="next">Avanti</button>
        <button type="submit" id="submit" hidden>Invia</button>
      </div>
    </form>
    <div id="status" role="status" aria-live="polite" tabindex="-1"></div>
    <script>const steps=document.querySelectorAll(".step");let i=0;const prev=document.getElementById("prev");const next=document.getElementById("next");const submit=document.getElementById("submit");const startedAt=Date.now();function render(){steps.forEach((s,k)=>s.classList.toggle("active",k===i));prev.hidden=i===0;next.hidden=i===steps.length-1;submit.hidden=i!==steps.length-1}function isSpam(){const honey=document.getElementById("website").value;const elapsed=Date.now()-startedAt;return honey!==""||elapsed<3000}prev.addEventListener("click",()=>{i--;render()});next.addEventListener("click",()=>{i++;render()});document.getElementById("contact").addEventListener("submit",async e=>{e.preventDefault();if(isSpam()){console.warn("Spam bloccato");return}const data=new FormData(e.target);submit.disabled=true;submit.textContent="Invio...";const status=document.getElementById("status");try{const r=await fetch("https://httpbin.org/post",{method:"POST",body:data});if(!r.ok)throw new Error("Errore "+r.status);status.className="success";status.textContent="Grazie! Ti richiamo entro 24 ore.";status.focus();e.target.reset();i=0;render()}catch(err){status.className="error";status.textContent="Qualcosa è andato storto. Riprova o scrivimi a info@laforchetta.it";status.focus()}finally{submit.disabled=false;submit.textContent="Invia"}});render();</script>
  </body>
</html>`,
        validate: {
            type: "all",
            rules: [
                {
                    type: "querySelector",
                    selector: "div#status[role=\"status\"][aria-live=\"polite\"]",
                    existsOnly: true,
                    message:
                        "Manca <div id=\"status\" role=\"status\" aria-live=\"polite\" tabindex=\"-1\"> dopo il form.",
                },
                {
                    type: "textIncludes",
                    needle: "status.focus()",
                    flexible: true,
                    message:
                        "Devi chiamare status.focus() per spostare il focus sull'esito (accessibilità tastiera).",
                },
                {
                    type: "textIncludes",
                    needle: "status.className=\"success\"",
                    flexible: true,
                    message:
                        "In caso di successo, imposta status.className=\"success\" con un messaggio.",
                },
                {
                    type: "textIncludes",
                    needle: "status.className=\"error\"",
                    flexible: true,
                    message:
                        "In caso di errore, imposta status.className=\"error\" con un messaggio.",
                },
            ],
            message:
                "Stati success/error con aria-live, focus management e reset del form al successo.",
        },
        successScript:
            "FINITO! Hai un form di contatto pubblicabile: input HTML5 con tastiera giusta, validazione live in CSS, multi-step che converte, anti-spam silenzioso, submit senza reload, stati accessibili. Sara può copiarlo nel suo sito stasera. E tu hai un pattern che vale per ogni form che farai d'ora in poi.",
        encourageScript:
            "1) <div id=\"status\" role=\"status\" aria-live=\"polite\" tabindex=\"-1\"> dopo il form. 2) CSS #status.success (verde) e #status.error (rosso). 3) Nel try aggiorna status.className/textContent + status.focus() + reset form. Stessa cosa nel catch ma con classe error.",
    },
];

formsHtml5Course.lessons = lessons;
formsHtml5Course.finalCode = lessons[lessons.length - 1].expectedSnapshot;
