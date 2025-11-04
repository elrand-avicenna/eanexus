// Global State
let currentApp = 'loadingScreen';
let musicPlayer = {
    currentTrack: 0,
    isPlaying: false,
    playlist: [],
    repeatMode: false,
    shuffleMode: false,
    sequentialMode: true  // Active par défaut
};
let wallpapers = [];
let currentWallpaper = 0;
let events = [];
let characters = [];

// DOM Elements
const audio = document.getElementById('globalAudio');
const backgroundVideo = document.getElementById('backgroundVideo');

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    initializeTime();
    loadData(); // This will load everything including events, then initialize calendar
    initializeLoading();
    initializeMusicPlayer();
    initializeTextColorPicker();
    initializeSettingsSeekBar();
    initializeSettingsVolumeBar();
    
    // Render settings components after data is loaded
    setTimeout(() => {
        renderWallpaperSettings();
        renderPlaylistSettings();
        updateSettingsMusicInfo();
    }, 500);
});
function initializeTime() {
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const monthsOfYear = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    const updateTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
        
        // Update date
        const dayName = daysOfWeek[now.getDay()];
        const day = now.getDate();
        const monthName = monthsOfYear[now.getMonth()];
        const year = now.getFullYear();
        document.getElementById('currentDate').textContent = `${dayName} ${day} ${monthName} ${year}`;
    };
    updateTime();
    setInterval(updateTime, 1000); // Update every second
}

