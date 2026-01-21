// Puzzle data with encoded messages and hints
const puzzles = [
    {
        encoded: "VHFUHW",
        decoded: "SECRET",
        shift: 3,
        hints: [
            { text: "Le decalage est un nombre impair", points: 5 },
            { text: "Le decalage est inferieur a 5", points: 5 },
            { text: "Le decalage est +3 (chiffre de Cesar classique)", points: 5 },
            { text: "La premiere lettre decodee est S", points: 5 }
        ]
    },
    {
        encoded: "HFROH",
        decoded: "ECOLE",
        shift: 3,
        hints: [
            { text: "C'est un lieu ou tu vas chaque jour", points: 5 },
            { text: "Le decalage est le meme que l'enigme precedente", points: 5 },
            { text: "Le mot a 5 lettres et commence par E", points: 5 },
            { text: "Tu y apprends des choses nouvelles", points: 5 }
        ]
    },
    {
        encoded: "MRXHU",
        decoded: "JOUER",
        shift: 3,
        hints: [
            { text: "C'est une activite amusante", points: 5 },
            { text: "Le decalage est toujours +3", points: 5 },
            { text: "C'est un verbe du premier groupe", points: 5 },
            { text: "On fait ca avec des jeux video", points: 5 }
        ]
    },
    {
        encoded: "DPEF",
        decoded: "CODE",
        shift: 1,
        hints: [
            { text: "Attention! Le decalage a change", points: 5 },
            { text: "Le decalage est maintenant +1", points: 5 },
            { text: "C'est ce que tu essaies de decoder!", points: 5 },
            { text: "4 lettres, commence par C", points: 5 }
        ]
    },
    {
        encoded: "QWFGT",
        decoded: "ORDI",
        shift: 2,
        hints: [
            { text: "Le decalage est un nombre pair", points: 5 },
            { text: "Le decalage est +2", points: 5 },
            { text: "Abreviation de 'ordinateur'", points: 5 },
            { text: "Tu l'utilises probablement en ce moment", points: 5 }
        ]
    },
    {
        encoded: "GFHWJ",
        decoded: "BINAIRE",
        shift: 5,
        hints: [
            { text: "Le decalage est le plus grand jusqu'ici", points: 5 },
            { text: "Le decalage est +5", points: 5 },
            { text: "Systeme de numeration avec 0 et 1", points: 5 },
            { text: "Le langage des ordinateurs", points: 5 }
        ],
        encoded: "GNSFJWJ",
        decoded: "BINAIRE"
    }
];

// Fix the last puzzle encoding
puzzles[5].encoded = "GNSFJWJ";

// Game state
let currentPuzzle = 0;
let totalScore = 0;
let currentPoints = 25;
let hintsUsed = 0;
let puzzleResults = [];

// DOM Elements
const gameScreen = document.getElementById('game-screen');
const successScreen = document.getElementById('success-screen');
const finalScreen = document.getElementById('final-screen');

const encodedText = document.getElementById('encoded-text');
const hintsList = document.getElementById('hints-list');
const hintsCount = document.getElementById('hints-count');
const hintBtn = document.getElementById('hint-btn');
const hintCost = document.getElementById('hint-cost');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const feedback = document.getElementById('feedback');

const totalScoreEl = document.getElementById('total-score');
const currentPointsEl = document.getElementById('current-points');
const puzzleCounter = document.getElementById('puzzle-counter');

const successIcon = document.getElementById('success-icon');
const successTitle = document.getElementById('success-title');
const successMessage = document.getElementById('success-message');
const pointsEarned = document.getElementById('points-earned');
const solutionText = document.getElementById('solution-text');
const nextBtn = document.getElementById('next-btn');

const finalScoreValue = document.getElementById('final-score-value');
const finalRating = document.getElementById('final-rating');
const solutionsList = document.getElementById('solutions-list');
const restartBtn = document.getElementById('restart-btn');

// Initialize game
function initGame() {
    currentPuzzle = 0;
    totalScore = 0;
    puzzleResults = [];
    loadPuzzle();
}

// Load current puzzle
function loadPuzzle() {
    const puzzle = puzzles[currentPuzzle];

    currentPoints = 25;
    hintsUsed = 0;

    encodedText.textContent = puzzle.encoded;
    hintsList.innerHTML = '<div class="hint-placeholder">Aucun indice revele</div>';
    hintsCount.textContent = `0/${puzzle.hints.length}`;
    answerInput.value = '';
    feedback.className = 'feedback';
    feedback.style.display = 'none';

    updateDisplay();

    hintBtn.disabled = false;

    showScreen('game');
}

// Update display elements
function updateDisplay() {
    totalScoreEl.textContent = totalScore;
    currentPointsEl.textContent = currentPoints;
    puzzleCounter.textContent = `${currentPuzzle + 1}/${puzzles.length}`;

    const puzzle = puzzles[currentPuzzle];
    if (hintsUsed >= puzzle.hints.length) {
        hintBtn.disabled = true;
        hintCost.textContent = 'Max';
    } else {
        hintCost.textContent = '-5 pts';
    }
}

