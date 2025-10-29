
// pages/home.js
import { app } from '../core/state.js';

export function renderHomePage() {
  app.state.currentPage = 'home';
  app.state.currentProjet = app.state.currentCategorie = app.state.currentTravail = null;
  app.state.history = []; // Clear history on home
  
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  // Hide back button on home
  const backBtn = document.getElementById('backNavBtn');
  if (backBtn) backBtn.style.display = 'none';

  const container = document.getElementById('app');
  let projectsHTML = '';
  
  // Render all projects from data
  app.data.projetsRacine.forEach((projet, index) => {
    const isHub = projet.id === 'nexus-hub';
    const hasRoute = ['nexus-stadium', 'nexus-labo', 'nexus-center'].includes(projet.id);
    const hasCategories = ['atelier-ludique', 'atelier-exposition', 'atelier-creatif', 'atelier-pedagogique'].includes(projet.id);
    
    if (isHub) {
      // NEXUS HUB with sub-sections cards
      projectsHTML += `
        <div class="projet-fullscreen" 
             data-projet-id="${projet.id}" 
             data-index="${index}" 
             style="${projet.background ? `background:${projet.background};` : ''}">
          <img src="${projet.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200'}"
               alt="${projet.titre}" class="projet-background" />
          <div class="projet-overlay"></div>
          <div class="projet-number">${String(index + 1).padStart(2, '0')}</div>
          
          <div class="projet-content">
            <div class="projet-logo">${projet.logo || ''}</div>
            <div class="projet-titre">${projet.titre}</div>
            <div class="projet-description">${projet.description || ''}</div>
            
            <div class="hub-cards-simple">
              ${projet.subSections.map(sub => `
                <div class="hub-card-simple" onclick="window.navigateTo('${sub.route}')" data-testid="hub-${sub.id}">
                  <div class="hub-card-icon">${sub.logo}</div>
                  <div class="hub-card-title">${sub.titre}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>`;
    } else if (hasRoute) {
      // Stadium, Labo, Center - clickable
      const route = projet.id.replace('nexus-', '');
      projectsHTML += `
        <div class="projet-fullscreen" 
             data-projet-id="${projet.id}" 
             data-index="${index}" 
             onclick="window.navigateTo('${route}')"
             style="${projet.background ? `background:${projet.background};` : ''}">
          <img src="${projet.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200'}"
               alt="${projet.titre}" class="projet-background" />
          <div class="projet-overlay"></div>
          <div class="projet-number">${String(index + 1).padStart(2, '0')}</div>
          <div class="projet-content">
            <div class="projet-logo">${projet.logo || ''}</div>
            <div class="projet-titre">${projet.titre}</div>
            <div class="projet-description">${projet.description || ''}</div>
            <div class="projet-cta">Explorer →</div>
          </div>
        </div>`;
    } else {
      // Regular project (Accueil)
      projectsHTML += `
        <div class="projet-fullscreen" 
             data-projet-id="${projet.id}" 
             data-index="${index}" 
             style="${projet.background ? `background:${projet.background};` : ''}">
          <img src="${projet.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200'}"
               alt="${projet.titre}" class="projet-background" />
          <div class="projet-overlay"></div>
          <div class="projet-number">${String(index + 1).padStart(2, '0')}</div>
          <div class="projet-content">
            <div class="projet-logo">${projet.logo || ''}</div>
            <div class="projet-titre">${projet.titre}</div>
            <div class="projet-description">${projet.description || ''}</div>
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
