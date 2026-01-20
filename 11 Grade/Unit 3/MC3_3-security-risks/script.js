// ═══════════════════════════════════════════════════
// 🔒 Security Risks Journey - Game Logic
// ═══════════════════════════════════════════════════

// Risk Data
const riskData = {
    'wifi': {
        icon: '⚠️',
        title: 'Bien vu ! WiFi non sécurisé',
        text: 'Quelqu\'un sur le même réseau WiFi peut intercepter les données si elles ne sont pas chiffrées.'
    },
    'box': {
        icon: '⚠️',
        title: 'Bien vu ! Box Internet',
        text: 'L\'opérateur Internet peut voir tout le trafic qui passe par sa box s\'il n\'est pas chiffré (HTTPS).'
    },
    'antenna-operator': {
        icon: '⚠️',
        title: 'Bien vu ! Antenne opérateur',
        text: 'Les communications mobiles peuvent être interceptées par des équipements spécialisés ou l\'opérateur lui-même.'
    },
    'server-local': {
        icon: '⚠️',
        title: 'Bien vu ! Serveur local',
        text: 'Les données stockées sur un serveur peuvent être piratées si la sécurité n\'est pas suffisante.'
    },
    'cable-submarine': {
        icon: '⚠️',
        title: 'Bien vu ! Câble sous-marin',
        text: 'Ces câbles peuvent être écoutés par des gouvernements ou des pirates avec des moyens techniques avancés.'
    },
    'server-foreign': {
        icon: '⚠️',
        title: 'Bien vu ! Serveur étranger',
        text: 'Les données stockées à l\'étranger sont soumises aux lois du pays, qui peuvent permettre la surveillance.'
    },
    'antenna-final': {
        icon: '⚠️',
        title: 'Bien vu ! Antenne finale',
        text: 'Juste avant d\'arriver au destinataire, les communications peuvent encore être interceptées.'
    }
};

const safeData = {
    'alice-phone': {
        icon: '❌',
        title: 'Pas vraiment',
        text: 'Ce point est généralement sûr si l\'appareil est bien protégé (mot de passe, chiffrement).'
    },
    'bob-phone': {
        icon: '❌',
        title: 'Pas vraiment',
        text: 'Ce point est généralement sûr si l\'appareil est bien protégé (mot de passe, chiffrement).'
    }
};

// Game State
const gameState = {
    foundRisks: new Set(),
    totalRisks: 7,
    hasShownModal: false
};

// DOM Elements
const points = document.querySelectorAll('.journey-point');
const scoreValue = document.getElementById('scoreValue');
const infoPanel = document.getElementById('infoPanel');
const infoIcon = document.getElementById('infoIcon');
const infoTitle = document.getElementById('infoTitle');
const infoText = document.getElementById('infoText');
const resetBtn = document.getElementById('resetBtn');
const victoryModal = document.getElementById('victoryModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const playAgainBtn = document.getElementById('playAgainBtn');
const connectionLines = document.querySelector('.connection-lines');

// Initialize Game
function init() {
    drawConnectionLines();
    attachEventListeners();
    updateScore();
    window.addEventListener('resize', debounce(drawConnectionLines, 200));
}

// Attach Event Listeners
function attachEventListeners() {
    points.forEach(point => {
        point.addEventListener('click', handlePointClick);
    });

    resetBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', () => {
        victoryModal.classList.remove('active');
        resetGame();
    });
}

