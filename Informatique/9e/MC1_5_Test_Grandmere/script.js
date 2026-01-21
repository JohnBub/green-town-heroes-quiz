// Game Data - All content is static and controlled, no user input
const posts = [
    {
        id: 1,
        text: "Regardez nos super vacances en famille !",
        image: "🏖️👨‍👩‍👧‍👦",
        type: "Photo de vacances",
        isOk: true,
        category: "appropriate",
        categoryLabel: "Contenu approprié",
        explanation: "Une photo de famille en vacances, c'est parfait à partager ! Mamie adore voir ces souvenirs.",
        grandmaReaction: "Oh comme c'est beau ! Ça me rappelle nos vacances à Nice !"
    },
    {
        id: 2,
        text: "Pose suggestive pour ma nouvelle photo de profil...",
        image: "👙📸",
        type: "Photo en maillot",
        isOk: false,
        category: "appropriate",
        categoryLabel: "Bienséance",
        explanation: "Les photos suggestives peuvent attirer des regards indésirables et rester en ligne pour toujours. Pense à ta réputation future !",
        grandmaReaction: "Mon Dieu ! Ce n'est pas une tenue pour internet, mon petit !"
    },
    {
        id: 3,
        text: "Lucas est vraiment trop nul, il m'énerve ! 🤬 #JeLeDéteste",
        image: "😡",
        type: "Message sur un camarade",
        isOk: false,
        category: "respect",
        categoryLabel: "Respect d'autrui",
        explanation: "Insulter quelqu'un en ligne, c'est du cyberharcèlement. Les mots font mal et restent visibles par tous.",
        grandmaReaction: "Mais enfin ! On n'insulte pas les gens comme ça ! C'est très méchant !"
    },
    {
        id: 4,
        text: "Super article sur les nouveautés de Minecraft ! À lire absolument 🎮",
        image: "🎮📰",
        type: "Partage d'article",
        isOk: true,
        category: "appropriate",
        categoryLabel: "Contenu approprié",
        explanation: "Partager des contenus intéressants et positifs, c'est une excellente utilisation des réseaux sociaux !",
        grandmaReaction: "C'est bien de partager des choses intéressantes avec tes amis !"
    },
    {
        id: 5,
        text: "Voilà ma carte d'identité pour prouver que j'ai 18 ans !",
        image: "🪪📷",
        type: "Photo de document",
        isOk: false,
        category: "privacy",
        categoryLabel: "Données personnelles",
        explanation: "JAMAIS de photos de documents d'identité en ligne ! Les fraudeurs peuvent voler ton identité et créer de faux comptes.",
        grandmaReaction: "Non non non ! On ne montre jamais ses papiers sur internet !"
    },
    {
        id: 6,
        text: "MDR elle est trop moche avec sa nouvelle coupe 😂😂",
        image: "😂💇‍♀️",
        type: "Commentaire sur le physique",
        isOk: false,
        category: "respect",
        categoryLabel: "Respect d'autrui",
        explanation: "Se moquer du physique de quelqu'un est blessant et peut avoir des conséquences graves sur sa santé mentale.",
        grandmaReaction: "Ce n'est pas gentil du tout ! Comment te sentirais-tu à sa place ?"
    },
    {
        id: 7,
        text: "Super ambiance au match avec les copains ! ⚽🎉",
        image: "⚽👥🎉",
        type: "Photo de groupe",
        isOk: true,
        category: "appropriate",
        categoryLabel: "Contenu approprié",
        explanation: "Une photo entre amis lors d'un événement sportif, c'est des souvenirs positifs à partager !",
        grandmaReaction: "Ah c'est chouette de voir que tu t'amuses bien avec tes amis !"
    },
    {
        id: 8,
        text: "Je suis chez moi au 15 rue des Lilas ! Venez quand vous voulez ! 🏠",
        image: "🏠📍",
        type: "Story avec adresse",
        isOk: false,
        category: "safety",
        categoryLabel: "Sécurité personnelle",
        explanation: "Ne JAMAIS partager ton adresse en ligne ! Des personnes mal intentionnées pourraient l'utiliser.",
        grandmaReaction: "Malheur ! On ne dit pas où on habite à tout le monde !"
    },
    {
        id: 9,
        text: "Pourquoi les plongeurs plongent en arrière ? Parce que sinon ils tomberaient dans le bateau ! 😄",
        image: "🤿😂",
        type: "Blague avec amis",
        isOk: true,
        category: "appropriate",
        categoryLabel: "Contenu approprié",
        explanation: "Une blague gentille qui fait rire tout le monde, c'est parfait pour les réseaux sociaux !",
        grandmaReaction: "Ha ha ha ! Elle est bonne celle-là ! Je vais la raconter au club de tricot !"
    },
    {
        id: 10,
        text: "Regardez ce que Marie m'a écrit en privé, c'est trop drôle ! 📱",
        image: "📱💬🔓",
        type: "Screenshot de conversation",
        isOk: false,
        category: "privacy",
        categoryLabel: "Respect de la vie privée",
        explanation: "Partager une conversation privée sans permission trahit la confiance de la personne et viole son intimité.",
        grandmaReaction: "Oh non ! Les secrets des autres, ça reste secret !"
    }
];