// Load All Data
async function loadData() {
    try {
        // Load Events first
        const eventsResponse = await fetch('data/events.json');
        events = await eventsResponse.json();
        window.events = events;
        
        // Load Characters
        await loadCharacters();
        
        // Load Portal Data
        const portalResponse = await fetch('data/portal.json');
        const portalData = await portalResponse.json();
        
        // Generate dynamic notifications with events
        renderPortal(portalData);

        // Load Wallpapers
        const wallpapersResponse = await fetch('data/wallpapers.json');
        wallpapers = await wallpapersResponse.json();
        renderWallpapers();
        loadSavedWallpaper();

        // Load Playlist
        const playlistResponse = await fetch('data/playlist.json');
        musicPlayer.playlist = await playlistResponse.json();
        renderPlaylist();

        // Load Projects
        const projectsResponse = await fetch('data/projects.json');
        const projectsData = await projectsResponse.json();
        renderProjects(projectsData);
        renderNexusApps(projectsData);
        renderCategoryApps(projectsData);
        
        // Initialize calendar after events are loaded
        initializeCalendar();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Loading Screen
function initializeLoading() {
    const skipBtn = document.getElementById('skipBtn');
    skipBtn.addEventListener('click', finishLoading);

    // Auto-finish after 5 seconds
    setTimeout(finishLoading, 5000);
}

function finishLoading() {
    openApp('home');
}

// App Navigation
function openApp(appId) {
    // Close current app
    const currentWindow = document.getElementById(currentApp);
    if (currentWindow) {
        currentWindow.classList.remove('active');
    }

    // Open new app
    const newWindow = document.getElementById(appId);
    if (newWindow) {
        newWindow.classList.add('active');
        currentApp = appId;
    }
    
    // Update icon states
    const homeIcon = document.getElementById('homeIcon');
    const notifIcon = document.getElementById('notificationsIcon');
    const settingsIcon = document.getElementById('settingsIcon');
    
    // Remove all active states
    homeIcon.classList.remove('active');
    notifIcon.classList.remove('active');
    settingsIcon.classList.remove('active');
    
    // Set active based on current app
    if (appId === 'home') {
        homeIcon.classList.add('active');
    } else if (appId === 'portal') {
        notifIcon.classList.add('active');
    } else if (appId === 'parametres') {
        settingsIcon.classList.add('active');
    }
}

function closeApp() {
    openApp('home');
}

window.openApp = openApp;
window.closeApp = closeApp;

// Portal
function renderPortal(data) {
    const container = document.getElementById('notificationsContainer');
    
    // Generate dynamic notifications based on time and events
    const dynamicNotifications = generateDynamicNotifications();
    
    // Combine static and dynamic notifications
    const allNotifications = [...dynamicNotifications, ...data.notifications];
    
    container.innerHTML = allNotifications.map(notif => `
        <div class="notification-card">
            <div class="notification-title">${notif.title}</div>
            <div class="notification-summary">${notif.summary}</div>
        </div>
    `).join('');
}

function generateDynamicNotifications() {
    const now = new Date();
    const hour = now.getHours();
    const notifications = [];
    
    // Time-based notifications from characters
    if (hour >= 6 && hour < 12) {
        notifications.push({
            title: "☀️ Bonjour de Luna Artisan",
            summary: "Bonne matinée ! Prêt à créer quelque chose de magnifique aujourd'hui ? Je viens de terminer de nouveaux concepts visuels !"
        });
    } else if (hour >= 12 && hour < 18) {
        notifications.push({
            title: "🌤️ Message d'Aria CodeWeaver",
            summary: "L'après-midi est parfait pour coder ! J'ai optimisé quelques fonctionnalités du système. Viens voir les améliorations !"
        });
    } else if (hour >= 18 && hour < 22) {
        notifications.push({
            title: "🌆 Kael Storyforge vous salue",
            summary: "Bonsoir ! C'est le moment idéal pour l'inspiration créative. J'ai une nouvelle histoire à partager avec vous..."
        });
    } else {
        notifications.push({
            title: "🌙 Bonne nuit de Thorin Soundsmith",
            summary: "La nuit est propice à la créativité musicale. J'ai composé une nouvelle mélodie apaisante pour vous."
        });
    }
    
    // Event-based notifications (upcoming events in next 3 days)
    if (window.events) {
        const upcomingEvents = window.events.filter(event => {
            const eventDate = new Date(event.date);
            const daysUntil = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
            return daysUntil >= 0 && daysUntil <= 3;
        });
        
        upcomingEvents.slice(0, 2).forEach(event => {
            const character = characters.find(c => c.id === event.characterId);
            const characterName = character ? character.name : event.characterName;
            notifications.push({
                title: `📅 ${characterName} : Événement proche`,
                summary: `${event.title} - ${event.description.substring(0, 100)}...`
            });
        });
    }
    
    return notifications;
}

// Calendar
function initializeCalendar() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDay = null;

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const renderCalendar = () => {
        const grid = document.getElementById('calendarGrid');
        const monthDisplay = document.getElementById('currentMonth');
        monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();

        let html = '';

        // Headers
        const dayHeaders = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        dayHeaders.forEach(day => {
            html += `<div class="calendar-day header">${day}</div>`;
        });

        // Empty cells
        for (let i = 0; i < firstDay; i++) {
            html += `<div class="calendar-day other-month"></div>`;
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() && 
                          currentMonth === today.getMonth() && 
                          currentYear === today.getFullYear();
            const todayClass = isToday ? 'today' : '';
            
            // Check if day has events
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasEvent = window.events && window.events.some(e => e.date === dateStr);
            const eventClass = hasEvent ? 'has-event' : '';
            
            html += `<div class="calendar-day ${todayClass} ${eventClass}" onclick="selectDay(${day}, '${dateStr}')">${day}</div>`;
        }

        grid.innerHTML = html;
    };
    
    window.selectDay = function(day, dateStr) {
        selectedDay = day;
        showDayEvents(dateStr);
    };
    
    function showDayEvents(dateStr) {
        const container = document.getElementById('dayEvents');
        const dayEvents = window.events ? window.events.filter(e => e.date === dateStr) : [];
        
        if (dayEvents.length > 0) {
            container.innerHTML = `
                <div class="day-events-title">Événements du ${dateStr.split('-')[2]} ${monthNames[currentMonth]}</div>
                ${dayEvents.map(event => {
                    const character = characters.find(c => c.id === event.characterId);
                    return `
                        <div class="event-card" onclick="openEventDetail(${event.id})">
                            <div class="event-card-title">${event.title}</div>
                            <div class="event-card-meta">🕐 ${event.time} • 👤 ${event.characterName}</div>
                            <div class="event-card-desc">${event.description}</div>
                        </div>
                    `;
                }).join('')}
            `;
        } else {
            container.innerHTML = `
                <div class="day-events-title">Aucun événement ce jour</div>
            `;
        }
    }

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
        document.getElementById('dayEvents').innerHTML = '';
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
        document.getElementById('dayEvents').innerHTML = '';
    });

    renderCalendar();
}

