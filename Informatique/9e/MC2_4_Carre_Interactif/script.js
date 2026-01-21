// Polybius Square Interactive Game

// Polybius Square mapping
const polybiusSquare = {
    'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15',
    'F': '21', 'G': '22', 'H': '23', 'I': '24', 'J': '24', 'K': '25',
    'L': '31', 'M': '32', 'N': '33', 'O': '34', 'P': '35',
    'Q': '41', 'R': '42', 'S': '43', 'T': '44', 'U': '45',
    'V': '51', 'W': '52', 'X': '53', 'Y': '54', 'Z': '55'
};

// Reverse mapping for decoding
const reversePolybius = {};
for (const [letter, coords] of Object.entries(polybiusSquare)) {
    if (letter !== 'J') { // Skip J as it shares coords with I
        reversePolybius[coords] = letter;
    }
}
// Special case: 24 can be I or J
reversePolybius['24'] = 'I/J';

// Practice challenges
const challenges = [
    { type: 'encode', question: 'SALUT', answer: '43 11 31 45 44' },
    { type: 'decode', question: '43 15 13 42 15 44', answer: 'SECRET' },
    { type: 'encode', question: 'HELLO', answer: '23 15 31 31 34' },
    { type: 'decode', question: '12 34 33 24 34 45 42', answer: 'BONJOUR' },
    { type: 'encode', question: 'CODE', answer: '13 34 14 15' },
    { type: 'decode', question: '13 31 15', answer: 'CLE' },
    { type: 'encode', question: 'MERCI', answer: '32 15 42 13 24' },
    { type: 'decode', question: '35 34 31 54 12 15', answer: 'POLYBE' }
];

// State
let currentChallengeIndex = 0;
let score = 0;
let totalQuestions = 0;
let shuffledChallenges = [];
let practiceActive = false;

// DOM Elements
const polybiusGrid = document.getElementById('polybiusGrid');
const coordValue = document.getElementById('coordValue');
const letterCells = document.querySelectorAll('.cell.letter');
const rowHeaders = document.querySelectorAll('.cell.row-header');
const colHeaders = document.querySelectorAll('.cell.col-header');

// Mode tabs and content
const modeTabs = document.querySelectorAll('.mode-tab');
const modeContents = document.querySelectorAll('.mode-content');

// Encode elements
const encodeInput = document.getElementById('encodeInput');
const encodeBtn = document.getElementById('encodeBtn');
const encodeSteps = document.getElementById('encodeSteps');
const encodeFinal = document.getElementById('encodeFinal');

// Decode elements
const decodeInput = document.getElementById('decodeInput');
const decodeBtn = document.getElementById('decodeBtn');
const decodeSteps = document.getElementById('decodeSteps');
const decodeFinal = document.getElementById('decodeFinal');

// Practice elements
const startPracticeBtn = document.getElementById('startPractice');
const nextChallengeBtn = document.getElementById('nextChallenge');
const practiceInput = document.getElementById('practiceInput');
const submitAnswerBtn = document.getElementById('submitAnswer');
const challengeType = document.getElementById('challengeType');
const challengeQuestion = document.getElementById('challengeQuestion');
const practiceFeedback = document.getElementById('practiceFeedback');
const currentScoreEl = document.getElementById('currentScore');
const totalQuestionsEl = document.getElementById('totalQuestions');
const practiceComplete = document.getElementById('practiceComplete');
const challengeArea = document.getElementById('challengeArea');
const finalScoreEl = document.getElementById('finalScore');
const restartPracticeBtn = document.getElementById('restartPractice');

// Initialize
init();

function init() {
    setupGridInteraction();
    setupModeTabs();
    setupEncodeDecode();
    setupPractice();
}

// Grid Interaction
function setupGridInteraction() {
    letterCells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('mouseenter', handleCellHover);
        cell.addEventListener('mouseleave', handleCellLeave);
    });
}

