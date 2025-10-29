
// core/utils.js
export function reorderProjetsPreferred(list) {
  const pref = ['accueil','atelier-ludique','atelier-exposition','atelier-creatif','atelier-pedagogique'];
  const rank = id => {
    const i = pref.indexOf(id);
    return i === -1 ? 999 : i;
  };
  return list.slice().sort((a,b) => rank(a.id) - rank(b.id));
}

export function injectMiniAudioCSSOnce() {
  if (document.getElementById('miniAudioCSS')) return;
  const css = `
  .menu-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1001;pointer-events:auto}
  .audio-mini{position:relative;display:flex;align-items:center;gap:10px}
  .icon-btn{width:36px;height:36px;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.12);color:#fff;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.25);transition:transform .12s ease, background .2s ease}
  .icon-btn:hover{transform:translateY(-1px);background:rgba(255,255,255,.18)}
  .icon-left, .icon-right{font-weight:700;font-size:16px;line-height:1}
  .audio-headset{font-size:18px;position:relative;overflow:visible}
  .audio-pause-badge{position:absolute; inset:0; display:grid; place-items:center; opacity:0; pointer-events:none; transition:opacity .12s ease; background:transparent; border-radius:999px;}
  .audio-pause-badge svg{width:18px; height:18px; fill:#fff; filter: drop-shadow(0 0 2px rgba(0,0,0,.6));}
  .audio-mini.active .audio-prev, .audio-mini.active .audio-next{opacity:1;pointer-events:auto}
  .audio-prev, .audio-next{opacity:0;pointer-events:none}
  .audio-playing .audio-pause-badge{opacity:1}
  .drawer-close{position:absolute;top:10px;right:10px;width:36px;height:36px;border-radius:999px;border:1px solid rgba(255,255,255,.15);background:#1a1a1a;color:#fff;cursor:pointer;display:grid;place-items:center;font-size:20px;line-height:1;box-shadow:0 6px 18px rgba(0,0,0,.25);transition:transform .15s ease, background .2s ease}
  .drawer-close:hover{background:#202020;transform:translateY(-1px)}
  `;
  const style = document.createElement('style');
  style.id = 'miniAudioCSS';
  style.textContent = css;
  document.head.appendChild(style);
}
