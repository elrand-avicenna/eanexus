
// pages/hub.js
import { app } from '../core/state.js';

export function renderHubPage() {
  app.state.currentPage = 'hub';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';
  
  // Get Hub project from data
  const hubProjet = app.data.projetsRacine.find(p => p.id === 'nexus-hub');
  const subSections = hubProjet?.subSections || [];
  
  document.getElementById('app').innerHTML = `
    <div class="hub-page fade-in" data-testid="hub-page">
      <!-- Hero Section -->
      <div class="hub-hero">
        <img src="https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200"
             alt="Nexus Hub" class="hub-hero-bg" />
        <div class="hub-hero-overlay"></div>
        <div class="hub-hero-content">
          <div class="hub-hero-logo">🔷</div>
          <h1 class="hub-hero-title">NEXUS HUB</h1>
          <p class="hub-hero-description">
            Centre d'information et plan du site. Le NEXUS est un univers créatif multimédia composé de plusieurs zones interconnectées.
          </p>
        </div>
      </div>

      <!-- Concept Explanation -->
      <div class="hub-concept-section">
        <h2 class="hub-section-title">📖 CONCEPT DU NEXUS</h2>
        <div class="hub-concept-grid">
          <div class="concept-card">
            <div class="concept-icon">🏟️</div>
            <h3>NEXUS STADIUM</h3>
            <p>Votre source d'événements, d'actualités et de rendez-vous communautaires. Un espace vivant où se déroulent tournois, conférences, workshops et rencontres.</p>
          </div>
          <div class="concept-card">
            <div class="concept-icon">🔬</div>
            <h3>NEXUS LABO</h3>
            <p>Laboratoire d'expériences créatives organisé comme une tour à plusieurs étages. Chaque étage représente un domaine de projets : Gaming, Theater, Atelier, et Academy.</p>
          </div>
          <div class="concept-card">
            <div class="concept-icon">🏛️</div>
            <h3>NEXUS CENTER</h3>
            <p>Le cœur de la communauté. Rencontrez les NPCs (personnages non-joueurs), discutez avec eux, relevez des défis et construisez des relations.</p>
          </div>
        </div>
      </div>

      <!-- Site Map / Navigation -->
      <div class="hub-navigation-section">
        <h2 class="hub-section-title">🗺️ PLAN DU SITE</h2>
        <div class="hub-zones-grid">
          ${subSections.map(zone => `
            <div class="hub-zone-card" onclick="window.navigateTo('${zone.route}')" 
                 style="background: linear-gradient(135deg, ${zone.couleur}dd 0%, ${zone.couleur}aa 100%)"
                 data-testid="hub-zone-${zone.id}">
              <div class="hub-zone-icon">${zone.logo}</div>
              <h3 class="hub-zone-title">${zone.titre}</h3>
              <p class="hub-zone-description">${zone.description}</p>
              <div class="hub-zone-cta">Visiter →</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Links -->
      <div class="hub-quicklinks-section">
        <h2 class="hub-section-title">⚡ ACCÈS RAPIDE</h2>
        <div class="hub-quicklinks-grid">
          <button class="quicklink-btn" onclick="window.navigateTo('profil')" data-testid="quick-profil">
            <span class="quicklink-icon">👤</span>
            <span class="quicklink-text">Coin de l'Auteur</span>
          </button>
          <button class="quicklink-btn" onclick="window.navigateTo('calendrier')" data-testid="quick-calendar">
            <span class="quicklink-icon">🗓️</span>
            <span class="quicklink-text">Calendrier</span>
          </button>
          <button class="quicklink-btn" onclick="window.navigateTo('home')" data-testid="quick-home">
            <span class="quicklink-icon">🏠</span>
            <span class="quicklink-text">Accueil</span>
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="hub-footer-info">
        <p class="hub-footer-text">
          🌟 Le NEXUS est un espace en constante évolution. De nouvelles zones et fonctionnalités sont ajoutées régulièrement.
        </p>
      </div>
    </div>
  `;
}
