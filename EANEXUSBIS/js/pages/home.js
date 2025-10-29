
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
  
  // Slider vertical: Hub → Stadium → Labo → Center
  const slides = [
    {
      id: 'nexus-hub',
      logo: '🔷',
      titre: 'NEXUS HUB',
      description: 'Centre d\'information et de navigation. Découvrez les trois zones principales du NEXUS.',
      image: 'https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200',
      subCards: [
        { logo: '🏟️', titre: 'STADIUM', desc: 'Événements & Actualités', route: 'stadium' },
        { logo: '🔬', titre: 'LABO', desc: 'Laboratoire de Projets', route: 'labo' },
        { logo: '🏛️', titre: 'CENTER', desc: 'Communauté NPCs', route: 'center' }
      ]
    },
    {
      id: 'nexus-stadium',
      logo: '🏟️',
      titre: 'NEXUS STADIUM',
      description: 'Événements ludiques, tournois, expositions et actualités communautaires. Restez à jour avec le calendrier dynamique.',
      image: 'https://images.unsplash.com/photo-1761002278041-509b63db5c58?w=1200',
      route: 'stadium'
    },
    {
      id: 'nexus-labo',
      logo: '🔬',
      titre: 'NEXUS LABO',
      description: 'Laboratoire d\'expériences créatives organisé comme une tour à 4 étages : Gaming, Theater, Atelier et Academy.',
      image: 'https://images.unsplash.com/photo-1748261347902-451fb437e8fb?w=1200',
      route: 'labo'
    },
    {
      id: 'nexus-center',
      logo: '🏛️',
      titre: 'NEXUS CENTER',
      description: 'Le cœur de la communauté. Rencontrez les habitants du NEXUS, discutez et relevez des défis.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
      route: 'center'
    }
  ];

  const slidesHTML = slides.map((slide, index) => `
    <div class="home-slide" data-slide-index="${index}">
      <img src="${slide.image}" alt="${slide.titre}" class="home-slide-bg" />
      <div class="home-slide-overlay"></div>
      
      <div class="home-slide-content">
        <div class="home-slide-logo">${slide.logo}</div>
        <h2 class="home-slide-titre">${slide.titre}</h2>
        <p class="home-slide-description">${slide.description}</p>
        
        ${slide.subCards ? `
          <div class="home-sub-cards">
            ${slide.subCards.map(card => `
              <div class="home-sub-card" onclick="window.navigateTo('${card.route}')" data-testid="home-card-${card.route}">
                <div class="home-sub-card-logo">${card.logo}</div>
                <div class="home-sub-card-titre">${card.titre}</div>
                <div class="home-sub-card-desc">${card.desc}</div>
              </div>
            `).join('')}
          </div>
        ` : `
          <button class="home-slide-cta" onclick="window.navigateTo('${slide.route}')" data-testid="home-cta-${slide.id}">
            Explorer →
          </button>
        `}
      </div>
      
      ${index === 0 ? `
        <div class="home-scroll-hint">
          <span class="scroll-hint-icon">↓</span>
          <span class="scroll-hint-text">Scroll</span>
        </div>
      ` : ''}
    </div>
  `).join('');

  container.innerHTML = `<div class="home-container" id="homeContainer">${slidesHTML}</div>`;

  // Scroll indicator dots
  const dotsWrap = document.getElementById('scrollIndicator');
  if (dotsWrap) {
    dotsWrap.innerHTML = slides.map((_, i) =>
      `<div class="scroll-dot ${i===0?'active':''}" data-index="${i}"></div>`).join('');
    
    const dots = dotsWrap.querySelectorAll('.scroll-dot');
    dots.forEach(dot => dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      document.querySelectorAll('.home-slide')[idx].scrollIntoView({ behavior: 'smooth' });
    }));

    const homeContainer = document.getElementById('homeContainer');
    if (homeContainer) {
      homeContainer.addEventListener('scroll', () => {
        const currentIndex = Math.round(homeContainer.scrollTop / window.innerHeight);
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
      });
    }
  }
}
