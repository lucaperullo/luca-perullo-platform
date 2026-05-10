#!/usr/bin/env python3
"""
TTS batch via AVSpeechSynthesizer (PyObjC) — accesso a TUTTE le voci
del sistema macOS, incluse alcune Premium/Enhanced/Siri-adjacent
neural che il comando `say` CLI non vede.

Perché esiste questo script in parallelo a tts-macos-batch.py:
   `say` CLI può accedere solo a una sottoparte delle voci installate.
   Le voci scaricate via "Siri & Spotlight → Siri Voice → Voice X" sono
   classificate dal sistema come "Siri-locked" e NON appaiono in
   `say -v ?`. AVSpeechSynthesizer (Swift/ObjC API a livello AppKit)
   le vede e può sintetizzarle a file audio.

Pre-requisiti:

    pip install pyobjc-framework-AVFoundation

(Lo installa nel venv .venv-voice se sei dentro, altrimenti nel
Python di sistema. Pesa ~3 MB, niente torch o altro.)

Uso:

    # Lista TUTTE le voci IT accessibili via AVSpeechSynthesizer
    python3 scripts/tts-macos-avspeech.py --list-voices

    # Sample della prima lezione con voce specifica per nome
    python3 scripts/tts-macos-avspeech.py \\
        --voice "Luca" --only primo-sito/1

    # Anche partial match: "luca" basta se è univoco
    python3 scripts/tts-macos-avspeech.py --voice luca

    # Selezione precisa via identifier (più robusto)
    python3 scripts/tts-macos-avspeech.py \\
        --voice "com.apple.voice.premium.it-IT.Luca"

    # Batch completo
    python3 scripts/tts-macos-avspeech.py --voice luca --skip-existing

Velocità: real-time su Apple Silicon, ~3-5s per lezione + 1s di MP3.
"""

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

# Cleaner condiviso (versione conservativa: lascia gli acronimi a chi
# pronuncia, normalizza markup).
sys.path.insert(0, str(Path(__file__).parent))
from tts_text_cleaner import clean_for_tts  # noqa: E402

QUALITY_NAMES = {1: "default", 2: "enhanced", 3: "premium"}


def lazy_import_avfoundation():
    """Import lazy di pyobjc per dare un messaggio d'errore decente
    se non è installato (default su macOS)."""
    try:
        import objc  # noqa: F401
        from AVFoundation import (
            AVSpeechSynthesizer,
            AVSpeechUtterance,
            AVSpeechSynthesisVoice,
            AVAudioFile,
        )
        from Foundation import NSRunLoop, NSDate, NSURL
        return {
            "AVSpeechSynthesizer": AVSpeechSynthesizer,
            "AVSpeechUtterance": AVSpeechUtterance,
            "AVSpeechSynthesisVoice": AVSpeechSynthesisVoice,
            "AVAudioFile": AVAudioFile,
            "NSRunLoop": NSRunLoop,
            "NSDate": NSDate,
            "NSURL": NSURL,
        }
    except ImportError:
        print("❌ pyobjc-framework-AVFoundation non installato.", file=sys.stderr)
        print("   Installa: pip install pyobjc-framework-AVFoundation",
              file=sys.stderr)
        print("   (~3 MB, solo wrapper ObjC su framework macOS già presenti)",
              file=sys.stderr)
        sys.exit(1)


def list_italian_voices():
    """Stampa le voci italiane accessibili via AVSpeechSynthesizer.
    A differenza di `say -v ?`, questa lista include voci neural
    Siri-adjacent installate via Settings."""
    av = lazy_import_avfoundation()
    voices = av["AVSpeechSynthesisVoice"].speechVoices()
    italian = [v for v in voices if str(v.language()).startswith("it")]
    italian.sort(key=lambda v: (-int(v.quality()), str(v.name())))
    print(f"Voci italiane installate ({len(italian)} totali):")
    print()
    print(f"  {'NOME':<30} {'QUALITÀ':<10} {'LINGUA':<8} IDENTIFIER")
    print("  " + "─" * 100)
    for v in italian:
        q = QUALITY_NAMES.get(int(v.quality()), str(v.quality()))
        print(f"  {str(v.name()):<30} {q:<10} {str(v.language()):<8} "
              f"{str(v.identifier())}")
    print()
    print("Premium ed enhanced sono molto migliori di default. Se vedi")
    print("una voce 'enhanced' o 'premium' qui ma NON in `say -v ?`,")
    print("quella è solo accessibile via questo script — usa --voice")
    print("col nome o l'identifier sopra.")
    return italian


