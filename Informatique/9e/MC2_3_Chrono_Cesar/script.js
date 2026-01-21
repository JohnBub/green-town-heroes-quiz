// Word bank organized by difficulty (shorter words first)
const wordBank = [
    // Easy (3-4 letters)
    { word: 'OUI', difficulty: 1 },
    { word: 'NON', difficulty: 1 },
    { word: 'CHAT', difficulty: 1 },
    { word: 'BLEU', difficulty: 1 },
    { word: 'VERT', difficulty: 1 },
    { word: 'NOIR', difficulty: 1 },
    { word: 'ROSE', difficulty: 1 },
    { word: 'LUNE', difficulty: 1 },

    // Medium (5 letters)
    { word: 'CHIEN', difficulty: 2 },
    { word: 'POMME', difficulty: 2 },
    { word: 'ECOLE', difficulty: 2 },
    { word: 'LIVRE', difficulty: 2 },
    { word: 'ARBRE', difficulty: 2 },
    { word: 'FLEUR', difficulty: 2 },
    { word: 'JAUNE', difficulty: 2 },
    { word: 'BLANC', difficulty: 2 },
    { word: 'ROUGE', difficulty: 2 },
    { word: 'MERCI', difficulty: 2 },
    { word: 'SALUT', difficulty: 2 },

    // Hard (6+ letters)
    { word: 'SOLEIL', difficulty: 3 },
    { word: 'MAISON', difficulty: 3 },
    { word: 'COUCOU', difficulty: 3 }
];

// Game state
let gameState = {
    score: 0,
    timeLeft: 60,
    wordsAttempted: 0,
    wordsCorrect: 0,
    currentWord: '',
    currentShift: 0,
    timerInterval: null,
    isPlaying: false,
    usedWords: [],
    highScore: 0
};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const submitBtn = document.getElementById('submit-btn');
const answerInput = document.getElementById('answer-input');
const currentWordDisplay = document.getElementById('current-word');
const shiftValueDisplay = document.getElementById('shift-value');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const timerBar = document.getElementById('timer-bar');
const feedback = document.getElementById('feedback');
const finalScore = document.getElementById('final-score');
const wordsEncoded = document.getElementById('words-encoded');
const accuracy = document.getElementById('accuracy');
const newRecord = document.getElementById('new-record');
const bestScoreDisplay = document.getElementById('best-score');

// Audio context for sound effects
let audioContext = null;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playSound(type) {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'correct') {
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialDecayTo = 0.01;
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'wrong') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } else if (type === 'tick') {
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }
}

// Caesar cipher encoding
function caesarEncode(text, shift) {
    return text.toUpperCase().split('').map(char => {
        if (char >= 'A' && char <= 'Z') {
            const code = char.charCodeAt(0);
            const shifted = ((code - 65 + shift) % 26 + 26) % 26 + 65;
            return String.fromCharCode(shifted);
        }
        return char;
    }).join('');
}

