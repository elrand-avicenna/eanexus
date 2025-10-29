
// pages/labo-new.js
import { app } from '../core/state.js';
import { setupSliderDots } from './helpers.js';

export function renderLaboPage() {
  app.state.currentPage = 'labo';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  // Show back button
  const backBtn = document.getElementById('backNavBtn');
  if (backBtn) backBtn.style.display = 'flex';

  const laboProjet = app.data.projetsRacine.find(p => p.id === 'nexus-labo');
  const floors = laboProjet?.subSections || [];
  
  const container = document.getElementById('app');
  
  // 6 slides: Hub + 4 étages + Vue d'ensemble
  const slides = [
    {
      id: 'labo-hub',
      logo: '🔬',
      titre: 'NEXUS LABO',
      description: 'Laboratoire d\'expériences créatives organisé comme une tour à 4 étages. Chaque étage représente un domaine de projets innovants.',
      image: 'https://images.unsplash.com/photo-1748261347902-451fb437e8fb?w=1200',
      isHub: true
    },
    ...floors.map((floor, index) => ({
      id: floor.id,
      logo: floor.logo,
      titre: `ÉTAGE ${index + 1}: ${floor.titre}`,
      description: floor.description,
      image: floor.image,
      cta: 'Explorer cet étage',
      route: floor.route
    })),
    {
      id: 'labo-overview',
      logo: '🗺️',
      titre: 'VUE D\'ENSEMBLE',
      description: 'Tous les étages du laboratoire en un coup d\'œil. Choisissez votre destination.',
      image: 'https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200',
      showGrid: true
    }
  ];

  const slidesHTML = slides.map((slide, index) => `
    <div class="page-slide" data-slide-index="${index}">
      <img src="${slide.image}" alt="${slide.titre}" class="page-slide-bg" />
      <div class="page-slide-overlay"></div>
      
      <div class="page-slide-content">
        <div class="page-slide-logo">${slide.logo}</div>
        <h2 class="page-slide-titre">${slide.titre}</h2>
        <p class="page-slide-description">${slide.description}</p>
        
        ${slide.cta ? `
          <button class="page-slide-cta" onclick="window.navigateTo('${slide.route}')" data-testid="labo-cta-${slide.id}">
            ${slide.cta} →
          </button>
        ` : ''}
        
        ${slide.showGrid ? `
          <div class="labo-floors-grid-compact">
            ${floors.map((floor, i) => `
              <div class="labo-floor-card-compact" onclick="window.navigateTo('${floor.route}')" data-testid="floor-compact-${i}">
                <div class="floor-compact-icon">${floor.logo}</div>
                <div class="floor-compact-title">Étage ${i + 1}</div>
                <div class="floor-compact-name">${floor.titre}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      ${index === 0 ? `
        <div class="page-scroll-hint">
          <span class="scroll-hint-icon">↓</span>
          <span class="scroll-hint-text">Scroll pour découvrir</span>
        </div>
      ` : ''}
    </div>
  `).join('');

  container.innerHTML = `<div class="page-container" id="laboContainer">${slidesHTML}</div>`;
  setupSliderDots('laboContainer', slides.length);
}
