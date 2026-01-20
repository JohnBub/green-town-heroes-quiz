// ===== GAME DATA =====
const gameData = {
    level1: {
        components: [
            { id: 'antenna', icon: '📡', name: 'Antenne-relais', match: 'antenna-func' },
            { id: 'server', icon: '🖥️', name: 'Serveur', match: 'server-func' },
            { id: 'cable', icon: '🌊', name: 'Câble sous-marin', match: 'cable-func' }
        ],
        functions: [
            { id: 'antenna-func', text: 'Reçoit et transmet les ondes entre ton téléphone et le réseau' },
            { id: 'server-func', text: 'Gros ordinateur qui stocke et distribue les données' },
            { id: 'cable-func', text: 'Transporte les informations entre les continents sous l\'océan' }
        ]
    },
    level2: {
        components: [
            { id: 'antenna', icon: '📡', name: 'Antenne-relais', match: 'antenna-func' },
            { id: 'server', icon: '🖥️', name: 'Serveur', match: 'server-func' },
            { id: 'cable', icon: '🌊', name: 'Câble sous-marin', match: 'cable-func' },
            { id: 'router', icon: '🔀', name: 'Routeur', match: 'router-func' },
            { id: 'modem', icon: '📦', name: 'Modem/Box Internet', match: 'modem-func' },
            { id: 'datacenter', icon: '🏢', name: 'Data center', match: 'datacenter-func' }
        ],
        functions: [
            { id: 'antenna-func', text: 'Reçoit et transmet les ondes entre ton téléphone et le réseau' },
            { id: 'server-func', text: 'Gros ordinateur qui stocke et distribue les données' },
            { id: 'cable-func', text: 'Transporte les informations entre les continents sous l\'océan' },
            { id: 'router-func', text: 'Dirige les données vers la bonne destination, comme un aiguilleur' },
            { id: 'modem-func', text: 'Connecte ta maison au réseau Internet de ton opérateur' },
            { id: 'datacenter-func', text: 'Bâtiment rempli de serveurs qui stockent des millions de données' }
        ]
    }
};

// Hints for each component
const hints = {
    'antenna': '📡 L\'antenne-relais capte les signaux de ton téléphone portable !',
    'server': '🖥️ Le serveur est comme un ordinateur géant qui stocke les sites web et les données !',
    'cable': '🌊 Les câbles sous-marins transportent Internet d\'un continent à l\'autre !',
    'router': '🔀 Le routeur décide quel chemin prendre pour envoyer tes données !',
    'modem': '📦 La box Internet est le pont entre ta maison et le réseau de ton fournisseur !',
    'datacenter': '🏢 Les data centers sont des bâtiments avec des milliers de serveurs !'
};

// ===== GAME STATE =====
let currentLevel = 1;
let selectedComponent = null;
let matches = new Map(); // component ID -> function ID
let errors = 0;
let level1Errors = 0;

// ===== DOM ELEMENTS =====
const componentsList = document.getElementById('componentsList');
const functionsList = document.getElementById('functionsList');
const checkBtn = document.getElementById('checkBtn');
const hintBtn = document.getElementById('hintBtn');
const feedback = document.getElementById('feedback');
const levelBadge = document.getElementById('levelBadge');
const errorCounter = document.getElementById('errorCounter');
const levelCompleteModal = document.getElementById('levelCompleteModal');
const finalScoreModal = document.getElementById('finalScoreModal');
const hintModal = document.getElementById('hintModal');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const restartBtn = document.getElementById('restartBtn');
const closeHintBtn = document.getElementById('closeHintBtn');
const connectionCanvas = document.getElementById('connectionCanvas');

// ===== INITIALIZATION =====
function initGame() {
    loadLevel(currentLevel);
}

function loadLevel(level) {
    const data = level === 1 ? gameData.level1 : gameData.level2;

    // Clear previous content
    componentsList.innerHTML = '';
    functionsList.innerHTML = '';
    matches.clear();
    selectedComponent = null;
    feedback.textContent = '';
    feedback.className = 'feedback';

    // Update UI
    levelBadge.textContent = `Niveau ${level}/2`;
    errorCounter.textContent = `Erreurs : ${errors}`;

    // Render components
    data.components.forEach(component => {
        const card = createComponentCard(component);
        componentsList.appendChild(card);
    });

    // Shuffle and render functions
    const shuffledFunctions = shuffleArray([...data.functions]);
    shuffledFunctions.forEach(func => {
        const card = createFunctionCard(func);
        functionsList.appendChild(card);
    });

    // Clear connections
    if (connectionCanvas) {
        connectionCanvas.innerHTML = '';
    }
}

