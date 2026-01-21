// Game State
const gameState = {
    mode: 'normal', // 'normal' or 'speed'
    currentRound: 1,
    currentQuestion: 0,
    totalQuestions: 15,
    score: 0,
    streak: 0,
    maxStreak: 0,
    shift: 3,
    isEncoding: true,
    currentLetter: '',
    correctAnswer: '',
    mistakes: [],
    timerInterval: null,
    timeLeft: 10,
    startTime: null,
    totalTime: 0
};

// Alphabet constant
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    results: document.getElementById('results-screen')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    roundLabel: document.getElementById('round-label'),
    shiftDisplay: document.getElementById('shift-display'),
    progress: document.getElementById('progress'),
    score: document.getElementById('score'),
    streak: document.getElementById('streak'),
    timerDisplay: document.getElementById('timer-display'),
    timer: document.getElementById('timer'),
    alphabetOriginal: document.getElementById('alphabet-original'),
    alphabetShifted: document.getElementById('alphabet-shifted'),
    taskType: document.getElementById('task-type'),
    letterToEncode: document.getElementById('letter-to-encode'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    feedback: document.getElementById('feedback'),
    feedbackText: document.getElementById('feedback-text'),
    finalScoreValue: document.getElementById('final-score-value'),
    scoreMessage: document.getElementById('score-message'),
    finalCorrect: document.getElementById('final-correct'),
    finalStreak: document.getElementById('final-streak'),
    finalTime: document.getElementById('final-time'),
    mistakesSection: document.getElementById('mistakes-section'),
    mistakesList: document.getElementById('mistakes-list'),
    retryBtn: document.getElementById('retry-btn'),
    homeBtn: document.getElementById('home-btn')
};

// Initialize the game
function init() {
    setupEventListeners();
    generateAlphabetStrips();
}

// Setup event listeners
function setupEventListeners() {
    elements.startBtn.addEventListener('click', startGame);
    elements.submitBtn.addEventListener('click', checkAnswer);
    elements.answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    elements.answerInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    });
    elements.modeBtns.forEach(btn => {
        btn.addEventListener('click', () => selectMode(btn.dataset.mode));
    });
    elements.retryBtn.addEventListener('click', startGame);
    elements.homeBtn.addEventListener('click', goHome);

    // Select normal mode by default
    selectMode('normal');
}

// Select game mode
function selectMode(mode) {
    gameState.mode = mode;
    elements.modeBtns.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.mode === mode);
    });
}

// Generate alphabet strips
function generateAlphabetStrips() {
    elements.alphabetOriginal.innerHTML = '';
    elements.alphabetShifted.innerHTML = '';

    for (let i = 0; i < 26; i++) {
        const letterEl = document.createElement('span');
        letterEl.className = 'letter';
        letterEl.textContent = ALPHABET[i];
        letterEl.dataset.index = i;
        elements.alphabetOriginal.appendChild(letterEl);
    }

    for (let i = 0; i < 26; i++) {
        const letterEl = document.createElement('span');
        letterEl.className = 'letter';
        letterEl.textContent = ALPHABET[i];
        letterEl.dataset.index = i;
        elements.alphabetShifted.appendChild(letterEl);
    }
}

// Update alphabet strips to show shift
function updateAlphabetHighlights() {
    // Clear all highlights
    const originalLetters = elements.alphabetOriginal.querySelectorAll('.letter');
    const shiftedLetters = elements.alphabetShifted.querySelectorAll('.letter');

    originalLetters.forEach(el => el.classList.remove('highlight-original', 'highlight-shifted'));
    shiftedLetters.forEach(el => el.classList.remove('highlight-original', 'highlight-shifted'));

    // Highlight current letter position
    const letterIndex = ALPHABET.indexOf(gameState.currentLetter);
    if (letterIndex !== -1) {
        originalLetters[letterIndex].classList.add('highlight-original');

        // Calculate shifted position
        let shiftedIndex;
        if (gameState.isEncoding) {
            shiftedIndex = (letterIndex + gameState.shift) % 26;
        } else {
            shiftedIndex = (letterIndex - gameState.shift + 26) % 26;
        }
        shiftedLetters[shiftedIndex].classList.add('highlight-shifted');
    }
}

