
// pages/stadium.js
import { app } from '../core/state.js';

export function renderStadiumPage() {
  app.state.currentPage = 'stadium';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  const events = app.data.stadiumEvents || [];
  const actualites = app.data.stadiumActualites || [];
  
  const container = document.getElementById('app');
  
  // Build vertical slider with Hub intro + content
  const slidesHTML = `
    <!-- Slide 1: Hub Intro for Stadium -->
    <div class="projet-fullscreen stadium-intro" data-index="0">
      <img src="https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200"
           alt="Nexus Hub" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content">
        <div class="projet-logo">🔷</div>
        <div class="projet-titre">NEXUS HUB</div>
        <div class="projet-description">
          Bienvenue au <strong>NEXUS STADIUM</strong> — votre source d'événements, d'actualités et de rendez-vous communautaires. Restez connecté avec les dernières nouvelles du NEXUS !
        </div>
      </div>
      <div class="scroll-hint" style="position:absolute;bottom:40px;left:50%;transform:translateX(-50%);color:#fff;text-align:center;animation:bounce 1.8s infinite;">
        <span class="scroll-hint-icon">↓</span>
        <span class="scroll-hint-text">Scroll</span>
      </div>
    </div>

    <!-- Slide 2: Events List -->
    <div class="projet-fullscreen stadium-events" data-index="1">
      <img src="https://images.unsplash.com/photo-1761002278041-509b63db5c58?w=1200"
           alt="Stadium Events" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content stadium-content">
        <h2 class="stadium-section-title">🏟️ ÉVÉNEMENTS À VENIR</h2>
        <div class="stadium-events-grid">
          ${events.slice(0, 6).map(event => `
            <div class="stadium-event-card" onclick="window.viewEvent('${event.id}')" data-testid="event-${event.id}">
              <div class="event-card-image" style="background-image: url('${event.image}')"></div>
              <div class="event-card-content">
                <div class="event-card-date">${formatEventDate(event.date)}</div>
                <h3 class="event-card-title">${event.titre}</h3>
                <p class="event-card-desc">${event.description.substring(0, 80)}...</p>
                <div class="event-card-meta">
                  <span class="event-type ${event.type}">${getEventTypeLabel(event.type)}</span>
                  <span class="event-time">⏰ ${event.heure}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="stadium-cta-btn" onclick="window.viewAllEvents()" data-testid="view-all-events">
          Voir tous les événements →
        </button>
      </div>
    </div>

    <!-- Slide 3: Calendar View -->
    <div class="projet-fullscreen stadium-calendar" data-index="2">
      <div class="projet-overlay" style="background: rgba(0,0,0,0.85)"></div>
      <div class="projet-content stadium-content">
        <h2 class="stadium-section-title">🗓️ CALENDRIER</h2>
        <div class="calendar-controls">
          <button class="calendar-view-btn active" onclick="window.switchCalendarView('day')" data-testid="view-day">Jour</button>
          <button class="calendar-view-btn" onclick="window.switchCalendarView('week')" data-testid="view-week">Semaine</button>
          <button class="calendar-view-btn" onclick="window.switchCalendarView('month')" data-testid="view-month">Mois</button>
        </div>
        <div id="calendarView" class="calendar-container">
          ${renderCalendarDay()}
        </div>
      </div>
    </div>

    <!-- Slide 4: Actualités -->
    <div class="projet-fullscreen stadium-news" data-index="3">
      <img src="https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200"
           alt="Actualités" class="projet-background" />
      <div class="projet-overlay"></div>
      <div class="projet-content stadium-content">
        <h2 class="stadium-section-title">📰 ACTUALITÉS</h2>
        <div class="stadium-news-list">
          ${actualites.map(news => `
            <div class="news-card" onclick="window.viewNews('${news.id}')" data-testid="news-${news.id}">
              <div class="news-card-image" style="background-image: url('${news.image}')"></div>
              <div class="news-card-content">
                <div class="news-card-date">${formatNewsDate(news.date)}</div>
                <h3 class="news-card-title">${news.titre}</h3>
                <p class="news-card-desc">${news.description}</p>
                <span class="news-card-category">${news.categorie}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = `<div class="home-page" id="stadiumPage">${slidesHTML}</div>`;

  // Scroll indicator
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

export function viewAllEvents() {
  const events = app.data.stadiumEvents || [];
  
  document.getElementById('app').innerHTML = `
    <div class="stadium-full-page fade-in" data-testid="all-events-page">
      <div class="stadium-full-header">
        <button class="back-btn" onclick="window.navigateTo('stadium')" data-testid="back-to-stadium">← Retour</button>
        <h1 class="stadium-full-title">🏟️ Tous les événements</h1>
      </div>
      <div class="stadium-full-content">
        ${events.map(event => `
          <div class="event-full-card" onclick="window.viewEvent('${event.id}')" data-testid="event-full-${event.id}">
            <div class="event-full-image" style="background-image: url('${event.image}')"></div>
            <div class="event-full-content">
              <div class="event-full-header">
                <h3 class="event-full-title">${event.titre}</h3>
                <span class="event-type ${event.type}">${getEventTypeLabel(event.type)}</span>
              </div>
              <p class="event-full-desc">${event.description}</p>
              <div class="event-full-meta">
                <span class="event-meta-item">📅 ${formatEventDate(event.date)}</span>
                <span class="event-meta-item">⏰ ${event.heure}</span>
                <span class="event-meta-item">📍 ${event.lieu}</span>
              </div>
              <div class="event-tags">
                ${event.tags.map(tag => `<span class="event-tag">#${tag}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function viewEvent(eventId) {
  const event = app.data.stadiumEvents.find(e => e.id === eventId);
  if (!event) return;

  document.getElementById('app').innerHTML = `
    <div class="event-detail-page fade-in" data-testid="event-detail">
      <div class="event-detail-hero" style="background-image: url('${event.image}')">
        <div class="event-detail-overlay"></div>
        <button class="back-btn" onclick="window.viewAllEvents()" data-testid="back-to-events">← Retour</button>
        <div class="event-detail-hero-content">
          <span class="event-type ${event.type}">${getEventTypeLabel(event.type)}</span>
          <h1 class="event-detail-title">${event.titre}</h1>
        </div>
      </div>
      <div class="event-detail-content">
        <div class="event-detail-info">
          <div class="event-info-item">
            <span class="event-info-icon">📅</span>
            <div>
              <div class="event-info-label">Date</div>
              <div class="event-info-value">${formatEventDate(event.date)}</div>
            </div>
          </div>
          <div class="event-info-item">
            <span class="event-info-icon">⏰</span>
            <div>
              <div class="event-info-label">Heure</div>
              <div class="event-info-value">${event.heure}</div>
            </div>
          </div>
          <div class="event-info-item">
            <span class="event-info-icon">📍</span>
            <div>
              <div class="event-info-label">Lieu</div>
              <div class="event-info-value">${event.lieu}</div>
            </div>
          </div>
        </div>
        <div class="event-detail-description">
          <h3>À propos de l'événement</h3>
          <p>${event.description}</p>
        </div>
        <div class="event-tags">
          ${event.tags.map(tag => `<span class="event-tag">#${tag}</span>`).join('')}
        </div>
        <div class="event-actions">
          <button class="event-action-btn primary" onclick="alert('Inscription à venir !')" data-testid="register-event">
            S'inscrire à l'événement
          </button>
          <button class="event-action-btn secondary" onclick="alert('Ajouté au calendrier !')" data-testid="add-calendar">
            Ajouter au calendrier
          </button>
        </div>
      </div>
    </div>
  `;
}

export function viewNews(newsId) {
  const news = app.data.stadiumActualites.find(n => n.id === newsId);
  if (!news) return;

  document.getElementById('app').innerHTML = `
    <div class="news-detail-page fade-in" data-testid="news-detail">
      <div class="news-detail-hero" style="background-image: url('${news.image}')">
        <div class="news-detail-overlay"></div>
        <button class="back-btn" onclick="window.navigateTo('stadium')" data-testid="back-from-news">← Retour</button>
      </div>
      <div class="news-detail-content">
        <span class="news-category-badge">${news.categorie}</span>
        <h1 class="news-detail-title">${news.titre}</h1>
        <div class="news-detail-date">${formatNewsDate(news.date)}</div>
        <p class="news-detail-text">${news.description}</p>
      </div>
    </div>
  `;
}

// Calendar rendering functions
function renderCalendarDay() {
  const today = new Date();
  const events = app.data.stadiumEvents.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.toDateString() === today.toDateString();
  });

  return `
    <div class="calendar-day-view">
      <h3 class="calendar-date-title">${formatFullDate(today)}</h3>
      ${events.length > 0 ? `
        <div class="calendar-events-list">
          ${events.map(e => `
            <div class="calendar-event-item" onclick="window.viewEvent('${e.id}')">
              <div class="calendar-event-time">${e.heure}</div>
              <div class="calendar-event-info">
                <h4>${e.titre}</h4>
                <p>${e.lieu}</p>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <p class="calendar-no-events">Aucun événement prévu aujourd'hui</p>
      `}
    </div>
  `;
}

window.switchCalendarView = function(view) {
  const btns = document.querySelectorAll('.calendar-view-btn');
  btns.forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  
  const calendarView = document.getElementById('calendarView');
  
  if (view === 'day') {
    calendarView.innerHTML = renderCalendarDay();
  } else if (view === 'week') {
    calendarView.innerHTML = renderCalendarWeek();
  } else if (view === 'month') {
    calendarView.innerHTML = renderCalendarMonth();
  }
};

function renderCalendarWeek() {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  
  let weekHTML = '<div class="calendar-week-view">';
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    
    const dayEvents = app.data.stadiumEvents.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.toDateString() === day.toDateString();
    });
    
    weekHTML += `
      <div class="calendar-day-column ${day.toDateString() === today.toDateString() ? 'today' : ''}">
        <div class="calendar-day-header">
          <div class="calendar-day-name">${['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][day.getDay()]}</div>
          <div class="calendar-day-number">${day.getDate()}</div>
        </div>
        <div class="calendar-day-events">
          ${dayEvents.map(e => `
            <div class="calendar-week-event" onclick="window.viewEvent('${e.id}')" style="border-left: 3px solid ${getEventTypeColor(e.type)}">
              <div class="calendar-week-event-time">${e.heure}</div>
              <div class="calendar-week-event-title">${e.titre}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  weekHTML += '</div>';
  return weekHTML;
}

function renderCalendarMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();
  
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
  let monthHTML = `
    <div class="calendar-month-view">
      <h3 class="calendar-month-title">${monthNames[month]} ${year}</h3>
      <div class="calendar-month-grid">
        <div class="calendar-weekdays">
          ${['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
        </div>
        <div class="calendar-days">
  `;
  
  // Empty cells before month starts
  for (let i = 0; i < startDay; i++) {
    monthHTML += '<div class="calendar-day empty"></div>';
  }
  
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEvents = app.data.stadiumEvents.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.toDateString() === date.toDateString();
    });
    
    const isToday = date.toDateString() === today.toDateString();
    
    monthHTML += `
      <div class="calendar-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}">
        <div class="calendar-day-num">${day}</div>
        ${dayEvents.length > 0 ? `<div class="calendar-day-dots">${'•'.repeat(Math.min(dayEvents.length, 3))}</div>` : ''}
      </div>
    `;
  }
  
  monthHTML += '</div></div></div>';
  return monthHTML;
}

// Helper functions
function formatEventDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatNewsDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  return formatEventDate(dateStr);
}

function formatFullDate(date) {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getEventTypeLabel(type) {
  const labels = {
    'tournament': 'Tournoi',
    'exposition': 'Exposition',
    'workshop': 'Workshop',
    'conference': 'Conférence',
    'jam': 'Game Jam',
    'social': 'Social',
    'hackathon': 'Hackathon',
    'festival': 'Festival'
  };
  return labels[type] || type;
}

function getEventTypeColor(type) {
  const colors = {
    'tournament': '#e74c3c',
    'exposition': '#9b59b6',
    'workshop': '#3498db',
    'conference': '#1abc9c',
    'jam': '#f39c12',
    'social': '#e91e63',
    'hackathon': '#00bcd4',
    'festival': '#ff5722'
  };
  return colors[type] || '#95a5a6';
}

// Expose functions to window
window.viewAllEvents = viewAllEvents;
window.viewEvent = viewEvent;
window.viewNews = viewNews;
