// Game data with matching sets
const matchingSets = [
    {
        id: 1,
        person: "Jules César",
        era: "Antiquité romaine",
        method: "Code César (décalage alphabet)",
        explanation: "Jules César utilisait un chiffrement par décalage de 3 lettres pour protéger ses communications militaires. Ce système simple mais efficace à l'époque est devenu le premier algorithme de chiffrement documenté."
    },
    {
        id: 2,
        person: "Spartiates",
        era: "Grèce antique",
        method: "Scytale (bâton de chiffrement)",
        explanation: "Les Spartiates enroulaient une bandelette de cuir autour d'un bâton (scytale) pour écrire leurs messages. Seul un bâton de même diamètre permettait de lire le message."
    },
    {
        id: 3,
        person: "Polybe",
        era: "Grèce antique",
        method: "Carré de Polybe (coordonnées)",
        explanation: "L'historien grec Polybe a inventé un système où chaque lettre est représentée par deux chiffres correspondant à sa position dans une grille 5x5."
    },
    {
        id: 4,
        person: "Blaise de Vigenère",
        era: "Renaissance",
        method: "Chiffre polyalphabétique",
        explanation: "Ce diplomate français a perfectionné le chiffrement en utilisant plusieurs alphabets de substitution, rendant le déchiffrement beaucoup plus difficile qu'avec un simple César."
    },
    {
        id: 5,
        person: "Arthur Scherbius",
        era: "20e siècle",
        method: "Machine Enigma",
        explanation: "L'ingénieur allemand Arthur Scherbius a inventé la machine Enigma en 1918. Elle utilisait des rotors pour créer des millions de combinaisons de chiffrement."
    },
    {
        id: 6,
        person: "Alan Turing",
        era: "Seconde Guerre mondiale",
        method: "Décryptage Enigma",
        explanation: "Le mathématicien britannique Alan Turing a conçu la machine 'Bombe' qui a permis de casser le code Enigma, contribuant significativement à la victoire des Alliés."
    },
    {
        id: 7,
        person: "Rivest, Shamir, Adleman",
        era: "Années 1970",
        method: "Chiffrement RSA",
        explanation: "Ces trois chercheurs du MIT ont créé en 1977 le premier système de cryptographie asymétrique largement utilisé, basé sur la difficulté de factoriser de grands nombres."
    },
    {
        id: 8,
        person: "Tim Berners-Lee",
        era: "Années 1990",
        method: "HTTPS / SSL",
        explanation: "L'inventeur du World Wide Web a contribué à l'adoption du protocole HTTPS qui sécurise les communications sur Internet grâce au chiffrement SSL/TLS."
    }
];

// Game state
let selectedPerson = null;
let selectedEra = null;
let selectedMethod = null;
let score = 0;
let matchedSets = [];
let connections = [];

// DOM elements
const personItems = document.getElementById('personItems');
const eraItems = document.getElementById('eraItems');
const methodItems = document.getElementById('methodItems');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const shuffleBtn = document.getElementById('shuffleBtn');
const resetBtn = document.getElementById('resetBtn');
const feedback = document.getElementById('feedback');
const connectionsSvg = document.getElementById('connections');
const reviewModal = document.getElementById('reviewModal');
const reviewContent = document.getElementById('reviewContent');
const closeModal = document.getElementById('closeModal');

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create item element
function createItem(text, id, column) {
    const item = document.createElement('div');
    item.className = 'item';
    item.textContent = text;
    item.dataset.id = id;
    item.dataset.column = column;
    item.addEventListener('click', () => handleItemClick(item, column));
    return item;
}

// Initialize game
function initGame() {
    personItems.innerHTML = '';
    eraItems.innerHTML = '';
    methodItems.innerHTML = '';
    connectionsSvg.innerHTML = '';

    selectedPerson = null;
    selectedEra = null;
    selectedMethod = null;
    score = 0;
    matchedSets = [];
    connections = [];

    scoreElement.textContent = score;
    totalElement.textContent = matchingSets.length;

    const shuffledPersons = shuffleArray(matchingSets);
    const shuffledEras = shuffleArray(matchingSets);
    const shuffledMethods = shuffleArray(matchingSets);

    shuffledPersons.forEach(set => {
        personItems.appendChild(createItem(set.person, set.id, 'person'));
    });

    shuffledEras.forEach(set => {
        eraItems.appendChild(createItem(set.era, set.id, 'era'));
    });

    shuffledMethods.forEach(set => {
        methodItems.appendChild(createItem(set.method, set.id, 'method'));
    });
}

// Handle item click
function handleItemClick(item, column) {
    if (item.classList.contains('matched')) return;

    // Deselect if clicking the same item
    if (column === 'person') {
        if (selectedPerson === item) {
            item.classList.remove('selected');
            selectedPerson = null;
            return;
        }
        if (selectedPerson) selectedPerson.classList.remove('selected');
        selectedPerson = item;
    } else if (column === 'era') {
        if (selectedEra === item) {
            item.classList.remove('selected');
            selectedEra = null;
            return;
        }
        if (selectedEra) selectedEra.classList.remove('selected');
        selectedEra = item;
    } else if (column === 'method') {
        if (selectedMethod === item) {
            item.classList.remove('selected');
            selectedMethod = null;
            return;
        }
        if (selectedMethod) selectedMethod.classList.remove('selected');
        selectedMethod = item;
    }

    item.classList.add('selected');

    // Check if all three are selected
    if (selectedPerson && selectedEra && selectedMethod) {
        checkMatch();
    }
}

