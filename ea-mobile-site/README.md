# EA Mobile S25 Ultra - Guide de Personnalisation

Bienvenue sur votre interface smartphone personnalisée ! Ce guide vous aidera à remplacer le contenu d'exemple par vos propres projets et médias.

## 🎯 Accéder au site

Votre site est accessible à : **https://mobile-hub-13.preview.emergentagent.com/s25/index.html**

## 📁 Structure des Fichiers

```
/s25/
├── index.html          # Page principale
├── styles.css          # Styles
├── app.js             # Logique JavaScript
├── data/              # Fichiers de données à personnaliser
│   ├── portal.json    # Page d'accueil et notifications
│   ├── wallpapers.json # Fonds d'écran (vidéos/images)
│   ├── playlist.json  # Playlist musicale
│   └── projects.json  # Tous vos projets
└── README.md          # Ce fichier
```

## 🎨 Personnaliser le Contenu

### 1. Page d'Accueil (portal.json)

```json
{
  "welcomeTitle": "Votre titre personnalisé",
  "welcomeText": "Votre description",
  "notifications": [
    {
      "id": 1,
      "title": "🎮 Titre de la notification",
      "summary": "Description de la notification"
    }
  ]
}
```

### 2. Fonds d'Écran (wallpapers.json)

```json
[
  {
    "id": 1,
    "type": "video",
    "title": "Nom de votre vidéo",
    "url": "URL_DE_VOTRE_VIDEO.mp4",
    "poster": ""
  }
]
```

**Comment ajouter vos vidéos/images :**
1. Uploadez vos fichiers sur un hébergement (Dropbox, Google Drive en public, etc.)
2. Copiez l'URL directe du fichier
3. Ajoutez-la dans wallpapers.json
4. Changez `"type"` en `"image"` pour une image

### 3. Playlist Musicale (playlist.json)

```json
[
  {
    "id": 1,
    "title": "Titre de votre musique",
    "artist": "Nom de l'artiste",
    "url": "URL_DE_VOTRE_MUSIQUE.mp3",
    "cover": ""
  }
]
```

### 4. Vos Projets (projects.json)

Le fichier le plus important ! Il contient toutes les catégories et projets.

#### Structure d'une catégorie :

```json
{
  "id": "animConnect",
  "name": "Anim'Connect",
  "icon": "🎭",
  "summary": "Description de votre catégorie",
  "items": [
    {
      "title": "Nom du projet",
      "description": "Description détaillée",
      "date": "Aujourd'hui",
      "icon": "🔐"
    }
  ]
}
```

#### Les 5 Catégories :

1. **animConnect** (Anim'Connect) - Interface WhatsApp
   - Projets d'animation ludique
   - Chaque item = une conversation

2. **echoSphere** (Echo-Sphere) - Interface LinkedIn/Facebook
   - Histoires et contenus narratifs
   - Chaque item = un post sur le feed

3. **arena** (Arena) - Interface Gaming Hub
   - Jeux d'affrontement
   - Chaque item = une carte de jeu
   - Ajoutez un champ `"tag"` pour le genre

4. **adventures** (Adventures) - Interface Habit Tracker
   - Jeux d'aventure
   - Chaque item = une quête/habitude
   - Ajoutez un champ `"progress"` (ex: "7/10")

5. **medias** (Medias) - Interface YouTube
   - Vidéos et musiques
   - Chaque item = une vidéo
   - Ajoutez `"views"` et `"date"` pour les métadonnées

## 🎵 Utilisation des Fonctionnalités

### Lecteur de Musique (Casque)
- Cliquez sur une musique dans la playlist pour la jouer
- Utilisez les contrôles : précédent, play/pause, suivant
- Ajustez le volume avec le slider
- **La musique continue de jouer** en arrière-plan quand vous naviguez !

### Sélecteur de Fond d'Écran (Fond)
- Cliquez sur une vidéo/image pour l'appliquer
- Le fond d'écran s'applique immédiatement
- **Votre choix est sauvegardé** même après rechargement

### Calendrier
- Naviguez entre les mois avec les flèches
- Le jour actuel est surligné en bleu

### EA NEXUS
- Hub pour accéder aux 5 catégories d'apps
- Chaque app s'ouvre avec une animation fluide

## 🛠️ Modifier le Profil Auteur

Dans `index.html`, cherchez la section `<!-- Le Coin de l'Auteur -->` :

```html
<div class="author-avatar">EA</div>
<h3 class="author-name">Expert Auteur</h3>
<p class="author-bio">Votre biographie personnalisée...</p>
```

Modifiez :
- Le texte dans `author-avatar` (initiales)
- `author-name` (votre nom)
- `author-bio` (votre description)
- Les liens sociaux en bas

## 🎨 Personnaliser les Couleurs

Dans `styles.css`, changez les couleurs du thème :

```css
/* Couleur principale (gradient) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Remplacez #667eea par votre couleur principale */
/* Remplacez #764ba2 par votre couleur secondaire */
```

## 📱 Fonctionnalités Clés

✅ **Responsive** - Adapté mobile et desktop
✅ **Animations fluides** - Transitions type smartphone
✅ **Fond d'écran vidéo** - Avec sélection en direct
✅ **Musique persistante** - Continue en arrière-plan
✅ **Dock fixe** - Toujours accessible
✅ **5 types d'apps** - Layouts différents et adaptés
✅ **Données JSON** - Facile à éditer sans toucher au code
✅ **LocalStorage** - Mémorise vos préférences

## 🚀 Prochaines Étapes

1. **Remplacez les exemples** dans les fichiers JSON par vos vrais projets
2. **Uploadez vos médias** (vidéos, musiques) et mettez à jour les URLs
3. **Personnalisez le profil** auteur avec vos informations
4. **Ajustez les couleurs** selon votre charte graphique
5. **Testez sur mobile** pour voir le rendu responsive

## 💡 Astuces

- **Icônes** : Utilisez des emojis dans les champs `icon` pour une personnalisation rapide
- **URLs vidéos** : Assurez-vous qu'elles sont en HTTPS et accessibles publiquement
- **Taille des fichiers** : Privilégiez des vidéos optimisées pour le web (< 20 MB)
- **Format audio** : MP3, WAV, OGG sont supportés

## 🐛 Dépannage

**La vidéo de fond ne se charge pas ?**
- Vérifiez que l'URL est correcte et accessible
- Assurez-vous que c'est un lien direct vers le fichier (pas une page de partage)

**La musique ne se lance pas ?**
- Les navigateurs bloquent l'autoplay audio - cliquez sur play manuellement
- Vérifiez que l'URL du fichier audio est valide

**Les projets ne s'affichent pas ?**
- Vérifiez la syntaxe JSON (pas de virgule après le dernier élément)
- Ouvrez la console du navigateur (F12) pour voir les erreurs

## 📧 Support

Si vous avez des questions ou besoin d'aide pour personnaliser votre site, n'hésitez pas à demander !

---

**Bon développement créatif ! 🎨✨**
