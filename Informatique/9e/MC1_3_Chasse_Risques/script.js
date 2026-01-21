document.addEventListener('DOMContentLoaded', () => {
    let foundCount = 0;
    let errorCount = 0;
    const totalRisks = 7;

    const nodes = document.querySelectorAll('.network-node');
    const foundCountEl = document.getElementById('foundCount');
    const errorCountEl = document.getElementById('errorCount');
    const feedbackEl = document.getElementById('feedback');
    const victoryModal = document.getElementById('victoryModal');
    const finalErrorsEl = document.getElementById('finalErrors');
    const restartBtn = document.getElementById('restartBtn');

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            // Skip if already processed
            if (node.classList.contains('found') || node.classList.contains('safe-clicked')) {
                return;
            }

            const isRisk = node.dataset.risk === 'true';

            if (isRisk) {
                // Correct - found a risk!
                node.classList.add('found');
                foundCount++;
                foundCountEl.textContent = foundCount;

                // Show explanation
                const explanation = node.querySelector('.risk-explanation');
                if (explanation) {
                    explanation.classList.remove('hidden');
                }

                showFeedback(`Bien vu ! ${node.querySelector('.node-label').textContent} présente un risque.`, 'success');

                // Check for victory
                if (foundCount === totalRisks) {
                    setTimeout(showVictory, 1000);
                }
            } else {
                // Wrong - clicked on a safe element
                node.classList.add('wrong', 'safe-clicked');
                errorCount++;
                errorCountEl.textContent = errorCount;

                showFeedback(`❌ ${node.querySelector('.node-label').textContent} est généralement sûr si ton appareil est bien protégé.`, 'error');

                setTimeout(() => {
                    node.classList.remove('wrong');
                }, 500);
            }
        });
    });

    function showFeedback(message, type) {
        feedbackEl.textContent = message;
        feedbackEl.className = `feedback ${type}`;
        feedbackEl.classList.remove('hidden');

        setTimeout(() => {
            feedbackEl.classList.add('hidden');
        }, 3000);
    }

    function showVictory() {
        finalErrorsEl.textContent = errorCount;
        victoryModal.classList.remove('hidden');
    }

    restartBtn.addEventListener('click', () => {
        // Reset all state
        foundCount = 0;
        errorCount = 0;
        foundCountEl.textContent = '0';
        errorCountEl.textContent = '0';

        // Reset all nodes
        nodes.forEach(node => {
            node.classList.remove('found', 'wrong', 'safe-clicked');
            const explanation = node.querySelector('.risk-explanation');
            if (explanation) {
                explanation.classList.add('hidden');
            }
        });

        // Hide modal and feedback
        victoryModal.classList.add('hidden');
        feedbackEl.classList.add('hidden');
    });
});
