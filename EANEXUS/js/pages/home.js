
// pages/home.js
import { app } from '../core/state.js';

export function renderHomePage() {
  app.state.currentPage = 'home';
  app.state.currentProjet = app.state.currentCategorie = app.state.currentTravail = null;
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  const container = document.getElementById('app');
  let projectsHTML = '';
  app.data.projetsRacine.forEach((projet, index) => {
    const isAccueil = projet.id === 'accueil';
    const isHub = projet.id === 'nexus-hub';
    const hasCategories = ['atelier-ludique', 'atelier-exposition', 'atelier-creatif', 'atelier-pedagogique'].includes(projet.id);
    
    if (isHub) {
      // NEXUS HUB with premium design
      projectsHTML += `
        <div class="projet-fullscreen hub-fullscreen" 
             data-projet-id="${projet.id}" 
             data-index="${index}" 
             style="${projet.background ? `background:${projet.background};` : ''}">
          <img src="${projet.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200'}"
               alt="${projet.titre}" class="projet-background" />
          <div class="projet-overlay hub-overlay"></div>
          <div class="projet-number">${String(index + 1).padStart(2, '0')}</div>
          
          <!-- Hub Header -->
          <div class="hub-header">
            <div class="hub-icon-wrapper">
              <div class="hub-icon-glow"></div>
              <div class="hub-icon">${projet.logo || '🔷'}</div>
            </div>
            <h1 class="hub-titre">${projet.titre}</h1>
            <p class="hub-subtitle">${projet.description || ''}</p>
            <div class="hub-divider"></div>
          </div>
          
          <!-- Hub Cards Grid -->
          <div class="hub-grid">
            ${projet.subSections.map((sub, idx) => `
              <div class="hub-card-premium" 
                   onclick="window.navigateTo('${sub.route}')" 
                   data-testid="hub-${sub.id}"
                   style="animation-delay: ${idx * 0.1}s">
                <div class="hub-card-border"></div>
                <div class="hub-card-glow" style="background: ${sub.couleur}33"></div>
                <div class="hub-card-number">${String(idx + 1).padStart(2, '0')}</div>
                <div class="hub-card-icon-premium">${sub.logo}</div>
                <h3 class="hub-card-titre-premium">${sub.titre}</h3>
                <p class="hub-card-desc-premium">${sub.description}</p>
                <div class="hub-card-arrow">
                  <span>→</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
    } else {
      // Regular projet with improved CTA
      projectsHTML += `
        <div class="projet-fullscreen" 
             data-projet-id="${projet.id}" 
             data-index="${index}" 
             style="${projet.background ? `background:${projet.background};` : ''}"
             ${hasCategories ? `onclick="window.navigateTo('projet:${projet.id}')"` : ''}>
          <img src="${projet.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200'}"
               alt="${projet.titre}" class="projet-background" />
          <div class="projet-overlay"></div>
          <div class="projet-number">${String(index + 1).padStart(2, '0')}</div>
          <div class="projet-content">
            <div class="projet-logo">${projet.logo || ''}</div>
            <div class="projet-titre">${projet.titre}</div>
            <div class="projet-description">${projet.description || ''}</div>
            ${hasCategories ? `
              <div class="projet-cta-premium">
                <div class="cta-wrapper">
                  <div class="cta-hexagon">
                    <span class="cta-text">Accéder</span>
                  </div>
                  <div class="cta-arrow-circle">
                    <svg class="cta-arrow-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div class="cta-brackets">
                  <div class="cta-bracket tl"></div>
                  <div class="cta-bracket tr"></div>
                  <div class="cta-bracket bl"></div>
                  <div class="cta-bracket br"></div>
                </div>
              </div>
            ` : ''}
          </div>
          ${index === 0 ? `
            <div class="scroll-hint" style="position:absolute;bottom:40px;left:50%;transform:translateX(-50%);color:#fff;text-align:center;animation:bounce 1.8s infinite;">
              <span class="scroll-hint-icon">↓</span>
              <span class="scroll-hint-text">Scroll</span>
            </div>` : ''}
        </div>`;
    }
  });

  container.innerHTML = `<div class="home-page" id="homePage">${projectsHTML}</div>`;

  const dotsWrap = document.getElementById('scrollIndicator');
  if (dotsWrap) {
    dotsWrap.innerHTML = app.data.projetsRacine.map((_, i) =>
      `<div class="scroll-dot ${i===0?'active':''}" data-index="${i}"></div>`).join('');
  }

  const homePage = document.getElementById('homePage');
  const dots = dotsWrap ? dotsWrap.querySelectorAll('.scroll-dot') : [];
  
  dots.forEach(dot => dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.index, 10);
    document.querySelectorAll('.projet-fullscreen')[idx].scrollIntoView({ behavior: 'smooth' });
  }));
  
  if (homePage && dotsWrap) {
    homePage.addEventListener('scroll', () => {
      const currentIndex = Math.round(homePage.scrollTop / window.innerHeight);
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    });
  }
}
