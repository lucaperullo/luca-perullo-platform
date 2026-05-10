#!/usr/bin/env python3
"""
TTS batch via macOS Speech.framework — sfrutta il Neural Engine
di Apple Silicon. Voce italiana professionale "Luca (Premium)"
o "Alice (Premium)", inferenza real-time, qualità sopra tutto
quello che abbiamo provato finora con XTTS-v2.

Pre-requisiti:

    1. macOS (Apple Silicon strongly preferred)
    2. ffmpeg per conversione AIFF→MP3:
           brew install ffmpeg
    3. Voce italiana Premium installata:
           System Settings → Accessibility → Spoken Content
           → System Voice → click ⓘ → Manage Voices
           → Italian (Italy) → flag "Luca (Premium)" o
             "Alice (Premium)" → wait download ~150 MB

Verifica install:
    say -v ? | grep -i italian
    say -v "Luca (Premium)" "Ciao, sono Luca."

Uso:

    # Genera tutte le 25 lezioni (default voice "Luca (Premium)")
    python scripts/tts-macos-batch.py

    # Sample della prima lezione per approvazione
    python scripts/tts-macos-batch.py --only primo-sito/1

    # Voce alternativa (es. Alice femminile)
    python scripts/tts-macos-batch.py --voice "Alice (Premium)"

    # Velocità di lettura (default 175 wpm = naturale italiano)
    python scripts/tts-macos-batch.py --rate 165

    # Riprendi batch interrotto
    python scripts/tts-macos-batch.py --skip-existing

Output: public/play-audio/[corso]/[N].mp3 (32 kbps mono 22 kHz)

Velocità: ~real-time, generazione + conversione di una lezione di 2
minuti richiede ~3-5 secondi. Per 25 lezioni: ~2 minuti totali.
Confrontato a XTTS-v2 (~30s/lezione): ~10x più veloce E qualità
superiore.
"""

import argparse
import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path

# Cleaner condiviso col batch XTTS (versione conservativa: rimuove
# markup ma lascia gli acronimi al motore di pronuncia di macOS).
sys.path.insert(0, str(Path(__file__).parent))
from tts_text_cleaner import clean_for_tts  # noqa: E402

DEFAULT_VOICE = "Luca (Premium)"
DEFAULT_RATE = 175  # parole al minuto, naturale italiano


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--scripts", default="scripts/.lesson-scripts.json",
                   help="JSON estratto da extract-lesson-scripts.py")
    p.add_argument("--output-dir", default="public/play-audio",
                   help="Directory output")
    p.add_argument("--voice", default=DEFAULT_VOICE,
                   help=f'Nome voce macOS (default: "{DEFAULT_VOICE}"). '
                        'Lista voci italiane: say -v ? | grep -i italian')
    p.add_argument("--rate", type=int, default=DEFAULT_RATE,
                   help=f"Velocità lettura in wpm (default: {DEFAULT_RATE})")
    p.add_argument("--bitrate", default="32k",
                   help="Bitrate MP3 (default: 32k = ~480 KB / 2 min)")
    p.add_argument("--skip-existing", action="store_true",
                   help="Salta i file già presenti")
    p.add_argument("--limit", type=int, default=0,
                   help="Limita a N script")
    p.add_argument("--only",
                   help="Genera SOLO 'courseSlug/order' (es. 'primo-sito/1')")
    p.add_argument("--no-clean", action="store_true",
                   help="Salta il cleaner (passa testo grezzo a 'say')")
    p.add_argument("--list-voices", action="store_true",
                   help="Lista tutte le voci installate accessibili a 'say' "
                        "ed esci. Utile per diagnosticare quale voce usare.")
    return p.parse_args()


def cmd_list_voices() -> int:
    """Stampa elenco voci accessibili a `say`. Le voci Siri scaricate
    via Settings → Siri & Spotlight NON appaiono qui — sono locked
    al sistema. Per quelle servono AVSpeechSynthesizer (vedi
    tts-macos-avspeech.py)."""
    result = subprocess.run(["say", "-v", "?"], capture_output=True, text=True)
    print("Voci accessibili a `say` (raggruppate per lingua):")
    print()
    italian = []
    other = []
    for line in result.stdout.splitlines():
        line = line.rstrip()
        if not line.strip():
            continue
        if "it_IT" in line or "Italian" in line:
            italian.append(line)
        else:
            other.append(line)
    print("── Italiano ──")
    if not italian:
        print("  (nessuna voce italiana trovata)")
        print()
        print("Installa Premium 'Luca' o 'Alice':")
        print("  System Settings → Accessibility → Spoken Content")
        print("  → Manage Voices → Italian (Italy) → flag voce → download")
    else:
        for v in italian:
            print(f"  {v}")
    print()
    print(f"── Altre lingue: {len(other)} voci installate")
    print()
    print("NOTA: se hai scaricato una voce 'Siri' che non vedi qui,")
    print("è bloccata al sistema. Usa tts-macos-avspeech.py per")
    print("accedere a TUTTE le voci tramite AVSpeechSynthesizer.")
    return 0


