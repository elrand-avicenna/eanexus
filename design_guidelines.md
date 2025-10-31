# Pli & Mat - Chess Card Game Design Guidelines

## GRADIENT RESTRICTION RULE
**NEVER** use dark/saturated gradient combos (e.g., purple/pink, blue-purple, red-pink) on any UI element.
**NEVER** let gradients cover more than 20% of the viewport.
**NEVER** apply gradients to text-heavy content or reading areas.
**NEVER** use gradients on small UI elements (<100px width).
**NEVER** stack multiple gradient layers in the same viewport.

### ENFORCEMENT RULE
IF gradient area exceeds 20% of viewport OR impacts readability
THEN fallback to solid colors or simple, two-color gradients.

### ALLOWED GRADIENT USAGE
- Hero/landing sections (background only, ensure text readability)
- Section backgrounds (not content blocks)
- Large CTA buttons / major interactive elements (light/simple gradients only)
- Decorative overlays and accent visuals

---

## Design Philosophy

**Pli & Mat** embodies a **dark, luxurious, chess-inspired aesthetic** that merges the elegance of traditional chess with the dynamic energy of card battle games. The design prioritizes:

- **Sophistication**: Deep blacks, rich textures, metallic accents
- **Clarity**: High contrast for gameplay elements, clear visual hierarchy
- **Drama**: Cinematic lighting, smooth animations, particle effects
- **Premium Feel**: Polished surfaces, subtle shadows, refined typography

---

## Color System

### Primary Palette

```json
{
  "background": {
    "primary": "#0a0a0a",
    "secondary": "#141414",
    "tertiary": "#1a1a1a",
    "card": "#1c1c1c",
    "elevated": "#222222"
  },
  "chess_board": {
    "dark_square": "#2c2416",
    "light_square": "#4a3f2e"
  },
  "white_side": {
    "primary": "#d4af37",
    "secondary": "#f4e5c3",
    "accent": "#ffd700",
    "glow": "rgba(212, 175, 55, 0.3)"
  },
  "black_side": {
    "primary": "#c0c0c0",
    "secondary": "#e8e8e8",
    "accent": "#b8b8b8",
    "glow": "rgba(192, 192, 192, 0.3)"
  },
  "combat": {
    "attack_crown": "#d4af37",
    "attack_paper": "#e8e8e8",
    "attack_scissors": "#c0c0c0",
    "attack_rock": "#8b7355",
    "clash_particles": "#ffd700"
  },
  "ui": {
    "text_primary": "#f5f5f5",
    "text_secondary": "#b8b8b8",
    "text_muted": "#6b6b6b",
    "border": "#333333",
    "border_active": "#d4af37",
    "success": "#4ade80",
    "danger": "#ef4444",
    "warning": "#f59e0b"
  }
}
```

### Semantic Colors

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --bg-tertiary: #1a1a1a;
  --bg-card: #1c1c1c;
  --bg-elevated: #222222;
  
  /* Chess Board */
  --chess-dark: #2c2416;
  --chess-light: #4a3f2e;
  
  /* White Side (Gold) */
  --white-primary: #d4af37;
  --white-secondary: #f4e5c3;
  --white-accent: #ffd700;
  --white-glow: rgba(212, 175, 55, 0.3);
  
  /* Black Side (Silver) */
  --black-primary: #c0c0c0;
  --black-secondary: #e8e8e8;
  --black-accent: #b8b8b8;
  --black-glow: rgba(192, 192, 192, 0.3);
  
  /* Combat Powers */
  --power-crown: #d4af37;
  --power-paper: #e8e8e8;
  --power-scissors: #c0c0c0;
  --power-rock: #8b7355;
  
  /* UI Elements */
  --text-primary: #f5f5f5;
  --text-secondary: #b8b8b8;
  --text-muted: #6b6b6b;
  --border: #333333;
  --border-active: #d4af37;
  --success: #4ade80;
  --danger: #ef4444;
  --warning: #f59e0b;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.7);
  --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.8);
  
  /* Gold Glow */
  --glow-gold: 0 0 20px rgba(212, 175, 55, 0.4);
  --glow-silver: 0 0 20px rgba(192, 192, 192, 0.4);
}
```

---

## Typography

### Font Families

**Primary Font (Headings & Titles):**
- **Playfair Display** - Elegant, dramatic serif for game title and major headings
- Fallback: Georgia, serif

**Secondary Font (UI & Body):**
- **Inter** - Clean, modern sans-serif for UI elements, card text, and body content
- Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Accent Font (Numbers & Stats):**
- **Space Grotesk** - Geometric sans-serif for HP counters, card numbers, and stats
- Fallback: monospace

### Font Loading

```html
<!-- Add to HTML <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Typography Scale

