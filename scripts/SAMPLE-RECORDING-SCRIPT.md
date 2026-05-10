# Script per registrare il sample voce

Leggi questo testo nel modo più naturale possibile, come se stessi
spiegando a un amico al bar — niente dizione da telegiornale, niente
recitazione. Tono caldo, calmo, sicuro. **Non** rallentare per
articolare meglio: XTTS clona meglio se il sample è autentico.

## Setup audio

- Stanza silenziosa, senza eco (chiudi armadi, metti tappeti se hai)
- Microfono close-talk (cuffie con mic OK; meglio se mic dedicato)
- Volume di registrazione: stai a 10-15 cm dal mic, parla a volume
  conversazionale normale
- Niente musica di sottofondo, niente ventilatore acceso, niente
  telefono in vibrazione vicino
- Una sola take, continua, senza pause lunghe (XTTS impara meglio
  da audio coerente che da spezzoni montati)

## Cosa registrare

Salva il file come **`voce-luca.wav`** o `.m4a` nella root del repo
(la stessa directory di package.json) — quando rilanci il batch
sovrascrive il sample precedente.

Durata target: **45-75 secondi** (ho calibrato il testo a ~60s di
parlato medio). Se ti viene troppo lungo / corto, va bene comunque.

## Testo da leggere

Leggilo tutto in un'unica registrazione. Puoi mettere micro-pause
fra una frase e l'altra, ma niente stop e ripartenze.

---

> Ciao, sono Luca. Costruisco siti, app e integrazioni AI per chi
> ha un'idea ma non sa come trasformarla in qualcosa che funziona
> davvero.
>
> Lavoro con HTML, CSS, JavaScript e React quasi ogni giorno.
> Quando serve, tiro fuori anche Python o Go — dipende dal
> problema. La cosa che mi piace di più è il momento in cui un
> pezzo di codice, dopo ore di tentativi, finalmente fa quello
> che deve fare.
>
> Hai mai pensato che imparare a programmare fosse troppo
> difficile per te? Bene, ti dico una cosa: il novanta per cento
> delle persone che ce la fanno sono partite esattamente da dove
> sei tu adesso. Non è una questione di talento, è una questione
> di metodo e di pratica.
>
> In questo corso scriviamo codice insieme, lezione dopo lezione.
> Ogni passo aggiunge un pezzo a un progetto vero, che alla fine
> potrai pubblicare online. Niente video passivi, niente esercizi
> scollegati. Pronto? Cominciamo.

---

## Tips per la qualità del clone

- **Varia leggermente il tono fra le frasi** — la prima è
  presentazione (calma), la seconda è descrittiva (regolare),
  la terza è una domanda (curva ascendente alla fine), la quarta
  è incoraggiante (calore), la quinta è un invito (energia).
  XTTS userà tutta questa palette nelle lezioni generate.

- **Pronuncia naturalmente** "HTML", "CSS", "JavaScript", "React",
  "Python", "Go", "AI" come li dici sempre. Il cleaner del batch
  poi sostituirà le forme scritte con la pronuncia fonetica
  italiana ("acca ti emme elle" eccetera) — il tuo sample serve
  per la voce, non per il dizionario.

- **Niente sussurri o urla**. Resta nel range medio del tuo parlato
  normale. Le inflessioni emotive devono restare percepibili ma
  contenute, altrimenti XTTS clonerà un tono distorto.

- **Una sola take**. Se sbagli una parola, va bene — vai avanti come
  se nulla fosse. Le piccole imperfezioni umane aiutano il modello
  a sentire la voce "vera". Se invece tossisci o c'è un rumore di
  fondo forte, ricomincia.

## Dopo aver registrato

Sostituisci il vecchio `voce-luca.wav` con il nuovo file e rilancia
il sample:

```bash
source .venv-voice/bin/activate
python scripts/clone-voice-batch.py \
    --sample voce-luca.wav \
    --only primo-sito/1 \
    --mp3 \
    --accept-cpml
```

Se il `voce-luca` nuovo è in formato `.m4a` invece di `.wav`,
puoi convertirlo prima:

```bash
ffmpeg -i voce-luca.m4a -ac 1 -ar 22050 voce-luca.wav
```

Il batch supporta anche `.m4a` direttamente (il --sample accetta
qualunque formato che ffmpeg sappia leggere), ma WAV mono 22kHz è
quello che XTTS preferisce internamente.
