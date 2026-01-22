// ===== CONFIGURATION =====
const ATTEMPTS_PER_SECOND = 10000000000; // 10 milliards d'essais par seconde (attaque moderne)

// Patterns communs qui réduisent significativement le temps de craquage
const COMMON_PATTERNS = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^azerty/i,
    /^admin/i,
    /^letmein/i,
    /^welcome/i,
    /^monkey/i,
    /^dragon/i,
    /^master/i,
    /^\d{6,8}$/, // Dates
    /^(.)\1+$/, // Caractères répétés
    /^[a-z]+\d{2,4}$/i, // mot + chiffres
    /^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/i,
    /^(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)/i
];

const COMMON_WORDS = [
    'password', 'motdepasse', 'azerty', 'qwerty', 'admin', 'login', 'bienvenue',
    'soleil', 'amour', 'football', 'basketball', 'hockey', 'tennis',
    'chocolat', 'bonbon', 'gâteau', 'pizza', 'burger',
    'superman', 'batman', 'spiderman', 'ironman',
    'minecraft', 'fortnite', 'roblox', 'pokemon', 'mario', 'zelda',
    'dragon', 'tigre', 'lion', 'chien', 'chat', 'cheval',
    'paris', 'france', 'suisse', 'geneve', 'lausanne',
    'école', 'classe', 'professeur', 'élève'
];

// ===== ÉLÉMENTS DOM =====
const passwordInput = document.getElementById('passwordInput');
const toggleVisibility = document.getElementById('toggleVisibility');
const meterFill = document.getElementById('meterFill');
const strengthLabel = document.getElementById('strengthLabel');
const timeValue = document.getElementById('timeValue');
const timeLabel = document.getElementById('timeLabel');
const timeIcon = document.getElementById('timeIcon');
const crackTimeDisplay = document.querySelector('.crack-time-display');
const analysisDetails = document.getElementById('analysisDetails');

// Valeurs de détail
const lengthValue = document.getElementById('lengthValue');
const lowercaseValue = document.getElementById('lowercaseValue');
const uppercaseValue = document.getElementById('uppercaseValue');
const numbersValue = document.getElementById('numbersValue');
const symbolsValue = document.getElementById('symbolsValue');
const charsetValue = document.getElementById('charsetValue');
const explanationText = document.getElementById('explanationText');

// Onglets
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Éléments du quiz
const quizCards = document.querySelectorAll('.quiz-card');
const quizNextBtn = document.getElementById('quizNextBtn');
const quizRestartBtn = document.getElementById('quizRestartBtn');
const quizResult = document.getElementById('quizResult');
const currentQuestionSpan = document.getElementById('currentQuestion');
const quizScoreSpan = document.getElementById('quizScore');
const finalQuizScoreSpan = document.getElementById('finalQuizScore');
const resultMessage = document.getElementById('resultMessage');

// ===== VARIABLES GLOBALES =====
let isPasswordVisible = false;
let currentQuestion = 1;
const totalQuestions = 6;
let quizScore = 0;
let quizAnswered = false;

// ===== FONCTIONS D'ANALYSE =====

