#!/usr/bin/env python3
"""
Batch generator: clone della voce di Luca per tutti gli script delle
lezioni, output in public/play-audio/[corso]/[N].mp3.

Stack:
  - Coqui XTTS-v2 (16 lingue, italiano nativo, clone da 6s di sample)
  - PyTorch su CPU (MPS Apple Silicon ha bug noti con XTTS, fallback CPU)
  - ffmpeg per conversione finale WAV → MP3 32kbps mono 22kHz

Setup richiesto (una volta sola):
    ./scripts/setup-voice-clone.sh
    npx tsx scripts/extract-lesson-scripts.mts

Uso tipico:
    source .venv-voice/bin/activate
    python scripts/clone-voice-batch.py \\
        --sample voce-luca-30s.wav \\
        --skip-existing --mp3

Il primo run scarica il modello XTTS-v2 (~2GB) in ~/Library/Application
Support/tts/ — poi è in cache. La generazione di una lezione di 2 min
richiede ~15-30 secondi di CPU su M1/M2. Per 270 lezioni: ~2 ore.
Lascialo girare in background, scrive ogni file appena finito.

Riprendi un batch interrotto con --skip-existing.

Costi: ZERO (locale + offline dopo il primo download).

Licenza modello: Coqui Public Model License — non-commercial.
Per uso commerciale (vendita corsi), considera OpenVoice v2 (MIT).
"""

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

# Modulo di pulizia testo (acronimi → fonetica IT, tag HTML → "tag X",
# rimozione caratteri non-vocalizzabili). Importato relativo perché
# vive nello stesso scripts/ del batch.
sys.path.insert(0, str(Path(__file__).parent))
from tts_text_cleaner import clean_for_tts  # noqa: E402


def parse_args():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--sample", required=True,
                   help="WAV/MP3 della voce di Luca (15-30s consigliati). Mono, 22kHz, no rumore.")
    p.add_argument("--scripts", default="scripts/.lesson-scripts.json",
                   help="JSON estratto da extract-lesson-scripts.py")
    p.add_argument("--output-dir", default="public/play-audio",
                   help="Directory output per i file audio")
    p.add_argument("--language", default="it",
                   help="Codice lingua XTTS (default: it)")
    p.add_argument("--skip-existing", action="store_true",
                   help="Salta i file già presenti (riprendi batch interrotti)")
    p.add_argument("--mp3", action="store_true",
                   help="Converti in MP3 mono via ffmpeg dopo XTTS (default: WAV)")
    p.add_argument("--bitrate", default="32k",
                   help="Bitrate MP3 (default: 32k = ~480KB/2min, ottimo per voce)")
    p.add_argument("--limit", type=int, default=0,
                   help="Limita a N script (test sottoinsieme)")
    p.add_argument("--only",
                   help="Genera SOLO un file specifico, formato 'courseSlug/order' "
                        "(es. 'primo-sito/1'). Override --limit, ideale per sampling/approvazione.")
    p.add_argument("--accept-cpml", action="store_true",
                   help="Accetta esplicitamente la Coqui Public Model License "
                        "(non-commerciale) per usare XTTS-v2. Senza questo flag, "
                        "il primo download del modello richiede conferma interattiva "
                        "che spesso non passa correttamente attraverso pipe/script. "
                        "Vedi: https://coqui.ai/cpml")
    return p.parse_args()


def slugify(s: str) -> str:
    return "".join(c if c.isalnum() else "-" for c in s.lower()).strip("-")


def convert_wav_to_mp3(wav_path: Path, mp3_path: Path, bitrate: str = "32k"):
    """ffmpeg conversion: WAV → MP3 mono 22kHz, ottimizzato per voce."""
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(wav_path),
        "-codec:a", "libmp3lame",
        "-b:a", bitrate,
        "-ac", "1",         # mono
        "-ar", "22050",     # 22.05 kHz, sufficient per parlato
        str(mp3_path),
    ]
    subprocess.run(cmd, check=True)
    wav_path.unlink()  # rimuovi WAV intermedio


