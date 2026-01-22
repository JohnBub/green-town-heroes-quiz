// Publication data - content is trusted static data from developer
const publications = [
    {
        type: "INSTAGRAM",
        author: "@emma_loves_cats",
        emoji: "🐱",
        text: "Mon chat Moustache qui fait la sieste sur le canape !",
        detail: "Photo d'un chat sur un canape uni",
        isRisky: false,
        explanation: "Cette publication est safe !",
        infoTitle: "Pourquoi c'est safe ?",
        reasons: [
            "Aucune information personnelle visible",
            "Pas de localisation identifiable",
            "Pas de details sur ta vie privee",
            "Une photo de chat ne revele rien sur toi"
        ]
    },
    {
        type: "INSTAGRAM",
        author: "@lucas_2012",
        emoji: "🏠",
        text: "Nouvelle deco devant chez moi ! Vous aimez ?",
        detail: "Photo avec numero de maison et nom de rue visible",
        isRisky: true,
        explanation: "Cette publication est risquee !",
        infoTitle: "Pourquoi c'est risque ?",
        reasons: [
            "Ton adresse exacte est visible (numero + rue)",
            "N'importe qui peut savoir ou tu habites",
            "Des personnes malveillantes pourraient utiliser cette info",
            "Mieux vaut flouter ou recadrer pour cacher l'adresse"
        ]
    },
    {
        type: "STORY",
        author: "@sophie.vacances",
        emoji: "✈️",
        text: "Trop content ! On part en vacances demain pour 2 semaines en Espagne ! La maison va etre vide hihi",
        detail: "",
        isRisky: true,
        explanation: "Cette publication est risquee !",
        infoTitle: "Pourquoi c'est risque ?",
        reasons: [
            "Tu annonces publiquement que ta maison sera vide",
            "Des cambrioleurs surveillent ce genre de posts",
            "Mieux vaut partager APRES les vacances",
            "Ou au moins en prive avec des amis proches"
        ]
    },
    {
        type: "INSTAGRAM",
        author: "@nature_lover",
        emoji: "🌅",
        text: "Magnifique coucher de soleil a la montagne !",
        detail: "Photo d'un paysage de montagne sans element identifiable",
        isRisky: false,
        explanation: "Cette publication est safe !",
        infoTitle: "Pourquoi c'est safe ?",
        reasons: [
            "Aucune information personnelle",
            "Pas de localisation precise identifiable",
            "C'est juste un beau paysage",
            "Partager la nature ne revele rien sur toi"
        ]
    },
    {
        type: "STORY",
        author: "@max_live",
        emoji: "📍",
        text: "Au McDo avec les potes ! Venez nous rejoindre !",
        detail: "Story avec localisation en temps reel activee",
        isRisky: true,
        explanation: "Cette publication est risquee !",
        infoTitle: "Pourquoi c'est risque ?",
        reasons: [
            "Ta position exacte est visible en temps reel",
            "N'importe qui peut savoir ou tu es maintenant",
            "Des personnes inconnues pourraient venir",
            "Desactive la localisation en direct sur tes stories"
        ]
    },
    {
        type: "INSTAGRAM",
        author: "@student_life",
        emoji: "📝",
        text: "Trop fier de mes notes ce trimestre !",
        detail: "Photo du bulletin avec nom complet, classe et ecole visibles",
        isRisky: true,
        explanation: "Cette publication est risquee !",
        infoTitle: "Pourquoi c'est risque ?",
        reasons: [
            "Ton nom complet est visible",
            "On connait ton ecole et ta classe",
            "Ces infos peuvent servir a l'usurpation d'identite",
            "Floute au moins ton nom si tu veux partager"
        ]
    },
    {
        type: "TIKTOK",
        author: "@meme_master",
        emoji: "😂",
        text: "Ce meme m'a tue ! Je partage avec vous",
        detail: "Meme drole trouve sur Internet",
        isRisky: false,
        explanation: "Cette publication est safe !",
        infoTitle: "Pourquoi c'est safe ?",
        reasons: [
            "Ce n'est pas tes donnees personnelles",
            "Juste un contenu humoristique partage",
            "Aucune information sur toi",
            "Partager des memes est inoffensif"
        ]
    },
    {
        type: "SNAPCHAT",
        author: "@lonely_tonight",
        emoji: "🏡",
        text: "Enfin seul(e) a la maison ce soir ! Parents en weekend, trop bien !",
        detail: "",
        isRisky: true,
        explanation: "Cette publication est risquee !",
        infoTitle: "Pourquoi c'est risque ?",
        reasons: [
            "Tu annonces que tu es seul(e) et vulnerable",
            "Tes parents sont absents = moins de surveillance",
            "Des personnes malintentionnees surveillent ce genre de posts",
            "Ne jamais annoncer publiquement quand tu es seul(e)"
        ]
    }
];

