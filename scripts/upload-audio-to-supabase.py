#!/usr/bin/env python3
"""
Carica i file MP3 generati localmente da `tts-shortcut-batch.py` su
Supabase Storage (bucket pubblico `play-audio`).

Perché Supabase invece di committare nel repo:
   - 243 file × ~200-500 KB = ~50-100 MB → repo gonfio
   - Supabase Storage free tier: 5 GB storage + 50 GB egress/mese
   - CDN integrato, zero config
   - Frontend resta senza modifiche grandi: cambia solo il base URL

Pre-requisiti:
   1. Bucket `play-audio` creato (già fatto via SQL).
   2. SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
      (service role richiesta per write — anon key non basta per
      le RLS policy del bucket).
   3. pip install supabase (aggiunto al requirements del venv-voice).

Uso:

    # Setup una tantum:
    source .venv-voice/bin/activate
    pip install supabase

    # Upload tutti gli MP3 dalla cartella public/play-audio/
    python3 scripts/upload-audio-to-supabase.py

    # Solo un corso:
    python3 scripts/upload-audio-to-supabase.py --course primo-sito

    # Force re-upload (sovrascrive remoti esistenti):
    python3 scripts/upload-audio-to-supabase.py --force

    # Dry run (mostra solo cosa farebbe):
    python3 scripts/upload-audio-to-supabase.py --dry-run

Performance: ~10-20 file al secondo (rete dipendente). Per 243 file
totali: ~30-60 secondi.
"""

import argparse
import os
import sys
import time
from pathlib import Path


REPO_ROOT = Path(__file__).parent.parent.resolve()
LOCAL_AUDIO_DIR = REPO_ROOT / "public" / "play-audio"
BUCKET_NAME = "play-audio"


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--course", help="Solo un corso specifico (es. 'primo-sito')")
    p.add_argument("--force", action="store_true",
                   help="Sovrascrive file remoti già esistenti (default: skip)")
    p.add_argument("--dry-run", action="store_true",
                   help="Mostra cosa farebbe senza caricare")
    return p.parse_args()


def load_env() -> tuple[str, str]:
    """Legge SUPABASE_URL + SERVICE_ROLE_KEY da .env.local.
    Niente dipendenza python-dotenv: parsing manuale ASCII semplice."""
    env_path = REPO_ROOT / ".env.local"
    if not env_path.exists():
        print(f"❌ {env_path} non trovato.", file=sys.stderr)
        sys.exit(1)

    env: dict[str, str] = {}
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"').strip("'")

    url = env.get("NEXT_PUBLIC_SUPABASE_URL", "")
    service_key = env.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not url or not service_key:
        print("❌ Manca NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY",
              file=sys.stderr)
        print("   in .env.local. Service role serve per upload (RLS policy).",
              file=sys.stderr)
        sys.exit(1)
    return url, service_key


def collect_files(course_filter: str | None) -> list[tuple[str, Path]]:
    """Trova tutti i .mp3 sotto public/play-audio/<course>/<file>.
    Ritorna lista di (storage_path, local_path)."""
    if not LOCAL_AUDIO_DIR.exists():
        print(f"❌ {LOCAL_AUDIO_DIR} non esiste. Genera gli audio prima:",
              file=sys.stderr)
        print("   python3 scripts/tts-shortcut-batch.py --skip-existing",
              file=sys.stderr)
        sys.exit(1)

    files: list[tuple[str, Path]] = []
    for course_dir in sorted(LOCAL_AUDIO_DIR.iterdir()):
        if not course_dir.is_dir():
            continue
        if course_dir.name.startswith("_") or course_dir.name.startswith("."):
            continue  # skip _tests/, _audition/, hidden
        if course_filter and course_dir.name != course_filter:
            continue
        for mp3 in sorted(course_dir.glob("*.mp3")):
            storage_path = f"{course_dir.name}/{mp3.name}"
            files.append((storage_path, mp3))
    return files


def main() -> int:
    args = parse_args()

    try:
        from supabase import create_client, Client  # type: ignore
    except ImportError:
        print("❌ supabase-py non installato.", file=sys.stderr)
        print("   pip install supabase", file=sys.stderr)
        return 1

    url, service_key = load_env()
    files = collect_files(args.course)

    if not files:
        print("⚠ Nessun file da caricare.")
        return 0

    total_kb = sum(p.stat().st_size for _, p in files) / 1024
    print(f"🎙️  Bucket:        {BUCKET_NAME}")
    print(f"📦 File da caricare: {len(files)} ({total_kb:.0f} KB totali)")
    print(f"🔄 Mode:          {'FORCE upsert' if args.force else 'skip-existing'}")
    print(f"🌐 Project:       {url}")
    print()

    if args.dry_run:
        print("DRY RUN — file che caricherei:")
        for storage_path, local_path in files[:20]:
            size_kb = local_path.stat().st_size / 1024
            print(f"  {storage_path}  ({size_kb:.0f} KB)")
        if len(files) > 20:
            print(f"  ... e altri {len(files) - 20}")
        return 0

    client: Client = create_client(url, service_key)
    storage = client.storage.from_(BUCKET_NAME)

    uploaded = 0
    skipped = 0
    failed = 0
    t_start = time.time()

    for i, (storage_path, local_path) in enumerate(files, 1):
        try:
            with open(local_path, "rb") as f:
                data = f.read()
            options: dict[str, str] = {
                "content-type": "audio/mpeg",
                "cache-control": "public, max-age=31536000, immutable",
            }
            if args.force:
                options["upsert"] = "true"

            try:
                storage.upload(
                    path=storage_path,
                    file=data,
                    file_options=options,
                )
                uploaded += 1
                size_kb = len(data) / 1024
                print(f"  [{i:3d}/{len(files)}] ↑ {storage_path}  ({size_kb:.0f} KB)")
            except Exception as e:
                # Errore tipico: "Duplicate" se esiste già e non upsert
                err_msg = str(e).lower()
                if "duplicate" in err_msg or "already exists" in err_msg:
                    skipped += 1
                    if i <= 5 or i % 20 == 0:  # log ridotto
                        print(f"  [{i:3d}/{len(files)}] ✓ {storage_path}  esiste, skip")
                else:
                    failed += 1
                    print(f"  [{i:3d}/{len(files)}] ✗ {storage_path}: {e}",
                          file=sys.stderr)
        except IOError as e:
            failed += 1
            print(f"  [{i:3d}/{len(files)}] ✗ Lettura locale: {e}",
                  file=sys.stderr)

    elapsed = time.time() - t_start
    print()
    print("📊 Riepilogo:")
    print(f"   ↑ Caricati:  {uploaded}")
    print(f"   ✓ Skipped:   {skipped}")
    print(f"   ✗ Falliti:   {failed}")
    print(f"   Tempo:       {elapsed:.1f}s")
    print()

    base_public_url = f"{url}/storage/v1/object/public/{BUCKET_NAME}"
    print(f"🌐 Base URL pubblico:")
    print(f"   {base_public_url}")
    print()
    print(f"   Esempio: {base_public_url}/primo-sito/1.mp3")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
