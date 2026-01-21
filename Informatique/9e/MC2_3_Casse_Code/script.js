// Game data - challenges with encoded message, original message, and correct shift
const challenges = [
    { encoded: "FKDW", original: "CHAT", shift: 3 },
    { encoded: "GEQNG", original: "ECOLE", shift: 2 },
    { encoded: "PMZVI", original: "LIVRE", shift: 4 },
    { encoded: "SPVHF", original: "ROUGE", shift: 1 },
    { encoded: "FWGWJ", original: "ARBRE", shift: 5 },
    { encoded: "TPMFKM", original: "SOLEIL", shift: 1 },
    { encoded: "RCVKGT", original: "PAPIER", shift: 2 },
    { encoded: "QXLUH", original: "MUSIC", shift: 4 }
];

// Game state
let currentChallenge = 0;
let score = 0;
let attempts = 0;
let hintUsed = false;

// DOM elements
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const scoreValue = document.getElementById('scoreValue');
const encodedMessage = document.getElementById('encodedMessage');
const originalMessage = document.getElementById('originalMessage');
const comparisonArea = document.getElementById('comparisonArea');
const shiftSlider = document.getElementById('shiftSlider');
const shiftInput = document.getElementById('shiftInput');
const verifyBtn = document.getElementById('verifyBtn');
const hintBtn = document.getElementById('hintBtn');
const hintText = document.getElementById('hintText');
const feedback = document.getElementById('feedback');
const gameArea = document.getElementById('gameArea');
const resultsScreen = document.getElementById('resultsScreen');
const finalScore = document.getElementById('finalScore');
const resultsMessage = document.getElementById('resultsMessage');
const restartBtn = document.getElementById('restartBtn');
const alphabetStrip = document.getElementById('alphabetStrip');

// Initialize alphabet strip
function initAlphabetStrip() {
    alphabetStrip.innerHTML = '';
    for (let i = 0; i < 26; i++) {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box';
        letterBox.innerHTML = `
            <span class="letter-char">${String.fromCharCode(65 + i)}</span>
            <span class="letter-num">${i}</span>
        `;
        alphabetStrip.appendChild(letterBox);
    }
}

// Display message with individual letter spans
function displayMessage(element, text) {
    element.innerHTML = '';
    for (let char of text) {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        element.appendChild(span);
    }
}

// Animate letters comparison
function animateComparison(original, encoded, shift) {
    comparisonArea.innerHTML = '';

    for (let i = 0; i < original.length; i++) {
        setTimeout(() => {
            const item = document.createElement('div');
            item.className = 'comparison-item';

            const origChar = original[i];
            const encChar = encoded[i];
            const origPos = origChar.charCodeAt(0) - 65;
            const encPos = encChar.charCodeAt(0) - 65;

            item.innerHTML = `
                <div class="comparison-letters">
                    <span class="from-letter">${origChar}</span>
                    <span class="arrow-symbol">+${shift}=</span>
                    <span class="to-letter">${encChar}</span>
                </div>
                <div class="comparison-calc">(${origPos} + ${shift} = ${encPos})</div>
            `;

            comparisonArea.appendChild(item);

            // Highlight corresponding letters in alphabet strip
            highlightAlphabetLetter(origPos);
            highlightAlphabetLetter(encPos);

            // Animate letters in messages
            const originalLetters = originalMessage.querySelectorAll('.letter');
            const encodedLetters = encodedMessage.querySelectorAll('.letter');
            if (originalLetters[i]) originalLetters[i].classList.add('animate');
            if (encodedLetters[i]) encodedLetters[i].classList.add('animate');

            setTimeout(() => {
                if (originalLetters[i]) originalLetters[i].classList.remove('animate');
                if (encodedLetters[i]) encodedLetters[i].classList.remove('animate');
            }, 500);

        }, i * 400);
    }
}

// Highlight a letter in the alphabet strip
function highlightAlphabetLetter(index) {
    const letterBoxes = alphabetStrip.querySelectorAll('.letter-box');
    if (letterBoxes[index]) {
        letterBoxes[index].classList.add('highlight');
        setTimeout(() => {
            letterBoxes[index].classList.remove('highlight');
        }, 1000);
    }
}

// Clear alphabet highlights
function clearAlphabetHighlights() {
    const letterBoxes = alphabetStrip.querySelectorAll('.letter-box');
    letterBoxes.forEach(box => box.classList.remove('highlight'));
}

