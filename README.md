# 🌱 Stardew Valley Overlay per Streamlabs/OBS

Un overlay interattivo per stream di Stardew Valley con pannello di controllo.

## 📁 File per Netlify

- **`index-netlify.html`** → Rinomina in `index.html` (pagina overlay)
- **`controllo-netlify.html`** → Rinomina in `controllo.html` (pannello controllo)
- **`style.css`** → File CSS (mantieni nome)
- **`main.js`** → File JavaScript (mantieni nome)
- **`configurator.js`** → File JavaScript (mantieni nome)

## 🚀 Come usare con Netlify

### 1. Preparazione file
1. Rinomina `index-netlify.html` → `index.html`
2. Rinomina `controllo-netlify.html` → `controllo.html`
3. Carica tutti i file su Netlify

### 2. Configurazione Streamlabs/OBS
1. Aggiungi **Browser Source**
2. URL: `https://tuosito.netlify.app/index.html`
3. Risoluzione: 1920x1080
4. ✅ Disabilita "Shutdown source when not visible"

### 3. Controllo dell'overlay
1. Apri: `https://tuosito.netlify.app/controllo.html`
2. Modifica i valori (semi, monete, ricette, etc.)
3. I cambiamenti si vedono automaticamente nell'overlay

## ✨ Funzionalità

- **Statistiche dinamiche**: Semi, monete, livello farming
- **Tempo e stagione**: Icone meteo, data, temperatura  
- **Ricetta del giorno**: Piatto e ingredienti
- **Notifiche animate**: Follow, donazioni, subscriber
- **Controllo real-time**: Pannello di controllo separato

## 🔧 Modalità di funzionamento

Questo overlay funziona tramite **LocalStorage** del browser:
- I dati vengono salvati localmente nel browser
- L'overlay si aggiorna automaticamente ogni secondo
- Non serve server esterno (perfetto per Netlify)

## 🎮 Come usare durante lo stream

1. **Prima dello stream**: Configura i valori iniziali nel pannello controllo
2. **Durante lo stream**: 
   - Tieni aperto il pannello controllo in una scheda
   - Aggiorna i valori quando necessario
   - L'overlay si aggiorna automaticamente
3. **Notifiche**: Usa i pulsanti rapidi per follow/donazioni

## 📱 Compatibilità

- ✅ Streamlabs OBS
- ✅ OBS Studio  
- ✅ XSplit
- ✅ Tutti i browser moderni

---

**Creato per il canale Twitch di [Nome]** 🎮✨