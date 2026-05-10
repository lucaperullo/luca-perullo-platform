"""
Pre-processing del testo prima di passarlo a XTTS-v2.

Tre obiettivi:

1. **Acronimi tech in italiano fonetico** — `HTML` letto "acca ti emme
   elle" invece di "html" (che XTTS proverebbe a pronunciare come
   parola, scivolando).

2. **Tag HTML/CSS leggibili** — `<h1>` → "tag acca uno", `</body>` →
   "chiusura tag body". I caratteri `<` `>` da soli verrebbero letti
   come "minore di / maggiore di" o saltati con prosodia strana.

3. **Caratteri non-vocalizzabili** rimossi/normalizzati — backticks,
   asterischi orfani, em-dash unicode, smart quotes. La punteggiatura
   "naturale" (`. , ; : ! ?`) resta perché XTTS la usa per la prosodia.

Uso:
    from tts_text_cleaner import clean_for_tts
    cleaned = clean_for_tts(lesson["script"])
    tts.tts_to_file(text=cleaned, ...)

Test rapido:
    python scripts/tts_text_cleaner.py
"""

import re
from typing import Final


# ─── Acronimi tech: pronuncia italiana lettera-per-lettera ───────────
# Match solo se la sigla appare in maiuscolo come parola intera (\b…\b),
# così non rovina parole tipo "html5" inline (che restano).
ACRONYMS: Final[dict[str, str]] = {
    # Web/programming basics
    "HTML": "acca ti emme elle",
    "CSS": "ci esse esse",
    "JS": "gei esse",
    "TS": "ti esse",
    "JSX": "gei esse iks",
    "TSX": "ti esse iks",
    "XML": "iks emme elle",
    "JSON": "geison",
    "SQL": "esse qu elle",
    "YAML": "iamel",
    # API / rete
    "API": "a pi i",
    "URL": "u erre elle",
    "URI": "u erre i",
    "HTTP": "acca ti ti pi",
    "HTTPS": "acca ti ti pi esse",
    "REST": "rest",
    "CDN": "ci di enne",
    "DNS": "di enne esse",
    # AI / data
    "AI": "a i",
    "ML": "emme elle",
    "LLM": "elle elle emme",
    "RAG": "rag",
    "MCP": "emme ci pi",
    "TTS": "ti ti esse",
    "STT": "esse ti ti",
    # Database / storage
    "DB": "di bi",
    "RLS": "erre elle esse",
    "CRUD": "crud",
    "ORM": "o erre emme",
    # UX / design
    "UI": "u i",
    "UX": "u iks",
    "SEO": "esse e o",
    "CMS": "ci emme esse",
    "CRM": "ci erre emme",
    # Hardware / sistema
    "CPU": "ci pi u",
    "GPU": "gi pi u",
    "RAM": "ram",
    "WASM": "wasm",
    "OS": "o esse",
    "PC": "pi ci",
    # Business
    "MVP": "emme vu pi",
    "PMI": "pi emme i",
    "OCR": "o ci erre",
    # File formats
    "MP3": "emme pi tre",
    "MP4": "emme pi quattro",
    "PDF": "pi di effe",
    "PNG": "pi enne gi",
    "JPG": "gei pi gi",
    "WEBP": "uebp",
    "SVG": "esse vu gi",
}

# ─── Tag HTML headings → numerali italiani ───────────────────────────
# h1, h2... letti come "acca uno", "acca due"...
HEADING_TAGS: Final[dict[str, str]] = {
    "h1": "acca uno",
    "h2": "acca due",
    "h3": "acca tre",
    "h4": "acca quattro",
    "h5": "acca cinque",
    "h6": "acca sei",
}


