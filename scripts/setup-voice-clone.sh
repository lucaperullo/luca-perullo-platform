#!/bin/bash
# ─────────────────────────────────────────────────────────────────────
# Setup ambiente per clone voce locale su MacBook Pro.
#
# Crea un venv Python isolato dal sistema, installa Coqui TTS (XTTS-v2)
# e PyTorch. Verifica ffmpeg per la conversione finale in MP3.
#
# Uso:
#   chmod +x scripts/setup-voice-clone.sh
#   ./scripts/setup-voice-clone.sh
#
# Lo script è idempotente: rilancialo quando vuoi, salta i passi
# già completati.
# ─────────────────────────────────────────────────────────────────────
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
VENV_DIR="$ROOT_DIR/.venv-voice"

echo "🎙️  Setup clone voce locale"
echo ""

# ── Python (preferenza 3.11, fallback 3.10, ultimo 3.x) ──────────────
PYTHON=$(command -v python3.11 || command -v python3.10 || command -v python3 || echo "")
if [ -z "$PYTHON" ]; then
    echo "❌ Python 3 non trovato."
    echo "   Installa: brew install python@3.11"
    exit 1
fi
PY_VERSION=$($PYTHON --version 2>&1 | awk '{print $2}')
echo "  ✓ Python: $PY_VERSION ($PYTHON)"

# Coqui TTS richiede Python 3.9-3.11. 3.12+ ha problemi.
PY_MAJOR=$(echo "$PY_VERSION" | cut -d. -f1)
PY_MINOR=$(echo "$PY_VERSION" | cut -d. -f2)
if [ "$PY_MAJOR" -ne 3 ] || [ "$PY_MINOR" -gt 11 ] || [ "$PY_MINOR" -lt 9 ]; then
    echo "  ⚠ Coqui TTS preferisce Python 3.9-3.11. La tua $PY_VERSION potrebbe dare problemi."
    echo "     Considera: brew install python@3.11"
fi

# ── Architettura Mac ──────────────────────────────────────────────────
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
    echo "  ✓ Apple Silicon ($ARCH) — generazione veloce"
else
    echo "  ⚠ Mac Intel ($ARCH) — sarà lento, ma funziona"
fi

# ── ffmpeg (per conversione finale WAV → MP3) ─────────────────────────
if command -v ffmpeg &>/dev/null; then
    echo "  ✓ ffmpeg: $(ffmpeg -version | head -1 | awk '{print $3}')"
else
    echo "  ⚠ ffmpeg non trovato."
    echo "     Installa: brew install ffmpeg"
    echo "     (serve solo per il flag --mp3 nello script di batch)"
fi

# ── Venv ──────────────────────────────────────────────────────────────
if [ ! -d "$VENV_DIR" ]; then
    echo ""
    echo "📦 Creo venv in .venv-voice/ (~50 MB)…"
    $PYTHON -m venv "$VENV_DIR"
else
    echo "  ✓ venv già presente in .venv-voice/"
fi

# ── Dipendenze pip ────────────────────────────────────────────────────
echo ""
echo "📦 Installo dipendenze (la prima volta scarica ~3 GB di torch + TTS)…"
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

# Pin tutto in un'unica install per evitare che le transient dep
# bumpino versioni che pinniamo. Note sulle versioni:
#
#   setuptools<82
#     → torch 2.11 ha vincolo esplicito setuptools<82.
#
#   transformers>=4.57,<5.0
#     → range che soddisfa coqui-tts 0.27.5 (richiede >=4.57 per
#       `is_torchcodec_available`) E mantiene `isin_mps_friendly`
#       (rimosso in 5.0+). Tre funzioni richieste in cascata:
#         - `isin_mps_friendly`           (presente fino a 4.x)
#         - `is_torch_greater_or_equal`   (aggiunto 4.46+)
#         - `is_torchcodec_available`     (aggiunto 4.57+)
#       Solo il range 4.57.x .. 4.x ha tutte e tre.
#
#   coqui-tts[codec]>=0.27
#     → fork mantenuto del pacchetto Coqui originale (Coqui Inc.
#       chiuso, idiap/coqui-ai-TTS tiene viva la libreria).
#       L'extra [codec] tira torchcodec (PyTorch 2.9+ ha cambiato
#       backend audio I/O — coqui-tts senza torchcodec esplode con
#       `TORCHCODEC_IMPORT_ERROR`).
#
#   torch / torchaudio
#     → ultime versioni stabili compat con setuptools<82.
pip install --upgrade --quiet pip wheel
pip install --quiet \
    "setuptools<82" \
    "transformers>=4.57,<5.0" \
    "coqui-tts[codec]>=0.27" \
    "torch" \
    "torchaudio"

deactivate

echo ""
echo "✅ Setup completato."
echo ""
echo "─── Prossimi passi ───"
echo ""
echo "1. Registra un sample della tua voce — 15-30 secondi di parlato"
echo "   pulito, italiano, senza musica/rumore. Salva come .wav o .mp3."
echo "   Suggerimento: leggi 2-3 frasi naturali."
echo ""
echo "2. Estrai gli script delle lezioni in un JSON:"
echo "     npx tsx scripts/extract-lesson-scripts.mts"
echo ""
echo "3. Genera tutti gli audio (la prima volta scarica modello XTTS ~2 GB):"
echo "     source .venv-voice/bin/activate"
echo "     python scripts/clone-voice-batch.py \\"
echo "         --sample voce-luca.wav \\"
echo "         --skip-existing --mp3"
echo ""
echo "4. I file finiscono in public/play-audio/[corso]/[N].mp3"
echo "   Il TTS player li trova automaticamente via fallback chain."
echo ""
