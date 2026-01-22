// Variables globales
let currentStep = 1;
const totalSteps = 5;
let originalPhrase = '';
let passwordSteps = {
    step2: '',
    step3: '',
    step4: '',
    step5: ''
};
let selectedSpecialChar = '!';

// Éléments DOM
const stepCards = document.querySelectorAll('.step-card');
const progressSteps = document.querySelectorAll('.progress-step');
const progressLines = document.querySelectorAll('.progress-line');
const progressContainer = document.querySelector('.progress-container');
const resultCard = document.getElementById('resultCard');

// Boutons
const step1Btn = document.getElementById('step1Btn');
const step2Btn = document.getElementById('step2Btn');
const step3Btn = document.getElementById('step3Btn');
const step4Btn = document.getElementById('step4Btn');
const step5Btn = document.getElementById('step5Btn');
const restartBtn = document.getElementById('restartBtn');
const copyBtn = document.getElementById('copyBtn');

// Inputs
const phraseInput = document.getElementById('phraseInput');

// Caractères spéciaux
const charOptions = document.querySelectorAll('.char-option');

// Initialisation
function init() {
    // Événement étape 1
    step1Btn.addEventListener('click', handleStep1);
    phraseInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleStep1();
    });

    // Événements autres étapes
    step2Btn.addEventListener('click', () => goToStep(3));
    step3Btn.addEventListener('click', () => goToStep(4));
    step4Btn.addEventListener('click', () => goToStep(5));
    step5Btn.addEventListener('click', showResult);

    // Événement restart
    restartBtn.addEventListener('click', restart);

    // Événement copier
    copyBtn.addEventListener('click', copyPassword);

    // Événements caractères spéciaux
    charOptions.forEach(option => {
        option.addEventListener('click', () => selectSpecialChar(option));
    });
}

// Étape 1 : Récupérer la phrase
function handleStep1() {
    const phrase = phraseInput.value.trim();

    if (phrase.length < 10) {
        phraseInput.style.borderColor = '#ef4444';
        phraseInput.placeholder = 'Ta phrase est trop courte ! Minimum 10 caractères.';
        return;
    }

    const words = phrase.split(/\s+/);
    if (words.length < 4) {
        phraseInput.style.borderColor = '#ef4444';
        phraseInput.placeholder = 'Ajoute plus de mots ! Minimum 4 mots.';
        return;
    }

    originalPhrase = phrase;

    // Générer les transformations
    generateAllTransformations();

    // Passer à l'étape 2
    goToStep(2);
}

// Générer toutes les transformations
function generateAllTransformations() {
    // Étape 2 : Premières lettres
    passwordSteps.step2 = getFirstLetters(originalPhrase);

    // Étape 3 : Ajouter des chiffres
    passwordSteps.step3 = addNumbers(passwordSteps.step2);

    // Étape 4 : Ajouter caractère spécial
    passwordSteps.step4 = addSpecialChar(passwordSteps.step3, selectedSpecialChar);

    // Étape 5 : Mélanger majuscules/minuscules
    passwordSteps.step5 = mixCase(passwordSteps.step4);
}

// Extraire les premières lettres
function getFirstLetters(phrase) {
    // Séparer par espaces et garder uniquement les mots
    const words = phrase.split(/\s+/).filter(word => word.length > 0);

    // Prendre la première lettre de chaque mot
    let result = '';
    words.forEach(word => {
        // Garder la première lettre (ou le premier caractère si c'est un apostrophe suivi d'une lettre)
        if (word.startsWith("'") || word.startsWith("'")) {
            if (word.length > 1) {
                result += word.charAt(1);
            }
        } else {
            result += word.charAt(0);
        }
    });

    return result;
}

// Remplacer certaines lettres par des chiffres
function addNumbers(text) {
    const substitutions = {
        'a': '4', 'A': '4',
        'e': '3', 'E': '3',
        'i': '1', 'I': '1',
        'o': '0', 'O': '0',
        's': '5', 'S': '5'
    };

    let result = '';
    let hasSubstituted = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        // Ne pas tout remplacer, juste quelques occurrences
        if (substitutions[char] && (i % 2 === 0 || !hasSubstituted)) {
            result += substitutions[char];
            hasSubstituted = true;
        } else {
            result += char;
        }
    }

    // S'assurer qu'il y a au moins un chiffre
    if (!/\d/.test(result)) {
        // Ajouter un chiffre à la fin si aucun n'a été ajouté
        result += '1';
    }

    return result;
}

