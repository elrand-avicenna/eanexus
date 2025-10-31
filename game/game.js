// ===============================================
// PLI & MAT - GAME LOGIC
// Chess Card Battle Game
// ===============================================

// Game State
const gameState = {
  mode: 'menu', // 'menu' | 'game'
  gameMode: 'pve', // 'pve' | 'pvp'
  difficulty: 'normal', // 'easy' | 'normal' | 'hard'
  playerColor: 'white', // 'white' | 'black'
  currentPhase: 'combat_select', // 'combat_select' | 'reveal' | 'winner_choice' | 'loser_choice' | 'resolution'
  firstPlayerToken: 'player', // 'player' | 'opponent'
  turnCount: 0,
  
  player: {
    hp: 12,
    hand: [],
    defense: [],
    discard: [],
    selectedCard: null
  },
  
  opponent: {
    hp: 12,
    hand: [],
    defense: [],
    discard: [],
    selectedCard: null
  },
  
  combat: {
    winner: null, // 'player' | 'opponent'
    winnerChoice: null, // 'hp' | 'defender'
    loserChoice: null, // 'accept' | 'sacrifice'
    targetDefender: null
  }
};

// Card Types
const CARD_TYPES = {
  PAWN: 'pawn',
  KNIGHT: 'knight',
  BISHOP: 'bishop',
  ROOK: 'rook',
  QUEEN: 'queen'
};

// RPS Powers
const POWERS = {
  CROWN: 'crown',
  PAPER: 'paper',
  SCISSORS: 'scissors',
  ROCK: 'rock'
};

// Power Icons
const POWER_ICONS = {
  crown: 'fa-crown',
  paper: 'fa-file',
  scissors: 'fa-scissors',
  rock: 'fa-hand-fist'
};

// Chess Piece Unicode
const PIECE_SYMBOLS = {
  white: {
    pawn: '♟',
    knight: '♞',
    bishop: '♝',
    rook: '♜',
    queen: '♛'
  },
  black: {
    pawn: '♟',
    knight: '♞',
    bishop: '♝',
    rook: '♜',
    queen: '♛'
  }
};

// ===============================================
// CARD POWER SYSTEM
// ===============================================

function getAttackPower(card) {
  switch (card.type) {
    case CARD_TYPES.QUEEN:
      return POWERS.CROWN;
    case CARD_TYPES.ROOK:
      return POWERS.PAPER;
    case CARD_TYPES.BISHOP:
      return POWERS.SCISSORS;
    case CARD_TYPES.KNIGHT:
      return POWERS.ROCK;
    case CARD_TYPES.PAWN:
      return `pawn${card.number}`;
    default:
      return null;
  }
}

function getDefensePower(card) {
  switch (card.type) {
    case CARD_TYPES.QUEEN:
      return POWERS.CROWN;
    case CARD_TYPES.ROOK:
      return POWERS.ROCK; // Transformation!
    case CARD_TYPES.BISHOP:
      return POWERS.SCISSORS;
    case CARD_TYPES.KNIGHT:
      return POWERS.PAPER; // Transformation!
    case CARD_TYPES.PAWN:
      if (card.number === 8 || card.number === 3) return POWERS.ROCK;
      if (card.number === 7 || card.number === 4) return POWERS.SCISSORS;
      if (card.number === 6 || card.number === 5) return POWERS.PAPER;
      if (card.number === 2 || card.number === 1) return POWERS.CROWN;
      return null;
    default:
      return null;
  }
}

function resolveCombat(power1, power2) {
  // Crown beats everything
  if (power1 === POWERS.CROWN && power2 !== POWERS.CROWN) return 1;
  if (power2 === POWERS.CROWN && power1 !== POWERS.CROWN) return -1;
  if (power1 === POWERS.CROWN && power2 === POWERS.CROWN) return 0;
  
  // RPS resolution
  if (power1 === POWERS.PAPER && power2 === POWERS.ROCK) return 1;
  if (power1 === POWERS.ROCK && power2 === POWERS.SCISSORS) return 1;
  if (power1 === POWERS.SCISSORS && power2 === POWERS.PAPER) return 1;
  
  if (power2 === POWERS.PAPER && power1 === POWERS.ROCK) return -1;
  if (power2 === POWERS.ROCK && power1 === POWERS.SCISSORS) return -1;
  if (power2 === POWERS.SCISSORS && power1 === POWERS.PAPER) return -1;
  
  // Pawn vs Pawn
  if (typeof power1 === 'string' && power1.startsWith('pawn') && 
      typeof power2 === 'string' && power2.startsWith('pawn')) {
    const num1 = parseInt(power1.replace('pawn', ''));
    const num2 = parseInt(power2.replace('pawn', ''));
    if (num1 > num2) return 1;
    if (num2 > num1) return -1;
    return 0;
  }
  
  // Non-pawn vs Pawn (non-pawn wins)
  if (typeof power1 !== 'string' || !power1.startsWith('pawn')) {
    if (typeof power2 === 'string' && power2.startsWith('pawn')) return 1;
  }
  if (typeof power2 !== 'string' || !power2.startsWith('pawn')) {
    if (typeof power1 === 'string' && power1.startsWith('pawn')) return -1;
  }
  
  return 0; // Tie
}