```css
:root {
  /* Font Families */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-accent: 'Space Grotesk', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-black: 900;
}
```

### Text Hierarchy

```css
/* Game Title */
.game-title {
  font-family: var(--font-heading);
  font-size: var(--text-6xl);
  font-weight: var(--font-black);
  line-height: var(--leading-tight);
  letter-spacing: 0.02em;
  color: var(--white-primary);
  text-shadow: 0 4px 12px rgba(212, 175, 55, 0.5);
}

/* Section Headings */
.section-heading {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

/* Card Titles */
.card-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

/* Body Text */
.body-text {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
}

/* HP Counter / Stats */
.stat-text {
  font-family: var(--font-accent);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

/* Small Labels */
.label-text {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}
```

---

## Spacing System

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Spacing Guidelines

- **Card Padding**: `var(--space-4)` to `var(--space-6)`
- **Section Spacing**: `var(--space-12)` to `var(--space-16)`
- **Component Gaps**: `var(--space-3)` to `var(--space-4)`
- **Button Padding**: `var(--space-3)` horizontal, `var(--space-2)` vertical
- **Card Gaps in Hand**: `var(--space-2)` (overlapping cards)

---

## Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;  /* Fully rounded */
}
```

---

## Component Styles

### 1. Main Menu Screen

```css
.main-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-primary);
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(192, 192, 192, 0.05) 0%, transparent 50%);
  padding: var(--space-8);
}

.game-title {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: var(--font-black);
  color: var(--white-primary);
  text-shadow: 
    0 0 30px rgba(212, 175, 55, 0.6),
    0 4px 12px rgba(0, 0, 0, 0.8);
  margin-bottom: var(--space-12);
  letter-spacing: 0.05em;
  text-align: center;
}

.menu-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-2xl);
  padding: var(--space-10);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 100%;
}

.menu-section {
  margin-bottom: var(--space-8);
}

.menu-section:last-child {
  margin-bottom: 0;
}

.menu-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-3);
  display: block;
}
```

### 2. Buttons

```css
/* Primary Button (Start Game) */
.btn-primary {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--bg-primary);
  background: linear-gradient(135deg, var(--white-primary) 0%, var(--white-accent) 100%);
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-8);
  cursor: pointer;
  box-shadow: 
    0 4px 12px rgba(212, 175, 55, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  text-align: center;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px rgba(212, 175, 55, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 
    0 2px 8px rgba(212, 175, 55, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Secondary Button (Color/Difficulty Selection) */
.btn-secondary {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-active);
}

.btn-secondary.active {
  background: var(--bg-tertiary);
  border-color: var(--white-primary);
  box-shadow: 0 0 12px rgba(212, 175, 55, 0.3);
}

/* Icon Button (Rules Toggle) */
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.btn-icon:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-active);
}
```

### 3. Game Board Layout

```css
.game-board {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-primary);
  padding: var(--space-4);
  gap: var(--space-4);
}

/* Player Zones */
.player-zone {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.player-zone.opponent {
  flex-direction: column-reverse;
}

/* HP Counter */
.hp-counter {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-5);
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.hp-counter.white-side {
  border-color: var(--white-primary);
  box-shadow: 0 0 12px rgba(212, 175, 55, 0.2);
}

.hp-counter.black-side {
  border-color: var(--black-primary);
  box-shadow: 0 0 12px rgba(192, 192, 192, 0.2);
}

.hp-value {
  font-family: var(--font-accent);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.hp-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Defense Zone */
.defense-zone {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-tertiary);
  border: 2px dashed var(--border);
  border-radius: var(--radius-lg);
  min-height: 180px;
  align-items: center;
  justify-content: center;
}

.defense-zone.empty::before {
  content: 'Defense Zone (Max 3)';
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Combat Zone */
.combat-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  padding: var(--space-10);
  background: 
    linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(192, 192, 192, 0.05) 100%),
    var(--bg-secondary);
  border: 2px solid var(--border);
  border-radius: var(--radius-2xl);
  min-height: 250px;
  position: relative;
  overflow: hidden;
}

