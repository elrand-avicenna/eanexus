# EA NEXUS - Site Web Refonte Complète

## 🎨 Changements Principaux

### Structure Réorganisée
**Avant:** 8 étages (Bienvenue, Profil, Ludique, Expo, Créatif, Pédago, Calendrier, Contact)
**Maintenant:** 5 étages verticaux + menus hamburger

#### Slider Vertical (5 Étages)
1. **NEXUS** - Page d'accueil/bienvenue
2. **NEXUS GAMING** - Projets ludiques (jeux, expériences interactives)
3. **NEXUS THEATER** - Projets expositions (installations artistiques)
4. **NEXUS ATELIER** - Projets créatifs (design, création numérique)
5. **NEXUS ACADEMY** - Projets pédagogiques (formations, ateliers)

### 📱 Navigation

#### Menu Hamburger HAUT (Navigation principale)
- **COIN DE L'AUTEUR** (Profil) - À propos, compétences, contact
- **NEXUS CALENDAR** (Actus) - Événements et actualités
- **NEXUS CENTER** - Hub interactif avec NPCs

#### Menu Hamburger BAS (Filtres)
- Tri alphabétique (A→Z / Z→A)
- Tri chronologique (Ancien→Récent / Récent→Ancien)
- Filtres thématiques (dépendent de la catégorie)
- Barre de recherche

## 🏛️ NEXUS CENTER - Nouvelle Fonctionnalité

### 10 NPCs Interactifs
Chaque NPC a:
- Nom, avatar, titre unique
- Niveau de compétence (7-10)
- Spécialité professionnelle
- Biographie personnalisée
- Message d'accueil unique

#### Liste des NPCs:
1. **Cipher** 🎭 - L'Énigmatique (Énigmes & Puzzles) - Niv. 8
2. **Nova** ⚡ - L'Innovatrice (Tech & Innovation) - Niv. 9
3. **Sage** 📚 - Le Bibliothécaire (Histoire & Sagesse) - Niv. 10
4. **Pixel** 🎮 - Le Gamer (Gaming & Compétition) - Niv. 7
5. **Melody** 🎵 - La Musicienne (Musique & Ambiance) - Niv. 8
6. **Glitch** 👾 - Le Hacker (Cybersécurité) - Niv. 9
7. **Aurora** 🌸 - La Jardinière (Nature & Écologie) - Niv. 7
8. **Volt** ⚙️ - L'Ingénieur (Ingénierie & Construction) - Niv. 8
9. **Echo** 🔮 - La Voyante (Divination & Intuition) - Niv. 10
10. **Blaze** 🔥 - Le Guerrier (Combat & Stratégie) - Niv. 9

### Salle de Repos
Zone de socialisation où vous pouvez:
- **💬 Discuter** - Chat en temps réel avec les NPCs
- **⚔️ Défier** - Système de duel au tour par tour

#### Système de Chat
- Interface messenger moderne
- Réponses personnalisées selon la personnalité du NPC
- Historique des conversations sauvegardé
- Timestamps et avatars

#### Système de Duel
- Combat tour par tour
- 3 actions: Attaque (20-30 dmg), Défense (+20 HP), Spécial (40-50 dmg)
- Barre de vie (100 HP)
- Log de combat détaillé
- Difficulté variable selon le niveau du NPC

## 🎨 Design Amélioré

### Mobile-First & Responsive
- Optimisé pour toutes les tailles d'écran
- Grid layouts adaptatifs
- Touch-friendly (boutons, cartes)

### Effets Visuels Modernes
- **Glassmorphism** - Effets de verre sur les cartes
- **Gradients** - Couleurs vibrantes et dynamiques
- **Animations** - Transitions fluides, hover effects
- **Shadows & Glow** - Profondeur et ambiance

### Palette de Couleurs
- Fond principal: `#0a0a0f` (noir profond)
- Cartes: `#1a1a24` (gris foncé)
- Accent: `#667eea` → `#764ba2` (gradient violet/bleu)
- Texte: `#ffffff` / `#b0b0b0`

## 📁 Structure des Fichiers

### Nouveaux Fichiers Créés
```
/app/EANEXUS/
├── js/
│   ├── data/
│   │   ├── npcs.json                  (10 NPCs avec profils)
│   │   └── projets-racine-new.json    (5 étages NEXUS)
│   ├── pages/
│   │   └── center.js                  (NEXUS CENTER, chat, duels)
│   └── ui/
│       └── filter-menu.js             (Menu filtres bas)
└── styles.css                          (Design refait)
```

### Fichiers Modifiés
- `js/main.js` - Ajout init filtres + NPCs
- `js/router.js` - Route NEXUS CENTER
- `js/data/loaders.js` - Chargement NPCs
- `js/pages/home.js` - Nouveau slider 5 étages
- `js/pages/static.js` - Pages Profil/Calendar améliorées
- `js/core/state.js` - State chats & duels
- `js/menu.config.js` - Nouveaux items menu
- `styles.css` - Refonte complète CSS

## 🚀 Fonctionnalités

### Page d'Accueil
- Scroll vertical snap (un étage = un écran)
- Indicateurs de navigation (dots)
- Images de fond immersives
- Numérotation des étages

### Navigation
- Hamburger menus (haut & bas)
- Transitions animées
- Backdrop blur
- Keyboard accessible (Escape pour fermer)

### NEXUS CENTER
- Grid responsive de NPCs
- Profils détaillés cliquables
- Salle de repos interactive
- Chat messenger
- Système de combat

### Filtres (Menu Bas)
- Recherche en temps réel
- Tri alphabétique/chronologique
- Filtres thématiques par catégorie
- Réinitialisation rapide

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (1 colonne)
- **Tablet**: 640px - 768px (2 colonnes)
- **Desktop**: > 768px (3 colonnes pour NPCs)

## ⚡ Performance

- Lazy loading des images
- CSS optimisé (variables)
- Animations GPU-accelerated
- Module ES6 (tree-shaking)

## 🎯 Points Techniques

### Technologies
- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **Style**: CSS3 (Custom Properties, Grid, Flexbox)
- **Architecture**: SPA (Single Page Application)
- **Data**: JSON statique

### Architecture
- **State Management**: Global app state
- **Routing**: Client-side routing
- **UI Components**: Modular pages/UI
- **Data Loading**: Promise.all parallel loading

## 🔮 Prochaines Étapes (Suggestions)

1. **Backend Integration**
   - API pour sauvegarder chats/duels
   - Base de données pour NPCs
   - Authentification utilisateur

2. **Améliorations NPCs**
   - IA pour réponses plus intelligentes
   - Plus d'actions (quêtes, échanges)
   - Système de progression

3. **Contenu**
   - Remplir les projets (categories.json, travaux*.json)
   - Ajouter images personnalisées
   - Événements dans le calendrier

4. **Features**
   - Système de favoris
   - Partage social
   - Mode sombre/clair toggle
   - Multilangue

## 📞 Support

Pour toute question sur la structure ou les modifications, consultez:
- `js/pages/center.js` - Logique NEXUS CENTER
- `js/ui/filter-menu.js` - Système de filtres
- `styles.css` (lignes 950+) - Nouveaux styles

---

**Version:** 2.0 - NEXUS Edition
**Date:** Octobre 2025
**Auteur:** EA LAB
