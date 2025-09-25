/**
 * WEBRTC DIRECT STREAMING CONTROLLER
 * Gestisce streaming diretto dal browser a Twitch senza OBS
 */

class WebRTCStreamController {
    constructor(config = {}) {
        this.config = {
            video: {
                width: { ideal: 1920, max: 1920 },
                height: { ideal: 1080, max: 1080 },
                frameRate: { ideal: 30, max: 60 }
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            },
            bitrate: 6000000, // 6 Mbps per 1080p
            ...config
        };

        this.mediaRecorder = null;
        this.mediaStream = null;
        this.isRecording = false;
        this.chunks = [];
        this.stats = {
            startTime: null,
            bytesTransferred: 0,
            framesRecorded: 0,
            quality: '1080p'
        };

        this.eventHandlers = {};

        console.log('🎮 WebRTC Stream Controller inizializzato');
    }

    // Event handler registration
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

    // Ottieni permessi e setup stream
    async setupStream(options = {}) {
        try {
            console.log('🎥 Richiedendo accesso a schermo e audio...');

            // Screen capture con audio del sistema
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    ...this.config.video,
                    ...options.video
                },
                audio: true // Audio del sistema/schermo
            });

            // Ottieni anche microfono se richiesto
            let micStream = null;
            if (options.includeMicrophone !== false) {
                try {
                    micStream = await navigator.mediaDevices.getUserMedia({
                        audio: this.config.audio,
                        video: false
                    });
                } catch (err) {
                    console.warn('⚠️ Microfono non disponibile:', err.message);
                }
            }

            // Combina audio stream se abbiamo entrambi
            if (micStream && screenStream.getAudioTracks().length > 0) {
                const audioContext = new AudioContext();
                const destination = audioContext.createMediaStreamDestination();

                // Mix audio del sistema e microfono
                const systemAudio = audioContext.createMediaStreamSource(screenStream);
                const micAudio = audioContext.createMediaStreamSource(micStream);

                systemAudio.connect(destination);
                micAudio.connect(destination);

                // Sostituisci audio track
                screenStream.getAudioTracks().forEach(track => track.stop());
                screenStream.removeTrack(screenStream.getAudioTracks()[0]);
                destination.stream.getAudioTracks().forEach(track => {
                    screenStream.addTrack(track);
                });
            } else if (micStream) {
                // Solo microfono se non abbiamo audio del sistema
                screenStream.getAudioTracks().forEach(track => track.stop());
                micStream.getAudioTracks().forEach(track => {
                    screenStream.addTrack(track);
                });
            }

            this.mediaStream = screenStream;

            console.log('✅ Stream configurato:', {
                video: screenStream.getVideoTracks().length > 0,
                audio: screenStream.getAudioTracks().length > 0,
                tracks: screenStream.getTracks().length
            });

            this.emit('streamReady', {
                stream: this.mediaStream,
                hasVideo: screenStream.getVideoTracks().length > 0,
                hasAudio: screenStream.getAudioTracks().length > 0
            });

            return this.mediaStream;

        } catch (error) {
            console.error('❌ Errore setup stream:', error);
            this.emit('error', { type: 'setup', error: error.message });
            throw error;
        }
    }

    // Avvia registrazione per streaming
    async startRecording(format = 'webm') {
        if (!this.mediaStream) {
            throw new Error('Stream non configurato - chiama setupStream() prima');
        }

        if (this.isRecording) {
            console.warn('⚠️ Registrazione già in corso');
            return;
        }

        try {
            console.log('🔴 Avvio registrazione stream...');

            // Configura MediaRecorder
            const options = {
                mimeType: this.getSupportedMimeType(format),
                videoBitsPerSecond: this.config.bitrate,
                audioBitsPerSecond: 128000 // 128 kbps per audio
            };

            this.mediaRecorder = new MediaRecorder(this.mediaStream, options);
            this.chunks = [];
            this.stats.startTime = Date.now();
            this.stats.bytesTransferred = 0;
            this.stats.framesRecorded = 0;

            // Event handlers
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    this.chunks.push(event.data);
                    this.stats.bytesTransferred += event.data.size;
                    this.stats.framesRecorded++;

                    this.emit('dataChunk', {
                        chunk: event.data,
                        size: event.data.size,
                        totalSize: this.stats.bytesTransferred,
                        frameCount: this.stats.framesRecorded
                    });

                    // Simula invio a server (placeholder)
                    this.sendToServer(event.data);
                }
            };

            this.mediaRecorder.onstart = () => {
                this.isRecording = true;
                console.log('✅ Registrazione avviata');
                this.emit('recordingStart', { timestamp: Date.now() });
            };

            this.mediaRecorder.onstop = () => {
                this.isRecording = false;
                console.log('🛑 Registrazione fermata');
                this.emit('recordingStop', {
                    timestamp: Date.now(),
                    duration: Date.now() - this.stats.startTime,
                    totalBytes: this.stats.bytesTransferred
                });
            };

            this.mediaRecorder.onerror = (error) => {
                console.error('❌ Errore MediaRecorder:', error);
                this.emit('error', { type: 'recording', error: error.error });
            };

            // Start con time slice per streaming real-time
            this.mediaRecorder.start(1000); // Chunk ogni secondo

            console.log('🚀 Streaming live iniziato');

        } catch (error) {
            console.error('❌ Errore start recording:', error);
            this.emit('error', { type: 'startRecording', error: error.message });
            throw error;
        }
    }

    // Ferma registrazione
    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) {
            console.warn('⚠️ Nessuna registrazione da fermare');
            return;
        }

        console.log('🛑 Fermando registrazione...');
        this.mediaRecorder.stop();

        // Stop tutti i track per liberare risorse
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => {
                track.stop();
                console.log(`🔇 Track fermato: ${track.kind}`);
            });
        }
    }

    // Invia chunk al server (placeholder per RTMP bridge)
    async sendToServer(chunk) {
        try {
            // In un implementation reale, questo manderebbe a un server RTMP
            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('timestamp', Date.now());
            formData.append('quality', this.stats.quality);

            // Placeholder call
            await fetch('/api/direct-stream/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chunkSize: chunk.size,
                    quality: this.stats.quality,
                    timestamp: Date.now()
                })
            });

        } catch (error) {
            console.warn('⚠️ Errore invio chunk:', error.message);
        }
    }

    // Ottieni MIME type supportato
    getSupportedMimeType(format) {
        const types = [
            `video/${format};codecs=vp9,opus`,
            `video/${format};codecs=vp8,opus`,
            `video/${format};codecs=h264,aac`,
            `video/${format}`
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                console.log('📹 MIME type selezionato:', type);
                return type;
            }
        }

        console.warn('⚠️ Nessun MIME type specifico supportato, uso predefinito');
        return '';
    }

    // Cambia qualità stream
    async changeQuality(quality) {
        const qualities = {
            '480p': { width: 854, height: 480, bitrate: 2000000 },
            '720p': { width: 1280, height: 720, bitrate: 4000000 },
            '1080p': { width: 1920, height: 1080, bitrate: 6000000 }
        };

        if (!qualities[quality]) {
            throw new Error(`Qualità ${quality} non supportata`);
        }

        const wasRecording = this.isRecording;

        if (wasRecording) {
            this.stopRecording();
        }

        this.config.video.width = { ideal: qualities[quality].width };
        this.config.video.height = { ideal: qualities[quality].height };
        this.config.bitrate = qualities[quality].bitrate;
        this.stats.quality = quality;

        console.log(`📺 Qualità cambiata a ${quality}`);
        this.emit('qualityChange', { quality, config: qualities[quality] });

        if (wasRecording) {
            await this.setupStream();
            await this.startRecording();
        }
    }

    // Ottieni statistiche streaming
    getStats() {
        const runtime = this.stats.startTime ? Date.now() - this.stats.startTime : 0;
        const mbTransferred = (this.stats.bytesTransferred / 1024 / 1024).toFixed(2);
        const avgBitrate = runtime > 0 ? (this.stats.bytesTransferred * 8 / runtime * 1000 / 1024 / 1024).toFixed(2) : 0;

        return {
            ...this.stats,
            runtime: runtime,
            runtimeFormatted: this.formatDuration(runtime),
            mbTransferred: parseFloat(mbTransferred),
            avgBitrateMbps: parseFloat(avgBitrate),
            isActive: this.isRecording,
            hasStream: !!this.mediaStream
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
        console.log('🧹 Cleanup WebRTC controller...');

        this.stopRecording();

        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

        this.mediaRecorder = null;
        this.chunks = [];
        this.eventHandlers = {};

        console.log('✅ WebRTC controller pulito');
    }
}

// Global utility
window.WebRTCStreamController = WebRTCStreamController;

console.log('🎮 WebRTC Stream Controller caricato');