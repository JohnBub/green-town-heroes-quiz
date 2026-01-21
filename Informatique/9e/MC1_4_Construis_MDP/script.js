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

// Elements DOM
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

// Caracteres speciaux
const charOptions = document.querySelectorAll('.char-option');

// Initialisation
function init() {
    // Evenement etape 1
    step1Btn.addEventListener('click', handleStep1);
    phraseInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleStep1();
    });

    // Evenements autres etapes
    step2Btn.addEventListener('click', () => goToStep(3));
    step3Btn.addEventListener('click', () => goToStep(4));
    step4Btn.addEventListener('click', () => goToStep(5));
    step5Btn.addEventListener('click', showResult);

    // Evenement restart
    restartBtn.addEventListener('click', restart);

    // Evenement copier
    copyBtn.addEventListener('click', copyPassword);

    // Evenements caracteres speciaux
    charOptions.forEach(option => {
        option.addEventListener('click', () => selectSpecialChar(option));
    });
}

// Etape 1 : Recuperer la phrase
function handleStep1() {
    const phrase = phraseInput.value.trim();

    if (phrase.length < 10) {
        phraseInput.style.borderColor = '#ef4444';
        phraseInput.placeholder = 'Ta phrase est trop courte ! Minimum 10 caracteres.';
        return;
    }

    const words = phrase.split(/\s+/);
    if (words.length < 4) {
        phraseInput.style.borderColor = '#ef4444';
        phraseInput.placeholder = 'Ajoute plus de mots ! Minimum 4 mots.';
        return;
    }

    originalPhrase = phrase;

    // Generer les transformations
    generateAllTransformations();

    // Passer a l'etape 2
    goToStep(2);
}

// Generer toutes les transformations
function generateAllTransformations() {
    // Etape 2 : Premieres lettres
    passwordSteps.step2 = getFirstLetters(originalPhrase);

    // Etape 3 : Ajouter des chiffres
    passwordSteps.step3 = addNumbers(passwordSteps.step2);

    // Etape 4 : Ajouter caractere special
    passwordSteps.step4 = addSpecialChar(passwordSteps.step3, selectedSpecialChar);

    // Etape 5 : Melanger majuscules/minuscules
    passwordSteps.step5 = mixCase(passwordSteps.step4);
}

// Extraire les premieres lettres
function getFirstLetters(phrase) {
    // Separer par espaces et garder uniquement les mots
    const words = phrase.split(/\s+/).filter(word => word.length > 0);

    // Prendre la premiere lettre de chaque mot
    let result = '';
    words.forEach(word => {
        // Garder la premiere lettre (ou le premier caractere si c'est un apostrophe suivi d'une lettre)
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
        // Ajouter un chiffre a la fin si aucun n'a ete ajoute
        result += '1';
    }

    return result;
}

// Ajouter un caractere special
function addSpecialChar(text, char) {
    // Ajouter au debut et a la fin
    return text + char;
}

// Melanger majuscules et minuscules
function mixCase(text) {
    let result = '';
    let upperNext = true;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Ne pas modifier les chiffres et caracteres speciaux
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

// Selectionner un caractere special
function selectSpecialChar(option) {
    // Retirer la selection precedente
    charOptions.forEach(opt => opt.classList.remove('selected'));

    // Ajouter la selection
    option.classList.add('selected');
    selectedSpecialChar = option.getAttribute('data-char');

    // Mettre a jour les transformations
    if (passwordSteps.step3) {
        passwordSteps.step4 = addSpecialChar(passwordSteps.step3, selectedSpecialChar);
        passwordSteps.step5 = mixCase(passwordSteps.step4);

        // Mettre a jour l'affichage si on est sur l'etape 4
        if (currentStep === 4) {
            document.getElementById('step4Result').textContent = passwordSteps.step4;
        }
    }
}

// Passer a une etape
function goToStep(step) {
    // Cacher l'etape actuelle
    stepCards.forEach(card => card.classList.remove('active'));

    // Afficher la nouvelle etape
    const newCard = document.querySelector(`.step-card[data-step="${step}"]`);
    if (newCard) {
        newCard.classList.add('active');
    }

    // Mettre a jour la progression
    updateProgress(step);

    // Mettre a jour les valeurs affichees
    updateStepDisplay(step);

    currentStep = step;
}

// Mettre a jour l'affichage des etapes
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

// Mettre a jour la barre de progression
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

// Afficher le resultat
function showResult() {
    // Cacher toutes les etapes
    stepCards.forEach(card => card.classList.remove('active'));
    progressContainer.classList.add('hidden');

    // Afficher le resultat
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

    // Points pour caracteres speciaux (15 points)
    if (analysis.hasSpecial) score += 15;

    // Afficher la longueur
    document.getElementById('pwdLength').textContent = analysis.length;

    // Afficher les resultats de l'analyse
    updateScoreItem('lengthScore', analysis.length >= 8);
    updateScoreItem('upperScore', analysis.hasUpper);
    updateScoreItem('lowerScore', analysis.hasLower);
    updateScoreItem('numberScore', analysis.hasNumber);
    updateScoreItem('specialScore', analysis.hasSpecial);

    // Afficher le score total
    document.getElementById('totalScore').textContent = score;

    // Determiner la force du mot de passe
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    strengthFill.classList.remove('weak', 'medium', 'strong');
    strengthText.classList.remove('weak', 'medium', 'strong');

    if (score >= 85) {
        strengthFill.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = 'Excellent ! Tres fort';
    } else if (score >= 60) {
        strengthFill.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = 'Bon, mais peut etre ameliore';
    } else {
        strengthFill.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = 'Faible, continue a ameliorer';
    }

    // Message de felicitations
    const victoryText = document.getElementById('victoryText');
    if (score >= 85) {
        victoryText.textContent = 'Felicitations ! Tu as cree un mot de passe tres solide. Il serait extremement difficile pour un hacker de le deviner !';
    } else if (score >= 60) {
        victoryText.textContent = 'Bien joue ! Ton mot de passe est correct. Pour le rendre encore plus fort, essaie avec une phrase plus longue !';
    } else {
        victoryText.textContent = 'C\'est un debut ! Essaie avec une phrase plus longue pour obtenir un mot de passe plus securise.';
    }
}

// Mettre a jour un element de score
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
    // Reinitialiser les variables
    currentStep = 1;
    originalPhrase = '';
    passwordSteps = {
        step2: '',
        step3: '',
        step4: '',
        step5: ''
    };
    selectedSpecialChar = '!';

    // Reinitialiser l'input
    phraseInput.value = '';
    phraseInput.style.borderColor = '#334155';
    phraseInput.placeholder = 'Ex: J\'aime jouer au foot le mercredi soir';

    // Reinitialiser la selection des caracteres speciaux
    charOptions.forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.char-option[data-char="!"]').classList.add('selected');

    // Cacher le resultat
    resultCard.classList.remove('show');

    // Reinitialiser la progression
    progressContainer.classList.remove('hidden');
    progressSteps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    progressSteps[0].classList.add('active');
    progressLines.forEach(line => line.classList.remove('completed'));

    // Afficher la premiere etape
    stepCards.forEach(card => card.classList.remove('active'));
    stepCards[0].classList.add('active');
}

// Lancer l'initialisation
init();
