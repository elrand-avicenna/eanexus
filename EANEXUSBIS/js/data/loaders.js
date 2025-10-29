
// data/loaders.js
import { app } from '../core/state.js';
import { reorderProjetsPreferred } from '../core/utils.js';
import { MENU_ITEMS } from '../menu.config.js';

export async function loadData() {
  try {
    const [
      projetsRes, categoriesRes,
      travauxLudRes, travauxExpoRes, travauxCreaRes, travauxPedagRes,
      npcsRes, stadiumRes, stadiumCatRes, centerCatRes
    ] = await Promise.all([
      fetch('js/data/projets-racine-new.json'),
      fetch('js/data/categories.json'),
      fetch('js/data/travauxlud.json'),
      fetch('js/data/travauxexpo.json'),
      fetch('js/data/travauxcrea.json'),
      fetch('js/data/travauxpedag.json'),
      fetch('js/data/npcs.json'),
      fetch('js/data/stadium-events.json'),
      fetch('js/data/stadium-categories.json'),
      fetch('js/data/center-categories.json')
    ]);

    const projetsJson = await projetsRes.json();
    app.data.projetsRacine = reorderProjetsPreferred(projetsJson.projets || []);

    const categoriesJson = await categoriesRes.json();
    
    // Add Stadium and Center categories
    const stadiumCatJson = await stadiumCatRes.json();
    const centerCatJson = await centerCatRes.json();
    
    app.data.categories = {
      ...categoriesJson,
      'stadium': [
        { id: 'evenements', titre: 'Événements', logo: '📅', couleur: '#e74c3c', description: 'Tous les événements du NEXUS' },
        { id: 'calendar', titre: 'Calendrier', logo: '🗓️', couleur: '#f39c12', description: 'Calendrier complet' },
        { id: 'actualites', titre: 'Actualités', logo: '📰', couleur: '#667eea', description: 'Dernières nouvelles' }
      ],
      'center': [
        { id: 'habitants', titre: 'Habitants', logo: '👥', couleur: '#667eea', description: 'Personnages du NEXUS' },
        { id: 'lounge', titre: 'Lounge', logo: '🛋️', couleur: '#764ba2', description: 'Salle de repos' }
      ]
    };

    const [lud, expo, crea, pedag] = await Promise.all([
      travauxLudRes.json(), travauxExpoRes.json(), travauxCreaRes.json(), travauxPedagRes.json()
    ]);
    
    app.data.travaux = {
      ...lud, ...expo, ...crea, ...pedag,
      'evenements': stadiumCatJson['stadium-evenements'] || [],
      'calendar': stadiumCatJson['stadium-calendar'] || [],
      'actualites': stadiumCatJson['stadium-actualites'] || [],
      'habitants': centerCatJson['center-habitants'] || [],
      'lounge': centerCatJson['center-lounge'] || []
    };
    
    // Load NPCs
    const npcsJson = await npcsRes.json();
    app.data.npcs = npcsJson.npcs || [];

    // Load Stadium Events & Actualités
    const stadiumJson = await stadiumRes.json();
    app.data.stadiumEvents = stadiumJson.events || [];
    app.data.stadiumActualites = stadiumJson.actualites || [];

    // Menu : configuration
    if (Array.isArray(MENU_ITEMS) && MENU_ITEMS.length) {
      app.data.menuGlobal = MENU_ITEMS.slice();
    } else {
      app.data.menuGlobal = [
        { icone: '🏠', titre: 'Accueil', route: 'home', zone: 'header' },
        { icone: '👤', titre: 'COIN DE L\'AUTEUR', route: 'profil', zone: 'list' },
        { icone: '🗓️', titre: 'NEXUS CALENDAR', route: 'calendrier', zone: 'list' },
        { icone: '🏛️', titre: 'NEXUS CENTER', route: 'center', zone: 'list' }
      ];
    }

    // Playlist audio (optionnelle)
    try {
      const playlistRes = await fetch('js/data/playlist-audio.json');
      if (playlistRes.ok) {
        const playlistJson = await playlistRes.json();
        app.data.playlistAudio = playlistJson.audios || [];
        app.data.audioOptions = { ...app.data.audioOptions, ...(playlistJson.options || {}) };
      }
    } catch(_) {}

  } catch (err) {
    console.error('Erreur de chargement :', err);
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = `<div style="padding:20px; text-align:center; color:white">
        <h2>❌ Erreur de chargement</h2>
        <p>Vérifiez vos fichiers JSON.</p>
      </div>`;
    }
  }
}
