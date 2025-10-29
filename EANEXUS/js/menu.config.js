// menu.config.js
export const MENU_ITEMS = [
  // Icône Home flottante
  { iconeUrl: './medias/img/icone-home2.png', iconeRotate: 8, titre:'Home', route:'home',
    zone:'pinned', pin:{ position:'absolute', top:18, left:45 } },

  // Menu principal dans le drawer
  { icone:'👤', titre:'COIN DE L\'AUTEUR', route:'profil', zone:'list' },
  { icone:'🗓️', titre:'NEXUS CALENDAR', route:'calendrier', zone:'list' },
  { icone:'🏛️', titre:'NEXUS CENTER', route:'center', zone:'list' }
];
