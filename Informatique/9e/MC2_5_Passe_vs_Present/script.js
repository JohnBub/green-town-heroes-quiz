// Game data - matching pairs with explanations
const matchingPairs = [
    {
        past: "Code César (décalage simple)",
        present: "Chiffrement AES (algorithme complexe)",
        explanation: "Le Code César utilisait un décalage simple de l'alphabet (A devient D, B devient E, etc.). L'AES (Advanced Encryption Standard) utilise des mathématiques très complexes avec des clés de 128, 192 ou 256 bits, mais le principe fondamental reste le même : transformer un message pour le rendre illisible sans la clé!"
    },
    {
        past: "Scytale spartiate (bâton)",
        present: "VPN (tunnel sécurisé)",
        explanation: "La scytale était un bâton autour duquel on enroulait une bande de cuir pour lire le message - seul celui avec un bâton de même diamètre pouvait le déchiffrer. Le VPN (Virtual Private Network) crée un 'tunnel' sécurisé entre deux points : seuls les appareils avec la bonne configuration peuvent communiquer. Dans les deux cas, on crée un canal de communication privé!"
    },
    {
        past: "Carré de Polybe (grille)",
        present: "QR Codes (codage visuel)",
        explanation: "Le carré de Polybe transformait les lettres en coordonnées sur une grille 5x5 (A = 11, B = 12, etc.). Les QR Codes utilisent aussi un système de grille visuelle pour encoder des informations. Les deux transforment du texte en un format visuel structuré que seul un 'décodeur' peut interpréter!"
    },
    {
        past: "Messager à cheval",
        present: "Email chiffré (PGP/GPG)",
        explanation: "Autrefois, on confiait des messages secrets à des messagers de confiance qui les transportaient physiquement. Aujourd'hui, PGP (Pretty Good Privacy) et GPG permettent d'envoyer des emails que seul le destinataire peut lire. Le messager numérique est devenu un protocole de chiffrement!"
    },
    {
        past: "Sceau de cire",
        present: "Signature numérique",
        explanation: "Le sceau de cire prouvait l'identité de l'expéditeur et garantissait que le message n'avait pas été ouvert. La signature numérique fait exactement pareil : elle prouve l'identité de l'auteur et vérifie que le document n'a pas été modifié. C'est l'équivalent moderne du sceau royal!"
    },
    {
        past: "Coffre-fort physique",
        present: "Chiffrement de disque",
        explanation: "Un coffre-fort protège physiquement vos objets de valeur avec une serrure. Le chiffrement de disque (comme BitLocker ou FileVault) protège numériquement vos fichiers : sans le mot de passe, le contenu est illisible. Vos données sont dans un 'coffre-fort virtuel'!"
    },
    {
        past: "Langage codé verbal",
        present: "Chiffrement de bout en bout (WhatsApp)",
        explanation: "Les espions utilisaient des langages codés pour parler en public sans être compris. Le chiffrement de bout en bout de WhatsApp fonctionne pareil : même si quelqu'un intercepte vos messages, seuls vous et votre destinataire pouvez les lire. C'est comme parler un langage secret que personne d'autre ne comprend!"
    },
    {
        past: "Machine Enigma",
        present: "Ordinateurs de cryptographie",
        explanation: "La machine Enigma était une machine électromécanique nazie utilisée pendant la Seconde Guerre mondiale pour chiffrer les communications militaires. Aujourd'hui, les ordinateurs modernes effectuent des calculs cryptographiques des millions de fois plus complexes. Alan Turing a d'ailleurs créé les premiers ordinateurs pour casser Enigma!"
    }
];

// Game state
let score = 0;
let attempts = 0;
let selectedPastItem = null;
let matchedPairs = [];

// DOM elements
const pastItemsContainer = document.getElementById('past-items');
const presentItemsContainer = document.getElementById('present-items');
const scoreElement = document.getElementById('score');
const attemptsElement = document.getElementById('attempts');
const shuffleBtn = document.getElementById('shuffle-btn');
const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const popupPast = document.getElementById('popup-past');
const popupPresent = document.getElementById('popup-present');
const popupExplanation = document.getElementById('popup-explanation');
const popupClose = document.getElementById('popup-close');
const connectionsSvg = document.getElementById('connections-svg');
const finalScreen = document.getElementById('final-screen');
const finalScore = document.getElementById('final-score');
const finalAttempts = document.getElementById('final-attempts');
const finalAccuracy = document.getElementById('final-accuracy');
const finalReview = document.getElementById('final-review');
const restartBtn = document.getElementById('restart-btn');

