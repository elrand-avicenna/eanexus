
// ui/drawer.js
import { app } from '../core/state.js';
import { navigateTo } from '../router.js';

function iconHTML(item) {
  if (item.iconeUrl) {
    const rot = Number(item.iconeRotate) || 0;
    return `<img class="icon-img" src="${item.iconeUrl}" alt="" draggable="false" style="transform:rotate(${rot}deg);" />`;
  }
  return item.icone || '';
}


export function hydrateUI() {
  app.ui.burger = document.getElementById('burger');
  app.ui.drawer = document.getElementById('drawer');
  app.ui.drawerNav = document.getElementById('drawerNav');
  app.ui.backdrop = document.getElementById('backdrop');

  updateMenuDrawer();

  if (app.ui.burger) app.ui.burger.addEventListener('click', toggleDrawer);
  if (app.ui.backdrop) app.ui.backdrop.addEventListener('click', () => { closeDrawer(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  app.ui.drawer.addEventListener('transitionend', () => {
    if (app.ui.drawer.classList.contains('open')) {
      const firstItem = app.ui.drawer.querySelector('.menu-item');
      if (firstItem && firstItem.focus) firstItem.focus();
    } else {
      app.ui.burger && app.ui.burger.focus && app.ui.burger.focus();
    }
  });
}

export function updateMenuDrawer() {
  if (!app.ui.drawerNav) return;

  const titleEl = document.getElementById('menuTitle');
  if (titleEl) titleEl.textContent = 'EA LAB';

  app.ui.drawerNav.innerHTML = `
    <div class="menu-list" id="drawerHeader"></div>
    <div class="menu-list" id="drawerList"></div>
    <div class="menu-list" id="drawerFooter"></div>
  `;

  const zones = {
    header: document.getElementById('drawerHeader'),
    list: document.getElementById('drawerList'),
    footer: document.getElementById('drawerFooter')
  };

  app.data.menuGlobal.forEach(item => {
    // >>> AJOUT (1/2) : ignorer les "pinned" ici
    if (item.zone === 'pinned') return;

    const el = document.createElement('button');
    el.className = 'menu-item';
    el.type = 'button';
    el.innerHTML = `
      <div class="menu-item-icone" aria-hidden="true">${iconHTML(item)}</div>
      <div class="menu-item-titre">${item.titre}</div>
    `;
    el.title = item.titre;
    el.onclick = () => { closeDrawer(); navigateTo(item.route); };

    const zone = zones[item.zone] || zones.list;
    zone.appendChild(el);
  });

  // >>> AJOUT (2/2) : rendre les icônes “pinned”
  renderPinnedIcons();
}

// Calque "background" (l'image) qui sert de conteneur aux pinned en absolute
function ensureDrawerBackgroundLayer() {
  if (!app.ui.drawer) return null;
  let bg = app.ui.drawer.querySelector('#drawerNav');
  if (!bg) {
    bg = document.createElement('div');
    bg.id = 'drawerNav';
    bg.className = 'drawer-nav';
    app.ui.drawer.insertBefore(bg, app.ui.drawer.firstChild); // avant le contenu
  }
  return bg;
}

// === AJOUT : rendu des icônes pinned ===
function renderPinnedIcons() {
  // Couche viewport (pour FIXED)
  let layer = document.getElementById('pinnedMenu');
  if (!layer) { layer = document.createElement('div'); layer.id = 'pinnedMenu'; document.body.appendChild(layer); }
  layer.innerHTML = '';

  // Conteneur "image de fond" du drawer
  const drawerNav = ensureDrawerBackgroundLayer();

  // % partout
  const pct = v => (typeof v === 'number' ? `${v}%` : (v ?? ''));

  (app.data.menuGlobal || []).forEach(item => {
    if (item.zone !== 'pinned' || !item.pin) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pinned-item';
    btn.setAttribute('aria-label', item.titre || '');
    btn.title = item.titre || '';
btn.innerHTML = `
  <span class="menu-item-icone">${iconHTML(item)}</span>
  ${item.showLabel ? `<span class="pinned-item-label">${item.titre || ''}</span>` : ''}
`;
    btn.onclick = () => { closeDrawer(); navigateTo(item.route); };

    const p = item.pin || {};
    const style = [
      `position:${p.position || 'fixed'}`,
      p.top    != null ? `top:${pct(p.top)}`       : '',
      p.right  != null ? `right:${pct(p.right)}`   : '',
      p.bottom != null ? `bottom:${pct(p.bottom)}` : '',
      p.left   != null ? `left:${pct(p.left)}`     : '',
      p.zIndex != null ? `z-index:${p.zIndex}`     : ''
    ].filter(Boolean).join(';');
    btn.setAttribute('style', style);

    // === CHOIX DU CONTENEUR ===
    // par défaut : en absolute -> dans le background du drawer (pour que % suive l'image)
    //              en fixed     -> dans le layer viewport
    let host = null;
    if (p.position === 'absolute') host = drawerNav;

    // Si un container est fourni :
    if (p.container) {
      const c = String(p.container).trim();
      // On redirige '#drawer' -> background, + aliases conviviaux
      if (c === '#drawer' || c === '#drawerNav' || c === 'background' || c === 'drawer:bg') {
        host = drawerNav;
      } else {
        const custom = document.querySelector(c);
        if (custom instanceof HTMLElement) host = custom;
      }
    }

    (host instanceof HTMLElement ? host : layer).appendChild(btn);
  });
}


export function openDrawer() {
  app.ui.drawer.classList.add('open');
  app.ui.backdrop.classList.add('show');
  app.ui.burger.classList.add('active');
  app.ui.burger.setAttribute('aria-expanded', 'true');
  app.ui.drawer.setAttribute('aria-hidden', 'false');
}
export function closeDrawer() {
  app.ui.drawer.classList.remove('open');
  app.ui.backdrop.classList.remove('show');
  app.ui.burger.classList.remove('active');
  app.ui.burger.setAttribute('aria-expanded', 'false');
  app.ui.drawer.setAttribute('aria-hidden', 'true');
}
export function toggleDrawer() {
  if (app.ui.drawer.classList.contains('open')) closeDrawer(); else openDrawer();
}
export function ensureDrawerCloseButton() {
  if (!app.ui.drawer || document.getElementById('drawerClose')) return;
  const btn = document.createElement('button');
  btn.id = 'drawerClose';
  btn.className = 'drawer-close';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Fermer le menu');
  btn.textContent = '×';
  btn.addEventListener('click', closeDrawer);
  app.ui.drawer.appendChild(btn);
}