// Request hint
function requestHint() {
    const puzzle = puzzles[currentPuzzle];

    if (hintsUsed >= puzzle.hints.length) return;

    const hint = puzzle.hints[hintsUsed];
    hintsUsed++;
    currentPoints = Math.max(5, currentPoints - hint.points);

    // Update hints display
    if (hintsUsed === 1) {
        hintsList.innerHTML = '';
    }

    const hintElement = document.createElement('div');
    hintElement.className = 'hint-item';
    hintElement.innerHTML = `<span class="hint-number">#${hintsUsed}</span>${hint.text}`;
    hintsList.appendChild(hintElement);

    hintsCount.textContent = `${hintsUsed}/${puzzle.hints.length}`;

    updateDisplay();
}

// Check answer
function checkAnswer() {
    const puzzle = puzzles[currentPuzzle];
    const userAnswer = answerInput.value.trim().toUpperCase();

    if (!userAnswer) {
        showFeedback('Entrez une reponse', 'error');
        return;
    }

    if (userAnswer === puzzle.decoded) {
        // Correct answer
        totalScore += currentPoints;

        puzzleResults.push({
            encoded: puzzle.encoded,
            decoded: puzzle.decoded,
            points: currentPoints,
            hintsUsed: hintsUsed
        });

        showSuccess();
    } else {
        // Wrong answer
        showFeedback('Incorrect! Essayez encore ou demandez un indice.', 'error');
        answerInput.select();
    }
}

// Show feedback message
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    feedback.style.display = 'block';

    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
}

// Show success screen
function showSuccess() {
    const puzzle = puzzles[currentPuzzle];

    if (hintsUsed === 0) {
        successIcon.textContent = '🌟';
        successTitle.textContent = 'Parfait!';
        successMessage.textContent = 'Resolu sans aucun indice!';
    } else if (hintsUsed <= 2) {
        successIcon.textContent = '🔓';
        successTitle.textContent = 'Excellent!';
        successMessage.textContent = `Resolu avec seulement ${hintsUsed} indice${hintsUsed > 1 ? 's' : ''}!`;
    } else {
        successIcon.textContent = '✓';
        successTitle.textContent = 'Bien joue!';
        successMessage.textContent = `Resolu avec ${hintsUsed} indices.`;
    }

    pointsEarned.textContent = `+${currentPoints} points`;
    solutionText.textContent = puzzle.decoded;

    if (currentPuzzle === puzzles.length - 1) {
        nextBtn.textContent = 'Voir les Resultats';
    } else {
        nextBtn.textContent = 'Enigme Suivante';
    }

    showScreen('success');
}

// Go to next puzzle or final screen
function nextPuzzle() {
    currentPuzzle++;

    if (currentPuzzle >= puzzles.length) {
        showFinalScreen();
    } else {
        loadPuzzle();
    }
}

// Show final screen
function showFinalScreen() {
    finalScoreValue.textContent = totalScore;

    const maxScore = puzzles.length * 25;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage >= 90) {
        finalRating.textContent = '🌟 Detective Extraordinaire! Tu as un talent naturel pour le dechiffrement!';
        finalRating.className = 'final-rating excellent';
    } else if (percentage >= 70) {
        finalRating.textContent = '🔍 Bon Detective! Tu maitrises bien les codes secrets!';
        finalRating.className = 'final-rating good';
    } else {
        finalRating.textContent = '📚 Apprenti Detective! Continue a t\'entrainer!';
        finalRating.className = 'final-rating average';
    }

    // Build solutions list
    solutionsList.innerHTML = '';
    puzzleResults.forEach((result, index) => {
        const item = document.createElement('div');
        item.className = 'solution-item';
        item.innerHTML = `
            <div class="solution-info">
                <div class="solution-encoded">${result.encoded}</div>
                <div class="solution-decoded">${result.decoded}</div>
            </div>
            <div class="solution-points">
                <div class="solution-score">${result.points} pts</div>
                <div class="solution-hints">${result.hintsUsed} indice${result.hintsUsed !== 1 ? 's' : ''}</div>
            </div>
        `;
        solutionsList.appendChild(item);
    });

    showScreen('final');
}

// Show specific screen
function showScreen(screen) {
    gameScreen.classList.remove('active');
    successScreen.classList.remove('active');
    finalScreen.classList.remove('active');

    switch(screen) {
        case 'game':
            gameScreen.classList.add('active');
            answerInput.focus();
            break;
        case 'success':
            successScreen.classList.add('active');
            break;
        case 'final':
            finalScreen.classList.add('active');
            break;
    }
}

// Event listeners
hintBtn.addEventListener('click', requestHint);
submitBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextPuzzle);
restartBtn.addEventListener('click', initGame);

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Start the game
initGame();