function analyzePassword(password) {
    if (!password) {
        return {
            length: 0,
            hasLowercase: false,
            hasUppercase: false,
            hasNumbers: false,
            hasSymbols: false,
            charsetSize: 0,
            possibleCombinations: 0,
            crackTimeSeconds: 0,
            isCommonPattern: false,
            strength: 'none'
        };
    }

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);

    // Calcul de la taille du jeu de caractères
    let charsetSize = 0;
    if (hasLowercase) charsetSize += 26;
    if (hasUppercase) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSymbols) charsetSize += 33;

    // Vérification des patterns communs
    const isCommonPattern = COMMON_PATTERNS.some(pattern => pattern.test(password)) ||
                           COMMON_WORDS.some(word => password.toLowerCase().includes(word));

    // Calcul des combinaisons possibles
    const possibleCombinations = Math.pow(charsetSize, password.length);

    // Calcul du temps de craquage
    let crackTimeSeconds = possibleCombinations / ATTEMPTS_PER_SECOND;

    // Réduire le temps si pattern commun détecté
    if (isCommonPattern) {
        crackTimeSeconds = crackTimeSeconds / 1000000; // Division significative
        if (crackTimeSeconds < 0.001) crackTimeSeconds = 0.001;
    }

    // Déterminer la force
    let strength;
    if (isCommonPattern || password.length < 6 || crackTimeSeconds < 1) {
        strength = 'instant';
    } else if (crackTimeSeconds < 3600) { // < 1 heure
        strength = 'weak';
    } else if (crackTimeSeconds < 86400 * 30) { // < 1 mois
        strength = 'medium';
    } else if (crackTimeSeconds < 86400 * 365 * 100) { // < 100 ans
        strength = 'strong';
    } else {
        strength = 'very-strong';
    }

    return {
        length: password.length,
        hasLowercase,
        hasUppercase,
        hasNumbers,
        hasSymbols,
        charsetSize,
        possibleCombinations,
        crackTimeSeconds,
        isCommonPattern,
        strength
    };
}

function formatTime(seconds) {
    if (seconds < 0.001) {
        return { value: 'Instantané', unit: '' };
    }
    if (seconds < 1) {
        return { value: 'Moins d\'une seconde', unit: '' };
    }
    if (seconds < 60) {
        const val = Math.round(seconds);
        return { value: val, unit: val === 1 ? 'seconde' : 'secondes' };
    }
    if (seconds < 3600) {
        const val = Math.round(seconds / 60);
        return { value: val, unit: val === 1 ? 'minute' : 'minutes' };
    }
    if (seconds < 86400) {
        const val = Math.round(seconds / 3600);
        return { value: val, unit: val === 1 ? 'heure' : 'heures' };
    }
    if (seconds < 86400 * 30) {
        const val = Math.round(seconds / 86400);
        return { value: val, unit: val === 1 ? 'jour' : 'jours' };
    }
    if (seconds < 86400 * 365) {
        const val = Math.round(seconds / (86400 * 30));
        return { value: val, unit: 'mois' };
    }
    if (seconds < 86400 * 365 * 100) {
        const val = Math.round(seconds / (86400 * 365));
        return { value: val, unit: val === 1 ? 'an' : 'ans' };
    }
    if (seconds < 86400 * 365 * 1000000) {
        const val = Math.round(seconds / (86400 * 365 * 100));
        return { value: val, unit: val === 1 ? 'siècle' : 'siècles' };
    }
    if (seconds < 86400 * 365 * 1000000000) {
        const val = Math.round(seconds / (86400 * 365 * 1000000));
        return { value: val, unit: 'millions d\'années' };
    }
    return { value: 'Virtuellement', unit: 'impossible' };
}

