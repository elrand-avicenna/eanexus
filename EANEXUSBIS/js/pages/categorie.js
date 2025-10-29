
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
  let travaux = app.data.travaux[categorieId] || [];

  if (!categorie) {
    document.getElementById('app').innerHTML = `
      <section class="grid-page active fade-in" style="padding:40px; color:white;">
        <h2>Catégorie introuvable</h2>
        <p>Vérifiez l'ID de catégorie ou vos fichiers JSON.</p>
      </section>`;
    return;
  }

  // Store original travaux for filtering
  app.state.originalTravaux = [...travaux];

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

  renderTravauxList(travaux, projetId, categorieId);

  // Update filter drawer with new themes
  if (window.renderFilterDrawer) {
    window.renderFilterDrawer();
  }

  // Listen for filter changes
  document.addEventListener('filtersChanged', handleFiltersChanged);
}

function renderTravauxList(travaux, projetId, categorieId) {
  const travauxList = document.getElementById('travauxList');
  if (!travauxList) return;
  
  travauxList.innerHTML = '';

  if (travaux.length === 0) {
    travauxList.innerHTML = `
      <div style="padding:40px; text-align:center; color:var(--text-secondary);">
        <p>Aucun résultat trouvé avec ces filtres.</p>
      </div>
    `;
    return;
  }

  travaux.forEach(travail => {
    const item = document.createElement('div');
    item.className = 'travail-item';
    item.setAttribute('data-titre', travail.titre.toLowerCase());
    item.setAttribute('data-theme', (travail.theme || '').toLowerCase());
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

function handleFiltersChanged(event) {
  const filters = event.detail || {};
  const projetId = app.state.currentProjet;
  const categorieId = app.state.currentCategorie;
  
  if (app.state.currentPage !== 'categorie') return;

  let travaux = [...(app.state.originalTravaux || [])];

  // Apply search filter
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase();
    travaux = travaux.filter(t => 
      t.titre.toLowerCase().includes(searchTerm) ||
      (t.description || '').toLowerCase().includes(searchTerm) ||
      (t.theme || '').toLowerCase().includes(searchTerm)
    );
  }

  // Apply theme filter
  if (filters.theme && filters.theme.length > 0) {
    travaux = travaux.filter(t => 
      filters.theme.some(theme => 
        (t.theme || '').toLowerCase().includes(theme.toLowerCase())
      )
    );
  }

  // Apply alphabetical sorting
  if (filters.alpha === 'asc') {
    travaux.sort((a, b) => a.titre.localeCompare(b.titre));
  } else if (filters.alpha === 'desc') {
    travaux.sort((a, b) => b.titre.localeCompare(a.titre));
  }

  // Apply date sorting (if date field exists)
  if (filters.date === 'old') {
    travaux.sort((a, b) => (a.date || 0) - (b.date || 0));
  } else if (filters.date === 'new') {
    travaux.sort((a, b) => (b.date || 0) - (a.date || 0));
  }

  renderTravauxList(travaux, projetId, categorieId);
}

// Cleanup
window.addEventListener('beforeunload', () => {
  document.removeEventListener('filtersChanged', handleFiltersChanged);
});
