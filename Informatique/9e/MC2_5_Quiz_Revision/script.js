// Quiz Questions Data
const questions = [
    // History (MC2_1) - Questions 1-3
    {
        id: 1,
        category: "Histoire (MC2_1)",
        question: "Qui a invente le code Cesar?",
        options: ["Jules Cesar", "Napoleon", "Alexandre", "Marc-Aurele"],
        correctIndex: 0,
        explanation: "Le code Cesar tient son nom de Jules Cesar qui l'utilisait pour ses communications militaires secretes dans l'Antiquite romaine."
    },
    {
        id: 2,
        category: "Histoire (MC2_1)",
        question: "En quelle periode la machine Enigma a-t-elle ete utilisee?",
        options: ["Moyen Age", "Renaissance", "Seconde Guerre mondiale", "Antiquite"],
        correctIndex: 2,
        explanation: "La machine Enigma a ete utilisee par l'Allemagne nazie pendant la Seconde Guerre mondiale (1939-1945) pour chiffrer leurs communications militaires."
    },
    {
        id: 3,
        category: "Histoire (MC2_1)",
        question: "Qui a reussi a casser le code Enigma?",
        options: ["Einstein", "Newton", "Alan Turing", "Da Vinci"],
        correctIndex: 2,
        explanation: "Alan Turing, mathematicien britannique, a dirige l'equipe qui a casse le code Enigma a Bletchley Park, contribuant significativement a la victoire des Allies."
    },
    // César Cipher (MC2_2 & MC2_3) - Questions 4-6
    {
        id: 4,
        category: "Code Cesar (MC2_2)",
        question: "Avec un decalage de +3, que devient la lettre A?",
        options: ["B", "C", "D", "E"],
        correctIndex: 2,
        explanation: "Avec un decalage de +3, A devient D (A+1=B, B+1=C, C+1=D). C'est le decalage classique utilise par Jules Cesar."
    },
    {
        id: 5,
        category: "Code Cesar (MC2_3)",
        question: "Que signifie 'ERQMRXU' decode avec un decalage de -3?",
        options: ["BONSOIR", "BONJOUR", "MERCI", "SALUT"],
        correctIndex: 1,
        explanation: "En decalant chaque lettre de -3: E devient B, R devient O, Q devient N, M devient J, R devient O, X devient U, U devient R = BONJOUR"
    },
    {
        id: 6,
        category: "Code Cesar (MC2_2)",
        question: "Combien y a-t-il de decalages possibles dans le code Cesar?",
        options: ["10", "26", "52", "100"],
        correctIndex: 1,
        explanation: "Il y a 26 decalages possibles, correspondant aux 26 lettres de l'alphabet. Un decalage de 26 revient a la lettre d'origine."
    },
    // Polybius Square (MC2_4) - Questions 7-8
    {
        id: 7,
        category: "Carre de Polybe (MC2_4)",
        question: "Dans le carre de Polybe standard, quelle lettre correspond a '23'?",
        options: ["G", "H", "I", "J"],
        correctIndex: 1,
        explanation: "Dans le carre de Polybe, '23' signifie ligne 2, colonne 3. En comptant: ligne 2 = F,G,H,I/J,K et colonne 3 = H."
    },
    {
        id: 8,
        category: "Carre de Polybe (MC2_4)",
        question: "Pourquoi le carre de Polybe n'a que 25 cases?",
        options: ["Erreur historique", "I et J sont combines", "Le Z n'existe pas", "Pour faire 5x5"],
        correctIndex: 1,
        explanation: "Le carre de Polybe combine I et J dans la meme case pour obtenir 25 lettres qui s'arrangent parfaitement dans une grille 5x5."
    },
    // Modern Encryption (MC2_5) - Questions 9-10
    {
        id: 9,
        category: "Chiffrement moderne (MC2_5)",
        question: "Quel est l'equivalent moderne du code Cesar?",
        options: ["Email", "AES/chiffrement moderne", "SMS", "WiFi"],
        correctIndex: 1,
        explanation: "L'AES (Advanced Encryption Standard) est l'equivalent moderne du code Cesar, utilisant des algorithmes mathematiques complexes au lieu de simples decalages."
    },
    {
        id: 10,
        category: "Chiffrement moderne (MC2_5)",
        question: "Que signifie 'chiffrement de bout en bout'?",
        options: [
            "Chiffre du debut a la fin du message",
            "Seuls expediteur et destinataire peuvent lire",
            "Utilise les deux bouts du clavier",
            "Double chiffrement"
        ],
        correctIndex: 1,
        explanation: "Le chiffrement de bout en bout (E2E) garantit que seuls l'expediteur et le destinataire peuvent lire les messages, meme le fournisseur de service ne peut pas y acceder."
    },
    // Additional Questions - 11-15
    {
        id: 11,
        category: "Code Cesar (MC2_2)",
        question: "Quel est le principal defaut du code Cesar?",
        options: [
            "Il est trop lent",
            "Il n'y a que 26 possibilites a tester",
            "Il ne fonctionne pas avec les chiffres",
            "Il necessite un ordinateur"
        ],
        correctIndex: 1,
        explanation: "Le code Cesar est facile a casser car il n'y a que 26 decalages possibles. On peut tous les tester rapidement (attaque par force brute)."
    },
    {
        id: 12,
        category: "Carre de Polybe (MC2_4)",
        question: "Quel est l'avantage du carre de Polybe par rapport au code Cesar?",
        options: [
            "Il est plus rapide",
            "Chaque lettre devient deux chiffres",
            "Il utilise des couleurs",
            "Il ne necessite pas de cle"
        ],
        correctIndex: 1,
        explanation: "Le carre de Polybe transforme chaque lettre en deux chiffres (coordonnees), ce qui permet de transmettre des messages par des signaux simples (lumieres, sons)."
    },
    {
        id: 13,
        category: "Chiffrement moderne (MC2_5)",
        question: "Quelle application utilise le chiffrement de bout en bout?",
        options: ["SMS classique", "WhatsApp", "Email standard", "Page web HTTP"],
        correctIndex: 1,
        explanation: "WhatsApp utilise le chiffrement de bout en bout par defaut pour proteger la confidentialite des messages entre utilisateurs."
    },
    {
        id: 14,
        category: "Histoire (MC2_1)",
        question: "Quel etait l'objectif principal du chiffrement dans l'histoire?",
        options: [
            "Divertir les gens",
            "Proteger les secrets militaires",
            "Creer des puzzles",
            "Decorer les documents"
        ],
        correctIndex: 1,
        explanation: "Historiquement, le chiffrement a ete developpe principalement pour proteger les communications militaires et les secrets d'Etat."
    },
    {
        id: 15,
        category: "Chiffrement moderne (MC2_5)",
        question: "Que represente le 'S' dans HTTPS?",
        options: ["Speed (vitesse)", "Secure (securise)", "Simple", "Standard"],
        correctIndex: 1,
        explanation: "HTTPS signifie 'HyperText Transfer Protocol Secure'. Le 'S' indique que la connexion est chiffree et securisee grace au protocole TLS/SSL."
    }
];

