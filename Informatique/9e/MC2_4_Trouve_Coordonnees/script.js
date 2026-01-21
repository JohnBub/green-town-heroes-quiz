// Polybius Square Data
const polybiusGrid = {
    'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15',
    'F': '21', 'G': '22', 'H': '23', 'I': '24', 'J': '24', 'K': '25',
    'L': '31', 'M': '32', 'N': '33', 'O': '34', 'P': '35',
    'Q': '41', 'R': '42', 'S': '43', 'T': '44', 'U': '45',
    'V': '51', 'W': '52', 'X': '53', 'Y': '54', 'Z': '55'
};

// Reverse mapping for coordinates to letters
const coordToLetter = {};
Object.entries(polybiusGrid).forEach(([letter, coord]) => {
    if (letter !== 'J') { // Skip J as it shares with I
        coordToLetter[coord] = letter;
    }
});
coordToLetter['24'] = 'I'; // I/J both map to 24

// Game State
let gameState = {
    mode: null,
    difficulty: 'easy',
    currentRound: 0,
    totalRounds: 15,
    score: 0,
    streak: 0,
    bestStreak: 0,
    questions: [],
    currentQuestion: null,
    mistakes: [],
    timer: null,
    timePerQuestion: 5000,
    timeRemaining: 5000,
    questionStartTime: null,
    totalResponseTime: 0,
    correctCount: 0
};

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    results: document.getElementById('results-screen')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    retryBtn: document.getElementById('retry-btn'),
    menuBtn: document.getElementById('menu-btn'),
    modeButtons: document.querySelectorAll('.mode-btn'),
    diffButtons: document.querySelectorAll('.diff-btn'),
    currentRound: document.getElementById('current-round'),
    totalRounds: document.getElementById('total-rounds'),
    score: document.getElementById('score'),
    streak: document.getElementById('streak'),
    streakFire: document.getElementById('streak-fire'),
    timerContainer: document.getElementById('timer-container'),
    timerBar: document.getElementById('timer-bar'),
    gridContainer: document.getElementById('grid-container'),
    polybiusGrid: document.getElementById('polybius-grid'),
    questionType: document.getElementById('question-type'),
    questionDisplay: document.getElementById('question-display'),
    answerInput: document.getElementById('answer-input'),
    feedback: document.getElementById('feedback'),
    finalScore: document.getElementById('final-score'),
    correctCount: document.getElementById('correct-count'),
    wrongCount: document.getElementById('wrong-count'),
    bestStreak: document.getElementById('best-streak'),
    avgTime: document.getElementById('avg-time'),
    mistakesSection: document.getElementById('mistakes-section'),
    mistakesList: document.getElementById('mistakes-list')
};

// Initialize
function init() {
    setupEventListeners();
}

function setupEventListeners() {
    // Mode selection
    elements.modeButtons.forEach(btn => {
        btn.addEventListener('click', () => selectMode(btn));
    });

    // Difficulty selection
    elements.diffButtons.forEach(btn => {
        btn.addEventListener('click', () => selectDifficulty(btn));
    });

    // Start button
    elements.startBtn.addEventListener('click', startGame);

    // Answer input
    elements.answerInput.addEventListener('input', handleInput);
    elements.answerInput.addEventListener('keydown', handleKeydown);

    // Results buttons
    elements.retryBtn.addEventListener('click', retryGame);
    elements.menuBtn.addEventListener('click', goToMenu);
}

function selectMode(btn) {
    elements.modeButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    gameState.mode = btn.dataset.mode;
    updateStartButton();
}

function selectDifficulty(btn) {
    elements.diffButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    gameState.difficulty = btn.dataset.difficulty;
}