def expand_html_tags(text: str) -> str:
    """`<h1>` → 'tag acca uno', `</body>` → 'chiusura tag body'.

    Rimuove anche eventuali attributi: `<input type="text" />` →
    'tag input' (gli attributi vengono droppati per non far
    inciampare la prosodia).
    """

    def replace(m: re.Match[str]) -> str:
        slash = m.group(1)
        name = m.group(2).lower()
        prefix = "chiusura tag" if slash else "tag"
        spoken = HEADING_TAGS.get(name, name)
        return f"{prefix} {spoken}"

    # Match: <(/?)(name)([^>]*)>
    # name = sequenza alfanumerica con eventuali trattini/colon
    return re.sub(
        r"<(/?)([a-zA-Z][a-zA-Z0-9-]*)[^>]*>",
        replace,
        text,
    )


def expand_acronyms(text: str) -> str:
    """`HTML` → 'acca ti emme elle'. Solo match all-uppercase con
    word-boundary, per non toccare parole "html" minuscole o
    contenute in altri token."""
    for acr, pron in ACRONYMS.items():
        text = re.sub(rf"\b{re.escape(acr)}\b", pron, text)
    return text


def normalize_punctuation(text: str) -> str:
    """Sostituisce punteggiatura unicode con equivalente
    vocalizzabile + prosodia OK."""
    replacements = [
        ("—", ", "),         # em dash → pausa naturale
        ("–", ", "),         # en dash → pausa
        ("…", "..."),
        ("“", '"'),     # smart double quote left
        ("”", '"'),     # smart double quote right
        ("‘", "'"),     # smart single quote left
        ("’", "'"),     # smart single quote right (and apostrofo)
        ("«", '"'),
        ("»", '"'),
        (" ", " "),     # NBSP
    ]
    for src, dst in replacements:
        text = text.replace(src, dst)
    return text


def remove_inline_code_markup(text: str) -> str:
    """Rimuove markup che TTS leggerebbe come parola estranea:
    backticks, asterischi orfani, brace orfane.

    Cosa resta vocalizzato: `,` `.` `;` `:` `!` `?` `(` `)` —
    XTTS li gestisce come pause/intonazione.
    """
    # Backticks markdown → rimuovi delimitatori, tieni contenuto
    text = re.sub(r"`([^`\n]*)`", r"\1", text)
    # Asterischi (bold/italic markdown)
    text = re.sub(r"\*+", "", text)
    # Trattini doppi CSS (--bg → bg)
    text = re.sub(r"--([a-zA-Z])", r"\1", text)
    # Hash leading (es. #hero → hero) ma solo davanti a lettere
    text = re.sub(r"#([a-zA-Z])", r"\1", text)
    # Doppi apostrofi residui
    text = text.replace("''", "'")
    return text


def collapse_whitespace(text: str) -> str:
    """Normalizza spazi multipli a singoli (può capitare dopo
    sostituzioni che lasciano stringhe vuote)."""
    return re.sub(r"\s+", " ", text).strip()


def clean_for_tts(script: str) -> str:
    """Pipeline conservativa di pulizia per XTTS-v2 italiano.

    Filosofia: XTTS-v2 multilingue gestisce acronimi e parole tech
    naturalmente se il sample contiene voce normale italiana. Forzare
    pronunce fonetiche pre-spelled tipo `HTML` → "acca ti emme elle"
    DA' RISULTATI PEGGIORI perché chiede al modello di pronunciare
    sequenze di lettere italiane sillabate che non sono mai apparse
    nel sample → output robotico.

    Quindi facciamo SOLO il minimo necessario:
      1. punteggiatura unicode → ASCII (smart quotes, em-dash)
      2. rimozione caratteri non-vocalizzabili (backticks, asterischi
         markdown, dash CSS variabili come `--bg`)
      3. tag HTML → testo "naturale" che XTTS pronuncia in lingua
         (es. `<h1>` → "h1", `</body>` → "body chiuso") — niente
         spelling fonetico
      4. whitespace cleanup

    Le funzioni `expand_acronyms` e `expand_html_tags` (versione
    fonetica) sono ancora qui sotto, disponibili se in futuro ci
    serviranno per casi specifici, ma NON applicate di default.
    """
    text = script
    text = normalize_punctuation(text)
    text = soft_expand_html_tags(text)  # versione conservativa
    text = remove_inline_code_markup(text)
    # NIENTE expand_acronyms: lasciamo XTTS leggere "HTML" come word
    # e usare la sua pronuncia interna (di solito sufficiente).
    text = collapse_whitespace(text)
    return text


