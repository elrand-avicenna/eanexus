// Global State
let currentApp = 'loadingScreen';
let musicPlayer = {
    currentTrack: 0,
    isPlaying: false,
    playlist: []
};
let wallpapers = [];
let currentWallpaper = 0;

// DOM Elements
const audio = document.getElementById('globalAudio');
const backgroundVideo = document.getElementById('backgroundVideo');

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    initializeTime();
    loadData();
    initializeLoading();
    initializeCalendar();
    initializeMusicPlayer();
});

// Time Update
function initializeTime() {
    const updateTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('currentTime').textContent = `${hours}:${minutes}`;
    };
    updateTime();
    setInterval(updateTime, 60000);
}

// Load All Data
async function loadData() {
    try {
        // Load Portal Data
        const portalResponse = await fetch('data/portal.json');
        const portalData = await portalResponse.json();
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
    openApp('portal');
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
}

function closeApp() {
    openApp('portal');
}

window.openApp = openApp;
window.closeApp = closeApp;

// Portal
function renderPortal(data) {
    const container = document.getElementById('notificationsContainer');
    container.innerHTML = data.notifications.map(notif => `
        <div class="notification-card">
            <div class="notification-title">${notif.title}</div>
            <div class="notification-summary">${notif.summary}</div>
        </div>
    `).join('');
}

// Calendar
function initializeCalendar() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

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
            html += `<div class="calendar-day ${todayClass}">${day}</div>`;
        }

        grid.innerHTML = html;
    };

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    renderCalendar();
}

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
        changeTrack(1);
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
    musicPlayer.currentTrack += direction;
    if (musicPlayer.currentTrack < 0) {
        musicPlayer.currentTrack = musicPlayer.playlist.length - 1;
    } else if (musicPlayer.currentTrack >= musicPlayer.playlist.length) {
        musicPlayer.currentTrack = 0;
    }
    loadTrack();
    renderPlaylist();
    if (musicPlayer.isPlaying) {
        audio.play();
    }
}

window.selectTrack = selectTrack;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

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