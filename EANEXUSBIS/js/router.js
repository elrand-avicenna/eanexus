
// router.js
import { app } from './core/state.js';
import { renderHomePage } from './pages/home.js';
import { renderSliderPage } from './pages/projet.js';
import { renderCategoriePage } from './pages/categorie.js';
import { renderTravailPage } from './pages/travail.js';
import { renderProfilPage, renderCalendrierPage, renderContactPage } from './pages/static.js';
import { renderCenterPage } from './pages/center.js';
import { renderStadiumPage } from './pages/stadium.js';
import { renderLaboPage } from './pages/labo.js';
import { renderHubPage } from './pages/hub.js';

export function animatePageChange(renderFn) {
  const appEl = document.getElementById('app');
  if (!appEl) return renderFn();
  appEl.classList.remove('page-enter');
  appEl.classList.add('page-leave');
  setTimeout(() => {
    renderFn();
    appEl.classList.remove('page-leave');
    void appEl.offsetWidth;
    appEl.classList.add('page-enter');
  }, 160);
}

export function navigateTo(route) {
  const [name, p1, p2, p3] = String(route || '').split(':');

  const go = () => {
    switch (name) {
      case 'home':
        app.state.history = [];
        renderHomePage();
        break;
      case 'hub':
        renderHubPage();
        break;
      case 'stadium':
        renderStadiumPage();
        break;
      case 'labo':
        renderLaboPage();
        break;
      case 'projet':
        app.state.history.push({ page: 'home' });
        renderSliderPage(p1);
        break;
      case 'categorie':
        app.state.history.push({ page: 'slider', projetId: p1 });
        renderCategoriePage(p1, p2);
        break;
      case 'travail':
        app.state.history.push({ page: 'categorie', projetId: p1, categorieId: p2 });
        renderTravailPage(p1, p2, p3);
        break;
      case 'profil': renderProfilPage(); break;
      case 'calendrier': renderCalendrierPage(); break;
      case 'contact': renderContactPage(); break;
      case 'center': renderCenterPage(); break;
      default:
        console.warn('Route inconnue:', route); renderHomePage();
    }
  };

  // Fermer le tiroir si ouvert + animer
  const drawer = document.getElementById('drawer');
  if (drawer && drawer.classList.contains('open')) {
    document.getElementById('backdrop')?.classList.remove('show');
    document.getElementById('burger')?.classList.remove('active');
    drawer.classList.remove('open');
  }
  animatePageChange(go);
}

export function goBack() {
  if (app.state.history.length > 0) {
    const previousState = app.state.history.pop();
    animatePageChange(() => {
      if (previousState.page === 'home') renderHomePage();
      else if (previousState.page === 'slider') renderSliderPage(previousState.projetId);
      else if (previousState.page === 'categorie') renderCategoriePage(previousState.projetId, previousState.categorieId);
      else if (previousState.page === 'stadium') renderStadiumPage();
      else if (previousState.page === 'labo') renderLaboPage();
      else if (previousState.page === 'center') renderCenterPage();
    });
  } else {
    // No history, go to home
    navigateTo('home');
  }
}

// Handle browser back button
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.page) {
    // Navigate based on saved state
    navigateTo(event.state.page);
  } else {
    goBack();
  }
});