// Ajouter un caractère spécial
function addSpecialChar(text, char) {
    // Ajouter au début et à la fin
    return text + char;
}

// Mélanger majuscules et minuscules
function mixCase(text) {
    let result = '';
    let upperNext = true;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Ne pas modifier les chiffres et caractères spéciaux
        if (/[a-zA-Z]/.test(char)) {
            if (upperNext) {
                result += char.toUpperCase();
            } else {
                result += char.toLowerCase();
            }
            upperNext = !upperNext;
        } else {
            result += char;
        }
    }

    return result;
}

// Sélectionner un caractère spécial
function selectSpecialChar(option) {
    // Retirer la sélection précédente
    charOptions.forEach(opt => opt.classList.remove('selected'));

    // Ajouter la sélection
    option.classList.add('selected');
    selectedSpecialChar = option.getAttribute('data-char');

    // Mettre à jour les transformations
    if (passwordSteps.step3) {
        passwordSteps.step4 = addSpecialChar(passwordSteps.step3, selectedSpecialChar);
        passwordSteps.step5 = mixCase(passwordSteps.step4);

        // Mettre à jour l'affichage si on est sur l'étape 4
        if (currentStep === 4) {
            document.getElementById('step4Result').textContent = passwordSteps.step4;
        }
    }
}

// Passer à une étape
function goToStep(step) {
    // Cacher l'étape actuelle
    stepCards.forEach(card => card.classList.remove('active'));

    // Afficher la nouvelle étape
    const newCard = document.querySelector(`.step-card[data-step="${step}"]`);
    if (newCard) {
        newCard.classList.add('active');
    }

    // Mettre à jour la progression
    updateProgress(step);

    // Mettre à jour les valeurs affichées
    updateStepDisplay(step);

    currentStep = step;
}

// Mettre à jour l'affichage des étapes
function updateStepDisplay(step) {
    switch (step) {
        case 2:
            document.getElementById('originalPhrase').textContent = originalPhrase;
            document.getElementById('step2Result').textContent = passwordSteps.step2;
            break;
        case 3:
            document.getElementById('step3Before').textContent = passwordSteps.step2;
            document.getElementById('step3Result').textContent = passwordSteps.step3;
            break;
        case 4:
            document.getElementById('step4Before').textContent = passwordSteps.step3;
            document.getElementById('step4Result').textContent = passwordSteps.step4;
            break;
        case 5:
            document.getElementById('step5Before').textContent = passwordSteps.step4;
            document.getElementById('step5Result').textContent = passwordSteps.step5;
            break;
    }
}

// Mettre à jour la barre de progression
function updateProgress(step) {
    progressSteps.forEach((stepEl, index) => {
        const stepNum = index + 1;
        stepEl.classList.remove('active', 'completed');

        if (stepNum < step) {
            stepEl.classList.add('completed');
        } else if (stepNum === step) {
            stepEl.classList.add('active');
        }
    });

    progressLines.forEach((line, index) => {
        if (index < step - 1) {
            line.classList.add('completed');
        } else {
            line.classList.remove('completed');
        }
    });
}

// Afficher le résultat
function showResult() {
    // Cacher toutes les étapes
    stepCards.forEach(card => card.classList.remove('active'));
    progressContainer.classList.add('hidden');

    // Afficher le résultat
    resultCard.classList.add('show');

    // Afficher le mot de passe final
    const finalPassword = passwordSteps.step5;
    document.getElementById('finalPassword').textContent = finalPassword;

    // Calculer et afficher le score
    calculateAndDisplayScore(finalPassword);
}