// Get a random word based on game progress
function getNextWord() {
    // Determine difficulty based on words attempted
    let maxDifficulty;
    if (gameState.wordsAttempted < 5) {
        maxDifficulty = 1;
    } else if (gameState.wordsAttempted < 10) {
        maxDifficulty = 2;
    } else {
        maxDifficulty = 3;
    }

    // Filter available words
    const availableWords = wordBank.filter(w =>
        w.difficulty <= maxDifficulty &&
        !gameState.usedWords.includes(w.word)
    );

    // If all words used, reset
    if (availableWords.length === 0) {
        gameState.usedWords = [];
        return getNextWord();
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selected = availableWords[randomIndex];
    gameState.usedWords.push(selected.word);

    return selected.word;
}

// Get shift value based on difficulty
function getShiftValue() {
    // Start with smaller shifts, increase as game progresses
    if (gameState.wordsAttempted < 5) {
        return Math.floor(Math.random() * 3) + 1; // 1-3
    } else if (gameState.wordsAttempted < 10) {
        return Math.floor(Math.random() * 4) + 1; // 1-4
    } else {
        return Math.floor(Math.random() * 5) + 1; // 1-5
    }
}

// Display new word challenge
function showNewWord() {
    gameState.currentWord = getNextWord();
    gameState.currentShift = getShiftValue();

    currentWordDisplay.textContent = gameState.currentWord;
    shiftValueDisplay.textContent = `+${gameState.currentShift}`;
    answerInput.value = '';
    answerInput.focus();

    feedback.classList.add('hidden');
}

// Check answer
function checkAnswer() {
    const userAnswer = answerInput.value.toUpperCase().trim();
    const correctAnswer = caesarEncode(gameState.currentWord, gameState.currentShift);

    gameState.wordsAttempted++;

    if (userAnswer === correctAnswer) {
        // Correct answer
        gameState.wordsCorrect++;
        gameState.score += 10;
        scoreDisplay.textContent = gameState.score;
        scoreDisplay.classList.add('pop');
        setTimeout(() => scoreDisplay.classList.remove('pop'), 300);

        playSound('correct');

        feedback.textContent = 'Correct !';
        feedback.className = 'feedback correct';
        feedback.classList.remove('hidden');

        setTimeout(() => {
            showNewWord();
        }, 300);
    } else {
        // Wrong answer
        playSound('wrong');

        feedback.textContent = `Reponse : ${correctAnswer}`;
        feedback.className = 'feedback wrong';
        feedback.classList.remove('hidden');

        answerInput.classList.add('shake');
        setTimeout(() => answerInput.classList.remove('shake'), 300);

        setTimeout(() => {
            showNewWord();
        }, 1200);
    }
}

// Update timer display
function updateTimer() {
    gameState.timeLeft--;
    timerDisplay.textContent = gameState.timeLeft;

    // Update progress bar
    const percentage = (gameState.timeLeft / 60) * 100;
    timerBar.style.width = `${percentage}%`;

    // Update timer styling based on time left
    if (gameState.timeLeft <= 10) {
        timerDisplay.className = 'timer danger';
        if (gameState.timeLeft <= 5) {
            playSound('tick');
        }
    } else if (gameState.timeLeft <= 20) {
        timerDisplay.className = 'timer warning';
    } else {
        timerDisplay.className = 'timer';
    }

    if (gameState.timeLeft <= 0) {
        endGame();
    }
}

// Start game
function startGame() {
    initAudio();

    // Reset game state
    gameState = {
        ...gameState,
        score: 0,
        timeLeft: 60,
        wordsAttempted: 0,
        wordsCorrect: 0,
        currentWord: '',
        currentShift: 0,
        isPlaying: true,
        usedWords: []
    };

    // Update displays
    scoreDisplay.textContent = '0';
    timerDisplay.textContent = '60';
    timerDisplay.className = 'timer';
    timerBar.style.width = '100%';

    // Show game screen
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    // Start timer
    gameState.timerInterval = setInterval(updateTimer, 1000);

    // Show first word
    showNewWord();
}

// End game
function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);

    // Calculate stats
    const accuracyPercent = gameState.wordsAttempted > 0
        ? Math.round((gameState.wordsCorrect / gameState.wordsAttempted) * 100)
        : 0;

    // Update end screen
    finalScore.textContent = gameState.score;
    wordsEncoded.textContent = gameState.wordsCorrect;
    accuracy.textContent = `${accuracyPercent}%`;

    // Check for high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('chronoCesarHighScore', gameState.highScore);
        newRecord.classList.remove('hidden');
    } else {
        newRecord.classList.add('hidden');
    }

    // Show end screen
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
}

// Load high score from localStorage
function loadHighScore() {
    const saved = localStorage.getItem('chronoCesarHighScore');
    if (saved) {
        gameState.highScore = parseInt(saved);
        bestScoreDisplay.textContent = gameState.highScore;
    }
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

submitBtn.addEventListener('click', () => {
    if (gameState.isPlaying && answerInput.value.trim()) {
        checkAnswer();
    }
});

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && gameState.isPlaying && answerInput.value.trim()) {
        checkAnswer();
    }
});

// Prevent non-letter input
answerInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
});

// Initialize
loadHighScore();
