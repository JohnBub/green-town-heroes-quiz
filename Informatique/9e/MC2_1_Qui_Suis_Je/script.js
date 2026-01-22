// Game Data - Encryption History Subjects
const gameData = [
    {
        answer: "Jules César",
        acceptedAnswers: ["jules cesar", "jules césar", "cesar", "césar", "jules"],
        hints: [
            "Je suis un empereur romain.",
            "J'ai conquis la Gaule.",
            "J'utilisais un code secret pour mes messages militaires.",
            "Mon code décale les lettres de l'alphabet."
        ]
    },
    {
        answer: "Machine Enigma",
        acceptedAnswers: ["machine enigma", "enigma", "l'enigma", "la machine enigma"],
        hints: [
            "Je suis une invention du 20e siècle.",
            "J'ai été utilisée pendant la Seconde Guerre mondiale.",
            "Les Allemands m'utilisaient pour leurs communications secrètes.",
            "Alan Turing a réussi à me décrypter."
        ]
    },
    {
        answer: "Alan Turing",
        acceptedAnswers: ["alan turing", "turing", "alan mathison turing"],
        hints: [
            "Je suis un mathématicien britannique.",
            "J'ai travaillé à Bletchley Park.",
            "J'ai créé une machine pour casser un code.",
            "On me considère comme le père de l'informatique."
        ]
    },
    {
        answer: "Polybe",
        acceptedAnswers: ["polybe", "polybios", "polybius"],
        hints: [
            "Je suis un historien grec de l'Antiquité.",
            "J'ai vécu au 2e siècle avant J.-C.",
            "J'ai inventé un système pour transmettre des messages à distance.",
            "Mon carré utilise deux nombres pour chaque lettre."
        ]
    },
    {
        answer: "Blaise de Vigenère",
        acceptedAnswers: ["vigenere", "vigenère", "blaise de vigenere", "blaise de vigenère", "blaise vigenere", "blaise vigenère"],
        hints: [
            "Je suis un diplomate français du 16e siècle.",
            "J'ai perfectionné un système de chiffrement polyalphabétique.",
            "Mon chiffre utilise un mot-clé pour encoder les messages.",
            "Mon nom est associé à un tableau de lettres célèbre."
        ]
    },
    {
        answer: "RSA",
        acceptedAnswers: ["rsa", "algorithme rsa", "cryptosysteme rsa", "rivest shamir adleman"],
        hints: [
            "Je suis un algorithme inventé en 1977.",
            "Mon nom vient des initiales de trois chercheurs du MIT.",
            "Je suis basé sur la difficulté de factoriser de grands nombres premiers.",
            "Je suis utilisé pour sécuriser les transactions sur Internet."
        ]
    },
    {
        answer: "Claude Shannon",
        acceptedAnswers: ["claude shannon", "shannon", "claude elwood shannon"],
        hints: [
            "Je suis un mathématicien et ingénieur américain.",
            "J'ai travaillé aux laboratoires Bell.",
            "J'ai fondé la théorie de l'information.",
            "On m'appelle le 'père de la cryptographie moderne'."
        ]
    },
    {
        answer: "Scytale",
        acceptedAnswers: ["scytale", "skytale", "la scytale", "baton de scytale"],
        hints: [
            "Je suis un outil de chiffrement très ancien.",
            "Les Spartiates m'utilisaient pour leurs communications militaires.",
            "Je suis un bâton de bois cylindrique.",
            "On enroule une bande de cuir autour de moi pour lire le message secret."
        ]
    }
];

// Game State
let currentQuestionIndex = 0;
let currentHintIndex = 0;
let totalScore = 0;
let questionsResults = [];
let pointsPerHint = [25, 20, 15, 10];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextHintBtn = document.getElementById('next-hint');
const submitGuessBtn = document.getElementById('submit-guess');
const guessInput = document.getElementById('guess-input');
const questionCounter = document.getElementById('question-counter');
const currentScoreDisplay = document.getElementById('current-score');
const availablePointsDisplay = document.getElementById('available-points');
const feedback = document.getElementById('feedback');
const answerReveal = document.getElementById('answer-reveal');
const nextQuestionBtn = document.getElementById('next-question');
const restartBtn = document.getElementById('restart-btn');
const finalScoreDisplay = document.getElementById('final-score');
const summaryList = document.getElementById('summary-list');
const performanceBadge = document.getElementById('performance-badge');

// Hint Elements
const hintCards = [
    document.getElementById('hint-1'),
    document.getElementById('hint-2'),
    document.getElementById('hint-3'),
    document.getElementById('hint-4')
];

