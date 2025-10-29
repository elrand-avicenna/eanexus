// ===== Script de disparition de .hand-mobile en fondu =====

(function() {
    // Attendre que le DOM soit prêt
    document.addEventListener('DOMContentLoaded', () => {
        const handMobile = document.querySelector('.hand-mobile');
        const icons = document.querySelectorAll('.pickable-icon');
        
        if (!handMobile || icons.length === 0) {
            console.warn('hand-mobile ou icônes non trouvés');
            return;
        }
        
        // Variable pour s'assurer qu'on ne déclenche qu'une fois
        let fadeTriggered = false;
        
        // Écouter le clic sur chaque icône
        icons.forEach(icon => {
            icon.addEventListener('pointerdown', () => {
                if (!fadeTriggered) {
                    fadeTriggered = true;
                    
                    console.log('🎭 Une icône a été choisie - Fondu de .hand-mobile');
                    
                    // Ajouter la classe pour le fondu
                    handMobile.classList.add('fade-out');
                }
            });
        });
    });
})();
