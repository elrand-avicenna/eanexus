
// core/state.js
export const app = {
  state: {
    currentPage: 'home',
    currentProjet: null,
    currentCategorie: null,
    currentTravail: null,
    history: [],
    filters: {},
    chats: {},
    currentDuel: null
  },
  data: {
    projetsRacine: [],
    categories: {},
    travaux: {},
    menuGlobal: [],
    npcs: [],
    // AUDIO
    playlistAudio: [],
    audioOptions: { lectureAuto: false, loop: false }
  },
  ui: {
    burger: null,
    drawer: null,
    drawerNav: null,
    backdrop: null
  }
};
