#!/usr/bin/env python3
"""
TTS batch via Apple Shortcuts → Siri Voice neural.

Apple ha chiuso l'accesso CLI/SDK alle voci Siri moderne (le neural,
quelle che suonano davvero umane). L'unico ponte ufficiale è
Shortcuts.app, che ha permessi privilegiati e può richiamare la
sintesi Siri tramite l'azione "Make Spoken Audio from Text".

Pre-requisiti:
   1. Crea uno Shortcut chiamato "TTS Italian" (o nome a scelta)
      seguendo `scripts/SHORTCUTS-SIRI-VOICE.md`. Receive Text input,
      action "Make Spoken Audio from Text" con Voice = "Siri Voice".
   2. brew install ffmpeg
   3. python3 scripts/extract-lesson-scripts.py (se non già fatto)

Uso:

    # Sample della prima lezione
    python3 scripts/tts-shortcut-batch.py --only primo-sito/1

    # Batch completo con resume
    python3 scripts/tts-shortcut-batch.py --skip-existing

    # Shortcut con nome custom
    python3 scripts/tts-shortcut-batch.py --shortcut "Mio TTS"

Output: public/play-audio/[corso]/[N].mp3 (MP3 32kbps mono 22kHz).

Velocità: ogni `shortcuts run` ha ~1-2s overhead + tempo sintesi.
Per 25 lezioni: ~5-10 minuti totali.
"""

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from tts_text_cleaner import clean_for_tts  # noqa: E402

DEFAULT_SHORTCUT = "TTS Italian"


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--shortcut", default=DEFAULT_SHORTCUT,
                   help=f'Nome dello Shortcut (default: "{DEFAULT_SHORTCUT}")')
    p.add_argument("--scripts", default="scripts/.lesson-scripts.json")
    p.add_argument("--output-dir", default="public/play-audio")
    p.add_argument("--bitrate", default="32k",
                   help="Bitrate MP3 (default: 32k)")
    p.add_argument("--skip-existing", action="store_true")
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--only",
                   help="Solo 'courseSlug/order' (es. 'primo-sito/1')")
    p.add_argument("--no-clean", action="store_true",
                   help="Salta cleaner (passa testo grezzo allo Shortcut)")
    return p.parse_args()


def shortcut_exists(name: str) -> bool:
    """Verifica che lo Shortcut esista usando `shortcuts list`."""
    try:
        result = subprocess.run(
            ["shortcuts", "list"],
            capture_output=True, text=True, timeout=10,
        )
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False
    return name in result.stdout.splitlines()


# Path concordato con lo Shortcut: il comando shell interno fa
# `cat /tmp/tts-input.txt` per leggere il testo. Python ci scrive
# sopra prima di ogni chiamata. Bypassa completamente il sistema
# di input di Shortcuts (`--input-path` ha mille edge case con i
# tipi attesi/forniti, questo lo evita).
SHORTCUT_INPUT_PATH = Path("/tmp/tts-input.txt")


def synthesize_via_shortcut(
    text: str,
    shortcut_name: str,
    output_path: Path,
    timeout: int = 120,
) -> bool:
    """Sintetizza usando lo Shortcut "TTS Italian" → voce Siri neural.

    Approccio: bypass del sistema --input-path di Shortcuts (che ha
    problemi col matching dei tipi input atteso/fornito). Scriviamo
    il testo in /tmp/tts-input.txt e lo Shortcut lo legge da lì
    tramite un'azione "Esegui script shell: cat /tmp/tts-input.txt".

    Lo Shortcut deve essere configurato con esattamente 3 azioni:
      1. Esegui script shell: `cat /tmp/tts-input.txt`
      2. Crea file audio parlato da [Risultato dello script shell]
      3. Interrompi e restituisci [File audio parlato]

    Vedi SHORTCUTS-SIRI-VOICE.md per la guida completa.

    Ritorna True se l'esecuzione è andata a buon fine ed è stato
    creato un file audio non vuoto.
    """
    # Scrivi il testo nel path concordato. Sovrascritto ad ogni call.
    SHORTCUT_INPUT_PATH.write_text(text, encoding="utf-8")

    try:
        result = subprocess.run([
            "shortcuts", "run", shortcut_name,
            "--output-path", str(output_path),
        ], capture_output=True, text=True, timeout=timeout)

        if result.returncode != 0:
            err = result.stderr.strip() or "exit non-zero"
            print(f"           ✗ shortcuts run: {err}", file=sys.stderr)
            print(f"             → Verifica che lo Shortcut abbia",
                  file=sys.stderr)
            print(f"               'cat /tmp/tts-input.txt' nel campo",
                  file=sys.stderr)
            print(f"               script shell (vedi doc).",
                  file=sys.stderr)
            return False

        if not output_path.exists() or output_path.stat().st_size == 0:
            print(f"           ✗ Shortcut non ha prodotto audio",
                  file=sys.stderr)
            return False

        return True
    except subprocess.TimeoutExpired:
        print(f"           ✗ Timeout ({timeout}s)", file=sys.stderr)
        return False