// Event Detail
function openEventDetail(eventId) {
    const event = window.events.find(e => e.id === eventId);
    if (!event) return;
    
    const character = characters.find(c => c.id === event.characterId);
    
    document.getElementById('eventDetailTitle').textContent = event.title;
    
    const content = document.getElementById('eventDetailContent');
    content.innerHTML = `
        <div class="event-detail-header">
            <div class="event-detail-character">
                <div class="event-detail-avatar" style="background: ${character ? character.background : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}">
                    ${character ? character.avatar : '👤'}
                </div>
                <div class="event-detail-organizer">
                    <div class="event-organizer-name">${event.characterName}</div>
                    <div class="event-organizer-title">${character ? character.title : 'Organisateur'}</div>
                </div>
            </div>
            <div class="event-detail-title">${event.title}</div>
            <div class="event-detail-meta">
                <span>📅 ${event.date}</span>
                <span>🕐 ${event.time}</span>
            </div>
        </div>
        
        <div class="event-detail-description">${event.fullDescription}</div>
        
        <div class="event-actions">
            <button class="event-btn" onclick="openChat(${event.characterId})">
                💬 Contacter l'organisateur
            </button>
            <button class="event-btn secondary" onclick="openCategoryApp('${event.category}')">
                🔗 Voir la catégorie
            </button>
        </div>
    `;
    
    openApp('eventDetail');
}

window.openEventDetail = openEventDetail;

// Music Player
function initializeMusicPlayer() {
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const seekBar = document.getElementById('seekBar');
    const volumeBar = document.getElementById('volumeBar');

    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', () => changeTrack(-1));
    nextBtn.addEventListener('click', () => changeTrack(1));

    seekBar.addEventListener('input', (e) => {
        const time = (audio.duration * e.target.value) / 100;
        audio.currentTime = time;
    });

    volumeBar.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            seekBar.value = progress;
            document.getElementById('currentTimeMusic').textContent = formatTime(audio.currentTime);
            document.getElementById('totalTime').textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener('ended', () => {
        if (musicPlayer.repeatMode) {
            // Repeat current track
            audio.currentTime = 0;
            audio.play();
        } else {
            // Move to next track and play automatically
            const wasPlaying = musicPlayer.isPlaying;
            changeTrack(1);
            if (wasPlaying) {
                // Force play after track change
                setTimeout(() => {
                    audio.play().catch(err => console.log('Auto-play error:', err));
                }, 100);
            }
        }
    });

    // Set initial volume
    audio.volume = 0.7;
}

function renderPlaylist() {
    const container = document.getElementById('playlistContainer');
    container.innerHTML = musicPlayer.playlist.map((track, index) => `
        <div class="playlist-item ${index === musicPlayer.currentTrack ? 'active' : ''}" 
             onclick="selectTrack(${index})">
            <div class="playlist-icon">♫</div>
            <div class="playlist-info">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
        </div>
    `).join('');
}

function selectTrack(index) {
    musicPlayer.currentTrack = index;
    loadTrack();
    renderPlaylist();
    if (musicPlayer.isPlaying) {
        audio.play();
    }
}

function loadTrack() {
    const track = musicPlayer.playlist[musicPlayer.currentTrack];
    audio.src = track.url;
    document.getElementById('trackTitle').textContent = track.title;
    document.getElementById('trackArtist').textContent = track.artist;
}

function togglePlay() {
    if (!audio.src) {
        loadTrack();
    }

    if (musicPlayer.isPlaying) {
        audio.pause();
        document.getElementById('playBtn').textContent = '▶';
    } else {
        audio.play();
        document.getElementById('playBtn').textContent = '⏸';
    }
    musicPlayer.isPlaying = !musicPlayer.isPlaying;
}

function changeTrack(direction) {
    const wasPlaying = musicPlayer.isPlaying;
    
    if (musicPlayer.shuffleMode && direction > 0) {
        // Random next track (shuffle mode)
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * musicPlayer.playlist.length);
        } while (randomIndex === musicPlayer.currentTrack && musicPlayer.playlist.length > 1);
        musicPlayer.currentTrack = randomIndex;
    } else {
        // Sequential mode (normal or backward)
        musicPlayer.currentTrack += direction;
        if (musicPlayer.currentTrack < 0) {
            musicPlayer.currentTrack = musicPlayer.playlist.length - 1;
        } else if (musicPlayer.currentTrack >= musicPlayer.playlist.length) {
            musicPlayer.currentTrack = 0;
        }
    }
    loadTrack();
    renderPlaylist();
    
    // Auto-play if music was playing
    if (wasPlaying) {
        musicPlayer.isPlaying = true;
        audio.play().catch(err => console.log('Auto-play error:', err));
    }
}

window.selectTrack = selectTrack;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

// Playback Mode Controls
function toggleSequential() {
    // Activate sequential mode, deactivate others
    musicPlayer.sequentialMode = true;
    musicPlayer.repeatMode = false;
    musicPlayer.shuffleMode = false;
    
    document.getElementById('sequentialBtn').classList.add('active');
    document.getElementById('repeatBtn').classList.remove('active');
    document.getElementById('shuffleBtn').classList.remove('active');
}