function updateDisplay(analysis) {
    // Mettre à jour les valeurs de détail
    lengthValue.textContent = analysis.length || '0';

    lowercaseValue.textContent = analysis.hasLowercase ? 'Oui' : 'Non';
    lowercaseValue.className = `detail-value ${analysis.hasLowercase ? 'yes' : 'no'}`;

    uppercaseValue.textContent = analysis.hasUppercase ? 'Oui' : 'Non';
    uppercaseValue.className = `detail-value ${analysis.hasUppercase ? 'yes' : 'no'}`;

    numbersValue.textContent = analysis.hasNumbers ? 'Oui' : 'Non';
    numbersValue.className = `detail-value ${analysis.hasNumbers ? 'yes' : 'no'}`;

    symbolsValue.textContent = analysis.hasSymbols ? 'Oui' : 'Non';
    symbolsValue.className = `detail-value ${analysis.hasSymbols ? 'yes' : 'no'}`;

    charsetValue.textContent = analysis.charsetSize || '0';

    // Mettre à jour le mètre de force
    let meterWidth = 0;
    let meterColor = '#64748b';
    let strengthText = 'Entre un mot de passe';

    switch (analysis.strength) {
        case 'instant':
            meterWidth = 15;
            meterColor = '#ef4444';
            strengthText = 'Très faible - Craqué instantanément !';
            break;
        case 'weak':
            meterWidth = 35;
            meterColor = '#f59e0b';
            strengthText = 'Faible - Craqué en quelques minutes/heures';
            break;
        case 'medium':
            meterWidth = 55;
            meterColor = '#eab308';
            strengthText = 'Moyen - Pourrait résister quelques jours';
            break;
        case 'strong':
            meterWidth = 75;
            meterColor = '#22c55e';
            strengthText = 'Fort - Résisterait des années';
            break;
        case 'very-strong':
            meterWidth = 100;
            meterColor = '#14b8a6';
            strengthText = 'Très fort - Pratiquement impossible à craquer';
            break;
    }

    meterFill.style.width = `${meterWidth}%`;
    meterFill.style.background = meterColor;
    strengthLabel.textContent = strengthText;
    strengthLabel.style.color = meterColor;

    // Mettre à jour l'affichage du temps
    const formattedTime = formatTime(analysis.crackTimeSeconds);
    if (formattedTime.unit) {
        timeValue.textContent = `${formattedTime.value} ${formattedTime.unit}`;
    } else {
        timeValue.textContent = formattedTime.value;
    }

    // Mettre à jour l'icône et la classe
    crackTimeDisplay.className = `crack-time-display ${analysis.strength}`;

    switch (analysis.strength) {
        case 'instant':
            timeIcon.innerHTML = '&#9888;'; // Warning
            timeLabel.textContent = 'Très dangereux !';
            break;
        case 'weak':
            timeIcon.innerHTML = '&#128274;'; // Cadenas ouvert
            timeLabel.textContent = 'Temps de craquage estimé';
            break;
        case 'medium':
            timeIcon.innerHTML = '&#9202;'; // Horloge
            timeLabel.textContent = 'Temps de craquage estimé';
            break;
        case 'strong':
            timeIcon.innerHTML = '&#128272;'; // Clé
            timeLabel.textContent = 'Temps de craquage estimé';
            break;
        case 'very-strong':
            timeIcon.innerHTML = '&#128737;'; // Bouclier
            timeLabel.textContent = 'Excellente protection !';
            break;
        default:
            timeIcon.innerHTML = '&#9202;';
            timeValue.textContent = '-';
            timeLabel.textContent = 'Entre un mot de passe';
    }

    // Mettre à jour l'explication
    updateExplanation(analysis);
}

// Fonction pour formater les grands nombres de manière lisible
function formatLargeNumber(num) {
    if (num >= 1e18) {
        return (num / 1e18).toFixed(1) + ' trillions';
    } else if (num >= 1e15) {
        return (num / 1e15).toFixed(1) + ' quadrillions';
    } else if (num >= 1e12) {
        return (num / 1e12).toFixed(1) + ' billions';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + ' milliards';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + ' millions';
    } else {
        return num.toLocaleString('fr-CH');
    }
}