// Calculer et afficher le score
function calculateAndDisplayScore(password) {
    let score = 0;
    const analysis = {
        length: password.length,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%&*]/.test(password)
    };

    // Points pour la longueur (max 40 points)
    if (analysis.length >= 12) {
        score += 40;
    } else if (analysis.length >= 10) {
        score += 30;
    } else if (analysis.length >= 8) {
        score += 20;
    } else {
        score += 10;
    }

    // Points pour majuscules (15 points)
    if (analysis.hasUpper) score += 15;

    // Points pour minuscules (15 points)
    if (analysis.hasLower) score += 15;

    // Points pour chiffres (15 points)
    if (analysis.hasNumber) score += 15;

    // Points pour caractères spéciaux (15 points)
    if (analysis.hasSpecial) score += 15;

    // Afficher la longueur
    document.getElementById('pwdLength').textContent = analysis.length;

    // Afficher les résultats de l'analyse
    updateScoreItem('lengthScore', analysis.length >= 8);
    updateScoreItem('upperScore', analysis.hasUpper);
    updateScoreItem('lowerScore', analysis.hasLower);
    updateScoreItem('numberScore', analysis.hasNumber);
    updateScoreItem('specialScore', analysis.hasSpecial);

    // Afficher le score total
    document.getElementById('totalScore').textContent = score;

    // Déterminer la force du mot de passe
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    strengthFill.classList.remove('weak', 'medium', 'strong');
    strengthText.classList.remove('weak', 'medium', 'strong');

    if (score >= 85) {
        strengthFill.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = 'Excellent ! Très fort';
    } else if (score >= 60) {
        strengthFill.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = 'Bon, mais peut être amélioré';
    } else {
        strengthFill.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = 'Faible, continue à améliorer';
    }

    // Message de félicitations
    const victoryText = document.getElementById('victoryText');
    if (score >= 85) {
        victoryText.textContent = 'Félicitations ! Tu as créé un mot de passe très solide. Il serait extrêmement difficile pour un hacker de le deviner !';
    } else if (score >= 60) {
        victoryText.textContent = 'Bien joué ! Ton mot de passe est correct. Pour le rendre encore plus fort, essaie avec une phrase plus longue !';
    } else {
        victoryText.textContent = 'C\'est un début ! Essaie avec une phrase plus longue pour obtenir un mot de passe plus sécurisé.';
    }
}

// Mettre à jour un élément de score
function updateScoreItem(elementId, isValid) {
    const element = document.getElementById(elementId);
    const icon = element.querySelector('.score-icon');

    if (isValid) {
        icon.textContent = '\u2713';
        icon.classList.add('check');
        icon.classList.remove('cross');
    } else {
        icon.textContent = '\u2717';
        icon.classList.add('cross');
        icon.classList.remove('check');
    }
}

// Copier le mot de passe
function copyPassword() {
    const password = document.getElementById('finalPassword').textContent;

    navigator.clipboard.writeText(password).then(() => {
        const copyBtnElement = document.getElementById('copyBtn');
        const copyIcon = copyBtnElement.querySelector('.copy-icon');
        const originalText = copyIcon.textContent;
        copyIcon.textContent = '\u2713';
        copyIcon.style.color = '#22c55e';

        setTimeout(() => {
            copyIcon.textContent = originalText;
            copyIcon.style.color = '';
        }, 2000);
    }).catch(() => {
        // Fallback pour les navigateurs anciens
        const textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// Recommencer
function restart() {
    // Réinitialiser les variables
    currentStep = 1;
    originalPhrase = '';
    passwordSteps = {
        step2: '',
        step3: '',
        step4: '',
        step5: ''
    };
    selectedSpecialChar = '!';

    // Réinitialiser l'input
    phraseInput.value = '';
    phraseInput.style.borderColor = '#334155';
    phraseInput.placeholder = 'Ex: J\'aime jouer au foot le mercredi soir';

    // Réinitialiser la sélection des caractères spéciaux
    charOptions.forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.char-option[data-char="!"]').classList.add('selected');

    // Cacher le résultat
    resultCard.classList.remove('show');

    // Réinitialiser la progression
    progressContainer.classList.remove('hidden');
    progressSteps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    progressSteps[0].classList.add('active');
    progressLines.forEach(line => line.classList.remove('completed'));

    // Afficher la première étape
    stepCards.forEach(card => card.classList.remove('active'));
    stepCards[0].classList.add('active');
}

// Lancer l'initialisation
init();