def main():
    args = parse_args()

    # Validazioni input
    sample = Path(args.sample)
    if not sample.exists():
        print(f"❌ Sample non trovato: {sample}", file=sys.stderr)
        return 1

    scripts_path = Path(args.scripts)
    if not scripts_path.exists():
        print(f"❌ JSON script non trovato: {scripts_path}", file=sys.stderr)
        print(f"   Estrailo prima con: npx tsx scripts/extract-lesson-scripts.mts", file=sys.stderr)
        return 1

    if args.mp3:
        if not subprocess.run(["which", "ffmpeg"], capture_output=True).returncode == 0:
            print("❌ ffmpeg non trovato ma --mp3 richiesto.", file=sys.stderr)
            print("   Installa: brew install ffmpeg", file=sys.stderr)
            return 1

    print(f"🎙️  Sample voce: {sample}")
    print(f"📋 Script JSON: {scripts_path}")
    print(f"📁 Output dir:  {args.output_dir}")
    print(f"🔊 Formato:     {'MP3 ' + args.bitrate if args.mp3 else 'WAV'}")
    print()

    # Coqui XTTS-v2 richiede accettazione della Coqui Public Model
    # License (non-commerciale) prima del primo download. Il prompt
    # interattivo non sempre funziona attraverso script/pipe — usiamo
    # l'env var COQUI_TOS_AGREED per accettare programmaticamente
    # quando l'utente ha passato --accept-cpml.
    if args.accept_cpml:
        os.environ["COQUI_TOS_AGREED"] = "1"
    else:
        print("⚠ XTTS-v2 richiede l'accettazione della Coqui Public Model License")
        print("  (non-commerciale). Per i corsi gratuiti del sito è OK.")
        print()
        print("  Rilancia lo stesso comando aggiungendo --accept-cpml")
        print("  Termini: https://coqui.ai/cpml")
        return 1

    # Lazy import: evita ritardi nei messaggi d'errore precoci
    print("⏳ Carico Coqui XTTS-v2 (la prima volta scarica ~2 GB di modello)…")
    t0 = time.time()
    import torch
    from TTS.api import TTS

    # Apple Silicon: MPS è instabile con XTTS, force CPU per stabilità.
    # Su M1/M2/M3 la CPU fa comunque ~2-3x realtime per voce.
    device = "cpu"
    if torch.cuda.is_available():
        device = "cuda"
    elif torch.backends.mps.is_available():
        print("  ℹ MPS disponibile ma forzo CPU (XTTS instabile su MPS)")

    tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2", progress_bar=True)
    tts.to(device)
    print(f"  ✓ Modello caricato in {time.time() - t0:.1f}s su {device.upper()}")
    print()

    # Carica e itera script
    with open(scripts_path) as f:
        items = json.load(f)

    # --only ha precedenza su --limit. Filtra l'unico item richiesto.
    if args.only:
        if "/" not in args.only:
            print(f"❌ --only deve essere 'courseSlug/order' (es. 'primo-sito/1')",
                  file=sys.stderr)
            return 1
        course_slug, order_str = args.only.split("/", 1)
        try:
            target_order = int(order_str)
        except ValueError:
            print(f"❌ --only: order non valido: {order_str}", file=sys.stderr)
            return 1
        items = [
            i for i in items
            if i["courseSlug"] == course_slug and i["lessonOrder"] == target_order
        ]
        if not items:
            print(f"❌ Nessuna lezione trovata per {args.only}", file=sys.stderr)
            return 1
        print(f"🎯 Sample mode: genero solo {args.only}\n")
    elif args.limit > 0:
        items = items[: args.limit]
        print(f"⚠ Limit attivo: solo {len(items)} script (test mode)\n")

    # Parametri XTTS-v2 ottimizzati per MASSIMA QUALITÀ + voce italiana
    # naturale. Documentazione Coqui:
    #   temperature=0.65   → meno variabilità random, più stabile (default 0.85)
    #   repetition_penalty=2.5 → evita stutter/loop su frasi lunghe (default 2.0)
    #   top_k=50, top_p=0.85   → sampling bilanciato qualità/varietà
    #   gpt_cond_len=30        → più contesto = più aderenza al sample (default 30)
    #   enable_text_splitting=True → spezza testi lunghi in frasi, ognuna
    #                                rigenerata con context fresco — qualità
    #                                molto migliore su lezioni di 200+ char.
    quality_kwargs = dict(
        temperature=0.65,
        repetition_penalty=2.5,
        top_k=50,
        top_p=0.85,
        gpt_cond_len=30,
        gpt_cond_chunk_len=4,
        enable_text_splitting=True,
    )

    output_root = Path(args.output_dir)
    total = len(items)
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
        ext = "mp3" if args.mp3 else "wav"
        out_path = out_dir / f"{order}.{ext}"

        # Resume da batch interrotti
        if args.skip_existing and out_path.exists():
            skipped += 1
            print(f"  [{i:3d}/{total}] {course_slug}/{order}.{ext} ✓ esiste, skip")
            continue

        title = item.get("title", "")
        preview = (script_text[:50] + "…") if len(script_text) > 50 else script_text
        print(f"  [{i:3d}/{total}] {course_slug}/{order} · {title}")
        print(f"           {preview}")

        try:
            t_gen = time.time()
            wav_path = out_dir / f"{order}.wav"
            # Pre-processa il testo: acronimi → fonetica IT, tag HTML
            # → "tag X", rimozione backticks/asterischi/etc. Vedi
            # tts_text_cleaner.py per la pipeline completa.
            cleaned_text = clean_for_tts(script_text)
            tts.tts_to_file(
                text=cleaned_text,
                speaker_wav=str(sample),
                language=args.language,
                file_path=str(wav_path),
                **quality_kwargs,
            )
            elapsed = time.time() - t_gen

            if args.mp3:
                convert_wav_to_mp3(wav_path, out_path, args.bitrate)
                size_kb = out_path.stat().st_size / 1024
            else:
                size_kb = wav_path.stat().st_size / 1024
                # se stiamo facendo WAV, out_path è già wav_path
                pass

            done += 1
            print(f"           ✓ {size_kb:.0f} KB · {elapsed:.1f}s")
        except Exception as e:
            failed += 1
            print(f"           ✗ Errore: {e}", file=sys.stderr)

    elapsed_total = time.time() - t_start
    print()
    print(f"📊 Riepilogo:")
    print(f"   Totale script:  {total}")
    print(f"   ✓ Generati:     {done}")
    print(f"   → Skipped:      {skipped}")
    print(f"   ✗ Falliti:      {failed}")
    print(f"   Tempo totale:   {elapsed_total / 60:.1f} min")
    print()
    print(f"📁 Output: {output_root.absolute()}")
    print()
    if done > 0:
        print("Adesso riavvia il dev server: il TTS player troverà i file")
        print("automaticamente quando l'utente seleziona 'Voce di Luca'.")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
