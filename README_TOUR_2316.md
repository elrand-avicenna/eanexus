# 🏢 Tour de Survie 2316 - MVP

## 📱 Vue d'Ensemble

**Tour de Survie 2316** est un jeu mobile narratif et immersif situé en l'an 2316. Les joueurs explorent une tour massive de 200 étages (100 vers le haut, 100 vers le bas), résolvent des énigmes, collectent des objets, et interagissent avec 10 NPCs via un smartphone fictif.

## 🎮 Concept du Jeu

### Histoire
- **Année**: 2316
- **Contexte**: Expérience de survie dans une tour futuriste
- **Objectif**: Explorer les étages, résoudre des énigmes, trouver des trésors
- **Particularité**: Tours parallèles - les joueurs ne peuvent pas se rencontrer physiquement

### Mécaniques Principales
1. **Exploration**: 10 salles par étage, chacune avec une énigme
2. **NPCs**: 10 personnages dans des tours parallèles
3. **Communication**: Via smartphone uniquement
4. **Affinité**: Système de relation avec les NPCs (0-100 points)
5. **Inventaire**: Collecte et fusion d'objets
6. **Temps Réel**: L'horloge affiche 2316 et influence le gameplay

## 🏗️ Architecture Technique

### Backend (FastAPI + MongoDB)
```
/app/backend/
├── server.py           # API principale avec tous les endpoints
├── models.py           # Modèles Pydantic (User, NPC, Affinity, etc.)
├── game_universe.py    # Configuration de l'univers et des NPCs
├── ai_service.py       # Service IA (mode mock par défaut, Gemini disponible)
└── requirements.txt
```

### Frontend (React Native + Expo)
```
/app/frontend/
├── app/
│   ├── index.tsx              # Écran d'intro et création utilisateur
│   ├── phone.tsx              # Interface smartphone principale
│   ├── messenger/
│   │   ├── index.tsx          # Liste des NPCs
│   │   └── [npc].tsx          # Chat avec un NPC
│   ├── inventory.tsx          # Inventaire d'objets
│   ├── tower.tsx              # Carte de la tour
│   ├── profile.tsx            # Profil utilisateur
│   ├── fusion.tsx             # Hourglass Eye (fusion d'objets)
│   ├── quests.tsx             # Tâches et quêtes
│   ├── calendar.tsx           # Calendrier 2316
│   └── social.tsx             # Réseau social
├── components/
│   ├── PhoneFrame.tsx         # Frame cyberpunk avec horloge 2316
│   └── AppIcon.tsx            # Icônes d'applications
├── stores/
│   └── gameStore.ts           # State management (Zustand)
└── package.json
```

## 🎨 Design Cyberpunk

### Palette de Couleurs
- **Primaire**: #00ffff (Cyan néon)
- **Secondaire**: #00ccff (Bleu cyan)
- **Accent**: #ff00ff (Magenta), #ffff00 (Jaune), #00ff88 (Vert)
- **Fond**: #000000, #0a0e27, #1a1e3f (Dégradés sombres)

### Style
- Néons et effets de glow
- Bordures lumineuses
- Grilles cyberpunk
- Typographie futuriste avec letterspacing

## 🤖 Les 10 NPCs

1. **Axel** - Ingénieur sarcastique (28 ans)
2. **Luna** - Biologiste cheerful (25 ans)
3. **Kai** - Stratège militaire sérieux (32 ans)
4. **Mira** - Hackeuse mystérieuse (26 ans)
5. **Zeke** - Médecin friendly (30 ans)
6. **Nova** - Archéologue curieuse (27 ans)
7. **Rex** - Ingénieur mécanicien pragmatique (35 ans)
8. **Iris** - Artiste timide (23 ans)
9. **Dante** - Cuisinier sarcastique (29 ans)
10. **Sage** - Philosophe sérieux (40 ans)