// Show specific screen
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Start the game
function startGame() {
    // Reset game state
    gameState.currentRound = 1;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.maxStreak = 0;
    gameState.mistakes = [];
    gameState.startTime = Date.now();
    gameState.totalTime = 0;

    // Set initial round parameters
    setRoundParameters();

    // Show/hide timer based on mode
    if (gameState.mode === 'speed') {
        elements.timerDisplay.classList.remove('hidden');
    } else {
        elements.timerDisplay.classList.add('hidden');
    }

    // Update display
    updateDisplay();
    showScreen('game');

    // Generate first question
    nextQuestion();
}

// Set round parameters
function setRoundParameters() {
    switch (gameState.currentRound) {
        case 1:
            gameState.shift = 3;
            gameState.isEncoding = true;
            elements.roundLabel.textContent = 'Manche 1: Encodage';
            break;
        case 2:
            gameState.shift = 3;
            gameState.isEncoding = false;
            elements.roundLabel.textContent = 'Manche 2: Décodage';
            break;
        case 3:
            gameState.shift = Math.floor(Math.random() * 5) + 1;
            gameState.isEncoding = Math.random() > 0.5;
            elements.roundLabel.textContent = 'Manche 3: Mixte';
            break;
    }

    // Update task type display
    elements.taskType.textContent = gameState.isEncoding ? 'ENCODE' : 'DECODE';
    elements.taskType.className = 'task-type ' + (gameState.isEncoding ? 'encode' : 'decode');

    // Update shift display
    const shiftSign = gameState.isEncoding ? '+' : '-';
    elements.shiftDisplay.textContent = `Décalage: ${shiftSign}${gameState.shift}`;
}

// Generate next question
function nextQuestion() {
    // Clear feedback and input
    elements.feedback.classList.add('hidden');
    elements.answerInput.value = '';
    elements.answerInput.classList.remove('correct', 'incorrect');
    elements.answerInput.focus();

    // Check if we need to move to next round
    if (gameState.currentQuestion >= 5 && gameState.currentRound < 3) {
        if (gameState.currentQuestion === 5 || gameState.currentQuestion === 10) {
            gameState.currentRound++;
            setRoundParameters();
        }
    }

    // For round 3, randomize each question
    if (gameState.currentRound === 3) {
        gameState.shift = Math.floor(Math.random() * 5) + 1;
        gameState.isEncoding = Math.random() > 0.5;

        // Update displays
        elements.taskType.textContent = gameState.isEncoding ? 'ENCODE' : 'DECODE';
        elements.taskType.className = 'task-type ' + (gameState.isEncoding ? 'encode' : 'decode');
        const shiftSign = gameState.isEncoding ? '+' : '-';
        elements.shiftDisplay.textContent = `Décalage: ${shiftSign}${gameState.shift}`;
    }

    // Generate random letter
    gameState.currentLetter = ALPHABET[Math.floor(Math.random() * 26)];
    elements.letterToEncode.textContent = gameState.currentLetter;

    // Calculate correct answer
    const letterIndex = ALPHABET.indexOf(gameState.currentLetter);
    if (gameState.isEncoding) {
        gameState.correctAnswer = ALPHABET[(letterIndex + gameState.shift) % 26];
    } else {
        gameState.correctAnswer = ALPHABET[(letterIndex - gameState.shift + 26) % 26];
    }

    // Update alphabet highlights
    updateAlphabetHighlights();

    // Update progress
    gameState.currentQuestion++;
    updateDisplay();

    // Start timer if speed mode
    if (gameState.mode === 'speed') {
        startTimer();
    }
}

// Start timer
function startTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timeLeft = 10;
    elements.timer.textContent = gameState.timeLeft;
    elements.timerDisplay.classList.remove('warning');

    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        elements.timer.textContent = gameState.timeLeft;

        if (gameState.timeLeft <= 3) {
            elements.timerDisplay.classList.add('warning');
        }

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            // Time's up - count as wrong answer
            showFeedback(false, "Temps écoulé !");
        }
    }, 1000);
}

