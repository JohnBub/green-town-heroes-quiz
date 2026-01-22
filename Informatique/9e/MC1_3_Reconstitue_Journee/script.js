// Digital traces data for Lucas
const traces = [
    {
        time: "07h15",
        type: "🔍 Recherche Google",
        detail: "\"meteo Lausanne\""
    },
    {
        time: "08h20",
        type: "📍 Position GPS",
        detail: "Ecole de Montchoisi, Lausanne"
    },
    {
        time: "12h05",
        type: "💳 Achat Twint",
        detail: "Boulangerie \"Le Pain Dore\" - CHF 4.50"
    },
    {
        time: "16h30",
        type: "📸 Photo Instagram",
        detail: "Selfie sur un terrain de football avec des amis"
    },
    {
        time: "20h00",
        type: "📺 Connexion Netflix",
        detail: "Visionnage de la serie \"Stranger Things\""
    },
    {
        time: "22h30",
        type: "💬 Derniere activite WhatsApp",
        detail: "Message envoye a \"Maman\""
    }
];

// Questions about Lucas based on his traces
const questions = [
    {
        text: "Ou habite Lucas approximativement ?",
        options: [
            "A Geneve",
            "Pres de Lausanne",
            "A Zurich",
            "A Berne"
        ],
        correct: 1,
        explanation: "La recherche meteo \"Lausanne\" a 7h15 + l'ecole a Lausanne indiquent qu'il habite dans cette region."
    },
    {
        text: "Quel est probablement le hobby de Lucas ?",
        options: [
            "Le basket",
            "Les jeux video",
            "Le football",
            "La natation"
        ],
        correct: 2,
        explanation: "Sa photo Instagram a 16h30 le montre sur un terrain de football avec des amis."
    },
    {
        text: "A quelle heure Lucas se couche-t-il probablement ?",
        options: [
            "Vers 20h00",
            "Vers 21h00",
            "Vers 22h30",
            "Apres minuit"
        ],
        correct: 2,
        explanation: "Son dernier message WhatsApp est a 22h30, ce qui suggere qu'il se couche peu apres."
    },
    {
        text: "Qu'a fait Lucas pendant sa pause de midi ?",
        options: [
            "Il est rentre chez lui",
            "Il a mange a la cantine",
            "Il a achete quelque chose a la boulangerie",
            "Il n'a rien mange"
        ],
        correct: 2,
        explanation: "L'achat Twint de CHF 4.50 a la boulangerie \"Le Pain Dore\" a 12h05 montre qu'il y a achete son repas."
    }
];

// Game state
let currentQuestion = 0;
let score = 0;
let answered = false;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');

const phaseTimeline = document.getElementById('phase-timeline');
const phaseQuestions = document.getElementById('phase-questions');

const startBtn = document.getElementById('start-btn');
const continueBtn = document.getElementById('continue-btn');
const restartBtn = document.getElementById('restart-btn');

const tracesContainer = document.getElementById('traces-container');
const questionContainer = document.getElementById('question-container');
const progressFill = document.getElementById('progress-fill');
const currentQuestionEl = document.getElementById('current-question');
const scoreEl = document.getElementById('score');

const finalScoreValue = document.getElementById('final-score-value');
const scoreMessage = document.getElementById('score-message');

// Show screen
function showScreen(screen) {
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    screen.classList.add('active');
}

// Show phase
function showPhase(phase) {
    phaseTimeline.classList.remove('active');
    phaseQuestions.classList.remove('active');
    phase.classList.add('active');
}

// Initialize game
function initGame() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    showScreen(gameScreen);
    showPhase(phaseTimeline);
    loadTraces();
}

