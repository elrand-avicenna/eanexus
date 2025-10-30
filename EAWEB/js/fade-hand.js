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
            icon.addEventListener('click', (e) => {
                if (!fadeTriggered) {
                    fadeTriggered = true;
                    
                    console.log('🎭 Une icône a été choisie - Extraction immédiate');
                    
                    // IMPORTANT : Extraire l'icône IMMÉDIATEMENT avant le fade
                    const iconRect = icon.getBoundingClientRect();
                    icon.style.position = 'fixed';
                    icon.style.left = `${iconRect.left}px`;
                    icon.style.top = `${iconRect.top}px`;
                    icon.style.width = `${iconRect.width}px`;
                    icon.style.height = `${iconRect.height}px`;
                    icon.style.margin = '0';
                    icon.style.zIndex = '10000';
                    icon.style.opacity = '1';
                    icon.style.pointerEvents = 'auto';
                    
                    // Déplacer dans le body MAINTENANT
                    document.body.appendChild(icon);
                    console.log('✅ Icône extraite et visible');
                    
                    // 1. Ajouter la classe pour le fondu sur les deux éléments
                    handMobile.classList.add('fade-out');
                    smartphone.classList.add('fade-out');
                    
                    // 2. Attendre le fondu puis déclencher le système complet
                    setTimeout(() => {
                        // Masquer complètement
                        handMobile.style.display = 'none';
                        smartphone.style.display = 'none';
                        
                        console.log('📞 Tentative d\'appel à CompleteSystem...');
                        console.log('window.CompleteSystem existe ?', !!window.CompleteSystem);
                        console.log('window.CompleteSystem.startAfterIconPick existe ?', !!(window.CompleteSystem && window.CompleteSystem.startAfterIconPick));
                        
                        // Déclencher le système de 2 trous + vidéo
                        if (window.CompleteSystem && window.CompleteSystem.startAfterIconPick) {
                            console.log('✅ Appel de CompleteSystem.startAfterIconPick');
                            window.CompleteSystem.startAfterIconPick(icon, videoBackground);
                        } else {
                            console.error('❌ CompleteSystem non disponible !');
                        }
                    }, 1000); // Attendre la fin du fondu
                }
            }, false); // Bubble phase, après icon-follow
        });
    });
})();