// Wisdom categories for results
const wisdomMessages = {
    privacy: {
        icon: "🔒",
        text: "Protège tes données personnelles : jamais de documents d'identité, d'adresse ou de conversations privées en ligne !"
    },
    respect: {
        icon: "💚",
        text: "Respecte les autres : les mots peuvent blesser autant en ligne qu'en vrai. Sois gentil !"
    },
    safety: {
        icon: "🛡️",
        text: "Ta sécurité d'abord : ne partage jamais d'informations qui permettraient de te localiser."
    },
    appropriate: {
        icon: "✨",
        text: "Pense à ton image : ce que tu publies reste en ligne pour toujours et peut être vu par tout le monde !"
    }
};

// Game State
let currentPostIndex = 0;
let score = 0;
let shuffledPosts = [];
let categoryStats = {
    privacy: { correct: 0, total: 0 },
    respect: { correct: 0, total: 0 },
    safety: { correct: 0, total: 0 },
    appropriate: { correct: 0, total: 0 }
};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const nextBtn = document.getElementById('next-btn');
const answerButtons = document.getElementById('answer-buttons');
const feedbackSection = document.getElementById('feedback-section');

// Initialize game
function init() {
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    nextBtn.addEventListener('click', nextPost);

    // Answer button listeners
    answerButtons.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(btn.dataset.answer));
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function startGame() {
    currentPostIndex = 0;
    score = 0;
    shuffledPosts = shuffleArray(posts);
    categoryStats = {
        privacy: { correct: 0, total: 0 },
        respect: { correct: 0, total: 0 },
        safety: { correct: 0, total: 0 },
        appropriate: { correct: 0, total: 0 }
    };

    showScreen(gameScreen);
    displayPost();
    updateProgress();
}

function restartGame() {
    startGame();
}

