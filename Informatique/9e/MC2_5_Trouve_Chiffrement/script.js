// Scenarios data
const scenarios = [
    {
        id: 1,
        icon: "💳",
        text: "Payer avec ta carte bancaire au magasin",
        encrypted: true,
        answer: "yes",
        explanation: "La puce de ta carte chiffre les données de paiement! Chaque transaction est protégée par un chiffrement unique."
    },
    {
        id: 2,
        icon: "📱",
        text: "Envoyer un SMS classique",
        encrypted: false,
        answer: "no",
        explanation: "Les SMS traditionnels ne sont pas chiffrés. Utilise une app de messagerie sécurisée comme Signal ou WhatsApp!"
    },
    {
        id: 3,
        icon: "💬",
        text: "Utiliser WhatsApp pour envoyer un message",
        encrypted: true,
        answer: "yes",
        explanation: "WhatsApp utilise le chiffrement de bout en bout! Seuls toi et ton destinataire pouvez lire les messages."
    },
    {
        id: 4,
        icon: "🌐",
        text: "Regarder un site web commençant par HTTP (sans S)",
        encrypted: false,
        answer: "no",
        explanation: "Sans le 'S' de HTTPS, pas de chiffrement. Attention aux données sensibles sur ces sites!"
    },
    {
        id: 5,
        icon: "📶",
        text: "Te connecter au WiFi de l'école",
        encrypted: true,
        answer: "yes",
        explanation: "Le WiFi WPA2/WPA3 chiffre les communications! C'est pourquoi tu as besoin d'un mot de passe."
    },
    {
        id: 6,
        icon: "✉️",
        text: "Envoyer une carte postale par la poste",
        encrypted: false,
        answer: "no",
        explanation: "Tout le monde peut lire une carte postale! C'est comme un message non chiffré - visible par tous."
    },
    {
        id: 7,
        icon: "👆",
        text: "Utiliser Touch ID ou Face ID sur ton téléphone",
        encrypted: true,
        answer: "yes",
        explanation: "Tes données biométriques sont chiffrées et stockées dans une puce sécurisée de ton appareil!"
    },
    {
        id: 8,
        icon: "📞",
        text: "Parler au téléphone (appel vocal classique)",
        encrypted: "partial",
        answer: "partial",
        explanation: "Les appels mobiles ont un chiffrement basique entre ton téléphone et l'antenne, mais pas de bout en bout. Utilise des appels via Signal pour plus de sécurité!"
    },
    {
        id: 9,
        icon: "🔒",
        text: "Acheter sur un site avec le cadenas vert (HTTPS)",
        encrypted: true,
        answer: "yes",
        explanation: "Le cadenas signifie que la connexion est chiffrée avec TLS/SSL! Tes données de paiement sont protégées."
    },
    {
        id: 10,
        icon: "📸",
        text: "Poster une photo publique sur Instagram",
        encrypted: false,
        answer: "no",
        explanation: "Une publication publique n'est pas chiffrée - tout le monde peut la voir! Le chiffrement protège les données, pas la visibilité."
    }
];

// Game state
let currentQuestion = 0;
let score = 0;
let answers = [];

// DOM elements
const scenarioIcon = document.getElementById('scenario-icon');
const scenarioText = document.getElementById('scenario-text');
const btnEncrypted = document.getElementById('btn-encrypted');
const btnNotEncrypted = document.getElementById('btn-not-encrypted');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackResult = document.getElementById('feedback-result');
const feedbackExplanation = document.getElementById('feedback-explanation');
const btnNext = document.getElementById('btn-next');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const scoreDisplay = document.getElementById('score');
const resultsScreen = document.getElementById('results-screen');
const finalScore = document.getElementById('final-score');
const dailyEncryption = document.getElementById('daily-encryption');
const answersList = document.getElementById('answers-list');
const btnRestart = document.getElementById('btn-restart');
const buttonsContainer = document.getElementById('buttons-container');
const questionPrompt = document.getElementById('question-prompt');

// Initialize game
function initGame() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    shuffleArray(scenarios);
    updateDisplay();
    resultsScreen.classList.add('hidden');
    feedbackContainer.classList.add('hidden');
    buttonsContainer.classList.remove('hidden');
    questionPrompt.classList.remove('hidden');
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Update display
function updateDisplay() {
    const scenario = scenarios[currentQuestion];

    scenarioIcon.textContent = scenario.icon;
    scenarioText.textContent = scenario.text;

    progressFill.style.width = `${((currentQuestion + 1) / scenarios.length) * 100}%`;
    progressText.textContent = `Question ${currentQuestion + 1}/${scenarios.length}`;
    scoreDisplay.textContent = `Score: ${score}`;

    btnEncrypted.disabled = false;
    btnNotEncrypted.disabled = false;
    feedbackContainer.classList.add('hidden');
    buttonsContainer.classList.remove('hidden');
    questionPrompt.classList.remove('hidden');
}