// Game state
let currentQuestion = 0;
let score = 0;
let shuffledPublications = [];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const riskyBtn = document.getElementById('risky-btn');
const safeBtn = document.getElementById('safe-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const feedbackModal = document.getElementById('feedback-modal');

// Progress elements
const progressFill = document.getElementById('progress-fill');
const currentQuestionEl = document.getElementById('current-question');
const scoreEl = document.getElementById('score');

// Publication elements
const publicationType = document.getElementById('publication-type');
const publicationAuthor = document.getElementById('publication-author');
const publicationContent = document.getElementById('publication-content');

// Feedback elements
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const infoBox = document.getElementById('info-box');
const infoTitle = document.getElementById('info-title');
const reasonsList = document.getElementById('reasons-list');

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

// Build publication content safely
function buildPublicationContent(pub) {
    const fragment = document.createDocumentFragment();

    // Add emoji
    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'publication-emoji';
    emojiSpan.textContent = pub.emoji;
    fragment.appendChild(emojiSpan);

    // Add text
    const textSpan = document.createElement('span');
    textSpan.className = 'publication-text';
    textSpan.textContent = pub.text;
    fragment.appendChild(textSpan);

    // Add detail if exists
    if (pub.detail) {
        const detailSpan = document.createElement('span');
        detailSpan.className = 'publication-detail';
        detailSpan.textContent = '📸 ' + pub.detail;
        fragment.appendChild(detailSpan);
    }

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
    shuffledPublications = shuffleArray(publications);
    updateUI();
    loadQuestion();
    showScreen(gameScreen);
}

// Update UI elements
function updateUI() {
    currentQuestionEl.textContent = currentQuestion + 1;
    scoreEl.textContent = score;
    progressFill.style.width = `${((currentQuestion) / publications.length) * 100}%`;
}

// Load current question
function loadQuestion() {
    const pub = shuffledPublications[currentQuestion];
    publicationType.textContent = pub.type;
    publicationAuthor.textContent = pub.author;

    // Clear and rebuild publication content safely
    publicationContent.textContent = '';
    publicationContent.appendChild(buildPublicationContent(pub));

    // Enable buttons
    riskyBtn.disabled = false;
    safeBtn.disabled = false;
}

// Handle answer
function handleAnswer(userSaidRisky) {
    const pub = shuffledPublications[currentQuestion];
    const isCorrect = userSaidRisky === pub.isRisky;

    // Disable buttons
    riskyBtn.disabled = true;
    safeBtn.disabled = true;

    // Update score
    if (isCorrect) {
        score++;
        scoreEl.textContent = score;
    }

    // Show feedback
    showFeedback(isCorrect, pub);
}

// Show feedback modal
function showFeedback(isCorrect, pub) {
    feedbackIcon.textContent = isCorrect ? '✅' : '❌';

    feedbackTitle.textContent = isCorrect ? 'Correct !' : 'Oups !';
    feedbackTitle.className = isCorrect ? 'correct' : 'incorrect';

    feedbackText.textContent = pub.explanation;

    // Set info box style based on risky or safe
    if (pub.isRisky) {
        infoBox.className = 'info-box risky';
    } else {
        infoBox.className = 'info-box safe';
    }
    infoTitle.textContent = pub.infoTitle;

    // Populate reasons safely
    reasonsList.textContent = '';
    pub.reasons.forEach(reason => {
        const li = document.createElement('li');
        li.textContent = reason;
        reasonsList.appendChild(li);
    });

    feedbackModal.classList.remove('hidden');
}

// Go to next question
function nextQuestion() {
    feedbackModal.classList.add('hidden');
    currentQuestion++;

    if (currentQuestion >= publications.length) {
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
    const percentage = (score / publications.length) * 100;

    if (percentage === 100) {
        message = "Parfait ! Tu sais parfaitement proteger ta vie privee en ligne !";
    } else if (percentage >= 75) {
        message = "Excellent ! Tu as de bons reflexes pour proteger tes donnees.";
    } else if (percentage >= 50) {
        message = "Pas mal ! Mais reste vigilant avant de publier.";
    } else if (percentage >= 25) {
        message = "Attention ! Relis les conseils pour mieux proteger ta vie privee.";
    } else {
        message = "Il faut etre plus prudent ! Chaque publication peut reveler des infos sur toi.";
    }

    scoreMessage.textContent = message;
    progressFill.style.width = '100%';
    showScreen(resultsScreen);
}

// Event listeners
startBtn.addEventListener('click', initGame);
riskyBtn.addEventListener('click', () => handleAnswer(true));
safeBtn.addEventListener('click', () => handleAnswer(false));
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', initGame);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (gameScreen.classList.contains('active') && !feedbackModal.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
            nextQuestion();
        }
    } else if (gameScreen.classList.contains('active') && feedbackModal.classList.contains('hidden')) {
        if (e.key === 'r' || e.key === 'R' || e.key === '1') {
            handleAnswer(true);
        } else if (e.key === 's' || e.key === 'S' || e.key === '2') {
            handleAnswer(false);
        }
    }
});
