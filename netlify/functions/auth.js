const axios = require('axios');

// Configurazione OAuth
const TWITCH_CONFIG = {
    CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
    REDIRECT_URI: process.env.NETLIFY_URL + '/auth/twitch/callback'
};

const TIKTOK_CONFIG = {
    CLIENT_KEY: process.env.TIKTOK_CLIENT_KEY,
    CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET, 
    REDIRECT_URI: process.env.NETLIFY_URL + '/auth/tiktok/callback'
};

exports.handler = async (event, context) => {
    const { httpMethod, path, queryStringParameters, body } = event;
    
    // Headers CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };
    
    if (httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    console.log('🔗 Netlify Function chiamata:', httpMethod, path);
    
    try {
        // Routing basato su path
        if (path.includes('/auth/twitch/callback')) {
            return await handleTwitchCallback(queryStringParameters, headers);
        }
        
        if (path.includes('/auth/tiktok/callback')) {
            return await handleTikTokCallback(queryStringParameters, headers);
        }
        
        if (path.includes('/auth/twitch')) {
            return handleTwitchAuth(headers);
        }
        
        if (path.includes('/auth/tiktok')) {
            return handleTikTokAuth(headers);
        }
        
        if (path.includes('/api/stream/') && httpMethod === 'POST') {
            const requestBody = JSON.parse(body || '{}');
            return await handleStreamAPI(path, requestBody, headers);
        }
        
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Endpoint non trovato' })
        };
        
    } catch (error) {
        console.error('❌ Errore Netlify Function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

// Gestione auth Twitch
function handleTwitchAuth(headers) {
    const scopes = 'channel:manage:broadcast user:read:email user:read:subscriptions';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CONFIG.CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITCH_CONFIG.REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}`;
    
    return {
        statusCode: 302,
        headers: {
            ...headers,
            'Location': authUrl
        },
        body: ''
    };
}

// Callback Twitch
async function handleTwitchCallback(query, headers) {
    const { code } = query;
    
    if (!code) {
        return {
            statusCode: 400,
            headers,
            body: 'Codice autorizzazione mancante'
        };
    }
    
    try {
        // Scambia codice per token
        const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: TWITCH_CONFIG.CLIENT_ID,
            client_secret: TWITCH_CONFIG.CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: TWITCH_CONFIG.REDIRECT_URI
        });
        
        const { access_token } = tokenResponse.data;
        
        // Ottieni dati utente
        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': TWITCH_CONFIG.CLIENT_ID
            }
        });
        
        const userData = userResponse.data.data[0];
        const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        // Salva in localStorage del browser (tramite script)
        const htmlResponse = `
            <html>
                <head><title>Twitch Collegato!</title></head>
                <body style="font-family: Arial; text-align: center; padding: 50px; background: #9146ff; color: white;">
                    <h2>🎉 Twitch Collegato con Successo!</h2>
                    <p>Benvenuto/a <strong>${userData.display_name}</strong>!</p>
                    <p>Puoi chiudere questa finestra.</p>
                    <script>
                        // Salva dati in localStorage
                        localStorage.setItem('twitch_auth', JSON.stringify({
                            sessionId: '${sessionId}',
                            access_token: '${access_token}',
                            user: ${JSON.stringify(userData)},
                            timestamp: ${Date.now()}
                        }));
                        
                        // Comunica al parent
                        window.opener.postMessage({
                            type: 'auth_success',
                            platform: 'twitch',
                            sessionId: '${sessionId}',
                            user: ${JSON.stringify(userData)}
                        }, '*');
                        
                        setTimeout(() => window.close(), 2000);
                    </script>
                </body>
            </html>
        `;
        
        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'text/html'
            },
            body: htmlResponse
        };
        
    } catch (error) {
        console.error('❌ Errore callback Twitch:', error);
        return {
            statusCode: 500,
            headers,
            body: 'Errore autenticazione Twitch'
        };
    }
}

// Gestione auth TikTok (simile a Twitch)
function handleTikTokAuth(headers) {
    const scopes = 'user.info.basic,video.list,live.room.info';
    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CONFIG.CLIENT_KEY}&redirect_uri=${encodeURIComponent(TIKTOK_CONFIG.REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}`;
    
    return {
        statusCode: 302,
        headers: {
            ...headers,
            'Location': authUrl
        },
        body: ''
    };
}

async function handleTikTokCallback(query, headers) {
    // Implementazione simile a Twitch
    return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'text/html' },
        body: '<h1>TikTok Auth - Coming Soon!</h1>'
    };
}

async function handleStreamAPI(path, body, headers) {
    // Simulazione API streaming
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            success: true,
            message: 'Stream configurato (demo)',
            rtmp_url: 'rtmp://demo.example.com/live',
            stream_key: 'demo_key_123'
        })
    };
}