// Caesar Cipher Decoding Challenge - Game Data and Logic

const challenges = [
    // Easy (1-3): Short words, shift +3
    {
        encoded: "ERQMRXU",
        decoded: "BONJOUR",
        shift: 3,
        options: ["BONJOUR", "BONSOIR", "AUREVOIR", "COMMENT"],
        correct: 0,
        difficulty: "easy"
    },
    {
        encoded: "VHFUHW",
        decoded: "SECRET",
        shift: 3,
        options: ["MYSTERE", "SECRET", "ENIGME", "CACHER"],
        correct: 1,
        difficulty: "easy"
    },
    {
        encoded: "JHQHUDO",
        decoded: "GENERAL",
        shift: 3,
        options: ["COLONEL", "CAPITAINE", "GENERAL", "SOLDAT"],
        correct: 2,
        difficulty: "easy"
    },
    // Medium (4-6): Longer words, shift +1 to +5
    {
        encoded: "NFTTBHF",
        decoded: "MESSAGE",
        shift: 1,
        options: ["MESSAGE", "PASSAGE", "MASSAGE", "PRESSAGE"],
        correct: 0,
        difficulty: "medium"
    },
    {
        encoded: "HQLJPH",
        decoded: "ENIGME",
        shift: 2,
        options: ["ENIGME", "REGIME", "INTIME", "ESTIME"],
        correct: 0,
        difficulty: "medium"
    },
    {
        encoded: "XTWJWFYNTS",
        decoded: "PROTECTION",
        shift: 5,
        options: ["PRODUCTION", "PROTECTION", "PROJECTION", "PROMOTION"],
        correct: 1,
        difficulty: "medium"
    },
    // Hard (7-10): Short phrases, various shifts
    {
        encoded: "DPEF TFDSFU",
        decoded: "CODE SECRET",
        shift: 1,
        options: ["MODE SECRET", "CODE SECRET", "BODE SECRET", "RODE SECRET"],
        correct: 1,
        difficulty: "hard"
    },
    {
        encoded: "VGTKGV CHHCKTG",
        decoded: "SECRET AFFAIRE",
        shift: 2,
        options: ["SECRET AFFAIRE", "DECRET AFFAIRE", "SECRET ARMOIRE", "REGRET AFFAIRE"],
        correct: 0,
        difficulty: "hard"
    },
    {
        encoded: "PLVVLRQ VHFUHWH",
        decoded: "MISSION SECRETE",
        shift: 3,
        options: ["MISSION SECRETE", "PASSION SECRETE", "MISSION DISCRETE", "FUSION SECRETE"],
        correct: 0,
        difficulty: "hard"
    },
    {
        encoded: "JVKLZ ZLJYLAZ",
        decoded: "CODES SECRETS",
        shift: 7,
        options: ["MODES SECRETS", "BODES SECRETS", "CODES SECRETS", "RODES SECRETS"],
        correct: 2,
        difficulty: "hard"
    }
];

// Game State
let currentChallenge = 0;
let score = 0;
let hintsUsed = 0;
let hintUsedThisRound = false;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const hintBtn = document.getElementById('hint-btn');
const hintDisplay = document.getElementById('hint-display');
const encodedMessage = document.getElementById('encoded-message');
const shiftValue = document.getElementById('shift-value');
const optionsGrid = document.getElementById('options-grid');
const feedbackSection = document.getElementById('feedback-section');
const feedbackContent = document.getElementById('feedback-content');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const currentScoreDisplay = document.getElementById('current-score');
const difficultyBadge = document.getElementById('difficulty-badge');
const finalScore = document.getElementById('final-score');
const correctCount = document.getElementById('correct-count');
const hintsUsedDisplay = document.getElementById('hints-used');
const performanceMessage = document.getElementById('performance-message');

// Caesar Cipher Decode Function
function caesarDecode(text, shift) {
    return text.split('').map(char => {
        if (char === ' ') return ' ';
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) { // Uppercase A-Z
            return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
        }
        return char;
    }).join('');
}

// Show specific screen
function showScreen(screen) {
    [startScreen, gameScreen, resultsScreen].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// Update progress bar
function updateProgress() {
    const progress = ((currentChallenge + 1) / challenges.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = (currentChallenge + 1) + '/' + challenges.length;
}

// Update difficulty badge
function updateDifficultyBadge(difficulty) {
    difficultyBadge.className = 'difficulty-badge ' + difficulty;
    const labels = {
        easy: 'Facile',
        medium: 'Moyen',
        hard: 'Difficile'
    };
    difficultyBadge.textContent = labels[difficulty];
}

// Load current challenge
function loadChallenge() {
    const challenge = challenges[currentChallenge];

    // Reset state
    hintUsedThisRound = false;
    hintBtn.disabled = false;
    hintDisplay.classList.add('hidden');
    feedbackSection.classList.add('hidden');

    // Update display
    encodedMessage.textContent = challenge.encoded;
    shiftValue.textContent = '+' + challenge.shift;
    updateDifficultyBadge(challenge.difficulty);
    updateProgress();

    // Create option buttons
    optionsGrid.textContent = '';
    const letters = ['A', 'B', 'C', 'D'];

    challenge.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';

        const letterSpan = document.createElement('span');
        letterSpan.className = 'option-letter';
        letterSpan.textContent = letters[index];

        const textSpan = document.createElement('span');
        textSpan.textContent = option;

        btn.appendChild(letterSpan);
        btn.appendChild(textSpan);
        btn.addEventListener('click', () => selectOption(index));
        optionsGrid.appendChild(btn);
    });
}

