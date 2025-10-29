
// pages/projet.js
import { app } from '../core/state.js';

export function renderSliderPage(projetId) {
  app.state.currentPage = 'grid';
  app.state.currentProjet = projetId;
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  const projet = app.data.projetsRacine.find(p => p.id === projetId);
  let categories = app.data.categories[projetId];
  if (!categories || !projet) {
    document.getElementById('app').innerHTML = `
      <section class="grid-page active fade-in" style="padding:40px; color:white;">
        <h2>Projet introuvable</h2>
        <p>Vérifiez l'ID de projet ou vos fichiers JSON.</p>
      </section>`;
    return;
  }

  // Store original categories for filtering
  app.state.originalCategories = [...categories];

  const container = document.getElementById('app');
  container.innerHTML = `
    <div class="grid-page active fade-in">
      <div class="grid-hero">
        <img src="${projet.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200'}"
             alt="${projet.titre}" class="grid-hero-image" />
        <div class="grid-hero-overlay">
          <div class="grid-hero-logo">${projet.logo || ''}</div>
          <h1 class="grid-hero-titre">${projet.titre}</h1>
          <p class="grid-hero-description">${projet.description || ''}</p>
        </div>
      </div>
      <div class="scroll-indicator-horizontal">← Faites défiler →</div>
      <div class="grid-categories" id="gridCategories"></div>
    </div>
  `;

  renderCategoriesGrid(categories, projetId);

  // Update filter drawer
  if (window.renderFilterDrawer) {
    window.renderFilterDrawer();
  }

  // Listen for filter changes
  document.addEventListener('filtersChanged', handleCategoriesFiltersChanged);

  const tip = container.querySelector('.scroll-indicator-horizontal');
  let hasScrolled = false;
  const gridCategories = document.getElementById('gridCategories');
  gridCategories.addEventListener('scroll', () => {
    if (!hasScrolled && gridCategories.scrollLeft > 10) {
      hasScrolled = true; tip.style.opacity = '0'; tip.style.transition = 'opacity .5s ease';
    }
  });
}

function renderCategoriesGrid(categories, projetId) {
  const gridCategories = document.getElementById('gridCategories');
  if (!gridCategories) return;

  gridCategories.innerHTML = '';

  if (categories.length === 0) {
    gridCategories.innerHTML = `
      <div style="padding:40px; text-align:center; color:var(--text-secondary); width:100%;">
        <p>Aucune catégorie trouvée avec ces filtres.</p>
      </div>
    `;
    return;
  }

  categories.forEach(categorie => {
    const card = document.createElement('div');
    card.className = 'grid-category-card';
    card.setAttribute('data-titre', categorie.titre.toLowerCase());
    card.innerHTML = `
      <img src="${categorie.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'}"
           alt="${categorie.titre}" class="grid-category-image" />
      <div class="grid-category-overlay">
        <div class="grid-category-logo">${categorie.logo || ''}</div>
        <div class="grid-category-titre">${categorie.titre}</div>
        <div class="grid-category-description">${categorie.description || ''}</div>
      </div>
    `;
    card.onclick = () => window.navigateTo(`categorie:${projetId}:${categorie.id}`);
    gridCategories.appendChild(card);
  });
}

function handleCategoriesFiltersChanged(event) {
  const filters = event.detail || {};
  const projetId = app.state.currentProjet;
  
  if (app.state.currentPage !== 'grid') return;

  let categories = [...(app.state.originalCategories || [])];

  // Apply search filter
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase();
    categories = categories.filter(c => 
      c.titre.toLowerCase().includes(searchTerm) ||
      (c.description || '').toLowerCase().includes(searchTerm)
    );
  }

  // Apply alphabetical sorting
  if (filters.alpha === 'asc') {
    categories.sort((a, b) => a.titre.localeCompare(b.titre));
  } else if (filters.alpha === 'desc') {
    categories.sort((a, b) => b.titre.localeCompare(a.titre));
  }

  // Apply date sorting (if date field exists)
  if (filters.date === 'old') {
    categories.sort((a, b) => (a.date || 0) - (b.date || 0));
  } else if (filters.date === 'new') {
    categories.sort((a, b) => (b.date || 0) - (a.date || 0));
  }

  renderCategoriesGrid(categories, projetId);
}

// Cleanup
window.addEventListener('beforeunload', () => {
  document.removeEventListener('filtersChanged', handleCategoriesFiltersChanged);
});
