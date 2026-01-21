// Caesar Cipher Wheel - Interactive Educational Tool
// For French 9th graders learning cryptography

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// DOM Elements
const slider = document.getElementById('shift-slider');
const shiftValue = document.getElementById('shift-value');
const shiftDisplay = document.getElementById('shift-display');
const formulaDisplay = document.getElementById('formula');
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const modeBtn = document.getElementById('mode-btn');
const actionLabel = document.getElementById('action-label');
const currentLetterDisplay = document.getElementById('current-letter-display');
const outerLettersGroup = document.getElementById('outer-letters');
const innerLettersGroup = document.getElementById('inner-letters');
const examplesDiv = document.getElementById('examples');

// State
let currentShift = 0;
let isEncodeMode = true;
let typingTimeout = null;

// Initialize the wheel
function initWheel() {
    const centerX = 200;
    const centerY = 200;
    const outerRadius = 160;
    const innerRadius = 110;

    // Clear existing letters
    while (outerLettersGroup.firstChild) {
        outerLettersGroup.removeChild(outerLettersGroup.firstChild);
    }
    while (innerLettersGroup.firstChild) {
        innerLettersGroup.removeChild(innerLettersGroup.firstChild);
    }

    // Create letters around the wheel
    for (let i = 0; i < 26; i++) {
        const angle = (i * 360 / 26 - 90) * Math.PI / 180;

        // Outer letter (fixed)
        const outerX = centerX + outerRadius * Math.cos(angle);
        const outerY = centerY + outerRadius * Math.sin(angle);

        const outerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        outerText.setAttribute('x', outerX);
        outerText.setAttribute('y', outerY);
        outerText.setAttribute('class', 'outer-letter');
        outerText.setAttribute('data-index', i);
        outerText.textContent = ALPHABET[i];
        outerLettersGroup.appendChild(outerText);

        // Inner letter (will rotate)
        const innerX = centerX + innerRadius * Math.cos(angle);
        const innerY = centerY + innerRadius * Math.sin(angle);

        const innerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        innerText.setAttribute('x', innerX);
        innerText.setAttribute('y', innerY);
        innerText.setAttribute('class', 'inner-letter');
        innerText.setAttribute('data-index', i);
        innerText.textContent = ALPHABET[i];
        innerLettersGroup.appendChild(innerText);
    }
}

// Update the wheel rotation
function updateWheel() {
    const rotation = currentShift * (360 / 26);
    innerLettersGroup.style.transform = `rotate(${rotation}deg)`;
    innerLettersGroup.style.transformOrigin = '200px 200px';
}

// Update the shift display
function updateShiftDisplay() {
    shiftValue.textContent = currentShift;
    shiftDisplay.textContent = currentShift > 0 ? `+${currentShift}` : '0';

    // Update formula
    const shiftedLetter = ALPHABET[currentShift % 26];
    formulaDisplay.textContent = `A → ${shiftedLetter} (décalage +${currentShift})`;
}

// Caesar cipher function
function caesarCipher(text, shift, encode = true) {
    const effectiveShift = encode ? shift : (26 - shift) % 26;

    return text.toUpperCase().split('').map(char => {
        if (ALPHABET.includes(char)) {
            const index = ALPHABET.indexOf(char);
            const newIndex = (index + effectiveShift) % 26;
            return ALPHABET[newIndex];
        }
        return char;
    }).join('');
}

// Highlight letter pair on the wheel
function highlightLetterPair(originalChar) {
    // Remove all highlights
    document.querySelectorAll('.outer-letter, .inner-letter').forEach(el => {
        el.classList.remove('highlighted');
    });

    const upperChar = originalChar.toUpperCase();
    if (!ALPHABET.includes(upperChar)) {
        currentLetterDisplay.classList.remove('visible');
        return;
    }

    const originalIndex = ALPHABET.indexOf(upperChar);
    const effectiveShift = isEncodeMode ? currentShift : (26 - currentShift) % 26;
    const shiftedIndex = (originalIndex + effectiveShift) % 26;
    const shiftedChar = ALPHABET[shiftedIndex];

    // Highlight the original letter (outer ring)
    const outerLetter = document.querySelector(`.outer-letter[data-index="${originalIndex}"]`);
    if (outerLetter) {
        outerLetter.classList.add('highlighted');
    }

    // For the inner ring, we need to find which inner letter is now at the shifted position
    // The inner ring rotates, so the letter at visual position shiftedIndex is the one we want
    // But the actual data-index we need depends on the shift
    // After rotation by shift, the letter at visual position i has data-index (i + shift) % 26
    // We want to highlight the inner letter that visually aligns with the shifted position
    // which has data-index (shiftedIndex + currentShift) % 26
    const innerDataIndex = (shiftedIndex + currentShift) % 26;
    const innerLetter = document.querySelector(`.inner-letter[data-index="${innerDataIndex}"]`);
    if (innerLetter) {
        innerLetter.classList.add('highlighted');
    }

    // Update the current letter display
    currentLetterDisplay.querySelector('.original').textContent = upperChar;
    currentLetterDisplay.querySelector('.shifted').textContent = shiftedChar;
    currentLetterDisplay.classList.add('visible');
}

