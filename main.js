// Stardew Valley Twitch Overlay - JavaScript
class StardewOverlay {
    constructor() {
        this.stats = {
            level: 10,
            money: 999999,
            seeds: 42
        };

        this.recipes = [
            { icon: '🥗', name: 'Insalata di Stagione', ingredients: ['🥬 Lattuga', '🍅 Pomodoro', '🥒 Cetriolo'] },
            { icon: '🍲', name: 'Zuppa di Verdure', ingredients: ['🥕 Carote', '🧅 Cipolla', '🥔 Patate'] },
            { icon: '🥧', name: 'Torta di Mele', ingredients: ['🍎 Mele', '🥚 Uova', '🥛 Latte'] },
            { icon: '🍯', name: 'Miele Artesiano', ingredients: ['🐝 Miele', '🌻 Girasoli'] },
            { icon: '🧀', name: 'Formaggio Stellato', ingredients: ['🥛 Latte', '⭐ Qualità Stella'] }
        ];

        this.seasons = [
            { name: 'Primavera', icon: '🌸', temp: '22°C', color: '#4CAF50' },
            { name: 'Estate', icon: '☀️', temp: '28°C', color: '#FF9800' },
            { name: 'Autunno', icon: '🍂', temp: '18°C', color: '#FF5722' },
            { name: 'Inverno', icon: '❄️', temp: '8°C', color: '#2196F3' }
        ];

        this.currentSeason = 0;
        this.currentDay = 15;
        this.currentRecipe = 0;

        // Carica dati dal pannello di controllo
        this.loadControlPanelData();

        // Controlla aggiornamenti ogni 2 secondi
        setInterval(() => this.loadControlPanelData(), 2000);

        // Debug: mostra info nella console
        setInterval(() => {
            const data = localStorage.getItem('overlay-data');
            const timestamp = localStorage.getItem('overlay-data-timestamp');
            console.log('🔍 Check dati:', data ? 'Trovati' : 'Non trovati', timestamp);
        }, 5000);

        // Semi autentici di Stardew Valley per stagione
        this.stardewSeeds = {
            primavera: [
                { icon: '🥔', name: 'Semi di Patate', count: Math.floor(Math.random() * 20) + 1, price: '50g', days: '6 giorni' },
                { icon: '🥕', name: 'Semi di Pastinaca', count: Math.floor(Math.random() * 15) + 1, price: '20g', days: '4 giorni' },
                { icon: '🥬', name: 'Semi di Cavolo', count: Math.floor(Math.random() * 12) + 1, price: '80g', days: '6 giorni' },
                { icon: '🌷', name: 'Semi di Tulipano', count: Math.floor(Math.random() * 10) + 1, price: '20g', days: '6 giorni' },
                { icon: '🧄', name: 'Semi di Aglio', count: Math.floor(Math.random() * 8) + 1, price: '40g', days: '4 giorni' },
                { icon: '🥦', name: 'Semi di Cavolfiore', count: Math.floor(Math.random() * 6) + 1, price: '80g', days: '12 giorni' },
                { icon: '🌸', name: 'Semi di Fiore Jazz', count: Math.floor(Math.random() * 6) + 1, price: '30g', days: '7 giorni' },
                { icon: '🌾', name: 'Semi di Pisello', count: Math.floor(Math.random() * 18) + 1, price: '60g', days: '10 giorni' },
                { icon: '🥖', name: 'Semi di Ravanello', count: Math.floor(Math.random() * 25) + 1, price: '40g', days: '6 giorni' }
            ],
            estate: [
                { icon: '🍅', name: 'Semi di Pomodoro', count: Math.floor(Math.random() * 25) + 1, price: '50g', days: '11 giorni' },
                { icon: '🌽', name: 'Semi di Granturco', count: Math.floor(Math.random() * 18) + 1, price: '150g', days: '14 giorni' },
                { icon: '🥒', name: 'Semi di Cetriolo', count: Math.floor(Math.random() * 15) + 1, price: '80g', days: '13 giorni' },
                { icon: '🌶️', name: 'Semi di Peperone', count: Math.floor(Math.random() * 10) + 1, price: '40g', days: '5 giorni' },
                { icon: '🍆', name: 'Semi di Melanzana', count: Math.floor(Math.random() * 12) + 1, price: '20g', days: '5 giorni' },
                { icon: '🌻', name: 'Semi di Girasole', count: Math.floor(Math.random() * 8) + 1, price: '200g', days: '8 giorni' },
                { icon: '🥬', name: 'Semi di Cavolo Cappuccio', count: Math.floor(Math.random() * 14) + 1, price: '60g', days: '6 giorni' },
                { icon: '🍓', name: 'Semi di Fragola', count: Math.floor(Math.random() * 20) + 1, price: '100g', days: '13 giorni' },
                { icon: '🍺', name: 'Semi di Luppolo', count: Math.floor(Math.random() * 6) + 1, price: '60g', days: '11 giorni' },
                { icon: '🌺', name: 'Semi di Papavero', count: Math.floor(Math.random() * 9) + 1, price: '100g', days: '7 giorni' }
            ],
            autunno: [
                { icon: '🎃', name: 'Semi di Zucca', count: Math.floor(Math.random() * 15) + 1, price: '100g', days: '13 giorni' },
                { icon: '🌽', name: 'Semi di Mais', count: Math.floor(Math.random() * 16) + 1, price: '150g', days: '14 giorni' },
                { icon: '🥖', name: 'Semi di Grano', count: Math.floor(Math.random() * 30) + 1, price: '10g', days: '8 giorni' },
                { icon: '🍠', name: 'Semi di Patata Dolce', count: Math.floor(Math.random() * 12) + 1, price: '50g', days: '6 giorni' },
                { icon: '🍇', name: 'Grappolo d\'Uva', count: Math.floor(Math.random() * 5) + 1, price: '60g', days: '10 giorni' },
                { icon: '🥔', name: 'Semi di Barbabietola', count: Math.floor(Math.random() * 18) + 1, price: '20g', days: '6 giorni' },
                { icon: '🌰', name: 'Semi di Nocciola', count: Math.floor(Math.random() * 4) + 1, price: '90g', days: '28 giorni' },
                { icon: '🌹', name: 'Semi di Rosa', count: Math.floor(Math.random() * 8) + 1, price: '50g', days: '5 giorni' },
                { icon: '🍄', name: 'Semi di Fungo', count: Math.floor(Math.random() * 7) + 1, price: '150g', days: '10 giorni' },
                { icon: '🌾', name: 'Semi di Amaranto', count: Math.floor(Math.random() * 9) + 1, price: '70g', days: '7 giorni' }
            ],
            inverno: [
                { icon: '❄️', name: 'Semi Invernali', count: Math.floor(Math.random() * 5) + 1, price: '1000g', days: '28 giorni' },
                { icon: '🌨️', name: 'Radice Invernale', count: Math.floor(Math.random() * 3) + 1, price: '70g', days: '7 giorni' },
                { icon: '🌰', name: 'Semi di Cristallo', count: Math.floor(Math.random() * 4) + 1, price: '400g', days: '7 giorni' },
                { icon: '🎄', name: 'Semi di Pino', count: Math.floor(Math.random() * 2) + 1, price: '200g', days: '28 giorni' },
                { icon: '☃️', name: 'Frutta Ghiacciata', count: Math.floor(Math.random() * 6) + 1, price: '240g', days: '28 giorni' }
            ]
        };

        this.init();
    }

