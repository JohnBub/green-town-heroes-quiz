// Historical encryption events data
const events = [
    {
        id: 'scytale',
        year: -500,
        title: 'Scytale spartiate',
        icon: '🔧',
        hint: 'Bâton militaire',
        description: 'Bâton utilisé pour encoder des messages militaires',
        details: 'La scytale était un bâton de bois utilisé par les Spartiates pour chiffrer leurs messages militaires. Une bande de cuir ou de parchemin était enroulée autour du bâton, puis le message était écrit. Sans un bâton du même diamètre, le message était illisible. C\'est l\'un des premiers dispositifs de chiffrement connus!'
    },
    {
        id: 'polybe',
        year: -150,
        title: 'Carré de Polybe',
        icon: '🔲',
        hint: 'Coordonnées grecques',
        description: 'Système grec de chiffrement par coordonnées',
        details: 'Inventé par l\'historien grec Polybe, ce système remplace chaque lettre par deux chiffres représentant sa position dans une grille 5x5. Par exemple, A devient 11, B devient 12, etc. Cette méthode était utilisée pour transmettre des messages par signaux lumineux ou sonores, car chaque lettre ne nécessite que 2 chiffres!'
    },
    {
        id: 'cesar',
        year: -50,
        title: 'Code César',
        icon: '👑',
        hint: 'Décalage alphabétique',
        description: 'Jules César chiffre ses messages militaires',
        details: 'Jules César utilisait un chiffrement par décalage pour ses communications militaires. Chaque lettre était remplacée par une lettre située 3 positions plus loin dans l\'alphabet. A devient D, B devient E, etc. Bien que simple, ce code était efficace à une époque où peu de gens savaient lire. Il est considéré comme l\'ancêtre des chiffrements modernes!'
    },
    {
        id: 'vigenere',
        year: 1553,
        title: 'Chiffre de Vigenère',
        icon: '📜',
        hint: 'Polyalphabétique',
        description: 'Premier chiffrement polyalphabétique',
        details: 'Blaise de Vigenère a perfectionné un système où la clé de chiffrement change pour chaque lettre du message. Contrairement au code César qui utilise un seul décalage, Vigenère utilise une série de décalages différents basés sur un mot-clé. Ce chiffrement a été considéré comme "indéchiffrable" pendant près de 300 ans!'
    },
    {
        id: 'enigma',
        year: 1918,
        title: 'Machine Enigma',
        icon: '⚙️',
        hint: 'Machine allemande',
        description: 'Machine de chiffrement allemande',
        details: 'Inventée par l\'ingénieur allemand Arthur Scherbius, Enigma était une machine électromécanique qui utilisait des rotors pour chiffrer les messages. Chaque pression sur une touche produisait une lettre différente, avec des milliards de combinaisons possibles. Elle fut utilisée par l\'armée allemande pendant la Seconde Guerre mondiale et semblait impossible à casser.'
    },
    {
        id: 'turing',
        year: 1941,
        title: 'Alan Turing casse Enigma',
        icon: '🧠',
        hint: 'Décryptage historique',
        description: 'Décryptage qui change la guerre',
        details: 'Le mathématicien britannique Alan Turing et son équipe à Bletchley Park ont réussi à casser le code Enigma grâce à la "Bombe", une machine électromécanique. Ce décryptage a permis aux Alliés de lire les communications allemandes, raccourcissant la guerre de 2 à 4 ans selon les historiens. Turing est considéré comme le père de l\'informatique moderne.'
    },
    {
        id: 'rsa',
        year: 1977,
        title: 'Invention du RSA',
        icon: '🔐',
        hint: 'Chiffrement asymétrique',
        description: 'Premier chiffrement asymétrique public',
        details: 'Rivest, Shamir et Adleman ont inventé RSA, le premier système de chiffrement asymétrique publié. Ce système utilise deux clés : une publique pour chiffrer et une privée pour déchiffrer. C\'est une révolution car on peut partager la clé publique sans compromettre la sécurité! RSA est encore utilisé aujourd\'hui pour sécuriser les transactions bancaires et les communications.'
    },
    {
        id: 'https',
        year: 2010,
        title: 'HTTPS généralisé',
        icon: '🌐',
        hint: 'Sécurité du web',
        description: 'Chiffrement du web',
        details: 'Dans les années 2010, le protocole HTTPS (HTTP Secure) s\'est généralisé sur le web. Le petit cadenas dans la barre d\'adresse indique que la connexion est chiffrée grâce au protocole TLS/SSL. Aujourd\'hui, plus de 95% du trafic web est chiffré, protégeant nos mots de passe, données bancaires et communications personnelles!'
    }
];

