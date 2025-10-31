# Pli & Mat — Development Plan (HTML, CSS, JS)

## 1) Executive Summary
Pli & Mat is a premium, chess-themed card battle game built in pure HTML, CSS, and JavaScript (no frameworks). Players battle using cards representing chess pieces with a Rock–Paper–Scissors (RPS) system and transformed powers for defenders. Modes include: PvE (Easy/Normal/Hard AI) and local PvP with “simultaneous reveal” resolved in a turn-based UX. The first release will deliver a polished, dark/elegant chess aesthetic, a card slider for hands, visible attack/defense powers on every card, clear combat resolution UI, and original clash animations with particles and piece-like movements.

## 2) Objectives
- Deliver a fully playable, front-end–only game adhering to the provided rules.
- Provide an elegant, dark chess-themed UI with gold/silver accents and premium card visuals.
- Implement modes: Solo vs AI (3 difficulties) and Local PvP (hidden selection + reveal).
- Ensure clarity: show both attack and defense powers on cards and indicate attackable defenders.
- Include an always-accessible rules panel (visible on home and during matches).
- Create distinctive battle animations (slide/flip + clash + particles + chess-piece motion).
- Keep the codebase organized: one HTML, one CSS, one JS file; accessible and responsive.

## 3) UI/UX Design Guidelines (summarized from design_guidelines.md)
- Theme (per guidelines):
  - Backgrounds: deep blacks (var(--bg-primary/secondary/tertiary)) with subtle chess textures.
  - White side accents: Gold — var(--white-primary #d4af37), var(--white-accent #ffd700).
  - Black side accents: Silver — var(--black-primary #c0c0c0).
  - Text: var(--text-primary #f5f5f5) with high contrast; borders var(--border #333).
- Typography:
  - Headings: Playfair Display; Body/UI: Inter; Stats: Space Grotesk.
- Components & Layout:
  - Main menu card with options: color, difficulty, PvP toggle; Start button; Rules button.
  - Game board with: Opponent zone (HP, defense slots), Combat zone (center), Player zone (HP, defense slots, hand slider), First-Player token, Phase indicator.
  - Hand slider: horizontal scroll with arrow controls and drag-to-scroll.
  - Rules panel: slide-in fixed side panel, readable during menu and gameplay.
- Cards:
  - Premium card with chess-board pattern overlay; large piece icon; visible Attack and Defense powers (icons: crown/paper/scissors/rock); side-tinted glow (gold/silver);
  - Selected/hover states with glow; disabled state when not playable.
- Animations:
  - Card draw/flip/play; combat clash with particles; slight chess-like motion (e.g., knight arc, rook straight thrust) during reveal.
  - Strictly avoid transition: all; specify properties only; gradients limited to buttons/accents (<20% viewport).
- Accessibility & Testability:
  - All interactive elements include data-testid and aria-label; strong focus-visible states.
  - Sufficient color contrast (WCAG AA).

## 4) Implementation Steps

Phase 1 — Structure HTML & CSS (Base)
- Create file scaffold: index.html, styles/main.css, scripts/game.js (pure front-end).
- Add Google Fonts, Font Awesome; define CSS variables/tokens from design_guidelines.md.
- Build main menu:
  - Title, color selection (White/Black), difficulty (Easy/Normal/Hard), PvP toggle, Start button.
  - Rules button toggles slide-in rules panel. Rules content included in-page.
- Build game board skeleton:
  - Opponent zone (HP, defense zone 3 slots), Combat zone (two play slots + phase indicator + first player token), Player zone (HP, defense zone 3 slots, hand slider with prev/next arrows).
- Add responsive layout and scrollbar styling for the hand.

Phase 2 — Card System & Game Logic
- Data model:
  - Card: { id, side: 'white'|'black', type: 'pawn'|'knight'|'bishop'|'rook'|'queen', n?: 1..8 for pawns }
  - Zones per player: hand[], defense[] (max 3), discard[], hp (start 12), isFirstPlayer (boolean)
  - Game state: phase enum, selections, winnerChoice, loserChoice, mode (PvE/PvP), difficulty, firstPlayerToken holder
- RPS mapping (Attack – from hand):
  - queen → crown (beats all)
  - rook → paper, bishop → scissors, knight → rock
  - pawns: lose to all non-pawns; between pawns higher number wins
- Defense transforms (only for defenders):
  - queen → crown; rook → rock; bishop → scissors; knight → paper
  - pawns: 8 & 3 → rock; 7 & 4 → scissors; 6 & 5 → paper; 2 & 1 → crown
- Phase flow implementation:
  1) combat_select: both select from hand (PvE: AI picks silently; PvP: P1 selects hidden, lock; then P2 selects; reveal simultaneously)
  2) reveal_and_resolve: resolve attack cards with RPS (tie → first player token wins)
  3) winner_choice: winner chooses HP (-1 to opponent) or attack a specific defender (UI shows only valid targets)
  4) loser_choice: only if HP chosen — loser either accepts (-1 HP, card to discard) or sacrifices a defender (defender to discard, played card returns to hand)
  5) resolution: winner’s winning card becomes a defender (if >3, must replace one; replaced goes back to hand); losing card handling per rule; pass first player token; check win conditions (HP 0 or empty hand)
