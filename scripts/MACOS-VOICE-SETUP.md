# macOS Speech.framework — voce italiana professionale

Setup per usare la voce italiana **Premium "Luca"** integrata in
macOS, accelerata dal Neural Engine di Apple Silicon. Qualità
superiore a XTTS-v2 + voce clonata, real-time, zero costi, zero
dipendenze Python ML.

## Perché questa via

| | XTTS-v2 (cloned) | macOS Speech (Premium) |
|---|---|---|
| Qualità tech | Mediocre — non sa h1, tag, ecc. | Eccellente — pronuncia nativa IT |
| Velocità | ~30s per lezione | ~3s per lezione |
| Setup | 5 step, dep hell | 1 click in System Settings |
| Hardware | CPU pegged | Neural Engine, idle |
| Costo | Modello ~2GB + setup | 150 MB voce |
| Voce | Clonata da 60s sample | Pre-trainata, professionale |

## Setup (3 minuti, una volta sola)

### 1. Installa la voce Premium "Luca"

Apri **System Settings** (⌘,) → cerca "Spoken Content" o naviga:

> System Settings → Accessibility → Spoken Content

Click sull'icona **ⓘ** accanto a "System Voice", poi
"**Manage Voices…**".

Espandi **Italian (Italy)** → flagga **"Luca (Premium)"**.

(Premium è essenziale: la versione standard "Luca" è MOLTO inferiore.
Premium richiede ~150 MB di download dal server Apple, una volta sola,
poi è offline.)

Aspetta che il download finisca (5-10 min su connessione decente,
indicatore di progresso visibile nella tabella delle voci).

> Tip: installa anche **"Alice (Premium)"** (femminile, ottima qualità
> pure lei) e **"Federica (Premium)"** se vuoi A/B testare voci
> diverse per le lezioni o per personaggi.

### 2. Verifica nel terminale

```bash
# Lista voci IT installate
say -v "?" | grep -i italian

# Test rapido della voce
say -v "Luca (Premium)" "Ciao, sono Luca. Iniziamo a programmare insieme."
```

Dovresti sentire una voce maschile italiana, fluida, con prosodia
naturale.

### 3. Installa ffmpeg (se non l'hai già)

```bash
brew install ffmpeg
```

Serve solo per convertire l'output AIFF di `say` in MP3 leggero.

## Generazione audio

Il batch script usa `subprocess` per chiamare `say`, fa la conversione
in MP3 32 kbps mono via `ffmpeg`, e salva nello stesso path che il
TTS player frontend cerca.

### Estrai gli script (se non l'hai fatto)

```bash
python3 scripts/extract-lesson-scripts.py
```

### Sample una lezione (~5 secondi totali)

```bash
python3 scripts/tts-macos-batch.py --only primo-sito/1
```

Output: `public/play-audio/primo-sito/1.mp3`. Ascoltalo:

```bash
open public/play-audio/primo-sito/1.mp3
```

### Batch completo (tutte le 25 lezioni, ~2 minuti totali)

```bash
python3 scripts/tts-macos-batch.py --skip-existing
```

Notare: niente `--accept-cpml`, niente `--sample`, niente venv. È
Python stdlib + `say` + `ffmpeg`. Lo script funziona anche fuori
dal venv `.venv-voice/` (perché non importa torch/coqui).

### Variazioni utili

```bash
# Voce femminile Alice
python3 scripts/tts-macos-batch.py --voice "Alice (Premium)" --skip-existing

# Lettura più lenta (default 175 wpm, prova 160 per lezioni complesse)
python3 scripts/tts-macos-batch.py --rate 160 --skip-existing

# Bitrate più alto (più qualità, più peso)
python3 scripts/tts-macos-batch.py --bitrate 64k --skip-existing

# Cleaner OFF (passa testo grezzo a say — debug)
python3 scripts/tts-macos-batch.py --no-clean --only primo-sito/1
```

## Trade-off vs voce clonata di Luca

Sì, non è la TUA voce — è una voce italiana professionale del catalogo
Apple. Ma:

1. La voce si chiama **Luca** (coincidenza perfetta col brand del sito).
2. La qualità tech è **infinitamente superiore** a qualsiasi clone
   che possiamo produrre con sample da 60s e XTTS-v2.
3. Quando **avrai pronto un sample registrato in studio** (mezz'ora
   in una vera sound booth) potrai sempre tornare al cloning con
   ElevenLabs paid (~$5/mese, qualità pari o sopra Apple).

In altre parole: macOS Speech come **default produzione**, ElevenLabs
o Coqui come **upgrade futuro** quando avrai sample audio professionale.

## Pulizia

Lo script `tts-macos-batch.py` non installa niente, non lascia file
intermedi. I file AIFF temporanei vengono cancellati subito dopo la
conversione MP3.

I MP3 finali vivono in `public/play-audio/[corso]/[N].mp3` —
il TTS player frontend li trova automaticamente.

Se vuoi resettare e rigenerare tutto:

```bash
rm -rf public/play-audio/*/
python3 scripts/tts-macos-batch.py
```