def check_voice_available(voice_name: str) -> tuple[bool, list[str]]:
    """Verifica se la voce esiste tra quelle installate. Ritorna
    (trovata, elenco voci italiane disponibili)."""
    result = subprocess.run(
        ["say", "-v", "?"], capture_output=True, text=True,
    )
    italian_voices = []
    found = False
    for line in result.stdout.splitlines():
        # Formato: "Name           lang   # comment"
        parts = line.split(None, 2)
        if len(parts) < 2:
            continue
        # La voce può avere spazi nel nome ("Luca (Premium)"), serve
        # parsing meno banale — riconosciamo che lang è in posizione
        # X dopo aver strippato il nome variabile. Approccio: cerchiamo
        # il pattern "it_IT" o "it" come token isolato.
        if "it_IT" in line or " it " in line.lower() or "italian" in line.lower():
            # Estrai nome (tutto prima del lang token)
            for token in ("it_IT", "it_It"):
                if token in line:
                    name = line.split(token)[0].strip()
                    italian_voices.append(name)
                    if name == voice_name or name.startswith(voice_name):
                        found = True
                    break
    return found, italian_voices


def main() -> int:
    args = parse_args()

    if args.list_voices:
        return cmd_list_voices()

    # ── Pre-check voci installate ───────────────────────────────────
    found, italian_voices = check_voice_available(args.voice)
    if not italian_voices:
        print("❌ Nessuna voce italiana installata su macOS.", file=sys.stderr)
        print("", file=sys.stderr)
        print("Installa la voce Premium:", file=sys.stderr)
        print("  System Settings → Accessibility → Spoken Content", file=sys.stderr)
        print("  → System Voice → click ⓘ → Manage Voices", file=sys.stderr)
        print("  → Italian (Italy) → flag 'Luca (Premium)'", file=sys.stderr)
        print("  → wait download (~150 MB)", file=sys.stderr)
        return 1
    if not found:
        print(f"⚠ Voce '{args.voice}' non trovata. Voci IT disponibili:")
        for v in italian_voices:
            print(f"   {v}")
        # Fallback su prima voce italiana disponibile, più spesso "Luca"
        # standard se la Premium non è installata
        for fallback in ["Luca (Premium)", "Luca", "Alice (Premium)", "Alice"]:
            if fallback in italian_voices:
                print(f"\n→ Uso fallback: {fallback}")
                args.voice = fallback
                break
        else:
            args.voice = italian_voices[0]
            print(f"\n→ Uso: {args.voice}")

    # ── ffmpeg ──────────────────────────────────────────────────────
    if subprocess.run(["which", "ffmpeg"], capture_output=True).returncode != 0:
        print("❌ ffmpeg non trovato. Installa: brew install ffmpeg",
              file=sys.stderr)
        return 1

    # ── Script JSON ─────────────────────────────────────────────────
    scripts_path = Path(args.scripts)
    if not scripts_path.exists():
        print(f"❌ JSON script non trovato: {scripts_path}", file=sys.stderr)
        print("   Estrailo prima con: python scripts/extract-lesson-scripts.py",
              file=sys.stderr)
        return 1

    with open(scripts_path) as f:
        items = json.load(f)

    # Filtri
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
            print(f"❌ Nessuna lezione trovata per {args.only}", file=sys.stderr)
            return 1
    elif args.limit > 0:
        items = items[:args.limit]

    # ── Header ──────────────────────────────────────────────────────
    print(f"🎙️  Voce:        {args.voice}")
    print(f"🏃 Rate:        {args.rate} wpm")
    print(f"📋 Lezioni:     {len(items)}")
    print(f"📁 Output:      {args.output_dir}")
    print(f"🔧 Cleaner:     {'OFF (--no-clean)' if args.no_clean else 'ON'}")
    print()

    # ── Generazione ─────────────────────────────────────────────────
    output_root = Path(args.output_dir)
    done = 0
    skipped = 0
    failed = 0
    t_start = time.time()

    for i, item in enumerate(items, 1):
        course_slug = item["courseSlug"]
        order = item["lessonOrder"]
        script_text = item["script"]

        out_dir = output_root / course_slug
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"{order}.mp3"

        if args.skip_existing and out_path.exists():
            skipped += 1
            print(f"  [{i:3d}/{len(items)}] {course_slug}/{order} ✓ esistente, skip")
            continue

        title = item.get("title", "")
        preview = script_text[:50].replace("\n", " ")
        print(f"  [{i:3d}/{len(items)}] {course_slug}/{order} · {title}")
        print(f"           {preview}…")

        text = script_text if args.no_clean else clean_for_tts(script_text)
        aiff_path = out_dir / f"{order}.aiff"

        try:
            t0 = time.time()
            # Scriviamo il testo in un temp file per evitare shell escape
            # issues con virgolette/apostrofi negli script.
            with tempfile.NamedTemporaryFile(
                "w", suffix=".txt", delete=False, encoding="utf-8",
            ) as tf:
                tf.write(text)
                text_path = tf.name

            try:
                subprocess.run([
                    "say",
                    "-v", args.voice,
                    "-r", str(args.rate),
                    "-o", str(aiff_path),
                    "-f", text_path,
                ], check=True, capture_output=True)
            finally:
                Path(text_path).unlink(missing_ok=True)

            # AIFF → MP3 32kbps mono 22kHz
            subprocess.run([
                "ffmpeg", "-y", "-loglevel", "error",
                "-i", str(aiff_path),
                "-codec:a", "libmp3lame",
                "-b:a", args.bitrate,
                "-ac", "1",
                "-ar", "22050",
                str(out_path),
            ], check=True)
            aiff_path.unlink()

            elapsed = time.time() - t0
            size_kb = out_path.stat().st_size / 1024
            done += 1
            print(f"           ✓ {size_kb:.0f} KB · {elapsed:.1f}s")
        except subprocess.CalledProcessError as e:
            failed += 1
            print(f"           ✗ Errore: {e}", file=sys.stderr)
            # Cleanup AIFF se rimasto
            aiff_path.unlink(missing_ok=True)

    # ── Riepilogo ───────────────────────────────────────────────────
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
