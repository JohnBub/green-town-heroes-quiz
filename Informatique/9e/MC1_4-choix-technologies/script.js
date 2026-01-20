// Variables globales
let currentQuestionIndex = 1;
const totalQuestions = 6;
let score = 0;
let answered = false;

// Sélection des éléments
const questionCards = document.querySelectorAll('.question-card');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const finalResult = document.getElementById('finalResult');
const currentQuestionSpan = document.getElementById('currentQuestion');
const progressFill = document.getElementById('progressFill');
const finalScoreSpan = document.getElementById('finalScore');
const finalMessage = document.getElementById('finalMessage');

// Initialisation
function init() {
    // Événements pour les boutons de choix
    questionCards.forEach(card => {
        const choices = card.querySelectorAll('.choice-btn');
        choices.forEach(choice => {
            choice.addEventListener('click', () => handleAnswer(card, choice));
        });
    });

    // Événement pour le bouton "Suivant"
    nextBtn.addEventListener('click', nextQuestion);

    // Événement pour le bouton "Recommencer"
    restartBtn.addEventListener('click', restartQuiz);

    // Mettre à jour la barre de progression
    updateProgress();
}

// Gestion de la réponse
function handleAnswer(card, selectedChoice) {
    // Empêcher de répondre deux fois
    if (answered) return;

    answered = true;

    const correctAnswer = card.getAttribute('data-answer');
    const selectedTech = selectedChoice.getAttribute('data-tech');
    const feedback = card.querySelector('.feedback');
    const explanation = card.querySelector('.explanation');
    const choices = card.querySelectorAll('.choice-btn');

    // Désactiver tous les boutons
    choices.forEach(btn => btn.classList.add('disabled'));

    // Vérifier la réponse
    if (selectedTech === correctAnswer) {
        // Correct !
        selectedChoice.classList.add('correct');
        feedback.textContent = '✅ Bravo !';
        feedback.classList.add('success');
        explanation.classList.add('show');
        score++;
    } else {
        // Incorrect
        selectedChoice.classList.add('incorrect');
        feedback.textContent = '❌ Oups, essaie de comprendre pourquoi...';
        feedback.classList.add('error');

        // Montrer la bonne réponse
        choices.forEach(btn => {
            if (btn.getAttribute('data-tech') === correctAnswer) {
                btn.classList.add('correct');
            }
        });

        explanation.classList.add('show');
    }

    // Afficher le bouton "Suivant" ou "Terminer"
    setTimeout(() => {
        nextBtn.style.display = 'block';
        if (currentQuestionIndex === totalQuestions) {
            nextBtn.textContent = '🎉 Voir le résultat';
        }
    }, 1000);
}

// Passer à la question suivante
function nextQuestion() {
    if (currentQuestionIndex < totalQuestions) {
        // Cacher la question actuelle
        questionCards[currentQuestionIndex - 1].classList.remove('active');

        // Afficher la question suivante
        currentQuestionIndex++;
        questionCards[currentQuestionIndex - 1].classList.add('active');

        // Réinitialiser l'état
        answered = false;
        nextBtn.style.display = 'none';

        // Mettre à jour l'affichage
        currentQuestionSpan.textContent = currentQuestionIndex;
        updateProgress();
    } else {
        // Afficher le résultat final
        showFinalResult();
    }
}

// Mettre à jour la barre de progression
function updateProgress() {
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    progressFill.style.width = `${progress}%`;
}

// Afficher le résultat final
function showFinalResult() {
    // Cacher la dernière question et le bouton suivant
    questionCards[currentQuestionIndex - 1].classList.remove('active');
    nextBtn.style.display = 'none';

    // Afficher le score
    finalScoreSpan.textContent = score;

    // Message personnalisé selon le score
    let message = '';
    if (score === 6) {
        message = '🌟 Parfait ! Tu maîtrises parfaitement les technologies ! 🌟';
    } else if (score >= 4) {
        message = '👏 Très bien ! Tu comprends bien quand utiliser chaque technologie !';
    } else if (score >= 2) {
        message = '👍 Pas mal ! Continue à apprendre les différences entre les technologies !';
    } else {
        message = '💪 Continue à t\'entraîner ! Chaque technologie a son usage spécifique !';
    }
    finalMessage.textContent = message;

    // Afficher le résultat
    finalResult.classList.add('show');
    restartBtn.style.display = 'block';
}

// Recommencer le quiz
function restartQuiz() {
    // Réinitialiser les variables
    currentQuestionIndex = 1;
    score = 0;
    answered = false;

    // Cacher le résultat
    finalResult.classList.remove('show');
    restartBtn.style.display = 'none';

    // Réinitialiser toutes les questions
    questionCards.forEach((card, index) => {
        card.classList.remove('active');

        const choices = card.querySelectorAll('.choice-btn');
        choices.forEach(btn => {
            btn.classList.remove('correct', 'incorrect', 'disabled');
        });

        const feedback = card.querySelector('.feedback');
        feedback.textContent = '';
        feedback.classList.remove('success', 'error');

        const explanation = card.querySelector('.explanation');
        explanation.classList.remove('show');
    });

    // Afficher la première question
    questionCards[0].classList.add('active');
    currentQuestionSpan.textContent = '1';
    updateProgress();
}

// Lancer le jeu au chargement de la page
init();