    init() {
        this.updateStats();
        this.updateRecipe();
        this.updateWeather();
        this.initializeSeedsBox();
        this.startAnimations();
        this.setupEventListeners();

        // Aggiorna elementi ogni 30 secondi
        setInterval(() => this.rotateContent(), 30000);

        // Simula notifiche casuali
        setInterval(() => this.showRandomNotification(), 45000);

        // Aggiorna giorno ogni 5 minuti (tempo accelerato)
        setInterval(() => this.advanceDay(), 300000);

        console.log('🌱 Stardew Valley Overlay inizializzato! 🌱');
    }

    updateStats() {
        // Aggiorna statistiche con piccole variazioni casuali
        this.stats.seeds += Math.floor(Math.random() * 3);
        this.stats.money += Math.floor(Math.random() * 1000);

        const levelElement = document.querySelector('.stat-item:nth-child(1) .stat-value');
        const moneyElement = document.querySelector('.stat-item:nth-child(2) .stat-value');
        const seedsElement = document.querySelector('.stat-item:nth-child(3) .stat-value');

        if (levelElement) levelElement.textContent = this.stats.level;
        if (moneyElement) moneyElement.textContent = this.formatMoney(this.stats.money);
        if (seedsElement) seedsElement.textContent = this.stats.seeds;
    }

