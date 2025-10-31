# 🎯 Générateur de QR Code - Carte de Contact

## 📋 Description

Ce générateur HTML statique vous permet de créer des QR codes personnalisés pour votre carte de contact mobile.

## 🚀 Comment l'utiliser

### Option 1: Utilisation Locale
1. **Téléchargez le fichier** `qr-generator.html` sur votre ordinateur
2. **Double-cliquez** sur le fichier pour l'ouvrir dans votre navigateur
3. **Modifiez** les informations (téléphone, email, site web)
4. **Cliquez** sur "Générer QR Code"
5. **Téléchargez** le QR code en PNG

### Option 2: Depuis ce serveur
Ouvrez dans votre navigateur:
```
http://localhost/qr-generator.html
```

## ✨ Fonctionnalités

- ✅ **Modification facile** des coordonnées (téléphone, email, site)
- ✅ **Génération instantanée** du QR code
- ✅ **Format vCard** standard (compatible avec tous les smartphones)
- ✅ **Téléchargement en PNG** haute qualité (300x300px)
- ✅ **Design moderne** et responsive
- ✅ **100% gratuit** et sans connexion internet (après le premier chargement)

## 📱 Format du QR Code

Le QR code généré utilise le format **vCard 3.0**, qui contient:
- 👤 Nom: ELRAND AVICENNA
- 💼 Titre: GAME DESIGNER - ANIMATEUR LUDIQUE
- 📞 Téléphone: (votre numéro)
- 📧 Email: (votre email)
- 🌐 Site web: (votre URL)

## 🎨 Personnalisation

Pour personnaliser davantage:

### Changer les couleurs du QR code
Modifiez les lignes 177-178 dans le HTML:
```javascript
colorDark: "#000000",  // Couleur des carrés
colorLight: "#ffffff", // Couleur du fond
```

### Changer la taille du QR code
Modifiez les lignes 175-176:
```javascript
width: 300,  // Largeur en pixels
height: 300, // Hauteur en pixels
```

## 💾 Sauvegarde

**Important:** Gardez ce fichier HTML précieusement! Vous pouvez:
- Le copier sur une clé USB
- Le sauvegarder dans le cloud (Dropbox, Google Drive)
- L'envoyer par email à vous-même
- Le versionner sur GitHub

## 🔧 Dépendances

Le générateur utilise:
- **QRCode.js** (chargé depuis CDN) pour la génération des QR codes
- Aucune dépendance locale nécessaire

## 📖 Utilisation du QR Code

Une fois généré:
1. Imprimez-le sur vos cartes de visite
2. Ajoutez-le à votre portfolio
3. Partagez-le sur les réseaux sociaux
4. Intégrez-le dans vos présentations

Quand quelqu'un scanne le QR code:
- Sur **iPhone**: L'appareil photo natif peut le scanner
- Sur **Android**: Google Lens ou l'appareil photo peut le scanner
- Le contact s'ajoutera automatiquement dans leur carnet d'adresses!

## 🎯 Astuce Pro

Pour créer plusieurs versions:
1. Modifiez les informations
2. Générez le QR code
3. Téléchargez-le avec un nom unique
4. Répétez pour différentes versions

Le fichier téléchargé aura automatiquement un timestamp: `qrcode-contact-[timestamp].png`

## 🆘 Support

Si le QR code ne se génère pas:
- Vérifiez votre connexion internet (pour charger la bibliothèque QRCode.js)
- Essayez un autre navigateur (Chrome, Firefox, Safari, Edge)
- Videz le cache de votre navigateur

---

**Créé pour:** ELRAND AVICENNA  
**Date:** Octobre 2024  
**Version:** 1.0
