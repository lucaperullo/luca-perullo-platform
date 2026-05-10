#!/usr/bin/env python3
"""
Estrae gli script delle lezioni dei corsi /play in un JSON piatto,
pronto per il batch di clone voce (clone-voice-batch.py).

Usa parsing text-based con regex sui file TS — niente tsx/tsconfig
paths, niente dipendenze runtime. Funziona ovunque ci sia Python 3.

Uso (dalla root del repo):
    python scripts/extract-lesson-scripts.py

Output:
    scripts/.lesson-scripts.json

Cosa estrae:
  - Per ogni corso "live" (status: "live")
  - Per ogni lezione: order, slug, title, script,
    successScript, encourageScript
"""

import json
import re
import sys
from pathlib import Path


# Sorgenti dei corsi live (devono avere `status: "live"`).
# Aggiungi qui nuovi corsi quando passano da "soon" a "live".
COURSE_FILES = [
    {
        "slug": "primo-sito",
        "path": "src/data/play-courses.ts",
    },
    {
        "slug": "portfolio-personale",
        "path": "src/data/play/courses/portfolio-personale.ts",
    },
    {
        "slug": "tailwind-utility-first",
        "path": "src/data/play/courses/tailwind-utility-first.ts",
    },
    {
        "slug": "html-semantico",
        "path": "src/data/play/courses/html-semantico.ts",
    },
    {
        "slug": "forms-html5",
        "path": "src/data/play/courses/forms-html5.ts",
    },
    {
        "slug": "tipografia-design",
        "path": "src/data/play/courses/tipografia-design.ts",
    },
    {
        "slug": "layout-moderno",
        "path": "src/data/play/courses/layout-moderno.ts",
    },
    {
        "slug": "animazioni-avanzate",
        "path": "src/data/play/courses/animazioni-avanzate.ts",
    },
    {
        "slug": "accessibilita-wcag",
        "path": "src/data/play/courses/accessibilita-wcag.ts",
    },
]


def extract_lessons_from_file(course_slug: str, ts_source: str) -> list[dict]:
    """Estrae l'array di lezioni dalla sezione `const lessons[...] = [`
    fino al `];` di chiusura. Niente parsing AST: regex sui campi
    note (sintassi consistente nei file TS dei corsi).

    Bypassa il blocco `modules: [...]` per non confondere `order:` di
    moduli con quelli di lezioni.
    """
    # 1) Isola la sezione lessons. Pattern: cerca la prima dichiarazione
    #    `(export )?const lessons[: tipo]? = [` e cattura fino al `];`
    #    appaiato che chiude l'array.
    section_start = re.search(
        r'(?:export\s+)?const\s+lessons\b[^=]*=\s*\[',
        ts_source,
    )
    if not section_start:
        return []

    # Per trovare il `];` che chiude l'array dobbiamo bilanciare le
    # parentesi quadre — non basta cercare il primo `]` perché ci sono
    # array annidati (es. validate.rules: [...]).
    start_idx = section_start.end()  # subito dopo il `[` iniziale
    depth = 1
    end_idx = None
    i = start_idx
    in_str = False
    str_char = ""
    while i < len(ts_source) and depth > 0:
        c = ts_source[i]
        # Salta contenuto delle stringhe (per non contare `]` dentro).
        if in_str:
            if c == "\\":
                i += 2
                continue
            if c == str_char:
                in_str = False
            i += 1
            continue
        if c in ('"', "'", "`"):
            in_str = True
            str_char = c
        elif c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                end_idx = i
                break
        i += 1

    if end_idx is None:
        return []
    lessons_section = ts_source[start_idx:end_idx]

    # 2) Dentro la sezione lessons, trova ogni lezione. Le lezioni qui
    #    sono i top-level oggetti dell'array — riconosciuti da
    #    `\n    {` (4-spaces indent, primo livello dell'array).
    #    Ogni lezione contiene `order: N` come primo campo.
    matches = list(re.finditer(
        r'\n    \{\n        order:\s*(\d+)',
        lessons_section,
    ))

    str_field = lambda name: rf'\b{name}:\s*\n?\s*"((?:[^"\\]|\\.)*)"'

    lessons = []
    for j, m in enumerate(matches):
        block_start = m.start()
        block_end = matches[j + 1].start() if j + 1 < len(matches) else len(lessons_section)
        block = lessons_section[block_start:block_end]
        order = int(m.group(1))

        def extract_str(name: str) -> str:
            mm = re.search(str_field(name), block, re.DOTALL)
            if not mm:
                return ""
            raw = mm.group(1)
            return (raw
                    .replace('\\"', '"')
                    .replace("\\'", "'")
                    .replace("\\n", "\n")
                    .replace("\\\\", "\\"))

        slug = extract_str("slug")
        title = extract_str("title")
        script = extract_str("script")
        success_script = extract_str("successScript")
        encourage_script = extract_str("encourageScript")

        if not script:
            continue

        lessons.append({
            "courseSlug": course_slug,
            "lessonOrder": order,
            "lessonSlug": slug,
            "title": title,
            "script": script,
            "successScript": success_script,
            "encourageScript": encourage_script,
        })

    return lessons


def main() -> int:
    repo_root = Path(__file__).parent.parent.resolve()
    items: list[dict] = []

    for course in COURSE_FILES:
        path = repo_root / course["path"]
        if not path.exists():
            print(f"⚠ {path} non trovato, salto", file=sys.stderr)
            continue
        ts = path.read_text(encoding="utf-8")
        # Verifica che sia un corso live
        if 'status: "live"' not in ts:
            print(f"  → {course['slug']} non è 'live', salto")
            continue
        lessons = extract_lessons_from_file(course["slug"], ts)
        items.extend(lessons)
        print(f"  ✓ {course['slug']}: {len(lessons)} lezioni")

    out = repo_root / "scripts" / ".lesson-scripts.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")

    chars = sum(len(i["script"]) + len(i["successScript"]) + len(i["encourageScript"])
                for i in items)
    print()
    print(f"✓ Estratti {len(items)} script in {out}")
    print(f"  Caratteri totali: {chars:,}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
