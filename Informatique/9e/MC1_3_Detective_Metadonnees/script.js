// Photo data with metadata questions
const photos = [
    {
        id: 1,
        visual: "🏞️📸",
        description: "Selfie d'Emma dans un parc avec le lac Leman en arriere-plan",
        realMetadata: {
            hasGPS: true,
            location: "Parc de la Grange, Geneve",
            time: "14h32",
            device: "iPhone 14"
        },
        questions: [
            {
                icon: "📍",
                text: "Cette photo contient-elle des coordonnees GPS ?",
                options: ["Oui", "Non"],
                correct: 0,
                explanation: "Les smartphones enregistrent automatiquement la position GPS dans les photos (sauf si desactive)"
            },
            {
                icon: "🕐",
                text: "A quelle heure cette photo a-t-elle ete prise ?",
                options: ["08h15", "14h32", "19h45", "23h10"],
                correct: 1,
                explanation: "L'heure exacte est toujours enregistree dans les metadonnees EXIF de la photo"
            },
            {
                icon: "📱",
                text: "Quel appareil a pris cette photo ?",
                options: ["Samsung Galaxy", "iPhone 14", "Appareil photo Canon", "Huawei"],
                correct: 1,
                explanation: "Le modele exact de l'appareil est enregistre dans les metadonnees"
            }
        ]
    },
    {
        id: 2,
        visual: "🍕🎉",
        description: "Photo d'anniversaire avec une pizza et des amis dans un restaurant",
        realMetadata: {
            hasGPS: true,
            location: "Pizzeria Molino, Lausanne",
            time: "19h15",
            device: "Samsung Galaxy S23"
        },
        questions: [
            {
                icon: "📍",
                text: "Cette photo contient-elle des coordonnees GPS ?",
                options: ["Oui", "Non"],
                correct: 0,
                explanation: "Meme dans un restaurant, le GPS peut localiser precisement ou tu te trouves"
            },
            {
                icon: "🕐",
                text: "A quelle heure cette photo a-t-elle ete prise ?",
                options: ["12h30", "15h00", "19h15", "21h45"],
                correct: 2,
                explanation: "Les metadonnees montrent que c'etait l'heure du diner"
            },
            {
                icon: "📱",
                text: "Quel appareil a pris cette photo ?",
                options: ["iPhone 12", "Google Pixel", "Samsung Galaxy S23", "OnePlus"],
                correct: 2,
                explanation: "Le Samsung Galaxy S23 est identifie dans les donnees EXIF"
            }
        ]
    },
    {
        id: 3,
        visual: "🌅🏔️",
        description: "Coucher de soleil en montagne pendant une randonnee",
        realMetadata: {
            hasGPS: true,
            location: "Zermatt, altitude 2100m",
            time: "20h47",
            device: "iPhone 13 Pro"
        },
        questions: [
            {
                icon: "📍",
                text: "Cette photo contient-elle des coordonnees GPS ?",
                options: ["Oui", "Non"],
                correct: 0,
                explanation: "Meme en montagne, le GPS fonctionne et enregistre ta position exacte !"
            },
            {
                icon: "🕐",
                text: "A quelle heure cette photo a-t-elle ete prise ?",
                options: ["06h30", "12h00", "17h15", "20h47"],
                correct: 3,
                explanation: "L'heure du coucher de soleil est precisement enregistree"
            },
            {
                icon: "📱",
                text: "Quel appareil a pris cette photo ?",
                options: ["iPhone 13 Pro", "Appareil reflex Nikon", "GoPro", "Samsung Galaxy"],
                correct: 0,
                explanation: "L'iPhone 13 Pro est identifie comme l'appareil source"
            }
        ]
    },
    {
        id: 4,
        visual: "🐕🏡",
        description: "Photo du chien devant la maison avec la boite aux lettres visible",
        realMetadata: {
            hasGPS: true,
            location: "Chemin des Roses 15, Nyon",
            time: "10h23",
            device: "Google Pixel 7"
        },
        questions: [
            {
                icon: "📍",
                text: "Cette photo contient-elle des coordonnees GPS ?",
                options: ["Oui", "Non"],
                correct: 0,
                explanation: "ATTENTION : Cette photo revele ton adresse exacte via le GPS ET visuellement !"
            },
            {
                icon: "🕐",
                text: "A quelle heure cette photo a-t-elle ete prise ?",
                options: ["07h00", "10h23", "14h45", "18h30"],
                correct: 1,
                explanation: "Les metadonnees montrent l'heure exacte de la prise de vue"
            },
            {
                icon: "📱",
                text: "Quel appareil a pris cette photo ?",
                options: ["iPhone 15", "Google Pixel 7", "Samsung Galaxy", "Xiaomi"],
                correct: 1,
                explanation: "Le Google Pixel 7 est enregistre dans les donnees EXIF"
            }
        ]
    },
    {
        id: 5,
        visual: "🎮📺",
        description: "Screenshot d'un jeu video sur la TV du salon",
        realMetadata: {
            hasGPS: false,
            location: "Non disponible",
            time: "22h58",
            device: "iPhone 14 Pro Max"
        },
        questions: [
            {
                icon: "📍",
                text: "Cette photo contient-elle des coordonnees GPS ?",
                options: ["Oui", "Non"],
                correct: 1,
                explanation: "Les screenshots et photos d'ecran ne contiennent generalement pas de GPS (pas de capteur photo utilise)"
            },
            {
                icon: "🕐",
                text: "A quelle heure cette photo a-t-elle ete prise ?",
                options: ["15h20", "18h00", "22h58", "02h30"],
                correct: 2,
                explanation: "Meme un screenshot enregistre l'heure exacte !"
            },
            {
                icon: "📱",
                text: "Quel appareil a pris cette photo ?",
                options: ["PlayStation 5", "Nintendo Switch", "iPhone 14 Pro Max", "PC"],
                correct: 2,
                explanation: "C'est le telephone qui a pris la photo de l'ecran, pas la console"
            }
        ]
    }
];