function updateExplanation(analysis) {
    if (analysis.length === 0) {
        explanationText.innerHTML = 'Entre un mot de passe pour voir l\'analyse.';
        return;
    }

    let explanation = '';

    // Étape 1: Jeu de caractères
    explanation += `<div class="calc-step">`;
    explanation += `<span class="step-number">1️⃣</span>`;
    explanation += `<strong>Jeu de caractères : ${analysis.charsetSize}</strong><br>`;
    explanation += `<span class="step-detail">(`;
    const parts = [];
    if (analysis.hasLowercase) parts.push('26 minuscules');
    if (analysis.hasUppercase) parts.push('26 majuscules');
    if (analysis.hasNumbers) parts.push('10 chiffres');
    if (analysis.hasSymbols) parts.push('33 symboles');
    explanation += parts.join(' + ');
    explanation += `)</span></div>`;

    // Étape 2: Longueur
    explanation += `<div class="calc-step">`;
    explanation += `<span class="step-number">2️⃣</span>`;
    explanation += `<strong>Longueur : ${analysis.length} caractères</strong>`;
    explanation += `</div>`;

    // Étape 3: Calcul des combinaisons
    explanation += `<div class="calc-step">`;
    explanation += `<span class="step-number">3️⃣</span>`;
    explanation += `<strong>Combinaisons possibles :</strong><br>`;
    explanation += `<span class="calc-formula">${analysis.charsetSize}<sup>${analysis.length}</sup> = `;
    explanation += `<span class="calc-result">${analysis.possibleCombinations.toLocaleString('fr-CH')}</span></span><br>`;
    explanation += `<span class="step-detail">(${formatLargeNumber(analysis.possibleCombinations)} !)</span>`;
    explanation += `</div>`;

    // Étape 4: Vitesse d'attaque
    explanation += `<div class="calc-step">`;
    explanation += `<span class="step-number">4️⃣</span>`;
    explanation += `<strong>Vitesse d'attaque : 10 milliards/sec</strong><br>`;
    explanation += `<span class="step-detail">🖥️ GPU moderne (carte graphique type RTX 4090)</span>`;
    explanation += `</div>`;

    // Étape 5: Calcul du temps
    const timeInSeconds = analysis.possibleCombinations / ATTEMPTS_PER_SECOND;
    explanation += `<div class="calc-step calc-final">`;
    explanation += `<span class="step-number">5️⃣</span>`;
    explanation += `<strong>Calcul du temps :</strong><br>`;
    explanation += `<span class="calc-formula">${formatLargeNumber(analysis.possibleCombinations)} ÷ 10 milliards</span><br>`;
    explanation += `<span class="calc-formula">= <span class="calc-result">${timeInSeconds.toLocaleString('fr-CH', {maximumFractionDigits: 0})} secondes</span></span><br>`;
    const formattedTime = formatTime(analysis.crackTimeSeconds);
    if (formattedTime.unit) {
        explanation += `<span class="calc-formula">≈ <span class="time-highlight">${formattedTime.value} ${formattedTime.unit}</span></span>`;
    } else {
        explanation += `<span class="calc-formula">≈ <span class="time-highlight">${formattedTime.value}</span></span>`;
    }
    explanation += `</div>`;

    // Avertissement si pattern commun
    if (analysis.isCommonPattern) {
        explanation += `<div class="calc-warning">`;
        explanation += `<strong>⚠️ Attention :</strong> Ce mot de passe contient un pattern commun ou un mot connu ! Les hackers testent ces patterns en priorité, ce qui réduit drastiquement le temps de craquage.`;
        explanation += `</div>`;
    }

    explanationText.innerHTML = explanation;
}

// ===== ÉVÉNEMENTS ANALYSEUR =====

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const analysis = analyzePassword(password);
    updateDisplay(analysis);
});

toggleVisibility.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';
    toggleVisibility.innerHTML = isPasswordVisible
        ? '<span class="eye-icon">&#128064;</span>'
        : '<span class="eye-icon">&#128065;</span>';
});

// ===== ÉVÉNEMENTS ONGLETS =====

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        // Mettre à jour les boutons
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Mettre à jour le contenu
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });
    });
});

// ===== FONCTIONS QUIZ =====

function calculateCrackTimeForQuiz(password) {
    const analysis = analyzePassword(password);
    return analysis.crackTimeSeconds;
}