// Shuffle array function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize game
function initGame() {
    score = 0;
    attempts = 0;
    selectedPastItem = null;
    matchedPairs = [];

    scoreElement.textContent = score;
    attemptsElement.textContent = attempts;

    // Clear SVG connections safely
    while (connectionsSvg.firstChild) {
        connectionsSvg.removeChild(connectionsSvg.firstChild);
    }

    renderItems();
}

// Render items in both columns
function renderItems() {
    const shuffledPast = shuffleArray(matchingPairs);
    const shuffledPresent = shuffleArray(matchingPairs);

    // Clear containers safely
    while (pastItemsContainer.firstChild) {
        pastItemsContainer.removeChild(pastItemsContainer.firstChild);
    }
    while (presentItemsContainer.firstChild) {
        presentItemsContainer.removeChild(presentItemsContainer.firstChild);
    }

    shuffledPast.forEach((pair, index) => {
        const item = document.createElement('div');
        item.className = 'item past-item';
        item.dataset.pairIndex = matchingPairs.indexOf(pair);
        item.textContent = pair.past;

        if (matchedPairs.includes(matchingPairs.indexOf(pair))) {
            item.classList.add('matched');
        }

        item.addEventListener('click', () => handlePastClick(item));
        pastItemsContainer.appendChild(item);
    });

    shuffledPresent.forEach((pair, index) => {
        const item = document.createElement('div');
        item.className = 'item present-item';
        item.dataset.pairIndex = matchingPairs.indexOf(pair);
        item.textContent = pair.present;

        if (matchedPairs.includes(matchingPairs.indexOf(pair))) {
            item.classList.add('matched');
        }

        item.addEventListener('click', () => handlePresentClick(item));
        presentItemsContainer.appendChild(item);
    });
}

// Handle past item click
function handlePastClick(item) {
    if (item.classList.contains('matched')) return;

    // Remove selection from all past items
    document.querySelectorAll('.past-item').forEach(el => {
        el.classList.remove('selected');
    });

    // Select this item
    item.classList.add('selected');
    selectedPastItem = item;

    // Enable present items
    document.querySelectorAll('.present-item').forEach(el => {
        if (!el.classList.contains('matched')) {
            el.classList.remove('disabled');
        }
    });
}

// Handle present item click
function handlePresentClick(item) {
    if (!selectedPastItem || item.classList.contains('matched')) return;

    const pastIndex = parseInt(selectedPastItem.dataset.pairIndex);
    const presentIndex = parseInt(item.dataset.pairIndex);

    attempts++;
    attemptsElement.textContent = attempts;

    if (pastIndex === presentIndex) {
        // Correct match!
        handleCorrectMatch(selectedPastItem, item, pastIndex);
    } else {
        // Wrong match
        handleWrongMatch(item);
    }
}

// Handle correct match
function handleCorrectMatch(pastItem, presentItem, pairIndex) {
    score++;
    scoreElement.textContent = score;

    pastItem.classList.add('matched');
    pastItem.classList.remove('selected');
    presentItem.classList.add('matched');

    matchedPairs.push(pairIndex);

    // Draw connection line (desktop only)
    if (window.innerWidth > 900) {
        drawConnection(pastItem, presentItem);
    }

    // Show popup
    const pair = matchingPairs[pairIndex];
    showPopup(pair);

    selectedPastItem = null;
}

// Handle wrong match
function handleWrongMatch(item) {
    item.classList.add('wrong');
    selectedPastItem.classList.add('wrong');

    setTimeout(() => {
        item.classList.remove('wrong');
        selectedPastItem.classList.remove('wrong');
        selectedPastItem.classList.remove('selected');
        selectedPastItem = null;
    }, 500);
}

