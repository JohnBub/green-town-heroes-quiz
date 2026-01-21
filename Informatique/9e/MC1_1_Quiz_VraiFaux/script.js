// Quiz Data
const quizData = [
    {
        question: "Quand j'envoie une photo par Internet, elle va directement sur le téléphone de mon ami",
        correctAnswer: false,
        explanation: "La photo passe d'abord par des serveurs avant d'arriver chez ton ami."
    },
    {
        question: "Un serveur est un gros ordinateur qui stocke des informations",
        correctAnswer: true,
        explanation: "Exactement ! Les serveurs conservent et distribuent les données sur Internet."
    },
    {
        question: "Personne ne peut voir les photos que j'envoie sur Internet",
        correctAnswer: false,
        explanation: "Les photos peuvent être interceptées ou vues par d'autres personnes sur les serveurs."
    },
    {
        question: "L'interception, c'est quand quelqu'un récupère une information qui ne lui est pas destinée",
        correctAnswer: true,
        explanation: "Correct ! C'est pour ça qu'il faut être prudent avec ce qu'on partage."
    },
    {
        question: "Si j'envoie un message à un ami, il n'existe qu'une seule copie de ce message",
        correctAnswer: false,
        explanation: "Il peut y avoir plusieurs copies stockées sur différents serveurs."
    }
];

// State
let currentQuestion = 0;
let score = 0;
let answered = false;

// DOM Elements
const questionCounter = document.getElementById('questionCounter');
const progressFill = document.getElementById('progressFill');
const questionText = document.getElementById('questionText');
const btnVrai = document.getElementById('btnVrai');
const btnFaux = document.getElementById('btnFaux');
const feedbackContainer = document.getElementById('feedbackContainer');
const feedbackEmoji = document.getElementById('feedbackEmoji');
const feedbackText = document.getElementById('feedbackText');
const nextBtn = document.getElementById('nextBtn');
const questionContainer = document.getElementById('questionContainer');
const resultsContainer = document.getElementById('resultsContainer');
const resultsEmoji = document.getElementById('resultsEmoji');
const resultsScore = document.getElementById('resultsScore');
const resultsMessage = document.getElementById('resultsMessage');
const restartBtn = document.getElementById('restartBtn');

// Initialize Quiz
function initQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    questionContainer.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    loadQuestion();
}

// Load Question
function loadQuestion() {
    answered = false;
    const question = quizData[currentQuestion];

    // Update counter and progress
    questionCounter.textContent = `Question ${currentQuestion + 1} / ${quizData.length}`;
    progressFill.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;

    // Update question text
    questionText.textContent = question.question;

    // Reset buttons
    btnVrai.classList.remove('selected-correct', 'selected-wrong');
    btnFaux.classList.remove('selected-correct', 'selected-wrong');
    btnVrai.disabled = false;
    btnFaux.disabled = false;

    // Hide feedback and next button
    feedbackContainer.classList.remove('show');
    nextBtn.classList.add('hidden');
}

// Handle Answer
function handleAnswer(userAnswer) {
    if (answered) return;

    answered = true;
    const question = quizData[currentQuestion];
    const isCorrect = userAnswer === question.correctAnswer;

    // Update score
    if (isCorrect) {
        score++;
    }

    // Disable buttons
    btnVrai.disabled = true;
    btnFaux.disabled = true;

    // Highlight selected button
    const selectedBtn = userAnswer ? btnVrai : btnFaux;
    selectedBtn.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');

    // Show feedback
    feedbackEmoji.textContent = isCorrect ? '✅' : '❌';
    feedbackText.textContent = question.explanation;
    feedbackContainer.classList.add('show');

    // Show next button
    nextBtn.classList.remove('hidden');

    // Update next button text for last question
    if (currentQuestion === quizData.length - 1) {
        nextBtn.textContent = 'Voir les Résultats →';
    }
}

// Next Question
function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    questionContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');

    // Update score
    resultsScore.textContent = `${score} / ${quizData.length}`;

    // Determine message and emoji
    const percentage = (score / quizData.length) * 100;

    if (percentage === 100) {
        resultsEmoji.textContent = '🏆';
        resultsMessage.textContent = 'Parfait ! Tu maîtrises bien les risques des échanges d\'information sur Internet !';
    } else if (percentage >= 80) {
        resultsEmoji.textContent = '🎉';
        resultsMessage.textContent = 'Très bien ! Tu as de bonnes connaissances sur la sécurité Internet.';
    } else if (percentage >= 60) {
        resultsEmoji.textContent = '👍';
        resultsMessage.textContent = 'Bien joué ! Continue à apprendre sur la sécurité en ligne.';
    } else {
        resultsEmoji.textContent = '📚';
        resultsMessage.textContent = 'Continue tes efforts ! Réessaie pour mieux comprendre les risques sur Internet.';
    }
}

// Event Listeners
btnVrai.addEventListener('click', () => handleAnswer(true));
btnFaux.addEventListener('click', () => handleAnswer(false));
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', initQuiz);

// Start Quiz
initQuiz();