// Load a challenge
function loadChallenge() {
    const challenge = challenges[currentChallenge];

    // Reset state
    attempts = 0;
    hintUsed = false;
    hintText.textContent = '';
    feedback.textContent = '';
    feedback.className = 'feedback';
    comparisonArea.innerHTML = '';
    shiftSlider.value = 0;
    shiftInput.value = 0;
    clearAlphabetHighlights();

    // Display messages
    displayMessage(encodedMessage, challenge.encoded);
    displayMessage(originalMessage, challenge.original);

    // Update progress
    progressFill.style.width = `${((currentChallenge + 1) / challenges.length) * 100}%`;
    progressText.textContent = `${currentChallenge + 1}/${challenges.length}`;

    // Enable buttons
    verifyBtn.disabled = false;
    hintBtn.disabled = false;
}

// Check the answer
function checkAnswer() {
    const challenge = challenges[currentChallenge];
    const userShift = parseInt(shiftInput.value);

    attempts++;

    if (userShift === challenge.shift) {
        // Correct answer
        let points = 10;
        if (attempts === 1 && !hintUsed) points = 10;
        else if (attempts === 1 && hintUsed) points = 7;
        else if (attempts === 2) points = 5;
        else points = 3;

        score += points;
        scoreValue.textContent = score;

        feedback.textContent = `Excellent! Le decalage est bien +${challenge.shift}. +${points} points`;
        feedback.className = 'feedback correct';

        // Show the comparison animation
        animateComparison(challenge.original, challenge.encoded, challenge.shift);

        // Disable buttons temporarily
        verifyBtn.disabled = true;
        hintBtn.disabled = true;

        // Move to next challenge after delay
        setTimeout(() => {
            currentChallenge++;
            if (currentChallenge < challenges.length) {
                loadChallenge();
            } else {
                showResults();
            }
        }, 3000);
    } else {
        // Incorrect answer
        feedback.textContent = `Ce n'est pas +${userShift}. Essaie encore!`;
        feedback.className = 'feedback incorrect';

        if (attempts >= 3) {
            // Show hint after 3 wrong attempts
            showHint();
        }
    }
}

// Show hint
function showHint() {
    const challenge = challenges[currentChallenge];
    const firstOriginal = challenge.original[0];
    const firstEncoded = challenge.encoded[0];
    const origPos = firstOriginal.charCodeAt(0) - 65;
    const encPos = firstEncoded.charCodeAt(0) - 65;

    hintText.textContent = `Indice: Compare les premieres lettres. ${firstOriginal} (position ${origPos}) devient ${firstEncoded} (position ${encPos}). Quelle est la difference?`;
    hintUsed = true;

    // Highlight the first letters in alphabet
    highlightAlphabetLetter(origPos);
    highlightAlphabetLetter(encPos);
}

// Show final results
function showResults() {
    gameArea.style.display = 'none';
    resultsScreen.style.display = 'block';

    finalScore.textContent = score;

    const maxScore = challenges.length * 10;
    const percentage = (score / maxScore) * 100;

    let message = '';
    if (percentage >= 90) {
        message = "Agent d'elite! Tu as parfaitement maitrise le decryptage par decalage!";
    } else if (percentage >= 70) {
        message = "Excellent travail, agent! Tu comprends bien le chiffrement de Cesar.";
    } else if (percentage >= 50) {
        message = "Bon debut, agent. Continue a t'entrainer pour devenir un expert!";
    } else {
        message = "Mission d'entrainement necessaire. Revois la logique du decalage et reessaie!";
    }

    resultsMessage.textContent = message;
}

// Restart game
function restartGame() {
    currentChallenge = 0;
    score = 0;
    scoreValue.textContent = 0;

    resultsScreen.style.display = 'none';
    gameArea.style.display = 'block';

    // Shuffle challenges for variety
    shuffleArray(challenges);

    loadChallenge();
}

// Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Sync slider and input
shiftSlider.addEventListener('input', () => {
    shiftInput.value = shiftSlider.value;
});

shiftInput.addEventListener('input', () => {
    let value = parseInt(shiftInput.value) || 0;
    value = Math.max(0, Math.min(25, value));
    shiftInput.value = value;
    shiftSlider.value = value;
});

// Event listeners
verifyBtn.addEventListener('click', checkAnswer);
hintBtn.addEventListener('click', showHint);
restartBtn.addEventListener('click', restartGame);

// Allow Enter key to verify
shiftInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Initialize game
initAlphabetStrip();
shuffleArray(challenges);
loadChallenge();