// Game State
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let quizStarted = false;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const reviewScreen = document.getElementById('review-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const reviewBtn = document.getElementById('review-btn');
const restartBtn = document.getElementById('restart-btn');
const backToResultsBtn = document.getElementById('back-to-results');

const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const currentScoreEl = document.getElementById('current-score');
const categoryBadge = document.getElementById('category-badge');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackBox = document.getElementById('feedback-box');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackText = document.getElementById('feedback-text');
const explanationText = document.getElementById('explanation-text');

const scoreNumber = document.getElementById('score-number');
const gradeLetter = document.getElementById('grade-letter');
const gradeMessage = document.getElementById('grade-message');
const correctCount = document.getElementById('correct-count');
const incorrectCount = document.getElementById('incorrect-count');
const percentage = document.getElementById('percentage');
const reviewContainer = document.getElementById('review-container');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
reviewBtn.addEventListener('click', showReview);
restartBtn.addEventListener('click', restartQuiz);
backToResultsBtn.addEventListener('click', showResults);

// Functions
function showScreen(screen) {
    [startScreen, quizScreen, resultsScreen, reviewScreen].forEach(s => {
        s.classList.remove('active');
    });
    screen.classList.add('active');
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    quizStarted = true;
    currentScoreEl.textContent = '0';
    showScreen(quizScreen);
    loadQuestion();
}

function createOptionButton(option, index, letters) {
    const btn = document.createElement('button');
    btn.className = 'option-btn';

    const letterSpan = document.createElement('span');
    letterSpan.className = 'option-letter';
    letterSpan.textContent = letters[index];

    const textSpan = document.createElement('span');
    textSpan.className = 'option-text';
    textSpan.textContent = option;

    btn.appendChild(letterSpan);
    btn.appendChild(textSpan);
    btn.addEventListener('click', () => selectAnswer(index));

    return btn;
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];

    // Update progress
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressFill.style.width = progressPercent + '%';
    progressText.textContent = (currentQuestionIndex + 1) + '/' + questions.length;

    // Reset UI
    feedbackBox.classList.add('hidden');
    nextBtn.classList.add('hidden');

    // Load question content
    categoryBadge.textContent = question.category;
    questionText.textContent = question.question;

    // Load options
    optionsContainer.textContent = '';
    const letters = ['A', 'B', 'C', 'D'];

    question.options.forEach((option, index) => {
        const btn = createOptionButton(option, index, letters);
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctIndex;
    const optionBtns = optionsContainer.querySelectorAll('.option-btn');

    // Disable all options
    optionBtns.forEach(btn => btn.classList.add('disabled'));

    // Mark selected answer
    optionBtns[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');

    // Show correct answer if wrong
    if (!isCorrect) {
        optionBtns[question.correctIndex].classList.add('correct');
    }

    // Update score
    if (isCorrect) {
        score++;
        currentScoreEl.textContent = score;
    }

    // Save answer
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        selectedIndex: selectedIndex,
        isCorrect: isCorrect
    });

    // Show feedback
    showFeedback(isCorrect, question.explanation);

    // Show next button
    nextBtn.classList.remove('hidden');

    // Change button text for last question
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = 'Voir les Resultats';
    } else {
        nextBtn.textContent = 'Question Suivante';
    }
}