    formatMoney(amount) {
        return new Intl.NumberFormat('it-IT').format(amount) + 'g';
    }

    updateRecipe() {
        const recipe = this.recipes[this.currentRecipe];
        const iconElement = document.querySelector('.recipe-icon');
        const nameElement = document.querySelector('.recipe-name');
        const ingredientsContainer = document.querySelector('.recipe-ingredients');

        if (iconElement) iconElement.textContent = recipe.icon;
        if (nameElement) nameElement.textContent = recipe.name;

        if (ingredientsContainer) {
            ingredientsContainer.innerHTML = '';
            recipe.ingredients.forEach(ingredient => {
                const span = document.createElement('span');
                span.className = 'ingredient';
                span.textContent = ingredient;
                ingredientsContainer.appendChild(span);
            });
        }
    }

    updateWeather() {
        const season = this.seasons[this.currentSeason];
        const iconElement = document.querySelector('.weather-icon');
        const textElement = document.querySelector('.weather-text');
        const tempElement = document.querySelector('.weather-temp');
        const weatherBar = document.querySelector('.weather-bar');

        if (iconElement) iconElement.textContent = season.icon;
        if (textElement) textElement.textContent = `${season.name} - Giorno ${this.currentDay}`;
        if (tempElement) tempElement.textContent = season.temp;
        if (weatherBar) weatherBar.style.background = `linear-gradient(135deg, ${season.color} 0%, ${season.color}80 100%)`;
    }

    initializeSeedsBox() {
        this.populateSeedsGrid();
    }

    populateSeedsGrid() {
        const seedsGrid = document.getElementById('seeds-grid');
        if (!seedsGrid) return;

        seedsGrid.innerHTML = '';

        // Ottieni semi della stagione corrente
        const seasonNames = ['primavera', 'estate', 'autunno', 'inverno'];
        const currentSeasonName = seasonNames[this.currentSeason];
        const currentSeeds = this.stardewSeeds[currentSeasonName] || [];

        // Aggiungi anche alcuni semi delle altre stagioni per varietà
        const allSeeds = [...currentSeeds];

        // Aggiungi qualche seme casuale dalle altre stagioni
        Object.keys(this.stardewSeeds).forEach(season => {
            if (season !== currentSeasonName) {
                const otherSeeds = this.stardewSeeds[season];
                const randomSeed = otherSeeds[Math.floor(Math.random() * otherSeeds.length)];
                if (randomSeed && Math.random() > 0.5) { // 50% chance
                    allSeeds.push({ ...randomSeed, count: Math.floor(randomSeed.count / 2) || 1 });
                }
            }
        });

        // Ordina per nome
        allSeeds.sort((a, b) => a.name.localeCompare(b.name));

        allSeeds.forEach(seed => {
            const seedElement = document.createElement('div');
            seedElement.className = 'seed-item';
            seedElement.title = `${seed.name} • ${seed.price} • ${seed.days} • Clicca per info`;
            seedElement.innerHTML = `
                <div class="seed-icon">${seed.icon}</div>
                <div class="seed-name">${seed.name.replace('Semi di ', '').replace('Semi di ', '').replace('Grappolo d\'', '')}</div>
                <div class="seed-count">×${seed.count}</div>
                <div class="seed-price">${seed.price}</div>
            `;

            // Effetto hover e click
            seedElement.addEventListener('click', () => {
                this.showSeedInfo(seed);
            });

            seedsGrid.appendChild(seedElement);
        });
    }

    toggleSeedsBox() {
        console.log('🌱 Toggle seeds box chiamato!');
        const seedsBox = document.getElementById('seeds-box');
        const seedsItem = document.getElementById('seeds-item');

        if (!seedsBox || !seedsItem) {
            console.log('❌ Elementi non trovati:', { seedsBox, seedsItem });
            return;
        }

        const isOpen = seedsBox.classList.contains('show');
        console.log('📦 Box attualmente aperta:', isOpen);

        if (isOpen) {
            this.closeSeedsBox();
        } else {
            this.openSeedsBox();
        }
    }