function showScreen(screen) {
    [startScreen, gameScreen, resultsScreen].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// Helper function to safely set text content
function setElementText(element, text) {
    element.textContent = text;
}

function displayPost() {
    const post = shuffledPosts[currentPostIndex];

    // Reset UI
    feedbackSection.classList.add('hidden');
    answerButtons.style.display = 'flex';

    // Reset grandma
    const grandmaAvatar = document.getElementById('grandma-avatar');
    const grandmaEmoji = document.getElementById('grandma-emoji');
    const grandmaSpeech = document.getElementById('grandma-speech');

    grandmaAvatar.classList.remove('happy', 'shocked');
    setElementText(grandmaEmoji, '👵');
    setElementText(grandmaSpeech, 'Voyons voir ce que tu veux publier...');

    // Display post content using safe DOM methods
    const postContent = document.getElementById('post-content');

    // Clear existing content
    while (postContent.firstChild) {
        postContent.removeChild(postContent.firstChild);
    }

    // Create post text element
    const postTextDiv = document.createElement('div');
    postTextDiv.className = 'post-text';
    setElementText(postTextDiv, post.text);
    postContent.appendChild(postTextDiv);

    // Create post image element
    const postImageDiv = document.createElement('div');
    postImageDiv.className = 'post-image';
    setElementText(postImageDiv, post.image);
    postContent.appendChild(postImageDiv);

    // Create post type badge
    const postTypeBadge = document.createElement('div');
    postTypeBadge.className = 'post-type-badge';
    setElementText(postTypeBadge, post.type);
    postContent.appendChild(postTypeBadge);

    // Update counters
    setElementText(document.getElementById('current-post'), currentPostIndex + 1);
    setElementText(document.getElementById('total-posts'), shuffledPosts.length);
    setElementText(document.getElementById('score'), score);
}

function updateProgress() {
    const progress = ((currentPostIndex) / shuffledPosts.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function handleAnswer(answer) {
    const post = shuffledPosts[currentPostIndex];
    const isCorrect = (answer === 'approve' && post.isOk) || (answer === 'reject' && !post.isOk);

    // Update stats
    categoryStats[post.category].total++;
    if (isCorrect) {
        score++;
        categoryStats[post.category].correct++;
    }

    // Update score display
    setElementText(document.getElementById('score'), score);

    // Show grandma reaction
    const grandmaAvatar = document.getElementById('grandma-avatar');
    const grandmaEmoji = document.getElementById('grandma-emoji');
    const grandmaSpeech = document.getElementById('grandma-speech');

    if (isCorrect) {
        grandmaAvatar.classList.add('happy');
        setElementText(grandmaEmoji, '😊');
        setElementText(grandmaSpeech, post.grandmaReaction);
    } else {
        grandmaAvatar.classList.add('shocked');
        setElementText(grandmaEmoji, post.isOk ? '😕' : '😱');
        setElementText(grandmaSpeech, post.isOk
            ? "Mais non ! C'était correct de le publier !"
            : post.grandmaReaction);
    }

    // Show feedback
    showFeedback(isCorrect, post);
}

function showFeedback(isCorrect, post) {
    answerButtons.style.display = 'none';
    feedbackSection.classList.remove('hidden');

    const feedbackCard = document.getElementById('feedback-card');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackResult = document.getElementById('feedback-result');
    const feedbackCategory = document.getElementById('feedback-category');
    const feedbackExplanation = document.getElementById('feedback-explanation');

    feedbackCard.classList.remove('correct', 'incorrect');
    feedbackCard.classList.add(isCorrect ? 'correct' : 'incorrect');

    setElementText(feedbackIcon, isCorrect ? '✅' : '❌');
    setElementText(feedbackResult, isCorrect
        ? 'Bonne réponse !'
        : `Mauvaise réponse ! C'était ${post.isOk ? 'OK pour Mamie' : 'pas pour Mamie'}`);

    setElementText(feedbackCategory, post.categoryLabel);
    feedbackCategory.className = `feedback-category category-${post.category}`;

    setElementText(feedbackExplanation, post.explanation);

    // Update button text for last post
    if (currentPostIndex >= shuffledPosts.length - 1) {
        setElementText(nextBtn, 'Voir les résultats');
    } else {
        setElementText(nextBtn, 'Publication suivante');
    }
}

function nextPost() {
    currentPostIndex++;
    updateProgress();

    if (currentPostIndex >= shuffledPosts.length) {
        showResults();
    } else {
        displayPost();
    }
}

function showResults() {
    showScreen(resultsScreen);

    // Final score
    setElementText(document.getElementById('final-score'), score);
    setElementText(document.getElementById('final-total'), shuffledPosts.length);

    // Score message and grandma reaction
    const percentage = (score / shuffledPosts.length) * 100;
    const finalGrandma = document.getElementById('final-grandma');
    const scoreMessage = document.getElementById('score-message');

    if (percentage >= 90) {
        setElementText(finalGrandma, '🥰');
        setElementText(scoreMessage, 'Excellent ! Mamie est très fière de toi ! Tu sais parfaitement ce qui se publie ou non !');
    } else if (percentage >= 70) {
        setElementText(finalGrandma, '😊');
        setElementText(scoreMessage, 'Très bien ! Tu comprends bien les règles de base, mais révise quelques points !');
    } else if (percentage >= 50) {
        setElementText(finalGrandma, '🤔');
        setElementText(scoreMessage, 'Pas mal, mais Mamie pense que tu devrais faire plus attention avant de publier !');
    } else {
        setElementText(finalGrandma, '😟');
        setElementText(scoreMessage, 'Ouh là ! Mamie s\'inquiète pour toi... Révise bien les conseils ci-dessous !');
    }

    // Display wisdom cards using safe DOM methods
    const wisdomCards = document.getElementById('wisdom-cards');

    // Clear existing content
    while (wisdomCards.firstChild) {
        wisdomCards.removeChild(wisdomCards.firstChild);
    }

    Object.entries(wisdomMessages).forEach(([category, wisdom]) => {
        const card = document.createElement('div');
        card.className = 'wisdom-card';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'wisdom-icon';
        setElementText(iconSpan, wisdom.icon);
        card.appendChild(iconSpan);

        const textSpan = document.createElement('span');
        textSpan.className = 'wisdom-text';
        setElementText(textSpan, wisdom.text);
        card.appendChild(textSpan);

        wisdomCards.appendChild(card);
    });

    // Display category stats using safe DOM methods
    const categoryStatsDiv = document.getElementById('category-stats');

    // Clear existing content
    while (categoryStatsDiv.firstChild) {
        categoryStatsDiv.removeChild(categoryStatsDiv.firstChild);
    }

    const categoryIcons = {
        privacy: '🔒',
        respect: '💚',
        safety: '🛡️',
        appropriate: '✨'
    };

    const categoryLabels = {
        privacy: 'Vie privée',
        respect: 'Respect',
        safety: 'Sécurité',
        appropriate: 'Bienséance'
    };

    Object.entries(categoryStats).forEach(([category, stats]) => {
        if (stats.total > 0) {
            const card = document.createElement('div');
            card.className = 'stat-card';

            const iconDiv = document.createElement('div');
            iconDiv.className = 'stat-icon';
            setElementText(iconDiv, categoryIcons[category]);
            card.appendChild(iconDiv);

            const labelDiv = document.createElement('div');
            labelDiv.className = 'stat-label';
            setElementText(labelDiv, categoryLabels[category]);
            card.appendChild(labelDiv);

            const valueDiv = document.createElement('div');
            valueDiv.className = 'stat-value';
            setElementText(valueDiv, `${stats.correct}/${stats.total}`);
            card.appendChild(valueDiv);

            categoryStatsDiv.appendChild(card);
        }
    });
}

// Start the game
init();
