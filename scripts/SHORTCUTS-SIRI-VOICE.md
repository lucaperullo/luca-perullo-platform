# Voce Siri neural via Apple Shortcuts

Apple ha bloccato l'accesso diretto alle nuove voci Siri neural
(quelle scaricate via Settings → Siri & Spotlight). Niente `say`,
niente AVSpeechSynthesizer da app third-party. **L'unico ponte
ufficiale è Shortcuts.app** — che gira con permessi privilegiati e
può accedere alla voce Siri.

Creiamo uno Shortcut una volta sola, poi il batch Python lo richiama
per ogni lezione.

## Setup Comando Rapido (60 secondi, macOS in italiano)

### 1. Apri Comandi Rapidi

`Spotlight (⌘+Spazio) → "Comandi Rapidi" → Invio`

### 2. Nuovo comando rapido

Click sul **+** in alto a sinistra, oppure menu **File → Nuovo
comando rapido**.

### 3. Imposta che riceve testo come input

In alto a destra, click sull'icona **dettagli** (⌥⌘1). Si apre
la sidebar "Dettagli del comando rapido".

- Flagga **"Ricevi tutti gli input dall'esecuzione del comando
  rapido"** (in altre versioni: "Ricevi input")
- **Tipi di input** → flagga solo **"Testo"** (deflagga gli altri)
- **Se nessuna entrata** → "Continua" o "Interrompi e rispondi"
  (default va bene)

### 4a. Aggiungi PRIMA "Ottieni contenuto del file"

Il CLI `shortcuts run` può passare l'input solo come **file** via
`--input-path` (non supporta `--input STRING`). Quindi serve un
primo step che converte file → testo, altrimenti l'azione "Crea
audio parlato" fallisce con "Non è stato possibile elaborare
l'input".

Nella barra di ricerca azioni, cerca **"Ottieni contenuto del
file"**. Trascinala nel canvas. Se non la trovi prova varianti:
- "Ottieni contenuti del file"
- "Leggi file"
- "Ottieni testo dall'input"

Imposta il suo input/sorgente su **"Input del comando rapido"**
(la magic variable disponibile nel popup variabili).

### 4b. Aggiungi l'azione "Crea audio parlato dal testo"

Nella barra di ricerca, cerca **"Crea audio parlato"**. Trascina
**"Crea audio parlato dal testo"** SOTTO l'azione "Ottieni
contenuto del file".

Il campo testo dell'azione deve puntare automaticamente all'output
dell'azione precedente (di solito è già magic-collegato). Se vedi
ancora "Input del comando rapido" cambialo cliccando → seleziona
l'output di "Ottieni contenuto del file".

Il flow finale è:

```
[Input del comando rapido]   ← --input-path FILE.txt dal CLI
        ↓
Ottieni contenuto del file   ← legge il testo dal file
        ↓
Crea audio parlato dal testo ← voce Siri sul testo
        ↓
[Output audio M4A]            ← --output-path
```

### 5. Configura la voce Siri

Click sulla freccia **▸** dell'azione per espandere le opzioni.
Vedrai i campi:
- **Voce**: cambia da "Predefinita" a **"Voce di Siri"**
- **Tonalità / Velocità / Volume**: lascia tutti a 1.00

La selezione "Voce di Siri" è la chiave: usa la voce Siri neural
che hai scaricato, non le voci compact robotiche.

### 6. Salva con il nome corretto

Menu **File → Rinomina** (⌘R) → digita esattamente:

> **TTS Italian**

(qualunque nome va bene, ma poi devi passarlo al Python con
`--shortcut "Nome scelto"`).

Salva con **⌘S**.

### 7. Verifica dal terminale

```bash
# Lista degli shortcut disponibili
shortcuts list | grep -i italian

# Test rapido: 1 frase, output M4A nel desktop
echo "Ciao, sono Luca. Apri il tag h1." > /tmp/test.txt
shortcuts run "TTS Italian" \
    --input-path /tmp/test.txt \
    --output-path ~/Desktop/test-siri.m4a

open ~/Desktop/test-siri.m4a
```

Se senti la **voce Siri neural** invece di Eddy/Flo robotic →
funziona tutto, vai al batch.

## Batch generazione lezioni

```bash
# Tutte le 25 lezioni live
python3 scripts/tts-shortcut-batch.py --skip-existing

# Solo prima lezione per sample
python3 scripts/tts-shortcut-batch.py --only primo-sito/1

# Shortcut con nome diverso
python3 scripts/tts-shortcut-batch.py --shortcut "Mio TTS Custom"
```

## Caveat noti

- **Permessi automazione**: la prima volta che `shortcuts run` parte,
  macOS chiede conferma per "Eseguire automazioni". Click "Allow".
- **Velocità**: ogni call a `shortcuts run` ha overhead di ~1-2s
  (avvio Shortcuts.app in background). Per 25 lezioni: ~30s di
  overhead totale + tempo sintesi reale.
- **Niente `--rate` knob**: la velocità si controlla nella config
  dello Shortcut (campo "Rate" dell'azione "Make Spoken Audio from
  Text"). Modifica lì se vuoi più lento/veloce.
- **Output M4A**: Shortcuts produce M4A (AAC), il batch script
  converte in MP3 32 kbps via ffmpeg.

## Plan B se Shortcuts non funziona

Se per qualche ragione `shortcuts run` non riesce a generare l'audio
(macOS troppo vecchia, permessi, bug), il fallback è **OpenAI TTS API**:
- Voce italiana professionale tts-1-hd ("echo" o "onyx")
- ~$0.50 totali per generare tutte le lezioni
- Free tier $5 al signup → coperto

Dimmi se vuoi che metto in piedi quella pipeline come backup.