def find_voice(query: str, voices):
    """Trova voce per:
      1. exact name match (case-sensitive)
      2. identifier exact match
      3. case-insensitive substring del name
      4. case-insensitive substring dell'identifier
    """
    q = query.strip()
    # 1. exact name
    for v in voices:
        if str(v.name()) == q:
            return v
    # 2. identifier exact
    for v in voices:
        if str(v.identifier()) == q:
            return v
    # 3. case-insensitive name substring
    ql = q.lower()
    for v in voices:
        if ql in str(v.name()).lower():
            return v
    # 4. case-insensitive identifier substring
    for v in voices:
        if ql in str(v.identifier()).lower():
            return v
    return None


def synthesize_to_aiff(text: str, voice, rate: float, output_path: Path) -> bool:
    """Sintetizza utterance in un file AIFF usando il callback API
    di AVSpeechSynthesizer (writeUtterance:toBufferCallback:).

    Ritorna True se completato con successo, False altrimenti.
    """
    av = lazy_import_avfoundation()

    synthesizer = av["AVSpeechSynthesizer"].alloc().init()
    utterance = av["AVSpeechUtterance"].alloc().initWithString_(text)
    utterance.setVoice_(voice)
    # Rate AVSpeechUtterance: 0.0 = lento, 0.5 = naturale, 1.0 = veloce.
    # Il param --rate è in wpm, lo mappiamo: 175 wpm ≈ 0.5 (naturale).
    rate_normalized = max(0.1, min(1.0, rate / 350.0))
    utterance.setRate_(rate_normalized)

    output_url = av["NSURL"].fileURLWithPath_(str(output_path))
    state = {"audio_file": None, "done": False, "error": None}

    def callback(buffer):
        try:
            if buffer is None or int(buffer.frameLength()) == 0:
                state["done"] = True
                return
            if state["audio_file"] is None:
                # Primo buffer: crea il file con il format del buffer
                fmt = buffer.format()
                settings = fmt.settings()
                # initForWriting:settings:commonFormat:interleaved:error:
                # ha signature complicata; usiamo la versione più
                # semplice initForWriting:settings:error:
                file_obj, err = av["AVAudioFile"].alloc()\
                    .initForWriting_settings_error_(
                        output_url, settings, None,
                    )
                if err is not None or file_obj is None:
                    state["error"] = f"AVAudioFile init: {err}"
                    state["done"] = True
                    return
                state["audio_file"] = file_obj
            # Scrivi il buffer
            ok, err = state["audio_file"].writeFromBuffer_error_(buffer, None)
            if not ok:
                state["error"] = f"writeFromBuffer: {err}"
                state["done"] = True
        except Exception as e:
            state["error"] = f"callback: {e}"
            state["done"] = True

    synthesizer.writeUtterance_toBufferCallback_(utterance, callback)

    # Block fino a fine sintesi (60s timeout di sicurezza)
    runloop = av["NSRunLoop"].currentRunLoop()
    deadline = time.time() + 60
    while not state["done"] and time.time() < deadline:
        runloop.runUntilDate_(av["NSDate"].dateWithTimeIntervalSinceNow_(0.05))

    if state["error"]:
        print(f"  ⚠ {state['error']}", file=sys.stderr)
        return False
    return state["done"] and output_path.exists() and output_path.stat().st_size > 0


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--scripts", default="scripts/.lesson-scripts.json")
    p.add_argument("--output-dir", default="public/play-audio")
    p.add_argument("--voice", default="Luca",
                   help='Nome o identifier voce (es. "Luca", '
                        '"Luca (Premium)", "com.apple.voice.premium.it-IT.Luca"). '
                        'Match: nome esatto > identifier esatto > substring.')
    p.add_argument("--rate", type=int, default=175,
                   help="Velocità lettura in wpm (default: 175)")
    p.add_argument("--bitrate", default="32k",
                   help="Bitrate MP3 (default: 32k)")
    p.add_argument("--skip-existing", action="store_true")
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--only",
                   help="Solo 'courseSlug/order' (es. 'primo-sito/1')")
    p.add_argument("--no-clean", action="store_true",
                   help="Salta cleaner (passa testo grezzo)")
    p.add_argument("--list-voices", action="store_true",
                   help="Lista TUTTE le voci IT installate (incluse "
                        "quelle non in `say -v ?`) ed esci")
    return p.parse_args()


