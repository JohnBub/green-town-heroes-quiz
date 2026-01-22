const U3Quiz = (function () {
    'use strict';

    // ========== STATE ==========
    let state = {
        currentQuestion: 1,
        totalQuestions: 15,
        answers: {},
        checked: {},
    };

    let dom = {};

    function init() {
        // ========== DOM REFERENCES ==========
        dom.container = document.getElementById('u3-green-town-quiz-container');
        if (!dom.container) {
            console.warn('U3Quiz: Container not found. Init aborted.');
            return;
        }
        dom.resultsSlide = document.getElementById('u3slide-results');
        dom.counterEl = document.getElementById('u3slide-counter');
        dom.progressFill = document.getElementById('u3slide-progress-fill');

        // Initialize UI
        updateCounter();
        updateProgress();
        attachEvents();
        console.log('U3Quiz: Initialized');
    }

    // ========== HELPER FUNCTIONS ==========
    function updateCounter() {
        if (!dom.counterEl) return;
        let text = `Question ${state.currentQuestion} / ${state.totalQuestions}`;
        if (dom.container.classList.contains('u3slide-review-mode')) {
            text = `Review: ${state.currentQuestion} / ${state.totalQuestions}`;
        }
        dom.counterEl.textContent = text;
    }

    function updateProgress() {
        if (!dom.progressFill) return;
        const percent = (state.currentQuestion / state.totalQuestions) * 100;
        dom.progressFill.style.width = percent + '%';
    }

    function showSlide(num) {
        if (!dom.container) return;

        const slides = dom.container.querySelectorAll('.u3slide-question');
        slides.forEach(function (slide) {
            slide.classList.remove('u3slide-active');
        });
        if (dom.resultsSlide) dom.resultsSlide.classList.remove('u3slide-active');

        if (num > state.totalQuestions) {
            showResults();
        } else {
            const targetSlide = dom.container.querySelector(`.u3slide-question[data-id="${num}"]`);
            if (targetSlide) {
                targetSlide.classList.add('u3slide-active');
            }
            state.currentQuestion = num;
            updateCounter();
            updateProgress();
        }
    }

    function showResults() {
        if (dom.resultsSlide) dom.resultsSlide.classList.add('u3slide-active');

        // Calculate score
        let correctCount = 0;
        for (let i = 1; i <= state.totalQuestions; i++) {
            const slide = dom.container.querySelector(`.u3slide-question[data-id="${i}"]`);
            if (!slide) continue;
            const correctAnswer = slide.getAttribute('data-answer');
            if (state.answers[i] === correctAnswer) {
                correctCount++;
            }
        }

        const percent = Math.round((correctCount / state.totalQuestions) * 100);
        let emoji = '😢';
        let message = '';

        if (percent >= 90) {
            emoji = '🏆';
            message = 'Excellent! You\'re an environment expert! / Excellent ! Tu es un expert de l\'environnement !';
        } else if (percent >= 70) {
            emoji = '🌟';
            message = 'Great work! You know your vocabulary well! / Bravo ! Tu connais bien le vocabulaire !';
        } else if (percent >= 50) {
            emoji = '👍';
            message = 'Good effort! Review and try again. / Bon effort ! Révise et réessaie.';
        } else if (percent >= 30) {
            emoji = '📚';
            message = 'Keep studying! You can improve. / Continue à étudier ! Tu peux t\'améliorer.';
        } else {
            emoji = '💪';
            message = 'Don\'t give up! Study the vocabulary and try again. / N\'abandonne pas ! Étudie le vocabulaire et réessaie.';
        }

        document.getElementById('u3slide-results-emoji').textContent = emoji;
        document.getElementById('u3slide-results-score').textContent = `${correctCount} / ${state.totalQuestions} (${percent}%)`;
        document.getElementById('u3slide-results-message').textContent = message;

        if (dom.counterEl) dom.counterEl.textContent = 'Results / Résultats';
        if (dom.progressFill) dom.progressFill.style.width = '100%';
    }

    function findSlideFromButton(btn) {
        let node = btn;
        while (node) {
            if (node.classList && node.classList.contains('u3slide-question')) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    function handleChoiceClick(e) {
        const btn = e.currentTarget;
        const slide = findSlideFromButton(btn);
        if (!slide) return;

        const questionId = slide.getAttribute('data-id');
        if (state.checked[questionId]) return; // Already checked

        // Deselect others
        const siblings = slide.querySelectorAll('.u3slide-choice');
        siblings.forEach(function (sib) {
            sib.classList.remove('u3slide-selected');
        });

        // Select this one
        btn.classList.add('u3slide-selected');
        state.answers[questionId] = btn.getAttribute('data-option');
    }

    function handleCheckAnswer(questionId) {
        const slide = dom.container.querySelector(`.u3slide-question[data-id="${questionId}"]`);
        if (!slide) return;

        const correctAnswer = slide.getAttribute('data-answer');
        const feedbackText = slide.getAttribute('data-feedback');
        const feedback = document.getElementById(`u3slide-feedback-${questionId}`);
        const buttons = slide.querySelectorAll('.u3slide-choice');
        const userAnswer = state.answers[questionId];
        const checkBtn = document.getElementById(`u3slide-check-${questionId}`);
        const nextBtn = document.getElementById(`u3slide-next-${questionId}`);

        if (!userAnswer) {
            if (feedback) {
                feedback.innerHTML = '⚠️ Please select an answer first! / Sélectionne une réponse d\'abord !';
                feedback.classList.remove('u3slide-success');
                feedback.classList.add('u3slide-show', 'u3slide-error');
            }
            return;
        }

        state.checked[questionId] = true;
        if (checkBtn) checkBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = false;

        buttons.forEach(function (btn) {
            const opt = btn.getAttribute('data-option');
            btn.disabled = true;

            if (opt === correctAnswer) {
                btn.classList.add('u3slide-correct-choice');
            } else if (opt === userAnswer && userAnswer !== correctAnswer) {
                btn.classList.add('u3slide-wrong-choice');
            }
        });

        if (feedback) {
            if (userAnswer === correctAnswer) {
                feedback.innerHTML = `✅ Correct! ${feedbackText}`;
                feedback.classList.remove('u3slide-error');
                feedback.classList.add('u3slide-show', 'u3slide-success');
            } else {
                feedback.innerHTML = `❌ Incorrect. The answer is <strong>${correctAnswer}</strong>. ${feedbackText}`;
                feedback.classList.remove('u3slide-success');
                feedback.classList.add('u3slide-show', 'u3slide-error');
            }
        }
    }

    function resetQuiz() {
        state.currentQuestion = 1;
        state.answers = {};
        state.checked = {};
        if (dom.container) dom.container.classList.remove('u3slide-review-mode');

        const slides = dom.container.querySelectorAll('.u3slide-question');
        slides.forEach(function (slide) {
            const questionId = slide.getAttribute('data-id');
            const feedback = document.getElementById(`u3slide-feedback-${questionId}`);
            const buttons = slide.querySelectorAll('.u3slide-choice');
            const checkBtn = document.getElementById(`u3slide-check-${questionId}`);
            const nextBtn = document.getElementById(`u3slide-next-${questionId}`);

            if (feedback) {
                feedback.classList.remove('u3slide-show', 'u3slide-success', 'u3slide-error');
                feedback.innerHTML = '';
            }

            buttons.forEach(function (btn) {
                btn.classList.remove('u3slide-selected', 'u3slide-correct-choice', 'u3slide-wrong-choice');
                btn.disabled = false;
            });

            if (checkBtn) checkBtn.disabled = false;
            if (nextBtn) nextBtn.disabled = true;
        });

        showSlide(1);
    }

    // ========== ATTACH DIRECT LISTENERS ==========
    function attachEvents() {
        if (!dom.container) return;

        // 1. Choices
        const choices = dom.container.querySelectorAll('.u3slide-choice');
        choices.forEach(function (btn) {
            // Remove old just in case? Usually not needed if refreshing but good practice
            // We just add new ones assuming init runs once or on fresh DOM
            btn.addEventListener('click', handleChoiceClick); // Using onclick property as simple direct assignment
        });

        // 2. Control Buttons
        // We'll iterate all questions to find specific buttons
        for (let i = 1; i <= state.totalQuestions; i++) {

            // Check button
            const checkBtn = document.getElementById(`u3slide-check-${i}`);
            if (checkBtn) {
                checkBtn.addEventListener('click', function () { handleCheckAnswer(i); });
            }

            // Next button
            const nextBtn = document.getElementById(`u3slide-next-${i}`);
            if (nextBtn) {
                nextBtn.addEventListener('click', function () { showSlide(i + 1); });
            }

            // Prev button
            const prevBtn = document.getElementById(`u3slide-prev-${i}`);
            if (prevBtn) {
                prevBtn.addEventListener('click', function () { showSlide(i - 1); });
            }
        }

        // 3. Review / Restart
        const reviewBtn = document.getElementById('u3slide-review-btn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', function () {
                if (dom.container) dom.container.classList.add('u3slide-review-mode');
                showSlide(1);
            });
        }

        const restartBtn = document.getElementById('u3slide-restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', resetQuiz);
        }
    }

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        init: init,
        reset: resetQuiz
    };

})();
