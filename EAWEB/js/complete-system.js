// ===== Système de 2 trous avec contrôle vidéo (activé APRÈS le choix d'icône) =====

class TwoHolesSystem {
    constructor() {
        this.selectedIcon = null;
        this.videoBackground = null;
        this.leftHole = null;
        this.rightHole = null;
        this.overlayPage = null;
        
        // Spring system pour mouvement fluide
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.tx = 0;
        this.ty = 0;
        this.baseLeft = 0;
        this.baseTop = 0;
        
        // Configuration du ressort
        this.freqHz = 2.2;
        this.dampingRatio = 1.05;
        this.omega = 2 * Math.PI * this.freqHz;
        this.z = this.dampingRatio;
        
        // États
        this.isHolding = false;
        this.holdPointerId = null;
        this.isInRightHole = false;
        this.lastT = null;
        this.rafId = null;
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
        // Trou gauche (page) - Position plus à gauche
        this.leftHole = document.createElement('div');
        this.leftHole.className = 'interaction-hole left-hole';
        this.leftHole.innerHTML = '<span class="hole-icon">📄</span>';
        this.leftHole.style.cssText = `
            position: fixed;
            left: 10%;
            bottom: 20%;
            width: 130px;
            height: 130px;
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
        
        // Trou droite (sablier/vidéo) - Position plus à droite
        this.rightHole = document.createElement('div');
        this.rightHole.className = 'interaction-hole right-hole';
        this.rightHole.innerHTML = '<span class="hole-icon">⏳</span>';
        this.rightHole.style.cssText = `
            position: fixed;
            right: 10%;
            bottom: 20%;
            width: 130px;
            height: 130px;
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
        
        console.log('🕳️ Trous créés (écartés)');
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
        this.selectedIcon.style.cursor = 'pointer';
        this.selectedIcon.style.transition = 'none';
        this.selectedIcon.style.transformOrigin = 'top left';
        this.selectedIcon.style.transform = 'translate3d(0,0,0)';
        
        // Initialiser les positions
        this.baseLeft = iconRect.left;
        this.baseTop = iconRect.top;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.tx = 0;
        this.ty = 0;
        
        // S'assurer que l'icône est dans le body
        if (this.selectedIcon.parentNode !== document.body) {
            document.body.appendChild(this.selectedIcon);
        }
        
        // Empêcher la sélection et le drag natif
        this.selectedIcon.style.userSelect = 'none';
        this.selectedIcon.style.webkitUserDrag = 'none';
        this.selectedIcon.style.touchAction = 'none';
        
        // Events avec pointerevent pour unifier souris et tactile
        this.selectedIcon.addEventListener('pointerdown', (e) => this.startHold(e));
        document.addEventListener('pointermove', (e) => this.onHoldMove(e));
        document.addEventListener('pointerup', (e) => this.stopHold(e));
        document.addEventListener('pointercancel', (e) => this.stopHold(e));
        
        // Démarrer la boucle d'animation
        this.startAnimationLoop();
        
        console.log('✋ Icône draggable avec ressort fluide');
    }

    startAnimationLoop() {
        const animate = (t) => {
            if (!this.selectedIcon) {
                this.lastT = null;
                this.rafId = null;
                return;
            }
            
            if (this.lastT == null) this.lastT = t;
            const dt = Math.max(0.001, Math.min(0.032, (t - this.lastT) / 1000));
            this.lastT = t;
            
            this.stepSpring(dt);
            this.rafId = requestAnimationFrame(animate);
        };
        
        this.rafId = requestAnimationFrame(animate);
    }

    stepSpring(dt) {
        const ax = -2 * this.z * this.omega * this.vx - (this.omega * this.omega) * (this.x - this.tx);
        const ay = -2 * this.z * this.omega * this.vy - (this.omega * this.omega) * (this.y - this.ty);
        this.vx += ax * dt;
        this.vy += ay * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        if (this.selectedIcon) {
            this.selectedIcon.style.transform = `translate3d(${Math.round(this.x)}px, ${Math.round(this.y)}px, 0)`;
        }
    }

    startHold(e) {
        if (!this.selectedIcon) return;
        e.preventDefault();
        
        this.isHolding = true;
        this.holdPointerId = e.pointerId ?? null;
        this.setTargetCentered(e.clientX, e.clientY);
    }

    onHoldMove(e) {
        if (!this.isHolding || !this.selectedIcon) return;
        if (e.pointerId != null && this.holdPointerId != null && e.pointerId !== this.holdPointerId) return;
        
        this.setTargetCentered(e.clientX, e.clientY);
        
        // Vérifier proximité en temps réel
        this.checkHoleProximity();
    }

    stopHold(e) {
        if (e && this.holdPointerId != null && e.pointerId != null && e.pointerId !== this.holdPointerId) return;
        if (!this.isHolding) return;
        
        this.isHolding = false;
        this.holdPointerId = null;
        
        // Vérifier si dans un trou
        const inLeftHole = this.isIconInHole(this.leftHole);
        const inRightHole = this.isIconInHole(this.rightHole);
        
        console.log(`🔍 Check trous: gauche=${inLeftHole}, droite=${inRightHole}`);
        
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

    setTargetCentered(cx, cy) {
        if (!this.selectedIcon) return;
        
        const halfW = this.selectedIcon.offsetWidth / 2;
        const halfH = this.selectedIcon.offsetHeight / 2;
        
        let desiredLeft = cx - halfW;
        let desiredTop = cy - halfH;
        
        // Clamp au viewport
        const maxLeft = window.innerWidth - this.selectedIcon.offsetWidth;
        const maxTop = window.innerHeight - this.selectedIcon.offsetHeight;
        if (desiredLeft < 0) desiredLeft = 0;
        else if (desiredLeft > maxLeft) desiredLeft = maxLeft;
        if (desiredTop < 0) desiredTop = 0;
        else if (desiredTop > maxTop) desiredTop = maxTop;
        
        this.tx = desiredLeft - this.baseLeft;
        this.ty = desiredTop - this.baseTop;
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

    isIconInHole(hole, threshold = 80) {
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
        
        const isIn = distance < threshold;
        
        // Debug
        if (isIn) {
            const holeName = hole.classList.contains('left-hole') ? 'GAUCHE' : 'DROITE';
            console.log(`✅ Icône dans trou ${holeName} (distance: ${Math.round(distance)}px)`);
        }
        
        return isIn;
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
        
        // Utiliser le système de ressort pour un mouvement fluide
        const targetLeft = holeCenterX - iconWidth / 2;
        const targetTop = holeCenterY - iconHeight / 2;
        
        this.tx = targetLeft - this.baseLeft;
        this.ty = targetTop - this.baseTop;
        
        console.log('📍 Icône positionnée dans le trou');
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