// Load traces with staggered animation
function loadTraces() {
    tracesContainer.textContent = '';

    traces.forEach((trace, index) => {
        const traceCard = document.createElement('div');
        traceCard.className = 'trace-card';
        traceCard.style.animationDelay = `${index * 0.1}s`;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'trace-time';
        timeSpan.textContent = trace.time;
        traceCard.appendChild(timeSpan);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'trace-content';

        const typeSpan = document.createElement('div');
        typeSpan.className = 'trace-type';
        typeSpan.textContent = trace.type;
        contentDiv.appendChild(typeSpan);

        const detailSpan = document.createElement('div');
        detailSpan.className = 'trace-detail';
        detailSpan.textContent = trace.detail;
        contentDiv.appendChild(detailSpan);

        traceCard.appendChild(contentDiv);
        tracesContainer.appendChild(traceCard);
    });
}

// Start questions phase
function startQuestions() {
    showPhase(phaseQuestions);
    updateUI();
    loadQuestion();
}

// Update UI
function updateUI() {
    currentQuestionEl.textContent = currentQuestion + 1;
    scoreEl.textContent = score;
    progressFill.style.width = `${(currentQuestion / questions.length) * 100}%`;
}

// Load current question
function loadQuestion() {
    const q = questions[currentQuestion];
    answered = false;

    questionContainer.textContent = '';

    // Question text
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = q.text;
    questionContainer.appendChild(questionText);

    // Options
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    q.options.forEach((opt, index) => {
        const optBtn = document.createElement('button');
        optBtn.className = 'option-btn';
        optBtn.textContent = opt;
        optBtn.addEventListener('click', () => selectAnswer(index, optBtn, optionsContainer));
        optionsContainer.appendChild(optBtn);
    });

    questionContainer.appendChild(optionsContainer);
}

// Select answer
function selectAnswer(index, button, container) {
    if (answered) return;
    answered = true;

    const q = questions[currentQuestion];
    const isCorrect = index === q.correct;

    // Disable all buttons and show results
    const buttons = container.querySelectorAll('.option-btn');
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) {
            btn.classList.add('correct');
        }
        if (i === index && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // Update score
    if (isCorrect) {
        score++;
        scoreEl.textContent = score;
    }

    // Show feedback
    const feedback = document.createElement('div');
    feedback.className = 'question-feedback ' + (isCorrect ? 'correct' : 'incorrect');

    const icon = document.createElement('div');
    icon.className = 'feedback-icon';
    icon.textContent = isCorrect ? '✅' : '❌';
    feedback.appendChild(icon);

    const text = document.createElement('p');
    text.textContent = q.explanation;
    feedback.appendChild(text);

    questionContainer.appendChild(feedback);

    // Add next button
    const nextContainer = document.createElement('div');
    nextContainer.className = 'next-btn-container';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = currentQuestion < questions.length - 1 ? 'Question suivante' : 'Voir les resultats';
    nextBtn.addEventListener('click', nextQuestion);
    nextContainer.appendChild(nextBtn);

    questionContainer.appendChild(nextContainer);
}

// Next question
function nextQuestion() {
    currentQuestion++;

    if (currentQuestion >= questions.length) {
        showResults();
    } else {
        updateUI();
        loadQuestion();
    }
}

// Show results
function showResults() {
    finalScoreValue.textContent = score;
    progressFill.style.width = '100%';

    const percentage = (score / questions.length) * 100;

    if (percentage === 100) {
        scoreMessage.textContent = 'Parfait ! Tu as tout compris sur les traces numeriques de Lucas !';
    } else if (percentage >= 75) {
        scoreMessage.textContent = 'Excellent ! Tu sais bien analyser les traces numeriques.';
    } else if (percentage >= 50) {
        scoreMessage.textContent = 'Pas mal ! Continue a t\'entrainer.';
    } else {
        scoreMessage.textContent = 'Relis les traces attentivement et reessaie !';
    }

    showScreen(resultsScreen);
}

// Event listeners
startBtn.addEventListener('click', initGame);
continueBtn.addEventListener('click', startQuestions);
restartBtn.addEventListener('click', initGame);
