
// pages/labo.js
import { app } from '../core/state.js';

export function renderLaboPage() {
  app.state.currentPage = 'labo';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  // Get Labo project from data
  const laboProjet = app.data.projetsRacine.find(p => p.id === 'nexus-labo');
  const subSections = laboProjet?.subSections || [];
  
  const container = document.getElementById('app');
  
  // Build vertical slider with Hub intro + 4 floors
  const slidesHTML = `
    <!-- Slide 1: Hub Intro for Labo -->
    <div class="projet-fullscreen labo-intro" data-index="0">
      <img src="https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200"
           alt="Nexus Hub" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content">
        <div class="projet-logo">🔷</div>
        <div class="projet-titre">NEXUS HUB</div>
        <div class="projet-description">
          Bienvenue au <strong>NEXUS LABO</strong> — Un laboratoire d'expériences créatives organisé comme une grande tour à plusieurs étages. Chaque étage représente un domaine de projets innovants réalisés par l'auteur durant son activité au NEXUS STADIUM.
        </div>
      </div>
      <div class="scroll-hint" style="position:absolute;bottom:40px;left:50%;transform:translateX(-50%);color:#fff;text-align:center;animation:bounce 1.8s infinite;">
        <span class="scroll-hint-icon">↓</span>
        <span class="scroll-hint-text">Scroll</span>
      </div>
    </div>

    <!-- Slides 2-5: The 4 Floors -->
    ${subSections.map((floor, index) => `
      <div class="projet-fullscreen labo-floor" data-index="${index + 1}" data-floor-id="${floor.id}">
        <img src="${floor.image || 'https://images.unsplash.com/photo-1748261347902-451fb437e8fb?w=1200'}"
             alt="${floor.titre}" class="projet-background" />
        <div class="projet-overlay"></div>
        <div class="labo-floor-number">ÉTAGE ${index + 1}</div>
        <div class="projet-content">
          <div class="projet-logo">${floor.logo}</div>
          <div class="projet-titre">${floor.titre}</div>
          <div class="projet-description">${floor.description}</div>
          <button class="projet-cta" onclick="window.navigateTo('${floor.route}')" data-testid="explore-floor-${index + 1}">
            Explorer l'étage →
          </button>
        </div>
      </div>
    `).join('')}

    <!-- Slide 6: Overview of all floors -->
    <div class="projet-fullscreen labo-overview" data-index="5">
      <img src="https://images.unsplash.com/photo-1748261347902-451fb437e8fb?w=1200"
           alt="Labo Overview" class="projet-background" />
      <div class="projet-overlay" style="background: rgba(0,0,0,0.85)"></div>
      <div class="projet-content labo-overview-content">
        <h2 class="labo-overview-title">🔬 PLAN DU LABORATOIRE</h2>
        <p class="labo-overview-subtitle">4 étages d'expérimentation créative</p>
        <div class="labo-floors-grid">
          ${subSections.map((floor, index) => `
            <div class="labo-floor-card" onclick="window.navigateTo('${floor.route}')" data-testid="floor-card-${index + 1}">
              <div class="labo-floor-card-header" style="background: ${floor.couleur}">
                <div class="floor-card-number">ÉTAGE ${index + 1}</div>
                <div class="floor-card-icon">${floor.logo}</div>
              </div>
              <div class="labo-floor-card-body">
                <h3 class="floor-card-title">${floor.titre}</h3>
                <p class="floor-card-desc">${floor.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = `<div class="home-page" id="laboPage">${slidesHTML}</div>`;

  // Scroll indicator
  const dotsWrap = document.getElementById('scrollIndicator');
  if (dotsWrap) {
    dotsWrap.innerHTML = [0,1,2,3,4,5].map((i) =>
      `<div class="scroll-dot ${i===0?'active':''}" data-index="${i}"></div>`).join('');
    
    const dots = dotsWrap.querySelectorAll('.scroll-dot');
    dots.forEach(dot => dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      document.querySelectorAll('.projet-fullscreen')[idx].scrollIntoView({ behavior: 'smooth' });
    }));

    const laboPage = document.getElementById('laboPage');
    if (laboPage) {
      laboPage.addEventListener('scroll', () => {
        const currentIndex = Math.round(laboPage.scrollTop / window.innerHeight);
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
      });
    }
  }
}
