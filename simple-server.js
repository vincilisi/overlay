// 🚀 ULTRA MINIMAL SERVER con OAuth per RENDER
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware basics
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

// Store temporaneo per le sessioni
const authStore = new Map();

// Configurazione OAuth dinamica (gestita dal frontend)
function getTwitchConfig(clientId, clientSecret) {
    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    return {
        CLIENT_ID: clientId,
        CLIENT_SECRET: clientSecret,
        REDIRECT_URI: `${baseUrl}/auth/twitch/callback`
    };
}

// === TWITCH AUTHENTICATION ===

// Inizia autenticazione Twitch
app.get('/auth/twitch', (req, res) => {
    const { client_id, client_secret } = req.query;
    
    if (!client_id) {
        return res.status(400).send('❌ Client ID Twitch mancante. Configura le API keys nell\'overlay!');
    }
    
    const TWITCH_CONFIG = getTwitchConfig(client_id, client_secret);
    const scopes = 'user:read:email channel:read:stream_key channel:edit:commercial';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CONFIG.CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITCH_CONFIG.REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}`;

    console.log('🔗 Reindirizzamento a Twitch Auth:', authUrl);
    res.redirect(authUrl);
});

// Callback Twitch
app.get('/auth/twitch/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
        return res.status(400).send('❌ Codice di autorizzazione mancante');
    }

    try {
        console.log('🔄 Scambio codice Twitch per token...');

        // Per client-side OAuth, restituiamo il codice al frontend
        res.send(`
            <html>
                <head><title>Twitch Auth - Processing...</title></head>
                <body style="font-family: Arial; text-align: center; padding: 50px; background: #9146ff; color: white;">
                    <h2>🔄 Processando autenticazione Twitch...</h2>
                    <p>Chiusura automatica in corso...</p>
                    <script>
                        // Comunica il codice al parent window per client-side processing
                        window.opener.postMessage({
                            type: 'auth_code',
                            platform: 'twitch',
                            code: '${code}',
                            state: '${state || ''}'
                        }, '*');
                        setTimeout(() => window.close(), 2000);
                    </script>
                </body>
            </html>
        `);

    } catch (error) {
        console.error('❌ Errore autenticazione Twitch:', error.message);
        res.status(500).send('❌ Errore durante l\'autenticazione Twitch');
    }
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

// Utility function
function generateSessionId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Start
app.listen(PORT, () => {
    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    console.log(`🚀 MEGA SERVER con OAuth su ${baseUrl}`);
    console.log(`🌍 Health check: ${baseUrl}/health`);
    console.log(`🎮 Live Platform: ${baseUrl}/live`);
    console.log('');
    console.log('✅ OAuth Twitch supportato!');
    console.log('🔧 Configura Client ID/Secret nell\'overlay per usare Twitch');
});