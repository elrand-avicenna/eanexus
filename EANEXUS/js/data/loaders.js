
// data/loaders.js
import { app } from '../core/state.js';
import { reorderProjetsPreferred } from '../core/utils.js';
import { MENU_ITEMS } from '../menu.config.js';

export async function loadData() {
  try {
    const [
      projetsRes, categoriesRes,
      travauxLudRes, travauxExpoRes, travauxCreaRes
    ] = await Promise.all([
      fetch('js/data/projets-racine.json'),
      fetch('js/data/categories.json'),
      fetch('js/data/travauxlud.json'),
      fetch('js/data/travauxexpo.json'),
      fetch('js/data/travauxcrea.json'),
      fetch('js/data/travauxpedag.json')
    ]);

    const projetsJson = await projetsRes.json();
    app.data.projetsRacine = reorderProjetsPreferred(projetsJson.projets || []);

    app.data.categories = await categoriesRes.json();

    const [lud, expo, crea] = await Promise.all([
      travauxLudRes.json(), travauxExpoRes.json(), travauxCreaRes.json()
    ]);
    app.data.travaux = { ...lud, ...expo, ...crea };

    // Menu : plus de menu.json -> on prend la config locale, sinon fallback projets
    if (Array.isArray(MENU_ITEMS) && MENU_ITEMS.length) {
      app.data.menuGlobal = MENU_ITEMS.slice();
    } else {
      app.data.menuGlobal = [
        { icone: '🏠', titre: 'Accueil', route: 'home', zone: 'header' },
        ...app.data.projetsRacine.map(p => ({ icone: p.logo || '✨', titre: p.titre, route: `projet:${p.id}`, zone: 'list' })),
        { icone: '👤', titre: 'Profil', route: 'profil', zone: 'list' },
        { icone: '🗓️', titre: 'Calendrier', route: 'calendrier', zone: 'footer' },
        { icone: '✉️', titre: 'Contact', route: 'contact', zone: 'footer' }
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
