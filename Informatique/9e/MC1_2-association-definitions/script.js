// Variables globales
let draggedElement = null;
let correctMatches = 0;
const totalMatches = 4;

// Sélection des éléments
const wordCards = document.querySelectorAll('.word-card');
const dropZones = document.querySelectorAll('.drop-zone');
const feedback = document.getElementById('feedback');
const resetBtn = document.getElementById('resetBtn');

// Initialisation
function init() {
    // Événements pour les cartes de mots (draggable)
    wordCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    // Événements pour les zones de dépôt
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });

    // Événement pour le bouton reset
    resetBtn.addEventListener('click', resetGame);
}

// Gestion du début du drag
function handleDragStart(e) {
    if (this.classList.contains('matched')) {
        e.preventDefault();
        return;
    }
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// Gestion de la fin du drag
function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// Gestion du survol d'une zone de dépôt
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}

// Gestion de la sortie d'une zone de dépôt
function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

// Gestion du dépôt
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    this.classList.remove('drag-over');

    // Vérifier si la zone est déjà remplie
    if (this.querySelector('.word-card')) {
        return false;
    }

    // Obtenir le mot déposé et la réponse attendue
    const wordData = draggedElement.getAttribute('data-word');
    const expectedAnswer = this.parentElement.getAttribute('data-answer');

    // Vérifier si c'est correct
    if (wordData === expectedAnswer) {
        // Correct !
        this.appendChild(draggedElement);
        this.classList.add('correct');
        draggedElement.classList.add('matched');
        correctMatches++;

        // Feedback positif
        showFeedback('✅ Super ! Bonne association !', 'success');

        // Vérifier si toutes les associations sont correctes
        if (correctMatches === totalMatches) {
            setTimeout(() => {
                showFeedback('🎉 BRAVO ! Tu as tout réussi ! 🎉', 'complete');
            }, 500);
        }
    } else {
        // Incorrect
        this.classList.add('incorrect');
        showFeedback('❌ Oups ! Essaie encore !', 'error');

        // Retirer la classe 'incorrect' après l'animation
        setTimeout(() => {
            this.classList.remove('incorrect');
        }, 500);
    }

    return false;
}

// Afficher le feedback
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

// Réinitialiser le jeu
function resetGame() {
    // Remettre les cartes dans la colonne de gauche
    const wordsColumn = document.querySelector('.words-column');
    wordCards.forEach(card => {
        card.classList.remove('matched', 'dragging');
        wordsColumn.appendChild(card);
    });

    // Nettoyer les zones de dépôt
    dropZones.forEach(zone => {
        zone.classList.remove('correct', 'incorrect', 'drag-over');
    });

    // Réinitialiser le compteur et le feedback
    correctMatches = 0;
    feedback.textContent = '';
    feedback.className = 'feedback';
}

// Lancer le jeu au chargement de la page
init();
