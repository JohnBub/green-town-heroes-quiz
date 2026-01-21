// Scenarios data
const scenarios = [
    {
        icon: "📧",
        context: "Tu es chez toi et tu consultes tes emails...",
        question: "Tu reçois un email de ta banque te demandant de confirmer tes identifiants en cliquant sur un lien. Que fais-tu ?",
        choices: [
            { text: "Je clique sur le lien et je me connecte pour vérifier", type: "wrong" },
            { text: "J'appelle ma banque directement pour vérifier si c'est légitime", type: "best" },
            { text: "Je réponds à l'email avec mes informations", type: "wrong" },
            { text: "Je supprime l'email et j'ignore", type: "ok" }
        ],
        explanations: {
            best: "Excellent réflexe ! Appeler directement ta banque (avec le numéro officiel, pas celui de l'email) est la meilleure façon de vérifier. Les banques ne demandent JAMAIS tes identifiants par email.",
            ok: "Supprimer l'email est prudent, mais appeler ta banque pour signaler cette tentative de phishing serait encore mieux. Cela aide à protéger d'autres personnes.",
            wrong: "Attention ! C'est exactement ce que veulent les pirates. Les liens dans ces emails mènent à de faux sites qui volent tes informations. C'est du phishing !"
        }
    },
    {
        icon: "🎬",
        context: "Ton meilleur ami te fait une demande...",
        question: "Un ami te demande ton mot de passe Netflix pour regarder un film ce soir. Que fais-tu ?",
        choices: [
            { text: "Je lui donne, c'est mon ami et j'ai confiance", type: "wrong" },
            { text: "Je refuse poliment en expliquant pourquoi", type: "best" },
            { text: "Je lui crée un profil sur mon compte", type: "ok" },
            { text: "Je lui donne et je change mon mot de passe après", type: "wrong" }
        ],
        explanations: {
            best: "Parfait ! Un mot de passe ne se partage jamais, même avec un ami. Explique-lui que c'est une question de sécurité, pas de confiance.",
            ok: "Créer un profil est une solution de compromis, mais attention : partager ton compte peut violer les conditions d'utilisation et ton ami aura quand même accès à tes informations de paiement.",
            wrong: "Partager un mot de passe, même temporairement, est risqué. Ton ami pourrait le noter, l'utiliser ailleurs, ou son appareil pourrait être compromis."
        }
    },
    {
        icon: "🔌",
        context: "Tu es dans la cour de récréation...",
        question: "Tu trouves une clé USB par terre. Que fais-tu ?",
        choices: [
            { text: "Je la branche sur mon ordinateur pour voir ce qu'il y a dessus", type: "wrong" },
            { text: "Je la donne à un adulte ou à la vie scolaire", type: "best" },
            { text: "Je la garde pour moi, ça peut toujours servir", type: "wrong" },
            { text: "Je la jette à la poubelle", type: "ok" }
        ],
        explanations: {
            best: "Excellent choix ! Une clé USB inconnue peut contenir des virus qui s'exécutent automatiquement. La donner à un adulte permet de retrouver le propriétaire en toute sécurité.",
            ok: "La jeter évite le risque d'infection, mais ce n'est pas idéal car elle pourrait appartenir à quelqu'un qui a perdu des fichiers importants.",
            wrong: "Danger ! Les pirates laissent parfois des clés USB infectées exprès. Dès que tu la branches, un virus peut s'installer automatiquement sur ton ordinateur."
        }
    },
    {
        icon: "📶",
        context: "Tu es au centre commercial avec des amis...",
        question: "Tu veux te connecter à Internet et tu vois un WiFi gratuit 'Centre_Commercial_Free'. Que fais-tu ?",
        choices: [
            { text: "Je me connecte et je consulte mes réseaux sociaux", type: "ok" },
            { text: "Je me connecte et je fais un achat en ligne", type: "wrong" },
            { text: "Je demande au personnel si c'est bien leur WiFi officiel", type: "best" },
            { text: "J'utilise plutôt mes données mobiles", type: "ok" }
        ],
        explanations: {
            best: "Super réflexe ! Les pirates créent souvent de faux réseaux WiFi avec des noms crédibles. Vérifier auprès du personnel est la meilleure protection.",
            ok: "Utiliser tes données mobiles est plus sûr qu'un WiFi public. Pour les réseaux sociaux sur WiFi public, c'est acceptable si tu ne fais rien de sensible.",
            wrong: "Très risqué ! Sur un WiFi public (même légitime), tes données bancaires peuvent être interceptées. Ne jamais faire d'achats ou de connexions sensibles sur WiFi public !"
        }
    },
    {
        icon: "📸",
        context: "Après une sortie scolaire...",
        question: "Tu as pris de super photos de tes amis. L'un d'eux te demande de les poster sur Instagram. Que fais-tu ?",
        choices: [
            { text: "Je poste toutes les photos, elles sont trop bien !", type: "wrong" },
            { text: "Je demande l'accord de chaque personne visible sur les photos", type: "best" },
            { text: "Je poste seulement les photos où tout le monde sourit", type: "wrong" },
            { text: "Je les envoie d'abord en privé pour avoir leur avis", type: "ok" }
        ],
        explanations: {
            best: "Parfait ! Chaque personne a le droit à son image. Demander l'accord AVANT de publier est obligatoire légalement et respectueux.",
            ok: "Bonne idée de partager d'abord en privé ! Mais demander explicitement l'accord pour une publication publique serait encore mieux.",
            wrong: "Même si les photos sont réussies, tu n'as pas le droit de publier l'image de quelqu'un sans son consentement. C'est une question de respect ET de loi !"
        }
    },
    {
        icon: "👤",
        context: "Sur ton réseau social préféré...",
        question: "Tu reçois une demande d'ami d'un profil que tu ne connais pas, mais qui a 15 amis en commun avec toi. Que fais-tu ?",
        choices: [
            { text: "J'accepte, on a plein d'amis en commun", type: "wrong" },
            { text: "Je demande à mes amis s'ils connaissent vraiment cette personne", type: "best" },
            { text: "Je refuse sans réfléchir", type: "ok" },
            { text: "J'accepte et je lui envoie un message pour savoir qui c'est", type: "wrong" }
        ],
        explanations: {
            best: "Excellente idée ! Vérifier auprès de tes vrais amis permet de savoir si c'est une vraie personne ou un faux profil. Les pirates créent de faux comptes avec des amis en commun.",
            ok: "Refuser par prudence est bien, mais vérifier auprès de tes amis pourrait t'éviter de refuser quelqu'un que tu connais vraiment.",
            wrong: "Attention ! Les faux profils utilisent souvent les amis en commun pour paraître crédibles. Une fois accepté, cette personne a accès à tes informations personnelles."
        }
    },
    {
        icon: "💾",
        context: "Tu veux télécharger un logiciel...",
        question: "Tu cherches un logiciel gratuit de montage vidéo. Tu trouves un site qui propose la version 'crackée' d'un logiciel payant. Que fais-tu ?",
        choices: [
            { text: "Je télécharge, c'est gratuit et ça a l'air bien", type: "wrong" },
            { text: "Je cherche une alternative gratuite et légale", type: "best" },
            { text: "Je demande à un ami de me le passer sur clé USB", type: "wrong" },
            { text: "J'utilise la version d'essai du logiciel officiel", type: "ok" }
        ],
        explanations: {
            best: "Excellent choix ! Il existe de nombreux logiciels gratuits et légaux (DaVinci Resolve, Shotcut, etc.). Ils sont sûrs et souvent très performants.",
            ok: "La version d'essai est légale et sûre. C'est une bonne option pour tester, mais chercher une alternative gratuite serait encore mieux à long terme.",
            wrong: "Les logiciels 'crackés' contiennent presque toujours des virus ou des logiciels espions. C'est aussi illégal ! Les pirates comptent sur l'envie d'avoir du gratuit."
        }
    },
    {
        icon: "🔐",
        context: "Tu crées un compte sur un nouveau site...",
        question: "Le site te demande de créer un mot de passe. Que choisis-tu ?",
        choices: [
            { text: "Mon prénom + ma date de naissance (Marie2011)", type: "wrong" },
            { text: "Une phrase que je peux retenir avec des chiffres et symboles (J'aime-le-Foot-depuis-2018!)", type: "best" },
            { text: "Le même mot de passe que mes autres comptes pour ne pas l'oublier", type: "wrong" },
            { text: "Un mot de passe généré automatiquement que je note sur un papier", type: "ok" }
        ],
        explanations: {
            best: "Parfait ! Une phrase de passe longue avec des caractères variés est très sécurisée ET facile à retenir. C'est la meilleure méthode !",
            ok: "Un mot de passe généré est très sécurisé, mais le noter sur papier est risqué. Un gestionnaire de mots de passe serait plus sûr.",
            wrong: "Les informations personnelles sont faciles à deviner (réseaux sociaux, piratage). Utiliser le même mot de passe partout signifie que si un site est piraté, tous tes comptes sont en danger !"
        }
    }
];