def main() -> int:
    args = parse_args()

    if args.list_voices:
        list_italian_voices()
        return 0

    av = lazy_import_avfoundation()

    # ── Trova voce ──────────────────────────────────────────────────
    all_voices = av["AVSpeechSynthesisVoice"].speechVoices()
    italian_voices = [v for v in all_voices if str(v.language()).startswith("it")]
    if not italian_voices:
        print("❌ Nessuna voce italiana installata.", file=sys.stderr)
        print("   Installa via System Settings → Accessibility → Spoken Content",
              file=sys.stderr)
        return 1

    voice = find_voice(args.voice, italian_voices)
    if not voice:
        print(f"❌ Voce '{args.voice}' non trovata. Disponibili:",
              file=sys.stderr)
        for v in italian_voices:
            q = QUALITY_NAMES.get(int(v.quality()), "?")
            print(f"   {str(v.name()):<30} ({q})  {str(v.identifier())}",
                  file=sys.stderr)
        return 1

    voice_quality = QUALITY_NAMES.get(int(voice.quality()), "?")
    print(f"🎙️  Voce:         {voice.name()}  ({voice_quality})")
    print(f"   Identifier:   {voice.identifier()}")
    print(f"🏃 Rate:         {args.rate} wpm")
    print()

    # ── ffmpeg ──────────────────────────────────────────────────────
    if subprocess.run(["which", "ffmpeg"], capture_output=True).returncode != 0:
        print("❌ ffmpeg non trovato. Installa: brew install ffmpeg",
              file=sys.stderr)
        return 1

    # ── Script JSON ─────────────────────────────────────────────────
    scripts_path = Path(args.scripts)
    if not scripts_path.exists():
        print(f"❌ JSON script non trovato: {scripts_path}", file=sys.stderr)
        return 1

    with open(scripts_path) as f:
        items = json.load(f)

    if args.only:
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

    print(f"📋 Lezioni:      {len(items)}")
    print(f"📁 Output:       {args.output_dir}")
    print(f"🔧 Cleaner:      {'OFF' if args.no_clean else 'ON'}")
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
            print(f"  [{i:3d}/{len(items)}] {course_slug}/{order} ✓ skip esistente")
            continue

        title = item.get("title", "")
        preview = script_text[:50].replace("\n", " ")
        print(f"  [{i:3d}/{len(items)}] {course_slug}/{order} · {title}")
        print(f"           {preview}…")

        text = script_text if args.no_clean else clean_for_tts(script_text)
        aiff_path = out_dir / f"{order}.aiff"

        try:
            t0 = time.time()
            ok = synthesize_to_aiff(text, voice, args.rate, aiff_path)
            if not ok:
                failed += 1
                aiff_path.unlink(missing_ok=True)
                continue

            # AIFF → MP3
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
            aiff_path.unlink(missing_ok=True)
            print(f"           ✗ ffmpeg: {e}", file=sys.stderr)

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