// Check if the selection is a valid match
function checkMatch() {
    const personId = parseInt(selectedPerson.dataset.id);
    const eraId = parseInt(selectedEra.dataset.id);
    const methodId = parseInt(selectedMethod.dataset.id);

    const isCorrect = personId === eraId && eraId === methodId;

    if (isCorrect) {
        // Correct match
        score++;
        scoreElement.textContent = score;
        matchedSets.push(personId);

        selectedPerson.classList.add('matched', 'correct');
        selectedEra.classList.add('matched', 'correct');
        selectedMethod.classList.add('matched', 'correct');

        drawConnections(selectedPerson, selectedEra, selectedMethod, true);
        showFeedback('Correct!', true);

        // Check if game is complete
        if (score === matchingSets.length) {
            setTimeout(showReview, 1500);
        }
    } else {
        // Incorrect match
        selectedPerson.classList.add('shake');
        selectedEra.classList.add('shake');
        selectedMethod.classList.add('shake');

        drawConnections(selectedPerson, selectedEra, selectedMethod, false);
        showFeedback('Essaie encore!', false);

        setTimeout(() => {
            selectedPerson.classList.remove('shake', 'selected');
            selectedEra.classList.remove('shake', 'selected');
            selectedMethod.classList.remove('shake', 'selected');

            // Remove incorrect connections
            const incorrectLines = connectionsSvg.querySelectorAll('.incorrect');
            incorrectLines.forEach(line => line.remove());
        }, 1000);
    }

    selectedPerson = null;
    selectedEra = null;
    selectedMethod = null;
}

// Draw connection lines between matched items
function drawConnections(person, era, method, isCorrect) {
    const personRect = person.getBoundingClientRect();
    const eraRect = era.getBoundingClientRect();
    const methodRect = method.getBoundingClientRect();
    const containerRect = document.querySelector('.container').getBoundingClientRect();

    // Calculate positions relative to container
    const personCenter = {
        x: personRect.right - containerRect.left,
        y: personRect.top + personRect.height / 2 - containerRect.top
    };

    const eraLeftCenter = {
        x: eraRect.left - containerRect.left,
        y: eraRect.top + eraRect.height / 2 - containerRect.top
    };

    const eraRightCenter = {
        x: eraRect.right - containerRect.left,
        y: eraRect.top + eraRect.height / 2 - containerRect.top
    };

    const methodCenter = {
        x: methodRect.left - containerRect.left,
        y: methodRect.top + methodRect.height / 2 - containerRect.top
    };

    // Create line from person to era
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const path1 = `M ${personCenter.x} ${personCenter.y} C ${personCenter.x + 30} ${personCenter.y}, ${eraLeftCenter.x - 30} ${eraLeftCenter.y}, ${eraLeftCenter.x} ${eraLeftCenter.y}`;
    line1.setAttribute('d', path1);
    line1.classList.add('connection-line', isCorrect ? 'correct' : 'incorrect');
    connectionsSvg.appendChild(line1);

    // Create line from era to method
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const path2 = `M ${eraRightCenter.x} ${eraRightCenter.y} C ${eraRightCenter.x + 30} ${eraRightCenter.y}, ${methodCenter.x - 30} ${methodCenter.y}, ${methodCenter.x} ${methodCenter.y}`;
    line2.setAttribute('d', path2);
    line2.classList.add('connection-line', isCorrect ? 'correct' : 'incorrect');
    connectionsSvg.appendChild(line2);

    if (isCorrect) {
        connections.push({ line1, line2 });
    }
}

// Show feedback message
function showFeedback(message, isCorrect) {
    feedback.textContent = message;
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.classList.remove('hidden');

    setTimeout(() => {
        feedback.classList.add('hidden');
    }, 1500);
}

// Show review modal with all correct matches
function showReview() {
    reviewContent.innerHTML = '';

    matchingSets.forEach(set => {
        const item = document.createElement('div');
        item.className = 'review-item';
        item.innerHTML = `
            <div class="match-info">
                <span>${set.person}</span>
                <span>${set.era}</span>
                <span>${set.method}</span>
            </div>
            <p>${set.explanation}</p>
        `;
        reviewContent.appendChild(item);
    });

    reviewModal.classList.remove('hidden');
}

// Shuffle only unmatched items
function shuffleUnmatched() {
    const columns = [
        { container: personItems, key: 'person' },
        { container: eraItems, key: 'era' },
        { container: methodItems, key: 'method' }
    ];

    columns.forEach(({ container, key }) => {
        const items = Array.from(container.querySelectorAll('.item:not(.matched)'));
        const shuffled = shuffleArray(items);

        // Remove unmatched items
        items.forEach(item => item.remove());

        // Re-add in shuffled order
        shuffled.forEach(item => container.appendChild(item));
    });

    // Clear selections
    if (selectedPerson) selectedPerson.classList.remove('selected');
    if (selectedEra) selectedEra.classList.remove('selected');
    if (selectedMethod) selectedMethod.classList.remove('selected');
    selectedPerson = null;
    selectedEra = null;
    selectedMethod = null;

    // Redraw connections for matched items
    redrawConnections();
}

// Redraw all correct connections
function redrawConnections() {
    connectionsSvg.innerHTML = '';

    matchedSets.forEach(id => {
        const person = personItems.querySelector(`[data-id="${id}"]`);
        const era = eraItems.querySelector(`[data-id="${id}"]`);
        const method = methodItems.querySelector(`[data-id="${id}"]`);

        if (person && era && method) {
            drawConnections(person, era, method, true);
        }
    });
}

// Event listeners
shuffleBtn.addEventListener('click', shuffleUnmatched);
resetBtn.addEventListener('click', initGame);
closeModal.addEventListener('click', () => {
    reviewModal.classList.add('hidden');
});

// Handle window resize for connection lines
window.addEventListener('resize', redrawConnections);

// Initialize game on load
initGame();
