// ===== Système de 2 trous avec contrôle vidéo (activé APRÈS le choix d'icône) =====

class TwoHolesSystem {
    constructor() {
        this.selectedIcon = null;
        this.videoBackground = null;
        this.leftHole = null;
        this.rightHole = null;
        this.overlayPage = null;
        this.isDragging = false;
        this.isInRightHole = false;
    }

    // Démarrer le système après le choix d'icône
    startAfterIconPick(icon, video) {
        console.log('🎬 Démarrage système 2 trous...');
        
        this.selectedIcon = icon;
        
        // Créer ou réutiliser la vidéo
        if (video) {
            this.videoBackground = video;
            this.videoBackground.style.zIndex = '1';
            this.videoBackground.style.opacity = '1';
            this.videoBackground.pause(); // En pause au départ
        } else {
            this.createVideoBackground();
        }
        
        // Créer les trous
        this.createHoles();
        
        // Créer l'overlay
        this.createOverlayPage();
        
        // Rendre l'icône draggable
        this.makeIconDraggable();
    }

    createVideoBackground() {
        this.videoBackground = document.createElement('video');
        this.videoBackground.id = 'video-background-system';
        this.videoBackground.style.position = 'fixed';
        this.videoBackground.style.top = '0';
        this.videoBackground.style.left = '0';
        this.videoBackground.style.width = '100vw';
        this.videoBackground.style.height = '100vh';
        this.videoBackground.style.objectFit = 'cover';
        this.videoBackground.style.zIndex = '1';
        this.videoBackground.muted = false;
        this.videoBackground.loop = true;
        
        const source = document.createElement('source');
        source.src = 'img/Perso-Siteweb.mp4';
        source.type = 'video/mp4';
        this.videoBackground.appendChild(source);
        
        document.body.appendChild(this.videoBackground);
        this.videoBackground.pause();
        console.log('⏸️ Vidéo créée (en pause)');
    }

    createHoles() {
        // Trou gauche (page)
        this.leftHole = document.createElement('div');
        this.leftHole.className = 'interaction-hole left-hole';
        this.leftHole.innerHTML = '<span class="hole-icon">📄</span>';
        this.leftHole.style.cssText = `
            position: fixed;
            left: 20%;
            bottom: 15%;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: radial-gradient(circle, #1a0a2e 30%, #2d1b4e 70%, #3d2b5e 100%);
            border: 3px solid #555;
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            transition: all 0.3s ease;
        `;
        
        // Trou droite (sablier/vidéo)
        this.rightHole = document.createElement('div');
        this.rightHole.className = 'interaction-hole right-hole';
        this.rightHole.innerHTML = '<span class="hole-icon">⏳</span>';
        this.rightHole.style.cssText = `
            position: fixed;
            right: 20%;
            bottom: 15%;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: radial-gradient(circle, #0a1a2e 30%, #1b2d4e 70%, #2b3d5e 100%);
            border: 3px solid #555;
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            transition: all 0.3s ease;
        `;
        
        // Style des icônes emoji
        if (!document.getElementById('hole-icon-style')) {
            const holeIconStyle = document.createElement('style');
            holeIconStyle.id = 'hole-icon-style';
            holeIconStyle.textContent = `
                .hole-icon {
                    font-size: 48px;
                    opacity: 0.6;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(holeIconStyle);
        }
        
        document.body.appendChild(this.leftHole);
        document.body.appendChild(this.rightHole);
        
        console.log('🕳️ Trous créés');
    }

    createOverlayPage() {
        this.overlayPage = document.createElement('div');
        this.overlayPage.className = 'full-overlay-page';
        this.overlayPage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        `;
        
        this.overlayPage.innerHTML = `
            <div style="text-align: center; color: white; padding: 40px; background: rgba(0, 0, 0, 0.3); border-radius: 20px; backdrop-filter: blur(10px);">
                <h1 style="font-size: 48px; margin-bottom: 20px;">Nouvelle Page Dynamique</h1>
                <p style="font-size: 20px; margin-bottom: 30px;">Cette page apparaît lorsque vous relâchez l'icône dans le trou de gauche</p>
                <button class="close-overlay-btn" style="padding: 15px 40px; font-size: 18px; background: white; color: #667eea; border: none; border-radius: 50px; cursor: pointer; font-weight: bold;">Fermer</button>
            </div>
        `;
        
        document.body.appendChild(this.overlayPage);
        
        const closeBtn = this.overlayPage.querySelector('.close-overlay-btn');
        closeBtn.addEventListener('click', () => this.hideOverlay());
        
        console.log('📄 Overlay créée');
    }

    makeIconDraggable() {
        if (!this.selectedIcon) return;
        
        const iconRect = this.selectedIcon.getBoundingClientRect();
        
        this.selectedIcon.style.position = 'fixed';
        this.selectedIcon.style.left = `${iconRect.left}px`;
        this.selectedIcon.style.top = `${iconRect.top}px`;
        this.selectedIcon.style.width = `${iconRect.width}px`;
        this.selectedIcon.style.height = `${iconRect.height}px`;
        this.selectedIcon.style.zIndex = '10000';
        this.selectedIcon.style.cursor = 'grab';
        this.selectedIcon.style.transition = 'none';
        
        // S'assurer que l'icône est dans le body
        if (this.selectedIcon.parentNode !== document.body) {
            document.body.appendChild(this.selectedIcon);
        }
        
        // Events
        this.selectedIcon.addEventListener('mousedown', (e) => this.startDrag(e));
        this.selectedIcon.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
        
        document.addEventListener('mouseup', (e) => this.stopDrag(e));
        document.addEventListener('touchend', (e) => this.stopDrag(e));
        
        console.log('✋ Icône draggable');
    }

    startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        this.selectedIcon.style.cursor = 'grabbing';
    }

