// Initialize
let currentVideo = 'A';
let isTransitioning = false;

// Update time
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('currentTime').textContent = `${hours}:${minutes}`;
}

updateTime();
setInterval(updateTime, 1000);

// Video crossfade functionality
const videoA = document.getElementById('videoA');
const videoB = document.getElementById('videoB');

// Load and play first video
videoA.load();
videoA.play().catch(e => console.log('Autoplay prevented:', e));

videoA.addEventListener('loadedmetadata', () => {
    console.log('Video A loaded');
});

videoB.addEventListener('loadedmetadata', () => {
    console.log('Video B loaded');
});

// Handle video transitions
videoA.addEventListener('ended', () => {
    if (!isTransitioning) {
        switchVideo('B');
    }
});

videoB.addEventListener('ended', () => {
    if (!isTransitioning) {
        switchVideo('A');
    }
});

function switchVideo(nextVideo) {
    isTransitioning = true;
    
    if (nextVideo === 'B') {
        // Preload video B
        videoB.load();
        videoB.play().then(() => {
            // Start crossfade
            videoA.classList.remove('active');
            videoB.classList.add('active');
            currentVideo = 'B';
            isTransitioning = false;
        });
    } else {
        // Preload video A
        videoA.load();
        videoA.play().then(() => {
            // Start crossfade
            videoB.classList.remove('active');
            videoA.classList.add('active');
            currentVideo = 'A';
            isTransitioning = false;
        });
    }
}

// App click handlers
const appIcons = document.querySelectorAll('.app-icon');
const appOpening = document.getElementById('appOpening');
const openingCircle = document.querySelector('.app-opening-circle');

appIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
        const appName = this.dataset.app;
        const appColor = this.dataset.color;
        const rect = this.getBoundingClientRect();
        const phoneRect = document.querySelector('.phone-frame').getBoundingClientRect();
        
        // Calculate position relative to viewport
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Set circle position and color
        openingCircle.style.left = x + 'px';
        openingCircle.style.top = y + 'px';
        openingCircle.style.background = appColor;
        openingCircle.style.width = '100px';
        openingCircle.style.height = '100px';
        
        // Trigger animation
        appOpening.classList.add('active');
        
        // Navigate after animation
        setTimeout(() => {
            window.location.href = `${appName}.html`;
        }, 500);
    });
});

// Enable video autoplay on user interaction
document.addEventListener('click', () => {
    if (videoA.paused && currentVideo === 'A') {
        videoA.play();
    }
    if (videoB.paused && currentVideo === 'B') {
        videoB.play();
    }
}, { once: true });