function showFeedback(isCorrect, explanation) {
    feedbackBox.classList.remove('hidden');

    feedbackIcon.className = 'feedback-icon ' + (isCorrect ? 'correct' : 'incorrect');
    feedbackIcon.textContent = isCorrect ? '\u2713' : '\u2717';

    feedbackText.className = 'feedback-text ' + (isCorrect ? 'correct' : 'incorrect');
    feedbackText.textContent = isCorrect ? 'Correct!' : 'Incorrect';

    explanationText.textContent = explanation;
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        showResults();
    } else {
        loadQuestion();
    }
}

function showResults() {
    showScreen(resultsScreen);

    const totalQuestions = questions.length;
    const percentScore = Math.round((score / totalQuestions) * 100);

    // Update score display
    scoreNumber.textContent = score;
    correctCount.textContent = score;
    incorrectCount.textContent = totalQuestions - score;
    percentage.textContent = percentScore + '%';

    // Calculate grade
    let grade, message, gradeClass;
    if (percentScore >= 90) {
        grade = 'A';
        message = 'Excellent! Tu maitrises parfaitement le chiffrement!';
        gradeClass = 'grade-a';
    } else if (percentScore >= 80) {
        grade = 'B';
        message = 'Tres bien! Tu as une bonne comprehension du sujet.';
        gradeClass = 'grade-b';
    } else if (percentScore >= 70) {
        grade = 'C';
        message = 'Bien! Continue a reviser pour t\'ameliorer.';
        gradeClass = 'grade-c';
    } else if (percentScore >= 60) {
        grade = 'D';
        message = 'Passable. Revois les concepts de base.';
        gradeClass = 'grade-d';
    } else {
        grade = 'F';
        message = 'A reviser. Reprends le module depuis le debut.';
        gradeClass = 'grade-f';
    }

    gradeLetter.textContent = grade;
    gradeLetter.className = gradeClass;
    gradeMessage.textContent = message;
}

function createReviewItem(question, index, userAnswer, letters) {
    const isCorrect = userAnswer ? userAnswer.isCorrect : false;

    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item ' + (isCorrect ? 'correct' : 'incorrect');

    // Header
    const header = document.createElement('div');
    header.className = 'review-item-header';

    const questionNumber = document.createElement('span');
    questionNumber.className = 'review-question-number';
    questionNumber.textContent = 'Question ' + (index + 1);

    const categorySpan = document.createElement('span');
    categorySpan.className = 'review-category';
    categorySpan.textContent = question.category;

    header.appendChild(questionNumber);
    header.appendChild(categorySpan);
    reviewItem.appendChild(header);

    // Question text
    const questionP = document.createElement('p');
    questionP.className = 'review-question';
    questionP.textContent = question.question;
    reviewItem.appendChild(questionP);

    // Answers
    const answersDiv = document.createElement('div');
    answersDiv.className = 'review-answers';

    question.options.forEach((option, optIndex) => {
        let answerClass = '';
        if (userAnswer && optIndex === userAnswer.selectedIndex) {
            answerClass = userAnswer.isCorrect ? 'user-correct' : 'user-incorrect';
        } else if (optIndex === question.correctIndex && userAnswer && !userAnswer.isCorrect) {
            answerClass = 'correct-answer';
        }

        if (answerClass) {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'review-answer ' + answerClass;
            answerDiv.textContent = letters[optIndex] + '. ' + option;
            answersDiv.appendChild(answerDiv);
        }
    });

    reviewItem.appendChild(answersDiv);

    // Explanation
    const explanationP = document.createElement('p');
    explanationP.className = 'review-explanation';

    const strongEl = document.createElement('strong');
    strongEl.textContent = 'Explication: ';
    explanationP.appendChild(strongEl);
    explanationP.appendChild(document.createTextNode(question.explanation));

    reviewItem.appendChild(explanationP);

    return reviewItem;
}

function showReview() {
    showScreen(reviewScreen);

    reviewContainer.textContent = '';
    const letters = ['A', 'B', 'C', 'D'];

    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const reviewItem = createReviewItem(question, index, userAnswer, letters);
        reviewContainer.appendChild(reviewItem);
    });
}

function restartQuiz() {
    startQuiz();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!quizStarted) return;

    const key = e.key.toUpperCase();
    const optionBtns = optionsContainer.querySelectorAll('.option-btn:not(.disabled)');

    if (optionBtns.length === 0) {
        // If options are disabled, check for Enter to go next
        if (e.key === 'Enter' && !nextBtn.classList.contains('hidden')) {
            nextQuestion();
        }
        return;
    }

    const keyMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, '1': 0, '2': 1, '3': 2, '4': 3 };

    if (key in keyMap && keyMap[key] < optionBtns.length) {
        optionBtns[keyMap[key]].click();
    }
});
