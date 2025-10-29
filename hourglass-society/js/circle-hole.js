// ===== Système de cercle draggable avec intégration des modules =====

class DragCircleSystem {
    constructor() {
        // Éléments du DOM
        this.dragCircle = null;
        this.targetHole = null;
        this.worldCanvas = null;
        
        // Systèmes externes
        this.fingerprintSystem = null;
        this.accessScreenSystem = null;
        
        // États du système
        this.isDragging = false;
        this.isLifting = false;
        this.mousePos = { x: 0, y: 0 };
        this.circleColor = null;
        
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

        this.worldCanvas = document.getElementById('world');
        
        // Initialiser les systèmes externes
        this.initExternalSystems(screen);
        
        // Créer les éléments principaux
        this.createDragCircle(screen);
        this.createTargetHole(screen);
        
        // Ajouter les événements et démarrer la boucle
        this.addEventListeners();
        this.startRenderLoop();
    }

    initExternalSystems(screen) {
        // Initialiser le système d'empreinte
        if (typeof FingerprintSystem !== 'undefined') {
            this.fingerprintSystem = new FingerprintSystem();
        }
        
        // Initialiser le système d'écran d'accès
        if (typeof AccessScreenSystem !== 'undefined') {
            this.accessScreenSystem = new AccessScreenSystem();
            this.accessScreenSystem.init('access-screen');
        }
    }

    createDragCircle(parent) {
        this.dragCircle = document.createElement('div');
        this.dragCircle.className = 'drag-circle';
        
        // Palette de couleurs futuristes
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
            '#48dbfb', '#0abde3', '#ff9f43', '#ee5a52'
        ];
        
        // Sélection aléatoire de la couleur
        this.circleColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Application du dégradé
        const lighterColor = this.lightenColor(this.circleColor, 20);
        this.dragCircle.style.background = `linear-gradient(135deg, ${this.circleColor}, ${lighterColor})`;
        
