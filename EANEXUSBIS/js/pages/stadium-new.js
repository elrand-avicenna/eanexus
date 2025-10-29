
// pages/stadium-new.js
import { app } from '../core/state.js';
import { setupSliderDots, formatEventDate, getEventTypeLabel } from './helpers.js';

export function renderStadiumPage() {
  app.state.currentPage = 'stadium';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  // Show back button
  const backBtn = document.getElementById('backNavBtn');
  if (backBtn) backBtn.style.display = 'flex';

  const events = app.data.stadiumEvents || [];
  const actualites = app.data.stadiumActualites || [];
  
  const container = document.getElementById('app');
  
  // 4 slides fullscreen
  const slides = [
    {
      id: 'stadium-hub',
      logo: '🏟️',
      titre: 'NEXUS STADIUM',
      description: 'Votre source d\'événements, d\'actualités et de rendez-vous communautaires. Tournois, workshops, expositions et bien plus !',
      image: 'https://images.unsplash.com/photo-1761002278041-509b63db5c58?w=1200',
      isHub: true
    },
    {
      id: 'stadium-events',
      logo: '📅',
      titre: 'ÉVÉNEMENTS',
      description: `${events.length} événements à venir : tournois gaming, expositions d'art, workshops créatifs et conférences tech.`,
      image: 'https://images.unsplash.com/photo-1760900954419-89f057caf7f2?w=1200',
      cta: 'Voir les événements',
      action: 'viewAllEvents'
    },
    {
      id: 'stadium-calendar',
      logo: '🗓️',
      titre: 'CALENDRIER',
      description: 'Consultez le calendrier complet avec vues par jour, semaine ou mois. Ne ratez aucun événement important.',
      image: 'https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200',
      cta: 'Voir le calendrier',
      action: 'viewCalendar'
    },
    {
      id: 'stadium-news',
      logo: '📰',
      titre: 'ACTUALITÉS',
      description: `${actualites.length} actualités récentes : partenariats, nouveautés, mises à jour d'équipements et programmes spéciaux.`,
      image: 'https://images.unsplash.com/photo-1748261347902-451fb437e8fb?w=1200',
      cta: 'Lire les actualités',
      action: 'viewAllNews'
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
          <button class="page-slide-cta" onclick="window.${slide.action}()" data-testid="stadium-cta-${slide.id}">
            ${slide.cta} →
          </button>
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

  container.innerHTML = `<div class="page-container" id="stadiumContainer">${slidesHTML}</div>`;
  setupSliderDots('stadiumContainer', slides.length);
}

export function viewAllEvents() {
  const events = app.data.stadiumEvents || [];
  
  document.getElementById('app').innerHTML = `
    <div class="detail-page fade-in" data-testid="all-events-page">
      <div class="detail-header">
        <button class="detail-back-btn" onclick="window.navigateTo('stadium')" data-testid="back-to-stadium">
          ← Retour au Stadium
        </button>
        <h1 class="detail-title">📅 Tous les événements</h1>
      </div>
      <div class="detail-content">
        <div class="events-grid">
          ${events.map(event => `
            <div class="event-card" onclick="window.viewEvent('${event.id}')" data-testid="event-card-${event.id}">
              <div class="event-card-image" style="background-image: url('${event.image}')"></div>
              <div class="event-card-body">
                <span class="event-type ${event.type}">${getEventTypeLabel(event.type)}</span>
                <h3 class="event-card-title">${event.titre}</h3>
                <p class="event-card-desc">${event.description}</p>
                <div class="event-card-meta">
                  <span>📅 ${formatEventDate(event.date)}</span>
                  <span>⏰ ${event.heure}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function viewCalendar() {
  document.getElementById('app').innerHTML = `
    <div class="detail-page fade-in" data-testid="calendar-page">
      <div class="detail-header">
        <button class="detail-back-btn" onclick="window.navigateTo('stadium')" data-testid="back-from-calendar">
          ← Retour au Stadium
        </button>
        <h1 class="detail-title">🗓️ Calendrier</h1>
      </div>
      <div class="detail-content">
        <div class="calendar-view-simple">
          <p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem; padding: 40px;">
            Vue calendrier complète disponible prochainement
          </p>
        </div>
      </div>
    </div>
  `;
}

export function viewAllNews() {
  const actualites = app.data.stadiumActualites || [];
  
  document.getElementById('app').innerHTML = `
    <div class="detail-page fade-in" data-testid="all-news-page">
      <div class="detail-header">
        <button class="detail-back-btn" onclick="window.navigateTo('stadium')" data-testid="back-from-news">
          ← Retour au Stadium
        </button>
        <h1 class="detail-title">📰 Actualités</h1>
      </div>
      <div class="detail-content">
        <div class="events-grid">
          ${actualites.map(news => `
            <div class="event-card" data-testid="news-card-${news.id}">
              <div class="event-card-image" style="background-image: url('${news.image}')"></div>
              <div class="event-card-body">
                <span class="event-type social">${news.categorie}</span>
                <h3 class="event-card-title">${news.titre}</h3>
                <p class="event-card-desc">${news.description}</p>
                <div class="event-card-meta">
                  <span>📅 ${formatEventDate(news.date)}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function viewEvent(eventId) {
  const event = app.data.stadiumEvents.find(e => e.id === eventId);
  if (!event) return;

  document.getElementById('app').innerHTML = `
    <div class="detail-page fade-in" data-testid="event-detail">
      <div class="detail-header">
        <button class="detail-back-btn" onclick="window.viewAllEvents()" data-testid="back-to-events">
          ← Retour aux événements
        </button>
        <h1 class="detail-title">${event.titre}</h1>
      </div>
      <div class="detail-content" style="max-width: 900px;">
        <div class="event-detail-image" style="width: 100%; height: 400px; background-image: url('${event.image}'); background-size: cover; background-position: center; border-radius: 16px; margin-bottom: 30px;"></div>
        
        <div style="display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px; padding: 20px; background: var(--card-bg); border-radius: 12px;">
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 4px;">Date</div>
            <div style="font-size: 1.1rem; font-weight: 600;">📅 ${formatEventDate(event.date)}</div>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 20px; background: var(--card-bg); border-radius: 12px;">
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 4px;">Heure</div>
            <div style="font-size: 1.1rem; font-weight: 600;">⏰ ${event.heure}</div>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 20px; background: var(--card-bg); border-radius: 12px;">
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 4px;">Lieu</div>
            <div style="font-size: 1.1rem; font-weight: 600;">📍 ${event.lieu}</div>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="font-size: 1.5rem; margin-bottom: 16px;">À propos</h3>
          <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-secondary);">${event.description}</p>
        </div>
        
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${event.tags.map(tag => `<span class="event-tag">#${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

// Expose functions
window.viewAllEvents = viewAllEvents;
window.viewCalendar = viewCalendar;
window.viewAllNews = viewAllNews;
window.viewEvent = viewEvent;
