// pages/helpers.js - Fonctions communes

// Setup slider dots
export function setupSliderDots(containerId, slideCount) {
  const dotsWrap = document.getElementById('scrollIndicator');
  if (!dotsWrap) return;
  
  dotsWrap.innerHTML = Array.from({length: slideCount}, (_, i) =>
    `<div class="scroll-dot ${i===0?'active':''}" data-index="${i}"></div>`).join('');
  
  const dots = dotsWrap.querySelectorAll('.scroll-dot');
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  dots.forEach(dot => dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.index, 10);
    const slides = container.querySelectorAll('.page-slide, .home-slide');
    if (slides[idx]) slides[idx].scrollIntoView({ behavior: 'smooth' });
  }));

  container.addEventListener('scroll', () => {
    const currentIndex = Math.round(container.scrollTop / window.innerHeight);
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  });
}

// Format dates
export function formatEventDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatNewsDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  return formatEventDate(dateStr);
}

// Event type labels
export function getEventTypeLabel(type) {
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
