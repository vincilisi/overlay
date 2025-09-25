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

// Callback Twitch (con token exchange reale)
app.get('/auth/twitch/callback', async (req, res) => {
    const { code, error, state } = req.query;

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

    try {
        // Estrai client_id e client_secret dallo state o URL
        const clientId = req.query.client_id || process.env.TWITCH_CLIENT_ID;
        const clientSecret = req.query.client_secret || process.env.TWITCH_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('Client ID o Secret mancanti');
        }

        console.log('🔄 Scambio codice per access token...');

        // Scambia il codice per un access token (usando fetch nativo di Node.js 18+)
        const tokenUrl = 'https://id.twitch.tv/oauth2/token';
        const tokenParams = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: `${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}/auth/twitch/callback`
        });

        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: tokenParams
        });

        if (!tokenResponse.ok) {
            throw new Error(`Token request failed: ${tokenResponse.status}`);
        }

        const tokenData = await tokenResponse.json();
        const { access_token, refresh_token } = tokenData;

        // Ottieni info utente
        const userResponse = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': clientId
            }
        });

        if (!userResponse.ok) {
            throw new Error(`User request failed: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        const user = userData.data[0];

        console.log('✅ Autenticazione Twitch completata per:', user.display_name);

        // Successo - passa i dati reali al client
        res.send(`
            <html>
                <head><title>Twitch - Collegato!</title></head>
                <body style="font-family: Arial; text-align: center; padding: 50px; background: #9146ff; color: white;">
                    <h2>🎉 Twitch Collegato con Successo!</h2>
                    <p>Benvenuto/a <strong>${user.display_name}</strong>!</p>
                    <p>Ora puoi andare live!</p>
                    <script>
                        try {
                            window.opener.postMessage({
                                type: 'auth_success',
                                platform: 'twitch',
                                access_token: '${access_token}',
                                refresh_token: '${refresh_token || ''}',
                                user: ${JSON.stringify(user)},
                                client_id: '${clientId}',
                                success: true
                            }, '*');
                            console.log('✅ Dati inviati al parent window');
                        } catch(e) {
                            console.error('Errore comunicazione:', e);
                        }
                        setTimeout(() => window.close(), 3000);
                    </script>
                </body>
            </html>
        `);

    } catch (error) {
        console.error('❌ Errore token exchange:', error.message);
        res.send(`
            <html>
                <body style="font-family: Arial; text-align: center; padding: 50px; background: #ff4444; color: white;">
                    <h2>❌ Errore Autenticazione</h2>
                    <p>${error.message}</p>
                    <p>Verifica le credenziali Twitch.</p>
                    <script>setTimeout(() => window.close(), 5000);</script>
                </body>
            </html>
        `);
    }
});// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Stardew Overlay MEGA PERFORMANCE with OAuth!',
        timestamp: new Date().toISOString()
    });
});

// Root - redirect to start page if available
app.get('/', (req, res) => {
    // Check if start-simple.html exists
    const fs = require('fs');
    const startPath = path.join(__dirname, 'start-simple.html');
    
    if (fs.existsSync(startPath)) {
        res.sendFile(startPath);
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Live platform
app.get('/live', (req, res) => {
    res.sendFile(path.join(__dirname, 'live-client.html'));
});

// Debug page
app.get('/debug', (req, res) => {
    res.sendFile(path.join(__dirname, 'debug-twitch.html'));
});

// Stream setup page
app.get('/stream-setup', (req, res) => {
    res.sendFile(path.join(__dirname, 'stream-setup.html'));
});

// Start page semplice (SEMPRE FUNZIONA)
app.get('/start', (req, res) => {
    res.sendFile(path.join(__dirname, 'start-simple.html'));
});

// Versione semplice
app.get('/simple', (req, res) => {
    res.sendFile(path.join(__dirname, 'live-simple.html'));
});

// === STREAM MANAGEMENT APIs ===

// Ottieni Stream Key Twitch
app.post('/api/twitch/stream-key', async (req, res) => {
    try {
        const { access_token, client_id, user_id } = req.body;

        if (!access_token || !client_id || !user_id) {
            return res.status(400).json({ error: 'Parametri mancanti' });
        }

        // Ottieni stream key dalle API Twitch
        const response = await fetch(`https://api.twitch.tv/helix/streams/key?broadcaster_id=${user_id}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': client_id
            }
        });

        if (!response.ok) {
            throw new Error(`Stream key request failed: ${response.status}`);
        }

        const data = await response.json();
        const streamKey = data.data[0]?.stream_key;

        if (!streamKey) {
            throw new Error('Stream key non disponibile');
        }

        res.json({
            success: true,
            stream_key: streamKey,
            rtmp_url: 'rtmp://live.twitch.tv/live/',
            instructions: [
                'Apri OBS Studio',
                'Vai in Impostazioni > Stream',
                'Servizio: Twitch',
                `URL Server: rtmp://live.twitch.tv/live/`,
                `Chiave Stream: ${streamKey}`,
                'Clicca "Avvia Streaming" in OBS'
            ]
        });

        console.log('✅ Stream key generata con successo');

    } catch (error) {
        console.error('❌ Errore stream key:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Aggiorna info stream Twitch
app.post('/api/twitch/update-stream', async (req, res) => {
    try {
        const { access_token, client_id, user_id, title, game_id } = req.body;

        if (!access_token || !client_id || !user_id) {
            return res.status(400).json({ error: 'Parametri mancanti' });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (game_id) updateData.game_id = game_id;

        const response = await fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${user_id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': client_id,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`Update stream failed: ${response.status}`);
        }

        res.json({ success: true, message: 'Stream info aggiornate' });
        console.log('✅ Stream info aggiornate');

    } catch (error) {
        console.error('❌ Errore update stream:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Stato stream corrente
app.post('/api/twitch/stream-status', async (req, res) => {
    try {
        const { access_token, client_id, user_id } = req.body;

        const response = await fetch(`https://api.twitch.tv/helix/streams?user_id=${user_id}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': client_id
            }
        });

        if (!response.ok) {
            throw new Error(`Stream status failed: ${response.status}`);
        }

        const data = await response.json();
        const stream = data.data[0];

        if (stream) {
            res.json({
                is_live: true,
                title: stream.title,
                game_name: stream.game_name,
                viewer_count: stream.viewer_count,
                started_at: stream.started_at,
                thumbnail_url: stream.thumbnail_url
            });
        } else {
            res.json({ is_live: false });
        }

    } catch (error) {
        console.error('❌ Errore stream status:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server funzionante con Stream APIs!',
        timestamp: new Date().toISOString(),
        endpoints: [
            '/ - Home',
            '/live - Live Platform',
            '/debug - Debug Twitch',
            '/health - Health Check',
            '/auth/twitch - Twitch Auth',
            'POST /api/twitch/stream-key - Get Stream Key',
            'POST /api/twitch/update-stream - Update Stream Info',
            'POST /api/twitch/stream-status - Check Stream Status'
        ]
    });
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