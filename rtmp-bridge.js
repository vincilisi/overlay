/**
 * RTMP STREAMING BRIDGE 
 * Converte WebRTC stream a formato compatibile con Twitch RTMP
 */

class RTMPStreamBridge {
    constructor(config = {}) {
        this.config = {
            rtmpUrl: 'rtmp://live.twitch.tv/live/',
            streamKey: null,
            quality: '720p',
            fps: 30,
            bitrate: 4000000,
            ...config
        };
        
        this.isConnected = false;
        this.chunks = [];
        this.stats = {
            startTime: null,
            chunksProcessed: 0,
            bytesStreamed: 0,
            errors: 0
        };
        
        this.eventHandlers = {};
        
        console.log('🌉 RTMP Bridge inizializzato per Twitch');
    }
    
    // Event system
    on(event, handler) {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    }
    
    emit(event, data) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].forEach(handler => handler(data));
        }
    }
    
    // Connetti a Twitch RTMP
    async connectToTwitch(streamKey) {
        try {
            console.log('🔗 Connessione a Twitch RTMP...');
            
            this.config.streamKey = streamKey;
            
            // Simula connessione RTMP (in production useresti ffmpeg o WebRTC-to-RTMP service)
            await this.simulateRTMPConnection();
            
            this.isConnected = true;
            this.stats.startTime = Date.now();
            
            console.log('✅ Connesso a Twitch RTMP');
            this.emit('connected', {
                rtmpUrl: this.config.rtmpUrl + streamKey.substring(0, 10) + '...',
                quality: this.config.quality
            });
            
            return true;
            
        } catch (error) {
            console.error('❌ Errore connessione RTMP:', error);
            this.emit('error', { type: 'connection', error: error.message });
            throw error;
        }
    }
    
    // Simula connessione RTMP (placeholder)
    async simulateRTMPConnection() {
        return new Promise((resolve) => {
            // Simula handshake RTMP
            setTimeout(() => {
                console.log('🤝 RTMP handshake completato');
                resolve();
            }, 1000);
        });
    }
    
    // Processa chunk WebRTC per RTMP
    async processWebRTCChunk(chunk) {
        if (!this.isConnected) {
            console.warn('⚠️ RTMP non connesso, chunk ignorato');
            return false;
        }
        
        try {
            // Converti chunk WebRTC in formato RTMP-compatibile
            const rtmpPacket = await this.convertToRTMPPacket(chunk);
            
            // Invia a Twitch (simulato)
            await this.sendToTwitch(rtmpPacket);
            
            // Aggiorna statistiche
            this.stats.chunksProcessed++;
            this.stats.bytesStreamed += chunk.size;
            
            this.emit('chunkProcessed', {
                chunkSize: chunk.size,
                totalChunks: this.stats.chunksProcessed,
                totalBytes: this.stats.bytesStreamed
            });
            
            return true;
            
        } catch (error) {
            console.error('❌ Errore processing chunk:', error);
            this.stats.errors++;
            this.emit('error', { type: 'processing', error: error.message });
            return false;
        }
    }
    
    // Converte WebRTC chunk in RTMP packet
    async convertToRTMPPacket(chunk) {
        // In una implementazione reale, useresti:
        // - FFmpeg.js per transcodifica
        // - WebCodecs API per encoding
        // - Librerie RTMP per packaging
        
        const rtmpPacket = {
            timestamp: Date.now(),
            type: 'video', // o 'audio'
            data: chunk,
            size: chunk.size,
            format: 'h264', // formato output
            quality: this.config.quality
        };
        
        console.log(`📦 RTMP packet creato: ${chunk.size} bytes`);
        return rtmpPacket;
    }
    
    // Invia packet a Twitch
    async sendToTwitch(packet) {
        // Simulazione invio RTMP
        // In produzione: connessione WebSocket o RTMP real-time
        
        console.log(`📡 Invio a Twitch: ${packet.size} bytes @ ${packet.quality}`);
        
        // Simula latenza di rete
        await new Promise(resolve => setTimeout(resolve, 10));
        
        return true;
    }
    
    // Disconnetti da Twitch
    async disconnect() {
        if (!this.isConnected) {
            console.log('⚠️ RTMP già disconnesso');
            return;
        }
        
        console.log('🔌 Disconnessione da Twitch RTMP...');
        
        this.isConnected = false;
        
        const duration = Date.now() - this.stats.startTime;
        const mbStreamed = (this.stats.bytesStreamed / 1024 / 1024).toFixed(2);
        
        console.log(`✅ RTMP disconnesso dopo ${Math.round(duration/1000)}s`);
        console.log(`📊 Statistiche: ${this.stats.chunksProcessed} chunks, ${mbStreamed} MB`);
        
        this.emit('disconnected', {
            duration: duration,
            chunksProcessed: this.stats.chunksProcessed,
            bytesStreamed: this.stats.bytesStreamed,
            errors: this.stats.errors
        });
    }
    
    // Ottieni statistiche bridge
    getStats() {
        const runtime = this.stats.startTime ? Date.now() - this.stats.startTime : 0;
        const mbStreamed = (this.stats.bytesStreamed / 1024 / 1024).toFixed(2);
        const avgThroughput = runtime > 0 ? (this.stats.bytesStreamed / runtime * 1000 / 1024).toFixed(2) : 0;
        
        return {
            ...this.stats,
            isConnected: this.isConnected,
            runtime: runtime,
            runtimeFormatted: this.formatDuration(runtime),
            mbStreamed: parseFloat(mbStreamed),
            avgThroughputKBps: parseFloat(avgThroughput),
            successRate: this.stats.chunksProcessed > 0 ? 
                ((this.stats.chunksProcessed - this.stats.errors) / this.stats.chunksProcessed * 100).toFixed(1) : 100
        };
    }
    
    // Format duration helper
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        } else {
            return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
        }
    }
    
    // Cleanup completo
    destroy() {
        console.log('🧹 Cleanup RTMP bridge...');
        
        if (this.isConnected) {
            this.disconnect();
        }
        
        this.chunks = [];
        this.eventHandlers = {};
        
        console.log('✅ RTMP bridge pulito');
    }
}

// Global utility
window.RTMPStreamBridge = RTMPStreamBridge;

console.log('🌉 RTMP Stream Bridge caricato');