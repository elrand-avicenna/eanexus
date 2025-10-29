
// main.js
import { app } from './core/state.js';
import { initAccordionMenu } from './ui/accordion-menu.js';
import { initFilterMenu } from './ui/filter-menu.js';
import { loadData } from './data/loaders.js';
import { ensureMiniAudio, playAtIndex, miniAudio } from './audio/mini-audio.js';
import { navigateTo, goBack } from './router.js';
import { renderHomePage } from './pages/home.js';

// Expose global for inline onclick in generated markup
window.navigateTo = navigateTo;
window.goBack = goBack;

// Initialize real-time clock
function initClock() {
  const clockDate = document.getElementById('clockDate');
  const clockTime = document.getElementById('clockTime');
  
  if (!clockDate || !clockTime) return;
  
  function updateClock() {
    const now = new Date();
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    clockDate.textContent = `${dayName} ${day} ${month} ${year}`;
    clockTime.textContent = `${hours}:${minutes}:${seconds}`;
  }
  
  updateClock();
  setInterval(updateClock, 1000);
}

window.addEventListener('DOMContentLoaded', async () => {
  hydrateUI();
  initAccordionMenu();       // Initialize accordion menu instead of drawer
  initFilterMenu();          // Initialize filter menu
  ensureMiniAudio();         // crée le casque
  initClock();               // Initialize real-time clock
  await loadData();          // charge JSON (dont playlist + NPCs + Stadium)
  renderHomePage();

  // Si l’utilisateur a cliqué avant que la playlist n’arrive
  if (miniAudio.pendingFirstPlay && app.data.playlistAudio.length) {
    miniAudio.pendingFirstPlay = false;
    playAtIndex(0, false);
  }
});
