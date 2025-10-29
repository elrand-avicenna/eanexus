// menu.config.js
export const MENU_ITEMS = [
  // Icône Home flottante
  { iconeUrl: './medias/img/icone-home2.png', iconeRotate: 8, titre:'Home', route:'home',
    zone:'pinned', pin:{ position:'absolute', top:18, left:45 } },

  // Menu principal dans le drawer
  { icone:'👤', titre:'COIN DE L\'AUTEUR', route:'profil', zone:'header' },
  { icone:'🗓️', titre:'NEXUS CALENDAR', route:'calendrier', zone:'header' },
  { icone:'🏛️', titre:'NEXUS CENTER', route:'center', zone:'header' },
  
  // Les 4 projets
  { icone:'🎮', titre:'NEXUS GAMING', route:'projet:atelier-ludique', zone:'list' },
  { icone:'🎨', titre:'NEXUS THEATER', route:'projet:atelier-exposition', zone:'list' },
  { icone:'✨', titre:'NEXUS ATELIER', route:'projet:atelier-creatif', zone:'list' },
  { icone:'📚', titre:'NEXUS ACADEMY', route:'projet:atelier-pedagogique', zone:'list' }
];
