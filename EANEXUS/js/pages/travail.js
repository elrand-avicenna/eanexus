
// pages/travail.js
import { app } from '../core/state.js';

export function renderTravailPage(projetId, categorieId, travailId) {
  app.state.currentPage = 'travail';
  app.state.currentProjet = projetId;
  app.state.currentCategorie = categorieId;
  app.state.currentTravail = travailId;
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';

  const travaux = app.data.travaux[categorieId] || [];
  const travail = travaux.find(t => t.id === travailId);
  if (!travail) {
    document.getElementById('app').innerHTML = `
      <section class="grid-page active fade-in" style="padding:40px; color:white;">
        <h2>Projet introuvable</h2>
        <p>Vérifiez l'ID de travail ou vos fichiers JSON.</p>
      </section>`;
    return;
  }

  const container = document.getElementById('app');
  const headerStyle = travail.background
    ? `background: ${travail.background};`
    : `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`;

  container.innerHTML = `
    <div class="travail-page active fade-in">
      <div class="travail-detail-header" style="${headerStyle}">
        <div class="travail-detail-logo">${travail.logo || ''}</div>
        <div class="travail-detail-titre">${travail.titre}</div>
      </div>
      <div class="travail-detail-body">
        <img src="${travail.image}" alt="${travail.titre}" class="travail-detail-image" />
        <div class="travail-detail-section">
          <div class="travail-detail-label">Description</div>
          <div class="travail-detail-text">${travail.description || ''}</div>
        </div>
        <div class="travail-detail-section">
          <div class="travail-detail-label">Thème</div>
          <div class="travail-detail-text">${travail.theme || '—'}</div>
        </div>
        <div class="travail-detail-section">
          <div class="travail-detail-label">Informations</div>
          <div class="travail-detail-infos">${travail.infos || ''}</div>
        </div>
        <div class="travail-detail-section">
          <div class="travail-detail-label">Détails du projet</div>
          <div class="travail-detail-text">${travail.details || ''}</div>
        </div>
        <button class="travail-btn" style="margin-top: 20px;" onclick="alert('Page à développer ultérieurement')">
          Voir plus d'informations →
        </button>
      </div>
    </div>
  `;
}