// Utility Functions
function normalizeString(str) {
    return str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Game Functions
function startGame() {
    currentQuestionIndex = 0;
    currentHintIndex = 0;
    totalScore = 0;
    questionsResults = [];

    // Shuffle questions for variety
    gameData.sort(() => Math.random() - 0.5);

    showScreen(gameScreen);
    loadQuestion();
}

function showScreen(screen) {
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    screen.classList.add('active');
}

function loadQuestion() {
    currentHintIndex = 0;
    guessInput.value = '';
    feedback.classList.add('hidden');
    answerReveal.classList.add('hidden');

    // Update counter
    questionCounter.textContent = "Énigme " + (currentQuestionIndex + 1) + "/" + gameData.length;
    currentScoreDisplay.textContent = totalScore;
    availablePointsDisplay.textContent = pointsPerHint[0];

    // Reset all hints
    hintCards.forEach((card, index) => {
        card.classList.remove('revealed');
        const textDiv = card.querySelector('.hint-text');
        textDiv.classList.add('locked');
        // Clear and add lock icon safely
        while (textDiv.firstChild) {
            textDiv.removeChild(textDiv.firstChild);
        }
        const lockSpan = document.createElement('span');
        lockSpan.className = 'lock-icon';
        lockSpan.textContent = '🔒';
        textDiv.appendChild(lockSpan);
    });

    // Reveal first hint
    revealHint(0);

    // Enable buttons
    nextHintBtn.disabled = false;
    guessInput.disabled = false;
    submitGuessBtn.disabled = false;
}

function revealHint(index) {
    if (index >= 4) return;

    const currentQuestion = gameData[currentQuestionIndex];
    const hintCard = hintCards[index];
    const textDiv = hintCard.querySelector('.hint-text');

    hintCard.classList.add('revealed');
    textDiv.classList.remove('locked');
    textDiv.textContent = currentQuestion.hints[index];

    currentHintIndex = index;
    availablePointsDisplay.textContent = pointsPerHint[index];

    // Disable next hint button if all hints revealed
    if (index >= 3) {
        nextHintBtn.disabled = true;
    }
}

function checkAnswer() {
    const userAnswer = normalizeString(guessInput.value);
    const currentQuestion = gameData[currentQuestionIndex];

    if (!userAnswer) {
        showFeedback("Entrez une réponse !", "incorrect");
        return;
    }

    const isCorrect = currentQuestion.acceptedAnswers.some(
        accepted => normalizeString(accepted) === userAnswer
    );

    if (isCorrect) {
        const earnedPoints = pointsPerHint[currentHintIndex];
        totalScore += earnedPoints;
        currentScoreDisplay.textContent = totalScore;

        questionsResults.push({
            answer: currentQuestion.answer,
            points: earnedPoints,
            hintsUsed: currentHintIndex + 1,
            correct: true
        });

        showAnswerReveal(currentQuestion.answer, earnedPoints, true);
    } else {
        showFeedback("Ce n'est pas la bonne réponse. Essayez encore ou demandez un indice.", "incorrect");
    }
}

function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = "feedback " + type;
    feedback.classList.remove('hidden');

    setTimeout(() => {
        feedback.classList.add('hidden');
    }, 3000);
}

function showAnswerReveal(answer, points, isCorrect) {
    answerReveal.classList.remove('hidden');

    const revealedAnswer = answerReveal.querySelector('.revealed-answer');
    const pointsEarned = answerReveal.querySelector('.points-earned');

    revealedAnswer.textContent = answer;

    if (isCorrect) {
        pointsEarned.textContent = "+" + points + " points !";
        pointsEarned.className = 'points-earned success';
    } else {
        pointsEarned.textContent = "0 points";
        pointsEarned.className = 'points-earned fail';
    }

    // Disable input while showing reveal
    guessInput.disabled = true;
    submitGuessBtn.disabled = true;
    nextHintBtn.disabled = true;
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= gameData.length) {
        showResults();
    } else {
        loadQuestion();
    }
}

function giveUp() {
    const currentQuestion = gameData[currentQuestionIndex];

    questionsResults.push({
        answer: currentQuestion.answer,
        points: 0,
        hintsUsed: currentHintIndex + 1,
        correct: false
    });

    showAnswerReveal(currentQuestion.answer, 0, false);
}

function showResults() {
    showScreen(resultsScreen);

    finalScoreDisplay.textContent = totalScore;

    // Calculate max possible score
    const maxScore = gameData.length * 25;
    const percentage = (totalScore / maxScore) * 100;

    // Set performance badge
    if (percentage >= 80) {
        performanceBadge.textContent = "Expert en Cryptographie !";
        performanceBadge.className = "performance-badge excellent";
    } else if (percentage >= 60) {
        performanceBadge.textContent = "Bon Cryptanalyste !";
        performanceBadge.className = "performance-badge good";
    } else if (percentage >= 40) {
        performanceBadge.textContent = "Apprenti Décodeur";
        performanceBadge.className = "performance-badge average";
    } else {
        performanceBadge.textContent = "Continue à apprendre !";
        performanceBadge.className = "performance-badge needs-work";
    }

    // Build summary using safe DOM methods
    while (summaryList.firstChild) {
        summaryList.removeChild(summaryList.firstChild);
    }

    questionsResults.forEach((result, index) => {
        const item = document.createElement('div');
        item.className = "summary-item" + (result.correct ? '' : ' incorrect');

        const answerSpan = document.createElement('span');
        answerSpan.className = 'summary-answer';
        answerSpan.textContent = result.answer;

        const pointsSpan = document.createElement('span');
        pointsSpan.className = 'summary-points';
        const pointsText = result.correct ? '+' + result.points : '0';
        const hintsText = result.hintsUsed > 1 ? 's' : '';
        pointsSpan.textContent = pointsText + " pts (" + result.hintsUsed + " indice" + hintsText + ")";

        item.appendChild(answerSpan);
        item.appendChild(pointsSpan);
        summaryList.appendChild(item);
    });
}

// Event Listeners
startBtn.addEventListener('click', startGame);

nextHintBtn.addEventListener('click', () => {
    if (currentHintIndex < 3) {
        revealHint(currentHintIndex + 1);
    }
});

submitGuessBtn.addEventListener('click', checkAnswer);

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

nextQuestionBtn.addEventListener('click', nextQuestion);

restartBtn.addEventListener('click', () => {
    showScreen(startScreen);
});

// Allow giving up by pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gameScreen.classList.contains('active') && !answerReveal.classList.contains('hidden') === false) {
        // Only if answer reveal is not showing, pressing escape gives up
        if (answerReveal.classList.contains('hidden')) {
            giveUp();
        }
    }
});
