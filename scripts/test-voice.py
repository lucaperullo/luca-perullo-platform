#!/usr/bin/env python3
"""
Voice testing playground — sintetizza una stringa arbitraria con
parametri tunabili. Pensato per A/B test rapidi senza lanciare il
batch completo: una frase, ascolti, decidi.

Uso tipico:

    # Singolo test, parametri di default
    python scripts/test-voice.py --text "Ciao, sono Luca."

    # Confronto temperature (0.3 = stabile, 0.85 = espressivo)
    python scripts/test-voice.py --text "Ciao, sono Luca." \\
        --temperature 0.3,0.5,0.65,0.85

    # Test con sample diverso
    python scripts/test-voice.py --text "..." --sample voce-luca-short.wav

    # Frase grezza, niente cleaner (debug del cleaner)
    python scripts/test-voice.py --text "<h1>Ciao</h1>" --raw

    # Confronto con e senza cleaner
    python scripts/test-voice.py --text "<h1>Ciao</h1> HTML è la base" --label clean
    python scripts/test-voice.py --text "<h1>Ciao</h1> HTML è la base" --label raw --raw

Output: public/play-audio/_tests/NNN-[label]-[sample]-tX.YY.mp3
        (counter incrementale + descrittori → niente conflitti tra run)

Suggerimento: tieni questa directory aperta nel Finder + un audio
player nelle preferenze, ascolta i file man mano che escono.
"""

import argparse
import os
import subprocess
import sys
import time
from pathlib import Path

# Modulo cleaner condiviso col batch.
sys.path.insert(0, str(Path(__file__).parent))
from tts_text_cleaner import clean_for_tts  # noqa: E402

DEFAULT_VOICE = "tts_models/multilingual/multi-dataset/xtts_v2"
TESTS_DIR = Path("public/play-audio/_tests")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--text", required=True, help="Testo da sintetizzare")
    p.add_argument("--sample", default="voce-luca.wav",
                   help="Sample voce (default: voce-luca.wav)")
    p.add_argument("--language", default="it",
                   help="Codice lingua XTTS (default: it)")
    p.add_argument("--temperature", default="0.65",
                   help="Float singolo o lista CSV per A/B (es. '0.3,0.65,0.85')")
    p.add_argument("--top-k", default=50, type=int)
    p.add_argument("--top-p", default=0.85, type=float)
    p.add_argument("--repetition-penalty", default=2.5, type=float)
    p.add_argument("--gpt-cond-len", default=30, type=int)
    p.add_argument("--raw", action="store_true",
                   help="Salta il cleaner: usa --text as-is (debug)")
    p.add_argument("--label", default="",
                   help="Etichetta inserita nel filename (es. 'cleaner', 'short-sample')")
    p.add_argument("--no-mp3", action="store_true",
                   help="Salva WAV invece di convertire in MP3")
    return p.parse_args()


def safe_label(s: str) -> str:
    """Rende sicura una label per il filesystem."""
    return "".join(c if c.isalnum() or c == "-" else "" for c in s)


def main() -> int:
    args = parse_args()

    # Accetta CPML implicitamente: chi usa questo script è già passato
    # dal flag --accept-cpml del batch principale, qui in test mode
    # diamo per scontato il consenso.
    os.environ["COQUI_TOS_AGREED"] = "1"

    sample = Path(args.sample)
    if not sample.exists():
        print(f"❌ Sample non trovato: {sample}", file=sys.stderr)
        return 1

    # Pulisci o mantieni grezzo
    if args.raw:
        text = args.text
        cleaner_tag = "raw"
    else:
        text = clean_for_tts(args.text)
        cleaner_tag = "clean"

    print(f"📝 Testo originale:  {args.text}")
    if text != args.text:
        print(f"🧹 Testo pulito:     {text}")
    print(f"🎙️  Sample:           {sample}")
    print(f"🔧 Cleaner:          {cleaner_tag}")
    print()

    # Lista temperature (anche solo una)
    temperatures = [float(t.strip()) for t in args.temperature.split(",") if t.strip()]
    if not temperatures:
        print("❌ --temperature vuoto", file=sys.stderr)
        return 1

    # Carica XTTS
    print("⏳ Carico XTTS-v2…")
    t0 = time.time()
    import torch  # noqa: F401  — serve solo per check MPS in TTS interno
    from TTS.api import TTS

    tts = TTS(model_name=DEFAULT_VOICE, progress_bar=False)
    tts.to("cpu")
    print(f"  ✓ Modello caricato in {time.time() - t0:.1f}s")
    print()

    # Output: counter incrementale globale + descrittori nel nome
    TESTS_DIR.mkdir(parents=True, exist_ok=True)
    existing = sorted(TESTS_DIR.glob("*.mp3")) + sorted(TESTS_DIR.glob("*.wav"))
    next_counter = len(existing) + 1

    label_part = f"-{safe_label(args.label)}" if args.label else ""
    sample_part = safe_label(sample.stem)
    cleaner_part = f"-{cleaner_tag}"

    generated = []
    for temp in temperatures:
        wav_path = TESTS_DIR / (
            f"{next_counter:03d}{label_part}{cleaner_part}"
            f"-{sample_part}-t{temp}.wav"
        )

        print(f"  → temp={temp}…")
        t_gen = time.time()
        try:
            tts.tts_to_file(
                text=text,
                speaker_wav=str(sample),
                language=args.language,
                file_path=str(wav_path),
                temperature=temp,
                repetition_penalty=args.repetition_penalty,
                top_k=args.top_k,
                top_p=args.top_p,
                gpt_cond_len=args.gpt_cond_len,
                gpt_cond_chunk_len=4,
                enable_text_splitting=True,
            )
        except Exception as e:
            print(f"    ✗ Errore: {e}", file=sys.stderr)
            next_counter += 1
            continue

        elapsed = time.time() - t_gen

        # Conversione MP3 (default) o tieni WAV
        if args.no_mp3:
            final_path = wav_path
            size_kb = wav_path.stat().st_size / 1024
        else:
            mp3_path = wav_path.with_suffix(".mp3")
            try:
                subprocess.run([
                    "ffmpeg", "-y", "-loglevel", "error",
                    "-i", str(wav_path),
                    "-codec:a", "libmp3lame",
                    "-b:a", "32k",
                    "-ac", "1",
                    "-ar", "22050",
                    str(mp3_path),
                ], check=True)
                wav_path.unlink()
                final_path = mp3_path
                size_kb = mp3_path.stat().st_size / 1024
            except (subprocess.CalledProcessError, FileNotFoundError):
                # ffmpeg non disponibile o errore: lascia WAV
                final_path = wav_path
                size_kb = wav_path.stat().st_size / 1024

        generated.append(final_path)
        print(f"    ✓ {final_path.name} ({size_kb:.0f} KB · {elapsed:.1f}s)")
        next_counter += 1

    print()
    if not generated:
        print("⚠ Nessun file generato.", file=sys.stderr)
        return 1

    print(f"📁 {len(generated)} file in: {TESTS_DIR.absolute()}")
    print()
    print("Apri in macOS:")
    if len(generated) == 1:
        print(f"  open '{generated[0]}'")
    else:
        for f in generated:
            print(f"  open '{f}'")
        print()
        print("Per ascoltarli tutti in sequenza:")
        files_str = " ".join(f"'{f}'" for f in generated)
        print(f"  afplay {files_str}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
