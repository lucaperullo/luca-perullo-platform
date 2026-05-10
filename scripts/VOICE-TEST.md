# Voice testing playground

Lo script `test-voice.py` ti permette di iterare velocemente sulla
voce: una frase, parametri tunabili, ascolto, decidi. Non lancia
il batch — è uno strumento per capire come si comporta XTTS-v2
con la tua voce + il tuo sample + il tuo testo.

## Setup (deve essere fatto una volta)

```bash
source .venv-voice/bin/activate
```

## Test rapidi tipici

### 1. Ascolta una frase con i parametri default

```bash
python scripts/test-voice.py --text "Ciao, sono Luca. Iniziamo a programmare insieme."
```

Genera 1 MP3 in `public/play-audio/_tests/`.

### 2. Confronto temperature (A/B/C/D in una sola call)

```bash
python scripts/test-voice.py \
    --text "Apri il tag h1 e scrivi il tuo nome dentro." \
    --temperature 0.3,0.5,0.65,0.85 \
    --label temp-scan
```

Genera 4 MP3 con stessa frase ma temperature diverse:
- `0.3` → voce molto stabile, può suonare monotona
- `0.5` → equilibrio
- `0.65` → default attuale
- `0.85` → più espressivo, ma rischia incoerenze

### 3. Confronto cleaner attivo vs grezzo

```bash
# Con cleaner (default)
python scripts/test-voice.py \
    --text "Apri il <h1> e scrivi 'Marco'. HTML è la base." \
    --label cleaner-on

# Senza cleaner (testo grezzo, vediamo come XTTS si arrangia)
python scripts/test-voice.py \
    --text "Apri il <h1> e scrivi 'Marco'. HTML è la base." \
    --label cleaner-off --raw
```

Confronta i 2 file: il cleaner sta aiutando o peggiorando per quel
caso specifico?

### 4. Confronto sample diversi

Se hai creato più sample (`voce-luca.wav`, `voce-luca-short.wav`,
varianti registrate diversamente), testa lo stesso testo con
ognuno:

```bash
python scripts/test-voice.py \
    --text "Costruiamo un sito da zero, una riga alla volta." \
    --sample voce-luca.wav --label long-sample

python scripts/test-voice.py \
    --text "Costruiamo un sito da zero, una riga alla volta." \
    --sample voce-luca-short.wav --label short-sample
```

### 5. Frasi specifiche delle lezioni che suonano male

Quando il batch principale ti dà una lezione con qualche pronuncia
sbagliata, isola la frase incriminata e iterala qui:

```bash
python scripts/test-voice.py \
    --text "L'h1 è il titolone della pagina, il p il sottotitolo." \
    --temperature 0.3,0.5,0.65 \
    --label h1-test
```

Se nessuna delle 3 versioni la pronuncia bene, passami la frase →
estendo `tts_text_cleaner.py` con un override mirato per quella
casistica.

### 6. Test parametri avanzati

Tutti i parametri XTTS sono esposti come flag:

```bash
python scripts/test-voice.py \
    --text "..." \
    --top-k 30 \
    --top-p 0.7 \
    --repetition-penalty 3.0 \
    --gpt-cond-len 60 \
    --label aggressive-tune
```

| Parametro | Range utile | Effetto |
|---|---|---|
| `--temperature` | 0.3 - 0.85 | Più alto = più variabile |
| `--top-k` | 30 - 100 | Più basso = più conservativo |
| `--top-p` | 0.7 - 0.95 | Filtro nucleus sampling |
| `--repetition-penalty` | 1.5 - 3.0 | Più alto = meno stutter |
| `--gpt-cond-len` | 6 - 60 | Quanto sample legge per condizionare la voce |

## Struttura output

```
public/play-audio/_tests/
  001-temp-scan-clean-voce-luca-t0.3.mp3
  002-temp-scan-clean-voce-luca-t0.5.mp3
  003-temp-scan-clean-voce-luca-t0.65.mp3
  004-temp-scan-clean-voce-luca-t0.85.mp3
  005-cleaner-on-clean-voce-luca-t0.65.mp3
  006-cleaner-off-raw-voce-luca-t0.65.mp3
  ...
```

Counter monotono per non sovrascrivere mai. Filename auto-descrittivo:
`[counter]-[label]-[clean|raw]-[sample-stem]-t[temperature].mp3`.

## Cleanup

```bash
# Svuota la cartella test
rm -f public/play-audio/_tests/*.mp3

# Oppure butta solo i vecchi
ls -t public/play-audio/_tests/*.mp3 | tail -n +20 | xargs rm -f
```

La cartella `_tests/` non interferisce col TTS player nel sito (lui
cerca `public/play-audio/[corso]/[N].mp3`, non legge `_tests`).
