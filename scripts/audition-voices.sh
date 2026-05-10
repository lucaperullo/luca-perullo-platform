#!/bin/bash
# ─────────────────────────────────────────────────────────────────────
# Audition voci macOS — genera lo stesso testo con tutte le voci IT
# installate, così puoi ascoltare e scegliere la migliore per il brand.
#
# Uso:
#     chmod +x scripts/audition-voices.sh
#     ./scripts/audition-voices.sh
# ─────────────────────────────────────────────────────────────────────
set -e

OUT_DIR="public/play-audio/_audition"
mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR"/*.mp3 "$OUT_DIR"/*.aiff

# Testo realistico: include un saluto, una frase tecnica con tag HTML,
# una con acronimi e numeri, una con punteggiatura varia. È rappresen-
# tativo del tipo di contenuto delle lezioni — se una voce inciampa
# qui, inciamperà anche nelle lezioni vere.
TEXT="Ciao, sono Luca. Apri il tag h1 e scrivi il tuo nome dentro. \
Aggiungi un paragrafo con una breve descrizione di te. \
HTML è la struttura, CSS è lo stile, JavaScript è la logica. \
Quando hai finito, premi Verifica e passiamo alla prossima lezione."

# Lista voci IT (potresti averne diverse a seconda di macOS version)
VOICES=$(say -v "?" | grep -i "it_IT" | awk '{print $1}')

if [ -z "$VOICES" ]; then
    echo "❌ Nessuna voce italiana installata."
    echo "   Installa via System Settings → Accessibility → Spoken Content"
    exit 1
fi

echo "🎙️  Audition voci IT..."
echo ""

# Genera AIFF + MP3 per ogni voce
for VOICE in $VOICES; do
    echo "  → $VOICE"
    AIFF="$OUT_DIR/$VOICE.aiff"
    MP3="$OUT_DIR/$VOICE.mp3"

    say -v "$VOICE" -r 175 -o "$AIFF" "$TEXT" 2>/dev/null

    if command -v ffmpeg &>/dev/null; then
        ffmpeg -y -loglevel error -i "$AIFF" \
            -codec:a libmp3lame -b:a 64k -ac 1 -ar 22050 \
            "$MP3" 2>/dev/null
        rm "$AIFF"
        SIZE=$(du -h "$MP3" | cut -f1)
        echo "    ✓ $MP3 ($SIZE)"
    else
        SIZE=$(du -h "$AIFF" | cut -f1)
        echo "    ✓ $AIFF ($SIZE)"
        echo "      (installa ffmpeg per MP3: brew install ffmpeg)"
    fi
done

echo ""
echo "📁 Tutti i file in: $OUT_DIR"
echo ""
echo "Apri la cartella e ascolta in sequenza:"
echo "  open $OUT_DIR"
echo ""
echo "Quando hai scelto la voce preferita, lancia il batch completo:"
echo "  python3 scripts/tts-macos-batch.py --voice <NOME> --skip-existing"
echo ""
echo "Esempio: python3 scripts/tts-macos-batch.py --voice Eddy --skip-existing"
