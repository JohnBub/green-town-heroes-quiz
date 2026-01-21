// ===== CONFIGURATION =====
const ATTEMPTS_PER_SECOND = 10000000000; // 10 milliards d'essais par seconde (attaque moderne)

// Patterns communs qui reduisent significativement le temps de craquage
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
    /^(.)\1+$/, // Caracteres repetes
    /^[a-z]+\d{2,4}$/i, // mot + chiffres
    /^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/i,
    /^(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)/i
];

const COMMON_WORDS = [
    'password', 'motdepasse', 'azerty', 'qwerty', 'admin', 'login', 'bienvenue',
    'soleil', 'amour', 'football', 'basketball', 'hockey', 'tennis',
    'chocolat', 'bonbon', 'gateau', 'pizza', 'burger',
    'superman', 'batman', 'spiderman', 'ironman',
    'minecraft', 'fortnite', 'roblox', 'pokemon', 'mario', 'zelda',
    'dragon', 'tigre', 'lion', 'chien', 'chat', 'cheval',
    'paris', 'france', 'suisse', 'geneve', 'lausanne',
    'ecole', 'classe', 'professeur', 'eleve'
];

// ===== ELEMENTS DOM =====
const passwordInput = document.getElementById('passwordInput');
const toggleVisibility = document.getElementById('toggleVisibility');
const meterFill = document.getElementById('meterFill');
const strengthLabel = document.getElementById('strengthLabel');
const timeValue = document.getElementById('timeValue');
const timeLabel = document.getElementById('timeLabel');
const timeIcon = document.getElementById('timeIcon');
const crackTimeDisplay = document.querySelector('.crack-time-display');
const analysisDetails = document.getElementById('analysisDetails');

// Detail values
const lengthValue = document.getElementById('lengthValue');
const lowercaseValue = document.getElementById('lowercaseValue');
const uppercaseValue = document.getElementById('uppercaseValue');
const numbersValue = document.getElementById('numbersValue');
const symbolsValue = document.getElementById('symbolsValue');
const charsetValue = document.getElementById('charsetValue');
const explanationText = document.getElementById('explanationText');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Quiz elements
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

    // Calcul de la taille du jeu de caracteres
    let charsetSize = 0;
    if (hasLowercase) charsetSize += 26;
    if (hasUppercase) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSymbols) charsetSize += 33;

    // Verification des patterns communs
    const isCommonPattern = COMMON_PATTERNS.some(pattern => pattern.test(password)) ||
                           COMMON_WORDS.some(word => password.toLowerCase().includes(word));

    // Calcul des combinaisons possibles
    const possibleCombinations = Math.pow(charsetSize, password.length);

    // Calcul du temps de craquage
    let crackTimeSeconds = possibleCombinations / ATTEMPTS_PER_SECOND;

    // Reduire le temps si pattern commun detecte
    if (isCommonPattern) {
        crackTimeSeconds = crackTimeSeconds / 1000000; // Division significative
        if (crackTimeSeconds < 0.001) crackTimeSeconds = 0.001;
    }

    // Determiner la force
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
        return { value: 'Instantane', unit: '' };
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
        return { value: val, unit: val === 1 ? 'siecle' : 'siecles' };
    }
    if (seconds < 86400 * 365 * 1000000000) {
        const val = Math.round(seconds / (86400 * 365 * 1000000));
        return { value: val, unit: 'millions d\'annees' };
    }
    return { value: 'Virtuellement', unit: 'impossible' };
}

