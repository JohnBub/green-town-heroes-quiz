// ===== GAME STATE =====
let draggedCard = null;
let placedCards = {
    1: null,
    2: null,
    3: null
};

// Correct answer: Bluetooth (10m) < Wi-Fi (50m) < 4G/5G (5000m)
const correctOrder = ['bluetooth', 'wifi', 'mobile'];

// ===== DOM ELEMENTS =====
const techCards = document.querySelectorAll('.tech-card');
const dropZones = document.querySelectorAll('.drop-zone');
const checkBtn = document.getElementById('checkBtn');
const feedback = document.getElementById('feedback');
const successModal = document.getElementById('successModal');
const restartBtn = document.getElementById('restartBtn');

// ===== DRAG AND DROP HANDLERS =====

// Initialize drag events for tech cards
techCards.forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
});

// Initialize drop events for drop zones
dropZones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('drop', handleDrop);
});

function handleDragStart(e) {
    draggedCard = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);

    // Add slight delay for better visual feedback
    setTimeout(() => {
        this.style.opacity = '0.5';
    }, 0);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    this.style.opacity = '1';

    // Remove drag-over styling from all zones
    dropZones.forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Allows drop
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    // Only remove if we're actually leaving the drop zone
    if (e.target === this) {
        this.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops redirect
    }

    this.classList.remove('drag-over');

    if (draggedCard) {
        const position = parseInt(this.dataset.position);
        const tech = draggedCard.dataset.tech;

        // Remove card from previous position if it exists
        Object.keys(placedCards).forEach(key => {
            if (placedCards[key] === tech) {
                placedCards[key] = null;
                // Return card to original container if replacing
                const existingCard = this.querySelector('.tech-card');
                if (existingCard && existingCard !== draggedCard) {
                    document.getElementById('techCards').appendChild(existingCard);
                }
            }
        });

        // If zone already has a card, return it to the tech cards area
        const existingCard = this.querySelector('.tech-card');
        if (existingCard && existingCard !== draggedCard) {
            document.getElementById('techCards').appendChild(existingCard);
        }

        // Place the dragged card in this zone
        this.appendChild(draggedCard);
        placedCards[position] = tech;

        // Play drop sound effect (visual feedback with animation)
        draggedCard.style.animation = 'none';
        setTimeout(() => {
            draggedCard.style.animation = '';
        }, 10);

        // Check if all zones are filled
        updateCheckButton();

        // Clear feedback when rearranging
        feedback.textContent = '';
        feedback.className = 'feedback';
    }

    return false;
}

// ===== GAME LOGIC =====

function updateCheckButton() {
    const allFilled = Object.values(placedCards).every(card => card !== null);
    checkBtn.disabled = !allFilled;
}

function checkAnswer() {
    // Build answer array from placed cards
    const answer = [
        placedCards[1],
        placedCards[2],
        placedCards[3]
    ];

    // Check if answer matches correct order
    const isCorrect = JSON.stringify(answer) === JSON.stringify(correctOrder);

    if (isCorrect) {
        showSuccess();
    } else {
        showError();
    }
}

function showSuccess() {
    // Show immediate success feedback
    feedback.textContent = '✅ Parfait ! Tu as tout bon ! 🎉';
    feedback.className = 'feedback correct';

    // Disable check button
    checkBtn.disabled = true;

    // Add celebration animation to cards
    document.querySelectorAll('.drop-zone .tech-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'celebrationBounce 0.6s ease-out';
        }, index * 100);
    });

    // Show success modal after short delay
    setTimeout(() => {
        successModal.classList.add('show');
        // Add confetti effect
        createConfetti();
    }, 1000);
}

function showError() {
    feedback.textContent = '❌ Pas tout à fait ! Réfléchis à la distance de chaque technologie. 🤔';
    feedback.className = 'feedback incorrect';

    // Shake animation for incorrect answer
    document.querySelectorAll('.drop-zone .tech-card').forEach(card => {
        card.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    });
}

// Add shake animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// ===== CONFETTI EFFECT =====
function createConfetti() {
    const colors = ['#00f2ff', '#39ff14', '#ff006e', '#ff9500'];
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

        // Animate confetti falling
        const duration = 2000 + Math.random() * 2000;
        const rotation = Math.random() * 720 - 360;

        confetti.animate([
            {
                transform: 'translateY(0) rotate(0deg)',
                opacity: 0.8
            },
            {
                transform: `translateY(100vh) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, duration);
    }
}

// ===== RESTART GAME =====
function restartGame() {
    // Close modal
    successModal.classList.remove('show');

    // Clear placed cards
    placedCards = {
        1: null,
        2: null,
        3: null
    };

    // Return all cards to tech cards container
    document.querySelectorAll('.drop-zone .tech-card').forEach(card => {
        document.getElementById('techCards').appendChild(card);
    });

    // Reset feedback
    feedback.textContent = '';
    feedback.className = 'feedback';

    // Disable check button
    checkBtn.disabled = true;

    // Reset animations
    document.querySelectorAll('.tech-card').forEach(card => {
        card.style.animation = '';
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== EVENT LISTENERS =====
checkBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', restartGame);

// ===== TOUCH SUPPORT FOR MOBILE =====
let touchCard = null;
let touchZone = null;

techCards.forEach(card => {
    card.addEventListener('touchstart', handleTouchStart, { passive: false });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd, { passive: false });
});

function handleTouchStart(e) {
    e.preventDefault();
    touchCard = this;
    this.classList.add('dragging');

    // Visual feedback
    this.style.opacity = '0.7';
    this.style.transform = 'scale(1.05)';
}

function handleTouchMove(e) {
    e.preventDefault();

    if (!touchCard) return;

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    // Remove previous highlight
    dropZones.forEach(zone => zone.classList.remove('drag-over'));

    // Check if touch is over a drop zone
    const zone = element?.closest('.drop-zone');
    if (zone) {
        zone.classList.add('drag-over');
        touchZone = zone;
    } else {
        touchZone = null;
    }
}

function handleTouchEnd(e) {
    e.preventDefault();

    if (!touchCard) return;

    this.classList.remove('dragging');
    this.style.opacity = '1';
    this.style.transform = '';

    // Drop card in zone if over one
    if (touchZone) {
        const position = parseInt(touchZone.dataset.position);
        const tech = touchCard.dataset.tech;

        // Remove card from previous position
        Object.keys(placedCards).forEach(key => {
            if (placedCards[key] === tech) {
                placedCards[key] = null;
            }
        });

        // If zone has a card, return it
        const existingCard = touchZone.querySelector('.tech-card');
        if (existingCard && existingCard !== touchCard) {
            document.getElementById('techCards').appendChild(existingCard);
        }

        // Place card
        touchZone.appendChild(touchCard);
        placedCards[position] = tech;

        updateCheckButton();

        // Clear feedback
        feedback.textContent = '';
        feedback.className = 'feedback';
    }

    // Clean up
    dropZones.forEach(zone => zone.classList.remove('drag-over'));
    touchCard = null;
    touchZone = null;
}

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        restartGame();
    }
});

// ===== INITIAL STATE =====
console.log('🎮 Jeu de Portée des Technologies chargé !');
console.log('📱 Ordre correct:', correctOrder);
