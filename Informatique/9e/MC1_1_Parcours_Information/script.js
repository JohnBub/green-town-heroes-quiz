// Variables globales
let risksFound = 0;
const totalRisks = 4;
const clickedSteps = new Set();

// Sélection des éléments
const steps = document.querySelectorAll('.step');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const resetBtn = document.getElementById('resetBtn');

// Initialisation
function init() {
    // Événements pour les étapes cliquables
    steps.forEach(step => {
        step.addEventListener('click', handleStepClick);
    });

    // Événement pour le bouton reset
    resetBtn.addEventListener('click', resetGame);
}

// Gestion du clic sur une étape
function handleStepClick() {
    const stepNumber = this.getAttribute('data-step');
    const hasRisk = this.getAttribute('data-has-risk') === 'true';
    const isClickable = this.classList.contains('clickable');

    // Vérifier si l'étape a déjà été cliquée
    if (clickedSteps.has(stepNumber)) {
        return;
    }

    // Si l'étape n'est pas cliquable (téléphones)
    if (!isClickable) {
        // Feedback pour les téléphones
        this.classList.add('clicked-incorrect');
        const statusIcon = this.querySelector('.step-status');
        statusIcon.textContent = '❌';

        showFeedback('Non, les téléphones sont protégés ! Cherche ailleurs ! 🔍', 'error');

        // Retirer l'animation après 2 secondes
        setTimeout(() => {
            this.classList.remove('clicked-incorrect');
            statusIcon.textContent = '';
        }, 2000);

        return;
    }

    // Marquer l'étape comme cliquée
    clickedSteps.add(stepNumber);

    // Si c'est un risque (étapes 2, 3, 4, 5)
    if (hasRisk) {
        // Correct !
        this.classList.add('clicked-correct');
        this.classList.remove('clickable');
        const statusIcon = this.querySelector('.step-status');
        statusIcon.textContent = '✅';

        risksFound++;
        updateScore();

        // Feedback positif
        showFeedback('✅ Exact ! C\'est bien un endroit à risque !', 'success');

        // Vérifier si tous les risques ont été trouvés
        if (risksFound === totalRisks) {
            setTimeout(() => {
                showFeedback('🎉 BRAVO ! Tu as identifié tous les risques ! Plus l\'information voyage loin, plus il y a de risques ! 🎉', 'complete');
            }, 1000);
        }
    }
}

// Mettre à jour le score
function updateScore() {
    scoreDisplay.textContent = risksFound;
}

// Afficher le feedback
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

// Réinitialiser le jeu
function resetGame() {
    // Réinitialiser les variables
    risksFound = 0;
    clickedSteps.clear();
    updateScore();

    // Réinitialiser les étapes
    steps.forEach(step => {
        step.classList.remove('clicked-correct', 'clicked-incorrect');
        const statusIcon = step.querySelector('.step-status');
        statusIcon.textContent = '';

        // Remettre la classe clickable pour les étapes à risque
        const hasRisk = step.getAttribute('data-has-risk') === 'true';
        if (hasRisk) {
            step.classList.add('clickable');
        }
    });

    // Réinitialiser le feedback
    feedback.textContent = '';
    feedback.className = 'feedback';
}

// Lancer le jeu au chargement de la page
init();