function toggleRepeat() {
    // Activate repeat mode, deactivate others
    musicPlayer.repeatMode = true;
    musicPlayer.sequentialMode = false;
    musicPlayer.shuffleMode = false;
    
    document.getElementById('repeatBtn').classList.add('active');
    document.getElementById('sequentialBtn').classList.remove('active');
    document.getElementById('shuffleBtn').classList.remove('active');
}

function toggleShuffle() {
    // Activate shuffle mode, deactivate others
    musicPlayer.shuffleMode = true;
    musicPlayer.sequentialMode = false;
    musicPlayer.repeatMode = false;
    
    document.getElementById('shuffleBtn').classList.add('active');
    document.getElementById('sequentialBtn').classList.remove('active');
    document.getElementById('repeatBtn').classList.remove('active');
}

window.toggleSequential = toggleSequential;
window.toggleRepeat = toggleRepeat;
window.toggleShuffle = toggleShuffle;

// ===== CHAT SYSTEM =====

let currentChatCharacter = null;
let chatHistory = {}; // Store chat history per character

function openChat(characterId) {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;
    
    currentChatCharacter = character;
    
    // Update chat header
    document.getElementById('chatHeaderName').textContent = character.name;
    const avatarEl = document.getElementById('chatHeaderAvatar');
    avatarEl.style.background = character.background;
    avatarEl.textContent = character.avatar;
    
    // Initialize chat history if doesn't exist
    if (!chatHistory[characterId]) {
        chatHistory[characterId] = [
            {
                from: 'character',
                text: `Bonjour ! Je suis ${character.name}. Comment puis-je vous aider ?`,
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            }
        ];
    }
    
    renderChatMessages();
    openApp('chat');
    
    // Focus input
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 300);
}

function renderChatMessages() {
    const container = document.getElementById('chatMessages');
    const messages = chatHistory[currentChatCharacter.id] || [];
    
    container.innerHTML = messages.map(msg => {
        const isSent = msg.from === 'user';
        return `
            <div class="chat-message ${isSent ? 'sent' : ''}">
                <div class="chat-message-avatar" style="background: ${isSent ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : currentChatCharacter.background}">
                    ${isSent ? '👤' : currentChatCharacter.avatar}
                </div>
                <div class="chat-message-bubble">
                    <div class="chat-message-text">${msg.text}</div>
                    <div class="chat-message-time">${msg.time}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Scroll to bottom
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (!text || !currentChatCharacter) return;
    
    // Add user message
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    chatHistory[currentChatCharacter.id].push({
        from: 'user',
        text: text,
        time: time
    });
    
    // Clear input
    input.value = '';
    renderChatMessages();
    
    // Auto-reply from character after delay
    setTimeout(() => {
        const reply = generateCharacterReply(currentChatCharacter, text);
        chatHistory[currentChatCharacter.id].push({
            from: 'character',
            text: reply,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        });
        renderChatMessages();
    }, 1000 + Math.random() * 2000);
}

function generateCharacterReply(character, userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    
    // Context-aware replies based on character role
    const replies = {
        1: [ // Expert Auteur
            "Merci pour votre message ! Je suis ravi de partager ma passion créative avec vous.",
            "C'est une excellente question ! L'animation ludique est mon domaine de prédilection.",
            "Je travaille actuellement sur plusieurs projets passionnants. Explorez EA NEXUS pour en découvrir plus !",
            "La créativité est un voyage sans fin. Chaque projet est une nouvelle aventure !"
        ],
        2: [ // Aria CodeWeaver
            "Techniquement parlant, c'est tout à fait réalisable avec les frameworks modernes.",
            "J'adore optimiser le code ! La performance est essentielle pour une bonne expérience utilisateur.",
            "React et JavaScript sont mes outils de prédilection pour créer des interfaces réactives.",
            "L'architecture du système est cruciale. Je veille à ce que tout soit scalable."
        ],
        3: [ // Kael Storyforge
            "Chaque histoire commence par une idée. Laissez-moi vous raconter...",
            "Les personnages sont l'âme d'une bonne narration. Je les développe avec soin.",
            "Le world building est fascinant ! Créer des univers cohérents est un art.",
            "Une intrigue captivante demande du temps et de la réflexion. La patience est clé."
        ]
    };
    
    // Get replies for this character or use default
    const characterReplies = replies[character.id] || [
        `Intéressant ! En tant que ${character.title}, je peux vous dire que c'est un sujet important.`,
        `Merci de votre intérêt. Mon rôle de ${character.title} me permet d'apporter une expertise unique.`,
        "C'est une excellente question ! Laissez-moi y réfléchir...",
        `Mon expérience en tant que ${character.title} m'a appris beaucoup sur ce domaine.`
    ];
    
    // Return random reply
    return characterReplies[Math.floor(Math.random() * characterReplies.length)];
}

function backToCharacter() {
    if (currentChatCharacter) {
        openCharacterDetail(currentChatCharacter.id);
    } else {
        openApp('auteur');
    }
}

// Enter key to send message
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }, 500);
});