def main() -> int:
    args = parse_args()

    # ── Pre-checks ─────────────────────────────────────────────────
    if subprocess.run(["which", "shortcuts"], capture_output=True).returncode != 0:
        print("❌ comando 'shortcuts' non trovato (richiede macOS 12+).",
              file=sys.stderr)
        return 1

    if not shortcut_exists(args.shortcut):
        print(f"❌ Shortcut '{args.shortcut}' non trovato.", file=sys.stderr)
        print("", file=sys.stderr)
        print("Per crearlo segui: scripts/SHORTCUTS-SIRI-VOICE.md", file=sys.stderr)
        print("", file=sys.stderr)
        print("Brevemente:", file=sys.stderr)
        print("  1. Apri Shortcuts.app", file=sys.stderr)
        print("  2. New Shortcut → ⓘ → 'Receive any input' → Text", file=sys.stderr)
        print("  3. Aggiungi action 'Make Spoken Audio from Text'", file=sys.stderr)
        print("  4. Voice = 'Siri Voice'", file=sys.stderr)
        print(f"  5. Save as '{args.shortcut}'", file=sys.stderr)
        return 1

    if subprocess.run(["which", "ffmpeg"], capture_output=True).returncode != 0:
        print("❌ ffmpeg non trovato. brew install ffmpeg", file=sys.stderr)
        return 1

    # ── Script JSON ────────────────────────────────────────────────
    scripts_path = Path(args.scripts)
    if not scripts_path.exists():
        print(f"❌ JSON script non trovato: {scripts_path}", file=sys.stderr)
        print("   Estrailo prima con: python3 scripts/extract-lesson-scripts.py",
              file=sys.stderr)
        return 1

    with open(scripts_path) as f:
        items = json.load(f)

    if args.only:
        if "/" not in args.only:
            print(f"❌ --only deve essere 'courseSlug/order'", file=sys.stderr)
            return 1
        course, order_str = args.only.split("/", 1)
        target = int(order_str)
        items = [
            i for i in items
            if i["courseSlug"] == course and i["lessonOrder"] == target
        ]
        if not items:
            print(f"❌ Lezione {args.only} non trovata", file=sys.stderr)
            return 1
    elif args.limit > 0:
        items = items[:args.limit]

    # ── Header ─────────────────────────────────────────────────────
    print(f"🎙️  Shortcut:    {args.shortcut}")
    print(f"📋 Lezioni:     {len(items)}")
    print(f"📁 Output:      {args.output_dir}")
    print(f"🔧 Cleaner:     {'OFF' if args.no_clean else 'ON'}")
    print()

    # ── Generazione ────────────────────────────────────────────────
    output_root = Path(args.output_dir)
    done = 0
    skipped = 0
    failed = 0
    t_start = time.time()

    # Per ogni lezione generiamo 3 audio:
    #   N.mp3           → script principale (avatar narra la lezione)
    #   N-success.mp3   → successScript (quando l'utente verifica OK)
    #   N-encourage.mp3 → encourageScript (quando l'utente sbaglia)
    # In questo modo TUTTE le voci sono di Luca, niente più fallback
    # speechSynthesis del browser.
    SCRIPT_KINDS = [
        ("", "script"),
        ("-success", "successScript"),
        ("-encourage", "encourageScript"),
    ]

    for i, item in enumerate(items, 1):
        course_slug = item["courseSlug"]
        order = item["lessonOrder"]

        out_dir = output_root / course_slug
        out_dir.mkdir(parents=True, exist_ok=True)

        title = item.get("title", "")
        print(f"  [{i:3d}/{len(items)}] {course_slug}/{order} · {title}")

        for suffix, field in SCRIPT_KINDS:
            text_raw = item.get(field) or ""
            if not text_raw.strip():
                continue
            out_path = out_dir / f"{order}{suffix}.mp3"

            if args.skip_existing and out_path.exists():
                skipped += 1
                print(f"           ✓ {suffix or 'main'} skip esistente")
                continue

            preview = text_raw[:50].replace("\n", " ")
            print(f"           [{suffix or 'main'}] {preview}…")

            text = text_raw if args.no_clean else clean_for_tts(text_raw)
            m4a_path = out_dir / f"{order}{suffix}.m4a"

            try:
                t0 = time.time()
                ok = synthesize_via_shortcut(text, args.shortcut, m4a_path)
                if not ok:
                    failed += 1
                    m4a_path.unlink(missing_ok=True)
                    continue

                subprocess.run([
                    "ffmpeg", "-y", "-loglevel", "error",
                    "-i", str(m4a_path),
                    "-codec:a", "libmp3lame",
                    "-b:a", args.bitrate,
                    "-ac", "1",
                    "-ar", "22050",
                    str(out_path),
                ], check=True)
                m4a_path.unlink()

                elapsed = time.time() - t0
                size_kb = out_path.stat().st_size / 1024
                done += 1
                print(f"             ✓ {size_kb:.0f} KB · {elapsed:.1f}s")
            except subprocess.CalledProcessError as e:
                failed += 1
                m4a_path.unlink(missing_ok=True)
                print(f"             ✗ ffmpeg: {e}", file=sys.stderr)

    elapsed_total = time.time() - t_start
    print()
    print("📊 Riepilogo:")
    print(f"   ✓ Generati:  {done}")
    print(f"   → Skipped:   {skipped}")
    print(f"   ✗ Falliti:   {failed}")
    print(f"   Tempo:       {elapsed_total:.1f}s")
    print()
    print(f"📁 Output: {output_root.absolute()}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