function updateStartButton() {
    elements.startBtn.disabled = !gameState.mode;
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Game Logic
function startGame() {
    resetGameState();
    generateQuestions();
    setupGameUI();
    showScreen('game');
    nextQuestion();
}

function resetGameState() {
    gameState.currentRound = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.questions = [];
    gameState.mistakes = [];
    gameState.totalResponseTime = 0;
    gameState.correctCount = 0;
    clearTimer();
}

function generateQuestions() {
    const letters = Object.keys(polybiusGrid).filter(l => l !== 'J');
    const coords = Object.keys(coordToLetter);

    for (let i = 0; i < gameState.totalRounds; i++) {
        let questionType;

        if (gameState.mode === 'letter-to-coord') {
            questionType = 'letterToCoord';
        } else if (gameState.mode === 'coord-to-letter') {
            questionType = 'coordToLetter';
        } else {
            questionType = Math.random() < 0.5 ? 'letterToCoord' : 'coordToLetter';
        }

        if (questionType === 'letterToCoord') {
            const letter = letters[Math.floor(Math.random() * letters.length)];
            gameState.questions.push({
                type: 'letterToCoord',
                question: letter,
                answer: polybiusGrid[letter],
                row: parseInt(polybiusGrid[letter][0]),
                col: parseInt(polybiusGrid[letter][1])
            });
        } else {
            const coord = coords[Math.floor(Math.random() * coords.length)];
            gameState.questions.push({
                type: 'coordToLetter',
                question: coord,
                answer: coordToLetter[coord],
                row: parseInt(coord[0]),
                col: parseInt(coord[1])
            });
        }
    }
}

function setupGameUI() {
    elements.totalRounds.textContent = gameState.totalRounds;
    elements.score.textContent = '0';
    elements.streak.textContent = '0';
    elements.streakFire.classList.remove('active');

    // Timer visibility
    if (gameState.difficulty === 'easy') {
        elements.timerContainer.classList.remove('visible');
    } else {
        elements.timerContainer.classList.add('visible');
    }

    // Grid visibility
    if (gameState.difficulty === 'hard') {
        elements.gridContainer.classList.add('hidden');
    } else {
        elements.gridContainer.classList.remove('hidden');
    }

    clearHighlights();
}

function nextQuestion() {
    if (gameState.currentRound >= gameState.totalRounds) {
        endGame();
        return;
    }

    gameState.currentQuestion = gameState.questions[gameState.currentRound];
    gameState.currentRound++;
    gameState.questionStartTime = Date.now();

    // Update UI
    elements.currentRound.textContent = gameState.currentRound;
    elements.answerInput.value = '';
    elements.answerInput.classList.remove('correct', 'wrong');
    elements.feedback.textContent = '';
    elements.feedback.classList.remove('correct', 'wrong');
    clearHighlights();

    // Set question type text
    if (gameState.currentQuestion.type === 'letterToCoord') {
        elements.questionType.textContent = 'Trouve les coordonnees de:';
        elements.answerInput.maxLength = 2;
        elements.answerInput.placeholder = '??';
    } else {
        elements.questionType.textContent = 'Quelle lettre se trouve en:';
        elements.answerInput.maxLength = 1;
        elements.answerInput.placeholder = '?';
    }

    // Display question
    elements.questionDisplay.textContent = gameState.currentQuestion.question;

    // Highlight cell for letter-to-coord questions (before answering)
    if (gameState.currentQuestion.type === 'letterToCoord' && gameState.difficulty !== 'hard') {
        highlightCell(gameState.currentQuestion.row, gameState.currentQuestion.col, 'highlight');
    }

    // Focus input
    elements.answerInput.focus();

    // Start timer if needed
    if (gameState.difficulty !== 'easy') {
        startTimer();
    }
}

function handleInput(e) {
    const value = e.target.value.toUpperCase();
    e.target.value = value;

    // Check if answer is complete
    if (gameState.currentQuestion.type === 'letterToCoord' && value.length === 2) {
        checkAnswer(value);
    } else if (gameState.currentQuestion.type === 'coordToLetter' && value.length === 1) {
        checkAnswer(value);
    }
}

function handleKeydown(e) {
    if (e.key === 'Enter') {
        const value = elements.answerInput.value.toUpperCase();
        if (value.length > 0) {
            checkAnswer(value);
        }
    }
}

function checkAnswer(userAnswer) {
    clearTimer();

    const responseTime = Date.now() - gameState.questionStartTime;
    const question = gameState.currentQuestion;
    let correct = false;

    // Handle I/J case
    if (question.type === 'coordToLetter' && question.answer === 'I') {
        correct = userAnswer === 'I' || userAnswer === 'J';
    } else {
        correct = userAnswer === question.answer;
    }

    if (correct) {
        handleCorrectAnswer(responseTime);
    } else {
        handleWrongAnswer(userAnswer);
    }

    // Show feedback and proceed
    setTimeout(() => {
        nextQuestion();
    }, 1000);
}

function handleCorrectAnswer(responseTime) {
    gameState.correctCount++;
    gameState.totalResponseTime += responseTime;

    // Calculate score (base + speed bonus + streak bonus)
    let points = 100;

    // Speed bonus (up to 50 points for very fast answers)
    if (responseTime < 2000) {
        points += Math.floor(50 * (1 - responseTime / 2000));
    }

    // Streak bonus
    gameState.streak++;
    if (gameState.streak > gameState.bestStreak) {
        gameState.bestStreak = gameState.streak;
    }

    if (gameState.streak >= 3) {
        points += gameState.streak * 10;
        elements.streakFire.classList.add('active');
    }

    gameState.score += points;

    // Update UI
    elements.score.textContent = gameState.score;
    elements.streak.textContent = gameState.streak;
    elements.answerInput.classList.add('correct');
    elements.feedback.textContent = '+' + points + ' points!';
    elements.feedback.classList.add('correct');

    // Highlight correct cell
    highlightCell(gameState.currentQuestion.row, gameState.currentQuestion.col, 'correct');
}

function handleWrongAnswer(userAnswer) {
    gameState.streak = 0;
    elements.streakFire.classList.remove('active');

    // Record mistake
    gameState.mistakes.push({
        question: gameState.currentQuestion.question,
        yourAnswer: userAnswer || 'Temps ecoule',
        correctAnswer: gameState.currentQuestion.answer,
        type: gameState.currentQuestion.type
    });

    // Update UI
    elements.streak.textContent = '0';
    elements.answerInput.classList.add('wrong');
    elements.feedback.textContent = 'Reponse: ' + gameState.currentQuestion.answer;
    elements.feedback.classList.add('wrong');

    // Highlight correct cell in red first, then show correct
    highlightCell(gameState.currentQuestion.row, gameState.currentQuestion.col, 'wrong');
}

function highlightCell(row, col, className) {
    clearHighlights();
    const cell = elements.polybiusGrid.querySelector('td[data-row="' + row + '"][data-col="' + col + '"]');
    if (cell) {
        cell.classList.add(className);
    }
}

function clearHighlights() {
    elements.polybiusGrid.querySelectorAll('td').forEach(cell => {
        cell.classList.remove('highlight', 'correct', 'wrong');
    });
}

// Timer Functions
function startTimer() {
    gameState.timeRemaining = gameState.timePerQuestion;
    elements.timerBar.style.width = '100%';
    elements.timerBar.classList.remove('warning', 'danger');

    const startTime = Date.now();

    gameState.timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        gameState.timeRemaining = gameState.timePerQuestion - elapsed;

        if (gameState.timeRemaining <= 0) {
            clearTimer();
            handleWrongAnswer('');
            setTimeout(() => nextQuestion(), 1000);
            return;
        }

        const percentage = (gameState.timeRemaining / gameState.timePerQuestion) * 100;
        elements.timerBar.style.width = percentage + '%';

        if (percentage < 20) {
            elements.timerBar.classList.add('danger');
            elements.timerBar.classList.remove('warning');
        } else if (percentage < 40) {
            elements.timerBar.classList.add('warning');
            elements.timerBar.classList.remove('danger');
        }
    }, 50);
}

function clearTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
}

// End Game
function endGame() {
    clearTimer();
    showResults();
    showScreen('results');
}

function showResults() {
    elements.finalScore.textContent = gameState.score;
    elements.correctCount.textContent = gameState.correctCount;
    elements.wrongCount.textContent = gameState.totalRounds - gameState.correctCount;
    elements.bestStreak.textContent = gameState.bestStreak;

    // Average time
    if (gameState.correctCount > 0) {
        const avgTime = (gameState.totalResponseTime / gameState.correctCount / 1000).toFixed(1);
        elements.avgTime.textContent = avgTime + 's';
    } else {
        elements.avgTime.textContent = '-';
    }

    // Mistakes review - using safe DOM methods
    elements.mistakesList.textContent = ''; // Clear previous content

    if (gameState.mistakes.length > 0) {
        elements.mistakesSection.style.display = 'block';

        gameState.mistakes.forEach(mistake => {
            const mistakeItem = document.createElement('div');
            mistakeItem.className = 'mistake-item';

            const questionSpan = document.createElement('span');
            questionSpan.className = 'mistake-question';
            questionSpan.textContent = mistake.question;

            const answerDiv = document.createElement('div');
            answerDiv.className = 'mistake-answer';

            const yourAnswerSpan = document.createElement('span');
            yourAnswerSpan.className = 'mistake-your';
            yourAnswerSpan.textContent = 'Ta reponse: ' + mistake.yourAnswer;

            const correctAnswerSpan = document.createElement('span');
            correctAnswerSpan.className = 'mistake-correct';
            correctAnswerSpan.textContent = 'Correct: ' + mistake.correctAnswer;

            answerDiv.appendChild(yourAnswerSpan);
            answerDiv.appendChild(correctAnswerSpan);

            mistakeItem.appendChild(questionSpan);
            mistakeItem.appendChild(answerDiv);

            elements.mistakesList.appendChild(mistakeItem);
        });
    } else {
        elements.mistakesSection.style.display = 'none';
    }
}

function retryGame() {
    startGame();
}

function goToMenu() {
    showScreen('start');
    // Reset mode selection
    elements.modeButtons.forEach(b => b.classList.remove('selected'));
    gameState.mode = null;
    updateStartButton();
}

// Start
init();