window.openChat = openChat;
window.sendMessage = sendMessage;
window.backToCharacter = backToCharacter;

// Wallpapers
function renderWallpapers() {
    const gallery = document.getElementById('wallpaperGallery');
    gallery.innerHTML = wallpapers.map((wallpaper, index) => {
        const isActive = index === currentWallpaper;
        return `
            <div class="wallpaper-item ${isActive ? 'active' : ''}" 
                 onclick="setWallpaper(${index})">
                ${wallpaper.type === 'video' ? 
                    `<video class="wallpaper-preview" src="${wallpaper.url}" muted></video>` :
                    `<img class="wallpaper-preview" src="${wallpaper.url}" alt="${wallpaper.title}" />`
                }
                <div class="wallpaper-info">
                    <div class="wallpaper-title">${wallpaper.title}</div>
                </div>
                ${isActive ? '<div class="wallpaper-badge">Actif</div>' : ''}
            </div>
        `;
    }).join('');
}

function setWallpaper(index) {
    currentWallpaper = index;
    const wallpaper = wallpapers[index];

    if (wallpaper.type === 'video') {
        backgroundVideo.src = wallpaper.url;
        backgroundVideo.style.display = 'block';
        backgroundVideo.load();
        backgroundVideo.play();
    } else {
        backgroundVideo.style.display = 'none';
        document.body.style.backgroundImage = `url(${wallpaper.url})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }

    // Save to localStorage
    localStorage.setItem('selectedWallpaper', index);
    renderWallpapers();
}

window.setWallpaper = setWallpaper;

function loadSavedWallpaper() {
    const saved = localStorage.getItem('selectedWallpaper');
    if (saved !== null) {
        setWallpaper(parseInt(saved));
    } else {
        // Set default (first wallpaper)
        setWallpaper(0);
    }
}

// Projects
function renderProjects(data) {
    const container = document.getElementById('projectCategories');
    container.innerHTML = data.categories.map(category => `
        <div class="category-card" onclick="openCategoryApp('${category.id}')">
            <div class="category-header">
                <div class="category-icon">${category.icon}</div>
                <div class="category-name">${category.name}</div>
            </div>
            <div class="category-summary">${category.summary}</div>
        </div>
    `).join('');
}

function openCategoryApp(categoryId) {
    openApp(categoryId);
}

window.openCategoryApp = openCategoryApp;

// EA NEXUS
function renderNexusApps(data) {
    const grid = document.getElementById('nexusGrid');
    grid.innerHTML = data.categories.map(category => `
        <div class="nexus-app" onclick="openCategoryApp('${category.id}')">
            <div class="nexus-app-icon">${category.icon}</div>
            <div class="nexus-app-name">${category.name}</div>
            <div class="nexus-app-desc">${category.items.length} projets</div>
        </div>
    `).join('');
}

// Category Apps
function renderCategoryApps(data) {
    data.categories.forEach(category => {
        switch(category.id) {
            case 'animConnect':
                renderAnimConnect(category);
                break;
            case 'echoSphere':
                renderEchoSphere(category);
                break;
            case 'arena':
                renderArena(category);
                break;
            case 'adventures':
                renderAdventures(category);
                break;
            case 'medias':
                renderMedias(category);
                break;
            case 'eaCenter':
                renderEaCenter(category);
                break;
        }
    });
}

// Anim'Connect (WhatsApp-like)
function renderAnimConnect(category) {
    const container = document.getElementById('chatList');
    container.innerHTML = category.items.map((item, index) => `
        <div class="chat-item">
            <div class="chat-avatar">${item.icon || '🎮'}</div>
            <div class="chat-info">
                <div class="chat-name">${item.title}</div>
                <div class="chat-message">${item.description}</div>
            </div>
            <div class="chat-time">${item.date || 'Récent'}</div>
        </div>
    `).join('');
}

// Echo-Sphere (LinkedIn-like)
function renderEchoSphere(category) {
    const container = document.getElementById('socialFeed');
    container.innerHTML = category.items.map((item, index) => `
        <div class="feed-post">
            <div class="post-header">
                <div class="post-avatar">${item.icon || '📖'}</div>
                <div class="post-author">
                    <div class="post-name">Expert Auteur</div>
                    <div class="post-time">${item.date || 'Il y a 2 jours'}</div>
                </div>
            </div>
            <div class="post-content">
                <div class="post-title">${item.title}</div>
                <div class="post-text">${item.description}</div>
            </div>
            <div class="post-actions">
                <div class="post-action">👍 J'aime</div>
                <div class="post-action">💬 Commenter</div>
                <div class="post-action">🔄 Partager</div>
            </div>
        </div>
    `).join('');
}

// Arena (Gaming Hub)
function renderArena(category) {
    const container = document.getElementById('gamingHub');
    container.innerHTML = '<div class="game-grid">' + 
        category.items.map((item, index) => `
            <div class="game-card">
                <div class="game-cover">${item.icon || '⚔️'}</div>
                <div class="game-info">
                    <div class="game-title">${item.title}</div>
                    <div class="game-tag">${item.tag || 'Action'}</div>
                </div>
            </div>
        `).join('') + 
    '</div>';
}

// Adventures (Habit Tracker)
function renderAdventures(category) {
    const container = document.getElementById('habitTracker');
    container.innerHTML = '<div class="habit-list">' + 
        category.items.map((item, index) => `
            <div class="habit-item">
                <div class="habit-checkbox" onclick="toggleHabit(this)"></div>
                <div class="habit-details">
                    <div class="habit-name">${item.title}</div>
                    <div class="habit-desc">${item.description}</div>
                </div>
                <div class="habit-progress">${item.progress || '0/10'}</div>
            </div>
        `).join('') + 
    '</div>';
}

function toggleHabit(element) {
    element.classList.toggle('checked');
}

window.toggleHabit = toggleHabit;

// Medias (YouTube-like)
function renderMedias(category) {
    const container = document.getElementById('youtubeLayout');
    container.innerHTML = '<div class="video-grid">' + 
        category.items.map((item, index) => `
            <div class="video-item">
                <div class="video-thumbnail">
                    ${item.icon || '🎬'}
                    <div class="play-overlay">▶</div>
                </div>
                <div class="video-details">
                    <div class="video-title">${item.title}</div>
                    <div class="video-meta">Expert Auteur • ${item.views || '1.2k'} vues • ${item.date || 'Il y a 1 semaine'}</div>
                </div>
            </div>
        `).join('') + 
    '</div>';
}

// EA Center (Tutoriels)
function renderEaCenter(category) {
    const container = document.getElementById('eaCenterLayout');
    container.innerHTML = '<div class="video-grid">' + 
        category.items.map((item, index) => `
            <div class="video-item">
                <div class="video-thumbnail">
                    ${item.icon || '📚'}
                    <div class="play-overlay">▶</div>
                </div>
                <div class="video-details">
                    <div class="video-title">${item.title}</div>
                    <div class="video-meta">Expert Auteur • ${item.views || '1.2k'} vues • ${item.date || 'Il y a 1 semaine'}</div>
                </div>
            </div>
        `).join('') + 
    '</div>';
}

// ===== SETTINGS PAGE FUNCTIONS =====

// Text Color
function initializeTextColorPicker() {
    const colorPicker = document.getElementById('textColorPicker');
    const savedColor = localStorage.getItem('accentColor');
    
    if (savedColor) {
        colorPicker.value = savedColor;
        applyAccentColor(savedColor);
    } else {
        // Set default blue color
        colorPicker.value = '#667eea';
    }
    
    colorPicker.addEventListener('change', (e) => {
        applyAccentColor(e.target.value);
        localStorage.setItem('accentColor', e.target.value);
    });
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function lightenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percent));
    const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percent));
    const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percent));
    
    return rgbToHex(r, g, b);
}

function darkenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const r = Math.floor(rgb.r * (1 - percent));
    const g = Math.floor(rgb.g * (1 - percent));
    const b = Math.floor(rgb.b * (1 - percent));
    
    return rgbToHex(r, g, b);
}

function applyAccentColor(color) {
    // Generate variants
    const lightVariant = lightenColor(color, 0.3);
    const darkVariant = darkenColor(color, 0.2);
    
    // Update CSS variables
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.style.setProperty('--accent-light', lightVariant);
    document.documentElement.style.setProperty('--accent-dark', darkVariant);
    
    // Create dynamic styles to replace all blue (#667eea) elements
    const style = document.createElement('style');
    style.id = 'dynamic-accent-styles';
    
    // Remove old style if exists
    const oldStyle = document.getElementById('dynamic-accent-styles');
    if (oldStyle) oldStyle.remove();
    
    style.innerHTML = `
        /* Gradients with accent color */
        .loading-logo, .portal-title {
            background: linear-gradient(135deg, ${color} 0%, ${darkVariant} 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
        }
        
        .author-avatar, .post-avatar, .chat-avatar {
            background: linear-gradient(135deg, ${color} 0%, ${darkVariant} 100%) !important;
        }
        
        .album-art, .video-thumbnail, .game-cover {
            background: linear-gradient(135deg, ${color} 0%, ${darkVariant} 100%) !important;
        }
        
        .loading-text {
            color: ${color} !important;
        }
        
        .loading-spinner {
            border-color: ${color}33 !important;
            border-top-color: ${color} !important;
        }
        
        /* Notification and card titles */
        .notification-title {
            color: ${color} !important;
        }
        
        /* Stats and highlights */
        .stat-value, .habit-progress {
            color: ${color} !important;
        }
        
        /* Buttons and interactive elements */
        .play-btn {
            background: ${color} !important;
        }
        
        .control-btn:hover, .dock-app:hover {
            background: ${color}33 !important;
        }
        
        /* Borders and active states */
        .wallpaper-option.active, .playlist-item.active, .playlist-item-settings.active {
            border-color: ${color} !important;
            background: ${color}33 !important;
        }
        
        .category-card:hover, .nexus-app:hover {
            background: ${color}33 !important;
            border-color: ${color} !important;
        }
        
        .game-card:hover {
            box-shadow: 0 10px 30px ${color}4D !important;
        }
        
        /* Range inputs */
        input[type="range"]::-webkit-slider-thumb {
            background: ${color} !important;
        }
        
        input[type="range"]::-moz-range-thumb {
            background: ${color} !important;
        }
        
        /* Calendar */
        .calendar-day.today {
            background: ${color} !important;
        }
        
        .calendar-day:hover {
            background: ${color}4D !important;
        }
        
        .calendar-day.header {
            color: ${color} !important;
        }
        
        /* Social buttons */
        .social-btn {
            background: ${color}33 !important;
            border-color: ${color} !important;
            color: ${color} !important;
        }
        
        .social-btn:hover {
            background: ${color} !important;
            color: #fff !important;
        }
        
        /* Checkboxes */
        .habit-checkbox {
            border-color: ${color} !important;
        }
        
        .habit-checkbox.checked {
            background: ${color} !important;
        }
        
        /* Post actions */
        .post-action:hover {
            color: ${color} !important;
        }
    `;
    
    document.head.appendChild(style);
}

function resetTextColor() {
    const defaultColor = '#667eea';
    document.getElementById('textColorPicker').value = defaultColor;
    applyAccentColor(defaultColor);
    localStorage.removeItem('accentColor');
}

// Wallpaper Settings
function renderWallpaperSettings() {
    const container = document.getElementById('wallpaperSettings');
    container.innerHTML = wallpapers.map((wallpaper, index) => `
        <div class="wallpaper-option ${index === currentWallpaper ? 'active' : ''}" onclick="selectWallpaperFromSettings(${index})">
            <input type="radio" name="wallpaper" id="wallpaper${index}" ${index === currentWallpaper ? 'checked' : ''}>
            <label for="wallpaper${index}">${wallpaper.title}</label>
        </div>
    `).join('');
}

function selectWallpaperFromSettings(index) {
    setWallpaper(index);
    renderWallpaperSettings();
}

// Video Controls
let videoPlaying = true;

function toggleVideoPlayback() {
    const video = document.getElementById('backgroundVideo');
    const btn = document.getElementById('videoPlayBtn');
    
    if (videoPlaying) {
        video.pause();
        btn.textContent = '▶️ Play';
        videoPlaying = false;
    } else {
        video.play();
        btn.textContent = '⏸️ Pause';
        videoPlaying = true;
    }
}

function stopVideo() {
    const video = document.getElementById('backgroundVideo');
    const btn = document.getElementById('videoPlayBtn');
    video.pause();
    video.currentTime = 0;
    btn.textContent = '▶️ Play';
    videoPlaying = false;
}

// Music Controls for Settings
function renderPlaylistSettings() {
    const container = document.getElementById('playlistSettings');
    container.innerHTML = musicPlayer.playlist.map((track, index) => `
        <div class="playlist-item-settings ${index === musicPlayer.currentTrack ? 'active' : ''}" 
             onclick="selectTrackFromSettings(${index})">
            <div class="playlist-icon">♫</div>
            <div class="playlist-info">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
        </div>
    `).join('');
}

function selectTrackFromSettings(index) {
    selectTrack(index);
    updateSettingsMusicInfo();
    renderPlaylistSettings();
}

function toggleMusicPlayback() {
    const btn = document.getElementById('settingsPlayBtn');
    
    if (!audio.src) {
        loadTrack();
    }

    if (musicPlayer.isPlaying) {
        audio.pause();
        btn.textContent = '▶️ Play';
        musicPlayer.isPlaying = false;
    } else {
        audio.play();
        btn.textContent = '⏸️ Pause';
        musicPlayer.isPlaying = true;
    }
    updateSettingsMusicInfo();
}

function pauseMusic() {
    audio.pause();
    document.getElementById('settingsPlayBtn').textContent = '▶️ Play';
    musicPlayer.isPlaying = false;
}

function stopMusic() {
    audio.pause();
    audio.currentTime = 0;
    document.getElementById('settingsPlayBtn').textContent = '▶️ Play';
    musicPlayer.isPlaying = false;
    updateSettingsMusicInfo();
}

function updateSettingsMusicInfo() {
    if (musicPlayer.playlist.length > 0) {
        const track = musicPlayer.playlist[musicPlayer.currentTrack];
        document.getElementById('settingsTrackTitle').textContent = track.title;
        document.getElementById('settingsTrackArtist').textContent = track.artist;
    }
}

// Settings seek bar
function initializeSettingsSeekBar() {
    const seekBar = document.getElementById('settingsSeekBar');
    
    seekBar.addEventListener('input', (e) => {
        const time = (audio.duration * e.target.value) / 100;
        audio.currentTime = time;
    });
    
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            seekBar.value = progress;
            document.getElementById('settingsCurrentTime').textContent = formatTime(audio.currentTime);
            document.getElementById('settingsTotalTime').textContent = formatTime(audio.duration);
        }
    });
}

// Settings volume bar
function initializeSettingsVolumeBar() {
    const volumeBar = document.getElementById('settingsVolumeBar');
    volumeBar.value = 70;
    
    volumeBar.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });
}

// Initialize settings when app opens
window.addEventListener('DOMContentLoaded', () => {
    initializeTime();
    loadData();
    initializeLoading();
    initializeCalendar();
    initializeMusicPlayer();
    initializeTextColorPicker();
    initializeSettingsSeekBar();
    initializeSettingsVolumeBar();
    
    // Render settings components after data is loaded
    setTimeout(() => {
        renderWallpaperSettings();
        renderPlaylistSettings();
        updateSettingsMusicInfo();
    }, 500);
});

// Load Characters
async function loadCharacters() {
    try {
        const response = await fetch('data/characters.json');
        characters = await response.json();
        renderCharactersGallery();
    } catch (error) {
        console.error('Error loading characters:', error);
    }
}

// Render Characters Gallery
function renderCharactersGallery() {
    const container = document.getElementById('charactersGallery');
    container.innerHTML = '<div class="characters-grid">' +
        characters.map(character => `
            <div class="character-card" onclick="openCharacterDetail(${character.id})">
                <div class="character-avatar" style="background: ${character.background}">
                    ${character.avatar}
                </div>
                <div class="character-name">${character.name}</div>
                <div class="character-title">${character.title}</div>
            </div>
        `).join('') +
    '</div>';
}

// Open Character Detail
function openCharacterDetail(characterId) {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;
    
    document.getElementById('characterDetailName').textContent = character.name;
    
    const content = document.getElementById('characterDetailContent');
    content.innerHTML = `
        <div class="character-detail-header">
            <div class="character-detail-avatar" style="background: ${character.background}">
                ${character.avatar}
            </div>
            <div class="character-detail-name">${character.name}</div>
            <div class="character-detail-title">${character.title}</div>
            <button class="messenger-btn" onclick="openChat(${character.id})">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.15 2 11.25c0 2.92 1.44 5.51 3.69 7.24V22l3.41-1.87c.91.25 1.87.37 2.9.37 5.52 0 10-4.15 10-9.25S17.52 2 12 2zm1 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
                </svg>
                Envoyer un message
            </button>
        </div>
        
        <div class="character-detail-bio">${character.bio}</div>
        
        <div class="character-stats">
            <h3>Statistiques</h3>
            ${Object.entries(character.stats).map(([key, value]) => `
                <div class="stat-bar">
                    <div class="stat-bar-label">
                        <span>${key}</span>
                        <span>${value}%</span>
                    </div>
                    <div class="stat-bar-fill">
                        <div class="stat-bar-progress" style="width: ${value}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="character-skills">
            <h3>Compétences</h3>
            <div class="skills-list">
                ${character.skills.map(skill => `
                    <div class="skill-item">✦ ${skill}</div>
                `).join('')}
            </div>
        </div>
    `;
    
    openApp('characterDetail');
}

window.openCharacterDetail = openCharacterDetail;