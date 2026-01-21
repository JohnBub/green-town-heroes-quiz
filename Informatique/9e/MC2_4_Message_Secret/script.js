// Polybius Square Configuration
const polybiusSquare = {
    'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15',
    'F': '21', 'G': '22', 'H': '23', 'I': '24', 'J': '24', 'K': '25',
    'L': '31', 'M': '32', 'N': '33', 'O': '34', 'P': '35',
    'Q': '41', 'R': '42', 'S': '43', 'T': '44', 'U': '45',
    'V': '51', 'W': '52', 'X': '53', 'Y': '54', 'Z': '55'
};

// Reverse mapping for decoding
const reversePolybius = {};
for (const [letter, code] of Object.entries(polybiusSquare)) {
    if (!reversePolybius[code]) {
        reversePolybius[code] = letter;
    }
}

// Mission Data
const missions = [
    {
        title: "L'Espion",
        story: "Tu es un espion grec. Tu recois ce message secret de ton contact a Athenes. Decode-le pour connaitre le lieu du rendez-vous...",
        coded: "43 15 13 42 15 44",
        answer: "SECRET",
        success: "Bravo! Le rendez-vous secret est confirme! Ton contact t'attend a minuit.",
        failure: "Ce n'est pas le bon message. Ton contact attend toujours..."
    },
    {
        title: "Le Tresor",
        story: "Une vieille carte contient ces coordonnees mysterieuses. On dit qu'elles menent a un tresor cache par les anciens Grecs...",
        coded: "44 42 15 43 34 42",
        answer: "TRESOR",
        success: "Tu as trouve l'indice vers le tresor! La carte revele un chemin secret.",
        failure: "Ce n'est pas le bon mot. Le tresor reste cache..."
    },
    {
        title: "Le Code Militaire",
        story: "Le general Spartiate envoie des ordres urgents a ses troupes. En tant que messager, tu dois decoder ces instructions vitales...",
        coded: "11 44 44 11 41 45 15",
        answer: "ATTAQUE",
        success: "Les troupes se preparent! L'ordre est transmis avec succes.",
        failure: "L'ordre n'est pas compris. Les troupes attendent..."
    },
    {
        title: "Le Message d'Amitie",
        story: "Ton ami d'une cite voisine t'envoie un message code. Meme en temps de guerre, l'amitie traverse les frontieres...",
        coded: "43 11 31 45 44",
        answer: "SALUT",
        success: "Ton ami te salue! L'amitie est plus forte que tout.",
        failure: "Tu n'as pas compris le message de ton ami..."
    },
    {
        title: "Le Mot de Passe",
        story: "Pour entrer dans la base secrete de la resistance, tu dois decoder le mot de passe. Une seule chance...",
        coded: "31 24 12 15 42 44 15",
        answer: "LIBERTE",
        success: "La porte s'ouvre! Mission accomplie! Tu es un veritable agent secret!",
        failure: "Mot de passe incorrect. La porte reste fermee..."
    }
];

// Game State
let currentMission = 0;
let score = 0;
let hintsUsed = 0;
let hintsRemaining = 3;
let missionResults = [];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const hintBtn = document.getElementById('hint-btn');
const restartBtn = document.getElementById('restart-btn');
const answerInput = document.getElementById('answer-input');
const feedback = document.getElementById('feedback');
const hintDisplay = document.getElementById('hint-display');
const hintsRemainingDisplay = document.getElementById('hints-remaining');

// Initialize Game
function init() {
    startBtn.addEventListener('click', startGame);
    submitBtn.addEventListener('click', checkAnswer);
    hintBtn.addEventListener('click', giveHint);
    restartBtn.addEventListener('click', restartGame);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    // Add click listeners to Polybius grid cells
    const cells = document.querySelectorAll('#polybius-grid td[data-letter]');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const letter = cell.dataset.letter;
            answerInput.value += letter;
            cell.classList.add('highlighted');
            setTimeout(() => cell.classList.remove('highlighted'), 300);
        });
    });
}

// Start Game
function startGame() {
    currentMission = 0;
    score = 0;
    hintsUsed = 0;
    hintsRemaining = 3;
    missionResults = [];

    startScreen.classList.remove('active');
    gameScreen.classList.add('active');

    loadMission();
}

