// ===== Système d'écran d'accès autorisé =====

class AccessScreenSystem {
    constructor() {
        this.accessScreen = null;
        this.isVisible = false;
    }

    init(elementId = 'access-screen') {
        this.accessScreen = document.getElementById(elementId);
        
        if (!this.accessScreen) {
            console.error(`Élément #${elementId} non trouvé dans le HTML`);
            return false;
        }
        
        return true;
    }

    show(color = '#4ecdc4', delay = 300) {
        if (!this.accessScreen) return;
        
        // Appliquer la couleur
        this.setColor(color);
        
        // Afficher avec délai
        setTimeout(() => {
            this.accessScreen.classList.add('active');
            this.isVisible = true;
        }, delay);
    }

    hide(delay = 0) {
        if (!this.accessScreen) return;
        
        setTimeout(() => {
            this.accessScreen.classList.remove('active');
            this.isVisible = false;
        }, delay);
    }

    setColor(color) {
        if (!this.accessScreen) return;
        
        this.accessScreen.style.setProperty('--access-color', color);
    }

    setText(title, subtitle, status = null) {
        if (!this.accessScreen) return;
        
        const titleElement = this.accessScreen.querySelector('.access-screen-title');
        const subtitleElement = this.accessScreen.querySelector('.access-screen-subtitle');
        const statusElement = this.accessScreen.querySelector('.access-screen-status');
        
        if (titleElement) titleElement.textContent = title;
        if (subtitleElement) subtitleElement.textContent = subtitle;
        if (statusElement && status) {
            statusElement.textContent = status;
            statusElement.style.display = 'block';
        } else if (statusElement) {
            statusElement.style.display = 'none';
        }
    }

    setIcon(icon) {
        if (!this.accessScreen) return;
        
        const iconElement = this.accessScreen.querySelector('.access-screen-content');
        if (iconElement) iconElement.textContent = icon;
    }

    isShowing() {
        return this.isVisible;
    }

    // Méthodes prédéfinies pour différents états
    showSuccess(color = '#4ecdc4') {
        this.setText('ACCÈS AUTORISÉ', 'Empreinte digitale authentifiée', 'Connexion sécurisée');
        // this.setIcon('🔓');
        this.show(color);
    }

    showError(color = '#ff6b6b') {
        this.setText('ACCÈS REFUSÉ', 'Empreinte non reconnue', 'Veuillez réessayer');
        this.setIcon('🔒');
        this.show(color);
    }

    showLoading(color = '#feca57') {
        this.setText('ANALYSE EN COURS', 'Vérification de l\'empreinte...', 'Patientez...');
        this.setIcon('⏳');
        this.show(color);
    }

    reset() {
        this.hide();
        // Reset par défaut après animation
        setTimeout(() => {
            this.setText('ACCÈS AUTORISÉ', 'Empreinte digitale authentifiée');
            this.setIcon('🔓');
            this.setColor('#4ecdc4');
        }, 1500);
    }
}