    openSeedsBox() {
        console.log('🔓 Apertura box semi...');
        const seedsBox = document.getElementById('seeds-box');
        const seedsItem = document.getElementById('seeds-item');

        if (!seedsBox || !seedsItem) return;

        seedsBox.classList.add('show');
        seedsItem.classList.add('expanded');
        console.log('✅ Classi aggiunte, box dovrebbe essere visibile!');

        // Aggiorna i semi per la stagione corrente
        this.populateSeedsGrid();

        // Aggiungi effetto suono (opzionale)
        this.playOpenSound();
    }

    closeSeedsBox() {
        const seedsBox = document.getElementById('seeds-box');
        const seedsItem = document.getElementById('seeds-item');

        if (!seedsBox || !seedsItem) return;

        seedsBox.classList.remove('show');
        seedsItem.classList.remove('expanded');
    }

    showSeedInfo(seed) {
        // Mostra notifica con info dettagliate del seme
        const infoText = `${seed.icon} ${seed.name} • ${seed.count}x • ${seed.price} • ${seed.days}`;
        this.showNotification(infoText, 3500);

        // Aggiungi effetto sparkle sul seme
        this.addSparkleEffect();
    }

    playOpenSound() {
        // Placeholder per suono di apertura - può essere implementato con Web Audio API
        console.log('🔊 *suono di apertura semi*');
    }

    rotateContent() {
        // Ruota ricetta
        this.currentRecipe = (this.currentRecipe + 1) % this.recipes.length;
        this.updateRecipe();

        // Aggiorna stats con animazione
        this.animateStatsUpdate();

        // Aggiungi effetto sparkle
        this.addSparkleEffect();
    }

