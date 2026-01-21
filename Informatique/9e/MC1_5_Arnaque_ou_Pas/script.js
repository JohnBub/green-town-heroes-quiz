// Message data - content is trusted static data from developer
const messages = [
    {
        type: "EMAIL",
        sender: "concours-gagnant@promo-iphone.xyz",
        contentParts: [
            { type: "highlight", text: "FELICITATIONS !!!" },
            { type: "text", text: " Vous avez ete selectionne pour gagner un " },
            { type: "highlight", text: "iPhone 15 Pro GRATUIT" },
            { type: "text", text: " ! Cliquez vite sur le lien ci-dessous pour reclamer votre prix : " },
            { type: "link", text: "http://bit.ly/gagnez-iphone-now" }
        ],
        isScam: true,
        explanation: "C'est une arnaque classique de type 'loterie'.",
        flags: [
            "Vous n'avez participe a aucun concours",
            "Adresse email suspecte (@promo-iphone.xyz)",
            "Trop beau pour etre vrai (iPhone gratuit)",
            "Lien raccourci suspect (bit.ly)",
            "Ponctuation excessive et urgence"
        ]
    },
    {
        type: "SMS",
        sender: "+41 79 XXX XX XX",
        contentParts: [
            { type: "text", text: "Votre colis est en attente de livraison. Frais de port: CHF 2.99. Confirmez ici: " },
            { type: "link", text: "http://bit.ly/colis-ch-2024" }
        ],
        isScam: true,
        explanation: "Arnaque au faux colis tres repandue en Suisse.",
        flags: [
            "Vous n'attendez peut-etre pas de colis",
            "Lien raccourci suspect (bit.ly)",
            "Demande de paiement inattendue",
            "La Poste ne demande jamais de frais par SMS"
        ]
    },
    {
        type: "EMAIL",
        sender: "noreply@swisscom.ch",
        contentParts: [
            { type: "text", text: "Bonjour," },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Votre facture du mois de janvier d'un montant de CHF 45.50 est disponible dans votre espace client." },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Connectez-vous sur " },
            { type: "link", text: "www.swisscom.ch/login" },
            { type: "text", text: " pour la consulter." },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Swisscom SA" }
        ],
        isScam: false,
        explanation: "Ce message est legitime.",
        flags: [
            "Adresse officielle (@swisscom.ch)",
            "Lien vers le site officiel (swisscom.ch)",
            "Pas de demande urgente ou menacante",
            "Montant realiste pour une facture mobile"
        ]
    },
    {
        type: "EMAIL",
        sender: "securite-bancaire@postfinance-secure.net",
        contentParts: [
            { type: "highlight", text: "URGENT - ACTION REQUISE" },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Votre compte PostFinance sera " },
            { type: "highlight", text: "BLOQUE dans 24 heures" },
            { type: "text", text: " si vous ne verifiez pas vos informations immediatement !" },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Cliquez ici pour eviter la fermeture: " },
            { type: "link", text: "http://postfinance-verify.com/secure" }
        ],
        isScam: true,
        explanation: "Arnaque par phishing bancaire.",
        flags: [
            "Fausse adresse email (postfinance-secure.net au lieu de postfinance.ch)",
            "Urgence excessive (24 heures)",
            "Menace de fermeture de compte",
            "Lien vers un faux site (postfinance-verify.com)",
            "PostFinance ne demande jamais cela par email"
        ]
    },
    {
        type: "SMS",
        sender: "Ami inconnu",
        contentParts: [
            { type: "text", text: "Salut c'est moi ! J'ai perdu mon telephone et je suis bloque. Tu peux m'envoyer 100 CHF sur ce compte IBAN? C'est urgent, je te rembourse demain promis ! CH93 0076 2011 6238 5295 7" }
        ],
        isScam: true,
        explanation: "Arnaque a l'usurpation d'identite.",
        flags: [
            "Pas de nom precis ('c'est moi')",
            "Demande d'argent urgente",
            "IBAN inconnu",
            "Histoire peu credible",
            "Toujours verifier par un autre moyen (appel, autre reseau social)"
        ]
    },
    {
        type: "EMAIL",
        sender: "notifications@post.ch",
        contentParts: [
            { type: "text", text: "Bonjour," },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Votre envoi numero 99.12.345678.90123456 sera livre demain entre 10h et 12h." },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Suivez votre envoi sur " },
            { type: "link", text: "www.post.ch/suivi" },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "La Poste Suisse" }
        ],
        isScam: false,
        explanation: "Ce message est legitime.",
        flags: [
            "Adresse officielle (@post.ch)",
            "Numero de suivi au format standard",
            "Lien vers le site officiel (post.ch)",
            "Pas de demande de paiement ou d'informations"
        ]
    },
    {
        type: "EMAIL",
        sender: "prince.abubakar@royal-nigeria.org",
        contentParts: [
            { type: "text", text: "Cher ami," },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Je suis le Prince Abubakar du Nigeria. J'ai " },
            { type: "highlight", text: "10 millions de dollars" },
            { type: "text", text: " bloques et j'ai besoin de votre aide pour les transferer. En echange, vous recevrez " },
            { type: "highlight", text: "30% de la somme" },
            { type: "text", text: "." },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Envoyez-moi vos coordonnees bancaires pour commencer." }
        ],
        isScam: true,
        explanation: "Arnaque nigeriane (419 scam) - une des plus anciennes sur internet !",
        flags: [
            "Offre d'argent trop belle pour etre vraie",
            "Demande de coordonnees bancaires",
            "Histoire de 'prince' ou heritage bloque",
            "Contact d'un inconnu avec une offre financiere",
            "Adresse email non officielle"
        ]
    },
    {
        type: "SMS",
        sender: "CFF",
        contentParts: [
            { type: "text", text: "Info CFF: Retard de 15 min sur votre train IC 721 Geneve-Zurich de 14h32. Nouvelle arrivee prevue: 17h17. Infos: cff.ch" }
        ],
        isScam: false,
        explanation: "Ce message est legitime.",
        flags: [
            "Expediteur officiel (CFF)",
            "Information precise (numero de train, horaire)",
            "Pas de lien cliquable suspect",
            "Pas de demande d'action ou de paiement"
        ]
    },
    {
        type: "EMAIL",
        sender: "support@netflix-billing.com",
        contentParts: [
            { type: "text", text: "Votre abonnement Netflix a ete " },
            { type: "highlight", text: "suspendu" },
            { type: "text", text: " car votre paiement a echoue." },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Pour continuer a profiter de Netflix, mettez a jour vos informations de paiement dans les " },
            { type: "highlight", text: "48 heures" },
            { type: "text", text: ":" },
            { type: "break" },
            { type: "break" },
            { type: "link", text: "http://netflix-update-payment.com/renew" }
        ],
        isScam: true,
        explanation: "Phishing imitant Netflix.",
        flags: [
            "Fausse adresse (netflix-billing.com au lieu de netflix.com)",
            "Lien vers un faux site",
            "Limite de temps pour creer l'urgence",
            "Demande de donnees de paiement",
            "Netflix vous contacterait via l'application"
        ]
    },
    {
        type: "EMAIL",
        sender: "ne-pas-repondre@admin.eduge.ch",
        contentParts: [
            { type: "text", text: "Bonjour," },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Les inscriptions aux cours facultatifs du 2e semestre sont ouvertes jusqu'au 31 janvier." },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Connectez-vous sur " },
            { type: "link", text: "edu.ge.ch" },
            { type: "text", text: " avec votre compte EDUGE pour vous inscrire." },
            { type: "break" },
            { type: "break" },
            { type: "text", text: "Secretariat du College" }
        ],
        isScam: false,
        explanation: "Ce message est legitime.",
        flags: [
            "Adresse officielle (@admin.eduge.ch)",
            "Lien vers le site officiel (edu.ge.ch)",
            "Contexte coherent (ecole, inscriptions)",
            "Pas de demande de donnees sensibles",
            "Delai raisonnable (pas d'urgence excessive)"
        ]
    }
];