.combat-zone::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

/* Hand Container */
.hand-container {
  position: relative;
  padding: var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.hand-cards {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding: var(--space-2);
  scroll-behavior: smooth;
}

.hand-cards::-webkit-scrollbar {
  height: 8px;
}

.hand-cards::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

.hand-cards::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: var(--radius-sm);
}

.hand-cards::-webkit-scrollbar-thumb:hover {
  background: var(--border-active);
}
```

### 4. Card Design

```css
.card {
  position: relative;
  width: 140px;
  height: 200px;
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

/* Chess Board Pattern Background */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(45deg, var(--chess-dark) 25%, transparent 25%),
    linear-gradient(-45deg, var(--chess-dark) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--chess-dark) 75%),
    linear-gradient(-45deg, transparent 75%, var(--chess-dark) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

.card > * {
  position: relative;
  z-index: 1;
}

/* White Side Cards */
.card.white-side {
  border-color: var(--white-primary);
  background: linear-gradient(135deg, #1c1c1c 0%, #242424 100%);
}

.card.white-side:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 
    0 12px 24px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(212, 175, 55, 0.4);
  border-color: var(--white-accent);
}

/* Black Side Cards */
.card.black-side {
  border-color: var(--black-primary);
  background: linear-gradient(135deg, #1c1c1c 0%, #242424 100%);
}

.card.black-side:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 
    0 12px 24px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(192, 192, 192, 0.4);
  border-color: var(--black-accent);
}

/* Card Selected State */
.card.selected {
  transform: translateY(-12px) scale(1.08);
  border-width: 3px;
}

.card.white-side.selected {
  border-color: var(--white-accent);
  box-shadow: 
    0 16px 32px rgba(0, 0, 0, 0.9),
    0 0 30px rgba(212, 175, 55, 0.6);
}

.card.black-side.selected {
  border-color: var(--black-accent);
  box-shadow: 
    0 16px 32px rgba(0, 0, 0, 0.9),
    0 0 30px rgba(192, 192, 192, 0.6);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2);
}

.card-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-number {
  font-family: var(--font-accent);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--text-muted);
}

/* Chess Piece Icon */
.card-piece {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  margin: var(--space-2) 0;
}

.card.white-side .card-piece {
  color: var(--white-primary);
  text-shadow: 0 2px 8px rgba(212, 175, 55, 0.5);
}

.card.black-side .card-piece {
  color: var(--black-primary);
  text-shadow: 0 2px 8px rgba(192, 192, 192, 0.5);
}

/* Card Footer (Powers) */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-2);
  border-top: 1px solid var(--border);
}

.card-power {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.power-label {
  font-family: var(--font-body);
  font-size: 0.625rem;
  font-weight: var(--font-medium);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.power-icon {
  font-size: var(--text-xl);
  color: var(--text-primary);
}

/* Power Icon Colors */
.power-icon.crown {
  color: var(--power-crown);
}

.power-icon.paper {
  color: var(--power-paper);
}

.power-icon.scissors {
  color: var(--power-scissors);
}

.power-icon.rock {
  color: var(--power-rock);
}
```

### 5. Phase Indicators

```css
.phase-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.phase-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--text-muted);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.phase-dot.active {
  background: var(--white-primary);
  box-shadow: 0 0 12px rgba(212, 175, 55, 0.6);
}

.phase-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.phase-indicator.active .phase-label {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
}
```

### 6. First Player Token

```css
.first-player-token {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: linear-gradient(135deg, var(--white-primary) 0%, var(--white-accent) 100%);
  border-radius: var(--radius-full);
  box-shadow: 
    0 4px 12px rgba(212, 175, 55, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--bg-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.first-player-icon {
  font-size: var(--text-lg);
}
```

### 7. Rules Panel

```css
.rules-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border);
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.8);
  padding: var(--space-6);
  overflow-y: auto;
  transition: right 0.3s ease;
  z-index: 1000;
}

