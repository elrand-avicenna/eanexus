# 🎬 Système de Déclenchement Vidéo

## Fonctionnalité Ajoutée

Lorsque l'utilisateur interagit avec les **3 icônes** dans l'écran d'accès :
1. Le **container-video** devient visible et passe au premier plan
2. L'animation de **descente du portable** se déclenche (comme si la main le range)
3. La **vidéo se lance automatiquement** avec le son activé
4. La vidéo ne se joue qu'**une seule fois** (pas de boucle)

## Fichiers Modifiés/Ajoutés

### 1. **index.html**
- ✅ Ajout du container-video avec la vidéo `Perso-Siteweb.mp4`
- ✅ Ajout du script `video-trigger.js`

### 2. **css/main.css**
- ✅ Styles pour `.container-video` (caché par défaut, z-index: -1)
- ✅ Styles pour `.container-video.active` (visible, z-index max)
- ✅ Animation `handDescend` pour faire descendre le portable
- ✅ Classe `.hand-mobile.descending` pour déclencher l'animation

### 3. **js/video-trigger.js** (NOUVEAU)
- ✅ Système qui détecte les interactions sur les 3 icônes
- ✅ Déclenche la séquence : vidéo + animation de descente
- ✅ Active le son de la vidéo
- ✅ Vidéo sans boucle (lecture unique)

### 4. **img/Perso-Siteweb.mp4** (NOUVEAU)
- ✅ Vidéo de 23 MB ajoutée au dossier img/

## Comment ça marche

```javascript
// Le système écoute les interactions sur les 3 icônes
icônes.forEach((icône) => {
  icône.addEventListener('mousedown', () => {
    iconsClicked.add(icôneIndex);
    
    // Quand les 3 icônes sont cliquées...
    if (iconsClicked.size >= 3) {
      // 1. Activer le son
      video.muted = false;
      
      // 2. Afficher la vidéo au premier plan
      containerVideo.classList.add('active');
      
      // 3. Descendre le portable
      handMobile.classList.add('descending');
      
      // 4. Lancer la vidéo
      video.play();
    }
  });
});
```

## Animation de Descente

```css
@keyframes handDescend {
  0% {
    transform: perspective(1200px) rotateX(0deg) translateY(0px);
    opacity: 1;
  }
  100% {
    transform: perspective(1200px) rotateX(18deg) translateY(150vh);
    opacity: 0;
  }
}
```

Le portable descend hors de l'écran en 3 secondes avec une animation fluide.

## Debug Console

Le système affiche des logs dans la console :
- ✅ Système de déclenchement vidéo initialisé
- 🖱️ Icône X interagie (Y/3)
- 🎬 Déclenchement de la séquence vidéo !
- ✅ Vidéo lancée avec son

## Fonctions Debug Disponibles

```javascript
// Réinitialiser le système
window.VideoTrigger.reset();

// Déclencher manuellement la vidéo
window.VideoTrigger.trigger();
```

## Séquence Complète d'Interaction

1. **Chargement** : Portable remonte (animation `handLift`)
2. **Idle** : Portable en mode attente avec micro-mouvements
3. **Cercle draggable** : L'utilisateur déplace le cercle dans le trou
4. **Empreinte** : 6 couches à cliquer pour déverrouiller
5. **Écran d'accès** : 3 icônes apparaissent
6. **Interaction icônes** : L'utilisateur clique/touche les 3 icônes
7. **🎬 DÉCLENCHEMENT** :
   - Container vidéo passe au premier plan
   - Portable descend et disparaît
   - Vidéo se lance avec son
   - Lecture unique (pas de loop)

## Configuration Vidéo

- **Format** : MP4
- **Son** : Activé automatiquement lors du déclenchement
- **Boucle** : Non (attribut `loop` absent)
- **Contrôles** : Cachés (pas d'attribut `controls`)
- **Affichage** : Plein écran (object-fit: cover)