function handleQuizAnswer(card, selectedOption) {
    if (quizAnswered) return;
    quizAnswered = true;

    const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
    const feedback = card.querySelector('.quiz-feedback');
    const explanation = card.querySelector('.quiz-explanation');
    const options = card.querySelectorAll('.password-option');

    // Désactiver tous les boutons
    options.forEach(opt => opt.classList.add('disabled'));

    // Afficher les temps de craquage
    options.forEach(opt => {
        const pwd = opt.getAttribute('data-password');
        const time = formatTime(calculateCrackTimeForQuiz(pwd));
        const hint = opt.querySelector('.time-hint');
        hint.textContent = time.unit ? `${time.value} ${time.unit}` : time.value;
    });

    if (isCorrect) {
        selectedOption.classList.add('correct');
        feedback.textContent = 'Bravo ! Bonne réponse !';
        feedback.classList.add('success');
        quizScore++;
        quizScoreSpan.textContent = quizScore;
    } else {
        selectedOption.classList.add('incorrect');
        feedback.textContent = 'Oups ! Ce n\'est pas le bon choix.';
        feedback.classList.add('error');

        // Montrer la bonne réponse
        options.forEach(opt => {
            if (opt.getAttribute('data-correct') === 'true') {
                opt.classList.add('correct');
            }
        });
    }

    explanation.classList.add('show');

    // Afficher le bouton suivant
    setTimeout(() => {
        quizNextBtn.style.display = 'block';
        if (currentQuestion === totalQuestions) {
            quizNextBtn.textContent = 'Voir le résultat';
        }
    }, 800);
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        quizCards[currentQuestion - 1].classList.remove('active');
        currentQuestion++;
        quizCards[currentQuestion - 1].classList.add('active');
        quizAnswered = false;
        quizNextBtn.style.display = 'none';
        currentQuestionSpan.textContent = currentQuestion;
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    quizCards[currentQuestion - 1].classList.remove('active');
    quizNextBtn.style.display = 'none';

    finalQuizScoreSpan.textContent = quizScore;

    let message = '';
    if (quizScore === 6) {
        message = 'Parfait ! Tu maîtrises complètement les concepts de sécurité des mots de passe !';
    } else if (quizScore >= 4) {
        message = 'Très bien ! Tu comprends bien ce qui rend un mot de passe difficile à craquer.';
    } else if (quizScore >= 2) {
        message = 'Pas mal ! Continue à explorer l\'analyseur pour mieux comprendre.';
    } else {
        message = 'Utilise l\'analyseur pour expérimenter avec différents mots de passe !';
    }
    resultMessage.textContent = message;

    quizResult.classList.add('show');
    quizRestartBtn.style.display = 'block';
}

function restartQuiz() {
    currentQuestion = 1;
    quizScore = 0;
    quizAnswered = false;

    currentQuestionSpan.textContent = '1';
    quizScoreSpan.textContent = '0';

    quizResult.classList.remove('show');
    quizRestartBtn.style.display = 'none';
    quizNextBtn.textContent = 'Suivant';

    quizCards.forEach((card, index) => {
        card.classList.remove('active');

        const options = card.querySelectorAll('.password-option');
        options.forEach(opt => {
            opt.classList.remove('correct', 'incorrect', 'disabled');
            opt.querySelector('.time-hint').textContent = '';
        });

        const feedback = card.querySelector('.quiz-feedback');
        feedback.textContent = '';
        feedback.classList.remove('success', 'error');

        const explanation = card.querySelector('.quiz-explanation');
        explanation.classList.remove('show');
    });

    quizCards[0].classList.add('active');
}

// ===== INITIALISATION QUIZ =====

quizCards.forEach(card => {
    const options = card.querySelectorAll('.password-option');
    options.forEach(option => {
        option.addEventListener('click', () => handleQuizAnswer(card, option));
    });
});

quizNextBtn.addEventListener('click', nextQuestion);
quizRestartBtn.addEventListener('click', restartQuiz);

// ===== INITIALISATION GLOBALE =====

// Initialiser l'affichage
updateDisplay(analyzePassword(''));
