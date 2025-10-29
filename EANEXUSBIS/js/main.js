
// main.js
import { app } from './core/state.js';
import { initFilterMenu } from './ui/filter-menu.js';
import { loadData } from './data/loaders.js';
import { ensureMiniAudio, playAtIndex, miniAudio } from './audio/mini-audio.js';
import { navigateTo, goBack } from './router.js';
import { renderHomePage } from './pages/home.js';

// Expose global for inline onclick in generated markup
window.navigateTo = navigateTo;
window.goBack = goBack;

window.addEventListener('DOMContentLoaded', async () => {
  initFilterMenu();          // Initialize filter menu
  initClockModal();          // Initialize clock modal
  ensureMiniAudio();         // crée le casque
  await loadData();          // charge JSON (dont playlist + NPCs + Stadium)
  renderHomePage();

  // Si l’utilisateur a cliqué avant que la playlist n’arrive
  if (miniAudio.pendingFirstPlay && app.data.playlistAudio.length) {
    miniAudio.pendingFirstPlay = false;
    playAtIndex(0, false);
  }
});