// Game state
let placedEvents = new Set();
let draggedElement = null;

// Initialize game
function initGame() {
    createCards();
    setupDragAndDrop();
    setupModals();
    updateScore();
}

// Create event cards
function createCards() {
    const container = document.getElementById('cards-container');
    container.textContent = '';

    // Shuffle events for random order
    const shuffledEvents = [...events].sort(() => Math.random() - 0.5);

    shuffledEvents.forEach(event => {
        const card = createCardElement(event);
        container.appendChild(card);
    });
}

// Create a single card element
function createCardElement(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.draggable = true;
    card.dataset.year = event.year;
    card.dataset.id = event.id;

    const iconDiv = document.createElement('div');
    iconDiv.className = 'card-icon';
    iconDiv.textContent = event.icon;

    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-title';
    titleDiv.textContent = event.title;

    const hintDiv = document.createElement('div');
    hintDiv.className = 'card-hint';
    hintDiv.textContent = event.hint;

    card.appendChild(iconDiv);
    card.appendChild(titleDiv);
    card.appendChild(hintDiv);

    return card;
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    // Card drag events
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);

    // Drop zone events
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });

    // Touch support
    setupTouchSupport();
}

// Drag handlers
function handleDragStart(e) {
    if (!e.target.classList.contains('event-card')) return;
    if (e.target.classList.contains('placed')) return;

    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function handleDragEnd(e) {
    if (!e.target.classList.contains('event-card')) return;
    e.target.classList.remove('dragging');
    draggedElement = null;

    // Remove drag-over from all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    if (!this.classList.contains('filled')) {
        this.classList.add('drag-over');
        e.dataTransfer.dropEffect = 'move';
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (this.classList.contains('filled')) return;

    const eventId = e.dataTransfer.getData('text/plain');
    const card = document.querySelector('.event-card[data-id="' + eventId + '"]');

    if (!card) return;

    const cardYear = parseInt(card.dataset.year);
    const zoneYear = parseInt(this.dataset.year);

    if (cardYear === zoneYear) {
        // Correct placement
        placeCard(card, this, eventId);
    } else {
        // Wrong placement
        showErrorModal(card, zoneYear);
    }
}

// Place card in drop zone
function placeCard(card, zone, eventId) {
    // Get event data
    const event = events.find(e => e.id === eventId);

    // Clear drop zone
    zone.textContent = '';

    // Create placed card element
    const placedCard = document.createElement('div');
    placedCard.className = 'event-card placed';
    placedCard.draggable = false;
    placedCard.dataset.year = event.year;
    placedCard.dataset.id = event.id;

    const iconDiv = document.createElement('div');
    iconDiv.className = 'card-icon';
    iconDiv.textContent = event.icon;

    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-title';
    titleDiv.textContent = event.title;

    placedCard.appendChild(iconDiv);
    placedCard.appendChild(titleDiv);

    // Add click handler to show info
    placedCard.addEventListener('click', () => showInfoModal(eventId));

    // Add to drop zone
    zone.appendChild(placedCard);
    zone.classList.add('filled', 'correct');

    // Remove original card
    card.remove();

    // Update game state
    placedEvents.add(eventId);
    updateScore();

    // Show info modal
    showInfoModal(eventId);

    // Check for victory
    if (placedEvents.size === events.length) {
        setTimeout(showVictoryModal, 500);
    }
}

// Touch support for mobile
function setupTouchSupport() {
    let touchStartX, touchStartY;
    let currentDropZone = null;

    document.addEventListener('touchstart', (e) => {
        const card = e.target.closest('.event-card');
        if (!card || card.classList.contains('placed')) return;

        draggedElement = card;
        card.classList.add('dragging');

        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!draggedElement) return;

        const touch = e.touches[0];

        // Find drop zone under touch point
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        const dropZone = elements.find(el => el.classList.contains('drop-zone'));

        // Update drop zone highlight
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });

        if (dropZone && !dropZone.classList.contains('filled')) {
            dropZone.classList.add('drag-over');
            currentDropZone = dropZone;
        } else {
            currentDropZone = null;
        }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!draggedElement) return;

        draggedElement.classList.remove('dragging');

        if (currentDropZone && !currentDropZone.classList.contains('filled')) {
            const cardYear = parseInt(draggedElement.dataset.year);
            const zoneYear = parseInt(currentDropZone.dataset.year);
            const eventId = draggedElement.dataset.id;

            if (cardYear === zoneYear) {
                placeCard(draggedElement, currentDropZone, eventId);
            } else {
                showErrorModal(draggedElement, zoneYear);
            }
        }

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });

        draggedElement = null;
        currentDropZone = null;
    });
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = placedEvents.size;
}

