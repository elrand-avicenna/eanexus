/* icon-follow.spring.hold-to-follow.v2.js
   Mêmes sélecteurs/classes. Parité totale souris/doigt :
   - Icône choisie => les 2 autres fondent et disparaissent.
   - Tant qu'on GARDE APPUYÉ (n'importe où), l'icône suit et se centre sous le pointeur (souris OU doigt).
   - Au relâchement, l'icône s'arrête à sa position.
*/
(() => {
  const SELECTORS = ['[data-follow-icon]', '.pickable-icon', '.icon-follow'];

  const freqHz = 2.2;
  const dampingRatio = 1.05;
  const FADE_MS = 160;
  const Z = 999999;
  const CLAMP_TO_VIEWPORT = true;

  function injectStyle() {
    const s = document.createElement('style');
    s.textContent = `
      .__ifst_init { touch-action:none; user-select:none; -webkit-user-drag:none; cursor:pointer; will-change:transform; }
      .__ifst_hide { opacity:0 !important; transition:opacity ${FADE_MS}ms ease; }
      html, body { touch-action:none; } /* parité : éviter le scroll pendant hold tactile */
    `;
    document.head.appendChild(s);
  }
  const ready = (fn) =>
    (document.readyState === 'loading')
      ? document.addEventListener('DOMContentLoaded', fn, { once: true })
      : fn();

  ready(() => {
    injectStyle();

    // Récupération des icônes via les mêmes sélecteurs
    let icons = [];
    for (const sel of SELECTORS) { icons = Array.from(document.querySelectorAll(sel)); if (icons.length) break; }
    if (!icons.length) { console.warn('[icon-follow] Aucune icône trouvée.'); return; }
    icons.forEach(el => el.classList.add('__ifst_init'));

    // ÉTAT
    let active = null;
    let picked = false;
    let baseLeft = 0, baseTop = 0;
    let halfW = 0, halfH = 0;

    // Ressort
    let x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0;
    const TWO_PI = Math.PI * 2;
    const omega = TWO_PI * freqHz;
    const z = dampingRatio;
    let lastT = null, rafId = null;

    let isHolding = false;
    let holdPointerId = null;

    function stepSpring(dt) {
      const ax = -2 * z * omega * vx - (omega * omega) * (x - tx);
      const ay = -2 * z * omega * vy - (omega * omega) * (y - ty);
      vx += ax * dt; vy += ay * dt;
      x  += vx * dt; y  += vy * dt;
      if (active) active.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    }
    function animate(t) {
      if (!active) { lastT = null; rafId = null; return; }
      if (lastT == null) lastT = t;
      const dt = Math.max(0.001, Math.min(0.032, (t - lastT) / 1000));
      lastT = t;
      stepSpring(dt);
      rafId = requestAnimationFrame(animate);
    }
    const ensureRAF = () => { if (rafId == null) rafId = requestAnimationFrame(animate); };

    function setTargetCentered(cx, cy) {
      if (!active) return;
      let desiredLeft = cx - halfW;
      let desiredTop  = cy - halfH;

      if (CLAMP_TO_VIEWPORT) {
        const maxLeft = window.innerWidth - active.offsetWidth;
        const maxTop  = window.innerHeight - active.offsetHeight;
        if (desiredLeft < 0) desiredLeft = 0; else if (desiredLeft > maxLeft) desiredLeft = maxLeft;
        if (desiredTop  < 0) desiredTop  = 0; else if (desiredTop  > maxTop)  desiredTop  = maxTop;
      }
      tx = desiredLeft - baseLeft;
      ty = desiredTop  - baseTop;
    }

    function onHoldMove(e) {
      if (!isHolding || !active) return;
      if (e.pointerId != null && holdPointerId != null && e.pointerId !== holdPointerId) return;
      setTargetCentered(e.clientX, e.clientY);
    }
    function stopHold(e) {
      if (e && holdPointerId != null && e.pointerId != null && e.pointerId !== holdPointerId) return;
      isHolding = false;
      holdPointerId = null;
      document.removeEventListener('pointermove', onHoldMove);
      document.removeEventListener('pointerup', stopHold);
      document.removeEventListener('pointercancel', stopHold);
    }
    function startHold(e) {
      if (!active) return;
      isHolding = true;
      holdPointerId = e.pointerId ?? null;
      setTargetCentered(e.clientX, e.clientY);
      document.addEventListener('pointermove', onHoldMove, { passive: true });
      document.addEventListener('pointerup', stopHold, { passive: true });
      document.addEventListener('pointercancel', stopHold, { passive: true });
      // éviter le scroll fantôme sur mobile
      if (e.cancelable) e.preventDefault();
    }

    // Sélection d'une icône
    icons.forEach((el) => {
      el.addEventListener('pointerdown', (e) => {
        if (!picked) {
          icons.forEach(o => {
            if (o !== el) {
              o.classList.add('__ifst_hide');
              o.style.pointerEvents = 'none';
              setTimeout(() => { o.style.display = 'none'; }, FADE_MS);
            }
          });
          picked = true;
        }
        const r = el.getBoundingClientRect();
        el.style.position = 'fixed';
        el.style.left = r.left + 'px';
        el.style.top = r.top + 'px';
        el.style.width = r.width + 'px';
        el.style.height = r.height + 'px';
        el.style.margin = '0';
        el.style.zIndex = String(Z);
        el.style.transformOrigin = 'top left';
        el.style.transform = 'translate3d(0,0,0)';
        el.style.pointerEvents = 'none';
        if (el.parentNode !== document.body) document.body.appendChild(el);

        active = el;
        baseLeft = r.left; baseTop = r.top;
        halfW = r.width / 2; halfH = r.height / 2;
        x = 0; y = 0; vx = 0; vy = 0; tx = 0; ty = 0;
        lastT = null; ensureRAF();

        startHold(e);
      }, { passive: false });
    });

    // Hold-to-follow partout après sélection (parité souris/doigt)
    document.addEventListener('pointerdown', (e) => {
      if (!picked) return;
      if (isHolding) return;
      startHold(e);
    }, { passive: false });
  });

// [AJOUT] Clic sur une des 3 icônes -> remplace uniquement l'URL dans `background` de .bg-deverouillage-bottom
document.addEventListener('click', (e) => {
  const ICON_CLASS = '.CLASSE_COMMUNE_ICONE'; // <-- remplace par la classe commune des 3 icônes
  if (!e.target.closest(ICON_CLASS)) return;

  const bottom = document.querySelector('.bg-deverouillage-bottom');
  if (!bottom) return;

  const current = bottom.style.background || getComputedStyle(bottom).background;
  const newBg = /url\(/i.test(current)
    ? current.replace(/url\((?:'|")?[^'")]+(?:'|")?\)/gi, 'url("./img/bg-ae.jpg")')
    : `url("./img/bg-ae.jpg") center / cover no-repeat`;

  bottom.style.background = newBg;
}, true);



})();


