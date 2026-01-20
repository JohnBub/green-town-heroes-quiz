// Variables globales
let currentPasswordIndex = 1;
const totalPasswords = 8;
let score = 0;
let answered = false;

// Sélection des éléments
const passwordCards = document.querySelectorAll('.password-card');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const finalResult = document.getElementById('finalResult');
const currentPasswordSpan = document.getElementById('currentPassword');
const scoreDisplay = document.getElementById('score');
const finalScoreSpan = document.getElementById('finalScore');
const finalMessage = document.getElementById('finalMessage');

// Initialisation
function init() {
    // Événements pour les boutons d'évaluation
    passwordCards.forEach(card => {
        const buttons = card.querySelectorAll('.eval-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => handleEvaluation(card, button));
        });
    });

    // Événement pour le bouton "Suivant"
    nextBtn.addEventListener('click', nextPassword);

    // Événement pour le bouton "Recommencer"
    restartBtn.addEventListener('click', restartQuiz);
}

// Gestion de l'évaluation
function handleEvaluation(card, selectedButton) {
    // Empêcher de répondre deux fois
    if (answered) return;

    answered = true;

    const correctAnswer = card.getAttribute('data-answer');
    const userChoice = selectedButton.getAttribute('data-choice');
    const feedback = card.querySelector('.feedback');
    const explanation = card.querySelector('.explanation');
    const buttons = card.querySelectorAll('.eval-btn');

    // Désactiver tous les boutons
    buttons.forEach(btn => btn.classList.add('disabled'));

    // Vérifier la réponse
    if (userChoice === correctAnswer) {
        // Correct !
        selectedButton.classList.add('correct');
        feedback.textContent = '✅ Bravo ! Bonne évaluation !';
        feedback.classList.add('success');
        explanation.classList.add('show');
        score++;
        updateScore();
    } else {
        // Incorrect
        selectedButton.classList.add('incorrect');
        feedback.textContent = '❌ Oups ! Lis l\'explication...';
        feedback.classList.add('error');

        // Montrer la bonne réponse
        buttons.forEach(btn => {
            if (btn.getAttribute('data-choice') === correctAnswer) {
                btn.classList.add('correct');
            }
        });

        explanation.classList.add('show');
    }

    // Afficher le bouton "Suivant" ou "Terminer"
    setTimeout(() => {
        nextBtn.style.display = 'block';
        if (currentPasswordIndex === totalPasswords) {
            nextBtn.textContent = '🎉 Voir le résultat';
        }
    }, 1000);
}

// Mettre à jour le score
function updateScore() {
    scoreDisplay.textContent = score;
}

// Passer au mot de passe suivant
function nextPassword() {
    if (currentPasswordIndex < totalPasswords) {
        // Cacher la carte actuelle
        passwordCards[currentPasswordIndex - 1].classList.remove('active');

        // Afficher la carte suivante
        currentPasswordIndex++;
        passwordCards[currentPasswordIndex - 1].classList.add('active');

        // Réinitialiser l'état
        answered = false;
        nextBtn.style.display = 'none';

        // Mettre à jour l'affichage
        currentPasswordSpan.textContent = currentPasswordIndex;
    } else {
        // Afficher le résultat final
        showFinalResult();
    }
}

// Afficher le résultat final
function showFinalResult() {
    // Cacher la dernière carte et le bouton suivant
    passwordCards[currentPasswordIndex - 1].classList.remove('active');
    nextBtn.style.display = 'none';

    // Afficher le score
    finalScoreSpan.textContent = score;

    // Message personnalisé selon le score
    let message = '';
    if (score === 8) {
        message = '🌟 Parfait ! Tu es un expert en sécurité des mots de passe ! 🌟';
    } else if (score >= 6) {
        message = '👏 Très bien ! Tu comprends bien ce qui rend un mot de passe sécurisé !';
    } else if (score >= 4) {
        message = '👍 Pas mal ! Continue à apprendre les bonnes pratiques de sécurité !';
    } else {
        message = '💪 Continue à t\'entraîner ! La sécurité des mots de passe est super importante !';
    }
    finalMessage.textContent = message;

    // Afficher le résultat
    finalResult.classList.add('show');
    restartBtn.style.display = 'block';
}

// Recommencer le quiz
function restartQuiz() {
    // Réinitialiser les variables
    currentPasswordIndex = 1;
    score = 0;
    answered = false;

    // Réinitialiser l'affichage
    currentPasswordSpan.textContent = '1';
    updateScore();

    // Cacher le résultat
    finalResult.classList.remove('show');
    restartBtn.style.display = 'none';

    // Réinitialiser toutes les cartes
    passwordCards.forEach((card, index) => {
        card.classList.remove('active');

        const buttons = card.querySelectorAll('.eval-btn');
        buttons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect', 'disabled');
        });

        const feedback = card.querySelector('.feedback');
        feedback.textContent = '';
        feedback.classList.remove('success', 'error');

        const explanation = card.querySelector('.explanation');
        explanation.classList.remove('show');
    });

    // Afficher la première carte
    passwordCards[0].classList.add('active');
}

// Lancer le jeu au chargement de la page
init();