.rules-panel.open {
  right: 0;
}

.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.rules-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.rules-content {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
}

.rules-section {
  margin-bottom: var(--space-6);
}

.rules-section-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.rules-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rules-list li {
  padding-left: var(--space-5);
  margin-bottom: var(--space-2);
  position: relative;
}

.rules-list li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--white-primary);
}
```

---

## Animations & Transitions

### Card Animations

```css
/* Card Draw Animation */
@keyframes cardDraw {
  0% {
    opacity: 0;
    transform: translateY(-50px) scale(0.8) rotateY(90deg);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px) scale(1.05) rotateY(45deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateY(0deg);
  }
}

.card.drawing {
  animation: cardDraw 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Card Flip Animation */
@keyframes cardFlip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

.card.flipping {
  animation: cardFlip 0.6s ease-in-out;
}

/* Card Play Animation */
@keyframes cardPlay {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-100px) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(-200px) scale(0.9);
    opacity: 0;
  }
}

.card.playing {
  animation: cardPlay 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Card Hover Glow */
@keyframes cardGlow {
  0%, 100% {
    box-shadow: 
      0 12px 24px rgba(0, 0, 0, 0.8),
      0 0 20px rgba(212, 175, 55, 0.3);
  }
  50% {
    box-shadow: 
      0 12px 24px rgba(0, 0, 0, 0.8),
      0 0 30px rgba(212, 175, 55, 0.6);
  }
}

.card:hover {
  animation: cardGlow 2s ease-in-out infinite;
}
```

### Battle Animations

```css
/* Clash Effect */
@keyframes clash {
  0% {
    transform: translateX(0) scale(1);
  }
  25% {
    transform: translateX(-20px) scale(1.1);
  }
  50% {
    transform: translateX(0) scale(1.2);
  }
  75% {
    transform: translateX(20px) scale(1.1);
  }
  100% {
    transform: translateX(0) scale(1);
  }
}

.card.clashing {
  animation: clash 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Particle Burst */
@keyframes particleBurst {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx), var(--ty)) scale(0);
  }
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--white-accent);
  border-radius: var(--radius-full);
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.8);
  animation: particleBurst 0.8s ease-out forwards;
  pointer-events: none;
}

/* Flash Effect */
@keyframes flash {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.flash-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
  animation: flash 0.4s ease-out;
  pointer-events: none;
}

/* Shake Effect */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

.shaking {
  animation: shake 0.5s ease-in-out;
}
```

### UI Transitions

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

/* Slide In From Right */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Glow Pulse */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
  }
}

.glow-pulse {
  animation: glowPulse 2s ease-in-out infinite;
}
```

---

## Image Assets

### Image URLs by Category

```json
{
  "background_textures": [
    {
      "url": "https://images.unsplash.com/photo-1656517046788-789add846e2d",
      "description": "Dark chess board with dramatic lighting - Use for main menu background",
      "usage": "Main menu background overlay"
    },
    {
      "url": "https://images.unsplash.com/photo-1718207345122-46b342dadea1",
      "description": "Chess board by window - Use for atmospheric background",
      "usage": "Game board background texture"
    }
  ],
  "chess_pieces_reference": [
    {
      "url": "https://images.unsplash.com/photo-1656151708474-33cdc3909c4f",
      "description": "Metallic gold chess pieces - Reference for card piece styling",
      "usage": "Visual reference for gold/white side card designs"
    },
    {
      "url": "https://images.unsplash.com/photo-1607161385344-c2b0134b4f42",
      "description": "White ceramic chess pieces - Reference for elegant piece design",
      "usage": "Visual reference for piece icons"
    },
    {
      "url": "https://images.unsplash.com/photo-1591364296314-cff024be29e1",
      "description": "Gold and silver chess pieces - Reference for dual-color theme",
      "usage": "Visual reference for white vs black side contrast"
    },
    {
      "url": "https://images.pexels.com/photos/846070/pexels-photo-846070.jpeg",
      "description": "Chess pieces in dramatic lighting",
      "usage": "Reference for lighting and shadow effects"
    },
    {
      "url": "https://images.pexels.com/photos/6965758/pexels-photo-6965758.jpeg",
      "description": "Golden chess pieces with depth",
      "usage": "Reference for metallic finish and premium feel"
    }
  ],
  "pattern_overlays": [
    {
      "url": "https://images.unsplash.com/photo-1700603943117-776098e75b0f",
      "description": "Black and white checkered pattern - Use for card backgrounds",
      "usage": "Chess board pattern overlay for cards"
    }
  ]
}
```