// Game state
let currentPhoto = 0;
let totalScore = 0;
let photoScore = 0;
let selectedAnswers = {};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const checkBtn = document.getElementById('check-btn');
const nextPhotoBtn = document.getElementById('next-photo-btn');
const restartBtn = document.getElementById('restart-btn');

const progressFill = document.getElementById('progress-fill');
const currentPhotoEl = document.getElementById('current-photo');
const scoreEl = document.getElementById('score');

const photoVisual = document.getElementById('photo-visual');
const photoDescription = document.getElementById('photo-description');
const questionsContainer = document.getElementById('questions-container');
const photoFeedback = document.getElementById('photo-feedback');
const feedbackHeader = document.getElementById('feedback-header');
const feedbackDetails = document.getElementById('feedback-details');

const badge = document.getElementById('badge');
const resultTitle = document.getElementById('result-title');
const finalScoreValue = document.getElementById('final-score-value');
const scoreMessage = document.getElementById('score-message');

// Show screen
function showScreen(screen) {
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    screen.classList.add('active');
}

// Initialize game
function initGame() {
    currentPhoto = 0;
    totalScore = 0;
    selectedAnswers = {};
    updateUI();
    loadPhoto();
    showScreen(gameScreen);
}

// Update UI
function updateUI() {
    currentPhotoEl.textContent = currentPhoto + 1;
    scoreEl.textContent = totalScore;
    progressFill.style.width = `${(currentPhoto / photos.length) * 100}%`;
}

// Load current photo
function loadPhoto() {
    const photo = photos[currentPhoto];
    photoVisual.textContent = photo.visual;
    photoDescription.textContent = photo.description;

    selectedAnswers = {};
    photoScore = 0;
    photoFeedback.classList.add('hidden');
    checkBtn.disabled = true;
    checkBtn.style.display = 'block';

    // Build questions
    questionsContainer.textContent = '';
    photo.questions.forEach((q, qIndex) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';

        const questionText = document.createElement('div');
        questionText.className = 'question-text';

        const icon = document.createElement('span');
        icon.className = 'question-icon';
        icon.textContent = q.icon;
        questionText.appendChild(icon);

        const text = document.createTextNode(q.text);
        questionText.appendChild(text);
        questionCard.appendChild(questionText);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';

        q.options.forEach((opt, optIndex) => {
            const optBtn = document.createElement('button');
            optBtn.className = 'option-btn';
            optBtn.textContent = opt;
            optBtn.addEventListener('click', () => selectOption(qIndex, optIndex, optBtn));
            optionsContainer.appendChild(optBtn);
        });

        questionCard.appendChild(optionsContainer);
        questionsContainer.appendChild(questionCard);
    });
}

// Select option
function selectOption(questionIndex, optionIndex, button) {
    // Deselect previous for this question
    const questionCard = questionsContainer.children[questionIndex];
    const buttons = questionCard.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));

    // Select new
    button.classList.add('selected');
    selectedAnswers[questionIndex] = optionIndex;

    // Enable check button if all questions answered
    if (Object.keys(selectedAnswers).length === photos[currentPhoto].questions.length) {
        checkBtn.disabled = false;
    }
}

