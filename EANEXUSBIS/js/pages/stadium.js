
// pages/stadium.js
import { app } from '../core/state.js';

export function renderStadiumPage() {
  app.state.currentPage = 'stadium';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  // Show back button
  const backBtn = document.getElementById('backNavBtn');
  if (backBtn) backBtn.style.display = 'flex';

  const container = document.getElementById('app');
  
  // Build vertical slider with Hub intro + 3 sections
  const slidesHTML = `
    <div class="projet-fullscreen stadium-intro" data-index="0">
      <img src="https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200"
           alt="Nexus Hub" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content">
        <div class="projet-logo">🔷</div>
        <div class="projet-titre">NEXUS HUB</div>
        <div class="projet-description">
          Bienvenue au <strong>NEXUS STADIUM</strong> — Votre source d'événements, d'actualités et de rendez-vous communautaires. Tournois, workshops, expositions et bien plus !
        </div>
      </div>
      <div class="scroll-hint" style="position:absolute;bottom:40px;left:50%;transform:translateX(-50%);color:#fff;text-align:center;animation:bounce 1.8s infinite;">
        <span class="scroll-hint-icon">↓</span>
        <span class="scroll-hint-text">Scroll</span>
      </div>
    </div>

    <div class="projet-fullscreen stadium-section" data-index="1">
      <img src="https://images.unsplash.com/photo-1761002278041-509b63db5c58?w=1200"
           alt="Événements" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content">
        <div class="projet-logo">📅</div>
        <div class="projet-titre">ÉVÉNEMENTS</div>
        <div class="projet-description">
          Découvrez tous nos événements : tournois gaming, expositions d'art, workshops créatifs et conférences tech.
        </div>
        <button class="projet-cta" onclick="window.navigateTo('categorie:stadium:evenements')" data-testid="stadium-evenements">
          Voir les événements →
        </button>
      </div>
    </div>

    <div class="projet-fullscreen stadium-section" data-index="2">
      <img src="https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200"
           alt="Calendrier" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content">
        <div class="projet-logo">🗓️</div>
        <div class="projet-titre">CALENDRIER</div>
        <div class="projet-description">
          Consultez le calendrier complet avec vues par jour, semaine ou mois. Ne ratez aucun événement important.
        </div>
        <button class="projet-cta" onclick="window.navigateTo('categorie:stadium:calendar')" data-testid="stadium-calendar">
          Voir le calendrier →
        </button>
      </div>
    </div>

    <div class="projet-fullscreen stadium-section" data-index="3">
      <img src="https://images.unsplash.com/photo-1748261347902-451fb437e8fb?w=1200"
           alt="Actualités" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content">
        <div class="projet-logo">📰</div>
        <div class="projet-titre">ACTUALITÉS</div>
        <div class="projet-description">
          Restez informé des dernières actualités : partenariats, nouveautés, mises à jour d'équipements et programmes spéciaux.
        </div>
        <button class="projet-cta" onclick="window.navigateTo('categorie:stadium:actualites')" data-testid="stadium-actualites">
          Lire les actualités →
        </button>
      </div>
    </div>
  `;

  container.innerHTML = `<div class="home-page" id="stadiumPage">${slidesHTML}</div>`;

  const dotsWrap = document.getElementById('scrollIndicator');
  if (dotsWrap) {
    dotsWrap.innerHTML = [0,1,2,3].map((i) =>
      `<div class="scroll-dot ${i===0?'active':''}" data-index="${i}"></div>`).join('');
    
    const dots = dotsWrap.querySelectorAll('.scroll-dot');
    dots.forEach(dot => dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      document.querySelectorAll('.projet-fullscreen')[idx].scrollIntoView({ behavior: 'smooth' });
    }));

    const stadiumPage = document.getElementById('stadiumPage');
    if (stadiumPage) {
      stadiumPage.addEventListener('scroll', () => {
        const currentIndex = Math.round(stadiumPage.scrollTop / window.innerHeight);
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
      });
    }
  }
}
