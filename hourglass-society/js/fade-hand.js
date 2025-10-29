// ===== Script de disparition de .hand-mobile en fondu + vidéo background =====

(function() {
    // Attendre que le DOM soit prêt
    document.addEventListener('DOMContentLoaded', () => {
        const handMobile = document.querySelector('.hand-mobile');
        const smartphone = document.querySelector('.smartphone');
        const icons = document.querySelectorAll('.pickable-icon');
        
        if (!handMobile || !smartphone || icons.length === 0) {
            console.warn('hand-mobile, smartphone ou icônes non trouvés');
            return;
        }
        
        // Variable pour s'assurer qu'on ne déclenche qu'une fois
        let fadeTriggered = false;
        
        // Créer l'élément vidéo pour le background
        const videoBackground = document.createElement('video');
        videoBackground.id = 'video-background';
        videoBackground.style.position = 'fixed';
        videoBackground.style.top = '0';
        videoBackground.style.left = '0';
        videoBackground.style.width = '100vw';
        videoBackground.style.height = '100vh';
        videoBackground.style.objectFit = 'cover';
        videoBackground.style.zIndex = '-1';
        videoBackground.style.opacity = '0';
        videoBackground.style.transition = 'opacity 1s ease';
        videoBackground.muted = false; // Son actif
        videoBackground.loop = false; // Pas de boucle
        
        // Ajouter la source vidéo
        const source = document.createElement('source');
        source.src = 'img/Perso-Siteweb.mp4';
        source.type = 'video/mp4';
        videoBackground.appendChild(source);
        
        // Insérer la vidéo au début du body
        document.body.insertBefore(videoBackground, document.body.firstChild);
        
        // Écouter le clic sur chaque icône
        icons.forEach(icon => {
            icon.addEventListener('pointerdown', () => {
                if (!fadeTriggered) {
                    fadeTriggered = true;
                    
                    console.log('🎭 Une icône a été choisie - Fondu + Vidéo background');
                    
                    // 1. Ajouter la classe pour le fondu sur les deux éléments
                    handMobile.classList.add('fade-out');
                    smartphone.classList.add('fade-out');
                    
                    // 2. Lancer la vidéo avec un petit délai
                    setTimeout(() => {
                        // Rendre la vidéo visible
                        videoBackground.style.opacity = '1';
                        
                        // Lancer la vidéo
                        videoBackground.play().then(() => {
                            console.log('✅ Vidéo background lancée avec son');
                        }).catch(err => {
                            console.error('❌ Erreur lecture vidéo:', err);
                        });
                    }, 500); // 500ms pour laisser le fondu commencer
                }
            });
        });
    });
})();
