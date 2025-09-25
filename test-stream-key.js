// Test diretto per API stream key Twitch
// Polyfill per fetch su Node.js 16 (stesso del server)
if (typeof fetch === 'undefined') {
    global.fetch = async (url, options = {}) => {
        const https = require('https');
        const http = require('http');
        const { URLSearchParams } = require('url');

        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https:') ? https : http;
            const isPost = options.method === 'POST';

            const requestOptions = {
                method: options.method || 'GET',
                headers: options.headers || {}
            };

            if (isPost && options.body) {
                if (options.body instanceof URLSearchParams) {
                    requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                } else {
                    requestOptions.headers['Content-Type'] = 'application/json';
                }
            }

            const req = protocol.request(url, requestOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode,
                        json: () => Promise.resolve(JSON.parse(data)),
                        text: () => Promise.resolve(data)
                    });
                });
            });

            req.on('error', reject);

            if (isPost && options.body) {
                req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
            }

            req.end();
        });
    };
}

async function testStreamKey() {
    // Dati reali di missfaffina
    const access_token = '36yuwp3400ylsxg7l2l7tv6kspi7ay';
    const client_id = 'z4biuqej0vl2eie6rjmnvme1ysmemm';
    const user_id = '1095592472';

    console.log('🔍 Test validazione token...');

    try {
        // 1. Valida il token
        const validateResponse = await fetch('https://id.twitch.tv/oauth2/validate', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (!validateResponse.ok) {
            throw new Error(`Token validation failed: ${validateResponse.status}`);
        }

        const tokenData = await validateResponse.json();
        console.log('✅ Token valido!');
        console.log('📋 Scopes disponibili:', tokenData.scopes);
        console.log('👤 User ID nel token:', tokenData.user_id);
        console.log('🏢 Client ID nel token:', tokenData.client_id);

        // 2. Controlla se ha lo scope necessario
        if (!tokenData.scopes.includes('channel:manage:broadcast')) {
            throw new Error('❌ Scope "channel:manage:broadcast" mancante!');
        }
        console.log('✅ Scope channel:manage:broadcast presente');

        // 3. Prova a ottenere la stream key
        console.log('\n🔑 Test richiesta stream key...');
        const streamKeyResponse = await fetch(`https://api.twitch.tv/helix/streams/key?broadcaster_id=${user_id}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': client_id
            }
        });

        console.log(`📡 Status response: ${streamKeyResponse.status}`);

        if (!streamKeyResponse.ok) {
            const errorText = await streamKeyResponse.text();
            throw new Error(`Stream key API failed: ${streamKeyResponse.status} - ${errorText}`);
        }

        const keyData = await streamKeyResponse.json();
        console.log('✅ Stream key ottenuta con successo!');
        console.log('🔑 Dati stream:', keyData);

        if (keyData.data && keyData.data[0]) {
            console.log('🎯 Stream key disponibile:', keyData.data[0].stream_key ? '✅ SÌ' : '❌ NO');
        }

    } catch (error) {
        console.error('❌ Errore:', error.message);
    }
}

console.log('🧪 ISTRUZIONI:');
console.log('1. Vai su https://stardewoverlay.onrender.com/direct-stream.html');
console.log('2. Fai login con Twitch');
console.log('3. Apri Developer Tools (F12)');
console.log('4. In Console, esegui: localStorage.getItem("twitch_data")');
console.log('5. Copia i valori access_token, client_id, user_id qui sopra');
console.log('6. Esegui: node test-stream-key.js\n');

testStreamKey();