- Hand slider & selection rules; zone movement (hand↔defense↔discard) updates and UI refresh.

Phase 3 — AI & Modes
- Modes: PvE (Easy/Normal/Hard), PvP (local, pass-and-play with hidden selection & reveal).
- AI strategies (carte blanche):
  - Easy: Random valid card; if winner, 50/50 HP vs defender; random valid defender target.
  - Normal: Greedy heuristics – choose card that maximizes win chance vs likely player ranges (favor saving queen/knight for counters), pick HP unless can safely kill strong defender; prefer targeting defenders that weaken RPS coverage.
  - Hard: One-turn lookahead with heuristic scoring:
    - Value strong defense composition; preserve crown options; avoid feeding bad trades; simulate option A/B outcomes (HP vs defender attack) and choose higher utility; prefer attacks that force bad sacrifices.
- PvP UX: sequential selection with concealment overlay (device handoff), then simultaneous reveal animation.

Phase 4 — Animations & Polish
- Implement CSS keyframes for: draw, flip, play, clash, shake, flash, particle bursts (per guidelines).
- Add chess-piece motion variants in JavaScript during reveal (e.g., rook linear slide, knight small L-jump arc, bishop diagonal skid, queen short teleport pop).
- Micro-interactions: hover/active/focus-visible for all controls; glows for active phases; token pulse.
- Performance: requestAnimationFrame control, debounced resize handling, remove transient DOM particles.
- Final polish: responsive tuning, accessible labels, error/empty states, helpful tooltips for powers.

## 5) Technical Details
- File structure (standalone):
  - index.html — main container, menu, rules, game board; includes data-testid attributes.
  - styles/main.css — tokens, layout, components, animations (following gradient restrictions, specific transitions, no transition: all).
  - scripts/game.js — state machine, rendering, event handlers, AI.
- State machine (phases): 'menu' → 'combat_select' → 'reveal_and_resolve' → 'winner_choice' → 'loser_choice' (conditional) → 'resolution' → 'check_end' → 'swap_first' → 'combat_select'.
- Win conditions: HP ≤ 0 or hand size = 0. Draw if both out of cards with equal HP.
- First Player Token: random at start, alternates each round; used only for main combat ties (NOT for defender attacks; defender wins ties).
- Attackable defender validity: compute defender’s transformed power; only show defenders that can be beaten by the winner’s attack card.
- Rendering strategy: DOM-driven render functions per zone; minimal reflow; CSS classes for states (selected, disabled, clashing, etc.).
- Accessibility & Testability: data-testid for all buttons, inputs, cards, counters, indicators; aria-labels per element; keyboard operability (Enter/Space to activate focused item).
- Assets: No external images required; Unicode chess symbols + Font Awesome icons. Google Fonts (Playfair Display, Inter, Space Grotesk).

## 6) Next Actions
1) Implement Phase 1 scaffold:
   - Create HTML structure (menu, rules panel, board, zones) with data-testid and ARIA.
   - Add CSS tokens and base components per design_guidelines.md.
   - Wire basic menu interactions (color, difficulty, PvP) and transition to game board.
2) Implement Phase 2 logic:
   - Build deck creation for both sides; render hand/defense; selection + reveal flow; RPS engine; zone transitions; HP updates; token passing; end checks.
3) Implement Phase 3 AI & PvP:
   - Add Easy/Normal/Hard AI strategies; PvP hidden-selection UX with simultaneous reveal.
4) Implement Phase 4 polish:
   - Add all animations/particles; chess-piece movement variants; responsive fine-tuning; accessibility pass.

## 7) Success Criteria
- Functional:
  - Full rules implemented (RPS mapping, defender transforms, winner/loser choices, max 3 defenders, defender tie advantage, token alternation, victory/defeat conditions).
  - PvE (3 difficulties) and PvP work end-to-end.
  - Only beatable defenders are attackable; UI prevents invalid actions.
- UX/UI:
  - Premium dark chess aesthetic following tokens/colors/typography; clear card powers (attack + defense) visible.
  - Smooth, original battle animations (slide/flip/clash + particles + subtle chess-like motion).
  - Rules accessible on home and during match; responsive across mobile/tablet/desktop.
- Quality:
  - Accessible (focus, ARIA, contrast); all interactives have data-testid.
  - No console errors; performant animations (60fps typical on modern devices).
  - Simple, well-organized code in one HTML, one CSS, one JS file.