// Draw connection line between matched items
function drawConnection(pastItem, presentItem) {
    const pastRect = pastItem.getBoundingClientRect();
    const presentRect = presentItem.getBoundingClientRect();
    const svgRect = connectionsSvg.getBoundingClientRect();

    // Calculate positions relative to SVG
    const startX = pastRect.right - svgRect.left;
    const startY = pastRect.top + pastRect.height / 2 - svgRect.top;
    const endX = presentRect.left - svgRect.left;
    const endY = presentRect.top + presentRect.height / 2 - svgRect.top;

    // Create curved path
    const midX = (startX + endX) / 2;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

    path.setAttribute('d', d);
    path.classList.add('connection-line');

    // Calculate path length for animation
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    connectionsSvg.appendChild(path);
}

// Show popup with explanation
function showPopup(pair) {
    popupPast.textContent = pair.past;
    popupPresent.textContent = pair.present;
    popupExplanation.textContent = pair.explanation;
    popup.classList.remove('hidden');
}

// Close popup
function closePopup() {
    popup.classList.add('hidden');

    // Check if game is complete
    if (matchedPairs.length === matchingPairs.length) {
        setTimeout(showFinalScreen, 300);
    }
}

// Create a review item element safely
function createReviewItem(pair) {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';

    const reviewMatch = document.createElement('div');
    reviewMatch.className = 'review-match';

    const reviewPast = document.createElement('span');
    reviewPast.className = 'review-past';
    reviewPast.textContent = pair.past;

    const reviewArrow = document.createElement('span');
    reviewArrow.className = 'review-arrow';
    reviewArrow.textContent = '\u2192'; // Unicode arrow

    const reviewPresent = document.createElement('span');
    reviewPresent.className = 'review-present';
    reviewPresent.textContent = pair.present;

    reviewMatch.appendChild(reviewPast);
    reviewMatch.appendChild(reviewArrow);
    reviewMatch.appendChild(reviewPresent);

    const reviewExplanation = document.createElement('p');
    reviewExplanation.className = 'review-explanation';
    reviewExplanation.textContent = pair.explanation;

    reviewItem.appendChild(reviewMatch);
    reviewItem.appendChild(reviewExplanation);

    return reviewItem;
}

// Show final screen
function showFinalScreen() {
    finalScore.textContent = score;
    finalAttempts.textContent = attempts;

    const accuracy = Math.round((score / attempts) * 100);
    finalAccuracy.textContent = accuracy;

    // Clear and build review safely
    while (finalReview.firstChild) {
        finalReview.removeChild(finalReview.firstChild);
    }

    matchingPairs.forEach(pair => {
        const reviewItem = createReviewItem(pair);
        finalReview.appendChild(reviewItem);
    });

    finalScreen.classList.remove('hidden');
}

// Shuffle only unmatched items
function shuffleUnmatched() {
    const pastItems = Array.from(pastItemsContainer.children).filter(
        item => !item.classList.contains('matched')
    );
    const presentItems = Array.from(presentItemsContainer.children).filter(
        item => !item.classList.contains('matched')
    );

    // Shuffle past items
    const shuffledPastItems = shuffleArray(pastItems);
    shuffledPastItems.forEach(item => {
        pastItemsContainer.appendChild(item);
    });

    // Shuffle present items
    const shuffledPresentItems = shuffleArray(presentItems);
    shuffledPresentItems.forEach(item => {
        presentItemsContainer.appendChild(item);
    });

    // Clear selection
    if (selectedPastItem) {
        selectedPastItem.classList.remove('selected');
        selectedPastItem = null;
    }
}

// Event listeners
shuffleBtn.addEventListener('click', shuffleUnmatched);
popupClose.addEventListener('click', closePopup);
restartBtn.addEventListener('click', () => {
    finalScreen.classList.add('hidden');
    initGame();
});

// Close popup with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
        closePopup();
    }
});

// Handle window resize for SVG connections
window.addEventListener('resize', () => {
    if (window.innerWidth <= 900) {
        while (connectionsSvg.firstChild) {
            connectionsSvg.removeChild(connectionsSvg.firstChild);
        }
    }
});

// Initialize game on load
document.addEventListener('DOMContentLoaded', initGame);