// Check answers
function checkAnswers() {
    const photo = photos[currentPhoto];
    photoScore = 0;

    // Disable all buttons and show correct/incorrect
    photo.questions.forEach((q, qIndex) => {
        const questionCard = questionsContainer.children[qIndex];
        const buttons = questionCard.querySelectorAll('.option-btn');

        buttons.forEach((btn, btnIndex) => {
            btn.disabled = true;

            if (btnIndex === q.correct) {
                btn.classList.add('correct');
            }

            if (selectedAnswers[qIndex] === btnIndex && btnIndex !== q.correct) {
                btn.classList.add('incorrect');
            }
        });

        if (selectedAnswers[qIndex] === q.correct) {
            photoScore++;
        }
    });

    totalScore += photoScore;
    scoreEl.textContent = totalScore;
    checkBtn.style.display = 'none';

    // Show feedback
    showPhotoFeedback();
}

// Show photo feedback
function showPhotoFeedback() {
    const photo = photos[currentPhoto];

    // Header based on score
    if (photoScore === 3) {
        feedbackHeader.textContent = "🎉 Parfait ! 3/3";
        feedbackHeader.className = 'feedback-header good';
    } else if (photoScore === 2) {
        feedbackHeader.textContent = "👍 Bien ! 2/3";
        feedbackHeader.className = 'feedback-header medium';
    } else if (photoScore === 1) {
        feedbackHeader.textContent = "🤔 Peut mieux faire ! 1/3";
        feedbackHeader.className = 'feedback-header medium';
    } else {
        feedbackHeader.textContent = "😬 A revoir ! 0/3";
        feedbackHeader.className = 'feedback-header bad';
    }

    // Build details
    feedbackDetails.textContent = '';

    const metadata = photo.realMetadata;

    const items = [
        { label: '📍 Position GPS', value: metadata.hasGPS ? metadata.location : 'Non disponible' },
        { label: '🕐 Heure de prise', value: metadata.time },
        { label: '📱 Appareil', value: metadata.device }
    ];

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'feedback-item';

        const label = document.createElement('span');
        label.className = 'feedback-label';
        label.textContent = item.label;
        div.appendChild(label);

        const value = document.createElement('span');
        value.className = 'feedback-value';
        value.textContent = item.value;
        div.appendChild(value);

        feedbackDetails.appendChild(div);
    });

    // Update button text for last photo
    if (currentPhoto === photos.length - 1) {
        nextPhotoBtn.textContent = 'Voir les resultats';
    } else {
        nextPhotoBtn.textContent = 'Photo suivante';
    }

    photoFeedback.classList.remove('hidden');
}

// Next photo
function nextPhoto() {
    currentPhoto++;

    if (currentPhoto >= photos.length) {
        showResults();
    } else {
        updateUI();
        loadPhoto();
    }
}

// Show results
function showResults() {
    finalScoreValue.textContent = totalScore;
    progressFill.style.width = '100%';

    const percentage = (totalScore / 15) * 100;

    if (percentage === 100) {
        badge.textContent = '🏆';
        resultTitle.textContent = 'Expert en Metadonnees !';
        scoreMessage.textContent = 'Incroyable ! Tu connais parfaitement les metadonnees cachees dans les photos !';
    } else if (percentage >= 80) {
        badge.textContent = '🥇';
        resultTitle.textContent = 'Detective Confirme !';
        scoreMessage.textContent = 'Excellent travail ! Tu sais bien analyser les informations cachees.';
    } else if (percentage >= 60) {
        badge.textContent = '🥈';
        resultTitle.textContent = 'Bon Enqueteur !';
        scoreMessage.textContent = 'Pas mal ! Tu commences a comprendre les metadonnees.';
    } else if (percentage >= 40) {
        badge.textContent = '🥉';
        resultTitle.textContent = 'Detective Debutant';
        scoreMessage.textContent = 'Continue a t\'entrainer pour mieux reperer les infos cachees !';
    } else {
        badge.textContent = '📚';
        resultTitle.textContent = 'A Entrainer !';
        scoreMessage.textContent = 'Les metadonnees sont un sujet complexe. Relis les explications et reessaie !';
    }

    showScreen(resultsScreen);
}

// Event listeners
startBtn.addEventListener('click', initGame);
checkBtn.addEventListener('click', checkAnswers);
nextPhotoBtn.addEventListener('click', nextPhoto);
restartBtn.addEventListener('click', initGame);