// Handle Point Click
function handlePointClick(e) {
    const point = e.currentTarget;
    const pointId = point.dataset.id;
    const pointType = point.dataset.type;

    // Ignore neutral points
    if (pointType === 'neutral') {
        return;
    }

    if (pointType === 'risk') {
        // Check if already found
        if (gameState.foundRisks.has(pointId)) {
            // Already found - just show info again
            showInfo(riskData[pointId]);
            return;
        }

        // Mark as found
        gameState.foundRisks.add(pointId);
        point.classList.add('found');

        // Show checkmark feedback
        const feedback = point.querySelector('.point-feedback');
        feedback.textContent = '✅';

        // Show info
        showInfo(riskData[pointId]);

        // Update score
        updateScore();

        // Check victory
        if (gameState.foundRisks.size === gameState.totalRisks && !gameState.hasShownModal) {
            setTimeout(showVictory, 1000);
        }

    } else if (pointType === 'safe') {
        // Safe point clicked - shake and show info
        point.classList.add('clicked');

        const feedback = point.querySelector('.point-feedback');
        feedback.textContent = '❌';

        showInfo(safeData[pointId]);

        // Remove clicked class after animation
        setTimeout(() => {
            point.classList.remove('clicked');
        }, 600);
    }
}

// Show Info Panel
function showInfo(data) {
    infoIcon.textContent = data.icon;
    infoTitle.textContent = data.title;
    infoText.textContent = data.text;

    infoPanel.classList.add('active');

    // Auto-hide after 6 seconds
    setTimeout(() => {
        infoPanel.classList.remove('active');
    }, 6000);
}

// Update Score Display
function updateScore() {
    scoreValue.textContent = `${gameState.foundRisks.size} / ${gameState.totalRisks}`;
}

// Draw Connection Lines
function drawConnectionLines() {
    // Clear existing lines
    while (connectionLines.firstChild) {
        connectionLines.removeChild(connectionLines.firstChild);
    }

    const pointElements = Array.from(points);

    for (let i = 0; i < pointElements.length - 1; i++) {
        const point1 = pointElements[i];
        const point2 = pointElements[i + 1];

        drawLine(point1, point2);
    }
}

// Draw Single Line
function drawLine(element1, element2) {
    const svgRect = connectionLines.getBoundingClientRect();

    // Calculate centers of the icons
    const icon1 = element1.querySelector('.point-icon');
    const icon2 = element2.querySelector('.point-icon');

    if (!icon1 || !icon2) return;

    const iconRect1 = icon1.getBoundingClientRect();
    const iconRect2 = icon2.getBoundingClientRect();

    const x1 = iconRect1.left + iconRect1.width / 2 - svgRect.left;
    const y1 = iconRect1.top + iconRect1.height / 2 - svgRect.top;
    const x2 = iconRect2.left + iconRect2.width / 2 - svgRect.left;
    const y2 = iconRect2.top + iconRect2.height / 2 - svgRect.top;

    // Create line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.classList.add('connection-line');

    connectionLines.appendChild(line);
}

// Reset Game
function resetGame() {
    // Clear found risks
    gameState.foundRisks.clear();
    gameState.hasShownModal = false;

    // Remove all found and clicked classes
    points.forEach(point => {
        point.classList.remove('found', 'clicked');
        const feedback = point.querySelector('.point-feedback');
        if (feedback) {
            feedback.textContent = '';
        }
    });

    // Hide info panel
    infoPanel.classList.remove('active');

    // Update score
    updateScore();
}

// Show Victory Modal
function showVictory() {
    gameState.hasShownModal = true;

    const score = gameState.foundRisks.size;
    const percentage = Math.round((score / gameState.totalRisks) * 100);

    let title = '';
    let message = '';

    if (score === gameState.totalRisks) {
        title = '🎉 Parfait !';
        message = `Tu as identifié tous les ${gameState.totalRisks} risques de sécurité ! Excellent travail ! 🔒`;
    } else if (score >= 5) {
        title = '👍 Très bien !';
        message = `Tu as trouvé ${score} risques sur ${gameState.totalRisks}. C'est un bon score de ${percentage}% !`;
    } else if (score >= 3) {
        title = '🤔 Pas mal';
        message = `Tu as trouvé ${score} risques sur ${gameState.totalRisks} (${percentage}%). Continue à t'améliorer !`;
    } else {
        title = '💪 Essaie encore';
        message = `Tu as trouvé ${score} risques sur ${gameState.totalRisks}. Réessaie pour en trouver plus !`;
    }

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    victoryModal.classList.add('active');
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
