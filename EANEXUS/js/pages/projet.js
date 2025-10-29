
// pages/projet.js
import { app } from '../core/state.js';

export function renderSliderPage(projetId) {
  app.state.currentPage = 'grid';
  app.state.currentProjet = projetId;
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  const projet = app.data.projetsRacine.find(p => p.id === projetId);
  const categories = app.data.categories[projetId];
  if (!categories || !projet) {
    document.getElementById('app').innerHTML = `
      <section class="grid-page active fade-in" style="padding:40px; color:white;">
        <h2>Projet introuvable</h2>
        <p>Vérifiez l'ID de projet ou vos fichiers JSON.</p>
      </section>`;
    return;
  }

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

  const gridCategories = document.getElementById('gridCategories');
  categories.forEach(categorie => {
    const card = document.createElement('div');
    card.className = 'grid-category-card';
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

  const tip = container.querySelector('.scroll-indicator-horizontal');
  let hasScrolled = false;
  gridCategories.addEventListener('scroll', () => {
    if (!hasScrolled && gridCategories.scrollLeft > 10) {
      hasScrolled = true; tip.style.opacity = '0'; tip.style.transition = 'opacity .5s ease';
    }
  });
}