function handleCellClick(e) {
    const cell = e.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const letter = cell.dataset.letter;

    // Clear previous active
    clearGridHighlights();

    // Set active
    cell.classList.add('active');

    // Highlight headers
    document.querySelector(`.row-header[data-row="${row}"]`)?.classList.add('highlight');
    document.querySelector(`.col-header[data-col="${col}"]`)?.classList.add('highlight');

    // Update coordinate display
    coordValue.textContent = `${row}${col}`;

    // Animate coordinate display
    coordValue.style.transform = 'scale(1.2)';
    setTimeout(() => {
        coordValue.style.transform = 'scale(1)';
    }, 200);
}

function handleCellHover(e) {
    const cell = e.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;

    // Highlight row and column cells
    letterCells.forEach(c => {
        if (c.dataset.row === row || c.dataset.col === col) {
            if (c !== cell) {
                c.classList.add(c.dataset.row === row ? 'highlight-row' : 'highlight-col');
            }
        }
    });
}

function handleCellLeave(e) {
    letterCells.forEach(c => {
        c.classList.remove('highlight-row', 'highlight-col');
    });
}

function clearGridHighlights() {
    letterCells.forEach(c => {
        c.classList.remove('active', 'encode-highlight', 'decode-highlight', 'highlight-row', 'highlight-col');
    });
    rowHeaders.forEach(h => h.classList.remove('highlight'));
    colHeaders.forEach(h => h.classList.remove('highlight'));
}

// Mode Tabs
function setupModeTabs() {
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active content
            const mode = tab.dataset.mode;
            modeContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${mode}Mode`).classList.add('active');

            // Clear grid highlights when switching modes
            clearGridHighlights();
            coordValue.textContent = '--';
        });
    });
}

// Encode/Decode Functionality
function setupEncodeDecode() {
    encodeBtn.addEventListener('click', handleEncode);
    encodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleEncode();
    });

    decodeBtn.addEventListener('click', handleDecode);
    decodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleDecode();
    });
}

async function handleEncode() {
    const text = encodeInput.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (!text) return;

    // Clear previous results
    encodeSteps.innerHTML = '';
    encodeFinal.textContent = '';
    clearGridHighlights();

    const coords = [];

    // Animate each letter
    for (let i = 0; i < text.length; i++) {
        const letter = text[i];
        const coord = polybiusSquare[letter];

        if (coord) {
            coords.push(coord);

            // Highlight cell in grid
            const cell = document.querySelector(`.cell.letter[data-letter="${letter}"]`);
            if (cell) {
                clearGridHighlights();
                cell.classList.add('encode-highlight');

                // Update coordinate display
                coordValue.textContent = coord;
            }

            // Add step item
            const stepItem = document.createElement('div');
            stepItem.className = 'step-item encode';
            stepItem.innerHTML = `
                <span class="letter">${letter}</span>
                <span class="coords">${coord}</span>
            `;
            stepItem.style.animationDelay = `${i * 0.1}s`;
            encodeSteps.appendChild(stepItem);

            await sleep(300);
        }
    }

    // Show final result
    clearGridHighlights();
    encodeFinal.textContent = coords.join(' ');
    encodeFinal.className = 'result-final encode';
}

async function handleDecode() {
    const input = decodeInput.value.trim();
    if (!input) return;

    // Parse coordinates
    const coordPairs = input.split(/\s+/).filter(c => /^\d{2}$/.test(c));
    if (coordPairs.length === 0) return;

    // Clear previous results
    decodeSteps.innerHTML = '';
    decodeFinal.textContent = '';
    clearGridHighlights();

    const letters = [];

    // Animate each coordinate pair
    for (let i = 0; i < coordPairs.length; i++) {
        const coord = coordPairs[i];
        const letter = reversePolybius[coord];

        if (letter) {
            // Handle I/J case - display as I for the result
            const displayLetter = letter === 'I/J' ? 'I' : letter;
            letters.push(displayLetter);

            // Highlight cell in grid
            const row = coord[0];
            const col = coord[1];
            const cell = document.querySelector(`.cell.letter[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                clearGridHighlights();
                cell.classList.add('decode-highlight');

                // Update coordinate display
                coordValue.textContent = coord;
            }

            // Add step item
            const stepItem = document.createElement('div');
            stepItem.className = 'step-item decode';
            stepItem.innerHTML = `
                <span class="coords">${coord}</span>
                <span class="letter">${letter}</span>
            `;
            stepItem.style.animationDelay = `${i * 0.1}s`;
            decodeSteps.appendChild(stepItem);

            await sleep(300);
        }
    }

    // Show final result
    clearGridHighlights();
    decodeFinal.textContent = letters.join('');
    decodeFinal.className = 'result-final decode';
}