// Check answer
function checkAnswer() {
    const userAnswer = elements.answerInput.value.toUpperCase();

    if (!userAnswer) {
        elements.answerInput.focus();
        return;
    }

    // Stop timer
    clearInterval(gameState.timerInterval);

    const isCorrect = userAnswer === gameState.correctAnswer;
    showFeedback(isCorrect);
}

// Show feedback
function showFeedback(isCorrect, customMessage = null) {
    elements.feedback.classList.remove('hidden', 'correct', 'incorrect');

    if (isCorrect) {
        gameState.score++;
        gameState.streak++;
        if (gameState.streak > gameState.maxStreak) {
            gameState.maxStreak = gameState.streak;
        }
        elements.feedback.classList.add('correct');
        elements.feedbackText.textContent = customMessage || 'Correct !';
        elements.answerInput.classList.add('correct');
    } else {
        const userAnswer = elements.answerInput.value.toUpperCase() || '?';
        gameState.mistakes.push({
            letter: gameState.currentLetter,
            isEncoding: gameState.isEncoding,
            shift: gameState.shift,
            userAnswer: userAnswer,
            correctAnswer: gameState.correctAnswer
        });
        gameState.streak = 0;
        elements.feedback.classList.add('incorrect');
        elements.feedbackText.textContent = customMessage || `Incorrect ! La réponse était: ${gameState.correctAnswer}`;
        elements.answerInput.classList.add('incorrect');
    }

    updateDisplay();

    // Move to next question or end game
    setTimeout(() => {
        if (gameState.currentQuestion >= gameState.totalQuestions) {
            endGame();
        } else {
            nextQuestion();
        }
    }, 1500);
}

// Update display
function updateDisplay() {
    elements.progress.textContent = `${gameState.currentQuestion}/${gameState.totalQuestions}`;
    elements.score.textContent = gameState.score;
    elements.streak.textContent = gameState.streak;
}

// End game
function endGame() {
    clearInterval(gameState.timerInterval);
    gameState.totalTime = Math.floor((Date.now() - gameState.startTime) / 1000);

    // Update results screen
    elements.finalScoreValue.textContent = gameState.score;
    elements.finalCorrect.textContent = gameState.score;
    elements.finalStreak.textContent = gameState.maxStreak;
    elements.finalTime.textContent = formatTime(gameState.totalTime);

    // Set score message
    const percentage = (gameState.score / gameState.totalQuestions) * 100;
    if (percentage >= 90) {
        elements.scoreMessage.textContent = 'Excellent ! Tu maîtrises le chiffrement de César !';
    } else if (percentage >= 70) {
        elements.scoreMessage.textContent = 'Très bien ! Continue à pratiquer !';
    } else if (percentage >= 50) {
        elements.scoreMessage.textContent = 'Pas mal ! Encore un peu d\'entraînement.';
    } else {
        elements.scoreMessage.textContent = 'Continue de t\'entraîner, tu vas y arriver !';
    }

    // Show mistakes if any
    if (gameState.mistakes.length > 0) {
        elements.mistakesSection.classList.remove('hidden');
        elements.mistakesList.innerHTML = '';

        gameState.mistakes.forEach(mistake => {
            const mistakeEl = document.createElement('div');
            mistakeEl.className = 'mistake-item';

            const taskText = mistake.isEncoding ? 'Encoder' : 'Décoder';
            mistakeEl.innerHTML = `
                <span class="mistake-question">
                    ${taskText} <strong>${mistake.letter}</strong> (décalage ${mistake.shift})
                </span>
                <span class="mistake-answer">
                    <span class="mistake-your-answer">Ta réponse: ${mistake.userAnswer}</span>
                    <span class="mistake-correct-answer">Correct: ${mistake.correctAnswer}</span>
                </span>
            `;

            elements.mistakesList.appendChild(mistakeEl);
        });
    } else {
        elements.mistakesSection.classList.add('hidden');
    }

    showScreen('results');
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}

// Go home
function goHome() {
    showScreen('start');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
