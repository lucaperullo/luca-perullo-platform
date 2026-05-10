# Clone voce locale → audio lezioni

Pipeline per clonare la voce di Luca su MacBook Pro (Apple Silicon
consigliato) e renderizzare gli MP3 di tutte le lezioni dei corsi
`/play`. Tutto offline, gratis, niente API key.

## Cosa fa

1. **Setup**: crea un venv Python isolato, installa Coqui XTTS-v2.
2. **Estrai script**: legge i `script` di ogni lezione live e li mette in JSON.
3. **Genera audio**: per ogni script chiama XTTS con il sample della
   tua voce, produce un WAV, lo converte in MP3 leggero (32kbps mono).
4. **Deploy**: i file finiscono in `public/play-audio/[corso]/[N].mp3`.
   Il TTS player frontend (`tts-player.ts`) li trova automaticamente
   con la sua fallback chain — niente codice da modificare.

## Requisiti

- macOS (Apple Silicon strongly preferred — Intel funziona ma molto più lento)
- Python 3.9-3.11 (3.12+ ha rotture coi binding torch). `brew install python@3.11` se non l'hai
- ffmpeg per la conversione MP3: `brew install ffmpeg`
- ~5 GB di disco libero (modello XTTS-v2 + cache torch)
- Un sample della tua voce: 15-30 secondi di parlato pulito, italiano,
  niente musica/rumore. Salva come `.wav` o `.mp3`. Suggerimento:
  registra leggendo 2-3 frasi neutre, tono naturale.

## Flow consigliato (3 fasi)

```bash
# ═══════════════════════════════════════════════════════════════════
# FASE 0 — Setup (una volta sola, ~5-10 min per pip install)
# ═══════════════════════════════════════════════════════════════════
chmod +x scripts/setup-voice-clone.sh
./scripts/setup-voice-clone.sh

# Estrai gli script delle 25 lezioni live in un JSON.
python3 scripts/extract-lesson-scripts.py
# → scripts/.lesson-scripts.json (~25 lezioni / ~15K caratteri)

# ═══════════════════════════════════════════════════════════════════
# FASE 1 — Sample da approvare (~2-3 min, 1 file)
# ═══════════════════════════════════════════════════════════════════
# Genera solo la prima lezione del primo corso. La prima call scarica
# il modello XTTS-v2 (~2 GB), poi è in cache.
source .venv-voice/bin/activate
python scripts/clone-voice-batch.py \
    --sample voce-luca.wav \
    --only primo-sito/1 \
    --mp3

# ↓ ASCOLTA il risultato:
open public/play-audio/primo-sito/1.mp3

# Se la voce ti soddisfa → fase 2.
# Se vuoi più aderenza al sample originale, registra un sample più
# lungo (30s+, voce naturale, microfono buono) e ripeti la fase 1.

# ═══════════════════════════════════════════════════════════════════
# FASE 2 — Batch completo (~30-60 min per 25 lezioni)
# ═══════════════════════════════════════════════════════════════════
python scripts/clone-voice-batch.py \
    --sample voce-luca.wav \
    --skip-existing --mp3

# I file finiscono in public/play-audio/[corso]/[N].mp3.
# Il TTS player li trova via fallback chain — niente codice da
# modificare. Riavvia il dev server e seleziona "Voce di Luca" nel
# modale voce sulla pagina lezione.
```

## Parametri XTTS ottimizzati per qualità

Il batch script usa parametri tunati per **massima accuratezza + voce
italiana naturale**:

| Parametro | Valore | Perché |
|---|---|---|
| `temperature` | 0.65 | Più stabile, meno variazioni casuali (default 0.85) |
| `repetition_penalty` | 2.5 | Evita stutter su frasi lunghe (default 2.0) |
| `top_k` | 50 | Sampling restrittivo, qualità coerente |
| `top_p` | 0.85 | Bilancio qualità/varietà |
| `gpt_cond_len` | 30 | Più contesto del sample = più aderenza alla voce |
| `enable_text_splitting` | True | Spezza per frase, qualità migliore su lezioni lunghe |

Tutti hardcoded in `clone-voice-batch.py` → `quality_kwargs`.

## Performance attesa

Su M1/M2/M3 in CPU mode (XTTS instabile su MPS):
- Caricamento modello (prima call): ~30-60s
- Generazione 1 lezione (~2 min audio): 15-30 secondi
- Batch completo 270 lezioni: ~1.5-3 ore

Lascialo girare in background — scrive i file via via, niente
checkpoint da gestire. Se interrompi e rilanci con `--skip-existing`
riprende da dove si era fermato.

## Riconoscere quando un sample è buono

XTTS-v2 fa miracoli con poco, ma il sample fa la differenza:

✓ **Buono**:
- 15-30 secondi continui (non spezzettato)
- Voce parlata naturale, non lettura forzata
- Stanza silenziosa o microfono close-talk
- WAV mono 22050 Hz, oppure MP3 di buona qualità

✗ **Cattivo**:
- Musica di sottofondo
- Eco/riverbero (registrato in stanza grande vuota)
- Variazioni forti di volume (gridato + sussurrato)
- Solo "ciao ciao" di 2 secondi (troppo poco)

Conversione manuale del sample a 22kHz mono se serve:
```bash
ffmpeg -i voce-luca-raw.m4a -ac 1 -ar 22050 voce-luca.wav
```

## Licenza

Coqui XTTS-v2 è sotto **Coqui Public Model License — non-commercial**.
Per i corsi gratuiti del sito è OK. Se in futuro vendi corsi,
considera **OpenVoice v2** (MIT, commercial-safe) — ha qualità
leggermente sotto ma licenza pulita.

Per swappare a OpenVoice basta cambiare la sezione di import del
modello in `clone-voice-batch.py`. Le interfacce sono simili.

## Troubleshooting

**`coqui-tts` non si installa**: tipicamente è la versione di Python.
Controlla: `python --version`. Se è 3.12+, installa 3.11 con `brew
install python@3.11` e ricrea il venv puntando a quella versione:
```bash
rm -rf .venv-voice
python3.11 -m venv .venv-voice
source .venv-voice/bin/activate
pip install coqui-tts torch torchaudio
```

**Errore `MPS placeholder`**: lo script forza CPU per evitare bug
noti di XTTS su MPS. Se vuoi sperimentare con MPS apri lo script e
rimuovi il `device = "cpu"` esplicito — a tuo rischio.

**Generazione lenta**: su Mac Intel è lento (4-5x realtime). Considera
di girare il batch su Google Colab (T4 GPU gratis) — guarda README
nei commenti del Python script.

**Qualità non mi convince**: prova un sample più lungo (30s invece di
10s) e meglio registrato. XTTS è sensibile al sample. In alternativa,
testa OpenVoice v2 che ha un approccio diverso al clone.