// Practice Mode
function setupPractice() {
    startPracticeBtn.addEventListener('click', startPractice);
    nextChallengeBtn.addEventListener('click', nextChallenge);
    submitAnswerBtn.addEventListener('click', checkAnswer);
    practiceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
    restartPracticeBtn.addEventListener('click', startPractice);
}

function startPractice() {
    // Shuffle challenges
    shuffledChallenges = [...challenges].sort(() => Math.random() - 0.5);
    currentChallengeIndex = 0;
    score = 0;
    totalQuestions = 0;
    practiceActive = true;

    // Update UI
    currentScoreEl.textContent = '0';
    totalQuestionsEl.textContent = '0';
    startPracticeBtn.style.display = 'none';
    nextChallengeBtn.style.display = 'none';
    challengeArea.style.display = 'block';
    practiceComplete.style.display = 'none';
    practiceFeedback.classList.remove('show');

    showChallenge();
}

function showChallenge() {
    if (currentChallengeIndex >= shuffledChallenges.length) {
        endPractice();
        return;
    }

    const challenge = shuffledChallenges[currentChallengeIndex];

    // Update challenge display
    if (challenge.type === 'encode') {
        challengeType.textContent = 'Encoder ce mot';
        challengeType.className = 'challenge-type encode';
        challengeQuestion.textContent = challenge.question;
        practiceInput.placeholder = 'Ex: 11 12 13...';
    } else {
        challengeType.textContent = 'Décoder ces coordonnées';
        challengeType.className = 'challenge-type decode';
        challengeQuestion.textContent = challenge.question;
        practiceInput.placeholder = 'Ex: ABC...';
    }

    // Clear input and feedback
    practiceInput.value = '';
    practiceInput.disabled = false;
    submitAnswerBtn.disabled = false;
    practiceFeedback.classList.remove('show');
    nextChallengeBtn.style.display = 'none';

    practiceInput.focus();
}

function checkAnswer() {
    if (!practiceActive) return;

    const challenge = shuffledChallenges[currentChallengeIndex];
    let userAnswer = practiceInput.value.trim().toUpperCase();

    // Normalize answer for comparison
    let correctAnswer = challenge.answer.toUpperCase();

    // For encode type, normalize spacing
    if (challenge.type === 'encode') {
        userAnswer = userAnswer.replace(/\s+/g, ' ');
        correctAnswer = correctAnswer.replace(/\s+/g, ' ');
    } else {
        // For decode, remove spaces and handle I/J
        userAnswer = userAnswer.replace(/\s+/g, '').replace(/J/g, 'I');
        correctAnswer = correctAnswer.replace(/\s+/g, '').replace(/J/g, 'I');
    }

    totalQuestions++;
    totalQuestionsEl.textContent = totalQuestions;

    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
        score++;
        currentScoreEl.textContent = score;
        practiceFeedback.textContent = 'Correct! Bien joué!';
        practiceFeedback.className = 'feedback show correct';
    } else {
        practiceFeedback.innerHTML = `Incorrect. La bonne réponse était: <strong>${challenge.answer}</strong>`;
        practiceFeedback.className = 'feedback show incorrect';
    }

    // Disable input
    practiceInput.disabled = true;
    submitAnswerBtn.disabled = true;

    // Show next button or end practice
    if (currentChallengeIndex < shuffledChallenges.length - 1) {
        nextChallengeBtn.style.display = 'inline-block';
    } else {
        setTimeout(endPractice, 1500);
    }
}

function nextChallenge() {
    currentChallengeIndex++;
    showChallenge();
}

function endPractice() {
    practiceActive = false;
    challengeArea.style.display = 'none';
    practiceComplete.style.display = 'block';
    finalScoreEl.textContent = `${score}/${totalQuestions}`;
    startPracticeBtn.style.display = 'inline-block';
    startPracticeBtn.textContent = 'Recommencer';
}

// Utility function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