function createComponentCard(component) {
    const card = document.createElement('div');
    card.className = 'item-card component-card';
    card.dataset.id = component.id;
    card.dataset.match = component.match;
    card.innerHTML = `
        <span class="item-icon">${component.icon}</span>
        <div class="item-text">${component.name}</div>
    `;
    card.addEventListener('click', () => selectComponent(card));
    return card;
}

function createFunctionCard(func) {
    const card = document.createElement('div');
    card.className = 'item-card function-card';
    card.dataset.id = func.id;
    card.innerHTML = `
        <div class="item-description">${func.text}</div>
    `;
    card.addEventListener('click', () => selectFunction(card));
    return card;
}

// ===== SELECTION LOGIC =====
function selectComponent(card) {
    if (card.classList.contains('matched')) return;

    // Deselect previous
    document.querySelectorAll('.component-card').forEach(c => c.classList.remove('selected'));

    // Select current
    card.classList.add('selected');
    selectedComponent = card;

    // Clear feedback
    feedback.textContent = '';
    feedback.className = 'feedback';
}

function selectFunction(card) {
    if (card.classList.contains('matched')) return;
    if (!selectedComponent) {
        showFeedback('Choisis d\'abord un composant à gauche ! 👈', 'info');
        return;
    }

    const componentId = selectedComponent.dataset.id;
    const functionId = card.dataset.id;
    const expectedMatch = selectedComponent.dataset.match;

    // Check if match is correct
    if (functionId === expectedMatch) {
        handleCorrectMatch(selectedComponent, card);
    } else {
        handleIncorrectMatch(selectedComponent, card);
    }
}

function handleCorrectMatch(componentCard, functionCard) {
    // Mark as matched
    componentCard.classList.remove('selected');
    componentCard.classList.add('matched');
    functionCard.classList.add('matched');

    // Store match
    matches.set(componentCard.dataset.id, functionCard.dataset.id);

    // Show success feedback
    showFeedback('✅ Parfait ! Belle association !', 'success');

    // Animate data packet
    animateDataPacket(componentCard, functionCard);

    // Draw connection line
    drawConnection(componentCard, functionCard);

    // Clear selection
    selectedComponent = null;

    // Check if level complete
    const data = currentLevel === 1 ? gameData.level1 : gameData.level2;
    if (matches.size === data.components.length) {
        setTimeout(() => {
            if (currentLevel === 1) {
                level1Errors = errors;
                showLevelComplete();
            } else {
                showFinalScore();
            }
        }, 1000);
    }
}

function handleIncorrectMatch(componentCard, functionCard) {
    errors++;
    errorCounter.textContent = `Erreurs : ${errors}`;

    // Shake animation
    componentCard.classList.add('error-shake');
    functionCard.classList.add('error-shake');

    setTimeout(() => {
        componentCard.classList.remove('error-shake');
        functionCard.classList.remove('error-shake');
    }, 500);

    // Show error feedback
    showFeedback('❌ Pas tout à fait ! Réessaie ! 💪', 'error');

    // Deselect
    componentCard.classList.remove('selected');
    selectedComponent = null;
}

// ===== DATA PACKET ANIMATION =====
function animateDataPacket(fromCard, toCard) {
    const packet = document.createElement('div');
    packet.className = 'data-packet';
    packet.textContent = '📦';
    document.body.appendChild(packet);

    const fromRect = fromCard.getBoundingClientRect();
    const toRect = toCard.getBoundingClientRect();

    const startX = fromRect.right;
    const startY = fromRect.top + fromRect.height / 2;
    const endX = toRect.left;
    const endY = toRect.top + toRect.height / 2;

    packet.style.left = startX + 'px';
    packet.style.top = startY + 'px';

    // Animate packet movement
    const animation = packet.animate([
        {
            left: startX + 'px',
            top: startY + 'px',
            opacity: 1
        },
        {
            left: (startX + endX) / 2 + 'px',
            top: Math.min(startY, endY) - 50 + 'px',
            opacity: 1
        },
        {
            left: endX + 'px',
            top: endY + 'px',
            opacity: 0
        }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
    });

    animation.onfinish = () => {
        packet.remove();
    };
}