// Game state
let currentScenarioIndex = 0;
let score = 0;
let bestCount = 0;
let okCount = 0;
let wrongCount = 0;

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const progressFill = document.getElementById('progress-fill');
const currentScenarioEl = document.getElementById('current-scenario');
const totalScenariosEl = document.getElementById('total-scenarios');
const currentScoreEl = document.getElementById('current-score');
const scenarioIcon = document.getElementById('scenario-icon');
const scenarioContext = document.getElementById('scenario-context');
const scenarioQuestion = document.getElementById('scenario-question');
const choicesContainer = document.getElementById('choices-container');
const feedbackCard = document.getElementById('feedback-card');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackPoints = document.getElementById('feedback-points');
const feedbackExplanation = document.getElementById('feedback-explanation');

// Initialize game
function init() {
    totalScenariosEl.textContent = scenarios.length;
    document.getElementById('max-score').textContent = scenarios.length * 10;

    startBtn.addEventListener('click', startGame);
    nextBtn.addEventListener('click', nextScenario);
    restartBtn.addEventListener('click', restartGame);
}

// Start game
function startGame() {
    currentScenarioIndex = 0;
    score = 0;
    bestCount = 0;
    okCount = 0;
    wrongCount = 0;

    showScreen(gameScreen);
    loadScenario();
}

