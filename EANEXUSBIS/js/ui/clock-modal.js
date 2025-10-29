// ui/clock-modal.js

let clockInterval = null;

export function initClockModal() {
  updateBigClock();
  
  // Expose functions globally
  window.openClockModal = openClockModal;
  window.closeClockModal = closeClockModal;
}

function openClockModal() {
  const modal = document.getElementById('clockModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Start updating clock every second
    if (!clockInterval) {
      clockInterval = setInterval(updateBigClock, 1000);
    }
    updateBigClock();
  }
}

function closeClockModal() {
  const modal = document.getElementById('clockModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Stop updating clock
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  }
}

function updateBigClock() {
  const now = new Date();
  
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const dateElement = document.getElementById('clockDateBig');
  const hoursElement = document.getElementById('hoursBig');
  const minutesElement = document.getElementById('minutesBig');
  const secondsElement = document.getElementById('secondsBig');
  
  if (dateElement) dateElement.textContent = `${dayName} ${day} ${month} ${year}`;
  if (hoursElement) hoursElement.textContent = hours;
  if (minutesElement) minutesElement.textContent = minutes;
  if (secondsElement) secondsElement.textContent = seconds;
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeClockModal();
  }
});
