
// ui/filter-menu.js
import { app } from '../core/state.js';

export function initFilterMenu() {
  const menuBas = document.getElementById('menuBas');
  if (!menuBas) return;

  // Create filter burger button
  const filterBurger = document.createElement('button');
  filterBurger.className = 'burger filter-burger';
  filterBurger.id = 'filterBurger';
  filterBurger.setAttribute('aria-label', 'Ouvrir les filtres');
  filterBurger.innerHTML = '<span></span><span></span><span></span>';
  
  menuBas.innerHTML = '';
  menuBas.appendChild(filterBurger);

  // Create filter drawer
  const filterDrawer = document.createElement('aside');
  filterDrawer.className = 'filter-drawer';
  filterDrawer.id = 'filterDrawer';
  filterDrawer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(filterDrawer);

  // Create filter backdrop
  const filterBackdrop = document.createElement('div');
  filterBackdrop.className = 'backdrop filter-backdrop';
  filterBackdrop.id = 'filterBackdrop';
  document.body.appendChild(filterBackdrop);

  // Event listeners
  filterBurger.addEventListener('click', toggleFilterDrawer);
  filterBackdrop.addEventListener('click', closeFilterDrawer);

  renderFilterDrawer();
}

function renderFilterDrawer() {
  const drawer = document.getElementById('filterDrawer');
  if (!drawer) return;

  const currentPage = app.state.currentPage;
  const currentProjet = app.state.currentProjet;

  drawer.innerHTML = `
    <div class="filter-drawer-content">
      <div class="filter-header">
        <h2 class="filter-title">🔍 Filtres</h2>
        <button class="drawer-close" onclick="closeFilterDrawer()" aria-label="Fermer">×</button>
      </div>

      <!-- Search Bar -->
      <div class="filter-section">
        <label class="filter-label">Recherche</label>
        <input 
          type="text" 
          class="filter-search-input" 
          id="filterSearch"
          placeholder="Rechercher..."
          data-testid="filter-search"
        />
      </div>

      <!-- Sort Alphabetically -->
      <div class="filter-section">
        <label class="filter-label">Ordre alphabétique</label>
        <div class="filter-options">
          <button class="filter-option-btn ${app.state.filters?.alpha === 'asc' ? 'active' : ''}" 
                  onclick="applyFilter('alpha', 'asc')"
                  data-testid="filter-alpha-asc">
            A → Z
          </button>
          <button class="filter-option-btn ${app.state.filters?.alpha === 'desc' ? 'active' : ''}" 
                  onclick="applyFilter('alpha', 'desc')"
                  data-testid="filter-alpha-desc">
            Z → A
          </button>
        </div>
      </div>

      <!-- Sort by Date -->
      <div class="filter-section">
        <label class="filter-label">Ordre chronologique</label>
        <div class="filter-options">
          <button class="filter-option-btn ${app.state.filters?.date === 'old' ? 'active' : ''}" 
                  onclick="applyFilter('date', 'old')"
                  data-testid="filter-date-old">
            Ancien → Récent
          </button>
          <button class="filter-option-btn ${app.state.filters?.date === 'new' ? 'active' : ''}" 
                  onclick="applyFilter('date', 'new')"
                  data-testid="filter-date-new">
            Récent → Ancien
          </button>
        </div>
      </div>

      <!-- Thematic Filters (context-dependent) -->
      ${renderThematicFilters(currentProjet)}

      <!-- Reset Filters -->
      <div class="filter-section">
        <button class="filter-reset-btn" onclick="resetFilters()" data-testid="filter-reset">
          🔄 Réinitialiser les filtres
        </button>
      </div>
    </div>
  `;

  // Search input listener
  const searchInput = document.getElementById('filterSearch');
  if (searchInput) {
    searchInput.value = app.state.filters?.search || '';
    searchInput.addEventListener('input', (e) => {
      applyFilter('search', e.target.value);
    });
  }
}

function renderThematicFilters(projetId) {
  if (!projetId) return '';

  const themes = getThemesForProject(projetId);
  if (!themes.length) return '';

  return `
    <div class="filter-section">
      <label class="filter-label">Thématiques</label>
      <div class="filter-themes">
        ${themes.map(theme => `
          <button 
            class="filter-theme-btn ${(app.state.filters?.theme || []).includes(theme) ? 'active' : ''}" 
            onclick="toggleTheme('${theme}')"
            data-testid="filter-theme-${theme.toLowerCase().replace(/\s+/g, '-')}">
            ${theme}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function getThemesForProject(projetId) {
  const themeMap = {
    'atelier-ludique': ['Action', 'Aventure', 'Puzzle', 'Stratégie', 'Simulation', 'Multijoueur'],
    'atelier-exposition': ['Art Numérique', 'Installation', 'Sculpture', 'Peinture', 'Performance', 'Vidéo'],
    'atelier-creatif': ['Design UI/UX', 'Motion', 'Illustration', 'Branding', 'Web', '3D'],
    'atelier-pedagogique': ['Formation', 'Atelier', 'Tutoriel', 'Workshop', 'Conférence', 'Masterclass']
  };
  
  return themeMap[projetId] || [];
}

function toggleFilterDrawer() {
  const drawer = document.getElementById('filterDrawer');
  const backdrop = document.getElementById('filterBackdrop');
  const burger = document.getElementById('filterBurger');
  
  if (!drawer || !backdrop || !burger) return;

  const isOpen = drawer.classList.contains('open');
  
  if (isOpen) {
    closeFilterDrawer();
  } else {
    drawer.classList.add('open');
    backdrop.classList.add('show');
    burger.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
  }
}

function closeFilterDrawer() {
  const drawer = document.getElementById('filterDrawer');
  const backdrop = document.getElementById('filterBackdrop');
  const burger = document.getElementById('filterBurger');
  
  if (!drawer || !backdrop || !burger) return;

  drawer.classList.remove('open');
  backdrop.classList.remove('show');
  burger.classList.remove('active');
  drawer.setAttribute('aria-hidden', 'true');
}

function applyFilter(type, value) {
  if (!app.state.filters) app.state.filters = {};
  
  // Reset conflicting filters
  if (type === 'alpha') {
    app.state.filters.date = null;
    app.state.filters.alpha = value;
  } else if (type === 'date') {
    app.state.filters.alpha = null;
    app.state.filters.date = value;
  } else if (type === 'search') {
    app.state.filters.search = value;
  }

  renderFilterDrawer();
  
  // Trigger filter event
  document.dispatchEvent(new CustomEvent('filtersChanged', { 
    detail: app.state.filters 
  }));
}

function toggleTheme(theme) {
  if (!app.state.filters) app.state.filters = {};
  if (!app.state.filters.theme) app.state.filters.theme = [];

  const index = app.state.filters.theme.indexOf(theme);
  if (index > -1) {
    app.state.filters.theme.splice(index, 1);
  } else {
    app.state.filters.theme.push(theme);
  }

  renderFilterDrawer();
  
  document.dispatchEvent(new CustomEvent('filtersChanged', { 
    detail: app.state.filters 
  }));
}

function resetFilters() {
  app.state.filters = {};
  renderFilterDrawer();
  
  document.dispatchEvent(new CustomEvent('filtersChanged', { 
    detail: app.state.filters 
  }));
}

// Expose to window
window.toggleFilterDrawer = toggleFilterDrawer;
window.closeFilterDrawer = closeFilterDrawer;
window.applyFilter = applyFilter;
window.toggleTheme = toggleTheme;
window.resetFilters = resetFilters;

export { toggleFilterDrawer, closeFilterDrawer, applyFilter, toggleTheme, resetFilters };