// Show specific screen
function showScreen(screen) {
    [startScreen, gameScreen, resultsScreen].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// Create a choice button element safely
function createChoiceButton(letter, text, index) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';

    const letterSpan = document.createElement('span');
    letterSpan.className = 'choice-letter';
    letterSpan.textContent = letter;

    const textSpan = document.createElement('span');
    textSpan.className = 'choice-text';
    textSpan.textContent = text;

    btn.appendChild(letterSpan);
    btn.appendChild(textSpan);
    btn.addEventListener('click', () => selectChoice(index));

    return btn;
}

// Load current scenario
function loadScenario() {
    const scenario = scenarios[currentScenarioIndex];

    // Update progress
    progressFill.style.width = ((currentScenarioIndex) / scenarios.length) * 100 + '%';
    currentScenarioEl.textContent = currentScenarioIndex + 1;
    currentScoreEl.textContent = score;

    // Update scenario card
    scenarioIcon.textContent = scenario.icon;
    scenarioContext.textContent = scenario.context;
    scenarioQuestion.textContent = scenario.question;

    // Reset feedback
    feedbackCard.classList.remove('show', 'best', 'ok', 'wrong');

    // Clear and create choice buttons
    choicesContainer.textContent = '';
    const letters = ['A', 'B', 'C', 'D'];

    scenario.choices.forEach((choice, index) => {
        const btn = createChoiceButton(letters[index], choice.text, index);
        choicesContainer.appendChild(btn);
    });
}

