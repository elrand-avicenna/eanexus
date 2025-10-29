
// pages/center.js
import { app } from '../core/state.js';

export function renderCenterPage() {
  app.state.currentPage = 'center';
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) indicator.innerHTML = '';
  
  const npcs = app.data.npcs || [];
  
  document.getElementById('app').innerHTML = `
    <div class="center-page fade-in" data-testid="center-page">
      <!-- Hero Header -->
      <div class="center-hero">
        <div class="center-hero-overlay">
          <div class="center-hero-content">
            <div class="center-hero-logo">🏛️</div>
            <h1 class="center-hero-titre">NEXUS CENTER</h1>
            <p class="center-hero-description">Rencontrez les habitants du NEXUS</p>
          </div>
        </div>
      </div>

      <!-- NPCs Grid -->
      <div class="center-npcs-grid" data-testid="npcs-grid">
        ${npcs.map(npc => `
          <div class="npc-card" data-npc-id="${npc.id}" onclick="showNpcProfile('${npc.id}')" data-testid="npc-card-${npc.id}">
            <div class="npc-card-header" style="background: linear-gradient(135deg, ${npc.couleur} 0%, ${npc.couleur}dd 100%)">
              <div class="npc-avatar">${npc.avatar}</div>
              <div class="npc-niveau">Niv. ${npc.niveau}</div>
            </div>
            <div class="npc-card-body">
              <h3 class="npc-nom">${npc.nom}</h3>
              <p class="npc-titre">${npc.titre}</p>
              <p class="npc-specialite">🎯 ${npc.specialite}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Salle de Repos Button -->
      <div class="center-lounge-cta">
        <button class="lounge-btn" onclick="showLounge()" data-testid="lounge-btn">
          <span class="lounge-icon">🛋️</span>
          <span class="lounge-text">Salle de Repos</span>
          <span class="lounge-subtitle">Discutez avec les NPCs</span>
        </button>
      </div>
    </div>
  `;
}

export function showNpcProfile(npcId) {
  const npc = app.data.npcs.find(n => n.id === npcId);
  if (!npc) return;

  document.getElementById('app').innerHTML = `
    <div class="npc-profile fade-in" data-testid="npc-profile">
      <!-- Header -->
      <div class="npc-profile-header" style="background: linear-gradient(135deg, ${npc.couleur} 0%, ${npc.couleur}aa 100%)">
        <button class="back-btn" onclick="window.navigateTo('center')" data-testid="back-btn">
          ← Retour
        </button>
        <div class="npc-profile-avatar">${npc.avatar}</div>
        <h1 class="npc-profile-nom">${npc.nom}</h1>
        <p class="npc-profile-titre">${npc.titre}</p>
        <div class="npc-profile-niveau">Niveau ${npc.niveau}</div>
      </div>

      <!-- Content -->
      <div class="npc-profile-content">
        <div class="npc-profile-section">
          <h3 class="section-label">🎯 Spécialité</h3>
          <p class="section-text">${npc.specialite}</p>
        </div>

        <div class="npc-profile-section">
          <h3 class="section-label">📖 Biographie</h3>
          <p class="section-text">${npc.bio}</p>
        </div>

        <div class="npc-profile-section">
          <h3 class="section-label">💬 Message d'accueil</h3>
          <p class="section-text npc-greeting">"${npc.greeting}"</p>
        </div>

        <!-- Actions -->
        <div class="npc-profile-actions">
          <button class="npc-action-btn primary" onclick="startChat('${npc.id}')" data-testid="chat-btn">
            💬 Discuter
          </button>
          <button class="npc-action-btn secondary" onclick="startDuel('${npc.id}')" data-testid="duel-btn">
            ⚔️ Défier en duel
          </button>
        </div>
      </div>
    </div>
  `;
}

export function showLounge() {
  const npcs = app.data.npcs || [];
  
  document.getElementById('app').innerHTML = `
    <div class="lounge-page fade-in" data-testid="lounge-page">
      <!-- Header -->
      <div class="lounge-header">
        <button class="back-btn" onclick="window.navigateTo('center')" data-testid="back-btn-lounge">
          ← Retour au Center
        </button>
        <h1 class="lounge-titre">🛋️ Salle de Repos</h1>
        <p class="lounge-description">Choisissez un NPC pour discuter ou défier</p>
      </div>

      <!-- NPCs List -->
      <div class="lounge-npcs-list">
        ${npcs.map(npc => `
          <div class="lounge-npc-item" data-npc-id="${npc.id}" data-testid="lounge-npc-${npc.id}">
            <div class="lounge-npc-avatar" style="background: ${npc.couleur}">${npc.avatar}</div>
            <div class="lounge-npc-info">
              <h3 class="lounge-npc-nom">${npc.nom}</h3>
              <p class="lounge-npc-status">En ligne • ${npc.titre}</p>
            </div>
            <div class="lounge-npc-actions">
              <button class="icon-btn" onclick="startChat('${npc.id}')" title="Discuter" data-testid="chat-${npc.id}">💬</button>
              <button class="icon-btn" onclick="startDuel('${npc.id}')" title="Défier" data-testid="duel-${npc.id}">⚔️</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Chat System
export function startChat(npcId) {
  const npc = app.data.npcs.find(n => n.id === npcId);
  if (!npc) return;

  // Initialize chat state if not exists
  if (!app.state.chats) app.state.chats = {};
  if (!app.state.chats[npcId]) {
    app.state.chats[npcId] = [
      { sender: 'npc', text: npc.greeting, timestamp: Date.now() }
    ];
  }

  renderChat(npcId);
}

function renderChat(npcId) {
  const npc = app.data.npcs.find(n => n.id === npcId);
  const messages = app.state.chats[npcId] || [];

  document.getElementById('app').innerHTML = `
    <div class="chat-page fade-in" data-testid="chat-page">
      <!-- Header -->
      <div class="chat-header" style="background: linear-gradient(135deg, ${npc.couleur} 0%, ${npc.couleur}dd 100%)">
        <button class="back-btn" onclick="showLounge()" data-testid="back-from-chat">← Retour</button>
        <div class="chat-header-info">
          <div class="chat-avatar">${npc.avatar}</div>
          <div>
            <h2 class="chat-npc-nom">${npc.nom}</h2>
            <p class="chat-npc-status">En ligne</p>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="chat-messages" id="chatMessages" data-testid="chat-messages">
        ${messages.map(msg => `
          <div class="chat-message ${msg.sender}" data-testid="message-${msg.sender}">
            <div class="message-avatar">${msg.sender === 'npc' ? npc.avatar : '👤'}</div>
            <div class="message-bubble">
              <p class="message-text">${msg.text}</p>
              <span class="message-time">${formatTime(msg.timestamp)}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Input -->
      <div class="chat-input-container">
        <input 
          type="text" 
          class="chat-input" 
          id="chatInput" 
          placeholder="Écrivez votre message..."
          data-testid="chat-input"
        />
        <button class="send-btn" onclick="sendMessage('${npcId}')" data-testid="send-btn">
          📤
        </button>
      </div>
    </div>
  `;

  // Auto-scroll to bottom
  setTimeout(() => {
    const messagesDiv = document.getElementById('chatMessages');
    if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, 100);

  // Enter to send
  const input = document.getElementById('chatInput');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage(npcId);
    });
    input.focus();
  }
}

function sendMessage(npcId) {
  const input = document.getElementById('chatInput');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  
  // Add user message
  app.state.chats[npcId].push({
    sender: 'user',
    text: text,
    timestamp: Date.now()
  });

  // Generate NPC response
  setTimeout(() => {
    const npc = app.data.npcs.find(n => n.id === npcId);
    const responses = generateNpcResponse(npc, text);
    app.state.chats[npcId].push({
      sender: 'npc',
      text: responses,
      timestamp: Date.now()
    });
    renderChat(npcId);
  }, 800);

  input.value = '';
  renderChat(npcId);
}

function generateNpcResponse(npc, userMessage) {
  const responses = {
    'cipher': [
      "Intéressant... Mais avez-vous pensé à regarder entre les lignes?",
      "Voici une énigme pour vous : Je suis toujours devant vous mais invisible. Qui suis-je?",
      "La réponse que vous cherchez est cachée dans la question elle-même."
    ],
    'nova': [
      "J'adore cette idée! On devrait la prototyper tout de suite!",
      "Tu sais quoi? J'ai justement bossé sur un concept similaire hier soir.",
      "Attends, j'ai une meilleure idée... Et si on ajoutait de l'IA là-dedans?"
    ],
    'sage': [
      "Hmm, laissez-moi consulter les archives...",
      "Une question fascinante. L'histoire nous enseigne que...",
      "Dans les anciens textes du NEXUS, il est écrit que..."
    ],
    'pixel': [
      "GG! Mais tu peux faire mieux que ça!",
      "C'est tout? Moi je fais ça les yeux fermés!",
      "Pas mal! Mais mon high score est de 9999. Beat that!"
    ],
    'melody': [
      "Ça me donne envie de composer quelque chose...",
      "♪ Cette conversation a un rythme intéressant! ♪",
      "Attends, je vais te jouer un morceau qui correspond à ton énergie!"
    ],
    'glitch': [
      "01010100... Désolé, connexion instable. Que disais-tu?",
      "J'ai scanné ton message. Niveau de sécurité: acceptable.",
      "Intéressant. J'ai déjà piraté 3 systèmes pendant qu'on parlait."
    ],
    'aurora': [
      "Prends ton temps... La nature ne se presse jamais.",
      "Tout pousse à son propre rythme, comme toi.",
      "Regarde autour de toi. Les réponses sont dans la nature."
    ],
    'volt': [
      "Techniquement parlant, c'est faisable. Laisse-moi calculer...",
      "J'ai exactement l'outil qu'il faut pour ça!",
      "Hmm, on pourrait optimiser ça. Donne-moi 5 minutes."
    ],
    'echo': [
      "Les étoiles me murmurent quelque chose à ton sujet...",
      "Je vois... plusieurs futurs possibles. Choisis avec sagesse.",
      "Ton chemin est intéressant. Je vois des défis, mais aussi des victoires."
    ],
    'blaze': [
      "Tu as du cran! J'aime ça!",
      "Prêt pour un vrai défi? Ou tu préfères rester dans ta zone de confort?",
      "Pas mal! Mais je ne baisse jamais ma garde!"
    ]
  };

  const npcResponses = responses[npc.id] || ["Je vois...", "Intéressant.", "Dis-m'en plus."];
  return npcResponses[Math.floor(Math.random() * npcResponses.length)];
}

// Duel System
export function startDuel(npcId) {
  const npc = app.data.npcs.find(n => n.id === npcId);
  if (!npc) return;

  // Initialize duel state
  app.state.currentDuel = {
    npc: npc,
    playerHP: 100,
    npcHP: 100,
    turn: 'player',
    log: [`${npc.nom} vous défie! Le duel commence!`]
  };

  renderDuel();
}

function renderDuel() {
  const duel = app.state.currentDuel;
  const npc = duel.npc;

  document.getElementById('app').innerHTML = `
    <div class="duel-page fade-in" data-testid="duel-page">
      <!-- Header -->
      <div class="duel-header">
        <button class="back-btn" onclick="showLounge()" data-testid="back-from-duel">← Abandonner</button>
        <h1 class="duel-titre">⚔️ Duel contre ${npc.nom}</h1>
      </div>

      <!-- Battle Arena -->
      <div class="duel-arena">
        <!-- Player -->
        <div class="duel-fighter player">
          <div class="fighter-avatar">👤</div>
          <div class="fighter-info">
            <h3 class="fighter-name">Vous</h3>
            <div class="hp-bar">
              <div class="hp-fill" style="width: ${duel.playerHP}%; background: #2ecc71"></div>
            </div>
            <p class="hp-text">${duel.playerHP}/100 HP</p>
          </div>
        </div>

        <!-- VS -->
        <div class="duel-vs">VS</div>

        <!-- NPC -->
        <div class="duel-fighter npc">
          <div class="fighter-avatar" style="background: ${npc.couleur}">${npc.avatar}</div>
          <div class="fighter-info">
            <h3 class="fighter-name">${npc.nom}</h3>
            <div class="hp-bar">
              <div class="hp-fill" style="width: ${duel.npcHP}%; background: #e74c3c"></div>
            </div>
            <p class="hp-text">${duel.npcHP}/100 HP</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      ${duel.turn === 'player' ? `
        <div class="duel-actions" data-testid="duel-actions">
          <button class="duel-action-btn attack" onclick="duelAction('attack')" data-testid="attack-btn">
            ⚔️ Attaque (20-30 dmg)
          </button>
          <button class="duel-action-btn defend" onclick="duelAction('defend')" data-testid="defend-btn">
            🛡️ Défense (+20 HP)
          </button>
          <button class="duel-action-btn special" onclick="duelAction('special')" data-testid="special-btn">
            ✨ Spécial (40-50 dmg)
          </button>
        </div>
      ` : `
        <div class="duel-waiting">
          <p>Tour de ${npc.nom}...</p>
        </div>
      `}

      <!-- Battle Log -->
      <div class="duel-log" data-testid="duel-log">
        ${duel.log.map(entry => `<p class="log-entry">${entry}</p>`).join('')}
      </div>
    </div>
  `;
}

window.duelAction = function(action) {
  const duel = app.state.currentDuel;
  const npc = duel.npc;
  
  let damage = 0;
  let message = '';

  switch(action) {
    case 'attack':
      damage = Math.floor(Math.random() * 11) + 20; // 20-30
      duel.npcHP = Math.max(0, duel.npcHP - damage);
      message = `Vous attaquez ${npc.nom} et infligez ${damage} dégâts!`;
      break;
    case 'defend':
      duel.playerHP = Math.min(100, duel.playerHP + 20);
      message = `Vous vous défendez et récupérez 20 HP!`;
      break;
    case 'special':
      damage = Math.floor(Math.random() * 11) + 40; // 40-50
      duel.npcHP = Math.max(0, duel.npcHP - damage);
      message = `Vous utilisez votre attaque spéciale et infligez ${damage} dégâts!`;
      break;
  }

  duel.log.push(message);

  // Check if NPC defeated
  if (duel.npcHP <= 0) {
    duel.log.push(`🎉 Victoire! Vous avez vaincu ${npc.nom}!`);
    renderDuel();
    setTimeout(() => {
      alert(`Félicitations! Vous avez gagné contre ${npc.nom}!`);
      showLounge();
    }, 2000);
    return;
  }

  // NPC turn
  duel.turn = 'npc';
  renderDuel();

  setTimeout(() => {
    const npcDamage = Math.floor(Math.random() * 11) + 15 + npc.niveau; // 15-25 + niveau
    duel.playerHP = Math.max(0, duel.playerHP - npcDamage);
    duel.log.push(`${npc.nom} vous attaque et inflige ${npcDamage} dégâts!`);

    // Check if player defeated
    if (duel.playerHP <= 0) {
      duel.log.push(`💀 Défaite... ${npc.nom} vous a vaincu!`);
      renderDuel();
      setTimeout(() => {
        alert(`Vous avez été vaincu par ${npc.nom}. Réessayez!`);
        showLounge();
      }, 2000);
      return;
    }

    duel.turn = 'player';
    renderDuel();
  }, 1500);
};

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// Expose to window
window.showNpcProfile = showNpcProfile;
window.showLounge = showLounge;
window.startChat = startChat;
window.sendMessage = sendMessage;
window.startDuel = startDuel;
