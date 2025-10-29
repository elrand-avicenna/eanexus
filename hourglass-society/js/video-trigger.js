// ===== Système de déclenchement vidéo =====

class VideoTriggerSystem {
    constructor() {
        this.containerVideo = null;
        this.video = null;
        this.handMobile = null;
        this.iconsClicked = new Set();
        this.totalIcons = 3;
        this.videoTriggered = false;
    }

    init() {
        // Récupérer les éléments DOM
        this.containerVideo = document.getElementById('container-video');
        this.video = document.getElementById('main-video');
        this.handMobile = document.querySelector('.hand-mobile');

        if (!this.containerVideo || !this.video || !this.handMobile) {
            console.error('Éléments nécessaires non trouvés');
            return false;
        }

        // Écouter les événements sur les icônes
        this.attachIconListeners();

        // Événement de fin de vidéo (optionnel)
        this.video.addEventListener('ended', () => {
            console.log('Vidéo terminée');
        });

        return true;
    }

    attachIconListeners() {
        // Écouter les clics sur les 3 icônes
        const icons = document.querySelectorAll('.pickable-icon');
        
        icons.forEach((icon, index) => {
            // Utiliser mousedown au lieu de click pour capturer avant le drag
            icon.addEventListener('mousedown', () => {
                this.onIconInteracted(index);
            });
            
            icon.addEventListener('touchstart', () => {
                this.onIconInteracted(index);
            });
        });
    }

    onIconInteracted(iconIndex) {
        if (this.videoTriggered) return;

        console.log(`🖱️ Icône ${iconIndex + 1} cliquée - Déclenchement immédiat!`);

        // Déclencher IMMÉDIATEMENT dès la première icône
        this.triggerVideoAndDescend();
    }

    triggerVideoAndDescend() {
        if (this.videoTriggered) return;
        this.videoTriggered = true;

        console.log('🎬 Déclenchement de la séquence vidéo !');

        // Petit délai pour laisser finir l'interaction en cours
        setTimeout(() => {
            // 1. Activer le son de la vidéo
            this.video.muted = false;
            
            // 2. Afficher le container vidéo au premier plan
            this.containerVideo.classList.add('active');
            
            // 3. Supprimer les animations qui pourraient interférer
            this.handMobile.classList.remove('idle');
            
            // 4. Lancer l'animation de descente du portable
            this.handMobile.classList.add('descending');
            
            // 5. Lancer la vidéo
            this.video.play().then(() => {
                console.log('✅ Vidéo lancée avec son');
            }).catch(err => {
                console.error('Erreur lecture vidéo:', err);
            });

        }, 100);
    }

    reset() {
        this.iconsClicked.clear();
        this.videoTriggered = false;
        
        if (this.containerVideo) {
            this.containerVideo.classList.remove('active');
        }
        
        if (this.video) {
            this.video.pause();
            this.video.currentTime = 0;
            this.video.muted = true;
        }
        
        if (this.handMobile) {
            this.handMobile.classList.remove('descending');
            this.handMobile.classList.add('idle');
        }
    }
}

// Initialisation automatique
let videoTrigger = null;

document.addEventListener('DOMContentLoaded', () => {
    // Attendre que tous les systèmes soient chargés
    setTimeout(() => {
        videoTrigger = new VideoTriggerSystem();
        const success = videoTrigger.init();
        if (success) {
            console.log('✅ Système de déclenchement vidéo initialisé');
        }
    }, 500);
});

// Exposer globalement pour debug
window.VideoTrigger = {
    reset: () => videoTrigger?.reset(),
    trigger: () => videoTrigger?.triggerVideoAndDescend()
};
