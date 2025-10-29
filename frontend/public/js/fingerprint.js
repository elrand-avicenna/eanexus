// ===== Système d'empreinte futuriste =====

class FingerprintSystem {
    constructor() {
        this.fingerprint = null;
        this.clickCount = 0;
        this.onComplete = null; // Callback pour quand toutes les couches disparaissent

        // bind pour pouvoir détacher proprement
        this.updateMask = this.updateMask.bind(this);
        this._resizeObserver = null;
    }

    create(parent, color) {
        this.fingerprint = document.createElement('div');
        this.fingerprint.className = 'fingerprint';
        
        // Conteneur du motif
        const pattern = document.createElement('div');
        pattern.className = 'fingerprint-pattern';
        
        // Créer 6 couches concentriques futuristes
        for (let i = 0; i < 6; i++) {
            const layer = document.createElement('div');
            layer.className = 'fingerprint-layer';
            pattern.appendChild(layer);
        }
        
        // Créer 10 détails futuristes (lignes + points)
        for (let i = 0; i < 10; i++) {
            const detail = document.createElement('div');
            detail.className = 'fingerprint-detail';
            pattern.appendChild(detail);
        }
        
        this.fingerprint.appendChild(pattern);
        parent.appendChild(this.fingerprint);
        
        // Appliquer la couleur
        this.setColor(color);

        // Événement de clic (fait disparaître couche + met à jour la zone morte)
        this.fingerprint.addEventListener('click', () => this.onClick());

        // Observer les changements de taille (responsive) pour ajuster la zone morte
        if ('ResizeObserver' in window) {
            this._resizeObserver = new ResizeObserver(() => {
                // micro-délai pour laisser finir un layout/transition éventuel
                requestAnimationFrame(this.updateMask);
            });
            this._resizeObserver.observe(this.fingerprint);
        } else {
            // fallback: recalcule à chaque resize fenêtre
            window.addEventListener('resize', this.updateMask);
        }

        // 1er calcul de masque (après insertion DOM pour que les rects soient corrects)
        requestAnimationFrame(this.updateMask);
        
        return this.fingerprint;
    }

    setColor(color) {
        if (!this.fingerprint) return;
        
        const rgb = this.hexToRgb(color);
        this.fingerprint.style.setProperty('--fingerprint-color', color);
        this.fingerprint.style.setProperty('--fingerprint-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);
    }

    show() {
        if (!this.fingerprint) return;
        
        this.fingerprint.classList.add('active');
        
        // Marquer la première couche après stabilisation
        setTimeout(() => {
            const layers = this.fingerprint.querySelectorAll('.fingerprint-layer');
            if (layers.length > 0) {
                layers[0].classList.add('next-to-disappear');
            }
            // Zone morte à jour
            this.updateMask();
        }, 300);
    }

    hide() {
        if (!this.fingerprint) return;
        
        this.fingerprint.style.opacity = '0';
        this.fingerprint.style.visibility = 'hidden';

        // On retire la zone morte côté canvas
        if (window.bgAnim && typeof window.bgAnim.clearFingerprintMask === 'function') {
            window.bgAnim.clearFingerprintMask();
        }
    }

    onClick() {
        if (this.clickCount >= 6) return;
        
        const layers = this.fingerprint.querySelectorAll('.fingerprint-layer');
        
        if (this.clickCount < layers.length) {
            // Nettoyage des animations précédentes
            layers.forEach(layer => layer.classList.remove('next-to-disappear'));
            
            // Disparition de la couche actuelle
            const layerToRemove = layers[this.clickCount];
            layerToRemove.classList.add('disappearing');

            // ⚠️ Mise à jour immédiate du masque pour que la zone morte se rétrécisse dès le clic
            this.updateMask();
            
            this.clickCount++;
            
            // Préparation de la prochaine couche
            if (this.clickCount < layers.length) {
                const nextLayer = layers[this.clickCount];
                setTimeout(() => {
                    nextLayer.classList.add('next-to-disappear');
                    // rafraîchir le masque (au cas où les tailles changeraient)
                    this.updateMask();
                }, 300);
            }
            
            // Vérification de fin (plus de couches)
            if (this.clickCount >= layers.length) {
                // Laisse finir l'anim de la dernière couche puis callback + clear masque
                setTimeout(() => {
                    if (this.onComplete) {
                        this.onComplete();
                    }
                    if (window.bgAnim && typeof window.bgAnim.clearFingerprintMask === 'function') {
                        window.bgAnim.clearFingerprintMask();
                    }
                }, 600);
            }
        }
    }

    onFingerprinted(callback) {
        this.onComplete = callback;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 255, b: 255 };
    }

    reset() {
        this.clickCount = 0;
        if (this.fingerprint) {
            this.fingerprint.classList.remove('active');
            this.fingerprint.style.opacity = '0';
            this.fingerprint.style.visibility = 'hidden';
            
            // Reset des couches
            const layers = this.fingerprint.querySelectorAll('.fingerprint-layer');
            layers.forEach(layer => {
                layer.classList.remove('disappearing', 'next-to-disappear');
                layer.style.opacity = '';
                layer.style.visibility = '';
                layer.style.display = ''; // au cas où tu utilises display:none
            });
        }

        // Retire toute zone morte liée à l'empreinte
        if (window.bgAnim && typeof window.bgAnim.clearFingerprintMask === 'function') {
            window.bgAnim.clearFingerprintMask();
        }
    }

    /* =======================
       ===  ZONE MORTE  ===
       ======================= */

    // Construit la liste des cercles à partir des couches NON encore "disparues"
    // – on exclut immédiatement les .disappearing pour que la zone se rétrécisse au clic
    _collectVisibleCircles() {
        if (!this.fingerprint) return [];

        const circles = [];
        const layers = this.fingerprint.querySelectorAll('.fingerprint-layer');

        layers.forEach(el => {
            // on ignore les couches "disappearing" (déjà cliquées)
            if (el.classList.contains('disappearing')) return;

            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity || '1') <= 0) {
                return;
            }

            const r = el.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) return;

            const cx = r.left + r.width / 2;
            const cy = r.top  + r.height / 2;
            const radius = Math.min(r.width, r.height) / 2;

            circles.push({ cx, cy, r: radius });
        });

        return circles;
    }

    // Envoie les cercles à bg-anim ; si plus aucun cercle => on supprime la zone morte
    updateMask() {
        if (!window.bgAnim) return; // bg-anim.js pas encore chargé
        const circles = this._collectVisibleCircles();

        if (circles.length) {
            // coords en "page"
            window.bgAnim.setFingerprintCircles(circles, 'page');
        } else {
            // plus de fingerprint => plus de zone morte
            window.bgAnim.clearFingerprintMask();
        }
    }

    destroy() {
        if (this._resizeObserver) {
            try { this._resizeObserver.unobserve(this.fingerprint); } catch (e) {}
            this._resizeObserver = null;
        } else {
            window.removeEventListener('resize', this.updateMask);
        }
        if (this.fingerprint) {
            this.fingerprint.removeEventListener('click', this.onClick);
        }
        if (window.bgAnim && typeof window.bgAnim.clearFingerprintMask === 'function') {
            window.bgAnim.clearFingerprintMask();
        }
    }
}
