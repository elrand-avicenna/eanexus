// ===== Système de deux trous avec comportements différents =====

class DualHolesSystem {
    constructor() {
        // Éléments du DOM
        this.dragCircle = null;
        this.leftHole = null;   // Trou gauche - Nouvelle page
        this.rightHole = null;  // Trou droite - Contrôle vidéo
        this.videoBackground = null;
        this.overlayPage = null;
        
        // États
        this.isDragging = false;
        this.isLifting = false;
        this.mousePos = { x: 0, y: 0 };
        this.circleColor = null;
        this.isInRightHole = false;
        
        // Initialisation
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createElements());
        } else {
            this.createElements();
        }
    }

    createElements() {
        const screen = document.querySelector('.screen');
        if (!screen) {
            console.error('Élément .screen non trouvé');
            return;
        }

        // Créer le cercle draggable
        this.createDragCircle(screen);
        
        // Créer les deux trous
        this.createLeftHole(screen);
        this.createRightHole(screen);
        
        // Créer la page overlay (cachée par défaut)
        this.createOverlayPage();
        
        // Récupérer la vidéo background
        this.videoBackground = document.getElementById('video-background');
        if (this.videoBackground) {
            this.videoBackground.pause(); // Vidéo en pause par défaut
        }
        
        // Ajouter les événements
        this.addEventListeners();
        this.startRenderLoop();
    }

    createDragCircle(parent) {
        this.dragCircle = document.createElement('div');
        this.dragCircle.className = 'drag-circle-dual';
        
        // Palette de couleurs futuristes
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
            '#48dbfb', '#0abde3', '#ff9f43', '#ee5a52'
        ];
        
        this.circleColor = colors[Math.floor(Math.random() * colors.length)];
        const lighterColor = this.lightenColor(this.circleColor, 20);
        this.dragCircle.style.background = `linear-gradient(135deg, ${this.circleColor}, ${lighterColor})`;
        
        parent.appendChild(this.dragCircle);
    }

    createLeftHole(parent) {
        this.leftHole = document.createElement('div');
        this.leftHole.className = 'target-hole-left';
        parent.appendChild(this.leftHole);
    }

    createRightHole(parent) {
        this.rightHole = document.createElement('div');
        this.rightHole.className = 'target-hole-right';
        parent.appendChild(this.rightHole);
    }

    createOverlayPage() {
        this.overlayPage = document.createElement('div');
        this.overlayPage.className = 'overlay-page';
        this.overlayPage.innerHTML = `
            <div class="overlay-content">
                <h1>Nouvelle Page Dynamique</h1>
                <p>Cette page s'affiche lorsque vous relâchez l'icône dans le trou de gauche</p>
                <button class="close-overlay">Fermer</button>
            </div>
        `;
        document.body.appendChild(this.overlayPage);
        
        // Événement pour fermer l'overlay
        const closeBtn = this.overlayPage.querySelector('.close-overlay');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideOverlayPage());
        }
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const B = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const G = Math.min(255, (num & 0x0000FF) + amt);
        return "#" + (0x1000000 + R * 0x10000 + B * 0x100 + G).toString(16).slice(1);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 255, b: 255 };
    }

    addEventListeners() {
        // Événements souris
        this.dragCircle.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        // Événements tactiles
        this.dragCircle.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.onMouseMove(e), { passive: false });
        document.addEventListener('touchend', () => this.stopDrag());

        // Prévention des comportements par défaut
        this.dragCircle.addEventListener('selectstart', (e) => e.preventDefault());
        document.addEventListener('dragstart', (e) => e.preventDefault());
    }

    getEventPos(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    getRelativePos(e) {
        const pos = this.getEventPos(e);
        const screenRect = document.querySelector('.screen').getBoundingClientRect();
        return {
            x: pos.x - screenRect.left,
            y: pos.y - screenRect.top
        };
    }

    startDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isLifting = true;
        this.dragCircle.classList.add('lifting');
        this.mousePos = this.getRelativePos(e);
        
        setTimeout(() => {
            this.isLifting = false;
            this.isDragging = true;
            this.dragCircle.classList.remove('lifting');
            this.dragCircle.classList.add('dragging');
        }, 200);
    }

    onMouseMove(e) {
        if (this.isLifting || this.isDragging) {
            e.preventDefault();
            this.mousePos = this.getRelativePos(e);
        }
    }

    stopDrag() {
        if (!this.isDragging && !this.isLifting) return;
        
        this.isDragging = false;
        this.isLifting = false;
        this.dragCircle.classList.remove('dragging');
        
        // Vérifier dans quel trou le cercle est relâché
        const inLeftHole = this.isCircleInHole(this.leftHole);
        const inRightHole = this.isCircleInHole(this.rightHole);
        
        if (inLeftHole) {
            // Trou gauche : Afficher la nouvelle page
            this.showOverlayPage();
            this.resetCirclePosition();
        } else if (inRightHole) {
            // Trou droite : Maintenir dans le trou et lancer la vidéo
            this.isInRightHole = true;
            this.playVideo();
            // Le cercle reste dans le trou
        } else {
            // Pas dans un trou : retourner à la position initiale
            this.isInRightHole = false;
            this.pauseVideo();
            this.landCircle();
        }
        
        // Reset des trous
        this.resetHoleStyles();
    }

    startRenderLoop() {
        const render = () => {
            if (this.isLifting || this.isDragging) {
                this.updateCirclePosition();
                
                if (this.isDragging) {
                    this.checkProximityToHoles();
                }
            }
            
            requestAnimationFrame(render);
        };
        render();
    }

    updateCirclePosition() {
        if (this.mousePos.x === null || this.mousePos.x === undefined) return;
        
        const screenRect = document.querySelector('.screen').getBoundingClientRect();
        const circleRadius = 75; // Taille du cercle
        
        let x = Math.max(circleRadius, Math.min(screenRect.width - circleRadius, this.mousePos.x));
        let y = Math.max(circleRadius, Math.min(screenRect.height - circleRadius, this.mousePos.y));
        
        this.dragCircle.style.left = `${x - circleRadius}px`;
        this.dragCircle.style.top = `${y - circleRadius}px`;
        this.dragCircle.style.transform = this.isDragging 
            ? 'scale(1.1) translateY(-8px)' 
            : 'scale(1.05)';
    }

    checkProximityToHoles() {
        const inLeftHole = this.isCircleInHole(this.leftHole, 80);
        const inRightHole = this.isCircleInHole(this.rightHole, 80);
        
        if (inLeftHole) {
            this.highlightHole(this.leftHole);
            this.resetHoleStyle(this.rightHole);
        } else if (inRightHole) {
            this.highlightHole(this.rightHole);
            this.resetHoleStyle(this.leftHole);
        } else {
            this.resetHoleStyles();
        }
    }

    isCircleInHole(hole, threshold = 100) {
        const circleLeft = parseFloat(this.dragCircle.style.left) || 0;
        const circleTop = parseFloat(this.dragCircle.style.top) || 0;
        const circleCenterX = circleLeft + 75;
        const circleCenterY = circleTop + 75;
        
        const screenRect = document.querySelector('.screen').getBoundingClientRect();
        const holeRect = hole.getBoundingClientRect();
        const holeCenterX = holeRect.left + holeRect.width / 2 - screenRect.left;
        const holeCenterY = holeRect.top + holeRect.height / 2 - screenRect.top;
        
        const distance = Math.sqrt(
            Math.pow(circleCenterX - holeCenterX, 2) + 
            Math.pow(circleCenterY - holeCenterY, 2)
        );
        
        return distance < threshold;
    }

    highlightHole(hole) {
        const rgb = this.hexToRgb(this.circleColor);
        hole.style.transition = 'none';
        hole.style.borderColor = this.circleColor;
        hole.style.borderWidth = '3px';
        hole.style.borderStyle = 'solid';
        hole.style.boxShadow = `
            inset 0 0 20px rgba(0, 0, 0, 0.8),
            0 0 25px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6),
            0 0 35px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4),
            0 0 45px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)
        `;
        
        setTimeout(() => {
            hole.style.transition = 'all 0.3s ease';
        }, 50);
    }

    resetHoleStyle(hole) {
        hole.style.borderColor = '#333';
        hole.style.boxShadow = `
            inset 0 0 20px rgba(0, 0, 0, 0.8),
            0 0 15px rgba(0, 0, 0, 0.5)
        `;
    }

    resetHoleStyles() {
        this.resetHoleStyle(this.leftHole);
        this.resetHoleStyle(this.rightHole);
    }

    landCircle() {
        this.dragCircle.classList.add('landing');
        
        setTimeout(() => {
            this.dragCircle.classList.remove('landing');
            this.dragCircle.classList.add('landed');
            this.resetCirclePosition();
            
            setTimeout(() => {
                this.dragCircle.classList.remove('landed');
            }, 300);
        }, 100);
    }

    resetCirclePosition() {
        this.mousePos = { x: null, y: null };
        this.isInRightHole = false;
        this.pauseVideo();
        
        this.dragCircle.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.dragCircle.style.left = '50%';
        this.dragCircle.style.top = '20px';
        this.dragCircle.style.transform = 'translateX(-50%)';
        
        setTimeout(() => {
            this.dragCircle.style.transition = '';
        }, 500);
    }

    // Gestion de la vidéo
    playVideo() {
        if (this.videoBackground) {
            this.videoBackground.play().then(() => {
                console.log('✅ Vidéo en lecture');
            }).catch(err => {
                console.error('❌ Erreur lecture vidéo:', err);
            });
        }
    }

    pauseVideo() {
        if (this.videoBackground) {
            this.videoBackground.pause();
            console.log('⏸️ Vidéo en pause');
        }
    }

    // Gestion de l'overlay page
    showOverlayPage() {
        if (this.overlayPage) {
            this.overlayPage.classList.add('active');
            console.log('📄 Page overlay affichée');
        }
    }

    hideOverlayPage() {
        if (this.overlayPage) {
            this.overlayPage.classList.remove('active');
            console.log('📄 Page overlay cachée');
        }
    }
}

// Initialisation automatique
let dualHolesSystem = null;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        dualHolesSystem = new DualHolesSystem();
    }, 100);
});

// Exposer globalement
window.DualHolesSystem = {
    getInstance: () => dualHolesSystem
};