    onDrag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const pos = this.getEventPosition(e);
        const iconWidth = this.selectedIcon.offsetWidth;
        const iconHeight = this.selectedIcon.offsetHeight;
        
        this.selectedIcon.style.left = `${pos.x - iconWidth / 2}px`;
        this.selectedIcon.style.top = `${pos.y - iconHeight / 2}px`;
        
        this.checkHoleProximity();
    }

    stopDrag(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.selectedIcon.style.cursor = 'grab';
        
        const inLeftHole = this.isIconInHole(this.leftHole);
        const inRightHole = this.isIconInHole(this.rightHole);
        
        if (inLeftHole) {
            console.log('📄 Trou gauche → Overlay');
            this.showOverlay();
        } else if (inRightHole) {
            console.log('⏳ Trou droite → Vidéo PLAY');
            this.isInRightHole = true;
            this.playVideo();
            this.keepIconInHole(this.rightHole);
        } else {
            if (this.isInRightHole) {
                console.log('🛑 Sorti du trou droite → Vidéo PAUSE');
                this.isInRightHole = false;
                this.pauseVideo();
            }
        }
        
        this.resetHoleStyles();
    }

    getEventPosition(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    checkHoleProximity() {
        const inLeft = this.isIconInHole(this.leftHole, 80);
        const inRight = this.isIconInHole(this.rightHole, 80);
        
        if (inLeft) {
            this.highlightHole(this.leftHole);
            this.resetHoleStyle(this.rightHole);
        } else if (inRight) {
            this.highlightHole(this.rightHole);
            this.resetHoleStyle(this.leftHole);
        } else {
            this.resetHoleStyles();
        }
    }

    isIconInHole(hole, threshold = 60) {
        if (!this.selectedIcon || !hole) return false;
        
        const iconRect = this.selectedIcon.getBoundingClientRect();
        const holeRect = hole.getBoundingClientRect();
        
        const iconCenterX = iconRect.left + iconRect.width / 2;
        const iconCenterY = iconRect.top + iconRect.height / 2;
        const holeCenterX = holeRect.left + holeRect.width / 2;
        const holeCenterY = holeRect.top + holeRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(iconCenterX - holeCenterX, 2) +
            Math.pow(iconCenterY - holeCenterY, 2)
        );
        
        return distance < threshold;
    }

    highlightHole(hole) {
        hole.style.borderColor = '#00ffff';
        hole.style.borderWidth = '4px';
        hole.style.boxShadow = `inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 255, 255, 0.6)`;
    }

    resetHoleStyle(hole) {
        hole.style.borderColor = '#555';
        hole.style.borderWidth = '3px';
        hole.style.boxShadow = `inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.5)`;
    }

    resetHoleStyles() {
        if (this.leftHole) this.resetHoleStyle(this.leftHole);
        if (this.rightHole) this.resetHoleStyle(this.rightHole);
    }

    keepIconInHole(hole) {
        const holeRect = hole.getBoundingClientRect();
        const iconWidth = this.selectedIcon.offsetWidth;
        const iconHeight = this.selectedIcon.offsetHeight;
        
        const holeCenterX = holeRect.left + holeRect.width / 2;
        const holeCenterY = holeRect.top + holeRect.height / 2;
        
        this.selectedIcon.style.transition = 'all 0.3s ease';
        this.selectedIcon.style.left = `${holeCenterX - iconWidth / 2}px`;
        this.selectedIcon.style.top = `${holeCenterY - iconHeight / 2}px`;
        
        setTimeout(() => {
            this.selectedIcon.style.transition = 'none';
        }, 300);
    }

    playVideo() {
        if (this.videoBackground) {
            this.videoBackground.play().then(() => {
                console.log('▶️ Vidéo PLAY');
            }).catch(err => {
                console.error('❌ Erreur vidéo:', err);
            });
        }
    }

    pauseVideo() {
        if (this.videoBackground) {
            this.videoBackground.pause();
            console.log('⏸️ Vidéo PAUSE');
        }
    }

    showOverlay() {
        if (this.overlayPage) {
            this.overlayPage.style.opacity = '1';
            this.overlayPage.style.visibility = 'visible';
        }
    }

    hideOverlay() {
        if (this.overlayPage) {
            this.overlayPage.style.opacity = '0';
            this.overlayPage.style.visibility = 'hidden';
        }
    }
}

// Instance unique
const twoHolesSystemInstance = new TwoHolesSystem();

// Exposer globalement
window.CompleteSystem = {
    startAfterIconPick: (icon, video) => twoHolesSystemInstance.startAfterIconPick(icon, video)
};
