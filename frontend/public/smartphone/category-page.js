// Get category from URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category') || getCategoryFromPath();

function getCategoryFromPath() {
    const path = window.location.pathname;
    if (path.includes('anim-connect')) return 'anim-connect';
    if (path.includes('echo-sphere')) return 'echo-sphere';
    if (path.includes('arena')) return 'arena';
    if (path.includes('adventures')) return 'adventures';
    if (path.includes('medias')) return 'medias';
    return 'anim-connect';
}

// Category configurations
const categoryConfig = {
    'anim-connect': {
        title: "Anim'Connect",
        subtitle: "Projets d'animation ludique",
        colorLight: '#FF8787',
        colorDark: '#FF6B6B'
    },
    'echo-sphere': {
        title: 'Echo-Sphere',
        subtitle: "Histoires et récits",
        colorLight: '#6FE7DD',
        colorDark: '#4ECDC4'
    },
    'arena': {
        title: 'Arena',
        subtitle: "Jeux d'affrontements",
        colorLight: '#FF8A5B',
        colorDark: '#FF6B35'
    },
    'adventures': {
        title: 'Adventures',
        subtitle: "Jeux d'aventures",
        colorLight: '#AAF0E5',
        colorDark: '#95E1D3'
    },
    'medias': {
        title: 'Medias',
        subtitle: 'Vidéos et musiques',
        colorLight: '#FFA0A0',
        colorDark: '#F38181'
    }
};

// Set page colors
const config = categoryConfig[category];
document.documentElement.style.setProperty('--app-color-light', config.colorLight);
document.documentElement.style.setProperty('--app-color-dark', config.colorDark);

// Update header
document.getElementById('appTitle').textContent = config.title;
document.getElementById('appSubtitle').textContent = config.subtitle;

// Back button
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Load projects
async function loadProjects() {
    const contentDiv = document.getElementById('projectsContent');
    
    try {
        // Show loading
        contentDiv.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Chargement des projets...</p>
            </div>
        `;
        
        // Fetch mock data
        const response = await fetch('mock-data.json');
        const data = await response.json();
        const projects = data[category] || [];
        
        // Simulate loading delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (projects.length === 0) {
            contentDiv.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 2v6h6V2"></path>
                        <path d="M15 8H9v6h6V8z"></path>
                        <path d="M9 14v6h6v-6"></path>
                        <path d="M3 8h6"></path>
                        <path d="M15 8h6"></path>
                    </svg>
                    <h3>Aucun projet pour le moment</h3>
                    <p>Revenez bientôt pour découvrir de nouveaux projets !</p>
                </div>
            `;
            return;
        }
        
        // Render projects
        contentDiv.innerHTML = projects.map(project => `
            <div class="project-card">
                <img src="${project.image || project.thumbnail}" alt="${project.title}" class="project-image" loading="lazy">
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${formatDate(project.date)}
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading projects:', error);
        contentDiv.innerHTML = `
            <div class="empty-state">
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les projets. Veuillez réessayer.</p>
            </div>
        `;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

// Initialize
loadProjects();
