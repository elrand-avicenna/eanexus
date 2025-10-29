
// pages/center.js
import { app } from '../core/state.js';

export function renderCenterPage() {
  app.state.currentPage = 'center';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';
  
  // Show back button
  const backBtn = document.getElementById('backNavBtn');
  if (backBtn) backBtn.style.display = 'flex';
  
  const container = document.getElementById('app');
  
  // Build vertical slider with Hub intro + 2 sections
  const slidesHTML = `
    <div class="projet-fullscreen center-intro" data-index="0">
      <img src="https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200"
           alt="Nexus Hub" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content">
        <div class="projet-logo">🔷</div>
        <div class="projet-titre">NEXUS HUB</div>
        <div class="projet-description">
          Bienvenue au <strong>NEXUS CENTER</strong> — Le cœur de la communauté. Rencontrez les habitants du NEXUS, discutez avec eux, relevez des défis et construisez des relations uniques.
        </div>
      </div>
      <div class="scroll-hint" style="position:absolute;bottom:40px;left:50%;transform:translateX(-50%);color:#fff;text-align:center;animation:bounce 1.8s infinite;">
        <span class="scroll-hint-icon">↓</span>
        <span class="scroll-hint-text">Scroll</span>
      </div>
    </div>

    <div class="projet-fullscreen center-section" data-index="1">
      <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200"
           alt="Habitants" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content">
        <div class="projet-logo">👥</div>
        <div class="projet-titre">HABITANTS DU NEXUS</div>
        <div class="projet-description">
          Découvrez les personnages qui peuplent le NEXUS. Chacun a son histoire, sa personnalité et ses compétences uniques.
        </div>
        <button class="projet-cta" onclick="window.navigateTo('categorie:center:habitants')" data-testid="center-habitants">
          Rencontrer les habitants →
        </button>
      </div>
    </div>

    <div class="projet-fullscreen center-section" data-index="2">
      <img src="https://images.unsplash.com/photo-1761002278041-509b63db5c58?w=1200"
           alt="Lounge" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content">
        <div class="projet-logo">🛋️</div>
        <div class="projet-titre">SALLE DE REPOS</div>
        <div class="projet-description">
          Espace de rencontre et d'interaction. Discutez avec les NPCs ou défiez-les en duel pour tester vos compétences.
        </div>
        <button class="projet-cta" onclick="window.navigateTo('categorie:center:lounge')" data-testid="center-lounge">
          Entrer dans le lounge →
        </button>
      </div>
    </div>
  `;

  container.innerHTML = `<div class="home-page" id="centerPage">${slidesHTML}</div>`;

  const dotsWrap = document.getElementById('scrollIndicator');
  if (dotsWrap) {
    dotsWrap.innerHTML = [0,1,2].map((i) =>
      `<div class="scroll-dot ${i===0?'active':''}" data-index="${i}"></div>`).join('');
    
    const dots = dotsWrap.querySelectorAll('.scroll-dot');
    dots.forEach(dot => dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      document.querySelectorAll('.projet-fullscreen')[idx].scrollIntoView({ behavior: 'smooth' });
    }));

    const centerPage = document.getElementById('centerPage');
    if (centerPage) {
      centerPage.addEventListener('scroll', () => {
        const currentIndex = Math.round(centerPage.scrollTop / window.innerHeight);
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
      });
    }
  }
}