function canBeatDefender(attackCard, defenderCard) {
  const attackPower = getAttackPower(attackCard);
  const defensePower = getDefensePower(defenderCard);
  return resolveCombat(attackPower, defensePower) > 0;
}

// ===============================================
// DECK CREATION
// ===============================================

function createDeck(color) {
  const deck = [];
  let id = 0;
  
  // Pawns 1-8
  for (let i = 1; i <= 8; i++) {
    deck.push({
      id: `${color}-pawn-${i}`,
      side: color,
      type: CARD_TYPES.PAWN,
      number: i
    });
  }
  
  // Knights x2
  for (let i = 0; i < 2; i++) {
    deck.push({
      id: `${color}-knight-${i}`,
      side: color,
      type: CARD_TYPES.KNIGHT
    });
  }
  
  // Bishops x2
  for (let i = 0; i < 2; i++) {
    deck.push({
      id: `${color}-bishop-${i}`,
      side: color,
      type: CARD_TYPES.BISHOP
    });
  }
  
  // Rooks x2
  for (let i = 0; i < 2; i++) {
    deck.push({
      id: `${color}-rook-${i}`,
      side: color,
      type: CARD_TYPES.ROOK
    });
  }
  
  // Queen x1
  deck.push({
    id: `${color}-queen`,
    side: color,
    type: CARD_TYPES.QUEEN
  });
  
  return deck;
}

// ===============================================
// RENDERING FUNCTIONS
// ===============================================