        parent.appendChild(this.dragCircle);
    }

    createTargetHole(parent) {
        this.targetHole = document.createElement('div');
        this.targetHole.className = 'target-hole';
        parent.appendChild(this.targetHole);
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
        
        // Phase de levée
        this.isLifting = true;
        this.dragCircle.classList.add('lifting');
        this.mousePos = this.getRelativePos(e);
        
        // Transition vers le drag après l'animation
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
        
        // Arrêt du drag
        this.isDragging = false;
        this.isLifting = false;
        this.dragCircle.classList.remove('dragging');
        
        // Reset du trou
        this.resetHole();
        
        // Vérification de la position
        if (this.isCircleInHole()) {
            this.transformToFingerprint();
        } else {
            this.landCircle();
        }
    }

    startRenderLoop() {
        const render = () => {
            if (this.isLifting || this.isDragging) {
                this.updateCirclePosition();
                
                if (this.isDragging) {
                    this.checkProximityToHole();
                }
            }
            
            requestAnimationFrame(render);
        };
        render();
    }

    updateCirclePosition() {
        if (this.mousePos.x === null || this.mousePos.x === undefined) return;
        
        const screenRect = document.querySelector('.screen').getBoundingClientRect();
        const circleRadius = 40;
        
        // Contraintes de mouvement
        let x = Math.max(circleRadius, Math.min(screenRect.width - circleRadius, this.mousePos.x));
        let y = Math.max(circleRadius, Math.min(screenRect.height - circleRadius, this.mousePos.y));
        
        // Positionnement centré
        this.dragCircle.style.left = `${x - circleRadius}px`;
        this.dragCircle.style.top = `${y - circleRadius}px`;
        this.dragCircle.style.transform = this.isDragging 
            ? 'scale(1.1) translateY(-8px)' 
            : 'scale(1.05)';
    }

    checkProximityToHole() {
        const circleLeft = parseFloat(this.dragCircle.style.left) || 0;
        const circleTop = parseFloat(this.dragCircle.style.top) || 0;
        const circleCenterX = circleLeft + 40;
        const circleCenterY = circleTop + 40;
        
        const screenRect = document.querySelector('.screen').getBoundingClientRect();
        const holeRect = this.targetHole.getBoundingClientRect();
        const holeCenterX = holeRect.left + holeRect.width / 2 - screenRect.left;
        const holeCenterY = holeRect.top + holeRect.height / 2 - screenRect.top;
        
        const distance = Math.sqrt(
            Math.pow(circleCenterX - holeCenterX, 2) + 
            Math.pow(circleCenterY - holeCenterY, 2)
        );
        
        if (distance < 60) {
            this.highlightHole();
        } else {
            this.resetHole();
        }
    }

    highlightHole() {
        const rgb = this.hexToRgb(this.circleColor);
        const holeElement = this.targetHole;
        
        holeElement.style.transition = 'none';
        holeElement.style.borderColor = this.circleColor;
        holeElement.style.borderWidth = '3px';
        holeElement.style.borderStyle = 'solid';
        holeElement.style.boxShadow = `
            inset 0 0 20px rgba(0, 0, 0, 0.8),
            0 0 25px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6),
            0 0 35px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4),
            0 0 45px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)
        `;
        
        setTimeout(() => {
            holeElement.style.transition = 'all 0.3s ease';
        }, 50);
    }

    resetHole() {
        const holeElement = this.targetHole;
        holeElement.style.borderColor = '#333';
        holeElement.style.boxShadow = `
            inset 0 0 20px rgba(0, 0, 0, 0.8),
            0 0 15px rgba(0, 0, 0, 0.5)
        `;
    }

    isCircleInHole() {
        const circleLeft = parseFloat(this.dragCircle.style.left) || 0;
        const circleTop = parseFloat(this.dragCircle.style.top) || 0;
        const circleCenterX = circleLeft + 40;
        const circleCenterY = circleTop + 40;
        
        const screenRect = document.querySelector('.screen').getBoundingClientRect();
        const holeRect = this.targetHole.getBoundingClientRect();
        const holeCenterX = holeRect.left + holeRect.width / 2 - screenRect.left;
        const holeCenterY = holeRect.top + holeRect.height / 2 - screenRect.top;
        
        const distance = Math.sqrt(
            Math.pow(circleCenterX - holeCenterX, 2) + 
            Math.pow(circleCenterY - holeCenterY, 2)
        );
        
        return distance < 100;
    }

    transformToFingerprint() {
        // Masquage du cercle et du trou
        this.dragCircle.style.opacity = '0';
        this.dragCircle.style.visibility = 'hidden';
        this.targetHole.style.opacity = '0';
        this.targetHole.style.visibility = 'hidden';
        
        // Créer et afficher l'empreinte
        if (this.fingerprintSystem) {
            const screen = document.querySelector('.screen');
            this.fingerprintSystem.create(screen, this.circleColor);
            
            // Configurer le callback de fin
            this.fingerprintSystem.onFingerprinted(() => {
                this.showAccessScreen();
            });
            
            // Afficher l'empreinte
            setTimeout(() => {
                this.fingerprintSystem.show();
                this.fadeInCanvas();
            }, 300);
        } else {
            // Fallback si le système d'empreinte n'est pas disponible
            console.warn('FingerprintSystem non disponible');
            this.showAccessScreen();
        }
    }

    showAccessScreen() {
        if (this.accessScreenSystem) {
            // Masquer l'empreinte si elle existe
            if (this.fingerprintSystem) {
                this.fingerprintSystem.hide();
            }
            
            // Afficher l'écran d'accès avec la couleur du cercle
            this.accessScreenSystem.showSuccess(this.circleColor);
        } else {
            console.warn('AccessScreenSystem non disponible');
        }
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
        
        this.dragCircle.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.dragCircle.style.left = '50%';
        this.dragCircle.style.top = '20px';
        this.dragCircle.style.transform = 'translateX(-50%)';
        
        setTimeout(() => {
            this.dragCircle.style.transition = '';
        }, 500);
    }

    fadeInCanvas() {
        if (this.worldCanvas) {
            this.worldCanvas.classList.add('fade-in');
        }
    }

    // Méthodes publiques pour contrôler le système
    reset() {
        // Reset du drag circle
        this.resetCirclePosition();
        this.dragCircle.style.opacity = '1';
        this.dragCircle.style.visibility = 'visible';
        
        // Reset du trou
        this.targetHole.style.opacity = '1';
        this.targetHole.style.visibility = 'visible';
        this.resetHole();
        
        // Reset des systèmes externes
        if (this.fingerprintSystem) {
            this.fingerprintSystem.reset();
        }
        
        if (this.accessScreenSystem) {
            this.accessScreenSystem.hide();
        }
        
        // Reset du canvas
        if (this.worldCanvas) {
            this.worldCanvas.classList.remove('fade-in');
            this.worldCanvas.style.opacity = '0';
        }
    }

    getCircleColor() {
        return this.circleColor;
    }

    setCircleColor(color) {
        this.circleColor = color;
        const lighterColor = this.lightenColor(color, 20);
        this.dragCircle.style.background = `linear-gradient(135deg, ${color}, ${lighterColor})`;
    }
}

// Initialisation automatique du système
let dragSystem = null;

// Attendre que tous les systèmes soient chargés
document.addEventListener('DOMContentLoaded', () => {
    // Petit délai pour s'assurer que tous les scripts sont chargés
    setTimeout(() => {
        dragSystem = new DragCircleSystem();
    }, 100);
});

// Exposer le système globalement pour debug/contrôle
window.DragSystem = {
    reset: () => dragSystem?.reset(),
    getColor: () => dragSystem?.getCircleColor(),
    setColor: (color) => dragSystem?.setCircleColor(color)
};