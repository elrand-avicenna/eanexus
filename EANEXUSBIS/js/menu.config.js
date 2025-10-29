// menu.config.js
export const MENU_ITEMS = [
  // Icônes en haut à droite (header icons - pinned)
  { icone:'🔷', titre:'NEXUS HUB', route:'hub', zone:'pinned', pin: { position:'fixed', top:20, right:240, zIndex:1000 }, showLabel:false },
  { icone:'👤', titre:'COIN DE L\'AUTEUR', route:'profil', zone:'pinned', pin: { position:'fixed', top:20, right:180, zIndex:1000 }, showLabel:false },
  { icone:'🗓️', titre:'CALENDRIER', route:'calendrier', zone:'pinned', pin: { position:'fixed', top:20, right:120, zIndex:1000 }, showLabel:false },
  
  // Menu hamburger - Pages principales
  { icone:'🏟️', titre:'NEXUS STADIUM', route:'stadium', zone:'list' },
  { icone:'🔬', titre:'NEXUS LABO', route:'labo', zone:'list' },
  { icone:'🏛️', titre:'NEXUS CENTER', route:'center', zone:'list' }
];