// Load Current Mission
function loadMission() {
    const mission = missions[currentMission];

    document.getElementById('mission-number').textContent = `Mission ${currentMission + 1}/${missions.length}`;
    document.getElementById('score-display').textContent = `Score: ${score}`;
    document.getElementById('mission-title').textContent = mission.title;
    document.getElementById('mission-story').textContent = mission.story;
    document.getElementById('coded-text').textContent = mission.coded;

    answerInput.value = '';
    hintDisplay.textContent = '';
    hintsRemainingDisplay.textContent = `Indices restants: ${hintsRemaining}`;
    hintBtn.disabled = hintsRemaining <= 0;

    feedback.classList.remove('show', 'success', 'error');
}

// Give Hint
function giveHint() {
    if (hintsRemaining <= 0) return;

    const mission = missions[currentMission];
    const answer = mission.answer;
    const currentHint = hintDisplay.textContent.replace(/\s/g, '').replace(/_/g, '');
    const revealIndex = currentHint.length;

    if (revealIndex < answer.length) {
        let hintText = '';
        for (let i = 0; i < answer.length; i++) {
            if (i <= revealIndex) {
                hintText += answer[i] + ' ';
            } else {
                hintText += '_ ';
            }
        }
        hintDisplay.textContent = hintText.trim();

        hintsRemaining--;
        hintsUsed++;
        hintsRemainingDisplay.textContent = `Indices restants: ${hintsRemaining}`;
        hintBtn.disabled = hintsRemaining <= 0;
    }
}

// Check Answer
function checkAnswer() {
    const mission = missions[currentMission];
    const userAnswer = answerInput.value.toUpperCase().replace(/\s/g, '');
    const correctAnswer = mission.answer;

    if (userAnswer === correctAnswer) {
        // Calculate points (100 base, -20 per hint used for this mission)
        const missionHintsUsed = 3 - hintsRemaining;
        const points = Math.max(100 - (missionHintsUsed * 20), 40);
        score += points;

        feedback.textContent = mission.success + ` (+${points} points)`;
        feedback.className = 'feedback show success';

        missionResults.push({
            title: mission.title,
            success: true,
            points: points
        });

        // Reset hints for next mission
        hintsRemaining = 3;

        setTimeout(() => {
            currentMission++;
            if (currentMission < missions.length) {
                loadMission();
            } else {
                showResults();
            }
        }, 2500);
    } else {
        feedback.textContent = mission.failure + " Essaie encore!";
        feedback.className = 'feedback show error';
        answerInput.classList.add('pulse');
        setTimeout(() => answerInput.classList.remove('pulse'), 500);
    }
}

// Helper function to create summary item element
function createSummaryItem(index, title, points, success) {
    const div = document.createElement('div');
    div.className = `summary-item ${success ? 'success' : 'failed'}`;

    const statusIcon = success ? '[OK]' : '[X]';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = `${statusIcon} Mission ${index + 1}: ${title}`;

    const pointsSpan = document.createElement('span');
    pointsSpan.textContent = `${points} pts`;

    div.appendChild(titleSpan);
    div.appendChild(pointsSpan);

    return div;
}

// Show Results
function showResults() {
    gameScreen.classList.remove('active');
    resultScreen.classList.add('active');

    // Calculate rank based on score
    const maxScore = missions.length * 100;
    const percentage = (score / maxScore) * 100;
    let rank, rankEmoji;

    if (percentage >= 90) {
        rank = "Agent Legendaire";
        rankEmoji = "Excellent!";
    } else if (percentage >= 70) {
        rank = "Agent Elite";
        rankEmoji = "Tres bien!";
    } else if (percentage >= 50) {
        rank = "Agent Confirme";
        rankEmoji = "Bien!";
    } else if (percentage >= 30) {
        rank = "Agent Junior";
        rankEmoji = "Continue!";
    } else {
        rank = "Agent Debutant";
        rankEmoji = "A ameliorer";
    }

    document.getElementById('final-rank').textContent = rank;
    document.getElementById('final-score').textContent = `Score final: ${score}/${maxScore} points (${Math.round(percentage)}%) - ${rankEmoji}`;

    // Build summary using safe DOM methods
    const summary = document.getElementById('missions-summary');
    summary.textContent = ''; // Clear previous content

    const heading = document.createElement('h3');
    heading.textContent = 'Resume des Missions:';
    summary.appendChild(heading);

    // Add completed missions
    missionResults.forEach((result, index) => {
        const item = createSummaryItem(index, result.title, result.points, result.success);
        summary.appendChild(item);
    });

    // Add any incomplete missions
    for (let i = missionResults.length; i < missions.length; i++) {
        const item = createSummaryItem(i, missions[i].title, 0, false);
        summary.appendChild(item);
    }
}

// Restart Game
function restartGame() {
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