// Show hint
function showHint() {
    const challenge = challenges[currentChallenge];
    const firstLetter = challenge.decoded[0];
    const firstEncoded = challenge.encoded[0];

    hintDisplay.textContent = 'Premiere lettre: ' + firstEncoded + ' → ' + firstLetter;
    hintDisplay.classList.remove('hidden');
    hintBtn.disabled = true;

    if (!hintUsedThisRound) {
        hintsUsed++;
        hintUsedThisRound = true;
    }
}

// Handle option selection
function selectOption(selectedIndex) {
    const challenge = challenges[currentChallenge];
    const optionBtns = optionsGrid.querySelectorAll('.option-btn');
    const isCorrect = selectedIndex === challenge.correct;

    // Disable all buttons
    optionBtns.forEach(btn => btn.disabled = true);

    // Highlight selected and correct
    optionBtns[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) {
        optionBtns[challenge.correct].classList.add('correct');
    }

    // Update score
    if (isCorrect) {
        score++;
        currentScoreDisplay.textContent = score;
    }

    // Show feedback
    showFeedback(isCorrect, challenge);
}

// Show feedback with explanation
function showFeedback(isCorrect, challenge) {
    feedbackSection.classList.remove('hidden');
    feedbackContent.className = 'feedback-content' + (isCorrect ? '' : ' incorrect');

    // Clear previous content
    feedbackContent.textContent = '';

    // Create title
    const title = document.createElement('h3');
    title.className = isCorrect ? 'correct' : 'incorrect';
    title.textContent = (isCorrect ? '✓ Correct!' : '✗ Incorrect');
    feedbackContent.appendChild(title);

    // Create answer line
    const answerP = document.createElement('p');
    answerP.textContent = 'La reponse est: ';
    const answerStrong = document.createElement('strong');
    answerStrong.textContent = challenge.decoded;
    answerP.appendChild(answerStrong);
    feedbackContent.appendChild(answerP);

    // Create decode explanation box
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'decode-explanation';

    const explanationLabel = document.createElement('p');
    explanationLabel.style.marginBottom = '10px';
    explanationLabel.style.color = '#7f8c8d';
    explanationLabel.textContent = 'Decodage avec decalage -' + challenge.shift + ':';
    explanationDiv.appendChild(explanationLabel);

    // Create decode step display
    const decodeStepDiv = document.createElement('div');
    decodeStepDiv.className = 'decode-step';

    // Generate explanation text
    let explanation = '';
    if (challenge.encoded.includes(' ')) {
        // For phrases, show abbreviated version
        const words = challenge.encoded.split(' ');
        const decodedWords = challenge.decoded.split(' ');
        explanation = words.map((word, i) => word + ' → ' + decodedWords[i]).join(' | ');
    } else {
        // For single words, show full character mapping
        explanation = challenge.encoded.split('').map((char, i) => {
            if (char === ' ') return ' ';
            return char + '→' + challenge.decoded[i];
        }).join(' ');
    }
    decodeStepDiv.textContent = explanation;
    explanationDiv.appendChild(decodeStepDiv);

    feedbackContent.appendChild(explanationDiv);
}

// Move to next challenge or show results
function nextChallenge() {
    currentChallenge++;

    if (currentChallenge >= challenges.length) {
        showResults();
    } else {
        loadChallenge();
    }
}

// Show final results
function showResults() {
    showScreen(resultsScreen);

    finalScore.textContent = score;
    correctCount.textContent = score;
    hintsUsedDisplay.textContent = hintsUsed;

    // Performance message based on score
    let message = '';
    const percentage = (score / challenges.length) * 100;

    if (percentage === 100) {
        message = 'Parfait! Tu es un maitre du decodage!';
    } else if (percentage >= 80) {
        message = 'Excellent! Tu as tres bien compris le chiffrement de Cesar!';
    } else if (percentage >= 60) {
        message = 'Bien joue! Continue a pratiquer pour devenir encore meilleur!';
    } else if (percentage >= 40) {
        message = 'Pas mal! Revois la technique de decodage et reessaie!';
    } else {
        message = 'Continue a apprendre! Le chiffrement de Cesar demande de la pratique.';
    }

    performanceMessage.textContent = message;
}

// Restart game
function restartGame() {
    currentChallenge = 0;
    score = 0;
    hintsUsed = 0;
    currentScoreDisplay.textContent = 0;
    showScreen(gameScreen);
    loadChallenge();
}

// Event Listeners
startBtn.addEventListener('click', () => {
    showScreen(gameScreen);
    loadChallenge();
});

nextBtn.addEventListener('click', nextChallenge);
restartBtn.addEventListener('click', restartGame);
hintBtn.addEventListener('click', showHint);

// Initialize
updateProgress();