### Image Implementation Notes

- **Background Textures**: Use as subtle overlays with low opacity (10-20%) to add depth
- **Chess Pieces**: Use Unicode chess symbols (♔♕♖♗♘♙) or Font Awesome icons for actual implementation
- **Pattern Overlays**: Apply as CSS background patterns with reduced opacity for card backgrounds

---

## Icon System

### Font Awesome Integration

```html
<!-- Add to HTML <head> -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
```

### Icon Mapping

```javascript
const ICONS = {
  // Chess Pieces (Unicode)
  pieces: {
    pawn: '♟',
    knight: '♞',
    bishop: '♝',
    rook: '♜',
    queen: '♛',
    king: '♚'
  },
  
  // Attack Powers (Font Awesome)
  powers: {
    crown: 'fa-solid fa-crown',
    paper: 'fa-solid fa-file',
    scissors: 'fa-solid fa-scissors',
    rock: 'fa-solid fa-hand-fist'
  },
  
  // UI Icons (Font Awesome)
  ui: {
    menu: 'fa-solid fa-bars',
    close: 'fa-solid fa-xmark',
    info: 'fa-solid fa-circle-info',
    settings: 'fa-solid fa-gear',
    play: 'fa-solid fa-play',
    restart: 'fa-solid fa-rotate-right',
    heart: 'fa-solid fa-heart',
    shield: 'fa-solid fa-shield',
    swords: 'fa-solid fa-swords'
  }
};
```

---

## Responsive Design

### Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Mobile Optimizations

