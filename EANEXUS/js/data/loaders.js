
// data/loaders.js
import { app } from '../core/state.js';
import { reorderProjetsPreferred } from '../core/utils.js';
import { MENU_ITEMS } from '../menu.config.js';

export async function loadData() {
  try {
    const [
      projetsRes, categoriesRes,
      travauxLudRes, travauxExpoRes, travauxCreaRes, travauxPedagRes,
      npcsRes
    ] = await Promise.all([
      fetch('js/data/projets-racine-new.json'),
      fetch('js/data/categories.json'),
      fetch('js/data/travauxlud.json'),
      fetch('js/data/travauxexpo.json'),
      fetch('js/data/travauxcrea.json'),
      fetch('js/data/travauxpedag.json'),
      fetch('js/data/npcs.json')
    ]);

    const projetsJson = await projetsRes.json();
    app.data.projetsRacine = reorderProjetsPreferred(projetsJson.projets || []);

    app.data.categories = await categoriesRes.json();

    const [lud, expo, crea, pedag] = await Promise.all([
      travauxLudRes.json(), travauxExpoRes.json(), travauxCreaRes.json(), travauxPedagRes.json()
    ]);
    app.data.travaux = { ...lud, ...expo, ...crea, ...pedag };
    
    // Load NPCs
    const npcsJson = await npcsRes.json();
    app.data.npcs = npcsJson.npcs || [];

    // Menu : configuration avec NEXUS CENTER
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
