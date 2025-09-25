# 🎮 Stardew Valley Live Stream Platform

## 🚀 Setup Completo per Streaming Diretto

### 📋 Panoramica
Questa piattaforma ti permette di andare live direttamente su **Twitch** e **TikTok** con un overlay personalizzato di Stardew Valley, senza bisogno di OBS o altri software esterni!

### 🛠️ Setup Iniziale

#### 1. 📱 Configurazione App Twitch
1. Vai su [Twitch Developer Console](https://dev.twitch.tv/console)
2. Clicca "Create App"
3. Compila:
   - **Name**: `Stardew Overlay Live`
   - **OAuth Redirect URLs**: `http://localhost:3001/auth/twitch/callback`
   - **Category**: `Game Integration`
4. Salva il **Client ID** e **Client Secret**

#### 2. 🎵 Configurazione App TikTok  
1. Vai su [TikTok for Developers](https://developers.tiktok.com/)
2. Crea una nuova app
3. Configura:
   - **App Name**: `Stardew Live Stream`
   - **Redirect URI**: `http://localhost:3001/auth/tiktok/callback`
   - **Scopes**: `user.info.basic`, `live.room.info`
4. Salva il **Client Key** e **Client Secret**

#### 3. ⚙️ Configurazione Ambiente
1. Copia il file `.env.example` in `.env`:
   ```bash
   copy .env.example .env
   ```

2. Modifica `.env` con le tue chiavi:
   ```env
   TWITCH_CLIENT_ID=tuo_client_id_twitch
   TWITCH_CLIENT_SECRET=tuo_client_secret_twitch
   TIKTOK_CLIENT_KEY=tuo_client_key_tiktok
   TIKTOK_CLIENT_SECRET=tuo_client_secret_tiktok
   ```

### 🎯 Come Usare

#### 1. 🔧 Avvio Server
```bash
npm install
npm start
```

#### 2. 🌐 Accesso Platform
1. Apri: `http://localhost:3001/live`
2. Vedrai l'overlay Stardew Valley con il pannello streaming

#### 3. 🔗 Collegamento Account
1. **Twitch**: Clicca "Collega Twitch" → autorizza l'app
2. **TikTok**: Clicca "Collega TikTok" → autorizza l'app
3. Vedrai i tuoi account collegati ✅

#### 4. 🔴 Vai Live!
1. Configura:
   - **Titolo**: Es. "🌱 Stardew Valley Farm Tour!"
   - **Categoria**: Gaming
   - **Qualità**: 720p/1080p
2. Clicca **"VAI LIVE"**
3. Autorizza webcam/microfono
4. Sei in diretta su entrambe le piattaforme! 🎉

### 📊 Funzionalità

#### ✨ Overlay Interattivo
- 🌱 Informazioni farm (livello, monete, semi)
- 🍳 Ricetta del giorno
- 🌤️ Meteo di Stardew
- 🦋 Animazioni fluttuanti
- 🎉 Notifiche follower

#### 🎛️ Controlli Live
- 📊 Contatore spettatori real-time
- ⚙️ Cambio titolo/categoria al volo
- 🎥 Toggle webcam/audio
- 📱 Pannello di controllo separato

#### 🔄 Aggiornamenti Real-time
- LocalStorage per dati permanenti
- WebSocket per notifiche live
- URL parameters per condivisione

### 🌐 Deployment Online

#### Netlify (Raccomandato)
1. Push su GitHub:
   ```bash
   git add .
   git commit -m "🚀 Live Platform Setup"
   git push
   ```

2. Su Netlify:
   - Collega repository GitHub
   - Build command: `npm run build`
   - Publish directory: `./`
   - Configura Environment Variables con le tue chiavi

3. Aggiorna redirect URIs nelle app:
   - Twitch: `https://tuodominio.netlify.app/auth/twitch/callback`
   - TikTok: `https://tuodominio.netlify.app/auth/tiktok/callback`

### 🔧 Risoluzione Problemi

#### ❌ "Autenticazione Fallita"
- Verifica che le chiavi API siano corrette
- Controlla che gli URL di redirect corrispondano
- Assicurati che le app siano pubbliche (non in development)

#### 🎥 "Errore Webcam"
- Concedi i permessi per camera/microfono
- Controlla che nessun altro software stia usando la webcam
- Prova un browser diverso (Chrome raccomandato)

#### 📡 "Stream Non Si Avvia"
- Verifica la connessione internet
- Controlla che gli account siano collegati
- Riavvia il server se necessario

### 🎯 Utilizzo Avanzato

#### 📝 Personalizzazione Overlay
Modifica `style.css` per cambiare:
- Colori tema
- Posizione elementi
- Animazioni
- Font e dimensioni

#### 🔄 Aggiornamento Dati
Usa il pannello controllo (`/controllo.html`) per:
- Cambiare statistiche farm
- Aggiornare ricette
- Inviare notifiche
- Modificare meteo

#### 🎮 Integrazione Gioco
- Collega mod Stardew Valley per aggiornamenti automatici
- Usa webhook per eventi di gioco
- Integra con bot Twitch per comandi chat

### 📞 Supporto
- 🐛 **Bug**: Apri issue su GitHub
- 💡 **Suggerimenti**: Discussioni GitHub
- 📧 **Contatto**: [tuo-email]

### 🔄 Aggiornamenti
- Controlla GitHub per nuove versioni
- Leggi CHANGELOG per nuove funzionalità
- Backup configurazione prima di aggiornare

---

## 🎉 Divertiti a fare streaming!

Una volta configurato tutto, avrai una piattaforma di streaming professionale con overlay Stardew Valley completamente personalizzabile! 

**Buona fortuna con i tuoi stream! 🌱✨**