function renderCard(card, location = 'hand') {
  const div = document.createElement('div');
  div.className = `card ${card.side}-side`;
  div.setAttribute('data-testid', `card-${card.id}`);
  div.setAttribute('data-card-id', card.id);
  
  const typeName = card.type === CARD_TYPES.PAWN ? `Pion ${card.number}` : 
                   card.type.charAt(0).toUpperCase() + card.type.slice(1);
  
  const pieceSymbol = PIECE_SYMBOLS[card.side][card.type];
  
  const attackPower = getAttackPower(card);
  const defensePower = getDefensePower(card);
  
  const attackIcon = typeof attackPower === 'string' && attackPower.startsWith('pawn') ? 
                     'fa-ban' : POWER_ICONS[attackPower];
  const defenseIcon = POWER_ICONS[defensePower];
  
  const attackClass = typeof attackPower === 'string' && attackPower.startsWith('pawn') ? 
                      'rock' : attackPower;
  const defenseClass = defensePower;
  
  div.innerHTML = `
    <div class="card-header">
      <span class="card-name">${typeName}</span>
      ${card.number ? `<span class="card-number">#${card.number}</span>` : ''}
    </div>
    <div class="card-piece">${pieceSymbol}</div>
    <div class="card-footer">
      <div class="card-power">
        <span class="power-label">ATK</span>
        <i class="power-icon ${attackClass} fa-solid ${attackIcon}"></i>
      </div>
      <div class="card-power">
        <span class="power-label">DEF</span>
        <i class="power-icon ${defenseClass} fa-solid ${defenseIcon}"></i>
      </div>
    </div>
  `;
  
  // Add long press handler for preview (works on desktop and mobile)
  let pressTimer = null;
  let isPressing = false;
  
  // Mouse events (desktop)
  div.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Left click only
      isPressing = true;
      pressTimer = setTimeout(() => {
        if (isPressing) {
          showCardPreview(card);
        }
      }, 500); // 500ms long press
    }
  });
  
  div.addEventListener('mouseup', () => {
    isPressing = false;
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  });
  
  div.addEventListener('mouseleave', () => {
    isPressing = false;
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  });
  
  // Touch events (mobile)
  div.addEventListener('touchstart', (e) => {
    isPressing = true;
    pressTimer = setTimeout(() => {
      if (isPressing) {
        e.preventDefault(); // Prevent default touch behavior
        showCardPreview(card);
      }
    }, 500); // 500ms long press
  });
  
  div.addEventListener('touchend', () => {
    isPressing = false;
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  });
  
  div.addEventListener('touchmove', () => {
    isPressing = false;
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  });
  
  return div;
}

function renderPlayerZone() {
  // Render player hand
  const handContainer = document.getElementById('player-hand');
  handContainer.innerHTML = '';
  
  gameState.player.hand.forEach((card, index) => {
    const cardEl = renderCard(card);
    cardEl.classList.add('drawing');
    cardEl.style.animationDelay = `${index * 0.1}s`;
    
    if (gameState.currentPhase === 'combat_select' && !gameState.player.selectedCard) {
      cardEl.addEventListener('click', () => selectPlayerCard(card));
    } else {
      cardEl.classList.add('disabled');
    }
    
    if (gameState.player.selectedCard && gameState.player.selectedCard.id === card.id) {
      cardEl.classList.add('selected');
    }
    
    handContainer.appendChild(cardEl);
  });
  
  // Render player defense
  const defenseContainer = document.getElementById('player-defense');
  defenseContainer.innerHTML = '';
  
  gameState.player.defense.forEach(card => {
    const cardEl = renderCard(card, 'defense');
    
    if (gameState.currentPhase === 'loser_choice' && gameState.combat.winner === 'opponent') {
      if (gameState.combat.loserChoice === 'sacrifice' || gameState.combat.loserChoice === 'replace') {
        cardEl.addEventListener('click', () => selectDefenderToSacrifice(card));
        cardEl.style.cursor = 'pointer';
        cardEl.classList.add('attackable');
      }
    }
    
    defenseContainer.appendChild(cardEl);
  });
  
  // Update HP
  document.querySelector('#player-hp .hp-value').textContent = gameState.player.hp;
}

function renderOpponentZone() {
  // Render opponent defense
  const defenseContainer = document.getElementById('opponent-defense');
  defenseContainer.innerHTML = '';
  
  gameState.opponent.defense.forEach(card => {
    const cardEl = renderCard(card, 'defense');
    
    if (gameState.currentPhase === 'winner_choice' && 
        gameState.combat.winner === 'player' &&
        gameState.combat.winnerChoice === 'defender') {
      // Check if this defender can be beaten
      if (canBeatDefender(gameState.player.selectedCard, card)) {
        cardEl.classList.add('attackable');
        cardEl.addEventListener('click', () => attackDefender(card));
      } else {
        cardEl.classList.add('disabled');
      }
    }
    
    defenseContainer.appendChild(cardEl);
  });
  
  // Update HP
  document.querySelector('#opponent-hp .hp-value').textContent = gameState.opponent.hp;
}

function renderCombatZone() {
  const playerSlot = document.getElementById('player-combat-slot');
  const opponentSlot = document.getElementById('opponent-combat-slot');
  
  playerSlot.innerHTML = '';
  opponentSlot.innerHTML = '';
  
  if (gameState.player.selectedCard) {
    const cardEl = renderCard(gameState.player.selectedCard);
    playerSlot.appendChild(cardEl);
  }
  
  if (gameState.opponent.selectedCard) {
    const cardEl = renderCard(gameState.opponent.selectedCard);
    opponentSlot.appendChild(cardEl);
  }
  
  // Update first player token
  const tokenLabel = document.getElementById('first-player-label');
  tokenLabel.textContent = gameState.firstPlayerToken === 'player' ? 'Vous' : 'Adversaire';
}

function render() {
  renderPlayerZone();
  renderOpponentZone();
  renderCombatZone();
  updatePhaseLabel();
  updateCardCounters();
}

function updateCardCounters() {
  // Update player card count
  const playerCardCount = gameState.player.hand.length;
  document.querySelector('#player-cards .card-count').textContent = playerCardCount;
  
  // Update opponent card count
  const opponentCardCount = gameState.opponent.hand.length;
  document.querySelector('#opponent-cards .card-count').textContent = opponentCardCount;
}

function showCardPreview(card) {
  const panel = document.getElementById('card-preview-panel');
  const container = document.getElementById('preview-card-display');
  
  // Render card
  container.innerHTML = '';
  const cardEl = renderCard(card);
  container.appendChild(cardEl);
  
  // Show panel
  panel.classList.remove('hidden');
}

function hideCardPreview() {
  const panel = document.getElementById('card-preview-panel');
  panel.classList.add('hidden');
}

// ===============================================
// GAME PHASES
// ===============================================

function updatePhaseLabel() {
  const label = document.getElementById('phase-label');
  
  switch (gameState.currentPhase) {
    case 'combat_select':
      label.textContent = 'Phase de Sélection';
      break;
    case 'reveal':
      label.textContent = 'Révélation';
      break;
    case 'winner_choice':
      label.textContent = 'Choix du Gagnant';
      break;
    case 'loser_choice':
      label.textContent = 'Choix du Perdant';
      break;
    case 'resolution':
      label.textContent = 'Résolution';
      break;
  }
}

function selectPlayerCard(card) {
  // Show confirmation panel instead of directly selecting
  showCardConfirmation(card);
}

function showCardConfirmation(card) {
  const panel = document.getElementById('card-confirmation');
  const previewContainer = document.getElementById('card-preview-container');
  const attackIcon = document.getElementById('preview-attack-icon');
  const defenseIcon = document.getElementById('preview-defense-icon');
  
  // Render the card preview
  previewContainer.innerHTML = '';
  const cardEl = renderCard(card);
  previewContainer.appendChild(cardEl);
  
  // Get powers
  const attackPower = getAttackPower(card);
  const defensePower = getDefensePower(card);
  
  // Set attack icon
  const attackIconClass = typeof attackPower === 'string' && attackPower.startsWith('pawn') ? 
                          'fa-ban' : POWER_ICONS[attackPower];
  const attackPowerClass = typeof attackPower === 'string' && attackPower.startsWith('pawn') ? 
                           'rock' : attackPower;
  attackIcon.className = `info-icon power-icon ${attackPowerClass} fa-solid ${attackIconClass}`;
  
  // Set defense icon
  const defenseIconClass = POWER_ICONS[defensePower];
  defenseIcon.className = `info-icon power-icon ${defensePower} fa-solid ${defenseIconClass}`;
  
  // Show panel
  panel.classList.remove('hidden');
  
  // Store the card temporarily
  panel.dataset.pendingCardId = card.id;
}

function confirmCardSelection() {
  const panel = document.getElementById('card-confirmation');
  const cardId = panel.dataset.pendingCardId;
  
  // Find the card
  const card = gameState.player.hand.find(c => c.id === cardId);
  
  if (card) {
    gameState.player.selectedCard = card;
    render();
    
    // In PvE, opponent selects immediately
    if (gameState.gameMode === 'pve') {
      opponentSelectCard();
    }
  }
  
  // Hide panel
  panel.classList.add('hidden');
  delete panel.dataset.pendingCardId;
}

function cancelCardSelection() {
  const panel = document.getElementById('card-confirmation');
  panel.classList.add('hidden');
  delete panel.dataset.pendingCardId;
}

function opponentSelectCard() {
  const opponent = gameState.opponent;
  let selectedCard = null;
  
  if (gameState.gameMode === 'pve') {
    selectedCard = aiSelectCard(gameState.difficulty);
  }
  
  opponent.selectedCard = selectedCard;
  
  // Once both selected, reveal
  if (gameState.player.selectedCard && opponent.selectedCard) {
    setTimeout(() => revealCards(), 1000);
  }
}

function revealCards() {
  gameState.currentPhase = 'reveal';
  render();
  
  // Play clash animation
  const playerCard = document.querySelector('#player-combat-slot .card');
  const opponentCard = document.querySelector('#opponent-combat-slot .card');
  
  if (playerCard && opponentCard) {
    playerCard.classList.add('clashing');
    opponentCard.classList.add('clashing');
    
    // Create particle burst
    setTimeout(() => {
      createParticleBurst(document.querySelector('.combat-zone'));
      createFlash(document.querySelector('.combat-zone'));
    }, 250);
    
    setTimeout(() => {
      playerCard.classList.remove('clashing');
      opponentCard.classList.remove('clashing');
      resolveCombatPhase();
    }, 500);
  }
}

function resolveCombatPhase() {
  const playerPower = getAttackPower(gameState.player.selectedCard);
  const opponentPower = getAttackPower(gameState.opponent.selectedCard);
  
  const result = resolveCombat(playerPower, opponentPower);
  
  if (result > 0) {
    gameState.combat.winner = 'player';
  } else if (result < 0) {
    gameState.combat.winner = 'opponent';
  } else {
    // Tie - first player token decides
    gameState.combat.winner = gameState.firstPlayerToken;
  }
  
  gameState.currentPhase = 'winner_choice';
  showWinnerChoicePanel();
}

function showWinnerChoicePanel() {
  const panel = document.getElementById('action-panel');
  const title = document.getElementById('action-title');
  const description = document.getElementById('action-description');
  const buttons = document.getElementById('action-buttons');
  
  panel.classList.remove('hidden');
  
  if (gameState.combat.winner === 'player') {
    title.textContent = 'Vous avez gagné!';
    description.textContent = 'Choisissez votre action:';
    
    const hasAttackableDefenders = gameState.opponent.defense.some(d => 
      canBeatDefender(gameState.player.selectedCard, d)
    );
    
    buttons.innerHTML = `
      <button class="action-btn primary" data-testid="winner-choice-hp" onclick="winnerChooseHP()">
        <i class="fa-solid fa-heart"></i> Enlever 1 PV
      </button>
      <button class="action-btn" data-testid="winner-choice-defender" onclick="winnerChooseDefender()" 
              ${!hasAttackableDefenders ? 'disabled data-disabled-reason="Aucun défenseur battable"' : ''}>
        <i class="fa-solid fa-shield"></i> Attaquer un Défenseur
      </button>
    `;
  } else {
    // AI opponent makes choice
    panel.classList.add('hidden');
    setTimeout(() => aiWinnerChoice(), 1000);
  }
}

function winnerChooseHP() {
  gameState.combat.winnerChoice = 'hp';
  document.getElementById('action-panel').classList.add('hidden');
  
  gameState.currentPhase = 'loser_choice';
  showLoserChoicePanel();
}

function winnerChooseDefender() {
  gameState.combat.winnerChoice = 'defender';
  document.getElementById('action-panel').classList.add('hidden');
  
  // Show attackable defenders
  render();
}

function attackDefender(defenderCard) {
  gameState.combat.targetDefender = defenderCard;
  proceedToResolution();
}

function showLoserChoicePanel() {
  const panel = document.getElementById('action-panel');
  const title = document.getElementById('action-title');
  const description = document.getElementById('action-description');
  const buttons = document.getElementById('action-buttons');
  
  panel.classList.remove('hidden');
  
  if (gameState.combat.winner === 'opponent') {
    // Player is loser
    title.textContent = 'Vous avez perdu ce combat';
    description.textContent = 'Choisissez votre action:';
    
    const hasDefenders = gameState.player.defense.length > 0;
    
    buttons.innerHTML = `
      <button class="action-btn" data-testid="loser-choice-accept" onclick="loserAccept()" style="flex: 1;">
        <i class="fa-solid fa-heart-crack"></i> Accepter<br><small>1 carte / -1 PV</small>
      </button>
      <button class="action-btn" data-testid="loser-choice-replace" onclick="enableDefenderReplacement()" 
              ${!hasDefenders ? 'disabled data-disabled-reason="Aucun défenseur disponible"' : ''} style="flex: 1;">
        <i class="fa-solid fa-rotate"></i> Remplacer<br><small>1 carte / -1 PV</small>
      </button>
      <button class="action-btn primary" data-testid="loser-choice-sacrifice" onclick="enableDefenderSacrifice()" 
              ${!hasDefenders ? 'disabled data-disabled-reason="Aucun défenseur disponible"' : ''} style="flex: 1;">
        <i class="fa-solid fa-shield-halved"></i> Sacrifier<br><small>2 cartes / 0 PV</small>
      </button>
    `;
  } else {
    // AI opponent is loser
    panel.classList.add('hidden');
    setTimeout(() => aiLoserChoice(), 1000);
  }
}

function loserAccept() {
  gameState.combat.loserChoice = 'accept';
  document.getElementById('action-panel').classList.add('hidden');
  proceedToResolution();
}

function enableDefenderSacrifice() {
  document.getElementById('action-panel').classList.add('hidden');
  gameState.combat.loserChoice = 'sacrifice';
  render();
}

function enableDefenderReplacement() {
  document.getElementById('action-panel').classList.add('hidden');
  gameState.combat.loserChoice = 'replace';
  render();
}

function selectDefenderToSacrifice(card) {
  gameState.combat.targetDefender = card;
  proceedToResolution();
}

function proceedToResolution() {
  gameState.currentPhase = 'resolution';
  
  const winner = gameState.combat.winner;
  const loser = winner === 'player' ? 'opponent' : 'player';
  
  if (gameState.combat.winnerChoice === 'hp') {
    if (gameState.combat.loserChoice === 'accept') {
      // Loser loses 1 HP and their card
      gameState[loser].hp -= 1;
      gameState[loser].hand = gameState[loser].hand.filter(c => c.id !== gameState[loser].selectedCard.id);
      gameState[loser].discard.push(gameState[loser].selectedCard);
    } else if (gameState.combat.loserChoice === 'replace') {
      // Loser replaces defender with losing card, loses 1 HP
      const defender = gameState.combat.targetDefender;
      
      // Remove losing card from hand
      gameState[loser].hand = gameState[loser].hand.filter(c => c.id !== gameState[loser].selectedCard.id);
      
      // Remove old defender from defense
      gameState[loser].defense = gameState[loser].defense.filter(c => c.id !== defender.id);
      
      // Add losing card to defense
      gameState[loser].defense.push(gameState[loser].selectedCard);
      
      // Discard old defender
      gameState[loser].discard.push(defender);
      
      // Lose 1 HP
      gameState[loser].hp -= 1;
    } else if (gameState.combat.loserChoice === 'sacrifice') {
      // NEW RULE: Sacrifice defender AND losing card to save HP
      const defender = gameState.combat.targetDefender;
      
      // Remove losing card from hand
      gameState[loser].hand = gameState[loser].hand.filter(c => c.id !== gameState[loser].selectedCard.id);
      
      // Discard losing card
      gameState[loser].discard.push(gameState[loser].selectedCard);
      
      // Remove defender from defense
      gameState[loser].defense = gameState[loser].defense.filter(c => c.id !== defender.id);
      
      // Discard defender
      gameState[loser].discard.push(defender);
      
      // No HP lost (that's the benefit of sacrificing 2 cards)
    }
  } else if (gameState.combat.winnerChoice === 'defender') {
    // Attack defender
    const defender = gameState.combat.targetDefender;
    gameState[loser].defense = gameState[loser].defense.filter(c => c.id !== defender.id);
    gameState[loser].discard.push(defender);
    
    // Both cards discarded
    gameState[loser].hand = gameState[loser].hand.filter(c => c.id !== gameState[loser].selectedCard.id);
    gameState[loser].discard.push(gameState[loser].selectedCard);
  }
  
  // Winner's card becomes defender
  const winnerCard = gameState[winner].selectedCard;
  gameState[winner].hand = gameState[winner].hand.filter(c => c.id !== winnerCard.id);
  
  if (gameState[winner].defense.length >= 3) {
    // Must replace a defender - for now, just replace the first one
    const replaced = gameState[winner].defense.shift();
    gameState[winner].hand.push(replaced);
  }
  
  gameState[winner].defense.push(winnerCard);
  
  // Clear selections
  gameState.player.selectedCard = null;
  gameState.opponent.selectedCard = null;
  gameState.combat.winner = null;
  gameState.combat.winnerChoice = null;
  gameState.combat.loserChoice = null;
  gameState.combat.targetDefender = null;
  
  // Check win conditions
  if (checkWinCondition()) {
    return;
  }
  
  // Swap first player token
  gameState.firstPlayerToken = gameState.firstPlayerToken === 'player' ? 'opponent' : 'player';
  gameState.turnCount++;
  
  // Back to selection phase
  gameState.currentPhase = 'combat_select';
  render();
  
  // If AI goes first, select automatically
  if (gameState.gameMode === 'pve' && gameState.firstPlayerToken === 'opponent') {
    // AI will wait for player to select
  }
}

function checkWinCondition() {
  if (gameState.player.hp <= 0) {
    showGameOver('opponent');
    return true;
  }
  
  if (gameState.opponent.hp <= 0) {
    showGameOver('player');
    return true;
  }
  
  if (gameState.player.hand.length === 0) {
    showGameOver('opponent');
    return true;
  }
  
  if (gameState.opponent.hand.length === 0) {
    showGameOver('player');
    return true;
  }
  
  return false;
}

function showGameOver(winner) {
  const panel = document.getElementById('action-panel');
  const title = document.getElementById('action-title');
  const description = document.getElementById('action-description');
  const buttons = document.getElementById('action-buttons');
  
  panel.classList.remove('hidden');
  
  if (winner === 'player') {
    title.textContent = '🎉 Victoire!';
    description.textContent = 'Vous avez gagné la partie!';
  } else {
    title.textContent = '💔 Défaite';
    description.textContent = 'Vous avez perdu la partie.';
  }
  
  buttons.innerHTML = `
    <button class="action-btn primary" onclick="backToMenu()">
      <i class="fa-solid fa-home"></i> Menu Principal
    </button>
    <button class="action-btn" onclick="startGame()">
      <i class="fa-solid fa-rotate-right"></i> Rejouer
    </button>
  `;
}

// ===============================================
// AI LOGIC
// ===============================================

function aiSelectCard(difficulty) {
  const hand = gameState.opponent.hand;
  
  if (difficulty === 'easy') {
    // Random selection
    return hand[Math.floor(Math.random() * hand.length)];
  }
  
  if (difficulty === 'normal') {
    // Prefer stronger cards
    const ranked = [...hand].sort((a, b) => {
      const scoreA = getCardScore(a);
      const scoreB = getCardScore(b);
      return scoreB - scoreA;
    });
    
    // Pick from top 3
    const topCards = ranked.slice(0, Math.min(3, ranked.length));
    return topCards[Math.floor(Math.random() * topCards.length)];
  }
  
  if (difficulty === 'hard') {
    // Try to counter player's likely card
    return hand[Math.floor(Math.random() * hand.length)];
  }
  
  return hand[0];
}

function getCardScore(card) {
  switch (card.type) {
    case CARD_TYPES.QUEEN: return 10;
    case CARD_TYPES.ROOK: return 7;
    case CARD_TYPES.BISHOP: return 6;
    case CARD_TYPES.KNIGHT: return 5;
    case CARD_TYPES.PAWN: return card.number;
    default: return 0;
  }
}

function aiWinnerChoice() {
  const difficulty = gameState.difficulty;
  
  if (difficulty === 'easy') {
    // Random choice
    gameState.combat.winnerChoice = Math.random() > 0.5 ? 'hp' : 'defender';
  } else {
    // Prefer HP unless there's a valuable defender to kill
    const attackableDefenders = gameState.player.defense.filter(d => 
      canBeatDefender(gameState.opponent.selectedCard, d)
    );
    
    if (attackableDefenders.length > 0 && Math.random() > 0.3) {
      gameState.combat.winnerChoice = 'defender';
      // Pick highest value defender
      const sorted = [...attackableDefenders].sort((a, b) => getCardScore(b) - getCardScore(a));
      gameState.combat.targetDefender = sorted[0];
    } else {
      gameState.combat.winnerChoice = 'hp';
    }
  }
  
  if (gameState.combat.winnerChoice === 'hp') {
    gameState.currentPhase = 'loser_choice';
    showLoserChoicePanel();
  } else {
    proceedToResolution();
  }
}

function aiLoserChoice() {
  const difficulty = gameState.difficulty;
  
  if (gameState.opponent.defense.length === 0) {
    gameState.combat.loserChoice = 'accept';
  } else if (difficulty === 'easy') {
    // Random choice between 3 options
    const choices = ['accept', 'replace', 'sacrifice'];
    gameState.combat.loserChoice = choices[Math.floor(Math.random() * choices.length)];
  } else {
    // Smart choice based on situation
    const losingCard = gameState.opponent.selectedCard;
    const losingCardScore = getCardScore(losingCard);
    const hp = gameState.opponent.hp;
    const handSize = gameState.opponent.hand.length;
    
    // Evaluate defenders
    const defenderScores = gameState.opponent.defense.map(d => ({
      card: d,
      score: getCardScore(d)
    })).sort((a, b) => a.score - b.score);
    
    const weakestDefender = defenderScores[0];
    
    // Decision logic with new rule (sacrifice = 2 cards, 0 HP)
    if (hp <= 2 && handSize >= 3) {
      // Critical HP and enough cards - sacrifice 2 cards to save HP
      gameState.combat.loserChoice = 'sacrifice';
      gameState.combat.targetDefender = weakestDefender.card;
    } else if (losingCardScore > weakestDefender.score && hp > 6) {
      // Losing card is better than weakest defender and HP is comfortable
      // Replace: losing card goes to defense, -1 HP
      gameState.combat.loserChoice = 'replace';
      gameState.combat.targetDefender = weakestDefender.card;
    } else if (hp <= 5 && handSize >= 4) {
      // Moderate HP, good hand size - consider sacrificing
      gameState.combat.loserChoice = 'sacrifice';
      gameState.combat.targetDefender = weakestDefender.card;
    } else if (handSize <= 3) {
      // Low hand size - don't sacrifice 2 cards
      if (hp > 4) {
        gameState.combat.loserChoice = 'accept'; // Can afford HP loss
      } else if (losingCardScore > weakestDefender.score) {
        gameState.combat.loserChoice = 'replace'; // Improve defense
      } else {
        gameState.combat.loserChoice = 'accept';
      }
    } else {
      // Default: accept the loss
      gameState.combat.loserChoice = 'accept';
    }
  }
  
  if (gameState.combat.loserChoice === 'sacrifice' || gameState.combat.loserChoice === 'replace') {
    // Pick lowest value defender if not already chosen
    if (!gameState.combat.targetDefender) {
      const sorted = [...gameState.opponent.defense].sort((a, b) => getCardScore(a) - getCardScore(b));
      gameState.combat.targetDefender = sorted[0];
    }
  }
  
  proceedToResolution();
}

// ===============================================
// PARTICLE SYSTEM
// ===============================================

function createParticleBurst(container) {
  const rect = container.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const count = 20;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    
    const angle = (Math.PI * 2 * i) / count;
    const velocity = 50 + Math.random() * 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    
    container.appendChild(particle);
    
    setTimeout(() => particle.remove(), 800);
  }
}

function createFlash(container) {
  const flash = document.createElement('div');
  flash.className = 'flash-overlay';
  container.appendChild(flash);
  setTimeout(() => flash.remove(), 400);
}

// ===============================================
// GAME INITIALIZATION
// ===============================================

function startGame() {
  // Create decks
  const opponentColor = gameState.playerColor === 'white' ? 'black' : 'white';
  
  gameState.player.hand = createDeck(gameState.playerColor);
  gameState.player.defense = [];
  gameState.player.discard = [];
  gameState.player.hp = 12;
  gameState.player.selectedCard = null;
  
  gameState.opponent.hand = createDeck(opponentColor);
  gameState.opponent.defense = [];
  gameState.opponent.discard = [];
  gameState.opponent.hp = 12;
  gameState.opponent.selectedCard = null;
  
  // Random first player
  gameState.firstPlayerToken = Math.random() > 0.5 ? 'player' : 'opponent';
  gameState.turnCount = 0;
  
  gameState.currentPhase = 'combat_select';
  gameState.combat = {
    winner: null,
    winnerChoice: null,
    loserChoice: null,
    targetDefender: null
  };
  
  // Show game board
  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('game-board').classList.remove('hidden');
  
  render();
}

function backToMenu() {
  document.getElementById('game-board').classList.add('hidden');
  document.getElementById('action-panel').classList.add('hidden');
  document.getElementById('main-menu').classList.remove('hidden');
}

// ===============================================
// UI EVENT HANDLERS
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
  // Color selection
  document.querySelectorAll('[data-color]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gameState.playerColor = btn.dataset.color;
    });
  });
  
  // Difficulty selection
  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-difficulty]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gameState.difficulty = btn.dataset.difficulty;
    });
  });
  
  // Mode selection
  document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gameState.gameMode = btn.dataset.mode;
    });
  });
  
  // Start game
  document.getElementById('start-game-btn').addEventListener('click', startGame);
  
  // Back to menu
  document.getElementById('back-to-menu-btn').addEventListener('click', backToMenu);
  
  // Rules panel toggle
  const rulesPanel = document.getElementById('rules-panel');
  
  document.getElementById('rules-toggle-btn').addEventListener('click', () => {
    rulesPanel.classList.toggle('open');
  });
  
  document.getElementById('rules-toggle-game-btn').addEventListener('click', () => {
    rulesPanel.classList.toggle('open');
  });
  
  document.getElementById('close-rules-btn').addEventListener('click', () => {
    rulesPanel.classList.remove('open');
  });
  
  // Powers legend toggle
  const powersLegend = document.getElementById('powers-legend');
  
  document.getElementById('powers-legend-btn').addEventListener('click', () => {
    powersLegend.classList.toggle('hidden');
  });
  
  document.getElementById('close-legend-btn').addEventListener('click', () => {
    powersLegend.classList.add('hidden');
  });
  
  // Close legend when clicking outside
  powersLegend.addEventListener('click', (e) => {
    if (e.target === powersLegend) {
      powersLegend.classList.add('hidden');
    }
  });
  
  // Card preview handlers
  document.getElementById('preview-overlay').addEventListener('click', hideCardPreview);
  
  // Card confirmation handlers
  document.getElementById('confirm-card-btn').addEventListener('click', confirmCardSelection);
  document.getElementById('cancel-card-btn').addEventListener('click', cancelCardSelection);
  
  // Close confirmation on background click
  document.getElementById('card-confirmation').addEventListener('click', (e) => {
    if (e.target.id === 'card-confirmation') {
      cancelCardSelection();
    }
  });
  
  // Hand navigation
  document.getElementById('hand-prev-btn').addEventListener('click', () => {
    const container = document.getElementById('player-hand');
    container.scrollBy({ left: -200, behavior: 'smooth' });
  });
  
  document.getElementById('hand-next-btn').addEventListener('click', () => {
    const container = document.getElementById('player-hand');
    container.scrollBy({ left: 200, behavior: 'smooth' });
  });
});