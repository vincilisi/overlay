// Configuratore Overlay Stardew Valley
// Questo file ti permette di adattare facilmente l'overlay

class OverlayConfigurator {
    constructor() {
        this.currentMode = 'normal';
        this.currentTheme = 'default';
        this.init();
    }

    init() {
        // Aggiungi controlli URL per configurazione automatica
        this.checkURLParams();

        // Aggiungi controlli keyboard per test rapidi
        this.addKeyboardControls();

        console.log('🎛️ Configuratore Overlay attivo!');
        console.log('📝 Usa i parametri URL o i tasti per cambiare modalità');
    }

    checkURLParams() {
        const urlParams = new URLSearchParams(window.location.search);

        // Modalità: ?mode=compact / minimal / seeds-only / browser
        const mode = urlParams.get('mode');
        if (mode) this.setMode(mode);

        // Tema: ?theme=dark / christmas
        const theme = urlParams.get('theme');
        if (theme) this.setTheme(theme);

        // Scala: ?scale=0.8
        const scale = urlParams.get('scale');
        if (scale) this.setScale(parseFloat(scale));

        // Risoluzione: ?resolution=720p / 1080p
        const resolution = urlParams.get('resolution');
        if (resolution) this.setResolution(resolution);

        // Performance: ?performance=high
        const performance = urlParams.get('performance');
        if (performance === 'high') this.setPerformanceMode(true);
    }

    addKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + tasti per controlli rapidi
            if (e.ctrlKey) {
                switch (e.key) {
                    case '1': this.setMode('normal'); break;
                    case '2': this.setMode('compact'); break;
                    case '3': this.setMode('minimal'); break;
                    case '4': this.setMode('seeds-only'); break;
                    case 't': this.cycleTheme(); break;
                    case 'p': this.togglePerformanceMode(); break;
                    case 'r': this.cycleResolution(); break;
                    case 'h': this.showHelp(); break;
                }
                e.preventDefault();
            }
        });
    }

    setMode(mode) {
        const body = document.body;

        // Rimuovi modalità precedenti
        body.classList.remove('overlay-compact', 'overlay-minimal', 'overlay-seeds-only', 'overlay-browser');

        // Aggiungi nuova modalità
        switch (mode) {
            case 'compact':
                body.classList.add('overlay-compact');
                console.log('🔄 Modalità: Compatta');
                break;
            case 'minimal':
                body.classList.add('overlay-minimal');
                console.log('🔄 Modalità: Minimale');
                break;
            case 'seeds-only':
                body.classList.add('overlay-seeds-only');
                console.log('🔄 Modalità: Solo Semi');
                break;
            case 'browser':
                body.classList.add('overlay-browser');
                console.log('🔄 Modalità: Browser (Fit-to-window)');
                break;
            default:
                console.log('🔄 Modalità: Normale');
        }

        this.currentMode = mode;
    }

    setTheme(theme) {
        const body = document.body;

        // Rimuovi temi precedenti
        body.classList.remove('theme-dark', 'theme-christmas');

        // Aggiungi nuovo tema
        switch (theme) {
            case 'dark':
                body.classList.add('theme-dark');
                console.log('🎨 Tema: Scuro');
                break;
            case 'christmas':
                body.classList.add('theme-christmas');
                console.log('🎨 Tema: Natalizio');
                break;
            default:
                console.log('🎨 Tema: Default');
        }

        this.currentTheme = theme;
    }

    setScale(scale) {
        const container = document.querySelector('.overlay-container');
        if (container) {
            container.style.transform = `scale(${scale})`;
            container.style.transformOrigin = 'top left';
            console.log(`📏 Scala: ${scale * 100}%`);
        }
    }

    setResolution(resolution) {
        const body = document.body;

        switch (resolution) {
            case '720p':
                body.style.width = '1280px';
                body.style.height = '720px';
                console.log('📺 Risoluzione: 720p');
                break;
            case '1080p':
                body.style.width = '1920px';
                body.style.height = '1080px';
                console.log('📺 Risoluzione: 1080p');
                break;
            case '1440p':
                body.style.width = '2560px';
                body.style.height = '1440px';
                console.log('📺 Risoluzione: 1440p');
                break;
        }
    }

    setPerformanceMode(enabled) {
        const body = document.body;

        if (enabled) {
            body.classList.add('performance-mode');
            console.log('⚡ Modalità Performance: ON');
        } else {
            body.classList.remove('performance-mode');
            console.log('⚡ Modalità Performance: OFF');
        }
    }

    cycleTheme() {
        const themes = ['default', 'dark', 'christmas'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        this.setTheme(nextTheme);
    }

    cycleResolution() {
        const resolutions = ['1080p', '720p', '1440p'];
        const currentRes = this.getCurrentResolution();
        const currentIndex = resolutions.indexOf(currentRes);
        const nextRes = resolutions[(currentIndex + 1) % resolutions.length];
        this.setResolution(nextRes);
    }

    getCurrentResolution() {
        const width = parseInt(document.body.style.width) || 1920;
        if (width <= 1280) return '720p';
        if (width <= 1920) return '1080p';
        return '1440p';
    }

    togglePerformanceMode() {
        const isEnabled = document.body.classList.contains('performance-mode');
        this.setPerformanceMode(!isEnabled);
    }

    showHelp() {
        console.log(`
🎛️ CONTROLLI OVERLAY STARDEW VALLEY

📱 PARAMETRI URL:
   ?mode=compact          - Modalità compatta
   ?mode=minimal          - Modalità minimale  
   ?mode=seeds-only       - Solo box semi
   ?theme=dark            - Tema scuro
   ?theme=christmas       - Tema natalizio
   ?scale=0.8             - Scala 80%
   ?resolution=720p       - Risoluzione 720p
   ?performance=high      - Modalità performance

⌨️ CONTROLLI TASTIERA (Ctrl + tasto):
   Ctrl+1  - Modalità normale
   Ctrl+2  - Modalità compatta
   Ctrl+3  - Modalità minimale
   Ctrl+4  - Solo semi
   Ctrl+T  - Cambia tema
   Ctrl+P  - Performance mode
   Ctrl+R  - Cambia risoluzione
   Ctrl+H  - Mostra aiuto

🔗 ESEMPI URL:
   localhost:8000?mode=compact&theme=dark
   localhost:8000?resolution=720p&performance=high
   localhost:8000?mode=seeds-only&scale=1.2
        `);
    }

    // Metodi per integrazione con Streamlabs/OBS
    getStreamlabsConfig() {
        return {
            url: window.location.href,
            width: parseInt(document.body.style.width) || 1920,
            height: parseInt(document.body.style.height) || 1080,
            css: `
                body { 
                    background: transparent !important; 
                    margin: 0 !important;
                    overflow: hidden !important;
                }
                .overlay-container {
                    background: transparent !important;
                }
            `
        };
    }

    exportConfig() {
        const config = {
            mode: this.currentMode,
            theme: this.currentTheme,
            resolution: this.getCurrentResolution(),
            performance: document.body.classList.contains('performance-mode'),
            scale: this.getCurrentScale()
        };

        console.log('📋 Configurazione corrente:', config);
        return config;
    }

    getCurrentScale() {
        const container = document.querySelector('.overlay-container');
        const transform = container.style.transform;
        const match = transform.match(/scale\(([\d.]+)\)/);
        return match ? parseFloat(match[1]) : 1;
    }
}

// Inizializza il configuratore
document.addEventListener('DOMContentLoaded', () => {
    window.overlayConfigurator = new OverlayConfigurator();
});

// Esporta per uso esterno
window.OverlayConfigurator = OverlayConfigurator;

function sendSafe(data) {
    if (typeof socket === 'undefined') {
        console.warn('❌ WebSocket non definito');
        return;
    }

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
    } else if (socket.readyState === WebSocket.CONNECTING) {
        console.warn('⏳ WebSocket in connessione, ritento...');
        setTimeout(() => sendSafe(data), 300);
    } else {
        console.error('❌ WebSocket non disponibile (chiuso o errore)');
    }
}


function inviaMessaggio(data) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
    } else {
        console.warn('⚠️ WebSocket non ancora pronto, ritento tra poco...');
        setTimeout(() => inviaMessaggio(data), 500);
    }
}

function aggiornaSemi(valore) {
    const messaggio = {
        type: 'updateSeeds',
        value: valore
    };
    inviaMessaggio(messaggio);
}

function mostraNotifica() {
    const messaggio = {
        type: 'showNotification'
    };
    inviaMessaggio(messaggio);
}

// Esempio diretto (non consigliato):
// socket.send(JSON.stringify({ type: 'updateSeeds', value: 42 }));
// Meglio:
// aggiornaSemi(42);