// Process input and update output
function processInput() {
    const text = inputText.value;
    const result = caesarCipher(text, currentShift, isEncodeMode);
    outputText.textContent = result;

    // Highlight the last typed letter
    if (text.length > 0) {
        highlightLetterPair(text[text.length - 1]);
    } else {
        currentLetterDisplay.classList.remove('visible');
        document.querySelectorAll('.outer-letter, .inner-letter').forEach(el => {
            el.classList.remove('highlighted');
        });
    }
}

// Create example item element
function createExampleItem(shift, word, encoded) {
    const item = document.createElement('div');
    item.className = 'example-item';

    const shiftSpan = document.createElement('span');
    shiftSpan.className = 'example-shift';
    shiftSpan.textContent = `+${shift}:`;

    const resultSpan = document.createElement('span');
    resultSpan.className = 'example-result';
    resultSpan.textContent = `${word} → ${encoded}`;

    item.appendChild(shiftSpan);
    item.appendChild(resultSpan);

    return item;
}

// Update examples
function updateExamples() {
    const word = 'BONJOUR';
    const shifts = [3, 7, 13];

    // Clear existing examples
    while (examplesDiv.firstChild) {
        examplesDiv.removeChild(examplesDiv.firstChild);
    }

    // Add new examples using safe DOM methods
    shifts.forEach(shift => {
        const encoded = caesarCipher(word, shift, true);
        const item = createExampleItem(shift, word, encoded);
        examplesDiv.appendChild(item);
    });
}

// Toggle encode/decode mode
function toggleMode() {
    isEncodeMode = !isEncodeMode;

    if (isEncodeMode) {
        modeBtn.textContent = 'Encoder';
        modeBtn.classList.remove('decode');
        modeBtn.classList.add('encode');
        actionLabel.textContent = 'encoder';
        inputText.placeholder = 'Entrez votre message...';
    } else {
        modeBtn.textContent = 'Décoder';
        modeBtn.classList.remove('encode');
        modeBtn.classList.add('decode');
        actionLabel.textContent = 'décoder';
        inputText.placeholder = 'Entrez le message chiffré...';
    }

    processInput();
}

// Event Listeners
slider.addEventListener('input', () => {
    currentShift = parseInt(slider.value);
    updateShiftDisplay();
    updateWheel();
    processInput();
});

inputText.addEventListener('input', () => {
    processInput();

    // Clear typing timeout
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    // Hide highlight after 2 seconds of no typing
    typingTimeout = setTimeout(() => {
        if (inputText.value.length > 0) {
            document.querySelectorAll('.outer-letter, .inner-letter').forEach(el => {
                el.classList.remove('highlighted');
            });
        }
    }, 2000);
});

modeBtn.addEventListener('click', toggleMode);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Arrow keys to adjust shift
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentShift < 25) {
            currentShift++;
            slider.value = currentShift;
            updateShiftDisplay();
            updateWheel();
            processInput();
        }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentShift > 0) {
            currentShift--;
            slider.value = currentShift;
            updateShiftDisplay();
            updateWheel();
            processInput();
        }
    }

    // Tab to toggle mode
    if (e.key === 'Tab' && document.activeElement !== inputText) {
        e.preventDefault();
        toggleMode();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initWheel();
    updateShiftDisplay();
    updateExamples();

    // Set initial shift to 3 (Caesar's original)
    currentShift = 3;
    slider.value = 3;
    updateShiftDisplay();
    updateWheel();
});