// Modal functions
function setupModals() {
    // Info modal close
    document.getElementById('close-info').addEventListener('click', () => {
        document.getElementById('info-modal').classList.add('hidden');
    });

    // Error modal close
    document.getElementById('close-error').addEventListener('click', () => {
        document.getElementById('error-modal').classList.add('hidden');
    });

    // Replay button
    document.getElementById('replay-btn').addEventListener('click', () => {
        document.getElementById('victory-modal').classList.add('hidden');
        resetGame();
    });

    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

function showInfoModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    document.getElementById('info-icon').textContent = event.icon;
    document.getElementById('info-title').textContent = event.title;

    const yearText = event.year < 0
        ? Math.abs(event.year) + ' av. J.-C.'
        : event.year.toString() + (event.year === 2010 ? 's' : '');
    document.getElementById('info-date').textContent = yearText;

    document.getElementById('info-description').textContent = event.description;

    const detailsContainer = document.getElementById('info-details');
    detailsContainer.textContent = '';
    const detailsP = document.createElement('p');
    detailsP.textContent = event.details;
    detailsContainer.appendChild(detailsP);

    document.getElementById('info-modal').classList.remove('hidden');
}

function showErrorModal(card, wrongYear) {
    const event = events.find(e => e.id === card.dataset.id);
    const correctYear = event.year < 0
        ? Math.abs(event.year) + ' av. J.-C.'
        : event.year.toString() + (event.year === 2010 ? 's' : '');

    const wrongYearText = wrongYear < 0
        ? Math.abs(wrongYear) + ' av. J.-C.'
        : wrongYear.toString() + (wrongYear === 2010 ? 's' : '');

    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';

    const strongTitle = document.createElement('strong');
    strongTitle.textContent = event.title;
    errorMessage.appendChild(strongTitle);
    errorMessage.appendChild(document.createTextNode(' ne date pas de ' + wrongYearText + '.'));
    errorMessage.appendChild(document.createElement('br'));
    errorMessage.appendChild(document.createTextNode('Indice: Cet événement date de '));
    const strongYear = document.createElement('strong');
    strongYear.textContent = correctYear;
    errorMessage.appendChild(strongYear);
    errorMessage.appendChild(document.createTextNode('.'));

    document.getElementById('error-modal').classList.remove('hidden');
}

function showVictoryModal() {
    document.getElementById('victory-modal').classList.remove('hidden');
}

// Reset game
function resetGame() {
    placedEvents.clear();

    // Reset drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.textContent = '';
        zone.classList.remove('filled', 'correct');
    });

    // Recreate cards
    createCards();
    updateScore();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initGame);
