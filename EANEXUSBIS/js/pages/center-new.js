
// pages/center-new.js
import { app } from '../core/state.js';
import { setupSliderDots } from './helpers.js';

export function renderCenterPage() {
  app.state.currentPage = 'center';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';
  
  // Show back button
  const backBtn = document.getElementById('backNavBtn');
  if (backBtn) backBtn.style.display = 'flex';
  
  const npcs = app.data.npcs || [];
  const container = document.getElementById('app');
  
  // 2 slides: Hub + NPCs
  const slides = [
    {
      id: 'center-hub',
      logo: '🏛️',
      titre: 'NEXUS CENTER',
      description: 'Le cœur de la communauté. Rencontrez les habitants du NEXUS, discutez avec eux, relevez des défis et construisez des relations uniques.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
      isHub: true
    },
    {
      id: 'center-npcs',
      logo: '👥',
      titre: 'HABITANTS DU NEXUS',
      description: `${npcs.length} personnages vous attendent. Découvrez leurs histoires, dialoguez et défiez-les en duel.`,
      image: 'https://images.unsplash.com/photo-1726601057260-e8095dad345a?w=1200',
      cta: 'Voir les habitants',
      action: 'viewAllNPCs'
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
          <button class="page-slide-cta" onclick="window.${slide.action}()" data-testid="center-cta-${slide.id}">
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

  container.innerHTML = `<div class="page-container" id="centerContainer">${slidesHTML}</div>`;
  setupSliderDots('centerContainer', slides.length);
}

export function viewAllNPCs() {
  const npcs = app.data.npcs || [];
  
  document.getElementById('app').innerHTML = `
    <div class="detail-page fade-in" data-testid="all-npcs-page">
      <div class="detail-header">
        <button class="detail-back-btn" onclick="window.navigateTo('center')" data-testid="back-to-center">
          ← Retour au Center
        </button>
        <h1 class="detail-title">👥 Habitants du NEXUS</h1>
      </div>
      <div class="detail-content">
        <div class="events-grid">
          ${npcs.map(npc => `
            <div class="event-card" onclick="window.showNpcProfile('${npc.id}')" data-testid="npc-card-${npc.id}">
              <div class="event-card-image" style="background: linear-gradient(135deg, ${npc.couleur} 0%, ${npc.couleur}dd 100%); display: flex; align-items: center; justify-content: center; font-size: 5rem;">
                ${npc.avatar}
              </div>
              <div class="event-card-body">
                <span class="event-type tournament">Niv. ${npc.niveau}</span>
                <h3 class="event-card-title">${npc.nom}</h3>
                <p class="event-card-desc">${npc.titre}</p>
                <div class="event-card-meta">
                  <span>🎯 ${npc.specialite}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function showNpcProfile(npcId) {
  const npc = app.data.npcs.find(n => n.id === npcId);
  if (!npc) return;

  document.getElementById('app').innerHTML = `
    <div class="detail-page fade-in" data-testid="npc-profile">
      <div class="detail-header" style="background: linear-gradient(135deg, ${npc.couleur} 0%, ${npc.couleur}aa 100%);">
        <button class="detail-back-btn" onclick="window.viewAllNPCs()" data-testid="back-to-npcs">
          ← Retour
        </button>
        <div style="text-align: center; margin-top: 20px;">
          <div style="font-size: 6rem; margin-bottom: 16px;">${npc.avatar}</div>
          <h1 class="detail-title">${npc.nom}</h1>
          <p style="font-size: 1.2rem; color: rgba(255,255,255,0.9); margin-top: 8px;">${npc.titre}</p>
          <span class="event-type tournament" style="display: inline-block; margin-top: 12px;">Niveau ${npc.niveau}</span>
        </div>
      </div>
      <div class="detail-content" style="max-width: 800px;">
        <div style="margin-bottom: 30px; padding: 24px; background: var(--card-bg); border-radius: 12px;">
          <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--accent-color);">🎯 Spécialité</h3>
          <p style="font-size: 1.1rem; color: var(--text-secondary);">${npc.specialite}</p>
        </div>
        
        <div style="margin-bottom: 30px; padding: 24px; background: var(--card-bg); border-radius: 12px;">
          <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--accent-color);">📖 Biographie</h3>
          <p style="font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary);">${npc.bio}</p>
        </div>
        
        <div style="margin-bottom: 30px; padding: 24px; background: var(--card-bg); border-radius: 12px; border-left: 4px solid var(--accent-color);">
          <p style="font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); font-style: italic;">"${npc.greeting}"</p>
        </div>
        
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <button class="page-slide-cta" onclick="alert('Fonctionnalité de chat à venir !')" data-testid="chat-btn">
            💬 Discuter
          </button>
          <button class="page-slide-cta" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);" onclick="alert('Fonctionnalité de duel à venir !')" data-testid="duel-btn">
            ⚔️ Défier
          </button>
        </div>
      </div>
    </div>
  `;
}

// Expose functions
window.viewAllNPCs = viewAllNPCs;
window.showNpcProfile = showNpcProfile;
