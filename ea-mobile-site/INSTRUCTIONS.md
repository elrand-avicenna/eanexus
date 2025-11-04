# EA Mobile S25 Ultra - Site Complet

## 📁 Structure du Dossier

```
ea-mobile-site/
├── index.html              # Page principale
├── styles.css              # Feuille de styles
├── app.js                  # JavaScript principal
├── README.md               # Guide de personnalisation
├── INSTRUCTIONS.md         # Ce fichier
├── data/                   # Données JSON
│   ├── portal.json         # Page d'accueil
│   ├── wallpapers.json     # Fonds d'écran
│   ├── playlist.json       # Musiques
│   └── projects.json       # Projets
└── media/                  # Vos médias locaux (à ajouter)
    ├── videos/
    │   ├── nexus.mp4
    │   ├── kajiit.mp4
    │   └── cyber.mp4
    └── music/
        ├── musique1.wav
        └── musique2.wav
```

## 🎬 Ajouter Vos Médias

### Étape 1 : Télécharger vos fichiers
Vos médias sont actuellement hébergés en ligne. Pour les utiliser localement :

**Vidéos :**
- Nexus.mp4 : https://customer-assets.emergentagent.com/job_mobile-hub-13/artifacts/6tcu83ul_Nexus.mp4
- Kajiit Mage Alchimiste.mp4 : https://customer-assets.emergentagent.com/job_mobile-hub-13/artifacts/z97nb42w_Kajiit%20Mage%20Alchimiste.mp4
- Cyber Haqueuse.mp4 : https://customer-assets.emergentagent.com/job_mobile-hub-13/artifacts/hg05l3f8_Cyber%20Haqueuse.mp4

**Musiques :**
- Musique 1.wav : https://customer-assets.emergentagent.com/job_mobile-hub-13/artifacts/bx6uroob_Musique%201.wav
- Musique 2.wav : https://customer-assets.emergentagent.com/job_mobile-hub-13/artifacts/f1jlazwh_Musique%202.wav

### Étape 2 : Placer les fichiers
1. Créez les dossiers `media/videos/` et `media/music/`
2. Téléchargez vos fichiers depuis les URLs ci-dessus
3. Placez-les dans les dossiers appropriés

### Étape 3 : Mettre à jour les URLs dans les fichiers JSON

**Dans `data/wallpapers.json` :**
```json
[
  {
    "id": 1,
    "type": "video",
    "title": "Nexus",
    "url": "media/videos/nexus.mp4",
    "poster": ""
  },
  {
    "id": 2,
    "type": "video",
    "title": "Kajiit Mage Alchimiste",
    "url": "media/videos/kajiit.mp4",
    "poster": ""
  },
  {
    "id": 3,
    "type": "video",
    "title": "Cyber Haqueuse",
    "url": "media/videos/cyber.mp4",
    "poster": ""
  }
]
```

**Dans `data/playlist.json` :**
```json
[
  {
    "id": 1,
    "title": "Voyage Spatial",
    "artist": "EA Compositions",
    "url": "media/music/musique1.wav",
    "cover": ""
  },
  {
    "id": 2,
    "title": "Ambiance Cyberpunk",
    "artist": "EA Créations",
    "url": "media/music/musique2.wav",
    "cover": ""
  }
]
```

## 🚀 Utilisation du Site

### Option 1 : Ouvrir directement
Double-cliquez sur `index.html` pour ouvrir dans votre navigateur.

### Option 2 : Serveur local (recommandé pour les médias)
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js
npx http-server

# Puis ouvrez : http://localhost:8000
```

## 📝 Personnaliser le Contenu

### Modifier les projets
Éditez `data/projects.json` avec vos propres projets.

### Changer le fond d'écran par défaut
Dans `app.js`, ligne ~280, modifiez l'index :
```javascript
setWallpaper(0); // 0 = premier fond, 1 = deuxième, etc.
```

### Modifier le profil auteur
Dans `index.html`, section `<!-- Le Coin de l'Auteur -->`.

## 🎨 Personnaliser le Design

### Changer les couleurs
Dans `styles.css`, recherchez :
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Remplacez `#667eea` et `#764ba2` par vos couleurs.

## 📱 Fonctionnalités

- ✅ Design Samsung S25 Ultra responsive
- ✅ Fond d'écran vidéo animé (3 choix)
- ✅ Lecteur de musique persistant (2 musiques)
- ✅ 6 applications dans le dock
- ✅ 5 applications de projets (EA NEXUS)
- ✅ Calendrier interactif
- ✅ Sauvegarde des préférences (localStorage)
- ✅ Animations fluides type smartphone

## 💡 Conseils

1. **Optimiser les vidéos** : Utilisez des vidéos compressées (< 20 MB) pour un chargement rapide
2. **Format audio** : MP3, WAV, ou OGG sont supportés
3. **Navigation** : Utilisez ESC ou le bouton retour pour revenir au portail
4. **Persistance** : Vos choix (fond d'écran, musique) sont sauvegardés automatiquement

## 🆘 Support

Pour toute question ou problème, consultez le fichier `README.md` pour plus de détails sur la personnalisation.

---

**Version :** 1.0  
**Dernière mise à jour :** Novembre 2024