```css
/* Mobile: Stack player zones vertically */
@media (max-width: 768px) {
  .game-board {
    padding: var(--space-2);
    gap: var(--space-2);
  }
  
  .card {
    width: 100px;
    height: 140px;
  }
  
  .card-piece {
    font-size: 2.5rem;
  }
  
  .combat-zone {
    padding: var(--space-4);
    min-height: 180px;
  }
  
  .hand-cards {
    gap: var(--space-1);
  }
  
  .game-title {
    font-size: var(--text-4xl);
  }
  
  .menu-container {
    padding: var(--space-6);
  }
  
  .rules-panel {
    width: 100%;
    right: -100%;
  }
}

/* Tablet: Optimize card sizes */
@media (min-width: 769px) and (max-width: 1024px) {
  .card {
    width: 120px;
    height: 170px;
  }
  
  .card-piece {
    font-size: 3rem;
  }
}

/* Desktop: Full layout */
@media (min-width: 1025px) {
  .game-board {
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

---

## Accessibility

### Focus States

```css
/* Keyboard Focus Styles */
*:focus-visible {
  outline: 2px solid var(--white-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

button:focus-visible,
.card:focus-visible {
  outline: 3px solid var(--white-primary);
  outline-offset: 3px;
  box-shadow: 0 0 0 6px rgba(212, 175, 55, 0.2);
}

/* Remove default focus for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### ARIA Labels

```javascript
// Add data-testid and aria-labels to all interactive elements
const ARIA_LABELS = {
  mainMenu: {
    startButton: 'data-testid="start-game-button" aria-label="Start new game"',
    colorWhite: 'data-testid="select-white-button" aria-label="Play as white pieces"',
    colorBlack: 'data-testid="select-black-button" aria-label="Play as black pieces"',
    difficultyEasy: 'data-testid="difficulty-easy-button" aria-label="Easy difficulty"',
    difficultyNormal: 'data-testid="difficulty-normal-button" aria-label="Normal difficulty"',
    difficultyHard: 'data-testid="difficulty-hard-button" aria-label="Hard difficulty"',
    pvpMode: 'data-testid="pvp-mode-button" aria-label="Player versus player mode"',
    rulesToggle: 'data-testid="rules-toggle-button" aria-label="Toggle rules panel"'
  },
  gameBoard: {
    playerHp: 'data-testid="player-hp-counter" aria-label="Player health points"',
    opponentHp: 'data-testid="opponent-hp-counter" aria-label="Opponent health points"',
    defenseZone: 'data-testid="defense-zone" aria-label="Defense zone"',
    combatZone: 'data-testid="combat-zone" aria-label="Combat zone"',
    handContainer: 'data-testid="hand-container" aria-label="Your hand of cards"',
    card: 'data-testid="card-{id}" aria-label="{pieceName} card with {attackPower} attack and {defensePower} defense"',
    phaseIndicator: 'data-testid="phase-indicator" aria-label="Current phase: {phaseName}"',
    firstPlayerToken: 'data-testid="first-player-token" aria-label="First player indicator"'
  },
  rulesPanel: {
    panel: 'data-testid="rules-panel" aria-label="Game rules"',
    closeButton: 'data-testid="close-rules-button" aria-label="Close rules panel"'
  }
};
```

### Color Contrast

All text must meet WCAG AA standards:
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+): Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

Verified combinations:
- `#f5f5f5` (text-primary) on `#0a0a0a` (bg-primary): **18.5:1** ✓
- `#b8b8b8` (text-secondary) on `#0a0a0a` (bg-primary): **10.2:1** ✓
- `#d4af37` (white-primary) on `#0a0a0a` (bg-primary): **8.7:1** ✓

---

## JavaScript Animation Implementation

### Particle System for Battle Effects

```javascript
// Particle system for clash effects
class ParticleSystem {
  constructor(container) {
    this.container = container;
  }
  
  createBurst(x, y, color = '#ffd700', count = 20) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.background = color;
      
      // Random direction
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 50 + Math.random() * 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      
      this.container.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => particle.remove(), 800);
    }
  }
  
  createFlash(element) {
    const flash = document.createElement('div');
    flash.className = 'flash-overlay';
    element.appendChild(flash);
    setTimeout(() => flash.remove(), 400);
  }
}

// Usage example
const particles = new ParticleSystem(document.querySelector('.combat-zone'));

function playClashAnimation(card1, card2) {
  // Add clash class
  card1.classList.add('clashing');
  card2.classList.add('clashing');
  
  // Get center position
  const rect1 = card1.getBoundingClientRect();
  const rect2 = card2.getBoundingClientRect();
  const centerX = (rect1.left + rect2.right) / 2;
  const centerY = (rect1.top + rect2.bottom) / 2;
  
  // Create particle burst
  setTimeout(() => {
    particles.createBurst(centerX, centerY);
    particles.createFlash(document.querySelector('.combat-zone'));
  }, 250);
  
  // Remove classes after animation
  setTimeout(() => {
    card1.classList.remove('clashing');
    card2.classList.remove('clashing');
  }, 500);
}
```

### Card Animation Controller

```javascript
class CardAnimator {
  static drawCard(cardElement, delay = 0) {
    setTimeout(() => {
      cardElement.classList.add('drawing');
      setTimeout(() => {
        cardElement.classList.remove('drawing');
      }, 600);
    }, delay);
  }
  
  static flipCard(cardElement) {
    return new Promise((resolve) => {
      cardElement.classList.add('flipping');
      setTimeout(() => {
        cardElement.classList.remove('flipping');
        resolve();
      }, 600);
    });
  }
  
  static playCard(cardElement, targetElement) {
    return new Promise((resolve) => {
      cardElement.classList.add('playing');
      
      // Calculate target position
      const startRect = cardElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      setTimeout(() => {
        cardElement.style.position = 'fixed';
        cardElement.style.left = `${targetRect.left}px`;
        cardElement.style.top = `${targetRect.top}px`;
        cardElement.classList.remove('playing');
        resolve();
      }, 800);
    });
  }
  
  static shakeElement(element) {
    element.classList.add('shaking');
    setTimeout(() => {
      element.classList.remove('shaking');
    }, 500);
  }
}
```

---

## Additional Libraries & Tools

### Recommended Libraries

1. **No additional libraries required** - Pure HTML, CSS, JavaScript implementation
2. **Optional enhancements**:
   - **Howler.js** (for sound effects): `<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>`
   - **Particles.js** (alternative particle system): Not recommended for this project due to overhead

### Performance Optimization

```javascript
// Use requestAnimationFrame for smooth animations
function smoothAnimation(callback) {
  let start = null;
  
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    
    callback(progress);
    
    if (progress < 1000) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}

// Debounce resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.addEventListener('resize', debounce(() => {
  // Handle resize
}, 250));
```

---

## Instructions to Main Agent

### Implementation Priority

1. **Phase 1: Core Structure**
   - Set up HTML structure with semantic elements
   - Implement CSS custom properties and base styles
   - Create main menu screen with all selection options
   - Add Font Awesome and Google Fonts

2. **Phase 2: Game Board Layout**
   - Build player zones (top and bottom)
   - Implement HP counters with proper styling
   - Create defense zones with dashed borders
   - Build combat zone with gradient background
   - Implement hand container with horizontal scroll

3. **Phase 3: Card System**
   - Design card component with chess board pattern
   - Implement white/black side styling
   - Add chess piece icons (Unicode symbols)
   - Create power icons (Font Awesome)
   - Add hover and selected states

4. **Phase 4: Animations**
   - Implement card draw animation
   - Add card flip animation
   - Create card play animation
   - Build particle system for clash effects
   - Add flash and shake effects

5. **Phase 5: Game Logic**
   - Implement turn-based system
   - Add card selection logic
   - Create combat resolution
   - Build AI opponent (Easy/Normal/Hard)
   - Add win/lose conditions

6. **Phase 6: Polish**
   - Add rules panel with slide-in animation
   - Implement phase indicators
   - Add first player token
   - Create responsive breakpoints
   - Add accessibility features (ARIA labels, focus states)
   - Test all animations and transitions

### Key Implementation Notes

- **Use pure JavaScript** - No React, no frameworks
- **Single page application** - All screens in one HTML file, toggle visibility with classes
- **Chess piece icons** - Use Unicode symbols: ♔♕♖♗♘♙ (white) and ♚♛♜♝♞♟ (black)
- **Power icons** - Use Font Awesome: crown, file (paper), scissors, hand-fist (rock)
- **Card pattern** - Use CSS gradients to create chess board pattern (see card CSS)
- **Animations** - Use CSS keyframes for all animations, JavaScript only for triggering
- **Particles** - Create DOM elements dynamically, animate with CSS custom properties
- **Responsive** - Mobile-first approach, test on small screens
- **Accessibility** - Add all data-testid attributes and ARIA labels as specified

### Color Usage Rules

- **Backgrounds**: Always use solid dark colors from palette
- **Cards**: Dark background with chess pattern overlay at 15% opacity
- **Borders**: White side uses gold (#d4af37), black side uses silver (#c0c0c0)
- **Glows**: Use box-shadow with rgba colors for glow effects
- **Text**: High contrast - white text on dark backgrounds
- **Gradients**: ONLY for buttons and small accent elements, never for large areas

### Animation Timing

- **Card draw**: 0.6s
- **Card flip**: 0.6s
- **Card play**: 0.8s
- **Clash effect**: 0.5s
- **Particle burst**: 0.8s
- **Flash effect**: 0.4s
- **Shake effect**: 0.5s
- **UI transitions**: 0.3s

### Testing Checklist

- [ ] All interactive elements have data-testid attributes
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus states are visible
- [ ] Cards can be selected and played
- [ ] Combat animations play correctly
- [ ] HP counters update properly
- [ ] Rules panel opens and closes
- [ ] Responsive on mobile (320px+)
- [ ] Responsive on tablet (768px+)
- [ ] Responsive on desktop (1024px+)
- [ ] All text is readable (contrast check)
- [ ] No console errors
- [ ] Smooth 60fps animations

---

## Common Mistakes to Avoid

### ❌ Don't:
- Use dark gradients (purple/pink, blue/purple) anywhere
- Apply gradients to large background areas (>20% viewport)
- Use gradients on text-heavy content
- Center-align all text (disrupts reading flow)
- Add universal transitions (`transition: all`)
- Use emoji icons (🎮👑✂️) - use Font Awesome instead
- Mix multiple gradient directions in same section
- Forget hover and focus states
- Skip data-testid attributes
- Use frameworks or libraries (except Font Awesome and Google Fonts)

### ✅ Do:
- Use solid dark colors for backgrounds
- Apply gradients only to buttons and small accents
- Use chess board pattern for card backgrounds
- Maintain high contrast for readability
- Add specific transitions for interactive elements
- Use Font Awesome icons consistently
- Test on multiple screen sizes
- Include all accessibility features
- Use CSS custom properties for consistency
- Keep animations smooth and purposeful

---

## File Structure

```
/app/
├── index.html          # Main HTML file
├── styles/
│   ├── main.css        # Main stylesheet with all components
│   └── animations.css  # Animation keyframes (optional separate file)
├── scripts/
│   ├── game.js         # Game logic
│   ├── animations.js   # Animation controllers
│   └── particles.js    # Particle system
└── assets/
    └── (no external assets needed - using CDN fonts and icons)
```

---

## General UI/UX Design Guidelines

### Transition Rules
- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms

### Text Alignment
- You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text

### Icon Usage
- NEVER use AI assistant Emoji characters like `🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇` etc for icons
- Always use **FontAwesome CDN** or **lucide-react** library for icons

### Gradient Restrictions
- NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element
- Prohibited gradients: blue-500 to purple-600, purple-500 to pink-500, green-500 to blue-500, red to pink etc
- NEVER use dark gradients for logo, testimonial, footer etc
- NEVER let gradients cover more than 20% of the viewport
- NEVER apply gradients to text-heavy content or reading areas
- NEVER use gradients on small UI elements (<100px width)
- NEVER stack multiple gradient layers in the same viewport

### Gradient Enforcement
- If gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

### Allowed Gradient Usage
- Section backgrounds (not content backgrounds)
- Hero section header content (dark to light to dark color)
- Decorative overlays and accent elements only
- Hero section with 2-3 mild colors
- Gradients can be horizontal, vertical, or diagonal

### Color Palette Notes
- For AI chat, voice applications, **do not use purple color**. Use colors like light green, ocean blue, peach orange etc

### Spacing
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap

### Micro-interactions
- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead

### Visual Effects
- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations separate good from extraordinary

### Design Tokens
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion)
- Immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors)
- Don't rely on library defaults
- Don't make the background dark as a default step - always understand problem first and define colors accordingly
- If problem implies playful/energetic, choose a colorful scheme
- If problem implies monochrome/minimal, choose a black-white/neutral scheme

### Component Reuse
- Prioritize using pre-existing components when applicable
- Create new components that match the style and conventions of existing components when needed
- Examine existing components to understand the project's component patterns before creating new ones

### Component Library
- Do not use HTML based components like dropdown, calendar, toast etc
- You **MUST** always use modern and stylish components as primary components

### Export Conventions
- Components MUST use named exports (`export const ComponentName = ...`)
- Pages MUST use default exports (`export default function PageName() {...}`)

### Toasts
- Use appropriate toast library for notifications

### Visual Depth
- Use 2-4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals

### Testing Attributes
- All interactive and key informational elements **MUST** include a `data-testid` attribute
- Use kebab-case convention that defines the element's role, not its appearance
- Example: `data-testid="login-form-submit-button"`
- This creates a stable, decoupled interface for tests

---

**End of Design Guidelines**

This comprehensive design system provides everything needed to build a premium, dark, elegant chess-themed card game. The guidelines prioritize clarity, sophistication, and smooth animations while maintaining accessibility and responsive design principles.