// Handle answer
function handleAnswer(userAnswer) {
    const scenario = scenarios[currentQuestion];
    let isCorrect = false;

    // Determine if answer is correct
    if (scenario.answer === "partial") {
        // For partial encryption, accept either answer but give feedback
        isCorrect = true; // Give point for understanding complexity
    } else if (scenario.answer === "yes" && userAnswer === "encrypted") {
        isCorrect = true;
    } else if (scenario.answer === "no" && userAnswer === "not-encrypted") {
        isCorrect = true;
    }

    // Store answer
    answers.push({
        scenario: scenario,
        userAnswer: userAnswer,
        correct: isCorrect
    });

    // Update score
    if (isCorrect) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Show feedback
    showFeedback(scenario, isCorrect);

    // Disable buttons
    btnEncrypted.disabled = true;
    btnNotEncrypted.disabled = true;
}

// Show feedback
function showFeedback(scenario, isCorrect) {
    feedbackContainer.classList.remove('hidden', 'correct', 'incorrect');
    buttonsContainer.classList.add('hidden');
    questionPrompt.classList.add('hidden');

    if (isCorrect) {
        feedbackContainer.classList.add('correct');
        feedbackIcon.textContent = "✅";
        if (scenario.answer === "partial") {
            feedbackResult.textContent = "Bonne réflexion!";
        } else {
            feedbackResult.textContent = "Correct!";
        }
    } else {
        feedbackContainer.classList.add('incorrect');
        feedbackIcon.textContent = "❌";
        feedbackResult.textContent = "Pas tout à fait...";
    }

    // Add encryption badge to explanation
    let badge = '';
    if (scenario.encrypted === true) {
        badge = '<span class="encryption-badge encrypted">🔒 Chiffré</span>';
    } else if (scenario.encrypted === false) {
        badge = '<span class="encryption-badge not-encrypted">🔓 Non chiffré</span>';
    } else {
        badge = '<span class="encryption-badge partial">⚠️ Partiellement</span>';
    }

    feedbackExplanation.innerHTML = scenario.explanation + '<br>' + badge;

    // Update next button text
    if (currentQuestion >= scenarios.length - 1) {
        btnNext.textContent = "Voir les résultats →";
    } else {
        btnNext.textContent = "Suivant →";
    }
}

// Next question
function nextQuestion() {
    currentQuestion++;

    if (currentQuestion >= scenarios.length) {
        showResults();
    } else {
        updateDisplay();
    }
}

// Show results
function showResults() {
    resultsScreen.classList.remove('hidden');

    // Calculate percentage
    const percentage = Math.round((score / scenarios.length) * 100);

    // Determine grade emoji
    let gradeEmoji = '';
    if (percentage >= 90) gradeEmoji = '🏆';
    else if (percentage >= 70) gradeEmoji = '⭐';
    else if (percentage >= 50) gradeEmoji = '👍';
    else gradeEmoji = '📚';

    finalScore.innerHTML = `${gradeEmoji} ${score}/${scenarios.length}<br><span style="font-size: 1.2rem; color: #a0a0a0;">${percentage}% de bonnes réponses</span>`;

    // Count encrypted scenarios
    const encryptedCount = scenarios.filter(s => s.encrypted === true).length;
    dailyEncryption.innerHTML = `Tu utilises le chiffrement environ <strong>${encryptedCount} fois</strong> dans ces situations quotidiennes sans même y penser!<br><br>Le chiffrement te protège silencieusement chaque jour.`;

    // Build answers list
    answersList.innerHTML = '';
    answers.forEach(answer => {
        const li = document.createElement('li');
        li.className = answer.correct ? 'correct-answer' : 'incorrect-answer';

        const icon = answer.correct ? '✓' : '✗';
        const encIcon = answer.scenario.encrypted === true ? '🔒' :
                       (answer.scenario.encrypted === false ? '🔓' : '⚠️');

        li.innerHTML = `
            <span class="answer-icon">${icon}</span>
            <span>${answer.scenario.icon} ${answer.scenario.text}</span>
            <span style="margin-left: auto;">${encIcon}</span>
        `;

        answersList.appendChild(li);
    });
}

// Event listeners
btnEncrypted.addEventListener('click', () => handleAnswer('encrypted'));
btnNotEncrypted.addEventListener('click', () => handleAnswer('not-encrypted'));
btnNext.addEventListener('click', nextQuestion);
btnRestart.addEventListener('click', initGame);

// Start game
initGame();
