// ===== Confetti + zones mortes (.erase depuis DOM, "fingerprint" pilotée par JS) =====
const NUM_CONFETTI = 350;
const COLORS = [
  [0, 121, 241],   // bleu
  [255, 221, 51],  // jaune
  [255, 153, 51],  // orange
  [220, 20, 60],   // rouge
  [60, 179, 113],  // vert
  [186, 85, 211]   // mauve
];
const PI_2 = 2 * Math.PI;

const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');

let w = 0;   // largeur logique en px CSS
let h = 0;   // hauteur logique en px CSS
let dpr = 1; // devicePixelRatio

/* ---------- Resize précis : canvas = taille CSS, dessin en unités CSS ---------- */
function resizeCanvasToDisplaySize() {
  const rect = canvas.getBoundingClientRect();
  dpr = window.devicePixelRatio || 1;

  const displayWidth  = Math.max(1, Math.round(rect.width  * dpr));
  const displayHeight = Math.max(1, Math.round(rect.height * dpr));

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  // Dessiner en px CSS (et non en px device)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  w = rect.width;
  h = rect.height;
}

resizeCanvasToDisplaySize();
window.addEventListener('resize', resizeCanvasToDisplaySize);

/* ---------- ZONES MORTES ---------- */
/* .erase => rectangles (DOM) */
function getEraseRects() {
  const els = document.querySelectorAll('.erase');
  if (!els.length) return [];
  const canvasRect = canvas.getBoundingClientRect();
  const out = [];
  els.forEach(el => {
    const r = el.getBoundingClientRect();
    out.push({ x: r.left - canvasRect.left, y: r.top - canvasRect.top, w: r.width, h: r.height });
  });
  return out;
}

/* "fingerprint" => fournie via JS (pas de DOM)  */
let FP_CIRCLES_CANVAS = [];  // [{cx, cy, r}] en COORDONNÉES CANVAS (px CSS)
let FP_FALLBACK_CANVAS = null; // {x,y,w,h} rect en coordonnées canvas, optionnel

// --- API publique pour fingerprint.js ---
// circles: tableau d'objets {cx, cy, r}. Par défaut "space='page'"
//   - space='page' : coords sont en page (clientX/clientY). On convertit vers canvas.
//   - space='canvas' : coords déjà relatives au canvas.
function setFingerprintCircles(circles, space = 'page') {
  const rect = canvas.getBoundingClientRect();
  if (!Array.isArray(circles)) circles = [];
  FP_CIRCLES_CANVAS = circles.map(c => {
    if (space === 'page') {
      return { cx: c.cx - rect.left, cy: c.cy - rect.top, r: c.r };
    } else {
      return { cx: c.cx, cy: c.cy, r: c.r };
    }
  });
}

// Optionnel : définir un rectangle de fallback quand il n’y a plus de cercles
function setFingerprintFallbackRect(rectLike, space = 'page') {
  if (!rectLike) { FP_FALLBACK_CANVAS = null; return; }
  const rect = canvas.getBoundingClientRect();
  FP_FALLBACK_CANVAS = (space === 'page')
    ? { x: rectLike.x - rect.left, y: rectLike.y - rect.top, w: rectLike.w, h: rectLike.h }
    : { x: rectLike.x, y: rectLike.y, w: rectLike.w, h: rectLike.h };
}

// Reset (ex: quand fingerprint est totalement “consommée”)
function clearFingerprintMask() {
  FP_CIRCLES_CANVAS = [];
  FP_FALLBACK_CANVAS = null;
}

// Expose l’API
window.bgAnim = {
  setFingerprintCircles,
  setFingerprintFallbackRect,
  clearFingerprintMask
};

/* ---------- Utils de path ---------- */
function pathRect(x, y, w_, h_, clockwise = true) {
  if (clockwise) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + w_, y);
    ctx.lineTo(x + w_, y + h_);
    ctx.lineTo(x, y + h_);
    ctx.closePath();
  } else {
    // anti-horaire → “trou” avec règle nonzero
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h_);
    ctx.lineTo(x + w_, y + h_);
    ctx.lineTo(x + w_, y);
    ctx.closePath();
  }
}

function pathCircle(cx, cy, r, clockwise = false) {
  // anti-horaire par défaut -> trou
  ctx.moveTo(cx + r, cy);
  ctx.arc(cx, cy, r, 0, Math.PI, !clockwise);
  ctx.arc(cx, cy, r, Math.PI, Math.PI * 2, !clockwise);
  ctx.closePath();
}

