# EA HOURGLASS - Site Interactif

## 📁 Structure du Projet

```
hourglass-society/
├── index.html              # Page principale
├── css/                    # Fichiers de styles
│   ├── main.css           # Styles principaux (body, hand-mobile, smartphone)
│   ├── circle-hole.css    # Styles du cercle draggable et du trou
│   ├── fingerprint.css    # Styles de l'empreinte digitale (6 couches)
│   ├── access-screen.css  # Styles de l'écran d'accès avec icônes
│   └── responsive.css     # Styles responsive pour mobile/portrait
├── js/                     # Scripts JavaScript
│   ├── bg-anim.js         # Animation de confetti en arrière-plan (canvas)
│   ├── circle-hole.js     # Système de cercle draggable
│   ├── fingerprint.js     # Système d'empreinte digitale
│   ├── access-screen.js   # Système d'écran d'accès
│   ├── icon-follow.js     # Interaction icônes qui suivent le curseur
│   └── hand-mobile.js     # Animation de la main
└── img/                    # Images du projet
    ├── accueil-wallpaper.png
    ├── accueil.png
    ├── anim.png
    ├── bg-ae.jpg
    ├── bg-deverouillage.png
    ├── hand-mobile.png
    ├── hourglass.png
    └── settings.png
```

## 🎯 Fonctionnalités

1. **Interface Smartphone Futuriste**
   - Smartphone tenu par une main avec animation
   - Fond avec image wallpaper futuriste

2. **Cercle Draggable**
   - Cercle coloré aléatoire qui peut être déplacé
   - Trou cible en bas de l'écran
   - Effet de surbrillance quand le cercle est proche

3. **Scanner d'Empreinte**
   - Le cercle se transforme en empreinte digitale
   - 6 couches concentriques à cliquer
   - Animation de disparition spectaculaire

4. **Écran d'Accès**
   - Affichage après déverrouillage complet
   - 3 icônes interactives draggables
   - Effet de suivi du curseur

5. **Animation Canvas**
   - Confetti animés en arrière-plan
   - Zones mortes pour ne pas masquer les éléments

6. **Design Responsive**
   - Adaptation pour mode portrait mobile
   - Plein écran sur tablette/smartphone

## 🚀 Démarrage

Le serveur HTTP est déjà configuré et lancé sur le port 8080.

Pour accéder au site :
```
http://localhost:8080/
```

Pour redémarrer le serveur manuellement :
```bash
cd /app/hourglass-society
python3 -m http.server 8080
```

## 💻 Technologies Utilisées

- HTML5
- CSS3 (animations, flexbox, gradients)
- JavaScript vanilla (ES6+)
- Canvas API pour les animations
- ResizeObserver API
- Pointer Events API

## 🎨 Personnalisation

Les couleurs principales sont définies via des variables CSS :
- `--fingerprint-color` : Couleur de l'empreinte
- `--access-color` : Couleur de l'écran d'accès

## 📱 Responsive

Le site s'adapte automatiquement en mode portrait mobile :
- Suppression du décor de fond
- Smartphone en plein écran
- Désactivation des zones "erase"