def clean_for_openai_tts(script: str) -> str:
    """Pipeline AGGRESSIVA per OpenAI TTS italiano (`tts-1`, `tts-1-hd`).

    Contrariamente a clean_for_tts (XTTS), qui possiamo permetterci di:
      - Espandere acronimi nella pronuncia italiana lettera-per-lettera
        ("HTML" → "acca ti emme elle"). Il modello OpenAI italiano sa
        pronunciare correttamente "acca", "ti", "emme" come sillabe
        di alfabeto italiano — non le ha mai "sentite" da un clone, le
        ha viste in training data.
      - Convertire i tag in forma vocalizzata ("<h1>" → "tag acca uno",
        "</body>" → "chiusura tag body"). Idem: pronuncia naturale
        della voce trainata professionalmente.
      - Trasformare le ellissi ("...") in pause naturali (", ") perché
        OpenAI le legge letteralmente come "punti" altrimenti.

    Risultato: testo che la voce italiana OpenAI legge come un
    insegnante umano leggerebbe codice ad alta voce.
    """
    text = script
    text = normalize_punctuation(text)
    # Triple dots → pausa esplicita (OpenAI legge "..." come "punti")
    text = re.sub(r"\.{3,}", ", ", text)
    # Tag HTML in versione fonetica (rispetto a soft, qui tag = "tag X")
    text = expand_html_tags(text)
    text = remove_inline_code_markup(text)
    # Acronimi tech in fonetica italiana (HTML → "acca ti emme elle")
    text = expand_acronyms(text)
    text = collapse_whitespace(text)
    return text


def soft_expand_html_tags(text: str) -> str:
    """Versione conservativa: rimuove i `<` `>` e droppa gli attributi,
    ma lascia il NOME del tag come parola normale.

    `<h1>`         → "h1"
    `<body>`       → "body"
    `</body>`      → "body chiuso"
    `<input type="text" />` → "input"

    XTTS leggerà "h1" / "body" come parole, gestendole con la
    fonetica multilingue naturale del modello — niente sillabazione
    forzata.
    """

    def replace(m: re.Match[str]) -> str:
        slash = m.group(1)
        name = m.group(2).lower()
        if slash:
            return f"{name} chiuso"
        return name

    return re.sub(
        r"<(/?)([a-zA-Z][a-zA-Z0-9-]*)[^>]*>",
        replace,
        text,
    )


# ─── Self-test: esegui il modulo per verificare il cleaner ───────────
if __name__ == "__main__":
    samples = [
        "Apri il `<head>` e aggiungi un `<h1>` con dentro 'Marco'. HTML è la base, CSS lo stile.",
        "Il tag <body> contiene tutto. Il <p> è un paragrafo, il </p> lo chiude.",
        "Per la nostra API REST usiamo JSON. La JSX di React si trasforma in HTML.",
        "Sezione #hero con :root { --bg: #fff; }. Il selettore :has() è magia CSS-only.",
        "AI nel browser via WASM — niente API key, zero LLM cost.",
    ]
    print("=== clean_for_tts (XTTS conservativa, niente acronimi) ===\n")
    for s in samples:
        print("IN :", s)
        print("OUT:", clean_for_tts(s))
        print()
    print()
    print("=== clean_for_openai_tts (aggressiva, fonetica IT completa) ===\n")
    for s in samples:
        print("IN :", s)
        print("OUT:", clean_for_openai_tts(s))
        print()