// ===== CONNECTION LINES =====
function drawConnection(componentCard, functionCard) {
    if (!connectionCanvas) return;

    const boardRect = document.querySelector('.game-board').getBoundingClientRect();
    const fromRect = componentCard.getBoundingClientRect();
    const toRect = functionCard.getBoundingClientRect();

    const startX = fromRect.right - boardRect.left;
    const startY = fromRect.top + fromRect.height / 2 - boardRect.top;
    const endX = toRect.left - boardRect.left;
    const endY = toRect.top + toRect.height / 2 - boardRect.top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
    line.setAttribute('class', 'connection-line');
    line.setAttribute('stroke', getConnectionColor(componentCard.dataset.id));
    line.setAttribute('stroke-width', '4');

    connectionCanvas.appendChild(line);
}

function getConnectionColor(componentId) {
    const colors = {
        'antenna': '#FF6B6B',
        'server': '#4ECDC4',
        'cable': '#45B7D1',
        'router': '#FFA07A',
        'modem': '#98D8C8',
        'datacenter': '#F7DC6F'
    };
    return colors[componentId] || '#2196F3';
}

// ===== FEEDBACK =====
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

// ===== HINT SYSTEM =====
hintBtn.addEventListener('click', () => {
    if (selectedComponent) {
        const componentId = selectedComponent.dataset.id;
        const hintText = hints[componentId] || 'Réfléchis à ce que fait ce composant !';
        document.getElementById('hintText').textContent = hintText;
        hintModal.classList.add('show');
    } else {
        showFeedback('Sélectionne d\'abord un composant pour obtenir un indice ! 💡', 'info');
    }
});

closeHintBtn.addEventListener('click', () => {
    hintModal.classList.remove('show');
});

// ===== CHECK BUTTON =====
checkBtn.addEventListener('click', () => {
    const data = currentLevel === 1 ? gameData.level1 : gameData.level2;
    const totalMatches = data.components.length;
    const madeMatches = matches.size;

    if (madeMatches === 0) {
        showFeedback('Crée au moins une association pour vérifier ! 🔗', 'info');
    } else if (madeMatches < totalMatches) {
        showFeedback(`Tu as ${madeMatches}/${totalMatches} associations. Continue ! 💪`, 'info');
    } else {
        showFeedback('✅ Toutes les associations sont complètes !', 'success');
    }
});

// ===== LEVEL COMPLETE =====
function showLevelComplete() {
    document.getElementById('level1Errors').textContent = level1Errors;
    levelCompleteModal.classList.add('show');
}

nextLevelBtn.addEventListener('click', () => {
    levelCompleteModal.classList.remove('show');
    currentLevel = 2;
    loadLevel(2);
});

// ===== FINAL SCORE =====
function showFinalScore() {
    const totalErrors = errors;
    document.getElementById('totalErrors').textContent = totalErrors;

    // Calculate stars
    let stars = 3;
    let message = '';

    if (totalErrors === 0) {
        stars = 3;
        message = '🌟 Parfait ! Tu es un expert du réseau ! 🌟';
    } else if (totalErrors <= 2) {
        stars = 2;
        message = '👏 Excellent travail ! Tu maîtrises bien le sujet ! 👏';
    } else {
        stars = 1;
        message = '👍 Bien joué ! Continue à t\'entraîner ! 👍';
    }

    // Display stars
    const starsContainer = document.getElementById('finalStars');
    starsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('span');
        star.className = i < stars ? 'star filled' : 'star empty';
        star.textContent = '⭐';
        starsContainer.appendChild(star);
    }

    document.getElementById('scoreMessage').textContent = message;
    finalScoreModal.classList.add('show');

    // Confetti for perfect score
    if (totalErrors === 0) {
        createConfetti();
    }
}

// ===== CONFETTI =====
function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.opacity = '0.8';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';

        document.body.appendChild(confetti);

        const duration = 2000 + Math.random() * 2000;
        const rotation = Math.random() * 720 - 360;

        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
            { transform: `translateY(100vh) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => confetti.remove(), duration);
    }
}

// ===== RESTART =====
restartBtn.addEventListener('click', () => {
    finalScoreModal.classList.remove('show');
    currentLevel = 1;
    errors = 0;
    level1Errors = 0;
    loadLevel(1);
});

// ===== UTILITY FUNCTIONS =====
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (hintModal.classList.contains('show')) {
            hintModal.classList.remove('show');
        }
    }
});

// ===== START GAME =====
console.log('🌐 Jeu des Composants du Réseau chargé !');
initGame();