function updateDisplay(analysis) {
    // Mettre a jour les valeurs de detail
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

    // Mettre a jour le metre de force
    let meterWidth = 0;
    let meterColor = '#64748b';
    let strengthText = 'Entre un mot de passe';

    switch (analysis.strength) {
        case 'instant':
            meterWidth = 15;
            meterColor = '#ef4444';
            strengthText = 'Tres faible - Craque instantanement !';
            break;
        case 'weak':
            meterWidth = 35;
            meterColor = '#f59e0b';
            strengthText = 'Faible - Craque en quelques minutes/heures';
            break;
        case 'medium':
            meterWidth = 55;
            meterColor = '#eab308';
            strengthText = 'Moyen - Pourrait resister quelques jours';
            break;
        case 'strong':
            meterWidth = 75;
            meterColor = '#22c55e';
            strengthText = 'Fort - Resisterait des annees';
            break;
        case 'very-strong':
            meterWidth = 100;
            meterColor = '#14b8a6';
            strengthText = 'Tres fort - Pratiquement impossible a craquer';
            break;
    }

    meterFill.style.width = `${meterWidth}%`;
    meterFill.style.background = meterColor;
    strengthLabel.textContent = strengthText;
    strengthLabel.style.color = meterColor;

    // Mettre a jour l'affichage du temps
    const formattedTime = formatTime(analysis.crackTimeSeconds);
    if (formattedTime.unit) {
        timeValue.textContent = `${formattedTime.value} ${formattedTime.unit}`;
    } else {
        timeValue.textContent = formattedTime.value;
    }

    // Mettre a jour l'icone et la classe
    crackTimeDisplay.className = `crack-time-display ${analysis.strength}`;

    switch (analysis.strength) {
        case 'instant':
            timeIcon.innerHTML = '&#9888;'; // Warning
            timeLabel.textContent = 'Tres dangereux !';
            break;
        case 'weak':
            timeIcon.innerHTML = '&#128274;'; // Cadenas ouvert
            timeLabel.textContent = 'Temps de craquage estime';
            break;
        case 'medium':
            timeIcon.innerHTML = '&#9202;'; // Horloge
            timeLabel.textContent = 'Temps de craquage estime';
            break;
        case 'strong':
            timeIcon.innerHTML = '&#128272;'; // Cle
            timeLabel.textContent = 'Temps de craquage estime';
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

    // Mettre a jour l'explication
    updateExplanation(analysis);
}

function updateExplanation(analysis) {
    if (analysis.length === 0) {
        explanationText.innerHTML = 'Entre un mot de passe pour voir l\'analyse.';
        return;
    }

    let explanation = '';

    // Explication du calcul
    explanation += `<strong>Taille du jeu de caracteres :</strong> ${analysis.charsetSize} possibilites par caractere<br>`;
    explanation += `<em>(`;
    if (analysis.hasLowercase) explanation += '26 minuscules';
    if (analysis.hasUppercase) explanation += (analysis.hasLowercase ? ' + ' : '') + '26 majuscules';
    if (analysis.hasNumbers) explanation += ((analysis.hasLowercase || analysis.hasUppercase) ? ' + ' : '') + '10 chiffres';
    if (analysis.hasSymbols) explanation += ((analysis.hasLowercase || analysis.hasUppercase || analysis.hasNumbers) ? ' + ' : '') + '33 symboles';
    explanation += `)</em><br><br>`;

    explanation += `<strong>Combinaisons possibles :</strong> ${analysis.charsetSize}^${analysis.length} = `;

    if (analysis.possibleCombinations > 1e15) {
        explanation += `${analysis.possibleCombinations.toExponential(2)} combinaisons<br><br>`;
    } else {
        explanation += `${analysis.possibleCombinations.toLocaleString('fr-FR')} combinaisons<br><br>`;
    }

    explanation += `<strong>Vitesse de test :</strong> 10 milliards d'essais/seconde<br><br>`;

    if (analysis.isCommonPattern) {
        explanation += `<span style="color: #ef4444;"><strong>Attention :</strong> Ce mot de passe contient un pattern commun ou un mot connu ! Les hackers testent ces patterns en priorite, ce qui reduit drastiquement le temps de craquage.</span>`;
    }

    explanationText.innerHTML = explanation;
}

// ===== EVENEMENTS ANALYSEUR =====

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

// ===== EVENEMENTS ONGLETS =====

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        // Mettre a jour les boutons
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Mettre a jour le contenu
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

    // Desactiver tous les boutons
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
        feedback.textContent = 'Bravo ! Bonne reponse !';
        feedback.classList.add('success');
        quizScore++;
        quizScoreSpan.textContent = quizScore;
    } else {
        selectedOption.classList.add('incorrect');
        feedback.textContent = 'Oups ! Ce n\'est pas le bon choix.';
        feedback.classList.add('error');

        // Montrer la bonne reponse
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
            quizNextBtn.textContent = 'Voir le resultat';
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
        message = 'Parfait ! Tu maitrises completement les concepts de securite des mots de passe !';
    } else if (quizScore >= 4) {
        message = 'Tres bien ! Tu comprends bien ce qui rend un mot de passe difficile a craquer.';
    } else if (quizScore >= 2) {
        message = 'Pas mal ! Continue a explorer l\'analyseur pour mieux comprendre.';
    } else {
        message = 'Utilise l\'analyseur pour experimenter avec differents mots de passe !';
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
