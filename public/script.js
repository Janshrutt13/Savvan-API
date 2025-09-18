class SonicAltimeter {
    constructor() {
        this.currentCity = '';
        this.currentMood = 'neutral';
        this.isLoading = false;
        this.locationAngle = 0;
        this.moodAngle = 0;
        
        this.cities = [
            'New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Mumbai', 'Cairo',
            'Rio de Janeiro', 'Moscow', 'Bangkok', 'Istanbul', 'Dubai', 'Singapore',
            'Los Angeles', 'Chicago', 'Toronto', 'Amsterdam', 'Barcelona', 'Rome'
        ];
        
        this.moods = [
            { name: 'chill', angle: 0, color: '#4A90E2' },
            { name: 'dreamy', angle: 30, color: '#6BB6FF' },
            { name: 'focus', angle: 60, color: '#8FBC8F' },
            { name: 'ambient', angle: 90, color: '#98FB98' },
            { name: 'energetic', angle: 120, color: '#FFD700' },
            { name: 'upbeat', angle: 150, color: '#FFA500' },
            { name: 'intense', angle: 180, color: '#FF6B6B' },
            { name: 'dark', angle: 210, color: '#8B4513' },
            { name: 'mysterious', angle: 240, color: '#4B0082' },
            { name: 'cosmic', angle: 270, color: '#6A5ACD' },
            { name: 'ethereal', angle: 300, color: '#9370DB' },
            { name: 'neutral', angle: 330, color: '#708090' }
        ];
        
        this.initializeElements();
        this.bindEvents();
        this.initializeDials();
    }

    initializeElements() {
        // Dial elements
        this.locationNeedle = document.getElementById('location-needle');
        this.cityDisplay = document.getElementById('city-name');
        this.cityInput = document.getElementById('city-input');
        this.moodKnob = document.getElementById('mood-knob');
        this.moodDisplay = document.getElementById('mood-name');
        
        // Control elements
        this.engageButton = document.getElementById('engage-button');
        
        // Sections
        this.controlSection = document.getElementById('control-section');
        this.loadingSection = document.getElementById('loading-section');
        this.resultsSection = document.getElementById('results-section');
        this.tapeDeck = document.getElementById('tape-deck');
        this.currentPlayer = document.getElementById('current-player');
    }

    bindEvents() {
        // Location dial interactions
        this.locationNeedle.addEventListener('mousedown', (e) => this.startLocationDrag(e));
        this.cityInput.addEventListener('input', (e) => this.handleCityInput(e));
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.selectCityFromInput();
        });
        
        // Mood dial interactions
        this.moodKnob.addEventListener('mousedown', (e) => this.startMoodDrag(e));
        
        // Engage button
        this.engageButton.addEventListener('click', () => this.handleEngage());
        
        // Global mouse events for dragging
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.stopDragging());
        
        // Touch events for mobile
        this.locationNeedle.addEventListener('touchstart', (e) => this.startLocationDrag(e.touches[0]));
        this.moodKnob.addEventListener('touchstart', (e) => this.startMoodDrag(e.touches[0]));
        document.addEventListener('touchmove', (e) => this.handleMouseMove(e.touches[0]));
        document.addEventListener('touchend', () => this.stopDragging());
    }

    initializeDials() {
        // Set initial city
        this.setRandomCity();
        
        // Set initial mood
        this.setMoodAngle(330); // neutral
    }

    setRandomCity() {
        const randomCity = this.cities[Math.floor(Math.random() * this.cities.length)];
        this.currentCity = randomCity;
        this.cityDisplay.textContent = randomCity.toUpperCase();
        this.cityInput.value = randomCity;
        
        // Set needle to random position
        this.locationAngle = Math.random() * 360;
        this.updateLocationNeedle();
    }

    startLocationDrag(e) {
        this.isDraggingLocation = true;
        this.updateLocationFromMouse(e);
        this.addMechanicalSound();
    }

    startMoodDrag(e) {
        this.isDraggingMood = true;
        this.updateMoodFromMouse(e);
    }

    handleMouseMove(e) {
        if (this.isDraggingLocation) {
            this.updateLocationFromMouse(e);
        }
        if (this.isDraggingMood) {
            this.updateMoodFromMouse(e);
        }
    }

    stopDragging() {
        this.isDraggingLocation = false;
        this.isDraggingMood = false;
    }

    updateLocationFromMouse(e) {
        const rect = this.locationNeedle.closest('.dial-face').getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI + 90;
        this.locationAngle = (angle + 360) % 360;
        
        this.updateLocationNeedle();
        this.updateCityFromAngle();
        this.addMechanicalSound();
    }

    updateMoodFromMouse(e) {
        const rect = this.moodKnob.closest('.dial-face').getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI + 90;
        this.moodAngle = (angle + 360) % 360;
        
        this.setMoodAngle(this.moodAngle);
    }

    updateLocationNeedle() {
        this.locationNeedle.style.transform = `translate(-50%, -100%) rotate(${this.locationAngle}deg)`;
    }

    updateCityFromAngle() {
        const cityIndex = Math.floor((this.locationAngle / 360) * this.cities.length);
        const city = this.cities[cityIndex];
        this.currentCity = city;
        this.cityDisplay.textContent = city.toUpperCase();
        this.cityInput.value = city;
    }

    handleCityInput(e) {
        const input = e.target.value;
        const matchingCity = this.cities.find(city => 
            city.toLowerCase().startsWith(input.toLowerCase())
        );
        
        if (matchingCity) {
            this.currentCity = matchingCity;
            this.cityDisplay.textContent = matchingCity.toUpperCase();
            
            // Animate needle to matching position
            const cityIndex = this.cities.indexOf(matchingCity);
            this.locationAngle = (cityIndex / this.cities.length) * 360;
            this.updateLocationNeedle();
            this.addMechanicalSound();
        }
    }

    selectCityFromInput() {
        const input = this.cityInput.value.trim();
        if (input) {
            this.currentCity = input;
            this.cityDisplay.textContent = input.toUpperCase();
            this.cityInput.blur();
        }
    }

    setMoodAngle(angle) {
        this.moodAngle = angle;
        this.moodKnob.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        
        // Find closest mood
        let closestMood = this.moods[0];
        let minDiff = Math.abs(angle - closestMood.angle);
        
        this.moods.forEach(mood => {
            const diff = Math.min(
                Math.abs(angle - mood.angle),
                Math.abs(angle - mood.angle + 360),
                Math.abs(angle - mood.angle - 360)
            );
            if (diff < minDiff) {
                minDiff = diff;
                closestMood = mood;
            }
        });
        
        this.currentMood = closestMood.name;
        this.moodDisplay.textContent = closestMood.name.toUpperCase();
        
        // Update knob color
        this.moodKnob.style.boxShadow = `
            0 0 15px ${closestMood.color},
            inset 0 2px 5px var(--highlight-warm),
            inset 0 -2px 5px var(--shadow-deep)
        `;
    }

    addMechanicalSound() {
        // Create a subtle click sound effect using Web Audio API
        if (this.audioContext) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } else {
            // Initialize audio context on first interaction
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Web Audio API not supported');
            }
        }
    }

    async handleEngage() {
        if (this.isLoading) return;
        
        // Button press animation
        this.engageButton.style.transform = 'translateY(4px)';
        setTimeout(() => {
            this.engageButton.style.transform = '';
        }, 150);
        
        // Determine search parameters
        const searchParams = this.currentCity ? 
            `city=${encodeURIComponent(this.currentCity)}` : 
            `mood=${encodeURIComponent(this.currentMood)}`;
        
        const url = `/api/suggestion?${searchParams}`;
        await this.fetchPlaylists(url);
    }

    async fetchPlaylists(url) {
        this.setLoadingState(true);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch playlists. Please try again.');
            }
            
            const data = await response.json();
            this.displayResults(data);
            
        } catch (error) {
            this.displayError(error.message);
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        this.isLoading = loading;
        
        if (loading) {
            // Retract dials
            this.controlSection.style.transform = 'translateY(-20px)';
            this.controlSection.style.opacity = '0.3';
            this.loadingSection.style.display = 'block';
        } else {
            // Restore dials
            this.controlSection.style.transform = '';
            this.controlSection.style.opacity = '';
            this.loadingSection.style.display = 'none';
        }
    }

    displayResults(data) {
        if (!data.playlists || data.playlists.length === 0) {
            this.displayError('No playlists found. Try adjusting your settings.');
            return;
        }

        // Clear previous results
        this.tapeDeck.innerHTML = '';

        // Create tape cards
        data.playlists.forEach((playlist, index) => {
            const tapeCard = this.createTapeCard(playlist);
            this.tapeDeck.appendChild(tapeCard);
            
            // Stagger animation
            setTimeout(() => {
                tapeCard.style.animationDelay = `${index * 0.1}s`;
            }, 50);
        });

        // Show results
        this.resultsSection.style.display = 'block';
    }

    createTapeCard(playlist) {
        const card = document.createElement('div');
        card.className = 'tape-card';
        
        const imageUrl = playlist.imageUrl || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg';
        
        card.innerHTML = `
            <div class="tape-cover">
                <img src="${imageUrl}" alt="${playlist.name}" 
                     onerror="this.src='https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'">
            </div>
            <div class="tape-info">
                <div class="tape-title">${playlist.name}</div>
                <div class="tape-owner">BY ${playlist.owner.toUpperCase()}</div>
            </div>
            <div class="equalizer">
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
            </div>
        `;
        
        card.addEventListener('click', () => this.insertTape(playlist));
        
        return card;
    }

    insertTape(playlist) {
        // Animate tape insertion
        this.currentPlayer.style.display = 'block';
        this.currentPlayer.style.transform = 'translateY(20px)';
        this.currentPlayer.style.opacity = '0';
        
        setTimeout(() => {
            this.currentPlayer.style.transform = '';
            this.currentPlayer.style.opacity = '';
        }, 100);
        
        // Open Spotify link
        window.open(playlist.url, '_blank');
        
        // Update now playing display
        const nowPlayingText = this.currentPlayer.querySelector('.now-playing');
        nowPlayingText.textContent = `NOW PLAYING: ${playlist.name.toUpperCase()}`;
    }

    displayError(message) {
        this.tapeDeck.innerHTML = `
            <div class="error-message" style="
                text-align: center;
                color: #FF6B6B;
                font-size: 0.9rem;
                padding: 2rem;
                background: linear-gradient(145deg, #4A1F1F, #2F1515);
                border-radius: 8px;
                border: 1px solid #FF6B6B;
                box-shadow: inset 0 2px 5px rgba(0,0,0,0.3);
            ">
                <p>${message}</p>
            </div>
        `;
        
        this.resultsSection.style.display = 'block';
    }
}

// Initialize the Sonic Altimeter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SonicAltimeter();
});