
// pages/static.js
import { app } from '../core/state.js';

export function renderProfilPage() {
  app.state.currentPage = 'profil';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';
  document.getElementById('app').innerHTML = `
    <div class="static-page fade-in" data-testid="profil-page">
      <div class="static-hero" style="background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)">
        <div class="static-hero-overlay">
          <div class="static-hero-content">
            <div class="static-hero-logo">👤</div>
            <h1 class="static-hero-titre">COIN DE L'AUTEUR</h1>
            <p class="static-hero-description">Auteur, parcours, compétences</p>
          </div>
        </div>
      </div>
      
      <div class="static-content">
        <div class="static-section">
          <h2 class="section-title">À propos</h2>
          <p class="section-text">
            Créateur multidisciplinaire passionné par l'innovation numérique et les expériences immersives.
            Spécialisé dans la création d'univers interactifs qui mêlent technologie, art et design.
          </p>
        </div>

        <div class="static-section">
          <h2 class="section-title">Compétences</h2>
          <div class="skills-grid">
            <div class="skill-item">🎮 Game Design</div>
            <div class="skill-item">🎨 Art Direction</div>
            <div class="skill-item">💻 Développement Web</div>
            <div class="skill-item">✨ Motion Design</div>
            <div class="skill-item">🎭 Scénographie</div>
            <div class="skill-item">🎵 Sound Design</div>
          </div>
        </div>

        <div class="static-section">
          <h2 class="section-title">Contact</h2>
          <div class="contact-links">
            <a href="mailto:contact@eanexus.com" class="contact-link">
              <span class="contact-icon">✉️</span>
              <span>Email</span>
            </a>
            <a href="#" class="contact-link">
              <span class="contact-icon">💼</span>
              <span>LinkedIn</span>
            </a>
            <a href="#" class="contact-link">
              <span class="contact-icon">🐦</span>
              <span>Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderCalendrierPage() {
  app.state.currentPage = 'calendrier';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';
  
  // Exemple d'événements
  const events = [
    {
      date: '15 Déc 2025',
      titre: 'Exposition "Digital Dreams"',
      lieu: 'Galerie Moderne',
      type: 'expo'
    },
    {
      date: '20 Déc 2025',
      titre: 'Workshop Game Design',
      lieu: 'En ligne',
      type: 'workshop'
    },
    {
      date: '05 Jan 2026',
      titre: 'Lancement nouveau projet',
      lieu: 'NEXUS Studio',
      type: 'launch'
    }
  ];
  
  document.getElementById('app').innerHTML = `
    <div class="static-page fade-in" data-testid="calendar-page">
      <div class="static-hero" style="background: linear-gradient(135deg, #06BEB6 0%, #48B1BF 100%)">
        <div class="static-hero-overlay">
          <div class="static-hero-content">
            <div class="static-hero-logo">🗓️</div>
            <h1 class="static-hero-titre">NEXUS CALENDAR</h1>
            <p class="static-hero-description">Événements & actualités</p>
          </div>
        </div>
      </div>
      
      <div class="static-content">
        <div class="events-list">
          ${events.map(event => `
            <div class="event-card">
              <div class="event-date-badge ${event.type}">
                <span class="event-date">${event.date}</span>
              </div>
              <div class="event-content">
                <h3 class="event-titre">${event.titre}</h3>
                <p class="event-lieu">📍 ${event.lieu}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="calendar-cta">
          <p class="cta-text">Plus d'événements à venir...</p>
          <button class="cta-btn" onclick="alert('Newsletter à venir!')">
            S'abonner à la newsletter
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderContactPage() {
  app.state.currentPage = 'contact';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';
  document.getElementById('app').innerHTML = `
    <section class="grid-page active fade-in" style="padding:40px; color:white;">
      <h1 style="font-size:28px; margin-bottom:16px;">✉️ Contact</h1>
      <div style="display:grid; gap:14px;">
        <a href="mailto:contact@ealab.example" class="travail-btn">Envoyer un e-mail</a>
        <a href="tel:+33123456789" class="travail-btn">Appeler</a>
        <a href="#" class="travail-btn" onclick="alert('Formulaire à venir')">Formulaire</a>
      </div>
      <p style="opacity:.7; margin-top:18px;">Ajoutez ici vos liens de réseaux sociaux.</p>
    </section>
  `;
}