Chaque NPC a :
- Une personnalité unique
- Un emploi du temps (positions changent selon l'heure)
- Des secrets à révéler selon l'affinité
- Un style de conversation distinct

## 📊 Système d'Affinité

### Niveaux
- **STRANGER** (0-20): Méfiant, réponses courtes, 2-3 messages max
- **ACQUAINTANCE** (21-40): Poli mais distant, 5-7 messages
- **FRIEND** (41-60): Amical, partage infos basiques, 10-15 messages
- **CLOSE_FRIEND** (61-80): Chaleureux, aide activement, 20+ messages
- **BEST_FRIEND** (81-100): Très ouvert, partage secrets, illimité

### Comment gagner de l'affinité
- Envoyer des messages (+2 points de base)
- Messages positifs (+3 points bonus)
- Messages longs/engageants (+1 point)
- Messages négatifs (-5 points)

## 🎲 Premier Étage (MVP)

10 salles avec énigmes génériques :
1. **Salle d'Entrée**: Énigme de lettre
2. **Couloir Sombre**: Besoin de torche
3. **Porte Verrouillée**: Besoin de clé
4. **Salle des Miroirs**: Énigme du silence
5. **Bibliothèque**: Énigme de l'avenir
6. **Laboratoire**: Binaire (2+2)
7. **Jardin Intérieur**: Énigme du trou
8. **Atelier**: Énigme du clavier
9. **Chambre Secrète**: Énigme du Sphinx
10. **Sortie**: Mot de passe final

## 🚀 API Endpoints

### User
- `POST /api/user/create` - Créer un utilisateur
- `GET /api/user/{user_id}` - Récupérer un utilisateur
- `PUT /api/user/{user_id}/position` - Mettre à jour position

### NPCs
- `GET /api/npcs` - Liste tous les NPCs
- `GET /api/npcs/{npc_id}?user_id={user_id}` - Détails NPC avec infos révélées

### Affinity
- `GET /api/affinity/{user_id}` - Toutes les affinités
- `GET /api/affinity/{user_id}/{npc_id}` - Affinité spécifique
- `POST /api/affinity/{user_id}/{npc_id}/friend` - Ajouter en ami

### Messages
- `POST /api/messages/send?user_id={user_id}` - Envoyer un message
- `GET /api/messages/{user_id}/{npc_id}` - Historique messages

### Inventory
- `GET /api/inventory/{user_id}` - Inventaire utilisateur
- `POST /api/inventory/{user_id}/add` - Ajouter objet

### Rooms
- `GET /api/rooms/floor/{floor}` - Salles d'un étage
- `GET /api/rooms/{floor}/{room_number}` - Détails salle
- `POST /api/rooms/{floor}/{room_number}/attempt` - Tenter énigme

### Quests
- `GET /api/quests/{user_id}` - Quêtes utilisateur
- `POST /api/quests/{user_id}/create` - Créer quête

### Init
- `POST /api/init/game` - Initialiser le jeu (étage 0, objets de base)

## 🤖 IA pour les Dialogues

### Mode Mock (Par Défaut)
- Activé par défaut pour éviter les coûts
- Réponses basées sur la personnalité et l'affinité
- Pas de coût

### Mode IA Réelle (Gemini)
- À activer en changeant `USE_MOCK_AI=false` dans `.env`
- Utilise Gemini via Emergent LLM Key
- Coût: ~$0.0001-$0.0005 par message
- Réponses contextuelles et naturelles

### Configuration
Le fichier `/app/backend/game_universe.py` contient :
- Description de l'univers
- Profils détaillés des NPCs
- System prompts pour l'IA
- Vous pouvez éditer ce fichier pour personnaliser l'univers

## 📱 Applications Disponibles

1. **Messenger** ✅ - Communication avec NPCs
2. **Carte** ✅ - Visualisation de la tour et positions NPCs
3. **Inventaire** ✅ - Gestion des objets
4. **Hourglass Eye** 🚧 - Fusion d'objets (UI prête, logique à compléter)
5. **Tâches** 🚧 - Système de quêtes (UI prête)
6. **Profil** ✅ - Statistiques utilisateur
7. **Calendrier** ✅ - Affichage date 2316
8. **Réseau Social** ✅ - Liste des amis

## 🎯 Prochaines Étapes

### Phase 2 - Compléter le Gameplay
- [ ] Implémenter système de fusion complet
- [ ] Ajouter plus d'énigmes
- [ ] Système de quêtes dynamique
- [ ] Récompenses et achievements

### Phase 3 - Étages Supérieurs
- [ ] Générer étages 1-10
- [ ] Énigmes plus complexes
- [ ] Boss fights ou défis spéciaux

### Phase 4 - Features Avancées
- [ ] Activer IA Gemini pour dialogues réalistes
- [ ] Mini-jeux dans certaines salles
- [ ] Système de craft avancé
- [ ] Events temporels

### Phase 5 - Polish
- [ ] Animations et transitions
- [ ] Sons et musique cyberpunk
- [ ] Tutoriel interactif
- [ ] Sauvegarde cloud

## 🔧 Installation & Lancement

### Backend
```bash
cd /app/backend
pip install -r requirements.txt
python server.py  # ou via supervisorctl
```

### Frontend
```bash
cd /app/frontend
yarn install
yarn start
```

### Initialiser le Jeu
```bash
curl -X POST http://localhost:8001/api/init/game
```

## 🎮 Comment Jouer

1. **Créer un utilisateur** - Entrez votre nom
2. **Accéder au smartphone** - Navigation entre les apps
3. **Ajouter des amis NPCs** - Aller dans Messenger
4. **Commencer à discuter** - Gagner de l'affinité
5. **Explorer les salles** - Résoudre énigmes
6. **Collecter des objets** - Remplir l'inventaire
7. **Progresser** - Monter les étages

## 📝 Notes Importantes

### IA Mock vs Réelle
- **Mock** (par défaut): Gratuit, rapide, réponses génériques
- **Gemini**: Payant (~$0.0001-$0.0005/msg), réponses naturelles et contextuelles

Pour activer Gemini:
1. Obtenir la clé via `emergent_integrations_manager`
2. Modifier `USE_MOCK_AI=false` dans backend/.env
3. Implémenter l'appel Gemini dans `ai_service.py` (TODO commenté)

### Personnalisation
- Éditez `/app/backend/game_universe.py` pour modifier l'univers
- Ajoutez vos NPCs, secrets, emplois du temps
- Personnalisez les prompts IA

### Base de Données
- MongoDB stocke: users, npcs, affinities, messages, inventory, items, rooms, quests
- Données initialisées via `/api/init/game`

## 🎨 Screenshots

L'application affiche :
- ✅ Écran d'intro cyberpunk avec dégradés
- ✅ Interface smartphone avec apps iconifiées
- ✅ Horloge temps réel affichant 2316
- ✅ Design néon cyan/magenta
- ✅ Animations et effets de glow

## 🔐 Sécurité & Performance

- CORS activé pour développement
- AsyncStorage pour cache local
- API RESTful avec validation Pydantic
- Gestion d'erreurs complète
- Mode mock IA pour tests sans coût

## 👥 Contributeurs

MVP créé par l'agent Emergent AI.

---

**Bonne exploration de la Tour de Survie 2316! 🏢✨**
