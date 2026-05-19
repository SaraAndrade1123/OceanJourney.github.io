/**
 * Ocean Journey - Multilayer Logic & Slider Quiz Engine
 * SENA 2026
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. WELCOME SCREEN CONTROLLER
    // ==========================================================================
    const startBtn = document.getElementById("start-journey-btn");
    const welcomeScreen = document.getElementById("welcome-screen");
    const mainContent = document.getElementById("main-project-content");

    if (startBtn && welcomeScreen && mainContent) {
        startBtn.addEventListener("click", () => {
            mainContent.classList.remove("hidden-content");
            welcomeScreen.classList.add("fade-out");
            setTimeout(() => {
                welcomeScreen.style.display = "none";
            }, 800);
        });
    }

    // ==========================================================================
    // 2. SCROLL PROGRESS INDICATOR
    // ==========================================================================
    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const progressBar = document.getElementById("myBar");
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    });

    // ==========================================================================
    // 3. LIVE SEARCH FILTER
    // ==========================================================================
    const searchInput = document.getElementById('speciesSearch');
    if (searchInput) {
        searchInput.addEventListener("keyup", () => {
            const input = searchInput.value.toLowerCase();
            const cards = document.getElementsByClassName('flip-card');
            
            for (let i = 0; i < cards.length; i++) {
                const strongElement = cards[i].querySelector('strong');
                if (strongElement) {
                    const animalName = strongElement.textContent.toLowerCase();
                    if (input === "") {
                        cards[i].style.display = "";
                        cards[i].style.opacity = "1";
                    } else if (animalName.includes(input)) {
                        cards[i].style.display = "";
                        cards[i].style.opacity = "1";
                    } else {
                        cards[i].style.opacity = "0.15";
                    }
                }
            }
        });
    }

    // ==========================================================================
    // 4. STEP-BY-STEP SLIDER QUIZ LOGIC & RESULTS ENGINE
    // ==========================================================================
    let currentStep = 1;
    const cards = document.querySelectorAll('.quiz-card');
    const totalQuestions = cards.length;
    
    const prevBtn = document.getElementById('prev-question-btn');
    const nextBtn = document.getElementById('next-question-btn');
    const questionsWrapper = document.getElementById('quiz-questions-wrapper');
    const navigationControls = document.getElementById('quiz-navigation-controls');
    const scoreboard = document.getElementById('scoreboard');

    // Object state tracker to save answers per step
    let quizState = {
        userScore: 0,
        answeredCount: 0,
        selections: {} // Keeps map of step: { isCorrect }
    };

    function updateNavigationState() {
        if (currentStep === 1) {
            prevBtn.disabled = true;
        } else {
            prevBtn.disabled = false;
        }

        if (currentStep === totalQuestions) {
            nextBtn.textContent = "Finish Evaluation 🏁";
        } else {
            nextBtn.textContent = "Next →";
        }
    }

    function showStep(stepNumber) {
        cards.forEach(card => {
            card.classList.remove('active');
            if (parseInt(card.getAttribute('data-step')) === stepNumber) {
                card.classList.add('active');
            }
        });
        updateNavigationState();
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalQuestions) {
            currentStep++;
            showStep(currentStep);
        } else {
            renderFinalScoreboard();
        }
    });

    const quizButtons = document.querySelectorAll('.quiz-btn');
    quizButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const clickedButton = e.target;
            const currentCard = clickedButton.closest('.quiz-card');
            const step = parseInt(currentCard.getAttribute('data-step'));
            const feedback = currentCard.querySelector('.feedback-text');
            const allButtons = currentCard.querySelectorAll('.quiz-btn');
            const isCorrect = clickedButton.getAttribute('data-correct') === "true";

            if (quizState.selections[step]) return;

            allButtons.forEach(btn => btn.disabled = true);

            quizState.answeredCount++;
            if (isCorrect) {
                quizState.userScore++;
                clickedButton.classList.add('selected-correct');
                feedback.textContent = "Correct answer! 🎉";
                feedback.style.color = "#2a9d8f";
            } else {
                clickedButton.classList.add('selected-incorrect');
                feedback.textContent = "Incorrect answer! ❌";
                feedback.style.color = "#e63946";
            }

            quizState.selections[step] = {
                isCorrect: isCorrect
            };
        });
    });

    function renderFinalScoreboard() {
        questionsWrapper.classList.add('hidden-content');
        navigationControls.classList.add('hidden-content');

        let scorePercentage = Math.round((quizState.userScore / totalQuestions) * 100);
        let averageBenchmark = 60; 
        let overAverage = scorePercentage >= averageBenchmark;

        let statusTitle = "";
        let learningRecommendation = "";

        if (scorePercentage === 100) {
            statusTitle = "Absolute Ocean Master! 🌟🐋";
            learningRecommendation = "Outstanding! You possess an above-average knowledge about deep-sea marine ecosystems. Your English technical vocabulary level is perfect. Keep exploring advanced oceanographies!";
        } else if (scorePercentage >= 60) {
            statusTitle = "Above the Average! 👍⚓";
            learningRecommendation = "Great work! You scored above the academic average. You understand basic structures of the Sunlight, Twilight, and Trenches modules. To achieve perfection, review specific bioluminescent species in the Midnight layer.";
        } else {
            statusTitle = "Needs Improvement! 🧭💧";
            learningRecommendation = "Do not worry! Mistakes are steps to learn. Your profile shows minor vocabulary confusions across deeper layers (The Abyss and Midnight Zone). We recommend scrolling back up, interacting with the animal cards, and trying again!";
        }

        scoreboard.innerHTML = `
            <h3>Evaluation Results</h3>
            
            <div class="metrics-grid">
                <div class="metric-box">
                    <span>Final Score</span>
                    <strong>${quizState.userScore} / ${totalQuestions}</strong>
                </div>
                <div class="metric-box">
                    <span>Performance</span>
                    <strong>${scorePercentage}%</strong>
                </div>
                <div class="metric-box">
                    <span>Questions Answered</span>
                    <strong>${quizState.answeredCount} / ${totalQuestions}</strong>
                </div>
                <div class="metric-box">
                    <span>Academic Status</span>
                    <strong style="font-size:1.1rem; color: ${overAverage ? '#2a9d8f' : '#e63946'};">
                        ${overAverage ? 'ABOVE AVERAGE' : 'BELOW AVERAGE'}
                    </strong>
                </div>
            </div>

            <div class="feedback-evaluation-box" style="border-left-color: ${overAverage ? '#2a9d8f' : '#e63946'};">
                <h4>${statusTitle}</h4>
                <p>${learningRecommendation}</p>
            </div>

            <button id="restart-quiz-btn" class="quiz-btn" style="margin-top:25px; border-color:#2a9d8f; background: rgba(42,157,143,0.15);">
                Try the Quiz Again 🔄
            </button>
        `;

        scoreboard.classList.remove('hidden-content');

        document.getElementById('restart-quiz-btn').addEventListener('click', () => {
            location.reload(); 
        });
    }

});