// Handle choice selection
function selectChoice(index) {
    const scenario = scenarios[currentScenarioIndex];
    const choice = scenario.choices[index];
    const buttons = choicesContainer.querySelectorAll('.choice-btn');

    // Disable all buttons
    buttons.forEach(btn => btn.classList.add('disabled'));

    // Highlight selected and best answer
    buttons[index].classList.add('selected-' + choice.type);

    // Find and highlight the best answer if user didn't choose it
    if (choice.type !== 'best') {
        const bestIndex = scenario.choices.findIndex(c => c.type === 'best');
        buttons[bestIndex].classList.add('reveal-best');
    }

    // Update score and counts
    let points = 0;
    if (choice.type === 'best') {
        points = 10;
        bestCount++;
    } else if (choice.type === 'ok') {
        points = 5;
        okCount++;
    } else {
        wrongCount++;
    }
    score += points;
    currentScoreEl.textContent = score;

    // Show feedback
    showFeedback(choice.type, scenario.explanations[choice.type], points);
}

// Show feedback card
function showFeedback(type, explanation, points) {
    feedbackCard.className = 'feedback-card show ' + type;

    if (type === 'best') {
        feedbackIcon.textContent = '✓';
        feedbackTitle.textContent = 'Excellent choix !';
    } else if (type === 'ok') {
        feedbackIcon.textContent = '~';
        feedbackTitle.textContent = 'Acceptable, mais...';
    } else {
        feedbackIcon.textContent = '✗';
        feedbackTitle.textContent = 'À éviter !';
    }

    feedbackPoints.textContent = '+' + points + ' pts';
    feedbackExplanation.textContent = explanation;

    // Update button text for last scenario
    if (currentScenarioIndex === scenarios.length - 1) {
        nextBtn.textContent = 'Voir les résultats';
    } else {
        nextBtn.textContent = 'Suivant';
    }
}

// Go to next scenario
function nextScenario() {
    currentScenarioIndex++;

    if (currentScenarioIndex >= scenarios.length) {
        showResults();
    } else {
        loadScenario();
    }
}

// Show final results
function showResults() {
    showScreen(resultsScreen);

    // Update progress to 100%
    progressFill.style.width = '100%';

    // Calculate percentage
    const maxScore = scenarios.length * 10;
    const percentage = (score / maxScore) * 100;

    // Update score display
    document.getElementById('final-score').textContent = score;

    // Determine security level
    const levelValue = document.getElementById('level-value');
    const resultsIcon = document.getElementById('results-icon');
    const resultsMessage = document.getElementById('results-message');

    if (percentage >= 90) {
        levelValue.textContent = 'Expert en cybersécurité';
        levelValue.className = 'level-value expert';
        resultsIcon.textContent = '🏆';
        resultsMessage.textContent = 'Félicitations ! Tu as d\'excellents réflexes en matière de sécurité informatique. Continue à rester vigilant(e) et à partager ces bonnes pratiques avec ton entourage !';
    } else if (percentage >= 70) {
        levelValue.textContent = 'Bon niveau';
        levelValue.className = 'level-value good';
        resultsIcon.textContent = '🌟';
        resultsMessage.textContent = 'Très bien ! Tu connais les bases de la sécurité informatique. Quelques points peuvent encore être améliorés, mais tu es sur la bonne voie !';
    } else if (percentage >= 50) {
        levelValue.textContent = 'En progression';
        levelValue.className = 'level-value average';
        resultsIcon.textContent = '📚';
        resultsMessage.textContent = 'Tu as de bonnes notions, mais certaines situations te posent encore problème. Revois les explications et n\'hésite pas à refaire le quiz !';
    } else {
        levelValue.textContent = 'Débutant';
        levelValue.className = 'level-value beginner';
        resultsIcon.textContent = '🎯';
        resultsMessage.textContent = 'La sécurité informatique est un domaine important à maîtriser. Relis attentivement les explications et refais le quiz pour améliorer tes réflexes !';
    }

    // Update stats
    document.getElementById('best-count').textContent = bestCount;
    document.getElementById('ok-count').textContent = okCount;
    document.getElementById('wrong-count').textContent = wrongCount;
}

// Restart game
function restartGame() {
    showScreen(startScreen);
}

// Initialize on load
init();
