// 🚀 ULTRA STABLE SERVER per RENDER
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Solo middleware di base (no dipendenze esterne)
app.use(express.static(__dirname));
app.use(express.json());

// CORS manuale (senza dipendenza)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});

// === TWITCH AUTHENTICATION (SEMPLIFICATO) ===

// Redirect per Twitch (senza dipendenze esterne)
app.get('/auth/twitch', (req, res) => {
    const { client_id } = req.query;
    
    if (!client_id) {
        return res.status(400).send(`
            <html>
                <body style="font-family: Arial; text-align: center; padding: 50px; background: #ff4444; color: white;">
                    <h2>❌ Configurazione Mancante</h2>
                    <p>Client ID Twitch non trovato!</p>
                    <p>Configura le API keys nell'overlay.</p>
                    <script>setTimeout(() => window.close(), 3000);</script>
                </body>
            </html>
        `);
    }
    
    // Crea URL di redirect semplice
    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    const redirectUri = encodeURIComponent(`${baseUrl}/auth/twitch/callback`);
    const scopes = encodeURIComponent('user:read:email');
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
    
    console.log('🔗 Twitch Auth URL:', authUrl);
    res.redirect(authUrl);
});

// Callback Twitch (semplificato)
app.get('/auth/twitch/callback', (req, res) => {
    const { code, error } = req.query;
    
    if (error) {
        return res.send(`
            <html>
                <body style="font-family: Arial; text-align: center; padding: 50px; background: #ff4444; color: white;">
                    <h2>❌ Errore Twitch</h2>
                    <p>Errore: ${error}</p>
                    <script>setTimeout(() => window.close(), 3000);</script>
                </body>
            </html>
        `);
    }
    
    if (!code) {
        return res.send(`
            <html>
                <body style="font-family: Arial; text-align: center; padding: 50px; background: #ff4444; color: white;">
                    <h2>❌ Codice Mancante</h2>
                    <p>Nessun codice di autorizzazione ricevuto.</p>
                    <script>setTimeout(() => window.close(), 3000);</script>
                </body>
            </html>
        `);
    }
    
    // Successo - passa il codice al client
    res.send(`
        <html>
            <head><title>Twitch - Successo!</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px; background: #9146ff; color: white;">
                <h2>🎉 Twitch Collegato!</h2>
                <p>Chiusura automatica...</p>
                <script>
                    try {
                        window.opener.postMessage({
                            type: 'auth_code',
                            platform: 'twitch',
                            code: '${code}',
                            success: true
                        }, '*');
                    } catch(e) {
                        console.error('Errore comunicazione:', e);
                    }
                    setTimeout(() => window.close(), 2000);
                </script>
            </body>
        </html>
    `);
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Stardew Overlay MEGA PERFORMANCE with OAuth!',
        timestamp: new Date().toISOString()
    });
});

// Root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Live platform
app.get('/live', (req, res) => {
    res.sendFile(path.join(__dirname, 'live-client.html'));
});

// Start server (con error handling)
app.listen(PORT, () => {
    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    console.log(`🚀 STABLE SERVER avviato su ${baseUrl}`);
    console.log(`🌍 Health: ${baseUrl}/health`);
    console.log(`🎮 Live: ${baseUrl}/live`);
    console.log(`🔐 Auth: ${baseUrl}/auth/twitch`);
    console.log('✅ Server stabile e funzionante!');
}).on('error', (err) => {
    console.error('❌ Errore server:', err.message);
    process.exit(1);
});