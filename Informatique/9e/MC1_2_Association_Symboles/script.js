// ═══════════════════════════════════════════════════
// 🌐 Network Matching Game - Interactive Logic
// ═══════════════════════════════════════════════════

// Game State
const gameState = {
    selections: {
        1: null, // Column 1 (symbols)
        2: null, // Column 2 (descriptions)
        3: null  // Column 3 (examples)
    },
    connections: [],
    isChecking: false
};

// Correct Combinations
const correctMatches = {
    bluetooth: ['bluetooth', 'bluetooth', 'bluetooth'],
    wifi: ['wifi', 'wifi', 'wifi'],
    mobile: ['mobile', 'mobile', 'mobile']
};

// DOM Elements
const cards = document.querySelectorAll('.card');
const svg = document.querySelector('.connection-svg');
const checkBtn = document.getElementById('checkBtn');
const resetBtn = document.getElementById('resetBtn');
const feedback = document.getElementById('feedback');
const victoryModal = document.getElementById('victoryModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const confettiContainer = document.getElementById('confettiContainer');

// Initialize Game
function init() {
    shuffleCards();
    attachEventListeners();
    updateSVGSize();
    window.addEventListener('resize', debounce(updateSVGSize, 200));
}

// Shuffle Cards in Each Column
function shuffleCards() {
    const columns = document.querySelectorAll('.column');

    columns.forEach(column => {
        const cardsInColumn = Array.from(column.querySelectorAll('.card'));
        const shuffled = cardsInColumn.sort(() => Math.random() - 0.5);

        shuffled.forEach(card => column.appendChild(card));
    });
}

// Attach Event Listeners
function attachEventListeners() {
    cards.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });

    checkBtn.addEventListener('click', checkMatches);
    resetBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', () => {
        victoryModal.classList.remove('active');
        resetGame();
    });
}

// Handle Card Click
function handleCardClick(e) {
    if (gameState.isChecking) return;

    const card = e.currentTarget;
    const column = parseInt(card.dataset.col);

    // Clear previous selection in this column
    const previousSelection = gameState.selections[column];
    if (previousSelection) {
        previousSelection.classList.remove('selected');
    }

    // Toggle selection
    if (previousSelection === card) {
        gameState.selections[column] = null;
        card.classList.remove('selected');
    } else {
        gameState.selections[column] = card;
        card.classList.add('selected');
    }

    // Remove any previous feedback
    clearFeedback();

    // Draw connections
    drawConnections();
}

// Draw Connection Lines
function drawConnections() {
    // Clear existing lines
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    // Get selected cards
    const selected = gameState.selections;

    // If all three columns have selections, draw complete line
    if (selected[1] && selected[2] && selected[3]) {
        const id1 = selected[1].dataset.id;

        // Draw line from column 1 to column 2
        drawLine(selected[1], selected[2], id1);

        // Draw line from column 2 to column 3
        drawLine(selected[2], selected[3], id1);
    } else if (selected[1] && selected[2]) {
        // Draw partial line (1 to 2)
        const id1 = selected[1].dataset.id;
        drawLine(selected[1], selected[2], id1);
    }
}

// Draw Single Line Between Two Cards
function drawLine(card1, card2, connectionId) {
    const rect1 = card1.getBoundingClientRect();
    const rect2 = card2.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    const x1 = rect1.right - svgRect.left;
    const y1 = rect1.top + rect1.height / 2 - svgRect.top;
    const x2 = rect2.left - svgRect.left;
    const y2 = rect2.top + rect2.height / 2 - svgRect.top;

    // Create curved path
    const midX = (x1 + x2) / 2;
    const controlOffset = Math.abs(x2 - x1) * 0.3;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = `M ${x1} ${y1} Q ${midX} ${y1 - controlOffset}, ${x2} ${y2}`;

    path.setAttribute('d', pathData);
    path.classList.add('connection-line', connectionId);

    // Animate path drawing
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    path.style.animation = 'drawLine 0.6s ease forwards';

    svg.appendChild(path);
}

// Add CSS animation for line drawing
const style = document.createElement('style');
style.textContent = `
    @keyframes drawLine {
        to {
            stroke-dashoffset: 0;
        }
    }
`;
document.head.appendChild(style);

// Check Matches
function checkMatches() {
    const selected = gameState.selections;

    // Check if all columns have selections
    if (!selected[1] || !selected[2] || !selected[3]) {
        showFeedback('⚠️ Sélectionne une carte dans chaque colonne !', 'error');
        return;
    }

    gameState.isChecking = true;

    const id1 = selected[1].dataset.id;
    const id2 = selected[2].dataset.id;
    const id3 = selected[3].dataset.id;

    // Check if all three match
    const isCorrect = id1 === id2 && id2 === id3;

    if (isCorrect) {
        // Mark as correct
        selected[1].classList.add('correct');
        selected[2].classList.add('correct');
        selected[3].classList.add('correct');

        // Store this connection
        gameState.connections.push([selected[1], selected[2], selected[3]]);

        // Clear selections
        gameState.selections = { 1: null, 2: null, 3: null };

        showFeedback('✅ Parfait !', 'success');

        // Check if all matches are complete
        setTimeout(() => {
            if (gameState.connections.length === 3) {
                showVictory();
            } else {
                clearFeedback();
                gameState.isChecking = false;
            }
        }, 1500);
    } else {
        // Mark as incorrect
        selected[1].classList.add('incorrect');
        selected[2].classList.add('incorrect');
        selected[3].classList.add('incorrect');

        showFeedback('❌ Ce n\'est pas la bonne combinaison...', 'error');

        // Remove incorrect styling after animation
        setTimeout(() => {
            selected[1].classList.remove('incorrect', 'selected');
            selected[2].classList.remove('incorrect', 'selected');
            selected[3].classList.remove('incorrect', 'selected');

            // Clear selections and redraw
            gameState.selections = { 1: null, 2: null, 3: null };
            drawConnections();
            clearFeedback();
            gameState.isChecking = false;
        }, 1500);
    }
}

// Show Feedback
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

// Clear Feedback
function clearFeedback() {
    feedback.textContent = '';
    feedback.className = 'feedback';
}

// Reset Game
function resetGame() {
    // Clear all selections and states
    cards.forEach(card => {
        card.classList.remove('selected', 'correct', 'incorrect');
    });

    gameState.selections = { 1: null, 2: null, 3: null };
    gameState.connections = [];
    gameState.isChecking = false;

    // Clear connections
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    // Clear feedback
    clearFeedback();

    // Shuffle cards again
    shuffleCards();
}

// Show Victory Modal
function showVictory() {
    victoryModal.classList.add('active');
    createConfetti();
}

// Create Confetti Animation
function createConfetti() {
    // Clear existing confetti
    while (confettiContainer.firstChild) {
        confettiContainer.removeChild(confettiContainer.firstChild);
    }

    const colors = ['#00A6FB', '#00D9A3', '#9D4EDD', '#FF9E00', '#FF006E'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Random properties
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.animationDuration = `${2 + Math.random() * 2}s`;

        // Random shapes
        const shapes = ['circle', 'square'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        }

        confettiContainer.appendChild(confetti);
    }
}

// Update SVG Size on Window Resize
function updateSVGSize() {
    const container = document.querySelector('.game-container');
    const rect = container.getBoundingClientRect();

    svg.setAttribute('width', rect.width);
    svg.setAttribute('height', rect.height);

    // Redraw connections if any exist
    drawConnections();
}

// Debounce Utility
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

// Start Game on Load
document.addEventListener('DOMContentLoaded', init);