    animateStatsUpdate() {
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1.1)';
                item.style.background = 'rgba(255, 255, 255, 0.4)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                    item.style.background = 'rgba(255, 255, 255, 0.2)';
                }, 300);
            }, index * 200);
        });

        setTimeout(() => this.updateStats(), 500);
    }

    advanceDay() {
        this.currentDay++;
        if (this.currentDay > 28) {
            this.currentDay = 1;
            this.currentSeason = (this.currentSeason + 1) % this.seasons.length;
            this.showSeasonChangeNotification();
            // Aggiorna i semi quando cambia stagione
            this.regenerateSeeds();
        }
        this.updateWeather();
    }

    regenerateSeeds() {
        // Rigenera le quantità di semi per la nuova stagione
        Object.keys(this.stardewSeeds).forEach(season => {
            this.stardewSeeds[season].forEach(seed => {
                seed.count = Math.floor(Math.random() * 25) + 1;
            });
        });

        // Se la box è aperta, aggiorna la griglia
        const seedsBox = document.getElementById('seeds-box');
        if (seedsBox && seedsBox.classList.contains('show')) {
            this.populateSeedsGrid();
        }
    }

    showSeasonChangeNotification() {
        const season = this.seasons[this.currentSeason];
        this.showNotification(`🎉 Nuova Stagione: ${season.name}! 🎉`, 4000);
    }

    showRandomNotification() {
        const notifications = [
            { icon: '🎉', text: 'Nuovo Follower!', duration: 3000 },
            { icon: '💝', text: 'Grazie per la Sub!', duration: 3000 },
            { icon: '🌟', text: 'Raccolto Stellato!', duration: 2500 },
            { icon: '🐔', text: 'Uovo d\'Oro trovato!', duration: 2500 },
            { icon: '🎁', text: 'Bit ricevuti!', duration: 2000 },
            { icon: '🏆', text: 'Achievement Sbloccato!', duration: 3500 },
            { icon: '💰', text: 'Vendita Record!', duration: 2500 }
        ];

        const notification = notifications[Math.floor(Math.random() * notifications.length)];
        this.showNotification(`${notification.icon} ${notification.text} ${notification.icon}`, notification.duration);
    }

    showNotification(text, duration = 3000) {
        const notification = document.getElementById('follow-notification');
        const textElement = notification.querySelector('.notif-text');

        if (textElement) textElement.textContent = text;

        notification.classList.remove('hidden');
        notification.style.animation = 'notification-appear 0.5s ease-out';

        setTimeout(() => {
            notification.style.animation = 'notification-appear 0.5s ease-out reverse';
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 500);
        }, duration);
    }

    addSparkleEffect() {
        const container = document.querySelector('.overlay-container');
        const sparkles = ['✨', '⭐', '🌟', '💫', '🔆'];

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.position = 'absolute';
                sparkle.style.fontSize = '1.5rem';
                sparkle.style.left = Math.random() * 90 + 5 + '%';
                sparkle.style.top = Math.random() * 90 + 5 + '%';
                sparkle.style.zIndex = '20';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.animation = 'sparkle-fade 2s ease-out forwards';

                container.appendChild(sparkle);

                setTimeout(() => {
                    container.removeChild(sparkle);
                }, 2000);
            }, i * 200);
        }
    }

    startAnimations() {
        // Animazione per le icone delle piante
        const plantIcons = document.querySelectorAll('.plant-icon');
        plantIcons.forEach((icon, index) => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.3) rotate(15deg)';
            });

            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });

        // Animazione casuale per gli angoli
        setInterval(() => {
            const corners = document.querySelectorAll('.corner');
            const randomCorner = corners[Math.floor(Math.random() * corners.length)];
            randomCorner.style.animation = 'none';
            setTimeout(() => {
                randomCorner.style.animation = 'gentle-bounce 3s ease-in-out infinite';
            }, 100);
        }, 10000);
    }

    setupEventListeners() {
        // Listener for seeds box
        const seedsItem = document.getElementById('seeds-item');
        const seedsBox = document.getElementById('seeds-box');
        const seedsClose = document.getElementById('seeds-close');

        if (seedsItem && seedsBox) {
            seedsItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSeedsBox();
            });
        }

        if (seedsClose) {
            seedsClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeSeedsBox();
            });
        }

        // Chiudi la box cliccando fuori
        document.addEventListener('click', (e) => {
            if (seedsBox && !seedsBox.contains(e.target) && !seedsItem.contains(e.target)) {
                this.closeSeedsBox();
            }
        });

        // Listener per interazioni keyboard (per test)
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case '1':
                    this.showRandomNotification();
                    break;
                case '2':
                    this.rotateContent();
                    break;
                case '3':
                    this.advanceDay();
                    break;
                case '4':
                    this.addSparkleEffect();
                    break;
                case '5':
                    this.toggleSeedsBox();
                    break;
            }
        });

        // Listener per pannelli hover
        const panels = document.querySelectorAll('.info-panel, .recipe-panel, .webcam-frame, .weather-bar');
        panels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                panel.style.transform = 'translateY(-5px) scale(1.02)';
                panel.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
            });

            panel.addEventListener('mouseleave', () => {
                panel.style.transform = 'translateY(0) scale(1)';
                panel.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            });
        });
    }

    // Metodi per integrazione con Twitch API (opzionali)
    onFollow(username) {
        this.showNotification(`🎉 ${username} ora ti segue! 🌟`, 4000);
    }

    onSubscription(username, tier) {
        this.showNotification(`💝 ${username} si è iscritto (Tier ${tier})! 🎊`, 5000);
    }

    onDonation(username, amount) {
        this.showNotification(`💰 ${username} ha donato ${amount}! Grazie! 🙏`, 4000);
    }

    onRaid(username, viewers) {
        this.showNotification(`🚀 Raid da ${username} con ${viewers} viewer! 🎉`, 6000);
    }

    // Carica dati dal pannello di controllo
    loadControlPanelData() {
        try {
            const savedData = localStorage.getItem('overlay-data');
            if (savedData) {
                const data = JSON.parse(savedData);

                // Aggiorna le statistiche
                if (data.farmingLevel) {
                    document.querySelector('.stat-value').textContent = data.farmingLevel;
                }

                if (data.money) {
                    document.querySelectorAll('.stat-value')[1].textContent = data.money;
                }

                if (data.seedsCount) {
                    document.querySelectorAll('.stat-value')[2].textContent = data.seedsCount;
                }

                // Aggiorna ricetta
                if (data.recipeName && data.recipeEmoji) {
                    const recipeName = document.querySelector('.recipe-name');
                    const recipeIcon = document.querySelector('.recipe-icon');
                    if (recipeName) recipeName.textContent = data.recipeName;
                    if (recipeIcon) recipeIcon.textContent = data.recipeEmoji;
                }

                // Aggiorna ingredienti
                const ingredients = document.querySelectorAll('.ingredient');
                if (data.ingredient1 && ingredients[0]) ingredients[0].textContent = data.ingredient1;
                if (data.ingredient2 && ingredients[1]) ingredients[1].textContent = data.ingredient2;
                if (data.ingredient3 && ingredients[2]) ingredients[2].textContent = data.ingredient3;

                // Aggiorna tempo
                if (data.season && data.day && data.temperature) {
                    const weatherText = document.querySelector('.weather-text');
                    const weatherTemp = document.querySelector('.weather-temp');
                    const seasonNames = {
                        'primavera': 'Primavera',
                        'estate': 'Estate',
                        'autunno': 'Autunno',
                        'inverno': 'Inverno'
                    };
                    const displaySeason = seasonNames[data.season] || data.season;
                    if (weatherText) weatherText.textContent = `${displaySeason} - Giorno ${data.day}`;
                    if (weatherTemp) weatherTemp.textContent = data.temperature;
                }

                // Aggiorna semi nel box espandibile
                if (data.plantedSeeds && data.plantedSeeds.length > 0) {
                    this.updateSeedsDisplay(data.plantedSeeds);
                }
            }

            // Controlla notifiche
            const notification = localStorage.getItem('overlay-notification');
            if (notification) {
                this.showNotification(notification);
                localStorage.removeItem('overlay-notification');
            }

            // Controlla modalità live
            const liveMode = localStorage.getItem('overlay-live-mode');
            if (liveMode === 'true') {
                this.enableLiveMode();
            }
        } catch (error) {
            console.log('Errore caricamento dati controllo:', error);
        }
    }

    // Aggiorna la visualizzazione dei semi nel box espandibile
    updateSeedsDisplay(plantedSeeds) {
        const seedsGrid = document.getElementById('seeds-grid');
        if (seedsGrid && plantedSeeds && plantedSeeds.length > 0) {
            seedsGrid.innerHTML = '';

            plantedSeeds.forEach(seed => {
                const seedElement = document.createElement('div');
                seedElement.className = 'seed-item';
                seedElement.innerHTML = `
                    <div class="seed-icon">${seed.icon}</div>
                    <div class="seed-name">${seed.name}</div>
                    <div class="seed-info">
                        <div class="seed-price">${seed.price}</div>
                        <div class="seed-time">${seed.days}</div>
                    </div>
                `;

                // Aggiungi click handler per maggiori dettagli
                seedElement.addEventListener('click', () => {
                    this.showNotification(`${seed.icon} ${seed.name}: ${seed.price}, cresce in ${seed.days}`, 3000);
                });

                seedsGrid.appendChild(seedElement);
            });
        }
    }

    // Attiva modalità live - semi sempre visibili
    enableLiveMode() {
        const seedsBox = document.getElementById('seeds-box');
        const seedsItem = document.getElementById('seeds-item');

        if (seedsBox && seedsItem) {
            // Forza l'apertura del box semi
            seedsBox.classList.add('expanded');
            seedsItem.classList.add('expanded');

            // Aggiungi classe CSS per modalità live
            document.body.classList.add('live-mode');

            console.log('🔴 LIVE MODE ATTIVO - Semi sempre visibili');
        }
    }
}

// Aggiungi CSS per l'animazione sparkle
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle-fade {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Inizializza l'overlay quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
    window.stardewOverlay = new StardewOverlay();
});

// Esporta per uso esterno
window.StardewOverlay = StardewOverlay;

const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'updateSeeds') {
        document.getElementById('seeds-item').querySelector('.stat-value').textContent = data.value;
    }

    if (data.type === 'showNotification') {
        const notif = document.getElementById('follow-notification');
        notif.classList.remove('hidden');
        setTimeout(() => notif.classList.add('hidden'), 3000);
    }

    // Puoi aggiungere altri tipi: updateRecipe, changeTheme, ecc.
};