/* ---------- Interaction souris (déviation confettis) ---------- */
let xpos = 0.5;
document.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  xpos = w ? Math.max(0, Math.min(1, x / w)) : 0.5;
});

/* ---------- rAF polyfill minimal ---------- */
window.requestAnimationFrame = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || function (cb) { return setTimeout(cb, 1000 / 60); };

/* ---------- Confettis (très petits) ---------- */
class Confetti {
  constructor() {
    this.pickColor();
    // rayon minuscule (0.4 → 1.1 px), non arrondi
    this.r  = range(0.4, 1.1);
    this.r2 = 2 * this.r;
    this.replace();
  }
  pickColor() {
    this.style = COLORS[Math.floor(range(0, COLORS.length))];
    this.rgb   = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
  }
  replace() {
    this.opacity = 0;
    this.dop     = 0.03 * range(1, 4);
    this.x       = range(-this.r2, w - this.r2);
    this.y       = range(-20, h - this.r2);
    this.xmax    = w - this.r;
    this.ymax    = h - this.r;
    this.vx      = range(0, 2) + 8 * xpos - 5;
    this.vy      = 0.7 * this.r + range(-1, 1);
    this.pickColor();
  }
  draw() {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity += this.dop;

    if (this.opacity > 1) { this.opacity = 1; this.dop *= -1; }
    if (this.opacity < 0 || this.y > this.ymax) { this.replace(); }

    if (Math.random() < 0.002) this.pickColor();

    drawCircle(this.x, this.y, this.r, `${this.rgb},${this.opacity})`);
  }
}

/* ---------- Petites utils ---------- */
function range(a, b) { return (b - a) * Math.random() + a; }
function drawCircle(x, y, r, style) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, PI_2, false);
  ctx.fillStyle = style;
  ctx.fill();
}

const confetti = Array.from({ length: NUM_CONFETTI }, () => new Confetti());

/* ---------- Boucle ---------- */
function step() {
  requestAnimationFrame(step);

  // suit taille CSS (utile si layout change)
  resizeCanvasToDisplaySize();

  // clear
  ctx.clearRect(0, 0, w, h);

  // récupérer zones mortes
  const eraseRects = getEraseRects();
  const fpCircles  = FP_CIRCLES_CANVAS || [];
  const fpFallback = (!fpCircles.length ? FP_FALLBACK_CANVAS : null);

  // 1) CLIP (nonzero) : tout sauf les zones mortes
  ctx.save();
  ctx.beginPath();

  // grand rect extérieur (horaire)
  pathRect(0, 0, w, h, true);

  // trous rectangles .erase (anti-horaire)
  eraseRects.forEach(z => pathRect(z.x, z.y, z.w, z.h, false));

  // trous fingerprint : cercles (anti-horaire)
  fpCircles.forEach(c => pathCircle(c.cx, c.cy, c.r, false));

  // fallback rect fingerprint si aucun cercle
  if (!fpCircles.length && fpFallback) {
    pathRect(fpFallback.x, fpFallback.y, fpFallback.w, fpFallback.h, false);
  }

  ctx.clip();

  // 2) Dessin confettis
  for (const c of confetti) c.draw();
  ctx.restore();

  // 3) PASSE DE SECOURS (destination-out) – efface tout résidu éventuel
  if (eraseRects.length || fpCircles.length || fpFallback) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    // rectangles .erase
    eraseRects.forEach(z => ctx.fillRect(z.x, z.y, z.w, z.h));

    // cercles fingerprint
    fpCircles.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, c.r, 0, PI_2);
      ctx.fill();
    });

    // fallback rect fingerprint
    if (!fpCircles.length && fpFallback) {
      ctx.fillRect(fpFallback.x, fpFallback.y, fpFallback.w, fpFallback.h);
    }

    ctx.restore();
  }

  // // DEBUG : visualiser les zones mortes
  // ctx.save();
  // ctx.strokeStyle = 'magenta';
  // ctx.setLineDash([6, 4]);
  // eraseRects.forEach(z => ctx.strokeRect(z.x, z.y, z.w, z.h));
  // ctx.strokeStyle = 'cyan';
  // fpCircles.forEach(c => { ctx.beginPath(); ctx.arc(c.cx, c.cy, c.r, 0, PI_2); ctx.stroke(); });
  // if (!fpCircles.length && fpFallback) { ctx.strokeStyle = 'cyan'; ctx.strokeRect(fpFallback.x, fpFallback.y, fpFallback.w, fpFallback.h); }
  // ctx.restore();
}

step();
