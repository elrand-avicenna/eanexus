
// pages/static.js
import { app } from '../core/state.js';

export function renderProfilPage() {
  app.state.currentPage = 'profil';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';
  document.getElementById('app').innerHTML = `
    <section class="grid-page active fade-in" style="padding:40px; color:white;">
      <h1 style="font-size:28px; margin-bottom:10px;">👤 Profil</h1>
      <p>Section à venir. Ajoutez votre contenu / JSON quand vous serez prêt.</p>
    </section>
  `;
}
export function renderCalendrierPage() {
  app.state.currentPage = 'calendrier';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';
  document.getElementById('app').innerHTML = `
    <section class="grid-page active fade-in" style="padding:40px; color:white;">
      <h1 style="font-size:28px; margin-bottom:10px;">🗓️ Calendrier</h1>
      <p>Section à venir. Vous pourrez brancher un JSON d'évènements ou une API plus tard.</p>
    </section>
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