// Game state
let currentQuestion = 0;
let score = 0;
let shuffledMessages = [];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const scamBtn = document.getElementById('scam-btn');
const legitBtn = document.getElementById('legit-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const feedbackModal = document.getElementById('feedback-modal');

// Progress elements
const progressFill = document.getElementById('progress-fill');
const currentQuestionEl = document.getElementById('current-question');
const scoreEl = document.getElementById('score');

// Message elements
const messageType = document.getElementById('message-type');
const messageSender = document.getElementById('message-sender');
const messageContent = document.getElementById('message-content');

// Feedback elements
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const redFlags = document.getElementById('red-flags');
const flagsList = document.getElementById('flags-list');

// Results elements
const finalScoreValue = document.getElementById('final-score-value');
const scoreMessage = document.getElementById('score-message');

// Utility function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Build message content safely from parts
function buildMessageContent(contentParts) {
    const fragment = document.createDocumentFragment();

    contentParts.forEach(part => {
        if (part.type === 'text') {
            fragment.appendChild(document.createTextNode(part.text));
        } else if (part.type === 'highlight') {
            const span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = part.text;
            fragment.appendChild(span);
        } else if (part.type === 'link') {
            const span = document.createElement('span');
            span.className = 'link';
            span.textContent = part.text;
            fragment.appendChild(span);
        } else if (part.type === 'break') {
            fragment.appendChild(document.createElement('br'));
        }
    });

    return fragment;
}

// Show screen
function showScreen(screen) {
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    screen.classList.add('active');
}

// Initialize game
function initGame() {
    currentQuestion = 0;
    score = 0;
    shuffledMessages = shuffleArray(messages);
    updateUI();
    loadQuestion();
    showScreen(gameScreen);
}

// Update UI elements
function updateUI() {
    currentQuestionEl.textContent = currentQuestion + 1;
    scoreEl.textContent = score;
    progressFill.style.width = `${((currentQuestion) / messages.length) * 100}%`;
}

// Load current question
function loadQuestion() {
    const msg = shuffledMessages[currentQuestion];
    messageType.textContent = msg.type;
    messageSender.textContent = msg.sender;

    // Clear and rebuild message content safely
    messageContent.textContent = '';
    messageContent.appendChild(buildMessageContent(msg.contentParts));

    // Enable buttons
    scamBtn.disabled = false;
    legitBtn.disabled = false;
}

// Handle answer
function handleAnswer(userSaidScam) {
    const msg = shuffledMessages[currentQuestion];
    const isCorrect = userSaidScam === msg.isScam;

    // Disable buttons
    scamBtn.disabled = true;
    legitBtn.disabled = true;

    // Update score
    if (isCorrect) {
        score++;
        scoreEl.textContent = score;
    }

    // Show feedback
    showFeedback(isCorrect, msg);
}

// Show feedback modal
function showFeedback(isCorrect, msg) {
    feedbackIcon.textContent = isCorrect ? '\u2713' : '\u2717';
    feedbackIcon.className = 'feedback-icon ' + (isCorrect ? 'correct' : 'incorrect');

    feedbackTitle.textContent = isCorrect ? 'Correct !' : 'Incorrect !';
    feedbackTitle.className = isCorrect ? 'correct' : 'incorrect';

    const answerType = msg.isScam ? 'une ARNAQUE' : 'un message LEGITIME';
    feedbackText.textContent = `${msg.explanation} C'etait ${answerType}.`;

    // Set flags style based on scam or legit
    if (msg.isScam) {
        redFlags.classList.remove('legit-flags');
        redFlags.querySelector('h4').textContent = 'Indices a reperer :';
    } else {
        redFlags.classList.add('legit-flags');
        redFlags.querySelector('h4').textContent = 'Signes de legitimite :';
    }

    // Populate flags safely
    flagsList.textContent = '';
    msg.flags.forEach(flag => {
        const li = document.createElement('li');
        li.textContent = flag;
        flagsList.appendChild(li);
    });

    feedbackModal.classList.remove('hidden');
}

// Go to next question
function nextQuestion() {
    feedbackModal.classList.add('hidden');
    currentQuestion++;

    if (currentQuestion >= messages.length) {
        showResults();
    } else {
        updateUI();
        loadQuestion();
    }
}

// Show results
function showResults() {
    finalScoreValue.textContent = score;

    let message;
    const percentage = (score / messages.length) * 100;

    if (percentage === 100) {
        message = "Parfait ! Vous etes un expert en detection d'arnaques !";
    } else if (percentage >= 80) {
        message = "Excellent ! Vous savez bien reperer les arnaques.";
    } else if (percentage >= 60) {
        message = "Bien ! Mais restez vigilant face aux arnaques.";
    } else if (percentage >= 40) {
        message = "Attention ! Revoyez les signes d'arnaque.";
    } else {
        message = "Il faut etre plus prudent ! Relisez les conseils.";
    }

    scoreMessage.textContent = message;
    progressFill.style.width = '100%';
    showScreen(resultsScreen);
}

// Event listeners
startBtn.addEventListener('click', initGame);
scamBtn.addEventListener('click', () => handleAnswer(true));
legitBtn.addEventListener('click', () => handleAnswer(false));
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', initGame);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (gameScreen.classList.contains('active') && !feedbackModal.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
            nextQuestion();
        }
    } else if (gameScreen.classList.contains('active') && feedbackModal.classList.contains('hidden')) {
        if (e.key === 'a' || e.key === 'A' || e.key === '1') {
            handleAnswer(true);
        } else if (e.key === 'l' || e.key === 'L' || e.key === '2') {
            handleAnswer(false);
        }
    }
});
