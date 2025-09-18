class AtmosphericMusicSuggester {
    constructor() {
        this.currentMode = 'mood';
        this.isLoading = false;
        this.currentTheme = 'rainy'; // default theme
        
        this.initializeElements();
        this.bindEvents();
        this.setInitialTheme();
    }

    initializeElements() {
        // Input elements
        this.mainInput = document.getElementById('main-input');
        this.searchBtn = document.getElementById('search-btn');
        this.surpriseBtn = document.getElementById('surprise-btn');
        
        // Mode toggle
        this.modeToggle = document.getElementById('mode-toggle');
        this.modeButtons = this.modeToggle.querySelectorAll('.mode-btn');
        
        // Mood tags
        this.moodTags = document.querySelectorAll('.mood-tag');
        
        // Sections
        this.searchSection = document.getElementById('search-section');
        this.loadingSection = document.getElementById('loading-section');
        this.resultsSection = document.getElementById('results-section');
        this.resultsHeader = document.getElementById('results-header');
        this.resultsTitle = document.getElementById('results-title');
        this.playlistGrid = document.getElementById('playlist-grid');
    }

    bindEvents() {
        // Search functionality
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.mainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        // Surprise me functionality
        this.surpriseBtn.addEventListener('click', () => this.handleSurpriseMe());
        
        // Mode toggle
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
        
        // Mood tags
        this.moodTags.forEach(tag => {
            tag.addEventListener('click', () => this.selectMoodTag(tag.dataset.mood));
        });
        
        // Input placeholder updates based on mode
        this.updatePlaceholder();
    }

    setInitialTheme() {
        // Set initial rainy theme
        this.applyTheme('rainy');
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update active button
        this.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        this.updatePlaceholder();
        this.mainInput.focus();
    }

    updatePlaceholder() {
        const placeholders = {
            mood: "What's the vibe today?",
            city: "Which city sets your mood?"
        };
        this.mainInput.placeholder = placeholders[this.currentMode];
    }

    selectMoodTag(mood) {
        this.mainInput.value = mood;
        this.currentMode = 'mood';
        this.switchMode('mood');
        this.handleSearch();
    }

    async handleSearch() {
        const query = this.mainInput.value.trim();
        if (!query || this.isLoading) return;

        const url = this.currentMode === 'city' 
            ? `/api/suggestion?city=${encodeURIComponent(query)}`
            : `/api/suggestion?mood=${encodeURIComponent(query)}`;

        await this.fetchPlaylists(url);
    }

    async handleSurpriseMe() {
        if (this.isLoading) return;

        const surpriseMoods = [
            'cosmic chill', 'midnight drive', 'forest ambient', 'neon synthwave',
            'rainy jazz', 'sunset vibes', 'deep focus', 'dreamy indie',
            'urban nights', 'mountain breeze', 'ocean waves', 'stargazing'
        ];
        
        const randomMood = surpriseMoods[Math.floor(Math.random() * surpriseMoods.length)];
        this.mainInput.value = randomMood;
        
        const url = `/api/suggestion?mood=${encodeURIComponent(randomMood)}`;
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
            this.searchSection.style.display = 'none';
            this.loadingSection.style.display = 'block';
            this.resultsSection.classList.remove('show');
        } else {
            this.searchSection.style.display = 'block';
            this.loadingSection.style.display = 'none';
        }
    }

    displayResults(data) {
        if (!data.playlists || data.playlists.length === 0) {
            this.displayError('No playlists found. Try a different search.');
            return;
        }

        // Determine theme based on the search query or results
        this.updateThemeBasedOnResults(data);

        // Update results title
        this.resultsTitle.textContent = data.message;
        this.resultsHeader.style.display = 'block';

        // Clear previous results
        this.playlistGrid.innerHTML = '';

        // Create playlist cards
        data.playlists.forEach((playlist, index) => {
            const card = this.createPlaylistCard(playlist);
            this.playlistGrid.appendChild(card);
            
            // Stagger animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Show results section
        setTimeout(() => {
            this.resultsSection.classList.add('show');
        }, 100);
    }

    createPlaylistCard(playlist) {
        const card = document.createElement('div');
        card.className = 'playlist-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';

        const imageUrl = playlist.imageUrl || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${playlist.name}" class="playlist-image" 
                 onerror="this.src='https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'">
            <div class="playlist-overlay">
                <div class="playlist-info">
                    <h3 class="playlist-name">${playlist.name}</h3>
                    <p class="playlist-owner">by ${playlist.owner}</p>
                </div>
            </div>
            <button class="spotify-btn" onclick="window.open('${playlist.url}', '_blank')" 
                    title="Play on Spotify">
                <svg class="spotify-icon" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
            </button>
        `;

        return card;
    }

    updateThemeBasedOnResults(data) {
        const message = data.message.toLowerCase();
        const query = this.mainInput.value.toLowerCase();
        
        let newTheme = 'rainy'; // default
        
        // Determine theme based on keywords
        if (this.containsKeywords(message + ' ' + query, ['sunny', 'happy', 'party', 'energetic', 'upbeat', 'dance', 'pop'])) {
            newTheme = 'sunny';
        } else if (this.containsKeywords(message + ' ' + query, ['focus', 'study', 'ambient', 'meditation', 'calm', 'nature', 'forest'])) {
            newTheme = 'focus';
        } else if (this.containsKeywords(message + ' ' + query, ['rain', 'chill', 'relax', 'jazz', 'blues', 'indie', 'acoustic', 'cloudy'])) {
            newTheme = 'rainy';
        }
        
        this.applyTheme(newTheme);
    }

    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    applyTheme(theme) {
        if (this.currentTheme === theme) return;
        
        this.currentTheme = theme;
        
        // Remove existing theme classes
        document.body.classList.remove('theme-sunny', 'theme-rainy', 'theme-focus');
        
        // Add new theme class
        document.body.classList.add(`theme-${theme}`);
        
        // Trigger aurora background animation
        const aurora = document.querySelector('.aurora-bg');
        aurora.style.animation = 'none';
        aurora.offsetHeight; // Trigger reflow
        aurora.style.animation = 'aurora-shift 20s ease-in-out infinite';
    }

    displayError(message) {
        this.resultsHeader.style.display = 'none';
        this.playlistGrid.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
        
        setTimeout(() => {
            this.resultsSection.classList.add('show');
        }, 100);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AtmosphericMusicSuggester();
});