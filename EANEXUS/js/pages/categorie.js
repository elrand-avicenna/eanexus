
// pages/categorie.js
import { app } from '../core/state.js';

export function renderCategoriePage(projetId, categorieId) {
  app.state.currentPage = 'categorie';
  app.state.currentProjet = projetId;
  app.state.currentCategorie = categorieId;
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  const categories = app.data.categories[projetId] || [];
  const categorie = categories.find(c => c.id === categorieId);
  const travaux = app.data.travaux[categorieId] || [];

  if (!categorie) {
    document.getElementById('app').innerHTML = `
      <section class="grid-page active fade-in" style="padding:40px; color:white;">
        <h2>Catégorie introuvable</h2>
        <p>Vérifiez l'ID de catégorie ou vos fichiers JSON.</p>
      </section>`;
    return;
  }

  const container = document.getElementById('app');
  const headerStyle = categorie.background
    ? `background: ${categorie.background};`
    : `background: linear-gradient(135deg, ${categorie.couleur || '#333'} 0%, ${(categorie.couleur || '#333')}dd 100%);`;

  container.innerHTML = `
    <section class="categorie-page active fade-in">
      <header class="categorie-header" style="${headerStyle}">
        <div class="categorie-header-logo">${categorie.logo || ''}</div>
        <h1 class="categorie-header-titre">${categorie.titre}</h1>
        <p class="categorie-header-description">${categorie.description || ''}</p>
      </header>
      <div class="travaux-list" id="travauxList"></div>
    </section>
  `;

  const travauxList = document.getElementById('travauxList');
  travaux.forEach(travail => {
    const item = document.createElement('div');
    item.className = 'travail-item';
    if (travail.background) item.style.background = travail.background;

    item.innerHTML = `
      <div class="travail-header">
        <div class="travail-logo">${travail.logo || ''}</div>
        <div class="travail-header-content">
          <div class="travail-titre">${travail.titre}</div>
          <div class="travail-description-short">${travail.description || ''}</div>
        </div>
        <div class="travail-expand-icon">▼</div>
      </div>
      <div class="travail-body">
        <div class="travail-content">
          <img src="${travail.image}" alt="${travail.titre}" class="travail-image" />
          <div class="travail-infos"><strong>Thème :</strong> ${travail.theme || '—'}</div>
          <div class="travail-infos">${travail.infos || ''}</div>
          <button class="travail-btn" onclick="window.navigateTo('travail:${projetId}:${categorieId}:${travail.id}')">
            Voir les détails →
          </button>
        </div>
      </div>
    `;
    item.querySelector('.travail-header').onclick = (e) => {
      if (!e.target.classList.contains('travail-btn')) item.classList.toggle('expanded');
    };
    travauxList.appendChild(item);
  });
}
