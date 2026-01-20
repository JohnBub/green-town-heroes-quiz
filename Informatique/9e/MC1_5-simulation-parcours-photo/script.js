// Variables globales
let currentStep = 0;
const totalSteps = 8;
let totalDistance = 0;

// Distances approximatives entre chaque étape (en km)
const stepDistances = [0, 2, 5, 50, 350, 30, 5, 2, 1]; // Index 0 = départ

// Sélection des éléments
const networkSteps = document.querySelectorAll('.network-step');
const feedback = document.getElementById('feedback');
const currentStepDisplay = document.getElementById('currentStep');
const distanceDisplay = document.getElementById('distance');
const photoIndicator = document.getElementById('photoIndicator');
const finalResult = document.getElementById('finalResult');
const totalDistanceDisplay = document.getElementById('totalDistance');
const resetBtn = document.getElementById('resetBtn');

// Initialisation
function init() {
    // Afficher l'indicateur de photo au départ
    photoIndicator.classList.add('active');

    // Événements pour les étapes du réseau
    networkSteps.forEach(step => {
        step.addEventListener('click', () => handleStepClick(step));
    });

    // Événement pour le bouton reset
    resetBtn.addEventListener('click', resetGame);
}

// Gestion du clic sur une étape
function handleStepClick(step) {
    const stepNumber = parseInt(step.getAttribute('data-step'));
    const stepDescription = step.getAttribute('data-description');

    // Vérifier si c'est la bonne étape
    if (stepNumber === currentStep + 1) {
        // Correct !
        currentStep++;
        step.classList.add('completed');
        step.classList.remove('clickable');
        step.classList.add('active');

        // Animer la progression
        setTimeout(() => {
            step.classList.remove('active');
        }, 600);

        // Ajouter la distance
        totalDistance += stepDistances[currentStep];

        // Mettre à jour l'affichage
        currentStepDisplay.textContent = currentStep;
        distanceDisplay.textContent = totalDistance;

        // Feedback positif
        showFeedback(`✅ Parfait ! ${stepDescription}`, 'success');

        // Vérifier si c'est la dernière étape
        if (currentStep === totalSteps) {
            setTimeout(() => {
                showFinalResult();
            }, 1500);
        }

    } else if (stepNumber <= currentStep) {
        // Étape déjà complétée
        showFeedback('⚠️ Cette étape est déjà passée !', 'error');
    } else {
        // Mauvais ordre
        step.classList.add('wrong');
        showFeedback('❌ Oups ! La photo ne peut pas aller directement là. Essaie une autre étape.', 'error');

        // Retirer l'animation après un moment
        setTimeout(() => {
            step.classList.remove('wrong');
        }, 600);
    }
}

// Afficher le feedback
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

// Afficher le résultat final
function showFinalResult() {
    // Cacher le feedback
    feedback.style.display = 'none';

    // Cacher l'indicateur de photo
    photoIndicator.classList.remove('active');

    // Afficher le résultat
    totalDistanceDisplay.textContent = totalDistance;
    finalResult.classList.add('show');
    resetBtn.style.display = 'block';
}

// Réinitialiser le jeu
function resetGame() {
    // Réinitialiser les variables
    currentStep = 0;
    totalDistance = 0;

    // Réinitialiser l'affichage
    currentStepDisplay.textContent = '0';
    distanceDisplay.textContent = '0';

    // Réinitialiser les étapes
    networkSteps.forEach(step => {
        step.classList.remove('completed', 'active', 'wrong');
        step.classList.add('clickable');
    });

    // Réafficher le feedback
    feedback.style.display = 'flex';
    feedback.textContent = '';
    feedback.className = 'feedback';

    // Cacher le résultat final
    finalResult.classList.remove('show');
    resetBtn.style.display = 'none';

    // Réafficher l'indicateur de photo
    photoIndicator.classList.add('active');
}

// Lancer le jeu au chargement de la page
init();
